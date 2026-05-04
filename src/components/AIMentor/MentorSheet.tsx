import { useAIMentor } from '@/src/hooks/useAIMentor';
import { SUGGESTED_PROMPTS } from '@/src/services';
import { Colors, Icon } from '@/src/theme';
import { FONTS, FontSize } from '@/src/theme/fonts';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../common';
import { MentorMessage } from './MentorMessage';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.82;

export const MentorSheet: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    isOpen,
    messages,
    isStreaming,
    streamingContent,
    error,
    close,
    clear,
    sendMessage,
  } = useAIMentor();

  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // ── Animate sheet in/out ───────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start(() => {
        inputRef.current?.focus();
      });
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SHEET_HEIGHT,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  // ── Auto-scroll to bottom on new messages ──────────────────────────────
  useEffect(() => {
    if (messages.length > 0 || streamingContent) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 80);
    }
  }, [messages.length, streamingContent]);

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text || isStreaming) return;
    setInputText('');
    sendMessage(text);
  }, [inputText, isStreaming, sendMessage]);

  const handleSuggestedPrompt = useCallback(
    (prompt: string) => {
      if (isStreaming) return;
      sendMessage(prompt);
    },
    [isStreaming, sendMessage],
  );

  const showSuggestions = messages.length === 0 && !isStreaming;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={close}
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={close}>
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
        />
      </TouchableWithoutFeedback>

      {/* Sheet */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kavContainer}
        pointerEvents="box-none"
      >
        <Animated.View
          style={[
            styles.sheet,
            { height: SHEET_HEIGHT, paddingBottom: insets.bottom + 8 },
            { transform: [{ translateY }] },
          ]}
        >
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.mentorBadge}>
                <AppText style={styles.mentorEmoji}>🎓</AppText>
              </View>
              <View>
                <AppText variant="h4" style={styles.headerTitle}>
                  AI Mentor
                </AppText>
                <View style={styles.statusRow}>
                  <View
                    style={[
                      styles.statusDot,
                      isStreaming && styles.statusDotActive,
                    ]}
                  />
                  <AppText variant="caption" color={Colors.textMuted}>
                    {isStreaming ? 'Thinking...' : 'Online'}
                  </AppText>
                </View>
              </View>
            </View>

            <View style={styles.headerActions}>
              {messages.length > 0 && (
                <TouchableOpacity
                  onPress={clear}
                  style={styles.headerBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Icon
                    name="refresh-outline"
                    size={18}
                    color={Colors.textMuted}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={close}
                style={styles.headerBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Icon
                  name="close-outline"
                  size={22}
                  color={Colors.textPrimary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Messages area */}
          <ScrollView
            ref={scrollRef}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Empty state */}
            {showSuggestions && (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconBg}>
                  <AppText style={styles.emptyIcon}>🎓</AppText>
                </View>
                <AppText variant="h4" align="center" style={styles.emptyTitle}>
                  Your AI Learning Mentor
                </AppText>
                <AppText
                  variant="bodySm"
                  align="center"
                  color={Colors.textSecondary}
                  style={styles.emptySubtitle}
                >
                  I know your courses, bookmarks, and enrollments.
                  Ask me anything about your learning journey.
                </AppText>

                {/* Suggested prompts */}
                <View style={styles.suggestions}>
                  {SUGGESTED_PROMPTS.map((prompt, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.suggestionChip}
                      onPress={() => handleSuggestedPrompt(prompt)}
                      activeOpacity={0.75}
                    >
                      <AppText variant="bodySm" style={styles.suggestionText}>
                        {prompt}
                      </AppText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Message bubbles */}
            {messages.map((msg) => (
              <MentorMessage
                key={msg.id}
                role={msg.role as 'user' | 'assistant'}
                content={msg.content}
              />
            ))}

            {/* Streaming bubble */}
            {isStreaming && streamingContent && (
              <MentorMessage
                role="assistant"
                content={streamingContent}
                isStreaming
              />
            )}

            {/* Typing indicator — shown when streaming starts but no content yet */}
            {isStreaming && !streamingContent && (
              <View style={styles.typingRow}>
                <View style={styles.avatarContainer}>
                  <AppText style={styles.avatarEmoji}>🎓</AppText>
                </View>
                <View style={styles.typingBubble}>
                  <TypingDots />
                </View>
              </View>
            )}

            {/* Error */}
            {error && (
              <View style={styles.errorBubble}>
                <Icon
                  name="alert-circle-outline"
                  size={14}
                  color={Colors.error}
                />
                <AppText variant="caption" style={styles.errorText}>
                  {error}
                </AppText>
              </View>
            )}
          </ScrollView>

          {/* Input area */}
          <View style={styles.inputArea}>
            <View style={styles.inputRow}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask your mentor anything..."
                placeholderTextColor={Colors.textMuted}
                multiline
                maxLength={500}
                returnKeyType="send"
                onSubmitEditing={handleSend}
                blurOnSubmit={false}
                editable={!isStreaming}
              />
              <TouchableOpacity
                style={[
                  styles.sendBtn,
                  (!inputText.trim() || isStreaming) && styles.sendBtnDisabled,
                ]}
                onPress={handleSend}
                disabled={!inputText.trim() || isStreaming}
                activeOpacity={0.8}
              >
                <Icon
                  name="arrow-forward-outline"
                  size={18}
                  color={
                    !inputText.trim() || isStreaming
                      ? Colors.textMuted
                      : Colors.textInverse
                  }
                />
              </TouchableOpacity>
            </View>
            <AppText variant="caption" style={styles.disclaimer}>
              AI responses are suggestions only. Verify before enrolling.
            </AppText>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ─── Typing dots animation ────────────────────────────────────────────────────
const TypingDots: React.FC = () => {
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const animations = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(dot, {
            toValue: -6,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.delay(600),
        ]),
      ),
    );
    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, []);

  return (
    <View style={styles.dotsRow}>
      {dots.map((dot, i) => (
        <Animated.View
          key={i}
          style={[styles.dot, { transform: [{ translateY: dot }] }]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  kavContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    // shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 24,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mentorBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mentorEmoji: { fontSize: 22 },
  headerTitle: { marginBottom: 2 },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.success,
  },
  statusDotActive: {
    backgroundColor: Colors.accent,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.inputBackground,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingTop: 16,
    paddingBottom: 8,
    flexGrow: 1,
  },
  // ── Empty state ───────────────────────────────────────────────────────
  emptyState: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 10,
  },
  emptyIconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyIcon: { fontSize: 36 },
  emptyTitle: { color: Colors.textPrimary },
  emptySubtitle: {
    lineHeight: FontSize.sm * 1.6,
    textAlign: 'center',
  },
  suggestions: {
    width: '100%',
    gap: 8,
    marginTop: 8,
  },
  suggestionChip: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'flex-start',
  },
  suggestionText: {
    color: Colors.textPrimary,
    fontFamily: FONTS.REGULAR,
  },
  // ── Typing indicator ──────────────────────────────────────────────────
  typingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 16 },
  typingBubble: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    height: 14,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.textMuted,
  },
  // ── Error ─────────────────────────────────────────────────────────────
  errorBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.errorLight,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.borderError,
  },
  errorText: {
    color: Colors.error,
    flex: 1,
    fontFamily: FONTS.MEDIUM,
  },
  // ── Input area ────────────────────────────────────────────────────────
  inputArea: {
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: 6,
    backgroundColor: Colors.surface,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    backgroundColor: Colors.inputBackground,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.REGULAR,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    maxHeight: 100,
    paddingTop: 6,
    paddingBottom: 6,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: Colors.inputBackground,
  },
  disclaimer: {
    textAlign: 'center',
    color: Colors.textMuted,
  },
});
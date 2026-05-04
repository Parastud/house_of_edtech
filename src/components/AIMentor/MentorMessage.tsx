import { Colors } from '@/src/theme';
import { FONTS, FontSize } from '@/src/theme/fonts';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { AppText } from '../common';

interface MentorMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

// Blinking cursor shown at end of streaming message
const StreamingCursor: React.FC = () => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.Text style={[styles.cursor, { opacity }]}>▋</Animated.Text>
  );
};

export const MentorMessage: React.FC<MentorMessageProps> = ({
  role,
  content,
  isStreaming = false,
}) => {
  const isUser = role === 'user';

  // Slide in animation on mount
  const translateY = useRef(new Animated.Value(12)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 120,
        friction: 10,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.row,
        isUser ? styles.rowUser : styles.rowAssistant,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      {/* Avatar — only for assistant */}
      {!isUser && (
        <View style={styles.avatarContainer}>
          <AppText style={styles.avatarEmoji}>🎓</AppText>
        </View>
      )}

      {/* Bubble */}
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleAssistant,
        ]}
      >
        <AppText
          variant="body"
          style={[
            styles.text,
            isUser ? styles.textUser : styles.textAssistant,
          ]}
        >
          {content}
          {isStreaming && <StreamingCursor />}
        </AppText>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  rowAssistant: {
    justifyContent: 'flex-start',
    gap: 8,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  avatarEmoji: {
    fontSize: 16,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    // subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    lineHeight: FontSize.base * 1.55,
  },
  textUser: {
    color: Colors.textInverse,
    fontFamily: FONTS.REGULAR,
  },
  textAssistant: {
    color: Colors.textPrimary,
    fontFamily: FONTS.REGULAR,
  },
  cursor: {
    color: Colors.primary,
    fontFamily: FONTS.BOLD,
  },
});
import { useAIMentor } from '@/src/hooks/useAIMentor';
import { Colors, FONTS } from '@/src/theme';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { AppText } from '../common';

export const MentorFAB: React.FC = () => {
  const { open, isOpen, messages } = useAIMentor();

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.6)).current;

  // ── Entrance animation ─────────────────────────────────────────────────
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 80,
      friction: 8,
      delay: 600,
    }).start();
  }, []);

  // ── Pulse ring — draws attention, stops after first message sent ───────
  useEffect(() => {
    if (messages.length > 0 || isOpen) return;

    const pulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.6,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, {
            toValue: 0,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.6,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [messages.length, isOpen]);

  const handlePress = () => {
    // Bounce on tap
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.88,
        useNativeDriver: true,
        tension: 200,
        friction: 5,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 5,
      }),
    ]).start();
    open();
  };

  if (isOpen) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Pulse ring */}
      {messages.length === 0 && (
        <Animated.View
          style={[
            styles.pulseRing,
            {
              transform: [{ scale: pulseAnim }],
              opacity: pulseOpacity,
            },
          ]}
        />
      )}

      {/* FAB button */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.fab}
          onPress={handlePress}
          activeOpacity={0.9}
        >
          <AppText style={styles.fabEmoji}>🎓</AppText>

          {/* Message count badge */}
          {messages.length > 0 && (
            <View style={styles.badge}>
              <AppText style={styles.badgeText}>
                {messages.filter((m) => m.role === 'assistant').length}
              </AppText>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 88, // sits above the tab bar (tab bar is ~72px)
    right: 20,
    alignItems: 'center',
    zIndex: 1000,
  },
  pulseRing: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    zIndex: -1,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    // shadow
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  fabEmoji: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.accent,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  badgeText: {
    color: Colors.textInverse,
    fontSize: 10,
    fontFamily: FONTS.BOLD,
  },
  label: {
    position: 'absolute',
    right: 64,
    top: 16,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    // pointer arrow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  labelText: {
    color: Colors.textInverse,
    fontFamily: FONTS.SEMIBOLD,
    fontSize: 12,
  },
});
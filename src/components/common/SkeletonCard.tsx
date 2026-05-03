import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Colors } from '../../theme/colors';

const Shimmer: React.FC<{ style?: object }> = ({ style }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={[styles.shimmer, style, { opacity }]}
    />
  );
};

export const SkeletonCard: React.FC = () => (
  <View style={styles.card}>
    {/* Thumbnail */}
    <Shimmer style={styles.thumbnail} />

    <View style={styles.body}>
      {/* Category badge */}
      <Shimmer style={styles.badge} />
      {/* Title */}
      <Shimmer style={styles.titleLine} />
      <Shimmer style={[styles.titleLine, { width: '65%' }]} />
      {/* Instructor row */}
      <View style={styles.instructorRow}>
        <Shimmer style={styles.avatar} />
        <Shimmer style={styles.instructorName} />
      </View>
      {/* Rating + price */}
      <View style={styles.statsRow}>
        <Shimmer style={styles.stat} />
        <Shimmer style={styles.stat} />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    overflow: 'hidden',
    // shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  shimmer: {
    backgroundColor: Colors.skeleton,
    borderRadius: 6,
  },
  thumbnail: {
    height: 180,
    borderRadius: 0,
    width: '100%',
  },
  body: {
    padding: 14,
    gap: 10,
  },
  badge: {
    height: 20,
    width: 80,
    borderRadius: 20,
  },
  titleLine: {
    height: 16,
    width: '90%',
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  instructorName: {
    height: 14,
    width: 120,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    height: 14,
    width: 60,
  },
});
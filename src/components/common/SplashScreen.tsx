import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';
import { AppText } from './AppText';

interface CustomSplashProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<CustomSplashProps> = ({ onFinish }) => {
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-finish after 2 seconds
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeInAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onFinish());
    }, 2000);

    return () => clearTimeout(timer);
  }, [fadeInAnim, scaleAnim, onFinish]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeInAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo / Branding Section */}
        <View style={styles.brandingSection}>
          <View style={styles.logoCircle}>
            <AppText variant="h1" style={styles.logoText}>
              📚
            </AppText>
          </View>
          <AppText variant="h1" style={styles.brandName}>
            House of EdTech
          </AppText>
          <AppText variant="bodySm" style={styles.tagline}>
            Learn, Grow, Succeed
          </AppText>
        </View>

        {/* Loading Indicator */}
        <View style={styles.loaderSection}>
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={styles.loader}
          />
          <AppText variant="bodySm" style={styles.loadingText}>
            Initializing...
          </AppText>
        </View>
      </Animated.View>

      {/* Background accent elements */}
      <View style={styles.decorativeBlob1} />
      <View style={styles.decorativeBlob2} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  brandingSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    // Shadow
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logoText: {
    fontSize: 48,
  },
  brandName: {
    color: Colors.textPrimary,
    marginBottom: 8,
    fontFamily: FONTS.BOLD,
  },
  tagline: {
    color: Colors.textSecondary,
    fontFamily: FONTS.MEDIUM,
    letterSpacing: 0.5,
  },
  loaderSection: {
    alignItems: 'center',
    marginTop: 32,
  },
  loader: {
    marginBottom: 16,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontFamily: FONTS.MEDIUM,
  },
  decorativeBlob1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.primaryLight,
    opacity: 0.1,
  },
  decorativeBlob2: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: Colors.accentLight,
    opacity: 0.08,
  },
});

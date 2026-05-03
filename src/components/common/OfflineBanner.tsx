import { useAppSelector } from '@/src/redux/hook';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';
import { Icon } from '../../theme/icons';
import { AppText } from './AppText';

export const OfflineBanner: React.FC = () => {
  const { isConnected } = useAppSelector((s) => s.network);
  const insets = useSafeAreaInsets();
  const bannerHeight = insets.top + 44;
  const translateY = useRef(new Animated.Value(-bannerHeight)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: isConnected ? -bannerHeight : 0,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  }, [isConnected, bannerHeight]);

  return (
    <Animated.View
      style={[
        styles.banner,
        {
          paddingTop: insets.top + 8,
          height: bannerHeight,
          transform: [{ translateY }],
        },
      ]}
      pointerEvents="none"
    >
      <Icon name="cloud-offline-outline" size={16} color={Colors.textInverse} />
      <AppText variant="labelSm" style={styles.text}>
        No internet connection
      </AppText>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10000,
    backgroundColor: Colors.offlineBanner,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 10,
  },
  text: {
    color: Colors.offlineBannerText,
    fontFamily: FONTS.SEMIBOLD,
  },
});
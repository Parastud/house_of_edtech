import { SNACKBAR_DURATION_MS } from '@/src/constants/app.constants';
import { useAppDispatch, useAppSelector } from '@/src/redux/hook';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hideSnackbar } from '../../redux/slices/snackbar.slice';
import { Colors } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';
import { Icon, ICON_NAMES } from '../../theme/icons';
import { AppText } from './AppText';

const TYPE_CONFIG = {
  success: {
    bg: Colors.snackbarSuccess,
    icon: ICON_NAMES.check,
  },
  error: {
    bg: Colors.snackbarError,
    icon: ICON_NAMES.alert,
  },
  info: {
    bg: Colors.snackbarInfo,
    icon: ICON_NAMES.info,
  },
} as const;

export const SnackBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { visible, message, type } = useAppSelector((s) => s.snackbar);
  const insets = useSafeAreaInsets();

  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (visible) {
      if (timerRef.current !== null) clearTimeout(timerRef.current);

      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      timerRef.current = setTimeout(() => {
        dismiss();
      }, SNACKBAR_DURATION_MS) as unknown as number;
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, message]);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => dispatch(hideSnackbar()));
  };

  if (!visible) return null;

  const config = TYPE_CONFIG[type];

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: config.bg },
        { bottom: insets.bottom + 16 },
        { transform: [{ translateY }], opacity },
      ]}
      accessibilityRole="alert"
      accessibilityLabel={`${type} notification`}
      accessibilityHint={message}
      accessible={true}
    >
      <Icon name={config.icon} size={20} color={Colors.textInverse} />
      <AppText
        variant="bodySm"
        style={styles.message}
        numberOfLines={2}
      >
        {message}
      </AppText>
      <TouchableOpacity 
        onPress={dismiss} 
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel="Dismiss notification"
        accessibilityHint="Double tap to dismiss"
      >
        <Icon name={ICON_NAMES.close} size={18} color={Colors.textInverse} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    zIndex: 9999,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    // Android
    elevation: 8,
  },
  message: {
    flex: 1,
    color: Colors.textInverse,
    fontFamily: FONTS.MEDIUM,
  },
});
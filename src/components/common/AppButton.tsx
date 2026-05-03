import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { FONTS, FontSize } from '../../theme/fonts';
import { AppText } from './AppText';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  leftIcon?: React.ReactNode;
}

export const AppButton: React.FC<AppButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = true,
  style,
  leftIcon,
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'outline' || variant === 'ghost'
              ? Colors.primary
              : Colors.textInverse
          }
        />
      ) : (
        <>
          {leftIcon}
          <AppText
            variant="label"
            style={[
              styles.labelBase,
              variant === 'outline' && { color: Colors.primary },
              variant === 'ghost' && { color: Colors.primary },
              variant === 'danger' && { color: Colors.textInverse },
              size === 'sm' && { fontSize: FontSize.sm },
              size === 'lg' && { fontSize: FontSize.md },
            ]}
          >
            {label}
          </AppText>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },

  // Variants
  primary: { backgroundColor: Colors.primary },
  secondary: { backgroundColor: Colors.primaryLight },
  outline: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  ghost: { backgroundColor: Colors.textMuted },
  danger: { backgroundColor: Colors.error },

  // Sizes — padding only, text size handled above
  sm: { paddingVertical: 8, paddingHorizontal: 16 },
  md: { paddingVertical: 14, paddingHorizontal: 20 },
  lg: { paddingVertical: 16, paddingHorizontal: 24 },

  labelBase: {
    fontFamily: FONTS.SEMIBOLD,
    color: Colors.textInverse,
  },

  // Quiet TS — transparent not in RN default colors
  transparent: {},
});

// Extend Colors to include transparent if missing
Colors.textMuted ?? (Colors as Record<string, string>).transparent;
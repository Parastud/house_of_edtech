import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { Colors } from '../../theme/colors';
import { FONTS, FontSize } from '../../theme/fonts';

// ─── Variant → style map ──────────────────────────────────────────────────────
// All typography in the app flows through AppText.
// Never set fontFamily inline in a component — use variant or weight prop.

type Variant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'bodyLg'
  | 'body'
  | 'bodySm'
  | 'caption'
  | 'label'
  | 'labelSm';

type Weight = 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';

interface AppTextProps extends TextProps {
  variant?: Variant;
  weight?: Weight;
  color?: string;
  size?: number;
  align?: 'left' | 'center' | 'right';
}

const WEIGHT_MAP: Record<Weight, string> = {
  regular: FONTS.REGULAR,
  medium: FONTS.MEDIUM,
  semibold: FONTS.SEMIBOLD,
  bold: FONTS.BOLD,
  extrabold: FONTS.EXTRABOLD,
};

export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  weight,
  color,
  size,
  align,
  style,
  children,
  ...rest
}) => {
  const variantStyle = styles[variant];

  // weight prop overrides the variant's fontFamily
  const fontFamily = weight
    ? WEIGHT_MAP[weight]
    : variantStyle.fontFamily;

  return (
    <Text
      style={[
        variantStyle,
        { fontFamily },
        color !== undefined && { color },
        size !== undefined && { fontSize: size },
        align !== undefined && { textAlign: align },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontFamily: FONTS.BOLD,
    fontSize: FontSize['3xl'],
    color: Colors.textPrimary,
    lineHeight: FontSize['3xl'] * 1.25,
  },
  h2: {
    fontFamily: FONTS.BOLD,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
    lineHeight: FontSize['2xl'] * 1.3,
  },
  h3: {
    fontFamily: FONTS.SEMIBOLD,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
    lineHeight: FontSize.xl * 1.35,
  },
  h4: {
    fontFamily: FONTS.SEMIBOLD,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    lineHeight: FontSize.lg * 1.4,
  },
  bodyLg: {
    fontFamily: FONTS.REGULAR,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: FontSize.md * 1.6,
  },
  body: {
    fontFamily: FONTS.REGULAR,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    lineHeight: FontSize.base * 1.6,
  },
  bodySm: {
    fontFamily: FONTS.REGULAR,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: FontSize.sm * 1.5,
  },
  caption: {
    fontFamily: FONTS.REGULAR,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  label: {
    fontFamily: FONTS.MEDIUM,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  labelSm: {
    fontFamily: FONTS.MEDIUM,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
});
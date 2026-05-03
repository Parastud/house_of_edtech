// ─── Font Family Names ────────────────────────────────────────────────────────
// These must match the keys used in useFonts() in your root _layout.tsx
export const Fonts = {
  fontFamily: {
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    semiBold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
    extraBold: 'Poppins-ExtraBold',
  },
} as const;

// ─── FONTS — the single export used everywhere in the app ────────────────────
// Usage: style={{ fontFamily: FONTS.BOLD }}
// Never import Fonts.fontFamily.bold directly in components — use FONTS.
export const FONTS = {
  REGULAR: Fonts.fontFamily.regular,
  MEDIUM: Fonts.fontFamily.medium,
  SEMIBOLD: Fonts.fontFamily.semiBold,
  BOLD: Fonts.fontFamily.bold,
  EXTRABOLD: Fonts.fontFamily.extraBold,
} as const;

// ─── Font Size Scale ──────────────────────────────────────────────────────────
export const FontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 36,
} as const;

// ─── Line Height Multipliers ──────────────────────────────────────────────────
export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

export type FontKey = keyof typeof FONTS;
export type FontSizeKey = keyof typeof FontSize;
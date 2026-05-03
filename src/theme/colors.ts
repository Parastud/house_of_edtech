// ─── Raw Palette ──────────────────────────────────────────────────────────────
// Never use Palette values directly in components — use Colors tokens below.
const Palette = {
  // Indigo — primary brand
  indigo50: '#EEF2FF',
  indigo100: '#E0E7FF',
  indigo200: '#C7D2FE',
  indigo300: '#A5B4FC',
  indigo400: '#818CF8',
  indigo500: '#6366F1',
  indigo600: '#4F46E5',
  indigo700: '#4338CA',
  indigo800: '#3730A3',
  indigo900: '#312E81',

  // Amber — accent / bookmark / CTA highlight
  amber50: '#FFFBEB',
  amber100: '#FEF3C7',
  amber400: '#FBBF24',
  amber500: '#F59E0B',
  amber600: '#D97706',

  // Emerald — success
  emerald50: '#ECFDF5',
  emerald500: '#10B981',
  emerald700: '#047857',

  // Rose — error
  rose50: '#FFF1F2',
  rose500: '#F43F5E',
  rose700: '#BE123C',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
} as const;

// ─── Semantic Color Tokens ────────────────────────────────────────────────────
// These are the ONLY values imported in components.
export const Colors = {
  // Backgrounds
  background: Palette.gray50,
  surface: Palette.white,
  card: Palette.white,
  cardBorder: Palette.gray100,
  inputBackground: Palette.gray50,
  skeleton: Palette.gray200,
  divider: Palette.gray100,
  overlay: 'rgba(17,24,39,0.55)',

  // Brand
  primary: Palette.indigo600,
  primaryLight: Palette.indigo100,
  primaryMid: Palette.indigo200,
  primaryDark: Palette.indigo800,
  primaryFaded: 'rgba(79,70,229,0.08)',

  // Accent
  accent: Palette.amber500,
  accentLight: Palette.amber100,

  // Text
  textPrimary: Palette.gray900,
  textSecondary: Palette.gray500,
  textMuted: Palette.gray400,
  textDisabled: Palette.gray300,
  textInverse: Palette.white,
  textOnPrimary: Palette.white,
  textLink: Palette.indigo600,

  // Border
  border: Palette.gray200,
  borderFocus: Palette.indigo500,
  borderError: Palette.rose500,

  // Status
  success: Palette.emerald500,
  successLight: Palette.emerald50,
  error: Palette.rose500,
  errorLight: Palette.rose50,
  warning: Palette.amber500,
  warningLight: Palette.amber50,

  // Components
  bookmarkActive: Palette.amber500,
  bookmarkInactive: Palette.gray300,
  badge: Palette.indigo600,
  enrollButton: Palette.indigo600,
  enrollButtonText: Palette.white,
  enrolledBadge: Palette.emerald500,

  // Snackbar
  snackbarSuccess: Palette.emerald500,
  snackbarError: Palette.rose500,
  snackbarInfo: Palette.indigo600,

  // Offline banner
  offlineBanner: Palette.gray800,
  offlineBannerText: Palette.white,
} as const;

export type ColorKey = keyof typeof Colors;
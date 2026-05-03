import { StyleSheet } from 'react-native';
import { Colors } from './colors';
import { FONTS, FontSize } from './fonts';

// ─── Global Shared Styles ─────────────────────────────────────────────────────
// Rule: Only put things here that are:
//   1. Reused across 3+ components, AND
//   2. Either complex enough to warrant StyleSheet, or have dynamic color values
//      that NativeWind className cannot express.
//
// Simple layout/spacing → use className (NativeWind) in the component.
// Custom fontFamily → always style={{ fontFamily: FONTS.X }} since NativeWind
//   does not load custom fonts.

export const GlobalStyles = StyleSheet.create({
  // ── Screen wrappers ───────────────────────────────────────────────────────
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── Card shadows ──────────────────────────────────────────────────────────
  // NativeWind shadow utilities don't combine iOS + Android cleanly
  cardShadow: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  cardShadowSm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  // ── Typography presets ────────────────────────────────────────────────────
  // Combine custom fontFamily (NativeWind can't do) + size + color + lineHeight
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

  // ── Input base ────────────────────────────────────────────────────────────
  // Complex multi-property group — StyleSheet avoids repeating this in 3 inputs
  inputBase: {
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputFocused: {
    borderColor: Colors.borderFocus,
    backgroundColor: Colors.surface,
  },
  inputError: {
    borderColor: Colors.borderError,
    backgroundColor: Colors.errorLight,
  },
  inputText: {
    flex: 1,
    fontFamily: FONTS.REGULAR,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    padding: 0, // Android adds default padding on TextInput
  },
});
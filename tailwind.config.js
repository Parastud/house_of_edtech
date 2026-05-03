/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          light: '#E0E7FF',
          dark: '#3730A3',
        },
        accent: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
        },
        success: '#10B981',
        error: '#F43F5E',
        surface: '#FFFFFF',
        background: '#F9FAFB',
        border: '#E5E7EB',
        textPrimary: '#111827',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF',
        inverse: '#FFFFFF',
      },
    },
  },
  plugins: [],
};

/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export const SimulatorColors = {
  screenBackground: '#F9FAFB',
  surface: '#FFFFFF',
  textOnBrand: '#FFFFFF',

  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textBody: '#374151',
  textPlaceholder: '#9CA3AF',

  border: '#E5E7EB',
  borderInput: '#D1D5DB',
  borderDivider: '#F3F4F6',

  brand: '#2563EB',
  brandDark: '#1D4ED8',
  brandDisabled: '#93C5FD',
  brandTint: '#EFF6FF',
  brandDeep: '#1E40AF',

  warningBackground: '#FEF3C7',
  warningBorder: '#F59E0B',
  warningLabelText: '#92400E',
  warningBodyText: '#78350F',

  indigoBackground: '#E0E7FF',
  indigoBorder: '#C7D2FE',
  indigoLabel: '#4338CA',
  indigoText: '#3730A3',

  greenBackground: '#F0FDF4',
  greenBorder: '#86EFAC',
  greenText: '#166534',

  amberBackground: '#FFF7ED',
  amberBorder: '#FDBA74',
  amberBadge: '#F59E0B',

  scoreRed: '#DC2626',
  scoreOrange: '#EA580C',
  scoreYellow: '#CA8A04',
  scoreGreen: '#16A34A',
} as const;

export const Radius = {
  sm: 6,
  md: 8,
  lg: 12,
} as const;

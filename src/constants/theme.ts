/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#F4F8FF',
    background: '#07101C',
    backgroundElement: '#101B2B',
    backgroundSelected: '#18263D',
    textSecondary: '#9DB0C7',
  },
  dark: {
    text: '#F4F8FF',
    background: '#050B14',
    backgroundElement: '#0D1726',
    backgroundSelected: '#162133',
    textSecondary: '#9DB0C7',
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
  screenBackground: '#050B15',
  surface: 'rgba(11, 19, 32, 0.90)',
  surfaceRaised: '#132033',
  surfaceMuted: 'rgba(15, 24, 40, 0.76)',
  surfaceElevated: '#17253A',
  textOnBrand: '#FFFFFF',

  textPrimary: '#F4F8FF',
  textSecondary: '#A7B7CB',
  textBody: '#D8E3F0',
  textPlaceholder: '#7487A0',

  border: 'rgba(167, 183, 203, 0.18)',
  borderInput: 'rgba(167, 183, 203, 0.24)',
  borderDivider: 'rgba(167, 183, 203, 0.10)',

  brand: '#69B6FF',
  brandDark: '#2D83E6',
  brandDisabled: '#35506B',
  brandTint: 'rgba(105, 182, 255, 0.14)',
  brandDeep: '#2F89FF',

  warningBackground: 'rgba(245, 158, 11, 0.14)',
  warningBorder: '#F4B94F',
  warningLabelText: '#FFD9A0',
  warningBodyText: '#F8E8C5',

  indigoBackground: 'rgba(99, 102, 241, 0.14)',
  indigoBorder: '#7B8CFF',
  indigoLabel: '#CBD4FF',
  indigoText: '#E2E7FF',

  greenBackground: 'rgba(16, 185, 129, 0.11)',
  greenBorder: '#31D0C0',
  greenText: '#C1F8E2',

  amberBackground: 'rgba(245, 158, 11, 0.14)',
  amberBorder: '#F4B94F',
  amberBadge: '#F7CD63',

  scoreRed: '#FF6B7A',
  scoreOrange: '#FB923C',
  scoreYellow: '#F7C948',
  scoreGreen: '#31D0C0',

  shadow: 'rgba(3, 8, 18, 0.32)',
  shadowStrong: 'rgba(3, 8, 18, 0.46)',
} as const;

export const Radius = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
} as const;

/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Design system colors (Pomodoro Pro)
const GRADIENT_START = '#667eea'; // indigo bluish
const GRADIENT_END = '#764ba2';   // deep purple

const PRIMARY = '#1976d2'; // blue (Material)
const SUCCESS = '#388e3c';
const SUCCESS_LIGHT = '#4caf50';
const WARNING = '#f57c00';
const ERROR = '#d32f2f';

const NEUTRAL_BG = '#f5f5f5';
const NEUTRAL_BORDER = '#e0e0e0';
const TEXT_SECONDARY = '#757575';

export const Theme = {
  gradient: {
    start: GRADIENT_START,
    end: GRADIENT_END,
    css: `linear-gradient(135deg, ${GRADIENT_START} 0%, ${GRADIENT_END} 100%)`,
  },
  primary: PRIMARY,
  success: SUCCESS,
  successLight: SUCCESS_LIGHT,
  warning: WARNING,
  error: ERROR,
  neutral: {
    cardBg: NEUTRAL_BG,
    border: NEUTRAL_BORDER,
    textSecondary: TEXT_SECONDARY,
    overlay: 'rgba(255,255,255,0.9)'
  },
  // fallback colors for compatibility
  colors: {
    light: {
      text: '#11181C',
      background: '#fff',
      tint: PRIMARY,
      icon: '#687076',
      tabIconDefault: '#687076',
      tabIconSelected: PRIMARY,
    },
    dark: {
      text: '#ECEDEE',
      background: '#151718',
      tint: '#fff',
      icon: '#9BA1A6',
      tabIconDefault: '#9BA1A6',
      tabIconSelected: '#fff',
    },
  },
  // UI layout constants
  headerHeight: 56,
};

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
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

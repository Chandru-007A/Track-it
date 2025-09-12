/**
 * App theme colors and styling constants
 * Modern, vibrant color palette for Track-it application
 */

import { Platform } from 'react-native';

// Primary brand colors
const primaryColor = '#2E7D32'; // Green primary
const secondaryColor = '#1976D2'; // Blue secondary
const accentColor = '#FF5722'; // Orange accent

// Light theme colors
const tintColorLight = '#2E7D32';
const backgroundLight = '#F8F9FA';
const cardLight = '#FFFFFF';
const textLight = '#212121';

// Dark theme colors
const tintColorDark = '#4CAF50';
const backgroundDark = '#1E1E1E';
const cardDark = '#2D2D2D';
const textDark = '#EEEEEE';

// Gradient colors
export const Gradients = {
  primary: ['#2E7D32', '#388E3C', '#43A047'],
  secondary: ['#1565C0', '#1976D2', '#1E88E5'],
  accent: ['#E64A19', '#FF5722', '#FF7043'],
  success: ['#2E7D32', '#43A047', '#66BB6A'],
  warning: ['#F57C00', '#FF9800', '#FFB74D'],
  error: ['#C62828', '#D32F2F', '#E53935'],
};

export const Colors = {
  light: {
    text: textLight,
    background: backgroundLight,
    card: cardLight,
    tint: tintColorLight,
    icon: '#616161',
    tabIconDefault: '#9E9E9E',
    tabIconSelected: tintColorLight,
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
    success: '#43A047',
    warning: '#FF9800',
    error: '#D32F2F',
    border: '#E0E0E0',
    placeholder: '#9E9E9E',
    inactive: '#BDBDBD',
  },
  dark: {
    text: textDark,
    background: backgroundDark,
    card: cardDark,
    tint: tintColorDark,
    icon: '#B0BEC5',
    tabIconDefault: '#78909C',
    tabIconSelected: tintColorDark,
    primary: '#4CAF50',
    secondary: '#42A5F5',
    accent: '#FF7043',
    success: '#66BB6A',
    warning: '#FFB74D',
    error: '#EF5350',
    border: '#424242',
    placeholder: '#757575',
    inactive: '#616161',
  },
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

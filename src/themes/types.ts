/**
 * Theme configuration for the AI Chat Widget
 */
export interface ThemeConfig {
  /** Primary accent color (buttons, user bubbles) */
  primary: string;
  /** Primary color on hover */
  primaryHover?: string;
  /** Main background color */
  background: string;
  /** Surface color (chat window, input area) */
  surface: string;
  /** Surface color on hover */
  surfaceHover?: string;
  /** Primary text color */
  text: string;
  /** Secondary/muted text color */
  textSecondary?: string;
  /** Border color */
  border?: string;
  /** User message bubble background */
  userBubble?: string;
  /** User message bubble text color */
  userBubbleText?: string;
  /** Assistant message bubble background */
  assistantBubble?: string;
  /** Assistant message bubble text color */
  assistantBubbleText?: string;
  /** Error state color */
  error?: string;
  /** Error background color */
  errorBg?: string;
}

/**
 * Named theme preset
 */
export interface ThemePreset extends ThemeConfig {
  /** Preset name identifier */
  name: string;
}

/**
 * Available preset theme names
 */
export type PresetThemeName = 'midnight' | 'ocean' | 'forest' | 'sunset' | 'lavender';

/**
 * Theme prop type - can be a preset name or custom config
 */
export type ThemeProp = PresetThemeName | ThemeConfig;

/**
 * Resolved theme with all optional properties filled
 */
export interface ResolvedTheme extends Required<ThemeConfig> {
  name: string;
}

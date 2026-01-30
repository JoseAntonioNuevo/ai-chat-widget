import type { ThemeProp, ResolvedTheme, ThemeConfig, PresetThemeName } from './types';
import { presets, defaultTheme } from './presets';

/**
 * Check if a value is a preset theme name
 */
function isPresetName(theme: ThemeProp): theme is PresetThemeName {
  return typeof theme === 'string' && theme in presets;
}

/**
 * Resolve a theme prop to a complete theme configuration
 *
 * @param theme - Preset name or custom theme config
 * @returns Fully resolved theme with all properties
 *
 * @example
 * ```ts
 * // From preset name
 * const theme = resolveTheme('ocean');
 *
 * // From partial config (inherits defaults from midnight)
 * const theme = resolveTheme({
 *   primary: '#ff0000',
 *   background: '#000000',
 *   surface: '#111111',
 *   text: '#ffffff',
 * });
 * ```
 */
export function resolveTheme(theme?: ThemeProp): ResolvedTheme {
  // No theme provided - use default
  if (!theme) {
    return {
      ...defaultTheme,
      name: defaultTheme.name,
    } as ResolvedTheme;
  }

  // Preset name provided
  if (isPresetName(theme)) {
    const preset = presets[theme];
    return {
      ...preset,
      name: preset.name,
    } as ResolvedTheme;
  }

  // Custom config provided - merge with defaults
  const customConfig = theme as ThemeConfig;
  return {
    name: 'custom',
    primary: customConfig.primary,
    primaryHover: customConfig.primaryHover ?? adjustColor(customConfig.primary, -15),
    background: customConfig.background,
    surface: customConfig.surface,
    surfaceHover: customConfig.surfaceHover ?? adjustColor(customConfig.surface, 10),
    text: customConfig.text,
    textSecondary: customConfig.textSecondary ?? adjustColor(customConfig.text, -30),
    border: customConfig.border ?? customConfig.surface,
    userBubble: customConfig.userBubble ?? customConfig.primary,
    userBubbleText: customConfig.userBubbleText ?? '#ffffff',
    assistantBubble: customConfig.assistantBubble ?? customConfig.surface,
    assistantBubbleText: customConfig.assistantBubbleText ?? customConfig.text,
    error: customConfig.error ?? '#ef4444',
    errorBg: customConfig.errorBg ?? '#450a0a',
  };
}

/**
 * Adjust a hex color's lightness
 * Positive amount = lighter, negative = darker
 */
function adjustColor(hex: string, amount: number): string {
  // Remove # if present
  const color = hex.replace(/^#/, '');

  // Parse RGB
  const num = parseInt(color, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;

  // Clamp values
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  // Return hex
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

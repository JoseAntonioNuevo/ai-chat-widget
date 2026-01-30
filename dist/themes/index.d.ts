/**
 * Theme configuration for the AI Chat Widget
 */
interface ThemeConfig {
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
interface ThemePreset extends ThemeConfig {
    /** Preset name identifier */
    name: string;
}
/**
 * Available preset theme names
 */
type PresetThemeName = 'midnight' | 'ocean' | 'forest' | 'sunset' | 'lavender';
/**
 * Theme prop type - can be a preset name or custom config
 */
type ThemeProp = PresetThemeName | ThemeConfig;
/**
 * Resolved theme with all optional properties filled
 */
interface ResolvedTheme extends Required<ThemeConfig> {
    name: string;
}

/**
 * Midnight - Dark indigo theme (Default)
 * A sophisticated dark theme with indigo accents
 */
declare const midnight: ThemePreset;
/**
 * Ocean - Dark blue theme
 * A calming dark theme with sky blue accents
 */
declare const ocean: ThemePreset;
/**
 * Forest - Dark green theme
 * A nature-inspired dark theme with green accents
 */
declare const forest: ThemePreset;
/**
 * Sunset - Dark warm theme
 * A warm dark theme with orange accents
 */
declare const sunset: ThemePreset;
/**
 * Lavender - Dark purple theme
 * An elegant dark theme with purple accents
 */
declare const lavender: ThemePreset;
/**
 * All available theme presets
 */
declare const presets: {
    readonly midnight: ThemePreset;
    readonly ocean: ThemePreset;
    readonly forest: ThemePreset;
    readonly sunset: ThemePreset;
    readonly lavender: ThemePreset;
};
/**
 * Default theme (midnight)
 */
declare const defaultTheme: ThemePreset;

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
declare function resolveTheme(theme?: ThemeProp): ResolvedTheme;

export { type PresetThemeName, type ResolvedTheme, type ThemeConfig, type ThemePreset, type ThemeProp, defaultTheme, forest, lavender, midnight, ocean, presets, resolveTheme, sunset };

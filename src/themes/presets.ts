import type { ThemePreset } from './types';

/**
 * Midnight - Dark indigo theme (Default)
 * A sophisticated dark theme with indigo accents
 */
export const midnight: ThemePreset = {
  name: 'midnight',
  primary: '#6366f1',
  primaryHover: '#4f46e5',
  background: '#0f172a',
  surface: '#1e293b',
  surfaceHover: '#334155',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  border: '#334155',
  userBubble: '#6366f1',
  userBubbleText: '#ffffff',
  assistantBubble: '#1e293b',
  assistantBubbleText: '#f1f5f9',
  error: '#ef4444',
  errorBg: '#450a0a',
};

/**
 * Ocean - Dark blue theme
 * A calming dark theme with sky blue accents
 */
export const ocean: ThemePreset = {
  name: 'ocean',
  primary: '#0ea5e9',
  primaryHover: '#0284c7',
  background: '#0c1222',
  surface: '#172033',
  surfaceHover: '#1e3a5f',
  text: '#e0f2fe',
  textSecondary: '#7dd3fc',
  border: '#1e3a5f',
  userBubble: '#0ea5e9',
  userBubbleText: '#ffffff',
  assistantBubble: '#172033',
  assistantBubbleText: '#e0f2fe',
  error: '#f87171',
  errorBg: '#450a0a',
};

/**
 * Forest - Dark green theme
 * A nature-inspired dark theme with green accents
 */
export const forest: ThemePreset = {
  name: 'forest',
  primary: '#22c55e',
  primaryHover: '#16a34a',
  background: '#052e16',
  surface: '#14532d',
  surfaceHover: '#166534',
  text: '#dcfce7',
  textSecondary: '#86efac',
  border: '#166534',
  userBubble: '#22c55e',
  userBubbleText: '#052e16',
  assistantBubble: '#14532d',
  assistantBubbleText: '#dcfce7',
  error: '#f87171',
  errorBg: '#450a0a',
};

/**
 * Sunset - Dark warm theme
 * A warm dark theme with orange accents
 */
export const sunset: ThemePreset = {
  name: 'sunset',
  primary: '#f97316',
  primaryHover: '#ea580c',
  background: '#1c1917',
  surface: '#292524',
  surfaceHover: '#44403c',
  text: '#fafaf9',
  textSecondary: '#d6d3d1',
  border: '#44403c',
  userBubble: '#f97316',
  userBubbleText: '#ffffff',
  assistantBubble: '#292524',
  assistantBubbleText: '#fafaf9',
  error: '#f87171',
  errorBg: '#450a0a',
};

/**
 * Lavender - Dark purple theme
 * An elegant dark theme with purple accents
 */
export const lavender: ThemePreset = {
  name: 'lavender',
  primary: '#a855f7',
  primaryHover: '#9333ea',
  background: '#1a0a2e',
  surface: '#2d1b4e',
  surfaceHover: '#3b2d5c',
  text: '#f3e8ff',
  textSecondary: '#d8b4fe',
  border: '#3b2d5c',
  userBubble: '#a855f7',
  userBubbleText: '#ffffff',
  assistantBubble: '#2d1b4e',
  assistantBubbleText: '#f3e8ff',
  error: '#f87171',
  errorBg: '#450a0a',
};

/**
 * All available theme presets
 */
export const presets = {
  midnight,
  ocean,
  forest,
  sunset,
  lavender,
} as const;

/**
 * Default theme (midnight)
 */
export const defaultTheme = midnight;

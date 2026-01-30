/**
 * Theme system for AI Chat Widget
 *
 * @example
 * ```tsx
 * import { presets, resolveTheme } from '@joseantonionuevo/ai-chat-widget/themes';
 *
 * // Use a preset
 * const theme = presets.ocean;
 *
 * // Or resolve a theme prop
 * const resolved = resolveTheme('midnight');
 * const custom = resolveTheme({ primary: '#ff0000', background: '#000', surface: '#111', text: '#fff' });
 * ```
 */

export * from './types';
export * from './presets';
export { resolveTheme } from './resolve';

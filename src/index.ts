/**
 * AI Chat Widget
 *
 * A ready-to-use, customizable chat widget for AI applications using Vercel AI SDK v6.
 *
 * @packageDocumentation
 * @module @joseantonionuevo/ai-chat-widget
 *
 * @example Basic usage
 * ```tsx
 * import { ChatWidget } from '@joseantonionuevo/ai-chat-widget';
 *
 * function App() {
 *   return <ChatWidget apiUrl="/api/chat" />;
 * }
 * ```
 *
 * @example With theme preset
 * ```tsx
 * import { ChatWidget } from '@joseantonionuevo/ai-chat-widget';
 *
 * function App() {
 *   return (
 *     <ChatWidget
 *       apiUrl="/api/chat"
 *       theme="ocean"
 *       lang="es"
 *       greeting="¡Hola! ¿Cómo puedo ayudarte?"
 *     />
 *   );
 * }
 * ```
 *
 * @example With custom theme
 * ```tsx
 * import { ChatWidget } from '@joseantonionuevo/ai-chat-widget';
 *
 * const customTheme = {
 *   primary: '#7bc7c1',
 *   background: '#ffffff',
 *   surface: '#f5f5f5',
 *   text: '#333333',
 * };
 *
 * function App() {
 *   return (
 *     <ChatWidget
 *       apiUrl="/api/chat"
 *       theme={customTheme}
 *       title="Support Chat"
 *       greeting="Hello! How can I help you today?"
 *     />
 *   );
 * }
 * ```
 */

// Main component
export { ChatWidget, default } from './ChatWidget';

// Types
export type {
  ChatWidgetProps,
  Position,
  ThemeProp,
  ThemeConfig,
  PresetThemeName,
  Lang,
  Labels,
  CustomIcons,
  RateLimitOptions,
  ErrorInfo,
  ErrorType,
} from './types';

// Theme system
export { presets, defaultTheme, resolveTheme } from './themes';
export type { ThemePreset, ResolvedTheme } from './themes';

// i18n
export { translations, getLabels, mergeLabels } from './i18n';
export type { BuiltInLang } from './i18n';

// Components (for advanced customization)
export {
  ChatButton,
  ChatWindow,
  MessageBubble,
  MessageInput,
  LoadingIndicator,
  ErrorMessage,
  SuggestionBox,
  ChatIcon,
  CloseIcon,
  SendIcon,
} from './components';

// Utilities
export { getMessageText, classifyError, isRateLimitError } from './utils';

// Hooks
export { useRateLimitRetry } from './hooks/useRateLimitRetry';

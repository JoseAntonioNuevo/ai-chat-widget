import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode, CSSProperties } from 'react';
import { ThemeProp, ResolvedTheme } from './themes/index.js';
export { PresetThemeName, ThemeConfig, ThemePreset, defaultTheme, presets, resolveTheme } from './themes/index.js';
import { UIMessage } from 'ai';

/**
 * Language code
 * Can be any string (e.g., 'en', 'es', 'fr', 'de', 'pt-BR', 'zh-CN', etc.)
 * The lang value is passed to your backend API in the request body
 */
type Lang = string;
/**
 * Built-in language codes with default translations
 */
type BuiltInLang = 'en' | 'es';
/**
 * Translation labels for the chat widget
 */
interface Labels {
    /** Chat window title */
    title: string;
    /** Input placeholder text */
    placeholder: string;
    /** Send button label (accessibility) */
    send: string;
    /** Close button label (accessibility) */
    close: string;
    /** Open chat button label (accessibility) */
    open: string;
    /** Loading/thinking indicator text */
    thinking: string;
    /** Generic error message */
    error: string;
    /** Retry button text */
    retry: string;
    /** Suggestions section title */
    suggestionsTitle: string;
    /** Restart chat button label (accessibility) */
    restart: string;
}
/**
 * Built-in translations object
 */
type Translations = Record<BuiltInLang, Labels>;

/**
 * Widget position on screen
 */
type Position = 'bottom-right' | 'bottom-left';
/**
 * Custom icon configuration
 */
interface CustomIcons {
    /**
     * Icon shown when chat is closed (click to open)
     * Can be any React node: SVG, component from icon library, emoji, etc.
     *
     * @example
     * ```tsx
     * // SVG
     * icon={{ open: <svg>...</svg> }}
     *
     * // Lucide React
     * import { MessageCircle } from 'lucide-react';
     * icon={{ open: <MessageCircle size={24} /> }}
     *
     * // Heroicons
     * import { ChatBubbleLeftIcon } from '@heroicons/react/24/solid';
     * icon={{ open: <ChatBubbleLeftIcon className="w-6 h-6" /> }}
     *
     * // Emoji
     * icon={{ open: '💬' }}
     * ```
     */
    open?: ReactNode;
    /**
     * Icon shown when chat is open (click to close)
     * If not provided, uses default X icon
     */
    close?: ReactNode;
}
/**
 * Chat widget props
 */
interface ChatWidgetProps {
    /**
     * Required: Your chat API endpoint URL
     * The endpoint should accept POST requests with Vercel AI SDK v6 UIMessage format
     * and return streaming responses using toUIMessageStreamResponse()
     */
    apiUrl: string;
    /**
     * Theme preset name or custom theme configuration
     * @default 'midnight'
     *
     * @example
     * ```tsx
     * // Use a preset
     * <ChatWidget theme="ocean" />
     *
     * // Use custom colors
     * <ChatWidget theme={{
     *   primary: '#7bc7c1',
     *   background: '#ffffff',
     *   surface: '#f5f5f5',
     *   text: '#333333',
     * }} />
     * ```
     */
    theme?: ThemeProp;
    /**
     * Widget position on screen
     * @default 'bottom-right'
     */
    position?: Position;
    /**
     * Language code for UI strings and API requests
     * Can be any string (e.g., 'en', 'es', 'fr', 'de', 'pt-BR', 'zh-CN')
     *
     * Built-in translations: 'en' (English), 'es' (Spanish)
     * For other languages, provide custom labels via the `labels` prop
     *
     * The lang value is also sent to your backend API in the request body
     *
     * @default 'en'
     *
     * @example
     * ```tsx
     * // Using built-in Spanish
     * <ChatWidget lang="es" />
     *
     * // Using French with custom labels
     * <ChatWidget
     *   lang="fr"
     *   labels={{
     *     title: 'Assistant',
     *     placeholder: 'Écrivez votre message...',
     *     thinking: 'Réflexion',
     *   }}
     * />
     * ```
     */
    lang?: Lang;
    /**
     * Custom labels to override default translations
     * Partial override - only specify the labels you want to change
     *
     * @example
     * ```tsx
     * <ChatWidget
     *   labels={{
     *     title: 'Support Chat',
     *     placeholder: 'Ask me anything...',
     *   }}
     * />
     * ```
     */
    labels?: Partial<Labels>;
    /**
     * Initial greeting message from the assistant
     * If not provided, the chat starts empty
     *
     * @example
     * ```tsx
     * <ChatWidget greeting="Hello! How can I help you today?" />
     * ```
     */
    greeting?: string;
    /**
     * Start with the chat window open
     * @default false
     */
    defaultOpen?: boolean;
    /**
     * Custom chat window title (overrides labels.title)
     * Set to empty string '' or false to hide the title completely
     *
     * @example
     * ```tsx
     * // Custom title
     * <ChatWidget title="Support Chat" />
     *
     * // Hide title (icon only or empty header)
     * <ChatWidget title="" />
     * <ChatWidget title={false} />
     * ```
     */
    title?: string | false;
    /**
     * Icon displayed in the chat header (left of the title)
     * Can be any React node: image, SVG, component from icon library, emoji, etc.
     * The icon is displayed at 24x24 pixels with object-fit: contain
     *
     * @example
     * ```tsx
     * // Image URL
     * <ChatWidget headerIcon={<img src="/logo.png" alt="Logo" />} />
     *
     * // SVG component
     * import { BotIcon } from 'lucide-react';
     * <ChatWidget headerIcon={<BotIcon size={20} />} />
     *
     * // Emoji
     * <ChatWidget headerIcon="🤖" />
     *
     * // Next.js Image
     * import Image from 'next/image';
     * <ChatWidget headerIcon={<Image src="/logo.png" width={24} height={24} alt="Logo" />} />
     * ```
     */
    headerIcon?: ReactNode;
    /**
     * Custom input placeholder (overrides labels.placeholder)
     */
    placeholder?: string;
    /**
     * Chat window width
     * @default '380px'
     */
    width?: string;
    /**
     * Chat window height
     * @default '500px'
     */
    height?: string;
    /**
     * Enable user-resizable chat window
     * When true, users can drag corners to resize
     * Disabled automatically on mobile (<640px)
     * @default true
     */
    resizable?: boolean;
    /**
     * Minimum width constraint for resizing
     * @default '300px'
     */
    minWidth?: string;
    /**
     * Maximum width constraint for resizing
     * @default '600px'
     */
    maxWidth?: string;
    /**
     * Minimum height constraint for resizing
     * @default '400px'
     */
    minHeight?: string;
    /**
     * Maximum height constraint for resizing
     * @default '80vh'
     */
    maxHeight?: string;
    /**
     * Z-index for the widget
     * @default 50
     */
    zIndex?: number;
    /**
     * Additional CSS class name for the root container
     */
    className?: string;
    /**
     * Custom icons for the floating button
     * Allows using any icon library (Lucide, Heroicons, FontAwesome, etc.)
     *
     * @example
     * ```tsx
     * // Using Lucide React
     * import { MessageCircle, X } from 'lucide-react';
     *
     * <ChatWidget
     *   apiUrl="/api/chat"
     *   icon={{
     *     open: <MessageCircle size={24} />,
     *     close: <X size={24} />,
     *   }}
     * />
     * ```
     *
     * @example
     * ```tsx
     * // Using Heroicons
     * import { ChatBubbleLeftIcon, XMarkIcon } from '@heroicons/react/24/solid';
     *
     * <ChatWidget
     *   apiUrl="/api/chat"
     *   icon={{
     *     open: <ChatBubbleLeftIcon className="w-6 h-6" />,
     *     close: <XMarkIcon className="w-6 h-6" />,
     *   }}
     * />
     * ```
     *
     * @example
     * ```tsx
     * // Using emoji
     * <ChatWidget
     *   apiUrl="/api/chat"
     *   icon={{ open: '🤖', close: '✕' }}
     * />
     * ```
     */
    icon?: CustomIcons;
    /**
     * Custom font family for the widget
     * Can be any valid CSS font-family value
     *
     * @default 'Inter, system-ui, -apple-system, sans-serif'
     *
     * The widget uses Inter as default - a modern, free, open-source font
     * optimized for screen readability. Inter is loaded from Google Fonts
     * automatically if no custom font is specified.
     *
     * To use your own font:
     * 1. Load the font in your app (via Google Fonts, @font-face, etc.)
     * 2. Pass the font-family string to this prop
     *
     * @example
     * ```tsx
     * // Use your app's font
     * <ChatWidget fontFamily="'Plus Jakarta Sans', sans-serif" />
     *
     * // Use system fonts only (no external font loading)
     * <ChatWidget fontFamily="system-ui, -apple-system, sans-serif" />
     *
     * // Use a custom font you've loaded
     * <ChatWidget fontFamily="'My Custom Font', Georgia, serif" />
     * ```
     */
    fontFamily?: string;
    /**
     * Enable suggestion boxes below AI responses
     * When enabled, clickable follow-up questions appear after each AI response
     * Requires backend to return suggestions in message annotations
     *
     * @default true
     *
     * @example
     * ```tsx
     * // Disable suggestions
     * <ChatWidget showSuggestions={false} />
     * ```
     */
    showSuggestions?: boolean;
}

/**
 * AI Chat Widget
 *
 * A ready-to-use, customizable floating chat widget for AI applications.
 * Works with any backend that implements the Vercel AI SDK v6 streaming protocol.
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
 * <ChatWidget
 *   apiUrl="/api/chat"
 *   theme="ocean"
 *   lang="es"
 *   greeting="¡Hola! ¿En qué puedo ayudarte?"
 * />
 * ```
 *
 * @example With custom theme
 * ```tsx
 * <ChatWidget
 *   apiUrl="/api/chat"
 *   theme={{
 *     primary: '#7bc7c1',
 *     background: '#ffffff',
 *     surface: '#f5f5f5',
 *     text: '#333333',
 *   }}
 *   title="Support Chat"
 * />
 * ```
 */
declare function ChatWidget({ apiUrl, theme: themeProp, position, lang, labels: customLabels, greeting, defaultOpen, title: customTitle, placeholder: customPlaceholder, width, height, minWidth, maxWidth, minHeight, maxHeight, resizable, zIndex, icon, headerIcon, fontFamily: customFontFamily, showSuggestions, }: ChatWidgetProps): react_jsx_runtime.JSX.Element;

/**
 * Built-in translations (English and Spanish)
 * For other languages, use the `labels` prop to provide custom translations
 */
declare const translations: Translations;
/**
 * Get labels for a specific language
 *
 * @param lang - Language code (any string, e.g., 'en', 'es', 'fr', 'de', 'pt-BR')
 * @returns Labels for the specified language, or English defaults if not found
 *
 * @example
 * ```ts
 * getLabels('en');  // Returns English labels
 * getLabels('es');  // Returns Spanish labels
 * getLabels('fr');  // Returns English labels (no built-in French)
 * ```
 */
declare function getLabels(lang: Lang): Labels;
/**
 * Merge custom labels with defaults
 *
 * @param lang - Base language code (any string)
 * @param customLabels - Partial custom labels to override
 * @returns Complete labels with overrides applied
 *
 * @example
 * ```ts
 * // French with custom labels
 * mergeLabels('fr', {
 *   title: 'Assistant',
 *   placeholder: 'Écrivez votre message...',
 *   send: 'Envoyer',
 *   close: 'Fermer',
 *   open: 'Ouvrir le chat',
 *   thinking: 'Réflexion',
 *   error: 'Une erreur est survenue',
 *   retry: 'Réessayer',
 * });
 * ```
 */
declare function mergeLabels(lang: Lang, customLabels?: Partial<Labels>): Labels;

interface ChatButtonProps {
    theme: ResolvedTheme;
    position: Position;
    isOpen: boolean;
    onClick: () => void;
    openLabel: string;
    closeLabel: string;
    zIndex: number;
    /** Custom icon for open state */
    openIcon?: ReactNode;
    /** Custom icon for close state */
    closeIcon?: ReactNode;
}
declare function ChatButton({ theme, position, isOpen, onClick, openLabel, closeLabel, zIndex, openIcon, closeIcon, }: ChatButtonProps): react_jsx_runtime.JSX.Element;

interface ChatWindowProps {
    theme: ResolvedTheme;
    position: Position;
    messages: UIMessage[];
    input: string;
    onInputChange: (value: string) => void;
    onSubmit: () => void;
    onRetry: () => void;
    onClose: () => void;
    onRestart: () => void;
    onSuggestionSelect?: (suggestion: string) => void;
    isLoading: boolean;
    error: Error | undefined;
    labels: Labels;
    title?: string;
    headerIcon?: ReactNode;
    placeholder: string;
    width: number;
    height: number;
    zIndex: number;
    showSuggestions: boolean;
    isClosing?: boolean;
    resizable: boolean;
    isMobile: boolean;
    isResizing: boolean;
    onResizeStart: (corner: 'nw' | 'ne' | 'sw' | 'se', e: React.MouseEvent) => void;
}
declare function ChatWindow({ theme, position, messages, input, onInputChange, onSubmit, onRetry, onClose, onRestart, onSuggestionSelect, isLoading, error, labels, title, headerIcon, placeholder, width, height, zIndex, showSuggestions, isClosing, resizable, isMobile, isResizing, onResizeStart, }: ChatWindowProps): react_jsx_runtime.JSX.Element;

interface MessageBubbleProps {
    message: UIMessage;
    theme: ResolvedTheme;
    showSuggestions?: boolean;
    isLastAssistantMessage?: boolean;
    suggestionsTitle?: string;
    onSuggestionSelect?: (suggestion: string) => void;
}
declare function MessageBubble({ message, theme, showSuggestions, isLastAssistantMessage, suggestionsTitle, onSuggestionSelect, }: MessageBubbleProps): react_jsx_runtime.JSX.Element | null;

interface MessageInputProps {
    theme: ResolvedTheme;
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    placeholder: string;
    sendLabel: string;
    isLoading: boolean;
    autoFocus?: boolean;
}
declare function MessageInput({ theme, value, onChange, onSubmit, placeholder, sendLabel, isLoading, autoFocus, }: MessageInputProps): react_jsx_runtime.JSX.Element;

interface LoadingIndicatorProps {
    theme: ResolvedTheme;
    text: string;
}
declare function LoadingIndicator({ theme, text }: LoadingIndicatorProps): react_jsx_runtime.JSX.Element;

interface ErrorMessageProps {
    theme: ResolvedTheme;
    errorText: string;
    retryText: string;
    onRetry: () => void;
}
declare function ErrorMessage({ theme, errorText, retryText, onRetry }: ErrorMessageProps): react_jsx_runtime.JSX.Element;

interface SuggestionBoxProps {
    suggestions: string[];
    onSelect: (suggestion: string) => void;
    theme: ResolvedTheme;
    title: string;
}
declare function SuggestionBox({ suggestions, onSelect, theme, title }: SuggestionBoxProps): react_jsx_runtime.JSX.Element | null;

interface IconProps {
    size?: number;
    style?: CSSProperties;
}
declare function ChatIcon({ size, style }: IconProps): react_jsx_runtime.JSX.Element;
declare function CloseIcon({ size, style }: IconProps): react_jsx_runtime.JSX.Element;
declare function SendIcon({ size, style }: IconProps): react_jsx_runtime.JSX.Element;

/**
 * Extract text content from a UIMessage's parts array
 *
 * @param message - UIMessage from Vercel AI SDK v6
 * @returns Combined text content from all text parts
 */
declare function getMessageText(message: UIMessage): string;

export { type BuiltInLang, ChatButton, ChatIcon, ChatWidget, type ChatWidgetProps, ChatWindow, CloseIcon, type CustomIcons, ErrorMessage, type Labels, type Lang, LoadingIndicator, MessageBubble, MessageInput, type Position, ResolvedTheme, SendIcon, SuggestionBox, ThemeProp, ChatWidget as default, getLabels, getMessageText, mergeLabels, translations };

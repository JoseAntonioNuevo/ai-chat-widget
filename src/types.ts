import type { ReactNode } from 'react';
import type { ThemeProp } from './themes/types';
import type { Lang, Labels } from './i18n/types';

/**
 * Widget position on screen
 */
export type Position = 'bottom-right' | 'bottom-left';

/**
 * Custom icon configuration
 */
export interface CustomIcons {
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
export interface ChatWidgetProps {
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

// Re-export types for convenience
export type { ThemeProp, ThemeConfig, PresetThemeName } from './themes/types';
export type { Lang, Labels } from './i18n/types';

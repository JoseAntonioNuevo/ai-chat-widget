/**
 * AI Chat Widget - A customizable chat widget for AI applications
 *
 * Features:
 * - 5 dark mode theme presets + full customization
 * - Floating button (configurable position)
 * - Expandable chat window
 * - Streaming responses with Vercel AI SDK v6
 * - Markdown rendering for responses (lazy loaded)
 * - Loading and error states
 * - Keyboard accessibility (Escape to close)
 * - i18n support (EN/ES)
 */

'use client';

import { useState, useEffect, useCallback, useMemo, Component, type ReactNode } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { ChatWidgetProps, Position, CustomIcons } from './types';
import type { Labels } from './i18n/types';
import { resolveTheme } from './themes/resolve';
import { mergeLabels } from './i18n';
import { ChatButton } from './components/ChatButton';
import { ChatWindow } from './components/ChatWindow';
import { useResize } from './hooks/useResize';
import { useMobileDetect } from './hooks/useMobileDetect';

// Error boundary to catch rendering failures
class ChatErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ai-chat-widget] Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return null;
    }
    return this.props.children;
  }
}

// Default font: Inter - modern, free, open-source, optimized for screens
const DEFAULT_FONT_FAMILY = "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

// Google Fonts URL for Inter (weights 400, 500, 600)
const INTER_FONT_URL = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';

interface InternalChatWidgetProps {
  apiUrl: string;
  theme: ReturnType<typeof resolveTheme>;
  position: Position;
  labels: Labels;
  title?: string;
  placeholder: string;
  greeting?: string;
  defaultOpen: boolean;
  width: number;
  height: number;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  resizable: boolean;
  zIndex: number;
  lang: string;
  icon?: CustomIcons;
  headerIcon?: ReactNode;
  fontFamily: string;
  loadDefaultFont: boolean;
  showSuggestions: boolean;
}

// Animation duration in ms
const ANIMATION_DURATION = 200;

function ChatWidgetInternal({
  apiUrl,
  theme,
  position,
  labels,
  title,
  placeholder,
  greeting,
  defaultOpen,
  width,
  height,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  resizable,
  zIndex,
  lang,
  icon,
  headerIcon,
  fontFamily,
  loadDefaultFont,
  showSuggestions,
}: InternalChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isVisible, setIsVisible] = useState(defaultOpen); // Controls DOM presence
  const [isClosing, setIsClosing] = useState(false); // Controls close animation
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  const [fontLoaded, setFontLoaded] = useState(!loadDefaultFont);

  const isMobile = useMobileDetect();

  const { width: currentWidth, height: currentHeight, isResizing, handleResizeStart } = useResize({
    initialWidth: width,
    initialHeight: height,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    enabled: resizable && !isMobile,
  });

  // Handle open/close animations
  useEffect(() => {
    if (isOpen) {
      // Opening: immediately show and let CSS animate
      setIsVisible(true);
      setIsClosing(false);
    } else if (isVisible) {
      // Closing: start close animation, then hide after duration
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
      }, ANIMATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isVisible]);

  // Load Inter font from Google Fonts if using default font
  useEffect(() => {
    if (!loadDefaultFont) return;

    // Check if already loaded
    const existingLink = document.querySelector(`link[href="${INTER_FONT_URL}"]`);
    if (existingLink) {
      setFontLoaded(true);
      return;
    }

    // Create and append link element
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = INTER_FONT_URL;
    link.onload = () => setFontLoaded(true);
    link.onerror = () => {
      console.warn('[ai-chat-widget] Failed to load Inter font, using system fonts');
      setFontLoaded(true);
    };
    document.head.appendChild(link);
  }, [loadDefaultFont]);

  // Create transport with custom API endpoint (memoized to avoid recreating on every render)
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: apiUrl,
        body: { lang, sessionId },
      }),
    [apiUrl, lang, sessionId]
  );

  // Initial messages - include greeting if provided
  const initialMessages = greeting
    ? [
        {
          id: 'greeting',
          role: 'assistant' as const,
          parts: [{ type: 'text' as const, text: greeting }],
        },
      ]
    : [];

  const { messages, sendMessage, regenerate, setMessages, status, error } = useChat({
    transport,
    messages: initialMessages,
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  const handleRestart = useCallback(() => {
    setMessages(initialMessages);
    setInput('');
    setSessionId(crypto.randomUUID());
  }, [setMessages, initialMessages]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const toggleChat = useCallback(() => setIsOpen((prev) => !prev), []);

  const handleSubmit = useCallback(() => {
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput('');
  }, [input, isLoading, sendMessage]);

  const handleRetry = useCallback(() => {
    regenerate();
  }, [regenerate]);

  const handleSuggestionSelect = useCallback((suggestion: string) => {
    if (isLoading) return;
    sendMessage({ text: suggestion });
  }, [isLoading, sendMessage]);

  return (
    <div className="ai-chat-widget-root" style={{ fontFamily }}>
      {/* Chat Window */}
      {isVisible && fontLoaded && (
        <ChatWindow
          theme={theme}
          position={position}
          messages={messages}
          input={input}
          onInputChange={setInput}
          onSubmit={handleSubmit}
          onRetry={handleRetry}
          onClose={toggleChat}
          onRestart={handleRestart}
          onSuggestionSelect={handleSuggestionSelect}
          isLoading={isLoading}
          error={error}
          labels={labels}
          title={title}
          headerIcon={headerIcon}
          placeholder={placeholder}
          width={currentWidth}
          height={currentHeight}
          zIndex={zIndex}
          showSuggestions={showSuggestions}
          isClosing={isClosing}
          resizable={resizable}
          isMobile={isMobile}
          isResizing={isResizing}
          onResizeStart={handleResizeStart}
        />
      )}

      {/* Floating Toggle Button */}
      <ChatButton
        theme={theme}
        position={position}
        isOpen={isOpen}
        onClick={toggleChat}
        openLabel={labels.open}
        closeLabel={labels.close}
        zIndex={zIndex}
        openIcon={icon?.open}
        closeIcon={icon?.close}
      />

      {/* CSS animations and markdown styles */}
      <style>{`
        @keyframes ai-chat-bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        @keyframes ai-chat-window-open {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes ai-chat-window-close {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
        }
        .ai-chat-window-opening {
          animation: ai-chat-window-open ${ANIMATION_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
        .ai-chat-window-closing {
          animation: ai-chat-window-close ${ANIMATION_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
        .ai-chat-markdown p { margin: 0.25rem 0; }
        .ai-chat-markdown ul, .ai-chat-markdown ol { margin: 0.25rem 0; padding-left: 1.25rem; }
        .ai-chat-markdown li { margin: 0; }
        .ai-chat-markdown strong { font-weight: 600; }
        .ai-chat-markdown a { color: ${theme.primary}; text-decoration: underline; }
        .ai-chat-markdown code {
          background: ${theme.surfaceHover};
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }
        .ai-chat-markdown pre {
          background: ${theme.surfaceHover};
          padding: 0.75rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 0.5rem 0;
        }
        .ai-chat-markdown pre code {
          background: transparent;
          padding: 0;
        }
      `}</style>
    </div>
  );
}

function parseCssSize(value: string, fallback: number): number {
  if (value.endsWith('px')) {
    return parseInt(value, 10) || fallback;
  }
  if (value.endsWith('vh')) {
    return (parseInt(value, 10) / 100) * (typeof window !== 'undefined' ? window.innerHeight : 800) || fallback;
  }
  if (value.endsWith('vw')) {
    return (parseInt(value, 10) / 100) * (typeof window !== 'undefined' ? window.innerWidth : 1200) || fallback;
  }
  return parseInt(value, 10) || fallback;
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
export function ChatWidget({
  apiUrl,
  theme: themeProp,
  position = 'bottom-right',
  lang = 'en',
  labels: customLabels,
  greeting,
  defaultOpen = false,
  title: customTitle,
  placeholder: customPlaceholder,
  width = '420px',
  height = '600px',
  minWidth = '300px',
  maxWidth = '600px',
  minHeight = '400px',
  maxHeight = '80vh',
  resizable = true,
  zIndex = 50,
  icon,
  headerIcon,
  fontFamily: customFontFamily,
  showSuggestions = true,
}: ChatWidgetProps) {
  const theme = resolveTheme(themeProp);
  const labels = mergeLabels(lang, customLabels);
  // Title: if explicitly set to '' or false, hide it; otherwise use custom or labels default
  const title = customTitle === '' || customTitle === false
    ? undefined
    : (customTitle ?? labels.title);
  const placeholder = customPlaceholder ?? labels.placeholder;

  // Use custom font if provided, otherwise use Inter (default)
  const fontFamily = customFontFamily ?? DEFAULT_FONT_FAMILY;
  const loadDefaultFont = !customFontFamily; // Only load Inter if no custom font

  // Parse CSS sizes to pixels
  const widthPx = parseCssSize(width, 380);
  const heightPx = parseCssSize(height, 500);
  const minWidthPx = parseCssSize(minWidth, 300);
  const maxWidthPx = parseCssSize(maxWidth, 600);
  const minHeightPx = parseCssSize(minHeight, 400);
  const maxHeightPx = parseCssSize(maxHeight, typeof window !== 'undefined' ? window.innerHeight * 0.8 : 600);

  return (
    <ChatErrorBoundary>
      <ChatWidgetInternal
        apiUrl={apiUrl}
        theme={theme}
        position={position}
        labels={labels}
        title={title}
        placeholder={placeholder}
        greeting={greeting}
        defaultOpen={defaultOpen}
        width={widthPx}
        height={heightPx}
        minWidth={minWidthPx}
        maxWidth={maxWidthPx}
        minHeight={minHeightPx}
        maxHeight={maxHeightPx}
        resizable={resizable}
        zIndex={zIndex}
        lang={lang}
        icon={icon}
        headerIcon={headerIcon}
        fontFamily={fontFamily}
        loadDefaultFont={loadDefaultFont}
        showSuggestions={showSuggestions}
      />
    </ChatErrorBoundary>
  );
}

export default ChatWidget;

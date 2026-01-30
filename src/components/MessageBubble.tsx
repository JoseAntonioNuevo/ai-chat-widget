'use client';

import { lazy, Suspense, useState, useEffect, Component, type ReactNode, type CSSProperties } from 'react';
import type { UIMessage } from 'ai';
import type { ResolvedTheme } from '../themes/types';
import { getMessageText } from '../utils/messageHelpers';
import { SuggestionBox } from './SuggestionBox';

// Lazy load react-markdown
const Markdown = lazy(() =>
  import('react-markdown').catch((err) => {
    console.error('[ai-chat-widget] Failed to load react-markdown:', err);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { default: ({ children }: any) => <span>{children}</span> } as any;
  })
);

// Error boundary for markdown rendering
class MarkdownErrorBoundary extends Component<
  { children: ReactNode; fallback: string },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <span>{this.props.fallback}</span>;
    }
    return this.props.children;
  }
}

/**
 * Suggestions data part type (AI SDK v6 format).
 * Backend sends this as: { type: 'data-suggestions', data: string[] }
 */
interface SuggestionsDataPart {
  type: 'data-suggestions';
  data: string[];
}

interface MessageBubbleProps {
  message: UIMessage;
  theme: ResolvedTheme;
  showSuggestions?: boolean;
  isLastAssistantMessage?: boolean;
  suggestionsTitle?: string;
  onSuggestionSelect?: (suggestion: string) => void;
}

export function MessageBubble({
  message,
  theme,
  showSuggestions = true,
  isLastAssistantMessage = false,
  suggestionsTitle = 'Suggested questions',
  onSuggestionSelect,
}: MessageBubbleProps) {
  const [remarkGfm, setRemarkGfm] = useState<typeof import('remark-gfm').default | null>(null);
  const messageText = getMessageText(message);
  const isUser = message.role === 'user';

  // Lazy load remark-gfm for assistant messages
  useEffect(() => {
    if (!isUser && !remarkGfm) {
      import('remark-gfm')
        .then((mod) => {
          setRemarkGfm(() => mod.default);
        })
        .catch((err) => {
          console.error('[ai-chat-widget] Failed to load remark-gfm:', err);
        });
    }
  }, [isUser, remarkGfm]);

  if (!messageText) return null;

  // Extract suggestions from message parts (data-suggestions type)
  // AI SDK v6 uses { type: 'data-suggestions', data: string[] } format
  const suggestions = !isUser && showSuggestions && isLastAssistantMessage && onSuggestionSelect
    ? (message.parts?.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (part: any): part is SuggestionsDataPart => part.type === 'data-suggestions'
      )?.data ?? [])
    : [];

  const bubbleStyle: CSSProperties = {
    maxWidth: '85%',
    borderRadius: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: isUser ? theme.userBubble : theme.assistantBubble,
    color: isUser ? theme.userBubbleText : theme.assistantBubbleText,
  };

  const markdownStyle: CSSProperties = {
    fontSize: '0.875rem',
    lineHeight: 1.5,
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
      }}
    >
      <div style={bubbleStyle}>
        {isUser ? (
          <p style={{ fontSize: '0.875rem', margin: 0 }}>{messageText}</p>
        ) : (
          <div style={markdownStyle} className="ai-chat-markdown">
            <MarkdownErrorBoundary fallback={messageText}>
              <Suspense fallback={<span>{messageText}</span>}>
                <Markdown remarkPlugins={remarkGfm ? [remarkGfm] : []}>
                  {messageText}
                </Markdown>
              </Suspense>
            </MarkdownErrorBoundary>
          </div>
        )}
      </div>
      {suggestions.length > 0 && onSuggestionSelect && (
        <SuggestionBox
          suggestions={suggestions}
          onSelect={onSuggestionSelect}
          theme={theme}
          title={suggestionsTitle}
        />
      )}
    </div>
  );
}

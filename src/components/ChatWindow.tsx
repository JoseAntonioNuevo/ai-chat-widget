'use client';

import type { CSSProperties, ReactNode } from 'react';
import type { UIMessage } from 'ai';
import type { ResolvedTheme } from '../themes/types';
import type { Position, Labels } from '../types';
import type { ErrorInfo } from '../utils/errorTypes';
import { CloseIcon, RestartIcon } from './Icons';
import { MessageBubble } from './MessageBubble';
import { LoadingIndicator } from './LoadingIndicator';
import { ErrorMessage } from './ErrorMessage';
import { MessageInput } from './MessageInput';
import { useScrollToBottom } from '../hooks/useScrollToBottom';
import { ResizeHandles } from './ResizeHandles';

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
  // New resize props
  resizable: boolean;
  isMobile: boolean;
  isResizing: boolean;
  onResizeStart: (corner: 'nw' | 'ne' | 'sw' | 'se', e: React.MouseEvent) => void;
  // Rate limit error handling props
  errorInfo?: ErrorInfo | null;
  countdown?: number;
  isAutoRetrying?: boolean;
  onCancelAutoRetry?: () => void;
}

export function ChatWindow({
  theme,
  position,
  messages,
  input,
  onInputChange,
  onSubmit,
  onRetry,
  onClose,
  onRestart,
  onSuggestionSelect,
  isLoading,
  error,
  labels,
  title,
  headerIcon,
  placeholder,
  width,
  height,
  zIndex,
  showSuggestions,
  isClosing = false,
  resizable,
  isMobile,
  isResizing,
  onResizeStart,
  errorInfo,
  countdown,
  isAutoRetrying,
  onCancelAutoRetry,
}: ChatWindowProps) {
  const { ref: messagesEndRef } = useScrollToBottom(messages.length, isLoading);

  // Find the last assistant message index for showing suggestions
  const lastAssistantMessageIndex = messages.reduceRight(
    (found, msg, idx) => (found === -1 && msg.role === 'assistant' ? idx : found),
    -1
  );

  const positionStyles: CSSProperties =
    position === 'bottom-left'
      ? { left: '1rem', right: 'auto' }
      : { right: '1rem', left: 'auto' };

  const mobileWidth = 'calc(100vw - 1rem)';
  const mobileHeight = 'calc(100vh - 7rem)';

  const windowStyle: CSSProperties = {
    position: 'fixed',
    bottom: '6rem',
    ...positionStyles,
    zIndex,
    display: 'flex',
    height: isMobile ? mobileHeight : `${height}px`,
    width: isMobile ? mobileWidth : `${width}px`,
    maxWidth: 'calc(100vw - 2rem)',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: '1rem',
    border: `1px solid ${theme.border}`,
    backgroundColor: theme.background,
    boxShadow: `0 8px 32px ${theme.primary}40`,
    // Smooth transitions only when not resizing
    transition: isResizing ? 'none' : 'width 0.1s ease-out, height 0.1s ease-out',
  };

  const headerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${theme.border}`,
    background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryHover})`,
    padding: '0.75rem 1rem',
  };

  // Determine animation class
  const animationClass = isClosing
    ? 'ai-chat-window-closing'
    : 'ai-chat-window-opening';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'ai-chat-title' : undefined}
      aria-label={!title ? labels.title : undefined}
      className={animationClass}
      style={windowStyle}
    >
      {/* Header */}
      <div style={headerStyle}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flex: 1,
            minWidth: 0,
          }}
        >
          {headerIcon && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                flexShrink: 0,
              }}
            >
              {typeof headerIcon === 'string' ? (
                <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{headerIcon}</span>
              ) : (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  {headerIcon}
                </span>
              )}
            </span>
          )}
          {title && (
            <h2
              id="ai-chat-title"
              style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#ffffff',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </h2>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <button
            onClick={onRestart}
            aria-label={labels.restart}
            style={{
              borderRadius: '50%',
              padding: '0.25rem',
              color: 'rgba(255, 255, 255, 0.8)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            }}
          >
            <RestartIcon size={18} />
          </button>
          <button
            onClick={onClose}
            aria-label={labels.close}
            style={{
              borderRadius: '50%',
              padding: '0.25rem',
              color: 'rgba(255, 255, 255, 0.8)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            }}
          >
            <CloseIcon size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          backgroundColor: theme.background,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              theme={theme}
              showSuggestions={showSuggestions}
              isLastAssistantMessage={index === lastAssistantMessageIndex && !isLoading}
              suggestionsTitle={labels.suggestionsTitle}
              onSuggestionSelect={onSuggestionSelect}
            />
          ))}

          {isLoading && (
            <LoadingIndicator theme={theme} text={labels.thinking} />
          )}

          {error && (
            <ErrorMessage
              theme={theme}
              errorText={labels.error}
              rateLimitErrorText={labels.rateLimitError}
              retryText={labels.retry}
              autoRetryingText={labels.autoRetrying}
              cancelAutoRetryText={labels.cancelAutoRetry}
              onRetry={onRetry}
              errorInfo={errorInfo}
              countdown={countdown}
              isAutoRetrying={isAutoRetrying}
              onCancelAutoRetry={onCancelAutoRetry}
            />
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <MessageInput
        theme={theme}
        value={input}
        onChange={onInputChange}
        onSubmit={onSubmit}
        placeholder={placeholder}
        sendLabel={labels.send}
        isLoading={isLoading}
        autoFocus
      />

      {/* Resize Handles (desktop only, when enabled) */}
      {resizable && !isMobile && (
        <ResizeHandles onResizeStart={onResizeStart} isResizing={isResizing} />
      )}
    </div>
  );
}

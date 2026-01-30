import type { ResolvedTheme } from '../themes/types';
import type { ErrorInfo } from '../utils/errorTypes';

interface ErrorMessageProps {
  theme: ResolvedTheme;
  errorText: string;
  rateLimitErrorText: string;
  retryText: string;
  autoRetryingText: string;
  cancelAutoRetryText: string;
  onRetry: () => void;
  errorInfo?: ErrorInfo | null;
  countdown?: number;
  isAutoRetrying?: boolean;
  onCancelAutoRetry?: () => void;
}

export function ErrorMessage({
  theme,
  errorText,
  rateLimitErrorText,
  retryText,
  autoRetryingText,
  cancelAutoRetryText,
  onRetry,
  errorInfo,
  countdown = 0,
  isAutoRetrying = false,
  onCancelAutoRetry,
}: ErrorMessageProps) {
  // Use rate limit error text if this is a rate limit error
  const displayErrorText = errorInfo?.type === 'rate_limit' ? rateLimitErrorText : errorText;

  // Show countdown if available
  const showCountdown = countdown > 0;
  const countdownText = isAutoRetrying
    ? `${autoRetryingText} ${countdown}s...`
    : `${countdown}s`;

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <div
        style={{
          borderRadius: '1rem',
          backgroundColor: theme.errorBg,
          padding: '0.5rem 1rem',
          color: theme.error,
        }}
      >
        <p style={{ fontSize: '0.875rem', margin: 0 }}>{displayErrorText}</p>

        {showCountdown && (
          <p
            style={{
              fontSize: '0.75rem',
              margin: '0.25rem 0 0 0',
              opacity: 0.9,
            }}
          >
            {countdownText}
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
          {/* Retry button - always show unless auto-retrying with countdown */}
          {!(isAutoRetrying && showCountdown) && (
            <button
              onClick={onRetry}
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: theme.error,
                textDecoration: 'underline',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {retryText}
            </button>
          )}

          {/* Cancel button - show when auto-retrying */}
          {isAutoRetrying && showCountdown && onCancelAutoRetry && (
            <button
              onClick={onCancelAutoRetry}
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: theme.error,
                textDecoration: 'underline',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                opacity: 0.8,
              }}
            >
              {cancelAutoRetryText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

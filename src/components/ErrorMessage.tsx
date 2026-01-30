import type { ResolvedTheme } from '../themes/types';

interface ErrorMessageProps {
  theme: ResolvedTheme;
  errorText: string;
  retryText: string;
  onRetry: () => void;
}

export function ErrorMessage({ theme, errorText, retryText, onRetry }: ErrorMessageProps) {
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
        <p style={{ fontSize: '0.875rem', margin: 0 }}>{errorText}</p>
        <button
          onClick={onRetry}
          style={{
            marginTop: '0.25rem',
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
      </div>
    </div>
  );
}

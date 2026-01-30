import type { CSSProperties } from 'react';
import type { ResolvedTheme } from '../themes/types';

interface LoadingIndicatorProps {
  theme: ResolvedTheme;
  text: string;
}

export function LoadingIndicator({ theme, text }: LoadingIndicatorProps) {
  const dotStyle: CSSProperties = {
    height: '0.5rem',
    width: '0.5rem',
    borderRadius: '50%',
    backgroundColor: theme.primary,
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <div
        style={{
          borderRadius: '1rem',
          backgroundColor: theme.assistantBubble,
          padding: '0.5rem 1rem',
          color: theme.assistantBubbleText,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  ...dotStyle,
                  animation: 'ai-chat-bounce 1s infinite',
                  animationDelay: `${-0.3 + i * 0.15}s`,
                }}
              />
            ))}
          </div>
          <span
            style={{
              fontSize: '0.875rem',
              color: theme.textSecondary,
            }}
          >
            {text}...
          </span>
        </div>
      </div>
    </div>
  );
}

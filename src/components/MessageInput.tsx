'use client';

import { useRef, useEffect, type CSSProperties } from 'react';
import type { ResolvedTheme } from '../themes/types';
import { SendIcon } from './Icons';

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

export function MessageInput({
  theme,
  value,
  onChange,
  onSubmit,
  placeholder,
  sendLabel,
  isLoading,
  autoFocus,
}: MessageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isLoading) return;
    onSubmit();
  };

  const inputStyle: CSSProperties = {
    flex: 1,
    borderRadius: '9999px',
    border: `1px solid ${theme.border}`,
    backgroundColor: theme.surface,
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    color: theme.text,
    outline: 'none',
    transition: 'all 0.2s',
    opacity: isLoading ? 0.5 : 1,
  };

  const buttonStyle: CSSProperties = {
    display: 'flex',
    height: '2.5rem',
    width: '2.5rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: theme.primary,
    color: '#ffffff',
    border: 'none',
    cursor: isLoading || !value.trim() ? 'not-allowed' : 'pointer',
    opacity: isLoading || !value.trim() ? 0.5 : 1,
    transition: 'all 0.2s',
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        borderTop: `1px solid ${theme.border}`,
        backgroundColor: theme.surface,
        padding: '1rem',
      }}
    >
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          style={inputStyle}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = theme.primary;
            e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.primary}33`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = theme.border;
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          aria-label={sendLabel}
          style={buttonStyle}
          onMouseEnter={(e) => {
            if (!isLoading && value.trim()) {
              e.currentTarget.style.backgroundColor = theme.primaryHover;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.primary;
          }}
        >
          <SendIcon />
        </button>
      </div>
    </form>
  );
}

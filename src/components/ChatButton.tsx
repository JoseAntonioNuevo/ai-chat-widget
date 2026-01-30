'use client';

import type { CSSProperties, ReactNode } from 'react';
import type { ResolvedTheme } from '../themes/types';
import type { Position } from '../types';
import { ChatIcon, CloseIcon } from './Icons';

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

export function ChatButton({
  theme,
  position,
  isOpen,
  onClick,
  openLabel,
  closeLabel,
  zIndex,
  openIcon,
  closeIcon,
}: ChatButtonProps) {
  const positionStyles: CSSProperties =
    position === 'bottom-left'
      ? { left: '1rem', right: 'auto' }
      : { right: '1rem', left: 'auto' };

  const buttonStyle: CSSProperties = {
    position: 'fixed',
    bottom: '1rem',
    ...positionStyles,
    zIndex,
    display: 'flex',
    height: '3.5rem',
    width: '3.5rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: theme.primary,
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    boxShadow: `0 4px 20px ${theme.primary}66`,
    transition: 'all 0.2s',
  };

  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? closeLabel : openLabel}
      aria-expanded={isOpen}
      style={buttonStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.backgroundColor = theme.primaryHover;
        e.currentTarget.style.boxShadow = `0 6px 24px ${theme.primary}80`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.backgroundColor = theme.primary;
        e.currentTarget.style.boxShadow = `0 4px 20px ${theme.primary}66`;
      }}
    >
      {isOpen ? (closeIcon ?? <CloseIcon />) : (openIcon ?? <ChatIcon />)}
    </button>
  );
}

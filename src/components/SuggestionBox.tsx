'use client';

import { useState, type CSSProperties } from 'react';
import type { ResolvedTheme } from '../themes/types';

interface SuggestionBoxProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  theme: ResolvedTheme;
  title: string;
}

export function SuggestionBox({ suggestions, onSelect, theme, title }: SuggestionBoxProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!suggestions?.length) return null;

  const containerStyle: CSSProperties = {
    marginTop: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  };

  const titleStyle: CSSProperties = {
    fontSize: '0.75rem',
    color: theme.textSecondary,
    marginBottom: '0.25rem',
  };

  const getButtonStyle = (isHovered: boolean): CSSProperties => ({
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    backgroundColor: isHovered ? theme.primary : theme.surface,
    color: isHovered ? '#ffffff' : theme.text,
    border: `1px solid ${isHovered ? theme.primary : theme.border}`,
    borderRadius: '0.5rem',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  });

  return (
    <div style={containerStyle}>
      <span style={titleStyle}>{title}</span>
      {suggestions.slice(0, 3).map((suggestion, index) => (
        <button
          key={index}
          type="button"
          style={getButtonStyle(hoveredIndex === index)}
          onClick={() => onSelect(suggestion)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}

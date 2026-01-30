'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'ai-chat-widget-size';

export type ResizeCorner = 'nw' | 'ne' | 'sw' | 'se';

interface StoredSize {
  width: number;
  height: number;
}

interface UseResizeOptions {
  initialWidth: number;
  initialHeight: number;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  enabled: boolean;
}

interface UseResizeReturn {
  width: number;
  height: number;
  isResizing: boolean;
  handleResizeStart: (corner: ResizeCorner, e: React.MouseEvent) => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function loadSavedSize(): StoredSize | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (typeof parsed.width === 'number' && typeof parsed.height === 'number') {
      return parsed;
    }
  } catch {
    // Invalid stored data, ignore
  }
  return null;
}

function saveSize(size: StoredSize): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(size));
  } catch {
    // Storage full or unavailable, ignore
  }
}

export function useResize({
  initialWidth,
  initialHeight,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  enabled,
}: UseResizeOptions): UseResizeReturn {
  const [width, setWidth] = useState(() => {
    if (!enabled) return initialWidth;
    const saved = loadSavedSize();
    return saved ? clamp(saved.width, minWidth, maxWidth) : initialWidth;
  });

  const [height, setHeight] = useState(() => {
    if (!enabled) return initialHeight;
    const saved = loadSavedSize();
    return saved ? clamp(saved.height, minHeight, maxHeight) : initialHeight;
  });

  const [isResizing, setIsResizing] = useState(false);

  const resizeState = useRef<{
    corner: ResizeCorner;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);

  const handleResizeStart = useCallback(
    (corner: ResizeCorner, e: React.MouseEvent) => {
      if (!enabled) return;
      e.preventDefault();
      e.stopPropagation();

      resizeState.current = {
        corner,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: width,
        startHeight: height,
      };
      setIsResizing(true);

      // Prevent text selection during resize
      document.body.style.userSelect = 'none';
      document.body.style.cursor = corner === 'nw' || corner === 'se' ? 'nwse-resize' : 'nesw-resize';
    },
    [enabled, width, height]
  );

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeState.current) return;

      const { corner, startX, startY, startWidth, startHeight } = resizeState.current;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      // Calculate new dimensions based on corner
      switch (corner) {
        case 'se':
          newWidth = startWidth + deltaX;
          newHeight = startHeight + deltaY;
          break;
        case 'sw':
          newWidth = startWidth - deltaX;
          newHeight = startHeight + deltaY;
          break;
        case 'ne':
          newWidth = startWidth + deltaX;
          newHeight = startHeight - deltaY;
          break;
        case 'nw':
          newWidth = startWidth - deltaX;
          newHeight = startHeight - deltaY;
          break;
      }

      // Clamp to constraints
      newWidth = clamp(newWidth, minWidth, maxWidth);
      newHeight = clamp(newHeight, minHeight, maxHeight);

      setWidth(newWidth);
      setHeight(newHeight);
    };

    const handleMouseUp = () => {
      if (resizeState.current) {
        // Save final size
        saveSize({ width, height });
      }
      resizeState.current = null;
      setIsResizing(false);

      // Restore body styles
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, width, height, minWidth, maxWidth, minHeight, maxHeight]);

  // Save size when it changes (after resize ends)
  useEffect(() => {
    if (!isResizing && enabled) {
      saveSize({ width, height });
    }
  }, [width, height, isResizing, enabled]);

  return { width, height, isResizing, handleResizeStart };
}

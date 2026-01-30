'use client';

import type { CSSProperties } from 'react';
import type { ResizeCorner } from '../hooks/useResize';

interface ResizeHandlesProps {
  onResizeStart: (corner: ResizeCorner, e: React.MouseEvent) => void;
  isResizing: boolean;
}

const HANDLE_SIZE = 16;

const baseHandleStyle: CSSProperties = {
  position: 'absolute',
  width: HANDLE_SIZE,
  height: HANDLE_SIZE,
  zIndex: 10,
  // Invisible but interactive
  background: 'transparent',
};

const corners: { corner: ResizeCorner; style: CSSProperties; cursor: string }[] = [
  {
    corner: 'nw',
    style: { top: 0, left: 0 },
    cursor: 'nwse-resize',
  },
  {
    corner: 'ne',
    style: { top: 0, right: 0 },
    cursor: 'nesw-resize',
  },
  {
    corner: 'sw',
    style: { bottom: 0, left: 0 },
    cursor: 'nesw-resize',
  },
  {
    corner: 'se',
    style: { bottom: 0, right: 0 },
    cursor: 'nwse-resize',
  },
];

export function ResizeHandles({ onResizeStart, isResizing }: ResizeHandlesProps) {
  return (
    <>
      {corners.map(({ corner, style, cursor }) => (
        <div
          key={corner}
          aria-hidden="true"
          style={{
            ...baseHandleStyle,
            ...style,
            cursor: isResizing ? cursor : cursor,
          }}
          onMouseDown={(e) => onResizeStart(corner, e)}
        />
      ))}
    </>
  );
}

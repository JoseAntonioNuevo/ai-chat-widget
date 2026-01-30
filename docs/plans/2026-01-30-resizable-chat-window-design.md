# Resizable Chat Window Design

## Overview

Make the chat widget fully resizable by users with developer-configurable constraints.

## Requirements

- User-draggable resize from all 4 corners
- Developer constraints: minWidth, maxWidth, minHeight, maxHeight
- `resizable` prop to disable user resizing
- LocalStorage persistence for user-set size
- No window dragging (stays anchored to position)
- Disable resize on mobile (< 640px), use near-fullscreen instead

## New Props API

```typescript
interface ChatWidgetProps {
  // Existing props...

  /**
   * Enable user-resizable chat window
   * When true, users can drag corners to resize
   * Disabled automatically on mobile (<640px)
   * @default true
   */
  resizable?: boolean;

  /**
   * Minimum width constraint
   * @default '300px'
   */
  minWidth?: string;

  /**
   * Maximum width constraint
   * @default '600px'
   */
  maxWidth?: string;

  /**
   * Minimum height constraint
   * @default '400px'
   */
  minHeight?: string;

  /**
   * Maximum height constraint
   * @default '80vh'
   */
  maxHeight?: string;
}
```

The existing `width` and `height` props become the initial/default size. User-resized dimensions stored in localStorage take precedence.

## Resize Handles

4 corner handles only (simpler, cleaner):

```
┌─────────────────────────────────────┐
│ nw                               ne │  ← 16x16px corner hit areas
│                                     │
│                                     │
│                                     │
│                                     │
│ sw                               se │
└─────────────────────────────────────┘
```

- 4 absolutely-positioned invisible `<div>` elements
- Hit area: 16x16px
- CSS cursors: `nwse-resize` (nw, se), `nesw-resize` (ne, sw)

## useResize Hook

```typescript
// src/hooks/useResize.ts

interface UseResizeOptions {
  initialWidth: number;
  initialHeight: number;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  storageKey: string;  // 'ai-chat-widget-size'
  enabled: boolean;    // from resizable prop
}

interface UseResizeReturn {
  width: number;
  height: number;
  isResizing: boolean;
  handleResizeStart: (corner: 'nw' | 'ne' | 'sw' | 'se', e: MouseEvent) => void;
}
```

**Logic flow:**
1. On mount: check localStorage for saved size, validate against constraints
2. On resize start: capture initial size + mouse position + corner
3. On mouse move: calculate delta, apply based on corner, clamp to min/max
4. On mouse up: save to localStorage, end resize
5. Uses `document.addEventListener` for mouse events during drag

## Mobile Behavior

**Detection:** `window.matchMedia('(max-width: 639px)')`

**Mobile mode (< 640px):**
- Resize handles not rendered
- Near-fullscreen: width `calc(100vw - 1rem)`, height `calc(100vh - 7rem)`
- Ignores localStorage and constraints

**Desktop mode (≥ 640px):**
- Resize handles rendered if `resizable !== false`
- Uses localStorage or initial props
- Constraints enforced

**Responsive:** Switches modes when browser resizes across breakpoint.

## File Changes

**Create:**
- `src/hooks/useResize.ts` - resize logic hook
- `src/components/ResizeHandles.tsx` - corner handle components

**Modify:**
- `src/types.ts` - add new props
- `src/ChatWidget.tsx` - integrate useResize, pass dimensions
- `src/components/ChatWindow.tsx` - render ResizeHandles, dynamic dimensions, mobile detection

## localStorage

**Key:** `ai-chat-widget-size`

**Format:**
```json
{ "width": 420, "height": 550 }
```

## CSS Considerations

- During resize: `user-select: none` on body
- Resize cursor on document during drag
- Optional smooth transition when not resizing

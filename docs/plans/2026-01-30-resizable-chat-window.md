# Resizable Chat Window Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add user-resizable chat window with corner drag handles, localStorage persistence, and developer-configurable constraints.

**Architecture:** New `useResize` hook manages resize state/logic, `ResizeHandles` component renders 4 corner handles. ChatWindow integrates both, with mobile detection to disable resize on small screens (<640px).

**Tech Stack:** React 19, TypeScript 5.9, CSS-in-JS (inline styles)

---

## Task 1: Add New Props to Types

**Files:**
- Modify: `src/types.ts:188-205`

**Step 1: Add resize-related props to ChatWidgetProps interface**

Add after the `height` prop (around line 198):

```typescript
  /**
   * Enable user-resizable chat window
   * When true, users can drag corners to resize
   * Disabled automatically on mobile (<640px)
   * @default true
   */
  resizable?: boolean;

  /**
   * Minimum width constraint for resizing
   * @default '300px'
   */
  minWidth?: string;

  /**
   * Maximum width constraint for resizing
   * @default '600px'
   */
  maxWidth?: string;

  /**
   * Minimum height constraint for resizing
   * @default '400px'
   */
  minHeight?: string;

  /**
   * Maximum height constraint for resizing
   * @default '80vh'
   */
  maxHeight?: string;
```

**Step 2: Verify TypeScript compiles**

Run: `pnpm typecheck`
Expected: No errors

---

## Task 2: Create useResize Hook

**Files:**
- Create: `src/hooks/useResize.ts`

**Step 1: Create the hook file**

```typescript
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
```

**Step 2: Verify TypeScript compiles**

Run: `pnpm typecheck`
Expected: No errors

---

## Task 3: Create ResizeHandles Component

**Files:**
- Create: `src/components/ResizeHandles.tsx`

**Step 1: Create the component**

```typescript
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
```

**Step 2: Export from components index**

Add to `src/components/index.ts`:

```typescript
export { ResizeHandles } from './ResizeHandles';
```

**Step 3: Verify TypeScript compiles**

Run: `pnpm typecheck`
Expected: No errors

---

## Task 4: Create useMobileDetect Hook

**Files:**
- Create: `src/hooks/useMobileDetect.ts`

**Step 1: Create the hook**

```typescript
'use client';

import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 640;

export function useMobileDetect(): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    // Set initial value
    setIsMobile(mediaQuery.matches);

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isMobile;
}
```

**Step 2: Create hooks index for exports**

Create `src/hooks/index.ts`:

```typescript
export { useScrollToBottom } from './useScrollToBottom';
export { useResize } from './useResize';
export type { ResizeCorner } from './useResize';
export { useMobileDetect } from './useMobileDetect';
```

**Step 3: Verify TypeScript compiles**

Run: `pnpm typecheck`
Expected: No errors

---

## Task 5: Update ChatWindow to Support Resize

**Files:**
- Modify: `src/components/ChatWindow.tsx`

**Step 1: Add new props to ChatWindowProps interface**

Update the interface to include resize-related props:

```typescript
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
  width: number;           // Changed from string to number
  height: number;          // Changed from string to number
  zIndex: number;
  showSuggestions: boolean;
  isClosing?: boolean;
  // New resize props
  resizable: boolean;
  isMobile: boolean;
  isResizing: boolean;
  onResizeStart: (corner: 'nw' | 'ne' | 'sw' | 'se', e: React.MouseEvent) => void;
}
```

**Step 2: Import ResizeHandles**

Add import at top:

```typescript
import { ResizeHandles } from './ResizeHandles';
```

**Step 3: Update component to use new props**

Update the function signature and windowStyle:

```typescript
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
}: ChatWindowProps) {
```

Update windowStyle to use pixel values and handle mobile:

```typescript
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
```

**Step 4: Add ResizeHandles to the render**

Inside the main div, add ResizeHandles before the closing tag:

```typescript
      {/* Resize Handles (desktop only, when enabled) */}
      {resizable && !isMobile && (
        <ResizeHandles onResizeStart={onResizeStart} isResizing={isResizing} />
      )}
```

**Step 5: Verify TypeScript compiles**

Run: `pnpm typecheck`
Expected: No errors (may have errors in ChatWidget.tsx until Task 6)

---

## Task 6: Integrate Resize in ChatWidget

**Files:**
- Modify: `src/ChatWidget.tsx`

**Step 1: Update InternalChatWidgetProps interface**

Change width/height from string to number and add new props:

```typescript
interface InternalChatWidgetProps {
  apiUrl: string;
  theme: ReturnType<typeof resolveTheme>;
  position: Position;
  labels: Labels;
  title?: string;
  placeholder: string;
  greeting?: string;
  defaultOpen: boolean;
  width: number;              // Changed from string
  height: number;             // Changed from string
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  resizable: boolean;
  zIndex: number;
  lang: string;
  icon?: CustomIcons;
  headerIcon?: ReactNode;
  fontFamily: string;
  loadDefaultFont: boolean;
  showSuggestions: boolean;
}
```

**Step 2: Add imports**

Add at top of file:

```typescript
import { useResize } from './hooks/useResize';
import { useMobileDetect } from './hooks/useMobileDetect';
```

**Step 3: Update ChatWidgetInternal to use resize hooks**

Add after existing state declarations:

```typescript
  const isMobile = useMobileDetect();

  const { width: currentWidth, height: currentHeight, isResizing, handleResizeStart } = useResize({
    initialWidth: width,
    initialHeight: height,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    enabled: resizable && !isMobile,
  });
```

**Step 4: Update ChatWindow props**

Pass the new props to ChatWindow:

```typescript
        <ChatWindow
          theme={theme}
          position={position}
          messages={messages}
          input={input}
          onInputChange={setInput}
          onSubmit={handleSubmit}
          onRetry={handleRetry}
          onClose={toggleChat}
          onRestart={handleRestart}
          onSuggestionSelect={handleSuggestionSelect}
          isLoading={isLoading}
          error={error}
          labels={labels}
          title={title}
          headerIcon={headerIcon}
          placeholder={placeholder}
          width={currentWidth}
          height={currentHeight}
          zIndex={zIndex}
          showSuggestions={showSuggestions}
          isClosing={isClosing}
          resizable={resizable}
          isMobile={isMobile}
          isResizing={isResizing}
          onResizeStart={handleResizeStart}
        />
```

**Step 5: Update ChatWidget main component**

Add a helper function to parse CSS values to pixels:

```typescript
function parseCssSize(value: string, fallback: number): number {
  if (value.endsWith('px')) {
    return parseInt(value, 10) || fallback;
  }
  if (value.endsWith('vh')) {
    return (parseInt(value, 10) / 100) * window.innerHeight || fallback;
  }
  if (value.endsWith('vw')) {
    return (parseInt(value, 10) / 100) * window.innerWidth || fallback;
  }
  return parseInt(value, 10) || fallback;
}
```

Update the ChatWidget component to handle new props:

```typescript
export function ChatWidget({
  apiUrl,
  theme: themeProp,
  position = 'bottom-right',
  lang = 'en',
  labels: customLabels,
  greeting,
  defaultOpen = false,
  title: customTitle,
  placeholder: customPlaceholder,
  width = '380px',
  height = '500px',
  minWidth = '300px',
  maxWidth = '600px',
  minHeight = '400px',
  maxHeight = '80vh',
  resizable = true,
  zIndex = 50,
  icon,
  headerIcon,
  fontFamily: customFontFamily,
  showSuggestions = true,
}: ChatWidgetProps) {
  const theme = resolveTheme(themeProp);
  const labels = mergeLabels(lang, customLabels);
  const title = customTitle === '' || customTitle === false
    ? undefined
    : (customTitle ?? labels.title);
  const placeholder = customPlaceholder ?? labels.placeholder;

  const fontFamily = customFontFamily ?? DEFAULT_FONT_FAMILY;
  const loadDefaultFont = !customFontFamily;

  // Parse CSS sizes to pixels
  const widthPx = parseCssSize(width, 380);
  const heightPx = parseCssSize(height, 500);
  const minWidthPx = parseCssSize(minWidth, 300);
  const maxWidthPx = parseCssSize(maxWidth, 600);
  const minHeightPx = parseCssSize(minHeight, 400);
  const maxHeightPx = parseCssSize(maxHeight, typeof window !== 'undefined' ? window.innerHeight * 0.8 : 600);

  return (
    <ChatErrorBoundary>
      <ChatWidgetInternal
        apiUrl={apiUrl}
        theme={theme}
        position={position}
        labels={labels}
        title={title}
        placeholder={placeholder}
        greeting={greeting}
        defaultOpen={defaultOpen}
        width={widthPx}
        height={heightPx}
        minWidth={minWidthPx}
        maxWidth={maxWidthPx}
        minHeight={minHeightPx}
        maxHeight={maxHeightPx}
        resizable={resizable}
        zIndex={zIndex}
        lang={lang}
        icon={icon}
        headerIcon={headerIcon}
        fontFamily={fontFamily}
        loadDefaultFont={loadDefaultFont}
        showSuggestions={showSuggestions}
      />
    </ChatErrorBoundary>
  );
}
```

**Step 6: Verify TypeScript compiles**

Run: `pnpm typecheck`
Expected: No errors

---

## Task 7: Build and Test

**Files:**
- None (testing only)

**Step 1: Run full build**

Run: `pnpm build`
Expected: Build completes successfully

**Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: No errors

**Step 3: Run lint**

Run: `pnpm lint`
Expected: No errors (or only pre-existing warnings)

---

## Task 8: Update README Documentation

**Files:**
- Modify: `README.md`

**Step 1: Add resize props to documentation**

Add a new section about resizing in the props documentation:

```markdown
### Resizing

The chat window is resizable by default. Users can drag any corner to resize.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `resizable` | `boolean` | `true` | Enable user-resizable chat window |
| `minWidth` | `string` | `'300px'` | Minimum width constraint |
| `maxWidth` | `string` | `'600px'` | Maximum width constraint |
| `minHeight` | `string` | `'400px'` | Minimum height constraint |
| `maxHeight` | `string` | `'80vh'` | Maximum height constraint |

```tsx
// Disable resizing
<ChatWidget apiUrl="/api/chat" resizable={false} />

// Custom constraints
<ChatWidget
  apiUrl="/api/chat"
  width="400px"
  height="600px"
  minWidth="320px"
  maxWidth="800px"
  minHeight="300px"
  maxHeight="90vh"
/>
```

**Notes:**
- Resize is automatically disabled on mobile devices (< 640px width)
- User-set sizes are persisted in localStorage
- The `width` and `height` props set the initial/default size
```

**Step 2: Verify documentation renders correctly**

Review the README to ensure formatting is correct.

---

## Summary

After completing all tasks, the widget will have:

1. **New props:** `resizable`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight`
2. **Corner resize handles:** 4 invisible but interactive corners for dragging
3. **localStorage persistence:** Size saved automatically, restored on reload
4. **Mobile detection:** Resize disabled on screens < 640px, uses near-fullscreen
5. **Smooth UX:** Transitions when not resizing, proper cursor feedback

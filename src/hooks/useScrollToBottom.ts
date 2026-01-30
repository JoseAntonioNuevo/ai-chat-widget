import { useCallback, useRef, useEffect } from 'react';

/**
 * Hook for auto-scrolling to bottom of a container
 *
 * @param deps - Dependencies that trigger scroll when changed
 * @returns Ref to attach to the scroll target element
 */
export function useScrollToBottom(deps: unknown[]) {
  const ref = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
    // deps is intentionally spread - we want to react to array contents
  }, [scrollToBottom, ...deps]);

  return { ref, scrollToBottom };
}

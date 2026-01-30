import { useCallback, useRef, useEffect } from 'react';

/**
 * Hook for auto-scrolling to bottom of a container
 *
 * Only scrolls when:
 * - A new message is added (messageCount changes)
 * - During streaming (isLoading is true)
 *
 * Does NOT scroll when suggestions load after streaming ends,
 * which prevents interrupting the user while they're reading.
 *
 * @param messageCount - Number of messages (triggers scroll when changes)
 * @param isLoading - Whether the assistant is currently streaming
 * @returns Ref to attach to the scroll target element
 */
export function useScrollToBottom(messageCount: number, isLoading: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const prevMessageCount = useRef(messageCount);

  const scrollToBottom = useCallback(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const messageAdded = messageCount > prevMessageCount.current;
    prevMessageCount.current = messageCount;

    // Scroll when a new message is added or during streaming
    if (messageAdded || isLoading) {
      scrollToBottom();
    }
  }, [messageCount, isLoading, scrollToBottom]);

  return { ref, scrollToBottom };
}

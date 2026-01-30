import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRateLimitRetry } from './useRateLimitRetry';
import type { ErrorInfo } from '../utils/errorTypes';

describe('useRateLimitRetry', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createRateLimitError = (retryAfterSeconds?: number): ErrorInfo => ({
    type: 'rate_limit',
    originalError: new Error('Rate limit exceeded'),
    statusCode: 429,
    retryAfterSeconds,
    isRetriable: true,
  });

  const createGenericError = (): ErrorInfo => ({
    type: 'generic',
    originalError: new Error('Something went wrong'),
    isRetriable: false,
  });

  it('returns initial state with no error', () => {
    const onRetry = vi.fn();
    const { result } = renderHook(() =>
      useRateLimitRetry({
        errorInfo: null,
        onRetry,
      })
    );

    expect(result.current.countdown).toBe(0);
    expect(result.current.isAutoRetrying).toBe(false);
    expect(result.current.retryAttempt).toBe(0);
  });

  it('starts countdown when rate limit error occurs', () => {
    const onRetry = vi.fn();
    const errorInfo = createRateLimitError();

    const { result } = renderHook(() =>
      useRateLimitRetry({
        errorInfo,
        onRetry,
        autoRetry: false,
      })
    );

    // Should have a countdown > 0
    expect(result.current.countdown).toBeGreaterThan(0);
    expect(result.current.retryAttempt).toBe(1);
  });

  it('uses server retryAfterSeconds when provided', () => {
    const onRetry = vi.fn();
    const errorInfo = createRateLimitError(10); // 10 seconds

    const { result } = renderHook(() =>
      useRateLimitRetry({
        errorInfo,
        onRetry,
        autoRetry: false,
      })
    );

    expect(result.current.countdown).toBe(10);
  });

  it('does not start countdown for non-rate-limit errors', () => {
    const onRetry = vi.fn();
    const errorInfo = createGenericError();

    const { result } = renderHook(() =>
      useRateLimitRetry({
        errorInfo,
        onRetry,
      })
    );

    expect(result.current.countdown).toBe(0);
    expect(result.current.retryAttempt).toBe(0);
  });

  it('decrements countdown every second', () => {
    const onRetry = vi.fn();
    const errorInfo = createRateLimitError(5);

    const { result } = renderHook(() =>
      useRateLimitRetry({
        errorInfo,
        onRetry,
        autoRetry: false,
      })
    );

    expect(result.current.countdown).toBe(5);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.countdown).toBe(4);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.countdown).toBe(3);
  });

  it('auto-retries when enabled and countdown reaches 0', () => {
    const onRetry = vi.fn();
    const errorInfo = createRateLimitError(2);

    renderHook(() =>
      useRateLimitRetry({
        errorInfo,
        onRetry,
        autoRetry: true,
        maxRetries: 3,
      })
    );

    expect(onRetry).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('sets isAutoRetrying to true when autoRetry is enabled', () => {
    const onRetry = vi.fn();
    const errorInfo = createRateLimitError(5);

    const { result } = renderHook(() =>
      useRateLimitRetry({
        errorInfo,
        onRetry,
        autoRetry: true,
        maxRetries: 3,
      })
    );

    expect(result.current.isAutoRetrying).toBe(true);
  });

  it('cancelAutoRetry stops the countdown and auto-retry', () => {
    const onRetry = vi.fn();
    const errorInfo = createRateLimitError(5);

    const { result } = renderHook(() =>
      useRateLimitRetry({
        errorInfo,
        onRetry,
        autoRetry: true,
      })
    );

    expect(result.current.isAutoRetrying).toBe(true);
    expect(result.current.countdown).toBe(5);

    act(() => {
      result.current.cancelAutoRetry();
    });

    expect(result.current.isAutoRetrying).toBe(false);
    expect(result.current.countdown).toBe(0);

    // Advance timers - should not call onRetry
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(onRetry).not.toHaveBeenCalled();
  });

  it('manualRetry calls onRetry and resets state', () => {
    const onRetry = vi.fn();
    const errorInfo = createRateLimitError(10);

    const { result } = renderHook(() =>
      useRateLimitRetry({
        errorInfo,
        onRetry,
        autoRetry: true,
      })
    );

    expect(result.current.retryAttempt).toBe(1);

    act(() => {
      result.current.manualRetry();
    });

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(result.current.retryAttempt).toBe(0);
    expect(result.current.countdown).toBe(0);
    expect(result.current.isAutoRetrying).toBe(false);
  });

  it('does not auto-retry when maxRetries is exceeded', () => {
    const onRetry = vi.fn();
    const errorInfo = createRateLimitError(1);

    const { result } = renderHook(() =>
      useRateLimitRetry({
        errorInfo,
        onRetry,
        autoRetry: true,
        maxRetries: 0, // No retries allowed
      })
    );

    expect(result.current.isAutoRetrying).toBe(false);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onRetry).not.toHaveBeenCalled();
  });

  it('resets state when error is cleared', () => {
    const onRetry = vi.fn();
    const errorInfo = createRateLimitError(10);

    const { result, rerender } = renderHook(
      ({ errorInfo }: { errorInfo: ErrorInfo | null }) =>
        useRateLimitRetry({
          errorInfo,
          onRetry,
          autoRetry: true,
        }),
      { initialProps: { errorInfo: errorInfo as ErrorInfo | null } }
    );

    expect(result.current.countdown).toBe(10);
    expect(result.current.retryAttempt).toBe(1);

    // Clear the error
    rerender({ errorInfo: null });

    expect(result.current.countdown).toBe(0);
    expect(result.current.retryAttempt).toBe(0);
    expect(result.current.isAutoRetrying).toBe(false);
  });

  it('uses exponential backoff for retry delays', () => {
    const onRetry = vi.fn();
    const errorInfo = createRateLimitError(); // No server-provided retry-after

    const { result } = renderHook(() =>
      useRateLimitRetry({
        errorInfo,
        onRetry,
        autoRetry: false,
        baseDelayMs: 1000,
      })
    );

    // First attempt should use base delay (1 second, ±jitter)
    // The countdown should be 1 or 2 depending on jitter
    expect(result.current.countdown).toBeGreaterThanOrEqual(1);
    expect(result.current.countdown).toBeLessThanOrEqual(2);
  });

  it('respects maxDelayMs cap', () => {
    const onRetry = vi.fn();
    const errorInfo = createRateLimitError(1000); // Server says 1000 seconds

    const { result } = renderHook(() =>
      useRateLimitRetry({
        errorInfo,
        onRetry,
        autoRetry: false,
        maxDelayMs: 5000, // Cap at 5 seconds
      })
    );

    // Should be capped at 5 seconds
    expect(result.current.countdown).toBe(5);
  });
});

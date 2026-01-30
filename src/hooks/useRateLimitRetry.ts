import { useState, useEffect, useCallback, useRef } from 'react';
import type { ErrorInfo, RateLimitOptions } from '../utils/errorTypes';

interface UseRateLimitRetryOptions extends RateLimitOptions {
  errorInfo: ErrorInfo | null;
  onRetry: () => void;
}

interface UseRateLimitRetryResult {
  /** Current countdown in seconds (0 when not counting down) */
  countdown: number;
  /** Whether auto-retry is currently active */
  isAutoRetrying: boolean;
  /** Current retry attempt number (1-based) */
  retryAttempt: number;
  /** Cancel the current auto-retry */
  cancelAutoRetry: () => void;
  /** Manually trigger retry (resets attempt counter) */
  manualRetry: () => void;
}

const DEFAULT_OPTIONS: Required<RateLimitOptions> = {
  autoRetry: false,
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,
};

/**
 * Calculate exponential backoff delay with jitter
 */
function calculateBackoffDelay(
  attempt: number,
  baseDelayMs: number,
  maxDelayMs: number,
  serverRetryAfterSeconds?: number
): number {
  // If server provided a retry-after, use that (converted to ms)
  if (serverRetryAfterSeconds && serverRetryAfterSeconds > 0) {
    return Math.min(serverRetryAfterSeconds * 1000, maxDelayMs);
  }

  // Exponential backoff: base * 2^(attempt-1)
  const exponentialDelay = baseDelayMs * Math.pow(2, attempt - 1);

  // Add jitter (up to 25% random variation)
  const jitter = exponentialDelay * 0.25 * Math.random();

  return Math.min(exponentialDelay + jitter, maxDelayMs);
}

/**
 * Hook for handling rate limit errors with countdown and auto-retry
 *
 * @example
 * ```tsx
 * const { countdown, isAutoRetrying, cancelAutoRetry, manualRetry } = useRateLimitRetry({
 *   errorInfo,
 *   onRetry: handleRetry,
 *   autoRetry: true,
 *   maxRetries: 3,
 * });
 *
 * if (countdown > 0) {
 *   return <div>Retry in {countdown}s</div>;
 * }
 * ```
 */
export function useRateLimitRetry({
  errorInfo,
  onRetry,
  autoRetry = DEFAULT_OPTIONS.autoRetry,
  maxRetries = DEFAULT_OPTIONS.maxRetries,
  baseDelayMs = DEFAULT_OPTIONS.baseDelayMs,
  maxDelayMs = DEFAULT_OPTIONS.maxDelayMs,
}: UseRateLimitRetryOptions): UseRateLimitRetryResult {
  const [countdown, setCountdown] = useState(0);
  const [isAutoRetrying, setIsAutoRetrying] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);

  // Track the error to detect when it changes
  const prevErrorRef = useRef<Error | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timers
  const clearTimers = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  // Cancel auto-retry
  const cancelAutoRetry = useCallback(() => {
    clearTimers();
    setIsAutoRetrying(false);
    setCountdown(0);
  }, [clearTimers]);

  // Manual retry (resets attempt counter)
  const manualRetry = useCallback(() => {
    clearTimers();
    setIsAutoRetrying(false);
    setCountdown(0);
    setRetryAttempt(0);
    onRetry();
  }, [clearTimers, onRetry]);

  // Start countdown and auto-retry
  const startCountdown = useCallback(
    (delayMs: number, attempt: number) => {
      clearTimers();

      const seconds = Math.ceil(delayMs / 1000);
      setCountdown(seconds);
      setIsAutoRetrying(autoRetry && attempt <= maxRetries);

      // Update countdown every second
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
              countdownIntervalRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Schedule retry if auto-retry is enabled
      if (autoRetry && attempt <= maxRetries) {
        retryTimeoutRef.current = setTimeout(() => {
          setIsAutoRetrying(false);
          setCountdown(0);
          onRetry();
        }, delayMs);
      }
    },
    [autoRetry, maxRetries, clearTimers, onRetry]
  );

  // Handle error changes
  useEffect(() => {
    const currentError = errorInfo?.originalError ?? null;

    // Error cleared - reset state
    if (!errorInfo || errorInfo.type !== 'rate_limit') {
      if (prevErrorRef.current !== null) {
        cancelAutoRetry();
        setRetryAttempt(0);
      }
      prevErrorRef.current = currentError;
      return;
    }

    // New rate limit error
    if (currentError !== prevErrorRef.current) {
      prevErrorRef.current = currentError;

      const newAttempt = retryAttempt + 1;
      setRetryAttempt(newAttempt);

      const delayMs = calculateBackoffDelay(
        newAttempt,
        baseDelayMs,
        maxDelayMs,
        errorInfo.retryAfterSeconds
      );

      startCountdown(delayMs, newAttempt);
    }

    return () => {
      // Cleanup on unmount
    };
  }, [errorInfo, retryAttempt, baseDelayMs, maxDelayMs, startCountdown, cancelAutoRetry]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return {
    countdown,
    isAutoRetrying,
    retryAttempt,
    cancelAutoRetry,
    manualRetry,
  };
}

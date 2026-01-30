import type { ErrorInfo, ErrorType } from './errorTypes';

/**
 * Patterns that indicate a rate limit error
 */
const RATE_LIMIT_PATTERNS = [
  /rate.?limit/i,
  /too.?many.?requests/i,
  /quota.?exceeded/i,
  /throttl/i,
  /try.?again.?later/i,
  /request.?limit/i,
  /api.?limit/i,
];

/**
 * Extract HTTP status code from error
 */
function extractStatusCode(error: Error): number | undefined {
  // Check common error properties
  const err = error as unknown as Record<string, unknown>;

  if (typeof err.status === 'number') return err.status;
  if (typeof err.statusCode === 'number') return err.statusCode;
  if (typeof err.code === 'number') return err.code;

  // Check response object
  if (err.response && typeof err.response === 'object') {
    const response = err.response as Record<string, unknown>;
    if (typeof response.status === 'number') return response.status;
    if (typeof response.statusCode === 'number') return response.statusCode;
  }

  // Try to extract from message (e.g., "Request failed with status 429")
  const statusMatch = error.message.match(/status[:\s]+(\d{3})/i);
  if (statusMatch) {
    return parseInt(statusMatch[1], 10);
  }

  return undefined;
}

/**
 * Extract retry-after seconds from error
 */
function extractRetryAfter(error: Error): number | undefined {
  const err = error as unknown as Record<string, unknown>;

  // Check direct property
  if (typeof err.retryAfter === 'number') return err.retryAfter;
  if (typeof err.retryAfterSeconds === 'number') return err.retryAfterSeconds;

  // Check headers
  if (err.headers && typeof err.headers === 'object') {
    const headers = err.headers as Record<string, unknown>;
    const retryAfterHeader = headers['retry-after'] || headers['Retry-After'];
    if (typeof retryAfterHeader === 'string') {
      const seconds = parseInt(retryAfterHeader, 10);
      if (!isNaN(seconds)) return seconds;
    }
    if (typeof retryAfterHeader === 'number') return retryAfterHeader;
  }

  // Check response headers
  if (err.response && typeof err.response === 'object') {
    const response = err.response as Record<string, unknown>;
    if (response.headers && typeof response.headers === 'object') {
      const headers = response.headers as Record<string, unknown>;
      const retryAfterHeader = headers['retry-after'] || headers['Retry-After'];
      if (typeof retryAfterHeader === 'string') {
        const seconds = parseInt(retryAfterHeader, 10);
        if (!isNaN(seconds)) return seconds;
      }
      if (typeof retryAfterHeader === 'number') return retryAfterHeader;
    }
  }

  // Try to extract from message (e.g., "try again in 30 seconds")
  const secondsMatch = error.message.match(/(?:in|after)\s+(\d+)\s*(?:second|sec|s\b)/i);
  if (secondsMatch) {
    return parseInt(secondsMatch[1], 10);
  }

  return undefined;
}

/**
 * Check if error message matches rate limit patterns
 */
function matchesRateLimitPattern(message: string): boolean {
  return RATE_LIMIT_PATTERNS.some((pattern) => pattern.test(message));
}

/**
 * Determine error type from error object
 */
function determineErrorType(error: Error, statusCode?: number): ErrorType {
  const message = error.message.toLowerCase();

  // Check status code first (most reliable)
  if (statusCode === 429) return 'rate_limit';
  if (statusCode === 401 || statusCode === 403) return 'auth';
  if (statusCode && statusCode >= 500) return 'server';

  // Check message patterns
  if (matchesRateLimitPattern(error.message)) return 'rate_limit';

  // Network errors
  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('connection') ||
    message.includes('timeout') ||
    message.includes('offline')
  ) {
    return 'network';
  }

  // Auth errors
  if (message.includes('unauthorized') || message.includes('forbidden') || message.includes('auth')) {
    return 'auth';
  }

  // Server errors
  if (message.includes('server') || message.includes('internal')) {
    return 'server';
  }

  return 'generic';
}

/**
 * Determine if error type is retriable
 */
function isRetriable(type: ErrorType): boolean {
  return type === 'rate_limit' || type === 'network' || type === 'server';
}

/**
 * Classify an error and extract relevant information
 *
 * @param error - Error object from useChat or API call
 * @returns ErrorInfo object with classification, or null if error is undefined
 *
 * @example
 * ```tsx
 * const { error } = useChat({ ... });
 * const errorInfo = classifyError(error);
 *
 * if (errorInfo?.type === 'rate_limit') {
 *   console.log('Rate limited! Retry after:', errorInfo.retryAfterSeconds);
 * }
 * ```
 */
export function classifyError(error: Error | undefined): ErrorInfo | null {
  if (!error) return null;

  const statusCode = extractStatusCode(error);
  const type = determineErrorType(error, statusCode);
  const retryAfterSeconds = type === 'rate_limit' ? extractRetryAfter(error) : undefined;

  return {
    type,
    originalError: error,
    statusCode,
    retryAfterSeconds,
    isRetriable: isRetriable(type),
  };
}

/**
 * Quick check if an error is a rate limit error
 *
 * @param error - Error object to check
 * @returns true if the error is a rate limit error
 *
 * @example
 * ```tsx
 * if (isRateLimitError(error)) {
 *   showRateLimitMessage();
 * }
 * ```
 */
export function isRateLimitError(error: Error | undefined): boolean {
  if (!error) return false;

  const statusCode = extractStatusCode(error);
  if (statusCode === 429) return true;

  return matchesRateLimitPattern(error.message);
}

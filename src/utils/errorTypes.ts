/**
 * Error type classification
 */
export type ErrorType = 'rate_limit' | 'network' | 'server' | 'auth' | 'generic';

/**
 * Classified error information
 */
export interface ErrorInfo {
  /** Type of error */
  type: ErrorType;
  /** Original error object */
  originalError: Error;
  /** HTTP status code if available */
  statusCode?: number;
  /** Seconds to wait before retrying (from server or calculated) */
  retryAfterSeconds?: number;
  /** Whether this error type can be retried */
  isRetriable: boolean;
}

/**
 * Rate limit handling options
 */
export interface RateLimitOptions {
  /**
   * Enable automatic retry after rate limit
   * @default false
   */
  autoRetry?: boolean;

  /**
   * Maximum number of auto-retry attempts
   * @default 3
   */
  maxRetries?: number;

  /**
   * Base delay in milliseconds for exponential backoff
   * @default 1000
   */
  baseDelayMs?: number;

  /**
   * Maximum delay cap in milliseconds
   * @default 30000
   */
  maxDelayMs?: number;
}

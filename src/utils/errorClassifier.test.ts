import { describe, it, expect } from 'vitest';
import { classifyError, isRateLimitError } from './errorClassifier';

describe('classifyError', () => {
  it('returns null for undefined error', () => {
    expect(classifyError(undefined)).toBeNull();
  });

  describe('rate limit detection', () => {
    it('detects rate limit from status code 429', () => {
      const error = new Error('Request failed') as Error & { status: number };
      error.status = 429;

      const result = classifyError(error);
      expect(result?.type).toBe('rate_limit');
      expect(result?.statusCode).toBe(429);
      expect(result?.isRetriable).toBe(true);
    });

    it('detects rate limit from statusCode property', () => {
      const error = new Error('Request failed') as Error & { statusCode: number };
      error.statusCode = 429;

      const result = classifyError(error);
      expect(result?.type).toBe('rate_limit');
      expect(result?.statusCode).toBe(429);
    });

    it('detects rate limit from message pattern: "rate limit"', () => {
      const error = new Error('Rate limit exceeded');
      const result = classifyError(error);
      expect(result?.type).toBe('rate_limit');
    });

    it('detects rate limit from message pattern: "too many requests"', () => {
      const error = new Error('Too many requests, please slow down');
      const result = classifyError(error);
      expect(result?.type).toBe('rate_limit');
    });

    it('detects rate limit from message pattern: "quota exceeded"', () => {
      const error = new Error('API quota exceeded for this month');
      const result = classifyError(error);
      expect(result?.type).toBe('rate_limit');
    });

    it('detects rate limit from message pattern: "throttled"', () => {
      const error = new Error('Request was throttled');
      const result = classifyError(error);
      expect(result?.type).toBe('rate_limit');
    });

    it('extracts retryAfterSeconds from error property', () => {
      const error = new Error('Rate limit') as Error & { status: number; retryAfter: number };
      error.status = 429;
      error.retryAfter = 30;

      const result = classifyError(error);
      expect(result?.retryAfterSeconds).toBe(30);
    });

    it('extracts retryAfterSeconds from message', () => {
      const error = new Error('Rate limit exceeded. Try again in 45 seconds') as Error & { status: number };
      error.status = 429;

      const result = classifyError(error);
      expect(result?.retryAfterSeconds).toBe(45);
    });

    it('extracts status from message', () => {
      const error = new Error('Request failed with status 429');

      const result = classifyError(error);
      expect(result?.type).toBe('rate_limit');
      expect(result?.statusCode).toBe(429);
    });
  });

  describe('other error types', () => {
    it('detects auth error from status 401', () => {
      const error = new Error('Unauthorized') as Error & { status: number };
      error.status = 401;

      const result = classifyError(error);
      expect(result?.type).toBe('auth');
      expect(result?.isRetriable).toBe(false);
    });

    it('detects auth error from status 403', () => {
      const error = new Error('Forbidden') as Error & { status: number };
      error.status = 403;

      const result = classifyError(error);
      expect(result?.type).toBe('auth');
    });

    it('detects server error from status 500', () => {
      const error = new Error('Internal server error') as Error & { status: number };
      error.status = 500;

      const result = classifyError(error);
      expect(result?.type).toBe('server');
      expect(result?.isRetriable).toBe(true);
    });

    it('detects server error from status 503', () => {
      const error = new Error('Service unavailable') as Error & { status: number };
      error.status = 503;

      const result = classifyError(error);
      expect(result?.type).toBe('server');
    });

    it('detects network error from message', () => {
      const error = new Error('Network error: Failed to fetch');
      const result = classifyError(error);
      expect(result?.type).toBe('network');
      expect(result?.isRetriable).toBe(true);
    });

    it('detects network error from connection message', () => {
      const error = new Error('Connection refused');
      const result = classifyError(error);
      expect(result?.type).toBe('network');
    });

    it('detects network error from timeout message', () => {
      const error = new Error('Request timeout');
      const result = classifyError(error);
      expect(result?.type).toBe('network');
    });

    it('returns generic for unknown errors', () => {
      const error = new Error('Something unexpected happened');
      const result = classifyError(error);
      expect(result?.type).toBe('generic');
      expect(result?.isRetriable).toBe(false);
    });
  });

  describe('response object handling', () => {
    it('extracts status from response object', () => {
      const error = new Error('Request failed') as Error & { response: { status: number } };
      error.response = { status: 429 };

      const result = classifyError(error);
      expect(result?.type).toBe('rate_limit');
      expect(result?.statusCode).toBe(429);
    });

    it('extracts retry-after from response headers', () => {
      const error = new Error('Request failed') as Error & {
        status: number;
        response: { headers: { 'retry-after': string } };
      };
      error.status = 429;
      error.response = { headers: { 'retry-after': '60' } };

      const result = classifyError(error);
      expect(result?.retryAfterSeconds).toBe(60);
    });
  });
});

describe('isRateLimitError', () => {
  it('returns false for undefined', () => {
    expect(isRateLimitError(undefined)).toBe(false);
  });

  it('returns true for 429 status', () => {
    const error = new Error('Too many requests') as Error & { status: number };
    error.status = 429;
    expect(isRateLimitError(error)).toBe(true);
  });

  it('returns true for rate limit message', () => {
    const error = new Error('Rate limit exceeded');
    expect(isRateLimitError(error)).toBe(true);
  });

  it('returns false for other errors', () => {
    const error = new Error('Something went wrong');
    expect(isRateLimitError(error)).toBe(false);
  });
});

/**
 * URL validation utilities for security
 *
 * Validates API URLs to prevent:
 * - javascript: protocol injection
 * - data: protocol injection
 * - Invalid URL formats
 * - HTTP in production (warning only)
 */

export interface UrlValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
}

/**
 * Dangerous protocols that should never be allowed
 */
const DANGEROUS_PROTOCOLS = ['javascript:', 'data:', 'vbscript:', 'file:'];

/**
 * Validates an API URL for security
 *
 * @param url - The URL to validate
 * @param options - Validation options
 * @returns Validation result with isValid, error, and warning
 */
export function validateApiUrl(
  url: string,
  options: { warnOnHttp?: boolean } = { warnOnHttp: true }
): UrlValidationResult {
  // Check for empty or whitespace-only URLs
  if (!url || !url.trim()) {
    return {
      isValid: false,
      error: 'API URL is required',
    };
  }

  const trimmedUrl = url.trim();

  // Check for dangerous protocols (case-insensitive)
  const lowerUrl = trimmedUrl.toLowerCase();
  for (const protocol of DANGEROUS_PROTOCOLS) {
    if (lowerUrl.startsWith(protocol)) {
      return {
        isValid: false,
        error: `Dangerous protocol "${protocol}" is not allowed. Use HTTPS.`,
      };
    }
  }

  // Allow relative URLs (they inherit the page's protocol)
  if (trimmedUrl.startsWith('/')) {
    return { isValid: true };
  }

  // Try to parse as absolute URL
  let parsed: URL;
  try {
    parsed = new URL(trimmedUrl);
  } catch {
    return {
      isValid: false,
      error: 'Invalid URL format. Use an absolute URL (https://...) or relative path (/api/chat).',
    };
  }

  // Check for allowed protocols
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return {
      isValid: false,
      error: `Protocol "${parsed.protocol}" is not allowed. Use HTTPS or HTTP.`,
    };
  }

  // Warn about HTTP in production (but still allow it)
  if (parsed.protocol === 'http:' && options.warnOnHttp) {
    // Only warn in browser environment and in production
    const isProduction =
      typeof window !== 'undefined' &&
      window.location.protocol === 'https:';

    if (isProduction) {
      return {
        isValid: true,
        warning:
          'Using HTTP for API requests from an HTTPS page may cause mixed content issues. Consider using HTTPS.',
      };
    }
  }

  return { isValid: true };
}

/**
 * Validates URL and logs warnings/errors
 * Returns true if URL is safe to use
 */
export function validateAndWarnApiUrl(url: string): boolean {
  const result = validateApiUrl(url);

  if (!result.isValid && result.error) {
    console.error(`[ai-chat-widget] Security Error: ${result.error}`);
    return false;
  }

  if (result.warning) {
    console.warn(`[ai-chat-widget] Security Warning: ${result.warning}`);
  }

  return true;
}

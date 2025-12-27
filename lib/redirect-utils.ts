/**
 * Validates that a callback URL is safe to redirect to.
 * Only allows relative URLs or URLs from the same origin.
 * 
 * @param callbackUrl - The URL to validate
 * @returns true if the URL is safe, false otherwise
 */
export function isValidCallbackUrl(callbackUrl: string | null | undefined): boolean {
  if (!callbackUrl) return false;

  try {
    // Allow relative URLs (starting with /)
    if (callbackUrl.startsWith('/')) {
      // Prevent protocol-relative URLs like //evil.com
      if (callbackUrl.startsWith('//')) {
        return false;
      }
      return true;
    }

    // For absolute URLs, check if they're from the same origin
    const url = new URL(callbackUrl);
    const currentOrigin = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    return url.origin === currentOrigin;
  } catch {
    // Invalid URL
    return false;
  }
}

/**
 * Gets a validated callback URL from search params.
 * Returns the callback URL if valid, otherwise returns the default URL.
 * 
 * @param searchParams - The search params object
 * @param defaultUrl - The default URL to use if callback is invalid (default: '/dashboard')
 * @returns A safe callback URL
 */
export function getCallbackUrl(
  searchParams: { callbackUrl?: string } | URLSearchParams | null | undefined,
  defaultUrl: string = '/dashboard'
): string {
  let callbackUrl: string | null = null;

  if (searchParams instanceof URLSearchParams) {
    callbackUrl = searchParams.get('callbackUrl');
  } else if (searchParams && typeof searchParams === 'object') {
    callbackUrl = searchParams.callbackUrl || null;
  }

  return isValidCallbackUrl(callbackUrl) ? callbackUrl! : defaultUrl;
}

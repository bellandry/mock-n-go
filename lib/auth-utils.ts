import { useEffect, useState } from "react";

/**
 * Utility function to create a sign-in URL with callback to current page
 * 
 * @param currentPath - Optional current path. If not provided, uses window.location
 * @returns Sign-in URL with callbackUrl parameter
 */
export function getSignInUrl(currentPath?: string): string {
  // Get current path from window if not provided
  const path = currentPath || (typeof window !== 'undefined' ? window.location.pathname : '/');
  
  // Don't add callback if already on sign-in page
  if (path === '/sign-in') {
    return '/sign-in';
  }
  
  // Create sign-in URL with callback
  return `/sign-in?callbackUrl=${encodeURIComponent(path)}`;
}

/**
 * Hook to get sign-in URL with callback to current page
 * SSR-compatible - returns base URL on server, updates with callback on client
 */
export function useSignInUrl(): string {
  const [signInUrl, setSignInUrl] = useState('/sign-in');
  
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      setSignInUrl(getSignInUrl(window.location.pathname));
    }
  }, []);
  
  return signInUrl;
}

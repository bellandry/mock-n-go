"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * OAuth Callback Handler Component
 * 
 * This component runs after OAuth authentication completes.
 * It checks sessionStorage for a saved callbackUrl and redirects the user
 * to their original destination instead of the default /dashboard.
 */
export function OAuthCallbackHandler() {
  const router = useRouter();

  useEffect(() => {
    // Check if there's a saved callback URL from before OAuth redirect
    const savedCallbackUrl = sessionStorage.getItem("auth_callback_url");
    
    if (savedCallbackUrl) {
      // Clear the stored URL
      sessionStorage.removeItem("auth_callback_url");
      
      // Redirect to the original page
      router.replace(savedCallbackUrl);
    }
  }, [router]);

  // This component doesn't render anything
  return null;
}

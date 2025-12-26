"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toastManager } from "../ui/toast";

interface CheckoutButtonProps {
  plan: "PRO" | "TEAM";
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export function CheckoutButton({
  plan,
  variant = "default",
  size = "lg",
  className,
  children = "Get started",
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession()
  const router = useRouter()

  const handleCheckout = async () => {
    try {
      setIsLoading(true);

      if (!session?.user) {
        router.push("/sign-in");
        return;
      }

      // Call the checkout API
      const response = await fetch("/api/subscription/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create checkout session");
      }

      const data = await response.json();

      // Redirect to Dodo Payments checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      
      // Show error to user
      toastManager.add({
        title: "Checkout error",
        description: error instanceof Error
          ? error.message
          : "Failed to start checkout. Please try again.",
        type: "error",
      });
      
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </Button>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Error messages mapping
const errorMessages: Record<string, { title: string; description: string }> = {
  unable_to_get_user_info: {
    title: "Unable to Get User Information",
    description:
      "We couldn't retrieve your user information from the authentication provider. This might be due to privacy settings or a temporary issue.",
  },
  email_not_found: {
    title: "Email Not Found",
    description:
      "We couldn't find an email address associated with your account. Please make sure your email is public in your provider settings.",
  },
  unauthorized: {
    title: "Unauthorized Access",
    description:
      "You don't have permission to access this resource. Please sign in with a valid account.",
  },
  session_expired: {
    title: "Session Expired",
    description:
      "Your session has expired. Please sign in again to continue.",
  },
  account_linking_failed: {
    title: "Account Linking Failed",
    description:
      "We couldn't link your account. This might be because the email is already associated with another account.",
  },
  provider_error: {
    title: "Provider Error",
    description:
      "There was an error communicating with the authentication provider. Please try again later.",
  },
  default: {
    title: "Something went wrong",
    description:
      "Unable to process your request. Please try again later.",
  },
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error") || "default";
  const error = errorMessages[errorCode] || errorMessages.default;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-orange-700/5 via-transparent to-primary/10">
      <Card className="w-full max-w-md p-8 space-y-4 shadow-xl">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Error Content */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">{error.title}</h1>
          <p className="text-gray-500 text-sm">{error.description}</p>
        </div>

        {/* Error Code */}
        {errorCode !== "default" && (
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Error Code: <code className="font-mono">{errorCode}</code>
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link href="/sign-in">
            <Button  className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </Link>

          <Link href="/">
            <Button variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Button>
          </Link>
        </div>
        {/* Help Text */}
        <div className="pt-4">
          <Separator />
          <p className="text-xs text-center text-gray-500 mt-3">
            If this problem persists, please contact support at{" "}
            <a
              href="mailto:support@mockngo.laclass.dev"
              className="text-red-600 hover:underline"
            >
              support@mockngo.laclass.dev
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg">Loading...</p>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}

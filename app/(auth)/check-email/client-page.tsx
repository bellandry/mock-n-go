"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toastManager } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function CheckEmailClient() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    if (!email) return;

    setIsResending(true);
    try {
      const res = await authClient.signIn.magicLink({
        email: email,
        callbackURL: "/dashboard",
        errorCallbackURL: "/error",
      });

      if (res.error) {
        toastManager.add({
          type: "error",
          title: "Error",
          description: res.error.message || "Failed to resend email",
        });
      } else {
        toastManager.add({
          type: "success",
          title: "Email Sent",
          description: "A new magic link has been sent to your email",
        });
      }
    } catch (error) {
      toastManager.add({
        type: "error",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-orange-100/10 via-transparent to-primary/5">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription className="mt-2">
              We&apos;ve sent a magic link to
            </CardDescription>
            {email && (
              <p className="text-sm font-medium text-foreground mt-1">
                {email}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h3 className="font-medium text-sm mb-2">What&apos;s next?</h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground">1.</span>
                  <span>Check your inbox for an email from Mock&apos;n Go</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground">2.</span>
                  <span>Click the magic link in the email</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground">3.</span>
                  <span>You&apos;ll be automatically signed in</span>
                </li>
              </ol>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive the email?
              </p>
              <Button
                variant="outline"
                onClick={handleResend}
                disabled={isResending || !email}
                className="w-full"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Resend email
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Link href="/sign-in" className="block">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to sign in
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

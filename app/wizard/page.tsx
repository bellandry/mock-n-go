"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toastManager } from "@/components/ui/toast";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { updateUserName } from "./actions";

export default function WizardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [state, formAction, isPendingAction] = useActionState(
    async (_prevState: any, formData: FormData) => {
      return await updateUserName(formData);
    },
    null
  );

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
    // If user already has a name, redirect to dashboard
    if (!isPending && session?.user?.name) {
      router.push("/dashboard");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (state?.success) {
      // Hard redirect to force session refresh
      window.location.href = "/dashboard";
    }
    if (state?.error) {
      toastManager.add({
        type: "error",
        title: "Profile Update Error",
        description: state.error,
      });
    }
  }, [state, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-red-50 via-white to-red-100">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-xl">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold ">
            Welcome to Mock & Go! 🎉
          </h1>
          <p className="text-gray-600">
            Let's get started by setting up your profile
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              What's your name?
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              disabled={isPendingAction}
              className="w-full"
              autoFocus
            />
            {state?.error && (
              <div className="w-full p-4 border border-red-500 rounded-xl bg-red-50">
                <p className="text-red-500 text-xs font-medium">{state.error}</p>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPendingAction}
            className="w-full"
          >
            {isPendingAction ? "Saving..." : "Continue to Dashboard"}
          </Button>
        </form>

        <p className="text-xs text-center text-gray-500">
          You can always update this later in your settings
        </p>
      </Card>
    </div>
  );
}

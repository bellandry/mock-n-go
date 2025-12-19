"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toastManager } from "@/components/ui/toast";
import { useSession } from "@/lib/auth-client";
import { useUploadThing } from "@/lib/uploadthing";
import { Upload, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { updateUserName } from "./actions";

export default function WizardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const { startUpload } = useUploadThing("profileImage", {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        setProfileImage(res[0].url);
        toastManager.add({
          type: "success",
          title: "Photo uploaded",
          description: "Your profile photo has been uploaded successfully",
        });
      }
      setIsUploading(false);
    },
    onUploadError: (error: Error) => {
      toastManager.add({
        type: "error",
        title: "Upload failed",
        description: error.message,
      });
      setIsUploading(false);
    },
  });

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    await startUpload([file]);
  };

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
          {/* Profile Photo Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Profile Photo (Optional)
            </Label>
            <div className="flex flex-col items-center gap-4">
              {/* Avatar Preview */}
              <div className="relative w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>

              {/* Upload Button */}
              <label htmlFor="photo-upload">
                <div className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {isUploading ? "Uploading..." : "Upload Photo"}
                  </span>
                </div>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading || isPendingAction}
                  className="hidden"
                />
              </label>

              {/* Hidden input to pass image URL to form */}
              <input type="hidden" name="image" value={profileImage || ""} />
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              What's your name? *
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
            disabled={isPendingAction || isUploading}
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

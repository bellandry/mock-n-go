"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toastManager } from "@/components/ui/toast";
import { useSession } from "@/lib/auth-client";
import { UploadButton } from "@/lib/uploadthing";
import { Camera, Check, Loader2, Pencil, X } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { updateUserName } from "./actions";

export default function ProfilePage() {
  const { data: session, refetch } = useSession();
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!session?.user) return null;

  const handleEditName = () => {
    setNameValue(session.user.name || "");
    setIsEditingName(true);
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setNameValue("");
  };

  const handleSaveName = () => {
    if (!nameValue.trim()) {
      toastManager.add({
        type: "error",
        title: "Error",
        description: "Name is required",
      });
      return;
    }

    startTransition(async () => {
      const result = await updateUserName(nameValue);

      if (result.success) {
        toastManager.add({
          type: "success",
          title: "Success",
          description: "Name updated successfully",
        });
        setIsEditingName(false);
        await refetch();
      } else {
        toastManager.add({
          type: "error",
          title: "Error",
          description: result.error || "Failed to update name",
        });
      }
    });
  };

  return (
    <div className="max-w-7xl space-y-6 mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Photo Section */}
        <Card className="p-6 bg-card border-border flex-1">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-1">
              Profile Photo
            </h2>
            <p className="text-sm text-muted-foreground">
              Update your profile picture
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative aspect-square w-[100px]">
              {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User image"}
                    width={100}
                    height={100}
                    className="rounded-full w-100 aspect-square object-cover"
                  />
              ) : (
                <div className="w-[100px] h-[100px] rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-semibold">
                  {session.user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2">
                <Camera className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>

            <div className="flex-1">
              <UploadButton
                endpoint="profileImage"
                onClientUploadComplete={async (res) => {
                  toastManager.add({
                    type: "success",
                    title: "Success",
                    description: "Profile photo updated successfully",
                  });
                  await refetch();
                }}
                onUploadError={(error: Error) => {
                  toastManager.add({
                    type: "error",
                    title: "Upload Error",
                    description: error.message,
                  });
                }}
                appearance={{
                  button:
                    "bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors ut-ready:bg-primary ut-uploading:bg-primary/90 ut-uploading:cursor-not-allowed",
                  allowedContent: "text-muted-foreground text-xs mt-2",
                }}
              />
              <p className="text-xs text-muted-foreground mt-2">
                JPG, PNG or GIF. Max size 4MB.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Name Section */}
      <Card className="p-6 bg-card border-border flex-1">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">Name</h2>
            <p className="text-sm text-muted-foreground">
              Update your display name
            </p>
          </div>

          {isEditingName ? (
            <div className="space-y-4">
              <Input
                type="text"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                className="bg-background border-input placeholder:text-muted-foreground"
                placeholder="Enter your name"
                disabled={isPending}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveName}
                  disabled={isPending}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="sm"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  disabled={isPending}
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground hover:bg-accent"
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-foreground font-medium">{session.user.name}</p>
              <Button
                onClick={handleEditName}
                variant="ghost"
                className="text-muted-foreground hover:text-foreground hover:bg-accent"
                size="sm"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">Email</h2>
            <p className="text-sm text-muted-foreground">
              Your email address
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">{session.user.email}</p>
            <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
              Cannot be changed
            </span>
          </div>
        </div>
      </Card>
      </div>
    </div>
  );
}

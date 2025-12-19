"use client";

import { authClient } from "@/lib/auth-client";
import { Github, Loader } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";
import { toastManager } from "../ui/toast";
// import { Spinner } from "../ui/spinner";
// import { toastManager } from "../ui/toast";

function SocialLogin({ className }: { className?: string }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({
    github: false,
    google: false,
    discord: false,
    email: false,
  });

  async function connectSocial(provider: "github" | "google") {
    setLoading((prev) => ({ ...prev, [provider]: true }));

    try {
      const res = await authClient.signIn.social({
        provider,
        callbackURL: "/dashboard",
        errorCallbackURL: "/error",
      });

      if (res.error) {
        const errorMessage =
          res.error.message || "Erreur avec le provider " + provider;
        setError(errorMessage);
        toastManager.add({
          type: "error",
          title: "Erreur d'authentification",
          description: errorMessage,
        });
      }
    } finally {
      setLoading((prev) => ({ ...prev, [provider]: false }));
    }
  }

  return (
    <div className={`w-full flex flex-col gap-3 ${className}`}>
      {error && (
        <div className="w-full p-4 border border-primary rounded-xl bg-primary/10">
          <p className="text-primary text-xs font-medium">{error}</p>
        </div>
      )}
      <div className="flex w-full items-stretch gap-3">
        <Button
          variant={"outline"}
          onClick={() => connectSocial("github")}
          className="flex-1"
          disabled={loading.github}
        >
          {loading.github ? (
            <Loader className="h-5 w-5 text-primary animate-spin" />
          ) : (
            <>
              <Github className="size-4" />
              <span className="truncate">GitHub</span>
            </>
          )}
        </Button>

        <Button
          onClick={() => connectSocial("google")}
          className="flex-1"
          variant="outline"
          disabled={loading.google}
        >
          {loading.google ? (
            <Loader className="h-5 w-5 text-primary animate-spin" />
          ) : (
            <>
              <Image
                alt="Google icon"
                className="h-4 w-4"
                src="/socials/google.svg"
                width={50}
                height={50}
              />
              <span className="truncate">Google</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default SocialLogin;

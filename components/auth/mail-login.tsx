"use client";

import { authClient } from "@/lib/auth-client";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toastManager } from "../ui/toast";
// import { Spinner } from "../ui/spinner";
// import { toastManager } from "../ui/toast";

function MailLogin({ className }: { className?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({
    github: false,
    google: false,
    discord: false,
    email: false,
  });

  async function magicSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading((prev) => ({ ...prev, email: true }));

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;

      const res = await authClient.signIn.magicLink({
        email: email,
        callbackURL: "/dashboard",
        errorCallbackURL: "/error",
      });

      if (res.error) {
        const errorMessage = res.error.message || "Une erreur est survenue";
        setError(errorMessage);
        toastManager.add({
          type: "error",
          title: "Erreur",
          description: errorMessage,
        });
      } else {
        toastManager.add({
          type: "success",
          title: "Lien envoyé",
          description:
            "Un lien de connexion a été envoyé à votre adresse e-mail",
        });
        // Redirect to check email page with the email as a parameter
        router.push(
          `/check-email?email=${encodeURIComponent(email)}&form=false`
        );
      }
    } finally {
      setLoading((prev) => ({ ...prev, email: false }));
    }
  }

  return (
    <div className={`w-full ${className}`}>
      <form
        onSubmit={magicSubmit}
        className="flex w-full flex-col items-stretch gap-4"
      >
        {error && !loading.email && (
          <div className="w-full p-4 border border-primary rounded-xl bg-primary/10">
            <p className="text-primary text-xs font-medium">{error}</p>
          </div>
        )}

        <Label className="flex my-1 flex-col font-medium w-full items-start">
          Adresse mail
        </Label>
        <Input
          name="email"
          type="email"
          placeholder="ton.email@exemple.com"
          required
        />
        <Button type="submit" disabled={loading.email}>
          {loading.email ? (
            <Loader className="h-5 w-5 text-white animate-spin" />
          ) : (
            <span className="truncate">Continuer avec Email</span>
          )}
        </Button>
      </form>
    </div>
  );
}

export default MailLogin;

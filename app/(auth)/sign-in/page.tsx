import { Logo } from "@/components/landing/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getCallbackUrl } from "@/lib/redirect-utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import MailLogin from "../../../components/auth/mail-login";
import SocialLogin from "../../../components/auth/social-login";
import { Card, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = getCallbackUrl(params);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-linear-to-br from-orange-700/5 via-transparent to-primary/10 px-4">
      <div className="space-y-2">
        <Link href="/">
          <Button variant={"link"}>
            <ArrowLeft className="size-4" />
            Home
          </Button>
        </Link>
        <Card className="relative w-full max-w-sm overflow-hidden p-6">
          <div className="flex justify-center">
            <Logo />
          </div>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl uppercase">login</CardTitle>
            <CardDescription>Connect to your account</CardDescription>
          </CardHeader>
          <div className="flex h-full w-full max-w-md flex-col items-center justify-center mb-4">
            <div className="flex w-full flex-col items-center gap-6">

              {/* Social Sign-in Buttons */}
              <SocialLogin callbackUrl={callbackUrl} />

              {/* Separator */}
              <Separator />
              <p className="text-neutral-400 text-sm font-normal uppercase leading-normal w-full text-center">
                or
              </p>

              {/* Email Sign-in */}
              <MailLogin callbackUrl={callbackUrl} />
            </div>
          </div>
          <div className="text-center text-xs text-muted-foreground pt-2">
            <Separator />
            <p className="text-[#888888] text-xs text-center mt-2">
              En continuant, tu acceptes nos
              <Link
                className="font-medium hover:text-primary transition-colors"
                href="#"
              >
                {" "}
                Conditions d&#39;utilisation
              </Link>{" "}
              et notre
              <Link
                className="font-medium hover:text-primary transition-colors"
                href="#"
              >
                {" "}
                Politique de confidentialité;
              </Link>
              .
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

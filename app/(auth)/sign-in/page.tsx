import Link from "next/link";
import MailLogin from "../../../components/auth/mail-login";
import SocialLogin from "../../../components/auth/social-login";
import { Card } from "../../../components/ui/card";

export default function SignIn() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="relative w-full max-w-sm overflow-hidden px-4">
        <div className="flex h-full w-full max-w-md flex-col items-center justify-center">
          <div className="flex w-full flex-col items-center gap-6">
            <p className="items-center uppercase font-semibold">
              Se connecter avec
            </p>

            {/* Social Sign-in Buttons */}
            <SocialLogin />

            {/* Separator */}
            <p className="text-neutral-400 text-sm font-normal leading-normal w-full text-center">
              OU
            </p>

            {/* Email Sign-in */}
            <MailLogin />
          </div>
        </div>
        <div className="text-center text-xs text-muted-foreground">
          <p className="text-[#888888] text-xs text-center">
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
  );
}

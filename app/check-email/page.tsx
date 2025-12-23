import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2, Mail } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";
import CheckEmailClient from "./client-page";

export const metadata: Metadata = {
  title: "Check Your Email",
  description: "We've sent you a magic link to sign in",
};

function CheckEmailSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-orange-100/10 via-transparent to-primary/5">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={<CheckEmailSkeleton />}>
      <CheckEmailClient />
    </Suspense>
  );
}

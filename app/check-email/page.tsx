import { Metadata } from "next";
import CheckEmailClient from "./client-page";

export const metadata: Metadata = {
  title: "Check Your Email",
  description: "We've sent you a magic link to sign in",
};

export default function CheckEmailPage() {
  return <CheckEmailClient />;
}

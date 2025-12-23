import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Profile Settings",
  description: "Manage your account information and preferences",
};

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

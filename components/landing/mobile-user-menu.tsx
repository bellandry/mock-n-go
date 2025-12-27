import { signOut, useSession } from "@/lib/auth-client";
import { useSignInUrl } from "@/lib/auth-utils";
import { FileText, LayoutDashboard, LogOut, User as UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

interface MobileUserMenuProps {
  closeMobileMenu: () => void;
}

export const MobileUserMenu = ({ closeMobileMenu }: MobileUserMenuProps) => {
  const { data: session } = useSession();
  const signInUrl = useSignInUrl();
  const user = session?.user;

  return (
    <>
      {user ? (
        <div className="flex flex-col gap-4">
          {/* User Info */}
          <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-lg">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={40}
                height={40}
                className="rounded-full aspect-square object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-medium">{user.name || "User"}</span>
              <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex flex-col gap-2">
            <Link
              href="/dashboard"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/dashboard/mocks"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
            >
              <FileText className="h-5 w-5" />
              <span>My Mocks</span>
            </Link>
            <Link
              href="/dashboard/profile"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
            >
              <UserIcon className="h-5 w-5" />
              <span>Profile</span>
            </Link>
            <button
              onClick={() => {
                signOut();
                closeMobileMenu();
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-destructive"
            >
              <LogOut className="h-5 w-5" />
              <span>Log out</span>
            </button>
          </nav>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <Link href={signInUrl} onClick={closeMobileMenu}>
            <Button variant="ghost" className="w-full">
              Sign in
            </Button>
          </Link>
          <Link href="/dashboard" onClick={closeMobileMenu}>
            <Button className="w-full">Get started</Button>
          </Link>
        </div>
      )}
    </>
  );
};
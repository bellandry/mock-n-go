import { signOut, useSession } from "@/lib/auth-client";
import { FileText, LayoutDashboard, LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export const MobileUserMenu = ({ closeMobileMenu }: { closeMobileMenu: () => void }) => {
  const { data: session } = useSession();
  return (
    session?.user ? (
      <>
        {/* User Info */}
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              width={40}
              height={40}
              className="rounded-full aspect-square object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
              {session.user.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          <div>
            <p className="text-sm font-medium">{session.user.name}</p>
            <p className="text-xs text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </div>
        <Link href="/dashboard" onClick={closeMobileMenu}>
          <Button variant="ghost" className="w-full justify-start">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>
        <Link href="/dashboard/mocks" onClick={closeMobileMenu}>
          <Button variant="ghost" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" />
            My Mocks
          </Button>
        </Link>
        <Link href="/dashboard/profile" onClick={closeMobileMenu}>
          <Button variant="ghost" className="w-full justify-start">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={() => {
            signOut();
            closeMobileMenu();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </>
    ) : (
      <>
        <Link href="/sign-in" onClick={closeMobileMenu}>
          <Button variant="ghost" className="w-full">
            Sign in
          </Button>
        </Link>
        <Link href="/dashboard" onClick={closeMobileMenu}>
          <Button className="w-full">Get started</Button>
        </Link>
      </>
    )
  )
}
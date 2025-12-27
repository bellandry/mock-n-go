import { useSession } from "@/lib/auth-client"
import { useSignInUrl } from "@/lib/auth-utils"
import { User } from "better-auth"
import { signOut } from "better-auth/api"
import { FileText, LayoutDashboard, LogOut, User as UserIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"

export const UserMenu = () => {
  const [user, setUser] = useState<User | undefined>(undefined)
  const { data: session } = useSession()
  const signInUrl = useSignInUrl()

  useEffect(() => {
    setUser(session?.user)
  }, [session])

  return (
    user ? (
    <>
      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors outline-none cursor-pointer">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "User"}
              width={32}
              height={32}
              className="rounded-full aspect-square object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          <span className="text-sm font-medium">
            {user.name || "User"}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-normal px-3 py-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-0">
              <Link
                href="/dashboard"
                className="flex items-center w-full px-3 py-2 cursor-pointer outline-none"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <Link
                href="/dashboard/mocks"
                className="flex items-center w-full px-3 py-2 cursor-pointer outline-none"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>My Mocks</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <Link
                href="/dashboard/profile"
                className="flex items-center w-full px-3 py-2 cursor-pointer outline-none"
              >
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer px-3 py-2"
            onClick={() => {
              signOut()
              setUser(undefined)
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
    ) : (
      <>
        <Link href={signInUrl}>
          <Button variant="ghost">Sign in</Button>
        </Link>
        <Link href="/dashboard">
          <Button>Get started</Button>
        </Link>
      </>
    )
  )
}

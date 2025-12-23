import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { Home } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const { user } = session;

  // Redirect to wizard if user doesn't have a name
  if (!user.name) {
    redirect("/wizard");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex sticky border-b bg-white/10 z-10 w-full backdrop-blur-md top-0 h-16 shrink items-center justify-between gap-2 px-2">
          <div className="flex flex-1 py-2 items-center gap-3 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-6 my-auto" />
            <ModeToggle />
          </div>
          <div className="flex-1 flex justify-end">
            <Link href="/">
              <Button variant={"outline"}>
                <Home /> Accueil
              </Button>
            </Link>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

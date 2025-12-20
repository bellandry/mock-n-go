import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
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
        <header className="flex h-16 shrink-0 items-center justify-between gap-2">
          <div className="flex fixed top-0 border-b w-full bg-white/10 backdrop-blur-md z-10 py-2 items-center gap-3 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-6 my-auto" />
            <ModeToggle />
          </div>
          {/* <UserNav /> */}
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import { BadgeDollarSign, Home, MessageCircleCode } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WorkplaceSwitcher } from "./workplace-switcher";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Mocks",
    href: "/dashboard/mocks",
    icon: MessageCircleCode,
  },
  {
    title: "Subscription",
    href: "/dashboard/subscription",
    icon: BadgeDollarSign,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="px-2 py-4">
          <h1 className="text-xl font-bold data-[collapsible=icon]:hidden">Mock-n-Go</h1>
          <p className="text-xs text-sidebar-foreground/60 mt-1">
            API Mock Generator
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.href} className="flex items-center gap-2 w-full">
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="p-2">
          <WorkplaceSwitcher />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

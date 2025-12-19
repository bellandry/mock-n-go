"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import {
  authClient,
  signOut,
  useActiveOrganization,
  useListOrganizations,
  useSession
} from "@/lib/auth-client";
import {
  Building2,
  Check,
  ChevronsUpDown,
  LogOut,
  Plus
} from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { toastManager } from "./ui/toast";

export function WorkplaceSwitcher() {
  const { isMobile } = useSidebar();
  const { data: activeOrg, isPending: isActivePending } = useActiveOrganization();
  const { data: organizations, isPending: isListPending } = useListOrganizations();
  const { data: session } = useSession();
  
  const [isCreating, setIsCreating] = React.useState(false);
  const [newOrgName, setNewOrgName] = React.useState("");

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    try {
      await authClient.organization.create({
        name: newOrgName,
        slug: newOrgName.toLowerCase().replace(/\s+/g, '-'),
      });
      setNewOrgName("");
      setIsCreating(false);
      toastManager.add({
        type: "success",
        title: "Organization created",
        description: `Successfully created ${newOrgName}`,
      });
    } catch (error) {
      console.error(error);
      toastManager.add({
        type: "error",
        title: "Error",
        description: "Failed to create organization",
      });
    }
  };

  const handleSwitchOrg = async (orgId: string) => {
    try {
      await authClient.organization.setActive({
        organizationId: orgId,
      });
    } catch (error) {
      console.error(error);
      toastManager.add({
        type: "error",
        title: "Error",
        description: "Failed to switch organization",
      });
    }
  };

  if (isActivePending || isListPending || !session?.user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Building2 className="size-4 animate-pulse" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <div className="h-4 w-24 animate-pulse rounded bg-sidebar-accent" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeOrg?.name || "Select Workplace"}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {activeOrg?.slug || "Organization"}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent
            className="w-(--anchor-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Workplaces
              </DropdownMenuLabel>
              {organizations?.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => handleSwitchOrg(org.id)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Building2 className="size-4 shrink-0" />
                  </div>
                  <span className="flex-1 truncate">{org.name}</span>
                  {activeOrg?.id === org.id && (
                    <Check className="size-4 ml-auto" />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem 
                className="gap-2 p-2"
                onSelect={(e) => {
                  e.preventDefault();
                  setIsCreating(true);
                }}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">Add workplace</div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Account
              </DropdownMenuLabel>
              <DropdownMenuItem className="gap-3 p-2">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{session.user.name}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                    {session.user.email}
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => signOut()}
                className="gap-2 p-2 text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl bg-card p-6 shadow-xl border border-border">
            <h3 className="text-lg font-semibold mb-4">Create Workplace</h3>
            <form onSubmit={handleCreateOrg} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <input
                  id="name"
                  autoFocus
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Acme Inc."
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newOrgName.trim()}
                  className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SidebarMenu>
  );
}

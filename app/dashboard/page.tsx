"use client";

import { Card } from "@/components/ui/card";
import {
    authClient,
    useActiveOrganization,
    useSession
} from "@/lib/auth-client";
import { Activity, Loader2, Users, Zap } from "lucide-react";
import * as React from "react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: activeOrg, isPending: isActivePending } = useActiveOrganization();
  const [memberCount, setMemberCount] = React.useState<number | null>(null);
  const [isMembersLoading, setIsMembersLoading] = React.useState(false);

  React.useEffect(() => {
    if (activeOrg?.id) {
      setIsMembersLoading(true);
      authClient.organization.listMembers({
        query: {
          organizationId: activeOrg.id
        }
      }).then(res => {
        if (res.data) {
          setMemberCount(res.data.total);
        }
      }).finally(() => {
        setIsMembersLoading(false);
      });
    }
  }, [activeOrg?.id]);

  if (!session?.user) return null;

  const { user } = session;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-muted-foreground">
          {activeOrg ? (
            <>Manage your mock APIs for <span className="text-foreground font-semibold">{activeOrg.name}</span></>
          ) : (
            <>Here's what's happening with your mock APIs today.</>
          )}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/20">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Mocks</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/20">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">API Calls</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/20">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Team Members</p>
              <p className="text-2xl font-bold">
                {isMembersLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                ) : (
                  memberCount ?? 1
                )}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <p className="text-muted-foreground">
          Get started by creating your first mock API or updating your profile.
        </p>
      </Card>
    </div>
  );
}

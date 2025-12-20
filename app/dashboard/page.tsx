"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  authClient,
  useActiveOrganization,
  useSession
} from "@/lib/auth-client";
import { Activity, Loader2, Plus, Users, Zap } from "lucide-react";
import Link from "next/link";
import * as React from "react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: activeOrg, isPending: isActivePending } = useActiveOrganization();
  const [memberCount, setMemberCount] = React.useState<number | null>(null);
  const [isMembersLoading, setIsMembersLoading] = React.useState(false);
  const [mockStats, setMockStats] = React.useState({ activeMocks: 0, totalCalls: 0 });
  const [isMocksLoading, setIsMocksLoading] = React.useState(false);

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

      // Fetch mock statistics
      setIsMocksLoading(true);
      fetch("/api/mock")
        .then(res => res.json())
        .then(mocks => {
          const activeMocks = mocks.filter((m: any) => m.isActive).length;
          const totalCalls = mocks.reduce((sum: number, m: any) => sum + m.accessCount, 0);
          setMockStats({ activeMocks, totalCalls });
        })
        .catch(err => console.error("Error fetching mocks:", err))
        .finally(() => setIsMocksLoading(false));
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
              <p className="text-2xl font-bold">
                {isMocksLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                ) : (
                  mockStats.activeMocks
                )}
              </p>
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
              <p className="text-2xl font-bold">
                {isMocksLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                ) : (
                  mockStats.totalCalls.toLocaleString()
                )}
              </p>
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
        <div className="flex gap-3">
          <Link href="/dashboard/mocks/new">
            <Button>
              <Plus className="w-4 h-4" />
              Create Mock API
            </Button>
          </Link>
          <Link href="/dashboard/mocks">
            <Button variant="outline">
              View All Mocks
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

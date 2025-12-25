"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  authClient,
  useActiveOrganization,
  useSession
} from "@/lib/auth-client";
import { MockConfig } from "@/types/mock";
import { Activity, ArrowRight, Clock, Crown, Loader2, Plus, Zap } from "lucide-react";
import Link from "next/link";
import * as React from "react";

export default function DashboardClientPage() {
  const { data: session } = useSession();
  const { data: activeOrg, isPending: isActivePending } = useActiveOrganization();
  const [memberCount, setMemberCount] = React.useState<number | null>(null);
  const [isMembersLoading, setIsMembersLoading] = React.useState(false);
  const [mockStats, setMockStats] = React.useState({ activeMocks: 0, totalCalls: 0 });
  const [isMocksLoading, setIsMocksLoading] = React.useState(false);
  const [recentMocks, setRecentMocks] = React.useState<MockConfig[]>([]);
  const [subscription, setSubscription] = React.useState<any>(null);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = React.useState(false);

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

      // Fetch mock statistics and recent mocks
      setIsMocksLoading(true);
      fetch("/api/mock")
        .then(res => res.json())
        .then(mocks => {
          const activeMocks = mocks.filter((m: any) => m.isActive).length;
          const totalCalls = mocks.reduce((sum: number, m: any) => sum + m.accessCount, 0);
          setMockStats({ activeMocks, totalCalls });
          
          // Get 3 most recent mocks
          const sortedMocks = [...mocks].sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setRecentMocks(sortedMocks.slice(0, 3));
        })
        .catch(err => console.error("Error fetching mocks:", err))
        .finally(() => setIsMocksLoading(false));

      // Fetch subscription info
      setIsSubscriptionLoading(true);
      fetch("/api/subscription")
        .then(res => res.json())
        .then(data => setSubscription(data))
        .catch(err => console.error("Error fetching subscription:", err))
        .finally(() => setIsSubscriptionLoading(false));
    }
  }, [activeOrg?.id]);

  if (!session?.user) return null;

  const { user } = session;

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

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

        <Link href="/dashboard/subscription" className="block">
          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 hover:border-primary/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <p className="text-2xl font-bold">
                  {isSubscriptionLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  ) : (
                    subscription?.plan || "FREE"
                  )}
                </p>
                {subscription?.isTrialing && subscription?.trialDaysRemaining > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {subscription.trialDaysRemaining} days trial left
                  </p>
                )}
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
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
          <Link href="/dashboard/subscription">
            <Button variant="outline">
              <Crown className="w-4 h-4" />
              Manage Subscription
            </Button>
          </Link>
        </div>

        {/* Recent Mocks */}
        {isMocksLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : recentMocks.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Recent Mocks</h3>
            {recentMocks.map((mock) => {
              const isExpired = mock.expiresAt ? new Date(mock.expiresAt) < new Date() : false;
              const isActive = mock.isActive && !isExpired;
              
              return (
                <Link
                  key={mock.id}
                  href={`/dashboard/mocks/${mock.id}`}
                  className="block group"
                >
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{mock.name}</p>
                        <Badge
                          variant={isActive ? "default" : isExpired ? "destructive" : "secondary"}
                          className="shrink-0"
                        >
                          {isActive ? "Active" : isExpired ? "Expired" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(mock.createdAt)}</span>
                        <span>•</span>
                        <span>{mock.accessCount} calls</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {mock.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No mocks created yet</p>
            <p className="text-xs mt-1">Create your first mock to get started</p>
          </div>
        )}
      </Card>
    </div>
  );
}

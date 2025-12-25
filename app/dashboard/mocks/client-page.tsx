"use client";

import { MockCard } from "@/components/mocks/mock-card";
import { UpgradePrompt } from "@/components/subscription/upgrade-prompt";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toastManager } from "@/components/ui/toast";
import { useActiveOrganization } from "@/lib/auth-client";
import { getSubscriptionLimits } from "@/lib/subscription-limits";
import { MockConfig } from "@/types/mock";
import { SubscriptionPlan } from "@prisma/client";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MocksClientPage() {
  const { data: activeOrg } = useActiveOrganization();
  const [mocks, setMocks] = useState<MockConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(false);

  useEffect(() => {
    if (activeOrg?.id) {
      fetchMocks();
      fetchSubscription();
    }
  }, [activeOrg?.id]);

  const fetchMocks = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/mock");
      if (res.ok) {
        const data = await res.json();
        setMocks(data);
      }
    } catch (error) {
      console.error("Error fetching mocks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubscription = async () => {
    try {
      setIsSubscriptionLoading(true);
      const res = await fetch("/api/subscription");
      if (res.ok) {
        const data = await res.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setIsSubscriptionLoading(false);
    }
  };

  if (!activeOrg) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/mock/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMocks(mocks.filter((m) => m.id !== id));
        toastManager.add({
          type: "success",
          title: "Success",
          description: "Mock deleted successfully",
        });
      } else {
        // Parse error response
        const errorData = await res.json();
        toastManager.add({
          type: "error",
          title: "Cannot Delete",
          description: errorData.error || "Failed to delete mock",
        });
      }
    } catch (error) {
      console.error("Error deleting mock:", error);
      toastManager.add({
        type: "error",
        title: "Error",
        description: "An unexpected error occurred",
      });
    }
  };

  const plan = subscription?.plan || SubscriptionPlan.FREE;
  const limits = getSubscriptionLimits(plan);
  const activeMocks = mocks.filter(m => m.isActive && (!m.expiresAt || new Date(m.expiresAt) > new Date())).length;
  const canCreate = limits.maxActiveMocks === -1 || activeMocks < limits.maxActiveMocks;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Mock APIs</h1>
            <Badge variant="default" className="text-xs">
              {plan}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Create and manage your mock API endpoints
          </p>
          {!isSubscriptionLoading && limits.maxActiveMocks !== -1 && (
            <p className="text-sm text-muted-foreground mt-1">
              Active mocks: <span className="font-medium">{activeMocks}</span> / {limits.maxActiveMocks}
            </p>
          )}
        </div>
        <Link href="/dashboard/mocks/new">
          <Button disabled={!canCreate}>
            <Plus className="w-4 h-4" />
            New Mock
          </Button>
        </Link>
      </div>

      {/* Upgrade prompt if limit reached */}
      {!canCreate && (
        <UpgradePrompt
          title="Mock Limit Reached"
          message={`You've reached the maximum of ${limits.maxActiveMocks} active mocks on the ${plan} plan. Upgrade to Pro for unlimited mocks.`}
          variant="banner"
        />
      )}

      {/* Mocks List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : mocks.length === 0 ? (
        <Card className="p-12 text-center bg-white/5 backdrop-blur-sm border-white/10">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-2">No mocks yet</h3>
            <p className="text-muted-foreground mb-6">
              Get started by creating your first mock API endpoint
            </p>
            <Link href="/dashboard/mocks/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Mock
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {mocks.map((mock) => (
            <div key={mock.id}>
              <MockCard mock={mock} onDelete={() => handleDelete(mock.id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

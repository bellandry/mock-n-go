"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface SubscriptionStatusProps {
  plan: "FREE" | "PRO" | "TEAM";
  status: "ACTIVE" | "CANCELED" | "PAST_DUE" | "TRIALING";
  isTrialing: boolean;
  trialDaysRemaining?: number;
  currentPeriodEnd?: Date | null;
}

export function SubscriptionStatus({
  plan,
  status,
  isTrialing,
  trialDaysRemaining,
  currentPeriodEnd,
}: SubscriptionStatusProps) {
  // Determine badge variant based on status
  const getBadgeVariant = () => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "TRIALING":
        return "secondary";
      case "CANCELED":
        return "destructive";
      case "PAST_DUE":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Get status icon
  const getStatusIcon = () => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "TRIALING":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "CANCELED":
      case "PAST_DUE":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Format plan name
  const formatPlan = (plan: string) => {
    if (plan === "FREE") return "Starter";
    return plan.charAt(0) + plan.slice(1).toLowerCase();
  };

  // Format date
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Subscription Status</CardTitle>
          <Badge variant={getBadgeVariant()}>
            {formatPlan(plan)}
          </Badge>
        </div>
        <CardDescription>
          Manage your subscription and billing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status</span>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm">
              {status.charAt(0) + status.slice(1).toLowerCase().replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Trial information */}
        {isTrialing && trialDaysRemaining !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Trial ends in</span>
            <span className="text-sm font-semibold text-blue-600">
              {trialDaysRemaining} {trialDaysRemaining === 1 ? "day" : "days"}
            </span>
          </div>
        )}

        {/* Next billing date */}
        {status === "ACTIVE" && currentPeriodEnd && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Next billing date</span>
            <span className="text-sm">{formatDate(currentPeriodEnd)}</span>
          </div>
        )}

        {/* Canceled - access until */}
        {status === "CANCELED" && currentPeriodEnd && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Access until</span>
            <span className="text-sm">{formatDate(currentPeriodEnd)}</span>
          </div>
        )}

        {/* Plan features summary */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            {plan === "FREE" && "5 active mocks, 100 requests/day per mock"}
            {plan === "PRO" && "Unlimited mocks, unlimited requests, GraphQL support"}
            {plan === "TEAM" && "Everything in Pro + team collaboration"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SubscriptionPlan } from "@prisma/client";
import { Lock } from "lucide-react";
import Link from "next/link";
import * as React from "react";

interface FeatureGateProps {
  feature: string;
  requiredPlan: 'PRO' | 'TEAM';
  currentPlan: SubscriptionPlan;
  children: React.ReactNode;
  disabled?: boolean;
}

/**
 * Component to gate features behind subscription plans
 * Shows a lock icon and tooltip for unavailable features
 */
export function FeatureGate({
  feature,
  requiredPlan,
  currentPlan,
  children,
  disabled = false,
}: FeatureGateProps) {
  const isAvailable = 
    (requiredPlan === 'PRO' && (currentPlan === SubscriptionPlan.PRO || currentPlan === SubscriptionPlan.TEAM)) ||
    (requiredPlan === 'TEAM' && currentPlan === SubscriptionPlan.TEAM);

  if (isAvailable && !disabled) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="relative">
            <div className="opacity-50 pointer-events-none">
              {children}
            </div>
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="gap-1">
                <Lock className="w-3 h-3" />
                {requiredPlan}
              </Badge>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="font-semibold mb-1">{feature} is a {requiredPlan} feature</p>
          <p className="text-xs text-muted-foreground">
            Upgrade to {requiredPlan} to unlock this feature.
          </p>
          <Link 
            href="/dashboard/subscription" 
            className="text-xs text-primary hover:underline block mt-2"
          >
            View plans →
          </Link>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

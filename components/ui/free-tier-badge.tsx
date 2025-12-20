"use client";

import { Card } from "@/components/ui/card";
import { AlertCircle, Clock, Database, Info, Zap } from "lucide-react";

interface FreeTierBadgeProps {
  activeMocks?: { current: number; limit: number };
  showDetails?: boolean;
}

export function FreeTierBadge({
  activeMocks,
  showDetails = true,
}: FreeTierBadgeProps) {
  const isNearLimit = activeMocks && activeMocks.current >= activeMocks.limit * 0.8;
  const isAtLimit = activeMocks && activeMocks.current >= activeMocks.limit;

  return (
    <Card className="p-4 bg-linear-to-br from-orange-500/5 to-primary/5 via-white/5 border-primary/20">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Info className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">Free Tier</h3>
          
          {activeMocks && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-muted-foreground">Active Mocks:</span>
              <span
                className={`text-sm font-bold ${
                  isAtLimit
                    ? "text-primary"
                    : isNearLimit
                    ? "text-orange-400"
                    : "text-green-400"
                }`}
              >
                {activeMocks.current}/{activeMocks.limit}
              </span>
            </div>
          )}

          {showDetails && (
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                <span>24h auto-expiration</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-3 h-3" />
                <span>50 records per mock</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3" />
                <span>100 requests/day per mock</span>
              </div>
            </div>
          )}

          {isAtLimit && (
            <div className="mt-2 flex items-start gap-2 p-2 bg-primary/5 border border-primary/20 rounded">
              <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-primary">
                You've reached the limit. Wait for a mock to expire or upgrade your plan.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

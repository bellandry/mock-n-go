"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Crown, Sparkles } from "lucide-react";
import Link from "next/link";

interface UpgradePromptProps {
  title: string;
  message: string;
  feature?: string;
  variant?: 'card' | 'inline' | 'banner';
}

/**
 * Component to prompt users to upgrade their subscription
 */
export function UpgradePrompt({
  title,
  message,
  feature,
  variant = 'card',
}: UpgradePromptProps) {
  if (variant === 'banner') {
    return (
      <div className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/20 shrink-0">
            <Crown className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{message}</p>
            <Link href="/dashboard/subscription">
              <Button size="sm" variant="default">
                <Sparkles className="w-4 h-4" />
                Upgrade Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <AlertCircle className="w-4 h-4" />
        <span>{message}</span>
        <Link href="/dashboard/subscription" className="text-primary hover:underline">
          Upgrade
        </Link>
      </div>
    );
  }

  // Card variant (default)
  return (
    <Card className="p-6 bg-linear-to-br from-primary/5 to-transparent border-primary/20">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-primary/20 shrink-0">
          <Crown className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{message}</p>
          {feature && (
            <p className="text-xs text-muted-foreground mb-4">
              Feature: <span className="font-medium">{feature}</span>
            </p>
          )}
          <div className="flex gap-3">
            <Link href="/dashboard/subscription">
              <Button>
                <Sparkles className="w-4 h-4" />
                Upgrade to Pro
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline">
                View Plans
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

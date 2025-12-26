"use client";

import { FeatureGate } from "@/components/subscription/feature-gate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SubscriptionPlan } from "@prisma/client";
import { Download, FileCode, FileJson } from "lucide-react";
import Link from "next/link";

interface MockExportOptionsProps {
  mockId: string;
  plan: SubscriptionPlan;
}

/**
 * Component to display export options for a mock
 * Locks export features for FREE users
 */
export function MockExportOptions({ mockId, plan }: MockExportOptionsProps) {
  const canExport = plan === SubscriptionPlan.PRO || plan === SubscriptionPlan.TEAM;

  const exportOptions = [
    {
      name: "MSW (Mock Service Worker)",
      description: "Export as MSW handlers",
      icon: FileCode,
      href: `/api/mock/${mockId}/export/msw`,
    },
    {
      name: "Postman Collection",
      description: "Export as Postman collection",
      icon: FileJson,
      href: `/api/mock/${mockId}/export/postman`,
    },
    {
      name: "OpenAPI Spec",
      description: "Export as OpenAPI 3.0 spec",
      icon: FileJson,
      href: `/api/mock/${mockId}/export/openapi`,
    },
  ];

  return (
    <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Export Options</h2>
        {!canExport && (
          <Badge variant="secondary" className="gap-1">
            PRO Feature
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          
          if (!canExport) {
            return (
              <FeatureGate
                key={option.name}
                feature={option.name}
                requiredPlan="PRO"
                currentPlan={plan}
              >
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{option.name}</p>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                  <Button size="sm" disabled>
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </FeatureGate>
            );
          }

          return (
            <Link key={option.name} href={option.href} download>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer">
                <Icon className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{option.name}</p>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </Link>
          );
        })}
      </div>

      {!canExport && (
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Upgrade to Pro to export your mocks to MSW, Postman, or OpenAPI
        </p>
      )}
    </Card>
  );
}

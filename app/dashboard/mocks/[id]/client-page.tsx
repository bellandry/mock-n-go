"use client";

import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { EndpointTab } from "@/components/mocks/mock-detail/EndpointTab";
import { MockBaseUrl } from "@/components/mocks/mock-detail/MockBaseUrl";
import { MockHeader } from "@/components/mocks/mock-detail/MockHeader";
import { MockMetadata } from "@/components/mocks/mock-detail/MockMetadata";
import { MockStatistics } from "@/components/mocks/mock-detail/MockStatistics";
import { MockExportOptions } from "@/components/mocks/mock-export-options";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toastManager } from "@/components/ui/toast";
import { getMethodColor, HTTP_METHODS } from "@/lib/http-methods";
import { Field, MockConfig } from "@/types/mock";
import { SubscriptionPlan } from "@prisma/client";
import { Loader2, Settings } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MockDetailClientPage() {
  const params = useParams();
  const router = useRouter();
  const [mock, setMock] = useState<MockConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    if (params.id) {
      fetchMock();
      fetchSubscription();
    }
  }, [params.id]);

  const fetchMock = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/mock/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setMock(data);
      } else if (res.status === 404) {
        router.push("/dashboard/mocks");
      }
    } catch (error) {
      console.error("Error fetching mock:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubscription = async () => {
    try {
      const res = await fetch("/api/subscription");
      if (res.ok) {
        const data = await res.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/mock/${params.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toastManager.add({
          type: "success",
          title: "Success",
          description: "Mock deleted successfully",
        });
        router.push("/dashboard/mocks");
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
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toastManager.add({
      type: "success",
      title: "Copied",
      description: "Copied to clipboard",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!mock) {
    return <div>Mock not found</div>;
  }

  return (
    <>
      <div className="space-y-6 max-w-6xl w-full mx-auto">
        {/* Header */}
        <MockHeader
          mock={mock}
          isDeleting={isDeleting}
          onDelete={() => setShowDeleteDialog(true)}
        />

        {/* Base URL */}
        <MockBaseUrl mockUrl={mock.mockUrl} onCopy={copyToClipboard} />

        {/* Statistics */}
        <MockStatistics
          accessCount={mock.accessCount}
          createdAt={mock.createdAt}
          lastAccessedAt={mock.lastAccessedAt}
        />

        {/* Export Options */}
        {subscription && (
          <MockExportOptions
            mockId={mock.id}
            plan={subscription.plan || SubscriptionPlan.FREE}
          />
        )}

        {/* Endpoints Documentation */}
        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            API Endpoints
          </h2>

          <Tabs defaultValue={mock.endpoints[0]?.method || "GET"} className="w-full">
            <TabsList className="grid grid-cols-5">
              {HTTP_METHODS.map((method) => {
                const endpoint = mock.endpoints.find((e) => e.method === method);
                return (
                  <TabsTrigger
                    key={method}
                    value={method}
                    disabled={!endpoint}
                    className="data-[state=active]:bg-white/10"
                  >
                    <Badge
                      variant="outline"
                      className={`${getMethodColor(method)} text-xs`}
                    >
                      {method}
                    </Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {mock.endpoints.map((endpoint) => (
              <TabsContent
                key={endpoint.method}
                value={endpoint.method}
                className="space-y-4"
              >
                <EndpointTab
                  endpoint={{
                    method: endpoint.method,
                    accessCount: endpoint.accessCount,
                    count: endpoint.count,
                    pagination: endpoint.pagination,
                    randomErrors: endpoint.randomErrors,
                    errorRate: endpoint.errorRate,
                    fields: endpoint.fields as Field[],
                  }}
                  mockUrl={mock.mockUrl}
                  onCopy={copyToClipboard}
                />
              </TabsContent>
            ))}
          </Tabs>
        </Card>

        {/* Metadata */}
        <MockMetadata
          createdBy={mock.createdBy}
          createdAt={mock.createdAt}
          updatedAt={mock.updatedAt}
        />
      </div>
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Mock API"
        description="This action cannot be undone."
        itemName={mock.name}
      />
    </>
  );
}

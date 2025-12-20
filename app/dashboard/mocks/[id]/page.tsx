"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, ExternalLink, Loader2, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface MockConfig {
  id: string;
  name: string;
  basePath: string;
  description?: string;
  isActive: boolean;
  accessCount: number;
  createdAt: string;
  updatedAt: string;
  lastAccessedAt?: string;
  mockUrl: string;
  endpoints: Array<{
    id: string;
    method: string;
    accessCount: number;
    fields: any;
    count: number;
    pagination: boolean;
    randomErrors: boolean;
    errorRate: number;
  }>;
  createdBy: {
    name: string;
    email: string;
  };
}

export default function MockDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [mock, setMock] = useState<MockConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchMock();
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

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this mock?")) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/mock/${params.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/dashboard/mocks");
      }
    } catch (error) {
      console.error("Error deleting mock:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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

  const getEndpoint = mock.endpoints.find((e) => e.method === "GET");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{mock.name}</h1>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                mock.isActive
                  ? "bg-green-500/20 text-green-400"
                  : "bg-gray-500/20 text-gray-400"
              }`}
            >
              {mock.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          {mock.description && (
            <p className="text-muted-foreground">{mock.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-400 hover:text-red-300"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </>
            )}
          </Button>
        </div>
      </div>

      {/* API URL */}
      <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
        <h2 className="text-lg font-semibold mb-3">API Endpoint</h2>
        <div className="flex items-center gap-2">
          <code className="text-sm bg-black/30 px-4 py-2 rounded flex-1 overflow-x-auto">
            {mock.mockUrl}
          </code>
          <Button
            size="sm"
            variant="outline"
            onClick={() => copyToClipboard(mock.mockUrl)}
          >
            <Copy className="w-4 h-4 mr-1" />
            Copy
          </Button>
          <a href={mock.mockUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline">
              <ExternalLink className="w-4 h-4 mr-1" />
              Test
            </Button>
          </a>
        </div>
        {getEndpoint?.pagination && (
          <p className="text-xs text-muted-foreground mt-2">
            Supports pagination: Add <code>?page=1&limit=10</code> to the URL
          </p>
        )}
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <p className="text-sm text-muted-foreground">Total Calls</p>
          <p className="text-3xl font-bold mt-1">{mock.accessCount}</p>
        </Card>
        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <p className="text-sm text-muted-foreground">Created</p>
          <p className="text-lg font-semibold mt-1">
            {new Date(mock.createdAt).toLocaleDateString()}
          </p>
        </Card>
        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <p className="text-sm text-muted-foreground">Last Accessed</p>
          <p className="text-lg font-semibold mt-1">
            {mock.lastAccessedAt
              ? new Date(mock.lastAccessedAt).toLocaleString()
              : "Never"}
          </p>
        </Card>
      </div>

      {/* Configuration */}
      {getEndpoint && (
        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <h2 className="text-lg font-semibold mb-4">Configuration</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Method</p>
              <p className="font-semibold">{getEndpoint.method}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Items Count</p>
              <p className="font-semibold">{getEndpoint.count}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Pagination</p>
              <p className="font-semibold">
                {getEndpoint.pagination ? "Enabled" : "Disabled"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Random Errors</p>
              <p className="font-semibold">
                {getEndpoint.randomErrors
                  ? `${getEndpoint.errorRate}%`
                  : "Disabled"}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Fields */}
      {getEndpoint && (
        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <h2 className="text-lg font-semibold mb-4">Fields</h2>
          <div className="space-y-2">
            {(getEndpoint.fields as any[]).map((field, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-black/20 rounded"
              >
                <span className="font-mono text-sm">{field.name}</span>
                <span className="text-xs text-muted-foreground px-2 py-1 bg-white/5 rounded">
                  {field.type}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Metadata */}
      <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
        <h2 className="text-lg font-semibold mb-4">Metadata</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created by</span>
            <span>{mock.createdBy.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created at</span>
            <span>{new Date(mock.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last updated</span>
            <span>{new Date(mock.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

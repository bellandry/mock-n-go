"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useActiveOrganization } from "@/lib/auth-client";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface MockConfig {
  id: string;
  name: string;
  basePath: string;
  description?: string;
  isActive: boolean;
  accessCount: number;
  createdAt: string;
  mockUrl: string;
  endpoints: Array<{
    method: string;
    accessCount: number;
  }>;
}

export default function MocksPage() {
  const { data: activeOrg } = useActiveOrganization();
  const [mocks, setMocks] = useState<MockConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (activeOrg?.id) {
      fetchMocks();
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this mock?")) return;

    try {
      const res = await fetch(`/api/mock/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMocks(mocks.filter((m) => m.id !== id));
      }
    } catch (error) {
      console.error("Error deleting mock:", error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  if (!activeOrg) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mock APIs</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your mock API endpoints
          </p>
        </div>
        <Link href="/dashboard/mocks/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Mock
          </Button>
        </Link>
      </div>

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
            <Card
              key={mock.id}
              className="p-6 bg-white/5 backdrop-blur-sm border-white/10"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{mock.name}</h3>
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
                    <p className="text-muted-foreground mb-3">
                      {mock.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      Path: <code className="text-foreground">/{mock.basePath}</code>
                    </span>
                    <span>•</span>
                    <span>
                      Methods:{" "}
                      {mock.endpoints.map((e) => e.method).join(", ")}
                    </span>
                    <span>•</span>
                    <span>{mock.accessCount} calls</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <code className="text-xs bg-black/30 px-3 py-1 rounded flex-1 overflow-x-auto">
                      {mock.mockUrl}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(mock.mockUrl)}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Link href={`/dashboard/mocks/${mock.id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(mock.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

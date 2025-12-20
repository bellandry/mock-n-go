"use client";

import { MockCard } from "@/components/mocks/mock-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useActiveOrganization } from "@/lib/auth-client";
import { MockConfig } from "@/types/mock";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
      }
    } catch (error) {
      console.error("Error deleting mock:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mock APIs</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your mock API endpoints
          </p>
        </div>
        <Link href="/dashboard/mocks/new">
          <Button>
            <Plus className="w-4 h-4" />
            New Mock
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
            <div key={mock.id}>
              <MockCard mock={mock} onDelete={() => handleDelete(mock.id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

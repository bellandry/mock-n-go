"use client";

import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toastManager } from "@/components/ui/toast";
import { Field, MockConfig } from "@/types/mock";
import {
  BookOpen,
  Copy,
  ExternalLink,
  Loader2,
  Settings,
  Trash2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MockDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [mock, setMock] = useState<MockConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: "bg-blue-500/10 text-blue-600 border-blue-500/30",
      POST: "bg-green-500/10 text-green-600 border-green-500/30",
      PUT: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
      PATCH: "bg-orange-500/10 text-orange-600 border-orange-500/30",
      DELETE: "bg-red-500/10 text-red-600 border-red-500/30",
    };
    return colors[method] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  return (
    <>
      <div className="space-y-6 max-w-6xl w-full mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{mock.name}</h1>
              <Badge
                variant="outline"
                className={
                  mock.isActive
                    ? "bg-green-500/20 text-green-600 border-green-500/30"
                    : "bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
                }
              >
                {mock.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            {mock.description && (
              <p className="text-muted-foreground">{mock.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-500"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Base URL */}
        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Base URL
          </h2>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            <code className="text-sm bg-muted px-4 py-2 rounded flex-1 overflow-x-auto w-full">
              {mock.mockUrl}
            </code>
            <div className="flex gap-2">
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
          </div>
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

        {/* Endpoints Documentation */}
        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            API Endpoints
          </h2>

          <Tabs defaultValue={mock.endpoints[0]?.method || "GET"} className="w-full">
            <TabsList className="grid grid-cols-5">
              {["GET", "POST", "PUT", "PATCH", "DELETE"].map((method) => {
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
                {/* Endpoint Overview */}
                <div className="bg-muted rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`${getMethodColor(endpoint.method)} font-mono`}
                    >
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm">{mock.mockUrl}</code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {endpoint.method === "GET" &&
                      "Retrieve a list of resources with optional pagination"}
                    {endpoint.method === "POST" &&
                      "Create a new resource"}
                    {endpoint.method === "PUT" &&
                      "Update an existing resource (full replacement)"}
                    {endpoint.method === "PATCH" &&
                      "Partially update an existing resource"}
                    {endpoint.method === "DELETE" &&
                      "Delete a resource"}
                  </p>
                </div>

                {/* Configuration */}
                <div>
                  <h3 className="font-semibold mb-3">Configuration</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-muted rounded p-3">
                      <p className="text-xs text-muted-foreground">Access Count</p>
                      <p className="text-lg font-semibold">{endpoint.accessCount}</p>
                    </div>
                    {endpoint.count !== null && (
                      <div className="bg-muted rounded p-3">
                        <p className="text-xs text-muted-foreground">Items Count</p>
                        <p className="text-lg font-semibold">{endpoint.count}</p>
                      </div>
                    )}
                    <div className="bg-muted rounded p-3">
                      <p className="text-xs text-muted-foreground">Pagination</p>
                      <p className="text-lg font-semibold">
                        {endpoint.pagination ? "✓ Yes" : "✗ No"}
                      </p>
                    </div>
                    <div className="bg-muted rounded p-3">
                      <p className="text-xs text-muted-foreground">Random Errors</p>
                      <p className="text-lg font-semibold">
                        {endpoint.randomErrors
                          ? `${endpoint.errorRate}%`
                          : "✗ No"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fields/Schema */}
                {endpoint.fields && (endpoint.fields as Field[]).length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">
                      {endpoint.method === "GET" ? "Response Fields" : "Request Schema"}
                    </h3>
                    <div className="space-y-2">
                      {(endpoint.fields as Field[]).map((field, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted rounded"
                        >
                          <div className="flex items-center gap-3">
                            <code className="font-mono text-sm font-semibold">
                              {field.name}
                            </code>
                            {field.customValue && (
                              <span className="text-xs text-muted-foreground">
                                = {field.customValue}
                              </span>
                            )}
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-white/5 text-xs font-mono"
                          >
                            {field.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Usage Examples */}
                <div>
                  <h3 className="font-semibold mb-3">Usage Example</h3>
                  <div className="bg-muted rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">cURL</p>
                      <div className="dark:bg-black/20 bg-white rounded p-3 relative group">
                        <code className="text-xs font-mono text-green-500 break-all">
                          {endpoint.method === "GET" &&
                            `curl -X GET "${mock.mockUrl}${
                              endpoint.pagination ? "?page=1&limit=10" : ""
                            }"`}
                          {endpoint.method === "POST" &&
                            `curl -X POST "${mock.mockUrl}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"key": "value"}'`}
                          {endpoint.method === "PUT" &&
                            `curl -X PUT "${mock.mockUrl}/[id]" \\\n  -H "Content-Type: application/json" \\\n  -d '{"key": "value"}'`}
                          {endpoint.method === "PATCH" &&
                            `curl -X PATCH "${mock.mockUrl}/[id]" \\\n  -H "Content-Type: application/json" \\\n  -d '{"key": "value"}'`}
                          {endpoint.method === "DELETE" &&
                            `curl -X DELETE "${mock.mockUrl}/[id]"`}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() =>
                            copyToClipboard(
                              endpoint.method === "GET"
                                ? `curl -X GET "${mock.mockUrl}${
                                    endpoint.pagination ? "?page=1&limit=10" : ""
                                  }"`
                                : endpoint.method === "POST"
                                ? `curl -X POST "${mock.mockUrl}" -H "Content-Type: application/json" -d '{"key": "value"}'`
                                : endpoint.method === "PUT"
                                ? `curl -X PUT "${mock.mockUrl}/[id]" -H "Content-Type: application/json" -d '{"key": "value"}'`
                                : endpoint.method === "PATCH"
                                ? `curl -X PATCH "${mock.mockUrl}/[id]" -H "Content-Type: application/json" -d '{"key": "value"}'`
                                : `curl -X DELETE "${mock.mockUrl}/[id]"`
                            )
                          }
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">JavaScript (fetch)</p>
                      <div className="dark:bg-black/20 bg-white rounded p-3 relative group">
                        <code className="text-xs font-mono text-blue-500 break-all">
                          {endpoint.method === "GET" &&
                            `fetch('${mock.mockUrl}${
                              endpoint.pagination ? "?page=1&limit=10" : ""
                            }')`}
                          {endpoint.method === "POST" &&
                            `fetch('${mock.mockUrl}', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ key: 'value' })\n})`}
                          {endpoint.method === "PUT" &&
                            `fetch('${mock.mockUrl}/[id]', {\n  method: 'PUT',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ key: 'value' })\n})`}
                          {endpoint.method === "PATCH" &&
                            `fetch('${mock.mockUrl}/[id]', {\n  method: 'PATCH',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ key: 'value' })\n})`}
                          {endpoint.method === "DELETE" &&
                            `fetch('${mock.mockUrl}/[id]', { method: 'DELETE' })`}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() =>
                            copyToClipboard(
                              endpoint.method === "GET"
                                ? `fetch('${mock.mockUrl}${
                                    endpoint.pagination ? "?page=1&limit=10" : ""
                                  }')`
                                : endpoint.method === "POST"
                                ? `fetch('${mock.mockUrl}', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'value' }) })`
                                : endpoint.method === "PUT"
                                ? `fetch('${mock.mockUrl}/[id]', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'value' }) })`
                                : endpoint.method === "PATCH"
                                ? `fetch('${mock.mockUrl}/[id]', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'value' }) })`
                                : `fetch('${mock.mockUrl}/[id]', { method: 'DELETE' })`
                            )
                          }
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Card>

        {/* Metadata */}
        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <h2 className="text-lg font-semibold">Metadata</h2>
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

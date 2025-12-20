"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toastManager } from "@/components/ui/toast";
import { FIELD_TYPES, generateMockData } from "@/lib/faker-generator";
import { Field, FieldType } from "@/types/mock";
import { Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditMockPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    basePath: "",
    description: "",
    isActive: true,
    count: 10,
    pagination: true,
    randomErrors: false,
    errorRate: 0,
    delay: 0,
  });

  const [fields, setFields] = useState<Field[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);

  // Fetch existing mock data
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
        
        // Set form data
        setFormData({
          name: data.name,
          basePath: data.basePath,
          description: data.description || "",
          isActive: data.isActive,
          count: data.endpoints[0]?.count || 10,
          pagination: data.endpoints[0]?.pagination || false,
          randomErrors: data.endpoints[0]?.randomErrors || false,
          errorRate: data.endpoints[0]?.errorRate || 0,
          delay: data.endpoints[0]?.delay || 0,
        });

        // Set fields from GET endpoint
        const getEndpoint = data.endpoints.find((e: any) => e.method === "GET");
        if (getEndpoint && getEndpoint.fields) {
          const loadedFields = getEndpoint.fields as Field[];
          setFields(loadedFields);
          updatePreview(loadedFields);
        }
      } else if (res.status === 404) {
        router.push("/dashboard/mocks");
      }
    } catch (error) {
      console.error("Error fetching mock:", error);
      toastManager.add({
        type: "error",
        title: "Error",
        description: "Failed to load mock data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add new field
  const addField = () => {
    setFields([...fields, { name: "", type: "uuid" }]);
  };

  // Remove field
  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
    if (newFields.length > 0) {
      updatePreview(newFields);
    } else {
      setPreviewData([]);
    }
  };

  // Update field
  const updateField = (index: number, key: keyof Field, value: any) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [key]: value };
    setFields(newFields);
    updatePreview(newFields);
  };

  // Update preview
  const updatePreview = (fieldsToPreview: Field[] = fields) => {
    if (fieldsToPreview.length === 0 || fieldsToPreview.some(f => !f.name)) {
      setPreviewData([]);
      return;
    }
    const data = generateMockData(fieldsToPreview, 2);
    setPreviewData(data);
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (fields.length === 0 || fields.some(f => !f.name)) {
      toastManager.add({
        type: "error",
        title: "Validation Error",
        description: "Please add at least one field with a name",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/mock/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          fields,
        }),
      });

      if (res.ok) {
        toastManager.add({
          type: "success",
          title: "Success",
          description: "Mock API updated successfully",
        });
        router.push(`/dashboard/mocks/${params.id}`);
      } else {
        const error = await res.json();
        toastManager.add({
          type: "error",
          title: "Error",
          description: error.error || "Failed to update mock",
        });
      }
    } catch (error) {
      console.error("Error updating mock:", error);
      toastManager.add({
        type: "error",
        title: "Error",
        description: "Failed to update mock",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Mock API</h1>
        <p className="text-muted-foreground mt-1">
          Update your mock API configuration
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Configuration */}
        <div className="space-y-6">
          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Mock Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Users API"
                  required
                />
              </div>

              <div>
                <Label htmlFor="basePath">Base Path *</Label>
                <Input
                  id="basePath"
                  value={formData.basePath}
                  onChange={(e) =>
                    setFormData({ ...formData, basePath: e.target.value })
                  }
                  placeholder="e.g., users"
                  required
                  disabled
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Base path cannot be changed after creation
                </p>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Optional description"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Active</Label>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <h2 className="text-xl font-semibold mb-4">Response Configuration</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="count">Number of Items</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.count}
                  onChange={(e) =>
                    setFormData({ ...formData, count: parseInt(e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="pagination">Enable Pagination</Label>
                <Switch
                  id="pagination"
                  checked={formData.pagination}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, pagination: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="randomErrors">Random Errors</Label>
                <Switch
                  id="randomErrors"
                  checked={formData.randomErrors}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, randomErrors: checked })
                  }
                />
              </div>

              {formData.randomErrors && (
                <div>
                  <Label htmlFor="errorRate">
                    Error Rate: {formData.errorRate}%
                  </Label>
                  <Slider
                    id="errorRate"
                    min={0}
                    max={100}
                    step={5}
                    value={formData.errorRate}
                    onValueChange={(value) =>
                      setFormData({ ...formData, errorRate: Array.isArray(value) ? value[0] : value })
                    }
                  />
                </div>
              )}

              <div>
                <Label htmlFor="delay">Response Delay (ms)</Label>
                <Input
                  id="delay"
                  type="number"
                  min="0"
                  max="10000"
                  value={formData.delay}
                  onChange={(e) =>
                    setFormData({ ...formData, delay: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Fields</h2>
              <Button type="button" size="sm" onClick={addField}>
                <Plus className="w-4 h-4 mr-1" />
                Add Field
              </Button>
            </div>

            <div className="space-y-3">
              {fields.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No fields yet. Add a field to get started.
                </p>
              ) : (
                fields.map((field, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Field name"
                      value={field.name}
                      onChange={(e) =>
                        updateField(index, "name", e.target.value)
                      }
                      className="flex-1"
                    />
                    <Select
                      value={field.type}
                      onValueChange={(value) =>
                        updateField(index, "type", value as FieldType)
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FIELD_TYPES.map((ft) => (
                          <SelectItem key={ft.value} value={ft.value}>
                            {ft.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeField(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 sticky top-16">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">JSON Preview</h2>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => updatePreview()}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
            </div>

            <div className="bg-muted rounded-lg p-4 overflow-x-auto max-h-[600px] overflow-y-auto">
              <pre className="text-xs">
                {previewData.length > 0
                  ? JSON.stringify(previewData, null, 2)
                  : "// Add fields to see preview"}
              </pre>
            </div>

            <div className="mt-6 flex gap-2">
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting || fields.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Mock API"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}

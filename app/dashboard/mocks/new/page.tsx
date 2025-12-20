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
import { FIELD_TYPES, generateMockData } from "@/lib/faker-generator";
import { PRESETS } from "@/lib/presets";
import { Field, FieldType } from "@/types/mock";
import { Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewMockPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0].name);
  
  const [formData, setFormData] = useState({
    name: "",
    basePath: "",
    description: "",
    count: 10,
    pagination: true,
    randomErrors: false,
    errorRate: 0,
  });

  const [fields, setFields] = useState<Field[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);

  // Handle preset selection
  const handlePresetChange = (presetName: string) => {
    setSelectedPreset(presetName);
    const preset = PRESETS.find((p) => p.name === presetName);
    if (preset) {
      setFields([...preset.fields]);
      if (preset.fields.length > 0) {
        updatePreview(preset.fields);
      }
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

  // Auto-generate basePath from name
  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      basePath: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    });
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (fields.length === 0 || fields.some(f => !f.name)) {
      alert("Please add at least one field with a name");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          fields,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/dashboard/mocks/${data.id}`);
      } else {
        const error = await res.json();
        alert(error.error || "Failed to create mock");
      }
    } catch (error) {
      console.error("Error creating mock:", error);
      alert("Failed to create mock");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Mock API</h1>
        <p className="text-muted-foreground mt-1">
          Configure your mock API endpoint with custom fields
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Configuration */}
        <div className="space-y-6">
          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="preset">Preset Template</Label>
                <Select value={selectedPreset} onValueChange={(value) => handlePresetChange(value as string)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESETS.map((preset) => (
                      <SelectItem key={preset.name} value={preset.name}>
                        {preset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {PRESETS.find(p => p.name === selectedPreset)?.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {PRESETS.find(p => p.name === selectedPreset)?.description}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="name">Mock Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
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
                />
                <p className="text-xs text-muted-foreground mt-1">
                  URL: /api/mock/[id]/{formData.basePath || "..."}
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
          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 sticky top-6">
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

            <div className="bg-black/30 rounded-lg p-4 overflow-x-auto max-h-[600px] overflow-y-auto">
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
                    Creating...
                  </>
                ) : (
                  "Create Mock API"
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

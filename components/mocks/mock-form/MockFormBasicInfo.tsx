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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PRESETS } from "@/lib/presets";

interface MockFormBasicInfoProps {
  formData: {
    name: string;
    basePath: string;
    description: string;
    isActive?: boolean;
  };
  onFormDataChange: (data: any) => void;
  onPresetChange?: (presetName: string | null) => void;
  selectedPreset?: string;
  isEditMode?: boolean;
}

export function MockFormBasicInfo({
  formData,
  onFormDataChange,
  onPresetChange,
  selectedPreset,
  isEditMode = false,
}: MockFormBasicInfoProps) {
  const handleNameChange = (name: string) => {
    onFormDataChange({
      ...formData,
      name,
      basePath: isEditMode
        ? formData.basePath
        : name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    });
  };

  return (
    <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
      <h2 className="text-xl font-semibold">Basic Information</h2>

      {!isEditMode && (
        <div className="p-3 dark:bg-indigo-500/10 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
          <p className="text-sm dark:text-indigo-200 text-indigo-500">
            <strong>Free Tier:</strong> Mocks automatically expire after 24 hours. You can have up to 5 active mocks simultaneously.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {!isEditMode && onPresetChange && selectedPreset && (
          <div>
            <Label htmlFor="preset">Preset Template</Label>
            <Select value={selectedPreset} onValueChange={onPresetChange}>
              <SelectTrigger className="w-full">
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
            {PRESETS.find((p) => p.name === selectedPreset)?.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {PRESETS.find((p) => p.name === selectedPreset)?.description}
              </p>
            )}
          </div>
        )}

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
              onFormDataChange({ ...formData, basePath: e.target.value })
            }
            placeholder="e.g., users"
            required
            disabled={isEditMode}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {isEditMode
              ? "Base path cannot be changed after creation"
              : `URL: /api/mock/[id]/${formData.basePath || "..."}`}
          </p>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              onFormDataChange({ ...formData, description: e.target.value })
            }
            placeholder="Optional description"
            rows={3}
          />
        </div>

        {isEditMode && formData.isActive !== undefined && (
          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Active</Label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                onFormDataChange({ ...formData, isActive: checked })
              }
            />
          </div>
        )}
      </div>
    </Card>
  );
}

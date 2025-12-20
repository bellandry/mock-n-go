import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, RefreshCw } from "lucide-react";

interface MockFormPreviewProps {
  previewData: any[];
  onRefresh: () => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  fieldsCount: number;
  submitLabel?: string;
}

export function MockFormPreview({
  previewData,
  onRefresh,
  onSubmit,
  onCancel,
  isSubmitting,
  fieldsCount,
  submitLabel = "Create Mock API",
}: MockFormPreviewProps) {
  return (
    <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 sticky top-20">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">JSON Preview</h2>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onRefresh}
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

      <div className="flex gap-2">
        <Button
          type="submit"
          className="flex-1"
          disabled={isSubmitting || fieldsCount === 0}
          onClick={onSubmit}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {submitLabel.includes("Create") ? "Creating..." : "Updating..."}
            </>
          ) : (
            submitLabel
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Card>
  );
}

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface MockFormResponseConfigProps {
  formData: {
    count: number;
    pagination: boolean;
    randomErrors: boolean;
    errorRate: number;
    delay?: number;
  };
  onFormDataChange: (data: any) => void;
}

export function MockFormResponseConfig({
  formData,
  onFormDataChange,
}: MockFormResponseConfigProps) {
  return (
    <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
      <h2 className="text-xl font-semibold">Response Configuration</h2>

      <div>
        <div>
          <Label htmlFor="count">Number of Items</Label>
          <Input
            id="count"
            type="number"
            min="1"
            max="1000"
            value={formData.count}
            onChange={(e) =>
              onFormDataChange({ ...formData, count: parseInt(e.target.value) })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="pagination">Enable Pagination</Label>
          <Switch
            id="pagination"
            checked={formData.pagination}
            onCheckedChange={(checked) =>
              onFormDataChange({ ...formData, pagination: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="randomErrors">Random Errors</Label>
          <Switch
            id="randomErrors"
            checked={formData.randomErrors}
            onCheckedChange={(checked) =>
              onFormDataChange({ ...formData, randomErrors: checked })
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
                onFormDataChange({
                  ...formData,
                  errorRate: Array.isArray(value) ? value[0] : value,
                })
              }
            />
          </div>
        )}

        {formData.delay !== undefined && (
          <div>
            <Label htmlFor="delay">Response Delay (ms)</Label>
            <Input
              id="delay"
              type="number"
              min="0"
              max="10000"
              value={formData.delay}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  delay: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>
        )}
      </div>
    </Card>
  );
}

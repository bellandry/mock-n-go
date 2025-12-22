import { Badge } from "@/components/ui/badge";
import { getMethodColor, getMethodDescription } from "@/lib/http-methods";
import { Field } from "@/types/mock";
import { EndpointConfiguration } from "./EndpointConfiguration";
import { EndpointFields } from "./EndpointFields";
import { EndpointUsageExamples } from "./EndpointUsageExamples";

interface EndpointTabProps {
  endpoint: {
    method: string;
    accessCount: number;
    count: number | null;
    pagination: boolean;
    randomErrors: boolean;
    errorRate?: number | null;
    fields: Field[];
  };
  mockUrl: string;
  onCopy: (text: string) => void;
}

export function EndpointTab({ endpoint, mockUrl, onCopy }: EndpointTabProps) {
  return (
    <div className="space-y-4">
      {/* Endpoint Overview */}
      <div className="bg-muted rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`${getMethodColor(endpoint.method)} font-mono`}
          >
            {endpoint.method}
          </Badge>
          <code className="text-sm">{mockUrl}</code>
        </div>
        <p className="text-sm text-muted-foreground">
          {getMethodDescription(endpoint.method)}
        </p>
      </div>

      {/* Configuration */}
      <EndpointConfiguration
        accessCount={endpoint.accessCount}
        count={endpoint.count}
        pagination={endpoint.pagination}
        randomErrors={endpoint.randomErrors}
        errorRate={endpoint.errorRate}
      />

      {/* Usage Examples */}
      <EndpointUsageExamples
        method={endpoint.method}
        mockUrl={mockUrl}
        hasPagination={endpoint.pagination}
        onCopy={onCopy}
      />

      {/* Fields/Schema */}
      <EndpointFields fields={endpoint.fields} method={endpoint.method} />
    </div>
  );
}

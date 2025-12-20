import { Badge } from "@/components/ui/badge";
import { Field } from "@/types/mock";

interface EndpointFieldsProps {
  fields: Field[];
  method: string;
}

export function EndpointFields({ fields, method }: EndpointFieldsProps) {
  if (!fields || fields.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="font-semibold mb-3">
        {method === "GET" ? "Response Fields" : "Request Schema"}
      </h3>
      <div className="space-y-2">
        {fields.map((field, index) => (
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
  );
}

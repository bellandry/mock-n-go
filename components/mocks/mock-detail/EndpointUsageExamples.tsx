import { generateCurlExample, generateFetchExample } from "@/lib/code-examples";
import { CodeExample } from "./CodeExample";

interface EndpointUsageExamplesProps {
  method: string;
  mockUrl: string;
  hasPagination: boolean;
  onCopy: (text: string) => void;
}

export function EndpointUsageExamples({
  method,
  mockUrl,
  hasPagination,
  onCopy,
}: EndpointUsageExamplesProps) {
  const curlExample = generateCurlExample(method, mockUrl, hasPagination);
  const fetchExample = generateFetchExample(method, mockUrl, hasPagination);

  return (
    <div>
      <h3 className="font-semibold mb-3">Usage Example</h3>
      <div className="bg-muted rounded-lg p-4 space-y-3">
        <CodeExample
          code={curlExample}
          language="curl"
          label="cURL"
          onCopy={onCopy}
        />
        <CodeExample
          code={fetchExample}
          language="javascript"
          label="JavaScript (fetch)"
          onCopy={onCopy}
        />
      </div>
    </div>
  );
}

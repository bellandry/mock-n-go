interface EndpointConfigurationProps {
  accessCount: number;
  count: number | null;
  pagination: boolean;
  randomErrors: boolean;
  errorRate?: number | null;
}

export function EndpointConfiguration({
  accessCount,
  count,
  pagination,
  randomErrors,
  errorRate,
}: EndpointConfigurationProps) {
  return (
    <div>
      <h3 className="font-semibold mb-3">Configuration</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-muted rounded p-3">
          <p className="text-xs text-muted-foreground">Access Count</p>
          <p className="text-lg font-semibold">{accessCount}</p>
        </div>
        {count !== null && (
          <div className="bg-muted rounded p-3">
            <p className="text-xs text-muted-foreground">Items Count</p>
            <p className="text-lg font-semibold">{count}</p>
          </div>
        )}
        <div className="bg-muted rounded p-3">
          <p className="text-xs text-muted-foreground">Pagination</p>
          <p className={`text-lg font-semibold ${pagination ? "text-green-600" : "text-primary"}`}>
            {pagination ? "✓ Yes" : "✗ No"}
          </p>
        </div>
        <div className="bg-muted rounded p-3">
          <p className="text-xs text-muted-foreground">Random Errors</p>
          <p className={`text-lg font-semibold ${randomErrors ? "text-green-600" : "text-primary"}`}>
            {randomErrors ? `${errorRate}%` : "✗ No"}
          </p>
        </div>
      </div>
    </div>
  );
}

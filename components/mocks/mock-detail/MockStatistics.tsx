import { Card } from "@/components/ui/card";

interface MockStatisticsProps {
  accessCount: number;
  createdAt: string | Date;
  lastAccessedAt?: string | Date | null;
}

export function MockStatistics({
  accessCount,
  createdAt,
  lastAccessedAt,
}: MockStatisticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
        <p className="text-sm text-muted-foreground">Total Calls</p>
        <p className="text-3xl font-bold mt-1">{accessCount}</p>
      </Card>
      <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
        <p className="text-sm text-muted-foreground">Created</p>
        <p className="text-lg font-semibold mt-1">
          {new Date(createdAt).toLocaleDateString()}
        </p>
      </Card>
      <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
        <p className="text-sm text-muted-foreground">Last Accessed</p>
        <p className="text-lg font-semibold mt-1">
          {lastAccessedAt
            ? new Date(lastAccessedAt).toLocaleString()
            : "Never"}
        </p>
      </Card>
    </div>
  );
}

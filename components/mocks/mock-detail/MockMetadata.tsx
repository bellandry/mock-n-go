import { Card } from "@/components/ui/card";

interface MockMetadataProps {
  createdBy: {
    name: string | null;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

export function MockMetadata({
  createdBy,
  createdAt,
  updatedAt,
}: MockMetadataProps) {
  return (
    <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
      <h2 className="text-lg font-semibold">Metadata</h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Created by</span>
          <span>{createdBy.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Created at</span>
          <span>{new Date(createdAt).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Last updated</span>
          <span>{new Date(updatedAt).toLocaleString()}</span>
        </div>
      </div>
    </Card>
  );
}

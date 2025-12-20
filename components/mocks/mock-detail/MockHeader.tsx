import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";

interface MockHeaderProps {
  mockId: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  isDeleting: boolean;
  onDelete: () => void;
}

export function MockHeader({
  mockId,
  name,
  description,
  isActive,
  isDeleting,
  onDelete,
}: MockHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">{name}</h1>
          <Badge
            variant="outline"
            className={
              isActive
                ? "bg-green-500/20 text-green-600 border-green-500/30"
                : "bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
            }
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex gap-2">
        <Link href={`/dashboard/mocks/${mockId}/edit`}>
          <Button variant="outline">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        </Link>
        <Button
          variant="outline"
          onClick={onDelete}
          disabled={isDeleting}
          className="text-red-600 hover:text-red-500"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              Delete
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

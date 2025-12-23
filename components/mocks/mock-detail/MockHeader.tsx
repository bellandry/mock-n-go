import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toastManager } from "@/components/ui/toast";
import { getExpirationColor } from "@/lib/mock-helper";
import { MockConfig } from "@/types/mock";
import { Clock, Edit, Loader2, RefreshCw, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface MockHeaderProps {
  mock: MockConfig
  isDeleting: boolean;
  onDelete: () => void;
}

export function MockHeader({
  mock,
  isDeleting,
  onDelete,
}: MockHeaderProps) {
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isReactivating, setIsReactivating] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!mock.expiresAt) return;

    const updateTimeRemaining = () => {
      const now = new Date();
      const expiresAt = new Date(mock.expiresAt!);
      const diff = expiresAt.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining("Expired");
        setIsExpired(true);
        return;
      }

      setIsExpired(false);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setTimeRemaining(`${minutes}m`);
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [mock.expiresAt]);

  const handleReactivate = async () => {
    setIsReactivating(true);
    try {
      const response = await fetch(`/api/mock/${mock.id}/reactivate`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reactivate mock");
      }

      toastManager.add({
        title: "Mock reactivated",
        description: data.message || "Your mock has been reactivated successfully",
        type: "success",
      });
      setIsExpired(true)

      // Refresh the page to show updated data
      router.refresh();
    } catch (error: any) {
      toastManager.add({
        title: "Reactivation failed",
        description: error.message || "Failed to reactivate mock",
        type: "error",
      });
    } finally {
      setIsReactivating(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">{mock.name}</h1>
          <Badge
            variant="outline"
            className={
              mock.isActive
                ? "bg-green-500/20 text-green-600 border-green-500/30"
                : "bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
            }
          >
            {mock.isActive ? "Active" : "Inactive"}
          </Badge>
          {mock.expiresAt && (
            <>
              <span>•</span>
              <span className={`flex items-center gap-1 ${getExpirationColor(mock)}`}>
                <Clock className="size-4 mr-2" />
                {timeRemaining === "Expired" ? timeRemaining : `Expires in ${timeRemaining}`}
              </span>
            </>
          )}
        </div>
        {mock.description && (
          <p className="text-muted-foreground">{mock.description}</p>
        )}
      </div>
      <div className="flex gap-2">
        {isExpired && (
          <Button
            variant="default"
            onClick={handleReactivate}
            disabled={isReactivating}
          >
            {isReactivating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Reactivating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Reactivate
              </>
            )}
          </Button>
        )}
        <Link href={`/dashboard/mocks/${mock.id}/edit`}>
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

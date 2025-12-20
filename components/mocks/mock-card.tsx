import { MockConfig } from "@/types/mock";
import { Clock, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DeleteConfirmationDialog } from "../delete-confirmation-dialog";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { toastManager } from "../ui/toast";

export type MockCardProps = {
  mock: MockConfig;
  onDelete: () => void;
}

export const MockCard = ({mock, onDelete}: MockCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    if (!mock.expiresAt) return;

    const updateTimeRemaining = () => {
      const now = new Date();
      const expiresAt = new Date(mock.expiresAt!);
      const diff = expiresAt.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining("Expired");
        return;
      }

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

  const getExpirationColor = () => {
    if (!mock.expiresAt) return "text-muted-foreground";
    const now = new Date();
    const expiresAt = new Date(mock.expiresAt);
    const diff = expiresAt.getTime() - now.getTime();
    const hours = diff / (1000 * 60 * 60);

    if (hours <= 0) return "text-red-400";
    if (hours < 1) return "text-red-400";
    if (hours < 6) return "text-yellow-400";
    return "text-green-400";
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toastManager.add({
      title: "Copied to clipboard",
      description: "Mock URL copied to clipboard",
      type: "success",
    })
  };

  return (
    <>
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={onDelete}
        title="Delete Mock API"
        description="This action cannot be undone."
        itemName={mock.name}
      />
    <Card
      key={mock.id}
      className="p-4 md:p-6 bg-white/5 backdrop-blur-sm border-white/10"
    >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 justify-between">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold">{mock.name}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    mock.isActive
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-700"
                  }`}
                >
                  {mock.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Link href={`/dashboard/mocks/${mock.id}`}>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Eye className="size-4" />
                    View
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600 hover:text-red-500 flex items-center gap-2"
                >
                  <Trash2 className="size-4" />
                  Delete
                </Button>
              </div>
            </div>
            {mock.description && (
              <p className="text-muted-foreground mb-3">
                {mock.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <span>
                Path: <code className="text-foreground">/{mock.basePath}</code>
              </span>
              <span>•</span>
              <span>
                Methods:{" "}
                {mock.endpoints.map((e) => e.method).join(", ")}
              </span>
              <span>•</span>
              <span>{mock.accessCount} calls</span>
              {mock.expiresAt && (
                <>
                  <span>•</span>
                  <span className={`flex items-center gap-1 ${getExpirationColor()}`}>
                    <Clock className="size-3" />
                    Expires in {timeRemaining}
                  </span>
                </>
              )}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <code className="text-xs bg-muted px-3 py-2 rounded flex-1 overflow-x-auto">
                {mock.mockUrl}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(mock.mockUrl)}
              >
                Copy
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </>
  )
}
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Copy, ExternalLink } from "lucide-react";

interface MockBaseUrlProps {
  mockUrl: string;
  onCopy: (text: string) => void;
}

export function MockBaseUrl({ mockUrl, onCopy }: MockBaseUrlProps) {
  return (
    <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
      <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        Base URL
      </h2>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
        <code className="text-sm bg-muted px-4 py-2 rounded flex-1 overflow-x-auto w-full">
          {mockUrl}
        </code>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onCopy(mockUrl)}
          >
            <Copy className="w-4 h-4 mr-1" />
            Copy
          </Button>
          <a href={mockUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline">
              <ExternalLink className="w-4 h-4 mr-1" />
              Test
            </Button>
          </a>
        </div>
      </div>
    </Card>
  );
}

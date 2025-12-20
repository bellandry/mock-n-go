import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface CodeExampleProps {
  code: string;
  language: string;
  label: string;
  onCopy: (code: string) => void;
}

export function CodeExample({
  code,
  language,
  label,
  onCopy,
}: CodeExampleProps) {
  const colorClass =
    language === "curl" ? "text-green-500" : "text-blue-500";

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      <div className="dark:bg-black/20 bg-white rounded p-3 relative group">
        <code className={`text-xs font-mono ${colorClass} break-all`}>
          <pre>{code}</pre>
        </code>
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onCopy(code)}
        >
          <Copy className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

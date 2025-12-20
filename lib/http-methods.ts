export const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

export type HttpMethod = (typeof HTTP_METHODS)[number];

export function getMethodColor(method: string): string {
  const colors: Record<string, string> = {
    GET: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    POST: "bg-green-500/10 text-green-600 border-green-500/30",
    PUT: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
    PATCH: "bg-orange-500/10 text-orange-600 border-orange-500/30",
    DELETE: "bg-red-500/10 text-red-600 border-red-500/30",
  };
  return colors[method] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
}

export function getMethodDescription(method: string): string {
  const descriptions: Record<string, string> = {
    GET: "Retrieve a list of resources with optional pagination",
    POST: "Create a new resource",
    PUT: "Update an existing resource (full replacement)",
    PATCH: "Partially update an existing resource",
    DELETE: "Delete a resource",
  };
  return descriptions[method] || "";
}

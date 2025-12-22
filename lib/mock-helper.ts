import { MockConfig } from "@/types/mock";

export const getExpirationColor = (mock: MockConfig) => {
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
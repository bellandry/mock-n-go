import db from "./prisma";

// Free Tier Limits
export const FREE_TIER_LIMITS = {
  MAX_ACTIVE_MOCKS: 5,
  MOCK_EXPIRATION_HOURS: 24,
  DAILY_REQUEST_LIMIT: 100,
  MAX_RECORDS_PER_MOCK: 50,
} as const;

/**
 * Check if organization has reached the active mock limit
 */
export async function checkActiveMockLimit(
  organizationId: string
): Promise<{ allowed: boolean; current: number; limit: number }> {
  const activeMocks = await db.mockConfig.count({
    where: {
      organizationId,
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    },
  });

  return {
    allowed: activeMocks < FREE_TIER_LIMITS.MAX_ACTIVE_MOCKS,
    current: activeMocks,
    limit: FREE_TIER_LIMITS.MAX_ACTIVE_MOCKS,
  };
}

/**
 * Check and update rate limit for a mock (all endpoints combined)
 * Returns true if request is allowed, false if limit exceeded
 */
export async function checkRateLimit(mockConfigId: string): Promise<{
  allowed: boolean;
  current: number;
  limit: number;
  resetsAt?: Date;
}> {
  const mockConfig = await db.mockConfig.findUnique({
    where: { id: mockConfigId },
    select: {
      dailyRequestCount: true,
      lastRequestDate: true,
    },
  });

  if (!mockConfig) {
    throw new Error("Mock config not found");
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastRequestDay = mockConfig.lastRequestDate
    ? new Date(
        mockConfig.lastRequestDate.getFullYear(),
        mockConfig.lastRequestDate.getMonth(),
        mockConfig.lastRequestDate.getDate()
      )
    : null;

  // Reset counter if it's a new day
  const isNewDay = !lastRequestDay || lastRequestDay < today;
  const currentCount = isNewDay ? 0 : mockConfig.dailyRequestCount;

  // Check if limit exceeded
  const allowed = currentCount < FREE_TIER_LIMITS.DAILY_REQUEST_LIMIT;

  // Calculate when the limit resets (midnight UTC)
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    allowed,
    current: currentCount,
    limit: FREE_TIER_LIMITS.DAILY_REQUEST_LIMIT,
    resetsAt: tomorrow,
  };
}

/**
 * Increment the request counter for a mock (all endpoints)
 */
export async function incrementRequestCount(mockConfigId: string): Promise<void> {
  const mockConfig = await db.mockConfig.findUnique({
    where: { id: mockConfigId },
    select: {
      dailyRequestCount: true,
      lastRequestDate: true,
    },
  });

  if (!mockConfig) {
    return;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastRequestDay = mockConfig.lastRequestDate
    ? new Date(
        mockConfig.lastRequestDate.getFullYear(),
        mockConfig.lastRequestDate.getMonth(),
        mockConfig.lastRequestDate.getDate()
      )
    : null;

  // Reset counter if it's a new day
  const isNewDay = !lastRequestDay || lastRequestDay < today;

  await db.mockConfig.update({
    where: { id: mockConfigId },
    data: {
      dailyRequestCount: isNewDay ? 1 : { increment: 1 },
      lastRequestDate: now,
      accessCount: { increment: 1 },
      lastAccessedAt: now,
    },
  });
}

/**
 * Get expiration date for a new mock (24 hours from now)
 */
export function getFreeTierExpiration(): Date {
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + FREE_TIER_LIMITS.MOCK_EXPIRATION_HOURS);
  return expiration;
}

/**
 * Check if a mock has expired
 */
export function isMockExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) return false;
  return new Date() > expiresAt;
}

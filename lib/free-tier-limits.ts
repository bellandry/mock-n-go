import db from "./prisma";
import { getEffectivePlan, getOrganizationSubscription } from "./subscription-helpers";
import { SUBSCRIPTION_LIMITS } from "./subscription-limits";

/**
 * Check if organization has reached the active mock limit
 */
export async function checkActiveMockLimit(
  organizationId: string
): Promise<{ allowed: boolean; current: number; limit: number }> {
  // Get subscription and effective plan
  const subscription = await getOrganizationSubscription(organizationId);
  const effectivePlan = getEffectivePlan(subscription);
  const limits = SUBSCRIPTION_LIMITS[effectivePlan];

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

  // -1 means unlimited
  const maxMocks = limits.maxActiveMocks;
  const allowed = maxMocks === -1 || activeMocks < maxMocks;

  return {
    allowed,
    current: activeMocks,
    limit: maxMocks === -1 ? Infinity : maxMocks,
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
      organizationId: true,
    },
  });

  if (!mockConfig) {
    throw new Error("Mock config not found");
  }

  // Get subscription limits
  const subscription = await getOrganizationSubscription(mockConfig.organizationId);
  const effectivePlan = getEffectivePlan(subscription);
  const limits = SUBSCRIPTION_LIMITS[effectivePlan];

  // -1 means unlimited
  if (limits.dailyRequestLimit === -1) {
    return {
      allowed: true,
      current: 0,
      limit: -1,
    };
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
  const allowed = currentCount < limits.dailyRequestLimit;

  // Calculate when the limit resets (midnight UTC)
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    allowed,
    current: currentCount,
    limit: limits.dailyRequestLimit,
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
 * Check if a mock has expired
 */
export function isMockExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) return false;
  return new Date() > expiresAt;
}

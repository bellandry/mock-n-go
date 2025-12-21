import { SubscriptionPlan } from "@prisma/client";

export interface SubscriptionLimits {
  maxActiveMocks: number; // -1 = unlimited
  mockExpirationHours?: number; // undefined = unlimited
  mockExpirationDays?: number;
  dailyRequestLimit: number; // -1 = unlimited
  maxRecordsPerMock: number; // -1 = unlimited
  features: {
    graphql: boolean;
    manualDeletion: boolean;
    customEndpoints: boolean;
    export: boolean;
    watermark: boolean;
    collaboration: boolean;
    versioning: boolean;
  };
}

export const SUBSCRIPTION_LIMITS: Record<SubscriptionPlan, SubscriptionLimits> = {
  FREE: {
    maxActiveMocks: 5,
    mockExpirationHours: 24,
    dailyRequestLimit: 100,
    maxRecordsPerMock: 50,
    features: {
      graphql: false,
      manualDeletion: false,
      customEndpoints: false,
      export: false,
      watermark: true,
      collaboration: false,
      versioning: false,
    },
  },
  PRO: {
    maxActiveMocks: -1, // unlimited
    mockExpirationDays: 30,
    dailyRequestLimit: -1, // unlimited
    maxRecordsPerMock: -1, // unlimited
    features: {
      graphql: true,
      manualDeletion: true,
      customEndpoints: true,
      export: true,
      watermark: false,
      collaboration: false,
      versioning: false,
    },
  },
  TEAM: {
    maxActiveMocks: -1, // unlimited
    mockExpirationDays: -1, // unlimited (as long as subscription is active)
    dailyRequestLimit: -1, // unlimited
    maxRecordsPerMock: -1, // unlimited
    features: {
      graphql: true,
      manualDeletion: true,
      customEndpoints: true,
      export: true,
      watermark: false,
      collaboration: true,
      versioning: true,
    },
  },
};

export function getSubscriptionLimits(plan: SubscriptionPlan): SubscriptionLimits {
  return SUBSCRIPTION_LIMITS[plan];
}

export function getMockExpiration(plan: SubscriptionPlan): Date | null {
  const limits = SUBSCRIPTION_LIMITS[plan];
  const expiration = new Date();
  
  if (limits.mockExpirationHours) {
    expiration.setHours(expiration.getHours() + limits.mockExpirationHours);
    return expiration;
  }
  
  if (limits.mockExpirationDays && limits.mockExpirationDays > 0) {
    expiration.setDate(expiration.getDate() + limits.mockExpirationDays);
    return expiration;
  }
  
  // Unlimited expiration
  return null;
}

import { SubscriptionPlan, SubscriptionStatus } from "@prisma/client";
import db from "./prisma";
import { SUBSCRIPTION_LIMITS } from "./subscription-limits";

/**
 * Get organization's subscription
 * Creates a FREE subscription if none exists
 */
export async function getOrganizationSubscription(organizationId: string) {
  let subscription = await db.subscription.findUnique({
    where: { organizationId },
  });

  // Create FREE subscription if none exists (for existing organizations)
  if (!subscription) {
    subscription = await db.subscription.create({
      data: {
        organizationId,
        plan: SubscriptionPlan.FREE,
        status: SubscriptionStatus.ACTIVE,
      },
    });
  }

  return subscription;
}

/**
 * Get effective subscription plan (considering trial)
 */
export function getEffectivePlan(subscription: {
  plan: SubscriptionPlan;
  isTrialing: boolean;
  trialEndsAt: Date | null;
}): SubscriptionPlan {
  // If trialing and trial hasn't ended, use PRO plan
  if (subscription.isTrialing && subscription.trialEndsAt) {
    const now = new Date();
    if (now < subscription.trialEndsAt) {
      return SubscriptionPlan.PRO;
    }
  }

  return subscription.plan;
}

/**
 * Check if organization has access to a feature
 */
export async function checkFeatureAccess(
  organizationId: string,
  feature: keyof typeof SUBSCRIPTION_LIMITS.FREE.features
): Promise<boolean> {
  const subscription = await getOrganizationSubscription(organizationId);
  const effectivePlan = getEffectivePlan(subscription);
  const limits = SUBSCRIPTION_LIMITS[effectivePlan];

  return limits.features[feature];
}

/**
 * Start 14-day Pro trial
 */
export async function startProTrial(organizationId: string) {
  const subscription = await getOrganizationSubscription(organizationId);

  // Check if already trialed or on paid plan
  if (subscription.plan !== SubscriptionPlan.FREE) {
    throw new Error("Trial is only available for free tier users");
  }

  if (subscription.trialEndsAt) {
    throw new Error("Trial already used");
  }

  // Set trial end date to 14 days from now
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 14);

  return await db.subscription.update({
    where: { organizationId },
    data: {
      isTrialing: true,
      trialEndsAt,
      status: SubscriptionStatus.TRIALING,
    },
  });
}

/**
 * Check if trial is active
 */
export function isTrialActive(subscription: {
  isTrialing: boolean;
  trialEndsAt: Date | null;
}): boolean {
  if (!subscription.isTrialing || !subscription.trialEndsAt) {
    return false;
  }

  const now = new Date();
  return now < subscription.trialEndsAt;
}

/**
 * Get days remaining in trial
 */
export function getTrialDaysRemaining(subscription: {
  isTrialing: boolean;
  trialEndsAt: Date | null;
}): number {
  if (!isTrialActive(subscription)) {
    return 0;
  }

  const now = new Date();
  const diff = subscription.trialEndsAt!.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

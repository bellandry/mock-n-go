/**
 * Dodo Payments Webhook Event Handlers
 * 
 * This module contains handlers for different Dodo Payments webhook events.
 * Each handler updates the database based on the webhook event data.
 */

import { SubscriptionPlan, SubscriptionStatus } from "@prisma/client";
import db from "../prisma";

/**
 * Map Dodo Payments plan to our internal plan enum
 */
function mapDodoPlanToInternal(productId: string): SubscriptionPlan {
  const proProdId = process.env.DODO_PRO_PRODUCT_ID;
  const teamProdId = process.env.DODO_TEAM_PRODUCT_ID;

  if (productId === proProdId) {
    return SubscriptionPlan.PRO;
  } else if (productId === teamProdId) {
    return SubscriptionPlan.TEAM;
  }
  
  return SubscriptionPlan.FREE;
}

/**
 * Map Dodo Payments status to our internal status enum
 */
function mapDodoStatusToInternal(status: string): SubscriptionStatus {
  switch (status.toLowerCase()) {
    case 'active':
      return SubscriptionStatus.ACTIVE;
    case 'canceled':
    case 'cancelled':
      return SubscriptionStatus.CANCELED;
    case 'past_due':
      return SubscriptionStatus.PAST_DUE;
    case 'trialing':
      return SubscriptionStatus.TRIALING;
    default:
      return SubscriptionStatus.ACTIVE;
  }
}

/**
 * Handle payment.completed event
 * This event is triggered when a payment is successfully processed
 */
export async function handlePaymentCompleted(event: any) {
  console.log('Payment completed:', event.data);
  
  const { payment_id, amount, currency, customer_id, metadata } = event.data;

  // Log the payment for record keeping
  // You could create a Payment model in Prisma to track all payments
  console.log(`Payment ${payment_id} completed: ${amount} ${currency} for customer ${customer_id}`);

  return { success: true };
}

/**
 * Handle subscription.created event
 * This event is triggered when a new subscription is created
 */
export async function handleSubscriptionCreated(event: any) {
  console.log('Subscription created:', event.data);
  
  const {
    subscription_id,
    customer_id,
    product_id,
    status,
    created_at,
    next_billing_date,
    trial_period_days,
    metadata,
  } = event.data;

  // Get organization ID from metadata
  const organizationId = metadata?.organization_id;
  
  if (!organizationId) {
    console.error('No organization_id in subscription metadata');
    return { success: false, error: 'Missing organization_id' };
  }

  // Map Dodo Payments data to our internal format
  const plan = mapDodoPlanToInternal(product_id);
  const internalStatus = mapDodoStatusToInternal(status);

  // Use created_at as period start, or current time if not provided
  const periodStart = created_at ? new Date(created_at) : new Date();
  
  // Determine if subscription has a trial period
  const hasTrial = trial_period_days && trial_period_days > 0;
  
  // For trial subscriptions, the trial ends at next_billing_date
  // For non-trial, currentPeriodEnd is next_billing_date
  const nextBillingDate = next_billing_date ? new Date(next_billing_date) : null;
  
  // Set trial status based on trial_period_days and current time
  const now = new Date();
  const isTrialing = hasTrial && nextBillingDate && now < nextBillingDate;
  const trialEndsAt = isTrialing && nextBillingDate ? nextBillingDate : null;
  
  // Current period end is the next billing date
  const periodEnd = nextBillingDate || new Date(periodStart.getTime() + 30 * 24 * 60 * 60 * 1000); // Default 30 days

  // Create or update subscription
  await db.subscription.upsert({
    where: { organizationId },
    create: {
      organizationId,
      plan,
      status: internalStatus,
      dodoCustomerId: customer_id,
      dodoSubscriptionId: subscription_id,
      dodoProductId: product_id,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      isTrialing,
      trialEndsAt,
    },
    update: {
      plan,
      status: internalStatus,
      dodoCustomerId: customer_id,
      dodoSubscriptionId: subscription_id,
      dodoProductId: product_id,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      isTrialing,
      trialEndsAt,
    },
  });

  console.log(`Subscription created/updated for organization ${organizationId}, trial: ${isTrialing}, trial ends: ${trialEndsAt}`);
  return { success: true };
}

/**
 * Handle subscription.active event
 * This event is triggered when a subscription becomes active (including during trial)
 */
export async function handleSubscriptionActive(event: any) {
  console.log('Subscription active:', event.data);
  
  const {
    subscription_id,
    customer_id,
    product_id,
    status,
    created_at,
    next_billing_date,
    previous_billing_date,
    trial_period_days,
    metadata,
  } = event.data;

  // Get organization ID from metadata
  const organizationId = metadata?.organization_id;
  
  if (!organizationId) {
    console.error('No organization_id in subscription metadata');
    return { success: false, error: 'Missing organization_id' };
  }

  // Map Dodo Payments data to our internal format
  const plan = mapDodoPlanToInternal(product_id);
  const internalStatus = SubscriptionStatus.ACTIVE; // Force ACTIVE status

  // Use previous_billing_date or created_at as period start
  const periodStart = previous_billing_date 
    ? new Date(previous_billing_date) 
    : (created_at ? new Date(created_at) : new Date());
  
  // Determine if subscription has a trial period
  const hasTrial = trial_period_days && trial_period_days > 0;
  
  // For trial subscriptions, the trial ends at next_billing_date
  const nextBillingDate = next_billing_date ? new Date(next_billing_date) : null;
  
  // Set trial status based on trial_period_days and current time
  const now = new Date();
  const isTrialing = hasTrial && nextBillingDate && now < nextBillingDate;
  const trialEndsAt = isTrialing && nextBillingDate ? nextBillingDate : null;
  
  // Current period end is the next billing date
  const periodEnd = nextBillingDate || new Date(periodStart.getTime() + 30 * 24 * 60 * 60 * 1000);

  // Create or update subscription
  await db.subscription.upsert({
    where: { organizationId },
    create: {
      organizationId,
      plan,
      status: internalStatus,
      dodoCustomerId: customer_id,
      dodoSubscriptionId: subscription_id,
      dodoProductId: product_id,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      isTrialing,
      trialEndsAt,
    },
    update: {
      plan,
      status: internalStatus,
      dodoCustomerId: customer_id,
      dodoSubscriptionId: subscription_id,
      dodoProductId: product_id,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      isTrialing,
      trialEndsAt,
    },
  });

  console.log(`Subscription active for organization ${organizationId}, trial: ${isTrialing}, trial ends: ${trialEndsAt}`);
  return { success: true };
}

/**
 * Handle subscription.renewed event
 * This event is triggered when a subscription is renewed (recurring payment)
 */
export async function handleSubscriptionRenewed(event: any) {
  console.log('Subscription renewed:', event.data);
  
  const {
    subscription_id,
    previous_billing_date,
    next_billing_date,
    status,
  } = event.data;

  // Find subscription by Dodo subscription ID
  const subscription = await db.subscription.findUnique({
    where: { dodoSubscriptionId: subscription_id },
  });

  if (!subscription) {
    console.error(`Subscription not found: ${subscription_id}`);
    return { success: false, error: 'Subscription not found' };
  }

  // Update subscription with new period dates
  await db.subscription.update({
    where: { id: subscription.id },
    data: {
      currentPeriodStart: previous_billing_date ? new Date(previous_billing_date) : subscription.currentPeriodStart,
      currentPeriodEnd: next_billing_date ? new Date(next_billing_date) : subscription.currentPeriodEnd,
      status: mapDodoStatusToInternal(status),
      isTrialing: false, // Renewal means trial is over
      trialEndsAt: null, // Clear trial end date
    },
  });

  console.log(`Subscription renewed: ${subscription_id}`);
  return { success: true };
}

/**
 * Handle subscription.updated event
 * This event is triggered when subscription details are updated
 */
export async function handleSubscriptionUpdated(event: any) {
  console.log('Subscription updated:', event.data);
  
  const {
    subscription_id,
    product_id,
    status,
    previous_billing_date,
    next_billing_date,
    trial_period_days,
  } = event.data;

  // Find subscription by Dodo subscription ID
  const subscription = await db.subscription.findUnique({
    where: { dodoSubscriptionId: subscription_id },
  });

  if (!subscription) {
    console.error(`Subscription not found: ${subscription_id}`);
    return { success: false, error: 'Subscription not found' };
  }

  // Update subscription
  const plan = mapDodoPlanToInternal(product_id);
  
  // Determine trial status
  const hasTrial = trial_period_days && trial_period_days > 0;
  const nextBillingDate = next_billing_date ? new Date(next_billing_date) : null;
  const now = new Date();
  const isTrialing = hasTrial && nextBillingDate && now < nextBillingDate;
  const trialEndsAt = isTrialing && nextBillingDate ? nextBillingDate : null;
  
  await db.subscription.update({
    where: { id: subscription.id },
    data: {
      plan,
      status: mapDodoStatusToInternal(status),
      dodoProductId: product_id,
      currentPeriodStart: previous_billing_date ? new Date(previous_billing_date) : undefined,
      currentPeriodEnd: nextBillingDate || undefined,
      isTrialing,
      trialEndsAt,
    },
  });

  console.log(`Subscription updated: ${subscription_id}, trial: ${isTrialing}`);
  return { success: true };
}

/**
 * Handle subscription.canceled event
 * This event is triggered when a subscription is canceled
 */
export async function handleSubscriptionCanceled(event: any) {
  console.log('Subscription canceled:', event.data);
  
  const {
    subscription_id,
    canceled_at,
    current_period_end,
  } = event.data;

  // Find subscription by Dodo subscription ID
  const subscription = await db.subscription.findUnique({
    where: { dodoSubscriptionId: subscription_id },
  });

  if (!subscription) {
    console.error(`Subscription not found: ${subscription_id}`);
    return { success: false, error: 'Subscription not found' };
  }

  // Update subscription status to CANCELED
  // Keep access until end of current period
  await db.subscription.update({
    where: { id: subscription.id },
    data: {
      status: SubscriptionStatus.CANCELED,
      // Keep the current period end date so user has access until then
      currentPeriodEnd: current_period_end ? new Date(current_period_end) : subscription.currentPeriodEnd,
    },
  });

  console.log(`Subscription canceled: ${subscription_id}, access until ${current_period_end}`);
  return { success: true };
}

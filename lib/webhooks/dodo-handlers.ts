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
  // console.log('Subscription created:', event.data);
  
  const {
    subscription_id,
    customer_id,
    product_id,
    status,
    current_period_start,
    current_period_end,
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

  // Handle dates - if not provided, calculate them
  const now = new Date();
  const periodStart = current_period_start ? new Date(current_period_start) : now;
  
  // Dodo Payments adds 14 days trial by default
  // If no end date provided, set it to 14 days from start
  let periodEnd: Date;
  if (current_period_end) {
    periodEnd = new Date(current_period_end);
  } else {
    periodEnd = new Date(periodStart);
    periodEnd.setDate(periodEnd.getDate() + 14); // 14 days trial
  }

  // Determine if this is a trial
  const isTrialing = status === 'trialing' || !current_period_end;
  const trialEndsAt = isTrialing ? periodEnd : null;

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

  console.log(`Subscription created/updated for organization ${organizationId}`);
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
    current_period_start,
    current_period_end,
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
      currentPeriodStart: new Date(current_period_start),
      currentPeriodEnd: new Date(current_period_end),
      status: mapDodoStatusToInternal(status),
      isTrialing: false, // Renewal means trial is over
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
    current_period_start,
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

  // Update subscription
  const plan = mapDodoPlanToInternal(product_id);
  
  await db.subscription.update({
    where: { id: subscription.id },
    data: {
      plan,
      status: mapDodoStatusToInternal(status),
      dodoProductId: product_id,
      currentPeriodStart: current_period_start ? new Date(current_period_start) : undefined,
      currentPeriodEnd: current_period_end ? new Date(current_period_end) : undefined,
    },
  });

  console.log(`Subscription updated: ${subscription_id}`);
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

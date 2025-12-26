/**
 * Dodo Payments Client Configuration
 * 
 * This module provides a configured Dodo Payments client for the application.
 * It uses the official dodopayments SDK to interact with the Dodo Payments API.
 */

import DodoPayments from 'dodopayments';

// Type definitions for Dodo Payments responses
export interface DodoCheckoutSession {
  session_id: string;
  checkout_url: string;
}

export interface DodoProduct {
  id: string;
  name: string;
  price: number;
}

export interface DodoSubscription {
  id: string;
  customer_id: string;
  product_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export interface DodoWebhookEvent {
  type: string;
  data: any;
  created_at: string;
}

/**
 * Product configuration for subscription plans
 */
export const DODO_PRODUCTS = {
  PRO: {
    id: process.env.DODO_PRO_PRODUCT_ID || '',
    name: 'Pro',
    price: 9,
  },
  TEAM: {
    id: process.env.DODO_TEAM_PRODUCT_ID || '',
    name: 'Team',
    price: 29,
  },
} as const;

/**
 * Initialize Dodo Payments client using the official SDK
 */
export function createDodoClient() {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  
  if (!apiKey) {
    throw new Error('DODO_PAYMENTS_API_KEY is not configured');
  }

  const client = new DodoPayments({
    bearerToken: apiKey,
    environment: 'test_mode',
    webhookKey: process.env.DODO_WEBHOOK_KEY,
  });

  return client;
}

/**
 * Get the Dodo Payments client instance
 */
export const dodoClient = createDodoClient();


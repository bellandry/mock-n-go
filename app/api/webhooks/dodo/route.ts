import {
  handlePaymentCompleted,
  handleSubscriptionActive,
  handleSubscriptionCanceled,
  handleSubscriptionCreated,
  handleSubscriptionRenewed,
  handleSubscriptionUpdated
} from "@/lib/webhooks/dodo-handlers";
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";

/**
 * Verify webhook signature using Svix (Standard Webhooks)
 * Dodo Payments uses the Standard Webhooks specification
 */
async function verifyWebhookSignature(
  request: NextRequest,
  body: string
): Promise<boolean> {
  try {
    const webhookSecret = process.env.DODO_WEBHOOK_KEY;
    
    if (!webhookSecret) {
      console.error('DODO_WEBHOOK_KEY is not configured');
      return false;
    }

    // Get signature headers
    const svixId = request.headers.get('webhook-id');
    const svixTimestamp = request.headers.get('webhook-timestamp');
    const svixSignature = request.headers.get('webhook-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error('Missing webhook signature headers');
      return false;
    }

    // Verify using Svix
    const wh = new Webhook(webhookSecret);
    wh.verify(body, {
      'webhook-id': svixId,
      'webhook-timestamp': svixTimestamp,
      'webhook-signature': svixSignature,
    });

    return true;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return false;
  }
}

/**
 * POST /api/webhooks/dodo
 * Handle incoming webhooks from Dodo Payments
 */
export async function POST(req: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await req.text();
    
    // Verify webhook signature
    const isValid = await verifyWebhookSignature(req, body);
    
    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse the webhook event
    const event = JSON.parse(body);
    
    console.log(`Received webhook event: ${event.type}`);

    // Route to appropriate handler based on event type
    let result;
    
    switch (event.type) {
      case 'payment.completed':
        result = await handlePaymentCompleted(event);
        break;
        
      case 'subscription.created':
        result = await handleSubscriptionCreated(event);
        break;
        
      case 'subscription.active':
        result = await handleSubscriptionActive(event);
        break;
        
      case 'subscription.renewed':
        result = await handleSubscriptionRenewed(event);
        break;
        
      case 'subscription.updated':
        result = await handleSubscriptionUpdated(event);
        break;
        
      case 'subscription.canceled':
      case 'subscription.cancelled': // Handle both spellings
        result = await handleSubscriptionCanceled(event);
        break;
        
      default:
        console.log(`Unhandled webhook event type: ${event.type}`);
        result = { success: true, message: 'Event type not handled' };
    }

    // Return success response
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    
    // Return 500 to tell Dodo Payments to retry
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhooks/dodo
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'Dodo Payments webhook endpoint is ready',
  });
}

import { auth } from "@/lib/auth";
import { DODO_PRODUCTS, dodoClient } from "@/lib/dodo-payments";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/subscription/checkout
 * Create a Dodo Payments checkout session for a subscription
 */
export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !session?.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activeOrganizationId = session.session.activeOrganizationId;
    if (!activeOrganizationId) {
      return NextResponse.json(
        { error: "No active organization" },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { plan } = body;

    // Validate plan
    if (!plan || (plan !== 'PRO' && plan !== 'TEAM')) {
      return NextResponse.json(
        { error: "Invalid plan. Must be 'PRO' or 'TEAM'" },
        { status: 400 }
      );
    }

    // Get product ID for the selected plan
    const productId = DODO_PRODUCTS[plan as keyof typeof DODO_PRODUCTS].id;

    if (!productId) {
      return NextResponse.json(
        { error: `Product ID not configured for ${plan} plan. Please set DODO_${plan}_PRODUCT_ID in environment variables.` },
        { status: 500 }
      );
    }

    // Prepare return URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const returnUrl = `${appUrl}/dashboard?payment=success`;

    // Create checkout session
    const checkoutSession = await dodoClient.checkoutSessions.create({
      product_cart: [
        {
          product_id: productId,
          quantity: 1,
        },
      ],
      customer: {
        email: session.user.email,
        name: session.user.name || undefined,
      },
      return_url: returnUrl,
      metadata: {
        organization_id: activeOrganizationId,
        user_id: session.user.id,
        plan: plan,
      },
    });

    // Return the checkout URL to the client
    return NextResponse.json({
      sessionId: checkoutSession.session_id,
      checkoutUrl: checkoutSession.checkout_url,
    });

  } catch (error) {
    console.error("Error creating checkout session:", error);
    
    // Return a more specific error message
    const errorMessage = error instanceof Error ? error.message : "Failed to create checkout session";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

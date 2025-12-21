import { auth } from "@/lib/auth";
import { startProTrial } from "@/lib/subscription-helpers";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/subscription/trial - Start 14-day Pro trial
 */
export async function POST(req: NextRequest) {
  try {
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

    const subscription = await startProTrial(activeOrganizationId);

    return NextResponse.json({
      success: true,
      subscription: {
        plan: subscription.plan,
        status: subscription.status,
        isTrialing: subscription.isTrialing,
        trialEndsAt: subscription.trialEndsAt,
      },
    });
  } catch (error: any) {
    console.error("Error starting trial:", error);
    
    if (error.message?.includes("Trial")) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

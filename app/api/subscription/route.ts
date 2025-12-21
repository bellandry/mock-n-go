import { auth } from "@/lib/auth";
import { getEffectivePlan, getOrganizationSubscription, getTrialDaysRemaining } from "@/lib/subscription-helpers";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/subscription - Get current subscription details
 */
export async function GET(req: NextRequest) {
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

    const subscription = await getOrganizationSubscription(activeOrganizationId);
    const effectivePlan = getEffectivePlan(subscription);
    const trialDaysRemaining = getTrialDaysRemaining(subscription);

    return NextResponse.json({
      plan: subscription.plan,
      effectivePlan,
      status: subscription.status,
      isTrialing: subscription.isTrialing,
      trialEndsAt: subscription.trialEndsAt,
      trialDaysRemaining,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

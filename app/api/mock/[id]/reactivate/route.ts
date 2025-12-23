import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { getEffectivePlan, getOrganizationSubscription } from "@/lib/subscription-helpers";
import { getMockExpiration } from "@/lib/subscription-limits";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/mock/[id]/reactivate - Reactivate an expired mock
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !session?.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mockConfig = await db.mockConfig.findUnique({
      where: { id },
    });

    if (!mockConfig) {
      return NextResponse.json({ error: "Mock not found" }, { status: 404 });
    }

    // Verify user has access
    if (mockConfig.organizationId !== session.session.activeOrganizationId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if mock is actually expired
    if (mockConfig.expiresAt && new Date() <= mockConfig.expiresAt) {
      return NextResponse.json(
        { error: "Mock is not expired yet" },
        { status: 400 }
      );
    }

    // Get subscription to determine new expiration
    const subscription = await getOrganizationSubscription(mockConfig.organizationId);
    const effectivePlan = getEffectivePlan(subscription);
    const newExpiresAt = getMockExpiration(effectivePlan);

    // Update mock with new expiration date and set to active
    const updated = await db.mockConfig.update({
      where: { id },
      data: {
        expiresAt: newExpiresAt,
        isActive: true,
        updatedAt: new Date(),
      },
      include: {
        endpoints: true,
      },
    });

    return NextResponse.json({
      success: true,
      mock: updated,
      message: `Mock reactivated successfully. ${
        newExpiresAt 
          ? `New expiration: ${newExpiresAt.toISOString()}`
          : "No expiration (unlimited)"
      }`,
    });
  } catch (error) {
    console.error("Error reactivating mock:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

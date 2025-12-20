import { auth } from "@/lib/auth";
import { checkActiveMockLimit } from "@/lib/free-tier-limits";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/mock/limits - Get current active mock count and limits
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

    const mockLimit = await checkActiveMockLimit(activeOrganizationId);

    return NextResponse.json({
      current: mockLimit.current,
      limit: mockLimit.limit,
      allowed: mockLimit.allowed,
    });
  } catch (error) {
    console.error("Error fetching limits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

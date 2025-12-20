import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/mock/[id] - Get a single mock configuration
 */
export async function GET(
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
      include: {
        endpoints: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!mockConfig) {
      return NextResponse.json({ error: "Mock not found" }, { status: 404 });
    }

    // Verify user has access (same organization)
    if (mockConfig.organizationId !== session.session.activeOrganizationId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Add mock URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const mockUrl = `${baseUrl}/api/mock/${mockConfig.id}/${mockConfig.basePath}`;

    return NextResponse.json({
      ...mockConfig,
      mockUrl,
    });
  } catch (error) {
    console.error("Error fetching mock:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/mock/[id] - Update a mock configuration
 */
export async function PATCH(
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

    const body = await req.json();
    const {
      name,
      description,
      isActive,
      fields,
      count,
      pagination,
      randomErrors,
      errorRate,
      delay,
    } = body;

    // Update mock config
    const updated = await db.mockConfig.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date(),
      },
      include: {
        endpoints: true,
      },
    });

    // Update GET endpoint if fields are provided
    if (fields || count || pagination !== undefined || randomErrors !== undefined || errorRate !== undefined || delay !== undefined) {
      const getEndpoint = await db.mockEndpoint.findFirst({
        where: {
          mockConfigId: id,
          method: "GET",
        },
      });

      if (getEndpoint) {
        await db.mockEndpoint.update({
          where: { id: getEndpoint.id },
          data: {
            ...(fields && { fields: fields as any }),
            ...(count && { count }),
            ...(pagination !== undefined && { pagination }),
            ...(randomErrors !== undefined && { randomErrors }),
            ...(errorRate !== undefined && { errorRate }),
            ...(delay !== undefined && { delay }),
          },
        });
      }
    }

    // Fetch updated config with endpoints
    const finalConfig = await db.mockConfig.findUnique({
      where: { id },
      include: {
        endpoints: true,
      },
    });

    return NextResponse.json(finalConfig);
  } catch (error) {
    console.error("Error updating mock:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/mock/[id] - Delete a mock configuration
 * Note: Free tier users cannot manually delete mocks (auto-expiration only)
 */
export async function DELETE(
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

    // Block manual deletion for free tier users
    // TODO: Check user subscription plan when implemented
    return NextResponse.json(
      {
        error: "Free tier mocks cannot be manually deleted. They will automatically expire after 24 hours.",
        expiresAt: mockConfig.expiresAt,
      },
      { status: 403 }
    );

    // This code will be enabled for paid users in the future
    // await db.mockConfig.delete({
    //   where: { id },
    // });
    // return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting mock:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

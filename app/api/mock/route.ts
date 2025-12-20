import { auth } from "@/lib/auth";
import { checkActiveMockLimit, getFreeTierExpiration } from "@/lib/free-tier-limits";
import db from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/mock - Create a new mock configuration
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

    // Check free tier active mock limit
    const mockLimit = await checkActiveMockLimit(activeOrganizationId);
    if (!mockLimit.allowed) {
      return NextResponse.json(
        {
          error: `Free tier limit reached. You can only have ${mockLimit.limit} active mocks simultaneously. Current: ${mockLimit.current}/${mockLimit.limit}`,
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      basePath,
      description,
      fields,
      count = 10,
      pagination = true,
      randomErrors = false,
      errorRate = 0,
      delay,
      expiresAt,
      seedData = false,
      seedCount = 5,
    } = body;

    // Validation
    if (!name || !basePath || !fields || !Array.isArray(fields)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if basePath already exists for this organization
    const existing = await db.mockConfig.findUnique({
      where: {
        organizationId_basePath: {
          organizationId: activeOrganizationId,
          basePath,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A mock with this base path already exists" },
        { status: 409 }
      );
    }

    // Create mock config with all HTTP method endpoints
    const mockConfig = await db.mockConfig.create({
      data: {
        name,
        basePath,
        description,
        organizationId: activeOrganizationId,
        createdById: session.user.id,
        expiresAt: getFreeTierExpiration(), // Auto-expire after 24 hours for free tier
        endpoints: {
          create: [
            // GET endpoint - for listing/retrieving resources
            {
              method: "GET",
              fields: fields as any,
              count,
              pagination,
              randomErrors,
              errorRate,
              delay,
            },
            // POST endpoint - for creating resources
            {
              method: "POST",
              randomErrors,
              errorRate,
              delay,
            },
            // PUT endpoint - for replacing resources
            {
              method: "PUT",
              randomErrors,
              errorRate,
              delay,
            },
            // PATCH endpoint - for updating resources
            {
              method: "PATCH",
              randomErrors,
              errorRate,
              delay,
            },
            // DELETE endpoint - for removing resources
            {
              method: "DELETE",
              randomErrors,
              errorRate,
              delay,
            },
          ],
        },
      },
      include: {
        endpoints: true,
      },
    });

    // Seed random data if requested
    if (seedData && seedCount > 0) {
      try {
        const { seedRandomData } = await import("@/lib/mock-data-manager");
        await seedRandomData(mockConfig.id, fields, Math.min(seedCount, 10));
      } catch (seedError: any) {
        // If seeding fails due to limit, delete the mock and return error
        if (seedError.message?.includes("Free tier limit")) {
          await db.mockConfig.delete({ where: { id: mockConfig.id } });
          return NextResponse.json(
            { error: seedError.message },
            { status: 403 }
          );
        }
        // For other errors, log but continue (mock is created without seed data)
        console.error("Error seeding data:", seedError);
      }
    }

    // Generate the mock URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const mockUrl = `${baseUrl}/api/mock/${mockConfig.id}/${mockConfig.basePath}`;

    return NextResponse.json(
      {
        ...mockConfig,
        mockUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating mock:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/mock - List all mocks for the active organization
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

    const mocks = await db.mockConfig.findMany({
      where: {
        organizationId: activeOrganizationId,
      },
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
      orderBy: {
        createdAt: "desc",
      },
    });

    // Add mock URLs to each mock
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const mocksWithUrls = mocks.map((mock) => ({
      ...mock,
      mockUrl: `${baseUrl}/api/mock/${mock.id}/${mock.basePath}`,
    }));

    return NextResponse.json(mocksWithUrls);
  } catch (error) {
    console.error("Error fetching mocks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

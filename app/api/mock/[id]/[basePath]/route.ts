import { generateMockData, paginateData } from "@/lib/faker-generator";
import { prisma } from "@/lib/prisma";
import { Field } from "@/lib/types/mock";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/mock/[id]/[basePath] - Serve mock data
 * Supports pagination via query params: ?page=1&limit=10
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; basePath: string }> }
) {
  try {
    const { id, basePath } = await params;

    // Find mock config
    const mockConfig = await prisma.mockConfig.findFirst({
      where: {
        id,
        basePath,
        isActive: true,
      },
      include: {
        endpoints: {
          where: {
            method: "GET",
            isActive: true,
          },
        },
      },
    });

    if (!mockConfig || mockConfig.endpoints.length === 0) {
      return NextResponse.json(
        { error: "Mock endpoint not found or inactive" },
        { status: 404 }
      );
    }

    const endpoint = mockConfig.endpoints[0];

    // Check if mock has expired
    if (mockConfig.expiresAt && new Date() > mockConfig.expiresAt) {
      return NextResponse.json(
        { error: "Mock endpoint has expired" },
        { status: 410 }
      );
    }

    // Simulate random errors if enabled
    if (endpoint.randomErrors && endpoint.errorRate > 0) {
      const shouldError = Math.random() * 100 < endpoint.errorRate;
      if (shouldError) {
        const errorCodes = [400, 401, 403, 404, 500, 502, 503];
        const randomErrorCode =
          errorCodes[Math.floor(Math.random() * errorCodes.length)];
        return NextResponse.json(
          { error: "Random error simulation" },
          { status: randomErrorCode }
        );
      }
    }

    // Simulate delay if configured
    if (endpoint.delay && endpoint.delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, endpoint.delay));
    }

    // Get pagination params from query
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Generate mock data
    const fields = endpoint.fields as Field[];
    const count = endpoint.count || 10;
    const data = generateMockData(fields, count);

    // Update access metrics (fire and forget)
    prisma.mockConfig
      .update({
        where: { id: mockConfig.id },
        data: {
          accessCount: { increment: 1 },
          lastAccessedAt: new Date(),
        },
      })
      .catch((err) => console.error("Error updating access count:", err));

    prisma.mockEndpoint
      .update({
        where: { id: endpoint.id },
        data: {
          accessCount: { increment: 1 },
        },
      })
      .catch((err) => console.error("Error updating endpoint access count:", err));

    // Return paginated or full data
    if (endpoint.pagination) {
      const paginatedResult = paginateData(data, page, limit);
      return NextResponse.json(paginatedResult);
    } else {
      return NextResponse.json({ data });
    }
  } catch (error) {
    console.error("Error serving mock data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

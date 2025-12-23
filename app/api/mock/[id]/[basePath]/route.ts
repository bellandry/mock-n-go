import { generateMockData, paginateData } from "@/lib/faker-generator";
import { checkRateLimit, incrementRequestCount } from "@/lib/free-tier-limits";
import {
  createResource,
  getResourceCount,
  getResources,
} from "@/lib/mock-data-manager";
import db from "@/lib/prisma";
import { validateRequest } from "@/lib/request-validator";
import { updateEndpointCount, updateHeaders } from "@/lib/subscription-helpers";
import { Field } from "@/types/mock";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/mock/[id]/[basePath] - Serve mock data
 * Returns stored data if available, otherwise generates with Faker
 * Supports pagination via query params: ?page=1&limit=10
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; basePath: string }> }
) {
  try {
    const { id, basePath } = await params;

    // Find mock config
    const mockConfig = await db.mockConfig.findFirst({
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

    // Check rate limit (100 requests/day for free tier - applies to entire mock)
    const rateLimit = await checkRateLimit(mockConfig.id);

    // Add headers
    const headers = updateHeaders(rateLimit)

    const endpoint = mockConfig.endpoints[0];

    // Check if mock has expired
    if (mockConfig.expiresAt && new Date() > mockConfig.expiresAt) {
      return NextResponse.json(
        { error: "Mock endpoint has expired" },
        { status: 410, headers }
      );
    }

    if (!rateLimit.allowed) {

      return NextResponse.json(
        {
          error: `Rate limit exceeded. Free tier allows ${rateLimit.limit} requests per day per mock (all methods combined). Resets at ${rateLimit.resetsAt?.toISOString()}`,
        },
        { status: 429, headers }
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
      await new Promise((resolve) => setTimeout(resolve, endpoint.delay ?? undefined));
    }

    // Get pagination params from query
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Check if we have stored data
    const storedCount = await getResourceCount(mockConfig.id);
    let data: any[] = [];

    if (storedCount > 0) {
      // Use stored data
      const result = await getResources(mockConfig.id, page, limit);
      data = result.data;
      
      // Update access metrics (fire and forget)
      db.mockConfig
        .update({
          where: { id: mockConfig.id },
          data: {
            accessCount: { increment: 1 },
            lastAccessedAt: new Date(),
          },
        })
        .catch((err) => console.error("Error updating access count:", err));

      // Increment rate limit counter
      incrementRequestCount(mockConfig.id).catch((err: any) =>
        console.error("Error updating rate limit:", err)
      );
      
      // Only add watermark for Free tier
      const { checkFeatureAccess } = await import("@/lib/subscription-helpers");
      const hasWatermark = await checkFeatureAccess(mockConfig.organizationId, "watermark");

      if (endpoint.pagination) {
        return NextResponse.json(
          {
            data,
            pagination: {
              page,
              limit,
              total: result.total,
              totalPages: Math.ceil(result.total / limit),
            },
          },
          { headers }
        );
      } else {
        return NextResponse.json({ data }, { headers });
      }
    }

    // No stored data, generate with Faker
    const fields = (endpoint.fields as unknown as Field[]) ?? [];
    const count = endpoint.count || 10;
    data = generateMockData(fields, count);

    // Update access metrics
    updateEndpointCount(mockConfig.id, endpoint)

    // Return paginated or full data
    if (endpoint.pagination) {
      const paginatedResult = paginateData(data, page, limit);
      return NextResponse.json(paginatedResult, { headers });
    } else {
      return NextResponse.json({ data }, { headers });
    }
  } catch (error) {
    console.error("Error serving mock data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/mock/[id]/[basePath] - Create a new resource
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; basePath: string }> }
) {
  try {
    const { id, basePath } = await params;

    // Find mock config
    const mockConfig = await db.mockConfig.findFirst({
      where: {
        id,
        basePath,
        isActive: true,
      },
      include: {
        endpoints: {
          where: {
            method: "POST",
            isActive: true,
          },
        },
      },
    });

    if (!mockConfig || mockConfig.endpoints.length === 0) {
      return NextResponse.json(
        { error: "POST endpoint not found or inactive" },
        { status: 404 }
      );
    }
    
    // Check rate limit (100 requests/day for free tier - applies to entire mock)
    const rateLimit = await checkRateLimit(mockConfig.id);
    const headers = updateHeaders(rateLimit);

    const endpoint = mockConfig.endpoints[0];

    // Check if mock has expired
    if (mockConfig.expiresAt && new Date() > mockConfig.expiresAt) {
      return NextResponse.json(
        { error: "Mock endpoint has expired" },
        { status: 410, headers }
      );
    }

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Rate limit exceeded. Free tier allows ${rateLimit.limit} requests per day per mock (all methods combined). Resets at ${rateLimit.resetsAt?.toISOString()}`,
        },
        { status: 429, headers }
      );
    }

    // Parse request body
    const body = await req.json();

    // Validate against request schema if defined
    if (endpoint.requestSchema) {
      const validation = validateRequest(body, endpoint.requestSchema);
      if (!validation.valid) {
        return NextResponse.json(
          { error: "Validation failed", details: validation.errors },
          { status: 400 }
        );
      }
    }

    // Get fields from GET endpoint to generate ID
    const getEndpoint = await db.mockEndpoint.findFirst({
      where: {
        mockConfigId: mockConfig.id,
        method: "GET",
      },
    });

    const fields = (getEndpoint?.fields as unknown as Field[]) ?? [];

    // Create resource
    try {
      const resource = await createResource(mockConfig.id, body, fields);

      // Update access metrics
      updateEndpointCount(mockConfig.id, endpoint)

      return NextResponse.json(resource, { status: 201, headers });
    } catch (createError: any) {
      // Check if it's a free tier limit error
      if (createError.message?.includes("Free tier limit")) {
        return NextResponse.json(
          { error: createError.message },
          { status: 403 }
        );
      }
      throw createError;
    }
  } catch (error) {
    console.error("Error creating resource:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

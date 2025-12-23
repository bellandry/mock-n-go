import { checkRateLimit } from "@/lib/free-tier-limits";
import {
  deleteResource,
  getResourceById,
  replaceResource,
  updateResource,
} from "@/lib/mock-data-manager";
import db from "@/lib/prisma";
import { validateRequest } from "@/lib/request-validator";
import { updateEndpointCount, updateHeaders } from "@/lib/subscription-helpers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/mock/[id]/[basePath]/[resourceId] - Get a single resource
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; basePath: string; resourceId: string }> }
) {
  try {
    const { id, basePath, resourceId } = await params;

    // Find mock config
    const mockConfig = await db.mockConfig.findFirst({
      where: {
        id,
        basePath,
        isActive: true,
      },
      include: {
        
      }
    });

    if (!mockConfig) {
      return NextResponse.json(
        { error: "Mock not found or inactive" },
        { status: 404 }
      );
    }

    // Check rate limit (100 requests/day for free tier - applies to entire mock)
    const rateLimit = await checkRateLimit(mockConfig.id);
    const headers = updateHeaders(rateLimit);

    // Check if mock has expired
    if (mockConfig.expiresAt && new Date() > mockConfig.expiresAt) {
      return NextResponse.json(
        { error: "Mock endpoint has expired" },
        { status: 410, headers }
      );
    }

    // Get resource
    const resource = await getResourceById(mockConfig.id, resourceId);

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404, headers }
      );
    }

    // Update access metrics
    updateEndpointCount(mockConfig.id)

    return NextResponse.json(resource);
  } catch (error) {
    console.error("Error getting resource:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/mock/[id]/[basePath]/[resourceId] - Replace a resource
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; basePath: string; resourceId: string }> }
) {
  try {
    const { id, basePath, resourceId } = await params;

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
            method: "PUT",
            isActive: true,
          },
        },
      },
    });

    if (!mockConfig || mockConfig.endpoints.length === 0) {
      return NextResponse.json(
        { error: "PUT endpoint not found or inactive" },
        { status: 404 }
      );
    }

    // Check rate limit (100 requests/day for free tier - applies to entire mock)
    const rateLimit = await checkRateLimit(mockConfig.id);
    const headers = updateHeaders(rateLimit);

    // Check if mock has expired
    if (mockConfig.expiresAt && new Date() > mockConfig.expiresAt) {
      return NextResponse.json(
        { error: "Mock endpoint has expired" },
        { status: 410, headers }
      );
    }

    const endpoint = mockConfig.endpoints[0];

    // Parse request body
    const body = await req.json();

    // Validate against request schema if defined
    if (endpoint.requestSchema) {
      const validation = validateRequest(body, endpoint.requestSchema);
      if (!validation.valid) {
        return NextResponse.json(
          { error: "Validation failed", details: validation.errors },
          { status: 400, headers }
        );
      }
    }

    // Get resources
    let resource = await getResourceById(mockConfig.id, resourceId);

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404, headers }
      );
    }

    // Replace resource
    resource = await replaceResource(mockConfig.id, resourceId, body);


    // Update access metrics
    updateEndpointCount(mockConfig.id, endpoint)

    return NextResponse.json(resource);
  } catch (error: any) {
    if (error.message === "Resource not found") {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }
    console.error("Error replacing resource:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/mock/[id]/[basePath]/[resourceId] - Update a resource partially
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; basePath: string; resourceId: string }> }
) {
  try {
    const { id, basePath, resourceId } = await params;

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
            method: "PATCH",
            isActive: true,
          },
        },
      },
    });

    if (!mockConfig || mockConfig.endpoints.length === 0) {
      return NextResponse.json(
        { error: "PATCH endpoint not found or inactive" },
        { status: 404 }
      );
    }

    // Check rate limit (100 requests/day for free tier - applies to entire mock)
    const rateLimit = await checkRateLimit(mockConfig.id);
    const headers = updateHeaders(rateLimit);

    // Check if mock has expired
    if (mockConfig.expiresAt && new Date() > mockConfig.expiresAt) {
      return NextResponse.json(
        { error: "Mock endpoint has expired" },
        { status: 410, headers }
      );
    }

    const endpoint = mockConfig.endpoints[0];

    // Parse request body
    const body = await req.json();

    // Validate against request schema if defined (partial validation)
    if (endpoint.requestSchema) {
      const validation = validateRequest(body, endpoint.requestSchema);
      // For PATCH, we allow partial data, so we only check provided fields
      if (!validation.valid) {
        return NextResponse.json(
          { error: "Validation failed", details: validation.errors },
          { status: 400 }
        );
      }
    }

    // Get resources
    let resource = await getResourceById(mockConfig.id, resourceId);

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404, headers }
      );
    }

    // Update resource
    resource = await updateResource(mockConfig.id, resourceId, body);

    // Update access metrics
    updateEndpointCount(mockConfig.id, endpoint)

    return NextResponse.json(resource);
  } catch (error: any) {
    if (error.message === "Resource not found") {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }
    console.error("Error updating resource:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/mock/[id]/[basePath]/[resourceId] - Delete a resource
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; basePath: string; resourceId: string }> }
) {
  try {
    const { id, basePath, resourceId } = await params;

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
            method: "DELETE",
            isActive: true,
          },
        },
      },
    });

    if (!mockConfig || mockConfig.endpoints.length === 0) {
      return NextResponse.json(
        { error: "DELETE endpoint not found or inactive" },
        { status: 404 }
      );
    }

    // Check rate limit (100 requests/day for free tier - applies to entire mock)
    const rateLimit = await checkRateLimit(mockConfig.id);
    const headers = updateHeaders(rateLimit);

    // Check if mock has expired
    if (mockConfig.expiresAt && new Date() > mockConfig.expiresAt) {
      return NextResponse.json(
        { error: "Mock endpoint has expired" },
        { status: 410, headers }
      );
    }

    const endpoint = mockConfig.endpoints[0];

    // Get resources
    const resource = await getResourceById(mockConfig.id, resourceId);

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404, headers }
      );
    }

    // Delete resource
    const deleted = await deleteResource(mockConfig.id, resourceId);

    if (!deleted) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    // Update access metrics
    updateEndpointCount(mockConfig.id, endpoint)

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting resource:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

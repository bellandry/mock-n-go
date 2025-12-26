import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/mock/[id]/export/postman
 * Export mock as Postman Collection v2.1
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

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activeOrganizationId = session.session.activeOrganizationId;
    if (!activeOrganizationId) {
      return NextResponse.json(
        { error: "No active organization" },
        { status: 400 }
      );
    }

    // Fetch mock with endpoints
    const mock = await db.mockConfig.findUnique({
      where: {
        id,
        organizationId: activeOrganizationId,
      },
      include: {
        endpoints: true,
      },
    });

    if (!mock) {
      return NextResponse.json({ error: "Mock not found" }, { status: 404 });
    }

    // Generate Postman collection
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const mockUrl = `${baseUrl}/api/mock/${id}/${mock.basePath}`;

    const items = mock.endpoints.map((endpoint) => {
      const fields = endpoint.fields as any[];
      
      // Generate sample body for POST/PUT/PATCH
      const sampleBody = fields && fields.length > 0
        ? fields.reduce((acc, field) => {
            acc[field.name] = `<${field.type}>`;
            return acc;
          }, {} as any)
        : null;

      const item: any = {
        name: `${endpoint.method} ${mock.basePath}`,
        request: {
          method: endpoint.method,
          header: [
            {
              key: "Content-Type",
              value: "application/json",
            },
          ],
          url: {
            raw: mockUrl,
            protocol: mockUrl.startsWith("https") ? "https" : "http",
            host: [new URL(mockUrl).hostname],
            path: new URL(mockUrl).pathname.split("/").filter(Boolean),
          },
        },
      };

      // Add body for POST/PUT/PATCH
      if (["POST", "PUT", "PATCH"].includes(endpoint.method) && sampleBody) {
        item.request.body = {
          mode: "raw",
          raw: JSON.stringify(sampleBody, null, 2),
        };
      }

      return item;
    });

    const collection = {
      info: {
        name: mock.name,
        description: mock.description || `Mock API for ${mock.name}`,
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
      },
      item: items,
    };

    return new NextResponse(JSON.stringify(collection, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${mock.basePath}-postman-collection.json"`,
      },
    });
  } catch (error) {
    console.error("Error exporting Postman:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

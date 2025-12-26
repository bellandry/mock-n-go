import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/mock/[id]/export/openapi
 * Export mock as OpenAPI 3.0 specification
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

    // Generate OpenAPI spec
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const mockUrl = `${baseUrl}/api/mock/${id}/${mock.basePath}`;

    // Map Faker types to OpenAPI types
    const mapTypeToOpenAPI = (fakerType: string) => {
      if (fakerType.includes("number") || fakerType.includes("int")) return "integer";
      if (fakerType.includes("boolean")) return "boolean";
      if (fakerType.includes("date")) return "string";
      return "string";
    };

    const paths: any = {};
    const pathKey = `/${mock.basePath}`;

    mock.endpoints.forEach((endpoint) => {
      const method = endpoint.method.toLowerCase();
      const fields = endpoint.fields as any[];

      // Generate schema from fields
      const properties: any = {};
      const required: string[] = [];

      if (fields && fields.length > 0) {
        fields.forEach((field) => {
          properties[field.name] = {
            type: mapTypeToOpenAPI(field.type),
            description: `Generated ${field.type}`,
          };
          required.push(field.name);
        });
      }

      const responseSchema = {
        type: "object",
        properties: properties,
        required: required.length > 0 ? required : undefined,
      };

      if (!paths[pathKey]) {
        paths[pathKey] = {};
      }

      paths[pathKey][method] = {
        summary: `${endpoint.method} ${mock.basePath}`,
        description: `${endpoint.method} endpoint for ${mock.name}`,
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: endpoint.method === "GET" && endpoint.pagination
                  ? {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: responseSchema,
                        },
                        pagination: {
                          type: "object",
                          properties: {
                            page: { type: "integer" },
                            limit: { type: "integer" },
                            total: { type: "integer" },
                          },
                        },
                      },
                    }
                  : responseSchema,
              },
            },
          },
        },
      };

      // Add request body for POST/PUT/PATCH
      if (["post", "put", "patch"].includes(method) && fields && fields.length > 0) {
        paths[pathKey][method].requestBody = {
          required: true,
          content: {
            "application/json": {
              schema: responseSchema,
            },
          },
        };
      }

      // Add query parameters for GET with pagination
      if (method === "get" && endpoint.pagination) {
        paths[pathKey][method].parameters = [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10 },
          },
        ];
      }
    });

    const openApiSpec = {
      openapi: "3.0.0",
      info: {
        title: mock.name,
        description: mock.description || `Mock API for ${mock.name}`,
        version: "1.0.0",
      },
      servers: [
        {
          url: baseUrl,
          description: "Mock'n'Go Server",
        },
      ],
      paths: paths,
    };

    return new NextResponse(JSON.stringify(openApiSpec, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${mock.basePath}-openapi.json"`,
      },
    });
  } catch (error) {
    console.error("Error exporting OpenAPI:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

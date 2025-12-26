import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/mock/[id]/export/msw
 * Export mock as MSW (Mock Service Worker) handlers
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
        id: params.id,
        organizationId: activeOrganizationId,
      },
      include: {
        endpoints: true,
      },
    });

    if (!mock) {
      return NextResponse.json({ error: "Mock not found" }, { status: 404 });
    }

    // Generate MSW handlers
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const mockUrl = `${baseUrl}/api/mock/${mock.id}/${mock.basePath}`;

    const handlers = mock.endpoints
      .map((endpoint) => {
        const method = endpoint.method.toLowerCase();
        const fields = endpoint.fields as any[];
        
        // Generate sample response
        const sampleResponse = fields && fields.length > 0
          ? fields.reduce((acc, field) => {
              acc[field.name] = `<${field.type}>`;
              return acc;
            }, {} as any)
          : { message: "Success" };

        return `  http.${method}('${mockUrl}', () => {
    return HttpResponse.json(${JSON.stringify(sampleResponse, null, 4)});
  })`;
      })
      .join(",\n\n");

    const mswCode = `import { http, HttpResponse } from 'msw';

/**
 * MSW Handlers for: ${mock.name}
 * Generated from Mock'n'Go
 * Base URL: ${mockUrl}
 */
export const ${mock.basePath}Handlers = [
${handlers}
];
`;

    return new NextResponse(mswCode, {
      headers: {
        "Content-Type": "text/javascript",
        "Content-Disposition": `attachment; filename="${mock.basePath}-msw-handlers.js"`,
      },
    });
  } catch (error) {
    console.error("Error exporting MSW:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

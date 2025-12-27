import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(signInUrl);
  }

  // Add pathname to headers so it's available in Server Components
  const response = NextResponse.next();
  response.headers.set("x-pathname", request.nextUrl.pathname);
  
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"], // Apply to all dashboard routes
};

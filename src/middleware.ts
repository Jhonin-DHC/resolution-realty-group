import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

function getAuthSecret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-secret-change-me");
}

async function hasRole(request: NextRequest, cookieName: string, role: string) {
  const token = request.cookies.get(cookieName)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getAuthSecret());
    return payload.role === role;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname === "/admin/login/") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const authed = await hasRole(request, "rrg_admin", "admin");
    if (!authed) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};

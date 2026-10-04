import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";

const PUBLIC_PATHS = new Set([
  "/admin/login",
  "/admin/sifremi-unuttum",
  "/api/admin/auth/status",
  "/api/admin/auth/setup",
  "/api/admin/auth/login",
  "/api/admin/auth/forgot",
  "/api/admin/auth/logout",
]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!(await verifySessionToken(token))) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

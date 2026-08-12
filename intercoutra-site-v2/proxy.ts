import { NextRequest, NextResponse } from "next/server";

// Simple shared-password gate for /admin - no per-user accounts, matching
// the MVP scope. ADMIN_SESSION_TOKEN is a long random secret set once in
// Vercel env vars; the login route only ever sets this exact value as the
// session cookie after checking ADMIN_PASSWORD, so a valid cookie proves
// the visitor went through login.
const COOKIE_NAME = "intercoutra_admin_session";
const PUBLIC_PATHS = new Set(["/admin/login", "/api/admin/login"]);

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const expected = process.env.ADMIN_SESSION_TOKEN;
  const authorized = Boolean(expected) && token === expected;

  if (!authorized) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

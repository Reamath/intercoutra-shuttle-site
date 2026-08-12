import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "intercoutra_admin_session";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const password = String(body.password || "");

  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionToken = process.env.ADMIN_SESSION_TOKEN;
  if (!adminPassword || !sessionToken) {
    return NextResponse.json(
      { success: false, error: "Admin login is not configured. Set ADMIN_PASSWORD and ADMIN_SESSION_TOKEN." },
      { status: 500 }
    );
  }

  if (password !== adminPassword) {
    return NextResponse.json({ success: false, error: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}

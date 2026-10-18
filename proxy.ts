import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Route-level role guard (Next.js 16 proxy — the middleware convention).
 * /admin/* requires an admin session: the cookie set by the auth routes
 * (lib/session.ts) carries {id, role, name}. No valid admin cookie → redirect
 * to /signin, which lands back on /admin after a real sign-in (the form itself
 * never asks for the role — the session is the source of truth).
 *
 * Demo-only caveat: the cookie is unsigned (lib/session.ts) — the planned
 * hosted-Supabase swap replaces this check with a real session lookup.
 */

/** Same name/value format as lib/session.ts (kept local — proxy must not share app globals). */
const SESSION_COOKIE = "cr_session";

function readRole(cookie: string | undefined): string | null {
  if (!cookie) return null;
  try {
    return JSON.parse(Buffer.from(cookie, "base64url").toString("utf8"))?.role ?? null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const role = readRole(request.cookies.get(SESSION_COOKIE)?.value);
  if (role !== "admin") {
    const url = new URL("/signin", request.url);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

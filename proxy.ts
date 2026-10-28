import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Route-level role guard (Next.js 16 proxy — the middleware convention).
 * /admin/* requires a real staff session: the Supabase SSR client reads the
 * signed auth cookies from the request, and `auth.getUser()` validates the
 * token server-side (Supabase Auth, ADR 0003). The role comes from the
 * user's app_metadata — counselor | sysadmin pass; everyone else redirects
 * to /signin, which lands back on /admin after a real sign-in (the form
 * itself never asks for the role — the session is the source of truth).
 *
 * Cookie propagation follows the @supabase/ssr docs: refreshed tokens from
 * `getUser()` are written onto both the request (for the upstream handler)
 * and the response (for the browser).
 */

/** Staff roles allowed through /admin (mirrors lib/session.ts requireStaff). */
const STAFF_ROLES = new Set(["counselor", "sysadmin"]);

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return NextResponse.redirect(new URL("/signin", request.url));

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        for (const { name, value } of list) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of list) response.cookies.set(name, value, options);
      },
    },
  });

  // Server-validated token — a forged or expired cookie resolves to no user.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = typeof user?.app_metadata?.role === "string" ? user.app_metadata.role : null;
  if (!role || !STAFF_ROLES.has(role)) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};

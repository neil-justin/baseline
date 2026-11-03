import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /auth/confirm?code=…&next=/reset — the PKCE exchange landing route.
 * Two callers, one exchange:
 *   - recovery links (auth round 2): `next` defaults /reset; a missing/used/
 *     expired code lands on /forgot?state=expired with the honest "request a
 *     new link" state — never a fake success.
 *   - Google OAuth (round, ADR 0006): `via=google&next=/auth/google`; the
 *     same exchange establishes the session, then /auth/google decides dest
 *     by the roster. A denied/expired consent lands on /signin?state=google —
 *     NOT the recovery error (that would read as a broken reset email).
 */
export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const viaGoogle = searchParams.get("via") === "google";
  const next = searchParams.get("next") ?? (viaGoogle ? "/auth/google" : "/reset");

  if (code && next.startsWith("/")) {
    const supabase = await supabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  if (viaGoogle) {
    // drop any half-established session so the shell never fakes logged-in,
    // then the sign-in page carries the honest notice
    const supabase = await supabaseServer();
    try {
      await supabase.auth.signOut();
    } catch {
      /* sign-out is best-effort at this point — the redirect is the message */
    }
    return NextResponse.redirect(`${origin}/signin?state=google`);
  }
  return NextResponse.redirect(`${origin}/forgot?state=expired`);
}

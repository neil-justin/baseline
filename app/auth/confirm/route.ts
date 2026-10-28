import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /auth/confirm?code=…&next=/reset — the recovery link's landing route
 * (auth round 2). Supabase Auth emails carry a PKCE `code`; exchanging it
 * here (route handlers can always write cookies — see supabaseServer)
 * establishes the real signed session cookies, then the user continues to
 * `next` (default /reset) to set the new password. A missing/used/expired
 * code lands on /forgot?state=expired with the honest "request a new link"
 * state — never a fake success.
 */
export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/reset";

  if (code && next.startsWith("/")) {
    const supabase = await supabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/forgot?state=expired`);
}

import { NextResponse } from "next/server";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase/server";
import { destFor } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /auth/google — the OAuth round's landing probe (ADR 0006). The PKCE
 * exchange has already happened in /auth/confirm (via=google). Destination
 * rides lib/session destFor — the short rule lives there: staff → /admin;
 * student with a picked career → /dashboard; fresh student → /onboarding.
 * (This file's old inline ladder — and its one divergence from destFor, a
 * student row without student_id — was swept onto the helper in Task 8.)
 * A verified session with NO profiles row is a first-time identity →
 * /welcome (the role picker). No session (consent denied/bounced) →
 * /signin?state=google for the notice.
 */
export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.redirect(`${origin}/signin?state=google`);

  // roster read server-side (admin client, bypasses RLS — same as sign-in)
  const { data: profile } = await supabaseAdmin()
    .from("profiles")
    .select("role, student_id")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) return NextResponse.redirect(`${origin}/welcome`);

  // swept onto destFor (Task 8) — the one destination rule reads there now
  return NextResponse.redirect(`${origin}${await destFor({ role: profile.role, studentId: profile.student_id })}`);
}

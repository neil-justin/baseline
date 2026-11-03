import { NextResponse } from "next/server";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /auth/google — the OAuth round's landing probe (ADR 0006). The PKCE
 * exchange has already happened in /auth/confirm (via=google). Destination
 * follows the ONE rule the roster owns: staff → /admin; student with
 * a career → /dashboard; fresh → /onboarding. A verified session with NO
 * profiles row is a first-time identity → /welcome (the role picker). No
 * session (consent denied/bounced) → /signin?state=google for the notice.
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

  let dest = "/admin";
  if (profile.role === "student" && profile.student_id) {
    const state = await db.getStudentState(profile.student_id);
    dest = state.careerId ? "/dashboard" : "/onboarding";
  }
  return NextResponse.redirect(`${origin}${dest}`);
}

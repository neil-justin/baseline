import { NextResponse } from "next/server";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase/server";
import { destFor } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/auth/signin { email, password } → 200 {dest, role}
 * One credential form for every account — the role comes from the profiles
 * row (server-checked), never the client. Supabase Auth verifies the password
 * and sets the signed session cookies (ADR 0003 — no unsigned cookie).
 * Dest rides lib/session destFor (swept there in Task 8; the state-row
 * ensure rides the same call): staff → /admin (route guard: proxy.ts); a
 * student with a picked career → /dashboard; a fresh student → /onboarding.
 * Error contract (the form's client maps these): no_account | bad_credentials | server
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase();

    // Account existence is checked server-side via the admin client (bypasses
    // RLS) — the profiles row carries the role and the student business id.
    const { data: profile } = await supabaseAdmin()
      .from("profiles")
      .select("id, role, student_id")
      .eq("email", email)
      .maybeSingle();
    if (!profile) return NextResponse.json({ error: "no_account" }, { status: 401 });

    const supabase = await supabaseServer();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: String(body.password ?? ""),
    });
    if (error) return NextResponse.json({ error: "bad_credentials" }, { status: 401 });

    return NextResponse.json({
      dest: await destFor({ role: profile.role, studentId: profile.student_id }),
      role: profile.role,
    });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

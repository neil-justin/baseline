import { NextResponse } from "next/server";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase/server";
import { provisionStudent } from "@/lib/auth/provision";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/auth/signup { name, email, password } → 200 {dest, role}
 * Self-serve sign-up is students-only (staff are seeded; post-defense they
 * are provisioned/invited, never self-registered). ADR 0003: the account is
 * a real Supabase Auth user (hashed password), the role lives in
 * app_metadata AND the profiles row, then a password sign-in establishes the
 * signed session cookies.
 * Password policy (auth round 2 — NIST SP 800-63B style, locked brief): min
 * length 8 and Supabase's leaked-password (HaveIBeenPwned) protection are
 * enforced server-side by Supabase Auth — both are DASHBOARD toggles
 * (Auth → Policies), not service-role API settings, so the human steps are
 * documented in the round report. This route maps the resulting auth errors
 * distinctly.
 * Error contract (the form's client maps these): name_required | password_short
 * | password_breached | email_taken | email_invalid | server
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const name = String(body.name ?? "").trim();
    const password = String(body.password ?? "");
    if (name.length === 0) return NextResponse.json({ error: "name_required" }, { status: 400 });
    if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "email_invalid" }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ error: "password_short" }, { status: 400 });

    const admin = supabaseAdmin();

    const { data: existing } = await admin.from("profiles").select("id").eq("email", email).maybeSingle();
    if (existing) return NextResponse.json({ error: "email_taken" }, { status: 409 });

    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { role: "student" },
    });
    if (createErr || !created?.user) {
      const msg = (createErr?.message ?? "").toLowerCase();
      if (msg.includes("already") || msg.includes("duplicate") || msg.includes("taken")) {
        return NextResponse.json({ error: "email_taken" }, { status: 409 });
      }
      // Server-side password policy (Supabase Auth dashboard toggles):
      // leaked-password protection → password_breached; min-length →
      // password_short. Distinct strings per the round's error contract.
      if (msg.includes("breach") || msg.includes("leaked") || msg.includes("have i been pwned")) {
        return NextResponse.json({ error: "password_breached" }, { status: 422 });
      }
      if (msg.includes("at least") || msg.includes("short") || msg.includes("length")) {
        return NextResponse.json({ error: "password_short" }, { status: 422 });
      }
      return NextResponse.json({ error: "server" }, { status: 500 });
    }
    const user = created.user;

    const studentId = await provisionStudent({
      userId: user.id,
      email,
      fullName: name,
    });

    const supabase = await supabaseServer();
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    if (signInErr) return NextResponse.json({ error: "bad_credentials" }, { status: 401 });
    return NextResponse.json({ dest: "/onboarding", role: "student" });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

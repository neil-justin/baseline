import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/auth/reset { password } → 200 { dest: "/dashboard" }
 * Auth round 2: the caller is the recovery session established by
 * /auth/confirm (the reset link's code exchange) — the Supabase SSR session
 * is required and identifies the user; `auth.updateUser({ password })` sets
 * the new password in place. Success means the user is signed in (the
 * recovery session IS a session) → the form redirects to /dashboard. The
 * session afterwards is the standard Supabase posture — auto-refresh via
 * @supabase/ssr, rotating tokens, no fixed cap (the 12h demo cap has no
 * successor anywhere).
 * Error contract (the form's client maps these): no_session | password_short
 * | password_breached | server
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const password = String(body.password ?? "");

    const supabase = await supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "no_session" }, { status: 401 });

    if (password.length < 8) return NextResponse.json({ error: "password_short" }, { status: 400 });

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      const msg = error.message.toLowerCase();
      // Same server-side policy mapping as signup: Supabase Auth enforces the
      // dashboard toggles (min length 8 + leaked-password protection).
      if (msg.includes("breach") || msg.includes("leaked") || msg.includes("have i been pwned")) {
        return NextResponse.json({ error: "password_breached" }, { status: 422 });
      }
      if (msg.includes("at least") || msg.includes("short") || msg.includes("length")) {
        return NextResponse.json({ error: "password_short" }, { status: 422 });
      }
      return NextResponse.json({ error: "server" }, { status: 500 });
    }
    return NextResponse.json({ dest: "/dashboard" });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

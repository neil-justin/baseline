import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/auth/password — the Account tab's password change (Round 7:
 * auth-native — no separate credential store). The signed session carries
 * the caller; the CURRENT password re-auths the change (2026-11-03: the
 * Security card's new first field — verified with a fresh
 * signInWithPassword before updateUser runs). Same policy + error contract
 * as the reset route: Supabase Auth enforces min length 8 + leaked-password
 * protection (the HaveIBeenPwened dashboard toggle), mapped to
 * password_short / password_breached here; password_incorrect when the
 * current password doesn't verify; no_session when signed out; server
 * otherwise.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { password?: unknown; currentPassword?: unknown };
    const password = typeof body.password === "string" ? body.password : "";
    const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";

    const supabase = await supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "no_session" }, { status: 401 });

    // the re-auth step: the current password must verify before the change
    if (currentPassword) {
      const { error: reauth } = await supabase.auth.signInWithPassword({
        email: user.email ?? "",
        password: currentPassword,
      });
      if (reauth) return NextResponse.json({ error: "password_incorrect" }, { status: 401 });
    } else {
      return NextResponse.json({ error: "password_incorrect" }, { status: 401 });
    }

    if (password.length < 8) return NextResponse.json({ error: "password_short" }, { status: 400 });

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("breach") || msg.includes("leaked") || msg.includes("have i been pwned")) {
        return NextResponse.json({ error: "password_breached" }, { status: 422 });
      }
      if (msg.includes("at least") || msg.includes("short") || msg.includes("length")) {
        return NextResponse.json({ error: "password_short" }, { status: 422 });
      }
      return NextResponse.json({ error: "server" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, note: "Password changed — your next sign-in uses it." });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

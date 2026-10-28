import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/auth/forgot { email } → 200 { ok: true }
 * Auth round 2: Supabase's built-in reset email (locked brief — default
 * sender, rate-limited is fine at demo scale; custom SMTP is post-defense
 * polish). Sends the recovery link with a redirectTo of /auth/confirm?next=/reset;
 * that route exchanges the PKCE code for a real session, and /reset issues
 * the new password via `auth.updateUser`.
 *
 * The response is ALWAYS ok for a well-formed email — recovery existence is
 * never revealed (account enumeration stays closed).
 * Error contract (the form's client maps these): email_invalid | redirect_not_allowed
 * | rate_limited | server. `redirect_not_allowed` means the Supabase Auth URL
 * Configuration allow-list is missing http://localhost:3000/auth/confirm —
 * a documented human step in the round report.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "email_invalid" }, { status: 400 });

    const origin = new URL(req.url).origin;
    const supabase = await supabaseServer();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/confirm?next=/reset`,
    });
    if (error) {
      const code = (error as { code?: string }).code ?? "";
      const msg = error.message.toLowerCase();
      if (code === "over_email_send_rate_limit" || msg.includes("rate limit")) {
        return NextResponse.json({ error: "rate_limited" }, { status: 429 });
      }
      if (code === "bad_redirect_url" || msg.includes("redirect")) {
        return NextResponse.json({ error: "redirect_not_allowed" }, { status: 400 });
      }
      return NextResponse.json({ error: "server" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

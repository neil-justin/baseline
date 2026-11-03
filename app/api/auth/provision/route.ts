import { NextResponse } from "next/server";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase/server";
import { provisionStudent } from "@/lib/auth/provision";
import { destFor, type Role } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/auth/provision — the /welcome picker's contract (ADR 0006).
 * The signed-in auth user has NO profiles row (a first Google identity).
 *   - role "student"   → the same provisioning the password form performs
 *     (profiles row + seeded state via provisionStudent), then /onboarding.
 *     app_metadata.role is stamped to "student" for parity with the password
 *     route's JWT contract (proxy.ts reads it).
 *   - role "counselor" → NO access. counselor_requests upserts one row per
 *     user (status pending; a rejected row flips back to pending with the
 *     fresh note). The privilege grant happens ONLY in
 *     /api/admin/counselor-requests/[id] behind a sysadmin session.
 * Role never comes from the email, its domain, or the pick alone (user
 * ruling 2026-11-03). An already-provisioned user asking to pick again
 * answers 409 already_provisioned + their roster dest (a counselor's
 * re-open of an approved request would strip the decision stamps — guarded).
 * Errors: not_signed_in | bad_role | already_provisioned | note_required | server
 */
export async function POST(req: Request) {
  try {
    const supabase = await supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) return NextResponse.json({ error: "not_signed_in" }, { status: 401 });

    const body = await req.json().catch(() => ({} as Record<string, unknown>));
    const role = body.role;
    if (role !== "student" && role !== "counselor") {
      return NextResponse.json({ error: "bad_role" }, { status: 400 });
    }

    const admin = supabaseAdmin();
    const meta = user.user_metadata as { full_name?: string; name?: string } | null;
    const fullName = meta?.full_name ?? meta?.name ?? user.email.split("@")[0];

    // Guard BEFORE any dispatch (review round 1 carry-over): a user that
    // already HAS a profile row is provisioned with a role — can NEVER be a
    // pick target. Failing open here would let a direct API call re-open an
    // approved counselor's request row (stripping their decision stamps back
    // to pending) or collide the student path with the roster. The welcome
    // page itself never reaches the picker for these users (destFor redirect)
    // — so this answer is about direct-call honesty only.
    const { data: existingProfile } = await admin
      .from("profiles")
      .select("id, role, student_id")
      .eq("id", user.id)
      .maybeSingle();
    if (existingProfile) {
      return NextResponse.json(
        {
          error: "already_provisioned",
          dest: await destFor({ role: existingProfile.role as Role, studentId: existingProfile.student_id }),
        },
        { status: 409 },
      );
    }

    if (role === "student") {
      // email collision on profiles is still guarded: unique(email) exists and
      // a mismatched-authority row answers 409 email_taken below (defensive
      // honesty for a race window or a stray roster row under another user id)
      let studentId: string;
      try {
        studentId = await provisionStudent({
          userId: user.id,
          email: user.email,
          fullName,
        });
      } catch (err) {
        if (err instanceof Error && /duplicate|unique/i.test(err.message)) {
          return NextResponse.json({ error: "email_taken" }, { status: 409 });
        }
        throw err;
      }
      // JWT parity with the password signup route (proxy reads app_metadata)
      await admin.auth.admin.updateUserById(user.id, {
        app_metadata: { role: "student" },
      });
      return NextResponse.json({ dest: "/onboarding", role: "student", studentId });
    }

    // counselor → the application, and nothing more
    const note = String(body.note ?? "").trim();
    if (note.length < 3) return NextResponse.json({ error: "note_required" }, { status: 422 });

    const { error: reqErr } = await admin
      .from("counselor_requests")
      .upsert(
        {
          user_id: user.id,
          email: user.email,
          full_name: fullName,
          note,
          status: "pending",
          // re-stamp EVERY submission (fresh or a rejected resubmission) —
          // requested_at = the current application moment so the queue's
          // ordering stays truthful (review round 1 ruling, 2026-11-03)
          requested_at: new Date().toISOString(),
          decided_at: null,
          decided_by: null,
        },
        { onConflict: "user_id" },
      );
    if (reqErr) return NextResponse.json({ error: "server" }, { status: 500 });

    return NextResponse.json({ dest: "/welcome", role: "counselor", status: "pending" });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

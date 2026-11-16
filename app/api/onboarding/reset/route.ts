import { NextResponse } from "next/server";
import { getCurrentProfile, actingStudentId } from "@/lib/session";
import { db } from "@/lib/db";
import { withStateLock } from "@/lib/state-queue";
import { resetOnboardingState } from "@/lib/onboarding-reset";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/onboarding/reset — IRREVERSIBLE wipe of the signed-in student's
 * onboarding progress (fresh state, same shape lib/session.ts newStudentState
 * produces — lib/onboarding-reset.ts owns the pure wipe; this route stays
 * thin).
 *
 * Contract (mirrors account/delete's confirm style): { confirm: "RESET" } —
 * anything else → 400 { error: "confirm_word" }. The wipe runs ONLY behind
 * the explicit confirm.
 *
 * SCOPE GUARD (see lib/onboarding-reset.ts): credentials declarations,
 * presence credential rows, and resume/letter runs are /profile-scoped
 * facts, NOT onboarding draft — this route leaves them untouched.
 *
 * Students only. actingStudentId's staff-impersonation path is closed here:
 * an irreversible wipe must never key off a counselor-supplied `student`
 * param, so we require the signed-in profile itself to be a student.
 */
export async function POST(req: Request) {
  let body: { confirm?: unknown; student?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  if (body.confirm !== "RESET") {
    return NextResponse.json(
      { error: "confirm_word", detail: "The reset stays armed behind the explicit confirm — send confirm: \"RESET\"." },
      { status: 400 }
    );
  }

  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "student" || !profile.studentId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  // students only — the acting-student seam proves the signed-in binding
  const id = await actingStudentId(body.student);
  if (!id || id !== profile.studentId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const state = await withStateLock(id, async () => {
    const fresh = resetOnboardingState(id, profile.fullName);
    await db.saveStudentState(id, fresh);
    return fresh;
  });

  return NextResponse.json({ state, note: "Onboarding progress reset — starting fresh." });
}

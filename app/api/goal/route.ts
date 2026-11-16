import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { actingStudentId } from "@/lib/session";
import { setGoal } from "@/lib/actions";
import { withStateLock } from "@/lib/state-queue";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/goal — {title, type?, resourceId?, skill?} (onboarding/Progress).
 * Writes to the signed-in student's state; a `student` param is honored only
 * for staff. Onboarding completion marker (2026-11-06): a successful goal set
 * also stamps `state.onboarded = true` — the goal step is the funnel's last
 * step, so Set completes onboarding for signin routing (the skip path uses
 * /api/onboarding/finish). Other callers of this route set goals mid-app;
 * the stamp is idempotent (unconditional true, no state fork).
 */
export async function POST(req: Request) {
  const body = await req.json();
  const id = await actingStudentId(body.student);
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const result = await withStateLock(id, async () => {
    const state = await db.getStudentState(id);
    const applied = setGoal(state, body);
    const next = applied.error
      ? applied.state
      : { ...applied.state, onboarded: true };
    await db.saveStudentState(id, next);
    return applied.error ? applied : { ...applied, state: next };
  });
  return NextResponse.json(result);
}

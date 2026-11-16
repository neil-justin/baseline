import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { actingStudentId } from "@/lib/session";
import { withStateLock } from "@/lib/state-queue";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/onboarding/finish — the SKIP-side completion stamp (2026-11-06):
 * goal Step → "Skip for now" also completes onboarding, so skip marks
 * `state.onboarded = true` and signin routes the student to /dashboard.
 * The Set path stamps via /api/goal. Irreversible-safe: requires a picked
 * career (else no-onboarding-signal error, stays in funnel).
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const id = await actingStudentId(body.student);
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const result = await withStateLock(id, async () => {
    const state = await db.getStudentState(id);
    if (!state.careerId) return { error: "no career picked yet" };
    const next = { ...state, onboarded: true };
    await db.saveStudentState(id, next);
    return { state: next, note: "Onboarding complete." };
  });
  if ((result as { error?: string }).error)
    return NextResponse.json(result, { status: 400 });
  return NextResponse.json(result);
}
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { actingStudentId } from "@/lib/session";
import { submitAssessment } from "@/lib/actions";
import { withStateLock } from "@/lib/state-queue";

/**
 * POST /api/assessment — the step-③ competency instrument's one full-attempt
 * write {likert:{COM-x.y:1..5}, mcq:{COM-x.Mn:optionIndex}}. Graded
 * SERVER-SIDE against the user-approved bank (lib/fixtures/instrument.ts):
 * verified ⇔ both of the competency's MCQs correct in this attempt; every
 * rated competency otherwise claimed. The write overwrites the ES carrier
 * (`state.competencies`) + the attempt record — retakes are latest-counts
 * (a weaker re-sit honestly drops a verified mark). Writes to the signed-in
 * student's state; a `student` param is honored only for staff. The
 * read-modify-write serializes per student (lib/state-queue) like /api/verify.
 */
export async function POST(req: Request) {
  const body = await req
    .json()
    .then((b) => b as { student?: string; likert?: Record<string, number>; mcq?: Record<string, number> });
  const id = await actingStudentId(body.student);
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const result = await withStateLock(id, async () => {
    const state = await db.getStudentState(id);
    const r = submitAssessment(state, { likert: body.likert ?? {}, mcq: body.mcq ?? {} });
    if (!r.error) await db.saveStudentState(id, r.state);
    return r;
  });
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json(result);
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

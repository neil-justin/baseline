import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { actingStudentId } from "@/lib/session";
import { markVerified, type ActionResult } from "@/lib/actions";
import { withStateLock } from "@/lib/state-queue";

/**
 * POST /api/verify — verification-mini-quiz result {skill, passed}. Writes to
 * the signed-in student's state; a `student` param is honored only for staff.
 * The read-modify-write serializes per student: two answers can land inside
 * one Supabase round-trip of each other, and an unserialized pair loses the
 * first verified bar (each writer proves from the same stale snapshot and
 * the later save clobbers the earlier write).
 */
export async function POST(req: Request) {
  const body = await req.json().then((b) => b as { student?: string; skill?: string; passed?: boolean });
  const id = await actingStudentId(body.student);
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const result: ActionResult = await withStateLock(id, async () => {
    const state = await db.getStudentState(id);
    if (!body.passed) return { state, note: "stays self-declared" } as ActionResult;
    const r = markVerified(state, body.skill ?? "");
    if (!r.error) await db.saveStudentState(id, r.state);
    return r;
  });
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json(result);
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

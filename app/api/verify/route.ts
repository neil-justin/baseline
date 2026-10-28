import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { actingStudentId } from "@/lib/session";
import { markVerified } from "@/lib/actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/verify — verification-mini-quiz result {skill, passed}. Writes to
 * the signed-in student's state; a `student` param is honored only for staff.
 */
export async function POST(req: Request) {
  const body = await req.json();
  const id = await actingStudentId(body.student);
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const state = await db.getStudentState(id);
  if (!body.passed) return NextResponse.json({ state, note: "stays self-declared" });
  const result = markVerified(state, body.skill);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  await db.saveStudentState(id, result.state);
  return NextResponse.json(result);
}

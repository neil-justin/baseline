import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { actingStudentId } from "@/lib/session";
import { setGoal } from "@/lib/actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/goal — {title, type?, resourceId?, skill?} (onboarding/Progress).
 * Writes to the signed-in student's state; a `student` param is honored only
 * for staff.
 */
export async function POST(req: Request) {
  const body = await req.json();
  const id = await actingStudentId(body.student);
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const state = await db.getStudentState(id);
  const result = setGoal(state, body);
  await db.saveStudentState(id, result.state);
  return NextResponse.json({ state: result.state, note: result.note });
}

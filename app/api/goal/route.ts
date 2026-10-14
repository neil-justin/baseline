import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setGoal } from "@/lib/actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/goal — {title, type?, resourceId?, skill?} (onboarding/Progress). */
export async function POST(req: Request) {
  const body = await req.json();
  const id = body.student ?? "neil";
  const state = await db.getStudentState(id);
  const result = setGoal(state, body);
  await db.saveStudentState(id, result.state);
  return NextResponse.json({ state: result.state, note: result.note });
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { claimAll, claimSkill } from "@/lib/actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/claim — self-report {skill, level} or batch {claims:[…]} (onboarding). */
export async function POST(req: Request) {
  const body = await req.json();
  const id = body.student ?? "neil";
  const state = await db.getStudentState(id);
  let result;
  if (body.claims) result = claimAll(state, body.claims);
  else result = claimSkill(state, body.skill, body.level);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  await db.saveStudentState(id, result.state);
  return NextResponse.json({ state: result.state, note: result.note });
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { switchCareer } from "@/lib/actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/switch — {to} — locked semantics: ·✓ skills + goals survive; bars reset. */
export async function POST(req: Request) {
  const body = await req.json();
  const id = body.student ?? "neil";
  const state = await db.getStudentState(id);
  const result = switchCareer(state, body.to);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  await db.saveStudentState(id, result.state);
  return NextResponse.json({ state: result.state, note: result.note });
}

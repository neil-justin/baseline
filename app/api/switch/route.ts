import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { actingStudentId, getCurrentProfile } from "@/lib/session";
import { switchCareer } from "@/lib/actions";
import { degreeGateAllows } from "@/lib/degree-gate";
import { getCareer } from "@/lib/fixtures/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/switch — {to} — locked semantics: proven skills survive via
 * provenArchive; rated baselines reset. Writes to the signed-in student's
 * state; a `student` param is honored only for staff.
 *
 * Degree gate (user ruling 2026-11-02): enforced here with the same shared
 * rule the modal renders, so the API can't bypass what the UI blocks.
 */
export async function POST(req: Request) {
  const body = await req.json();
  const id = await actingStudentId(body.student);
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const profile = await getCurrentProfile();
  if (profile?.role === "student" && !degreeGateAllows(profile.program, getCareer(body.to)?.degreeMap ?? [])) {
    return NextResponse.json({ error: "degree gate — this program is not in the majors that map to the requested role" }, { status: 403 });
  }
  const state = await db.getStudentState(id);
  const result = switchCareer(state, body.to);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  await db.saveStudentState(id, result.state);
  return NextResponse.json({ state: result.state, note: result.note });
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { actingStudentId, getCurrentProfile } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase/server";
import { chooseCareer, setTrack } from "@/lib/actions";
import { getCareer } from "@/lib/fixtures/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/career — the cold-start intake's career commit (the missing
 * seam found by the admin round's e2e walk, 2026-10-30): the onboarding
 * pick NEVER reached the store for a real new student — the demo arc only
 * ever posted claims over Neil's lazily-seeded decided state
 * (lib/fixtures/neil.ts), so every non-seeded account failed its own
 * intake writes with "no career yet" (the client swallowed the 400).
 *
 * Contract: {careerId, track?, program?} under the signed-in student (the
 * own-id rule; a `student` param is honored only for staff, like every
 * write). `program` (funnel rework 2026-11-06): the Background step's
 * program choice persists ALONGSIDE the career commit — the same pick-time
 * moment — via the profiles row, the exact write path PATCH /api/profile
 * uses for its program field. Non-fatal: a failed profile write never
 * rolls the career commit back (the profile hub still lets the student
 * edit the program).
 * The intake's ORDER is protected:
 *   - an UNDECIDED student may commit (the locked chooseCareer semantics:
 *     bars empty-reset + stage-① queue seeded);
 *   - a DECIDED student committing the SAME career is a no-op (the canon
 *     walk replays onboarding over Neil's seeded state — the arc's claims
 *     must stay the only storage of that replay);
 *   - a DECIDED student committing a DIFFERENT career is not this route's
 *     business — that is the switch (/api/switch, cost-first disclosure).
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    careerId?: unknown;
    track?: unknown;
    program?: unknown;
    student?: unknown;
  };
  const id = await actingStudentId(body.student);
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const program = typeof body.program === "string" ? body.program.trim().slice(0, 80) : "";
  const persistProgram = async () => {
    if (!program) return;
    try {
      const profile = await getCurrentProfile();
      if (profile?.role !== "student" || profile.studentId !== id || !profile.userId) return;
      await supabaseAdmin().from("profiles").update({ program }).eq("id", profile.userId);
    } catch {
      /* non-fatal — the career commit stands; the profile hub can re-save */
    }
  };
  const state = await db.getStudentState(id);
  const careerId = typeof body.careerId === "string" ? body.careerId : "";
  if (!careerId || !getCareer(careerId)) {
    return NextResponse.json({ error: "unknown career" }, { status: 400 });
  }
  if (state.careerId && state.careerId !== careerId) {
    return NextResponse.json(
      { error: "already decided", detail: "Changing target runs the switch flow on Careers — its cost comes first." },
      { status: 409 }
    );
  }
  if (state.careerId === careerId) {
    if (typeof body.track === "string") state.track = body.track;
    await persistProgram();
    return NextResponse.json({ state, note: "already set — nothing changed" });
  }
  const tracked = typeof body.track === "string" ? setTrack(state, body.track).state : state;
  const result = chooseCareer(tracked, careerId);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  await db.saveStudentState(id, result.state);
  await persistProgram();
  return NextResponse.json({ state: result.state, note: result.note });
}

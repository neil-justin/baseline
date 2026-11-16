import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { actingStudentId } from "@/lib/session";
import { markVerified, type ActionResult } from "@/lib/actions";
import { withStateLock } from "@/lib/state-queue";
import { getSkillLadder } from "@/lib/fixtures/skill-banks";

/**
 * POST /api/verify — verification-mini-quiz result {skill, passed}. Writes to
 * the signed-in student's state; a `student` param is honored only for staff.
 * The read-modify-write serializes per student: two answers can land inside
 * one Supabase round-trip of each other, and an unserialized pair loses the
 * first verified bar (each writer proves from the same stale snapshot and
 * the later save clobbers the earlier write).
 *
 * ── Ladder mode (wave-1 pilot, docs/assessment-blueprint-swd.md —
 * user-approved 2026-11-05 "go"): when the requested `catalogSkill` has a
 * 3-item ladder, the wire requires `answers: number[3]` — the three rung
 * picks in rung order. All three correct → markVerified (as today); any
 * wrong → NO bar change and no write, and the result carries the honest
 * non-pass note (exact wording surfaces nowhere critical; the clients
 * treat any non-error as "attempt recorded, move on"). Contract edges,
 * traced explicitly:
 *  - `answers` missing / not an array / wrong LENGTH → 400 {"error":
 *    "answers incomplete"} — a malformed request, never a write; NOTE: a
 *    ladder-wired skill has NO single-question path, so a legacy bare
 *    {skill, passed} shape also lands here (loudly) instead of silently
 *    verifying one rung — the single-question bypass is what the pilot
 *    closes.
 *  - a `number` pick outside 0..3 grades as WRONG (defensive, honest:
 *    malformed values must not throw and must never verify).
 *  - legacy-single skills (no ladder) keep the existing behavior
 *    byte-for-byte: {skill, passed} — a fail returns {"note": "stays
 *    self-declared"} and writes nothing.
 *  - no new events either way: ladder success rides markVerified's own
 *    no-event norm; a failed verify writes nothing at all.
 */
export async function POST(req: Request) {
  const body = await req.json().then((b) => b as {
    student?: string;
    skill?: string;
    passed?: boolean;
    answers?: unknown;
  });
  const id = await actingStudentId(body.student);
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // ladder lookup is pure data — read before the lock, keyed on the
  // catalogSkill byte-match (the same key markVerified will close with)
  const ladder = getSkillLadder(body.skill ?? "");

  const result: ActionResult = await withStateLock(id, async () => {
    if (ladder) {
      // Contract edge (traced): the three rung picks must be an array of
      // exactly THREE numbers — wrong length or wrong shape is a malformed
      // request, error'd and unwritten, never partially graded.
      const arr = Array.isArray(body.answers) &&
        (body.answers as unknown[]).length === 3 &&
        (body.answers as unknown[]).every((a) => typeof a === "number")
        ? (body.answers as number[])
        : null;
      if (!arr) return { state: await db.getStudentState(id), error: "answers incomplete" } as ActionResult;
      const state = await db.getStudentState(id);
      // Out-of-range picks grade wrong (never throw, never verify); a
      // number equal to the rung's key grades correct — anything else wrong.
      const correct = arr.reduce(
        (n, a, i) => n + (a === ladder.items[i].answer ? 1 : 0),
        0
      );
      if (correct < 3) {
        // honest non-pass — nothing saved, no event (the claim stays a claim)
        return { state, note: `not passed — ${correct} of 3 correct (need 3 — the ladder verifies only whole)` } as ActionResult;
      }
      const r = markVerified(state, ladder.catalogSkill);
      if (!r.error) await db.saveStudentState(id, r.state);
      return r;
    }
    // legacy single-item skill — behavior byte-for-byte from the 2026-11-04
    // shape: a fail write is a no-op ("stays self-declared"), a pass marks.
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

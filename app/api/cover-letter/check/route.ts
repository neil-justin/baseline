import { NextResponse } from "next/server";
import { actingStudentId } from "@/lib/session";
import { db } from "@/lib/db";
import { getCareer } from "@/lib/fixtures/catalog";
import { intakeLetterFile, runLetterCheck } from "@/lib/engines/letter";
import { LETTER_MAX_BYTES } from "@/lib/engines/letter";
import { letterRunStore } from "@/lib/db/letter-run-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/cover-letter/check — multipart/form-data (ticket 12, Prep pass):
 *   letter    ONE file — TXT / PDF / DOCX (content decides, never extension)
 *   employer  OPTIONAL anchor — when left out the employer check is honestly
 *             skipped ("not evaluated — no employer declared") and drops from
 *             the denominator; never silently failed, never silently scored
 *   student   optional — honored only for staff (actingStudentId seam)
 *
 * Locked rules parsed here: one file, ≤5 MB, then the letter intake
 * (content-sniff → parser → "carries no real text" floor), then the
 * DETERMINISTIC structural set + role alignment (lib/engines/letter.ts),
 * then the per-file persistence (lib/db/letter-run-store — ONE run per
 * student, latest counts). A rejected upload persists NOTHING — feedback,
 * not a run. The letter text is never stored; only the run's factors do.
 *
 * Per-file AM semantics: the letter runs INDEPENDENT of the resume — this
 * store keeps the letter's own latest attempt (the resume's store uninfluenced).
 */
export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "bad_form" }, { status: 400 });
  }

  const id = await actingStudentId(form.get("student"));
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const state = await db.getStudentState(id);
  const career = state.careerId ? getCareer(state.careerId) : null;
  if (!career) {
    return NextResponse.json(
      { error: "no_career", detail: "Pick your target role first — the check measures against it." },
      { status: 400 }
    );
  }

  const employerRaw = form.get("employer");
  const employerField = typeof employerRaw === "string" ? employerRaw : null;

  const files = form.getAll("letter").filter((f): f is File => f instanceof File);
  const realFiles = files.filter((f) => f.size > 0 || f.name !== "");
  if (realFiles.length === 0) {
    return NextResponse.json({ error: "no_file", detail: "Choose your letter file first (TXT, PDF, or DOCX)." }, { status: 400 });
  }
  if (realFiles.length > 1) {
    return NextResponse.json(
      { error: "multi_file", detail: "One file at a time — upload the cover letter as a single PDF, DOCX, or TXT." },
      { status: 400 }
    );
  }

  const file = realFiles[0];
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length > LETTER_MAX_BYTES) {
    return NextResponse.json(
      {
        error: "oversize",
        detail:
          "Over the 5 MB limit — a plain, text-only letter export stays well under it. Remove images from the file and export the letter again.",
      },
      { status: 400 }
    );
  }

  const intake = await intakeLetterFile({ bytes, fileName: file.name, fileCount: realFiles.length });
  if (!intake.ok) {
    return NextResponse.json(
      { error: intake.code, detail: intake.detail, missing: intake.missing ?? null },
      { status: 422 }
    );
  }

  const run = runLetterCheck({
    career,
    text: intake.text,
    kind: intake.kind,
    fileName: file.name,
    employerField,
  });
  const saved = await letterRunStore.saveRun(id, run);
  return NextResponse.json({ run: saved.run, runsCount: saved.runsCount, degraded: saved.degraded ?? false });
}

/** GET — the latest letter check for the signed-in student (page JSON read). */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = await actingStudentId(url.searchParams.get("student"));
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const latest = await letterRunStore.latest(id);
  return NextResponse.json(latest ?? { run: null, runsCount: 0 });
}

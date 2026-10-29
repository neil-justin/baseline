import { NextResponse } from "next/server";
import { actingStudentId } from "@/lib/session";
import { db } from "@/lib/db";
import { intakeResumeFile, isProbablyResume, MAX_BYTES } from "@/lib/engines/resume/parse";
import { diagnose } from "@/lib/engines/resume/analyze";
import { resumeRunStore } from "@/lib/db/resume-run-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/resume/diagnose — multipart/form-data:
 *   resume   the resume file (PDF or DOCX; content decides, never extension)
 *   student  optional — honored only for staff (actingStudentId seam)
 *
 * Locked rules enforced here: ONE file, ≤5 MB, then intake (sniff → parse →
 * locked rejection matrix → "doesn't read as a resume" gate), then the
 * deterministic three-factor diagnostic, then persistence (latest run +
 * history counts). A rejected upload persists NOTHING — feedback, not a run.
 * The file is never stored; it lives only in this request's memory.
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
  const career = state.careerId ? await import("@/lib/fixtures/catalog").then((m) => m.getCareer(state.careerId)) : null;
  if (!career) {
    return NextResponse.json({ error: "no_career", detail: "Pick your target role first — the diagnostic measures against it." }, { status: 400 });
  }

  const files = form.getAll("resume").filter((f): f is File => f instanceof File);
  if (files.length === 0) return NextResponse.json({ error: "no_file", detail: "Choose a resume file first." }, { status: 400 });
  if (files.length > 1) {
    return NextResponse.json({ error: "multi_file", detail: "One file at a time — upload the resume as a single PDF or DOCX." }, { status: 400 });
  }

  const file = files[0];
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length > MAX_BYTES) {
    return NextResponse.json(
      { error: "oversize", detail: "Over the 5 MB limit — exports with embedded photos or graphics easily grow past it. Remove images and export the resume again." },
      { status: 400 }
    );
  }

  const intake = await intakeResumeFile({ bytes, fileName: file.name, fileCount: files.length });
  if (!intake.ok) {
    return NextResponse.json({ error: intake.code, detail: intake.detail, missing: intake.missing ?? null }, { status: 422 });
  }

  const gate = isProbablyResume(intake);
  if (gate) {
    return NextResponse.json({ error: gate.code, detail: gate.detail, missing: gate.missing ?? null }, { status: 422 });
  }

  const run = diagnose({ career, parsed: intake, fileName: file.name });
  const saved = await resumeRunStore.saveRun(id, run);
  return NextResponse.json({ run: saved.run, bestAir: saved.bestAir, runsCount: saved.runsCount });
}

/** GET — the latest run summary for the signed-in student (page reads JSON too). */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = await actingStudentId(url.searchParams.get("student"));
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const latest = await resumeRunStore.latest(id);
  return NextResponse.json(latest ?? { run: null, bestAir: 0, runsCount: 0 });
}

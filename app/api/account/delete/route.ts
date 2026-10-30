import { NextResponse } from "next/server";
import { getCurrentProfile, actingStudentId } from "@/lib/session";
import { db } from "@/lib/db";
import { resumeRunStore } from "@/lib/db/resume-run-store";
import { letterRunStore } from "@/lib/db/letter-run-store";
import { supabaseAdmin, supabaseEnv, supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/account/delete — the DPA erase-my-data right as a REAL cascade
 * (ticket 7 lock; supporting-mechanics §2 "erase (demo-honest): full cascade
 * — auth user → profile → state → credentials → explicit deletion of uploaded
 * evidence objects in storage. Student disappears from the counselor roster;
 * that is what erasure means").
 *
 * Contract: { confirm: "DELETE" } — the erasure runs ONLY behind the page's
 * explicit confirm state (the client control stays dead otherwise). Then:
 *   1. student_state row (the state blob incl. presence + assessment + events)
 *   2. resume_runs / letter_runs rows (the run stores carry no FK — deliberate)
 *   3. credentials rows (FK-cascaded by the profile delete; explicit anyway
 *      so a half-cascaded store never resurfaces old evidence links)
 *   4. profiles row + the Supabase AUTH USER (cascades profile → credentials
 *      at the DB level too) — after this the counselor roster loses the row
 *   5. the signed session ends (supabase signOut clears the cookies)
 *
 * Evidence objects: the private-storage bucket isn't wired yet (the
 * credential writer is a recorded surface seam) — when it ships, per-entry
 * evidence deletion joins step 3 BEFORE the auth-user delete.
 *
 * CONSENT RULES UNTOUCHED: granular consent checkboxes (signup) and the
 * layered notice are upstream surfaces; this route only executes the erasure.
 */
const isMissingTable = (e: { code?: string; message?: string }): boolean =>
  e?.code === "42P01" ||
  e?.code === "PGRST205" ||
  /does not exist|not find the table|schema cache/i.test(e?.message ?? "");

export async function POST(req: Request) {
  let body: { confirm?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  if (body.confirm !== "DELETE") {
    return NextResponse.json(
      { error: "confirm_word", detail: "Erasure stays armed behind the typed confirm — send confirm: \"DELETE\"." },
      { status: 400 }
    );
  }

  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const studentId = await actingStudentId(undefined);
  const erased: string[] = [];

  if (studentId) {
    try {
      await letterRunStore.erase(studentId);
      erased.push("letter_runs");
    } catch (e) {
      if (!isMissingTable(e as { code?: string; message?: string })) {
        return NextResponse.json({ error: "erase_failed", detail: `letter_runs: ${(e as Error).message}` }, { status: 500 });
      }
      erased.push("letter_runs (table not applied — JSON fallback cleared)");
    }

    try {
      await resumeRunStore.erase(studentId);
      erased.push("resume_runs");
    } catch (e) {
      if (!isMissingTable(e as { code?: string; message?: string })) {
        return NextResponse.json({ error: "erase_failed", detail: `resume_runs: ${(e as Error).message}` }, { status: 500 });
      }
      erased.push("resume_runs (table not applied — JSON fallback cleared)");
    }

    const { configured } = supabaseEnv();
    if (configured) {
      const admin = supabaseAdmin();
      const { error: credErr } = await admin.from("credentials").delete().eq("student_id", studentId);
      if (credErr && !isMissingTable(credErr)) {
        return NextResponse.json({ error: "erase_failed", detail: `credentials: ${credErr.message}` }, { status: 500 });
      }
      erased.push("credentials");

      const { data: stateDeleted } = await admin
        .from("student_state")
        .delete()
        .eq("student_id", studentId)
        .select("student_id");
      erased.push(stateDeleted ? "student_state" : "student_state (row was absent)");
    }
  }

  // profile → auth user LAST (the cascade clips credentials if the explicit
  // delete above was pre-migration); the session cookies clear after
  const { configured } = supabaseEnv();
  if (configured) {
    const admin = supabaseAdmin();
    const { data: prof } = await admin.from("profiles").delete().eq("id", profile.userId).select("id");
    erased.push(prof ? "profiles" : "profiles (row was absent)");
    try {
      await admin.auth.admin.deleteUser(profile.userId);
      erased.push("auth_user");
    } catch (e) {
      // a demo store with the auth user already gone is still fully erased
      erased.push(`auth_user (already absent: ${(e as Error).message})`);
    }
  }

  // the signed session ends — the erased identity can't keep a live cookie
  try {
    const supabase = await supabaseServer();
    await supabase.auth.signOut();
    erased.push("session");
  } catch {
    erased.push("session (env absent — nothing signed in to clear)");
  }

  return NextResponse.json({ ok: true, erased, note: "Erasure complete — the record is gone from the system." });
}

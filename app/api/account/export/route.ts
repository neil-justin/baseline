import { NextResponse } from "next/server";
import { getCurrentProfile, actingStudentId } from "@/lib/session";
import { db } from "@/lib/db";
import { resumeRunStore } from "@/lib/db/resume-run-store";
import { letterRunStore } from "@/lib/db/letter-run-store";
import { supabaseAdmin, supabaseEnv } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/account/export — the DPA (RA 10173) export-my-data right as a
 * working artifact (ticket 7 lock; supporting-mechanics §2): ONE JSON bundle
 * of everything the system holds for the signed-in student —
 *
 *   profile      the profiles row (identity metadata, never a password hash)
 *   state        the FULL StudentState blob (skills, goals, assessment, the
 *                event history, and the presence declaration with its stamp)
 *   resumeRuns   the resume-run store's row (the LATEST run + its counters)
 *   letterRuns   the letter-run store's row (the LATEST check + its counter)
 *   credentials   every credentials-table row's metadata (evidence URLs and
 *                text — binary evidence downloads per-entry once the storage
 *                bucket ships; noted in the bundle, not pretended)
 *
 * students can only export their own record; staff (counselor/sysadmin) may
 * export their own account's bundle too (their studentId is null → the
 * state/runs sections read null honestly). 401 when not signed in.
 */

const isMissingTable = (e: { code?: string; message?: string }): boolean =>
  e?.code === "42P01" ||
  e?.code === "PGRST205" ||
  /does not exist|not find the table|schema cache/i.test(e?.message ?? "");

export async function GET() {
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const studentId = await actingStudentId(undefined);

  let stateRecord: unknown = null;
  let events: unknown[] = [];
  let resumeRuns: unknown = null;
  let letterRuns: unknown = null;
  let credentials: unknown[] = [];
  let storageNote: string | null = null;

  if (studentId) {
    const state = await db.getStudentState(studentId);
    stateRecord = state;
    events = state.events ?? [];
    resumeRuns = await resumeRunStore.latest(studentId);
    letterRuns = await letterRunStore.latest(studentId);
    const { configured } = supabaseEnv();
    if (configured) {
      try {
        const { data, error } = await supabaseAdmin()
          .from("credentials")
          .select("id, kind, title, organization, started_on, ended_on, evidence_url, evidence_note, declared_skills, status, verified_by, verified_at, created_at")
          .eq("student_id", studentId);
        if (error && !isMissingTable(error)) throw error;
        credentials = data ?? [];
      } catch (e) {
        credentials = [{ note: "credentials table read failed", detail: (e as Error).message }];
      }
    }
    storageNote =
      "Binary evidence objects live in private storage (locked supporting-mechanics §2); the credential writer hasn't shipped, so no evidence objects exist yet. When it ships, each evidence object is downloadable per-entry alongside this bundle and erased with the account.";
  }

  let profileRow: unknown = null;
  const { configured } = supabaseEnv();
  if (configured) {
    try {
      const { data } = await supabaseAdmin()
        .from("profiles")
        .select("email, full_name, role, student_id, campus, year_level, program, section, created_at")
        .eq("id", profile.userId)
        .maybeSingle();
      profileRow = data ?? null;
    } catch {
      profileRow = null; // the session's own identity fields still export below
    }
  }

  const bundle = {
    notice:
      "RA 10173 data-subject export — one JSON of everything this career-readiness system holds for the signed-in account. Password authentication stays upstream (Supabase Auth) and is never exported.",
    generatedAt: new Date().toISOString(),
    profile: profileRow ?? {
      email: profile.email,
      fullName: profile.fullName,
      role: profile.role,
      studentId: profile.studentId,
      campus: profile.campus,
      yearLevel: profile.yearLevel,
      program: profile.program,
      section: profile.section,
    },
    academicState: stateRecord,
    eventHistory: events,
    resumeRuns,
    letterRuns,
    credentials,
    evidenceStorage: storageNote,
    retention:
      "Erasure is self-service (the account page) and full-cascade per the locked supporting-mechanics. A post-defense institutional retention policy (e.g., anonymized audit trail) is documented future work.",
  };

  const safeId = (profile.studentId ?? profile.email.split("@")[0]).replace(/[^\w.-]/g, "_");
  return new NextResponse(JSON.stringify(bundle, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="career-readiness-export-${safeId}.json"`,
      "Cache-Control": "no-store",
    },
  });
}

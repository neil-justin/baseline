import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { withStateLock } from "@/lib/state-queue";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * PATCH /api/profile — the Account tab's editable identity (Round 7 lock,
 * mirrors the intake): full name · program · year level · section are
 * editable self-service; the EMAIL is the auth identity — read-only here;
 * CAMPUS is the tenant key (ticket 11) — fixed, never student-editable.
 *
 * One record, two views: the profile row feeds the account/roster reads,
 * state.name feeds the score surfaces — a rename updates BOTH under the
 * state lock so the dashboard/profile readouts never split.
 */
export async function PATCH(req: Request) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "student" || !profile.studentId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "bad_json", detail: "The edit didn't arrive complete — try again." }, { status: 400 });
  }

  const field = (v: unknown, max: number): string | null => {
    const s = typeof v === "string" ? v.trim().slice(0, max) : "";
    return s ? s : null;
  };
  const fullName = body.fullName;
  if (typeof fullName !== "string" || !fullName.trim()) {
    return NextResponse.json({ error: "bad_input", detail: "Your full name can't be empty — the roster reads it." }, { status: 400 });
  }
  const name = fullName.trim().slice(0, 80);
  const yearLevel = field(body.yearLevel, 40);
  const program = field(body.program, 80);
  const section = field(body.section, 40);

  const { error } = await supabaseAdmin()
    .from("profiles")
    .update({ full_name: name, year_level: yearLevel, program, section })
    .eq("id", profile.userId);
  if (error) return NextResponse.json({ error: "storage_failed", detail: error.message }, { status: 500 });

  // the state carrier mirrors the name (score surfaces render state.name)
  await withStateLock(profile.studentId, async () => {
    const state = await db.getStudentState(profile.studentId!);
    if (state.name !== name) await db.saveStudentState(profile.studentId!, { ...state, name });
  });

  return NextResponse.json({ ok: true, note: "Profile saved — the changed fields now read everywhere." });
}

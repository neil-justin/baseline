import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/session";
import { db, getStudentView } from "@/lib/db";
import { credentialStore, type CredentialAuditRuling } from "@/lib/db/credential-store";
import { applyVerifiedCredential } from "@/lib/actions";
import { withStateLock } from "@/lib/state-queue";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/admin/credentials/[id] — the Round-8 credential audit ruling
 * (2026-10-29 admin-college-scope.md Q3a, locked): the Counselor/ System
 * Admin rules a `declared` entry from the admin queue.
 *
 *   { action: "verify" }            → the row stamps VERIFIED (ruledBy +
 *                                     ruledAt = the audit spine) and the
 *                                     Round-4 engine join rides the same
 *                                     write: the entry's cited skills that
 *                                     sit on the student's TARGET career map
 *                                     close their gap bars like platform
 *                                     completions — feeding SP + TP
 *                                     (lib/actions.applyVerifiedCredential).
 *   { action: "reject", note? }  → the row turns rejected — status NOT
 *                                     ACCEPTED on the student's Credentials
 *                                     panel, the note riding `audit_note`
 *                                     verbatim (the student revises +
 *                                     resubmits; note null when none given).
 *
 * WHY a dedicated route (not an extension of PATCH /api/credentials/[id]):
 * the student PATCH owns the declaration contract with the STUDENT-only
 * actor guard (actingStudentId); this route owns the RULING with the
 * STAFF-only guard + engineered store writes (service-role, no student_id
 * scoping — the counselor crosses the roster, the student never does).
 * Same store seam (lib/db/credential-store), two honest doors.
 *
 * Guards, in order: staff session (401 unauthenticated / 403 student); row
 * must exist; only a still-`declared` row accepts a ruling (re-ruling a
 * recorded verdict would undercut the auditor — the store enforces it via
 * the `status = declared` predicate and answers 409, not a silent lie).
 * The verify join runs under the per-student state lock — the same
 * lost-update guard every state write keeps.
 */

const badRuling = (detail: string, status = 400) =>
  NextResponse.json({ error: "bad_ruling", detail }, { status });

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (profile.role !== "counselor" && profile.role !== "sysadmin") {
    return NextResponse.json({ error: "forbidden", detail: "The credential audit is the counselor's seat." }, { status: 403 });
  }
  const { id: rowId } = await params;

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return badRuling("The ruling didn't arrive complete — try again.");
  }
  const action = body.action;
  if (action !== "verify" && action !== "reject") {
    return badRuling("The ruling names one of two actions — verify, or reject with the reason.");
  }
  const note = typeof body.note === "string" ? body.note.trim().slice(0, 300) : null;
  if (action === "reject" && note === null) {
    return badRuling("Reject with a reason on the entry itself — the student revises from that line.");
  }
  if (action === "reject" && note && /[<>]/.test(note)) {
    return badRuling("Write the reason in plain words — no brackets, it reads back verbatim on the row.");
  }

  const row = (await credentialStore.listAll()).find((r) => r.id === rowId);
  console.error(`[route-audit-E] rowId=${rowId} found=${row ? row.id : "none"} status=${row?.status}`);
  if (!row) {
    return NextResponse.json(
      { error: "not_found", detail: "That entry isn't in the audit queue — it may have been withdrawn while you read it." },
      { status: 404 }
    );
  }
  if (row.status !== "declared") {
    return NextResponse.json(
      { error: "already_ruled", detail: "The audit already ruled on this entry — a recorded verdict isn't re-ruled." },
      { status: 409 }
    );
  }

  const ruling: CredentialAuditRuling = {
    status: action === "verify" ? "verified" : "rejected",
    ruledBy: profile.fullName,
    ruledAt: new Date().toISOString(),
    auditNote: action === "reject" ? note : null,
  };
  const ruled = await credentialStore.audit(rowId, ruling);
  if (!ruled) {
    return NextResponse.json(
      { error: "already_ruled", detail: "The audit already ruled on this entry — a recorded verdict isn't re-ruled." },
      { status: 409 }
    );
  }

  if (action === "reject") {
    const carrierHonest =
      ruled.auditNote === null && note !== null
        ? " The reason could not ride the row — the audit's note column is a recorded pending SQL block (supabase/schema.sql); it applies with the credentials blocks and the student then revises from it."
        : "";
    return NextResponse.json({
      credential: ruled,
      closed: [],
      note: `Not accepted — the reason is on the record; the student revises from it.${carrierHonest}`,
    });
  }

  // the Round-4 join rides the verify ruling: cited skills that sit on the
  // student's target career map close their bars like platform completions
  let closed: string[] = [];
  const updated = await withStateLock(row.studentId, async () => {
    const { state, career } = await getStudentView(row.studentId);
    const joined = applyVerifiedCredential(state, career, ruled);
    if (joined.closed.length > 0) {
      await db.saveStudentState(row.studentId, joined.state);
      closed = joined.closed;
    }
    return joined;
  });

  return NextResponse.json({
    credential: ruled,
    closed,
    queueTicks: updated.queueTicks,
    note:
      closed.length > 0
        ? `Verified — ${closed.length} declared skill${closed.length === 1 ? "" : "s"} closed gap bar${closed.length === 1 ? "" : "s"} on the target map.`
        : "Verified — no cited skill sits on the target career map, so nothing closes (the ruling is on the record).",
  });
}

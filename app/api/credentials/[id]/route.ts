import { NextResponse } from "next/server";
import { actingStudentId } from "@/lib/session";
import { credentialStore, type CredentialInput } from "@/lib/db/credential-store";
import { validateCredentialInput } from "../validate-input";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * PATCH /api/credentials/[id] — the lifecycle routes the Round-7 lock names:
 *   - a `declared` row: full edit while it's the student's own (edit-while-
 *     declared) — the row stays declared;
 *   - a `rejected` row: revise + resubmit — the patch re-enters `declared`
 *     (the audit note rides along so the revision is honest about its past);
 *   - a `verified` row: 404 — the audit decision is a shared record; the
 *     student cannot mutate it (that would undercut the auditor).
 * DELETE — the same two editable states pass; a verified row answers too.
 * Every query carries BOTH the route id and the acting (signed-in) student —
 * no student can ever address another student's row.
 */

/** Same validation contract as POST /api/credentials (factor of honesty:
 *  a resubmission passes exactly the checks a first declaration would). */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = await actingStudentId(undefined);
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id: rowId } = await params;

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "bad_json", detail: "The revision didn't arrive complete — try again." }, { status: 400 });
  }

  const check = validateCredentialInput(body);
  if (typeof check === "string") return NextResponse.json({ error: "bad_input", detail: check }, { status: 400 });

  try {
    const updated = await credentialStore.edit(id, rowId, check.ok as CredentialInput);
    if (!updated) {
      return NextResponse.json(
        { error: "not_found", detail: "That entry isn't yours to edit, or it was already verified — verified entries are read-only." },
        { status: 404 }
      );
    }
    const resubmitted = updated.status === "declared";
    return NextResponse.json({
      credential: updated,
      note: resubmitted
        ? "Saved — the revision now awaits the counselor audit again."
        : "Saved while declared — it stays pending the counselor audit.",
    });
  } catch (e) {
    return NextResponse.json({ error: "storage_failed", detail: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = await actingStudentId(undefined);
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id: rowId } = await params;
  try {
    const gone = await credentialStore.remove(id, rowId);
    if (!gone) {
      return NextResponse.json(
        { error: "not_found", detail: "That entry isn't yours to delete, or it was already verified — verified entries are read-only." },
        { status: 404 }
      );
    }
    return NextResponse.json({ note: "Deleted while it was still yours — the audit never ruled on it." });
  } catch (e) {
    return NextResponse.json({ error: "storage_failed", detail: (e as Error).message }, { status: 500 });
  }
}

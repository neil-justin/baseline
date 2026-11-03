import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * PATCH /api/admin/counselor-requests/[id] — the ONE place a counselor
 * privilege is granted (ADR 0006). Sysadmin session required (role from the
 * session, never the body). id = the applicant's auth user id.
 *   approve → approve_counselor() RPC — ONE TRANSACTION (profiles row + the
 *             approval stamp commit together or not at all; idempotent,
 *             on-conflict-do-nothing; STAMP-FIRST OBSERVABLE — the RPC
 *             answers 'not_pending' when the row left pending under us →
 *             already_decided) — then app_metadata.role counselor
 *             (proxy.ts) as the second step. A failed second step answers
 *             500; re-clicking heals: the RPC skips for an already-approved
 *             row and the stamp write retries. No torn state can wedge.
 *             (User ruling 2026-11-03: "this looks like a transaction".)
 *   reject  → request row stamped rejected/decided_by. NO grant, and the
 *             applicant may resubmit from /welcome (upsert flips pending).
 * Errors: unauthorized | forbidden | bad_json | bad_input | not_found |
 *         already_decided | server
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (profile.role !== "sysadmin") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  const action = body.action;
  if (action !== "approve" && action !== "reject") {
    return NextResponse.json({ error: "bad_input" }, { status: 400 });
  }

  try {
    const admin = supabaseAdmin();
    const { data: request } = await admin
      .from("counselor_requests")
      .select("email, full_name, note, status")
      .eq("user_id", id)
      .maybeSingle();
    if (!request || (request.status !== "pending" && request.status !== "approved")) {
      // "approved" re-entry = a prior attempt committed the transaction but
      // failed the JWT stamp below; this skip + re-stamp is the healing path
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    if (request.status === "pending" && action === "reject") {
      // stamp-first observable reject (mirror of approve's RPC form): the
      // update carries its own pending predicate, so an approve committing
      // between this route's read and its write can never be overwritten —
      // a zero-row update IS the "already decided" answer
      const { data: rejectedRows, error } = await admin
        .from("counselor_requests")
        .update({
          status: "rejected",
          decided_at: new Date().toISOString(),
          decided_by: profile.email,
        })
        .eq("user_id", id)
        .eq("status", "pending")
        .select("user_id");
      if (error) return NextResponse.json({ error: "server" }, { status: 500 });
      if (!rejectedRows || rejectedRows.length === 0) {
        return NextResponse.json({ error: "already_decided" }, { status: 409 });
      }
      return NextResponse.json({ status: "rejected" });
    }

    // approve — ONE RPC call, ONE transaction: profiles row + approval stamp
    // commit together or not at all. Stamp-first observable: 'not_pending'
    // means another admin's decision landed first — the row left the pending
    // set under us and the decided facts (theirs) stand. Healing re-entry
    // (status already "approved" after a lost response) never reaches here.
    if (request.status === "pending") {
      const { data: rpcStatus, error: rpcErr } = await admin.rpc("approve_counselor", {
        p_user_id: id,
        p_email: request.email,
        p_full_name: request.full_name,
        p_decided_by: profile.email,
      });
      if (rpcErr) return NextResponse.json({ error: "server" }, { status: 500 });
      if (rpcStatus !== "approved") {
        return NextResponse.json({ error: "already_decided" }, { status: 409 });
      }
    }

    // stale-reject guard (review round 2): a stale reject click on an
    // already-approved row must never re-issue the JWT marker (an auth write
    // armed by a decision nobody made) — the row's decided facts stand
    if (request.status === "approved" && action === "reject") {
      return NextResponse.json({ error: "already_decided" }, { status: 409 });
    }

    // the JWT role is the /admin admit ticket (proxy.ts reads app_metadata) —
    // NOT voided on this surface: a failed stamp answers 500; re-clicking
    // re-enters with request.status already "approved", skips the RPC, and
    // THIS write retries to completion
    const { error: metaErr } = await admin.auth.admin.updateUserById(id, {
      app_metadata: { role: "counselor" },
    });
    if (metaErr) return NextResponse.json({ error: "server" }, { status: 500 });

    return NextResponse.json({ status: "approved" });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

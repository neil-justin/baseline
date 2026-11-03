import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * PATCH /api/admin/counselor-requests/[id] — the ONE place a counselor
 * privilege is granted (ADR 0006). Sysadmin session required (role from the
 * session, never the body). id = the applicant's auth user id.
 *   approve → profiles row created (role counselor, campus demo-campus —
 *             section/campus edits remain the seed/dashboard's manual job,
 *             same as today) + app_metadata.role counselor (proxy.ts) +
 *             request row stamped approved/decided_by (the audit trail).
 *   reject  → request row stamped rejected/decided_by. NO grant, and the
 *             applicant may resubmit from /welcome (upsert flips pending).
 * Errors: unauthorized | forbidden | not_found | already_has_account | server
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
    if (!request || request.status !== "pending") {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    if (action === "reject") {
      // one statement writes status + BOTH stamps — the schema's strict
      // check (pending ⇔ no stamps; decided ⇔ both) is satisfied atomically
      const { error } = await admin
        .from("counselor_requests")
        .update({
          status: "rejected",
          decided_at: new Date().toISOString(),
          decided_by: profile.email,
        })
        .eq("user_id", id);
      if (error) return NextResponse.json({ error: "server" }, { status: 500 });
      return NextResponse.json({ status: "rejected" });
    }

    // approve — one profiles row must not already exist (roster email with a
    // separate account is the dashboard's manual path, not this queue's)
    const { data: existing } = await admin
      .from("profiles")
      .select("id")
      .eq("id", id)
      .maybeSingle();
    if (existing) return NextResponse.json({ error: "already_has_account" }, { status: 409 });

    const { error: profErr } = await admin.from("profiles").insert({
      id,
      email: request.email,
      full_name: request.full_name,
      role: "counselor",
      student_id: null,
      campus: "demo-campus",
    });
    if (profErr) return NextResponse.json({ error: "server" }, { status: 500 });

    // the JWT role too (proxy.ts reads app_metadata) — same-parity rule the
    // signup route establishes for students. Best-effort BY CONTRACT: the
    // profiles row is written (the roster's source of truth), and proxy's
    // /admin guard reads getUser() server-side which hydrates fresh
    // app_metadata on the next request regardless.
    const { error: metaErr } = await admin.auth.admin.updateUserById(id, {
      app_metadata: { role: "counselor" },
    });
    void metaErr; // documented best-effort; see contract comment above

    // same single-statement stamp rule as the reject branch above
    const { error: stampErr } = await admin
      .from("counselor_requests")
      .update({
        status: "approved",
        decided_at: new Date().toISOString(),
        decided_by: profile.email,
      })
      .eq("user_id", id);
    if (stampErr) return NextResponse.json({ error: "server" }, { status: 500 });

    return NextResponse.json({ status: "approved" });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

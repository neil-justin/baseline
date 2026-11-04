import type { Metadata } from "next";
import { requireStaff } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase/server";
import AdminBar from "../AdminBar";
import ApproveRow from "./ApproveRow";
import "../admin.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Counselor requests — Baseline",
};

/**
 * Counselor requests queue (Google round, ADR 0006). SYSADMIN ONLY —
 * granting staff privilege is not a counselor power (the roles are ordered:
 * counselor audits students; sysadmin provisions privilege). Rows are the
 * pending counselor applications from /welcome, oldest first, FULL transcript
 * visible: name, email, the applicant's own note, requested stamp. Approve
 * and reject both record decided_at/decided_by — the trail is the artifact
 * the audit story reads.
 */
export default async function CounselorRequestsPage() {
  const profile = await requireStaff();
  if (profile.role !== "sysadmin") {
    // counselors have no projection into provisioning — the honest 403 surface
    return (
      <div className="v7admin">
        <AdminBar role={profile.role} />
        <main id="main" className="ashell">
          <section className="proband panel" aria-label="Counselor provisioning">
            <p className="aq-empty">Counselor provisioning is a System Admin surface.</p>
          </section>
        </main>
      </div>
    );
  }

  const admin = supabaseAdmin();
  const { data: rows } = await admin
    .from("counselor_requests")
    .select("user_id, email, full_name, note, status, requested_at")
    .eq("status", "pending")
    .order("requested_at", { ascending: true });

  const pending = (rows ?? []) as Array<{
    user_id: string;
    email: string;
    full_name: string;
    note: string;
    requested_at: string;
  }>;

  return (
    <div className="v7admin">
      <AdminBar role={profile.role} />
      <main id="main" className="ashell">
        {/* the v7 named-surface band — count heading + the queue's one intro line */}
        <section className="proband" aria-label="Counselor requests">
          <div className="band">
            <div className="bandrow">
              <div className="who">
                <h1>Counselor requests ({pending.length})</h1>
                <p className="band-id">
                  First-time Google identities that declared counselor. Approving writes the
                  profiles row and the JWT role in one action — the applicant signs in again and
                  opens the Admin console.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* the pending applications, oldest first — same shelf as the audit queue */}
        <section className="panel" aria-label="Pending applications">
          {pending.length === 0 && <p className="aq-empty">Nothing waiting.</p>}
          {pending.map((r) => (
            <ApproveRow
              key={r.user_id}
              row={{
                userId: r.user_id,
                email: r.email,
                fullName: r.full_name,
                note: r.note,
                requestedAt: r.requested_at,
              }}
            />
          ))}
        </section>
      </main>
    </div>
  );
}

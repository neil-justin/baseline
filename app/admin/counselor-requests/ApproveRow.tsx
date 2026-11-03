"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * One pending counselor application (ADR 0006). Approve → PATCH { action:
 * "approve" } → the API writes the profiles row + app_metadata role and
 * marks the request approved; Reject records the same trail with no grant.
 * The list re-reads on completion (router.refresh) — no client-side state
 * mirrors the server's single source of truth. On an approve whose SMTP
 * send didn't ride (mailStatus ≠ "sent"), the row holds a status banner
 * for 6s of reading time BEFORE the refresh unmounts the row.
 */
export interface RequestRow {
  userId: string;
  email: string;
  fullName: string;
  note: string;
  requestedAt: string;
}

export default function ApproveRow({ row }: { row: RequestRow }) {
  const router = useRouter();
  const [acting, setActing] = useState<"approve" | "reject" | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [mailNote, setMailNote] = useState<string | null>(null);

  async function decide(action: "approve" | "reject") {
    setActing(action);
    setErr(null);
    // clear at entry: on a retry click the PREVIOUS banner would otherwise
    // linger through the new attempt (the 409 arm navigates via refresh
    // anyway — entry is the safe place)
    setMailNote(null);
    try {
      const res = await fetch(`/api/admin/counselor-requests/${row.userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        if (res.status === 409) {
          // already_decided (another admin ruled, or this decision landed in
          // an earlier lost response): the truthful action is a refresh, not
          // an error — the list re-reads and shows the decided state
          router.refresh();
          return;
        }
        setErr("The decision didn't record. Try again.");
        return;
      }
      const data = (await res.json().catch(() => null)) as { status?: string; mailStatus?: string } | null;
      if (action === "approve" && data?.mailStatus && data.mailStatus !== "sent") {
        setMailNote(
          data.mailStatus === "skipped_no_config"
            ? "Approved — mail config is off, so no email went out. Let them know by other means."
            : "Approved — but the SMTP send failed, so no email reached them. Let them know by other means."
        );
        // 6s reading time BEFORE the refresh unmounts the row — the banner is
        // the approving human's work item; the server truth (row gone from the
        // pending list) lands one screen-beat later, correct the whole time.
        await new Promise((r) => setTimeout(r, 6000));
      }
      router.refresh();
    } catch {
      setErr("The decision didn't record. Try again.");
    } finally {
      setActing(null);
    }
  }

  const when = new Date(row.requestedAt);
  const stamp = Number.isNaN(when.getTime())
    ? "—"
    : `${when.toLocaleDateString("en-US", { month: "short" })} ${when.getDate()}`;

  return (
    <div className="crq-row" data-testid={`counselor-request-${row.email}`}>
      <div className="crq-id">
        <span className="crq-meta">
          <strong className="crq-name">{row.fullName}</strong> · {row.email} · requested {stamp}
        </span>
        <p className="crq-note">{row.note}</p>
        {mailNote && (
          // status note (not an alert) — same shape as .crq-err but ink, not
          // amber (approve SUCCEEDED; only the courtesy email didn't ride)
          <div
            role="status"
            style={{
              display: "block",
              margin: "6px 0 0",
              font: "400 12px/1.5 Roboto, system-ui, sans-serif",
              color: "var(--v-ink)",
            }}
          >
            {mailNote}
          </div>
        )}
        {err && (
          <div className="crq-err" role="alert">
            {err}
          </div>
        )}
      </div>
      <div className="crq-acts">
        <button
          type="button"
          className="aq-btn aq-verify"
          disabled={acting !== null}
          aria-label={`Approve ${row.email}`}
          onClick={() => decide("approve")}
        >
          {acting === "approve" ? "Approving…" : "Approve"}
        </button>
        <button
          type="button"
          className="aq-btn aq-rejectbtn"
          disabled={acting !== null}
          aria-label={`Reject ${row.email}`}
          onClick={() => decide("reject")}
        >
          {acting === "reject" ? "Rejecting…" : "Reject"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

/**
 * The Round-8 timestamped credential audit queue (2026-10-29 admin-college-
 * scope.md Q3a — "the counselor's function"). One dense table in the family
 * register: pending entries (NEEDS CHECK) first, oldest declared first;
 * recorded rulings after (VERIFIED / NOT ACCEPTED), newest first. Each row
 * carries the audit spine — student, kind, title, evidence links, the
 * declared skills the audit rules on, declared stamp; ruled rows carry who
 * + when (verified_by / verified_at) and the REJECT reason verbatim.
 *
 * Actions per Round 8: **Verify** (the ruling stamps the row — the cited
 * skills that sit on the student's target career map close their gap bars,
 * the Round-4 join riding the same POST) and **Reject with reason** (the
 * reason rides `audit_note`; the row turns NOT ACCEPTED for the student to
 * revise or delete). The roster and counters re-render from the store on
 * reload — nothing here paints a number.
 *
 * Hooks: [data-aq-row] · [data-aq-status] · [data-aq-verify] ·
 * [data-aq-reject] · [data-aq-note] · [data-aq-reject-confirm] — grep-
 * unique against the existing e2e selectors.
 */

export interface QueueRow {
  id: string;
  studentId: string;
  studentName: string;
  kind: "certification" | "internship" | "project";
  title: string;
  organization: string | null;
  evidenceUrl: string | null;
  evidenceNote: string | null;
  declaredSkills: string[];
  status: "declared" | "verified" | "rejected";
  declaredAt: string;
  ruledBy: string | null;
  ruledAt: string | null;
  auditNote: string | null;
}

const KIND_LABEL: Record<QueueRow["kind"], string> = {
  certification: "Certification",
  internship: "Internship or job",
  project: "Personal project / org role",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** ISO → "30 Oct 2026 · 14:42" — the audit's day + minute on one line. */
function stamp(iso: string | null): string {
  if (!iso) return "";
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return iso;
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${Number(m[1])}, ${m[4]}:${m[5]}`;
}

export default function AuditQueue({ rows, ruledByLabel }: { rows: QueueRow[]; ruledByLabel: string }) {
  const [armed, setArmed] = useState<string | null>(null); // which row's reject form is open
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function rule(row: QueueRow, action: "verify" | "reject") {
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/credentials/${row.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action === "verify" ? { action: "verify" } : { action: "reject", note: note.trim() || null }),
      });
      if (res.ok) {
        window.location.reload(); // store truth re-renders roster + queue + counters
      } else {
        const json = (await res.json().catch(() => null)) as { detail?: string } | null;
        setErr(json?.detail ?? "The ruling didn't record — the entry is untouched; try again.");
        setBusy(false);
      }
    } catch {
      setErr("The ruling didn't record — check the connection and try again. The entry is untouched.");
      setBusy(false);
    }
  }

  function arm(row: QueueRow) {
    if (armed === row.id) {
      setArmed(null); // disarm — the first click is the honest confirm step
      return;
    }
    setArmed(row.id);
    setNote("");
    setErr(null);
  }

  const pending = rows.filter((r) => r.status === "declared");
  const ruled = rows.filter((r) => r.status !== "declared");

  if (rows.length === 0) {
    return (
      <section className="panel queue" aria-label="Credential audit">
        <div className="ct-head">
          <h2 className="ct-title">Credential audit</h2>
        </div>
        <p className="aq-empty">
          Nothing waits on the audit. Declared credentials land here when students attach evidence —
          the ruling closes their cited skills on the target career map.
        </p>
      </section>
    );
  }

  return (
    <section className="panel queue" aria-label="Credential audit">
      <div className="ct-head">
        <div>
          <h2 className="ct-title">Credential audit</h2>
          <p className="aq-sub">
            Declared credentials wait here for the counselor ruling — verify closes the cited skills
            on the student&apos;s target career map; a reject returns the entry with your reason.
          </p>
        </div>
        <p className="ct-legend aq-legend">
          AUDIT SPINE — READY AUDIT — REVIEWED BY <b>{ruledByLabel.toUpperCase()}</b>
        </p>
      </div>
      <div className="ct-colheads ct-label aq-heads" aria-hidden="true">
        <span>STATUS</span>
        <span>ENTRY</span>
        <span>EVIDENCE — DECLARED SKILLS</span>
        <span>RULING</span>
      </div>

      {[...pending, ...ruled].map((r) => (
        <div className={`aq-row aq-${r.status}`} key={r.id} data-aq-row>
          <span className="aq-statuscell">
            {r.status === "declared" && (
              <span className="chip c-amber" data-aq-status>
                NEEDS CHECK
              </span>
            )}
            {r.status === "verified" && (
              <span className="chip c-green" data-aq-status>
                VERIFIED
              </span>
            )}
            {r.status === "rejected" && (
              <span className="chip c-grey" data-aq-status>
                NOT ACCEPTED
              </span>
            )}
          </span>
          <span className="aq-entry">
            <span className="aq-name">{r.studentName}</span>
            <span className="aq-title">{r.title}</span>
            <span className="aq-meta">
              {KIND_LABEL[r.kind]}
              {r.organization ? ` — ${r.organization}` : ""}
            </span>
            <span className="aq-stamp num">declared {stamp(r.declaredAt)}</span>
          </span>
          <span className="aq-evidence">
            {r.evidenceUrl ? (
              <a className="aq-link" href={r.evidenceUrl} target="_blank" rel="noreferrer">
                {r.evidenceUrl}
              </a>
            ) : (
              <span className="aq-line">{r.evidenceNote || "no evidence attached"}</span>
            )}
            {r.declaredSkills.length > 0 && (
              <span className="aq-line num">
                declared skills: {r.declaredSkills.join(", ")}
              </span>
            )}
          </span>
          <span className="aq-ruling">
            {r.status === "declared" && (
              <>
                <span className="aq-acts">
                  <button
                    className="aq-btn aq-verify"
                    type="button"
                    data-aq-verify
                    onClick={() => rule(r, "verify")}
                    disabled={busy}
                  >
                    Verify
                  </button>
                  <button
                    className={`aq-btn aq-rejectbtn${armed === r.id ? " armed" : ""}`}
                    type="button"
                    data-aq-reject
                    onClick={() => arm(r)}
                    disabled={busy}
                  >
                    Reject with reason
                  </button>
                </span>
                {armed === r.id && (
                  <span className="aq-rejectform">
                    <input
                      type="text"
                      className="aq-note"
                      data-aq-note
                      placeholder="The reason the student reads on the entry —"
                      value={note}
                      maxLength={300}
                      onChange={(e) => setNote(e.target.value)}
                    />
                    <button
                      className="aq-btn aq-rejectbtn armed"
                      type="button"
                      data-aq-reject-confirm
                      onClick={() => rule(r, "reject")}
                      disabled={busy}
                    >
                      Confirm reject
                    </button>
                  </span>
                )}
              </>
            )}
            {r.status === "verified" && (
              <span className="aq-ruled num">
                verified by {r.ruledBy ?? "—"}
                {r.ruledAt ? `, ${stamp(r.ruledAt)}` : ""}
              </span>
            )}
            {r.status === "rejected" && (
              <span className="aq-ruled num">
                rejected by {r.ruledBy ?? "—"}
                {r.ruledAt ? `, ${stamp(r.ruledAt)}` : ""}
                {r.auditNote ? ` — “${r.auditNote}”` : ""}
              </span>
            )}
          </span>
        </div>
      ))}

      {err && (
        <p className="aq-err" role="alert">
          {err}
        </p>
      )}
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { KeyboardEvent } from "react";

/**
 * The Round-8 timestamped credential audit queue (2026-10-29 admin-college-
 * scope.md Q3a — "the counselor's function"), v9-registered 2026-11-04
 * (Round 6 + this fix round: user-ruled): SEVEN defined columns —
 * STATUS · STUDENT · ENTRY · EVIDENCE · SKILLS · DECLARED · RULING —
 * a pager under the rows, and the ruling interaction living in a
 * row-click DETAIL DIALOG (the mockup realm's audit sketch, console-tabs
 * AuditTab): the counselor reviews the entry full-size — evidence,
 * declared skills, the target-map key — and rules INSIDE the dialog
 * (the note is a growing textarea: reasons can be a paragraph). The row
 * itself is the affordance (family law: the roster cut its explicit
 * Open column the same way); the RULING cell carries the record stamps
 * for ruled rows and an honest em-dash for pending ones.
 *
 * Actions per Round 8: **Verify** (the ruling stamps the row — the cited
 * skills that sit on the student's target career map close their gap
 * bars, the Round-4 join riding the same POST) and **Reject with
 * reason** (the reason rides `audit_note`; the row turns NOT ACCEPTED
 * for the student to revise or delete). Reject keeps the honest confirm
 * step inside the dialog (first Reject click arms — the button turns
 * Confirm reject; nothing posts without it). The roster and counters
 * re-render from the store on reload — nothing here paints a number.
 *
 * v9 round (2026-11-04): the audit-spine legend retires (provenance
 * noise — the meta line folds the computed counts), declared skills
 * render as the Ledger-Register's tonal chips keyed to the student's
 * target career map (`careerSkills` — the ruling closes exactly the
 * chips that read filled; the store's vocabulary ruling is the same
 * fact the join applies).
 *
 * Hooks (moved with their actions into the dialog, same grep-unique
 * names): [data-aq-row] · [data-aq-status] (table) · [data-aq-verify] ·
 * [data-aq-reject] · [data-aq-note] · [data-aq-reject-confirm] (dialog).
 */

export interface QueueRow {
  id: string;
  studentId: string;
  studentName: string;
  /** "4th Year, Computer & IT" — the roster's personaMeta line (real state) */
  sub: string;
  kind: "certification" | "internship" | "project";
  title: string;
  organization: string | null;
  evidenceUrl: string | null;
  evidenceNote: string | null;
  declaredSkills: string[];
  /** the student's TARGET career skill names (Ledger-Register Rule: chips
   *  key to this — filled where the ruling would close the gap bar). A
   *  student without a target career reads null → all chips outline. */
  careerSkills: string[] | null;
  /** the target career's display name (the dialog's key line names it) */
  careerName: string | null;
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
function stampFull(iso: string | null): string {
  if (!iso) return "";
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return iso;
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]} · ${m[4]}:${m[5]}`;
}

/** The DECLARED column's short stamp — day-first · minute, hover full. */
function stampShort(iso: string | null): string {
  if (!iso) return "";
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return iso;
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} · ${m[4]}:${m[5]}`;
}

/** A5 "the ruling stamp" — the Audit queue tab's own header imagery
 *  (per-tab metaphor law: each tab owns its SVG — Cohort's roster-
 *  watch avatars are taken; this is the audit's JOB, not its data):
 *  two stacked declared entries, the front one carrying the
 *  counselor's blue check-seal = the ruling being issued.
 *  Deliberately NOT status-counted — a metaphor, not data. */
function AuditArt() {
  return (
    <svg className="ct-art" width="96" height="48" viewBox="0 0 96 48" aria-hidden="true">
      <g transform="translate(6 11) rotate(-4 12 15)">
        <rect width="24" height="28" rx="5" fill="#F1F3F4" />
        <rect x="4.5" y="6" width="15" height="2.6" rx="1.3" fill="#5F6368" opacity="0.35" />
        <rect x="4.5" y="11.4" width="11" height="2.6" rx="1.3" fill="#5F6368" opacity="0.35" />
        <rect x="4.5" y="16.8" width="13" height="2.6" rx="1.3" fill="#5F6368" opacity="0.35" />
      </g>
      <g transform="translate(38 4) rotate(2 16 19)">
        <rect width="32" height="38" rx="6" fill="var(--v-blue-wash)" />
        <rect x="5" y="7" width="20" height="3" rx="1.5" fill="#0842A0" opacity="0.18" />
        <rect x="5" y="12.6" width="14" height="3" rx="1.5" fill="#0842A0" opacity="0.18" />
        <rect x="5" y="18.2" width="17" height="3" rx="1.5" fill="#0842A0" opacity="0.18" />
        <circle cx="24.5" cy="31" r="8.5" fill="#0842A0" stroke="#FFFFFF" strokeWidth="2" />
        <path
          d="M21 31l2.3 2.3 4.6-5.1"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/* ---------- the pager — the mockup realm's / the roster design doc's
   format (design.md + docs/superpowers/specs/2026-11-04-cohort-roster-
   pagination-design.md): ‹ / one numbered button per page / › with the
   PAGE x OF y tracked label, 10 rows a page, hidden when the table fits
   one page. Drawn chevrons (the subset's glyphs aren't guaranteed). -- */

const PER_PAGE = 10;

function Pager({
  page,
  pages,
  onPage,
}: {
  page: number;
  pages: number;
  onPage: (n: number) => void;
}) {
  if (pages <= 1) return null;
  return (
    <nav className="atabs-pager" aria-label="Table pagination">
      <button
        className="atabs-pager-btn"
        type="button"
        disabled={page <= 1}
        aria-label="Previous page"
        onClick={() => onPage(page - 1)}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          className={`atabs-pager-btn${page === n ? " on" : ""}`}
          type="button"
          aria-current={page === n ? "page" : undefined}
          onClick={() => onPage(n)}
        >
          {n}
        </button>
      ))}
      <button
        className="atabs-pager-btn"
        type="button"
        disabled={page >= pages}
        aria-label="Next page"
        onClick={() => onPage(page + 1)}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <span className="atabs-pager-label num">
        PAGE {page} OF {pages}
      </span>
    </nav>
  );
}

/** The POST's read-back record — CredentialRow's camelCase shape (the
 *  store's toRow mapping) plus the join's receipt; only the ruling's
 *  own fields are folded into the local row. */
type RuledReturn = {
  id: string;
  status: string;
  verifiedBy: string | null;
  verifiedAt: string | null;
  auditNote: string | null;
};

export default function AuditQueue({ rows }: { rows: QueueRow[] }) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  // the ruling updates the queue from the POST's own returned record (the
  // store's truth — never painted): a re-render follows the ruling, no
  // full reload (user-ruled 2026-11-05: verify/reject must not reload the
  // document or bounce the console back to its landing tab).
  const [queue, setQueue] = useState(rows);
  // the streamed re-render (router.refresh after a ruling) is the store's
  // truth — it owns the queue once it lands
  useEffect(() => {
    setQueue(rows);
  }, [rows]);
  const [openId, setOpenId] = useState<string | null>(null); // which row's dialog is open
  const [armed, setArmed] = useState(false); // the reject's honest confirm step
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
        // the ruling is on the record: swap the row from the POST's returned
        // record (the store's own write-back), close the dialog, and let a
        // SOFT refresh re-sync the server-baked panels (the roster's NEEDS
        // AUDIT marks) — the document never unloads, the tab state stays
        // (a window reload reset the console to its landing tab — the
        // user-reported 2026-11-05 defect).
        const json = (await res.json().catch(() => null)) as { credential?: RuledReturn } | null;
        if (json?.credential) {
          const ran = json.credential;
          setQueue((q) =>
            q.map((r) =>
              r.id === ran.id
                ? {
                    ...r,
                    status: ran.status as QueueRow["status"],
                    ruledBy: ran.verifiedBy,
                    ruledAt: ran.verifiedAt,
                    auditNote: ran.auditNote,
                  }
                : r
            )
          );
        }
        setOpenId(null); // the dialog closes onto the re-rendered row
        router.refresh();
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

  function openRow(row: QueueRow) {
    setOpenId(row.id);
    setArmed(false);
    setNote("");
    setErr(null);
  }

  function closeDialog() {
    if (busy) return;
    setOpenId(null);
  }

  function onDialogKey(e: KeyboardEvent) {
    if (e.key === "Escape") closeDialog();
  }

  const pending = queue.filter((r) => r.status === "declared");
  const ruled = queue.filter((r) => r.status !== "declared");
  const pages = Math.max(1, Math.ceil(queue.length / PER_PAGE));
  const clampedPage = Math.min(page, pages);
  const shown = queue.slice((clampedPage - 1) * PER_PAGE, clampedPage * PER_PAGE);
  const open = openId ? queue.find((r) => r.id === openId) ?? null : null;

  if (queue.length === 0) {
    return (
      <section className="panel queue" aria-label="Credential audit">
        <div className="ct-head">
          <div className="ct-headline">
            <h2 className="ct-title">Credential audit</h2>
          </div>
          <AuditArt />
        </div>
        <p className="aq-empty">Nothing waiting on the audit.</p>
      </section>
    );
  }

  return (
    <section className="panel queue" aria-label="Credential audit">
      <div className="ct-head">
        <div className="ct-headline">
          <h2 className="ct-title">Credential audit</h2>
          <p className="ct-meta">
            {pending.length} waiting · {ruled.length} ruled
          </p>
        </div>
        <AuditArt />
      </div>

      {/* the seven defined columns (user-ruled split): every fact its own.
          The whole ROW opens the detail dialog (family law — no explicit
          affordance column; the roster's row navigation rides the same). */}
      <div className="ct-colheads aq-heads" aria-hidden="true">
        <span>STATUS</span>
        <span>STUDENT</span>
        <span>ENTRY</span>
        <span>EVIDENCE</span>
        <span>SKILLS</span>
        <span>DECLARED</span>
        <span>RULING</span>
      </div>

      {shown.map((r) => (
        <div
          className={`aq-row aq-${r.status}`}
          key={r.id}
          data-aq-row
          role="button"
          tabIndex={0}
          aria-label={`Audit detail: ${r.title}, ${r.studentName}`}
          onClick={() => openRow(r)}
          onKeyDown={(e) => {
            if (e.key === "Enter") openRow(r);
          }}
        >
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
          <span className="aq-studentcell">
            <span className="aq-name">{r.studentName}</span>
            {r.sub && <span className="aq-subline">{r.sub}</span>}
          </span>
          <span className="aq-entrycell">
            <span className="aq-title">{r.title}</span>
            {r.organization && <span className="aq-org">{r.organization}</span>}
          </span>
          <span className="aq-evidence">
            {r.evidenceUrl ? (
              <a
                className="aq-link"
                href={r.evidenceUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()} // the link is the row's exception
              >
                {r.evidenceUrl}
              </a>
            ) : (
              <span className="aq-line">{r.evidenceNote || "no evidence attached"}</span>
            )}
          </span>
          <span className="aq-skillcell">
            {r.declaredSkills.length > 0 ? (
              <span className="aq-skills">
                {r.declaredSkills.map((skill) => (
                  <span
                    className={`aq-skillchip${r.careerSkills?.includes(skill) ? " on-map" : ""}`}
                    key={skill}
                  >
                    {skill}
                  </span>
                ))}
              </span>
            ) : (
              <span className="aq-line">no skills cited</span>
            )}
          </span>
          <span className="aq-declaredcell num" title={stampFull(r.declaredAt)}>
            {stampShort(r.declaredAt)}
          </span>
          <span className="aq-rulingcell num">
            {r.status === "verified" && `Verified · ${r.ruledBy ?? "—"} · ${stampShort(r.ruledAt)}`}
            {r.status === "rejected" && `Not accepted · ${r.ruledBy ?? "—"} · ${stampShort(r.ruledAt)}`}
            {r.status === "declared" && "—"}
          </span>
        </div>
      ))}

      <Pager page={clampedPage} pages={pages} onPage={setPage} />

      {/* ---------- the audit detail dialog (the ruling's home) ---------- */}
      {open && (
        <div className="aq-dialog-back" role="presentation" onClick={closeDialog}>
          <section
            className="aq-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={`Audit detail: ${open.title} — ${open.studentName}`}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onDialogKey}
          >
            <header className="aq-dhead">
              <div className="aq-dchips">
                {open.status === "declared" && <span className="chip c-amber">NEEDS CHECK</span>}
                {open.status === "verified" && <span className="chip c-green">VERIFIED</span>}
                {open.status === "rejected" && <span className="chip c-grey">NOT ACCEPTED</span>}
                <span className="chip c-kind">{KIND_LABEL[open.kind]}</span>
              </div>
              <h3 className="aq-dtitle">{open.title}</h3>
            </header>
            <button
              className="aq-dclose"
              type="button"
              aria-label="Close audit detail"
              onClick={closeDialog}
              disabled={busy}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>

            <div className="aq-dfield">
              <p className="aq-dlabel">STUDENT</p>
              <p className="aq-dline">
                {open.studentName}
                {open.sub ? <span className="aq-dsub">, {open.sub}</span> : null}
              </p>
            </div>

            <div className="aq-dfield">
              <p className="aq-dlabel">EVIDENCE</p>
              {open.evidenceUrl ? (
                <a className="aq-link" href={open.evidenceUrl} target="_blank" rel="noreferrer">
                  {open.evidenceUrl}
                </a>
              ) : (
                <p className="aq-dline">{open.evidenceNote || "no evidence attached"}</p>
              )}
              <p className="aq-dstamp num">declared {stampFull(open.declaredAt)}</p>
            </div>

            <div className="aq-dfield">
              <p className="aq-dlabel">DECLARED SKILLS</p>
              {open.declaredSkills.length > 0 && (
                <span className="aq-skills">
                  {open.declaredSkills.map((skill) => (
                    <span
                      className={`aq-skillchip${open.careerSkills?.includes(skill) ? " on-map" : ""}`}
                      key={skill}
                    >
                      {skill}
                    </span>
                  ))}
                </span>
              )}
              {open.declaredSkills.length === 0 && <p className="aq-dline">no skills cited</p>}
              {open.careerSkills ? (
                <p className="aq-dkey">
                  the filled chips close their gap bars on{" "}
                  <b>{open.careerName ?? "the mapped career"}</b>&apos;s map when the ruling verifies
                </p>
              ) : (
                <p className="aq-dkey">no target career on record — a ruling closes nothing yet</p>
              )}
            </div>

            {open.status === "declared" ? (
              <div className="aq-dfield aq-drule">
                <p className="aq-dlabel">COUNSELOR RULING</p>
                {armed ? (
                  <span className="aq-dwarn">Confirm reject — the entry turns NOT ACCEPTED for the student to revise.</span>
                ) : (
                  <p className="aq-dkey">the reason rides the entry only when you reject — optional for verify</p>
                )}
                <textarea
                  className="aq-note"
                  data-aq-note
                  rows={3}
                  maxLength={300}
                  placeholder="The reason the student reads on the entry —"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                {err && (
                  <p className="aq-derr" role="alert">
                    {err}
                  </p>
                )}
                <span className="aq-dacts">
                  <button
                    className="aq-btn aq-verify"
                    type="button"
                    data-aq-verify
                    onClick={() => rule(open, "verify")}
                    disabled={busy}
                  >
                    Verify
                  </button>
                  {armed ? (
                    <button
                      className="aq-btn aq-rejectbtn armed"
                      type="button"
                      data-aq-reject-confirm
                      onClick={() => rule(open, "reject")}
                      disabled={busy}
                    >
                      Confirm reject
                    </button>
                  ) : (
                    <button
                      className="aq-btn aq-rejectbtn"
                      type="button"
                      data-aq-reject
                      onClick={() => setArmed(true)}
                      disabled={busy}
                    >
                      Reject with reason
                    </button>
                  )}
                  {armed && (
                    <button className="aq-dcancel" type="button" onClick={() => setArmed(false)} disabled={busy}>
                      Cancel
                    </button>
                  )}
                </span>
              </div>
            ) : (
              <div className="aq-dfield aq-drule">
                <p className="aq-dlabel">RULING</p>
                <p className="aq-dline num">
                  {open.status === "verified" ? "Verified" : "Not accepted"} by {open.ruledBy ?? "—"}
                  {open.ruledAt ? `, ${stampFull(open.ruledAt)}` : ""}
                </p>
                {open.auditNote && <p className="aq-dnote">“{open.auditNote}”</p>}
                <p className="aq-dkey">the audit is a shared record — the student side sees this entry read-only</p>
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  );
}

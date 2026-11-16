"use client";

/**
 * admin/slots.tsx — the sysadmin-only tabs bound to REAL data (2026-11-03
 * admin-replacement Waves 2+3).
 *
 *   APPROVALS — the counselor_requests table: APPLICANT · REQUEST ·
 *   DECLARED · TRAIL · STATUS · ACTION, read from
 *   GET /api/admin/counselor-requests (pending + decided, trail = real
 *   decided_by/decided_at). Only PENDING rows carry the action pair; the
 *   armed two-step (user-selected Option A) commits through the same
 *   PATCH /api/admin/counselor-requests/[id] contract the live ApproveRow
 *   uses — never a one-click irreversible grant — then the list re-reads
 *   (no client state mirrors the store).
 *
 *   ACCOUNTS — the identities table: ACCOUNT · ROLE · STATUS · LAST
 *   SIGN-IN · visible actions, at 10/page behind the shared Pager with
 *   blind skeleton rows on the load hold. GET /api/admin/accounts on
 *   mount; the viewer's own row never renders (user-ruled 2026-11-05)
 *   and actions sit IN the row on the approvals armed register —
 *   REACTIVATE is one click; DEACTIVATE arms into CONFIRM —
 *   DEACTIVATE + CANCEL (no popover held), then the soft PATCH
 *   { userId, active } re-runs the list. Deactivated names render
 *   struck-through — the honest vacancy.
 *
 * e2e-hook rule: everything here is `atabs-` (admin-tabs.css) — never a
 * hook class (.s-row, .aq-*, .dt-score, .rubric, .cohort*).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import type { CounselorRequestRow } from "@/app/api/admin/counselor-requests/route";
import Pager from "./Pager";
import { pagesOf, slicePage } from "./pager-math";

interface AccountRow {
  userId: string;
  email: string;
  fullName: string;
  role: string;
  campus: string;
  active: boolean;
  lastSignInAt: string | null;
}

type Decide = "approve" | "reject";

/* ---------- stamps (values only, no invented "just now") ---------- */

const stampFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

function fmtStamp(iso: string): string {
  const when = new Date(iso);
  return Number.isNaN(when.getTime()) ? "—" : stampFmt.format(when);
}
function fmtDate(iso: string): string {
  const when = new Date(iso);
  return Number.isNaN(when.getTime()) ? "—" : dateFmt.format(when);
}

/* ---------- APPROVALS ---------- */

/** ApprovalsArt — the APPROVALS head (one-register round 2026-11-05):
 *  a request slip behind the decision seal. Metaphor, not data. */
function ApprovalsArt() {
  return (
    <svg className="ct-art" width="96" height="48" viewBox="0 0 96 48" aria-hidden="true">
      <g transform="translate(8 9) rotate(-4)">
        <rect width="30" height="30" rx="4" fill="#F1F3F4" />
        <rect x="5" y="8" width="14" height="2.4" rx="1.2" fill="#5F6368" opacity="0.45" />
        <rect x="5" y="13" width="20" height="2.4" rx="1.2" fill="#5F6368" opacity="0.45" />
        <rect x="5" y="18" width="10" height="2.4" rx="1.2" fill="#5F6368" opacity="0.45" />
      </g>
      <g transform="translate(44 6)">
        <rect width="36" height="34" rx="6" fill="var(--v-blue-wash)" />
        <circle cx="23" cy="17" r="7.5" fill="#0842A0" opacity="0.85" />
        <circle cx="23" cy="17" r="4.2" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="2.4 2.2" />
      </g>
    </svg>
  );
}

/** AccountsArt — the ACCOUNTS head: a stack of identity cards with the
 *  front one in the blue-wash moment. Metaphor, not data. */
function AccountsArt() {
  return (
    <svg className="ct-art" width="96" height="48" viewBox="0 0 96 48" aria-hidden="true">
      <g transform="translate(6 14) rotate(-6)">
        <rect width="30" height="20" rx="4" fill="#F1F3F4" />
      </g>
      <g transform="translate(18 10) rotate(-2)">
        <rect width="30" height="20" rx="4" fill="#F1F3F4" stroke="#FFFFFF" strokeWidth="2" />
      </g>
      <g transform="translate(34 6)">
        <rect width="42" height="30" rx="7" fill="var(--v-blue-wash)" />
        <circle cx="11" cy="15" r="4.5" fill="#0842A0" />
        <rect x="20" y="8" width="17" height="3" rx="1.5" fill="#0842A0" opacity="0.6" />
        <rect x="20" y="14" width="11" height="3" rx="1.5" fill="#0842A0" opacity="0.35" />
      </g>
    </svg>
  );
}

/** The load-blind mirror (user-ruled 2026-11-05: no more empty-line →
 *  growth — a fetch hold paints blind rows in the REAL grid, and the
 *  truth lands in place; no pager ghost here, the loaded table decides
 *  whether a pager exists at all). cells come pre-shaped per grid. */
function BlindRows({ grid, cells }: { grid: string; cells: () => ReactNode }) {
  return (
    <>
      {[0, 1, 2].map((r) => (
        <div key={r} className={`atabs-row ${grid}`}>
          {cells()}
        </div>
      ))}
    </>
  );
}

export function AdminApprovalsSlot() {
  const [rows, setRows] = useState<CounselorRequestRow[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [armed, setArmed] = useState<{ id: string; action: Decide } | null>(null);
  const [acting, setActing] = useState<string | null>(null);
  const [rowErr, setRowErr] = useState<{ id: string } | null>(null);
  const [page, setPage] = useState(1);
  const live = useRef(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/counselor-requests", { cache: "no-store" });
      setLoadFailed(!res.ok);
      const data = (await res.json().catch(() => null)) as { requests?: CounselorRequestRow[] } | null;
      const list = data?.requests ?? [];
      if (live.current && res.ok) {
        setRows(list);
        setLoadFailed(false);
        setArmed(null);
        // a ruling that shrank the list must not strand the page
        setPage((p) => Math.min(p, pagesOf(list.length)));
      }
    } catch {
      if (live.current) setLoadFailed(true);
    }
  }, []);

  useEffect(() => {
    live.current = true;
    load();
    return () => {
      live.current = false;
    };
  }, [load]);

  async function commit(id: string, action: Decide) {
    setActing(id);
    setRowErr(null);
    try {
      const res = await fetch(`/api/admin/counselor-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok || res.status === 409) {
        // 409 = already_decided — another ruling landed first; the refresh
        // shows the standing decision (the truthful resolution, as the real
        // ApproveRow does).
        await load();
      } else {
        setRowErr({ id });
      }
    } catch {
      setRowErr({ id });
    } finally {
      if (live.current) setActing(null);
    }
  }

  return (
    <section className="atabs-panel" aria-label="Counselor approvals">
      <div className="atabs-panel-head">
        <h2 className="atabs-panel-title">Counselor approvals</h2>
        <ApprovalsArt />
      </div>
      <div className="atabs-heads atabs-appr-grid atabs-label">
        <span>APPLICANT</span>
        <span>EMAIL</span>
        <span>REQUEST</span>
        <span>DECLARED</span>
        <span>TRAIL</span>
        <span>STATUS</span>
        <span></span>
      </div>

      {rows === null && !loadFailed && (
        <BlindRows
          grid="atabs-appr-grid"
          cells={() => (
            <>
              <div className="atabs-cellname">
                <span className="skel" style={{ width: 128, height: 14, display: "inline-block" }} />
              </div>
              <span className="atabs-small atabs-line"><span className="skel" style={{ width: 168, height: 11, display: "inline-block" }} /></span>
              <span><span className="skel" style={{ width: 86, height: 18, display: "inline-block" }} /></span>
              <span><span className="skel" style={{ width: 84, height: 11, display: "inline-block" }} /></span>
              <span><span className="skel" style={{ width: 104, height: 11, display: "inline-block" }} /></span>
              <span><span className="skel" style={{ width: 78, height: 18, display: "inline-block" }} /></span>
              <span><span className="skel" style={{ width: 64, height: 24, display: "inline-block" }} /></span>
            </>
          )}
        />
      )}

      {rows !== null && rows.length === 0 && <p className="atabs-empty">Nothing waiting.</p>}

      {loadFailed && rows === null && <p className="atabs-empty">Not loaded.</p>}

      {rows !== null &&
        slicePage(rows, page).map((r) => {
          const armedAction = armed !== null && armed.id === r.userId ? armed.action : null;
          const decided = r.status !== "pending" && r.decidedAt !== null;
          return (
            <div key={r.userId} className="atabs-row atabs-appr-grid">
              <div className="atabs-cellname">
                <span className="atabs-name">{r.fullName}</span>
              </div>
              <span className="atabs-line atabs-small">{r.email}</span>
              <span>
                <span className="atabs-chip atabs-chip-blue">COUNSELOR</span>
              </span>
              <span className="atabs-meta">{fmtStamp(r.requestedAt)}</span>
              <span className="atabs-meta">
                {decided ? `by ${r.decidedBy ?? "—"}, ${fmtDate(r.decidedAt as string)}` : "—"}
              </span>
              <span>
                <span
                  className={`atabs-chip${
                    r.status === "approved" ? " atabs-chip-ok" : r.status === "pending" ? " atabs-chip-warn" : ""
                  }`}
                >
                  {r.status.toUpperCase()}
                </span>
              </span>
              {r.status === "pending" ? (
                <span className="atabs-acts">
                  {armedAction === "reject" ? (
                    <button type="button" disabled={acting !== null} onClick={() => setArmed(null)}>
                      <X size={14} aria-hidden="true" /> CANCEL
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={armedAction === "approve" ? "atabs-armed" : undefined}
                      disabled={acting !== null}
                      onClick={() =>
                        armedAction === "approve"
                          ? commit(r.userId, "approve")
                          : setArmed({ id: r.userId, action: "approve" })
                      }
                    >
                      {armedAction === "approve" ? (acting === r.userId ? "COMMITTING…" : "CONFIRM — APPROVE") : "APPROVE"}
                    </button>
                  )}
                  {armedAction === "approve" ? (
                    <button type="button" disabled={acting !== null} onClick={() => setArmed(null)}>
                      <X size={14} aria-hidden="true" /> CANCEL
                    </button>
                  ) : armedAction === "reject" ? (
                    <button
                      type="button"
                      className="atabs-armed atabs-armed-reject"
                      disabled={acting !== null}
                      onClick={() => commit(r.userId, "reject")}
                    >
                      {acting === r.userId ? "COMMITTING…" : "CONFIRM — DENY"}
                    </button>
                  ) : (
                    <button type="button" disabled={acting !== null} onClick={() => setArmed({ id: r.userId, action: "reject" })}>
                      DENY
                    </button>
                  )}
                  {rowErr !== null && rowErr.id === r.userId && (
                    <span className="atabs-acterr" role="alert">
                      NOT RECORDED
                    </span>
                  )}
                </span>
              ) : (
                <span />
              )}
            </div>
          );
        })}

      {rows !== null && (
        <Pager page={page} pages={pagesOf(rows.length)} setPage={setPage} />
      )}
    </section>
  );
}

/* ---------- ACCOUNTS ---------- */

function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}
function roleLabel(role: string): string {
  return role === "sysadmin" ? "SYSTEM ADMIN" : role.toUpperCase();
}

export function AdminAccountsSlot() {
  const [rows, setRows] = useState<AccountRow[] | null>(null);
  const [selfUserId, setSelfUserId] = useState<string | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [armed, setArmed] = useState<string | null>(null);
  const [acting, setActing] = useState<string | null>(null);
  const [rowErr, setRowErr] = useState<{ id: string } | null>(null);
  const [page, setPage] = useState(1);
  const live = useRef(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/accounts", { cache: "no-store" });
      const data = (await res.json().catch(() => null)) as
        | { accounts?: AccountRow[]; selfUserId?: string }
        | null;
      const selfId = data?.selfUserId ?? null;
      const list = (data?.accounts ?? []).filter((a) => a.userId !== selfId);
      if (live.current) {
        setLoadFailed(!res.ok);
        if (res.ok) {
          setRows(data?.accounts ?? []);
          setSelfUserId(selfId);
          setRowErr(null);
          // the visible list is the SELF-OMITTED one; clamp against it
          setPage((p) => Math.min(p, pagesOf(list.length)));
        }
      }
    } catch {
      if (live.current) setLoadFailed(true);
    }
  }, []);

  useEffect(() => {
    live.current = true;
    load();
    return () => {
      live.current = false;
    };
  }, [load]);

  // the view's honest list: the viewer's own row never renders (user-
  // ruled 2026-11-05); everything downstream slices THIS list
  const visibleRows =
    rows === null ? null : rows.filter((a) => a.userId !== selfUserId);

  async function toggleActive(userId: string, active: boolean) {
    setActing(userId);
    setRowErr(null);
    try {
      const res = await fetch("/api/admin/accounts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, active }),
      });
      if (res.ok) await load();
      else setRowErr({ id: userId });
    } catch {
      setRowErr({ id: userId });
    } finally {
      if (live.current) setActing(null);
    }
  }

  return (
    <section className="atabs-panel" aria-label="Staff accounts">
      <div className="atabs-panel-head">
        <h2 className="atabs-panel-title">Staff accounts</h2>
        <AccountsArt />
      </div>
      <div className="atabs-heads atabs-acc-grid atabs-label">
        <span>ACCOUNT</span>
        <span>EMAIL</span>
        <span>ROLE</span>
        <span>STATUS</span>
        <span>LAST SIGN-IN</span>
        <span></span>
      </div>

      {visibleRows === null && !loadFailed && (
        <BlindRows
          grid="atabs-acc-grid"
          cells={() => (
            <>
              <div className="atabs-cellname atabs-idcell">
                <span className="skel" style={{ width: 30, height: 30, borderRadius: 8, display: "inline-block" }} />
                <span className="skel" style={{ width: 128, height: 14, marginLeft: 10, display: "inline-block" }} />
              </div>
              <span className="atabs-small atabs-line"><span className="skel" style={{ width: 168, height: 11, display: "inline-block" }} /></span>
              <span><span className="skel" style={{ width: 94, height: 18, display: "inline-block" }} /></span>
              <span><span className="skel" style={{ width: 92, height: 18, display: "inline-block" }} /></span>
              <span><span className="skel" style={{ width: 84, height: 11, display: "inline-block" }} /></span>
              <span><span className="skel" style={{ width: 24, height: 24, borderRadius: 6, display: "inline-block" }} /></span>
            </>
          )}
        />
      )}

      {loadFailed && visibleRows === null && <p className="atabs-empty">Not loaded.</p>}

      {visibleRows !== null &&
        slicePage(visibleRows, page).map((a) => {
          return (
            <div key={a.userId} className={`atabs-row atabs-acc-grid${a.active ? "" : " atabs-off"}`}>
              <div className="atabs-cellname atabs-idcell">
                {a.fullName ? <span className="atabs-ava">{initialsOf(a.fullName)}</span> : null}
                <span className="atabs-recid">
                  <span className="atabs-name">{a.fullName || a.email}</span>
                </span>
              </div>
              <span className="atabs-line atabs-small">{a.email}</span>
              <span>
                <span className={`atabs-chip${a.role === "counselor" ? " atabs-chip-blue" : a.role === "sysadmin" ? " atabs-chip-warn" : ""}`}>
                  {roleLabel(a.role)}
                </span>
              </span>
              <span>
                <span className={`atabs-chip${a.active ? " atabs-chip-ok" : ""}`}>
                  {a.active ? "ACTIVE" : "DEACTIVATED"}
                </span>
              </span>
              <span className="atabs-meta">{a.lastSignInAt ? fmtStamp(a.lastSignInAt) : "—"}</span>

              <span className="atabs-acts">
                {!a.active ? (
                  <button
                    type="button"
                    disabled={acting !== null}
                    onClick={() => toggleActive(a.userId, true)}
                  >
                    REACTIVATE
                  </button>
                ) : armed === a.userId ? (
                  <button
                    type="button"
                    className="atabs-armed atabs-armed-reject"
                    disabled={acting !== null}
                    onClick={() => toggleActive(a.userId, false)}
                  >
                    {acting === a.userId ? "COMMITTING…" : "CONFIRM — DEACTIVATE"}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={acting !== null}
                    onClick={() => setArmed(a.userId)}
                  >
                    DEACTIVATE
                  </button>
                )}
                {armed === a.userId && (
                  <button type="button" disabled={acting !== null} onClick={() => setArmed(null)}>
                    <X size={14} aria-hidden="true" /> CANCEL
                  </button>
                )}
                {rowErr !== null && rowErr.id === a.userId && (
                  <span className="atabs-acterr" role="alert">
                    NOT RECORDED
                  </span>
                )}
              </span>
            </div>
          );
        })}

      {visibleRows !== null && (
        <Pager
          page={page}
          pages={pagesOf(visibleRows.length)}
          setPage={setPage}
        />
      )}
    </section>
  );
}

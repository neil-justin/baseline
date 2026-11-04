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
 *   SIGN-IN · ⋯ kebab. GET /api/admin/accounts on mount; the kebab
 *   popover holds Profile / Deactivate (Reactivate when deactivated); the
 *   soft toggles PATCH { userId, active } then the local list re-reads.
 *   No actions inline in the row (user-ruled); the sysadmin's own row ends
 *   in "—" (no kebab) while the API side stays open. Deactivated names
 *   render struck-through — the honest vacancy.
 *
 * e2e-hook rule: everything here is `atabs-` (admin-tabs.css) — never a
 * hook class (.s-row, .aq-*, .dt-score, .rubric, .cohort*).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Ellipsis, X } from "lucide-react";
import type { CounselorRequestRow } from "@/app/api/admin/counselor-requests/route";

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

export function AdminApprovalsSlot() {
  const [rows, setRows] = useState<CounselorRequestRow[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [armed, setArmed] = useState<{ id: string; action: Decide } | null>(null);
  const [acting, setActing] = useState<string | null>(null);
  const [rowErr, setRowErr] = useState<{ id: string } | null>(null);
  const live = useRef(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/counselor-requests", { cache: "no-store" });
      setLoadFailed(!res.ok);
      const data = (await res.json().catch(() => null)) as { requests?: CounselorRequestRow[] } | null;
      if (live.current && res.ok) {
        setRows(data?.requests ?? []);
        setLoadFailed(false);
        setArmed(null);
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
      <div className="atabs-heads atabs-appr-grid atabs-label">
        <span>APPLICANT</span>
        <span>REQUEST</span>
        <span>DECLARED</span>
        <span>TRAIL</span>
        <span>STATUS</span>
        <span></span>
      </div>

      {rows === null && !loadFailed && <p className="atabs-empty" />}

      {rows !== null && rows.length === 0 && <p className="atabs-empty">Nothing waiting.</p>}

      {loadFailed && rows === null && <p className="atabs-empty">Not loaded.</p>}

      {rows !== null &&
        rows.map((r) => {
          const armedAction = armed !== null && armed.id === r.userId ? armed.action : null;
          const decided = r.status !== "pending" && r.decidedAt !== null;
          return (
            <div key={r.userId} className="atabs-row atabs-appr-grid">
              <div className="atabs-cellname">
                <span className="atabs-name">{r.fullName}</span>
                <span className="atabs-line atabs-small">{r.email}</span>
              </div>
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
  const [openFor, setOpenFor] = useState<string | null>(null);
  const [acting, setActing] = useState<string | null>(null);
  const [rowErr, setRowErr] = useState<{ id: string } | null>(null);
  const live = useRef(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/accounts", { cache: "no-store" });
      const data = (await res.json().catch(() => null)) as
        | { accounts?: AccountRow[]; selfUserId?: string }
        | null;
      if (live.current) {
        setLoadFailed(!res.ok);
        if (res.ok) {
          setRows(data?.accounts ?? []);
          setSelfUserId(data?.selfUserId ?? null);
          setRowErr(null);
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

  // close the popover on any click outside its row's kebab cell
  useEffect(() => {
    if (openFor === null) return;
    const close = (e: MouseEvent) => {
      const hit = e.target instanceof Element && e.target.closest("[data-atabs-kebab]");
      if (!hit) setOpenFor(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [openFor]);

  async function toggleActive(userId: string, active: boolean) {
    setActing(userId);
    setRowErr(null);
    setOpenFor(null);
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
      <div className="atabs-heads atabs-acc-grid atabs-label">
        <span>ACCOUNT</span>
        <span>ROLE</span>
        <span>STATUS</span>
        <span>LAST SIGN-IN</span>
        <span></span>
      </div>

      {rows === null && !loadFailed && <p className="atabs-empty" />}

      {loadFailed && rows === null && <p className="atabs-empty">Not loaded.</p>}

      {rows !== null &&
        rows.map((a) => {
          const isSelf = selfUserId !== null && a.userId === selfUserId;
          return (
            <div key={a.userId} className={`atabs-row atabs-acc-grid${a.active ? "" : " atabs-off"}`}>
              <div className="atabs-cellname atabs-idcell">
                {a.fullName ? <span className="atabs-ava">{initialsOf(a.fullName)}</span> : null}
                <span className="atabs-recid">
                  <span className="atabs-name">{a.fullName || a.email}</span>
                  <span className="atabs-line atabs-small">{a.email}</span>
                </span>
              </div>
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

              {isSelf ? (
                <span className="atabs-meta atabs-kebab-cell">—</span>
              ) : (
                <span className="atabs-kebab-cell" data-atabs-kebab>
                  <button
                    type="button"
                    className="atabs-kebab"
                    aria-label={`Account actions: ${a.fullName || a.email}`}
                    aria-expanded={openFor === a.userId}
                    aria-haspopup="menu"
                    disabled={acting !== null}
                    onClick={() => setOpenFor(openFor === a.userId ? null : a.userId)}
                  >
                    <Ellipsis size={14} aria-hidden="true" />
                  </button>
                  {openFor === a.userId && (
                    <span className="atabs-menu" role="menu">
                      <button type="button" role="menuitem" disabled>
                        Profile
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        disabled={acting !== null}
                        onClick={() => toggleActive(a.userId, !a.active)}
                      >
                        {a.active ? "Deactivate" : "Reactivate"}
                      </button>
                    </span>
                  )}
                </span>
              )}

              {rowErr !== null && rowErr.id === a.userId && (
                <span className="atabs-acterr" role="alert">
                  NOT RECORDED
                </span>
              )}
            </div>
          );
        })}
    </section>
  );
}

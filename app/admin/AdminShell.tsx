"use client";

/**
 * AdminShell — the multi-tab roles console (2026-11-03 admin-replacement
 * Wave 1). The chrome (brand band + sidebar + capped main) lives in
 * AdminVeil — one shared register with the per-student drill-in so the
 * console never unloads between surfaces (user ruling 2026-11-04: the
 * sidebar must surface on the detail, and the header must not disappear
 * behind a skeleton). AdminShell owns only the client tab state + panes.
 *
 * Tabs per role (role law, ruled 2026-11-04 — Round 3 of the admin v9
 * sweep): each role sees ONLY its own surfaces, no spread, no supersets.
 *   counselor → COHORT · AUDIT QUEUE (lands on COHORT)
 *   sysadmin  → APPROVALS · ACCOUNTS (lands on APPROVALS) — no
 *               student-handling surfaces at all.
 * The server page gates the data builds by role: the sysadmin receives
 * rows=null / queue=null (its roster/queue panes are never reachable, and
 * the props stay honestly null rather than being built and shipped for a
 * role that cannot render them).
 *
 * e2e-hook rule (pending round): no hook classes leak into new chrome —
 * everything new is `atabs-` (admin-tabs.css). The sign-out keeps the
 * `.admin-signout` hook in the veil (never a GET link — the prefetched
 * sign-out footgun).
 */
import { useEffect, useState } from "react";

import type { Role } from "@/lib/session";
import type { LiveRow } from "./page";
import type { QueueRow } from "./AuditQueue";
import StudentRow from "./StudentRow";
import AuditQueue from "./AuditQueue";
import { AdminApprovalsSlot, AdminAccountsSlot } from "./slots";
import AdminVeil from "./AdminVeil";
import { adminLandingFor, adminTabsFor, type AdminTabId } from "./tabs";
import Pager from "./Pager";
import { pagesOf, slicePage } from "./pager-math";
import "./admin-tabs.css";

/* ---------- panes ---------- */

/** C1 "the roster watch" — the Cohort tab's own header imagery
 *  (per-tab metaphor law: three overlapping avatar tiles, the front
 *  one in the blue-wash moment = the counselor attending to the
 *  cohort). Deliberately NOT seat-counted — a metaphor, not data. */
function CohortArt() {
  return (
    <svg className="ct-art" width="96" height="48" viewBox="0 0 96 48" aria-hidden="true">
      <g transform="translate(6 12) rotate(-4 13 12)">
        <rect width="26" height="24" rx="7" fill="#F1F3F4" />
        <circle cx="13" cy="9.5" r="3.4" fill="#5F6368" opacity="0.45" />
        <path d="M6.2 19.5a6.8 6.8 0 0 1 13.6 0z" fill="#5F6368" opacity="0.45" />
      </g>
      <g transform="translate(30 8) rotate(3 13 12)">
        <rect width="26" height="24" rx="7" fill="#F1F3F4" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="13" cy="9.5" r="3.4" fill="#5F6368" opacity="0.6" />
        <path d="M6.2 19.5a6.8 6.8 0 0 1 13.6 0z" fill="#5F6368" opacity="0.6" />
      </g>
      <g transform="translate(56 4)">
        <rect width="34" height="30" rx="9" fill="var(--v-blue-wash)" />
        <circle cx="17" cy="11.5" r="4" fill="#0842A0" />
        <path d="M8.2 23.5a8.8 8.8 0 0 1 17.6 0z" fill="#0842A0" />
      </g>
    </svg>
  );
}

/** COHORT — the roster on the console's one register (2026-11-05 one-
 *  register ruling, superseding the Ledger-Table Rule): atabs- grid
 *  rows, its own per-tab art kept, columns per the split ruling
 *  (YEAR/PROGRAM out of the merged sub-line), 10/page pager kept. */
function CohortTable({ rows }: { rows: LiveRow[] }) {
  const [page, setPage] = useState(1);
  return (
    <section className="atabs-panel" aria-label="Cohort roster">
      <div className="atabs-panel-head">
        <h2 className="atabs-panel-title">Cohort roster</h2>
        <CohortArt />
      </div>
      <div className="atabs-heads atabs-cohort-grid atabs-label">
        <span>NAME</span>
        <span className="atabs-col-collapsible">YEAR</span>
        <span className="atabs-col-collapsible">PROGRAM</span>
        <span>TARGET ROLE</span>
        <span>SCORE</span>
        <span>LAST ACTIVE</span>
      </div>
      {slicePage(rows, page).map((r) => (
        <StudentRow
          key={r.id}
          id={r.id}
          isDemo={r.id === "neil"}
          name={r.name}
          year={r.year}
          program={r.program}
          career={r.career}
          score={r.score}
          pending={r.pending}
          belowAvg={r.belowAvg}
          noActivity={r.events === 0}
          active={r.active}
        />
      ))}
      <Pager page={page} pages={pagesOf(rows.length)} setPage={setPage} />
    </section>
  );
}

function Pane({
  tab,
  rows,
  queue,
}: {
  tab: AdminTabId;
  rows: LiveRow[] | null;
  queue: QueueRow[] | null;
}) {
  if (tab === "audit") {
    // Honest guard: a role without the queue build gets nothing faked.
    if (queue === null) return null;
    return <AuditQueue rows={queue} />;
  }
  if (tab === "approvals") return <AdminApprovalsSlot />;
  if (tab === "accounts") return <AdminAccountsSlot />;
  if (rows === null) return null;
  return <CohortTable rows={rows} />;
}

/* ---------- the shell ---------- */

export default function AdminShell({
  role,
  rows,
  queue,
}: {
  role: Role;
  /** null = the server skipped the roster build for this role (sysadmin);
   *  the student-handling tabs aren't rendered for that role anyway. */
  rows: LiveRow[] | null;
  /** null = the server skipped the audit-queue build for this role. */
  queue: QueueRow[] | null;
}) {
  // Audit round 2026-11-06: the tab rides the URL (?tab=…). A refresh or a
  // shared link used to land back on the role's landing tab — the exact
  // "landing-tab bounce" the 2026-11-05 no-reload law bans. Soft history
  // sync only (pushState on navigate) — never a document reload. The URL
  // is read in an effect, NOT the initial state: a window-reading
  // initializer desyncs the server render from hydration whenever the
  // URL carries a tab (hydration-failure round-trip caught by the
  // 2026-11-06 re-audit). One client tick lands on the requested tab.
  const [tab, setTab] = useState<AdminTabId>(() => adminLandingFor(role));
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("tab") as AdminTabId | null;
    if (adminTabsFor(role).some((t) => t.id === v)) setTab(v as AdminTabId);
    // co-op with back/forward: keep the pane honest after popstate
    const onPop = () => {
      const pv = new URLSearchParams(window.location.search).get("tab") as AdminTabId | null;
      if (adminTabsFor(role).some((x) => x.id === pv)) setTab(pv as AdminTabId);
      else setTab(adminLandingFor(role));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [role]);
  const navigate = (t: AdminTabId) => {
    setTab(t);
    const u = new URL(window.location.href);
    if (t === adminLandingFor(role)) u.searchParams.delete("tab");
    else u.searchParams.set("tab", t);
    window.history.pushState({}, "", u);
  };
  const active = adminTabsFor(role).some((t) => t.id === tab)
    ? tab
    : adminLandingFor(role);

  return (
    <AdminVeil role={role} mode="state" active={active} onNavigate={navigate}>
      <div className="atabs-tabpage" key={active}>
        <Pane tab={active} rows={rows} queue={queue} />
      </div>
    </AdminVeil>
  );
}

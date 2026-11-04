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
import { useState } from "react";

import type { Role } from "@/lib/session";
import type { LiveRow } from "./page";
import type { QueueRow } from "./AuditQueue";
import StudentRow from "./StudentRow";
import AuditQueue from "./AuditQueue";
import { AdminApprovalsSlot, AdminAccountsSlot } from "./slots";
import AdminVeil from "./AdminVeil";
import { adminLandingFor, adminTabsFor, type AdminTabId } from "./tabs";
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

/** COHORT — the existing roster table, moved in whole (same grid classes,
 *  same row markup; the hooks stay verbatim). */
function CohortTable({ rows }: { rows: LiveRow[] }) {
  return (
    <section className="panel cohort-table" aria-label="Cohort roster">
      <div className="ct-head">
        <div className="ct-headline">
          <h2 className="ct-title">Cohort roster</h2>
          <p className="ct-meta">{rows.length} students</p>
        </div>
        <CohortArt />
      </div>
      {/* the family ledger register (Ledger-Table Rule): a real table —
          tracked heads, #E8EAED row rules, tabular numerals, hover wash.
          The whole row navigates — no Open column, no progress strip
          (user ruling 2026-11-04: redundant with the row affordance;
          progression detail lives on the per-student surface). */}
      <table className="ct-table">
        <thead>
          <tr>
            <th className="col-name" scope="col">Name</th>
            <th className="col-career" scope="col">Career</th>
            <th className="col-score" scope="col">Score</th>
            <th className="col-active" scope="col">Last active</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <StudentRow
              key={r.id}
              id={r.id}
              isDemo={r.id === "neil"}
              name={r.name}
              sub={r.sub}
              career={r.career}
              score={r.score}
              pending={r.pending}
              belowAvg={r.belowAvg}
              noActivity={r.events === 0}
              active={r.active}
            />
          ))}
        </tbody>
      </table>
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
  const [tab, setTab] = useState<AdminTabId>(() => adminLandingFor(role));
  const active = adminTabsFor(role).some((t) => t.id === tab)
    ? tab
    : adminLandingFor(role);

  return (
    <AdminVeil role={role} mode="state" active={active} onNavigate={setTab}>
      <div className="atabs-tabpage" key={active}>
        <Pane tab={active} rows={rows} queue={queue} />
      </div>
    </AdminVeil>
  );
}

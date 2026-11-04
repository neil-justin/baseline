"use client";

/**
 * AdminShell — the multi-tab roles console (2026-11-03 admin-replacement
 * Wave 1). The approved mockup realm becomes the real /admin chrome:
 * a brand-only 56px header band, a left sidebar of icon+name tab buttons,
 * and a capped content column — bound to the REAL rows + queue the server
 * page builds. The single-page band (proband) and its counters fold away
 * with the wave (approved round 2: the surface is the tables).
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
 * `.admin-signout` hook, re-homed to the sidebar tail as the same POST
 * form (never a GET link — the prefetched sign-out footgun).
 */
import { useState } from "react";

import BrandMark from "../../components/BrandMark";
import type { Role } from "@/lib/session";
import type { LiveRow } from "./page";
import type { QueueRow } from "./AuditQueue";
import StudentRow from "./StudentRow";
import AuditQueue from "./AuditQueue";
import { AdminApprovalsSlot, AdminAccountsSlot } from "./slots";
import { RUBRIC_MAX, type RubricValues } from "./defaults";
import "./admin-tabs.css";

type TabId = "cohort" | "audit" | "approvals" | "accounts";

interface ShellTab {
  id: TabId;
  label: string;
  icon: string;
}

const COUNSELOR_TABS: ShellTab[] = [
  { id: "cohort", label: "Cohort", icon: "group" },
  { id: "audit", label: "Audit queue", icon: "fact_check" },
];

const SYSADMIN_TABS: ShellTab[] = [
  { id: "approvals", label: "Approvals", icon: "how_to_reg" },
  { id: "accounts", label: "Accounts", icon: "manage_accounts" },
];

const NAV_LABEL = {
  counselor: "Counselor console pages",
  sysadmin: "System Admin console pages",
} as const;

/** Landing page per role: the counselor lands home; the sysadmin lands on
 *  the first sysadmin-only page (the mockup mount's law). */
function tabsFor(role: Role): ShellTab[] {
  return role === "sysadmin" ? SYSADMIN_TABS : COUNSELOR_TABS;
}
function landingFor(role: Role): TabId {
  return role === "sysadmin" ? "approvals" : "cohort";
}

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
  ruledByLabel,
}: {
  tab: TabId;
  rows: LiveRow[] | null;
  queue: QueueRow[] | null;
  ruledByLabel: string;
}) {
  if (tab === "audit") {
    // Honest guard: a role without the queue build gets nothing faked.
    if (queue === null) return null;
    return <AuditQueue rows={queue} ruledByLabel={ruledByLabel} />;
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
  ruledByLabel,
}: {
  role: Role;
  /** null = the server skipped the roster build for this role (sysadmin);
   *  the student-handling tabs aren't rendered for that role anyway. */
  rows: LiveRow[] | null;
  /** null = the server skipped the audit-queue build for this role. */
  queue: QueueRow[] | null;
  ruledByLabel: string;
}) {
  const tabs = tabsFor(role);
  const [tab, setTab] = useState<TabId>(() => landingFor(role));
  const active = tabs.some((t) => t.id === tab) ? tab : landingFor(role);

  return (
    <div className="atabs-veil">
      {/* brand-only header band (spans both columns) */}
      <header className="atabs-head" role="banner">
        <div className="atabs-brand">
          <BrandMark size={24} />
          <span className="atabs-word">Baseline</span>
        </div>
      </header>

      {/* the role's pages as sidebar tabs; console controls pinned at the bottom */}
      <aside className="atabs-side">
        <nav className="atabs-sidenav" aria-label={NAV_LABEL[role === "sysadmin" ? "sysadmin" : "counselor"]}>
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={active === t.id ? "on" : ""}
              title={t.label}
              aria-current={active === t.id ? "page" : undefined}
              onClick={() => setTab(t.id)}
            >
              <span className="ms" aria-hidden="true">
                {t.icon}
              </span>
              <span>{t.label}</span>

            </button>
          ))}
        </nav>
        <nav className="atabs-tail" aria-label="Console controls">
          {/* POST, not a GET <Link> — a prefetched GET sign-out would wipe
              the session on visit (e2e-caught footgun; hook stays). */}
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="admin-signout">
              <span className="ms" aria-hidden="true">
                logout
              </span>
              <span>Sign out</span>
            </button>
          </form>
        </nav>
      </aside>

      <main id="main" className="atabs-main">
        <div className="atabs-tabpage" key={active}>
          <Pane tab={active} rows={rows} queue={queue} ruledByLabel={ruledByLabel} />
        </div>
      </main>
    </div>
  );
}

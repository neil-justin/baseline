"use client";

/**
 * AdminShell — the multi-tab roles console (2026-11-03 admin-replacement
 * Wave 1). The approved mockup realm becomes the real /admin chrome:
 * a brand-only 56px header band, a left sidebar of icon+name tab buttons,
 * and a capped content column — bound to the REAL rows + queue the server
 * page builds. The single-page band (proband) and its counters fold away
 * with the wave (approved round 2: the surface is the tables).
 *
 * Tabs per role (mockup law):
 *   counselor → COHORT · AUDIT QUEUE
 *   sysadmin  → COHORT · AUDIT QUEUE · APPROVALS · ACCOUNTS
 * The sysadmin lands on APPROVALS (the first sysadmin-only page, like the
 * mockup mount); APPROVALS + ACCOUNTS are wiring slots for Waves 2–3 —
 * see slots.tsx, one file later waves swap without shell surgery.
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
import StudentRow, { type RowSeg } from "./StudentRow";
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
  ...COUNSELOR_TABS,
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

/* ---------- roster helpers (pure; ride with the table into the shell) ---------- */

function segments(p: RubricValues): RowSeg[] {
  return [
    { weight: RUBRIC_MAX.sp, earn: p.sp[0] / p.sp[1] },
    { weight: RUBRIC_MAX.es, earn: p.es[0] / p.es[1] },
    { weight: RUBRIC_MAX.tp, earn: p.tp[0] / p.tp[1] },
    { weight: RUBRIC_MAX.ar, earn: p.ar[0] / p.ar[1] },
    { weight: RUBRIC_MAX.cc, earn: p.cc[0] / p.cc[1] },
  ];
}

function barAria(name: string, p: RubricValues): string {
  return `${name}'s progress: skill ${p.sp[0]} of ${p.sp[1]}, employability ${p.es[0]} of ${p.es[1]}, training ${p.tp[0]} of ${p.tp[1]}, application readiness ${p.ar[0]} of ${p.ar[1]}, career clarity ${p.cc[0]} of ${p.cc[1]}`;
}

/* ---------- panes ---------- */

/** COHORT — the existing roster table, moved in whole (same grid classes,
 *  same row markup; the hooks stay verbatim). */
function CohortTable({ rows }: { rows: LiveRow[] }) {
  return (
    <section className="panel cohort-table" aria-label="Cohort roster">
      <div className="ct-head">
        <h2 className="ct-title">Cohort roster</h2>
        <p className="ct-legend">
          BAR SEGMENTS SHOW EACH PART&apos;S WEIGHT: <b>SKILL · EMPLOYABILITY · TRAINING · APPLICATION READINESS · CAREER CLARITY</b>
        </p>
      </div>
      <div className="ct-colheads ct-label">
        <span>NAME</span>
        <span>CAREER</span>
        <span>SCORE</span>
        <span>PROGRESS</span>
        <span>LAST ACTIVE</span>
        <span></span>
      </div>

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
          segs={segments(r.parts)}
          active={r.active}
          ariaLabel={barAria(r.name, r.parts)}
        />
      ))}
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
  rows: LiveRow[];
  queue: QueueRow[];
  ruledByLabel: string;
}) {
  if (tab === "audit") return <AuditQueue rows={queue} ruledByLabel={ruledByLabel} />;
  if (tab === "approvals") return <AdminApprovalsSlot />;
  if (tab === "accounts") return <AdminAccountsSlot />;
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
  rows: LiveRow[];
  queue: QueueRow[];
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
        {/* colophon — the honest footer survives the wave hook-and-all */}
        <p className="admin-colophon">
          <span>READ-ONLY COHORT VIEW · EVERY NUMBER COMPUTED FROM REAL STATE, NOTHING PAINTED</span>
          <span>BASELINE · THESIS PROTOTYPE</span>
        </p>
      </main>
    </div>
  );
}

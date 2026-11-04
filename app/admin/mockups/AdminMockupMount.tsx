"use client";

/**
 * mockups/AdminMockupMount.tsx — the hash-gated ROLES mockup realm for /admin
 * (2026-11-03 roles round; feedback round 2: the band and the explanatory
 * chrome are gone — each page is a structured table panel; the mockup
 * notice lives once, in the colophon).
 *
 *   #mockups      → the COUNSELOR console pages
 *   #mockups-sys  → the SYSTEM ADMIN console pages
 */
import { useState } from "react";
import { ACCOUNT_ITEM, AccountPane } from "./account";
import { COUNSELOR_TABS, CounselorPane } from "./counselor";
import { SYSADMIN_TABS, SysadminPane } from "./sysadmin";

export type MockRole = "counselor" | "sysadmin";

const TABS = {
  counselor: COUNSELOR_TABS,
  sysadmin: SYSADMIN_TABS,
} as const;

const NAMES = {
  counselor: "Counselor console",
  sysadmin: "System Admin console",
} as const;

/** Landing page per role: the counselor lands home; the sysadmin lands on
 *  the queue that justifies the split (its first sysadmin-only page). */
const LANDING = {
  counselor: "cohort",
  sysadmin: "approvals",
} as const;

export default function AdminMockupMount({ role }: { role: MockRole }) {
  const tabs = TABS[role];
  const [tab, setTab] = useState<string>(LANDING[role]);
  /* "account" portals outside the role's page tabs (it rides the tail);
     anything else unknown snaps back to the role's landing */
  const isAccount = tab === ACCOUNT_ITEM.id;
  const active = tabs.some((t) => t.id === tab) || isAccount ? tab : LANDING[role];

  return (
    <div className="mk-veil" role="dialog" aria-label="Admin roles design mockup">
      {/* brand-only header band — the student shell's band, nothing else */}
      <header className="mk-head" role="banner">
        <div className="mk-brand">
          <span className="brandmark" aria-hidden="true">
            <i />
          </span>
          <span className="mk-word">Baseline</span>
        </div>
      </header>

      {/* the role's pages as sidebar tabs; realm chrome pinned at the bottom */}
      <aside className="mk-side">
        <nav className="mk-sidenav" aria-label={`${NAMES[role]} pages`}>
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
        <nav className="mk-tail" aria-label="Mockup realm controls">
          {/* the ruled tail slot: Account above the realm controls, the
              same position the real ruling pins it above Sign out */}
          <button
            type="button"
            className={isAccount ? "on" : ""}
            title={ACCOUNT_ITEM.label}
            aria-current={isAccount ? "page" : undefined}
            onClick={() => setTab(ACCOUNT_ITEM.id)}
          >
            <span className="ms" aria-hidden="true">
              {ACCOUNT_ITEM.icon}
            </span>
            <span>{ACCOUNT_ITEM.label}</span>
          </button>
          {role === "counselor" ? (
            <a href="#mockups-sys">
              <span className="ms" aria-hidden="true">
                admin_panel_settings
              </span>
              <span>View as System Admin</span>
            </a>
          ) : (
            <a href="#mockups">
              <span className="ms" aria-hidden="true">
                person
              </span>
              <span>View as Counselor</span>
            </a>
          )}
          <a href="#mkexit">
            <span className="ms" aria-hidden="true">
              close
            </span>
            <span>Close mockup</span>
          </a>
        </nav>
      </aside>

      <main id="main" className="mk-main">
        {isAccount ? (
          <AccountPane role={role} />
        ) : role === "counselor" ? (
          <CounselorPane tab={active} />
        ) : (
          <SysadminPane tab={active} />
        )}
      </main>

      <p className="mk-colophon">
        <span>MOCKUP — PAINTED VALUES — NOTHING PERSISTED</span>
        <span>/admin#mockups, /admin#mockups-sys</span>
      </p>
    </div>
  );
}

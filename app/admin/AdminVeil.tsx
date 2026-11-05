"use client";

/**
 * AdminVeil — the shared console chrome (brand band + sidebar + capped
 * main). One component, two modes:
 *
 *  - "state": the tabbed console's sidebar — buttons driving client tab
 *    state (AdminShell owns that state, passes `onNavigate`).
 *  - "detail": the per-student drill-in rides the SAME veil so the chrome
 *    never unloads between the roster and the detail (user ruling
 *    2026-11-04: the sidebar must surface here, and a row click must not
 *    swallow the console). The nav items render as real Links back to
 *    the console; the visited-from tab carries aria-current.
 *
 * In BOTH modes the chrome is the REAL markup (same classes, same
 * sign-out POST contract, same e2e hook) — which is also why the
 * drill-in's route skeleton clones the whole veil with no flash of
 * missing chrome.
 */
import Link from "next/link";
import { type ReactNode } from "react";

import BrandMark from "../../components/BrandMark";
import type { Role } from "@/lib/session";
import {
  ADMIN_NAV_LABEL,
  adminLandingFor,
  adminTabsFor,
  type AdminTabId,
} from "./tabs";
import "./admin-tabs.css";

export default function AdminVeil({
  role,
  mode = "state",
  active,
  onNavigate,
  children,
}: {
  role: Role;
  mode?: "state" | "detail";
  /** the current tab (state mode) or the tab you came from (detail mode);
   *  "account" marks the self-account page — no console tab carries it */
  active?: AdminTabId | "account";
  /** state mode: the tab-switching handler (onClick) */
  onNavigate?: (id: AdminTabId) => void;
  children: ReactNode;
}) {
  const tabs = adminTabsFor(role);
  const activeId = active ?? adminLandingFor(role);

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
        <nav className="atabs-sidenav" aria-label={ADMIN_NAV_LABEL[role === "sysadmin" ? "sysadmin" : "counselor"]}>
          {tabs.map((t) =>
            mode === "state" && onNavigate ? (
              <button
                key={t.id}
                type="button"
                className={activeId === t.id ? "on" : ""}
                title={t.label}
                aria-current={activeId === t.id ? "page" : undefined}
                onClick={() => onNavigate(t.id)}
              >
                <span className="ms" aria-hidden="true">
                  {t.icon}
                </span>
                <span>{t.label}</span>
              </button>
            ) : (
              <Link
                key={t.id}
                href="/admin"
                className={activeId === t.id ? "on" : ""}
                title={t.label}
                aria-current={activeId === t.id ? "page" : undefined}
              >
                <span className="ms" aria-hidden="true">
                  {t.icon}
                </span>
                <span>{t.label}</span>
              </Link>
            )
          )}
        </nav>
        <nav className="atabs-tail" aria-label="Console controls">
          {/* the self-account page (2026-11-04 ruling: "Account" pinned in
              the console controls, above Sign out) — a ROUTE, not client
              tab state, so it renders as a Link in both veil modes; the
              glyph rides the real shell's subset (Accounts' own face). */}
          <Link
            href="/admin/account"
            className={activeId === "account" ? "atabs-account-link on" : "atabs-account-link"}
            title="Account"
            aria-current={activeId === "account" ? "page" : undefined}
          >
            <span className="ms" aria-hidden="true">
              manage_accounts
            </span>
            <span>Account</span>
          </Link>
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
        {children}
      </main>
    </div>
  );
}

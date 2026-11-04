/**
 * The admin console's tab registry — the single source both the tabbed
 * shell (AdminShell) and the drill-in veil (AdminVeil) render, so the
 * two surfaces never drift apart in chrome.
 *
 * Role law (2026-11-04, Round 3): the counselor owns the student-handling
 * surfaces (Cohort · Audit queue, lands Cohort); the sysadmin owns only
 * account plumbing (Approvals · Accounts, lands Approvals).
 */
import type { Role } from "@/lib/session";

export type AdminTabId = "cohort" | "audit" | "approvals" | "accounts";

export interface AdminShellTab {
  id: AdminTabId;
  label: string;
  icon: string;
}

export const COUNSELOR_TABS: AdminShellTab[] = [
  { id: "cohort", label: "Cohort", icon: "group" },
  { id: "audit", label: "Audit queue", icon: "fact_check" },
];

export const SYSADMIN_TABS: AdminShellTab[] = [
  { id: "approvals", label: "Approvals", icon: "how_to_reg" },
  { id: "accounts", label: "Accounts", icon: "manage_accounts" },
];

export const ADMIN_NAV_LABEL = {
  counselor: "Counselor console pages",
  sysadmin: "System Admin console pages",
} as const;

export function adminTabsFor(role: Role): AdminShellTab[] {
  return role === "sysadmin" ? SYSADMIN_TABS : COUNSELOR_TABS;
}

export function adminLandingFor(role: Role): AdminTabId {
  return role === "sysadmin" ? "approvals" : "cohort";
}

"use client";

/**
 * mockups/counselor.tsx — the COUNSELOR console as a multi-page realm
 * (2026-11-03 roles round; feedback round 2: the cohort and the audit
 * queue, nothing else — the per-student detail moves out of the mockup
 * scope, so the sidebar pages are:
 *   COHORT · AUDIT QUEUE
 * All painted — see pieces.tsx for the honesty law.
 */
import { AuditTab, CohortTab } from "./console-tabs";

export const COUNSELOR_TABS = [
  { id: "cohort", label: "Cohort", icon: "group" },
  { id: "audit", label: "Audit queue", icon: "fact_check" },
] as const;

export function CounselorPane({ tab }: { tab: string }) {
  if (tab === "audit") return <AuditTab />;
  return <CohortTab />;
}

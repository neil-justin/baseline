import type { Score } from "@/lib/engines/score";

/** Props contract between the server page (getStudentView-backed) and CareerClient. */

export interface VerifiedBarData {
  /** display-ready skill name (parentheticals stripped) */
  name: string;
  /** "verified" ·✓ | "checked" ·✓✓ */
  src: string;
}

/**
 * One row of the careers one-list (ruled page architecture, 2026-10-30):
 * the AI-ranked "Best matches for you" lens and the track-filtered
 * "All roles" lens both render THIS dataset — the fit numbers are engine
 * truth (skillsMatch over demonstrated bars only), never painted.
 */
export interface RoleRowData {
  id: string;
  name: string;
  /** college track display label ("Computer & IT" · …) */
  trackLabel: string;
  /** unweighted demonstrated overlap — "x of y" via skillsMatch (locked M3) */
  x: number;
  /** size of the career's skill map */
  y: number;
  /** one-line what-you-do (WHAT trio override → roleSummary) */
  what: string;
  /** why-this-fits for the CURRENT target only (hand-authored trio/fallback) */
  why: string;
  entry: string;
  /** the one row wired to the switch flow (demo beat 6) */
  live: boolean;
  /** the declared target row */
  current: boolean;
  /** provenance of the fit number — empty unless x > 0 */
  confirmed: VerifiedBarData[];
  /** claimed skills that sit on this map (never counted toward matching) */
  selfReported: string[];
  /** role-detail blocks — catalog truth, cited */
  psoc: string;
  majors: string;
  demand: string;
  skillsSummary: string;
}

export interface ReassessRow {
  /** catalog-canonical name (what /api/claim expects) */
  name: string;
  /** prototype display string (may differ, e.g. "Dashboards (Power BI/Tableau)") */
  display: string;
  what: string;
}

export interface CareerCardData {
  id: string;
  name: string;
  what: string;
  why: string;
  strandDisplay: string;
  entry: string;
  closed: number;
  mapSize: number;
  stageOneDone: number;
}

export interface CareerProps {
  /** null = undecided student → the current-career card shows the browse CTA default */
  card: CareerCardData | null;
  /** all proven skills on the profile (verified ·✓ / checked ·✓✓), any career */
  verifiedBars: VerifiedBarData[];
  activeGoalTitle: string | null;
  /** pre-switch bars snapshot: Record<skill, source> — the dip's carried-exclusion basis */
  barsSources: Record<string, string>;
  /** the whole catalog as ranked rows (Best matches + All roles share it) */
  roles: RoleRowData[];
  exploreTotal: number;
  /** zero demonstrated skills → the ranked lens renders its compressed default row */
  zeroConfirmed: boolean;
  /** the switch target's 7-skill map for the quick re-assessment screen (canon: qa) */
  reassess: ReassessRow[];
}

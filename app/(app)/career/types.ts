import type { Score } from "@/lib/engines/score";

/** Props contract between the server page (getStudentView-backed) and CareerClient. */

export interface VerifiedBarData {
  /** display-ready skill name (parentheticals stripped) */
  name: string;
  /** "verified" ·✓ | "checked" ·✓✓ */
  src: string;
}

export interface ExploreRowData {
  id: string;
  name: string;
  /** display strand line, "(any)" → "· open to any strand" */
  strand: string;
  skills: number;
  entry: string;
  /** the one row wired to the switch flow (demo beat 6) */
  live: boolean;
}

export interface MatchRowData {
  id: string;
  name: string;
  /** unweighted demonstrated count (verified ·✓ / checked ·✓✓ only) */
  x: number;
  y: number;
  current: boolean;
  confirmed: VerifiedBarData[];
  selfReported: string[];
  entry: string;
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
  /** null = undecided student → current-career tab shows the explore CTA default */
  card: CareerCardData | null;
  /** all proven skills on the profile (verified ·✓ / checked ·✓✓), any career */
  verifiedBars: VerifiedBarData[];
  activeGoalTitle: string | null;
  /** pre-switch bars snapshot: Record<skill, source> — the dip's carried-exclusion basis */
  barsSources: Record<string, string>;
  explore: ExploreRowData[];
  exploreTotal: number;
  matches: MatchRowData[];
  /** zero confirmed skills → skills-match renders its single compressed default row */
  zeroConfirmed: boolean;
  /** the switch target's 7-skill map for the quick re-assessment screen */
  reassess: ReassessRow[];
}

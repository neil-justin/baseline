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
  /** the declared target row */
  current: boolean;
  /** role-detail blocks — catalog truth, cited */
  psoc: string;
  majors: string;
  demand: string;
  skillsSummary: string;
  /** the role's FULL skill map (catalog order, core-first) — the detail
   *  block renders every skill; overlap with the student's bars highlights
   *  by state (user ruling 2026-11-04: never a "skills in common" dead end) */
  mapSkills: { name: string; display: string }[];
  /** degree-gate truth — the ranked lens lists only roles where this is true;
   *  the gate itself lives in lib/degree-gate.ts */
  degreeAllowed: boolean;
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
  /** persona line print — the college track's TRACK_LABELS label ("Computer & IT") */
  trackLabel: string;
  entry: string;
  closed: number;
  mapSize: number;
  /** Wave-3 C1 — the Skill map bar splits: provenance counts over the SAME
   *  premise as `closed` (all bars on the profile) — verified·✓ + checked·✓✓
   *  share paints solid, self-reported claims paint the hatch segment */
  verified: number;
  claimed: number;
  stageOneDone: number;
}

export interface CareerProps {
  /** null = undecided student → the current-career card shows the browse CTA default */
  card: CareerCardData | null;
  /** all proven skills on the profile (verified ·✓ / checked ·✓✓), any career */
  verifiedBars: VerifiedBarData[];
  /** the student's one ACTIVE training goal (title · linked skill) — the
   *  switch modal shows "goal stays" only when the skill maps onto the
   *  target's skill list; milestone goals (no skill) always carry */
  activeGoal: { title: string; skill: string | null } | null;
  /** pre-switch bars snapshot: Record<skill, source> — the dip's carried-exclusion basis */
  barsSources: Record<string, string>;
  /** the whole catalog as ranked rows (Best matches + All roles share it) */
  roles: RoleRowData[];
  /** zero demonstrated skills → the ranked lens renders its compressed default row */
  zeroConfirmed: boolean;

  /** the signed-in student's intake program (degree-gate feed for the
   *  switch modal — null/"" means no gate) */
  program: string | null;
  /** the switch target's 7-skill map for the quick re-assessment screen (canon: qa) */
  reassess: ReassessRow[];
}

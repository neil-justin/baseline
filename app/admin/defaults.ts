/**
 * Admin shared surface (ADR 0003): the cohort renders REAL students from the
 * store (`db.listStudentStates()`), ordered by COHORT_ORDER — every number
 * and note is computed live from state; nothing is painted.
 *
 * The prototype-era ghost fixtures (karla, bea, …) were retired with the
 * auth migration: they had no auth accounts and no state rows, so they can't
 * appear on a real cohort surface.
 * TODO(admin-round): if display-only note fallbacks are ever wanted for real
 * states that lack them, re-add them here as strings-only fixtures — never
 * a number.
 */

export type RubricPart = [earned: number, max: number];

export interface RubricValues {
  sp: RubricPart; // Skill progress — of 40
  es: RubricPart; // Employability skills — of 25
  tp: RubricPart; // Training progress — of 20
  cc: RubricPart; // Career clarity — of 15
}

/** Locked rubric weights (mirrors lib/engines/score.ts WEIGHTS). */
export const RUBRIC_MAX = { sp: 40, es: 25, tp: 20, cc: 15 } as const;

/**
 * Row ORDER — the admin cohort table order and the prev/next walk. Real
 * state rows inside this order render first; live state ids beyond it (new
 * sign-ups) append after.
 */
export const COHORT_ORDER = ["neil", "karla", "marco", "liza", "bea", "jomar", "rafael"] as const;

/** "G11" → "Grade 11" (live-state grade format → admin meta line). */
export function gradeLabel(grade: string): string {
  const m = grade.match(/^G(\d+)/i);
  return m ? `Grade ${m[1]}` : grade;
}

/** The live cohort, ordered: COHORT_ORDER ids that have real state first,
 * then every other state id (post-migration sign-ups) in store order. */
export function orderCohort(states: Record<string, unknown>): string[] {
  return [
    ...COHORT_ORDER.filter((id) => id in states),
    ...Object.keys(states).filter((id) => !(COHORT_ORDER as readonly string[]).includes(id)),
  ];
}

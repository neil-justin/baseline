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

import { trackLabelOf } from "@/lib/fixtures/catalog";

export type RubricPart = [earned: number, max: number];

export interface RubricValues {
  sp: RubricPart; // Skill progress — of 25
  es: RubricPart; // Employability skills — of 30
  tp: RubricPart; // Training progress — of 20
  ar: RubricPart; // Application readiness — of 15 (null → [0, 15] with "not yet measured")
  cc: RubricPart; // Career clarity — of 10
}

/** Locked rubric weights (mirrors lib/engines/score.ts WEIGHTS — ADR 0002). */
export const RUBRIC_MAX = { es: 30, sp: 25, tp: 20, ar: 15, cc: 10 } as const;

/**
 * Row ORDER — the admin cohort table order and the prev/next walk. Real
 * state rows inside this order render first; live state ids beyond it (new
 * sign-ups) append after.
 */
export const COHORT_ORDER = ["neil", "karla", "marco", "liza", "bea", "jomar", "rafael"] as const;

/** Persona meta line — "4th Year · Computer & IT" from the state's new
 *  vocabulary (yearLevel + the track's TRACK_LABELS label); empty/unknown
 *  parts drop out, all-empty → "—". The SHS-era gradeLabel()/`grade` state
 *  field are gone with the 2026-10-30 sweep. */
export function personaMeta(yearLevel: string, track: string): string {
  const line = [yearLevel, trackLabelOf(track)].filter(Boolean).join(", ");
  return line || "—";
}
/** The live cohort, ordered: COHORT_ORDER ids that have real state first,
 * then every other state id (post-migration sign-ups) in store order. */
export function orderCohort(states: Record<string, unknown>): string[] {
  return [
    ...COHORT_ORDER.filter((id) => id in states),
    ...Object.keys(states).filter((id) => !(COHORT_ORDER as readonly string[]).includes(id)),
  ];
}

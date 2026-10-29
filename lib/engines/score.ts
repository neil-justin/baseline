/**
 * Core rubric engine — ADR 0002 (amended 2026-10-29, interview cut): FIVE
 * channels, **ES 30 / SP 25 / TP 20 / AR 15 / CC 10** (`docs/adr/0002-rubric-re-lock.md`,
 * amendment section). Same half-down rounding convention as before.
 *
 * Channel formulas (recorded bases):
 *  SP = 25 × closed bars ÷ career skill-map size (M4 recipe-A semantics:
 *      self-report claims close a bar, flagged, and count — the live
 *      onboarding baseline IS claims + the verification quiz; demonstrated
 *      provenance always rides the bar itself).
 *  ES = 30 × verified NACE competencies ÷ 7 — the E&I competency is excluded
 *      by recorded choice, so the assessment instrument covers exactly 7
 *      ("7 of 8, E&I excluded", onboarding-college-scope §③). Carried in
 *      `state.competencies`; a state without the field simply hasn't sat the
 *      assessment and reads ES 0 (no invented competency data anywhere).
 *  TP = 20 × closed stage-① "First 30 days" items ÷ 3 (the stage basis is
 *      unchanged; the internship/OJT answer and verified credentials join
 *      this channel as their surfaces ship — ADR 0002 re-anchor).
 *  AR = the resume diagnostic feeds it via `lib/engines/air.ts`
 *      (parse-pass × format-conformance × keyword-coverage, best run
 *      counts — `lib/db/resume-run-store.ts`): AR = 15 × bestAir ÷ 100.
 *      UNMEASURED until a successful diagnostic run exists — an unmeasured
 *      channel contributes no earned points and NEVER a stale zero: the
 *      Score's `ar` is null and honest surfaces say "not yet measured".
 *  CC = three behavior ticks, max 10 (My Plan round Q4b — goals dissolved,
 *      the plan's head item IS the commitment): career picked 1 · plan
 *      started 3 · first item done 6. The splits are an engine design
 *      choice inside the recorded 10% channel (no source quantifies ticks);
 *      progression picked < started < first-done follows the money-beat
 *      anchor ("first item done → CC ticks → score climbs" — My Plan Q4b).
 */

export const WEIGHTS = { es: 30, sp: 25, tp: 20, ar: 15, cc: 10 } as const;

/** The three CC behavior ticks (career picked · plan started · first item done). */
export const CC_TICKS = { picked: 1, started: 3, firstDone: 6 } as const;

/** Assessed NACE competencies — 7 of 8, E&I excluded (recorded). */
export const ASSESSED_COMPETENCIES = 7;

/** Locked TP basis: the stage-① queue is 3 slots (M7). */
export const TP_TARGET = 3;

/** nearest integer, .5 rounds DOWN (locked convention) */
export function roundHalfDown(x: number): number {
  return Math.floor(x + 0.5 - 1e-9);
}

export interface Score {
  sp: number;
  es: number;
  tp: number;
  /** null = not yet measured (no successful resume diagnostic run) */
  ar: number | null;
  cc: number;
  total: number;
}

/** AR channel input — what the resume-run persistence reports. */
export interface ArInput {
  measured: boolean;
  /** best run's airResume, 0–100 (air.ts product × 100) */
  bestAir?: number;
}

/**
 * Every sub-score derives from state; the headline is never painted.
 *  SP = 25 × closed bars ÷ career skill-map size
 *  ES = 30 × verified-of-7 NACE competencies (assessment state)
 *  TP = 20 × stage-① done ÷ 3
 *  CC = picked 2 + started 3 + first item done 5
 *  AR = 15 × bestAir ÷ 100 — or null while unmeasured
 */
export function computeScore(s: {
  bars: Record<string, unknown>;
  careerId: string | null;
  careerSkillCount: number;
  goals: { type: string; status: string }[];
  stageOneDone: number;
  /** step-③ assessment results (7 NACE competencies, E&I excluded) */
  competencies?: Record<string, string>;
  /** resume-diagnostic feed — null/absent = the diagnostic hasn't run */
  ar?: ArInput | null;
}): Score {
  const sp = roundHalfDown((WEIGHTS.sp * Object.keys(s.bars).length) / Math.max(1, s.careerSkillCount));
  const verifiedCompetencies = Object.values(s.competencies ?? {}).filter(
    (v) => v === "verified"
  ).length;
  const es = roundHalfDown((WEIGHTS.es * verifiedCompetencies) / ASSESSED_COMPETENCIES);
  const tp = roundHalfDown((WEIGHTS.tp * s.stageOneDone) / TP_TARGET);
  const ar =
    s.ar?.measured && typeof s.ar.bestAir === "number"
      ? roundHalfDown((WEIGHTS.ar * s.ar.bestAir) / 100)
      : null;
  const cc =
    (s.careerId ? CC_TICKS.picked : 0) +
    (s.goals.length > 0 ? CC_TICKS.started : 0) +
    (s.goals.some((g) => g.status === "completed") ? CC_TICKS.firstDone : 0);
  return { sp, es, tp, ar, cc, total: sp + es + tp + (ar ?? 0) + cc };
}

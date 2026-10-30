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
 *  AR — the 15-point channel splits THREE per-file factors (ADR 0002
 *      amendment 2, ticket 12 — resume 7 / letter 5 / presence 3), each
 *      measured independently, each earning its own fraction:
 *        resume  = 7 × latestAir ÷ 100 via `lib/engines/air.ts` (parse-pass ×
 *                  format-conformance × keyword-coverage; the LATEST full
 *                  attempt counts — ADR 0002 amendment 3, 2026-10-29 user
 *                  ruling — unlimited re-runs, `lib/db/resume-run-store.ts`),
 *        letter  = 5 × letterCheck ÷ 100 (salutation · employer-named-or-
 *                  honestly-skipped · closing ask · 250–500 words × keyword
 *                  alignment vs the Target Role's map),
 *        presence= 3 when the machine-verified (timestamped) declared entry
 *                  exists (Profile → Credentials, 4th kind).
 *      An unmeasured FACTOR contributes nothing (no earned points, no painted
 *      zero); the CHANNEL is null only while NOTHING is measured — the Score's
 *      `ar` is null and honest surfaces say "not yet measured" (grey), never
 *      a stale zero.
 *  CC = three behavior ticks, max 10 (My Plan round Q4b — goals dissolved,
 *      the plan's head item IS the commitment): career picked 1 · plan
 *      started 3 · first item done 6. The splits are an engine design
 *      choice inside the recorded 10% channel (no source quantifies ticks);
 *      progression picked < started < first-done follows the money-beat
 *      anchor ("first item done → CC ticks → score climbs" — My Plan Q4b).
 */

export const WEIGHTS = { es: 30, sp: 25, tp: 20, ar: 15, cc: 10 } as const;

/** The locked 15-point AR split (ADR 0002 amendment 2): resume 7 / letter 5 /
 *  presence 3 — the letter carries the IJSA-2025 predictive weight; presence
 *  is declared + machine-verifiable. Unmeasured factors render grey. */
export const AR_FACTORS = { resume: 7, letter: 5, presence: 3 } as const;

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
  /** earned AR points while ≥1 factor is measured; null = nothing measured yet */
  ar: number | null;
  /** per-factor AR receipts (ticket 12) — unmeasured factors read measured:false */
  arParts: ArParts;
  cc: number;
  total: number;
}

/** One AR factor's receipt (the split's honest partials). */
export interface ArFactorPart {
  measured: boolean;
  earned: number;
  max: number;
}

/** The split's THREE per-factor receipts (ticket 12). */
export type ArParts = { resume: ArFactorPart; letter: ArFactorPart; presence: ArFactorPart };

/** What each AR factor's persistence reports — a factor absent/null = unmeasured. */
export interface ArInput {
  resume?: { measured: boolean; /** the LATEST full attempt's airResume, 0–100 (air.ts product; amendment 3 — latest counts) */ latestAir?: number } | null;
  letter?: { measured: boolean; /** the LATEST letter check's airLetter, 0–100 (per-file latest counts — each AM store keeps its own latest attempt) */ checkScore?: number } | null;
  presence?: { measured: boolean } | null;
}

/**
 * Every sub-score derives from state; the headline is never painted.
 *  SP = 25 × closed bars ÷ career skill-map size
 *  ES = 30 × verified-of-7 NACE competencies (assessment state)
 *  TP = 20 × stage-① done ÷ 3
 *  CC = picked 1 + started 3 + first item done 6
 *  AR = resume 7 + letter 5 + presence 3 — each factor earns only when
 *       measured; the channel reads null while nothing is measured
 */
export function computeScore(s: {
  bars: Record<string, unknown>;
  careerId: string | null;
  careerSkillCount: number;
  goals: { type: string; status: string }[];
  stageOneDone: number;
  /** step-③ assessment results (7 NACE competencies, E&I excluded) */
  competencies?: Record<string, string>;
  /** AR factor feed — per-file persistence reports (absent = unmeasured) */
  ar?: ArInput | null;
}): Score {
  const sp = roundHalfDown((WEIGHTS.sp * Object.keys(s.bars).length) / Math.max(1, s.careerSkillCount));
  const verifiedCompetencies = Object.values(s.competencies ?? {}).filter(
    (v) => v === "verified"
  ).length;
  const es = roundHalfDown((WEIGHTS.es * verifiedCompetencies) / ASSESSED_COMPETENCIES);
  const tp = roundHalfDown((WEIGHTS.tp * s.stageOneDone) / TP_TARGET);

  const resumeIn =
    s.ar?.resume?.measured === true && typeof s.ar.resume.latestAir === "number"
      ? Math.max(0, Math.min(100, s.ar.resume.latestAir))
      : null;
  const resumePart: ArFactorPart = {
    measured: resumeIn !== null,
    earned: resumeIn !== null ? roundHalfDown((AR_FACTORS.resume * resumeIn) / 100) : 0,
    max: AR_FACTORS.resume,
  };
  const letterIn =
    s.ar?.letter?.measured === true && typeof s.ar.letter.checkScore === "number"
      ? Math.max(0, Math.min(100, s.ar.letter.checkScore))
      : null;
  const letterPart: ArFactorPart = {
    measured: letterIn !== null,
    earned: letterIn !== null ? roundHalfDown((AR_FACTORS.letter * letterIn) / 100) : 0,
    max: AR_FACTORS.letter,
  };
  const presencePart: ArFactorPart = {
    measured: s.ar?.presence?.measured === true,
    earned: s.ar?.presence?.measured === true ? AR_FACTORS.presence : 0,
    max: AR_FACTORS.presence,
  };
  const arParts: ArParts = { resume: resumePart, letter: letterPart, presence: presencePart };
  const anyMeasured = resumePart.measured || letterPart.measured || presencePart.measured;
  const ar = anyMeasured
    ? resumePart.earned + letterPart.earned + presencePart.earned
    : null;

  const cc =
    (s.careerId ? CC_TICKS.picked : 0) +
    (s.goals.length > 0 ? CC_TICKS.started : 0) +
    (s.goals.some((g) => g.status === "completed") ? CC_TICKS.firstDone : 0);
  return { sp, es, tp, ar, arParts, cc, total: sp + es + tp + (ar ?? 0) + cc };
}

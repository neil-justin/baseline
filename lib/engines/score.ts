/**
 * Core rubric engine — LOCKED: SP 40 / ES 25 / TP 20 / CC 15 (`_fixture-math.md`).
 *
 * AIR_resume integration point (2026-10-28 dispatch, round 6a): the resume
 * diagnostic computes its channel component deterministically in
 * `lib/engines/air.ts` (parse-pass gate × format-conformance × keyword
 * coverage; persisted best-run semantics). It is deliberately NOT wired in
 * here — the 5-channel score rework (ES 30 / SP 25 / AIR 20 / TP 15 / CC 10)
 * is a separate round; at rework time, fold the student's best AIR_resume
 * into the AIR channel. Until then this file keeps the locked SHS weights.
 */

export const WEIGHTS = { sp: 40, es: 25, tp: 20, cc: 15 } as const;

/** nearest integer, .5 rounds DOWN (locked convention) */
export function roundHalfDown(x: number): number {
  return Math.floor(x + 0.5 - 1e-9);
}

export interface Score {
  sp: number;
  es: number;
  tp: number;
  cc: number;
  total: number;
}

/**
 * Every sub-score derives from state; the headline is never painted.
 *  SP = 40 × closed bars ÷ career skill-map size
 *  ES = 0 for the entire demo (scenario battery is post-defense)
 *  TP = 20 × stage-① done ÷ 3
 *  CC = decided 5 + ≥1 active Training goal 5 + ≥1 completed Training goal 5
 */
export function computeScore(s: {
  bars: Record<string, unknown>;
  careerId: string | null;
  careerSkillCount: number;
  goals: { type: string; status: string }[];
  stageOneDone: number;
}): Score {
  const sp = roundHalfDown((WEIGHTS.sp * Object.keys(s.bars).length) / Math.max(1, s.careerSkillCount));
  const es = 0;
  const tp = roundHalfDown((WEIGHTS.tp * s.stageOneDone) / 3);
  const cc =
    (s.careerId ? 5 : 0) +
    (s.goals.some((g) => g.type === "training" && g.status === "active") ? 5 : 0) +
    (s.goals.some((g) => g.type === "training" && g.status === "completed") ? 5 : 0);
  return { sp, es, tp, cc, total: sp + es + tp + cc };
}

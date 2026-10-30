import type { StudentState, Career } from "@/lib/types";
import { computeScore, WEIGHTS, type ArInput, type Score } from "./score";

/**
 * Segmented-bar parts (the ADR 0002 five-channel proportions).
 * Display order stays the historical SP · ES · TP · AR · CC (the dashboard's
 * sub-rows read top-down in this order); the ADR's ES 30 / SP 25 / TP 20 /
 * AR 15 / CC 10 listing is the weight legend, not a render order.
 * AR's earned fraction fills as its THREE per-file factors land (resume 7 /
 * letter 5 / presence 3); the part carries `unmeasured` = true only while
 * NOTHING is measured — surfaces show "not yet measured" (grey), never a
 * painted zero-bar lie about measurement. Partial factors read through
 * `scoreView().arFactors` (engine receipts, per-file honest).
 */
export function rubricParts(score: Score) {
  return [
    { pct: WEIGHTS.sp, earnedFrac: score.sp / WEIGHTS.sp },
    { pct: WEIGHTS.es, earnedFrac: score.es / WEIGHTS.es },
    { pct: WEIGHTS.tp, earnedFrac: score.tp / WEIGHTS.tp },
    {
      pct: WEIGHTS.ar,
      earnedFrac: score.ar === null ? 0 : score.ar / WEIGHTS.ar,
      unmeasured: score.ar === null,
    },
    { pct: WEIGHTS.cc, earnedFrac: score.cc / WEIGHTS.cc },
  ];
}

/** Everything a surface needs to read out a student's state truthfully. */
export function scoreView(career: Career, s: StudentState, ar?: ArInput | null) {
  const score = computeScore({
    bars: s.bars,
    careerId: s.careerId,
    careerSkillCount: career.skills.length,
    goals: s.goals,
    stageOneDone: s.stageOneDone,
    competencies: s.competencies ?? {},
    ar,
  });
  const goalActive = s.goals.find((g) => g.type === "training" && g.status === "active") ?? null;
  const goalCompleted = s.goals.find((g) => g.type === "training" && g.status === "completed") ?? null;
  const esVerified = Object.values(s.competencies ?? {}).filter((v) => v === "verified").length;
  return {
    ...score,
    closed: Object.keys(s.bars).length,
    mapSize: career.skills.length,
    stageOne: { done: s.stageOneDone, target: 3 },
    goalActive,
    goalCompleted,
    /** ES carrier receipt — "X of 7 competencies verified ·✓" */
    esVerified,
    ccPicked: s.careerId !== null,
    ccStarted: s.goals.length > 0,
    /** any completed plan item — the "first item done" tick (My Plan Q4b) */
    ccFirstDone: s.goals.some((g) => g.status === "completed"),
    arMeasured: score.ar !== null,
    /** AR split receipts (ticket 12): one row per factor — resume/letter/presence */
    arFactors: score.arParts,
    /** every AR factor measured — the channel's 15 could read complete */
    arComplete:
      score.arParts.resume.measured &&
      score.arParts.letter.measured &&
      score.arParts.presence.measured,
    parts: rubricParts(score),
  };
}

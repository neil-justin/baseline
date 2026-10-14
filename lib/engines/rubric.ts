import type { StudentState, Career } from "@/lib/types";
import { computeScore, WEIGHTS, type Score } from "./score";

/** Segmented-bar parts (flattened to the locked 40/25/20/15 proportions). */
export function rubricParts(score: Score) {
  return [
    { pct: WEIGHTS.sp, earnedFrac: score.sp / WEIGHTS.sp },
    { pct: WEIGHTS.es, earnedFrac: score.es / WEIGHTS.es },
    { pct: WEIGHTS.tp, earnedFrac: score.tp / WEIGHTS.tp },
    { pct: WEIGHTS.cc, earnedFrac: score.cc / WEIGHTS.cc },
  ];
}

/** Everything a surface needs to read out Neil's state truthfully. */
export function scoreView(career: Career, s: StudentState) {
  const score = computeScore({
    bars: s.bars,
    careerId: s.careerId,
    careerSkillCount: career.skills.length,
    goals: s.goals,
    stageOneDone: s.stageOneDone,
  });
  const goalActive = s.goals.find((g) => g.type === "training" && g.status === "active") ?? null;
  const goalCompleted = s.goals.find((g) => g.type === "training" && g.status === "completed") ?? null;
  return {
    ...score,
    closed: Object.keys(s.bars).length,
    mapSize: career.skills.length,
    stageOne: { done: s.stageOneDone, target: 3 },
    goalActive,
    goalCompleted,
    parts: rubricParts(score),
  };
}

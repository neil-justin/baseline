import type { StudentState } from "@/lib/types";

/**
 * Neil — canon demo seed (beat-5 state). Canon: `_fixture-math.md` (numbers
 * LOCKED: 40 seed → 10 dip → 33 re-assessment → 51 money shot).
 *
 * Catalog-round 9 (2026-10-29): the catalog recomposed to the college roster —
 * Neil's target career is now roster 2.1 "Associate Software Developer" (id
 * `swd`) and the switch walk runs to roster 2.2 "Software QA Analyst" (id
 * `qa`). SKILL NAMES were re-keyed to the verbatim PSF-SDS maps (seed
 * adjustment, sanctioned); the NUMBERS hold exactly: 6 of 8 bars closed →
 * SP 30; the 7-row QA map keeps 4/7 → 23 and 5/7 → 29 (round-half-down).
 */
export const NEIL_SEED: StudentState = {
  id: "neil",
  name: "Neil",
  grade: "G11",
  strand: "Computer & IT",
  careerId: "swd",
  // Beat-5 canon: 6 of 8 claims closed; SQL-design + Business-needs upgraded
  // to ·✓ by the verification mini-quiz (self-report counts toward bars per
  // locked M4 semantics — Recipe A).
  bars: {
    "Applications Development": { source: "claimed" },
    "Applications Support and Enhancement": { source: "claimed" },
    "Agile Software Development": { source: "claimed" },
    "Data Design / SQL + data modeling": { source: "verified" },
    "Business Needs Analysis": { source: "verified" },
    "Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Self Management (Enabling Skills, Basic/Intermediate)": {
      source: "claimed",
    },
  },
  goals: [
    {
      id: "goal-python",
      title: "Finish the Python basics course",
      type: "training",
      status: "active",
      resourceId: "res-python-basics",
      skill: "Applications Development",
    },
  ],
  // Stage ① snapshot at onboarding re-rank: open = secure-coding, Linux/web
  // deployment (the six others are closed) — ranked open queue; none closed
  // → 0 of 3.
  stageOneDone: 0,
  stageOneQueue: ["Secure-coding practices", "Linux + web deployment basics"],
  softSkills: {
    Teamwork: "Okay",
    Communication: "Room to grow",
    "Problem-solving": "Strong",
  },
  decisions: { verifiedTransferred: [] },
  events: [
    {
      date: "2026-10-17 09:05",
      kind: "goal-set",
      detail: "Goal set — Finish the Python basics course",
    },
  ],
};

/** Beat-6 switch → quick re-assessment (3 self-claims + Business Needs Analysis ·✓ transfers). */
export function applyReassessment(s: StudentState): StudentState {
  return {
    ...s,
    bars: {
      "Business Needs Analysis": { source: "verified" },
      "Test Planning": { source: "claimed" },
      "Defect management": { source: "claimed" },
      "Applications Support and Enhancement": { source: "claimed" },
    },
    stageOneDone: 0,
    // re-rank at re-assessment: open = software testing (free, stable-first),
    // quality standards, enabling bundle (canon beat-7 stage-① queue)
    stageOneQueue: [
      "Software Testing",
      "Quality Assurance / Quality Standards",
      "Customer Orientation · Digital Fluency · Learning Agility · Sense Making · Problem Solving (Enabling)",
    ],
  };
}

/** Beat-7 money shot: software-testing check passes → ·✓✓ + goal auto-completes. */
export function applyMoneyShot(s: StudentState): StudentState {
  return {
    ...s,
    bars: {
      ...s.bars,
      "Software Testing": { source: "checked" },
    },
    goals: s.goals.map((g) =>
      g.id === "goal-qa-testing"
        ? { ...g, status: "completed" as const, completedAt: "2026-10-17 09:41" }
        : g
    ),
    stageOneDone: s.stageOneDone + 1,
  };
}

/** QA goals: the switch-suggested goal (deferred state until money shot). */
export function withQaGoal(s: StudentState): StudentState {
  return {
    ...s,
    goals: [
      ...s.goals,
      {
        id: "goal-qa-testing",
        title: "Build my first test plan",
        type: "training",
        status: "active",
        resourceId: "res-qa-testing",
        skill: "Software Testing",
      },
    ],
  };
}

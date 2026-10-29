import type { StudentState } from "@/lib/types";

/**
 * Neil — canon demo seed (beat-5 state, ADR 0002 five-channel re-lock).
 * Canon decomposition (self-consistent, computed — see
 * `scripts/verify-fixtures.test.ts`, which owns these numbers):
 *
 *   ES 17 — 4 of 7 NACE competencies verified ·✓ by the step-③ assessment
 *   (round-half-down of 30 × 4/7 = 17.14 → 17). The competency names are the
 *   app-facing NACE list minus E&I ("Respecting differences" — excluded by
 *   recorded choice in PRODUCT.md: "NACE 7/8, E&I excluded"); "verified"
 *   marks what the assessment's verification confirmed, the rest sat
 *   claimed. The unscored framing probe below is NOT the assessment — it
 *   never feeds ES.
 *
 *   SP 19 — 6 of 8 closed bars (nearest-integer, .5 down: 25 × 6/8 = 18.75
 *   → 19): M4 recipe-A semantics carried through the catalog round
 *   (self-report counts toward bars, flagged). Verified bars: the canon
 *   quiz's "2 of 5 confirmed" (Data Design / SQL + Business Needs Analysis);
 *   the other four are self-reported claims. The demo walk replays
 *   onboarding over this seed and lands on the same state (chooseCareer
 *   wipes bars; the walk's OB-3b claims + quiz re-close exactly these six).
 *
 *   TP 0 — internship noted but NOT evidenced (the intake data point is
 *   pending evidence; no internship state exists yet), and the stage-①
 *   queue stands at 0 of 3. Honest zero — TP moves with evidence.
 *
 *   CC 4 — career picked (1) + plan started (3); the first plan item is
 *   still pending (the Python course, act as the committed head item).
 *
 *   AR — UNMEASURED (no resume diagnostic run): contributes no points and
 *   no painted row; surfaces say "not yet measured" until Prep runs.
 *
 *   Composite 40 = 17 + 19 + 0 + 4. The demo walk arc: 40 → dip 21 →
 *   recovered 35 → money shot 52 on the new channel maxes (ES 30 / SP 25 /
 *   TP 20 / AR 15 / CC 10).
 *
 * Catalog-round 9 (2026-10-29): the catalog recomposed to the college roster —
 * Neil's target career is roster 2.1 "Associate Software Developer" (id
 * `swd`) and the switch walk runs to roster 2.2 "Software QA Analyst" (id
 * `qa`). SKILL NAMES were re-keyed to the verbatim PSF-SDS maps (seed
 * adjustment, sanctioned); the NUMBERS hold exactly: 6 of 8 bars closed.
 */
export const NEIL_SEED: StudentState = {
  id: "neil",
  name: "Neil",
  grade: "G11",
  strand: "Computer & IT",
  careerId: "swd",
  // Step-③ assessment (ES carrier): 4 of 7 verified ·✓ → 30×4/7 = 17
  competencies: {
    Communicating: "verified",
    Teamwork: "verified",
    "Problem-solving": "verified",
    "Critical thinking": "verified",
    Professionalism: "claimed",
    Leadership: "claimed",
    "Growing your career": "claimed",
  },
  // Beat-5 canon: 6 of 8 bars closed → SP = 25×6/8 = 18.75 → 19 (nearest,
  // .5 down); SQL-design + Business-needs upgraded to ·✓ by the verification
  // mini-quiz (self-report counts toward bars per locked M4 semantics —
  // Recipe A). Seed CC: career picked (1) + plan started (3) = 4.
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
  // → 0 of 3. TP = 0 (internship noted, not evidenced — pending its proof).
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

/** Beat-7 money shot: software-testing check passes → ✓✓ + step auto-completes → CC's first-item tick. */
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

/** QA plan steps: the switch-suggested step (deferred state until money shot). */
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

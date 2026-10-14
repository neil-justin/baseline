import type { StudentState } from "@/lib/types";

/**
 * Neil — Grade 11, STEM, undecided cold start. Canon: `_fixture-math.md`.
 * The tracer seeds Neil at the END of onboarding (beat-5 state) so the app's
 * surfaces compute live from a real state machine; onboarding wiring (agent
 * task 8) plays the beats earlier in the flow.
 */
export const NEIL_SEED: StudentState = {
  id: "neil",
  name: "Neil",
  grade: "G11",
  strand: "STEM",
  careerId: "swd",
  // Beat-5 canon: 6 of 8 claims closed; SQL + Git upgraded to ·✓ by the quiz.
  // (self-report counts toward bars per locked M4 semantics — Recipe A)
  bars: {
    "Programming logic (Python/Java)": { source: "claimed" },
    SQL: { source: "verified" },
    "Git (version control)": { source: "verified" },
    Debugging: { source: "claimed" },
    "Agile teamwork": { source: "claimed" },
    "Technical documentation": { source: "claimed" },
  },
  goals: [
    {
      id: "goal-python",
      title: "Finish the Python basics course",
      type: "training",
      status: "active",
      resourceId: "res-python-basics",
      skill: "Programming logic (Python/Java)",
    },
  ],
  // Stage ① snapshot at onboarding re-rank: top-3 open = programming logic (core ×3
  // first), API basics, unit testing — none closed → 0 of 3.
  stageOneDone: 0,
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

/** Beat-6 switch → quick re-assessment (3 self-claims + SQL ·✓ transfers). */
export function applyReassessment(s: StudentState): StudentState {
  return {
    ...s,
    bars: {
      SQL: { source: "verified" },
      Spreadsheets: { source: "claimed" },
      "Data cleaning": { source: "claimed" },
      "Basic statistics": { source: "claimed" },
    },
    stageOneDone: 0,
  };
}

/** Beat-7 money shot: dashboards check passes → ·✓✓ + goal auto-completes. */
export function applyMoneyShot(s: StudentState): StudentState {
  return {
    ...s,
    bars: {
      ...s.bars,
      "Dashboards (Power BI)": { source: "checked" },
    },
    goals: s.goals.map((g) =>
      g.id === "goal-da-dashboard"
        ? { ...g, status: "completed" as const, completedAt: "2026-10-17 09:41" }
        : g
    ),
    stageOneDone: s.stageOneDone + 1,
  };
}

/** DA goals: the switch-suggested goal (deferred state until money shot). */
export function withDaGoal(s: StudentState): StudentState {
  return {
    ...s,
    goals: [
      ...s.goals,
      {
        id: "goal-da-dashboard",
        title: "Build my first dashboard",
        type: "training",
        status: "active",
        resourceId: "res-powerbi-dashboards",
        skill: "Dashboards (Power BI)",
      },
    ],
  };
}

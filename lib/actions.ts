import type { Resource, StudentState, Goal } from "@/lib/types";
import type { Career } from "@/lib/types";
import { getCareer } from "@/lib/fixtures/catalog";
import { getCheck } from "@/lib/fixtures/checks";
import { RESOURCES } from "@/lib/fixtures/resources";
import { openSkills, stageOne } from "@/lib/engines/gaps";

/**
 * State actions — every demo mutation flows through here (routes are thin).
 * Locked semantics live in features.md §4: switch preserves ·✓ skills + goals
 * and resets downstream; comprehension checks gate credit; training goals
 * auto-complete from check events.
 */

export type ActionResult = { state: StudentState; note?: string; error?: string };

const nowStamp = () => "2026-10-17"; // demo day stamp; Progress/admin display dates

function requeueStageOne(state: StudentState, career: Career): StudentState {
  const open = openSkills(career, state.bars);
  const { queue } = stageOne(career, open);
  return { ...state, stageOneQueue: queue };
}

export function setStrand(state: StudentState, strand: string): ActionResult {
  return { state: { ...state, strand } };
}

export function chooseCareer(state: StudentState, careerId: string): ActionResult {
  const career = getCareer(careerId);
  if (!career) return { state, error: "unknown career" };
  const next = requeueStageOne({ ...state, careerId, stageOneDone: 0, bars: {} }, career);
  return {
    state: next,
    note: `career set — ${career.name}`,
  };
}

export function switchCareer(state: StudentState, toId: string): ActionResult {
  const to = getCareer(toId);
  const from = getCareer(state.careerId);
  if (!to || !from || to.id === from.id) return { state, error: "invalid switch" };
  // locked: verified skills + goals survive; bars/score reset downstream.
  // CANON (_fixture-math.md beat 6): the dip state reads SP 0 — "0 closed bars".
  // The carried ·✓ set re-registers at the quick re-assessment (claimAll),
  // not at switch time; `decisions.verifiedTransferred` records what survives.
  const transferred = Object.entries(state.bars)
    .filter(([, v]) => v.source === "verified")
    .map(([name]) => name)
    .filter((name) => to.skills.some((s) => s.name === name));
  const next = requeueStageOne(
    {
      ...state,
      careerId: toId,
      bars: {},
      stageOneDone: 0,
      decisions: { verifiedTransferred: transferred },
      events: [
        ...state.events,
        { date: nowStamp(), kind: "career-switched", detail: `Switched ${from.name} → ${to.name} — verified skills and goals carried over; other bars reset.` },
      ],
    },
    to
  );
  return { state: next, note: `switched to ${to.name}` };
}

export function claimSkill(state: StudentState, skill: string, level: "confident" | "kindof" | "notyet"): ActionResult {
  const career = getCareer(state.careerId);
  if (!career) return { state, error: "no career yet" };
  if (!career.skills.some((s) => s.name === skill)) return { state, error: "skill not on map" };
  const bars = { ...state.bars };
  if (level === "confident") bars[skill] = { source: "claimed" };
  else delete bars[skill]; // honest baseline: kind-of/not-yet never hold a bar
  const next = requeueStageOne({ ...state, bars }, career);
  return { state: next };
}

/** Batch form for the onboarding self-report screen (one POST). Also the
 *  quick re-assessment after a career switch: the carried ·✓ set re-registers
 *  here (canon beat-6→ re-assessment), before the batch claims land. */
export function claimAll(state: StudentState, claims: { skill: string; level: "confident" | "kindof" | "notyet" }[]): ActionResult {
  let next = { ...state };
  // re-register transferred verified skills on the new map (switch hand-off)
  for (const skill of state.decisions.verifiedTransferred) {
    next = { ...next, bars: { ...next.bars, [skill]: { source: "verified" as const } } };
  }
  for (const c of claims) {
    const r = claimSkill(next, c.skill, c.level);
    if (r.error) return r;
    next = r.state;
  }
  const career = getCareer(next.careerId)!;
  // claims close the baseline — the last full re-rank point of onboarding
  const after = requeueStageOne({ ...next, stageOneDone: 0 }, career);
  return { state: after, note: `${claims.filter((c) => c.level === "confident").length} of ${career.skills.length} skills on your baseline` };
}

export function markVerified(state: StudentState, skill: string): ActionResult {
  const career = getCareer(state.careerId);
  if (!career || !career.skills.some((s) => s.name === skill)) return { state, error: "skill not on map" };
  const bars = { ...state.bars };
  bars[skill] = { source: "verified" };
  // re-rank DOES NOT fire on verification at cold start (beat ordering locked)
  return { state: { ...state, bars }, note: `${skill} confirmed ·✓` };
}

export function setGoal(state: StudentState, goal: Partial<Goal>): ActionResult {
  // idempotency: replaying onboarding over a state that already carries this
  // resource's training goal must not double-append (demo-replay seam)
  const existing = state.goals.find(
    (g) => g.type === "training" && g.resourceId && g.resourceId === goal.resourceId
  );
  if (existing) {
    return {
      state,
      note: "Goal set. It's now on your Progress page.",
    };
  }
  const id = goal.id ?? `goal-${state.goals.length + 1}-${Date.now() % 10000}`;
  const g: Goal = {
    id,
    title: goal.title ?? "My goal",
    type: goal.type ?? "training",
    status: goal.status ?? "active",
    resourceId: goal.resourceId,
    skill: goal.skill,
  };
  return {
    state: {
      ...state,
      goals: [...state.goals, g],
      events: [...state.events, { date: nowStamp(), kind: "goal-set", detail: `Goal set — ${g.title}` }],
    },
    note: "Goal set. It's now on your Progress page.",
  };
}

/**
 * Comprehension check submit — THE money-shot gate (pass ≥ 4/5 locked).
 * Pass → resource's skills close as ·✓checked → linked Training goal
 * auto-completes → stage-① progress ticks → score recompute downstream.
 */
export function submitCheck(state: StudentState, resourceId: string, answers: number[]): ActionResult {
  const questions = getCheck(resourceId);
  if (!questions) return { state, error: "no check for resource" };
  if (answers.length !== questions.length) return { state, error: "answers incomplete" };
  const correct = questions.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0);
  const passed = correct >= 4; // LOCKED pass mark
  if (!passed) {
    return { state, note: `not passed — ${correct} of 5 (need 4)` };
  }
  const career = getCareer(state.careerId)!;
  const checkResource = RESOURCES.find((r: Resource) => r.id === resourceId);
  let next: StudentState = { ...state, bars: { ...state.bars } };
  const closedNow: string[] = [];
  for (const skill of checkResource?.skillsAddressed ?? []) {
    if (career.skills.some((s) => s.name === skill) && !(skill in next.bars)) {
      next.bars[skill] = { source: "checked" };
      closedNow.push(skill);
    }
  }
  // stage-① progress: member of the current queue closing ticks 1 of 3
  const queue = next.stageOneQueue ?? stageOne(career, openSkills(career, next.bars)).queue;
  const closedFromQueue = queue.filter((q) => closedNow.includes(q));
  next.stageOneDone = next.stageOneDone + closedFromQueue.length;
  next.stageOneQueue = queue.filter((q) => !closedNow.includes(q));

  // auto-complete linked Training goals (locked M6)
  const goals = next.goals.map((g) => {
    if (g.type === "training" && g.status === "active" && g.resourceId === resourceId) {
      return { ...g, status: "completed" as const, completedAt: nowStamp() };
    }
    return g;
  });
  next.goals = goals;
  const completedTitles = goals
    .filter((g) => g.status === "completed" && g.resourceId === resourceId)
    .map((g) => g.title);
  next.events = [
    ...next.events,
    { date: nowStamp(), kind: "check-passed", detail: `Check passed (${correct} of 5) — ${checkResource?.title ?? resourceId}`, source: "checked" },
    ...closedNow.map((skill) => ({ date: nowStamp(), kind: "bar-closed" as const, detail: `${skill} closed ·✓✓`, source: "checked" as const })),
    ...completedTitles.map((t) => ({ date: nowStamp(), kind: "goal-completed" as const, detail: `Training goal auto-completed — ${t}` })),
  ];
  return { state: next, note: "passed" };
}

function RESOURCES_LOOKUP(resourceId: string): Resource | undefined {
  return RESOURCES.find((r) => r.id === resourceId);
}

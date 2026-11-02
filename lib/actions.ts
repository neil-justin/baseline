import type { Resource, StudentState, Goal } from "@/lib/types";
import type { Career } from "@/lib/types";
import type { CredentialRow } from "@/lib/db/credential-store";
import { getCareer } from "@/lib/fixtures/catalog";
import { getCheck } from "@/lib/fixtures/checks";
import { RESOURCES } from "@/lib/fixtures/resources";
import {
  INSTRUMENT_MCQ_BY_ID,
  INSTRUMENT_MCQ_IDS,
  INSTRUMENT_STATEMENT_IDS,
  gradeInstrumentAnswers,
} from "@/lib/fixtures/instrument";
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

export function setTrack(state: StudentState, track: string): ActionResult {
  return { state: { ...state, track } };
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
  // locked: skills proven in ANY role survive via provenArchive; the carried
  // ·✓ set re-registers at the quick re-assessment (claimAll), not at switch
  // time. CANON (_fixture-math.md beat 6): the dip state reads SP 0 —
  // "0 closed bars".
  const proven: Record<string, { source: "verified" | "checked" }> = { ...state.provenArchive };
  for (const [name, v] of Object.entries(state.bars)) {
    if (v.source === "verified" || v.source === "checked") proven[name] = { source: v.source };
  }
  const transferred = Object.entries(proven)
    .filter(([name, v]) => v.source === "verified")
    .map(([name]) => name)
    .filter((name) => to.skills.some((s) => s.name === name));
  const next = requeueStageOne(
    {
      ...state,
      careerId: toId,
      bars: {},
      provenArchive: proven,
      stageOneDone: 0,
      decisions: { verifiedTransferred: transferred },
      events: [
        ...state.events,
        { date: nowStamp(), kind: "career-switched", detail: `Switched ${from.name} → ${to.name} — proven skills kept in the record; rated baselines reset.` },
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
  else if (bars[skill]?.source === "verified") {
    // a verified bar is earned fact — an "not yet" rating can't un-earn it
    // (the UI keeps proven skills locked out of the rating set)
  } else delete bars[skill]; // honest baseline: kind-of/not-yet never hold a bar
  const next = requeueStageOne({ ...state, bars }, career);
  return { state: next };
}

export function claimAll(state: StudentState, claims: { skill: string; level: "confident" | "kindof" | "notyet" }[]): ActionResult {
  let next = { ...state };
  for (const c of claims) {
    const r = claimSkill(next, c.skill, c.level);
    if (r.error) return r;
    next = r.state;
  }
  // re-register the carried ·✓ set AFTER claims: a stray "not yet" rating can
  // never erase the switch hand-off (canon beat 6 → re-assessment → 33)
  for (const skill of state.decisions.verifiedTransferred) {
    next = { ...next, bars: { ...next.bars, [skill]: { source: "verified" as const } } };
  }
  // provenArchive restoration (user ruling 2026-11-02: proven skills are never
  // lost across role switches): archived verified bars on the active map are
  // ALREADY in `decisions.verifiedTransferred` (switchCareer computes the
  // carried set from bars ∪ archive) and re-registered above. What's left here
  // is archived ✓✓ bars filling ABSENCES on the active map — an existing bar
  // (claim included) stays untouched, matching submitCheck's no-override rule.
  const archive = state.provenArchive ?? {};
  const career = getCareer(next.careerId)!;
  let bars = { ...next.bars };
  for (const [skill, v] of Object.entries(archive)) {
    if (v.source !== "checked") continue;
    if (!career.skills.some((s) => s.name === skill)) continue;
    if (!(skill in bars)) bars[skill] = { source: "checked" as const };
  }
  next = { ...next, bars };
  // claims close the baseline — the last full re-rank point of onboarding
  const after = requeueStageOne({ ...next, stageOneDone: 0 }, career);
  return { state: after, note: `${claims.filter((c) => c.level === "confident").length} of ${career.skills.length} skills on your baseline` };
}

export function markVerified(state: StudentState, skill: string): ActionResult {
  const career = getCareer(state.careerId);
  if (!career || !career.skills.some((s) => s.name === skill)) return { state, error: "skill not on map" };
  const bars = { ...state.bars };
  bars[skill] = { source: "verified" };
  // archive the proven fact — career-agnostic, survives a later switch
  const provenArchive = { ...state.provenArchive, [skill]: { source: "verified" as const } };
  // re-rank DOES NOT fire on verification at cold start (beat ordering locked)
  return { state: { ...state, bars, provenArchive }, note: `${skill} confirmed ·✓` };
}

/**
 * Verified-credential → gap closure (the Round-4 lock at work, admin round
 * 2026-10-30 — map.md 2026-10-28 credential-input ruling): a counselor-
 * VERIFIED credential's cited skills **count as verified skills and close
 * skill gaps like platform completions — feeding SP + TP**.
 *
 * This is `submitCheck`'s completion semantics wearing the credential
 * audit's source:
 *  - a cited skill CLOSES its gap bar (`{ source: "verified" }` ·✓) when it
 *    sits on the student's TARGET career map and isn't closed yet (verified
 *    bars are never downgraded — a claim/checked bar doesn't re-open);
 *  - a closed member of the stage-① queue ticks training progress exactly
 *    like a comprehension pass (stateOneDone + the member leaves the queue
 *    — the next re-rank refills it canonically);
 *  - every closure lands a `bar-closed` event naming the credential, so
 *    both surfaces' provenance receipts trace to the audit;
 *  - cited skills OFF the target map close nothing (no invented bar — the
 *    store's declared vocabulary is every catalog role's skill names);
 *  - a student without a target career closes nothing (no map to measure
 *    against — the ruling still records; the row's skills keep waiting).
 * Re-running the join on an already-verified credential is a no-op (idempotent).
 */
export interface VerifiedCredentialJoin {
  state: StudentState;
  /** the bars this join closed (source verified ·✓) */
  closed: string[];
  /** of those, members that ticked stage-① (the TP feed) */
  queueTicks: string[];
}

export function applyVerifiedCredential(
  state: StudentState,
  career: Career | null,
  credential: Pick<CredentialRow, "title" | "declaredSkills">
): VerifiedCredentialJoin {
  if (!career || state.careerId !== career.id || !credential.declaredSkills.length) {
    return { state, closed: [], queueTicks: [] };
  }
  const bars = { ...state.bars };
  const closed: string[] = [];
  for (const skill of credential.declaredSkills) {
    if (career.skills.some((s) => s.name === skill) && !(skill in bars)) {
      bars[skill] = { source: "verified" as const };
      closed.push(skill);
    }
  }
  if (closed.length === 0) return { state, closed, queueTicks: [] };
  const provenArchive: Record<string, { source: "verified" | "checked" }> = { ...state.provenArchive };
  for (const skill of credential.declaredSkills) {
    // every cited skill of a VERIFIED credential is a proven fact, on or off
    // the map — the archive lets it resurface on a role whose map includes it
    provenArchive[skill] = { source: "verified" };
  }
  let next: StudentState = { ...state, bars, provenArchive };
  // stage-① progress: member of the current queue closing ticks 1 of 3
  const queue = next.stageOneQueue ?? stageOne(career, openSkills(career, next.bars)).queue;
  const queueTicks = queue.filter((q) => closed.includes(q));
  next.stageOneQueue = queue.filter((q) => !closed.includes(q));
  next.stageOneDone = next.stageOneDone + queueTicks.length;
  next.events = [
    ...next.events,
    ...closed.map((skill) => ({
      date: nowStamp(),
      kind: "bar-closed" as const,
      detail: `${skill} closed ·✓ — verified credential: ${credential.title}`,
      source: "verified" as const,
    })),
  ];
  return { state: next, closed, queueTicks };
}

/**
 * Goal suggestion consumed by the switch's quick re-assessment (canon Q13:
 * a new Training goal is suggested in the switch target's terms). Idempotent
 * via setGoal. Catalog round 9: the switch walk now runs to roster 2.2
 * "Software QA Analyst" — the canon money-shot goal closes Software Testing.
 */
export const SWITCH_GOAL_SUGGESTION: Record<string, { title: string; resourceId: string; skill: string }> = {
  qa: {
    title: "Build my first test plan",
    resourceId: "res-qa-testing",
    skill: "Software Testing",
  },
};

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
    // honest record: the attempt lands in the feed (m6-m9 plan fail row)
    return {
      state: {
        ...state,
        events: [
          ...state.events,
          {
            date: nowStamp(),
            kind: "check-failed" as const,
            detail: `Check not passed — ${correct} of ${questions.length} (need 4). Same check ready when you are.`,
          },
        ],
      },
      note: `not passed — ${correct} of 5 (need 4)`,
    };
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
  // archive the proven facts (✓✓) so a later role switch can restore them
  if (closedNow.length > 0) {
    next.provenArchive = { ...next.provenArchive };
    for (const skill of checkResource?.skillsAddressed ?? []) {
      if (!next.provenArchive[skill]) next.provenArchive[skill] = { source: "checked" };
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

/**
 * Competency instrument submit — the step-③ assessment's single write
 * (app/api/assessment). Graded SERVER-SIDE against the user-approved bank
 * (lib/fixtures/instrument.ts): a competency is verified ⇔ BOTH of its
 * verification MCQs are answered correctly in THIS attempt; every rated
 * competency otherwise stays claimed (self-report never earns ES points).
 * A full attempt (all 28 ratings + all 14 MCQs) OVERWRITES
 * `state.competencies` + the attempt record — "Retake: latest attempt counts"
 * (Round 7 lock): a later, weaker sitting honestly drops a verified mark;
 * the previous attempt is not summed, best-struck, or kept as history.
 */
export function submitAssessment(
  state: StudentState,
  answers: { likert: Record<string, number>; mcq: Record<string, number> }
): ActionResult {
  if (!instrumentComplete(answers.likert, answers.mcq)) {
    return { state, error: "incomplete attempt — a full sitting is required" };
  }
  const competencies = gradeInstrumentAnswers(answers);
  const attempted: StudentState = {
    ...state,
    competencies,
    assessment: {
      takenAt: nowStamp() + " 09:31",
      likert: normalizeAnswers(answers.likert),
      mcq: normalizeAnswers(answers.mcq),
      competencies,
    },
    events: [
      ...state.events,
      {
        date: nowStamp(),
        kind: "scored" as const,
        detail: `Competency assessment sat — ${Object.values(competencies).filter((v) => v === "verified").length} of 7 verified ·✓`,
      },
    ],
  };
  const verified = Object.values(competencies).filter((v) => v === "verified").length;
  return { state: attempted, note: `${verified} of 7 competencies verified ·✓` };
}

/** A full attempt: every bank item answered within its value range. */
function instrumentComplete(
  likert: Record<string, number>,
  mcq: Record<string, number>
): boolean {
  return (
    INSTRUMENT_STATEMENT_IDS.every((id) => {
      const v = likert[id];
      return typeof v === "number" && v >= 1 && v <= 5;
    }) &&
    INSTRUMENT_MCQ_IDS.every((id) => {
      const v = mcq[id];
      const item = INSTRUMENT_MCQ_BY_ID.get(id);
      return (
        item !== undefined && typeof v === "number" && v >= 0 && v < item.options.length
      );
    })
  );
}

/** Strip any key the bank doesn't know (defensive: never persist stray data). */
function normalizeAnswers(a: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(a)) {
    if (
      INSTRUMENT_STATEMENT_IDS.includes(k) ||
      (INSTRUMENT_MCQ_BY_ID.has(k) && typeof v === "number")
    ) {
      out[k] = v;
    }
  }
  return out;
}

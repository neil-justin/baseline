import type { DemoEvent, StudentState } from "@/lib/types";
import { NEIL_SEED } from "@/lib/fixtures/neil";
import { getCareer } from "@/lib/fixtures/catalog";
import { computeScore } from "@/lib/engines/score";

/**
 * Score-trajectory derivation for the Plan §5 timeline — computed, never painted.
 *
 * Honest lineage rules (this helper renders only what app state actually proves):
 *  1. If events ever carry `kind: "scored"` snapshots, those ARE the trajectory
 *     points (value held in the event detail as its last integer).
 *  2. Otherwise no snapshot history exists anywhere in the store (the JSON store
 *     is a single mutable state file). The only re-derivable historical state is
 *     the setup state itself: every student's story starts at the seed (the
 *     store's sole source of initial state), and a `career-switched` event plus
 *     at least one `check-passed` event prove the student is past setup with
 *     completions recorded. In that proven case, point A = the seed's own
 *     computed score (Setup) and point B = the live score (First completions).
 *  3. With no completions proven, there is exactly one derivable score — the
 *     current one — so the trajectory is a single dated point and the UI says so.
 */

export interface TrajPoint {
  label: string;
  date: string; // formatted "17 Oct 2026"
  value: number;
  ok?: boolean; // earned-green accent (the recent point)
}

export interface Trajectory {
  points: TrajPoint[];
  lineage: "scored-events" | "setup-and-now" | "current-only";
  /** current − setup, only when two real readings exist */
  delta: number | null;
  /** provenance counts for the +11 line, straight from the event log */
  prov: { barCloses: number; checks: number; goalsCompleted: number };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-10-17 09:05" → "17 Oct 2026" (plain-language dates, no locale drift). */
export function fmtEventDate(d: string | undefined): string {
  if (!d) return "";
  const m = d.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return d;
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${Number(m[1])}`;
}

function headline(s: Pick<StudentState, "bars" | "careerId" | "goals" | "stageOneDone">): number {
  const n = getCareer(s.careerId)?.skills.length ?? 0;
  return computeScore({
    bars: s.bars,
    careerId: s.careerId,
    careerSkillCount: n,
    goals: s.goals,
    stageOneDone: s.stageOneDone,
  }).total;
}

function scoredValue(detail: string): number | null {
  const all = detail.match(/\d+/g);
  return all ? Number(all[all.length - 1]) : null;
}

export function scoreTrajectory(state: StudentState): Trajectory {
  const events: DemoEvent[] = state.events ?? [];
  const prov = {
    barCloses: events.filter((e) => e.kind === "bar-closed").length,
    checks: events.filter((e) => e.kind === "check-passed").length,
    goalsCompleted: events.filter((e) => e.kind === "goal-completed").length,
  };

  // 1 · events that recorded real snapshot scores are the canon timeline
  const scored = events.filter((e) => e.kind === "scored");
  if (scored.length >= 2) {
    const points = scored
      .map((e) => ({ label: e.detail.split("—")[0].trim() || "Setup", date: fmtEventDate(e.date), value: scoredValue(e.detail) }))
      .filter((p): p is { label: string; date: string; value: number } => p.value !== null)
      .map((p, i, arr) => ({ ...p, ok: i === arr.length - 1 }));
    const delta = points.length ? points[points.length - 1].value - points[0].value : null;
    return { points, lineage: "scored-events", delta, prov };
  }

  const now = headline(state);
  // 2 · proven setup-and-now lineage: switched + at least one comprehension pass
  const switched = events.some((e) => e.kind === "career-switched");
  const lastPass = [...events].reverse().find((e) => e.kind === "check-passed");
  if (switched && lastPass) {
    const setup = headline(NEIL_SEED);
    return {
      points: [
        { label: "Setup", date: fmtEventDate(events[0]?.date), value: setup },
        { label: "First completions", date: fmtEventDate(lastPass.date), value: now, ok: true },
      ],
      lineage: "setup-and-now",
      delta: now - setup,
      prov,
    };
  }

  // 3 · single derivable reading
  const label = switched ? "Current" : "Setup";
  return {
    points: [{ label, date: fmtEventDate(events[0]?.date), value: now }],
    lineage: "current-only",
    delta: null,
    prov,
  };
}

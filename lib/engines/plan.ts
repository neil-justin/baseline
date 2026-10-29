import type { Career, StudentState } from "@/lib/types";
import { rankOpenSkills } from "./gaps";
import type { ArInput } from "./score";

/**
 * Plan engine — My Plan round (Q4b, LOCKED): goals dissolved; there is no
 * goal object, **the plan's head item IS the student's commitment**, and the
 * CC ticks ride the plan (career picked · plan started · first item done).
 *
 * The ranked plan = everything between the student and their target role:
 * the open-skill gap list (M7 locked ranking: core ×3 → free-PH-first →
 * stable catalog order) with the **resume diagnostic as a full queue
 * member** — it is the step that OPENS the unmeasured AR channel (ADR 0002
 * amendment: every channel has a path; the interview's stage-1 member is
 * post-defense mobile). While AR is unmeasured the diagnostic is the head:
 * no earned point exists behind it, so it is the highest-leverage step on
 * the plan. Once a run exists (best run counts, unlimited re-runs —
 * `lib/engines/air.ts`) the member completes out of the queue.
 *
 * TP's stage basis is untouched: `state.stageOneQueue` stays the carrier
 * (stage-① closed items tick TP); the diagnostic opens AR only — a plan
 * step feeds exactly one channel.
 *
 * Completion = evidence (My Plan round decision 4): the three routes are the
 * verification mini-quiz (·✓), the resource comprehension check (✓✓), and a
 * verified credential — for the AR member it is one successful diagnostic
 * run (scope decision recorded in resume-run-store.ts).
 */

export interface PlanItemBase {
  /** the step's channel: skill steps feed SP/TP, the AR step opens AR */
  kind: "skill" | "ar";
  reason: string;
}

export interface ArPlanItem extends PlanItemBase {
  kind: "ar";
  title: string;
  /** where the doing happens */
  href: "/prep";
}

export interface SkillPlanItem extends PlanItemBase {
  kind: "skill";
  skill: string;
  tier: "core" | "secondary";
  priority: number;
  hasFreeResource: boolean;
}

export type PlanItem = ArPlanItem | SkillPlanItem;

/** The plan head — the Dashboard's single CTA mirrors this item's do-location. */
export const AR_STEP_TITLE = "Run the resume diagnostic";

/** the ranked plan for the student's target role (queue-head first). */
export function planFor(
  career: Career,
  state: Pick<StudentState, "bars" | "careerId">,
  ar?: ArInput | null
): PlanItem[] {
  if (state.careerId !== career.id) return []; // stale pair — caller supplies the live career
  const items: PlanItem[] = [];
  if (!ar?.measured) {
    // unmeasured AR → the unlock step leads the queue (see header)
    items.push({
      kind: "ar",
      title: AR_STEP_TITLE,
      reason:
        "Application readiness isn't measured yet — one successful diagnostic run opens that channel.",
      href: "/prep",
    });
  }
  const open = career.skills.map((s) => s.name).filter((n) => !(n in (state.bars ?? {})));
  for (const r of rankOpenSkills(career, open)) {
    items.push({
      kind: "skill",
      skill: r.skill,
      tier: r.tier,
      priority: r.priority,
      hasFreeResource: r.hasFreeResource,
      reason: r.tier === "core" ? "Core-tier gap" : "Skill gap",
    });
  }
  return items;
}

/** The plan's head item (the student's commitment target) — the Dashboard CTA. */
export function planHead(
  career: Career,
  state: Pick<StudentState, "bars" | "careerId">,
  ar?: ArInput | null
): PlanItem | null {
  return planFor(career, state, ar)[0] ?? null;
}

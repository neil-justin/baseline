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
 * stable catalog order) with the **Application Materials task as a full
 * queue member** — it is the application-readiness channel's enablement task
 * (ADR 0002 amendment 2, ticket 12):
 *
 *   "Get your application materials ready" — ONE task whose checklist
 *   carries the three factor states (resume · cover letter · professional
 *   presence); all three measured completes the task out of the queue. Each
 *   factor measures on its own file/run (resume and letter runs are
 *   independent uploads; presence lives in Profile → Credentials as the
 *   fourth kind).
 *
 * HEAD-OF-PLAN SEMANTICS UNCHANGED (locked): while AR is unmeasured the head
 * is still "Run the resume diagnostic" — no earned AR point exists behind it,
 * so it is the highest-leverage step on the plan (the resume factor is the
 * designated unlock; one successful diagnostic run is its completion and its
 * evidence — resume-run-store scope decision). Once ANY factor measures, the
 * member is the checklist task; it drops from the queue only when all three
 * land. The do-location stays /prep (the diagnostic surface; presence is
 * declared in Profile → Credentials).
 *
 * TP's stage basis is untouched: `state.stageOneQueue` stays the carrier
 * (stage-① closed items tick TP); an AR factor feeds AR only — a plan step
 * feeds exactly one channel.
 *
 * Completion = evidence (My Plan round decision 4): the three routes are the
 * verification mini-quiz (·✓), the resource comprehension check (✓✓), and a
 * verified credential — for the AR members it's the factors' own runs /
 * stamped declaration (lib/engines/air.ts).
 */

export interface PlanItemBase {
  /** the step's channel: skill steps feed SP/TP, the AR step opens AR */
  kind: "skill" | "ar";
  reason: string;
}

export interface ArPlanItem extends PlanItemBase {
  kind: "ar";
  /** the head commitment while unmeasured ("Run the resume diagnostic");
   *  the checklist task once anything measures ("Get your application materials ready") */
  title: string;
  /** where the doing happens */
  href: "/prep";
  /** ticket 12: the ONE task's three factor states — all measured completes it */
  checklist: { resume: boolean; letter: boolean; presence: boolean };
}

export interface SkillPlanItem extends PlanItemBase {
  kind: "skill";
  skill: string;
  tier: "core" | "secondary";
  priority: number;
  hasFreeResource: boolean;
}

export type PlanItem = ArPlanItem | SkillPlanItem;

/** The head CTA while AR is fully unmeasured (locked head semantics). */
export const AR_STEP_TITLE = "Run the resume diagnostic";

/** The checklist task once any AR factor has measured (ticket 12 wording). */
export const AR_TASK_TITLE = "Get your application materials ready";

/** Factor state off the AR input (absent factor = unmeasured). */
function factorStates(ar?: ArInput | null) {
  return {
    resume: ar?.resume?.measured === true,
    letter: ar?.letter?.measured === true,
    presence: ar?.presence?.measured === true,
  };
}

function arReason(resume: boolean, letter: boolean, presence: boolean): string {
  const done = [resume, letter, presence].filter(Boolean).length;
  if (done === 0) {
    return "Application readiness isn't measured yet — one successful diagnostic run opens that channel.";
  }
  const open = [
    !resume && "a resume diagnostic run",
    !letter && "a cover-letter check",
    !presence && "the presence declaration (Profile → Credentials)",
  ].filter(Boolean) as string[];
  return `Application readiness ${done} of 3 measured — still open: ${open.join(" · ")}.`;
}

/** the ranked plan for the student's target role (queue-head first). */
export function planFor(
  career: Career,
  state: Pick<StudentState, "bars" | "careerId">,
  ar?: ArInput | null
): PlanItem[] {
  if (state.careerId !== career.id) return []; // stale pair — caller supplies the live career
  const items: PlanItem[] = [];
  const checklist = factorStates(ar);
  const measured = [checklist.resume, checklist.letter, checklist.presence].filter(Boolean).length;
  if (measured < 3) {
    // the AR task leads while any of its three factors still measures out
    items.push({
      kind: "ar",
      // locked head semantics: while AR is unmeasured the head is the unlock step
      title: measured === 0 ? AR_STEP_TITLE : AR_TASK_TITLE,
      reason: arReason(checklist.resume, checklist.letter, checklist.presence),
      href: "/prep",
      checklist,
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

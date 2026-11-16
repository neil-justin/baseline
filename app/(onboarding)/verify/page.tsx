import type { Metadata } from "next";
import { redirect } from "next/navigation";
import VerifySitting from "./VerifySitting";
import { requireStudent } from "@/lib/session";
import { getStudentView } from "@/lib/db";
import type { VMCQ } from "@/app/(onboarding)/onboarding/banks";
import { SKILL_BANKS, getSkillLadder } from "@/lib/fixtures/skill-banks";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Skill verification — Baseline",
  description:
    "The verification sitting: prove a skill one short ladder at a time. A pass makes it verified; a miss leaves it unverified — the plan still points at it.",
};

/**
 * /verify — the retake sitting (2026-11-04 ruling: a FOCUSED SCREEN —
 * the (onboarding) group's chrome gives it the bare header; the page adds
 * the back control to Assessments). The focused view shows the instrument
 * and nothing else.
 *
 * Content gate (2026-11-06: the "claimed" concept is gone — a skill the
 * student is CONFIDENT about arrives simply UNVERIFIED, and every
 * unverified career skill has something to prove). A per-skill mode
 * arrives as `?skill=<canonical name>` and demands an UNVERIFIED row —
 * not `verified` and not `checked` — that has an instrument (a ladder,
 * else the legacy single banked item). A verified/checked row has nothing
 * to prove — the hub carries the state that says so. The whole-battery
 * mode draws the first ≤5 unverified rows, ladder-first, the OB-3b way.
 * Writes: none here — POST /api/verify per skill under the session student
 * (a fail write is a no-op; the row stays unverified).
 */
export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ skill?: string }>;
}) {
  const profile = await requireStudent();
  const { state, career } = await getStudentView(profile.studentId);
  if (!career) redirect("/assessments");

  const { skill } = await searchParams;
  const banked = new Map(SKILL_BANKS.map((q) => [q.catalogSkill, q]));

  let items: VMCQ[];
  /* ladder channel (user-approved 2026-11-05): an unverified ladder skill's
   * sitting runs its 3-rung ladder; the single-banked item rides only for
   * skills without a ladder (legacy — vestigial now, kept honest). */
  const isUnverified = (name: string) => {
    const src = state.bars[name]?.source;
    return src !== "verified" && src !== "checked";
  };
  let slots: { q: VMCQ; skill: string; ladderSkill: string | null; rung: number }[];
  if (skill) {
    const spec = career.skills.find((s) => s.name === skill);
    const quiz = banked.get(skill ?? "");
    const ladder = getSkillLadder(skill ?? "");
    if (!spec || !isUnverified(skill) || (!quiz && !ladder)) {
      // the honest gates: a proven row (verified or checked) and an
      // instrument-less row both have no verb here — /assessments carries
      // the state that says so
      redirect("/assessments");
    }
    slots = ladder
      ? ladder.items.map((q, rung) => ({ q, skill, ladderSkill: ladder.catalogSkill, rung }))
      : [{ q: quiz!, skill, ladderSkill: null, rung: 0 }];
    items = slots.map((s) => s.q);
  } else {
    const unverifiedRows = career.skills
      .filter((s) => isUnverified(s.name))
      .slice(0, 5);
    slots = [];
    for (const s of unverifiedRows) {
      const ladder = getSkillLadder(s.name);
      if (ladder) {
        ladder.items.forEach((q, rung) =>
          slots.push({ q, skill: s.name, ladderSkill: ladder.catalogSkill, rung })
        );
      } else {
        const quiz = banked.get(s.name);
        if (quiz) slots.push({ q: quiz, skill: s.name, ladderSkill: null, rung: 0 });
      }
    }
    if (slots.length === 0) redirect("/assessments");
    items = slots.map((s) => s.q);
  }

  return <VerifySitting items={items} slots={slots} />;
}

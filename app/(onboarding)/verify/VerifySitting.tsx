"use client";

/**
 * VerifySitting.tsx — the retake sitting's client half (the focused
 * screen's instrument). It renders the SHARED QuestionCard register —
 * the same component the onboarding verify mini-quiz uses (user ruling,
 * 2026-11-04: one instrument register, never a lookalike), and it writes
 * the ladder contract (user-approved 2026-11-05): a LADDER skill never
 * POSTs a rung — one POST per skill at sitting end with the three picked
 * indices, so the route's all-or-nothing grade is the only verdict;
 * single-banked legacy skills keep the OB-3b per-answer POST ({skill,
 * passed}) under the SESSION student. Leaving early writes nothing —
 * a closed sitting is no attempt, matching the ruled copy.
 */
import { useRouter } from "next/navigation";
import { useState } from "react";
import QuestionCard, { TallyRow, type QuizQuestion } from "@/components/quiz/QuestionCard";
import type { VMCQ } from "@/app/(onboarding)/onboarding/banks";
import { skillDisplay } from "@/lib/skill-display";

type SittingItem = VMCQ & QuizQuestion;
export type SittingSlot = { skill: string; ladderSkill: string | null; rung: number };

export default function VerifySitting({
  items,
  slots,
}: {
  items: SittingItem[];
  slots: SittingSlot[];
}) {
  const router = useRouter();
  const [pos, setPos] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [picks, setPicks] = useState<(number | null)[]>([]);
  const [done, setDone] = useState(false);

  const leave = () => {
    router.replace("/assessments");
  };

  const answer = (i: number) => {
    if (picked !== null) return;
    const passed = i === items[pos].answer;
    setPicked(i);
    setResults((prev) => {
      const next = [...prev];
      next[pos] = passed;
      return next;
    });
    setPicks((prev) => {
      const next = [...prev];
      next[pos] = i;
      return next;
    });
    // ladder skills never POST a rung — one POST per skill at sitting end;
    // legacy single-banked skills keep the per-answer write
    if (!slots[pos]?.ladderSkill) {
      // the route saves nothing on fail — a miss never un-verifies
      fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill: items[pos].catalogSkill, passed }),
      }).catch(() => {});
    }
  };

  const next = () => {
    if (picked === null) return;
    if (pos + 1 >= items.length) {
      sendLadderVerdicts();
      setDone(true);
    } else {
      setPos(pos + 1);
      setPicked(null);
    }
  };

  /* one POST per ladder skill whose three rungs were all answered; rungs
   * left unanswered mean no POST — the row simply stays unverified */
  const sendLadderVerdicts = () => {
    const bySkill = new Map<string, (number | null)[]>();
    slots.forEach((slot, idx) => {
      if (!slot.ladderSkill) return;
      const arr = bySkill.get(slot.ladderSkill) ?? [];
      arr[slot.rung] = picks[idx];
      bySkill.set(slot.ladderSkill, arr);
    });
    bySkill.forEach((arr, skill) => {
      if (arr.length !== 3 || arr.some((a) => typeof a !== "number")) return;
      fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill, answers: arr as number[] }),
      }).catch(() => {});
    });
  };

  if (done) {
    // the verdict — the onboarding result register, on the focused screen,
    // skill-level: a ladder skill confirmed only if all its rungs graded
    // correct client-side (the server's 3-of-3 grade is the authority)
    const skillsOrder: string[] = [];
    slots.forEach((s) => {
      if (!skillsOrder.includes(s.skill)) skillsOrder.push(s.skill);
    });
    const confirmedSkills = new Set<string>();
    for (const skill of skillsOrder) {
      const idxs = slots.map((s, i) => (s.skill === skill ? i : -1)).filter((i) => i >= 0);
      if (slots[idxs[0]].ladderSkill) {
        if (idxs.every((i) => results[i] === true)) confirmedSkills.add(skill);
      } else if (results[idxs[0]] === true) confirmedSkills.add(skill);
    }
    const confirmedNames = skillsOrder.filter((s) => confirmedSkills.has(s)).map(skillDisplay);
    const missedNames = skillsOrder.filter((s) => !confirmedSkills.has(s)).map(skillDisplay);
    const n = confirmedNames.length;
    /** per-skill tally: each skill's rung score ("2 of 3 — not verified yet");
     *  the header count stays honest (verified skills only). */
    const tally = skillsOrder.map((skill) => {
      const idxs = slots.map((s, i) => (s.skill === skill ? i : -1)).filter((i) => i >= 0);
      const isLadder = slots[idxs[0]].ladderSkill != null;
      const correct = idxs.filter((i) => results[i] === true).length;
      return { skill, verified: confirmedSkills.has(skill), isLadder, correct, total: isLadder ? 3 : 1 };
    });
    return (
      <div className="vq-screen">
        <h1 className="vq-h1">
          {n} of {skillsOrder.length} confirmed.
        </h1>
        <p className="vq-copy">
          {missedNames.length === 0
            ? "A real head start — the hub shows it from day one."
            : missedNames.length === skillsOrder.length
              ? "None yet — that's honest, and nothing breaks: your plan still points at the skills, and the ladders verify them as you learn."
              : `${missedNames.join(", ")} — not verified yet; your plan still points at them. Check again any time.`}
        </p>
        <div className="vq-tally">
          {tally.map((t) => (
            <TallyRow
              key={t.skill}
              skill={t.skill}
              correct={t.correct}
              total={t.total}
              verified={t.verified}
            />
          ))}
        </div>
        {confirmedNames.length > 0 && (
          <div className="vq-okband">
            Verified on your profile: <b>{confirmedNames.join(", ")}</b>
          </div>
        )}
        {missedNames.length > 0 && (
          <p className="vq-note">
            Missing a rung doesn't lower anything — the skill just sits unverified. Re-take
            whenever you&apos;re ready to prove it again.
          </p>
        )}
        <div className="vq-ctas">
          <button type="button" className="vq-next" onClick={leave}>
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  const slot = slots[pos] ?? { skill: items[pos].skill, ladderSkill: null, rung: 0 };
  const q = items[pos];
  const back = { label: "Back to Assessments", onClick: leave };
  const rungAnswered = slot.ladderSkill
    ? slots.filter((s, i) => s.ladderSkill === slot.ladderSkill && picks[i] != null).length
    : 0;

  return (
    <div className="vq-screen">
      <QuestionCard
        question={q}
        index={pos}
        total={items.length}
        picked={picked}
        onAnswer={answer}
        onNext={next}
        rung={slot.ladderSkill ? { index: slot.rung, answered: rungAnswered } : undefined}
        bandPass={slot.ladderSkill ? "Rung cleared — your whole ladder grades at the end." : undefined}
        bandFail={slot.ladderSkill ? "Rung not cleared — the ladder only verifies whole." : undefined}
        back={back}
      />
    </div>
  );
}

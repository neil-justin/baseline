"use client";

/**
 * VerifySitting.tsx — the retake instrument's client half (the focused
 * screen). It renders the SHARED QuestionCard register — the same component
 * the onboarding verify mini-quiz uses (user ruling, 2026-11-04: one
 * instrument register, never a lookalike), and it writes the ladder
 * contract (user-approved 2026-11-05): a LADDER skill never POSTs a part —
 * one POST per skill at the end with the three picked indices, so the
 * route's all-or-nothing grade is the only verdict; single-banked legacy
 * skills keep the OB-3b per-answer POST ({skill, passed}) under the SESSION
 * student. Phase-2 register round 2026-11-20: the pending verdict band
 * carries the quiet hint line, the verdict bands speak the part register
 * ("part 1 of 3 — the skill verifies only if all three parts pass"), the
 * result screen is the TallyRow register with the one rule line (never a
 * prose memo), and the confirm-guard rides honest labels: the first
 * question shows the CURRENT recorded standing with the replace line, and
 * the final Finish control names the replacement when a standing exists.
 *
 * Writes: none mid-sitting for ladder skills — a closed check is no
 * attempt; single-banked legacy skills keep their per-answer write.
 */
import { useRouter } from "next/navigation";
import { useState } from "react";
import QuestionCard, { TallyRow, type QuizQuestion } from "@/components/quiz/QuestionCard";
import type { VMCQ } from "@/app/(onboarding)/onboarding/banks";

type SittingItem = VMCQ & QuizQuestion;
export type SittingSlot = { skill: string; ladderSkill: string | null; rung: number };

/** the confirm-guard's standing: the student's CURRENT recorded standing
 *  for what this check touches (engine truth from the page), plus whether
 *  a previous attempt exists (it decides the honest Finish label). */
export interface VerifyStanding {
  text: string;
  hadPrevious: boolean;
}

export default function VerifySitting({
  items,
  slots,
  standing,
}: {
  items: SittingItem[];
  slots: SittingSlot[];
  standing: VerifyStanding | null;
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
    // ladder skills never POST a part — one POST per skill at the end;
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

  /* one POST per ladder skill whose three parts were all answered; parts
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

  /* the honest Finish subline — what submitting actually does for THIS
   * sitting's mix of skills (single-banked skills record per-answer) */
  const hasLegacy = slots.some((s) => !s.ladderSkill);
  const finishSub = hasLegacy
    ? "Single-check skills record as you answer; the rest grade at the end."
    : "Nothing is recorded until you finish — leaving early writes nothing.";

  if (done) {
    // the verdict — the TallyRow register, on the focused screen, skill
    // level: a ladder skill verifies only if all three of its parts graded
    // correct client-side (the server's 3-of-3 grade is the authority)
    const skillsOrder: string[] = [];
    slots.forEach((s) => {
      if (!skillsOrder.includes(s.skill)) skillsOrder.push(s.skill);
    });
    const verifiedSkills = new Set<string>();
    for (const skill of skillsOrder) {
      const idxs = slots.map((s, i) => (s.skill === skill ? i : -1)).filter((i) => i >= 0);
      if (slots[idxs[0]].ladderSkill) {
        if (idxs.every((i) => results[i] === true)) verifiedSkills.add(skill);
      } else if (results[idxs[0]] === true) verifiedSkills.add(skill);
    }
    const n = verifiedSkills.size;
    const missed = skillsOrder.length - n;
    /** per-skill tally: each skill's part score ("2 of 3 — not verified yet");
     *  the header count stays honest (verified skills only). */
    const tally = skillsOrder.map((skill) => {
      const idxs = slots.map((s, i) => (s.skill === skill ? i : -1)).filter((i) => i >= 0);
      const isLadder = slots[idxs[0]].ladderSkill != null;
      const correct = idxs.filter((i) => results[i] === true).length;
      return { skill, verified: verifiedSkills.has(skill), isLadder, correct, total: isLadder ? 3 : 1 };
    });
    return (
      <div className="vq-screen vq-rt">
        <h1 className="vq-h1">
          {n > 0
            ? `${n} of ${skillsOrder.length} skills verified.`
            : "Your checks are recorded."}
        </h1>
        <p className="vq-copy">The checks are what verify — and your latest attempt always counts.</p>
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
        <div className="vq-ctas">
          <button type="button" className="vq-next" onClick={leave}>
            Back to Assessments
          </button>
          {missed > 0 && (
            <a className="vq-link" href="/verify">
              Check these skills again
            </a>
          )}
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
  const last = pos + 1 >= items.length;

  return (
    <div className="vq-screen vq-rt">
      {/* the confirm-guard's standing (first question only): the current
          recorded standing + the one plain replace line */}
      {pos === 0 && standing && (
        <div className="vq-standing">
          <p className="vq-standing-line num">{standing.text}</p>
          <p className="vq-standing-sub">
            Starting a new check replaces it — your latest attempt always counts.
          </p>
        </div>
      )}
      <QuestionCard
        question={q}
        index={pos}
        total={items.length}
        picked={picked}
        onAnswer={answer}
        onNext={next}
        rung={slot.ladderSkill ? { index: slot.rung, answered: rungAnswered } : undefined}
        bandPass={
          slot.ladderSkill
            ? `Correct — part ${slot.rung + 1} of 3. The skill verifies when all three parts pass.`
            : undefined
        }
        bandFail={
          slot.ladderSkill
            ? `Not quite — part ${slot.rung + 1} of 3. The skill verifies only if all three parts pass.`
            : undefined
        }
        pendingHint="Your verdict appears here — answer to see it."
        back={back}
        nextLabel={last ? (standing?.hadPrevious ? "Finish — replaces your latest result" : "Finish") : undefined}
      />
      {last && standing?.hadPrevious && <p className="vq-fine">{finishSub}</p>}
    </div>
  );
}

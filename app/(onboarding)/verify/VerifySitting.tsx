"use client";

/**
 * VerifySitting.tsx — the retake sitting's client half (the focused
 * screen's instrument). It renders the SHARED QuestionCard register —
 * the same component the onboarding verify mini-quiz uses (user ruling,
 * 2026-11-04: one instrument register, never a lookalike), and it writes
 * the OB-3b way: POST /api/verify per answer under the SESSION student
 * (a fail write is a no-op — the claim stays a claim; the route guards it).
 * Leaving early writes nothing — a closed sitting is no attempt, matching
 * the ruled copy.
 */
import { useRouter } from "next/navigation";
import { useState } from "react";
import QuestionCard, { type QuizQuestion } from "@/components/quiz/QuestionCard";
import type { VMCQ } from "@/app/(onboarding)/onboarding/banks";
import { skillDisplay } from "@/lib/skill-display";

type SittingItem = VMCQ & QuizQuestion;

export default function VerifySitting({ items }: { items: SittingItem[] }) {
  const router = useRouter();
  const [pos, setPos] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
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
    // the route saves nothing on fail — a miss never un-verifies
    fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill: items[pos].catalogSkill, passed }),
    }).catch(() => {});
  };

  const next = () => {
    if (picked === null) return;
    if (pos + 1 >= items.length) setDone(true);
    else {
      setPos(pos + 1);
      setPicked(null);
    }
  };

  if (done) {
    // the verdict — the onboarding result register, on the focused screen
    const confirmed = items.filter((_, i) => results[i] === true);
    const missed = items.filter((_, i) => results[i] === false);
    const n = confirmed.length;
    return (
      <div className="vq-screen">
        <h1 className="vq-h1">
          {n} of {items.length} confirmed.
        </h1>
        <p className="vq-copy">
          {missed.length === 0
            ? "A real head start — the hub shows it from day one."
            : missed.length === items.length
              ? "None yet — that's honest. Your self-ratings still shape the plan; the checks confirm them as you learn."
              : `${missed.map((q) => skillDisplay(q.skill)).join(", ")} — still your own rating. Check again any time.`}
        </p>
        {confirmed.length > 0 && (
          <div className="vq-okband">
            Verified on your profile: <b>{confirmed.map((q) => skillDisplay(q.skill)).join(", ")}</b>
          </div>
        )}
        {missed.length > 0 && (
          <p className="vq-note">
            Missed checks keep the self-reported rating — nothing is lost either way. Re-take
            whenever it&apos;s worth proving again.
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

  const q = items[pos];
  const back = { label: "Back to Assessments", onClick: leave };

  return (
    <div className="vq-screen">
      <QuestionCard
        question={q}
        index={pos}
        total={items.length}
        picked={picked}
        onAnswer={answer}
        onNext={next}
        back={back}
      />
    </div>
  );
}

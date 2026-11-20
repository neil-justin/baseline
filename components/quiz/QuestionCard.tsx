"use client";

/**
 * quiz/QuestionCard.tsx — the SHARED question register for the verification
 * instrument (2026-11-04 retake round, user ruling: both instruments ride
 * ONE register). Extracted verbatim from the onboarding verify mini-quiz
 * (`Onboarding.tsx`, OB-3b-3, `vView === "question"`): same DOM order, same
 * copy, same per-question mechanics — options flow through the tonal rect
 * register, an answer fires the verdict band immediately ("Correct. {skill}:
 * confirmed." / "Not quite — that's what it does: …"), Next arms only after
 * an answer, and the result view closes the sit.
 *
 * Consumers: the onboarding verify mini-quiz (first sitting) and the
 * /verify retake sitting (whole battery + per-skill re-check). Any future
 * styling change updates both surfaces at once.
 */
import { ArrowLeft, Check } from "lucide-react";
import "./quiz.css";
import { skillDisplay } from "@/lib/skill-display";

export interface QuizQuestion {
  skill: string;
  stem: string;
  options: string[];
  answer: number;
}

/**
 * TallyRow — the SHARED result row (walk-fix 2026-11-06, fix 4: the
 * ladder result card's format): skill name (semibold) | the 3-dot rung
 * indicator (QuestionCard's `vq-rung` grammar, filled = cleared rungs) |
 * the state chip right-aligned — green "Verified ✓" when a ladder grades
 * whole, otherwise the grey "N of 3 — not verified yet" chip. Rows ride
 * `.vq-tally`'s hairline dividers; both result screens (onboarding ③ and
 * the /verify sitting) render this same markup. Tally data untouched.
 */
export function TallyRow({
  skill,
  correct,
  total,
  verified,
}: {
  skill: string;
  correct: number;
  total: number;
  verified: boolean;
}) {
  return (
    <div className="vq-tally-row">
      <b>{skillDisplay(skill)}</b>
      <span
        className="vq-rung inrow"
        role="img"
        aria-label={`${correct} of ${total} parts passed`}
      >
        {Array.from({ length: total }, (_, i) => (
          <i key={i} data-state={i < correct ? "done" : "todo"} />
        ))}
      </span>
      {verified ? (
        <span className="vq-chip ok">
          Verified <Check size={11} aria-hidden="true" />
        </span>
      ) : (
        <span className="vq-chip pending">
          {correct} of {total} — not verified yet
        </span>
      )}
    </div>
  );
}

export default function QuestionCard({
  question,
  index,
  total,
  picked,
  onAnswer,
  onNext,
  back,
  nextLabel,
  bandPass,
  bandFail,
  rung,
  pendingHint,
}: {
  question: QuizQuestion;
  index: number;
  total: number;
  /** the chosen option index for THIS question; null until answered */
  picked: number | null;
  onAnswer: (i: number) => void;
  onNext: () => void;
  /** the qbar's back control — onboarding carries a Back that steps back
   * in the flow; the retake sitting carries Back to Assessments */
  back?: { label: string; onClick: () => void };
  nextLabel?: string;
  /** Ladder-mode band copy (optional — defaults keep the legacy register
   *  byte-for-byte): a ladder rung's pass must not claim the SKILL is
   *  confirmed mid-ladder, so ladders pass their own verdict lines. */
  bandPass?: string;
  bandFail?: string;
  /** Ladder rung indicator: 3 dots (● ○ ○) — `index` is the current rung,
   *  `answered` counts the skill's rungs answered so far. Replaces the old
   *  text rung tag (fix 2026-11-06: the tag ran together with the skill
   *  tag; dots carry the per-skill sequence). */
  rung?: { index: number; answered: number };
  /** Void fix (2026-11-20): the pending band's quiet single line ("Your
   *  verdict appears here — answer to see it."). Both sittings pass it —
   *  /verify adopted it in the phase-2 round (2026-11-20), so no surface
   *  keeps a dead reserved slot. */
  pendingHint?: string;
}) {
  const answered = picked !== null;
  const passed = answered && picked === question.answer;
  /** display-only — `question.skill` stays canonical for scoring/POST bodies */
  const skill = skillDisplay(question.skill);

  return (
    <>
      <div className="vq-qbar">
        <span className="vq-qtag num">
          Question {index + 1} of {total}
        </span>
        {back && (
          <button type="button" className="vq-back" onClick={back.onClick}>
            <ArrowLeft size={14} aria-hidden="true" /> {back.label}
          </button>
        )}
      </div>
      <div className="vq-card">
        <span className="vq-tag">About: {skill}</span>
        {rung && (
          /* display:flex (overriding .vq-rung's inline-flex) puts the dots
           * on their OWN row under the tag — inline-flex let them flow up
           * beside the inline .vq-tag label and butt-join its text
           * ("About: Business Environment Analysis◯ ○ ○", fix 2026-11-06) */
          <span
            className="vq-rung"
            style={{ display: "flex" }}
            aria-label={`Part ${rung.index + 1} of 3 — ${rung.answered} of 3 answered`}
            role="img"
          >
            {[0, 1, 2].map((i) => (
              <i
                key={i}
                data-state={i < rung.answered ? "done" : i === rung.index ? "now" : "todo"}
              />
            ))}
          </span>
        )}
        <p className="vq-stem" style={{ marginTop: 10 }}>{question.stem}</p>
        <div className="vq-opts">
          {question.options.map((o, i) => (
            <button
              key={i}
              className="vq-opt"
              type="button"
              onClick={() => !answered && onAnswer(i)}
            >
              {o}
            </button>
          ))}
        </div>
        {/* verdict band (2026-11-06, void fix 2026-11-20): ONE element in both
         * states — pending it holds the quiet `pendingHint` line (when the
         * consumer passes one) over the transparent reserved slot; answered
         * it grows the verdict. >=721px both states anchor to the same
         * absolute spot inside the card (quiz.css), so the reveal shifts
         * nothing; <720px both are the in-flow reserved slot. The hint only
         * becomes VISIBLE on the surface that opts in (its own scoped CSS);
         * consumers without it keep the byte-identical hidden register. */}
        <div
          className={`vq-band ${answered ? `show ${passed ? "pass" : "fail"}` : ""}`}
          aria-live="polite"
          aria-hidden={!answered || undefined}
        >
          {answered
            ? (passed
                ? bandPass ?? `Correct. ${skill}: confirmed.`
                : bandFail ?? `Not quite — that's what it does: ${question.options[question.answer]}. ${skill} stays as your own rating for now.`)
            : pendingHint}
        </div>
        <div className="vq-foot">
          <button type="button" className="vq-next" disabled={!answered} onClick={onNext}>
            {nextLabel ?? "Next"}
          </button>
        </div>
      </div>
    </>
  );
}

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
import { ArrowLeft } from "lucide-react";
import "./quiz.css";

export interface QuizQuestion {
  skill: string;
  stem: string;
  options: string[];
  answer: number;
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
}) {
  const answered = picked !== null;
  const passed = answered && picked === question.answer;

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
        <span className="vq-tag">About: {question.skill}</span>
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
        {answered && (
          <div className={`vq-band show ${passed ? "pass" : "fail"}`}>
            {passed
              ? `Correct. ${question.skill}: confirmed.`
              : `Not quite — that's what it does: ${question.options[question.answer]}. ${question.skill} stays as your own rating for now.`}
          </div>
        )}
        <div className="vq-foot">
          <button type="button" className="vq-next" disabled={!answered} onClick={onNext}>
            {nextLabel ?? "Next"}
          </button>
        </div>
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Reveal from "@/components/Reveal";
import type { CheckQuestionLite, CheckResourceLite } from "./types";

const PASS_MARK = 4; // LOCKED: pass ≥ 4 of 5

/**
 * Comprehension-check overlay — full-screen over Progress, launched from a
 * check-gated goal ("Start the check") or the feed. One question at a time,
 * answers changeable until Next, no timer, no mid-run feedback; the aggregate
 * result lands once, with the per-question list. POSTs the frozen
 * `/api/check` route, then refreshes the record behind the overlay.
 */
export default function CheckOverlay({
  resource,
  questions,
  goalLinked,
  onClose,
}: {
  resource: CheckResourceLite;
  questions: CheckQuestionLite[];
  goalLinked: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "run" | "result">("intro");
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [result, setResult] = useState<{
    correct: number;
    total: number;
    passed: boolean;
    gapClosed: boolean;
    goalDone: boolean;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = questions.length;

  // escape closes; page scroll is locked while the overlay is up
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  function pick(oi: number) {
    setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)));
  }

  async function submit() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId: resource.id, answers: answers.map((a) => a ?? -1), student: "neil" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "That didn't go through — try once more.");
        setBusy(false);
        return;
      }
      const correct = answers.reduce<number>(
        (n, a, i) => n + (a !== null && a === questions[i].answer ? 1 : 0),
        0
      );
      const passed = data.note === "passed" || correct >= PASS_MARK;
      const st = data.state;
      // only a ·✓✓ bar (not a self-report already on the baseline) earns the "gap closed" claim
      const gapClosed = st?.bars?.[resource.skill]?.source === "checked";
      const goalDone = Boolean(goalLinked && st?.goals?.some?.((g: { resourceId?: string; status: string }) =>
        g.resourceId === resource.id && g.status === "completed"
      ));
      setResult({ correct, total, passed, gapClosed, goalDone });
      setStep("result");
      if (passed) router.refresh(); // the record behind the overlay updates live
    } catch {
      setError("That didn't go through — try once more.");
    }
    setBusy(false);
  }

  function retake() {
    setAnswers(questions.map(() => null));
    setQi(0);
    setResult(null);
    setStep("run");
  }

  return (
    <div className="check-overlay" role="dialog" aria-modal="true" aria-label={`Comprehension check — ${resource.title}`}>
      <div className="check-in">
        <div className="check-top">
          <span className="q-skill-tag">Quick check</span>
          <button className="ob-back" type="button" onClick={onClose}>
            ← Back to Progress
          </button>
        </div>

        {step === "intro" && (
          <Reveal className="panel check-panel">
            <h2 className="r-head">Quick check — {resource.title}</h2>
            <p className="r-note">
              {total} questions · about 1 minute · pass {PASS_MARK} of {total} or better to close your{" "}
              {resource.skillShort} gap and count this skill as yours.
            </p>
            <p className="r-note">{resource.target}</p>
            <div className="check-ctas">
              <button className="btn btn-primary" type="button" onClick={() => setStep("run")}>
                Start the check
              </button>
              <button className="quiet-toggle" type="button" onClick={onClose}>
                Not now
              </button>
            </div>
          </Reveal>
        )}

        {step === "run" && (
          <Reveal className="panel check-panel">
            <div className="check-top">
              <span className="q-skill-tag num">
                Question {qi + 1} of {total}
              </span>
              <span className="check-ticks" aria-hidden="true">
                {questions.map((_, k) => (
                  <i key={k} className={k <= qi ? "on" : ""} />
                ))}
              </span>
            </div>
            <p className="q-stem">{questions[qi].stem}</p>
            <div className="q-opts">
              {questions[qi].options.map((opt, oi) => (
                <button
                  key={oi}
                  type="button"
                  className="opt"
                  aria-pressed={answers[qi] === oi}
                  onClick={() => pick(oi)}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="check-next">
              <button
                className="btn btn-ghost"
                type="button"
                disabled={answers[qi] === null || busy}
                onClick={() => (qi + 1 < total ? setQi(qi + 1) : submit())}
              >
                {busy ? "Checking…" : qi + 1 < total ? "Next" : "See results"}
              </button>
            </div>
          </Reveal>
        )}

        {step === "result" && result && result.passed && (
          <Reveal className="panel check-panel">
            <h2 className="r-head">
              You passed — {result.correct} of {result.total}
            </h2>
            <div className="okband r-band">
              {[
                result.gapClosed ? `Your ${resource.skillShort} gap is closed ✓✓` : null,
                result.goalDone ? "The goal you set is done" : null,
                "Your readiness score updates.",
              ]
                .filter(Boolean)
                .join(" · ")}
            </div>
            <div className="check-results">
              {questions.map((q, i) => {
                const ok = answers[i] === q.answer;
                return (
                  <div className="r-line" key={i}>
                    <span className={`r-mark num ${ok ? "ok" : ""}`}>{ok ? "✓" : "✗"}</span>
                    <span className="r-stem">{q.stem}</span>
                  </div>
                );
              })}
            </div>
            <div className="check-ctas">
              <button className="btn btn-primary" type="button" onClick={onClose}>
                Back to Progress
              </button>
            </div>
          </Reveal>
        )}

        {step === "result" && result && !result.passed && (
          <Reveal className="panel check-panel">
            <h2 className="r-head">
              Close — {result.correct} of {result.total}
            </h2>
            <p className="r-note">
              Not passed this time. You need {PASS_MARK} of {total}. Review the resource — the same check is ready when
              you are.
            </p>
            {error && <div className="q-band fail show num">{error}</div>}
            <div className="check-ctas">
              <button className="btn btn-ghost" type="button" onClick={onClose}>
                Review the resource
              </button>
              <button className="btn btn-primary" type="button" onClick={retake}>
                Retake the check
              </button>
            </div>
          </Reveal>
        )}

        {error && step !== "result" && <div className="q-band fail show num">{error}</div>}
      </div>
    </div>
  );
}

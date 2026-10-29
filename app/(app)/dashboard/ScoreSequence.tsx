"use client";

import { useState, type ReactNode } from "react";
import CountUp from "@/components/CountUp";
import { SegRubricBar } from "@/components/instrument";

/**
 * The measurement sequence from the prototype's `data-sequence`: the score
 * counts up, the rubric bar arms ~160ms after it settles — the page's one
 * authored motion moment.
 *
 * Navy splice layout (user-pinned contract): `.score-left` is the score
 * headline (giant tabular readout + start line + honest read), `.score-actions`
 * is the right column (delta chip + next-step CTA), `.score-right` is the
 * score-level breakdown instrument. `.score-big` and the `.segbar .seg i`
 * fractions are e2e-read canonical — structure changes never rename them.
 */
export default function ScoreSequence({
  score,
  parts,
  line,
  actions,
}: {
  score: number;
  parts: { pct: number; earnedFrac: number }[];
  line: ReactNode;
  actions?: ReactNode;
}) {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <div className="score-left">
        <h1 className="score-readout num">
          <span className="score-big-num">
            <CountUp
              to={score}
              dec={0}
              dur={900}
              onDone={() => setTimeout(() => setArmed(true), 160)}
              className="score-big"
              ariaLabel={`Readiness ${score} of 100`}
            />
            <span className="score-of">of 100</span>
          </span>
          <span className="start-line">Your starting line.</span>
        </h1>
        <p className="score-line">{line}</p>
      </div>
      <div className="score-actions">{actions}</div>
      <div className="score-right">
        <div className="seg-head">
          <span className="label">Breakdown</span>
          <span className="label num">40 / 25 / 20 / 15</span>
        </div>
        <SegRubricBar parts={parts} armed={armed} height={14} ariaLabel={`Score ${score} of 100`} />
      </div>
    </>
  );
}

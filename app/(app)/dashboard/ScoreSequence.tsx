"use client";

import { useState, type ReactNode } from "react";
import CountUp from "@/components/CountUp";
import { SegRubricBar } from "@/components/instrument";

/**
 * The measurement sequence from the prototype's `data-sequence`: the score
 * counts up, the rubric bar arms ~160ms after it settles. Renders as a
 * fragment so `.score-left` and `.score-right` are the band grid's direct
 * children — structure matches prototype/dashboard.html exactly.
 */
export default function ScoreSequence({
  score,
  parts,
  line,
  right,
}: {
  score: number;
  parts: { pct: number; earnedFrac: number }[];
  line: ReactNode;
  right: ReactNode;
}) {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <div className="score-left">
        <span className="label">Readiness</span>
        <div className="score-readout num">
          <CountUp
            to={score}
            dec={0}
            dur={900}
            onDone={() => setTimeout(() => setArmed(true), 160)}
            className="score-big"
            ariaLabel={`Readiness ${score} of 100`}
          />
          <small>of 100</small>
        </div>
        <p className="score-line">{line}</p>
        {right}
      </div>
      <div className="score-right">
        <div className="seg-head">
          <span className="label">Breakdown</span>
          <span className="label num">40 / 25 / 20 / 15</span>
        </div>
        <SegRubricBar parts={parts} armed={armed} height={16} ariaLabel={`Score ${score} of 100`} />
      </div>
    </>
  );
}

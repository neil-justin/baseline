"use client";

import { useState, type ReactNode } from "react";
import CountUp from "@/components/CountUp";
import { SegRubricBar } from "@/components/instrument";

/**
 * The measurement sequence (prototype `data-sequence` semantics): the score
 * counts up, the segmented five-channel bar arms ~160ms after it settles.
 * v7 places it in the header band — the composite is the headline, the
 * segs + channel labels sit beside it (Material state language only, no
 * entrance motion; the count-up IS the measurement).
 */
export default function ScoreSequence({
  score,
  parts,
  labels,
  suffix,
  ratemsg,
  fine,
}: {
  score: number;
  parts: { pct: number; earnedFrac: number }[];
  /** per-channel label row under the bar, computed ("SP 19/25", "AR —") */
  labels: ReactNode[];
  /** honest subtext after "/ 100" — empty string once the plan has moved */
  suffix: string;
  /** "Computed from your own records · NACE-aligned" */
  ratemsg: string;
  /** second fine-print line (the "% ready for …" readout line) */
  fine: ReactNode;
}) {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <div className="composite-wrap">
        <div className="composite">
          <CountUp
            to={score}
            dec={0}
            dur={900}
            onDone={() => setTimeout(() => setArmed(true), 160)}
            className="score-big"
            ariaLabel={`Readiness ${score} of 100`}
          />
          <span className="c-of num">/ 100{suffix}</span>
        </div>
        <div className="ratemsg">{ratemsg}</div>
        {fine && <div className="ratemsg num">{fine}</div>}
      </div>
      <div className="segs">
        <SegRubricBar
          parts={parts}
          armed={armed}
          height={8}
          ariaLabel={`Score ${score} of 100 — the five channels`}
        />
        <div className="seglabels num">
          {labels.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
      </div>
    </>
  );
}

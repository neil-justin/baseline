"use client";

import { useState } from "react";
import CountUp from "@/components/CountUp";

/**
 * The Profile tab's measurement — port of prototype/profile.html's readout:
 * the score counts up once visible and the rubric-mini arms ~160ms after it
 * settles (shared motion grammar, data-sequence semantics).
 */
export default function ProfileReadout({
  score,
  parts,
  closed,
  mapSize,
  byCheck,
  bySelf,
  asOf,
  careerName,
  strandLabel,
  labels,
}: {
  score: number;
  parts: { pct: number; earnedFrac: number }[];
  closed: number;
  mapSize: number;
  byCheck: number;
  bySelf: number;
  asOf: string;
  careerName: string;
  strandLabel: string;
  labels: string[]; // Skills / People / Training / Direction
}) {
  const [armed, setArmed] = useState(false);
  return (
    <div className="panel readout" data-sequence>
      <div className="readout-head">
        <div>
          <span className="label num">Readiness · {asOf}</span>
          <div className="readout-sub">out of 100 · {careerName} · {strandLabel}</div>
        </div>
        <div className="readout-score num">
          <CountUp
            to={score}
            dec={0}
            dur={900}
            onDone={() => setTimeout(() => setArmed(true), 160)}
            ariaLabel={`Readiness ${score} of 100`}
          />
          <small>/100</small>
        </div>
      </div>
      <div
        className={armed ? "rubric-mini armed" : "rubric-mini"}
        role="img"
        aria-label={`Score ${score} of 100 — skills ${Math.round(parts[0].earnedFrac * 40)} of 40, people skills ${Math.round(parts[1].earnedFrac * 25)} of 25, training ${Math.round(parts[2].earnedFrac * 20)} of 20, career direction ${Math.round(parts[3].earnedFrac * 15)} of 15`}
      >
        {parts.map((p, i) => (
          <div key={i} className="seg" style={{ flex: p.pct }}>
            <i style={{ ["--earn" as string]: String(p.earnedFrac) }} />
          </div>
        ))}
      </div>
      <div className="readout-legend num">
        <span><b>{labels[0]}</b> {Math.round(parts[0].earnedFrac * 40)}/40</span>
        <span><b>{labels[1]}</b> {Math.round(parts[1].earnedFrac * 25)}/25</span>
        <span><b>{labels[2]}</b> {Math.round(parts[2].earnedFrac * 20)}/20</span>
        <span><b>{labels[3]}</b> {Math.round(parts[3].earnedFrac * 15)}/15</span>
      </div>
      <div className="readout-fit num">
        <b>{closed} of {mapSize}</b> skill bars closed · {byCheck} by check, {bySelf} self-reported
      </div>
    </div>
  );
}

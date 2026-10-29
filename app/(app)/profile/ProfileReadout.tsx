"use client";

import { useState } from "react";
import CountUp from "@/components/CountUp";
import { WEIGHTS, type Score } from "@/lib/engines/score";

/**
 * The Profile tab's measurement — port of prototype/profile.html's readout:
 * the score counts up once visible and the rubric-mini arms ~160ms after it
 * settles (shared motion grammar, data-sequence semantics). The legend is
 * engine-fed only; an unmeasured AR reads "—" (never a painted zero).
 */
export default function ProfileReadout({
  score: total,
  values,
  closed,
  mapSize,
  byCheck,
  bySelf,
  asOf,
  careerName,
  strandLabel,
  labels,
}: {
  /** the computed headline */
  score: number;
  /** the computed sub-values in legend order (sp · es · tp · ar · cc) */
  values: Score;
  closed: number;
  mapSize: number;
  byCheck: number;
  bySelf: number;
  asOf: string;
  careerName: string;
  strandLabel: string;
  labels: string[]; // Skills / Employability / Training / Application / Direction
}) {
  const [armed, setArmed] = useState(false);
  const vals: (number | null)[] = [values.sp, values.es, values.tp, values.ar, values.cc];
  const maxes = [WEIGHTS.sp, WEIGHTS.es, WEIGHTS.tp, WEIGHTS.ar, WEIGHTS.cc];
  return (
    <div className="panel readout" data-sequence>
      <div className="readout-head">
        <div>
          <span className="label num">Readiness · {asOf}</span>
          <div className="readout-sub">out of 100 · {careerName} · {strandLabel}</div>
        </div>
        <div className="readout-score num">
          <CountUp
            to={total}
            dec={0}
            dur={900}
            onDone={() => setTimeout(() => setArmed(true), 160)}
            ariaLabel={`Readiness ${total} of 100`}
          />
          <small>/100</small>
        </div>
      </div>
      <div
        className={armed ? "rubric-mini armed" : "rubric-mini"}
        role="img"
        aria-label={`Score ${total} of 100 — ${labels
          .map((l, i) => `${l.toLowerCase()} ${vals[i] === null ? "not yet measured" : `${vals[i]} of ${maxes[i]}`}`)
          .join(", ")}`}
      >
        {maxes.map((m, i) => (
          <div
            key={i}
            className="seg"
            style={{ flex: m, ["--earn" as string]: String(vals[i] === null ? 0 : (vals[i] as number) / m) }}
          >
            <i />
          </div>
        ))}
      </div>
      <div className="readout-legend num">
        {labels.map((l, i) => (
          <span key={l}>
            <b>{l}</b> {vals[i] === null ? "—" : `${vals[i]}/${maxes[i]}`}
          </span>
        ))}
      </div>
      <div className="readout-fit num">
        <b>{closed} of {mapSize}</b> skill bars closed · {byCheck} by check, {bySelf} self-reported
      </div>
    </div>
  );
}

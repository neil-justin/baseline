"use client";

import { useState } from "react";
import CountUp from "@/components/CountUp";
import { SegRubricBar } from "@/components/instrument";
import { rubricParts } from "@/lib/engines/rubric";
import type { Score } from "@/lib/engines/score";

/**
 * The first-viewport sample instrument — mini career index + sample readout
 * panel, now in the v7 register (wave 3, 2026-11-02). Server side derives the
 * canon sample score (beat-5 state → 40) and each row's honest fit counts;
 * this client component carries the page's only interactions:
 * the row-select sync (fit line) and the data-sequence arm — the ScoreSequence
 * pattern (the count-up IS the measurement; the segmented bar fills ~160ms
 * after the count settles). Honest skin throughout: "SAMPLE STUDENT", legend
 * values per channel, an unmeasured AR reads "—" (never a zero).
 */

const PART_TAGS = ["SP", "ES", "TP", "AR", "CC"] as const;
const PART_NAMES = [
  "skill progress",
  "employability skills",
  "training progress",
  "application readiness",
  "career clarity",
] as const;

export interface GaugeRow {
  name: string;
  /** demonstrated (verified/checked) skills in this career's map */
  x: number;
  /** career skill-map size */
  y: number;
}

export default function SampleGauge({
  rows,
  total,
  score,
  yearLevel,
  track,
}: {
  rows: GaugeRow[];
  total: number;
  score: Score;
  /** sample persona state vocabulary — "4th Year" (SHS-era "Grade 11" is gone) */
  yearLevel: string;
  /** sample persona track — the TRACK_LABELS label ("Computer & IT") */
  track: string;
}) {
  const [sel, setSel] = useState(0);
  const [armed, setArmed] = useState(false);
  // rubricParts derives proportions from the computed score (never painted)
  const parts = rubricParts(score);
  const row = rows[sel];
  // legend values in parts order; an unmeasured AR reads "—" (never a zero)
  const vals: (number | null)[] = [score.sp, score.es, score.tp, score.ar, score.cc];
  const legend = vals.map(
    (v, i) =>
      `${PART_TAGS[i]}${
        v === null ? " —" : ` ${v}/${parts[i].pct}`
      }`
  );

  return (
    <div className="gauge">
      <div className="card mini-card">
        <div className="mini-head">
          <span className="kicker">CAREER INDEX</span>
          <span className="kicker dim">
            {rows.length} of {total} · sample rows
          </span>
        </div>
        {rows.map((r, i) => (
          <button
            key={r.name}
            className="mini-row"
            type="button"
            aria-pressed={i === sel}
            onClick={() => setSel(i)}
          >
            <span className="who">{r.name}</span>
            <span className="fit">
              {r.x} of {r.y}
            </span>
          </button>
        ))}
      </div>

      <div className="card readout">
        <div className="readout-head">
          <div>
            <span className="kicker">
              READINESS · <span className="chip c-grey">SAMPLE STUDENT</span>
            </span>
            <div className="readout-sub" style={{ marginTop: 6 }}>
              out of 100 · {yearLevel} · {track}
            </div>
          </div>
          <div className="readout-score num">
            <CountUp
              to={score.total}
              dec={0}
              dur={900}
              onDone={() => setTimeout(() => setArmed(true), 160)}
              ariaLabel={`Sample readiness ${score.total} of 100`}
            />
            <small>/100</small>
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <SegRubricBar
            parts={parts}
            armed={armed}
            height={10}
            ariaLabel={`Sample score ${score.total} of 100 — ${PART_NAMES.map(
              (n, i) => `${n} ${vals[i] === null ? "not yet measured" : `${vals[i]} of ${parts[i].pct}`}`
            ).join(", ")}`}
          />
        </div>
        <div className="seglab num">
          {legend.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
        <div className="readout-fit">
          <span aria-live="polite">
            <b>
              {row.x} of {row.y}
            </b>{" "}
            skills shown · {row.name}
          </span>
        </div>
      </div>
    </div>
  );
}

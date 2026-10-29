"use client";

import { useState } from "react";
import CountUp from "@/components/CountUp";
import { rubricParts } from "@/lib/engines/rubric";
import type { Score } from "@/lib/engines/score";

/**
 * The first-viewport sample instrument — mini career index + sample readout
 * panel, ported 1:1 from prototype/index.html's #gauge. Server side derives
 * the canon sample score (beat-5 state → 40) and each row's honest fit
 * counts; this client component carries the page's only two interactions:
 * the row-select sync (fit line) and the data-sequence arm (the segmented
 * bar fills 160ms after the readout count settles, via CountUp's onDone).
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
  strand,
}: {
  rows: GaugeRow[];
  total: number;
  score: Score;
  strand: string;
}) {
  const [sel, setSel] = useState(0);
  const [armed, setArmed] = useState(false);
  // rubricParts derives proportions from the computed score (never painted)
  const parts = rubricParts(score);
  const row = rows[sel];
  // legend values in parts order; an unmeasured AR reads "—" (never a zero)
  const vals: (number | null)[] = [score.sp, score.es, score.tp, score.ar, score.cc];

  return (
    <div className="gauge" id="gauge">
      <div className="panel mini-index rv" data-io data-stagger="60" data-cap="300">
        <div className="mini-head">
          <span className="label">CAREER INDEX</span>
          <span className="label">
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
            <span>{r.name}</span>
            <span className="fit">
              {r.x} of {r.y}
            </span>
          </button>
        ))}
      </div>

      <div className="panel readout rv" data-io data-sequence>
        <div className="readout-head">
          <div>
            <span className="label">
              READINESS · <b className="sample-tag">SAMPLE STUDENT</b>
            </span>
            <div className="readout-sub">
              out of 100 · Grade 11 · {strand}
            </div>
          </div>
          <div className="readout-score">
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
        <div
          className={armed ? "rubric-mini armed" : "rubric-mini"}
          role="img"
          aria-label={`Sample score ${score.total} of 100 — ${PART_NAMES.map(
            (n, i) => `${n} ${vals[i] === null ? "not yet measured" : `${vals[i]} of ${parts[i].pct}`}`
          ).join(", ")}`}
        >
          {parts.map((p, i) => (
            <div key={i} className="seg" style={{ flex: p.pct }}>
              <i style={{ ["--earn" as string]: String(p.earnedFrac) }} />
            </div>
          ))}
        </div>
        <div className="readout-legend">
          {PART_TAGS.map((tag, i) => (
            <span key={tag}>
              <b>{tag}</b> {vals[i] === null ? "—" : `${vals[i]}/${parts[i].pct}`}
            </span>
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

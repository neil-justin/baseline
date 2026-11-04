"use client";

import { useState, type ReactNode } from "react";
import CountUp from "@/components/CountUp";

/**
 * The measurement sequence (prototype `data-sequence` semantics): the score
 * counts up, the segmented five-channel bar arms ~160ms after it settles.
 * v7 places it in the header band — the composite is the headline, the
 * segs + channel labels sit beside it (Material state language only, no
 * entrance motion; the count-up IS the measurement).
 *
 * 2026-11-04 (profile round): the five label slots carry the CHANNEL'S
 * FULL NAME over its value — "SP 19/25"-style acronyms were
 * Dashboard-bundled vocabulary; a profile reader must not cross pages to
 * decode their own band. Each label rides --w (the channel's rubric
 * weight) so names center under their weighted segment.
 */
export default function ScoreSequence({
  score,
  channels,
  suffix,
  ratemsg,
  fine,
}: {
  score: number;
  /** per-channel stacked row: the channel's full name, its earned fill
   *  (null = unmeasured — bare track + "—", never a painted zero), value */
  channels: { name: string; value: string; fill?: number | null }[];
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
      {/* the five-channel read — the STACKED register (user ruled
          2026-11-04 after the weighted ribbon buckled on narrow bands:
          rows hold their shape at any width, one row per channel — name ·
          earned track · numeral). Fills arm with the count-up; an
          unmeasured channel never paints a zero fill. */}
      <ul
        className="chanlist"
        aria-label={`Readiness breakdown — ${channels.map((c) => `${c.name} ${c.value}`).join(", ")}`}
      >
        {channels.map((c, i) => (
          <li className="chan-row" key={c.name}>
            <span className="chan-name">{c.name}</span>
            <span className={`chan-track${c.fill == null ? " none" : ""}`}>
              <i
                style={{ width: armed && c.fill != null ? `${Math.min(100, c.fill * 100).toFixed(1)}%` : "0%" }}
              />
            </span>
            <span className="chan-val num">{c.value}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CSSProperties, MouseEvent } from "react";

export interface RowSeg {
  /** rubric weight → flex ("pct") */
  weight: number;
  /** earned fraction of this part, 0–1 ("--earn") */
  earn: number;
}

/**
 * One cohort row (Round-8 lock: plain roster + obvious row marks, not
 * reordering). Client component because the whole row is the click target
 * (the name and VIEW links are the accessible paths), and the row mounts
 * the stacked-bar fill.
 *
 * Row marks (visible entities the counselor reads, zero triage logic —
 * derived only from computed state + the audit queue, page.tsx): pending
 * credential audits · below-cohort-average score · no recorded activity.
 * Read-only stays enforced by the ABSENCE of controls: a row navigates, it
 * never mutates.
 */
export default function StudentRow({
  id,
  name,
  sub,
  career,
  score,
  pending,
  belowAvg,
  noActivity,
  segs,
  active,
  ariaLabel,
  isDemo = false,
}: {
  id: string;
  name: string;
  /** compact sub-line that wraps under the name cell ("4th Year · Computer & IT") */
  sub: string;
  /** declared career, or null for "Still deciding" */
  career: string | null;
  /** computed integer, sub-scores already summed upstream */
  score: number;
  /** declared credentials waiting on the counselor audit (queue-backed) */
  pending: number;
  /** strictly under the cohort average (a measurement fact, never a verdict) */
  belowAvg: boolean;
  /** the state's event log is empty — nothing done since seeding */
  noActivity: boolean;
  segs: RowSeg[];
  active: string;
  ariaLabel: string;
  isDemo?: boolean;
}) {
  const router = useRouter();

  const href = `/admin/student?student=${id}`;

  function onRowClick(e: MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("a")) return; // real links handle themselves
    router.push(href);
  }

  const marks: { label: string; tone: "amber" | "grey" }[] = [];
  if (pending > 0) marks.push({ label: `NEEDS AUDIT · ${pending}`, tone: "amber" });
  if (belowAvg) marks.push({ label: "BELOW AVG", tone: "grey" });
  if (noActivity) marks.push({ label: "NO ACTIVITY YET", tone: "grey" });

  return (
    <div
      className={`s-row${isDemo ? " row-demo" : ""}`}
      onClick={onRowClick}
    >
      <span className="s-name">
        <span className="s-name-line">
          <Link className="s-name-link" href={href}>
            {name}
          </Link>
          {isDemo && <span className="demo-tag">DEMO</span>}
        </span>
        <span className="s-sub">{sub}</span>
        {marks.length > 0 && (
          <span className="s-marks">
            {marks.map((m) => (
              <span className={`chip mark-${m.tone}`} key={m.label}>
                {m.label}
              </span>
            ))}
          </span>
        )}
      </span>
      <span className="s-career">{career ?? "Still deciding"}</span>
      <span className="s-score num">{score}</span>
      <span className="cbar-cell">
        <span className="cbar" role="img" aria-label={ariaLabel}>
          {segs.map((s, i) => (
            <span className="cseg" key={i} style={{ flex: s.weight }}>
              <i
                style={
                  {
                    "--earn": `${s.earn}`,
                    "--d": `${i * 80}ms`,
                  } as CSSProperties
                }
              />
            </span>
          ))}
        </span>
      </span>
      <span className="s-active">{active}</span>
      <span>
        <Link className="s-view" href={href}>
          VIEW →
        </Link>
      </span>
    </div>
  );
}

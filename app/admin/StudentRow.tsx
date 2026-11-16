"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

/**
 * One cohort row (Round-8 lock: plain roster + obvious row marks, not
 * reordering). Client component because the whole row is the click target —
 * the name link is the accessible path. 2026-11-04 user ruling: NO progress
 * strip and NO open column — both were redundant with the row affordance;
 * progression detail lives on the per-student surface.
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
  year="—",
  program="—",
  career,
  score,
  pending,
  belowAvg,
  noActivity,
  active,
  isDemo = false,
}: {
  id: string;
  name: string;
  /** the year column ("4th Year"), split from the old merged sub-line */
  year: string;
  /** the program column ("Computer & IT"), its sibling split */
  program: string;
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
  active: string;
  isDemo?: boolean;
}) {
  const router = useRouter();

  const href = `/admin/student?student=${id}`;

  function onRowClick(e: MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("a")) return; // real links handle themselves
    router.push(href);
  }

  const marks: { label: string; tone: "warn" | "blue" }[] = [];
  if (pending > 0) marks.push({ label: `NEEDS AUDIT — ${pending}`, tone: "warn" });
  if (belowAvg) marks.push({ label: "BELOW AVG", tone: "blue" });
  if (noActivity) marks.push({ label: "NO ACTIVITY YET", tone: "blue" });

  return (
    <div
      className={`atabs-row atabs-cohort-grid${isDemo ? " atabs-row-demo" : ""}`}
      onClick={onRowClick}
    >
      <div className="atabs-cellname">
        <span className="atabs-name">
          <Link className="atabs-name-link" href={href}>
            {name}
          </Link>
          {isDemo && <span className="atabs-chip atabs-chip-warn">DEMO</span>}
        </span>
        {marks.length > 0 && (
          <span className="atabs-marks">
            {marks.map((m) => (
              <span className={`atabs-chip atabs-chip-${m.tone}`} key={m.label}>
                {m.label}
              </span>
            ))}
          </span>
        )}
      </div>
      <span className="atabs-meta atabs-col-collapsible">{year}</span>
      <span className="atabs-copy atabs-col-collapsible">{program}</span>
      <span className="atabs-copy">{career ?? "Still deciding"}</span>
      <span className="atabs-num">{score}</span>
      <span className="atabs-meta">{active}</span>
    </div>
  );
}

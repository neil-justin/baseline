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
  sub,
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
  active: string;
  isDemo?: boolean;
}) {
  const router = useRouter();

  const href = `/admin/student?student=${id}`;

  function onRowClick(e: MouseEvent<HTMLTableRowElement>) {
    if ((e.target as HTMLElement).closest("a")) return; // real links handle themselves
    router.push(href);
  }

  const marks: { label: string; tone: "amber" | "grey" }[] = [];
  if (pending > 0) marks.push({ label: `NEEDS AUDIT · ${pending}`, tone: "amber" });
  if (belowAvg) marks.push({ label: "BELOW AVG", tone: "grey" });
  if (noActivity) marks.push({ label: "NO ACTIVITY YET", tone: "grey" });

  return (
    <tr
      className={`s-row${isDemo ? " row-demo" : ""}`}
      onClick={onRowClick}
    >
      <td className="s-name">
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
      </td>
      <td className="s-career">{career ?? "Still deciding"}</td>
      <td className="s-score num">{score}</td>
      <td className="s-active">{active}</td>
    </tr>
  );
}

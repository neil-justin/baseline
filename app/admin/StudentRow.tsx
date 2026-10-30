"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, type CSSProperties, type MouseEvent } from "react";
import { observeReveal } from "@/lib/motion";

export interface RowSeg {
  /** rubric weight → flex ("pct") */
  weight: number;
  /** earned fraction of this part, 0–1 ("--earn") */
  earn: number;
}

/**
 * One cohort row — ported from prototype/admin.html's `.s-row` block.
 * Client component because the whole row is the click target (the name and
 * VIEW links are the accessible paths; this is the fast path), and the row
 * carries its own reveal (`rv` → `.in`) which gates the stacked-bar fills.
 */
export default function StudentRow({
  id,
  name,
  sub,
  career,
  score,
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
  segs: RowSeg[];
  active: string;
  ariaLabel: string;
  isDemo?: boolean;
}) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => observeReveal(ref.current!) ?? undefined, []);

  const href = `/admin/student?student=${id}`;

  function onRowClick(e: MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("a")) return; // real links handle themselves
    router.push(href);
  }

  return (
    <div
      ref={ref}
      className={`s-row rv${isDemo ? " row-demo" : ""}`}
      onClick={onRowClick}
    >
      <span className="s-name">
        <Link className="s-name-link" href={href}>
          {name}
        </Link>
        {isDemo && <span className="demo-tag">DEMO</span>}
      </span>
      <span className="s-sub">{sub}</span>
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

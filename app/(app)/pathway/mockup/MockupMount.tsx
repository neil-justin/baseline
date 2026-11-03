"use client";

/**
 * MockupMount — the hash-gated Mini-LMS mockup mount (post-defense
 * exploration, user-ruled 2026-11-03). PathwayTabs owns the hash parse
 * (#mockup / #mockup-b / #mockup-c, #plan / #resources restore the
 * defended tabs) and passes the variant on; the stage model builds fresh
 * from the SAME engine-fed PlanTab + ResourcesTab data the defended
 * surface reads — no new engine, no new fixtures, no persistence.
 *
 * Variants are each owned by their own files (parallel-wave rule):
 *   variant-a.tsx / variant-a.css — A · vertical spine
 *   variant-b.tsx / variant-b.css — B · alternating spine
 *   variant-c.tsx / variant-c.css — C · LMS rail
 */
import { useMemo } from "react";
import type { PlanTab, ResourcesTab } from "../PathwayTabs";
import type { SpecLite } from "../PathwayTabs";
import { buildStages, type MockupProps, type TrackId } from "./stages";
import { buildCanon, type CanonProps } from "./canon";
import MockupSpine from "./variant-a";
import MockupAlternate from "./variant-b";
import MockupRail from "./variant-c";
import MockupLane from "./variant-d1";
import MockupRegions from "./variant-d2";
import MockupUnits from "./variant-d3";
import "./mockup.css";

export type MockVariant = "a" | "b" | "c" | "d1" | "d2" | "d3";

const LABELS = {
  a: "A · Spine",
  b: "B · Alternating",
  c: "C · LMS rail",
  d1: "D1 · Two-lane",
  d2: "D2 · Regions",
  d3: "D3 · Units",
} as const;

export default function MockupMount({
  careerName,
  track,
  specs,
  plan,
  resources,
  variant,
}: {
  careerName: string;
  track: string | null;
  specs: SpecLite[];
  plan: PlanTab;
  resources: ResourcesTab;
  variant: MockVariant;
}) {
  const stages = useMemo(() => buildStages(plan, resources, track), [plan, resources, track]);
  const canon: CanonProps = useMemo(
    () => buildCanon(specs, plan, resources),
    [specs, plan, resources]
  );
  const oldProps: MockupProps = { careerName, stages };
  const canonDProps = { careerName, ...canon };

  return (
    <div className="v7mock">
      {variant === "a" ? (
        <MockupSpine {...oldProps} />
      ) : variant === "b" ? (
        <MockupAlternate {...oldProps} />
      ) : variant === "c" ? (
        <MockupRail {...oldProps} />
      ) : variant === "d1" ? (
        <MockupLane {...canonDProps} />
      ) : variant === "d2" ? (
        <MockupRegions {...canonDProps} />
      ) : (
        <MockupUnits {...canonDProps} />
      )}
      <nav className="mock-switch" aria-label="Mockup layout switcher">
        <span className="mock-note">Design mockup — not persisted, not the defended surface</span>
        <span className="mock-links">
          {(Object.keys(LABELS) as Array<keyof typeof LABELS>).map((k) => (
            <a key={k} href={k === "a" ? "#mockup" : `#mockup-${k}`} className={variant === k ? "on" : undefined}>
              {LABELS[k]}
            </a>
          ))}
          <a href="#plan" className="mock-close" aria-label="Close mockup">
            ✕
          </a>
        </span>
      </nav>
    </div>
  );
}

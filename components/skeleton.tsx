"use client";

/**
 * Shared skeleton primitives (agent E, user deferral 2026-11-06: skeletons
 * after the onboarding rework). Two minimal placeholders — a single grey bar
 * (`.skel`) and a panel-shaped block (`.skel-block`, title + N text bars) —
 * pulsing per DESIGN.md's Skeleton Rule (#E8EAED → #F1F3F4, 1.4s ease,
 * reduced-motion aware). No spinners, no deps: the pulse lives in the
 * consuming surface's own CSS (onboarding.css hosts `.skel-*`).
 */

/** One grey placeholder bar; width/height tune via the surface's CSS. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <span className={className ? `skel ${className}` : "skel"} aria-hidden="true" />;
}

/** A panel-shaped placeholder: a wider title bar + `lines` text bars. */
export function SkeletonBlock({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={className ? `skel-block ${className}` : "skel-block"} aria-hidden="true">
      <Skeleton className="skel-title" />
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} />
      ))}
    </div>
  );
}

/* ---------- shape-only variants (fix 1, 2026-11-06: skeletons mirror the
 * screen they stand in for). Bar shape lives in the consuming surface's CSS
 * (.skel-card*, .skel-q*); these render no text and no logic. ---------- */

/** One career card placeholder: thin fit-line bar, bold-width name bar,
 * two summary bars, the core-skills bar, the Choose pill bar. */
export function SkeletonCareerCard() {
  return (
    <div className="skel-card" aria-hidden="true">
      <Skeleton className="skel-fit" />
      <Skeleton className="skel-name" />
      <Skeleton />
      <Skeleton />
      <Skeleton className="skel-skills" />
      <Skeleton className="skel-pill" />
    </div>
  );
}

/** The ranked/picker card grid placeholder — `count` card shapes on the
 * same grid register the real screen uses. */
export function SkeletonCareerCards({ count = 3 }: { count?: number }) {
  return (
    <div className="skel-card-grid">
      {Array.from({ length: Math.max(count, 1) }, (_, i) => (
        <SkeletonCareerCard key={i} />
      ))}
    </div>
  );
}

/** A question-card placeholder: tag-row bar, stem bars, then either the
 * option bars (checks / quiz items) or the 5-chip scale row (NACE Likert
 * statements), and the CTA pill bar. */
export function SkeletonQuestionCard({
  options = 4,
  chips = false,
  className = "",
}: {
  options?: number;
  chips?: boolean;
  className?: string;
}) {
  return (
    <div className={className ? `skel-qcard ${className}` : "skel-qcard"} aria-hidden="true">
      <Skeleton className="skel-tag" />
      <Skeleton className="skel-stem" />
      <Skeleton className="skel-stem skel-stem-short" />
      {chips ? (
        <div className="skel-chiprow">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="skel-chip" />
          ))}
        </div>
      ) : (
        <div className="skel-opts">
          {Array.from({ length: Math.max(options, 1) }, (_, i) => (
            <Skeleton key={i} className="skel-opt" />
          ))}
        </div>
      )}
      <Skeleton className="skel-pill" />
    </div>
  );
}

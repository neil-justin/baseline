/** Instrument components — The Index shared vocabulary. Server-safe (no hooks). */

export function Label({ children }: { children: React.ReactNode }) {
  return <span className="label">{children}</span>;
}

export function VBadge({ ok, children }: { ok?: boolean; children: React.ReactNode }) {
  return <span className={`vbadge ${ok ? "ok" : ""}`}>{children}</span>;
}

export function HairlinePanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`panel ${className}`}>{children}</div>;
}

export function NextCard({
  head,
  why,
  target,
  cta,
  ctaHref,
}: {
  head: string;
  why: string;
  target: string;
  cta: string;
  ctaHref: string;
}) {
  return (
    <div className="nextcard">
      <h2 className="n-head">{head}</h2>
      <p className="n-why">{why}</p>
      <p className="n-target num">{target}</p>
      <div className="n-cta">
        <a className="btn btn-primary" href={ctaHref}>
          {cta} <span className="arrow">↵</span>
        </a>
      </div>
    </div>
  );
}

export function Tickers({ lines }: { lines: { html: string; href: string }[] }) {
  return (
    <div className="panel tickers">
      {lines.map((l, i) => (
        <a key={i} className="tickline num" href={l.href} dangerouslySetInnerHTML={{ __html: l.html }} />
      ))}
    </div>
  );
}

export function OkBand({ children }: { children: React.ReactNode }) {
  return <div className="okband">{children}</div>;
}

export function QBand({ pass, children }: { pass?: boolean; children: React.ReactNode }) {
  return <div className={`q-band ${pass === undefined ? "" : pass ? "pass" : "fail"} show`}>{children}</div>;
}

/**
 * Segmented rubric bar — the honest scaleX fractions. `armed` gates the fill
 * transition (set true ~160ms after the readout count completes); disabled
 * under prefers-reduced-motion via CSS.
 */
export function SegRubricBar({
  parts,
  armed = false,
  height = 14,
  ariaLabel,
}: {
  /** parts flattened to percentages of 100 (the locked rubric) */
  parts: { pct: number; earnedFrac: number }[];
  armed?: boolean;
  height?: number;
  ariaLabel?: string;
}) {
  // NOTE: the ported CSS is `.armed .segbar .seg i` — armed must sit on an
  // ANCESTOR of the bar (prototype semantics: #rubric-mini gets the class).
  return (
    <div className={armed ? "armed" : ""}>
      <div className="segbar" style={{ height }} role="img" aria-label={ariaLabel}>
        {parts.map((p, i) => (
          <div key={i} className="seg" style={{ flex: p.pct }}>
            <i style={{ ["--earn" as string]: String(p.earnedFrac) }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Honest gap row — name, 8px earned bar, mono source badge. */
export function GapRow({
  name,
  earnedFrac,
  badge,
  badgeOk,
}: {
  name: string;
  earnedFrac: number;
  badge: string;
  badgeOk?: boolean;
}) {
  return (
    <div className="gap-row">
      <div className="g-name">{name}</div>
      <span className={`g-badge ${badgeOk ? "" : "g-badge-plain"}`}>
        <VBadge ok={badgeOk}>{badge}</VBadge>
      </span>
      <div className="g-bar" aria-label={`${name}: ${badge}`}>
        <i style={{ ["--earn" as string]: String(earnedFrac) }} />
      </div>
    </div>
  );
}

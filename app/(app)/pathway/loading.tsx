import "./pathway.css";

/**
 * Tier 3.5 route skeleton — My Plan (amended 2026-11-04: TEXT-FREE,
 * re-aligned to the Take 3 header ruling). Mirrors the committed DEFAULT
 * arrival state: the planhead card (progress ring + title/meta + the
 * bare up-next line) → the spine walk (node discs + roomy white cards).
 * NO real text — every label is a shape bar; one polite status region
 * announces. Pulse gated by prefers-reduced-motion (../v7.css .skel).
 */
export default function Loading() {
  return (
    <div className="v7plan" role="status" aria-busy="true" aria-label="Loading My Plan">
      <div aria-hidden="true">
        {/* the header card: ring (track only — no arc paints a fraction
            the engine never computed) + title/meta/up-next bars */}
        <section className="planhead">
          <div className="plan-ring">
            <svg viewBox="0 0 130 130" aria-hidden="true">
              <circle className="plan-ring-track" cx="65" cy="65" r="56" strokeWidth="9" />
            </svg>
            <span className="plan-ring-mid">
              <span className="skel" style={{ width: 56, height: 24 }} />
            </span>
          </div>
          <div className="plan-head">
            <span className="skel" style={{ width: 110, height: 24 }} />
            <span className="skel" style={{ width: 330, height: 16, marginTop: 8, display: "block" }} />
            <span className="skel" style={{ width: 74, height: 11, marginTop: 18, display: "block" }} />
            <span className="skel" style={{ width: 280, height: 15, marginTop: 7, display: "block" }} />
          </div>
        </section>

        {/* the spine walk: node disc + card bars per row */}
        <ol className="vd2-map" style={{ listStyle: "none", margin: "18px 0 0", padding: 0 }}>
          {Array.from({ length: 4 }, (_, r) => (
            <li className="vd2-row" key={r} style={{ position: "relative" }}>
              <span
                className="skel"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 999,
                  position: "absolute",
                  left: "calc(var(--vd2-spine-x) - var(--vd2-node) / 2)",
                  top: 4,
                }}
              />
              <div className="vd2-ncard">
                <span className="skel" style={{ width: 150 + (r % 3) * 44, height: 17, display: "block" }} />
                <span
                  className="skel"
                  style={{ width: `${58 - (r % 3) * 7}%`, height: 13, marginTop: 8, display: "block" }}
                />
                {r % 2 === 0 ? (
                  <span className="skel" style={{ width: 210, height: 13, marginTop: 12, display: "block" }} />
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

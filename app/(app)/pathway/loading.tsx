import "./walk.css";
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
        {/* the header card: ring-slot (track only — no arc paints a fraction
            the engine never computed; `checked`'s label bar beneath, the
            page's .plan-ring-slot mirror) + title/meta/up-next bars */}
        <section className="planhead">
          <div className="plan-ring-slot">
            <div className="plan-ring">
              <svg viewBox="0 0 130 130" aria-hidden="true">
                <circle className="plan-ring-track" cx="65" cy="65" r="56" strokeWidth="9" />
              </svg>
              <span className="plan-ring-mid">
                <span className="skel" style={{ width: 56, height: 24 }} />
              </span>
            </div>
            <span className="skel" style={{ width: 54, height: 11 }} />
          </div>
          <div className="plan-head">
            <span className="skel" style={{ width: 110, height: 24 }} />
            <span className="skel" style={{ width: "min(330px, 100%)", height: 16, marginTop: 8, display: "block" }} />
            <span className="skel" style={{ width: 74, height: 11, marginTop: 18, display: "block" }} />
            <span className="skel" style={{ width: "min(280px, 100%)", height: 15, marginTop: 7, display: "block" }} />
          </div>
        </section>

        {/* the spine walk: node disc + card bars per row — NO inline geometry
            here: walk.css owns list-style/margins and the .vd2-map centering
            (the old inline margin: 18px 0 0 zeroed the auto margins and
            slid the column off the 820px cap; position/padding are class
            styles too) */}
        <ol className="vd2-map">
          {Array.from({ length: 4 }, (_, r) => (
            <li className="vd2-row" key={r}>
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
                  <span className="skel" style={{ width: "min(210px, 100%)", height: 13, marginTop: 12, display: "block" }} />
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

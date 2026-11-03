import "./prep.css";

/**
 * Tier 3.5 route skeleton — Prep (amended 2026-11-03: TEXT-FREE, per-section
 * cards). Mirrors the committed stage order (named band with its readiness
 * composite → the three channel KPI cards → the `.prep-lens` segmented
 * toolbar → the card stack) using the page's REAL structural classes. NO real
 * text — the h1, channel labels/values, tab labels and card copy are shape
 * bars; one polite status region announces. Pulse gated by
 * prefers-reduced-motion (../v7.css .skel).
 */
export default function Loading() {
  return (
    <div className="v7prep prep-surface" role="status" aria-busy="true" aria-label="Loading Prep">
      <div aria-hidden="true">
        <header className="band">
          <div className="bandrow">
            <div className="who">
              <span className="skel" style={{ width: 62, height: 20 }} />
              <span className="skel" style={{ width: 300, height: 19, marginTop: 6 }} />
            </div>
            <div className="composite-wrap prep-readiness">
              <span className="skel" style={{ width: 74, height: 44, display: "inline-block" }} />
              <span className="skel" style={{ width: 118, height: 13, marginTop: 6, display: "block" }} />
            </div>
          </div>
        </header>

        <section className="prep-kpis">
          {Array.from({ length: 3 }, (_, i) => (
            <div className="prep-kpi" key={i}>
              <span className="skel" style={{ width: 68, height: 15 }} />
              <div className="skel" style={{ width: 52, height: 20, marginTop: 8 }} />
              {/* the card anatomy is name → score → 4px kbar → chip → note:
                  the bar shape reserves the row even pre-data */}
              <div className="skel" style={{ width: "100%", height: 4, marginTop: 12 }} />
              <div className="skel" style={{ width: 76, height: 16, marginTop: 12 }} />
              <div className="skel" style={{ width: 150, height: 12, marginTop: 9 }} />
            </div>
          ))}
        </section>

        <div className="prep-lens">
          <div className="ptabs">
            <span className="skel" style={{ width: 84, height: 30, borderRadius: 6 }} />
            <span className="skel" style={{ width: 70, height: 30, borderRadius: 6 }} />
          </div>
        </div>

        <div className="prep-stack">
          <section className="card panel-sec">
            <span className="skel" style={{ width: 190, height: 12 }} />
            <span className="skel" style={{ width: 330, height: 16, marginTop: 8, display: "block" }} />
            <span className="skel" style={{ width: 250, height: 12, marginTop: 12, display: "block" }} />
          </section>
          {Array.from({ length: 3 }, (_, i) => (
            <section className="card rs-fgroup" key={i}>
              <span className="skel" style={{ width: 84, height: 15 }} />
              <div className="skel" style={{ width: "100%", height: 4, marginTop: 10 }} />
              <span className="skel" style={{ width: 220, height: 12, marginTop: 10, display: "block" }} />
              <span className="skel" style={{ width: "100%", height: 12, marginTop: 16, display: "block" }} />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

import "./prep.css";

/**
 * Tier 3.5 route skeleton — Prep (amended 2026-11-03: TEXT-FREE).
 * Mirrors the committed stage order (the named band with its instrument
 * bandcells → the `.prep-lens` segmented toolbar → the tabpanel card's
 * dropzone stage) using the page's REAL structural classes. NO real text —
 * the h1, bandcell labels/values, tab labels and dropzone copy are shape
 * bars; one polite status region announces. Pulse gated by
 * prefers-reduced-motion (../v7.css .skel).
 */
export default function Loading() {
  return (
    <div className="v7prep" role="status" aria-busy="true" aria-label="Loading Prep">
      <div aria-hidden="true">
        <header className="band">
          <div className="bandrow">
            <div className="who">
              <span className="skel" style={{ width: 62, height: 20 }} />
              <span className="skel" style={{ width: 300, height: 19, marginTop: 6 }} />
            </div>
            <div className="bandcells">
              {Array.from({ length: 4 }, (_, i) => (
                <div className="bcell" key={i}>
                  <span className="skel" style={{ width: 68, height: 15 }} />
                  <div className="skel" style={{ width: 60, height: 18, marginTop: 5 }} />
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="prep-lens">
          <div className="ptabs">
            <span className="skel" style={{ width: 84, height: 30, borderRadius: 6 }} />
            <span className="skel" style={{ width: 70, height: 30, borderRadius: 6 }} />
          </div>
          <span className="kicker num">
            <span className="skel" style={{ width: 190, height: 15 }} />
          </span>
        </div>

        <section className="card tabpanel">
          <div className="dz-zone">
            <span className="skel" style={{ width: 28, height: 28, borderRadius: 6 }} />
            <span className="skel" style={{ width: 234, height: 20 }} />
            <span className="skel" style={{ width: 318, height: 17 }} />
          </div>
        </section>
      </div>
    </div>
  );
}

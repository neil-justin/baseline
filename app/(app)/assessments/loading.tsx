import "./assessments.css";

/**
 * Route skeleton — Assessments (2026-11-04 build, TEXT-FREE).
 * Mirrors the committed stage order: the NAMED band (h1 + m-line, no
 * composite) → the NACE card (two-fact readout → receipt lines → primary
 * slot) → the role card (whole-battery tray → per-skill rows). Uses the
 * page's REAL structural classes so the swap-in reserves the same heights
 * (CLS contract); every label is a shape bar. One polite status region
 * announces. Pulse gated by prefers-reduced-motion (../v7.css .skel).
 */
export default function Loading() {
  return (
    <div className="v7ass" role="status" aria-busy="true" aria-label="Loading Assessments">
      <div aria-hidden="true">
        <header className="band">
          <div className="bandrow">
            <div className="who">
              {/* the drawn checksheet's SLOT as a grey shape (88px, the page
                  art's render size) — the coloured art itself never renders
                  in a skeleton (static-chrome rule: pure track-grey until
                  the data lands, user feedback 2026-11-04) */}
              <span className="skel" style={{ width: 88, height: 88, borderRadius: 12, flex: "none" }} />
              <div>
                <span className="skel" style={{ width: 160, height: 22 }} />
                <span className="skel" style={{ width: 430, height: 16, marginTop: 8, display: "block" }} />
              </div>
            </div>
          </div>
        </header>

        <div className="asscards">
          {/* NACE card */}
          <section className="card">
            <div className="head">
              <span className="skel" style={{ width: 210, height: 19 }} />
              <span className="skel" style={{ width: 180, height: 16 }} />
            </div>
            <div className="nace-facts">
              <div className="nfact">
                <span className="skel" style={{ width: 92, height: 13 }} />
                <span className="skel" style={{ width: 74, height: 28, marginTop: 5 }} />
              </div>
              <div className="nfact">
                <span className="skel" style={{ width: 62, height: 13 }} />
                <span className="skel" style={{ width: 58, height: 28, marginTop: 5 }} />
              </div>
            </div>
            <div className="lcap">
              <span className="skel" style={{ width: 250, height: 15 }} />
            </div>
            <div className="cta-row">
              <span className="skel" style={{ width: 186, height: 40, borderRadius: 999 }} />
            </div>
          </section>

          {/* role card */}
          <section className="card">
            <div className="head">
              <span className="skel" style={{ width: 240, height: 19 }} />
              <span className="skel" style={{ width: 220, height: 16 }} />
            </div>
            <div className="battery">
              <div className="battery-copy">
                <span className="skel" style={{ width: 168, height: 17 }} />
                <span className="skel" style={{ width: 330, height: 14, marginTop: 4 }} />
              </div>
              <span className="skel" style={{ width: 226, height: 40, borderRadius: 999 }} />
            </div>
            <div className="rows-label">
              <span className="skel" style={{ width: 112, height: 13 }} />
            </div>
            <div className="skillrows">
              {Array.from({ length: 6 }, (_, i) => (
                <div className="skillrow" key={i}>
                  <div className="s-main">
                    <span className="skel" style={{ width: i % 2 === 0 ? 420 : 320, height: 18 }} />
                    {i % 3 === 0 && (
                      <span className="skel" style={{ width: 280, height: 13, marginTop: 3 }} />
                    )}
                  </div>
                  <div className="s-side">
                    <span className="skel" style={{ width: i % 3 === 0 ? 92 : 74, height: 24, borderRadius: 8 }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="foot">
              <span className="skel" style={{ width: "72%", height: 14 }} />
              <span className="skel" style={{ width: "54%", height: 14, marginTop: 5, display: "block" }} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

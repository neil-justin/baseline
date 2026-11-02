import "./career.css";

/**
 * Tier 3.5 route skeleton — Careers (amended 2026-11-03: TEXT-FREE).
 * Mirrors the committed stage order (named band + bandcells tray → the lens
 * chips rail → the ONE rolecard holding the match rows) using the page's REAL
 * structural classes. NO real text — the h1, chip labels and row names are
 * shape bars; one polite status region announces. Static-chrome rule kept:
 * the band renders pure track-grey shapes. Pulse gated by
 * prefers-reduced-motion (../v7.css .skel).
 */
export default function Loading() {
  return (
    <div className="v7career" role="status" aria-busy="true" aria-label="Loading Careers">
      <div aria-hidden="true">
        <header className="band">
          <div className="bandrow">
            <div className="who">
              <span className="skel" style={{ width: 110, height: 20 }} />
              <span className="skel" style={{ width: 280, height: 19, marginTop: 6 }} />
            </div>
            <div className="bandside">
              <span className="skel" style={{ width: 150, height: 40, borderRadius: 8 }} />
            </div>
          </div>
          <div className="bandcells">
            {Array.from({ length: 3 }, (_, i) => (
              <div className="bcell" key={i}>
                <span className="skel" style={{ width: 64, height: 15 }} />
                <div className="skel" style={{ width: 118, height: 18, marginTop: 5 }} />
              </div>
            ))}
          </div>
        </header>

        <div className="lens-row">
          <div className="ptabs">
            {Array.from({ length: 5 }, (_, i) => (
              <div className="skel" style={{ width: 58 + (i % 3) * 24, height: 30, borderRadius: 6 }} key={i}></div>
            ))}
          </div>
          <span className="kicker num">
            <span className="skel" style={{ width: 204, height: 15 }} />
          </span>
        </div>

        <div className="card rolecard">
          <div className="match-table">
            {Array.from({ length: 4 }, (_, r) => (
              <div className="match-row" key={r}>
                <div className="m-main">
                  <span className="skel" style={{ width: 150, height: 18 }} />
                  <span className="skel" style={{ width: 40, height: 18 }} />
                </div>
                <span className="skel" style={{ width: 76, height: 19 }} />
                <span className="skel" style={{ width: "62%", height: 16, marginTop: 4 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

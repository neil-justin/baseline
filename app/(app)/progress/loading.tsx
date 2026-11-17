import "./progress.css";

/**
 * Tier 3.5 route skeleton — Progress (amended 2026-11-03: TEXT-FREE).
 * Mirrors the committed stage order (band with the readiness readout → feed
 * card → closed-bars card → goals card) using the page's REAL structural
 * classes; heights reserved, folds inherited. NO real text — the "/100"
 * small and every heading become shape bars; one polite status region
 * announces. Pulse gated by prefers-reduced-motion (../v7.css .skel).
 */
export default function Loading() {
  return (
    <div className="v7prog" role="status" aria-busy="true" aria-label="Loading Progress">
      <div aria-hidden="true">
        <section className="proband">
          <div className="band">
            <div className="bandrow">
              <div className="who">
                <span className="skel" style={{ width: 96, height: 20 }} />
                <span className="skel" style={{ width: "min(260px, 100%)", height: 17, marginTop: 6 }} />
                <span className="skel" style={{ width: "min(310px, 100%)", height: 19, marginTop: 6 }} />
                <div className="prog-ctas">
                  <span className="skel" style={{ width: 150, height: 40, borderRadius: 8 }} />
                  <span className="skel" style={{ width: 124, height: 19 }} />
                </div>
              </div>
              <div className="prog-scale">
                <div className="readout-head">
                  <div>
                    <span className="skel" style={{ width: 132, height: 15 }} />
                    <div style={{ marginTop: 5 }}>
                      <span className="skel" style={{ width: 112, height: 17 }} />
                    </div>
                  </div>
                  <div className="readout-score num">
                    <span className="skel" style={{ width: "2ch", height: 46 }} />
                    <span className="skel" style={{ width: 26, height: 13, verticalAlign: 4 }} />
                  </div>
                </div>
                <div className="rubric-mini">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div className="seg" style={{ flex: 1 }} key={i}>
                      <i />
                    </div>
                  ))}
                </div>
                <div className="prog-subrows">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div className="tickline" key={i}>
                      <span className="skel" style={{ width: `${55 - i * 4}%`, height: 17 }} />
                    </div>
                  ))}
                </div>
                <div className="readout-fit num">
                  <span className="skel" style={{ width: "68%", height: 17 }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="card feed">
          <div className="head">
            <span className="skel" style={{ width: 182, height: 20 }} />
            <span className="skel" style={{ width: "min(228px, 100%)", height: 19 }} />
          </div>
          <div className="feed-cols">
            <span className="skel" style={{ width: 60, height: 15 }} />
            <span className="skel" style={{ width: 50, height: 15 }} />
            <span className="skel" style={{ width: 50, height: 15 }} />
          </div>
          {Array.from({ length: 2 }, (_, r) => (
            <div className="feed-row" key={r}>
              <div className="f-main">
                <span className="skel" style={{ width: "56%", height: 19 }} />
                <span className="skel" style={{ width: "38%", height: 16 }} />
              </div>
              <div className="f-result">
                <span className="skel" style={{ width: 118, height: 17 }} />
                <span className="skel" style={{ width: 126, height: 20 }} />
              </div>
              <span className="skel" style={{ width: 84, height: 17 }} />
            </div>
          ))}
        </section>

        <section className="card">
          <div className="head">
            <span className="skel" style={{ width: 164, height: 20 }} />
            <span className="skel" style={{ width: 186, height: 16 }} />
          </div>
          <div className="closed-list">
            {Array.from({ length: 2 }, (_, r) => (
              <div className="c-gap" key={r}>
                <div className="c-gap-top">
                  <span className="skel" style={{ width: "36%", height: 18 }} />
                  <span className="skel" style={{ width: 92, height: 20 }} />
                </div>
                <div className="g-bar">
                  <i />
                </div>
                <span className="skel" style={{ width: "48%", height: 16 }} />
              </div>
            ))}
          </div>
        </section>

        <section className="card goals">
          <div className="head">
            <span className="skel" style={{ width: 122, height: 20 }} />
          </div>
          <div className="goals-list">
            {Array.from({ length: 2 }, (_, r) => (
              <div className="goal-row active" key={r}>
                <span className="skel" style={{ width: "48%", height: 18 }} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

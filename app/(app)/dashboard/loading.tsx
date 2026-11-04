import "./dashboard.css";

/**
 * Tier 3.5 route skeleton — Dashboard (amended 2026-11-03: TEXT-FREE;
 * 2026-11-04: mirrored onto the D1-gauge hero — the segs strip retired).
 * Follows the committed stage order (band → five channel cells →
 * plan/actions deck → ledger) using the page's REAL structural classes
 * so the swap-in reserves the same heights (CLS contract) and every
 * responsive fold (≤1180/1020/720/560) is inherited. NO real text, no
 * headings, no labels, no painted numbers — shapes only; one polite
 * status region announces. Pulse gated by prefers-reduced-motion
 * (../v7.css .skel).
 */
export default function Loading() {
  return (
    <div className="v7dash" role="status" aria-busy="true" aria-label="Loading the dashboard">
      <div aria-hidden="true">
        <section className="scoreband">
          <div className="band">
            <div className="bandrow hero-row">
              <div className="who">
                <span className="skel" style={{ width: 74, height: 15 }} />
                <div className="score-readout num">
                  <span className="skel" style={{ width: "2.4ch", height: 46 }} />
                  <span className="skel" style={{ width: 30, height: 12, verticalAlign: 6 }} />
                </div>
                <span className="skel" style={{ width: 220, height: 19, marginTop: 10 }} />
              </div>
              {/* the D1 gauge skeleton — track + pivot only: the loader
                  paints no arc or needle for a fraction the engine has
                  not computed */}
              <svg className="scoregauge" viewBox="0 0 300 200" aria-hidden="true">
                <path d="M55 150 A 95 95 0 0 1 245 150" fill="none" stroke="var(--v-rows)" strokeWidth="22" strokeLinecap="round" />
                <circle cx="150" cy="150" r="9" fill="var(--v-rows)" />
              </svg>
            </div>
          </div>
        </section>

        <section className="kpis">
          {Array.from({ length: 5 }, (_, i) => (
            <div className="kpi" key={i}>
              {/* the icon disc placeholder — tonal disc, no glyph (nothing
                  is claimed before the data lands) */}
              <span
                className="skel"
                style={{ width: 34, height: 34, borderRadius: 999, order: -3, marginBottom: 10 }}
              />
              <span className="s-name skel" style={{ width: "72%", height: 18 }} />
              <div className="skel" style={{ width: 58, height: 24 }} />
              <div className="kbar" />
              <span className="skel" style={{ width: 66, height: 20 }} />
            </div>
          ))}
        </section>

        <section className="low">
          <div className="card">
            <div className="head">
              <span className="skel" style={{ width: 158, height: 19 }} />
              <span className="skel" style={{ width: 200, height: 16 }} />
            </div>
            <table className="plan-table">
              <thead>
                <tr>
                  {Array.from({ length: 4 }, (_, i) => (
                    <th key={i}>
                      <span className="skel" style={{ width: 56, height: 15 }} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 3 }, (_, r) => (
                  <tr key={r}>
                    <td>
                      <span className="skel" style={{ width: "72%", height: 18 }} />
                      <span className="skel" style={{ width: "55%", height: 16, marginTop: 5 }} />
                    </td>
                    <td>
                      <span className="skel" style={{ width: 70, height: 20 }} />
                    </td>
                    <td>
                      <span className="skel" style={{ width: 70, height: 20 }} />
                    </td>
                    <td className="eff">
                      <span className="skel" style={{ width: 92, height: 17 }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card actions">
            <div className="head">
              <span className="skel" style={{ width: 168, height: 19 }} />
            </div>
            {Array.from({ length: 2 }, (_, r) => (
              <div className="row" key={r}>
                <div>
                  <span className="skel" style={{ width: "62%", height: 18 }} />
                  <span className="skel" style={{ width: "44%", height: 16, marginTop: 5 }} />
                </div>
                <span className="skel" style={{ width: 46, height: 18 }} />
              </div>
            ))}
          </div>
        </section>

        <section className="card ledger">
          <div className="head">
            <span className="skel" style={{ width: 250, height: 19 }} />
          </div>
          <div className="lgrid">
            {Array.from({ length: 6 }, (_, r) => (
              <div className="lrow" key={r}>
                <span className="skel" style={{ width: 20, height: 20, borderRadius: 999, flex: "none" }} />
                <span className="skel" style={{ width: "45%", height: 18 }} />
                <span className="skel" style={{ marginLeft: "auto", width: 66, height: 20 }} />
              </div>
            ))}
          </div>
          <div className="lcap">
            <span className="skel" style={{ width: "92%", height: 17 }} />
          </div>
        </section>
      </div>
    </div>
  );
}

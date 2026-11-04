import "./dashboard.css";

/**
 * Tier 3.5 route skeleton — Dashboard (amended 2026-11-03: TEXT-FREE).
 * Mirrors the committed stage order (band → five channel cells → plan/actions
 * deck → ledger) using the page's REAL structural classes so the swap-in
 * reserves the same heights (CLS contract) and every responsive fold
 * (≤1180/1020/720/560) is inherited. NO real text, no headings, no labels,
 * no painted numbers — shapes only; one polite status region announces.
 * Pulse is gated by prefers-reduced-motion (../v7.css .skel).
 */
export default function Loading() {
  return (
    <div className="v7dash" role="status" aria-busy="true" aria-label="Loading the dashboard">
      <div aria-hidden="true">
        <section className="scoreband">
          <div className="band">
            <div className="bandrow">
              <div className="who">
                <span className="skel" style={{ width: 74, height: 15 }} />
                <div className="score-readout num">
                  <span className="skel" style={{ width: "2.4ch", height: 46 }} />
                  <span className="skel" style={{ width: 30, height: 12, verticalAlign: 6 }} />
                </div>
                <span className="skel" style={{ width: 220, height: 19, marginTop: 10 }} />
              </div>
              <div className="segs">
                <div className="seg-head">
                  <span className="skel" style={{ width: 84, height: 15 }} />
                </div>
                <div className="segbar">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div className="seg" style={{ flex: 1 }} key={i} />
                  ))}
                </div>
                <div className="seglabels">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i}>
                      <span className="skel" style={{ width: 40, height: 13, margin: "0 auto" }} />
                    </span>
                  ))}
                </div>
              </div>
              <span className="skel" style={{ width: 150, height: 40, borderRadius: 999 }} />
            </div>
          </div>
        </section>

        <section className="kpis">
          {Array.from({ length: 5 }, (_, i) => (
            <div className="kpi" key={i}>
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
                <span className="skel" style={{ width: 16, height: 16, borderRadius: 8, flex: "none" }} />
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

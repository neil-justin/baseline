import "./pathway.css";

/**
 * Tier 3.5 route skeleton — My Plan (amended 2026-11-03: TEXT-FREE).
 * Mirrors the committed DEFAULT arrival state (band → the lens tab rail →
 * the ONE tabpanel card holding the Plan table) using the page's REAL
 * structural classes, columns pre-sized via their .ct-* classes. NO real
 * text — the h1, tab labels, counter line and table heads are shape bars; one polite status region announces. Pulse gated by
 * prefers-reduced-motion (../v7.css .skel).
 */
export default function Loading() {
  return (
    <div className="v7plan" role="status" aria-busy="true" aria-label="Loading My Plan">
      <div aria-hidden="true">
        <section className="planband">
          <div className="band">
            <div className="bandrow">
              <div className="who">
                <span className="skel" style={{ width: 104, height: 20 }} />
                <span className="skel" style={{ width: 330, height: 19, marginTop: 6 }} />
              </div>
            </div>
          </div>
        </section>

        <div className="plan-lens">
          {/* DEFAULT TAB IS PLAN — the toolbar carries NO kicker at arrival
              (the Plan tab has none; only the Resources tab grows one). */}
          <div className="ptabs">
            <span className="skel" style={{ width: 62, height: 30, borderRadius: 6 }} />
            <span className="skel" style={{ width: 96, height: 30, borderRadius: 6 }} />
          </div>
        </div>

        <section className="card tabpanel">
          <section className="panel-sec planpanel">
            <div className="head">
              <span className="skel" style={{ width: 74, height: 20 }} />
              <span className="skel" style={{ width: 214, height: 18 }} />
            </div>
            <table className="plan-table">
              <thead>
                <tr>
                  <th>
                    <span className="skel" style={{ width: 62, height: 15 }} />
                  </th>
                  <th className="ct-res">
                    <span className="skel" style={{ width: 62, height: 15 }} />
                  </th>
                  <th className="ct-state">
                    <span className="skel" style={{ width: 62, height: 15 }} />
                  </th>
                  <th className="ct-eff">
                    <span className="skel" style={{ width: 62, height: 15 }} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 4 }, (_, r) => (
                  <tr key={r}>
                    <td>
                      <span className="skel" style={{ width: "68%", height: 18 }} />
                      <span className="skel" style={{ width: "48%", height: 16, marginTop: 5 }} />
                    </td>
                    <td className="ct-res">
                      <span className="skel" style={{ width: 148, height: 18 }} />
                    </td>
                    <td className="ct-state">
                      <span className="skel" style={{ width: 72, height: 20 }} />
                    </td>
                    <td className="ct-eff">
                      <span className="skel" style={{ width: 108, height: 17 }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </section>
      </div>
    </div>
  );
}

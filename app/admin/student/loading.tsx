import AdminVeil from "../AdminVeil";

/**
 * /admin/student route skeleton — the veil is the REAL chrome (same
 * classes, same sign-out contract — never disappears between the roster
 * and the detail, user ruling 2026-11-04), the main clones the committed
 * detail panel (headline row → rubric → ledger rows → prev/next) so the
 * swap-in reserves the same heights (CLS contract). Text-free, no
 * painted numbers; the pulse is reduced-motion honored via .skel.
 * The drill-in is counselor-only (role law), so the viz renders the
 * counselor's tab set.
 */
export default function Loading() {
  return (
    <div className="v7admin" aria-busy="true" aria-label="Loading student detail">
      <AdminVeil role="counselor" mode="detail" active="cohort">
        <section className="detail">
          <div className="panel detail-panel">
            <div className="dt-head">
              <div className="dt-id">
                <span className="skel" style={{ width: 132 }} />
                <span className="skel" style={{ width: 340, height: 26, marginTop: 10 }} />
                <span className="skel" style={{ width: 240, height: 14, marginTop: 10 }} />
              </div>
              <div className="dt-score">
                <span className="skel" style={{ width: 110 }} />
              </div>
            </div>
            <div className="dt-block">
              <span className="skel" style={{ width: 220, height: 16 }} />
              <div className="rubric" style={{ height: 10 }}>
                <span className="rseg" style={{ flex: 25 }}><i /></span>
                <span className="rseg" style={{ flex: 30 }}><i /></span>
                <span className="rseg" style={{ flex: 20 }}><i /></span>
                <span className="rseg" style={{ flex: 15 }}><i /></span>
                <span className="rseg" style={{ flex: 10 }}><i /></span>
              </div>
              <div className="ss-rows" style={{ marginTop: 6 }}>
                {[0, 1, 2, 3, 4].map((r) => (
                  <div className="ss-row" key={r} style={{ padding: "14px 0" }}>
                    <span className="skel" style={{ width: 150, height: 14 }} />
                    <span className="skel" style={{ width: 64, height: 14 }} />
                    <span className="skel" style={{ width: "70%", height: 12, gridColumn: "1 / -1" }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="dt-block" style={{ borderTop: "1px solid var(--v-rows)" }}>
              <div className="pn-row">
                <span className="skel" style={{ width: 140, height: 14 }} />
                <span className="skel" style={{ width: 140, height: 14 }} />
              </div>
            </div>
          </div>
        </section>
      </AdminVeil>
    </div>
  );
}

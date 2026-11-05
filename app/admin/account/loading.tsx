import AdminVeil from "../AdminVeil";
import SkeletonReveal from "../skeleton-reveal";

/**
 * /admin/account route skeleton — the veil is the REAL chrome (same
 * classes, same sign-out contract — never disappears, user ruling
 * 2026-11-04), and the Account item rides the tail; the skeleton marks
 * it current so the arrival never shifts the pill. The role isn't
 * known during the load: the chrome renders the counselor's tab set as
 * the honest default (the drill-in's own precedent), text-free.
 */
export default function Loading() {
  return (
    <div className="v7admin" aria-busy="true" aria-label="Loading account">
      <AdminVeil role="counselor" mode="detail" active="account">
        <section className="atabs-accpage">
          <SkeletonReveal>
            <div className="atabs-panel atabs-accpanel">
              <div className="atabs-panel-head">
                <div className="atabs-acc-headline">
                  <span className="skel" style={{ width: 64, height: 16 }} />
                  <span className="skel" style={{ width: 118, height: 11, marginTop: 6, display: "block" }} />
                </div>
                <span className="skel" style={{ width: 84, height: 42, borderRadius: 10 }} />
              </div>
              <div className="atabs-accsec">
                <span className="skel" style={{ width: 58, height: 16, display: "block", marginBottom: 14 }} />
                <div className="atabs-acc-grid">
                  {[0, 1, 2, 3].map((f) => (
                    <div key={f}>
                      <span className="skel" style={{ width: 74, height: 11, display: "block" }} />
                      <span className="skel" style={{ height: 36, borderRadius: 8, marginTop: 5, display: "block" }} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="atabs-accsec atabs-accsec-rule">
                <span className="skel" style={{ width: 64, height: 16, display: "block", marginBottom: 14 }} />
                {[0, 1, 2].map((f) => (
                  <div key={f} style={{ marginBottom: 10 }}>
                    <span className="skel" style={{ width: 96, height: 11, display: "block" }} />
                    <span className="skel" style={{ height: 36, borderRadius: 8, marginTop: 5, display: "block" }} />
                  </div>
                ))}
                <div className="atabs-acc-skel-meter" style={{ margin: "4px 0 10px" }}>
                  <span className="skel" />
                  <span className="skel" />
                  <span className="skel" />
                </div>
                <span className="skel" style={{ width: 134, height: 34, borderRadius: 999, display: "inline-block" }} />
              </div>
            </div>
          </SkeletonReveal>
        </section>
      </AdminVeil>
    </div>
  );
}

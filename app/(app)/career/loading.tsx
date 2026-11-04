import "./career.css";

/**
 * Tier 3.5 route skeleton — Careers (Wave-3 C4 rewrite, 2026-11-03;
 * re-aligned 2026-11-04 to the band-restructure + fit-column-retirement
 * ruling). Mirrors the page's DEFAULT committed stage: the named band
 * (title/meta + CTA pill) with the account skill LEDGER as its second
 * row → the lens chips rail → the ONE rolecard as the RANK / CAREER /
 * ENTRY PATH index table, NOT the zero-confirmed compressed row.
 * TEXT-FREE still: the h1, head labels and cell values are shape bars;
 * the index table mirrors the page's REAL page size (10 rows — the
 * CareerClient PAGE_SIZE) so the swap-in doesn't add rows after load (CLS contract);
 * one polite status region announces. Static-chrome rule kept: the band
 * renders pure track-grey shapes. Pulse gated by prefers-reduced-motion
 * (../v7.css .skel).
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
              {/* the fork skeleton lives on its real slot (side-by-side with
                  the CTA column) so the reserve matches the committed band;
                  sized down to the page fork's 160×112 render */}
              <svg className="band-fork" width="160" height="112" viewBox="0 0 200 140" aria-hidden="true">
                <path d="M48 122 L48 88" fill="none" stroke="var(--v-rows)" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M48 88 C 76 80, 92 60, 128 38" fill="none" stroke="var(--v-rows)" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M48 88 C 68 90, 102 100, 140 100" fill="none" stroke="var(--v-rows)" strokeWidth="3" strokeLinecap="round" />
                <path d="M48 88 C 64 102, 78 116, 92 128" fill="none" stroke="var(--v-rows)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 7" />
                <circle cx="48" cy="88" r="8" fill="var(--v-grey-wash)" />
                <circle cx="48" cy="88" r="14" fill="none" stroke="var(--v-rows)" strokeWidth="1.8" opacity=".3" />
                <circle cx="128" cy="38" r="7" fill="var(--v-grey-wash)" />
                <circle cx="140" cy="100" r="6" fill="#fff" stroke="var(--v-rows)" strokeWidth="2.2" />
                <circle cx="92" cy="128" r="5.5" fill="#fff" stroke="var(--v-rows)" strokeWidth="2.2" />
                <circle cx="164" cy="26" r="10" fill="var(--v-grey-wash)" />
              </svg>
              <div className="bandside-col">
                <span className="skel" style={{ width: 150, height: 40, borderRadius: 999 }} />
              </div>
            </div>
          </div>
          <div className="band-ledger">
            <span className="skel" style={{ width: 88, height: 12 }} />
            <span className="skill-chips ledger-chips">
              {[124, 178, 152, 138, 168, 210].map((w, i) => (
                <span className="skel" style={{ width: w, height: 26, borderRadius: 999 }} key={i} />
              ))}
            </span>
          </div>
        </header>

        <div className="lens-row">
          <div className="ptabs">
            {Array.from({ length: 5 }, (_, i) => (
              <div className="skel" style={{ width: 58 + (i % 3) * 24, height: 30, borderRadius: 999 }} key={i}></div>
            ))}
          </div>
          <span className="kicker num">
            <span className="skel" style={{ width: 204, height: 15 }} />
          </span>
        </div>

        {/* the ranked index default — tracked column heads, then row cells
            in the RANK / CAREER / ENTRY PATH template */}
        <div className="card rolecard">
          <div className="index-table cols-ranked">
            <div className="index-colheads">
              <span className="skel" style={{ width: 34, height: 11 }} />
              <span className="skel" style={{ width: 52, height: 11 }} />
              <span className="skel" style={{ width: 74, height: 11 }} />
              <span aria-hidden="true" />
            </div>
            {Array.from({ length: 10 }, (_, r) => (
              <div className="index-row" key={r}>
                <span className="skel" style={{ width: 27, height: 27, borderRadius: 999 }} />
                <span className="cell-career">
                  <span className="skel" style={{ width: 110 + (r % 3) * 40, height: 15, display: "block" }} />
                  <span
                    className="skel"
                    style={{ width: `${62 - (r % 3) * 6}%`, height: 12, marginTop: 6, display: "block" }}
                  />
                </span>
                <span className="cell-entry">
                  <span className="skel" style={{ width: "86%", height: 12, display: "block" }} />
                </span>
                <span className="cell-exp" aria-hidden="true">
                  <span className="chev" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

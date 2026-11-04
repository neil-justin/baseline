import "./career.css";

/**
 * Tier 3.5 route skeleton — Careers (Wave-3 C4 rewrite, 2026-11-03).
 * Mirrors the page's DEFAULT committed stage: the named band + bandcells
 * tray → the lens chips rail → the ONE rolecard as the RANKED INDEX TABLE
 * (tracked column heads + rows + cells — rank circle, career name + sub,
 * "x of y"-shaped fit cell with its match bar, entry cell, chevron), NOT
 * the zero-confirmed compressed row. TEXT-FREE still: the h1, head labels
 * and cell values are shape bars; one polite status region announces.
 * Static-chrome rule kept: the band renders pure track-grey shapes. Pulse
 * gated by prefers-reduced-motion (../v7.css .skel).
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

        {/* the ranked index default — tracked column heads, then row cells
            in the RANK / CAREER / SKILLS IN COMMON / ENTRY PATH template */}
        <div className="card rolecard">
          <div className="index-table cols-ranked">
            <div className="index-colheads">
              <span className="skel" style={{ width: 34, height: 11 }} />
              <span className="skel" style={{ width: 52, height: 11 }} />
              <span className="skel" style={{ width: 118, height: 11 }} />
              <span className="skel" style={{ width: 74, height: 11 }} />
              <span aria-hidden="true" />
            </div>
            {Array.from({ length: 4 }, (_, r) => (
              <div className="index-row" key={r}>
                <span className="skel" style={{ width: 26, height: 26, borderRadius: 999 }} />
                <span className="cell-career">
                  <span className="skel" style={{ width: 110 + (r % 3) * 40, height: 15, display: "block" }} />
                  <span
                    className="skel"
                    style={{ width: `${62 - (r % 3) * 6}%`, height: 12, marginTop: 6, display: "block" }}
                  />
                </span>
                <span className="cell-fit">
                  <span className="skel" style={{ width: 46, height: 12 }} />
                  {/* the match bar renders as an EMPTY track in the skeleton —
                      a filled blue bar would paint a fit fraction the engine
                      never computed (the honesty law applies to loading
                      states double) */}
                  <span className="mbar" aria-hidden="true" />
                </span>
                <span className="cell-entry">
                  <span className="skel" style={{ width: 74, height: 12 }} />
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

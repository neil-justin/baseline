import "./profile.css";

/**
 * Route skeleton — Profile (2026-11-03 revamp shape, TEXT-FREE).
 * Mirror the committed stage order for the route's DEFAULT tab
 * (Competencies): the named band with the SHARED ScoreSequence composite
 * (count · / 100 · two ratemsg lines · the five-channel bar) → the bare
 * tab strip → the Competencies panel's TWO cards (skills table card ·
 * NACE 2-col table card). NO real text — every label is a shape bar; one
 * polite status region announces. Pulse gated by prefers-reduced-motion
 * (../v7.css .skel).
 */
export default function Loading() {
  return (
    <div className="v7profile" role="status" aria-busy="true" aria-label="Loading Profile">
      <div aria-hidden="true">
        <section className="scoreband">
          <div className="band">
            <div className="bandrow">
              <div className="who">
                <span className="skel" style={{ width: 84, height: 20 }} />
                <span className="skel" style={{ width: 310, height: 17, marginTop: 6 }} />
              </div>
              {/* the shared ScoreSequence's stage shape: the composite
                  (count + "/ 100") with its two ratemsg lines in the
                  composite-wrap, the five-channel bar + seglabels beside it */}
              <div className="composite-wrap">
                <div className="composite">
                  <span className="skel" style={{ width: 52, height: 46 }} />
                  <span className="skel" style={{ width: 34, height: 17 }} />
                </div>
                <span className="skel" style={{ width: 236, height: 13, marginTop: 8, display: "block" }} />
                <span className="skel" style={{ width: 250, height: 13, marginTop: 5, display: "block" }} />
              </div>
              <div className="segs">
                <div className="segbar" style={{ marginTop: 0 }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <div className="seg" style={{ flex: 1 }} key={i}>
                      <i style={{ width: 0 }} />
                    </div>
                  ))}
                </div>
                <div className="seglabels num">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i}>
                      <span className="skel" style={{ width: 46, height: 13, margin: "0 auto" }} />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* the bare tab strip (no wrapper card) */}
        <div className="ptabs" role="presentation">
          {Array.from({ length: 3 }, (_, i) => (
            <div className="skel" style={{ width: i === 0 ? 116 : 96, height: 30, borderRadius: 6 }} key={i} />
          ))}
        </div>

        {/* the DEFAULT tab's committed stage: the Competencies panel's
            two cards */}
        <div className="plancards">
          {/* skills-table card */}
          <div className="card">
            <div className="head">
              <span className="skel" style={{ width: 150, height: 19 }} />
              <span className="skel" style={{ width: 210, height: 16 }} />
            </div>
            <table className="plan-table skills-table">
              <thead>
                <tr>
                  {Array.from({ length: 3 }, (_, i) => (
                    <th key={i}>
                      <span className="skel" style={{ width: 58, height: 15 }} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 3 }, (_, r) => (
                  <tr key={r}>
                    <td>
                      <span className="skel" style={{ width: "64%", height: 18 }} />
                    </td>
                    <td>
                      <span className="skel" style={{ width: 72, height: 20 }} />
                    </td>
                    <td>
                      <span className="skel" style={{ width: "70%", height: 16 }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* NACE 2-col assessment table card */}
          <div className="card">
            <div className="head">
              <span className="skel" style={{ width: 140, height: 19 }} />
              <span className="skel" style={{ width: 150, height: 16 }} />
            </div>
            {/* the two honest-line captions the live card renders here */}
            <p className="lcap num">
              <span className="skel" style={{ width: 130, height: 17 }} />
              <br />
              <span className="skel" style={{ width: 190, height: 17 }} />
            </p>
            <table className="plan-table assess-table">
              <thead>
                <tr>
                  {Array.from({ length: 2 }, (_, i) => (
                    <th key={i}>
                      <span className="skel" style={{ width: 70, height: 15 }} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 3 }, (_, r) => (
                  <tr key={r}>
                    <td>
                      <span className="skel" style={{ width: "58%", height: 18 }} />
                    </td>
                    <td>
                      <span className="skel" style={{ width: 74, height: 20 }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* the re-take foot (the live card's .foot + link) */}
            <div className="foot num">
              <span className="skel" style={{ width: 220, height: 15 }} />
              <br />
              <span className="skel" style={{ width: 150, height: 15 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

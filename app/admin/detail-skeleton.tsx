/**
 * DetailSkeleton — the drill-in's loading panel, the single clone shared
 * by every entrance (Skeleton-Contract): the route-level loading.tsx
 * renders it, and the streamed shell's <Suspense fallback> renders the
 * same node — so a param change (student → student) whose fallback the
 * router can't mount on its own still paints the identical panel the
 * instant the shell arrives. It carries NO back-row clone: the back link
 * is chrome, not data — every state that shows a skeleton renders the
 * real `.dt-back` above it (user ruling 2026-11-04 — the skeleton's pill
 * doubled with the real link mid-load). Mirrors the committed panel so
 * the swap-in lands with zero shift; text-free, no painted values; the
 * pulse is reduced-motion honored through .skel (admin.css).
 */
export default function DetailSkeleton() {
  return (
    <>
      <div className="panel detail-panel">
        <div className="dt-head">
          <div className="dt-id">
            <span className="skel" style={{ width: 132, height: 14 }} />
            <span className="skel" style={{ width: 340, height: 32, marginTop: 10 }} />
            <span className="skel" style={{ width: 240, height: 20, marginTop: 6 }} />
          </div>
          <div className="dt-score">
            <span className="skel" style={{ width: 112, height: 12 }} />
            <span className="skel" style={{ width: 110, height: 56, marginTop: 8 }} />
            <span className="skel" style={{ width: 150, height: 16, marginTop: 6 }} />
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
            <span className="skel" style={{ width: 140, height: 20 }} />
            <span className="skel" style={{ width: 140, height: 20 }} />
          </div>
        </div>
      </div>
    </>
  );
}

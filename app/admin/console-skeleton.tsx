import AdminVeil from "./AdminVeil";
import type { Role } from "@/lib/session";

/**
 * ConsoleSkeleton — the /admin console's loading DOM (Skeleton-Contract):
 * the veil is the REAL chrome (same classes, same sign-out contract), the
 * pane clones the role's landing (cohort roster / approvals slot) with
 * text-free pills — column-head furniture is pinned blind so the
 * skeleton contract is text-free (user ruling 2026-11-04). Rendered as
 * the streamed shell's Suspense fallback on the /admin page itself —
 * NOT as a layout-level loading.tsx: a parent boundary would hijack the
 * drill-in's own fallback on the student→ transition (recorded
 * 2026-11-04: a row click painted the console skeleton for seconds).
 * The mirror is role-scoped (adminLandingFor) because the console's tab
 * state resets to the role landing on every /admin navigation.
 */

/** Grey clone of CohortArt (AdminShell) — same footprint, neutral wash,
 *  since the skeleton must not carry painted values. The two forms must
 *  stay footprint-identical (96×48). */
function CohortArtSkel() {
  return (
    <svg className="ct-art" width="96" height="48" viewBox="0 0 96 48" aria-hidden="true">
      <g transform="translate(6 12) rotate(-4 13 12)">
        <rect width="26" height="24" rx="7" fill="var(--v-rows)" />
      </g>
      <g transform="translate(30 8) rotate(3 13 12)">
        <rect width="26" height="24" rx="7" fill="var(--v-rows)" stroke="#FFFFFF" strokeWidth="2" />
      </g>
      <g transform="translate(56 4)">
        <rect width="34" height="30" rx="9" fill="var(--v-rows)" />
      </g>
    </svg>
  );
}

const ROSTER_ROWS = [0, 1, 2, 3, 4, 5];

/** The pager ghost (user-ruled 2026-11-05, both blind mirrors paint the
 *  paginated furniture) — chevron pill · 4 page pills · chevron pill,
 *  plus the right-anchored label pill. ALL greys through .skel:
 *  text-free, no countable claims, footprint-fixed against the real
 *  pager's faces (26px chevrons, 24px page middles, 96px label). */
function PagerGhost() {
  return (
    <div className="atabs-pager atabs-pager-skel">
      <span className="skel" style={{ width: 26, height: 24, borderRadius: 6 }} />
      <span className="skel" style={{ width: 24, height: 24, borderRadius: 6 }} />
      <span className="skel" style={{ width: 24, height: 24, borderRadius: 6 }} />
      <span className="skel" style={{ width: 24, height: 24, borderRadius: 6 }} />
      <span className="skel" style={{ width: 24, height: 24, borderRadius: 6 }} />
      <span className="skel" style={{ width: 26, height: 24, borderRadius: 6 }} />
      <span className="skel" style={{ marginLeft: "auto", width: 96, height: 11 }} />
    </div>
  );
}

/** The cohort heads' blind labels — six label pills at the tracked
 *  column widths (text-free, Skeleton-Contract), the YEAR/PROGRAM pair
 *  carrying the roster's own collapsible class so the mirror folds in
 *  lockstep with the real grid's media query. */
const ROSTER_COL_WIDTHS = [68, 48, 96, 116, 60, 104];

function CohortSkeleton() {
  return (
    <section className="atabs-panel" aria-hidden="true">
      <div className="atabs-panel-head">
        <span className="skel" style={{ width: 132, height: 18 }} />
        <CohortArtSkel />
      </div>
      <div className="atabs-heads atabs-cohort-grid atabs-label">
        {ROSTER_COL_WIDTHS.map((w, k) => (
          <span key={k} className={k === 1 || k === 2 ? "atabs-col-collapsible" : undefined}>
            <span className="skel" style={{ width: w, height: 10, display: "inline-block" }} />
          </span>
        ))}
      </div>
      {ROSTER_ROWS.map((r) => (
        <div className="atabs-row atabs-cohort-grid" key={r}>
          <div className="atabs-cellname">
            <span className="skel" style={{ width: 148, height: 15 }} />
            <span className="skel" style={{ width: 96, height: 18, marginTop: 5 }} />
          </div>
          <span className="atabs-meta atabs-col-collapsible"><span className="skel" style={{ width: 64, height: 12 }} /></span>
          <span className="atabs-copy atabs-col-collapsible"><span className="skel" style={{ width: 118, height: 12 }} /></span>
          <span className="atabs-copy"><span className="skel" style={{ width: 132, height: 12 }} /></span>
          <span className="atabs-num"><span className="skel" style={{ width: 24, height: 14 }} /></span>
          <span className="atabs-meta"><span className="skel" style={{ width: 72, height: 12 }} /></span>
        </div>
      ))}
      <PagerGhost />
    </section>
  );
}

const SLOT_COLS = 6;
const SLOT_ROWS = [0, 1, 2];

function SlotSkeleton() {
  return (
    <section className="atabs-panel" aria-hidden="true">
      <div className="atabs-heads atabs-appr-grid atabs-label">
        {Array.from({ length: SLOT_COLS }, (_, k) => (
          <span key={k}>
            {k === SLOT_COLS - 1
              ? ""
              : <span className="skel" style={{ width: 84, height: 10, display: "inline-block" }} />}
          </span>
        ))}
      </div>
      {SLOT_ROWS.map((r) => (
        <div className="atabs-row atabs-appr-grid" key={r}>
          <div className="atabs-cellname">
            <span className="skel" style={{ width: 148, height: 15 }} />
            <span className="skel" style={{ width: 190, height: 12, marginTop: 5 }} />
          </div>
          <span className="skel" style={{ width: 92, height: 20 }} />
          <span className="skel" style={{ width: 108, height: 12 }} />
          <span className="skel" style={{ width: 132, height: 12 }} />
          <span className="skel" style={{ width: 94, height: 20 }} />
          <span className="skel" style={{ width: 76, height: 24 }} />
        </div>
      ))}
      <p className="atabs-empty" />
      <PagerGhost />
    </section>
  );
}

import SkeletonReveal from "./skeleton-reveal";

export default function ConsoleSkeleton({ role }: { role: Role }) {
  const landsCohort = role !== "sysadmin";
  return (
    <SkeletonReveal>
      <AdminVeil role={role} mode="detail" active={landsCohort ? "cohort" : "approvals"}>
        {landsCohort ? <CohortSkeleton /> : <SlotSkeleton />}
      </AdminVeil>
    </SkeletonReveal>
  );
}

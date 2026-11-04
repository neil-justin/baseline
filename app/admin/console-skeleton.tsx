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
const ROSTER_COL_WIDTHS = [44, 44, 20, 44];

function CohortSkeleton() {
  return (
    <section className="panel cohort-table" aria-hidden="true">
      <div className="ct-head">
        <div className="ct-headline">
          <span className="skel" style={{ width: 132, height: 18 }} />
          <span className="skel" style={{ width: 88, height: 12, marginTop: 6 }} />
        </div>
        <CohortArtSkel />
      </div>
      <table className="ct-table">
        <thead>
          <tr>
            {(["col-name", "col-career", "col-score", "col-active"] as const).map((c, k) => (
              <th key={c} scope="col" className={c}>
                <span
                  className="skel"
                  style={{ width: ROSTER_COL_WIDTHS[k], height: 10, display: "inline-block" }}
                  aria-hidden="true"
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROSTER_ROWS.map((r) => (
            <tr className="s-row" key={r}>
              <td className="s-name">
                <span className="s-name-line">
                  <span className="skel" style={{ width: 128, height: 15 }} />
                </span>
                <span className="skel" style={{ width: 168, height: 12, marginTop: 5 }} />
              </td>
              <td className="s-career"><span className="skel" style={{ width: 128, height: 13 }} /></td>
              <td className="s-score"><span className="skel" style={{ width: 16, height: 14 }} /></td>
              <td className="s-active"><span className="skel" style={{ width: 72, height: 12 }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
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

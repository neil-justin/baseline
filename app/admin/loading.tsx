import AdminVeil from "./AdminVeil";
import { getCurrentProfile } from "@/lib/session";
import type { Role } from "@/lib/session";

/**
 * /admin route skeleton — the console's loading twin of the drill-in's
 * (admin/student/loading.tsx): the veil is the REAL chrome and the main
 * clones the committed landing pane, so navigating between the console
 * and the drill-in never shows a dead click or a chrome flash (user
 * ruling 2026-11-04: the pane must not sit on a bare delay). The pane
 * mirrors the ROLE'S landing (role law — clerk→cohort, sysadmin→
 * approvals): text-free, no painted numbers; column-head furniture is
 * cloned verbatim so the swap reserves the exact same boxes. The pulse
 * is reduced-motion honored via .skel.
 *
 * Note: this landing-page mirror is valid because the console's tab
 * state resets to the role landing on every /admin navigation — the
 * AdminShell's initial state IS adminLandingFor(role).
 */

/** Grey clone of CohortArt (AdminShell) — same footprint, neutral wash,
 *  since the skeleton must not have painted values. The two forms must
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
            <th className="col-name" scope="col">Name</th>
            <th className="col-career" scope="col">Career</th>
            <th className="col-score" scope="col">Score</th>
            <th className="col-active" scope="col">Last active</th>
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

const SLOT_COLS = ["APPLICANT", "REQUEST", "DECLARED", "TRAIL", "STATUS", ""];
const SLOT_ROWS = [0, 1, 2];

function SlotSkeleton() {
  return (
    <section className="atabs-panel" aria-hidden="true">
      <div className="atabs-heads atabs-appr-grid atabs-label">
        {SLOT_COLS.map((c, k) => (
          <span key={k}>{c ? <span className="skel" style={{ width: 84, height: 10, display: "inline-block" }} /> : ""}</span>
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

export default async function Loading() {
  const profile = await getCurrentProfile();
  /** staff-only surface behind a redirect: unauthenticated visitors are
   *  leaving this route anyway, so the fallback viz is a placeholder. */
  const role: Role = profile?.role ?? "counselor";
  const landsCohort = role !== "sysadmin";
  return (
    <div className="v7admin" aria-busy="true" aria-label="Loading console">
      <AdminVeil role={role} mode="detail" active={landsCohort ? "cohort" : "approvals"}>
        {landsCohort ? <CohortSkeleton /> : <SlotSkeleton />}
      </AdminVeil>
    </div>
  );
}

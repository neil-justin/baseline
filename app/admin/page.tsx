import Reveal from "@/components/Reveal";
import { db, getStudentView } from "@/lib/db";
import { requireStaff } from "@/lib/session";
import type { StudentState } from "@/lib/types";
import AdminBar from "./AdminBar";
import StudentRow, { type RowSeg } from "./StudentRow";
import { RUBRIC_MAX, orderCohort, type RubricValues } from "./defaults";
import "./admin.css";

export const dynamic = "force-dynamic";

type ScoreLike = { sp: number; es: number; tp: number; ar: number | null; cc: number; total: number };

interface LiveRow {
  id: string;
  name: string;
  sub: string;
  career: string | null;
  score: number;
  parts: RubricValues;
  active: string;
}

const ZERO_PARTS: RubricValues = {
  sp: [0, RUBRIC_MAX.sp],
  es: [0, RUBRIC_MAX.es],
  tp: [0, RUBRIC_MAX.tp],
  ar: [0, RUBRIC_MAX.ar],
  cc: [0, RUBRIC_MAX.cc],
};

function partsOf(score: ScoreLike): RubricValues {
  return {
    sp: [score.sp, RUBRIC_MAX.sp],
    es: [score.es, RUBRIC_MAX.es],
    tp: [score.tp, RUBRIC_MAX.tp],
    ar: [score.ar === null ? 0 : score.ar, RUBRIC_MAX.ar],
    cc: [score.cc, RUBRIC_MAX.cc],
  };
}

function segments(p: RubricValues): RowSeg[] {
  return [
    { weight: RUBRIC_MAX.sp, earn: p.sp[0] / p.sp[1] },
    { weight: RUBRIC_MAX.es, earn: p.es[0] / p.es[1] },
    { weight: RUBRIC_MAX.tp, earn: p.tp[0] / p.tp[1] },
    { weight: RUBRIC_MAX.ar, earn: p.ar[0] / p.ar[1] },
    { weight: RUBRIC_MAX.cc, earn: p.cc[0] / p.cc[1] },
  ];
}

function barAria(name: string, p: RubricValues): string {
  return `${name}'s progress: skill ${p.sp[0]} of ${p.sp[1]}, employability ${p.es[0]} of ${p.es[1]}, training ${p.tp[0]} of ${p.tp[1]}, application readiness ${p.ar[0]} of ${p.ar[1]}, career clarity ${p.cc[0]} of ${p.cc[1]}`;
}

/** Last-activity label from the student's own event log — no fixture stamps. */
function lastActiveLabel(state: StudentState): string {
  const last = state.events[state.events.length - 1]?.date;
  if (!last) return "—";
  const dt = new Date(`${last.split(" ")[0]}T00:00:00`);
  return Number.isNaN(dt.getTime()) ? "—" : `${dt.toLocaleString("en-US", { month: "short" })} ${dt.getDate()}`;
}

/**
 * Every row is LIVE (ADR 0003): real state rows via db.listStudentStates()
 * (COHORT_ORDER first), each scored through the same getStudentView the
 * student's own dashboard uses. No fixture numbers exist on this surface.
 */
async function buildRows(): Promise<LiveRow[]> {
  const states = await db.listStudentStates();
  return Promise.all(
    orderCohort(states).map(async (id) => {
      const { state, career, score } = await getStudentView(id);
      return {
        id,
        name: state.name,
        sub: `${state.grade} · ${state.strand || "—"}`,
        career: career?.name ?? null,
        score: score?.total ?? 0,
        parts: score ? partsOf(score) : ZERO_PARTS,
        active: lastActiveLabel(state),
      };
    })
  );
}

/** Screen A — read-only cohort dashboard. Markup ported from prototype/admin.html. */
export default async function AdminCohortPage() {
  await requireStaff();
  const rows = await buildRows();
  const avg = rows.length ? Math.round(rows.reduce((a, r) => a + r.score, 0) / rows.length) : 0;

  return (
    <>
      <AdminBar />
      <main id="main" className="ashell">
        <section aria-labelledby="cohorts-h">
          <Reveal className="admin-head">
            <h1 id="cohorts-h">Students.</h1>
            <p className="role-line">
              Read-only cohort view. Students see their own numbers; advisers and panels see everyone&apos;s
              here — every number computed from each student&apos;s real state.
            </p>
          </Reveal>

          {/* cohort strip */}
          <Reveal className="panel cohort">
            <div className="cohort-head">
              <span className="label">COHORT</span>
              <span className="label">VIEW ONLY — NO STUDENT DATA CAN BE CHANGED</span>
            </div>
            <div className="cohort-grid">
              <Reveal className="cohort-cell" delay={0}>
                <span className="label">STUDENTS</span>
                <div className="cnum num">{rows.length}</div>
                <p className="cnote">Live roster — one row per student with state in the store.</p>
              </Reveal>
              <Reveal className="cohort-cell" delay={110}>
                <span className="label">AVERAGE READINESS SCORE</span>
                <div className="cnum num">
                  {avg}
                  <small>/100</small>
                </div>
                <p className="cnote">
                  The average of the live scores below — the same five-part rubric the student view uses,
                  computed per student at request time.
                </p>
              </Reveal>
            </div>
            <p className="cohort-honesty">LIVE COHORT — EVERY NUMBER COMPUTED FROM REAL STATE, NOTHING PAINTED</p>
          </Reveal>

          {/* student table */}
          <Reveal className="panel cohort-table" delay={46}>
            <div className="ct-head">
              <span className="label">STUDENTS · {rows.length}</span>
              <p className="ct-legend">
                BAR SEGMENTS SHOW EACH PART&apos;S WEIGHT: <b>SKILL · EMPLOYABILITY · TRAINING · CAREER CLARITY</b>
              </p>
            </div>
            <div className="ct-colheads label" aria-hidden="true">
              <span>NAME</span>
              <span>CAREER</span>
              <span style={{ textAlign: "right" }}>SCORE</span>
              <span>PROGRESS</span>
              <span>LAST ACTIVE</span>
              <span></span>
            </div>

            {rows.map((r) => (
              <StudentRow
                key={r.id}
                id={r.id}
                isDemo={r.id === "neil"}
                name={r.name}
                sub={r.sub}
                career={r.career}
                score={r.score}
                segs={segments(r.parts)}
                active={r.active}
                ariaLabel={barAria(r.name, r.parts)}
              />
            ))}
          </Reveal>
        </section>
      </main>

    </>
  );
}

import Reveal from "@/components/Reveal";
import { getStudentView } from "@/lib/db";
import AdminBar from "./AdminBar";
import StudentRow, { type RowSeg } from "./StudentRow";
import {
  COHORT_ORDER,
  GHOSTS,
  NEIL_IDENTITY,
  RUBRIC_MAX,
  totalFromParts,
  type RubricValues,
} from "./defaults";
import "./admin.css";

export const dynamic = "force-dynamic";

type ScoreLike = { sp: number; es: number; tp: number; cc: number; total: number };

/** The demo student's row recomputes live — never a hardcoded 51. */
async function getNeilLive(): Promise<{
  career: string | null;
  score: ScoreLike;
}> {
  const { career, score } = await getStudentView("neil");
  if (!career || !score) {
    // store has Neil undecided — the undecided default state's zeros
    return { career: null, score: { sp: 0, es: 0, tp: 0, cc: 0, total: 0 } };
  }
  return { career: career.name, score };
}

function neilParts(score: ScoreLike): RubricValues {
  return {
    sp: [score.sp, RUBRIC_MAX.sp],
    es: [score.es, RUBRIC_MAX.es],
    tp: [score.tp, RUBRIC_MAX.tp],
    cc: [score.cc, RUBRIC_MAX.cc],
  };
}

function segments(p: RubricValues): RowSeg[] {
  return [
    { weight: RUBRIC_MAX.sp, earn: p.sp[0] / p.sp[1] },
    { weight: RUBRIC_MAX.es, earn: p.es[0] / p.es[1] },
    { weight: RUBRIC_MAX.tp, earn: p.tp[0] / p.tp[1] },
    { weight: RUBRIC_MAX.cc, earn: p.cc[0] / p.cc[1] },
  ];
}

function barAria(name: string, p: RubricValues): string {
  return `${name}'s progress: skill ${p.sp[0]} of ${p.sp[1]}, employability ${p.es[0]} of ${p.es[1]}, training ${p.tp[0]} of ${p.tp[1]}, career clarity ${p.cc[0]} of ${p.cc[1]}`;
}

/** Screen A — read-only cohort dashboard. Markup ported from prototype/admin.html. */
export default async function AdminCohortPage() {
  const { career: neilCareer, score: neilScore } = await getNeilLive();
  const neilPartsLive = neilParts(neilScore);

  // Every integer on this screen is derived: ghosts from their seeded
  // sub-scores, Neil from the live store. Nothing painted.
  const ghostRows = COHORT_ORDER.filter((id) => id !== "neil").map((id) => GHOSTS[id]);
  const ghostScores = ghostRows.map((s) => totalFromParts(s));
  const avg = Math.round((neilScore.total + ghostScores.reduce((a, b) => a + b, 0)) / (ghostRows.length + 1));

  return (
    <>
      <AdminBar />
      <main id="main" className="ashell">
        <section aria-labelledby="cohorts-h">
          <Reveal className="admin-head">
            <h1 id="cohorts-h">Students.</h1>
            <p className="role-line">
              You&apos;re viewing as admin. Students see their own numbers; advisers and panels see everyone&apos;s
              here.
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
                <div className="cnum num">{ghostRows.length + 1}</div>
                <p className="cnote">One Grade 11–12 advisory section, seeded for this demonstration.</p>
              </Reveal>
              <Reveal className="cohort-cell" delay={110}>
                <span className="label">AVERAGE READINESS SCORE</span>
                <div className="cnum num">
                  {avg}
                  <small>/100</small>
                </div>
                <p className="cnote">
                  The average of the 7 students&apos; scores below — fixture-derived for the 6 seeded rows; the demo
                  student&apos;s number recomputes live from the same four-part rubric the student view uses.
                </p>
              </Reveal>
            </div>
            <p className="cohort-honesty">SEEDED FIXTURE COHORT — GHOST VALUES ARE LABELED, DEMO STUDENT IS LIVE</p>
          </Reveal>

          {/* student table */}
          <Reveal className="panel cohort-table" delay={46}>
            <div className="ct-head">
              <span className="label">STUDENTS · {ghostRows.length + 1}</span>
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

            <StudentRow
              id="neil"
              isDemo
              name={NEIL_IDENTITY.name}
              sub={NEIL_IDENTITY.sub}
              career={neilCareer}
              score={neilScore.total}
              segs={segments(neilPartsLive)}
              active={NEIL_IDENTITY.lastActive}
              ariaLabel={barAria(NEIL_IDENTITY.name, neilPartsLive)}
            />
            {ghostRows.map((s) => (
              <StudentRow
                key={s.id}
                id={s.id}
                name={s.name}
                sub={s.sub}
                career={s.career}
                score={totalFromParts(s)}
                segs={segments(s)}
                active={s.lastActive}
                ariaLabel={barAria(s.name, s)}
              />
            ))}
          </Reveal>
        </section>
      </main>

      <p className="admin-colophon">
        <span>READ-ONLY ADMIN VIEW · SEEDED DEMO COHORT OF 7 · EVERY SCORE COMPUTED FROM THE SAME RUBRIC AS THE STUDENT VIEW</span>
        <span>CAREER READINESS · THESIS PROTOTYPE</span>
      </p>
    </>
  );
}

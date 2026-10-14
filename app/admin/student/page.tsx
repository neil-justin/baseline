import Link from "next/link";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import { getStudentView } from "@/lib/db";
import { scoreView } from "@/lib/engines/rubric";
import type { StudentState } from "@/lib/types";
import AdminBar from "../AdminBar";
import {
  COHORT_ORDER,
  GHOSTS,
  NEIL_IDENTITY,
  RUBRIC_MAX,
  gradeLabel,
  resolveStudentId,
  totalFromParts,
  type AdminFixtureStudent,
  type RubricValues,
} from "../defaults";
import "../admin.css";

export const dynamic = "force-dynamic";

/** Everything Screen B renders — Neil's numbers arrive LIVE, ghosts stay fixtures. */
interface ScreenB {
  id: string;
  name: string;
  grade: string;
  /** declared career; null = undecided default state (mono banner) */
  career: string | null;
  score: number;
  parts: RubricValues;
  spNote: string;
  tpNote: string;
  ccNote: string;
  context: string;
}

function fixedParts(p: RubricValues): RubricValues {
  return {
    sp: [p.sp[0], p.sp[1] || RUBRIC_MAX.sp],
    es: [p.es[0], p.es[1] || RUBRIC_MAX.es],
    tp: [p.tp[0], p.tp[1] || RUBRIC_MAX.tp],
    cc: [p.cc[0], p.cc[1] || RUBRIC_MAX.cc],
  };
}

/** Ghost students render their seeded fixture exactly (transcribed, derived total). */
function buildGhost(s: AdminFixtureStudent): ScreenB {
  return {
    id: s.id,
    name: s.name,
    grade: s.grade,
    career: s.career,
    score: totalFromParts(s),
    parts: fixedParts(s),
    spNote: s.spNote,
    tpNote: s.tpNote,
    ccNote: s.ccNote,
    context: s.context,
  };
}

/**
 * The demo student recomputes live: store state → computeScore → every line
 * derived. Notes echo the computed state; they never originate numbers
 * (`features/content/admin.md` — same no-hardcode rule as everywhere).
 */
async function buildNeilLive(): Promise<ScreenB> {
  const { state, career, score } = await getStudentView("neil");
  const grade = `${gradeLabel(state.grade)} · ${state.strand}`;

  if (!career || !score) {
    // undecided default state — the mono banner + per-part notes; never blank
    return {
      id: "neil",
      name: NEIL_IDENTITY.name,
      grade,
      career: null,
      score: 0,
      parts: fixedParts({ sp: [0, RUBRIC_MAX.sp], es: [0, RUBRIC_MAX.es], tp: [0, RUBRIC_MAX.tp], cc: [0, RUBRIC_MAX.cc] }),
      spNote: "Baseline from his setup claims only — no career map is measured against yet.",
      tpNote: "No career picked — his pathway isn’t open yet.",
      ccNote: "Still deciding — direction locks the remaining points when he picks a career.",
      context: "No career measured yet — his numbers hold until he picks one.",
    };
  }

  const v = scoreView(career, state);
  const parts: RubricValues = {
    sp: [v.sp, RUBRIC_MAX.sp],
    es: [v.es, RUBRIC_MAX.es],
    tp: [v.tp, RUBRIC_MAX.tp],
    cc: [v.cc, RUBRIC_MAX.cc],
  };

  // source breakdown of the closed bars (echo, never originate)
  const src = sourceCounts(state);
  const checkedSuffix = src.checked > 0 ? ` · ${src.checked} check-verified ·✓✓` : "";
  const spNote = `${v.closed} of ${v.mapSize} ${career.name} skills on his map · ${src.verified} verified ·✓, ${src.claimed} self-reported${checkedSuffix}.`;

  const tpNote =
    v.stageOne.done === 0
      ? "None yet — his pathway hasn’t opened its first step."
      : `${v.stageOne.done} of ${v.stageOne.target} first steps done.`;

  const ccBits = ["Career confirmed"];
  if (state.goals.length > 0) ccBits.push("goal set");
  if (v.goalCompleted) ccBits.push("first goal finished");
  const ccNote = ccBits.join(" · ") + ".";

  const context = `${v.closed} of ${v.mapSize} ${career.name} skills counted · First 30 days: ${v.stageOne.done} of ${v.stageOne.target} done`;

  return {
    id: "neil",
    name: NEIL_IDENTITY.name,
    grade,
    career: career.name,
    score: v.total,
    parts,
    spNote,
    tpNote,
    ccNote,
    context,
  };
}

function sourceCounts(s: StudentState) {
  const counts = { verified: 0, checked: 0, claimed: 0 };
  for (const b of Object.values(s.bars)) counts[b.source]++;
  return counts;
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ student?: string }> }) {
  const id = resolveStudentId((await searchParams).student);
  const name = id === "neil" ? NEIL_IDENTITY.name : GHOSTS[id].name;
  return {
    title: `${name} — Career Readiness · Admin`,
    description:
      "Read-only admin view of one student: their score, the four rubric parts behind it, and the same honest numbers their own dashboard shows.",
  };
}

/** Screen B — read-only per-student detail. Markup ported from prototype/admin-student.html. */
export default async function AdminStudentPage({
  searchParams,
}: {
  searchParams: Promise<{ student?: string }>;
}) {
  const id = resolveStudentId((await searchParams).student);
  const s = id === "neil" ? await buildNeilLive() : buildGhost(GHOSTS[id]);

  // prev / next within the seeded cohort walk
  const i = COHORT_ORDER.indexOf(id as (typeof COHORT_ORDER)[number]);
  const prev = COHORT_ORDER[(i - 1 + COHORT_ORDER.length) % COHORT_ORDER.length];
  const next = COHORT_ORDER[(i + 1) % COHORT_ORDER.length];

  const undecided = s.career === null;
  const ccFull = s.parts.cc[0] === s.parts.cc[1];

  return (
    <>
      <AdminBar />
      <main id="main" className="ashell">
        {/* breadcrumb */}
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/admin">COHORT</Link>
          <span className="sep" aria-hidden="true">
            /
          </span>
          <span className="here">STUDENT · {s.name.toUpperCase()}</span>
        </nav>

        {/* read-only per-student detail */}
        <section className="detail" aria-labelledby="dt-h">
          <Reveal className="panel detail-panel">
            <div className="dt-head">
              <div className="dt-id">
                <span className="label">STUDENT · VIEW ONLY</span>
                <h2 id="dt-h">
                  {s.name} — {undecided ? "Still deciding" : s.career}
                </h2>
                <p className="dt-meta">
                  <span>{s.grade}</span>
                  <span className="ro">READ-ONLY MIRROR OF THEIR OWN DASHBOARD</span>
                </p>
              </div>
              <div className="dt-score">
                <span className="label">READINESS SCORE</span>
                <div className="readout-score">
                  <CountUp to={s.score} dur={900} className="num" />
                  <small>/100</small>
                </div>
                <p className="dt-samesub">the same number their dashboard shows</p>
              </div>
            </div>

            {/* undecided default state — shown only when the student has no career yet */}
            <div className="undecided-banner" hidden={!undecided}>
              <b>NO CAREER YET</b> — the skill map, gap bars, and pathway unlock when he picks one
            </div>

            {/* sub-score breakdown */}
            <Reveal className="dt-block">
              <h3>Where their score comes from</h3>
              <div
                className="rubric"
                role="img"
                aria-label={`Score ${s.score} of 100: skill progress ${s.parts.sp[0]} of ${s.parts.sp[1]}, employability skills ${s.parts.es[0]} of ${s.parts.es[1]}, training progress ${s.parts.tp[0]} of ${s.parts.tp[1]}, career clarity ${s.parts.cc[0]} of ${s.parts.cc[1]}; segment widths are the rubric weights`}
              >
                {[
                  { pct: RUBRIC_MAX.sp, frac: s.parts.sp[0] / s.parts.sp[1] },
                  { pct: RUBRIC_MAX.es, frac: s.parts.es[0] / s.parts.es[1] },
                  { pct: RUBRIC_MAX.tp, frac: s.parts.tp[0] / s.parts.tp[1] },
                  { pct: RUBRIC_MAX.cc, frac: s.parts.cc[0] / s.parts.cc[1] },
                ].map((seg, k) => (
                  <span className="rseg" key={k} style={{ flex: seg.pct }}>
                    <i style={{ "--earn": `${seg.frac}`, "--d": `${k * 80}ms` } as React.CSSProperties} />
                  </span>
                ))}
              </div>
              <div className="ss-rows">
                <div className="ss-row">
                  <span className="ss-name">Skill progress</span>
                  <span className="ss-val num">
                    {s.parts.sp[0]} of {s.parts.sp[1]}
                  </span>
                  <span className="ss-note">{s.spNote}</span>
                </div>
                <div className="ss-row">
                  <span className="ss-name">Employability skills</span>
                  <span className="ss-val num">
                    {s.parts.es[0]} of {s.parts.es[1]}
                  </span>
                  <span className="ss-note">Of 25 — the full situations battery is coming after setup.</span>
                </div>
                <div className="ss-row">
                  <span className="ss-name">Training progress</span>
                  <span className="ss-val num">
                    {s.parts.tp[0]} of {s.parts.tp[1]}
                  </span>
                  <span className="ss-note">{s.tpNote}</span>
                </div>
                <div className="ss-row">
                  <span className="ss-name">Career clarity</span>
                  <span className="ss-val num">
                    {s.parts.cc[0]} of {s.parts.cc[1]}
                  </span>
                  <span className={`ss-note${ccFull ? " ok" : ""}`}>{s.ccNote}</span>
                </div>
              </div>
              <p className="dt-context">{s.context}</p>
            </Reveal>

            {/* prev / next within the cohort */}
            <Reveal className="dt-block" delay={60}>
              <div className="pn-row">
                <Link className="link-quiet" href={`/admin/student?student=${prev}`}>
                  ← Previous student
                </Link>
                <Link className="link-quiet" href={`/admin/student?student=${next}`}>
                  Next student →
                </Link>
              </div>
            </Reveal>
          </Reveal>
        </section>
      </main>

      <p className="admin-colophon">
        <span>READ-ONLY ADMIN VIEW · SEEDED FIXTURE — VALUES MATCH THE COHORT TABLE</span>
        <span>CAREER READINESS · THESIS PROTOTYPE</span>
      </p>
    </>
  );
}

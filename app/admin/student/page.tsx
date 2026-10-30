import Link from "next/link";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import { db, getStudentView } from "@/lib/db";
import { requireStaff } from "@/lib/session";
import { scoreView } from "@/lib/engines/rubric";
import type { StudentState } from "@/lib/types";
import AdminBar from "../AdminBar";
import { RUBRIC_MAX, gradeLabel, orderCohort, type RubricValues } from "../defaults";
import "../admin.css";

export const dynamic = "force-dynamic";

/** Everything Screen B renders — all of it computed live from real state. */
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
  arNote: string;
  ccNote: string;
  context: string;
  /** ES receipt — verified NACE competencies (of the assessed 7) */
  esVerified: number;
  /** AR channel measured? (unmeasured reads its honest grey row) */
  arMeasured: boolean;
}

function zeroParts(): RubricValues {
  return {
    sp: [0, RUBRIC_MAX.sp],
    es: [0, RUBRIC_MAX.es],
    tp: [0, RUBRIC_MAX.tp],
    ar: [0, RUBRIC_MAX.ar],
    cc: [0, RUBRIC_MAX.cc],
  };
}

/**
 * Any student recomputes live: store state → computeScore → every line
 * derived. Notes echo the computed state; they never originate numbers
 * (`features/content/admin.md` — same no-hardcode rule as everywhere).
 */
async function buildLive(id: string): Promise<ScreenB> {
  const { state, career, score, ar } = await getStudentView(id);
  const grade = state.strand ? `${gradeLabel(state.grade)} · ${state.strand}` : gradeLabel(state.grade);

  if (!career || !score) {
    // undecided default state — the mono banner + per-part notes; never blank
    return {
      id,
      name: state.name,
      grade,
      career: null,
      score: 0,
      parts: zeroParts(),
      spNote: "Baseline from setup claims only — no career map is measured against yet.",
      tpNote: "No career picked — the pathway isn’t open yet.",
      arNote: "Not yet measured — the resume diagnostic in Prep opens this channel.",
      ccNote: "Still deciding — direction locks the remaining points when a career is picked.",
      context: "No career measured yet — the numbers hold until one is picked.",
      esVerified: 0,
      arMeasured: false,
    };
  }

  const v = scoreView(career, state, ar);
  const parts: RubricValues = {
    sp: [v.sp, RUBRIC_MAX.sp],
    es: [v.es, RUBRIC_MAX.es],
    tp: [v.tp, RUBRIC_MAX.tp],
    ar: [v.ar === null ? 0 : v.ar, RUBRIC_MAX.ar],
    cc: [v.cc, RUBRIC_MAX.cc],
  };

  // source breakdown of the closed bars (echo, never originate)
  const src = sourceCounts(state);
  const checkedSuffix = src.checked > 0 ? ` · ${src.checked} check-verified ·✓✓` : "";
  const spNote = `${v.closed} of ${v.mapSize} ${career.name} skills on the map · ${src.verified} verified ·✓, ${src.claimed} self-reported${checkedSuffix}.`;

  const tpNote =
    v.stageOne.done === 0
      ? "None yet — the pathway hasn’t opened its first step."
      : `${v.stageOne.done} of ${v.stageOne.target} first steps done.`;

  const factorLine = (p: { measured: boolean; earned: number; max: number }) =>
    p.measured ? `${p.earned}/${p.max}` : "open";
  const arNote = v.arMeasured
    ? `Measured factors earn this (${v.ar} of ${RUBRIC_MAX.ar}) — resume ${factorLine(v.arFactors.resume)} · letter ${factorLine(v.arFactors.letter)} · presence ${factorLine(v.arFactors.presence)}.`
    : "Not yet measured — the resume diagnostic in Prep opens this channel.";

  const ccBits = ["Career confirmed"];
  if (v.ccStarted) ccBits.push("plan started");
  if (v.ccFirstDone) ccBits.push("first item done");
  const ccNote = ccBits.join(" · ") + ".";
  const esVerified = Object.values(state.competencies ?? {}).filter((x) => x === "verified").length;
  const arMeasured = score.ar !== null;

  const context = `${v.closed} of ${v.mapSize} ${career.name} skills counted · First 30 days: ${v.stageOne.done} of ${v.stageOne.target} done`;

  return {
    id,
    name: state.name,
    grade,
    career: career.name,
    score: v.total,
    parts,
    spNote,
    tpNote,
    arNote,
    ccNote,
    context,
    esVerified,
    arMeasured,
  };
}

function sourceCounts(s: StudentState) {
  const counts = { verified: 0, checked: 0, claimed: 0 };
  for (const b of Object.values(s.bars)) counts[b.source]++;
  return counts;
}

/** Real cohort walk: real state ids (COHORT_ORDER first); `?student=` must
 * name one of them, else the first. TODO(admin-round): detail-page fallback. */
async function resolveId(raw: string | undefined): Promise<{ ids: string[]; id: string }> {
  const ids = orderCohort(await db.listStudentStates());
  const id = raw && ids.includes(raw) ? raw : (ids[0] ?? "neil");
  return { ids: ids.length ? ids : [id], id };
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ student?: string }> }) {
  const { id } = await resolveId((await searchParams).student);
  const { state } = await getStudentView(id);
  return {
    title: `${state.name} — Career Readiness · Admin`,
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
  await requireStaff();
  const { ids, id } = await resolveId((await searchParams).student);
  const s = await buildLive(id);

  // prev / next within the live cohort walk
  const i = ids.indexOf(id);
  const prev = ids[(i - 1 + ids.length) % ids.length];
  const next = ids[(i + 1) % ids.length];

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
              <b>NO CAREER YET</b> — the skill map, gap bars, and pathway unlock when they pick one
            </div>

            {/* sub-score breakdown */}
            <Reveal className="dt-block">
              <h3>Where their score comes from</h3>
              <div
                className="rubric"
                role="img"
                aria-label={`Score ${s.score} of 100: skill progress ${s.parts.sp[0]} of ${s.parts.sp[1]}, employability skills ${s.parts.es[0]} of ${s.parts.es[1]}, training progress ${s.parts.tp[0]} of ${s.parts.tp[1]}, application readiness ${s.arMeasured ? `${s.parts.ar[0]} of ${s.parts.ar[1]}` : "not yet measured"}, career clarity ${s.parts.cc[0]} of ${s.parts.cc[1]}; segment widths are the rubric weights`}
              >
                {[
                  { pct: RUBRIC_MAX.sp, frac: s.parts.sp[0] / s.parts.sp[1] },
                  { pct: RUBRIC_MAX.es, frac: s.parts.es[0] / s.parts.es[1] },
                  { pct: RUBRIC_MAX.tp, frac: s.parts.tp[0] / s.parts.tp[1] },
                  { pct: RUBRIC_MAX.ar, frac: s.parts.ar[0] / s.parts.ar[1] },
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
                  <span className="ss-note">NACE assessment: {s.esVerified} of 7 competencies verified ·✓.</span>
                </div>
                <div className="ss-row">
                  <span className="ss-name">Training progress</span>
                  <span className="ss-val num">
                    {s.parts.tp[0]} of {s.parts.tp[1]}
                  </span>
                  <span className="ss-note">{s.tpNote}</span>
                </div>
                <div className="ss-row">
                  <span className="ss-name">Application readiness</span>
                  <span className={`ss-val num${s.arMeasured ? "" : " quiet"}`}>
                    {s.arMeasured ? `${s.parts.ar[0]} of ${s.parts.ar[1]}` : "not yet measured"}
                  </span>
                  <span className="ss-note">{s.arNote}</span>
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
        <span>READ-ONLY ADMIN VIEW · EVERY NUMBER COMPUTED FROM THE STUDENT&apos;S LIVE STATE</span>
        <span>CAREER READINESS · THESIS PROTOTYPE</span>
      </p>
    </>
  );
}

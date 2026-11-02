import { db, getStudentView } from "@/lib/db";
import { requireStaff } from "@/lib/session";
import { credentialStore, type CohortCredentialRow } from "@/lib/db/credential-store";
import type { StudentState } from "@/lib/types";
import AdminBar from "./AdminBar";
import StudentRow, { type RowSeg } from "./StudentRow";
import AuditQueue, { type QueueRow } from "./AuditQueue";
import { RUBRIC_MAX, orderCohort, personaMeta, type RubricValues } from "./defaults";
import "./admin.css";

export const dynamic = "force-dynamic";

type ScoreLike = { sp: number; es: number; tp: number; ar: number | null; cc: number; total: number };

export interface LiveRow {
  id: string;
  name: string;
  sub: string;
  career: string | null;
  score: number;
  decided: boolean;
  events: number;
  pending: number;
  belowAvg: boolean;
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
 *
 * Row marks (Round-8 lock, admin-college-scope.md Q1 — "obvious row marks,
 * not reordering"; visible entities, zero triage logic) derive ONLY from
 * computed state + the audit queue:
 *   - NEEDS AUDIT n — declared credentials waiting on the counselor ruling
 *   - BELOW AVG — score strictly under the cohort average (a measurement
 *     fact off the same computed numbers; the copy never narrates it)
 *   - NO ACTIVITY — a state with an empty event log (nothing done since
 *     seeding)
 * The intake-audit's low-fit-declaration mark stays recorded-not-built: no
 * intake object in state carries a low-fit flag (the join is a recorded
 * seam, not decorated here — nothing invented).
 */
async function buildRows(creds: CohortCredentialRow[]): Promise<LiveRow[]> {
  const states = await db.listStudentStates();
  const pending = new Map<string, number>();
  for (const c of creds) {
    if (c.status === "declared") pending.set(c.studentId, (pending.get(c.studentId) ?? 0) + 1);
  }
  const views = await Promise.all(
    orderCohort(states).map(async (id) => {
      const { state, career, score } = await getStudentView(id);
      return {
        id,
        name: state.name,
        sub: personaMeta(state.yearLevel, state.track),
        career: career?.name ?? null,
        decided: career !== null && score !== null,
        score: score?.total ?? 0,
        events: state.events?.length ?? 0,
        pending: pending.get(id) ?? 0,
        parts: score ? partsOf(score) : ZERO_PARTS,
        active: lastActiveLabel(state),
      };
    })
  );
  const scored = views.filter((v) => v.decided);
  const avg = scored.length ? Math.round(scored.reduce((a, v) => a + v.score, 0) / scored.length) : 0;
  return views.map((v) => ({ ...v, belowAvg: v.decided && v.score < avg }));
}

export async function buildQueue(creds: CohortCredentialRow[]): Promise<QueueRow[]> {
  const states = await db.listStudentStates();
  const rank = (s: CohortCredentialRow["status"]) => (s === "declared" ? 0 : s === "rejected" ? 1 : 2);
  const ruledAt = (c: CohortCredentialRow) => c.verifiedAt ?? "";
  return creds
    .map((c) => ({
      id: c.id,
      studentId: c.studentId,
      studentName: states[c.studentId]?.name ?? "(unknown cohort member)",
      kind: c.kind,
      title: c.title,
      organization: c.organization,
      evidenceUrl: c.evidenceUrl,
      evidenceNote: c.evidenceNote,
      declaredSkills: c.declaredSkills,
      status: c.status,
      declaredAt: c.createdAt,
      ruledBy: c.verifiedBy,
      ruledAt: c.verifiedAt,
      auditNote: c.auditNote,
    }))
    .sort(
      (a, b) =>
        rank(a.status) - rank(b.status) ||
        (a.status === "declared"
          ? a.declaredAt.localeCompare(b.declaredAt)
          : (b.ruledAt ?? "").localeCompare(a.ruledAt ?? ""))
    );
}

/** Screen A — the counselor's console (v7 band + roster + audit queue). */
export default async function AdminCohortPage() {
  const profile = await requireStaff();
  const creds = await credentialStore.listAll();
  const queue = await buildQueue(creds);
  const rows = await buildRows(creds);
  const scored = rows.filter((r) => r.decided);
  const avg = scored.length ? Math.round(scored.reduce((a, r) => a + r.score, 0) / scored.length) : 0;
  const pendingCount = creds.filter((c) => c.status === "declared").length;

  return (
    <div className="v7admin">
      <AdminBar />
      <main id="main" className="ashell">
        {/* the v7 named-surface band + instrument counters */}
        <section className="proband" aria-label="Admin console">
          <div className="band">
            <div className="bandrow">
              <div className="who">
                <h1>Admin</h1>
                <p className="band-id">
                  Counselor view — {profile.fullName}. Students see their own numbers; the cohort is
                  everyone&apos;s here, read-only.
                </p>
              </div>
              <div className="band-counts">
                <span className="count">
                  <span className="label">STUDENTS</span>
                  <span className="c-val num">{rows.length}</span>
                </span>
                <span className="count">
                  <span className="label">AVERAGE READINESS SCORE</span>
                  <span className="c-val num">
                    {avg}
                    <small>/100</small>
                  </span>
                </span>
                <span className="count">
                  <span className="label">PENDING CREDENTIAL AUDITS</span>
                  <span className={`c-val num${pendingCount > 0 ? " open" : ""}`}>{pendingCount}</span>
                </span>
              </div>
            </div>
            <p className="band-honesty">Seeded fixture cohort — values are labeled, not live.</p>
          </div>
        </section>

        {/* student table */}
        <section className="panel cohort-table" aria-label="Cohort roster">
          <div className="ct-head">
            <h2 className="ct-title">Cohort roster</h2>
            <p className="ct-legend">
              BAR SEGMENTS SHOW EACH PART&apos;S WEIGHT: <b>SKILL · EMPLOYABILITY · TRAINING · APPLICATION READINESS · CAREER CLARITY</b>
            </p>
          </div>
          <div className="ct-colheads ct-label">
            <span>NAME</span>
            <span>CAREER</span>
            <span>SCORE</span>
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
              pending={r.pending}
              belowAvg={r.belowAvg}
              noActivity={r.events === 0}
              segs={segments(r.parts)}
              active={r.active}
              ariaLabel={barAria(r.name, r.parts)}
            />
          ))}
        </section>

        {/* the Round-8 timestamped credential audit queue (the counselor's function) */}
        <AuditQueue rows={queue} ruledByLabel={profile.fullName} />
      </main>

      <p className="admin-colophon">
        <span>READ-ONLY COHORT VIEW · EVERY NUMBER COMPUTED FROM REAL STATE, NOTHING PAINTED</span>
        <span>BASELINE · THESIS PROTOTYPE</span>
      </p>
    </div>
  );
}

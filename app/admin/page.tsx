import { db, getStudentView } from "@/lib/db";
import { requireStaff } from "@/lib/session";
import { credentialStore, type CohortCredentialRow } from "@/lib/db/credential-store";
import type { StudentState } from "@/lib/types";
import AdminMockupGate from "./mockups/AdminMockupGate";
import AdminShell from "./AdminShell";
import type { QueueRow } from "./AuditQueue";
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

/**
 * Screen A — the staff console, now the multi-tab roles console
 * (2026-11-03 admin-replacement Wave 1): this page stays the server
 * component — requireStaff() gate + the real-data build (counselor only;
 * the sysadmin's student-handling builds are skipped by role) — and hands
 * rows/queue/profile to AdminShell (the approved v7 realm chrome). The
 * single-page band and its counters fold away with the wave; sections
 * became the COHORT + AUDIT QUEUE tabs.
 */
export default async function AdminCohortPage() {
  const profile = await requireStaff();
  // Role law (2026-11-04, Round 3): the sysadmin never handles students —
  // skip both the roster and audit-queue builds entirely instead of
  // shipping student data in the payload for a role that cannot render a
  // single student surface.
  const isSysadmin = profile.role === "sysadmin";
  const creds = isSysadmin ? null : await credentialStore.listAll();
  const queue = creds ? await buildQueue(creds) : null;
  const rows = creds ? await buildRows(creds) : null;

  return (
    <div className="v7admin">
      <AdminShell role={profile.role} rows={rows} queue={queue} ruledByLabel={profile.fullName} />
      <AdminMockupGate />
    </div>
  );
}

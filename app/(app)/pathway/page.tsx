import { getStudentView } from "@/lib/db";
import { requireStudent } from "@/lib/session";
import { openSkills, rankOpenSkills, stageOne } from "@/lib/engines/gaps";
import { scoreView } from "@/lib/engines/rubric";
import { roundHalfDown, WEIGHTS } from "@/lib/engines/score";
import type { BarSource, Career, Resource } from "@/lib/types";
import { CHECK_SKILL } from "@/lib/fixtures/checks";
import { RESOURCES } from "@/lib/fixtures/resources";
import PathwayTabs, {
  type PlanRow,
  type PlanTab,
  type ResRow,
  type ResourcesTab,
} from "./PathwayTabs";
import "./pathway.css";

export const dynamic = "force-dynamic";

/**
 * M7 Pathway — MY PLAN, Tier 2d merge (user-ruled 2026-11-02, decisions
 * log §Tier 2d): Steps + Gaps collapse into one Plan dataset — every
 * career skill is ONE row, open rows keep the steps engine's ranked order,
 * closed rows append after (provenance carried per row). Engine semantics
 * untouched: queue from `gaps.ts` (openSkills → rankOpenSkills → seeded
 * stageOneQueue); SP projection restates the dashboard plan-table formula;
 * never paints thesis names, "AI", or gamified language.
 */

function costText(r: Pick<Resource, "cost">): string {
  return r.cost === "free" ? "free" : `₱${r.cost.peso}`;
}
function timeText(r: Pick<Resource, "durationHours">): string {
  return `~${r.durationHours} hrs`;
}

/** The skill's own student-facing "what it means" line (grilling Q7: the
    row-level "what you'll learn" copy — already canon, no new authoring). */
function whatFor(career: Career, skill: string): string {
  return career.skills.find((s) => s.name === skill)?.what ?? "";
}

/**
 * The one suggested resource per skill (user ruling 2026-11-02, grilling
 * session Q5): an authored `pick: true` wins; the computed rule (free tier
 * → fewer hours → provider name) fills in until flags exist — the catalog
 * is 437 rows, so pick flags land as a data pass, not a bulk edit.
 * Q11v2 rewire (check-linked → dedicated → free → hours → id) + the
 * pick-flag retirement DEFER to the signal-gated batch (2026-11-02) —
 * this engine call stays EXACTLY as-is until then.
 */
function pickResource(career: Career, skill: string): Resource | null {
  const pool = RESOURCES.filter(
    (r: Resource) => r.careerId === career.id && r.skillsAddressed.includes(skill)
  );
  if (pool.length === 0) return null;
  const authored = pool.find((r: Resource) => r.pick === true);
  if (authored) return authored;
  return [...pool].sort((a, b) => {
    const free = Number(/free/i.test(String(b.cost))) - Number(/free/i.test(String(a.cost)));
    if (free) return free;
    const hrs = (a.durationHours ?? 99) - (b.durationHours ?? 99);
    if (hrs) return hrs;
    return a.provider.localeCompare(b.provider);
  })[0];
}

/** First resource pointer per skill (typed catalog, career-scoped). */
function resourceFor(career: Career, skill: string): Resource | null {
  return pickResource(career, skill);
}

/** Closing-provenance wording (canonical forms, decisions log Q6). */
function provenanceFor(source: "verified" | "checked" | "claimed"): string {
  return source === "verified"
    ? "Closed via quiz"
    : source === "checked"
      ? "Closed via checked resource"
      : "Self-reported";
}

/**
 * THE Plan dataset (Tier 2d merge): every career skill = one row. Open
 * rows keep the steps engine's ranked order (queue first, then the ranked
 * remainder) and each carries its SP projection; closed rows append after,
 * dimmed, with the closing provenance the engine emits. Presentation-only
 * build — the suggestion engine above is untouched (Q13 deferral).
 */
function buildPlan(
  career: Career,
  bars: Record<string, { source: BarSource }>,
  closed: number,
  stageOneQueue: string[] | undefined,
  transferred: string[]
): PlanTab {
  const open = openSkills(career, bars);
  const ranked = rankOpenSkills(career, open);
  const seeded = (stageOneQueue ?? []).filter((s) => open.includes(s));
  /* the steps engine's own ranked order: the persisted stage-① queue
     first when one exists, the engine's stage-one pick otherwise, then
     the ranked remainder — never a re-rank here */
  const stageQueue = seeded.length ? seeded : stageOne(career, open).queue;
  const openOrder = [
    ...stageQueue,
    ...ranked.filter((r) => !stageQueue.includes(r.skill)).map((r) => r.skill),
  ];
  const mapSize = career.skills.length;
  const allClosed = open.length === 0;

  /* EFFECT-on-rows (user-ruled, dashboard parity): each open row's SP
     projection assumes the ranked rows above it close first — the
     dashboard plan-table formula verbatim (roundHalfDown over WEIGHTS.sp
     × closed ÷ mapSize). No new engine math; the numbers restate lib/
     engines projections. */
  const spAt = (n: number) => roundHalfDown((WEIGHTS.sp * (closed + n)) / mapSize);

  /* open rows: ranked order (above), each with its SP projection slot */
  const openRows: PlanRow[] = openOrder.map((skill, i) => {
    const res = resourceFor(career, skill);
    const hasCheck = res != null && CHECK_SKILL[res.id] === skill;
    return {
      skill,
      what: whatFor(career, skill),
      open: true,
      kind: "open",
      transferred: false,
      effect: { from: spAt(i), to: spAt(i + 1) },
      provenance: null,
      suggestion: res
        ? { title: res.title, cost: costText(res), hrs: timeText(res), url: res.url ?? null }
        : null,
      hasCheck,
      noCheck: !hasCheck,
    };
  });

  /* closed rows append after, catalog order (stable read across pages) */
  const closedRows: PlanRow[] = career.skills
    .filter((s) => s.name in bars)
    .map((s) => {
      const source = bars[s.name].source;
      return {
        skill: s.name,
        what: whatFor(career, s.name),
        open: false,
        kind: source,
        transferred: source === "verified" && transferred.includes(s.name),
        effect: null,
        provenance: provenanceFor(source),
        suggestion: null,
        hasCheck: false,
        noCheck: false,
      };
    });

  const clearLine = allClosed
    ? `All ${mapSize} of ${mapSize} skills checked — nothing open right now. Your next moves are the Entry-ready milestones below${
        career.id === "da"
          ? ": finish the 3-project data portfolio, then the Google Data Analytics certificate."
          : "."
      }`
    : null;

  return {
    closed,
    mapSize,
    allClosed,
    clearLine,
    rows: [...openRows, ...closedRows],
  };
}

function buildResources(
  career: Career,
  bars: Record<string, { source: BarSource }>,
  queue: string[]
): ResourcesTab {
  const allClosed = openSkills(career, bars).length === 0;
  // the one suggested resource per OPEN skill (grilling Q5): collect the
  // picks into a set — the Suggested card lists exactly these; the FULL
  // catalog (everything else) rides the Alternates card.
  const openSet = new Set(openSkills(career, bars));
  const suggested = new Set(
    career.skills
      .filter((s) => openSet.has(s.name))
      .map((s) => pickResource(career, s.name)?.id)
      .filter((x): x is string => x != null)
  );
  const startRes = queue.length ? resourceFor(career, queue[0]) : null;
  const rows: ResRow[] = RESOURCES.filter((r: Resource) => r.careerId === career.id).map(
    (r) => {
      const routeParts = [
        r.creditingBody ? `Credited by ${r.creditingBody}` : null,
        r.countsTowardEntryPath ? "counts toward entry route" : null,
      ].filter(Boolean);
      return {
        title: r.title,
        provider: r.provider,
        url: r.url ?? null,
        type: r.type,
        cost: costText(r),
        time: timeText(r),
        feeds: r.skillsAddressed.map((s) => ({ skill: s, closed: s in bars })),
        // expectation line (user ruling "what you'll learn"): the first
        // addressed skill's student-facing what — terse, no new authoring
        what: r.skillsAddressed.length ? whatFor(career, r.skillsAddressed[0]) : null,
        route: routeParts.length ? routeParts.join(" · ") : null,
        suggested: suggested.has(r.id),
        startHere: startRes?.id === r.id,
      };
    }
  );
  return {
    rows,
    allClosed,
  };
}

/** M7 Pathway — engine-fed, never painted. */
export default async function PathwayPage() {
  const profile = await requireStudent();
  const { state, career, ar } = await getStudentView(profile.studentId);

  if (!career) {
    return (
      <PathwayTabs
        careerName={null}
        undecided
        plan={{} as PlanTab}
        resources={{} as ResourcesTab}
      />
    );
  }

  const open = openSkills(career, state.bars);
  const seeded = (state.stageOneQueue ?? []).filter((s) => open.includes(s));
  const queue = seeded.length ? seeded : stageOne(career, open).queue;
  // ES strip — engine-fed (traceable, never a recomputation here); the
  // dashboard view's ar input rides along so this surface reads the SAME
  // computed receipts (AR itself is not rendered on this surface — it
  // belongs to Dashboard/Prep; the ES summary lives on Dashboard/Progress/
  // Profile NACE and is deliberately NOT shown on Plan — user ruling 2026-11-02).
  const v = scoreView(career, state, ar);

  return (
    <PathwayTabs
      careerName={career.name}
      undecided={false}
      plan={buildPlan(
        career,
        state.bars,
        v.closed,
        state.stageOneQueue,
        state.decisions.verifiedTransferred
      )}
      resources={buildResources(career, state.bars, queue)}
    />
  );
}

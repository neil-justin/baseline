import { getStudentView } from "@/lib/db";
import { requireStudent } from "@/lib/session";
import { openSkills, rankOpenSkills, stageOne } from "@/lib/engines/gaps";
import { scoreView } from "@/lib/engines/rubric";
import { roundHalfDown, WEIGHTS } from "@/lib/engines/score";
import type { BarSource, Career, Resource } from "@/lib/types";
import { RESOURCES } from "@/lib/fixtures/resources";
import PathwayTabs, {
  type GapsTab,
  type QRow,
  type ResRow,
  type ResourcesTab,
  type StepsTab,
  type XRow,
} from "./PathwayTabs";
import "./pathway.css";

export const dynamic = "force-dynamic";

/**
 * M7 Pathway — MY PLAN re-cut to the dashboard DNA (v7.1, user-ruled
 * 2026-10-29): header band naming the surface with computed stage
 * counters, the ranked First-30-days queue as the family's dense plan
 * table, and wash chips + drawn-circle numerals throughout. Engine
 * semantics untouched: queue from `gaps.ts` (openSkills → rankOpenSkills
 * → seeded stageOneQueue), rationale bank with structured template
 * fallbacks; never paints thesis names, "AI", or gamified language.
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

/**
 * Rationale lines — hand-authored in the m7 plan's style where canon copy
 * exists (citations restricted to the locked bank); every other skill takes
 * the LLM-down template-fallback style. Order stays deterministic either
 * way. Dry-down ruling 2026-10-29: a rationale answers WHY this skill sits
 * where it does — the resource pointer is the table's own structural
 * RESOURCE column, so rationale rows never restate title/cost/hours.
 */
const RATIONALE: Record<string, string> = {
  "da|Spreadsheets":
    "Spreadsheets are where every Data Analyst's dataset lands first — organize and compute there before charts follow.",
  "da|Data cleaning":
    "Data Analysts spend more time cleaning data than charting it — messy columns break every step after.",
  "da|Basic statistics":
    "Analytical thinking is the top skill employers named for 2025 (69%, WEF Future of Jobs 2025). Basic statistics is where you build it.",
  "da|Dashboards (Power BI)":
    "Dashboards turn finished analysis into what hiring managers actually read.",
  "da|Chart interpretation":
    "Reading what a chart actually says is how analysis turns into a decision — analytical thinking is the top skill employers named for 2025 (69%, WEF Future of Jobs 2025), and this is where a Data Analyst builds it.",
  "da|Report writing":
    "A Data Analyst's findings land in a written report — employers named written communication at 72% on resumes (Job Outlook 2026 employer survey).",
};

function rationaleFor(career: Career, skill: string, rank: number): string {
  const authored = RATIONALE[`${career.id}|${skill}`];
  if (authored) return authored;
  return `${skill} is still open for ${career.name} — ranked ${rank} in this queue.`;
}

/** Stage-③ peek — degree routes lead with the entry route's first moves. */
function stageThreePeek(career: Career): string | null {
  if (career.id === "da") {
    return "Starts with: a small analysis portfolio · then the Google Data Analytics certificate.";
  }
  return "Starts with: an entry portfolio · then your entry credential.";
}

function buildSteps(
  career: Career,
  bars: Record<string, { source: BarSource }>,
  stageOneDone: number,
  stageOneQueue: string[] | undefined,
  closed: number
): StepsTab {
  const open = openSkills(career, bars);
  const ranked = rankOpenSkills(career, open);
  const seeded = (stageOneQueue ?? []).filter((s) => open.includes(s));
  const queue = seeded.length ? seeded : stageOne(career, open).queue;
  const mapSize = career.skills.length;

  /* EFFECT-on-rows (user-ruled, dashboard parity): each row's SP projection
     assumes the ranked rows above it close first — the dashboard plan-table
     formula verbatim (roundHalfDown over WEIGHTS.sp × closed ÷ mapSize).
     No new engine math; the numbers restate lib/engines projections. */
  const spAt = (n: number) => roundHalfDown((WEIGHTS.sp * (closed + n)) / mapSize);

  const remain: XRow[] = ranked
    .filter((r) => !queue.includes(r.skill))
    .map((r, i) => ({
      rank: stageOneDone + queue.length + i + 1,
      skill: r.skill,
      what: whatFor(career, r.skill),
      resTitle: resourceFor(career, r.skill)?.title ?? null,
      effect: { from: spAt(queue.length + i), to: spAt(queue.length + i + 1) },
    }));
  const allClosed = open.length === 0;
  const closedCount = Object.keys(bars).length;

  const queueRows: QRow[] = queue.map((skill, i) => {
    const res = resourceFor(career, skill);
    return {
      rank: stageOneDone + i + 1,
      skill,
      what: whatFor(career, skill),
      res: res
        ? { title: res.title, cost: costText(res), hrs: timeText(res) }
        : null,
      why: rationaleFor(career, skill, stageOneDone + i + 1),
      primary: i === 0,
      effect: { from: spAt(i), to: spAt(i + 1) },
    };
  });

  const clearLine = allClosed
    ? `All ${mapSize} of ${mapSize} skills checked — nothing open right now. Your next moves are the Entry-ready milestones below${
        career.id === "da"
          ? ": finish the 3-project data portfolio, then the Google Data Analytics certificate."
          : "."
      }`
    : null;

  /* counters read what is displayed: the queue IS the stage's open slots */
  const stageSlots = stageOneDone + queue.length;
  const band1 = allClosed ? "clear" : `${stageSlots} open`;
  const band2 = `${remain.length} waiting`;
  const band = [
    { num: "1", name: "First 30 days", count: band1, now: !allClosed },
    { num: "2", name: "Next steps", count: band2, now: false },
    { num: "3", name: "Entry-ready", count: "2 milestones", now: false },
  ];

  return {
    closed: closedCount,
    mapSize,
    done: stageOneDone,
    band,
    bandLabel: `Three stages: First 30 days, ${stageSlots} — current. Next steps, ${band2}. Entry-ready, 2 milestones.`,
    allClosed,
    sub: allClosed
      ? "nothing to check off — entry-ready milestones are left."
      : `the next ${queue.length} to check off${
          stageOneDone === 0 ? " — your pathway just started." : "."
        }`,
    clearLine,
    queue: queueRows,
    qfoot:
      "When skills carry the same weight, free resources made for the Philippines come first.",
    remain,
    catchUp:
      remain.length === 0 && !allClosed
        ? "you're caught up — check off a First 30 days step and the next skill moves up"
        : null,
    peek: stageThreePeek(career),
  };
}

function buildGaps(
  career: Career,
  bars: Record<string, { source: BarSource }>,
  transferred: string[],
  queue: string[],
  es: { measured: boolean; earned: number; max: number; verified: number } | null
): GapsTab {
  const allClosed = openSkills(career, bars).length === 0;
  return {
    careerName: career.name,
    closed: Object.keys(bars).length,
    mapSize: career.skills.length,
    openCount: openSkills(career, bars).length,
    rows: career.skills.map((s) => {
      const bar = bars[s.name];
      const kind: "verified" | "checked" | "claimed" | "open" = bar
        ? bar.source
        : "open";
      return {
        name: s.name,
        what: whatFor(career, s.name),
        kind,
        transferred: kind === "verified" && transferred.includes(s.name),
        openWithRes: kind === "open" && resourceFor(career, s.name) !== null,
        resTitle:
          kind === "open"
            ? resourceFor(career, s.name)?.title ?? null
            : null,
      };
    }),
    allClosed,
    esLine: es?.measured
      ? `${es.earned} of ${es.max} · ${es.verified} of 7 NACE competencies verified ·✓`
      : undefined,
    esEarn: es?.measured ? es.earned / es.max : 0,
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
    careerName: career.name,
    rows,
    allClosed,
    counts: {
      suggested: rows.filter((r) => r.suggested).length,
      alternates: rows.filter((r) => !r.suggested).length,
    },
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
        steps={{} as StepsTab}
        gaps={{} as GapsTab}
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
  // belongs to Dashboard/Prep).
  const v = scoreView(career, state, ar);
  const esMeasured = Object.keys(state.competencies ?? {}).length > 0;
  const es = esMeasured
    ? {
        measured: true,
        earned: v.es,
        max: WEIGHTS.es,
        verified: Object.values(state.competencies ?? {}).filter((x) => x === "verified").length,
      }
    : null;

  return (
    <PathwayTabs
      careerName={career.name}
      undecided={false}
      steps={buildSteps(career, state.bars, state.stageOneDone, state.stageOneQueue, v.closed)}
      gaps={buildGaps(career, state.bars, state.decisions.verifiedTransferred, queue, es)}
      resources={buildResources(career, state.bars, queue)}
    />
  );
}

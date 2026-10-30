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

/** First resource pointer per skill (typed catalog, career-scoped). */
function resourceFor(career: Career, skill: string): Resource | null {
  return (
    RESOURCES.find(
      (r: Resource) =>
        r.careerId === career.id && r.skillsAddressed.includes(skill)
    ) ?? null
  );
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
    h1: `Your next steps toward ${career.name}, ordered by what carries the most weight first.`,
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
    h1: "Your gaps",
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
  const startRes = queue.length ? resourceFor(career, queue[0]) : null;
  const rows: ResRow[] = RESOURCES.filter((r) => r.careerId === career.id).map(
    (r) => {
      const closed = r.skillsAddressed.some((s) => s in bars);
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
        route: routeParts.length ? routeParts.join(" · ") : null,
        startHere: startRes?.id === r.id,
      };
    }
  );
  return {
    h1: "Resources to close your gaps",
    careerName: career.name,
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

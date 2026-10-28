import { getStudentView } from "@/lib/db";
import { requireStudent } from "@/lib/session";
import { CAREERS, CATALOG_TOTAL, getCareer } from "@/lib/fixtures/catalog";
import { skillsMatch } from "@/lib/engines/gaps";
import { scoreView } from "@/lib/engines/rubric";
import type { BarSource } from "@/lib/types";
import CareerClient from "./CareerClient";
import {
  careerWhat,
  careerWhyLine,
  entryDisplay,
  reassessDisplay,
  reassessWhat,
  shortSkill,
  strandDisplay,
} from "./career-copy";
import type { CareerProps, MatchRowData } from "./types";
import "./career.css";

export const dynamic = "force-dynamic";

/**
 * M2/M3 Career surface — server-computed view of the student's target career,
 * explore-by-strand index (hero 12 of 32), and demo-trio skills-match, handed
 * to the tab/switch client below. Every number derives from the JSON store
 * (canon: `_fixture-math.md`); nothing here is painted.
 */

/** ticket-04 hero-table order (m3-exploration.md B.4) */
const HERO_ORDER = ["da", "swd", "nur", "cvl", "tea", "jou", "acc", "fin", "elec", "etec", "cook", "gra"];

/** the switch demo runs through the Data Analyst row (beat 6) */
const SWITCH_TARGET = getCareer("da")!;

function shortSrc(src: BarSource): string {
  return src;
}

export default async function CareerPage() {
  const profile = await requireStudent();
  const { state, career } = await getStudentView(profile.studentId);

  // --- current-career card (null → undecided default) ---
  const card = career
    ? (() => {
        const v = scoreView(career, state);
        return {
          id: career.id,
          name: career.name,
          what: careerWhat(career),
          why: careerWhyLine(career),
          strandDisplay: strandDisplay(career),
          entry: entryDisplay(career),
          closed: v.closed,
          mapSize: v.mapSize,
          stageOneDone: v.stageOne.done,
        };
      })()
    : null;

  // --- proven skills on the profile (any career) — badges + what-stays copy ---
  const verifiedBars = Object.entries(state.bars)
    .filter(([, b]) => b.source === "verified" || b.source === "checked")
    .map(([name, b]) => ({ name: shortSkill(name), src: shortSrc(b.source) }));

  const activeGoal = state.goals.find(
    (g) => g.type === "training" && g.status === "active"
  );

  // --- explore by strand: the hero 12, ticket-04 order, live filter state ---
  const explore = HERO_ORDER.map((id) => getCareer(id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .map((c) => ({
      id: c.id,
      name: c.name,
      strand: strandDisplay(c),
      skills: c.skills.length,
      entry: c.entryPath,
      live: c.id === SWITCH_TARGET.id,
    }));

  // --- skills-match: unweighted X of Y via skillsMatch, demonstrated-only ---
  const demonstrated = Object.values(state.bars).filter(
    (b) => b.source === "verified" || b.source === "checked"
  );
  const zeroConfirmed = demonstrated.length === 0;

  let matches: MatchRowData[] = [];
  if (!zeroConfirmed) {
    const scored: { c: (typeof CAREERS)[number]; x: number; y: number }[] = CAREERS.map((c) => {
      const m = skillsMatch(c, state.bars);
      return { c, x: m.x, y: m.y };
    });
    scored.sort((a, b) => b.x - a.x); // stable sort → catalog order breaks ties
    matches = scored.slice(0, 3).map(({ c, x, y }) => {
      const confirmed = c.skills
        .filter((s) => s.name in state.bars && (state.bars[s.name].source === "verified" || state.bars[s.name].source === "checked"))
        .map((s) => ({ name: shortSkill(s.name), src: shortSrc(state.bars[s.name].source) }));
      const selfReported = c.skills
        .filter((s) => state.bars[s.name]?.source === "claimed")
        .map((s) => s.name);
      return {
        id: c.id,
        name: c.name,
        x,
        y,
        current: c.id === career?.id,
        confirmed,
        selfReported,
        entry: c.entryPath,
      };
    });
  }

  // --- switch target's quick re-assessment rows (beat 6) ---
  const reassess = SWITCH_TARGET.skills.map((s) => ({
    name: s.name,
    display: reassessDisplay(s.name),
    what: reassessWhat(s.name, s.what),
  }));

  const props: CareerProps = {
    card,
    verifiedBars,
    activeGoalTitle: activeGoal?.title ?? null,
    barsSources: Object.fromEntries(
      Object.entries(state.bars).map(([name, b]) => [name, b.source])
    ),
    explore,
    exploreTotal: CATALOG_TOTAL,
    matches,
    zeroConfirmed,
    reassess,
  };

  return (
    <CareerClient {...props} />
  );
}

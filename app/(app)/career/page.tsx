import { getStudentView } from "@/lib/db";
import { requireStudent } from "@/lib/session";
import { CAREERS, CATALOG_TOTAL, getCareer } from "@/lib/fixtures/catalog";
import { skillsMatch } from "@/lib/engines/gaps";
import { scoreView } from "@/lib/engines/rubric";
import { TRACK_LABELS } from "@/lib/fixtures/catalog";
import type { BarSource } from "@/lib/types";
import CareerClient from "./CareerClient";
import {
  careerWhat,
  careerWhyLine,
  entryDisplay,
  reassessDisplay,
  reassessWhat,
  shortSkill,
} from "./career-copy";
import type { CareerProps, RoleRowData } from "./types";
import "./career.css";

export const dynamic = "force-dynamic";

/**
 * v7.2 Careers surface — server-computed one-list (ruled page architecture,
 * 2026-10-28, zero sub-tabs): the AI-ranked "Best matches for you" lens is
 * the DEFAULT view of the single role catalog, with the track-filtered
 * "All roles" fallback. Every fit number derives from the computed state
 * (`lib/engines/gaps.ts` skillsMatch over demonstrated bars only); the
 * role-detail blocks are catalog truth (PSOC / majors / JobsFit receipt /
 * provenance). Nothing here is painted.
 */

/** the switch demo runs through the Software QA Analyst row (beat 6) */
const SWITCH_TARGET = getCareer("qa")!;

/** the current card keeps its hand-authored baseline copy */
function demandLine(c: (typeof CAREERS)[number]): string {
  if (c.demandBlock.status === "institutional-judgment") {
    // ruling R4: extension roles must NEVER read as demand-named
    return "Not on the JobsFit demand lists — admitted by institutional judgment.";
  }
  return c.demandBlock.source;
}

function skillsSummary(c: (typeof CAREERS)[number]): string {
  const core = c.skills.filter((s) => s.tier === "core").length;
  const tags = [...new Set(c.skills.map((s) => s.sourceTag))];
  return `${c.skills.length} skills on the map — ${core} core · ${c.skills.length - core} supporting · ${tags.join(" · ")}`;
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
          strandDisplay: TRACK_LABELS[career.track],
          entry: entryDisplay(career),
          closed: v.closed,
          mapSize: v.mapSize,
          stageOneDone: v.stageOne.done,
        };
      })()
    : null;

  // --- proven skills on the profile (any career) — badges + what-stays copy ---
  const shortSrc = (src: BarSource): string => src;
  const verifiedBars = Object.entries(state.bars)
    .filter(([, b]) => b.source === "verified" || b.source === "checked")
    .map(([name, b]) => ({ name: shortSkill(name), src: shortSrc(b.source) }));

  const activeGoal = state.goals.find(
    (g) => g.type === "training" && g.status === "active"
  );

  // --- the one role list: the WHOLE catalog scored against demonstrated
  //     skills, catalog order breaking ties (stable sort) — the ranked lens
  //     reads this ordering straight off the engine, never painted ---
  const demonstrated = Object.values(state.bars).filter(
    (b) => b.source === "verified" || b.source === "checked"
  );
  const zeroConfirmed = demonstrated.length === 0;

  const roles: RoleRowData[] = CAREERS.map((c) => {
    const m = skillsMatch(c, state.bars);
    const confirmed =
      m.x > 0
        ? c.skills
            .filter(
              (s) =>
                s.name in state.bars &&
                (state.bars[s.name].source === "verified" ||
                  state.bars[s.name].source === "checked")
            )
            .map((s) => ({
              name: shortSkill(s.name),
              src: shortSrc(state.bars[s.name].source),
            }))
        : [];
    const selfReported = c.skills
      .filter((s) => state.bars[s.name]?.source === "claimed")
      .map((s) => s.name);
    return {
      id: c.id,
      name: c.name,
      trackLabel: TRACK_LABELS[c.track],
      x: m.x,
      y: m.y,
      what: careerWhat(c),
      why: careerWhyLine(c),
      entry: entryDisplay(c),
      live: c.id === SWITCH_TARGET.id,
      current: c.id === career?.id,
      confirmed,
      selfReported,
      psoc: `PSOC ${c.psocCode} · ${c.psocTitle}`,
      majors: c.degreeMap.join(" · "),
      demand: demandLine(c),
      skillsSummary: skillsSummary(c),
    };
  });

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
    roles,
    exploreTotal: CATALOG_TOTAL,
    zeroConfirmed,
    reassess,
  };

  return <CareerClient {...props} />;
}

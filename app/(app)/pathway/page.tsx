import type { Metadata } from "next";
import { getStudentView } from "@/lib/db";
import { requireStudent } from "@/lib/session";
import type { Career, Resource } from "@/lib/types";
import { CHECK_SKILL } from "@/lib/fixtures/checks";
import { buildWalk } from "@/lib/engines/walk";
import PathwayTabs from "./PathwayTabs";
import "./pathway.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Plan — Baseline",
};

/**
 * M7 Pathway — MY PLAN is the WALK (cutover, user-ruled 2026-11-03):
 * the page feeds the canonical walk builder (`lib/engines/walk.ts`,
 * O*NET-as-law — whole role map, core-first, fixed order) and PathwayTabs
 * renders the D2 walk; the Plan/Resources tabs and their engine builds
 * (`buildPlan`, `buildResources`, `pickResource`) retired in the same
 * landing. SP projection restates the engine math inside the walk
 * builder — nothing is recomputed here.
 */

/**
 * Q11v2 ranking — FULLY COMPUTED, no authored picks (user ruling 2026-11-02,
 * banked for the signal-gated batch; built 2026-11-03 overnight): the pick
 * rule is (1) check-linked (CHECK_SKILL join by skill name), (2) most
 * dedicated resource (fewest other skills addressed), (3) free beats paid,
 * (4) fewer hours — tiebreak only, (5) resource id A–Z final tiebreak.
 * Pick-flag retirement (engine side, user ruling): the engine NEVER reads
 * `r.pick` — the data-side flags are inert annotations, not an input.
 *
 * RETAINED after the cutover for the Q11v2 regression pins
 * (scripts/verify-fixtures.test.ts §"Q11v2 engine sort"): it no longer
 * feeds ANY render — the live surface picks via the satisfaction-tier
 * picker (`lib/engines/suggestions.ts`). Removal happens with that pins
 * block in a post-defense engine pass, not here.
 */
function sortResourcePool(pool: Resource[], skill: string): Resource[] {
  return [...pool].sort((a, b) => {
    // (1) check-linked — the check keyed to THIS skill feeds the payoff
    const linked =
      Number(CHECK_SKILL[b.id] === skill) - Number(CHECK_SKILL[a.id] === skill);
    if (linked) return linked;
    // (2) most dedicated — fewest other skills addressed
    const dedicated = a.skillsAddressed.length - b.skillsAddressed.length;
    if (dedicated) return dedicated;
    // (3) free beats paid
    const free =
      Number(/free/i.test(String(b.cost))) - Number(/free/i.test(String(a.cost)));
    if (free) return free;
    // (4) fewer hours — tiebreak only
    const hrs = (a.durationHours ?? 99) - (b.durationHours ?? 99);
    if (hrs) return hrs;
    // (5) resource id A–Z final tiebreak
    return a.id.localeCompare(b.id);
  });
}

export { sortResourcePool };

/** M7 Pathway — engine-fed, never painted. */
export default async function PathwayPage() {
  const profile = await requireStudent();
  const { state, career } = await getStudentView(profile.studentId);

  if (!career) {
    return <PathwayTabs careerName={null} undecided walk={null} />;
  }

  const walk = buildWalk(career, state.bars, state.decisions.verifiedTransferred);
  return <PathwayTabs careerName={career.name} undecided={false} walk={walk} />;
}

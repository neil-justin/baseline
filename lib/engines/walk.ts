/**
 * lib/engines/walk.ts — THE My Plan walk builder (O*NET-as-law, user-ruled
 * 2026-11-03, spec §3): required = the WHOLE role skill map for every
 * career; `sourceTag` is provenance only and does not gate anything. The
 * order law mirrors canon.ts's `order()` exactly (core tier first, then
 * stable catalog order — the path FIXED; evidence state overlays it, it
 * never re-sorts). The steps engine's gap-rank no longer defines this
 * page's order.
 *
 * Suggestions come from the ONE picker — `pickMaterial`
 * (lib/engines/suggestions.ts, spec §4 satisfaction tiers). Every walk
 * node — open AND closed — carries THE suggested material (user ruling:
 * closed skills keep a suggestion). Rows the picker cannot vet keep the
 * honest wait-state in `unvetted` (audit pending vs adviser — the two
 * emptinesses never merge, spec §5).
 *
 * The canonical pointer (canon.ts ruling): startHere = the FIRST OPEN
 * node in walk order — engine closure decides it, not a queue.
 *
 * SP projection restates the dashboard plan-table formula
 * (roundHalfDown over WEIGHTS.sp × closed ÷ mapSize); each open node's
 * slot assumes the open rows above it close first. No new engine math.
 *
 * `transferred` rides the signature for engine parity with the retired
 * Plan build (bars already carry the ·✓ source; the walk renders no
 * separate transferred line).
 */
import { CHECK_SKILL } from "@/lib/fixtures/checks";
import { pickMaterial } from "@/lib/engines/suggestions";
import { roundHalfDown, WEIGHTS } from "@/lib/engines/score";
import type { AccessState, BarSource, Career, Resource } from "@/lib/types";

export interface WalkNode {
  skill: string;
  what: string;
  state: BarSource | "open";
  /** the walk's core-tier emphasis (canon emphasis = tier === "core") */
  core: boolean;
  effect: { from: number; to: number } | null;
  /** THE one suggested material (null → the honest wait-state line) */
  material: {
    title: string;
    cost: string;
    hrs: string;
    url: string | null;
    learn: string | null;
    /** the winner's takeability fact — folded into the meta register as
     *  one word (spec §6; the audit lane does not render) */
    access: AccessState | null;
  } | null;
  hasCheck: boolean;
  /** honest micro-line flag (§6.2): open row whose material has no
   *  platform check pairing */
  noCheck: boolean;
  startHere: boolean;
  /** claims that exist but failed the audit gates */
  unvetted: number;
}

export interface WalkView {
  careerName: string;
  nodes: WalkNode[];
  closed: number;
  total: number;
}

function costText(r: Pick<Resource, "cost">): string {
  return r.cost === "free" ? "free" : `₱${r.cost.peso}`;
}

/** THE My Plan walk (O*NET-as-law): the whole map, core-first, fixed. */
export function buildWalk(
  career: Career,
  bars: Record<string, { source: BarSource }>,
  transferred: string[]
): WalkView {
  void transferred; // engine parity — see the header note

  /* the ORDER LAW, canon.ts's order() mirrored: core before secondary,
     stable catalog order otherwise */
  const skills = [...career.skills]
    .map((s, i) => ({ s, i }))
    .sort((a, b) =>
      a.s.tier === b.s.tier ? a.i - b.i : a.s.tier === "core" ? -1 : 1
    )
    .map(({ s }) => s);

  const closedCount = Object.keys(bars).filter((k) =>
    career.skills.some((s) => s.name === k)
  ).length;
  const mapSize = career.skills.length;
  const spAt = (n: number) => roundHalfDown((WEIGHTS.sp * (closedCount + n)) / mapSize);

  let openIdx = 0;
  const nodes: WalkNode[] = skills.map((s) => {
    const state = (bars[s.name]?.source ?? "open") as WalkNode["state"];
    const open = state === "open";
    const effect = open ? { from: spAt(openIdx), to: spAt(openIdx + 1) } : null;
    if (open) openIdx += 1;

    const pick = pickMaterial(career, s.name);
    const res = pick.resource;
    const hasCheck = res != null && CHECK_SKILL[res.id] === s.name;
    return {
      skill: s.name,
      what: s.what,
      state,
      core: s.tier === "core",
      effect,
      material: res
        ? {
            title: res.title,
            cost: costText(res),
            hrs: `~${res.durationHours} hrs`,
            url: res.url ?? null,
            learn: pick.learn,
            access: pick.access,
          }
        : null,
      hasCheck,
      noCheck: open && !hasCheck,
      startHere: false,
      unvetted: pick.unvetted,
    };
  });

  /* the walk's start-here pointer = FIRST OPEN node (canonical-pointer
     ruling) — engine closure moves it */
  for (const n of nodes) {
    if (n.state === "open") {
      n.startHere = true;
      break;
    }
  }

  return { careerName: career.name, nodes, closed: closedCount, total: mapSize };
}

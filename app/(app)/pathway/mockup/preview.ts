/**
 * mock/preview.ts — the D2 career-preview seam (user ask 2026-11-03: see
 * the walk on a NON-IT role without touching the account's real state).
 *
 * Client-side only, mock realm. Rebuilds the canonical inputs for ANY of
 * the 36 careers against the student's CURRENT evidence map (skill-name
 * exact matches only — a fresh role's map starts open except literal
 * overlaps). No page.tsx import (server file): the small projection
 * helpers below replicate its data shapes; SP projections ride the same
 * dashboard formula but ordered along the CANONICAL walk (a preview
 * approximation of the steps engine's ranked order — spots documented).
 */
import { CAREERS, getCareer } from "@/lib/fixtures/catalog";
import { RESOURCES } from "@/lib/fixtures/resources";
import type { PlanRow, PlanTab, ResRow, ResourcesTab } from "../PathwayTabs";
import { buildCanon, type CanonProps } from "./canon";

/** closed-state overlay: skill exact name → its provenance kind */
export type StateOverlay = ReadonlyMap<string, string>;

export interface PreviewBundle {
  careerName: string;
  props: CanonProps;
}

/** SP fixtures: the page's dashboard formula — imported from the pure
    engine module (roundHalfDown over the sp weight) */
import { roundHalfDown, WEIGHTS } from "@/lib/engines/score";

const costText = (r: { cost: "free" | { peso: number } }): string =>
  r.cost === "free" ? "free" : `₱${r.cost.peso}`;
const timeText = (r: { durationHours: number }): string => `~${r.durationHours} hrs`;

export function buildPreview(
  careerId: string,
  overlay: StateOverlay
): PreviewBundle | null {
  const career = getCareer(careerId);
  if (!career) return null;

  const mapSize = career.skills.length;
  const closedCount = career.skills.filter((s) => overlay.has(s.name)).length;
  const spAt = (n: number) => roundHalfDown((WEIGHTS.sp * (closedCount + n)) / mapSize);

  /* rows: catalog order; state from the overlay or open; open rows keep
     an SP projection slot in the same walk-order position */
  let openIdx = 0;
  const rows = career.skills.map((s) => {
    const state = (overlay.get(s.name) as PlanRow["kind"]) ?? "open";
    const open = state === "open";
    const effect = open ? { from: spAt(openIdx), to: spAt(openIdx + 1) } : null;
    if (open) openIdx += 1;
    return {
      skill: s.name,
      what: s.what,
      open,
      kind: state,
      transferred: false,
      effect,
      provenance: null,
      suggestion: null,
      hasCheck: false,
      noCheck: false,
    } as PlanRow;
  });

  const plan: PlanTab = {
    closed: closedCount,
    mapSize,
    allClosed: closedCount === mapSize,
    clearLine: null,
    rows: [...rows],
  };

  /* the career-scoped typed catalog, projected into ResRow shapes */
  const resRows: ResRow[] = RESOURCES.filter((r) => r.careerId === career.id).map(
    (r) => {
      const routeParts = [
        r.creditingBody ? `Credited by ${r.creditingBody}` : null,
        r.countsTowardEntryPath ? "counts toward entry route" : null,
      ].filter(Boolean);
      return {
        id: r.id,
        title: r.title,
        provider: r.provider,
        url: r.url ?? null,
        type: r.type,
        cost: costText(r),
        time: timeText(r),
        feeds: r.skillsAddressed.map((skill) => {
          const st = overlay.get(skill);
          return {
            skill,
            /* chips ride only on real closed provenance — "open" is not
               a FeedCell source (chips-only-where-honest ruling) */
            source:
              st && st !== "open"
                ? (st as "verified" | "checked" | "claimed")
                : null,
          };
        }),
        what: r.skillsAddressed.length
          ? career.skills.find((s) => s.name === r.skillsAddressed[0])?.what ?? null
          : null,
        route: routeParts.length ? routeParts.join(" · ") : null,
        suggested: false,
        startHere: false,
      };
    }
  );
  const resources: ResourcesTab = { rows: resRows, allClosed: closedCount === mapSize };

  const specs = career.skills.map((s) => ({
    name: s.name,
    tier: s.tier,
    sourceTag: s.sourceTag,
  }));

  const canon = buildCanon(specs, plan, resources);

  return { careerName: career.name, props: canon };
}

/** the preview roster (36 PSOC-anchored roles), label-sorted for the select */
export function previewOptions(): { id: string; name: string }[] {
  return CAREERS.map((c) => ({ id: c.id, name: c.name })).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

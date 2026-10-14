import type { Career, Resource } from "@/lib/types";
import { RESOURCES } from "@/lib/fixtures/resources";
/**
 * M4/M7 gap + ranking engines — LOCKED semantics (features.md §4):
 *  - closed = verified ·✓ | checked ·✓✓ (comprehension pass); self-report
 *    claims CLOSE A BAR for scoring (M4 semantics) but NEVER count toward
 *    skills-match "demonstrated" (locked).
 *  - priority = tier weight (core ×3, secondary ×1); ties → free-PH-resource
 *    first; then stable catalog order. Goals never reorder (no multiplier).
 *  - stages: ① next 3 highest-priority open · ② remainder · ③ cert/NC +
 *    portfolio milestones (route-dependent order).
 */

export interface RankedSkill {
  skill: string;
  tier: "core" | "secondary";
  priority: number;
  hasFreeResource: boolean;
}

export function skillsFor(career: Career): string[] {
  return career.skills.map((s) => s.name);
}

/** open set = career skill map − closed (any source closes) */
export function openSkills(career: Career, bars: Record<string, unknown>): string[] {
  return skillsFor(career).filter((name) => !(name in bars));
}

export function hasFreeResource(career: Career, skill: string): boolean {
  return RESOURCES.some(
    (r: Resource) => r.careerId === career.id && r.skillsAddressed.includes(skill) && r.cost === "free"
  );
}

/** Locked priority formula. Stable order = catalog order of the career map. */
export function rankOpenSkills(career: Career, open: string[]): RankedSkill[] {
  const orderIndex = new Map(skillsFor(career).map((n, i) => [n, i]));
  return open
    .map((skill) => {
      const spec = career.skills.find((s) => s.name === skill)!;
      const tierW = spec.tier === "core" ? 3 : 1;
      const free = hasFreeResource(career, skill);
      return {
        skill,
        tier: spec.tier,
        priority: tierW,
        hasFreeResource: free,
        freeKey: free ? 0 : 1,
        idx: orderIndex.get(skill) ?? 999,
      };
    })
    .sort((a, b) => b.priority - a.priority || a.freeKey - b.freeKey || a.idx - b.idx)
    .map(({ skill, tier, priority, hasFreeResource: free }) => ({ skill, tier, priority, hasFreeResource: free }));
}

/** Stage ① queue — next 3 of the ranked open set (1-indexed done count is state's `stageOneDone`). */
export function stageOne(career: Career, open: string[]): { queue: string[]; remaining: string[] } {
  const ranked = rankOpenSkills(career, open);
  const queue = ranked.slice(0, 3).map((r) => r.skill);
  const remaining = ranked.slice(3).map((r) => r.skill);
  return { queue, remaining };
}

/**
 * Skills-match (M3) — unweighted "X of Y" over DEMONSTRATED skills only
 * (verified ·✓ or checked ·✓✓). Self-report never counts (locked).
 */
export function skillsMatch(career: Career, bars: Record<string, { source: string }>): {
  x: number;
  y: number;
} {
  const demonstrated = Object.entries(bars).filter(
    ([, v]) => v.source === "verified" || v.source === "checked"
  );
  const y = skillsFor(career).length;
  const x = demonstrated.filter(([name]) => skillsFor(career).includes(name)).length;
  return { x, y };
}

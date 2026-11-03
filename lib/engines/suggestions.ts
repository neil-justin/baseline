import { CHECK_SKILL } from "@/lib/fixtures/checks";
import { RESOURCES } from "@/lib/fixtures/resources";
import type { AccessState, Career, Resource } from "@/lib/types";

/**
 * THE suggestion rule (spec §4, user-ruled 2026-11-03) — the satisfaction-tier
 * picker. Deterministic; claim pools only. Gates and ranking, in order:
 *   tier 1  platform check            — CHECK_SKILL[resource.id] === skill
 *   tier 2  creditingBody             — an operator vouches for the credential
 *   tier 3  countsTowardEntryPath     — the entry-path fact
 *   tier 4  free beats paid           — self-serve economics (never peso-ranked)
 *   tier 5  resource id A–Z           — the deterministic floor
 * durationHours is OUT of ranking (hours are logistics, not satisfaction) and
 * the narrow-claim "most dedicated" bonus is DEAD — a claim satisfies what its
 * audit fields say it satisfies, nothing finer.
 * Eligibility = form "taught" × self-serve access: rows without audit fields
 * are UNVETTED — they count in `unvetted`, they never win (no pretend pick).
 */
const SELF_SERVE = new Set<AccessState>(["direct", "account", "exam-paid"]);

/** typed catalog filter — the pick pool is the career's own claim rows */
const RESOURCES_BY_CAREER = (id: string): Resource[] =>
  RESOURCES.filter((r) => r.careerId === id);

export interface MaterialPick {
  /** the winner, or null when nothing vetted exists for this skill */
  resource: Resource | null;
  /** authored learn line: resource.learnNotes[skill] */
  learn: string | null;
  /** the winner's takeability fact (direct/account/exam-paid when it wins) */
  access: AccessState | null;
  /** claims that exist but failed the audit gates */
  unvetted: number;
}

const creditBody = (r: Resource): string | null =>
  /* corroborated by the route render the old build derived from this field */
  r.creditingBody ?? null;

const tierScores = (r: Resource, skill: string): [number, number, number, number] => [
  CHECK_SKILL[r.id] === skill ? 0 : 1,
  creditBody(r) ? 0 : 1,
  r.countsTowardEntryPath ? 0 : 1,
  r.cost === "free" ? 0 : 1,
];

const canWin = (r: Resource): boolean =>
  r.form === "taught" && r.access != null && SELF_SERVE.has(r.access);

/** THE suggestion rule (spec §4). Deterministic; claim pools only. */
export function pickMaterial(career: Career, skill: string): MaterialPick {
  const pool = RESOURCES_BY_CAREER(career.id).filter((r) =>
    r.skillsAddressed.includes(skill)
  );
  const vetted = pool.filter(canWin);
  const unvetted = pool.length - vetted.length;
  if (vetted.length === 0) return { resource: null, learn: null, access: null, unvetted };

  const ranked = [...vetted]
    .map((r) => ({ r, s: tierScores(r, skill) }))
    .sort((a, b) => {
      for (let i = 0; i < a.s.length; i++) if (a.s[i] !== b.s[i]) return a.s[i] - b.s[i];
      return a.r.id.localeCompare(b.r.id);
    })
    .map(({ r }) => r);

  const w = ranked[0];
  return {
    resource: w,
    learn: w.learnNotes?.[skill] ?? null,
    access: w.access ?? null,
    unvetted,
  };
}

/**
 * skill-display.ts — the one canonical → display-name mapper for user-facing
 * text (user ruling 2026-11-05, /careers skills-on-this-map issue).
 *
 * The catalog carries the printed PSF-SDS role-map structure inside canonical
 * skill names ("↳ CWF sub-row: Optimize systems performance", "↳ task-cluster
 * sub-row: site life-operations"). That sub-row marker is artifact notation —
 * it keys the skill banks, resources, synonyms and verify-fixtures tests, and
 * it must never render raw. Every display surface routes through here.
 *
 * Known near-duplicate (user ruling 2026-11-05, accepted as-is): on the DBA
 * map the parent "Database Administration" sits next to the stripped sub-row
 * "Oversee database administration" — verbose but truthful; no display-time
 * renaming (name-discipline: roster's printed label kept).
 */
export function skillDisplay(name: string): string {
  return name.replace(/^↳ [A-Za-z-]+ sub-row: /, "");
}

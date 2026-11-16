/**
 * Canon programs — the Program dropdown's vocabulary, extracted from the
 * profile page's IIFE (2026-11-06 funnel rework) so BOTH the profile's
 * Program field and the onboarding Background step read one source.
 *
 * The SAME tokens /career's degree gate matches against: each career's
 * raw degreeMap entries, annotations "(…)" stripped. Tier lines ("any CHED
 * canon program", "open-door …", "any business-track canon …" and any other
 * leading "any …" line) are not programs and drop out.
 *
 * Track filtering: a program belongs to a track when some career of that
 * track lists it — the canon careers carry the track, the degreeMap carries
 * the program. canonProgramsOf() with no track returns the full vocabulary
 * (the profile page's historic behavior, unchanged).
 */
import { CAREERS } from "@/lib/fixtures/catalog";

const TIER_LINE = /canon|open-door/i;

export function canonProgramsOf(track?: string): string[] {
  const set = new Set<string>();
  for (const c of CAREERS) {
    if (track && c.track !== track) continue;
    for (const d of c.degreeMap ?? []) {
      if (TIER_LINE.test(d) || /^any /.test(d.trim())) continue;
      const name = d.replace(/\(.*?\)/g, "").trim();
      if (name) set.add(name);
    }
  }
  return [...set].sort();
}

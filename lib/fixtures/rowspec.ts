import type { RowSpecMap } from "@/lib/fixtures/rowspec/types";
import { ROW_SPECS_IT } from "@/lib/fixtures/rowspec/it";
import { ROW_SPECS_BUSINESS } from "@/lib/fixtures/rowspec/business";
import { ROW_SPECS_ACCOUNTING } from "@/lib/fixtures/rowspec/accounting";
import { ROW_SPECS_OFFICE } from "@/lib/fixtures/rowspec/office";

/**
 * Per-row deep data for the converted catalog — the BLESSED role-spec layer
 * (per-track user blessing 2026-10-30, map.md). One entry per catalog skill
 * row, keyed `${roleId}::${skillName}`; four track files mirror the catalog's
 * track structure. Entries carry the source descriptor (verbatim where
 * printed), the attributed verbatim task anchors, the spec provenance, and
 * the statuses/flags that must never be dropped (ruling markers, pinned-*
 * pending markers, declared-thin zones, statutory keep-with-flag treatment).
 *
 * Boundaries honoured: this is fixture data only — `lib/types.ts` SkillSpec
 * keeps its four-field shape, the engine files are untouched, and O*NET
 * quoting stays at the placeholder/attribution level until the Model C
 * version pin (ADR 0005).
 */

export type { RowSpec, RowSpecMap } from "@/lib/fixtures/rowspec/types";

export const ROW_SPECS: RowSpecMap = {
  ...ROW_SPECS_IT,
  ...ROW_SPECS_BUSINESS,
  ...ROW_SPECS_ACCOUNTING,
  ...ROW_SPECS_OFFICE,
};

/** full row key for a role + skill */
export function rowSpecKey(roleId: string, skill: string): string {
  return `${roleId}::${skill}`;
}

/** the deep-data lookup for a catalog row (null-safe) */
export function getRowSpec(roleId: string, skill: string): RowSpecMap[string] | undefined {
  return ROW_SPECS[rowSpecKey(roleId, skill)];
}

/**
 * Per-row deep data for the converted catalog — the blessed role-spec layer
 * (2026-10-30 conversion). Keyed `${roleId}::${skillName}`; the map lives in
 * sibling track files (rowspec/{it,business,accounting,office}.ts) mirroring
 * the catalog's four-track structure.
 *
 * This is fixture/deep-data only: the engine math files and lib/types.ts are
 * untouched (RuntimeSpec keeps its four-field shape); rowspec is consumed by
 * the integrity checks and, later, by citation/provenance surfaces.
 */

export interface RowSpec {
  /** the source's descriptor where it prints one (verbatim), else the row's descriptor basis */
  descriptor: string;
  /** attributed, verbatim task anchors (empty only where the spec records the row anchorless) */
  anchors: string[];
  /** provenance — the spec file + row id this content traces to */
  specRef: string;
  /** statuses/flags that must never be dropped (rulings, pinned-pending markers, thin zones) */
  flags?: string[];
}

export type RowSpecMap = Record<string, RowSpec>;

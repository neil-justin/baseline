import { describe, it, expect } from "vitest";
import { CAREERS } from "@/lib/fixtures/catalog";
import { buildPreview } from "@/app/(app)/pathway/mockup/preview";

/**
 * Canon regression — §3 O*NET-as-law (user-ruled 2026-11-03, "O*NET
 * everything — Option 1"): the canonical walk's required set is THE ENTIRE
 * ROLE SKILL MAP for every career. The "regulated = TESDA/PSF sourceTag"
 * gate is retired; sourceTag demotes to provenance metadata.
 *
 * What this pins, for EVERY career (36):
 *   1. floor section non-empty — the floor IS the whole map, never empty;
 *   2. floor total === career.skills.length — nothing demoted off the walk;
 *   3. gate/entry sections derive without throwing (resource-based, not
 *      sourceTag-based — cert/NC-typed resources and entry-route rows);
 *   4. every floor skill node carries required = true;
 *   5. recommended/optional emit EMPTY (retired, shape kept for the
 *      d1/d3 sibling variants' contract).
 *
 * A coverage table (role → floor size) prints to stdout for the user's
 * reading. Empty maps are NOT acceptable anywhere — the law has no gaps.
 */

describe("O*NET-as-law canon regression (§3, user-ruled 2026-11-03) — all 36 careers", () => {
  const rows = CAREERS.map((career) => {
    const preview = buildPreview(career.id, new Map());
    expect(preview, `${career.id} (${career.name}) built no preview`).not.toBeNull();
    const { careerName, props } = preview!;
    const floor = props.sections.find((s) => s.id === "floor");
    const gate = props.sections.find((s) => s.id === "gate");
    const entry = props.sections.find((s) => s.id === "entry");
    const recommended = props.sections.find((s) => s.id === "recommended");
    const optional = props.sections.find((s) => s.id === "optional");

    /* 1 — the floor IS the whole map: never empty */
    expect(floor, `${careerName}: no floor section`).toBeDefined();
    expect(floor!.nodes.length, `${careerName}: empty floor`).toBeGreaterThan(0);

    /* 2 — nothing demoted: floor total === the career's full skill map */
    expect(floor!.total, `${careerName}: floor (${floor!.total}) ≠ map (${career.skills.length})`).toBe(career.skills.length);

    /* 3 — gate + entry derive without throwing (sections exist; empty is
        honest where a role holds no cert-typed resources) */
    expect(gate, `${careerName}: gate section missing`).toBeDefined();
    expect(entry, `${careerName}: entry section missing`).toBeDefined();
    expect(Array.isArray(gate!.nodes), `${careerName}: gate nodes not an array`).toBe(true);
    expect(Array.isArray(entry!.nodes), `${careerName}: entry nodes not an array`).toBe(true);
    for (const n of [...gate!.nodes, ...entry!.nodes]) {
      expect(n.kind === "gate" || n.kind === "entry").toBe(true);
      expect(n.required, `${careerName}: ${n.label} required mismatch`).toBe(n.kind === "gate");
    }

    /* 4 — O*NET-as-law on every skill node: required = true */
    for (const n of floor!.nodes) {
      expect(n.kind, `${careerName}: non-skill node in floor`).toBe("skill");
      expect(n.required, `${careerName}: ${n.label} not required (demoted by old sourceTag gate?)`).toBe(true);
    }

    /* 5 — the retired sections emit empty (shape kept for the contract) */
    expect(recommended!.nodes, `${careerName}: recommended not empty`).toEqual([]);
    expect(optional!.nodes, `${careerName}: optional not empty`).toEqual([]);

    const gateSize = gate!.nodes.length;
    const entrySize = entry!.nodes.length;
    return { name: careerName, floor: floor!.total, gate: gateSize, entry: entrySize };
  });

  it("the coverage table — role name → floor size (gate/entry sizes alongside)", () => {
    const width = Math.max(...rows.map((r) => r.name.length));
    const lines = [
      "",
      "────────────────────────────────────────────────────────",
      " O*NET-as-law canon — floor coverage (36 roles)",
      "────────────────────────────────────────────────────────",
      ` ${"ROLE".padEnd(width)}  FLOOR  GATE  ENTRY`,
      "────────────────────────────────────────────────────────",
      ...rows.map(
        (r) =>
          ` ${r.name.padEnd(width)}  ${String(r.floor).padStart(5)}  ${String(r.gate).padStart(4)}  ${String(r.entry).padStart(5)}`
      ),
      "────────────────────────────────────────────────────────",
      ` total skill rows on the floor: ${rows.reduce((a, r) => a + r.floor, 0)}`,
      "────────────────────────────────────────────────────────",
    ];
    console.log(lines.join("\n"));
  });
});

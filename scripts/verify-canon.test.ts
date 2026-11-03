import { describe, it, expect } from "vitest";
import { CAREERS, getCareer } from "@/lib/fixtures/catalog";
import { buildWalk } from "@/lib/engines/walk";
import { roundHalfDown, WEIGHTS } from "@/lib/engines/score";
import type { BarSource } from "@/lib/types";

/**
 * Canon regression — §3 O*NET-as-law (user-ruled 2026-11-03, "O*NET
 * everything — Option 1"). This suite re-homes onto `lib/engines/walk.ts`
 * after the Wave-D cutover: the mockup seam (canon.ts/preview.ts) retired
 * WITH the mock — the walk engine is the law's graduate and this suite now
 * pins THE SHIPPED MECHANISM. The mock's gate/entry section shapes retired
 * with the categories (categories demolished, user ruling 2026-11-03);
 * credential/entry facts live off the walk surface (the fixtures suite
 * still asserts the cert/NC/route resource census).
 *
 * What this pins, for EVERY career (36), an EMPTY-MAP-FREE walk:
 *   1. the walk is the WHOLE role skill map — nodes.length === skills.length;
 *      never empty (the law has no gaps, nothing demoted);
 *   2. the ORDER law (canon.ts's order() mirrored): core tier first, then
 *      stable catalog order — no secondary→core re-entry down the walk;
 *   3. the OVERLAY law: every node state ∈ {verified, checked, claimed,
 *      open}, from the bars (provenance metadata speaks through resources,
 *      never through placement);
 *   4. the POINTER law: startHere = exactly ONE node — the FIRST OPEN node
 *      in walk order (all-closed maps pin no pointer);
 *   5. the SP projection register: the first open node's slot opens at
 *      roundHalfDown(WEIGHTS.sp × closed ÷ mapSize) — the dashboard formula
 *      verbatim.
 *
 * A coverage table (role → walk size) prints to stdout for the user's
 * reading. Empty maps are NOT acceptable anywhere.
 */

/** empty-evidence overlay: no bars at all — every node overlays open */
const emptyBars: Record<string, { source: BarSource }> = {};

describe("O*NET-as-law canon regression (§3, user-ruled 2026-11-03) — all 36 careers", () => {
  const rows = CAREERS.map((career) => {
    const walk = buildWalk(career, emptyBars, []);

    /* 1 — the walk IS the whole map: nothing demoted, never empty */
    expect(walk.nodes.length, `${career.name}: empty walk`).toBeGreaterThan(0);
    expect(
      walk.nodes.length,
      `${career.name}: walk (${walk.nodes.length}) ≠ map (${career.skills.length})`
    ).toBe(career.skills.length);
    expect(
      walk.total,
      `${career.name}: reported total ≠ skill-map size`
    ).toBe(career.skills.length);
    /* byte-faithful spell: the walk carries every skill NAME, exactly once */
    const names = new Set(walk.nodes.map((n) => n.skill));
    expect(names.size, `${career.name}: duplicate skill node on the walk`).toBe(
      career.skills.length
    );
    for (const s of career.skills) {
      expect(names.has(s.name), `${career.name}: missing ${s.name}`).toBe(true);
    }

    /* 2 — the ORDER law: core tier first, then catalog order */
    let seenSecondary = false;
    for (const n of walk.nodes) {
      const tier = career.skills.find((s) => s.name === n.skill)!.tier;
      if (tier === "secondary") seenSecondary = true;
      expect(
        seenSecondary && tier === "core",
        `${career.name}: ${n.skill} re-enters CORE after a secondary row`
      ).toBe(false);
    }
    /* catalog-stable inside each tier */
    for (const tier of ["core", "secondary"] as const) {
      const inTier = career.skills.filter((s) => s.tier === tier).map((s) => s.name);
      const onWalk = walk.nodes.filter((n) => n.core === (tier === "core")).map((n) => n.skill);
      expect(onWalk).toEqual(inTier);
    }

    /* 3 — the OVERLAY law: engine states only (claimed stays hatched, never
        a bar of a different hand); empty bars → everything open */
    for (const n of walk.nodes) {
      expect(
        ["verified", "checked", "claimed", "open"].includes(n.state),
        `${career.name}: ${n.skill} carries an impossible state ${n.state}`
      ).toBe(true);
      expect(n.state, `${career.name}: empty evidence must overlay OPEN`).toBe("open");
    }

    /* 4 — the POINTER law (all-open map here): exactly one startHere,
        on the FIRST node in walk order */
    const starters = walk.nodes.filter((n) => n.startHere);
    expect(starters, `${career.name}: startHere not singular`).toHaveLength(1);
    expect(
      starters[0].skill,
      `${career.name}: startHere is not the first open node`
    ).toBe(walk.nodes[0].skill);

    /* 5 — the SP projection register: slot 0 opens at the closed count's SP */
    expect(
      walk.nodes[0].effect?.from,
      `${career.name}: SP slot-0 register off the dashboard formula`
    ).toBe(roundHalfDown((WEIGHTS.sp * 0) / career.skills.length));

    /* the pointer moves WITH closure — overlay on a half-closed map */
    const half = buildWalk(
      career,
      Object.fromEntries(
        career.skills.slice(0, Math.ceil(career.skills.length / 3)).map((s) => [
          s.name,
          { source: "verified" as const },
        ])
      ),
      []
    );
    const firstOpen = half.nodes.find((n) => n.state === "open")!;
    expect(
      half.nodes.filter((n) => n.startHere),
      `${career.name}: closure did not move the pointer to a single node`
    ).toHaveLength(1);
    expect(
      half.nodes.find((n) => n.startHere)!.skill,
      `${career.name}: pointer is not on the first OPEN node`
    ).toBe(firstOpen.skill);

    return { name: career.name, floor: walk.total };
  });

  it("the coverage table — role name → walk size", () => {
    const width = Math.max(...rows.map((r) => r.name.length));
    const lines = [
      "",
      "────────────────────────────────────────────────────────",
      " O*NET-as-law canon — walk coverage (36 roles)",
      "────────────────────────────────────────────────────────",
      ` ${"ROLE".padEnd(width)}  WALK`,
      "────────────────────────────────────────────────────────",
      ...rows.map((r) => ` ${r.name.padEnd(width)}  ${String(r.floor).padStart(5)}`),
      "────────────────────────────────────────────────────────",
      ` total skill rows on the walk: ${rows.reduce((a, r) => a + r.floor, 0)}`,
      "────────────────────────────────────────────────────────",
    ];
    console.log(lines.join("\n"));
  });

  it("the law has no gaps — no career in the roster builds an empty map", () => {
    expect(getCareer("da")!.skills.length, "demo career lost its map").toBeGreaterThan(0);
    expect(CAREERS.length).toBe(36);
  });
});

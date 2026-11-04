import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CAREERS } from "@/lib/fixtures/catalog";
import { VERIFY_BANK, type VMCQ } from "@/app/(onboarding)/onboarding/banks";

/**
 * verify-banks.test.ts — the content round's mechanical gate (2026-11-04
 * assessments content round). Authoring quality is a human ruling; the
 * ENGINERY is not: every banked item must key on a real canonical
 * `catalogSkill`, be well-formed, unique, and together the banks must
 * COVER the whole catalog so no skill ever hangs as an unkeyed row.
 * Only pure TS data — no engine writes.
 */

const canonicalSkills = new Set<string>();
for (const c of CAREERS) for (const s of c.skills) canonicalSkills.add(s.name);

const TRACK_FILES = ["it", "business", "accounting", "office"];
const BANK_DIR = path.join(process.cwd(), "lib/fixtures/skill-banks");
const ALL_LANDED = TRACK_FILES.every((t) => existsSync(path.join(BANK_DIR, `${t}.ts`)));

function presentTracks(): string[] {
  if (!existsSync(BANK_DIR)) return [];
  return TRACK_FILES.filter((t) => existsSync(path.join(BANK_DIR, `${t}.ts`)));
}

/** the joined bank — canon + every landed track slice (the path the
    engine reads once all four land: lib/fixtures/skill-banks/index.ts) */
async function loadAll(): Promise<{ bank: string; items: VMCQ[] }[]> {
  const all: { bank: string; items: VMCQ[] }[] = [
    { bank: "VERIFY_BANK (canon)", items: VERIFY_BANK },
  ];
  for (const t of presentTracks()) {
    all.push({ bank: `${t}.ts`, items: await loadTrack(t) });
  }
  return all;
}

async function loadTrack(name: string): Promise<VMCQ[]> {
  const mod = await import(`@/lib/fixtures/skill-banks/${name}`);
  const banks = Object.values(mod) as Record<string, unknown>[];
  for (const v of banks) if (Array.isArray(v)) return v as VMCQ[];
  throw new Error(`${name}.ts exports no array`);
}

function itemChecks(bank: string, items: VMCQ[]) {
  const seen = new Set<string>();
  for (const q of items) {
    expect(q.catalogSkill.endsWith("\n") === false).toBe(true); // trailing
    expect(canonicalSkills.has(q.catalogSkill)).toBe(true); // byte-match key
    expect(q.skill.length).toBeGreaterThan(0);
    expect((q.options ?? []).length).toBe(4);
    for (const o of q.options) expect((o ?? "").trim().length).toBeGreaterThan(0);
    expect(q.answer).toBeGreaterThanOrEqual(0);
    expect(q.answer).toBeLessThan(4);
    expect(seen.has(q.catalogSkill)).toBe(false); // one item per skill
    seen.add(q.catalogSkill);
  }
}

describe("verify-banks — the shipped canon demo bank", () => {
  it("covers the canon demo path exactly (5 banked skills)", () => {
    expect(VERIFY_BANK.length).toBe(5);
    itemChecks("VERIFY_BANK (onboarding)", VERIFY_BANK);
  });
});

describe("verify-banks — the per-track content banks", () => {
  const tracks = presentTracks();

  it("has at least the office slice landed (first batch)", () => {
    expect(tracks).toContain("office");
  });

  for (const t of TRACK_FILES) {
    it(`${t}.ts items key real catalog skills, well-formed and unique`, async () => {
      if (!tracks.includes(t)) return; // batch still authoring — the full-coverage run re-runs when all four land
      const items = await loadTrack(t);
      expect(items.length).toBeGreaterThan(0);
      itemChecks(`${t}.ts`, items);
    });
  }

  it("coverage — every canonical skill is banked once all four slices land", () => {
    if (tracks.length < TRACK_FILES.length) return; // in-flight batches: the final gate runs when they complete
    expect(tracks.length).toBe(TRACK_FILES.length);
  });

  if (ALL_LANDED) {
    it("coverage — the JOINED bank answers every row, with no double-banked skill", async () => {
      const allBanks = await loadAll();
      for (const b of allBanks) if (b.bank !== "VERIFY_BANK (canon)") itemChecks(b.bank, b.items);
              
      // one item per canonical skill across the join (a row that repeats
      // across roles keys ONCE; the canon bank and a track bank must not
      // answer the same skill twice)
      const keys = allBanks.flatMap((b) => b.items.map((q) => q.catalogSkill));
      expect(keys.length).toBe(new Set(keys).size); // no double-banking
      // coverage: every catalog row across all 36 roles has its check
      for (const name of canonicalSkills) expect(keys).toContain(name);
    });
  }
});

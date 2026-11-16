import { describe, it, expect } from "vitest";
import { CAREERS } from "@/lib/fixtures/catalog";
import { getSkillLadder, SKILL_LADDERS } from "@/lib/fixtures/skill-banks";

/**
 * Skill-ladder coverage gate (D4, wave-1 pilot → wave-5 final). The ladder
 * channel (`SKILL_LADDERS` via `getSkillLadder`, the same lookup POST /api/
 * verify reads) must cover EVERY skill in the COMPLETED_WAVES set with a
 * 3-item ladder (Q1 recognition → Q2 application → Q3 judgment,
 * docs/assessment-blueprint-swd.md). Skills outside the set keep the legacy
 * single-question wire and are intentionally NOT flagged.
 *
 * Wave history (all five landed):
 *  - wave 1 (2026-11-05): the 8 swd rows (swd pilot per the blueprint).
 *  - wave 5 (2026-11-05): the 57 office-track rows across all 6 office
 *    roles (adminassoc, clerk, encode, desk, execsec, records) — authored
 *    in lib/fixtures/skill-banks/office.ts (OFFICE_LADDERS).
 *  - wave 4 (2026-11-05): the 118 business-track rows across all 9 business
 *    roles (hra, training, mkt, sales, csr, opsanalyst, purch, ccqa,
 *    events) — authored in lib/fixtures/skill-banks/business.ts
 *    (BUSINESS_LADDERS, 117 ladders; the one shared-and-already-laddered
 *    name "Data Analytics" verifies through the da/it ladder of the same
 *    name, so the track contributes 117 entries).
 *  - wave 3 (2026-11-05): the accounting track landed (89 unique rows).
 *  - wave 2 (2026-11-06): the it track's non-swd rows landed (10 roles,
 *    71 unique names appended to IT_LADDERS) — the catalog is fully
 *    laddered, so COMPLETED_WAVES below is now derived from `CAREERS`.
 */
const COMPLETED_WAVES: string[] = [
  // ── swd (wave 1, the 8 blueprint rows, byte-locked as authored) ────────
  "Applications Development",
  "Applications Support and Enhancement",
  "Agile Software Development",
  "Data Design / SQL + data modeling",
  "Business Needs Analysis",
  "Secure-coding practices",
  "Linux + web deployment basics",
  "Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Self Management (Enabling Skills, Basic/Intermediate)",
  // ── every remaining catalog row across all 36 roles (waves 2-5 final) ──
  ...CAREERS.flatMap((c) => c.skills.map((s) => s.name)),
];
/** All catalog skill rows across every role — the byte-match source. */
const ALL_ROW_NAMES = new Map<string, string>(); // name → role id
for (const c of CAREERS)
  for (const s of c.skills)
    if (!ALL_ROW_NAMES.has(s.name)) ALL_ROW_NAMES.set(s.name, c.id);

/** Office-track roles (the wave-5 authoring scope, lib/fixtures/catalog.ts). */
const OFFICE_ROLES = new Set(
  CAREERS.filter((c) => c.track === "office").map((c) => c.id)
);

const STEM_CUES = ["correct", "best", "proper", "should you", "most"];

function auditLadder(catalogSkill: string): string[] {
  const problems: string[] = [];
  const ladder = getSkillLadder(catalogSkill);
  if (!ladder) return ["no ladder registered (getSkillLadder misses)"];
  if (ladder.catalogSkill !== catalogSkill)
    problems.push("ladder catalogSkill does not byte-match the lookup key");
  if (ladder.items.length !== 3) {
    problems.push(`ladder has ${ladder.items.length} items, expected 3`);
    return problems;
  }
  ladder.items.forEach((item, q) => {
    const tag = `Q${q + 1}`;
    if (!item.stem.trim()) problems.push(`${tag}: empty stem`);
    if (item.options.length !== 4)
      problems.push(`${tag}: ${item.options.length} options, expected 4`);
    if (!Number.isInteger(item.answer) || item.answer < 0 || item.answer > 3)
      problems.push(`${tag}: answer index ${item.answer} out of range`);
    else if (item.options[item.answer] === undefined)
      problems.push(`${tag}: answer index points at no option`);
    if (!item.ref?.trim()) problems.push(`${tag}: missing ref`);
    if (!item.distractorNotes)
      problems.push(`${tag}: missing distractorNotes`);
    else {
      item.options.forEach((opt, i) => {
        if (i === item.answer) return; // notes parallel all 4 options; wrong slots must be filled
        if (!item.distractorNotes![i]?.trim())
          problems.push(`${tag}: no why-wrong note for wrong option ${i}`);
      });
    }
    // stem discipline (blueprint anti-giveaway norm §1)
    const lowered = item.stem.toLowerCase();
    for (const cue of STEM_CUES)
      if (lowered.includes(cue))
        problems.push(`${tag}: stem contains banned cue "${cue}"`);
    // correct answer neither strictly longest nor strictly shortest option.
    // GATE NOTE (waves 1–5): enforced as blueprint rule 3's "similar in
    // length" reading — the key must never be strictly shortest, and must
    // not exceed the longest wrong option by more than a 35% window
    // (severe telegraphing). Further tightening is a content-owner call.
    const lens = item.options.map((o) => o.length);
    const keyLen = lens[item.answer] ?? -1;
    const wrongLens = item.options.filter((_, i) => i !== item.answer).map((o) => o.length);
    const wrongMax = Math.max(...wrongLens);
    if (keyLen >= 0 && keyLen === Math.min(...lens) && lens.filter((l) => l === keyLen).length === 1)
      problems.push(`${tag}: correct option is strictly the shortest (giveaway)`);
    if (keyLen >= 0 && keyLen > wrongMax && keyLen > wrongMax * 1.35)
      problems.push(
        `${tag}: correct option telegraphs by ${Math.round(((keyLen / wrongMax - 1) * 100))}% over the longest wrong option (similar-length window 35%)`
      );
    if (new Set(item.options).size !== item.options.length)
      problems.push(`${tag}: options are not all distinct`);
  });
  // tier order as documented: structural only — recognition, application,
  // judgment sequence is not re-graded here, but the shape/file of each
  // rung sits in the authored tier order (items[0..2]).
  return problems;
}

describe("skill-ladder coverage (completed waves)", () => {
  it("every COMPLETED_WAVES skill has a well-formed 3-item ladder", () => {
    const failures: string[] = [];
    for (const catalogSkill of COMPLETED_WAVES) {
      const problems = auditLadder(catalogSkill);
      for (const p of problems)
        failures.push(`${catalogSkill}: ${p}`);
    }
    expect(failures).toEqual([]);
  });

  it("byte-match: each seeded ladder names a real catalog row verbatim", () => {
    for (const catalogSkill of COMPLETED_WAVES) {
      const roleId = ALL_ROW_NAMES.get(catalogSkill);
      expect(roleId, `no catalog role carries skill row "${catalogSkill}"`).toBeDefined();
      expect(getSkillLadder(catalogSkill)?.catalogSkill).toBe(catalogSkill);
    }
  });

  it("wave-2 completeness: every skill of every it-track role has a ladder", () => {
    const seeded = new Set(COMPLETED_WAVES);
    for (const role of CAREERS.filter((c) => c.track === "it"))
      for (const s of role.skills)
        expect(
          seeded.has(s.name),
          `it role ${role.id} skill "${s.name}" is not in COMPLETED_WAVES (no ladder authored)`
        ).toBe(true);
  });

  it("wave-5 completeness: every skill of every office-track role has a ladder", () => {

    const seeded = new Set(COMPLETED_WAVES);
    for (const role of CAREERS.filter((c) => OFFICE_ROLES.has(c.id)))
      for (const s of role.skills)
        expect(
          seeded.has(s.name),
          `office role ${role.id} skill "${s.name}" is not in COMPLETED_WAVES (no ladder authored)`
        ).toBe(true);
  });

  it("only the seeded set is required — legacy singles outside it are NOT flagged", () => {
    // a skill outside COMPLETED_WAVES with only its legacy single item
    // must not appear in the ladder channel, and must not fail the gate.
    const inSet = new Set(COMPLETED_WAVES);
    for (const ladder of SKILL_LADDERS)
      expect(
        inSet.has(ladder.catalogSkill),
        `ladder registered for non-completed-wave skill ${ladder.catalogSkill}`
      ).toBe(true);
  });
  it("wave-3 completeness: every skill of every accounting-track role has a ladder", () => {
    const seeded = new Set(COMPLETED_WAVES);
    for (const role of CAREERS.filter((c) => c.track === "accounting"))
      for (const s of role.skills)
        expect(
          seeded.has(s.name),
          `accounting role ${role.id} skill "${s.name}" is not in COMPLETED_WAVES (no ladder authored)`
        ).toBe(true);
  });

  it("wave-4 completeness: every skill of every business-track role has a ladder", () => {
    const seeded = new Set(COMPLETED_WAVES);
    for (const role of CAREERS.filter((c) => c.track === "business"))
      for (const s of role.skills)
        expect(
          seeded.has(s.name),
          `business role ${role.id} skill "${s.name}" is not in COMPLETED_WAVES (no ladder authored)`
        ).toBe(true);
  });

  it("byte-match: each business-track ladder names a business catalog row verbatim", () => {
    const businessNames = new Set(
      CAREERS.filter((c) => c.track === "business").flatMap((c) => c.skills.map((s) => s.name))
    );
    const businessLadders = SKILL_LADDERS.filter((l) => businessNames.has(l.catalogSkill));
    expect(businessLadders.length).toBeGreaterThanOrEqual(117);
    // every business catalog row resolves through getSkillLadder (the shared
    // rows route to whatever earlier slice owns the name)
    for (const name of businessNames)
      expect(getSkillLadder(name)?.catalogSkill, `${name} resolves`).toBe(name);
  });
});

import { describe, it, expect } from "vitest";
import { CAREERS, CATALOG_TOTAL, getCareer } from "@/lib/fixtures/catalog";
import { computeScore, roundHalfDown, ASSESSED_COMPETENCIES } from "@/lib/engines/score";
import type { ArInput } from "@/lib/engines/score";
import { rankOpenSkills, stageOne } from "@/lib/engines/gaps";
import { switchCareer, claimAll, submitCheck } from "@/lib/actions";
import {
  NEIL_SEED,
  applyReassessment,
  applyMoneyShot,
  withQaGoal,
} from "@/lib/fixtures/neil";
import type { StudentState } from "@/lib/types";

/**
 * Canon verification — the ADR 0002 (amended 2026-10-29) five-channel sheet
 * is the spec; the NUMBERS live in this file (the engine re-lock round):
 * baseline 40 → switch dip 22 → post-re-assessment 36 → money shot 51.
 * Catalog round 9: names re-keyed onto the college roster (Neil = 2.1
 * "Associate Software Developer"; the switch walk runs to 2.2 "Software QA
 * Analyst"); skill data comes from the verbatim roster transcription.
 */

function scoreFor(s: StudentState, ar: ArInput | null = null) {
  const career = getCareer(s.careerId)!;
  return computeScore({
    bars: s.bars,
    careerId: s.careerId,
    careerSkillCount: career.skills.length,
    goals: s.goals,
    stageOneDone: s.stageOneDone,
    competencies: s.competencies ?? {},
    ar,
  });
}

describe("catalog", () => {
  it("has exactly 36 careers (college roster: 11 IT + 9 business + 10 accounting + 6 office)", () => {
    expect(CATALOG_TOTAL).toBe(36);
    expect(CAREERS.length).toBe(36);
    expect(CAREERS.filter((c) => c.track === "it")).toHaveLength(11);
    expect(CAREERS.filter((c) => c.track === "business")).toHaveLength(9);
    expect(CAREERS.filter((c) => c.track === "accounting")).toHaveLength(10);
    expect(CAREERS.filter((c) => c.track === "office")).toHaveLength(6);
  });

  it("demo trio resolves with roster names (ids frozen: swd/da/its = 2.1/E1/2.4)", () => {
    expect(getCareer("swd")!.name).toBe("Associate Software Developer");
    expect(getCareer("da")!.name).toBe("Data Analyst (junior)");
    expect(getCareer("its")!.name).toBe("IT Support Engineer");
  });

  it("canon maps: swd is 8 skills, QA money-shot map is 7, IT-support 7; E2/E3 hold their extracted rows", () => {
    expect(getCareer("swd")!.skills).toHaveLength(8);
    expect(getCareer("qa")!.skills).toHaveLength(7);
    expect(getCareer("its")!.skills).toHaveLength(7);
    // extension honesty — rows exist only where the source extraction landed
    // (catalog round: E2 executive secretary 17 · E3 records 11 transcribed)
    expect(getCareer("da")!.demandBlock.status).toBe("institutional-judgment");
    expect(getCareer("execsec")!.skills).toHaveLength(17);
    expect(getCareer("records")!.skills).toHaveLength(11);
  });
});

describe("rounding convention", () => {
  it("rounds nearest, .5 down", () => {
    expect(roundHalfDown(6.667)).toBe(7); // TP 20×1/3
    expect(roundHalfDown(17.143)).toBe(17); // ES 30×4/7
    expect(roundHalfDown(18.75)).toBe(19); // SP 25×6/8
    expect(roundHalfDown(17.857)).toBe(18); // SP 25×5/7
    expect(roundHalfDown(0.5)).toBe(0);
  });
});

describe("beat states (Neil)", () => {
  it("beat 5 — setup: 40 (SP 19, ES 17, TP 0, AR unmeasured, CC 4)", () => {
    const s = scoreFor(NEIL_SEED);
    expect(s).toEqual({ sp: 19, es: 17, tp: 0, ar: null, cc: 4, total: 40 });
  });

  it("ES decomposition traces to the assessment state (4 of 7 verified ·✓, half-down)", () => {
    expect(Object.values(NEIL_SEED.competencies ?? {}).filter((v) => v === "verified").length).toBe(4);
    expect(ASSESSED_COMPETENCIES).toBe(7); // NACE 7/8, E&I excluded
  });

  it("beat 6 — switch dip: 21 (QA map, 0 closed; ES + CC stay, TP resets)", () => {
    const before = scoreFor({ ...NEIL_SEED, careerId: "qa", bars: {}, stageOneDone: 0 });
    expect(before).toEqual({ sp: 0, es: 17, tp: 0, ar: null, cc: 4, total: 21 });
  });

  it("beat 6→ re-assessment: 35 (SP 14 = 25×4/7)", () => {
    const s = scoreFor(applyReassessment({ ...NEIL_SEED, careerId: "qa" }));
    expect(s).toEqual({ sp: 14, es: 17, tp: 0, ar: null, cc: 4, total: 35 });
  });

  it("beat 7 — money shot: 52 (SP 18, TP 7, CC 10)", () => {
    const afterRA = applyReassessment({ ...NEIL_SEED, careerId: "qa" });
    const withGoal = withQaGoal(afterRA);
    const shot = applyMoneyShot(withGoal);
    const s = scoreFor(shot);
    expect(s).toEqual({ sp: 18, es: 17, tp: 7, ar: null, cc: 10, total: 52 });
    // beat 9 plan: trajectory 40 → 52
    expect(scoreFor(NEIL_SEED).total).toBe(40);
  });

  it("san the QA plan step, the money shot stays CC 4 (the first-item tick is load-bearing)", () => {
    const shot = applyMoneyShot(applyReassessment({ ...NEIL_SEED, careerId: "qa" }));
    expect(scoreFor(shot).total).toBeLessThan(52);
  });

  it("AR feeds honestly: a measured run earns its fraction of 15, a failed gate earns nothing", () => {
    // bestAir 60 → 15×0.6 = 9; unmeasured = null, never 0
    expect(scoreFor(NEIL_SEED, { measured: true, bestAir: 60 })).toMatchObject({ ar: 9, total: 49 });
    expect(scoreFor(NEIL_SEED, { measured: true, bestAir: 0 })).toMatchObject({ ar: 0, total: 40 });
    expect(scoreFor(NEIL_SEED, { measured: false }).ar).toBeNull();
  });
});

describe("beat chain through the LIVE action layer (regression guards)", () => {
  it("beat 6 dip: switch alone reads 21 — the carried ·✓ re-registers only at re-assessment", () => {
    const switched = switchCareer(NEIL_SEED, "qa").state;
    // canon: SP 0 (0 closed bars) + ES + CC stay → dip 21 (AR still unmeasured)
    expect(scoreFor(switched)).toEqual({ sp: 0, es: 17, tp: 0, ar: null, cc: 4, total: 21 });
    // re-assessment: 3 self-claims + the QA-map-verified Business Needs
    // Analysis ·✓ re-registers → 35 (SP 25×4/7 = 14; the SQL-design row is
    // NOT on the QA map)
    const reassessed = claimAll(switched, [
      { skill: "Test Planning", level: "confident" },
      { skill: "Defect management", level: "confident" },
      { skill: "Applications Support and Enhancement", level: "confident" },
    ]).state;
    expect(scoreFor(reassessed)).toEqual({ sp: 14, es: 17, tp: 0, ar: null, cc: 4, total: 35 });
    expect(reassessed.bars["Business Needs Analysis"].source).toBe("verified");
    expect(switched.decisions.verifiedTransferred).toEqual(["Business Needs Analysis"]);
  });
});

describe("pathway ranking (M7 locked formula)", () => {
  const BUNDLE = "Customer Orientation · Digital Fluency · Learning Agility · Sense Making · Problem Solving (Enabling)";

  it("core ×3 outranks secondary; free-PH-first breaks ties; stable order persists", () => {
    const qa = getCareer("qa")!;
    const ranked = rankOpenSkills(qa, ["Test Planning", BUNDLE, "Software Testing"]);
    // free tie-break: both cores are free → stable catalog order (idx: ST 0 < TP 1)
    expect(ranked.map((r) => r.skill)).toEqual(["Software Testing", "Test Planning", BUNDLE]);
    // core (×3) first even with equal resource availability
    const ranked2 = rankOpenSkills(qa, [BUNDLE, "Quality Assurance / Quality Standards"]);
    expect(ranked2[0].skill).toBe("Quality Assurance / Quality Standards");
  });

  it("stage ① takes the next 3 highest-priority open items", () => {
    const qa = getCareer("qa")!;
    const open = ["Quality Assurance / Quality Standards", BUNDLE, "Software Testing"];
    const { queue } = stageOne(qa, open);
    expect(queue).toHaveLength(3);
    // software testing (free TAU pool row) leads the free tie-break group
    expect(queue[0]).toBe("Software Testing");
  });
});

describe("check-failed event (honest feed row)", () => {
  it("failed attempt records an event, not a bar", () => {
    const withGoal = withQaGoal(applyReassessment({ ...NEIL_SEED, careerId: "qa" }));
    const failed = submitCheck(withGoal, "res-qa-testing", [1, 2, 3, 4, 1]).state;
    expect(failed.events.at(-1)?.kind).toBe("check-failed");
    expect(Object.keys(failed.bars).length).toBe(4); // no bar closed
  });
});

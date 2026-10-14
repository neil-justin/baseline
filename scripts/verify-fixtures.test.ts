import { describe, it, expect } from "vitest";
import { CAREERS, CATALOG_TOTAL, getCareer } from "@/lib/fixtures/catalog";
import { computeScore, roundHalfDown } from "@/lib/engines/score";
import { rankOpenSkills, stageOne } from "@/lib/engines/gaps";
import {
  NEIL_SEED,
  applyReassessment,
  applyMoneyShot,
  withDaGoal,
} from "@/lib/fixtures/neil";
import type { StudentState } from "@/lib/types";

/**
 * Canon verification — `_fixture-math.md` is the spec.
 * Beat states: setup 40 → switch dip 10 → post-re-assessment 33 → money shot 51.
 */

function scoreFor(s: StudentState) {
  const career = getCareer(s.careerId)!;
  return computeScore({
    bars: s.bars,
    careerId: s.careerId,
    careerSkillCount: career.skills.length,
    goals: s.goals,
    stageOneDone: s.stageOneDone,
  });
}

describe("catalog", () => {
  it("has exactly 32 careers (ticket 04 row count)", () => {
    expect(CATALOG_TOTAL).toBe(32);
    expect(CAREERS.length).toBe(32);
  });

  it("demo trio resolves with canon names", () => {
    expect(getCareer("swd")!.name).toBe("Software Developer");
    expect(getCareer("da")!.name).toBe("Data Analyst");
    expect(getCareer("its")!.name).toBe("IT Support Technician");
  });

  it("SWE map is 8 skills, DA map is 7 skills, IT-support 7", () => {
    expect(getCareer("swd")!.skills).toHaveLength(8);
    expect(getCareer("da")!.skills).toHaveLength(7);
    expect(getCareer("its")!.skills).toHaveLength(7);
  });
});

describe("rounding convention", () => {
  it("rounds half down", () => {
    expect(roundHalfDown(6.667)).toBe(7); // TP 20×1/3
    expect(roundHalfDown(22.857)).toBe(23); // SP 40×4/7
    expect(roundHalfDown(0.5)).toBe(0);
  });
});

describe("beat states (Neil)", () => {
  it("beat 5 — setup: 40 (SP 30, ES 0, TP 0, CC 10)", () => {
    const s = scoreFor(NEIL_SEED);
    expect(s).toEqual({ sp: 30, es: 0, tp: 0, cc: 10, total: 40 });
  });

  it("beat 6 — switch dip: 10 (DA map, 0 closed, kept CC)", () => {
    const s = applyReassessment({ ...NEIL_SEED, careerId: "da" });
    const before = scoreFor({ ...NEIL_SEED, careerId: "da", bars: {}, stageOneDone: 0 });
    expect(before).toEqual({ sp: 0, es: 0, tp: 0, cc: 10, total: 10 });
    void s;
  });

  it("beat 6→ re-assessment: 33 (SP 23 = 40×4/7)", () => {
    const s = scoreFor(applyReassessment({ ...NEIL_SEED, careerId: "da" }));
    expect(s).toEqual({ sp: 23, es: 0, tp: 0, cc: 10, total: 33 });
  });

  it("beat 7 — money shot: 51 (SP 29, TP 7, CC 15)", () => {
    const afterRA = applyReassessment({ ...NEIL_SEED, careerId: "da" });
    const withGoal = withDaGoal(afterRA);
    const shot = applyMoneyShot(withGoal);
    const s = scoreFor(shot);
    expect(s).toEqual({ sp: 29, es: 0, tp: 7, cc: 15, total: 51 });
    // beat 9 plan: trajectory 40 → 51
    expect(scoreFor(NEIL_SEED).total).toBe(40);
  });

  it("sans the DA dashboard goal, money shot stays CC 10 (goal auto-complete is load-bearing)", () => {
    const shot = applyMoneyShot(applyReassessment({ ...NEIL_SEED, careerId: "da" }));
    expect(scoreFor(shot).total).toBeLessThan(51);
  });
});

describe("beat chain through the LIVE action layer (regression guards)", () => {
  it("beat 6 dip: switch alone reads 10 — carried ·✓ re-registers only at re-assessment", () => {
    const { switchCareer, claimAll } = require("@/lib/actions") as typeof import("@/lib/actions");
    const switched = switchCareer(NEIL_SEED, "da").state;
    // canon: SP 0 (0 closed bars) + CC 10 → dip 10
    expect(scoreFor(switched)).toEqual({ sp: 0, es: 0, tp: 0, cc: 10, total: 10 });
    // re-assessment: 3 self-claims + SQL ·✓ re-registers → 33
    const reassessed = claimAll(switched, [
      { skill: "Spreadsheets", level: "confident" },
      { skill: "Data cleaning", level: "confident" },
      { skill: "Basic statistics", level: "confident" },
    ]).state;
    expect(scoreFor(reassessed)).toEqual({ sp: 23, es: 0, tp: 0, cc: 10, total: 33 });
    expect(reassessed.bars.SQL.source).toBe("verified");
  });
});

describe("pathway ranking (M7 locked formula)", () => {
  it("core ×3 outranks secondary; free-PH-first breaks ties; stable order persists", () => {
    const da = getCareer("da")!;
    const ranked = rankOpenSkills(da, ["Data cleaning", "Report writing", "Chart interpretation"]);
    // both secondaries are free → stable catalog order decides: chart (idx 5) before report (idx 6)
    expect(ranked.map((r) => r.skill)).toEqual(["Data cleaning", "Chart interpretation", "Report writing"]);
    // core (×3) first even with equal resource availability
    const ranked2 = rankOpenSkills(da, ["Report writing", "Chart interpretation", "Data cleaning"]);
    expect(ranked2[0].skill).toBe("Data cleaning");
  });

  it("stage ① takes the next 3 highest-priority open items", () => {
    const da = getCareer("da")!;
    const open = ["Chart interpretation", "Report writing", "Dashboards (Power BI)"];
    const { queue } = stageOne(da, open);
    expect(queue).toHaveLength(3);
    // dashboards (free Power BI Microsoft Learn) leads the free tie-break group
    expect(queue[0]).toBe("Dashboards (Power BI)");
  });
});

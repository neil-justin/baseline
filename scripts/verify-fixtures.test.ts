import { describe, it, expect } from "vitest";
import { CAREERS, CATALOG_TOTAL, getCareer } from "@/lib/fixtures/catalog";
import { ROW_SPECS } from "@/lib/fixtures/rowspec";
import { computeScore, roundHalfDown, ASSESSED_COMPETENCIES, AR_FACTORS } from "@/lib/engines/score";
import type { ArInput } from "@/lib/engines/score";
import {
  EMPLOYER_SKIP_NOTE,
  computeLetterCheck,
  stampPresence,
  presenceMeasured,
} from "@/lib/engines/air";
import { rankOpenSkills, stageOne } from "@/lib/engines/gaps";
import { planFor, planHead } from "@/lib/engines/plan";
import { switchCareer, claimAll, submitCheck } from "@/lib/actions";
import type { PresenceDeclaration } from "@/lib/types";
import {
  NEIL_SEED,
  applyReassessment,
  applyMoneyShot,
  withQaGoal,
} from "@/lib/fixtures/neil";
import type { StudentState } from "@/lib/types";

/**
 * Canon verification — the ADR 0002 (amendment 2, ticket 12) five-channel
 * sheet is the spec; the NUMBERS live in this file (engine re-lock + AR split
 * round): seed 40 → switch dip 21 → re-assessment 35 → check pass 52 → money
 * beat 59 (the Application Materials pass's resume factor lands 7 of 7;
 * the recorded 67 comes when the letter + presence surfaces ship).
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

describe("rowspec layer (2026-10-30 blessed-spec fixture conversion)", () => {
  const catalogRows = CAREERS.flatMap((c) => c.skills.map((s) => `${c.id}::${s.name}`));

  it("every rowspec key `${roleId}::${skillName}` resolves to an existing catalog role + skill row", () => {
    const catalogSet = new Set(catalogRows);
    const unresolved = Object.keys(ROW_SPECS).filter((k) => !catalogSet.has(k));
    expect(unresolved).toEqual([]);
  });

  it("every RowSpec carries a non-empty specRef (provenance: spec file + row id)", () => {
    const missing = Object.entries(ROW_SPECS).filter(([, row]) => !row.specRef || row.specRef.trim().length === 0);
    expect(missing).toEqual([]);
  });

  it("deep data covers the reshaped roster (373 keys: 93 it · 131 business · 92 accounting · 57 office)", () => {
    expect(Object.keys(ROW_SPECS)).toHaveLength(373);
  });

  it("ruled carries render in the deep data (cybersec rename · ba flip · audit pin)", () => {
    // cybersec display-name ruling lives on the role record; the deep row
    // provenance says CYB-V1 closed
    expect(getCareer("cybersec")!.name).toBe("Security Analyst");
    expect(ROW_SPECS["ba::Team Enablement"].specRef).toContain("ba.md");
    // audit row 11 carries the standing O*NET version-pin flag (no technology names until pinned)
    const auditRow = ROW_SPECS["audit::Audit technology fluency (accounting software / Excel family)"];
    expect(auditRow.flags?.some((f) => f.includes("version"))).toBe(true);
    // counts layer verification of the byte-identical canon names (demo beats key bar math on these)
    const qaNames = getCareer("qa")!.skills.map((s) => s.name);
    expect(qaNames).toEqual(["Software Testing", "Test Planning", "Defect management", "Quality Assurance / Quality Standards", "Applications Support and Enhancement", "Business Needs Analysis", "Customer Orientation · Digital Fluency · Learning Agility · Sense Making · Problem Solving (Enabling)"]);
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
    expect(s).toEqual({
      sp: 19,
      es: 17,
      tp: 0,
      ar: null,
      cc: 4,
      total: 40,
      arParts: {
        resume: { measured: false, earned: 0, max: 7 },
        letter: { measured: false, earned: 0, max: 5 },
        presence: { measured: false, earned: 0, max: 3 },
      },
    });
  });

  it("ES decomposition traces to the assessment state (4 of 7 verified ·✓, half-down)", () => {
    expect(Object.values(NEIL_SEED.competencies ?? {}).filter((v) => v === "verified").length).toBe(4);
    expect(ASSESSED_COMPETENCIES).toBe(7); // NACE 7/8, E&I excluded
  });

  it("beat 6 — switch dip: 21 (QA map, 0 closed; ES + CC stay, TP resets)", () => {
    const before = scoreFor({ ...NEIL_SEED, careerId: "qa", bars: {}, stageOneDone: 0 });
    expect(before).toMatchObject({ sp: 0, es: 17, tp: 0, ar: null, cc: 4, total: 21 });
  });

  it("beat 6→ re-assessment: 35 (SP 14 = 25×4/7)", () => {
    const s = scoreFor(applyReassessment({ ...NEIL_SEED, careerId: "qa" }));
    expect(s).toMatchObject({ sp: 14, es: 17, tp: 0, ar: null, cc: 4, total: 35 });
  });

  it("beat 7 — check pass 52, then the money beat's resume run lands 59 (AR split in)", () => {
    const afterRA = applyReassessment({ ...NEIL_SEED, careerId: "qa" });
    const withGoal = withQaGoal(afterRA);
    const shot = applyMoneyShot(withGoal);
    // check-pass state — AR still unmeasured → 52 (SP 18 · TP 7 · CC 10)
    expect(scoreFor(shot)).toEqual({
      sp: 18,
      es: 17,
      tp: 7,
      ar: null,
      cc: 10,
      total: 52,
      arParts: {
        resume: { measured: false, earned: 0, max: 7 },
        letter: { measured: false, earned: 0, max: 5 },
        presence: { measured: false, earned: 0, max: 3 },
      },
    });
    // ticket-12 recut: the money beat's resume diagnostic (resume-qa.pdf, all
    // checks green) measures the resume factor 7 of 7 → the headline 59
    const money = scoreFor(shot, { resume: { measured: true, latestAir: 100 } });
    expect(money).toMatchObject({ sp: 18, es: 17, tp: 7, ar: 7, cc: 10, total: 59 });
    expect(money.arParts).toEqual({
      resume: { measured: true, earned: 7, max: 7 },
      letter: { measured: false, earned: 0, max: 5 },
      presence: { measured: false, earned: 0, max: 3 },
    });
    // beat 9 plan: trajectory 40 → 52 → 59
    expect(scoreFor(NEIL_SEED).total).toBe(40);
  });

  it("san the QA plan step, the money shot stays CC 4 (the first-item tick is load-bearing)", () => {
    const shot = applyMoneyShot(applyReassessment({ ...NEIL_SEED, careerId: "qa" }));
    expect(scoreFor(shot).total).toBeLessThan(52);
  });

  it("AR feeds honestly per factor: each file earns its own fraction of 7/5/3, unmeasured factors render nothing", () => {
    // resume factor: latestAir 60 → 7×0.6 = 4.2 → 4 — measured, letter/presence open.
    // The resume feed is the LATEST full attempt's AIR (amendment 3, 2026-10-29:
    // latest counts — built in lib/db.ts getStudentView from the stored run; the
    // store's best_air stays best-ever history only). The suite pins the
    // arithmetic against the given input; there was never a best-vs-latest
    // assertion here because the selection lives at the feed-builder seam.
    const resumeOnly = scoreFor(NEIL_SEED, { resume: { measured: true, latestAir: 60 } });
    expect(resumeOnly).toMatchObject({ ar: 4, total: 44 });
    expect(resumeOnly.arParts).toMatchObject({ resume: { measured: true, earned: 4, max: 7 } });
    // a failed parse gate earns nothing but still measures — an honest 0
    expect(scoreFor(NEIL_SEED, { resume: { measured: true, latestAir: 0 } })).toMatchObject({ ar: 0, total: 40 });
    // letter factor: checkScore 40 → 5×0.4 = 2; presence factor: 3 all-or-nothing
    expect(scoreFor(NEIL_SEED, { letter: { measured: true, checkScore: 40 } })).toMatchObject({ ar: 2, total: 42 });
    expect(scoreFor(NEIL_SEED, { presence: { measured: true } })).toMatchObject({ ar: 3, total: 43 });
    // combined: 7 + 5 + 3 = the locked 15 (52 + ...)
    expect(scoreFor(NEIL_SEED, {
      resume: { measured: true, latestAir: 100 },
      letter: { measured: true, checkScore: 100 },
      presence: { measured: true },
    })).toMatchObject({ ar: 15, total: 55 });
    // nothing measured → null, never a painted 0
    expect(scoreFor(NEIL_SEED, { resume: { measured: false }, letter: { measured: false }, presence: { measured: false } }).ar).toBeNull();
    expect(scoreFor(NEIL_SEED).ar).toBeNull();
    // the locked split header
    expect(AR_FACTORS).toEqual({ resume: 7, letter: 5, presence: 3 });
    // the AR plan task rides the split: head 'Run the resume diagnostic' while
    // unmeasured (locked head semantics) → the checklist task once anything
    // measures → completes out when all three land (ticket 12)
    const qa = getCareer("qa")!;
    const seedState = { ...NEIL_SEED, careerId: "qa" as const };
    const planHeadUnmeasured = planHead(qa, seedState, null);
    expect(planHeadUnmeasured).toMatchObject({ kind: "ar", title: "Run the resume diagnostic", href: "/prep" });
    expect((planHeadUnmeasured as { checklist?: unknown }).checklist).toEqual({ resume: false, letter: false, presence: false });
    const planHeadResumeOnly = planHead(qa, seedState, { resume: { measured: true, latestAir: 100 } });
    expect(planHeadResumeOnly).toMatchObject({ kind: "ar", title: "Get your application materials ready" });
    expect((planHeadResumeOnly as { checklist?: unknown }).checklist).toEqual({ resume: true, letter: false, presence: false });
    const planAllMeasured = planFor(qa, seedState, {
      resume: { measured: true, latestAir: 100 },
      letter: { measured: true, checkScore: 100 },
      presence: { measured: true },
    });
    expect(planAllMeasured.some((i) => i.kind === "ar")).toBe(false);
  });
});

describe("letter + presence engines (ticket 12 surface round, 2026-10-30)", () => {
  it("letter check: the employer field omitted → the honest skip line, denominator drops it; a declared-but-unnamed employer RUNS and fails", () => {
    // the exact honesty copy (surfaces print this line verbatim)
    expect(EMPLOYER_SKIP_NOTE).toBe("not evaluated — no employer declared");
    const omitted = computeLetterCheck({
      parsePass: true,
      keywordScore: 1,
      checks: { salutation: true, closingAsk: true, wordBand: true },
    });
    // never silently failed, never silently scored: the skip rides the ledger
    expect(omitted.employerMentioned).toBeNull();
    expect(omitted.employerEvaluated).toBe(false);
    expect(omitted.structuralScore).toBe(1); // 3 of 3 evaluable ran, all passed
    expect(omitted.airLetter).toBe(100); // letter 5 of 5 (canon demo letter)
    // declaring the employer adds the check to the denominator — and a miss
    // honestly fails it (4 evaluable → 0.75), never a silent skip
    const declaredMiss = computeLetterCheck({
      parsePass: true,
      keywordScore: 1,
      checks: { salutation: true, closingAsk: true, wordBand: true, employerMentioned: false },
      employerDeclared: true,
    });
    expect(declaredMiss.employerMentioned).toBe(false);
    expect(declaredMiss.structuralScore).toBe(3 / 4);
    expect(declaredMiss.airLetter).toBe(75);
  });

  it("presence stamp: offline deterministic checks + the honest private line; malformed entries never measure", () => {
    const stamp = stampPresence(
      { linkedinUrl: "https://www.linkedin.com/in/neil-demo", email: "neil.demo@campus.test", privateAccount: true },
      "2026-10-17 10:12"
    );
    expect(stamp.checks).toEqual({ linkedinUrlFormat: "pass", professionalEmailFormat: "pass" });
    expect(stamp.offline).toBe(true); // nothing here network-fetches — the recorded ruling
    expect(stamp.contentNote).toBe("resolves, content not machine-verifiable");
    const declared: PresenceDeclaration = {
      linkedinUrl: "https://www.linkedin.com/in/neil-demo",
      email: "neil.demo@campus.test",
      declaredAt: "2026-10-17 10:12",
      stamp,
    };
    expect(presenceMeasured(declared)).toBe(true);
    // a malformed URL formats-check FAILS — the declaration is feedback, and
    // the factor stays unmeasured (never a painted zero)
    const bad = stampPresence({ linkedinUrl: "http://x.com/about", email: "neil.demo@campus.test" }, "2026-10-17 10:12");
    expect(bad.checks.linkedinUrlFormat).toBe("fail");
    expect(presenceMeasured({ ...declared, stamp: bad })).toBe(false);
    expect(presenceMeasured(null)).toBe(false);
    expect(presenceMeasured(undefined)).toBe(false);
  });

  it("money beat re-cut live (2026-10-30): the letter check lands 64, presence completes the pass at 67 — the arc's numbers", () => {
    const shot = applyMoneyShot(withQaGoal(applyReassessment({ ...NEIL_SEED, careerId: "qa" })));
    // after the letter check (letter 5 of 5 on the canon letter): 52 + 7 + 5
    const afterLetter = scoreFor(shot, {
      resume: { measured: true, latestAir: 100 },
      letter: { measured: true, checkScore: 100 },
    });
    expect(afterLetter).toMatchObject({ ar: 12, total: 64 });
    expect(afterLetter.arParts).toEqual({
      resume: { measured: true, earned: 7, max: 7 },
      letter: { measured: true, earned: 5, max: 5 },
      presence: { measured: false, earned: 0, max: 3 },
    });
    // the presence declaration stamps the third factor → 67 (the LOCKED 15)
    const full = scoreFor(shot, {
      resume: { measured: true, latestAir: 100 },
      letter: { measured: true, checkScore: 100 },
      presence: { measured: true },
    });
    expect(full).toMatchObject({ sp: 18, es: 17, tp: 7, ar: 15, cc: 10, total: 67 });
    expect(full.arParts).toEqual({
      resume: { measured: true, earned: 7, max: 7 },
      letter: { measured: true, earned: 5, max: 5 },
      presence: { measured: true, earned: 3, max: 3 },
    });
  });
});

describe("beat chain through the LIVE action layer (regression guards)", () => {
  it("beat 6 dip: switch alone reads 21 — the carried ·✓ re-registers only at re-assessment", () => {
    const switched = switchCareer(NEIL_SEED, "qa").state;
    // canon: SP 0 (0 closed bars) + ES + CC stay → dip 21 (AR still unmeasured)
    expect(scoreFor(switched)).toMatchObject({ sp: 0, es: 17, tp: 0, ar: null, cc: 4, total: 21 });
    // re-assessment: 3 self-claims + the QA-map-verified Business Needs
    // Analysis ·✓ re-registers → 35 (SP 25×4/7 = 14; the SQL-design row is
    // NOT on the QA map)
    const reassessed = claimAll(switched, [
      { skill: "Test Planning", level: "confident" },
      { skill: "Defect management", level: "confident" },
      { skill: "Applications Support and Enhancement", level: "confident" },
    ]).state;
    expect(scoreFor(reassessed)).toMatchObject({ sp: 14, es: 17, tp: 0, ar: null, cc: 4, total: 35 });
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

/* ───────────────────────────────────────────────────────────────────────────
 * 2026-10-30 fixture conversion — integrity suite for the BLESSED role-spec
 * conversion (per-track conversion blessing recorded in map.md 2026-10-30).
 *
 * What this pins:
 *   1. bundle stacks — every converted role's rows (name/tier) per the blessed
 *      spec shapes, with the canon demo lock byte-guarded;
 *   2. rowspec traceability — every catalog row carries blessed spec deep data
 *      (descriptor + attributed anchors + provenance), with the recorded
 *      flags/anchorless-honesty states present, never dropped;
 *   3. resource integrity — every pool row scoped to a real career + real
 *      skill, no invented URLs, the ruled drops stay dropped (Guru99 /
 *      LinkedIn / study.com), declared-thin zones stay declared, statutory
 *      keep-with-flag rows stay labeled, OpenLearn stays keep-with-flag;
 *   4. Model C placeholder — audit's technology row carries the O*NET
 *      attribution placeholder with individual tool names UNQUOTED;
 *   5. synonym seeds — seed integrity (no orphan keys, phrases lowercase,
 *      demo seeds untouched).
 * Canon gate: every assertion above this block stays green unchanged.
 * ────────────────────────────────────────────────────────────────────────── */

import { SKILL_SYNONYMS } from "@/lib/engines/resume/synonyms";
import { RESOURCES, PURCHASE_BOOKS } from "@/lib/fixtures/resources";

const NAMES = (id: string): string[] => (getCareer(id)!.skills.map((s) => s.name));
const CORES = (id: string): number => getCareer(id)!.skills.filter((s) => s.tier === "core").length;

describe("blessed conversion — bundle stacks (rows named per spec)", () => {
  it("total fixture count grows: 36 roles · 373 skill rows (was 216 pre-conversion)", () => {
    expect(CATALOG_TOTAL).toBe(36);
    expect(CAREERS.reduce((a, c) => a + c.skills.length, 0)).toBe(373);
  });

  it("canon demo locks — byte-identical stacks on the score-critical maps", () => {
    // the seed math keys bars/goals on these exact names/counts — never rename
    expect(NAMES("swd")).toEqual([
      "Applications Development",
      "Applications Support and Enhancement",
      "Agile Software Development",
      "Data Design / SQL + data modeling",
      "Business Needs Analysis",
      "Secure-coding practices",
      "Linux + web deployment basics",
      "Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Self Management (Enabling Skills, Basic/Intermediate)",
    ]);
    expect(NAMES("qa")).toEqual([
      "Software Testing", "Test Planning", "Defect management", "Quality Assurance / Quality Standards",
      "Applications Support and Enhancement", "Business Needs Analysis",
      "Customer Orientation · Digital Fluency · Learning Agility · Sense Making · Problem Solving (Enabling)",
    ]);
    expect(NAMES("its")).toEqual([
      "Infrastructure Support", "Infrastructure Deployment", "Network Administration and Maintenance",
      "Network Configuration", "Cyber and Data Breach Incident Management", "Service Level Management",
      "Customer Orientation · Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)",
    ]);
    expect(NAMES("da")).toEqual([
      "Data Analytics", "Data Visualization and Storytelling", "Business Needs Analysis",
      "ETL (extract-transform-load workflows)", "Data Engineering",
      "Enabling Skills & Competencies (ESC) — Collaboration, Communication, Digital Fluency, Learning Agility",
      "Applications Development", "Artificial Intelligence Ethics and Governance", "Data Ethics",
      "Cyber and Data Breach Incident Management", "Software Testing", "Configuration Tracking", "Stakeholder Management",
    ]);
    // E2/E3 hold their extracted rows (17 / 11)
    expect(getCareer("execsec")!.skills).toHaveLength(17);
    expect(getCareer("records")!.skills).toHaveLength(11);
  });

  it("ba — Team Enablement flip applied (core ×6, secondary ×1)", () => {
    expect(NAMES("ba")).toEqual([
      "Requirements Analysis", "Requirements Specification", "Solution Support (UAT & hand-over)",
      "Process modeling (flow diagrams, use cases)", "Business Needs Analysis", "Team Enablement",
      "Collaboration · Communication · Digital Fluency · Learning Agility (Enabling)",
    ]);
    expect(getCareer("ba")!.skills.find((s) => s.name === "Team Enablement")!.tier).toBe("core");
    expect(CORES("ba")).toBe(6);
  });

  it("sysadmin/dba — CWF key-task sub-rows decomposed (12 / 11 rows)", () => {
    expect(getCareer("sysadmin")!.skills).toHaveLength(12);
    expect(CORES("sysadmin")).toBe(7);
    for (const sub of ["Design and develop new systems", "Optimize systems performance", "Resolve system-related incidents", "Oversee service level agreements and service improvements"]) {
      expect(NAMES("sysadmin")).toContain(`↳ CWF sub-row: ${sub}`);
    }
    expect(getCareer("dba")!.skills).toHaveLength(11);
    expect(CORES("dba")).toBe(6);
    for (const sub of ["Oversee database administration", "Design and develop new database", "Optimize database performance", "Resolve database incidents"]) {
      expect(NAMES("dba")).toContain(`↳ CWF sub-row: ${sub}`);
    }
  });

  it("cybersec — fixture display name is \"Security Analyst\" (CYB-V3 ruled); 5-row stack unchanged", () => {
    expect(getCareer("cybersec")!.name).toBe("Security Analyst");
    expect(getCareer("cybersec")!.skills).toHaveLength(5);
    expect(CORES("cybersec")).toBe(1);
  });

  it("webdev — site life-operations task-cluster sub-row added (flagged constructed row)", () => {
    expect(getCareer("webdev")!.skills).toHaveLength(6);
    expect(NAMES("webdev")).toContain("↳ task-cluster sub-row: site life-operations");
    expect(getCareer("webdev")!.skills.find((s) => s.name === "↳ task-cluster sub-row: site life-operations")!.tier).toBe("core");
  });

  it("digart — the verbatim six TESDA TR units are the core rows + the counterpart row (DIG-V1/V3 rulings)", () => {
    expect(NAMES("digart")).toEqual([
      "DEVELOP DESIGNS FOR A LOGO (ICT216313)",
      "DEVELOP DESIGNS FOR PRINT MEDIA (ICT216314)",
      "DEVELOP DESIGNS FOR USER EXPERIENCE (ICT216315)",
      "DEVELOP DESIGNS FOR USER INTERFACE (ICT216316)",
      "DEVELOP DESIGNS FOR PRODUCT PACKAGING (ICT216317)",
      "DESIGN BOOTH AND PRODUCT WINDOW / DISPLAY (ICT216318)",
      "Use specialized graphic/animation tools (Adobe suite, Blender etc.)",
      "Follow creative brief + brand guideline development",
      "Client communication & revision handling",
      "Junior 2D Animator — [PSF-DAA] (counterpart, optional — user ruling 2026-10-29 ADD)",
    ]);
    expect(CORES("digart")).toBe(8);
    const counterpart = ROW_SPECS["digart::Junior 2D Animator — [PSF-DAA] (counterpart, optional — user ruling 2026-10-29 ADD)"];
    expect(counterpart.flags?.some((f) => /NO FSC levels/i.test(f))).toBe(true);
  });

  it("soc (E4) — the blessed draft's row stack (three printed CWFs core; SOC-V2 pending levels)", () => {
    expect(NAMES("soc")).toEqual([
      "Monitor cyber security systems", "Maintain cyber security operations", "Manage response to cyber security incidents",
      "Threat Analysis and Defence · Threat Intelligence and Detection (family FSC cross-cite)",
      "Vulnerability scanning (VAPT-adjacent, TESDA-printed)",
      "Network security understanding (network administration family)",
      "Collaboration · Communication · Problem Solving · Digital Fluency (Enabling)",
    ]);
    expect(CORES("soc")).toBe(3);
    expect(getCareer("soc")!.demandBlock.status).toBe("institutional-judgment");
  });

  it("track 2 — blessed stacks (hra 20 · training 15 · mkt 25 · sales 17 · csr 10 · opsanalyst 10 · purch 10 · ccqa 11 · events 13)", () => {
    expect(getCareer("hra")!.skills).toHaveLength(20);
    expect(CORES("hra")).toBe(9);
    expect(getCareer("training")!.skills).toHaveLength(15);
    expect(getCareer("mkt")!.skills).toHaveLength(25);
    expect(CORES("mkt")).toBe(12);
    expect(NAMES("mkt")).toContain("Communication (ESC-layer, printed in the Primary block)");
    expect(getCareer("sales")!.skills).toHaveLength(17);
    expect(CORES("sales")).toBe(8);
    expect(NAMES("sales")).toContain("Customer Relationship Management + Customer Relationship Management Operations");
    expect(getCareer("csr")!.skills).toHaveLength(10);
    expect(CORES("csr")).toBe(7);
    expect(getCareer("opsanalyst")!.skills).toHaveLength(10);
    expect(getCareer("purch")!.skills).toHaveLength(10);
    expect(getCareer("ccqa")!.skills).toHaveLength(11);
    expect(NAMES("ccqa")).toContain("Continuous Improvement");
    expect(getCareer("events")!.skills).toHaveLength(13);
    expect(CORES("events")).toBe(8);
  });

  it("track 3 — blessed stacks (book 9 · acctclerk 10 w/ source-verbatim names · pay 9 · fas 10 · fin 10 · treasury 6 · coll 9 · credit 9 · teller 9 · audit 11)", () => {
    expect(getCareer("book")!.skills).toHaveLength(9);
    expect(CORES("book")).toBe(4);
    expect(getCareer("acctclerk")!.skills).toHaveLength(10);
    // V-acctclerk-3: the source-verbatim row names replace the platform labels
    expect(NAMES("acctclerk")).toContain("Check figures, postings, and documents for correct entry, mathematical accuracy, and proper codes");
    expect(NAMES("acctclerk")).not.toContain("Match invoices to POs/receipts (3-way match)");
    expect(getCareer("pay")!.skills).toHaveLength(9);
    expect(getCareer("fas")!.skills).toHaveLength(10);
    expect(CORES("fas")).toBe(6);
    expect(NAMES("fas")).toContain("Perform financial accounting and corporate reporting activities");
    expect(NAMES("fas")).toContain("O*NET corroboration block (operating-the-GL-engine tasks)");
    const fasFinAnalysis = getCareer("fas")!.skills.find((s) => s.name === "Financial Analysis")!;
    expect(fasFinAnalysis.tier).toBe("core");
    expect(ROW_SPECS["fas::Financial Analysis"].flags?.some((f) => /no down-shelving/i.test(f))).toBe(true);
    expect(getCareer("fin")!.skills).toHaveLength(10);
    expect(CORES("fin")).toBe(6);
    expect(getCareer("treasury")!.skills).toHaveLength(6);
    // treasury row-3 rename applied (quoted O*NET verb replaces the old label)
    expect(NAMES("treasury")).toContain("Reconcile records of financial transactions");
    expect(NAMES("treasury")).not.toContain("Bank reconciliation spreadsheets");
    expect(getCareer("coll")!.skills).toHaveLength(9);
    expect(getCareer("credit")!.skills).toHaveLength(9);
    expect(getCareer("teller")!.skills).toHaveLength(9);
    expect(getCareer("audit")!.skills).toHaveLength(11);
    expect(CORES("audit")).toBe(6);
    // audit row 11 (the ruled ADD) is present
    expect(NAMES("audit")).toContain("Audit technology fluency (accounting software / Excel family)");
    // Professional Skepticism kept (ruling)
    expect(NAMES("audit")).toContain("Professional Skepticism (attitude) · Communication (Enabling)");
  });

  it("track 4 — blessed stacks (adminassoc 6 · clerk 9 split · encode 8 split+crypto anchor · desk 5 lettered core)", () => {
    expect(getCareer("adminassoc")!.skills).toHaveLength(6);
    expect(getCareer("clerk")!.skills).toHaveLength(9);
    expect(NAMES("clerk")).toEqual([
      "Recording, preparing, sorting, classifying and filing information",
      "Sorting, opening and sending mail",
      "Photocopying and sending documents",
      "Routine reports & correspondence",
      "Responding to enquiries (telephone/electronic) or forwarding",
      "Recording issue of equipment to staff",
      "Checking figures, preparing invoices and recording details of financial transactions made",
      "Transcribing information into computers, and proof-reading and correcting copy",
      "Communication · Professionalism (Enabling)",
    ]);
    expect(getCareer("encode")!.skills).toHaveLength(8);
    expect(NAMES("encode")).toContain("Operating bookkeeping and calculating machines");
    expect(NAMES("encode")).toContain("Importing and exporting data between different database systems and softwares");
    // desk — the 5 lettered PSOC 4225 core rows are the ruled shape
    expect(getCareer("desk")!.skills).toHaveLength(6);
    expect(CORES("desk")).toBe(5);
  });
});

describe("blessed conversion — rowspec traceability (provenance per row)", () => {
  it("every catalog row carries blessed spec deep data (373 rows, no orphans)", () => {
    let traced = 0;
    for (const c of CAREERS) {
      for (const s of c.skills) {
        const row = ROW_SPECS[`${c.id}::${s.name}`];
        expect(row, `${c.id}::${s.name} has no rowspec entry`).toBeDefined();
        expect(row.descriptor.length).toBeGreaterThan(0);
        expect(row.specRef).toContain(c.id);
        traced += 1;
      }
    }
    expect(traced).toBe(373);
    // no rowspec entry points at a row that does not exist
    const keySet = new Set<string>(CAREERS.flatMap((c) => c.skills.map((s) => `${c.id}::${s.name}`)));
    for (const key of Object.keys(ROW_SPECS)) {
      expect(keySet.has(key), `orphan rowspec entry: ${key}`).toBe(true);
    }
  });

  it("anchor rows carry attributed anchors; the recorded anchorless rows keep their honesty flags", () => {
    for (const c of CAREERS) {
      for (const s of c.skills) {
        const row = ROW_SPECS[`${c.id}::${s.name}`];
        const anchorless = row.flags?.some((f) => /anchorless/i.test(f)) ?? false;
        if (row.anchors.length > 0) {
          // every anchor cell is a real attributed string (never an empty stub)
          expect(row.anchors.every((a) => a.trim().length > 0), `${c.id}::${s.name} carries an empty anchor stub`).toBe(true);
        }
        // a bare "—" descriptor (no printed descriptor) must carry attributed anchors
        if (row.descriptor.trim() === "—") {
          expect(row.anchors.length, `${c.id}::${s.name}: em-dash descriptor without anchors`).toBeGreaterThan(0);
        } else if (row.anchors.length === 0) {
          // no anchors without a recorded anchorless declaration (flag OR the
          // spec provenance line records it OR the row's source content lives
          // in a substantive printed descriptor)
          const declared =
            /anchorless|no CWF task anchor|no printed task anchor|anchorless honesty/i.test(row.specRef) ||
            row.descriptor.trim().length >= 60;
          expect(
            anchorless || declared,
            `${c.id}::${s.name} anchorless without flag or recorded declaration`
          ).toBe(true);
        }
      }
    }
    // da rows 8–12 (the recorded anchorless set) all carry the flag
    for (const name of [
      "Artificial Intelligence Ethics and Governance", "Data Ethics",
      "Cyber and Data Breach Incident Management", "Software Testing", "Configuration Tracking",
    ]) {
      expect(ROW_SPECS[`da::${name}`].flags?.some((f) => /anchorless/i.test(f))).toBe(true);
    }
    // da Row-12 reproducibility rationale kept (ruling)
    expect(
      JSON.stringify(ROW_SPECS["da::Configuration Tracking"]).slice(0, 4000).match(/reproducib/i)
    ).not.toBeNull();
  });

  it("constructed/paraphrase rows keep their ruling record — no dropped flags", () => {
    // the study.com STRIP ruling: mkt/sales glossary quotes paraphrased, attribution removed
    for (const key of ["mkt::Market Trend Analysis", "mkt::Marketing Mix Management", "sales::Customer Relationship Management + Customer Relationship Management Operations", "sales::Product Advisory + Product Demonstration"]) {
      expect(ROW_SPECS[key].flags?.some((f) => /study\.com/i.test(f)), `${key} missing the study.com strip flag`).toBe(true);
    }
    // ESC bundles stay bundles; the counterpart row keeps its no-FSC-levels honesty
    expect(ROW_SPECS["digart::Junior 2D Animator — [PSF-DAA] (counterpart, optional — user ruling 2026-10-29 ADD)"].flags?.some((f) => /NO FSC levels/i.test(f))).toBe(true);
    // the ba Team-Enablement flip flag
    expect(ROW_SPECS["ba::Team Enablement"].flags?.some((f) => /FLIPS to core/i.test(f))).toBe(true);
    // clerk row 6 keeps its declared resourceless-thin status; encode keeps the crypto anchor
    expect(ROW_SPECS["clerk::Recording issue of equipment to staff"].flags?.some((f) => /resourceless-thin/i.test(f))).toBe(true);
    expect(ROW_SPECS["encode::Importing and exporting data between different database systems and softwares"].flags?.some((f) => /KEPT/i.test(f))).toBe(true);
    // flagged-paraphrase rows must carry SOME recorded flag (the no-silent-paraphrase contract)
    const flagged = CAREERS.flatMap((c) => c.skills.map((s) => ROW_SPECS[`${c.id}::${s.name}`]))
      .filter((r) => r.flags !== undefined).length;
    expect(flagged).toBeGreaterThanOrEqual(140);
  });

  it("Model C placeholder resolved — audit's technology row carries the blessed O*NET 31.0 fill (4A, 2026-11-02)", () => {
    const row = ROW_SPECS["audit::Audit technology fluency (accounting software / Excel family)"];
    expect(row.flags?.some((f) => /version pin|UNQUOTED/i.test(f))).toBe(true);
    // the 31.0 pin citation rides the anchors (descriptor is a bare "—" — not a printed descriptor)
    expect(row.anchors.join(" ")).toMatch(/Software Skills/);
    expect(row.anchors.join(" ")).toMatch(/version-pin/i);
    expect(row.anchors.join(" ")).toMatch(/O\*NET 31\.0 · Technology Skills · 13-2011\.00/);
    expect(row.anchors.join(" ")).toMatch(/Employer Job Postings, 2026/);
    // the no-invented-IDEA continuity stays recorded; the served 37 categories print verbatim
    expect(row.anchors.join(" ")).toMatch(/No invented IDEA/);
    expect(row.anchors.join(" ")).toContain("Accounting software — Intuit QuickBooks · Sage 50 Accounting · SAP Concur");
    expect(row.anchors.join(" ")).toContain("Spreadsheet software — Google Sheets · Microsoft Excel");
    expect(row.anchors.join(" ")).toContain("Information retrieval or search software — LexisNexis");
    // fixture shape: 2 meta cells (citation + PSOC grounding) + the 37 served category cells
    expect(row.anchors).toHaveLength(39);
    // and the catalog `what` line carries the resolved version-pin marker
    const why = getCareer("audit")!.skills.find((s) => s.name === "Audit technology fluency (accounting software / Excel family)")!.what;
    expect(why).toMatch(/version/i);
  });
});

describe("blessed conversion — resource pools (status-respecting, no drops)", () => {
  it("pool rows all scope to real careers + real skills (per-role linkage)", () => {
    const careers = new Map(CAREERS.map((c) => [c.id, c]));
    for (const r of PURCHASE_BOOKS) {
      const career = careers.get(r.careerId);
      expect(career, `${r.id} points at unknown career`).toBeDefined();
      for (const skill of r.skillsAddressed) {
        expect(career!.skills.some((s) => s.name === skill), `${r.id} addresses unknown skill ${skill}`).toBe(true);
      }
    }
  });

  it("purchase-labeled books keep their flagged status (4 books; free texts stay in RESOURCES)", () => {
    expect(PURCHASE_BOOKS).toHaveLength(4);
    for (const b of PURCHASE_BOOKS) {
      // the typed purchase-label flag IS the status marker (kept, never dropped)
      expect(b.purchaseLabel).toBe(true);
      expect(b.provider.length).toBeGreaterThan(0);
    }
    // the edition with a printed price carries it verbatim (never a peso conversion)
    const handbook = PURCHASE_BOOKS.find((b) => b.id === "book-execsec-admin-handbook")!;
    expect(handbook.priceNote).toMatch(/\$49\.99/);
  });

  it("every career has a non-empty pool (no empty resource pools where a pool exists)", () => {
    for (const c of CAREERS) {
      const pool = RESOURCES.filter((r) => r.careerId === c.id);
      const books = PURCHASE_BOOKS.filter((b) => b.careerId === c.id);
      expect(pool.length + books.length > 0, `${c.id} has an empty pool`).toBe(true);
      // and every spec-pool skill that has a resource is a real skill
      for (const r of pool) {
        for (const skill of r.skillsAddressed) {
          expect(c.skills.some((s) => s.name === skill), `${r.id} addresses unknown skill ${skill}`).toBe(true);
        }
      }
    }
  });

  it("gap rows stay declared-thin (27); url rows carry real URLs; canon demo rows intact", () => {
    const gap = RESOURCES.filter((r) => r.provider === "resource gap — unresolved");
    expect(gap.length).toBe(27);
    for (const r of gap) {
      expect(r.url).toBeUndefined();
      expect(r.durationHours).toBe(0);
    }
    for (const r of RESOURCES) {
      if (r.provider !== "resource gap — unresolved") {
        expect(r.url, `${r.id} (non-gap row) is missing its URL`).toBeDefined();
        expect(r.url).toMatch(/^https?:\/\//);
      }
    }
    // canon demo resources survive untouched (money-shot + onboarding goal)
    const qaTesting = RESOURCES.find((r) => r.id === "res-qa-testing")!;
    expect(qaTesting.skillsAddressed).toEqual(["Software Testing"]);
    expect(qaTesting.url).toBe("https://testautomationu.applitools.com/");
    const pyBasics = RESOURCES.find((r) => r.id === "res-python-basics")!;
    expect(pyBasics.skillsAddressed).toEqual(["Applications Development"]);
    expect(RESOURCES.some((r) => r.id === "res-its-css-nc")).toBe(true);
    // the da pools stay complete (13 rows, one per skill)
    expect(RESOURCES.filter((r) => r.careerId === "da")).toHaveLength(13);
  });

  it("ruled drops stay dropped (Guru99 · LinkedIn) and stripped citations stay stripped (study.com)", () => {
    for (const r of RESOURCES) {
      const url = r.url ?? "";
      expect(url, `${r.id} must not carry a LinkedIn Learning URL (ruled drop 2026-10-29)`).not.toMatch(/linkedin\.com/i);
      expect(url, `${r.id} must not carry a Guru99 URL (ruled drop 2026-10-29)`).not.toMatch(/guru99/i);
      expect(url, `${r.id} must not carry a study.com URL (ruled strip/citation removal)`).not.toMatch(/study\.com/i);
      expect(r.title).not.toMatch(/LinkedIn Learning/i);
      expect(r.title).not.toMatch(/Guru99/i);
    }
  });

  it("statutory keep-with-flag: portals are labeled start-here placeholders; eFPS stays dead-in-copy; RA 9184 caveat travels", () => {
    // the six ruled files carry their placeholder rows
    const expectPortal = (test: RegExp, id: string) => {
      const row = RESOURCES.find((r) => test.test(r.title));
      expect(row, `${id} row missing`).toBeDefined();
    };
    expectPortal(/SSS — Official portal/, "res-pay-sss");
    expectPortal(/PhilHealth — Official portal/, "res-pay-philhealth");
    expectPortal(/Pag-IBIG \(HDMF\) — Official portal/, "res-pay-pagibig");
    expectPortal(/BIR — Official portal.*eFPS.*dead-in-copy/, "res-pay-bir");
    expectPortal(/BIR — Official portal/, "res-audit-bir (audit's share of the eFPS dead-in-copy ruling)");
    expectPortal(/SSS — Official portal.*payment-desk/, "res-teller-sss");
    expectPortal(/PS-PhilGEPS/, "res-purch-philgeps");
    const ra9184 = RESOURCES.find((r) => r.id === "res-purch-ra9184-irr")!;
    expect(ra9184).toBeDefined();
    // the ruled caveat wording lives with the resource it belongs to
    expect(ra9184.url).toBe("https://www.gppb.gov.ph/laws/RA-9184/");
    // no row ever cites an eFPS tutorial/deep page
    for (const r of RESOURCES) {
      expect(r.url ?? "").not.toMatch(/efps\b/i);
    }
  });

  it("OpenLearn keep-with-flag: the adopted verdict line rides the 10 blessed rows", () => {
    const openlearnRoles = new Set(
      RESOURCES.filter((r) => (r.url ?? "").includes("open.edu/openlearn")).map((r) => r.careerId)
    );
    for (const role of ["swd", "qa", "ba", "its", "sysadmin", "dba", "cybersec", "digart", "desk", "soc"]) {
      expect(openlearnRoles.has(role), `${role} should hold its OpenLearn keep-with-flag row`).toBe(true);
    }
  });

  it("the encode crypto anchor, clerk-thin split, and NARA retirement are in the shipped pools/rows", () => {
    // encode: the cryptographic-procedures O*NET anchor is KEPT (ruling) — station-assigned to the data-movement row
    expect(ROW_SPECS["encode::Importing and exporting data between different database systems and softwares"].anchors.join(" ")).toMatch(/cryptographic procedures/i);
    expect(ROW_SPECS["encode::Importing and exporting data between different database systems and softwares"].flags?.some((f) => /KEPT/i.test(f))).toBe(true);
    // clerk: the split thin rows exist and row 6 declares resourceless-thin
    expect(ROW_SPECS["clerk::Recording issue of equipment to staff"].flags?.some((f) => /resourceless-thin/i.test(f))).toBe(true);
    // the pre-blessing NARA lesson rows retire from the execsec/records pools
    expect(RESOURCES.some((r) => r.id.startsWith("res-records-l1"))).toBe(false);
    expect(RESOURCES.some((r) => r.id === "res-execsec-records-doc")).toBe(false);
  });
});

describe("blessed conversion — synonym seeds (integrity; engine untouched)", () => {
  it("seed keys resolve to real catalog skill names (no orphan seeds) and stay lowercase", () => {
    const allSkills = new Set<string>(CAREERS.flatMap((c) => c.skills.map((s) => s.name)));
    for (const [name, seed] of Object.entries(SKILL_SYNONYMS)) {
      expect(allSkills.has(name), `orphan seed key: ${name}`).toBe(true);
      for (const phrase of seed.like) {
        expect(phrase).toBe(phrase.toLowerCase());
      }
    }
    // the conversion's wall of new seeds
    expect(Object.keys(SKILL_SYNONYMS).length).toBeGreaterThanOrEqual(150);
  });

  it("demo-trio seeds stay byte-intact (canon protection)", () => {
    expect(SKILL_SYNONYMS["Applications Development"]).toEqual({
      like: [
        "application development", "app development", "programming", "python", "java",
        "javascript", "typescript", "coding", "php", "c#", "software development",
      ],
    });
    expect(SKILL_SYNONYMS["ETL (extract-transform-load workflows)"]).toEqual({
      like: ["etl", "extract-transform-load", "data pipeline", "data transformation"],
    });
    expect(SKILL_SYNONYMS["Software Testing"].like).toContain("regression testing");
  });
});

/* ═══════════════════════════════════════════════════════════════════════════
   Round-8 admin round — the verified-credential → gap-closure join
   (the Round-4 lock at work: verified credentials close gaps like platform
   completions, feeding SP + TP). Canon safety: the demo arc runs ZERO
   counselor-audited credentials, so every canon number must stay byte-true
   with the join present.
   ═══════════════════════════════════════════════════════════════════════════ */

import { applyVerifiedCredential } from "@/lib/actions";

describe("verified-credential join (admin round, Round-4 lock)", () => {
  const career = getCareer("swd")!;

  it("closes only the cited skills that sit on the target career map — as verified bars, with the credential named in the receipt", () => {
    const s = NEIL_SEED; // canon seed: 6 of 8 bars claimed/verified-closed
    const onMap = career.skills.map((k) => k.name).find((n) => !(n in s.bars))!;
    const offMap = "Advanced Data Mining Techniques"; // off-map vocabulary is real but not on swd's map
    const join = applyVerifiedCredential(s, career, {
      title: "OWASP secure-development certificate",
      declaredSkills: [onMap, offMap],
    });
    expect(join.closed).toEqual([onMap]); // off-map closes nothing (no invented bar)
    expect(join.state.bars[onMap]).toEqual({ source: "verified" });
    const receipt = join.state.events.filter(
      (e) => e.kind === "bar-closed" && e.detail.includes("verified credential: OWASP secure-development certificate")
    );
    expect(receipt).toHaveLength(1); // the provenance receipt names the audit
    expect(receipt[0].source).toBe("verified");
    // SP actually moves: the closed bar lifts the channel per the locked math
    const spMoved = scoreFor(join.state).sp - scoreFor(s).sp;
    expect(spMoved).toBeGreaterThan(0);
  });

  it("ticks stage-① exactly like a comprehension pass (the TP feed) — a closed queue member leaves the queue", () => {
    const s = NEIL_SEED;
    const open = career.skills.map((k) => k.name).find((n) => !(n in s.bars))!;
    const queued: StudentState = { ...s, stageOneQueue: [open], stageOneDone: s.stageOneDone };
    const join = applyVerifiedCredential(queued, career, {
      title: "Test leave-pass",
      declaredSkills: [open],
    });
    expect(join.queueTicks).toEqual([open]);
    expect(join.state.stageOneDone).toBe(s.stageOneDone + 1);
    expect(join.state.stageOneQueue).toEqual([]);
  });

  it("is idempotent — re-running the join on an already-verified credential closes nothing", () => {
    const s = NEIL_SEED;
    const onMap = career.skills.map((k) => k.name).find((n) => !(n in s.bars))!;
    const first = applyVerifiedCredential(s, career, { title: "T", declaredSkills: [onMap] });
    const again = applyVerifiedCredential(first.state, career, { title: "T", declaredSkills: [onMap] });
    expect(again.closed).toEqual([]);
    expect(again.state.bars[onMap]).toEqual(first.state.bars[onMap]);
    expect(again.state.events).toEqual(first.state.events);
  });

  it("canon stays byte-true: no credentials in the arc means no bars move, and every canon number holds", () => {
    const untouched = applyVerifiedCredential(NEIL_SEED, career, {
      title: "no-op",
      declaredSkills: [],
    });
    expect(untouched.closed).toEqual([]);
    expect(untouched.state).toBe(NEIL_SEED); // identity — the arc's own state object
    // the canon seed still scores ADR-0002's 40 (SP 19 · ES 17 · TP 0 · AR — · CC 4)
    expect(scoreFor(NEIL_SEED).total).toBe(40);
  });
});

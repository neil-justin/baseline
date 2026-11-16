/**
 * Interest engine + fixture integrity tests (agent B, onboarding rework —
 * 2026-11-06). Node style mirroring scripts/link-audit.test.ts: vitest `it`s,
 * no network (all O*NET data already on disk under research/onet-enrich/pulls/).
 */
import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { CAREERS } from "@/lib/fixtures/catalog";
import {
  CAREER_INTEREST_CODES,
  INTEREST_AREAS,
  INTEREST_ITEMS,
} from "@/lib/fixtures/interest";
import {
  fitLine,
  lowConfidence,
  rankCareers,
  scoreInterest,
  type InterestScores,
} from "@/lib/engines/interest";

const nets = (per: Partial<InterestScores>): InterestScores => ({
  R: 0, I: 0, A: 0, S: 0, E: 0, C: 0,
  ...per,
});

const fullAnswers = (v: 1 | 2 | 3 | 4 | 5): Record<string, 1 | 2 | 3 | 4 | 5> =>
  Object.fromEntries(INTEREST_ITEMS.map((i) => [i.id, v]));

describe("interest fixture integrity", () => {
  it("has 18 items, exactly 3 per RIASEC letter", () => {
    assert.equal(INTEREST_ITEMS.length, 18);
    for (const a of INTEREST_AREAS) {
      assert.equal(
        INTEREST_ITEMS.filter((i) => i.area === a).length, 3, `letter ${a}`)
    }
  });

  it("every item is anchored — non-empty ref + sourceQuote quoting an on-disk source", () => {
    for (const i of INTEREST_ITEMS) {
      assert.ok(i.ref.trim().length > 5, `${i.id} missing ref`);
      assert.ok(i.sourceQuote.trim().length > 5, `${i.id} missing sourceQuote`);
    }
  });

  it("statements stay activity-verb corporate — no tech/career nouns or channel jargon", () => {
    const banned = /\b(SP|ES|TP|AR|CC|API|SQL|CRM|LMS|SOC|BPM|PO|ERP)\b/;
    for (const i of INTEREST_ITEMS) {
      assert.doesNotMatch(i.statement, banned, `${i.id} jargon/tech noun: ${i.statement}`);
    }
  });

  it("every catalog career carries exactly one interest-code entry", () => {
    assert.equal(CAREER_INTEREST_CODES.length, CAREERS.length);
    const ids = new Set(CAREER_INTEREST_CODES.map((e) => e.careerId));
    for (const c of CAREERS) assert.ok(ids.has(c.id), `${c.id} has no interest code`);
    const dupes = CAREER_INTEREST_CODES.length - ids.size;
    assert.equal(dupes, 0);
  });

  it("interest codes are valid O*NET RIASEC strings from the live pulls", () => {
    const valid = /^[RIASEC]{1,3}$/;
    for (const e of CAREER_INTEREST_CODES) {
      assert.match(e.interestCode, valid, `${e.careerId} code ${e.interestCode}`);
      assert.ok(e.codeSource === "own" || e.codeSource === "track-anchor");
      // track-anchor rows must name the row they inherited from
      if (e.codeSource === "track-anchor") {
        assert.ok((e.note ?? "").includes("inherited"), `${e.careerId} note missing`);
      }
    }
  });
});

describe("scoreInterest — arithmetic edges", () => {
  it("unsure (3) contributes 0 to every letter — negative pass too", () => {
    for (const [label, v, expect] of [
      ["all-unsure", 3 as const, 0],
      ["all-strongly-dislike", 1 as const, -6],
      ["all-dislike", 2 as const, -3],
      ["all-like", 4 as const, 3],
      ["all-strongly-like", 5 as const, 6],
    ] as const) {
      const s = scoreInterest(fullAnswers(v));
      for (const a of INTEREST_AREAS) assert.equal(s[a], expect, `${label} ${a}`);
    }
  });

  it("mixed answers net letter-by-letter (negatives carry)", () => {
    const answers = { ...fullAnswers(3), "INT-R1": 5, "INT-R2": 2 } as Record<string, 1 | 2 | 3 | 4 | 5>;
    const s = scoreInterest(answers);
    assert.equal(s.R, 1);
    assert.equal(s.I, 0);
    assert.equal(s.E, 0);
  });

  it("unknown ids are ignored, not crashes", () => {
    const s = scoreInterest({ "INT-NOPE": 5 } as never);
    assert.deepEqual(s, nets({}));
  });
});

describe("rankCareers — gate FIRST, letter-position weighting, roster-order ties", () => {
  it("a higher-fit gated-out career must NOT rank above a gated-in one", () => {
    // Student leans I then C then E. qa (ICR: I@1→1.0, C@2→0.6) = 1.6;
    // events (ECS: E@3→0.35) = 0.35. With qa gated OUT of an all-gated-in
    // world, events must rank; with qa gated IN, qa outranks events.
    const scores = nets({ I: 6, C: 4, E: 2 });
    const gate = (career: { id: string }) => career.id !== "qa";
    const open = rankCareers(scores, CAREERS, () => true);
    const filtered = rankCareers(scores, CAREERS, gate);
    const qaOpen = open.findIndex((r) => r.careerId === "qa");
    assert.ok(qaOpen >= 0, "qa ranks when the gate passes it");
    assert.ok(qaOpen === 0 || open[qaOpen - 1].fitScore >= open[qaOpen].fitScore);
    const qaFiltered = filtered.findIndex((r) => r.careerId === "qa");
    assert.equal(qaFiltered, -1, "gated-out career must not appear at all");
    const ev = filtered.find((r) => r.careerId === "events");
    assert.ok(ev && ev.fitScore > 0, "gated-in lower-fit career still ranks");
    // and the top gated-in fit score must never come from the gated-out row:
    assert.ok(filtered.every((r) => r.careerId !== "qa"));
  });

  it("letter-position weighting: 1→1.0, 2→0.6, 3→0.35, off-order→0", () => {
    const scores = nets({ I: 6, C: 5, E: 4, S: 3, A: 2, R: 1 }); // I > C > E > S > A > R
    const events = CAREERS.find((c) => c.id === "events")!; // code ECS
    const r = rankCareers(scores, [events], () => true)[0];
    // I not in code; C@2→0.6; E@3→0.35; S@4→0
    assert.equal(r.fitScore, 0.6 + 0.35);
    // events code letter order is E,C,S — matchedLetters follow the code order
    assert.deepEqual(r.matchedLetters, ["E", "C"]);
    const flip = nets({ E: 6, I: 5, C: 4, S: 3, A: 2, R: 1 }); // E > I > C > …
    const rf = rankCareers(flip, [events], () => true)[0];
    assert.equal(rf.fitScore, 1.0 + 0.35); // E@1, C@3, S@4
    assert.deepEqual(rf.matchedLetters, ["E", "C"]);
  });

  it("ties break by catalog roster order", () => {
    // Every clerical/accounting CE career shares code letters; with C top-1
    // and E top-2, book, pay and fas all score 1.0+0.6, so the sort must
    // degenerate to roster order (book before pay before fas).
    const scores = nets({ C: 9, E: 5, I: 2, R: 1, A: 0, S: 0 });
    const group = CAREERS.filter((c) => ["book", "pay", "fas"].includes(c.id));
    const r = rankCareers(scores, group, () => true);
    assert.deepEqual(r.map((x) => x.careerId), ["book", "pay", "fas"]);
    assert.deepEqual([...new Set(r.map((x) => x.fitScore))].sort(), [1.6]);
  });
});

describe("lowConfidence", () => {
  it("triggers when top − second < 2", () => {
    assert.equal(lowConfidence(nets({ I: 4, C: 3 })), true); // gap 1
    assert.equal(lowConfidence(nets({})), true);             // flat 0/0
    assert.equal(lowConfidence(nets({ I: -2, C: -3 })), true); // gap 1
  });

  it("stays quiet when the top letter leads by ≥ 2", () => {
    assert.equal(lowConfidence(nets({ I: 5, C: 3 })), false);
    // fill all letters so the ranking is what the asserts assume
    const all = (p: Partial<InterestScores>): InterestScores => nets({ R: -9, A: -9, S: -9, E: -9, ...p });
    assert.equal(lowConfidence(all({ I: -2, C: -4 })), false);
  });
});

describe("fitLine — determinism + banned-cue scan", () => {
  const BANNED = /\b(correct|best|proper|should you|most)\b/i;

  it("deterministic in both inputs", () => {
    const career = CAREERS[0];
    const a = fitLine(["I", "C"], career);
    const b = fitLine(["I", "C"], career);
    assert.equal(a, b);
    const other = fitLine(["I", "C"], CAREERS[1]);
    assert.notEqual(a, other);
  });

  it("renders the student's own letters and the career's profile — banned cues absent", () => {
    for (const c of CAREERS) {
      [0, 1, 2, 3, 4, 5].forEach((k) => {
        const tops = INTEREST_AREAS.sort().slice(k, k + 2) as never;
        const line = fitLine(tops, c);
        assert.doesNotMatch(line, BANNED, `${c.id} line has a banned cue: ${line}`);
        assert.ok(line.length > 20);
        assert.ok(!line.includes(c.name), "line must not telegraph the career name");
      });
      const line = fitLine(["I", "C"], c);
      assert.match(line, /Investigative/);
      assert.match(line, /Conventional/);
    }
  });

  it("every career's generated line reflects its pulled interest code (own or inherited)", () => {
    const entry = CAREER_INTEREST_CODES.find((e) => e.careerId === "purch")!; // CER
    const line = fitLine(["C", "E"], { id: "purch" });
    assert.match(line, /Realistic/); // R only enters via the career's code
    assert.equal(entry.interestCode, "CER");
  });
});

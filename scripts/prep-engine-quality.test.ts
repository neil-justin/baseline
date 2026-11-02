import { describe, expect, it } from "vitest";
import type { ParsedResume } from "@/lib/engines/resume/parse";
import { diagnose, scopedKeywordMatch } from "@/lib/engines/resume/analyze";
import { keywordMatch } from "@/lib/engines/resume/analyze";
import { mapRegions } from "@/lib/engines/resume/sections";
import { getCareer } from "@/lib/fixtures/catalog";

/**
 * §6.4 Prep-engine quality loop (user report 2026-11-02 — real resume failed
 * checks the substance should pass).
 *
 * User symptoms this file must stay red against until fixed:
 *  - "my resume has WORK EXPERIENCE section — but checker said no Experience"
 *  - skill verdicts keyed to canonical phrases nobody writes on a real resume
 *    ("Secure-coding practices — not found", "Applications Support and
 *    Enhancement — not found")
 * The assertions state the STUDENT semantics ("this clearly demonstrates the
 * skill"), not an implementation detail. Red = the deterministic matcher
 * disagrees with a reasonable human reading.
 */

/** Realistic PH intern resume phrasing — no canonical/seeded phrases used. */
const SUPPORT_SENTENCE =
  "assisted in the maintenance of production applications, reproducing and " +
  "patching defects reported by end users";
const SECURITY_SENTENCE =
  "encrypted stored user passwords and sanitized database queries to " +
  "prevent injection attacks";

/** Resume whose only experience-ish heading is the COMMON PH heading. */
function resumeWith(heading: string): ParsedResume {
  const text = [
    "Neil Justin Mallari",
    "0917 123 4567 · neil.mallari@email.com · github.com/neiljm",
    "",
    "SUMMARY",
    "BSIT senior. Built three web applications for real users.",
    "",
    heading,
    "Web Development Intern — JTC Tech Solutions · Jun 2025 – Oct 2025",
    "• " + SUPPORT_SENTENCE,
    "• " + SECURITY_SENTENCE,
    "",
    "EDUCATION",
    "BS Information Technology — expected 2026",
    "",
    "SKILLS",
    "HTML · CSS · JavaScript · MySQL · Git",
  ].join("\n");
  return {
    ok: true,
    kind: "pdf",
    text,
    lower: text.toLowerCase(),
    pages: 1,
    pageTextLengths: [text.length],
    extMismatch: false,
    bytes: text.length,
  } as ParsedResume;
}

/** ParsedResume shape with the full lowercased text long-since normalized. */
const loose = (text: string): ParsedResume =>
  ({
    ok: true,
    kind: "pdf",
    text,
    lower: text.toLowerCase(),
    pages: 1,
    pageTextLengths: [text.length],
    extMismatch: false,
    bytes: text.length,
  } as unknown as ParsedResume);

describe("prep-engine quality — §6.4 (red until substance fix)", () => {
  it("counts demonstrated Applications Support and Enhancement substance", () => {
    const { matched } = keywordMatch(getCareer("swd")!, SUPPORT_SENTENCE.toLowerCase());
    expect(matched).toContain("Applications Support and Enhancement");
  });

  it("counts demonstrated Secure-coding substance (hashing, sanitizing, injection)", () => {
    const { matched } = keywordMatch(getCareer("swd")!, SECURITY_SENTENCE.toLowerCase());
    expect(matched).toContain("Secure-coding practices");
  });

  it("detects Experience when the heading is 'INTERNSHIP EXPERIENCE'", () => {
    const run = diagnose({
      career: getCareer("swd")!,
      parsed: resumeWith("INTERNSHIP EXPERIENCE"),
      fileName: "real-resume.pdf",
      at: new Date().toISOString(),
    });
    expect(run.flags.experience).toBe(true);
  });

  it("detects Experience when the heading is 'WORK EXPERIENCE' even after a PDF line-merge", () => {
    // Real-world extraction hazard: the heading may land on the same line as
    // following content (>42 chars) — the current head-length gate drops it.
    const text = [
      "WORK EXPERIENCE Web Development Intern — JTC Tech Solutions · Jun 2025 – Oct 2025",
      "• assisted in the maintenance of production applications",
      "",
      "EDUCATION",
      "BS Information Technology — expected 2026",
      "SKILLS",
      "HTML · CSS · JavaScript · MySQL · Git",
    ].join("\n");
    const run = diagnose({
      career: getCareer("swd")!,
      parsed:
        {
        ok: true,
        kind: "pdf",
        text,
        lower: text.toLowerCase(),
        pages: 1,
        pageTextLengths: [text.length],
        extMismatch: false,
        bytes: text.length,
        } as unknown as ParsedResume,
      fileName: "merged.pdf",
      at: new Date().toISOString(),
    });
    expect(run.flags.experience).toBe(true);
  });
});

describe("prep-engine quality — section-scoping (§6.4 Q16 addendum)", () => {
  it("a PH-style OJT/practicum heading reads as Experience", () => {
    const run = diagnose({
      career: getCareer("swd")!,
      parsed: resumeWith("OJT EXPERIENCE"),
      fileName: "ojt-resume.pdf",
      at: new Date().toISOString(),
    });
    expect(run.flags.experience).toBe(true);
  });

  it("a combined head yields BOTH sections ('Skills & Experience' — per-word reads)", () => {
    const text = [
      "Jane Cruz",
      "jane.cruz@email.com · 0917 112 2233",
      "",
      "SKILLS & EXPERIENCE",
      "HTML · CSS · SQL · Git",
      "Web Development Intern — JTC Tech Solutions · Jun 2025 – Oct 2025",
      "",
      "EDUCATION",
      "BS Information Technology — expected 2026",
    ].join("\n");
    const run = diagnose({
      career: getCareer("swd")!,
      parsed: loose(text),
      fileName: "combined.pdf",
      at: new Date().toISOString(),
    });
    expect(run.flags.skills).toBe(true);
    expect(run.flags.experience).toBe(true);
  });

  it("a skill named ONLY inside its Skills-section list still counts (no phrase-gate blindness)", () => {
    const lines = [
      "Jane Cruz",
      "jane.cruz@email.com · 0917 112 2233",
      "",
      "SKILLS",
      "HTML · CSS · SQL · Git · JavaScript",
      "",
      "EDUCATION",
      "BS Information Technology — expected 2026",
    ];
    const res = scopedKeywordMatch(getCareer("swd")!, mapRegions(lines));
    expect(res.matched).toContain("Data Design / SQL + data modeling");
  });

  it("a skill named ONLY in the objective pitch is weak evidence — never a pass", () => {
    const lines = [
      "Jane Cruz",
      "jane.cruz@email.com · 0917 112 2233",
      "",
      "OBJECTIVE",
      "To obtain an internship where I can practice quality assurance and software testing.",
      "",
      "EDUCATION",
      "BS Information Technology — expected 2026",
    ];
    const res = scopedKeywordMatch(getCareer("qa")!, mapRegions(lines));
    expect(res.pitchOnly).toContain("Quality Assurance / Quality Standards");
    expect(res.pitchOnly).toContain("Software Testing");
    expect(res.matched).not.toContain("Quality Assurance / Quality Standards");
    expect(res.matched).not.toContain("Software Testing");
  });
});

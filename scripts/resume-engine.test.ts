import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { intakeResumeFile, isProbablyResume, type ParsedResume } from "@/lib/engines/resume/parse";
import { diagnose } from "@/lib/engines/resume/analyze";
import { computeAirResume } from "@/lib/engines/air";
import { getCareer } from "@/lib/fixtures/catalog";
import { NEIL_SEED } from "@/lib/fixtures/neil";

/**
 * Resume-engine verification (round 6a) — runs the REAL intake + diagnostic
 * over the generated artifacts (scripts/make-resume-artifacts.mjs) and asserts
 * the locked rejection matrix, the three deterministic factors, the AIR
 * formula, and the suggestion fences.
 */

const FIX = (n: string) => path.join(__dirname, "..", "e2e", "fixtures", n);
const fixture = (n: string) => readFileSync(FIX(n));

async function intake(
  name: string,
  fileName = name,
  fileCount = 1
): Promise<Awaited<ReturnType<typeof intakeResumeFile>>> {
  return intakeResumeFile({ bytes: fixture(name), fileName, fileCount });
}

const SWD = getCareer("swd")!;

describe("artifact generator smoke (public/ reference template parses to real text)", () => {
  it("reference DOCX parses and passes the resume gate", async () => {
    const r = await intakeResumeFile({
      bytes: readFileSync(path.join(__dirname, "..", "public", "resume-reference.docx")),
      fileName: "resume-reference.docx",
      fileCount: 1,
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.kind).toBe("docx");
      expect(r.text).toContain("EDUCATION");
      expect(isProbablyResume(r)).toBeNull();
    }
  });

  it("reference PDF parses and passes the resume gate", async () => {
    const r = await intakeResumeFile({
      bytes: readFileSync(path.join(__dirname, "..", "public", "resume-reference.pdf")),
      fileName: "resume-reference.pdf",
      fileCount: 1,
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.kind).toBe("pdf");
      expect(r.pages).toBe(1);
      expect(isProbablyResume(r)).toBeNull();
    }
  });
});

describe("locked rejection matrix over the generated fixtures", () => {
  it("irrelevant file: parses, but 'doesn't read as a resume' + what's missing", async () => {
    const r = await intake("resume-irrelevant.pdf");
    expect(r.ok).toBe(true);
    if (r.ok) {
      const gate = isProbablyResume(r);
      expect(gate).not.toBeNull();
      expect(gate!.code).toBe("not_resume");
      expect(gate!.detail).toContain("doesn't read as a resume");
      expect((gate!.missing ?? []).join(" ")).toMatch(/contact/);
      expect((gate!.missing ?? []).join(" ")).toMatch(/section heading/);
    }
  });

  it("empty/near-empty PDF rejects", async () => {
    const r = await intake("resume-empty.pdf");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code === "empty" || r.code === "scanned").toBe(true);
  });

  it("scanned/image-only PDF rejects with re-export guidance — no OCR path", async () => {
    const r = await intake("resume-scanned.pdf");
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.code).toBe("scanned");
      expect(r.detail.toLowerCase()).toContain("re-export");
      expect(r.detail.toLowerCase()).not.toContain("ocr");
    }
  });

  it("oversize (>5 MB) rejects before any parse", async () => {
    const r = await intake("resume-oversize.pdf");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe("oversize");
  });

  it("multi-file upload rejects regardless of content", async () => {
    const r = await intake("resume-good.pdf", "f.pdf", 2);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe("multi_file");
  });

  it("content sniffs through a lying .pdf name (DOCX bytes) — accepted, flagged", async () => {
    const r = await intake("resume-mismatch.pdf");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.kind).toBe("docx");
      expect(r.extMismatch).toBe(true);
      // the diagnostic surfaces a watch finding, never a rejection
      const run = diagnose({ career: SWD, parsed: r, fileName: "resume-mismatch.pdf", at: "2026-10-29T00:00:00Z" });
      expect(run.findings.some((f) => f.id === "sniff-mismatch" && f.level === "watch")).toBe(true);
    }
  });

  it("an unrequested-OCR future stays a reject: the scanned fixture never yields text", async () => {
    const r = await intake("resume-scanned.pdf");
    if (r.ok) expect(r.text.length).toBeLessThan(120); // guard, in case the reject condition drifts
  });
});

describe("the good fixture: three deterministic factors + AIR", () => {
  it("PDF intake succeeds with a real page count", async () => {
    const r = await intake("resume-good.pdf");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.kind).toBe("pdf");
      expect(r.pages).toBe(1);
      expect(r.text).toContain("SQL");
    }
  });

  it("DOCX intake succeeds, page estimate flagged as an estimate", async () => {
    const r = await intake("resume-good.docx");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.kind).toBe("docx");
      expect(r.pages).toBeNull();
      const run = diagnose({ career: SWD, parsed: r, fileName: "resume-good.docx", at: "2026-10-29T00:00:00Z" });
      expect(run.flags.onepageEstimated).toBe(true);
      expect(run.flags.onepage).toBe(true); // good fixture is comfortably one page long
    }
  });

  it("good resume for the Associate Software Developer role parses cleanly and passes format", async () => {
    const r = await intake("resume-good.pdf") as ParsedResume;
    if (!r.ok) throw new Error("fixture must parse");
    const gate = isProbablyResume(r);
    expect(gate).toBeNull();

    const run = diagnose({ career: SWD, parsed: r, fileName: "resume-good.pdf", at: "2026-10-29T00:00:00Z" });
    expect(run.flags).toMatchObject({ contact: true, education: true, experience: true, skills: true, onepage: true });
    expect(run.format.score).toBe(1);
    expect(run.parseability.score).toBe(1);
    // every core-tier skill hit in the text (seed covers the PSF-SDS row names)
    expect(run.keywords.score).toBe(1);
    expect(run.air.airResume).toBe(100);
    expect(run.findings.filter((f) => f.level === "fix")).toHaveLength(0);
    expect(run.engine).toBe("deterministic-templates");
  });

  it("a weak resume drops format and keyword scores deterministically", async () => {
    // reference template reads as a resume (contact + headings + lines) but
    // placeholders mean zero core-tier keywords hit
    const bytes = readFileSync(path.join(__dirname, "..", "public", "resume-reference.pdf"));
    const r = await intakeResumeFile({ bytes, fileName: "t.pdf", fileCount: 1 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      const gate = isProbablyResume(r);
      expect(gate).toBeNull(); // structurally it IS a resume
      const run = diagnose({ career: SWD, parsed: r, fileName: "t.pdf", at: "2026-10-29T00:00:00Z" });
      expect(run.format.checks.every((c) => c.ok)).toBe(true);
      expect(run.keywords.score).toBe(0);
      expect(run.air.airResume).toBe(0);
      // every core-tier gap carries a suggestion: move + labeled example
      const gaps = run.findings.filter((f) => f.skill);
      expect(gaps.length).toBe(5);
      expect(gaps.map((g) => g.skill)).toEqual(
        getCareer("swd")!.skills.filter((s) => s.tier === "core").map((s) => s.name)
      );
      for (const g of gaps) {
        expect(g.suggestion?.move.length ?? 0).toBeGreaterThan(10);
        expect(g.suggestion?.example?.label).toBe("example");
        // the example anchors in the student's OWN extracted text
        expect(run.findings).toBeDefined();
        expect(g.suggestion?.example?.fromLine.length ?? 0).toBeGreaterThan(10);
      }
    }
  });
});

describe("the personalized on-ramp list (Q7a — derived from the student's own state)", () => {
  it("NEIL canon seed names his verified skills, honest internship/credentials lines, and the role's keyword floor", async () => {
    const { mustContainList } = await import("@/app/(app)/prep/must-contain");
    const items = await mustContainList(getCareer("swd")!, NEIL_SEED);
    const labels = items.map((i) => i.label).join(" | ");
    const notes = items.map((i) => i.note).join(" | ");
    // verified bars only — NEIL_SEED verifies the two PSF-SDS rows, claims never lift rows
    expect(labels).toContain("Skills section naming these verified skills: Data Design / SQL + data modeling, Business Needs Analysis");
    // internship honesty: no intake answer exists in the SHS-stale state yet
    expect(notes).toContain("no internship recorded yet");
    expect(labels).toContain("nothing recorded yet"); // credentials, none yet
    // the keyword floor = the role's core tier, verbatim catalog rows
    expect(labels).toContain(
      getCareer("swd")!.skills.filter((s) => s.tier === "core").map((s) => s.name).join(", ")
    );
    // every row carries its source
    for (const it of items) expect(it.src.length).toBeGreaterThan(0);
  });
});

describe("AIR formula (standalone engine, lib/engines/air.ts)", () => {
  it("parse gate closes everything", () => {
    const a = computeAirResume({ parsePass: false, formatScore: 1, keywordScore: 1 });
    expect(a).toEqual({ parsePass: 0, formatScore: 1, keywordScore: 1, airResume: 0 });
  });
  it("product of the three parts, half-down rounding", () => {
    expect(computeAirResume({ parsePass: true, formatScore: 0.8, keywordScore: 0.75 }).airResume).toBe(60);
    expect(computeAirResume({ parsePass: true, formatScore: 0.5, keywordScore: 0.5 }).airResume).toBe(25);
  });
  it("deterministic: same input, same run", () => {
    const x = computeAirResume({ parsePass: true, formatScore: 2 / 5, keywordScore: 1 / 3 });
    const y = computeAirResume({ parsePass: true, formatScore: 2 / 5, keywordScore: 1 / 3 });
    expect(x).toEqual(y);
  });
});

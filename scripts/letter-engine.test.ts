import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { intakeLetterFile, runLetterCheck, LETTER_WORD_MIN, LETTER_WORD_MAX } from "@/lib/engines/letter";
import { getCareer } from "@/lib/fixtures/catalog";

/**
 * Letter-engine verification (ticket-12 Prep pass, 2026-10-30) — runs the
 * REAL intake + runLetterCheck over the canon demo letter
 * (scripts/fixtures/cover-letter-qa.txt) and pins:
 *   - the canon letter passes all EVALUABLE checks (employer omitted → the
 *     honest skip row printed verbatim; letter factor 5 of 5 → +5 → 64)
 *   - the denominator honesty: a declared-but-unnamed employer RUNS and fails
 *   - the negative detections (no salutation · no closing ask · word band)
 *   - the intake floor (one file, real text, no OCR)
 *
 * Run: npx vitest run scripts/letter-engine.test.ts
 */

const FIX = (n: string) => path.join(__dirname, "fixtures", n);
const QA = getCareer("qa")!;

describe("canon demo letter (ticket-12 money beat: +5 → 64)", () => {
  const raw = readFileSync(FIX("cover-letter-qa.txt"), "utf8");

  it("intake reads the .txt letter and the run passes every evaluable check", async () => {
    const intake = await intakeLetterFile({ bytes: Buffer.from(raw, "utf8"), fileName: "cover-letter-qa.txt", fileCount: 1 });
    expect(intake.ok).toBe(true);
    if (!intake.ok) return;
    expect(intake.kind).toBe("txt");

    const run = runLetterCheck({
      career: QA,
      text: intake.text,
      kind: "txt",
      fileName: "cover-letter-qa.txt",
      employerField: null, // the demo omits the employer field — the honest skip
    });
    expect(run.air.airLetter).toBe(100); // letter 5 of 5 → 52 + 7 + 5 = 64
    expect(run.air.structuralScore).toBe(1);
    expect(run.employerDeclared).toBe(false);
    // the skip row prints the EXACT honesty line (ticket-12 ruling)
    const employerRow = run.checks.find((c) => c.label === "Employer named");
    expect(employerRow).toMatchObject({ ok: null, note: "not evaluated — no employer declared" });
    // structural set green: salutation · closing ask · 250–500 words
    expect(run.checks.find((c) => c.label.startsWith("Salutation"))!.ok).toBe(true);
    expect(run.checks.find((c) => c.label.startsWith("Closing ask"))!.ok).toBe(true);
    expect(run.checks.find((c) => c.label.startsWith("Word count"))!.ok).toBe(true);
    expect(run.wordCount).toBeGreaterThanOrEqual(LETTER_WORD_MIN);
    expect(run.wordCount).toBeLessThanOrEqual(LETTER_WORD_MAX);
    // role anchor: all four qa core-tier skills found — never employer-keyed
    expect(run.keywords).toHaveLength(4);
    expect(run.keywords.every((k) => k.ok === true)).toBe(true);
    // no fixes: the skip is a rendered row, never a finding
    expect(run.findings).toEqual([]);
    expect(run.engine).toBe("deterministic-templates");
  });

  it("a declared employer the letter never mentions runs the check and honestly fails it", () => {
    const run = runLetterCheck({
      career: QA,
      text: raw,
      kind: "txt",
      fileName: "cover-letter-qa.txt",
      employerField: "Global Cyber Labs",
    });
    expect(run.employerDeclared).toBe(true);
    expect(run.air.employerMentioned).toBe(false); // runs, fails — never skipped
    expect(run.air.structuralScore).toBe(0.75); // 3 of 4 evaluable
    // Q17 weighted sum: .2 + .4*1 + .4*.75 = .9 → 90 (the old product gave 75)
    expect(run.air.airLetter).toBe(90); // half-down letter factor: 4.5 → 4 of 5
    expect(run.findings.some((f) => f.id === "lf-employer-miss")).toBe(true);
  });

  it("negative detections: no salutation, no closing ask, out-of-band word count all fix", () => {
    const run = runLetterCheck({
      career: QA,
      text:
        "To the team,\n\nI am writing to apply. I did testing work this semester — test cases, test data, defect tracking, and quality assurance for a term project. " +
        "I would be glad to walk anyone through my reports. Thank you for your time.\n\nSincerely,\nNeil",
      kind: "txt",
      fileName: "short.txt",
    });
    // salutation: "To the team," is not an address of the locked forms
    expect(run.checks.find((c) => c.label.startsWith("Salutation"))!.ok).toBe(false);
    // no explicit interview/chance ask at all
    expect(run.checks.find((c) => c.label.startsWith("Closing ask"))!.ok).toBe(false);
    // far under the band (the locked 250–500)
    expect(run.air.wordBand).toBe(false);
    expect(run.air.airLetter).toBeLessThan(100);
    expect(run.findings.some((f) => f.id === "lf-words")).toBe(true);
    // role alignment runs against the declared Target Role regardless of employer
    expect(run.findings.every((f) => f.level === "fix" || f.level === "watch")).toBe(true);
  });

  it("never claims an ATS pass anywhere in findings or moves (feedback-only fence)", () => {
    const run = runLetterCheck({
      career: QA,
      text: readFileSync(FIX("cover-letter-qa.txt"), "utf8"),
      kind: "txt",
      fileName: "cover-letter-qa.txt",
      employerField: "  ",
    });
    const blob = JSON.stringify(run).toLowerCase();
    expect(blob).not.toContain("ats pass");
    expect(blob).not.toContain("ats-approved");
    expect(blob).not.toContain("here is your letter"); // never auto-writes
  });
});

describe("letter intake floor (content decides, no OCR)", () => {
  it("two files in one upload → multi_file; zero bytes → empty", async () => {
    const bytes = Buffer.from("Dear Hiring Manager,\n\n" + "Real letter body follows. ".repeat(12), "utf8");
    const multi = await intakeLetterFile({ bytes, fileName: "a.txt", fileCount: 2 });
    expect(multi.ok).toBe(false);
    if (!multi.ok) expect(multi.code).toBe("multi_file");
    const zero = await intakeLetterFile({ bytes: Buffer.alloc(0), fileName: "a.txt", fileCount: 1 });
    expect(zero.ok).toBe(false);
    if (!zero.ok) expect(zero.code).toBe("empty");
  });

  it("binary non-text content refuses on content, not extension", async () => {
    const bin = Buffer.from([0x0c, 0x01, 0x02, 0x03, 0x00, 0x01, 0x02, 0x03, ...Array(40).fill(0x07)]);
    const res = await intakeLetterFile({ bytes: bin, fileName: "photo.txt", fileCount: 1 });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.code).toBe("wrong_type");
  });

  it("a fake .txt extension carrying PDF garbage refuses on content", async () => {
    const pdf = Buffer.concat([Buffer.from("%PDF-1.4\n"), Buffer.alloc(24, 0x0)]); // pdf-magic + binary body
    const res = await intakeLetterFile({ bytes: pdf, fileName: "letter.txt", fileCount: 1 });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.code).toBe("parse_error"); // real pdf carrier, broken body
  });
});

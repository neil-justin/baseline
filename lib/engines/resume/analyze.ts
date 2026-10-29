/**
 * The diagnostic itself (round 6a brief) — three deterministic factors over a
 * successfully parsed resume, against the student's target role:
 *
 *  1. Parseability  — text present/extractable (the intake gate) + per-page
 *     text sanity (a sparse page betrays text-boxes/graphics layouts).
 *  2. Format conformance — section headers detected vs the NACE-guided
 *     standard: contact header · Education · Experience · Skills · one page.
 *     (WVU Eberly "NACE Resume Guidelines"; JobStreet PH recommends the same
 *     structure for fresh graduates — sources in
 *     .scratch/career-path-readiness-research/resume-diagnostic-criteria-sources.md)
 *  3. Keyword alignment — the role's CORE-tier skills vs the resume text,
 *     widened by the role's curated synonym seed (engine/resume: synonyms.ts).
 *
 * Suggestions follow the tiered rule (Q3b):
 *  - structure/format issues → concrete content MOVES;
 *  - keyword gaps → missing skill + where it belongs + ONE example bullet
 *    derived from the student's own extracted content, labeled an example.
 * Hard fences (they shape the templates below): never invent experience ·
 * never produce a section or a document · no paste-ready blocks · feedback
 * items only — no editing surface exists. Everything here is deterministic
 * templates over the student's own file text; zero LLM/LLM-adjacent calls.
 */

import type { ParsedResume, ResumeKind } from "./parse";
import { synonymsForSkill } from "./synonyms";
import { computeAirResume, type AirResume } from "@/lib/engines/air";
import type { Career, SkillSpec } from "@/lib/types";

export type Factor = "parseability" | "format" | "keywords";
export type Level = "pass" | "watch" | "fix";

export interface ExampleBullet {
  /** always labeled — the surface renders the label next to the text */
  label: "example";
  /** derived from the student's own resume line + the missing skill's name */
  text: string;
  /** provenance: their own quoted line the example anchors to */
  fromLine: string;
  skill: string;
}

export interface ResumeSuggestion {
  /** the concrete content move (tiered rule) */
  move: string;
  /** keyword gaps carry one labeled example bullet from the student's own text */
  example?: ExampleBullet;
}

export interface ResumeFinding {
  id: string;
  factor: Factor;
  level: Level;
  title: string;
  detail: string;
  suggestion?: ResumeSuggestion;
  skill?: string;
}

export interface FormatFlags {
  contact: boolean;
  education: boolean;
  experience: boolean;
  skills: boolean;
  onepage: boolean;
  /** DOCX page estimate is a heuristic, not the real layout */
  onepageEstimated: boolean;
  onepageDetail: string;
}

export interface FactorResult {
  factor: Factor;
  /** 0–1 contribution to AIR (parseability is the binary gate upstream) */
  score: number;
  checks: { label: string; ok: boolean; note?: string }[];
}

export interface ResumeDiagnosticRun {
  /** stable id — history ordering */
  id: string;
  at: string; // ISO
  kind: ResumeKind;
  fileName: string;
  careerId: string;
  careerName: string;
  air: AirResume;
  parseability: FactorResult;
  format: FactorResult;
  keywords: FactorResult;
  flags: FormatFlags;
  findings: ResumeFinding[];
  /** honest provenance line for the UI */
  engine: "deterministic-templates";
}

/* ── detection primitives ────────────────────────────────────────────────── */

const SECTION_RE =
  /\b(education|experience|employment|work history|internship|ojt|skills|competencies|projects|certifications?|volunteer|objective|summary|profile|qualifications|activities|leadership)\b/;

interface Detection {
  lines: string[];
  lowerLines: string[];
  hasContact: boolean;
  sections: string[];
  hasExperience: boolean;
  hasEducation: boolean;
  hasSkills: boolean;
  bulletCount: number;
  quantifiedBullets: number;
}

function detect(p: ParsedResume): Detection {
  const lines = p.text.split("\n").map((l) => l.trim());
  const lowerLines = lines.map((l) => l.toLowerCase());

  // A section head is a SHORT line that opens (or is) a section word —
  // "experienced in Java" mid-sentence must not read as an Experience head.
  const heads = new Set<string>();
  lines.forEach((l) => {
    if (l.length === 0 || l.length > 42) return;
    const m = SECTION_RE.exec(l.toLowerCase());
    if (!m) return;
    // head form: starts with the word ("Experience — 2024") or is a short
    // titled line containing it ("Work Experience")
    if (l.toLowerCase().startsWith(m[1]) || (l.length <= 30 && SECTION_RE.test(l) && (l.includes(" ") || l.length <= 18))) {
      heads.add(m[1]);
    }
  });

  const headText = p.text.slice(0, 400);
  const hasContact = /@/.test(headText) || /\+63|(^|[^0-9])09\d{2}[\s-]?\d{3}[\s-]?\d{4}/.test(headText);

  const bulletCount = lines.filter((l) => /^[•·▪●*‣o-]\s+\S/.test(l) && l.length > 6).length;
  const quantifiedBullets = lines.filter(
    (l) => /^[•·▪●*‣-]\s+\S/.test(l) && /\d/.test(l.slice(0, 90))
  ).length;

  return {
    lines: lines.filter((l) => l.length > 0),
    lowerLines,
    hasContact,
    sections: [...heads],
    hasExperience: heads.has("experience") || heads.has("employment") || heads.has("work history"),
    hasEducation: heads.has("education"),
    hasSkills: heads.has("skills") || heads.has("competencies"),
    bulletCount,
    quantifiedBullets,
  };
}

/* ── keyword matching (role core tier × synonym seed) ────────────────────── */

function phraseRegExp(phrase: string): RegExp {
  const esc = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${esc}([^a-z0-9]|$)`, "i");
}

export function keywordMatch(career: Career, lower: string) {
  const core = career.skills.filter((s: SkillSpec) => s.tier === "core");
  const matched: string[] = [];
  const missing: string[] = [];
  for (const spec of core) {
    if (synonymsForSkill(spec.name).like.some((ph) => ph && phraseRegExp(ph).test(lower))) {
      matched.push(spec.name);
    } else {
      missing.push(spec.name);
    }
  }
  return { core, matched, missing };
}

/* ── own-content anchor for example bullets (never invented) ────────────── */

const ANCHOR_RE =
  /\b(project|capstone|thesis|internship|ojt|practicum|portfolio|club|organi[sz]ation|club|volunteer|dean|scholarship|campaign|event|website|system|app|shop|store)\b/i;

/** Their own line that names real work — the anchor an example may quote. */
function ownAnchorLine(d: Detection): string | null {
  const candidates = d.lines
    .filter((l) => l.length >= 12 && l.length <= 90)
    .filter((l) => ANCHOR_RE.test(l) && !/@/.test(l));
  if (candidates.length === 0) return null;
  return candidates.sort((a, b) => b.length - a.length)[0];
}

/* ── the three factors ──────────────────────────────────────────────────── */

function parseabilityFactor(p: ParsedResume): FactorResult {
  // The intake gate passed — that IS the pass signal. Per-page sanity only
  // watches: a near-empty page means content may sit in a text box or image.
  const checks: FactorResult["checks"] = [{ label: "Text is extractable as-is (no OCR needed)", ok: true }];
  if (p.pageTextLengths && (p.pages ?? 1) > 1) {
    const sparse = p.pageTextLengths
      .map((n, i) => ({ pageNo: i + 1, n }))
      .filter((x) => x.n < 15);
    checks.push({
      label: "Every page carries readable text",
      ok: sparse.length === 0,
      note: sparse.length > 0 ? `page ${sparse[0].pageNo} reads almost empty to a parser` : undefined,
    });
  }
  return { factor: "parseability", score: 1, checks };
}

function formatFactor(p: ParsedResume, d: Detection): { result: FactorResult; flags: FormatFlags } {
  // One page: the PDF page count is authoritative; DOCX carries no page
  // count, so the check honestly estimates from length (≤700 words ≈ a page).
  const onepageEstimated = p.pages === null;
  const words = onepageEstimated ? p.text.split(/\s+/).length : p.pages!;
  const onepage = onepageEstimated ? words <= 700 : words === 1;
  const onepageDetail = onepageEstimated
    ? `read from length (~${words} words ≈ ${words <= 700 ? "one" : "more than one"} page · Word files don't carry page counts)`
    : `${p.pages} ${p.pages === 1 ? "page" : "pages"} in the PDF`;

  const flags: FormatFlags = {
    contact: d.hasContact,
    education: d.hasEducation,
    experience: d.hasExperience,
    skills: d.hasSkills,
    onepage,
    onepageEstimated,
    onepageDetail,
  };

  const checks: FactorResult["checks"] = [
    { label: "Contact detail in the header (email or phone)", ok: flags.contact },
    { label: "Education section", ok: flags.education },
    { label: "Experience section", ok: flags.experience },
    { label: "Skills section", ok: flags.skills },
    { label: "One page", ok: flags.onepage, note: onepageDetail },
  ];
  const passed = checks.filter((c) => c.ok).length;
  return {
    result: { factor: "format", score: passed / checks.length, checks },
    flags,
  };
}

function keywordFactor(career: Career, lower: string): FactorResult {
  const { core, matched } = keywordMatch(career, lower);
  return {
    factor: "keywords",
    score: core.length === 0 ? 0 : matched.length / core.length,
    checks: core.map((spec) => ({
      label: `${spec.name}${matched.includes(spec.name) ? "" : " — not found"}`,
      ok: matched.includes(spec.name),
    })),
  };
}

/* ── suggestions (tiered rule + fences) ─────────────────────────────────── */

const FORMAT_MOVES = {
  contact: {
    title: "No contact detail found in the header",
    detail:
      "Screening reads name, email, and phone before anything else — and a recruiter needs them to reach you.",
    move: "Put your name, email, and phone number at the very top — that header line carries nothing else.",
  },
  education: {
    title: "No Education section detected",
    detail:
      "For students and fresh graduates, career-guidance guides put Education near the top — it dates you and anchors the document.",
    move: "Add an Education section: program, school, expected graduation — each on its own line.",
  },
  experience: {
    title: "No Experience section detected",
    detail: "Internships, OJT, org work, and class projects all count — what matters is that the section exists and reads newest-first.",
    move: "Add an Experience section, newest activity first, each entry with the org, your role, and 1–3 bullets.",
  },
  skills: {
    title: "No Skills section detected",
    detail: "Screening software reads a named skills section directly; skills buried inside sentences can be missed.",
    move: "Add a short Skills section that lists tools and competencies by name, one per line or comma-separated.",
  },
  onepage: {
    title: "Beyond one page",
    detail:
      "Career-guidance guidance is consistent for students: one page. A second page is for the experience you'll earn later.",
    move: "Cut to one page: keep each entry's strongest 1–2 bullets and drop anything older than three years.",
  },
  bulletsQuantified: {
    title: "Bullets without numbers",
    detail: "Achievement bullets give the reader something to hold; measurable ones (counts, hours, results) are the strongest form.",
    move: "Under each experience entry, make one bullet quantified: open with an action verb, close with what changed.",
  },
  bulletsFew: {
    title: "Almost no bullet points",
    detail: "Solid paragraphs don't scan — recruiters and parsers both read bullets first.",
    move: "Turn each entry into 1–3 bullets, one accomplishment per bullet.",
  },
} as const;

type MoveKey = keyof typeof FORMAT_MOVES;

function moveFinding(key: MoveKey, note?: string): ResumeFinding {
  const m = FORMAT_MOVES[key];
  return {
    id: `fmt-${key}`,
    factor: "format",
    level: "fix",
    title: m.title,
    detail: note ? `${m.detail} (${note})` : m.detail,
    suggestion: { move: m.move },
  };
}

function keywordGapFindings(career: Career, d: Detection, missing: string[]): ResumeFinding[] {
  const anchor = ownAnchorLine(d);
  return missing.map((skill, i) => {
    const spec = career.skills.find((s) => s.name === skill);
    const example: ExampleBullet | undefined = anchor
      ? {
          label: "example",
          text: `Used ${skill.toLowerCase()} in my ${anchor.replace(/\.$/, "")} — say exactly what you did with it and what changed.`,
          fromLine: anchor,
          skill,
        }
      : undefined;
    return {
      id: `kw-${i}-${skill.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      factor: "keywords" as const,
      level: "fix" as const,
      title: `“${skill}” doesn't appear for this role`,
      detail: spec ? `Screening tools match this skill's words against the role's requirements — ${spec.what}.` : "",
      skill,
      suggestion: {
        move: "Name it in your Skills section, and add it to the experience entries where you actually used it.",
        ...(example ? { example } : {}),
      },
    };
  });
}

/* ── one call per successful run ────────────────────────────────────────── */

export interface RunContext {
  career: Career;
  parsed: ParsedResume;
  fileName: string;
  at?: string;
}

export function diagnose(ctx: RunContext): ResumeDiagnosticRun {
  const { career, parsed } = ctx;
  const d = detect(parsed);
  const parseability = parseabilityFactor(parsed);
  const { result: format, flags } = formatFactor(parsed, d);
  const keywords = keywordFactor(career, parsed.lower);

  const air = computeAirResume({
    parsePass: true,
    formatScore: format.score,
    keywordScore: keywords.score,
  });

  const findings: ResumeFinding[] = [];
  if (!flags.contact) findings.push(moveFinding("contact"));
  if (!flags.education) findings.push(moveFinding("education"));
  if (!flags.experience) findings.push(moveFinding("experience"));
  if (!flags.skills) findings.push(moveFinding("skills"));
  if (!flags.onepage) {
    findings.push(moveFinding("onepage", flags.onepageDetail));
  }
  if (d.bulletCount >= 3 && d.quantifiedBullets === 0) findings.push(moveFinding("bulletsQuantified"));
  if (d.bulletCount < 3) findings.push(moveFinding("bulletsFew"));
  findings.push(...keywordGapFindings(career, d, keywordMatch(career, parsed.lower).missing));

  for (const c of parseability.checks) {
    if (!c.ok) {
      findings.push({
        id: "parse-sparse-page",
        factor: "parseability",
        level: "watch",
        title: c.label + (c.note ? ` — ${c.note}` : ""),
        detail:
          "Machines trust plain text — content that reads almost empty usually sits in a text box or an image, and screening software skims past it.",
      });
    }
  }

  if (parsed.extMismatch) {
    findings.unshift({
      id: "sniff-mismatch",
      factor: "parseability",
      level: "watch",
      title: "File extension doesn't match what's inside",
      detail: `We read this as its real type (${parsed.kind === "pdf" ? "PDF" : "Word document"}) — the content decided, not the file name.`,
    });
  }

  return {
    id: `run-${Date.now().toString(36)}-${Math.floor(Math.random() * 46656).toString(36)}`,
    at: ctx.at ?? new Date().toISOString(),
    kind: parsed.kind,
    fileName: ctx.fileName.replace(/[^\w .-]/g, "_").slice(0, 120) || "resume",
    careerId: career.id,
    careerName: career.name,
    air,
    parseability,
    format,
    keywords,
    flags,
    findings,
    engine: "deterministic-templates",
  };
}

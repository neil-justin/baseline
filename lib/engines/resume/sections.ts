/**
 * Section-alias canon (§6.4 / Q16 prep stream, 2026-11-03 user-locked): the
 * deterministic, CHEAP single-scan map of a resume's extracted lines onto a
 * small set of section kinds.
 *
 * What it fixes vs the old line-level heuristic in analyze.ts:
 *  - LEFTMOST-WORD problem: the old `SECTION_RE` matched the FIRST heading
 *    vocabulary word it found in a short line; the PH-common heads
 *    ("INTERNSHIP EXPERIENCE", "OJT EXPERIENCE", "EMPLOYMENT HISTORY",
 *    "PROFESSIONAL BACKGROUND") and combined heads ("SKILLS & EXPERIENCE")
 *    fell through. The canon keys on the line's alias PHRASES and reads
 *    combined heads PER WORD (head yields BOTH kinds).
 *  - WHITESPACE TOLERANCE: heads are matched after collapsing every
 *    whitespace run to one space — a PDF/DOCX extractor's wrapped heading
 *    ("INTERNSHIP\nEXPERIENCE") still detects.
 *  - EXTRACTOR MERGE TOLERANCE: a heading merged onto its first content line
 *    (way past the old 42-char cap, which silently dropped it) still counts
 *    when the line BEGINS with a heading alias ("WORK EXPERIENCE Web
 *    Development Intern — …"); a mid-sentence "experienced in Java" still
 *    never reads as a head (the alias must END a word at the line start).
 *
 * Consumers: analyze.ts (head detection + section-scoped keyword matching).
 * Pure line arithmetic — no cost growing with document size beyond one pass,
 * nothing stateful, zero LLM. The OBJECTIVE region exists only behind its
 * own explicit head (Objective/Summary/Profile family); an unheaded opening
 * block stays body.
 */

export type SectionKind =
  | "education"
  | "experience"
  | "skills"
  | "projects"
  | "certifications"
  | "objective"
  | "other";

/** Collapse every whitespace run (incl. \n the caller may leave in) to " ". */
export function collapseWs(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/**
 * Heading aliases — START-anchored phrase families. The trailing \b keeps
 * "experienced in Java" out (the alias word must END inside the match, so
 * "experienced" never opens an experience head). Order matters: the two
 * COMBINED heads are tried before their single-word families could win.
 */
const ALIASES: { re: RegExp; kinds: SectionKind[] }[] = [
  // combined heads — per-word reads for BOTH kinds (ruling: "SKILLS &
  // EXPERIENCE" yields both)
  {
    re: /^(?:(?:technical\s+)?skills|core\s+competencies|competencies)\s*(?:[&+,;]|\band\b)\s*(?:(?:work|employment|internship|relev(?:ant)?)\s+)?(?:experience|internships?|employment|history|ojt\b|practicum)/,
    kinds: ["skills", "experience"],
  },
  {
    re: /^(?:experience|internships?|employment|history|ojt\b|practicum)\s*(?:[&+,;]|\band\b)\s*(?:(?:technical\s+)?skills|competencies|proficiencies)/,
    kinds: ["skills", "experience"],
  },
  // SKILLS family
  {
    re: /^(?:(?:technical|core|key|other)\s+)?(?:skills|competencies|proficiencies)\b/,
    kinds: ["skills"],
  },
  // EXPERIENCE family — the PH canon: INTERNSHIP (EXPERIENCE)? / OJT
  // (EXPERIENCE)? / PRACTICUM / EMPLOYMENT (HISTORY) / WORK EXPERIENCE /
  // PROFESSIONAL (BACKGROUND|EXPERIENCE) … all map to Experience
  {
    re: /^(?:occupational\s+)?(?:(?:my|our|relevant|professional|academic|industry|field|work)\s+)*(?:(?:experience|employment|internships?|ojt)(?:\s+(?:experience|program|hours|record|history))?|on[-\s]?the[-\s]?job(?:\s+(?:training|program))?|practicum|employment(?:\s+history|\s+record|\s+experiences?)?|work\s+history|professional\s+(?:background|history)|industry\s+(?:background|history|experience)|relevant\s+(?:experience|background)|field\s+experience|career\s+experience|experience(?:\s*(?:\([^)]{0,40}\)))?)\b/,
    kinds: ["experience"],
  },
  // EDUCATION family
  {
    re: /^(?:(?:educational|academic)\s+background|education\b|academics?)\b/,
    kinds: ["education"],
  },
  // PROJECTS family
  {
    re: /^(?:(?:academic|technical|personal|key)\s+)?(?:projects?\b|capstone(?:\s+(?:project|thesis))?|thesis\b|portfolio\b)/,
    kinds: ["projects"],
  },
  // CERTIFICATIONS family
  {
    re: /^(?:certifications?|licenses?|credentials|training\s+and\s+(?:certifications|seminars|workshops)|webinars?|seminars)\b/,
    kinds: ["certifications"],
  },
  // OBJECTIVE region (the only demoted region — pitch, not demonstrated skill)
  {
    re: /^(?:(?:career|professional|personal|job)\s+)?(?:objective|objectives|summary(?:\s+of\s+qualifications)?|profile((?:\s+summary)?)|about\s+me|about)\b/,
    kinds: ["objective"],
  },
];

/**
 * Is this trimmed line a section head? Cheap truth table over collapsed
 * text. A very long line (an extractor merge) still counts ONLY when an
 * alias anchors its start — never because of a mid-line vocabulary word.
 */
export function headKinds(line: string): SectionKind[] | null {
  const l = collapseWs(line).toLowerCase();
  if (l.length === 0 || l.length > 90) return null; // true merged body lines out
  for (const a of ALIASES) {
    if (a.re.test(l)) return a.kinds;
  }
  return null;
}

export interface ResumeRegions {
  /** every line under an explicit Objective/Summary/Profile head, lowercased,
   *  joined and whitespace-collapsed */
  objectiveText: string;
  /** the whole document MINUS the objective region — the region whose phrase
   *  matches count as demonstrated-skill evidence */
  bodyText: string;
  /** every detected head line, collapsed (the run record keeps these) */
  sectionLabels: string[];
  /** the set of kinds the document declared a head for */
  kinds: Set<SectionKind>;
}

/** ONE pass over trimmed lines: tag heads; demote only the objective region.
 *  Two deterministic guards keep a phantom objective region from opening:
 *   ORDER guard — the Objective/Summary/Profile family opens its region only
 *   before any structural head (education/experience/skills/…) was seen: a
 *   mid-resume "Summary of duties:" line inside an experience entry never
 *   opens a pitch region (an objective lives at the TOP of a resume);
 *   POSITION guard — the head must also sit among the document's first half
 *   of non-blank lines; and the region caps at 10 lines (an objective is
 *   short prose, never a full column). */
export function mapRegions(lines: string[]): ResumeRegions {
  let current: SectionKind | null = null; // null = body (before any head,
  //  after a projects/certifications/other head, or under a combined head)
  const scan = lines.filter((l) => l.trim().length > 0);
  const zoneLimit = Math.floor(scan.length * 0.5);
  let structuralSeen = false;
  const objective: string[] = [];
  const body: string[] = [];
  const kinds = new Set<SectionKind>();
  const sectionLabels: string[] = [];

  for (let s = 0; s < scan.length; s++) {
    const line = scan[s].trim();
    const labels = headKinds(line);
    if (labels) {
      for (const k of labels) kinds.add(k);
      sectionLabels.push(collapseWs(line));
      // the head line itself is furniture — never skill evidence
      if (labels.includes("objective")) {
        current =
          !structuralSeen && s < zoneLimit && objective.length < 10 ? "objective" : null;
      } else {
        structuralSeen = true;
        // combined head: until the NEXT head, lines are shared body
        current = labels.length > 1 ? null : labels[0];
      }
      continue;
    }
    if (current === "objective") objective.push(line.toLowerCase());
    else body.push(line.toLowerCase());
  }

  return {
    objectiveText: collapseWs(objective.join("\n")),
    bodyText: collapseWs(body.join("\n")),
    sectionLabels,
    kinds,
  };
}

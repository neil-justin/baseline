/**
 * Career-interest instrument (authored corporate RIASEC) — DATA ONLY.
 *
 * Decision (user-locked 2026-11-06, docs/career-interest-riasec.md §6–7):
 * the O*NET Interest Profiler is the SCORING FRAME reference; the items
 * themselves are AUTHORED corporate work-activity statements (18 = 3 per
 * letter), anchored like every other fixture — no invented sources.
 *
 * Anchoring: each item's `ref` cites the on-disk source it paraphrases:
 *  - the official O*NET interest-area definition text (1.B.1.a–f), pulled
 *    live 2026-11-06 with the repo's API-key discipline into
 *    `research/onet-enrich/pulls/interests/interest-areas.json`
 *    (+ sibling `.url.txt`) — the canon anchor for the letter itself;
 *  - catalog skill `what` lines (`lib/fixtures/catalog.ts`, row named);
 *  - verbatim task/document quotes carried by the catalog rows or the
 *    pulled O*NET occupation files (`research/onet-enrich/pulls/<code>…`).
 */

export type InterestAreaLetter = "R" | "I" | "A" | "S" | "E" | "C";

export const INTEREST_AREAS: InterestAreaLetter[] = ["R", "I", "A", "S", "E", "C"];

export interface InterestItem {
  id: string;
  area: InterestAreaLetter;
  statement: string;
  /** File + row the statement paraphrases. Never invented. */
  ref: string;
  /** The quoted source text the statement paraphrases. */
  sourceQuote: string;
  scaleNote?: string;
}

export const INTEREST_ITEMS: InterestItem[] = [
  // ── R · Realistic (1.B.1.a) ────────────────────────────────────────────────
  {
    id: "INT-R1",
    area: "R",
    statement: "Take on the thing that broke and get it working again yourself.",
    ref: "research/onet-enrich/pulls/interests/interest-areas.json · 1.B.1.a Realistic",
    sourceQuote:
      "Work involves designing, building, or repairing of equipment, materials, or structures, engaging in physical activity…",
  },
  {
    id: "INT-R2",
    area: "R",
    statement:
      "Make sure the workplace is set up and everything works before the day's meetings start.",
    ref: "lib/fixtures/catalog.ts adminassoc row \"Office equipment operation & basic troubleshooting\" (O*NET 43-6014.00)",
    sourceQuote: "Office equipment operation & basic troubleshooting — what: \"Facilities support.\"",
  },
  {
    id: "INT-R3",
    area: "R",
    statement:
      "Keep the day's work flowing — move the files, boxes, and deliveries to where they belong.",
    ref: "lib/fixtures/catalog.ts clerk row \"Sorting, opening and sending mail\" (PSOC 4110 b) + interests/interest-areas.json 1.B.1.a",
    sourceQuote:
      "Office mail flow (PSOC 4110 b) · 1.B.1.a: \"…engaging in physical activity\".",
    scaleNote: "The letter's physical-activity sense inside an office, not a workshop.",
  },

  // ── I · Investigative (1.B.1.b) ────────────────────────────────────────────
  {
    id: "INT-I1",
    area: "I",
    statement:
      "Pull apart a question no one has answered yet and prove out the answer yourself.",
    ref: "research/onet-enrich/pulls/interests/interest-areas.json · 1.B.1.b Investigative",
    sourceQuote: "Work involves studying and researching…",
  },
  {
    id: "INT-I2",
    area: "I",
    statement:
      "Compare records line by line to find the one figure that does not add up.",
    ref: "lib/fixtures/catalog.ts acctclerk row \"Reconcile or note and report discrepancies found in records\" (O*NET 43-3031.00 tasks)",
    sourceQuote:
      "\"Reconcile or note and report discrepancies found in records\" — the checking loop — figures, postings, invoice matching, coding.",
  },
  {
    id: "INT-I3",
    area: "I",
    statement: "Watch how a piece of work actually gets done and figure out why it takes longer than it should.",
    ref: "lib/fixtures/catalog.ts opsanalyst row \"On-site observation & interviewing\" (O*NET 13-1111.00)",
    sourceQuote: "On-site observation & interviewing — what: \"Talk to doers, not dashboards.\"",
  },

  // ── A · Artistic (1.B.1.c) ─────────────────────────────────────────────────
  {
    id: "INT-A1",
    area: "A",
    statement:
      "Decide how a page or a board looks — the parts' arrangement, the colors — until it reads well.",
    ref: "research/onet-enrich/pulls/interests/interest-areas.json · 1.B.1.c Artistic",
    sourceQuote: "…or applying artistic principles to the design of various objects and materials.",
  },
  {
    id: "INT-A2",
    area: "A",
    statement:
      "Write the words people actually enjoy reading — make the plain weekly notice interesting.",
    ref: "lib/fixtures/catalog.ts mkt row \"Content Development and Strategy\" (PSF-BD pp.16–17)",
    sourceQuote: "Content Development and Strategy — what: \"Brief, source and produce campaign content assets.\"",
  },
  {
    id: "INT-A3",
    area: "A",
    statement: "Arrange plain information into a picture or layout that makes its point land.",
    ref: "lib/fixtures/catalog.ts da row \"Data Visualization and Storytelling\" (PSF-AAI FSC Level 3)",
    sourceQuote:
      "Data Visualization and Storytelling — what: \"Build the dashboard/visual that makes the finding land, and tell the story behind the numbers.\"",
  },

  // ── S · Social (1.B.1.d) ───────────────────────────────────────────────────
  {
    id: "INT-S1",
    area: "S",
    statement: "Sit with someone who is worried or upset, calm them down, and help them sort the problem out.",
    ref: "lib/fixtures/catalog.ts csr row \"Demonstrate ability to effectively engage customers\" (TESDA CCS NC II ICT313367)",
    sourceQuote: "Empathy, de-escalation and resolution behavior inside the call — \"Sense and acknowledge customer feelings inside the call\".",
  },
  {
    id: "INT-S2",
    area: "S",
    statement: "Meet a confused visitor at the counter or door and point them to exactly where they need to go.",
    ref: "lib/fixtures/catalog.ts records row \"Visitor greeting & routing\" (O*NET 43-4171.00 corroboration)",
    sourceQuote: "Meet visitors, learn what they need, point them to the right door.",
  },
  {
    id: "INT-S3",
    area: "S",
    statement: "Walk a new hire through their first day so they feel settled and know where to ask.",
    ref: "lib/fixtures/catalog.ts hra row \"Onboarding\" (PSF-HCD Associate, Talent Attraction/Management pp.62–63)",
    sourceQuote: "Onboarding — what: \"Set up work access, orientation logistics and welcome packs for new hires.\"",
  },

  // ── E · Enterprising (1.B.1.e) ─────────────────────────────────────────────
  {
    id: "INT-E1",
    area: "E",
    statement: "Make the ask — invite a stranger to buy, join, or say yes, and see it through to an answer.",
    ref: "lib/fixtures/catalog.ts sales row \"Customer Acquisition Management\" (PSF-BD Sales pp.8–9)",
    sourceQuote: "Prospect, qualify and follow up leads across inbound/outbound channels.",
  },
  {
    id: "INT-E2",
    area: "E",
    statement: "Talk two parties toward a deal both can accept — the price, the terms, the dates.",
    ref: "lib/fixtures/catalog.ts events row \"Provider evaluation & selection; contract negotiation\" (O*NET 13-1121.00)",
    sourceQuote: "Evaluate providers; negotiate contracts within budget.",
  },
  {
    id: "INT-E3",
    area: "E",
    statement: "Take charge of a group's plan — set the dates, hand out the parts, keep everyone moving.",
    ref: "lib/fixtures/catalog.ts events row \"Program, agenda, budget & services planning\" (O*NET 13-1121.00)",
    sourceQuote:
      "Plan the program, agenda and budget; monitor with sponsors. · 1.B.1.e: \"Work involves managing, negotiating, marketing, or selling, typically in a business setting…\".",
  },

  // ── C · Conventional (1.B.1.f) ─────────────────────────────────────────────
  {
    id: "INT-C1",
    area: "C",
    statement: "Keep records exact — every entry in its right place, checked and filed on schedule.",
    ref: "lib/fixtures/catalog.ts records row \"Filing log / records of materials filed & removed\" (PSOC 4415 d)",
    sourceQuote: "Track what went in and what went out so nothing is ever \"lost in filing\".",
  },
  {
    id: "INT-C2",
    area: "C",
    statement: "Recheck the numbers until they balance, evenly, to the last cent.",
    ref: "lib/fixtures/catalog.ts book row \"Journalize transactions\" (TESDA Bookkeeping NC III)",
    sourceQuote: "\"Journal entries are prepared with 100% accuracy\".",
  },
  {
    id: "INT-C3",
    area: "C",
    statement: "Follow a set procedure step by step, the same dependable way every time.",
    ref: "research/onet-enrich/pulls/interests/interest-areas.json · 1.B.1.f Conventional",
    sourceQuote:
      "Work involves following procedures and regulations to organize information or data, typically in a business setting.",
  },
];

/**
 * Per-career O*NET interest_code, from the live pulls
 * `research/onet-enrich/pulls/interests/<code>.json` (2026-11-06, API key
 * discipline per `research/onet-enrich/README.md`).
 *
 * `codeSource`:
 *  - "own"   → the career's own O*NET anchor code (rowspec-anchored roles,
 *              21 careers, 18 distinct codes — see the enrich manifest);
 *  - "track-anchor" → the role records NO O*NET anchor (15 track-less
 *              careers per the enrich README) and its TRACK anchor's code
 *              stands in; no guessing for unmatched roles. Track anchors:
 *              IT → 15-1252.00 (Software Developers — swd's rowspec anchor,
 *              pulled 2026-11-05/06), Business → 13-1111.00 (Management
 *              Analysts — opsanalyst, the track's most general anchored
 *              analyst row), Office → 43-9061.00 (Office Clerks — clerk).
 */
export type CodeSource = "track-anchor" | "own";

export interface CareerInterestCodeEntry {
  careerId: string;
  interestCode: string;
  anchorCode: string;
  codeSource: CodeSource;
  /** Names the row the code was inherited from (track-anchor rows only). */
  note?: string;
}

export const CAREER_INTEREST_CODES: CareerInterestCodeEntry[] = [
  // ── IT (11) ────────────────────────────────────────────────────────────────
  { careerId: "swd", interestCode: "IC", anchorCode: "15-1252.00", codeSource: "track-anchor",
    note: "inherited from track anchor 15-1252.00 (Software Developers) — the role's own rowspec/it.ts anchor code" },
  { careerId: "qa", interestCode: "ICR", anchorCode: "15-1253.00", codeSource: "own" },
  { careerId: "ba", interestCode: "IC", anchorCode: "15-1252.00", codeSource: "track-anchor",
    note: "inherited from track anchor 15-1252.00 (swd's anchored code)" },
  { careerId: "its", interestCode: "IC", anchorCode: "15-1252.00", codeSource: "track-anchor",
    note: "inherited from track anchor 15-1252.00 (swd's anchored code)" },
  { careerId: "sysadmin", interestCode: "IC", anchorCode: "15-1252.00", codeSource: "track-anchor",
    note: "inherited from track anchor 15-1252.00 (swd's anchored code)" },
  { careerId: "dba", interestCode: "IC", anchorCode: "15-1252.00", codeSource: "track-anchor",
    note: "inherited from track anchor 15-1252.00 (swd's anchored code)" },
  { careerId: "cybersec", interestCode: "IC", anchorCode: "15-1252.00", codeSource: "track-anchor",
    note: "inherited from track anchor 15-1252.00 (swd's anchored code)" },
  { careerId: "webdev", interestCode: "CI", anchorCode: "15-1254.00", codeSource: "own" },
  { careerId: "digart", interestCode: "IC", anchorCode: "15-1252.00", codeSource: "track-anchor",
    note: "inherited from track anchor 15-1252.00 (swd's anchored code)" },
  { careerId: "da", interestCode: "IC", anchorCode: "15-1252.00", codeSource: "track-anchor",
    note: "inherited from track anchor 15-1252.00 (swd's anchored code)" },
  { careerId: "soc", interestCode: "CI", anchorCode: "15-1212.00", codeSource: "own" },

  // ── Business (9) ───────────────────────────────────────────────────────────
  { careerId: "hra", interestCode: "CIE", anchorCode: "13-1111.00", codeSource: "track-anchor",
    note: "inherited from track anchor 13-1111.00 (Management Analysts — opsanalyst)" },
  { careerId: "training", interestCode: "CIE", anchorCode: "13-1111.00", codeSource: "track-anchor",
    note: "inherited from track anchor 13-1111.00 (opsanalyst)" },
  { careerId: "mkt", interestCode: "CIE", anchorCode: "13-1111.00", codeSource: "track-anchor",
    note: "inherited from track anchor 13-1111.00 (opsanalyst)" },
  { careerId: "sales", interestCode: "CIE", anchorCode: "13-1111.00", codeSource: "track-anchor",
    note: "inherited from track anchor 13-1111.00 (opsanalyst)" },
  { careerId: "csr", interestCode: "CIE", anchorCode: "13-1111.00", codeSource: "track-anchor",
    note: "inherited from track anchor 13-1111.00 (opsanalyst)" },
  { careerId: "opsanalyst", interestCode: "CIE", anchorCode: "13-1111.00", codeSource: "own" },
  { careerId: "purch", interestCode: "CER", anchorCode: "13-1023.00", codeSource: "own" },
  { careerId: "ccqa", interestCode: "CIE", anchorCode: "13-1111.00", codeSource: "track-anchor",
    note: "inherited from track anchor 13-1111.00 (opsanalyst)" },
  { careerId: "events", interestCode: "ECS", anchorCode: "13-1121.00", codeSource: "own" },

  // ── Accounting (10 — all anchored, no inheritance) ─────────────────────────
  { careerId: "book", interestCode: "CE", anchorCode: "43-3031.00", codeSource: "own" },
  { careerId: "acctclerk", interestCode: "CE", anchorCode: "43-3031.00", codeSource: "own" },
  { careerId: "pay", interestCode: "CE", anchorCode: "43-3051.00", codeSource: "own" },
  { careerId: "fas", interestCode: "CE", anchorCode: "43-3031.00", codeSource: "own" },
  { careerId: "fin", interestCode: "CEI", anchorCode: "13-2051.00", codeSource: "own" },
  { careerId: "treasury", interestCode: "CE", anchorCode: "43-3071.00", codeSource: "own" },
  { careerId: "coll", interestCode: "CES", anchorCode: "43-3011.00", codeSource: "own" },
  { careerId: "credit", interestCode: "CES", anchorCode: "13-2072.00", codeSource: "own" },
  { careerId: "teller", interestCode: "CE", anchorCode: "43-3071.00", codeSource: "own" },
  { careerId: "audit", interestCode: "CEI", anchorCode: "13-2011.00", codeSource: "own" },

  // ── Office (6) ─────────────────────────────────────────────────────────────
  { careerId: "adminassoc", interestCode: "CES", anchorCode: "43-6014.00", codeSource: "own" },
  { careerId: "clerk", interestCode: "C", anchorCode: "43-9061.00", codeSource: "own" },
  { careerId: "encode", interestCode: "CR", anchorCode: "43-9021.00", codeSource: "own" },
  { careerId: "desk", interestCode: "C", anchorCode: "43-9061.00", codeSource: "track-anchor",
    note: "inherited from track anchor 43-9061.00 (Office Clerks — clerk)" },
  { careerId: "execsec", interestCode: "CES", anchorCode: "43-6011.00", codeSource: "own" },
  { careerId: "records", interestCode: "CES", anchorCode: "43-4171.00", codeSource: "own" },
];

export function interestCodeOf(careerId: string): CareerInterestCodeEntry | null {
  return CAREER_INTEREST_CODES.find((e) => e.careerId === careerId) ?? null;
}

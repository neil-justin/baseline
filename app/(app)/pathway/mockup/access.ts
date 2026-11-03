/**
 * mock/access.ts — DRAFT access-classification audit (mock realm only;
 * user rulings 2026-11-03: "provider" is OMITTED from the catalog in the
 * real wave, "exam-paid" allowed; only self-serve resources get suggested).
 *
 * Keyed by resource id. Classifications cite the fixture audit notes
 * (every URL fetched LIVE 2026-10-29) — user reviews before any real
 * wave; unclassified ids render the honest pending-audit chip.
 */
export type AccessState =
  | "direct"
  | "account"
  | "exam-paid"
  | "paid"
  | "unclassified";

/**
 * FORM — content-form classification (user rulings 2026-11-03:
 * "the suggested resource must have an option to learn from it"):
 *   taught    — the URL opens actual teachable content (course, tutorial, book)
 *   reference — readable material, no teaching flow (standards, glossaries)
 *   landing   — admin/index/search/marketing page: NO learnable content at
 *               this URL. Landing NEVER holds the suggested slot; it renders
 *               as a claim with its reason (the URL audit re-points these).
 */
export type FormState = "taught" | "reference" | "landing";

export const FORM: Record<string, FormState> = {
  /* da */
  "res-da-cert": "landing", // Coursera prof-cert landing — the course lives behind it
  "res-da-viz": "taught",
  "res-da-bna": "taught",
  "res-da-etl": "taught",
  "res-da-engineering-doc": "taught", // official Part I tutorial
  "res-da-esc-doc": "taught", // playbook Plays are activity guides
  "res-da-appdev": "taught",
  "res-da-aiethics": "taught",
  "res-da-ethics-doc": "reference",
  "res-da-breach-doc": "reference",
  "res-da-testing-doc": "landing", // TAU paths index
  "res-da-config-doc": "taught", // GitHub quickstart tutorial
  "res-da-stakeholder": "landing", // search listing
  /* qa */
  "res-qa-testing": "landing", // TAU home page
  "res-qa-testing-basics-doc": "landing", // TAU paths index
  "res-qa-istqb-ctfl": "landing", // cert overview — syllabus PDFs, no taught flow
  "res-qa-mdn-testing": "taught",
  "res-qa-owasp-wstg": "reference",
  "res-qa-istqb-glossary": "reference",
  "res-qa-jira-support": "reference",
  "res-qa-fcc-qa": "taught", // hands-on QA curriculum + free cert
  "res-qa-sre-books": "landing", // books index — chapters behind it
  "res-qa-atlassian-bugtracking": "reference",
  "res-qa-ibm-ba": "taught",
  "res-qa-google-bi": "landing", // prof-cert landing
  "res-qa-openlearn-comms": "taught",
  "res-qa-lhtl": "taught",
  /* book */
  "res-book-top-intro-bookkeeping": "taught",
  "res-book-top-journalizing": "taught",
  "res-book-top-posting": "taught",
  "res-book-top-trial-balance": "taught",
  "res-book-top-financial-reports": "taught",
  "res-book-top-internal-control": "taught",
  "res-book-top-workplace-comms": "taught",
  "res-book-top-receiving-comms": "taught",
  "res-book-top-digital-literacy-cat": "landing", // category page (fixture-flagged)
  "res-book-acca-intro": "taught",
  "res-book-acca-intermediate": "taught",
  "res-book-intuit-basics": "taught",
  "res-book-openstax-financial": "taught", // structured textbook + exercises
  "res-book-openstax-managerial": "reference", // internal-control chapter context
  "res-book-gcf-excel": "landing", // topic hub
};

export const ACCESS: Record<string, { access: AccessState; note?: string }> = {
  /* Coursera (Google) rows: "Enroll for free" + financial-aid audit route;
     the shareable credential itself is the paid tier */
  "res-da-cert": { access: "exam-paid", note: "Enroll for free / financial aid (audit route); shareable credential paid" },
  "res-da-viz": { access: "exam-paid", note: "Audit route free; shareable certificate paid" },
  "res-da-bna": { access: "exam-paid", note: "Audit route free; shareable certificate paid" },
  "res-da-appdev": { access: "exam-paid", note: "Audit route free; certificate paid" },
  "res-da-stakeholder": {
    access: "direct",
    note: "SEARCH LISTING page — the student picks a free course from the list (fixture 'listing-page convention')",
  },
  "res-da-etl": { access: "direct", note: "In-browser notebooks, fully free (Kaggle Learn)" },
  "res-da-engineering-doc": { access: "direct", note: "Official PostgreSQL docs, open access" },
  "res-da-esc-doc": { access: "direct", note: "The Plays are free (Atlassian, fixture-cited)" },
  "res-da-aiethics": { access: "account", note: "Free MOOC — signup required" },
  "res-da-ethics-doc": { access: "direct", note: "NPC publication, open access" },
  "res-da-breach-doc": { access: "direct", note: "NPC publication, open access" },
  "res-da-testing-doc": { access: "account", note: "TAU learning paths — free, signup required" },
  "res-da-config-doc": { access: "direct", note: "GitHub docs, open access" },

  /* ── Software QA Analyst (qa) — classified 2026-11-03 from the fixture
     audit notes (fetched LIVE 2026-10-29) ── */
  "res-qa-testing": {
    access: "account",
    note: "TAU is Applitools' free test-automation academy, certificates included (fixture-cited)",
  },
  "res-qa-testing-basics-doc": { access: "account", note: "TAU learning paths — free, signup required" },
  "res-qa-istqb-ctfl": {
    access: "exam-paid",
    note: "Syllabus + sample exams are free — the exam itself is paid (fixture-cited)",
  },
  "res-qa-mdn-testing": { access: "direct", note: "MDN curriculum, open access" },
  "res-qa-owasp-wstg": { access: "direct", note: "OWASP guide, open access" },
  "res-qa-istqb-glossary": { access: "direct", note: "Glossary, open access" },
  "res-qa-jira-support": { access: "direct", note: "Vendor docs, open access" },
  "res-qa-fcc-qa": { access: "account", note: "freeCodeCamp — free projects + free certification, signup required" },
  "res-qa-sre-books": { access: "direct", note: "Free web editions" },
  "res-qa-atlassian-bugtracking": { access: "direct", note: "Agile guide, open access" },
  "res-qa-ibm-ba": { access: "exam-paid", note: "Free audit; certificate paid" },
  "res-qa-google-bi": { access: "exam-paid", note: "Free-to-audit; ₱ paid tier = certificate" },
  "res-qa-openlearn-comms": {
    access: "direct",
    note: "Course page open in browser (redirects curl 403 — the fixture 'keep-with-flag' audit line)",
  },
  "res-qa-lhtl": { access: "exam-paid", note: "Audit/preview free; certificate paid" },

  /* ── Bookkeeper (book) — classified 2026-11-03 from the fixture audit
     notes; the TOP NC III modules run on e-tesda Moodle (signup, free) ── */
  "res-book-top-intro-bookkeeping": { access: "account", note: "TOP module — free, e-tesda signup" },
  "res-book-top-journalizing": { access: "account", note: "TOP module — free, e-tesda signup" },
  "res-book-top-posting": { access: "account", note: "TOP module — free, e-tesda signup" },
  "res-book-top-trial-balance": { access: "account", note: "TOP module — free, e-tesda signup" },
  "res-book-top-financial-reports": { access: "account", note: "TOP module — free, e-tesda signup" },
  "res-book-top-internal-control": { access: "account", note: "TOP module — free, e-tesda signup" },
  "res-book-top-workplace-comms": { access: "account", note: "TOP module — free, e-tesda signup" },
  "res-book-top-receiving-comms": { access: "account", note: "TOP module — free, e-tesda signup" },
  "res-book-top-digital-literacy-cat": { access: "account", note: "TOP category page — individual titles not itemized (fixture flag)" },
  "res-book-acca-intro": { access: "exam-paid", note: "ACCA-X free course; certificate paid" },
  "res-book-acca-intermediate": { access: "exam-paid", note: "ACCA-X free course; certificate paid" },
  "res-book-intuit-basics": { access: "exam-paid", note: "Enroll free / No-Certificate track confirmed (audit note)" },
  "res-book-openstax-financial": { access: "direct", note: "Open textbook, open access" },
  "res-book-openstax-managerial": { access: "direct", note: "Open textbook, open access" },
  "res-book-gcf-excel": { access: "account", note: "GCFGlobal tutorials — free, optional signup" },
};

/**
 * LEARN_LINES — the per-claim learn lines (user ruling 2026-11-03: the
 * student-facing "why would this resource teach me this skill" sentence;
 * audit receipts are NOT rendered). Keyed `resourceId::skillName` — one
 * authored sentence per claim (content proposals, user-edited; rows
 * without a draft render no line rather than a fake one).
 */
export const LEARN_LINES: Record<string, string> = {
  /* qa */
  "res-qa-mdn-testing::Software Testing":
    "Walks the cross-browser testing workflow end to end: test matrices, layout debugging, and automation across engines.",
  "res-qa-mdn-testing::Test Planning":
    "You'll structure test scenarios into a plan — levels, techniques, and what to execute first — from a live curriculum.",
  "res-qa-fcc-qa::Defect management":
    "Hands-on QA projects: find, reproduce and file bugs with the exact report fields an employer ticket queue runs on.",
  "res-qa-ibm-ba::Business Needs Analysis":
    "Walks elicitation and requirement structuring — turning a stakeholder conversation into a testable requirement set.",
  "res-qa-testing::Software Testing":
    "The foundation course: test design basics, bug reporting, and the automation-first thinking the QA walk expects.",
  "res-qa-lhtl::Customer Orientation · Digital Fluency · Learning Agility · Sense Making · Problem Solving (Enabling)":
    "Builds the learning-through-practice loop the enabling row prints: spaced practice, focus, and self-testing.",
  /* da */
  "res-da-viz::Data Visualization and Storytelling":
    "You'll build dashboards end to end — charts, story structure, and the visual arguments behind findings (Tableau).",
  "res-da-bna::Business Needs Analysis":
    "Structured thinking with a module on balancing stakeholder asks, then turning an ambiguous ask into a question plan.",
  "res-da-etl::ETL (extract-transform-load workflows)":
    "Hands-on cleaning: missing values, formats, scaling — the workbook runs the skill's own prepare-validate-record loop.",
  "res-da-engineering-doc::Data Engineering":
    "Relational thinking from scratch: schemas, SQL, views, transactions — the substratum the analyst reads and writes against.",
  "res-da-esc-doc::Enabling Skills & Competencies (ESC) — Collaboration, Communication, Digital Fluency, Learning Agility":
    "Team Playbook plays you can actually run with a team — shared decisions, communication cadence, working agreement.",
  "res-da-appdev::Applications Development":
    "Python querying/analysis basics — the light scripting muscle the FSC row prints.",
  "res-da-aiethics::Artificial Intelligence Ethics and Governance":
    "AI society-impact chapters — bias, transparency, accountability — the governance vocabulary the row mandates.",
  "res-da-config-doc::Configuration Tracking":
    "Git mechanics: commits, branches, history — the change log keeping analysis files reproducible.",
  /* book */
  "res-book-top-intro-bookkeeping::Journalize transactions":
    "TESDA's own NC III entry module — the journal cycle, source documents, and the 100%-accuracy discipline the unit prints.",
  "res-book-top-posting::Post transactions":
    "The official module: journal-to-ledger transfer with cross-checks — exactly the posting accuracy the unit prints.",
  "res-book-top-trial-balance::Prepare trial balance":
    "Balancing the ledger into a trial balance the TESDA way — extraction, footing, and error chasing.",
  "res-book-top-financial-reports::Prepare financial reports (manual)":
    "Hand-built financial statements from the ledger — the statement set and the accounting-equation checks that hold them together.",
  "res-book-top-internal-control::Review internal control system":
    "Walks the basic control checks — segregation of duties, verification steps, and the weak spots an NC III bookkeeper watches.",
  "res-book-top-receiving-comms::Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Self Management (Enabling)":
    "TESDA's workplace-communication module: receive, respond, relay — the enabling row's daily practice.",
};

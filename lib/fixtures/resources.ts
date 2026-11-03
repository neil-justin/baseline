import type { Resource } from "@/lib/types";

/**
 * Resource catalog — single typed catalog (schema: features.md §6.8), now
 * carrying the 2026-10-30 fixture conversion of the BLESSED role-spec pools
 * (per-track conversion blessing, map.md). Conventions:
 *
 *  - **Canon demo rows are locked**: `res-python-basics` (Neil's onboarding
 *    goal + the Python check), `res-qa-testing` (the money-shot check) and
 *    `res-qa-testing-basics-doc` ride every canon walk; they stay exactly as
 *    shipped. The demo trio's other original rows are kept too (Khan SQL,
 *    OWASP Top-ten, Ubuntu tutorials, Team Playbook, TAU learning paths,
 *    TOP CSS NC II) — flagged URLs re-verified, this pass's live fetches
 *    never replaced them silently.
 *  - **Pool-per-role**: every row's `careerId` scopes it; identical provider
 *    pages used by several roles appear as separate rows (per-Role pool
 *    convention, unchanged from rounds 10–12).
 *  - **Free rule**: courses/certs/docs/text resources must be free to
 *    access; where a Coursera row's free layer rides the audit/financial-aid
 *    route the ₱ certificate tier is called out in-row. TOP and Alison
 *    courses are free to study; their optional paid certificates are noted
 *    in-row. **Books**: purchase-labeled commercial books may be in the
 *    pool — they are carried in `PURCHASE_BOOKS` below (the locked
 *    `Resource` type has no book/price-peso slot and no peso price is
 *    printed by any source; inventing one would fabricate data — the
 *    judgment call rides the report to the user).
 *  - **§6.1 substance re-map (2026-11-03 overnight batch, user bar "a suggested
 *    resource must satisfy mostly/entirely the skill it feeds")**: `skillsAddressed`
 *    kept only where studying the row genuinely teaches the skill's printed
 *    substance (rowspec `what`/anchors judge). Git-handbook-class mappings CUT
 *    (437 rows unchanged; 696 → 536 ADDR entries; 73 rows ride empty ADDR as
 *    catalog-only); career×skill cells with no URL row are the honest
 *    declared-thin census (89 cells — 27 shipped gap rows untouched, NO new
 *    gap rows paper over cuts). Statutory/portal rows keep their
 *    keep-with-flag status; unrelated statute→craft mappings were cut. da
 *    pool untouched (13 rows). `pick: true` flags = the retired per-skill
 *    fallback winner (free → fewer hours → provider → id) over the URL
 *    pool — INERT data: the Q11v2 engine sort never reads `pick` (user
 *    retired authored picks; pathway/page.tsx cites the ruling).
 *  - **Ruled drops applied at fixture time**: sales' LinkedIn Learning
 *    entry and qa's Guru99 entry are NOT here (ruling 2026-10-29); the
 *    mkt/sales study.com citations were stripped; thin zones stay
 *    declared-thin as gap rows (`provider: "resource gap — unresolved"`,
 *    no url — gaps are reported, never papered over).
 *  - **Statutory keep-with-flag**: official portals (SSS/PhilHealth/Pag-IBIG/
 *    BIR/PS-PhilGEPS) stand only as labeled "Official portal — start here"
 *    placeholders; BIR eFPS tutorial pages are dead-in-copy while
 *    unreachable and never cited; RA 9184's caveat ("governs public
 *    procurement; private-sector practice borrows its discipline") travels
 *    with its resource wherever it renders (rulings 2026-10-29).
 *  - **OpenLearn keep-with-flag**: the adopted site-wide verdict line
 *    (2026-10-29: HTTP 403 to scripted fetch — Cloudflare bot-wall,
 *    `cf-mitigated: challenge`; URL NOT dead; title + free status
 *    web-index-verified; **keep**) applies to every open.edu row below.
 *  - Every URL was verified live by the spec session (HTTP 200 unless the
 *    comment records otherwise — 403/404/entrance states are carried as
 *    flags, never silently); no URL here was invented. Durations use the
 *    printed figure where the source prints one, else the fixture
 *    convention (doc 1–4 h; course 3–6 h; NC 12 h) — display-only.
 */

/** exists to satisfy lint on the section-comment style; real data below */
export type { Resource as CatalogResource } from "@/lib/types";

export const RESOURCES: Resource[] = [
  // == ── Associate Software Developer (roster 2.1 · id swd) ─────────────────
  // canon demo row (locked): Neil's onboarding goal + PYTHON_CHECK
  // Wave B audit (2026-11-03): access/form drafted per-row from each row's
  // own audit facts (Coursera audit routes → exam-paid · FCC signup →
  // account · tutorials/books → taught · vendor docs & spec texts →
  // reference · hub/index/search pages → landing). res-swd-linux-journey
  // stays UNVETTED on purpose: its 403 bot-wall verdict means the URL could
  // not be graded live this pass (unclassified = the picker guards it).
  // Learn lines are drafts (learn draft — user review pending). Coverage:
  // 8/8 vetted.
  {
    id: "res-python-basics",
    title: "Python basics course",
    provider: "Coursera",
    type: "course",
    cost: "free",
    // "Programming for Everybody (Getting Started with Python)" — UMich,
    // free to audit (re-verified live 2026-10-29)
    // audit (2026-11-03): Coursera audit route → exam-paid; course page.
    // Applications-Development winner via the tier-1 platform check
    // (PYTHON_CHECK pairs this resource id to the skill)
    url: "https://www.coursera.org/learn/python",
    durationHours: 25,
    skillsAddressed: ["Applications Development"],
    careerId: "swd",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Applications Development":
        "Michigan's Python-for-everybody course runs the write-run-check loop from your first function — the maintain-code-to-spec work the FSC cell prints, with the PYTHON_CHECK riding this exact resource.",
    },
    // learn draft — user review pending
  },
  // canon demo row (kept; Khan CDN blocks CLI re-checks — prior-round verified)
  {
    id: "res-swd-sql",
    title: "Intro to SQL for data analysis",
    provider: "Khan Academy",
    type: "course",
    cost: "free",
    // audit (2026-11-03): structured course, content open without an
    // account (prior-round verified; Khan CDN blocks CLI re-checks)
    url: "https://www.khanacademy.org/computing/computer-programming/sql",
    durationHours: 6,
    skillsAddressed: ["Data Design / SQL + data modeling"],
    careerId: "swd",
    form: "taught",
    access: "direct",
  },
  {
    id: "res-swd-support-doc",
    title: "Git handbook",
    provider: "Atlassian",
    type: "doc",
    cost: "free",
    // audit (2026-11-03): tutorial explainer page at the URL (ADDR retired
    // by the §6.1 re-map — catalog-only row); open access
    url: "https://www.atlassian.com/git/tutorials/what-is-version-control",
    durationHours: 2,
    skillsAddressed: [],
    careerId: "swd",
    form: "taught",
    access: "direct",
  },
  {
    id: "res-swd-agile-doc",
    title: "What is Agile? — Agile methodology basics",
    provider: "Atlassian",
    type: "doc",
    cost: "free",
    // audit (2026-11-03): readable methodology guide, no teaching flow at
    // this URL (the D2 mockup graded Atlassian guide roots reference)
    url: "https://www.atlassian.com/agile",
    durationHours: 2,
    skillsAddressed: ["Agile Software Development"],
    careerId: "swd",
    pick: true,
    form: "reference",
    access: "direct",
  },
  {
    id: "res-swd-secure-doc",
    title: "OWASP Top 10 — most critical web application security risks",
    provider: "OWASP Foundation",
    type: "doc",
    cost: "free",
    // spec pool cites the Top10:2025 canonical URL (200) — same project, updated home
    // audit (2026-11-03): readable risk standard = reference, open access
    url: "https://owasp.org/Top10/",
    durationHours: 4,
    skillsAddressed: ["Secure-coding practices"],
    careerId: "swd",
    form: "reference",
    access: "direct",
  },
  {
    id: "res-swd-linux-doc",
    title: "The Linux command line for beginners",
    provider: "Ubuntu tutorials",
    type: "doc",
    cost: "free",
    // audit (2026-11-03): step-by-step tutorial with live shell practice = taught
    url: "https://ubuntu.com/tutorials/command-line-for-beginners",
    durationHours: 2,
    skillsAddressed: ["Linux + web deployment basics"],
    careerId: "swd",
    form: "taught",
    access: "direct",
    learnNotes: {
      "Linux + web deployment basics":
        "Runs the command line from zero — files, users, permissions, packages — then deploys a real app to a Ubuntu server: the printed CWF list practiced inside a live shell.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-swd-bna-course",
    title: "Business analysis fundamentals (course listings)",
    provider: "Coursera",
    type: "course",
    cost: "free",
    // scaffolded search-route row kept (spec adds the exact IBM/MS courses below)
    // audit (2026-11-03): search listing = landing (listing-page convention)
    url: "https://www.coursera.org/search?query=business%20analysis",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "swd",
    form: "landing",
    access: "direct",
  },
  {
    id: "res-swd-enable-doc",
    title: "Team Playbook — free teamwork Plays",
    provider: "Atlassian",
    type: "doc",
    cost: "free",
    // audit (2026-11-03): the Plays are free activity guides (mockup
    // precedent for the identical da row) → taught/direct
    url: "https://www.atlassian.com/team-playbook",
    durationHours: 2,
    skillsAddressed: [
      "Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Self Management (Enabling Skills, Basic/Intermediate)",
    ],
    careerId: "swd",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Self Management (Enabling Skills, Basic/Intermediate)":
        "Free Atlassian Plays you can actually run with a team — health monitors, working agreements, and meeting practices — the enabling row's behaviors as activities.",
    },
    // learn draft — user review pending
  },
  // swd spec-pool additions (swd.md §Resources — all fetched 200, 2026-10-29)
  // Wave B audit (2026-11-03): genre classifications + winner learn lines.
  {
    id: "res-swd-fcc-csharp",
    title: "Foundational C# with Microsoft Certification",
    provider: "freeCodeCamp + Microsoft",
    type: "cert",
    cost: "free",
    // free full course + free verifiable certification in a mainstream
    // house-stack language; matches the printed L3 cell (develop basic
    // apps w/ secure features, routine tests, debugging)
    // audit (2026-11-03): FCC projects curriculum; free signup → account.
    // Applications-Development tier winner (credited taught resource)
    url: "https://www.freecodecamp.org/learn/foundational-c-sharp-with-microsoft/",
    durationHours: 30,
    skillsAddressed: ["Applications Development"],
    creditingBody: "freeCodeCamp · Microsoft",
    careerId: "swd",
    form: "taught",
    access: "account",
    learnNotes: {
      "Applications Development":
        "Microsoft's project-based C# curriculum runs the build-compile-debug loop hands-on — the develop-basic-apps work the FSC cell prints, ending in a verifiable certificate.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-swd-odin-foundations",
    title: "Foundations path — The Odin Project",
    provider: "The Odin Project",
    type: "course",
    cost: "free",
    // language-agnostic dev foundations (HTML/CSS/JS, Git, deployment)
    // around real projects — mirrors the support/improve-the-job shape
    // audit (2026-11-03): project-first open curriculum → taught/direct.
    // Applications-Support-and-Enhancement winner
    url: "https://www.theodinproject.com/paths/foundations",
    durationHours: 40,
    skillsAddressed: ["Applications Development", "Applications Support and Enhancement"],
    careerId: "swd",
    form: "taught",
    access: "direct",
    learnNotes: {
      "Applications Support and Enhancement":
        "The foundations path puts you inside real web projects — reading, running and extending a live codebase and debugging what breaks, the app-understanding this skill's day job runs on.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-swd-fcc-python-sci",
    title: "Scientific Computing with Python Certification",
    provider: "freeCodeCamp",
    type: "cert",
    cost: "free",
    // audit (2026-11-03): FCC projects curriculum; free signup → account
    url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/",
    durationHours: 60,
    skillsAddressed: ["Applications Development"],
    creditingBody: "freeCodeCamp",
    careerId: "swd",
    form: "taught",
    access: "account",
  },
  {
    id: "res-swd-progit",
    title: "Pro Git, 2nd Edition (free full web text)",
    provider: "Apress / git-scm.com",
    type: "doc",
    cost: "free",
    // free full text online; print edition = purchase (labeled) — the
    // version-control discipline the ASE map names
    // audit (2026-11-03): free book (taught per the content-shape ruling:
    // "course, tutorial, book"), open access
    url: "https://git-scm.com/book/en/v2",
    durationHours: 8,
    skillsAddressed: [],
    careerId: "swd",
    form: "taught",
    access: "direct",
  },
  {
    id: "res-swd-digitalocean-doc",
    title: "DigitalOcean Community Tutorials library",
    provider: "DigitalOcean",
    type: "doc",
    cost: "free",
    // text-based app-deployment and maintenance guides
    // audit (2026-11-03): searchable tutorials library index = landing
    url: "https://www.digitalocean.com/community/tutorials",
    durationHours: 2,
    skillsAddressed: ["Applications Support and Enhancement"],
    careerId: "swd",
    pick: true,
    form: "landing",
    access: "direct",
  },
  {
    id: "res-swd-mdn-learn",
    title: "MDN Web Docs — Learn web development",
    provider: "Mozilla",
    type: "doc",
    cost: "free",
    // audit (2026-11-03): guides hub/index at this URL = landing
    // (fail-closed; individual guides open one click deeper)
    url: "https://developer.mozilla.org/en-US/docs/Learn",
    durationHours: 4,
    skillsAddressed: ["Applications Support and Enhancement"],
    careerId: "swd",
    form: "landing",
    access: "direct",
  },
  {
    id: "res-swd-scrum-guide",
    title: "The Scrum Guide (official, free text)",
    provider: "Scrum.org / Schwaber & Sutherland",
    type: "doc",
    cost: "free",
    // the ceremonies the Agile FSC is practiced against; fully free
    // audit (2026-11-03): official spec text = reference, open access
    url: "https://scrumguides.org/scrum-guide.html",
    durationHours: 2,
    skillsAddressed: ["Agile Software Development"],
    careerId: "swd",
    form: "reference",
    access: "direct",
  },
  {
    id: "res-swd-agile-coursera",
    title: "Agile Software Development (course)",
    provider: "Coursera",
    type: "course",
    cost: "free",
    // free material via audit/preview; certificate paid / financial aid
    // audit (2026-11-03): audit route → exam-paid. Agile winner (only
    // vetted claim: the Atlassian/Scrum texts grade reference)
    url: "https://www.coursera.org/learn/agile-software-development",
    durationHours: 8,
    skillsAddressed: ["Agile Software Development"],
    careerId: "swd",
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Agile Software Development":
        "The course teaches the sprint disciplines themselves — backlog planning, ceremonies and incremental delivery — so each ceremony the row prints is something you've actually run.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-swd-sqlbolt",
    title: "SQLBolt — Learn SQL with simple, interactive exercises",
    provider: "SQLBolt",
    type: "course",
    cost: "free",
    // interactive JOIN/schema drills keyed to the printed JOIN task
    // audit (2026-11-03): interactive lesson flow, open access
    url: "https://sqlbolt.com/",
    durationHours: 4,
    skillsAddressed: ["Data Design / SQL + data modeling"],
    careerId: "swd",
    form: "taught",
    access: "direct",
  },
  {
    id: "res-swd-mysqltutorial",
    title: "MySQL Tutorial (text course)",
    provider: "MySQLTutorial.org",
    type: "doc",
    cost: "free",
    // verified substitute — `dev.mysql.com` pages 403 to scripted fetch
    // (SWD-V2: browser-facing link re-verifiable on request); DDL covered
    // audit (2026-11-03): step-by-step text course → taught/direct. SQL
    // winner (taught + direct + id A–Z ahead of the SQLBolt/Khan rows)
    url: "https://www.mysqltutorial.org/",
    durationHours: 6,
    skillsAddressed: ["Data Design / SQL + data modeling"],
    careerId: "swd",
    form: "taught",
    access: "direct",
    learnNotes: {
      "Data Design / SQL + data modeling":
        "A step-by-step SQL text course: queries, joins, and the schema/DDL work this skill's printed row names — normalized modeling through practiced statements.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-swd-pg-docs",
    title: "PostgreSQL Documentation (official)",
    provider: "PostgreSQL Global Development Group",
    type: "doc",
    cost: "free",
    // audit (2026-11-03): docs hub index = reference (the Part I tutorial
    // variant in the da pool is the taught companion)
    url: "https://www.postgresql.org/docs/",
    durationHours: 4,
    skillsAddressed: ["Data Design / SQL + data modeling"],
    careerId: "swd",
    pick: true,
    form: "reference",
    access: "direct",
  },
  {
    id: "res-swd-ibm-ba",
    title: "Introduction to Business Analysis",
    provider: "IBM (Coursera)",
    type: "course",
    cost: "free",
    // free-audit route; the course backs the printed L3 cell wording
    // ("Elicit and analyze…" — corrected to the L3 cell, 2026-10-29)
    // audit (2026-11-03): audit route → exam-paid. BNA winner for swd
    // (mockup learn line copied — identical course)
    url: "https://www.coursera.org/learn/introduction-to-business-analysis",
    durationHours: 10,
    skillsAddressed: ["Business Needs Analysis"],
    careerId: "swd",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Business Needs Analysis":
        "Structured elicitation: turning stakeholder conversations into testable requirement sets — the L3 cell's 'elicit and analyze' in course form.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-swd-ms-ba-fundamentals",
    title: "Business Analysis Fundamentals (Microsoft)",
    provider: "Microsoft (Coursera)",
    type: "course",
    cost: "free",
    // entry-level BA basics behind the "Validate user requirements…" tasks
    // audit (2026-11-03): audit route → exam-paid
    url: "https://www.coursera.org/learn/business-analysis-fundamentals",
    durationHours: 10,
    skillsAddressed: ["Business Needs Analysis"],
    careerId: "swd",
    form: "taught",
    access: "exam-paid",
  },
  {
    id: "res-swd-owasp-cheatsheets",
    title: "OWASP Cheat Sheet Series",
    provider: "OWASP Foundation",
    type: "doc",
    cost: "free",
    // actionable secure-coding drills at junior level
    // audit (2026-11-03): readable drills/answers = reference
    url: "https://cheatsheetseries.owasp.org/",
    durationHours: 4,
    skillsAddressed: ["Secure-coding practices"],
    careerId: "swd",
    pick: true,
    form: "reference",
    access: "direct",
  },
  {
    id: "res-swd-fcc-infosec",
    title: "Information Security Certification",
    provider: "freeCodeCamp",
    type: "cert",
    cost: "free",
    // audit (2026-11-03): FCC hands-on security projects; free signup →
    // account. Secure-coding winner (only vetted secure-coding claim)
    url: "https://www.freecodecamp.org/learn/information-security/",
    durationHours: 30,
    skillsAddressed: ["Secure-coding practices"],
    creditingBody: "freeCodeCamp",
    careerId: "swd",
    form: "taught",
    access: "account",
    learnNotes: {
      "Secure-coding practices":
        "Hands-on projects on authentication, and XSS/CSRF defenses teach you to spot and avoid the vulnerability classes the row prints — code you write yourself and fix.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-swd-tlcl-doc",
    title: "The Linux Command Line (free PDF via linuxcommand.org)",
    provider: "William Shotts / linuxcommand.org",
    type: "doc",
    cost: "free",
    // text companion for the exact command-line CWF list; print = purchase (labeled)
    // audit (2026-11-03): the book itself = taught (content-shape ruling:
    // "course, tutorial, book"); open access
    url: "http://linuxcommand.org/tlcl.php",
    durationHours: 8,
    skillsAddressed: ["Linux + web deployment basics"],
    careerId: "swd",
    form: "taught",
    access: "direct",
  },
  {
    id: "res-swd-linux-journey",
    title: "Linux Journey (free interactive text)",
    provider: "Linux Journey",
    type: "course",
    cost: "free",
    // 403 to scripted fetch (audit 2026-11-02, curl + browser UA) — flagged
    // keep-with-flag per the audit convention; browser-verify before defense.
    // Wave B (2026-11-03): NOT graded (form/access left unassigned) — the 403
    // bot-wall means the URL could not be graded live this pass; unvetted
    // until a browser check (fail-closed, the picker guards it)
    url: "https://linuxjourney.com/",
    durationHours: 6,
    skillsAddressed: ["Linux + web deployment basics"],
    careerId: "swd",
  },
  {
    id: "res-swd-ubuntu-server-docs",
    title: "Ubuntu Server documentation",
    provider: "Canonical",
    type: "doc",
    cost: "free",
    // audit (2026-11-03): docs hub index = reference (vendor docs)
    url: "https://ubuntu.com/server/docs",
    durationHours: 2,
    skillsAddressed: ["Linux + web deployment basics"],
    careerId: "swd",
    pick: true,
    form: "reference",
    access: "direct",
  },
  {
    id: "res-swd-openlearn-comms",
    title: "Effective communication in the workplace",
    provider: "Open University (OpenLearn)",
    type: "course",
    cost: "free",
    // OpenLearn verdict line (adopted 2026-10-29): HTTP 403 to scripted
    // fetch — site-wide Cloudflare bot-wall (`cf-mitigated: challenge`,
    // same under browser/Googlebot UAs); URL NOT dead; title + free status
    // web-index-verified ("Welcome to this free course… free"); KEEP.
    // audit (2026-11-03, mockup draft): course page open in browser →
    // taught/direct (with the keep-with-flag line)
    url: "https://www.open.edu/openlearn/money-business/effective-communication-the-workplace",
    durationHours: 3,
    skillsAddressed: [
      "Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Self Management (Enabling Skills, Basic/Intermediate)",
    ],
    careerId: "swd",
    form: "taught",
    access: "direct",
  },
  {
    id: "res-swd-lhtl",
    title: "Learning How to Learn: Powerful mental tools to help you master tough subjects",
    provider: "Deep Teaching Solutions (Coursera)",
    type: "course",
    cost: "free",
    // audit/preview free material; certificate paid
    // audit (2026-11-03): audit route → exam-paid (ADDR retired — catalog-only)
    url: "https://www.coursera.org/learn/learning-how-to-learn",
    durationHours: 4,
    skillsAddressed: [],
    careerId: "swd",
    form: "taught",
    access: "exam-paid",
  },

  // == ── Software QA Analyst (roster 2.2 · id qa) ───────────────────────────
  // canon money-shot row (locked) + TAU learning-paths scaffold (kept)
  // Wave B audit (2026-11-03): access/form copied verbatim from the D2
  // mockup access draft (user-ruled 2026-11-03); learn lines drafted from
  // each resource's actual content (learn draft — user review pending).
  // Coverage reds that stay (honest, not papered over):
  //  · "Quality Assurance / Quality Standards" — unvetted BY DESIGN: the
  //    Wave A regression pin prints the unvetted wait-state here; the user
  //    rules on each candidate (adviser-only skill for now).
  //  · "Applications Support and Enhancement" — no catalog row claims it:
  //    census-thin per the §6.1 ruling (verify-fixtures pins qa::ASE as an
  //    honest thin cell); filling requires a catalog-add decision (user
  //    ruling pending) — coverage test stays red, never a fabricated row.
  {
    id: "res-qa-testing",
    title: "Setting a foundation for successful test automation",
    provider: "Test Automation University",
    type: "course",
    cost: "free",
    // TAU is Applitools' free test-automation academy, certificates included
    // (verified live 2026-10-29)
    // audit (2026-11-03, mockup draft): free signup required → account
    url: "https://testautomationu.applitools.com/",
    durationHours: 4,
    skillsAddressed: ["Software Testing"],
    creditingBody: "Test Automation University (Applitools)",
    careerId: "qa",
    form: "landing", // TAU home page — the courses live behind it
    access: "account",
  },
  {
    id: "res-qa-testing-basics-doc",
    title: "Test Planning basics — writing test scenarios from requirements",
    provider: "Test Automation University",
    type: "doc",
    cost: "free",
    // audit (2026-11-03, mockup draft): paths index; free signup → account
    url: "https://testautomationu.applitools.com/learningpaths.html",
    durationHours: 3,
    skillsAddressed: ["Test Planning"],
    careerId: "qa",
    pick: true,
    form: "landing", // TAU paths index
    access: "account",
  },
  // qa spec-pool additions (qa.md §5 — Guru99 is RULED DROPPED, never added)
  {
    id: "res-qa-istqb-ctfl",
    title: "Certified Tester Foundation Level (CTFL v4.0) overview",
    provider: "ISTQB",
    type: "cert",
    cost: "free",
    // free official foundation syllabus behind the FSC's unit/system/UAT
    // vocabulary; syllabus + sample exams are free — the exam itself is paid
    // audit (2026-11-03, mockup draft): cert overview, no taught flow at this
    // URL; syllabus free, exam paid → exam-paid
    url: "https://www.istqb.org/certifications/certified-tester-foundation-level",
    durationHours: 20,
    skillsAddressed: ["Software Testing", "Test Planning", "Quality Assurance / Quality Standards"],
    creditingBody: "ISTQB",
    careerId: "qa",
    form: "landing",
    access: "exam-paid",
  },
  {
    id: "res-qa-mdn-testing",
    title: "Testing (cross-browser testing curriculum)",
    provider: "MDN Web Docs",
    type: "doc",
    cost: "free",
    // audit (2026-11-03, mockup draft): live teaching curriculum, open
    // access → taught/direct; the QA walk's Software Testing + Test Planning winner
    url: "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Cross_browser_testing",
    durationHours: 4,
    skillsAddressed: ["Software Testing", "Test Planning"],
    careerId: "qa",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Software Testing":
        "Walks the cross-browser testing workflow end to end: test matrices, layout debugging, and automation across engines.",
      "Test Planning":
        "You'll structure test scenarios into a plan — levels, techniques, and what to execute first — from a live curriculum.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-qa-owasp-wstg",
    title: "Web Security Testing Guide",
    provider: "OWASP Foundation",
    type: "doc",
    cost: "free",
    // audit (2026-11-03, mockup draft): readable guide, no teaching flow
    url: "https://owasp.org/www-project-web-security-testing-guide/",
    durationHours: 4,
    skillsAddressed: ["Software Testing"],
    careerId: "qa",
    form: "reference",
    access: "direct",
  },
  {
    id: "res-qa-istqb-glossary",
    title: "ISTQB Glossary",
    provider: "ISTQB",
    type: "doc",
    cost: "free",
    // canonical defect terminology (defect, severity, root cause)
    // audit (2026-11-03, mockup draft): glossary = reference, open access
    url: "https://glossary.istqb.org/",
    durationHours: 2,
    skillsAddressed: [],
    careerId: "qa",
    form: "reference",
    access: "direct",
  },
  {
    id: "res-qa-jira-support",
    title: "Jira Cloud support (official vendor docs)",
    provider: "Atlassian",
    type: "doc",
    cost: "free",
    // the dominant PH defect tracker's operating docs — free docs, product
    // free tier exists ("| Atlassian" title string honesty flag carried)
    // audit (2026-11-03, mockup draft): vendor docs = reference, open access
    url: "https://support.atlassian.com/jira-software-cloud/",
    durationHours: 2,
    skillsAddressed: ["Defect management"],
    careerId: "qa",
    form: "reference",
    access: "direct",
  },
  {
    id: "res-qa-fcc-qa",
    title: "Quality Assurance certification",
    provider: "freeCodeCamp",
    type: "cert",
    cost: "free",
    // free hands-on QA projects incl. defect reporting (SPA — title not
    // extractable from curl; page verified reachable)
    // audit layer (Wave B seed, 2026-11-03): hands-on QA curriculum the FCC
    // course shell lists as projects — form taught; freeCodeCamp = free
    // signup → access account (mockup access draft, D2 realm)
    url: "https://www.freecodecamp.org/learn/quality-assurance/",
    durationHours: 30,
    skillsAddressed: ["Defect management"],
    creditingBody: "freeCodeCamp",
    careerId: "qa",
    form: "taught",
    access: "account",
    learnNotes: {
      "Defect management":
        "Hands-on QA projects: find, reproduce and file bugs with the exact report fields an employer ticket queue runs on.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-qa-sre-books",
    title: "Google SRE books (free web editions)",
    provider: "Google",
    type: "doc",
    cost: "free",
    // free chapters on quality metrics/SLOs, monitoring, postmortem practice
    // audit (2026-11-03, mockup draft): books index — chapters live behind it
    url: "https://sre.google/books/",
    durationHours: 4,
    skillsAddressed: ["Quality Assurance / Quality Standards"],
    careerId: "qa",
    pick: true,
    form: "landing",
    access: "direct",
  },
  {
    id: "res-qa-atlassian-bugtracking",
    title: "Bug tracking in agile software development",
    provider: "Atlassian",
    type: "doc",
    cost: "free",
    // Atlassian reorganized the agile guide (audit 2026-11-02: the
    // sub-pages bugs/bug-tracking 404 — consolidated into this root, live)
    // audit (2026-11-03, mockup draft): agile guide = reference, open access
    url: "https://www.atlassian.com/agile/software-development",
    durationHours: 2,
    skillsAddressed: ["Defect management"],
    careerId: "qa",
    pick: true,
    form: "reference",
    access: "direct",
  },
  {
    id: "res-qa-ibm-ba",
    title: "Introduction to Business Analysis (IBM)",
    provider: "Coursera",
    type: "course",
    cost: "free",
    // free audit; backs the elicitation layer the BNA row prints
    // audit (2026-11-03, mockup draft): audit-route free, certificate paid
    url: "https://www.coursera.org/learn/introduction-to-business-analysis",
    durationHours: 10,
    skillsAddressed: ["Business Needs Analysis"],
    careerId: "qa",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Business Needs Analysis":
        "Walks elicitation and requirement structuring — turning a stakeholder conversation into a testable requirement set.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-qa-google-bi",
    title: "Google Business Intelligence Professional Certificate",
    provider: "Coursera (Google)",
    type: "cert",
    cost: "free",
    // free-to-audit; ₱ paid tier = certificate
    // audit (2026-11-03, mockup draft): prof-cert landing; ₱ tier = certificate
    url: "https://www.coursera.org/professional-certificates/google-business-intelligence",
    durationHours: 30,
    skillsAddressed: [],
    careerId: "qa",
    form: "landing",
    access: "exam-paid",
  },
  {
    id: "res-qa-openlearn-comms",
    title: "Effective communication in the workplace",
    provider: "Open University (OpenLearn)",
    type: "course",
    cost: "free",
    // adopted 403 verdict line (keep-with-flag) — see the swd OpenLearn row
    // audit (2026-11-03, mockup draft): course page open in browser
    // (curl 403 — the keep-with-flag line); no ADDR claims, no learn line
    url: "https://www.open.edu/openlearn/money-business/effective-communication-the-workplace",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "qa",
    form: "taught",
    access: "direct",
  },
  {
    id: "res-qa-lhtl",
    title: "Learning How to Learn",
    provider: "Deep Teaching Solutions (Coursera)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, mockup draft): audit/preview free, certificate paid
    url: "https://www.coursera.org/learn/learning-how-to-learn",
    durationHours: 4,
    skillsAddressed: ["Customer Orientation · Digital Fluency · Learning Agility · Sense Making · Problem Solving (Enabling)"],
    careerId: "qa",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Customer Orientation · Digital Fluency · Learning Agility · Sense Making · Problem Solving (Enabling)":
        "Builds the learning-through-practice loop the enabling row prints: spaced practice, focus, and self-testing.",
    },
    // learn draft — user review pending
  },

  // == ── IT Support Engineer (roster 2.4 · id its) — kept TOP row + spec additions
  // Wave B audit (2026-11-03): access/form drafted from each row's own audit
  // facts (Coursera audit routes → exam-paid · NetAcad signup → account ·
  // vendor docs & MITRE KB → reference · TOP root/category pages and
  // prof-cert landings → landing). THREE rows whose URL could not open
  // teachable content (prof-cert landing · docs hub · readable-at-the-URL
  // reference claims) were RE-POINTED to the live-verified taught course
  // page of the same skill (fresh "fetched LIVE 2026-11-03" notes in-row;
  // ids/ADDR untouched). res-its-mitre-attack's reference claim was
  // re-pointed to the taught incident-response course the coverage bar
  // demands (the MITRE KB stays as reference claims in the cybersec/soc
  // pools). Learn lines are drafts (learn draft — user review pending).
  // Coverage: 7/7 vetted.
  {
    id: "res-its-css-nc",
    title: "Computer Systems Servicing NC II — self-paced",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // TOP course category (Electrical/Electronics CSS NC II); ITS-V4 flags
    // the deep-link re-verify per skill at print-copy time
    // audit (2026-11-03): TOP category listing = landing (fail-closed —
    // the modules live behind it); e-tesda signup → account
    url: "https://e-tesda.gov.ph/course/index.php?categoryid=16",
    durationHours: 12,
    skillsAddressed: ["Infrastructure Deployment"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "its",
    form: "landing",
    access: "account",
  },
  {
    id: "res-its-google-it-support",
    title: "Technical Support Fundamentals (Google IT Support cert course 1)",
    provider: "Coursera (Google)",
    // fetched LIVE 2026-11-03 (RE-POINTED, Wave B audit): the old row
    // pointed at the Google IT Support prof-cert landing (same genre the D2
    // mockup graded "landing — the course lives behind it"; audit note
    // 2026-10-29: "material free via audit; certificate not required to
    // learn"). RE-POINTED to the taught course-1 page (fetched LIVE
    // 2026-11-03: "Enroll for free", 6 modules / ~20 h — hardware/OS install,
    // software install-update-remove, networking, troubleshooting). The
    // monitor-maintain-patch substance of the row prints directly.
    // Id/ADDR unchanged; ₱ paid tier: shareable certificate.
    type: "course",
    cost: "free",
    url: "https://www.coursera.org/learn/technical-support-fundamentals",
    durationHours: 20,
    skillsAddressed: ["Infrastructure Support"],
    careerId: "its",
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Infrastructure Support":
        "Google's support fundamentals teaches the machines you'll keep alive — hardware, OS installs, software install/update/remove and troubleshooting — the monitor-maintain-patch day job in course form.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-its-top-landing",
    title: "TESDA Online Program (TOP) — official PH e-learning",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // landing page (200) — the PH-credential-friendly option behind the
    // entry route; ITS-V4 flag: re-verify per-skill deep-links before print copy
    // audit (2026-11-03): TOP root page = landing; e-tesda signup → account
    url: "https://e-tesda.gov.ph/",
    durationHours: 4,
    skillsAddressed: ["Infrastructure Support"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "its",
    pick: true,
    form: "landing",
    access: "account",
  },
  {
    id: "res-its-windows-server-docs",
    title: "System Administration and IT Infrastructure Services (Google IT Support cert course 3)",
    provider: "Coursera (Google)",
    // fetched LIVE 2026-11-03 (RE-POINTED, Wave B audit): the old row was
    // the Windows Server documentation hub (vendor-docs index at the URL —
    // no teaching flow; the docs' only facts live behind links). RE-POINTED
    // to the taught "System Administration and IT Infrastructure Services"
    // course (fetched LIVE 2026-11-03: "Enroll for free", 6 modules / ~20 h
    // — user/hardware provisioning, managing servers and services on
    // Linux/Windows, change management — supervised-rollout practice at
    // entry level). Id/ADDR unchanged.
    type: "course",
    cost: "free",
    url: "https://www.coursera.org/learn/system-administration-it-infrastructure-services",
    durationHours: 20,
    skillsAddressed: ["Infrastructure Deployment"],
    careerId: "its",
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Infrastructure Deployment":
        "The sysadmin course walks provisioning, server setup and service rollout on Linux and Windows — plus the change-management discipline a supervised rollout runs on.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-its-ubuntu-server-docs",
    title: "Ubuntu Server documentation",
    provider: "Canonical",
    type: "doc",
    cost: "free",
    // audit (2026-11-03): docs hub index = reference (vendor docs)
    url: "https://ubuntu.com/server/docs",
    durationHours: 2,
    skillsAddressed: ["Infrastructure Deployment"],
    careerId: "its",
    pick: true,
    form: "reference",
    access: "direct",
  },
  {
    id: "res-its-netacad-networking-basics",
    title: "Networking Basics",
    provider: "Cisco Networking Academy",
    type: "course",
    cost: "free",
    // ~22 h self-paced; free certificate of completion
    // audit (2026-11-03): NetAcad free course, signup → account
    url: "https://www.netacad.com/courses/networking-basics",
    durationHours: 22,
    skillsAddressed: ["Network Administration and Maintenance", "Network Configuration"],
    creditingBody: "Cisco Networking Academy",
    careerId: "its",
    form: "taught",
    access: "account",
  },
  {
    id: "res-its-netacad-addressing",
    title: "Network Addressing and Basic Troubleshooting",
    provider: "Cisco Networking Academy",
    type: "course",
    cost: "free",
    // audit (2026-11-03): NetAcad free course, signup → account. Network
    // winner for both network skills (taught + credited + id A–Z)
    url: "https://www.netacad.com/courses/network-addressing-and-basic-troubleshooting",
    durationHours: 20,
    skillsAddressed: ["Network Configuration", "Network Administration and Maintenance"],
    creditingBody: "Cisco Networking Academy",
    careerId: "its",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Network Configuration":
        "Cisco's hands-on course runs IP addressing and device configuration drills — the configure-per-runbook practice this skill's row prints.",
      "Network Administration and Maintenance":
        "The same labs carry the daily upkeep half — plan, verify and troubleshoot the LAN so keep-it-running work is something you've practiced.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-its-mitre-attack",
    title: "Stages of Incident Response (Infosec)",
    provider: "Coursera (Infosec)",
    // fetched LIVE 2026-11-03 (RE-POINTED, Wave B audit): the old row was
    // the MITRE ATT&CK Knowledge Base ("free reference for recognizing/
    // reporting incident types before escalation" — a readable attack
    // matrix, no teaching flow; fetched LIVE 2026-10-29). RE-POINTED to
    // Infosec's taught "Stages of Incident Response" (fetched LIVE
    // 2026-11-03: "Enroll for free", 7 modules / ~5 h, beginner — the
    // incident-response phases from detection through escalation, the
    // escalation-path vocabulary the row prints). The MITRE KB keeps its
    // reference claims in the cybersec/soc pools. Id/ADDR unchanged.
    type: "course",
    cost: "free",
    url: "https://www.coursera.org/learn/stages-of-incident-response",
    durationHours: 5,
    skillsAddressed: ["Cyber and Data Breach Incident Management"],
    careerId: "its",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Cyber and Data Breach Incident Management":
        "The stages course walks the incident-response phases — detect, categorize, escalate, hand off — so the escalation path when incidents hit security is something you've rehearsed.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-its-atlassian-incident",
    title: "ITIL 4: Management Practices (Logical Operations)",
    provider: "Coursera (Logical Operations)",
    // fetched LIVE 2026-11-03 (RE-POINTED, Wave B audit): the old row was
    // Atlassian's incident-management guide (readable practice guide — the
    // D2 mockup graded the Atlassian guide genre reference; fetched LIVE
    // 2026-10-29). RE-POINTED to the taught ITIL 4 practices course (fetched
    // LIVE 2026-11-03: "Enroll for free", 3 modules / ~6 h — establishes
    // service level agreements and runs incident/problem management inside
    // target windows; the SLA response-closure discipline the row prints).
    // Id/ADDR unchanged.
    type: "course",
    cost: "free",
    url: "https://www.coursera.org/learn/itil-4-management-practices-lo093054",
    durationHours: 6,
    skillsAddressed: ["Service Level Management"],
    careerId: "its",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Service Level Management":
        "The ITIL practices course teaches setting service levels and running service desks against them — respond/closure inside target windows, with the metrics logged.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-its-openlearn-comms",
    title: "Effective communication in the workplace",
    provider: "Open University (OpenLearn)",
    type: "course",
    cost: "free",
    // adopted 403 verdict line (keep-with-flag)
    // audit (2026-11-03, mockup draft): course page open in browser →
    // taught/direct (with the keep-with-flag line)
    url: "https://www.open.edu/openlearn/money-business/effective-communication-the-workplace",
    durationHours: 3,
    skillsAddressed: ["Customer Orientation · Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)"],
    careerId: "its",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Customer Orientation · Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)":
        "The free OU communication course rehearses user-facing service talk — receiving requests plainly, keeping collaboration and self-management under pressure (the service-desk behavior layer).",
    },
    // learn draft — user review pending
  },

  // == ── Business Analyst, IT (roster 2.3 · id ba) — ba.md §Resources ───────
  {
    id: "res-ba-ibm-intro-ba",
    title: "Introduction to Business Analysis",
    provider: "IBM (Coursera)",
    type: "course",
    cost: "free",
    // BABOK-aligned free-audit intro (elicitation, stakeholder engagement,
    // gap analysis); backs the printed L3 cell ("Elicit and analyze …")
    url: "https://www.coursera.org/learn/introduction-to-business-analysis",
    durationHours: 10,
    skillsAddressed: ["Requirements Analysis", "Business Needs Analysis"],
    careerId: "ba",
    pick: true,
  },
  {
    id: "res-ba-coursera-guided-project",
    title: "Business Analysis & Process Management (Guided Project)",
    provider: "Coursera",
    type: "course",
    cost: "free",
    // 2-hour hands-on process-analysis drill; guided projects sit inside
    // Coursera's paid plan by default — verify the free-entry state before
    // recommending (BA-V4 ruled needs-user-at-enroll)
    url: "https://www.coursera.org/projects/business-analysis-process-management",
    durationHours: 2,
    skillsAddressed: ["Requirements Analysis", "Process modeling (flow diagrams, use cases)"],
    careerId: "ba",
    pick: true,
  },
  {
    id: "res-ba-openlearn-comms",
    title: "Effective communication in the workplace",
    provider: "Open University (OpenLearn)",
    type: "course",
    cost: "free",
    // adopted 403 verdict line (keep-with-flag); drilled stakeholder
    // interviews + cross-department work
    url: "https://www.open.edu/openlearn/money-business/effective-communication-the-workplace",
    durationHours: 3,
    skillsAddressed: ["Team Enablement"],
    careerId: "ba",
    pick: true,
  },
  {
    id: "res-ba-ms-ba-fundamentals",
    title: "Business Analysis Fundamentals (Microsoft)",
    provider: "Microsoft (Coursera)",
    type: "course",
    cost: "free",
    // requirements → documentation → communication
    url: "https://www.coursera.org/learn/business-analysis-fundamentals",
    durationHours: 10,
    skillsAddressed: ["Requirements Specification"],
    careerId: "ba",
  },
  {
    id: "res-ba-figma",
    title: "Figma Learn — resource library (official tutorials)",
    provider: "Figma",
    type: "doc",
    cost: "free",
    // low-fidelity prototyping/wireframing + FigJam diagram tutorials
    url: "https://www.figma.com/resource-library/",
    durationHours: 3,
    skillsAddressed: ["Requirements Specification"],
    careerId: "ba",
    pick: true,
  },
  {
    id: "res-ba-atlassian-bugs",
    title: "Bug tracking in agile software development",
    provider: "Atlassian",
    type: "doc",
    cost: "free",
    // UAT-adjacent defect/feedback flow language
    // 2026-11-02 audit: the /bugs sub-page 404s — same consolidation as the
    // bug-tracking doc; the live root covers both
    url: "https://www.atlassian.com/agile/software-development",
    durationHours: 2,
    skillsAddressed: [],
    careerId: "ba",
  },
  {
    id: "res-ba-lhtl",
    title: "Learning How to Learn",
    provider: "Deep Teaching Solutions (Coursera)",
    type: "course",
    cost: "free",
    // "eagerness to learn from subject matter experts" behavior support
    url: "https://www.coursera.org/learn/learning-how-to-learn",
    durationHours: 4,
    skillsAddressed: [],
    careerId: "ba",
  },

  // == ── Network / Systems Administrator (2.5 · id sysadmin) ────────────────
  {
    id: "res-sysadmin-edx-linux",
    title: "Introduction to Linux (The Linux Foundation)",
    provider: "The Linux Foundation (edX)",
    type: "course",
    cost: "free",
    // free canonical Linux-systems foundations; verified certificate paid
    url: "https://www.edx.org/learn/linux/the-linux-foundation-introduction-to-linux",
    durationHours: 60,
    skillsAddressed: ["Systems administration (user groups, upgrades, backups)"],
    careerId: "sysadmin",
  },
  {
    id: "res-sysadmin-ubuntu-server-docs",
    title: "Ubuntu Server documentation",
    provider: "Canonical",
    type: "doc",
    cost: "free",
    url: "https://ubuntu.com/server/docs",
    durationHours: 2,
    skillsAddressed: ["Systems administration (user groups, upgrades, backups)"],
    careerId: "sysadmin",
    pick: true,
  },
  {
    id: "res-sysadmin-tlcl-doc",
    title: "The Linux Command Line (free PDF)",
    provider: "William Shotts / linuxcommand.org",
    type: "doc",
    cost: "free",
    // free text; print = purchase (labeled)
    url: "http://linuxcommand.org/tlcl.php",
    durationHours: 8,
    skillsAddressed: ["Systems administration (user groups, upgrades, backups)"],
    careerId: "sysadmin",
  },
  {
    id: "res-sysadmin-linux-journey",
    title: "Linux Journey (free short modules)",
    provider: "Linux Journey",
    type: "course",
    cost: "free",
    url: "https://linuxjourney.com/",
    durationHours: 6,
    skillsAddressed: ["Systems administration (user groups, upgrades, backups)"],
    careerId: "sysadmin",
  },
  {
    id: "res-sysadmin-netacad-networking-basics",
    title: "Networking Basics",
    provider: "Cisco Networking Academy",
    type: "course",
    cost: "free",
    url: "https://www.netacad.com/courses/networking-basics",
    durationHours: 22,
    skillsAddressed: ["Network Administration and Maintenance"],
    creditingBody: "Cisco Networking Academy",
    careerId: "sysadmin",
  },
  {
    id: "res-sysadmin-netacad-addressing",
    title: "Network Addressing and Basic Troubleshooting",
    provider: "Cisco Networking Academy",
    type: "course",
    cost: "free",
    url: "https://www.netacad.com/courses/network-addressing-and-basic-troubleshooting",
    durationHours: 20,
    skillsAddressed: ["Network Administration and Maintenance"],
    creditingBody: "Cisco Networking Academy",
    careerId: "sysadmin",
    pick: true,
  },
  {
    id: "res-sysadmin-google-it-support",
    title: "Google IT Support Professional Certificate",
    provider: "Google (Coursera)",
    type: "cert",
    cost: "free",
    url: "https://www.coursera.org/professional-certificates/google-it-support",
    durationHours: 60,
    skillsAddressed: ["Infrastructure Support", "↳ CWF sub-row: Resolve system-related incidents"],
    careerId: "sysadmin",
    pick: true,
  },
  {
    id: "res-sysadmin-top-landing",
    title: "TESDA Online Program (TOP) — official PH e-learning",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    url: "https://e-tesda.gov.ph/",
    durationHours: 4,
    skillsAddressed: ["Infrastructure Support"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "sysadmin",
    pick: true,
  },
  {
    id: "res-sysadmin-windows-server-docs",
    title: "Windows Server documentation",
    provider: "Microsoft Learn",
    type: "doc",
    cost: "free",
    // directory/service integration context (the ITAM/System-Integration
    // thin-zone backing docs — SYS-V1)
    url: "https://learn.microsoft.com/en-us/windows-server/",
    durationHours: 4,
    skillsAddressed: [],
    careerId: "sysadmin",
  },
  {
    id: "res-sysadmin-ms-learn-ad-ds",
    title: "Active Directory Domain Services (learning path)",
    provider: "Microsoft Learn",
    type: "doc",
    cost: "free",
    // access-control administration (users/groups/GPO)
    url: "https://learn.microsoft.com/en-us/training/paths/active-directory-domain-services",
    durationHours: 10,
    skillsAddressed: ["Security Administration"],
    careerId: "sysadmin",
    pick: true,
  },
  {
    id: "res-sysadmin-owasp-cheatsheets",
    title: "OWASP Cheat Sheet Series",
    provider: "OWASP Foundation",
    type: "doc",
    cost: "free",
    // hardening drills behind patch/threat protection
    url: "https://cheatsheetseries.owasp.org/",
    durationHours: 4,
    skillsAddressed: [],
    careerId: "sysadmin",
  },
  {
    id: "res-sysadmin-progit",
    title: "Pro Git, 2nd Edition (free full web text)",
    provider: "Apress / git-scm.com",
    type: "doc",
    cost: "free",
    // change-accounting standard behind Configuration Tracking
    url: "https://git-scm.com/book/en/v2",
    durationHours: 8,
    skillsAddressed: [],
    careerId: "sysadmin",
  },
  {
    id: "res-sysadmin-semver",
    title: "Semantic Versioning 2.0.0 (official spec)",
    provider: "semver.org",
    type: "doc",
    cost: "free",
    url: "https://semver.org/",
    durationHours: 1,
    skillsAddressed: [],
    careerId: "sysadmin",
  },
  {
    id: "res-sysadmin-openlearn-comms",
    title: "Effective communication in the workplace",
    provider: "Open University (OpenLearn)",
    type: "course",
    cost: "free",
    // adopted 403 verdict line (keep-with-flag)
    url: "https://www.open.edu/openlearn/money-business/effective-communication-the-workplace",
    durationHours: 3,
    skillsAddressed: ["Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)"],
    careerId: "sysadmin",
    pick: true,
  },
  // SYS-V1 declared thin zones (kept declared, no forced search)
  {
    id: "res-sysadmin-gap-itam",
    title: "IT Asset Management — dedicated free course",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["IT Asset Management"],
    careerId: "sysadmin",
  },
  {
    id: "res-sysadmin-gap-sysint",
    title: "System Integration — domain-specific primer",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["System Integration"],
    careerId: "sysadmin",
  },

  // == ── Database Administrator (2.6 · id dba) ──────────────────────────────
  {
    id: "res-dba-mysql-refman",
    title: "MySQL 8.0 Reference Manual (official PDF)",
    provider: "Oracle / MySQL",
    type: "doc",
    cost: "free",
    // DBA-V1: dev.mysql.com/doc pages 403 to scripted fetch (public in
    // browsers) — this verified official PDF is the cited substitute
    url: "https://downloads.mysql.com/docs/refman-8.0-en.pdf",
    durationHours: 6,
    skillsAddressed: [
      "Database Administration",
      "↳ CWF sub-row: Oversee database administration",
      "↳ CWF sub-row: Optimize database performance",
    ],
    careerId: "dba",
    pick: true,
  },
  {
    id: "res-dba-sqlserver-docs",
    title: "SQL Server technical documentation",
    provider: "Microsoft Learn",
    type: "doc",
    cost: "free",
    url: "https://learn.microsoft.com/en-us/sql/sql-server/",
    durationHours: 4,
    skillsAddressed: ["Database Administration", "↳ CWF sub-row: Design and develop new database"],
    careerId: "dba",
    pick: true,
  },
  {
    id: "res-dba-postgresql-docs",
    title: "PostgreSQL Documentation (official)",
    provider: "PostgreSQL Global Development Group",
    type: "doc",
    cost: "free",
    url: "https://www.postgresql.org/docs/",
    durationHours: 4,
    skillsAddressed: ["Database Administration", "Data Engineering"],
    careerId: "dba",
    pick: true,
  },
  {
    id: "res-dba-oracle-admin-guide",
    title: "Oracle Database 19c Administrator's Guide",
    provider: "Oracle",
    type: "doc",
    cost: "free",
    // scripted backup/automation + SI-organization procedures
    url: "https://docs.oracle.com/en/database/oracle/oracle-database/19/admin/",
    durationHours: 6,
    skillsAddressed: ["Database Administration", "↳ CWF sub-row: Resolve database incidents"],
    careerId: "dba",
    pick: true,
  },
  {
    id: "res-dba-fcc-relational",
    title: "Relational Database Certification",
    provider: "freeCodeCamp",
    type: "cert",
    cost: "free",
    // Bash/PostgreSQL/ETL production-grade intro drills; fully free
    url: "https://www.freecodecamp.org/learn/relational-database/",
    durationHours: 45,
    skillsAddressed: ["Data Engineering"],
    creditingBody: "freeCodeCamp",
    careerId: "dba",
  },
  {
    id: "res-dba-mongodb-manual",
    title: "MongoDB Manual",
    provider: "MongoDB",
    type: "doc",
    cost: "free",
    // import/export and migration tooling (the overview names MongoDB)
    url: "https://www.mongodb.com/docs/manual/",
    durationHours: 4,
    skillsAddressed: ["Data Migration"],
    careerId: "dba",
  },
  {
    id: "res-dba-mariadb-docs",
    title: "MariaDB documentation",
    provider: "MariaDB Foundation",
    type: "doc",
    cost: "free",
    // cross-engine migrate/upgrade guides common in PH SME stacks
    url: "https://mariadb.com/kb/en/documentation/",
    durationHours: 4,
    skillsAddressed: ["Data Migration"],
    careerId: "dba",
    pick: true,
  },
  {
    id: "res-dba-owasp-db-cheatsheet",
    title: "Database Security Cheat Sheet",
    provider: "OWASP Foundation",
    type: "doc",
    cost: "free",
    // privileges/permissions guidance mirrors the security CWF
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Database_Security_Cheat_Sheet.html",
    durationHours: 3,
    skillsAddressed: ["Database security controls"],
    careerId: "dba",
    pick: true,
  },
  {
    id: "res-dba-ubuntu-server-docs",
    title: "Ubuntu Server documentation",
    provider: "Canonical",
    type: "doc",
    cost: "free",
    // host-level OS context ("understand where the database lives")
    url: "https://ubuntu.com/server/docs",
    durationHours: 2,
    skillsAddressed: ["Infrastructure Support"],
    careerId: "dba",
    pick: true,
  },
  {
    id: "res-dba-atlassian-incident",
    title: "Incident management (guide)",
    provider: "Atlassian",
    type: "doc",
    cost: "free",
    url: "https://www.atlassian.com/incident-management",
    durationHours: 2,
    skillsAddressed: ["Problem Management"],
    careerId: "dba",
    pick: true,
  },
  {
    id: "res-dba-openlearn-comms",
    title: "Effective communication in the workplace",
    provider: "Open University (OpenLearn)",
    type: "course",
    cost: "free",
    // adopted 403 verdict line (keep-with-flag); standby-rotation comms
    url: "https://www.open.edu/openlearn/money-business/effective-communication-the-workplace",
    durationHours: 3,
    skillsAddressed: ["Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)"],
    careerId: "dba",
    pick: true,
  },

  // == ── Security Analyst (2.7 · id cybersec) ───────────────────────────────
  {
    id: "res-cybersec-netacad-intro-cyber",
    title: "Introduction to Cybersecurity",
    provider: "Cisco Networking Academy",
    type: "course",
    cost: "free",
    // ~6 h free beginner course; certificate of completion
    url: "https://www.netacad.com/courses/introduction-to-cybersecurity",
    durationHours: 6,
    skillsAddressed: ["Threat analysis / monitoring"],
    creditingBody: "Cisco Networking Academy",
    careerId: "cybersec",
  },
  {
    id: "res-cybersec-skillsbuild",
    title: "IBM SkillsBuild — Cybersecurity Fundamentals courses",
    provider: "IBM SkillsBuild",
    type: "course",
    cost: "free",
    // free CIA-triad/data-privacy/threat courses with shareable badges —
    // matched to the RA 10173-anchored performance expectations; free with account
    url: "https://skillsbuild.org/",
    durationHours: 12,
    skillsAddressed: ["Threat analysis / monitoring"],
    careerId: "cybersec",
  },
  {
    id: "res-cybersec-google-cybersecurity",
    title: "Google Cybersecurity Professional Certificate",
    provider: "Google (Coursera)",
    type: "cert",
    cost: "free",
    // material free via audit; certificate paid / financial aid
    url: "https://www.coursera.org/professional-certificates/google-cybersecurity",
    durationHours: 60,
    skillsAddressed: ["Threat analysis / monitoring"],
    careerId: "cybersec",
  },
  {
    id: "res-cybersec-mitre-attack",
    title: "MITRE ATT&CK Knowledge Base",
    provider: "MITRE",
    type: "doc",
    cost: "free",
    // threat/technique reading behind escalation practice + incident taxonomy
    url: "https://attack.mitre.org/",
    durationHours: 3,
    skillsAddressed: ["Threat analysis / monitoring", "Cyber and Data Breach Incident Management"],
    careerId: "cybersec",
    pick: true,
  },
  {
    id: "res-cybersec-fortinet",
    title: "Fortinet Training Institute — free self-paced catalog",
    provider: "Fortinet",
    type: "cert",
    cost: "free",
    // free NSE-family courses w/ free completion certificates (SOC-adjacent);
    // CYB-V5: current certificate terms re-check queued
    url: "https://www.fortinet.com/training-certification",
    durationHours: 6,
    skillsAddressed: [],
    careerId: "cybersec",
  },
  {
    id: "res-cybersec-netacad-networking-basics",
    title: "Networking Basics",
    provider: "Cisco Networking Academy",
    type: "course",
    cost: "free",
    // "understand the networks being defended"
    url: "https://www.netacad.com/courses/networking-basics",
    durationHours: 22,
    skillsAddressed: ["Network administration & maintenance"],
    creditingBody: "Cisco Networking Academy",
    careerId: "cybersec",
    pick: true,
  },
  {
    id: "res-cybersec-tryhackme",
    title: "TryHackMe — free learning tier (rooms/labs)",
    provider: "TryHackMe",
    type: "course",
    cost: "free",
    // hands-on vulnerability-scanning/PtT practice in browser; free rooms
    // exist, full paths/advanced labs are paid — stated plainly on copy (CYB-V5)
    url: "https://tryhackme.com/",
    durationHours: 4,
    skillsAddressed: ["Vulnerability assessment support (VAPT analyst track)"],
    careerId: "cybersec",
    pick: true,
  },
  {
    id: "res-cybersec-netacad-ethical-hacker",
    title: "Ethical Hacker",
    provider: "Cisco Networking Academy",
    type: "course",
    cost: "free",
    // ~70 h free course covering scans/tests basics; seat availability at signup
    url: "https://www.netacad.com/courses/ethical-hacker",
    durationHours: 70,
    skillsAddressed: ["Vulnerability assessment support (VAPT analyst track)"],
    creditingBody: "Cisco Networking Academy",
    careerId: "cybersec",
  },
  {
    id: "res-cybersec-openlearn-comms",
    title: "Effective communication in the workplace",
    provider: "Open University (OpenLearn)",
    type: "course",
    cost: "free",
    // adopted 403 verdict line (keep-with-flag); escalation/report writing
    url: "https://www.open.edu/openlearn/money-business/effective-communication-the-workplace",
    durationHours: 3,
    skillsAddressed: ["Collaboration · Communication · Problem Solving · Digital Fluency (Enabling)"],
    careerId: "cybersec",
    pick: true,
  },

  // == ── Web Developer (2.8 · id webdev) ────────────────────────────────────
  {
    id: "res-webdev-fcc-rwd",
    title: "Responsive Web Design Certification",
    provider: "freeCodeCamp",
    type: "cert",
    cost: "free",
    // free ~300-h curriculum + free certificate
    url: "https://www.freecodecamp.org/learn/responsive-web-design/",
    durationHours: 60,
    skillsAddressed: ["Client-side coding (HTML/CSS/JS)"],
    creditingBody: "freeCodeCamp",
    careerId: "webdev",
  },
  {
    id: "res-webdev-mdn-learn",
    title: "MDN Web Docs — Learn web development",
    provider: "Mozilla",
    type: "doc",
    cost: "free",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development",
    durationHours: 4,
    skillsAddressed: ["Client-side coding (HTML/CSS/JS)", "Responsive/UI basics + accessibility"],
    careerId: "webdev",
    pick: true,
  },
  {
    id: "res-webdev-odin",
    title: "Foundations path — The Odin Project",
    provider: "The Odin Project",
    type: "course",
    cost: "free",
    // project-first full curriculum incl. Git
    url: "https://www.theodinproject.com/paths/foundations",
    durationHours: 40,
    skillsAddressed: ["Client-side coding (HTML/CSS/JS)"],
    careerId: "webdev",
  },
  {
    id: "res-webdev-fcc-js",
    title: "JavaScript Algorithms and Data Structures Certification",
    provider: "freeCodeCamp",
    type: "cert",
    cost: "free",
    url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
    durationHours: 40,
    skillsAddressed: ["Client-side coding (HTML/CSS/JS)"],
    creditingBody: "freeCodeCamp",
    careerId: "webdev",
  },
  {
    id: "res-webdev-wordpress-docs",
    title: "WordPress documentation",
    provider: "WordPress.org",
    type: "doc",
    cost: "free",
    url: "https://wordpress.org/documentation/",
    durationHours: 4,
    skillsAddressed: ["CMS administration (WordPress etc.)"],
    careerId: "webdev",
  },
  {
    id: "res-webdev-wordpress-first-steps",
    title: "First Steps With WordPress (official starter doc)",
    provider: "WordPress.org",
    type: "doc",
    cost: "free",
    url: "https://wordpress.org/documentation/article/first-steps-with-wordpress/",
    durationHours: 2,
    skillsAddressed: ["CMS administration (WordPress etc.)"],
    careerId: "webdev",
    pick: true,
  },
  {
    id: "res-webdev-w3c-wai",
    title: "W3C Web Accessibility Initiative — Accessibility Fundamentals",
    provider: "W3C",
    type: "doc",
    cost: "free",
    url: "https://www.w3.org/WAI/fundamentals/",
    durationHours: 4,
    skillsAddressed: ["Responsive/UI basics + accessibility"],
    careerId: "webdev",
  },
  {
    id: "res-webdev-mdn-accessibility",
    title: "MDN Accessibility (Learn modules)",
    provider: "Mozilla",
    type: "doc",
    cost: "free",
    url: "https://developer.mozilla.org/en-US/docs/Learn/Accessibility",
    durationHours: 3,
    skillsAddressed: ["Responsive/UI basics + accessibility"],
    careerId: "webdev",
    pick: true,
  },
  {
    id: "res-webdev-webdev-learn",
    title: "Learn (web.dev)",
    provider: "Google",
    type: "doc",
    cost: "free",
    // performance/responsive course docs behind the site life-operations verb
    url: "https://web.dev/learn/",
    durationHours: 4,
    skillsAddressed: ["↳ task-cluster sub-row: site life-operations", "Responsive/UI basics + accessibility"],
    careerId: "webdev",
    pick: true,
  },
  {
    id: "res-webdev-progit",
    title: "Pro Git, 2nd Edition (free full web text)",
    provider: "Apress / git-scm.com",
    type: "doc",
    cost: "free",
    // free text; print = purchase (labeled)
    url: "https://git-scm.com/book/en/v2",
    durationHours: 8,
    skillsAddressed: ["Version control (git)"],
    careerId: "webdev",
    pick: true,
  },
  {
    id: "res-webdev-scrum-guide",
    title: "The Scrum Guide (official, free text)",
    provider: "Scrum.org / Schwaber & Sutherland",
    type: "doc",
    cost: "free",
    url: "https://scrumguides.org/scrum-guide.html",
    durationHours: 2,
    skillsAddressed: ["Agile Software Development (when agency-run)"],
    careerId: "webdev",
  },
  {
    id: "res-webdev-atlassian-agile",
    title: "Atlassian Agile Coach (free text library)",
    provider: "Atlassian",
    type: "doc",
    cost: "free",
    url: "https://www.atlassian.com/agile",
    durationHours: 2,
    skillsAddressed: ["Agile Software Development (when agency-run)"],
    careerId: "webdev",
    pick: true,
  },

  // == ── Digital / Multimedia Artist (2.9 · id digart) ──────────────────────
  {
    id: "res-digart-tesda-vgd-elearning",
    title: "Visual Graphic Design NC III e-learning (7 free modules)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // the direct free e-learning companion to the exact TR units
    // (category listing 200, module set verified 1:1); free, self-paced; TOP account
    url: "https://e-tesda.gov.ph/course/index.php?categoryid=1524",
    durationHours: 12,
    skillsAddressed: [
      "DEVELOP DESIGNS FOR A LOGO (ICT216313)",
      "DEVELOP DESIGNS FOR PRINT MEDIA (ICT216314)",
      "DEVELOP DESIGNS FOR USER EXPERIENCE (ICT216315)",
      "DEVELOP DESIGNS FOR USER INTERFACE (ICT216316)",
      "DEVELOP DESIGNS FOR PRODUCT PACKAGING (ICT216317)",
      "DESIGN BOOTH AND PRODUCT WINDOW / DISPLAY (ICT216318)",
    ],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "digart",
    pick: true,
  },
  {
    id: "res-digart-tr-doc",
    title: "Visual Graphic Design NC III Training Regulation (free PDF)",
    provider: "TESDA",
    type: "doc",
    cost: "free",
    // the qualification definition itself (units + performance criteria)
    url: "https://tesda.gov.ph/Downloadables/TR%20-%20Visual%20Graphic%20Design%20NC%20III.pdf",
    durationHours: 3,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "digart",
  },
  {
    id: "res-digart-calarts-graphic",
    title: "Fundamentals of Graphic Design (CalArts)",
    provider: "Coursera (CalArts)",
    type: "course",
    cost: "free",
    // free-audit visual design principles grounding; audit/preview free,
    // certificate paid
    url: "https://www.coursera.org/learn/fundamentals-of-graphic-design",
    durationHours: 15,
    skillsAddressed: [
      "DEVELOP DESIGNS FOR A LOGO (ICT216313)",
      "DEVELOP DESIGNS FOR PRINT MEDIA (ICT216314)",
      "Follow creative brief + brand guideline development",
    ],
    careerId: "digart",
    pick: true,
  },
  {
    id: "res-digart-blender-manual",
    title: "Blender Manual (official docs)",
    provider: "Blender Foundation",
    type: "doc",
    cost: "free",
    // the free industry-grade animation/3D tool's manual — the tool row's
    // Blender leg AND the Junior-2D-Animator counterpart row's linkage (DIG-V3)
    url: "https://docs.blender.org/manual/en/latest/",
    durationHours: 4,
    skillsAddressed: [
      "Use specialized graphic/animation tools (Adobe suite, Blender etc.)",
      "Junior 2D Animator — [PSF-DAA] (counterpart, optional — user ruling 2026-10-29 ADD)",
    ],
    careerId: "digart",
    pick: true,
  },
  {
    id: "res-digart-canva-design-school",
    title: "Canva Design School (free courses)",
    provider: "Canva",
    type: "course",
    cost: "free",
    // beginner-friendly design-tool courses; free tier suffices
    url: "https://www.canva.com/designschool/",
    durationHours: 4,
    skillsAddressed: ["Use specialized graphic/animation tools (Adobe suite, Blender etc.)"],
    careerId: "digart",
  },
  {
    id: "res-digart-figma",
    title: "Figma Learn — resource library",
    provider: "Figma",
    type: "doc",
    cost: "free",
    // UI/prototyping tooling tutorials behind COC 2 (UI/UX)
    url: "https://www.figma.com/resource-library/",
    durationHours: 3,
    skillsAddressed: [
      "DEVELOP DESIGNS FOR USER EXPERIENCE (ICT216315)",
      "DEVELOP DESIGNS FOR USER INTERFACE (ICT216316)",
      "Use specialized graphic/animation tools (Adobe suite, Blender etc.)",
    ],
    careerId: "digart",
    pick: true,
  },
  {
    id: "res-digart-openlearn-comms",
    title: "Effective communication in the workplace",
    provider: "Open University (OpenLearn)",
    type: "course",
    cost: "free",
    // adopted 403 verdict line (keep-with-flag); client-facing behaviors
    url: "https://www.open.edu/openlearn/money-business/effective-communication-the-workplace",
    durationHours: 3,
    skillsAddressed: ["Client communication & revision handling"],
    careerId: "digart",
    pick: true,
  },
  // DIG-V2: Adobe official tutorials 403 — flagged, NOT cited here.

  // == ── SOC Analyst (E4 · id soc) — soc.md §Resources ──────────────────────
  {
    id: "res-soc-letsdefend",
    title: "LetsDefend — SOC analyst training simulator (free plan)",
    provider: "LetsDefend",
    type: "course",
    cost: "free",
    // free plan placement printed on the landing page; trains the printed
    // queue workflow; limits/pricing terms stated at signup (SOC-V6)
    url: "https://letsdefend.io/",
    durationHours: 6,
    skillsAddressed: ["Monitor cyber security systems", "Manage response to cyber security incidents"],
    careerId: "soc",
  },
  {
    id: "res-soc-mitre-attack",
    title: "MITRE ATT&CK Knowledge Base",
    provider: "MITRE",
    type: "doc",
    cost: "free",
    // the "Knowledge of attack framework" reference; incident-type taxonomy
    url: "https://attack.mitre.org/",
    durationHours: 3,
    skillsAddressed: [
      "Monitor cyber security systems",
      "Manage response to cyber security incidents",
      "Threat Analysis and Defence · Threat Intelligence and Detection (family FSC cross-cite)",
    ],
    careerId: "soc",
    pick: true,
  },
  {
    id: "res-soc-splunk-free",
    title: "Free courses — Splunk Training",
    provider: "Splunk",
    type: "course",
    cost: "free",
    // free-course landing (introductory log/SIEM analysis); older splunk101
    // deep-link 404'd today — recorded, replaced by the landing (SOC-V6)
    url: "https://www.splunk.com/en_us/training/free-courses.html",
    durationHours: 6,
    skillsAddressed: ["Monitor cyber security systems", "Maintain cyber security operations"],
    careerId: "soc",
    pick: true,
  },
  {
    id: "res-soc-fortinet",
    title: "Fortinet Training Institute — free self-paced catalog",
    provider: "Fortinet",
    type: "cert",
    cost: "free",
    // free NSE-family security-operations courseware; certificate terms
    // re-check rides sibling CYB-V5
    url: "https://www.fortinet.com/training-certification",
    durationHours: 6,
    skillsAddressed: [],
    careerId: "soc",
  },
  {
    id: "res-soc-nist-800-61",
    title: "Computer Security Incident Handling Guide (NIST SP 800-61 Rev. 3)",
    provider: "NIST",
    type: "doc",
    cost: "free",
    // free authoritative incident-handling reference
    url: "https://csrc.nist.gov/pubs/sp/800/61/r3/final",
    durationHours: 3,
    skillsAddressed: ["Manage response to cyber security incidents"],
    careerId: "soc",
  },
  {
    id: "res-soc-otx",
    title: "Open Threat Exchange (OTX)",
    provider: "AlienVault / AT&T",
    type: "doc",
    cost: "free",
    // free live threat-intel feed implementing the TESDA criterion
    url: "https://otx.alienvault.com/",
    durationHours: 2,
    skillsAddressed: ["Threat Analysis and Defence · Threat Intelligence and Detection (family FSC cross-cite)"],
    careerId: "soc",
    pick: true,
  },
  {
    id: "res-soc-tryhackme",
    title: "TryHackMe — free learning tier",
    provider: "TryHackMe",
    type: "course",
    cost: "free",
    // hands-on scanning/triage practice; flag the paid tier boundary on copy
    url: "https://tryhackme.com/",
    durationHours: 4,
    skillsAddressed: ["Vulnerability scanning (VAPT-adjacent, TESDA-printed)"],
    careerId: "soc",
    pick: true,
  },
  {
    id: "res-soc-netacad-ethical-hacker",
    title: "Ethical Hacker",
    provider: "Cisco Networking Academy",
    type: "course",
    cost: "free",
    // scan-and-report curriculum; seat availability at signup
    url: "https://www.netacad.com/courses/ethical-hacker",
    durationHours: 70,
    skillsAddressed: ["Vulnerability scanning (VAPT-adjacent, TESDA-printed)"],
    creditingBody: "Cisco Networking Academy",
    careerId: "soc",
  },
  {
    id: "res-soc-netacad-networking-basics",
    title: "Networking Basics",
    provider: "Cisco Networking Academy",
    type: "course",
    cost: "free",
    // the "LAN, WAN, port forwarding" knowledge the TESDA unit prints
    url: "https://www.netacad.com/courses/networking-basics",
    durationHours: 22,
    skillsAddressed: ["Network security understanding (network administration family)"],
    creditingBody: "Cisco Networking Academy",
    careerId: "soc",
    pick: true,
  },
  {
    id: "res-soc-netacad-network-defense",
    title: "Network Defense",
    provider: "Cisco Networking Academy",
    type: "course",
    cost: "free",
    // defensive-tooling course behind the firewall/EDR alert-source range
    url: "https://www.netacad.com/courses/network-defense",
    durationHours: 24,
    skillsAddressed: ["Network security understanding (network administration family)"],
    creditingBody: "Cisco Networking Academy",
    careerId: "soc",
  },
  {
    id: "res-soc-google-cybersecurity",
    title: "Google Cybersecurity Professional Certificate",
    provider: "Google (Coursera)",
    type: "cert",
    cost: "free",
    // 200 via CLI 2026-10-29; audit→Preview drift re-check at enrollment
    url: "https://www.coursera.org/professional-certificates/google-cybersecurity",
    durationHours: 60,
    skillsAddressed: [],
    careerId: "soc",
  },
  {
    id: "res-soc-openlearn-comms",
    title: "Effective communication in the workplace",
    provider: "Open University (OpenLearn)",
    type: "course",
    cost: "free",
    // adopted 403 verdict line (keep-with-flag)
    url: "https://www.open.edu/openlearn/money-business/effective-communication-the-workplace",
    durationHours: 3,
    skillsAddressed: ["Collaboration · Communication · Problem Solving · Digital Fluency (Enabling)"],
    careerId: "soc",
    pick: true,
  },

  // == ── Data Analyst, junior (E1 · id da) — COMPLETE pool, one row per skill
  // (unchanged from catalog round 12 — every URL fetched LIVE 2026-10-29)
  // Wave B audit (2026-11-03): access/form copied verbatim from the D2 mockup
  // access draft (user-ruled 2026-11-03). FIVE rows whose URL was not
  // teachable at the URL itself (prof-cert landing · TAU paths index · NPC
  // reference pages · search listing) were RE-POINTED to the live-verified
  // taught course page of the same skill (fresh "fetched LIVE 2026-11-03"
  // note in-row; ids/ADDR/pool-size all unchanged) — the pool stays one row
  // per skill. Learn lines: mockup drafts verbatim + new drafts (learn
  // draft — user review pending). Every da skill now resolves to a vetted
  // taught suggestion (coverage gate: 13/13).
  {
    id: "res-da-cert",
    title: "Google Data Analytics Professional Certificate",
    provider: "Coursera (Google)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (RE-POINTED, Wave B audit): the old URL was the
    // prof-cert landing (D2 mockup graded it "landing — the course lives
    // behind it"; fetched LIVE 2026-10-29: "Enroll for free", 9-course
    // series). The suggested slot must open teachable content, so this row
    // now points at cert course 1 — the taught Google intro (fetched LIVE
    // 2026-11-03: "Enroll for free", 4 modules, ~20 h, data life cycle +
    // analytical-thinking drills). Id/ADDR/pool unchanged; ₱ paid tier:
    // shareable certificate (audit/financial-aid route is the free tier).
    url: "https://www.coursera.org/learn/foundations-data?specialization=google-data-analytics",
    durationHours: 20,
    skillsAddressed: ["Data Analytics"],
    careerId: "da",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Data Analytics":
        "Google's taught introduction runs the analyst day job end to end — data cycle, spreadsheet/SQL comprehension, and the analytical-thinking drills this row prints (PSF-AAI FSC Level 2).",
    },
    // learn draft — user review pending
  },
  {
    id: "res-da-viz",
    title: "Share Data Through the Art of Visualization (cert course 6)",
    provider: "Coursera (Google)",
    type: "course",
    cost: "free",
    // course page fetched LIVE 2026-10-29 — "Enroll for free" + Tableau
    // dashboards/data stories; ₱ paid tier: shareable certificate
    // audit (2026-11-03, mockup draft): audit route free, certificate paid
    url: "https://www.coursera.org/learn/visualize-data?specialization=google-data-analytics",
    durationHours: 19,
    skillsAddressed: ["Data Visualization and Storytelling"],
    careerId: "da",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Data Visualization and Storytelling":
        "You'll build dashboards end to end — charts, story structure, and the visual arguments behind findings (Tableau).",
    },
    // learn draft — user review pending
  },
  {
    id: "res-da-bna",
    title: "Ask Questions to Make Data-Driven Decisions (cert course 2)",
    provider: "Coursera (Google)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-10-29 — structured thinking + a module on balancing
    // stakeholder needs; ₱ paid tier: certificate
    // audit (2026-11-03, mockup draft): audit route free, certificate paid
    url: "https://www.coursera.org/learn/ask-questions-make-decisions?specialization=google-data-analytics",
    durationHours: 15,
    skillsAddressed: ["Business Needs Analysis"],
    careerId: "da",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Business Needs Analysis":
        "Structured thinking with a module on balancing stakeholder asks, then turning an ambiguous ask into a question plan.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-da-etl",
    title: "Data Cleaning — hands-on notes-by-note workflows",
    provider: "Kaggle Learn",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-10-29, notebook exercises in-browser, fully free
    // audit (2026-11-03, mockup draft): in-browser notebooks, fully free
    url: "https://www.kaggle.com/learn/data-cleaning",
    durationHours: 4,
    skillsAddressed: ["ETL (extract-transform-load workflows)"],
    careerId: "da",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "ETL (extract-transform-load workflows)":
        "Hands-on cleaning: missing values, formats, scaling — the workbook runs the skill's own prepare-validate-record loop.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-da-engineering-doc",
    title: "Part I. Tutorial — the official PostgreSQL tutorial",
    provider: "PostgreSQL Documentation",
    type: "doc",
    cost: "free",
    // fetched LIVE 2026-10-29 — relational concepts, SQL, views, transactions
    // audit (2026-11-03, mockup draft): official tutorial, open access
    url: "https://www.postgresql.org/docs/current/tutorial.html",
    durationHours: 4,
    skillsAddressed: ["Data Engineering"],
    careerId: "da",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Data Engineering":
        "Relational thinking from scratch: schemas, SQL, views, transactions — the substratum the analyst reads and writes against.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-da-esc-doc",
    title: "Team Playbook — free teamwork Plays",
    provider: "Atlassian",
    type: "doc",
    cost: "free",
    // "Are Plays free? Yes" — the 4-ESC bundle's practice layer
    // audit (2026-11-03, mockup draft): plays are free activity guides
    url: "https://www.atlassian.com/team-playbook",
    durationHours: 2,
    skillsAddressed: [
      "Enabling Skills & Competencies (ESC) — Collaboration, Communication, Digital Fluency, Learning Agility",
    ],
    careerId: "da",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Enabling Skills & Competencies (ESC) — Collaboration, Communication, Digital Fluency, Learning Agility":
        "Team Playbook plays you can actually run with a team — shared decisions, communication cadence, working agreement.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-da-appdev",
    title: "Introduction to Data Analysis Using Python (cert course 7)",
    provider: "Coursera (Google)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-10-29 — Python basics/light scripting; ₱ paid tier
    // audit (2026-11-03, mockup draft): audit route free, certificate paid
    url: "https://www.coursera.org/learn/introduction-to-data-analysis-using-python?specialization=google-data-analytics",
    durationHours: 27,
    skillsAddressed: ["Applications Development"],
    careerId: "da",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Applications Development":
        "Python querying/analysis basics — the light scripting muscle the FSC row prints.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-da-aiethics",
    title: "Elements of AI — Introduction to AI (free, incl. ethics chapter)",
    provider: "MinnaLearn · University of Helsinki",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-10-29 — free MOOC, covers AI-society ethics
    // audit (2026-11-03, mockup draft): free MOOC, signup → account
    url: "https://www.elementsofai.com/",
    durationHours: 30,
    skillsAddressed: ["Artificial Intelligence Ethics and Governance"],
    careerId: "da",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Artificial Intelligence Ethics and Governance":
        "AI society-impact chapters — bias, transparency, accountability — the governance vocabulary the row mandates.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-da-ethics-doc",
    title: "Data Science Ethics (University of Michigan)",
    provider: "Coursera (University of Michigan)",
    // fetched LIVE 2026-11-03 (RE-POINTED, Wave B audit): the old URL was the
    // NPC Data-Privacy-Act hub (D2 mockup graded it "reference" — readable
    // law text, no teaching flow; fetched LIVE 2026-10-29). The suggested
    // slot must open teachable content for the same skill, so this row now
    // points at University of Michigan's taught "Data Science Ethics"
    // (fetched LIVE 2026-11-03: "Enroll now", 10 modules incl. Privacy,
    // Data Ownership, Societal Consequences, Code of Ethics — the
    // lifecycle discipline the row prints, incl. RA 10173 context). Id,
    // skill ADDR and the pool's one-row-per-skill shape unchanged.
    type: "course",
    cost: "free",
    url: "https://www.coursera.org/learn/data-science-ethics",
    durationHours: 20,
    skillsAddressed: ["Data Ethics"],
    careerId: "da",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Data Ethics":
        "Michigan's data-science ethics course walks privacy, data ownership, and real societal-consequence cases — the legal/ethical lifecycle treatment the row prints.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-da-breach-doc",
    title: "Cyber Incident Response (Infosec)",
    provider: "Coursera (Infosec)",
    // fetched LIVE 2026-11-03 (RE-POINTED, Wave B audit): the old row was the
    // NPC breach-reporting procedure page (reference — a working procedure
    // read, not a taught flow; fetched LIVE 2026-10-29). RE-POINTED to
    // Infosec's taught "Cyber Incident Response" (fetched LIVE 2026-11-03:
    // "Enroll for free", 1 module / ~2 h, beginner — how incidents are
    // categorized, contained and escalated through the IR process; the
    // recognize→report→escalate loop the row prints). Id/ADDR unchanged.
    type: "course",
    cost: "free",
    url: "https://www.coursera.org/learn/incident-response",
    durationHours: 2,
    skillsAddressed: ["Cyber and Data Breach Incident Management"],
    careerId: "da",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Cyber and Data Breach Incident Management":
        "Incident-response fundamentals: how an event becomes an incident, who drives containment, and how status and escalation travel through the IR process.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-da-testing-doc",
    title: "Introduction to Software Testing (University of Minnesota)",
    provider: "Coursera (University of Minnesota)",
    // fetched LIVE 2026-11-03 (RE-POINTED, Wave B audit): the old row pointed
    // at the TAU learning-paths INDEX (D2 mockup graded it "landing"; fetched
    // LIVE 2026-10-29). RE-POINTED to the taught UMN "Introduction to
    // Software Testing" (fetched LIVE 2026-11-03: "Enroll for free", 4
    // modules — test levels, the why-and-when of testing, plan-write-execute
    // basics; the sanity-test-your-own-output discipline the row prints).
    // Id/ADDR unchanged; the TAU tools stay in the qa pool rows.
    type: "course",
    cost: "free",
    url: "https://www.coursera.org/learn/introduction-software-testing",
    durationHours: 30,
    skillsAddressed: ["Software Testing"],
    careerId: "da",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Software Testing":
        "UMinn's introduction teaches the testing discipline itself — what to test, when, and how a test case proves behavior — exactly the before-it-ships sanity layer the row prints.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-da-config-doc",
    title: "Get started — Git and GitHub learning resources / quickstart",
    provider: "GitHub Docs",
    type: "doc",
    cost: "free",
    // fetched LIVE 2026-10-29 — version tracking for reproducibility
    // audit (2026-11-03, mockup draft): quickstart tutorial, open access
    url: "https://docs.github.com/en/get-started/quickstart",
    durationHours: 2,
    skillsAddressed: ["Configuration Tracking"],
    careerId: "da",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Configuration Tracking":
        "Git mechanics: commits, branches, history — the change log keeping analysis files reproducible.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-da-stakeholder",
    title: "Stakeholder Management (STARWEAVER)",
    provider: "Coursera (STARWEAVER)",
    // fetched LIVE 2026-11-03 (RE-POINTED, Wave B audit): the old row was the
    // Coursera SEARCH listing ("listing-page convention" — no teachable
    // content at the URL). RE-POINTED to the taught "Stakeholder Management"
    // course page (fetched LIVE 2026-11-03: "Enroll for free", 1 module /
    // ~5 h — identify stakeholders, analyze needs/expectations, plan the
    // collaboration and change cadence; the who-you-report-to loop the row
    // prints). Id/ADDR unchanged.
    type: "course",
    cost: "free",
    url: "https://www.coursera.org/learn/stakeholder-management",
    durationHours: 5,
    skillsAddressed: ["Stakeholder Management"],
    careerId: "da",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Stakeholder Management":
        "Four lessons: identify who needs to know, map expectations, plan the reporting and collaboration cadence — the report-to / stay-in-the-loop shape this skill prints.",
    },
    // learn draft — user review pending
  },

  // == ── Track 2 · Business & Management (hra · training · mkt · sales · csr ·
  // opsanalyst · purch · ccqa · events) — blessed role-spec pools ───────────
  // ── hra (3.1) ──
  {
    id: "res-hra-alison-diploma-hr",
    title: "Diploma in Human Resources (HR)",
    provider: "Alison",
    type: "course",
    cost: "free",
    // covers recruit, select, records (Official Alison page verified 200);
    // study free, certificate purchase optional
    url: "https://alison.com/course/diploma-in-human-resources-hr",
    durationHours: 6,
    skillsAddressed: [
      "Recruitment Channel Management", "Selection Management", "Onboarding",
      "Job Analysis and Evaluation", "Voluntary Exit Management", "Involuntary Exit Management",
      "Human Resources Systems Management",
    ],
    careerId: "hra",
    pick: true,
  },
  {
    id: "res-hra-minnesota-hrm",
    title: "Human Resource Management: HR for People Managers Specialization",
    provider: "Coursera (University of Minnesota)",
    type: "course",
    cost: "free",
    // audit free; certificate paid (financial aid exists; audit-vs-preview re-checked at enroll)
    url: "https://www.coursera.org/specializations/human-resource-management",
    durationHours: 15,
    skillsAddressed: [
      "Recruitment Channel Management", "Selection Management", "Performance Management",
      "Human Resources Systems Management",
      "Communication · Adaptability · Customer Orientation · Digital Fluency · Learning Agility · Self-Management (Enabling, Basic)",
    ],
    careerId: "hra",
    pick: true,
  },
  {
    id: "res-hra-cipd-factsheets",
    title: "CIPD Factsheets (free professional-factsheet library)",
    provider: "CIPD (UK HR professional body)",
    type: "doc",
    cost: "free",
    // free evidence-based factsheets: recruitment, assessment, turnover
    url: "https://www.cipd.org/uk/knowledge/factsheets/",
    durationHours: 2,
    skillsAddressed: ["Selection Management", "Talent Capability Assessment", "Data Collection and Preparation", "Stakeholder Engagement and Management"],
    careerId: "hra",
    pick: true,
  },
  {
    id: "res-hra-gcf-excel",
    title: "Excel (Foundations) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    // completely free, browser-based, no account
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: ["Data Management", "Data Collection and Preparation"],
    careerId: "hra",
  },
  {
    id: "res-hra-ms-excel",
    title: "Excel help & learning",
    provider: "Microsoft Support",
    type: "doc",
    cost: "free",
    url: "https://support.microsoft.com/en-us/excel",
    durationHours: 2,
    skillsAddressed: ["Data Management", "Data Collection and Preparation"],
    careerId: "hra",
  },
  {
    id: "res-hra-ra10173",
    title: "Republic Act No. 10173 (Data Privacy Act of 2012)",
    provider: "Lawphil Project",
    type: "doc",
    cost: "free",
    // statute text (200); privacy.gov.ph 403 this session — lawphil carries
    // the working legal anchor (standing re-check)
    url: "https://lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html",
    durationHours: 2,
    skillsAddressed: ["Data Management", "Diversity, Equity, Inclusion and Belonging Management", "Voluntary Exit Management", "Involuntary Exit Management"],
    careerId: "hra",
    pick: true,
  },
  {
    id: "res-hra-hubspot-inbound",
    title: "Inbound Certification Course (HubSpot Academy)",
    provider: "HubSpot Academy",
    type: "cert",
    cost: "free",
    // fully free incl. certificate; page verified w/ course title + search mirror
    url: "https://academy.hubspot.com/courses/inbound",
    durationHours: 4,
    skillsAddressed: ["Recruitment Channel Management", "Digital Marketing and Communication"],
    creditingBody: "HubSpot Academy",
    careerId: "hra",
    pick: true,
  },
  {
    id: "res-hra-public-speaking",
    title: "Introduction to Public Speaking",
    provider: "Coursera (University of Washington)",
    type: "course",
    cost: "free",
    // audit free; certificate paid
    url: "https://www.coursera.org/learn/public-speaking",
    durationHours: 12,
    skillsAddressed: ["Communication · Adaptability · Customer Orientation · Digital Fluency · Learning Agility · Self-Management (Enabling, Basic)"],
    careerId: "hra",
  },
  {
    id: "res-hra-top-professionalism",
    title: "TOP — Professionalism (Job Ready Courses)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // HTTP 200 but login-walled; title verified via TOP search/category pages;
    // open inside a TOP account before citing course content (standing flag)
    url: "https://e-tesda.gov.ph/course/view.php?id=5042",
    durationHours: 2,
    skillsAddressed: ["Communication · Adaptability · Customer Orientation · Digital Fluency · Learning Agility · Self-Management (Enabling, Basic)"],
    creditingBody: "TESDA",
    careerId: "hra",
    pick: true,
  },
  {
    id: "res-hra-top-writing",
    title: "TOP — Impactful Writing Skills (Job Ready Courses)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free); verified via TOP search page
    url: "https://e-tesda.gov.ph/course/view.php?id=5037",
    durationHours: 2,
    skillsAddressed: ["Communication · Adaptability · Customer Orientation · Digital Fluency · Learning Agility · Self-Management (Enabling, Basic)"],
    creditingBody: "TESDA",
    careerId: "hra",
  },
  {
    id: "res-hra-gap-interview",
    title: "Interview / assessment-administration practice — declared thin",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["Selection Management", "Talent Capability Assessment"],
    careerId: "hra",
  },
  {
    id: "res-hra-gap-deib",
    title: "Dedicated DE&IB free course (DOLE docs unreachable — statute-anchored) — declared thin",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["Diversity, Equity, Inclusion and Belonging Management"],
    careerId: "hra",
  },
  // ── training (3.2) ──
  {
    id: "res-training-minnesota-hrm",
    title: "Human Resource Management: HR for People Managers Specialization",
    provider: "Coursera (University of Minnesota)",
    type: "course",
    cost: "free",
    url: "https://www.coursera.org/specializations/human-resource-management",
    durationHours: 15,
    skillsAddressed: ["Learning Needs Analysis", "Learning and Development Programs Management", "Human Resources Practices Implementation"],
    careerId: "training",
    pick: true,
  },
  {
    id: "res-training-cipd",
    title: "CIPD Factsheets (Learning and development; Training evaluation)",
    provider: "CIPD (UK HR professional body)",
    type: "doc",
    cost: "free",
    url: "https://www.cipd.org/uk/knowledge/factsheets/",
    durationHours: 2,
    skillsAddressed: ["Learning Needs Analysis"],
    careerId: "training",
    pick: true,
  },
  {
    id: "res-training-lhtl",
    title: "Learning How to Learn",
    provider: "Coursera (McMaster & University of Ottawa)",
    type: "course",
    cost: "free",
    url: "https://www.coursera.org/learn/learning-how-to-learn",
    durationHours: 4,
    skillsAddressed: ["Communication · Customer Orientation · Learning Agility · Self-Management · Problem Solving (Enabling, Basic)"],
    careerId: "training",
  },
  {
    id: "res-training-gcf-excel",
    title: "Excel (Foundations) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: ["Data Management"],
    careerId: "training",
  },
  {
    id: "res-training-ms-excel",
    title: "Excel help & learning",
    provider: "Microsoft Support",
    type: "doc",
    cost: "free",
    url: "https://support.microsoft.com/en-us/excel",
    durationHours: 2,
    skillsAddressed: ["Data Collection and Preparation", "Data Management"],
    careerId: "training",
    pick: true,
  },
  {
    id: "res-training-moodle-academy",
    title: "Moodle Academy (official LMS courses)",
    provider: "Moodle (community-run)",
    type: "course",
    cost: "free",
    // 200; the Moodle docs site was 403 this session — Academy used (flagged, not silent)
    url: "https://moodle.academy/",
    durationHours: 4,
    skillsAddressed: ["Human Resources Systems Management", "Learning and Development Programs Management"],
    careerId: "training",
    pick: true,
  },
  {
    id: "res-training-ms-learn",
    title: "Microsoft Learn (Training catalog)",
    provider: "Microsoft Learn",
    type: "doc",
    cost: "free",
    url: "https://learn.microsoft.com/en-us/training/",
    durationHours: 4,
    skillsAddressed: [],
    careerId: "training",
  },
  {
    id: "res-training-top-writing",
    title: "TOP — Impactful Writing Skills (Job Ready Courses)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free); verified via TOP search page
    url: "https://e-tesda.gov.ph/course/view.php?id=5037",
    durationHours: 2,
    skillsAddressed: ["Employee Communication", "Communication · Customer Orientation · Learning Agility · Self-Management · Problem Solving (Enabling, Basic)"],
    creditingBody: "TESDA",
    careerId: "training",
    pick: true,
  },
  {
    id: "res-training-top-professionalism",
    title: "TOP — Professionalism (Job Ready Courses)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free)
    url: "https://e-tesda.gov.ph/course/view.php?id=5042",
    durationHours: 2,
    skillsAddressed: ["Communication · Customer Orientation · Learning Agility · Self-Management · Problem Solving (Enabling, Basic)"],
    creditingBody: "TESDA",
    careerId: "training",
    pick: true,
  },
  {
    id: "res-training-top-bizops",
    title: "TOP — Managing Business Operation (iSTAR Program)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free); the venue/vendor-contracting zone
    // stays declared-thin — this is the adjacent backing
    url: "https://e-tesda.gov.ph/course/view.php?id=4810",
    durationHours: 3,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "training",
  },
  {
    id: "res-training-gap-venue-vendor",
    title: "Training venue/vendor contracting practice — declared thin",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["Stakeholder Engagement and Management"],
    careerId: "training",
  },
  {
    id: "res-training-gap-fgd",
    title: "FGD facilitation practice — declared thin",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["Data Collection and Preparation"],
    careerId: "training",
  },
  {
    id: "res-training-gap-od-survey",
    title: "OD-survey response-rate monitoring tooling — declared thin",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["Human Resources Analytics and Insights"],
    careerId: "training",
  },
  // ── mkt (3.3) — study.com citations stripped; thin zones declared ──
  {
    id: "res-mkt-google-dmx",
    title: "Google Digital Marketing & E-commerce Certificate",
    provider: "Google (grow.google / Coursera)",
    type: "cert",
    cost: "free",
    // audit gives course access free on Coursera; verified certificate paid
    // (financial aid available)
    url: "https://grow.google/certificates/digital-marketing-ecommerce",
    durationHours: 120,
    skillsAddressed: ["Digital Marketing", "Marketing Communications Plan Development", "Media Strategy Development"],
    careerId: "mkt",
    pick: true,
  },
  {
    id: "res-mkt-hubspot-social",
    title: "Social Media Marketing Certification Course (HubSpot Academy)",
    provider: "HubSpot Academy",
    type: "cert",
    cost: "free",
    // completely free incl. certificate (title confirmed on page)
    url: "https://academy.hubspot.com/courses/social-media",
    durationHours: 6,
    skillsAddressed: ["Social Media Marketing", "Trend Forecasting"],
    creditingBody: "HubSpot Academy",
    careerId: "mkt",
  },
  {
    id: "res-mkt-hubspot-content",
    title: "Content Marketing Certification Course (HubSpot Academy)",
    provider: "HubSpot Academy",
    type: "cert",
    cost: "free",
    url: "https://academy.hubspot.com/courses/content-marketing",
    durationHours: 6,
    skillsAddressed: ["Content Development and Strategy", "Category Marketing · Collateral Production · Visual Collaterals Production · Content Management"],
    creditingBody: "HubSpot Academy",
    careerId: "mkt",
    pick: true,
  },
  {
    id: "res-mkt-illinois-dmx",
    title: "Digital Marketing Specialization (University of Illinois)",
    provider: "Coursera",
    type: "course",
    cost: "free",
    // audit free per course; certificate paid (financial aid)
    url: "https://www.coursera.org/specializations/digital-marketing",
    durationHours: 30,
    skillsAddressed: ["Digital Marketing", "Media Strategy Development"],
    careerId: "mkt",
    pick: true,
  },
  {
    id: "res-mkt-wharton-customer-analytics",
    title: "Customer Analytics (Wharton)",
    provider: "Coursera (Wharton)",
    type: "course",
    cost: "free",
    // audit free; certificate paid
    url: "https://www.coursera.org/learn/wharton-customer-analytics",
    durationHours: 12,
    skillsAddressed: [
      "Market Intelligence", "Market Profiling", "Market Trend Analysis",
      "Data Analysis and Interpretation", "Data-mining and Modelling · Research and Information Synthesis",
    ],
    careerId: "mkt",
    pick: true,
  },
  {
    id: "res-mkt-google-analytics-academy",
    title: "Google Analytics Academy (via Skillshop)",
    provider: "Google",
    type: "course",
    cost: "free",
    // free; may need a Google account; PH-accessible
    url: "https://skillshop.withgoogle.com/",
    durationHours: 4,
    skillsAddressed: ["Digital Fluency (ESC, Basic)"],
    careerId: "mkt",
    pick: true,
  },
  {
    id: "res-mkt-top-social-concepts",
    title: "TOP — Content Creation (Social Media) L3: Creating Concepts for Social Media",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free); titles verified via TOP search page
    url: "https://e-tesda.gov.ph/course/view.php?id=4069",
    durationHours: 2,
    skillsAddressed: ["Social Media Marketing", "Trend Forecasting"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "mkt",
    pick: true,
  },
  {
    id: "res-mkt-top-social-propagating",
    title: "TOP — Content Creation (Social Media) L3: Propagating Content",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free)
    url: "https://e-tesda.gov.ph/course/view.php?id=4070",
    durationHours: 2,
    skillsAddressed: ["Social Media Marketing"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "mkt",
  },
  {
    id: "res-mkt-top-dmx-funnel",
    title: "TOP — Digital Marketing L3: Designing a Digital Marketing Funnel",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free)
    url: "https://e-tesda.gov.ph/course/view.php?id=4748",
    durationHours: 2,
    skillsAddressed: ["Digital Marketing", "E-Commerce Campaign Management"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "mkt",
    pick: true,
  },
  {
    id: "res-mkt-top-dmx-content",
    title: "TOP — Digital Marketing L3: Creating Content",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=4750",
    durationHours: 2,
    skillsAddressed: ["Digital Marketing", "Content Development and Strategy"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "mkt",
    pick: true,
  },
  {
    id: "res-mkt-top-dmx-optimizing",
    title: "TOP — Digital Marketing L3: Optimizing Digital Marketing Campaign",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=4751",
    durationHours: 2,
    skillsAddressed: ["Digital Marketing", "E-Commerce Campaign Management"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "mkt",
  },
  {
    id: "res-mkt-top-customer-centricity",
    title: "TOP — Customer Centricity (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free)
    url: "https://e-tesda.gov.ph/course/view.php?id=5043",
    durationHours: 2,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "mkt",
  },
  {
    id: "res-mkt-gcf",
    title: "GCFGlobal — free office/tooling courses",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    // practical tooling for calendars, trackers, media logs; free, no account
    url: "https://edu.gcfglobal.org/en/",
    durationHours: 2,
    skillsAddressed: [],
    careerId: "mkt",
  },
  {
    id: "res-mkt-gap-proposal",
    title: "Proposal Writing practice — declared thin (no verified free course)",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["Events Planning and Management · Proposal Writing · Media Platforms Management"],
    careerId: "mkt",
  },
  {
    id: "res-mkt-gap-trade",
    title: "International Trade Legislation context — declared thin",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["International Trade Legislation for Business · Retailing and the Economy · Website Design"],
    careerId: "mkt",
  },
  {
    id: "res-mkt-gap-brand-portfolio",
    title: "Brand Portfolio Management depth — declared thin (vendor-partial coverage)",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["Brand Campaign Management · Brand Guideline Development · Brand Marketing · Brand Portfolio Management"],
    careerId: "mkt",
  },
  // ── sales (3.4) — LinkedIn Learning entry REMOVED (ruled DROPPED; paid path
  // noted in copy only); study.com citations stripped ──
  {
    id: "res-sales-hubspot-inbound-sales",
    title: "Inbound Sales Certification Course (HubSpot Academy)",
    provider: "HubSpot Academy",
    type: "cert",
    cost: "free",
    // end-to-end inbound selling — prospecting, connecting, exploring,
    // advising, closing; completely free incl. certificate.
    // sales.md §Resources — the spec's resource-table cell maps
    // "Customer Acquisition Management · Sales Closure · Customer Management ·
    // Account Management" to this resource (Account Management enumerated)
    url: "https://academy.hubspot.com/courses/inbound-sales",
    durationHours: 3,
    skillsAddressed: [
      "Customer Acquisition Management", "Sales Closure", "Customer Management",
      "Customer Relationship Management + Customer Relationship Management Operations",
      "Account Management",
    ],
    creditingBody: "HubSpot Academy",
    careerId: "sales",
    pick: true,
  },
  {
    id: "res-sales-hubspot-sales-mgmt",
    title: "Sales Management Training (HubSpot Academy)",
    provider: "HubSpot Academy",
    type: "cert",
    cost: "free",
    // process definition and pipeline discipline
    url: "https://academy.hubspot.com/courses/sales-manager-training-program",
    durationHours: 3,
    skillsAddressed: ["Customer Acquisition Management", "Sales Closure"],
    creditingBody: "HubSpot Academy",
    careerId: "sales",
  },
  {
    id: "res-sales-trailhead",
    title: "Trailhead (Salesforce)",
    provider: "Salesforce",
    type: "course",
    cost: "free",
    // hands-on CRM-operations practice modules; some modules need a free
    // Salesforce dev org; badge-driven
    url: "https://trailhead.salesforce.com/",
    durationHours: 4,
    skillsAddressed: [
      "Customer Relationship Management + Customer Relationship Management Operations",
       
    ],
    careerId: "sales",
  },
  {
    id: "res-sales-wharton-customer-analytics",
    title: "Customer Analytics (Wharton)",
    provider: "Coursera (Wharton)",
    type: "course",
    cost: "free",
    // evidence-based buyer-behavior reading; audit free, certificate paid
    url: "https://www.coursera.org/learn/wharton-customer-analytics",
    durationHours: 12,
    skillsAddressed: ["Customer Behavior Analysis"],
    careerId: "sales",
    pick: true,
  },
  {
    id: "res-sales-top-customer-centricity",
    title: "TOP — Customer Centricity (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free)
    url: "https://e-tesda.gov.ph/course/view.php?id=5043",
    durationHours: 2,
    skillsAddressed: ["Communication · Collaboration · Customer Orientation · Global Perspective · Problem Solving (Enabling)"],
    creditingBody: "TESDA",
    careerId: "sales",
    pick: true,
  },
  {
    id: "res-sales-rutgers-scm",
    title: "Supply Chain Management Specialization (Rutgers)",
    provider: "Coursera",
    type: "course",
    cost: "free",
    // the delivery half of sales — order flow, logistics coordination
    url: "https://www.coursera.org/specializations/supply-chain-management",
    durationHours: 30,
    skillsAddressed: ["Order Fulfilment Administration", "Sales Delivery + Delivery Management"],
    careerId: "sales",
    pick: true,
  },
  {
    id: "res-sales-top-interpersonal",
    title: "TOP — Interpersonal Skills (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free)
    url: "https://e-tesda.gov.ph/course/view.php?id=5040",
    durationHours: 2,
    skillsAddressed: ["Communication · Collaboration · Customer Orientation · Global Perspective · Problem Solving (Enabling)"],
    creditingBody: "TESDA",
    careerId: "sales",
  },
  {
    id: "res-sales-top-self-presentation",
    title: "TOP — Self-Presentation (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // client-facing presence for on-site visits; login-walled (TOP account free)
    url: "https://e-tesda.gov.ph/course/view.php?id=5038",
    durationHours: 2,
    skillsAddressed: ["Communication · Collaboration · Customer Orientation · Global Perspective · Problem Solving (Enabling)"],
    creditingBody: "TESDA",
    careerId: "sales",
  },
  {
    id: "res-sales-gap-negotiation",
    title: "Sales-negotiation practice — declared thin (no verified free course)",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["Customer Acquisition Management"],
    careerId: "sales",
  },
  {
    id: "res-sales-gap-quotation-paperwork",
    title: "Quotation/pricing-paperwork practice — declared thin",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["Contract and Vendor Management"],
    careerId: "sales",
  },
  {
    id: "res-sales-gap-breadth",
    title: "Broad sales-course library zone — declared thin (the paid LinkedIn path exists and stays out of the pool per the free-only rule)",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["Communication · Collaboration · Customer Orientation · Global Perspective · Problem Solving (Enabling)"],
    careerId: "sales",
  },
  // ── csr (3.5) ──
  {
    id: "res-csr-csf-coursera",
    title: "Customer Service Fundamentals (Coursera Knowledge Accelerators)",
    provider: "Coursera",
    type: "course",
    cost: "free",
    // lesson list on-page: SLAs, service standards, call flow standards,
    // ticketing systems, CRM tools — the corporate service loop in course form
    url: "https://www.coursera.org/learn/customer-service-fundamentals",
    durationHours: 4,
    skillsAddressed: [
      "Perform customer service delivery processes", "Customer Service Delivery",
      "Customer Relationship Management", "Demonstrate ability to effectively engage customers",
    ],
    careerId: "csr",
    pick: true,
  },
  {
    id: "res-csr-top-customer-centricity",
    title: "TOP — Customer Centricity (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free)
    url: "https://e-tesda.gov.ph/course/view.php?id=5043",
    durationHours: 2,
    skillsAddressed: ["Customer Handling and Care", "Collaboration · Communication · Customer Orientation · Digital Fluency · Problem Solving · Global Perspective (Enabling, Basic/Intermediate)"],
    creditingBody: "TESDA",
    careerId: "csr",
    pick: true,
  },
  {
    id: "res-csr-british-council",
    title: "Learn English (British Council)",
    provider: "British Council",
    type: "doc",
    cost: "free",
    // fetched successfully via the tool (fee resources structure incl.
    // A1–C1 listening/grammar); direct curl failed this session — recorded
    // honestly; optional clean browser verify before print copy
    url: "https://learnenglish.britishcouncil.org/",
    durationHours: 2,
    skillsAddressed: ["Communicate effectively in English for customer service"],
    careerId: "csr",
  },
  {
    id: "res-csr-bbc-learning-english",
    title: "BBC Learning English",
    provider: "BBC",
    type: "doc",
    cost: "free",
    // daily-free English practice; data-friendly pages; no account
    url: "https://www.bbc.co.uk/learningenglish",
    durationHours: 2,
    skillsAddressed: ["Communicate effectively in English for customer service"],
    careerId: "csr",
    pick: true,
  },
  {
    id: "res-csr-top-english-business",
    title: "TOP — English for Business and Entrepreneurship (Language Literacy)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free)
    url: "https://e-tesda.gov.ph/course/view.php?id=2801",
    durationHours: 3,
    skillsAddressed: ["Communicate effectively in English for customer service"],
    creditingBody: "TESDA",
    careerId: "csr",
  },
  {
    id: "res-csr-trailhead",
    title: "Trailhead (Salesforce)",
    provider: "Salesforce",
    type: "course",
    cost: "free",
    url: "https://trailhead.salesforce.com/",
    durationHours: 4,
    skillsAddressed: ["Customer Relationship Management", "Technology and Systems Application"],
    careerId: "csr",
    pick: true,
  },
  {
    id: "res-csr-ra10173",
    title: "Republic Act No. 10173 (Data Privacy Act of 2012)",
    provider: "Lawphil Project",
    type: "doc",
    cost: "free",
    // PSF-CCB invokes RA 10173; privacy.gov.ph 403 this session — lawphil
    // carries the working statute text
    url: "https://lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html",
    durationHours: 2,
    skillsAddressed: ["Compliance with Legal Regulations"],
    careerId: "csr",
    pick: true,
  },
  {
    id: "res-csr-ms-learn",
    title: "Microsoft Learn (Training catalog)",
    provider: "Microsoft Learn",
    type: "doc",
    cost: "free",
    url: "https://learn.microsoft.com/en-us/training/",
    durationHours: 4,
    skillsAddressed: [],
    careerId: "csr",
  },
  {
    id: "res-csr-top-interpersonal",
    title: "TOP — Interpersonal Skills (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free)
    url: "https://e-tesda.gov.ph/course/view.php?id=5040",
    durationHours: 2,
    skillsAddressed: ["Collaboration · Communication · Customer Orientation · Digital Fluency · Problem Solving · Global Perspective (Enabling, Basic/Intermediate)"],
    creditingBody: "TESDA",
    careerId: "csr",
  },
  {
    id: "res-csr-top-writing",
    title: "TOP — Impactful Writing Skills (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free); end-of-call email/follow-up writing
    url: "https://e-tesda.gov.ph/course/view.php?id=5037",
    durationHours: 2,
    skillsAddressed: ["Collaboration · Communication · Customer Orientation · Digital Fluency · Problem Solving · Global Perspective (Enabling, Basic/Intermediate)"],
    creditingBody: "TESDA",
    careerId: "csr",
  },
  {
    id: "res-csr-gap-dialer",
    title: "Telephony/dialer-tool hands-on — declared thin",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["Technology and Systems Application"],
    careerId: "csr",
  },
  {
    id: "res-csr-gap-invoicing",
    title: "Invoicing/payment-task practice ([PSOC 4222 d]) — declared thin",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["Perform customer service delivery processes"],
    careerId: "csr",
  },
  // ── opsanalyst (3.6) ──
  {
    id: "res-ops-wharton-customer-analytics",
    title: "Customer Analytics (Wharton)",
    provider: "Coursera (Wharton)",
    type: "course",
    cost: "free",
    // structured analysis of business data; audit free, certificate paid
    url: "https://www.coursera.org/learn/wharton-customer-analytics",
    durationHours: 12,
    skillsAddressed: ["Data analysis & solution framing", "Information gathering & organizing"],
    careerId: "opsanalyst",
  },
  {
    id: "res-ops-ibm-design-thinking",
    title: "IBM Enterprise Design Thinking (badges)",
    provider: "IBM",
    type: "course",
    cost: "free",
    // observation-to-recommendation discipline taught as a repeatable method
    url: "https://www.ibm.com/design/thinking",
    durationHours: 6,
    skillsAddressed: [
      "Process study planning (scoping the study of work problems)",
      "Information gathering & organizing",
      "On-site observation & interviewing",
      "Data analysis & solution framing",
      "Findings documentation & recommendation write-ups",
      "Communication · Critical Thinking · Teamwork (Enabling)",
    ],
    careerId: "opsanalyst",
    pick: true,
  },
  {
    id: "res-ops-gcf-excel",
    title: "Excel (Foundations) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    // data pulls, workbooks, charts for findings memos
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: [],
    careerId: "opsanalyst",
  },
  {
    id: "res-ops-ms-learn",
    title: "Microsoft Learn (Training catalog)",
    provider: "Microsoft Learn",
    type: "doc",
    cost: "free",
    // documentation/diagrams tooling practice
    url: "https://learn.microsoft.com/en-us/training/",
    durationHours: 4,
    skillsAddressed: [],
    careerId: "opsanalyst",
  },
  {
    id: "res-ops-top-bizops",
    title: "TOP — Managing Business Operation (iSTAR Program)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // PH-built business-operations administration; login-walled (TOP account free)
    url: "https://e-tesda.gov.ph/course/view.php?id=4810",
    durationHours: 3,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "opsanalyst",
  },
  {
    id: "res-ops-top-writing",
    title: "TOP — Impactful Writing Skills (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=5037",
    durationHours: 2,
    skillsAddressed: ["Communication · Critical Thinking · Teamwork (Enabling)"],
    creditingBody: "TESDA",
    careerId: "opsanalyst",
    pick: true,
  },
  {
    id: "res-ops-lhtl",
    title: "Learning How to Learn",
    provider: "Coursera (McMaster & U Ottawa)",
    type: "course",
    cost: "free",
    url: "https://www.coursera.org/learn/learning-how-to-learn",
    durationHours: 4,
    skillsAddressed: [],
    careerId: "opsanalyst",
  },
  {
    id: "res-ops-gap-process-mapping",
    title: "Process-mapping notation practice — declared thin",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["Process study planning (scoping the study of work problems)"],
    careerId: "opsanalyst",
  },
  {
    id: "res-ops-gap-sql",
    title: "SQL/data-pull practice — declared thin (no verified free resource)",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["Data analysis & solution framing"],
    careerId: "opsanalyst",
  },
  // ── purch (3.7) — RA 9184 caveat + portal start-here ruling carried ──
  {
    id: "res-purch-rutgers-scm",
    title: "Supply Chain Management Specialization (Rutgers)",
    provider: "Coursera",
    type: "course",
    cost: "free",
    // SCM fundamentals incl. sourcing/procurement/logistics
    url: "https://www.coursera.org/specializations/supply-chain-management",
    durationHours: 30,
    skillsAddressed: ["Purchase order issuance & requisition review", "Records & shipment monitoring", "Supplier research & evaluation"],
    careerId: "purch",
    pick: true,
  },
  {
    id: "res-purch-gcf-excel",
    title: "Excel (Foundations) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    // bid comparison matrices and price analysis
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: [],
    careerId: "purch",
  },
  {
    id: "res-purch-ra9184-irr",
    title: "IRR of RA 9184 (Government Procurement Reform Act) — GPPB",
    provider: "GPPB-TSO (official PH government document)",
    type: "doc",
    cost: "free",
    // RA 9184 caveat renders wherever this resource does (ruled
    // fixture-ready, 2026-10-29): "governs public procurement;
    // private-sector practice borrows its discipline."
    url: "https://www.gppb.gov.ph/laws/RA-9184/",
    durationHours: 3,
    skillsAddressed: ["Legal & policy compliance (procurement rules)"],
    careerId: "purch",
    pick: true,
  },
  {
    id: "res-purch-philgeps",
    title: "PS-PhilGEPS — Official portal — start here for live PH e-procurement context (deep bid pages need an account; not cited)",
    provider: "PS-PhilGEPS (official PH portal)",
    type: "doc",
    cost: "free",
    // portal-as-start-here ruling 2026-10-29
    url: "https://www.philgeps.gov.ph/",
    durationHours: 1,
    skillsAddressed: ["Supplier research & evaluation", "Market watching (supply/demand, price trends)"],
    careerId: "purch",
    pick: true,
  },
  {
    id: "res-purch-ms-learn",
    title: "Microsoft Learn (Training catalog)",
    provider: "Microsoft Learn",
    type: "doc",
    cost: "free",
    url: "https://learn.microsoft.com/en-us/training/",
    durationHours: 4,
    skillsAddressed: [],
    careerId: "purch",
  },
  {
    id: "res-purch-wharton-customer-analytics",
    title: "Customer Analytics (Wharton)",
    provider: "Coursera (Wharton)",
    type: "course",
    cost: "free",
    // data-driven decision method (cross-supply version of buying analytics)
    url: "https://www.coursera.org/learn/wharton-customer-analytics",
    durationHours: 12,
    skillsAddressed: [],
    careerId: "purch",
  },
  {
    id: "res-purch-top-professionalism",
    title: "TOP — Professionalism (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // vendor-conduct module; login-walled (TOP account free)
    url: "https://e-tesda.gov.ph/course/view.php?id=5042",
    durationHours: 2,
    skillsAddressed: ["Communication · Critical Thinking · Ethics/Professionalism (Enabling)"],
    creditingBody: "TESDA",
    careerId: "purch",
    pick: true,
  },
  {
    id: "res-purch-top-writing",
    title: "TOP — Impactful Writing Skills (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // PO/requisition/spec write-ups; login-walled (TOP account free)
    url: "https://e-tesda.gov.ph/course/view.php?id=5037",
    durationHours: 2,
    skillsAddressed: ["Communication · Critical Thinking · Ethics/Professionalism (Enabling)"],
    creditingBody: "TESDA",
    careerId: "purch",
  },
  {
    id: "res-purch-gap-negotiation",
    title: "Negotiation practice — declared thin (no free verified negotiation course)",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["Price-proposal analysis"],
    careerId: "purch",
  },
  {
    id: "res-purch-gap-private-proc-law",
    title: "Private-sector procurement law specifics — declared thin (RA 9184 covers the public side; CIPS is paid — not cited)",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["Legal & policy compliance (procurement rules)"],
    careerId: "purch",
  },
  {
    id: "res-purch-gap-inventory-erp",
    title: "Inventory-ERP hands-on — declared thin (tooling docs only)",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["Records & shipment monitoring"],
    careerId: "purch",
  },
  // ── ccqa (3.8) ──
  {
    id: "res-ccqa-lss-white-belt",
    title: "Lean Six Sigma: White Belt",
    provider: "Alison",
    type: "course",
    cost: "free",
    // quality-methodology foundation (defect thinking, waste, improvement
    // cycles); study free, certificate purchase optional
    url: "https://alison.com/course/lean-six-sigma-white-belt",
    durationHours: 3,
    skillsAddressed: ["Continuous Improvement", "Systems Thinking"],
    careerId: "ccqa",
    pick: true,
  },
  {
    id: "res-ccqa-wharton-customer-analytics",
    title: "Customer Analytics (Wharton)",
    provider: "Coursera (Wharton)",
    type: "course",
    cost: "free",
    // customer-behavior/metrics analysis at university depth
    url: "https://www.coursera.org/learn/wharton-customer-analytics",
    durationHours: 12,
    skillsAddressed: ["Data Analytics", "Data Visualization", "Customer Behavior Analysis"],
    careerId: "ccqa",
    pick: true,
  },
  {
    id: "res-ccqa-gcf-excel",
    title: "Excel (Foundations) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    // charts, dashboards and audit trackers
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: ["Data Visualization"],
    careerId: "ccqa",
    pick: true,
  },
  {
    id: "res-ccqa-top-writing",
    title: "TOP — Impactful Writing Skills (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=5037",
    durationHours: 2,
    skillsAddressed: ["Technical Report Writing"],
    creditingBody: "TESDA",
    careerId: "ccqa",
    pick: true,
  },
  {
    id: "res-ccqa-ms-learn",
    title: "Microsoft Learn (Training catalog)",
    provider: "Microsoft Learn",
    type: "doc",
    cost: "free",
    // document-systems fluency (share, version, retrieve)
    url: "https://learn.microsoft.com/en-us/training/",
    durationHours: 4,
    skillsAddressed: [],
    careerId: "ccqa",
  },
  {
    id: "res-ccqa-top-customer-centricity",
    title: "TOP — Customer Centricity (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=5043",
    durationHours: 2,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "ccqa",
  },
  {
    id: "res-ccqa-top-bizops",
    title: "TOP — Managing Business Operation (iSTAR Program)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=4810",
    durationHours: 3,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "ccqa",
  },
  {
    id: "res-ccqa-ibm-design-thinking",
    title: "Enterprise Design Thinking (IBM)",
    provider: "IBM",
    type: "course",
    cost: "free",
    // structured feedback and stakeholder-loop practice
    url: "https://www.ibm.com/design/thinking",
    durationHours: 6,
    skillsAddressed: [],
    careerId: "ccqa",
  },
  {
    id: "res-ccqa-gap-calibration",
    title: "Call-scoring rubric design / calibration facilitation — the honest hole",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["Continuous Improvement"],
    careerId: "ccqa",
  },
  // ── events (3.9) — permit PH-note rides the row; gaps declared ──
  {
    id: "res-events-alison-corporate",
    title: "Corporate Event Planning Essentials",
    provider: "Alison",
    type: "course",
    cost: "free",
    // corporate-events orientation matching the catalog variant; study free,
    // certificate optional
    url: "https://alison.com/course/corporate-event-planning-essentials",
    durationHours: 3,
    skillsAddressed: [
      "Client objectives & requirements determination", "Event services coordination",
      "Provider evaluation & selection; contract negotiation", "Facility inspection & conformity",
      "Program, agenda, budget & services planning", "Participant registration",
      "Event-records keeping (incl. financials)", "Event monitoring, compliance & problem resolution",
    ],
    careerId: "events",
    pick: true,
  },
  {
    id: "res-events-alison-diploma",
    title: "Diploma in Events Management",
    provider: "Alison",
    type: "course",
    cost: "free",
    // full events-management arc incl. vendor, budgeting and on-the-day
    // coordination (10–15 h per its own page); CPD-accredited certificate optional
    url: "https://alison.com/course/diploma-in-events-management",
    durationHours: 12,
    skillsAddressed: ["Program, agenda, budget & services planning", "Event services coordination"],
    careerId: "events",
  },
  {
    id: "res-events-alison-fundamentals",
    title: "Fundamentals of Events Management",
    provider: "Alison",
    type: "course",
    cost: "free",
    url: "https://alison.com/course/fundamentals-of-events-management",
    durationHours: 3,
    skillsAddressed: ["Participant registration", "Event services coordination"],
    careerId: "events",
  },
  {
    id: "res-events-google-pm",
    title: "Google Project Management Professional Certificate",
    provider: "Coursera (Google)",
    type: "cert",
    cost: "free",
    // vendor coordination, scheduling, budget tracking and stakeholder comms;
    // audit free, verified certificate paid (financial aid available)
    url: "https://www.coursera.org/professional-certificates/google-project-management",
    durationHours: 100,
    skillsAddressed: ["Provider evaluation & selection; contract negotiation"],
    careerId: "events",
  },
  {
    id: "res-events-gcf-excel",
    title: "Excel (Foundations) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    // registration lists, RSVP trackers, budget ledgers
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: ["Event-records keeping (incl. financials)"],
    careerId: "events",
  },
  {
    id: "res-events-mpi",
    title: "Meeting Professionals International (MPI) — association resource site",
    provider: "MPI",
    type: "doc",
    cost: "free",
    // the global meeting-professional body — industry standards, education
    // vocab; SPA title honestly recorded (empty <title> via curl; page
    // strings verified ×7 — re-verify visually before deep-linking in UI)
    url: "https://www.mpi.org/",
    durationHours: 2,
    skillsAddressed: [],
    careerId: "events",
  },
  {
    id: "res-events-top-customer-centricity",
    title: "TOP — Customer Centricity (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=5043",
    durationHours: 2,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "events",
  },
  {
    id: "res-events-top-writing",
    title: "TOP — Impactful Writing Skills (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=5037",
    durationHours: 2,
    skillsAddressed: ["Communication · Professionalism · Teamwork (Enabling)"],
    creditingBody: "TESDA",
    careerId: "events",
  },
  {
    id: "res-events-top-self-presentation",
    title: "TOP — Self-Presentation (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=5038",
    durationHours: 2,
    skillsAddressed: ["Communication · Professionalism · Teamwork (Enabling)"],
    creditingBody: "TESDA",
    careerId: "events",
    pick: true,
  },
  {
    id: "res-events-gap-ph-permits",
    title: "PH venue/LGU permit practice — declared thin (O*NET's permit task is US-institutional; the PH note rides the row)",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["Event monitoring, compliance & problem resolution"],
    careerId: "events",
  },
  {
    id: "res-events-gap-event-software",
    title: "Event-management software hands-on (EMS/Cvent-class) — declared thin",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["Event services coordination"],
    careerId: "events",
  },
  // == ── Track 3 · Accounting & Finance (book · acctclerk · pay · fas · fin ·
  // treasury · coll · credit · teller · audit) — blessed role-spec pools ────
  // ── book (4.1) — TOP modules 1:1 to TR units (categoryid=1764 verified) ──
  {
    id: "res-book-top-intro-bookkeeping",
    title: "Introduction to Bookkeeping (TOP Bookkeeping NC III module)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // free regulator-run orientation module to the whole Bookkeeping NC III cycle
    // audit (2026-11-03, mockup draft): TOP module — free, e-tesda signup
    url: "https://e-tesda.gov.ph/course/view.php?id=3981",
    durationHours: 3,
    skillsAddressed: ["Journalize transactions"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "book",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Journalize transactions":
        "TESDA's own NC III entry module — the journal cycle, source documents, and the 100%-accuracy discipline the unit prints.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-book-top-journalizing",
    title: "Journalizing Transactions (TOP Bookkeeping NC III module)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // the official free module of the journalizing unit
    // audit (2026-11-03, mockup draft): TOP module — free, e-tesda signup
    url: "https://e-tesda.gov.ph/course/view.php?id=3982",
    durationHours: 4,
    skillsAddressed: ["Journalize transactions"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "book",
    form: "taught",
    access: "account",
  },
  {
    id: "res-book-top-posting",
    title: "Posting Transactions (TOP Bookkeeping NC III module)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // audit (2026-11-03, mockup draft): TOP module — free, e-tesda signup
    url: "https://e-tesda.gov.ph/course/view.php?id=3983",
    durationHours: 4,
    skillsAddressed: ["Post transactions"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "book",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Post transactions":
        "The official module: journal-to-ledger transfer with cross-checks — exactly the posting accuracy the unit prints.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-book-top-trial-balance",
    title: "Preparing Trial Balance (TOP Bookkeeping NC III module)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // audit (2026-11-03, mockup draft): TOP module — free, e-tesda signup
    url: "https://e-tesda.gov.ph/course/view.php?id=4029",
    durationHours: 4,
    skillsAddressed: ["Prepare trial balance"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "book",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Prepare trial balance":
        "Balancing the ledger into a trial balance the TESDA way — extraction, footing, and error chasing.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-book-top-financial-reports",
    title: "Preparing Financial Reports (TOP Bookkeeping NC III module)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // audit (2026-11-03, mockup draft): TOP module — free, e-tesda signup
    url: "https://e-tesda.gov.ph/course/view.php?id=4030",
    durationHours: 4,
    skillsAddressed: ["Prepare financial reports (manual)"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "book",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Prepare financial reports (manual)":
        "Hand-built financial statements from the ledger — the statement set and the accounting-equation checks that hold them together.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-book-top-internal-control",
    title: "Reviewing Internal Control System (TOP Bookkeeping NC III module)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // audit (2026-11-03, mockup draft): TOP module — free, e-tesda signup
    url: "https://e-tesda.gov.ph/course/view.php?id=4017",
    durationHours: 4,
    skillsAddressed: ["Review internal control system"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "book",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Review internal control system":
        "Walks the basic control checks — segregation of duties, verification steps, and the weak spots an NC III bookkeeper watches.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-book-acca-intro",
    title: "Introduction to Bookkeeping (ACCA-X on edX)",
    provider: "ACCA-X (edX)",
    type: "course",
    cost: "free",
    // ACCA's free course — business transactions, the banking system and
    // double-entry bookkeeping (ACCA-X copy verified)
    // audit (2026-11-03, mockup draft): ACCA-X free course; certificate paid;
    // the Verify-and-record winner (taught + creditingBody + id A–Z)
    url: "https://www.edx.org/course/introduction-to-bookkeeping-2",
    durationHours: 30,
    skillsAddressed: ["Journalize transactions", "Post transactions", "Verify and record financial documents & records"],
    creditingBody: "ACCA-X",
    careerId: "book",
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Verify and record financial documents & records":
        "ACCA's accredited intro drills double-entry against source documents — verifying figures and records before anything is journaled, the checking loop the O*NET row prints.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-book-acca-intermediate",
    title: "Intermediate Bookkeeping (ACCA-X on edX)",
    provider: "ACCA-X (edX)",
    type: "course",
    cost: "free",
    // "prepares financial statements" building on intro bookkeeping
    // audit (2026-11-03, mockup draft): ACCA-X free course; certificate paid
    url: "https://www.edx.org/course/intermediate-bookkeeping-2",
    durationHours: 30,
    skillsAddressed: ["Prepare trial balance", "Prepare financial reports (manual)"],
    creditingBody: "ACCA-X",
    careerId: "book",
    form: "taught",
    access: "exam-paid",
  },
  {
    id: "res-book-intuit-basics",
    title: "Bookkeeping basics (Intuit)",
    provider: "Coursera (Intuit)",
    type: "course",
    cost: "free",
    // "Enroll for free" + Full-Course-No-Certificate option confirmed on the
    // page; Intuit (QuickBooks) authored — the O*NET hot accounting-software family
    // audit (2026-11-03, mockup draft): Enroll free / No-Certificate track
    // confirmed (fixture note) → exam-paid; the Operate-accounting-software winner
    url: "https://www.coursera.org/learn/bookkeeping-basics",
    durationHours: 10,
    skillsAddressed: [
      "Journalize transactions", "Post transactions", "Prepare trial balance",
      "Verify and record financial documents & records", "Operate accounting software",
    ],
    careerId: "book",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Operate accounting software":
        "QuickBooks-authored basics: recording transactions and reconciling inside real accounting software — the ERP/data-entry fluency the O*NET row prints.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-book-openstax-financial",
    title: "Principles of Accounting, Volume 1: Financial Accounting (OpenStax)",
    provider: "OpenStax (free textbook)",
    type: "doc",
    cost: "free",
    // free OER text covering the full statement set + bookkeeping principles
    // audit (2026-11-03, mockup draft): structured textbook + exercises, open
    // access; the PSOC-envelope winner
    url: "https://openstax.org/details/books/principles-financial-accounting",
    durationHours: 6,
    skillsAddressed: ["Prepare financial reports (manual)", "PSOC 3313 record-to-report envelope"],
    careerId: "book",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "PSOC 3313 record-to-report envelope":
        "The free textbook walks the full record-to-report arc — journals to ledgers to the statement set, with end-of-chapter exercises — the PSOC envelope in book form.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-book-openstax-managerial",
    title: "Principles of Accounting, Volume 2: Managerial Accounting (OpenStax)",
    provider: "OpenStax (free textbook)",
    type: "doc",
    cost: "free",
    // internal-control chapter context (controls, segregation)
    // audit (2026-11-03, mockup draft): readable chapter context = reference
    url: "https://openstax.org/details/books/principles-managerial-accounting",
    durationHours: 6,
    skillsAddressed: ["Review internal control system"],
    careerId: "book",
    form: "reference",
    access: "direct",
  },
  {
    id: "res-book-psf-gih-doc",
    title: "Philippine Skills Framework for Global In-House Center (official PDF)",
    provider: "TESDA",
    type: "doc",
    cost: "free",
    // prints the Internal Controls FSC ladder + the F&A record-to-report envelope
    // audit (2026-11-03): TESDA PDF hub → reference, open access
    url: "https://www.tesda.gov.ph/Uploads/File/Philippine%20Skills%20Framework/ICT/Philippine%20Skills%20Framework%20for%20Global%20In-House%20Center.pdf",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "book",
    form: "reference",
    access: "direct",
  },
  {
    id: "res-book-gcf-excel",
    title: "Excel (topic hub) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    // audit (2026-11-03, mockup draft): topic hub = landing; individual lesson
    // titles live behind it
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: ["Verify and record financial documents & records"],
    careerId: "book",
    pick: true,
    form: "landing",
    access: "account",
  },
  {
    id: "res-book-top-workplace-comms",
    title: "Participating in Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, mockup draft): TOP module — free, e-tesda signup
    url: "https://e-tesda.gov.ph/course/view.php?id=56",
    durationHours: 2,
    skillsAddressed: ["Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Self Management (Enabling)"],
    creditingBody: "TESDA",
    careerId: "book",
    form: "taught",
    access: "account",
  },
  {
    id: "res-book-top-receiving-comms",
    title: "Receiving and Responding to Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, mockup draft): TOP module — free, e-tesda signup;
    // the Enabling-bundle winner (id A–Z over workplace-comms)
    url: "https://e-tesda.gov.ph/course/view.php?id=52",
    durationHours: 2,
    skillsAddressed: ["Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Self Management (Enabling)"],
    creditingBody: "TESDA",
    careerId: "book",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Self Management (Enabling)":
        "TESDA's workplace-communication module: receive, respond, relay — the enabling row's daily practice.",
    },
    // learn draft — user review pending
  },
  {
    id: "res-book-top-digital-literacy-cat",
    title: "Digital Literacy course category (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // category page (200); individual course titles not itemized this pass — flagged
    // audit (2026-11-03, mockup draft): category page = landing; e-tesda signup
    url: "https://e-tesda.gov.ph/course/index.php?categoryid=1310",
    durationHours: 4,
    skillsAddressed: ["Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Self Management (Enabling)"],
    creditingBody: "TESDA",
    careerId: "book",
    form: "landing",
    access: "account",
  },
  // ── acctclerk (4.2) — source-verbatim row names per V-acctclerk-3 ──
  {
    id: "res-acct-gcf-excel",
    title: "Excel (topic hub) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: [
      "Check figures, postings, and documents for correct entry, mathematical accuracy, and proper codes",
      "Operate computers programmed with accounting software",
      "Reconcile or note and report discrepancies found in records",
      
    ],
    careerId: "acctclerk",
    pick: true,
  },
  {
    id: "res-acct-intuit-basics",
    title: "Bookkeeping basics (Intuit)",
    provider: "Coursera (Intuit)",
    type: "course",
    cost: "free",
    url: "https://www.coursera.org/learn/bookkeeping-basics",
    durationHours: 10,
    skillsAddressed: [
      "Check figures, postings, and documents for correct entry, mathematical accuracy, and proper codes",
      "Operate computers programmed with accounting software",
      "PSOC 4311 record-keeping envelope",
    ],
    careerId: "acctclerk",
  },
  {
    id: "res-acct-acca-intro",
    title: "Introduction to Bookkeeping (ACCA-X on edX)",
    provider: "ACCA-X (edX)",
    type: "course",
    cost: "free",
    // double-entry + banking-system accuracy + reconciliation practice
    url: "https://www.edx.org/course/introduction-to-bookkeeping-2",
    durationHours: 30,
    skillsAddressed: [
      "Check figures, postings, and documents for correct entry, mathematical accuracy, and proper codes",
      "Classify, record, and summarize numerical and financial data to compile and keep financial records, using journals and ledgers or computers",
      "Reconcile or note and report discrepancies found in records",
      "Receive, record, and bank cash, checks, and vouchers (petty cash / collections recording)",
    ],
    creditingBody: "ACCA-X",
    careerId: "acctclerk",
    pick: true,
  },
  {
    id: "res-acct-acca-intermediate",
    title: "Intermediate Bookkeeping (ACCA-X on edX)",
    provider: "ACCA-X (edX)",
    type: "course",
    cost: "free",
    url: "https://www.edx.org/course/intermediate-bookkeeping-2",
    durationHours: 30,
    skillsAddressed: ["Prepare and issue account statements / bills / invoices"],
    creditingBody: "ACCA-X",
    careerId: "acctclerk",
    pick: true,
  },
  {
    id: "res-acct-cfi-basic-excel",
    title: "Basic Excel Formulas for Beginners (CFI free resource)",
    provider: "Corporate Finance Institute",
    type: "doc",
    cost: "free",
    // free formula reference aligned to finance work; English-only
    url: "https://corporatefinanceinstitute.com/resources/excel/basic-excel-formulas-beginners/",
    durationHours: 2,
    skillsAddressed: ["Operate computers programmed with accounting software"],
    careerId: "acctclerk",
    pick: true,
  },
  {
    id: "res-acct-openstax-financial",
    title: "Principles of Accounting, Volume 1: Financial Accounting (OpenStax)",
    provider: "OpenStax (free textbook)",
    type: "doc",
    cost: "free",
    url: "https://openstax.org/details/books/principles-financial-accounting",
    durationHours: 6,
    skillsAddressed: [
      "Classify, record, and summarize numerical and financial data to compile and keep financial records, using journals and ledgers or computers",
      "PSOC 4311 record-keeping envelope",
    ],
    careerId: "acctclerk",
    pick: true,
  },
  {
    id: "res-acct-top-journalizing",
    title: "Journalizing Transactions (TOP Bookkeeping NC III module)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=3982",
    durationHours: 4,
    skillsAddressed: [
      "Classify, record, and summarize numerical and financial data to compile and keep financial records, using journals and ledgers or computers",
      "Journalize/post transactions (bookkeeping cycle)",
    ],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "acctclerk",
    pick: true,
  },
  {
    id: "res-acct-top-posting",
    title: "Posting Transactions (TOP Bookkeeping NC III module)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=3983",
    durationHours: 4,
    skillsAddressed: [
      "Classify, record, and summarize numerical and financial data to compile and keep financial records, using journals and ledgers or computers",
      "Journalize/post transactions (bookkeeping cycle)",
    ],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "acctclerk",
  },
  {
    id: "res-acct-dole-handbook",
    title: "Workers' Statutory Monetary Benefits Handbook 2024 (DOLE-BWC, official NWPC mirror)",
    provider: "DOLE-Bureau of Working Conditions (hosted by DOLE-NWPC)",
    type: "doc",
    cost: "free",
    // official free government handbook; NOT FOR SALE; bwc.dole.gov.ph home
    // 403 this session — the NWPC mirror is the official agency copy
    // (re-verify BWC URL when DOLE is reachable)
    url: "https://nwpc.dole.gov.ph/wp-content/uploads/2024/11/Workers-Statutory-Monetary-Benefits-Handbook-2024-Edition.pdf",
    durationHours: 3,
    skillsAddressed: ["Government forms & compliance paperwork"],
    careerId: "acctclerk",
  },
  {
    id: "res-acct-ra10173",
    title: "Republic Act No. 10173 (Data Privacy Act of 2012)",
    provider: "Lawphil Project",
    type: "doc",
    cost: "free",
    // privacy.gov.ph 403 this session — cite the official register when reachable
    url: "https://lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html",
    durationHours: 2,
    skillsAddressed: ["Government forms & compliance paperwork"],
    careerId: "acctclerk",
    pick: true,
  },
  {
    id: "res-acct-top-workplace-comms",
    title: "Participating in Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=56",
    durationHours: 2,
    skillsAddressed: ["Communication · Professionalism · Critical Thinking (Enabling)"],
    creditingBody: "TESDA",
    careerId: "acctclerk",
  },
  {
    id: "res-acct-top-receiving-comms",
    title: "Receiving and Responding to Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=52",
    durationHours: 2,
    skillsAddressed: ["Communication · Professionalism · Critical Thinking (Enabling)"],
    creditingBody: "TESDA",
    careerId: "acctclerk",
    pick: true,
  },
  // ── pay (4.3) — portals = labeled start-here placeholders (ruling) ──
  {
    id: "res-pay-dole-handbook",
    title: "Workers' Statutory Monetary Benefits Handbook 2024 (DOLE-BWC, official NWPC mirror)",
    provider: "DOLE-Bureau of Working Conditions (hosted by DOLE-NWPC)",
    type: "doc",
    cost: "free",
    // official free handbook covering holiday/premium/NSD/13th-month
    // computation; check for a newer edition each year
    url: "https://nwpc.dole.gov.ph/wp-content/uploads/2024/11/Workers-Statutory-Monetary-Benefits-Handbook-2024-Edition.pdf",
    durationHours: 3,
    skillsAddressed: [
      "Verify attendance, hours worked, and pay adjustments, and post information onto designated records",
      "Compute wages and deductions, and enter data into computers",
      "Keep leave records",
    ],
    careerId: "pay",
    pick: true,
  },
  {
    id: "res-pay-sss",
    title: "SSS — Official portal — start here for SSS contribution context (deep contribution-table pages unplaced/unreachable)",
    provider: "Social Security System (PH regulator)",
    type: "doc",
    cost: "free",
    // keep-with-flag ruling 2026-10-29: portals stand only as labeled
    // start-here placeholders; deep-link when reachable
    url: "https://www.sss.gov.ph/",
    durationHours: 1,
    skillsAddressed: ["Compute wages and deductions, and enter data into computers"],
    careerId: "pay",
  },
  {
    id: "res-pay-philhealth",
    title: "PhilHealth — Official portal — start here for statutory health-contribution context (deep pages unplaced/unreachable)",
    provider: "PhilHealth (PH regulator)",
    type: "doc",
    cost: "free",
    url: "https://www.philhealth.gov.ph/",
    durationHours: 1,
    skillsAddressed: ["Compute wages and deductions, and enter data into computers"],
    careerId: "pay",
  },
  {
    id: "res-pay-pagibig",
    title: "Pag-IBIG (HDMF) — Official portal — start here for statutory savings-contribution context (deep pages unplaced/unreachable)",
    provider: "Home Development Mutual Fund (PH regulator)",
    type: "doc",
    cost: "free",
    url: "https://www.pagibigfund.gov.ph/",
    durationHours: 1,
    skillsAddressed: ["Compute wages and deductions, and enter data into computers"],
    careerId: "pay",
    pick: true,
  },
  {
    id: "res-pay-gcf-excel",
    title: "Excel (topic hub) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: [
      "Verify attendance, hours worked, and pay adjustments, and post information onto designated records",
      "Prepare and balance period-end reports, and reconcile issued payrolls to bank statements",
      "Keep leave records",
    ],
    careerId: "pay",
    pick: true,
  },
  {
    id: "res-pay-acca-intro",
    title: "Introduction to Bookkeeping (ACCA-X on edX)",
    provider: "ACCA-X (edX)",
    type: "course",
    cost: "free",
    // covers "payroll and ledger accounts"
    url: "https://www.edx.org/course/introduction-to-bookkeeping-2",
    durationHours: 30,
    skillsAddressed: [],
    creditingBody: "ACCA-X",
    careerId: "pay",
  },
  {
    id: "res-pay-intuit-basics",
    title: "Bookkeeping basics (Intuit)",
    provider: "Coursera (Intuit)",
    type: "course",
    cost: "free",
    url: "https://www.coursera.org/learn/bookkeeping-basics",
    durationHours: 10,
    skillsAddressed: [],
    careerId: "pay",
  },
  {
    id: "res-pay-bir",
    title: "BIR — Official portal — start here for withholding-tax and return-filing registration (eFPS tutorial pages dead-in-copy while unreachable; do not cite eFPS tutorial pages)",
    provider: "Bureau of Internal Revenue (PH regulator)",
    type: "doc",
    cost: "free",
    // eFPS deep/tutorial pages unreachable (transport error) — dead-in-copy
    // flag stands until a working official eFPS page verifies (V-pay-4)
    url: "https://www.bir.gov.ph/",
    durationHours: 1,
    skillsAddressed: ["Prepare and file payroll tax returns / statutory paperwork"],
    careerId: "pay",
    pick: true,
  },
  {
    id: "res-pay-ra10173",
    title: "Republic Act No. 10173 (Data Privacy Act of 2012)",
    provider: "Lawphil Project",
    type: "doc",
    cost: "free",
    url: "https://lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html",
    durationHours: 2,
    skillsAddressed: [
      "Prepare and file payroll tax returns / statutory paperwork",
      "Records hygiene & confidentiality (RA 10173 context)",
    ],
    careerId: "pay",
    pick: true,
  },
  {
    id: "res-pay-top-receiving-comms",
    title: "Receiving and Responding to Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=52",
    durationHours: 2,
    skillsAddressed: ["Provide information to employees and managers on payroll matters, tax issues, benefit plans, and collective agreement provisions"],
    creditingBody: "TESDA",
    careerId: "pay",
    pick: true,
  },
  {
    id: "res-pay-top-workplace-comms",
    title: "Participating in Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=56",
    durationHours: 2,
    skillsAddressed: [
      "Provide information to employees and managers on payroll matters, tax issues, benefit plans, and collective agreement provisions",
      "Communication · Professionalism (Enabling)",
    ],
    creditingBody: "TESDA",
    careerId: "pay",
    pick: true,
  },
  {
    id: "res-pay-top-digital-literacy-cat",
    title: "Digital Literacy course category (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // category page (200); titles not itemized this pass — flagged
    url: "https://e-tesda.gov.ph/course/index.php?categoryid=1310",
    durationHours: 4,
    skillsAddressed: ["Communication · Professionalism (Enabling)"],
    creditingBody: "TESDA",
    careerId: "pay",
  },
  // ── fas (4.4) — [PSF] PSF-GIH primary ──
  {
    id: "res-fas-psf-gih-doc",
    title: "Philippine Skills Framework for Global In-House Center (official PDF)",
    provider: "TESDA",
    type: "doc",
    cost: "free",
    // THE official government framework document for this role — students
    // can read the F&A Agent/Associate map itself (printed pp.92–93)
    url: "https://www.tesda.gov.ph/Uploads/File/Philippine%20Skills%20Framework/ICT/Philippine%20Skills%20Framework%20for%20Global%20In-House%20Center.pdf",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "fas",
  },
  {
    id: "res-fas-wharton-accounting",
    title: "Introduction to Financial Accounting (Wharton)",
    provider: "Coursera (University of Pennsylvania)",
    type: "course",
    cost: "free",
    // V-fas-5: confirm the fetched page reads "Introduction to Financial
    // Accounting" before final citation; enroll-for-free/audit route per family page
    url: "https://www.coursera.org/learn/wharton-accounting",
    durationHours: 15,
    skillsAddressed: [
      "Perform financial accounting and corporate reporting activities",
      "Process business transactions and reports using information technology tools",
      
    ],
    careerId: "fas",
    pick: true,
  },
  {
    id: "res-fas-gcf-excel",
    title: "Excel (topic hub) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: [
      "Process business transactions and reports using information technology tools",
      "Data Collection and Analysis",
    ],
    careerId: "fas",
    pick: true,
  },
  {
    id: "res-fas-acca-intro",
    title: "Introduction to Bookkeeping (ACCA-X on edX)",
    provider: "ACCA-X (edX)",
    type: "course",
    cost: "free",
    // bookkeeping + ledger systems — "input/operate" descriptors
    url: "https://www.edx.org/course/introduction-to-bookkeeping-2",
    durationHours: 30,
    skillsAddressed: ["Accounting and Tax Systems"],
    creditingBody: "ACCA-X",
    careerId: "fas",
  },
  {
    id: "res-fas-acca-intermediate",
    title: "Intermediate Bookkeeping (ACCA-X on edX)",
    provider: "ACCA-X (edX)",
    type: "course",
    cost: "free",
    url: "https://www.edx.org/course/intermediate-bookkeeping-2",
    durationHours: 30,
    skillsAddressed: ["Accounting and Tax Systems"],
    creditingBody: "ACCA-X",
    careerId: "fas",
    pick: true,
  },
  {
    id: "res-fas-cfi-basic-excel",
    title: "Basic Excel Formulas for Beginners (CFI free resource)",
    provider: "Corporate Finance Institute",
    type: "doc",
    cost: "free",
    url: "https://corporatefinanceinstitute.com/resources/excel/basic-excel-formulas-beginners/",
    durationHours: 2,
    skillsAddressed: ["Data Collection and Analysis"],
    careerId: "fas",
    pick: true,
  },
  {
    id: "res-fas-cfi-ratios",
    title: "Financial Ratios Definitive Guide (CFI free resource)",
    provider: "Corporate Finance Institute",
    type: "doc",
    cost: "free",
    // straight at the printed ratio verb; English-only
    url: "https://corporatefinanceinstitute.com/resources/accounting/financial-ratios-definitive-guide/",
    durationHours: 3,
    skillsAddressed: ["Financial Analysis"],
    careerId: "fas",
    pick: true,
  },
  {
    id: "res-fas-openstax-finance",
    title: "Principles of Finance (OpenStax)",
    provider: "OpenStax (free textbook)",
    type: "doc",
    cost: "free",
    // ratio analysis and financial-statement interpretation chapters
    url: "https://openstax.org/details/books/principles-finance",
    durationHours: 6,
    skillsAddressed: ["Financial Analysis"],
    careerId: "fas",
  },
  {
    id: "res-fas-finance-fundamentals",
    title: "Fundamentals of Finance (Wharton)",
    provider: "Coursera (University of Pennsylvania)",
    type: "course",
    cost: "free",
    // free-route starter on financial decision basics
    url: "https://www.coursera.org/learn/finance-fundamentals",
    durationHours: 10,
    skillsAddressed: ["Financial Analysis"],
    careerId: "fas",
  },
  {
    id: "res-fas-openstax-managerial",
    title: "Principles of Accounting, Volume 2: Managerial Accounting (OpenStax)",
    provider: "OpenStax (free textbook)",
    type: "doc",
    cost: "free",
    url: "https://openstax.org/details/books/principles-managerial-accounting",
    durationHours: 6,
    skillsAddressed: ["Internal Controls"],
    careerId: "fas",
    pick: true,
  },
  {
    id: "res-fas-top-workplace-comms",
    title: "Participating in Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // diversity thinness is honestly recorded — this is the workplace-conduct
    // foundation the Diversity row leans on
    url: "https://e-tesda.gov.ph/course/view.php?id=56",
    durationHours: 2,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "fas",
  },
  {
    id: "res-fas-top-receiving-comms",
    title: "Receiving and Responding to Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=52",
    durationHours: 2,
    skillsAddressed: ["Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Sense Making · Transdisciplinary Thinking (Enabling, B/I)"],
    creditingBody: "TESDA",
    careerId: "fas",
    pick: true,
  },
  {
    id: "res-fas-top-digital-literacy-cat",
    title: "Digital Literacy course category (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/index.php?categoryid=1310",
    durationHours: 4,
    skillsAddressed: ["Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Sense Making · Transdisciplinary Thinking (Enabling, B/I)"],
    creditingBody: "TESDA",
    careerId: "fas",
  },
  {
    id: "res-fas-intuit-basics",
    title: "Bookkeeping basics (Intuit)",
    provider: "Coursera (Intuit)",
    type: "course",
    cost: "free",
    // GL/journal-entry cycle practice (O*NET corroboration block backing)
    url: "https://www.coursera.org/learn/bookkeeping-basics",
    durationHours: 10,
    skillsAddressed: ["O*NET corroboration block (operating-the-GL-engine tasks)"],
    careerId: "fas",
  },
  {
    id: "res-fas-cfi-fpa-guide",
    title: "Essential Guide Breaking Into FP&A (CFI free ebook)",
    provider: "Corporate Finance Institute",
    type: "doc",
    cost: "free",
    // free FP&A career primer mapped to the "Support strategic planning" CWF
    url: "https://corporatefinanceinstitute.com/resources/fpa/essential-guide-breaking-into-fpa-free-ebook/",
    durationHours: 2,
    skillsAddressed: ["Support strategic planning", "O*NET corroboration block (operating-the-GL-engine tasks)"],
    careerId: "fas",
    pick: true,
  },
  // ── fin (4.5) ──
  {
    id: "res-fin-openstax-finance",
    title: "Principles of Finance (OpenStax)",
    provider: "OpenStax (free textbook)",
    type: "doc",
    cost: "free",
    // valuation, risk, markets + capital-budgeting chapters
    url: "https://openstax.org/details/books/principles-finance",
    durationHours: 6,
    skillsAddressed: [
      "Analyze financial information to forecast business, industry, or economic conditions for investment decisions",
      "Monitor economic, industrial, and corporate developments",
      "Interpret data on price, yield, stability, future investment-risk trends, economic influences",
      "Advise clients on aspects of capitalization, such as amounts, sources, or timing",
    ],
    careerId: "fin",
    pick: true,
  },
  {
    id: "res-fin-mit-ocw-finance-theory",
    title: "15.401 Finance Theory I (MIT OpenCourseWare)",
    provider: "MIT OpenCourseWare",
    type: "course",
    cost: "free",
    // full free course materials (valuation foundations); heavier math, self-paced
    url: "https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/",
    durationHours: 40,
    skillsAddressed: [
      "Analyze financial information to forecast business, industry, or economic conditions for investment decisions",
      "Advise clients on aspects of capitalization, such as amounts, sources, or timing",
    ],
    careerId: "fin",
  },
  {
    id: "res-fin-finance-fundamentals",
    title: "Fundamentals of Finance (Wharton)",
    provider: "Coursera (University of Pennsylvania)",
    type: "course",
    cost: "free",
    url: "https://www.coursera.org/learn/finance-fundamentals",
    durationHours: 10,
    skillsAddressed: ["Analyze financial information to forecast business, industry, or economic conditions for investment decisions"],
    careerId: "fin",
  },
  {
    id: "res-fin-cfi-modeling-guide",
    title: "Financial Modeling Guidelines (CFI free guide)",
    provider: "Corporate Finance Institute",
    type: "doc",
    cost: "free",
    // free model-design standards; global standard, non-PH
    url: "https://corporatefinanceinstitute.com/resources/financial-modeling/free-financial-modeling-guide/",
    durationHours: 3,
    skillsAddressed: ["Employ financial models to develop solutions to financial problems or to assess the financial or capital impact of transactions"],
    careerId: "fin",
  },
  {
    id: "res-fin-cfi-fpa-guide",
    title: "Essential Guide Breaking Into FP&A (CFI free ebook)",
    provider: "Corporate Finance Institute",
    type: "doc",
    cost: "free",
    url: "https://corporatefinanceinstitute.com/resources/fpa/essential-guide-breaking-into-fpa-free-ebook/",
    durationHours: 2,
    skillsAddressed: ["Employ financial models to develop solutions to financial problems or to assess the financial or capital impact of transactions"],
    careerId: "fin",
    pick: true,
  },
  {
    id: "res-fin-cfi-ratios",
    title: "Financial Ratios Definitive Guide (CFI free resource)",
    provider: "Corporate Finance Institute",
    type: "doc",
    cost: "free",
    url: "https://corporatefinanceinstitute.com/resources/accounting/financial-ratios-definitive-guide/",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "fin",
  },
  {
    id: "res-fin-top-workplace-comms",
    title: "Participating in Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=56",
    durationHours: 2,
    skillsAddressed: ["Present oral or written reports on general economic trends, individual corporations, and entire industries", "Communication · Critical Thinking · Professionalism (Enabling)"],
    creditingBody: "TESDA",
    careerId: "fin",
    pick: true,
  },
  {
    id: "res-fin-wharton-more-accounting",
    title: "More Introduction to Financial Accounting (Wharton)",
    provider: "Coursera (University of Pennsylvania)",
    type: "course",
    cost: "free",
    // financial-statement analysis module
    url: "https://www.coursera.org/learn/wharton-financial-accounting",
    durationHours: 14,
    skillsAddressed: [],
    careerId: "fin",
  },
  {
    id: "res-fin-gcf-excel",
    title: "Excel (topic hub) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: ["Draw charts and graphs, using computer spreadsheets, to illustrate technical reports"],
    careerId: "fin",
  },
  {
    id: "res-fin-cfi-basic-excel",
    title: "Basic Excel Formulas for Beginners (CFI free resource)",
    provider: "Corporate Finance Institute",
    type: "doc",
    cost: "free",
    url: "https://corporatefinanceinstitute.com/resources/excel/basic-excel-formulas-beginners/",
    durationHours: 2,
    skillsAddressed: ["Draw charts and graphs, using computer spreadsheets, to illustrate technical reports"],
    careerId: "fin",
    pick: true,
  },
  {
    id: "res-fin-acca-mgmt",
    title: "Introduction to Management Accounting (ACCA-X on edX)",
    provider: "ACCA-X (edX)",
    type: "course",
    cost: "free",
    // cost/management accounting basics + spreadsheet use
    url: "https://www.edx.org/course/introduction-to-management-accounting-2",
    durationHours: 30,
    skillsAddressed: [],
    creditingBody: "ACCA-X",
    careerId: "fin",
  },
  {
    id: "res-fin-cfi-careers",
    title: "Careers in Finance (CFI free course)",
    provider: "Corporate Finance Institute",
    type: "course",
    cost: "free",
    // free tour of finance role families; non-PH framing, flagged
    url: "https://corporatefinanceinstitute.com/course/careers-in-finance/",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "fin",
  },
  {
    id: "res-fin-gap-senior-tasks",
    title: "Senior-heavy supervision row — resourceless by declaration (no padding)",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["Supervise, train, or mentor junior team members"],
    careerId: "fin",
  },
  // ── treasury (4.6) — BSP 403 flag carried; Khan US-framing flagged ──
  {
    id: "res-treasury-khan-banking",
    title: "Finance and Capital Markets — Banking & Money unit (Khan Academy)",
    provider: "Khan Academy",
    type: "course",
    cost: "free",
    // free banking unit; US banking framing — flagged for PH substitution
    // (BSP pages blocked this session; recheck when reachable)
    url: "https://www.khanacademy.org/economics-finance-domain/core-finance/banking-and-money",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "treasury",
  },
  {
    id: "res-treasury-khan-interest",
    title: "Interest Basics unit (Khan Academy)",
    provider: "Khan Academy",
    type: "course",
    cost: "free",
    // free interest mechanics (US framing flagged)
    url: "https://www.khanacademy.org/economics-finance-domain/core-finance/interest-basics",
    durationHours: 2,
    skillsAddressed: ["Prepare financial documents, and calculate interest or brokerage charges and stamp duties payable"],
    careerId: "treasury",
    pick: true,
  },
  {
    id: "res-treasury-ra8791",
    title: "Republic Act No. 8791 (General Banking Law of 2000)",
    provider: "Lawphil Project",
    type: "doc",
    cost: "free",
    url: "https://lawphil.net/statutes/repacts/ra2000/ra_8791_2000.html",
    durationHours: 2,
    skillsAddressed: [
      "Balance currency, coin, and checks in cash drawers at ends of shifts and calculate daily transactions, using computers, calculators, or adding machines",
    ],
    careerId: "treasury",
    pick: true,
  },
  {
    id: "res-treasury-gcf-excel",
    title: "Excel (topic hub) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: ["Reconcile records of financial transactions"],
    careerId: "treasury",
    pick: true,
  },
  {
    id: "res-treasury-acca-intro",
    title: "Introduction to Bookkeeping (ACCA-X on edX)",
    provider: "ACCA-X (edX)",
    type: "course",
    cost: "free",
    url: "https://www.edx.org/course/introduction-to-bookkeeping-2",
    durationHours: 30,
    skillsAddressed: ["Reconcile records of financial transactions"],
    creditingBody: "ACCA-X",
    careerId: "treasury",
  },
  {
    id: "res-treasury-openstax-finance",
    title: "Principles of Finance (OpenStax)",
    provider: "OpenStax (free textbook)",
    type: "doc",
    cost: "free",
    // bonds/shares mechanics underpinning securities-record upkeep
    url: "https://openstax.org/details/books/principles-finance",
    durationHours: 6,
    skillsAddressed: [
      "Prepare financial documents, and calculate interest or brokerage charges and stamp duties payable",
      "Maintain records of bonds, shares and other securities bought or sold on behalf of clients or employer",
    ],
    careerId: "treasury",
    pick: true,
  },
  {
    id: "res-treasury-finance-fundamentals",
    title: "Fundamentals of Finance (Wharton)",
    provider: "Coursera (University of Pennsylvania)",
    type: "course",
    cost: "free",
    url: "https://www.coursera.org/learn/finance-fundamentals",
    durationHours: 10,
    skillsAddressed: [
      "Prepare financial documents, and calculate interest or brokerage charges and stamp duties payable",
      "Maintain records of bonds, shares and other securities bought or sold on behalf of clients or employer",
    ],
    careerId: "treasury",
  },
  {
    id: "res-treasury-cfi-careers",
    title: "Careers in Finance (CFI free course)",
    provider: "Corporate Finance Institute",
    type: "course",
    cost: "free",
    url: "https://corporatefinanceinstitute.com/course/careers-in-finance/",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "treasury",
  },
  {
    id: "res-treasury-top-workplace-comms",
    title: "Participating in Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=56",
    durationHours: 2,
    skillsAddressed: ["Accuracy/Professionalism (Enabling)"],
    creditingBody: "TESDA",
    careerId: "treasury",
    pick: true,
  },
  // ── coll (4.7) — thin collections-training zone declared; RA 3765 never a live link ──
  {
    id: "res-coll-top-receiving-comms",
    title: "Receiving and Responding to Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // the closest free PH anchor to call-handling craft
    url: "https://e-tesda.gov.ph/course/view.php?id=52",
    durationHours: 2,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "coll",
  },
  {
    id: "res-coll-top-workplace-comms",
    title: "Participating in Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=56",
    durationHours: 2,
    skillsAddressed: ["Communication · Professionalism (Enabling)"],
    creditingBody: "TESDA",
    careerId: "coll",
    pick: true,
  },
  {
    id: "res-coll-khan-banking",
    title: "Finance and Capital Markets — Banking & Money unit (Khan Academy)",
    provider: "Khan Academy",
    type: "course",
    cost: "free",
    // credit-side context; US framing flagged (BSP 403)
    url: "https://www.khanacademy.org/economics-finance-domain/core-finance/banking-and-money",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "coll",
  },
  {
    id: "res-coll-gcf-excel",
    title: "Excel (topic hub) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    // status-of-collection trackers
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: [
      "Arrange for debt repayment or establish repayment schedules, based on customers' financial situations",
      "Record information about financial status of customers and status of collection efforts",
    ],
    careerId: "coll",
    pick: true,
  },
  {
    id: "res-coll-finance-fundamentals",
    title: "Fundamentals of Finance (Wharton)",
    provider: "Coursera (University of Pennsylvania)",
    type: "course",
    cost: "free",
    url: "https://www.coursera.org/learn/finance-fundamentals",
    durationHours: 10,
    skillsAddressed: [],
    careerId: "coll",
  },
  {
    id: "res-coll-acca-intro",
    title: "Introduction to Bookkeeping (ACCA-X on edX)",
    provider: "ACCA-X (edX)",
    type: "course",
    cost: "free",
    // banking-system + ledger discipline behind posting receipts
    url: "https://www.edx.org/course/introduction-to-bookkeeping-2",
    durationHours: 30,
    skillsAddressed: ["Receive payments and post amounts paid to customer accounts"],
    creditingBody: "ACCA-X",
    careerId: "coll",
    pick: true,
  },
  {
    id: "res-coll-ra10173",
    title: "Republic Act No. 10173 (Data Privacy Act of 2012)",
    provider: "Lawphil Project",
    type: "doc",
    cost: "free",
    // the statute governing tracing-activity personal-data handling (RA 3765
    // is NEVER rendered live anywhere — dead-in-copy flag, ruling 2026-10-29)
    url: "https://lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html",
    durationHours: 2,
    skillsAddressed: [
      "Trace delinquent customers to new addresses by inquiring at post offices, telephone companies, credit bureaus, or through the questioning of neighbors",
      "Recommend legal action or disconnection when payment cannot be obtained / negotiate credit extensions",
      "Administrative upkeep of assigned accounts",
    ],
    careerId: "coll",
    pick: true,
  },
  {
    id: "res-coll-dole-handbook",
    title: "Workers' Statutory Monetary Benefits Handbook 2024 (DOLE-BWC, official NWPC mirror)",
    provider: "DOLE-BWC (NWPC mirror)",
    type: "doc",
    cost: "free",
    // generic labor-standards context — noted as context, not collections doctrine
    url: "https://nwpc.dole.gov.ph/wp-content/uploads/2024/11/Workers-Statutory-Monetary-Benefits-Handbook-2024-Edition.pdf",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "coll",
  },
  {
    id: "res-coll-top-digital-literacy-cat",
    title: "Digital Literacy course category (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // tooling fluency for the "automated systems" recording task
    url: "https://e-tesda.gov.ph/course/index.php?categoryid=1310",
    durationHours: 4,
    skillsAddressed: ["Communication · Professionalism (Enabling)"],
    creditingBody: "TESDA",
    careerId: "coll",
  },
  {
    id: "res-coll-gap-collections-training",
    title: "Collections-specific free training — declared thin (BSP 403; CFI tracks paid; RA 3765 dead-in-copy)",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["Locate and notify customers of delinquent accounts by mail, telephone, or personal visits to solicit payment", "Arrange for debt repayment or establish repayment schedules, based on customers' financial situations"],
    careerId: "coll",
  },
  // ── credit (4.8) ──
  {
    id: "res-credit-cfi-ratios",
    title: "Financial Ratios Definitive Guide (CFI free resource)",
    provider: "Corporate Finance Institute",
    type: "doc",
    cost: "free",
    url: "https://corporatefinanceinstitute.com/resources/accounting/financial-ratios-definitive-guide/",
    durationHours: 3,
    skillsAddressed: [
      "Researching and evaluating loan applicant's financial status, references, credit and ability to repay the loan",
      
    ],
    careerId: "credit",
    pick: true,
  },
  {
    id: "res-credit-finance-fundamentals",
    title: "Fundamentals of Finance (Wharton)",
    provider: "Coursera (University of Pennsylvania)",
    type: "course",
    cost: "free",
    url: "https://www.coursera.org/learn/finance-fundamentals",
    durationHours: 10,
    skillsAddressed: [
      "Researching and evaluating loan applicant's financial status, references, credit and ability to repay the loan",
      
    ],
    careerId: "credit",
  },
  {
    id: "res-credit-wharton-more-accounting",
    title: "More Introduction to Financial Accounting (Wharton)",
    provider: "Coursera (University of Pennsylvania)",
    type: "course",
    cost: "free",
    // AR/bad-debt and statement-analysis modules
    url: "https://www.coursera.org/learn/wharton-financial-accounting",
    durationHours: 14,
    skillsAddressed: [
      "Researching and evaluating loan applicant's financial status, references, credit and ability to repay the loan",
      
    ],
    careerId: "credit",
  },
  {
    id: "res-credit-top-receiving-comms",
    title: "Receiving and Responding to Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=52",
    durationHours: 2,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "credit",
  },
  {
    id: "res-credit-top-workplace-comms",
    title: "Participating in Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=56",
    durationHours: 2,
    skillsAddressed: [
      
      
      "Integrity/Professionalism (Enabling)",
    ],
    creditingBody: "TESDA",
    careerId: "credit",
    pick: true,
  },
  {
    id: "res-credit-ra8791",
    title: "Republic Act No. 8791 (General Banking Law of 2000)",
    provider: "Lawphil Project",
    type: "doc",
    cost: "free",
    url: "https://lawphil.net/statutes/repacts/ra2000/ra_8791_2000.html",
    durationHours: 2,
    skillsAddressed: [
      "Keeping records of payments, and preparing routine letters requesting payment for overdue accounts and forwarding these for legal action",
      "Completing credit and loan documentation",
    ],
    careerId: "credit",
  },
  {
    id: "res-credit-ra10173",
    title: "Republic Act No. 10173 (Data Privacy Act of 2012)",
    provider: "Lawphil Project",
    type: "doc",
    cost: "free",
    // credit-file PII (RA 3765 dead-in-copy flag rides the record)
    url: "https://lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html",
    durationHours: 2,
    skillsAddressed: [
      "Keeping records of payments, and preparing routine letters requesting payment for overdue accounts and forwarding these for legal action",
      "Completing credit and loan documentation",
    ],
    careerId: "credit",
    pick: true,
  },
  {
    id: "res-credit-gcf-excel",
    title: "Excel (topic hub) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: [
      "Keeping records of payments, and preparing routine letters requesting payment for overdue accounts and forwarding these for legal action",
      "Completing credit and loan documentation",
    ],
    careerId: "credit",
  },
  {
    id: "res-credit-intuit-basics",
    title: "Bookkeeping basics (Intuit)",
    provider: "Coursera (Intuit)",
    type: "course",
    cost: "free",
    // payment-cycle literacy behind delinquency paperwork (honest thin otherwise)
    url: "https://www.coursera.org/learn/bookkeeping-basics",
    durationHours: 10,
    skillsAddressed: [],
    careerId: "credit",
  },
  {
    id: "res-credit-top-digital-literacy-cat",
    title: "Digital Literacy course category (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // loan-systems fluency start point
    url: "https://e-tesda.gov.ph/course/index.php?categoryid=1310",
    durationHours: 4,
    skillsAddressed: ["Integrity/Professionalism (Enabling)"],
    creditingBody: "TESDA",
    careerId: "credit",
  },
  {
    id: "res-credit-gap-credit-analysis",
    title: "Credit-analysis-specific free training — declared thin (BSP 403; CFI CBCA paid)",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["Researching and evaluating loan applicant's financial status, references, credit and ability to repay the loan"],
    careerId: "credit",
  },
  // ── teller (4.9) ──
  {
    id: "res-teller-khan-banking",
    title: "Finance and Capital Markets — Banking & Money unit (Khan Academy)",
    provider: "Khan Academy",
    type: "course",
    cost: "free",
    // free banking mechanics; US contexts (Fed shipments) flagged — supplemented
    // with the PH-side statute row below
    url: "https://www.khanacademy.org/economics-finance-domain/core-finance/banking-and-money",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "teller",
  },
  {
    id: "res-teller-ra8791",
    title: "Republic Act No. 8791 (General Banking Law of 2000)",
    provider: "Lawphil Project",
    type: "doc",
    cost: "free",
    url: "https://lawphil.net/statutes/repacts/ra2000/ra_8791_2000.html",
    durationHours: 2,
    skillsAddressed: [
      "Balance currency, coin, and checks in cash drawers at ends of shifts and calculate daily transactions, using computers, calculators, or adding machines",
      "Receive checks and cash for deposit, verify amounts, and check accuracy of deposit slips",
    ],
    careerId: "teller",
    pick: true,
  },
  {
    id: "res-teller-acca-intro",
    title: "Introduction to Bookkeeping (ACCA-X on edX)",
    provider: "ACCA-X (edX)",
    type: "course",
    cost: "free",
    url: "https://www.edx.org/course/introduction-to-bookkeeping-2",
    durationHours: 30,
    skillsAddressed: [],
    creditingBody: "ACCA-X",
    careerId: "teller",
  },
  {
    id: "res-teller-gcf-excel",
    title: "Excel (topic hub) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    // teller-balance worksheets
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: [],
    careerId: "teller",
  },
  {
    id: "res-teller-khan-interest",
    title: "Interest Basics unit (Khan Academy)",
    provider: "Khan Academy",
    type: "course",
    cost: "free",
    // term-deposit/interest mechanics (US framing flagged)
    url: "https://www.khanacademy.org/economics-finance-domain/core-finance/interest-basics",
    durationHours: 2,
    skillsAddressed: [],
    careerId: "teller",
  },
  {
    id: "res-teller-sss",
    title: "SSS — Official portal — start here for statutory-contribution payment-desk information (table/deep pages unplaced/unreachable)",
    provider: "Social Security System (PH regulator)",
    type: "doc",
    cost: "free",
    // keep-with-flag ruling 2026-10-29: start-here placeholder only
    url: "https://www.sss.gov.ph/",
    durationHours: 1,
    skillsAddressed: ["Receive mortgage, loan, or public utility bill payments, verifying payment dates and amounts due / process term deposits and other savings-plan transactions"],
    careerId: "teller",
    pick: true,
  },
  {
    id: "res-teller-top-receiving-comms",
    title: "Receiving and Responding to Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=52",
    durationHours: 2,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "teller",
  },
  {
    id: "res-teller-cfi-careers",
    title: "Careers in Finance (CFI free course)",
    provider: "Corporate Finance Institute",
    type: "course",
    cost: "free",
    // tour incl. retail-banking branch roles; non-PH framing flagged
    url: "https://corporatefinanceinstitute.com/course/careers-in-finance/",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "teller",
  },
  {
    id: "res-teller-top-workplace-comms",
    title: "Participating in Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=56",
    durationHours: 2,
    skillsAddressed: ["Front-desk service etiquette (Enabling)", "Professionalism · Teamwork (Enabling)"],
    creditingBody: "TESDA",
    careerId: "teller",
    pick: true,
  },
  {
    id: "res-teller-top-digital-literacy-cat",
    title: "Digital Literacy course category (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // core-systems fluency start
    url: "https://e-tesda.gov.ph/course/index.php?categoryid=1310",
    durationHours: 4,
    skillsAddressed: ["Professionalism · Teamwork (Enabling)"],
    creditingBody: "TESDA",
    careerId: "teller",
  },
  // ── audit (4.10) — BIR eFPS dead-in-copy; row-11 tech row waits for the pin ──
  {
    id: "res-audit-wharton-accounting",
    title: "Introduction to Financial Accounting (Wharton)",
    provider: "Coursera (University of Pennsylvania)",
    type: "course",
    cost: "free",
    url: "https://www.coursera.org/learn/wharton-accounting",
    durationHours: 15,
    skillsAddressed: [
      "Prepare, examine, or analyze accounting records, financial statements, or other financial reports to assess accuracy, completeness, and conformance to reporting and procedural standards",
      "Review accounts for discrepancies and reconcile differences",
    ],
    careerId: "audit",
    pick: true,
  },
  {
    id: "res-audit-mit-ocw-15501",
    title: "15.501 Introduction to Financial and Managerial Accounting (MIT OCW)",
    provider: "MIT OpenCourseWare",
    type: "course",
    cost: "free",
    // free full course materials (financial statements, reporting); rigorous
    url: "https://ocw.mit.edu/courses/15-501-introduction-to-financial-and-managerial-accounting-spring-2004/",
    durationHours: 40,
    skillsAddressed: [
      "Prepare, examine, or analyze accounting records, financial statements, or other financial reports to assess accuracy, completeness, and conformance to reporting and procedural standards",
      "Review accounts for discrepancies and reconcile differences",
    ],
    careerId: "audit",
  },
  {
    id: "res-audit-acca-intro",
    title: "Introduction to Bookkeeping (ACCA-X on edX)",
    provider: "ACCA-X (edX)",
    type: "course",
    cost: "free",
    // accounting-cycle literacy
    url: "https://www.edx.org/course/introduction-to-bookkeeping-2",
    durationHours: 30,
    skillsAddressed: [
      "Prepare, examine, or analyze accounting records, financial statements, or other financial reports to assess accuracy, completeness, and conformance to reporting and procedural standards",
      "Review accounts for discrepancies and reconcile differences",
    ],
    creditingBody: "ACCA-X",
    careerId: "audit",
  },
  {
    id: "res-audit-psf-gih-doc",
    title: "Philippine Skills Framework for Global In-House Center (official PDF)",
    provider: "TESDA",
    type: "doc",
    cost: "free",
    // Internal Controls FSC ladder ("control gaps" language)
    url: "https://www.tesda.gov.ph/Uploads/File/Philippine%20Skills%20Framework/ICT/Philippine%20Skills%20Framework%20for%20Global%20In-House%20Center.pdf",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "audit",
  },
  {
    id: "res-audit-cfi-ratios",
    title: "Financial Ratios Definitive Guide (CFI free resource)",
    provider: "Corporate Finance Institute",
    type: "doc",
    cost: "free",
    url: "https://corporatefinanceinstitute.com/resources/accounting/financial-ratios-definitive-guide/",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "audit",
  },
  {
    id: "res-audit-openstax-managerial",
    title: "Principles of Accounting, Volume 2: Managerial Accounting (OpenStax)",
    provider: "OpenStax (free textbook)",
    type: "doc",
    cost: "free",
    url: "https://openstax.org/details/books/principles-managerial-accounting",
    durationHours: 6,
    skillsAddressed: ["Collect and analyze data to detect deficient controls, duplicated effort, extravagance, fraud, or non-compliance with laws, regulations, and management policies"],
    careerId: "audit",
    pick: true,
  },
  {
    id: "res-audit-ra9298",
    title: "Republic Act No. 9298 (Philippine Accountancy Act of 2004)",
    provider: "Lawphil Project",
    type: "doc",
    cost: "free",
    // the PH practice band under which audit work sits (CPA board, practice
    // scope); lawphil is a mirror — cite the PRC/Gazette register when reachable
    url: "https://lawphil.net/statutes/repacts/ra2004/ra_9298_2004.html",
    durationHours: 2,
    skillsAddressed: [],
    careerId: "audit",
  },
  {
    id: "res-audit-acca-intermediate",
    title: "Intermediate Bookkeeping (ACCA-X on edX)",
    provider: "ACCA-X (edX)",
    type: "course",
    cost: "free",
    url: "https://www.edx.org/course/intermediate-bookkeeping-2",
    durationHours: 30,
    skillsAddressed: [],
    creditingBody: "ACCA-X",
    careerId: "audit",
  },
  {
    id: "res-audit-top-workplace-comms",
    title: "Participating in Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // written reporting discipline; client-facing request handling
    url: "https://e-tesda.gov.ph/course/view.php?id=56",
    durationHours: 2,
    skillsAddressed: ["Prepare detailed reports on audit findings", "Professional Skepticism (attitude) · Communication (Enabling)"],
    creditingBody: "TESDA",
    careerId: "audit",
    pick: true,
  },
  {
    id: "res-audit-gcf-excel",
    title: "Excel (topic hub) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    // workpaper tables
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: ["Audit technology fluency (accounting software / Excel family)"],
    careerId: "audit",
    pick: true,
  },
  {
    id: "res-audit-top-journalizing",
    title: "Journalizing Transactions (TOP Bookkeeping NC III module)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // the journal/posting/trial-balance lifecycle adjusting entries touch
    url: "https://e-tesda.gov.ph/course/view.php?id=3982",
    durationHours: 4,
    skillsAddressed: ["Prepare adjusting journal entries / establish tables of accounts and assign entries to proper accounts"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "audit",
    pick: true,
  },
  {
    id: "res-audit-top-posting",
    title: "Posting Transactions (TOP Bookkeeping NC III module)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=3983",
    durationHours: 4,
    skillsAddressed: ["Prepare adjusting journal entries / establish tables of accounts and assign entries to proper accounts"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "audit",
  },
  {
    id: "res-audit-top-trial-balance",
    title: "Preparing Trial Balance (TOP Bookkeeping NC III module)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=4029",
    durationHours: 4,
    skillsAddressed: ["Prepare adjusting journal entries / establish tables of accounts and assign entries to proper accounts"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "audit",
  },
  {
    id: "res-audit-intuit-basics",
    title: "Bookkeeping basics (Intuit)",
    provider: "Coursera (Intuit)",
    type: "course",
    cost: "free",
    // adjusting-entries module ("make adjusting entries…")
    url: "https://www.coursera.org/learn/bookkeeping-basics",
    durationHours: 10,
    skillsAddressed: ["Prepare adjusting journal entries / establish tables of accounts and assign entries to proper accounts"],
    careerId: "audit",
  },
  {
    id: "res-audit-dole-handbook",
    title: "Workers' Statutory Monetary Benefits Handbook 2024 (DOLE-BWC, official NWPC mirror)",
    provider: "DOLE-BWC (NWPC mirror)",
    type: "doc",
    cost: "free",
    // the statutory-benefit baseline payroll-audit engagements test against
    url: "https://nwpc.dole.gov.ph/wp-content/uploads/2024/11/Workers-Statutory-Monetary-Benefits-Handbook-2024-Edition.pdf",
    durationHours: 3,
    skillsAddressed: ["Compliance / tax analog & frameworks"],
    careerId: "audit",
  },
  {
    id: "res-audit-bir",
    title: "BIR — Official portal — start here for withholding/tax-filing context (eFPS tutorial pages unreachable — dead-in-copy; do not cite eFPS tutorial pages)",
    provider: "Bureau of Internal Revenue (PH regulator)",
    type: "doc",
    cost: "free",
    // keep-with-flag ruling 2026-10-29 (same treatment as pay)
    url: "https://www.bir.gov.ph/",
    durationHours: 1,
    skillsAddressed: ["Compliance / tax analog & frameworks"],
    careerId: "audit",
    pick: true,
  },
  {
    id: "res-audit-top-receiving-comms",
    title: "Receiving and Responding to Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // interviews, PBC lists
    // audit.md §Resources — this row sits under the group header that
    // records "Rows 9–11 — Enabling layer + technology row", so its keying
    // enumerates the whole group incl. row 9 (Senior-heavy supervision fold-in)
    url: "https://e-tesda.gov.ph/course/view.php?id=52",
    durationHours: 2,
    skillsAddressed: [
      
      "Professional Skepticism (attitude) · Communication (Enabling)",
      
    ],
    creditingBody: "TESDA",
    careerId: "audit",
    pick: true,
  },
  {
    id: "res-audit-top-digital-literacy-cat",
    title: "Digital Literacy course category (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // audit-tooling fluency start for row 11 ("standard computer software packages")
    // audit.md §Resources — this row sits under the group header that
    // records "Rows 9–11 — Enabling layer + technology row"; the group's
    // keying enumerates rows 9–11 (row 9 = the Senior-heavy supervision fold-in)
    url: "https://e-tesda.gov.ph/course/index.php?categoryid=1310",
    durationHours: 4,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "audit",
  },
  // == ── Track 4 · Office & Administration (adminassoc · clerk · encode · desk ·
  // execsec · records) — blessed role-spec pools ────────────────────────────
  // ── adminassoc (5.1) ──
  {
    id: "res-adminassoc-top-digitallit",
    title: "Microsoft Digital Literacy (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-gated (TOP account free); e-certificate on completion
    url: "https://e-tesda.gov.ph/course/view.php?id=4716",
    durationHours: 4,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "adminassoc",
  },
  {
    id: "res-adminassoc-uk-archives",
    title: "The National Archives (UK) — Information management",
    provider: "The National Archives (UK)",
    type: "doc",
    cost: "free",
    // professional records guidance: creation, naming, filing, retention;
    // UK retention law is non-PH — transfer the filing discipline
    url: "https://www.nationalarchives.gov.uk/information-management/",
    durationHours: 3,
    skillsAddressed: ["Filing systems (paper/electronic) operation"],
    careerId: "adminassoc",
    pick: true,
  },
  {
    id: "res-adminassoc-ads-sheets",
    title: "Google Applied Digital Skills: Google Sheets for Beginners",
    provider: "Google for Education",
    type: "course",
    cost: "free",
    // free lesson w/ completion credential; platform-migration banner —
    // re-check near the defense (VA1/VE-6 standing flag)
    url: "https://applieddigitalskills.withgoogle.com/c/college-and-continuing-education/en/google-sheets-for-beginners/overview.html",
    durationHours: 1,
    skillsAddressed: ["Database entry & maintenance"],
    creditingBody: "Google for Education",
    careerId: "adminassoc",
    pick: true,
  },
  {
    id: "res-adminassoc-workspace",
    title: "Google Workspace Learning Center",
    provider: "Google",
    type: "doc",
    cost: "free",
    // per-app official training (Sheets/Docs/Drive)
    url: "https://support.google.com/a/users",
    durationHours: 2,
    skillsAddressed: ["Database entry & maintenance", "Multi-channel reception & call routing"],
    careerId: "adminassoc",
    pick: true,
  },
  {
    id: "res-adminassoc-top-receiving-comms",
    title: "Receiving and Responding to Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // telephone/message/inquiry handling
    url: "https://e-tesda.gov.ph/course/view.php?id=52",
    durationHours: 2,
    skillsAddressed: ["Multi-channel reception & call routing"],
    creditingBody: "TESDA",
    careerId: "adminassoc",
  },
  {
    id: "res-adminassoc-ms-365",
    title: "Microsoft 365 help & learning",
    provider: "Microsoft Support",
    type: "doc",
    cost: "free",
    // troubleshooting/how-to for Office apps + equipment-adjacent flows
    url: "https://support.microsoft.com/en-us/office",
    durationHours: 2,
    skillsAddressed: ["Meeting/coordination documentation"],
    careerId: "adminassoc",
  },
  {
    id: "res-adminassoc-owl-memos",
    title: "Purdue OWL — Professional/Technical Writing: Memos",
    provider: "Purdue University",
    type: "doc",
    cost: "free",
    // memo/office-note structure
    url: "https://owl.purdue.edu/owl/subject_specific_writing/professional_technical_writing/memos/index.html",
    durationHours: 2,
    skillsAddressed: ["Meeting/coordination documentation"],
    careerId: "adminassoc",
  },
  {
    id: "res-adminassoc-gcal",
    title: "Google Calendar Help (official docs)",
    provider: "Google",
    type: "doc",
    cost: "free",
    // scheduling/event calendars
    url: "https://support.google.com/calendar/getstarted",
    durationHours: 1,
    skillsAddressed: ["Meeting/coordination documentation"],
    careerId: "adminassoc",
    pick: true,
  },
  {
    id: "res-adminassoc-top-ilo-humanskills",
    title: "Module 3: Building Human Skills for Career Success (TOP × ILO)",
    provider: "TESDA TOP × ILO",
    type: "course",
    cost: "free",
    // human/soft-skills module; login-gated (TOP account free); e-certificate
    url: "https://e-tesda.gov.ph/course/view.php?id=2014",
    durationHours: 2,
    skillsAddressed: ["Communication · Professionalism · Critical Thinking (Enabling)"],
    creditingBody: "TESDA × ILO",
    careerId: "adminassoc",
    pick: true,
  },
  {
    id: "res-adminassoc-skillsbuild",
    title: "IBM SkillsBuild (workplace-skills library with badges)",
    provider: "IBM",
    type: "course",
    cost: "free",
    // TOP-mirrored as course id 3331 (login-gated)
    url: "https://skillsbuild.org/",
    durationHours: 3,
    skillsAddressed: ["Communication · Professionalism · Critical Thinking (Enabling)"],
    careerId: "adminassoc",
  },
  // ── clerk (5.2) — split rows; row 6 declared resourceless-thin ──
  {
    id: "res-clerk-uk-archives",
    title: "The National Archives (UK) — Information management",
    provider: "The National Archives (UK)",
    type: "doc",
    cost: "free",
    // records life: creation → storage → retrieval → disposal
    url: "https://www.nationalarchives.gov.uk/information-management/",
    durationHours: 3,
    skillsAddressed: ["Recording, preparing, sorting, classifying and filing information"],
    careerId: "clerk",
    pick: true,
  },
  {
    id: "res-clerk-top-digitallit",
    title: "Microsoft Digital Literacy (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // digital-filing/electronic-records basics
    url: "https://e-tesda.gov.ph/course/view.php?id=4716",
    durationHours: 4,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "clerk",
  },
  {
    id: "res-clerk-gmail",
    title: "Gmail Help (official docs)",
    provider: "Google",
    type: "doc",
    cost: "free",
    // labels, archiving, mail routing — the email side of the mail-flow task
    url: "https://support.google.com/mail",
    durationHours: 1,
    skillsAddressed: ["Sorting, opening and sending mail"],
    careerId: "clerk",
    pick: true,
  },
  {
    id: "res-clerk-ms-365",
    title: "Microsoft 365 help & learning",
    provider: "Microsoft Support",
    type: "doc",
    cost: "free",
    // printing/PDF flows for document reproduction
    url: "https://support.microsoft.com/en-us/office",
    durationHours: 2,
    skillsAddressed: [],
    careerId: "clerk",
  },
  {
    id: "res-clerk-owl-memos",
    title: "Purdue OWL — Memos (Professional/Technical Writing)",
    provider: "Purdue University",
    type: "doc",
    cost: "free",
    // "correspondence of a routine nature"
    url: "https://owl.purdue.edu/owl/subject_specific_writing/professional_technical_writing/memos/index.html",
    durationHours: 2,
    skillsAddressed: ["Routine reports & correspondence"],
    careerId: "clerk",
    pick: true,
  },
  {
    id: "res-clerk-top-receiving-comms",
    title: "Receiving and Responding to Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=52",
    durationHours: 2,
    skillsAddressed: ["Routine reports & correspondence", "Responding to enquiries (telephone/electronic) or forwarding"],
    creditingBody: "TESDA",
    careerId: "clerk",
    pick: true,
  },
  {
    id: "res-clerk-top-intro-bookkeeping",
    title: "Introduction to Bookkeeping (TOP Bookkeeping NC III module)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // backs the figures/invoices thin row (letter g)
    url: "https://e-tesda.gov.ph/course/view.php?id=3981",
    durationHours: 3,
    skillsAddressed: ["Checking figures, preparing invoices and recording details of financial transactions made"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "clerk",
    pick: true,
  },
  {
    id: "res-clerk-ratatype",
    title: "Ratatype (free typing portal + free certificate)",
    provider: "Ratatype",
    type: "course",
    cost: "free",
    // transcription throughput (letter h); certificate earned online
    url: "https://www.ratatype.com/",
    durationHours: 3,
    skillsAddressed: ["Transcribing information into computers, and proof-reading and correcting copy"],
    careerId: "clerk",
    pick: true,
  },
  {
    id: "res-clerk-top-ilo-humanskills",
    title: "Module 3: Building Human Skills for Career Success (TOP × ILO)",
    provider: "TESDA TOP × ILO",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=2014",
    durationHours: 2,
    skillsAddressed: ["Communication · Professionalism (Enabling)"],
    creditingBody: "TESDA × ILO",
    careerId: "clerk",
    pick: true,
  },
  {
    id: "res-clerk-skillsbuild",
    title: "IBM SkillsBuild (workplace-readiness library)",
    provider: "IBM",
    type: "course",
    cost: "free",
    // TOP mirror at course id 3331
    url: "https://skillsbuild.org/",
    durationHours: 3,
    skillsAddressed: ["Communication · Professionalism (Enabling)"],
    careerId: "clerk",
  },
  {
    id: "res-clerk-gap-equipment",
    title: "Equipment-issue register — declared resourceless-thin (no verified free resource; no forced search)",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["Recording issue of equipment to staff"],
    careerId: "clerk",
  },
  // ── encode (5.3) — d/e split; crypto anchor rides the data-movement row ──
  {
    id: "res-encode-ads-sheets",
    title: "Google Applied Digital Skills: Google Sheets for Beginners",
    provider: "Google for Education",
    type: "course",
    cost: "free",
    // free 45–90 min lesson; platform-migration banner — re-check near defense
    url: "https://applieddigitalskills.withgoogle.com/c/college-and-continuing-education/en/google-sheets-for-beginners/overview.html",
    durationHours: 1,
    skillsAddressed: ["Receiving & registering source documents for data capture", "Source-document reading & field mapping (entering from source material)"],
    creditingBody: "Google for Education",
    careerId: "encode",
    pick: true,
  },
  {
    id: "res-encode-workspace-catalog",
    title: "Google Workspace Training catalog (Sheets/Docs/Drive)",
    provider: "Google for Education (edu.exceedlms)",
    type: "course",
    cost: "free",
    // free lesson collection; Google account required; works on phone
    url: "https://edu.exceedlms.com/student/catalog/list?category_ids=11040-google-workspace-training",
    durationHours: 3,
    skillsAddressed: ["Receiving & registering source documents for data capture", "Source-document reading & field mapping (entering from source material)"],
    careerId: "encode",
  },
  {
    id: "res-encode-ms-365",
    title: "Microsoft 365 help & learning (Excel training)",
    provider: "Microsoft Support",
    type: "doc",
    cost: "free",
    url: "https://support.microsoft.com/en-us/office",
    durationHours: 2,
    skillsAddressed: ["Source-document reading & field mapping (entering from source material)"],
    careerId: "encode",
  },
  {
    id: "res-encode-typing-com",
    title: "Typing.com lessons (accuracy-oriented)",
    provider: "Typing.com",
    type: "course",
    cost: "free",
    // free tutor with accuracy drills; ad-supported
    url: "https://www.typing.com/student/lessons",
    durationHours: 3,
    skillsAddressed: ["Accuracy/error detection & correction"],
    careerId: "encode",
  },
  {
    id: "res-encode-ratatype",
    title: "Ratatype (typing tutor; certificate flow)",
    provider: "Ratatype",
    type: "course",
    cost: "free",
    // accuracy/speed evidence for the accuracy loop and the split thin rows
    url: "https://www.ratatype.com/",
    durationHours: 3,
    skillsAddressed: [
      "Accuracy/error detection & correction",
      
      
    ],
    careerId: "encode",
    pick: true,
  },
  {
    id: "res-encode-sheets-organize",
    title: "Google Workspace: Sheets — data organization lesson set (sort/validate)",
    provider: "Google for Education (edu.exceedlms)",
    type: "course",
    cost: "free",
    // "Organize raw data with sorting, formatting, and data validation" —
    // direct pre-entry sorting/validation practice; credential-for-completion
    url: "https://edu.exceedlms.com/student/path/1606820",
    durationHours: 1,
    skillsAddressed: ["Compilation, sorting, verification before entry"],
    creditingBody: "Google for Education",
    careerId: "encode",
    pick: true,
  },
  {
    id: "res-encode-top-digitallit",
    title: "Microsoft Digital Literacy (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // backs both split rows' tool/data-movement base
    url: "https://e-tesda.gov.ph/course/view.php?id=4716",
    durationHours: 4,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "encode",
  },
  {
    id: "res-encode-top-data-privacy",
    title: "Practicing Data Privacy in the Workplace (TOP Digital Literacy)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // PH-specific confidentiality backing (Filipino-context examples)
    url: "https://e-tesda.gov.ph/course/view.php?id=4395",
    durationHours: 2,
    skillsAddressed: ["Confidentiality (Etiquette/Professionalism — Enabling)"],
    creditingBody: "TESDA",
    careerId: "encode",
  },
  {
    id: "res-encode-ra10173",
    title: "Republic Act No. 10173 (Data Privacy Act of 2012)",
    provider: "Lawphil Project",
    type: "doc",
    cost: "free",
    // full statute text; privacy.gov.ph + officialgazette.gov.ph 403-blocked
    // this session — flagged
    url: "http://www.lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html",
    durationHours: 2,
    skillsAddressed: ["Confidentiality (Etiquette/Professionalism — Enabling)"],
    careerId: "encode",
    pick: true,
  },
  // ── desk (5.5) — tourism-family honesty note rides the TOP front-office rows ──
  {
    id: "res-desk-top-front-office",
    title: "Providing Front Office Services (TOP Tourism, Front Office Services NC II)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // reception conduct + guest/visitor service; honest note: the NC II is
    // tourism-organized (hotel front-office family) while the catalog refuses
    // hotel framing — the reception/enquiry lessons are the closest free PH
    // credential track for front-desk conduct (wording approved, travels)
    url: "https://e-tesda.gov.ph/course/view.php?id=4",
    durationHours: 12,
    skillsAddressed: [
      "Answering inquiries about goods/services/policies (availability, location, price)",
      "Assisting on problems, advice, information (member of the counter service set)",
      "Recording information about enquiries and complaints",
      "Referring complex enquiries to team leaders or expert advisers",
      "Communication & professionalism at the corporate front-desk (Enabling)",
    ],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "desk",
  },
  {
    id: "res-desk-top-front-office-intro",
    title: "Introduction to Front Office Services (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // entry-level intro of the same family; same tourism-family honesty note
    url: "https://e-tesda.gov.ph/course/view.php?id=50",
    durationHours: 3,
    skillsAddressed: [
      "Answering inquiries about goods/services/policies (availability, location, price)",
      "Assisting on problems, advice, information (member of the counter service set)",
      "Communication & professionalism at the corporate front-desk (Enabling)",
    ],
    creditingBody: "TESDA",
    careerId: "desk",
  },
  {
    id: "res-desk-top-workplace-comms",
    title: "Participating in Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=56",
    durationHours: 2,
    skillsAddressed: [
      "Answering inquiries about goods/services/policies (availability, location, price)",
      "Assisting on problems, advice, information (member of the counter service set)",
      "Referring complex enquiries to team leaders or expert advisers",
    ],
    creditingBody: "TESDA",
    careerId: "desk",
    pick: true,
  },
  {
    id: "res-desk-ads-sheets",
    title: "Google Applied Digital Skills: Google Sheets for Beginners",
    provider: "Google for Education",
    type: "course",
    cost: "free",
    // spreadsheet-logging lesson (header row + entries)
    url: "https://applieddigitalskills.withgoogle.com/c/college-and-continuing-education/en/google-sheets-for-beginners/overview.html",
    durationHours: 1,
    skillsAddressed: ["Recording information about enquiries and complaints"],
    creditingBody: "Google for Education",
    careerId: "desk",
    pick: true,
  },
  {
    id: "res-desk-workspace",
    title: "Google Workspace Learning Center",
    provider: "Google",
    type: "doc",
    cost: "free",
    // Forms/Sheets for simple inquiry logs
    url: "https://support.google.com/a/users",
    durationHours: 2,
    skillsAddressed: ["Recording information about enquiries and complaints"],
    careerId: "desk",
  },
  {
    id: "res-desk-ms-365",
    title: "Microsoft 365 help & learning",
    provider: "Microsoft Support",
    type: "doc",
    cost: "free",
    // producing/typing forms and handouts
    url: "https://support.microsoft.com/en-us/office",
    durationHours: 2,
    skillsAddressed: [],
    careerId: "desk",
  },
  {
    id: "res-desk-top-ilo-humanskills",
    title: "Module 3: Building Human Skills for Career Success (TOP × ILO)",
    provider: "TESDA TOP × ILO",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=2014",
    durationHours: 2,
    skillsAddressed: ["Communication & professionalism at the corporate front-desk (Enabling)"],
    creditingBody: "TESDA × ILO",
    careerId: "desk",
    pick: true,
  },
  {
    id: "res-desk-skillsbuild",
    title: "IBM SkillsBuild (workplace-skills library)",
    provider: "IBM",
    type: "course",
    cost: "free",
    // TOP-mirrored (id 3331)
    url: "https://skillsbuild.org/",
    durationHours: 3,
    skillsAddressed: ["Communication & professionalism at the corporate front-desk (Enabling)"],
    careerId: "desk",
  },
  {
    id: "res-desk-openlearn-comms",
    title: "Effective communication in the workplace",
    provider: "Open University (OpenLearn)",
    type: "course",
    cost: "free",
    // adopted 403 verdict line (keep-with-flag; flipped from "dropped" 2026-10-29);
    // row-6 communication/professionalism backing
    url: "https://www.open.edu/openlearn/money-business/effective-communication-the-workplace",
    durationHours: 3,
    skillsAddressed: ["Communication & professionalism at the corporate front-desk (Enabling)"],
    careerId: "desk",
  },
  // ── execsec (E2) — rebuilt to the blessed execsec.md pool (pre-blessing
  // round-12 scaffolds retired; the NARA rows are not in the blessed pool) ──
  {
    id: "res-execsec-work-smarter",
    title: "Work Smarter, Not Harder: Time Management for Personal & Professional Productivity",
    provider: "Coursera (UC Irvine)",
    type: "course",
    cost: "free",
    // VE3-3: audit-availability re-check before fixture copy — if audit is
    // not offered at re-check, treat as paid and drop
    url: "https://www.coursera.org/learn/work-smarter-not-harder",
    durationHours: 6,
    skillsAddressed: ["Executive schedule & calendar management"],
    careerId: "execsec",
  },
  {
    id: "res-execsec-gcal",
    title: "Google Calendar Help (official docs)",
    provider: "Google",
    type: "doc",
    cost: "free",
    // scheduling docs + itinerary-as-calendar practice
    url: "https://support.google.com/calendar/getstarted",
    durationHours: 1,
    skillsAddressed: ["Executive schedule & calendar management", "Travel arrangements"],
    careerId: "execsec",
    pick: true,
  },
  {
    id: "res-execsec-ms-365",
    title: "Microsoft 365 help & learning",
    provider: "Microsoft Support",
    type: "doc",
    cost: "free",
    // the "word processing, spreadsheet, database, or presentation software"
    // clause's direct back + timesheet practice docs
    url: "https://support.microsoft.com/en-us/office",
    durationHours: 2,
    skillsAddressed: ["Correspondence & document production", "Meeting administration & minutes", "Employee time-tracking"],
    careerId: "execsec",
    pick: true,
  },
  {
    id: "res-execsec-owl-memos",
    title: "Purdue OWL — Memos (Professional/Technical Writing)",
    provider: "Purdue University",
    type: "doc",
    cost: "free",
    // memo/minutes-adjacent writing
    url: "https://owl.purdue.edu/owl/subject_specific_writing/professional_technical_writing/memos/index.html",
    durationHours: 2,
    skillsAddressed: ["Correspondence & document production", "Meeting administration & minutes"],
    careerId: "execsec",
  },
  {
    id: "res-execsec-gmeet",
    title: "Google Meet Help",
    provider: "Google",
    type: "doc",
    cost: "free",
    // meeting-flow docs (recording availability depends on Workspace edition)
    url: "https://support.google.com/meet",
    durationHours: 1,
    skillsAddressed: ["Meeting administration & minutes"],
    careerId: "execsec",
    pick: true,
  },
  {
    id: "res-execsec-top-receiving-comms",
    title: "Receiving and Responding to Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=52",
    durationHours: 2,
    skillsAddressed: ["Information gatekeeping: calls & visitors"],
    creditingBody: "TESDA",
    careerId: "execsec",
    pick: true,
  },
  {
    id: "res-execsec-top-front-office",
    title: "Providing Front Office Services (TOP Tourism, Front Office Services NC II)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // reception/visitor conduct; same tourism-family honesty note as desk
    url: "https://e-tesda.gov.ph/course/view.php?id=4",
    durationHours: 12,
    skillsAddressed: ["Information gatekeeping: calls & visitors"],
    creditingBody: "TESDA",
    careerId: "execsec",
  },
  {
    id: "res-execsec-google-ai-admin",
    title: "Google AI Educator Series: Administrative Applications",
    provider: "Google for Education (edu.exceedlms)",
    type: "course",
    cost: "free",
    // AI-assisted drafting/research; free w/ Google account; TOP-mirrored
    // (ICT category 2160, verified public 200)
    url: "https://edu.exceedlms.com/student/catalog/list?category_ids=11692-google-ai-educator-series-administrative-applications",
    durationHours: 2,
    skillsAddressed: ["Research & briefing support for executives"],
    creditingBody: "Google for Education",
    careerId: "execsec",
  },
  {
    id: "res-execsec-workspace",
    title: "Google Workspace Learning Center",
    provider: "Google",
    type: "doc",
    cost: "free",
    // search/draft tooling + upkeep tooling (Sheets/Drive)
    url: "https://support.google.com/a/users",
    durationHours: 2,
    skillsAddressed: ["Research & briefing support for executives", "Travel arrangements"],
    careerId: "execsec",
    pick: true,
  },
  {
    id: "res-execsec-gmail",
    title: "Gmail Help (official docs)",
    provider: "Google",
    type: "doc",
    cost: "free",
    // labels/filter/route docs — the triage row's tool layer
    url: "https://support.google.com/mail",
    durationHours: 1,
    skillsAddressed: ["Incoming-material triage & distribution"],
    careerId: "execsec",
    pick: true,
  },
  {
    id: "res-execsec-top-intro-bookkeeping",
    title: "Introduction to Bookkeeping (TOP Bookkeeping NC III module)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // budget-prep-assistance clause backing
    url: "https://e-tesda.gov.ph/course/view.php?id=3981",
    durationHours: 3,
    skillsAddressed: ["Office services coordination"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "execsec",
    pick: true,
  },
  {
    id: "res-execsec-accountingcoach",
    title: "AccountingCoach (free accounting text incl. payroll topic)",
    provider: "AccountingCoach",
    type: "doc",
    cost: "free",
    // free text-based accounting; pro features sold — use the free layer
    url: "https://www.accountingcoach.com/",
    durationHours: 3,
    skillsAddressed: ["Payroll-information processing", "General office duties & tools"],
    careerId: "execsec",
    pick: true,
  },
  {
    id: "res-execsec-top-journalizing",
    title: "Journalizing Transactions (TOP Bookkeeping NC III module)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=3982",
    durationHours: 4,
    skillsAddressed: [],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "execsec",
  },
  {
    id: "res-execsec-top-workplace-comms",
    title: "Participating in Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // liaison/clerical-cooperation backing
    url: "https://e-tesda.gov.ph/course/view.php?id=56",
    durationHours: 2,
    skillsAddressed: ["General office duties & tools", "Clerical support across departments"],
    creditingBody: "TESDA",
    careerId: "execsec",
    pick: true,
  },
  {
    id: "res-execsec-top-ilo-humanskills",
    title: "Module 3: Building Human Skills for Career Success (TOP × ILO)",
    provider: "TESDA TOP × ILO",
    type: "course",
    cost: "free",
    // any-row human-skills add
    url: "https://e-tesda.gov.ph/course/view.php?id=2014",
    durationHours: 2,
    skillsAddressed: [],
    creditingBody: "TESDA × ILO",
    careerId: "execsec",
  },
  {
    id: "res-execsec-skillsbuild",
    title: "IBM SkillsBuild (workplace/leadership-adjacent badges)",
    provider: "IBM",
    type: "course",
    cost: "free",
    // senior-heavy rows' free backing side (the book rides PURCHASE_BOOKS)
    url: "https://skillsbuild.org/",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "execsec",
  },
  {
    id: "res-execsec-uk-archives",
    title: "The National Archives (UK) — Information management",
    provider: "The National Archives (UK)",
    type: "doc",
    cost: "free",
    // UK retention law not transferable — transfer the records discipline
    url: "https://www.nationalarchives.gov.uk/information-management/",
    durationHours: 3,
    skillsAddressed: ["Records & document filing/retrieval"],
    careerId: "execsec",
    pick: true,
  },
  // ── records (E3) — rebuilt to the blessed records.md pool (per-row linkage;
  // purchase books ride PURCHASE_BOOKS; the pre-blessing NARA lessons retire) ──
  {
    id: "res-records-uk-archives",
    title: "The National Archives (UK) — Information management",
    provider: "The National Archives (UK)",
    type: "doc",
    cost: "free",
    // records-creation/keeping/retrieval/evaluation guidance
    url: "https://www.nationalarchives.gov.uk/information-management/",
    durationHours: 3,
    skillsAddressed: ["Sort & classify materials to filing rules", "Filing into storage (drawers/cabinets/boxes)", "File retrieval on request"],
    careerId: "records",
    pick: true,
  },
  {
    id: "res-records-top-digitallit",
    title: "Microsoft Digital Literacy (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // electronic-filing side + hardware-basic operation
    url: "https://e-tesda.gov.ph/course/view.php?id=4716",
    durationHours: 4,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "records",
  },
  {
    id: "res-records-ads-sheets",
    title: "Google Applied Digital Skills: Google Sheets for Beginners",
    provider: "Google for Education",
    type: "course",
    cost: "free",
    // spreadsheet log practice for the filing-log row; migration banner noted
    url: "https://applieddigitalskills.withgoogle.com/c/college-and-continuing-education/en/google-sheets-for-beginners/overview.html",
    durationHours: 1,
    skillsAddressed: ["Filing log / records of materials filed & removed"],
    creditingBody: "Google for Education",
    careerId: "records",
    pick: true,
  },
  {
    id: "res-records-workspace",
    title: "Google Workspace Learning Center",
    provider: "Google",
    type: "doc",
    cost: "free",
    // shared-Drive record maintenance + record/database upkeep
    url: "https://support.google.com/a/users",
    durationHours: 2,
    skillsAddressed: ["Filing log / records of materials filed & removed", "Front-office record & database upkeep"],
    careerId: "records",
    pick: true,
  },
  {
    id: "res-records-workspace-catalog",
    title: "Google Workspace Training catalog (Sheets/Drive lesson catalog)",
    provider: "Google for Education (edu.exceedlms)",
    type: "course",
    cost: "free",
    url: "https://edu.exceedlms.com/student/catalog/list?category_ids=11040-google-workspace-training",
    durationHours: 3,
    skillsAddressed: ["Front-office record & database upkeep"],
    careerId: "records",
  },
  {
    id: "res-records-ms-365",
    title: "Microsoft 365 help & learning",
    provider: "Microsoft Support",
    type: "doc",
    cost: "free",
    // scanning/printing/PDF-flow docs
    url: "https://support.microsoft.com/en-us/office",
    durationHours: 2,
    skillsAddressed: [],
    careerId: "records",
  },
  {
    id: "res-records-top-front-office",
    title: "Providing Front Office Services (TOP Tourism, Front Office Services NC II)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // reception corroboration rows; tourism-family honesty note (as desk)
    url: "https://e-tesda.gov.ph/course/view.php?id=4",
    durationHours: 12,
    skillsAddressed: ["Telephone, switchboard & front-desk duties", "Visitor greeting & routing"],
    creditingBody: "TESDA",
    careerId: "records",
  },
  {
    id: "res-records-top-front-office-intro",
    title: "Introduction to Front Office Services (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=50",
    durationHours: 3,
    skillsAddressed: ["Telephone, switchboard & front-desk duties", "Visitor greeting & routing"],
    creditingBody: "TESDA",
    careerId: "records",
    pick: true,
  },
  {
    id: "res-records-gcal",
    title: "Google Calendar Help (official docs)",
    provider: "Google",
    type: "doc",
    cost: "free",
    // scheduling row backing
    url: "https://support.google.com/calendar/getstarted",
    durationHours: 1,
    skillsAddressed: ["Appointment & calendar scheduling"],
    careerId: "records",
    pick: true,
  },
  {
    id: "res-records-gmail",
    title: "Gmail Help (official docs)",
    provider: "Google",
    type: "doc",
    cost: "free",
    // labels/filters/archiving for mail handling
    url: "https://support.google.com/mail",
    durationHours: 1,
    skillsAddressed: ["Mail & document handling"],
    careerId: "records",
    pick: true,
  },
  {
    id: "res-records-top-workplace-comms",
    title: "Participating in Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // speaking/listening emphasis
    url: "https://e-tesda.gov.ph/course/view.php?id=56",
    durationHours: 2,
    skillsAddressed: ["Info & customer-service communication"],
    creditingBody: "TESDA",
    careerId: "records",
    pick: true,
  },
  {
    id: "res-records-top-ilo-humanskills",
    title: "Module 3: Building Human Skills for Career Success (TOP × ILO)",
    provider: "TESDA TOP × ILO",
    type: "course",
    cost: "free",
    url: "https://e-tesda.gov.ph/course/view.php?id=2014",
    durationHours: 2,
    skillsAddressed: ["Info & customer-service communication"],
    creditingBody: "TESDA × ILO",
    careerId: "records",
  },

];

/** Purchase-labeled commercial books per the blessed pools — typed locally
 *  (the locked `Resource` type is course/cert/NC/doc with peso-only cost;
 *  no peso price is printed by any source, so no invented conversion). */
export interface PurchaseBook {
  id: string;
  title: string;
  provider: string;
  /** the flagged rule: purchase label per the resource rule */
  purchaseLabel: true;
  /** verified page/record URL where the spec fetched one; otherwise the spec's printed citation */
  url?: string;
  /** printed price info, verbatim from the spec (never converted) */
  priceNote?: string;
  skillsAddressed: string[];
  careerId: string;
}

export const PURCHASE_BOOKS: PurchaseBook[] = [
  {
    id: "book-qa-foundations-sw-testing",
    title: "Foundations of Software Testing (standard ISTQB-aligned textbook)",
    provider: "commercial print (purchase-labeled)",
    purchaseLabel: true,
    skillsAddressed: ["Software Testing", "Test Planning"],
    careerId: "qa",
  },
  {
    id: "book-execsec-admin-handbook",
    title: "Administrative Assistant's and Secretary's Handbook (5th ed.)",
    provider: "HarperCollins Leadership / AMACOM (purchase)",
    purchaseLabel: true,
    // publisher page verified 200 (2026-10-29); printed price carried as-is
    url: "https://www.harpercollinsleadership.com/9781400241590/administrative-assistants-and-secretarys-handbook",
    priceNote: "$49.99 printed on the publisher page (2022; ISBN 9781400241590)",
    skillsAddressed: [
      "Records & document filing/retrieval",
      "Administrative policy setup & interpretation",
      "Representing executives / meeting on their behalf",
      "Supervision & training of clerical staff",
      "Operating-practice review",
    ],
    careerId: "execsec",
  },
  {
    id: "book-records-records-mgmt-textbook",
    title: "Records Management (Read & Ginn, Cengage/South-Western)",
    provider: "Cengage / South-Western (purchase-labeled; Google Books record page)",
    purchaseLabel: true,
    // publisher-textbook record page verified 200; used in PH office-admin programs
    url: "https://books.google.com/books/about/Records_Management.html?id=sskFSgAACAAJ",
    skillsAddressed: ["Sort & classify materials to filing rules", "Filing into storage (drawers/cabinets/boxes)", "File retrieval on request"],
    careerId: "records",
  },
  {
    id: "book-records-admin-handbook",
    title: "Administrative Assistant's and Secretary's Handbook (5th ed.) — book add",
    provider: "HarperCollins Leadership / AMACOM (purchase)",
    purchaseLabel: true,
    url: "https://www.harpercollinsleadership.com/9781400241590/administrative-assistants-and-secretarys-handbook",
    priceNote: "$49.99 printed on the publisher page (2022; ISBN 9781400241590)",
    skillsAddressed: ["Sort & classify materials to filing rules", "Filing into storage (drawers/cabinets/boxes)", "Reprographics: photocopy, scan, fax"],
    careerId: "records",
  },
];

export function getResourcesForCareer(careerId: string): Resource[] {
  return RESOURCES.filter((r) => r.careerId === careerId);
}

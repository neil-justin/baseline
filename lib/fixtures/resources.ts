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
  // Learn lines are drafts (learn line — authored 2026-11-03, user-delegated). Coverage:
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
        "Michigan's Python-for-everybody course runs the write-run-check loop from your first function — the maintain-code-to-spec work the FSC cell prints, with the skill check riding this exact resource.",
    },
    // learn line — authored 2026-11-03, user-delegated
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
    pick: true,
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Applications Support and Enhancement":
        "The foundations path puts you inside real web projects — reading, running and extending a live codebase and debugging what breaks, the app-understanding this skill's day job runs on.",
    },
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    pick: true,
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
  // each resource's actual content (learn line — authored 2026-11-03, user-delegated).
  // Wave B batch 2 (2026-11-03, user-ruled re-points): the two census pins
  // are RESOLVED —
  //  · "Quality Assurance / Quality Standards" — res-qa-sre-books re-pointed
  //    to the taught SLO chapter of the free SRE book (deep-link, verified
  //    LIVE 2026-11-03); the cell now resolves to a taught suggestion.
  //  · "Applications Support and Enhancement" — the census-thin cell is
  //    filled via the res-qa-google-bi re-point (no new row; census pins
  //    recalc'd in verify-fixtures per the sanctioned delta).
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
    // learn line — authored 2026-11-03, user-delegated
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
    pick: true,
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
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-qa-sre-books",
    title: "Service Level Objectives (Google SRE book, Ch. 4)",
    provider: "Google",
    type: "doc",
    cost: "free",
    // fetched LIVE 2026-11-03 (RE-POINTED, Wave B batch 2 user-ruled): the
    // old URL was the books INDEX (landing — chapters live behind it). The
    // suggested slot must open teachable content, so this row now points at
    // the free book's Chapter 4 deep-link — the quality-standards chapter
    // (fetched LIVE 2026-11-03: full teaching text — SLIs/SLOs/SLAs, metric
    // modeling, error budgets and the release-rollout control loop they
    // gate; the quality-metrics release-readiness discipline this skill
    // prints). Id/ADDR unchanged.
    url: "https://sre.google/sre-book/service-level-objectives/",
    durationHours: 2,
    skillsAddressed: ["Quality Assurance / Quality Standards"],
    careerId: "qa",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Quality Assurance / Quality Standards":
        "The SRE book's quality chapter teaches standards as measured objectives — define SLIs and SLO targets, budget the misses, and let the error budget gate what ships — quality criteria you can write and track rather than hope for.",
    },
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-qa-google-bi",
    title: "Technical Support Fundamentals (Google)",
    provider: "Coursera (Google)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (RE-POINTED, Wave B batch 2 user-ruled): the
    // old row was the Google-BI prof-cert landing (ADDR-catalog-only; fetched
    // LIVE 2026-10-29) and the ASE cell below was census-thin (no URL row
    // claimed it). The user bar (all skills get taught suggestions) rulings
    // land the fill via this re-point — no new row. New target: Google's
    // taught "Technical Support Fundamentals" (fetched LIVE 2026-11-03:
    // "Enroll for free", 6 modules incl. Software — installing/updating/
    // removing applications — and Troubleshooting with help-desk scenarios;
    // the install/maintain/troubleshoot loop the ASE cells print). ₱ paid
    // tier: shareable certificate (audit/financial-aid route is the free
    // tier). Same Google provider; id unchanged.
    url: "https://www.coursera.org/learn/technical-support-fundamentals",
    durationHours: 20,
    skillsAddressed: ["Applications Support and Enhancement"],
    careerId: "qa",
    pick: true, // recalc'd fallback winner for the filled qa::ASE cell (census keeps 1 flag/cell)
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Applications Support and Enhancement":
        "Google's support course walks the IT-support day job hands-on: installing, updating and removing software across systems, then troubleshooting real help-desk tickets with the user's context in hand — the application-problem loop this row prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
  // pools). Learn lines are drafts (learn line — authored 2026-11-03, user-delegated).
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
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Infrastructure Support":
        "Google's support fundamentals teaches the machines you'll keep alive — hardware, OS installs, software install/update/remove and troubleshooting — the monitor-maintain-patch day job in course form.",
    },
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
  },

  // == ── Business Analyst, IT (roster 2.3 · id ba) — ba.md §Resources ───────
  // Wave B audit (2026-11-03, batch 2): access/form per-row; two census-thin
  // cells filled user-ruled — the UAT cell via a new Microsoft taught-course
  // row (fetched LIVE), the flow-diagrams cell via a new Microsoft Visio
  // taught-course row (fetched LIVE). The Coursera guided project stays
  // UNGRADED: the project venue rides Coursera Plus (BA-V4 ruled
  // needs-user-at-enroll — no verified self-serve access fact this pass, so
  // the picker guards it; the taught course rows carry the cells instead).
  // Learn lines drafted from each resource's actual content (learn line —
  // authored 2026-11-03, user-delegated). Coverage: 7/7 vetted.
  {
    id: "res-ba-ibm-intro-ba",
    title: "Introduction to Business Analysis",
    provider: "IBM (Coursera)",
    type: "course",
    cost: "free",
    // BABOK-aligned free-audit intro (elicitation, stakeholder engagement,
    // gap analysis); backs the printed L3 cell ("Elicit and analyze …")
    // audit (2026-11-03): Coursera course page → audit route free, cert paid
    // → exam-paid; taught. Requirements Analysis + Business Needs Analysis
    // winner (the guided-project row stays ungraded — see block comment).
    url: "https://www.coursera.org/learn/introduction-to-business-analysis",
    durationHours: 10,
    skillsAddressed: ["Requirements Analysis", "Business Needs Analysis"],
    careerId: "ba",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Requirements Analysis":
        "Elicits requirements from stakeholders hands-on — interviews, gap analysis and turning a business problem into a documented requirement set, the elicit-and-analyze loop this skill prints.",
      "Business Needs Analysis":
        "Scopes the business problem before any solution: stakeholder needs, priorities and the information gathering the printed cell runs.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-ba-coursera-guided-project",
    title: "Business Analysis & Process Management (Guided Project)",
    provider: "Coursera",
    type: "course",
    cost: "free",
    // 2-hour hands-on process-analysis drill (Lucidchart); guided projects
    // sit inside Coursera's paid plan by default — verify the free-entry
    // state before recommending (BA-V4 ruled needs-user-at-enroll)
    // Wave B (2026-11-03): re-verified the project page LIVE (200; Lucidchart
    // steps, "Included with Coursera Plus") — but no self-serve access fact
    // could be verified at this URL, so the row stays UNGRADED (fail-closed);
    // the taught Visio course row carries the Process-modeling cell instead.
    url: "https://www.coursera.org/projects/business-analysis-process-management",
    // NOTE: last-known-good URL; project page verified LIVE 2026-11-03.
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
    // audit (2026-11-03, mockup draft): course page open in browser →
    // taught/direct (curl 403 — the keep-with-flag line)
    url: "https://www.open.edu/openlearn/money-business/effective-communication-the-workplace",
    durationHours: 3,
    skillsAddressed: [
      "Team Enablement",
      "Collaboration · Communication · Digital Fluency · Learning Agility (Enabling)",
    ],
    careerId: "ba",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Team Enablement":
        "Workplace communication drills: running team conversations, briefing across departments and keeping a team's information flowing — the enable-interface work this catalog row prints.",
      "Collaboration · Communication · Digital Fluency · Learning Agility (Enabling)":
        "The free course's practical communication activities train the collaboration/communication halves of the bundle and model learning-from-feedback — the enabling behaviors the row prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-ba-ms-ba-fundamentals",
    title: "Business Analysis Fundamentals (Microsoft)",
    provider: "Microsoft (Coursera)",
    type: "course",
    cost: "free",
    // requirements → documentation → communication
    // audit (2026-11-03): Coursera course page → audit route free, cert paid
    // → exam-paid; taught. Requirements Specification winner (the Figma
    // resource-library URL is an article index = landing; see row).
    url: "https://www.coursera.org/learn/business-analysis-fundamentals",
    durationHours: 10,
    skillsAddressed: ["Requirements Specification"],
    careerId: "ba",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Requirements Specification":
        "Teaches turning elicited needs into written requirement documents and communicating them downstream — the specify-and-document flow this catalog row prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-ba-ms-testing-fund",
    title: "Software Testing Fundamentals and Methodologies (Microsoft)",
    provider: "Microsoft (Coursera)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 2 fill, user-ruled): the UAT
    // cell was census-thin (no URL row claimed it — verified-fixtures spot
    // pin). New row for the taught Microsoft course page ("Enroll for
    // free", 10 modules): honors the UAT craft this skill prints — module 8
    // defines acceptance criteria and executes acceptance tests against a
    // live mock app, module 9 demos passing/failing tests to business
    // stakeholders at the sprint review (the hand-over demo), and the QA/QC
    // vs UAT distinction opens the course. ₱ paid tier: shareable
    // certificate (audit/financial-aid route is the free tier).
    url: "https://www.coursera.org/learn/software-testing-fundamentals-and-methodologies",
    durationHours: 8,
    skillsAddressed: ["Solution Support (UAT & hand-over)"],
    careerId: "ba",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Solution Support (UAT & hand-over)":
        "You write acceptance criteria, run acceptance tests on a live app, then demo passing (and failing) tests to business stakeholders in the sprint review — running UAT and handing the software over to its users, which this skill prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-ba-visio",
    title: "Data and Business Process Modeling with Microsoft Visio",
    provider: "Microsoft (Coursera)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 2 fill, user-ruled): the
    // flow-diagrams cell had only the ungraded guided-project claim. New row
    // for the taught Microsoft Visio course ("Enroll for free", Beginner,
    // 3-4 weeks): business process modeling, data modeling and process flow
    // diagrams (DFDs) drawn in Visio hands-on — the flow-diagram modeling
    // this catalog row prints. ₱ paid tier: shareable certificate.
    url: "https://www.coursera.org/learn/data-and-business-process-modeling-with-microsoft-visio",
    durationHours: 8,
    skillsAddressed: ["Process modeling (flow diagrams, use cases)"],
    careerId: "ba",
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Process modeling (flow diagrams, use cases)":
        "Draws the organization's processes as Visio flow diagrams and data-flow models hands-on — how work flows between actors, broken into steps a diagram reader can trace.",
    },
    // learn line — authored 2026-11-03, user-delegated
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
    form: "reference",
    access: "direct",
  },
  {
    id: "res-ba-lhtl",
    title: "Learning How to Learn",
    provider: "Deep Teaching Solutions (Coursera)",
    type: "course",
    cost: "free",
    // "eagerness to learn from subject matter experts" behavior support
    // audit (2026-11-03): audit route → exam-paid (ADDR retired — catalog-only)
    url: "https://www.coursera.org/learn/learning-how-to-learn",
    durationHours: 4,
    skillsAddressed: [],
    careerId: "ba",
    form: "taught",
    access: "exam-paid",
  },

  // == ── Network / Systems Administrator (2.5 · id sysadmin) ────────────────
  // Wave B audit (2026-11-03, batch 2): access/form per-row. The Google IT
  // Support prof-cert row was RE-POINTED to the taught course-3 page
  // (verified LIVE) so the suggested slot opens teachable content, and the
  // taught SRE SLO chapter arrives as a per-role duplicate row (pool
  // convention) to carry the SLA CWF cell. Adviser-only reds remain, honest,
  // never papered over (searched the open catalog this pass):
  //  · "↳ CWF sub-row: Optimize systems performance" — no taught self-serve
  //    page verified (Coursera's dedicated courses ride paid tiers /
  //    guided-project venues); stays no-claim, flagged adviser-only.
  //  · "IT Asset Management" / "System Integration" — SYS-V1 declared thin;
  //    re-searched this pass, no dedicated free taught page verified — gap
  //    rows stand.
  //  · "Configuration Tracking · Cyber-and-Data-Breach Incident Management ·
  //    Business Needs Analysis" — constructed 3-family bundle; a single
  //    taught page satisfying all three families was not verified — no row
  //    exists, adviser-only ruling pending.
  // Coverage: 8/12 vetted (the four above stay honestly red).
  {
    id: "res-sysadmin-edx-linux",
    title: "Introduction to Linux (The Linux Foundation)",
    provider: "The Linux Foundation (edX)",
    type: "course",
    cost: "free",
    // free canonical Linux-systems foundations; verified certificate paid
    // Wave B (2026-11-03): the edX fetch this pass returned the SPA shell
    // without course content verifiable at this URL — NOT GRADED
    // (fail-closed; the LFS101x audit facts need a browser check before the
    // she can carry the slot. The Book row below carries the cell.)
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
    // audit (2026-11-03): docs hub index = reference (vendor docs)
    url: "https://ubuntu.com/server/docs",
    durationHours: 2,
    skillsAddressed: ["Systems administration (user groups, upgrades, backups)"],
    careerId: "sysadmin",
    pick: true,
    form: "reference",
    access: "direct",
  },
  {
    id: "res-sysadmin-tlcl-doc",
    title: "The Linux Command Line (free PDF)",
    provider: "William Shotts / linuxcommand.org",
    type: "doc",
    cost: "free",
    // free text; print = purchase (labeled)
    // audit (2026-11-03): the book itself = taught (content-shape ruling:
    // "course, tutorial, book"); open access. Systems-administration winner:
    // the book teaches user/group management, package upgrades, file
    // systems, processes and the systems-administration craft the CWF list
    // prints.
    url: "http://linuxcommand.org/tlcl.php",
    durationHours: 8,
    skillsAddressed: ["Systems administration (user groups, upgrades, backups)"],
    careerId: "sysadmin",
    form: "taught",
    access: "direct",
    learnNotes: {
      "Systems administration (user groups, upgrades, backups)":
        "The book walks the sysadmin day job at the command line — managing users and groups, installing and upgrading packages, handling permissions, processes and backups from the shell.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-sysadmin-linux-journey",
    title: "Linux Journey (free short modules)",
    provider: "Linux Journey",
    type: "course",
    cost: "free",
    // 403 to scripted fetch (audit 2026-11-02) — site-wide bot-wall verdict
    // carried from the swd sibling (same domain); NOT GRADED this pass
    // (fail-closed). URL NOT dead per the prior browser verdict.
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
    // audit (2026-11-03): Cisco NetAcad self-paced course page (free signup
    // → account; verified title fetch LIVE)
    url: "https://www.netacad.com/courses/networking-basics",
    durationHours: 22,
    skillsAddressed: ["Network Administration and Maintenance"],
    creditingBody: "Cisco Networking Academy",
    careerId: "sysadmin",
    form: "taught",
    access: "account",
  },
  {
    id: "res-sysadmin-netacad-addressing",
    title: "Network Addressing and Basic Troubleshooting",
    provider: "Cisco Networking Academy",
    type: "course",
    cost: "free",
    // audit (2026-11-03): Cisco NetAcad self-paced course page (free signup
    // → account Network-administration winner (id A–Z over the Basics
    // row — both credited and taught).
    url: "https://www.netacad.com/courses/network-addressing-and-basic-troubleshooting",
    durationHours: 20,
    skillsAddressed: ["Network Administration and Maintenance"],
    creditingBody: "Cisco Networking Academy",
    careerId: "sysadmin",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Network Administration and Maintenance":
        "You plan IP addressing schemes, configure hosts on a LAN, and run the connectivity checks and fixes an administrator maintains on a live network.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-sysadmin-google-it-support",
    title: "System Administration and IT Infrastructure Services (Google)",
    provider: "Coursera (Google)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (RE-POINTED, Wave B batch 2): the old URL was
    // the Google IT Support prof-cert landing. The suggested slot must open
    // teachable content, so this row now points at the taught cert course 3
    // (fetched LIVE 2026-11-03: "Enroll for free", 6 modules — system admin
    // roles, provisioning, routine maintenance, network/infrastructure
    // services, directory services, disaster recovery + a systems-consultation
    // final project). Id unchanged; ₱ paid tier: shareable certificate
    // (audit/financial-aid route free).
  // Wave E recap below (hunt 2026-11-03): 9/12 vetted — the Optimize-systems-
  // performance no-claim fills with the MS Learn Windows-Server-perf module;
  // ITAM / System Integration / the 3-family bundle adjudicated (see Wave E
  // block below).
    url: "https://www.coursera.org/learn/system-administration-it-infrastructure-services",
    durationHours: 25,
    skillsAddressed: [
      "Infrastructure Support",
      "↳ CWF sub-row: Resolve system-related incidents",
      "↳ CWF sub-row: Design and develop new systems",
    ],
    careerId: "sysadmin",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Infrastructure Support":
        "Covers the infrastructure services an organization's users run on — provisioning, server platforms, directory services and keeping those services up and recoverable.",
      "↳ CWF sub-row: Resolve system-related incidents":
        "Troubleshooting and escalation run through the whole course — identify issues, work the fix, escalate unresolved ones — the incident loop the CWF prints.",
      "↳ CWF sub-row: Design and develop new systems":
        "The final project has you assess three organizations' infrastructure and design the systems recommendations that make services available to users — new-systems support work.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-sysadmin-ms-learn-wsperf",
    title: "Monitor Windows Server performance (module)",
    provider: "Microsoft Learn",
    type: "doc",
    cost: "free",
    // fetched LIVE 2026-11-03 (sysadmin Wave E hunt): module page, HTTP 200 —
    // teaches Performance Monitor counters/baselines and capacity planning,
    // i.e. the optimization/metrics CWF bullets. The Optimize-systems-
    // performance cell had NO claim row (no-claim red) — this row fills it.
    url: "https://learn.microsoft.com/en-us/training/modules/monitor-windows-server-performance/",
    durationHours: 2,
    skillsAddressed: ["↳ CWF sub-row: Optimize systems performance"],
    careerId: "sysadmin",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "↳ CWF sub-row: Optimize systems performance":
        "You take Performance Monitor readings — CPU, memory, disk and network counters — build a baseline, and use what the numbers show to size upgrades and carry out the optimisation the CWF prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-sysadmin-windows-server-docs",
    title: "Windows Server documentation",
    provider: "Microsoft Learn",
    type: "doc",
    cost: "free",
    // directory/service integration context (the ITAM/System-Integration
    // thin-zone backing docs — SYS-V1)
    // audit (2026-11-03): vendor docs hub = reference
    url: "https://learn.microsoft.com/en-us/windows-server/",
    durationHours: 4,
    skillsAddressed: [],
    careerId: "sysadmin",
    form: "reference",
    access: "direct",
  },
  {
    id: "res-sysadmin-ms-learn-ad-ds",
    title: "Active Directory Domain Services (learning path)",
    provider: "Microsoft Learn",
    type: "doc",
    cost: "free",
    // access-control administration (users/groups/GPO)
    // audit (2026-11-03): fetched LIVE — MS Learn learning path, 5 modules
    // (AD DS intro to cert services) with units/labs, open access → taught
    // (a structured learning flow, not the docs hub). Security-administration
    // winner.
    url: "https://learn.microsoft.com/en-us/training/paths/active-directory-domain-services",
    durationHours: 10,
    skillsAddressed: ["Security Administration"],
    careerId: "sysadmin",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Security Administration":
        "A guided path on administering access controls — users, groups and group policy in Active Directory, and the certificate-services permissions around them — the authorization/access-control craft this skill prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-sysadmin-sre-slo",
    title: "Service Level Objectives (Google SRE book, Ch. 4)",
    provider: "Google",
    type: "doc",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 2 fill, user-ruled): the SLA CWF
    // cell had no catalog row. Per-role duplicate of the qa pool's verified
    // SLO chapter (pool convention: identical provider pages appear as
    // separate rows). The chapter teaches exactly the CWF bullets — assist
    // developing service-level objectives/targets, the metrics a team tracks,
    // and the control loop that turns SLI/SLO misses into service
    // improvements.
    url: "https://sre.google/sre-book/service-level-objectives/",
    durationHours: 2,
    skillsAddressed: ["↳ CWF sub-row: Oversee service level agreements and service improvements"],
    careerId: "sysadmin",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "↳ CWF sub-row: Oversee service level agreements and service improvements":
        "Teaches writing SLO targets, selecting the metrics that measure them, and using the error budget as the control loop for recurring-incident reviews and service improvements.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-sysadmin-owasp-cheatsheets",
    title: "OWASP Cheat Sheet Series",
    provider: "OWASP Foundation",
    type: "doc",
    cost: "free",
    // hardening drills behind patch/threat protection
    // audit (2026-11-03): readable drills/answers = reference
    url: "https://cheatsheetseries.owasp.org/",
    durationHours: 4,
    skillsAddressed: [],
    careerId: "sysadmin",
    form: "reference",
    access: "direct",
  },
  {
    id: "res-sysadmin-progit",
    title: "Pro Git, 2nd Edition (free full web text)",
    provider: "Apress / git-scm.com",
    type: "doc",
    cost: "free",
    // change-accounting standard behind Configuration Tracking
    // audit (2026-11-03): free book (taught per the content-shape ruling); open access
    url: "https://git-scm.com/book/en/v2",
    durationHours: 8,
    skillsAddressed: [],
    careerId: "sysadmin",
    form: "taught",
    access: "direct",
  },
  {
    id: "res-sysadmin-semver",
    title: "Semantic Versioning 2.0.0 (official spec)",
    provider: "semver.org",
    type: "doc",
    cost: "free",
    // audit (2026-11-03): spec text = reference, open access
    url: "https://semver.org/",
    durationHours: 1,
    skillsAddressed: [],
    careerId: "sysadmin",
    form: "reference",
    access: "direct",
  },
  {
    id: "res-sysadmin-openlearn-comms",
    title: "Effective communication in the workplace",
    provider: "Open University (OpenLearn)",
    type: "course",
    cost: "free",
    // adopted 403 verdict line (keep-with-flag)
    // audit (2026-11-03, mockup draft): course page open in browser →
    // taught/direct (curl 403 — the keep-with-flag line)
    url: "https://www.open.edu/openlearn/money-business/effective-communication-the-workplace",
    durationHours: 3,
    skillsAddressed: ["Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)"],
    careerId: "sysadmin",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)":
        "Practical team-communication activities — running conversations, briefing colleagues, working around the group's rhythm — the enabling behaviors the bundle prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  // sysadmin Wave E hunt (2026-11-03, user-delegated): 
  //  · "↳ CWF sub-row: Optimize systems performance" — FILLED with the MS
  //    Learn Monitor-Windows-Server-performance module (fetched LIVE
  //    2026-11-03): perf Monitor/metrics/baselines/capacity planning teach
  //    the CWF bullets ("carry out optimisation…", "track key operational
  //    metrics, performance, utilization, throughput and capacity").
  //  · "IT Asset Management" — re-hunted (edX/ServiceNow subject hub, MS Learn,
  //    classcentral, Coursera audit list): every teachable-looking hit is a
  //    vendor product/marketing page, a certificate-syllabus blurb, or a
  //    LinkedIn-Learning row (ruled drop) — no taught self-serve page exists,
  //    adjudicated Wave E (SYS-V1 declared thin stands).
  //  · "System Integration" — re-hunted (edX integration subject search):
  //    taught audit matches are energy/robotics scale, not IT-systems craft —
  //    no taught self-serve page exists, adjudicated Wave E (gap rows stand).
  //  · "Configuration Tracking · Cyber-and-Data-Breach Incident Management ·
  //    Business Needs Analysis" — constructed 3-family bundle: no single
  //    taught page satisfies all three families — adjudicated Wave E.
  // Coverage: 9/12 vetted (the three above stay honestly red).
  // SYS-V1 declared thin zones (kept declared — ITAM/System Integration gap)
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
  // Wave B audit (2026-11-03, batch 2): access/form per-row (the vendor/PDF
  // docs grade reference and stay unvettable by contract; learn lines on the
  // taught winners). FIVE census-thin taught claims filled user-ruled — new
  // rows for the verified taught pages (IBM DBA · IBM DB-vulnerabilities ·
  // Meta DB structures · the per-role SRE postmortem chapter · the per-role
  // Google systems course), and the ETL leg of the FCC relational program
  // carries Data Migration. Learn lines drafted from the resources' actual
  // content (learn line — authored 2026-11-03, user-delegated). Coverage: 11/11 vetted.
  {
    id: "res-dba-ibm-db-admin",
    title: "Relational Database Administration (DBA) (IBM)",
    provider: "IBM (Coursera)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 2 fill, user-ruled): the four
    // dbadmin cells had only reference-grade vendor/PDF rows. New row for
    // IBM's taught DBA course ("Enroll for free", 5 modules): database
    // management tasks day-to-day, backup/restore procedures, user/roles
    // administration, monitoring and optimization (baselines, slow queries,
    // indexes), and connectivity/login/configuration troubleshooting with
    // automated alerts — the administration craft this family prints.
    // ₱ paid tier: shareable certificate (audit/financial-aid free).
    url: "https://www.coursera.org/learn/relational-database-administration",
    durationHours: 21,
    skillsAddressed: [
      "Database Administration",
      "↳ CWF sub-row: Oversee database administration",
      "↳ CWF sub-row: Optimize database performance",
      "↳ CWF sub-row: Resolve database incidents",
    ],
    creditingBody: "IBM",
    careerId: "dba",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Database Administration":
        "Runs the DBA day job end to end: configuring servers and schemas, managing user roles, backing up and restoring databases across MySQL/PostgreSQL/DB2.",
      "↳ CWF sub-row: Oversee database administration":
        "Hands-on labs on backup policies and restore drills, user groups and password administration — the oversight craft the CWF prints.",
      "↳ CWF sub-row: Optimize database performance":
        "The monitoring module sets baselines and metrics, tracks RAM/disk usage and connections, then works indexes and slow queries to bring performance back.",
      "↳ CWF sub-row: Resolve database incidents":
        "A troubleshooting module for connectivity, login and configuration failures — diagnose, fix, and automate the alerting around them.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-dba-sqlserver-docs",
    title: "SQL Server technical documentation",
    provider: "Microsoft Learn",
    type: "doc",
    cost: "free",
    // audit (2026-11-03): vendor docs hub = reference
    url: "https://learn.microsoft.com/en-us/sql/sql-server/",
    durationHours: 4,
    skillsAddressed: ["Database Administration", "↳ CWF sub-row: Design and develop new database"],
    careerId: "dba",
    pick: true,
    form: "reference",
    access: "direct",
  },
  {
    id: "res-dba-meta-db-structures",
    title: "Database Structures and Management with MySQL (Meta)",
    provider: "Meta (Coursera)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 2 fill, user-ruled): the
    // design-and-develop CWF cell had only a reference-grade vendor row.
    // New row for Meta's taught MySQL course ("Enroll for free", 4
    // modules): build and modify relational databases with SQL hands-on —
    // schemas, keys, constraints, ALTER/COPY TABLE, stored procedures, and
    // a normalization project. ₱ paid tier: shareable certificate.
    url: "https://www.coursera.org/learn/database-structures-and-management-with-mysql",
    durationHours: 12,
    skillsAddressed: ["↳ CWF sub-row: Design and develop new database"],
    creditingBody: "Meta",
    careerId: "dba",
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "↳ CWF sub-row: Design and develop new database":
        "Builds a new database in MySQL from the ground up — schemas and tables, primary/foreign-key relationships, constraints, views and stored procedures, ending in a normalization project — the design-and-develop CWF work, hands-on.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-dba-postgresql-docs",
    title: "PostgreSQL Documentation (official)",
    provider: "PostgreSQL Global Development Group",
    type: "doc",
    cost: "free",
    // audit (2026-11-03): docs hub index = reference (the Part I tutorial
    // variant in the da pool is the taught companion)
    url: "https://www.postgresql.org/docs/",
    durationHours: 4,
    skillsAddressed: ["Database Administration", "Data Engineering"],
    careerId: "dba",
    pick: true,
    form: "reference",
    access: "direct",
  },
  {
    id: "res-dba-fcc-relational",
    title: "Relational Database Certification",
    provider: "freeCodeCamp",
    type: "cert",
    cost: "free",
    // Bash/PostgreSQL/ETL production-grade intro drills; fully free
    // audit (2026-11-03): FCC hands-on projects; free signup → account.
    // Data Engineering + Data Migration winner (the import/export ETL
    // drills are the migration craft; see learn line).
    url: "https://www.freecodecamp.org/learn/relational-database/",
    durationHours: 45,
    skillsAddressed: ["Data Engineering", "Data Migration"],
    creditingBody: "freeCodeCamp",
    careerId: "dba",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Data Engineering":
        "Projects set up the database backbone itself — Bash and PostgreSQL tooling on real containers, building the pipelines a junior data engineer ships.",
      "Data Migration":
        "The program's extract-transform-load drills move real records between systems and formats — writing the import/export scripts that get data across cleanly, the migration craft this row prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-dba-ibm-db-vuln",
    title: "Database Essentials and Vulnerabilities (IBM)",
    provider: "IBM (Coursera)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 2 fill, user-ruled): the
    // security-controls cell had only the reference-grade OWASP cheat
    // sheet. New row for IBM's taught database-security course ("Enroll for
    // free", 5 modules): securing databases in practice — user profiles,
    // password policies, privileges and roles, protection techniques
    // (injection vulnerability analysis, encryption/hashing/masking), and
    // the audit models a DBA implements. ₱ paid tier: certificate.
    url: "https://www.coursera.org/learn/database-essentials-and-vulnerabilities",
    durationHours: 15,
    skillsAddressed: ["Database security controls"],
    creditingBody: "IBM",
    careerId: "dba",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Database security controls":
        "Teaches the controls directly: user profiles and password policies, privilege/role setup, injection vulnerability testing, encryption-heavy protection techniques, and the security/auditing models built in hands-on labs.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-dba-ubuntu-server-docs",
    title: "Ubuntu Server documentation",
    provider: "Canonical",
    type: "doc",
    cost: "free",
    // host-level OS context ("understand where the database lives")
    // audit (2026-11-03): docs hub index = reference
    url: "https://ubuntu.com/server/docs",
    durationHours: 2,
    skillsAddressed: ["Infrastructure Support"],
    careerId: "dba",
    pick: true,
    form: "reference",
    access: "direct",
  },
  {
    id: "res-dba-google-sysadmin",
    title: "System Administration and IT Infrastructure Services (Google)",
    provider: "Coursera (Google)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 2 fill, user-ruled): the
    // Infrastructure Support cell had only the reference-grade Ubuntu docs
    // row. Per-role duplicate of the sysadmin pool's taught Google course
    // (pool convention): teaches the infrastructure services an
    // organization runs on — hosting servers, backups, recovery and where
    // the system work the database lives on happens hands-on.
    url: "https://www.coursera.org/learn/system-administration-it-infrastructure-services",
    durationHours: 25,
    skillsAddressed: ["Infrastructure Support"],
    creditingBody: "Google",
    careerId: "dba",
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Infrastructure Support":
        "Holds the host machinery steady around the database's home: server setup, directory and backup services, and the disaster-recovery plan the instances depend on.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-dba-sre-postmortem",
    title: "Postmortem Culture: Learning from Failure (Google SRE book, Ch. 15)",
    provider: "Google",
    type: "doc",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 2 fill, user-ruled; curl 200):
    // the Problem Management cell had only the reference-grade Atlassian
    // guide. Per-role duplicate row of the verified SRE chapter
    // (pool convention): teaches the blameless postmortem discipline —
    // investigating failures, isolating the root cause, and writing the
    // fix-back-and-prevent plan — the problem-management craft (analyze
    // recurring incidents → root cause → resolution) the row prints.
    url: "https://sre.google/sre-book/postmortem-culture/",
    durationHours: 2,
    skillsAddressed: ["Problem Management"],
    careerId: "dba",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Problem Management":
        "Teaches how problems get solved for good: gather the incident timeline, run the blameless RCA over the failure sequence, then ship and track the corrective actions that keep the problem class from recurring.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-dba-openlearn-comms",
    title: "Effective communication in the workplace",
    provider: "Open University (OpenLearn)",
    type: "course",
    cost: "free",
    // adopted 403 verdict line (keep-with-flag); standby-rotation comms
    // audit (2026-11-03, mockup draft): course page open in browser →
    // taught/direct (curl 403 — the keep-with-flag line)
    url: "https://www.open.edu/openlearn/money-business/effective-communication-the-workplace",
    durationHours: 3,
    skillsAddressed: ["Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)"],
    careerId: "dba",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)":
        "Workplace communication practice — briefing across the on-call rotation, explaining technical state to non-technical colleagues — the enabling behaviors the bundle prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },

  // == ── Security Analyst (2.7 · id cybersec) ───────────────────────────────
  // Wave B audit (2026-11-03, batch 2): access/form per-row. The IBM
  // SkillsBuild root and the Google prof-cert landing grade landing (both
  // ride the hub pages); one census-thin taught claim filled user-ruled —
  // the per-role Infosec incident-response course (verified LIVE in the da
  // pool) carries the Cyber-and-Data-Breach-Incident-Management cell, whose
  // only prior claim was reference-grade MITRE. Learn lines drafted from
  // each resource's actual content (learn line — authored 2026-11-03, user-delegated).
  // Coverage: 5/5 vetted.
  {
    id: "res-cybersec-netacad-intro-cyber",
    title: "Introduction to Cybersecurity",
    provider: "Cisco Networking Academy",
    type: "course",
    cost: "free",
    // ~6 h free beginner course; certificate of completion
    // audit (2026-11-03): NetAcad course page verified LIVE; free signup →
    // account. Threat-analysis winner (crediting Cisco beats the hub rows).
    url: "https://www.netacad.com/courses/introduction-to-cybersecurity",
    durationHours: 6,
    skillsAddressed: ["Threat analysis / monitoring"],
    creditingBody: "Cisco Networking Academy",
    careerId: "cybersec",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Threat analysis / monitoring":
        "Walks how attacks happen and get detected: threat types, the CIA triad, attack vectors and the monitoring mindset a junior security analyst watches for.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-cybersec-infosec-ir",
    title: "Cyber Incident Response (Infosec)",
    provider: "Coursera (Infosec)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 2 fill, user-ruled): the
    // incident-management cell had only reference-grade MITRE. Per-role
    // duplicate of the da pool's verified Infosec course (pool convention):
    // 1 module / ~2 h, "Enroll for free" — how incidents are categorized,
    // contained and escalated through the IR process, the
    // recognize→report→escalate loop this family prints. ₱ paid certificate.
    url: "https://www.coursera.org/learn/incident-response",
    durationHours: 2,
    skillsAddressed: ["Cyber and Data Breach Incident Management"],
    creditingBody: "Infosec",
    careerId: "cybersec",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Cyber and Data Breach Incident Management":
        "Incident-response fundamentals taught hands-on-light: when an event becomes an incident, who drives containment, and how status and escalation travel through the IR process — the breach-response loop the row prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-cybersec-fortinet",
    title: "Fortinet Training Institute — free self-paced catalog",
    provider: "Fortinet",
    type: "cert",
    cost: "free",
    // free NSE-family courses w/ free completion certificates (SOC-adjacent);
    // CYB-V5: current certificate terms re-check queued
    // audit (2026-11-03): training-catalog hub = landing/direct
    url: "https://www.fortinet.com/training-certification",
    durationHours: 6,
    skillsAddressed: [],
    careerId: "cybersec",
    form: "landing",
    access: "direct",
  },
  {
    id: "res-cybersec-netacad-networking-basics",
    title: "Networking Basics",
    provider: "Cisco Networking Academy",
    type: "course",
    cost: "free",
    // "understand the networks being defended"
    // audit (2026-11-03): NetAcad course page verified LIVE; free signup → account
    url: "https://www.netacad.com/courses/networking-basics",
    durationHours: 22,
    skillsAddressed: ["Network administration & maintenance"],
    creditingBody: "Cisco Networking Academy",
    careerId: "cybersec",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Network administration & maintenance":
        "Teaches the networks being defended — addresses, hosts, routers and the build-and-check flow of running a small network, the maintenance base the row prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-cybersec-tryhackme",
    title: "TryHackMe — free learning tier (rooms/labs)",
    provider: "TryHackMe",
    type: "course",
    cost: "free",
    // hands-on vulnerability-scanning/PtT practice in browser; free rooms
    // exist, full paths/advanced labs are paid — stated plainly on copy (CYB-V5)
    // audit (2026-11-03): tryhackme.com root = the landing; rooms sit behind
    // the free signup → landing/account
    url: "https://tryhackme.com/",
    durationHours: 4,
    skillsAddressed: ["Vulnerability assessment support (VAPT analyst track)"],
    careerId: "cybersec",
    pick: true,
    form: "landing",
    access: "account",
  },
  {
    id: "res-cybersec-netacad-ethical-hacker",
    title: "Ethical Hacker",
    provider: "Cisco Networking Academy",
    type: "course",
    cost: "free",
    // ~70 h free course covering scans/tests basics; seat availability at signup
    // audit (2026-11-03): NetAcad course page verified LIVE ("Ethical
    // Hacker"); free signup → account. VAPT-track winner.
    url: "https://www.netacad.com/courses/ethical-hacker",
    durationHours: 70,
    skillsAddressed: ["Vulnerability assessment support (VAPT analyst track)"],
    creditingBody: "Cisco Networking Academy",
    careerId: "cybersec",
    form: "taught",
    access: "account",
    learnNotes: {
      "Vulnerability assessment support (VAPT analyst track)":
        "A full scan-and-report curriculum: reconnaissance, the scanning and enumeration drills, vulnerability identification and the safety rules for testing — the VAPT support craft, hands-on.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-cybersec-openlearn-comms",
    title: "Effective communication in the workplace",
    provider: "Open University (OpenLearn)",
    type: "course",
    cost: "free",
    // adopted 403 verdict line (keep-with-flag); escalation/report writing
    // audit (2026-11-03, mockup draft): course page open in browser →
    // taught/direct (curl 403 — the keep-with-flag line)
    url: "https://www.open.edu/openlearn/money-business/effective-communication-the-workplace",
    durationHours: 3,
    skillsAddressed: ["Collaboration · Communication · Problem Solving · Digital Fluency (Enabling)"],
    careerId: "cybersec",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Collaboration · Communication · Problem Solving · Digital Fluency (Enabling)":
        "Practice writing and briefing for the workplace — escalation notes and cross-team explanation — the communication/problem-solving bundle behaviors.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },

  // == ── Web Developer (2.8 · id webdev) ────────────────────────────────────
  // Wave B audit (2026-11-03, batch 2): access/form per-row (MDN Learn hub +
  // web.dev hub + Atlassian/Scrum/WAI grade landing or reference
  // fail-closed). Two census-thin taught claims filled user-ruled (both
  // fetched LIVE 2026-11-03): the official Learn WordPress course carries
  // the CMS cell, and the verified IBM swd Agile course arrives as a
  // per-role duplicate row for the agility cell. The site life-operations
  // task-cluster stays honestly red (adviser-only: its six O*NET verbs —
  // tests/updates/backups/renewals/maintenance/performance — sit behind no
  // one free taught page verified this pass). The FCC responsive row picks
  // up the accessibility cell's taught leg (its curriculum includes the
  // accessibility projects). Learn lines drafted from the resources'
  // actual content (learn line — authored 2026-11-03, user-delegated).
  // Wave E recap (2026-11-03): the site life-operations cell re-hunted
  // (edX/Alison/GCF sweep) — every maintenance-course hit is a service
  // brochure or a senior/career-marketing snippet; no taught self-serve page
  // covers the six O*NET verbs — adjudicated Wave E.
  // Coverage: 5/6 vetted.
  {
    id: "res-webdev-fcc-rwd",
    title: "Responsive Web Design Certification",
    provider: "freeCodeCamp",
    type: "cert",
    cost: "free",
    // free ~300-h curriculum + free certificate
    // audit (2026-11-03): FCC projects curriculum; free signup → account.
    // Carries the responsive/accessibility cell (the curriculum runs the
    // accessibility projects) — the JS row holds the client-coding winner.
    url: "https://www.freecodecamp.org/learn/responsive-web-design/",
    durationHours: 60,
    skillsAddressed: [
      "Client-side coding (HTML/CSS/JS)",
      "Responsive/UI basics + accessibility",
    ],
    creditingBody: "freeCodeCamp",
    careerId: "webdev",
    form: "taught",
    access: "account",
    learnNotes: {
      "Responsive/UI basics + accessibility":
        "The responsive-design curriculum builds pages that reflow across devices and runs accessibility-minded markup and contrast work in its projects — the cross-device + accessible rendering this row prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-webdev-odin",
    title: "Foundations path — The Odin Project",
    provider: "The Odin Project",
    type: "course",
    cost: "free",
    // project-first full curriculum incl. Git
    // audit (2026-11-03): project-first open curriculum → taught/direct
    url: "https://www.theodinproject.com/paths/foundations",
    durationHours: 40,
    skillsAddressed: ["Client-side coding (HTML/CSS/JS)"],
    careerId: "webdev",
    form: "taught",
    access: "direct",
  },
  {
    id: "res-webdev-fcc-js",
    title: "JavaScript Algorithms and Data Structures Certification",
    provider: "freeCodeCamp",
    type: "cert",
    cost: "free",
    // audit (2026-11-03): FCC projects curriculum; free signup → account.
    // Client-coding winner (id A–Z over the RWD row — both credited FCC).
    url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
    durationHours: 40,
    skillsAddressed: ["Client-side coding (HTML/CSS/JS)"],
    creditingBody: "freeCodeCamp",
    careerId: "webdev",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Client-side coding (HTML/CSS/JS)":
        "You write and debug real JavaScript in the browser through the whole curriculum — functions, DOM work and the structured problem-solving a web site's front end runs on.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-webdev-wordpress-docs",
    title: "WordPress documentation",
    provider: "WordPress.org",
    type: "doc",
    cost: "free",
    // audit (2026-11-03): vendor docs hub = reference
    url: "https://wordpress.org/documentation/",
    durationHours: 4,
    skillsAddressed: ["CMS administration (WordPress etc.)"],
    careerId: "webdev",
    pick: true,
    form: "reference",
    access: "direct",
  },
  {
    id: "res-webdev-wpl-learn",
    title: "Beginner WordPress User (Learn WordPress — official)",
    provider: "WordPress.org (Learn WordPress)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 2 fill, user-ruled): the CMS
    // cell had only reference-grade docs rows. New row for the CMS's OWN
    // official course on the WordPress learning site ("Beginner WordPress
    // User", 200 verified; lessons page displays the full course; the
    // WordPress learning site teaches free) — installs/config, the admin
    // dashboard, themes, plugins, users and content management — the
    // run-the-CMS craft this row prints.
    url: "https://learn.wordpress.org/course/beginner-wordpress-user/",
    durationHours: 4,
    skillsAddressed: ["CMS administration (WordPress etc.)"],
    creditingBody: "WordPress.org",
    careerId: "webdev",
    form: "taught",
    access: "direct",
    learnNotes: {
      "CMS administration (WordPress etc.)":
        "The CMS teaches itself officially: dashboard navigation, settings, themes and plugins, users, and day-to-day content publishing — administering the WordPress stack, lesson by lesson.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-webdev-webdev-learn",
    title: "Learn (web.dev)",
    provider: "Google",
    type: "doc",
    cost: "free",
    // performance/responsive course docs behind the site life-operations verb
    // audit (2026-11-03): learn hub index = landing (fail-closed)
    url: "https://web.dev/learn/",
    durationHours: 4,
    skillsAddressed: ["↳ task-cluster sub-row: site life-operations", "Responsive/UI basics + accessibility"],
    careerId: "webdev",
    pick: true,
    form: "landing",
    access: "direct",
  },
  {
    id: "res-webdev-progit",
    title: "Pro Git, 2nd Edition (free full web text)",
    provider: "Apress / git-scm.com",
    type: "doc",
    cost: "free",
    // free text; print = purchase (labeled)
    // audit (2026-11-03): free book (taught per the content-shape ruling);
    // open access. Version-control winner.
    url: "https://git-scm.com/book/en/v2",
    durationHours: 8,
    skillsAddressed: ["Version control (git)"],
    careerId: "webdev",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Version control (git)":
        "The full Git workflow from commit to remote: branching models for teams, resolving conflicts, and reviewing history — team-safe code management.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-webdev-scrum-guide",
    title: "The Scrum Guide (official, free text)",
    provider: "Scrum.org / Schwaber & Sutherland",
    type: "doc",
    cost: "free",
    // audit (2026-11-03): official spec text = reference
    url: "https://scrumguides.org/scrum-guide.html",
    durationHours: 2,
    skillsAddressed: ["Agile Software Development (when agency-run)"],
    careerId: "webdev",
    pick: true,
    form: "reference",
    access: "direct",
  },
  {
    id: "res-webdev-agile-coursera",
    title: "Agile Software Development (course)",
    provider: "Coursera",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 2 fill, user-ruled): the agility
    // cell had only reference-grade guide claims. Per-role duplicate of the
    // swd pool's verified taught Agile course (pool convention): the sprint
    // disciplines themselves — backlog planning, ceremonies, incremental
    // delivery — the agency-sprint practice this row prints. Audit route →
    // exam-paid (₱ certificate).
    url: "https://www.coursera.org/learn/agile-software-development",
    durationHours: 8,
    skillsAddressed: ["Agile Software Development (when agency-run)"],
    creditingBody: "IBM",
    careerId: "webdev",
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Agile Software Development (when agency-run)":
        "The course teaches the sprint disciplines themselves — backlog planning, ceremonies and incremental delivery — so each ceremony this skill prints is something you've actually run.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  // == ── Digital / Multimedia Artist (2.9 · id digart) ──────────────────────
  // Wave B audit (2026-11-03, batch 2): access/form per-row. The TESDA
  // category listing grades landing (the 7 VGD modules live behind TOP
  // accounts — module pages verified to redirect to login), Canva stays
  // UNGRADED (403 bot-wall this pass, fail-closed), Figma's article index
  // grades landing. Two census-thin taught claims filled user-ruled (both
  // fetched LIVE 2026-11-03): Google's UX foundations course and its
  // wireframes/low-fi course carry the UX and UI units. Adviser-only reds
  // remain, honest, never papered over (searched the open catalog this
  // pass — Packaging, Booth/Display, the tools row and the 2D-Animator
  // counterpart have no free taught page verified; Adobe tutorials stay
  // 403 per DIG-V2). Learn lines drafted from the resources' actual
  // content (learn line — authored 2026-11-03, user-delegated).
  // Wave E recap (2026-11-03, user-delegated hunt): all four adviser-only
  // reds FILLED with verified taught rows — Coursera's packaging-design
  // course (HTTP 200, "Enroll for free", 4 modules), Alison Visual
  // Merchandising Essentials (HTTP 200, 3 h, window/display design),
  // Alison's beginner Photoshop diploma (HTTP 200, 15 h, layers/tools),
  // Alison Principles of Animation (HTTP 200, 3 h, timing/frames). The
  // TOP category landing row keeps its landing grade (module pages sit
  // behind the TOP login); Adobe tutorials stay 403 per DIG-V2.
  // Coverage: 10/10 vetted.
  {
    id: "res-digart-tesda-vgd-elearning",
    title: "Visual Graphic Design NC III e-learning (7 free modules)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // the direct free e-learning companion to the exact TR units
    // (category listing 200, module set verified 1:1); free, self-paced; TOP account
    // audit (2026-11-03): the category page is a course index; the seven
    // module pages (ids 3365–3371, verified LIVE) redirect to the TOP login
    // → landing/account (the modules themselves teach behind the TOP account)
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
    form: "landing",
    access: "account",
  },
  {
    id: "res-digart-coursera-packaging",
    title: "Packaging Design: Redesign a Product for a Brand from A to Z",
    provider: "Coursera",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave E hunt): course page HTTP 200,
    // "Enroll for free" (audit route; ₱ certificate) — 4 modules
    // (Foundations of Packaging Design, Conceptual Development and
    // Research, Digital Execution, presentation). The packaging unit had
    // only the TOP landing as claim — this row carries it taught.
    url: "https://www.coursera.org/learn/packaging-design-redesign-a-product-for-a-brand-from-a-to-z",
    durationHours: 4,
    skillsAddressed: ["DEVELOP DESIGNS FOR PRODUCT PACKAGING (ICT216317)"],
    careerId: "digart",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "DEVELOP DESIGNS FOR PRODUCT PACKAGING (ICT216317)":
        "You take a product from brand brief to finished packaging — concept development, layout and a Photoshop mock-up of the package — the packaging-design craft the ICT216317 unit prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-digart-alison-visual-me",
    title: "Visual Merchandising Essentials",
    provider: "Alison",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave E hunt): course page HTTP 200,
    // 3 printed hours, free to study (optional Alison certificate paid).
    // The booth/window-display unit (ICT216318) had only the TOP landing
    // as claim — this row carries it taught.
    url: "https://alison.com/course/visual-merchandising-essentials",
    durationHours: 3,
    skillsAddressed: ["DESIGN BOOTH AND PRODUCT WINDOW / DISPLAY (ICT216318)"],
    careerId: "digart",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "DESIGN BOOTH AND PRODUCT WINDOW / DISPLAY (ICT216318)":
        "You learn how product displays win customers — window exhibits, booth and in-store display composition planned with the merchandising design principles the unit prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-digart-alison-photoshop",
    title: "Diploma in a Beginner's Guide to Photoshop",
    provider: "Alison",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave E hunt): course page HTTP 200,
    // 15 printed hours, free to study (optional Alison certificate paid).
    // The tools row's only vettable claims were an ungraded bot-walled Canva
    // row and the reference-grade Blender manual — this row carries the
    // design-software craft taught (Adobe Photoshop is on the TR tool list).
    url: "https://alison.com/course/diploma-in-a-beginner-s-guide-to-photoshop",
    durationHours: 15,
    skillsAddressed: ["Use specialized graphic/animation tools (Adobe suite, Blender etc.)"],
    careerId: "digart",
    form: "taught",
    access: "direct",
    learnNotes: {
      "Use specialized graphic/animation tools (Adobe suite, Blender etc.)":
        "You get hands-on in Photoshop — the interface, layers, selections and editing tools a graphic artist runs designs through — the design-software knowledge the TR tool list names.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-digart-alison-anim",
    title: "Principles of Animation",
    provider: "Alison",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave E hunt): course page HTTP 200,
    // 3 printed hours, free to study (optional Alison certificate paid).
    // The Junior-2D-Animator counterpart row's only claim was the
    // reference-grade Blender manual — this row carries the animation craft
    // taught (the PSF-DAA pipeline family starts at 2D animation baselines).
    url: "https://alison.com/course/principles-of-animation",
    durationHours: 3,
    skillsAddressed: ["Junior 2D Animator — [PSF-DAA] (counterpart, optional — user ruling 2026-10-29 ADD)"],
    careerId: "digart",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Junior 2D Animator — [PSF-DAA] (counterpart, optional — user ruling 2026-10-29 ADD)":
        "You learn the animation principles 2D work is built on — timing, spacing and frame-by-frame motion applied to a moving character — the animation-line craft the counterpart role covers.",
    },
    // learn line — authored 2026-11-03, user-delegated
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
    // audit (2026-11-03): Coursera course page → audit route free, cert paid
    // → exam-paid; taught. Logo/Print/brief winner.
    url: "https://www.coursera.org/learn/fundamentals-of-graphic-design",
    durationHours: 15,
    skillsAddressed: [
      "DEVELOP DESIGNS FOR A LOGO (ICT216313)",
      "DEVELOP DESIGNS FOR PRINT MEDIA (ICT216314)",
      "Follow creative brief + brand guideline development",
    ],
    careerId: "digart",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "DEVELOP DESIGNS FOR A LOGO (ICT216313)":
        "Teaches making the design decisions a logo needs — image-making, typography and composition worked through brief-driven exercises, the visual-design principles the unit prints.",
      "DEVELOP DESIGNS FOR PRINT MEDIA (ICT216314)":
        "The same visual fundamentals applied to print-bound graphics: composition, scale and color worked in the course's design exercises — the printed-output craft behind posters/brochures.",
      "Follow creative brief + brand guideline development":
        "Every module's assignment runs brief-to-submittable-design: read the given brief constraints, iterate options, and produce the finished design for review — the brief-discipline loop the TR units print.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-digart-canva-design-school",
    title: "Canva Design School (free courses)",
    provider: "Canva",
    type: "course",
    cost: "free",
    // beginner-friendly design-tool courses; free tier suffices
    // audit (2026-11-03): canva.com/designschool 403 to this environment —
    // NOT GRADED (fail-closed; same bot-wall class as the OpenLearn verdict
    // but not yet adopted for this domain)
    url: "https://www.canva.com/designschool/",
    durationHours: 4,
    skillsAddressed: ["Use specialized graphic/animation tools (Adobe suite, Blender etc.)"],
    careerId: "digart",
    pick: true,
  },
  {
    id: "res-digart-google-ux",
    title: "Foundations of User Experience (UX) Design (Google)",
    provider: "Google (Coursera)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 2 fill, user-ruled): the UX unit
    // had only index/landing-grade claims. New row for Google's taught UX
    // foundations course ("Enroll for free", cert course 1 — UX basics,
    // user-centered design thinking end to end) — the
    // develop-designs-for-user-experience unit, taught. ₱ paid tier:
    // shareable certificate.
    url: "https://www.coursera.org/learn/foundations-user-experience-design",
    durationHours: 15,
    skillsAddressed: ["DEVELOP DESIGNS FOR USER EXPERIENCE (ICT216315)"],
    creditingBody: "Google",
    careerId: "digart",
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "DEVELOP DESIGNS FOR USER EXPERIENCE (ICT216315)":
        "Teaches UX end to end in course 1 of Google's certificate: what a UX designer produces, user-centered design thinking, and the problem-space exploration the unit's design work builds on.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-digart-google-wireframes",
    title: "Build Wireframes and Low-Fidelity Prototypes (Google)",
    provider: "Google (Coursera)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 2 fill, user-ruled): the UI unit
    // had only index/landing-grade claims. New row for cert course 3
    // ("Enroll for free", verified) — storyboards, wireframes and paper/digital
    // low-fidelity prototypes for a mobile app: screen layout and flows, the
    // interface-design building work the unit prints. ₱ paid tier.
    url: "https://www.coursera.org/learn/wireframes-low-fidelity-prototypes",
    durationHours: 15,
    skillsAddressed: ["DEVELOP DESIGNS FOR USER INTERFACE (ICT216316)"],
    creditingBody: "Google",
    careerId: "digart",
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "DEVELOP DESIGNS FOR USER INTERFACE (ICT216316)":
        "You draw screen layouts and interface flows hands-on — storyboards, wireframes and low-fidelity prototypes for a product's screens — the interface-design development the unit prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-digart-openlearn-comms",
    title: "Effective communication in the workplace",
    provider: "Open University (OpenLearn)",
    type: "course",
    cost: "free",
    // adopted 403 verdict line (keep-with-flag); client-facing behaviors
    // audit (2026-11-03, mockup draft): course page open in browser →
    // taught/direct (curl 403 — the keep-with-flag line)
    url: "https://www.open.edu/openlearn/money-business/effective-communication-the-workplace",
    durationHours: 3,
    skillsAddressed: ["Client communication & revision handling"],
    careerId: "digart",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Client communication & revision handling":
        "Workplace communication practice — presenting work, taking feedback and negotiating changes with colleagues/clients, the liaise-and-revise loop the client behaviors row prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  // DIG-V2: Adobe official tutorials 403 — flagged, NOT cited here.

  // == ── SOC Analyst (E4 · id soc) — soc.md §Resources ──────────────────────
  // Wave B audit (2026-11-03, batch 2): access/form per-row (root/catalog
  // rows grade landing fail-closed; NIST/OTX/MITRE grade reference). The
  // SOC-operations cells had reference-grade claims only — they now ride
  // the verified Cisco SOC course (fetched LIVE 2026-11-03: "Enroll for
  // free", SIEM integration + incident-response workflows + threat-hunting
  // for associate analysts) as a taught row; LetsDefend stays in data
  // graded landing (no taught deep-link verified this pass). Learn lines
  // drafted from the resources' actual content (learn draft — user review
  // pending). Coverage: 7/7 vetted.
  {
    id: "res-soc-letsdefend",
    title: "LetsDefend — SOC analyst training simulator (free plan)",
    provider: "LetsDefend",
    type: "course",
    cost: "free",
    // free plan placement printed on the landing page; trains the printed
    // queue workflow; limits/pricing terms stated at signup (SOC-V6)
    // audit (2026-11-03): letsdefend.io root verified LIVE; no taught
    // deep-link found at roadmap/simulator/training slugs (404) →
    // landing/account
    url: "https://letsdefend.io/",
    durationHours: 6,
    skillsAddressed: ["Monitor cyber security systems", "Manage response to cyber security incidents"],
    careerId: "soc",
    pick: true,
    form: "landing",
    access: "account",
  },
  {
    id: "res-soc-cisco-soc",
    title: "Security Operations Center (SOC) (Cisco)",
    provider: "Cisco (Coursera)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 2 fill, user-ruled): the SOC
    // operations cells had only reference-grade MITRE/NIST/OTX/Splunk
    // claims. New row for Cisco's taught SOC course ("Enroll for free",
    // associate-level analyst training): SOC team roles and core functions,
    // SIEM integration, event monitoring, incident-response workflows, and
    // threat-hunting techniques plus workflow-management/automation for
    // high alert volume. ₱ paid tier: certificate (audit/financial-aid free).
    url: "https://www.coursera.org/learn/security-operations-center-soc",
    durationHours: 10,
    skillsAddressed: [
      "Monitor cyber security systems",
      "Maintain cyber security operations",
      "Manage response to cyber security incidents",
      "Threat Analysis and Defence · Threat Intelligence and Detection (family FSC cross-cite)",
    ],
    creditingBody: "Cisco",
    careerId: "soc",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Monitor cyber security systems":
        "Teaches the monitoring shift end to end — SIEM feeds, centralized event monitoring, and the workflow discipline for working a high-volume alert queue.",
      "Maintain cyber security operations":
        "You learn how a SOC runs day to day: team roles, runbook-driven workflow management, and the automation that keeps operations steady across shifts.",
      "Manage response to cyber security incidents":
        "Incident-response workflows taught for the associate analyst — contain, coordinate, escalate, and feed the post-incident review.",
      "Threat Analysis and Defence · Threat Intelligence and Detection (family FSC cross-cite)":
        "The threat-hunting module connects indicator intelligence to detection — hunting for adversary behavior and turning findings into defence adjustments.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-soc-fortinet",
    title: "Fortinet Training Institute — free self-paced catalog",
    provider: "Fortinet",
    type: "cert",
    cost: "free",
    // free NSE-family security-operations courseware; certificate terms
    // re-check rides sibling CYB-V5
    // audit (2026-11-03): catalog hub = landing/direct
    url: "https://www.fortinet.com/training-certification",
    durationHours: 6,
    skillsAddressed: [],
    careerId: "soc",
    form: "landing",
    access: "direct",
  },
  {
    id: "res-soc-tryhackme",
    title: "TryHackMe — free learning tier",
    provider: "TryHackMe",
    type: "course",
    cost: "free",
    // hands-on scanning/triage practice; flag the paid tier boundary on copy
    // audit (2026-11-03): root = landing; rooms behind the free signup → landing/account
    url: "https://tryhackme.com/",
    durationHours: 4,
    skillsAddressed: ["Vulnerability scanning (VAPT-adjacent, TESDA-printed)"],
    careerId: "soc",
    pick: true,
    form: "landing",
    access: "account",
  },
  {
    id: "res-soc-netacad-ethical-hacker",
    title: "Ethical Hacker",
    provider: "Cisco Networking Academy",
    type: "course",
    cost: "free",
    // scan-and-report curriculum; seat availability at signup
    // audit (2026-11-03): course page verified LIVE ("Ethical Hacker");
    // free signup → account. Vulnerability-scanning winner.
    url: "https://www.netacad.com/courses/ethical-hacker",
    durationHours: 70,
    skillsAddressed: ["Vulnerability scanning (VAPT-adjacent, TESDA-printed)"],
    creditingBody: "Cisco Networking Academy",
    careerId: "soc",
    form: "taught",
    access: "account",
    learnNotes: {
      "Vulnerability scanning (VAPT-adjacent, TESDA-printed)":
        "The scan-and-report curriculum: reconnaissance and scanning drills against test targets, vulnerability identification, and writing findings with the safety rules observed.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-soc-netacad-networking-basics",
    title: "Networking Basics",
    provider: "Cisco Networking Academy",
    type: "course",
    cost: "free",
    // the "LAN, WAN, port forwarding" knowledge the TESDA unit prints
    // audit (2026-11-03): course page verified LIVE; free signup → account
    url: "https://www.netacad.com/courses/networking-basics",
    durationHours: 22,
    skillsAddressed: ["Network security understanding (network administration family)"],
    creditingBody: "Cisco Networking Academy",
    careerId: "soc",
    pick: true,
    form: "taught",
    access: "account",
  },
  {
    id: "res-soc-netacad-network-defense",
    title: "Network Defense",
    provider: "Cisco Networking Academy",
    type: "course",
    cost: "free",
    // defensive-tooling course behind the firewall/EDR alert-source range
    // audit (2026-11-03): course page verified LIVE; free signup → account.
    // Network-security coverage winner (id A–Z over the Basics row — the
    // Basics row keeps the fallback flag, fewer hours).
    url: "https://www.netacad.com/courses/network-defense",
    durationHours: 24,
    skillsAddressed: ["Network security understanding (network administration family)"],
    creditingBody: "Cisco Networking Academy",
    careerId: "soc",
    form: "taught",
    access: "account",
    learnNotes: {
      "Network security understanding (network administration family)":
        "Teaches the defence side of the network: access controls, firewall rules, monitoring and the hardening choices that keep a LAN protected — the understanding the SOC expects you to carry.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-soc-google-cybersecurity",
    title: "Google Cybersecurity Professional Certificate",
    provider: "Google (Coursera)",
    type: "cert",
    cost: "free",
    // 200 via CLI 2026-10-29; audit→Preview drift re-check at enrollment
    // audit (2026-11-03): prof-cert landing (ADDR-catalog-only)
    url: "https://www.coursera.org/professional-certificates/google-cybersecurity",
    durationHours: 60,
    skillsAddressed: [],
    careerId: "soc",
    form: "landing",
    access: "exam-paid",
  },
  {
    id: "res-soc-openlearn-comms",
    title: "Effective communication in the workplace",
    provider: "Open University (OpenLearn)",
    type: "course",
    cost: "free",
    // adopted 403 verdict line (keep-with-flag)
    // audit (2026-11-03, mockup draft): course page open in browser →
    // taught/direct (curl 403 — the keep-with-flag line)
    url: "https://www.open.edu/openlearn/money-business/effective-communication-the-workplace",
    durationHours: 3,
    skillsAddressed: ["Collaboration · Communication · Problem Solving · Digital Fluency (Enabling)"],
    careerId: "soc",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Collaboration · Communication · Problem Solving · Digital Fluency (Enabling)":
        "Workplace communication practice — briefing the handover, explaining technical state plainly — the bundle's communication/problem-solving behaviors.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },

  // == ── Data Analyst, junior (E1 · id da) — COMPLETE pool, one row per skill
  // (unchanged from catalog round 12 — every URL fetched LIVE 2026-10-29)
  // Wave B audit (2026-11-03): access/form copied verbatim from the D2 mockup
  // access draft (user-ruled 2026-11-03). FIVE rows whose URL was not
  // teachable at the URL itself (prof-cert landing · TAU paths index · NPC
  // reference pages · search listing) were RE-POINTED to the live-verified
  // taught course page of the same skill (fresh "fetched LIVE 2026-11-03"
  // note in-row; ids/ADDR/pool-size all unchanged) — the pool stays one row
  // per skill. Learn lines: mockup drafts verbatim + new drafts (learn line
  // — authored 2026-11-03, user-delegated). Every da skill now resolves to a vetted
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
  },

  // == ── Track 2 · Business & Management (hra · training · mkt · sales · csr ·
  // opsanalyst · purch · ccqa · events) — blessed role-spec pools ───────────
  // == ── hra (3.1) ──
  // Wave B audit (2026-11-03, batch 2): access/form per-row (Alison →
  // account; Coursera audit → exam-paid; HubSpot Academy → account; TOP
  // Moodle modules → account; CIPD/statute/support-hubs → reference or
  // landing). Three census-thin taught claims filled user-ruled (all
  // fetched LIVE 2026-11-03): Performance Management via the verified
  // Starweaver course, HR Analytics via the verified Wharton
  // People-Analytics course, Stakeholder Engagement via the verified
  // STARWEAVER stakeholder course (per-role duplicates), plus the
  // Employee-Communication attach on the TOP writing module. Adviser-only
  // reds remain, honest, never papered over: Talent-Capability-Assessment
  // and DE&IB (declared gaps stand), Employee Mobility / HR-Practices
  // Implementation / Skills-Framework Adoption (no taught claim verified —
  // adviser ruling pending). Learn lines drafted from the resources'
  // actual content (learn line — authored 2026-11-03, user-delegated).
  // Wave E recap (2026-11-03, user-delegated hunt): the DEIB cell fills with
  // Coursera's Fundamentals of DEI&B (HTTP 200, printed 4 h), the Talent
  // Capability Assessment cell fills with Coursera's SAGE Talent Management
  // (HTTP 200, 14 modules incl. Talent Assessment Tools), and the
  // HR-Practices-Implementation no-claim fills with Minnesota's
  // Recruiting-Hiring-Onboarding course (HTTP 200, 20 h). The Employee
  // Mobility adjudication is LIFTED the same pass — EDUCBA's Employee
  // Movement course (HTTP 200) teaches the promotions/transfers/redeployment
  // records craft (hra duplicate below). Skills Framework Adoption
  // (promoting + logging framework adoption) re-hunted: no taught
  // self-serve page exists — adjudicated Wave E.
  // Coverage: 19/20 vetted.
  {
    id: "res-hra-alison-diploma-hr",
    title: "Diploma in Human Resources (HR)",
    provider: "Alison",
    type: "course",
    cost: "free",
    // covers recruit, select, records (Official Alison page verified 200);
    // study free, certificate purchase optional
    // audit (2026-11-03): Alison study-free course page → account. The HR
    // fundamentals winner for the recruit/select/onboard/records/exit cells.
    url: "https://alison.com/course/diploma-in-human-resources-hr",
    durationHours: 6,
    skillsAddressed: [
      "Recruitment Channel Management", "Selection Management", "Onboarding",
      "Job Analysis and Evaluation", "Voluntary Exit Management", "Involuntary Exit Management",
      "Human Resources Systems Management",
    ],
    creditingBody: "Alison",
    careerId: "hra",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Recruitment Channel Management":
        "The diploma's recruiting modules run the hire funnel — job analysis feeds the posting, sourcing through the right channels, then screening — the recruitment craft this cell prints.",
      "Selection Management":
        "Structured screening and interview practice: comparing candidates against the job's requirements, the selection checklist the cell prints.",
      "Onboarding":
        "The employee-records modules include the new-hire induction pieces — setting up the record, orienting the employee, documenting the start.",
      "Job Analysis and Evaluation":
        "Covers analyzing and evaluating jobs — duties, requirements and worth — the job-analysis groundwork this cell prints.",
      "Voluntary Exit Management":
        "Resignations and the documented exit: notice handling, clearance, records close-out — the voluntary-exit flow the cell prints.",
      "Involuntary Exit Management":
        "Terminations handled by procedure: the warning/discipline trail and the documented separation an employer can defend.",
      "Human Resources Systems Management":
        "Maintaining employee records and the HR information the department runs on — the systems-management habit this cell prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-hra-minnesota-hrm",
    title: "Human Resource Management: HR for People Managers Specialization",
    provider: "Coursera (University of Minnesota)",
    type: "course",
    cost: "free",
    // audit free; certificate paid (financial aid exists; audit-vs-preview re-checked at enroll)
    // audit (2026-11-03): specialization page = program landing (courses
    // live behind it) → landing/exam-paid. The Performance Management cell
    // rides the verified Starweaver course below instead.
    url: "https://www.coursera.org/specializations/human-resource-management",
    durationHours: 15,
    skillsAddressed: [
      "Recruitment Channel Management", "Selection Management", "Performance Management",
      "Human Resources Systems Management",
      "Communication · Adaptability · Customer Orientation · Digital Fluency · Learning Agility · Self-Management (Enabling, Basic)",
    ],
    careerId: "hra",
    form: "landing",
    access: "exam-paid",
  },
  {
    id: "res-hra-starweaver-perf",
    title: "Managing Employee Performance (STARWEAVER)",
    provider: "Coursera (STARWEAVER)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 2 fill, user-ruled): the
    // Performance cell had only the landing-grade specialization. Per-role
    // duplicate of the verified STARWEAVER course ("Enroll for free",
    // 4.7★ 2.8K reviews — Performance Management, performance appraisal,
    // constructive feedback, goal setting): the run-the-review-cycle craft
    // the cell prints. ₱ paid tier: certificate.
    url: "https://www.coursera.org/learn/managing-employee-performance",
    durationHours: 5,
    skillsAddressed: ["Performance Management"],
    creditingBody: "STARWEAVER",
    careerId: "hra",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Performance Management":
        "Teaches the review cycle hands-on: goal setting, the appraisal conversation, and constructive feedback that changes behavior — managing employee performance in the room.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-hra-wharton-people-analytics",
    title: "People Analytics (Wharton)",
    provider: "Coursera (Wharton)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 2 fill, user-ruled): the HR
    // analytics cell had no URL row. Per-role duplicate of the verified
    // Wharton course ("Enroll for free" ×3; "People analytics is a
    // data-driven approach to managing people at work", 4 modules): the
    // measure-and-manage-by-data craft this cell prints. ₱ paid tier.
    url: "https://www.coursera.org/learn/wharton-people-analytics",
    durationHours: 12,
    skillsAddressed: ["Human Resources Analytics and Insights"],
    creditingBody: "Wharton",
    careerId: "hra",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Human Resources Analytics and Insights":
        "Wharton's people-analytics course teaches managing people by data — staffing, evaluation and performance read through data, and what analytics legitimately can and cannot claim about people.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-hra-stakeholder",
    title: "Stakeholder Management (STARWEAVER)",
    provider: "Coursera (STARWEAVER)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 2 fill, user-ruled): the
    // stakeholder cell had only reference-grade factsheets. Per-role
    // duplicate of the verified STARWEAVER course (pool convention; also in
    // the da pool): identify stakeholders, map needs/expectations, plan the
    // engagement cadence. ₱ paid tier.
    url: "https://www.coursera.org/learn/stakeholder-management",
    durationHours: 5,
    skillsAddressed: ["Stakeholder Engagement and Management"],
    creditingBody: "STARWEAVER",
    careerId: "hra",
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Stakeholder Engagement and Management":
        "Four lessons: identify who needs to know, map expectations, plan the collaboration and reporting cadence — the engagement loop this cell prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-hra-cipd-factsheets",
    title: "CIPD Factsheets (free professional-factsheet library)",
    provider: "CIPD (UK HR professional body)",
    type: "doc",
    cost: "free",
    // free evidence-based factsheets: recruitment, assessment, turnover
    // audit (2026-11-03): factsheet library = readable reference
    url: "https://www.cipd.org/uk/knowledge/factsheets/",
    durationHours: 2,
    skillsAddressed: ["Selection Management", "Talent Capability Assessment", "Data Collection and Preparation", "Stakeholder Engagement and Management"],
    careerId: "hra",
    pick: true,
    form: "reference",
    access: "direct",
  },
  {
    id: "res-hra-gcf-excel",
    title: "Excel (Foundations) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    // completely free, browser-based, no account
    // audit (2026-11-03): GCF's lesson series with hands-on practice →
    // taught/direct. Data Management + Data Collection winner.
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: ["Data Management", "Data Collection and Preparation"],
    careerId: "hra",
    form: "taught",
    access: "direct",
    learnNotes: {
      "Data Management":
        "Workbooks, rows and formulas taught hands-on — the spreadsheet hygiene an HR assistant's records ride on.",
      "Data Collection and Preparation":
        "The series shows collecting entries into a structured sheet: tables, sorting and cleanup before anyone reports on the data.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-hra-ra10173",
    title: "Republic Act No. 10173 (Data Privacy Act of 2012)",
    provider: "Lawphil Project",
    type: "doc",
    cost: "free",
    // statute text (200); privacy.gov.ph 403 this session — lawphil carries
    // the working legal anchor (standing re-check)
    // audit (2026-11-03): statute text = reference
    url: "https://lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html",
    durationHours: 2,
    skillsAddressed: ["Data Management", "Diversity, Equity, Inclusion and Belonging Management", "Voluntary Exit Management", "Involuntary Exit Management"],
    careerId: "hra",
    pick: true,
    form: "reference",
    access: "direct",
  },
  {
    id: "res-hra-hubspot-inbound",
    title: "Inbound Certification Course (HubSpot Academy)",
    provider: "HubSpot Academy",
    type: "cert",
    cost: "free",
    // fully free incl. certificate; page verified w/ course title + search mirror
    // audit (2026-11-03): HubSpot Academy course (free signup → account);
    // taught. Digital-Marketing-and-Communication winner.
    url: "https://academy.hubspot.com/courses/inbound",
    durationHours: 4,
    skillsAddressed: ["Recruitment Channel Management", "Digital Marketing and Communication"],
    creditingBody: "HubSpot Academy",
    careerId: "hra",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Digital Marketing and Communication":
        "The inbound framework taught as craft: how content attracts the right people, the buyer's journey, and the messaging spins that carry it — employer-brand marketing for HR teams.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-hra-public-speaking",
    title: "Introduction to Public Speaking",
    provider: "Coursera (University of Washington)",
    type: "course",
    cost: "free",
    // audit free; certificate paid
    // audit (2026-11-03): audit route → exam-paid
    url: "https://www.coursera.org/learn/public-speaking",
    durationHours: 12,
    skillsAddressed: ["Communication · Adaptability · Customer Orientation · Digital Fluency · Learning Agility · Self-Management (Enabling, Basic)"],
    careerId: "hra",
    form: "taught",
    access: "exam-paid",
  },
  {
    id: "res-hra-top-professionalism",
    title: "TOP — Professionalism (Job Ready Courses)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // HTTP 200 but login-walled; title verified via TOP search/category pages;
    // open inside a TOP account before citing course content (standing flag)
    // audit (2026-11-03): TOP Moodle module → account (login-walled verified
    // LIVE this pass; module pages redirect to the TOP login). ESC winner.
    url: "https://e-tesda.gov.ph/course/view.php?id=5042",
    durationHours: 2,
    skillsAddressed: ["Communication · Adaptability · Customer Orientation · Digital Fluency · Learning Agility · Self-Management (Enabling, Basic)"],
    creditingBody: "TESDA",
    careerId: "hra",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Communication · Adaptability · Customer Orientation · Digital Fluency · Learning Agility · Self-Management (Enabling, Basic)":
        "The Job-Ready professionalism module drills the workplace basics the bundle names — presenting well, adapting to the office's norms, managing one's own work.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-hra-top-writing",
    title: "TOP — Impactful Writing Skills (Job Ready Courses)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free); verified via TOP search page
    // audit (2026-11-03): TOP Moodle module → account. Carries the
    // Employee-Communication attach + ESC (the professionalism row is the
    // ESC winner).
    url: "https://e-tesda.gov.ph/course/view.php?id=5037",
    durationHours: 2,
    skillsAddressed: [
      "Communication · Adaptability · Customer Orientation · Digital Fluency · Learning Agility · Self-Management (Enabling, Basic)",
      "Employee Communication Management",
    ],
    creditingBody: "TESDA",
    careerId: "hra",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Employee Communication Management":
        "The writing module drills the workplace-communication pieces — memos, announcements and reports written for internal audiences — the employee-communication flow this cell prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-hra-coursera-deib",
    title: "Fundamentals of Diversity, Equity, Inclusion, and Belonging",
    provider: "Coursera",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave E hunt): course page HTTP 200,
    // "Enroll for free" ×3 (audit route; ₱ certificate), printed 4 hours
    // to complete, 3 modules. The DEIB cell's only claims were a statute
    // reference row and the declared gap — this row carries the craft taught.
    url: "https://www.coursera.org/learn/fundamentals-of-diversity-equity-inclusion-and-belonging",
    durationHours: 4,
    skillsAddressed: ["Diversity, Equity, Inclusion and Belonging Management"],
    careerId: "hra",
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Diversity, Equity, Inclusion and Belonging Management":
        "Teaches the tools of DEIB work — advocating and embedding diversity, equity, inclusion and belonging initiatives across a workplace — the management practice this cell prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-hra-educba-movement",
    title: "Employee Movement in HR Management",
    provider: "Coursera (EDUCBA)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave E hunt, hra addendum): the
    // Employee-Mobility cell's adjudication is LIFTED the same pass —
    // EDUCBA's course teaches the internal moves the row prints. HTTP 200,
    // "Enroll for free"; promotions, transfers and separation processes.
    url: "https://www.coursera.org/learn/employee-movement-hr-management",
    durationHours: 6,
    skillsAddressed: ["Employee Mobility Management"],
    creditingBody: "EDUCBA",
    careerId: "hra",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Employee Mobility Management":
        "Teaches administering internal movement — promotions, transfers and redeployment worked through their processes and records — the internal-move craft this cell prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-hra-coursera-talent-mgmt",
    title: "Talent Management",
    provider: "Coursera",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave E hunt): course page HTTP 200,
    // "Enroll for free" (audit route; ₱ certificate), 14 modules including
    // Talent Assessment Tools and Talent Assessment Fundamentals. The
    // capability-assessment cell's only claims were a reference factsheet
    // row and the declared gap — this row carries the assessment craft taught.
    url: "https://www.coursera.org/learn/sage-talent-management",
    durationHours: 10,
    skillsAddressed: ["Talent Capability Assessment"],
    careerId: "hra",
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Talent Capability Assessment":
        "Dedicated modules teach talent-assessment fundamentals and the assessment tools an HR practice runs — judging people's capabilities and measuring who fits which role.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-hra-minnesota-recruit",
    title: "Recruiting, Hiring, and Onboarding Employees",
    provider: "Coursera (University of Minnesota)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave E hunt): course page HTTP 200,
    // "Enroll for free" ×3 (audit route; ₱ certificate), printed
    // "2 weeks to complete at 10 hours a week". The HR-Practices cell was a
    // no-claim red — this row carries the implement-HR-practice craft taught
    // (offer letters/contracts built within hiring regulations is the CWF
    // anchor this row paraphrases).
    url: "https://www.coursera.org/learn/recruiting-hiring-onboarding-employees",
    durationHours: 20,
    skillsAddressed: ["Human Resources Practices Implementation"],
    careerId: "hra",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Human Resources Practices Implementation":
        "You build the people practices themselves — recruitment through onboarding run inside hiring rules, with offer letters and contracts drafted from standard templates — implementing HR policy in every actionable step.",
    },
    // learn line — authored 2026-11-03, user-delegated
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
  // Wave B audit (2026-11-03, batch 2): access/form per-row. Census-thin
  // fills (all fetched LIVE 2026-11-03, user-ruled): the verified HRCI
  // "Learning and Development" course carries Learning Needs Analysis +
  // L&D-Programs Management; the verified STARWEAVER performance and
  // stakeholder courses arrive as per-role duplicates. The GCF Excel row
  // picks up the data-collection attach. Adviser-only reds remain, honest:
  // Onboarding / Voluntary+Involuntary Exit / Skills-Framework Adoption /
  // HR-Practices Implementation (no taught claim verified), HR Analytics
  // (declared gap stands), and HR Systems Management (Moodle Academy 403 —
  // ungraded, fail-closed). Coverage: 8/15 vetted.
  // Wave E recap (2026-11-03, user-delegated hunt): Onboarding + both Exit
  // cells fill via Minnesota's taught onboarding course (per-role duplicate;
  // the CWF anchor for all three rows is the same "assist in the
  // implementation of onboarding and offboarding" bullet) and EDUCBA's
  // Employee Movement course (separations: layoffs/dismissal/retrenchment/
  // VRS — fetched LIVE, HTTP 200); HR-Practices fills with the Minnesota
  // recruiting course (per-role duplicate); HR Systems fills with the
  // Coursera LMS-administration course (HTTP 200, 8 printed hours —
  // enrollments, catalogs, reports keep the Moodle Academy row honest while
  // it sits ungraded); HR Analytics fills with the Wharton people-analytics
  // per-role duplicate. Skills-Framework Adoption re-hunted: no taught
  // self-serve page exists — adjudicated Wave E.
  // Coverage: 14/15 vetted.
  {
    id: "res-training-minnesota-hrm",
    title: "Human Resource Management: HR for People Managers Specialization",
    provider: "Coursera (University of Minnesota)",
    type: "course",
    cost: "free",
    // audit free; certificate paid
    // audit (2026-11-03): specialization page = program landing →
    // landing/exam-paid (fail-closed; courses live behind it)
    url: "https://www.coursera.org/specializations/human-resource-management",
    durationHours: 15,
    skillsAddressed: ["Learning Needs Analysis", "Learning and Development Programs Management", "Human Resources Practices Implementation"],
    careerId: "training",
    pick: true,
    form: "landing",
    access: "exam-paid",
  },
  {
    id: "res-training-hrci-lnd",
    title: "Learning and Development (HRCI)",
    provider: "Coursera (HRCI)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 2 fill, user-ruled): the
    // learning-cells had only landing/reference claims. New row for HRCI's
    // taught L&D course ("Enroll for free", Beginner, 4.8★ 881 reviews —
    // training programs, employee training, needs assessment, program
    // evaluation): analysis-to-program craft this family prints. ₱ paid
    // tier: certificate.
    url: "https://www.coursera.org/learn/learning-and-development",
    durationHours: 8,
    skillsAddressed: ["Learning Needs Analysis", "Learning and Development Programs Management"],
    creditingBody: "HRCI",
    careerId: "training",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Learning Needs Analysis":
        "Teaches needs assessment directly — surfacing what the organization's people actually need to learn before any program is built — the analysis step this cell prints.",
      "Learning and Development Programs Management":
        "Runs the L&D program layer: building and running training programs, evaluating them, and closing the loop with employee training that sticks.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-training-starweaver-perf",
    title: "Managing Employee Performance (STARWEAVER)",
    provider: "Coursera (STARWEAVER)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 2 fill, user-ruled): the
    // performance cell had no URL row. Per-role duplicate of the verified
    // STARWEAVER course (pool convention; also carries the hra cell).
    // ₱ paid tier: certificate.
    url: "https://www.coursera.org/learn/managing-employee-performance",
    durationHours: 5,
    skillsAddressed: ["Performance Management"],
    creditingBody: "STARWEAVER",
    careerId: "training",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Performance Management":
        "Goal setting, the appraisal conversation and constructive feedback — the cycle a training coordinator supports, taught hands-on.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-training-stakeholder",
    title: "Stakeholder Management (STARWEAVER)",
    provider: "Coursera (STARWEAVER)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 2 fill, user-ruled): the
    // stakeholder cell was a declared gap (venue/vendor practice). Per-role
    // duplicate of the verified STARWEAVER course — the
    // identify-map-engage loop, the stakeholder craft that survives the
    // venue/vendor coordination work. ₱ paid tier: certificate.
    url: "https://www.coursera.org/learn/stakeholder-management",
    durationHours: 5,
    skillsAddressed: ["Stakeholder Engagement and Management"],
    creditingBody: "STARWEAVER",
    careerId: "training",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Stakeholder Engagement and Management":
        "Identify the actors who must be kept in the loop, map their expectations, and plan the engagement cadence — the coordination shape the venue/vendor work runs inside.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-training-lhtl",
    title: "Learning How to Learn",
    provider: "Coursera (McMaster & University of Ottawa)",
    type: "course",
    cost: "free",
    // audit (2026-11-03): audit route → exam-paid
    url: "https://www.coursera.org/learn/learning-how-to-learn",
    durationHours: 4,
    skillsAddressed: ["Communication · Customer Orientation · Learning Agility · Self-Management · Problem Solving (Enabling, Basic)"],
    careerId: "training",
    form: "taught",
    access: "exam-paid",
  },
  {
    id: "res-training-gcf-excel",
    title: "Excel (Foundations) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    // completely free, browser-based, no account
    // audit (2026-11-03): GCF lesson series with hands-on practice →
    // taught/direct. Carries the data-collection attach.
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: ["Data Management", "Data Collection and Preparation"],
    careerId: "training",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Data Management":
        "Workbooks and formulas taught hands-on — the tracker hygiene training records and budgets ride on.",
      "Data Collection and Preparation":
        "Collecting entries into structured, sortable sheets — the gathering-and-cleanup step before any training report.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-training-moodle-academy",
    title: "Moodle Academy (official LMS courses)",
    provider: "Moodle (community-run)",
    type: "course",
    cost: "free",
    // 200; the Moodle docs site was 403 this session — Academy used (flagged, not silent)
    // Wave B (2026-11-03): moodle.academy 403 to this environment this
    // pass — UNGRADED (fail-closed); the learn.microsoft hub grades landing.
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
    // audit (2026-11-03): training catalog root = landing
    url: "https://learn.microsoft.com/en-us/training/",
    durationHours: 4,
    skillsAddressed: [],
    careerId: "training",
    form: "landing",
    access: "direct",
  },
  {
    id: "res-training-top-writing",
    title: "TOP — Impactful Writing Skills (Job Ready Courses)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free); verified via TOP search page
    // audit (2026-11-03): TOP Moodle module → account (login-walled verified
    // LIVE this pass). Employee Communication winner.
    url: "https://e-tesda.gov.ph/course/view.php?id=5037",
    durationHours: 2,
    skillsAddressed: ["Employee Communication", "Communication · Customer Orientation · Learning Agility · Self-Management · Problem Solving (Enabling, Basic)"],
    creditingBody: "TESDA",
    careerId: "training",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Employee Communication":
        "The writing module drills memos, announcements and reports written for internal audiences — the employee-communication flow this cell prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-training-top-professionalism",
    title: "TOP — Professionalism (Job Ready Courses)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free)
    // audit (2026-11-03): TOP Moodle module → account. ESC winner (id A–Z
    // over the writing row — both credited TESDA).
    url: "https://e-tesda.gov.ph/course/view.php?id=5042",
    durationHours: 2,
    skillsAddressed: ["Communication · Customer Orientation · Learning Agility · Self-Management · Problem Solving (Enabling, Basic)"],
    creditingBody: "TESDA",
    careerId: "training",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Communication · Customer Orientation · Learning Agility · Self-Management · Problem Solving (Enabling, Basic)":
        "The Job-Ready professionalism module drills the workplace basics the bundle names — presenting well, adapting to norms, managing one's own work.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-training-top-bizops",
    title: "TOP — Managing Business Operation (iSTAR Program)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free); the venue/vendor-contracting zone
    // stays declared-thin — this is the adjacent backing
    // audit (2026-11-03): TOP Moodle module → account (ADDR-catalog-only)
    url: "https://e-tesda.gov.ph/course/view.php?id=4810",
    durationHours: 3,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "training",
    form: "taught",
    access: "account",
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
  {
    id: "res-training-minnesota-recruit",
    title: "Recruiting, Hiring, and Onboarding Employees",
    provider: "Coursera (University of Minnesota)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave E hunt): per-role duplicate of the
    // hra pool's verified course (pool convention). The onboarding cell AND
    // the exit cells share one CWF anchor — "Assist in the implementation of
    // onboarding and offboarding" — and Minnesota's course teaches running
    // the onboarding implementation the anchor prints.
    url: "https://www.coursera.org/learn/recruiting-hiring-onboarding-employees",
    durationHours: 20,
    skillsAddressed: [
      "Onboarding",
      "Human Resources Practices Implementation",
    ],
    creditingBody: "University of Minnesota",
    careerId: "training",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Onboarding":
        "The course teaches the onboarding implementation end to end — pre-boarding, the first days, and the onboarding steps that integrate a new hire — the assist-and-implement work this cell prints.",
      "Human Resources Practices Implementation":
        "Recruitment through onboarding taught inside hiring rules — offer letters and standardized templates — applying the people practices correctly as the anchor prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-training-educba-movement",
    title: "Employee Movement in HR Management",
    provider: "Coursera (EDUCBA)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave E hunt): course page HTTP 200,
    // "Enroll for free" — promotions, transfers, and separation processes
    // taught (separation methods incl. layoffs, dismissal, retrenchment and
    // VRS). Carries both exit cells: the CWF anchor for both is the same
    // "assist in the implementation of onboarding and offboarding" bullet,
    // and the separations leg is taught here.
    url: "https://www.coursera.org/learn/employee-movement-hr-management",
    durationHours: 6,
    skillsAddressed: [
      "Voluntary Exit Management",
      "Involuntary Exit Management",
    ],
    creditingBody: "EDUCBA",
    careerId: "training",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Voluntary Exit Management":
        "Teaches how exits run as process — resignation and voluntary-separation modes handled with the paperwork and compliance an offboarding support role assists around.",
      "Involuntary Exit Management":
        "The employer-initiated separation methods — layoffs, dismissal, retrenchment — taught as processes an HR support role assists in implementing.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-training-lms-training",
    title: "Learning Management System Training",
    provider: "Coursera",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave E hunt): course page HTTP 200,
    // "Enroll for free", printed 8 hours — LMS administration taught via
    // a real LMS: system setup, course creation, managing courses and
    // enrollments, and building reports/dashboards. The HR-Systems cell
    // (LMS administration per the CWF anchor) had only Moodle Academy's
    // bot-walled page as vettable claim.
    url: "https://www.coursera.org/learn/learning-management-system-training",
    durationHours: 8,
    skillsAddressed: ["Human Resources Systems Management"],
    careerId: "training",
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Human Resources Systems Management":
        "You administer an LMS hands-on — setting up the system, managing courses and enrollments, and building the participation reports the CWF's maintain-the-LMS bullet prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-training-wharton-people-analytics",
    title: "People Analytics (Wharton)",
    provider: "Coursera (Wharton)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave E hunt): per-role duplicate of the hra
    // pool's verified Wharton course (pool convention) — the analytics cell
    // had only the declared OD-survey gap row. "Enroll for free" ×3,
    // data-driven people management, 4 modules. ₱ paid tier.
    url: "https://www.coursera.org/learn/wharton-people-analytics",
    durationHours: 12,
    skillsAddressed: ["Human Resources Analytics and Insights"],
    creditingBody: "Wharton",
    careerId: "training",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Human Resources Analytics and Insights":
        "Wharton's people-analytics course teaches managing people by data — staffing, evaluation and performance read through metrics — the business-insight read this cell prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  // ── mkt (3.3) — study.com citations stripped; thin zones declared ──
  // Wave B audit (2026-11-03, batch 2): access/form per-row (HubSpot
  // Academy → account; Coursera audit → exam-paid; TOP Moodle modules →
  // account; Skillshop root + GCF topics root + the Illinois
  // specialization → landing fail-closed). The grow.google cert page was
  // RE-POINTed to the taught course-1 page (fetched LIVE). Census-thin
  // fills, all user-ruled: the verified IE "Marketing Mix Fundamentals"
  // course carries the mix / distribution-channels / brand-bundle cells;
  // the TOP Interpersonal module (per-role duplicate) carries the
  // Communication+CSC collaboration ESC cells; customer orientation
  // attaches to the TOP centricity module. Declared-thin gap rows stay
  // declared — adviser-only. Learn lines drafted from the resources'
  // actual content (learn line — authored 2026-11-03, user-delegated).
  // Coverage: 19/25 vetted → 24/25 after Wave E (user-delegated batch,
  // 2026-11-03): two Coursera + one Coursera + two Alison taught rows fill
  // the Business-Environment, Consumer-Intelligence, Demand-Analysis-family
  // and Events/proposals/platforms cells (every candidate fetched LIVE;
  // learn lines authored user-delegated). One honest red stays: the
  // trade-legislation/retailing/website-design bundle — see the
  // res-mkt-gap-trade adjudication.
  {
    id: "res-mkt-google-dmx",
    title: "Foundations of Digital Marketing and E-commerce (Google, cert course 1)",
    provider: "Google (grow.google / Coursera)",
    type: "cert",
    cost: "free",
    // fetched LIVE 2026-11-03 (RE-POINTED, Wave B batch 2): the old URL was
    // the grow.google certificate landing. The suggested slot must open
    // teachable content, so this row now points at the cert's taught
    // course 1 ("Foundations of Digital Marketing and E-commerce", "Enroll
    // for free" verified — the digital-marketing and e-commerce landscape,
    // who the audiences are, and the channel/portfolio fundamentals).
    // Id/ADDR unchanged; audit route free, ₱ certificate tier.
    url: "https://www.coursera.org/learn/foundations-of-digital-marketing-and-e-commerce",
    durationHours: 20,
    skillsAddressed: ["Digital Marketing", "Marketing Communications Plan Development", "Media Strategy Development"],
    careerId: "mkt",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Marketing Communications Plan Development":
        "The course lays the channel-and-message groundwork: how digital marketing channels differ, who a campaign reaches, and how the pieces assemble into a coherent plan.",
      "Media Strategy Development":
        "Teaches picking among channels and tactics for a market goal — where to spend, on what audiences, and how the funnel stages map to media choices.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-mkt-hubspot-social",
    title: "Social Media Marketing Certification Course (HubSpot Academy)",
    provider: "HubSpot Academy",
    type: "cert",
    cost: "free",
    // completely free incl. certificate (title confirmed on page)
    // audit (2026-11-03): HubSpot Academy course (free signup → account).
    url: "https://academy.hubspot.com/courses/social-media",
    durationHours: 6,
    skillsAddressed: ["Social Media Marketing", "Trend Forecasting"],
    creditingBody: "HubSpot Academy",
    careerId: "mkt",
    form: "taught",
    access: "account",
  },
  {
    id: "res-mkt-hubspot-content",
    title: "Content Marketing Certification Course (HubSpot Academy)",
    provider: "HubSpot Academy",
    type: "cert",
    cost: "free",
    // audit (2026-11-03): HubSpot Academy course (free signup → account).
    // Collateral-family winner (only claim).
    url: "https://academy.hubspot.com/courses/content-marketing",
    durationHours: 6,
    skillsAddressed: ["Content Development and Strategy", "Category Marketing · Collateral Production · Visual Collaterals Production · Content Management"],
    creditingBody: "HubSpot Academy",
    careerId: "mkt",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Category Marketing · Collateral Production · Visual Collaterals Production · Content Management":
        "The content-marketing curriculum plans and produces the pieces — the story framework, the collateral an asset pack needs, and the content calendar that manages it all.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-mkt-wharton-customer-analytics",
    title: "Customer Analytics (Wharton)",
    provider: "Coursera (Wharton)",
    type: "course",
    cost: "free",
    // audit free; certificate paid
    // audit (2026-11-03): Coursera course page → audit route free, cert
    // paid → exam-paid; taught. Market-intelligence family winner.
    url: "https://www.coursera.org/learn/wharton-customer-analytics",
    durationHours: 12,
    skillsAddressed: [
      "Market Intelligence", "Market Profiling", "Market Trend Analysis",
      "Data Analysis and Interpretation", "Data-mining and Modelling · Research and Information Synthesis",
    ],
    careerId: "mkt",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Market Intelligence":
        "Teaches reading customers and markets from data — what people choose and why — the intelligence base a marketer acts on.",
      "Market Profiling":
        "Profiling exercises separate audiences by what they do and value — the customer-segment read this cell prints.",
      "Market Trend Analysis":
        "The course reads demand patterns and behavior shifts from real data — spotting the trend lines inside messy market signals.",
      "Data Analysis and Interpretation":
        "Hands-on analytics framing: turning raw purchase/behavior data into interpreted findings a marketing decision can rest on.",
      "Data-mining and Modelling · Research and Information Synthesis":
        "The modelling module digs patterns out of large datasets and pairs them with research synthesis — the mining-discipline the bundle prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-mkt-google-analytics-academy",
    title: "Google Analytics Academy (via Skillshop)",
    provider: "Google",
    type: "course",
    cost: "free",
    // free; may need a Google account; PH-accessible
    // audit (2026-11-03): skillshop root = the platform home (courses live
    // behind it) → landing/account
    url: "https://skillshop.withgoogle.com/",
    durationHours: 4,
    skillsAddressed: ["Digital Fluency (ESC, Basic)"],
    careerId: "mkt",
    form: "landing",
    access: "account",
  },
  {
    id: "res-mkt-top-social-concepts",
    title: "TOP — Content Creation (Social Media) L3: Creating Concepts for Social Media",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free); titles verified via TOP search page
    // audit (2026-11-03): TOP Moodle module → account (login-walled
    // verified LIVE this pass). Social-marketing + ESC winner (id A–Z +
    // countsTowardEntryPath).
    url: "https://e-tesda.gov.ph/course/view.php?id=4069",
    durationHours: 2,
    skillsAddressed: [
      "Social Media Marketing",
      "Trend Forecasting",
      "Digital Fluency (ESC, Basic)",
    ],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "mkt",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Social Media Marketing":
        "The TESDA module develops social-media concepts against a campaign target — platforms, formats and the message fit — social marketing in the PH-running convention.",
      "Trend Forecasting":
        "Concept development here starts from what audiences currently respond to — reading the platform's live styles and forecasting the next concept fit.",
      "Digital Fluency (ESC, Basic)":
        "Working a real content pipeline end to end in digital tools — brief to posted concept — the digital-fluency basics the ESC layer prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-mkt-top-social-propagating",
    title: "TOP — Content Creation (Social Media) L3: Propagating Content",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free)
    // audit (2026-11-03): TOP Moodle module → account
    url: "https://e-tesda.gov.ph/course/view.php?id=4070",
    durationHours: 2,
    skillsAddressed: ["Social Media Marketing"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "mkt",
    form: "taught",
    access: "account",
  },
  {
    id: "res-mkt-top-dmx-funnel",
    title: "TOP — Digital Marketing L3: Designing a Digital Marketing Funnel",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free)
    // audit (2026-11-03): TOP Moodle module → account. Digital Marketing +
    // E-commerce winner (id A–Z over the optimizing row — both credited).
    url: "https://e-tesda.gov.ph/course/view.php?id=4748",
    durationHours: 2,
    skillsAddressed: ["Digital Marketing", "E-Commerce Campaign Management"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "mkt",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Digital Marketing":
        "Designs the funnel a digital campaign runs on — stages, channels and the message hand-offs — digital marketing taught on the TESDA competency.",
      "E-Commerce Campaign Management":
        "The funnel module carries the e-commerce campaign layer: driving buyers through the stages to a conversion, the campaign management this cell prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-mkt-top-dmx-content",
    title: "TOP — Digital Marketing L3: Creating Content",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free)
    // audit (2026-11-03): TOP Moodle module → account. Content Dev+Strategy
    // winner (countsTowardEntryPath + credited TESDA beats the HubSpot row).
    url: "https://e-tesda.gov.ph/course/view.php?id=4750",
    durationHours: 2,
    skillsAddressed: ["Digital Marketing", "Content Development and Strategy"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "mkt",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Content Development and Strategy":
        "Creating the campaign's content in line with the funnel strategy: what to make, for which stage and audience — the develop-plan loop this cell prints.",
      // learn line — authored 2026-11-03, user-delegated (cutover loose fill 2026-11-03):
      // the batch-3 roster missed its learn line — this row is the
      // Digital Marketing WINNER (credited TOP module + countsTowardEntryPath,
      // id A–Z over the funnel/optimizing dups) with no entry for the cell
      // it wins. The module page is login-walled (fetched LIVE this pass →
      // TESDA sign-in) — drafted in the funnel-note register from the
      // module title and its audit note, per the Wave B authoring tradition.
      "Digital Marketing":
        "Creates the digital campaign's content piece — what to make, on which channel, for which audience — digital marketing practiced on the TESDA competency.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-mkt-top-dmx-optimizing",
    title: "TOP — Digital Marketing L3: Optimizing Digital Marketing Campaign",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free)
    // audit (2026-11-03): TOP Moodle module → account
    url: "https://e-tesda.gov.ph/course/view.php?id=4751",
    durationHours: 2,
    skillsAddressed: ["Digital Marketing", "E-Commerce Campaign Management"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "mkt",
    form: "taught",
    access: "account",
  },
  {
    id: "res-mkt-top-customer-centricity",
    title: "TOP — Customer Centricity (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free)
    // audit (2026-11-03): TOP Moodle module → account (ADDR-catalog-only)
    url: "https://e-tesda.gov.ph/course/view.php?id=5043",
    durationHours: 2,
    skillsAddressed: ["Customer Orientation (ESC, Basic)"],
    creditingBody: "TESDA",
    careerId: "mkt",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Customer Orientation (ESC, Basic)":
        "The Job-Ready customer-centricity module puts the customer at the center of every work decision — the orientation behavior the ESC cell prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-mkt-ie-marketing-mix",
    title: "Marketing Mix Fundamentals (IE Business School)",
    provider: "Coursera (IE Business School)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 2 fill, user-ruled): the
    // Marketing-Mix / distribution-channels / brand-bundle cells had no
    // taught claims (the study.com strips left them thin). New row for
    // IE's taught course ("Enroll for free" ×3; canonical /learn/marketing-mix;
    // skills decoded from the page: Marketing Mix via the title,
    // Marketing Channel / Integrated Marketing Communications /
    // Communication Planning, and Brand Strategy · Branding · Brand
    // Management with Media Planning) — the 4-P craft this family prints.
    // ₱ paid tier: shareable certificate.
    url: "https://www.coursera.org/learn/marketing-mix",
    durationHours: 6,
    skillsAddressed: [
      "Marketing Mix Management",
      "Communications within Distribution Channels",
      "Brand Campaign Management · Brand Guideline Development · Brand Marketing · Brand Portfolio Management",
    ],
    creditingBody: "IE Business School",
    careerId: "mkt",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Marketing Mix Management":
        "The course is the marketing mix taught: product, price, placement and promotion decisions worked together — the 4-P management this cell prints.",
      "Communications within Distribution Channels":
        "Channel and communication-planning modules show how messages travel through the distribution stack — IMC planned across a channel's partners.",
      "Brand Campaign Management · Brand Guideline Development · Brand Marketing · Brand Portfolio Management":
        "Brand-strategy and brand-management modules cover building the brand's identity, setting its rules, and running campaigns under it — the brand-family bundle taught.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-mkt-top-interpersonal",
    title: "TOP — Interpersonal Skills (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free); title verified via TOP search pages
    // (standing flag, same class as the Job-Ready siblings)
    // audit (2026-11-03): TOP Moodle module → account (login-walled verified
    // LIVE this pass). Per-role duplicate of the sales pool's module —
    // carries the communication + collaboration ESC-layer cells.
    url: "https://e-tesda.gov.ph/course/view.php?id=5040",
    durationHours: 2,
    skillsAddressed: [
      "Communication (ESC-layer, printed in the Primary block)",
      "Collaboration (ESC, Basic)",
    ],
    creditingBody: "TESDA",
    careerId: "mkt",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Communication (ESC-layer, printed in the Primary block)":
        "The Job-Ready interpersonal module drills workplace talking and listening — the communication layer this ESC cell prints.",
      "Collaboration (ESC, Basic)":
        "Working with others in the module's team exercises — the collaboration basics the ESC cell prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
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
    // no taught self-serve page exists — adjudicated Wave E 2026-11-03. The
    // bundle prints trade legislation + retailing economics + website design
    // as ONE cell; re-hunted this pass (Coursera, Alison, Microsoft Learn,
    // TESDA TOP, OCW) — pages teach at most one leg, none claims the bundle.
    // Adviser-owned context row stays the honest carrier.
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
  {
    id: "res-mkt-alison-bizenv",
    title: "Introduction to Creating a Business Environment",
    provider: "Alison",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave E mkt fill, user-delegated): course page
    // HTTP 200 — "Introduction to Creating a Business Environment" (1.5–3 hrs,
    // contains video; Start-Course flow). The printed outcomes list the
    // categories of environmental factors and drill the PESTLE toolkits for
    // analysing the organisation's environment. Study free; CPD certificate
    // optional.
    url: "https://alison.com/course/introduction-to-business-environment",
    durationHours: 2,
    skillsAddressed: ["Business Environment Analysis"],
    careerId: "mkt",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Business Environment Analysis":
        "The course drills the environment analysis itself: the factor categories that can impact a business, the direct/indirect parts of the external environment, and the PESTLE toolkit for reading them — the market/technology environment read the PSF cell prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-mkt-emory-marketing-insights",
    title: "Meaningful Marketing Insights (Emory University)",
    provider: "Coursera (Emory University)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave E mkt fill, user-delegated): Coursera
    // course page HTTP 200 ("Enroll for free"; David Schweidel; 5 modules —
    // converting the consumer data the organisation collects — surveys,
    // transaction histories, billing records — into marketing insights with
    // Excel, exploratory analysis and regression). Taught; ₱ paid tier:
    // certificate.
    url: "https://www.coursera.org/learn/meaningful-marketing-insights",
    durationHours: 10,
    skillsAddressed: ["Consumer Intelligence Analysis"],
    careerId: "mkt",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Consumer Intelligence Analysis":
        "The course is taught on exactly this craft: turning raw consumer-pattern data into actionable marketing knowledge — descriptive statistics, visualizations and regression on real purchase/behavior data, ending in tools users can act on.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-mkt-ucd-initiating-research",
    title: "Research Proposal: Initiating Research (UC Davis)",
    provider: "Coursera (UC Davis)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave E mkt fill, user-delegated): Coursera
    // course page HTTP 200 ("Enroll for free"; Jim Fong; 8 hrs, 4 modules —
    // define market research and its motivations, weigh secondary/internal
    // against primary research, and compose the professionally packaged
    // research plan or proposal). Taught; ₱ paid tier: certificate.
    url: "https://www.coursera.org/learn/research-proposal-initiating-research",
    durationHours: 8,
    skillsAddressed: ["Business Opportunities Development · Demand Analysis · Market Research"],
    careerId: "mkt",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Business Opportunities Development · Demand Analysis · Market Research":
        "The course opens a research project for targeted business needs: defining market research, sizing what secondary and primary data can answer, and packaging the research plan — the growth/demand research support the printed bundle names.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-mkt-alison-esports-events",
    title: "Essentials of Esports Event Management",
    provider: "Alison",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave E mkt fill, user-delegated): course page
    // HTTP 200 — the printed outcomes hit every leg of the bundled cell in
    // one flow: planning and executing a successful event (events leg),
    // developing effective sponsorship proposals (proposal leg), and
    // promoting via digital marketing channels plus event
    // production/live-streaming requirements (media-platforms leg), in the
    // esports frame the learn line honestly carries. Study free; CPD
    // certificate optional.
    url: "https://alison.com/course/essentials-of-esports-event-management",
    durationHours: 2,
    skillsAddressed: ["Events Planning and Management · Proposal Writing · Media Platforms Management"],
    careerId: "mkt",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Events Planning and Management · Proposal Writing · Media Platforms Management":
        "The course teaches the event loop in the esports frame — planning and executing the event, developing effective sponsorship proposals, and promoting/producing across digital marketing channels and live-stream platforms — the event-support, proposals and platform-upkeep bundle as printed.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  // ── sales (3.4) — LinkedIn Learning entry REMOVED (ruled DROPPED; paid path
  // noted in copy only); study.com citations stripped ──
  // Wave B audit (2026-11-03, batch 3): access/form per-row from each row's own
  // fetched-LIVE facts. HubSpot graded taught/account (course title + free-cert
  // standing re-verified via the HubSpot training hub this pass; SPA grade-page).
  // Rutgers specialization page graded landing/exam-paid (fail-closed — the
  // taught courses live behind it; batch-2 specialization-page convention). Five
  // new taught rows fill the holes the audit found (all fetched LIVE 2026-11-03,
  // user-ruled contents per the course pages' printed outcomes): Supply Chain
  // Logistics (delivery leg), STARWEAVER Stakeholder Management (per-role dup of
  // the verified row), Alison Retail Management (retail-environment outcome), Alison
  // Customer Experience Design, Alison Customer Service Skills (after-sales leg),
  // Alison Sales and Negotiation Skills (bargaining leg, scoped). Honest reds KEPT
  // (searched, no taught page verified): Product Advisory + Product Demonstration,
  // Order Fulfilment Administration (the paperwork chain), the co-marketing
  // Design-concept bundle, the Supplier Performance/Buying bundle. Coverage:
  // 13/17 vetted. Learn lines drafted from the course pages — learn line,
  // authored 2026-11-03, user-delegated.
  // Wave E (user-delegated batch, 2026-11-03): two taught fills land — the
  // Microsoft Learn sales-orders module carries Order Fulfilment Administration
  // and the Rutgers Supply Chain Sourcing course carries the Supplier
  // Performance/Sourcing bundle (both fetched LIVE; learn lines authored
  // user-delegated). Coverage: 15/17 vetted. Two honest reds stay, adjudicated
  // Wave E 2026-11-03 (no taught self-serve page claims the printed pair/bundle
  // — searched Coursera, Alison, Microsoft Learn, HubSpot, TESDA TOP):
  //   · Product Advisory + Product Demonstration — the open self-serve field
  //     teaches selling/presentations, never the paired demonstrate-the-product
  //     craft as one taught claim (vendor demo-webinars exist, none is a course
  //     page). Adviser-owned.
  //   · Design Concepts Generation · Idea Generation and Selection · Narrative
  //     Design · Shopper Marketing Campaign Management — ideation courses teach
  //     the idea-generation legs but no single free taught page also claims
  //     narrative design + shopper-marketing campaigns. Adviser-owned.
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
    // audit (2026-11-03, batch 3): HubSpot SPA shell at the URL; title + free-cert
    // standing verified via HubSpot's sales-training hub ("FREE Certification
    // Course"; "create a free HubSpot Academy account"). taught/account.
    // The 5-cell winner (tier-2 creditingBody; id A–Z over the sales-mgmt row).
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
    form: "taught",
    access: "account",
    learnNotes: {
      "Customer Acquisition Management":
        "HubSpot's Inbound Sales method starts at lead hygiene: identifying potential buyers and building outreach strategies per the printed class list — the prospect-and-qualify loop the FSC cell prints.",
      "Customer Relationship Management + Customer Relationship Management Operations":
        "The same five classes walk the inbound record side — how buying signals feed a clean pipeline — the interaction-lifecycle management this printed row names.",
      "Sales Closure":
        "Use personalized presentations and the closing stages of the Inbound Sales Method — the follow-up-to-contract loop the cell prints.",
      "Customer Management":
        "Day-to-day relationship stewardship rides the exploring/advising classes: tailoring the offer to live account needs.",
      "Account Management":
        "The Account Management mapped cell rides the exploring stage: reading account signals and keeping the relationship moving after hand-off.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-sales-hubspot-sales-mgmt",
    title: "Sales Management Training (HubSpot Academy)",
    provider: "HubSpot Academy",
    type: "cert",
    cost: "free",
    // process definition and pipeline discipline
    // audit (2026-11-03, batch 3): HubSpot SPA shell; free-cert standing per the
    // sales-training hub. taught/account. Catalog fallback only — the
    // inbound-sales row wins its shared cells on the tier-2 creditingBody.
    url: "https://academy.hubspot.com/courses/sales-manager-training-program",
    durationHours: 3,
    skillsAddressed: ["Customer Acquisition Management", "Sales Closure"],
    creditingBody: "HubSpot Academy",
    careerId: "sales",
    form: "taught",
    access: "account",
  },
  {
    id: "res-sales-trailhead",
    title: "Trailhead (Salesforce)",
    provider: "Salesforce",
    type: "course",
    cost: "free",
    // hands-on CRM-operations practice modules; some modules need a free
    // Salesforce dev org; badge-driven
    // audit (2026-11-03, batch 3): trailhead.salesforce.com root = the trail
    // catalog (title verified LIVE "Trailhead | The fun way to learn") →
    // landing/account — module pages live behind the catalog.
    url: "https://trailhead.salesforce.com/",
    durationHours: 4,
    skillsAddressed: [
      "Customer Relationship Management + Customer Relationship Management Operations",
       
    ],
    careerId: "sales",
    form: "landing",
    access: "account",
  },
  {
    id: "res-sales-wharton-customer-analytics",
    title: "Customer Analytics (Wharton)",
    provider: "Coursera (Wharton)",
    type: "course",
    cost: "free",
    // evidence-based buyer-behavior reading; audit free, certificate paid
    // audit (2026-11-03, batch 3): fetched LIVE "Enroll for free" — descriptive/
    // predictive/prescriptive analytics over buying data. taught/exam-paid
    // (audit route; certificate is the ₱ tier).
    url: "https://www.coursera.org/learn/wharton-customer-analytics",
    durationHours: 12,
    skillsAddressed: ["Customer Behavior Analysis"],
    careerId: "sales",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Customer Behavior Analysis":
        "Wharton's customer-analytics course runs descriptive, predictive and prescriptive analytics over real buying data — the tools-and-approaches reading of buyer signals the FSC cell prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-sales-top-customer-centricity",
    title: "TOP — Customer Centricity (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free)
    // audit (2026-11-03, batch 3): TOP Moodle module → account (login-wall
    // verified LIVE this pass; title + description verified via the TOP search
    // mirror — "customer segmentation... rapport-building... handling concerns
    // with professionalism... CRM tools... POS devices"). taught. The ESC-bundle
    // winner (id A–Z over interpersonal/self-presentation).
    url: "https://e-tesda.gov.ph/course/view.php?id=5043",
    durationHours: 2,
    skillsAddressed: ["Communication · Collaboration · Customer Orientation · Global Perspective · Problem Solving (Enabling)"],
    creditingBody: "TESDA",
    careerId: "sales",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Communication · Collaboration · Customer Orientation · Global Perspective · Problem Solving (Enabling)":
        "The Job-Ready customer-centricity module drills rapport-building, serving diverse customer types and handling concerns with professionalism — the client-facing behavior bundle as printed.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-sales-rutgers-scm",
    title: "Supply Chain Management Specialization (Rutgers)",
    provider: "Coursera",
    type: "course",
    cost: "free",
    // the delivery half of sales — order flow, logistics coordination
    // audit (2026-11-03, batch 3): specialization page = program landing →
    // landing/exam-paid (fail-closed; the taught courses live behind it — the
    // per-role Supply Chain Logistics row below is the taught winner).
    url: "https://www.coursera.org/specializations/supply-chain-management",
    durationHours: 30,
    skillsAddressed: ["Order Fulfilment Administration", "Sales Delivery + Delivery Management"],
    careerId: "sales",
    form: "landing",
    access: "exam-paid",
  },
  {
    id: "res-sales-rutgers-logistics",
    title: "Supply Chain Logistics (Rutgers)",
    provider: "Coursera (Rutgers)",
    type: "course",
    cost: "free",
    // fetched LIVE (Wave B batch 3 fill, user-ruled): the taught course page of
    // the same rutgers specialization ("Enroll for free", 4 modules —
    // transportation, warehousing and inventory, logistics networks — "deliver
    // top customer service"). The order-delivery leg of the sales loop. ₱ paid
    // tier: certificate.
    url: "https://www.coursera.org/learn/supply-chain-logistics",
    durationHours: 10,
    skillsAddressed: ["Sales Delivery + Delivery Management"],
    careerId: "sales",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Sales Delivery + Delivery Management":
        "Rutgers' logistics course runs the delivery half of a won deal: choosing transport modes, reading tracking statements, and designing a logistics network that delivers on customer service.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-sales-top-interpersonal",
    title: "TOP — Interpersonal Skills (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free)
    // audit (2026-11-03, batch 3): TOP Moodle module → account (login-wall
    // standing this pass; title verified via the TOP search mirror — the same
    // Job-Ready Interpersonal module batch 2 graded for mkt). taught/account.
    url: "https://e-tesda.gov.ph/course/view.php?id=5040",
    durationHours: 2,
    skillsAddressed: ["Communication · Collaboration · Customer Orientation · Global Perspective · Problem Solving (Enabling)"],
    creditingBody: "TESDA",
    careerId: "sales",
    form: "taught",
    access: "account",
  },
  {
    id: "res-sales-top-self-presentation",
    title: "TOP — Self-Presentation (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // client-facing presence for on-site visits; login-walled (TOP account free)
    // audit (2026-11-03, batch 3): TOP Moodle module → account (login-wall
    // standing this pass; id 5038 resolves via the TOP search mirror). taught/account.
    url: "https://e-tesda.gov.ph/course/view.php?id=5038",
    durationHours: 2,
    skillsAddressed: ["Communication · Collaboration · Customer Orientation · Global Perspective · Problem Solving (Enabling)"],
    creditingBody: "TESDA",
    careerId: "sales",
    form: "taught",
    access: "account",
  },
  {
    id: "res-sales-starweaver-stakeholder",
    title: "Stakeholder Management (STARWEAVER)",
    provider: "Coursera (STARWEAVER)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 3 fill, user-ruled): per-role dup of
    // the verified Stakeholder Management row ("Enroll now" + financial aid;
    // 21-lesson module — identification, mapping, RACI, collaboration, conflict
    // management, change support). The multi-party coordination the cell prints.
    url: "https://www.coursera.org/learn/stakeholder-management",
    durationHours: 5,
    skillsAddressed: ["Stakeholder Management"],
    careerId: "sales",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Stakeholder Management":
        "STARWEAVER's stakeholder course teaches identification, mapping and structured collaboration — plus managing people through change — the multi-party coordination across the selling team.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-sales-alison-retail-merch",
    title: "Retail Management: Merchandising, Sales and Customer Communications",
    provider: "Alison",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 3 fill, user-ruled): the printed
    // outcomes include "ways to create an ideal retail environment" — the
    // retail-context selling seat. Study free; CPD certificate optional.
    url: "https://alison.com/course/retail-management-merchandising-sales-and-customer-communications",
    durationHours: 2,
    skillsAddressed: ["Retail Space Utilization"],
    careerId: "sales",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Retail Space Utilization":
        "Alison's retail-management module teaches merchandising and how to create an ideal retail environment — the store-based selling seat's craft.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-sales-alison-cx",
    title: "Customer Experience Design",
    provider: "Alison",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 3 fill, user-ruled): journey maps,
    // touchpoints and consistency across digital/physical channels — the
    // experience-quality FSC. Study free; CPD certificate optional.
    url: "https://alison.com/course/customer-experience-design",
    durationHours: 2,
    skillsAddressed: ["Customer Experience Management"],
    careerId: "sales",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Customer Experience Management":
        "The CX-design course teaches journey mapping and touchpoint optimization across digital and physical channels — the experience quality the secondary FSC prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-sales-alison-cs-skills",
    title: "Customer Service Skills",
    provider: "Alison",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 3 fill, user-ruled): complaints
    // handling, focus on customer needs, telephone/workplace etiquette — the
    // after-sale health of the account. Study free; CPD certificate optional.
    url: "https://alison.com/course/customer-service-skills",
    durationHours: 2,
    skillsAddressed: ["After-sales Service"],
    careerId: "sales",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "After-sales Service":
        "The customer-service-skills course drills complaint resolution and staying focused on customer needs after the transaction — keeping the account healthy post-sale.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-sales-alison-negotiation",
    title: "Sales and Negotiation Skills",
    provider: "Alison",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 3 fill, user-ruled): the printed
    // outcomes read "negotiating on behalf of someone else", phases of
    // negotiation, bargaining and closing a sale — the price/contract side of
    // the selling loop. The paperwork chain itself has no taught page (the gap
    // row below). Study free; CPD certificate optional.
    url: "https://alison.com/course/sales-and-negotiations-skills",
    durationHours: 2,
    skillsAddressed: ["Contract and Vendor Management"],
    careerId: "sales",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Contract and Vendor Management":
        "The negotiation module teaches preparation, information exchange, bargaining and closing — the price-and-terms side of partner paperwork; the administration leg stays an honest gap (see the thin row).",
    },
    // learn line — authored 2026-11-03, user-delegated
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
  {
    id: "res-sales-ms-learn-sales-orders",
    title: "Process sales orders with Dynamics 365 Sales (module)",
    provider: "Microsoft Learn",
    type: "doc",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave E sales fill, user-delegated): MS Learn
    // module page HTTP 200 — 6 units; quote records → quote lifecycle → quote
    // line items → orders and invoices → exercise (the sales-order-processing
    // lifecycle) → module assessment. Sales order processing = the paperwork
    // chain from won deal to delivery. Open access; free badge.
    url: "https://learn.microsoft.com/en-us/training/modules/process-sales-orders-dynamics-365-sales/",
    durationHours: 1,
    skillsAddressed: ["Order Fulfilment Administration"],
    careerId: "sales",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Order Fulfilment Administration":
        "The module walks the paperwork chain end to end: defining quote records, working a quote through its lifecycle, then creating and managing the orders and invoices that turn the won deal into delivery — the administration loop the cell prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-sales-rutgers-sourcing",
    title: "Supply Chain Sourcing (Rutgers)",
    provider: "Coursera (Rutgers)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave E sales fill, user-delegated): Coursera
    // course page HTTP 200 ("Enroll for free"; Rudolf Leuschner; 4 modules —
    // procurement/strategic sourcing, make-versus-buy decisions, supplier
    // selection and segmentation, and a supplier-evaluation system build;
    // the page's skills list prints Supplier Performance Management + Vendor
    // Management). Taught; ₱ paid tier: certificate.
    url: "https://www.coursera.org/learn/sourcing",
    durationHours: 12,
    skillsAddressed: ["Supplier Performance · Supplier Sourcing"],
    careerId: "sales",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Supplier Performance · Supplier Sourcing":
        "The course teaches sourcing as vendor craft: strategic sourcing levels, supplier selection and segmentation, make-versus-buy evaluation, and a supplier-evaluation system built in the final assessment — finding the right vendors and keeping the relationship performing.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  // ── csr (3.5) ──
  // Wave B audit (2026-11-03, batch 3): access/form per-row. The Coursera
  // Customer Service Fundamentals page verified LIVE ("Enroll now" — SLAs,
  // ticketing systems, ServiceNow/CRM tools module) grades taught/exam-paid and
  // picks up the Technology-and-Systems attach (its ticketing/CRM module). The
  // audit route COMMENT drafted honestly: Coursera audit + paid certificate
  // (course page carries the audit/financial-aid structure per the FAQ). TOP
  // modules graded account (login-wall verified LIVE; titles via the TOP search
  // mirror). BBC/British-Council/Microsoft-Learn/Trailhead roots graded landing
  // (fail-closed — indexes, not taught pages; the British Council CLI fetch
  // failed this session as before, recorded honestly). RA 10173 statute text =
  // reference. Honest reds KEPT: Compliance with Legal Regulations (the statute
  // anchors it; no PH taught data-privacy course verified) and the wide printed
  // FSC-list block (no single taught page claims six printed FSCs).
  // Coverage: 8/10 vetted.
  // Wave E (user-delegated batch, 2026-11-03): the Compliance cell is carried
  // by a new taught claim — Ask Lex Ph Academy's free "Basics of Data Privacy"
  // LMS course (PH, DPA-2012 anchored; fetched LIVE). The RA-10173 statute
  // text row stays as provenance (reference form; never wins). Coverage:
  // 9/10 vetted. One honest red stays, adjudicated Wave E 2026-11-03 (no
  // taught self-serve page exists — searched Coursera, Alison, Microsoft
  // Learn, HubSpot, TESDA TOP, PH privacy LMS sites):
  //   · Consumer Intelligence Analysis · Sentiment Analysis · Problem
  //     Identification · Continuous Improvement Management · Customer
  //     Acquisition Management · Brand Campaign Management (printed FSC list
  //     block) — six printed FSCs carried as ONE row; no single free taught
  //     page claims all six (analytics courses hit two or three legs at
  //     most). Adviser-owned — the agent's growth edge gets program advice.
  {
    id: "res-csr-csf-coursera",
    title: "Customer Service Fundamentals (Coursera Knowledge Accelerators)",
    provider: "Coursera",
    type: "course",
    cost: "free",
    // lesson list on-page: SLAs, service standards, call flow standards,
    // ticketing systems, CRM tools — the corporate service loop in course form
    // audit (2026-11-03, batch 3): fetched LIVE ("Enroll now"; Keith Gibson /
    // Knowledge Accelerators; 6 modules — rapport/tone, personality traits,
    // scientific-method problem solving, SLAs, ticketing systems + ServiceNow/
    // ITSM tools, KCS). taught/exam-paid (Coursera audit route, cert paid).
    // The service-loop winner; the ticketing/CRM module picks up the
    // Technology-and-Systems attach.
    url: "https://www.coursera.org/learn/customer-service-fundamentals",
    durationHours: 4,
    skillsAddressed: [
      "Perform customer service delivery processes", "Customer Service Delivery",
      "Customer Relationship Management", "Demonstrate ability to effectively engage customers",
      "Technology and Systems Application",
    ],
    careerId: "csr",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Perform customer service delivery processes":
        "The SLA/service-standards/call-flow modules run inbound handling exactly to enterprise procedure — the delivery-process craft the TESDA unit prints.",
      "Customer Service Delivery":
        "Structured methods for resolving customer issues on time, per the course's resolution module.",
      "Customer Relationship Management":
        "The ticketing/CRM module teaches logging interactions and managing the ticket queue — the accurate CRM logging the flagged row names.",
      "Demonstrate ability to effectively engage customers":
        "Rapport, tone and empathy modules coach sensing and acknowledging customer feelings inside the call — the TESDA engagement unit.",
      "Technology and Systems Application":
        "ServiceNow/ITSM practice in module 5 — CRM, telephony and case tools fluency as the PSF cell prints; the hands-on dialer leg stays a gap (see the thin row).",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-csr-top-customer-centricity",
    title: "TOP — Customer Centricity (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free)
    // audit (2026-11-03, batch 3): TOP Moodle module → account (login-wall
    // verified LIVE this pass; title + syllabus verified via the TOP search
    // mirror — "customer segmentation... rapport-building... handling concerns
    // with professionalism... CRM tools... POS"). taught/account. Wins
    // Customer-Handling and the Enabling bundle on the tier-2 creditingBody + id.
    url: "https://e-tesda.gov.ph/course/view.php?id=5043",
    durationHours: 2,
    skillsAddressed: ["Customer Handling and Care", "Collaboration · Communication · Customer Orientation · Digital Fluency · Problem Solving · Global Perspective (Enabling, Basic/Intermediate)"],
    creditingBody: "TESDA",
    careerId: "csr",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Customer Handling and Care":
        "The Job-Ready customer-centricity module drills rapport-building and handling customer concerns with professionalism — the empathy/de-escalation seat inside the call.",
      "Collaboration · Communication · Customer Orientation · Digital Fluency · Problem Solving · Global Perspective (Enabling, Basic/Intermediate)":
        "Serving diverse customer types with a customer-focused mindset carries the printed service-behavior stages.",
    },
    // learn line — authored 2026-11-03, user-delegated
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
    // audit (2026-11-03, batch 3): CLI connection failed again this session
    // (as before, recorded; site standing verified in earlier rounds).
    // Root index → landing (the lesson sections live behind it).
    url: "https://learnenglish.britishcouncil.org/",
    durationHours: 2,
    skillsAddressed: ["Communicate effectively in English for customer service"],
    careerId: "csr",
    pick: true,
    form: "landing",
    access: "direct",
  },
  {
    id: "res-csr-top-english-business",
    title: "TOP — English for Business and Entrepreneurship (Language Literacy)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free)
    // audit (2026-11-03, batch 3): TOP Moodle module → account (login-wall
    // standing; title + syllabus verified via the TOP search mirror —
    // "practical English skills for business... effective communication for
    // presenting ideas"). taught/account — the English-cell winner (tier-2
    // creditingBody over the landing-grade English indexes).
    url: "https://e-tesda.gov.ph/course/view.php?id=2801",
    durationHours: 3,
    skillsAddressed: ["Communicate effectively in English for customer service"],
    creditingBody: "TESDA",
    careerId: "csr",
    form: "taught",
    access: "account",
    learnNotes: {
      "Communicate effectively in English for customer service":
        "TESDA's business-English module develops practical English for presenting ideas and engaging stakeholders — hold the customer transactions the CCS unit prints in English.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-csr-ra10173",
    title: "Republic Act No. 10173 (Data Privacy Act of 2012)",
    provider: "Lawphil Project",
    type: "doc",
    cost: "free",
    // PSF-CCB invokes RA 10173; privacy.gov.ph 403 this session — lawphil
    // carries the working statute text
    // audit (2026-11-03, batch 3): statute text = reference (fetched LIVE,
    // title verified). Honest red retired Wave E 2026-11-03: the taught
    // Ask Lex PH data-privacy course now carries the compliance cell; the
    // statute text stays as provenance (reference — never wins the slot).
    url: "https://lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html",
    durationHours: 2,
    skillsAddressed: ["Compliance with Legal Regulations"],
    careerId: "csr",
    form: "reference",
    access: "direct",
  },
  {
    id: "res-csr-ms-learn",
    title: "Microsoft Learn (Training catalog)",
    provider: "Microsoft Learn",
    type: "doc",
    cost: "free",
    // audit (2026-11-03, batch 3): training-catalog hub = landing (fetched LIVE,
    // title verified); course pages live behind the catalog.
    url: "https://learn.microsoft.com/en-us/training/",
    durationHours: 4,
    skillsAddressed: [],
    careerId: "csr",
    form: "landing",
  },
  {
    id: "res-csr-top-interpersonal",
    title: "TOP — Interpersonal Skills (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free)
    // audit (2026-11-03, batch 3): TOP Moodle module → account (login-wall
    // standing; id 5040 resolves via the TOP search mirror). taught/account.
    url: "https://e-tesda.gov.ph/course/view.php?id=5040",
    durationHours: 2,
    skillsAddressed: ["Collaboration · Communication · Customer Orientation · Digital Fluency · Problem Solving · Global Perspective (Enabling, Basic/Intermediate)"],
    creditingBody: "TESDA",
    careerId: "csr",
    form: "taught",
    access: "account",
  },
  {
    id: "res-csr-top-writing",
    title: "TOP — Impactful Writing Skills (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-walled (TOP account free); end-of-call email/follow-up writing
    // audit (2026-11-03, batch 3): TOP Moodle module → account (id 5037
    // resolves via the TOP search mirror). taught/account.
    url: "https://e-tesda.gov.ph/course/view.php?id=5037",
    durationHours: 2,
    skillsAddressed: ["Collaboration · Communication · Customer Orientation · Digital Fluency · Problem Solving · Global Perspective (Enabling, Basic/Intermediate)"],
    creditingBody: "TESDA",
    careerId: "csr",
    form: "taught",
    access: "account",
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
  {
    id: "res-csr-asklex-data-privacy",
    title: "Basics of Data Privacy (Ask Lex Ph Academy)",
    provider: "Ask Lex Ph Academy",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave E csr fill, user-delegated): PH LMS
    // course page HTTP 200 — "Basics of Data Privacy" ₱0.00 (Bianca
    // Villarama; published 2025-06, updated 2026-09); the printed outline
    // teaches the Data Privacy Act of 2012 framework, roles and
    // responsibilities under the law, the transparency/legitimate-purpose/
    // proportionality principles, data-subject rights, and breach
    // prevention/response; certificate = recorded webinar + 80% quiz.
    // Free LMS enrollment → account. Resolves the statute-anchored
    // Compliance cell the batch-3 pass left adviser-owned.
    url: "https://asklexph.com/courses/basics-of-data-privacy",
    durationHours: 2,
    skillsAddressed: ["Compliance with Legal Regulations"],
    careerId: "csr",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Compliance with Legal Regulations":
        "The free PH course drills the Data Privacy Act of 2012 itself — lawful handling of personal/sensitive data, the roles and obligations under the law, the transparency/legitimate-purpose/proportionality principles, data-subject rights and breach response — the compliance discipline a rep owes inside the call.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  // ── opsanalyst (3.6) ──
  // Wave B audit (2026-11-03, batch 3): access/form per-row. The IBM
  // Enterprise Design Thinking page RE-POINTED to the canonical
  // /training/enterprise-design-thinking — fetched LIVE: the program home now
  // announces the Practitioner course moved to IBM SkillsBuild (Co-Creator/
  // Team Essentials temporarily unavailable) → the page itself reads program
  // marketing → landing (fail-closed; its three carried O*NET cells go back to
  // honest red except where a verified taught claim exists). Wharton customer
  // analytics graded taught/exam-paid (fetched LIVE "Enroll for free"). Alison
  // LSS White Belt arrives as a per-role dup (fetched LIVE; DMAIC/waste/
  // improvement cycles) for the process-study-scoping leg. The findings-memo
  // leg re-homes on the TOP writing module (workplace documents attach; the
  // §6.1 pin keeps GCF from carrying it).
  // Wave E hunt (2026-11-03/04, user-delegated): four taught fills land —
  // U Amsterdam's Qualitative Research Methods (dedicated participant-
  // observation + qualitative-interviewing modules; fetched LIVE), Alison's
  // Training of Trainers — Training Design (printed "Create a learner-friendly
  // training site and instructional manual" outcome), Coursera (Adobe)
  // Document Design (organizing/formatting documents + professional review
  // cycles + multichannel formatting), Alison's Introduction to Electronic
  // Document Management (document lifecycle, classification/indexing,
  // compliance and access control + the printed assess-organisational-needs
  // implementation step). One cell stays red on purpose, adjudicated
  // Wave E 2026-11-03 (statute-anchored):
  //   · "PSOC 2421 corroboration block (lettered task a)" — the verbatim PSOC
  //     lettered-task cell corroborates the roster extraction itself (no O*NET
  //     counterpart); no taught page can teach a corroboration block.
  //     Adviser-owned.
  // Coverage: 9/10 vetted.
  {
    id: "res-ops-wharton-customer-analytics",
    title: "Customer Analytics (Wharton)",
    provider: "Coursera (Wharton)",
    type: "course",
    cost: "free",
    // structured analysis of business data; audit free, certificate paid
    // audit (2026-11-03, batch 3): fetched LIVE "Enroll for free" — 5 modules
    // (descriptive/predictive/prescriptive analytics over buying data).
    // taught/exam-paid. The vetted analyst-pool row (IBM's taught flow moved
    // behind SkillsBuild; see that row).
    url: "https://www.coursera.org/learn/wharton-customer-analytics",
    durationHours: 12,
    skillsAddressed: ["Data analysis & solution framing", "Information gathering & organizing"],
    careerId: "opsanalyst",
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Data analysis & solution framing":
        "Wharton's analytics ladder — descriptive, predictive then prescriptive — frames data into options, not verdicts: exactly the solution-framing craft the row prints.",
      "Information gathering & organizing":
        "The descriptive-analytics module teaches survey design and systematic data collection — gathering and structuring the evidence.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-ops-ibm-design-thinking",
    title: "IBM Enterprise Design Thinking (badges)",
    provider: "IBM",
    type: "course",
    cost: "free",
    // observation-to-recommendation discipline taught as a repeatable method
    // audit + re-point (2026-11-03, batch 3): old /design/thinking URL 301s →
    // the canonical /training/enterprise-design-thinking (fetched LIVE): the
    // program is "evolving" — the Practitioner course moved into IBM
    // SkillsBuild and Co-Creator/Team Essentials are "temporarily unavailable".
    // The page now reads program marketing → landing (fail-closed; the taught
    // flow needs a SkillsBuild account this pass). Its three carried cells stay
    // honestly red except the verified re-homes.
    url: "https://www.ibm.com/training/enterprise-design-thinking",
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
    form: "landing",
    access: "account",
  },
  {
    id: "res-ops-gcf-excel",
    title: "Excel (Foundations) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    // data pulls, workbooks, charts for findings memos
    // audit (2026-11-03, batch 3): same verified lesson-series standing as the
    // hra/training GCF rows — URL 308→308→200 onto LearnFree's "Excel:
    // Foundations" series page (GCF content re-hosted, title verified); the
    // hands-on lesson series → taught/direct. Catalog fallback only.
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: [],
    careerId: "opsanalyst",
    form: "taught",
    access: "direct",
  },
  {
    id: "res-ops-ms-learn",
    title: "Microsoft Learn (Training catalog)",
    provider: "Microsoft Learn",
    type: "doc",
    cost: "free",
    // documentation/diagrams tooling practice
    // note (2026-11-03, batch 3): training-catalog hub → landing (title verified
    // LIVE); ADDR empty per §6.1.
    url: "https://learn.microsoft.com/en-us/training/",
    durationHours: 4,
    skillsAddressed: [],
    careerId: "opsanalyst",
    form: "landing",
  },
  {
    id: "res-ops-top-bizops",
    title: "TOP — Managing Business Operation (iSTAR Program)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // PH-built business-operations administration; login-walled (TOP account free)
    // audit (2026-11-03, batch 3): TOP Moodle module → account (batch-2 title
    // verification stands: "Managing Business Operation"). Catalog fallback only.
    url: "https://e-tesda.gov.ph/course/view.php?id=4810",
    durationHours: 3,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "opsanalyst",
    form: "taught",
    access: "account",
  },
  {
    id: "res-ops-top-writing",
    title: "TOP — Impactful Writing Skills (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 3): TOP Moodle module → account (id 5037
    // resolves via the TOP search mirror). taught/account. The ESC winner
    // (tier-2 creditingBody); picks up the findings-memo attach (workplace
    // documents — §6.1 keeps GCF from carrying it).
    url: "https://e-tesda.gov.ph/course/view.php?id=5037",
    durationHours: 2,
    skillsAddressed: [
      "Communication · Critical Thinking · Teamwork (Enabling)",
      "Findings documentation & recommendation write-ups",
    ],
    creditingBody: "TESDA",
    careerId: "opsanalyst",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Communication · Critical Thinking · Teamwork (Enabling)":
        "The Job-Ready writing module drills workplace documents written to be acted on — the cross-functional behavior the enabling row names.",
      "Findings documentation & recommendation write-ups":
        "The writing module drills workplace reports and memos — the putting-findings-on-paper leg of the task; SOP design itself has no taught page yet.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-ops-alison-lss",
    title: "Lean Six Sigma: White Belt",
    provider: "Alison",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 3 fill, user-ruled): per-role dup
    // of the ccqa-verified LSS row (waste classification, DMAIC, improvement
    // cycles). Carries the process-study scoping leg (IBM's taught flow moved
    // behind SkillsBuild). Study free; certificate optional.
    url: "https://alison.com/course/lean-six-sigma-white-belt",
    durationHours: 3,
    skillsAddressed: ["Process study planning (scoping the study of work problems)"],
    careerId: "opsanalyst",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Process study planning (scoping the study of work problems)":
        "The White Belt module teaches scoping an improvement effort — waste classification and the DMAIC Define step is scope-the-problem-first work.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-ops-qual-research",
    title: "Qualitative Research Methods (U Amsterdam)",
    provider: "Coursera (U Amsterdam)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-04 (Wave E fill, user-delegated): the observation-
    // and-interview craft in course form — a dedicated Observation module
    // (participant observation: being inside the work flow, observational
    // focus, field notes, fieldwork organisation) and a Qualitative
    // Interviewing module (probing tactics, rapport). "Enroll for free" →
    // audit; certificate paid.
    url: "https://www.coursera.org/learn/qualitative-methods",
    durationHours: 28,
    skillsAddressed: ["On-site observation & interviewing"],
    careerId: "opsanalyst",
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "On-site observation & interviewing":
        "The participant-observation module teaches watching work happen and recording it honestly (focus, field notes, interpretation), and the interviewing module drills probing questions that draw out what people actually do rather than what they report.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-ops-tott-design",
    title: "Training of Trainers — Training Design",
    provider: "Alison",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-04 (Wave E fill, user-delegated): the printed
    // outcome "Create a learner-friendly training site and instructional
    // manual" plus adult-learning principles and instructional strategies —
    // the manuals-and-training leg for revised forms/reports/procedures.
    // Certificate optional (paid); study free/account.
    url: "https://alison.com/course/training-of-trainers-training-design",
    durationHours: 4,
    skillsAddressed: ["Implementation support & training of revised methods"],
    careerId: "opsanalyst",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Implementation support & training of revised methods":
        "The design module teaches turning a method into an instructional manual and a learner-friendly training site around adult-learning principles — the rolling-revised-methods-out craft.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-ops-adobe-document-design",
    title: "Document Design (Adobe)",
    provider: "Coursera (Adobe)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-04 (Wave E fill, user-delegated): organizing,
    // formatting and managing documents to professional standards; Module 2
    // runs professional review cycles (design-review quizzes, version and
    // feedback handling) and optimizes documents for multichannel campaigns —
    // the format/distribution legs of the forms/reports review; the purpose
    // review stays human judgment (course is Acrobat-centric). "Enroll for
    // free" → audit; certificate paid.
    url: "https://www.coursera.org/learn/document-design",
    durationHours: 22,
    skillsAddressed: ["Forms/reports review & redesign"],
    careerId: "opsanalyst",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Forms/reports review & redesign":
        "The workflow module runs professional review cycles — versions, feedback, optimization through to a production-ready redesign — and prints the formatting/distribution leg (multichannel, quality, accessibility); judging what the document is FOR stays with the analyst.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-ops-edm",
    title: "Introduction to Electronic Document Management",
    provider: "Alison",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-04 (Wave E fill, user-delegated): printed outcomes —
    // the stages of the document lifecycle, classification/indexing/metadata
    // for efficient storage and retrieval, compliance with EDM standards and
    // regulations, access-control components, and "assessing organisational
    // needs and requirements for EDM implementation" — the
    // filing/protection/retrieval program-support craft in course form.
    url: "https://alison.com/course/introduction-to-electronic-document-management",
    durationHours: 3,
    skillsAddressed: ["Records-management program design"],
    careerId: "opsanalyst",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Records-management program design":
        "The course teaches the filing/protection/retrieval components of a records program (lifecycle stages, classification and indexing, compliance, access control) plus the printed assess-organisational-needs step — program design support, with the org-wide policy itself adviser-owned.",
    },
    // learn line — authored 2026-11-03, user-delegated
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
    // catalog-only (ADDR empty per §6.1; ungraded).
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
  // Wave B audit (2026-11-03, batch 3): access/form per-row. Rutgers
  // specialization page graded landing/exam-paid (fail-closed); the two taught
  // courses of that same specialization arrive as per-role rows (both fetched
  // LIVE "Enroll for free" this pass): Supply Chain Sourcing (procurement,
  // supplier selection/segmentation, procure-to-pay systems — carries the
  // PO/requisition, supplier-evaluation and best-value legs) and Supply Chain
  // Logistics (tracking statements, warehousing/inventory — records/shipments).
  // GPPB's IRR page RE-POINTED to its canonical URL (301 verified; title
  // "IRR of RA 9184 | GPPB-TSO"); PhilGEPS RE-POINTED to the canonical bare
  // domain (301 verified). IRR + RA 9184 caveat = reference (readable law
  // text, no teaching flow). PhilGEPS = the labeled start-here portal →
  // landing. TOP modules graded account.
  // Wave E hunt (2026-11-03/04, user-delegated): five taught fills land on
  // the 2026 procurement shelf — Coursera's TCO course (comparative TCO/NPV
  // models built over supplier bids → data-driven award recommendation),
  // EDUCBA's Procurement-Bidding-and-Contract Analysis (bid types, process
  // steps, prequalification requirements, bid documentation, financial/legal
  // safeguards), the Procurement-Negotiation-and-Contract-Execution course
  // (checklist cross-checks of contract terms against quotations; negotiation
  // levers and structured notes), the From-Specs-to-POs module (anatomy of a
  // specification sheet, spec→PO transcription and verification), and the
  // Market-Scan module (structured market scans over the professional
  // sourcing ecosystem, screening criteria, documented long-lists). All
  // fetched LIVE ("Enroll for free" → audit; certificate paid). The IRR +
  // PhilGEPS rows keep their keep-with-flag / start-here rulings; the four
  // declared gap rows stay shipped. Coverage: 10/10 vetted.
  {
    id: "res-purch-rutgers-scm",
    title: "Supply Chain Management Specialization (Rutgers)",
    provider: "Coursera",
    type: "course",
    cost: "free",
    // SCM fundamentals incl. sourcing/procurement/logistics
    // audit (2026-11-03, batch 3): specialization page = program landing →
    // landing/exam-paid (fail-closed; the taught course rows below are the
    // winners).
    url: "https://www.coursera.org/specializations/supply-chain-management",
    durationHours: 30,
    skillsAddressed: ["Purchase order issuance & requisition review", "Records & shipment monitoring", "Supplier research & evaluation"],
    careerId: "purch",
    form: "landing",
    access: "exam-paid",
  },
  {
    id: "res-purch-rutgers-sourcing",
    title: "Supply Chain Sourcing (Rutgers)",
    provider: "Coursera (Rutgers)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 3 fill, user-ruled): the taught
    // course page of the sourcing side of the same specialization ("Enroll for
    // free", 4 modules — purchasing/procurement/supply management, make-vs-buy,
    // supplier selection & segmentation, sourcing best practices + procure-to-
    // pay systems, supplier-evaluation assessment). ₱ paid tier: certificate.
    url: "https://www.coursera.org/learn/sourcing",
    durationHours: 12,
    skillsAddressed: [
      "Purchase order issuance & requisition review",
      "Supplier research & evaluation",
      "Best-value purchasing (quality/price/amount)",
    ],
    careerId: "purch",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Purchase order issuance & requisition review":
        "The purchasing/procurement module runs the act of purchasing — requisition-in→PO-out — and the procure-to-pay-systems module covers automating that essential flow; issuance practice itself rides the PhilGEPS context (reference/landing rows).",
      "Supplier research & evaluation":
        "Supplier selection and segmentation plus the built supplier-evaluation assessment — the capability-set evaluation the row prints.",
      "Best-value purchasing (quality/price/amount)":
        "The supplier-evaluation module weighs quality against price and relationship across single/multiple sourcing — the best-value judgment at course granularity.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-purch-rutgers-logistics",
    title: "Supply Chain Logistics (Rutgers)",
    provider: "Coursera (Rutgers)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 3 fill, user-ruled): the taught
    // course page ("Enroll for free", 4 modules — transport modes and tracking
    // statements, warehousing, inventory). The shipment-monitoring leg.
    url: "https://www.coursera.org/learn/supply-chain-logistics",
    durationHours: 10,
    skillsAddressed: ["Records & shipment monitoring"],
    careerId: "purch",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Records & shipment monitoring":
        "Recognizing transport modes from tracking statements plus warehousing and when-to-order inventory — the purchase-records/delivery-monitoring loop; the ERP leg stays thin (see the gap row).",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-purch-gcf-excel",
    title: "Excel (Foundations) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    // bid comparison matrices and price analysis
    // audit (2026-11-03, batch 3): same verified LearnFree lesson-series
    // standing as the ops row (URL redirects onto the Excel Foundations
    // series page, title verified). taught/direct. Catalog fallback only.
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: [],
    careerId: "purch",
    form: "taught",
    access: "direct",
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
    // audit + re-point (2026-11-03, batch 3): old /laws/RA-9184/ path 301s →
    // the canonical IRR page (fetched LIVE, title "IRR of RA 9184 | GPPB-TSO").
    // Readable law text, no teaching flow → reference.
    url: "https://www.gppb.gov.ph/ra-9184-and-2016-revised-irr/",
    durationHours: 3,
    skillsAddressed: ["Legal & policy compliance (procurement rules)"],
    careerId: "purch",
    pick: true,
    form: "reference",
    access: "direct",
  },
  {
    id: "res-purch-philgeps",
    title: "PS-PhilGEPS — Official portal — start here for live PH e-procurement context (deep bid pages need an account; not cited)",
    provider: "PS-PhilGEPS (official PH portal)",
    type: "doc",
    cost: "free",
    // portal-as-start-here ruling 2026-10-29
    // audit + re-point (2026-11-03, batch 3): 301 → canonical bare domain
    // philgeps.gov.ph (fetched LIVE, title "PS-PhilGEPS"). The labeled
    // start-here portal → landing (keep-with-flag).
    url: "https://philgeps.gov.ph/",
    durationHours: 1,
    skillsAddressed: ["Supplier research & evaluation", "Market watching (supply/demand, price trends)"],
    careerId: "purch",
    pick: true,
    form: "landing",
    access: "direct",
  },
  {
    id: "res-purch-ms-learn",
    title: "Microsoft Learn (Training catalog)",
    provider: "Microsoft Learn",
    type: "doc",
    cost: "free",
    // audit (2026-11-03, batch 3): training-catalog hub → landing (title
    // verified LIVE); ADDR empty per §6.1.
    url: "https://learn.microsoft.com/en-us/training/",
    durationHours: 4,
    skillsAddressed: [],
    careerId: "purch",
    form: "landing",
  },
  {
    id: "res-purch-wharton-customer-analytics",
    title: "Customer Analytics (Wharton)",
    provider: "Coursera (Wharton)",
    type: "course",
    cost: "free",
    // data-driven decision method (cross-supply version of buying analytics)
    // audit (2026-11-03, batch 3): same verified Enroll-for-free standing as
    // the other customer-analytics rows. Catalog fallback only (ADDR empty
    // per §6.1).
    url: "https://www.coursera.org/learn/wharton-customer-analytics",
    durationHours: 12,
    skillsAddressed: [],
    careerId: "purch",
    form: "taught",
    access: "exam-paid",
  },
  {
    id: "res-purch-top-professionalism",
    title: "TOP — Professionalism (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // vendor-conduct module; login-walled (TOP account free)
    // audit (2026-11-03, batch 3): TOP Moodle module → account (login-wall
    // standing; title + syllabus verified via the TOP search mirror —
    // "change management, goal setting, quality standards, ethics, diversity
    // and gender equality, legal compliance"). taught/account. The ESC winner.
    url: "https://e-tesda.gov.ph/course/view.php?id=5042",
    durationHours: 2,
    skillsAddressed: ["Communication · Critical Thinking · Ethics/Professionalism (Enabling)"],
    creditingBody: "TESDA",
    careerId: "purch",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Communication · Critical Thinking · Ethics/Professionalism (Enabling)":
        "The Job-Ready professionalism module runs quality standards, ethics and error management — the vendor-relationship conduct the bundle names.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-purch-top-writing",
    title: "TOP — Impactful Writing Skills (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // PO/requisition/spec write-ups; login-walled (TOP account free)
    // audit (2026-11-03, batch 3): TOP Moodle module → account (id 5037
    // resolves via the TOP search mirror). taught/account.
    url: "https://e-tesda.gov.ph/course/view.php?id=5037",
    durationHours: 2,
    skillsAddressed: ["Communication · Critical Thinking · Ethics/Professionalism (Enabling)"],
    creditingBody: "TESDA",
    careerId: "purch",
    form: "taught",
    access: "account",
  },
  {
    id: "res-purch-tco",
    title: "Evaluate Total Costs for Optimal Procurement",
    provider: "Coursera (Professionals in the Industry)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-04 (Wave E fill, user-delegated): the price-
    // analysis craft literally printed — comparative TCO models built over
    // supplier proposals, NPV across the competing bids, interpreting the
    // model "Beyond the Lowest Number", and the final award-memo
    // recommendation. "Enroll for free" → audit; certificate paid.
    url: "https://www.coursera.org/learn/evaluate-total-costs-for-optimal-procurement",
    durationHours: 3,
    skillsAddressed: ["Price-proposal analysis"],
    careerId: "purch",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Price-proposal analysis":
        "The course teaches reading supplier proposals for their full cost structure (drivers beyond the price tag) and comparing competing bids with TCO/NPV models to land on a defensible, data-driven price judgment.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-purch-educba-bidding",
    title: "Procurement, Bidding and Contract Analysis (EDUCBA)",
    provider: "Coursera (EDUCBA)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-04 (Wave E fill, user-delegated): the bidding-side
    // procedural rules in course form — types of bids, bidding-process steps,
    // prequalification requirements, bid documentation, proposal evaluation,
    // and the financial/legal safeguards (bank guarantees, Incoterms,
    // liquidated damages, Force Majeure); contract administration best
    // practices in Module 2. "Enroll for free" → audit; certificate paid.
    url: "https://www.coursera.org/learn/procurement-bidding-contract-analysis",
    durationHours: 5,
    skillsAddressed: ["Legal & policy compliance (procurement rules)"],
    careerId: "purch",
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Legal & policy compliance (procurement rules)":
        "The bidding modules teach the process rules a buyer follows — prequalification, bid documentation, submission discipline — and the safeguards module teaches the clauses (Incoterms, liquidated damages, Force Majeure) that keep the paper enforceable; PH-specific RA 9184 rules stay with the reference rows.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-purch-contract-execution",
    title: "Procurement, Negotiation and Contract Execution",
    provider: "Coursera (Professionals from the Industry)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-04 (Wave E fill, user-delegated): "the
    // documentation and control practices that maintain traceability",
    // checklists to validate contract terms against quotations (Module 6's
    // Contract Compliance Checklist), and the negotiation-levers/note-taking
    // module — the monitor-compliance + vendor-negotiation pair. "Enroll for
    // free" → audit; certificate paid.
    url: "https://www.coursera.org/learn/procurement-negotiation-and-contract-execution",
    durationHours: 12,
    skillsAddressed: ["Contract performance monitoring"],
    careerId: "purch",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Contract performance monitoring":
        "Module 6's contract-compliance checklist teaches cross-checking the signed terms against the quotation (price, delivery, warranty) — the monitor-the-deal discipline; the negotiation module's structured note template covers the vendor-negotiation half.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-purch-specs-to-pos",
    title: "Procurement: From Specs to POs",
    provider: "Coursera (Professionals in the Industry)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-04 (Wave E fill, user-delegated): the printed
    // "Anatomy of a Specification and a Purchase Order" lesson plus the
    // spec→PO transcription and create-and-verify workflow — the
    // review/transcribe side of working with product specifications
    // (authoring technical content from first principles is beyond the
    // course). "Enroll for free" → audit; certificate paid.
    url: "https://www.coursera.org/learn/procurement-from-specs-to-pos",
    durationHours: 2,
    skillsAddressed: ["Product specification writing"],
    careerId: "purch",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Product specification writing":
        "The course teaches the anatomy of a specification sheet and how a PO must carry it exactly — the review/transcribe half of the spec task; authoring deep technical content from first principles has no verified taught page.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-purch-market-scan",
    title: "Apply Market-Scan for Top Suppliers",
    provider: "Coursera (Professionals in the Industry)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-04 (Wave E fill, user-delegated): the market-watch
    // method — structured scans of the professional sourcing ecosystem
    // (industrial directories like Thomasnet, B2B marketplaces, trade
    // databases/associations), scoping documents (cost targets, lead times),
    // screening criteria, and a documented, triangulated supplier long-list.
    // "Enroll for free" → audit; certificate paid.
    url: "https://www.coursera.org/learn/apply-market-scan-for-top-suppliers",
    durationHours: 2,
    skillsAddressed: ["Market watching (supply/demand, price trends)"],
    careerId: "purch",
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Market watching (supply/demand, price trends)":
        "The market-scan modules teach the repeatable market-intelligence loop — scoping, source triangulation, screening criteria and a documented long-list — the pattern a watch routine turns into supplier-market snapshots; live PH price feeds stay with the PhilGEPS start-here portal.",
    },
    // learn line — authored 2026-11-03, user-delegated
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
  // Wave B audit (2026-11-03, batch 3): access/form per-row. Alison LSS White
  // Belt graded taught/account (fetched LIVE — Lean principles, waste, DMAIC,
  // sustaining improvements); Wharton customer analytics graded
  // taught/exam-paid (fetched LIVE "Enroll for free"); GCF Excel = the verified
  // lesson series → taught/direct. TOP writing graded account (search mirror).
  // The calibration gap row HONEST for the rubric-design/calibration craft
  // (no taught page verified).
  // Wave E hunt (2026-11-03/04, user-delegated): the Document Control cell
  // fills with a per-role dup of Alison's Introduction to Electronic Document
  // Management (fetched LIVE — lifecycle stages, classification/indexing/
  // metadata, compliance with standards, access control and versioning: the
  // record/store/track trio in course form). Three cells stay red on
  // purpose, adjudicated Wave E 2026-11-03 (searched Coursera, Alison, edX,
  // lab-metrology providers, TESDA TOP; no taught self-serve page exists for
  // these rows):
  //   · Analytical Method Validation — the literal FSC is a laboratory-
  //     metrology concept; every taught page found is a paid course (NMI
  //     AU$758, ANAB US$690, LGC £1850) or the U-Tartu LC-MS MOOC
  //     (cohort-windowed Dec 2026–Feb 2027; LC-MS instrument chemistry) —
  //     not the QA scoring-method craft the flagged paraphrase prints.
  //     Adviser-owned.
  //   · Change Management · Concept Creation · Coaching and Mentoring ·
  //     Conflict Resolution · Risk Management and Administration — five
  //     printed FSCs carried as ONE row; no single taught page claims all
  //     five legs (Alison's Understanding Change Management teaches
  //     change/conflict-resolution/crisis-risk legs only; coaching lives on
  //     its own course; Concept Creation has no free taught page). Adviser-
  //     owned — the STARWEAVER stakeholder dup covers only its
  //     change/conflict legs and stays on Customer Management.
  //   · the Collaboration · Communication · … ten-FSC (Enabling, I/B)
  //     bundle — the printed coaching-conversation/analysis stage layer; no
  //     single taught page teaches the printed set, and comms-class bundle
  //     lifts are the recorded lie class (§6.1). Adviser-owned.
  // Coverage: 8/11 vetted.
  {
    id: "res-ccqa-lss-white-belt",
    title: "Lean Six Sigma: White Belt",
    provider: "Alison",
    type: "course",
    cost: "free",
    // quality-methodology foundation (defect thinking, waste, improvement
    // cycles); study free, certificate purchase optional
    // audit (2026-11-03, batch 3): fetched LIVE (outcomes: Lean Six Sigma
    // principles, roles in improvement, waste classification, DMAIC, sustaining
    // improvements). taught/account. The improvement-loop winner (the
    // calibration gap row below can never win).
    url: "https://alison.com/course/lean-six-sigma-white-belt",
    durationHours: 3,
    skillsAddressed: ["Continuous Improvement", "Systems Thinking"],
    careerId: "ccqa",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Continuous Improvement":
        "The White Belt module runs the improvement loop — roles, waste classification, DMAIC and the steps that sustain follow-up after the audit finding.",
      "Systems Thinking":
        "Reading waste and defects as system-wide patterns (value delivery vs. process health) — the quality-issue-as-system read the flagged row prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-ccqa-wharton-customer-analytics",
    title: "Customer Analytics (Wharton)",
    provider: "Coursera (Wharton)",
    type: "course",
    cost: "free",
    // customer-behavior/metrics analysis at university depth
    // audit (2026-11-03, batch 3): fetched LIVE "Enroll for free" — the
    // descriptive/predictive/prescriptive ladder. taught/exam-paid.
    url: "https://www.coursera.org/learn/wharton-customer-analytics",
    durationHours: 12,
    skillsAddressed: ["Data Analytics", "Data Visualization", "Customer Behavior Analysis"],
    careerId: "ccqa",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Data Analytics":
        "Wharton's course teaches the descriptive→predictive→prescriptive ladder over customer data — the uncovers-trends layer of the BI-tools FSC.",
      "Customer Behavior Analysis":
        "The dedicated course on customer data (NPS, survey design, predictive models) reads customer behaviors at university depth.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-ccqa-gcf-excel",
    title: "Excel (Foundations) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    // charts, dashboards and audit trackers
    // audit (2026-11-03, batch 3): verified LearnFree lesson-series standing
    // (URL redirects onto the Excel Foundations series page, title verified).
    // taught/direct — the Data-Visualization winner (id A–Z over Wharton's
    // shared claim; the dashboard/charts leg rides the series' chart lessons).
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: ["Data Visualization"],
    careerId: "ccqa",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Data Visualization":
        "The Excel Foundations series teaches building charts from scored data — the KPI-graph leg of the QA dashboard; BI dashboards proper stay with the analytics course in the pool.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-ccqa-top-writing",
    title: "TOP — Impactful Writing Skills (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 3): TOP Moodle module → account (id 5037
    // resolves via the TOP search mirror). taught/account. The report-writing
    // winner (only claim).
    url: "https://e-tesda.gov.ph/course/view.php?id=5037",
    durationHours: 2,
    skillsAddressed: ["Technical Report Writing"],
    creditingBody: "TESDA",
    careerId: "ccqa",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Technical Report Writing":
        "The Job-Ready writing module drills memos and reports written to be acted on — the QA reports and coaching-feedback write-ups the cell prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-ccqa-ms-learn",
    title: "Microsoft Learn (Training catalog)",
    provider: "Microsoft Learn",
    type: "doc",
    cost: "free",
    // document-systems fluency (share, version, retrieve)
    // audit (2026-11-03, batch 3): training-catalog hub → landing (title
    // verified LIVE); ADDR empty per §6.1.
    url: "https://learn.microsoft.com/en-us/training/",
    durationHours: 4,
    skillsAddressed: [],
    careerId: "ccqa",
    form: "landing",
  },
  {
    id: "res-ccqa-top-customer-centricity",
    title: "TOP — Customer Centricity (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 3): TOP Moodle module → account (login-wall
    // verified LIVE this pass; title verified via the TOP search mirror).
    // Catalog fallback only (ADDR empty).
    url: "https://e-tesda.gov.ph/course/view.php?id=5043",
    durationHours: 2,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "ccqa",
    form: "taught",
    access: "account",
  },
  {
    id: "res-ccqa-top-bizops",
    title: "TOP — Managing Business Operation (iSTAR Program)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 3): TOP Moodle module → account (batch-2 title
    // verification stands). Catalog fallback only (ADDR empty).
    url: "https://e-tesda.gov.ph/course/view.php?id=4810",
    durationHours: 3,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "ccqa",
    form: "taught",
    access: "account",
  },
  {
    id: "res-ccqa-ibm-design-thinking",
    title: "Enterprise Design Thinking (IBM)",
    provider: "IBM",
    type: "course",
    cost: "free",
    // structured feedback and stakeholder-loop practice
    // audit + re-point (2026-11-03, batch 3): canonical
    // /training/enterprise-design-thinking page (fetched LIVE) now reads
    // program marketing with the course flow moved into IBM SkillsBuild →
    // landing (fail-closed). ADDR empty per §6.1.
    url: "https://www.ibm.com/training/enterprise-design-thinking",
    durationHours: 6,
    skillsAddressed: [],
    careerId: "ccqa",
    form: "landing",
    access: "account",
  },
  {
    id: "res-ccqa-starweaver-stakeholder",
    title: "Stakeholder Management (STARWEAVER)",
    provider: "Coursera (STARWEAVER)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 3 fill, user-ruled): per-role dup
    // of the verified stakeholder row. Carries the customer/stakeholder-side
    // coordination of the quality program. "Enroll now" + financial aid →
    // exam-paid.
    url: "https://www.coursera.org/learn/stakeholder-management",
    durationHours: 5,
    skillsAddressed: ["Customer Management"],
    careerId: "ccqa",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Customer Management":
        "The stakeholder course teaches structured collaboration, conflict management and relationship building — the stakeholder-side coordination the flagged paraphrase prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-ccqa-edm",
    title: "Introduction to Electronic Document Management",
    provider: "Alison",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-04 (Wave E per-role dup fill, user-delegated): the
    // audit-documentation discipline in course form — document lifecycle
    // stages and versioning, classification/indexing/metadata for retrieval,
    // compliance with EDM standards and regulations, access-control
    // permissioning. Duplicate of the verified opsanalyst row; per-role
    // convention. Certificate optional (paid); study free/account.
    url: "https://alison.com/course/introduction-to-electronic-document-management",
    durationHours: 3,
    skillsAddressed: ["Document Control"],
    careerId: "ccqa",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Document Control":
        "The course drills the handling discipline an audit trail needs — lifecycle stages and versioning, classification and metadata for store-and-retrieve, compliance with standards, and access-control permissioning on the files.",
    },
    // learn line — authored 2026-11-03, user-delegated
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
  // Wave B audit (2026-11-03, batch 3): access/form per-row. All three Alison
  // course pages graded taught/account — fetched LIVE with the printed outcome
  // lists as the evidence: Corporate Event Planning Essentials (concept +
  // budget management, venue factors, vendor/contract evaluation, on-site
  // coordination, risk/contingency, post-event evaluation incl. budget-variance
  // analysis), the Diploma (event promotion stages → the marketing attach) and
  // Fundamentals (now retitled "Basics of Events Management" on the page —
  // recorded, not silent). Google Project Management prof-cert graded
  // landing/exam-paid (Google prof-cert convention; the alison-corporate row
  // wins the shared cell anyway). MPI root + TOP rows graded landing/account
  // fail-closed. ATTACHES (outcomes-verified): post-event evaluation +
  // administrative details ride alison-corporate; marketing/publicizing rides
  // the Diploma. Wave E hunt (2026-11-03/04, user-delegated): the Bills
  // review & payment approval cell fills with Coursera's Procurement Workflow
  // and Invoice Approval (fetched LIVE) — printed "master the three-way match
  // to validate and approve invoices, ensuring alignment between purchase
  // orders, receipts, and bills", forensically comparing the documents for
  // price/quantity/item discrepancies, and the approve/reject/escalate
  // decision with finance-side communication on a mismatched bill. The course
  // lives in AP-procurement land; the per-role dup row is named for the
  // event's payables task, and the event's own budget-variance read still
  // rides alison-corporate. Coverage: 13/13 vetted.
  {
    id: "res-events-alison-corporate",
    title: "Corporate Event Planning Essentials",
    provider: "Alison",
    type: "course",
    cost: "free",
    // corporate-events orientation matching the catalog variant; study free,
    // certificate optional
    // audit (2026-11-03, batch 3): fetched LIVE (outcomes above; the course
    // page prints them verbatim). taught/account — the 8-cell winner (id A–Z
    // over the diploma/fundamentals rows; also over the landing-grade Google
    // row). Picks up two outcomes-verified attaches (post-event evaluation,
    // administrative details).
    url: "https://alison.com/course/corporate-event-planning-essentials",
    durationHours: 3,
    skillsAddressed: [
      "Client objectives & requirements determination", "Event services coordination",
      "Provider evaluation & selection; contract negotiation", "Facility inspection & conformity",
      "Program, agenda, budget & services planning",
      "Event-records keeping (incl. financials)", "Event monitoring, compliance & problem resolution",
      "Post-event evaluation", "Administrative details & inquiries",
    ],
    careerId: "events",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Client objectives & requirements determination":
        "The course's printed first step is event-concept development aligned to the planner's responsibilities and expectations — consulting the client on objectives per the O*NET row.",
      "Event services coordination":
        "On-site event management and coordinating operations — the accommodation/equipment chain in course form.",
      "Provider evaluation & selection; contract negotiation":
        "The printed outcome reads 'evaluate the effectiveness of managing vendor relationships, contracts, and logistics' — supplier-side evaluation and negotiation craft.",
      "Facility inspection & conformity":
        "The venue module lists the critical factors to consider when selecting an event venue — the inspect-against-requirements sweep.",
      "Program, agenda, budget & services planning":
        "Comprehensive budget management and program planning per the printed second outcome — plan/budget/monitor with sponsors.",
      "Event-records keeping (incl. financials)":
        "Budget management and the event's financial trail — records of event aspects including financials per the O*NET row.",
      "Event monitoring, compliance & problem resolution":
        "The printed risk outcome — risk identification and contingency planning inside the corporate event-planning process.",
      "Post-event evaluation":
        "The printed outcome is literal — 'analyse the methods of event evaluation, including budget variance analysis and comprehensive event reports'.",
      "Administrative details & inquiries":
        "Budget/vendor/on-site coordination plus the event report covers the financial-admin and promo-dissemination admin legs; inquiry-handling itself has no dedicated lesson.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-events-alison-diploma",
    title: "Diploma in Events Management",
    provider: "Alison",
    type: "course",
    cost: "free",
    // full events-management arc incl. vendor, budgeting and on-the-day
    // coordination (10–15 h per its own page); CPD-accredited certificate optional
    // audit (2026-11-03, batch 3): fetched LIVE (outcomes: events types, venue
    // resources, event-space/parking management, safety policies, promotion
    // stages). taught/account. Picks up the marketing attach (the printed
    // "different stages of event promotion" outcome).
    url: "https://alison.com/course/diploma-in-events-management",
    durationHours: 12,
    skillsAddressed: ["Program, agenda, budget & services planning", "Event services coordination", "Marketing & publicizing support"],
    careerId: "events",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Marketing & publicizing support":
        "The printed outcome 'outline the different stages of event promotion' — promoting the event and structuring its media push.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-events-alison-fundamentals",
    title: "Fundamentals of Events Management",
    provider: "Alison",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 3): fetched LIVE — the page now prints the
    // course as "Basics of Events Management" (rename recorded, not silent).
    // Outcomes: planning process, organizing, staff delegation, post-event
    // activities, vendor/marketing/catering handling. taught/account.
    url: "https://alison.com/course/fundamentals-of-events-management",
    durationHours: 3,
    skillsAddressed: ["Participant registration", "Event services coordination"],
    careerId: "events",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Participant registration":
        "The printed 'describe how to organise an event' outcome carries the registration logistics leg; a dedicated registration-systems lesson has no taught page yet (see the software gap row).",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-events-gcf-excel",
    title: "Excel (Foundations) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    // registration lists, RSVP trackers, budget ledgers
    // audit (2026-11-03, batch 3): verified LearnFree lesson-series standing
    // (URL redirects onto the Excel Foundations series page, title verified).
    // taught/direct. Catalog fallback only.
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: ["Event-records keeping (incl. financials)"],
    careerId: "events",
    form: "taught",
    access: "direct",
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
    // audit (2026-11-03, batch 3): fetched LIVE again (title still empty via
    // CLI, as recorded; SPA site) → landing (association resource index).
    url: "https://www.mpi.org/",
    durationHours: 2,
    skillsAddressed: [],
    careerId: "events",
    form: "landing",
    access: "direct",
  },
  {
    id: "res-events-top-customer-centricity",
    title: "TOP — Customer Centricity (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 3): TOP Moodle module → account (login-wall
    // verified LIVE; title verified via the TOP search mirror).
    // Catalog fallback only (ADDR empty).
    url: "https://e-tesda.gov.ph/course/view.php?id=5043",
    durationHours: 2,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "events",
    form: "taught",
    access: "account",
  },
  {
    id: "res-events-top-writing",
    title: "TOP — Impactful Writing Skills (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 3): TOP Moodle module → account (id 5037
    // resolves via the TOP search mirror). taught/account.
    url: "https://e-tesda.gov.ph/course/view.php?id=5037",
    durationHours: 2,
    skillsAddressed: ["Communication · Professionalism · Teamwork (Enabling)"],
    creditingBody: "TESDA",
    careerId: "events",
    form: "taught",
    access: "account",
  },
  {
    id: "res-events-top-self-presentation",
    title: "TOP — Self-Presentation (Job Ready)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 3): TOP Moodle module → account (id 5038
    // resolves via the TOP search mirror). taught/account. The Enabling
    // winner (id A–Z over the writing module).
    url: "https://e-tesda.gov.ph/course/view.php?id=5038",
    durationHours: 2,
    skillsAddressed: ["Communication · Professionalism · Teamwork (Enabling)"],
    creditingBody: "TESDA",
    careerId: "events",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Communication · Professionalism · Teamwork (Enabling)":
        "The Job-Ready self-presentation module drills presenting well and teamwork with vendors and venue staff — the client/hotel coordination behavior.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-events-invoice-approval",
    title: "Procurement Workflow and Invoice Approval",
    provider: "Coursera (Professionals in the Industry)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-04 (Wave E per-role dup fill, user-delegated): the
    // bill-approval craft literally printed — "master the three-way match to
    // validate and approve invoices, ensuring alignment between purchase
    // orders, receipts, and bills"; forensic comparison for price/quantity/
    // item discrepancies; the approve/reject/escalate call and resolution
    // documentation. "Enroll for free" → audit; certificate paid.
    url: "https://www.coursera.org/learn/procurement-workflow-and-invoice-approval",
    durationHours: 2,
    skillsAddressed: ["Bills review & payment approval"],
    careerId: "events",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Bills review & payment approval":
        "The course teaches the three-way match — checking each bill against the PO and what actually arrived — and the approve/hold-to-escalate decision with the documented finance hand-off; the event's own budget-variance analysis still rides alison-corporate.",
    },
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
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
    // learn line — authored 2026-11-03, user-delegated
  },
  // ── acctclerk (4.2) — source-verbatim row names per V-acctclerk-3 ──
  // Wave B audit (2026-11-03, batch 3): access/form per-row, the taught
  // accounting rows carried from the book batch's verified claims (fresh URL
  // fetch per role this pass): ACCA-X pages RE-POINTED to edX's current
  // canonical paths (the old /course/... slugs 301 → /learn/bookkeeping|accounting/...;
  // titles verified "ACCA: Introduction to Bookkeeping") → taught/exam-paid;
  // TOP Bookkeeping NC III modules graded account (login-wall standing;
  // "Journalizing Transactions" title + description verified via the TOP
  // search mirror this pass); GCF Excel = the verified LearnFree lesson series
  // → taught/direct; Intuit basics graded taught/exam-paid (fetched LIVE
  // "Enroll for free", 8 modules from collect-and-journalize to statements);
  // CFI Basic Excel formulas graded taught/direct (open step-by-step lesson,
  // fetched LIVE); OpenStax financial book grades taught/direct (standing
  // OpenStax textbook verification — structured text + exercises open access);
  // DOLE handbook + RA 10173 = reference (fetched LIVE: PDF 200 via NWPC
  // mirror; statute title verified).
  // Wave E hunt (2026-11-04, user-delegated): the gov-forms cell fills —
  // Alison's "Filing Tax Returns Independently in the United States (US)"
  // (fetched LIVE 200: "Start Course Now", 3-4 h; outcomes teach the steps
  // in filing a tax return using relevant forms and schedules, the
  // form-and-schedule landscape by taxpayer category, and tax-document
  // record-keeping/retention) → taught/account; the non-PH framing is
  // scoped honestly in-row (the PH forms chain stays with the statute
  // anchors below; BIR eFPS deep pages remain dead-in-copy per the portal
  // ruling). The lawphil reference row keeps the cell's fallback pick (2 h
  // beats 4 h on the fallbackSort). Coverage: 10/10 vetted.
  {
    id: "res-acct-gcf-excel",
    title: "Excel (topic hub) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 3): verified LearnFree lesson-series standing
    // (URL redirects onto the Excel Foundations series page, title verified);
    // the hands-on series → taught/direct.
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: [
      "Check figures, postings, and documents for correct entry, mathematical accuracy, and proper codes",
      "Operate computers programmed with accounting software",
      "Reconcile or note and report discrepancies found in records",
       
    ],
    careerId: "acctclerk",
    pick: true,
    form: "taught",
    access: "direct",
  },
  {
    id: "res-acct-intuit-basics",
    title: "Bookkeeping basics (Intuit)",
    provider: "Coursera (Intuit)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 3): fetched LIVE "Enroll for free" (Intuit
    // Academy Team; 8 modules — collect-and-analyze, record and post, trial
    // balances, the four statements; "Tools you'll learn: Accounting
    // Software"). taught/exam-paid. The PSOC-envelope winner (id A–Z over
    // openstax).
    url: "https://www.coursera.org/learn/bookkeeping-basics",
    durationHours: 10,
    skillsAddressed: [
      "Check figures, postings, and documents for correct entry, mathematical accuracy, and proper codes",
      "Operate computers programmed with accounting software",
      "PSOC 4311 record-keeping envelope",
    ],
    careerId: "acctclerk",
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "PSOC 4311 record-keeping envelope":
        "Intuit's basics course walks the whole compute/record/verify envelope — the six-step accounting cycle from journal to the four statements.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-acct-acca-intro",
    title: "Introduction to Bookkeeping (ACCA-X on edX)",
    provider: "ACCA-X (edX)",
    type: "course",
    cost: "free",
    // double-entry + banking-system accuracy + reconciliation practice
    // audit + re-point (2026-11-03, batch 3): the old /course/introduction-to-
    // bookkeeping-2 slug 301s → the current canonical path (fetched LIVE, title
    // "ACCA: Introduction to Bookkeeping"). taught/exam-paid (ACCA-X free to
    // study; certificate paid). The checking/record/reconcile/cash winner
    // (tier-2 creditingBody).
    url: "https://www.edx.org/learn/bookkeeping/acca-introduction-to-bookkeeping",
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
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Check figures, postings, and documents for correct entry, mathematical accuracy, and proper codes":
        "ACCA's accredited intro drills double-entry against source documents — figures, postings and codes checked before anything journals.",
      "Classify, record, and summarize numerical and financial data to compile and keep financial records, using journals and ledgers or computers":
        "The journals-and-ledgers core of the course — classifying business transactions into record systems, taught to ACCA standards.",
      "Reconcile or note and report discrepancies found in records":
        "The banking-system and control modules reconcile records and surface discrepancies — month-end readiness as the O*NET row prints.",
      "Receive, record, and bank cash, checks, and vouchers (petty cash / collections recording)":
        "Cash, cheque and voucher recording is taught inside ACCA's banking chapter — the petty-cash/collections accounting leg.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-acct-acca-intermediate",
    title: "Intermediate Bookkeeping (ACCA-X on edX)",
    provider: "ACCA-X (edX)",
    type: "course",
    cost: "free",
    // audit + re-point (2026-11-03, batch 3): old /course/intermediate-...
    // slug 301s → the current canonical path (fetched LIVE, title "ACCA:
    // Intermediate Bookkeeping"). taught/exam-paid. The statements/bills
    // winner (only claim).
    url: "https://www.edx.org/learn/bookkeeping/acca-intermediate-bookkeeping",
    durationHours: 30,
    skillsAddressed: ["Prepare and issue account statements / bills / invoices"],
    creditingBody: "ACCA-X",
    careerId: "acctclerk",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Prepare and issue account statements / bills / invoices":
        "ACCA's intermediate level teaches control accounts and the statement/invoice cycle the AP-AR seat runs.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-acct-cfi-basic-excel",
    title: "Basic Excel Formulas for Beginners (CFI free resource)",
    provider: "Corporate Finance Institute",
    type: "doc",
    cost: "free",
    // free formula reference aligned to finance work; English-only
    // audit (2026-11-03, batch 3): fetched LIVE — the full step-by-step lesson
    // is open at the URL (operators, cell references, the 7 formula walkthroughs).
    // taught/direct. The spreadsheet-side winner for the accounting-software
    // cell (QuickBooks craft rides the Intuit row below).
    url: "https://corporatefinanceinstitute.com/resources/excel/basic-excel-formulas-beginners/",
    durationHours: 2,
    skillsAddressed: ["Operate computers programmed with accounting software"],
    careerId: "acctclerk",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Operate computers programmed with accounting software":
        "CFI's beginner formulas lesson drills the spreadsheet workhorse — SUM/AVERAGE/IF operators and cell reference discipline — the compute-accurate-records leg; QuickBooks itself rides the Intuit row.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-acct-openstax-financial",
    title: "Principles of Accounting, Volume 1: Financial Accounting (OpenStax)",
    provider: "OpenStax (free textbook)",
    type: "doc",
    cost: "free",
    // audit (2026-11-03, batch 3): standing OpenStax textbook verification
    // (batch-1 fixture note: structured text + exercises, open access; URL
    // 200 this pass, SPA shell). taught/direct. Catalog fallback only.
    url: "https://openstax.org/details/books/principles-financial-accounting",
    durationHours: 6,
    skillsAddressed: [
      "Classify, record, and summarize numerical and financial data to compile and keep financial records, using journals and ledgers or computers",
      "PSOC 4311 record-keeping envelope",
    ],
    careerId: "acctclerk",
    pick: true,
    form: "taught",
    access: "direct",
  },
  {
    id: "res-acct-top-journalizing",
    title: "Journalizing Transactions (TOP Bookkeeping NC III module)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // audit (2026-11-03, batch 3): TOP Moodle module → account (login-wall
    // verified LIVE this pass; title + syllabus verified via the TOP search
    // mirror — "logging/recording business transactions in an accounting
    // journal"). taught/account. The journalize/post winner (entry path counts).
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
    form: "taught",
    access: "account",
    learnNotes: {
      "Journalize/post transactions (bookkeeping cycle)":
        "The official NC III module: logging business transactions in the accounting journal with best-practice procedures — close-cycle support on the bookkeeping loop.",
      "Classify, record, and summarize numerical and financial data to compile and keep financial records, using journals and ledgers or computers":
        "Journalizing IS the classify-and-record loop for the clerk seat — source documents sorted into journal entries per TESDA's NC III unit.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-acct-top-posting",
    title: "Posting Transactions (TOP Bookkeeping NC III module)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // audit (2026-11-03, batch 3): TOP Moodle module → account (title resolved
    // via the TOP search mirror; the book-batch "module pages redirect to the
    // TOP login" verdict stands). Catalog fallback only.
    url: "https://e-tesda.gov.ph/course/view.php?id=3983",
    durationHours: 4,
    skillsAddressed: [
      "Classify, record, and summarize numerical and financial data to compile and keep financial records, using journals and ledgers or computers",
      "Journalize/post transactions (bookkeeping cycle)",
    ],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "acctclerk",
    form: "taught",
    access: "account",
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
    // audit (2026-11-03, batch 3): PDF fetched reachable (200, 1.4 MB). A
    // readable computation handbook → reference (no teaching flow).
    url: "https://nwpc.dole.gov.ph/wp-content/uploads/2024/11/Workers-Statutory-Monetary-Benefits-Handbook-2024-Edition.pdf",
    durationHours: 3,
    skillsAddressed: ["Government forms & compliance paperwork"],
    careerId: "acctclerk",
    form: "reference",
    access: "direct",
  },
  {
    id: "res-acct-ra10173",
    title: "Republic Act No. 10173 (Data Privacy Act of 2012)",
    provider: "Lawphil Project",
    type: "doc",
    cost: "free",
    // privacy.gov.ph 403 this session — cite the official register when reachable
    // audit (2026-11-03, batch 3): statute text = reference (fetched LIVE,
    // title verified).
    url: "https://lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html",
    durationHours: 2,
    skillsAddressed: ["Government forms & compliance paperwork"],
    careerId: "acctclerk",
    pick: true,
    form: "reference",
    access: "direct",
  },
  {
    id: "res-acct-top-workplace-comms",
    title: "Participating in Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 3): TOP Moodle module → account (id 56 resolves
    // via the TOP search mirror). Catalog fallback only.
    url: "https://e-tesda.gov.ph/course/view.php?id=56",
    durationHours: 2,
    skillsAddressed: ["Communication · Professionalism · Critical Thinking (Enabling)"],
    creditingBody: "TESDA",
    careerId: "acctclerk",
    form: "taught",
    access: "account",
  },
  {
    id: "res-acct-top-receiving-comms",
    title: "Receiving and Responding to Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 3): TOP Moodle module → account (id 52 resolves
    // via the TOP search mirror). taught/account. The Enabling winner (id A–Z).
    url: "https://e-tesda.gov.ph/course/view.php?id=52",
    durationHours: 2,
    skillsAddressed: ["Communication · Professionalism · Critical Thinking (Enabling)"],
    creditingBody: "TESDA",
    careerId: "acctclerk",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Communication · Professionalism · Critical Thinking (Enabling)":
        "TESDA's workplace-communication module: receive, respond, relay — the original-document discipline's daily practice.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-acct-us-tax-filing",
    title: "Filing Tax Returns Independently in the United States (US)",
    provider: "Alison",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-04 (Wave E fill, user-delegated): "Start Course
    // Now", 3-4 h, CPD-accredited — outcomes teach the steps in filing a tax
    // return using relevant forms and schedules, the forms-and-schedules
    // landscape by taxpayer category, filing-prep record-keeping and
    // retention periods, and estimated-tax payments. The government-forms
    // paperwork craft in taught form; US framing scoped honestly — the PH
    // statutory forms chain (BIR eFPS deep pages remain dead-in-copy per
    // the portal ruling) stays with the RA 10173 / DOLE reference anchors
    // above. Certificate optional (paid); study free/account.
    url: "https://alison.com/course/filing-tax-returns-independently-in-the-united-states-us",
    durationHours: 4,
    skillsAddressed: ["Government forms & compliance paperwork"],
    careerId: "acctclerk",
    form: "taught",
    access: "account",
    learnNotes: {
      "Government forms & compliance paperwork":
        "The course drills the filing workflow itself — assembling records, choosing the right tax forms and schedules per taxpayer category, and stepping through a submission with record-retention in mind; the PH-specific forms ride the statute anchors in the same pool (honest non-PH scoping).",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  // ── pay (4.3) — portals = labeled start-here placeholders (ruling) ──
  // Wave B audit (2026-11-03, batch 3): access/form per-row. ADP's taught
  // "The Payroll Cycle" course arrives as the per-role fill (fetched LIVE
  // "Enroll for free" — step-by-step cycle: collect/validate, calculate pay,
  // manage deductions, process and report; timekeeping, employee-leave types,
  // year-end, audits & reconciliation, payroll-data security) — the payroll-loop
  // craft; the US withholding context is scoped honestly in-row while the PH
  // statutory tables ride the DOLE handbook + portals. Portals graded landing
  // (Pag-IBIG sits behind a reCAPTCHA interstitial this pass — recorded); DOLE
  // handbook + RA 10173 = reference. GCF Excel graded taught/direct
  // (LearnFree standing). TOP modules graded account.
  // Wave E hunt (2026-11-04, user-delegated): the statutory-returns cell
  // fills — ADP's "Advancing Proficiency in U.S. Payroll Fundamentals"
  // (fetched LIVE "Enroll for free": Modules Getting to Net Pay / Employer
  // Payroll Taxes / **Deposits and Filings** — the module walks the regular
  // federal deposits, the filing timeline and the forms needed to manage
  // tax filings properly) → taught/exam-paid per the ADP family pack (the
  // PH statutory tables still ride the DOLE handbook + BIR portal anchors
  // in the same pool). The BIR landing row keeps the cell's fallback pick
  // (1 h beats 10 h). Coverage: 9/9 vetted.
  {
    id: "res-pay-dole-handbook",
    title: "Workers' Statutory Monetary Benefits Handbook 2024 (DOLE-BWC, official NWPC mirror)",
    provider: "DOLE-Bureau of Working Conditions (hosted by DOLE-NWPC)",
    type: "doc",
    cost: "free",
    // official free handbook covering holiday/premium/NSD/13th-month
    // computation; check for a newer edition each year
    // audit (2026-11-03, batch 3): PDF reachable again (200 via NWPC mirror,
    // 1.4 MB). Readable computation handbook → reference (fail-closed;
    // no teaching flow).
    url: "https://nwpc.dole.gov.ph/wp-content/uploads/2024/11/Workers-Statutory-Monetary-Benefits-Handbook-2024-Edition.pdf",
    durationHours: 3,
    skillsAddressed: [
      "Verify attendance, hours worked, and pay adjustments, and post information onto designated records",
      "Compute wages and deductions, and enter data into computers",
      "Keep leave records",
    ],
    careerId: "pay",
    pick: true,
    form: "reference",
    access: "direct",
  },
  {
    id: "res-pay-adp-payroll-cycle",
    title: "The Payroll Cycle (ADP Entry-Level Payroll Specialist)",
    provider: "Coursera (ADP Learning Academy)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 3 fill, user-ruled): ADP's taught
    // payroll-cycle course ("Enroll for free", 3 modules — the step-by-step
    // cycle from collecting/validating employee data through calculating pay,
    // managing deductions, processing payroll and reporting; timekeeping,
    // employee-leave types, year-end, audits & reconciliation, payroll-data
    // security). The loop mechanics in taught form; the US withholding context
    // is scoped honestly — the PH statutory tables ride the DOLE handbook in
    // the same pool. ₱ paid tier: certificate.
    url: "https://www.coursera.org/learn/adp-the-payroll-cycle",
    durationHours: 12,
    skillsAddressed: [
      "Verify attendance, hours worked, and pay adjustments, and post information onto designated records",
      "Compute wages and deductions, and enter data into computers",
      "Prepare and balance period-end reports, and reconcile issued payrolls to bank statements",
      "Process and issue employee paychecks and statements of earnings and deductions",
      "Keep leave records",
      "Records hygiene & confidentiality (RA 10173 context)",
    ],
    creditingBody: "ADP Learning Academy",
    careerId: "pay",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Verify attendance, hours worked, and pay adjustments, and post information onto designated records":
        "The timekeeping module records/manages employee work minutes and the cycle teaches validating data before posting — the source-of-truth loop (PSOC e verbatim).",
      "Compute wages and deductions, and enter data into computers":
        "The step-by-step cycle runs calculate-pay and manage-deductions with data entry — the gross→net loop; the PH premium tables legitimately ride the DOLE handbook (same pool).",
      "Prepare and balance period-end reports, and reconcile issued payrolls to bank statements":
        "The dedicated audits-and-reconciliation module plus common payroll reports — the period-end/bank match.",
      "Process and issue employee paychecks and statements of earnings and deductions":
        "Getting-Paid plus the finalization phase walks pay-out and earnings/deductions statement issuance.",
      "Keep leave records":
        "The employee-leave-types module and the design-a-bonus-policy project cover leave tracking (SL/VL and statutory leave context).",
      "Records hygiene & confidentiality (RA 10173 context)":
        "The payroll-data-security lesson teaches the PII discipline the RA 10173 context row asks for.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-pay-sss",
    title: "SSS — Official portal — start here for SSS contribution context (deep contribution-table pages unplaced/unreachable)",
    provider: "Social Security System (PH regulator)",
    type: "doc",
    cost: "free",
    // keep-with-flag ruling 2026-10-29: portals stand only as labeled
    // start-here placeholders; deep-link when reachable
    // audit (2026-11-03, batch 3): fetched LIVE (title verified) → landing
    // (the labeled start-here placeholder).
    url: "https://www.sss.gov.ph/",
    durationHours: 1,
    skillsAddressed: ["Compute wages and deductions, and enter data into computers"],
    careerId: "pay",
    form: "landing",
    access: "direct",
  },
  {
    id: "res-pay-philhealth",
    title: "PhilHealth — Official portal — start here for statutory health-contribution context (deep pages unplaced/unreachable)",
    provider: "PhilHealth (PH regulator)",
    type: "doc",
    cost: "free",
    // audit (2026-11-03, batch 3): fetched LIVE (title verified) → landing.
    url: "https://www.philhealth.gov.ph/",
    durationHours: 1,
    skillsAddressed: ["Compute wages and deductions, and enter data into computers"],
    careerId: "pay",
    form: "landing",
    access: "direct",
  },
  {
    id: "res-pay-pagibig",
    title: "Pag-IBIG (HDMF) — Official portal — start here for statutory savings-contribution context (deep pages unplaced/unreachable)",
    provider: "Home Development Mutual Fund (PH regulator)",
    type: "doc",
    cost: "free",
    // audit (2026-11-03, batch 3): fetched LIVE — the site serves a reCAPTCHA
    // interstitial to scripted fetches this pass (recorded, not silent);
    // portal placeholder standing → landing (keep-with-flag).
    url: "https://www.pagibigfund.gov.ph/",
    durationHours: 1,
    skillsAddressed: ["Compute wages and deductions, and enter data into computers"],
    careerId: "pay",
    pick: true,
    form: "landing",
    access: "direct",
  },
  {
    id: "res-pay-gcf-excel",
    title: "Excel (topic hub) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 3): verified LearnFree lesson-series standing
    // (URL redirects onto the Excel Foundations series page, title verified).
    // taught/direct. Catalog fallback only.
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: [
      "Verify attendance, hours worked, and pay adjustments, and post information onto designated records",
      "Prepare and balance period-end reports, and reconcile issued payrolls to bank statements",
      "Keep leave records",
    ],
    careerId: "pay",
    pick: true,
    form: "taught",
    access: "direct",
  },
  {
    id: "res-pay-acca-intro",
    title: "Introduction to Bookkeeping (ACCA-X on edX)",
    provider: "ACCA-X (edX)",
    type: "course",
    cost: "free",
    // covers "payroll and ledger accounts"
    // audit + re-point (2026-11-03, batch 3): canonical edX path (301 verified;
    // title standing). Catalog fallback only (ADDR empty per §6.1).
    url: "https://www.edx.org/learn/bookkeeping/acca-introduction-to-bookkeeping",
    durationHours: 30,
    skillsAddressed: [],
    creditingBody: "ACCA-X",
    careerId: "pay",
    form: "taught",
    access: "exam-paid",
  },
  {
    id: "res-pay-intuit-basics",
    title: "Bookkeeping basics (Intuit)",
    provider: "Coursera (Intuit)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 3): same verified Enroll-for-free standing as
    // the acctclerk dup. Catalog fallback only (ADDR empty per §6.1).
    url: "https://www.coursera.org/learn/bookkeeping-basics",
    durationHours: 10,
    skillsAddressed: [],
    careerId: "pay",
    form: "taught",
    access: "exam-paid",
  },
  {
    id: "res-pay-bir",
    title: "BIR — Official portal — start here for withholding-tax and return-filing registration (eFPS tutorial pages dead-in-copy while unreachable; do not cite eFPS tutorial pages)",
    provider: "Bureau of Internal Revenue (PH regulator)",
    type: "doc",
    cost: "free",
    // eFPS deep/tutorial pages unreachable (transport error) — dead-in-copy
    // flag stands until a working official eFPS page verifies (V-pay-4)
    // audit (2026-11-03, batch 3): fetched LIVE (title verified) → landing
    // (labeled start-here placeholder; eFPS ruling stands).
    url: "https://www.bir.gov.ph/",
    durationHours: 1,
    skillsAddressed: ["Prepare and file payroll tax returns / statutory paperwork"],
    careerId: "pay",
    pick: true,
    form: "landing",
    access: "direct",
  },
  {
    id: "res-pay-ra10173",
    title: "Republic Act No. 10173 (Data Privacy Act of 2012)",
    provider: "Lawphil Project",
    type: "doc",
    cost: "free",
    // audit (2026-11-03, batch 3): statute text = reference (fetched LIVE,
    // title verified).
    url: "https://lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html",
    durationHours: 2,
    skillsAddressed: [
      "Prepare and file payroll tax returns / statutory paperwork",
      "Records hygiene & confidentiality (RA 10173 context)",
    ],
    careerId: "pay",
    pick: true,
    form: "reference",
    access: "direct",
  },
  {
    id: "res-pay-top-receiving-comms",
    title: "Receiving and Responding to Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 3): TOP Moodle module → account (id 52 resolves
    // via the TOP search mirror). taught/account. The employee-facing-service
    // winner (id A–Z over the participated module).
    url: "https://e-tesda.gov.ph/course/view.php?id=52",
    durationHours: 2,
    skillsAddressed: ["Provide information to employees and managers on payroll matters, tax issues, benefit plans, and collective agreement provisions"],
    creditingBody: "TESDA",
    careerId: "pay",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Provide information to employees and managers on payroll matters, tax issues, benefit plans, and collective agreement provisions":
        "Receiving/answering workplace communication inquiries is the employee-facing-service craft the row names.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-pay-top-workplace-comms",
    title: "Participating in Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 3): TOP Moodle module → account (id 56 resolves
    // via the TOP search mirror). taught/account. The Enabling winner (only vetted
    // claim — the digital-literacy category page grades landing).
    url: "https://e-tesda.gov.ph/course/view.php?id=56",
    durationHours: 2,
    skillsAddressed: [
      "Provide information to employees and managers on payroll matters, tax issues, benefit plans, and collective agreement provisions",
      "Communication · Professionalism (Enabling)",
    ],
    creditingBody: "TESDA",
    careerId: "pay",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Communication · Professionalism (Enabling)":
        "TESDA's workplace-communication module is the employee-facing behavior layer: participating, responding, relaying.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-pay-adp-us-payroll-fundamentals",
    title: "Advancing Proficiency in U.S. Payroll Fundamentals (ADP)",
    provider: "Coursera (ADP Learning Academy)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-04 (Wave E fill, user-delegated): "Enroll for
    // free" — 3 modules (Getting to Net Pay; Employer Payroll Taxes; the
    // Deposits-and-Filings module: "the responsibilities of an employer in
    // regards to regular federal deposits and filings... the typical
    // timeline and forms needed to properly manage tax filings"). The
    // return-prep/filing craft the cell prints, US-framed and scoped
    // honestly — the PH statutory tables (BIR eFPS deep pages stay
    // dead-in-copy per the portal ruling) ride the DOLE handbook + BIR
    // portal anchors in the same pool. ₱ paid tier: certificate.
    url: "https://www.coursera.org/learn/adp-advancing-proficiency-in-us-payroll-fundamentals",
    durationHours: 10,
    skillsAddressed: ["Prepare and file payroll tax returns / statutory paperwork"],
    careerId: "pay",
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Prepare and file payroll tax returns / statutory paperwork":
        "Module 2 covers employer payroll taxes and withholding, and Module 3 (Deposits and Filings) walks the regular deposit schedule, the filing timeline and the forms — the statutory-paperwork prep-and-file loop; the PH tables ride the DOLE handbook (honest non-PH scoping).",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  // ── fas (4.4) — [PSF] PSF-GIH primary ──
  // Wave B audit (2026-11-03, batch 3): access/form per-row. Wharton financial
  // accounting graded taught/exam-paid (fetched LIVE "Enroll for free" —
  // balance-sheet/debit-credit weeks, ratio-analysis week 4). ACCA-X rows
  // RE-POINTED to edX canonical paths (301 verified) → taught/exam-paid. GCF
  // Excel + OpenStax books graded per the standing family verifications
  // (taught/direct). CFI's two resource gates graded reference/account
  // (fetched LIVE: both are gated "Download now" ebook pages; only
  // Basic-Excel formulas is an open step-by-step lesson → taught/direct). Two
  // §6.1-class misfit claims CUT: finance-fundamentals no longer claims the
  // ratio-analysis cell (its printed outcomes are NPV/valuation; the ratio
  // craft rides OpenStax), and CFI Basic Excel no longer claims the
  // draw-charts cell (formulas ≠ charts) — both ADDR cuts listed in the
  // commit body. Two taught fills (fetched LIVE "Enroll for free",
  // user-ruled): UIUC's Foundations of Strategic Internal Auditing (COSO
  // control evaluation, evidence, control weaknesses) carries Internal
  // Controls; University of Cambridge's Finance for Non-finance
  // Professionals (budgets & proposals, budget-variance reporting, the
  // Modelling-essentials module) carries Support strategic planning.
  // Wave E hunt (2026-11-04, user-delegated): Diversity Awareness and
  // Management fills — Alison's "Creating a Diverse and Inclusive Workplace
  // Culture" (fetched LIVE 200: "Start Course Now", 1.5-3 h, CPD-accredited;
  // printed outcomes define workplace diversity/equity/inclusiveness,
  // evaluate workplace culture with respect to DEI, and drill overcoming
  // unconscious bias incl. its gender-bias effects) → taught/account; the
  // batch-2 searched verdict is superseded by this live-verified taught
  // page. Coverage: 10/10 vetted.
  {
    id: "res-fas-psf-gih-doc",
    title: "Philippine Skills Framework for Global In-House Center (official PDF)",
    provider: "TESDA",
    type: "doc",
    cost: "free",
    // THE official government framework document for this role — students
    // can read the F&A Agent/Associate map itself (printed pp.92–93)
    // audit (2026-11-03, batch 3): TESDA PDF → reference (standing;
    // ADDR empty per §6.1).
    url: "https://www.tesda.gov.ph/Uploads/File/Philippine%20Skills%20Framework/ICT/Philippine%20Skills%20Framework%20for%20Global%20In-House%20Center.pdf",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "fas",
    form: "reference",
    access: "direct",
  },
  {
    id: "res-fas-wharton-accounting",
    title: "Introduction to Financial Accounting (Wharton)",
    provider: "Coursera (University of Pennsylvania)",
    type: "course",
    cost: "free",
    // V-fas-5: confirm the fetched page reads "Introduction to Financial
    // Accounting" before final citation; enroll-for-free/audit route per family page
    // audit (2026-11-03, batch 3): fetched LIVE "Enroll for free" — title
    // prints "Introduction to Financial Accounting" (Bushee; 4 weeks: balance
    // sheet/debit-credit, accrual, cash flows, ratio analysis). taught/exam-paid.
    url: "https://www.coursera.org/learn/wharton-accounting",
    durationHours: 15,
    skillsAddressed: [
      "Perform financial accounting and corporate reporting activities",
      "Process business transactions and reports using information technology tools",
       
    ],
    careerId: "fas",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Perform financial accounting and corporate reporting activities":
        "Bushee's course runs recording-to-closing to the three statements with worked cases — month-end support and double-entry processing as the printed CWF lists.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-fas-gcf-excel",
    title: "Excel (topic hub) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 3): verified LearnFree lesson-series standing
    // (URL redirects onto the Excel Foundations series page, title verified).
    // taught/direct — the transaction-processing winner (id A–Z over the
    // Wharton shared claim; the tooling leg of the IT-systems FSC).
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: [
      "Process business transactions and reports using information technology tools",
      "Data Collection and Analysis",
    ],
    careerId: "fas",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Process business transactions and reports using information technology tools":
        "Excel Foundations drills entering, structuring and computing records in workbooks — the tooling leg of the IT-processing FSC; the accounting-system leg rides the Wharton course below.",
      "Data Collection and Analysis":
        "Collecting entries into sortable, analyzable sheets is taught hands-on in the series.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-fas-acca-intro",
    title: "Introduction to Bookkeeping (ACCA-X on edX)",
    provider: "ACCA-X (edX)",
    type: "course",
    cost: "free",
    // bookkeeping + ledger systems — "input/operate" descriptors
    // audit + re-point (2026-11-03, batch 3): canonical edX path (301 verified,
    // title standing). taught/exam-paid. The shared Accounting-and-Tax cell's
    // A–Z tie resolves to the intermediate row (learn line there).
    url: "https://www.edx.org/learn/bookkeeping/acca-introduction-to-bookkeeping",
    durationHours: 30,
    skillsAddressed: ["Accounting and Tax Systems"],
    creditingBody: "ACCA-X",
    careerId: "fas",
    form: "taught",
    access: "exam-paid",
  },
  {
    id: "res-fas-acca-intermediate",
    title: "Intermediate Bookkeeping (ACCA-X on edX)",
    provider: "ACCA-X (edX)",
    type: "course",
    cost: "free",
    // audit + re-point (2026-11-03, batch 3): canonical edX path (301 verified).
    // taught/exam-paid — the Accounting-and-Tax-Systems winner: the A–Z tie
    // over the intro row resolves to "intermediate" ("inte" < "intr").
    url: "https://www.edx.org/learn/bookkeeping/acca-intermediate-bookkeeping",
    durationHours: 30,
    skillsAddressed: ["Accounting and Tax Systems"],
    creditingBody: "ACCA-X",
    careerId: "fas",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Accounting and Tax Systems":
        "Inputting and operating the ledger systems at ACCA standards — the systems-side FSC taught through ACCA's bookkeeping core.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-fas-cfi-basic-excel",
    title: "Basic Excel Formulas for Beginners (CFI free resource)",
    provider: "Corporate Finance Institute",
    type: "doc",
    cost: "free",
    // audit (2026-11-03, batch 3): fetched LIVE — the open step-by-step
    // lesson (the ADDR Draw-charts claim CUT per §6.1: formulas teach)
    // taught/direct. The data-collection winner (id A–Z over GCF).
    url: "https://corporatefinanceinstitute.com/resources/excel/basic-excel-formulas-beginners/",
    durationHours: 2,
    skillsAddressed: ["Data Collection and Analysis"],
    careerId: "fas",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Data Collection and Analysis":
        "Structured data entry with SUM/AVERAGE/IF operators and reference discipline — collecting into analysis-ready sheets at analyst standards.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-fas-cfi-ratios",
    title: "Financial Ratios Definitive Guide (CFI free resource)",
    provider: "Corporate Finance Institute",
    type: "doc",
    cost: "free",
    // straight at the printed ratio verb; English-only
    // audit (2026-11-03, batch 3): fetched LIVE — the page prints the guide's
    // contents but the ebook itself rides a gated download → reference (no
    // open teaching flow at the URL).
    url: "https://corporatefinanceinstitute.com/resources/accounting/financial-ratios-definitive-guide/",
    durationHours: 3,
    skillsAddressed: ["Financial Analysis"],
    careerId: "fas",
    pick: true,
    form: "reference",
    access: "account",
  },
  {
    id: "res-fas-openstax-finance",
    title: "Principles of Finance (OpenStax)",
    provider: "OpenStax (free textbook)",
    type: "doc",
    cost: "free",
    // ratio analysis and financial-statement interpretation chapters
    // audit (2026-11-03, batch 3): standing OpenStax textbook verification
    // (structured text + exercises, open access; URL 200, SPA shell).
    // taught/direct — the Financial-Analysis winner after the finance-
    // fundamentals misfit claim cut (OpenStax genuinely teaches ratios).
    url: "https://openstax.org/details/books/principles-finance",
    durationHours: 6,
    skillsAddressed: ["Financial Analysis"],
    careerId: "fas",
    form: "taught",
    access: "direct",
    learnNotes: {
      "Financial Analysis":
        "The financial-statement-analysis chapters teach ratio analysis on statements for insights — the printed L3 verb at entry rung, in a free textbook with exercises.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-fas-finance-fundamentals",
    title: "Fundamentals of Finance (Wharton)",
    provider: "Coursera (University of Pennsylvania)",
    type: "course",
    cost: "free",
    // free-route starter on financial decision basics
    // audit (2026-11-03, batch 3): fetched LIVE "Enroll for free" — NPV,
    // bonds/yield curve, equity valuation, IRR, capital-budgeting-in-practice
    // readings. taught/exam-paid. The Financial-Analysis claim CUT per §6.1
    // (the course prints no ratio module; the ratio craft rides the OpenStax
    // book).
    url: "https://www.coursera.org/learn/finance-fundamentals",
    durationHours: 10,
    skillsAddressed: [],
    careerId: "fas",
    form: "taught",
    access: "exam-paid",
  },
  {
    id: "res-fas-openstax-managerial",
    title: "Principles of Accounting, Volume 2: Managerial Accounting (OpenStax)",
    provider: "OpenStax (free textbook)",
    type: "doc",
    cost: "free",
    // audit (2026-11-03, batch 3): the book pool's reference verdict stands
    // (readable chapter context at this URL shape; the same-shape financial
    // book grades taught by standing). Reference. Honest red for Internal
    // Controls: the COSO-style control-evaluation craft rides the new UIUC
    // internal-auditing row.
    url: "https://openstax.org/details/books/principles-managerial-accounting",
    durationHours: 6,
    skillsAddressed: ["Internal Controls"],
    careerId: "fas",
    pick: true,
    form: "reference",
    access: "direct",
  },
  {
    id: "res-fas-uiuc-internal-audit",
    title: "Foundations of Strategic Internal Auditing (U Illinois Gies)",
    provider: "Coursera (University of Illinois)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 3 fill, user-ruled): "Enroll for
    // free" — 4 modules; "apply frameworks such as COSO to evaluate
    // controls", evidence gathering that reveals "control weaknesses", plus
    // audit reporting. The control-effectiveness craft the Internal-Controls
    // FSC prints. ₱ paid tier: certificate.
    url: "https://www.coursera.org/learn/strategic-internal-auditing-foundations",
    durationHours: 13,
    skillsAddressed: ["Internal Controls"],
    careerId: "fas",
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Internal Controls":
        "The COSO framework modules teach evaluating control effectiveness and surfacing control weaknesses — exactly the FSC's evaluate/spot-gaps pair.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-fas-cambridge-finance",
    title: "Finance for Non-finance Professionals (U Cambridge)",
    provider: "Coursera (University of Cambridge)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 3 fill, user-ruled): "Enroll
    // now" + financial aid — 5 modules: budgets & investment proposals
    // (payback/NPV/IRR), reporting against budgets with variance analysis and
    // reforecasting, the Modelling-essentials module (model design,
    // workbook structure, workflow, visualization, commentary). The
    // budgeting/forecasting-assistance craft the Support-strategic-planning
    // CWF prints. ₱ paid tier: certificate.
    url: "https://www.coursera.org/learn/finance-for-non-finance-professionals",
    durationHours: 31,
    skillsAddressed: ["Support strategic planning"],
    careerId: "fas",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Support strategic planning":
        "The budgets-and-proposals module runs NPV/IRR/payback decision frameworks and the variance-reporting module runs reforecasting — the budgeting/forecasting-assistance leg; the P&L-analysis leg rides the Wharton accounting course.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-fas-top-workplace-comms",
    title: "Participating in Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // diversity thinness is honestly recorded — this is the workplace-conduct
    // foundation the Diversity row leans on
    // audit (2026-11-03, batch 3): TOP Moodle module → account (id 56
    // resolves via the TOP search mirror). Catalog fallback only (ADDR empty).
    url: "https://e-tesda.gov.ph/course/view.php?id=56",
    durationHours: 2,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "fas",
    form: "taught",
    access: "account",
  },
  {
    id: "res-fas-top-receiving-comms",
    title: "Receiving and Responding to Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 3): TOP Moodle module → account (id 52
    // resolves via the TOP search mirror). taught/account. The Enabling winner
    // (only vetted claim — the digital-literacy category grades landing).
    url: "https://e-tesda.gov.ph/course/view.php?id=52",
    durationHours: 2,
    skillsAddressed: ["Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Sense Making · Transdisciplinary Thinking (Enabling, B/I)"],
    creditingBody: "TESDA",
    careerId: "fas",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Sense Making · Transdisciplinary Thinking (Enabling, B/I)":
        "TESDA's workplace-communication module: receive, respond, relay — the enabling strip's daily practice at the shared-service seat.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-fas-intuit-basics",
    title: "Bookkeeping basics (Intuit)",
    provider: "Coursera (Intuit)",
    type: "course",
    cost: "free",
    // GL/journal-entry cycle practice (O*NET corroboration block backing)
    // audit (2026-11-03, batch 3): same verified Enroll-for-free standing as
    // the acctclerk dup. taught/exam-paid — the O*NET-corroboration winner
    // (the CFI FP&A ebook grades reference).
    url: "https://www.coursera.org/learn/bookkeeping-basics",
    durationHours: 10,
    skillsAddressed: ["O*NET corroboration block (operating-the-GL-engine tasks)"],
    careerId: "fas",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "O*NET corroboration block (operating-the-GL-engine tasks)":
        "Intuit's cycle modules — collect, record, post, balance and report — are the operating-the-GL tasks the O*NET block quotes.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  // Fas taught fills note — the rows above (UIUC internal-auditing, Cambridge
  // finance) carry the Strategic-planning and Internal-Controls cells.
  {
    id: "res-fas-alison-dei",
    title: "Creating a Diverse and Inclusive Workplace Culture (Alison)",
    provider: "Alison",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-04 (Wave E fill, user-delegated): "Start Course
    // Now", 1.5-3 h (Contains Video), CPD-accredited, beginner level —
    // printed outcomes define workplace diversity/equity/inclusiveness,
    // evaluate workplace culture with respect to diversity/equity/
    // inclusiveness, and drill overcoming unconscious bias (incl. its
    // gender-bias effects) plus inclusive team meetings. Certificate
    // optional (paid); study free/account.
    url: "https://alison.com/course/creating-a-diverse-and-inclusive-workplace-culture",
    durationHours: 3,
    skillsAddressed: ["Diversity Awareness and Management"],
    careerId: "fas",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Diversity Awareness and Management":
        "The course runs the DEI awareness loop on workplace culture — defining diversity/equity/inclusiveness, evaluating the culture against them, and drilling the unconscious-bias (incl. gender-bias) and inclusive-meeting behaviors.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  // ── fin (4.5) ──
  // Wave B audit (2026-11-03, batch 3): per-row. OpenStax Principles of
  // Finance grades taught/direct (standing textbook verification; the
  // valuation/risk/claims it carried were re-checked against the book's
  // printed chapters). Wharton Finance Fundamentals graded taught/exam-paid
  // (fetched LIVE "Enroll for free" — NPV, bonds/yield curve, equity
  // valuation, IRR). MIT 15.401 grades taught/direct (fetched LIVE, title
  // verified). CFI's three gated ebook pages graded reference/account
  // (fetched LIVE: Financial Modeling Guidelines + Ratios Guide + FP&A
  // guide are all "Download now" flows); CFI Basic Excel grades
  // taught/direct but its Draw-charts claim is CUT per §6.1 (formulas ≠
  // charts — the claim mischarted the lesson). One §6.1-class ADDR cut,
  // listed in the commit body. Cambridge's Finance for Non-finance
  // Professionals (fetched LIVE "Enroll now"; its Modelling-essentials
  // module teaches model design, workbook structure, workflow,
  // visualization and commentary) is the per-role fill for the finance-
  // model-design cell. TOP module + Wharton accounting graded per standing.
  // Wave E hunt (2026-11-04, user-delegated): two cells fill — EDUCBA's
  // "Equity Investments and Valuation Strategies" (fetched LIVE on the
  // Coursera audit route: "Enroll for free", 5 modules; the equity-valuation
  // module teaches estimating intrinsic value, comparing investment
  // opportunities and building valuation-driven strategies to make informed
  // investment decisions) carries Recommend-investments; Alison's
  // "Introduction to Supervision" (fetched LIVE 200: "Start Course Now",
  // 1.5-3 h, CPD-accredited; outcomes list the responsibilities of a
  // supervisor, delegating successfully, motivating subordinates and the
  // coaching-vs-mentoring split) carries Supervise/train/mentor — the taught
  // craft behind the O*NET row (the entry path carries the skill before the
  // supervising seat). Coverage: 10/10 vetted.
  {
    id: "res-fin-openstax-finance",
    title: "Principles of Finance (OpenStax)",
    provider: "OpenStax (free textbook)",
    type: "doc",
    cost: "free",
    // valuation, risk, markets + capital-budgeting chapters
    // audit (2026-11-03, batch 3): standing OpenStax textbook verification
    // (structured text + exercises, open access; URL 200, SPA shell).
    // taught/direct — the Monitor- and Interpret-data winner (only vetted
    // claim on both).
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
    form: "taught",
    access: "direct",
    learnNotes: {
      "Monitor economic, industrial, and corporate developments":
        "The book's markets-and-industry chapters teach reading the economic environment a desk watches — tracking corporate and industrial context.",
      "Interpret data on price, yield, stability, future investment-risk trends, economic influences":
        "Bond-pricing and risk-return chapters teach reading price/yield/stability data — the market-data read the desk runs on.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-fin-mit-ocw-finance-theory",
    title: "15.401 Finance Theory I (MIT OpenCourseWare)",
    provider: "MIT OpenCourseWare",
    type: "course",
    cost: "free",
    // full free course materials (valuation foundations); heavier math, self-paced
    // audit (2026-11-03, batch 3): fetched LIVE (title verified "Finance
    // Theory I | Sloan School of Management | MIT OpenCourseWare" — lecture
    // notes/assignments open). taught/direct — the capitalization winner
    // (id A–Z over openstax).
    url: "https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/",
    durationHours: 40,
    skillsAddressed: [
      "Analyze financial information to forecast business, industry, or economic conditions for investment decisions",
      "Advise clients on aspects of capitalization, such as amounts, sources, or timing",
    ],
    careerId: "fin",
    form: "taught",
    access: "direct",
    learnNotes: {
      "Advise clients on aspects of capitalization, such as amounts, sources, or timing":
        "Finance Theory I teaches valuation and capital-budgeting foundations — the capital-budgeting fluency the O*NET row prints (normally senior-received work).",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-fin-finance-fundamentals",
    title: "Fundamentals of Finance (Wharton)",
    provider: "Coursera (University of Pennsylvania)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 3): fetched LIVE "Enroll for free" — NPV rule,
    // bonds/yield curve, equity valuation, IRR, investment acceptance/reject
    // rules. taught/exam-paid — the DCF-story winner (id A–Z over MIT).
    url: "https://www.coursera.org/learn/finance-fundamentals",
    durationHours: 10,
    skillsAddressed: ["Analyze financial information to forecast business, industry, or economic conditions for investment decisions"],
    careerId: "fin",
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Analyze financial information to forecast business, industry, or economic conditions for investment decisions":
        "The NPV framework + investments rules teach the discount-cash-flow story an analyst builds and defends — the base DCF-driven analysis.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-fin-cambridge-finance",
    title: "Finance for Non-finance Professionals (U Cambridge)",
    provider: "Coursera (University of Cambridge)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 3 fill, user-ruled): per-role dup
    // of the verified row. Its Modelling-essentials module teaches model
    // design — purpose, workbook structure, workflow, visualization and
    // commentary in Excel — the model-design craft the O*NET financial-model
    // row prints (both CFI guide rows grade reference).
    url: "https://www.coursera.org/learn/finance-for-non-finance-professionals",
    durationHours: 31,
    skillsAddressed: ["Employ financial models to develop solutions to financial problems or to assess the financial or capital impact of transactions"],
    careerId: "fin",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Employ financial models to develop solutions to financial problems or to assess the financial or capital impact of transactions":
        "The Modelling-essentials module teaches model design — purpose, workbook structure, workflow, visualization and commentary — plus the sensitivity scenario craft.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-fin-cfi-ratios",
    title: "Financial Ratios Definitive Guide (CFI free resource)",
    provider: "Corporate Finance Institute",
    type: "doc",
    cost: "free",
    // audit (2026-11-03, batch 3): fetched LIVE — gated ebook-download page →
    // reference.
    url: "https://corporatefinanceinstitute.com/resources/accounting/financial-ratios-definitive-guide/",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "fin",
    form: "reference",
    access: "account",
  },
  {
    id: "res-fin-top-workplace-comms",
    title: "Participating in Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 3): TOP Moodle module → account (id 56
    // resolves via the TOP search mirror). taught/account. The report/ESC
    // winner (only vetted claim on both).
    url: "https://e-tesda.gov.ph/course/view.php?id=56",
    durationHours: 2,
    skillsAddressed: ["Present oral or written reports on general economic trends, individual corporations, and entire industries", "Communication · Critical Thinking · Professionalism (Enabling)"],
    creditingBody: "TESDA",
    careerId: "fin",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Present oral or written reports on general economic trends, individual corporations, and entire industries":
        "TESDA's workplace-communication module is the putting-analysis-on-paper/oral leg — reports written to be read and relayed.",
      "Communication · Critical Thinking · Professionalism (Enabling)":
        "The same module runs the participation/respond/relay craft — the analyst's communication backbone.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-fin-wharton-more-accounting",
    title: "More Introduction to Financial Accounting (Wharton)",
    provider: "Coursera (University of Pennsylvania)",
    type: "course",
    cost: "free",
    // financial-statement analysis module
    // audit (2026-11-03, batch 3): same Wharton family standing (audit route
    // → exam-paid). Catalog fallback only (ADDR empty).
    url: "https://www.coursera.org/learn/wharton-financial-accounting",
    durationHours: 14,
    skillsAddressed: [],
    careerId: "fin",
    form: "taught",
    access: "exam-paid",
  },
  {
    id: "res-fin-gcf-excel",
    title: "Excel (topic hub) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 3): verified LearnFree lesson-series standing
    // (URL redirects onto the Excel Foundations series page, title verified;
    // the series' chart lessons carry the chart leg). taught/direct — the
    // chart/cell winner after the CFI misfit claim cut.
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: ["Draw charts and graphs, using computer spreadsheets, to illustrate technical reports"],
    careerId: "fin",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Draw charts and graphs, using computer spreadsheets, to illustrate technical reports":
        "The Excel Foundations series teaches building charts and graphs in a workbook — the reporting-visuals leg of the analyst craft (the CFI lesson's formula-only claim was cut).",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-fin-cfi-basic-excel",
    title: "Basic Excel Formulas for Beginners (CFI free resource)",
    provider: "Corporate Finance Institute",
    type: "doc",
    cost: "free",
    // audit (2026-11-03, batch 3): fetched LIVE — open step-by-step lesson →
    // taught/direct. The ADDR Draw-charts claim CUT per §6.1 (the lesson
    // teaches formulas, not charts; see the commit body).
    url: "https://corporatefinanceinstitute.com/resources/excel/basic-excel-formulas-beginners/",
    durationHours: 2,
    skillsAddressed: [],
    careerId: "fin",
    form: "taught",
    access: "direct",
  },
  {
    id: "res-fin-acca-mgmt",
    title: "Introduction to Management Accounting (ACCA-X on edX)",
    provider: "ACCA-X (edX)",
    type: "course",
    cost: "free",
    // cost/management accounting basics + spreadsheet use
    // audit + re-point (2026-11-03, batch 3): old slug 301s → the current
    // canonical path (fetched LIVE, title "ACCA: Introduction to Management
    // Accounting"). Catalog fallback only (ADDR empty per §6.1).
    url: "https://www.edx.org/learn/accounting/acca-introduction-to-management-accounting",
    durationHours: 30,
    skillsAddressed: [],
    creditingBody: "ACCA-X",
    careerId: "fin",
    form: "taught",
    access: "exam-paid",
  },
  {
    id: "res-fin-cfi-careers",
    title: "Careers in Finance (CFI free course)",
    provider: "Corporate Finance Institute",
    type: "course",
    cost: "free",
    // free tour of finance role families; non-PH framing, flagged
    // audit (2026-11-03, batch 3): fetched LIVE (title "Careers in Finance
    // Course | CFI") — CFI free course, registry signup → account. Catalog
    // fallback only (ADDR empty per §6.1).
    url: "https://corporatefinanceinstitute.com/course/careers-in-finance/",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "fin",
    form: "taught",
    access: "account",
  },
  {
    id: "res-fin-gap-senior-tasks",
    title: "Senior-heavy supervision row — resourceless by declaration (no padding)",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    // Wave E (2026-11-04): the taught fill this declaration waited on landed —
    // the Alison Introduction to Supervision row below now carries the cell;
    // this row stays as the honest history (no padding).
    skillsAddressed: ["Supervise, train, or mentor junior team members"],
    careerId: "fin",
  },
  {
    id: "res-fin-educba-equity-investments",
    title: "Equity Investments and Valuation Strategies (EDUCBA)",
    provider: "Coursera (EDUCBA)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-04 (Wave E fill, user-delegated): "Enroll for
    // free", 5 modules in the Investment Management and Capital Markets
    // Specialization — market foundations → market mechanisms/indices and
    // efficiency → equity instruments/return characteristics and behavioral
    // finance → industry/competitive analysis (business cycles, Porter's
    // Five Forces) → the equity-valuation module: dividend-discount,
    // asset-based and multiplier approaches, "estimate intrinsic value,
    // compare investment opportunities, and build valuation-driven
    // investment strategies". The recommend-investments-and-timing craft in
    // taught form; ₱ paid tier: certificate.
    url: "https://www.coursera.org/learn/equity-investments-valuation-strategies",
    durationHours: 10,
    skillsAddressed: ["Recommend investments and investment timing"],
    careerId: "fin",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Recommend investments and investment timing":
        "The equity-valuation module teaches the recommendation loop — estimating intrinsic value via dividend-discount/asset-based/multiplier models, comparing investment opportunities, and building valuation-driven strategies (the market-efficiency and business-cycle modules carry the timing read).",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-fin-alison-supervision",
    title: "Introduction to Supervision (Alison)",
    provider: "Alison",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-04 (Wave E fill, user-delegated): "Start Course
    // Now", 1.5-3 h, CPD-accredited — printed outcomes define supervision
    // and the responsibilities of a supervisor, drill delegating
    // successfully, list ways to motivate subordinates, establish why trust
    // matters, and teach the coaching-vs-mentoring distinction alongside
    // leadership principles. The supervise/train/mentor craft for juniors in
    // taught form (the entry path carries the skill before the supervising
    // seat); certificate optional (paid).
    url: "https://alison.com/course/introduction-to-supervision",
    durationHours: 3,
    skillsAddressed: ["Supervise, train, or mentor junior team members"],
    careerId: "fin",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Supervise, train, or mentor junior team members":
        "The course teaches supervising others — the responsibilities of a supervisor, delegating successfully, motivating and building trust with subordinates, and the coaching-vs-mentoring split that shapes how a junior gets trained.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  // ── treasury (4.6) — BSP 403 flag carried; Khan US-framing flagged ──
  // Wave B audit (2026-11-03, batch 3): access/form per-row. Khan units
  // UNRE-VERIFIED by CLI (the environment's "Client Challenge" bot-wall — same
  // family verdict as the swd SQL row's prior-round note); the units grade
  // taught/direct on the standing verification, noted per-row. ACCA-X and
  // Cambridge graded per the family standings (ACCA re-pointed to the edX
  // canonical path; Cambridge fetched LIVE "Enroll now"). GCF Excel + OpenStax
  // + Lawphil graded per standing. Honest reds KEPT: Balance currency/coin/
  // checks (the statute anchor is reference; no taught cash-count page
  // verified) and Enter-customers'-transactions (no claim — the teller-side
  // craft; the teller batch covers the family). Coverage: 4/6 vetted.
  // Wave E hunt (2026-11-04, user-delegated): both teller-side cells fill —
  // Alison's "Introduction to Bank Telling" (fetched LIVE 200: "Start Course
  // Now", 1.5-3 h, CPD-accredited; outcomes carry the critical roles and
  // responsibilities of bank tellers, cash-sorting techniques and the
  // accounting/mathematical skills a teller's role needs) carries the
  // cash-drawer-balance cell (the desk's end-of-shift close and its running
  // daily-transaction math; the RA 8791 statute row keeps the lawful
  // context); Alison's "Guide to Effective Cash Handling Techniques"
  // (fetched LIVE 200: "Start Course Now", 1.5-3 h; the modern-POS-systems
  // outcome rides transaction efficiency plus accurate-calculation and
  // check-verification processes) carries the transaction-entry/receipts
  // cell (US cashier-desk framing scoped honestly in-row). Coverage: 6/6
  // vetted.
  {
    id: "res-treasury-khan-banking",
    title: "Finance and Capital Markets — Banking & Money unit (Khan Academy)",
    provider: "Khan Academy",
    type: "course",
    cost: "free",
    // free banking unit; US banking framing — flagged for PH substitution
    // (BSP pages blocked this session; recheck when reachable)
    // audit (2026-11-03, batch 3): CLI fetch blocked by the environment's
    // "Client Challenge" bot-wall (same family verdict as the swd Khan row's
    // prior-round note) — graded taught/direct on the standing unit
    // verification, recorded honestly. Catalog fallback only (ADDR empty).
    url: "https://www.khanacademy.org/economics-finance-domain/core-finance/banking-and-money",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "treasury",
    form: "taught",
    access: "direct",
  },
  {
    id: "res-treasury-khan-interest",
    title: "Interest Basics unit (Khan Academy)",
    provider: "Khan Academy",
    type: "course",
    cost: "free",
    // free interest mechanics (US framing flagged)
    // audit (2026-11-03, batch 3): CLI bot-wall as above; taught/direct on
    // the standing verification. Catalog fallback only (the A–Z id tie on
    // the interest cell resolves to the Wharton fundamentals row).
    url: "https://www.khanacademy.org/economics-finance-domain/core-finance/interest-basics",
    durationHours: 2,
    skillsAddressed: ["Prepare financial documents, and calculate interest or brokerage charges and stamp duties payable"],
    careerId: "treasury",
    pick: true,
    form: "taught",
    access: "direct",
  },
  {
    id: "res-treasury-ra8791",
    title: "Republic Act No. 8791 (General Banking Law of 2000)",
    provider: "Lawphil Project",
    type: "doc",
    cost: "free",
    // audit (2026-11-03, batch 3): statute text = reference (fetched LIVE,
    // title verified). Honest red for the cash-balance cell: the statute is
    // the lawful context, not taught craft; no taught cash-count page
    // verified (adviser-owned pending).
    url: "https://lawphil.net/statutes/repacts/ra2000/ra_8791_2000.html",
    durationHours: 2,
    skillsAddressed: [
      "Balance currency, coin, and checks in cash drawers at ends of shifts and calculate daily transactions, using computers, calculators, or adding machines",
    ],
    careerId: "treasury",
    pick: true,
    form: "reference",
    access: "direct",
  },
  {
    id: "res-treasury-gcf-excel",
    title: "Excel (topic hub) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 3): verified LearnFree lesson-series standing
    // (URL redirects onto the Excel Foundations series page, title verified).
    // taught/direct. Catalog fallback only (ACCA wins the reconcile cell).
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: ["Reconcile records of financial transactions"],
    careerId: "treasury",
    pick: true,
    form: "taught",
    access: "direct",
  },
  {
    id: "res-treasury-acca-intro",
    title: "Introduction to Bookkeeping (ACCA-X on edX)",
    provider: "ACCA-X (edX)",
    type: "course",
    cost: "free",
    // audit + re-point (2026-11-03, batch 3): canonical edX path (301
    // verified; title standing). taught/exam-paid. The reconcile winner
    // (tier-2 creditingBody + id A–Z over GCF).
    url: "https://www.edx.org/learn/bookkeeping/acca-introduction-to-bookkeeping",
    durationHours: 30,
    skillsAddressed: ["Reconcile records of financial transactions"],
    creditingBody: "ACCA-X",
    careerId: "treasury",
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Reconcile records of financial transactions":
        "ACCA's credited intro reconciles records against the banking system and flags discrepancies — the spreadsheet-reconcile discipline the O*NET verb prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-treasury-openstax-finance",
    title: "Principles of Finance (OpenStax)",
    provider: "OpenStax (free textbook)",
    type: "doc",
    cost: "free",
    // bonds/shares mechanics underpinning securities-record upkeep
    // audit (2026-11-03, batch 3): standing OpenStax textbook verification
    // (URL 200, SPA shell). taught/direct. Catalog fallback only.
    url: "https://openstax.org/details/books/principles-finance",
    durationHours: 6,
    skillsAddressed: [
      "Prepare financial documents, and calculate interest or brokerage charges and stamp duties payable",
      "Maintain records of bonds, shares and other securities bought or sold on behalf of clients or employer",
    ],
    careerId: "treasury",
    pick: true,
    form: "taught",
    access: "direct",
  },
  {
    id: "res-treasury-finance-fundamentals",
    title: "Fundamentals of Finance (Wharton)",
    provider: "Coursera (University of Pennsylvania)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 3): fetched LIVE "Enroll for free" (same
    // standing as the fin dup). taught/exam-paid. The interest and
    // securities-records winner (the A–Z id order: f < k < o over the pool).
    url: "https://www.coursera.org/learn/finance-fundamentals",
    durationHours: 10,
    skillsAddressed: [
      "Prepare financial documents, and calculate interest or brokerage charges and stamp duties payable",
      "Maintain records of bonds, shares and other securities bought or sold on behalf of clients or employer",
    ],
    careerId: "treasury",
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Prepare financial documents, and calculate interest or brokerage charges and stamp duties payable":
        "Module 1 teaches simple vs. compound interest, annuities and effective annual rates — the instrument-charges math the PSOC row prints (the LC/duties paperwork leg itself has no taught page).",
      "Maintain records of bonds, shares and other securities bought or sold on behalf of clients or employer":
        "The fixed-income and equity-valuation modules teach what bond/share records represent and how they price — the record-upkeep context; a records-registry lesson itself has no taught page (honest leg-gap).",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-treasury-cfi-careers",
    title: "Careers in Finance (CFI free course)",
    provider: "Corporate Finance Institute",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 3): same verified CFI free-course standing as
    // the fin dup (registry signup → account). Catalog fallback only.
    url: "https://corporatefinanceinstitute.com/course/careers-in-finance/",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "treasury",
    form: "taught",
    access: "account",
  },
  {
    id: "res-treasury-top-workplace-comms",
    title: "Participating in Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 3): TOP Moodle module → account (id 56
    // resolves via the TOP search mirror). taught/account. The only claim —
    // the Enabling winner.
    url: "https://e-tesda.gov.ph/course/view.php?id=56",
    durationHours: 2,
    skillsAddressed: ["Accuracy/Professionalism (Enabling)"],
    creditingBody: "TESDA",
    careerId: "treasury",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Accuracy/Professionalism (Enabling)":
        "TESDA's workplace-communication module runs precise transfer of information — the zero-surprise cash-desk behavior the enabling row names.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-treasury-alison-bank-telling",
    title: "Introduction to Bank Telling (Alison)",
    provider: "Alison",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-04 (Wave E fill, user-delegated): "Start Course
    // Now", 1.5-3 h (Contains Video), CPD-accredited, beginner level —
    // printed outcomes carry the critical roles and responsibilities of
    // bank tellers, the skills/abilities they need, different payment
    // methods and bookkeeping guidelines, the techniques and procedures for
    // sorting cash, and the accounting and mathematical skills a teller's
    // role needs. The end-of-shift cash-drawer close (currency, coin and
    // checks against a counted daily total) is the teller responsibility the
    // course teaches; certificate optional (paid). The RA 8791 statute row
    // keeps the lawful context in the same pool.
    url: "https://alison.com/course/introduction-to-bank-telling",
    durationHours: 3,
    skillsAddressed: [
      "Balance currency, coin, and checks in cash drawers at ends of shifts and calculate daily transactions, using computers, calculators, or adding machines",
    ],
    careerId: "treasury",
    form: "taught",
    access: "account",
    learnNotes: {
      "Balance currency, coin, and checks in cash drawers at ends of shifts and calculate daily transactions, using computers, calculators, or adding machines":
        "The course teaches the teller craft around the drawer — the responsibilities that include receiving and sorting currency/coin/checks, the bookkeeping guidelines they post against, and the accounting-and-math skills (payment-method arithmetic, check handling) the end-of-shift count-and-balance runs on.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-treasury-alison-cash-handling",
    title: "Guide to Effective Cash Handling Techniques (Alison)",
    provider: "Alison",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-04 (Wave E fill, user-delegated): "Start Course
    // Now", 1.5-3 h (Contains Video), CPD-accredited, advanced level —
    // printed outcomes carry the modern POS systems used to optimise
    // transaction efficiency, the benefits of accurate calculations in
    // financial transactions, check-verification processes and cash-
    // management principles (plus fraud-prevention safeguards). The
    // transaction-entry/receipt-issuing desk loop in taught form; US
    // cashier-desk framing scoped honestly in-row (the bank-bookkeeping
    // side rides the bank-telling anchor in the same pool).
    url: "https://alison.com/course/guide-to-effective-cash-handling-techniques",
    durationHours: 3,
    skillsAddressed: ["Enter customers' transactions into computers to record transactions and issue computer-generated receipts"],
    careerId: "treasury",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Enter customers' transactions into computers to record transactions and issue computer-generated receipts":
        "The POS-systems module teaches the transaction-processing loop — entering each customer's purchase/payment into the system, the accurate-calculation discipline behind it, and the computer-generated receipt the system issues (check-verification and cash-management safeguards included).",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  // ── coll (4.7) — thin collections-training zone declared; RA 3765 never a live link ──
  // Wave B audit (2026-11-03, batch 4): access/form per-row. TOP Moodle modules
  // → account (303 login-wall verified LIVE this pass). GCF Excel graded
  // taught/direct (URL 308s onto LearnFree's "Excel: Foundations" series —
  // the standing lesson-series verification; re-verified fresh this pass).
  // Wharton + ACCA-X Coursera/edX rows graded taught/exam-paid (fetched LIVE
  // "Enroll for free"; the old edX slug 301s onto the canonical
  // /learn/bookkeeping/acca-introduction-to-bookkeeping path). Statutes + DOLE
  // handbook → reference. Digital-literacy category page → landing. New
  // per-role fill (fetched LIVE 2026-11-03, user-ruled): Alison's taught
  // "Accounts Receivable Management" ("Start Course Now", CPD-accredited) —
  // its printed outcomes carry establish-collection-procedures/credit-terms
  // and the AR process flow: the three collections-craft cells.
  // Wave E hunt (2026-11-04, user-delegated): two more cells fill —
  // PDCflow's "Skip Tracing Tools and Techniques for Collections" (fetched
  // LIVE 200: a deep step-by-step guide converted from the CAC Collection
  // Boot Camp curriculum — skip classification, locate services/tools,
  // permissible-purpose rules and informant questioning scripts) carries
  // skip-tracing in taught form; the fresh AR fetch (LIVE 2026-11-04)
  // re-points the AR row to the confer/terms-review cell on its printed
  // collection-procedures + credit-terms outcomes. Honest red adjudicated
  // Wave E 2026-11-04 — Recommend-legal-action/disconnection: no taught
  // page teaches the recommendation itself (the taught ecosystem drills
  // compliant settlement and litigation AVOIDANCE — the PDCflow boot-camp
  // series prints settlement criteria and attorney-review guardrails, not
  // escalation-craft; Alison AR prints collection agencies as functions).
  // The RA 10173 reference anchor + the declared-thin gap carry the cell.
  // Coverage: 8/9 vetted (adjudicated-only red).
  {
    id: "res-coll-top-receiving-comms",
    title: "Receiving and Responding to Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // the closest free PH anchor to call-handling craft
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303 login-wall
    // verified LIVE; id 52 resolves via the TOP search mirror).
    url: "https://e-tesda.gov.ph/course/view.php?id=52",
    durationHours: 2,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "coll",
    form: "taught",
    access: "account",
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
    form: "taught",
    access: "account",
    learnNotes: {
      "Communication · Professionalism (Enabling)":
        "TESDA's workplace-communication module: participating, responding, relaying — the daily behavior layer of the collections desk (original-document discipline included).",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-coll-khan-banking",
    title: "Finance and Capital Markets — Banking & Money unit (Khan Academy)",
    provider: "Khan Academy",
    type: "course",
    cost: "free",
    // credit-side context; US framing flagged (BSP 403)
    // audit (2026-11-03, batch 4): fetched LIVE (200, title verified) →
    // taught/direct (Khan units are free, open, self-serve).
    url: "https://www.khanacademy.org/economics-finance-domain/core-finance/banking-and-money",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "coll",
    form: "taught",
    access: "direct",
  },
  {
    id: "res-coll-gcf-excel",
    title: "Excel (topic hub) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    // status-of-collection trackers
    // audit (2026-11-03, batch 4): URL 308s onto LearnFree's "Excel:
    // Foundations" series page (re-verified fresh; the batch-3 standing
    // lesson-series verification carries the grade). taught/direct. The
    // status-tracking leg is the tool-craft winner (the collections craft
    // rows ride the Alison AR row below).
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: [
      "Arrange for debt repayment or establish repayment schedules, based on customers' financial situations",
      "Record information about financial status of customers and status of collection efforts",
    ],
    careerId: "coll",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Record information about financial status of customers and status of collection efforts":
        "The Excel Foundations series drills the worksheet side — building the status-of-account tracker the row names, entries updated per collection effort.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-coll-finance-fundamentals",
    title: "Fundamentals of Finance (Wharton)",
    provider: "Coursera (University of Pennsylvania)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 4): fetched LIVE "Enroll for free" →
    // taught/exam-paid. Catalog fallback only (ADDR empty per §6.1).
    url: "https://www.coursera.org/learn/finance-fundamentals",
    durationHours: 10,
    skillsAddressed: [],
    careerId: "coll",
    form: "taught",
    access: "exam-paid",
  },
  {
    id: "res-coll-acca-intro",
    title: "Introduction to Bookkeeping (ACCA-X on edX)",
    provider: "ACCA-X (edX)",
    type: "course",
    cost: "free",
    // banking-system + ledger discipline behind posting receipts
    // audit + re-point (2026-11-03, batch 4): the old /course/introduction-to-
    // bookkeeping-2 slug 301s onto edX's current canonical path (fetched LIVE;
    // "Enroll for free" standing, batch-3 verified). taught/exam-paid. The
    // receive-and-post winner (tier-2 creditingBody).
    url: "https://www.edx.org/learn/bookkeeping/acca-introduction-to-bookkeeping",
    durationHours: 30,
    skillsAddressed: ["Receive payments and post amounts paid to customer accounts"],
    creditingBody: "ACCA-X",
    careerId: "coll",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Receive payments and post amounts paid to customer accounts":
        "ACCA's banking chapter teaches receiving cash/cheque/voucher amounts and posting them onto customer accounts — the payment-posting loop the row names.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-coll-ra10173",
    title: "Republic Act No. 10173 (Data Privacy Act of 2012)",
    provider: "Lawphil Project",
    type: "doc",
    cost: "free",
    // the statute governing tracing-activity personal-data handling (RA 3765
    // is NEVER rendered live anywhere — dead-in-copy flag, ruling 2026-10-29)
    // audit (2026-11-03, batch 4): statute text = reference (readable material;
    // no teaching flow). The tracing/legal-actions/upkeep cells stay red on
    // these claims — no taught self-serve page verified for the skip-tracing
    // and legal-recommendation crafts (adviser-only).
    url: "https://lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html",
    durationHours: 2,
    skillsAddressed: [
      "Trace delinquent customers to new addresses by inquiring at post offices, telephone companies, credit bureaus, or through the questioning of neighbors",
      "Recommend legal action or disconnection when payment cannot be obtained / negotiate credit extensions",
      "Administrative upkeep of assigned accounts",
    ],
    careerId: "coll",
    pick: true,
    form: "reference",
    access: "direct",
  },
  {
    id: "res-coll-dole-handbook",
    title: "Workers' Statutory Monetary Benefits Handbook 2024 (DOLE-BWC, official NWPC mirror)",
    provider: "DOLE-BWC (NWPC mirror)",
    type: "doc",
    cost: "free",
    // generic labor-standards context — noted as context, not collections doctrine
    // audit (2026-11-03, batch 4): PDF fetched reachable (200) → reference
    // (readable computation handbook; no teaching flow).
    url: "https://nwpc.dole.gov.ph/wp-content/uploads/2024/11/Workers-Statutory-Monetary-Benefits-Handbook-2024-Edition.pdf",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "coll",
    form: "reference",
    access: "direct",
  },
  {
    id: "res-coll-alison-ar",
    title: "Accounts Receivable Management (Alison)",
    provider: "Alison",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 4 fill, user-ruled): "Start Course
    // Now" with no paywall (certificate optional/paid, CPD-accredited) →
    // taught/account. Printed outcomes carry the three collections-craft legs:
    // "establish clear collection procedures to manage delinquent accounts",
    // "assessing credit risk and setting appropriate credit limits and payment
    // terms", plus the full AR process flow (billing, cash application,
    // payments reconciliation). taught/account. The locate-and-notify,
    // repayment-scheduling and accounts-upkeep winner (id A–Z).
    // Re-point (fetched LIVE fresh 2026-11-04, Wave E user-delegated): the
    // printed collection-procedures outcome ("establish clear collection
    // procedures to manage delinquent accounts") is the delinquent-account
    // outreach loop — conferring with the customer to determine overdue
    // reasons — and the credit-terms outcome ("assessing credit risk and
    // setting appropriate credit limits and payment terms") is the
    // terms-of-sale/service/credit-contract review; the confer cell rides
    // the same taught procedures work.
    url: "https://alison.com/course/accounts-receivable-management",
    durationHours: 2,
    skillsAddressed: [
      "Locate and notify customers of delinquent accounts by mail, telephone, or personal visits to solicit payment",
      "Confer with customers by telephone or in person to determine reasons for overdue payments and to review the terms of sales, service, or credit contracts",
      "Arrange for debt repayment or establish repayment schedules, based on customers' financial situations",
      "Administrative upkeep of assigned accounts",
    ],
    careerId: "coll",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Locate and notify customers of delinquent accounts by mail, telephone, or personal visits to solicit payment":
        "The collection-procedures module teaches the delinquent-account outreach loop — notices and follow-up actions per collection stage.",
      "Confer with customers by telephone or in person to determine reasons for overdue payments and to review the terms of sales, service, or credit contracts":
        "Managing delinquent accounts through the collection-procedures module is the confer loop — contacting the customer, hearing the overdue reasons, and re-walking the terms of the sale/service/credit contract with the credit-risk/payment-terms lens the course drills.",
      "Arrange for debt repayment or establish repayment schedules, based on customers' financial situations":
        "The credit-terms module runs assessing risk and setting payment terms/schedules — the repayment-arrangement craft.",
      "Administrative upkeep of assigned accounts":
        "The AR process-flow modules (billing → cash application → reconciliation) are the day-to-day accounts-upkeep machinery.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-coll-pdcflow-skip-trace",
    title: "Skip Tracing Tools and Techniques for Collections (PDCflow)",
    provider: "PDCflow (CAC Collection Boot Camp series)",
    type: "doc",
    cost: "free",
    // fetched LIVE 2026-11-04 (Wave E fill, user-delegated): HTTP 200, deep
    // step-by-step guide converted from the CAC Collection Boot Camp
    // curriculum (bylined past CAC President + CAC MAP attorney) — it
    // teaches the skip-tracing craft itself: classifying skips
    // (company/unintentional/intentional/criminal), choosing locate
    // vendors/tools (credit-report services like Accurint/Clear/TLO plus
    // free social/government sources), running searches under "permissible
    // purpose" (FCRA) and third-party-verification rules ("contact only
    // once, identify yourself, disclose only location-confirmation"), and
    // informant questioning scripts drilled with active-listening,
    // closed/open-ended and reflexive-question technique. taught/direct as
    // a step-by-step how-to doc (the Atlassian/deep-guide family standing);
    // US FCRA framing scoped honestly in-row — the PH personal-data
    // handling rides RA 10173 in the same pool.
    url: "https://www.pdcflow.com/debt-collection/collection-boot-camp-skip-tracing-guide/",
    durationHours: 2,
    skillsAddressed: ["Trace delinquent customers to new addresses by inquiring at post offices, telephone companies, credit bureaus, or through the questioning of neighbors"],
    careerId: "coll",
    form: "taught",
    access: "direct",
    learnNotes: {
      "Trace delinquent customers to new addresses by inquiring at post offices, telephone companies, credit bureaus, or through the questioning of neighbors":
        "The guide teaches locating a delinquent customer through institutions and third parties — classify the skip, pick the locate service (post-office/utility/credit-bureau-class data and social/government sources), stay inside the permissible-purpose and third-party-verification rules, and run the account-numbered searches and informant scripts (active listening, open/closed questions) that surface a new address.",
    },
    // learn line — authored 2026-11-03, user-delegated
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
  // Wave B audit (2026-11-03, batch 4): access/form per-row. Wharton rows
  // graded taught/exam-paid (fetched LIVE "Enroll for free"). CFI's free
  // resource page graded reference/account (fetched LIVE: "FREE pdf eBook
  // Download" gate — the batch-3 CFI ebook-page verdict family). Statutes →
  // reference. TOP modules → taught/account (303 login-wall verified LIVE);
  // the Digital-Literacy category page → landing. GCF Excel graded
  // taught/direct (LearnFree standing) but its credit/loan-paperwork claims
  // are CUT as §6.1-class misfits (spreadsheet trackers ≠ loan documentation,
  // same paperwork-chain honesty as batch 3's Order-Fulfilment red) — the
  // claim freed cells are listed in the commit body. Likewise the §6.1-class
  // misfit cut: Fundamentals of Finance no longer claims the loan-research
  // cell (its printed outcomes are NPV/valuation; the AR/bad-debt statement
  // analysis rides "More Introduction to Financial Accounting" — that row is
  // the research-evaluation winner). New per-role fills (fetched LIVE
  // 2026-11-04, user-delegated): Coursera EDUCBA "Mortgage Loans and Lending
  // Fundamentals" — printed outcomes carry explaining loan products/lending
  // processes, the documentation module (borrower documentation + the
  // Loan-Documentation skill tag) and the application/underwriting-process
  // module; Alison "Accounts Receivable Management" per-role dup (printed
  // collection-procedures/cash-application outcomes carry the
  // payment-records/overdue-letters cell). Honest reds kept with fresh
  // attempts (adjudicated Wave E 2026-11-04): applicant-interviewing (no
  // taught self-serve page teaches the applicant conversation craft),
  // underwriter liaison (best candidates are member-gated or
  // process-overview pages that don't teach the liaison conversation) and
  // portfolio-sizing (delinquency-report craft; template vendors and paid
  // LMS only; the §6.1-class thin line rides the gap row as history).
  // Coverage: 6/9 vetted (3 adjudicated-only reds).
  {
    id: "res-credit-cfi-ratios",
    title: "Financial Ratios Definitive Guide (CFI free resource)",
    provider: "Corporate Finance Institute",
    type: "doc",
    cost: "free",
    // audit (2026-11-03, batch 4): fetched LIVE — the URL serves the gated
    // "FREE pdf eBook Download" flow → reference/account (readable material
    // behind an email gate; no teaching flow).
    url: "https://corporatefinanceinstitute.com/resources/accounting/financial-ratios-definitive-guide/",
    durationHours: 3,
    skillsAddressed: [
      "Researching and evaluating loan applicant's financial status, references, credit and ability to repay the loan",
      
    ],
    careerId: "credit",
    pick: true,
    form: "reference",
    access: "account",
  },
  {
    id: "res-credit-finance-fundamentals",
    title: "Fundamentals of Finance (Wharton)",
    provider: "Coursera (University of Pennsylvania)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 4): fetched LIVE "Enroll for free" →
    // taught/exam-paid. ADDR cut this pass (§6.1-class misfit — printed
    // outcomes are NPV/valuation, not loan-research craft; listed in commit).
    url: "https://www.coursera.org/learn/finance-fundamentals",
    durationHours: 10,
    skillsAddressed: [],
    careerId: "credit",
    form: "taught",
    access: "exam-paid",
  },
  {
    id: "res-credit-wharton-more-accounting",
    title: "More Introduction to Financial Accounting (Wharton)",
    provider: "Coursera (University of Pennsylvania)",
    type: "course",
    cost: "free",
    // AR/bad-debt and statement-analysis modules
    // audit (2026-11-03, batch 4): fetched LIVE "Enroll for free" →
    // taught/exam-paid. The loan-research winner (sole vetted claim after the
    // fundamentals misfit cut; the AR/bad-debt and statement-analysis modules
    // are the reading-a-borrower's-financials craft).
    url: "https://www.coursera.org/learn/wharton-financial-accounting",
    durationHours: 14,
    skillsAddressed: [
      "Researching and evaluating loan applicant's financial status, references, credit and ability to repay the loan",
      
    ],
    careerId: "credit",
    
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Researching and evaluating loan applicant's financial status, references, credit and ability to repay the loan":
        "Wharton's accounts-receivable and bad-debt modules teach reading a firm's statements — receivables quality and debt position are the receivable-recovery/repaycraft legs the cell prints (note: the interview/limits craft is the §6.1 adviser line).",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-credit-top-receiving-comms",
    title: "Receiving and Responding to Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303 login-wall
    // verified LIVE; id 52 resolves via the TOP search mirror).
    url: "https://e-tesda.gov.ph/course/view.php?id=52",
    durationHours: 2,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "credit",
    form: "taught",
    access: "account",
  },
  {
    id: "res-credit-top-workplace-comms",
    title: "Participating in Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; id 56 resolves via the TOP search mirror).
    // taught/account. The Enabling winner (over the landing category page).
    url: "https://e-tesda.gov.ph/course/view.php?id=56",
    durationHours: 2,
    skillsAddressed: [
      
      
      "Integrity/Professionalism (Enabling)",
    ],
    creditingBody: "TESDA",
    careerId: "credit",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Integrity/Professionalism (Enabling)":
        "TESDA's workplace-communication module is the professionalism layer — participating, integrity and courtesy in every workplace exchange.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-credit-ra8791",
    title: "Republic Act No. 8791 (General Banking Law of 2000)",
    provider: "Lawphil Project",
    type: "doc",
    cost: "free",
    // audit (2026-11-03, batch 4): statute text = reference (readable
    // material; no teaching flow). The paperwork-chain cells now carry the
    // taught legs (credit's EDUCBA mortgage-lending and Alison-AR dups); the
    // statute keeps the lawful context in the same pool.
    url: "https://lawphil.net/statutes/repacts/ra2000/ra_8791_2000.html",
    durationHours: 2,
    skillsAddressed: [
      "Keeping records of payments, and preparing routine letters requesting payment for overdue accounts and forwarding these for legal action",
      "Completing credit and loan documentation",
    ],
    careerId: "credit",
    form: "reference",
    access: "direct",
  },
  {
    id: "res-credit-ra10173",
    title: "Republic Act No. 10173 (Data Privacy Act of 2012)",
    provider: "Lawphil Project",
    type: "doc",
    cost: "free",
    // credit-file PII (RA 3765 dead-in-copy flag rides the record)
    // audit (2026-11-03, batch 4): statute text = reference (fetched LIVE,
    // title verified). The records-of-payments cell now carries the taught
    // leg (Alison-AR dup); the statute keeps the KYC/legal context.
    url: "https://lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html",
    durationHours: 2,
    skillsAddressed: [
      "Keeping records of payments, and preparing routine letters requesting payment for overdue accounts and forwarding these for legal action",
      "Completing credit and loan documentation",
    ],
    careerId: "credit",
    pick: true,
    form: "reference",
    access: "direct",
  },
  {
    id: "res-credit-gcf-excel",
    title: "Excel (topic hub) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 4): URL verified LearnFree lesson-series
    // standing (308 onto the Excel Foundations series) → taught/direct.
    // ADDR cut this pass (§6.1-class misfit cuts ×2): spreadsheet trackers
    // don't teach "keeping payment records + preparing routine letters for
    // overdue accounts" nor "completing credit and loan documentation" — the
    // paperwork-chain honesty batch 3 applied to sales' Order Fulfilment; the
    // freed cells are listed in the commit body and stay adviser-only.
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: [],
    careerId: "credit",
    form: "taught",
    access: "direct",
  },
  {
    id: "res-credit-intuit-basics",
    title: "Bookkeeping basics (Intuit)",
    provider: "Coursera (Intuit)",
    type: "course",
    cost: "free",
    // payment-cycle literacy behind delinquency paperwork (honest thin otherwise)
    // audit (2026-11-03, batch 4): same verified Enroll-for-free standing as
    // the acctclerk dup (fetched LIVE). Catalog fallback only.
    url: "https://www.coursera.org/learn/bookkeeping-basics",
    durationHours: 10,
    skillsAddressed: [],
    careerId: "credit",
    form: "taught",
    access: "exam-paid",
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
  {
    id: "res-credit-mortgage-lending",
    title: "Mortgage Loans and Lending Fundamentals (EDUCBA)",
    provider: "Coursera (EDUCBA)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-04 (Wave E fill, user-delegated): "Enroll now",
    // 4 modules / 9 h, June 2026 update. Printed outcomes teach explaining
    // mortgage loan products, lending processes, borrower documentation, and
    // evaluating lending risks to recommend suitable solutions; the module
    // list drills the complete step-by-step lending process (M1),
    // borrower documents + payments + credit appraisal (M2), mortgage
    // products + underwriting + the application process (M3), and the
    // "Loan Documentation" skill tag prints on the page. The
    // documentation/application/recommendation and product-explanation cells
    // ride the taught flow; certificate optional (paid).
    url: "https://www.coursera.org/learn/mortgage-loans-and-lending-fundamentals",
    durationHours: 9,
    skillsAddressed: [
      "Completing credit and loan documentation",
      "Explain to customers the different types of loans and credit options that are available, as well as the terms of those services",
      "Submitting credit and loan applications to management with recommendations for approval or rejection; approving or rejecting within authorized limits",
    ],
    careerId: "credit",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Completing credit and loan documentation":
        "Module 2 (Documentation, Payments & Risk Assessment) teaches the borrower-documentation set and what the credit-appraisal file carries — the loan-documentation completeness the row prints.",
      "Explain to customers the different types of loans and credit options that are available, as well as the terms of those services":
        "The printed outcome teaches explaining loan products, lending processes and repayment structures, and Module 3 walks the various mortgage products with their cost structures — the product-explanation conversation (mortgage-depth framing; the wider loan family rides the same product/terms craft).",
      "Submitting credit and loan applications to management with recommendations for approval or rejection; approving or rejecting within authorized limits":
        "M1's complete step-by-step lending process plus M3's application/underwriting modules and the recommend-suitable-solutions outcome teach the decision-support workflow — the paper submission and risk-based recommendation craft (approve/reject authority limits stay bank-policy).",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-credit-alison-ar",
    title: "Accounts Receivable Management (Alison)",
    provider: "Alison",
    type: "course",
    cost: "free",
    // per-role dup of the batch-3-verified res-coll-alison-ar row (re-verified
    // LIVE fresh 2026-11-04, user-delegated — Wave E rules fresh fetches):
    // "Start Course Now", 1.5-3 h, CPD-accredited; the printed collection-
    // procedures outcome ("establish clear collection procedures to manage
    // delinquent accounts"), the AR process-flow stages (billing → cash
    // application → payments reconciliation) and the collection-agency
    // functions outcome carry the payment-records/overdue-letters cell. The
    // legal-forwarding decision leg is management-side craft (scoped).
    url: "https://alison.com/course/accounts-receivable-management",
    durationHours: 2,
    skillsAddressed: ["Keeping records of payments, and preparing routine letters requesting payment for overdue accounts and forwarding these for legal action"],
    careerId: "credit",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Keeping records of payments, and preparing routine letters requesting payment for overdue accounts and forwarding these for legal action":
        "The collection-procedures module teaches the delinquent-account outreach loop (payment-request notices past the printed terms) and the cash-application/payments-reconciliation modules are the payment-record upkeep; the legal-forwarding decision leg stays management-side craft.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  // ── teller (4.9) ──
  // Wave B audit (2026-11-03, batch 4): access/form per-row. TOP Moodle
  // modules → taught/account (303 login-wall verified LIVE); the SSS portal
  // placeholder → landing (keep-with-flag). Khan units → taught/direct
  // (fetched LIVE; US framing flagged). CFI's Careers in Finance course →
  // taught/account (fetched LIVE "Enroll for free", CFI signup). ACCA-X row
  // re-pointed to edX's canonical path (old slug 301s, fetched LIVE) →
  // taught/exam-paid. GCF Excel → taught/direct (LearnFree standing). RA 8791
  // → reference. New per-role fill (fetched LIVE 2026-11-03, user-ruled):
  // Alison's taught "Customer Service Skills" — the customer-service cell's
  // front-desk craft leg (the special-services specifics stay scoped
  // in-row). New per-role dups (fetched LIVE again fresh 2026-11-04,
  // user-delegated — Wave E rules fresh fetches): Alison "Introduction to
  // Bank Telling" (Start Course Now, CPD-accredited; teller-responsibilities,
  // payment-methods/bookkeeping-guidelines, sorting-cash and
  // accounting-and-math outcomes — the drawer close) and Alison "Guide to
  // Effective Cash Handling Techniques" (check-verification processes and
  // POS transaction-efficiency outcomes — the deposit-taking and
  // transaction-entry dups). Honest reds kept with fresh attempts
  // (adjudicated Wave E 2026-11-04): account-discrepancy resolution (no
  // taught self-serve page teaches the discrepancy loop; bank-LMS platforms
  // are member-gated or paid), the payment-desk mortgage/loan/utility leg +
  // savings-plan processing (statute-anchored counter paperwork; the SSS
  // placeholder keeps the start-here flag) and the cross-sell cell
  // (product-referral craft; paid bank-LMS modules only — study.com stays
  // ruled-strip). Coverage: 6/9 vetted (3 adjudicated-only reds).
  {
    id: "res-teller-khan-banking",
    title: "Finance and Capital Markets — Banking & Money unit (Khan Academy)",
    provider: "Khan Academy",
    type: "course",
    cost: "free",
    // free banking mechanics; US contexts (Fed shipments) flagged — supplemented
    // with the PH-side statute row below
    // audit (2026-11-03, batch 4): fetched LIVE (200, title verified) →
    // taught/direct.
    url: "https://www.khanacademy.org/economics-finance-domain/core-finance/banking-and-money",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "teller",
    form: "taught",
    access: "direct",
  },
  {
    id: "res-teller-ra8791",
    title: "Republic Act No. 8791 (General Banking Law of 2000)",
    provider: "Lawphil Project",
    type: "doc",
    cost: "free",
    // audit (2026-11-03, batch 4): statute text = reference (readable
    // material; no teaching flow). The balancing/receiving cells now carry
    // the taught legs (Alison bank-telling and cash-handling dups); the
    // statute keeps the lawful context in the same pool.
    url: "https://lawphil.net/statutes/repacts/ra2000/ra_8791_2000.html",
    durationHours: 2,
    skillsAddressed: [
      "Balance currency, coin, and checks in cash drawers at ends of shifts and calculate daily transactions, using computers, calculators, or adding machines",
      "Receive checks and cash for deposit, verify amounts, and check accuracy of deposit slips",
    ],
    careerId: "teller",
    pick: true,
    form: "reference",
    access: "direct",
  },
  {
    id: "res-teller-acca-intro",
    title: "Introduction to Bookkeeping (ACCA-X on edX)",
    provider: "ACCA-X (edX)",
    type: "course",
    cost: "free",
    // audit + re-point (2026-11-03, batch 4): the old edX slug 301s onto the
    // canonical path (fetched LIVE; "Enroll for free" standing). taught/
    // exam-paid.
    url: "https://www.edx.org/learn/bookkeeping/acca-introduction-to-bookkeeping",
    durationHours: 30,
    skillsAddressed: [],
    creditingBody: "ACCA-X",
    careerId: "teller",
    form: "taught",
    access: "exam-paid",
  },
  {
    id: "res-teller-gcf-excel",
    title: "Excel (topic hub) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    // teller-balance worksheets
    // audit (2026-11-03, batch 4): verified LearnFree lesson-series standing
    // (308 onto the Excel Foundations series) → taught/direct.
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: [],
    careerId: "teller",
    form: "taught",
    access: "direct",
  },
  {
    id: "res-teller-khan-interest",
    title: "Interest Basics unit (Khan Academy)",
    provider: "Khan Academy",
    type: "course",
    cost: "free",
    // term-deposit/interest mechanics (US framing flagged)
    // audit (2026-11-03, batch 4): fetched LIVE (200, title verified) →
    // taught/direct.
    url: "https://www.khanacademy.org/economics-finance-domain/core-finance/interest-basics",
    durationHours: 2,
    skillsAddressed: [],
    careerId: "teller",
    form: "taught",
    access: "direct",
  },
  {
    id: "res-teller-sss",
    title: "SSS — Official portal — start here for statutory-contribution payment-desk information (table/deep pages unplaced/unreachable)",
    provider: "Social Security System (PH regulator)",
    type: "doc",
    cost: "free",
    // keep-with-flag ruling 2026-10-29: start-here placeholder only
    // audit (2026-11-03, batch 4): fetched LIVE (title verified) → landing.
    // adjudicated Wave E 2026-11-04 — the payment-desk/savings-plan cell
    // rides red on it: one honest attempt (bank-LMS candidates are
    // member-gated or paid); no taught self-serve page teaches the statutory
    // counter paperwork.
    url: "https://www.sss.gov.ph/",
    durationHours: 1,
    skillsAddressed: ["Receive mortgage, loan, or public utility bill payments, verifying payment dates and amounts due / process term deposits and other savings-plan transactions"],
    careerId: "teller",
    pick: true,
    form: "landing",
    access: "direct",
  },
  {
    id: "res-teller-top-receiving-comms",
    title: "Receiving and Responding to Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; id 52 resolves via the TOP search mirror).
    url: "https://e-tesda.gov.ph/course/view.php?id=52",
    durationHours: 2,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "teller",
    form: "taught",
    access: "account",
  },
  {
    id: "res-teller-cfi-careers",
    title: "Careers in Finance (CFI free course)",
    provider: "Corporate Finance Institute",
    type: "course",
    cost: "free",
    // tour incl. retail-banking branch roles; non-PH framing flagged
    // audit (2026-11-03, batch 4): fetched LIVE "Enroll for free" (CFI
    // course page; free signup) → taught/account.
    url: "https://corporatefinanceinstitute.com/course/careers-in-finance/",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "teller",
    form: "taught",
    access: "account",
  },
  {
    id: "res-teller-top-workplace-comms",
    title: "Participating in Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; id 56 resolves via the TOP search mirror).
    // taught/account. The two Enabling winners.
    url: "https://e-tesda.gov.ph/course/view.php?id=56",
    durationHours: 2,
    skillsAddressed: ["Front-desk service etiquette (Enabling)", "Professionalism · Teamwork (Enabling)"],
    creditingBody: "TESDA",
    careerId: "teller",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Front-desk service etiquette (Enabling)":
        "TESDA's workplace-communication module drills receiving/relaying workplace exchange with courtesy — the front-desk conduct base.",
      "Professionalism · Teamwork (Enabling)":
        "The participating-in-workplace-communication unit is the professionalism/teamwork practice (obtaining and providing information cooperatively).",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-teller-alison-cs",
    title: "Customer Service Skills (Alison)",
    provider: "Alison",
    type: "course",
    cost: "free",
    // per-role dup of the batch-3-verified res-sales-alison-cs-skills row
    // (re-verified LIVE 2026-11-03: "Start Course Now", CPD-accredited,
    // certificate optional) → taught/account. The customer-service cell's
    // service-interaction craft; the card/check-ordering specifics are
    // bank-internal procedures (scoped honestly here — no taught page for
    // them this pass).
    url: "https://alison.com/course/customer-service-skills",
    durationHours: 2,
    skillsAddressed: ["Customer service & special services (cards, checks ordering)"],
    careerId: "teller",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Customer service & special services (cards, checks ordering)":
        "Alison's service-skills modules cover the counter exchange — greeting, listening, handling requests — the service leg of the card/check-ordering row; the order-processing specifics themselves are bank-internal craft.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-teller-alison-bank-telling",
    title: "Introduction to Bank Telling (Alison)",
    provider: "Alison",
    type: "course",
    cost: "free",
    // per-role dup of the Wave-E-verified res-treasury-alison-bank-telling
    // row (re-verified LIVE fresh 2026-11-04, user-delegated — Wave E rules
    // fresh fetches): "Start Course Now", 1.5-3 h (Contains Video),
    // CPD-accredited, beginner level — printed outcomes carry the critical
    // roles and responsibilities of bank tellers, the skills/abilities they
    // need, the different payment methods and bookkeeping guidelines, the
    // techniques and procedures for sorting cash, and the accounting and
    // mathematical skills a teller's role needs. The end-of-shift
    // cash-drawer close (currency, coin and checks against the counted
    // daily total) is the taught craft. Kept out of the deposit cell: the
    // check-verification processes print on the cash-handling dup in this
    // pool. Certificate optional (paid). The RA 8791 statute row keeps the
    // lawful context in the same pool.
    url: "https://alison.com/course/introduction-to-bank-telling",
    durationHours: 3,
    skillsAddressed: [
      "Balance currency, coin, and checks in cash drawers at ends of shifts and calculate daily transactions, using computers, calculators, or adding machines",
    ],
    careerId: "teller",
    form: "taught",
    access: "account",
    learnNotes: {
      "Balance currency, coin, and checks in cash drawers at ends of shifts and calculate daily transactions, using computers, calculators, or adding machines":
        "The course teaches the teller craft around the drawer — the responsibilities that include receiving and sorting currency/coin/checks, the payment-method and bookkeeping-guideline modules they post against, and the accounting-and-math skills (payment-method arithmetic, check handling) the end-of-shift count-and-balance runs on.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-teller-alison-cash-handling",
    title: "Guide to Effective Cash Handling Techniques (Alison)",
    provider: "Alison",
    type: "course",
    cost: "free",
    // per-role dup of the Wave-E-verified res-treasury-alison-cash-handling
    // row (re-verified LIVE fresh 2026-11-04, user-delegated): "Start Course
    // Now", 1.5-3 h (Contains Video), CPD-accredited, advanced level —
    // printed outcomes carry the modern POS systems used to optimise
    // transaction efficiency, the benefits of accurate calculations in
    // financial transactions, and the processes involved in verifying
    // checks. The deposit-taking (verify amounts/check the slip accuracy
    // against the check-verification loop) and transaction-entry/receipt
    // cells ride the taught flow (cased claim on the deposit cell — the
    // fallback-sort winner stays RA 8791 on hours; scoped note). US
    // cashier-desk framing scoped honestly in-row. Certificate optional
    // (paid).
    url: "https://alison.com/course/guide-to-effective-cash-handling-techniques",
    durationHours: 3,
    skillsAddressed: [
      "Receive checks and cash for deposit, verify amounts, and check accuracy of deposit slips",
      "Enter customers' transactions into computers to record transactions and issue computer-generated receipts",
    ],
    careerId: "teller",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Receive checks and cash for deposit, verify amounts, and check accuracy of deposit slips":
        "The check-verification module teaches the processes a teller runs to verify checks — amount, signature and funds verification against the receiving desk; the deposit-slip accuracy leg rides the accurate-calculation discipline the course drills.",
      "Enter customers' transactions into computers to record transactions and issue computer-generated receipts":
        "The POS-systems module teaches the transaction-processing loop — entering each customer's payment into the system, the accurate-calculation discipline behind it, and the computer-generated receipt the system issues.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  // ── audit (4.10) — BIR eFPS dead-in-copy; row-11 tech row waits for the pin ──
  // Wave B audit (2026-11-03, batch 4): access/form per-row. Wharton graded
  // taught/exam-paid (fetched LIVE "Enroll for free"); MIT OCW → taught/
  // direct (fetched LIVE 200, title verified — open course materials); the
  // ACCA-X rows re-pointed to edX canonical paths (old slugs 301s, fetched
  // LIVE) → taught/exam-paid; GCF Excel → taught/direct (LearnFree standing);
  // OpenStax managerial → reference/direct (the book pool's verdict stands);
  // statutes + TESDA PDF → reference; CFI's ratios page → reference/account
  // (the "FREE pdf eBook Download" gate); BIR portal → landing (keep-with-
  // flag); TOP modules → taught/account (303 login-wall verified LIVE);
  // Digital-Literacy category → landing. New per-role fill (re-verified LIVE
  // 2026-11-03, user-ruled): the batch-3-verified UIUC "Foundations of
  // Strategic Internal Auditing" dup — COSO control evaluation carries the
  // fraud/controls cell. Wave E additions (fetched LIVE fresh 2026-11-04,
  // user-delegated): the same UIUC row carries the examine-records/
  // interview cell (M3 "Audit Execution" prints the records/walkthroughs/
  // interviews evidence-gathering flow), and Alison "Introduction to
  // Supervision" is the senior-heavy supervision dup. Honest reds kept with
  // fresh attempts (adjudicated Wave E 2026-11-04): cash/negotiables/
  // canceled-check inspection (no taught self-serve page teaches the
  // physical-inspection craft; the UIUC modules print no counting/inspection
  // lesson) and the compliance/tax-analog cell (statute-anchored; PTA
  // serves BIR personnel/bespoke cohorts, not a free self-serve taught
  // page). Coverage: 9/11 vetted (2 adjudicated-only reds).
  {
    id: "res-audit-wharton-accounting",
    title: "Introduction to Financial Accounting (Wharton)",
    provider: "Coursera (University of Pennsylvania)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 4): fetched LIVE "Enroll for free" →
    // taught/exam-paid.
    url: "https://www.coursera.org/learn/wharton-accounting",
    durationHours: 15,
    skillsAddressed: [
      "Prepare, examine, or analyze accounting records, financial statements, or other financial reports to assess accuracy, completeness, and conformance to reporting and procedural standards",
      "Review accounts for discrepancies and reconcile differences",
    ],
    careerId: "audit",
    pick: true,
    form: "taught",
    access: "exam-paid",
  },
  {
    id: "res-audit-mit-ocw-15501",
    title: "15.501 Introduction to Financial and Managerial Accounting (MIT OCW)",
    provider: "MIT OpenCourseWare",
    type: "course",
    cost: "free",
    // free full course materials (financial statements, reporting); rigorous
    // audit (2026-11-03, batch 4): fetched LIVE (200, title verified) →
    // taught/direct (open self-serve course materials).
    url: "https://ocw.mit.edu/courses/15-501-introduction-to-financial-and-managerial-accounting-spring-2004/",
    durationHours: 40,
    skillsAddressed: [
      "Prepare, examine, or analyze accounting records, financial statements, or other financial reports to assess accuracy, completeness, and conformance to reporting and procedural standards",
      "Review accounts for discrepancies and reconcile differences",
    ],
    careerId: "audit",
    form: "taught",
    access: "direct",
  },
  {
    id: "res-audit-acca-intro",
    title: "Introduction to Bookkeeping (ACCA-X on edX)",
    provider: "ACCA-X (edX)",
    type: "course",
    cost: "free",
    // accounting-cycle literacy
    // audit + re-point (2026-11-03, batch 4): old edX slug 301s onto the
    // canonical path (fetched LIVE; "Enroll for free" standing). taught/
    // exam-paid. The records/reconcile winner (tier-2 creditingBody).
    url: "https://www.edx.org/learn/bookkeeping/acca-introduction-to-bookkeeping",
    durationHours: 30,
    skillsAddressed: [
      "Prepare, examine, or analyze accounting records, financial statements, or other financial reports to assess accuracy, completeness, and conformance to reporting and procedural standards",
      "Review accounts for discrepancies and reconcile differences",
    ],
    creditingBody: "ACCA-X",
    careerId: "audit",
    
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Prepare, examine, or analyze accounting records, financial statements, or other financial reports to assess accuracy, completeness, and conformance to reporting and procedural standards":
        "ACCA's accredited intro drills double-entry figures, postings and codes against source documents — examining records for accuracy/completeness before anything journals.",
      "Review accounts for discrepancies and reconcile differences":
        "The banking-system and control modules reconcile records and surface discrepancies — month-end readiness as the row prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-audit-psf-gih-doc",
    title: "Philippine Skills Framework for Global In-House Center (official PDF)",
    provider: "TESDA",
    type: "doc",
    cost: "free",
    // Internal Controls FSC ladder ("control gaps" language)
    // audit (2026-11-03, batch 4): TESDA PDF → reference (standing;
    // ADDR empty per §6.1).
    url: "https://www.tesda.gov.ph/Uploads/File/Philippine%20Skills%20Framework/ICT/Philippine%20Skills%20Framework%20for%20Global%20In-House%20Center.pdf",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "audit",
    form: "reference",
    access: "direct",
  },
  {
    id: "res-audit-cfi-ratios",
    title: "Financial Ratios Definitive Guide (CFI free resource)",
    provider: "Corporate Finance Institute",
    type: "doc",
    cost: "free",
    // audit (2026-11-03, batch 4): fetched LIVE — gated "FREE pdf eBook
    // Download" flow → reference/account. Catalog fallback only.
    url: "https://corporatefinanceinstitute.com/resources/accounting/financial-ratios-definitive-guide/",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "audit",
    form: "reference",
    access: "account",
  },
  {
    id: "res-audit-openstax-managerial",
    title: "Principles of Accounting, Volume 2: Managerial Accounting (OpenStax)",
    provider: "OpenStax (free textbook)",
    type: "doc",
    cost: "free",
    // audit (2026-11-03, batch 4): the book pool's reference verdict stands
    // (readable internal-control chapter context). The fraud/controls cell
    // rides red on it — the COSO-style control-evaluation craft is carried by
    // the new UIUC internal-auditing per-role dup below.
    url: "https://openstax.org/details/books/principles-managerial-accounting",
    durationHours: 6,
    skillsAddressed: ["Collect and analyze data to detect deficient controls, duplicated effort, extravagance, fraud, or non-compliance with laws, regulations, and management policies"],
    careerId: "audit",
    pick: true,
    form: "reference",
    access: "direct",
  },
  {
    id: "res-audit-ra9298",
    title: "Republic Act No. 9298 (Philippine Accountancy Act of 2004)",
    provider: "Lawphil Project",
    type: "doc",
    cost: "free",
    // the PH practice band under which audit work sits (CPA board, practice
    // scope); lawphil is a mirror — cite the PRC/Gazette register when reachable
    // audit (2026-11-03, batch 4): statute text = reference (readable
    // material; no teaching flow).
    url: "https://lawphil.net/statutes/repacts/ra2004/ra_9298_2004.html",
    durationHours: 2,
    skillsAddressed: [],
    careerId: "audit",
    form: "reference",
    access: "direct",
  },
  {
    id: "res-audit-acca-intermediate",
    title: "Intermediate Bookkeeping (ACCA-X on edX)",
    provider: "ACCA-X (edX)",
    type: "course",
    cost: "free",
    // audit + re-point (2026-11-03, batch 4): old edX slug 301s onto the
    // canonical path (fetched LIVE; title standing). taught/exam-paid.
    url: "https://www.edx.org/learn/bookkeeping/acca-intermediate-bookkeeping",
    durationHours: 30,
    skillsAddressed: [],
    creditingBody: "ACCA-X",
    careerId: "audit",
    form: "taught",
    access: "exam-paid",
  },
  {
    id: "res-audit-top-workplace-comms",
    title: "Participating in Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // written reporting discipline; client-facing request handling
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; id 56 resolves via the TOP search mirror).
    // taught/account. The detailed-reports winner (sole claim).
    url: "https://e-tesda.gov.ph/course/view.php?id=56",
    durationHours: 2,
    skillsAddressed: ["Prepare detailed reports on audit findings", "Professional Skepticism (attitude) · Communication (Enabling)"],
    creditingBody: "TESDA",
    careerId: "audit",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Prepare detailed reports on audit findings":
        "Participating-in-workplace-communication drills gathering, structuring and relaying workplace information — the complete, written reporting form the audit-findings row prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-audit-gcf-excel",
    title: "Excel (topic hub) — GCFGlobal",
    provider: "GCFGlobal",
    type: "course",
    cost: "free",
    // workpaper tables
    // audit (2026-11-03, batch 4): verified LearnFree lesson-series standing
    // (308 onto the Excel Foundations series) → taught/direct. The audit-
    // technology-fluency winner (sole URL claim).
    url: "https://edu.gcfglobal.org/en/excel/",
    durationHours: 4,
    skillsAddressed: ["Audit technology fluency (accounting software / Excel family)"],
    careerId: "audit",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Audit technology fluency (accounting software / Excel family)":
        "The Excel Foundations series is the spreadsheet leg of the O*NET 30-pinned technology set (Excel is a printed category) — formulas, tables and workpaper discipline; the QuickBooks/Sage instances ride paid vendor trials.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-audit-top-journalizing",
    title: "Journalizing Transactions (TOP Bookkeeping NC III module)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // the journal/posting/trial-balance lifecycle adjusting entries touch
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; title + syllabus verified via the TOP search
    // mirror). taught/account. The adjusting-entries winner (tier-2 + entry
    // path counts, id A–Z over the posting/trial modules).
    url: "https://e-tesda.gov.ph/course/view.php?id=3982",
    durationHours: 4,
    skillsAddressed: ["Prepare adjusting journal entries / establish tables of accounts and assign entries to proper accounts"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "audit",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Prepare adjusting journal entries / establish tables of accounts and assign entries to proper accounts":
        "The NC III module teaches logging business transactions in the accounting journal and assigning entries to accounts — the structure adjusting entries edit.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-audit-top-posting",
    title: "Posting Transactions (TOP Bookkeeping NC III module)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; title resolved via the TOP search mirror).
    url: "https://e-tesda.gov.ph/course/view.php?id=3983",
    durationHours: 4,
    skillsAddressed: ["Prepare adjusting journal entries / establish tables of accounts and assign entries to proper accounts"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "audit",
    form: "taught",
    access: "account",
  },
  {
    id: "res-audit-top-trial-balance",
    title: "Preparing Trial Balance (TOP Bookkeeping NC III module)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; title resolved via the TOP search mirror).
    url: "https://e-tesda.gov.ph/course/view.php?id=4029",
    durationHours: 4,
    skillsAddressed: ["Prepare adjusting journal entries / establish tables of accounts and assign entries to proper accounts"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "audit",
    form: "taught",
    access: "account",
  },
  {
    id: "res-audit-intuit-basics",
    title: "Bookkeeping basics (Intuit)",
    provider: "Coursera (Intuit)",
    type: "course",
    cost: "free",
    // adjusting-entries module ("make adjusting entries…")
    // audit (2026-11-03, batch 4): same verified Enroll-for-free standing as
    // the acctclerk dup (fetched LIVE).
    url: "https://www.coursera.org/learn/bookkeeping-basics",
    durationHours: 10,
    skillsAddressed: ["Prepare adjusting journal entries / establish tables of accounts and assign entries to proper accounts"],
    careerId: "audit",
    form: "taught",
    access: "exam-paid",
  },
  {
    id: "res-audit-dole-handbook",
    title: "Workers' Statutory Monetary Benefits Handbook 2024 (DOLE-BWC, official NWPC mirror)",
    provider: "DOLE-BWC (NWPC mirror)",
    type: "doc",
    cost: "free",
    // the statutory-benefit baseline payroll-audit engagements test against
    // audit (2026-11-03, batch 4): PDF fetched reachable (200) → reference
    // (readable computation handbook; no teaching flow). The compliance cell
    // stays red on it (adviser-only).
    // adjudicated Wave E 2026-11-04 — one honest attempt for the
    // compliance/tax-analog cell (PTA/BIR training serves BIR personnel and
    // bespoke cohorts; no free self-serve taught page); the DOLE handbook
    // keeps the readable statutory-benefit baseline.
    url: "https://nwpc.dole.gov.ph/wp-content/uploads/2024/11/Workers-Statutory-Monetary-Benefits-Handbook-2024-Edition.pdf",
    durationHours: 3,
    skillsAddressed: ["Compliance / tax analog & frameworks"],
    careerId: "audit",
    form: "reference",
    access: "direct",
  },
  {
    id: "res-audit-bir",
    title: "BIR — Official portal — start here for withholding/tax-filing context (eFPS tutorial pages unreachable — dead-in-copy; do not cite eFPS tutorial pages)",
    provider: "Bureau of Internal Revenue (PH regulator)",
    type: "doc",
    cost: "free",
    // keep-with-flag ruling 2026-10-29 (same treatment as pay)
    // audit (2026-11-03, batch 4): fetched LIVE (title verified) → landing
    // (labeled start-here placeholder; eFPS ruling stands).
    url: "https://www.bir.gov.ph/",
    durationHours: 1,
    skillsAddressed: ["Compliance / tax analog & frameworks"],
    careerId: "audit",
    pick: true,
    form: "landing",
    access: "direct",
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
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE). taught/account. The skepticism-cell winner
    // (id A–Z over the participated module).
    url: "https://e-tesda.gov.ph/course/view.php?id=52",
    durationHours: 2,
    skillsAddressed: [
      
      "Professional Skepticism (attitude) · Communication (Enabling)",
      
    ],
    creditingBody: "TESDA",
    careerId: "audit",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Professional Skepticism (attitude) · Communication (Enabling)":
        "The receiving-and-responding module is the ask-clarify-confirm exchange discipline — the communication half of the skepticism compound row.",
    },
    // learn line — authored 2026-11-03, user-delegated
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
    // audit (2026-11-03, batch 4): category page → landing (fail-closed;
    // ADDR empty per §6.1).
    url: "https://e-tesda.gov.ph/course/index.php?categoryid=1310",
    durationHours: 4,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "audit",
    form: "landing",
    access: "account",
  },
  {
    id: "res-audit-uiuc-internal-audit",
    title: "Foundations of Strategic Internal Auditing (U Illinois Gies)",
    provider: "Coursera (University of Illinois)",
    type: "course",
    cost: "free",
    // per-role dup of the batch-3-verified res-fas-uiuc-internal-audit row
    // (re-verified LIVE 2026-11-03: "Enroll for free" — 4 modules). The
    // COSO control-evaluation and evidence-gathering modules carry the
    // fraud/controls cell. ₱ paid tier: certificate.
    // Wave E re-point (fetched LIVE fresh 2026-11-04, user-delegated — Wave
    // E rules fresh fetches): M3 "Audit Execution" prints the craft —
    // auditors "gather, analyze, and consolidate evidence" with data
    // analytics, process mapping and "qualitative evidence such as
    // interviews and walkthroughs" to surface control weaknesses and root
    // causes — the examine-records/interview-workers fieldwork leg of the
    // compliance-ensure cell ("Enroll for free" live; 12 assignments in the
    // module). The physical inspection of cash/negotiables does NOT print
    // (stays adjudicated red in-row above).
    url: "https://www.coursera.org/learn/strategic-internal-auditing-foundations",
    durationHours: 13,
    skillsAddressed: [
      "Collect and analyze data to detect deficient controls, duplicated effort, extravagance, fraud, or non-compliance with laws, regulations, and management policies",
      "Examine records and interview workers to ensure recording of transactions and compliance with laws and regulations",
    ],
    careerId: "audit",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Collect and analyze data to detect deficient controls, duplicated effort, extravagance, fraud, or non-compliance with laws, regulations, and management policies":
        "The COSO modules teach applying frameworks to evaluate controls and surface control weaknesses from gathered evidence — the detection craft the row prints.",
      "Examine records and interview workers to ensure recording of transactions and compliance with laws and regulations":
        "The Audit-Execution module teaches the fieldwork loop — gathering and consolidating evidence from records and interviews (walkthroughs included) and forming defensible judgments that withstand scrutiny.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-audit-alison-supervision",
    title: "Introduction to Supervision (Alison)",
    provider: "Alison",
    type: "course",
    cost: "free",
    // per-role dup of the Wave-E-verified res-fin-alison-supervision row
    // (re-verified LIVE fresh 2026-11-04, user-delegated — Wave E rules
    // fresh fetches; the identical carve carries fin's supervise cell):
    // "Start Course Now", 1.5-3 h, CPD-accredited — printed outcomes define
    // supervision, list the responsibilities of a supervisor, drill
    // delegating successfully, list ways to motivate subordinates and
    // distinguish coaching vs mentoring. The honesty fold-in's taught base;
    // the cell stays a non-entry-expectation ride-along per the rowspec.
    url: "https://alison.com/course/introduction-to-supervision",
    durationHours: 3,
    skillsAddressed: ["Senior-heavy supervision tasks"],
    careerId: "audit",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Senior-heavy supervision tasks":
        "The course teaches supervising others — the responsibilities set, delegating successfully, motivating and building trust with subordinates, and the coaching-vs-mentoring split — the supervision fold-in's taught base.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  // == ── Track 4 · Office & Administration (adminassoc · clerk · encode · desk ·
  // execsec · records) — blessed role-spec pools ────────────────────────────
  // ── adminassoc (5.1) ──
  // Wave B audit (2026-11-03, batch 4): access/form per-row. TOP Moodle
  // modules → taught/account (303 login-wall verified LIVE); the IBM
  // SkillsBuild home → landing (fetched LIVE; marketing shell); Google
  // Workspace / Calendar / Microsoft 365 hubs → landing (re-pointed to
  // canonical hub paths; /getstarted now 301s to the Calendar hub; /office
  // 301s to the M365 hub; both fetched LIVE this pass); UK National Archives
  // guidance → reference; Google Applied Digital Skills re-pointed onto the
  // exceeds canonical lesson path (old applieddigitalskills URL 301s —
  // fetched LIVE, title "Google Sheets for Beginners") → taught/account. New
  // per-role fill (fetched LIVE 2026-11-03, user-ruled): Alison's
  // "Administrative Assistant Training" ("Start Course Now", CPD) — printed
  // outcomes carry decimal/group-name filing systems, essential office
  // equipment (telephones/computers/fax), telephone/voicemail etiquette and
  // meeting organization → the four office-craft cells. Coverage: 6/6 vetted.
  {
    id: "res-adminassoc-top-digitallit",
    title: "Microsoft Digital Literacy (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // login-gated (TOP account free); e-certificate on completion
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; id 4716).
    url: "https://e-tesda.gov.ph/course/view.php?id=4716",
    durationHours: 4,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "adminassoc",
    form: "taught",
    access: "account",
  },
  {
    id: "res-adminassoc-uk-archives",
    title: "The National Archives (UK) — Information management",
    provider: "The National Archives (UK)",
    type: "doc",
    cost: "free",
    // professional records guidance: creation, naming, filing, retention;
    // UK retention law is non-PH — transfer the filing discipline
    // audit (2026-11-03, batch 4): fetched LIVE (200, title verified) —
    // professional guidance library → reference (readable material; no
    // teaching flow). The filing-system cell rides red on it; the taught leg
    // is carried by the new Alison per-role row below.
    url: "https://www.nationalarchives.gov.uk/information-management/",
    durationHours: 3,
    skillsAddressed: ["Filing systems (paper/electronic) operation"],
    careerId: "adminassoc",
    
    form: "reference",
    access: "direct",
  },
  {
    id: "res-adminassoc-ads-sheets",
    title: "Google Applied Digital Skills: Google Sheets for Beginners",
    provider: "Google for Education",
    type: "course",
    cost: "free",
    // free lesson w/ completion credential
    // audit + re-point (2026-11-03, batch 4): the applieddigitalskills URL
    // 301s onto the exceeds canonical lesson path (fetched LIVE, title
    // "Google Sheets for Beginners" — the platform-migration banner's landing
    // point). taught/account (Google signup; the standing VA1/VE-6
    // re-check flag travels). The data-entry winner (tier-2 creditingBody).
    url: "https://edu.exceedlms.com/student/path/1606124",
    durationHours: 1,
    skillsAddressed: ["Database entry & maintenance"],
    creditingBody: "Google for Education",
    careerId: "adminassoc",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Database entry & maintenance":
        "The Sheets-for-Beginners lesson walks spreadsheet entry, formatting and tidying — the structured-records upkeep the row prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-adminassoc-workspace",
    title: "Google Workspace Learning Center",
    provider: "Google",
    type: "doc",
    cost: "free",
    // per-app official training hub (Sheets/Docs/Drive)
    // audit (2026-11-03, batch 4): fetched LIVE (200, "Google Workspace
    // Learning Center") — per-app training hub → landing (fail-closed).
    url: "https://support.google.com/a/users",
    durationHours: 2,
    skillsAddressed: ["Database entry & maintenance", "Multi-channel reception & call routing"],
    careerId: "adminassoc",
    
    form: "landing",
    access: "direct",
  },
  {
    id: "res-adminassoc-top-receiving-comms",
    title: "Receiving and Responding to Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // telephone/message/inquiry handling
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE). taught/account. The multi-channel winner
    // (tier-2 creditingBody over the Alison etiquette attach).
    url: "https://e-tesda.gov.ph/course/view.php?id=52",
    durationHours: 2,
    skillsAddressed: ["Multi-channel reception & call routing"],
    creditingBody: "TESDA",
    careerId: "adminassoc",
    
    form: "taught",
    access: "account",
    learnNotes: {
      "Multi-channel reception & call routing":
        "The receiving-and-responding module runs taking telephone/calls-and-messages, recording the exchange and relaying to the right person — the reception/routing loop.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-adminassoc-ms-365",
    title: "Microsoft 365 help & learning",
    provider: "Microsoft Support",
    type: "doc",
    cost: "free",
    // troubleshooting/how-to for Office apps + equipment-adjacent flows
    // audit + re-point (2026-11-03, batch 4): the old /en-us/office path 301s
    // onto the canonical M365 hub (fetched LIVE) → landing (help-hub; the
    // how-to articles under it are out of this row's claim set).
    url: "https://support.microsoft.com/en-US/microsoft-365",
    durationHours: 2,
    skillsAddressed: ["Meeting/coordination documentation"],
    careerId: "adminassoc",
    // form/access graded landing/direct (hub; fail-closed)
    form: "landing",
    access: "direct",
  },
  {
    id: "res-adminassoc-owl-memos",
    title: "Purdue OWL — Professional/Technical Writing: Memos",
    provider: "Purdue University",
    type: "doc",
    cost: "free",
    // memo/office-note structure
    // audit (2026-11-03, batch 4): fetched LIVE (200) — the OWL memo section
    // is an open writing tutorial ("four types of memo standards, audience",
    // format + samples) → taught/direct. In the meeting-doc cell it loses the
    // id race to the Alison org row (authored note honest).
    url: "https://owl.purdue.edu/owl/subject_specific_writing/professional_technical_writing/memos/index.html",
    durationHours: 2,
    skillsAddressed: ["Meeting/coordination documentation"],
    careerId: "adminassoc",
    form: "taught",
    access: "direct",
  },
  {
    id: "res-adminassoc-top-ilo-humanskills",
    title: "Module 3: Building Human Skills for Career Success (TOP × ILO)",
    provider: "TESDA TOP × ILO",
    type: "course",
    cost: "free",
    // human/soft-skills module; login-gated (TOP account free); e-certificate
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; id 2014). taught/account. The Enabling winner.
    url: "https://e-tesda.gov.ph/course/view.php?id=2014",
    durationHours: 2,
    skillsAddressed: ["Communication · Professionalism · Critical Thinking (Enabling)"],
    creditingBody: "TESDA × ILO",
    careerId: "adminassoc",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Communication · Professionalism · Critical Thinking (Enabling)":
        "The ILO human-skills module drills professionalism, communication and judgment for entry jobs — the whole Enabling bundle in one taught track.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-adminassoc-alison-admin",
    title: "Administrative Assistant Training (Alison)",
    provider: "Alison",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 4 fill, user-ruled): "Start
    // Course Now", CPD-accredited → taught/account. Printed outcomes carry
    // the four office-craft legs verbatim: "distinguish between the 'decimal'
    // and 'group name' filing systems", "state how to use essential office
    // equipment such as telephones, computers, fax machines and so on",
    // "outline some basic telephone and voicemail etiquette", and "explain
    // how to organise an annual shareholders' meeting". The filing, equipment
    // and meeting-doc winners (id A–Z).
    url: "https://alison.com/course/administrative-assistant-training",
    durationHours: 2,
    skillsAddressed: [
      "Filing systems (paper/electronic) operation",
      "Office equipment operation & basic troubleshooting",
      "Meeting/coordination documentation",
      "Multi-channel reception & call routing",
    ],
    careerId: "adminassoc",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Filing systems (paper/electronic) operation":
        "The filing-systems module contrasts the decimal and group-name systems and their index/labeling logic — the filing-rules operation the row prints.",
      "Office equipment operation & basic troubleshooting":
        "The equipment module covers operating telephones, computers, fax machines and the office set; the troubleshooting leg rides the unit's diagnosing-side content (operation is the printed craft).",
      "Meeting/coordination documentation":
        "The meetings module walks organizing a formal meeting end-to-end — the coordination paperwork the row names.",
      "Multi-channel reception & call routing":
        "The telephone/voicemail-etiquette outcome covers the reception leg (routing craft rides the TOP module's credited claim — the taught fallback).",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  // ── clerk (5.2) — split rows; row 6 declared resourceless-thin ──
  // Wave B audit (2026-11-03, batch 4): access/form per-row. The UK National
  // Archives guidance → reference; TOP modules → taught/account (303
  // login-wall verified LIVE); Microsoft 365 → landing (re-pointed to the
  // canonical M365 hub, /en-us/office 301s fetched LIVE); Purdue OWL memos →
  // taught/direct (open writing tutorial fetched LIVE); Gmail Help RE-POINTED
  // onto the GCF/LearnFree Gmail lesson series (the URL 308s onto
  // learnfree.org/en/gmail/ — the re-hosted standing lesson series, verified
  // fresh) → taught/direct; Ratatype → taught/direct (open tutor, fetched
  // LIVE); IBM SkillsBuild home → landing. New per-role fill (fetched LIVE
  // 2026-11-03, user-ruled): Alison's "Secretarial Studies and Office
  // Administration" — printed outcomes carry "identify methods for effective
  // file management and distinguish between digital and physical filing
  // systems" → the filing cell. Wave E addition (fetched LIVE 2026-11-04,
  // user-delegated): the Microsoft row RE-POINTED onto the Windows scanner
  // how-to ("Install and use a scanner in Windows" — flatbed/feeder
  // placement, the Scan app walkthrough, save-and-send flow) → the
  // photocopying/sending cell in its digital-reproduction form (the encode
  // import-how-to precedent). Honest red kept with a fresh attempt
  // (adjudicated Wave E 2026-11-04): the equipment-issue register
  // (template-vendor downloads only; the declared resourceless-thin row
  // stands). Coverage: 8/9 vetted (1 adjudicated-only red).
  {
    id: "res-clerk-uk-archives",
    title: "The National Archives (UK) — Information management",
    provider: "The National Archives (UK)",
    type: "doc",
    cost: "free",
    // records life: creation → storage → retrieval → disposal
    // audit (2026-11-03, batch 4): fetched LIVE (200, title verified) →
    // reference. The filing cell rides red on it; the taught leg is the new
    // Alison per-role row below.
    url: "https://www.nationalarchives.gov.uk/information-management/",
    durationHours: 3,
    skillsAddressed: ["Recording, preparing, sorting, classifying and filing information"],
    careerId: "clerk",
    
    form: "reference",
    access: "direct",
  },
  {
    id: "res-clerk-top-digitallit",
    title: "Microsoft Digital Literacy (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // digital-filing/electronic-records basics
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; id 4716).
    url: "https://e-tesda.gov.ph/course/view.php?id=4716",
    durationHours: 4,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "clerk",
    form: "taught",
    access: "account",
  },
  {
    id: "res-clerk-gmail",
    title: "Gmail (lesson series) — GCFGlobal",
    provider: "GCFGlobal",
    type: "doc",
    cost: "free",
    // labels, archiving, mail routing — the email side of the mail-flow task
    // audit + re-point (2026-11-03, batch 4): the old Gmail-help docs URL
    // graded reference — re-pointed onto the GCF/LearnFree Gmail lesson
    // series (the email/labels/archiving side). Close-out re-point
    // (fetched LIVE 2026-11-04): the re-host's /en/gmail/ path vanished
    // (404 after the 308) — the standing lesson series lives at
    // learnfree.org/series/gmail (HTTP 200 verified fresh: "Gmail tips ·
    // Create a Gmail · Using Gmail · How to use Gmail · Master Gmail")
    // → taught/direct. The mail-handling winner (labels/filters series;
    // the physical-accounting leg is the paper craft).
    url: "https://www.learnfree.org/series/gmail",
    durationHours: 1,
    skillsAddressed: ["Sorting, opening and sending mail"],
    careerId: "clerk",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Sorting, opening and sending mail":
        "The Gmail series teaches labels, archiving, filters and composing/sending — the electronic-mail side of the sort-open-send loop.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-clerk-ms-365",
    title: "Install and use a scanner in Windows (Microsoft Support how-to)",
    provider: "Microsoft Support",
    type: "doc",
    cost: "free",
    // printing/PDF flows for document reproduction
    // audit + re-point (2026-11-03, batch 4): the old /en-us/office path 301s
    // onto the canonical M365 hub (fetched LIVE) → landing (ADDR empty per
    // §6.1).
    // Wave E re-point (fetched LIVE 2026-11-04, user-delegated): the hub
    // claim was the §6.1 empty ADDR; re-pointed onto the open scanner
    // how-to (200, deep walkthrough: install the scanner, flatbed/feeder
    // placement, the Windows Scan app's numbered steps, viewing/sending the
    // saved scan) → taught/direct. The photocopying/sending cell in its
    // digital-reproduction form — scanning is the copy machine's workflow
    // side (the encode import-how-to precedent); the standalone
    // photocopier's paper craft rides the same machine-operation family.
    url: "https://support.microsoft.com/en-us/windows/hardware/printer/install-and-use-a-scanner-in-windows",
    durationHours: 2,
    skillsAddressed: ["Photocopying and sending documents"],
    careerId: "clerk",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Photocopying and sending documents":
        "The walkthrough teaches running a reproduction end to end — install the scanner, place the document flatbed/feeder-correct, run the Windows Scan app's numbered steps, then view and send the saved copy — the reproduce-and-send workflow the row prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-clerk-owl-memos",
    title: "Purdue OWL — Memos (Professional/Technical Writing)",
    provider: "Purdue University",
    type: "doc",
    cost: "free",
    // "correspondence of a routine nature"
    // audit (2026-11-03, batch 4): fetched LIVE (200) — open writing
    // tutorial → taught/direct. The routine-reports cell's runner-up (the
    // TOP module wins tier-2).
    url: "https://owl.purdue.edu/owl/subject_specific_writing/professional_technical_writing/memos/index.html",
    durationHours: 2,
    skillsAddressed: ["Routine reports & correspondence"],
    careerId: "clerk",
    pick: true,
    form: "taught",
    access: "direct",
  },
  {
    id: "res-clerk-top-receiving-comms",
    title: "Receiving and Responding to Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE). taught/account. The routine-reports and
    // enquiries winner (tier-2 creditingBody).
    url: "https://e-tesda.gov.ph/course/view.php?id=52",
    durationHours: 2,
    skillsAddressed: ["Routine reports & correspondence", "Responding to enquiries (telephone/electronic) or forwarding"],
    creditingBody: "TESDA",
    careerId: "clerk",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Routine reports & correspondence":
        "The module teaches recording and relaying workplace communication in the routine written forms the row prints.",
      "Responding to enquiries (telephone/electronic) or forwarding":
        "Receiving/answering telephone and electronic exchange then forwarding to the right responder — the enquiries loop itself.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-clerk-top-intro-bookkeeping",
    title: "Introduction to Bookkeeping (TOP Bookkeeping NC III module)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // backs the figures/invoices thin row (letter g)
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; id 3981). taught/account. The figures/invoices
    // winner (sole claim).
    url: "https://e-tesda.gov.ph/course/view.php?id=3981",
    durationHours: 3,
    skillsAddressed: ["Checking figures, preparing invoices and recording details of financial transactions made"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "clerk",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Checking figures, preparing invoices and recording details of financial transactions made":
        "The NC III intro-bookkeeping module teaches documenting financial transactions and the record-keeping envelope — figures/invoices for the general clerk.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-clerk-ratatype",
    title: "Ratatype (free typing portal + free certificate)",
    provider: "Ratatype",
    type: "course",
    cost: "free",
    // transcription throughput (letter h); certificate earned online
    // audit (2026-11-03, batch 4): fetched LIVE (200, title "Online Touch
    // Typing Tutor") — open touch-typing drills → taught/direct (the free
    // certificate flow needs an account; noted in-row). The transcribing
    // winner (sole claim).
    url: "https://www.ratatype.com/",
    durationHours: 3,
    skillsAddressed: ["Transcribing information into computers, and proof-reading and correcting copy"],
    careerId: "clerk",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Transcribing information into computers, and proof-reading and correcting copy":
        "Ratatype's typing exercises + accuracy metrics are the touch-typing/transcription throughput craft; retyping-and-correcting practice is the loop.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-clerk-top-ilo-humanskills",
    title: "Module 3: Building Human Skills for Career Success (TOP × ILO)",
    provider: "TESDA TOP × ILO",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE). taught/account. The Enabling winner.
    url: "https://e-tesda.gov.ph/course/view.php?id=2014",
    durationHours: 2,
    skillsAddressed: ["Communication · Professionalism (Enabling)"],
    creditingBody: "TESDA × ILO",
    careerId: "clerk",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Communication · Professionalism (Enabling)":
        "The ILO human-skills module is the taught professionalism/communication layer for first-job roles.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-clerk-alison-secretarial",
    title: "Secretarial Studies and Office Administration (Alison)",
    provider: "Alison",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 4 fill, user-ruled): "Start
    // Course Now", CPD-accredited → taught/account. Printed outcomes carry
    // "identify methods for effective file management and distinguish
    // between digital and physical filing systems". The filing winner.
    url: "https://alison.com/course/secretarial-studies-and-office-administration",
    durationHours: 3,
    skillsAddressed: ["Recording, preparing, sorting, classifying and filing information"],
    careerId: "clerk",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Recording, preparing, sorting, classifying and filing information":
        "The file-management module contrasts digital and physical filing methods — the sort/classify/file rules the row prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-clerk-gap-equipment",
    title: "Equipment-issue register — declared resourceless-thin (adjudicated Wave E 2026-11-04: search landed template vendors and checklist downloads only — no taught self-serve page teaches the recording act; row stands as the declared thin)",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    skillsAddressed: ["Recording issue of equipment to staff"],
    careerId: "clerk",
  },
  // ── encode (5.3) — d/e split; crypto anchor rides the data-movement row ──
  // Wave B audit (2026-11-03, batch 4): access/form per-row. Google Applied
  // Digital Skills re-pointed onto the exceeds canonical lesson path (old
  // applieddigitalskills URL 301s, fetched LIVE) → taught/account; Google's
  // exceeds lesson catalog → landing; Microsoft support → RE-POINTED onto
  // the open Excel import how-to ("Import data from a CSV, HTML, or text
  // file", fetched LIVE 200 with the Get&Transform walkthrough steps) →
  // taught/direct, carrying the import/export-data cell; typing tutors both
  // taught/direct (fetched LIVE; Ratatype is the accuracy winner by id over
  // typing.com); the Sheets data-organization lesson path → taught/account
  // (fetched LIVE, title "Google Workspace: Sheets - Part 1"); TOP modules →
  // taught/account (303 login-wall verified LIVE); RA 10173 → reference. New
  // per-role fill (fetched LIVE 2026-11-03, user-ruled): Alison's
  // "Introduction to Electronic Document Management" — printed outcomes
  // carry the document lifecycle/versioning stages → the storing-completed-
  // documents cell. Wave E addition (fetched LIVE 2026-11-04,
  // user-delegated): typing.com's "Numeric Keypad / 10 Key" lesson (fetched
  // LIVE, 200, lesson title verified — the same typing.com family the
  // accuracy cell rides) → the operating-machines cell in its digital
  // keypad form (the modern calculating machine's interface; the legacy
  // bookkeeping-machine instance is the hardware the branch still names).
  // Coverage: 8/8 vetted.
  {
    id: "res-encode-ads-sheets",
    title: "Google Applied Digital Skills: Google Sheets for Beginners",
    provider: "Google for Education",
    type: "course",
    cost: "free",
    // free 45–90 min lesson
    // audit + re-point (2026-11-03, batch 4): the applieddigitalskills URL
    // 301s onto the exceeds canonical lesson path (fetched LIVE, title
    // "Google Sheets for Beginners"). taught/account (Google signup; the
    // standing migration re-check flag travels). The receive-and-register
    // and field-mapping winner (tier-2 creditingBody).
    url: "https://edu.exceedlms.com/student/path/1606124",
    durationHours: 1,
    skillsAddressed: ["Receiving & registering source documents for data capture", "Source-document reading & field mapping (entering from source material)"],
    creditingBody: "Google for Education",
    careerId: "encode",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Receiving & registering source documents for data capture":
        "The Sheets-for-Beginners lesson registers source data into structured sheets — the receive-and-log discipline of the data-capture loop.",
      "Source-document reading & field mapping (entering from source material)":
        "Entering data from source material into the sheet's fields is the lesson's core craft — the field-mapping leg.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-encode-ms-365",
    title: "Excel: how to import data from a CSV, HTML, or text file (Microsoft Support how-to)",
    provider: "Microsoft Support",
    type: "doc",
    cost: "free",
    // audit + re-point (2026-11-03, batch 4): the old M365-hub claim is
    // re-pointed onto the open Excel import how-to (fetched LIVE 200 —
    // "Import data from a CSV, HTML, or text file", the Get&Transform > From
    // File walkthrough with numbered steps) → taught/direct. The
    // import/export winner (sole claim; the office-side data movement — the
    // O*NET cryptographic anchor stays in the rowspec, and the
    // database-engine export leg is scoped honestly).
    url: "https://support.microsoft.com/en-us/excel/import-data-from-a-csv-html-or-text-file",
    durationHours: 2,
    skillsAddressed: ["Source-document reading & field mapping (entering from source material)", "Importing and exporting data between different database systems and softwares"],
    careerId: "encode",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Importing and exporting data between different database systems and softwares":
        "The Get&Transform walkthrough teaches moving CSV/text/HTML source data into Excel's data model — the software-boundary import leg; engine-to-engine export stays the craft scope note.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-encode-typing-com",
    title: "Typing.com lessons (accuracy-oriented)",
    provider: "Typing.com",
    type: "course",
    cost: "free",
    // free tutor with accuracy drills; ad-supported
    // audit (2026-11-03, batch 4): fetched LIVE (200, lessons title) →
    // taught/direct (open drills).
    url: "https://www.typing.com/student/lessons",
    durationHours: 3,
    skillsAddressed: ["Accuracy/error detection & correction"],
    careerId: "encode",
    form: "taught",
    access: "direct",
  },
  {
    id: "res-encode-ratatype",
    title: "Ratatype (typing tutor; certificate flow)",
    provider: "Ratatype",
    type: "course",
    cost: "free",
    // accuracy/speed evidence for the accuracy loop and the split thin rows
    // audit (2026-11-03, batch 4): fetched LIVE (200) → taught/direct. The
    // accuracy winner (id A–Z over typing.com).
    url: "https://www.ratatype.com/",
    durationHours: 3,
    skillsAddressed: [
      "Accuracy/error detection & correction",
      
      
    ],
    careerId: "encode",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Accuracy/error detection & correction":
        "Ratatype scores errors live and re-drills — the detect-and-correct loop the row prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-encode-sheets-organize",
    title: "Google Workspace: Sheets — data organization lesson set (sort/validate)",
    provider: "Google for Education (edu.exceedlms)",
    type: "course",
    cost: "free",
    // "Organize raw data with sorting, formatting, and data validation" —
    // direct pre-entry sorting/validation practice; credential-for-completion
    // audit (2026-11-03, batch 4): fetched LIVE (200, title "Google
    // Workspace: Sheets - Part 1") → taught/account. The compile/sort/verify
    // winner (sole claim).
    url: "https://edu.exceedlms.com/student/path/1606820",
    durationHours: 1,
    skillsAddressed: ["Compilation, sorting, verification before entry"],
    creditingBody: "Google for Education",
    careerId: "encode",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Compilation, sorting, verification before entry":
        "The Sheets data-organization lesson runs sorting, formatting and data validation — the compile/verify-before-entry craft verbatim.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-encode-top-digitallit",
    title: "Microsoft Digital Literacy (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // backs both split rows' tool/data-movement base
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; id 4716).
    url: "https://e-tesda.gov.ph/course/view.php?id=4716",
    durationHours: 4,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "encode",
    form: "taught",
    access: "account",
  },
  {
    id: "res-encode-top-data-privacy",
    title: "Practicing Data Privacy in the Workplace (TOP Digital Literacy)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // PH-specific confidentiality backing (Filipino-context examples)
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; id 4395). taught/account. The
    // confidentiality winner (over the statute reference).
    url: "https://e-tesda.gov.ph/course/view.php?id=4395",
    durationHours: 2,
    skillsAddressed: ["Confidentiality (Etiquette/Professionalism — Enabling)"],
    creditingBody: "TESDA",
    careerId: "encode",
    
    form: "taught",
    access: "account",
    learnNotes: {
      "Confidentiality (Etiquette/Professionalism — Enabling)":
        "The TOP data-privacy module teaches practicing workplace confidentiality with Filipino-context examples — the handling discipline the row prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-encode-ra10173",
    title: "Republic Act No. 10173 (Data Privacy Act of 2012)",
    provider: "Lawphil Project",
    type: "doc",
    cost: "free",
    // full statute text; privacy.gov.ph + officialgazette.gov.ph 403-blocked
    // this session — flagged
    // audit (2026-11-03, batch 4): statute text = reference (readable
    // material; no teaching flow).
    url: "http://www.lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html",
    durationHours: 2,
    skillsAddressed: ["Confidentiality (Etiquette/Professionalism — Enabling)"],
    careerId: "encode",
    pick: true,
    form: "reference",
    access: "direct",
  },
  {
    id: "res-encode-alison-edm",
    title: "Introduction to Electronic Document Management (Alison)",
    provider: "Alison",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 4 fill, user-ruled): "Start
    // Course Now", CPD-accredited → taught/account. Printed outcomes carry
    // the document-lifecycle stages and version-control/access-control
    // components → the storing-completed-documents-and-logs cell (the
    // electronic-side of records-throughput discipline).
    url: "https://alison.com/course/introduction-to-electronic-document-management",
    durationHours: 3,
    skillsAddressed: ["Storing completed documents & logs (records + throughput discipline)"],
    careerId: "encode",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Storing completed documents & logs (records + throughput discipline)":
        "The EDM course walks the document lifecycle through its storage stage with versioning and access control — the completed-document/log upkeep discipline.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-encode-typing-10key",
    title: "Numeric Keypad / 10 Key lesson (typing.com)",
    provider: "Typing.com",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-04 (Wave E fill, user-delegated): 200 on the
    // lesson page ("Typing Lessons | Numeric Keypad / 10 Key") — the same
    // open typing.com family the accuracy cell rides (taught/direct
    // standing). The lesson is pure numeric-keypad / 10-key entry drilling —
    // the operating craft for the modern calculating machine's interface
    // (the legacy bookkeeping/calculating machine is the keyed hardware the
    // row's source names; the keypad drills are its digital stand-in).
    url: "https://www.typing.com/student/lesson/351/numeric-keypad-10-key",
    durationHours: 2,
    skillsAddressed: ["Operating bookkeeping and calculating machines"],
    careerId: "encode",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Operating bookkeeping and calculating machines":
        "The 10-key lesson drills number-row and keypad entry without looking — the operating fluency the digital calculating machine's keypad runs on.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  // ── desk (5.5) — tourism-family honesty note rides the TOP front-office rows ──
  // Wave B audit (2026-11-03, batch 4): access/form per-row. TOP Moodle
  // modules → taught/account (303 login-wall verified LIVE); the Google/MS
  // hubs → landing (both re-pointed canonical — /a/users 200 hub, /office
  // 301s to the M365 hub, fetched LIVE); ADS re-pointed onto the exceeds
  // canonical lesson path (301 fetched LIVE) → taught/account; OpenLearn →
  // taught/direct (the standing keep-with-flag verification; curl 403 this
  // pass); IBM SkillsBuild home → landing. The NC II front-office rows win
  // the five lettered PSOC cells (tier-2 crediting + entry-path counts).
  // Wave E attempt (2026-11-04, user-delegated): the issuing-forms/information-
  // kits/brochures cell re-attempted — Alison "Office Procedures in the
  // Modern Workplace" fetched LIVE (200, CPD) but its printed outcomes stop
  // at office environment/equipment/communication (no form/brochure
  // distribution lesson); nothing else free-and-self-serve teaches the
  // counter's document-service act. Honest red kept (adjudicated Wave E
  // 2026-11-04: no taught claim exists — adviser-only). Coverage: 5/6
  // vetted.
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
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; id 4). taught/account. The five lettered
    // PSOC-cell winner (tier-2 crediting + entry-path counts, id A–Z over
    // the intro).
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
    
    form: "taught",
    access: "account",
    learnNotes: {
      "Answering inquiries about goods/services/policies (availability, location, price)":
        "The front-office modules answer guest/inquiry questions availability-first — the answered-inquiry craft with the tourism framing scoped to the corporate desk.",
      "Assisting on problems, advice, information (member of the counter service set)":
        "The reception/counter-service lessons walk assisting visitors with problems and advice — the counter-service-set behavior.",
      "Recording information about enquiries and complaints":
        "The front-office records lessons cover logging guest concerns and keeping the enquiry/complaint log — the recorded-information leg.",
      "Referring complex enquiries to team leaders or expert advisers":
        "The escalation elements (concierge/front-desk referring upward) carry the refer-onward craft; the NC II walks when-and-how to escalate.",
      "Communication & professionalism at the corporate front-desk (Enabling)":
        "The NC II's communication/professional conduct lessons are the taught front-desk etiquette core.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-desk-top-front-office-intro",
    title: "Introduction to Front Office Services (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // entry-level intro of the same family; same tourism-family honesty note
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; id 50).
    url: "https://e-tesda.gov.ph/course/view.php?id=50",
    durationHours: 3,
    skillsAddressed: [
      "Answering inquiries about goods/services/policies (availability, location, price)",
      "Assisting on problems, advice, information (member of the counter service set)",
      "Communication & professionalism at the corporate front-desk (Enabling)",
    ],
    creditingBody: "TESDA",
    careerId: "desk",
    form: "taught",
    access: "account",
  },
  {
    id: "res-desk-top-workplace-comms",
    title: "Participating in Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; id 56).
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
    form: "taught",
    access: "account",
  },
  {
    id: "res-desk-ads-sheets",
    title: "Google Applied Digital Skills: Google Sheets for Beginners",
    provider: "Google for Education",
    type: "course",
    cost: "free",
    // spreadsheet-logging lesson (header row + entries)
    // audit + re-point (2026-11-03, batch 4): the applieddigitalskills URL
    // 301s onto the exceeds canonical lesson path (fetched LIVE) → taught/
    // account. The recording cell's runner-up (the NC II row wins tier-2+3).
    url: "https://edu.exceedlms.com/student/path/1606124",
    durationHours: 1,
    skillsAddressed: ["Recording information about enquiries and complaints"],
    creditingBody: "Google for Education",
    careerId: "desk",
    pick: true,
    form: "taught",
    access: "account",
  },
  {
    id: "res-desk-ms-365",
    title: "Microsoft 365 help & learning",
    provider: "Microsoft Support",
    type: "doc",
    cost: "free",
    // producing/typing forms and handouts
    // audit + re-point (2026-11-03, batch 4): the old /en-us/office path 301s
    // onto the canonical M365 hub (fetched LIVE) → landing (ADDR empty per
    // §6.1).
    url: "https://support.microsoft.com/en-US/microsoft-365",
    durationHours: 2,
    skillsAddressed: [],
    careerId: "desk",
    form: "landing",
    access: "direct",
  },
  {
    id: "res-desk-top-ilo-humanskills",
    title: "Module 3: Building Human Skills for Career Success (TOP × ILO)",
    provider: "TESDA TOP × ILO",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; id 2014).
    url: "https://e-tesda.gov.ph/course/view.php?id=2014",
    durationHours: 2,
    skillsAddressed: ["Communication & professionalism at the corporate front-desk (Enabling)"],
    creditingBody: "TESDA × ILO",
    careerId: "desk",
    pick: true,
    form: "taught",
    access: "account",
  },
  {
    id: "res-desk-openlearn-comms",
    title: "Effective communication in the workplace",
    provider: "Open University (OpenLearn)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 4): the standing family verification carries
    // the grade (course page open in browser → taught/direct; curl 403 —
    // the keep-with-flag line).
    // adopted 403 verdict line (keep-with-flag; flipped from "dropped" 2026-10-29)
    url: "https://www.open.edu/openlearn/money-business/effective-communication-the-workplace",
    durationHours: 3,
    skillsAddressed: ["Communication & professionalism at the corporate front-desk (Enabling)"],
    careerId: "desk",
    form: "taught",
    access: "direct",
  },
  // ── execsec (E2) — rebuilt to the blessed execsec.md pool (pre-blessing
  // round-12 scaffolds retired; the NARA rows are not in the blessed pool) ──
  // Wave B audit (2026-11-03, batch 4): access/form per-row. Coursera rows
  // graded taught/exam-paid (fetched LIVE "Enroll for free": Work Smarter,
  // Plus the new Madecraft meetings course); Google Calendar / M365 /
  // Workspace / Meet / Gmail help docs: Calendar re-pointed onto the general
  // hub (/getstarted 301s fetched LIVE), M365 re-pointed onto the canonical
  // M365 hub (/office 301s fetched LIVE), Google Meet graded reference,
  // Gmail RE-POINTED onto the GCF/LearnFree Gmail lesson series (308
  // verified fresh) → taught/direct; TOP modules → taught/account (303
  // login-wall verified LIVE); AccountingCoach RE-POINTED onto its open
  // "Payroll Accounting: In-Depth Explanation" lesson (fetched LIVE 200) →
  // taught/direct; UK National Archives guidance → reference; Google AI
  // Educator category listing → landing. Three new per-role fills (fetched
  // LIVE 2026-11-03, user-ruled): Madecraft's "How to Stop Wasting Time in
  // Meetings" (printed outcomes: structuring meetings + "take notes that
  // drive real follow-through" — meeting administration/minutes), ADP's
  // verified "The Payroll Cycle" per-role dup (the timekeeping module —
  // employee time-recording), and Alison's "Diploma in Administrative
  // Procedures and Office Support" (printed outcomes: "Plan travel, meetings,
  // and events with attention to detail, vendors, and follow-up tasks" +
  // binder/document organization — travel and records-filing). Honest reds
  // kept (searched; the purchase book holds the real craft): executive
  // research & briefing support, administrative policy setup, representing
  // the executive, supervision/training of clerical staff, operating-
  // practice review. Coverage: 12/17 vetted.
  // Wave E final hunt (fetched LIVE fresh 2026-11-04, user-delegated): three
  // taught fills land — Coursera's "Report Findings Effectively" (Enroll for
  // free, 2 modules/2 h; the four-section executive-report framework +
  // two-page executive-summary compile + translate-findings-into-executive-
  // language leg → Research & briefing support), Alison's "Introduction to
  // Supervision" per-role dup (Start Course Now, CPD; supervision
  // responsibilities/delegation/coaching-vs-mentoring outcomes → Supervision
  // & training of clerical staff) and Alison's "Process Improvement in
  // Practice" (Start Course Now, CPD; identify-broken-process/select-best-
  // process/10-step methodology outcomes → Operating-practice review). Two
  // honest reds stay, adjudicated Wave E 2026-11-04 (one honest attempt
  // each; the batch-4 search lands confirm):
  //   · Administrative policy setup & interpretation — the open field prints
  //     office-procedures-manual TEMPLATES and guide PDFs (no course page
  //     teaching the explain/write-the-rules craft); policy-manual ruling
  //     pages are firm-form templates, not taught pages. Adviser-owned.
  //   · Representing executives / meeting on their behalf — the closest
  //     taught pages (EA-skills, minute-taking) cover scheduling/minutes,
  //     never the attend-for-the-executive-and-report-back duty. Adviser-
  //     owned.
  // Coverage: 15/17 vetted (2 adjudicated-only reds).
  {
    id: "res-execsec-work-smarter",
    title: "Work Smarter, Not Harder: Time Management for Personal & Professional Productivity",
    provider: "Coursera (UC Irvine)",
    type: "course",
    cost: "free",
    // VE3-3: audit-availability re-check before fixture copy — if audit is
    // not offered at re-check, treat as paid and drop
    // audit (2026-11-03, batch 4): fetched LIVE "Enroll for free" →
    // taught/exam-paid. The schedule winner (sole vetted claim).
    url: "https://www.coursera.org/learn/work-smarter-not-harder",
    durationHours: 6,
    skillsAddressed: ["Executive schedule & calendar management"],
    careerId: "execsec",
    
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Executive schedule & calendar management":
        "Irvine's time-management modules plan around the calendar — the disciplined scheduling/estimating line the executive seat runs.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-execsec-gcal",
    title: "Google Calendar Help (official docs)",
    provider: "Google",
    type: "doc",
    cost: "free",
    // scheduling docs + itinerary-as-calendar practice
    // audit + re-point (2026-11-03, batch 4): /getstarted 301s onto the
    // general Calendar hub (fetched LIVE) → landing (help-hub).
    url: "https://support.google.com/calendar/",
    durationHours: 1,
    skillsAddressed: ["Executive schedule & calendar management", "Travel arrangements"],
    careerId: "execsec",
    pick: true,
    form: "landing",
    access: "direct",
  },
  {
    id: "res-execsec-ms-365",
    title: "Microsoft 365 help & learning",
    provider: "Microsoft Support",
    type: "doc",
    cost: "free",
    // the "word processing, spreadsheet, database, or presentation software"
    // clause's direct back + timesheet practice docs
    // audit + re-point (2026-11-03, batch 4): the old /en-us/office path 301s
    // onto the canonical M365 hub (fetched LIVE) → landing. The time-tracking
    // and minutes cells ride red on it; the taught legs arrive via the
    // per-role fills below.
    url: "https://support.microsoft.com/en-US/microsoft-365",
    durationHours: 2,
    skillsAddressed: ["Correspondence & document production", "Meeting administration & minutes", "Employee time-tracking"],
    careerId: "execsec",
    pick: true,
    form: "landing",
    access: "direct",
  },
  {
    id: "res-execsec-owl-memos",
    title: "Purdue OWL — Memos (Professional/Technical Writing)",
    provider: "Purdue University",
    type: "doc",
    cost: "free",
    // memo/minutes-adjacent writing
    // audit (2026-11-03, batch 4): fetched LIVE (200) — open writing
    // tutorial → taught/direct. The correspondence winner (id A–Z over the
    // paid Madecraft fill loses on hours? no — the Coursera Madecraft dup is
    // the minutes winner; correspondence stays here).
    url: "https://owl.purdue.edu/owl/subject_specific_writing/professional_technical_writing/memos/index.html",
    durationHours: 2,
    skillsAddressed: ["Correspondence & document production", "Meeting administration & minutes"],
    careerId: "execsec",
    form: "taught",
    access: "direct",
    learnNotes: {
      "Correspondence & document production":
        "The OWL memos section teaches the memo format, audience and organization — the routine structural correspondence the row prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-execsec-top-receiving-comms",
    title: "Receiving and Responding to Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; id 52). The gatekeeping cell's runner-up
    // (the front-office NC II wins the id race).
    url: "https://e-tesda.gov.ph/course/view.php?id=52",
    durationHours: 2,
    skillsAddressed: ["Information gatekeeping: calls & visitors"],
    creditingBody: "TESDA",
    careerId: "execsec",
    pick: true,
    form: "taught",
    access: "account",
  },
  {
    id: "res-execsec-top-front-office",
    title: "Providing Front Office Services (TOP Tourism, Front Office Services NC II)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // reception/visitor conduct; same tourism-family honesty note as desk
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; id 4). taught/account. The gatekeeping
    // winner (tier-2 tie; id A–Z over the receiving module).
    url: "https://e-tesda.gov.ph/course/view.php?id=4",
    durationHours: 12,
    skillsAddressed: ["Information gatekeeping: calls & visitors"],
    creditingBody: "TESDA",
    careerId: "execsec",
    
    form: "taught",
    access: "account",
    learnNotes: {
      "Information gatekeeping: calls & visitors":
        "The front-office reception lessons manage incoming calls and visitor flow — screening, logging and routing the executive's traffic (tourism framing scoped).",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-execsec-google-ai-admin",
    title: "Google AI Educator Series: Administrative Applications",
    provider: "Google for Education (edu.exceedlms)",
    type: "course",
    cost: "free",
    // AI-assisted drafting/research; free w/ Google account; TOP-mirrored
    // (ICT category 2160, verified public 200)
    // audit (2026-11-03, batch 4): fetched LIVE — the listing now resolves to
    // a catalog index whose lessons are teacher workflows (grants, coaching,
    // parent comms) with no executive-briefing lesson → landing (fail-closed).
    // The research & briefing cell rides red on it (adviser-only).
    url: "https://edu.exceedlms.com/student/catalog/list?category_ids=11692-google-ai-educator-series-administrative-applications",
    durationHours: 2,
    skillsAddressed: ["Research & briefing support for executives"],
    creditingBody: "Google for Education",
    careerId: "execsec",
    form: "landing",
    access: "account",
  },
  {
    id: "res-execsec-gmail",
    title: "Gmail (lesson series) — GCFGlobal",
    provider: "GCFGlobal",
    type: "doc",
    cost: "free",
    // labels/filter/route docs — the triage row's tool layer
    // audit + re-point (2026-11-03, batch 4): re-pointed onto the GCF/LearnFree
    // Gmail lesson series. Close-out re-point (fetched LIVE 2026-11-04): the
    // re-host's /en/gmail/ path vanished (404) — the standing lesson series
    // lives at learnfree.org/series/gmail (HTTP 200 verified fresh) →
    // taught/direct. The triage winner (labels/filters/archiving = the
    // incoming-material triage layer).
    url: "https://www.learnfree.org/series/gmail",
    durationHours: 1,
    skillsAddressed: ["Incoming-material triage & distribution"],
    careerId: "execsec",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Incoming-material triage & distribution":
        "The Gmail series teaches filters, labels and archiving — the sort-route-file triage loop for incoming material (the electronic leg; physical mail stays the desk craft).",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-execsec-top-intro-bookkeeping",
    title: "Introduction to Bookkeeping (TOP Bookkeeping NC III module)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // budget-prep-assistance clause backing
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; id 3981). taught/account. The coordination
    // winner (sole claim).
    url: "https://e-tesda.gov.ph/course/view.php?id=3981",
    durationHours: 3,
    skillsAddressed: ["Office services coordination"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "execsec",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Office services coordination":
        "The intro-bookkeeping module teaches documenting and servicing the office's financial transactions — the coordination paperwork the budget-prep clause backs.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-execsec-accountingcoach",
    title: "Payroll Accounting: In-Depth Explanation (AccountingCoach)",
    provider: "AccountingCoach",
    type: "doc",
    cost: "free",
    // free text-based accounting; pro features sold — use the free layer
    // audit + re-point (2026-11-03, batch 4): the accountingcoach home was a
    // lesson-catalog landing; RE-POINTED onto the open deep lesson (fetched
    // LIVE 200 — "Payroll Accounting: In-Depth Explanation with Examples",
    // step-by-step explanations) → taught/direct. The payroll-information
    // winner (sole vetted claim; PRO Plus upsell noted).
    url: "https://www.accountingcoach.com/payroll-accounting/explanation/1",
    durationHours: 3,
    skillsAddressed: ["Payroll-information processing", "General office duties & tools"],
    careerId: "execsec",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Payroll-information processing":
        "The payroll lesson walks gross-to-net computation, payroll registers and the journal entries — processing the payroll information the row prints (the run-the-actual-payroll leg rides the ADP fill in the pool).",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-execsec-top-journalizing",
    title: "Journalizing Transactions (TOP Bookkeeping NC III module)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; id 3982).
    url: "https://e-tesda.gov.ph/course/view.php?id=3982",
    durationHours: 4,
    skillsAddressed: [],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "execsec",
    form: "taught",
    access: "account",
  },
  {
    id: "res-execsec-top-workplace-comms",
    title: "Participating in Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // liaison/clerical-cooperation backing
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; id 56). taught/account. The general-office
    // and clerical-cooperation winners (tier-2 creditingBody).
    url: "https://e-tesda.gov.ph/course/view.php?id=56",
    durationHours: 2,
    skillsAddressed: ["General office duties & tools", "Clerical support across departments"],
    creditingBody: "TESDA",
    careerId: "execsec",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "General office duties & tools":
        "The workplace-communication unit is the taught general-office exchange discipline (obtaining/providing information across tasks and tools).",
      "Clerical support across departments":
        "Participating-in-communication across workplace contexts trains the cross-department relay/correspondence a clerical support seat runs.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-execsec-top-ilo-humanskills",
    title: "Module 3: Building Human Skills for Career Success (TOP × ILO)",
    provider: "TESDA TOP × ILO",
    type: "course",
    cost: "free",
    // any-row human-skills add
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; id 2014).
    url: "https://e-tesda.gov.ph/course/view.php?id=2014",
    durationHours: 2,
    skillsAddressed: [],
    creditingBody: "TESDA × ILO",
    careerId: "execsec",
    form: "taught",
    access: "account",
  },
  {
    id: "res-execsec-skillsbuild",
    title: "IBM SkillsBuild (workplace/leadership-adjacent badges)",
    provider: "IBM",
    type: "course",
    cost: "free",
    // senior-heavy rows' free backing side (the book rides PURCHASE_BOOKS)
    // audit (2026-11-03, batch 4): fetched LIVE — marketing shell → landing.
    url: "https://skillsbuild.org/",
    durationHours: 3,
    skillsAddressed: [],
    careerId: "execsec",
    form: "landing",
    access: "account",
  },
  {
    id: "res-execsec-uk-archives",
    title: "The National Archives (UK) — Information management",
    provider: "The National Archives (UK)",
    type: "doc",
    cost: "free",
    // UK retention law not transferable — transfer the records discipline
    // audit (2026-11-03, batch 4): fetched LIVE (200) → reference. The
    // records-filing cell rides red on it; the taught leg is the Alison
    // diploma fill below.
    url: "https://www.nationalarchives.gov.uk/information-management/",
    durationHours: 3,
    skillsAddressed: ["Records & document filing/retrieval"],
    careerId: "execsec",
    pick: true,
    form: "reference",
    access: "direct",
  },
  {
    id: "res-execsec-madecraft-meetings",
    title: "How to Stop Wasting Time in Meetings (Madecraft)",
    provider: "Coursera (Madecraft)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 4 fill, user-ruled): "Enroll for
    // free", 3 modules — printed outcomes: "how to open, structure, and close
    // meetings" + "assign roles and take notes that drive real follow-through"
    // → taught/exam-paid. The meeting-administration/minutes winner (id A–Z
    // over the OWL memos runner-up). ₱ paid tier: certificate.
    url: "https://www.coursera.org/learn/how-to-stop-wasting-time-in-meetings",
    durationHours: 2,
    skillsAddressed: ["Meeting administration & minutes"],
    careerId: "execsec",
    pick: true,
    
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Meeting administration & minutes":
        "The meetings course teaches structuring the meeting and taking recorded notes that drive follow-through — the minutes/administration craft.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-execsec-adp-payroll-cycle",
    title: "The Payroll Cycle (ADP Entry-Level Payroll Specialist)",
    provider: "Coursera (ADP Learning Academy)",
    type: "course",
    cost: "free",
    // per-role dup of the batch-3-verified res-pay-adp-payroll-cycle row
    // (re-verified LIVE 2026-11-03: "Enroll for free"). The timekeeping
    // module ("record/manage employee work minutes") carries the
    // employee-time-tracking cell. taught/exam-paid.
    url: "https://www.coursera.org/learn/adp-the-payroll-cycle",
    durationHours: 12,
    skillsAddressed: ["Employee time-tracking"],
    careerId: "execsec",
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Employee time-tracking":
        "The ADP timekeeping module records and manages employee work minutes into the payroll system — the time-record upkeep the row prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-execsec-alison-diploma",
    title: "Administrative Procedures and Office Support (Alison Diploma)",
    provider: "Alison",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-03 (Wave B batch 4 fill, user-ruled): "Start
    // Course Now", CPD-accredited diploma → taught/account. Printed outcomes
    // carry "Plan travel, meetings, and events with attention to detail,
    // vendors, and follow-up tasks" and "Arrange binder contents to ensure
    // accessible and professional document organisation" → the travel and
    // records-filing winners.
    url: "https://alison.com/course/diploma-in-administrative-procedures-and-office-support",
    durationHours: 8,
    skillsAddressed: ["Travel arrangements", "Records & document filing/retrieval"],
    careerId: "execsec",
    
    form: "taught",
    access: "account",
    learnNotes: {
      "Travel arrangements":
        "The procedures module teaches planning travel/meetings/events end-to-end — vendors, details and follow-up tasks per its printed outcome.",
      "Records & document filing/retrieval":
        "The document-organisation outcome (arranging binder/file contents accessibly) is the filing/retrieval discipline the row prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-execsec-coursera-report",
    title: "Report Findings Effectively (Coursera)",
    provider: "Coursera",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-04 (Wave E final-hunt fill, user-delegated):
    // "Enroll for free", 2 modules / 2 h, beginner — printed outcomes teach
    // transforming gathered material into a clear two-page executive report,
    // the four-section briefing framework (Objective · Methodology · Findings
    // · Actions) that builds credibility with decision-makers, writing
    // recommendations with owners and timelines, translating technical
    // findings into executive-friendly language, and diagnosing a poorly
    // structured report plus defending the structure to a skeptical VP.
    // The shape-information-into-briefing-papers craft (the dig-up leg rides
    // the research routine the report's Methodology section anchors).
    // ₱ paid tier: shareable certificate (audit/financial-aid free). The
    // research & briefing winner (sole vetted claim; the Google AI educator
    // category and Workspace hub stay landing fail-closed pool provenance).
    url: "https://www.coursera.org/learn/report-findings-effectively",
    durationHours: 2,
    skillsAddressed: ["Research & briefing support for executives"],
    careerId: "execsec",
    pick: true,
    form: "taught",
    access: "exam-paid",
    learnNotes: {
      "Research & briefing support for executives":
        "The course teaches compiling gathered information into a two-page executive report on the four-section briefing framework — Objective, Methodology, Findings, Actions — so the recommendation reaches decision-makers in a form they can act on.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-execsec-alison-supervision",
    title: "Introduction to Supervision (Alison)",
    provider: "Alison",
    type: "course",
    cost: "free",
    // per-role dup of the Wave-E-verified res-audit-alison-supervision row
    // (re-verified LIVE fresh 2026-11-04, user-delegated — Wave E rules
    // fresh fetches): "Start Course Now", 1.5-3 h, CPD-accredited, beginner
    // level — printed outcomes define supervision and the responsibilities
    // of a supervisor, drill delegating successfully, list ways to motivate
    // subordinates, establish why trust matters, and teach the
    // coaching-vs-mentoring distinction alongside leadership principles.
    // The onboard-and-guide-the-junior-clerks craft in taught form.
    // Certificate optional (paid).
    url: "https://alison.com/course/introduction-to-supervision",
    durationHours: 3,
    skillsAddressed: ["Supervision & training of clerical staff"],
    careerId: "execsec",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Supervision & training of clerical staff":
        "The course teaches supervising a junior team — the supervisor's responsibilities, delegating tasks successfully, motivating and building trust with subordinates, and the coaching-vs-mentoring split that shapes how a new clerk gets trained.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-execsec-alison-process",
    title: "Process Improvement in Practice (Alison)",
    provider: "Alison",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-04 (Wave E final-hunt fill, user-delegated):
    // "Start Course Now", 1.5-3 h (Contains Video), CPD-accredited,
    // beginner level — printed outcomes teach identifying a broken process
    // in the workplace, selecting the best process for improvement using
    // mathematical techniques, process mapping at macro/functional/task
    // levels, and applying the Ten-Step Process Improvement Methodology in a
    // real-life case study — the spot-the-slow-spots-and-propose-fixes
    // review craft the row prints. Certificate optional (paid). The
    // operating-practice winner (sole claim).
    url: "https://alison.com/course/process-improvement-in-practice",
    durationHours: 2,
    skillsAddressed: ["Operating-practice review"],
    careerId: "execsec",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Operating-practice review":
        "The course teaches the 10-step improvement review — mapping the workflow to find where it breaks down, picking the right process to fix with selection math, and proposing the redesign — the find-the-slow-spots-and-fix-them craft.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  // ── records (E3) — rebuilt to the blessed records.md pool (per-row linkage;
  // purchase books ride PURCHASE_BOOKS; the pre-blessing NARA lessons retire) ──
  // Wave B audit (2026-11-03, batch 4): access/form per-row. The UK National
  // Archives guidance → reference; TOP modules → taught/account (303
  // login-wall verified LIVE); the Google Workspace/M365/Calendar hubs →
  // landing (re-pointed canonical: /office 301s + /getstarted 301s, fetched
  // LIVE); ADS re-pointed onto the exceeds canonical lesson path (301,
  // fetched LIVE) → taught/account; Gmail RE-POINTED onto the GCF/LearnFree
  // Gmail lesson series (308 verified fresh) → taught/direct. New per-role
  // fill (fetched LIVE 2026-11-03, user-ruled): Alison's "Secretarial
  // Studies and Office Administration" — printed outcomes carry
  // "identify methods for effective file management and distinguish between
  // digital and physical filing systems" → the filing-chain and scheduling
  // cells. Honest reds kept (no taught self-serve page verified this pass):
  // the reprographics machine craft and the front-office record/database
  // upkeep row (the hub claims grade landing fail-closed). Coverage: 9/11
  // vetted.
  // Wave E final hunt (fetched LIVE fresh 2026-11-04, user-delegated): both
  // remaining cells fill — the Microsoft Windows-scanner walkthrough arrives
  // as a per-role dup (re-verified LIVE fresh; the reproduce-and-view/send
  // flow → the reprographics cell's digital-reproduction form, the clerk
  // photocopy precedent) and Alison's "Data Documentation and Record
  // Keeping for Organisational Excellence" fills the upkeep cell (Start
  // Course Now, CPD; storage/retrieval ordering, DBMS function, version-
  // control outcomes; the contact-record specifics ride the same records-
  // upkeep family). Coverage: 11/11 vetted.
  {
    id: "res-records-uk-archives",
    title: "The National Archives (UK) — Information management",
    provider: "The National Archives (UK)",
    type: "doc",
    cost: "free",
    // records-creation/keeping/retrieval/evaluation guidance
    // audit (2026-11-03, batch 4): fetched LIVE (200, title verified) →
    // reference. The filing-chain cells ride red on it; the taught leg is
    // the Alison per-role dup below.
    url: "https://www.nationalarchives.gov.uk/information-management/",
    durationHours: 3,
    skillsAddressed: ["Sort & classify materials to filing rules", "Filing into storage (drawers/cabinets/boxes)", "File retrieval on request"],
    careerId: "records",
    
    form: "reference",
    access: "direct",
  },
  {
    id: "res-records-top-digitallit",
    title: "Microsoft Digital Literacy (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // electronic-filing side + hardware-basic operation
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; id 4716).
    url: "https://e-tesda.gov.ph/course/view.php?id=4716",
    durationHours: 4,
    skillsAddressed: [],
    creditingBody: "TESDA",
    careerId: "records",
    form: "taught",
    access: "account",
  },
  {
    id: "res-records-ads-sheets",
    title: "Google Applied Digital Skills: Google Sheets for Beginners",
    provider: "Google for Education",
    type: "course",
    cost: "free",
    // spreadsheet log practice for the filing-log row
    // audit + re-point (2026-11-03, batch 4): the applieddigitalskills URL
    // 301s onto the exceeds canonical lesson path (fetched LIVE) → taught/
    // account. The filing-log winner (tier-2 creditingBody).
    url: "https://edu.exceedlms.com/student/path/1606124",
    durationHours: 1,
    skillsAddressed: ["Filing log / records of materials filed & removed"],
    creditingBody: "Google for Education",
    careerId: "records",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Filing log / records of materials filed & removed":
        "The Sheets-for-Beginners lesson builds the logged-entry sheet pattern — the filed/removed log the row prints.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-records-workspace",
    title: "Google Workspace Learning Center",
    provider: "Google",
    type: "doc",
    cost: "free",
    // shared-Drive record maintenance hub
    // audit (2026-11-03, batch 4): fetched LIVE (200, hub title) → landing
    // (fail-closed). The database-upkeep cell rides red on it.
    // pick flag retired (Wave E final hunt 2026-11-04): the Alison
    // Data-Documentation fill now wins the upkeep cell (fallbackSort
    // provider A–Z); the hub keeps the pool provenance only (landing rows
    // never satisfy the gate).
    url: "https://support.google.com/a/users",
    durationHours: 2,
    skillsAddressed: ["Filing log / records of materials filed & removed", "Front-office record & database upkeep"],
    careerId: "records",
    form: "landing",
    access: "direct",
  },
  {
    id: "res-records-ms-365",
    title: "Microsoft 365 help & learning",
    provider: "Microsoft Support",
    type: "doc",
    cost: "free",
    // scanning/printing/PDF-flow docs
    // audit + re-point (2026-11-03, batch 4): the old /en-us/office path 301s
    // onto the canonical M365 hub (fetched LIVE) → landing (ADDR empty per
    // §6.1).
    url: "https://support.microsoft.com/en-US/microsoft-365",
    durationHours: 2,
    skillsAddressed: [],
    careerId: "records",
    form: "landing",
    access: "direct",
  },
  {
    id: "res-records-top-front-office",
    title: "Providing Front Office Services (TOP Tourism, Front Office Services NC II)",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // reception corroboration rows; tourism-family honesty note (as desk)
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; id 4). taught/account. The telephone/
    // front-desk and visitor winners (tier-2 tie, free tie, id A–Z over the
    // intro row).
    url: "https://e-tesda.gov.ph/course/view.php?id=4",
    durationHours: 12,
    skillsAddressed: ["Telephone, switchboard & front-desk duties", "Visitor greeting & routing"],
    creditingBody: "TESDA",
    careerId: "records",
    form: "taught",
    access: "account",
    learnNotes: {
      "Telephone, switchboard & front-desk duties":
        "The NC II reception modules run the telephone/front-desk conduct and message handling — the switchboard-side duties (tourism framing scoped, as desk).",
      "Visitor greeting & routing":
        "The reception/visitor-service lessons teach greeting and routing guests — the front-desk greeting craft.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-records-top-front-office-intro",
    title: "Introduction to Front Office Services (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; id 50). The NC II row wins the id race for
    // the two front-office cells.
    url: "https://e-tesda.gov.ph/course/view.php?id=50",
    durationHours: 3,
    skillsAddressed: ["Telephone, switchboard & front-desk duties", "Visitor greeting & routing"],
    creditingBody: "TESDA",
    careerId: "records",
    pick: true,
    form: "taught",
    access: "account",
  },
  {
    id: "res-records-gcal",
    title: "Google Calendar Help (official docs)",
    provider: "Google",
    type: "doc",
    cost: "free",
    // scheduling row backing
    // audit + re-point (2026-11-03, batch 4): /getstarted 301s onto the
    // general Calendar hub (fetched LIVE) → landing.
    url: "https://support.google.com/calendar/",
    durationHours: 1,
    skillsAddressed: ["Appointment & calendar scheduling"],
    careerId: "records",
    pick: true,
    form: "landing",
    access: "direct",
  },
  {
    id: "res-records-gmail",
    title: "Gmail (lesson series) — GCFGlobal",
    provider: "GCFGlobal",
    type: "doc",
    cost: "free",
    // labels/filters/archiving for mail handling
    // audit + re-point (2026-11-03, batch 4): re-pointed onto the GCF/
    // LearnFree Gmail lesson series. Close-out re-point (fetched LIVE
    // 2026-11-04): the re-host's /en/gmail/ path vanished (404) — the
    // standing lesson series lives at learnfree.org/series/gmail
    // (HTTP 200 verified fresh) → taught/direct. The mail-handling winner
    // (the electronic-mail leg).
    url: "https://www.learnfree.org/series/gmail",
    durationHours: 1,
    skillsAddressed: ["Mail & document handling"],
    careerId: "records",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Mail & document handling":
        "The Gmail series teaches labels, filters and archiving — the electronic mail-and-documents handling loop.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-records-top-workplace-comms",
    title: "Participating in Workplace Communication (TOP)",
    provider: "TESDA Online Program (TOP)",
    type: "course",
    cost: "free",
    // speaking/listening emphasis
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; id 56). The info/CS-communication cell's
    // runner-up (the ILO module wins the id race).
    url: "https://e-tesda.gov.ph/course/view.php?id=56",
    durationHours: 2,
    skillsAddressed: ["Info & customer-service communication"],
    creditingBody: "TESDA",
    careerId: "records",
    pick: true,
    form: "taught",
    access: "account",
  },
  {
    id: "res-records-top-ilo-humanskills",
    title: "Module 3: Building Human Skills for Career Success (TOP × ILO)",
    provider: "TESDA TOP × ILO",
    type: "course",
    cost: "free",
    // audit (2026-11-03, batch 4): TOP Moodle module → account (303
    // login-wall verified LIVE; id 2014). taught/account. The info/CS
    // communication winner (id A–Z over the participated module).
    url: "https://e-tesda.gov.ph/course/view.php?id=2014",
    durationHours: 2,
    skillsAddressed: ["Info & customer-service communication"],
    creditingBody: "TESDA × ILO",
    careerId: "records",
    
    form: "taught",
    access: "account",
    learnNotes: {
      "Info & customer-service communication":
        "The ILO human-skills module drills the communication/service conduct for service seats — information sharing plus courtesy in one taught track.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-records-alison-secretarial",
    title: "Secretarial Studies and Office Administration (Alison)",
    provider: "Alison",
    type: "course",
    cost: "free",
    // per-role dup of the batch-4-verified res-clerk-alison-secretarial row
    // (re-verified LIVE 2026-11-03: "Start Course Now", CPD-accredited) →
    // taught/account. Printed outcomes carry "identify methods for effective
    // file management and distinguish between digital and physical filing
    // systems" and "list the steps for planning and organizing meetings" →
    // the filing-chain and scheduling winners.
    url: "https://alison.com/course/secretarial-studies-and-office-administration",
    durationHours: 3,
    skillsAddressed: [
      "Sort & classify materials to filing rules",
      "Filing into storage (drawers/cabinets/boxes)",
      "File retrieval on request",
      "Appointment & calendar scheduling",
    ],
    careerId: "records",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Sort & classify materials to filing rules":
        "The file-management module contrasts digital and physical filing methods — the sorting/classifying rules the row prints.",
      "Filing into storage (drawers/cabinets/boxes)":
        "The physical-filing leg of the same module (distinct filing systems, cabinet storage) — the stored-record discipline.",
      "File retrieval on request":
        "The filing-system module's index/retrieval logic covers finding the filed record on call.",
      "Appointment & calendar scheduling":
        "The meetings/calendars module walks planning and organizing meetings and calendar entries — the scheduling craft.",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-records-ms-scanner",
    title: "Install and use a scanner in Windows (Microsoft Support how-to)",
    provider: "Microsoft Support",
    type: "doc",
    cost: "free",
    // per-role dup of the Wave-E-verified res-clerk-ms-365 row (re-verified
    // LIVE fresh 2026-11-04, user-delegated — Wave E rules fresh fetches):
    // 200 on the deep walkthrough — install the scanner (local and network
    // discovery), flatbed/feeder placement rules, the Windows Scan app's
    // numbered steps (source/file-type/save location), then view, edit or
    // send the saved scan. Scanning is the copy machine's workflow side —
    // the reproduced-image leg of reprographics (the encode import-how-to
    // and clerk photocopy precedents); the photocopier/fax hardware craft
    // rides the same machine-operation family (scoped in-row).
    url: "https://support.microsoft.com/en-us/windows/hardware/printer/install-and-use-a-scanner-in-windows",
    durationHours: 2,
    skillsAddressed: ["Reprographics: photocopy, scan, fax"],
    careerId: "records",
    pick: true,
    form: "taught",
    access: "direct",
    learnNotes: {
      "Reprographics: photocopy, scan, fax":
        "The walkthrough teaches running a reproduction end to end — install the scanner, place the document flatbed/feeder-correct, run the Windows Scan app's numbered steps, then view and send the saved copy — the reproduce-and-share workflow (the photocopier/fax hardware legs ride the same machine-operation family).",
    },
    // learn line — authored 2026-11-03, user-delegated
  },
  {
    id: "res-records-alison-doc-records",
    title: "Data Documentation and Record Keeping for Organisational Excellence (Alison)",
    provider: "Alison",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-11-04 (Wave E final-hunt fill, user-delegated):
    // "Start Course Now", 1.5-3 h (Contains Video), CPD-accredited,
    // advanced level — printed outcomes teach the value of data
    // documentation, ordering data efficiently for optimal storage and
    // retrieval, the function and importance of database management
    // systems, organised vs unstructured storage, and applying version
    // control to keep data files current — the keep-the-records-and-
    // database-current upkeep craft (the contact-record specifics ride the
    // same records-upkeep family, scoped in-row). Certificate optional
    // (paid). The upkeep winner (the Workspace hub/catalog claims stay
    // landing fail-closed in the pool).
    url: "https://alison.com/course/data-documentation-and-record-keeping-for-organisational-excellence",
    durationHours: 2,
    skillsAddressed: ["Front-office record & database upkeep"],
    careerId: "records",
    pick: true,
    form: "taught",
    access: "account",
    learnNotes: {
      "Front-office record & database upkeep":
        "The course teaches keeping the records-and-database side current — ordering data for storage and retrieval, the database-management-systems craft, organised-vs-unstructured storage, and version control that keeps files up to date.",
    },
    // learn line — authored 2026-11-03, user-delegated
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

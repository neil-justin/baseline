import type { Resource } from "@/lib/types";

/**
 * Resource catalog — single typed catalog (schema: features.md §6.8).
 * Catalog round 10 (pool-per-skill convention): COMPLETE free pools are
 * authored for the demo trio's swd map only (roster 2.1, Neil's role); the QA
 * money-shot resource exists because the canon walk needs it; everything else
 * is scaffolded for a later dispatch (~35 more roles pending; see report).
 * Catalog round 12: full pools for the E-extension trio — `da` (E1, 13 rows:
 * one per skill, the Google Data Analytics family + Kaggle + official docs +
 * NPC privacy materials), `execsec` (E2, 17 rows) and `records` (E3, 11 rows).
 * Every URL was fetched LIVE 2026-10-29; skills with no credible free offering
 * ship WITHOUT a url and carry a "resource gap — verify in sweep" note (6 gap
 * rows: 4 execsec + 2 records). Coursera rows marked "free" ride the
 * audit/financial-aid route — the ₱ certificate tier is called out in-row.
 * Every row was re-checked live (2026-10-29) and points at the real,
 * still-existing page. Khan Academy pages block this environment's bot checks;
 * the row was verified live in the previous round and is marked below.
 */
export const RESOURCES: Resource[] = [
  // --- Associate Software Developer (roster 2.1 · id swd) — COMPLETE pool ---
  {
    id: "res-python-basics",
    title: "Python basics course",
    provider: "Coursera",
    type: "course",
    cost: "free",
    // "Programming for Everybody (Getting Started with Python)" — UMich,
    // free to audit (re-verified live 2026-10-29)
    url: "https://www.coursera.org/learn/python",
    durationHours: 25,
    skillsAddressed: ["Applications Development"],
    careerId: "swd",
  },
  {
    id: "res-swd-sql",
    title: "Intro to SQL for data analysis",
    provider: "Khan Academy",
    type: "course",
    cost: "free",
    // verified live in the prior round; Khan's CDN blocks this session's
    // re-check (anti-bot notice) — flagged for the next URL pass
    url: "https://www.khanacademy.org/computing/computer-programming/sql",
    durationHours: 6,
    skillsAddressed: ["Data Design / SQL + data modeling"],
    careerId: "swd",
  },
  {
    id: "res-swd-support-doc",
    title: "Git handbook",
    provider: "Atlassian",
    type: "doc",
    cost: "free",
    // tracking changes to live applications = the support/enhancement working
    // method (verified live 2026-10-29)
    url: "https://www.atlassian.com/git/tutorials/what-is-version-control",
    durationHours: 2,
    skillsAddressed: ["Applications Support and Enhancement"],
    careerId: "swd",
  },
  {
    id: "res-swd-agile-doc",
    title: "What is Agile? — Agile methodology basics",
    provider: "Atlassian",
    type: "doc",
    cost: "free",
    url: "https://www.atlassian.com/agile",
    durationHours: 2,
    skillsAddressed: ["Agile Software Development"],
    careerId: "swd",
  },
  {
    id: "res-swd-secure-doc",
    title: "OWASP Top 10 — most critical web application security risks",
    provider: "OWASP Foundation",
    type: "doc",
    cost: "free",
    url: "https://owasp.org/www-project-top-ten/",
    durationHours: 4,
    skillsAddressed: ["Secure-coding practices"],
    careerId: "swd",
  },
  {
    id: "res-swd-linux-doc",
    title: "The Linux command line for beginners",
    provider: "Ubuntu tutorials",
    type: "doc",
    cost: "free",
    // canonical multi-step command-line tutorial (~1h); kept at the
    // canonical URL (re-verified live 2026-10-29)
    url: "https://ubuntu.com/tutorials/command-line-for-beginners",
    durationHours: 2,
    skillsAddressed: ["Linux + web deployment basics"],
    careerId: "swd",
  },
  {
    id: "res-swd-bna-course",
    title: "Business analysis fundamentals",
    provider: "Coursera",
    type: "course",
    cost: "free",
    // free-to-audit listing; the catalog surface shows the "Business Analysis
    // & Process Management guided project — free" route from this listing
    // (verified live 2026-10-29; no stable free-course slug)
    url: "https://www.coursera.org/search?query=business%20analysis",
    durationHours: 3,
    skillsAddressed: ["Business Needs Analysis"],
    careerId: "swd",
  },
  {
    id: "res-swd-enable-doc",
    title: "Team Playbook — free teamwork Plays",
    provider: "Atlassian",
    type: "doc",
    cost: "free",
    // "Are Plays free? Yes" (verified live 2026-10-29) — the enabling-skills
    // bundle's PH-relevant practice layer
    url: "https://www.atlassian.com/team-playbook",
    durationHours: 2,
    skillsAddressed: [
      "Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Self Management (Enabling Skills, Basic/Intermediate)",
    ],
    careerId: "swd",
  },
  // --- Software QA Analyst (roster 2.2 · id qa) — canon money-shot row only ---
  {
    id: "res-qa-testing",
    title: "Setting a foundation for successful test automation",
    provider: "Test Automation University",
    type: "course",
    cost: "free",
    // TAU is Applitools' free test-automation academy, certificates included
    // (verified live 2026-10-29)
    url: "https://testautomationu.applitools.com/",
    durationHours: 4,
    skillsAddressed: ["Software Testing"],
    creditingBody: "Test Automation University (Applitools)",
    careerId: "qa",
  },
  {
    id: "res-qa-testing-basics-doc",
    title: "Test Planning basics — writing test scenarios from requirements",
    provider: "Test Automation University",
    type: "doc",
    cost: "free",
    // learning-path listing page (verified live 2026-10-29); scaffolded row
    // for the Test Planning skill
    url: "https://testautomationu.applitools.com/learningpaths.html",
    durationHours: 3,
    skillsAddressed: ["Test Planning"],
    careerId: "qa",
  },
  // --- IT Support Engineer (roster 2.4 · id its) — scaffolded row ---
  {
    id: "res-its-css-nc",
    title: "Computer Systems Servicing NC II — self-paced",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // TOP moved off elearn.tesda.gov.ph — now Moodle at e-tesda.gov.ph;
    // "Electrical and Electronics / Computer System Servicing NC II" category
    url: "https://e-tesda.gov.ph/course/index.php?categoryid=16",
    durationHours: 12,
    skillsAddressed: ["Infrastructure Deployment"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "its",
  },
  // --- Data Analyst (junior) (E1 · id da) — COMPLETE pool, one row per skill ---
  {
    id: "res-da-cert",
    title: "Google Data Analytics Professional Certificate",
    provider: "Coursera (Google)",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-10-29: page shows "Enroll for free", "Financial aid
    // available" + 9-course series. Audit/financial-aid route is the free
    // tier; ₱ paid tier exists (Coursera Plus / paid certificate).
    url: "https://www.coursera.org/professional-certificates/google-data-analytics",
    durationHours: 180,
    skillsAddressed: ["Data Analytics"],
    careerId: "da",
  },
  {
    id: "res-da-viz",
    title: "Share Data Through the Art of Visualization (cert course 6)",
    provider: "Coursera (Google)",
    type: "course",
    cost: "free",
    // course page fetched LIVE 2026-10-29 — "Enroll for free" + Tableau
    // dashboards/data stories; ₱ paid tier: shareable certificate
    url: "https://www.coursera.org/learn/visualize-data?specialization=google-data-analytics",
    durationHours: 19,
    skillsAddressed: ["Data Visualization and Storytelling"],
    careerId: "da",
  },
  {
    id: "res-da-bna",
    title: "Ask Questions to Make Data-Driven Decisions (cert course 2)",
    provider: "Coursera (Google)",
    type: "course",
    cost: "free",
    // course page fetched LIVE 2026-10-29 — structured thinking + a whole
    // module on balancing stakeholder needs; ₱ paid tier: certificate
    url: "https://www.coursera.org/learn/ask-questions-make-decisions?specialization=google-data-analytics",
    durationHours: 15,
    skillsAddressed: ["Business Needs Analysis"],
    careerId: "da",
  },
  {
    id: "res-da-etl",
    title: "Data Cleaning — hands-on notes-by-note workflows",
    provider: "Kaggle Learn",
    type: "course",
    cost: "free",
    // course page fetched LIVE 2026-10-29 (HTML head: og:title), notebook
    // exercises in-browser, fully free incl. completion
    url: "https://www.kaggle.com/learn/data-cleaning",
    durationHours: 4,
    skillsAddressed: ["ETL (extract-transform-load workflows)"],
    careerId: "da",
  },
  {
    id: "res-da-engineering-doc",
    title: "Part I. Tutorial — the official PostgreSQL tutorial",
    provider: "PostgreSQL Documentation",
    type: "doc",
    cost: "free",
    // docs page fetched LIVE 2026-10-29 — the 'where data comes from and
    // lives' layer: relational concepts, SQL, views, transactions
    url: "https://www.postgresql.org/docs/current/tutorial.html",
    durationHours: 4,
    skillsAddressed: ["Data Engineering"],
    careerId: "da",
  },
  {
    id: "res-da-esc-doc",
    title: "Team Playbook — free teamwork Plays",
    provider: "Atlassian",
    type: "doc",
    cost: "free",
    // playbook page fetched LIVE 2026-10-29; FAQ: "Are Plays free? Yes" —
    // the ESC bundle's practice layer
    url: "https://www.atlassian.com/team-playbook",
    durationHours: 2,
    skillsAddressed: [
      "Enabling Skills & Competencies (ESC) — Collaboration, Communication, Digital Fluency, Learning Agility",
    ],
    careerId: "da",
  },
  {
    id: "res-da-appdev",
    title: "Introduction to Data Analysis Using Python (cert course 7)",
    provider: "Coursera (Google)",
    type: "course",
    cost: "free",
    // course page fetched LIVE 2026-10-29 — Python basics/light scripting
    // muscle around analytics work; ₱ paid tier: certificate
    url: "https://www.coursera.org/learn/introduction-to-data-analysis-using-python?specialization=google-data-analytics",
    durationHours: 27,
    skillsAddressed: ["Applications Development"],
    careerId: "da",
  },
  {
    id: "res-da-aiethics",
    title: "Elements of AI — Introduction to AI (free, incl. ethics chapter)",
    provider: "MinnaLearn · University of Helsinki",
    type: "course",
    cost: "free",
    // fetched LIVE 2026-10-29 — free MOOC series, no programming required;
    // covers what AI can/can't do and AI-society ethics
    url: "https://www.elementsofai.com/",
    durationHours: 30,
    skillsAddressed: ["Artificial Intelligence Ethics and Governance"],
    careerId: "da",
  },
  {
    id: "res-da-ethics-doc",
    title: "The Data Privacy Act of 2012 and its IRR (RA 10173)",
    provider: "National Privacy Commission (PH)",
    type: "doc",
    cost: "free",
    // DPA-and-IRR hub fetched LIVE 2026-10-29 — the law + rules the
    // role's performance-expectations clause requires
    url: "https://privacy.gov.ph/the-data-privacy-act-and-its-irr/",
    durationHours: 2,
    skillsAddressed: ["Data Ethics"],
    careerId: "da",
  },
  {
    id: "res-da-breach-doc",
    title: "Exercising Breach Reporting Procedures — security incidents & 72-hour rule",
    provider: "National Privacy Commission (PH)",
    type: "doc",
    cost: "free",
    // NPC page fetched LIVE 2026-10-29 — incident/response-team policy,
    // mandated notification windows and escalation under RA 10173
    url: "https://privacy.gov.ph/exercising-breach-reporting-procedures/",
    durationHours: 2,
    skillsAddressed: ["Cyber and Data Breach Incident Management"],
    careerId: "da",
  },
  {
    id: "res-da-testing-doc",
    title: "Test Automation University — free learning paths",
    provider: "Test Automation University (Applitools)",
    type: "doc",
    cost: "free",
    // learning-paths page fetched LIVE 2026-10-29 — sanity-test foundations
    // for the reports/tools you produce
    url: "https://testautomationu.applitools.com/learningpaths.html",
    durationHours: 3,
    skillsAddressed: ["Software Testing"],
    careerId: "da",
  },
  {
    id: "res-da-config-doc",
    title: "Get started — Git and GitHub learning resources / quickstart",
    provider: "GitHub Docs",
    type: "doc",
    cost: "free",
    // docs.github.com quickstart fetched LIVE 2026-10-29 — version tracking
    // so analysis files/scripts stay reproducible
    url: "https://docs.github.com/en/get-started/quickstart",
    durationHours: 2,
    skillsAddressed: ["Configuration Tracking"],
    careerId: "da",
  },
  {
    id: "res-da-stakeholder",
    title: "Stakeholder Management — free-to-audit course listings",
    provider: "Coursera",
    type: "course",
    cost: "free",
    // search page fetched LIVE 2026-10-29 (same listing-page convention as
    // res-swd-bna-course): Google's Stakeholder Management specialization et
    // al. can be audited; ₱ paid tier: certificates
    url: "https://www.coursera.org/search?query=stakeholder%20management",
    durationHours: 3,
    skillsAddressed: ["Stakeholder Management"],
    careerId: "da",
  },
  // --- Executive Secretary (E2 · id execsec) — COMPLETE pool, one row per skill ---
  {
    id: "res-execsec-calendar-doc",
    title: "Welcome to your Outlook calendar",
    provider: "Microsoft Support",
    type: "doc",
    cost: "free",
    // topic fetched LIVE 2026-10-29 — free official Outlook training: views,
    // shared calendars, no double-booking
    url: "https://support.microsoft.com/en-us/topic/6fb9225d-9f9d-456d-8c81-8437bfcd3ebf",
    durationHours: 1,
    skillsAddressed: ["Executive schedule & calendar management"],
    careerId: "execsec",
  },
  {
    id: "res-execsec-correspondence-doc",
    title: "Professional, Technical Writing (memos, letters, reports)",
    provider: "Purdue OWL",
    type: "doc",
    cost: "free",
    // OWL hub fetched LIVE 2026-10-29 — Purdue University's free workplace
    // writing canon: business letters, memos, tone, report abstracts
    url: "https://owl.purdue.edu/owl/subject_specific_writing/professional_technical_writing/index.html",
    durationHours: 6,
    skillsAddressed: ["Correspondence & document production"],
    careerId: "execsec",
  },
  {
    id: "res-execsec-minutes-doc",
    title: "Guide to taking minutes (Cabinet Office guide, 25 pp.)",
    provider: "UK Cabinet Office (GOV.UK)",
    type: "doc",
    cost: "free",
    // GOV.UK page fetched LIVE 2026-10-29 — final-updated 31 Jan 2023;
    // professional, accurate minutes structure + PDF/ODT downloads under
    // the Open Government Licence
    url: "https://www.gov.uk/government/publications/guide-to-taking-minutes",
    durationHours: 3,
    skillsAddressed: ["Meeting administration & minutes"],
    careerId: "execsec",
  },
  {
    id: "res-execsec-gatekeeping",
    title: "Telephone Etiquette for Personal Assistants",
    provider: "Alison",
    type: "course",
    cost: "free",
    // course page fetched LIVE 2026-10-29 — CPD-accredited free course
    // (1.5-3 h): answering/routing business calls; ₱ optional: paid
    // certificate
    url: "https://alison.com/course/telephone-etiquette-for-personal-assistants",
    durationHours: 2,
    skillsAddressed: ["Information gatekeeping: calls & visitors"],
    careerId: "execsec",
  },
  {
    id: "res-execsec-briefing-doc",
    title: "Briefing Notes and Writing for Government — what & how to",
    provider: "University of Victoria Libraries",
    type: "doc",
    cost: "free",
    // LibGuide fetched LIVE 2026-10-29 (updated Jul 2026) — curated free
    // briefing-note guides: decision notes, meeting prep notes, templates
    url: "https://libguides.uvic.ca/briefingnotes",
    durationHours: 3,
    skillsAddressed: ["Research & briefing support for executives"],
    careerId: "execsec",
  },
  {
    id: "res-execsec-triage-doc",
    title: "Set categories, flags, or reminders (Outlook inbox triage)",
    provider: "Microsoft Support",
    type: "doc",
    cost: "free",
    // topic fetched LIVE 2026-10-29 — the judge-and-route habit: flags,
    // categories, follow-ups across mail/calendar/contacts
    url: "https://support.microsoft.com/en-us/topic/a894348d-b308-4185-840f-aff63063d076",
    durationHours: 1,
    skillsAddressed: ["Incoming-material triage & distribution"],
    careerId: "execsec",
  },
  {
    id: "res-execsec-officesvcs",
    title: "Administrative Support — office fundamentals",
    provider: "Alison",
    type: "course",
    cost: "free",
    // course page fetched LIVE 2026-10-29 — CPD-accredited free course
    // (3-4 h): organizing office resources, records, scheduling; ₱
    // optional: paid certificate
    url: "https://alison.com/course/administrative-support",
    durationHours: 3,
    skillsAddressed: ["Office services coordination"],
    careerId: "execsec",
  },
  {
    id: "res-execsec-travel",
    title: "Travel arrangements — pending credible free resource",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    // resource gap — verify in sweep: no credible FREE travel-arrangement
    // course found this session (Microsoft Create's templates page now
    // fronts a Copilot picker, not a template library). Row ships without a
    // url by design — gaps are reported, never papered over.
    skillsAddressed: ["Travel arrangements"],
    careerId: "execsec",
  },
  {
    id: "res-execsec-records-doc",
    title: "Records Management Training Program (free online)",
    provider: "US National Archives (NARA)",
    type: "doc",
    cost: "free",
    // archives.gov training hub fetched LIVE 2026-10-29 — "take our records
    // management training on your own schedule, for free"; clearly labeled
    // US federal standard, used here as the governance reference
    url: "https://www.archives.gov/records-mgmt/training",
    durationHours: 4,
    skillsAddressed: ["Records & document filing/retrieval"],
    careerId: "execsec",
  },
  {
    id: "res-execsec-officeduties",
    title: "Microsoft 365 basics video training",
    provider: "Microsoft Support",
    type: "course",
    cost: "free",
    // training page fetched LIVE 2026-10-29 — free video modules: quick
    // start, create/share, Teams, work-from-anywhere
    url: "https://support.microsoft.com/en-us/office/microsoft-365-basics-video-training-396b8d9e-e118-42d0-8a0d-87d1f2f055fb",
    durationHours: 4,
    skillsAddressed: ["General office duties & tools"],
    careerId: "execsec",
  },
  {
    id: "res-execsec-clerical-doc",
    title: "Business Writing for Administrative and Clerical Staff",
    provider: "Purdue OWL",
    type: "doc",
    cost: "free",
    // page fetched LIVE 2026-10-29 — audience awareness, genre conventions,
    // sample e-mails for the lending-a-hand-across-departments writing
    url: "https://owl.purdue.edu/owl/subject_specific_writing/professional_technical_writing/business_writing_for_administrative_and_clerical_staff/index.html",
    durationHours: 3,
    skillsAddressed: ["Clerical support across departments"],
    careerId: "execsec",
  },
  {
    id: "res-execsec-payroll",
    title: "Payroll-information processing — pending credible free resource",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    // resource gap — verify in sweep: no credible free payroll-processing
    // course surfaced this session; BIR pages are forms, not training. Row
    // ships without a url by design.
    skillsAddressed: ["Payroll-information processing"],
    careerId: "execsec",
  },
  {
    id: "res-execsec-policy",
    title: "Administrative policy setup & interpretation — pending credible free resource",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    // resource gap — verify in sweep: PH civil-service-adjacent pages
    // checked this session are policy corpora, not office-rule-writing
    // training. Row ships without a url by design.
    skillsAddressed: ["Administrative policy setup & interpretation"],
    careerId: "execsec",
  },
  {
    id: "res-execsec-represent",
    title: "Representing executives / meeting on their behalf — pending credible free resource",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    // resource gap — verify in sweep: no free training found this session
    // for attending meetings on an executive's behalf. Row ships without a
    // url by design.
    skillsAddressed: ["Representing executives / meeting on their behalf"],
    careerId: "execsec",
  },
  {
    id: "res-execsec-supervision",
    title: "Introduction to Line Management — supervising, coaching, mentoring",
    provider: "Alison",
    type: "course",
    cost: "free",
    // course page fetched LIVE 2026-10-29 — CPD-accredited free course
    // (1.5-3 h): the supervision/development duties for growing into the
    // senior tier; ₱ optional: paid certificate
    url: "https://alison.com/course/introduction-to-line-management",
    durationHours: 2,
    skillsAddressed: ["Supervision & training of clerical staff"],
    careerId: "execsec",
  },
  {
    id: "res-execsec-opreview-doc",
    title: "Team Playbook — plays that find the slow spots",
    provider: "Atlassian",
    type: "doc",
    cost: "free",
    // playbook page fetched LIVE 2026-10-29 — Retrospective / Health
    // Monitor plays: surface workflow pain and propose fixes
    url: "https://www.atlassian.com/team-playbook",
    durationHours: 2,
    skillsAddressed: ["Operating-practice review"],
    careerId: "execsec",
  },
  {
    id: "res-execsec-timetrack-doc",
    title: "Outlook training — email, contacts & tasks, time management",
    provider: "Microsoft Support",
    type: "doc",
    cost: "free",
    // training hub fetched LIVE 2026-10-29 — official free tile map: quick
    // start, calendar, "Manage your time", contacts & tasks
    url: "https://support.microsoft.com/en-us/outlook/outlook-training",
    durationHours: 2,
    skillsAddressed: ["Employee time-tracking"],
    careerId: "execsec",
  },
  // --- Records Clerk (E3 · id records) — COMPLETE pool, one row per skill ---
  {
    id: "res-records-classify",
    title: "L1.015 Separating Files for Filing (self-paced NARA lesson)",
    provider: "US National Archives (NARA)",
    type: "course",
    cost: "free",
    // lesson opened live 2026-10-29 via the fetched online-lessons roster
    // (archives.gov) — browser-rendered self-paced module (~20 min),
    // separates information into logical filing categories; clearly
    // labeled US federal standard
    url: "https://www.archives.gov/files/records-mgmt/training/material/L1.015/story.html",
    durationHours: 1,
    skillsAddressed: ["Sort & classify materials to filing rules"],
    careerId: "records",
  },
  {
    id: "res-records-storage",
    title: "L1.034 Store Records On-Site (self-paced NARA lesson)",
    provider: "US National Archives (NARA)",
    type: "course",
    cost: "free",
    // lesson opened live 2026-10-29 via the fetched online-lessons roster —
    // best practices for storing records in your office (~15 min); clearly
    // labeled US federal standard
    url: "https://www.archives.gov/files/records-mgmt/training/material/L1.034/story.html",
    durationHours: 1,
    skillsAddressed: ["Filing into storage (drawers/cabinets/boxes)"],
    careerId: "records",
  },
  {
    id: "res-records-retrieval-doc",
    title: "The Rights of Data Subjects — access requests under RA 10173",
    provider: "National Privacy Commission (PH)",
    type: "doc",
    cost: "free",
    // NPC page fetched LIVE 2026-10-29 — the eight data-subject rights incl.
    // Right to Access; a records clerk must recognize/direct proper
    // retrieval requests, esp. for personal data
    url: "https://privacy.gov.ph/data-subject-rights/",
    durationHours: 2,
    skillsAddressed: ["File retrieval on request"],
    careerId: "records",
  },
  {
    id: "res-records-filinglog",
    title: "Filing log / charge-out control — pending credible free resource",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    // resource gap — verify in sweep: NARA's offerings cover inventories and
    // schedules but no dedicated charge-out/filing-log training was found
    // this session. Row ships without a url by design.
    skillsAddressed: ["Filing log / records of materials filed & removed"],
    careerId: "records",
  },
  {
    id: "res-records-repro-doc",
    title: "Scan documents with Google Drive (searchable-PDF reprographics)",
    provider: "Google (Drive Help)",
    type: "doc",
    cost: "free",
    // help page fetched LIVE 2026-10-29 — the scan leg of the
    // copy/scan/fax flow, free and device-based
    url: "https://support.google.com/drive/answer/3145835",
    durationHours: 1,
    skillsAddressed: ["Reprographics: photocopy, scan, fax"],
    careerId: "records",
  },
  {
    id: "res-records-phone",
    title: "Customer Care Skills and Telephone Etiquette",
    provider: "Alison",
    type: "course",
    cost: "free",
    // course page fetched LIVE 2026-10-29 — CPD-accredited free course
    // (3-4 h): handling inbound/outbound calls professionally; ₱
    // optional: paid certificate
    url: "https://alison.com/course/customer-care-skills-with-telephone-etiquette",
    durationHours: 3,
    skillsAddressed: ["Telephone, switchboard & front-desk duties"],
    careerId: "records",
  },
  {
    id: "res-records-visitors",
    title: "Professional Receptionist Essentials",
    provider: "Alison",
    type: "course",
    cost: "free",
    // course page fetched LIVE 2026-10-29 — CPD-accredited free course
    // (3-4 h): greeting visitors, walk-ins, front-desk security; ₱
    // optional: paid certificate
    url: "https://alison.com/course/professional-receptionist-essentials",
    durationHours: 3,
    skillsAddressed: ["Visitor greeting & routing"],
    careerId: "records",
  },
  {
    id: "res-records-scheduling-doc",
    title: "Welcome to your Outlook calendar",
    provider: "Microsoft Support",
    type: "doc",
    cost: "free",
    // fetched LIVE 2026-10-29 (same live topic as the E1 pool) — the
    // office calendar the records desk keeps alive
    url: "https://support.microsoft.com/en-us/topic/6fb9225d-9f9d-456d-8c81-8437bfcd3ebf",
    durationHours: 1,
    skillsAddressed: ["Appointment & calendar scheduling"],
    careerId: "records",
  },
  {
    id: "res-records-mail",
    title: "Mail & document handling — pending credible free resource",
    provider: "resource gap — unresolved",
    durationHours: 0,
    type: "course",
    cost: "free",
    // resource gap — verify in sweep: no credible free intake/mail-handling
    // training emerged this session. Row ships without a url by design.
    skillsAddressed: ["Mail & document handling"],
    careerId: "records",
  },
  {
    id: "res-records-dbdoc",
    title: "Excel help & learning",
    provider: "Microsoft Support",
    type: "doc",
    cost: "free",
    // hub fetched LIVE 2026-10-29 — official free training for the log/databse
    // upkeep work: tables, sorting, drop-downs, PivotTables
    url: "https://support.microsoft.com/en-us/office/excel-for-windows-training-9bc05390-e94c-46af-a5b3-d7c22f6990bb",
    durationHours: 4,
    skillsAddressed: ["Front-office record & database upkeep"],
    careerId: "records",
  },
  {
    id: "res-records-cs-com",
    title: "Customer Service Skills",
    provider: "Alison",
    type: "course",
    cost: "free",
    // course page fetched LIVE 2026-10-29 — CPD-accredited free course
    // (1.5-3 h): answering "who/where/what" instantly and politely; ₱
    // optional: paid certificate
    url: "https://alison.com/course/customer-service-skills",
    durationHours: 2,
    skillsAddressed: ["Info & customer-service communication"],
    careerId: "records",
  },
];

export function getResourcesForCareer(careerId: string): Resource[] {
  return RESOURCES.filter((r) => r.careerId === careerId);
}

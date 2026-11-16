import type { SkillLadder, VMCQ } from "@/app/(onboarding)/onboarding/banks";

/**
 * it-track skill verification bank — one MCQ per canonical skill row
 * (lib/fixtures/catalog.ts), authored 2026-11-04 (assessments content round).
 * `catalogSkill` is the API key: POST /api/verify → markVerified — it must
 * byte-match the catalog skill name. The 5 canon demo-path skills are NOT
 * here (they live in the shipped VERIFY_BANK, onboarding/banks.ts).
 *
 * ── Ladder block (wave-1 pilot, user-approved 2026-11-05 "go") ────────────
 * `IT_LADDERS` below adds the swd pilot's 3-item skill-verification ladders
 * (8 skills × 3 items = 24), authored per the APPROVED blueprint
 * docs/assessment-blueprint-swd.md: tier order Q1 recognition → Q2
 * application → Q3 judgment; every item carries a `ref` to on-disk official
 * text (O*NET 15-1252.00 tasks / PSOC 2512 lettered lines / PSF-SDS anchors
 * via rowspec/it.ts) and per-wrong-option `distractorNotes`. The 8 swd
 * catalog rows are exactly the blueprint's folders; the 5 canon demo-path
 * skills (VERIFY_BANK) ride ladder identity here AND keep their shipped
 * singles — both shapes wire through SKILL_LADDERS + the legacy banks.
 * Stem discipline (anti-giveaway rules) is the blueprint's fixed norm,
 * § Stem discipline; keys sit inside the option band, positions vary.
 * Legacy `IT_BANK` above is untouched — the ladders join alongside.
 */
export const IT_BANK: VMCQ[] = [
  // ── swd family remainder ─────────────────────────────────────────────
  {
    skill: "Applications Development",
    catalogSkill: "Applications Development",
    stem: "The lead hands you the agreed spec for a new screen. What is the core work on your desk for the next two weeks?",
    options: [
      "draft a memo asking users to re-rank their needs",
      "have QA guess what the screen should do",
      "write and maintain the code that matches the spec",
      "rebuild the whole app from scratch around it",
    ],
    answer: 2,
  },
  {
    skill: "Secure-coding practices",
    catalogSkill: "Secure-coding practices",
    stem: "You're building the login form. What keeps the classic flaws out of your code?",
    options: [
      "validate the input on the server before trusting it",
      "hide the login page from search engines",
      "rename the login button to something longer",
      "wait until the site gets famous, then patch",
    ],
    answer: 0,
  },
  {
    skill: "Linux + web deployment basics",
    catalogSkill: "Linux + web deployment basics",
    stem: "Your class project runs fine on your laptop. How does it get live on a rented cloud server?",
    options: [
      "email the files to every registered user",
      "rebuild the pages as printed posters",
      "leave it on the laptop and share your screen",
      "copy the files up and run them from the server",
    ],
    answer: 3,
  },
  // ── qa family ────────────────────────────────────────────────────────
  {
    skill: "Software Testing",
    catalogSkill: "Software Testing",
    stem: "A release candidate lands with a checklist: integration, system, regression, user-acceptance. What is your assignment?",
    options: [
      "mark everything passed so the release never slips",
      "execute each scripted case and record what fails",
      "skip the old features — they've always worked",
      "rewrite the app so no bug can exist",
    ],
    answer: 1,
  },
  {
    skill: "Test Planning",
    catalogSkill: "Test Planning",
    stem: "The requirements doc just reached your desk. What do you turn it into before the build shows up?",
    options: [
      "a final sign-off stamp for the release",
      "a list of the developers behind last release's delays",
      "a marketing plan for the finished product",
      "prioritized test scenarios with the data each one needs",
    ],
    answer: 3,
  },
  {
    skill: "Defect management",
    catalogSkill: "Defect management",
    stem: "You found the checkout-breaking bug at 9 a.m. on a live store. What's the professional next move?",
    options: [
      "whisper it to a teammate and hope it spreads",
      "edit the review doc so nobody sees it",
      "log it in the tracker with exact steps, then verify the fix",
      "wait for the next user conference to reveal it",
    ],
    answer: 2,
  },
  {
    skill: "Quality Assurance / Quality Standards",
    catalogSkill: "Quality Assurance / Quality Standards",
    stem: "The release meeting is in an hour. Beyond the bug list, what does the quality officer bring?",
    options: [
      "a coupon for users who survived the bugs",
      "coverage numbers, metrics, and an honest release-readiness call",
      "a longer version number to look finished",
      "a promise that testers will log weekend overtime",
    ],
    answer: 1,
  },
  {
    skill: "Customer Orientation · Digital Fluency · Learning Agility · Sense Making · Problem Solving (Enabling)",
    catalogSkill: "Customer Orientation · Digital Fluency · Learning Agility · Sense Making · Problem Solving (Enabling)",
    stem: "A brand-new testing tool on Monday, redesigned user flows on Tuesday. What behavior carries you through the week?",
    options: [
      "test like the customer, learn the tool fast, piece the flow together",
      "book a three-month training before touching either",
      "test only the parts the developers praise",
      "read the code instead of using the tool",
    ],
    answer: 0,
  },
  // ── ba family ────────────────────────────────────────────────────────
  {
    skill: "Requirements Analysis",
    catalogSkill: "Requirements Analysis",
    stem: "A warehouse manager calls: 'tracking is a mess.' What does the analyst's work turn that into?",
    options: [
      "a same-afternoon install of a new warehouse app",
      "staff interviews, a today-vs-target gap, and written business rules",
      "a termination letter for the temp who mislabeled boxes",
      "a form for the manager to count every box",
    ],
    answer: 1,
  },
  {
    skill: "Requirements Specification",
    catalogSkill: "Requirements Specification",
    stem: "The interviews are done. What do you hand the people who will build it?",
    options: [
      "a go-live dinner invite with seating chart",
      "all forty hours of raw interview audio",
      "a scanned napkin sketch, unexplained",
      "functional specs, user stories, and wireframes tied to the architecture",
    ],
    answer: 3,
  },
  {
    skill: "Solution Support (UAT & hand-over)",
    catalogSkill: "Solution Support (UAT & hand-over)",
    stem: "The system passed its builds. What work takes it to the users who must accept it?",
    options: [
      "run user-acceptance testing, then carry the training and hand-over",
      "ship it and switch off the support phone forever",
      "hand every user the full source-code printout",
      "let the users discover the system on their own",
    ],
    answer: 0,
  },
  {
    skill: "Process modeling (flow diagrams, use cases)",
    catalogSkill: "Process modeling (flow diagrams, use cases)",
    stem: "For the loan-approval handoff, what do you draw so analysts and builders share one picture?",
    options: [
      "a sixty-line run-on paragraph of the flow",
      "a spreadsheet of everyone's opinions, unsorted",
      "the flow diagram and use cases for the hand-off",
      "nothing — keep it verbal so it can't be misread",
    ],
    answer: 2,
  },
  {
    skill: "Team Enablement",
    catalogSkill: "Team Enablement",
    stem: "Sprint ceremonies feel chaotic and other departments never talk to your team. What is your contribution?",
    options: [
      "help run the ceremonies and build cross-department connections",
      "cancel the ceremonies to free up the calendar",
      "wait for management to dissolve the other teams",
      "propose merging all departments into one office",
    ],
    answer: 0,
  },
  {
    skill: "Collaboration · Communication · Digital Fluency · Learning Agility (Enabling)",
    catalogSkill: "Collaboration · Communication · Digital Fluency · Learning Agility (Enabling)",
    stem: "Your stakeholder cancelled the workshop, your link tool is down, and scope changed overnight. What's the professional response?",
    options: [
      "go quiet until everything sorts itself out",
      "send everyone a pointed memo about their choices",
      "rebuild the project in a tool nobody knows",
      "communicate the change plainly, remake the links, adjust the plan fast",
    ],
    answer: 3,
  },
  // ── its family ───────────────────────────────────────────────────────
  {
    skill: "Infrastructure Support",
    catalogSkill: "Infrastructure Support",
    stem: "It's Tuesday and the office runs on your servers. What is the routine that keeps it true?",
    options: [
      "leave them alone until something starts smoking",
      "monitor them, maintain them, and patch on schedule",
      "reformat them weekly as a hygiene ritual",
      "order replacements whenever a disk light blinks",
    ],
    answer: 1,
  },
  {
    skill: "Infrastructure Deployment",
    catalogSkill: "Infrastructure Deployment",
    stem: "Your supervisor hands you tonight's server-update plan. What do you do with it?",
    options: [
      "redesign the whole cluster while nobody's looking",
      "decline and let the vendor discover our servers",
      "push it quietly during payday weekend",
      "execute the rollout exactly as planned, reporting as you go",
    ],
    answer: 3,
  },
  {
    skill: "Network Administration and Maintenance",
    catalogSkill: "Network Administration and Maintenance",
    stem: "Accounting's wifi fails every afternoon. What does the network's day-to-day care look like?",
    options: [
      "swap Accounting permanently to pen and paper",
      "repurchase fresh wifi for the entire building",
      "walk the switches and patch panels, fix the LAN/VLAN setup",
      "blame the weather and close the ticket",
    ],
    answer: 2,
  },
  {
    skill: "Network Configuration",
    catalogSkill: "Network Configuration",
    stem: "A new switch must serve two office floors. What's the right way to set its ports?",
    options: [
      "improvise the settings from memory for speed",
      "follow the runbook and configure the devices and ports",
      "ask every employee to set their own port",
      "power it off until the office standard changes",
    ],
    answer: 1,
  },
  {
    skill: "Cyber and Data Breach Incident Management",
    catalogSkill: "Cyber and Data Breach Incident Management",
    stem: "A flash drive with customer records went missing at the office. What does the first move follow?",
    options: [
      "the escalation path — raise it as a security incident",
      "the office group chat, with jokes attached",
      "the backups, which now get quietly scrubbed",
      "patience — wait to see if anyone offers to sell it",
    ],
    answer: 0,
  },
  {
    skill: "Service Level Management",
    catalogSkill: "Service Level Management",
    stem: "Your help desk promises a response within four hours. What does keeping that promise take?",
    options: [
      "closing all tickets every Friday, opened or not",
      "hitting the response and closure targets, logged in the metrics",
      "dropping the promise whenever the desk gets busy",
      "answering only the callers who sound pleasant",
    ],
    answer: 1,
  },
  {
    skill: "Customer Orientation · Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)",
    catalogSkill: "Customer Orientation · Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)",
    stem: "The same user calls you angry about the same printer for the third time. How should this call go?",
    options: [
      "pretend the line dropped and close the call",
      "explain that printers are beneath your role",
      "warm-transfer them to the vendor before saying hello",
      "stay patient, own the case, and solve or hand it over cleanly",
    ],
    answer: 3,
  },
  // ── sysadmin family ──────────────────────────────────────────────────
  {
    skill: "Systems administration (user groups, upgrades, backups)",
    catalogSkill: "Systems administration (user groups, upgrades, backups)",
    stem: "The department server hums quietly today. What keeps it humming next month?",
    options: [
      "managed user accounts, scheduled upgrades, and regular backups",
      "admin rights for every user, as a courtesy",
      "backups skipped until the disk finally fills",
      "a forced restart every morning and a hopeful prayer",
    ],
    answer: 0,
  },
  {
    skill: "↳ CWF sub-row: Design and develop new systems",
    catalogSkill: "↳ CWF sub-row: Design and develop new systems",
    stem: "The office is adopting a new scheduling system. What is your part in its arrival?",
    options: [
      "install it secretly before anyone can review it",
      "tell the vendor they own every step forever",
      "assist the build and integration under the team's change discipline",
      "ask each department to build its own tool instead",
    ],
    answer: 2,
  },
  {
    skill: "↳ CWF sub-row: Optimize systems performance",
    catalogSkill: "↳ CWF sub-row: Optimize systems performance",
    stem: "The file server crawls every morning at nine. What work fixes the crawl for good?",
    options: [
      "unplug every machine except your own",
      "measure the load, tune the components, track the capacity",
      "email users to log in earlier instead",
      "reinstall the server each Monday before the office opens",
    ],
    answer: 1,
  },
  {
    skill: "↳ CWF sub-row: Resolve system-related incidents",
    catalogSkill: "↳ CWF sub-row: Resolve system-related incidents",
    stem: "The shared drive dies mid-morning and resists your first hour of fixes. What happens next?",
    options: [
      "reformat it — the problem stops existing then",
      "close the ticket and hope nobody reopens it",
      "declare the files cursed and log off",
      "resolve what you can, escalate the rest with your findings",
    ],
    answer: 3,
  },
  {
    skill: "↳ CWF sub-row: Oversee service level agreements and service improvements",
    catalogSkill: "↳ CWF sub-row: Oversee service level agreements and service improvements",
    stem: "The same printer ticket returns every Friday. What does your duty to the service targets do with it?",
    options: [
      "print an apology poster and tape it on",
      "dismiss it as user error without a look",
      "log it against the targets and flag the recurring incident",
      "buy a new printer out of pocket, no logs",
    ],
    answer: 2,
  },
  {
    skill: "Security Administration",
    catalogSkill: "Security Administration",
    stem: "Last quarter's contractor can still open the finance folder on your systems. What do you do?",
    options: [
      "add him to the everyone group, to be polite",
      "revoke his access and record the policy update",
      "email his password around for convenience",
      "leave it — the folder rarely gets opened anyway",
    ],
    answer: 1,
  },
  {
    skill: "IT Asset Management",
    catalogSkill: "IT Asset Management",
    stem: "The office holds four hundred devices and thirty-seven software tools. What does staying on top of it all involve?",
    options: [
      "an up-to-date hardware and software catalog with tidy licenses",
      "counting devices only when the auditors arrive",
      "keeping the whole inventory in one engineer's head",
      "merging all license keys into one shared chat",
    ],
    answer: 0,
  },
  {
    skill: "System Integration",
    catalogSkill: "System Integration",
    stem: "Finance bought a new reporting tool. What's the safe way to bring it in?",
    options: [
      "wire it live during Monday's payroll run",
      "connect it to the existing systems with tested, reviewed hand-offs",
      "install it unasked on every laptop in the company",
      "let it stand alone with a sticky-note reminder",
    ],
    answer: 2,
  },
  {
    skill: "Configuration Tracking · Cyber-and-Data-Breach Incident Management · Business Needs Analysis",
    catalogSkill: "Configuration Tracking · Cyber-and-Data-Breach Incident Management · Business Needs Analysis",
    stem: "A change you logged last month is now tangled in a security scare. What discipline carries the day?",
    options: [
      "delete the change logs so nothing points at you",
      "fix it yourself and never mention security",
      "write 'the config changed itself' in the report",
      "trace the change records, then escalate to the incident owners",
    ],
    answer: 3,
  },
  {
    skill: "Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)",
    catalogSkill: "Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)",
    stem: "The night shift leaves you three open incidents behind messy notes. What does your morning team do?",
    options: [
      "log in, read the notes, and pick up each incident cleanly",
      "reopen all three as new items so the counts reset",
      "wait for the night shift to log back in",
      "forward them to the office chat as jokes",
    ],
    answer: 0,
  },
  // ── dba family ───────────────────────────────────────────────────────
  {
    skill: "Database Administration",
    catalogSkill: "Database Administration",
    stem: "You now look after the student-records database. Which routine is genuinely yours?",
    options: [
      "emailing the full database to students every semester",
      "restoring only when the principal complains aloud",
      "installing and configuring the DBMS, with backup and recovery drills",
      "deleting old records on Fridays to keep it fast",
    ],
    answer: 2,
  },
  {
    skill: "↳ CWF sub-row: Oversee database administration",
    catalogSkill: "↳ CWF sub-row: Oversee database administration",
    stem: "The registrar's database upgrade lands next month. What does the overseeing work own?",
    options: [
      "upgrades only on the developers' laptops, nowhere else",
      "nothing — the vendor decides, everyone adjusts",
      "a pizza budget for the rollout crew",
      "the environments and installs, with the backup and recovery procedures",
    ],
    answer: 3,
  },
  {
    skill: "↳ CWF sub-row: Design and develop new database",
    catalogSkill: "↳ CWF sub-row: Design and develop new database",
    stem: "Marketing wants a campaign tracker built. What is your assisting role in shaping it?",
    options: [
      "let each campaign invent its own private tables",
      "help shape the needs, flows, indexing, and stored procedures",
      "copy a competitor's schema without any review",
      "keep it in shared spreadsheets, as always",
    ],
    answer: 1,
  },
  {
    skill: "↳ CWF sub-row: Optimize database performance",
    catalogSkill: "↳ CWF sub-row: Optimize database performance",
    stem: "Month-end reports crawl unbearably. What does the optimization work look like?",
    options: [
      "delete last month's rows until it feels lighter",
      "tell finance to run the report at midnight instead",
      "rename the server so the queries forget the past",
      "audit the slow components and track the operational metrics",
    ],
    answer: 3,
  },
  {
    skill: "↳ CWF sub-row: Resolve database incidents",
    catalogSkill: "↳ CWF sub-row: Resolve database incidents",
    stem: "Enrollment week, and the grades table locks up. What happens on your desk?",
    options: [
      "drop the lock tables and move on with life",
      "tell students to enroll by phone this year",
      "diagnose the lock, mitigate it, escalate per procedure",
      "note the internet provider in the log as the culprit",
    ],
    answer: 2,
  },
  {
    skill: "Database security controls",
    catalogSkill: "Database security controls",
    stem: "The interns need to read three tables and nothing else. What do you set up?",
    options: [
      "full admin access, for the learning opportunity",
      "exactly the privileges and permissions those tables need",
      "one shared generic login, rotated monthly",
      "the connection string, pinned in the group chat",
    ],
    answer: 1,
  },
  {
    skill: "Data Engineering",
    catalogSkill: "Data Engineering",
    stem: "Every morning the dashboards wake up starving because overnight feeds clog. What is your piece of that fix?",
    options: [
      "keep the data flows that feed the databases running",
      "redraw the charts faster in the slide deck",
      "print a data dump for the analysts each morning",
      "ask vendors to email spreadsheets over the weekend",
    ],
    answer: 0,
  },
  {
    skill: "Data Migration",
    catalogSkill: "Data Migration",
    stem: "The old grading system's records must pour into the new one. What does moving them well mean?",
    options: [
      "email the exports and let users type them back in",
      "map the schema, move the data, verify every row landed",
      "copy the drive, rename the folder, declare it migrated",
      "retire the old system and hope the new one remembers",
    ],
    answer: 1,
  },
  {
    skill: "Problem Management",
    catalogSkill: "Problem Management",
    stem: "The same database outage has returned four Fridays straight. What makes Friday quiet for good?",
    options: [
      "another restart before lunch and a shrug",
      "rename the database so Friday can't find it",
      "send a weekly notice warning users of the outage",
      "diagnose the root cause and close the recurring incident",
    ],
    answer: 3,
  },
  // ── cybersec family ──────────────────────────────────────────────────
  {
    skill: "Threat analysis / monitoring",
    catalogSkill: "Threat analysis / monitoring",
    stem: "The console has stacked two thousand alerts before breakfast. What is your actual job with them?",
    options: [
      "read and correlate them, then escalate the true positives",
      "close them all as noise to clear the queue",
      "forward the raw feed to the entire company",
      "screenshot the wall for the morning stand-up",
    ],
    answer: 0,
  },
  {
    skill: "Network administration & maintenance",
    catalogSkill: "Network administration & maintenance",
    stem: "You can't defend a network you don't know. What does knowing it look like?",
    options: [
      "memorizing the wifi password for hallway bragging rights",
      "counting the routers in your own office room",
      "trusting that the diagram on the wall never changed",
      "understanding how the LAN and WAN segments actually connect",
    ],
    answer: 3,
  },
  {
    skill: "Vulnerability assessment support (VAPT analyst track)",
    catalogSkill: "Vulnerability assessment support (VAPT analyst track)",
    stem: "You're the junior on the security-testing pair. What is actually assigned to you?",
    options: [
      "breaking production on Friday to close the week",
      "reporting every missing favicon as a critical finding",
      "running the scans and triaging findings with your senior",
      "sending the raw tool output straight to the client",
    ],
    answer: 2,
  },
  {
    skill: "Collaboration · Communication · Problem Solving · Digital Fluency (Enabling)",
    catalogSkill: "Collaboration · Communication · Problem Solving · Digital Fluency (Enabling)",
    stem: "Five desks, one war room, an active incident. What behavior keeps the response moving?",
    options: [
      "each desk investigates alone, in complete silence",
      "share the facts as found, decide together, record every call",
      "dedicate the first hour to assigning blame",
      "mute the channel until the director arrives",
    ],
    answer: 1,
  },
  // ── webdev family ────────────────────────────────────────────────────
  {
    skill: "Client-side coding (HTML/CSS/JS)",
    catalogSkill: "Client-side coding (HTML/CSS/JS)",
    stem: "The shop's product page collapses on phones. What does fixing it from your keyboard look like?",
    options: [
      "advice to customers to buy larger phones",
      "shipping a PDF version of the page instead",
      "deleting the page's mobile route entirely",
      "adjusting the HTML and CSS so the layout holds across devices",
    ],
    answer: 3,
  },
  {
    skill: "↳ task-cluster sub-row: site life-operations",
    catalogSkill: "↳ task-cluster sub-row: site life-operations",
    stem: "The site is live and the client keeps sending copy edits. What does looking after the site mean?",
    options: [
      "publishing edits straight away, unchecked, to save hours",
      "renewing the domain only after the site goes dark",
      "testing each revision, updating content, backing up, tuning performance",
      "clearing out the backups after every successful launch",
    ],
    answer: 2,
  },
  {
    skill: "CMS administration (WordPress etc.)",
    catalogSkill: "CMS administration (WordPress etc.)",
    stem: "The school hands you its WordPress website to run. What does running it involve?",
    options: [
      "a nightly wipe-and-rebuild in raw code",
      "structuring content, managing themes and plugins, keeping the hosting sound",
      "posting only whatever reaches your desk first",
      "removing users so nothing can ever break in",
    ],
    answer: 1,
  },
  {
    skill: "Responsive/UI basics + accessibility",
    catalogSkill: "Responsive/UI basics + accessibility",
    stem: "A low-vision student opens your page with a screen reader. What does real craft look like here?",
    options: [
      "semantic markup that renders across devices and respects the reader",
      "pixel-perfect alignment, whatever the reader says",
      "a phone number printed where the buttons should be",
      "removing every interactive element until nothing breaks",
    ],
    answer: 0,
  },
  {
    skill: "Version control (git)",
    catalogSkill: "Version control (git)",
    stem: "You and two teammates touch the same file all weekend. What keeps everyone's work safe?",
    options: [
      "one shared spreadsheet with hand-typed change notes",
      "small commits, feature branches, and merges through review",
      "emailing the files around as attachments",
      "midnight pushes straight onto the live website",
    ],
    answer: 1,
  },
  {
    skill: "Agile Software Development (when agency-run)",
    catalogSkill: "Agile Software Development (when agency-run)",
    stem: "The client's agency builds in two-week cycles. What do your weeks look like inside one?",
    options: [
      "silently waiting for one giant spec to arrive at the end",
      "skipping the reviews — the cycle ends when it ends",
      "reserving the stand-up for negotiating overtime",
      "a daily stand-up, a built slice, and a review with the client",
    ],
    answer: 3,
  },
  // ── digart family ────────────────────────────────────────────────────
  {
    skill: "DEVELOP DESIGNS FOR A LOGO (ICT216313)",
    catalogSkill: "DEVELOP DESIGNS FOR A LOGO (ICT216313)",
    stem: "A startup asks for a logo. What does designing it properly involve?",
    options: [
      "visual design and communication principles worked into the mark",
      "the first famous logo they admire, recolored",
      "their initials in whatever font was on TV last night",
      "one giant size, printed without testing how it scales",
    ],
    answer: 0,
  },
  {
    skill: "DEVELOP DESIGNS FOR PRINT MEDIA (ICT216314)",
    catalogSkill: "DEVELOP DESIGNS FOR PRINT MEDIA (ICT216314)",
    stem: "Launch week: the client needs a tarpaulin and a magazine spread. What does designing each piece involve?",
    options: [
      "stretching one phone-sized artwork across both untouched",
      "designing the phone screen first; print will follow",
      "designing for each medium's size, paper, and printing reality",
      "printing at home and fixing color at the venue",
    ],
    answer: 2,
  },
  {
    skill: "DEVELOP DESIGNS FOR USER EXPERIENCE (ICT216315)",
    catalogSkill: "DEVELOP DESIGNS FOR USER EXPERIENCE (ICT216315)",
    stem: "Testers get lost three screens in on your checkout. What is the design work that fixes the journey?",
    options: [
      "brighter colors until the confusion fades on its own",
      "pop-up tips explaining the purpose of every button",
      "shipping it as-is — users always learn eventually",
      "reworking how users move through it, step by step",
    ],
    answer: 3,
  },
  {
    skill: "DEVELOP DESIGNS FOR USER INTERFACE (ICT216316)",
    catalogSkill: "DEVELOP DESIGNS FOR USER INTERFACE (ICT216316)",
    stem: "Your screens look beautiful but feel clumsy to operate. What work fixes that?",
    options: [
      "replacing every button with an animated graphic",
      "reworking the screens' layouts, controls, and interactions",
      "dropping mouse support to simplify the codebase",
      "letting each developer pick their own favorite icons",
    ],
    answer: 1,
  },
  {
    skill: "DEVELOP DESIGNS FOR PRODUCT PACKAGING (ICT216317)",
    catalogSkill: "DEVELOP DESIGNS FOR PRODUCT PACKAGING (ICT216317)",
    stem: "A snack brand wants its bag to win the shelf. What does that design work cover?",
    options: [
      "printing the brand name in six random languages",
      "whatever empty box the warehouse has spare today",
      "decorating the underside, where nobody ever looks",
      "the pack's structure and graphics so it sells and stacks",
    ],
    answer: 3,
  },
  {
    skill: "DESIGN BOOTH AND PRODUCT WINDOW / DISPLAY (ICT216318)",
    catalogSkill: "DESIGN BOOTH AND PRODUCT WINDOW / DISPLAY (ICT216318)",
    stem: "The trade fair opens Friday and your client's space must stop shoppers mid-aisle. What does getting that built involve?",
    options: [
      "posters taped onto a borrowed folding table",
      "renting the biggest space and designing it after opening",
      "designing and producing the booth and window display for the space",
      "copying the neighboring booth exactly, minus the prices",
    ],
    answer: 2,
  },
  {
    skill: "Use specialized graphic/animation tools (Adobe suite, Blender etc.)",
    catalogSkill: "Use specialized graphic/animation tools (Adobe suite, Blender etc.)",
    stem: "The brief wants an animated ad plus list-ready artwork by Friday. What does getting both done take?",
    options: [
      "drawing everything by hand and scanning it Tuesday",
      "outourcing both to the client's teenage nephew",
      "driving the design suite and the animation tools until both are done",
      "delivering a slideshow of screenshots of the tools",
    ],
    answer: 2,
  },
  {
    skill: "Follow creative brief + brand guideline development",
    catalogSkill: "Follow creative brief + brand guideline development",
    stem: "The client sends a twelve-page direction with brand rules. What does working it properly look like?",
    options: [
      "design to the brief, submit for approval, liaise through revisions",
      "redesign their entire brand identity on day one",
      "designing whatever inspires you, labeled concept",
      "waiting for it to expire, then freelancing the rest",
    ],
    answer: 0,
  },
  {
    skill: "Client communication & revision handling",
    catalogSkill: "Client communication & revision handling",
    stem: "It's the client's fifth round of edit requests, all vague, deadline Friday. What's the professional handling?",
    options: [
      "refund the deposit and vanish from the thread",
      "hold the deadline, work the revisions, confirm each round in writing",
      "merge all five rounds into one franken-design",
      "go quiet until the files are late, then apologize",
    ],
    answer: 1,
  },
  {
    skill: "Junior 2D Animator — [PSF-DAA] (counterpart, optional — user ruling 2026-10-29 ADD)",
    catalogSkill: "Junior 2D Animator — [PSF-DAA] (counterpart, optional — user ruling 2026-10-29 ADD)",
    stem: "The studio is staffing a junior seat that animates frame by frame. What does that seat do?",
    options: [
      "keeps the studio's invoices and stockroom in order",
      "recolors the 3D renders for the print team",
      "manages the voice actors' contracts and call times",
      "animates two-dimensional frames under the senior animators' direction",
    ],
    answer: 3,
  },
  // ── da family ────────────────────────────────────────────────────────
  {
    skill: "Data Analytics",
    catalogSkill: "Data Analytics",
    stem: "The sales managers argue about whether promos ever worked. What do you actually put in front of them?",
    options: [
      "the stat-backed answer to the actual business question",
      "the prettiest chart of whichever data happened to load",
      "a confident it-depends, delivered with no numbers",
      "the entire raw table, zipped, with a shrug",
    ],
    answer: 0,
  },
  {
    skill: "Data Visualization and Storytelling",
    catalogSkill: "Data Visualization and Storytelling",
    stem: "You've found the pattern. What makes the finding actually land with non-technical readers?",
    options: [
      "the raw query, pasted, with a wink of confidence",
      "forty slides of the same scatter plot, unedited",
      "the single number alone, no context, high confidence",
      "a visual that carries the story behind the numbers",
    ],
    answer: 3,
  },
  {
    skill: "ETL (extract-transform-load workflows)",
    catalogSkill: "ETL (extract-transform-load workflows)",
    stem: "Three dashboards quote three different revenue numbers. What does fixing it look like?",
    options: [
      "extracting once, validating and transforming, loading records that agree",
      "hand-copying every report from the source screens",
      "averaging the three numbers and moving on",
      "deleting whichever two reports disagree with the mood",
    ],
    answer: 0,
  },
  {
    skill: "Enabling Skills & Competencies (ESC) — Collaboration, Communication, Digital Fluency, Learning Agility",
    catalogSkill: "Enabling Skills & Competencies (ESC) — Collaboration, Communication, Digital Fluency, Learning Agility",
    stem: "You're the newest person on the analytics floor. What do the first-month team skills ask of you?",
    options: [
      "staying silent until someone discovers your output",
      "share what you learn, help the team, keep practicing the tools",
      "mastering only the one tool you personally enjoy",
      "declining all teamwork to protect your focus time",
    ],
    answer: 1,
  },
  {
    skill: "Artificial Intelligence Ethics and Governance",
    catalogSkill: "Artificial Intelligence Ethics and Governance",
    stem: "Your AI hiring model digests applicants' personal data. What must the project keep doing?",
    options: [
      "ingesting extra personal data until accuracy improves",
      "burning the audit trail once the model launches",
      "applying the rules only when the client is large",
      "operating inside the governance and privacy rules that cover that data",
    ],
    answer: 3,
  },
  {
    skill: "Data Ethics",
    catalogSkill: "Data Ethics",
    stem: "Technically, you can open any customer's purchase history tonight. What should actually govern your hands?",
    options: [
      "sheer curiosity, as long as nobody reads the log",
      "the CFO's quiet request to peek at a rival's account",
      "the law and the ethics of that data, start to finish",
      "nothing — data confidentiality is material for movies",
    ],
    answer: 2,
  },
  {
    skill: "Configuration Tracking",
    catalogSkill: "Configuration Tracking",
    stem: "Your analysis notebook changed three times since Monday. What makes last month's result reproducible?",
    options: [
      "your memory of what you probably ran",
      "a clean change log tied to the exact files and versions",
      "the muscle memory left in your typing fingers",
      "an unversioned file optimistically named final_v2",
    ],
    answer: 1,
  },
  {
    skill: "Stakeholder Management",
    catalogSkill: "Stakeholder Management",
    stem: "Your forecast goes from your manager on to the directors. How should you handle that chain?",
    options: [
      "knowing who receives it, who uses it, keeping both informed",
      "sending it only to whoever compliments you loudest",
      "guessing the readership from the org chart's vibes",
      "sending each of them a different number and letting them argue",
    ],
    answer: 0,
  },
  // ── soc family ───────────────────────────────────────────────────────
  {
    skill: "Monitor cyber security systems",
    catalogSkill: "Monitor cyber security systems",
    stem: "The security alert feed never stops streaming. What does the watching job genuinely consist of?",
    options: [
      "throttling alerts to one per hour for everyone's peace",
      "analyzing the stream in real time, trending it, escalating anomalies",
      "archiving the logs unopened, summarizing them once a quarter",
      "switching the feed off on weekends to let it rest",
    ],
    answer: 1,
  },
  {
    skill: "Maintain cyber security operations",
    catalogSkill: "Maintain cyber security operations",
    stem: "It's midnight and the security operations desk is quiet. What keeps it quietly working?",
    options: [
      "premium headsets and a good playlist",
      "switching off any check that starts failing",
      "waiting for the next audit to find the gaps",
      "healthy data sources, kept check schedules, honest status reports",
    ],
    answer: 3,
  },
  {
    skill: "Manage response to cyber security incidents",
    catalogSkill: "Manage response to cyber security incidents",
    stem: "A confirmed intrusion is live at a client site. How do you carry it from first call to final word?",
    options: [
      "evaluate the severity, keep status updates flowing, close with a final report",
      "wipe the server and declare the problem finished",
      "wait for the attacker to lose interest and leave",
      "release the press statement before anyone contains anything",
    ],
    answer: 0,
  },
  {
    skill: "Threat Analysis and Defence · Threat Intelligence and Detection (family FSC cross-cite)",
    catalogSkill: "Threat Analysis and Defence · Threat Intelligence and Detection (family FSC cross-cite)",
    stem: "The alert queue needs a second opinion on one suspicious login. What should genuinely back your call?",
    options: [
      "the misspelled look of the username, on instinct",
      "the number of times you've ignored it before",
      "knowledge of attack methods and the intel feeds' indicators",
      "the long geographic distance to the source",
    ],
    answer: 2,
  },
  {
    skill: "Vulnerability scanning (VAPT-adjacent, TESDA-printed)",
    catalogSkill: "Vulnerability scanning (VAPT-adjacent, TESDA-printed)",
    stem: "It's the first Tuesday of the month — scanning day. What does the duty cover?",
    options: [
      "scanning whichever system made the news this week",
      "one ritual scan a year, reusing the old report",
      "nothing — the absence of incidents means the scan happened",
      "checking the schedule, scanning the assets, filing the report",
    ],
    answer: 3,
  },
  {
    skill: "Network security understanding (network administration family)",
    catalogSkill: "Network security understanding (network administration family)",
    stem: "A block alert fired and traffic is routing strangely through the LAN. How do you read that?",
    options: [
      "as the internet provider's fault, always and forever",
      "with the network's architecture and the alerting platform in mind",
      "as proof that someone finally unplugged the server closet",
      "as background noise — security alerts resolve themselves",
    ],
    answer: 1,
  },
];

/* ───────────────────────────────────────────────────────────────────────────
 * IT_LADDERS — the swd pilot's 3-item skill-verification ladders.
 *
 * Authored from the APPROVED blueprint docs/assessment-blueprint-swd.md
 * (user-approved 2026-11-05 go), one ladder per swd catalog row (byte-match
 * lock held against lib/fixtures/catalog.ts lines 91–98). Item tier order
 * is per the blueprint's ladder outlines: Q1 recognition → Q2 application →
 * Q3 judgment. The blueprint's §2.1–2.8 sample items are reused verbatim at
 * their matching rungs (key positions preserved: c/d/c/a/d/b/c/a on the
 * sample set); the remaining rungs are authored under the same stem
 * discipline. Every item: `ref` = the on-disk official statement anchor,
 * `distractorNotes` = one why-wrong line per wrong option (option order,
 * key excluded — verbatim source quotes live in the notes, never the key).
 * Key placement varies across rungs; no positional pattern.
 * ─────────────────────────────────────────────────────────────────────────── */
export const IT_LADDERS: SkillLadder[] = [
  // ═══ 2.1 Applications Development (core) — 5 statements routed ═══════════
  {
    skill: "Applications Development",
    catalogSkill: "Applications Development",
    items: [
      // Q1 recognition — the full code-test-debug-document loop is desk work
      {
        skill: "Applications Development",
        catalogSkill: "Applications Development",
        stem:
          "Your team's map lists your role as “develop applications based on the design specifications.” On a normal week, what fills that desk?",
        options: [
          "spend the mornings collecting department change-wish lists and ranking them for the lead",
          "code the assigned screens to spec, run their routine tests, debug failures, keep write-ups current",
          "watch over the staging servers where the finished features land, keeping their uptime tidy",
          "hand every failing build straight to QA untouched and read their findings back at stand-up",
        ],
        answer: 1,
        ref: "PSF-SDS · FSC L3 descriptor + L3 cell (lib/fixtures/rowspec/it.ts:26)",
        distractorNotes: [
          "Sourcing and ranking requirements is the needs-analysis work upstream of the build — the map files it under Business Needs Analysis' FSC L2 “rigorous information gathering”, not the development row.",
          "Matches the desk: the FSC L3 descriptor's loop — “coding, testing, debugging, documenting and reviewing” — and the L3 cell's “run routine application tests, and conduct debugging to resolve errors.”",
          "Hosting/uptime administration belongs to the Linux + web deployment row (its CWF anchors carry it); the development row builds to spec.",
          "The L3 cell puts “routine application tests” and debugging on the developer's own desk before QA's separate pass — skipping your own tests misroutes the row.",
        ],
      },
      // Q2 application — the blueprint's §2.1 sample item, reused verbatim (key c)
      {
        skill: "Applications Development",
        catalogSkill: "Applications Development",
        stem: "Your lead hands you the agreed spec for a refund-processing screen and books the next two weeks for it.",
        options: [
          "rebuild the legacy billing module from scratch while you have the screen open",
          "code the screen from memory first, then read the spec afterwards to speed things up",
          "build the screen to the spec, run the tests, debug what fails, and document the work",
          "hand the finished code to QA untouched so their pass finds the errors",
        ],
        answer: 2,
        ref: "PSOC 2512 · b + PSF-SDS · FSC descriptor (lib/fixtures/rowspec/it.ts:26)",
        distractorNotes: [
          "The FSC descriptor scopes development to “based on the design specifications… in accordance with defined standards” — an unplanned rebuild exceeds the change on your desk.",
          "Development is keyed to the design specifications; code-first-spec-later inverts the loop the descriptor prints.",
          "Distractor note (write-up leg): the sample's KEY matches PSOC b) “researching, designing, and developing computer software systems” plus the L3 cell's “run routine application tests, and conduct debugging.”",
          "The L3 cell has the developer run routine application tests before QA's separate pass; handing findings-finding wholly to QA misroutes the task.",
        ],
      },
      // Q3 judgment — "develop or direct": the associate's do-scope (O*NET 21669, PSOC d/f)
      {
        skill: "Applications Development",
        catalogSkill: "Applications Development",
        stem:
          "A task on the board opens: “Develop or direct software system testing or validation procedures, programming, or documentation.” You are the associate on this team. What does that task hand you?",
        options: [
          "hand the whole testing ticket to the QA pair and mark it delegated on the sprint board",
          "carry the testing, validation, and documentation work yourself, and take directing calls upstairs",
          "rewrite the ticket so its wording stops saying “direct” before you touch anything",
          "hold the ticket untouched until the lead rules on which leg of it this sprint applies",
        ],
        answer: 1,
        ref: "O*NET 15-1252.00 · task 21669 + PSOC 2512 · d, f",
        distractorNotes: [
          "“Directing software testing and validation procedures” (PSOC d) names a supervisory act that sits above the associate — but the task also says “develop”, which is the doing; delegating everything hands over the doing too.",
          "“Develop or direct” includes the doing — the associate builds tests, validation steps, and documentation (O*NET 21669 + PSOC d), while the directing decisions route to the lead's desk.",
          "The wording comes from the printed task list (O*NET 21669); rewriting it dodges the work the task names instead of reading “develop or direct” correctly.",
          "Neither O*NET 21669 nor PSOC d makes the associate a bystander — the task lands on the desk whichever leg the team needs.",
        ],
      },
    ],
  },

  // ═══ 2.2 Applications Support and Enhancement (core) — 5 statements routed ═
  {
    skill: "Applications Support",
    catalogSkill: "Applications Support and Enhancement",
    items: [
      // Q1 recognition — what the support row spans, per the FSC L1-2 descriptor
      {
        skill: "Applications Support",
        catalogSkill: "Applications Support and Enhancement",
        stem:
          "The line above your ticket queue reads: “Provide ongoing technical support and improvements to users of applications.” What does that role hold?",
        options: [
          "plotting the next release's enhancement backlog and pricing each item for the product owner",
          "administering the user accounts on the servers the applications run on",
          "help users install and run the apps, fix the disruptions, and take the change requests",
          "redesigning each app's screens for a cleaner look between the scheduled releases",
        ],
        answer: 2,
        ref: "PSF-SDS · FSC L1-2 descriptor (lib/fixtures/rowspec/it.ts:40)",
        distractorNotes: [
          "The descriptor's scope is “technical guidance and assistance related to the installation and maintenance of applications” — pricing/planning a backlog is an initiative layer, not the support row.",
          "Support's printed text covers the applications themselves; account administration on the platform side has no home in this row.",
          "Matches the descriptor: “technical guidance and assistance related to the installation and maintenance of applications, fixing and resolution of application problems or disruptions, and response to change requests.”",
          "Enhancements ride “response to change requests that will enhance the operations and usage” — open-ended visual redesign is a development initiative, not the support desk's pass.",
        ],
      },
      // Q2 application — the blueprint's §2.2 sample item, reused verbatim (key d)
      {
        skill: "Applications Support",
        catalogSkill: "Applications Support and Enhancement",
        stem:
          "The released expense app rejects every submission for users on one Android version, and finance has queued a summary column for next sprint.",
        options: [
          "tell users on that version it is unsupported and they should upgrade their phones",
          "roll the summary column into the same hotfix so both land together",
          "fix the error and rework the app on a newer framework in the same pass",
          "release the submission-error fix now and queue the summary column as a change request for its sprint",
        ],
        answer: 3,
        ref: "O*NET 15-1252.00 · task 21670 + PSF-SDS · FSC L1-2 descriptor (lib/fixtures/rowspec/it.ts:40)",
        distractorNotes: [
          "The task text adapts software “to new hardware” (O*NET 21670); deflecting to phone upgrades leaves the live disruption unfixed.",
          "“Fixing and resolution of application problems or disruptions” is the immediate support duty (FSC L1-2); the change request waits its queue.",
          "Support is “response to change requests that will enhance the operations and usage” — a framework rebuild exceeds the request's scope and adds release risk.",
          "Distractor note (the KEY's fit): corrects errors first (O*NET 21670) with enhancements handled as change requests (the descriptor's own lane) — the sequence the row prints.",
        ],
      },
      // Q3 judgment — plan a modification with the customer in the loop, coordinate its install
      // (O*NET 21661 + 21666 + PSOC h; 21666 rides this slot per the blueprint)
      {
        skill: "Applications Support",
        catalogSkill: "Applications Support and Enhancement",
        stem:
          "Finance logs a change request: raise the expense app's monthly approval limit from ₱50,000 to ₱100,000, live before the year-end rush. What does your path from ask to install look like?",
        options: [
          "raise the limit's constant, push to production alone overnight, and e-mail finance that it is done",
          "analyze what the change touches, recommend the plan, and coordinate the install with finance in the loop",
          "decline the request as outside support and point finance at the software vendor",
          "fold in two other finance tweaks while the code is open, then report the bigger result",
        ],
        answer: 1,
        ref: "O*NET 15-1252.00 · tasks 21661 + 21666 + PSOC 2512 · h",
        distractorNotes: [
          "“Coordinate installation of software system” (O*NET 21666) is done with the parties, not a solo push; “consulting with customers concerning maintenance of software system” (PSOC h) puts finance in the loop, not on the bcc list.",
          "Matches the tasks: “Analyze information to determine, recommend, and plan installation of a new system or modification of an existing system” (21661), consultation (PSOC h), then coordination (21666).",
          "Modification of an existing system IS this row's task text (O*NET 21661) — offloading it to the vendor hands away the row's own duty.",
          "The plan's object is the requested modification; slipping extra changes into an open deployment is out-of-plan work nobody coordinated with the parties.",
        ],
      },
    ],
  },

  // ═══ 2.3 Agile Software Development (core) — PSF-anchored (single-source, §27) ═
  {
    skill: "Agile Software Development",
    catalogSkill: "Agile Software Development",
    items: [
      // Q1 recognition — what adopting Agile covers across the lifecycle
      {
        skill: "Agile Software Development",
        catalogSkill: "Agile Software Development",
        stem:
          "A new hire rotates onto your sprint team and asks, plainly, what “Agile” adds to how the build runs. What do you tell them?",
        options: [
          "the build runs in short adaptive iterations, letting the app evolve and deploy continuously",
          "one master plan is drawn at kickoff and every change waits for the next funded rewrite",
          "each developer codes solo and merges everything at the quarter's end",
          "the team pushes every passing line to production the moment it compiles",
        ],
        answer: 0,
        ref: "PSF-SDS · FSC L3 descriptor + L3 cell (lib/fixtures/rowspec/it.ts:46)",
        distractorNotes: [
          "KEY note (the fit): paraphrases the printed FSC L3 — “adaptive and iterative methods and techniques in the software development lifecycle to account for continuous evolution, development, and deployment to the end user” — and the L3 cell's adopt-to “develop, improve and deploy.”",
          "The descriptor's word is “adaptive” — a frozen-once master plan denies the lifecycle its continuous evolution.",
          "Iterations are team-run method through the cycle (“iterative methods and techniques”), not a quarter-end merge wall.",
          "Deployment discipline rides the iteration boundary; per-commit shipping is not the printed method.",
        ],
      },
      // Q2 application — sprint discipline when a dependency stalls mid-iteration
      {
        skill: "Agile Software Development",
        catalogSkill: "Agile Software Development",
        stem:
          "Two days into the sprint, the interface your story depends on stalls inside another team's release — and the sprint plan assumed it ready by now.",
        options: [
          "sit quietly on other stories until the dependency untangles on its own",
          "raise the blocker at the daily stand-up so the team re-plans inside the iteration",
          "mark the story done anyway and log the unfinished gap after the review",
          "drop the sprint and restart the whole iteration when the component ships",
        ],
        answer: 1,
        ref: "PSF-SDS · FSC L3 descriptor + L3 cell (lib/fixtures/rowspec/it.ts:46)",
        distractorNotes: [
          "“Adaptive and iterative methods” run through team ceremonies; silence hides the blocked story from the iteration's plan instead of adapting it.",
          "Matches the sprint discipline: the ceremonies exist so the iteration adapts around blockers — the stand-up is where the change moves through the plan.",
          "Calling a blocked story done corrupts the artifact the review plans against — false status, the same wrong the status-report row guards.",
          "Iteration boundaries are deliberate planning points — a mid-sprint restart abandons the plan rather than adapting it.",
        ],
      },
      // Q3 judgment — the blueprint's §2.3 sample item, reused verbatim (key c)
      {
        skill: "Agile Software Development",
        catalogSkill: "Agile Software Development",
        stem: "Day 4 of a two-week sprint. The product owner wants a small, urgent change started today.",
        options: [
          "set the committed sprint work aside and start the change right away",
          "code the change quietly and skip the stand-up so nobody talks you out of it",
          "note the change in the backlog for the next iteration and finish the committed work first",
          "turn away every change request until the project reaches its final release",
        ],
        answer: 2,
        ref: "PSF-SDS · FSC L3 descriptor + L3 cell (lib/fixtures/rowspec/it.ts:46)",
        distractorNotes: [
          "The descriptor's “iterative” commitment scopes change at iteration boundaries; gutting a running sprint breaks the plan without review.",
          "“Adaptive and iterative methods and techniques” run through team ceremonies; a private detour hides the change from the iteration's plan.",
          "KEY note (the fit): “continuous evolution, development, and deployment” is reconciled through iterations, not by interrupting one — change queues for the boundary.",
          "The descriptor is explicit that the lifecycle accounts for “continuous evolution… to the end user”; freezing contradicts it.",
        ],
      },
    ],
  },

  // ═══ 2.4 Data Design / SQL + data modeling (core) — 1 cross-source + PSF ═══
  {
    skill: "Data Design / SQL",
    catalogSkill: "Data Design / SQL + data modeling",
    items: [
      // Q1 recognition — what an efficient JOIN query does right
      {
        skill: "Data Design / SQL",
        catalogSkill: "Data Design / SQL + data modeling",
        stem:
          "The enrollment report's PR carries two query drafts against the clean three-table normalized schema — students, sections, grades. Which pull runs the way the role's craft works?",
        options: [
          "a per-row loop asks the server for each section's grades one call at a time",
          "each morning a scheduled script copies the three tables to a spreadsheet",
          "one query joins the three tables and returns the whole report in a single trip",
          "one pull takes every row of all three tables and filters them down inside the app",
        ],
        answer: 2,
        ref: "PSF-SDS · CWF “Execute basic relational database operations” — JOIN anchor (lib/fixtures/rowspec/it.ts:56)",
        distractorNotes: [
          "Query-per-row loops ship one round trip per section where a single joined query answers once — the anchor's term is “appropriate JOINs,” not per-row calls.",
          "Manual nightly exports break the audit trail; “Store, retrieve, and manipulate data” (O*NET 21676) belongs to the system, not a spreadsheet.",
          "KEY note (the fit): paraphrases the CWF anchor — “Writes efficient SQL queries, using appropriate JOINs to fetch data across multiple tables.”",
          "Pulling everything to filter in app repeats the data instead of asking the server for its answer — the opposite of a single appropriate JOIN.",
        ],
      },
      // Q2 application — retrieve and manipulate data from the database
      {
        skill: "Data Design / SQL",
        catalogSkill: "Data Design / SQL + data modeling",
        stem:
          "The registrar needs today's enrollment counts, by section, on the desk by four o'clock. The counts live in the normalized enrollment database you keep access to.",
        options: [
          "ask ops to snapshot the whole database to a file you can page through after four",
          "borrow the registrar's own spreadsheets over lunch and tally the totals by hand",
          "count yesterday's export instead, so the number arrives early and clean",
          "write the counts as one SQL report against the live tables, run before four",
        ],
        answer: 3,
        ref: "O*NET 15-1252.00 · task 21676",
        distractorNotes: [
          "A whole-database snapshot is heavier than the ask and stale by four — “Store, retrieve, and manipulate data” (O*NET 21676) runs in the system, not in a paged dump.",
          "Hand-tallying other people's spreadsheets is slower and unaudited; the database retrieves and computes — that is the row's task.",
          "Yesterday's count is not today's ask — stale data presented live misinforms the registrar.",
          "KEY note (the fit): the live retrieval is the routed act — “Store, retrieve, and manipulate data for analysis of system capabilities and requirements” (O*NET 21676).",
        ],
      },
      // Q3 judgment — the blueprint's §2.4 sample item, reused verbatim (key a)
      {
        skill: "Data Design / SQL",
        catalogSkill: "Data Design / SQL + data modeling",
        stem:
          "A stakeholder asks you to copy a per-student count into the enrollment table every Monday, saying the stored number “loads faster.”",
        options: [
          "keep the count in a view computed from the tables at read time and store nothing new",
          "write the computed count into the enrollment table each Monday, as the request describes",
          "export the whole database to a spreadsheet each Monday and e-mail it to the requester",
          "fold the tables into one wide table, since a small team does not need normal form",
        ],
        answer: 0,
        ref: "PSF-SDS · CWF DDL/normalized-schema anchor (lib/fixtures/rowspec/it.ts:56) + O*NET 15-1252.00 · task 21676",
        distractorNotes: [
          "KEY note (the fit): preserves the normalized schema while still delivering the data — the CWF anchor's “efficient SQL queries, using appropriate JOINs” read at query time.",
          "Values derived from a query and stored into the normalized schema (the CWF anchor's “normalized relational database schema, using DDL”) double-write and drift stale.",
          "The task's “store, retrieve, and manipulate data” (O*NET 21676) belongs to the system; manual exports break repeatability and audit.",
          "The catalog row's own what — “map business data to normalized relational schema” — and the CWF anchor both key on normalization, not team size.",
        ],
      },
    ],
  },

  // ═══ 2.5 Business Needs Analysis (secondary) — 3 statements + rich PSF ═════
  {
    skill: "Business Needs Analysis",
    catalogSkill: "Business Needs Analysis",
    items: [
      // Q1 recognition — the row's outputs: validated requirements, tech specs, SRS
      {
        skill: "Business Needs Analysis",
        catalogSkill: "Business Needs Analysis",
        stem:
          "A junior shadows the desk during a needs-analysis pass and asks what this role is expected to hand over. What do the listed duties produce?",
        options: [
          "a ranked shortlist of solution vendors, prices and lead-times attached, for purchasing's call",
          "a hardware-sizing estimate for the infrastructure desk to act on next quarter",
          "validated user requirements, translated into technical specifications and the requirement spec (SRS)",
          "the week's stand-up minutes, filed in the tracker for anyone to read back",
        ],
        answer: 2,
        ref: "PSF-SDS · CWF continuation + FSC L2 (lib/fixtures/rowspec/it.ts:63,65)",
        distractorNotes: [
          "Vendor ranking presumes a chosen solution; the row's duties stop at requirements validated with users and scouting “potential solutions” (L2 cell) — selection follows analysis.",
          "Hardware sizing is not this row's printed output; the CWF continuation names requirements validation, translation, and SRS formulation.",
          "KEY note (the fit): matches the printed CWF continuation — “Validate user requirements and design specifications” · “Translate user requirements into technical specifications” · “Formulate software requirement specifications” — with “Document business requirements” from the L2 cell.",
          "Meeting notes are administrative bycatch; “rigorous information gathering and analysis” (FSC L2) produces documented business requirements, not minutes.",
        ],
      },
      // Q2 application — the blueprint's §2.5 sample item, reused verbatim (key D)
      {
        skill: "Business Needs Analysis",
        catalogSkill: "Business Needs Analysis",
        stem:
          "A department head calls: “our reports are slow and it's costing us.” Your first deliverable after the call:",
        options: [
          "an urgent request to IT for bigger servers, sent while the call is still fresh",
          "an apology memo that commits to a fix date before anyone has looked into anything",
          "the raw server logs forwarded to the department to trace the cause themselves",
          "a one-pager pinning down what is slow, for whom, and what acceptable looks like",
        ],
        answer: 3,
        ref: "PSOC 2512 · a + PSF-SDS · CWF anchors (lib/fixtures/rowspec/it.ts:65)",
        distractorNotes: [
          "The CWF anchor orders requirements first (“Validate user requirements and design specifications”); solution selection follows analysis.",
          "“Rigorous information gathering and analysis” (FSC L2) precedes any commitment — the memo commits before the first look.",
          "The analysis duty sits with the analyst/developer; pushing the raw logs back transfers the row's own work to the requester.",
          "KEY note (the fit): matches “researching, analyzing and evaluating requirements” (PSOC a)) and “Translate user requirements into technical specifications” (CWF).",
        ],
      },
      // Q3 judgment — feasibility measured within time and cost, wired to the conferring duty
      {
        skill: "Business Needs Analysis",
        catalogSkill: "Business Needs Analysis",
        stem:
          "Ten more offices want the shared tracking board by March. Funded: one part-time contractor and your sprint hours. What precedes any commitment?",
        options: [
          "promise March on the call itself and leave the schedule to sort itself out afterwards",
          "count each office's migration against the contractor and sprint hours, then weigh March against the numbers",
          "poll the ten offices for opinions on the rollout and attach the survey to the answer",
          "go by last year's pencil notes made on the same kind of ask, scaled by feel",
        ],
        answer: 1,
        ref: "O*NET 15-1252.00 · tasks 21662 + 21664",
        distractorNotes: [
          "O*NET 21662 makes feasibility a judgment made BEFORE design “within time and cost constraints” — promising March before sizing reverses that order.",
          "KEY note (the fit): “Analyze user needs and software requirements to determine feasibility of design within time and cost constraints” (21662), fed by the confer line's “limitations and capabilities, performance requirements and interfaces” (21664).",
          "Opinions are inputs, not measurements — the confer duty (21664) gathers limitations, capabilities, and interface facts, not a survey of preferences.",
          "Last year's notes predate the board's current limits and this year's budgets — an unsized guess wearing a memo's clothes.",
        ],
      },
    ],
  },

  // ═══ 2.6 Secure-coding practices (core) — PSF-anchored (single-source, §27) ═
  {
    skill: "Secure-coding practices",
    catalogSkill: "Secure-coding practices",
    items: [
      // Q1 recognition — the printed secure-coding duty, in the associate's words
      {
        skill: "Secure-coding practices",
        catalogSkill: "Secure-coding practices",
        stem:
          "The build light is green and the deadline reads Friday. What does the secure-coding role put on the person whose hands are on the code?",
        options: [
          "write to the recommended coding standards and secure-coding principles, keeping vulnerabilities out",
          "ship green and lean on a pen-test cycle later to catch what slipped",
          "wait for the security team's vulnerability scan before touching another line",
          "ask the users who find oddities after release to report them upward",
        ],
        answer: 0,
        ref: "PSF-SDS · CWF “Execute secure software development practices” key tasks (lib/fixtures/rowspec/it.ts:74)",
        distractorNotes: [
          "KEY note (the fit): paraphrases the printed key task — “Follow recommended coding standards and secure coding principles to avoid security vulnerabilities.”",
          "“Avoid security vulnerabilities” sits at coding time (the printed first key task); deferring to a later pen-test outsources the desk's own defense.",
          "The automated-tool pass (“Use automated tools for the detection and remediation of basic security designs”) tops off the standards-following duty — it never replaces writing to the standards.",
          "Post-release user reports arrive after the fact; the printed row holds vulnerability prevention at the hands-on code stage.",
        ],
      },
      // Q2 application — the tool-and-remediate workflow on your own change
      {
        skill: "Secure-coding practices",
        catalogSkill: "Secure-coding practices",
        stem:
          "Your profile-photo uploader clears functional review, and the PR is one click from opening. Between here and the merge, what does the role's tooling step look like?",
        options: [
          "hold the tool run until after the merge, then read its report when the sprint calms down",
          "skip it for internal surfaces — the standard practice covers the public ones",
          "run the automated security tool over the uploader, fix what it flags, then open the PR",
          "have the security team run the tool remotely and drop findings in the group channel",
        ],
        answer: 2,
        ref: "PSF-SDS · CWF “Execute secure software development practices” key tasks (lib/fixtures/rowspec/it.ts:74)",
        distractorNotes: [
          "The printed practice runs the automated tools BEFORE release; a post-merge calm read is the timing the key task exists to prevent.",
          "“Internal” is not a printed exemption — the key task names “basic security designs” generally, and internal surfaces reach real users first.",
          "KEY note (the fit): matches the printed key task — “Use automated tools for the detection and remediation of basic security designs” — the tool's pass and its fixes ride the associate's own change, before the PR opens.",
          "The tool pass is the associate's own desk duty; delegating the run off-desk leaves your change unexamined while someone else's queue absorbs it.",
        ],
      },
      // Q3 judgment — the blueprint's §2.6 sample item, reused verbatim (key b)
      {
        skill: "Secure-coding practices",
        catalogSkill: "Secure-coding practices",
        stem:
          "Your pull request adds an internal API endpoint. The automated security scanner has posted two findings on it.",
        options: [
          "merge the branch now and leave anything further to a later pen-test cycle",
          "fix both findings and take the remediation to the senior for sign-off before merge",
          "close the findings as noise, on the view that automated tools over-flag internal endpoints",
          "push the endpoint out behind a flag and watch live traffic for real attacks",
        ],
        answer: 1,
        ref: "PSF-SDS · CWF “Execute secure software development practices” key tasks (lib/fixtures/rowspec/it.ts:74)",
        distractorNotes: [
          "“Avoid security vulnerabilities” happens at coding time (key task 1), not deferred to an external pen-test cycle.",
          "KEY note (the fit): remediation is in scope and “supervision of more senior engineers” is honored — the printed pair detected (tools) + remediated (supervised) is followed exactly.",
          "The key task is to “Use automated tools for the detection and remediation of basic security designs”; scanner findings are the associate's lane, not noise to wave off.",
          "Watching live traffic is not the printed practice; detection is via the automated tools before release.",
        ],
      },
    ],
  },

  // ═══ 2.7 Linux + web deployment basics (secondary) — 1 cross-source + PSF ══
  {
    skill: "Linux + web deployment basics",
    catalogSkill: "Linux + web deployment basics",
    items: [
      // Q1 recognition — the command-line fundamentals the printed key task names
      {
        skill: "Linux + web deployment basics",
        catalogSkill: "Linux + web deployment basics",
        stem:
          "An intern shadows your desk for the week and asks what the Linux command-line role covers. What does the listed key task name?",
        options: [
          "clicking through the team's shared network drives to handle the department's file work",
          "managing files and software at the prompt, and moving files between remote Linux instances",
          "resetting the floor's desk phones whenever their calls drop during the lunch hour",
          "drawing the network's floor plan in slides for the documentation week's hand-in",
        ],
        answer: 1,
        ref: "PSF-SDS · CWF “Perform basic Linux and web operations” key task (lib/fixtures/rowspec/it.ts:82)",
        distractorNotes: [
          "The printed key task is the command line — “navigating directories, listing contents, managing files and directories” — not a GUI over the shares.",
          "KEY note (the fit): rides the printed list — “managing files and directories…, software installation and management…, logging into remote Linux instances, and transferring files between remote instances.”",
          "Telephony resets belong to the network desk; the printed task list never leaves the Linux instance.",
          "Floor-plan slides are documentation artifacts, not the command-line craft the key task prints.",
        ],
      },
      // Q2 application — the blueprint's §2.7 sample item, reused verbatim (key c)
      {
        skill: "Linux + web deployment basics",
        catalogSkill: "Linux + web deployment basics",
        stem: "Tonight your demo web app has to run live on the team's rented cloud Linux server.",
        options: [
          "open every port on the server so nothing is in the demo's way",
          "e-mail the build to the server admin and ask them to put it live in time",
          "SSH in, move the build over, start the app, and check it serves from the server",
          "leave the app running on your laptop and screen-share it at the demo",
        ],
        answer: 2,
        ref: "PSF-SDS · CWF “Able to deploy and administer a web application on a Linux or cloud environment” anchor (lib/fixtures/rowspec/it.ts:82)",
        distractorNotes: [
          "Administer includes configuring the environment to serve the app; an all-ports opening is misadministration, not deployment.",
          "The CWF makes “deploy and administer” and “transferring files between remote instances” the holder's own task, not a hand-off.",
          "KEY note (the fit): “logging into remote Linux instances,” “transferring files between remote instances,” and deploy-administer, in order.",
          "The deployment never happened; the row's task requires the app live on the Linux/cloud environment.",
        ],
      },
      // Q3 judgment — a failing upgrade handled AND documented per PSOC g)
      {
        skill: "Linux + web deployment basics",
        catalogSkill: "Linux + web deployment basics",
        stem:
          "Your Thursday-night upgrade of the app on the team's cloud box fails at the second restart step, half past midnight. You are the one on shift.",
        options: [
          "cut the server off for the night and resume the same way in next Thursday's window",
          "wipe the upgrade's half-run scripts and relaunch the app without a written trace",
          "drop the full error log into the team chat marked “FYI” and close the shift",
          "roll back to the working build, then document the failure and its fix for the next shift",
        ],
        answer: 3,
        ref: "PSOC 2512 · g + PSF-SDS · CWF deploy anchor (lib/fixtures/rowspec/it.ts:82)",
        distractorNotes: [
          "An unwatched failing box is a live risk; the shift owns the return to service, and under it the documented fix never materializes.",
          "Relaunching without a record hides the failure from “documenting maintenance procedures” (PSOC g) — and the wiped scripts block the assessment step the retry needs.",
          "A chat paste is neither a procedure nor a record — PSOC g) wants the maintenance write-up to live as documentation, not conversation.",
          "KEY note (the fit): matches PSOC 2512 g) — “assessing, developing, upgrading and documenting maintenance procedures” — the failure assessed, the fix documented, the working build restored.",
        ],
      },
    ],
  },

  // ═══ 2.8 Enabling bundle (secondary) — 2 statements + PSF ═══════════════════
  {
    skill: "Enabling skills",
    catalogSkill:
      "Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Self Management (Enabling Skills, Basic/Intermediate)",
    items: [
      // Q1 recognition — the behavior layer and its printed Basic/Intermediate levels
      {
        skill: "Enabling skills",
        catalogSkill:
          "Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Self Management (Enabling Skills, Basic/Intermediate)",
        stem:
          "The role's descriptor marks this work at Basic and Intermediate — not expert. What does a week in this seat look like?",
        options: [
          "keep heads-down on the code and take every question straight to the lead instead of the team",
          "wait to be assigned the next tool you learn, one scheduled training session at a time",
          "copy a senior teammate's working pattern exactly, down to their tools and their answers",
          "work the shared boards with your team, keep stakeholders told, pick up tools fast, and own the glitches",
        ],
        answer: 3,
        ref: "PSF-SDS · ESC printed levels + role overview (lib/fixtures/rowspec/it.ts:86-92)",
        distractorNotes: [
          "The overview prints self-direction inside the team — “a strong team player, who communicates their ideas and gets along with others easily”; routing every question to the lead sheds the team-player leg.",
          "Waiting on assigned training contradicts the row's Learning Agility level (Intermediate) — the printed spread asks for absorption on the job, not staged sessions.",
          "Copying a senior's pattern is not any of the six printed legs (Collaboration I · Communication B · Digital Fluency B · Learning Agility I · Problem Solving I · Self Management I) — they are owned personally.",
          "KEY note (the fit): the printed ESC spread and the overview sentence — “a strong team player, who communicates their ideas” — with the keen-learner line carrying the tool fluency.",
        ],
      },
      // Q2 application — the blueprint's §2.8 sample item, reused verbatim (key a)
      {
        skill: "Enabling skills",
        catalogSkill:
          "Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Self Management (Enabling Skills, Basic/Intermediate)",
        stem:
          "Your module slipped a day because a ticket ran bigger than estimated, and the status report is due this afternoon.",
        options: [
          "actual status: the slip, its cause, and the recovery plan for the remaining work",
          "nothing — the lead will see the real state at the demo anyway",
          "the ticket marked complete so the burndown chart stays green",
          "a note in the team channel naming the ticket's original author",
        ],
        answer: 0,
        ref: "O*NET 15-1252.00 · task 21673",
        distractorNotes: [
          "KEY note (the fit): truthful reporting of “activities, or status” is the anchor's core (O*NET 21673); the recovery plan is Self Management showing up.",
          "The task is to prepare the correspondence proactively; silence transfers discovery, not reporting.",
          "Reports/correspondence concern “project specifications, activities, or status”; false status corrupts the very record the report exists to carry.",
          "The role overview keys on being “a strong team player, who communicates their ideas”; blame-routing is not status reporting.",
        ],
      },
      // Q3 judgment — stakeholder pushing scope during a consultation (O*NET 21665)
      {
        skill: "Enabling skills",
        catalogSkill:
          "Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Self Management (Enabling Skills, Basic/Intermediate)",
        stem:
          "Deep in the maintenance consult, the client's manager wanders off-ticket: “While you're in the code, just add a report screen for us too.”",
        options: [
          "open the screen inside the same branch while the maintenance window is still running",
          "refuse the screen inside the call and mark the manager's account “scope-creep”",
          "log the ask, close the consult on the ticket's scope, and send the screen to the change-request lane",
          "agree to the screen out loud and pretend the ticket already covered the work",
        ],
        answer: 2,
        ref: "O*NET 15-1252.00 · task 21665",
        distractorNotes: [
          "New scope inside an open ticket is out-of-plan work; the change-request process exists so additions are weighed (“response to change requests”), not slipped in because the file was open.",
          "The consultation itself is the task (21665); a brusque refusal plus a labeled “difficult” closes the channel the overview's team-player line keeps open.",
          "KEY note (the fit): the consult covers “status, proposals, or technical issues” — the meeting carries the ask to the record, and scope lives in the change-request lane, not in the open ticket.",
          "A verbal yes without ticket or lane is an unrecorded commitment — the record the consult exists to produce gets none.",
        ],
      },
    ],
  },

  // ════════════════════ wave 2 · qa · Software QA Analyst (roster 2.2) ═══════
  // Anchors: O*NET 15-1253.00 (research/onet-enrich/pulls/15-1253.00.tasks{,.p2,.p3}.json),
  // PSOC 2519 lettered lines (research/snapshots/psoc/psoc2012-parsed.csv:284),
  // PSF-SDS verbatim quotes in lib/fixtures/rowspec/it.ts (lines 96–156).
  {
    skill: "Software Testing",
    catalogSkill: "Software Testing",
    items: [
      // Q1 recognition — what executing testing covers (PSF FSC L2-3 descriptor)
      {
        skill: "Software Testing",
        catalogSkill: "Software Testing",
        stem:
          "The QA desk's card reads: “assess and test the overall effectiveness and performance of an application, involving the setting up of suitable testing conditions, definition of test cases and/or technical criteria.” What fills a testing day at this desk?",
        options: [
          "record every developer conversation so the team has a paper trail of who said what",
          "set up the testing conditions, write the test cases against the technical criteria, and run them",
          "walk the office collecting complaints about the app and typing them into a shared sheet",
          "bench-test the laptops and monitors the developers use before they get them",
        ],
        answer: 1,
        ref: "PSF-SDS · qa FSC L2–3 descriptor (lib/fixtures/rowspec/it.ts:107)",
        distractorNotes: [
          "Meeting minutes are record-keeping, not the descriptor's “suitable testing conditions, definition of test cases” — the card puts testing work on your desk, not transcripts.",
          "Matches the descriptor: setting up testing conditions, defining test cases against technical criteria, and assessing performance are the row's named acts.",
          "Complaint gathering is user research, not the FSC's testing act — the descriptor keys on test conditions and criteria, not office sentiment.",
          "Hardware bench-testing belongs to the support family's rows; the testing row's object is the application's effectiveness and performance.",
        ],
      },
      // Q2 application — verify before implementation (PSOC 2519 c + O*NET 14639)
      {
        skill: "Software Testing",
        catalogSkill: "Software Testing",
        stem:
          "A developer's fix for the broken invoice-export lands Thursday evening and is queued to move to production Monday.",
        options: [
          "run the fix's verified test cases one full time and sign the promotion paper on the spot",
          "rerun the export cases and the regression set of neighboring features Monday morning before the move",
          "skip the retest — the developer wrote in the ticket that it works, and Monday is close",
          "tell production to promote it and you will spot-check the feature by hand sometime next week",
        ],
        answer: 1,
        ref: "PSOC 2519 · c + O*NET 15-1253.00 · task 14639 (research/onet-enrich/pulls/15-1253.00.tasks.json)",
        distractorNotes: [
          "PSOC c) requires verifying that programs function “according to user requirements and established guidelines”; one nib of one case is a gesture, not verification of export plus its neighbors.",
          "The fit: verification of the fix against user requirements and established guidelines, plus the system-modification retest O*NET 14639 asks for before implementation.",
          "The developer's self-report is not the tester's evidence — the unit's verification act is yours to perform, and Monday's closeness does not remove it.",
          "Promote-then-check inverts O*NET 14639 (“Test system modifications to prepare for implementation”); the testing happens ahead of the move, not after.",
        ],
      },
      // Q3 judgment — initial debugging is in the tester's lane (O*NET 14661)
      {
        skill: "Software Testing",
        catalogSkill: "Software Testing",
        stem:
          "The fresh build fails your checkout case with no error message. The developer who owns it is on a call and the case blocks a whole test cycle.",
        options: [
          "mark the case blocked in the tracker and wait at your desk for the developer to come back",
          "review the run's logs and configuration files for the breakdown source, then report what you find",
          "delete the environment and reinstall everything from scratch so the case can rerun clean",
          "rewrite the case so it stops touching checkout and passes on the other features",
        ],
        answer: 1,
        ref: "O*NET 15-1253.00 · task 14661 + PSF-SDS keyword (lib/fixtures/rowspec/it.ts:109)",
        distractorNotes: [
          "Folding into “blocked” abandons the investigation O*NET 14661 prints in this role — reviewing configuration files and logs to determine the breakdown source is the tester's initial act.",
          "The fit: O*NET 14661's initial debugging — reviewing logs and config files to determine breakdown source — unblocks the cycle with evidence, not a wait.",
          "A blind reinstall destroys the evidence the logs hold; the task is to determine the source, not to wipe the scene of the question.",
          "Re-scoping the case to make it pass corrupts the suite — the checkout behavior is precisely what the cycle exists to test, and the fix lands in the code, not the script.",
        ],
      },
    ],
  },

  {
    skill: "Test Planning",
    catalogSkill: "Test Planning",
    items: [
      // Q1 recognition — what a test plan holds (PSF FSC descriptor + L2 cell)
      {
        skill: "Test Planning",
        catalogSkill: "Test Planning",
        stem:
          "Your QA lead asks you to write the test plan for next month's release. Which description matches the artifact the role lists?",
        options: [
          "a strategy with systematic test procedures to verify the product meets its design specifications and the set performance, load, and volume levels",
          "a one-page memo stating the release date, the names of the people who will test, and the risks announced in the previous release meeting",
          "a list of every defect ever recorded on the product, pasted with dates and the developers who filed each of them",
          "a schedule of the coffee breaks and meeting rooms booked for testing week",
        ],
        answer: 0,
        ref: "PSF-SDS · Test Planning FSC descriptor + L2 cell SDS-DIM1-2020-1.1 (lib/fixtures/rowspec/it.ts:98)",
        distractorNotes: [
          "The fit: the FSC descriptor's “test strategy and systematic test procedures… design specifications as well as the performance, load and volume levels” — the L2 cell's tools/testware/resources work rides behind it.",
          "A memo of dates, names and yesterday's announced risks carries none of the strategy, procedures, or levels the descriptor names — it reads the release banner, not the plan.",
          "A defect history with its filers is the defect tracker's job (another row); the plan is forward-looking: what will be tested, how, and with what.",
          "Logistics ride behind the plan as testware and resources (the L2 cell), but they are not the artifact's substance — conditions, criteria, and coverage are.",
        ],
      },
      // Q2 application — schedule/strategy per scope and dates (O*NET 14645)
      {
        skill: "Test Planning",
        catalogSkill: "Test Planning",
        stem:
          "Three modules changed this cycle and delivery is fixed for the 15th. Your senior asks for the test schedule first.",
        options: [
          "schedule every historical test case ever written for the product across three weeks and submit it late",
          "copy last release's plan unchanged and hand it over within the hour",
          "tell the lead no schedule is possible until the developers finish all fixes",
          "sequence the three modules' cases against the fixed date, flag the thin spots, and submit it for review",
        ],
        answer: 3,
        ref: "O*NET 15-1253.00 · task 14645 + PSF-SDS L3 cell SDS-DIM1-3020-1.1 (lib/fixtures/rowspec/it.ts:98)",
        distractorNotes: [
          "O*NET 14645 plans test schedules “in accordance with project scope or delivery dates” — a three-week path that ignores the fixed 15th is a plan for a different project.",
          "Last release's plan belongs to last scope; the row's L3 cell keys on identifying schedules suited to the current phase's changes.",
          "The plan is precisely the bridge while code is unfinished — the scope and dates anchor the schedule regardless of when builds land.",
          "The fit: 14645's schedule-per-scope-and-dates, plus the L3 cell's phase test plan identifying schedules for executing test scripts, with gaps surfaced rather than hidden.",
        ],
      },
      // Q3 judgment — validate test data through quality processes (PSF key task 2)
      {
        skill: "Test Planning",
        catalogSkill: "Test Planning",
        stem:
          "A stakeholders' meeting floods your fresh test plan with three opinions: cut UAT entirely, drop regression, or add a fourth round load test nobody budgeted. You must hand something defined to the cycle.",
        options: [
          "cut UAT and regression both — the load-test ask already proves quality matters to the client, so the coverage cuts cost nothing this cycle",
          "adopt the unbudgeted load-test round and promise the team will absorb the hours silently, without telling anyone what else slips",
          "write the plan per the agreed scope, show each cut's risk alongside the L2 map of tools and resources, and route the scope change through your lead",
          "fold the three opinions into one plan that mentions each as a “possible adjustment,” never states what stays in scope, and hands the cycle no path",
        ],
        answer: 2,
        ref: "PSF-SDS · key task 2 “Validate test data requirements following quality processes” (lib/fixtures/rowspec/it.ts:100)",
        distractorNotes: [
          "Dropping coverage to please one voice inverts the key task — “validate test data requirements following quality processes” weighs the requirements agains the processes, not away from them.",
          "Absorbing unbudgeted scope silently hides a resourcing decision from the people the plan exists to inform — the L2 cell “identify and document… resources” refuses that.",
          "The fit: validate the requirements against the quality processes, put the tradeoffs on paper with the resources they each need, and let scope moves route through the owner.",
          "A plan that refuses to decide what is in and out is the schedule-fake version of silence — the artifacts' purpose is one stated path to verify coverage.",
        ],
      },
    ],
  },

  {
    skill: "Defect management",
    catalogSkill: "Defect management",
    items: [
      // Q1 recognition — log, track, describe (PSF key tasks)
      {
        skill: "Defect management",
        catalogSkill: "Defect management",
        stem:
          "The defect-tracking day starts with three failed runs and one user complaint forwarded to you. What does this role's record-keeping ask of the person on the desk?",
        options: [
          "log every test result and behavior accurately in the tracker, and write structured descriptions when reporting the defects",
          "keep a private notebook of every defect, and read the day's entries aloud at the sprint review only when a developer asks",
          "sort the failures by how angry the requester seems and call only the angriest one back before stand-up",
          "mark all three failed runs as environment flukes until someone proves otherwise in writing",
        ],
        answer: 0,
        ref: "PSF-SDS · Defect management key tasks (lib/fixtures/rowspec/it.ts:118–119)",
        distractorNotes: [
          "The fit: the printed tasks “Accurately log all test run results, environment or software behaviors” and “Provide clear structured descriptions when reporting defects found.”",
          "The tracker is the shared record the rows exist for — a private notebook hides the state from the developers the descriptions are written for.",
          "Severity on the tracker follows the defect's impact and structure, not the requester's tone — sorting by anger is the inverse of “clear structured descriptions.”",
          "Self-dismissing runs as flukes fakes the record (“Accurately log all test run results”) before any verification has happened.",
        ],
      },
      // Q2 application — the tracker + report circle (O*NET 14641)
      {
        skill: "Defect management",
        catalogSkill: "Defect management",
        stem:
          "You broke the checkout case with a duplicated-order bug on the staging environment. Your developer lead is in another time zone.",
        options: [
          "file the defect in the tracker with exact steps, expected vs actual behavior, and the environment, then assign it publicly to the lead",
          "wait for the lead to appear online and tell them verbally, with nothing written down in the meantime, on the theory that speech beats paperwork",
          "e-mail a fully written apology memo directly to the client list describing the staging bug and its likely effect",
          "retest the bug forty more times overnight until the tracker load dissuades you from filing",
        ],
        answer: 0,
        ref: "O*NET 15-1253.00 · task 14641 (research/onet-enrich/pulls/15-1253.00.tasks.json)",
        distractorNotes: [
          "The fit: 14641's circle — document the defect in a bug tracking system and report it to the software developers; the tracker is how a report crosses time zones.",
          "A verbal first-contact with no filing breaks the record — by the time the lead wakes, the steps that failed have moved or been rerun without evidence.",
          "The staging defect is internal work-in-progress; the printed task reports defects to developers, not to customers.",
          "Retesting is legitimate verification, but refiling because the tracker got heavy is not logging — the documented defect with its steps is the row's deliverable.",
        ],
      },
      // Q3 judgment — monitor resolution (O*NET 14643 + key task 9)
      {
        skill: "Defect management",
        catalogSkill: "Defect management",
        stem:
          "The lead marked your checkout defect “fixed by change #482.” Your retest on staging still duplicates the order.",
        options: [
          "re-open it in the tracker with the retest's steps and the build you ran, and ask which environment the change targeted",
          "close it yourself as fixed since the lead's confidence carries senior sign-off without any retest",
          "file a brand-new defect so the original stays resolved and the metrics stay green",
          "mark it resolved again with a comment “tested, fine” so the board stops flashing red before the demo",
        ],
        answer: 0,
        ref: "O*NET 15-1253.00 · task 14643 + PSF-SDS key task 9 (lib/fixtures/rowspec/it.ts:119)",
        distractorNotes: [
          "The fit: 14643's monitor-the-resolution of the bug plus the PSF task's “Ask clarifying questions to create complete test documentation” — the retest evidence and the environment question are exactly the monitoring and the clarifying.",
          "Senior sign-off on a “fixed” label is not the retest O*NET 14643 pairs it with; your tracker record exists precisely because the code's word outranks nobody's confidence.",
          "A new duplicate corrupts “Monitor bug resolution efforts and track successes” — the original's resolution claim is the thing being tracked.",
          "Filing “tested, fine” against evidence falsifies the record the tracker exists to carry — the board's color cannot outrun the retest.",
        ],
      },
    ],
  },

  {
    skill: "Quality Assurance / Quality Standards",
    catalogSkill: "Quality Assurance / Quality Standards",
    items: [
      // Q1 recognition — the two-card combined row (PSF card descriptors)
      {
        skill: "Quality Assurance / Quality Standards",
        catalogSkill: "Quality Assurance / Quality Standards",
        stem:
          "The release meeting asks the owner of this work to attend. What does the combined QA / Quality Standards description put on the desk?",
        options: [
          "a set of steps to rename the product's version numbers to increased values each month, framed as the year's quality achievement",
          "a flyer announcing the next company-wide pizza party for bug-free weeks, plus a thank-you wall for the developers who passed",
          "a gallery of screenshots of the product looking flawless, bound and couriered to the marketing team every Friday",
          "a practice of quality standards applied to performance-review fields, and quality expectations aligned to business objectives and product-service quality",
        ],
        answer: 3,
        ref: "PSF-SDS · Quality Assurance L4 SDS-DIM1-4013-1.1 + Quality Standards L4 SDS-RMG1-4008-1.1 (lib/fixtures/rowspec/it.ts:126)",
        distractorNotes: [
          "Version-number cosmetics are release packaging, not the card's “quality assurance audits… and review of QA process effectiveness.”",
          "The cards name quality expectations and standards inside the organization — celebration mechanics has no place in either card.",
          "Screenshots for marketing are collateral, not the audit-and-align work the two cards print.",
          "The fit: Quality Assurance's “apply quality standards… through the planning and conduct of quality assurance audits” joined with Quality Standards' “clear, quality expectations… aligned to the company's values and business objectives.”",
        ],
      },
      // Q2 application — replicable procedures (O*NET 14648)
      {
        skill: "Quality Assurance / Quality Standards",
        catalogSkill: "Quality Assurance / Quality Standards",
        stem:
          "Your five-person test team runs the same release suite by feel — each tester clicks around in their own order, and reruns come out different.",
        options: [
          "no procedure needed — five people at five speeds is exactly the diversity QA is proud of",
          "document the test procedures step by step so any rerun, by any tester, is replicable and compliant",
          "have each tester video their screen and archive the videos as the standard",
          "move the whole suite onto one spreadsheet and let the fastest tester own it",
        ],
        answer: 1,
        ref: "O*NET 15-1253.00 · task 14648 (research/onet-enrich/pulls/15-1253.00.tasks.json)",
        distractorNotes: [
          "Feel-based reruns are the exact problem 14648 addresses — “document test procedures to ensure replicability and compliance with standards.”",
          "The fit: documented, replicable, standards-compliant procedures — written so the fifth rerun executes what the first intended.",
          "Videos capture behavior but not the procedure; the task is documentation of steps, and a video is no substitute for the written, replicable standard.",
          "Concentrating ownership on one spreadsheet-and-person makes the process less replicable, not more — the standard must outlive any single tester.",
        ],
      },
      // Q3 judgment — release readiness call (O*NET 14649)
      {
        skill: "Quality Assurance / Quality Standards",
        catalogSkill: "Quality Assurance / Quality Standards",
        stem:
          "Release day. One unresolved defect remains unfixed; the client is present in the room pressing hard.",
        options: [
          "certify release readiness as green — the client's presence counts as the method for determining quality",
          "state the defect's risk honestly against the release-readiness standards the team set, and let the decision route through the owner with the defect on the record",
          "delete the defect from the tracker ten minutes before the meeting so the board reads clean and the meeting starts from an empty defect column",
          "present the defect but recommend shipping anyway as “an acceptable risk nobody discussed before today”",
        ],
        answer: 1,
        ref: "O*NET 15-1253.00 · task 14649 (research/onet-enrich/pulls/15-1253.00.tasks.json)",
        distractorNotes: [
          "14649's “standards, methods, or procedures to determine product quality or release readiness” are set ahead of the meeting — a client's presence in a hallway is not a method.",
          "The fit: the readiness call is made against the standards and methods the team specified, with the defect stated on the record and the release decision routed to its owner.",
          "Deleting the defect corrupts the record 14649 exists to protect — readiness is judged on what is true, not on what the board shows.",
          "The honest part is preserved, but “nobody discussed” reveals the method was invented in the room — a readiness call needs the standards-methods-procedures of 14649, not a mid-meeting improvisation.",
        ],
      },
    ],
  },

  {
    skill: "QA Enabling row",
    catalogSkill:
      "Customer Orientation · Digital Fluency · Learning Agility · Sense Making · Problem Solving (Enabling)",
    items: [
      // Q1 recognition — the printed ESC levels
      {
        skill: "QA Enabling row",
        catalogSkill:
          "Customer Orientation · Digital Fluency · Learning Agility · Sense Making · Problem Solving (Enabling)",
        stem:
          "Your QA onboarding page lists the enabling-skills bundle: Adaptability, Communication, and friends at stage I, with two at the top of their scale. Which two lead the list?",
        options: [
          "Adaptability and Sense Making",
          "Customer Orientation and Communication",
          "Digital Fluency and Problem Solving",
          "Building Inclusivity and Transdisciplinary Thinking",
        ],
        answer: 2,
        ref: "PSF-SDS · qa ESC aggregate as printed (lib/fixtures/rowspec/it.ts:150)",
        distractorNotes: [
          "Adaptability and Sense Making print at Intermediate (stage I) on the tester map.",
          "Customer Orientation and Communication print at Intermediate.",
          "The fit: the aggregate as printed carries Digital Fluency and Problem Solving at Advanced, all others at Intermediate.",
          "Building Inclusivity and Transdisciplinary Thinking print at Intermediate (stage I).",
        ],
      },
      // Q2 application — test data with the client in the loop (role overview)
      {
        skill: "QA Enabling row",
        catalogSkill:
          "Customer Orientation · Digital Fluency · Learning Agility · Sense Making · Problem Solving (Enabling)",
        stem:
          "A client e-mails half-formed recollections of how their ordering flow behaves: “I think we ship on the 5th, or maybe we ship each Monday, it changed once in the rain year.”",
        options: [
          "ghost the e-mail thread until the client learns to send better notes",
          "run the scenario in the app yourself and report only what the testers find, no questions",
          "interact with the client to understand the software product's requirements and prep the test data accordingly",
          "file the confusion as out of scope and test whatever default the system shows today",
        ],
        answer: 2,
        ref: "PSF-SDS · qa role overview fragments (lib/fixtures/rowspec/it.ts:152)",
        distractorNotes: [
          "The overview puts the tester's client interaction inside the working set — ghosting abandons the “understand software or product requirements” act the row prints.",
          "Testing only your own view skips the requirements the overview says testers pick up from the client — the customer orientation half of the row.",
          "The fit: the overview's sentence — testers “interact with clients to understand software or product requirements to assist in test data preparation” — the confirmation call and the resulting data prep are both the row's.",
          "Default-driven testing would meet today's system state and miss the flow the client is describing — without the client's picture, the data prepared is not the flow's.",
        ],
      },
      // Q3 judgment — usability feedback channel (O*NET 14653)
      {
        skill: "QA Enabling row",
        catalogSkill:
          "Customer Orientation · Digital Fluency · Learning Agility · Sense Making · Problem Solving (Enabling)",
        stem:
          "In testing you find the new invoice screen is technically to spec but every participant fumbles it. The screen's developer is defensive and the deadline is close.",
        options: [
          "announce in the team channel that the developer built a screen the users hate, citing the fumbles as proof",
          "provide the fumble findings plus a recommendation for the flow to the developers through the defect/feedback channel, evidence attached",
          "decide the participants were unrepresentative and wipe the findings before anyone sees them",
          "keep it to yourself — with a close deadline the technical spec passing is what the cycle reports",
        ],
        answer: 1,
        ref: "O*NET 15-1253.00 · task 14653 (research/onet-enrich/pulls/15-1253.00.tasks.json)",
        distractorNotes: [
          "Public shaming is not feedback — 14653 asks the tester to “provide feedback and recommendations to developers” through the channel built for development, not the team arena.",
          "The fit: 14653's usability/functionality feedback and recommendations, delivered to developers with the evidence — the exact triad the enabling row's Problem Solving collab assets serve.",
          "Wiping evidence because participants are inconvenient defeats sense making — the findings exist as found, representativeness is judged, not asserted.",
          "Withholding it corrupts the release picture the testers exist to assemble — the technical spec passing and the users failing are both facts to route to developers.",
        ],
      },
    ],
  },

  // ══════════════════════ wave 2 · ba · Business Analyst (IT) (2.3) ══════════
  // Anchors: PSOC 2511 lettered lines (research/snapshots/psoc/psoc2012-parsed.csv:280),
  // PSF-SDS verbatim quotes in lib/fixtures/rowspec/it.ts (lines 159–207).
  {
    skill: "Requirements Analysis",
    catalogSkill: "Requirements Analysis",
    items: [
      // Q1 recognition — discovery/documentation/analysis (PSF role overview + key tasks)
      {
        skill: "Requirements Analysis",
        catalogSkill: "Requirements Analysis",
        stem:
          "Your junior-BA onboarding sheet says: “This role involves participation in customer discovery, requirements documentation, and business analysis activities.” On weeks without a workshop, what fills that description?",
        options: [
          "run stakeholder interviews and surveys, perform the gap analysis, and document the business rules",
          "write weekly status letters to the CEO summarizing every department's morale",
          "redesign the company's organizational chart into a shape the software would like more",
          "man the help-desk phone queue to hear complaints fresh from the users",
        ],
        answer: 0,
        ref: "PSF-SDS · ba role overview + CWF key tasks (lib/fixtures/rowspec/it.ts:161–163)",
        distractorNotes: [
          "The fit: the key tasks print exactly this — “Conduct stakeholder interviews, workshops, and surveys to gather business requirements,” “Perform gap analysis between current and desired processes/systems,” “Document business rules, policies, and regulatory compliance needs.”",
          "Executive status letters are communication chores from a different role; the overview's three acts are discovery, documentation, and analysis on the requirements themselves.",
          "Org-chart redesign is management design, not the analyst's “requirements documentation… business analysis activities” — the row scopes the organization's process needs, not its reporting shape.",
          "Man-phone help desk is IT support work; the BA interviews stakeholders in planned sessions, not by absorbing a call queue.",
        ],
      },
      // Q2 application — formulate & document requirements with agreement (PSOC 2511 a)
      {
        skill: "Requirements Analysis",
        catalogSkill: "Requirements Analysis",
        stem:
          "The HR head wants “a portal, finally, so people stop e-mailing payslips.” Your first working session as the BA in the room:",
        options: [
          "quote them an installation date and price for a generic portal product you saw demoed last month",
          "agree to build a payslips viewer yourself over the weekend on your laptop and demo it Monday",
          "consult with the users to formulate and document requirements, and confirm the systems principles with management before anything is built",
          "send a survey with forty yes/no questions to all five hundred staff, then stop accepting comments after three days",
        ],
        answer: 2,
        ref: "PSOC 2511 · a (research/snapshots/psoc/psoc2012-parsed.csv:280)",
        distractorNotes: [
          "Selecting and pricing a product skips the formulation and documentation the unit prints — the first session is requirements, not procurement.",
          "A weekend demo is development, not requirements; the analyst's deliverable at this stage is the documented consult, not software.",
          "The fit: PSOC 2511 a) — “consulting with users to formulate and document requirements and with management to ensure agreement on systems principles.”",
          "A blast survey proves the consultant didn't consult — the unit's act pairs user formulation and documentation with management agreement.",
        ],
      },
      // Q3 judgment — inefficiencies and optimal practice (PSOC 2511 c)
      {
        skill: "Requirements Analysis",
        catalogSkill: "Requirements Analysis",
        stem:
          "You find the warehouse's double-entry practice (paper then spreadsheet) belongs to a software quirk nobody has questioned in seven years. The floor staff defend it as “how we've always done it.”",
        options: [
          "record the paper-plus-spreadsheet practice in the spec as the requirement — users are the requirement's owners and so is any practice they defend",
          "identify and evaluate the inefficiency, then recommend the change as an optimal business practice, evidence sheet attached",
          "tell the floor staff the practice is banned effective Friday per your analysis",
          "leave it out of the requirements entirely — the practice is procedural, not technical, so it never enters the analyst's document",
        ],
        answer: 1,
        ref: "PSOC 2511 · c (research/snapshots/psoc/psoc2012-parsed.csv:280)",
        distractorNotes: [
          "Users own their needs, but the unit distinguishes formulating requirements from evaluating practices — defended habits are exactly what the “evaluating inefficiencies and recommending… practices” act works through.",
          "The fit: PSOC 2511 c) — identify the inefficiency, evaluate it, recommend the optimal business practice with evidence; double entry on paper is its textbook target.",
          "Fridays-bans replace evaluation with authority — recommendations backed by evidence carry the users' cooperation that a unilateral ban forfeits.",
          "Out-of-document means the work practice never gets evaluated; the unit's evaluation duty covers the whole process, not its software slice alone.",
        ],
      },
    ],
  },

  {
    skill: "Requirements Specification",
    catalogSkill: "Requirements Specification",
    items: [
      // Q1 recognition — the spec artifacts (PSF key tasks)
      {
        skill: "Requirements Specification",
        catalogSkill: "Requirements Specification",
        stem:
          "The workshop round is done. On this role, what are the artifacts you produce for the people who will build it?",
        options: [
          "functional specifications and user stories, with low-fidelity prototypes and wireframes for the proposed solutions",
          "hand the workshop participants the recorded audio and let the developers transcribe",
          "a single-pager saying “the system described in the workshops” so the team has freedom",
          "an unexplained direct hand-over of your notebook pages every ten days",
        ],
        answer: 0,
        ref: "PSF-SDS · Requirements Specification key tasks (lib/fixtures/rowspec/it.ts:170)",
        distractorNotes: [
          "The fit: the row prints “Translate business requirements into functional specifications and user stories” and “Develop low-fidelity prototypes and wireframes for proposed solutions.”",
          "Raw audio is the workshop record, not the translation — the key task's verb is translate, performed by the analyst.",
          "“The system described in the workshops” delegates the translation the row owns; the spec exists so builders and stakeholders share one written thing.",
          "Notebook pages lack the authored structure the key tasks print — functional specs, user stories, wireframes, and the mapping to build components.",
        ],
      },
      // Q2 application — functional specs for the builders (PSOC 2511 e)
      {
        skill: "Requirements Specification",
        catalogSkill: "Requirements Specification",
        stem:
          "The last workshop cleared the persistent confusion about the pricing rule. Next deliverable, per the hand-off schedule:",
        options: [
          "deliver the audio recording of your workshop without any written synthesis",
          "ask the developers to sit with the users directly from now on, so your middleman work ends",
          "write walkthrough instructions for every user's keyboard so nobody ever mis-clicks again",
          "a written functional specification of the pricing rule for the systems developers, walked back with the stakeholders",
        ],
        answer: 3,
        ref: "PSOC 2511 · e (research/snapshots/psoc/psoc2012-parsed.csv:280)",
        distractorNotes: [
          "Audio without synthesis hands developers the raw material instead of the specification the unit names as the deliverable.",
          "Cutting the middle layer contradicts the unit's own hand-off chain — it has the analyst develop the functional specification specifically “for use by systems developers.”",
          "Per-click instructions are user training material, not the system requirement — the pricing rule is the settled business content developers need in writing.",
          "The fit: functional specifications for the builders — produced after the workshop's understanding and walked for validating the proposed solution.",
        ],
      },
      // Q3 judgment — validate through walkthroughs (PSF key task 5)
      {
        skill: "Requirements Specification",
        catalogSkill: "Requirements Specification",
        stem:
          "The build team starts next Monday. Your senior notices the two prototypes in your spec never got shown back to the users and asks you what happens this week.",
        options: [
          "ship the spec as is — a prototype risk is a build risk, and the developers will surface the users' needs anyway",
          "run the walkthroughs and reviews with the stakeholders now; the validation carries the spec into the build round proved",
          "ask the users for their sign-off stamp on the finished spec by e-mail and count that as the walkthrough",
          "have the developers build to spec, then treat the build's behavior as the prototypal feedback instead",
        ],
        answer: 1,
        ref: "PSF-SDS · Requirements Specification key task 5 (lib/fixtures/rowspec/it.ts:170)",
        distractorNotes: [
          "Passing the risk forward wastes the validation gate the row provides — the spec is what gets checked, and post-build discovery is the cheapest place for surprises never to appear.",
          "The fit: the row's key task “Validate proposed solutions through stakeholder walkthroughs and reviews” — the unvalidated prototypes are precisely what a review round is for.",
          "An e-mail yes is a signature, not a walkthrough review — the row's validation act shows the solution to the stakeholders and gathers their input.",
          "Using the build as a prototype burns the money the validation gate exists to protect — the walkthrough happens on paper at spec stage, priced at hours not sprints.",
        ],
      },
    ],
  },

  {
    skill: "Solution Support",
    catalogSkill: "Solution Support (UAT & hand-over)",
    items: [
      // Q1 recognition — the printed CWF trio (PSF CWF name + key tasks)
      {
        skill: "Solution Support",
        catalogSkill: "Solution Support (UAT & hand-over)",
        stem:
          "The BA map lists a work function called “Solution Support.” What does its block of work hold?",
        options: [
          "coordinating user acceptance testing, supporting deployment and training, and change management efforts",
          "programming the production database changes once the deployment has already gone live",
          "handling the suppliers' invoices that the deployment team forwarded for review",
          "the IT department's staff recruitment and training records kept together for audit season",
        ],
        answer: 0,
        ref: "PSF-SDS · Solution Support CWF key tasks (lib/fixtures/rowspec/it.ts:177)",
        distractorNotes: [
          "The fit: the key tasks print “Coordinate and facilitate user acceptance testing (UAT) activities · Support solution deployment, training, and change management efforts.”",
          "Post-deployment database work belongs to the DBA family; the CWF's support act is coordination, not programming.",
          "Supplier invoicing is procurement's bookkeeping — the CWF concerns the user's acceptance of the solution, not the suppliers behind it.",
          "HR records are the HR function; the print's call is users, deployment, training, and change management.",
        ],
      },
      // Q2 application — deploy with test plans (PSOC 2511 d)
      {
        skill: "Solution Support",
        catalogSkill: "Solution Support (UAT & hand-over)",
        stem:
          "The finance module passed development and UAT is scheduled for next two weeks with thirty staff testers expected.",
        options: [
          "e-mail every tester the build and ask them to “write anything unusual to the group chat”",
          "create and implement the system test plans for the UAT window, coordinate the testers, and track the outcomes against the plan",
          "schedule the UAT to run only over the weekend while nobody's watching on purpose, then report its passing",
          "postpone the UAT until the module passes a demo to the board, since the board's word outranks users'",
        ],
        answer: 1,
        ref: "PSOC 2511 · d (research/snapshots/psoc/psoc2012-parsed.csv:280)",
        distractorNotes: [
          "An open-ended group-chat test is not a test plan — the unit's “creating, adopting and implementing system test plans” gives the window a structured measure.",
          "The fit: PSOC 2511 d) — “taking responsibility for deploying functional solutions, such as creating, adopting and implementing system test plans,” plus the CWF's coordinate-and-facilitate UAT activities.",
          "A hidden-around-nobody weekend pass is record-keeping theater — UAT measures what thirty actual users of the module could do.",
          "A board demo is a communication act, not user acceptance — the module's UAT measures what the users do with it, not how it shows.",
        ],
      },
      // Q3 judgment — feedback loop continuous improvement (key task 4)
      {
        skill: "Solution Support",
        catalogSkill: "Solution Support (UAT & hand-over)",
        stem:
          "UAT week: four of the thirty testers stop submitting anything, saying in the huddle the new module costs them “half of each morning they never get back.”",
        options: [
          "log all four as “will adjust eventually” and close the UAT with its passing score the module earned",
          "escalate the four to HR for performance conversations with their department head so the buck leaves your desk",
          "gather and document the feedback — the morning-cost complaint is exactly the loop the CWF's “for continuous improvement” leg exists for",
          "answer that the software is what it is and that their workflow will simply adjust; the UAT score stands as measured",
        ],
        answer: 2,
        ref: "PSF-SDS · “Gather and document feedback from end-users for continuous improvement” (lib/fixtures/rowspec/it.ts:177)",
        distractorNotes: [
          "A pass score with unmeasured user costs is not acceptance — the CWF's improvement loop runs off the gathered feedback, which the score alone cannot carry.",
          "HR escalation tries to discipline the testers out of being a symptom — the feedback names a module problem, and the analyst's act is to document it.",
          "The fit: the printed task “Gather and document feedback from end-users for continuous improvement” — the huddle is a UAT signal, and its handling is the analyst's.",
          "“Will adjust eventually” dismisses the user costs before they are measured — the loop the task prints exists precisely so this complaint shapes the solution's support.",
        ],
      },
    ],
  },

  {
    skill: "Process modeling",
    catalogSkill: "Process modeling (flow diagrams, use cases)",
    items: [
      // Q1 recognition — what the models are (same-CWF bullets)
      {
        skill: "Process modeling",
        catalogSkill: "Process modeling (flow diagrams, use cases)",
        stem:
          "Your degree plan files Requirements Analysis into sections, and your junior-BA listing sits in one of them. Which work is that?",
        options: [
          "develop process flow diagrams, use case diagrams and other visual models for the analysis hand-off",
          "design the office's furniture and floorplan so analysts share one room",
          "calculate the company's sales figures and file them for the quarter",
          "train users in the menu structure of every company system, one system per week",
        ],
        answer: 0,
        ref: "PSF-SDS · Process modeling CWF bullets (lib/fixtures/rowspec/it.ts:184)",
        distractorNotes: [
          "The fit: the row's quoted CWF bullet — “Develop process flow diagrams, use case diagrams and other visual models” — which the analysts and builders read alike.",
          "Floorplans are facilities work; the row's models are process diagrams and use cases, not rooms.",
          "Sales figures belong to the finance function — the row's object is the process flow, not the money reports.",
          "Menu-structure training is enablement of users on finished systems; the row's job precedes the build, drawing the process for the analysis hand-off.",
        ],
      },
      // Q2 application — analyzing the business process to draw it (PSOC 2511 b)
      {
        skill: "Process modeling",
        catalogSkill: "Process modeling (flow diagrams, use cases)",
        stem:
          "The loan-approval team walks you through their steps, but three people describe the second checkpoint differently.",
        options: [
          "draw the flow from the manager's description alone and label the rest of it “obvious”",
          "identify and analyze the business process, procedures and work practices, and draw the flow and use cases from that analysis",
          "have the three people negotiate the truth between themselves now, outside any meeting you organize",
          "skip the model and write a blog post about what loan processing feels like",
        ],
        answer: 1,
        ref: "PSOC 2511 · b (research/snapshots/psoc/psoc2012-parsed.csv:280)",
        distractorNotes: [
          "One person's account is one person's process — the unit's analysis act exists because the three descriptions disagree, and the model resolves through analysis, not seniority.",
          "The fit: PSOC 2511 b) — “identifying and analyzing business processes, procedures and work practices” — plus the CWF models drawn as the analysis's output.",
          "Staff self-negotiation biases the record; the analyst draws the flow from analysis of what the process really does, and reconciles people after the paper exists.",
          "No model, no hand-off — the row's deliverable is precisely the diagram that settles the three accounts.",
        ],
      },
      // Q3 judgment — expand or modify for the flow (PSOC 2511 f)
      {
        skill: "Process modeling",
        catalogSkill: "Process modeling (flow diagrams, use cases)",
        stem:
          "Your new flow model shows every exception route in the loan process loops back through one supervisor who is on leave three months a year.",
        options: [
          "declare the loops a people-problem for the leaves and keep the model clean of any recommendation work",
          "present the model as-is and let the team work the three leave months out for themselves every year",
          "recommend expanding or modifying the system so the flow improves, and route the recommendation with its diagram to the decision owner",
          "quietly re-wire the target of the loops to your own queue, since you will be less often on leave than the supervisor is",
        ],
        answer: 2,
        ref: "PSOC 2511 · f (research/snapshots/psoc/psoc2012-parsed.csv:280)",
        distractorNotes: [
          "Recommendation is half the unit's act — “expanding or modifying systems to improve work flow” is exactly what a model showing a single-point-of-leave bottleneck is for.",
          "Presenting without a path takes the analysis's value out of the hand-off — the model exists so improvements are proposed, not just described.",
          "The fit: PSOC 2511 f) — the analysis-read model supports the “expanding or modifying systems to improve work flow” recommendation, routed to the owner.",
          "Re-pointing a flow to favor your own desk is inventing design without authority — the recommendation goes through the decision owner, not through a quiet rebuild.",
        ],
      },
    ],
  },

  {
    skill: "Team Enablement",
    catalogSkill: "Team Enablement",
    items: [
      // Q1 recognition — enablement's printed acts (PSF key tasks)
      {
        skill: "Team Enablement",
        catalogSkill: "Team Enablement",
        stem:
          "A poster in the sprint corner asks what you contribute to ceremonies and connections. The agile development role's contribution is:",
        options: [
          "keeping the ceremonies running calm and encouraging working relationships across departments",
          "performing comedy sketches at the sprint review so attendance stops slumping",
          "drafting write-ups that grade every department's cooperation with one another",
          "managing attendance and fining the late with chocolate rations",
        ],
        answer: 0,
        ref: "PSF-SDS · Team Enablement key tasks (lib/fixtures/rowspec/it.ts:197)",
        distractorNotes: [
          "The fit: the printed bullets — “Collaborate with subject matter experts…” · “Participate in agile ceremonies…” · “Cultivate strong working relationships across departments.”",
          "Sketches are a morale-additive at most, but the row's acts are collaborative validation and relationship-cultivation, not entertainment.",
          "Grading other departments invites the opposite of the relationships the row prints — the enablement act cultivates them, not rates them.",
          "Attendance policing is people-procurement behavior; enablement works through participation and relationships, not sanctions.",
        ],
      },
      // Q2 application — validate with SMEs (key task 1)
      {
        skill: "Team Enablement",
        catalogSkill: "Team Enablement",
        stem:
          "Your loan flow model finished yesterday. The finance side's request list grew overnight and someone doubts the interest-cap rule on the model holds.",
        options: [
          "collaborate with the finance SMEs to validate the requirements and the model, then revise where it proved inexact",
          "run with yesterday's model — the test is the developers' build, not your model's",
          "ask the doubters to e-mail their own redrawn model and adopt whichever arrived first",
          "declare the model “final” in the team channel so overriding it carries social cost",
        ],
        answer: 0,
        ref: "PSF-SDS · “Collaborate with subject matter experts to validate requirements and models” (lib/fixtures/rowspec/it.ts:197)",
        distractorNotes: [
          "The fit: the row's validate-with-SMEs task — the doubtful cap rule is exactly a validation item, and revision follows where validation fails.",
          "Loading validation onto the build converts design errors into development rework — the row's validation exists ahead of code.",
          "Letting doubters redraw in private gives the model away — validation is collaborative and disclosed, not a contest of fast drafts.",
          "A “final” label pressures belief over verification — the model earns credibility through SME validation, not through social price.",
        ],
      },
      // Q3 judgment — cross-department relationships when the calendar refuses
      {
        skill: "Team Enablement",
        catalogSkill: "Team Enablement",
        stem:
          "The sales department's lead declines your third offer to sync their process review, saying their backlog has eaten the whole quarter and theirs “maybe next year.”",
        options: [
          "report the lead to your director for blocking a corporate training objective the whole company already signed",
          "run their process review from their e-mail history without telling them, and present the result as “the sales process per the server logs”",
          "accept their refusal and drop the sales piece from your analysis permanently",
          "propose a smaller, specific ask — a one-hour recorded walk-through — and fit the review's rhythm to their quarter, cultivating the relationship rather than riding out the refusal",
        ],
        answer: 3,
        ref: "PSF-SDS · “Cultivate strong working relationships across departments” (lib/fixtures/rowspec/it.ts:197)",
        distractorNotes: [
          "Escalating a full-department load as a personal turn pries the relationship apart — the row's act is to cultivate, and a real quarter-crunch deserves a real accommodation.",
          "Reconstructing their process from logs, then presenting, is an end-run around the consultation the row exists for and damages trust beyond this sprint.",
          "Dropping the piece protects the calendar but starves the analysis — a smaller ask keeps the work moving while the quarter stays theirs.",
          "The fit: cultivate the working relationship — the offer shrinks to what their backlog absorbs, keeping the connection and the analysis alive on both sides.",
        ],
      },
    ],
  },

  {
    skill: "BA Enabling row",
    catalogSkill:
      "Collaboration · Communication · Digital Fluency · Learning Agility (Enabling)",
    items: [
      // Q1 recognition — the printed ESC levels of the BA map
      {
        skill: "BA Enabling row",
        catalogSkill:
          "Collaboration · Communication · Digital Fluency · Learning Agility (Enabling)",
        stem:
          "Publicly on the BA map, the level that the Digital Fluency and Problem Solving entries list at differs from the bundle's other entries. How does your sheet list them?",
        options: [
          "both at Basic per the four-item bundle's default matrix setting",
          "Digital Fluency and Problem Solving print Advanced; the other bundle entries print Intermediate",
          "all bundle entries print Basic/Advanced without any distinctions",
          "Problem Solving prints Intermediate, Digital Fluency does not print as a level",
        ],
        answer: 1,
        ref: "PSF-SDS · BA map ESC as printed (lib/fixtures/rowspec/it.ts:204)",
        distractorNotes: [
          "The bundle's entries live honestly off the map — no default-matrix setting flattens the Advanced pair to Basic.",
          "The fit: the map prints “Digital Fluency Advanced · Problem Solving Advanced,” the rest Intermediate, and the row keeps the levels honest.",
          "The map prints distinct levels — all-equal printing is precisely what the row's record-of-levels refuses to do.",
          "Both print, and both print Advanced — the partial-print reading invents a gap the row never has.",
        ],
      },
      // Q2 application — speaking the SDEs' language (overview sentence)
      {
        skill: "BA Enabling row",
        catalogSkill:
          "Collaboration · Communication · Digital Fluency · Learning Agility (Enabling)",
        stem:
          "The architects discuss cache design and sharding strategies while you take the workshop notes, and the jargon has been washing over the table all week.",
        options: [
          "answer with your own jargon no less technical, answering fire with fire",
          "stay quiet in every technical hour and transcribe audio blindly for later",
          "ask the architects to teach you one term per meeting until the shorthand stops disempowering you",
          "e-mail the tech-lead list a translation guide of every term they used wrong",
        ],
        answer: 2,
        ref: "PSF-SDS · BA overview closing sentence (lib/fixtures/rowspec/it.ts:205)",
        distractorNotes: [
          "Trading jargon for jargon gets the vocabulary without the idea — the row's learning agility runs through asking and learning, not through performed vocabulary.",
          "Blind transcription abandons the communication half — the row's pattern is the overlap of learning and speaking, not audio capture of a language you refuse to enter.",
          "The fit: the overview's sentence — “demonstrates an eagerness to learn from subject matter experts across different fields” — persistence is precisely the eagerness that sentence prints.",
          "A corrections e-mail ranks you as the authority on their language — embarrassing rather than learning, and the row's prized agility walks the other way.",
        ],
      },
      // Q3 judgment — a peer's shortcut vs. the bundle's eager-to-learn pattern
      {
        skill: "BA Enabling row",
        catalogSkill:
          "Collaboration · Communication · Digital Fluency · Learning Agility (Enabling)",
        stem:
          "The development team moves the pricing-rule work to a stack none of your map's roles ever trained you in, and the next requirements workshop is yours to run.",
        options: [
          "co-sign whatever the architects prepare for the workshop, since the stack's owners will always know the current practice better than a BA",
          "hand the workshop to whoever already knows the stack — the bundle's learning work stops where the compiler starts",
          "sit in with the architects and learn the stack from them, then run the workshop in shared language, as the bundle's eager-to-learn sentence prints",
          "suspend the workshop until a six-week training budget clears your lead's list of priorities",
        ],
        answer: 2,
        ref: "PSF-SDS · BA overview closing sentence (lib/fixtures/rowspec/it.ts:205)",
        distractorNotes: [
          "Co-signing the architects' ground skips the learning the row prints — the overview's sentence has the BA demonstrating eagerness to learn from subject matter experts, not outsourcing the workshop to them.",
          "Handing the workshop away abandons the bundle's act — the printed sentence's BA contributes “to the success of projects and initiatives” by learning across fields, not by stepping aside.",
          "The fit: “demonstrates an eagerness to learn from subject matter experts across different fields, contributing to the success of projects and initiatives” — the stack is exactly such a field.",
          "A suspended workshop until a big budget clears is the eager-learner pattern's opposite: the row's agility closes the gap with the experts at hand, not with a funding ticket.",
        ],
      },
    ],
  },

  // ══════════════════ wave 2 · its · IT Support Engineer (roster 2.4) ═══════
  // Anchors: PSOC 3512 lettered lines (research/snapshots/psoc/psoc2012-parsed.csv:389),
  // PSF-SDS verbatim quotes in lib/fixtures/rowspec/it.ts (lines 210–257).
  {
    skill: "Infrastructure Support",
    catalogSkill: "Infrastructure Support",
    items: [
      // Q1 recognition — the support FSC's spans (PSF FSC L1-2 descriptor)
      {
        skill: "Infrastructure Support",
        catalogSkill: "Infrastructure Support",
        stem:
          "The card above your ticket queue lists: “Provide services to end users by systematically identifying, classifying and troubleshooting technical issues and incidents that disrupt and impact their day-to-day business activities, within a specified timeframe.” What fills a Tuesday at this desk?",
        options: [
          "identify, classify, and troubleshoot the disruptions users report, inside the timeframe the queue specifies",
          "review next quarter's server purchase list and negotiate prices with the vendors",
          "write the company's annual report on upcoming technology trends",
          "redesign the office floorplan so every desk sits near a LAN point",
        ],
        answer: 0,
        ref: "PSF-SDS · its FSC L1–2 descriptor (lib/fixtures/rowspec/it.ts:212)",
        distractorNotes: [
          "The fit: the descriptor's triple act — systematically identifying, classifying and troubleshooting — is the desk's day, against the named timeframe.",
          "Procurement negotiation is an asset/infrastructure-management conversation, not the end-user services the descriptor titles this row with.",
          "Annual trend reports are planning deliverables; this row's service is the same-day disruption, addressed inside its timeframe.",
          "Floorplan work is facilities; the descriptor's disruptions are technical incidents, not desks.",
        ],
      },
      // Q2 application — resolve through the inquiry (PSOC 3512 a + c)
      {
        skill: "Infrastructure Support",
        catalogSkill: "Infrastructure Support",
        stem:
          "Accounting's front-desk machine died mid-voucher this morning and a vendor visit is tomorrow.",
        options: [
          "answer the inquiry, diagnose the machine against its operation, and perform the minor repairs following the installation specifications",
          "leave the ticket untouched until tomorrow's vendor arrives, since their word will surely settle it and today's voucher can wait",
          "loan the accounting staff your own personal laptop for the week as the fix",
          "tell accounting to take paper vouchers for the month and wait for the quarterly refresh",
        ],
        answer: 0,
        ref: "PSOC 3512 · a, c (research/snapshots/psoc/psoc2012-parsed.csv:389)",
        distractorNotes: [
          "The fit: 3512 a) — “answering user inquiries regarding software or hardware operation to resolve problems” — with c)'s minor repairs following design or installation specifications.",
          "Waiting for the vendor abandons the first-line act the unit prints — the inquiries resolve at this desk, and the vendor is the overflow, not the queue.",
          "Your personal laptop dissolves the boundary between your tool and company equipment — the resolution act is the unit's, performed through the desk's resources.",
          "A month of paper substitutes the user's work for the technician's — the unit's task is the repair itself, done in the queue's timeframe.",
        ],
      },
      // Q3 judgment — escalate what stays unresolved (PSF escalation bullets)
      {
        skill: "Infrastructure Support",
        catalogSkill: "Infrastructure Support",
        stem:
          "Two hours in, your findings on the failing shared drive amount to nothing useful. Accounting needs it running by the payroll cut-off at noon.",
        options: [
          "escalate the unresolved incident with your findings documented, so the next tier starts where your notes leave off",
          "mark the ticket resolved — the deadline is what the escalation process was invented to prevent",
          "tell accounting to sync their drive locally by hand each hour until a fix appears",
          "restart the drive every ten minutes through noon and hope a lucky cycle sticks",
        ],
        answer: 0,
        ref: "PSF-SDS · “Escalate unresolved infrastructure-related incidents for resolution” (lib/fixtures/rowspec/it.ts:215)",
        distractorNotes: [
          "The fit: the printed task — unresolved incidents escalate with the documentation (“Documents incidents and track resolution in management systems”) carried along.",
          "A false resolution is the escalation discipline's exact inversion — the ticket pools the incident for the next tier, and falsifying it hides the noon deadline from whoever can act.",
          "A hand-sync workaround shifts two hours onto the user per hour and leaves the incident unresolved — the printed act is escalation with findings, not user labor.",
          "Restart roulette burns the remaining window and adds reboot count to the incident record as if it were a fix — the escalation with findings routes the real state upward.",
        ],
      },
    ],
  },

  {
    skill: "Infrastructure Deployment",
    catalogSkill: "Infrastructure Deployment",
    items: [
      // Q1 recognition — deploy per the set plan (PSF FSC L1-2 descriptor)
      {
        skill: "Infrastructure Deployment",
        catalogSkill: "Infrastructure Deployment",
        stem:
          "The wall card for your deployment week lists “Set up, deploy and decommission infrastructure components and associated equipment in accordance to a set plan and established safety and/or quality procedures.” What does that make the plan?",
        options: [
          "a suggestion of taste — new equipment reveals its own best arrangement once it arrives",
          "the spine of the deployment: setup, deploy, and decommission all follow it with the safety and quality procedures attached",
          "a document for auditors only, unread by the hands that install the components and wire the racks",
          "a template to fill in after the equipment has been placed, so the record matches reality",
        ],
        answer: 1,
        ref: "PSF-SDS · its Infrastructure Deployment FSC L1–2 descriptor (lib/fixtures/rowspec/it.ts:221)",
        distractorNotes: [
          "The descriptor binds the three acts to the set plan — “its own best arrangement” is the improvised deployment the card refuses.",
          "The fit: the plan governs all three acts (set up, deploy, decommission) with the safety/quality procedures in tow.",
          "The card addresses the installing hands directly — auditors read the record that following the plan generates.",
          "A plan written after placement is a receipt, not a plan — the descriptor orders the set plan before the acts it governs.",
        ],
      },
      // Q2 application — assist with the schedule and coordinate (PSF CWF + PSOC 3512 c)
      {
        skill: "Infrastructure Deployment",
        catalogSkill: "Infrastructure Deployment",
        stem:
          "Saturday morning, four new switches arrive for the finance-floor upgrade, and the plan has the window booked till 6 p.m.",
        options: [
          "assist with the infrastructure testing and the scheduled upgrade as the plan sequences them, and coordinate the switch deployment with the affected teams",
          "invent a faster layout than the plan's and install it Saturday to save next Saturday",
          "let each department set up its own switch, one department per switch, so nobody at all depends on the booked window",
          "leave the switches boxed and padlock the rack, saying nobody planned a Saturday well enough to unbox anything",
        ],
        answer: 0,
        ref: "PSF-SDS · CWF “Maintain infrastructure performance” (lib/fixtures/rowspec/it.ts:223) + PSOC 3512 · c",
        distractorNotes: [
          "The fit: the CWF's “Assist with… scheduled upgrades and updates” and “Coordinate the deployment of new and/or upgraded infrastructure,” executed inside the booked window.",
          "An invented layout sins exactly where the descriptor binds — the set plan governs, and a cleverer Saturday is the next plan's business, not this execution's.",
          "One switch per department fragments the upgrade and its quality procedures — coordinate-and-deploy runs centrally per the booked plan.",
          "A padlocked refusal serves nobody's Saturday — the window and the arrived equipment are both real; the deployment the plan sequences proceeds.",
        ],
      },
      // Q3 judgment — decommission discipline (descriptor's third act + safety procedures)
      {
        skill: "Infrastructure Deployment",
        catalogSkill: "Infrastructure Deployment",
        stem:
          "The office retires an old file server today. A staff member asks to keep its drives “as a souvenir” before the decommission checklist runs.",
        options: [
          "accept the request — a retired asset belongs to whoever said the word first",
          "run the decommission per the set plan and the established safety procedures, and send the drives to formal disposal",
          "wipe the drives quickly with a mass delete and hand them over, calling it done",
          "keep the drives in your own drawer “just till I find out whose yes this takes” without logging anything",
        ],
        answer: 1,
        ref: "PSF-SDS · its Infrastructure Deployment FSC L1–2 descriptor (lib/fixtures/rowspec/it.ts:221)",
        distractorNotes: [
          "First-word ownership is not a disposal authority — the descriptor binds decommission to the set plan and its procedures, not to whoever is nearest.",
          "The fit: the descriptor's third act — decommission — runs through the plan and the safety/quality procedures the card attaches, which end in formal disposal, not souvenirs.",
          "A mass delete is not the drive media wipe the safety procedures carry to disposal — the physical media still leave with the data's history.",
          "A drawer and an unlogged “maybe” is neither decommission nor disposal — the retired equipment never reaches the plan's end state, and the holding hand owns an unrecorded asset.",
        ],
      },
    ],
  },

  {
    skill: "Network Administration and Maintenance",
    catalogSkill: "Network Administration and Maintenance",
    items: [
      // Q1 recognition — the network FSC's four acts (PSF FSC L1-2 descriptor)
      {
        skill: "Network Administration and Maintenance",
        catalogSkill: "Network Administration and Maintenance",
        stem:
          "The network card's duty list lists: “detection, isolation, recovery, and limitation of the impact of failures on the network.” A link fails and accounting drops mid-invoice. In what order do those four acts run?",
        options: [
          "registry first, then backup tapes, then a formal apology, then a new wiring contract",
          "detect the failure, isolate it from the rest of the network, recover what the failure brought down, and limit the impact for the remaining users",
          "recover first at whatever cost, then decide what the obstruction might have been, then determine whose fault it legally is",
          "detect the failure, then immediately rewire the whole floor for future-proofing, then file the paperwork last",
        ],
        answer: 1,
        ref: "PSF-SDS · its Network Administration and Maintenance FSC L1–2 descriptor (lib/fixtures/rowspec/it.ts:229)",
        distractorNotes: [
          "None of the four printed acts is registry, backup, apology or contract — the descriptor's sequence starts at detection of the failure itself.",
          "The fit: the descriptor prints the four acts in exactly the order the answer walks them, with the impact limitation as the closer.",
          "Recovery-before-detection spends the network's recovery budget before the failure is even isolated — and fault attribution is not among the four acts.",
          "Whole-floor rewiring is a project, not an incident act — the impact-limitation duty saves the remaining users now, not a construction contract.",
        ],
      },
      // Q2 application — day-to-day upkeep (PSOC 3512 d + the printed overview)
      {
        skill: "Network Administration and Maintenance",
        catalogSkill: "Network Administration and Maintenance",
        stem:
          "The marketing floor reports the same wifi drop every day at 3 p.m. for two weeks.",
        options: [
          "tell marketing that wifi is managed by a third party nobody can reach",
          "oversee the daily performance of the communications systems — walk the APs, chart the 3 p.m. pattern, and find and fix the recurring interference",
          "swap the whole office over to mobile hotspots as the standing arrangement and retire the APs' maintenance for good",
          "advise marketing to schedule their newsletters around 3 p.m. so the drop at least feels tranquil",
        ],
        answer: 1,
        ref: "PSOC 3512 · d (research/snapshots/psoc/psoc2012-parsed.csv:389) + PSF-SDS · its role overview (lib/fixtures/rowspec/it.ts:230)",
        distractorNotes: [
          "The unit's “overseeing the daily performance of communications and computer systems” plants the duty at this desk, whoever else the contract names.",
          "The fit: 3512 d)'s daily-performance oversight plus the descriptor's failure acts — a recurring daily pattern is exactly a detectable, isolable, fixable maintenance item.",
          "Hotspots convert a maintenance finding into a standing workaround — the drop's cause is the item the care the row names exists to fix.",
          "Scheduling around the failure shelters the symptom; maintenance acts on the cause instead.",
        ],
      },
      // Q3 judgment — user support through maintenance info (descriptor's closing clause)
      {
        skill: "Network Administration and Maintenance",
        catalogSkill: "Network Administration and Maintenance",
        stem:
          "You fixed the 3 p.m. drop. The marketing team suspects the network is “watching us” and morale dips.",
        options: [
          "share ongoing maintenance information with the users — the fix, its cause, and the check you'll run next week — as the descriptor's support clause directs",
          "say nothing at all; user talk recovers on its own, and the silence preserves the neutral standing of the maintenance desk",
          "issue a memo declaring the network fully trustworthy and warning against further speculation",
          "promise them unlimited bandwidth as compensation for the ordeal",
        ],
        answer: 0,
        ref: "PSF-SDS · its Network FSC descriptor's support clause (lib/fixtures/rowspec/it.ts:229)",
        distractorNotes: [
          "The fit: the descriptor's closing clause — support users “through ongoing maintenance information sharing and training” — turns the fixed failure into shared, trustable information.",
          "Silence lets the watching-network story set in place of the truth the sharing clause exists to serve.",
          "A trust declaration without shared information asserts what should be shown — the clause's instrument is information, not assurance decrees.",
          "Unlimited bandwidth promises a network capacity that the row's duties never owned — the fix and its communication are the support, not a gift.",
        ],
      },
    ],
  },

  {
    skill: "Network Configuration",
    catalogSkill: "Network Configuration",
    items: [
      // Q1 recognition — configuration per guidelines (PSF FSC L2 descriptor)
      {
        skill: "Network Configuration",
        catalogSkill: "Network Configuration",
        stem:
          "The configuration desk's card lists “Configure network hardware and software components according to organizational guidelines and technical requirements… implementation and configuration of multiple servers, network devices, and network management tools.” What governs a device's settings here?",
        options: [
          "the organize's guidelines and the stated technical requirements, with the device's settings set to match them",
          "whatever the vendor's box screen shows as defaulted, since defaults are the vendor's tested wisdom",
          "the installer's personal habits, since networks reward the person who has done it most often",
          "the loudest user's preferences, since the network's purpose is staff comfort",
        ],
        answer: 0,
        ref: "PSF-SDS · its Network Configuration FSC L2 descriptor (lib/fixtures/rowspec/it.ts:235)",
        distractorNotes: [
          "The fit: the descriptor's governing clause — configuration happens “according to organizational guidelines and technical requirements,” with devices and tools set to match.",
          "Vendor defaults are a starting point, not the organization's settings — the guideline-match the card prints is the configuration's standard, not the box's.",
          "Habit is the exact thing the guideline clause removes from the desk — configuration is reproducible because a standard runs it.",
          "User comfort enters through the requirements, not through volume — the settings obey the printed technical requirements, not the loudest desk.",
        ],
      },
      // Q2 application — configure per the runbook (PSF CWF configure bullet + catalog what)
      {
        skill: "Network Configuration",
        catalogSkill: "Network Configuration",
        stem:
          "Two floors' new switch needs ports set per the team's configuration runbook before Friday's office move.",
        options: [
          "follow the runbook's device and port configuration for both floors, and confirm the floors' access works before calling the move done",
          "set the ports from memory as last year's switch was done, updating nothing written",
          "ask each employee on the floors to configure whichever port they prefer on the move morning",
          "unbox the switch, plug everything in, and let the network decide its own partitions as users come online",
        ],
        answer: 0,
        ref: "PSF-SDS · its CWF “Oversee infrastructure operations” configure bullet (lib/fixtures/rowspec/it.ts:236) + the catalog row's own scope (“Configure devices/ports per runbooks”, lib/fixtures/catalog.ts)",
        distractorNotes: [
          "The fit: the CWF's configure bullet plus the row's own scope — devices and ports configured per the runbook, verified live before the move.",
          "Memory-done configuration refuses the runbook the row loads — unverifiable settings from last year serve last year's floors, not these.",
          "Self-service ports on move morning multiply the configurations beyond any guideline — settings belong to the runbook's standard, not to five hundred hands.",
          "Self-partitioning networks fail exactly where the runbook stands: floors' separation depends on the ports the action states, not on emergent behavior.",
        ],
      },
      // Q3 judgment — access management per stable operations (descriptor's closing clause)
      {
        skill: "Network Configuration",
        catalogSkill: "Network Configuration",
        stem:
          "A branch wants guest wifi opened on the finance floor's switch for their visiting partners' comfort during a two-day workshop.",
        options: [
          "open the guest network permanently across all floors so nobody bothers you again with per-floor requests",
          "configure the guest access for the two days the workshop runs, scoped to the finance floor, per the guidelines and the requirement, and leave a note in the configuration record",
          "refuse the request as a blanket matter of firm policy and tell the partners to use their phones' data for both days, since the guest network is never opened on request",
          "loan them the finance staff's wifi credentials for the workshop and change the password afterwards",
        ],
        answer: 1,
        ref: "PSF-SDS · its Network Configuration FSC L2 descriptor “management of user network access to ensure stable and reliable network operations” (lib/fixtures/rowspec/it.ts:235)",
        distractorNotes: [
          "Permanent everything-floors access industrializes a two-day need — the descriptor's access management exists to keep operations stable and reliable, not to empty the inbox.",
          "The fit: the access-management clause — scoped in time (two days) and place (finance floor), configured per the organizational guidelines and recorded.",
          "A data-only refusal refuses the access-management work the row exists to do — scoped guest access is precisely a configuration decision the desk can make.",
          "Sharing staff credentials hands guest traffic the staff's access rights — the descriptor's access management keeps user access identified and controlled, not anonymized by share.",
        ],
      },
    ],
  },

  {
    skill: "Cyber and Data Breach Incident Management",
    catalogSkill: "Cyber and Data Breach Incident Management",
    items: [
      // Q1 recognition — detect, report, identify, trigger (PSF FSC L2 descriptor)
      {
        skill: "Cyber and Data Breach Incident Management",
        catalogSkill: "Cyber and Data Breach Incident Management",
        stem:
          "The FSC card in the ops room lists: “Detect and report cyber and data-related incidents, identify affected systems and user groups, trigger alerts and announcements…” The order that card names:",
        options: [
          "announce loudly first, then work out who's affected, then hope the originating report still gets logged",
          "detect the incident, report it, identify the affected systems and user groups, and trigger the alerts and announcements",
          "identify the culprit first, then detect the incident's extent, then announce who is to blame",
          "trigger the alerts right after your coffee, then detect whatever it was, then paper over what got hit",
        ],
        answer: 1,
        ref: "PSF-SDS · Cyber and Data Breach Incident Management FSC L2 descriptor (lib/fixtures/rowspec/it.ts:241)",
        distractorNotes: [
          "Announcement-first skips the detect-and-report head of the sequence the card prints — the alerts ride a report, not a rumor.",
          "The fit: the card's printed acts in their printed order — detect, report, identify the affected, trigger alerts and announcements.",
          "Culprit-first is blame management, not incident management — the card's object is the incident and its affected systems, not a name.",
          "Post-coffee triggering inverts every clausal dependency — detection precedes the announcements the card conditions on it.",
        ],
      },
      // Q2 application — a user report with breach signs (descriptor + survey tail)
      {
        skill: "Cyber and Data Breach Incident Management",
        catalogSkill: "Cyber and Data Breach Incident Management",
        stem:
          "A user reports login attempts on their account at 3 a.m. from overseas cities while they slept, and two other users say the same.",
        options: [
          "wait to watch for an actual theft before counting it an incident — attempted entry alone is “nothing happened”",
          "tell the users to change their passwords privately and call it handled, logging nothing",
          "treat it as a cyber incident — report it, identify the affected accounts and systems, trigger the alerts and announcements to the relevant stakeholders",
          "post the three accounts' names on the office message board so everyone is warned immediately of the stolen evenings",
        ],
        answer: 2,
        ref: "PSF-SDS · Cyber and Data Breach Incident Management FSC L2 descriptor (lib/fixtures/rowspec/it.ts:241)",
        distractorNotes: [
          "Waiting for loss confuses theft with attempt — the card's detect act keys on the incident, and a patterned intrusion attempt is one.",
          "Private password changes bury the pattern — three accounts hit at 3 a.m. is an incident, and the card's report and identify acts exist for exactly that.",
          "The fit: the card's full act — detect (the pattern is incident-shaped), report, identify affected systems and user groups, trigger alerts and announcements.",
          "A public name-board shames the affected users and leaks the incident to every passer-by — announcements follow the stakeholders the report names, not the whole building.",
        ],
      },
      // Q3 judgment — escalation for cyber incidents beyond IT's queue (its anchors)
      {
        skill: "Cyber and Data Breach Incident Management",
        catalogSkill: "Cyber and Data Breach Incident Management",
        stem:
          "The 3 a.m. attempts turn out to be occurring from inside the office network. Your infrastructure skills can freeze one suspect laptop, and the security function sits in another building.",
        options: [
          "contain what your infrastructure scope covers, then escalate to the security function with the freeze-engine findings and the affected accounts documented",
          "interview every staff member about their laptops' overnight habits, and resolve the whole intrusion from your desk by end of day",
          "shut the office network down for two days and reopen once the answer arrives whatever way",
          "delete the suspect laptop's logs to buy time and bury the trail until your ticket queue empties",
        ],
        answer: 0,
        ref: "PSF-SDS · its CWF escalation bullets + “Documents incidents and track resolution” (lib/fixtures/rowspec/it.ts:215, 242)",
        distractorNotes: [
          "The fit: “Escalate unresolved infrastructure-related incidents for resolution” with documentation carried — the freeze is in the IT scope; the intrusion's answer belongs to the security function, handed over with findings.",
          "Interviews scatter the trail and promise a same-day answer the incident's subject doesn't guarantee — the escalation the queue exists for hands the specialized function its work.",
          "A two-day office outage punishes every user for one attack surface — escalation moves the incident to the capable function without closing the company.",
          "Deleting logs destroys the evidence the escalation carries — the incident record exists precisely so the security function receives, not loses, the trail.",
        ],
      },
    ],
  },

  {
    skill: "Service Level Management",
    catalogSkill: "Service Level Management",
    items: [
      // Q1 recognition — SLA tier, associate executes within set targets (PSF FSC L3 descriptor)
      {
        skill: "Service Level Management",
        catalogSkill: "Service Level Management",
        stem:
          "Your service-provision descriptor on your sheet: “Plan, monitor and manage service provisions for the achievement of agreed service level targets.” As the associate in this seat:",
        options: [
          "set any new target you feel will make the team look good next quarter, and announce it at stand-up",
          "you execute within the targets already agreed — your piece is monitoring and supporting the achievement of those known targets",
          "reject the targets as a management art nobody sells honestly, and route complaints instead",
          "let the targets stand until you have recruit-approved new staff to guard them",
        ],
        answer: 1,
        ref: "PSF-SDS · its Service Level Management FSC L3 descriptor (lib/fixtures/rowspec/it.ts:247)",
        distractorNotes: [
          "Changing targets belongs to the service owner; the L3 wording is kept secondary because the associate's piece executes within targets “already agreed,” not renegotiates them.",
          "The fit: the descriptor's monitor-and-manage of provisions for the achievement of agreed targets — the associate's lane inside them.",
          "The targets are the desk's operating spine — the row's duties are the means by which agreed targets are met, not a debate about whether they exist.",
          "Guarding through headcount is a resourcing choice elsewhere — the associate's fulfillment runs through the log/monitor/identify tasks the desk carries.",
        ],
      },
      // Q2 application — log the metrics, spot the recurring (PSF CWF bullets)
      {
        skill: "Service Level Management",
        catalogSkill: "Service Level Management",
        stem:
          "The printer queue's ticket count runs high this month compared to every month before, and the exact same model's and floor's names appear in the repeats.",
        options: [
          "maintain the log of service level performance metrics and flag the recurring incident story for senior management's review, as the duties name",
          "stop logging — the number sits high, and the chart's mood is bad enough without evidence",
          "confront the users of the repeating floor with a “use it less or lose it” speech at their next town hall, since the log's evidence is management's problem",
          "delete the repeat tickets so the month's average readings recover",
        ],
        answer: 0,
        ref: "PSF-SDS · its SLA CWF bullets “Maintain logs of service level performance metrics” · “Identify recurring incidents” (lib/fixtures/rowspec/it.ts:249)",
        distractorNotes: [
          "The fit: two printed duties in the order the story calls for — the log maintained, and the recurring incidents on it identified for senior management's review.",
          "Refusing the log because the number is ugly corrupts the very measure the SLA's targets ride.",
          "A blames-the-users speech has no ticket in the duty list — the identification act runs to senior management with the log's evidence, not to a scolding.",
          "Deletion rewrites the metrics the targets bind to — the recurring story is exactly what the log exists to record and surface.",
        ],
      },
      // Q3 judgment — suggestions vs change-making (PSF CWF "Suggest improvements")
      {
        skill: "Service Level Management",
        catalogSkill: "Service Level Management",
        stem:
          "Your logs show the after-hours password resets alone breach the four-hour response target. The support lead asks what your role will do about it.",
        options: [
          "suggest an after-hours service-improvement procedure with the log's evidence, and route the recommendation through the SLA/D-and-improvements channel",
          "start closing all after-hours tickets yourself within the four hours without telling anyone, until the numbers reconcile",
          "propose adjusting the four-hour target to fit the actual after-hours performance, effective immediately by your own memo",
          "declare after-hours work out of the scope of the targets and void that data band, effective your next weekly report",
        ],
        answer: 0,
        ref: "PSF-SDS · its SLA CWF bullet “Suggest improvements for procedures and controls to enhance performance and client satisfaction” (lib/fixtures/rowspec/it.ts:249)",
        distractorNotes: [
          "The fit: the printed act is suggest-and-enhance with evidence behind it — improvements go through the improvements channel, not through unilateral change of anything.",
          "Secret remediation distorts the metrics instead of mending the procedure — the duty is suggest improvements, evidenced, not fabricate compliance.",
          "Changing the target is the service owner's instrument, not the associate-on-the-row's — the improvement suggestion stays a suggestion until routed.",
          "Voiding a band of the target rewrites the agreement, the one direction the SLA row forbids its associate from doing.",
        ],
      },
    ],
  },

  {
    skill: "ITS Enabling row",
    catalogSkill:
      "Customer Orientation · Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)",
    items: [
      // Q1 recognition — ESC all Basic as printed
      {
        skill: "ITS Enabling row",
        catalogSkill:
          "Customer Orientation · Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)",
        stem:
          "Your ITS onboarding slide lists the enabling bundle exactly as written. What the list says about the bundle's five skills:",
        options: [
          "all five print at Basic: Collaboration, Communication, Digital Fluency, Problem Solving, Self Management",
          "the five split evenly between Basic and Intermediate because support staff work in pairs",
          "all five print at Advanced to prepare for the on-call career ladder",
          "only Communication and Customer Orientation actually print; the rest are unlisted",
        ],
        answer: 0,
        ref: "PSF-SDS · its ESC all Basic as printed (lib/fixtures/rowspec/it.ts:254)",
        distractorNotes: [
          "The fit: the map prints all five at Basic — the row says so plainly, and nothing splits the pairwise rumor.",
          "No pairing print exists — a Basic/Intermediate split is an invented reading of a fully Basic list.",
          "Advanced would belong to the senior rungs; this map's print is Basic across all five.",
          "All five print — dropping any of them misreads the bundle as a two-item row.",
        ],
      },
      // Q2 application — the user-facing call (role overview's service sentence)
      {
        skill: "ITS Enabling row",
        catalogSkill:
          "Customer Orientation · Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)",
        stem:
          "Your Saturday on-call shift rings: the caller is frantic, the wifi died mid-video-call with their own client listening in.",
        options: [
          "communicate the actual state and the recovery steps plainly, and work the problem with them as your overview's service sentence reads",
          "hang up and text them a link to the router manual, texting being more efficient than speech by the shift's rules",
          "answer that wifi outages on Saturdays are outside the map's hours, citing the shift table",
          "promise an instant fix — any outrageous one — and sort the details out only when the call ends",
        ],
        answer: 0,
        ref: "PSF-SDS · its role overview “They can communicate effectively and display high service level standards” (lib/fixtures/rowspec/it.ts:255)",
        distractorNotes: [
          "The fit: the overview's sentence — communicate effectively and display high service level standards — is the behavior the call demands, even on a scared client-witness.",
          "Texting a manual link is channel-shift abandonment — the caller is mid-call with their client and the supporting sentence centers effective communication, not deflection.",
          "The map's shifts include nights, weekends and holidays — Saturday is precisely in scope, not out of it.",
          "An outrageous promise unravels as soon as the call ends — the service standards the overview displays are the truthful recovery, however frantic the voice.",
        ],
      },
      // Q3 judgment — the standby discipline (context anchor: on-call availability)
      {
        skill: "ITS Enabling row",
        catalogSkill:
          "Customer Orientation · Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)",
        stem:
          "It is Christmas morning and the only other on-call staff is unreachable. One P1 ticket waits and the office is full of holiday events.",
        options: [
          "close the ticket as unreachable-staff and switch your phone off for the rest of the day's observance",
          "handle the P1 to the best of the shift's resources, log honestly, and hand what remains unresolvable over as the on-call discipline expects",
          "forward the ticket to an off-duty colleague's personal inbox on the chance they will open it unprompted on a holiday",
          "treat it as a system problem and leave the on-call duty to the calendar's next scheduled person",
        ],
        answer: 1,
        ref: "PSF-SDS · its context anchor “required to be on standby with on-call availability with varied shifts including nights, weekends, and holidays” (lib/fixtures/rowspec/it.ts:255)",
        distractorNotes: [
          "The on-call commitment covers holidays precisely — switching off is the discipline's inversion on the exact day the standby exists.",
          "The fit: the shift must be worked as the staffing allows — one P1 handled to the shift's edges, honestly logged, and handed over unresolvable intervals to the reachable staff.",
          "An unprompted forward to a personal inbox is a hope, not a hand-over — the discipline's hand-over reaches someone who accepts.",
          "The P1's owner is on call, whoever the colleague table held — the duty sits where the shift table does, and the duty's ticket does not leave unowned.",
        ],
      },
    ],
  },

  // ════════════ wave 2 · sysadmin · Network / Systems Administrator (2.5) ═══
  // Anchors: PSOC 2522 lettered lines (research/snapshots/psoc/psoc2012-parsed.csv:286),
  // PSF-SDS verbatim quotes in lib/fixtures/rowspec/it.ts (lines 260–336).
  {
    skill: "Systems administration",
    catalogSkill: "Systems administration (user groups, upgrades, backups)",
    items: [
      // Q1 recognition — the overview's composite duties
      {
        skill: "Systems administration",
        catalogSkill: "Systems administration (user groups, upgrades, backups)",
        stem:
          "The role overview in your onboarding book: “The Associate Systems Support Engineer performs routine systems administration-related activities… They maximize service uptime, maintain system backups, manage service licensing, and maintain security standards.” What does a routine day on this role hold?",
        options: [
          "a haircut list of every colleague scheduled to graduate out of the company, with the exits double-checked against HR's own headcount sheet",
          "perform the admin routine — user-groups administration, system upgrades, backups, and the standards that keep uptime and license state tidy",
          "the company's entertainment budget for the server-room refreshment drive",
          "a coffee-machine servicing schedule taped in the pantry",
        ],
        answer: 1,
        ref: "PSF-SDS · sysadmin role overview (lib/fixtures/rowspec/it.ts:262) + CWF key tasks (it.ts:264)",
        distractorNotes: [
          "None of the overview sentence's four named acts is anything resembling a complied staff roster — the copy belongs to another row.",
          "The fit: the overview's routine acts plus the CWF's printed keys — “Perform system upgrades · Manage administration of user groups · Maintain documentation…” — in the admin routine.",
          "The refreshment budget is nobody's systems-administration act — the overview names backups, licensing, uptime, security.",
          "The pantry belongs to facilities — the row's routine is system-side and its acts print inside the row's CWF and overview.",
        ],
      },
      // Q2 application — maintain and administer computing environments (PSOC 2522 a)
      {
        skill: "Systems administration",
        catalogSkill: "Systems administration (user groups, upgrades, backups)",
        stem:
          "Finance requests a new user group for the four interns starting Monday, with access to three shared folders and nothing else.",
        options: [
          "add the four to the everyone group as well so they learn the full environment early — lately the “learning the place” logic wins in tickets",
          "create the intern group per policy, add the new accounts, and grant the three folders exactly as requested — the user-group administration the map prints",
          "give the four your own admin password for their week on the condition that they promise not to change anything on it",
          "configure each intern's account as a fully separate mini-admin account to avoid ever touching the shared folder permission list",
        ],
        answer: 1,
        ref: "PSOC 2522 · a (research/snapshots/psoc/psoc2012-parsed.csv:286) + PSF-SDS CWF “Manage administration of user groups” (lib/fixtures/rowspec/it.ts:264)",
        distractorNotes: [
          "Admin-for-everyone grants exist per access policy, not per enthusiasm — the published admin key on user-groups is managed access, not unconditional reach.",
          "The fit: 2522 a)'s “maintaining and administering computer networks and related computing environments… and all configurations,” placed right over the CWF's user-groups task.",
          "Handing a personal admin password upwards inverts the administration — the account belongs to the desk's controlled access, never borrowed for convenience.",
          "Mini-admin accounts industrialize privilege without need — configuring the accounts means the group's scope the request named, and only those folders.",
        ],
      },
      // Q3 judgment — backups & disaster recovery per plan (PSOC 2522 d)
      {
        skill: "Systems administration",
        catalogSkill: "Systems administration (user groups, upgrades, backups)",
        stem:
          "The finance server's backup window has been skipped for three nights by a patched cron schedule nobody logged. Nothing has failed yet.",
        options: [
          "declare the backup schedule dead weight and delete the remaining job in the cleanup that follows",
          "wait for the quarterly audit notice and then bring the backs up — five unbacked nights is a rounding issue",
          "restore the backup schedule tonight, run a verification restore to prove it bites, and log the gap in the maintenance record",
          "copy the whole server to a shared folder on your own laptop nightly until a decision arrives",
        ],
        answer: 2,
        ref: "PSOC 2522 · d (research/snapshots/psoc/psoc2012-parsed.csv:286) + PSF-SDS · sysadmin backup-flag note (lib/fixtures/rowspec/it.ts:267)",
        distractorNotes: [
          "Deleting a failed job removes the disaster-recovery capability the unit prints — the skipped nights are the maintenance record's problem, not the schedule's guilt.",
          "Waiting accumulates recovery risk nightly — the unit's backup act is the schedule restored and made verifiable, not audited only when the count grows too big.",
          "The fit: 2522 d) — “performing data backups and disaster recovery operations” — restored, verified, and logged per the row's documentation discipline.",
          "Your laptop as backup media takes the company data into the desk's hands — the backups the unit prints run to the organization's recovery plan, not the laptop bag.",
        ],
      },
    ],
  },

  {
    skill: "Design and develop new systems",
    catalogSkill: "↳ CWF sub-row: Design and develop new systems",
    items: [
      // Q1 recognition — the assist-side sub-row
      {
        skill: "Design and develop new systems",
        catalogSkill: "↳ CWF sub-row: Design and develop new systems",
        stem:
          "The new systems' role section lists its key tasks with a distinct flavor word throughout: “Assist with…”. What does the word ask of the associate in this role section's work?",
        options: [
          "the assist side: development happens on the build team's plan and the associate's piece follows it — with the security and UAT assist work as named",
          "full and early ownership of every system the company builds, so the associate leads each item end to end without a build team above them",
          "an observer role only, since assist work never touches tested things",
          "free rein to build one system entirely alone each year as a portfolio piece beyond the row's plan",
        ],
        answer: 0,
        ref: "PSF-SDS · sysadmin CWF sub-row key tasks (lib/fixtures/rowspec/it.ts:272)",
        distractorNotes: [
          "The fit: the sub-row prints “Assist with the development of new systems…,” “Assist with new system testing and implementation procedures,” “Assist with user acceptance tests,” with the ITIL line in between.",
          "Whole-item ownership is the build team's act — the assist word sets the sub-row's boundary consistently across six printed tasks.",
          "Untracked assists miss the sub-row's proper tasks — its acts include implementation procedures, security controls, and UAT, all with hands.",
          "Solo portfolio builds are development, not the development-assist the sub-row names — the row sits inside the ITIL line's discipline, not beside it.",
        ],
      },
      // Q2 application — recommend changes in ITIL discipline (PSOC 2522 b)
      {
        skill: "Design and develop new systems",
        catalogSkill: "↳ CWF sub-row: Design and develop new systems",
        stem:
          "The office adopts a new scheduling system and the vendor's default hardware spec is doubled by their quote sheet, unread.",
        options: [
          "recommend changes to the environment only after reviewing the environment the system actually needs, and determine the hardware/software requirements related to those changes",
          "buy whatever spec doubles the vendor's sheet — hardware anger never loses a go-live, and the extra capacity will find a use someday",
          "state the budget is fixed and halve whatever arrives, since the rubber meets adoption anyway",
          "ask every department head to guess the hardware size they'd like and average the numbers",
        ],
        answer: 0,
        ref: "PSOC 2522 · b (research/snapshots/psoc/psoc2012-parsed.csv:286) + PSF-SDS · sub-row “Assist with the development… in accordance with business needs” (lib/fixtures/rowspec/it.ts:272)",
        distractorNotes: [
          "The fit: 2522 b) — “recommending changes to improve systems… and determining hardware or software requirements related to such changes,” priced by the needs the assist row's accordance clause names.",
          "Doubled specs on an unread quote purchase an environment no business act has named — the recommending act comes with the requirements review attached.",
          "Halving by fixed budget answers a money question with no requirements work — changes recommend a system's verified needs, not somebody else's number-cut.",
          "Averaging guesses substitutes a poll for requirements-determination — the environment's size is derived from what the system does, not from rhetoric about hopes.",
        ],
      },
      // Q3 judgment — UAT assist and UAT assist and controlled availability
      {
        skill: "Design and develop new systems",
        catalogSkill: "↳ CWF sub-row: Design and develop new systems",
        stem:
          "The scheduling system's UAT round is next week. A power user offers to “fast-track it” by testing from his department share since the sandbox provision keeps slipping.",
        options: [
          "run the UAT assist in the environment the sub-row's procedures name — sandbox where provisioned, per the user-acceptance tests the sub-row names",
          "accept the production share as the fast-track so UAT becomes a real-world incident by design, counting the fallout log as acceptance evidence",
          "cancel UAT entirely — users always accept whatever arrived last",
          "delay go-live indefinitely until a flawless sandbox appears, and keep the ticket's clock stopped meanwhile",
        ],
        answer: 0,
        ref: "PSF-SDS · sub-row “Assist with user acceptance tests for the newly deployed systems” · “Implement plans to make systems available to users in a shared, secure and controlled manner” (lib/fixtures/rowspec/it.ts:272)",
        distractorNotes: [
          "The fit: the sub-row prints the UAT assist and the availability plan — sandbox where provisioned, and the provision slips get chased, not routes around.",
          "Testing in a production share makes UAT a real-world incident by design — the “shared, secure and controlled” availability clause refuses the shortcut twice over.",
          "Unmade UAT is not acceptance — it is no record at all, and the go-live then rests on nothing.",
          "Holding the go-live with a stopped clock manufactures indefinite drift — the deadline-holding assist keeps the plan's dates with the provision chase attached.",
        ],
      },
    ],
  },

  {
    skill: "Optimize systems performance",
    catalogSkill: "↳ CWF sub-row: Optimize systems performance",
    items: [
      // Q1 recognition — the metrics duty
      {
        skill: "Optimize systems performance",
        catalogSkill: "↳ CWF sub-row: Optimize systems performance",
        stem:
          "The performance role section's morning begins before the office arrives. Which duty list matches the role section's listed acts?",
        options: [
          "carry out optimisation of system components, run the upgrades' technical research, keep the activity documentation, and track key operational metrics",
          "unplug every machine except the best-performing one and file the losers' utilization charts until only one server remains",
          "write a costs-of-power memo and send it around as the performance initiative",
          "email users asking them to arrive later so the servers can nap",
        ],
        answer: 0,
        ref: "PSF-SDS · sysadmin CWF sub-row Optimize systems performance key tasks (lib/fixtures/rowspec/it.ts:279)",
        distractorNotes: [
          "The fit: the sub-row's four printed tasks — optimisation of components, technical research for upgrades, maintained documentation of conducted activities, and the metrics tracking.",
          "Unplugging machines is sabotage dressed as triage — optimisation tunes components, it doesn't subtract them until one remains.",
          "A power-cost memo sits outside the sub-row's printed acts — its object is the components' performance, researched, done, and documented.",
          "Later arrivals shift the load, they don't measure or reduce it — the metrics tracking is the sub-row's instrument, not the office's clock.",
        ],
      },
      // Q2 application — monitor via consoles (PSOC 2522 e)
      {
        skill: "Optimize systems performance",
        catalogSkill: "↳ CWF sub-row: Optimize systems performance",
        stem:
          "The file server crawls every morning at 9:15 and recovers an hour later, two days running.",
        options: [
          "operate the master console through the 9:15 crawl, capture the utilization and throughput metrics, and work the component pattern",
          "switch the crawl to 8:00 by adjusting the office calendar so the two loud hours get recorded earlier each day",
          "restart the server at 9:14 every morning as the standing arrangement",
          "ask the heaviest users to move desks so their traffic spreads across the switch ports",
        ],
        answer: 0,
        ref: "PSOC 2522 · e (research/snapshots/psoc/psoc2012-parsed.csv:286) + PSF-SDS · sub-row “Track key operational metrics, performance, utilization, throughput and capacity” (lib/fixtures/rowspec/it.ts:279)",
        distractorNotes: [
          "The fit: 2522 e)'s console-based monitoring during the crawl plus the sub-row's metrics tracking — the pattern's components are identified before any component is touched.",
          "Moving the record earlier changes the chart, not the crawl — the metrics exist to be measured, not rescheduled into compliance.",
          "A standing 9:14 restart masks the pattern nightly and adds reboot risk on top — the console data is the sub-row's performance instrument.",
          "Spreading users across ports treats staff as the tuning knob — the components' behavior is the sub-row's object, and the pattern's numbers say where it sits.",
        ],
      },
      // Q3 judgment — upgrades: research and recommend (key task 2)
      {
        skill: "Optimize systems performance",
        catalogSkill: "↳ CWF sub-row: Optimize systems performance",
        stem:
          "Your crawl investigation lands on a memory ceiling the current server cannot lift. The vendor offers an upgrade quote.",
        options: [
          "carry out the technical research on the upgrade against the workload evidence and hand the recommendation to whoever owns the component's budget and change plan",
          "purchase the upgrade on the shared card and install it over the weekend, billing the sheets to the department later without a research note",
          "skip the research and declare the ceiling solved — a quote is as good as evidence",
          "propose deleting the heaviest shared folder tree and see whether the crawl responds first",
        ],
        answer: 0,
        ref: "PSF-SDS · sub-row “Conduct technical research for software and hardware upgrades” + “Carry out optimisation of system components…” (lib/fixtures/rowspec/it.ts:279)",
        distractorNotes: [
          "The fit: the research act runs before the purchase — the recommendation reaches the change owner with the workload evidence, matching the sub-row's component-optimisation research task.",
          "Weekend-card purchases bypass the change and budget discipline the research-then-recommend act exists to serve — a purchase is never the sub-row's own act.",
          "A quote proves a vendor's pricing, not the environment's need — the research task is precisely the evidence step the decision wants.",
          "Deleting shared work is data loss dressed as tuning — optimisation keeps the components and their loads; it doesn't remove the workload to flatter the graph.",
        ],
      },
    ],
  },

  {
    skill: "Resolve system-related incidents",
    catalogSkill: "↳ CWF sub-row: Resolve system-related incidents",
    items: [
      // Q1 recognition — identify/resolve and escalate
      {
        skill: "Resolve system-related incidents",
        catalogSkill: "↳ CWF sub-row: Resolve system-related incidents",
        stem:
          "The incident role section holds exactly two listed key tasks plus the discipline around them. What are they?",
        options: [
          "identify and resolve system-related issues, and escalate the ones that remain unresolved",
          "hunt whoever caused each incident and file their names in the tracker",
          "reinstall the whole estate monthly so pursuing incidents becomes pointless",
          "delete tickets older than a week so the queue represents a clean record",
        ],
        answer: 0,
        ref: "PSF-SDS · sub-row “Identify and resolve system-related issues” · “Escalate unresolved system-related issues” (lib/fixtures/rowspec/it.ts:285)",
        distractorNotes: [
          "Our fit: the sub-row prints exactly this pair — the resolve piece first, the escalation for what leaves your hands.",
          "Incident hunting is blame management — the sub-row's object is the issue itself, and the tracker carries it, not the culprit's name first.",
          "Monthly reinstalls aren't in the incident tasks; they also void the very record the incidents' resolution history lives in.",
          "Queue hygiene via deletion destroys the incident history the escalation and documentation discipline ride on.",
        ],
      },
      // Q2 application — diagnosing hardware/software problems (PSOC 2522 c)
      {
        skill: "Resolve system-related incidents",
        catalogSkill: "↳ CWF sub-row: Resolve system-related incidents",
        stem:
          "The shared drive dies mid-morning, resists your first hour, and the error log shows a controller fault the repair shift can't match today.",
        options: [
          "declare the files cursed and close the ticket as far as human bounds go",
          "diagnose the hardware problem from the logs and proceed per the escalation path, since the fault exceeds the minor repair's scope",
          "reformat the drive and start the data upload over from the last sync, saying the diagnosis was only a drift",
          "call every user to the room and rotate guesses until the drive reads again",
        ],
        answer: 1,
        ref: "PSOC 2522 · c (research/snapshots/psoc/psoc2012-parsed.csv:286) + PSF-SDS · sub-row “Identify and resolve system-related issues” · “Escalate unresolved system-related issues” (lib/fixtures/rowspec/it.ts:285)",
        distractorNotes: [
          "Cursed-and-closed abandons the diagnosis the unit prints as the desk's own act — whatever resists extends through the escalation, not the exit.",
          "The fit: 2522 c)'s “diagnosing hardware and software problems,” with the desk's escalation carrying the finding the log makes — a controller fault is a hardware call beyond minor repair.",
          "Reformat-and-reupload erase the diagnosis along with the evidence — the log's fault is the thing the escalation exists to hand onward, intact.",
          "Guess-by-committee substitutes politics for the diagnostic act — the incident's resolution follows the record made; the record starts with the logs.",
        ],
      },
      // Q3 judgment — hand-off quality (documentation discipline + sub-row)
      {
        skill: "Resolve system-related incidents",
        catalogSkill: "↳ CWF sub-row: Resolve system-related incidents",
        stem:
          "The controller-fault ticket leaves your tier now. What does the hand-off carry so the next tier can work it without starting over?",
        options: [
          "the incident marked resolved in advance, so the next tier opens at a clean page without any findings attached",
          "a short verbal summary, unlogged, at the next tier's desk with your full trust in their memory as the carrier",
          "nothing — the next tier reads the same logs anyway and any summary is tautological",
          "the logs, the diagnosis at the point of escalation, the failed first-hour steps, and the users' current access state",
        ],
        answer: 3,
        ref: "PSF-SDS · sub-row evacuate/escalate tasks + brace “Maintain documentation of all conducted system optimisation activities” (lib/fixtures/rowspec/it.ts:279, 285)",
        distractorNotes: [
          "Prefilled resolution is false record-keeping — the escalation carries, not declares; the sub-row's unresolved state is exactly what goes onward.",
          "Verbal-only hand-offs leave the tracker empty — the incident's documented state, tracked in management systems, is what outlives today's desk.",
          "The next tier could reconstruct anything from logs, but the discipline of hand-off is to carry the aimed path — the failed steps and the diagnosis save the next tier the same hour you spent.",
          "The fit: diagnostic record carried with the findings and the incident's state — the documentation discipline makes the hand-off a working page, not an untyped message.",
        ],
      },
    ],
  },

  {
    skill: "Oversee SLAs and service improvements",
    catalogSkill: "↳ CWF sub-row: Oversee service level agreements and service improvements",
    items: [
      // Q1 recognition — assist in developing objectives & targets
      {
        skill: "Oversee SLAs and service improvements",
        catalogSkill: "↳ CWF sub-row: Oversee service level agreements and service improvements",
        stem:
          "The SLA section of the associate's descriptor lists the key tasks. What does that wording assign?",
        options: [
          "assist in developing service-level objectives and targets — the associate's input builds them, the ownership sits upstairs",
          "sign off SLA targets personally every quarter and seal them for the record",
          "redefine the SLA vocabulary each cycle so the printed objectives stay interesting to the readers upstairs",
          "refuse to read the objectives — targets are the users' beliefs, not contracts",
        ],
        answer: 0,
        ref: "PSF-SDS · sub-row “Assist in developing service-level objectives and targets” (lib/fixtures/rowspec/it.ts:302)",
        distractorNotes: [
          "The fit: the assist verb is the associate's scope — objectives and targets are developed with the associate's input, while the ownership settles at the SLA's owner.",
          "Personal sign-off overstates the role — the assist task's contribution is input, not the rubber-seal authority an owner holds.",
          "Vocabulary rewrites don't appear among the printed tasks — the sub-row's fleet is objectives, targets, logs, improvements.",
          "Refusal reads against the sub-row's own name — the SLA work is the sub-row's object, and its tasks build upon the targets' existence.",
        ],
      },
      // Q2 application — recurring incidents & the logs (CWF bullets)
      {
        skill: "Oversee SLAs and service improvements",
        catalogSkill: "↳ CWF sub-row: Oversee service level agreements and service improvements",
        stem:
          "The same printer ticket returns every Friday for three months, each time closed and reopened by a different staff member.",
        options: [
          "maintain the log of service level performance metrics, and identify the recurring incident and the potential issue for senior management, as the CWF's tasks direct",
          "print a sign saying “printers are miserable today” and tape it by the queue so staff recognize the recurring mood each Friday shift",
          "delete every reopened instance from the log as duplicate clutter",
          "close all Friday's tickets at once with a blanket “recurring, known, ignored” note",
        ],
        answer: 0,
        ref: "PSF-SDS · sub-row “Maintain log of service level performance metrics” · “Identify recurring incidents and potential issues for senior management” (lib/fixtures/rowspec/it.ts:302)",
        distractorNotes: [
          "The fit: two printed tasks against the Friday recurrence — the log maintained, the recurrence identified and raised upward with its potential issue.",
          "The taped sign is a mood statement, not an SLA act — identification routes through logs to senior management, and a poster does neither.",
          "Deletion corrupts the recurrence's own evidence — the log's repeats are literally the instrument the identification duty runs on.",
          "A blanket close fakes the log forward — every reopening is a metric of the underlying issue's persistence, and each one belongs on the record.",
        ],
      },
      // Q3 judgment — suggest-vs-implement (CWF "Suggest improvements")
      {
        skill: "Oversee SLAs and service improvements",
        catalogSkill: "↳ CWF sub-row: Oversee service level agreements and service improvements",
        stem:
          "Your dashboard flags the response target breached for the tenth Friday running. A teammate proposes a formal improvement suggestion with the numbers attached.",
        options: [
          "implement the improved procedure yourself starting tomorrow, since the numbers are plainly hers and routing takes too long",
          "formalize the suggestion per the CWF — suggest improvements for procedures and controls with the metric evidence, and route it to the improvements channel",
          "ask the recurring ticket's author to write it, since he saw the incident first",
          "void the incident definition and sundown the metric — charts beyond ten breaches read as noise anyway",
        ],
        answer: 1,
        ref: "PSF-SDS · sub-row “Suggest improvements for procedures and controls to enhance performance and client satisfaction” (lib/fixtures/rowspec/it.ts:302)",
        distractorNotes: [
          "Self-implementing a procedure change reaches beyond the suggest-side of the CWF — the sub-row's associate act routes through the channel, it doesn't enact alone.",
          "The fit: the printed suggest-and-enhance act with the breach metrics carried — the formal suggestion is precisely the CWF's improvement instrument.",
          "Authorship by first-sight is a nice sentiment — the sub-row's own duty list loads the suggestion with metrics, not with whoever's tenure is longest.",
          "Sundowning the metric prevents the breach from being seen at all — the improvement task exists against the metric, not in its freedom.",
        ],
      },
    ],
  },

  {
    skill: "Security Administration",
    catalogSkill: "Security Administration",
    items: [
      // Q1 recognition — the security FSC's scope (L3 kept secondary)
      {
        skill: "Security Administration",
        catalogSkill: "Security Administration",
        stem:
          "The security FSC lists: “Administer, configure and update of security programs and mechanisms, including the application of system patches… authorisation, management and monitoring of access control permissions and/or rights to various IT facilities.” What does a quarter of that role hold?",
        options: [
          "reading one annual security seminar's slides a quarter for background and calling the duty served",
          "the administering rhythm: security programs configured, patches applied, access permissions authorised and monitored",
          "chasing the office's fastest password-writer to issue everyone fresh ones weekly",
          "manning the door at the server room with a clipboard",
        ],
        answer: 1,
        ref: "PSF-SDS · sysadmin Security Administration FSC L3 descriptor (lib/fixtures/rowspec/it.ts:308)",
        distractorNotes: [
          "Once-a-year reading is an awareness event; the FSC's administration runs through configure-update-patch and the access rhythm continuously.",
          "The fit: the descriptor's quarterly slice — the security programs and mechanisms, patches applied, and the access permissions' authorization-management-monitoring cycle.",
          "Rotating passwords weekly is a superstition, not the descriptor's mechanism — the security programs' administration follows the update and patch cycle printed.",
          "Door-with-clipboard is physical-securing theatre — this row's security protects the IT facilities' access rights, and the mechanisms print inside the FSC.",
        ],
      },
      // Q2 application — implement integrity controls + revoke access (CWF)
      {
        skill: "Security Administration",
        catalogSkill: "Security Administration",
        stem:
          "Last quarter's contractor finished and left last week, and his contractor account still opens the finance folder on your systems.",
        options: [
          "revoke the access and record the update per the integrity-controls discipline, then confirm the removal by testing the folder's access",
          "add him to the everyone group so his account stays functional for possibly returning gigs next quarter or so",
          "leave it — the folder gets visited rarely and the risk is surely nobody's today",
          "e-mail his password to the finance manager as a courtesy in case of return work",
        ],
        answer: 0,
        ref: "PSF-SDS · CWF “Implement systems security and integrity controls” + descriptor's authorization-management-monitoring clause (lib/fixtures/rowspec/it.ts:308–309)",
        distractorNotes: [
          "The fit: the access author-management clause plus the integrity-controls CWF — a departed contractor's rights are revoked, recorded, and the removal verified.",
          "Everyone-group add grants reach the descriptor's administrated access exists to govern — a security row exists precisely to prevent this by default.",
          "Rarely-opened is an unmeasured risk, not a security state — the access sits authorized against a departed authorization.",
          "Password courtesy spreads the account's identity to another handler — the access-control management the FSC prints keeps rights inside the enterprise's records.",
        ],
      },
      // Q3 judgment — patch application (descriptor's patch clause)
      {
        skill: "Security Administration",
        catalogSkill: "Security Administration",
        stem:
          "A critical patch for the shared file server drops outside every patch window on the calendar. Production users are mid-file on the server.",
        options: [
          "apply the patch immediately during production hours — the critical label is a ticket to interrupt anything",
          "schedule the patch for the next patch window and, given the criticality, secure interim mitigations (reduced exposure, monitoring) with the change owner's agreement",
          "wait six months for the quarterly maintenance reboot season — patches ride the season regardless of the calendar",
          "decline the patch on the server until the vendor recalls it, since mid-production patches always break something somewhere",
        ],
        answer: 1,
        ref: "PSF-SDS · descriptor “including the application of system patches to ensure that enterprise assets are adequately protected” (lib/fixtures/rowspec/it.ts:308)",
        distractorNotes: [
          "Immediate application trades the access discipline for the vendor's urgency — the descriptor's patch-to-protect runs through the mechanisms, and mechanisms have change owners.",
          "The fit: the patch act kept in disciplined shape — interim mitigation covers the exposure, the next window applies the fix, and the record carries both decisions.",
          "Six-month waiting leaves enterprise assets exposed for a season out of superstition — patches exist as the descriptor's standing instrument.",
          "A blanket refusal protects the server's uptime over the enterprise's assets — the descriptor's very object is adequately protected enterprise assets, and mid-production breaks are managed, not banned.",
        ],
      },
    ],
  },

  {
    skill: "IT Asset Management",
    catalogSkill: "IT Asset Management",
    items: [
      // Q1 recognition — the FSC L2 lifecycle (descriptor)
      {
        skill: "IT Asset Management",
        catalogSkill: "IT Asset Management",
        stem:
          "The asset-management card lists: “Manage, optimize and protect the organization's IT assets. This includes the timely purchase, deployment, categorisation, maintenance and phase out of IT assets.” A staff laptop's year looks like:",
        options: [
          "purchase recorded, category logged, deployment tracked, maintenance serviced, and phase-out arranged at its end — each step inside the printed sequence",
          "purchase and phase-out only — whatever happens in the middle is the laptop's own business",
          "an invoice, then a shelf position — categorisation is what spreadsheets ruined",
          "a re-purchase each time a staff member changes desks, since laptop identities cannot transfer across the assets' records",
        ],
        answer: 0,
        ref: "PSF-SDS · sysadmin IT Asset Management FSC L2 descriptor (lib/fixtures/rowspec/it.ts:314)",
        distractorNotes: [
          "The fit: the descriptor's five lifecycle steps in order — every stage recorded, and the laptop's year touches all five.",
          "Middle-stages disappearing is precisely what the descriptor's categorisation and maintenance steps exist against — the year's skips are the card's target.",
          "Invoice-then-shelf collapses the five-step print into its extremes — the middle is where the descriptor's work happens.",
          "Non-transferable laptop identities are invented — the categorisation and deploy-recording the descriptor lists exist so the laptop moves across desks and stays in the record intact.",
        ],
      },
      // Q2 application — licensing records
      {
        skill: "IT Asset Management",
        catalogSkill: "IT Asset Management",
        stem:
          "Renewal letters arrive for eleven software licenses. Three of them are for tools the department stopped using last quarter.",
        options: [
          "renew all eleven — stopping use of a tool is no reason to stop paying for it",
          "check the overview's “manage service licensing” duty: renew the still-used eight, and route the unused three through the phase-out step per the asset lifecycle",
          "renew the three unused ones since they are the cheapest, and let the useful eight lapse until someone complains to the vendor",
          "e-mail the vendors of the eleven and negotiate a lifetime all-you-can-source deal on the spot",
        ],
        answer: 1,
        ref: "PSF-SDS · sysadmin overview “manage service licensing” (lib/fixtures/rowspec/it.ts:315) + descriptor's phase-out step (it.ts:314)",
        distractorNotes: [
          "Blanket renewal pays weights the license ledger never asked for — the manage-licensing act decides by use, not by habit.",
          "The fit: the licensing act manages renewals by use, and the phase-out step the lifecycle prints is precisely where unused license assets go.",
          "Renewing cheap-and-unused while useful licenses lapse inverts the ledger — licensing management records what's used and lets the rest phase out.",
          "Lifetime deals are vendor negotiation, not the asset record's act — the printed duty is management of the service licensing on hand.",
        ],
      },
      // Q3 judgment — asset accuracy under audit pressure (descriptor + overview)
      {
        skill: "IT Asset Management",
        catalogSkill: "IT Asset Management",
        stem:
          "The audit notice asks for the asset list. Your count and records disagree on fourteen items: desks moved, laptops lapsed, one server recycles itself.",
        options: [
          "certify the records as they stand, saying a hand-count is a rounding exercise",
          "hand the auditors the physical count alone and ignore the records as fictional",
          "shield the inventory headcount from the auditors until the desk's saying-so stabilizes",
          "reconcile the record with the physical count now, adjust the fourteen, and submit both reconciled",
        ],
        answer: 3,
        ref: "PSF-SDS · sysadmin IT Asset Management descriptor “categorisation, maintenance and phase out of IT assets” — the record tracks the state (lib/fixtures/rowspec/it.ts:314)",
        distractorNotes: [
          "Certifying a stale record is the audit's exact fail — the record's purpose is to describe the estate's true state, and the record's reconciliation is the correction it needs.",
          "Physical alone subtracts the record's own value — the asset list reconciles record and reality, and both exist for the count to check.",
          "Shielding the count buys nothing and looks worse by the week — the reconciliation is what audit wants, and the fourteen corrections are the work.",
          "The fit: reconciled record and count, corrections applied — the record measures the now of the estate, and audit measures whether the record measures.",
        ],
      },
    ],
  },

  {
    skill: "System Integration",
    catalogSkill: "System Integration",
    items: [
      // Q1 recognition — the L3 roadmap scope, kept secondary
      {
        skill: "System Integration",
        catalogSkill: "System Integration",
        stem:
          "The integration section of your descriptor reads: “Develop and implement a roadmap and specific integration solutions to facilitate integration of various ICT components and optimize interoperability of systems and their interfaces…” You are the associate on this role:",
        options: [
          "develop the integration solutions for every company-wide project personally and own each one end to end, from scratch, unassisted",
          "the roadmap and solutions pull from the row's keys; the associate's piece runs underneath — assisting with the developments and keeping the interoperability goal real",
          "free-write your own integration vocabulary and use it in the roadmap's place",
          "treat interoperability as optional — interfaces that fail inside the enterprise stay inside the enterprise",
        ],
        answer: 1,
        ref: "PSF-SDS · sysadmin System Integration FSC L3 descriptor, kept secondary per the ladder (lib/fixtures/rowspec/it.ts:321–324)",
        distractorNotes: [
          "Full ownership is the L3's senior act — the row is kept secondary precisely because the associate's piece runs underneath the roadmap.",
          "The fit: the L3 descriptor's roadmap-and-solutions goal carried by the associate through the assist work the row's CWF route names.",
          "A private vocabulary doesn't integrate — interoperability is the descriptor's object, and vocabulary sidesteps the interfaces in question.",
          "Failing interfaces do not stay politely inside — the descriptor's optimize-interoperability clause exists to pull every component into reach.",
        ],
      },
      // Q2 application — connect with tested hand-offs (CWF + the row)
      {
        skill: "System Integration",
        catalogSkill: "System Integration",
        stem:
          "Finance buys a reporting tool and wants it talking to the reporting warehouses by Monday's close.",
        options: [
          "wire it live during Monday's payroll run and pray the handoffs align",
          "install it unasked on every laptop in the company overnight, so integration becomes a solved-on-paper question in one bulk sweep",
          "let it stand alone with a sticky-note reminder to “bring it up at the next budget season”",
          "connect it per the integration discipline — reviewed and tested hand-offs to the existing systems, with the business needs the developments-accordance clause carried",
        ],
        answer: 3,
        ref: "PSF-SDS · sysadmin System Integration anchors “Assist with the development of new systems… in accordance with business needs” (lib/fixtures/rowspec/it.ts:322)",
        distractorNotes: [
          "Monday-live wiring gives the payrolls an integration incident they didn't agree to — the tested-and-reviewed hand-offs are the row's own instrument.",
          "Bulk-laptop deployment is a rollout decision, not an integration act — the tool's integration needs the interfaces tested and reviewed, not the estate seeded.",
          "Standalone-with-sticky-note leaves the interoperability goal worked around — the descriptor asks the integration solutions and interfaces to become real, not hopeful.",
          "The fit: per the integration discipline — tested, reviewed hand-offs, with the business-needs accordance attached per the CWF route the row carries.",
        ],
      },
      // Q3 judgment — interoperability vs big-bang (descriptor's goals)
      {
        skill: "System Integration",
        catalogSkill: "System Integration",
        stem:
          "An integration proposal suggests replacing all current interfaces with one new bus system overnight, with the old systems retired in the same week.",
        options: [
          "endorse the overnight big-bang, since interfaces that get retired needn't be tested",
          "carry the proposal to the roadmap discussion — the interoperability goal favors staged integration with each interface's interop verified progressively",
          "make the replacement interface-friendly by having the old systems' users print their data as PDF and trust the new bus eventually",
          "pause the proposal until the vendor's bus has been in production six months somewhere",
        ],
        answer: 1,
        ref: "PSF-SDS · sysadmin System Integration FSC L3 descriptor — “roadmap and specific integration solutions… optimize interoperability of systems and their interfaces” (lib/fixtures/rowspec/it.ts:321)",
        distractorNotes: [
          "Retired interfaces still get tested — an overnight big-bang removes every verification point the integration's roadmap carries.",
          "The fit: the roadmap's staged carrying is what the descriptor's integrate-and-optimize-interop allows — one verified step at a time, the retired interfaces recorded as they leave.",
          "PDF hand-offs are a workaround the integration was supposed to eliminate — the bus's adoption has to be earned by interfaces that actually talk.",
          "Six-month precedent is a real objection but not the integration decision — the roadmap's discussion with stages and verifications is the place the proposal goes.",
        ],
      },
    ],
  },

  {
    skill: "Configuration Tracking · Cyber-incident · BNA bundle",
    catalogSkill:
      "Configuration Tracking · Cyber-and-Data-Breach Incident Management · Business Needs Analysis",
    items: [
      // Q1 recognition — the traceability bundle's three FSCs
      {
        skill: "Configuration Tracking · Cyber-incident · BNA bundle",
        catalogSkill:
          "Configuration Tracking · Cyber-and-Data-Breach Incident Management · Business Needs Analysis",
        stem:
          "The sysadmin bundle merges three task sets into one role. What does the trio carry?",
        options: [
          "traceability discipline (changes accounted for), incident discipline (detect, report, identify, trigger), and needs discipline (documents for business requirements)",
          "three flavors of paperwork about the same ticket, provided you pick one of them and ignore the rest",
          "a reading list on security, configuration, and business, nothing hands-on for anyone on the desk",
          "a rule that all changes occur on Fridays only, so the trace and the incident paperwork can share one charged day of the week",
        ],
        answer: 0,
        ref: "PSF-SDS · sysadmin bundle descriptor (lib/fixtures/rowspec/it.ts:326–329)",
        distractorNotes: [
          "The fit: Configuration Tracking's “all changes are accounted for,” the cyber incident's detect-report-identify-trigger sequence, and Business Needs Analysis' requirements act — the triple read as three disciplines on one desk.",
          "The three carry separate objects — change records, incident response, and requirements — and the discipline is to keep all three real, not to collapse paperwork.",
          "The bundle is hands-on by nature — the trace lands in tickets, the incident in alerts and announcements, the needs in documented requirements.",
          "The printed triple encodes no calendar rule — Friday clustering is a joke the disciplines don't print.",
        ],
      },
      // Q2 application — change traceability records
      {
        skill: "Configuration Tracking · Cyber-incident · BNA bundle",
        catalogSkill:
          "Configuration Tracking · Cyber-and-Data-Breach Incident Management · Business Needs Analysis",
        stem:
          "A change you logged last month (script v14 → v15) is now tangled in a security scare as the query volume tripled.",
        options: [
          "delete the change logs so nothing points at your hand in the tripled volume",
          "trace the change records — what changed, when, by whom, with the v14/v15 states — and carry the record into the incident conversation for the security function to judge",
          "say the config changed itself in the report and move the script to the next ticket",
          "fix it quietly yourself through the weekend and never mention the logs or the script to anyone anywhere, on or off the record",
        ],
        answer: 1,
        ref: "PSF-SDS · Configuration Tracking FSC L1–2 “Track systematically and manage changes and revisions in software projects to ensure that all changes are accounted for” (lib/fixtures/rowspec/it.ts:327–328)",
        distractorNotes: [
          "Deleting the logs corrupts the change record — and the security conversation that lists the per-change states exists precisely to read it.",
          "The fit: the traceability discipline carried into the incident — the change's states and the tripled volume are traceable facts the security function needs, not facts to erase.",
          "A self-changing config claim writes fiction into a traceability record — the changes' operators and records are accounted for, by the discipline's own name.",
          "Weekend silent fixes are the traceability record's opposite — the change was accounted, and the fix needs to stay accounted too.",
        ],
      },
      // Q3 judgment — escalation discipline on a scare (bundle's cyber incident leg)
      {
        skill: "Configuration Tracking · Cyber-incident · BNA bundle",
        catalogSkill:
          "Configuration Tracking · Cyber-and-Data-Breach Incident Management · Business Needs Analysis",
        stem:
          "Your traced record shows the tripled query volume coincides with a pattern nobody on your desk recognizes. The security function asks what you want to do.",
        options: [
          "escalate per the bundle's incident discipline — trigger the alerts and announcements the incident leg prints, with the traced record attached",
          "write the case off as a query storm and log it as random growth nobody on any desk can account for anywhere",
          "retire the script entirely and re-wire the workflows to survive without it, over the weekend, unsupervised and unrecorded",
          "ask the security team to look away for a month so the growth pattern settles on its own",
        ],
        answer: 0,
        ref: "PSF-SDS · Cyber and Data Breach Incident Management FSC L2 descriptor (lib/fixtures/rowspec/it.ts:241, 243)",
        distractorNotes: [
          "The fit: the incident leg's detect-and-report with the traceable record made available — triggering alerts and announcements is the leg's printed act, and the evidence travels.",
          "A written-off query storm discards the pattern the record shows — the incident leg exists because a pattern nobody recognizes is exactly what alerts are for.",
          "Weekend self-wiring is an unaccounted change on top of the scare — the traceability leg exists to prevent the layering, and the re-wiring discards twice.",
          "Asking security to look away inverts the incident discipline — the escalation exists because patterns' interpretations live upstairs.",
        ],
      },
    ],
  },

  {
    skill: "Sysadmin Enabling row",
    catalogSkill:
      "Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)",
    items: [
      // Q1 recognition — ESC all Basic as printed (this ladder serves sysadmin AND dba)
      {
        skill: "Sysadmin Enabling row",
        catalogSkill:
          "Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)",
        stem:
          "Your onboarding page lists the enabling bundle exactly as the maps of BOTH the sysadmin and the DBA roles carry it. What that shared list states:",
        options: [
          "the five enabling skills print at Basic and belong to the same behavior layer on both maps",
          "sysadmin's five print Advanced, and DBA's carry Basic — the two differ by seniority",
          "the bundle prints only on the sysadmin map; the DBA's page stays blank",
          "the five print at varying stages decided annually by lottery",
        ],
        answer: 0,
        ref: "PSF-SDS · sysadmin + dba enabling bundle descriptors, all Basic as printed (lib/fixtures/rowspec/it.ts:333, 408)",
        distractorNotes: [
          "The fit: both maps print the same five skills, all Basic — the print is identical on both, and the ladder shared in the bank means one verification serves both.",
          "No deviating print exists — both maps print all five at Basic, with nothing seniority-shaped in either.",
          "The DBA map prints the identical bundle — the shared print is the reason one ladder serves both roles.",
          "No annual or lottery-shaped assignment sits behind the print — the levels print as Basic across the five bundle skills.",
        ],
      },
      // Q2 application — read the hand-over notes and pick up cleanly
      {
        skill: "Sysadmin Enabling row",
        catalogSkill:
          "Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)",
        stem:
          "The night shift leaves you three open incidents with messy hand-over notes, and morning hours arrive fast.",
        options: [
          "reopen all three as fresh items so the counts reset and the reading becomes unnecessary this morning",
          "log in, read the notes, pick up each incident from where the notes leave, and re-write the state as you advance it",
          "wait for the night shift to log back in and own both shifts' notes entirely",
          "forward all three to the office chat as humor with their screenshots",
        ],
        answer: 1,
        ref: "PSF-SDS · the enabling bundle's Basic layer (problem-solving/self-management acts) + sysadmin documentation CWF (lib/fixtures/rowspec/it.ts:279, 333)",
        distractorNotes: [
          "Reopening clears nothing — the ticket's continuity is the record's spine, and a reset count mistells the state.",
          "The fit: the enabling layer's acts applied — read first, pick up clean, and leave the state as written as it was picked up.",
          "The previous shift's absence doesn't own the current one — the oncoming staff is where the tickets end up working, with the notes as the carrying record.",
          "Humor-forward of an incident broadcasts its screenshot as the record's shortest version — the enablement's collaboration keeps the record, not the joke.",
        ],
      },
      // Q3 judgment — Self Management under scared callers
      {
        skill: "Sysadmin Enabling row",
        catalogSkill:
          "Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)",
        stem:
          "You are mid-shutdown when the third call of the morning comes in furious, blaming the stubbed network drive for their absence at a client meeting.",
        options: [
          "stay steady under the charge, own the case's actual state plainly, and carry the call through to the solution or hand-off route",
          "match the caller's escalation with a stronger one so the lines are heard equally",
          "cut straight to the next ticket and let the drive's blame hang as the morning's unclaimed artifact",
          "promise the drive is fixed to move the call along and resolve it whenever the morning allows",
        ],
        answer: 0,
        ref: "PSF-SDS · its/sysadmin/dba overview sentence “They can communicate effectively and display high service level standards” + the enabling bundle's Basic layer (lib/fixtures/rowspec/it.ts:255, 334, 409)",
        distractorNotes: [
          "The fit: Self Management and Communication applied as printed — the steady voice on the actual state, through resolution or clean hand-off, not through aggression or drop.",
          "Matching escalation doubles the charge — the service standards the sentence prints stay plain under pressure, not heated into another storm.",
          "The unclaimed charge rots into resentment — the self-management's act is to carry the case to its resolution, not to let blame stand.",
          "A fake fix is the service standards' direct inversion — the caller's drive stays broken and the call's trust had been spent.",
        ],
      },
    ],
  },

  // ═══════════════ wave 2 · dba · Database Administrator (roster 2.6) ═══════
  // Anchors: PSOC 2521 lettered lines (research/snapshots/psoc/psoc2012-parsed.csv:285),
  // PSF-SDS verbatim quotes in lib/fixtures/rowspec/it.ts (lines 339–410).
  {
    skill: "Database Administration",
    catalogSkill: "Database Administration",
    items: [
      // Q1 recognition — the FSC L2's whole span
      {
        skill: "Database Administration",
        catalogSkill: "Database Administration",
        stem:
          "Your DBA desk's card lists: “Perform Installation, coordination and upgrading of databases and database servers, performance monitoring and troubleshooting… planning for backup and recovery, archived data maintenance and reporting.” What fills a routine week on that card?",
        options: [
          "the DBMS install/upgrade cycle, performance monitoring, troubleshooting, plus backup and recovery planning with the archived-data maintenance and reporting",
          "football-tightening sessions with the developers to decide who broke what, held weekly in the archives room at noon",
          "recruiting statisticians for the company's hiring pipeline",
          "decorating the database server room with motivational posters",
        ],
        answer: 0,
        ref: "PSF-SDS · dba Database Administration FSC L2 descriptor (lib/fixtures/rowspec/it.ts:341)",
        distractorNotes: [
          "The fit: the descriptor's own verbs walked — install and upgrade, monitoring and troubleshooting, backup-and-recovery planning, archived-data maintenance and reporting.",
          "Who-broke-what sessions are blame management — the FSC's object is the database systems' state, not the developers' characters.",
          "Statistician recruiting is HR's act — the card's verbs all end in database, not in people.",
          "Decoration is facilities' mood — the card's routine is the DBMS itself and its maintenance, printed plainer than that.",
        ],
      },
      // Q2 application — install/config/maintain the DBMS (CWF key task 3)
      {
        skill: "Database Administration",
        catalogSkill: "Database Administration",
        stem:
          "The student-records DBMS moves to a new server next weekend. The assist task lands on your desk.",
        options: [
          "assist in the installation, configuration and maintenance of the DBMS software per the CWF's key tasks, with the backups of the moved records verified on the new host",
          "ask each department to install the DBMS on their own machines and bring you real answers when they succeed with the license keys",
          "install the DBMS on your workstation and let the departments sign their records out one file at a time",
          "say the move is the vendor's package and sit out the records either way",
        ],
        answer: 0,
        ref: "PSF-SDS · dba CWF “Assist in installation, configuration and maintenance of database management systems software” (lib/fixtures/rowspec/it.ts:343)",
        distractorNotes: [
          "The fit: the printed CWF task — install, configure, and maintain the DBMS software — with the moved environment's backup verification attached per the same block.",
          "User-installed databases multiply the DBMS across desktops — the maintenance and configuration the task prints belong to the DBMS's administrative environment, in one place.",
          "A workstation DBMS converts a company system into a laptop app — the install/config/maintenance task runs in the intended environment, backed up per its plan.",
          "Vendor-waiting abandons the desk's task — the assist act is the DBMS's installation and configuration, and vendors don't carry the customers' records.",
        ],
      },
      // Q3 judgment — backup/recovery policy (PSOC 2521 e)
      {
        skill: "Database Administration",
        catalogSkill: "Database Administration",
        stem:
          "The registrar's database hosts enrollment and grades. A vendor pitches a fresh backup cloud anyone can schedule on demand, and the old nightly backup plan still works.",
        options: [
          "develop and implement the policies and procedures for database access and usage and for backup and recovery — decide against the fly-by-schedule backup unless it fits the plan's controls",
          "drop the nightly backup and rely on the vendor's on-demand restore service, since on-demand sounds more modern than the nightly discipline the plan prints",
          "back up the database nowhere — the grades are entered twice on paper anyway, and the paper is the real backup",
          "schedule a backup every ten minutes across all hours, since more backups beat fewer backups forever",
        ],
        answer: 0,
        ref: "PSOC 2521 · e (research/snapshots/psoc/psoc2012-parsed.csv:285) + PSF-SDS · CWF “Implement database back-up and recovery procedures” (lib/fixtures/rowspec/it.ts:343)",
        distractorNotes: [
          "The fit: 2521 e)'s policy act — access, usage, and backup/recovery procedures developed and implemented, which is precisely the decision layer the vendor pitch never carries.",
          "Refusing the printed plan for the promise of modern picks the word over the procedure — the policies and procedures the unit prints govern the backup, whether cloud or house.",
          "Paper-as-backup is the record fragmenting — the recovery procedures exist so the database restores, and paper does not restore.",
          "Ten-minute backups across all hours reproduce every stair-down of the policy question — procedure design chooses the schedule and controls, not its loudest multiplication.",
        ],
      },
    ],
  },

  {
    skill: "Oversee database administration",
    catalogSkill: "↳ CWF sub-row: Oversee database administration",
    items: [
      // Q1 recognition — the environments task
      {
        skill: "Oversee database administration",
        catalogSkill: "↳ CWF sub-row: Oversee database administration",
        stem:
          "The oversight role section lists its first task plainly: “Maintain development, production and multiple testing environments.” What does maintaining them involve?",
        options: [
          "reading the three environments' names aloud at every stand-up until the team remembers them",
          "keeping the three environments real, current, and used for what they are built for — dev, production, and the multiple testing stages",
          "erasing test environments whenever the disk looks full — testing can borrow production quietly as the schedule needs it",
          "renaming the servers seasonally so the environments' flavors stay fresh",
        ],
        answer: 1,
        ref: "PSF-SDS · dba CWF “Maintain development, production and multiple testing environments” (lib/fixtures/rowspec/it.ts:343, 382)",
        distractorNotes: [
          "Reading names maintains nothing — the task's object is the environments' actual state and fitness for their stages.",
          "The fit: the three environment families are maintained as what they are — dev, production, and the multiple testing environments their stages hold.",
          "Erasing testing environments for disk comfort eliminates the safety stage the print names — “multiple testing environments” are among the maintained, never expendable.",
          "Renamings move the record's address — the environments' maintenance keeps hosts and stages stable, not festive.",
        ],
      },
      // Q2 application — assist in upgrades
      {
        skill: "Oversee database administration",
        catalogSkill: "↳ CWF sub-row: Oversee database administration",
        stem:
          "The registrar's database upgrade lands next month, and its task list claims your desk for the assist.",
        options: [
          "assist in the upgrade of the database's structures and elements, per the printed assist task — prepared in a testing environment and verified before production takes them",
          "upgrade the production database directly on Friday at close, since a next-month plan wastes the urgency that the ticket's own wording carries",
          "upgrade the department's shared spreadsheet instead and see if anyone notices",
          "tell the vendor their upgrade must come with free pizzas as the department's condition",
        ],
        answer: 0,
        ref: "PSF-SDS · dba CWF “Assist in upgrades of databases, new structures or elements” (lib/fixtures/rowspec/it.ts:343, 382)",
        distractorNotes: [
          "The fit: the assist task named — the upgrade's structures and elements prepared in testing and verified before production, matching the same CWF block's environments task.",
          "Friday-at-close on production skips the environments the sub-row maintains — the upgrade's verification stage exists precisely to take production's risk off the table first.",
          "A spreadsheet substitution is not the database upgrade — the registrar's records are the registrar's database.",
          "Vendor pizza is catering negotiation — the upgrade's task list holds the ascent path and its assist tasks, and no dish appears there.",
        ],
      },
      // Q3 judgment — recovery procedures before a migration window
      {
        skill: "Oversee database administration",
        catalogSkill: "↳ CWF sub-row: Oversee database administration",
        stem:
          "The migration window approaches and the backup procedure's last verified restore drill is two quarters old.",
        options: [
          "run the drill now — implement the back-up and recovery procedure, prove the restore bites on the current structures, and carry the result into the window's go/no-go",
          "skip the drill — the backup's nightly success logs are proof enough, and restores always work in real films",
          "run the drill mid-migration to save a window, and treat failure findings during the migration as the drill's bonus lessons",
          "declare the backup void — the database survives on its own redundancy, and drills are the anxious' theater",
        ],
        answer: 0,
        ref: "PSF-SDS · dba CWF “Implement database back-up and recovery procedures” (lib/fixtures/rowspec/it.ts:343, 382)",
        distractorNotes: [
          "The fit: the implementation act and its verification — the drill proves the procedure against today's structures, and the result is the migration's go-questions first.",
          "Nightly success logs prove backups ran, not that a restore of a contested structure worked — the recovery procedure's proof is the drill, and the drill is two quarters stale.",
          "Drilling mid-migration stacks the migration's risks on top of the drill's — the exercise goes ahead of the window, and the window is clean for its own risks.",
          "Superstition is not a backup plan — the redundancy serves availability, and the drill verifies that what restores, actually restores.",
        ],
      },
    ],
  },

  {
    skill: "Design and develop new database",
    catalogSkill: "↳ CWF sub-row: Design and develop new database",
    items: [
      // Q1 recognition — the assist-slice tasks
      {
        skill: "Design and develop new database",
        catalogSkill: "↳ CWF sub-row: Design and develop new database",
        stem:
          "The database-design role section lists its assist-slice: business-needs analysis for the design, system flows, data documentation, indexing, procedures. A new-desk starter asks what the assist does. What answer matches?",
        options: [
          "the assist side does the design's underlayer: needs analysis, system flows, data documentation, indexing, and procedures' code-and-install",
          "the assist side changes the final art decisions of the user interface only, touching nothing beneath the interface's paint",
          "the assist side prints conference posters for the database team and books its launch parties",
          "the assist side is a rumor — the design flows fully complete from the vendor's side to the desk",
        ],
        answer: 0,
        ref: "PSF-SDS · dba CWF “Design and develop new database” key tasks (lib/fixtures/rowspec/it.ts:344, 389)",
        distractorNotes: [
          "The fit: the printed tasks walked — needs analysis, flows, “Maintain data documentation and metadata models,” “Configuring indexing,” and “Code, edit and install stored procedures and functions.”",
          "Interface art sits in the design family's own rows — the database design's underlayer is what this sub-row prints, task by task.",
          "Conference posters are sponsorship work entirely outside the sub-row's printed tasks.",
          "The printed tasks prove otherwise — the sub-row's assist slice lands on the design's underlayer precisely where vendors do not go.",
        ],
      },
      // Q2 application — indexing and stored procedures
      {
        skill: "Design and develop new database",
        catalogSkill: "↳ CWF sub-row: Design and develop new database",
        stem:
          "Marketing's campaign tracker prototype runs its searches slow and the structure is still yours to shape in testing.",
        options: [
          "configure the indexing on the search tables and code the stored procedures for the access patterns, testing both before the structure ships",
          "scatter the search keys into twenty tables so the query tools spread their load and the slowness resolves statistically",
          "disable surge protection on the database server so the sector reads never pause",
          "send the prototype's screenshot to marketing as evidence the feature works",
        ],
        answer: 0,
        ref: "PSF-SDS · dba CWF “Configuring indexing” · “Code, edit and install stored procedures and functions…” (lib/fixtures/rowspec/it.ts:344, 389)",
        distractorNotes: [
          "The fit: the printed tasks on design — indexing configured, procedures coded, and the testing-before-ship attached per the same block's assist-with-testing task.",
          "Key scatter denormalizes the structure into weight — indexing and procedures are the design's instruments, not a load-spread the search's slowness negotiates.",
          "Surge protection on a database server is a hardware fantasy; the slowness's instruments are the structure and its indexing, printed as configured.",
          "Screenshots don't code — the prototype's slowness is the sub-row's shape-up matter, and the procedures' access pattern is the fix.",
        ],
      },
      // Q3 judgment — naming conventions (PSOC 2521 a)
      {
        skill: "Design and develop new database",
        catalogSkill: "↳ CWF sub-row: Design and develop new database",
        stem:
          "A campaign's designer insists every table name carry three emoji and the year's zodiac sign, “so people remember them.”",
        options: [
          "adopt the emoji-plus-zodiac naming — memorable names are a design win the tracker's structure should carry from Monday",
          "follow the printed conventions: the design's structures, tables, dictionaries and naming conventions stay as the house records carry them",
          "rename every table in the tracker as a compromise — half emoji, half house-style, alternating weekly by table order",
          "keep the house names but rename the physical database files after the zodiac signs, as a flattering gesture",
        ],
        answer: 1,
        ref: "PSOC 2521 · a (research/snapshots/psoc/psoc2012-parsed.csv:285) + PSF-SDS · “Maintain data documentation and metadata models” (lib/fixtures/rowspec/it.ts:389)",
        distractorNotes: [
          "Emoji-naming breaks the conventions' continuity — the design's naming conventions exist for the structure's maintainers, and a sticker-driven rename trades them away.",
          "The fit: the unit's data-structures/naming act — conventions the house carries, documented — and stakeholder fondness persuades through the design conversation, not through table names.",
          "Alternating compromise corrupts both styles — the naming conventions select once, and the selection stays documented in the metadata models.",
          "Renaming physical files for a mood is cosmetic confound — the zodiac's place is nowhere in the printed conventions, and the flattering gesture realigns nothing.",
        ],
      },
    ],
  },

  {
    skill: "Optimize database performance",
    catalogSkill: "↳ CWF sub-row: Optimize database performance",
    items: [
      // Q1 recognition — the optimization duties
      {
        skill: "Optimize database performance",
        catalogSkill: "↳ CWF sub-row: Optimize database performance",
        stem:
          "The database-performance section of the role lists its duty set. Which summary matches the listed tasks?",
        options: [
          "ongoing optimisation of database components for availability, reliability, scalability and security; audits and maintenance assisted; activities documented; metrics tracked",
          "a one-and-done tuning pass on go-live day, after which the database's performance freezes and is never revisited again by anyone",
          "examining every query's word count and counting the letters, reporting the longest to compliance",
          "removing the users' passwords so queries run unimpeded by login screens",
        ],
        answer: 0,
        ref: "PSF-SDS · dba CWF “Optimize database performance” key tasks (lib/fixtures/rowspec/it.ts:396)",
        distractorNotes: [
          "The fit: the printed tasks — ongoing optimisation with its four aims, the audits assist, the maintained documentation, the metrics tracked for reporting.",
          "One-and-done is the opposite of ongoing — the duty set prints the cycle as continuous, with audits and maintenance assisted along the way.",
          "Word counts have no query in them — the metrics tracked are performance, utilization, throughput, and capacity, and their names appear in print.",
          "Password removal strips the availability and security the optimization duty explicitly keeps — the sub-row tunes the components' performance, and keeps the access.",
        ],
      },
      // Q2 application — track the metrics in a slow month-end
      {
        skill: "Optimize database performance",
        catalogSkill: "↳ CWF sub-row: Optimize database performance",
        stem:
          "Month-end reports crawl unbearably, and the coordinator demands an answer before she leaves tonight.",
        options: [
          "track the key operational metrics through this month-end — performance, utilization, throughput, capacity — and read the crawl's location before touching any component",
          "delete last month's rows until the crawl lightens, since history reports never come back for anything at all in the building",
          "rename the database so the queries forget their past against the schema",
          "tell finance to run every month-end report manually from the paper records this cycle",
        ],
        answer: 0,
        ref: "PSF-SDS · dba CWF “Track key operational metrics, performance, utilization, throughput and capacity for reporting” (lib/fixtures/rowspec/it.ts:345, 396)",
        distractorNotes: [
          "The fit: the metrics tracking is act one — the crawl's component names itself in capacity or utilization patterns, and the sub-row tracks them as duty.",
          "Deleting last month's rows destroys the report period's source — the optimization's own audit trail is exactly what the crawl needs, and the month-end reports run off it.",
          "Renaming the database renames nothing but the plan's address — the metrics permit the crawl's search, not the schema's wiping.",
          "Manual month-end transfers the workload onto finance for a performance issue — the metrics say where the crawl sits, and the crawl is the desk's work to locate.",
        ],
      },
      // Q3 judgment — document the optimization work performed (CWF's documentation task)
      {
        skill: "Optimize database performance",
        catalogSkill: "↳ CWF sub-row: Optimize database performance",
        stem:
          "Late Thursday you re-index a hot table and the crawl improves. By Friday morning the team's chat asks what changed.",
        options: [
          "maintain the documentation of the conducted optimisation activity — what was re-indexed, on what tables, with which before/after metrics",
          "answer “I tuned things” and rely on the team's memories, since the tuning's details slide off handoffs anyway",
          "keep the change undocumented — undocumented work can't be reverted, and that's the plan's best feature",
          "write the change into marketing's copy calendar so the change gets visibility across departments and vendors",
        ],
        answer: 0,
        ref: "PSF-SDS · dba CWF “Maintain documentation of database optimization activities” (lib/fixtures/rowspec/it.ts:396)",
        distractorNotes: [
          "The fit: the printed documentation task — the change's record carries what, where, and the before/after metric numbers, which is precisely the chat's answer in durable shape.",
          "Vague tuning answers leave the record empty — the documentation task prints the record as maintained, and a chat question is its standard delivery.",
          "Undocumented-for-no-revert is a claim against safety, not a plan — the documentation task exists because the revert and audit lead from the record.",
          "Marketing's calendar holds campaigns, not database deltas — the documentation carries to the operations record, which is where maintenance reads from.",
        ],
      },
    ],
  },

  {
    skill: "Resolve database incidents",
    catalogSkill: "↳ CWF sub-row: Resolve database incidents",
    items: [
      // Q1 recognition — identify/resolve and escalate
      {
        skill: "Resolve database incidents",
        catalogSkill: "↳ CWF sub-row: Resolve database incidents",
        stem:
          "The database incident role section lists its head acts. A tier-1 desk asks what they are:",
        options: [
          "identify and resolve database issues, and escalate unresolved ones per the organization's procedures",
          "identify each incident's cause as a human finger and place their names in the tracker",
          "delete the incident tickets whenever the outage ends, so the record captures the healthy database alone",
          "let incidents run unresolved until the weekend's reboot rolls through and resets everything",
        ],
        answer: 0,
        ref: "PSF-SDS · dba CWF “Identify and resolve database issues” · “Escalate unresolved database issues” (lib/fixtures/rowspec/it.ts:346, 403)",
        distractorNotes: [
          "The fit: the printed pair — identify/resolve, then escalate, with the organization's procedures the incident's adherence task names.",
          "Blame-naming isn't among the printed acts — the incident's object is the database issue, and the record holds the issue's layers, not the culprits' reputations.",
          "Queue-cleaning by deletion destroys the incident's record the adherence task protects — “Ensure adherence to organizational database procedures, policies and protocols” includes the record.",
          "Reboot-away-the-record ignores the issue — identification and resolution is the desk's printed work, and the weekend reboot resolves no locked incident.",
        ],
      },
      // Q2 application — course of action + mitigation (CWF key task 3)
      {
        skill: "Resolve database incidents",
        catalogSkill: "↳ CWF sub-row: Resolve database incidents",
        stem:
          "Enrollment week and grades-table lock-ups block hundreds of students. The registrar's window closes in forty minutes.",
        options: [
          "determine the appropriate course of action — diagnose the lock, mitigate within the window per the procedures, and escalate what resists beyond your capacity",
          "drop the lock tables and move on with the enrollment week — locked tables open better uninvestigated than diagnosed at the window",
          "suspend the enrollment week and accept the registrar's paper punch-cards for the cycle",
          "blame the internet provider in the log as the culprit, since outages are networks' business",
        ],
        answer: 0,
        ref: "PSF-SDS · dba CWF “Determines appropriate course of action for resolving database issues, identify and mitigate risks” (lib/fixtures/rowspec/it.ts:346, 403)",
        distractorNotes: [
          "The fit: the printed act — course-of-action determined, mitigations inside the window, escalation with the risks identified where the desk's capacity ends.",
          "Drop-the-locks resolves nothing — the lock's diagnosis is the course-of-action act's first line, and dropping it hides the cause inside the incident.",
          "Punch-cards suspend the enrollment week — mitigation keeps the window's operation running per the procedures, and paper shuffles the outage's cost to students on top.",
          "The provider's blame is a network statement about a database lock — the diagnosis identifies as printed, and the mis-naming commerce sends the ticket nowhere.",
        ],
      },
      // Q3 judgment — procedure adherence (the fourth printed task)
      {
        skill: "Resolve database incidents",
        catalogSkill: "↳ CWF sub-row: Resolve database incidents",
        stem:
          "The lock's root cause is a vendor-suggested hotfix applied by a well-meaning teammate outside the change procedure, without any record.",
        options: [
          "record the hotfix as it stands in the incident record, and route the procedure violation through the change process so fixes stay under the organization's database procedures",
          "remove the hotfix silently and reapply it on Friday, hoping the recorder doesn't notice the second pass",
          "keep the hotfix undocumented — undocumented fixes save the week's paperwork and resolve anyway",
          "pause the procedure's existence for vendor hotfixes, since vendor work arrives pre-adhered by the seniority of the vendor's people in the field",
        ],
        answer: 0,
        ref: "PSF-SDS · dba CWF “Ensure adherence to organizational database procedures, policies and protocols” (lib/fixtures/rowspec/it.ts:403)",
        distractorNotes: [
          "The fit: the adherence task — the fix's presence recorded and the procedure's step restored, so the vendor hotfixes stay within the change discipline as well.",
          "Friday-removal-then-reapply is a procedural concealment — adherence is restored by record and process, not by timing the observer out.",
          "Undocumented fixes pass without audit and unrecord the change — the adherence discipline's object is precisely the record of what touched the database.",
          "Vendor pre-adherence is fiction — hotfixes ride the organization's procedures regardless of whose paper trail they come in behind.",
        ],
      },
    ],
  },

  {
    skill: "Database security controls",
    catalogSkill: "Database security controls",
    items: [
      // Q1 recognition — privilege and integrity controls
      {
        skill: "Database security controls",
        catalogSkill: "Database security controls",
        stem:
          "The database-security card lists three key tasks: implement security and integrity controls, control privileges and permissions, and adhere to information security policies in all tasks. A quarter of that card holds:",
        options: [
          "privileges and permissions controlled per layer of the database's users, the integrity controls implemented, and the house's information securities carried into every task",
          "placing all of the users' passwords in one shared spreadsheet, updated quarterly by the audit team for the whole floor's convenience",
          "whiteboard drawings of the ER diagram outline taped to the training room's window all quarter",
          "an annual nap among the policy pages",
        ],
        answer: 0,
        ref: "PSF-SDS · dba Database security controls key tasks (lib/fixtures/rowspec/it.ts:353–354)",
        distractorNotes: [
          "The fit: the card's three printed tasks walked — the privilege layer, the integrity controls, and the security policies' adherence spread across every task.",
          "A shared password spreadsheet is the integrity controls' breach itself — the printed privilege task controls through layers, not through circulated secrets.",
          "ER-diagram drawings belong to design sessions — the card's three tasks are the security side, and the security act never prints inside whiteboarding.",
          "Policy naps are credit-claiming — the adherence task is active adherence within the tasks, not background breathing.",
        ],
      },
      // Q2 application — least privilege per need
      {
        skill: "Database security controls",
        catalogSkill: "Database security controls",
        stem:
          "Three interns need to read the tables behind the registrar's public directory and must never see the grades tables.",
        options: [
          "implement exactly the privileges and permissions the directory tables' reading needs, and nothing past that — the printed control's own line",
          "grant full admin access to the three for the learning opportunity, since admins learn the joys of systems with the widest reach",
          "set up one generic login they all share, rotated monthly, because fewer logins mean fewer passwords to remember",
          "pin the connection string to the group chat, since the interns' messages delete fast anyway",
        ],
        answer: 0,
        ref: "PSF-SDS · dba CWF “Control privileges and permissions to database users” (lib/fixtures/rowspec/it.ts:354)",
        distractorNotes: [
          "The fit: the privilege-control act scoped exactly — the read privileges the directory tables' need, printed plain.",
          "Full admin to interns grants beyond any need and violates every privilege layer the printed control draws — the learning surface follows the scope, not the whole server.",
          "One shared generic login multiplies three users into one unrecoverable identity — the printed privilege-control act runs per user.",
          "A group-chat connection string hands the classes to every message's sunset — the security policies' adherence spans every task, including git-coded messages.",
        ],
      },
      // Q3 judgment — policy adherence in all tasks
      {
        skill: "Database security controls",
        catalogSkill: "Database security controls",
        stem:
          "A consultant visiting offers to reproduce the registrar's data on his analytics laptop for the weekend's demo, citing his own NDA-protected laptop drive.",
        options: [
          "adhere to the installed information security policies in this task — reproduce nothing that the access and usage procedures didn't authorize, and route the request through the data-usage procedure",
          "hand the consultant the database dump since the weekend ends by Monday anyway, and his NDA covers the drive",
          "trade the consultant a password for a weekend olive basket, since generosity is the office's own currency",
          "reproduce the grades tables only for the weekend, since the directory tables are safe and the grades are the sensitive's — well, other way around, probably",
        ],
        answer: 0,
        ref: "PSF-SDS · dba CWF “Adhere to information security policies, procedures and protocols in all tasks” (lib/fixtures/rowspec/it.ts:354)",
        distractorNotes: [
          "The fit: the printed adherence — the task stays inside the policies, and the reproduction request routes through the data-usage procedures the card names in its third task.",
          "Weekend dumps degrade into the consultant's drive — access and usage policies govern data movement, and “by Monday anyway” is a risk no procedure signs.",
          "A password traded for a basket is corruption dressed as charm — the privilege task controls access through procedures, not gifts.",
          "Half-reproduction is still unprocedured reproduction — the printed third task is across ALL tasks and tables, and grades sits deepest inside the policy's object.",
        ],
      },
    ],
  },

  {
    skill: "Data Engineering",
    catalogSkill: "Data Engineering",
    items: [
      // Q1 recognition — the pipeline FSC's span
      {
        skill: "Data Engineering",
        catalogSkill: "Data Engineering",
        stem:
          "The data-engineering card lists: “Develop and implement efficient and stable processes to collect, store, extract, transform, load and integrate data at various stages in the data pipeline… preparing data in a structure that is easily accessed and analyzed according to business requirements.” A junior on the flow asks what the card's acts are.",
        options: [
          "the pipeline's acts: collect, store, extract, transform, load, integrate — with prepared structures built for easy access and analysis",
          "the charts' colors and shapes, so the dashboards look polished before anyone reads",
          "typing each record twice, once in the input and once in the output, so the pipeline doubles its integrity",
          "recruiting the analysts who will read the pipelines' answers",
        ],
        answer: 0,
        ref: "PSF-SDS · dba Data Engineering FSC L2 descriptor (lib/fixtures/rowspec/it.ts:360)",
        distractorNotes: [
          "The fit: the descriptor's own verb set — collect through integrate, with prepared data structures per the easy-access and analysis end.",
          "Chart cosmetics are visualization's act — the pipeline's prints run to the data's processes, not to the drawings downstream.",
          "Double-typing is a manual redundancy, not stable processes — the printed acts implement efficient and stable pipelines, which obsolete the manual pass.",
          "Analyst recruiting sits in HR — the card's verbs are processes for data, and the analysts arrive already hired.",
        ],
      },
      // Q2 application — verify the entered data per the standards (overview anchor)
      {
        skill: "Data Engineering",
        catalogSkill: "Data Engineering",
        stem:
          "The morning data feeds wake up late and the dashboard analysts are grumbling. Two vendors' files arrive in formats the load script does not recognize.",
        options: [
          "verify the feeds' data per the standards and requirements before the load — unrecognized formats transform per the pipeline's design",
          "load the unrecognized files raw and see the dashboards' blues turn red by the lunch meeting, evidence included",
          "ask the analysts to hold their reports one week until the vendors learn to format their own files",
          "hand-load each vendor's file into the DBMS by hand each morning while the script stays unaware",
        ],
        answer: 0,
        ref: "PSF-SDS · dba Data Engineering overview “responsible for verifying all data to be entered into the database meets set standards and requirements” (lib/fixtures/rowspec/it.ts:361)",
        distractorNotes: [
          "The fit: the printed verification — feeds per standards and requirements, checked before entering the database, with the transformation stage the pipeline's design carries for mismatched formats.",
          "Raw-load promise corrupts every consuming dashboard by lunch — the verification the overview prints exists against exactly this temptation.",
          "Week-suspension waits past every feeding morning — the transform stage exists for the format's mismatch, and the load script handles it as its design.",
          "Hand-loading is the pipeline's bypass, not its fix — the stable processes print for designed transformations, not for the load being done by hand.",
        ],
      },
      // Q3 judgment — pipeline stability under pressure (FSC's "stable" quality)
      {
        skill: "Data Engineering",
        catalogSkill: "Data Engineering",
        stem:
          "Leadership asks the data team to skip validation on the quarterly numbers entirely so the executive deck ships tonight.",
        options: [
          "hold validation to the pipeline's design — the stable process makes the numbers reportable, and its skip belongs in the deck's risk conversation",
          "skip validation this once and note it in the record as a one-off, on the reasoning the executives' answers came sooner",
          "validate tomorrow and unload the numbers tonight, saying the validation runs in parallel on a rolling belief",
          "delete the validation stage from the pipeline forever — executives need speed, and the need shapes the pipeline",
        ],
        answer: 0,
        ref: "PSF-SDS · dba Data Engineering FSC L2 descriptor “efficient and stable processes… at various stages in the data pipeline” (lib/fixtures/rowspec/it.ts:360)",
        distractorNotes: [
          "The fit: stability is not a mood — the pipeline's process holds, and the deck's speed question belongs to the report's risk conversation, which the validation's record carries.",
          "The one-off skip is the pipeline's stability broken on the exact data the executives see — risks traded for cleverness, in the record's own language.",
          "Parallel validation that unloads tonight is a promise, not a stage — the pipeline's process is what makes the numbers reportable, and a belief in a future pass doesn't.",
          "Permanent stage deletion unbuilds the design — the pipeline's own reliability demands its verification at the stages it was built for.",
        ],
      },
    ],
  },

  {
    skill: "Data Migration",
    catalogSkill: "Data Migration",
    items: [
      // Q1 recognition — the migration FSC's object
      {
        skill: "Data Migration",
        catalogSkill: "Data Migration",
        stem:
          "The migration FSC lists: “Plan and perform activities to migrate data between computer storage types or file formats.” A junior asks what a migration's plan holds.",
        options: [
          "the mapped moves — the data's storage types and file formats planned against its schema, with the migration performed and verified",
          "firewall rules, so the data's migration passes without the security's inspection of any of the records",
          "the marketing slogan for the new system's arrival",
          "nobody's plan — the data migrates itself through the swap, and the FSC watches",
        ],
        answer: 0,
        ref: "PSF-SDS · dba Data Migration FSC L3 descriptor, kept secondary per the ladder (lib/fixtures/rowspec/it.ts:365)",
        distractorNotes: [
          "The fit: the descriptor's own subjects — plan the moves between storage types and formats, perform the activities, verify the migrated data.",
          "Firewalls are the security layer's question, not the migration plan's subject — the printed plan's object is the data's own move.",
          "Marketing slogans travel with go-lives — the FSC's print plans data moves, and slogans appear not an act.",
          "Auto-migration is fiction — the FSC prints plan-and-perform activities, and the plan's holding hands are the desk's.",
        ],
      },
      // Q2 application — move the schemas/data safely (CWF anchor + the row)
      {
        skill: "Data Migration",
        catalogSkill: "Data Migration",
        stem:
          "The old grading system's records must pour into the new one next weekend.",
        options: [
          "assist in the upgrade per the CWF's task — map the old schema to the new, move the records, and verify every row landed before either system retires",
          "copy the drive, rename the folder, and declare the whole thing migrated, noting the mapping lives inside the drive anyway",
          "e-mail every teacher the export and ask them to type their own students back in",
          "retire the old system Thursday and hope the new one remembers what to recall",
        ],
        answer: 0,
        ref: "PSF-SDS · dba CWF “Assist in upgrades of databases, new structures or elements” + Data Migration FSC (lib/fixtures/rowspec/it.ts:366, 365)",
        distractorNotes: [
          "The fit: the assist task against upgrades' structures — schema mapped, data moved, and the rows' landing verified before either system retires.",
          "Drive-copy-and-rename is file management theater — the migration's plan moves data per the mapped schema, and the folder's name proves nothing.",
          "Human-typing migrates errors into every student field — the records' verified landing is what the migration's activities perform.",
          "Hope is not a migration step — the records' mapped, moved, and verified path is the plan the FSC prints.",
        ],
      },
      // Q3 judgment — migration record policy (PSOC 2521 d)
      {
        skill: "Data Migration",
        catalogSkill: "Data Migration",
        stem:
          "Your migration succeeded with two tables merged and one deprecated field dropped. The client's data-protection officer asks what changed underneath the grades.",
        options: [
          "develop and implement the data administration policy's documentation piece — the mapping record, the merged tables, the dropped field, in the migration's living record",
          "tell the DPO the grades live in one database and that's the entire answer",
          "delete the migration's mapping record now that both systems retired, so the paper trail matches the estate's tidy new shape",
          "declare the migration undocumented by policy — the data's protection officer deals with the people, not the schema's stories",
        ],
        answer: 0,
        ref: "PSOC 2521 · d (research/snapshots/psoc/psoc2012-parsed.csv:285)",
        distractorNotes: [
          "The fit: 2521 d)'s documentation act — the migration's administration policy carries the mapping and the changes as living records, which is precisely the DPO's question's answer.",
          "One-database is a location, not a change description — the schema's stories are the record the DPO's data-protection questions run on.",
          "Deleting the mapping record erases the very documentation the DPO's request seeks — and the paper trail's conservation is the policy's instrument.",
          "The undocumented claim misstates both the policy and the record — the migration's documentation is on the desk to make, and the DPO's request is its trigger.",
        ],
      },
    ],
  },

  {
    skill: "Problem Management",
    catalogSkill: "Problem Management",
    items: [
      // Q1 recognition — the FSC lifecycle's aims
      {
        skill: "Problem Management",
        catalogSkill: "Problem Management",
        stem:
          "The problem-manage FSC lists: “Manage the lifecycle of problems to prevent problems and incidents from occurring, eliminate recurring incidents, and minimize the impact of unavoidable incidents.” What does the lifecycle's preventing act look like?",
        options: [
          "finding the repeat incidents' cause and working it until it stops recurring, so prevention and elimination ride the management",
          "hiring a night guard to protect the database from incidents' ghosts",
          "wishing each incident away, since the lifecycle's mood attracts hope more reliably than schedules",
          "renaming every incident into the 'known' category so the incident count drops for the report",
        ],
        answer: 0,
        ref: "PSF-SDS · dba Problem Management FSC L3 descriptor (lib/fixtures/rowspec/it.ts:375)",
        distractorNotes: [
          "The fit: the descriptor's preventing-and-eliminating acts — the recurrence's cause found and worked to its end, and the management's lifecycle accomplishes the preventing.",
          "Night guards are burlesque — the FSC's problems-act is the lifecycle's detective work, not perimeter security.",
          "Hope is latency, not prevention — the lifecycle manages by diagnosis and closure, and moods solve neither.",
          "Renaming incidents miscounts — the FSC's elimination act targets recurrence, and a count's relabel is the opposite of working it.",
        ],
      },
      // Q2 application — recurring DB outage diagnosis
      {
        skill: "Problem Management",
        catalogSkill: "Problem Management",
        stem:
          "The same database outage has returned four Fridays straight, each time ending on a restart that nobody logged.",
        options: [
          "diagnose the recurring root cause across the four Fridays' records, work the course of action per the printed act, and close the incident once the cause dies",
          "schedule a fifth restart and warn users with a Friday notice each week saying the outage may grace the calendar again",
          "call the Fridays unlucky and relabel the schedule's name to Monday",
          "remove the database's incident record entirely so the recurrence metaphysically ceases",
        ],
        answer: 0,
        ref: "PSF-SDS · dba CWF “Determines appropriate course of action for resolving database issues, identify and mitigate risks” + Problem Management FSC (lib/fixtures/rowspec/it.ts:375–376)",
        distractorNotes: [
          "The fit: the printed course-of-action against the cause's pattern — the four Fridays' records diagnosed, the action worked, and the recurrence closed when the cause stops.",
          "A fifth restart repeats the un-rooted cycle — the FSC's elimination act exists for exactly this kind of pattern, and the restart works against it.",
          "Relabeling shifts the name and keeps the outage — the recurring incident's elimination is found in the root cause, not on a calendar.",
          "Deleting the record hides an active recurrence — the management's record exists precisely for the recurrence's paper trail.",
        ],
      },
      // Q3 judgment — prevention's design pass
      {
        skill: "Problem Management",
        catalogSkill: "Problem Management",
        stem:
          "Your diagnosis lands: the outage's root cause is a low-disk trigger the monitoring never covers. Leadership asks how the Friday pattern dies.",
        options: [
          "close the recurrence with the monitoring change — the disk trigger covered, the lifecycle's prevention act makes the pattern's future a non-event, and the record shows the closure",
          "warn the Fridays in advance through a calendar reminder chain — prevention as scheduling forewarning, with the triggers still continuing under it",
          "deploy a junior intern to watch the disk on each Friday's late hours as the pattern's designated guardian",
          "accept the incident as fated — data outages are weather, and weather cares nothing about monitoring",
        ],
        answer: 0,
        ref: "PSF-SDS · dba Problem Management FSC L3 descriptor (lib/fixtures/rowspec/it.ts:375)",
        distractorNotes: [
          "The fit: the prevention act — the monitoring covers the trigger, the recurrence dies at the source, and the closure rides the record.",
          "Reminder-chains forewarn against a pattern that still recurs — the FSC's preventing act works the cause, and forewarning keeps the outage's footsteps.",
          "Intern-guardians are staffing theater — prevention is designed into the monitoring, and the disk trigger's coverage replaces the watcher.",
          "Fate-talk exits the prevention's own instrument — the lifecycle's aim is exactly that such patterns' futures become non-events.",
        ],
      },
    ],
  },

  // ════════════ wave 2 · cybersec · Security Analyst (roster 2.7) ═══════════
  // Anchors: O*NET 15-1212.00 (research/onet-enrich/pulls/15-1212.00.tasks.json),
  // PSOC 2523 lettered lines (research/snapshots/psoc/psoc2012-parsed.csv:287),
  // PSF-SDS verbatim quotes in lib/fixtures/rowspec/it.ts (lines 414–451).
  {
    skill: "Threat analysis / monitoring",
    catalogSkill: "Threat analysis / monitoring",
    items: [
      // Q1 recognition — the monitoring assist scope (PSF Security Analyst overview)
      {
        skill: "Threat analysis / monitoring",
        catalogSkill: "Threat analysis / monitoring",
        stem:
          "Your SOC's role card lists: “The Security Analyst… conducts basic security tasks to assist in monitoring, access control, vulnerability testing, and security incident response,” under close supervision. What fills the monitoring slice?",
        options: [
          "monitor the security tools and systems, identify threats, anomalies and events, and log the review and analysis of what the tools surface",
          "write the company's next three-year cybersecurity strategy alone and present it personally to the board every quarter",
          "negotiate the firewall vendor's renewal price on the transit-day window",
          "redact the security team's calendar so nothing about the SOC shows publicly",
        ],
        answer: 0,
        ref: "PSF-SDS · cybersec Security Analyst overview + responsibilities bullet “Monitor security tools…” + CWF “Log review and analysis” (lib/fixtures/rowspec/it.ts:416–419)",
        distractorNotes: [
          "The fit: the printed monitoring slice — tools and systems monitored, threats and anomalies identified for escalation, and the log review-and-analysis carried out, as the card's basic tasks name.",
          "Board strategy is a CISO act — the analyst's card says basic tasks under close supervision, and strategy sits nowhere on it.",
          "Vendor negotiation is procurement's window; the monitoring slice runs through the tools' surfaces, not the sellers'.",
          "Calendar redaction protects nobody's queue — the monitoring task's output is the identified threats and the analysis log, both of which need daylight to escalate.",
        ],
      },
      // Q2 application — correlate events for escalation (PSOC 2523 g + O*NET 5316)
      {
        skill: "Threat analysis / monitoring",
        catalogSkill: "Threat analysis / monitoring",
        stem:
          "Two thousand alerts stacked overnight. The CSV export shows a large share clustered on one host per the same three alert types, repeating every nine minutes.",
        options: [
          "escalate the queue to the CEO so the alert ceiling becomes a budget line",
          "monitor the tools' daily reports — the host's clustering and the nine-minute interval get read, correlated, and risen per the monitoring duties",
          "acknowledge all two thousand as reviewed and file the CSV export as the day's performance record for the floor",
          "report to the supervisor that the SOC's tooling is broken and the day's alerts are nothing anyway",
        ],
        answer: 1,
        ref: "PSOC 2523 · g (research/snapshots/psoc/psoc2012-parsed.csv:287) + PSF-SDS · cybersec CWF “Log review and analysis” · “Track security events and incidents” (lib/fixtures/rowspec/it.ts:418–419)",
        distractorNotes: [
          "The CEO escalation assigns the queue's load to a decoy — the monitoring act runs by reading the tools' reports and correlating, not by shipping the stack upward unexamined.",
          "The fit: the monitoring act's duties — the daily reports read per the printed task, the pattern's clustering and interval correlated, and the tracked events carried forward for escalation.",
          "Acknowledged-but-unread alerts corrupt the queue's record — the review-and-analysis task is the actual reading, and the batch-ack tells the next stack nothing.",
          "A tooling complaint without the read is a wish — the monitoring act's job is precisely the search through the stacked alerts for the pattern's truth.",
        ],
      },
      // Q3 judgment — escalate within the SLA (CWF "Identify and escalate")
      {
        skill: "Threat analysis / monitoring",
        catalogSkill: "Threat analysis / monitoring",
        stem:
          "Friday, 4:55 p.m. The clustered host's alerts turn from suspicious runs to one confirmed write-transaction outside the host's known behaviors. The escalation SLA for high-priority events names one hour.",
        options: [
          "identify the event as high-priority and escalate it within the SLA's hour, per the CWF's identify-and-escalate act, even at the shift's edge",
          "hold the event until Monday's desk hours — the weekend is a personal evening, and a write-transaction's read can wait",
          "escalate the whole day's two thousand alerts at once, saying the priority is the volume's and the hour is for all of them",
          "delete the event records on Friday and re-run the detection Monday, saying weekends are a fresh detection anyway",
        ],
        answer: 0,
        ref: "PSF-SDS · cybersec CWF “Identify and escalate high-priority threats and anomalies within established service-level agreements” (lib/fixtures/rowspec/it.ts:439)",
        distractorNotes: [
          "The fit: the printed escalation act — identification, priority, escalation inside the SLA's hour — and Friday's edge is where the discipline is proven, not excused.",
          "Weekend holding breaks the SLA the CWF names — the write-transaction's anomaly never got its hour, and Monday's desk finds the trail changed beyond the weekend's reading.",
          "Volume's priority is not the event's — the act identifies high-priority threats and escalates those within the SLA, not every alert in one batch-throw.",
          "Deleting Friday's records is the ESC bundle's honesty inverted — the escalated event's record travels with the escalation, and erasing it conceals the trail.",
        ],
      },
    ],
  },

  {
    skill: "Network administration & maintenance",
    catalogSkill: "Network administration & maintenance",
    items: [
      // Q1 recognition — the network-security duty's scope (PSF FSC L3)
      {
        skill: "Network administration & maintenance",
        catalogSkill: "Network administration & maintenance",
        stem:
          "Your SOC onboarding card lists the network FSC at your rung: “Design and configure network systems to ensure the integrity of network infrastructure through the use of appropriate protection, detection, and response mechanisms.” What is the analyst's work inside that list?",
        options: [
          "the integrity side understood and assisted — the network's segments, the PDR mechanisms, and the analyst's assist in implementing them per specification",
          "re-architecting the enterprise network from scratch whenever an alert confuses you",
          "shutting down every share of the network when a red flag shows, secure-barring everything indefinitely and calling it defense",
          "swearing the network's size between 100 and 200 hosts since nobody ever measures it",
        ],
        answer: 0,
        ref: "PSF-SDS · cybersec Network administration & maintenance FSC description (lib/fixtures/rowspec/it.ts:431)",
        distractorNotes: [
          "The fit: the printed integrity route — the analyst knows the network's segments and the PDR mechanisms, and the assist side is implementing them per specification.",
          "Scratch re-architecture is a network-engineering act, not the analyst's — the FSC's work ensures integrity through mechanisms, and a rebuild destroys the very integrity it claims.",
          "Shut-everything-down denies the users' network for every alert — the PDR mechanisms' response is sized and specified, never thrown wholesale.",
          "Invented host counts void the architecture knowledge the FSC asks for — the network's understanding begins with its real size and segments.",
        ],
      },
      // Q2 application — implementing controls per specification
      {
        skill: "Network administration & maintenance",
        catalogSkill: "Network administration & maintenance",
        stem:
          "The security function's spec asks the new branch office's edge to carry a firewall, an IDS, and the SIEM's log feed. Your assist day begins.",
        options: [
          "implement the three controls as the specification carries them — the firewall edge, the IDS in place, and the SIEM feed brought on stack",
          "install the controls one-third of each so the branch stays balanced between firewalls and IDSes by design",
          "skip the SIEM feed — the branch's logs can live on a USB stick in the branch's drawer",
          "tell the branch to do it themselves — network work flows downhill on its own",
        ],
        answer: 0,
        ref: "PSF-SDS · cybersec responsibilities bullet “Assist in implementing technical controls like firewalls, IDS/IPS, and SIEM tools based on specifications” (lib/fixtures/rowspec/it.ts:432)",
        distractorNotes: [
          "The fit: the printed assist act — the technical controls implemented based on the specification, all three, onto the monitoring stack as specified.",
          "Third-of-each-each is balance theater — the specification's three controls are implemented as they are carried, not as fractions nobody wrote.",
          "A drawer USB is not the SIEM's feed — the log source's presence on the monitoring stack is exactly what the specification carries.",
          "Downhill flows are fiction — the assist implementation is the analyst's work, and the branch is where the controls land.",
        ],
      },
      // Q3 judgment — reading an alert against the architecture (PSOC 2523 f-range alert-source architecture read + FSC PDR)
      {
        skill: "Network administration & maintenance",
        catalogSkill: "Network administration & maintenance",
        stem:
          "A block alert fired and LAN traffic is routing strangely through one segment while the rest of the floor hums along normal.",
        options: [
          "read the alert against the network's actual architecture — the segment's paths, its controls, and whether the block sits where the architecture's rules say it sits",
          "conclude the whole LAN is compromised at once and call a company-wide shutdown of every connection, laptop, and switch for the day",
          "assume the alert-reading platform invented the phrase and disable the block rule permanently",
          "tell the floor that strange routing is what LANs do and close the day's reading",
        ],
        answer: 0,
        ref: "PSOC 2523 · f, g (research/snapshots/psoc/psoc2012-parsed.csv:287) + PSF-SDS · cybersec FSC description PDR mechanisms (lib/fixtures/rowspec/it.ts:431)",
        distractorNotes: [
          "The fit: the network's architecture understood per the role's own what — and an alert is read with the segment's paths, its controls, and the architecture's rules in front of the reader.",
          "One strange segment does not unmake the whole LAN — the architecture-level read distinguishes the segment's behavior from the floor's normal state, and a shutdown punishes the un-affected.",
          "Disabling the rule because the platform phrased it curiously silences the detection layer — the block's rule exists precisely so the read happens against it, not around it.",
          "Strange-routing-as-normal eliminates the read entirely — the network's integrity assurance runs on noticing the strange, per the protection-detection-response print.",
        ],
      },
    ],
  },

  {
    skill: "Vulnerability assessment support",
    catalogSkill: "Vulnerability assessment support (VAPT analyst track)",
    items: [
      // Q1 recognition — the VAPT assist scope
      {
        skill: "Vulnerability assessment support",
        catalogSkill: "Vulnerability assessment support (VAPT analyst track)",
        stem:
          "The vulnerability-management card lists its assist acts: “Perform vulnerability scans · Conduct basic penetration testing · Support remediation process.” What does the card's scope give a junior's day?",
        options: [
          "perform the scans, run the basic penetration tests, and support the remediation's follow-through — each act inside the printed card's names",
          "deface a test site to test the scanner's sense of humor",
          "manage the entire CISO's risk register and answer to the audit trail for each of its lines, single-handed and unassisted",
          "sell the vulnerability scanners' vendor licenses on the side",
        ],
        answer: 0,
        ref: "PSF-SDS · cybersec CWF “Vulnerability Management Assistance” key tasks (lib/fixtures/rowspec/it.ts:439)",
        distractorNotes: [
          "The fit: the printed card's acts walked — scans performed, basic pen-tests conducted, remediation supported, all within the card's own names.",
          "Test-site defacement is an unhired act — the card's basic pen-test runs per method and scope, not per joke disguise.",
          "A risk register is the CISO's instrument — the analyst's card covers the scans, the basic tests, and their remediation's support, and the register sits above that.",
          "Vendor license-selling is sales work — the card's three acts test and support, and nothing among them sells anything.",
        ],
      },
      // Q2 application — scan the assets per the scope
      {
        skill: "Vulnerability assessment support",
        catalogSkill: "Vulnerability assessment support (VAPT analyst track)",
        stem:
          "Your scanning Tuesday arrives with a fresh asset list. The senior's listed assignment says scan the whole list, report to quality's guidelines, and escalate the high-priority findings within their SLA.",
        options: [
          "perform the scans per the day's assignment, with every finding reported per the quality guidelines and the high-priority's escalated within its SLA",
          "scan whichever assets happened to boot fastest, since the scanning day ends at four and speed reads as initiative",
          "escalate everything the scanner shows as soon as the tool lists it, including the informational icons",
          "hand the raw scanner output to the client's mail room unopened, since the tool's words are the truth anyway",
        ],
        answer: 0,
        ref: "PSF-SDS · cybersec CWF “Perform vulnerability scans” · “Submit vulnerability assessment reports as per quality guidelines” · “Identify and escalate high-priority…” (lib/fixtures/rowspec/it.ts:439)",
        distractorNotes: [
          "The fit: the printed acts against the day's assignment — scans run, the report submitted per the quality guidelines, and the high-priority findings escalated within their SLA.",
          "Bootspeed scans duck the printed assignment — the whole asset list is the scope, and the day's quality of scanning is not measured in hours avoided.",
          "Escalating every informational icon flattens the priority the printed escalation act names — identification-and-escalation runs on the high-priority band, which needs a read before the send.",
          "Raw output straight to the client skips the report submission — the printed act files the finding per the guidelines, and the mail room is nobody's SLA-holder.",
        ],
      },
      // Q3 judgment — remediation support under a patch conflict
      {
        skill: "Vulnerability assessment support",
        catalogSkill: "Vulnerability assessment support (VAPT analyst track)",
        stem:
          "One high-priority finding's fix is a patch the library's owner refuses until next quarter, citing her code's unreleased state.",
        options: [
          "support the remediation's follow-through as printed — the finding's risk carried by the SLA's escalation path and the timeline's decision in the remediation record",
          "uninstall her library behind her back over the weekend, since the finding's risk outranks her unrelease",
          "close the finding as accepted-forever and delete the record — the library's owner is the verifier, and her refusal closes the loop",
          "patch the library tonight unverified and report the finding as fixed, since the scanner's next run will honor the patch by its new name",
        ],
        answer: 0,
        ref: "PSF-SDS · cybersec CWF “Support remediation process” · “Identify and escalate high-priority threats… within established service-level agreements” (lib/fixtures/rowspec/it.ts:439)",
        distractorNotes: [
          "The fit: the support-remediation act — the risk carried through the escalation path with the timeline decision visible in the record, and the process stays honest for the pair.",
          "Weekend uninstallation reaches past the printed support act — the remediation process is supported under supervision, not executed alone against the owner's schedule.",
          "Close-as-accepted-forever makes the SLA void at one signature — the escalation act exists for exactly the high-priority band, and the finding rides through the remediation record.",
          "Unverified-patch-toward-fixed fakes the remediation record — the finding's fix needs the scanner's verification per the report's guidelines, not a name-call.",
        ],
      },
    ],
  },

  // ════════════════ wave 2 · webdev · Web Developer (roster 2.8) ════════════
  // Anchors: O*NET 15-1254.00 (research/onet-enrich/pulls/15-1254.00.tasks{,.p2,.p3}.json),
  // PSF-SDS swd FSC for the agile row (lib/fixtures/rowspec/it.ts lines 497–503).
  {
    skill: "Client-side coding",
    catalogSkill: "Client-side coding (HTML/CSS/JS)",
    items: [
      // Q1 recognition — what supporting code means (O*NET 14707)
      {
        skill: "Client-side coding",
        catalogSkill: "Client-side coding (HTML/CSS/JS)",
        stem:
          "The O*NET task list's top verb: “Write supporting code for Web applications or Web sites.” On a small-business site build, what does that verb hold for you?",
        options: [
          "write the page's supporting code — the markup, styles, and scripts the site's features run on — as the build's own technical work",
          "print the site's screenshots and frame them for the shop's wall as the only technical record it needs",
          "buy the domain, hosting, and a shower gift for the shop owner's wedding",
          "write the site's return-and-refund policy in the shop owner's voice",
        ],
        answer: 0,
        ref: "O*NET 15-1254.00 · task 14707 (research/onet-enrich/pulls/15-1254.00.tasks.json)",
        distractorNotes: [
          "The fit: the task's verb taken as itself — supporting code written, the site's client-side work delivered.",
          "Framed screenshots decorate; the verb writes code — and the site's features run on the written thing, not the printed one.",
          "Domain, hosting, and gifting are procurement and social acts — the verb's object is the code, and none of the site's pixels arrive from a purchase order.",
          "Policy writing is the shop's document — the supporting-code verb produces the site's technical layer, and the refund's voice stays in the owner's hands.",
        ],
      },
      // Q2 application — evaluate code for validity and compatibility (O*NET 14700)
      {
        skill: "Client-side coding",
        catalogSkill: "Client-side coding (HTML/CSS/JS)",
        stem:
          "The shop's product page collapses on small phones and works fine on your laptop's browser.",
        options: [
          "evaluate the code against standards and rendering across browsers and devices, then adjust the markup and styles",
          "tell the shop's customers to buy larger phones, since the market's trends favor the bigger anyway",
          "ship a PDF version of the page and link it from a pinned footer note",
          "delete the page's mobile route so the collapse can't recur — an absent page never breaks",
        ],
        answer: 0,
        ref: "O*NET 15-1254.00 · task 14700 (research/onet-enrich/pulls/15-1254.00.tasks.json)",
        distractorNotes: [
          "The fit: 14700's evaluate act — code checked for validity, structure, standards, and compatibility across browsers and devices, then fixed at the markup and styles.",
          "Deflecting to the customers' phones inverts the compatibility check — the code is what fails across the devices, and the task names the code's evaluation.",
          "A PDF stand-in abandons the page's own layer — the site's product page exists as markup and styles, and a print-format fallback is the fix's escape, not the fix.",
          "Deleting a route hides the collapse by amputation — the task's verb is evaluate-and-standards, not removing the device class the site owes rendering.",
        ],
      },
      // Q3 judgment — code changes under a launch's pressure (O*NET 14710 + 14700)
      {
        skill: "Client-side coding",
        catalogSkill: "Client-side coding (HTML/CSS/JS)",
        stem:
          "Launch week. A teammate's last-minute change to the checkout's button spinner touched three other pages' shared stylesheet, and the client calls wanting tomorrow's launch to show something.",
        options: [
          "evaluate the shared stylesheet's touched code first — the site's remaining pages checked for the change's reach — and then commit the launch with verified pages",
          "launch as-is and let the client's own first visit reveal what the teammate's change's reach did across the site's shared pages",
          "revert every teammate's change from the whole week and launch last Friday's site instead",
          "tell the teammate's spinner change is their problem alone and launch",
        ],
        answer: 0,
        ref: "O*NET 15-1254.00 · tasks 14710 + 14700 (research/onet-enrich/pulls/15-1254.00.tasks.json)",
        distractorNotes: [
          "The fit: the two printed acts in their order — testing after revision, and the code's evaluation against validity and compatibility — and the launch's client-standard rides the verification.",
          "The client's visit as the test plan breaks the site's first impression — the revised pages are checked before the launch's own appointment, per the printed schedule.",
          "Reverting a week discards verified work to fix one stylesheet — the evaluation acts on the touched shared code, not on the week's total.",
          "One teammate's change is the site's shared layer — the stylesheet's reach is the checker's business, and the launch is the owner's.",
        ],
      },
    ],
  },

  {
    skill: "Site life-operations",
    catalogSkill: "↳ task-cluster sub-row: site life-operations",
    items: [
      // Q1 recognition — the cluster's verbs
      {
        skill: "Site life-operations",
        catalogSkill: "↳ task-cluster sub-row: site life-operations",
        stem:
          "The site-operations role section gathers the O*NET verbs into one role. Which nightly-and-annual rhythm matches them?",
        options: [
          "test after revisions, update the content, back up the site's files, renew the domain registration, recommend performance improvements",
          "redesign the whole site from scratch each quarter so the content never feels stale to the returning visitor",
          "keep the domain unregistered — nobody's claimed it, so the parking page is permanent",
          "delete backups after every successful launch, so the drive's room stays clean for the next one",
        ],
        answer: 0,
        ref: "O*NET 15-1254.00 · tasks 14710, 14695, 14698, 14705, 14719 (research/onet-enrich/pulls/15-1254.00.tasks.json) + task-cluster sub-row anchors (lib/fixtures/rowspec/it.ts:467)",
        distractorNotes: [
          "The fit: the five verbs as printed — tests after revisions, updates performed, files backed up, domains renewed, and performance improvements recommended and implemented.",
          "Quarterly redesigns discard the site's maintained state — the cluster's verbs maintain, update, and test, and the redesign is none of them.",
          "An unclaimed domain parks forever — renewal is the cluster's printed act, and the registration's lapse is exactly what the verbs prevent.",
          "Deleting recovery backups unbuys “instant recovery in case of problems” — the backup verb's carrying purpose is the problem's next appearance.",
        ],
      },
      // Q2 application — test after revisions (O*NET 14710)
      {
        skill: "Site life-operations",
        catalogSkill: "↳ task-cluster sub-row: site life-operations",
        stem:
          "The client sends their tenth copy-edit round for the bakery site, each round touching the home page's copy and one product's description.",
        options: [
          "publish each round's edits straight away, unchecked, to save the hours the testing takes",
          "perform the site tests after each revision per the printed schedule's rule — revised pages checked before the updates go live",
          "tell the client the tenth round is beyond the free budget and publish every batch unedited since the second",
          "stop accepting copy edits and rewrite the home page yourself in the bakery's voice",
        ],
        answer: 1,
        ref: "O*NET 15-1254.00 · task 14710 (research/onet-enrich/pulls/15-1254.00.tasks.json)",
        distractorNotes: [
          "Unchecked publishing invites the broken page straight to the customers — the printed verb runs tests after every revision, ten times or twice.",
          "The fit: tests per the planned schedules or after any revision — each round's edited pages pass their check before the content goes live.",
          "Free-budget cutoffs are the commercial layer's invention — the cluster's rule is tests-after-revisions regardless of the round's number.",
          "Rewriting the home page in your own voice overwrites the client's — the operations row maintains the site the client owns, revisions included.",
        ],
      },
      // Q3 judgment — performance improvements: recommend then implement (O*NET 14719)
      {
        skill: "Site life-operations",
        catalogSkill: "↳ task-cluster sub-row: site life-operations",
        stem:
          "The shop's product pages load in nine seconds and the analytics show carts abandoned mid-load. The hosting budget is fixed this quarter.",
        options: [
          "recommend the performance improvements the evidence supports — the heavy images compressed, the scripts trimmed — and implement what the budget carries",
          "install a bigger hosting plan on the company's own card and surprise the owner with the invoice at each month's end",
          "remove the products' images entirely so the page's load drops below two seconds",
          "tell the analyst the carts' abandonment is seasonal weather and the hosting is fine",
        ],
        answer: 0,
        ref: "O*NET 15-1254.00 · task 14719 (research/onet-enrich/pulls/15-1254.00.tasks.json)",
        distractorNotes: [
          "The fit: the verb's own two acts — recommend per the evidence, implement per the budget's reality — and the quarter's fixed plan is the implementation's frame.",
          "Surprise invoices bypass the budget's owner — the improvements' recommendation goes through the evidence and the plan, not the card swipe.",
          "Images-removed fixes the load by emptying the shop — the customer sees everything but the products, and the improvement was never implemented as the verb intends.",
          "Seasonal-weather claims file an abandonment the analytics already explain — the verb recommends by evidence, and the evidence shows the load's nine seconds.",
        ],
      },
    ],
  },

  {
    skill: "CMS administration",
    catalogSkill: "CMS administration (WordPress etc.)",
    items: [
      // Q1 recognition — content structure/themes/plugins/hosting
      {
        skill: "CMS administration",
        catalogSkill: "CMS administration (WordPress etc.)",
        stem:
          "The school hands its WordPress site over on Friday. Per the O*NET task that anchors the role (“Design, build, or maintain Web sites, using authoring or scripting languages, content creation tools, management tools, and digital media”), running this site involves:",
        options: [
          "keeping the content structured, the themes and plugins managed, and the hosting sound — the content tool operated as its home",
          "rewriting the school's site as a hand-typed static page collection, built over one locked weekend",
          "posting only the notices that reach your desk first, in whatever order they arrive each day",
          "removing every user account so nothing can ever break in",
        ],
        answer: 0,
        ref: "O*NET 15-1254.00 · task 14694, the content-creation/management-tools clause (research/onet-enrich/pulls/15-1254.00.tasks.json) + row anchors (lib/fixtures/rowspec/it.ts:475–476)",
        distractorNotes: [
          "The fit: the clause's tools put the content's structure, themes, plugins, and hosting under the site's maintainership — the CMS run as the row's own home.",
          "Static-hand-typed unbuilds the school's CMS — the management tools exist so the school runs its site structured, and the weekend rewrite discards them.",
          "First-arrivals posting is unstructured by definition — the clause's content-creation tools exist to give the content order and schedule.",
          "User-removal kills the school's editors — the site's maintainership keeps the people who post working, with the site's roles managed rather than emptied.",
        ],
      },
      // Q2 application — analyze user needs toward structure (O*NET 14702)
      {
        skill: "CMS administration",
        catalogSkill: "CMS administration (WordPress etc.)",
        stem:
          "The school's registrar asks you to bring the enrollment page's downloads, dates, and forms into one findable place before enrollment week.",
        options: [
          "analyze the registrar's needs and set up the content's structure — one downloads hub with the forms and dates organized as the enrollment's own path",
          "delete the old pages' links and let the staff discover the site's new shape on their own",
          "print the forms' pages and staple them to the registrar's filing cabinet, since staples are always findable",
          "hand the registrar the admin password and their choice of the content's fragmenting, on the grounds they know their needs",
        ],
        answer: 0,
        ref: "O*NET 15-1254.00 · task 14702 (research/onet-enrich/pulls/15-1254.00.tasks.json)",
        distractorNotes: [
          "The fit: 14702's needs-analysis act — the registrar's stated needs analyzed and the content's structure built around them, in the CMS's own tools.",
          "Deleted links are discovery-by-loss — the structure's purpose is that enrollment week's findability, and the old links' removal without a hub leaves both enrolls drifting.",
          "Staples to a cabinet escape the CMS — the enrollment page's findable hub is a content-structure act, and the cabinet holds paper, not the site.",
          "Password handover unmanages the management — the needs-analysis act runs from the registrar's brief to the structure's build, all done for and with them.",
        ],
      },
      // Q3 judgment — plugin/theme update discipline
      {
        skill: "CMS administration",
        catalogSkill: "CMS administration (WordPress etc.)",
        stem:
          "A plugin's update promises speed fixes but changes database table behavior. The update button glows over Friday's close.",
        options: [
          "keep the site's instant-recovery backup current, test the update against the school's staging copy, then update live once the changes check out",
          "update the live site directly at Friday's close, hoping Monday's traffic shows no surprises from the tables",
          "decline every plugin update forever, since unchanging plugins never surprise",
          "ask the plugins' vendor to pay for the update's timing so the school's calm is bought",
        ],
        answer: 0,
        ref: "O*NET 15-1254.00 · task 14698, “Back up files… for instant recovery in case of problems” + task 14710 (research/onet-enrich/pulls/15-1254.00.tasks.json)",
        distractorNotes: [
          "The fit: the printed backup-for-instant-recovery act plus the test-after-revision rule — the update's staging check precedes the live press, and the recovery path stays current.",
          "Friday-close live updates send Monday's traffic into the change untested — the site's recovery backup and the staging check are exactly what the close-before-update order wants.",
          "Eternal decline does not administer — the plugins' upkeep is the CMS's own maintain work, and each update's behavior is checked, not ghosted.",
          "Vendor-bought timing transfers the site's discipline to someone else's wallet — the site's updates happen on its own schedule's evidence, and nobody else's payment finds them.",
        ],
      },
    ],
  },

  {
    skill: "Responsive/UI basics + a11y",
    catalogSkill: "Responsive/UI basics + accessibility",
    items: [
      // Q1 recognition — accessibility as a design-plan consideration (O*NET 21684)
      {
        skill: "Responsive/UI basics + a11y",
        catalogSkill: "Responsive/UI basics + accessibility",
        stem:
          "The design-plans task the role draws from reads: “Incorporate technical considerations into Web site design plans, such as budgets, equipment, performance requirements, and legal issues including accessibility and privacy.” What does that mean for a page you plan?",
        options: [
          "the plan carries its technical considerations — performance requirements and the accessibility-and-privacy issues included — as design decisions from the start",
          "accessibility waits for the site's audience to complain first, since the complaints are data no design plan ever precedes at all",
          "legal issues belong to the client's lawyers' calendar, and design arrives afterwards whatever they might say",
          "performance requirements appear on the invoice only, since the audience's patience is free",
        ],
        answer: 0,
        ref: "O*NET 15-1254.00 · task 21684 (research/onet-enrich/pulls/15-1254.00.tasks.p3.json) + row anchors (lib/fixtures/rowspec/it.ts:483–484)",
        distractorNotes: [
          "The fit: the task's own clause — the plan's technical considerations carry the performance requirements and the accessibility-and-privacy issues as design-time decisions.",
          "Complaint-first means the design plan never held its own consideration — the legal issues including accessibility are named in the design plans themselves, before any audience arrives.",
          "Lawyers' calendars receive the lawyering; the design plan carries the considerations' translation into the page's decisions, and they arrive before the counsel's letters.",
          "Performance requirements are the plan's named item — invoices don't carry patience, and the page's load is a design consideration, not a fee.",
        ],
      },
      // Q2 application — the screen reader's page (O*NET 21684 + task 14700)
      {
        skill: "Responsive/UI basics + a11y",
        catalogSkill: "Responsive/UI basics + accessibility",
        stem:
          "A low-vision student opens your school's enrollment page with a screen reader and the buttons read “u7 box” out loud, then nothing.",
        options: [
          "fix the markup's semantics — buttons named in accessible labels, the structure marked so the reader walks it — and check the render across devices",
          "print a phone number where the buttons should be so the student can call the front desk for the forms",
          "ship the page as-is — the student's reader is a specialist device, and the page speaks however the browser exports its text",
          "delete every interactive element until nothing can break",
        ],
        answer: 0,
        ref: "O*NET 15-1254.00 · task 21684 + task 14700 (research/onet-enrich/pulls/15-1254.00.tasks.json) + row anchors (lib/fixtures/rowspec/it.ts:483–484)",
        distractorNotes: [
          "The fit: the designer's markup held to the accessibility issue and the code structure standards — labeled controls and a structure the screen reader can walk, checked across devices.",
          "A printed number substitutes telephony for the enrollment page — the buttons' accessible labels are the fix the markup carries, not a phone call's detour.",
          "Specialist devices are still the page's audience — the accessibility issue is a design-plan consideration per the print, and the page's markup is what makes the reader walk it.",
          "Deletion of interactive elements shrinks the page to an announcement — accessibility carried in the design is the enrollment's workable page, not a handout.",
        ],
      },
      // Q3 judgment — documenting the device/technical factors
      {
        skill: "Responsive/UI basics + a11y",
        catalogSkill: "Responsive/UI basics + accessibility",
        stem:
          "The client asks what phones and browsers their audience actually hits the site with, calling it “a survey nobody buys.”",
        options: [
          "document the technical factors the audience's visits carry — browser and device types per the analytics, plus the performance load's shape.",
          "refuse the documentation — devices change weekly and the record's age is an entire month by Thursday anyway",
          "declare the low-vision readers a rounding error — their visits vanish next to the analytics' main frame anyway",
          "send the analytics to the client's rival as a courtesy, since everyone's audience rhymes eventually",
        ],
        answer: 0,
        ref: "O*NET 15-1254.00 · task 14728, “Document technical factors such as server load, bandwidth, database performance, and browser and device types” (research/onet-enrich/pulls/15-1254.00.tasks.p2.json)",
        distractorNotes: [
          "The fit: the printed documentation act — browser and device types are among the technical factors documented for the design plans' active carrying.",
          "Records age but the documentation's refresh is the act — a month's decay argues the record's rhythm, not its dismissal.",
          "Rounding-error talk declassifies the audience's reader share — the accessibility issue is the design plan's named consideration, and the readers' visits are evidence.",
          "Rival-mailing is a data-protection breach — the documentation's client is the client, and the audience's analytics travel nowhere without the consent of the client's record.",
        ],
      },
    ],
  },

  {
    skill: "Version control (git)",
    catalogSkill: "Version control (git)",
    items: [
      // Q1 recognition — code-quality control (O*NET 14700)
      {
        skill: "Version control (git)",
        catalogSkill: "Version control (git)",
        stem:
          "Two teammates touch the same file all weekend. The role's anchor task asks that the code be evaluated — valid, structured, standards met, compatible across browsers, devices, and operating systems. What keeps the teamwork safe per that role?",
        options: [
          "the code's evaluation discipline working from the version-controlled source — commits small, branches organized, merges reviewed against standards",
          "one shared spreadsheet with hand-typed change notes, each note vouched for by its writer's own word of office honor",
          "emailing the work's files around as attachments, with names like final_v3_final (this one works).zip",
          "midnight pushes straight to the live site, since the site's visitors are the testers nobody pays",
        ],
        answer: 0,
        ref: "O*NET 15-1254.00 · task 14700 (research/onet-enrich/pulls/15-1254.00.tasks.json) + the catalog row's own “Team-safe code management” (lib/fixtures/catalog.ts)",
        distractorNotes: [
          "The fit: the code-evaluation verb combined with the row's team-safe management — commits, branches, and reviewed merges are the standards' rides.",
          "Spreadsheet notes with vouches are a parallel record no code tool reads — the evaluation runs on versioned history, and the spreadsheet's truth is its writer's word.",
          "Attachment chains embody the version-control failure — the file's history scatters through inboxes while the merge's conflicts carry no review.",
          "Midnight pushes unreview the changes — the standards' evaluation rides the merge review, not the site's midnight visitors' findings.",
        ],
      },
      // Q2 application — the merge under conflict
      {
        skill: "Version control (git)",
        catalogSkill: "Version control (git)",
        stem:
          "Sunday evening. Your teammate's branch and your own both changed the checkout's total calculation, and the merge flag pops a conflict.",
        options: [
          "evaluate both sides' changed code together — the conflict's resolution reviewed as a merge per the discipline, with the failing piece's history readable in the versions",
          "force-push your version so the branch's own truth hits the live history first",
          "email the file around and let the last sender's version win, on a first-to-noon policy",
          "delete both branches and retype the checkout's calculation from memory on Monday, since the versions' history reads confusing",
        ],
        answer: 0,
        ref: "O*NET 15-1254.00 · task 14700 (research/onet-enrich/pulls/15-1254.00.tasks.json)",
        distractorNotes: [
          "The fit: the evaluation act over both sides' code — the conflict resolved on reviewed comparison, with the versions' own history as the readable tool.",
          "Force-push overwrites the teammate's branch — the shared history exists so both sides' code is evaluated, not so force replaced the peer's truth.",
          "Attachment-chains double the conflict — the versioned tool resolves on the code's actual edits, and noon-policy yields to nobody's evaluation.",
          "Retyped-from-memory discards both branches' real work — the versions exist so neither side's history is destroyed, and the merge review is the instrument's own proceed.",
        ],
      },
      // Q3 judgment — standards-violation on the shared branch
      {
        skill: "Version control (git)",
        catalogSkill: "Version control (git)",
        stem:
          "A teammate's merge passed the review but the site's browser test shows one validator's flag nobody looked at, ranking the stylesheet's rules invalid per the standards.",
        options: [
          "evaluate the flagged rules against the standards, fix what's genuinely invalid, and record the validator's rule for the next reviews — the discipline's read beats the sign-off's word",
          "honour the sign-off — the reviewers certified the merge, and a flag that appears afterwards is the reviewer's own problem to fire or keep",
          "unreview everyone's past merges in a Friday session so the review discipline's name is cleared",
          "disable the validator so the flags stop ranking invalid against the standards",
        ],
        answer: 0,
        ref: "O*NET 15-1254.00 · task 14700 (research/onet-enrich/pulls/15-1254.00.tasks.json)",
        distractorNotes: [
          "The fit: the evaluation verb — standards' rule validated against the flagged rules, fixed, and the validator carried forward into the review's next rounds.",
          "Sign-offs certify at their moments; the code's validity is the evaluation's own object — a flag's appearance afterwards remains the merge's business to fix.",
          "Mass unreviews are review theater — the flagged merge is the evaluation's focus, and Friday's clearance session evaluates nothing.",
          "Validator-disable converts finding into suppression — the standards' evaluation is the verb's own subject, and silencing the tool abandons the verb.",
        ],
      },
    ],
  },

  {
    skill: "Agile (agency-run)",
    catalogSkill: "Agile Software Development (when agency-run)",
    items: [
      // Q1 recognition — sprint contents (PSF FSC + O*NET confer task)
      {
        skill: "Agile (agency-run)",
        catalogSkill: "Agile Software Development (when agency-run)",
        stem:
          "The client's agency builds in two-week sprints. What does a web-developer's week inside one hold per the agile practice and its O*NET side task (“Confer with management or development teams to prioritize needs, resolve conflicts…”)?",
        options: [
          "the sprint's cycle worked — daily stand-ups, the built slice, and the review's confer with the agency's team per the client's priorities",
          "a lone build sprint with no reviews, since the client's voice arrives at the invoice anyway",
          "reserving the stand-ups for overtime negotiation, since the ceremonies' names are whatever the calendar's holder decides",
          "waiting quietly for one giant spec to arrive at the sprint's end, since waiting is the internal construction's politest act",
        ],
        answer: 0,
        ref: "PSF-SDS · swd Agile FSC L3 descriptor (lib/fixtures/rowspec/it.ts:46) + O*NET 15-1254.00 · task 14697 (research/onet-enrich/pulls/15-1254.00.tasks.json)",
        distractorNotes: [
          "The fit: the sprint's cycle worked per the practice — the stand-up's cadence, the built slice per iteration, and the confer act done with the teams per the printed task.",
          "Unreviewed digs skip the iteration's own close — the practice's review is the built slice's proven check, and the invoice arrives cleaner for the review's work.",
          "Ceremonies' names belong to the practice's shape — the stand-up's conference is what it does, and the overtime's negotiation is the one topic the calendar's cadence refuses.",
          "A giant spec at the end inverts the iteration — the practice's adaptive method delivers the slice's increments, and the end-of-sprint spec dumps the iteration's whole idea.",
        ],
      },
      // Q2 application — mid-sprint prioritization (O*NET 14697)
      {
        skill: "Agile (agency-run)",
        catalogSkill: "Agile Software Development (when agency-run)",
        stem:
          "Day 4 of the sprint. The client's marketing manager e-mails: “while we're in here, drop the seasonal banner next to the checkout — today, for the campaign.”",
        options: [
          "log the ask, confer with the agency's development team on where it sits against the sprint's priorities, and place the banner per the agreed ordering",
          "build the banner immediately — the client speaks, and the development team's plans bow to the campaign's cadence",
          "reply “no future changes until the next contract,” and record the campaign as refused-by-default",
          "build the banner quietly and tell the sprint board it was already scoped",
        ],
        answer: 0,
        ref: "O*NET 15-1254.00 · task 14697 (research/onet-enrich/pulls/15-1254.00.tasks.json)",
        distractorNotes: [
          "The fit: the confer act — needs prioritized with the agency's development team, and the banner's place decided per the agreed ordering.",
          "Immediate builds skip the prioritization conference — the agent's print asks for needs prioritized and conflicts resolved, not for a bower building.",
          "A blanket no does the refusing the print's confer act resolves — the change's place is a team conversation, and the future's contract has no such flat rule.",
          "Quietly-built banner with a scoped claim corrupts the sprint's record — changes either surface per the plan's ordering or they wait, and the board carries truth either way.",
        ],
      },
      // Q3 judgment — practice kept while pressure rises (O*NET 14701)
      {
        skill: "Agile (agency-run)",
        catalogSkill: "Agile Software Development (when agency-run)",
        stem:
          "The agency's sprint reviews keep slipping — twice postponed this month by the account lead. The client's team stops preparing theirs.",
        options: [
          "carry the practice's cadence honestly — the review happens at its cycle's close per the sprint's own contract, and slipping reviews get named in the retro and fixed there",
          "accept the reviews' slipping as the agency's seniority, and prepare nothing further on the client's side of the desk",
          "hold the reviews always on Fridays only, since the calendar's last day makes the recaps feel conclusive",
          "skip the practice's ceremonies until the account lead rediscovers the calendar, adapting the sprint's shape to the slippage pattern",
        ],
        answer: 0,
        ref: "PSF-SDS · swd Agile FSC L3 descriptor “adaptive and iterative methods… continuous evolution” (lib/fixtures/rowspec/it.ts:46) + O*NET 15-1254.00 · task 14701 (research/onet-enrich/pulls/15-1254.00.tasks.json)",
        distractorNotes: [
          "The fit: the practice's cadence carried — reviews at the cycle's close, slippages named in the retro's own loop, and the client's side kept preparing.",
          "Seniority-tolerance does not carry the practice — the sprint's review is the client's visibility, and the account lead's preference is the retro's conversation to fix, not the practice's silent erosion.",
          "Friday-only-forever is a calendar superstition, not the practice — the review's cadence belongs to the cycle's closes, not to the workweek's last name.",
          "Skipping ceremonies until the calendar's rediscovery unbuilds the iteration — the adaptive practice fixes its cadence in the retro, never by its abandonment.",
        ],
      },
    ],
  },

  // ═══════════ wave 2 · digart · Digital / Multimedia Artist (roster 2.9) ═══
  // Anchors: TESDA VGD NC III unit descriptors/elements + PSF-DAA counterpart notes
  // (lib/fixtures/rowspec/it.ts lines 506–567), PSOC 2166 lettered lines
  // (research/snapshots/psoc/psoc2012-parsed.csv:241). Per DIG-V5, full verbatim
  // element tables exist on disk only for the logo unit; other units' items anchor
  // to their on-disk descriptor quotes and PSOC 2166 letters.
  {
    skill: "Logo design (visual design/communication)",
    catalogSkill: "DEVELOP DESIGNS FOR A LOGO (ICT216313)",
    items: [
      // Q1 recognition — the unit descriptor
      {
        skill: "Logo design (visual design/communication)",
        catalogSkill: "DEVELOP DESIGNS FOR A LOGO (ICT216313)",
        stem:
          "The TESDA unit descriptor reads: “…incorporate the principles of visual design and communication into the development of designs for a logo for use in various industries.” What does logo design mean under that list?",
        options: [
          "the mark developed with the principles of visual design and communication worked into it, made to hold across the industries' varied uses",
          "the client's initials in whatever font was trending on TV last night",
          "a famous existing logo, recolored overnight, since the industry's collective eyes are trained on the familiar marks",
          "the logo at one fixed size, printed without any test of how it holds when scaled",
        ],
        answer: 0,
        ref: "TESDA VGD NC III · logo unit descriptor verbatim (lib/fixtures/rowspec/it.ts:508)",
        distractorNotes: [
          "The fit: the unit's own wording — the principles incorporated into the development, and “use in various industries” meaning the mark must hold across uses.",
          "Trending-font initials skip the design principles entirely — the descriptor's object is the principles worked into the development, and initials in a popular font are a default, not a design.",
          "Recoloring a famous mark copies it — the incorporate-act develops original design, and another brand's located mark is infringement, not inspiration.",
          "One fixed size skips the test every varied industry imposes — the descriptor's object is a mark that works in its uses, and scaling is the first of those.",
        ],
      },
      // Q2 application — the element table's five steps, verbatim walk
      {
        skill: "Logo design (visual design/communication)",
        catalogSkill: "DEVELOP DESIGNS FOR A LOGO (ICT216313)",
        stem:
          "A startup's e-mail arrives: “We need a mark, something green, the investors' meeting is Friday.” Per the briefing element's steps:",
        options: [
          "read and analyze the brief's instructions, identify the desired outcome's objective, note what research the concepts need, confirm the submission-and-approval process, and raise the essential questions with the client",
          "sketch three green marks tonight and e-mail them before reading anything else",
          "forward the brief to a stock site's template catalog, since the investors' browser opens templates fastest",
          "tell the client the questions must wait until the design is fully drafted, since drafting clarifies everything the brief left out on its own, questions included personally",
        ],
        answer: 0,
        ref: "TESDA VGD NC III · logo unit element 1.1–1.5 verbatim (lib/fixtures/rowspec/it.ts:510)",
        distractorNotes: [
          "The fit: the element's five steps walked — instructions read and analyzed (1.1), objectives identified (1.2), research needs identified (1.3), the submission process confirmed (1.4), questions liaised (1.5).",
          "Immediate sketches skip the read-and-analyze step — the element's order puts the brief's instructions and objectives before any drawing exists.",
          "A template forward outsources the development — the element identifies information needed via research to develop concepts, and a stock-pick is not research conducted.",
          "Draft-first-clarify inverts the liaising element — the essential questions are asked while the brief is open, so the drafting has its answer before the marks exist.",
        ],
      },
      // Q3 judgment — the approval step survives pressure (element 1.4)
      {
        skill: "Logo design (visual design/communication)",
        catalogSkill: "DEVELOP DESIGNS FOR A LOGO (ICT216313)",
        stem:
          "Mid-week the client writes: “Skip the approval round. Print from your last sketch Friday and bill it — the investors are waiting.”",
        options: [
          "confirm the submission-and-approval steps with the client and/or a supervisor as the element prints — the design submitted for approval and production following the yes",
          "print from the last sketch Friday and bill as asked anyway — the investors' long wait is reason enough to skip the approval round",
          "hold the artwork hostage until the invoice clears, so the approval and the payment arrive together",
          "send the last sketch straight to the investors themselves for approval, since they wait on it anyway",
        ],
        answer: 0,
        ref: "TESDA VGD NC III · logo unit element 1.4 verbatim (lib/fixtures/rowspec/it.ts:510)",
        distractorNotes: [
          "The fit: element 1.4 verbatim — “Process and steps of submission of logo design for approval is confirmed with the client and/or a supervisor” — and production follows that confirmation, not the calendar.",
          "Print-and-bill skips the confirmation the element prints — the investors' wait is a schedule pressure, and the design's approval path is exactly what the element exists to protect.",
          "Artwork-for-payment collapses two separate gates — the design's approval runs through its process, and billing terms are a different conversation held on different paper.",
          "The investors approve nothing directly — the element's confirmed process names the client and/or supervisor as the approving hands, and the investors' wait never substitutes for them.",
        ],
      },
    ],
  },

  {
    skill: "Print media design",
    catalogSkill: "DEVELOP DESIGNS FOR PRINT MEDIA (ICT216314)",
    items: [
      // Q1 recognition — the descriptor's medium list
      {
        skill: "Print media design",
        catalogSkill: "DEVELOP DESIGNS FOR PRINT MEDIA (ICT216314)",
        stem:
          "The TESDA unit descriptor reads: “…conceptualize and design for posters, tarpaulin, magazine, brochures, invitation and other kinds of design intended for listed material output or format for personal, industrial and commercial use.” The unit's object:",
        options: [
          "designs conceptualized for printed output — each piece's size, material, and printing reality carried into the design's making",
          "a single digital wallpaper sized for the client's desktop, with print treated as the screenshot's cousin",
          "the client's mood board pinned to the studio wall, since the concept's feel precedes every design",
          "one design stretched across every medium, since the print audience reads them all the same",
        ],
        answer: 0,
        ref: "TESDA VGD NC III · print-media unit descriptor verbatim (lib/fixtures/rowspec/it.ts:516)",
        distractorNotes: [
          "The fit: the descriptor's printed object — designs for printed material output, conceptualized as the piece's own medium carries it.",
          "A desktop wallpaper is a screen piece — the unit's object is printed output, and the screen's cousin never prints cleanly at any of the named sizes.",
          "Mood boards feed concepts; the unit's deliverable is the designed printed piece — the concept's feel is a stage inside the work, not the work.",
          "One stretched design ignores the listed mediums' differences — posters, tarpaulin, magazine, and brochures each carry their own size, material, and viewing distance.",
        ],
      },
      // Q2 application — two pieces, two realities (PSOC 2166 d + descriptor)
      {
        skill: "Print media design",
        catalogSkill: "DEVELOP DESIGNS FOR PRINT MEDIA (ICT216314)",
        stem:
          "Launch week: the client needs a 2×1 m tarpaulin for the event gate and a magazine spread for the campaign, both by Friday.",
        options: [
          "prepare the sketches and layouts each piece's medium demands — the tarpaulin's distance-readable layout for outdoor viewing, the spread's page-size layout with bleed and margin for the magazine",
          "design the phone screen first and let the pieces' print crops follow the screen's art unconsidered",
          "stretch the phone-screen artwork across both and tell the print shop to center-crop whatever loses",
          "print both pieces at home on the office's A4 printer paper and recolor the pieces at the venue, since the venue's eyes give instant feedback on everything",
        ],
        answer: 0,
        ref: "PSOC 2166 · d (research/snapshots/psoc/psoc2012-parsed.csv:241) + TESDA print-media unit descriptor (lib/fixtures/rowspec/it.ts:516)",
        distractorNotes: [
          "The fit: PSOC 2166 d)'s sketches-and-layouts act, weighted per piece — the gate's viewing distance and the spread's page geometry are each the design's own input.",
          "Screen-first leaves the crops to chance — the printed pieces take their own sizes, and the screen's art doesn't crop itself well at the gate or the spine.",
          "Center-crop-by-shop substitutes machine loss for design — the layouts reach the shop solved; a stretched artwork is the design's failure sharing the blame with the shop.",
          "Home-paper-and-venue-recolor invents production on the day — the printed pieces are designed for their materials and print processes, not improvised outside the shop door.",
        ],
      },
      // Q3 judgment — media selection with functional reality (PSOC 2166 h)
      {
        skill: "Print media design",
        catalogSkill: "DEVELOP DESIGNS FOR PRINT MEDIA (ICT216314)",
        stem:
          "The client's committee falls for the glossy foil finish on the gate tarpaulin. The site gets rained on launch after launch.",
        options: [
          "select or recommend the functional and aesthetic materials with the conditions consulted — the rain's reality heard, and the committee's gloss offered where it serves",
          "use the committee's glossy pick without ever mentioning the rain at all — the receipts will argue later if the surface fades",
          "refuse the committee's input and print to your own standards, since design sense outranks client taste",
          "print the gate design at the office A4 printer and mount it in the gate's frames",
        ],
        answer: 0,
        ref: "PSOC 2166 · h (research/snapshots/psoc/psoc2012-parsed.csv:241)",
        distractorNotes: [
          "The fit: PSOC 2166 h)'s selection-or-recommendation act — materials and media chosen with the piece's functional conditions consulted, and the committee's aesthetic given its honest place.",
          "Silent-use hides the functional truth until the fading arrives — the selection act consults the conditions, and the fading is a known reality the rain guarantees.",
          "Overruling the committee ends the consultation — the recommendation's act carries the conditions to the client, and their taste is answered with evidence, not overruled by rank.",
          "Office-A4 chain-printing replaces every consulted medium — the tarpaulin's material and scale are design decisions made in the studio, and the gate's frame carries neither printer nor office.",
        ],
      },
    ],
  },

  {
    skill: "User experience design",
    catalogSkill: "DEVELOP DESIGNS FOR USER EXPERIENCE (ICT216315)",
    items: [
      // Q1 recognition — the descriptor
      {
        skill: "User experience design",
        catalogSkill: "DEVELOP DESIGNS FOR USER EXPERIENCE (ICT216315)",
        stem:
          "The TESDA unit descriptor names the unit's object verbatim: “…development of designs for user experience.” A new hire asks what the UX unit works on.",
        options: [
          "the designs that shape how a user's experience of the product moves — the journey itself is the designed thing",
          "brightening the colors until any confusion fades on its own",
          "pop-up tips on every button explaining each button's purpose aloud to every visitor",
          "shipping as-is — users always learn eventually",
        ],
        answer: 0,
        ref: "TESDA VGD NC III · UX unit descriptor verbatim (lib/fixtures/rowspec/it.ts:521)",
        distractorNotes: [
          "The fit: the descriptor's own object — designs developed for the user experience, meaning the journey through the product is the designed material.",
          "Brighter colors are decoration applied to a confusion the design never reworked — the UX unit's object is the journey's shape, not the paint over it.",
          "Explanatory pop-ups decorate confusion one button at a time — the UX design takes the whole movement and reworks it, rather than narrating it.",
          "Ship-and-learn discards the unit's whole act — the descriptor's development exists so the experience lands designed, and the users' eventual learning is not a design.",
        ],
      },
      // Q2 application — rework the journey from test feedback (PSOC 2166 b)
      {
        skill: "User experience design",
        catalogSkill: "DEVELOP DESIGNS FOR USER EXPERIENCE (ICT216315)",
        stem:
          "Testers get lost three screens into your checkout; their notes report that the third screen never tells them where their cart is.",
        options: [
          "analyze the testers' findings against the flow's functional requirements, then rework the screens' steps so the cart's state is findable from the first screen onward",
          "brighten the third screen's colors and resubmit, hoping confusion exhausts itself",
          "delete the last two screens entirely, so the losing journey ends earlier for everyone",
          "tell the testers to read the product's user manual first, since lostness is usually the beginner's own error to correct anyway",
        ],
        answer: 0,
        ref: "TESDA VGD NC III · UX unit descriptor (lib/fixtures/rowspec/it.ts:521) + PSOC 2166 · b (research/snapshots/psoc/psoc2012-parsed.csv:241)",
        distractorNotes: [
          "The fit: PSOC 2166 b)'s research-and-analysis act joined to the descriptor's design development — findings analyzed, and the journey reworked from the analysis.",
          "Brightening repaints the confusion's wall — the design's object is the movement through the screens, and the paint changes none of it.",
          "Step-deletion shortens the path without reworking it — the checkout's job is still the finding, and every screen that remains still hides the cart's state.",
          "Manual-first blames the testers for the design's finding — the UX unit's work is done for the testers' experience, and their notes are its input.",
        ],
      },
      // Q3 judgment — negotiating the splash (PSOC 2166 g)
      {
        skill: "User experience design",
        catalogSkill: "DEVELOP DESIGNS FOR USER EXPERIENCE (ICT216315)",
        stem:
          "The client loves an animated splash page. The test data reports it adds eleven seconds before any product appears.",
        options: [
          "negotiate the design solution with the client — the splash's tested cost presented with the data, and a version of the piece that keeps the client's concept inside a flow that serves the campaign",
          "build the splash as loved — the client's early delight outranks eleven seconds of silence",
          "delete the splash quietly and tell the client the animations vanished in file compression",
          "tell the marketing head the splash is technically impossible to build at all, and let the sheer impossibility's claim alone end the whole design request",
        ],
        answer: 0,
        ref: "PSOC 2166 · g (research/snapshots/psoc/psoc2012-parsed.csv:241) + TESDA UX unit descriptor (lib/fixtures/rowspec/it.ts:521)",
        distractorNotes: [
          "The fit: PSOC 2166 g)'s negotiating act — the design solution negotiated with the client, evidence on the table, and the client's concept carried into a workable landing.",
          "Untested delight ships the eleven seconds — the UX unit designs for the user's experience, and the data is exactly what the design's making consults.",
          "Secret deletion undermines the client's trust along the splash — a design solution is negotiated with the client in the room, never by post-hoc fiction.",
          "Impossible-claims are a false wall — the splash is buildable; what the data negotiates is its shape and wait, and the false claim ends a conversation the test's numbers had opened.",
        ],
      },
    ],
  },

  {
    skill: "User interface design",
    catalogSkill: "DEVELOP DESIGNS FOR USER INTERFACE (ICT216316)",
    items: [
      // Q1 recognition — the descriptor
      {
        skill: "User interface design",
        catalogSkill: "DEVELOP DESIGNS FOR USER INTERFACE (ICT216316)",
        stem:
          "The TESDA unit descriptor reads: “…development of designs for USER INTERFACE.” The interface design's work is:",
        options: [
          "developing the designs that arrange a product's controls, layouts, and interactions into one operative experience",
          "replacing every button with an animated graphic so that nothing on screen looks unlaundered",
          "dropping mouse support to simplify the codebase",
          "letting each developer pick their own favorite icons on the live product",
        ],
        answer: 0,
        ref: "TESDA VGD NC III · UI unit descriptor verbatim (lib/fixtures/rowspec/it.ts:526)",
        distractorNotes: [
          "The fit: the descriptor's own act — designs developed for the interface, whose controls, layouts, and interactions are the work's objects.",
          "Buttons-as-graphics are decoration in place of interaction — the UI design develops the operative controls, and animation for animation's sake costs the click.",
          "Mouse-drop simplifies the codebase at the user's expense — the interface design's work covers the interaction entirely, and input support is part of it.",
          "Per-developer favorites unmake one interface — the design's object is the operative whole, set once, not split into five members' taste.",
        ],
      },
      // Q2 application — rework the clumsiness (PSOC 2166 d + descriptor)
      {
        skill: "User interface design",
        catalogSkill: "DEVELOP DESIGNS FOR USER INTERFACE (ICT216316)",
        stem:
          "Your screens look beautiful but feel clumsy to operate; the dev team's logs record each fumble directly.",
        options: [
          "prepare the revised sketches and layouts from the dev team's findings — the controls and interactions reworked so the operating experience itself is designed, not restyled",
          "animate each fumbled button in a fresh interactive graphic, so the eyes are pleased and the hands always keep their entirely own course",
          "falsify the dev logs as keyboard-preference noise, since clumsy is their taste",
          "ship the screens' beauty untouched — the dev team's complaints resolve as the product earns its keep",
        ],
        answer: 0,
        ref: "PSOC 2166 · d (research/snapshots/psoc/psoc2012-parsed.csv:241) + TESDA UI unit descriptor (lib/fixtures/rowspec/it.ts:526)",
        distractorNotes: [
          "The fit: the sketches-and-layouts act applied to the interface's own material — the dev findings read, and the layouts, controls, and interactions reworked.",
          "Animated buttons restyle the fumble's shell — the UI design reworks the operating layout and the interaction, and the glow changes neither.",
          "Falsifying dev logs corrupts the design's own input — the revised layouts are prepared through the findings, and fake findings prepare nothing.",
          "Beauty-untouched keeps every operating flaw — the unit's design development exists for the interface's operative shape, and the product earns its keep through that shape, not instead of it.",
        ],
      },
      // Q3 judgment — detail and document the selected design (PSOC 2166 i)
      {
        skill: "User interface design",
        catalogSkill: "DEVELOP DESIGNS FOR USER INTERFACE (ICT216316)",
        stem:
          "The build's next sprint starts today and needs the interface's exact spec. Two devs keep re-litigating the icon set among themselves.",
        options: [
          "detail and document the selected design — the chosen icon set recorded with the layout's specs — so the sprint builds from the documented pick",
          "let the re-litigation stand; the spec's silence keeps the argument moving and the devs happy",
          "print the spec's sheet with every icon variant included, letting the devs' fingers pick at build time",
          "declare the icon question reopened publicly and wait until the disagreement dies before documenting anything",
        ],
        answer: 0,
        ref: "PSOC 2166 · i (research/snapshots/psoc/psoc2012-parsed.csv:241)",
        distractorNotes: [
          "The fit: PSOC 2166 i)'s detail-and-document act — the selected design documented with its specs, and the sprint runs from the documented form.",
          "Silence-as-fairness keeps the spec unfinished — the documentation's act places the chosen picks on record, and the re-litigation ends where the record does.",
          "Variant-sheet-at-build unbuilds the selection — the developer's fingers make a design decision at build time, and the picker's production is not the design.",
          "Reopened-and-waiting re-opens the sprint's window — the detail-and-document act exists to close selections, not to hand each sprint its own debate.",
        ],
      },
    ],
  },

  {
    skill: "Product packaging design",
    catalogSkill: "DEVELOP DESIGNS FOR PRODUCT PACKAGING (ICT216317)",
    items: [
      // Q1 recognition — the descriptor
      {
        skill: "Product packaging design",
        catalogSkill: "DEVELOP DESIGNS FOR PRODUCT PACKAGING (ICT216317)",
        stem:
          "The TESDA unit descriptor names the unit's object: “…development of designs for product packaging.” What does a packaging design's work cover?",
        options: [
          "the pack's structure and graphics developed together — so the packaging sells on the shelf, ships through the trucks, and stacks on the store's casing",
          "printing the brand name in six languages on the bag's underside",
          "borrowing the warehouse's empty spare carton and labeling it by hand while the campaign's last hoardings dry out",
          "whatever empty box the warehouse has spare that afternoon",
        ],
        answer: 0,
        ref: "TESDA VGD NC III · packaging unit descriptor verbatim (lib/fixtures/rowspec/it.ts:531)",
        distractorNotes: [
          "The fit: the descriptor's own object — the packaging's design developed, structure and graphics both, for the pack's real life.",
          "Six-language underside is decoration without purpose — the packaging design develops the pack's structure and graphics, and an underside sells nothing at the shelf.",
          "Warehouse cartons skip the development — the packaging design's work plans the pack before it exists in anything physically borrowed.",
          "Whatever-is-spare abandons the unit's whole act — the pack is designed to its needs, not scavenged from the shelf of the afternoon.",
        ],
      },
      // Q2 application — the snack bag's both layers
      {
        skill: "Product packaging design",
        catalogSkill: "DEVELOP DESIGNS FOR PRODUCT PACKAGING (ICT216317)",
        stem:
          "A snack brand brings its new bag to the desk: the bag must win the shelf and survive the snack chain's trucks.",
        options: [
          "develop the design across both layers — the graphics that sell on the shelf, and the structure's sizes and folds consulted against the trucks' reality",
          "put a celebrity's face on the bag's front only — the trucks' reality never enters through a face",
          "cut the bag's bottom gusset for aesthetics' sake and let the trucks catch at the seam",
          "reproduce the neighboring brand's bag layout with the snack's own logo, since the shelf's eye already learned the neighbor",
        ],
        answer: 0,
        ref: "TESDA VGD NC III · packaging unit descriptor (lib/fixtures/rowspec/it.ts:531) + TR tool/knowledge line references (it.ts:542–543)",
        distractorNotes: [
          "The fit: the descriptor's two layers together — graphics designed for the shelf, structure designed against the transport's conditions.",
          "Face-only design shelves the front and abandons the pack — the packaging design develops the bag's whole structure, and the trucks' reality enters through the structure's study.",
          "Gusset-cutting breaks the structure at its fold — the pack's format is the design's own layer, and the truck's catch is the cutting's own consequence.",
          "Neighbor's-layout-in-own-logo is a copied pack — the development composes its own design, and a copied layout is a trademark question wearing the client's name.",
        ],
      },
      // Q3 judgment — the both-realities answer (PSOC 2166 h + descriptor)
      {
        skill: "Product packaging design",
        catalogSkill: "DEVELOP DESIGNS FOR PRODUCT PACKAGING (ICT216317)",
        stem:
          "The client loves the new bag's embossed front panel. The test runs tear the embossed panel at its seams on the shelf carts.",
        options: [
          "carry both findings to the client — the emboss's shelf appeal and the seam's tears — and answer with a reworked panel or material selection that keeps the appeal inside a structure the carts pass",
          "move forward with the emboss and call the tear rate the carts' fault, since the client's eyes arrive at shop fronts anyway",
          "rework the panel silently and re-present it as the original's minor polish, since the client's taste stays best served by what they never saw challenged",
          "reject the emboss outright — the bag reverts to the plain face, and the client's taste is a cost the project refuses to carry",
        ],
        answer: 0,
        ref: "TESDA VGD NC III · packaging unit descriptor (lib/fixtures/rowspec/it.ts:531) + PSOC 2166 · h (research/snapshots/psoc/psoc2012-parsed.csv:241)",
        distractorNotes: [
          "The fit: the pack's both realities answered — the emboss's appeal and the tears' structure both heard, with PSOC h)'s material selection act carrying the answer.",
          "Blaming the carts refuses the test's own finding — the tear is the structure's data, and the design's answer works through the structure's material or format.",
          "Silent rework-and-represent fakes continuity — the client's taste is served through the design's consultation, not by what they never saw challenged.",
          "Plain-face rejection replies to the client's whole taste with aborting it — the embossing has an answer in the structure's rework, and the rework is the desk's own work to carry.",
        ],
      },
    ],
  },

  {
    skill: "Booth and window display design",
    catalogSkill: "DESIGN BOOTH AND PRODUCT WINDOW / DISPLAY (ICT216318)",
    items: [
      // Q1 recognition — the descriptor's two acts
      {
        skill: "Booth and window display design",
        catalogSkill: "DESIGN BOOTH AND PRODUCT WINDOW / DISPLAY (ICT216318)",
        stem:
          "The TESDA unit descriptor reads: “…the design and production of booth and product window displays.” The role's two-act object:",
        options: [
          "the display designed AND produced — from the concept through to the display's being built and standing",
          "posters taped onto a borrowed folding table, since the cheapest form makes the display at the launch's edge",
          "renting the biggest available space and designing it after the fair opens, since the crowd's size is the canvas anyway",
          "copying the neighboring booth's design exactly, minus the prices taped on theirs",
        ],
        answer: 0,
        ref: "TESDA VGD NC III · booth/display unit descriptor verbatim (lib/fixtures/rowspec/it.ts:535)",
        distractorNotes: [
          "The fit: the descriptor's two named layers — the display designed and the display produced — both parts of the row's object.",
          "Taped-posters-on-borrowed-folders are scraps, not displays — the row designs and produces a booth's display as its own actual, not at the launch's edge.",
          "Design-after-opening reverses every fair-reaching duty — the space's role is the display's canvas, and the display's production precedes the fair's opening hours.",
          "Neighbor-copies-minus-prices are dishonest displays — the design's own act begins at the client's identity, not at substitution from the next booth.",
        ],
      },
      // Q2 application — the trade fair Friday
      {
        skill: "Booth and window display design",
        catalogSkill: "DESIGN BOOTH AND PRODUCT WINDOW / DISPLAY (ICT216318)",
        stem:
          "The trade fair opens Friday, and the client's booth must stop shoppers mid-aisle by tomorrow.",
        options: [
          "design the booth's display for its space and produce the work that stands in it — both acts of the descriptor carried to the fair's Friday",
          "borrow the neighboring booth's banner for the aisle's evening, since the fair's eyes blur past the opening anyway",
          "rent the larger space and draw out the design while the registrar's setup proceeds next door",
          "keep the booth's design in the client's head and offer to describe it verbally at intervals",
        ],
        answer: 0,
        ref: "TESDA VGD NC III · booth/display unit descriptor verbatim (lib/fixtures/rowspec/it.ts:535)",
        distractorNotes: [
          "The fit: the two-act object — the design made for the space's reality and the production carried through, exactly as the descriptor prints both.",
          "Borrowed banners win neither the client's nor the fair's occasion — the display's act is the booth's own design and production, made for the client's own need.",
          "Renting-and-redesigning later inverts the row's order — the rented space's reality is first known, and the display is designed to it before any opening.",
          "Head-held designs are undelivered work — the booth's display is designed, produced, and standing, all three the row's own task.",
        ],
      },
      // Q3 judgment — production held within the chosen media (PSOC 2166 j)
      {
        skill: "Booth and window display design",
        catalogSkill: "DESIGN BOOTH AND PRODUCT WINDOW / DISPLAY (ICT216318)",
        stem:
          "The client's production vendor offers to hand the booth's woodworking to a cheaper cousin shop, outside the client's contracted production path.",
        options: [
          "carry the production within the chosen media and the client's contracted path — the supervising-or-carrying act is the row's, and the vendor's detour breaches the path's craft",
          "pass the booth's work to the cheaper cousin — the fair's Monday counts savings beyond any contract's letter",
          "break the booth's printed inserts a day before the fair and hope the joinery holds",
          "cancel the booth outright on the cousin's cheaper offer — the fair's product then stands somewhere unnamed inside the crowd of the fair",
        ],
        answer: 0,
        ref: "PSOC 2166 · j (research/snapshots/psoc/psoc2012-parsed.csv:241) + TESDA booth/display unit descriptor (lib/fixtures/rowspec/it.ts:535)",
        distractorNotes: [
          "The fit: PSOC 2166 j)'s supervising-or-carrying production — the booth's display produced within the chosen media and the client's contracted craft path.",
          "The cousin's savings buy outside the engagement — the production follows the contracted path, and a week's cheapness buys unreviewed craft.",
          "Broken-inserts-and-prayer manufactures a display the fair's morning discovers — the production work produces the display, not a hope about it.",
          "Cancellation by the cousin's offer leaves the client without the fair's display — the row's task is the display standing, and it happens through the production row's carrying, not a cancel.",
        ],
      },
    ],
  },

  {
    skill: "Specialized graphic/animation tools",
    catalogSkill: "Use specialized graphic/animation tools (Adobe suite, Blender etc.)",
    items: [
      // Q1 recognition — the tool knowledge lines
      {
        skill: "Specialized graphic/animation tools",
        catalogSkill: "Use specialized graphic/animation tools (Adobe suite, Blender etc.)",
        stem:
          "The unit knowledge lists name “Computer knowledge / software knowledge” with Photoshop-, InDesign-, Illustrator-type entries, and the packaging unit's own Photoshop/Illustrator/Flash-Animate list. What does that make the tools' fluency?",
        options: [
          "the design software's hands-on command — driven until the work's movements flow through the tools' files",
          "a wish-list of the client's tools, learned only on the first paid request that names them",
          "one tool learned deeply and the rest's names memorized only, since depth is the proof of learning",
          "the tools' certificate papers printed and framed, without hands ever at the canvases",
        ],
        answer: 0,
        ref: "TESDA VGD NC III · TR required knowledge lines “Computer knowledge · software knowledge” + named tool lists (lib/fixtures/rowspec/it.ts:540–543)",
        distractorNotes: [
          "The fit: the unit's own software-knowledge line — the design work's tools operated, hands behind the file's movements.",
          "Wish-list learning bargains the unit's required knowledge away — the knowledge lines name the tools on the designer's side, not as a someday-paid request.",
          "One-tool-deep satisfies the unit's slice only — the knowledge lines name the tool family's spread, and memorized names no delivered work ever makes.",
          "Framed certificates are documents, not hands — the software-knowledge print carries the tools' use, and a certificate's weight serves the shelf but not the craft.",
        ],
      },
      // Q2 application — the two-part brief (PSOC 2166 f + tools)
      {
        skill: "Specialized graphic/animation tools",
        catalogSkill: "Use specialized graphic/animation tools (Adobe suite, Blender etc.)",
        stem:
          "The brief wants an animated ad plus list-ready artwork by Friday, and the animation tool on your machine is one you have never operated.",
        options: [
          "drive the learning on the animation tool from Wednesday, and the suite's print instruments handle the artwork — both deliverables made through the tools' production",
          "draw the animation's frames by hand and scan them Tuesday, since the new tool's learning path feels slow",
          "outsource both to the client's teenage nephew, since his toys would carry both anyway",
          "deliver a slideshow of screenshots of a friend's machine running both, since the workflow's evidence is what the client asked to see",
        ],
        answer: 0,
        ref: "PSOC 2166 · f (research/snapshots/psoc/psoc2012-parsed.csv:241) + TESDA tool knowledge lines (lib/fixtures/rowspec/it.ts:542–543)",
        distractorNotes: [
          "The fit: PSOC 2166 f)'s computer-animation act plus the knowledge lines' spread — the tools driven, and the deliverables themselves made by them.",
          "Drawn-and-scanned frames reach neither medium's real production — the tools exist precisely for these, and the hand scan is a substitute the brief never asked for.",
          "Nephew outsourcing hands the desk's work to a toy's owner — the tools' knowledge is the unit's required line, and the nephew's toys are a story no brief buys.",
          "Screenshot-slideshows reveal by proxy only — the brief asks for the work itself, and a friend's machine does nobody's Friday.",
        ],
      },
      // Q3 judgment — real deliverables late, placeholders not
      {
        skill: "Specialized graphic/animation tools",
        catalogSkill: "Use specialized graphic/animation tools (Adobe suite, Blender etc.)",
        stem:
          "Thursday: the list artwork's file is fine, the animated ad's production runs late. The marketing head suggests sending the finished artwork “as a placeholder with a watermark, we just need something today.”",
        options: [
          "answer with the actuals — the real artwork delivered, the animation's true state and production hours stated, and the schedule walked through the tools' work until the ad is whole",
          "watermark the artwork and send it, then fill today's animation slot with whatever preview nobody checks first",
          "stop the work now and bill the head a placeholder fee, protecting the desk's box of patience",
          "screenshot the animation software's opening splash and call it a preview, since the tools' moment of opening suggests the ad's image anyway",
        ],
        answer: 0,
        ref: "PSOC 2166 · d, f (research/snapshots/psoc/psoc2012-parsed.csv:241) + TESDA tool knowledge lines (lib/fixtures/rowspec/it.ts:542–543)",
        distractorNotes: [
          "The fit: the deliverables carried honestly through the design's own tools' production — artwork real, animation's state real, dates plain.",
          "Watermarked-placeholder-sends water what the client asked to hold — the artwork's file is complete, and the animation's slot filled with anything unproduced is fiction at the client's own desk.",
          "Placeholder-billing prices nothing — the desk's production continues, and a fee for an unfilled slot has no file in the client's record to bill against.",
          "Splash-screenshots are not previews of the animation — the tools' opening graphics is nobody's deliverable, and the ad's file waits until the production's own hours carry it.",
        ],
      },
    ],
  },

  {
    skill: "Creative brief + brand guidelines",
    catalogSkill: "Follow creative brief + brand guideline development",
    items: [
      // Q1 recognition — the element loop
      {
        skill: "Creative brief + brand guidelines",
        catalogSkill: "Follow creative brief + brand guideline development",
        stem:
          "The element table's brief-discipline loop lists: read and analyze the brief's instructions; identify the objectives; identify what research the concepts need; confirm the submission/approval process; liaise the essential questions. What does the loop's beginning hold?",
        options: [
          "the client's brief taken in — instructions read and analyzed, the objective identified, the research needs noted, the approval path confirmed, questions raised before any sketch",
          "sketch three options first and ask for the brief later, since sketching reaches the client's taste faster",
          "redesign the client's whole brand from the very first day, since thinking freely across the entire brand beats the brief's printed lines",
          "wait for the brief's expiry, then treat the design's floor as released creative territory",
        ],
        answer: 0,
        ref: "TESDA VGD NC III · element 1.1–1.5 verbatim (lib/fixtures/rowspec/it.ts:510, 550)",
        distractorNotes: [
          "The fit: the element table's five steps — the brief read and analyzed before anything reaches a sketch.",
          "Sketch-first asks the design to precede its own brief — the elements' order exists so the concepts develop on the objectives and the research's identified needs.",
          "Brand-redesign-from-day-one discards the brief's lines — the loop's subject is the client's brief and their brand's guidelines; freelancing the brand is what the brief's orders forbid.",
          "Brief-expiry is invented — the element's loop is the working design round's rhythm, and no creative territory releases because a brief ends.",
        ],
      },
      // Q2 application — both the brief and the brand book read (PSOC 2166 a + element 1.1–1.2)
      {
        skill: "Creative brief + brand guidelines",
        catalogSkill: "Follow creative brief + brand guideline development",
        stem:
          "The client's pack arrives: twelve pages of direction plus a ten-page brand guideline book. The desk's reading order:",
        options: [
          "determine the brief's objectives and constraints by consulting across both the direction and the brand's book — twelve pages and ten pages read as one pack",
          "skim the brand book's pages for colors and dates only, treating the brief's eleven other pages as background noise",
          "skip the brand book and infer the brand's rules from the product's packaging fabric",
          "run both documents through a summarizer's average and redraw the brand's lines from the summary's most common words",
        ],
        answer: 0,
        ref: "PSOC 2166 · a (research/snapshots/psoc/psoc2012-parsed.csv:241) + TESDA element 1.1–1.2 (lib/fixtures/rowspec/it.ts:510, 550)",
        distractorNotes: [
          "The fit: PSOC 2166 a)'s consulting act plus the element's read-and-analyze — the objectives and constraints determined from the pack's full content.",
          "Colors-and-dates skimming reduces ten pages to its palette — the brand book's own constraints carry the design's shape, and the design reads them as they are written.",
          "Fabric inference skips both consult and read — the brief's client directs the design's shape through documents, and fabric guesses ignore the pack entirely.",
          "Summarizer averages are not the reading act — the element's step is the instructions' read-and-analyze, and an averaged summary draws none of the brand's lines.",
        ],
      },
      // Q3 judgment — implied approval asked back (element 1.4 + 1.5)
      {
        skill: "Creative brief + brand guidelines",
        catalogSkill: "Follow creative brief + brand guideline development",
        stem:
          "The deadline passes. The client never ran the approval round. Their message: “consider approval implied, invoice us Thursday.”",
        options: [
          "confirm the submission-and-approval process per the element — the approval stays an explicit step, and the client's implied-approval message asked back in the round's own terms",
          "invoice Thursday as asked and keep the approval's unrun state quiet — the client's own word is the client's own whole responsibility",
          "approve the design yourself and move forward — a passed deadline acts as the acceptance the round was for",
          "post a note on the client's message board declaring the approval granted, since the silence means the design has landed",
        ],
        answer: 0,
        ref: "TESDA VGD NC III · element 1.4 + 1.5 verbatim (lib/fixtures/rowspec/it.ts:510, 550)",
        distractorNotes: [
          "The fit: element 1.4's explicit confirmation plus 1.5's liaising — the approval is confirmed in the round's own process, and the client's word is asked back before anything moves.",
          "Invoice-as-asked without the confirmation leaves the approval unstated — the element's step exists precisely so neither side assumes what the other never said.",
          "Self-approval reverses the approval's direction — the client's act decides the design's state, and the deadline's passage carries no signature.",
          "Message-board declaration states what nobody said — the approval's path is confirmed through the element's process, not by a note asserting the silence's meaning.",
        ],
      },
    ],
  },

  {
    skill: "Client communication & revisions",
    catalogSkill: "Client communication & revision handling",
    items: [
      // Q1 recognition — the TR's communication package (verbatim list)
      {
        skill: "Client communication & revisions",
        catalogSkill: "Client communication & revision handling",
        stem:
          "The TR's required skills list lists verbatim: “Verbal communication · Written communication · Listening skills · Critical Thinking · Analytical and comprehension Skills · Reporting skills · Presentation skills.” What is the designer's communication package here?",
        options: [
          "the printed package — spoken and written forms, listening, thinking and comprehension, reporting and presentation — trained on the client's brief and revision rounds",
          "a polish on spelling and the office's comma placements alone, since the written word is the client's entire preferred route here",
          "e-mail's keyboard shortcuts learned over one weekend, for the inbox's speed records",
          "a framed print of the office's past award stickers, pinned beside the portfolio",
        ],
        answer: 0,
        ref: "TESDA VGD NC III · TR required-skills list verbatim (lib/fixtures/rowspec/it.ts:556)",
        distractorNotes: [
          "The fit: the printed seven — the client-facing communication set, covering the spoken and written forms through reporting and presentation.",
          "Commas-and-spelling polish one corner of the written — the printed list reaches through listening and presentation as well, and the written's corner is one item of seven.",
          "Keyboard-shortcut speed is the inbox's athletics — the TR's skills are about the communication's movement through the client's rounds, not its fastest projection.",
          "Framed award stickers are wall décor — the required skills list is a working communication package, and past awards communicate nothing in the client's current round.",
        ],
      },
      // Q2 application — the fifth round (element 1.5 + TR skills)
      {
        skill: "Client communication & revisions",
        catalogSkill: "Client communication & revision handling",
        stem:
          "Fifth round of unclear edits. The deadline is Friday and every message reads only “make it better.”",
        options: [
          "hold the deadline's commitment, and learn the definition of the “better” via the liaising element — the edits chased to a spec, worked cleanly, each round confirmed in writing",
          "merge all five rounds into one combined design and deliver it, since the rounds' merging is a faster kind of working",
          "refuse the client's five rounds of edits and defend the version you built alone, since a designer's professional move is protecting the original",
          "confirm every edit as received, deliver nothing further, and reach for the firm's lawyer the moment the invoice asks",
        ],
        answer: 0,
        ref: "TESDA VGD NC III · element 1.5 verbatim (lib/fixtures/rowspec/it.ts:558) + the TR communication skills (it.ts:556)",
        distractorNotes: [
          "The fit: the liaising element plus the communication package's acts — the edits chased to definition, worked, and the round's record confirmed in the written form.",
          "Merging rounds combines instructions nobody issued — each round's instruction works as its own current record, and the combined chaos is the confusion compounded.",
          "Refusing the client's edits abandons the service's round — the communication skills exist precisely for these revision rounds, and the original's defense never appears among them.",
          "Confirmed-then-nothing delivers the communication's receipt without its delivery — the round's handling ends in a completed work, and the lawyer is a substitute appearing where no work exists.",
        ],
      },
      // Q3 judgment — the listening act on conflicting feedback (TR listening skills + element 1.2)
      {
        skill: "Client communication & revisions",
        catalogSkill: "Client communication & revision handling",
        stem:
          "Two client contacts give opposite directions on the same design: the brand's guardian says “keep it subdued,” the marketing head says “keep it loud.”",
        options: [
          "listen to both, identify which objectives each direction serves against the brief's original beat, and negotiate the design's next round with both voices present",
          "produce both versions and let the client's next-in-line decide by chance, billing both whether the prints arrive",
          "call both directions “moods,” and design once from your own judgment, since the recycled version is the designer's own best edit",
          "pick the louder ask and mute the other's, since the desk answers whoever speaks first",
        ],
        answer: 0,
        ref: "TESDA VGD NC III · TR listening skills (lib/fixtures/rowspec/it.ts:556) + element 1.2's objective identification (it.ts:510)",
        distractorNotes: [
          "The fit: the listening skills' work with the objectives identified — both directions heard and compared against the brief's original beat, and the next round negotiated.",
          "Two-versions-billed double-prints the conflict — the resolution is the design's negotiated next round, and a duplicate invoice ships alongside a decision the design never took.",
          "Mood-talk refuses to hear either voice — the listening skills exist for exactly this conflict, and the designer's own edit is one contact's direction, not the brief's.",
          "Louder-wins silences the quieter instruction — the objectives' identification settles the conflict through the brief's beat, and the first voice's volume is no priority.",
        ],
      },
    ],
  },

  {
    skill: "Junior 2D Animator (counterpart)",
    catalogSkill: "Junior 2D Animator — [PSF-DAA] (counterpart, optional — user ruling 2026-10-29 ADD)",
    items: [
      // thin: PSF-DAA counterpart — only the role-map name is recorded on disk
      // (rowspec lines 562–567: no FSC levels, JobsFit demand header as anchor).
      // Items anchor to the name+a seat description and the demand header, never
      // to a descriptor quote or level. Declared limitation (PSF-DAA extract-light).
      // Q1 recognition — the seat's identity
      {
        skill: "Junior 2D Animator (counterpart)",
        catalogSkill: "Junior 2D Animator — [PSF-DAA] (counterpart, optional — user ruling 2026-10-29 ADD)",
        stem:
          "The studio opens a junior seat on the animation side. Per the role's source map, the seat belongs to the Digital Art and Animation family's Junior 2D Animator rung. What fills that seat?",
        options: [
          "producing two-dimensional animation frames as the seat's own work, on the animation production side of the art-and-animation family",
          "keeping the studio's invoices and stockroom in order as the junior seat's proper first starting point",
          "recoloring the senior animators' three-dimensional renders for the print team",
          "managing the voice actors' contracts and call times",
        ],
        answer: 0,
        ref: "PSF-DAA · role-map name “Junior 2D Animator” (lib/fixtures/rowspec/it.ts:562–564) + JobsFit demand header anchor (it.ts:565)",
        distractorNotes: [
          "The fit: the seat's source name — a 2D animator's junior rung on the animation production side, as the PSF-DAA map names it.",
          "Invoices-and-stockroom are administration's desks — the junior seat named is an animator's, and no ledger appears anywhere in its source rung.",
          "3D-render recoloring is a different dimension's work — the rung prints two-dimensional frames, and the recolor side belongs to another desk entirely.",
          "Voice-actor contract management is talent-coordination work — the seat's source name names animator frames, and nothing in the rung's print touches contracts.",
        ],
      },
      // Q2 application — the seat inside the family's pipeline (name + recorded only)
      {
        skill: "Junior 2D Animator (counterpart)",
        catalogSkill: "Junior 2D Animator — [PSF-DAA] (counterpart, optional — user ruling 2026-10-29 ADD)",
        stem:
          "The client's brief demands a one-minute animated explainer. Your seat's piece in the family's pipeline:",
        options: [
          "the two-dimensional frames' production piece — drawn and sequenced under the senior animators' direction within the pipeline's flow",
          "one solo full production from storyboard to final render, delivered as the junior's own piece",
          "negotiating the client's contract price from the junior seat, since the seat's youth is the client's discount anyway",
          "asking the client which software to buy for the pipeline, since your own machine's tools are yours to choose entirely",
        ],
        answer: 0,
        ref: "PSF-DAA · role-map name “Junior 2D Animator” (lib/fixtures/rowspec/it.ts:562–564)",
        distractorNotes: [
          "The fit: the junior rung's name placed in the family pipeline — a 2D frames' piece produced under senior direction.",
          "Solo-full-production overstates the rung — the seat is junior, and the pipeline's flow carries the piece under direction rather than as an end-to-end owner.",
          "Contract negotiation is a producer's or an account's work — the junior seat's piece is the frames' production, and nothing in the rung's name touches pricing.",
          "Client-bought tools reverse the studio's craft — the pipelines' instrument decisions live downstream of the junior seat, and the client is asked nothing about software.",
        ],
      },
      // Q3 judgment — direction's weight on the junior rung
      {
        skill: "Junior 2D Animator (counterpart)",
        catalogSkill: "Junior 2D Animator — [PSF-DAA] (counterpart, optional — user ruling 2026-10-29 ADD)",
        stem:
          "The senior animator gives you note fixes on your frames. The client's message asks, separately, to re-run the frames' colors for the final video.",
        options: [
          "carry the client's ask to the directing senior — the frames' production runs under the rung's direction, and the client's color request routes through it as the pipeline does",
          "re-color the frames per the client's message overnight, and tell the senior the next morning",
          "refuse the client's message entirely — the senior's word outranks any client's request, and so does yours",
          "re-run the colors unmentioned on your own working copy and keep two full versions, going with whichever survives Monday's meeting",
        ],
        answer: 0,
        ref: "PSF-DAA · role-map name “Junior 2D Animator” (lib/fixtures/rowspec/it.ts:562–564)",
        distractorNotes: [
          "The fit: the junior rung runs under direction — the client's ask is a production decision the directing senior carries, and your seat routes it, not answers it alone.",
          "Overnight re-coloring without the senior's word hides the client's ask from the direction the rung sits in — the seat's junior piece runs under senior direction, not against it.",
          "Refusing the client on seniority's rank alone misreads the rung — the client's ask itself isn't refused or granted by the junior seat, and it routes to the direction's desk.",
          "Twin-version-Brotherhood keeps both versions alive beyond the direction's truth — one version runs in the pipeline, and the client's ask rides through the direction's decision, not through a dueling copy's luck.",
        ],
      },
    ],
  },

  // ═════════════ wave 2 · da · Data Analyst, junior (E1, demo interop) ══════
  // Anchors: PSOC 3314 lettered lines (research/snapshots/psoc/psoc2012-parsed.csv:356),
  // PSF-AAI verbatim quotes in lib/fixtures/rowspec/it.ts (lines 631–708).
  // thin flags: AI-ethics/Data-ethics/cyber-incident rows are "anchorless" per
  // rowspec (no CWF task anchors printed) — items anchor to the rows' verbatim
  // FSC descriptors quoted in rowspec + PSOC 3314, flagged in code comments.
  {
    skill: "Data Analytics",
    catalogSkill: "Data Analytics",
    items: [
      // Q1 recognition — the FSC L2's act
      {
        skill: "Data Analytics",
        catalogSkill: "Data Analytics",
        stem:
          "Your analytics onboarding card's role lists: “Get the data talking: surface the real trend or pattern that answers the business question, using stats and computing tools.” On a reporting week, what fills that act?",
        options: [
          "the business question answered from the data — the real trend or pattern surfaced through the stats and computing tools' work",
          "the sales managers' argument settled by whoever's voice is loudest in the meeting",
          "the prettiest chart built from whichever dataset happened to load fastest that morning",
          "a collection of confident “it depends” statements, delivered without any numbers behind them at all",
        ],
        answer: 0,
        ref: "PSF-AAI · da Data Analytics FSC L2 descriptor (lib/fixtures/rowspec/it.ts:633)",
        distractorNotes: [
          "The fit: the printed act — the trend or pattern surfaced as an answer to the actual business question.",
          "Loudest-voice settlements skip the data — analytics answers the question with stats and tools, not with meeting-room volume.",
          "Prettiness-of-available answers the convenience, not the question — surfacing the real pattern starts from the business question, whatever the data's loading mood.",
          "Confidence-without-numbers is argument, not analysis — the sheet's FSC names computing tools and patterns, and the answer carries the numbers it sits on.",
        ],
      },
      // Q2 application — perform calculations under guidance (PSOC 3314 e + overview)
      {
        skill: "Data Analytics",
        catalogSkill: "Data Analytics",
        stem:
          "The senior analyst hands you the quarter's returns questions and facts to assemble: promo-period sales, non-promo sales, and the store list's segment codes.",
        options: [
          "perform the statistical calculations on the standard software packages, run the comparisons the senior's brief names, and organize the collected data behind each",
          "use the standard packages to draw the nicest pie of whichever column carries the biggest numbers",
          "answer the quarter's statistical questions from your own experience of the stores, since you've shopped at three of them personally",
          "escalate the task to the vendor's support queue, since the packages' statistics exceed a junior's seat",
        ],
        answer: 0,
        ref: "PSOC 3314 · e (research/snapshots/psoc/psoc2012-parsed.csv:356) + PSF-AAI · da role overview “perform basic data analysis under supervision” (lib/fixtures/rowspec/it.ts:634)",
        distractorNotes: [
          "The fit: PSOC 3314 e)'s standard-package calculations plus the overview's under-supervision analysis — the brief's comparisons run and the data behind them organized.",
          "Nicest-pie is decoration answering no question — the calculations serve the brief's named comparisons, and aesthetics come after the answer exists.",
          "Store anecdotes are experience, not analysis — the FSC's act surfaces the pattern through the data's own work, and three visits answer nothing.",
          "Vendor escalation abandons the junior's own seat — the standard packages' statistics run at the desk, under the supervision the overview prints.",
        ],
      },
      // Q3 judgment — pattern's answer vs the argument's winner (PSOC 3314 g)
      {
        skill: "Data Analytics",
        catalogSkill: "Data Analytics",
        stem:
          "Your finished analysis shows promos worked in segment C and failed in segment A. Segment A's manager, who requested this analysis, wants the promo numbers “re-run until they improve.”",
        options: [
          "apply the statistical principles' answer plainly — the finding presented with its method, re-runs offered for verification, and the segment A result carried to the decision-makers as it stands",
          "re-run segment A's analysis repeatedly until a preferable number appears, and present that one to the manager",
          "withhold the analysis entirely and tell the manager the data never arrived — segment C's manager gets the good news and segment A's stays silent",
          "report the promos' average across both segments as one flat number, since the average's calm outranks the segments' conflict",
        ],
        answer: 0,
        ref: "PSOC 3314 · g (research/snapshots/psoc/psoc2012-parsed.csv:356) + PSF-AAI · da FSC L2 (lib/fixtures/rowspec/it.ts:633)",
        distractorNotes: [
          "The fit: PSOC 3314 g)'s principles-and-practices act — the problem's identification and solution carried with the analysis's method stated and its result intact.",
          "Repeated re-runs until preference arrives fix the answer, not the pattern — the statistics' own practice is the finding's verification, not its renegotiation.",
          "Withholding the analysis hides the finding from its requester — the analytics' object is the business question's answer, and the answer travels to whoever asked.",
          "Flat averages dissolve the finding the analysis built — the segments' difference is the real pattern, and a calm-average presentation falsifies what the data surfaced.",
        ],
      },
    ],
  },

  {
    skill: "Data Visualization and Storytelling",
    catalogSkill: "Data Visualization and Storytelling",
    items: [
      // Q1 recognition — the FSC L3s two acts
      {
        skill: "Data Visualization and Storytelling",
        catalogSkill: "Data Visualization and Storytelling",
        stem:
          "The visualization role's card lists it in two halves: “Build the dashboard/visual that makes the finding land, and tell the story behind the numbers.” A junior seats' week includes:",
        options: [
          "building the visual that carries the finding and narrating the story the numbers hold — both halves the card owns",
          "building forty slides of the same scatter plot, each progressively darker, as the story's mystery",
          "pasting the raw query into the deck with a wink, since the query's text is the finding's own native tongue",
          "the single number alone, shown without context at maximum confidence",
        ],
        answer: 0,
        ref: "PSF-AAI · da Data Visualization and Storytelling FSC L3 descriptor (lib/fixtures/rowspec/it.ts:639)",
        distractorNotes: [
          "The fit: the card's two halves together — the visual built and the story told from behind the numbers.",
          "Same-scatter-forty is repetition presented as narrative — the card's visual carries the finding, and one scatter tells nothing by being repeated darker.",
          "Raw query pasted is the analysis's construction, not the audience's story — the visualization's act translates the finding into a view the readers can carry.",
          "A number without context abandons the story's telling — the card's second half is exactly the story behind the number, and the confidence is theirs to meet.",
        ],
      },
      // Q2 application — presenting findings clearly (overview anchor)
      {
        skill: "Data Visualization and Storytelling",
        catalogSkill: "Data Visualization and Storytelling",
        stem:
          "The sales managers argued about whether promos ever worked. Your analysis found the answer and the senior analyst asks how it reads before the meeting.",
        options: [
          "present the finding clearly — the visual built so the argument's answer lands, and the story told in the managers' own terms",
          "present the raw query so the managers can re-run it themselves, since their trust is served by the pasted computation",
          "present the finding's number alone, with the pattern's story saved for whoever asks twice",
          "present your sympathy about the argument, and discuss the numbers only when the managers' mood softens",
        ],
        answer: 0,
        ref: "PSF-AAI · da role overview “learn to use data visualization tools and techniques… presenting findings in a clear manner” (lib/fixtures/rowspec/it.ts:640)",
        distractorNotes: [
          "The fit: the overview's own line — findings presented clearly, in a visual built to land with its readers.",
          "Pasted queries shift the analysis's work onto the audience — the presentation's own act is the clear finding, built by the visualization tools.",
          "Number-alone-withholding leaves the story for a repeat asker — the FSC's second half tells the story the numbers hold, and it tells it the first time.",
          "Mood-managed timing delays the answer the meeting had — the presentation's own clarity lands the finding regardless of the managers' mood.",
        ],
      },
      // Q3 judgment — graphical-or-tabular per the audience (PSOC 3314 f)
      {
        skill: "Data Visualization and Storytelling",
        catalogSkill: "Data Visualization and Storytelling",
        stem:
          "The board presentation allows you five minutes. Your completed finding needs a form the board can carry out of the room — the raw table has forty columns.",
        options: [
          "prepare statistical results' presentation in graphical form — the finding's visual built for the board's five minutes, with the tabular form attached as the record",
          "present the forty-column table's header lines alone, and assume the board's five minutes can honor a table nobody ever reads",
          "present your analysts' favorite dashboard, with the finding wherever it lives in the frame",
          "read the finding aloud without any visual or table — language alone carries the five minutes",
        ],
        answer: 0,
        ref: "PSOC 3314 · f (research/snapshots/psoc/psoc2012-parsed.csv:356) + PSF-AAI · da FSC L3 (lib/fixtures/rowspec/it.ts:639)",
        distractorNotes: [
          "The fit: PSOC 3314 f)'s graphical-or-tabular presentation act — form chosen for the audience, and the finding carried in the frame they can read.",
          "Header-only presentation is record without presentation — the board carries nothing out of the room, and the row's work exists for the finding's landing.",
          "Analyst-favorite dashboard serves its maker, not the board — the presentation's form is chosen for the readers' needs, and the finding's place in the frame is designed.",
          "Language-alone ignores the visualization's instrument — PSOC f)'s graphical form is the presentation's option, and five minutes carry more truth in a visual than a spoken line.",
        ],
      },
    ],
  },

  {
    skill: "ETL workflows",
    catalogSkill: "ETL (extract-transform-load workflows)",
    items: [
      // Q1 recognition — assemble/validate/keep-trustworthy (CWF print)
      {
        skill: "ETL workflows",
        catalogSkill: "ETL (extract-transform-load workflows)",
        stem:
          "The ETL role lists under the key-task tier “Prepare and analyze data”: assemble and clean the pipeline piece by piece — gather data, validate it, and keep the records trustworthy. What runs on an ETL day?",
        options: [
          "the pipeline's pieces assembled — data gathered, validated at each stage's edge, and the records kept trustworthy through both",
          "the dashboards' day begun and whatever feeds arrive unvalidated, loaded raw and trusted by default",
          "three dashboards' different numbers averaged quarterly so the disagreements wash to calm",
          "hand-copying reports from the source screens whenever the pipeline's patience expires",
        ],
        answer: 0,
        ref: "PSF-AAI · da “Prepare and analyze data” CWF key tasks (lib/fixtures/rowspec/it.ts:651–652)",
        distractorNotes: [
          "The fit: the printed acts — the pipeline assembled, data gathered and validated per stage, records kept trustworthy.",
          "Raw-load-default skips the validation stage the key task names — the pipeline's trust runs on validated loads, not on arrivals' default weight.",
          "Averaging disagreements hides them inside a calmer number — the records' trustworthiness is the pipeline's own work, and averaging is the opposite of keeping them straight.",
          "Hand-copying bypasses the pipeline entirely — the prepare-and-analyze acts are the desk's work, and copying by hand maintains nothing.",
        ],
      },
      // Q2 application — quality-control over collection work (PSOC 3314 d)
      {
        skill: "ETL workflows",
        catalogSkill: "ETL (extract-transform-load workflows)",
        stem:
          "Three dashboards quote three different revenue numbers, and the exec meeting is Thursday.",
        options: [
          "perform the data collection and quality-control work on each pipeline's own edge — trace where each number's assembly differs, and reconcile the loads per the sources' own rules",
          "pick whichever single dashboard's number reads nicest on that morning and present it as the meeting's official final answer to everyone",
          "delete the oldest dashboard's pipeline so only two numbers quarrel",
          "e-mail every dashboard owner for their personal opinion of the truth, and average the opinions",
        ],
        answer: 0,
        ref: "PSOC 3314 · d (research/snapshots/psoc/psoc2012-parsed.csv:356) + PSF-AAI · da ETL CWF (lib/fixtures/rowspec/it.ts:651–652)",
        distractorNotes: [
          "The fit: PSOC 3314 d)'s collection-and-quality-control act plus the pipeline's validate work — the difference traced per source and reconciled per its rules.",
          "Nicest-answer selection substitutes taste for custody — the dashboards' disagreement is a pipeline validation's question, and the Thursday answer is the reconciled one.",
          "Dashboard-deletion silences rather than reconciles — the disagreement's own causes reside in each pipeline's edge, and deletion keeps two quarrels for one fewer wave.",
          "Opinion-averaging liquidates the sources' facts into a mood — the sources' rules are the reconciliation's weights, and opinions carry no load at all.",
        ],
      },
      // Q3 judgment — validation vs the exec meeting's squeeze (the trustworthy records' anchor)
      {
        skill: "ETL workflows",
        catalogSkill: "ETL (extract-transform-load workflows)",
        stem:
          "Leadership asks the new revenue pipeline's unvalidated feed to load into tonight's meeting deck “as-is,” with validation promised for tomorrow's follow-up.",
        options: [
          "keep the records trustworthy — the load runs validated, or if urgent it rides the deck flagged as provisional, with the follow-up's validation promised and logged",
          "load-as-is tonight and validate tomorrow — an unvalidated load in a deck shares the executives' patience and nobody's data hygiene",
          "unhook the trustworthiness stage entirely for this month, since the meeting's calendar overrides the pipeline's design",
          "validate tomorrow as promised, but leave tonight's deck unstamped either way, so nobody holds the load's stage in evidence",
        ],
        answer: 0,
        ref: "PSF-AAI · da ETL CWF “keep records trustworthy” (lib/fixtures/rowspec/it.ts:651–652)",
        distractorNotes: [
          "The fit: the trustworthy-records stage upheld — the load carries its stage's stamp whether loaded or provisional, and the validation's follow-up runs promised and logged.",
          "Load-and-validate-later loads the deck unvalidated — the meeting's calendar answers no pipeline, and the records' trustworthiness is the stage the deck consumes.",
          "Stage-unhooking-by-month un-builds the pipeline's own design — the validation is the trustworthiness's stage, and a month's removal erases the records' standing.",
          "Unstamped-either-way is the pipeline's record undeclared — the deck's load carries its stage, and nobody's evidence holds without the stamp's own say.",
        ],
      },
    ],
  },

  {
    skill: "DA Enabling row (4-ESC)",
    catalogSkill:
      "Enabling Skills & Competencies (ESC) — Collaboration, Communication, Digital Fluency, Learning Agility",
    items: [
      // Q1 recognition — the four-ESC print
      {
        skill: "DA Enabling row (4-ESC)",
        catalogSkill:
          "Enabling Skills & Competencies (ESC) — Collaboration, Communication, Digital Fluency, Learning Agility",
        stem:
          "Your analyst onboarding page lists the role's ESC role exactly as the role page lists it — four skills, all Basic. Which four?",
        options: [
          "Collaboration, Communication, Digital Fluency, Learning Agility",
          "Collaboration, Problem Solving, Self Management, Communication",
          "Digital Fluency, Learning Agility, Decision Making, Sense Making",
          "Communication, Listening, Presentation, Reporting",
        ],
        answer: 0,
        ref: "PSF-AAI · da ESC row as printed, the four the role page lists (lib/fixtures/rowspec/it.ts:660–662)",
        distractorNotes: [
          "The fit: the printed four — Collaboration, Communication, Digital Fluency, Learning Agility, the exact four the role page lists.",
          "Problem Solving and Self Management belong to other roles' bundles — the analyst page's list is the four the printed ESC name says.",
          "Decision Making and Sense Making aren't within the row's name — the four-ESC is matrix-limited, exactly as listed.",
          "Listening/Presentation are the TR-run client set for another track — the analyst's printed four stay the four listed.",
        ],
      },
      // Q2 application — collaborate with team on data projects (overview anchor)
      {
        skill: "DA Enabling row (4-ESC)",
        catalogSkill:
          "Enabling Skills & Competencies (ESC) — Collaboration, Communication, Digital Fluency, Learning Agility",
        stem:
          "Your first month on the data project: three teammates in other rooms, no one has told you what the shared dataset's columns mean, and nobody admits to owning them.",
        options: [
          "collaborate with the team — share what you learn, ask the teammates the columns' meanings, and cooperate on the data project's work regardless of the room they're in",
          "pretend you already know the dataset's columns and build the entire analysis on your own private reading of just the column names",
          "wait three weeks for the columns' owner's return from leave, and stop your own work meanwhile",
          "build the analysis in a tool only you know, so nobody else's reading can invalidate yours",
        ],
        answer: 0,
        ref: "PSF-AAI · da role overview “collaborate with team members on data-related projects” (lib/fixtures/rowspec/it.ts:663)",
        distractorNotes: [
          "The fit: the printed overview's collaboration — the team coordinated with, questions asked, and what's learned shared.",
          "Pretend-knowing fabricates the analysis's foundation — the collaboration's act asks the column owners on the team, and the names' inventing dissolves the project's trust.",
          "Waiting-for-leave stalls the desk's piece — the collaboration works through the teammates still in the room, and the ask's answer comes from whoever knows.",
          "A single-keeper tool builds an island — the digital-tool fluency and the collaboration's share both run with the team's reading, and an island defeats the project's ask.",
        ],
      },
      // Q3 judgment — basic-data-analysis under supervision (overview's under-supervision clause)
      {
        skill: "DA Enabling row (4-ESC)",
        catalogSkill:
          "Enabling Skills & Competencies (ESC) — Collaboration, Communication, Digital Fluency, Learning Agility",
        stem:
          "Senior analyst on leave all month. The client's request is a complex model no one on your desk has built before, and your learning-agility's ask is genuine.",
        options: [
          "begin the learning-up work and route the model's build through whoever supervises — the analysis runs at your rung's edge, and the request's scope is discussed before any build is promised",
          "build the complex model solo all weekend — the learning-agility spirit covers the rung's gap, and the client's request is honored in the silence",
          "accept the build but mark every finding as “rough,” letting the client decide the model's meaning",
          "forward the client's request straight to a freelancer marketplace, since your rung never touches the model's build",
        ],
        answer: 0,
        ref: "PSF-AAI · da role overview “perform basic data analysis under supervision” (lib/fixtures/rowspec/it.ts:634) + ESC Learning Agility print (it.ts:660–662)",
        distractorNotes: [
          "The fit: the rung's edges held — a basic-analysis seat under supervision, with the scope raised and the learning-up begun on the rung's actual work.",
          "Solo-build weekend unowns the supervision clause — the client's request deserves the scope's conversation first, and the learning-control bypasses the seat's oversight.",
          "Rough findings let the client decide the model's own meanings — the under-supervision rung reports validated work, and rough-findings labels delegate the meaning's truth away.",
          "Freelancer forwarding hands the seat's client to strangers — the collaboration's act runs through the team and the supervisor, and the analyst's learning-agility learns from the request's routing.",
        ],
      },
    ],
  },

  {
    skill: "AI Ethics and Governance",
    catalogSkill: "Artificial Intelligence Ethics and Governance",
    // thin: PSF-AAI FSC L2 descriptor-only row (rowspec flags anchorless) —
    // items anchor to the descriptor text quoted in rowspec + PSOC 3314, 2026-11-05.
    items: [
      // Q1 recognition — the governance keep
      {
        skill: "AI Ethics and Governance",
        catalogSkill: "Artificial Intelligence Ethics and Governance",
        stem:
          "The AI-governance role keeps AI/data work compliant with governance rules, per its FSC description — RA 10173's Data Privacy Act named in the role's performance-expectations clause. What does an AI analytics project's desk obligation, read as the descriptor's, hold?",
        options: [
          "the compliance kept with governance rules across the AI/data work — the data privacy's, the permits' of the uses a project carries",
          "AI features' naming so the governance reads only marketing's words",
          "the privacy's George-ish filing kept as a moody artifact, because formal papers never reach the analytics",
          "stats-only liabilities in the build's engine, no governance role beyond whoever buys the servers",
        ],
        answer: 0,
        ref: "PSF-AAI · da AI Ethics and Governance FSC L2 descriptor (lib/fixtures/rowspec/it.ts:673–674)",
        distractorNotes: [
          "The fit: the descriptor's own governance-keep — the AI/data work's compliance across the project's pieces, and the privacy's legal's own carry.",
          "Marketing-naming is brand, not governance — the keep act is the compliance hold across the features themselves, and naming does nothing to keep the rules.",
          "A mood-board privacy file carries nothing real — the descriptor's compliance runs at the analytics desk itself, and formal papers are exactly what the work produces.",
          "Stats-only-beyond-the-buyers un-reaches the governance's own keep — the analytics' work holds compliance all through its stats (privacy included), not only at the buying table.",
        ],
      },
      // Q2 application — personal data's use inside the model's build
      {
        skill: "AI Ethics and Governance",
        catalogSkill: "Artificial Intelligence Ethics and Governance",
        stem:
          "Your hiring model's team wants to widen the model's accuracy-on-test by ingesting applicants' personal data beyond the project's stated purpose — resumes, family circumstances, phone logs.",
        options: [
          "raise the purpose's limit with the governance rules in hand — the data-hungry intake argues with the project's said purpose, and the reviewers' privacy question runs the test",
          "ingest until the accuracy number improves, since accuracy is the model's own defense for every intake it ever needs",
          "burn the project's whole audit trail once the model launches, since a launched model should have no questions asked of it anymore",
          "leave the intake to whoever runs the numbers — the model's pipeline is purely technical and legality is a paper's matter",
        ],
        answer: 0,
        ref: "PSF-AAI · da AI Ethics and Governance descriptor (lib/fixtures/rowspec/it.ts:673–674) + RA 10173's performance-expectations clause (it.ts:674)",
        distractorNotes: [
          "The fit: the descriptor's compliance kept at the intake's own test — the personal data's purpose-bound use, raised through the governance's rules, and the privacy question run.",
          "Accuracy-as-defense flips the purpose's rule on intake — the personal data's stated purpose carries the decision, and accuracy lifts nothing past it.",
          "Burn-on-launch is the audit trail's own destruction — the compliance's record outlives the model's launch, and the burn's own side is the governance's breach.",
          "Technical-vs-legality is a false split — the pipeline's every stage carries the compliance, and the “paper's matter” design papers nothing.",
        ],
      },
      // Q3 judgment — the governance carry through the model's lifecycle
      {
        skill: "AI Ethics and Governance",
        catalogSkill: "Artificial Intelligence Ethics and Governance",
        stem:
          "Six months in. The model's outputs complain of bias, and your lead wants the outputs' audit trail trimmed to a monthly summary so nobody outside the team reads every decision it made.",
        options: [
          "keep the audit trail's compliance covered — the trim's ask routes to the governance's review, and the bias's own lookup runs through the fuller decision registers",
          "trim as asked, and keep the detail in a private file where only the team's memory holds it",
          "delete the outputs' trail entirely and rebuild the model from the same data, since the rebuilt version is the bias's sheet-new file anyway",
          "publish the trail's whole content as the bias's public statement, so the team's errors are shared with every reader",
        ],
        answer: 0,
        ref: "PSF-AAI · da AI Ethics and Governance FSC L2 descriptor (lib/fixtures/rowspec/it.ts:673–674)",
        distractorNotes: [
          "The fit: the trail's compliance carry — the governance review routes the trim's need, and the bias's look-back holds its fuller registration.",
          "Detail-in-private-file is the trail's paper off-record — the governance's review holds the audit's full registration, and the team's memory is nothing the compliance's paper trusts.",
          "Rebuilt-from-same-data deletes the audit trail's own record — the bias's sheet-new file doesn't inherit the new model's birth without its registry.",
          "Public-statement is the disclosure's polarity turned inside out — the governance's review receives the trail properly, and the public's sheet is the governance's replaced way.",
        ],
      },
    ],
  },

  {
    skill: "Data Ethics",
    catalogSkill: "Data Ethics",
    // thin: PSF-AAI FSC L3 descriptor-only row (rowspec anchorless flag) —
    // items anchor to the descriptor text + PSOC 3314, 2026-11-05.
    items: [
      // Q1 recognition — the lifecycle's ethics
      {
        skill: "Data Ethics",
        catalogSkill: "Data Ethics",
        stem:
          "The data-ethics role's card lists the descriptor's act: “treat data — especially personal data — legally and ethically throughout its lifecycle.” A new hire asks what the lifecycle's ethics mean:",
        options: [
          "the legal and ethical handling held across the data's whole lifespan — from its collection's permissions through its uses, transfers, and disposal's own rules",
          "the ethics' banner at the project's kickoff meeting only — the rest of the lifecycle runs untouched by the banner's rule",
          "personal data's confidentiality held in the movies' world, since the analytics' work has no law to bend",
          "the CFO's or a shop's wish granted whenever it arrives by e-mail, since the wish's hierarchy wins",
        ],
        answer: 0,
        ref: "PSF-AAI · da Data Ethics FSC L3 descriptor (lib/fixtures/rowspec/it.ts:680)",
        distractorNotes: [
          "The fit: the descriptor's whole-lifespan act — legal and ethical handling held across collection, use, transfer, and disposal.",
          "Kickoff-only banner leaves every later lifecycle stage uncovered — the descriptor's act runs across the whole span, and the banner disappears after the kickoff.",
          "Movies'-world confidentiality is fiction — the descriptor's legal clause is real, and personal data's ethics are the desk's own work span.",
          "Wish-hierarchy flips the ethics' own rule — the CFO's or a shop's wish is exactly what the descriptor's legal clause stands against.",
        ],
      },
      // Q2 application — the rival's account peep
      {
        skill: "Data Ethics",
        catalogSkill: "Data Ethics",
        stem:
          "Technically you can open any customer's purchase history tonight, and a colleague asks you to peek at one large rival's account “just to see their margins.”",
        options: [
          "refuse the peek — the account's purchase history is personal data, and opening it for a margin's curiosity lies outside every lawful purpose the access names",
          "open it briefly without logging, since a glance leaves no print and curiosity leaves no evidence",
          "open it and send your colleague only the aggregated totals, since the item-level data stays private and totals are anonymous",
          "check whether the rival's account is paid-up first, since a paid account's records are public knowledge",
        ],
        answer: 0,
        ref: "PSF-AAI · da Data Ethics FSC L3 descriptor (lib/fixtures/rowspec/it.ts:680)",
        distractorNotes: [
          "The fit: the ethical-and-legal holding — the access's purpose is the ethics' own test, and a curiosity's opening fails it.",
          "Unlogged-glance is curiosity without evidence, not without breach — the access's ethics survive every record, and an unlogged opening is still an unauthorized one.",
          "Totals-only still opens the account's data — the lawful purpose's edge is the analysis's task, and no tier of detail passes the ethical's own review.",
          "Paid-account-thinking is a fiction's rights theory — the account's payment never publics its records, and public access comes only where the client's lawful purpose names it.",
        ],
      },
      // Q3 judgment — the client request that outruns its consent
      {
        skill: "Data Ethics",
        catalogSkill: "Data Ethics",
        stem:
          "A client calls: \"Share our customers' purchase history with our partner agency — they're on our side.\" The consent's own files say the purchase histories' sharing has one named partner; this agency is not it.",
        options: [
          "hold the sharing back — the data's consent names its lawful partners, and the request's routing runs through the consent's own records before any share leaves",
          "share as the client's side names it — the client's own voice is the consent's substitute, and the partner's formality is a paper's afterthought",
          "share with the agency and delete the consent's record, since a shared-with-the-customer's partner is a customer's own reality",
          "share only the top-line summaries with the agency, since the top line's anonymity outruns the consent's records",
        ],
        answer: 0,
        ref: "PSF-AAI · da Data Ethics FSC L3 descriptor (lib/fixtures/rowspec/it.ts:680)",
        distractorNotes: [
          "The fit: the ethics' whole-lifecycle hold — the consent's named partners govern who receives the histories, and the unlisted agency goes through the records' own review.",
          "Client-as-substitute consent is the sharing's own un-permission — the consent's named partners are the lawful basis's own form, and the client's voice is not the substitute.",
          "Delete-the-consent destroys the lawful basis's record — the share's own records remain, and hiding the consent's file does not unmake the sharing's question.",
          "Top-line summaries still carry the customers' histories' shape — the consent's named partners govern every tier of the share, and the top line is no exemption.",
        ],
      },
    ],
  },

  {
    skill: "Configuration Tracking",
    catalogSkill: "Configuration Tracking",
    items: [
      // Q1 recognition — the L1 act (change logs for reproducibility)
      {
        skill: "Configuration Tracking",
        catalogSkill: "Configuration Tracking",
        stem:
          "The analytics floor's change-log role lists at level 1: keep the change logs tidy so your analysis files and scripts stay reproducible. What does that act hold on a month of notebook edits?",
        options: [
          "the changes logged — what file, what script, what version, in the shape another person could rerun the analysis from",
          "the month's edits remembered and recited to anyone who asks, since memory is the honest version",
          "the notebook renamed final_v3 and e-mailed to the team as the month's record",
          "the logs skipped — reproducibility is the analysts' cliché, and every result defends its own rerun",
        ],
        answer: 0,
        ref: "PSF-AAI · da Configuration Tracking FSC L1 descriptor (lib/fixtures/rowspec/it.ts:697–699)",
        distractorNotes: [
          "The fit: the level-1 log act — file, script, and version changes recorded so another rerun reaches the same result.",
          "Recited memory reproduces nothing — the log's record is what a rerun reads from, and recitation can neither be checked nor rerun.",
          "final_v3-by-e-mail carries no change history — the log's changes are the record of how each state came to be, and a rename erases the path.",
          "Result-defends-itself abandons the reproducible record — the printed act exists so each change stays accounted, and analysis that refuses logging answers loops reruns never trust.",
        ],
      },
      // Q2 application — the notebook's three-day drift (PSOC 3314 trace + FSC print)
      {
        skill: "Configuration Tracking",
        catalogSkill: "Configuration Tracking",
        stem:
          "The notebook drifted three times since Monday. Wednesday's number disagrees with Monday's, and the client re-asks for the week's count.",
        options: [
          "tie the change log to the exact file versions — the three changes' states read from the record, and the client's count presented with its dated version named",
          "tell the client to re-read the report that repeats Wednesday's number, since the notebook's past is the notebook's own",
          "delete Tuesday's version and re-run from Monday's, resigned to whatever number survives the rerun",
          "trust Wednesday's number as the week's answer, since newer outranks older and the notebook's silence is its own proof",
        ],
        answer: 0,
        ref: "PSF-AAI · da Configuration Tracking FSC L1 descriptor (lib/fixtures/rowspec/it.ts:697–699)",
        distractorNotes: [
          "The fit: the log's tie-back act — file versions' states named from the record, and the count presented dated.",
          "Re-read-the-report leaves the client living in the version nobody explains — the notebook's own silent state does not read from the log; the client's answer is the record's, not the book's.",
          "Delete-and-rerun destroys the versions the log's record protects — the reproducibility printed is the record's rerun from accountable states, not from surviving deletions.",
          "Newer-outranks-older is myth without the record — the version's say comes from its log's state and its date, not from the date of its file age.",
        ],
      },
      // Q3 judgment — reproducibility at the squeezed delivery
      {
        skill: "Configuration Tracking",
        catalogSkill: "Configuration Tracking",
        stem:
          "Delivery squeezed: the script's last-mile change unexecuted and the client waiting. A teammate offers to e-mail the notebook-cum-results and skip the change log entirely, on the reasoning that the audience never reruns anything anyway.",
        options: [
          "log the change as it lands and deliver with the record attached — the audience's non-rerunning is their business, and the analysis' record is the deliverable's own receipt",
          "deliver unlogged on the teammate's promise — the audience's never-rerunning absolves the desk's record, and tonight's delivery beats every possible rerun",
          "deliver unlogged, but whisper the changed state to the client so their photograph carries the proof",
          "delay the delivery to the weekend's quiet, so the log finds its time in a desk unhurried",
        ],
        answer: 0,
        ref: "PSF-AAI · da Configuration Tracking FSC L1 descriptor (lib/fixtures/rowspec/it.ts:697–699)",
        distractorNotes: [
          "The fit: the record carried with the delivery — delivered and logged together, and the change's own receipt's shape",
          "Unlogged on the teammate's promise skips the log for hope's audience — the never-rerunning is a bet no record ever stamps, and the deliverable's own evidence waits for it.",
          "Whispered-proofs to the client outsource the record — the log's own file is the reproducibility's instrument, and the whisper's photograph holds no rerun.",
          "Weekend-delay trades the log's place in the unbeaten deadline — the delivery and the log run together, and the weekend undelivers both.",
        ],
      },
    ],
  },

  {
    skill: "Stakeholder Management",
    catalogSkill: "Stakeholder Management",
    items: [
      // Q1 recognition — the L2's two-knowledge acts
      {
        skill: "Stakeholder Management",
        catalogSkill: "Stakeholder Management",
        stem:
          "The stakeholder role's card lists the level-2 acts: know who you report to, who consumes your reports, and keep both in the loop. What does a quarter of that role show?",
        options: [
          "the two tracks known by name — the reporting line and the report's consumers — with both kept informed across the quarter's work",
          "sending the report to whichever manager compliments your work loudest, since the loop's tone rewards the complimenters",
          "guessing the readership from the org chart's vibes, since the chart's shapes find their own truth",
          "sending each reader a different number and letting them argue, since the disagreement is the report's own metric",
        ],
        answer: 0,
        ref: "PSF-AAI · da Stakeholder Management FSC L2 descriptor (lib/fixtures/rowspec/it.ts:705)",
        distractorNotes: [
          "The fit: the printed two acts — the reporting line and the consumers known, both kept in the loop.",
          "Compliment-routing rewrites the loop to listen to praise — the printed act runs to the named readers, and the compliment's loudest desk receives neither the loop nor the report.",
          "Org-chart vibes are a guess where the act says know — the reporting line and readership are named facts, known by the desk's own record.",
          "Different-numbers-per-reader empties the loop's information — the same report's truth reaches each named reader, and divergence is a report's own failure.",
        ],
      },
      // Q2 application — the information needs of stakeholders (CWF key task 2)
      {
        skill: "Stakeholder Management",
        catalogSkill: "Stakeholder Management",
        stem:
          "Your forecast goes from your manager onto the directors' Monday review. Two readers, one report, and the client's numbers changed once this week.",
        options: [
          "aid the readers' understanding of the information they need for decisions — the forecast's update shared with both, per each reader's information need",
          "send the manager the updated number and leave the directors' packet last Monday's, since the directors' deck is the manager's own department anyway",
          "post both readers the forecast's raw workbook and let their sheets each decide its own truth",
          "ask each reader which version they'd prefer to hear, and send them their preference",
        ],
        answer: 0,
        ref: "PSF-AAI · da Stakeholder Management CWF key task 2 “Aid in understanding the information needs of stakeholders for decision-making” (lib/fixtures/rowspec/it.ts:706)",
        distractorNotes: [
          "The fit: the printed key task — the stakeholders' decision-serving information needs served, and both readers carrying the week's one updated number.",
          "Manager-updated-directors-stale splits the loop — both readers print into the same report, and last Monday's number is last Monday's decision bait.",
          "Raw-workbook-to-everyone hands the analysis's own reading to the readers' individual interpretation — the printed act serves the readers' information needs with the read result.",
          "Preference-sent-numbers is the loop reversed — the readers' preferences are met through the one truth's own report, and the preference-pick manufactures divergence.",
        ],
      },
      // Q3 judgment — both kept in the loop under pressure
      {
        skill: "Stakeholder Management",
        catalogSkill: "Stakeholder Management",
        stem:
          "Thursday's review moved, and the directors read the packet before your manager sees it. One director asks aloud where the week's churn fits, and your manager is out of reach.",
        options: [
          "answer the question with the report's own facts, and close the loop by getting the week's change to your manager on sight — both readers informed as the row's printed acts hold",
          "answer with last Monday's stale number and wave the week's churn away, since the moved review is the manager's calendar's own fault anyway",
          "say nothing and wait for your manager, so the directors' question deadlocks the whole packed hall",
          "forward the raw workbook to the directors by e-mail so their own reading covers the gap",
        ],
        answer: 0,
        ref: "PSF-AAI · da Stakeholder Management FSC L2 descriptor (lib/fixtures/rowspec/it.ts:705)",
        distractorNotes: [
          "The fit: the printed keep-both-in-the-loop act carried under pressure — the question answered with the report's facts, and the manager's closing catch-up on sight.",
          "Monday's-number-and-wave violates both halves — the directors' carried answer is the week's real number, and the manager's calendar is nobody's substitute for the churn's disclosure.",
          "Silent-waiting freezes both loops — the question's ask deserves the report's facts, and your manager's catch-up runs on sight.",
          "Raw-workbook-forwarding bypasses the read report — the printed act serves the readers' needs, and a workbook is analysis's engine sent where its answer was owed.",
        ],
      },
    ],
  },

  // ════════════ wave 2 · soc · SOC Analyst (extension E4, roster-listed) ════
  // Anchors: TESDA Cyber Threat Monitoring NC I units + PSF-SDS SOC CWFs (rowspec
  // lines 571–627), O*NET 15-1212.00 task pulls (research/onet-enrich/pulls/).
  // PSOC 2523 lettered lines ride as the PSOC-side anchor where cited.
  {
    skill: "Monitor cyber security systems",
    catalogSkill: "Monitor cyber security systems",
    items: [
      // Q1 recognition — the CWF's monitoring acts
      {
        skill: "Monitor cyber security systems",
        catalogSkill: "Monitor cyber security systems",
        stem:
          "The queue's card lists the CWF's acts verbatim: “Perform real-time analysis and trending of security log data… Analyze security event data to identify suspicious and malicious activities… Provide inputs to improve security monitoring rules and alerts.” What fills a watching shift?",
        options: [
          "the log data's real-time analysis and trending, security events analyzed for the suspicious and malicious, and inputs offered back to the rules and alerts",
          "an hour each shift reading the quarterly SOC newsletter, with the logs' feed left to whatever technology runs alone",
          "the alert stream forwarded to the entire company each morning, so every office's eyes share the load",
          "the feed's volume tuned down to one alert per hour so the queue's calm survives the week",
        ],
        answer: 0,
        ref: "PSF-SDS · soc Monitor cyber security systems CWF key tasks verbatim (lib/fixtures/rowspec/it.ts:575)",
        distractorNotes: [
          "The fit: the printed acts walked — real-time analysis and trending, event analysis for the suspicious, and inputs offered back to the monitoring rules.",
          "Newsletter-hour watches nothing — the printed act is the log data's analysis in real time, and the feed runs through the shift's own eyes.",
          "Company-wide forwarding spills the events without reading them — the analysis act is the analyst's, and the whole-company channel reads nobody's queue.",
          "Volume-tuned-to-calm suppresses the analysis's object — the real-time analysis runs against the stream as it arrives, and a throttled queue is an unwatched one.",
        ],
      },
      // Q2 application — trend and correlate the queue (PSOC 2523 g + CWF)
      {
        skill: "Monitor cyber security systems",
        catalogSkill: "Monitor cyber security systems",
        stem:
          "Overnight the queue's two thousand alerts cluster heavily on one host, one alert-type repeating every nine minutes.",
        options: [
          "correlate the cluster's own pattern — the host and interval read, the alert-type's events analyzed, the finding trended into the shift's monitoring write-up",
          "acknowledge the two thousand as reviewed and file the count as the shift's throughput",
          "forward the raw CSV file to the general company channel and let the office's whole morning crowd read it all together",
          "conclude the host's alerts are the tool's own bug and mute the host's channel until IT answers",
        ],
        answer: 0,
        ref: "PSOC 2523 · g (research/snapshots/psoc/psoc2012-parsed.csv:287) + PSF-SDS · soc CWF “Analyze security event data to identify suspicious and malicious activities” (lib/fixtures/rowspec/it.ts:575)",
        distractorNotes: [
          "The fit: the analysis act against the cluster — host, interval, and type read and correlated, and the pattern trended per the shift's analysis.",
          "Acknowledge-without-reading fabricates the queue's state — the review act is the analysis itself, and a filed count is not a reading.",
          "Forwarding hands the queue's analysis to untrained crowds — the monitoring act runs at the analyst's desk and reports through its channels, not the general ones.",
          "Bug-conclusion mutes an unanalyzed signal — suspicious activity on one host may be exactly what the nine-minute pattern says it is; the mute hides the finding instead of analyzing it.",
        ],
      },
      // Q3 judgment — inputs to the rules (CWF "Provide inputs to improve…")
      {
        skill: "Monitor cyber security systems",
        catalogSkill: "Monitor cyber security systems",
        stem:
          "Your cluster analysis lands: one alert-type fires nine-minute noise all week while a genuinely odd single event sits buried inside it. The monitoring rules' owner is on leave; the shift lead asks your proposal.",
        options: [
          "propose the rule's change with the week's evidence — the noisy type's tuning suggested, and the buried event's review requested before anyone declares it noise",
          "tune the rule's thresholds down yourself during the owner's leave, and re-run the queue's reading against your own edit",
          "bury the odd event as noise and report the queue as cleared, saying a week's patterns deserve the week's silence",
          "amend the alert-type's definition to include the odd event so the noise and the signal send one merged alert",
        ],
        answer: 0,
        ref: "PSF-SDS · soc CWF “Provide inputs to improve security monitoring rules and alerts” (lib/fixtures/rowspec/it.ts:575)",
        distractorNotes: [
          "The fit: the CWF's inputs-to-improve act — the rule's change proposed with evidence, and the odd event's review requested rather than presumed.",
          "Self-tuning during the owner's leave edits the monitoring rules alone — the CWF's act is provide-inputs, and the rule's edit routes through its owner's review.",
          "Bury-the-odd decides the buried event's fate without a review — suspicious activity's identification is the print's central act, and the burial calls it noise unread.",
          "Merging-noise-and-signal destroys both — the alert-type's definition is a monitoring rule's own instrument, and an unvetted merge hides the signal in the noise's shadow.",
        ],
      },
    ],
  },

  {
    skill: "Maintain cyber security operations",
    catalogSkill: "Maintain cyber security operations",
    items: [
      // Q1 recognition — the maintain CWF's three keys
      {
        skill: "Maintain cyber security operations",
        catalogSkill: "Maintain cyber security operations",
        stem:
          "The operations card lists the Tier-1 maintain keys: “Maintain data sources feeding the log monitoring system · Schedule security checks in accordance with reporting schedules · Prepare periodic status reports for presentation to management.” What do the keys keep running?",
        options: [
          "the data sources feeding the log monitoring system, the checks' schedule aligned to the reporting schedule, and the management's periodic status reports",
          "the headphones' battery health and the desk's playlist quality, since a midnight shift's comfort is the operations' own maintenance",
          "the check schedules' disabling whenever a check begins to fail, since failing checks are louder than healthy ones",
          "the next audit's anticipation — the operations' maintenance waits for the auditors' list and runs to it",
        ],
        answer: 0,
        ref: "PSF-SDS · soc Maintain cyber security operations CWF key tasks verbatim (lib/fixtures/rowspec/it.ts:583)",
        distractorNotes: [
          "The fit: the card's three keys walked — the sources maintained, the checks scheduled to reporting, the status reports prepared for management.",
          "Headset comfort is shift furniture, not operations — the printed keys keep the monitoring system's inputs and outputs running, and comfort maintains neither.",
          "Disabling-failing-checks mutes the operation it claims to maintain — the check's failure is the maintenance's own signal to fix, and a silenced check maintains nothing.",
          "Audit-waiting inverts the periodic reporting — the status reports run to management's schedule, and the operations run on their own active cadence, not the audit's.",
        ],
      },
      // Q2 application — midnight's quiet and the checks on schedule
      {
        skill: "Maintain cyber security operations",
        catalogSkill: "Maintain cyber security operations",
        stem:
          "It's midnight on a quiet shift. The reporting schedule wants the security checks run by 6 a.m., and one data source's feed arrived late.",
        options: [
          "maintain the feeding data source's state, run the checks per the schedule, and prepare the status report's notes for the morning's management",
          "let the late feed's silence stand and run the checks as best as the warn's life allows — the report's honesty shrinks so nobody questions the queue",
          "switch off the checks until the feed's return, since a check against a silent feed would be nothing anyway",
          "wait for daytime staff to return and let them own the checks' schedule and the feed's question entirely",
        ],
        answer: 0,
        ref: "PSF-SDS · soc Maintain cyber security operations CWF key tasks (lib/fixtures/rowspec/it.ts:583)",
        distractorNotes: [
          "The fit: the printed keys applied to the midnight's own facts — the source maintained, the checks run per schedule, the report's notes prepared.",
          "Silence-stand-and-shrink falsifies the status report — the feed's state is reportable, and its honesty is the management's scheduled reading.",
          "Checks-against-silence switch off the schedule the card prints — the checks run per the reporting schedule even when a source is quiet, and the quiet's record lands in the report.",
          "Daytime-hop abandons the Tier-1's own shift — the on-call signature keeps the shift's checks on schedule, and the day shift arrives to feed states, not to begin them.",
        ],
      },
      // Q3 judgment — the failing check's report, not its silence (Prepare periodic status reports)
      {
        skill: "Maintain cyber security operations",
        catalogSkill: "Maintain cyber security operations",
        stem:
          "Thursday's status report due Friday. Wednesday's scheduled check failed, and the feed's vendor says the fix lands Monday.",
        options: [
          "report the check's failure and the vendor's timeline in the status report per the schedule, with the interim exposure stated plainly",
          "report the queue as fully green — the vendor's fix is Monday's news, and the interim's three days belong to next Thursday's report instead",
          "delete the failed check from the reporting table entirely — a check that failed on midnight's thin cover is next week's story",
          "escalate the failure straight to the board mid-meeting without telling your own shift lead first",
        ],
        answer: 0,
        ref: "PSF-SDS · soc CWF “Prepare periodic status reports for presentation to management” (lib/fixtures/rowspec/it.ts:583)",
        distractorNotes: [
          "The fit: the status report's honesty per schedule — the check's failure and its timeline stated, the interim's exposure named until the vendor's fix lands.",
          "Green-today-report-tomorrow postpones the failure out of the report's coverage — the report's periodicity is the print's own rule, and three unreported days are operations hidden from management.",
          "Deleting-a-failed-check rewrites the reporting table — the report's table carries what ran, and the failed check's record is the management's own sight.",
          "Board-hop flies past the shift lead — the status reports reach the presentation route per the printed schedule, and the escalation's channel runs through the desk's own chain.",
        ],
      },
    ],
  },

  {
    skill: "Manage response to cyber security incidents",
    catalogSkill: "Manage response to cyber security incidents",
    items: [
      // Q1 recognition — the incident lifecycle's printed path
      {
        skill: "Manage response to cyber security incidents",
        catalogSkill: "Manage response to cyber security incidents",
        stem:
          "The incident-response card lists the CWF's path verbatim: analyze the type and severity · provide status updates during the lifecycle · prepare the final incident report. What is the analyst's route on a live incident?",
        options: [
          "the incident's type and severity analyzed, status updates provided through the lifecycle, and the final incident report prepared",
          "the incident's type graded by whoever shouts it first, with the final report drafted by the intern's guess",
          "the press release drafted before anyone contains anything",
          "the server wiped to end the incident, and the final report filed as \"resolved by reinstallation\"",
        ],
        answer: 0,
        ref: "PSF-SDS · soc Manage response CWF key tasks verbatim (lib/fixtures/rowspec/it.ts:591)",
        distractorNotes: [
          "The fit: the printed path walked — the type and severity analyzed, updates through the lifecycle, the final report prepared.",
          "Shout-graded severity misleads the response's own priority — the analysis act produces the type and severity, and no voice's urgency substitutes it.",
          "Press-first reverses the incident's lifecycle — the updates' own channel is the stakeholder reporting line, and the press waits until the path's facts exist.",
          "Wipe-to-resolve destroys the evidence the final report's own record rides on — the path's print prepares the report from the events' own record, not from an installation's disappearance.",
        ],
      },
      // Q2 application — a live intrusion's lifecycle
      {
        skill: "Manage response to cyber security incidents",
        catalogSkill: "Manage response to cyber security incidents",
        stem:
          "A confirmed intrusion is live at a client site. Your desk carries the response's reporting slice, and the containment crews work on-site.",
        options: [
          "analyze the type and severity, provide the status updates through the incident's lifecycle to its stakeholders, and ready the final report against the events' record",
          "wait for the attacker's boredom — attackers tire, and the containment note's duty belongs to specialization anyway",
          "release the incident's severity publicly to pressure the vendor's contract renewals",
          "rebuild the client's affected systems all alone over the weekend, so your report's own facts are the clean ones you built there",
        ],
        answer: 0,
        ref: "PSF-SDS · soc Manage response CWF key tasks (lib/fixtures/rowspec/it.ts:591)",
        distractorNotes: [
          "The fit: the printed three acts against the live incident — severity analyzed, updates flowed, and the final report readied against the events' record.",
          "Boredom-wait leaves the lifecycle unreported — the incident's severity and updates are the analyst's slice, and the attacker's patience is not a response plan.",
          "Public-severity-pressure is a commercial act — the incident's severity reports through the stakeholder line, and a vendor's pressure is a contract's question, not the response's channel.",
          "Weekend-rebuild destroys the events' record your report reads — the final report connects to the incident's own facts, and a clean rebuild is a fact the report must read and describe, not invent.",
        ],
      },
      // Q3 judgment — the final incident report's truth through the events
      {
        skill: "Manage response to cyber security incidents",
        catalogSkill: "Manage response to cyber security incidents",
        stem:
          "The final incident report's draft is due. The containment's logs read heavier than the narrative's clean story — one skipped alert will embarrass the team's SLA number.",
        options: [
          "prepare the final report detailing the events of the incident as they ran — the skipped alert's record included in the events' own path",
          "trim the skipped alert out of the final report, letting the events' record hold one cleaner path than the alert's",
          "send the report's narrative to the client today and append the logs' file as a follow-up only if the client's team asks for them",
          "change the skipped alert's timestamps in the logs so the report's timeline and the events' record agree on a later version",
        ],
        answer: 0,
        ref: "PSF-SDS · soc CWF “Prepare final incident report detailing the events of the cyber security incident” (lib/fixtures/rowspec/it.ts:591)",
        distractorNotes: [
          "The fit: the print's act — the final report details the events as the incident ran, and the skipped alert's record rides in the events' own path.",
          "Trimmed narratives rewrite the events — the report's own telling is the events' record, and the skipped alert's omission is a fact the report invents.",
          "Follow-up-logs divide the record from the telling — the client's own reading is met through the official updates and the final report, and logs-as-appendix-by-request hand the timeline over twice.",
          "Timestamp-changes rewrite the record the report reads — the events' own record makes the timeline, and neither report nor logs invent their agreement.",
        ],
      },
    ],
  },

  {
    skill: "Threat Analysis and Defence · Threat Intelligence",
    catalogSkill:
      "Threat Analysis and Defence · Threat Intelligence and Detection (family FSC cross-cite)",
    items: [
      // Q1 recognition — what backs the queue's decisioning (TESDA knowledge + row's own what)
      {
        skill: "Threat Analysis and Defence · Threat Intelligence",
        catalogSkill:
          "Threat Analysis and Defence · Threat Intelligence and Detection (family FSC cross-cite)",
        stem:
          "The queue's second opinion on one suspicious login needs a base. Per the TESDA monitoring unit's own knowledge items: “Knowledge of attack framework” and “Malicious software behaviors.” What backs the call?",
        options: [
          "knowledge of the attack framework and the malicious software's behaviors — the login's indicators and the intelligence feeds' positions read against both",
          "the username's misspelled look alone, which reads suspicious by the eye's own taste",
          "the number of times you have ignored the same login before, which counts as the queue's own patience metric",
          "the geographic distance between the login's source and the client's office, since far-through proxies read suspicious anywhere",
        ],
        answer: 0,
        ref: "TESDA · unit ICT251312 knowledge items “1.11 Knowledge of attack framework · 1.10 Malicious software behaviors” (lib/fixtures/rowspec/it.ts:600) + CS-SOC analysis unit's intel/criteria (it.ts:600)",
        distractorNotes: [
          "The fit: the printed knowledge — the attack framework's and the malware behaviors' reading, with the indicators and the feeds' own positions riding them.",
          "Misspelling-alone is a spellcheck intuition, not a threat analysis — the printed knowledge is the framework's and the behaviors', and a username's taste belongs to neither.",
          "Ignored-count is a fatigue number, not an analysis — the login's indicators run against the frameworks and feeds, and the queue's own patience is no basis.",
          "Distance-alone is geography, not attack analysis — the proxies' geography may be entirely ordinary, and the frameworks' and behaviors' knowledge says where the login's actual weight sits.",
        ],
      },
      // Q2 application — indicators from the feeds consulted on live traffic
      {
        skill: "Threat Analysis and Defence · Threat Intelligence",
        catalogSkill:
          "Threat Analysis and Defence · Threat Intelligence and Detection (family FSC cross-cite)",
        stem:
          "A suspicious login's source IP appears on the team's threat-intel feed as a known scanner, and the queue's own alert's indicators arrive on two feeds' lists.",
        options: [
          "utilize the threat intelligence feeds' positions on the login's own indicators — the feed's scanner listing read against the alerts' indicators and the correlation offered back to the queue",
          "consult the feeds themselves on the login's own indicators? never agree to it — the login's own strength says all the threat's judgment needs",
          "consult the feeds on the username alone, since the feeds' lists check names the same way they check IPs",
          "tweet the queue's alert to the industry's feed, since a concern shared is a concern half-handled",
        ],
        answer: 0,
        ref: "TESDA · CS-ICT251112 criterion “1.5 Threat intelligence feeds are utilized” + knowledge “1.4 Indicators of compromise” (lib/fixtures/rowspec/it.ts:600)",
        distractorNotes: [
          "The fit: feeds utilized on the indicators of compromise — the login's read against the feeds' listings, and the correlation offered back into the queue's hands",
          "Feeds-never-consulted is the analyst's own strength given the whole answer — the feeds' positions are the intel's own route, and the login's strength is an indicator among the printed pieces",
          "Names-against-feeds misreads the feeds' coverage — usernames are policy's field, and the intel feeds' positions ride on IPs, domains, and hashes, with the login's name reading against the account's own context instead",
          "Tweet-shared alerts leak the client's own events — the queue's correlation is the desk's analysis's work, and the industry's feed receives the feed-controlled lists nobody writes",
        ],
      },
      // Q3 judgment — the false positive's reading
      {
        skill: "Threat Analysis and Defence · Threat Intelligence",
        catalogSkill:
          "Threat Analysis and Defence · Threat Intelligence and Detection (family FSC cross-cite)",
        stem:
          "The team's feed lists the source IP as a known scanner, and two alerts carry its path. The client's own IT confirms the IP belongs to one of their own auditors' machines. The alert queue wants a verdict.",
        options: [
          "read the verdict with all three facts — the feed's listing, the alerts' indicators, and the client's confirmation — and route the finding as a false positive with the evidence, amending the rule's exclusion through its owner's review",
          "hold the feed's verdict above the client's — the feed's listing is the intel's whole authority, and the client's confirmation is a polite correction the team deals with never at all",
          "pick the client's confirm alone and never record the intel feed's listing — a confirmed auditor's machine ends the reading, and the queue's alert closes unmarked",
          "report the machine's IP as a compromise on the feed's listing — the intel's rule outranks machines' and any client's attendance anywhere",
        ],
        answer: 0,
        ref: "TESDA · CS-ICT251112 criterion “1.5 Threat intelligence feeds are utilized” (lib/fixtures/rowspec/it.ts:600) + PSF-SDS · soc CWF “Provide inputs to improve security monitoring rules and alerts” (it.ts:575)",
        distractorNotes: [
          "The fit: the feeds' listing read together with the client's confirmation — the false positive's routing and the rule's exclusion's amendment routed through its owner's review.",
          "Feed-verdict-above-client is authority without the audit context — the feed's listing stores the intel's positions, and the client's confirmation is the machine's own key fact, whose read reorders the verdict.",
          "Client-confirm-only drives the feed's intel off the read — false positives ride the exclusion's own amendment, and an unrecorded feed's verdict is the queue's next alert's ignorance",
          "Report-as-compromise trusts the feed's list as a fact — the client's confirmation of the auditor's machine is the verdict's fact, and the feed's listing does not make the machine a compromise",
        ],
      },
    ],
  },

  {
    skill: "Vulnerability scanning (TESDA-printed)",
    catalogSkill: "Vulnerability scanning (VAPT-adjacent, TESDA-printed)",
    items: [
      // Q1 recognition — the unit descriptor's three parts
      {
        skill: "Vulnerability scanning (TESDA-printed)",
        catalogSkill: "Vulnerability scanning (VAPT-adjacent, TESDA-printed)",
        stem:
          "The TESDA unit descriptor reads: “…conduct vulnerability scanning. It includes checking schedule for scanning, conducting scanning of assets and providing report of scanning.” The scanning day's three parts:",
        options: [
          "the schedule checked first, the assets scanned per the plan, and the scan's report provided to the review channel",
          "the schedule ignored, the assets guessed, and the report filed as-PDF-because-nobody-opens-it",
          "one unified scan a year, reusing last year's report, since the schedule's constancy beats its frequency",
          "scanning whichever system made the news this week, since the queue's gaze is the schedule's own instinct",
        ],
        answer: 0,
        ref: "TESDA · unit ICT251313 descriptor verbatim (lib/fixtures/rowspec/it.ts:607)",
        distractorNotes: [
          "The fit: the descriptor's three named parts — the schedule checked, the scanning conducted, the report provided.",
          "Ignore-and-guess skips the schedule's check and the assets' verification — the unit's parts run their order, and the report's PDF joke files nothing actual.",
          "One-scan-a-year replaces the schedule with stasis — the descriptor's checking acts run against the schedule as it stands, and the re-used report is last cycle's assets, not these.",
          "News-driven scans read the day's headline — the schedule's assets are the unit's own list, and the day's news is no substitute for the client's assets.",
        ],
      },
      // Q2 application — the scanning day's verified scope
      {
        skill: "Vulnerability scanning (TESDA-printed)",
        catalogSkill: "Vulnerability scanning (VAPT-adjacent, TESDA-printed)",
        stem:
          "First Tuesday: scanning day. The assets list in the unit's criteria is verified with the supervisor and change manager per the scope of work.",
        options: [
          "check the schedule as the criteria print it — the assets list verified against the supervisor's and change manager's scope, then scan per the schedule and file the report to its reviewers",
          "scan first and verify only if the tools flag something unusual at all — the schedule's check is a formality when the scanning's speed matters most",
          "ask the client which assets they'd rather give from the list above, and scan only those with a friendly summary note",
          "file the report without scanning, since the clients' last scanner's list usually repeats itself",
        ],
        answer: 0,
        ref: "TESDA · unit ICT251313 elements/criteria “2.1 List of assets… verified with supervisor and change manager based on scope of work” · “3.3 Vulnerability assessment report is submitted…” (lib/fixtures/rowspec/it.ts:609)",
        distractorNotes: [
          "The fit: the criteria's order is the day's own steps — the list verified with the supervisor and change manager, the scanning per the schedule, and the report submitted to its reviewers.",
          "Scan-first-verify-if-run unreads the criteria — the scope of work's verification is its first criterion, and the scanning's speed answers to that order, not against it.",
          "Client-picks-skips the supervisor's verification — the list's own custody is with the supervisor and the change manager, and “friendly summary notes” change the report's review's reader.",
          "File-without-scanning is a report's fiction — the unit's third part needs the second's act, and last cycle's list never verified these assets.",
        ],
      },
      // Q3 judgment — schedule-vs-panic (the criteria's own check)
      {
        skill: "Vulnerability scanning (TESDA-printed)",
        catalogSkill: "Vulnerability scanning (VAPT-adjacent, TESDA-printed)",
        stem:
          "Mid-week headlines name a fresh CVE in one of the client's devices. Your scheduled scanning day is next week, and a department head in the client's office wants an ad-hoc scan today.",
        options: [
          "consult the schedule's authority with the immediate supervisor per the criteria — the ad-hoc ask weighed against the plan, the device's exposure staged through the brief's own escalation",
          "scan today without checking the schedule — headline urgency reads its own plan, and the supervisor's perimeter is a formalism nobody waits for",
          "refuse the ad-hoc scan entirely and send the client a schedule reminder, since the CVE's exposure cannot wait inside a plan's letter",
          "delay the scan silently until the headlines age, since an ad-hoc request would add unplanned hours to the team",
        ],
        answer: 0,
        ref: "TESDA · unit ICT251313 criterion “1.1 Vulnerability management is consulted with the immediate supervisor” + “2.3 Prescribed schedule for vulnerability scanning is adhered to” (lib/fixtures/rowspec/it.ts:609)",
        distractorNotes: [
          "The fit: the criteria's order honored — the supervisor consulted on the schedule's plan and the ad-hoc ask, and the device's exposure staged through its escalation",
          "Scan-today-without-the-check is regulation against the criteria's first act — the schedule's plan is verified with the supervisor, and headline urgency is not a criterion's own roadmap",
          "Refuse-with-reminder gives the CVE a date rather than an answer — the schedule's own plan sets the criteria, and the client's device's CVE answers through the supervisor's escalation, not against it",
          "Delaying until the headlines age ignores the CVE's exposure window — the escalation consults the supervisor on any change to the plan, and a silent delay without that consultation is neither diligence nor discretion.",
        ],
      },
    ],
  },

  {
    skill: "Network security understanding",
    catalogSkill: "Network security understanding (network administration family)",
    items: [
      // Q1 recognition — the TR's network knowledge + alert-source range
      {
        skill: "Network security understanding",
        catalogSkill: "Network security understanding (network administration family)",
        stem:
          "The TESDA knowledge line reads: “Basic knowledge with network infrastructure and architecture, i.e. LAN, WAN, port forwarding,” and the unit's alert-source range names firewall, web app firewall, EDR, and NDR alerts. What reads the queue's alert well?",
        options: [
          "the network's architecture read — LAN, WAN, and port forwarding understood, with the alert's source's own channel read for what it says about the traffic's path through the network",
          "a client's forgotten password reminder note, since the queue's immediate context is the user whose own name reaches every machine's handler",
          "the office's router blinking green as the LAN's own verdict, with everything else filed as an unknown channel's sound",
          "the alert's raw text encrypted into nobody's reading, so the whole queue stays a mystery for the newer ticket",
        ],
        answer: 0,
        ref: "TESDA · TR NC I knowledge “1.4 Basic knowledge with network infrastructure and architecture, i.e. LAN, WAN, port forwarding” + unit ICT251312 range “1.3 Firewall alert · 1.4 Web application firewall alert · 1.6 EDR alert · 1.7 NDR alert” (lib/fixtures/rowspec/it.ts:615–616)",
        distractorNotes: [
          "The fit: the printed knowledge — the architecture's shapes (LAN, WAN, port forwarding) and the alert's own source's channel read for the traffic's path.",
          "Password-reminders are a support desk's own work — the network's architecture is what reads the alert, and the user's own password arrives nowhere near its read.",
          "Router-blink-verdict is a light's anecdote — the alert's own source (firewall, WAF, EDR, NDR) is the reading's printed instrument, and the blinking green is the room's own mood.",
          "Encrypted-raw-text is the queue's non-reading — the alert's channel and the network's shapes are exactly what makes the read, and the raw mystery is a queue nobody has read.",
        ],
      },
      // Q2 application — the block alert read against the routes
      {
        skill: "Network security understanding",
        catalogSkill: "Network security understanding (network administration family)",
        stem:
          "An EDR block alert fired, and LAN traffic is routing strangely through one segment while the rest of the floor hums along normal.",
        options: [
          "read the alert against the segment's architecture — the block's rule, the traffic's alternative path, and what the EDR's channel means for the machine's own agent",
          "conclude the whole LAN is compromised at once and call a company-wide shutdown of every single connection and every machine",
          "assume the alert-reading platform invented the phrase and disable the block rule permanently",
          "tell the floor that strange routing is what LANs actually do and close the day's reading",
        ],
        answer: 0,
        ref: "TESDA · unit ICT251312 criteria “1.1 Detection alert is received as per company Standard Operating Procedure” + range “EDR alert · NDR alert” (lib/fixtures/rowspec/it.ts:615–616) + PSOC 2523 · f, g (research/snapshots/psoc/psoc2012-parsed.csv:287)",
        distractorNotes: [
          "The fit: the alert sourced per the SOP — the EDR's channel read against the segment's architecture and traffic's path, as the network's own architecture print expects",
          "One Strange segment does not unmake the whole LAN — the architecture level read triggers the segment's behavior apart from the floor's normal state, and a shutdown punishes the un-affected",
          "Disabled rule silences detection — the block's mode exists so the read happens through it, and disabling it removes the segment's frame from the architecture's own route",
          "Strange-as-LAN-normal eliminates the read entirely — the network's integrity assurance runs on noticing what's strange, per the protection-detection-response print's architecture",
        ],
      },
      // Q3 judgment — the alert SOP's own path
      {
        skill: "Network security understanding",
        catalogSkill: "Network security understanding (network administration family)",
        stem:
          "The alert's SOP names the analysis-and-escalation route, and a teammate suggests skipping the SOP this once, citing the alert's obvious look.",
        options: [
          "receive the alert per the SOP — the obviousness of an alert's look is never a reason to skip the route's own analysis and escalation steps",
          "skip the SOP this once and keep the process intact otherwise — the obvious alert's reading saves route time, and the route's next-round arrives by routine",
          "escalate the alert immediately without any analysis and let the SOP's rest fall where it may",
          "delete the alert from the queue and re-file it tomorrow with the morning's fresh context",
        ],
        answer: 0,
        ref: "TESDA · unit ICT251312 criterion “1.1 Detection alert is received as per company Standard Operating Procedure (SOP)” (lib/fixtures/rowspec/it.ts:615)",
        distractorNotes: [
          "The fit: the SOP's own route carried — an alert's obvious look is the analysis's own entry point, and the route's steps run as the SOP prints them.",
          "Skip-this-once unbuilds the route's discipline — the SOP's steps run every alert each time, and an obvious alert's route-time saving is a culture's slide.",
          "Immediate-escalation-without-analysis hands the SOP's analysis away — the first-line read is the route's begins with, and it arrives before the escalation's own row",
          "Deleted-and-refiled tomorrow is the queue's non-receipt — the alert's route is received as it arrives, and the SOP's own reading doesn't buy tomorrow's fresh context",
        ],
      },
    ],
  },

  // shared cybersec + soc enabling ladder (same catalog row name on both maps)
  {
    skill: "SOC · Cybersec Enabling row",
    catalogSkill: "Collaboration · Communication · Problem Solving · Digital Fluency (Enabling)",
    items: [
      // Q1 recognition — the ESC bundle's honest dup-cell print (CYB-V2)
      {
        skill: "SOC · Cybersec Enabling row",
        catalogSkill: "Collaboration · Communication · Problem Solving · Digital Fluency (Enabling)",
        stem:
          "The escalation room's bundle carries the war-room behavior layer. Which two skills sit at the Advanced mark?",
        options: [
          "Collaboration and Communication",
          "Digital Fluency and Problem Solving",
          "Decision Making and Creative Thinking",
          "Sense Making and Transdisciplinary Thinking",
        ],
        answer: 1,
        ref: "PSF-SDS · cybersec/soc ESC cells as printed, dup-cells kept per CYB-V2 (lib/fixtures/rowspec/it.ts:446, 620–621)",
        distractorNotes: [
          "Collaboration and Communication print at Intermediate (stage I) — the dup-cells sit on the other two.",
          "The fit: the printed cells carry Digital Fluency and Problem Solving at Advanced (dup print kept as evidenced, not cleaned).",
          "Decision Making and Creative Thinking print on the SOC list's bundle, but not at the Advanced cell.",
          "Sense Making and Transdisciplinary Thinking print at Intermediate — never at the dup-cell's head.",
        ],
      },
      // Q2 application — war-room communication (O*NET 15-1212 work activities)
      {
        skill: "SOC · Cybersec Enabling row",
        catalogSkill: "Collaboration · Communication · Problem Solving · Digital Fluency (Enabling)",
        stem:
          "Five desks, one war room, an active incident hour two. Requested: what the collaboration and communication layers do.",
        options: [
          "share the facts as found with the supervisor channel per the monitoring print, decide problems together, and document the calls as the recording work activity carries",
          "each desk investigates alone in silence and reports only when solved, since work's private pause is the deep investigation's friend",
          "dedicate the war room's first hour to assigning the incident's blame, then start the working",
          "mute the channel until the director arrives, since the senior's word carries the room's only record",
        ],
        answer: 0,
        ref: "O*NET 15-1212.00 · work activities “Communicating with Supervisors, Peers, or Subordinates” (75) · “Documenting/Recording Information” (76) (lib/fixtures/rowspec/it.ts:624)",
        distractorNotes: [
          "The fit: the two expected work activities printed — communicating with the supervisors and peers, and documenting and recording the shared information",
          "Silent-solo investigations remove the communications activity from the response — the war room's own function is the shared reading, and the dashboards stay shared",
          "Blame-hour spends the war room's minutes on the room's failure rather than the incident's — the Problem Solving and reporting fragments of the printed sprint stay on facts and decisions",
          "Director-muting rides on the channel's alone — the monitoring's shared report's role is the supervisor channel, and the room's record is the documentation work activity, not one arriving man's word",
        ],
      },
      // Q3 judgment — communication through and after the shift (its signature behavior clause)
      {
        skill: "SOC · Cybersec Enabling row",
        catalogSkill: "Collaboration · Communication · Problem Solving · Digital Fluency (Enabling)",
        stem:
          "Your shift leaves the war room at 6 a.m. and the successor arrives in an hour. The incident is still live, and one desk decides the handover's shape.",
        options: [
          "communicate the incident's state in the written record's own form — the work's live state documented for the successor's own started work",
          "keep an oral handover alone, since the written record never matches the room's own live voice and working speed anyway",
          "leave a note of the whole worst worst-case, since scared successors fill the gaps on their own",
          "tell the successor “the desk talks for itself” and leave the desk's records to their own reading",
        ],
        answer: 0,
        ref: "PSF-SDS · soc role overview behavior sentence (lib/fixtures/rowspec/it.ts:623) + O*NET 15-1212 · “Documenting/Recording Information” (it.ts:624)",
        distractorNotes: [
          "The fit: the printed role overview's taking-on acts — the incident's state communicated in the record's own written form, and the successor's started work carried",
          "Oral-only handover leaves the record's own state empty — the documentation activity is the record's printed path, and the live voice's speed carries nothing past the room's closing door",
          "Worst-case note instills panic rather than facts — the successor carries the current state given in the record, and the record is the room's truth rather than fear's coin",
          "Talk-for-itself leaves the successor's work at its own reading — the documented record's carrying is the communication act, and the desk's silence is the record's non-birth",
        ],
      },
    ],
  },

];

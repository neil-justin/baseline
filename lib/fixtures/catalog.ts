import type { Career, CareerTrack } from "@/lib/types";

/**
 * College-scope career catalog — 36 entry-level PH roles, transcribed verbatim
 * from `.scratch/career-path-readiness-research/catalog-roster-dole-ble.md`
 * (the canon roster; RULINGS section at the bottom is authoritative), now
 * converted to the BLESSED role specs (2026-10-30 per-track conversion
 * blessing, map.md): every role's skill rows follow
 * `.scratch/career-path-readiness-research/role-specs/<roleId>.md` (names
 * verbatim, blessed tiers, source tags per the row's own framework artifact;
 * deep per-row descriptor/anchor/provenance data lives in `lib/fixtures/
 * rowspec.ts`).
 *
 * Rules:
 *  - `skills` rows are VERBATIM from the blessed specs: name, tier
 *    (core/secondary), source tag ([PSF]/[TESDA]/[O*NET]/[ESCO]/[NACE]/[PSOC]),
 *    and the one-line student-facing "what". Paraphrase rows carry the
 *    constructed row name per the accepted-naming ruling; their flags ride
 *    the rowspec layer. ESC merges where sources print multiple PSF enabling
 *    skills keep the bundle as one row (ESC presentation ruling
 *    2026-10-29); mkt's ESC items print inside the artifact's own Primary
 *    list and are carried as that list prints them.
 *  - The four extension roles (E1 Data Analyst, E2 Executive Secretary,
 *    E3 Records Clerk, E4 SOC Analyst) carry demandBlock.status
 *    "institutional-judgment" = "not DOLE-BLE-justified — institutional
 *    judgment" (user ruling R4, 2026-10-29). NEVER render them as demand-named.
 *  - E1/E2/E3 skill maps are transcribed VERBATIM from
 *    `.scratch/career-path-readiness-research/pending-role-maps.md`
 *    (2026-10-29 extraction: E1 = full PSF-AAI Associate Data Analyst map,
 *    E2 = O*NET 43-6011.00, E3 = PSOC 4415 unit tasks + O*NET 43-4171.00
 *    corroboration; verify list §10 flagged extraction now read).
 *  - Canon demo Trio is a HARD GATE: `swd` (8 rows), `qa` (7), `its` (7),
 *    `da` (13), plus the extracted `execsec` (17) / `records` (11) maps stay
 *    byte-identical — the canonical Neil seed math (score 40, verified/
 *    claimed pattern) keys on these row names and counts
 *    (scripts/verify-fixtures.test.ts asserts it). The conversion enriches
 *    the other 30 roles per the blessed specs; the demo-trio deep data rides
 *    the rowspec layer.
 *  - 5.4 Administrative Officer was DROPPED (entry-level ruling R3: 2-year
 *    career target, not a direct-entry offer).
 *  - Demand citations median the DOLE-BLE JobsFit LMI Report 2013–2020 lists
 *    (in-demand / hard-to-fill entry numbers) — not the unread NJLMF 2025–26.
 *  - `psocCode` = PSOC 2012 unit group (as updated 2022) — the catalog's
 *    registered classifier; "PSOC 2025" was verified wanting (ruling R2).
 *  - Demo ids `swd` / `da` / `its` are frozen interop keys (resume engine
 *    synonyms.ts + DEMO_SUGGESTION_ORDER); they map to roster rows 2.1, E1, 2.4.
 *  - cybersec's display name is "Security Analyst" — the anchored rung's
 *    printed name (CYB-V3, ruled 2026-10-29; supersedes the roster family
 *    label).
 *  - audit row 11 (technology row) cites O*NET 31.0 · Technology Skills ·
 *    13-2011.00 — the O*NET version pin landed 2026-11-02 (4A fill: all 37
 *    served categories with served example tools; the Model C attribution
 *    placeholder is resolved, ADR 0005).
 */

export const TRACKS: CareerTrack[] = ["it", "business", "accounting", "office"];

export const TRACK_LABELS: Record<CareerTrack, string> = {
  it: "Computer & IT",
  business: "Business & Management",
  accounting: "Accounting & Finance",
  office: "Office & Administration",
};

/** StudentState.track (a TRACKS key) → its display label ("it" → "Computer &
 *  IT"); "" / unknown key → "" so undecided/legacy rows never print SHS-era
 *  strand vocabulary. */
export function trackLabelOf(trackKey: string): string {
  return TRACKS.includes(trackKey as CareerTrack) ? TRACK_LABELS[trackKey as CareerTrack] : "";
}

export const CAREERS: Career[] = [
  // == ─── Track 1 · Computer & IT (11: roster 2.1–2.9 + E1 + E4) ─────────────
  {
    // CANON LOCK (byte-identical rows): swd is Neil's seed role — the seed
    // math (SP 25×6/8 = 19) and bars key on these exact rows.
    id: "swd", // roster 2.1 (demo interop id)
    name: "Associate Software Developer",
    psocCode: "2512",
    psocTitle: "Software developers",
    track: "it",
    degreeMap: ["BSCS", "BSIT", "BSIS", "BSCpE"],
    entryRoute: "Campus hiring / internship pipelines → associate software engineer or developer-apprentice on a maintenance/change-request team (CMO 25 s. 2015; CMO 87 s. 2017).",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #212 (Programmer — Java/JSP/.Net/PHP)",
      note: "Also Hard-to-Fill #39 (Software Developer) and #10 (Computer Programmer) in the same report.",
    },
    roleSummary: "Writes and maintains application code to spec on a development team, then fixes and extends what ships.",
    skills: [
      { name: "Applications Development", tier: "core", sourceTag: "PSF", what: "Write and maintain application code to spec, the core day job." },
      { name: "Applications Support and Enhancement", tier: "core", sourceTag: "PSF", what: "Fix and extend live applications after release." },
      { name: "Agile Software Development", tier: "core", sourceTag: "PSF", what: "Work in sprint iterations with defined ceremonies." },
      { name: "Data Design / SQL + data modeling", tier: "core", sourceTag: "PSF", what: "Write efficient SQL, map business data to normalized relational schema." },
      { name: "Business Needs Analysis", tier: "secondary", sourceTag: "PSF", what: "Translate user requirements into technical specs." },
      { name: "Secure-coding practices", tier: "core", sourceTag: "PSF", what: "Avoid vulnerabilities during coding; supervised remediation." },
      { name: "Linux + web deployment basics", tier: "secondary", sourceTag: "PSF", what: "Command-line basics; deploy/administer a web app on Linux/cloud." },
      { name: "Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Self Management (Enabling Skills, Basic/Intermediate)", tier: "secondary", sourceTag: "PSF", what: "Team behavior layer at associate level." },
    ],
  },
  {
    // CANON LOCK (byte-identical rows): qa is the money-beat walk — the beat
    // math (dip → 35 → 52 → 59/67) and bars key on these exact rows; the
    // spec's 25-FSC card projection stays in role-specs/qa.md (ESC ruling).
    id: "qa", // roster 2.2
    name: "Software QA Analyst",
    psocCode: "2519",
    psocTitle: "Software and applications developers and analysts nec",
    track: "it",
    degreeMap: ["BSCS", "BSIT", "BSIS", "BSEMC (game-QA paths)"],
    entryRoute: "Manual QA on IT-BPM/service-desk floors or in-house QA on a fresh-grad cohort; ISTQB Foundation and test-script writing accelerate the move to automation (CMO 25 s. 2015, CMO 2 s. 2014).",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #216 (Quality Analyst, IT/BPM grouping)",
      note: "The source list places Quality Analyst under IT-BPM — employer usage spans both software QA and contact-center QA; the catalog serves both (2.2 here, 3.8 in Business).",
    },
    roleSummary: "Executes test cases, logs defects, and reads requirements into testable conditions before release.",
    skills: [
      { name: "Software Testing", tier: "core", sourceTag: "PSF", what: "Execute test cases across integration/system/regression/UAT levels." },
      { name: "Test Planning", tier: "core", sourceTag: "PSF", what: "Read requirements; write and prioritize test scenarios and test data." },
      { name: "Defect management", tier: "core", sourceTag: "PSF", what: "Log accurately into defect-tracking systems; verify fixes." },
      { name: "Quality Assurance / Quality Standards", tier: "core", sourceTag: "PSF", what: "Apply quality gates beyond individual bugs: metrics, coverage, release readiness." },
      { name: "Applications Support and Enhancement", tier: "secondary", sourceTag: "PSF", what: "Understand the applications being tested well enough to reproduce dev context." },
      { name: "Business Needs Analysis", tier: "secondary", sourceTag: "PSF", what: "Translate product requirements into testable conditions." },
      { name: "Customer Orientation · Digital Fluency · Learning Agility · Sense Making · Problem Solving (Enabling)", tier: "secondary", sourceTag: "PSF", what: "User-mindset testing, tool agility, fast learning." },
    ],
  },
  {
    id: "ba", // roster 2.3
    name: "Business Analyst (IT)",
    psocCode: "2511",
    psocTitle: "Systems analysts",
    track: "it",
    degreeMap: ["BSIS", "BSCS", "BSIT", "BSBA"],
    entryRoute: "Junior BA on internal systems teams or IT-BPM functional projects; requirements-workshop support under a senior BA (CMO 25 s. 2015).",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #44 (Business Analyst)",
      note: "Business & Management overlap — BSIS is the 'bridge between the technical and management/users communities' (CMO text).",
    },
    roleSummary: "Runs workshops, draws process models, and turns requirements into specs and user stories the build team can follow.",
    skills: [
      { name: "Requirements Analysis", tier: "core", sourceTag: "PSF", what: "Run interviews/workshops; gap analysis current→desired; document business rules." },
      { name: "Requirements Specification", tier: "core", sourceTag: "PSF", what: "Functional specs, user stories, wireframes; map requirements to architecture." },
      { name: "Solution Support (UAT & hand-over)", tier: "core", sourceTag: "PSF", what: "Coordinate user-acceptance testing; support deployment/training/change management." },
      { name: "Process modeling (flow diagrams, use cases)", tier: "core", sourceTag: "PSF", what: "Draw process flow / use-case models for analysis hand-off." },
      { name: "Business Needs Analysis", tier: "core", sourceTag: "PSF", what: "Frame stakeholder questions into analytics/requirements." },
      { name: "Team Enablement", tier: "core", sourceTag: "PSF", what: "Agile ceremonies; cross-department relationships. (BA-V2: the source prints it as one of the role's own work functions — ruled core 2026-10-29.)" },
      { name: "Collaboration · Communication · Digital Fluency · Learning Agility (Enabling)", tier: "secondary", sourceTag: "PSF", what: "People-facing layer of the BA job (Digital Fluency/Problem Solving print Advanced on this map; rest Intermediate)." },
    ],
  },
  {
    // CANON LOCK (byte-identical rows): its is the third demo suggestion —
    // seed assertions key its map length at 7 (spec sub-rows stay spec-only).
    id: "its", // roster 2.4 (demo interop id)
    name: "IT Support Engineer",
    psocCode: "3512",
    psocTitle: "Information and communications technology user support technicians",
    track: "it",
    degreeMap: ["BSIT", "BSIS", "BSCS"],
    entryRoute: "Tech support ladder (Level 1 → Level 2) in in-house IT or an MSP/help-desk vendor; tickets in a Tier-1 queue ~60% of the day (CMO 25 s. 2015).",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #147 (IT Support Staff)",
      note: "Also #183 MIS Technical Support and #67 Computer Hardware Servicing Staff in the same report.",
    },
    roleSummary: "Monitors, deploys, and maintains IT infrastructure, and answers the user tickets that keep the day moving.",
    skills: [
      { name: "Infrastructure Support", tier: "core", sourceTag: "PSF", what: "Monitor, maintain and patch infrastructure components." },
      { name: "Infrastructure Deployment", tier: "core", sourceTag: "PSF", what: "Execute rollouts/updates under supervision." },
      { name: "Network Administration and Maintenance", tier: "core", sourceTag: "PSF", what: "Day-to-day LAN/VLAN/patch-panel upkeep." },
      { name: "Network Configuration", tier: "core", sourceTag: "PSF", what: "Configure devices/ports per runbooks." },
      { name: "Cyber and Data Breach Incident Management", tier: "secondary", sourceTag: "PSF", what: "Know the escalation path when incidents hit security." },
      { name: "Service Level Management", tier: "secondary", sourceTag: "PSF", what: "Meet SLA response/closure targets; log metrics." },
      { name: "Customer Orientation · Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)", tier: "secondary", sourceTag: "PSF", what: "User-facing service behavior." },
    ],
  },
  {
    id: "sysadmin", // roster 2.5
    name: "Network / Systems Administrator",
    psocCode: "2522",
    psocTitle: "Systems administrators",
    track: "it",
    degreeMap: ["BSIT", "BSIS", "BSCpE"],
    entryRoute: "NOC/infrastructure junior administrator in an ISP/enterprise IT team; usually 1–2 yrs helpdesk first, or straight in via internship pipelines in DICT Digital Cities (CMO 25 s. 2015 / 87 s. 2017).",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #187 (Network Administrator)",
      note: "PSOC examples of 2522: network administrator, network engineer, system administrator.",
    },
    roleSummary: "Keeps servers and networks healthy — accounts, patching, backups — and executes the maintenance windows behind shared services.",
    skills: [
      { name: "Systems administration (user groups, upgrades, backups)", tier: "core", sourceTag: "PSF", what: "Keep servers/services healthy; manage accounts, patching, backups." },
      { name: "↳ CWF sub-row: Design and develop new systems", tier: "core", sourceTag: "PSF", what: "Assist builds/integration of new systems under ITIL discipline." },
      { name: "↳ CWF sub-row: Optimize systems performance", tier: "core", sourceTag: "PSF", what: "Component optimisation, research, metrics tracking for capacity." },
      { name: "↳ CWF sub-row: Resolve system-related incidents", tier: "core", sourceTag: "PSF", what: "Identify/resolve, escalate unresolved system issues." },
      { name: "Network Administration and Maintenance", tier: "core", sourceTag: "PSF", what: "Keep connectivity and shared services stable." },
      { name: "Infrastructure Support", tier: "core", sourceTag: "PSF", what: "Execute maintenance windows and support tickets." },
      { name: "↳ CWF sub-row: Oversee service level agreements and service improvements", tier: "core", sourceTag: "PSF", what: "SLA-assist duties — objectives, logs, recurring-incident flags." },
      { name: "Security Administration", tier: "secondary", sourceTag: "PSF", what: "Maintain access controls, policies on the systems they own (L3 gates the engineer rung)." },
      { name: "IT Asset Management", tier: "secondary", sourceTag: "PSF", what: "Handed hardware/software catalogs and license hygiene." },
      { name: "System Integration", tier: "secondary", sourceTag: "PSF", what: "Connect new tools to existing environments safely (L3, kept secondary per the ladder)." },
      { name: "Configuration Tracking · Cyber-and-Data-Breach Incident Management · Business Needs Analysis", tier: "secondary", sourceTag: "PSF", what: "Traceability + escalation discipline." },
      { name: "Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)", tier: "secondary", sourceTag: "PSF", what: "Operational team behavior." },
    ],
  },
  {
    id: "dba", // roster 2.6
    name: "Database Administrator",
    psocCode: "2521",
    psocTitle: "Database designers and administrators",
    track: "it",
    degreeMap: ["BSIT", "BSCS", "BSIS", "BSAIS (data-heavy shops)"],
    entryRoute: "DBA analyst/junior DBA on SQL Server/MySQL/Oracle in enterprises or BPOs with on-prem IT; standby rotation (CMO 25 s. 2015; CMO 30 s. 2017).",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #86 (Database Administrator)",
      note: "Entry is the support track of the DBA ladder.",
    },
    roleSummary: "Installs and maintains the database systems behind the business — backups, recovery drills, and secure access.",
    skills: [
      { name: "Database Administration", tier: "core", sourceTag: "PSF", what: "Install, configure, maintain DBMS; run backup/recovery drills." },
      { name: "↳ CWF sub-row: Oversee database administration", tier: "core", sourceTag: "PSF", what: "Environments, upgrades, installs; backup/recovery procedures." },
      { name: "↳ CWF sub-row: Design and develop new database", tier: "core", sourceTag: "PSF", what: "Assist design needs, procedures, flows, indexing, stored procedures." },
      { name: "↳ CWF sub-row: Optimize database performance", tier: "core", sourceTag: "PSF", what: "Component optimisation; audits; operational metrics." },
      { name: "↳ CWF sub-row: Resolve database incidents", tier: "core", sourceTag: "PSF", what: "Diagnose/mitigate; escalate under org procedures." },
      { name: "Database security controls", tier: "core", sourceTag: "PSF", what: "Privileges, permissions, integrity controls (printed CWF \"Manage database security\")." },
      { name: "Data Engineering", tier: "secondary", sourceTag: "PSF", what: "Handle data flows feeding the databases." },
      { name: "Data Migration", tier: "secondary", sourceTag: "PSF", what: "Move schemas/data across environments safely (L3, kept secondary per the ladder)." },
      { name: "Infrastructure Support", tier: "secondary", sourceTag: "PSF", what: "Understand where the database lives." },
      { name: "Problem Management", tier: "secondary", sourceTag: "PSF", what: "Diagnose and close recurring DB incidents (L3, kept secondary)." },
      { name: "Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)", tier: "secondary", sourceTag: "PSF", what: "Team/ops behavior." },
    ],
  },
  {
    id: "cybersec", // roster 2.7
    // Display name = "Security Analyst" (CYB-V3, ruled 2026-10-29 — the
    // anchored rung's printed name; the roster family label is superseded).
    name: "Security Analyst",
    psocCode: "2523",
    psocTitle: "Computer network professionals",
    track: "it",
    degreeMap: ["BSCS", "BSIT", "BSIS"],
    entryRoute: "Security operations center (SOC) Tier-1 analyst in a telco/bank/BPM SOC, usually via an IT-support-to-SOC internal move or a fresh-grad cohort with an industry security certificate in hand (CMO 25 s. 2015).",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #146 (IT Security Engineer)",
      note: "PSOC mapping judgment, flagged in the roster (no dedicated cyber analyst unit in PSOC 2012): 2523/2519-family anchor, labeled per ruling R2. Fixture display name \"Security Analyst\" per CYB-V3 (2026-10-29).",
    },
    roleSummary: "Reads alerts and correlates events in a security queue, escalating true positives along defined playbooks.",
    skills: [
      { name: "Threat analysis / monitoring", tier: "core", sourceTag: "PSF", what: "Read alerts, correlate events, escalate true positives." },
      { name: "Cyber and Data Breach Incident Management", tier: "secondary", sourceTag: "PSF", what: "Follow breach-response playbooks." },
      { name: "Network administration & maintenance", tier: "secondary", sourceTag: "PSF", what: "Understand the networks being defended." },
      { name: "Vulnerability assessment support (VAPT analyst track)", tier: "secondary", sourceTag: "PSF", what: "Run scans, triage findings under supervision." },
      { name: "Collaboration · Communication · Problem Solving · Digital Fluency (Enabling)", tier: "secondary", sourceTag: "PSF", what: "War-room behavior (dup-cell ESC levels render honestly per CYB-V2)." },
    ],
  },
  {
    id: "webdev", // roster 2.8
    name: "Web Developer",
    psocCode: "2513",
    psocTitle: "Web and multimedia developers",
    track: "it",
    degreeMap: ["BSIT", "BSIS", "BSCS", "BSEMC (multimedia side)"],
    entryRoute: "Freelance/portfolio-to-hire; agency dev teams; small-business CMS builds; first employee usually a CMS + front-end role (CMO 25 s. 2015; CMO 2 s. 2014).",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #271 (Web Developer)",
      note: "Also #272 Web Programmer. Skill rows are a declared [O*NET] gap-filler per ADR-0001 — the PSF-SDS has no dedicated entry web-developer map (O*NET 15-1254.00 \"Web Developers\", updated 2026).",
    },
    roleSummary: "Builds and maintains websites — responsive front-ends, CMS builds, deploys — usually as first-employee or agency junior.",
    skills: [
      { name: "Client-side coding (HTML/CSS/JS)", tier: "core", sourceTag: "O*NET", what: "Build and maintain responsive web UIs." },
      { name: "↳ task-cluster sub-row: site life-operations", tier: "core", sourceTag: "O*NET", what: "Test after revisions, update content, back up, renew domains, improve performance." },
      { name: "CMS administration (WordPress etc.)", tier: "core", sourceTag: "O*NET", what: "Content structure, themes, plugins, basic hosting." },
      { name: "Responsive/UI basics + accessibility", tier: "secondary", sourceTag: "O*NET", what: "Cross-device rendering, WCAG-conscious markup." },
      { name: "Version control (git)", tier: "secondary", sourceTag: "O*NET", what: "Team-safe code management." },
      { name: "Agile Software Development (when agency-run)", tier: "secondary", sourceTag: "PSF", what: "Sprints, stand-ups, reviews." },
    ],
  },
  {
    id: "digart", // roster 2.9
    name: "Digital / Multimedia Artist",
    psocCode: "2166",
    psocTitle: "Graphic and multimedia designers",
    track: "it",
    degreeMap: ["BSEMC"],
    entryRoute: "Studio/agency junior artist or BPM 'creative services' desk; brief-to-deliverable turnaround; portfolio-first hiring (CMO 2 s. 2014).",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #126 (Graphic Artist)",
      note: "Also Hard-to-Fill #1–#3 (2D Digital Animator / Animation Artist / Animation Checker — all asterisked 'not completely defined in the PSOC'). Feeds Business-track marketing work. Row shape ruled 2026-10-29: the verbatim six TESDA TR unit names are the core rows (DIG-V1).",
    },
    roleSummary: "Produces brand, print, packaging, and animation assets to brief, revising with clients inside deadline.",
    skills: [
      { name: "DEVELOP DESIGNS FOR A LOGO (ICT216313)", tier: "core", sourceTag: "TESDA", what: "Incorporate visual design/communication principles into logo development." },
      { name: "DEVELOP DESIGNS FOR PRINT MEDIA (ICT216314)", tier: "core", sourceTag: "TESDA", what: "Posters, tarpaulin, magazine, brochures — printed-output design." },
      { name: "DEVELOP DESIGNS FOR USER EXPERIENCE (ICT216315)", tier: "core", sourceTag: "TESDA", what: "Design development for user experience." },
      { name: "DEVELOP DESIGNS FOR USER INTERFACE (ICT216316)", tier: "core", sourceTag: "TESDA", what: "Design development for user interface." },
      { name: "DEVELOP DESIGNS FOR PRODUCT PACKAGING (ICT216317)", tier: "core", sourceTag: "TESDA", what: "Design development for product packaging." },
      { name: "DESIGN BOOTH AND PRODUCT WINDOW / DISPLAY (ICT216318)", tier: "core", sourceTag: "TESDA", what: "Booth and product window/display design and production." },
      { name: "Use specialized graphic/animation tools (Adobe suite, Blender etc.)", tier: "core", sourceTag: "TESDA", what: "Tool proficiency across the suite + Blender-class animation tools." },
      { name: "Follow creative brief + brand guideline development", tier: "core", sourceTag: "TESDA", what: "The TR's brief-discipline loop: receive brief → design → submit for approval → liaise." },
      { name: "Client communication & revision handling", tier: "secondary", sourceTag: "NACE", what: "Iterate with clients within deadline (TR Required Skills set as printed)." },
      { name: "Junior 2D Animator — [PSF-DAA] (counterpart, optional — user ruling 2026-10-29 ADD)", tier: "secondary", sourceTag: "PSF", what: "The Junior-2D-Animator counterpart rung of the same family (map/name recorded only — no FSC levels)." },
    ],
  },
  {
    id: "da", // extension E1 (demo interop id) — CANON LOCK (byte-identical rows)
    name: "Data Analyst (junior)",
    psocCode: "3314",
    psocTitle: "Statistical, mathematical and related associate professionals",
    track: "it",
    degreeMap: ["BS Statistics", "BSMA", "BSCS", "BSIS"],
    entryRoute: "Junior analyst on a reporting/BI desk or an analytics BPM account; dashboard and survey-report production under a senior analyst.",
    demandBlock: {
      status: "institutional-judgment",
      source: "not DOLE-BLE-justified — institutional judgment",
      note: "E1 extension admitted per ruling R4 (2026-10-29). Un-named on the 2013–2020 lists; likely in NJLMF 2025–2026 (unreachable); PSF-AAI is the government artifact for the family. Skill map: FULL — all 11 FSC rows + 4 ESC rows extracted from the official PSF-AAI document (2026-10-29); tiers are derived proposals pending user ruling.",
    },
    roleSummary: "Turns data into visual answers people can act on — analysis, visualization, storytelling under a senior analyst.",
    skills: [
      { name: "Data Analytics", tier: "core", sourceTag: "PSF", what: "Get the data talking: surface the real trend or pattern that answers the business question, using stats and computing tools. (PSF-AAI FSC Level 2)" },
      { name: "Data Visualization and Storytelling", tier: "core", sourceTag: "PSF", what: "Build the dashboard/visual that makes the finding land, and tell the story behind the numbers. (PSF-AAI FSC Level 3)" },
      { name: "Business Needs Analysis", tier: "core", sourceTag: "PSF", what: "Nail down what stakeholders actually need before touching data. (PSF-AAI FSC Level 2)" },
      { name: "ETL (extract-transform-load workflows)", tier: "core", sourceTag: "PSF", what: "Assemble and clean the pipeline piece by piece — gather data, validate it, and keep records trustworthy. (PSF-AAI CWF key-task tier — 'Prepare and analyze data', not a named FSC)" },
      { name: "Data Engineering", tier: "secondary", sourceTag: "PSF", what: "Handle the 'where data comes from and lives' layer feeding your analysis. (PSF-AAI FSC Level 2)" },
      { name: "Enabling Skills & Competencies (ESC) — Collaboration, Communication, Digital Fluency, Learning Agility", tier: "secondary", sourceTag: "PSF", what: "Team skills at their entry setting: share info, cooperate, use the digital stack, keep learning. (PSF-AAI ESC, all Basic — the four the role page lists)" },
      { name: "Applications Development", tier: "secondary", sourceTag: "PSF", what: "Light programming muscle around analytics work (scripts, quick tools). (PSF-AAI FSC Level 3)" },
      { name: "Artificial Intelligence Ethics and Governance", tier: "secondary", sourceTag: "PSF", what: "Keep AI/data work compliant with governance rules (incl. RA 10173 Data Privacy Act, per the role's performance-expectations clause). (PSF-AAI FSC Level 2)" },
      { name: "Data Ethics", tier: "secondary", sourceTag: "PSF", what: "Treat data — especially personal data — legally and ethically throughout its lifecycle. (PSF-AAI FSC Level 3)" },
      { name: "Cyber and Data Breach Incident Management", tier: "secondary", sourceTag: "PSF", what: "Recognize, report and escalate data incidents under the house escalation protocol. (PSF-AAI FSC Level 2)" },
      { name: "Software Testing", tier: "secondary", sourceTag: "PSF", what: "Sanity-test the tools/reports you produce before they ship. (PSF-AAI FSC Level 2)" },
      { name: "Configuration Tracking", tier: "secondary", sourceTag: "PSF", what: "Keep change logs tidy so analysis files/scripts are reproducible. (PSF-AAI FSC Level 1)" },
      { name: "Stakeholder Management", tier: "secondary", sourceTag: "PSF", what: "Know who you report to, who consumes your reports, and keep both in the loop. (PSF-AAI FSC Level 2)" },
    ],
  },
  {
    id: "soc", // extension E4 — converted per the blessed soc.md draft (36/36)
    name: "SOC Analyst",
    psocCode: "2523",
    psocTitle: "Computer network professionals",
    track: "it",
    degreeMap: ["BSCS", "BSIT", "BSIS"],
    entryRoute: "SOC Tier-1 analyst via fresh-grad cohort with a security certificate add-on; large employers typically ask for a certificate exam held in hand.",
    demandBlock: {
      status: "institutional-judgment",
      source: "not DOLE-BLE-justified — institutional judgment",
      note: "E4 extension admitted per ruling R4 (2026-10-29); demand-named cousin is 2.7 (JobsFit #146 IT Security Engineer). Skill rows converted per the blessed soc.md draft (2026-10-30): the PSF-SDS Security Operations Analyst rung's three printed CWFs + TESDA Cyber Threat Monitoring NC I units + O*NET 15-1212.00 adjacent-listing discipline. SOC-V1: the displayed pairing (catalog \"SOC Analyst\" vs the artifact's \"Security Operations Analyst\" print) rides the standing name-discipline note — catalog keeps its roster display pending a user call.",
    },
    roleSummary: "Watches the security queue inside a 24/7 SOC — alerts triaged, events correlated, breach-response playbooks followed.",
    skills: [
      { name: "Monitor cyber security systems", tier: "core", sourceTag: "PSF", what: "Real-time analysis/trending of security log data; watch the queue, escalate anomalies. (printed CWF)" },
      { name: "Maintain cyber security operations", tier: "core", sourceTag: "PSF", what: "Keep the monitoring stack running — data sources, check schedules, status reports. (printed CWF)" },
      { name: "Manage response to cyber security incidents", tier: "core", sourceTag: "PSF", what: "Evaluate severity, keep status updates through an incident's lifecycle, prepare the final report. (printed CWF)" },
      { name: "Threat Analysis and Defence · Threat Intelligence and Detection (family FSC cross-cite)", tier: "secondary", sourceTag: "PSF", what: "Back the queue decisioning — attack-framework knowledge, IOC/threat-intel feeds. (SOC-V2 levels pending facsimile)" },
      { name: "Vulnerability scanning (VAPT-adjacent, TESDA-printed)", tier: "secondary", sourceTag: "TESDA", what: "Check the scanning schedule, scan the assets, file the report (Cyber Threat Monitoring NC I unit ICT251313)." },
      { name: "Network security understanding (network administration family)", tier: "secondary", sourceTag: "TESDA", what: "LAN/WAN/port-forwarding architecture + firewall/EDR/NDR alert fluency." },
      { name: "Collaboration · Communication · Problem Solving · Digital Fluency (Enabling)", tier: "secondary", sourceTag: "PSF", what: "Analytical war-room behavior; on-call shift discipline. (ESC levels pending SOC-V2 facsimile)" },
    ],
  },

  // == ─── Track 2 · Business & Management (9: roster 3.1–3.9) ────────────────
  {
    id: "hra", // roster 3.1
    name: "HR Assistant",
    psocCode: "4416",
    psocTitle: "Personnel clerks — human resource assistant",
    track: "business",
    degreeMap: ["BSBA-HRM", "BS Psychology", "BSOA"],
    entryRoute: "HR assistant / talent acquisition coordinator on recruiting teams (corporate HR or RPO sides of BPM); initial screening and onboarding logistics under a senior recruiter (CMO 17 s. 2017).",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #139 (Human Resource Officer)",
      note: "Also Hard-to-Fill #7 (Wholesale/Retail) 'Human Resource Specialist' — a deep HR ladder feeds entry openings. Converted per the blessed hra.md (PSF-HCD Associate, Talent Attraction and Talent Management, printed pp.62–63).",
    },
    roleSummary: "Runs the people-operations floor: sourcing channels, initial screening, onboarding logistics, records.",
    skills: [
      { name: "Recruitment Channel Management", tier: "core", sourceTag: "PSF", what: "Evaluate the sourcing channels that secure candidates; track conversion per channel." },
      { name: "Selection Management", tier: "core", sourceTag: "PSF", what: "Screen initial applicants; administer assessments; keep the applicant bank." },
      { name: "Onboarding", tier: "core", sourceTag: "PSF", what: "Set up work access, orientation logistics and welcome packs for new hires." },
      { name: "Data Collection and Preparation", tier: "core", sourceTag: "PSF", what: "Collect HR data for business and HR insights." },
      { name: "Data Management", tier: "core", sourceTag: "PSF", what: "Keep candidate/employee records accurate, complete and retrievable. (flagged paraphrase)" },
      { name: "Digital Marketing and Communication", tier: "core", sourceTag: "PSF", what: "Employer-brand reach plans and hiring collaterals." },
      { name: "Diversity, Equity, Inclusion and Belonging Management", tier: "core", sourceTag: "PSF", what: "Run hiring under non-discrimination and data-privacy law (RA 10173/RA 10911 in the CWF's Required Knowledge). (flagged paraphrase)" },
      { name: "Talent Capability Assessment", tier: "core", sourceTag: "PSF", what: "Assessment tools and processes that evaluate employees' capabilities." },
      { name: "Employee Communication Management", tier: "core", sourceTag: "PSF", what: "Deliver recruiting and people-ops messages clearly. (flagged paraphrase)" },
      { name: "Voluntary Exit Management", tier: "secondary", sourceTag: "PSF", what: "Process separations, records, clearances. (flagged paraphrase)" },
      { name: "Involuntary Exit Management", tier: "secondary", sourceTag: "PSF", what: "Employer-initiated separations handled safely under procedure. (flagged paraphrase)" },
      { name: "Job Analysis and Evaluation", tier: "secondary", sourceTag: "PSF", what: "Define/evaluate job requirements against metrics or structures." },
      { name: "Employee Mobility Management", tier: "secondary", sourceTag: "PSF", what: "Internal moves — transfers, promotions, redeployment — and their records. (flagged paraphrase)" },
      { name: "Human Resources Analytics and Insights", tier: "secondary", sourceTag: "PSF", what: "Hiring funnel metrics per channel, assessment outcomes, talent gaps. (flagged paraphrase)" },
      { name: "Human Resources Practices Implementation", tier: "secondary", sourceTag: "PSF", what: "Apply company HR policy correctly in every people action. (flagged paraphrase)" },
      { name: "Human Resources Systems Management", tier: "secondary", sourceTag: "PSF", what: "Keep the HRIS/ATS records flowing — enter, track, report. (flagged paraphrase)" },
      { name: "Performance Management", tier: "secondary", sourceTag: "PSF", what: "Records support for performance cycles. (flagged paraphrase)" },
      { name: "Skills Framework Adoption", tier: "secondary", sourceTag: "PSF", what: "Log skills-framework vocabulary inside people processes. (flagged paraphrase)" },
      { name: "Stakeholder Engagement and Management", tier: "secondary", sourceTag: "PSF", what: "Day-to-day work with hiring managers, applicants, new hires, vendors. (flagged paraphrase)" },
      { name: "Communication · Adaptability · Customer Orientation · Digital Fluency · Learning Agility · Self-Management (Enabling, Basic)", tier: "secondary", sourceTag: "PSF", what: "Candidate-facing tier-1 behavior." },
    ],
  },
  {
    id: "training", // roster 3.2
    name: "Training Coordinator",
    psocCode: "2424",
    psocTitle: "Training and staff development professionals",
    track: "business",
    degreeMap: ["BSBA-HRM", "BS Psychology", "BSBA-OM", "BSEMC (LMS/digital learning)"],
    entryRoute: "Training coordinator in corporate L&D or a BPM academy role; scheduling/logging/attendance/vendor logistics; builds to trainer/specialist (CMO 17 s. 2017).",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #264 (Training Specialist)",
      note: "Also named under the IT/BPM in-demand grouping (#32) — demand spans industries. Converted per the blessed training.md (PSF-HCD Associate, Learning and Organization Development, printed pp.85–86).",
    },
    roleSummary: "Coordinates the learning engine — needs capture, program logistics, LMS upkeep — behind corporate L&D.",
    skills: [
      { name: "Learning Needs Analysis", tier: "core", sourceTag: "PSF", what: "Analyze capability/performance gaps to identify learning needs." },
      { name: "Learning and Development Programs Management", tier: "core", sourceTag: "PSF", what: "Schedule, register, track participation in learning programs. (flagged paraphrase)" },
      { name: "Data Management", tier: "core", sourceTag: "PSF", what: "Maintain the learning-program database and LMS records cleanly. (flagged paraphrase)" },
      { name: "Onboarding", tier: "core", sourceTag: "PSF", what: "Support onboarding/offboarding program execution." },
      { name: "Data Collection and Preparation", tier: "core", sourceTag: "PSF", what: "Collate survey and evaluation data for L/OD measures." },
      { name: "Voluntary Exit Management", tier: "secondary", sourceTag: "PSF", what: "Keep exit paperwork flowing with the L&D calendar. (flagged paraphrase)" },
      { name: "Involuntary Exit Management", tier: "secondary", sourceTag: "PSF", what: "Employer-initiated separations, same admin support. (flagged paraphrase)" },
      { name: "Employee Communication", tier: "secondary", sourceTag: "PSF", what: "Course comms and reminders. (flagged paraphrase)" },
      { name: "Human Resources Systems Management", tier: "secondary", sourceTag: "PSF", what: "LMS administration — enrollments, catalogs, reports. (flagged paraphrase)" },
      { name: "Performance Management", tier: "secondary", sourceTag: "PSF", what: "Records support for performance-linked learning. (flagged paraphrase)" },
      { name: "Human Resources Analytics and Insights", tier: "secondary", sourceTag: "PSF", what: "Participation and effectiveness reporting from learning data. (flagged paraphrase)" },
      { name: "Human Resources Practices Implementation", tier: "secondary", sourceTag: "PSF", what: "Apply people-policy inside program administration. (flagged paraphrase)" },
      { name: "Skills Framework Adoption", tier: "secondary", sourceTag: "PSF", what: "Skills-framework vocabulary in learning records. (flagged paraphrase)" },
      { name: "Stakeholder Engagement and Management", tier: "secondary", sourceTag: "PSF", what: "Venues, vendors, trainers — the admin-facing relationship set. (flagged paraphrase)" },
      { name: "Communication · Customer Orientation · Learning Agility · Self-Management · Problem Solving (Enabling, Basic)", tier: "secondary", sourceTag: "PSF", what: "Learner-facing service behavior (Problem Solving restored from the printed ESC list)." },
    ],
  },
  {
    id: "mkt", // roster 3.3
    name: "Marketing Assistant",
    psocCode: "2431",
    psocTitle: "Advertising and marketing professionals",
    track: "business",
    degreeMap: ["BSBA-MM", "BA/BS Economics", "BSOA (marcom admin add-ons)"],
    entryRoute: "Marketing assistant / agency account coordinator; content/social calendar support; media-buy paperwork (CMO 17 s. 2017).",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #167 (Marketing Specialist)",
      note: "Also #166 Marketing Sales Officer, #168 Marketing Supervisor, #169 Marketing Telemarketer; hard-to-fill 'Marketing Officer' (Wholesale & Retail #5). Converted per the blessed mkt.md (PSF-BD Marketing Associate/Assistant/Coordinator, printed pp.16–17) — study.com-attributed glossary quotes stripped to paraphrase per the recorded ruling.",
    },
    roleSummary: "Keeps campaign engines running — digital and social coordination, content assets, market data collation.",
    skills: [
      { name: "Business Environment Analysis", tier: "core", sourceTag: "PSF", what: "Read the market/technological environment around campaigns." },
      { name: "Communications within Distribution Channels", tier: "core", sourceTag: "PSF", what: "Coordinate channel partners' marketing communications." },
      { name: "Consumer Intelligence Analysis", tier: "core", sourceTag: "PSF", what: "Turn consumer-pattern data into actionable campaign knowledge." },
      { name: "Content Development and Strategy", tier: "core", sourceTag: "PSF", what: "Brief, source and produce campaign content assets." },
      { name: "Digital Marketing", tier: "core", sourceTag: "PSF", what: "Coordinate paid/owned digital campaign activity." },
      { name: "Market Intelligence", tier: "core", sourceTag: "PSF", what: "Assemble market/competitor intelligence for campaign and growth decisions." },
      { name: "Market Profiling", tier: "core", sourceTag: "PSF", what: "Segment and profile targets for campaigns." },
      { name: "Market Trend Analysis", tier: "core", sourceTag: "PSF", what: "Read historical data and market conditions to spot and predict trends." },
      { name: "Marketing Communications Plan Development", tier: "core", sourceTag: "PSF", what: "Shape the message plan across channels." },
      { name: "Marketing Mix Management", tier: "core", sourceTag: "PSF", what: "Manage the essentials — product mix, pricing, promotion, placement — as one system." },
      { name: "Media Strategy Development", tier: "core", sourceTag: "PSF", what: "Choose channels and placement for campaign reach." },
      { name: "Social Media Marketing", tier: "core", sourceTag: "PSF", what: "Schedule, monitor and respond on social platforms." },
      { name: "Communication (ESC-layer, printed in the Primary block)", tier: "secondary", sourceTag: "PSF", what: "Campaign coordination messaging (ESC Basic; carried where the artifact prints it)." },
      { name: "Collaboration (ESC, Basic)", tier: "secondary", sourceTag: "PSF", what: "Execute campaigns as a coordinated team." },
      { name: "Customer Orientation (ESC, Basic)", tier: "secondary", sourceTag: "PSF", what: "Anchor coordination decisions to what customers respond to." },
      { name: "Digital Fluency (ESC, Basic)", tier: "secondary", sourceTag: "PSF", what: "Run campaign tooling fluently." },
      { name: "Data Analysis and Interpretation", tier: "secondary", sourceTag: "PSF", what: "Keyword research and web-statistics reporting." },
      { name: "E-Commerce Campaign Management", tier: "secondary", sourceTag: "PSF", what: "Support campaign assets that drive online-store activity." },
      { name: "Trend Forecasting", tier: "secondary", sourceTag: "PSF", what: "Surface what's rising so campaigns stay current." },
      { name: "Brand Campaign Management · Brand Guideline Development · Brand Marketing · Brand Portfolio Management", tier: "secondary", sourceTag: "PSF", what: "Brand-side campaign assets and consistency discipline." },
      { name: "Business Opportunities Development · Demand Analysis · Market Research", tier: "secondary", sourceTag: "PSF", what: "Growth/demand research support." },
      { name: "Category Marketing · Collateral Production · Visual Collaterals Production · Content Management", tier: "secondary", sourceTag: "PSF", what: "Collateral production and content upkeep." },
      { name: "Data-mining and Modelling · Research and Information Synthesis", tier: "secondary", sourceTag: "PSF", what: "Data-mining preparation support." },
      { name: "Events Planning and Management · Proposal Writing · Media Platforms Management", tier: "secondary", sourceTag: "PSF", what: "Event support, proposals, platform upkeep." },
      { name: "International Trade Legislation for Business · Retailing and the Economy · Website Design", tier: "secondary", sourceTag: "PSF", what: "Context/design support as printed." },
    ],
  },
  {
    id: "sales", // roster 3.4
    name: "Sales Executive",
    psocCode: "3322",
    psocTitle: "Commercial sales representatives",
    track: "business",
    degreeMap: ["BSBA-MM", "BS Entrepreneurship"],
    entryRoute: "Territory/inside sales or vendor-link partner channel junior; KPIs per pipeline stage; relationship handoff to account management after 1–2 yrs (CMO 17/18 s. 2017).",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #232 (Sales Consultant)",
      note: "Also #166 Marketing Sales Officer. Field sales involves travel/outside calls — a role-context point, not a skill penalty. Converted per the blessed sales.md (PSF-BD Sales Associate/Assistant, printed pp.8–9): the paid LinkedIn-Learning path is noted in copy but stays OUT of the resource pool (ruling 2026-10-29); study.com-attributed glossary quotes stripped.",
    },
    roleSummary: "Prospects, qualifies, and moves deals — keeping the pipeline records clean from first call to delivery paperwork.",
    skills: [
      { name: "Customer Acquisition Management", tier: "core", sourceTag: "PSF", what: "Prospect, qualify and follow up leads across inbound/outbound channels." },
      { name: "Customer Relationship Management + Customer Relationship Management Operations", tier: "core", sourceTag: "PSF", what: "Manage and analyze customer interactions across the lifecycle; keep pipeline records clean. (both FSCs printed; carried as one row)" },
      { name: "Sales Closure", tier: "core", sourceTag: "PSF", what: "Run the closing loop — follow-ups, contract submission, payment monitoring." },
      { name: "Sales Delivery + Delivery Management", tier: "core", sourceTag: "PSF", what: "Track the deal through delivery to done. (both FSCs printed; carried as one row)" },
      { name: "Order Fulfilment Administration", tier: "core", sourceTag: "PSF", what: "The paperwork chain that turns a won deal into delivery." },
      { name: "Product Advisory + Product Demonstration", tier: "core", sourceTag: "PSF", what: "Explain the offer; run simple demos. (both FSCs printed; carried as one row)" },
      { name: "After-sales Service", tier: "core", sourceTag: "PSF", what: "Keep the account healthy after the sale — follow-ups, issue resolution." },
      { name: "Customer Management", tier: "core", sourceTag: "PSF", what: "Day-to-day account relationship stewardship." },
      { name: "Customer Behavior Analysis", tier: "secondary", sourceTag: "PSF", what: "Read the buyer's signals with analysis tools and approaches." },
      { name: "Contract and Vendor Management", tier: "secondary", sourceTag: "PSF", what: "Contracts, price quotations, partner paperwork." },
      { name: "Account Management", tier: "secondary", sourceTag: "PSF", what: "The structured account plan layer as accounts mature." },
      { name: "Customer Experience Management", tier: "secondary", sourceTag: "PSF", what: "Experience quality across touchpoints." },
      { name: "Design Concepts Generation · Idea Generation and Selection · Narrative Design · Shopper Marketing Campaign Management", tier: "secondary", sourceTag: "PSF", what: "Co-marketing asset ideation support." },
      { name: "Retail Space Utilization", tier: "secondary", sourceTag: "PSF", what: "Retail-context selling where the channel is store-based." },
      { name: "Stakeholder Management", tier: "secondary", sourceTag: "PSF", what: "Multi-party coordination across the selling team." },
      { name: "Supplier Performance · Supplier Sourcing", tier: "secondary", sourceTag: "PSF", what: "Channel/vendor hygiene from the sales side." },
      { name: "Communication · Collaboration · Customer Orientation · Global Perspective · Problem Solving (Enabling)", tier: "secondary", sourceTag: "PSF", what: "Client-facing behaviors (printed: Communication/Collaboration/Customer Orientation I, Global Perspective B, Problem Solving I)." },
    ],
  },
  {
    id: "csr", // roster 3.5
    name: "Customer Service Representative",
    psocCode: "4222",
    psocTitle: "Contact centre information clerks — customer service assistant/representative",
    track: "business",
    degreeMap: ["Open-door tier — any CHED canon program", "BSBA", "BSOA", "BSIS"],
    entryRoute: "New-hire cohort with TESDA Contact Center Services NC II certificate in hand; consistent PM shifts; the largest single early-career hiring pool in PH corporate/BPM.",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #84 (Customer Service Representative)",
      note: "Also #52 Call Center Agent, #82 Customer Care Representative, #83 Customer Service Assistant — the CSR family is heavily represented on the lists. Converted per the blessed csr.md (dual-source: PSF-CCB Agent/CS&S printed pp.14–15 + TESDA CCS NC II TR amended 2014-10-01).",
    },
    roleSummary: "Handles customer contacts end to end within SLA — English transactions, empathy, CRM logging, data privacy discipline.",
    skills: [
      { name: "Communicate effectively in English for customer service", tier: "core", sourceTag: "TESDA", what: "English-language customer transactions (CCS NC II ICT313365)." },
      { name: "Perform customer service delivery processes", tier: "core", sourceTag: "TESDA", what: "Inbound/outbound call handling per enterprise procedures (ICT313366)." },
      { name: "Demonstrate ability to effectively engage customers", tier: "core", sourceTag: "TESDA", what: "Sense and acknowledge customer feelings inside the call (ICT313367)." },
      { name: "Customer Service Delivery", tier: "core", sourceTag: "PSF", what: "Anticipate needs; deliver quality service on time." },
      { name: "Customer Handling and Care", tier: "core", sourceTag: "PSF", what: "Empathy, de-escalation and resolution behavior inside the call. (flagged paraphrase)" },
      { name: "Customer Relationship Management", tier: "core", sourceTag: "PSF", what: "Log every customer interaction accurately in the CRM. (flagged paraphrase)" },
      { name: "Compliance with Legal Regulations", tier: "core", sourceTag: "PSF", what: "Handle personal data and service rules inside the call per law (RA 10173 in the doc). (flagged paraphrase)" },
      { name: "Technology and Systems Application", tier: "secondary", sourceTag: "PSF", what: "CRM, telephony, case tools fluency." },
      { name: "Consumer Intelligence Analysis · Sentiment Analysis · Problem Identification · Continuous Improvement Management · Customer Acquisition Management · Brand Campaign Management (printed FSC list block)", tier: "secondary", sourceTag: "PSF", what: "The wide printed FSC list as ONE grouped row (the agent's growth edge)." },
      { name: "Collaboration · Communication · Customer Orientation · Digital Fluency · Problem Solving · Global Perspective (Enabling, Basic/Intermediate)", tier: "secondary", sourceTag: "PSF", what: "Service behavior (printed stages carried)." },
    ],
  },
  {
    id: "opsanalyst", // roster 3.6
    name: "Operations Analyst",
    psocCode: "2421",
    psocTitle: "Management and organization analysts",
    track: "business",
    degreeMap: ["BSBA-OM", "BS Industrial Engineering", "BSIS (process/data ops)"],
    entryRoute: "Junior analyst on a COO team or logistics BPM account; data pulls, SOP documentation, KPI reporting (CMO 17 s. 2017; CMO 96 s. 2017).",
    demandBlock: {
      status: "hard-to-fill",
      source: "JobsFit LMI 2013–2020 · Hard-to-Fill #5, Transport & Logistics (Operations Analyst)",
      note: "Also In-demand #191 (Operations Staff, same functional family). Skill rows are a declared [O*NET] gap-filler — no PH artifact owns this role family (O*NET 13-1111.00 Management Analysts, updated 2026); flagged condensed row names per the accepted naming ruling.",
    },
    roleSummary: "Maps how work actually flows — gathers, observes, frames options — and writes the findings down.",
    skills: [
      { name: "Process study planning (scoping the study of work problems)", tier: "core", sourceTag: "O*NET", what: "Scope the study of work problems and procedures." },
      { name: "Information gathering & organizing", tier: "core", sourceTag: "O*NET", what: "Collect and structure the evidence." },
      { name: "On-site observation & interviewing", tier: "core", sourceTag: "O*NET", what: "Talk to doers, not dashboards." },
      { name: "Data analysis & solution framing", tier: "core", sourceTag: "O*NET", what: "Present options, not verdicts." },
      { name: "Findings documentation & recommendation write-ups", tier: "core", sourceTag: "O*NET", what: "SOPs and findings memos." },
      { name: "Implementation support & training of revised methods", tier: "secondary", sourceTag: "O*NET", what: "Manuals and training for new forms/reports/procedures." },
      { name: "Forms/reports review & redesign", tier: "secondary", sourceTag: "O*NET", what: "Format, distribution and purpose reviews." },
      { name: "Records-management program design", tier: "secondary", sourceTag: "O*NET", what: "Filing/protection/retrieval program support." },
      { name: "PSOC 2421 corroboration block (lettered task a)", tier: "secondary", sourceTag: "PSOC", what: "Objectives/strategies framing the family prints (no O*NET counterpart)." },
      { name: "Communication · Critical Thinking · Teamwork (Enabling)", tier: "secondary", sourceTag: "NACE", what: "Cross-functional behavior." },
    ],
  },
  {
    id: "purch", // roster 3.7
    name: "Purchasing Officer",
    psocCode: "3323",
    psocTitle: "Buyers — procurement officer / purchasing agent",
    track: "business",
    degreeMap: ["BSBA-OM", "BSBA-FM", "BS Customs Administration (trade-side procurement)"],
    entryRoute: "Procurement/purchasing assistant in retail chains or manufacturing support services; PO processing under a purchasing manager (CMO 17 s. 2017; CMO 30 s. 2021).",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #215 (Purchasing Officer, Power & Utilities)",
      note: "Also #48 Buyer/Purchasing Agent (Retail). Skill rows are a declared [O*NET] gap-filler; no TESDA procurement NC verified. RA 9184 caveat rides its resource wherever it renders (keep-with-flag ruling 2026-10-29).",
    },
    roleSummary: "Runs the PO lifecycle — requisitions, bids, price proposals, compliance — keeping sourcing honest and papered.",
    skills: [
      { name: "Purchase order issuance & requisition review", tier: "core", sourceTag: "O*NET", what: "Prepare POs, solicit bids, review requisitions." },
      { name: "Price-proposal analysis", tier: "core", sourceTag: "O*NET", what: "Analyze price proposals to determine reasonable prices." },
      { name: "Best-value purchasing (quality/price/amount)", tier: "core", sourceTag: "O*NET", what: "Highest quality at the lowest price in correct amounts." },
      { name: "Legal & policy compliance (procurement rules)", tier: "core", sourceTag: "O*NET", what: "Monitor and follow applicable laws and regulations." },
      { name: "Supplier research & evaluation", tier: "secondary", sourceTag: "O*NET", what: "Evaluate suppliers on the printed capability set." },
      { name: "Contract performance monitoring", tier: "secondary", sourceTag: "O*NET", what: "Monitor contract compliance; administer/vendor negotiations." },
      { name: "Product specification writing", tier: "secondary", sourceTag: "O*NET", what: "Write/review product specs with working technical knowledge." },
      { name: "Records & shipment monitoring", tier: "secondary", sourceTag: "O*NET", what: "Purchase records, costs, deliveries; resolve undelivered goods." },
      { name: "Market watching (supply/demand, price trends)", tier: "secondary", sourceTag: "O*NET", what: "Track market conditions and price trends." },
      { name: "Communication · Critical Thinking · Ethics/Professionalism (Enabling)", tier: "secondary", sourceTag: "NACE", what: "Vendor relationships." },
    ],
  },
  {
    id: "ccqa", // roster 3.8
    name: "Quality Analyst (Contact Center)",
    psocCode: "4222",
    psocTitle: "Contact centre information clerks (service-quality work)",
    track: "business",
    degreeMap: ["any business-track canon degree (BSBA all majors)", "BS Psychology (customer-experience QAs)"],
    entryRoute: "QA evaluator on a BPM account; call-scoring rubrics; feedback coaching after 6–12 months.",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #216 (Quality Analyst, IT/BPM grouping)",
      note: "Same #216 as 2.2 — the platform serves both flavors (software QA / contact-center QA). PSOC mapping judgment flagged in the roster; the per-instance PSF-CCB Quality Auditor extraction is now closed (blessed ccqa.md, printed pp.34–35) — the Supervisor+ rungs stay unextracted (not entry roles).",
    },
    roleSummary: "Scores interactions against the account's quality standards and turns the patterns into coaching.",
    skills: [
      { name: "Data Analytics", tier: "core", sourceTag: "PSF", what: "Elucidate data with BI tools and analytics techniques to uncover trends." },
      { name: "Continuous Improvement", tier: "core", sourceTag: "PSF", what: "Turn audit findings into improvement follow-ups. (flagged paraphrase)" },
      { name: "Customer Behavior Analysis", tier: "core", sourceTag: "PSF", what: "Analyze information on customer behaviors (shared FSC with PSF-BD — provenance flagged)." },
      { name: "Customer Management", tier: "core", sourceTag: "PSF", what: "Stakeholder-side coordination of the quality program. (flagged paraphrase)" },
      { name: "Systems Thinking", tier: "core", sourceTag: "PSF", what: "Read quality issues as system-wide patterns. (flagged paraphrase)" },
      { name: "Document Control", tier: "core", sourceTag: "PSF", what: "Audit documentation discipline — record, store, track. (flagged paraphrase)" },
      { name: "Technical Report Writing", tier: "core", sourceTag: "PSF", what: "QA reports and coaching feedback write-ups. (flagged paraphrase)" },
      { name: "Analytical Method Validation", tier: "secondary", sourceTag: "PSF", what: "Keep the scoring method sound and repeatable. (flagged paraphrase)" },
      { name: "Data Visualization", tier: "secondary", sourceTag: "PSF", what: "Dashboards/graphs for KPI communication. (flagged paraphrase)" },
      { name: "Change Management · Concept Creation · Coaching and Mentoring · Conflict Resolution · Risk Management and Administration", tier: "secondary", sourceTag: "PSF", what: "Supporting behaviors for the QA seat (one row per printed FSC in the spec)." },
      { name: "Collaboration · Communication · Creative Thinking · Critical Thinking · Customer Orientation · Digital Fluency · Problem Solving · Project Management · Research · Stakeholder Management (Enabling, I/B)", tier: "secondary", sourceTag: "PSF", what: "Coaching-conversation and analysis behavior layer (printed stages carried)." },
    ],
  },
  {
    id: "events", // roster 3.9
    name: "Events / Conference Coordinator",
    psocCode: "3332",
    psocTitle: "Conference and event planners",
    track: "business",
    degreeMap: ["BSTM", "BSHM", "BSBA-MM (event marketing route)"],
    entryRoute: "Account-services/event-agency junior coordinator; vendor and venue booking; registration logistics for internal corporate events (CMO 62 s. 2017).",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #99 (Event Manager, asterisked)",
      note: "Plus Hard-to-Fill 'Event Coordinator' (Hotel/Restaurant/Tourism grouping). White-collar-adjacent corporate-events variant. Skill rows are a declared [O*NET] gap-filler (O*NET 13-1121.00, updated 2026; fetched live 2026-10-29) — no PSF event doc exists. The asterisk note travels with the demand citation.",
    },
    roleSummary: "Coordinates the events chain — venues, vendors, registration — and tracks the budget without surprises.",
    skills: [
      { name: "Client objectives & requirements determination", tier: "core", sourceTag: "O*NET", what: "Consult with customers on event objectives and requirements." },
      { name: "Event services coordination", tier: "core", sourceTag: "O*NET", what: "Coordinate the accommodation/equipment/catering chain." },
      { name: "Provider evaluation & selection; contract negotiation", tier: "core", sourceTag: "O*NET", what: "Evaluate providers; negotiate contracts within budget." },
      { name: "Facility inspection & conformity", tier: "core", sourceTag: "O*NET", what: "Inspect facilities against customer requirements." },
      { name: "Program, agenda, budget & services planning", tier: "core", sourceTag: "O*NET", what: "Plan the program, agenda and budget; monitor with sponsors." },
      { name: "Participant registration", tier: "core", sourceTag: "O*NET", what: "Organize registration of event participants." },
      { name: "Event-records keeping (incl. financials)", tier: "core", sourceTag: "O*NET", what: "Maintain records of event aspects, financials included; verify accuracy." },
      { name: "Event monitoring, compliance & problem resolution", tier: "core", sourceTag: "O*NET", what: "Monitor compliance and satisfaction; resolve problems. (the permit task keeps its US-institution PH note)" },
      { name: "Bills review & payment approval", tier: "secondary", sourceTag: "O*NET", what: "Review bills; approve payment under finance." },
      { name: "Post-event evaluation", tier: "secondary", sourceTag: "O*NET", what: "Evaluate how future events could improve." },
      { name: "Marketing & publicizing support", tier: "secondary", sourceTag: "O*NET", what: "Promote events; produce brochures/publications." },
      { name: "Administrative details & inquiries", tier: "secondary", sourceTag: "O*NET", what: "Financial admin, promo-material dissemination, inquiry responses." },
      { name: "Communication · Professionalism · Teamwork (Enabling)", tier: "secondary", sourceTag: "NACE", what: "Client/hotel coordination behavior." },
    ],
  },

  // == ─── Track 3 · Accounting & Finance (10: roster 4.1–4.10; 4.11 dropped) ─
  {
    id: "book", // roster 4.1
    name: "Bookkeeper",
    psocCode: "3313",
    psocTitle: "Accounting associate professionals — bookkeeper",
    track: "accounting",
    degreeMap: ["BSA", "BSMA", "BSAcT/BSAT", "BSIS (accounting systems minor)"],
    entryRoute: "Bookkeeper in an SME, a BPO finance & accounting (F&A) account, or an accounting services firm; TESDA Bookkeeping NC III is the direct credential (CMO 27/28 s. 2017; CMO 50 s. 2008).",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #38 (Bookkeeper)",
      note: "No PSF sector doc covers accounting (ADR-0001) — skills anchor on the TESDA Bookkeeping NC III TR as written (TR fetched live 2026-10-29 from the reachable Downloadables URL; \"100% accuracy\" lines are unit-scoped and verbatim per V-book-2).",
    },
    roleSummary: "Records the business's transactions end to end — journals to ledgers to trial balance to financial reports.",
    skills: [
      { name: "Journalize transactions", tier: "core", sourceTag: "TESDA", what: "Record business transactions in journals (\"Journal entries are prepared with 100% accuracy\")." },
      { name: "Post transactions", tier: "core", sourceTag: "TESDA", what: "Transfer journal entries to ledgers (\"Postings are done with 100% accuracy\")." },
      { name: "Prepare trial balance", tier: "core", sourceTag: "TESDA", what: "Extract and summarize trial balances (\"Trial Balances are extracted with 100% accuracy\")." },
      { name: "Prepare financial reports (manual)", tier: "core", sourceTag: "TESDA", what: "FS generation from ledger." },
      { name: "Review internal control system", tier: "secondary", sourceTag: "TESDA", what: "Basic control checks in line with industry practice (the NC III incremental advanced unit)." },
      { name: "Verify and record financial documents & records", tier: "secondary", sourceTag: "O*NET", what: "Check/verify figures and documents for correct entry." },
      { name: "Operate accounting software", tier: "secondary", sourceTag: "O*NET", what: "ERP/data-entry fluency on accounting software." },
      { name: "PSOC 3313 record-to-report envelope", tier: "secondary", sourceTag: "PSOC", what: "Maintain complete transaction records with guidance from Accountants." },
      { name: "Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Self Management (Enabling)", tier: "secondary", sourceTag: "NACE", what: "Office-behavior layer." },
    ],
  },
  {
    id: "acctclerk", // roster 4.2
    name: "Accounting Clerk",
    psocCode: "4311",
    psocTitle: "Accounting and bookkeeping clerks",
    track: "accounting",
    degreeMap: ["BSAcT/BSAT", "BSMA", "BSA", "BSOA (records support)"],
    entryRoute: "AP/AR clerk in a shared-services or SME finance team; invoice entry and supplier statement matching (CMO 50 s. 2008).",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #3 (Accounting Clerk)",
      note: "Third occupation on the entire national list. Converted per the blessed acctclerk.md (O*NET 43-3031.00 gap-filler + PSOC 4311 corroborating nearly 1:1): the platform's former \"3-way match\" label is replaced by the source-verbatim row name per V-acctclerk-3 (the matching substance rides the O*NET anchor).",
    },
    roleSummary: "Runs the AP/AR core loop — invoice matching, reconciliation, spreadsheet-and-accounting-software accuracy.",
    skills: [
      { name: "Check figures, postings, and documents for correct entry, mathematical accuracy, and proper codes", tier: "core", sourceTag: "O*NET", what: "The checking loop — figures, postings, invoice matching, coding." },
      { name: "Operate computers programmed with accounting software", tier: "core", sourceTag: "O*NET", what: "Accounting-software and spreadsheet fluency." },
      { name: "Classify, record, and summarize numerical and financial data to compile and keep financial records, using journals and ledgers or computers", tier: "core", sourceTag: "O*NET", what: "The record-keeping loop (PSOC 4311 letter c confirms verbatim)." },
      { name: "Reconcile or note and report discrepancies found in records", tier: "core", sourceTag: "O*NET", what: "Month-end readiness — reconcile and report." },
      { name: "Prepare and issue account statements / bills / invoices", tier: "core", sourceTag: "O*NET", what: "Statement/bill/invoice preparation and issue." },
      { name: "Receive, record, and bank cash, checks, and vouchers (petty cash / collections recording)", tier: "secondary", sourceTag: "O*NET", what: "Cash-handling accounting. (platform parenthetical kept with its footnote)" },
      { name: "Journalize/post transactions (bookkeeping cycle)", tier: "secondary", sourceTag: "TESDA", what: "Close-support tasks on the bookkeeping cycle." },
      { name: "Government forms & compliance paperwork", tier: "secondary", sourceTag: "O*NET", what: "Forms/returns processing (PH regulatory layer is a later addendum)." },
      { name: "PSOC 4311 record-keeping envelope", tier: "secondary", sourceTag: "PSOC", what: "The unit's own compute/post/verify envelope." },
      { name: "Communication · Professionalism · Critical Thinking (Enabling)", tier: "secondary", sourceTag: "NACE", what: "Original-document discipline." },
    ],
  },
  {
    id: "pay", // roster 4.3
    name: "Payroll Assistant",
    psocCode: "4313",
    psocTitle: "Payroll clerks",
    track: "accounting",
    degreeMap: ["BSAcT/BSAT", "BSMA", "BSBA-HRM (payroll admin sits in HR accounts)"],
    entryRoute: "Payroll analyst/admin assistant in HRSS/finance shared services; statutory-pay computation training is the whole job in PH (CMO 50 s. 2008 / 17 s. 2017).",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #196 (Payroll Assistant/Analyst)",
      note: "Skill rows are a declared [O*NET] gap-filler (O*NET 43-3051.00), dual-quoted with PSOC 4313; PH statutory-pay knowledge (13th month, premiums) is the platform layer — the DOLE-BWC handbook (via the official NWPC mirror) is the verified free document. SSS/PhilHealth/Pag-IBIG portals stand only as labeled start-here placeholders (keep-with-flag ruling 2026-10-29); BIR eFPS tutorial pages dead-in-copy while unreachable.",
    },
    roleSummary: "Verifies time and attendance, computes wages with statutory deductions, and balances the payroll register to the bank.",
    skills: [
      { name: "Verify attendance, hours worked, and pay adjustments, and post information onto designated records", tier: "core", sourceTag: "O*NET", what: "The source-of-truth loop (PSOC 4313 e confirms verbatim)." },
      { name: "Compute wages and deductions, and enter data into computers", tier: "core", sourceTag: "O*NET", what: "Gross → net runs including withholding tax, SSS/PhilHealth/Pag-IBIG." },
      { name: "Prepare and balance period-end reports, and reconcile issued payrolls to bank statements", tier: "core", sourceTag: "O*NET", what: "Bank-vs-ledger match." },
      { name: "Process and issue employee paychecks and statements of earnings and deductions", tier: "core", sourceTag: "O*NET", what: "Pay-out step of the loop." },
      { name: "Prepare and file payroll tax returns / statutory paperwork", tier: "secondary", sourceTag: "O*NET", what: "PH statutory paperwork layer (BIR/SSS context — flagged placeholders)." },

      { name: "Provide information to employees and managers on payroll matters, tax issues, benefit plans, and collective agreement provisions", tier: "secondary", sourceTag: "O*NET", what: "Employee-facing service." },
      { name: "Keep leave records", tier: "secondary", sourceTag: "O*NET", what: "Leave trackers (SL/VL, service incentive leave)." },
      { name: "Records hygiene & confidentiality (RA 10173 context)", tier: "secondary", sourceTag: "NACE", what: "PII discipline." },
      { name: "Communication · Professionalism (Enabling)", tier: "secondary", sourceTag: "NACE", what: "Employee-facing behavior." },
    ],
  },
  {
    id: "fas", // roster 4.4
    name: "Finance & Accounting Associate",
    psocCode: "3313",
    psocTitle: "Accounting associate professionals — BPS F&A officer",
    track: "accounting",
    degreeMap: ["BSA", "BSMA", "BSAIS", "BSIA"],
    entryRoute: "F&A processing in shared-service centers (record-to-report, invoice-to-pay, GL posting, month-end close) — the largest single accounting-adjacent entry hiring pool via campus hiring at the big shared-service hubs (Metro Manila/Cebu/Bacolod/Clark) (CMO 27/28/30/29 s. 2017).",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #45 (BPS Finance and Accounting Officer, asterisked)",
      note: "Also #5 Accounting/Finance Associate; #4 Accounting Supervisor is the next rung. Converted per the blessed fas.md — [PSF] primary upgraded to PSF-GIH F&A \"Agent/Associate/Representative/Analyst\" (printed pp.92–93, spread pins V-fas-1/2/3 resolved 2026-10-29); the old \"SOX/internal-controls\" catalog label is re-anchored to the printed FSC Internal Controls.",
    },
    roleSummary: "Processes the GL engine in a shared service — journal entries, month-end support, ERP transactions with control-checklist discipline.",
    skills: [
      { name: "Perform financial accounting and corporate reporting activities", tier: "core", sourceTag: "PSF", what: "Month-end support, accurate records, double-entry processing. (printed CWF)" },
      { name: "Process business transactions and reports using information technology tools", tier: "core", sourceTag: "PSF", what: "Accounting-system reports, account-code mapping, accurate data entry. (printed CWF)" },
      { name: "Support strategic planning", tier: "core", sourceTag: "PSF", what: "Budgeting/forecasting assistance; balance-sheet and P&L analysis support. (printed CWF)" },
      { name: "Accounting and Tax Systems", tier: "core", sourceTag: "PSF", what: "Input/operate accounting systems (printed L2/L3 cells — relabeled per facsimile)." },
      { name: "Data Collection and Analysis", tier: "core", sourceTag: "PSF", what: "Collect with BI tools; analyse for insights (printed L3/L4 cells — relabeled per facsimile)." },
      { name: "Financial Analysis", tier: "core", sourceTag: "PSF", what: "Ratio analyses on statements for insights. (printed L3 at the entry rung — ruled accepted verbatim; one-line framing: the framework's own entry sizing)" },
      { name: "Internal Controls", tier: "secondary", sourceTag: "PSF", what: "Evaluate control effectiveness; spot control gaps (printed 2–3 progression as printed)." },
      { name: "Diversity Awareness and Management", tier: "secondary", sourceTag: "PSF", what: "Awareness side of people interactions (honest thin on resources)." },
      { name: "Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Sense Making · Transdisciplinary Thinking (Enabling, B/I)", tier: "secondary", sourceTag: "PSF", what: "ESC strip as printed (Collaboration B · Communication I · Digital Fluency I · Learning Agility B · Problem Solving B · Sense Making B · Transdisciplinary B)." },
      { name: "O*NET corroboration block (operating-the-GL-engine tasks)", tier: "secondary", sourceTag: "O*NET", what: "The O*NET 43-3031.00 side of the same record-to-report loop — quoted, not renamed." },
    ],
  },
  {
    id: "fin", // roster 4.5
    name: "Financial Analyst",
    psocCode: "2413",
    psocTitle: "Financial analysts",
    track: "accounting",
    degreeMap: ["BSBA-FM", "BS Economics", "BS Statistics", "BSMA"],
    entryRoute: "Junior analyst at an FMCG/telecom/bank FP&A desk or an outsource financial research provider (CMO 17/32/42 s. 2017).",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #108 (Financial Analyst)",
      note: "Demand is economy-wide: also named under IT/BPM (#34) and Hotel/Restaurant/Tourism (#52) groupings. Declared [O*NET] gap-filler (13-2051.00 Financial and Investment Analysts) dual-quoted with PSOC 2413 — the least contested gap-filler row set in the track; CPA/CFA is NOT an entry gate.",
    },
    roleSummary: "Reads financial statements and industry trends into models, write-ups, and a recommendation supportable in review.",
    skills: [
      { name: "Analyze financial information to forecast business, industry, or economic conditions for investment decisions", tier: "core", sourceTag: "O*NET", what: "Build the base DCF-driven story." },
      { name: "Monitor economic, industrial, and corporate developments", tier: "core", sourceTag: "O*NET", what: "Stay abreast across publications and sources." },
      { name: "Employ financial models to develop solutions to financial problems or to assess the financial or capital impact of transactions", tier: "core", sourceTag: "O*NET", what: "Model-design work for decisions." },
      { name: "Interpret data on price, yield, stability, future investment-risk trends, economic influences", tier: "core", sourceTag: "O*NET", what: "Read the market data the desk runs on." },
      { name: "Recommend investments and investment timing", tier: "core", sourceTag: "O*NET", what: "The desk's output — recommendations supportable in review." },
      { name: "Present oral or written reports on general economic trends, individual corporations, and entire industries", tier: "core", sourceTag: "O*NET", what: "The communication backbone of the analyst job." },
      { name: "Draw charts and graphs, using computer spreadsheets, to illustrate technical reports", tier: "secondary", sourceTag: "O*NET", what: "Spreadsheet visualization." },
      { name: "Advise clients on aspects of capitalization, such as amounts, sources, or timing", tier: "secondary", sourceTag: "O*NET", what: "Capital budgeting fluency (normally senior-received work)." },
      { name: "Supervise, train, or mentor junior team members", tier: "secondary", sourceTag: "O*NET", what: "Senior-heavy; kept for honesty of the full task list (resourceless by declaration)." },
      { name: "Communication · Critical Thinking · Professionalism (Enabling)", tier: "secondary", sourceTag: "NACE", what: "Analyst craft behavior." },
    ],
  },
  {
    id: "treasury", // roster 4.6
    name: "Treasury Assistant",
    psocCode: "4312",
    psocTitle: "Statistical, finance and insurance clerks — treasury clerk",
    track: "accounting",
    degreeMap: ["BSBA-FM", "BSA", "BSMA", "BSAcT"],
    entryRoute: "Treasury assistant in corporate treasury or a bank's back-office; cash positioning/reconciliation paperwork; entry tier with a clear ladder (senior → treasury analyst) (CMO 17 s. 2017).",
    demandBlock: {
      status: "hard-to-fill",
      source: "JobsFit LMI 2013–2020 · Hard-to-Fill (Wholesale & Retail grouping) · Treasury Assistant",
      note: "Hybrid [O*NET Tellers + PSOC 4312] tiering, openly flagged in the roster — no O*NET occupation matches corporate treasury assistant exactly. Declared hybrid basis accepted (ruling: gaps accepted, no forced searches); no invented \"cash positioning/forecasting\".",
    },
    roleSummary: "Balances cash, reconciles the spreadsheets, and keeps the treasury paperwork moving with zero surprises.",
    skills: [
      { name: "Balance currency, coin, and checks in cash drawers at ends of shifts and calculate daily transactions, using computers, calculators, or adding machines", tier: "core", sourceTag: "O*NET", what: "Daily cash discipline (borrowed O*NET-Tellers task; hybrid flagged)." },
      { name: "Enter customers' transactions into computers to record transactions and issue computer-generated receipts", tier: "core", sourceTag: "O*NET", what: "Transaction entry and receipts." },
      { name: "Reconcile records of financial transactions", tier: "core", sourceTag: "O*NET", what: "Spreadsheet recon (the old \"Bank reconciliation spreadsheets\" label renamed to the quoted O*NET verb with attribution)." },
      { name: "Prepare financial documents, and calculate interest or brokerage charges and stamp duties payable", tier: "secondary", sourceTag: "PSOC", what: "LC/PO/instrument paperwork flavor (PSOC 4312 d)." },
      { name: "Maintain records of bonds, shares and other securities bought or sold on behalf of clients or employer", tier: "secondary", sourceTag: "PSOC", what: "Securities-record upkeep (PSOC 4312 e)." },
      { name: "Accuracy/Professionalism (Enabling)", tier: "secondary", sourceTag: "NACE", what: "Zero-surprise cash behavior." },
    ],
  },
  {
    id: "coll", // roster 4.7
    name: "Bill & Account Collector",
    psocCode: "4214",
    psocTitle: "Debt collectors and related workers",
    track: "accounting",
    degreeMap: ["any business-track canon (BSBA-FM/OM/HRM)"],
    entryRoute: "Collections agent for banks/cards/telecom receivables; scripted outreach + payments processing in field/tele-collection roles.",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #62 (Collector, Banking and Finance grouping)",
      note: "A PH-native customer-service corporate occupation on the DOLE lists — not a trades role. Declared [O*NET] gap-filler (43-3011.00) + PSOC 4214; thin-resource zone accepted (no free collections-specific training verified — BSP 403, CFI paid); RA 3765 stays flagged dead-in-copy wherever named (never a live link, ruling 2026-10-29).",
    },
    roleSummary: "Locates and notifies customers of delinquent accounts, arranges repayment, and logs every touch.",
    skills: [
      { name: "Locate and notify customers of delinquent accounts by mail, telephone, or personal visits to solicit payment", tier: "core", sourceTag: "O*NET", what: "The core collection loop." },
      { name: "Arrange for debt repayment or establish repayment schedules, based on customers' financial situations", tier: "core", sourceTag: "O*NET", what: "Solving-not-hounding approach." },
      { name: "Record information about financial status of customers and status of collection efforts", tier: "core", sourceTag: "O*NET", what: "Case-file reading and recording." },
      { name: "Confer with customers by telephone or in person to determine reasons for overdue payments and to review the terms of sales, service, or credit contracts", tier: "core", sourceTag: "O*NET", what: "The conversation craft." },
      { name: "Receive payments and post amounts paid to customer accounts", tier: "core", sourceTag: "O*NET", what: "Money-handling close of the loop." },
      { name: "Trace delinquent customers to new addresses by inquiring at post offices, telephone companies, credit bureaus, or through the questioning of neighbors", tier: "secondary", sourceTag: "O*NET", what: "Skip-tracing (ethics-sensitive — DPA + conduct note carried)." },
      { name: "Recommend legal action or disconnection when payment cannot be obtained / negotiate credit extensions", tier: "secondary", sourceTag: "O*NET", what: "Escalation and concession authority (flagged paraphrase name)." },
      { name: "Administrative upkeep of assigned accounts", tier: "secondary", sourceTag: "O*NET", what: "Account-record upkeep (flagged paraphrase name)." },
      { name: "Communication · Professionalism (Enabling)", tier: "secondary", sourceTag: "NACE", what: "Skip-tracing ethics, customer care." },
    ],
  },
  {
    id: "credit", // roster 4.8
    name: "Credit Analyst",
    psocCode: "3312",
    psocTitle: "Credit and loans officers — credit investigator",
    track: "accounting",
    degreeMap: ["BSBA-FM", "BSA", "BSMA", "BS Statistics (risk-ops flavoring)"],
    entryRoute: "Credit ops analyst inside a bank's credit or collections-analytic team; documentary credit investigation; grows to underwriting.",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #80 (Credit Investigator)",
      note: "Hybrid [PSOC 3312 unit text + O*NET Loan Officers] tiering, openly declared — tiering is judgment-based and flagged (PSOC-weighted at the investigator band). Label spelling split preserved as printed (\"Credit and loans officers\" label vs \"Credit and loan officers…\" description).",
    },
    roleSummary: "Verifies documents, assesses financial status, and supports credit decisions within authority limits.",
    skills: [
      { name: "Researching and evaluating loan applicant's financial status, references, credit and ability to repay the loan", tier: "core", sourceTag: "PSOC", what: "Case-file reading (the occupational core — PSOC letter b)." },
      { name: "Interviewing applicants for personal, mortgage, student and business loans", tier: "core", sourceTag: "PSOC", what: "Client-facing credit conversations (PSOC letter a)." },
      { name: "Submitting credit and loan applications to management with recommendations for approval or rejection; approving or rejecting within authorized limits", tier: "core", sourceTag: "PSOC", what: "Decision-support within authority (PSOC letters c–d)." },
      { name: "Keeping records of payments, and preparing routine letters requesting payment for overdue accounts and forwarding these for legal action", tier: "core", sourceTag: "PSOC", what: "KYC quality (PSOC letter e)." },
      { name: "Completing credit and loan documentation", tier: "core", sourceTag: "PSOC", what: "Documentation completeness (PSOC letter f)." },
      { name: "Explain to customers the different types of loans and credit options that are available, as well as the terms of those services", tier: "secondary", sourceTag: "O*NET", what: "Client-facing credit conversations." },
      { name: "Confer with underwriters to resolve mortgage application problems / submit applications to credit analysts", tier: "secondary", sourceTag: "O*NET", what: "Underwriter liaison (adjacent-band pathway row)."},
      { name: "Sizing the credit portfolio (delinquent-account reports)", tier: "secondary", sourceTag: "O*NET", what: "Delinquency reporting (borders coll — kept as adjacency)." },
      { name: "Integrity/Professionalism (Enabling)", tier: "secondary", sourceTag: "NACE", what: "Financial-services ethics." },
    ],
  },
  {
    id: "teller", // roster 4.9
    name: "Bank Teller",
    psocCode: "4211",
    psocTitle: "Bank tellers and related clerks",
    track: "accounting",
    degreeMap: ["any CHED canon (BSBA-FM common)"],
    entryRoute: "Bank branch teller; typically the only finance-profession entry point without a CPA license; path to new accounts/back office.",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #29 (Bank Teller, Banking and Finance grouping)",
      note: "[O*NET]-anchored (43-3071.00 Tellers) dual-quoted with PSOC 4211; branch-service decorum from NACE cross-cutting — no PH framework covers teller skill detail. The post-office flank (letter d)) stays quoted for source honesty with bank-branch framing (accepted row-naming ruling).",
    },
    roleSummary: "Handles the branch's cash and transactions to daily zero variance — verification, signature checks, accurate systems entry.",
    skills: [
      { name: "Balance currency, coin, and checks in cash drawers at ends of shifts and calculate daily transactions, using computers, calculators, or adding machines", tier: "core", sourceTag: "O*NET", what: "Daily zero-variance." },
      { name: "Receive checks and cash for deposit, verify amounts, and check accuracy of deposit slips", tier: "core", sourceTag: "O*NET", what: "Transaction integrity — signatures, amounts, funds." },
      { name: "Enter customers' transactions into computers to record transactions and issue computer-generated receipts", tier: "core", sourceTag: "O*NET", what: "System fluency." },
      { name: "Resolve problems or discrepancies concerning customers' accounts", tier: "core", sourceTag: "O*NET", what: "The zero-variance discipline." },
      { name: "Receive mortgage, loan, or public utility bill payments, verifying payment dates and amounts due / process term deposits and other savings-plan transactions", tier: "core", sourceTag: "O*NET", what: "Counter-transaction breadth." },
      { name: "Customer service & special services (cards, checks ordering)", tier: "secondary", sourceTag: "O*NET", what: "Cards/checks ordering (post-office letter d) kept as printed source honesty)." },
      { name: "Explain, promote, or sell products or services, such as travelers' checks, savings bonds, money orders, and cashier's checks, using computerized information about customers to tailor recommendations", tier: "secondary", sourceTag: "O*NET", what: "Tailored recommendations on products." },
      { name: "Front-desk service etiquette (Enabling)", tier: "secondary", sourceTag: "NACE", what: "Branch behavior." },
      { name: "Professionalism · Teamwork (Enabling)", tier: "secondary", sourceTag: "NACE", what: "Bank-culture fit." },
    ],
  },
  {
    id: "audit", // roster 4.10
    name: "Audit Associate",
    psocCode: "3313",
    psocTitle: "Accounting associate professionals — audit assistant",
    track: "accounting",
    degreeMap: ["BSIA", "BSA", "BSAIS"],
    entryRoute: "External audit associate at a public accounting firm (Big 4 + local firms campus-hire) OR internal audit associate (in-house). CPA licensure note: do not claim a blanket CPA requirement at entry; PRC CPA is the promotion gate for audit manager ranks (RA 9298) (CMO 29/27/30 s. 2017).",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #22 (Auditor)",
      note: "Also named under the IT/BPM grouping (#33). Strongest 'gap-filler honesty' case — hybrid [O*NET 13-2011.00 + PSOC 3313] with no PH competency framework covering audit. Row 11 (technology row) is the ruled ADD — its O*NET Software-Skills attribution placeholder was filled at the blessed version pin (O*NET 31.0 · Technology Skills · 13-2011.00; all 37 served categories with served example tools, ruling 2026-11-02).",
    },
    roleSummary: "Reconciles accounts, tests the historical record, and keeps the audit trail signed off — the workpaper craft.",
    skills: [
      { name: "Prepare, examine, or analyze accounting records, financial statements, or other financial reports to assess accuracy, completeness, and conformance to reporting and procedural standards", tier: "core", sourceTag: "O*NET", what: "Substantive testing core." },
      { name: "Review accounts for discrepancies and reconcile differences", tier: "core", sourceTag: "O*NET", what: "Reconciliation discipline." },
      { name: "Collect and analyze data to detect deficient controls, duplicated effort, extravagance, fraud, or non-compliance with laws, regulations, and management policies", tier: "core", sourceTag: "O*NET", what: "The internal-control nucleus of associate testing." },
      { name: "Inspect cash on hand, notes receivable and payable, negotiable securities, and canceled checks to confirm records are accurate", tier: "core", sourceTag: "O*NET", what: "The inspection loop (PSOC 3313 carries the entry-band \"with guidance from Accountants\" ratio)." },
      { name: "Examine records and interview workers to ensure recording of transactions and compliance with laws and regulations", tier: "core", sourceTag: "O*NET", what: "Interviews and compliance ensures." },
      { name: "Prepare detailed reports on audit findings", tier: "core", sourceTag: "O*NET", what: "The audit trail (the \"sign-off\" label is a platform label, flagged)." },
      { name: "Prepare adjusting journal entries / establish tables of accounts and assign entries to proper accounts", tier: "secondary", sourceTag: "O*NET", what: "Close-support account mapping under supervision." },
      { name: "Compliance / tax analog & frameworks", tier: "secondary", sourceTag: "O*NET", what: "Regulatory context (PH PFRS/tax addendum later)." },
      { name: "Senior-heavy supervision tasks", tier: "secondary", sourceTag: "O*NET", what: "Not entry expectations — honesty fold-in." },
      { name: "Professional Skepticism (attitude) · Communication (Enabling)", tier: "secondary", sourceTag: "NACE", what: "Audit-culture craft (skepticism kept per ruling 2026-10-29; NACE-backed, attributed)." },
      { name: "Audit technology fluency (accounting software / Excel family)", tier: "secondary", sourceTag: "O*NET", what: "Standard accounting software / Excel family — anchored to the O*NET Software Skills list. [O*NET 31.0 · Technology Skills · 13-2011.00 — version pin landed: all 37 served categories with served example tools (4A fill, ruling 2026-11-02)]" },
    ],
  },

  // == ─── Track 4 · Office & Administration (6: 5.1–5.3 + 5.5 + E2 + E3) ─────
  {
    id: "adminassoc", // roster 5.1
    name: "Administrative Associate",
    psocCode: "3343",
    psocTitle: "Administrative and executive secretaries (span-note: between 3343 and 4110)",
    track: "office",
    degreeMap: ["BSOA", "BSBA any major", "BSIS (records systems)"],
    entryRoute: "Admin associate in a departmental back-office (schedule, records, coordination); often the first post-BSOA role (CMO 19 s. 2017).",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #8 (Administrative Associate)",
      note: "Rank 8 on the entire national list. PSOC mapping judgment flagged in the roster; the JobsFit list title sits between the two unit groups. O*NET 43-6014 re-extracted this pass (31 tasks, 200); Job-Zone honesty note stands (Zone 1–2 low-formation — the BSOA framing is not inflated).",
    },
    roleSummary: "The department's records backbone — filing systems, databases, front-of-department calls, office equipment.",
    skills: [
      { name: "Filing systems (paper/electronic) operation", tier: "core", sourceTag: "O*NET", what: "Records backbone." },
      { name: "Database entry & maintenance", tier: "core", sourceTag: "O*NET", what: "Departmental record-keeping." },
      { name: "Multi-channel reception & call routing", tier: "core", sourceTag: "O*NET", what: "Front-of-department role." },
      { name: "Office equipment operation & basic troubleshooting", tier: "core", sourceTag: "O*NET", what: "Facilities support." },
      { name: "Meeting/coordination documentation", tier: "secondary", sourceTag: "O*NET", what: "Minutes, memos, schedules." },
      { name: "Communication · Professionalism · Critical Thinking (Enabling)", tier: "secondary", sourceTag: "NACE", what: "Office citizenship." },
    ],
  },
  {
    id: "clerk", // roster 5.2 — split row shape ruled 2026-10-29 (e/g/h → three thin rows)
    name: "Office Clerk",
    psocCode: "4110",
    psocTitle: "General office clerks",
    track: "office",
    degreeMap: ["BSOA", "open-tier CHED canon"],
    entryRoute: "Office clerk through general-services/records; small-company hiring; document flow (CMO 19 s. 2017).",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #189 (Office Clerks)",
      note: "[O*NET]-anchored; the honesty is narrowing the title to 'general office clerk' — the mental model students need. Row shape ruled 2026-10-29: the unit letter e/g/h bundle is split into three thin rows exactly as the sources print the tasks (row 6 declared resourceless-thin).",
    },
    roleSummary: "Keeps the office flowing — records sorted and filed, calls answered and routed, requests answered from the files.",
    skills: [
      { name: "Recording, preparing, sorting, classifying and filing information", tier: "core", sourceTag: "PSOC", what: "Core clerk task (unit letter a)." },
      { name: "Sorting, opening and sending mail", tier: "core", sourceTag: "PSOC", what: "Office mail flow (unit letter b)." },
      { name: "Photocopying and sending documents", tier: "core", sourceTag: "PSOC", what: "Document reproduction (unit letter c)." },
      { name: "Routine reports & correspondence", tier: "core", sourceTag: "PSOC", what: "Routine written output (unit letter d)." },
      { name: "Responding to enquiries (telephone/electronic) or forwarding", tier: "core", sourceTag: "PSOC", what: "Enquiry service from records (unit letter f)." },
      { name: "Recording issue of equipment to staff", tier: "secondary", sourceTag: "PSOC", what: "Equipment-issue register (unit letter e — thin lettered row; declared resourceless-thin)." },
      { name: "Checking figures, preparing invoices and recording details of financial transactions made", tier: "secondary", sourceTag: "PSOC", what: "Figures/invoices/transaction details (unit letter g — thin lettered row)." },
      { name: "Transcribing information into computers, and proof-reading and correcting copy", tier: "secondary", sourceTag: "PSOC", what: "Transcription throughput (unit letter h — thin lettered row; carries the O*NET database-systems anchor in the split)." },
      { name: "Communication · Professionalism (Enabling)", tier: "secondary", sourceTag: "NACE", what: "Workday reliability." },
    ],
  },
  {
    id: "encode", // roster 5.3 — d/e split ruled 2026-10-29 (crypto anchor KEPT)
    name: "Data Encoder",
    psocCode: "4132",
    psocTitle: "Data entry clerks",
    track: "office",
    degreeMap: ["open-tier canon", "BSOA", "BSIS"],
    entryRoute: "Data processing teams in BPM/back-office services; accuracy/throughput-based timing.",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #95 (Encoder, asterisked)",
      note: "Asterisked = not fully defined in PSOC 2012, so the employer title is the anchor. Declared [O*NET] gap-filler (O*NET 43-9021.00, all 9 tasks). Ruled row shape 2026-10-29: letters d)/e) are split thin rows; the \"cryptographic procedures\" O*NET anchor is KEPT (source-printed) and stations with the data-movement row.",
    },
    roleSummary: "Enters data the right field the first time — accuracy loops, pre-entry sorting, throughput under deadline.",
    skills: [
      { name: "Receiving & registering source documents for data capture", tier: "core", sourceTag: "PSOC", what: "Ingest discipline — what lands, when, where." },
      { name: "Source-document reading & field mapping (entering from source material)", tier: "core", sourceTag: "O*NET", what: "Correct-field discipline." },
      { name: "Accuracy/error detection & correction", tier: "core", sourceTag: "O*NET", what: "QA personal loop." },
      { name: "Compilation, sorting, verification before entry", tier: "core", sourceTag: "O*NET", what: "Pre-entry quality." },
      { name: "Storing completed documents & logs (records + throughput discipline)", tier: "secondary", sourceTag: "O*NET", what: "Where finished work goes; proof of throughput." },
      { name: "Operating bookkeeping and calculating machines", tier: "secondary", sourceTag: "PSOC", what: "Machine operation (unit letter d — thin lettered row)." },
      { name: "Importing and exporting data between different database systems and softwares", tier: "secondary", sourceTag: "PSOC", what: "Data movement (unit letter e — thin lettered row; carries the KEPT cryptographic-procedures O*NET anchor)." },
      { name: "Confidentiality (Etiquette/Professionalism — Enabling)", tier: "secondary", sourceTag: "NACE", what: "PII/financial data respect." },
    ],
  },
  {
    id: "desk", // roster 5.5 — 5 lettered PSOC 4225 core rows (ruled shape 2026-10-29)
    name: "Counter / Enquiry Clerk",
    psocCode: "4225",
    psocTitle: "Enquiry clerks — counter clerk/desk clerk/information clerk",
    track: "office",
    degreeMap: ["open-tier", "BSOA", "BSBA-HRM", "TESDA Contact Center Services NC II (practical credential)"],
    entryRoute: "Front-desk/reception in corporates, schools, hospitals, BPO admin areas; cross-gate to the Customer Service Representative family.",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #122 (Frontline Desk Service, asterisked)",
      note: "Asterisked; the title is named in the Hotel/Restaurant/Tourism grouping — the catalog keeps it for corporate front-desk/reception adjacency and refuses hotel-specific framing. Row shape RULED 2026-10-29: the 5 lettered PSOC 4225 core rows are the adopted shape (unit text parsed 2026-10-29 from the phscs v0.2.0 dataset — possessive literally printed per VD1-1).",
    },
    roleSummary: "Receives walk-ins and calls, logs and follows up inquiries, and carries the corporate front-desk standard.",
    skills: [
      { name: "Answering inquiries about goods/services/policies (availability, location, price)", tier: "core", sourceTag: "PSOC", what: "The unit's defining act (lettered task a)." },
      { name: "Assisting on problems, advice, information (member of the counter service set)", tier: "core", sourceTag: "PSOC", what: "Be where difficult requests are handled first (lettered task b)." },
      { name: "Recording information about enquiries and complaints", tier: "core", sourceTag: "PSOC", what: "Visitor/inquiry logging (lettered task c)." },
      { name: "Referring complex enquiries to team leaders or expert advisers", tier: "core", sourceTag: "PSOC", what: "The translate-request-escalate pattern (lettered task d)." },
      { name: "Issuing forms, information kits and brochures", tier: "core", sourceTag: "PSOC", what: "Counter-side document service (lettered task e)." },
      { name: "Communication & professionalism at the corporate front-desk (Enabling)", tier: "secondary", sourceTag: "PSF", what: "Office-culture fit (PSF-CCB behavior language usable verbatim; OpenLearn backing rides the keep-with-flag verdict)." },
    ],
  },
  {
    // CANON-adjacent extension: rows byte-identical to the E2 extraction (17).
    id: "execsec", // extension E2
    name: "Executive Secretary",
    psocCode: "3343",
    psocTitle: "Administrative and executive secretaries",
    track: "office",
    degreeMap: ["BSOA", "BSBA any major"],
    entryRoute: "Executive secretary / administrative secretary track in corporate offices; CHED BSOA canon expects this family (CMO 19 s. 2017).",
    demandBlock: {
      status: "institutional-judgment",
      source: "not DOLE-BLE-justified — institutional judgment",
      note: "E2 extension admitted per ruling R4 (2026-10-29). Secretarial titles are absent from the 2013–2020 lists; PSA OWS organizes on the family. Skill map transcribed from O*NET 43-6011.00 Executive Secretaries and Executive Administrative Assistants (updated 2026, 23/23 tasks re-extracted 2026-10-29; pending-role-maps §2) — O*NET reads the family as a mid tier (Job Zone Three), so entry framing stays junior-feeder.",
    },
    roleSummary: "Runs the executive's office — correspondence, schedules, records, coordination — at the executive-support standard.",
    skills: [
      { name: "Executive schedule & calendar management", tier: "core", sourceTag: "O*NET", what: "Run the calendar of the people you support — no double-booking, no missed window." },
      { name: "Correspondence & document production", tier: "core", sourceTag: "O*NET", what: "Produce the office's written output — letters, memos, spreadsheets, decks — to standard." },
      { name: "Meeting administration & minutes", tier: "core", sourceTag: "O*NET", what: "Prepare agendas, take and finish minutes, and make meetings actually happen on time." },
      { name: "Information gatekeeping: calls & visitors", tier: "core", sourceTag: "O*NET", what: "Answer for the office — route the call, receive the visitor, decide who gets the meeting." },
      { name: "Research & briefing support for executives", tier: "core", sourceTag: "O*NET", what: "Dig up information and shape it into briefing papers decision-makers can use." },
      { name: "Incoming-material triage & distribution", tier: "core", sourceTag: "O*NET", what: "Read what comes in, judge what matters, and get it to the right hands." },
      { name: "Office services coordination", tier: "core", sourceTag: "O*NET", what: "Be the hub that holds office services — records, budget prep, housekeeping — together." },
      { name: "Travel arrangements", tier: "core", sourceTag: "O*NET", what: "Book trips and itineraries for executives end to end." },
      { name: "Records & document filing/retrieval", tier: "secondary", sourceTag: "O*NET", what: "Keep corporate files complete and retrievable (also overlaps the filing-clerk skill in E3)." },
      { name: "General office duties & tools", tier: "secondary", sourceTag: "O*NET", what: "Handle day-to-day office upkeep: supplies, record databases, basic bookkeeping." },
      { name: "Clerical support across departments", tier: "secondary", sourceTag: "O*NET", what: "Lend admin firepower wherever another department needs it." },
      { name: "Payroll-information processing", tier: "secondary", sourceTag: "O*NET", what: "Push payroll data into the pay cycle correctly and on time." },
      { name: "Administrative policy setup & interpretation", tier: "secondary", sourceTag: "O*NET", what: "Explain the office rules — and as you grow, help write them. (senior-heavy tasks)" },
      { name: "Representing executives / meeting on their behalf", tier: "secondary", sourceTag: "O*NET", what: "Sometimes you *are* the meeting — attend for the executive and report back. (senior-heavy task)" },
      { name: "Supervision & training of clerical staff", tier: "secondary", sourceTag: "O*NET", what: "Onboard and guide the junior clerks around you. (senior-heavy task)" },
      { name: "Operating-practice review", tier: "secondary", sourceTag: "O*NET", what: "Look for the slow spots in workflow and propose fixes. (senior-heavy task)" },
      { name: "Employee time-tracking", tier: "secondary", sourceTag: "O*NET", what: "Keep attendance/time records straight." },
    ],
  },
  {
    // CANON-adjacent extension: rows byte-identical to the E3 extraction (11).
    id: "records", // extension E3
    name: "Records Clerk",
    psocCode: "4415",
    psocTitle: "Filing and copying clerks",
    track: "office",
    degreeMap: ["BSOA"],
    entryRoute: "Records/filing family in offices of every size; a natural BSOA feeder.",
    demandBlock: {
      status: "institutional-judgment",
      source: "not DOLE-BLE-justified — institutional judgment",
      note: "E3 extension admitted per ruling R4 (2026-10-29). Not named in DOLE demand lists; natural BSOA feeder; TESDA has no dedicated NC. Skill map: [PSOC] 4415 unit-text lettered tasks a)–e) as primary rows (phscs PSA-2012 mirror, pending-role-maps §3) + [O*NET] 43-4171.00 Receptionists and Information Clerks (updated 2026, fetched 2026-10-29) as corroboration rows.",
    },
    roleSummary: "Maintains the filing backbone — classification, retrieval, copying — so every office can find its records.",
    skills: [
      { name: "Sort & classify materials to filing rules", tier: "core", sourceTag: "PSOC", what: "Put every document where the filing system says it belongs. (PSOC 4415 task a)" },
      { name: "Filing into storage (drawers/cabinets/boxes)", tier: "core", sourceTag: "PSOC", what: "Physically (or digitally) file the records — correctly, immediately, every time. (PSOC 4415 task b)" },
      { name: "File retrieval on request", tier: "core", sourceTag: "PSOC", what: "Find any filed item on demand without minutes of searching. (PSOC 4415 task c)" },
      { name: "Filing log / records of materials filed & removed", tier: "core", sourceTag: "PSOC", what: "Track what went in and what went out so nothing is ever \"lost in filing\". (PSOC 4415 task d)" },
      { name: "Reprographics: photocopy, scan, fax", tier: "core", sourceTag: "PSOC", what: "Operate the copy/scan/fax flow that feeds and mirrors the file. (PSOC 4415 task e)" },
      { name: "Telephone, switchboard & front-desk duties", tier: "secondary", sourceTag: "O*NET", what: "Take calls, screen them, relay messages — the office's first voice. (corroboration)" },
      { name: "Visitor greeting & routing", tier: "secondary", sourceTag: "O*NET", what: "Meet visitors, learn what they need, point them to the right door. (corroboration)" },
      { name: "Appointment & calendar scheduling", tier: "secondary", sourceTag: "O*NET", what: "Keep the office's calendar alive and accurate. (corroboration)" },
      { name: "Mail & document handling", tier: "secondary", sourceTag: "O*NET", what: "Move paper and messages in and out. (corroboration)" },
      { name: "Front-office record & database upkeep", tier: "secondary", sourceTag: "O*NET", what: "Keep contact records and logs current. (corroboration)" },
      { name: "Info & customer-service communication", tier: "secondary", sourceTag: "O*NET", what: "Answer \"who, where, what\" instantly and politely. (corroboration — O*NET essential-skills layer)" },
    ],
  },
];

export function getCareer(id: string | null): Career | null {
  return CAREERS.find((c) => c.id === id) ?? null;
}

/** College browse-by-track list. */
export function listTrack(track: string): Career[] {
  return CAREERS.filter((c) => c.track === track);
}

export const CATALOG_TOTAL = CAREERS.length;
/** Demo-slice suggestion order — interop ids frozen (resume engine synonyms.ts). */
export const DEMO_SUGGESTION_ORDER = ["swd", "da", "its"];

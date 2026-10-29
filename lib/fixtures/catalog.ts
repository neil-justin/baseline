import type { Career, CareerTrack } from "@/lib/types";

/**
 * College-scope career catalog — 36 entry-level PH roles, transcribed verbatim
 * from `.scratch/career-path-readiness-research/catalog-roster-dole-ble.md`
 * (the canon roster; RULINGS section at the bottom is authoritative).
 *
 * Rules:
 *  - `skills` rows are VERBATIM from the research doc's per-role skill tables:
 *    name, tier (core/secondary), source tag ([PSF]/[TESDA]/[O*NET]/[ESCO]/
 *    [NACE]), and the "what it means" line. Never invented.
 *    Rows whose source bundles several PSF enabling skills keep the bundle as
 *    one row (as the artifact prints it).
 *  - The four extension roles (E1 Data Analyst, E2 Executive Secretary,
 *    E3 Records Clerk, E4 SOC Analyst) carry demandBlock.status
 *    "institutional-judgment" = "not DOLE-BLE-justified — institutional
 *    judgment" (user ruling R4, 2026-10-29). NEVER render them as demand-named.
 *  - E1/E2/E3 skill maps are PARTIAL pending source extraction flagged in the
 *    roster doc (verify list §3/§9-3, §10); E2/E3 carry no rows yet rather
 *    than invented ones.
 *  - 5.4 Administrative Officer was DROPPED (entry-level ruling R3: 2-year
 *    career target, not a direct-entry offer).
 *  - Demand citations median the DOLE-BLE JobsFit LMI Report 2013–2020 lists
 *    (in-demand / hard-to-fill entry numbers) — not the unread NJLMF 2025–2026.
 *  - `psocCode` = PSOC 2012 unit group (as updated 2022) — the catalog's
 *    registered classifier; "PSOC 2025" was verified wanting (ruling R2).
 *  - Demo ids `swd` / `da` / `its` are frozen interop keys (resume engine
 *    synonyms.ts + DEMO_SUGGESTION_ORDER); they map to roster rows 2.1, E1, 2.4.
 */

export const TRACKS: CareerTrack[] = ["it", "business", "accounting", "office"];

export const TRACK_LABELS: Record<CareerTrack, string> = {
  it: "Computer & IT",
  business: "Business & Management",
  accounting: "Accounting & Finance",
  office: "Office & Administration",
};

export const CAREERS: Career[] = [
  // == ─── Track 1 · Computer & IT (11: roster 2.1–2.9 + E1 + E4) ─────────────
  {
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
      { name: "Team Enablement", tier: "secondary", sourceTag: "PSF", what: "Agile ceremonies; cross-department relationships." },
      { name: "Collaboration · Communication · Digital Fluency · Learning Agility (Enabling)", tier: "secondary", sourceTag: "PSF", what: "People-facing layer of the BA job." },
    ],
  },
  {
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
      { name: "Network Administration and Maintenance", tier: "core", sourceTag: "PSF", what: "Keep connectivity and shared services stable." },
      { name: "Infrastructure Support", tier: "core", sourceTag: "PSF", what: "Execute maintenance windows and support tickets." },
      { name: "Security Administration", tier: "secondary", sourceTag: "PSF", what: "Maintain access controls, policies on the systems they own." },
      { name: "IT Asset Management", tier: "secondary", sourceTag: "PSF", what: "Handed hardware/software catalogs and license hygiene." },
      { name: "System Integration", tier: "secondary", sourceTag: "PSF", what: "Connect new tools to existing environments safely." },
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
      { name: "Data Engineering", tier: "secondary", sourceTag: "PSF", what: "Handle data flows feeding the databases." },
      { name: "Data Migration", tier: "secondary", sourceTag: "PSF", what: "Move schemas/data across environments safely." },
      { name: "Database security controls", tier: "core", sourceTag: "PSF", what: "Privileges, permissions, integrity controls." },
      { name: "Infrastructure Support", tier: "secondary", sourceTag: "PSF", what: "Understand where the database lives." },
      { name: "Problem Management", tier: "secondary", sourceTag: "PSF", what: "Diagnose and close recurring DB incidents." },
      { name: "Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)", tier: "secondary", sourceTag: "PSF", what: "Team/ops behavior." },
    ],
  },
  {
    id: "cybersec", // roster 2.7
    name: "Cybersecurity Operations (entry)",
    psocCode: "2523",
    psocTitle: "Computer network professionals",
    track: "it",
    degreeMap: ["BSCS", "BSIT", "BSIS"],
    entryRoute: "Security operations center (SOC) Tier-1 analyst in a telco/bank/BPM SOC, usually via an IT-support-to-SOC internal move or a fresh-grad cohort with an industry security certificate in hand (CMO 25 s. 2015).",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #146 (IT Security Engineer)",
      note: "PSOC mapping judgment, flagged in the roster (no dedicated cyber analyst unit in PSOC 2012): 2523/2519-family anchor, labeled per ruling R2.",
    },
    roleSummary: "Reads alerts and correlates events in a security queue, escalating true positives along defined playbooks.",
    skills: [
      { name: "Threat analysis / monitoring", tier: "core", sourceTag: "PSF", what: "Read alerts, correlate events, escalate true positives." },
      { name: "Cyber and Data Breach Incident Management", tier: "secondary", sourceTag: "PSF", what: "Follow breach-response playbooks." },
      { name: "Network administration & maintenance", tier: "secondary", sourceTag: "PSF", what: "Understand the networks being defended." },
      { name: "Vulnerability assessment support (VAPT analyst track)", tier: "secondary", sourceTag: "PSF", what: "Run scans, triage findings under supervision." },
      { name: "Collaboration · Communication · Problem Solving · Digital Fluency (Enabling)", tier: "secondary", sourceTag: "PSF", what: "War-room behavior." },
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
      note: "Also #272 Web Programmer. Skill rows are a declared [O*NET] gap-filler per ADR-0001 — the PSF-SDS has no dedicated entry web-developer map.",
    },
    roleSummary: "Builds and maintains websites — responsive front-ends, CMS builds, deploys — usually as first-employee or agency junior.",
    skills: [
      { name: "Client-side coding (HTML/CSS/JS)", tier: "core", sourceTag: "O*NET", what: "Build and maintain responsive web UIs." },
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
      note: "Also Hard-to-Fill #1–#3 (2D Digital Animator / Animation Artist / Animation Checker — all asterisked 'not completely defined in the PSOC'). Feeds Business-track marketing work.",
    },
    roleSummary: "Produces brand, print, packaging, and animation assets to brief, revising with clients inside deadline.",
    skills: [
      { name: "Develop designs for (logo/typograph/package/display)", tier: "core", sourceTag: "TESDA", what: "Produce brand/print/packaging assets to brief." },
      { name: "Use specialized graphic/animation tools (Adobe suite, Blender etc.)", tier: "core", sourceTag: "TESDA", what: "Tool proficiency." },
      { name: "Follow creative brief + brand guideline development", tier: "core", sourceTag: "PSF", what: "Creative constraints discipline." },
      { name: "Client communication & revision handling", tier: "secondary", sourceTag: "NACE", what: "Iterate with clients within deadline." },
    ],
  },
  {
    id: "da", // extension E1 (demo interop id)
    name: "Data Analyst (junior)",
    psocCode: "3314",
    psocTitle: "Statistical, mathematical and related associate professionals",
    track: "it",
    degreeMap: ["BS Statistics", "BSMA", "BSCS", "BSIS"],
    entryRoute: "Junior analyst on a reporting/BI desk or an analytics BPM account; dashboard and survey-report production under a senior analyst.",
    demandBlock: {
      status: "institutional-judgment",
      source: "not DOLE-BLE-justified — institutional judgment",
      note: "E1 extension admitted per ruling R4 (2026-10-29). Un-named on the 2013–2020 lists; likely in NJLMF 2025–2026 (unreachable); PSF-AAI is the government artifact for the family. Skill map PARTIAL — the roster doc extracted only the headline rows of the PSF-AAI 'Associate Data Analyst' map (Data Analytics L2, Data Visualization and Storytelling L3, Data Engineering L2, ETL key tasks, ESC Basic); full FSC extraction pending before final citation.",
    },
    roleSummary: "Turns data into visual answers people can act on — analysis, visualization, storytelling under a senior analyst.",
    skills: [
      { name: "Data Analytics", tier: "core", sourceTag: "PSF", what: "Analyze datasets against the business question (PSF-AAI level L2)." },
      { name: "Data Visualization and Storytelling", tier: "core", sourceTag: "PSF", what: "Turn finished analysis into charts and a story people can act on (PSF-AAI level L3)." },
      { name: "Data Engineering", tier: "secondary", sourceTag: "PSF", what: "Handle the data flows feeding the analysis (PSF-AAI level L2)." },
      { name: "ETL (extract-transform-load workflows)", tier: "core", sourceTag: "PSF", what: "Key tasks: extract, transform, load data safely between systems." },
      { name: "Enabling Skills & Competencies (ESC, Basic)", tier: "secondary", sourceTag: "PSF", what: "The PSF-AAI cross-cutting enabling layer at associate level." },
    ],
  },
  {
    id: "soc", // extension E4
    name: "SOC Analyst",
    psocCode: "2523",
    psocTitle: "Computer network professionals",
    track: "it",
    degreeMap: ["BSCS", "BSIT", "BSIS"],
    entryRoute: "SOC Tier-1 analyst via fresh-grad cohort with a security certificate add-on; large employers typically ask for a certificate exam held in hand.",
    demandBlock: {
      status: "institutional-judgment",
      source: "not DOLE-BLE-justified — institutional judgment",
      note: "E4 extension admitted per ruling R4 (2026-10-29); demand-named cousin is 2.7 Cybersecurity Operations (#146 IT Security Engineer). Per-instance PSF-SDS FSC pending extraction (roster verify list §9-3) — rows below carry the 2.7 extraction as the family's entry rung.",
    },
    roleSummary: "Watches the security queue inside a 24/7 SOC — alerts triaged, events correlated, breached-response playbooks followed.",
    skills: [
      { name: "Threat analysis / monitoring", tier: "core", sourceTag: "PSF", what: "Read alerts, correlate events, escalate true positives." },
      { name: "Cyber and Data Breach Incident Management", tier: "secondary", sourceTag: "PSF", what: "Follow breach-response playbooks." },
      { name: "Network administration & maintenance", tier: "secondary", sourceTag: "PSF", what: "Understand the networks being defended." },
      { name: "Vulnerability assessment support (VAPT analyst track)", tier: "secondary", sourceTag: "PSF", what: "Run scans, triage findings under supervision." },
      { name: "Collaboration · Communication · Problem Solving · Digital Fluency (Enabling)", tier: "secondary", sourceTag: "PSF", what: "War-room behavior." },
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
      note: "Also Hard-to-Fill #7 (Wholesale/Retail) 'Human Resource Specialist' — a deep HR ladder feeds entry openings.",
    },
    roleSummary: "Runs the people-operations floor: sourcing channels, initial screening, onboarding logistics, records.",
    skills: [
      { name: "Recruitment channel management", tier: "core", sourceTag: "PSF", what: "Run wide-net and targeted sourcing channels; track conversion rates per channel." },
      { name: "Selection management", tier: "core", sourceTag: "PSF", what: "Conduct initial screening; administer assessments; keep applicant banks." },
      { name: "Onboarding", tier: "core", sourceTag: "PSF", what: "Coordinate paperwork, orientation, day-1 logistics for new hires." },
      { name: "Job analysis and evaluation", tier: "secondary", sourceTag: "PSF", what: "Gather accurate job descriptions from business units." },
      { name: "Employee/ Data Collection & Preparation ; Data Management", tier: "core", sourceTag: "PSF", what: "Maintain candidate and employee records." },
      { name: "Voluntary/Involuntary Exit Management", tier: "secondary", sourceTag: "PSF", what: "Process separations, records, clearances." },
      { name: "Human Resources Analytics and Insights", tier: "secondary", sourceTag: "PSF", what: "Hiring funnel metrics per channel." },
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
      note: "Also named under the IT/BPM in-demand grouping (#32) — demand spans industries.",
    },
    roleSummary: "Coordinates the learning engine — needs capture, program logistics, LMS upkeep — behind corporate L&D.",
    skills: [
      { name: "Learning Needs Analysis", tier: "core", sourceTag: "PSF", what: "Turn manager inputs and surveys into documented learning needs." },
      { name: "Learning and Development Programs Management", tier: "core", sourceTag: "PSF", what: "Schedule, register, track participation in learning programs." },
      { name: "Onboarding", tier: "core", sourceTag: "PSF", what: "Support onboarding/offboarding program execution." },
      { name: "Data Collection and Preparation", tier: "core", sourceTag: "PSF", what: "Collate survey and evaluation data for L/OD measures." },
      { name: "Employee Communication", tier: "secondary", sourceTag: "PSF", what: "Course comms and reminders." },
      { name: "Human Resources Systems Management (LMS administration)", tier: "secondary", sourceTag: "PSF", what: "Maintain the LMS; generate post-learning reports." },
      { name: "Communication · Customer Orientation · Learning Agility · Problem Solving · Self-Management (Enabling, Basic)", tier: "secondary", sourceTag: "PSF", what: "Learner-facing service behavior." },
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
      note: "Also #166 Marketing Sales Officer, #168 Marketing Supervisor, #169 Marketing Telemarketer; hard-to-fill 'Marketing Officer' (Wholesale & Retail #5).",
    },
    roleSummary: "Keeps campaign engines running — digital and social coordination, content assets, market data collation.",
    skills: [
      { name: "Digital Marketing", tier: "core", sourceTag: "PSF", what: "Coordinate paid digital campaigns." },
      { name: "Social Media Marketing", tier: "core", sourceTag: "PSF", what: "Schedule, monitor, respond on platforms." },
      { name: "Content Development and Strategy", tier: "core", sourceTag: "PSF", what: "Coordinate campaign content assets." },
      { name: "Market Intelligence / Market Profiling / Market Trend Analysis", tier: "core", sourceTag: "PSF", what: "Collate market & competitor data." },
      { name: "Communications within Distribution Channels · Marketing Communications Plan Development · Marketing Mix Management · Media Strategy Development", tier: "core", sourceTag: "PSF", what: "Execute the plan across channels." },
      { name: "Data Analysis and Interpretation / Data-mining and Modelling", tier: "secondary", sourceTag: "PSF", what: "Basic keyword/web statistics reporting." },
      { name: "Brand Campaign Management · Collateral/Visual Collateral Production · Events Planning and Management", tier: "secondary", sourceTag: "PSF", what: "Asset production and event support." },
      { name: "Communication · Collaboration · Customer Orientation · Digital Fluency (Enabling, Basic)", tier: "secondary", sourceTag: "PSF", what: "Team execution behavior." },
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
      note: "Also #166 Marketing Sales Officer. Field sales involves travel/outside calls — a role-context point, not a skill penalty.",
    },
    roleSummary: "Prospects, qualifies, and moves deals — keeping the pipeline records clean from first call to delivery paperwork.",
    skills: [
      { name: "Customer Acquisition Management", tier: "core", sourceTag: "PSF", what: "Prospect, qualify, follow up inbound/outbound leads." },
      { name: "Customer Relationship Management / CRM Operations", tier: "core", sourceTag: "PSF", what: "Keep the pipeline records clean." },
      { name: "Order Fulfillment Administration", tier: "core", sourceTag: "PSF", what: "Paperwork that turns a won deal into delivery." },
      { name: "Product Advisory / Product Demonstration", tier: "core", sourceTag: "PSF", what: "Explain the offer; run simple demos." },
      { name: "Customer Behavior Analysis", tier: "secondary", sourceTag: "PSF", what: "Read the buyer's signals." },
      { name: "Communication · Collaboration · Customer Orientation · Global Perspective · Problem Solving (Enabling)", tier: "secondary", sourceTag: "PSF", what: "Client-facing behaviors." },
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
      note: "Also #52 Call Center Agent, #82 Customer Care Representative, #83 Customer Service Assistant — the CSR family is heavily represented on the lists.",
    },
    roleSummary: "Handles customer contacts end to end within SLA — English transactions, empathy, CRM logging, data privacy discipline.",
    skills: [
      { name: "Counter service delivery processes", tier: "core", sourceTag: "PSF", what: "End-to-end call/chat handling within SLA." },
      { name: "Communicate effectively in English for customer service", tier: "core", sourceTag: "TESDA", what: "English-language customer transactions." },
      { name: "Customer Handling and Care", tier: "core", sourceTag: "PSF", what: "Customer empathy + resolution behavior." },
      { name: "Customer Relationship Management", tier: "core", sourceTag: "PSF", what: "Record/track follow-ups in CRM systems." },
      { name: "Compliance with Legal Regulations / Data Privacy (RA 10173 invoked in doc)", tier: "core", sourceTag: "PSF", what: "Handle personal data inside the call per law." },
      { name: "Digital Fluency (systems + tools)", tier: "secondary", sourceTag: "PSF", what: "CRM, telephony, case tools fluency." },
      { name: "Communication · Customer Orientation · Problem Solving · Global Perspective (Enabling, Basic/Intermediate)", tier: "secondary", sourceTag: "PSF", what: "Service behavior." },
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
      note: "Also In-demand #191 (Operations Staff, same functional family). Skill rows are a declared [O*NET] gap-filler — no PH artifact owns this role family.",
    },
    roleSummary: "Maps how work actually flows — gathers, observes, frames options — and writes the findings down.",
    skills: [
      { name: "Process study/gathering & analysis", tier: "core", sourceTag: "O*NET", what: "Map the current workflow." },
      { name: "Interviewing/on-site observation", tier: "core", sourceTag: "O*NET", what: "Talk to doers, not dashboards." },
      { name: "Solution framing (alternative methods of proceeding)", tier: "core", sourceTag: "O*NET", what: "Present options, not verdicts." },
      { name: "Documentation & recommendation write-ups", tier: "core", sourceTag: "O*NET", what: "SOPs and findings memos." },
      { name: "Data hygiene basics (Excel/SQL pulls)", tier: "secondary", sourceTag: "O*NET", what: "Practical analyst tooling." },
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
      note: "Also #48 Buyer/Purchasing Agent (Retail). Skill rows are a declared [O*NET] gap-filler; no TESDA procurement NC verified.",
    },
    roleSummary: "Runs the PO lifecycle — requisitions, bids, price proposals, compliance — keeping sourcing honest and papered.",
    skills: [
      { name: "Purchase order issuance and requisition review", tier: "core", sourceTag: "O*NET", what: "Core PO lifecycle skill." },
      { name: "Bid/quote evaluation", tier: "core", sourceTag: "O*NET", what: "Comparing vendors on total value." },
      { name: "Compliance & policy adherence (procurement rules)", tier: "core", sourceTag: "O*NET", what: "Guardrails in sourcing." },
      { name: "Product specification write-ups", tier: "secondary", sourceTag: "O*NET", what: "Translating business need into spec." },
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
      note: "Same #216 as 2.2 — the platform serves both flavors (software QA / contact-center QA). PSOC mapping judgment flagged in the roster; exact per-instance PSF-CCB FSC pending extraction (roster verify list §9-3).",
    },
    roleSummary: "Scores interactions against the account's quality standards and turns the patterns into coaching.",
    skills: [
      { name: "Quality Standards application", tier: "core", sourceTag: "PSF", what: "Apply scoring rubric consistently." },
      { name: "Service metrics analysis (sentiment analysis, problem identification)", tier: "core", sourceTag: "PSF", what: "Detect quality patterns in interactions." },
      { name: "Calibration/compliance reporting discipline", tier: "core", sourceTag: "PSF", what: "Align scoring with the account's quality standards." },
      { name: "Customer Orientation · Communication · Critical Thinking (Enabling)", tier: "secondary", sourceTag: "NACE", what: "Coaching conversations." },
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
      note: "Plus Hard-to-Fill 'Event Coordinator' (Hotel/Restaurant/Tourism grouping). White-collar-adjacent corporate-events variant. Skill rows are a declared [O*NET] gap-filler — no PSF event doc exists.",
    },
    roleSummary: "Coordinates the events chain — venues, vendors, registration — and tracks the budget without surprises.",
    skills: [
      { name: "Venue/vendor coordination & booking paperwork", tier: "core", sourceTag: "O*NET", what: "The core logistics chain." },
      { name: "Registration/RSVP systems operation", tier: "core", sourceTag: "O*NET", what: "Attendee data handling basics." },
      { name: "Budget tracking for events", tier: "secondary", sourceTag: "O*NET", what: "Basic finance hygiene." },
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
      note: "No PSF sector doc covers accounting (ADR-0001) — skills anchor on the TESDA Bookkeeping NC III TR as written.",
    },
    roleSummary: "Records the business's transactions end to end — journals to ledgers to trial balance to financial reports.",
    skills: [
      { name: "Journalize transactions", tier: "core", sourceTag: "TESDA", what: "Record business transactions in journals." },
      { name: "Post transactions", tier: "core", sourceTag: "TESDA", what: "Transfer journal entries to ledgers (100% accuracy standard in TR)." },
      { name: "Prepare trial balance", tier: "core", sourceTag: "TESDA", what: "Extract and summarize pre/post-closing trial balances." },
      { name: "Prepare financial reports (manual)", tier: "core", sourceTag: "TESDA", what: "FS generation from ledger." },
      { name: "Review internal control system", tier: "secondary", sourceTag: "TESDA", what: "Basic control checks in line with industry practice." },
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
      note: "Third occupation on the entire national list.",
    },
    roleSummary: "Runs the AP/AR core loop — invoice matching, reconciliation, spreadsheet-and-accounting-software accuracy.",
    skills: [
      { name: "Match invoices to POs/receipts (3-way match)", tier: "core", sourceTag: "O*NET", what: "The AP core loop." },
      { name: "Reconcile supplier accounts & statements to ledgers", tier: "core", sourceTag: "PSOC", what: "Month-end readiness." },
      { name: "Operate accounting software & spreadsheets", tier: "core", sourceTag: "O*NET", what: "ERP/data-entry fluency." },
      { name: "Journalize/post transactions (bookkeeping cycle)", tier: "secondary", sourceTag: "TESDA", what: "Needed for close support tasks." },
      { name: "Petty cash / collections recording", tier: "secondary", sourceTag: "PSOC", what: "Cash-handling accounting." },
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
      note: "Skill rows are a declared [O*NET] gap-filler; PH statutory-pay knowledge (13th month, premiums) is a platform layer from BIR/DOLE publications (later pass).",
    },
    roleSummary: "Verifies time and attendance, computes wages with statutory deductions, and balances the payroll register to the bank.",
    skills: [
      { name: "Time/attendance data verification & posting", tier: "core", sourceTag: "O*NET", what: "The source-of-truth loop." },
      { name: "Wages & statutory deductions computation", tier: "core", sourceTag: "O*NET", what: "Gross → net runs including withholding tax, SSS/PhilHealth/Pag-IBIG." },
      { name: "Payroll register balancing & reconciliation", tier: "core", sourceTag: "O*NET", what: "Bank-vs-ledger match." },
      { name: "Employee payroll query handling", tier: "secondary", sourceTag: "O*NET", what: "Employee-facing service." },
      { name: "Records hygiene & confidentiality (RA 10173 context)", tier: "secondary", sourceTag: "NACE", what: "PII discipline." },
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
      note: "Also #5 Accounting/Finance Associate; #4 Accounting Supervisor is the next rung. PSF-GIH per-role map pending extraction (roster verify list) — the entry here is [O*NET]-anchored until confirmed.",
    },
    roleSummary: "Processes the GL engine in a shared service — journal entries, month-end support, ERP transactions with control-checklist discipline.",
    skills: [
      { name: "GL & journal entry processing", tier: "core", sourceTag: "O*NET", what: "Record-to-report basics." },
      { name: "Month-end close support (accruals, reconciliations)", tier: "core", sourceTag: "O*NET", what: "Balance sheet reconciliations." },
      { name: "ERP transactions (general ledger modules)", tier: "core", sourceTag: "O*NET", what: "SAP/Oracle/NetSuite navigation." },
      { name: "SOX/internal-controls checklist discipline", tier: "secondary", sourceTag: "PSOC", what: "Control frameworks awareness." },
      { name: "Team communication · Professionalism (Enabling)", tier: "secondary", sourceTag: "NACE", what: "Shared-services behavior." },
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
      note: "Demand is economy-wide: also named under IT/BPM (#34) and Hotel/Restaurant/Tourism (#52) groupings. Declared [O*NET] gap-filler; CPA/CFA is NOT an entry gate.",
    },
    roleSummary: "Reads financial statements and industry trends into models, write-ups, and a recommendation supportable in review.",
    skills: [
      { name: "Financial statement analysis & modeling", tier: "core", sourceTag: "O*NET", what: "Build the base DCF-driven story." },
      { name: "Industry/company research write-ups", tier: "core", sourceTag: "O*NET", what: "Communicate the recommendation." },
      { name: "Internal rate/ROI/NPV & capitalization advice", tier: "secondary", sourceTag: "O*NET", what: "Capital budgeting fluency." },
      { name: "Data hygiene (Excel robustness)", tier: "secondary", sourceTag: "O*NET", what: "Spreadsheet engineering." },
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
      note: "Hybrid [O*NET Tellers + PSOC 4312] tiering, openly flagged in the roster — no O*NET occupation matches corporate treasury assistant exactly.",
    },
    roleSummary: "Balances cash, reconciles the spreadsheets, and keeps the treasury paperwork moving with zero surprises.",
    skills: [
      { name: "Cash balancing & daily transaction tracking", tier: "core", sourceTag: "O*NET", what: "Daily cash discipline." },
      { name: "Bank reconciliation spreadsheets", tier: "core", sourceTag: "O*NET", what: "Recon bookkeeping." },
      { name: "Treasury documentation (LC/PO/financial instrument paperwork)", tier: "secondary", sourceTag: "PSOC", what: "Documentation-side workflow." },
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
      note: "A PH-native customer-service corporate occupation on the DOLE lists — not a trades role.",
    },
    roleSummary: "Locates and notifies customers of delinquent accounts, arranges repayment, and logs every touch.",
    skills: [
      { name: "Delinquent-account outreach (phone/mail/visit discipline)", tier: "core", sourceTag: "O*NET", what: "The core collection loop." },
      { name: "Repayment scheduling/negotiation", tier: "core", sourceTag: "O*NET", what: "Solving-not-hounding approach." },
      { name: "Account-status documentation & CRM logging", tier: "core", sourceTag: "O*NET", what: "Every touch logged." },
      { name: "Speech-tone handling + objection management", tier: "secondary", sourceTag: "O*NET", what: "Conversational craft." },
      { name: "Data tracking hygiene · Professionalism (Enabling)", tier: "secondary", sourceTag: "NACE", what: "Skip-tracing ethics." },
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
      note: "Hybrid [PSOC 3312 unit text + O*NET Loan Officers] tiering, openly declared — tiering is judgment-based and flagged.",
    },
    roleSummary: "Verifies documents, assesses financial status, and supports credit decisions within authority limits.",
    skills: [
      { name: "Document verification (income/ID/collateral docs)", tier: "core", sourceTag: "PSOC", what: "KYC quality." },
      { name: "Financial-status assessment", tier: "core", sourceTag: "O*NET", what: "Case-file reading." },
      { name: "Loan/credit workflow systems operation", tier: "core", sourceTag: "PSOC", what: "Decision-support within authority." },
      { name: "Customer interaction & explanation", tier: "secondary", sourceTag: "O*NET", what: "Client-facing credit conversations." },
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
      note: "[O*NET]-anchored; branch-service decorum from NACE cross-cutting — no PH framework covers teller skill detail.",
    },
    roleSummary: "Handles the branch's cash and transactions to daily zero variance — verification, signature checks, accurate systems entry.",
    skills: [
      { name: "Cash drawer balancing & transaction logging", tier: "core", sourceTag: "O*NET", what: "Daily zero-variance." },
      { name: "Deposit/withdrawal verification & signature checking", tier: "core", sourceTag: "O*NET", what: "Transaction integrity." },
      { name: "Customer transaction systems (prompt/accurate data entry)", tier: "core", sourceTag: "O*NET", what: "System fluency." },
      { name: "Front-desk service etiquette", tier: "secondary", sourceTag: "NACE", what: "Branch behavior." },
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
      note: "Also named under the IT/BPM grouping (#33). Strongest 'gap-filler honesty' case — hybrid [O*NET 13-2011.00 + PSOC 3313] with no PH competency framework covering audit.",
    },
    roleSummary: "Reconciles accounts, tests the historical record, and keeps the audit trail signed off — the workpaper craft.",
    skills: [
      { name: "Account reconciliation & historical testing", tier: "core", sourceTag: "O*NET", what: "Substantive testing core." },
      { name: "Documentation (audit workpapers) & sign-off discipline", tier: "core", sourceTag: "O*NET", what: "The audit trail." },
      { name: "Compliance frameworks (PFRS, local tax)", tier: "secondary", sourceTag: "O*NET", what: "Regulatory context (PH addendum later)." },
      { name: "Sampling analytics (Excel/IDEA)", tier: "secondary", sourceTag: "O*NET", what: "Audit software literacy." },
      { name: "Professional Skepticism (attitude) · Communication (Enabling)", tier: "secondary", sourceTag: "NACE", what: "Audit-culture craft." },
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
      note: "Rank 8 on the entire national list. PSOC mapping judgment flagged in the roster; the 2013–2020 DOLE list title 'Administrative Associate' sits between the two unit groups.",
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
    id: "clerk", // roster 5.2
    name: "Office Clerk",
    psocCode: "4110",
    psocTitle: "General office clerks",
    track: "office",
    degreeMap: ["BSOA", "open-tier CHED canon"],
    entryRoute: "Office clerk through general-services/records; small-company hiring; document flow (CMO 19 s. 2017).",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #189 (Office Clerks)",
      note: "[O*NET]-anchored; the honesty is narrowing the title to 'general office clerk' — the mental model students need.",
    },
    roleSummary: "Keeps the office flowing — records sorted and filed, calls answered and routed, requests answered from the files.",
    skills: [
      { name: "Records ordering & filing (manual/computer)", tier: "core", sourceTag: "O*NET", what: "Core clerk task." },
      { name: "Mail/phone handling (incl. answering/directing calls)", tier: "core", sourceTag: "O*NET", what: "Office switchboard basics." },
      { name: "Document retrieval/reporting from records", tier: "core", sourceTag: "O*NET", what: "Information service task." },
      { name: "Data entry for business transactions", tier: "secondary", sourceTag: "O*NET", what: "Beneath the specialist data-entry role (5.3)." },
      { name: "Communication · Professionalism (Enabling)", tier: "secondary", sourceTag: "NACE", what: "Workday reliability." },
    ],
  },
  {
    id: "encode", // roster 5.3
    name: "Data Encoder",
    psocCode: "4132",
    psocTitle: "Data entry clerks",
    track: "office",
    degreeMap: ["open-tier canon", "BSOA", "BSIS"],
    entryRoute: "Data processing teams in BPM/back-office services; accuracy/throughput-based timing.",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #95 (Encoder, asterisked)",
      note: "Asterisked = not fully defined in PSOC 2012, so the employer title is the anchor. Declared [O*NET] gap-filler.",
    },
    roleSummary: "Enters data the right field the first time — accuracy loops, pre-entry sorting, throughput under deadline.",
    skills: [
      { name: "Source-document reading & field mapping", tier: "core", sourceTag: "O*NET", what: "Correct-field discipline." },
      { name: "Accuracy/error detection & correction", tier: "core", sourceTag: "O*NET", what: "QA personal loop." },
      { name: "Compilation, sorting, verification before entry", tier: "core", sourceTag: "O*NET", what: "Pre-entry quality." },
      { name: "Typing speed & tool fluency", tier: "secondary", sourceTag: "O*NET", what: "Throughput management." },
      { name: "Confidentiality (Etiquette/Professionalism)", tier: "secondary", sourceTag: "NACE", what: "PII/financial data respect." },
    ],
  },
  {
    id: "desk", // roster 5.5
    name: "Counter / Enquiry Clerk",
    psocCode: "4225",
    psocTitle: "Enquiry clerks — counter clerk/desk clerk/information clerk",
    track: "office",
    degreeMap: ["open-tier", "BSOA", "BSBA-HRM", "TESDA Contact Center Services NC II (practical credential)"],
    entryRoute: "Front-desk/reception in corporates, schools, hospitals, BPO admin areas; cross-gate to the Customer Service Representative family.",
    demandBlock: {
      status: "in-demand",
      source: "JobsFit LMI 2013–2020 · In-demand #122 (Frontline Desk Service, asterisked)",
      note: "Asterisked; the title is named in the Hotel/Restaurant/Tourism grouping — the catalog keeps it for corporate front-desk/reception adjacency and refuses hotel-specific framing. 2 of 3 skill rows come from corroborated PSF-CCB behavior language, honestly labeled.",
    },
    roleSummary: "Receives walk-ins and calls, logs and follows up inquiries, and carries the corporate front-desk standard.",
    skills: [
      { name: "Walk-in visitor & phone reception (translate-request-escalate)", tier: "core", sourceTag: "PSF", what: "Multi-channel front-desk flow." },
      { name: "Log & follow-up inquiries", tier: "core", sourceTag: "PSF", what: "Visitor/inquiry logging." },
      { name: "Corporate conduct/appearance standards", tier: "secondary", sourceTag: "NACE", what: "Office-culture fit." },
    ],
  },
  {
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
      note: "E2 extension admitted per ruling R4 (2026-10-29). Secretarial titles are absent from the 2013–2020 lists; PSA OWS organizes on the family. SKILL TABLE PENDING — O*NET 43-6011 Executive Secretaries was not fetched in the research session; no rows authored rather than invented (roster verify list §10).",
    },
    roleSummary: "Runs the executive's office — correspondence, schedules, records, coordination — at the executive-support standard.",
    skills: [],
  },
  {
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
      note: "E3 extension admitted per ruling R4 (2026-10-29). Not named in DOLE demand lists; natural BSOA feeder; TESDA has no dedicated NC. SKILL TABLE PENDING — O*NET corroboration thin and PSOC 4415 task quotes were not extracted; no rows authored rather than invented (roster verify list §10).",
    },
    roleSummary: "Maintains the filing backbone — classification, retrieval, copying — so every office can find its records.",
    skills: [],
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

import type { RowSpecMap } from "@/lib/fixtures/rowspec/types";

/**
 * Computer & IT track — per-row deep data from the BLESSED role specs
 * (`.scratch/career-path-readiness-research/role-specs/*.md`, per-track user
 * blessing 2026-10-30). Keyed `${roleId}::${skillName}` — every skill name
 * must exist on that role's catalog map (asserted in verify-fixtures).
 *
 * Rules carried here (per the conversion brief):
 *  - `descriptor` = the source text where the source prints one (verbatim);
 *    paraphrased descriptors carry their flag in `flags`.
 *  - `anchors` = attributed verbatim task text (never invented).
 *  - `specRef` = the spec file + row id each row traces to (panel questions
 *    resolve to the spec through this provenance).
 *  - Model C (ADR 0005): O*NET content awaits the version pin at enrich
 *    time — no unverified O*NET quotes are added anywhere.
 *  - Canon roles (swd/qa/its/da) keep their catalog row names byte-identical
 *    (the demo-beat math keys bars/goals on these names); the deep data
 *    rides alongside without moving any row.
 */

export const ROW_SPECS_IT: RowSpecMap = {
  // ── swd · Associate Software Developer (roster 2.1; spec swd.md) ──────────
  "swd::Applications Development": {
    descriptor:
      "FSC level 3 (role map, printed pp.104–107): \"Develop applications based on the design specifications; encompassing coding, testing, debugging, documenting and reviewing and/or refining it across the application development stages in accordance with defined standards for development and security.\" L3 cell (FSC Document p.203, SDS-DIM1-3002-1.1): \"Develop basic applications with secure features, run routine application tests, and conduct debugging to resolve errors.\"",
    anchors: [
      "Role overview (printed p.104): \"applies subject matter knowledge in applications development, possessing skills in programming, design, development, testing, debugging, and implementing software applications or specialized utility programs.\"",
      // the spec's two CWF sub-rows fold into this catalog row (canon-trio
      // projection: the swd catalog keeps its 8-byte-identical row names) —
      // their printed key-task anchors ride here, attributed:
      "CWF sub-row: Perform software testing (key tasks, printed p.104): \"Write expressive and well-analyzed automated unit and integration tests\" · \"Assist testers in the creation of test environments, and end-to-end test automation if necessary\" · \"Perform manual tests as needed\" · \"Work with testers in the design and implementation of load tests\" · \"Prepare or assist in the preparation of test reports\"",
      "CWF sub-row: Engage in Continuous Learning and Professional Development (key tasks, printed p.104): \"Pursue ongoing education in software engineering principles, focusing on maintainability, security, and performance\" · \"Stay informed about the latest trends in software engineering, particularly in areas of design patterns, code maintainability, performance, secure coding, and platform engineering\" ×inter alia (4 bullets printed)",
    ],
    specRef: "role-specs/swd.md — Applications Development row (+ the two CWF sub-rows fold here per the canon-trio projection)",
    flags: ["column-order flag on the L3 cell (qa.md §6/3 — Applications Development's FSC level cell not resolved this pass; quoted as-printed)"],
  },
  "swd::Applications Support and Enhancement": {
    descriptor:
      "FSC level 1-2: \"Provide ongoing technical support and improvements to users of applications. This includes technical guidance and assistance related to the installation and maintenance of applications, fixing and resolution of application problems or disruptions, and response to change requests that will enhance the operations and usage of an application.\"",
    anchors: ["Role overview: \"They support regular updates and recommend improvements to existing applications.\""],
    specRef: "role-specs/swd.md — Applications Support and Enhancement row",
  },
  "swd::Agile Software Development": {
    descriptor:
      "FSC level 3: \"Plan and implement Agile methodology and the use of adaptive and iterative methods and techniques in the software development lifecycle to account for continuous evolution, development, and deployment to enable seamless delivery of the application to the end user\" · L3 cell (FSC Document p.201, SDS-DIM1-3001-1.1): \"Adopt Agile software development methodologies to develop, improve and deploy software applications.\"",
    anchors: [],
    specRef: "role-specs/swd.md — Agile Software Development row (descriptor-level row; no CWF task anchor printed)",
    flags: ["anchorless by spec — descriptor-level row (the spec's anchors column prints —: no CWF task anchor printed on the map)", "column-order flag on the L3 cell (SDS-DIM1-3001-1.1) — SWD-V1 records the cell cross-checked and confirmed exact (closed 2026-10-29); flag retired as-printed in the spec table"],
  },
  "swd::Data Design / SQL + data modeling": {
    descriptor:
      "FSC level 3 (FSC name \"Data Design\"): \"Specify and create a data structure or database model, including the setting of various parameters or fields that can be modified to suit different structured or unstructured data requirements, the design of data flow, as well as the development of mechanisms for maintenance, storage and retrieval of data based on the business requirements.\" L3 cell (SDS-DAR1-3001-1.1, printed pp.282–283 — facsimile-validated, SWD-V1 closed 2026-10-29): \"Identify data requirements and support the design of database models, incorporating parameters, fields and mechanisms for the maintenance, storage and retrieval of data\".",
    anchors: [
      "PSF-SDS CWF \"Execute basic relational database operations\": \"Writes efficient SQL queries, using appropriate JOINs to fetch data across multiple tables\"",
      "PSF-SDS CWF \"Execute basic relational database operations\": \"Translates business requirements into a normalized relational database schema, using Data Definition Language (DDL), choosing the appropriate SQL data types for each column\"",
      "Role overview: \"conversant in data modeling and SQL.\"",
    ],
    specRef: "role-specs/swd.md — Data Design / SQL + data modeling row (SWD-V1 closed)",
  },
  "swd::Business Needs Analysis": {
    descriptor:
      "FSC level 2 (role-map layer — the rung's attained level; a different printed layer from the cells): \"Identify and scope business requirements and priorities through rigorous information gathering and analysis as well as clarification of the solutions, initiatives and programs to enable effective delivery…\" · L2 cell (SDS-BPM1-2006-1.1): \"Document business requirements and identify basic needs as well as potential solutions\" · L3 cell (SDS-BPM1-3006-1.1): \"Elicit and analyze business requirements from key stakeholders and assess relevant solutions and their potential impact\" — corrected 2026-10-29 per facsimile read (verify-notes V-A).",
    anchors: [
      "PSF-SDS CWF continuation (printed p.105): \"Validate user requirements and design specifications\" · \"Translate user requirements into technical specifications\" · \"Formulate software requirement specifications\" · \"Recommend approaches that balance security, stability, and performance needs\"",
    ],
    specRef: "role-specs/swd.md — Business Needs Analysis row (text-layer blend removed 2026-10-29)",
    flags: ["two-layer correction applied (role-map level ≠ proficiency cell; verify-notes V-A)"],
  },
  "swd::Secure-coding practices": {
    descriptor:
      "Printed CWF name \"Execute secure software development practices\" — CWF tier (not a named FSC; roster's label kept).",
    anchors: [
      "Key tasks (printed p.104): \"Follow recommended coding standards and secure coding principles to avoid security vulnerabilities\" · \"Adhere to project standards in the collection of security assessment metrics\" · \"Perform code reviews to identify basic security designs\" · \"Use automated tools for the detection and remediation of basic security designs\" · \"Remediate security vulnerabilities with the supervision of more senior engineers\"",
    ],
    specRef: "role-specs/swd.md — Secure-coding practices row (CWF tier)",
  },
  "swd::Linux + web deployment basics": {
    descriptor:
      "Printed CWF name \"Perform basic Linux and web operations\" — CWF tier; decomposes the FSC Cloud Computing (level 4 on the role map — kept secondary per the ladder: associate runs basics under supervision).",
    anchors: [
      "Key tasks (printed p.104): \"Able to utilize the Linux command line for fundamental operations… navigating directories, listing contents, managing files and directories (creation, renaming, and moving), software installation and management, configuring PATH variables, monitoring resource usage, launching and terminating applications, editing text files using command-line editors like Vim, logging into remote Linux instances, and transferring files between remote instances\" · \"Able to deploy and administer a web application on a Linux or cloud environment\"",
    ],
    specRef: "role-specs/swd.md — Linux + web deployment basics row (CWF tier)",
  },
  "swd::Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Self Management (Enabling Skills, Basic/Intermediate)": {
    descriptor:
      "PSF-SDS ESC exactly as printed for this role map: Collaboration Intermediate · Communication Basic · Digital Fluency Basic · Learning Agility Intermediate · Problem Solving Intermediate · Self Management Intermediate.",
    anchors: [
      "Role overview behavior sentence: \"The Associate Software Engineer is a keen learner, and able to apply structured, analytical thinking to develop applications. They are a strong team player, who communicates their ideas and gets along with others easily.\"",
    ],
    specRef: "role-specs/swd.md — enabling bundle row",
  },

  // ── qa · Software QA Analyst (roster 2.2; spec qa.md) ─────────────────────
  "qa::Test Planning": {
    descriptor:
      "FSC levels 2–3 (card, printed pp.83–84): \"Develop a test strategy and systematic test procedures to verify and ensure that a product, system or technical solution meets its design specifications as well as the performance, load and volume levels set out…\" · L2 cell (SDS-DIM1-2020-1.1): \"Identify and document the basic tools, testware, resources and processes to carry out required tests\" · L3 cell (SDS-DIM1-3020-1.1): \"Determine requirements and develop a phase test plan, identifying optimal schedules and means for executing test scripts\" — column mapping coordinate-resolved 2026-10-29.",
    anchors: [
      "PSF-SDS key tasks 2, 4: \"Validate test data requirements following quality processes\" · \"Create, execute, and document test plans and test cases (User Acceptance Testing or UAT, Integration, End-to-End, Regression, Beta), ensuring functional coverage and application performance\"",
      "O*NET 15-1253.00 corroboration: \"Design test plans, scenarios, scripts, or procedures.\" · \"Plan test schedules or strategies in accordance with project scope or delivery dates.\"",
    ],
    specRef: "role-specs/qa.md §3 Row 1",
  },
  "qa::Software Testing": {
    descriptor:
      "FSC levels 2–3: \"Assess and test the overall effectiveness and performance of an application, involving the setting up of suitable testing conditions, definition of test cases and/or technical criteria.\" · L2 cell (SDS-DIM1-2018-1.1): \"Draft simple test scenarios, and perform software testing procedures, highlighting bugs or glitches affecting performance\" · L3 cell (SDS-DIM1-3018-1.1): \"Design test scenarios and implement new or complex tests, investigating issues or gaps between actual and expected results\" — column mapping coordinate-resolved 2026-10-29.",
    anchors: [
      "PSF-SDS key tasks 3, 4: \"Rigorously follow documented test protocols and methods\" · \"Create, execute, and document test plans and test cases (User Acceptance Testing or UAT, Integration, End-to-End, Regression, Beta), ensuring functional coverage and application performance\"",
      "O*NET 15-1253.00 corroboration: \"Develop and execute software tests to identify software problems and their causes.\"",
    ],
    specRef: "role-specs/qa.md §3 Row 2",
  },
  "qa::Defect management": {
    descriptor:
      "PSF-SDS CWF key-task tier — the CWF name is printed on the role map; it is not a named card FSC (roster label kept, never relabeled).",
    anchors: [
      "PSF-SDS key tasks 5–7 (Test Execution): \"Review software and production issues as they occur\" · \"Accurately log all test run results, environment or software behaviors\" · \"Efficiently use defect tracking systems\"",
      "PSF-SDS key tasks 9–11 (Defect Management): \"Ask clarifying questions to create complete test documentation\" · \"Perform holistic analysis of the impacts and possible root causes\" · \"Provide clear structured descriptions when reporting defects found\"",
      "O*NET 15-1253.00 corroboration: \"Document software defects, using a bug tracking system, and report defects to software developers.\"",
    ],
    specRef: "role-specs/qa.md §3 Row 3",
  },
  "qa::Quality Assurance / Quality Standards": {
    descriptor:
      "Two printed card FSCs carried as the catalog's one combined row. Quality Assurance (card L4, code SDS-DIM1-4013-1.1): \"Apply quality standards to review performance through the planning and conduct of quality assurance audits…\" — L4 cell: \"Implement quality performance guidelines and review the effectiveness of Quality Assurance (QA) processes\". Quality Standards (card L4, code SDS-RMG1-4008-1.1): \"Develop, review and communicate clear, quality expectations and standards within an organization that are aligned to the company's values and business objectives…\" — L4 cell: \"Assess existing quality standards and align processes and activities with IT product and service quality expectations\".",
    anchors: [
      "PSF-SDS key tasks 2, 10 (quality gates): \"Validate test data requirements following quality processes\" · \"Perform holistic analysis of the impacts and possible root causes\"",
      "O*NET 15-1253.00 corroboration: \"Develop or specify standards, methods, or procedures to determine product quality or release readiness.\" · \"Document test procedures to ensure replicability and compliance with standards.\"",
    ],
    specRef: "role-specs/qa.md §3 Rows 4–5 (Quality Assurance · Quality Standards, combined in the catalog row)",
  },
  "qa::Applications Support and Enhancement": {
    descriptor:
      "Card L1–2: \"Provide ongoing technical support and improvements to users of applications… fixing and resolution of application problems or disruptions, and response to change requests…\" · L1 cell: \"Perform routine installation and maintenance of applications, and collate performance statistics and user feedback on an application\" · L2 cell: \"Install, maintain and troubleshoot commonly-encountered problems in applications and respond to simple change requests\".",
    anchors: ["PSF-SDS key tasks 1, 5 (bridging-anchor flag applied)"],
    specRef: "role-specs/qa.md §3 secondary row 6",
  },
  "qa::Business Needs Analysis": {
    descriptor:
      "Card L2: \"Identify and scope business requirements and priorities through rigorous information gathering and analysis…\" · L2 cell (SDS-BPM1-2006-1.1): \"Document business requirements and identify basic needs as well as potential solutions\" — cross-framework note: at the proficiency-cell layer the same cells print identically across PSF-SDS and PSF-AAI; the differing level print lives in the role-map layer (pixel-level correction adopted 2026-10-29, verify-notes V-A).",
    anchors: [
      "PSF-SDS key task 8: \"Be able to perform technical documentation reading\"",
      "O*NET 15-1253.00 corroboration: \"Review software documentation to ensure technical accuracy, compliance, or completeness, or to mitigate risks.\"",
    ],
    specRef: "role-specs/qa.md §3 secondary row 7",
  },
  "qa::Customer Orientation · Digital Fluency · Learning Agility · Sense Making · Problem Solving (Enabling)": {
    descriptor:
      "PSF-SDS ESC aggregate as printed for the Associate Software Tester map (11 entries with printed stages — Adaptability I · Building Inclusivity I · Collaboration I · Communication I · Creative Thinking I · Customer Orientation I · Digital Fluency Advanced · Learning Agility I · Problem Solving Advanced · Sense Making I · Transdisciplinary Thinking I). ESC presentation ruling 2026-10-29: fixtures keep the bundled supporting-skill rows; the full printed list stays in the spec file as the citation record.",
    anchors: [
      "Role overview fragments: \"The Associate Software Testers interact with clients to understand software or product requirements to assist in test data preparation.\" · \"They are a strong team player, who communicates their ideas and gets along with others easily.\"",
    ],
    specRef: "role-specs/qa.md Row 27",
    flags: ["ESC-bundle ruling 2026-10-29 (fixture keeps the bundle; full 11-ESC aggregate stays in-spec)"],
  },

  // ── ba · Business Analyst, IT (roster 2.3; spec ba.md) ───────────────────
  "ba::Requirements Analysis": {
    descriptor:
      "PSF-SDS CWF tier — role overview (printed p.88): \"This role involves participation in customer discovery, requirements documentation, and business analysis activities while cultivating foundational knowledge and skills essential for becoming a proficient business analyst.\"",
    anchors: [
      "PSF-SDS key tasks (printed p.88): \"Conduct stakeholder interviews, workshops, and surveys to gather business requirements\" · \"Perform gap analysis between current and desired processes/systems\" · \"Document business rules, policies, and regulatory compliance needs\" · \"Analyze data from various sources (e.g., reports, logs, databases) to identify pain points and improvement areas\" · \"Develop process flow diagrams, use case diagrams and other visual models\"",
    ],
    specRef: "role-specs/ba.md — Requirements Analysis row",
  },
  "ba::Requirements Specification": {
    descriptor: "PSF-SDS CWF tier.",
    anchors: [
      "PSF-SDS key tasks: \"Translate business requirements into functional specifications and user stories\" · \"Develop low-fidelity prototypes and wireframes for proposed solutions\" · \"Participate in design sessions and provide input on user experience considerations\" · \"Assist in mapping requirements to technical components and architectural designs\" · \"Validate proposed solutions through stakeholder walkthroughs and reviews\"",
    ],
    specRef: "role-specs/ba.md — Requirements Specification row",
  },
  "ba::Solution Support (UAT & hand-over)": {
    descriptor: "PSF-SDS CWF tier — printed CWF name \"Solution Support\".",
    anchors: [
      "PSF-SDS key tasks: \"Contribute to project planning, estimation, and resource allocation activities\" · \"Coordinate and facilitate user acceptance testing (UAT) activities\" · \"Support solution deployment, training, and change management efforts\" · \"Gather and document feedback from end-users for continuous improvement\"",
    ],
    specRef: "role-specs/ba.md — Solution Support (UAT & hand-over) row",
  },
  "ba::Process modeling (flow diagrams, use cases)": {
    descriptor: "Sub-set of the CWF Requirements Analysis key tasks (roster's label kept; not a separate FSC).",
    anchors: [
      "Same CWF bullets: \"Develop process flow diagrams, use case diagrams and other visual models\" · \"Analyze data from various sources… to identify pain points and improvement areas\"",
    ],
    specRef: "role-specs/ba.md — Process modeling row",
  },
  "ba::Business Needs Analysis": {
    descriptor:
      "FSC level 2-3 on this role map (printed p.234 descriptor; cells at printed pp.234–235) — L2 cell (SDS-BPM1-2006-1.1): \"Document business requirements and identify basic needs as well as potential solutions\" · L3 cell (SDS-BPM1-3006-1.1): \"Elicit and analyze business requirements from key stakeholders and assess relevant solutions and their potential impact\" — corrected 2026-10-29 per facsimile read (verify-notes V-A).",
    anchors: ["Overview: \"They conduct research and gather data to support the development of business cases, specifications, and solution designs aligned with organizational goals.\""],
    specRef: "role-specs/ba.md — Business Needs Analysis row (BA-V1 resolved)",
  },
  "ba::Team Enablement": {
    descriptor: "PSF-SDS CWF tier — the artifact prints it as one of the role's own work functions (BA-V2).",
    anchors: [
      "PSF-SDS key tasks: \"Collaborate with subject matter experts to validate requirements and models\" · \"Participate in agile ceremonies (e.g., sprint planning, daily stand-ups, retrospectives)\" · \"Cultivate strong working relationships across departments\"",
    ],
    specRef: "role-specs/ba.md — Team Enablement row",
    flags: ["BA-V2 ruled 2026-10-29: Team Enablement FLIPS to core (fixture applies the flip)"],
  },
  "ba::Collaboration · Communication · Digital Fluency · Learning Agility (Enabling)": {
    descriptor:
      "ESC printed on the Associate Business Analyst map: Adaptability I · Building Inclusivity I · Collaboration I · Communication I · Creative Thinking I · Customer Orientation I · Digital Fluency Advanced · Learning Agility I · Problem Solving Advanced · Sense Making I · Transdisciplinary Thinking I — the catalog's four-item bundle kept; levels honest per map (Digital Fluency/Problem Solving Advanced, rest Intermediate).",
    anchors: ["Overview closing sentence: \"The Associate Business Analyst demonstrates an eagerness to learn from subject matter experts across different fields, contributing to the success of projects and initiatives.\""],
    specRef: "role-specs/ba.md — enabling bundle row",
  },

  // ── its · IT Support Engineer (roster 2.4; spec its.md) ───────────────────
  "its::Infrastructure Support": {
    descriptor:
      "FSC level 1-2 (FSC Document p.328): \"Provide services to end users by systematically identifying, classifying and troubleshooting technical issues and incidents that disrupt and impact their day-to-day business activities, within a specified timeframe…\"",
    anchors: [
      "PSF-SDS CWF \"Oversee infrastructure operations\" key tasks (printed p.22): \"Perform routine checks on infrastructure operations activities in accordance with the IT Operations standards and procedures\" · \"Assist with monitoring daily infrastructure traffic and performance\" · \"Configure infrastructure and related computing environments such as computer hardware, systems software, applications software\" · \"Maintain documentation of maintenance and optimization procedures and tests\" · \"Perform minor infrastructure repairs in accordance with design or installation specifications\"",
      "PSF-SDS CWF \"Resolve infrastructure-related problems and issues\" key tasks: \"Act as the first point of contact for infrastructure-related incidents\" · \"Assist with problem identification and resolution\" · \"Escalate unresolved infrastructure-related incidents for resolution\" · \"Documents incidents and track resolution in management systems\" · \"Document solutions to common infrastructure-related incidents\"",
    ],
    specRef: "role-specs/its.md — Infrastructure Support row (the two CWF key-task sub-rows fold into this catalog row; spec-only sub-rows per the canon-trio projection)",
  },
  "its::Infrastructure Deployment": {
    descriptor:
      "FSC level 1-2 (FSC Document p.324): \"Set up, deploy and decommission infrastructure components and associated equipment in accordance to a set plan and established safety and/or quality procedures…\"",
    anchors: [
      "PSF-SDS CWF \"Maintain infrastructure performance\": \"Assist with infrastructure testing, ongoing optimization or changes, and scheduled upgrades and updates\" · \"Coordinate the deployment of new and/or upgraded infrastructure\"",
    ],
    specRef: "role-specs/its.md — Infrastructure Deployment row",
  },
  "its::Network Administration and Maintenance": {
    descriptor:
      "FSC level 1-2 (FSC Document p.330): \"Monitor the network to provide for optimum levels of network performance and minimization of downtime. This includes detection, isolation, recovery, and limitation of the impact of failures on the network as well as provision of support to system users through ongoing maintenance information sharing and training.\"",
    anchors: ["Role overview (printed p.22): \"performs routine infrastructure operations and maintenance activities. They assist with monitoring infrastructure performance.\""],
    specRef: "role-specs/its.md — Network Administration and Maintenance row",
  },
  "its::Network Configuration": {
    descriptor:
      "FSC level 2 (FSC Document p.353): \"Configure network hardware and software components according to organizational guidelines and technical requirements. This includes the implementation and configuration of multiple servers, network devices, and network management tools as well as the management of user network access to ensure stable and reliable network operations.\"",
    anchors: ["PSF-SDS CWF \"Oversee infrastructure operations\" (configure bullet): \"Configure infrastructure and related computing environments such as computer hardware, systems software, applications software\""],
    specRef: "role-specs/its.md — Network Configuration row",
  },
  "its::Cyber and Data Breach Incident Management": {
    descriptor:
      "FSC level 2 on this role map (FSC Document p.190): \"Detect and report cyber and data-related incidents, identify affected systems and user groups, trigger alerts and announcements to relevant stakeholders and efficient resolution of the situation.\"",
    anchors: ["PSF-SDS CWF escalation bullets: \"Escalate unresolved infrastructure-related incidents for resolution\" · \"Documents incidents and track resolution in management systems\""],
    specRef: "role-specs/its.md — Cyber and Data Breach Incident Management row",
  },
  "its::Service Level Management": {
    descriptor:
      "FSC level 3 on this role map — kept secondary because the associate executes within targets already set (FSC Document p.396): \"Plan, monitor and manage service provisions for the achievement of agreed service level targets.\"",
    anchors: [
      "PSF-SDS CWF \"Oversee service level agreements and service improvements\": \"Assist in developing service-level objectives and targets\" · \"Maintain logs of service level performance metrics\" · \"Suggest improvements for procedures and controls to enhance performance and client satisfaction\" · \"Identify recurring incidents and potential issues for senior management\"",
    ],
    specRef: "role-specs/its.md — Service Level Management row",
  },
  "its::Customer Orientation · Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)": {
    descriptor: "PSF-SDS ESC all Basic, exactly as printed on this role map: Collaboration, Communication, Digital Fluency, Problem Solving, Self Management.",
    anchors: ["Role overview behavior sentence: \"They can communicate effectively and display high service level standards.\" · context anchor: \"They are required to be on standby with on-call availability with varied shifts including nights, weekends, and holidays.\""],
    specRef: "role-specs/its.md — enabling bundle row",
  },

  // ── sysadmin · Network / Systems Administrator (roster 2.5; spec sysadmin.md) ──
  "sysadmin::Systems administration (user groups, upgrades, backups)": {
    descriptor:
      "Roster's composite label kept; grounded in the printed CWF \"Design and develop new systems\" + role overview (printed p.26): \"The Associate Systems Support Engineer performs routine systems administration-related activities… They maximize service uptime, maintain system backups, manage service licensing, and maintain security standards.\" (SVD-V3: the overview sentence is the only artifact text behind \"backups\" — flagged at fixture time.)",
    anchors: [
      "PSF-SDS CWF key tasks: \"Perform system upgrades\" · \"Manage administration of user groups\" · \"Maintain documentation on current systems set-up and standard operating procedures\" · \"Assist with piloting of new tools, technologies, and/or processes\"",
    ],
    specRef: "role-specs/sysadmin.md — Systems administration row",
    flags: ["SYS-V3 copy-tightening flag: \"backups\" grounding lives in the overview sentence only (no associate-level CWF backup bullet printed)"],
  },
  "sysadmin::↳ CWF sub-row: Design and develop new systems": {
    descriptor: "Printed CWF key-task tier.",
    anchors: [
      "PSF-SDS CWF key tasks: \"Assist with the development of new systems in accordance with business needs and systems requirements\" · \"Improve efficiency and achieve predictable service delivery using ITIL framework.\" · \"Implement systems security and integrity controls\" · \"Assist with new system testing and implementation procedures\" · \"Assist with user acceptance tests for the newly deployed systems\" · \"Implement plans to make systems available to users in a shared, secure and controlled manner for easy adoption\"",
    ],
    specRef: "role-specs/sysadmin.md — CWF sub-row: Design and develop new systems",
  },
  "sysadmin::↳ CWF sub-row: Optimize systems performance": {
    descriptor: "Printed CWF key-task tier.",
    anchors: [
      "PSF-SDS CWF key tasks: \"Carry out optimisation of system components, updates and upgrades\" · \"Conduct technical research for software and hardware upgrades\" · \"Maintain documentation of all conducted system optimisation activities\" · \"Track key operational metrics, performance, utilization, throughput and capacity\"",
    ],
    specRef: "role-specs/sysadmin.md — CWF sub-row: Optimize systems performance",
  },
  "sysadmin::↳ CWF sub-row: Resolve system-related incidents": {
    descriptor: "Printed CWF key-task tier.",
    anchors: ["PSF-SDS CWF key tasks: \"Identify and resolve system-related issues\" · \"Escalate unresolved system-related issues\""],
    specRef: "role-specs/sysadmin.md — CWF sub-row: Resolve system-related incidents",
  },
  "sysadmin::Network Administration and Maintenance": {
    descriptor: "PSF-SDS FSC level 1-2 (FSC Document p.330 — description as in its.md).",
    anchors: ["PSF-SDS optimization/metrics CWF bullets + shared Infrastructure Support tasks"],
    specRef: "role-specs/sysadmin.md — Network Administration and Maintenance row",
  },
  "sysadmin::Infrastructure Support": {
    descriptor:
      "PSF-SDS FSC level 1-2 (FSC Document p.328): \"Provide services to end users by systematically identifying, classifying and troubleshooting technical issues and incidents…\"",
    anchors: ["SLA-assist CWF bullets + overview: \"They assist with implementing remedial actions in the event of system failures/breakdowns.\""],
    specRef: "role-specs/sysadmin.md — Infrastructure Support row",
  },
  "sysadmin::↳ CWF sub-row: Oversee service level agreements and service improvements": {
    descriptor: "Printed CWF key-task tier (printed on this role's map).",
    anchors: [
      "PSF-SDS CWF key tasks: \"Assist in developing service-level objectives and targets\" · \"Maintain log of service level performance metrics\" · \"Suggest improvements for procedures and controls to enhance performance and client satisfaction\" · \"Identify recurring incidents and potential issues for senior management\"",
    ],
    specRef: "role-specs/sysadmin.md — CWF sub-row: Oversee service level agreements and service improvements",
  },
  "sysadmin::Security Administration": {
    descriptor:
      "PSF-SDS FSC level 3 on this role map — kept secondary per the ladder: gates the next (engineer) rung (FSC Document p.390): \"Administer, configure and update of security programs and mechanisms, including the application of system patches to ensure that enterprise assets are adequately protected against threats. This also includes the authorisation, management and monitoring of access control permissions and/or rights to various IT facilities.\"",
    anchors: ["CWF \"Implement systems security and integrity controls\" · overview: \"maintain security standards\""],
    specRef: "role-specs/sysadmin.md — Security Administration row",
  },
  "sysadmin::IT Asset Management": {
    descriptor:
      "PSF-SDS FSC level 2 (FSC Document p.331): \"Manage, optimize and protect the organization's IT assets. This includes the timely purchase, deployment, categorisation, maintenance and phase out of IT assets…\"",
    anchors: ["Overview: \"manage service licensing\""],
    specRef: "role-specs/sysadmin.md — IT Asset Management row",
    flags: ["declared thin-resource zone (no bespoke free ITAM course verified — SYS-V1; no forced search per the resource rule)"],
  },
  "sysadmin::System Integration": {
    descriptor:
      "PSF-SDS FSC level 3 printed — kept secondary per the ladder (FSC Document p.397): \"Develop and implement a roadmap and specific integration solutions to facilitate integration of various ICT components and optimize interoperability of systems and their interfaces…\"",
    anchors: ["CWF \"Assist with the development of new systems… in accordance with business needs\""],
    specRef: "role-specs/sysadmin.md — System Integration row",
    flags: ["declared thin-resource zone (no domain-specific System-Integration primer verified — SYS-V1)"],
  },
  "sysadmin::Configuration Tracking · Cyber-and-Data-Breach Incident Management · Business Needs Analysis": {
    descriptor:
      "PSF-SDS FSC levels as printed on this map: Configuration Tracking level 1-2 (FSC Document p.387: \"Track systematically and manage changes and revisions in software projects to ensure that all changes are accounted for and to protect assets against unauthorized change, diversion and inappropriate use\"); Cyber and Data Breach Incident Management level 2 (description as in its.md); Business Needs Analysis level 2.",
    anchors: ["Escalation discipline: \"Escalate unresolved system-related issues\" · documentation discipline: \"Maintain documentation on current systems set-up and standard operating procedures\""],
    specRef: "role-specs/sysadmin.md — Configuration Tracking · Cyber-incident · BNA bundle row",
  },
  "sysadmin::Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)": {
    descriptor: "PSF-SDS ESC all Basic as printed: Collaboration, Communication, Digital Fluency, Problem Solving, Self Management.",
    anchors: ["Overview: \"They can communicate effectively and display high service level standards.\""],
    specRef: "role-specs/sysadmin.md — enabling bundle row",
  },

  // ── dba · Database Administrator (roster 2.6; spec dba.md) ───────────────
  "dba::Database Administration": {
    descriptor:
      "PSF-SDS FSC level 2 (FSC Document p.190; doc title *Database Administration* — the \"Admi­inistration\" hyphen is the text-layer artifact, corrected in copy per DBA-V5): \"Perform Installation, coordination and upgrading of databases and database servers, performance monitoring and troubleshooting. This includes monitoring user access to database and optimization of database performance, planning for backup and recovery, archived data maintenance and reporting.\"",
    anchors: [
      "PSF-SDS CWF key tasks (Oversee database administration): \"Maintain development, production and multiple testing environments\" · \"Assist in upgrades of databases, new structures or elements\" · \"Assist in installation, configuration and maintenance of database management systems software\" · \"Implement database back-up and recovery procedures\"",
      "PSF-SDS CWF \"Design and develop new database\" key tasks: \"Assist in business needs analysis for database design\" · \"Assist with testing of new database procedures and protocols\" · \"Configuring indexing\" · \"Code, edit and install stored procedures and functions for accessing, maintaining and populating databases\"",
      "PSF-SDS CWF \"Optimize database performance\" key tasks: \"Perform ongoing optimisation of database components to ensure availability, reliability, scalability, and security\" · \"Track key operational metrics, performance, utilization, throughput and capacity for reporting\"",
      "PSF-SDS CWF \"Resolve database incidents\" key tasks: \"Identify and resolve database issues\" · \"Determines appropriate course of action for resolving database issues, identify and mitigate risks\" · \"Escalate unresolved database issues\"",
    ],
    specRef: "role-specs/dba.md — Database Administration row (+ its four CWF key-task sub-rows fold into this catalog row per the canon-trio projection)",
  },
  "dba::Database security controls": {
    descriptor:
      "Printed CWF name \"Manage database security\" — roster's label kept; grounded in the CWF + FSC Security Administration level 2 on this map (FSC Document p.390, quoted in sysadmin file).",
    anchors: [
      "Key tasks: \"Implement database security and data integrity controls\" · \"Control privileges and permissions to database users\" · \"Adhere to information security policies, procedures and protocols in all tasks\"",
    ],
    specRef: "role-specs/dba.md — Database security controls row",
  },
  "dba::Data Engineering": {
    descriptor:
      "PSF-SDS FSC level 2 (FSC Document p.387): \"Develop and implement efficient and stable processes to collect, store, extract, transform, load and integrate data at various stages in the data pipeline. This also involves processing varying amounts of data from a variety of sources and preparing data in a structure that is easily accessed and analyzed according to business requirements.\"",
    anchors: ["Overview (printed p.30): \"responsible for verifying all data to be entered into the database meets set standards and requirements.\""],
    specRef: "role-specs/dba.md — Data Engineering row",
  },
  "dba::Data Migration": {
    descriptor: "PSF-SDS FSC level 3 printed — kept secondary per the ladder (FSC Document p.190): \"Plan and perform activities to migrate data between computer storage types or file formats.\"",
    anchors: ["CWF \"Assist in upgrades of databases, new structures or elements\""],
    specRef: "role-specs/dba.md — Data Migration row",
  },
  "dba::Infrastructure Support": {
    descriptor: "PSF-SDS FSC level 1-2 (description as in its/sysadmin, FSC Document p.328).",
    anchors: ["Overview: \"installing, configuring, and maintaining the database infrastructure within assigned span-of-control\"; \"required to be on standby with on-call availability to resolve database-related incidents.\""],
    specRef: "role-specs/dba.md — Infrastructure Support row",
  },
  "dba::Problem Management": {
    descriptor: "PSF-SDS FSC level 3 printed — kept secondary (FSC Document p.390): \"Manage the lifecycle of problems to prevent problems and incidents from occurring, eliminate recurring incidents, and minimize the impact of unavoidable incidents.\"",
    anchors: ["\"Determines appropriate course of action for resolving database issues, identify and mitigate risks\" · \"Escalate unresolved database issues\""],
    specRef: "role-specs/dba.md — Problem Management row",
  },
  "dba::↳ CWF sub-row: Oversee database administration": {
    descriptor: "Printed CWF key-task tier (folds into the Database Administration catalog row's deep data in the canon trio projection — carried standalone here for the four sub-rows).",
    anchors: [
      "\"Maintain development, production and multiple testing environments\" · \"Assist in upgrades of databases, new structures or elements\" · \"Assist in installation, configuration and maintenance of database management systems software\" · \"Implement database back-up and recovery procedures\"",
    ],
    specRef: "role-specs/dba.md — CWF sub-row: Oversee database administration",
  },
  "dba::↳ CWF sub-row: Design and develop new database": {
    descriptor: "Printed CWF key-task tier.",
    anchors: [
      "\"Assist in business needs analysis for database design\" · \"Assist with testing of new database procedures and protocols\" · \"Assist in establishing database system flows\" · \"Maintain data documentation and metadata models\" · \"Configuring indexing\" · \"Code, edit and install stored procedures and functions for accessing, maintaining and populating databases\"",
    ],
    specRef: "role-specs/dba.md — CWF sub-row: Design and develop new database",
  },
  "dba::↳ CWF sub-row: Optimize database performance": {
    descriptor: "Printed CWF key-task tier.",
    anchors: [
      "\"Perform ongoing optimisation of database components to ensure availability, reliability, scalability, and security\" · \"Assist with database audits and maintenance activities\" · \"Maintain documentation of database optimization activities\" · \"Track key operational metrics, performance, utilization, throughput and capacity for reporting\" · \"Ensure optimal database performance and availability\"",
    ],
    specRef: "role-specs/dba.md — CWF sub-row: Optimize database performance",
  },
  "dba::↳ CWF sub-row: Resolve database incidents": {
    descriptor: "Printed CWF key-task tier.",
    anchors: [
      "\"Identify and resolve database issues\" · \"Troubleshoot index in database development\" · \"Determines appropriate course of action for resolving database issues, identify and mitigate risks\" · \"Escalate unresolved database issues\" · \"Ensure adherence to organizational database procedures, policies and protocols\"",
    ],
    specRef: "role-specs/dba.md — CWF sub-row: Resolve database incidents",
  },
  "dba::Collaboration · Communication · Digital Fluency · Problem Solving · Self Management (Enabling, Basic)": {
    descriptor: "PSF-SDS ESC all Basic as printed.",
    anchors: ["Overview: \"They can communicate effectively and display high service level standards.\""],
    specRef: "role-specs/dba.md — enabling bundle row",
  },

  // ── cybersec · Security Analyst (roster 2.7; spec cybersec.md) ───────────
  "cybersec::Threat analysis / monitoring": {
    descriptor:
      "Grounded in PSF-SDS Threat Analysis and Defense (level 3) + Threat Intelligence and Detection (level 3) + the CWF \"Security Operations Assistance\", as printed on the Security Analyst map (printed pp.126–127). Role overview: \"The Security Analyst has minimal experience in IT and cybersecurity that supports the security function under close supervision. This role conducts basic security tasks to assist in monitoring, access control, vulnerability testing, and security incident response.\"",
    anchors: [
      "Responsibilities: \"Monitor security tools and systems to identify threats, anomalies and events for escalation\"",
      "CWF key tasks: \"Log review and analysis\" · \"Provide daily reports on monitoring results to supervisor for review\" · \"Support monitoring activities\" · \"Track security events and incidents\"",
    ],
    specRef: "role-specs/cybersec.md — Threat analysis / monitoring row (CYB-V1 closed: attribution is Security Analyst)",
  },
  "cybersec::Cyber and Data Breach Incident Management": {
    descriptor:
      "PSF-SDS FSC level 4 on the Security Analyst map (level 2 on the Associate Infrastructure map — per-instance extraction closed CYB-V1) (FSC Document p.190): \"Detect and report cyber and data-related incidents, identify affected systems and user groups, trigger alerts and announcements to relevant stakeholders and efficient resolution of the situation.\"",
    anchors: ["CWF \"Incident Response Support\": \"Support incident response activities based on SOPs\" · \"Conduct basic analysis of incidents\" · \"Gather data and evidence as directed\" · \"Support containment and recovery activities\""],
    specRef: "role-specs/cybersec.md — Cyber and Data Breach Incident Management row",
  },
  "cybersec::Network administration & maintenance": {
    descriptor:
      "Grounded in Network Security level 3 on the Security Analyst map (FSC Document p.355): \"Design and configure network systems to ensure the integrity of network infrastructure through the use of appropriate protection, detection, and response mechanisms.\" Also grounded in the O&S map's Network Administration and Maintenance L1-2.",
    anchors: ["Responsibilities bullet: \"Assist in implementing technical controls like firewalls, Intrusion Detection Systems/Intrusion Prevention Systems (IDS/IPS), and Security Information and Event Management (SIEM) tools based on specifications\""],
    specRef: "role-specs/cybersec.md — Network administration & maintenance row",
  },
  "cybersec::Vulnerability assessment support (VAPT analyst track)": {
    descriptor:
      "Grounded in Security Assessment and Testing (level 2-3; FSC Document p.355: \"Conduct threat modeling, vulnerability assessment and penetration testing to reveal vulnerabilities or lapses in the existing systems or security mechanisms…\") and Threat and Vulnerability Management (level 3: \"Manage cyber threats and system vulnerabilities to minimize cyber risks.\").",
    anchors: [
      "CWF \"Vulnerability Management Assistance\": \"Perform vulnerability scans\" · \"Identify and escalate high-priority threats and anomalies within established service-level agreements\" · \"Conduct basic penetration testing\" · \"Support remediation process\" · \"Submit vulnerability assessment reports as per quality guidelines\"",
      "Responsibilities bullet: \"Perform basic vulnerability scanning and penetration testing activities\"",
    ],
    specRef: "role-specs/cybersec.md — Vulnerability assessment support row (CYB-V5: TryHackMe paid tier boundary stated on copy)",
  },
  "cybersec::Collaboration · Communication · Problem Solving · Digital Fluency (Enabling)": {
    descriptor:
      "ESC as printed on the Security Analyst map — honest dup-cell rendering kept (CYB-V2 CLOSED-as-evidenced: the dup cells are literally printed; Digital Fluency I→Advanced, Problem Solving I→Advanced, Sense Making I→Intermediate twice — printed as the progressive pair exactly as the file does, never silently cleaned).",
    anchors: [
      "CWF \"Compliance and Audit Assistance\": \"Collect required audit logs and data\" · \"Generate reports for compliance\" · \"Ensure accuracy and completeness of data as per compliance standards\"",
      "Responsibilities: \"Generate reports for compliance and audits under guidance\" · \"Conduct basic security awareness training\"",
    ],
    specRef: "role-specs/cybersec.md — enabling bundle row",
  },

  // ── webdev · Web Developer (roster 2.8; spec webdev.md) ──────────────────
  "webdev::Client-side coding (HTML/CSS/JS)": {
    descriptor:
      "Condensed paraphrase of the O*NET task verb set (flagged paraphrase — O*NET prints tasks, not skill descriptors): build/maintain web code. [O*NET] 15-1254.00 \"Web Developers\", title as displayed 2026 (WEB-V2 resolved).",
    anchors: [
      "O*NET 15-1254.00 tasks: \"Write supporting code for Web applications or Web sites.\" · \"Design, build, or maintain Web sites, using authoring or scripting languages, content creation tools, management tools, and digital media.\" · \"Evaluate code to ensure that it is valid, is properly structured, meets industry standards, and is compatible with browsers, devices, or operating systems.\"",
    ],
    specRef: "role-specs/webdev.md — Client-side coding row",
    flags: ["constructed/paraphrase row name ACCEPTED (ruling 2026-10-29; original task text stays as the attributed anchor)"],
  },
  "webdev::↳ task-cluster sub-row: site life-operations": {
    descriptor: "Task-cluster tier — the site life-operations O*NET verbs grouped as one row.",
    anchors: [
      "O*NET 15-1254.00 tasks: \"Perform Web site tests according to planned schedules, or after any Web site or product revision.\" · \"Perform or direct Web site updates.\" · \"Back up files from Web sites to local directories for instant recovery in case of problems.\" · \"Renew domain name registrations.\" · \"Design, build, or maintain Web sites, using authoring or scripting languages, content creation tools, management tools, and digital media.\" · \"Recommend and implement performance improvements.\"",
    ],
    specRef: "role-specs/webdev.md — site life-operations task-cluster sub-row",
    flags: ["constructed row (task-cluster), ruling accepted 2026-10-29"],
  },
  "webdev::CMS administration (WordPress etc.)": {
    descriptor:
      "Condensed paraphrase (flagged): run the content/CMS stack behind business sites.",
    anchors: [
      "O*NET 15-1254.00 tasks: \"Design, build, or maintain Web sites, using authoring or scripting languages, content creation tools, management tools, and digital media.\" (the \"content creation tools, management tools\" clause) · \"Analyze user needs to determine technical requirements.\"",
    ],
    specRef: "role-specs/webdev.md — CMS administration row",
    flags: ["constructed/paraphrase row name ACCEPTED (ruling 2026-10-29)"],
  },
  "webdev::Responsive/UI basics + accessibility": {
    descriptor: "Condensed paraphrase (flagged): cross-device + accessible rendering.",
    anchors: [
      "O*NET 15-1254.00 tasks: \"Incorporate technical considerations into Web site design plans, such as budgets, equipment, performance requirements, and legal issues including accessibility and privacy.\" · \"Write supporting code for Web applications or Web sites.\"",
    ],
    specRef: "role-specs/webdev.md — Responsive/UI basics + accessibility row (WEB-V4: #271 is the demand name; the role stays \"usually a CMS + front-end first job\")",
    flags: ["constructed/paraphrase row name ACCEPTED (ruling 2026-10-29)"],
  },
  "webdev::Version control (git)": {
    descriptor: "Condensed paraphrase (flagged): team-safe code management.",
    anchors: [
      "O*NET 15-1254.00 tasks: \"Evaluate code to ensure that it is valid, is properly structured, meets industry standards, and is compatible with browsers, devices, or operating systems.\"",
    ],
    specRef: "role-specs/webdev.md — Version control (git) row",
    flags: ["constructed/paraphrase row name ACCEPTED (ruling 2026-10-29)"],
  },
  "webdev::Agile Software Development (when agency-run)": {
    descriptor: "[PSF] tag as printed on the roster row; sprint/stand-up/review practice named in the swd FSC (shared family). Kept from the catalog as-is.",
    anchors: [
      "O*NET 15-1254.00 collaboration-side tasks: \"Confer with management or development teams to prioritize needs, resolve conflicts, develop content criteria, or choose solutions.\" · \"Collaborate with others to resolve information technology issues.\"",
    ],
    specRef: "role-specs/webdev.md — Agile Software Development (when agency-run) row",
  },

  // ── digart · Digital / Multimedia Artist (roster 2.9; spec digart.md) ─────
  "digart::DEVELOP DESIGNS FOR A LOGO (ICT216313)": {
    descriptor:
      "TESDA VGD NC III unit descriptor (verbatim): \"…incorporate the principles of visual design and communication into the development of designs for a logo for use in various industries.\" (TR version 01, amended 2018-02-27 — DIG-V4 currency rides the standing TESDA sweep.)",
    anchors: [
      "Unit element 1 (verbatim, logo unit — the same brief-receive → design → submit-for-approval element pattern prints across the six units; DIG-V5: pull each unit's own element table before quoting another unit's element): \"1. Receive and interpret the logo design brief — 1.1 The instructions & specifications to develop the logo is read & analyzed based on the design brief; 1.2 The objective to produce the desired outcome of logo design are identified based on the client and/or the company directives; 1.3 Information needed via research and other resources to develop logo concepts is identified; 1.4 Process and steps of submission of logo design for approval is confirmed with the client and/or a supervisor; 1.5 All relevant questions essential to develop the logo design is discussed and liaised with relevant personnel.\"",
    ],
    specRef: "role-specs/digart.md — STATIC six: DEVELOP DESIGNS FOR A LOGO (DIG-V1 ruled: the contraction is replaced by the verbatim six)",
  },
  "digart::DEVELOP DESIGNS FOR PRINT MEDIA (ICT216314)": {
    descriptor:
      "TESDA VGD NC III unit descriptor (verbatim): \"…conceptualize and design for posters, tarpaulin, magazine, brochures, invitation and other kinds of design intended for printed material output or format for personal, industrial and commercial use.\"",
    anchors: ["Same brief-receive → design → submit-for-approval element pattern as the logo unit (DIG-V5 flag: pull this unit's own element table before quoting it)."],
    specRef: "role-specs/digart.md — STATIC six: DEVELOP DESIGNS FOR PRINT MEDIA",
  },
  "digart::DEVELOP DESIGNS FOR USER EXPERIENCE (ICT216315)": {
    descriptor: "TESDA VGD NC III unit descriptor (verbatim): \"…development of designs for user experience.\"",
    anchors: ["Same element pattern (DIG-V5 flag)."],
    specRef: "role-specs/digart.md — STATIC six: DEVELOP DESIGNS FOR USER EXPERIENCE",
  },
  "digart::DEVELOP DESIGNS FOR USER INTERFACE (ICT216316)": {
    descriptor: "TESDA VGD NC III unit descriptor (verbatim): \"…development of designs for USER INTERFACE.\"",
    anchors: ["Same element pattern (DIG-V5 flag)."],
    specRef: "role-specs/digart.md — STATIC six: DEVELOP DESIGNS FOR USER INTERFACE",
  },
  "digart::DEVELOP DESIGNS FOR PRODUCT PACKAGING (ICT216317)": {
    descriptor: "TESDA VGD NC III unit descriptor (verbatim): \"…development of designs for product packaging.\"",
    anchors: ["Same element pattern (DIG-V5 flag)."],
    specRef: "role-specs/digart.md — STATIC six: DEVELOP DESIGNS FOR PRODUCT PACKAGING",
  },
  "digart::DESIGN BOOTH AND PRODUCT WINDOW / DISPLAY (ICT216318)": {
    descriptor: "TESDA VGD NC III unit descriptor (verbatim): \"…the design and production of booth and product window displays.\"",
    anchors: ["Same element pattern (DIG-V5 flag)."],
    specRef: "role-specs/digart.md — STATIC six: DESIGN BOOTH AND PRODUCT WINDOW / DISPLAY",
  },
  "digart::Use specialized graphic/animation tools (Adobe suite, Blender etc.)": {
    descriptor:
      "TR tooling is named inside the core units' Required Knowledge (verbatim from the logo unit's knowledge list): \"7. Computer knowledge 8. software knowledge\" with the TR tool lists naming, e.g., \"8.1. Adobe Photoshop / 8.3. Adobe InDesign / 8.4. Adobe Illustrator\" and (packaging unit) \"5.1. Adobe Photoshop / 5.2. Adobe Illustrator / 5.3. Adobe Flash/Animate\". Roster's label kept (no dedicated TESDA tool unit exists in this TR).",
    anchors: ["Element pattern across core units: design development performed in design software; trademark/IP knowledge (\"3. Intellectual property\") cited in Required Knowledge."],
    specRef: "role-specs/digart.md — Use specialized graphic/animation tools row",
    flags: ["DIG-V2: Adobe official tutorials 403 to the environment — not cited; re-check from a browser only if copy wants an Adobe link"],
  },
  "digart::Follow creative brief + brand guideline development": {
    descriptor: "[TESDA unit element + corroborating [PSF-CCB] \"Brand Guideline Development\" per roster tag] — the TR's own brief-discipline loop.",
    anchors: [
      "Unit element 1.1–1.5 (verbatim): read & analyze the brief → identify objectives → research → confirm submission/approval process → liaise (\"Process and steps of submission of logo design for approval is confirmed with the client and/or a supervisor.\")",
    ],
    specRef: "role-specs/digart.md — Follow creative brief + brand guideline development row",
  },
  "digart::Client communication & revision handling": {
    descriptor:
      "[NACE Communication corroboration per roster tag; TR Required Skills list, verbatim]: \"1.1. Verbal communication 1.2. Written communication … 1.3. Listening skills 1.4. Critical Thinking 1.5. Analytical and comprehension Skills 1.6. Reporting skills 1.7. Presentation skills.\"",
    anchors: [
      "Element 1.5: \"All relevant questions essential to develop the logo design is discussed and liaised with relevant personnel.\" · Element 1.4: \"Process and steps of submission of logo design for approval is confirmed with the client and/or a supervisor.\"",
    ],
    specRef: "role-specs/digart.md — Client communication & revision handling row",
  },
  "digart::Junior 2D Animator — [PSF-DAA] (counterpart, optional — user ruling 2026-10-29 ADD)": {
    descriptor:
      "[PSF-DAA · source-verbatim role-map name]: Junior 2D Animator — the PSF for Digital Art and Animation career map covers the animation production pipeline (map printed ~p.33); the animation counterpart family to this graphic-artist desk — not a TR row.",
    anchors: ["JobsFit demand anchor (verbatim, header): Hard-to-Fill #1 \"2D Digital Animator\" (asterisked \"not completely defined in the PSOC\") · recorded PSF-DAA reads (DIG-V3)."],
    specRef: "role-specs/digart.md — Junior 2D Animator counterpart row",
    flags: ["counterpart ruling 2026-10-29; extract-light — only the map/name recorded, NO FSC levels (do not print levels for it)"],
  },

  // ── soc · SOC Analyst (extension E4; spec soc.md draft, blessed 2026-10-30) ──
  "soc::Monitor cyber security systems": {
    descriptor:
      "PSF-SDS CWF as printed on the Security Operations Analyst map (printed pp.144–145). Role overview: \"The Security Operations Analyst performs real-time analysis and trending of security log data from various security devices and systems… responds to user incident reports and evaluates the type and severity of security events… documents incidents and develops reports.\"",
    anchors: [
      "CWF key tasks: \"Carries out audits, reviews, security control assessments, and tests of security operations based on established schedules and protocols\" · \"Perform real-time analysis and trending of security log data from cyber security systems\" · \"Analyze security event data to identify suspicious and malicious activities\" · \"Provide inputs to improve security monitoring rules and alerts\" · \"Document processes related to cyber security monitoring\"",
    ],
    specRef: "role-specs/soc.md — Monitor cyber security systems row (SOC-V2 flag rides the descriptor levels, not these CWF quotes)",
  },
  "soc::Maintain cyber security operations": {
    descriptor:
      "PSF-SDS CWF. Tier-1 signature: \"Security Operations Analysts are required to be on standby with on-call availability with varied shifts including nights, weekends and holidays.\" Note: \"Implement/formulate\" read senior at Tier-1 — the queue-relevant keys are maintain-data-sources / schedule-checks / status-reports.",
    anchors: [
      "CWF key tasks: \"Implement cyber security protocols\" · \"Formulate emergency response procedures\" · \"Maintain data sources feeding the log monitoring system\" · \"Schedule security checks in accordance with reporting schedules\" · \"Prepare periodic status reports for presentation to management\"",
    ],
    specRef: "role-specs/soc.md — Maintain cyber security operations row",
  },
  "soc::Manage response to cyber security incidents": {
    descriptor:
      "PSF-SDS CWF — soc claims the queue's reporting slice (evaluate → update → report); cybersec keeps the entry/assist rung of the same family FSC.",
    anchors: [
      "CWF key tasks: \"Review security incident reports\" · \"Analyze the type and severity of cyber security incidents\" · \"Assist in establishing procedures for handling detected cyber security incidents\" · \"Provide status updates during the lifecycle of a cyber security incident\" · \"Prepare final incident report detailing the events of the cyber security incident\" · \"Support the maintenance and update of business recovery, contingency plans and procedures\"",
    ],
    specRef: "role-specs/soc.md — Manage response to cyber security incidents row",
  },
  "soc::Threat Analysis and Defence · Threat Intelligence and Detection (family FSC cross-cite)": {
    descriptor:
      "PSF-SDS same source rows the sibling file cites (FSC Document pp.190/193 descriptions, quoted there); on this rung's list the cells read L4 / L3 — SOC-V2 attribution/levels facsimile check pending (do not print levels as final). Secondary here: at Tier-1 these back the queue decisioning (\"Knowledge of attack framework\" is REQUIRED KNOWLEDGE in the TESDA monitoring unit).",
    anchors: [
      "O*NET 15-1212.00 (importance 81, \"Updated 2026\"): \"Monitor current reports of computer viruses to determine when to update virus protection systems.\"",
      "TESDA TR Cyber Threat Monitoring NC I, unit ICT251312 knowledge items: \"1.11. Knowledge of attack framework\" · \"1.10. Malicious software behaviors\"; CS-SOC Analysis L3 unit CS-ICT251112 criterion \"1.5 Threat intelligence feeds are utilized\" · knowledge \"1.4 Indicators of compromise\"; TESDA range (unit ICT251312): red-flag detection \"May include: 3.1. ransomware 3.2. PE Infection /Virus\"",
    ],
    specRef: "role-specs/soc.md — Threat family cross-cite row",
    flags: ["SOC-V2 attribution/levels facsimile check pending — do not print ESC/level values as final"],
  },
  "soc::Vulnerability scanning (VAPT-adjacent, TESDA-printed)": {
    descriptor:
      "TESDA TR Cyber Threat Monitoring NC I core unit \"Conduct vulnerability scanning of assets\" (ICT251313), unit descriptor verbatim: \"This unit covers the knowledge, skills and attitude required to conduct vulnerability scanning. It includes checking schedule for scanning, conducting scanning of assets and providing report of scanning.\" The catalog's \"Vulnerability assessment support\" placeholder maps here — sibling complement: cybersec carries the PSF VAPT-analyst track; soc carries the TESDA scanning-for-the-queue framing.",
    anchors: [
      "Unit ICT251313 elements/criteria: \"1. Check schedule for scanning\" (\"1.1. Vulnerability management is consulted with the immediate supervisor\") · \"1.4. Signed off on scope of work is performed and accomplished according to prescribed timeline\" · \"2. Conduct scanning of assets\" (\"2.1. List of assets for vulnerability scanning are verified with supervisor and change manager based on scope of work\") · \"2.3. Prescribed schedule for vulnerability scanning is adhered to\" (knowledge \"2.7. Familiarity on NIST 800-115\") · \"3. Provide report of scanning\" (\"3.3. Vulnerability assessment report is submitted to immediate supervisor and change manager\")",
    ],
    specRef: "role-specs/soc.md — Vulnerability scanning row",
  },
  "soc::Network security understanding (network administration family)": {
    descriptor:
      "Cross-artifact: TESDA CS-SOC Analysis L3 core unit \"Carry out network administration\" (CS-ICT251110); TESDA TR NC I knowledge \"1.4. Basic knowledge with network infrastructure and architecture, i.e. LAN, WAN, port forwarding\"; PSF-SDS FSC Network Security level 3 on this rung's list (SOC-V2 flag).",
    anchors: ["TESDA TR NC I unit ICT251312 criteria overlap: \"1.1. Detection alert is received as per company Standard Operating Procedure (SOP)\" (alert-source range: \"1.3. Firewall alert · 1.4. Web application firewall alert · 1.6. EDR alert · 1.7. NDR alert\")"],
    specRef: "role-specs/soc.md — Network security understanding row",
  },
  "soc::Collaboration · Communication · Problem Solving · Digital Fluency (Enabling)": {
    descriptor:
      "PSF-SDS ESC cells as printed on this rung's list — Collaboration I · Communication I · Creative Thinking I · Decision Making I · Digital Fluency Advanced · Problem Solving I (dup-cell: also prints Advanced — SOC-V2) · Sense Making I · Transdisciplinary Thinking I. Do not print ESC levels as final until the facsimile check.",
    anchors: [
      "Role overview behavior sentence: \"The Security Operations Analyst is diligent and takes an analytical approach to perform real-time analyses…\"",
      "O*NET Work Activities (attributed, 15-1212.00): \"Monitoring Processes, Materials, or Surroundings — Monitoring and reviewing information from materials, events, or the environment, to detect or assess problems.\" (73) · \"Communicating with Supervisors, Peers, or Subordinates\" (75) · \"Documenting/Recording Information\" (76)",
    ],
    specRef: "role-specs/soc.md — enabling bundle row",
    flags: ["SOC-V2 ESC levels pending facsimile — carried as printed dup-cells, not cleaned"],
  },

  // ── da · Data Analyst, junior (E1; spec da.md — rows byte-kept) ───────────
  "da::Data Analytics": {
    descriptor:
      "PSF-AAI FSC level 2: \"Get the data talking: surface the real trend or pattern that answers the business question, using stats and computing tools.\"",
    anchors: ["PSF-AAI role overview (printed p.35): \"They assist in the collection and organization of data, perform basic data analysis under supervision…\""],
    specRef: "role-specs/da.md Row 1",
  },
  "da::Data Visualization and Storytelling": {
    descriptor:
      "PSF-AAI FSC level 3: \"Build the dashboard/visual that makes the finding land, and tell the story behind the numbers.\"",
    anchors: ["PSF-AAI role overview: \"learn to use data visualization tools and techniques… presenting findings in a clear manner\""],
    specRef: "role-specs/da.md Row 2",
  },
  "da::Business Needs Analysis": {
    descriptor:
      "PSF-AAI FSC level 2 (role-map layer — the rung's attained level, printed p.35; layer correction applied 2026-10-29): the quoted cell strings print identically across PSF-SDS and PSF-AAI at the proficiency-cell layer.",
    anchors: ["PSF-AAI CWF \"Identify business needs\" key task 1: \"Assist in identifying potential business intelligence service offerings by supporting the analysis of business requirements.\""],
    specRef: "role-specs/da.md Row 3 (two-layer correction applied)",
  },
  "da::ETL (extract-transform-load workflows)": {
    descriptor:
      "PSF-AAI CWF key-task tier — \"Prepare and analyze data\"; not a named FSC.",
    anchors: ["PSF-AAI \"Prepare and analyze data\" CWF key tasks: assemble and clean the pipeline piece by piece — gather data, validate it, keep records trustworthy (key tasks verbatim on the map, printed p.35)."],
    specRef: "role-specs/da.md Row 4",
  },
  "da::Data Engineering": {
    descriptor: "PSF-AAI FSC level 2: the \"where data comes from and lives\" layer feeding the analysis.",
    anchors: ["PSF-AAI role overview: \"help maintain databases and data systems\""],
    specRef: "role-specs/da.md Row 5",
  },
  "da::Enabling Skills & Competencies (ESC) — Collaboration, Communication, Digital Fluency, Learning Agility": {
    descriptor:
      "PSF-AAI ESC, all Basic — exactly the four the role page lists (matrix-limited 4-ESC aggregate stands per the ESC ruling).",
    anchors: ["PSF-AAI role overview: \"collaborate with team members on data-related projects.\""],
    specRef: "role-specs/da.md Row 6",
    flags: ["ESC ruling: the 4-ESC aggregate stands (matrix-limited); no expansion attempted"],
  },
  "da::Applications Development": {
    descriptor: "PSF-AAI FSC level 3: light programming muscle around analytics work.",
    anchors: [],
    specRef: "role-specs/da.md Row 7",
    flags: ["anchorless/resourceless honesty (recorded ruling stands)"],
  },
  "da::Artificial Intelligence Ethics and Governance": {
    descriptor: "PSF-AAI FSC level 2: keep AI/data work compliant with governance rules (RA 10173 invoked in the role's performance-expectations clause).",
    anchors: [],
    specRef: "role-specs/da.md Row 8",
    flags: ["anchorless/resourceless honesty (recorded ruling stands)"],
  },
  "da::Data Ethics": {
    descriptor: "PSF-AAI FSC level 3: treat data — especially personal data — legally and ethically throughout its lifecycle.",
    anchors: [],
    specRef: "role-specs/da.md Row 9",
    flags: ["anchorless/resourceless honesty (recorded ruling stands)"],
  },
  "da::Cyber and Data Breach Incident Management": {
    descriptor: "PSF-AAI FSC level 2: recognize, report and escalate data incidents under the house escalation protocol.",
    anchors: [],
    specRef: "role-specs/da.md Row 10",
    flags: ["anchorless/resourceless honesty (recorded ruling stands)"],
  },
  "da::Software Testing": {
    descriptor: "PSF-AAI FSC level 2: sanity-test the tools/reports you produce before they ship.",
    anchors: [],
    specRef: "role-specs/da.md Row 11",
    flags: ["anchorless/resourceless honesty (recorded ruling stands)"],
  },
  "da::Configuration Tracking": {
    descriptor:
      "PSF-AAI FSC level 1: keep change logs tidy so analysis files/scripts are reproducible. Reproducibility rationale (student-facing) kept per user ruling 2026-10-29 alongside the anchorless honesty flag.",
    anchors: [],
    specRef: "role-specs/da.md Row 12",
    flags: ["anchorless/resourceless honesty + Row-12 platform-reproducibility rationale KEPT (user ruling 2026-10-29)"],
  },
  "da::Stakeholder Management": {
    descriptor: "PSF-AAI FSC level 2: know who you report to, who consumes your reports, and keep both in the loop.",
    anchors: ["PSF-AAI CWF key task 2: \"Aid in understanding the information needs of stakeholders for decision-making.\""],
    specRef: "role-specs/da.md Row 13",
  },
};

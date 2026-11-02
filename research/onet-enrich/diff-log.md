# O*NET 31.0 snapshot · diff against catalog/rowspec — 36 tracks (USER REVIEW ONLY)

_Mechanical, read-only comparison of lib/fixtures claims against the pinned O*NET Web Services v2 snapshot (research/onet-enrich/pulls/). Every line is an extraction fact. **No fixes applied, no recommendations beyond the factual diff** — rulings stay with the user (ADR 0004 §refresh ritual, ADR 0005 §1)._

Version pin captured from the API's own `/about/` response: **O*NET 31.0** · api_version 2.0.0 · taxonomy O*NET-SOC 2019. Pull receipts: manifest.json; raw payloads (unedited) in pulls/*.json with .url.txt siblings.

## 0 · Extraction facts

- Tracks extracted from `lib/fixtures/catalog.ts`: **36** (11 IT + 9 Business + 10 Accounting + 6 Office).
- Distinct provenance-keyed O*NET-SOC anchors: **18** (15-1253.00, 15-1254.00, 15-1212.00, 13-1111.00, 13-1023.00, 13-1121.00, 43-3031.00, 43-3051.00, 13-2051.00, 43-3071.00, 43-3011.00, 13-2072.00, 13-2011.00, 43-6014.00, 43-9061.00, 43-9021.00, 43-6011.00, 43-4171.00) covering **21 of the 36 tracks**.
- **15 tracks carry no provenance-keyed O*NET anchor** in the fixtures (rows are [PSF]/[TESDA]/[PSOC]/[NACE]): swd, ba, its, sysadmin, dba, cybersec, digart, da, hra, training, mkt, sales, csr, ccqa, desk → their sections record NO-OUR-ROW; no code was guessed.
- Per code pulled: informational payload + details/technology_skills + details/tasks + details/skills + details/work_activities — every documented `next` pagination page followed to the served total.
- **Coverage gap:** 13-2051.00 (fin · Financial and Investment Analysts) serves `total: 0` (empty list) for details/skills and details/work_activities — API-side absence at this pin, recorded not substituted; its tasks (26) and technology categories (27) served normally.
- Claim-shape legend: rowspec rows quote O*NET text inside `anchors`/`descriptor` ("..." spans), or declare `task as printed` (the catalog row NAME is then the claimed verbatim text).

---
# Track · Computer & IT (roster 2.1–2.9 + E1/E4)

## 1 · swd — Associate Software Developer

Track it · PSOC 2512 (Software developers) · O*NET anchor(s): none recorded in fixtures

**NO-OUR-ROW** — no O*NET-keyed row exists on this track to compare (skill-row source tags: PSF). No O*NET code derivable from the fixtures; nothing improvised.

## 2 · qa — Software QA Analyst

Track it · PSOC 2519 (Software and applications developers and analysts nec) · O*NET anchor(s): 15-1253.00

### anchor 15-1253.00 — O*NET serves “Software Quality Assurance Analysts and Testers” (updated 2026)

- Title: catalog “Software QA Analyst” vs O*NET “Software Quality Assurance Analysts and Testers” — **DIFFERS** (catalog display names are the blessed display-label layer; recorded, not judged).
  - O*NET sample of reported titles (10): Automation Tester · Information Technology Analyst (IT Analyst) · Quality Assurance Analyst (QA Analyst) · Quality Assurance Engineer (QA Engineer) · Quality Engineer · Software Quality Assurance Analyst (SQA Analyst) · Software Quality Assurance Engineer (SQA Engineer) · Software Quality Engineer · Software Test Engineer · Test Engineer
  - Served counts: tasks 30 · skills 35 · work activities 41 · technology categories 68 · Software-Skills source row: Employer Job Postings (2026)

| Software Testing (core/PSF) | “Develop and execute software tests to identify software problems and their causes.” | DIFFERS | not among the 30 served tasks; nearest “Identify, analyze, and document problems with program function, output, online scree” (overlap 30%) |
| Test Planning (core/PSF) | “Design test plans, scenarios, scripts, or procedures.” | MATCH (exact) | task 14638 (importance 84) |
| Test Planning (core/PSF) | “Plan test schedules or strategies in accordance with project scope or delivery dates…” | MATCH (exact) | task 14645 (importance 75) |
| Defect management (core/PSF) | “Document software defects, using a bug tracking system, and report defects to softwa…” | MATCH (exact) | task 14641 (importance 92) |
| Quality Assurance / Quality Standards (core/PSF) | “Develop or specify standards, methods, or procedures to determine product quality or…” | MATCH (exact) | task 14649 (importance 78) |
| Quality Assurance / Quality Standards (core/PSF) | “Document test procedures to ensure replicability and compliance with standards.” | MATCH (exact) | task 14648 (importance 83) |
| Business Needs Analysis (secondary/PSF) | “Review software documentation to ensure technical accuracy, compliance, or completen…” | MATCH (exact) | task 14647 (importance 68) |

- **Technology-skills presence** — O*NET serves 68 tech categories for 15-1253.00 (Development environment software; Data base user interface and query software; Program testing software; Object or component oriented development software; Web platform development software; Operating system software; Data base management system software; Configuration management software; Application server software; Enterprise resource planning ERP software; Analytical or scientific software; Graphics or photo imaging software; Enterprise application integration software; Data base reporting software; Project management software; Video conferencing software; Video creation and editing software; Transaction server software; Word processing software; Business intelligence and data analysis software; Transaction security and virus protection software; Electronic mail software; Internet browser software; Web page creation and editing software; Content workflow software; Document management software; Customer relationship management CRM software; Cloud-based data access and sharing software; Network security and virtual private network VPN equipment software; Graphical user interface development software; Computer aided design CAD software; Cloud-based management software; Requirements analysis and system architecture software; Spreadsheet software; Metadata management software; Geographic information system; Network monitoring software; Access software; Object oriented data base management software; Desktop publishing software; File versioning software; Office suite software; Instant messaging software; Financial analysis software; Backup or archival software; Presentation software; Storage networking software; Information retrieval or search software; Medical software; Filesystem software; Accounting software; Enterprise system management software; Expert system software; Network operation system software; Clustering software; Computer based training software; Desktop communications software; Communications server software; Portal server software; Network conferencing software; Administration software; Device drivers or system software; Human resources software; Internet protocol IP multimedia subsystem software; Platform interconnectivity software; Data mining software; Industrial control software; Process mapping and design software).
Row roll-up for qa vs 15-1253.00: spans matched 4 · rows carrying DIFFERS 1 · rows tagged [O*NET] with no O*NET-keyed claim (PRESENT-ONLY-IN-OURS) 0

## 3 · ba — Business Analyst (IT)

Track it · PSOC 2511 (Systems analysts) · O*NET anchor(s): none recorded in fixtures

**NO-OUR-ROW** — no O*NET-keyed row exists on this track to compare (skill-row source tags: PSF). No O*NET code derivable from the fixtures; nothing improvised.

## 4 · its — IT Support Engineer

Track it · PSOC 3512 (Information and communications technology user support technicians) · O*NET anchor(s): none recorded in fixtures

**NO-OUR-ROW** — no O*NET-keyed row exists on this track to compare (skill-row source tags: PSF). No O*NET code derivable from the fixtures; nothing improvised.

## 5 · sysadmin — Network / Systems Administrator

Track it · PSOC 2522 (Systems administrators) · O*NET anchor(s): none recorded in fixtures

**NO-OUR-ROW** — no O*NET-keyed row exists on this track to compare (skill-row source tags: PSF). No O*NET code derivable from the fixtures; nothing improvised.

## 6 · dba — Database Administrator

Track it · PSOC 2521 (Database designers and administrators) · O*NET anchor(s): none recorded in fixtures

**NO-OUR-ROW** — no O*NET-keyed row exists on this track to compare (skill-row source tags: PSF). No O*NET code derivable from the fixtures; nothing improvised.

## 7 · cybersec — Security Analyst

Track it · PSOC 2523 (Computer network professionals) · O*NET anchor(s): none recorded in fixtures

**NO-OUR-ROW** — no O*NET-keyed row exists on this track to compare (skill-row source tags: PSF). No O*NET code derivable from the fixtures; nothing improvised.

## 8 · webdev — Web Developer

Track it · PSOC 2513 (Web and multimedia developers) · O*NET anchor(s): 15-1254.00

### anchor 15-1254.00 — O*NET serves “Web Developers” (updated 2026)

- Title: catalog “Web Developer” vs O*NET “Web Developers” — **MATCH**
  - O*NET sample of reported titles (5): Technology Applications Engineer · Web Architect · Web Design Specialist · Web Developer · Webmaster
  - Served counts: tasks 29 · skills 35 · work activities 41 · technology categories 52 · Software-Skills source row: Employer Job Postings (2026)

| Client-side coding (HTML/CSS/JS) (core/O*NET) | “Write supporting code for Web applications or Web sites.” · fixture: flagged paraphrase | MATCH (exact) | task 14707 (importance 90) |
| Client-side coding (HTML/CSS/JS) (core/O*NET) | “Design, build, or maintain Web sites, using authoring or scripting languages, conten…” · fixture: flagged paraphrase | MATCH (exact) | task 14694 (importance 86) |
| Client-side coding (HTML/CSS/JS) (core/O*NET) | “Write computer programming code.” · fixture: flagged paraphrase | DIFFERS | not among the 29 served tasks; nearest “Write supporting code for Web applications or Web sites.” (overlap 50%) |
| Client-side coding (HTML/CSS/JS) (core/O*NET) | “Evaluate code to ensure that it is valid, is properly structured, meets industry sta…” · fixture: flagged paraphrase | MATCH (exact) | task 14700 (importance 77) |
| ↳ task-cluster sub-row: site life-operations (core/O*NET) | “Perform Web site tests according to planned schedules, or after any Web site or prod…” | MATCH (exact) | task 14710 (importance 76) |
| ↳ task-cluster sub-row: site life-operations (core/O*NET) | “Perform or direct Web site updates.” | MATCH (exact) | task 14695 (importance 75) |
| ↳ task-cluster sub-row: site life-operations (core/O*NET) | “Back up files from Web sites to local directories for instant recovery in case of pr…” | MATCH (exact) | task 14698 (importance 84) |
| ↳ task-cluster sub-row: site life-operations (core/O*NET) | “Renew domain name registrations.” | MATCH (exact) | task 14705 (importance 67) |
| ↳ task-cluster sub-row: site life-operations (core/O*NET) | “Update website content.” | DIFFERS | not among the 29 served tasks; nearest “Design, build, or maintain Web sites, using authoring or scripting languages, conten” (overlap 33%) |
| ↳ task-cluster sub-row: site life-operations (core/O*NET) | “Recommend and implement performance improvements.” | MATCH (exact) | task 14719 (importance 60) |
| CMS administration (WordPress etc.) (core/O*NET) | “Design, build, or maintain Web sites, using authoring or scripting languages, conten…” | MATCH (exact) | task 14694 (importance 86) |
| CMS administration (WordPress etc.) (core/O*NET) | “Update website content.” | DIFFERS | not among the 29 served tasks; nearest “Design, build, or maintain Web sites, using authoring or scripting languages, conten” (overlap 33%) |
| CMS administration (WordPress etc.) (core/O*NET) | “Analyze user needs to determine technical requirements.” | MATCH (exact) | task 14702 (importance 70) |
| Responsive/UI basics + accessibility (secondary/O*NET) | “Incorporate technical considerations into Web site design plans, such as budgets, eq…” | MATCH (exact) | task 21684 (importance undefined) |
| Responsive/UI basics + accessibility (secondary/O*NET) | “Design websites or web applications.” | DIFFERS | not among the 29 served tasks; nearest “Write supporting code for Web applications or Web sites.” (overlap 60%) |
| Version control (git) (secondary/O*NET) | “Evaluate code to ensure that it is valid, is properly structured, meets industry sta…” | MATCH (containment) | task 14700 (importance 77) |
| Version control (git) (secondary/O*NET) | “Recommend changes to improve computer or information systems.” | DIFFERS | not among the 29 served tasks; nearest “Evaluate code to ensure that it is valid, is properly structured, meets industry sta” (overlap 38%) |
| Agile Software Development (when agency-run) (secondary/PSF) | “Confer with management or development teams to prioritize needs, resolve conflicts, …” | MATCH (exact) | task 14697 (importance 65) |
| Agile Software Development (when agency-run) (secondary/PSF) | “Collaborate with others to resolve information technology issues.” | DIFFERS | not among the 29 served tasks; nearest “Confer with management or development teams to prioritize needs, resolve conflicts, ” (overlap 38%) |

- **Technology-skills presence** — O*NET serves 52 tech categories for 15-1254.00 (Web platform development software; Data base user interface and query software; Development environment software; Object or component oriented development software; Data base management system software; Operating system software; Application server software; Enterprise application integration software; Video creation and editing software; Web page creation and editing software; Graphics or photo imaging software; Enterprise resource planning ERP software; Business intelligence and data analysis software; Program testing software; Cloud-based management software; Configuration management software; Cloud-based data access and sharing software; Word processing software; Sales and marketing software; Analytical or scientific software; Geographic information system; Content workflow software; Network monitoring software; Object oriented data base management software; Document management software; Video conferencing software; Desktop publishing software; Customer relationship management CRM software; Transaction server software; Graphical user interface development software; Instant messaging software; Data base reporting software; Presentation software; Project management software; Process mapping and design software; Spreadsheet software; Metadata management software; Medical software; Electronic mail software; Enterprise system management software; Expert system software; Computer based training software; Desktop communications software; Communications server software; Portal server software; File versioning software; Office suite software; Financial analysis software; Transaction security and virus protection software; Data mining software; Requirements analysis and system architecture software; Storage networking software).
Row roll-up for webdev vs 15-1254.00: spans matched 0 · rows carrying DIFFERS 6 · rows tagged [O*NET] with no O*NET-keyed claim (PRESENT-ONLY-IN-OURS) 0

## 9 · digart — Digital / Multimedia Artist

Track it · PSOC 2166 (Graphic and multimedia designers) · O*NET anchor(s): none recorded in fixtures

**NO-OUR-ROW** — no O*NET-keyed row exists on this track to compare (skill-row source tags: TESDA, NACE, PSF). No O*NET code derivable from the fixtures; nothing improvised.

## 10 · da — Data Analyst (junior)

Track it · PSOC 3314 (Statistical, mathematical and related associate professionals) · O*NET anchor(s): none recorded in fixtures

**NO-OUR-ROW** — no O*NET-keyed row exists on this track to compare (skill-row source tags: PSF). No O*NET code derivable from the fixtures; nothing improvised.

## 11 · soc — SOC Analyst

Track it · PSOC 2523 (Computer network professionals) · O*NET anchor(s): 15-1212.00

### anchor 15-1212.00 — O*NET serves “Information Security Analysts” (updated 2026)

- Title: catalog “SOC Analyst” vs O*NET “Information Security Analysts” — **DIFFERS** (catalog display names are the blessed display-label layer; recorded, not judged).
  - O*NET sample of reported titles (8): Information Security Officer · Information Security Specialist · Information Systems Security Analyst · Information Systems Security Officer (ISSO) · Information Technology Security Analyst (IT Security Analyst) · Network Security Analyst · Security Analyst · Systems Analyst
  - Served counts: tasks 11 · skills 35 · work activities 41 · technology categories 59 · Software-Skills source row: Employer Job Postings (2026)

| Threat Analysis and Defence · Threat Intelligence and Detection (family  (secondary/PSF) | “Monitor current reports of computer viruses to determine when to update virus protec…” | MATCH (exact) | task 5316 (importance 81) |
| Collaboration · Communication · Problem Solving · Digital Fluency (Enabl (secondary/PSF) | WA quote “Monitoring Processes, Materials, or Surroundings — Monitoring and reviewing informat” | MATCH | “Monitoring Processes, Materials, or Surroundings” (importance 73) |
| Collaboration · Communication · Problem Solving · Digital Fluency (Enabl (secondary/PSF) | WA quote “Communicating with Supervisors, Peers, or Subordinates” | MATCH | “Communicating with Supervisors, Peers, or Subordinates” (importance 75) |
| Collaboration · Communication · Problem Solving · Digital Fluency (Enabl (secondary/PSF) | WA quote “Documenting/Recording Information” | MATCH | “Documenting/Recording Information” (importance 76) |

- **Technology-skills presence** — O*NET serves 59 tech categories for 15-1212.00 (Web platform development software; Data base user interface and query software; Transaction security and virus protection software; Network monitoring software; Development environment software; Operating system software; Data base management system software; Object or component oriented development software; Network security and virtual private network VPN equipment software; Network security or virtual private network VPN management software; Business intelligence and data analysis software; Enterprise resource planning ERP software; Configuration management software; Internet directory services software; Application server software; Program testing software; Authentication server software; Enterprise application integration software; Access software; File versioning software; Backup or archival software; Cloud-based management software; Project management software; Geographic information system; Risk management data and analysis software; Electronic mail software; Word processing software; Financial analysis software; Data base reporting software; Analytical or scientific software; Spreadsheet software; Medical software; Filesystem software; Content workflow software; Enterprise system management software; Object oriented data base management software; Expert system software; Point of sale POS software; Document management software; Clustering software; Desktop communications software; Communications server software; Portal server software; Customer relationship management CRM software; Transaction server software; Office suite software; Instant messaging software; Administration software; Human resources software; Internet protocol IP multimedia subsystem software; Presentation software; Cloud-based protection or security software; Web page creation and editing software; Requirements analysis and system architecture software; Storage networking software; Industrial control software; Switch or router software; Process mapping and design software; Information retrieval or search software).
Row roll-up for soc vs 15-1212.00: spans matched 2 · rows carrying DIFFERS 0 · rows tagged [O*NET] with no O*NET-keyed claim (PRESENT-ONLY-IN-OURS) 0

---
# Track · Business & Management (roster 3.1–3.9)

## 12 · hra — HR Assistant

Track business · PSOC 4416 (Personnel clerks — human resource assistant) · O*NET anchor(s): none recorded in fixtures

**NO-OUR-ROW** — no O*NET-keyed row exists on this track to compare (skill-row source tags: PSF). No O*NET code derivable from the fixtures; nothing improvised.

## 13 · training — Training Coordinator

Track business · PSOC 2424 (Training and staff development professionals) · O*NET anchor(s): none recorded in fixtures

**NO-OUR-ROW** — no O*NET-keyed row exists on this track to compare (skill-row source tags: PSF). No O*NET code derivable from the fixtures; nothing improvised.

## 14 · mkt — Marketing Assistant

Track business · PSOC 2431 (Advertising and marketing professionals) · O*NET anchor(s): none recorded in fixtures

**NO-OUR-ROW** — no O*NET-keyed row exists on this track to compare (skill-row source tags: PSF). No O*NET code derivable from the fixtures; nothing improvised.

## 15 · sales — Sales Executive

Track business · PSOC 3322 (Commercial sales representatives) · O*NET anchor(s): none recorded in fixtures

**NO-OUR-ROW** — no O*NET-keyed row exists on this track to compare (skill-row source tags: PSF). No O*NET code derivable from the fixtures; nothing improvised.

## 16 · csr — Customer Service Representative

Track business · PSOC 4222 (Contact centre information clerks — customer service assistant/representative) · O*NET anchor(s): none recorded in fixtures

**NO-OUR-ROW** — no O*NET-keyed row exists on this track to compare (skill-row source tags: TESDA, PSF). No O*NET code derivable from the fixtures; nothing improvised.

## 17 · opsanalyst — Operations Analyst

Track business · PSOC 2421 (Management and organization analysts) · O*NET anchor(s): 13-1111.00

### anchor 13-1111.00 — O*NET serves “Management Analysts” (updated 2026)

- Title: catalog “Operations Analyst” vs O*NET “Management Analysts” — **DIFFERS** (catalog display names are the blessed display-label layer; recorded, not judged).
  - O*NET sample of reported titles (9): Administrative Analyst · Business Analyst · Business Consultant · Employment Programs Analyst · Management Analyst · Management Consultant · Organizational Development Consultant · Performance Management Analyst · Program Management Analyst
  - Served counts: tasks 11 · skills 35 · work activities 41 · technology categories 59 · Software-Skills source row: Employer Job Postings (2026)

| Process study planning (scoping the study of work problems) (core/O*NET) | “Plan study of work problems and procedures, such as organizational change, communica…” | MATCH (exact) | task 7285 (importance 78) |
| Information gathering & organizing (core/O*NET) | “Gather and organize information on problems or procedures.” | MATCH (exact) | task 7276 (importance 87) |
| On-site observation & interviewing (core/O*NET) | “Interview personnel and conduct on-site observation to ascertain unit functions, wor…” | MATCH (exact) | task 7281 (importance 78) |
| Data analysis & solution framing (core/O*NET) | “Analyze data gathered and develop solutions or alternative methods of proceeding.” | MATCH (exact) | task 7277 (importance 86) |
| Findings documentation & recommendation write-ups (core/O*NET) | “Document findings of study and prepare recommendations for implementation of new sys…” | MATCH (exact) | task 7282 (importance 81) |
| Implementation support & training of revised methods (secondary/O*NET) | “Prepare manuals and train workers in use of new forms, reports, procedures or equipm…” | MATCH (exact) | task 7283 (importance 71) |
| Implementation support & training of revised methods (secondary/O*NET) | “Confer with personnel concerned to ensure successful functioning of newly implemente…” | MATCH (exact) | task 7278 (importance 87) |
| Forms/reports review & redesign (secondary/O*NET) | “Review forms and reports and confer with management and users about format, distribu…” | MATCH (exact) | task 7280 (importance 69) |
| Forms/reports review & redesign (secondary/O*NET) | “Design, evaluate, recommend, and approve changes of forms and reports.” | MATCH (exact) | task 7284 (importance 55) |
| Records-management program design (secondary/O*NET) | “Develop and implement records management program for filing, protection, and retriev…” | MATCH (exact) | task 7279 (importance 65) |
| Communication · Critical Thinking · Teamwork (Enabling) (secondary/NACE) | WA quote “Getting Information — Observing, receiving, and otherwise obtaining information from” | MATCH | “Getting Information” (importance 93) |
| Communication · Critical Thinking · Teamwork (Enabling) (secondary/NACE) | WA quote “Communicating with Supervisors, Peers, or Subordinates — Providing information to su” | MATCH | “Communicating with Supervisors, Peers, or Subordinates” (importance 91) |
| Communication · Critical Thinking · Teamwork (Enabling) (secondary/NACE) | WA quote “Establishing and Maintaining Interpersonal Relationships — Developing constructive a” | MATCH | “Establishing and Maintaining Interpersonal Relationships” (importance 91) |

- **Technology-skills presence** — O*NET serves 59 tech categories for 13-1111.00 (Web platform development software; Data base user interface and query software; Development environment software; Enterprise resource planning ERP software; Object or component oriented development software; Operating system software; Data base management system software; Business intelligence and data analysis software; Medical software; Analytical or scientific software; Project management software; Electronic mail software; Enterprise application integration software; Word processing software; Human resources software; Configuration management software; Accounting software; Application server software; Video conferencing software; Customer relationship management CRM software; Data base reporting software; Presentation software; Program testing software; Geographic information system; Network monitoring software; Object oriented data base management software; Graphics or photo imaging software; Document management software; Desktop communications software; Desktop publishing software; File versioning software; Cloud-based data access and sharing software; Financial analysis software; Transaction security and virus protection software; Cloud-based management software; Web page creation and editing software; Requirements analysis and system architecture software; Spreadsheet software; Metadata management software; Content workflow software; Enterprise system management software; Access software; Expert system software; Clustering software; Communications server software; Portal server software; Video creation and editing software; Network conferencing software; Transaction server software; Office suite software; Network security and virtual private network VPN equipment software; Graphical user interface development software; Sales and marketing software; Internet browser software; Backup or archival software; Data mining software; Industrial control software; Process mapping and design software; Information retrieval or search software).
Row roll-up for opsanalyst vs 13-1111.00: spans matched 9 · rows carrying DIFFERS 0 · rows tagged [O*NET] with no O*NET-keyed claim (PRESENT-ONLY-IN-OURS) 0

## 18 · purch — Purchasing Officer

Track business · PSOC 3323 (Buyers — procurement officer / purchasing agent) · O*NET anchor(s): 13-1023.00

### anchor 13-1023.00 — O*NET serves “Purchasing Agents, Except Wholesale, Retail, and Farm Products” (updated 2026)

- Title: catalog “Purchasing Officer” vs O*NET “Purchasing Agents, Except Wholesale, Retail, and Farm Products” — **DIFFERS** (catalog display names are the blessed display-label layer; recorded, not judged).
  - O*NET sample of reported titles (9): Buyer · Contract Administrator (Contract Admin) · Procurement and Contracting Administrator (Procurement and Contracting Admin) · Procurement and Contracting Buyer · Procurement Official · Procurement Specialist · Purchasing Administrator (Purchasing Admin) · Purchasing Agent · Purchasing and Contracts Coordinator
  - Served counts: tasks 19 · skills 35 · work activities 41 · technology categories 20 · Software-Skills source row: Multiple sources (2025)

| Purchase order issuance & requisition review (core/O*NET) | “Prepare purchase orders, solicit bid proposals, and review requisitions for goods an…” | MATCH (exact) | task 1143 (importance 85) |
| Price-proposal analysis (core/O*NET) | “Analyze price proposals, financial reports, and other data and information to determ…” | MATCH (exact) | task 1145 (importance 80) |
| Best-value purchasing (quality/price/amount) (core/O*NET) | “Purchase the highest quality merchandise at the lowest possible price and in correct…” | MATCH (exact) | task 1142 (importance 89) |
| Legal & policy compliance (procurement rules) (core/O*NET) | “Monitor and follow applicable laws and regulations.” | MATCH (exact) | task 1146 (importance 96) |
| Supplier research & evaluation (secondary/O*NET) | “Research and evaluate suppliers, based on price, quality, selection, service, suppor…” | MATCH (exact) | task 1144 (importance 79) |
| Contract performance monitoring (secondary/O*NET) | “Evaluate and monitor contract performance to ensure compliance with contractual obli…” | MATCH (exact) | task 1150 (importance 76) |
| Contract performance monitoring (secondary/O*NET) | “Negotiate, renegotiate, and administer contracts with suppliers, vendors, and other …” | MATCH (exact) | task 1147 (importance 76) |
| Product specification writing (secondary/O*NET) | “Write and review product specifications, maintaining a working technical knowledge o…” | MATCH (exact) | task 1157 (importance 81) |
| Records & shipment monitoring (secondary/O*NET) | “Maintain and review computerized or manual records of purchased items, costs, delive…” | MATCH (exact) | task 1151 (importance 69) |
| Records & shipment monitoring (secondary/O*NET) | “Monitor shipments to ensure that goods come in on time, and resolve problems related…” | MATCH (exact) | task 1148 (importance 65) |
| Market watching (supply/demand, price trends) (secondary/O*NET) | “Monitor changes affecting supply and demand, tracking market conditions, price trend…” | MATCH (exact) | task 1158 (importance 67) |
| Communication · Critical Thinking · Ethics/Professionalism (Enabling) (secondary/NACE) | WA quote “Communicating with People Outside the Organization — Communicating with people outsi” | MATCH | “Communicating with People Outside the Organization” (importance 87) |
| Communication · Critical Thinking · Ethics/Professionalism (Enabling) (secondary/NACE) | WA quote “Evaluating Information to Determine Compliance with Standards — Using relevant infor” | MATCH | “Evaluating Information to Determine Compliance with Standards” (importance 76) |

- **Technology-skills presence** — O*NET serves 20 tech categories for 13-1023.00 (Enterprise resource planning ERP software; Word processing software; Data base user interface and query software; Financial analysis software; Spreadsheet software; Accounting software; Analytical or scientific software; Project management software; Data base reporting software; Electronic mail software; Document management software; Business intelligence and data analysis software; Enterprise system management software; Graphics or photo imaging software; Office suite software; Sales and marketing software; Internet browser software; Presentation software; Inventory management software; Process mapping and design software).
Row roll-up for purch vs 13-1023.00: spans matched 10 · rows carrying DIFFERS 0 · rows tagged [O*NET] with no O*NET-keyed claim (PRESENT-ONLY-IN-OURS) 0

## 19 · ccqa — Quality Analyst (Contact Center)

Track business · PSOC 4222 (Contact centre information clerks (service-quality work)) · O*NET anchor(s): none recorded in fixtures

**NO-OUR-ROW** — no O*NET-keyed row exists on this track to compare (skill-row source tags: PSF). No O*NET code derivable from the fixtures; nothing improvised.

## 20 · events — Events / Conference Coordinator

Track business · PSOC 3332 (Conference and event planners) · O*NET anchor(s): 13-1121.00

### anchor 13-1121.00 — O*NET serves “Meeting, Convention, and Event Planners” (updated 2026)

- Title: catalog “Events / Conference Coordinator” vs O*NET “Meeting, Convention, and Event Planners” — **DIFFERS** (catalog display names are the blessed display-label layer; recorded, not judged).
  - O*NET sample of reported titles (10): Catering Director · Conference Planner · Conference Planning Manager · Conference Services Director · Conference Services Manager · Convention Services Director · Convention Services Manager (CSM) · Event Coordinator · Events Manager · Special Events Coordinator
  - Served counts: tasks 21 · skills 35 · work activities 41 · technology categories 21 · Software-Skills source row: Employer Job Postings (2026)

| Client objectives & requirements determination (core/O*NET) | “Consult with customers to determine objectives and requirements for events, such as …” | MATCH (exact) | task 1209 (importance 90) |
| Event services coordination (core/O*NET) | “Coordinate services for events, such as accommodation and transportation for partici…” | MATCH (exact) | task 1214 (importance 85) |
| Provider evaluation & selection; contract negotiation (core/O*NET) | “Evaluate and select providers of services according to customer requirements.” | MATCH (exact) | task 1222 (importance 77) |
| Provider evaluation & selection; contract negotiation (core/O*NET) | “Negotiate contracts with such service providers and suppliers as hotels, convention …” | MATCH (exact) | task 1219 (importance 77) |
| Facility inspection & conformity (core/O*NET) | “Inspect event facilities to ensure that they conform to customer requirements.” | MATCH (exact) | task 1216 (importance 83) |
| Program, agenda, budget & services planning (core/O*NET) | “Plan and develop programs, agendas, budgets, and services according to customer requ…” | MATCH (exact) | task 1213 (importance 76) |
| Program, agenda, budget & services planning (core/O*NET) | “Meet with sponsors and organizing committees to plan scope and format of events, to …” | MATCH (exact) | task 1220 (importance 69) |
| Participant registration (core/O*NET) | “Organize registration of event participants.” | MATCH (exact) | task 1224 (importance 70) |
| Event-records keeping (incl. financials) (core/O*NET) | “Maintain records of event aspects, including financial details.” | MATCH (exact) | task 1217 (importance 82) |
| Event-records keeping (incl. financials) (core/O*NET) | “Verify accuracy of records.” | DIFFERS | not among the 21 served tasks; nearest “Maintain records of event aspects, including financial details.” (overlap 50%) |
| Event monitoring, compliance & problem resolution (core/O*NET) | “Monitor event activities to ensure compliance with applicable regulations and laws, …” | MATCH (exact) | task 1210 (importance 79) |
| Event monitoring, compliance & problem resolution (core/O*NET) | “Obtain permits from fire and health departments to erect displays and exhibits and s…” | MATCH (exact) | task 1227 (importance 51) |
| Bills review & payment approval (secondary/O*NET) | “Review event bills for accuracy and approve payment.” | MATCH (exact) | task 1212 (importance 89) |
| Bills review & payment approval (secondary/O*NET) | “Authorize financial actions.” | DIFFERS | not among the 21 served tasks; nearest “Maintain records of event aspects, including financial details.” (overlap 33%) |
| Post-event evaluation (secondary/O*NET) | “Conduct post-event evaluations to determine how future events could be improved.” | MATCH (exact) | task 1218 (importance 75) |
| Marketing & publicizing support (secondary/O*NET) | “Promote conference, convention and trades show services by performing tasks such as …” | MATCH (exact) | task 1228 (importance 64) |
| Administrative details & inquiries (secondary/O*NET) | “Direct administrative details, such as financial operations, dissemination of promot…” | MATCH (exact) | task 1221 (importance 71) |
| Administrative details & inquiries (secondary/O*NET) | “Correspond with customers to answer questions or resolve complaints.” | DIFFERS | not among the 21 served tasks; nearest “Consult with customers to determine objectives and requirements for events, such as ” (overlap 33%) |
| Communication · Professionalism · Teamwork (Enabling) (secondary/NACE) | WA quote “Performing for or Working Directly with the Public — Performing for people or dealin” | MATCH | “Performing for or Working Directly with the Public” (importance 84) |
| Communication · Professionalism · Teamwork (Enabling) (secondary/NACE) | WA quote “Scheduling Work and Activities — Scheduling events, programs, and activities, as wel” | MATCH | “Scheduling Work and Activities” (importance 84) |
| Communication · Professionalism · Teamwork (Enabling) (secondary/NACE) | WA quote “Communicating with People Outside the Organization — Communicating with people outsi” | MATCH | “Communicating with People Outside the Organization” (importance 87) |

- **Technology-skills presence** — O*NET serves 21 tech categories for 13-1121.00 (Project management software; Word processing software; Data base user interface and query software; Graphics or photo imaging software; Customer relationship management CRM software; Web page creation and editing software; Geographic information system; Electronic mail software; Desktop publishing software; Financial analysis software; Presentation software; Spreadsheet software; Video conferencing software; Desktop communications software; Network conferencing software; Facilities management software; Office suite software; Cloud-based data access and sharing software; Sales and marketing software; Internet browser software; Web platform development software).
Row roll-up for events vs 13-1121.00: spans matched 10 · rows carrying DIFFERS 3 · rows tagged [O*NET] with no O*NET-keyed claim (PRESENT-ONLY-IN-OURS) 0

---
# Track · Accounting & Finance (roster 4.1–4.10)

## 21 · book — Bookkeeper

Track accounting · PSOC 3313 (Accounting associate professionals — bookkeeper) · O*NET anchor(s): 43-3031.00

### anchor 43-3031.00 — O*NET serves “Bookkeeping, Accounting, and Auditing Clerks” (updated 2026)

- Title: catalog “Bookkeeper” vs O*NET “Bookkeeping, Accounting, and Auditing Clerks” — **DIFFERS** (catalog display names are the blessed display-label layer; recorded, not judged).
  - O*NET sample of reported titles (10): Account Clerk · Accounting Assistant · Accounting Associate · Accounting Clerk · Accounting Specialist · Accounting Technician · Accounts Payable Clerk · Accounts Payable Specialist · Accounts Payables Clerk · Accounts Receivable Clerk
  - Served counts: tasks 28 · skills 35 · work activities 41 · technology categories 28 · Software-Skills source row: Employer Job Postings (2026)

| Journalize transactions (core/TESDA) | “Classify, record, and summarize numerical and financial data to compile and keep fin…” | MATCH (exact) | task 2490 (importance 79) |
| Post transactions (core/TESDA) | “Transfer details from separate journals to general ledgers or data processing sheets…” | MATCH (exact) | task 2506 (importance 80) |
| Post transactions (core/TESDA) | “Compare computer printouts to manually maintained journals to determine if they matc…” | MATCH (exact) | task 2502 (importance 81) |
| Prepare trial balance (core/TESDA) | “Prepare trial balances of books.” | MATCH (exact) | task 2504 (importance 77) |
| Prepare financial reports (manual) (core/TESDA) | “Calculate, prepare, and issue bills, invoices, account statements, and other financi…” | MATCH (exact) | task 2491 (importance 79) |
| Prepare financial reports (manual) (core/TESDA) | “Compile statistical, financial, accounting, or auditing reports and tables pertainin…” | MATCH (exact) | task 2492 (importance 74) |
| Review internal control system (secondary/TESDA) | “Comply with federal, state, and company policies, procedures, and regulations.” | MATCH (exact) | task 2488 (importance 89) |
| Verify and record financial documents & records (secondary/O*NET) | “Check figures, postings, and documents for correct entry, mathematical accuracy, and…” | MATCH (exact) | task 2486 (importance 92) |
| Verify and record financial documents & records (secondary/O*NET) | “Reconcile or note and report discrepancies found in records.” | MATCH (exact) | task 2496 (importance 82) |
| Verify and record financial documents & records (secondary/O*NET) | “Receive, record, and bank cash, checks, and vouchers.” | MATCH (exact) | task 2500 (importance 87) |
| Operate accounting software (secondary/O*NET) | “Operate computers programmed with accounting software to record, store, and analyze …” | MATCH (exact) | task 2487 (importance 94) |
| Operate accounting software (secondary/O*NET) | “Debit, credit, and total accounts on computer spreadsheets and databases, using spec…” | MATCH (exact) | task 2489 (importance 79) |

- **Technology-skills presence** — O*NET serves 28 tech categories for 43-3031.00 (Accounting software; Cloud-based data access and sharing software; Enterprise resource planning ERP software; Financial analysis software; Data base user interface and query software; Compliance software; Document management software; Medical software; Time accounting software; Project management software; Electronic mail software; Customer relationship management CRM software; Transaction server software; Word processing software; Human resources software; Billing and invoicing software; Spreadsheet software; Video conferencing software; Desktop communications software; Desktop publishing software; Enterprise application integration software; Office suite software; Operating system software; Business intelligence and data analysis software; Data base reporting software; Internet browser software; Presentation software; Information retrieval or search software).
Row roll-up for book vs 43-3031.00: spans matched 7 · rows carrying DIFFERS 0 · rows tagged [O*NET] with no O*NET-keyed claim (PRESENT-ONLY-IN-OURS) 0

## 22 · acctclerk — Accounting Clerk

Track accounting · PSOC 4311 (Accounting and bookkeeping clerks) · O*NET anchor(s): 43-3031.00

### anchor 43-3031.00 — O*NET serves “Bookkeeping, Accounting, and Auditing Clerks” (updated 2026)

- Title: catalog “Accounting Clerk” vs O*NET “Bookkeeping, Accounting, and Auditing Clerks” — **DIFFERS** (catalog display names are the blessed display-label layer; recorded, not judged).
  - O*NET sample of reported titles (10): Account Clerk · Accounting Assistant · Accounting Associate · Accounting Clerk · Accounting Specialist · Accounting Technician · Accounts Payable Clerk · Accounts Payable Specialist · Accounts Payables Clerk · Accounts Receivable Clerk
  - Served counts: tasks 28 · skills 35 · work activities 41 · technology categories 28 · Software-Skills source row: Employer Job Postings (2026)

| Check figures, postings, and documents for correct entry, mathematical a (core/O*NET) | “Check figures, postings, and documents for correct entry, mathematical accuracy, and…” | MATCH (exact) | task 2486 (importance 92) |
| Check figures, postings, and documents for correct entry, mathematical a (core/O*NET) | “Match order forms with invoices, and record the necessary information.” | MATCH (exact) | task 2509 (importance 78) |
| Check figures, postings, and documents for correct entry, mathematical a (core/O*NET) | “Code documents according to company procedures.” | MATCH (exact) | task 2493 (importance 83) |
| Operate computers programmed with accounting software (core/O*NET) | “Operate computers programmed with accounting software to record, store, and analyze …” | MATCH (exact) | task 2487 (importance 94) |
| Operate computers programmed with accounting software (core/O*NET) | “Debit, credit, and total accounts on computer spreadsheets and databases, using spec…” | MATCH (exact) | task 2489 (importance 79) |
| Operate computers programmed with accounting software (core/O*NET) | “Operate 10-key calculators, typewriters, and copy machines to perform calculations a…” | MATCH (exact) | task 2495 (importance 87) |
| Classify, record, and summarize numerical and financial data to compile and keep financi (core/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 2490 (importance 79) |
| Reconcile or note and report discrepancies found in records (core/O*NET) | “Reconcile or note and report discrepancies found in records.” | MATCH (exact) | task 2496 (importance 82) |
| Reconcile or note and report discrepancies found in records (core/O*NET) | “Reconcile records of bank transactions.” | MATCH (exact) | task 2503 (importance 85) |
| Prepare and issue account statements / bills / invoices (core/O*NET) | “Calculate, prepare, and issue bills, invoices, account statements, and other financi…” | MATCH (exact) | task 2491 (importance 79) |
| Receive, record, and bank cash, checks, and vouchers (petty cash / colle (secondary/O*NET) | “Receive, record, and bank cash, checks, and vouchers.” | MATCH (exact) | task 2500 (importance 87) |
| Receive, record, and bank cash, checks, and vouchers (petty cash / colle (secondary/O*NET) | “Prepare bank deposits by compiling data from cashiers, verifying and balancing recei…” | MATCH (exact) | task 2499 (importance 90) |
| Government forms & compliance paperwork (secondary/O*NET) | “Complete and submit tax forms and returns, workers' compensation forms, pension cont…” | MATCH (exact) | task 2510 (importance 79) |
| Government forms & compliance paperwork (secondary/O*NET) | “Comply with federal, state, and company policies, procedures, and regulations.” | MATCH (exact) | task 2488 (importance 89) |

- **Technology-skills presence** — O*NET serves 28 tech categories for 43-3031.00 (Accounting software; Cloud-based data access and sharing software; Enterprise resource planning ERP software; Financial analysis software; Data base user interface and query software; Compliance software; Document management software; Medical software; Time accounting software; Project management software; Electronic mail software; Customer relationship management CRM software; Transaction server software; Word processing software; Human resources software; Billing and invoicing software; Spreadsheet software; Video conferencing software; Desktop communications software; Desktop publishing software; Enterprise application integration software; Office suite software; Operating system software; Business intelligence and data analysis software; Data base reporting software; Internet browser software; Presentation software; Information retrieval or search software).
Row roll-up for acctclerk vs 43-3031.00: spans matched 7 · rows carrying DIFFERS 0 · rows tagged [O*NET] with no O*NET-keyed claim (PRESENT-ONLY-IN-OURS) 0

## 23 · pay — Payroll Assistant

Track accounting · PSOC 4313 (Payroll clerks) · O*NET anchor(s): 43-3051.00

### anchor 43-3051.00 — O*NET serves “Payroll and Timekeeping Clerks” (updated 2026)

- Title: catalog “Payroll Assistant” vs O*NET “Payroll and Timekeeping Clerks” — **DIFFERS** (catalog display names are the blessed display-label layer; recorded, not judged).
  - O*NET sample of reported titles (9): Payroll Assistant · Payroll Clerk · Payroll Coordinator · Payroll Representative · Payroll Specialist · Payroll Technician · Personnel Assistant · Personnel Technician · Timekeeper
  - Served counts: tasks 21 · skills 35 · work activities 41 · technology categories 15 · Software-Skills source row: Employer Job Postings (2026)

| Verify attendance, hours worked, and pay adjustments, and post information onto designat (core/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 2519 (importance 94) |
| Compute wages and deductions, and enter data into computers (core/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 2516 (importance 92) |
| Compute wages and deductions, and enter data into computers (core/O*NET) | “Record employee information, such as exemptions, transfers, and resignations, to mai…” | MATCH (exact) | task 2520 (importance 89) |
| Prepare and balance period-end reports, and reconcile issued payrolls to bank statements (core/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 2528 (importance 91) |
| Process and issue employee paychecks and statements of earnings and deductions (core/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 2515 (importance 93) |
| Prepare and file payroll tax returns / statutory paperwork (secondary/O*NET) | “Prepare and file payroll tax returns.” | MATCH (exact) | task 23954 (importance 92) |
| Prepare and file payroll tax returns / statutory paperwork (secondary/O*NET) | “Complete, verify, and process forms and documentation for administration of benefits…” | MATCH (exact) | task 2527 (importance 77) |
| Prepare and file payroll tax returns / statutory paperwork (secondary/O*NET) | “Keep informed about changes in tax and deduction laws that apply to the payroll proc…” | MATCH (exact) | task 2522 (importance 82) |
| Provide information to employees and managers on payroll matters, tax issues, benefit pl (secondary/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 2523 (importance 75) |
| Keep leave records (secondary/O*NET) | “Keep track of leave time, such as vacation, personal, and sick leave, for employees.” | MATCH (exact) | task 18563 (importance 86) |
| Keep leave records (secondary/O*NET) | “Compile employee time, production, and payroll data from time sheets and other recor…” | MATCH (exact) | task 2517 (importance 84) |

- **Technology-skills presence** — O*NET serves 15 tech categories for 43-3051.00 (Time accounting software; Presentation software; Enterprise resource planning ERP software; Accounting software; Human resources software; Electronic mail software; Data base user interface and query software; Internet browser software; Spreadsheet software; Office suite software; Word processing software; Financial analysis software; Business intelligence and data analysis software; Data base reporting software; Compliance software).
Row roll-up for pay vs 43-3051.00: spans matched 7 · rows carrying DIFFERS 0 · rows tagged [O*NET] with no O*NET-keyed claim (PRESENT-ONLY-IN-OURS) 0

## 24 · fas — Finance & Accounting Associate

Track accounting · PSOC 3313 (Accounting associate professionals — BPS F&A officer) · O*NET anchor(s): 43-3031.00

### anchor 43-3031.00 — O*NET serves “Bookkeeping, Accounting, and Auditing Clerks” (updated 2026)

- Title: catalog “Finance & Accounting Associate” vs O*NET “Bookkeeping, Accounting, and Auditing Clerks” — **DIFFERS** (catalog display names are the blessed display-label layer; recorded, not judged).
  - O*NET sample of reported titles (10): Account Clerk · Accounting Assistant · Accounting Associate · Accounting Clerk · Accounting Specialist · Accounting Technician · Accounts Payable Clerk · Accounts Payable Specialist · Accounts Payables Clerk · Accounts Receivable Clerk
  - Served counts: tasks 28 · skills 35 · work activities 41 · technology categories 28 · Software-Skills source row: Employer Job Postings (2026)

| O*NET corroboration block (operating-the-GL-engine tasks) (secondary/O*NET) | “Classify, record, and summarize numerical and financial data to compile and keep fin…” | MATCH (exact) | task 2490 (importance 79) |
| O*NET corroboration block (operating-the-GL-engine tasks) (secondary/O*NET) | “Reconcile or note and report discrepancies found in records.” | MATCH (exact) | task 2496 (importance 82) |
| O*NET corroboration block (operating-the-GL-engine tasks) (secondary/O*NET) | “Compile budget data and documents, based on estimated revenues and expenses and prev…” | MATCH (exact) | task 2507 (importance 83) |
| O*NET corroboration block (operating-the-GL-engine tasks) (secondary/O*NET) | “Transfer details from separate journals to general ledgers or data processing sheets…” | MATCH (exact) | task 2506 (importance 80) |

- **Technology-skills presence** — O*NET serves 28 tech categories for 43-3031.00 (Accounting software; Cloud-based data access and sharing software; Enterprise resource planning ERP software; Financial analysis software; Data base user interface and query software; Compliance software; Document management software; Medical software; Time accounting software; Project management software; Electronic mail software; Customer relationship management CRM software; Transaction server software; Word processing software; Human resources software; Billing and invoicing software; Spreadsheet software; Video conferencing software; Desktop communications software; Desktop publishing software; Enterprise application integration software; Office suite software; Operating system software; Business intelligence and data analysis software; Data base reporting software; Internet browser software; Presentation software; Information retrieval or search software).
Row roll-up for fas vs 43-3031.00: spans matched 1 · rows carrying DIFFERS 0 · rows tagged [O*NET] with no O*NET-keyed claim (PRESENT-ONLY-IN-OURS) 0

## 25 · fin — Financial Analyst

Track accounting · PSOC 2413 (Financial analysts) · O*NET anchor(s): 13-2051.00

### anchor 13-2051.00 — O*NET serves “Financial and Investment Analysts” (updated 2026)

- Title: catalog “Financial Analyst” vs O*NET “Financial and Investment Analysts” — **DIFFERS** (catalog display names are the blessed display-label layer; recorded, not judged).
  - O*NET sample of reported titles (10): Analyst · Credit Products Officer · Equity Research Analyst · Financial Analyst · Investment Analyst · Planning Analyst · Portfolio Manager · Real Estate Analyst · Securities Analyst · Trust Officer
  - Served counts: tasks 26 · skills 0 · work activities 0 · technology categories 27 · Software-Skills source row: Multiple sources (2025)
  - **API-side gap:** skills and/or work-activities lists serve total 0 for this code at this pin.

| Analyze financial information to forecast business, industry, or economi (core/O*NET) | “Inform investment decisions by analyzing financial information to forecast business,…” | MATCH (exact) | task 21593 (importance undefined) |
| Monitor economic, industrial, and corporate developments (core/O*NET) | “Monitor fundamental economic, industrial, and corporate developments by analyzing in…” | MATCH (exact) | task 21596 (importance undefined) |
| Monitor economic, industrial, and corporate developments (core/O*NET) | “Monitor developments in the fields of industrial technology, business, finance, and …” | MATCH (exact) | task 21595 (importance undefined) |
| Employ financial models to develop solutions or assess the financial or capital impact o (core/O*NET) | anchor declares “task as printed” → row name is the claim | DIFFERS | not among the 26 served tasks; nearest “Employ financial models to develop solutions to financial problems or to assess the ” (overlap 100%) |
| Interpret data on price, yield, stability, future investment-risk trends, economic influ (core/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (containment) | task 21594 (importance undefined) |
| Recommend investments and investment timing (core/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (containment) | task 21602 (importance undefined) |
| Present oral or written reports on general economic trends, individual corporations, and (core/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 21600 (importance undefined) |
| Present oral or written reports on general economic trends, individual c (core/O*NET) | “Create client presentations of plan details.” | MATCH (exact) | task 21586 (importance undefined) |
| Draw charts and graphs, using computer spreadsheets, to illustrate technical reports (secondary/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 21589 (importance undefined) |
| Advise clients on aspects of capitalization, such as amounts, sources, or timing (secondary/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 21579 (importance undefined) |
| Supervise, train, or mentor junior team members (secondary/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 21604 (importance undefined) |

- **Technology-skills presence** — O*NET serves 27 tech categories for 13-2051.00 (Analytical or scientific software; Word processing software; Financial analysis software; Enterprise resource planning ERP software; Business intelligence and data analysis software; Data base user interface and query software; Information retrieval or search software; Spreadsheet software; Electronic mail software; Accounting software; Presentation software; Expert system software; Data base management system software; Data base reporting software; Document management software; Development environment software; Charting software; Human resources software; Project management software; Configuration management software; Enterprise system management software; Customer relationship management CRM software; Office suite software; Sales and marketing software; Object or component oriented development software; Internet browser software; Process mapping and design software).
Row roll-up for fin vs 13-2051.00: spans matched 8 · rows carrying DIFFERS 1 · rows tagged [O*NET] with no O*NET-keyed claim (PRESENT-ONLY-IN-OURS) 0

## 26 · treasury — Treasury Assistant

Track accounting · PSOC 4312 (Statistical, finance and insurance clerks — treasury clerk) · O*NET anchor(s): 43-3071.00

### anchor 43-3071.00 — O*NET serves “Tellers” (updated 2026)

- Title: catalog “Treasury Assistant” vs O*NET “Tellers” — **DIFFERS** (catalog display names are the blessed display-label layer; recorded, not judged).
  - O*NET sample of reported titles (10): Account Representative · Bank Teller · Branch Operations Specialist · Customer Relationship Specialist · Customer Service Associate (CSA) · Financial Services Representative (FSR) · Member Services Representative · Personal Banking Representative · Roving Teller · Teller
  - Served counts: tasks 28 · skills 35 · work activities 41 · technology categories 10 · Software-Skills source row: Employer Job Postings (2025)

| Balance currency, coin, and checks in cash drawers at ends of shifts and calculate daily (core/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 2549 (importance 95) |
| Balance currency, coin, and checks in cash drawers at ends of shifts and (core/O*NET) | “Count currency, coins, and checks received, by hand or using currency-counting machi…” | MATCH (containment) | task 2554 (importance 93) |
| Enter customers' transactions into computers to record transactions and issue computer-g (core/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 2553 (importance 92) |
| Enter customers' transactions into computers to record transactions and  (core/O*NET) | “Identify transaction mistakes when debits and credits do not balance.” | MATCH (exact) | task 2555 (importance 89) |
| Reconcile records of financial transactions (core/O*NET) | (fixture cites O*NET 43-3031.00) “Reconcile or note and report discrepancies found in records.…” | MATCH (exact) | task 2496 (importance 82) |
| Reconcile records of financial transactions (core/O*NET) | (fixture cites O*NET 43-3031.00) “Reconcile records of bank transactions.…” | MATCH (exact) | task 2503 (importance 85) |

- **Technology-skills presence** — O*NET serves 10 tech categories for 43-3071.00 (Electronic mail software; Presentation software; Accounting software; Enterprise resource planning ERP software; Spreadsheet software; Document management software; Office suite software; Operating system software; Word processing software; Data base user interface and query software).
Row roll-up for treasury vs 43-3071.00: spans matched 3 · rows carrying DIFFERS 0 · rows tagged [O*NET] with no O*NET-keyed claim (PRESENT-ONLY-IN-OURS) 0

## 27 · coll — Bill & Account Collector

Track accounting · PSOC 4214 (Debt collectors and related workers) · O*NET anchor(s): 43-3011.00

### anchor 43-3011.00 — O*NET serves “Bill and Account Collectors” (updated 2026)

- Title: catalog “Bill & Account Collector” vs O*NET “Bill and Account Collectors” — **DIFFERS** (catalog display names are the blessed display-label layer; recorded, not judged).
  - O*NET sample of reported titles (9): Account Representative · Accounts Receivable Specialist (AR Specialist) · Collection Agent · Collection Specialist · Collector · Debt Collector · Patient Access Specialist · Patient Account Representative · Telephone Collector
  - Served counts: tasks 15 · skills 35 · work activities 41 · technology categories 18 · Software-Skills source row: Employer Job Postings (2026)

| Locate and notify customers of delinquent accounts by mail, telephone, or personal visit (core/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 2475 (importance 88) |
| Arrange for debt repayment or establish repayment schedules, based on customers' financi (core/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 2481 (importance 86) |
| Record information about financial status of customers and status of collection efforts (core/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 2474 (importance 91) |
| Confer with customers by telephone or in person to determine reasons for overdue payment (core/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 2476 (importance 82) |
| Receive payments and post amounts paid to customer accounts (core/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 2472 (importance 80) |
| Receive payments and post amounts paid to customer accounts (core/O*NET) | “Sort and file correspondence and perform miscellaneous clerical duties, such as answ…” | MATCH (exact) | task 2479 (importance 72) |
| Trace delinquent customers to new addresses by inquiring at post offices, telephone comp (secondary/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 2483 (importance 74) |
| Recommend legal action or disconnection when payment cannot be obtained  (secondary/O*NET) | “Notify credit departments, order merchandise repossession or service disconnection, …” · fixture: flagged paraphrase | MATCH (exact) | task 2484 (importance 74) |
| Recommend legal action or disconnection when payment cannot be obtained  (secondary/O*NET) | “Negotiate credit extensions when necessary.” · fixture: flagged paraphrase | MATCH (exact) | task 2482 (importance 63) |
| Administrative upkeep of assigned accounts (secondary/O*NET) | “Perform various administrative functions for assigned accounts, such as recording ad…” | MATCH (exact) | task 2480 (importance 66) |
| Administrative upkeep of assigned accounts (secondary/O*NET) | “Contact insurance companies to check on status of claims payments and write appeal l…” | MATCH (exact) | task 18560 (importance 70) |

- **Technology-skills presence** — O*NET serves 18 tech categories for 43-3011.00 (Accounting software; Presentation software; Customer relationship management CRM software; Data base user interface and query software; Information retrieval or search software; Point of sale POS software; Enterprise resource planning ERP software; Medical software; Spreadsheet software; Categorization or classification software; Electronic mail software; Optical character reader OCR or scanning software; Document management software; Office suite software; Word processing software; Time accounting software; Internet browser software; Access software).
Row roll-up for coll vs 43-3011.00: spans matched 8 · rows carrying DIFFERS 0 · rows tagged [O*NET] with no O*NET-keyed claim (PRESENT-ONLY-IN-OURS) 0

## 28 · credit — Credit Analyst

Track accounting · PSOC 3312 (Credit and loans officers — credit investigator) · O*NET anchor(s): 13-2072.00

### anchor 13-2072.00 — O*NET serves “Loan Officers” (updated 2026)

- Title: catalog “Credit Analyst” vs O*NET “Loan Officers” — **DIFFERS** (catalog display names are the blessed display-label layer; recorded, not judged).
  - O*NET sample of reported titles (10): Commercial Banker · Commercial Loan Officer · Corporate Banking Officer · Financial Aid Advisor · Financial Aid Counselor · Financial Aid Officer · Financial Counselor · Loan Counselor · Loan Officer · Mortgage Loan Officer
  - Served counts: tasks 30 · skills 35 · work activities 41 · technology categories 18 · Software-Skills source row: Employer Job Postings (2026)

| Researching and evaluating loan applicant's financial status, references (core/PSOC) | “Analyze applicants' financial status, credit, and property evaluations to determine …” | MATCH (exact) | task 3409 (importance 89) |
| Researching and evaluating loan applicant's financial status, references (core/PSOC) | “Obtain and compile copies of loan applicants' credit histories, corporate financial …” | MATCH (exact) | task 3411 (importance 78) |
| Interviewing applicants for personal, mortgage, student and business loa (core/PSOC) | “Meet with applicants to obtain information for loan applications and to answer quest…” | MATCH (exact) | task 3408 (importance 90) |
| Submitting credit and loan applications to management with recommendatio (core/PSOC) | “Approve loans within specified limits, and refer loan applications outside those lim…” | MATCH (exact) | task 3407 (importance 85) |
| Keeping records of payments, and preparing routine letters requesting pa (core/PSOC) | “Maintain and review account records, updating and recategorizing them according to s…” | MATCH (exact) | task 21644 (importance undefined) |
| Keeping records of payments, and preparing routine letters requesting pa (core/PSOC) | “Review and update credit and loan files.” | MATCH (exact) | task 3412 (importance 78) |
| Completing credit and loan documentation (core/PSOC) | “Review loan agreements to ensure that they are complete and accurate according to po…” | MATCH (exact) | task 3413 (importance 79) |
| Explain to customers the different types of loans and credit options (including terms) (secondary/O*NET) | anchor declares “task as printed” → row name is the claim | DIFFERS | not among the 30 served tasks; nearest “Explain to customers the different types of loans and credit options that are availa” (overlap 92%) |
| Confer with underwriters to resolve mortgage application problems / subm (secondary/O*NET) | “Confer with underwriters to resolve mortgage application problems.” | MATCH (exact) | task 21638 (importance undefined) |
| Confer with underwriters to resolve mortgage application problems / subm (secondary/O*NET) | “Submit applications to credit analysts for verification and recommendation.” | MATCH (exact) | task 3416 (importance 80) |
| Sizing the credit portfolio (delinquent-account reports) (secondary/O*NET) | “Prepare reports to send to customers whose accounts are delinquent, and forward irre…” | MATCH (exact) | task 3426 (importance 60) |
| Sizing the credit portfolio (delinquent-account reports) (secondary/O*NET) | “Contact borrowers with delinquent accounts to obtain payment in full or to negotiate…” | MATCH (exact) | task 21640 (importance undefined) |

- **Technology-skills presence** — O*NET serves 18 tech categories for 13-2072.00 (Data base user interface and query software; Video conferencing software; Financial analysis software; Accounting software; Enterprise resource planning ERP software; Content workflow software; Electronic mail software; Office suite software; Internet browser software; Information retrieval or search software; Spreadsheet software; Document management software; Development environment software; Customer relationship management CRM software; Transaction server software; Word processing software; Presentation software; Compliance software).
Row roll-up for credit vs 13-2072.00: spans matched 7 · rows carrying DIFFERS 1 · rows tagged [O*NET] with no O*NET-keyed claim (PRESENT-ONLY-IN-OURS) 0

## 29 · teller — Bank Teller

Track accounting · PSOC 4211 (Bank tellers and related clerks) · O*NET anchor(s): 43-3071.00

### anchor 43-3071.00 — O*NET serves “Tellers” (updated 2026)

- Title: catalog “Bank Teller” vs O*NET “Tellers” — **DIFFERS** (catalog display names are the blessed display-label layer; recorded, not judged).
  - O*NET sample of reported titles (10): Account Representative · Bank Teller · Branch Operations Specialist · Customer Relationship Specialist · Customer Service Associate (CSA) · Financial Services Representative (FSR) · Member Services Representative · Personal Banking Representative · Roving Teller · Teller
  - Served counts: tasks 28 · skills 35 · work activities 41 · technology categories 10 · Software-Skills source row: Employer Job Postings (2025)

| Balance currency, coin, and checks in cash drawers at ends of shifts and calculate daily (core/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 2549 (importance 95) |
| Receive checks and cash for deposit, verify amounts, and check accuracy of deposit slips (core/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 2551 (importance 95) |
| Enter customers' transactions into computers to record transactions and issue computer-g (core/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 2553 (importance 92) |
| Enter customers' transactions into computers to record transactions and  (core/O*NET) | “Count currency, coins, and checks received, by hand or using currency-counting machi…” | MATCH (exact) | task 2554 (importance 93) |
| Resolve problems or discrepancies concerning customers' accounts (core/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 2560 (importance 90) |
| Receive mortgage, loan, or public utility bill payments, verifying payme (core/O*NET) | “Receive mortgage, loan, or public utility bill payments, verifying payment dates and…” | MATCH (exact) | task 2559 (importance 79) |
| Receive mortgage, loan, or public utility bill payments, verifying payme (core/O*NET) | “Process transactions, such as term deposits, retirement savings plan contributions, …” | MATCH (exact) | task 2558 (importance 90) |
| Customer service & special services (cards, checks ordering) (secondary/O*NET) | “Answer telephones and assist customers with their questions.” | MATCH (exact) | task 21076 (importance 89) |
| Customer service & special services (cards, checks ordering) (secondary/O*NET) | “Carry out special services for customers, such as ordering bank cards and checks.” | MATCH (exact) | task 2569 (importance 86) |
| Customer service & special services (cards, checks ordering) (secondary/O*NET) | “Obtain and process information required for the provision of services, such as openi…” | MATCH (exact) | task 2571 (importance 76) |
| Explain, promote, or sell banking products (secondary/O*NET) | anchor declares “task as printed” → row name is the claim | DIFFERS | not among the 28 served tasks; nearest “Explain, promote, or sell products or services, such as travelers' checks, savings b” (overlap 83%) |

- **Technology-skills presence** — O*NET serves 10 tech categories for 43-3071.00 (Electronic mail software; Presentation software; Accounting software; Enterprise resource planning ERP software; Spreadsheet software; Document management software; Office suite software; Operating system software; Word processing software; Data base user interface and query software).
Row roll-up for teller vs 43-3071.00: spans matched 6 · rows carrying DIFFERS 1 · rows tagged [O*NET] with no O*NET-keyed claim (PRESENT-ONLY-IN-OURS) 0

## 30 · audit — Audit Associate

Track accounting · PSOC 3313 (Accounting associate professionals — audit assistant) · O*NET anchor(s): 13-2011.00

### anchor 13-2011.00 — O*NET serves “Accountants and Auditors” (updated 2026)

- Title: catalog “Audit Associate” vs O*NET “Accountants and Auditors” — **DIFFERS** (catalog display names are the blessed display-label layer; recorded, not judged).
  - O*NET sample of reported titles (10): Accountant · Accounting Officer · Audit Partner · Auditor · Cost Accountant · CPA (Certified Public Accountant) · Financial Auditor · Financial Reporting Accountant · General Accountant · Internal Auditor
  - Served counts: tasks 30 · skills 35 · work activities 41 · technology categories 37 · Software-Skills source row: Employer Job Postings (2026)

| Prepare, examine, or analyze accounting records, financial statements, or other financia (core/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 21514 (importance 90) |
| Review accounts for discrepancies and reconcile differences (core/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 21516 (importance 87) |
| Collect and analyze data to detect deficient controls, duplicated effort, extravagance,  (core/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 21507 (importance 75) |
| Collect and analyze data to detect deficient controls, duplicated effort (core/O*NET) | “Inspect account books and accounting systems for efficiency, effectiveness, and use …” | MATCH (exact) | task 21508 (importance 80) |
| Inspect cash on hand, notes receivable and payable, negotiable securities, and canceled  (core/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 21512 (importance 68) |
| Examine records and interview workers to ensure recording of transactions and compliance (core/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 21513 (importance 66) |
| Prepare detailed reports on audit findings (core/O*NET) | anchor declares “task as printed” → row name is the claim | MATCH (exact) | task 21505 (importance 77) |
| Prepare adjusting journal entries / establish tables of accounts and ass (secondary/O*NET) | “Prepare adjusting journal entries.” | MATCH (exact) | task 21515 (importance 82) |
| Prepare adjusting journal entries / establish tables of accounts and ass (secondary/O*NET) | “Establish tables of accounts and assign entries to proper accounts.” | MATCH (exact) | task 21517 (importance 69) |
| Prepare adjusting journal entries / establish tables of accounts and ass (secondary/O*NET) | “Review data about material assets, net worth, liabilities, capital stock, surplus, i…” | MATCH (exact) | task 21534 (importance 74) |
| Compliance / tax analog & frameworks (secondary/O*NET) | “Compute taxes owed and prepare tax returns, ensuring compliance with payment, report…” | MATCH (exact) | task 21526 (importance 82) |
| Compliance / tax analog & frameworks (secondary/O*NET) | “Audit payroll and personnel records to determine unemployment insurance premiums, wo…” | MATCH (exact) | task 21524 (importance 60) |
| Senior-heavy supervision tasks (secondary/O*NET) | “Supervise auditing of establishments, and determine scope of investigation required.” | MATCH (exact) | task 21509 (importance 72) |
| Senior-heavy supervision tasks (secondary/O*NET) | “Direct activities of personnel engaged in filing, recording, compiling, and transmit…” | MATCH (exact) | task 21529 (importance 62) |

- **Technology-skills presence** — O*NET serves 37 tech categories for 13-2011.00 (Accounting software; Word processing software; Financial analysis software; Tax preparation software; Enterprise resource planning ERP software; Compliance software; Data base user interface and query software; Document management software; Analytical or scientific software; Medical software; Business intelligence and data analysis software; Human resources software; Billing and invoicing software; Electronic mail software; Development environment software; Office suite software; Spreadsheet software; Customer relationship management CRM software; Operating system software; Data base management system software; Data base reporting software; Object or component oriented development software; Time accounting software; Presentation software; Data mining software; Project management software; Risk management data and analysis software; Enterprise system management software; Desktop communications software; Desktop publishing software; Video creation and editing software; Enterprise application integration software; Transaction server software; Transaction security and virus protection software; Inventory management software; Process mapping and design software; Information retrieval or search software).
  - Fixture row “Audit technology fluency (accounting software / Excel family)” [secondary/O*NET] waits on this pin (“...”) — pin content:

  | O*NET 31.0 tech category | served examples (verbatim, incl. standard list beyond first page) |
  |---|---|
  | Accounting software | Intuit QuickBooks, Sage 50 Accounting, SAP Concur, Summit Software Summit Biofuels Accounting, Accounts payable software, Accounts receivable software, Accurate NXG, AcorynSystems Activity Based Costing/Management ABC/M, AdaptaSoft CyberPay, ATX Total Accounting Office, +30 more |
  | Word processing software | Google Docs, Microsoft OneNote, Microsoft Word |
  | Financial analysis software | Delphi Technology, Oracle E-Business Suite Financials, TopCAATs, Tropics workers' compensation software, Accounting fraud detection software, ACL Business Assurance Analytics, Audit management software, Audit planning and control environment software, AuditWare CaseWare Examiner, AuditWare financial reporting and auditing software, +46 more |
  | Tax preparation software | ATX Total Tax Office, CCH ProSystem fx TAX, Intuit TurboTax, Thomson GoSystem Tax, 1099 ProsSoftware, Abacus Tax, Advanced Micro Systems 1099-Etc, American Riviera Magtax, Avalara AvaTax ST, BNA Estate and Gift Tax Suite, +12 more |
  | Enterprise resource planning ERP software | Microsoft Dynamics, Oracle PeopleSoft, SAP software, Workday software, Accountants Templates JAZZ-It!, AcornSystems Corporate Performance Management, Cartesis ES Magnitude, Exact Software Macola ES, Lawson ERP, Microsoft Dynamics GP, +11 more |
  | Compliance software | Intrax ProcedureNet, Sage HandiSoft HandiLedger, Tax compliance property tax management software, TrendTracker Compliance Solution, Accounting compliance software, ACCUCert, Bi3 Audit Intelligence, Corporate Responsibility System Technologies Limited Compliance Positioning System, Lumigent Entegra, Paisley Cardmap, +3 more |
  | Data base user interface and query software | Microsoft SQL Server, Oracle Database, Structured query language SQL, Yardi software, Best Software CPAPayroll, Data entry software, Database software, FileMaker Pro, Microsoft Access, Practice management software PMS, +2 more |
  | Document management software | Adobe Acrobat, Document management system software, Microsoft SharePoint, Sage CPADocument Manager, Iron Mountain Accutrac records management software, OmniRIM Records Management Suite |
  | Analytical or scientific software | Guidance Software EnCase Enterprise, IBM SPSS Statistics, SAS, WizSoft WizRule, ACL Audit Exchange, Arbutus Analyzer |
  | Medical software | Epic Systems, Medical condition coding software, Medical procedure coding software, MEDITECH software, Healthcare common procedure coding system HCPCS |
  | Business intelligence and data analysis software | Alteryx software, IBM Cognos Impromptu, Oracle Business Intelligence Enterprise Edition, Tableau, Qlik Tech QlikView |
  | Human resources software | ADP Workforce Now, CPSI EHR System, Human resource management software HRMS, Sage HRMS |
  | Billing and invoicing software | Billing software, Choice Technologies PowerBill +, Client billing software, Invoice software |
  | Electronic mail software | IBM Notes, Microsoft Exchange, Microsoft Outlook |
  | Development environment software | eXtensible Business Reporting Language XBRL, Microsoft Visual Basic, Microsoft Visual Basic for Applications VBA |
  | Office suite software | Corel WordPerfect Office Suite, Microsoft Office software, Microsoft Works |
  | Spreadsheet software | Google Sheets, Microsoft Excel |
  | Customer relationship management CRM software | Blackbaud The Raiser's Edge, Salesforce software |
  | Operating system software | Microsoft Windows, UNIX |
  | Data base management system software | Apache Solr, Teradata Database |
  | Data base reporting software | ADP Super Report Writer, SAP Crystal Reports |
  | Object or component oriented development software | R, Swift |
  | Time accounting software | Payroll software, WorkForce Software EmpCenter Time and Attendance |
  | Presentation software | Google Slides, Microsoft PowerPoint |
  | Data mining software | Data extraction software, WizSoft WizWhy |
  | Project management software | Microsoft Project, Oracle Primavera Enterprise Project Portfolio Management |
  | Risk management data and analysis software | Thomson Reuters Risk Management |
  | Enterprise system management software | IBM Power Systems software |
  | Desktop communications software | Eko |
  | Desktop publishing software | Microsoft Publisher |
  | Video creation and editing software | TechSmith Camtasia |
  | Enterprise application integration software | SAP BusinessObjects Data Integrator |
  | Transaction server software | Tumbleweed SecureTransport |
  | Transaction security and virus protection software | NortonLifeLock cybersecurity software |
  | Inventory management software | Asset management software |
  | Process mapping and design software | Microsoft Visio |
  | Information retrieval or search software | LexisNexis |

Row roll-up for audit vs 13-2011.00: spans matched 9 · rows carrying DIFFERS 0 · rows tagged [O*NET] with no O*NET-keyed claim (PRESENT-ONLY-IN-OURS) 0

---
# Track · Office & Administration (5.1–5.5 + E2/E3)

## 31 · adminassoc — Administrative Associate

Track office · PSOC 3343 (Administrative and executive secretaries (span-note: between 3343 and 4110)) · O*NET anchor(s): 43-6014.00

### anchor 43-6014.00 — O*NET serves “Secretaries and Administrative Assistants, Except Legal, Medical, and Executive” (updated 2026)

- Title: catalog “Administrative Associate” vs O*NET “Secretaries and Administrative Assistants, Except Legal, Medical, and Executive” — **DIFFERS** (catalog display names are the blessed display-label layer; recorded, not judged).
  - O*NET sample of reported titles (10): Administrative Assistant (Admin Assistant) · Administrative Clerk · Administrative Secretary (Admin Secretary) · Administrative Specialist (Admin Specialist) · Administrative Support Assistant (ASA) · Administrative Technician · Department Secretary · Office Assistant · Secretary · Staff Assistant
  - Served counts: tasks 31 · skills 35 · work activities 41 · technology categories 48 · Software-Skills source row: Multiple sources (2025)

| Filing systems (paper/electronic) operation (core/O*NET) | “Set up and manage paper or electronic filing systems, recording information, updatin…” | MATCH (exact) | task 20282 (importance 75) |
| Database entry & maintenance (core/O*NET) | “Create, maintain, and enter information into databases.” | MATCH (exact) | task 20281 (importance 81) |
| Database entry & maintenance (core/O*NET) | “Use computers for various applications, such as database management or word processi…” | MATCH (exact) | task 20280 (importance 81) |
| Multi-channel reception & call routing (core/O*NET) | “Answer telephones and give information to callers, take messages, or transfer calls …” | MATCH (exact) | task 2790 (importance 83) |
| Multi-channel reception & call routing (core/O*NET) | “Greet visitors or callers and handle their inquiries or direct them to the appropria…” | MATCH (exact) | task 2791 (importance 83) |
| Office equipment operation & basic troubleshooting (core/O*NET) | “Operate office equipment, such as fax machines, copiers, or phone systems and arrang…” | MATCH (exact) | task 20283 (importance 77) |
| Meeting/coordination documentation (secondary/O*NET) | “Compose, type, and distribute meeting notes, routine correspondence, or reports, suc…” | MATCH (exact) | task 20284 (importance 71) |
| Meeting/coordination documentation (secondary/O*NET) | “Maintain scheduling and event calendars.” | MATCH (exact) | task 2800 (importance 71) |
| Meeting/coordination documentation (secondary/O*NET) | “Schedule and confirm appointments for clients, customers, or supervisors.” | MATCH (exact) | task 2801 (importance 73) |

- **Technology-skills presence** — O*NET serves 48 tech categories for 43-6014.00 (Enterprise resource planning ERP software; Data base user interface and query software; Video conferencing software; Data base management system software; Accounting software; Graphics or photo imaging software; Operating system software; Word processing software; Web page creation and editing software; Business intelligence and data analysis software; Project management software; Web platform development software; Electronic mail software; Document management software; Cloud-based data access and sharing software; Human resources software; Analytical or scientific software; Presentation software; Spreadsheet software; Desktop communications software; Desktop publishing software; Video creation and editing software; Customer relationship management CRM software; Office suite software; Financial analysis software; Transaction security and virus protection software; Time accounting software; Internet browser software; Metadata management software; Medical software; Content workflow software; Enterprise system management software; Access software; Computer based training software; Portal server software; Enterprise application integration software; Network conferencing software; Transaction server software; Voice recognition software; Instant messaging software; Data base reporting software; Backup or archival software; Cloud-based management software; Data mining software; Calendar and scheduling software; Process mapping and design software; Information retrieval or search software; Mobile messaging service software).
Row roll-up for adminassoc vs 43-6014.00: spans matched 5 · rows carrying DIFFERS 0 · rows tagged [O*NET] with no O*NET-keyed claim (PRESENT-ONLY-IN-OURS) 0

## 32 · clerk — Office Clerk

Track office · PSOC 4110 (General office clerks) · O*NET anchor(s): 43-9061.00

### anchor 43-9061.00 — O*NET serves “Office Clerks, General” (updated 2026)

- Title: catalog “Office Clerk” vs O*NET “Office Clerks, General” — **MATCH**
  - O*NET sample of reported titles (9): Administrative Clerk (Admin Clerk) · Clerical Aide · Clerical Assistant · Clerk · General Clerk · Office Assistant · Office Clerk · Office Services Specialist · Office Support Assistant
  - Served counts: tasks 20 · skills 35 · work activities 41 · technology categories 24 · Software-Skills source row: Employer Job Postings (2025)

| Recording, preparing, sorting, classifying and filing information (core/PSOC) | “Compile, copy, sort, and file records of office activities, business transactions, a…” | MATCH (exact) | task 828 (importance 75) |
| Sorting, opening and sending mail (core/PSOC) | “Open, sort, and route incoming mail, answer correspondence, and prepare outgoing mai…” | MATCH (exact) | task 833 (importance 73) |
| Photocopying and sending documents (core/PSOC) | “Operate office machines, such as photocopiers and scanners, facsimile machines, voic…” | MATCH (exact) | task 830 (importance 89) |
| Routine reports & correspondence (core/PSOC) | “Type, format, proofread, and edit correspondence and other documents, from notes or …” | MATCH (exact) | task 840 (importance 64) |
| Responding to enquiries (telephone/electronic) or forwarding (core/PSOC) | “Review files, records, and other documents to obtain information to respond to reque…” | MATCH (exact) | task 834 (importance 73) |
| Responding to enquiries (telephone/electronic) or forwarding (core/PSOC) | “Answer telephones, direct calls, and take messages.” | MATCH (exact) | task 827 (importance 84) |
| Transcribing information into computers, and proof-reading and correctin (secondary/PSOC) | “Maintain and update filing, inventory, mailing, and database systems, either manuall…” | MATCH (exact) | task 832 (importance 76) |

- **Technology-skills presence** — O*NET serves 24 tech categories for 43-9061.00 (Data base user interface and query software; Document management software; Medical software; Enterprise resource planning ERP software; Word processing software; Web page creation and editing software; Electronic mail software; Accounting software; Customer relationship management CRM software; Desktop publishing software; Office suite software; Cloud-based data access and sharing software; Project management software; Spreadsheet software; Graphics or photo imaging software; Enterprise application integration software; Operating system software; Instant messaging software; Human resources software; Internet browser software; Presentation software; Billing and invoicing software; Calendar and scheduling software; Information retrieval or search software).
Row roll-up for clerk vs 43-9061.00: spans matched 6 · rows carrying DIFFERS 0 · rows tagged [O*NET] with no O*NET-keyed claim (PRESENT-ONLY-IN-OURS) 0

## 33 · encode — Data Encoder

Track office · PSOC 4132 (Data entry clerks) · O*NET anchor(s): 43-9021.00

### anchor 43-9021.00 — O*NET serves “Data Entry Keyers” (updated 2026)

- Title: catalog “Data Encoder” vs O*NET “Data Entry Keyers” — **DIFFERS** (catalog display names are the blessed display-label layer; recorded, not judged).
  - O*NET sample of reported titles (8): Data Capture Specialist · Data Entry Clerk · Data Entry Machine Operator · Data Entry Operator · Data Entry Specialist · Data Transcriber · Records Clerk · Underwriting Support Specialist
  - Served counts: tasks 9 · skills 35 · work activities 41 · technology categories 13 · Software-Skills source row: Employer Job Postings (2025)

| Receiving & registering source documents for data capture (core/PSOC) | “Select materials needed to complete work assignments.” | MATCH (exact) | task 11407 (importance 85) |
| Source-document reading & field mapping (entering from source material) (core/O*NET) | “Read source documents such as canceled checks, sales reports, or bills, and enter da…” | MATCH (exact) | task 11401 (importance 88) |
| Accuracy/error detection & correction (core/O*NET) | “Locate and correct data entry errors, or report them to supervisors.” | MATCH (exact) | task 11405 (importance 96) |
| Accuracy/error detection & correction (core/O*NET) | “Compare data with source documents, or re-enter data in verification format to detec…” | MATCH (exact) | task 11403 (importance 89) |
| Compilation, sorting, verification before entry (core/O*NET) | “Compile, sort, and verify the accuracy of data before it is entered.” | MATCH (exact) | task 11402 (importance 93) |
| Storing completed documents & logs (records + throughput discipline) (secondary/O*NET) | “Store completed documents in appropriate locations.” | MATCH (exact) | task 11404 (importance 85) |
| Storing completed documents & logs (records + throughput discipline) (secondary/O*NET) | “Maintain logs of activities and completed work.” | MATCH (exact) | task 11406 (importance 80) |
| Operating bookkeeping and calculating machines (secondary/PSOC) | “Operate data entry device, such as keyboard or photo composing perforator.” | DIFFERS | not among the 9 served tasks; nearest “Read source documents such as canceled checks, sales reports, or bills, and enter da” (overlap 45%) |
| Operating bookkeeping and calculating machines (secondary/PSOC) | “Load machines with required input or output media, such as paper, cards, disks, tape…” | MATCH (exact) | task 11408 (importance 63) |
| Importing and exporting data between different database systems and soft (secondary/PSOC) | “Resolve garbled or indecipherable messages, using cryptographic procedures and equip…” | MATCH (exact) | task 11409 (importance 60) |

- **Technology-skills presence** — O*NET serves 13 tech categories for 43-9021.00 (Data base user interface and query software; Word processing software; Medical software; Enterprise resource planning ERP software; Accounting software; Customer relationship management CRM software; Spreadsheet software; Electronic mail software; Document management software; Video conferencing software; Office suite software; Cloud-based data access and sharing software; Presentation software).
Row roll-up for encode vs 43-9021.00: spans matched 6 · rows carrying DIFFERS 1 · rows tagged [O*NET] with no O*NET-keyed claim (PRESENT-ONLY-IN-OURS) 0

## 34 · desk — Counter / Enquiry Clerk

Track office · PSOC 4225 (Enquiry clerks — counter clerk/desk clerk/information clerk) · O*NET anchor(s): none recorded in fixtures

**NO-OUR-ROW** — no O*NET-keyed row exists on this track to compare (skill-row source tags: PSOC, PSF). No O*NET code derivable from the fixtures; nothing improvised.

## 35 · execsec — Executive Secretary

Track office · PSOC 3343 (Administrative and executive secretaries) · O*NET anchor(s): 43-6011.00

### anchor 43-6011.00 — O*NET serves “Executive Secretaries and Executive Administrative Assistants” (updated 2026)

- Title: catalog “Executive Secretary” vs O*NET “Executive Secretaries and Executive Administrative Assistants” — **DIFFERS** (catalog display names are the blessed display-label layer; recorded, not judged).
  - O*NET sample of reported titles (10): Administrative Aide · Administrative Assistant · Administrative Associate · Administrative Coordinator · Administrative Secretary · Administrative Specialist · Executive Administrative Assistant · Executive Assistant · Executive Secretary · Office Assistant
  - Served counts: tasks 23 · skills 35 · work activities 41 · technology categories 32 · Software-Skills source row: Multiple sources (2025)

| Executive schedule & calendar management (core/O*NET) | “Manage and maintain executives' schedules.” | MATCH (exact) | task 2770 (importance 85) |
| Correspondence & document production (core/O*NET) | “Prepare invoices, reports, memos, letters, financial statements, and other documents…” | MATCH (exact) | task 2771 (importance 79) |
| Correspondence & document production (core/O*NET) | “Prepare responses to correspondence containing routine inquiries.” | MATCH (exact) | task 2776 (importance 76) |
| Meeting administration & minutes (core/O*NET) | “Prepare agendas and make arrangements, such as coordinating catering for luncheons, …” | MATCH (exact) | task 18575 (importance 73) |
| Meeting administration & minutes (core/O*NET) | “Attend meetings to record minutes.” | MATCH (exact) | task 2782 (importance 63) |
| Meeting administration & minutes (core/O*NET) | “Compile, transcribe, and distribute minutes of meetings.” | MATCH (exact) | task 2781 (importance 65) |
| Information gatekeeping: calls & visitors (core/O*NET) | “Answer phone calls and direct calls to appropriate parties or take messages.” | MATCH (exact) | task 18573 (importance 77) |
| Information gatekeeping: calls & visitors (core/O*NET) | “Greet visitors and determine whether they should be given access to specific individ…” | MATCH (exact) | task 2775 (importance 75) |
| Research & briefing support for executives (core/O*NET) | “Conduct research, compile data, and prepare papers for consideration and presentatio…” | MATCH (exact) | task 2780 (importance 72) |
| Incoming-material triage & distribution (core/O*NET) | “Read and analyze incoming memos, submissions, and reports to determine their signifi…” | MATCH (exact) | task 2772 (importance 68) |
| Incoming-material triage & distribution (core/O*NET) | “Open, sort, and distribute incoming correspondence, including faxes and email.” | MATCH (exact) | task 2773 (importance 75) |
| Office services coordination (core/O*NET) | “Coordinate and direct office services, such as records, departmental finances, budge…” | MATCH (exact) | task 18576 (importance 77) |
| Travel arrangements (core/O*NET) | “Make travel arrangements for executives.” | MATCH (exact) | task 2779 (importance 81) |
| Records & document filing/retrieval (secondary/O*NET) | “File and retrieve corporate documents, records, and reports.” | MATCH (exact) | task 2774 (importance 70) |
| General office duties & tools (secondary/O*NET) | “Perform general office duties, such as ordering supplies, maintaining records manage…” | MATCH (exact) | task 18574 (importance 72) |
| Clerical support across departments (secondary/O*NET) | “Provide clerical support to other departments.” | MATCH (exact) | task 18577 (importance 66) |
| Payroll-information processing (secondary/O*NET) | “Process payroll information.” | MATCH (exact) | task 18578 (importance 82) |
| Administrative policy setup & interpretation (secondary/O*NET) | “Interpret administrative and operating policies and procedures for employees.” | MATCH (exact) | task 2788 (importance 70) |
| Administrative policy setup & interpretation (secondary/O*NET) | “Set up and oversee administrative policies and procedures for offices or organizatio…” | MATCH (exact) | task 2785 (importance 67) |
| Representing executives / meeting on their behalf (secondary/O*NET) | “Meet with individuals, special interest groups, and others on behalf of executives, …” | MATCH (exact) | task 2784 (importance 66) |
| Supervision & training of clerical staff (secondary/O*NET) | “Supervise and train other clerical staff and arrange for employee training by schedu…” | MATCH (exact) | task 18579 (importance 61) |
| Operating-practice review (secondary/O*NET) | “Review operating practices and procedures to determine whether improvements can be m…” | MATCH (exact) | task 2787 (importance 57) |
| Employee time-tracking (secondary/O*NET) | “Keep track of employees' time.” | MATCH (exact) | task 1001277 (importance undefined) |

- **Technology-skills presence** — O*NET serves 32 tech categories for 43-6011.00 (Enterprise resource planning ERP software; Web page creation and editing software; Graphics or photo imaging software; Video conferencing software; Word processing software; Data base user interface and query software; Accounting software; Document management software; Office suite software; Cloud-based data access and sharing software; Human resources software; Analytical or scientific software; Presentation software; Project management software; Medical software; Electronic mail software; Desktop communications software; Desktop publishing software; Network conferencing software; Time accounting software; Calendar and scheduling software; Spreadsheet software; Customer relationship management CRM software; Procurement software; Operating system software; Financial analysis software; Data base reporting software; Internet browser software; Inventory management software; Process mapping and design software; Information retrieval or search software; Mobile messaging service software).
Row roll-up for execsec vs 43-6011.00: spans matched 17 · rows carrying DIFFERS 0 · rows tagged [O*NET] with no O*NET-keyed claim (PRESENT-ONLY-IN-OURS) 0

## 36 · records — Records Clerk

Track office · PSOC 4415 (Filing and copying clerks) · O*NET anchor(s): 43-4171.00

### anchor 43-4171.00 — O*NET serves “Receptionists and Information Clerks” (updated 2026)

- Title: catalog “Records Clerk” vs O*NET “Receptionists and Information Clerks” — **DIFFERS** (catalog display names are the blessed display-label layer; recorded, not judged).
  - O*NET sample of reported titles (10): Clerk Specialist · Front Desk Receptionist · Greeter · Information Assistant (Info Assistant) · Medical Receptionist · Member Services Representative (Member Services Rep) · Office Assistant · Receptionist · Registration Clerk · Scheduler
  - Served counts: tasks 19 · skills 35 · work activities 41 · technology categories 18 · Software-Skills source row: Multiple sources (2025)

| Telephone, switchboard & front-desk duties (secondary/O*NET) | “Operate telephone switchboard to answer, screen, or forward calls, providing informa…” | MATCH (exact) | task 744 (importance 94) |
| Visitor greeting & routing (secondary/O*NET) | “Greet persons entering establishment, determine nature and purpose of visit, and dir…” | MATCH (exact) | task 747 (importance 92) |
| Appointment & calendar scheduling (secondary/O*NET) | “Schedule appointments and maintain and update appointment calendars.” | MATCH (exact) | task 751 (importance 85) |
| Mail & document handling (secondary/O*NET) | “Collect, sort, distribute, or prepare mail, messages, or courier deliveries.” | MATCH (exact) | task 755 (importance 73) |
| Mail & document handling (secondary/O*NET) | “Transmit information or documents to customers, using computer, mail, or facsimile m…” | MATCH (exact) | task 750 (importance 78) |
| Front-office record & database upkeep (secondary/O*NET) | “File and maintain records.” | MATCH (exact) | task 749 (importance 77) |
| Front-office record & database upkeep (secondary/O*NET) | “Enter and update databases of contact information, such as names, addresses, and pho…” | MATCH (exact) | task 1001385 (importance undefined) |
| Info & customer-service communication (secondary/O*NET) | “Provide information about establishment, such as location of departments or offices,…” | MATCH (exact) | task 753 (importance 76) |
| Info & customer-service communication · essential-skill claim | “Speaking — Talking to others to convey information effectively.…” | MATCH | skill element 2.A.1.d “Speaking” importance 72 |
| Info & customer-service communication · essential-skill claim | “Active Listening — Giving full attention to what other people are saying……” | MATCH | skill element 2.A.1.b “Active Listening” importance 69 |
| Info & customer-service communication · essential-skill claim | “Critical Thinking — Using logic and reasoning……” | MATCH | skill element 2.A.2.a “Critical Thinking” importance 53 |
| Info & customer-service communication · essential-skill claim | “Reading Comprehension — Understanding written sentences……” | MATCH | skill element 2.A.1.a “Reading Comprehension” importance 53 |
| Info & customer-service communication · essential-skill claim | “Writing — Communicating effectively in writing……” | MATCH | skill element 2.A.1.c “Writing” importance 50 |

- **Technology-skills presence** — O*NET serves 18 tech categories for 43-4171.00 (Electronic mail software; Word processing software; Data base user interface and query software; Medical software; Accounting software; Document management software; Customer relationship management CRM software; Office suite software; Calendar and scheduling software; Spreadsheet software; Desktop publishing software; Cloud-based data access and sharing software; Operating system software; Time accounting software; Internet browser software; Presentation software; Billing and invoicing software; Mobile messaging service software).
Row roll-up for records vs 43-4171.00: spans matched 6 · rows carrying DIFFERS 0 · rows tagged [O*NET] with no O*NET-keyed claim (PRESENT-ONLY-IN-OURS) 0

---
## 37 · Marker roll-up across all 36 tracks

| Marker | Count |
|---|---|
| MATCH | 2 |
| DIFFERS | 19 |
| PRESENT-ONLY-IN-OURS | 0 |
| PRESENT-ONLY-IN-ONET | 21 |
| NO-OUR-ROW | 15 |

Claim-span roll-up (task/WA/description/essential-skill spans): **231 MATCH · 14 DIFFERS**.

_MATCH = fixture claim found in the pinned O*NET 31.0 served lists (exact or containment after normalization). DIFFERS = the claim text has no exact/containment counterpart in the served list at this pin — the served counterpart (or nearest task) is printed for review. PRESENT-ONLY-IN-OURS = fixture rows tagged [O*NET] whose rowspec carries no O*NET-keyed quote span. PRESENT-ONLY-IN-ONET = served content (counted once per anchor block: technology categories; audit row-11 examples listed in full) with no counterpart printed in the fixtures. NO-OUR-ROW = track with no O*NET anchor recorded in the fixtures._


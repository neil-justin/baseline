# Assessment Blueprint — swd (Associate Software Developer), skill-verification expansion

**Status:** REVIEW DRAFT — swd only, pending user review. Not for implementation. No bank code has been touched.

## 1. Scope and approved decisions (cited)

- **Scope:** one career, `swd` — Associate Software Developer (catalog roster 2.1, PSOC 2512). All 8 skill rows are `sourceTag: "PSF"`.
- **D1 — 3-item ladder per skill.** Each skill verified by 3 items: Q1 recognition/easy (knows the facts), Q2 application (workplace scenario), Q3 judgment (ambiguous or constrained situation). All 3 must be correct to verify the skill (independent 4-option items; guess rate per skill ≈ (1/4)^3 ≈ 1.6%).
- **D2 — anchored refs.** Every item carries a `ref` to an on-disk verbatim official statement (O*NET task, PSOC lettered line, or PSF descriptor/key-task quote). No invented sources.
- **D3 — distractor discipline.** Wrong options are "real practices at that same task" drawn from the same source material, each with a one-line why-wrong rationale.
- **D4 — pass rule unchanged.** PASS rule and scoring unchanged; verified/not-verified only (no proficiency levels in this pilot).
- **Byte-lock.** The 5 canon demo-path skill names stay byte-identical: "Applications Support and Enhancement", "Agile Software Development", "Data Design / SQL + data modeling", "Business Needs Analysis", "Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Self Management (Enabling Skills, Basic/Intermediate)" (shipped VERIFY_BANK, `app/(onboarding)/onboarding/banks.ts` lines 78–135). Existing single MCQs are referenced, not modified: VERIFY_BANK (5 canon skills) and `lib/fixtures/skill-banks/it.ts` lines 12–47 (Applications Development, Secure-coding practices, Linux + web deployment basics).

## Stem discipline (anti-giveaway rules) — fixed authoring norm

1. The stem describes the situation only — it never hints or evaluates. "Which is the correct/best move" is banned; "What do you do?" is the neutral limit.
2. No option may contain words that echo the stem's evaluative framing (e.g., a stem that signals "release is close" must not have an option saying "to make the deadline" — banned).
3. Options are parallel in grammar and similar in length; the correct option is never the longest or the most specific by default.
4. The correct option must not quote the source document's phrasing while distractors paraphrase (verbatim-vs-paraphrase giveaway). Verbatim source text lives in the rationale, not in the key.
5. No legacy textbook-wisdom tone in any option; all four must read like things a real Associate might actually do.
6. Key position a)–d) varies across the 8 items — no positional pattern.
7. Each item still carries its source ref and its per-distractor why-wrong rationale; this norm removes telegraphing, never accountability.

The 8 sample items in § 2.1–2.8 below are the revision under this norm; keys sit at c, d, c, a, d, b, c, a.

## Source manifest (on-disk files cited by this doc)

| Source | File | Notes |
|---|---|---|
| O*NET 15-1252.00 tasks (Software Developers) | `research/onet-enrich/pulls/15-1252.00.tasks.json` + `15-1252.00.tasks.json.url.txt`, and `research/onet-enrich/pulls/15-1252.00.tasks.p2.json` + `15-1252.00.tasks.p2.json.url.txt` | Recorded as fetched live 2026-11-05 under the repo's API-key discipline (key loaded from `.env.local` in-process, never printed; raw bytes stored unedited with the request URL burned into the sibling `.url.txt` — `research/onet-enrich/README.md`). Full 17 statements now on disk across both pages: page 1 `start=1,end=10`, page 2 `start=11,end=17`, page 2 URL `https://api-v2.onetcenter.org/online/occupations/15-1252.00/details/tasks?start=11&end=17`. The earlier "page 2 missing" caveat is resolved by the `.p2` pull. |
| PSOC 2012 row 2512 "Software developers" | `research/snapshots/psoc/psoc2012-parsed.csv` (CSV line 281) | Lettered task list a)–h). Caveat: PSOC carries no importance ratings. |
| PSF-SDS verbatim corroboration per swd row | `lib/fixtures/rowspec/it.ts` lines 24–93 (`swd::…` entries) | Descriptor, L-cell, CWF-key-task and role-overview quotes, with printed-page attributions. `role-specs/swd.md` referenced by specRef is not present in the tree; rowspec quotes stand on their own as the on-disk text. |
| Catalog rows (verbatim) | `lib/fixtures/catalog.ts` lines 77–99 | CANON LOCK — not edited. |

## Routing summary

25 routable statements on disk (17 O*NET tasks — full role task set, both pages — + 8 PSOC lettered lines). Routed: 17. Unrouted: 8 (§ 3). Each routed to exactly one swd skill folder; per-skill counts in headings below.

---

## 2.1 Applications Development (core) — 5 statements
Catalog row (verbatim): `{ name: "Applications Development", tier: "core", sourceTag: "PSF", what: "Write and maintain application code to spec, the core day job." }`

Official statements routed:
- O*NET 21669 (imp 73): "Develop or direct software system testing or validation procedures, programming, or documentation."
- O*NET 21667 (imp 64): "Design, develop and modify software systems, using scientific analysis and mathematical models to predict and measure outcomes and consequences of design."
- PSOC 2512 b): "researching, designing, and developing computer software systems"
- PSOC 2512 d): "developing and directing software testing and validation procedures"
- PSOC 2512 f): "directing software programming and development of documentation"
- PSF corroboration (`rowspec/it.ts` lines 24–37): FSC L3 "Develop applications based on the design specifications; encompassing coding, testing, debugging, documenting and reviewing and/or refining it…"; L3 cell "Develop basic applications with secure features, run routine application tests, and conduct debugging to resolve errors."

Coverage → planned item:
| Statement | Planned slot |
|---|---|
| PSF FSC descriptor + L3 cell | Q1 (facts of the code-test-debug-document loop) |
| PSOC b) | Q2 (build-to-spec workplace scenario) |
| O*NET 21669 + PSOC d) | Q2/Q1 option pool (testing/documentation folded into the loop) |
| O*NET 21667 | Q3 (measurement/consequences of design) |
| PSOC f) | Q3 ("directing" vs the associate's do-scope) |

Ladder outline: Q1 — knows the full loop (code, test, debug, document) is the developer's desk work per spec; Q2 — sequence the actual work on an assigned screen per finalized spec; Q3 — decide what is in an associate developer's scope when the task text says "develop or direct."

Sample item (Q2 slot; ref: PSOC 2512 b) + PSF FSC descriptor, `rowspec/it.ts` line 26):
Stem: Your lead hands you the agreed spec for a refund-processing screen and books the next two weeks for it.
- A. rebuild the legacy billing module from scratch while you have the screen open — wrong: the descriptor scopes development to "based on the design specifications… in accordance with defined standards"; an unplanned rebuild exceeds the change.
- B. code the screen from memory first, then read the spec afterwards to speed things up — wrong: development is keyed to the design specifications, not code-first-spec-later.
- C. build the screen to the spec, run the tests, debug what fails, and document the work — KEY: matches "designing, and developing computer software systems" (PSOC b)) plus the L3 cell's "run routine application tests, and conduct debugging."
- D. hand the finished code to QA untouched so their pass finds the errors — wrong: the L3 cell has the developer run routine application tests before QA's separate pass; skipping your own tests misroutes the task.

## 2.2 Applications Support and Enhancement (core) — 5 statements
Catalog row (verbatim): `{ name: "Applications Support and Enhancement", tier: "core", sourceTag: "PSF", what: "Fix and extend live applications after release." }`

Official statements routed:
- O*NET 21670 (imp 69): "Modify existing software to correct errors, adapt it to new hardware, or upgrade interfaces and improve performance."
- O*NET 21661 (imp 65): "Analyze information to determine, recommend, and plan installation of a new system or modification of an existing system."
- O*NET 21666 (imp 69, p2): "Coordinate installation of software system." (ref: `research/onet-enrich/pulls/15-1252.00.tasks.p2.json`)
- PSOC 2512 e): "modifying existing software to correct errors, to adapt it to new hardware or to upgrade interfaces and improve performance"
- PSOC 2512 h): "consulting with customers concerning maintenance of software system"
- PSF corroboration (`rowspec/it.ts` lines 38–43): FSC L1-2 "Provide ongoing technical support and improvements to users of applications… installation and maintenance of applications, fixing and resolution of application problems or disruptions, and response to change requests…"

Coverage → planned item:
| Statement | Planned slot |
|---|---|
| PSF FSC L1-2 descriptor | Q1 (what ongoing support includes) |
| O*NET 21670 + PSOC e) | Q2 (live-app break + queued enhancement) |
| O*NET 21661 + 21666 + PSOC h) | Q3 (plan a modification with the customer in the loop; coordinate its installation) |
| — | L3 cell rides with Q1/Q2 option pool |

Ladder outline: Q1 — knows the support row spans install/maintenance help, fixing disruptions, and change requests; Q2 — sequence hotfix-vs-enhancement on a live app; Q3 — decide what to confirm with the customer before planning and coordinating the installation of a modification. 21666 ("Coordinate installation") rides the existing Q3 slot — the act is the same plan-then-coordinate-with-parties judgment 21661 + PSOC h) already anchor; no fourth item added.

Sample item (Q2 slot; ref: O*NET 21670 + PSF FSC L1-2 descriptor, `rowspec/it.ts` line 40):
Stem: The released expense app rejects every submission for users on one Android version, and finance has queued a summary column for next sprint.
- A. tell users on that version it is unsupported and they should upgrade their phones — wrong: the task text has the software "adapt… to new hardware"; deflection leaves the live disruption unfixed.
- B. roll the summary column into the same hotfix so both land together — wrong: "fixing and resolution of application problems or disruptions" is the immediate support duty; the change request waits its queue.
- C. fix the error and rework the app on a newer framework in the same pass — wrong: response "to change requests that will enhance the operations and usage" is scoped support; a framework rebuild is out of the request's scope and adds release risk.
- D. release the submission-error fix now and queue the summary column as a change request for its sprint — KEY: mirrors "correct errors" first (O*NET 21670) with enhancements handled as change requests (FSC descriptor).

## 2.3 Agile Software Development (core) — 0 cross-source statements; PSF-anchored (single-source, see § 27)
Catalog row (verbatim): `{ name: "Agile Software Development", tier: "core", sourceTag: "PSF", what: "Work in sprint iterations with defined ceremonies." }`

Official statements routed:
- PSF corroboration only (`rowspec/it.ts` lines 44–50): FSC L3 "Plan and implement Agile methodology and the use of adaptive and iterative methods and techniques in the software development lifecycle to account for continuous evolution, development, and deployment…"; L3 cell "Adopt Agile software development methodologies to develop, improve and deploy software applications."

Coverage → planned item:
| Statement | Planned slot |
|---|---|
| FSC L3 descriptor ("adaptive and iterative… continuous evolution") | Q1 + Q3 |
| L3 cell ("Adopt Agile…") | Q2 |

Ladder outline: Q1 — states what adopting Agile covers across the lifecycle; Q2 — applies sprint discipline to a mid-sprint backlog change; Q3 — weighs continuous-evolution pressure against a stable sprint commitment. Both quoted descriptors anchor all three rungs; note in the doc: rowspec records this row "anchorless by spec" on the printed map.

Sample item (Q3 slot; ref: PSF FSC L3 descriptor + L3 cell, `rowspec/it.ts` line 46):
Stem: Day 4 of a two-week sprint. The product owner wants a small, urgent change started today.
- A. set the committed sprint work aside and start the change right away — wrong: the descriptor's "iterative" commitment scopes change at iteration boundaries; gutting a running sprint breaks the plan without review.
- B. code the change quietly and skip the stand-up so nobody talks you out of it — wrong: "adaptive and iterative methods and techniques" run through team ceremonies; a private detour hides the change from the iteration's plan.
- C. note the change in the backlog for the next iteration and finish the committed work first — KEY: "continuous evolution, development, and deployment" is reconciled through iterations, not by interrupting one.
- D. turn away every change request until the project reaches its final release — wrong: the descriptor is explicit that the lifecycle accounts for "continuous evolution… to the end user"; freezing contradicts it.

## 2.4 Data Design / SQL + data modeling (core) — 1 cross-source statement + PSF
Catalog row (verbatim): `{ name: "Data Design / SQL + data modeling", tier: "core", sourceTag: "PSF", what: "Write efficient SQL, map business data to normalized relational schema." }`

Official statements routed:
- O*NET 21676 (imp 65): "Store, retrieve, and manipulate data for analysis of system capabilities and requirements."
- PSF corroboration (`rowspec/it.ts` lines 51–59): CWF "Execute basic relational database operations": "Writes efficient SQL queries, using appropriate JOINs to fetch data across multiple tables"; "…normalized relational database schema, using Data Definition Language (DDL)"; L3 cell "Identify data requirements and support the design of database models…".

Coverage → planned item:
| Statement | Planned slot |
|---|---|
| CWF JOIN/SQL anchor | Q1 (recognize the efficient query) |
| O*NET 21676 | Q2 (retrieve-and-manipulate scenario) |
| CWF DDL/normalized-schema anchor | Q3 (schema integrity under time pressure) |
| L3 cell | rides with Q3 option pool |

Ladder outline: Q1 — recognizes what an efficient JOIN query does right; Q2 — answers a report request by retrieving and manipulating data in the database; Q3 — refuses shortcuts that damage the normalized schema.

Sample item (Q3 slot; ref: PSF CWF "Execute basic relational database operations" anchors, `rowspec/it.ts` line 56):
Stem: A stakeholder asks you to copy a per-student count into the enrollment table every Monday, saying the stored number "loads faster."
- A. keep the count in a view computed from the tables at read time and store nothing new — KEY: preserves the normalized schema while still delivering the data (the CWF "efficient SQL queries, using appropriate JOINs" anchor).
- B. write the computed count into the enrollment table each Monday, as the request describes — wrong: values derived from a query and stored into the normalized schema (the CWF anchor's "normalized relational database schema, using DDL") double-write and drift stale.
- C. export the whole database to a spreadsheet each Monday and e-mail it to the requester — wrong: the task's "store, retrieve, and manipulate data" (O*NET 21676) belongs to the system; manual exports break repeatability and audit.
- D. fold the tables into one wide table, since a small team does not need normal form — wrong: the catalog's `what` ("map business data to normalized relational schema") and the CWF anchor both key on normalization, not team size.

## 2.5 Business Needs Analysis (secondary) — 3 statements + rich PSF
Catalog row (verbatim): `{ name: "Business Needs Analysis", tier: "secondary", sourceTag: "PSF", what: "Translate user requirements into technical specs." }`

Official statements routed:
- O*NET 21662 (imp 77): "Analyze user needs and software requirements to determine feasibility of design within time and cost constraints."
- O*NET 21664 (imp 69): "Confer with systems analysts, engineers, programmers and others to design systems and to obtain information on project limitations and capabilities, performance requirements and interfaces."
- PSOC 2512 a): "researching, analyzing and evaluating requirements for software applications and operating systems"
- PSF corroboration (`rowspec/it.ts` lines 61–68): FSC L2 "Identify and scope business requirements and priorities through rigorous information gathering and analysis…"; L2 cell "Document business requirements and identify basic needs as well as potential solutions"; CWF continuation: "Validate user requirements and design specifications" · "Translate user requirements into technical specifications" · "Formulate software requirement specifications".

Coverage → planned item:
| Statement | Planned slot |
|---|---|
| PSF CWF anchors (translate to tech specs) | Q1 (recognize the translation job) |
| PSOC a) | Q2 (vague complaint → defined requirement) |
| O*NET 21662 + 21664 | Q3 (feasibility within time/cost; confer-to-obtain-information) |

Ladder outline: Q1 — knows the row's outputs (validated requirements, tech specs, SRS); Q2 — turns a vague operational complaint into a scoped requirement; Q3 — judges feasibility tradeoffs against stated time and cost constraints.

Sample item (Q2 slot; ref: PSOC 2512 a) + PSF CWF anchors, `rowspec/it.ts` line 65):
Stem: A department head calls: "our reports are slow and it's costing us." Your first deliverable after the call:
- A. an urgent request to IT for bigger servers, sent while the call is still fresh — wrong: the CWF anchor orders requirements first ("Validate user requirements and design specifications"); solution selection follows analysis.
- B. an apology memo that commits to a fix date before anyone has looked into anything — wrong: "rigorous information gathering and analysis" (FSC L2) precedes any commitment.
- C. the raw server logs forwarded to the department to trace the cause themselves — wrong: the analysis duty sits with the analyst/developer, not pushed back to the requester.
- D. a one-pager pinning down what is slow, for whom, and what acceptable looks like — KEY: matches "researching, analyzing and evaluating requirements" (PSOC a)) and "Translate user requirements into technical specifications" (CWF).

## 2.6 Secure-coding practices (core) — 0 cross-source statements; PSF-anchored (single-source, see § 27)
Catalog row (verbatim): `{ name: "Secure-coding practices", tier: "core", sourceTag: "PSF", what: "Avoid vulnerabilities during coding; supervised remediation." }`

Official statements routed:
- PSF corroboration only (`rowspec/it.ts` lines 70–76): CWF "Execute secure software development practices" key tasks (printed p.104): "Follow recommended coding standards and secure coding principles to avoid security vulnerabilities" · "Adhere to project standards in the collection of security assessment metrics" · "Perform code reviews to identify basic security designs" · "Use automated tools for the detection and remediation of basic security designs" · "Remediate security vulnerabilities with the supervision of more senior engineers".

Coverage → planned item:
| Statement | Planned slot |
|---|---|
| "Follow recommended coding standards… avoid security vulnerabilities" | Q1 |
| "Use automated tools for the detection and remediation of basic security designs" | Q2 |
| "Remediate… with the supervision of more senior engineers" | Q3 |

Ladder outline: Q1 — states the secure-coding duty in own words; Q2 — runs the tool-and-remediate workflow on own code; Q3 — judges what is handled solo vs escalated under senior supervision.

Sample item (Q3 slot; ref: PSF key tasks "Use automated tools…" + "Remediate… supervision…", `rowspec/it.ts` line 74):
Stem: Your pull request adds an internal API endpoint. The automated security scanner has posted two findings on it.
- A. merge the branch now and leave anything further to a later pen-test cycle — wrong: "avoid security vulnerabilities" happens at coding time (key task 1), not deferred to an external pen-test cycle.
- B. fix both findings and take the remediation to the senior for sign-off before merge — KEY: remediation is in scope; "supervision of more senior engineers" is honored.
- C. close the findings as noise, on the view that automated tools over-flag internal endpoints — wrong: the key task is to "Use automated tools for the detection and remediation of basic security designs"; scanner findings are the associate's lane, not noise to wave off.
- D. push the endpoint out behind a flag and watch live traffic for real attacks — wrong: watching live traffic is not the printed practice; detection is via the automated tools before release.

## 2.7 Linux + web deployment basics (secondary) — 1 cross-source statement + rich PSF
Catalog row (verbatim): `{ name: "Linux + web deployment basics", tier: "secondary", sourceTag: "PSF", what: "Command-line basics; deploy/administer a web app on Linux/cloud." }`

Official statements routed:
- PSOC 2512 g): "assessing, developing, upgrading and documenting maintenance procedures for operating systems, communications environments and applications software" (routed here with the caveat that the PSOC line is broader — OS/communications maintenance sits near the edge; see § 27 question 2)
- PSF corroboration (`rowspec/it.ts` lines 78–84): CWF "Perform basic Linux and web operations" key tasks: "…navigating directories, listing contents, managing files and directories…, software installation and management …, logging into remote Linux instances, and transferring files between remote instances" · "Able to deploy and administer a web application on a Linux or cloud environment".

Coverage → planned item:
| Statement | Planned slot |
|---|---|
| CWF command-line key-task anchor | Q1 (recognize the operations covered) |
| CWF "deploy and administer a web application…" anchor | Q2 (deploy-to-cloud scenario) |
| PSOC g) (document maintenance procedures) | Q3 (document/upgrade maintenance under failure) |
| — | CWF "software installation and management" rides with Q1 option pool |

Ladder outline: Q1 — names the command-line fundamentals in the printed key task; Q2 — carries a build from laptop to a rented cloud Linux box correctly; Q3 — handles a failing deploy and leaves a documented maintenance procedure behind.

Sample item (Q2 slot; ref: PSF CWF anchor "Able to deploy and administer a web application on a Linux or cloud environment", `rowspec/it.ts` line 82):
Stem: Tonight your demo web app has to run live on the team's rented cloud Linux server.
- A. open every port on the server so nothing is in the demo's way — wrong: administer includes configuring the environment to serve the app; an all-ports opening is misadministration, not deployment.
- B. e-mail the build to the server admin and ask them to put it live in time — wrong: the CWF makes "deploy and administer" and "transferring files between remote instances" the holder of this row's own task, not hand-off.
- C. SSH in, move the build over, start the app, and check it serves from the server — KEY: "logging into remote Linux instances," "transferring files between remote instances," and deploy-administer, in order.
- D. leave the app running on your laptop and screen-share it at the demo — wrong: the deployment never happened; the row's task requires the app live on the Linux/cloud environment.

## 2.8 Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Self Management (Enabling Skills, Basic/Intermediate) (secondary) — 2 statements + PSF
Catalog row (verbatim): `{ name: "Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Self Management (Enabling Skills, Basic/Intermediate)", tier: "secondary", sourceTag: "PSF", what: "Team behavior layer at associate level." }`

Official statements routed:
- O*NET 21673 (imp 67): "Prepare reports or correspondence concerning project specifications, activities, or status."
- O*NET 21665 (imp 59): "Consult with customers or other departments on project status, proposals, or technical issues, such as software system design or maintenance."
- PSF corroboration (`rowspec/it.ts` lines 86–92): ESC as printed "Collaboration Intermediate · Communication Basic · Digital Fluency Basic · Learning Agility Intermediate · Problem Solving Intermediate · Self Management Intermediate"; role-overview sentence "They are a strong team player, who communicates their ideas and gets along with others easily."

Coverage → planned item:
| Statement | Planned slot |
|---|---|
| O*NET 21673 + role-overview sentence | Q1/Q2 (status reporting) |
| PSF ESC printed levels | Q1 (knows the behavior layer and its levels) |
| O*NET 21665 | Q3 (customer consultation judgment) |

Ladder outline: Q1 — states the enabling layer and its printed Basic/Intermediate levels; Q2 — writes an honest status report under slip; Q3 — handles a stakeholder pushing scope during a consultation.

Sample item (Q2 slot; ref: O*NET 21673, above):
Stem: Your module slipped a day because a ticket ran bigger than estimated, and the status report is due this afternoon.
- A. actual status: the slip, its cause, and the recovery plan for the remaining work — KEY: truthful reporting of "activities, or status" is the anchor's core; recovery plan shows self-management.
- B. nothing — the lead will see the real state at the demo anyway — wrong: the task is to prepare the correspondence proactively; silence transfers discovery, not reporting.
- C. the ticket marked complete so the burndown chart stays green — wrong: reports/correspondence concern "project specifications, activities, or status"; false status corrupts the very record the report exists to carry.
- D. a note in the team channel naming the ticket's original author — wrong: the role-overview sentence keys on being "a strong team player, who communicates their ideas"; blame-routing is not status reporting.

---

## 3. Unrouted statements (verbatim, with source, and why no swd skill folder fits)

- O*NET 21668 (imp 63, Core): "Determine system performance standards." — Why unrouted: authoring/setting performance standards is a design- or standards-owner act; none of the swd folders covers defining standards (the associate's rows cover doing, supporting, translating, and securing the work). Nearest folders (Business Needs Analysis, Data Design) require stretching to fit.
- PSOC 2512 c): "consulting with engineering staff to evaluate interface between hardware and software" — Why unrouted: evaluation of the hardware/software interface is not covered by any of the 8 folders (Linux + web deployment covers OS/web app administration, not hardware interface evaluation). Routing it to the enabling bundle would dilute a substantive technical act into a behavior row — not routed, per the no-stretch rule.

Page-2 O*NET statements (ref for all: `research/onet-enrich/pulls/15-1252.00.tasks.p2.json`):

- O*NET 21663 (imp 58, Core): "Confer with data processing or project managers to obtain information on limitations or capabilities for data processing projects." — Why unrouted: parallels the routed 21664 ("confer with systems analysts, engineers, programmers…") but its object is "data processing projects," a project-manager/facilitation flavor of the same conferring. The confer-to-obtain-information duty is already anchored by 21664 + 21662 + the FSC L2 "rigorous information gathering" text in Business Needs Analysis; a second confer line adds no distinct associate proof, and the folder's Q3 slot is capped at 3 planned items. Held out rather than double-stacking one judgment rung.
- O*NET 21671 (imp 78, Supplemental): "Monitor functioning of equipment to ensure system operates in conformance with specifications." — Why unrouted: "equipment" monitoring is an operations duty — checking hardware/apparatus runs to spec — not covered by any swd folder (Linux + web deployment covers deploying/administering a web app, not equipment surveillance; no folder covers monitoring). Its high importance comes from the broader O*NET role, not the associate-level swd scope this blueprint verifies.
- O*NET 21678 (imp 63, Supplemental): "Supervise the work of programmers, technologists and technicians and other engineering and scientific personnel." — Why unrouted: supervisory line. The associate rows cover doing the work (Applications Development) and translating needs (Business Needs Analysis), not supervising other personnel; routing it would import a lead-level proof the catalog's tiering does not ask for.
- O*NET 21677 (imp 53, Supplemental): "Supervise and assign work to programmers, designers, technologists, technicians, or other engineering or scientific personnel." — Why unrouted: same supervisory act as 21678 (supervise and assign) — held out for the same reason; the pair corroborates each other but neither fits an associate skill folder.
- O*NET 21672 (imp 52, Supplemental): "Obtain and evaluate information on factors such as reporting formats required, costs, or security needs to determine hardware configuration." — Why unrouted: "determine hardware configuration" is an infrastructure-selection act. Linux + web deployment covers administering a web app on a Linux/cloud environment, not specifying hardware configuration; Business Needs Analysis covers user-requirement analysis, not hardware sizing. Nearest to unrouted 21668 ("Determine system performance standards") — both are determine-the-system acts no folder owns.
- O*NET 21679 (imp 48, Supplemental): "Train users to use new or modified equipment." — Why unrouted: user training on equipment is enablement of end users, not an associate developer skill proof (no folder's `what` covers training; the enabling bundle is a behavior layer, not a training-delivery row). Held out per the no-stretch rule.

## 4. Thin flags (declared limitations)

No swd skill falls below the stated threshold — every one of the 8 has on-disk official text beyond its catalog `what`. Declared limitations (both resolved by user decision, 2026-11-05):

1. **PSF-only anchors — Agile Software Development, Secure-coding practices.** Both have verbatim PSF descriptor/key-task text on disk (`rowspec/it.ts`) but zero routed O*NET/PSOC task statements. This held true after the page-2 pull: none of the 7 added statements belongs to either folder (21663/21671/21677/21678/21672/21679 unrouted per § 3; 21666 routed to Applications Support and Enhancement). Ladder items for these two skills (6 items) anchor to PSF text alone. **Option A accepted (2026-11-05): Agile + Secure-coding ride PSF-only anchors — declared stated limitation.**
2. ~~O*NET pull gap~~ — **resolved 2026-11-05.** The absent page 2 was pulled under the repo's API-key discipline; `15-1252.00.tasks.p2.json` (+ its `.url.txt`) is on disk with the remaining 7 statements (`start=11,end=17`). All 17 O*NET task statements are now on disk, used in this routing; nothing was invented and no prior ref changed.

## 5. REVIEW ASK

Before any bank authoring: (a) approve the statement-to-skill mapping above (§ 2.1–2.8, § 3), and (b) approve the sample-item style (stem depth, distractor flavor, why-wrong format). Any change to mapping, refs, or item style after approval requires re-approval. No code or fixture changes are made by this document.

Stem discipline is a fixed authoring norm; any item violating it fails review.

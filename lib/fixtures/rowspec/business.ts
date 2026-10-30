import type { RowSpecMap } from "@/lib/fixtures/rowspec/types";

/**
 * Business & Management track — per-row deep data from the BLESSED role specs
 * (hra · training · mkt · sales · csr · opsanalyst · purch · ccqa · events).
 * Paraphrase rows carry their ruling marker in `flags`; study.com-sourced
 * glossary quotes are STRIPPED to our own paraphrase per the recorded ruling
 * (mkt/sales), and no resource pool carries LinkedIn Learning (sales drop) or
 * Guru99 (qa drop). TOP login-walled entries carry the TOP-account honest
 * flag inline.
 */

export const ROW_SPECS_BUSINESS: RowSpecMap = {
  // ── hra · HR Assistant (3.1; spec hra.md) ─────────────────────────────────
  "hra::Recruitment Channel Management": {
    descriptor: "PSF-HCD FSC level 3, printed Primary (glossary, source-verbatim): \"Evaluate recruitment methods to establish the most effective channels in sourcing, selecting and securing candidates\".",
    anchors: ["PSF-HCD CWF \"Source for Talents\": \"Measure and track conversion success rate for each sourcing channel\" · \"Assist in the research of various sourcing approaches and available assessment tools\" · \"Prepare hiring collaterals to be used in various sourcing / hiring platforms\""],
    specRef: "role-specs/hra.md — Recruitment Channel Management row",
  },
  "hra::Selection Management": {
    descriptor: "PSF-HCD FSC level 2, printed Primary (glossary): \"Facilitate the development and implementation of selection strategies and processes to recruit suitable candidates for the organization\".",
    anchors: ["PSF-HCD CWF \"Recruit candidates\": \"Conduct initial screening of job applicants' resumes and relevant skill qualifications to fit the requirements\" · \"Liaise with job applicants to administer selection process and assessments\" · \"Document assessment results in an applicant bank for analysis and future reference\""],
    specRef: "role-specs/hra.md — Selection Management row",
  },
  "hra::Onboarding": {
    descriptor: "PSF-HCD FSC level 2, printed Primary (glossary): \"Facilitate onboarding programs to enable the integration and engagement of new hires into the organization\".",
    anchors: ["PSF-HCD CWF \"Process onboarding of new hires\": \"Coordinate set up work access, prepare workspace and tools of trade, prepare welcome announcement for new hires and new hire information packs\" · \"Provide administrative and coordination support on the delivery of new hire orientation program\" · \"Gather feedback from new hires on their onboarding experience\""],
    specRef: "role-specs/hra.md — Onboarding row",
  },
  "hra::Data Collection and Preparation": {
    descriptor: "PSF-HCD FSC level 2, printed Primary (glossary): \"Collect human resource (HR) data from employees for the purpose of generating business and HR insights\".",
    anchors: ["PSF-HCD CWF \"Recruit candidates\": \"Gather information based on the result of assessments conducted\" · CWF \"Source for Talents\": \"Maintain candidate database and track potential hires\""],
    specRef: "role-specs/hra.md — Data Collection and Preparation row",
  },
  "hra::Data Management": {
    descriptor: "PSF-HCD FSC level 2, printed Primary — no clean glossary line extracted; explicitly flagged condensed paraphrase: keep candidate/employee records accurate, complete and retrievable.",
    anchors: ["PSOC 4416: \"maintaining and updating manual and computerized filing and registration systems\" · \"storing and retrieving personnel records and files on request\" · PSF-HCD CWF \"Process Separation\": \"Maintain employee separation records\""],
    specRef: "role-specs/hra.md — Data Management row",
    flags: ["flagged paraphrase row (ruling: accepted 2026-10-29)"],
  },
  "hra::Digital Marketing and Communication": {
    descriptor: "PSF-HCD FSC level 3, printed Primary (glossary): \"Develop digital reach plans and marketing collaterals to communicate and enhance the organization's employer brand\".",
    anchors: ["PSF-HCD CWF \"Source for Talents\": \"Prepare hiring collaterals to be used in various sourcing / hiring platforms\" · \"Contact potential candidates to elicit individuals' interest based on available positions\""],
    specRef: "role-specs/hra.md — Digital Marketing and Communication row",
  },
  "hra::Diversity, Equity, Inclusion and Belonging Management": {
    descriptor: "PSF-HCD FSC level 3, printed Primary — flagged condensed paraphrase: run hiring communication and records under non-discrimination and data-privacy law (the CWF Required Knowledge column prints RA 10173, RA 10911, RA 7277 and other statutes verbatim).",
    anchors: ["PSF-HCD CWF \"Recruit candidates\": \"Follow Standard Operating Procedures (SOPs) and regulations in selection and assessment process\""],
    specRef: "role-specs/hra.md — Diversity, Equity, Inclusion and Belonging Management row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "hra::Talent Capability Assessment": {
    descriptor: "PSF-HCD FSC level 3, printed Primary (glossary): \"Develop talent assessment processes with assessment tools to evaluate employees' capabilities\".",
    anchors: ["PSF-HCD CWF \"Support Talent Development\": \"Assist in the administration of assessments\" · \"Gather information about tools to support talent assessment\" · \"Maintain talent pool lists by levels in order to analyze talent gaps\""],
    specRef: "role-specs/hra.md — Talent Capability Assessment row",
  },
  "hra::Employee Communication Management": {
    descriptor: "PSF-HCD FSC level 2, printed Primary — flagged condensed paraphrase: deliver recruiting and people-ops messages to candidates and employees.",
    anchors: ["PSF-HCD CWF \"Recruit candidates\": \"Respond to routine queries from candidates\" · CWF \"Source for Talents\": \"Contact potential candidates to elicit individuals' interest based on available positions\""],
    specRef: "role-specs/hra.md — Employee Communication Management row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "hra::Voluntary Exit Management": {
    descriptor: "PSF-HCD FSC level 2, printed Primary — flagged condensed paraphrase: process separations, records and clearances for employees leaving by choice.",
    anchors: ["PSF-HCD CWF \"Process Separation\": \"Ensure employee exit formalities are complete before employee separation\" · \"Prepare accession report for dissemination to concerned units\""],
    specRef: "role-specs/hra.md — Voluntary Exit Management row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "hra::Involuntary Exit Management": {
    descriptor: "PSF-HCD FSC level 2, printed Primary — flagged condensed paraphrase: handle employer-initiated separations safely under procedure.",
    anchors: ["PSF-HCD CWF \"Process Separation\" (the CWF does not split voluntary/involuntary — the two FSCs both feed it)"],
    specRef: "role-specs/hra.md — Involuntary Exit Management row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "hra::Job Analysis and Evaluation": {
    descriptor: "PSF-HCD FSC level 2, printed Primary (glossary): \"Define and evaluate job requirements and expectations against specific metrics, structures or systems\" — tiered secondary in-file (printed Primary FSC, secondary tier is the recorded decision).",
    anchors: ["PSF-HCD CWF \"Source for Talents\": \"Gather information on talent needs and job descriptions from various business units\""],
    specRef: "role-specs/hra.md — Job Analysis and Evaluation row",
  },
  "hra::Employee Mobility Management": {
    descriptor: "PSF-HCD FSC level 2, printed Secondary — flagged condensed paraphrase: administer internal moves — transfers, promotions, redeployment — and their records.",
    anchors: ["PSOC 4416: \"updating information on employment history, salaries, performance evaluations, qualifications and training, and leave taken and accumulated\""],
    specRef: "role-specs/hra.md — Employee Mobility Management row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "hra::Human Resources Analytics and Insights": {
    descriptor: "PSF-HCD FSC level 2, printed Secondary — flagged condensed paraphrase: read the hiring funnel — conversions per sourcing channel, assessment outcomes, talent gaps.",
    anchors: ["PSF-HCD CWF \"Source for Talents\": \"Measure and track conversion success rate for each sourcing channel\" · CWF \"Support Talent Development\": \"Maintain talent pool lists by levels in order to analyze talent gaps\""],
    specRef: "role-specs/hra.md — Human Resources Analytics and Insights row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "hra::Human Resources Practices Implementation": {
    descriptor: "PSF-HCD FSC level 2, printed Secondary — flagged condensed paraphrase: apply company HR policy and process correctly in every people action.",
    anchors: ["PSF-HCD CWF \"Recruit candidates\": \"Prepare employment offer letters and contracts, following standard templates and hiring regulations\""],
    specRef: "role-specs/hra.md — Human Resources Practices Implementation row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "hra::Human Resources Systems Management": {
    descriptor: "PSF-HCD FSC level 2, printed Secondary — flagged condensed paraphrase: keep the HRIS/ATS records flowing — enter, track, report.",
    anchors: ["PSF-HCD CWF \"Recruit candidates\": \"Document assessment results in an applicant bank for analysis and future reference\""],
    specRef: "role-specs/hra.md — Human Resources Systems Management row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "hra::Performance Management": {
    descriptor: "PSF-HCD FSC level 2, printed Secondary — flagged condensed paraphrase: records support for performance cycles (evaluations, data).",
    anchors: ["PSOC 4416: \"information on … performance evaluations\" (records scope)"],
    specRef: "role-specs/hra.md — Performance Management row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "hra::Skills Framework Adoption": {
    descriptor: "PSF-HCD FSC level 2, printed Secondary — flagged condensed paraphrase: promote and log adoption of the skills framework inside the company's people processes.",
    anchors: ["PSF-HCD CWF \"Coordinate Succession Planning\": \"Document critical roles identified in the organization\" — adjacent family activity"],
    specRef: "role-specs/hra.md — Skills Framework Adoption row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "hra::Stakeholder Engagement and Management": {
    descriptor: "PSF-HCD FSC level 2, printed Secondary — flagged condensed paraphrase: work day-to-day with hiring managers, applicants, new hires, and vendors.",
    anchors: ["PSF-HCD CWF \"Source for Talents\": \"Gather information on talent needs and job descriptions from various business units\""],
    specRef: "role-specs/hra.md — Stakeholder Engagement and Management row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "hra::Communication · Adaptability · Customer Orientation · Digital Fluency · Learning Agility · Self-Management (Enabling, Basic)": {
    descriptor: "PSF-HCD ESC bundle, all Basic, kept as one row as the artifact prints it — flagged condensed paraphrase: candidate-facing tier-1 behavior.",
    anchors: ["PSF-HCD role narrative, verbatim: \"They have a service-oriented mindset and can adapt to various forms of technology within their work space to enhance their work. They are eager to explore and are able to communicate information in a clear and concise manner to meet the needs of the team at the workplace.\""],
    specRef: "role-specs/hra.md — ESC bundle row",
    flags: ["flagged paraphrase (ESC bundle, ruled shape)"],
  },

  // ── training · Training Coordinator (3.2; spec training.md) ───────────────
  "training::Learning Needs Analysis": {
    descriptor: "PSF-HCD FSC level 3 (glossary, source-verbatim): \"Analyze capability and performance gaps within an organization to identify learning needs\".",
    anchors: ["PSF-HCD CWF \"Study People learning needs\": \"Collate data from line managers about current competencies of their employees.\" · \"Utilize profiling tools to identify workforce learning needs.\""],
    specRef: "role-specs/training.md — Learning Needs Analysis row",
  },
  "training::Learning and Development Programs Management": {
    descriptor: "PSF-HCD FSC level 2 — flagged condensed paraphrase: schedule, register and track participation in learning programs; coordinate delivery logistics end to end.",
    anchors: ["PSF-HCD CWF \"Coordinate learning programs\": \"Document learning programs to maintain a database.\" · \"Liaise with nominated internal trainers on learning requirements and ensure logistical requirements are fulfilled, including but not limited to training materials, training venue, training equipment, meals, attendance sheet, evaluation forms, hand-outs, etc.\""],
    specRef: "role-specs/training.md — Learning and Development Programs Management row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "training::Data Management": {
    descriptor: "PSF-HCD FSC level 2 — flagged condensed paraphrase (no clean glossary line): maintain the learning-program database and LMS records cleanly.",
    anchors: ["PSF-HCD CWF \"Coordinate learning programs\": \"Document learning programs to maintain a database.\" · \"Maintain LMS (Learning Management System) to monitor participation.\""],
    specRef: "role-specs/training.md — Data Management row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "training::Onboarding": {
    descriptor: "PSF-HCD FSC level 2 (glossary, same FSC as hra): \"Facilitate onboarding programs to enable the integration and engagement of new hires into the organization\".",
    anchors: ["PSF-HCD CWF \"Support learning programs delivery\": \"Assist in the implementation of onboarding and offboarding.\""],
    specRef: "role-specs/training.md — Onboarding row",
  },
  "training::Data Collection and Preparation": {
    descriptor: "PSF-HCD FSC level 2 (glossary): \"Collect human resource (HR) data from employees for the purpose of generating business and HR insights\".",
    anchors: ["PSF-HCD CWF \"Study People learning needs\": \"Collate data from line managers…\" · CWF \"Support learning programs delivery\": \"Generate learning and post-learning reports through evaluation survey findings.\""],
    specRef: "role-specs/training.md — Data Collection and Preparation row",
  },
  "training::Voluntary Exit Management": {
    descriptor: "PSF-HCD FSC level 2 — flagged condensed paraphrase: keep exit paperwork flowing with the L&D calendar.",
    anchors: ["PSF-HCD CWF \"Support learning programs delivery\": \"Assist in the implementation of onboarding and offboarding.\""],
    specRef: "role-specs/training.md — Voluntary Exit Management row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "training::Involuntary Exit Management": {
    descriptor: "PSF-HCD FSC level 2 — flagged condensed paraphrase: employer-initiated separations, same admin support.",
    anchors: ["Same block as Voluntary Exit Management"],
    specRef: "role-specs/training.md — Involuntary Exit Management row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "training::Employee Communication": {
    descriptor: "PSF-HCD FSC level 2, printed Secondary — flagged condensed paraphrase: course comms and reminders to employees.",
    anchors: ["PSF-HCD CWF \"Support learning programs delivery\": \"Send learning course instructions and reminders to employees.\""],
    specRef: "role-specs/training.md — Employee Communication row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "training::Human Resources Systems Management": {
    descriptor: "PSF-HCD FSC level 2, printed Secondary — flagged condensed paraphrase: LMS administration — enrollments, catalogs, reports.",
    anchors: ["PSF-HCD CWF \"Coordinate learning programs\": \"Maintain LMS (Learning Management System) to monitor participation.\""],
    specRef: "role-specs/training.md — Human Resources Systems Management row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "training::Performance Management": {
    descriptor: "PSF-HCD FSC level 2, printed Secondary — flagged condensed paraphrase: records support for performance-linked learning.",
    anchors: ["PSOC 2424 a): \"identifying training needs and requirements of individuals and organizations\" (family scope)"],
    specRef: "role-specs/training.md — Performance Management row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "training::Human Resources Analytics and Insights": {
    descriptor: "PSF-HCD FSC level 2, printed Secondary — flagged condensed paraphrase: participation and effectiveness reporting from learning data.",
    anchors: ["PSF-HCD CWF \"Support learning programs delivery\": \"Track employee participation rates in learning programs.\" · \"Generate learning and post-learning reports through evaluation survey findings.\""],
    specRef: "role-specs/training.md — Human Resources Analytics and Insights row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "training::Human Resources Practices Implementation": {
    descriptor: "PSF-HCD FSC level 2, printed Secondary — flagged condensed paraphrase: apply people-policy correctly inside program administration.",
    anchors: ["PSF-HCD CWF \"Support OD activities\": \"Maintains master copy of Organizational Structures, Job Descriptions and People Policies.\""],
    specRef: "role-specs/training.md — Human Resources Practices Implementation row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "training::Skills Framework Adoption": {
    descriptor: "PSF-HCD FSC level 2, printed Secondary — flagged condensed paraphrase: log use of skills-framework vocabulary in learning records.",
    anchors: ["PSF-HCD CWF \"Support OD activities\": \"Maintains master copy of Organizational Structures, Job Descriptions and People Policies.\" (family scope)"],
    specRef: "role-specs/training.md — Skills Framework Adoption row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "training::Stakeholder Engagement and Management": {
    descriptor: "PSF-HCD FSC level 2, printed Secondary — flagged condensed paraphrase: venues, vendors, trainers — the admin-facing relationship set.",
    anchors: ["PSF-HCD CWF \"Coordinate learning programs\": \"Source for external learning vendors for learning programs.\" · \"Liaise with nominated internal trainers on learning requirements…\""],
    specRef: "role-specs/training.md — Stakeholder Engagement and Management row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "training::Communication · Customer Orientation · Learning Agility · Self-Management · Problem Solving (Enabling, Basic)": {
    descriptor: "PSF-HCD ESC bundle, all Basic, one row as printed — including Problem Solving (Basic) restored from source (the roster's condensed list had omitted it).",
    anchors: ["PSF-HCD role narrative, verbatim: \"They are eager to explore and analyze problems and can communicate information clearly and concisely to meet others' needs at the workplace.\""],
    specRef: "role-specs/training.md — ESC bundle row (Problem Solving restoration applied)",
  },

  // ── mkt · Marketing Assistant/Associate (3.3; spec mkt.md) ────────────────
  "mkt::Communication (ESC-layer, printed in the Primary block)": {
    descriptor: "PSF-BD ESC-layer Basic, printed in the Primary block — flagged condensed paraphrase: campaign coordination messaging.",
    anchors: ["PSF-BD CWF \"Implement communication plans\": \"Contribute to development of communication messages\" · \"Maintain internal communication platforms and channels\""],
    specRef: "role-specs/mkt.md — Communication (ESC-layer) row",
    flags: ["flagged paraphrase row (ruling: accepted); ESC kept in the printed Primary-block shape (mkt's ESC items print inside the Primary list)"],
  },
  "mkt::Collaboration (ESC, Basic)": {
    descriptor: "PSF-BD ESC Basic — flagged condensed paraphrase: execute campaigns as a coordinated team.",
    anchors: ["PSF-BD role narrative, verbatim: \"he/she works closely with team members to execute and adjust marketing and communication activities through timely follow-up of information.\""],
    specRef: "role-specs/mkt.md — Collaboration (ESC) row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "mkt::Business Environment Analysis": {
    descriptor: "PSF-BD FSC level 2 — flagged condensed paraphrase: read the market/technological environment around campaigns.",
    anchors: ["PSF-BD CWF \"Implement marketing programs\": \"Collate information, market trends, new business opportunities, and market segments, on local and international business.\" · \"Collate information on emerging technological changes\""],
    specRef: "role-specs/mkt.md — Business Environment Analysis row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "mkt::Communications within Distribution Channels": {
    descriptor: "PSF-BD FSC level 2 — flagged condensed paraphrase: coordinate channel partners' marketing communications.",
    anchors: ["PSF-BD CWF \"Implement communication plans\": \"Monitor external communication platforms and channels\" (family evidence)"],
    specRef: "role-specs/mkt.md — Communications within Distribution Channels row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "mkt::Customer Orientation (ESC, Basic)": {
    descriptor: "PSF-BD ESC Basic — flagged condensed paraphrase: keep coordination decisions anchored to what customers respond to.",
    anchors: ["PSF-BD CWF \"Generate data-driven commercial insights\": \"Perform activities to implement data-driven insights\""],
    specRef: "role-specs/mkt.md — Customer Orientation (ESC) row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "mkt::Consumer Intelligence Analysis": {
    descriptor: "PSF-BD FSC level 1/2 — flagged condensed paraphrase: turn consumer-pattern data into actionable campaign knowledge.",
    anchors: ["PSOC 2431: \"analyzing data regarding consumer patterns and preferences\" · \"interpreting and predicting current and future consumer trends\""],
    specRef: "role-specs/mkt.md — Consumer Intelligence Analysis row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "mkt::Digital Fluency (ESC, Basic)": {
    descriptor: "PSF-BD ESC Basic — flagged condensed paraphrase: run campaign tooling fluently.",
    anchors: ["PSF-BD CWF \"Implement marketing programs\": \"Coordinate offline, online and social media marketing activities\""],
    specRef: "role-specs/mkt.md — Digital Fluency (ESC) row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "mkt::Content Development and Strategy": {
    descriptor: "PSF-BD FSC level 1/2 — flagged condensed paraphrase: brief, source and produce campaign content assets.",
    anchors: ["PSF-BD CWF \"Implement marketing programs\": \"Produce basic marketing materials\" · \"Source, acquire and manage stock images\""],
    specRef: "role-specs/mkt.md — Content Development and Strategy row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "mkt::Data Analysis and Interpretation": {
    descriptor: "PSF-BD FSC level 1/2 — flagged condensed paraphrase: keyword research and web-statistics reporting.",
    anchors: ["PSF-BD CWF \"Implement marketing programs\": \"Collate information for keyword research, bit-bite and web statistics reporting\" · \"Contribute to keyword research and web statistics reporting\""],
    specRef: "role-specs/mkt.md — Data Analysis and Interpretation row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "mkt::Digital Marketing": {
    descriptor: "PSF-BD FSC level 1/2 — flagged condensed paraphrase: coordinate paid/owned digital campaign activity.",
    anchors: ["PSF-BD CWF \"Implement marketing programs\": \"Coordinate offline, online and social media marketing activities\""],
    specRef: "role-specs/mkt.md — Digital Marketing row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "mkt::E-Commerce Campaign Management": {
    descriptor: "PSF-BD FSC level 2, printed in the Primary list — flagged condensed paraphrase: support campaign assets that drive online-store activity.",
    anchors: ["PSF-BD Primary FSC list prints this FSC at level 2; CWF anchor cited under Digital Marketing"],
    specRef: "role-specs/mkt.md — E-Commerce Campaign Management row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "mkt::Market Intelligence": {
    descriptor: "PSF-BD FSC level 2 — flagged condensed paraphrase: assemble market/competitor intelligence for campaign and growth decisions.",
    anchors: ["PSOC 2431: \"researching potential demand and market characteristics for new goods and services and collecting and analyzing data and other statistical information\""],
    specRef: "role-specs/mkt.md — Market Intelligence row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "mkt::Market Profiling": {
    descriptor: "PSF-BD FSC level 1/2 — flagged condensed paraphrase: segment and profile targets for campaigns.",
    anchors: ["PSF-BD CWF \"Implement marketing programs\": \"Collate information, market trends, new business opportunities, and market segments…\""],
    specRef: "role-specs/mkt.md — Market Profiling row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "mkt::Market Trend Analysis": {
    descriptor:
      "PSF-BD FSC level 1/2 — paraphrase per the study.com-strip ruling: reviewing historical data and present market conditions to identify patterns and predict trends (the ebook's glossary attributed this definition to study.com — study.com drops from citation; our paraphrase only).",
    anchors: ["PSF-BD CWF \"Implement marketing programs\": \"Collate information, market trends…\" · PSOC 2431: \"interpreting and predicting current and future consumer trends\""],
    specRef: "role-specs/mkt.md — Market Trend Analysis row (study.com verbatim quote STRIPPED to paraphrase — ruling 2026-10-29)",
    flags: ["study.com attribution removed; glossary quote paraphrased (ruling applied at fixture; spec file still carries the verbatim quote as citation residue)"],
  },
  "mkt::Marketing Communications Plan Development": {
    descriptor: "PSF-BD FSC level 2 — flagged condensed paraphrase: shape the message plan across channels.",
    anchors: ["PSF-BD CWF \"Implement communication plans\": \"Contribute to development of communication messages\""],
    specRef: "role-specs/mkt.md — Marketing Communications Plan Development row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "mkt::Marketing Mix Management": {
    descriptor:
      "PSF-BD FSC level 2 — paraphrase per the study.com-strip ruling: manage the marketing essentials (product mix, pricing, promotion, placement) as one campaign system.",
    anchors: ["PSOC 2431: \"advising on all elements of marketing such as product mix, pricing, advertising and sales promotion, selling, and distribution channels\""],
    specRef: "role-specs/mkt.md — Marketing Mix Management row (study.com strip applied)",
    flags: ["study.com attribution removed; glossary quote paraphrased (ruling applied at fixture)"],
  },
  "mkt::Media Strategy Development": {
    descriptor: "PSF-BD FSC level 1/2 — flagged condensed paraphrase: choose channels and placement for campaign reach.",
    anchors: ["PSOC 2431: \"writing advertising copy and media scripts, and arranging … media placement\" (family scope)"],
    specRef: "role-specs/mkt.md — Media Strategy Development row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "mkt::Social Media Marketing": {
    descriptor: "PSF-BD FSC level 1/2 — flagged condensed paraphrase: schedule, monitor and respond on social platforms.",
    anchors: ["PSF-BD CWF \"Implement marketing programs\": \"Monitor social media platforms\""],
    specRef: "role-specs/mkt.md — Social Media Marketing row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "mkt::Trend Forecasting": {
    descriptor: "PSF-BD FSC level 2 — flagged condensed paraphrase: surface what's rising so campaigns stay current.",
    anchors: ["PSOC 2431: \"interpreting and predicting current and future consumer trends\""],
    specRef: "role-specs/mkt.md — Trend Forecasting row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "mkt::Brand Campaign Management · Brand Guideline Development · Brand Marketing · Brand Portfolio Management": {
    descriptor: "PSF-BD Secondary FSC block carried as one row, as printed — brand-side campaign assets and consistency discipline.",
    anchors: ["PSF-BD Secondary FSC list, printed as a block"],
    specRef: "role-specs/mkt.md — Secondary-FSC block row (brand)",
  },
  "mkt::Business Opportunities Development · Demand Analysis · Market Research": {
    descriptor: "PSF-BD Secondary FSC block as printed — growth/demand research support.",
    anchors: ["PSOC 2431: \"commissioning and undertaking market research…\""],
    specRef: "role-specs/mkt.md — Secondary-FSC block row (growth/demand)",
  },
  "mkt::Category Marketing · Collateral Production · Visual Collaterals Production · Content Management": {
    descriptor: "PSF-BD Secondary FSC block as printed — collateral production and content upkeep.",
    anchors: ["PSF-BD CWF: \"Produce basic marketing materials\" · \"Source, acquire and manage stock images\""],
    specRef: "role-specs/mkt.md — Secondary-FSC block row (collateral/content)",
  },
  "mkt::Data-mining and Modelling · Research and Information Synthesis": {
    descriptor: "PSF-BD Secondary FSC block as printed — data-mining prep support.",
    anchors: ["PSF-BD CWF \"Generate data-driven commercial insights\": \"Prepare and collate data used to perform data-mining\""],
    specRef: "role-specs/mkt.md — Secondary-FSC block row (data-mining)",
  },
  "mkt::Events Planning and Management · Proposal Writing · Media Platforms Management": {
    descriptor: "PSF-BD Secondary FSC block as printed — event support, proposals, platform upkeep.",
    anchors: ["PSF-BD CWF \"Perform public relations activities\": \"Coordinate media-related events\" · \"Schedule public relations activities\""],
    specRef: "role-specs/mkt.md — Secondary-FSC block row (events/proposals)",
    flags: ["declared thin-resource zones: Proposal Writing + International Trade Legislation (no verified free course; honest limit)"],
  },
  "mkt::International Trade Legislation for Business · Retailing and the Economy · Website Design": {
    descriptor: "PSF-BD Secondary FSC block as printed — context/design support.",
    anchors: ["PSF-BD Secondary FSC list, printed as a block"],
    specRef: "role-specs/mkt.md — Secondary-FSC block row (trade/design)",
    flags: ["declared thin-resource zone: International Trade Legislation (no verified free course)"],
  },

  // ── sales · Sales Executive (3.4; spec sales.md) ─────────────────────────
  "sales::Customer Acquisition Management": {
    descriptor: "PSF-BD FSC level 2 — flagged condensed paraphrase: prospect, qualify and follow up leads across inbound/outbound channels.",
    anchors: ["PSF-BD CWF \"Develop new business opportunities\": \"Identify prospective clients and channel partners through calls, on-site visits, emails and networking or industry events\" · \"Source for new sales opportunities through inbound lead follow up\" · CWF \"Identify new sales opportunities\": \"Assist with analysis in benefits and value of the organization's products and services against possible needs of potential clients to qualify prospect\""],
    specRef: "role-specs/sales.md — Customer Acquisition Management row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "sales::Customer Relationship Management + Customer Relationship Management Operations": {
    descriptor:
      "PSF-BD FSC levels 2 and 1 & 2 — both printed, carried as one row (CRM item description from the ebook's end-glossary is study.com-attributed → STRIPPED to our paraphrase: manage and analyze customer interactions across the customer lifecycle).",
    anchors: ["PSF-BD CWF \"Convert sales opportunities to client accounts\": \"Maintain client database and documentation\" · CWF \"Manage relationship with clients and channel partners\": \"Develop relationships with existing and potential clients and channel partners through regular engagements\""],
    specRef: "role-specs/sales.md — CRM + CRM Operations row (study.com strip applied at fixture)",
    flags: ["study.com attribution removed; glossary quote paraphrased (ruling applied at fixture)"],
  },
  "sales::Sales Closure": {
    descriptor: "PSF-BD FSC level 2 — flagged condensed paraphrase: run the closing loop — follow-ups, contract submission, payment monitoring.",
    anchors: ["PSF-BD CWF \"Convert sales opportunities to client accounts\": \"Perform follow-up action to close sales\" · \"Monitor payment fulfilment activities\""],
    specRef: "role-specs/sales.md — Sales Closure row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "sales::Sales Delivery + Delivery Management": {
    descriptor: "PSF-BD FSC levels 1 & 2 — both printed, one row — flagged condensed paraphrase: track the deal through delivery to done.",
    anchors: ["PSF-BD CWF \"Manage channel sales operations\": \"Provide logistical sales support required to close orders\""],
    specRef: "role-specs/sales.md — Sales Delivery + Delivery Management row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "sales::Order Fulfilment Administration": {
    descriptor: "PSF-BD FSC levels 1 & 2 — flagged condensed paraphrase: the paperwork chain that turns a won deal into delivery.",
    anchors: ["PSF-BD CWF \"Convert…\": \"Monitor payment fulfilment activities\" · CWF \"Manage channel sales operations\": \"Provide logistical sales support required to close orders\""],
    specRef: "role-specs/sales.md — Order Fulfilment Administration row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "sales::Product Advisory + Product Demonstration": {
    descriptor:
      "PSF-BD FSC levels 1 — both printed, one row (glossary description is study.com-attributed → stripped to our paraphrase: explain the offer and demonstrate its use).",
    anchors: ["PSOC 3322: \"providing prospective customers with information about the characteristics and functions of the products and equipment for sale, and demonstrating its use or qualities\" · PSF-BD CWF \"Convert…\": \"Assist with the preparation of client presentation materials and conduct of product demonstration\""],
    specRef: "role-specs/sales.md — Product Advisory + Product Demonstration row (study.com strip applied)",
    flags: ["study.com attribution removed; glossary quote paraphrased (ruling applied at fixture)"],
  },
  "sales::After-sales Service": {
    descriptor: "PSF-BD FSC levels 1 & 2 — flagged condensed paraphrase: keep the account healthy after the sale — follow-ups, issue resolution.",
    anchors: ["PSF-BD CWF \"Develop new business opportunities\": \"After Sales Follow-up with clients/channel partners to grow relationships that assist in future revenue generation\" · PSOC 3322: \"following up clients to ensure satisfaction with products purchased\""],
    specRef: "role-specs/sales.md — After-sales Service row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "sales::Customer Management": {
    descriptor: "PSF-BD FSC levels 1 & 2 — flagged condensed paraphrase: day-to-day account relationship stewardship.",
    anchors: ["PSF-BD CWF \"Manage relationship with clients and channel partners\" key-task block (quoted in the spec)."],
    specRef: "role-specs/sales.md — Customer Management row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "sales::Customer Behavior Analysis": {
    descriptor: "PSF-BD FSC level 2 (glossary head, source-verbatim): \"Devise customer behavior analysis tools and approaches and perform analysis on information pertaining to customer behaviors\".",
    anchors: ["PSF-BD CWF \"Identify new sales opportunities\": \"Assist with client and channel partner research to uncover insights on potential business needs\""],
    specRef: "role-specs/sales.md — Customer Behavior Analysis row",
  },
  "sales::Contract and Vendor Management": {
    descriptor: "PSF-BD FSC level 2 — flagged condensed paraphrase: contracts, price quotations, partner paperwork.",
    anchors: ["PSF-BD role narrative, verbatim: \"coordinates the formulation of price quotations, submission of sales contract for orders and maintenance of customer records.\""],
    specRef: "role-specs/sales.md — Contract and Vendor Management row",
    flags: ["flagged paraphrase row (ruling: accepted); quotation-paperwork zone declared thin (no verified free resource)"],
  },
  "sales::Account Management": {
    descriptor: "PSF-BD FSC level 2 — flagged condensed paraphrase: the structured account plan layer as accounts mature.",
    anchors: ["PSF-BD CWF \"Manage relationship with clients and channel partners\" (family scope)"],
    specRef: "role-specs/sales.md — Account Management row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "sales::Customer Experience Management": {
    descriptor: "PSF-BD FSC level 2 — flagged condensed paraphrase: experience quality across touchpoints.",
    anchors: ["PSF-BD CWF \"Manage relationship…\": \"Coordinate resolution of inquiries and problems from clients and channel partner\""],
    specRef: "role-specs/sales.md — Customer Experience Management row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "sales::Design Concepts Generation · Idea Generation and Selection · Narrative Design · Shopper Marketing Campaign Management": {
    descriptor: "PSF-BD Secondary FSC block as printed — co-marketing asset ideation support.",
    anchors: ["PSF-BD CWF \"Manage channel sales operations\": \"Assist with the development of channel sales product promotions and co-marketing activities for lead generation\""],
    specRef: "role-specs/sales.md — Secondary-FSC block row (design/creative)",
    flags: ["flagged paraphrase rows (ruling: accepted)"],
  },
  "sales::Retail Space Utilization": {
    descriptor: "PSF-BD FSC level 2 — flagged condensed paraphrase: retail-context selling where the channel is store-based.",
    anchors: ["PSF-BD Primary FSC list prints it at L2; PH note: applies to trade/retail channels"],
    specRef: "role-specs/sales.md — Retail Space Utilization row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "sales::Stakeholder Management": {
    descriptor: "PSF-BD FSC level 2 — flagged condensed paraphrase: multi-party coordination across the selling team.",
    anchors: ["PSF-BD CWF \"Manage relationship…\": \"Translate client and channel partner needs to Analyst/Team Lead for timely inclusion into actionable insights…\""],
    specRef: "role-specs/sales.md — Stakeholder Management row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "sales::Supplier Performance · Supplier Sourcing": {
    descriptor: "PSF-BD Secondary FSC block as printed — channel/vendor hygiene from the sales side.",
    anchors: ["PSF-BD CWF \"Manage relationship…\": \"Implement mechanisms to evaluate and categorize channel partners\""],
    specRef: "role-specs/sales.md — Secondary-FSC block row (suppliers)",
    flags: ["flagged paraphrase rows (ruling: accepted)"],
  },
  "sales::Communication · Collaboration · Customer Orientation · Global Perspective · Problem Solving (Enabling)": {
    descriptor: "PSF-BD ESC print block: Communication Intermediate · Collaboration Intermediate · Customer Orientation Intermediate · Global Perspective Basic · Problem Solving Intermediate.",
    anchors: ["PSF-BD role narrative, verbatim: \"He/She works in a fast-paced and dynamic environment, and travels to clients' premises for meetings as and when required. …He/She is a team player who is able to take rejection as a personal challenge to succeed when given the next opportunity.\""],
    specRef: "role-specs/sales.md — ESC bundle row",
  },

  // ── csr · Customer Service Representative (3.5; spec csr.md) ─────────────
  "csr::Communicate effectively in English for customer service": {
    descriptor: "TESDA CCS NC II unit descriptor (verbatim): \"This unit covers the knowledge and skills needed to communicate effectively in English while conducting a customer service delivery process.\"",
    anchors: ["TESDA ICT313365 criteria (verbatim): \"3 C's of communication is applied to effectively deliver messages, feedback and instruction\" · \"Listening effectively is demonstrated by being able to appropriately respond to questions and requests\""],
    specRef: "role-specs/csr.md — TESDA unit ICT313365 row",
  },
  "csr::Perform customer service delivery processes": {
    descriptor: "TESDA CCS NC II unit descriptor (verbatim): \"This unit covers the knowledge and skills needed to effectively conduct a customer service delivery process.\"",
    anchors: ["TESDA ICT313366 criteria (verbatim): \"Calls are answered in accordance with enterprise inbound procedures\" · \"Customer needs are identified appropriately to avoid irritation\" · \"Information from a call is captured and recorded accurately in accordance with prescribed process guidelines\""],
    specRef: "role-specs/csr.md — TESDA unit ICT313366 row",
  },
  "csr::Demonstrate ability to effectively engage customers": {
    descriptor: "TESDA CCS NC II unit descriptor (verbatim): \"This unit covers the knowledge and skills needed to demonstrate an ability to engage customers.\"",
    anchors: ["TESDA ICT313367 criteria (verbatim): \"Ability to sense feelings of customer and respond accordingly to acknowledge such feelings is demonstrated\" · \"Empathy for the customer was demonstrated according to the purpose of the call\""],
    specRef: "role-specs/csr.md — TESDA unit ICT313367 row",
  },
  "csr::Customer Service Delivery": {
    descriptor: "PSF-CCB FSC level 2 (glossary, source-verbatim): \"Anticipate customer needs and provide quality customer service.\"",
    anchors: ["PSF-CCB CWF \"Deliver quality customer experience\": \"Address customer queries and concerns through various channels in a timely manner\" · \"Gather information, analyze situations, and develop solutions to customer issues\""],
    specRef: "role-specs/csr.md — Customer Service Delivery row",
  },
  "csr::Customer Handling and Care": {
    descriptor: "PSF-CCB FSC level 2 — flagged condensed paraphrase: empathy, de-escalation and resolution behavior inside the call (glossary Skills Application prints \"Manage dissatisfied customers and escalate the complaints when necessary\").",
    anchors: ["PSF-CCB CWF \"Deliver quality customer experience\": \"Demonstrate empathy and understanding towards customer concerns\""],
    specRef: "role-specs/csr.md — Customer Handling and Care row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "csr::Customer Relationship Management": {
    descriptor: "PSF-CCB FSC level 2 — flagged condensed paraphrase: CRM logging of every customer interaction accurately.",
    anchors: ["PSF-CCB CWF \"Maintain clients' customer databases\": \"Maintain the client's customer database to ensure it is up-to-date\" · \"Record customers' requests accurately and follow-up actions into database system\""],
    specRef: "role-specs/csr.md — Customer Relationship Management row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "csr::Compliance with Legal Regulations": {
    descriptor: "PSF-CCB FSC level 1 — flagged condensed paraphrase: handle personal data and service rules inside the call per law (PSF-CCB invokes RA 10173).",
    anchors: ["PSF-CCB CWF \"Deliver quality…\": \"Escalate to Subject Matter Expert or Supervisor or specialized teams when necessary\" · glossary Skills Application: \"Handle breaches of customer security and safety guidelines\""],
    specRef: "role-specs/csr.md — Compliance with Legal Regulations row",
    flags: ["flagged paraphrase row (ruling: accepted); privacy.gov.ph 403 — lawphil supplies the statute text (standing re-check)"],
  },
  "csr::Technology and Systems Application": {
    descriptor: "PSF-CCB FSC level 2 (glossary, source-verbatim): \"Apply and integrate evaluated technologies into the organization's operations or processes to achieve the desired outcomes.\"",
    anchors: ["PSF-CCB role narrative, verbatim: \"…strong computer literacy for streamlined processing of customer documentation.\" · PSOC 4222: \"identifying requirements and entering events into a computer system\""],
    specRef: "role-specs/csr.md — Technology and Systems Application row",
  },
  "csr::Consumer Intelligence Analysis · Sentiment Analysis · Problem Identification · Continuous Improvement Management · Customer Acquisition Management · Brand Campaign Management (printed FSC list block)": {
    descriptor: "PSF-CCB printed secondary FSC list carried as one grouped row — these items sit below the agent's three CWFs (cross-sell sits inside \"Identify opportunities to promote additional products or services\").",
    anchors: ["PSF-CCB CWF \"Deliver quality…\": \"Identify opportunities to promote additional products or services\" · \"Provide feedback to the organization on areas of improvement from customers, tools, platforms to enhance customer experience\""],
    specRef: "role-specs/csr.md — grouped FSC list row",
    flags: ["flagged paraphrase (grouped row as printed)"],
  },
  "csr::Collaboration · Communication · Customer Orientation · Digital Fluency · Problem Solving · Global Perspective (Enabling, Basic/Intermediate)": {
    descriptor: "PSF-CCB ESC bundle as printed: Collaboration Basic · Communication Intermediate · Customer Orientation Intermediate · Digital Fluency Intermediate · Problem Solving Intermediate · Global Perspective Basic.",
    anchors: ["PSF-CCB role narrative, verbatim: \"As a communicative, attentive, and patient team player, they adeptly address customer issues, ensuring best-in-class experience and overall customer satisfaction.\""],
    specRef: "role-specs/csr.md — ESC bundle row",
  },

  // ── opsanalyst · Operations Analyst (3.6; spec opsanalyst.md) ─────────────
  "opsanalyst::Process study planning (scoping the study of work problems)": {
    descriptor:
      "Source-verbatim O*NET task text: \"Plan study of work problems and procedures, such as organizational change, communications, information flow, integrated production methods, inventory control, or cost analysis.\" (declared [O*NET] gap-filler per ADR-0001 — no PH artifact owns this family; honesty flag stays with the row).",
    anchors: ["[PSOC 2421] e): \"undertaking and reviewing work studies by analyzing existing and proposed methods and procedures such as administrative and clerical procedures\""],
    specRef: "role-specs/opsanalyst.md — Process study planning row",
    flags: ["flagged condensed row name (ruling: accepted 2026-10-29); O*NET version pin pending (Model C)"],
  },
  "opsanalyst::Information gathering & organizing": {
    descriptor: "Source-verbatim: \"Gather and organize information on problems or procedures.\"",
    anchors: ["[PSOC 2421] f): \"recording and analyzing organizations' work flow charts, records, reports, manuals and job descriptions\""],
    specRef: "role-specs/opsanalyst.md — Information gathering row",
    flags: ["flagged condensed row name (ruling: accepted)"],
  },
  "opsanalyst::On-site observation & interviewing": {
    descriptor: "Source-verbatim: \"Interview personnel and conduct on-site observation to ascertain unit functions, work performed, and methods, equipment, and personnel used.\"",
    anchors: ["[PSOC 2421] c): \"discussing current systems with staff and observing systems at all levels of organization\""],
    specRef: "role-specs/opsanalyst.md — On-site observation row",
    flags: ["flagged condensed row name (ruling: accepted)"],
  },
  "opsanalyst::Data analysis & solution framing": {
    descriptor: "Source-verbatim: \"Analyze data gathered and develop solutions or alternative methods of proceeding.\"",
    anchors: ["[PSOC 2421] d): \"directing clients towards more efficient organization and developing solutions to organizational problems\""],
    specRef: "role-specs/opsanalyst.md — Data analysis & solution framing row",
    flags: ["flagged condensed row name (ruling: accepted); SQL/data-pull zone declared thin (no verified resource)"],
  },
  "opsanalyst::Findings documentation & recommendation write-ups": {
    descriptor: "Source-verbatim: \"Document findings of study and prepare recommendations for implementation of new systems, procedures, or organizational changes.\"",
    anchors: ["[PSOC 2421] g): \"preparing and recommending proposals to revise methods and procedures, alter work flows, redefine job functions and resolve organizational problems\""],
    specRef: "role-specs/opsanalyst.md — Findings documentation row",
    flags: ["flagged condensed row name (ruling: accepted); process-mapping-notation zone declared thin"],
  },
  "opsanalyst::Implementation support & training of revised methods": {
    descriptor: "Source-verbatim: \"Prepare manuals and train workers in use of new forms, reports, procedures or equipment, according to organizational policy.\" · \"Confer with personnel concerned to ensure successful functioning of newly implemented systems or procedures.\"",
    anchors: ["[PSOC 2421] h): \"assisting in implementing approved recommendations, issuing revised instructions and procedure manuals\""],
    specRef: "role-specs/opsanalyst.md — Implementation support row",
    flags: ["flagged condensed row name (ruling: accepted)"],
  },
  "opsanalyst::Forms/reports review & redesign": {
    descriptor: "Source-verbatim: \"Review forms and reports and confer with management and users about format, distribution, and purpose, identifying problems and improvements.\" · \"Design, evaluate, recommend, and approve changes of forms and reports.\"",
    anchors: ["[PSOC 2421] i): \"reviewing operating procedures and advising of departures from procedures and standards\""],
    specRef: "role-specs/opsanalyst.md — Forms/reports review row",
    flags: ["flagged condensed row name (ruling: accepted)"],
  },
  "opsanalyst::Records-management program design": {
    descriptor: "Source-verbatim: \"Develop and implement records management program for filing, protection, and retrieval of records, and assure compliance with program.\"",
    anchors: ["Adjacent-family task (O*NET prints it; entry-tier ops analysts usually support, not own)"],
    specRef: "role-specs/opsanalyst.md — Records-management program design row",
    flags: ["flagged condensed row name (ruling: accepted)"],
  },
  "opsanalyst::PSOC 2421 corroboration block (lettered task a)": {
    descriptor: "[PSOC 2421] lettered task a, verbatim — the tasks not covered by O*NET rows, quoted as the sibling corroboration row (no O*NET counterpart).",
    anchors: ["[PSOC 2421] a): \"assisting and encouraging the development of objectives, strategies and plans aimed at achieving customer satisfaction and the efficient use of organizations' resources\""],
    specRef: "role-specs/opsanalyst.md — PSOC corroboration block row",
  },
  "opsanalyst::Communication · Critical Thinking · Teamwork (Enabling)": {
    descriptor: "Flagged condensed paraphrase: cross-functional behavior (O*NET work-activity quotes stay OUT of the row vocabulary — activity layer, not tasks).",
    anchors: ["O*NET 13-1111.00 work activities (verbatim, attributed): \"Getting Information — Observing, receiving, and otherwise obtaining information from all relevant sources.\" · \"Communicating with Supervisors, Peers, or Subordinates — Providing information to supervisors, co-workers, and subordinates by telephone, in written form, e-mail, or in person.\" · \"Establishing and Maintaining Interpersonal Relationships — Developing constructive and cooperative working relationships with others, and maintaining them over time.\""],
    specRef: "role-specs/opsanalyst.md — enabling bundle row",
  },

  // ── purch · Purchasing Officer (3.7; spec purch.md) ──────────────────────
  "purch::Purchase order issuance & requisition review": {
    descriptor: "Source-verbatim O*NET 13-1023.00 task text: \"Prepare purchase orders, solicit bid proposals, and review requisitions for goods and services.\"",
    anchors: ["[PSOC 3323] d): \"inviting tenders, consulting with suppliers and reviewing quotations\""],
    specRef: "role-specs/purch.md — Purchase order issuance & requisition review row",
    flags: ["flagged condensed row name (ruling: accepted)"],
  },
  "purch::Price-proposal analysis": {
    descriptor: "Source-verbatim: \"Analyze price proposals, financial reports, and other data and information to determine reasonable prices.\"",
    anchors: ["[PSOC 3323] g): \"interviewing suppliers and negotiating prices, discounts, credit terms and transportation arrangements\""],
    specRef: "role-specs/purch.md — Price-proposal analysis row",
    flags: ["flagged condensed row name (ruling: accepted); negotiation zone declared thin"],
  },
  "purch::Best-value purchasing (quality/price/amount)": {
    descriptor: "Source-verbatim: \"Purchase the highest quality merchandise at the lowest possible price and in correct amounts.\"",
    anchors: ["[PSOC 3323] c): \"purchasing general and specialized equipment, materials or business services for use or for further processing by their establishment\""],
    specRef: "role-specs/purch.md — Best-value purchasing row",
    flags: ["flagged condensed row name (ruling: accepted)"],
  },
  "purch::Legal & policy compliance (procurement rules)": {
    descriptor: "Source-verbatim: \"Monitor and follow applicable laws and regulations.\"",
    anchors: ["[PSOC 3323] a): \"determining or negotiating contract terms and conditions…\" (contract-discipline family)"],
    specRef: "role-specs/purch.md — Legal & policy compliance row",
    flags: ["RA 9184 caveat travels with its resource wherever it renders (ruling 2026-10-29: \"governs public procurement; private-sector practice borrows its discipline\"); private-sector-specifics zone declared thin (CIPS paid — not cited)"],
  },
  "purch::Supplier research & evaluation": {
    descriptor: "Source-verbatim: \"Research and evaluate suppliers, based on price, quality, selection, service, support, availability, reliability, production and distribution capabilities, and the supplier's reputation and history.\"",
    anchors: ["[PSOC 3323] f): \"studying market reports, trade periodicals and sales promotion materials and visiting trade shows, showrooms, factories and product design events\""],
    specRef: "role-specs/purch.md — Supplier research & evaluation row",
    flags: ["flagged condensed row name (ruling: accepted)"],
  },
  "purch::Contract performance monitoring": {
    descriptor: "Source-verbatim: \"Evaluate and monitor contract performance to ensure compliance with contractual obligations and to determine need for changes.\" · \"Negotiate, renegotiate, and administer contracts with suppliers, vendors, and other representatives.\"",
    anchors: ["[PSOC 3323] i): \"establishing delivery schedules, monitoring progress and contacting clients and suppliers to resolve problems\""],
    specRef: "role-specs/purch.md — Contract performance monitoring row",
    flags: ["flagged condensed row name (ruling: accepted)"],
  },
  "purch::Product specification writing": {
    descriptor: "Source-verbatim: \"Write and review product specifications, maintaining a working technical knowledge of the goods or services to be purchased.\"",
    anchors: ["[PSOC 3323] b): \"obtaining information about requirements and stock and developing specifications for quantity and quality to be purchased…\""],
    specRef: "role-specs/purch.md — Product specification writing row",
    flags: ["flagged condensed row name (ruling: accepted)"],
  },
  "purch::Records & shipment monitoring": {
    descriptor: "Source-verbatim: \"Maintain and review computerized or manual records of purchased items, costs, deliveries, product performance, and inventories.\" · \"Monitor shipments to ensure that goods come in on time, and resolve problems related to undelivered goods.\"",
    anchors: ["[PSOC 3323] h): \"overseeing distribution of merchandise to outlets and maintaining adequate stock levels\""],
    specRef: "role-specs/purch.md — Records & shipment monitoring row",
    flags: ["flagged condensed row name (ruling: accepted); inventory-ERP hands-on zone declared thin"],
  },
  "purch::Market watching (supply/demand, price trends)": {
    descriptor: "Source-verbatim: \"Monitor changes affecting supply and demand, tracking market conditions, price trends, or futures markets.\"",
    anchors: ["Adjacent task (O*NET prints; entry tier supports)"],
    specRef: "role-specs/purch.md — Market watching row",
    flags: ["flagged condensed row name (ruling: accepted)"],
  },
  "purch::Communication · Critical Thinking · Ethics/Professionalism (Enabling)": {
    descriptor: "Flagged condensed paraphrase: vendor-relationship behavior.",
    anchors: ["O*NET 13-1023.00 work activities (verbatim): \"Communicating with People Outside the Organization — Communicating with people outside the organization, representing the organization to customers, the public, government, and other external sources…\" · \"Evaluating Information to Determine Compliance with Standards — Using relevant information and individual judgment to determine whether events or processes comply with laws, regulations, or standards.\""],
    specRef: "role-specs/purch.md — enabling bundle row",
  },

  // ── ccqa · Quality Analyst, Contact Center (3.8; spec ccqa.md) ────────────
  "ccqa::Data Analytics": {
    descriptor: "PSF-CCB FSC level 3 (glossary, source-verbatim): \"Elucidate data using business intelligence tools and data analytics techniques to uncover trends and generate insights\".",
    anchors: ["PSF-CCB CWF \"Execute data analytics operations\": \"Perform data analysis which includes scrubbing of audits for additional Quality insights as well as RCA (Root Cause Analysis) sessions with the Service Delivery team\" · \"Generate graphs, dashboards on data trends and distributions in reference to specific key performance indicators (KPIs) to measure business performance\""],
    specRef: "role-specs/ccqa.md — Data Analytics row",
  },
  "ccqa::Continuous Improvement": {
    descriptor: "PSF-CCB FSC level 3 — flagged condensed paraphrase: turn audit findings into improvement follow-ups.",
    anchors: ["PSF-CCB CWF \"Facilitate achievement of quality expectations and standards\": \"Follow-up actions to support improvement from the findings of internal and external audits\" · \"Provide inputs in improving the learning materials based on audit trends.\""],
    specRef: "role-specs/ccqa.md — Continuous Improvement row",
    flags: ["flagged paraphrase row (ruling: accepted); calibration/rubric zone is the recorded honest hole"],
  },
  "ccqa::Customer Behavior Analysis": {
    descriptor: "PSF-BD glossary head shared-FSC provenance flagged (source-verbatim): \"Devise customer behavior analysis tools and approaches and perform analysis on information pertaining to customer behaviors\".",
    anchors: ["PSF-CCB CWF \"Facilitate achievement…\": \"Understand customer information and needs, to improve customer relationships\""],
    specRef: "role-specs/ccqa.md — Customer Behavior Analysis row (shared-FSC provenance flagged)",
  },
  "ccqa::Customer Management": {
    descriptor: "PSF-CCB FSC level 3 — flagged condensed paraphrase: stakeholder-side coordination of the quality program.",
    anchors: ["PSF-CCB CWF \"Facilitate achievement…\": \"Support handling and resolution of customer complaints\" · \"Review the records of customer complaints and the organization's responses…\""],
    specRef: "role-specs/ccqa.md — Customer Management row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "ccqa::Systems Thinking": {
    descriptor: "PSF-CCB FSC level 3 — flagged condensed paraphrase: read quality issues as system-wide patterns (workflow, channel, process).",
    anchors: ["PSF-CCB CWF \"Execute data analytics operations\": \"Monitor transactions based on assigned channel of support\" · \"Collect data on products, services, platforms, customer segments… from identified performance gaps versus the set targets and processes\""],
    specRef: "role-specs/ccqa.md — Systems Thinking row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "ccqa::Document Control": {
    descriptor: "PSF-CCB FSC level 2 — flagged condensed paraphrase: audit documentation discipline — record, store, track.",
    anchors: ["PSF-CCB CWF \"Manage document control procedures\": \"Ensure audits results and findings are documented according to standard procedures and requirements\" · \"Track document updates and distribution\""],
    specRef: "role-specs/ccqa.md — Document Control row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "ccqa::Technical Report Writing": {
    descriptor: "PSF-CCB FSC level 2 — flagged condensed paraphrase: QA reports and coaching feedback write-ups.",
    anchors: ["PSF-CCB CWF \"Execute data analytics operations\": \"Generate reports to share insights from research and analysis with other departments and/or stakeholders\""],
    specRef: "role-specs/ccqa.md — Technical Report Writing row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "ccqa::Analytical Method Validation": {
    descriptor: "PSF-CCB FSC level 2 — flagged condensed paraphrase: keep the scoring method itself sound (valid, repeatable audits).",
    anchors: ["PSF-CCB role overview, verbatim: \"…the Quality Assurance Auditor performs audit, observations, and validation activities…\""],
    specRef: "role-specs/ccqa.md — Analytical Method Validation row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "ccqa::Data Visualization": {
    descriptor: "PSF-CCB FSC level 2 — flagged condensed paraphrase: dashboards/graphs for KPI communication.",
    anchors: ["PSF-CCB CWF \"Execute data analytics operations\": \"Generate graphs, dashboards on data trends and distributions…\""],
    specRef: "role-specs/ccqa.md — Data Visualization row",
    flags: ["flagged paraphrase row (ruling: accepted)"],
  },
  "ccqa::Change Management · Concept Creation · Coaching and Mentoring · Conflict Resolution · Risk Management and Administration": {
    descriptor: "PSF-CCB printed supporting FSCs carried as one row (one sub-row per printed FSC in the spec) — supporting behaviors for the QA seat.",
    anchors: ["PSF-CCB CWF \"Facilitate achievement…\": \"Facilitate QA talks during New Hire onboarding\" (coaching anchor) · \"Monitor lapses in delivery of services to customers\" (risk anchor)"],
    specRef: "role-specs/ccqa.md — supporting-FSC block row",
    flags: ["flagged paraphrase rows (ruling: accepted)"],
  },
  "ccqa::Collaboration · Communication · Creative Thinking · Critical Thinking · Customer Orientation · Digital Fluency · Problem Solving · Project Management · Research · Stakeholder Management (Enabling, I/B)": {
    descriptor: "PSF-CCB ESC bundle as printed: 7 Intermediate (Collaboration, Communication, Creative Thinking, Critical Thinking, Customer Orientation, Digital Fluency, Problem Solving) + 3 Basic (Project Management, Research, Stakeholder Management).",
    anchors: ["PSF-CCB role overview, verbatim: \"Possessing knowledge of basic analytics tools, and research techniques, effective communication, creative thinking, and attention to detail characterize this role…\""],
    specRef: "role-specs/ccqa.md — ESC bundle row",
  },

  // ── events · Events / Conference Coordinator (3.9; spec events.md) ────────
  "events::Client objectives & requirements determination": {
    descriptor: "Source-verbatim O*NET 13-1121.00 task text: \"Consult with customers to determine objectives and requirements for events, such as meetings, conferences, and conventions.\"",
    anchors: ["[PSOC 3332] c): \"meeting with clients to discuss their needs and outlining package options to meet these needs\""],
    specRef: "role-specs/events.md — Client objectives row",
    flags: ["flagged condensed row name (ruling: accepted)"],
  },
  "events::Event services coordination": {
    descriptor: "Source-verbatim: \"Coordinate services for events, such as accommodation and transportation for participants, facilities, catering, signage, displays, special needs requirements, printing and event security.\"",
    anchors: ["[PSOC 3332] d): \"arranging and coordinating services, such as, conference facilities, catering, signage, displays, audiovisual and computer equipment, accommodation, transport and social events… logistical arrangements for presenters\""],
    specRef: "role-specs/events.md — Event services coordination row",
    flags: ["flagged condensed row name (ruling: accepted); event-management-software hands-on zone declared thin"],
  },
  "events::Provider evaluation & selection; contract negotiation": {
    descriptor: "Source-verbatim: \"Evaluate and select providers of services according to customer requirements.\" · \"Negotiate contracts with such service providers and suppliers as hotels, convention centers, and speakers.\"",
    anchors: ["[PSOC 3332] f): \"negotiating the type and costs of services to be provided within budget\""],
    specRef: "role-specs/events.md — Provider evaluation & selection row",
    flags: ["flagged condensed row name (ruling: accepted)"],
  },
  "events::Facility inspection & conformity": {
    descriptor: "Source-verbatim: \"Inspect event facilities to ensure that they conform to customer requirements.\"",
    anchors: ["[PSOC 3332] g): \"overseeing work by contractors and reporting on variations to work orders\" (oversight family)"],
    specRef: "role-specs/events.md — Facility inspection row",
    flags: ["flagged condensed row name (ruling: accepted)"],
  },
  "events::Program, agenda, budget & services planning": {
    descriptor: "Source-verbatim: \"Plan and develop programs, agendas, budgets, and services according to customer requirements.\" · \"Meet with sponsors and organizing committees to plan scope and format of events, to establish and monitor budgets, or to review administrative procedures and event progress.\"",
    anchors: ["[PSOC 3332] framing: \"organize and coordinate services for conferences, events, functions, banquets and seminars\""],
    specRef: "role-specs/events.md — Program/agenda/budget planning row",
    flags: ["flagged condensed row name (ruling: accepted); MPI SPA-title honesty note on its resource"],
  },
  "events::Participant registration": {
    descriptor: "Source-verbatim: \"Organize registration of event participants.\"",
    anchors: ["[PSOC 3332] e): \"organizing registration of participants\""],
    specRef: "role-specs/events.md — Participant registration row",
    flags: ["flagged condensed row name (ruling: accepted)"],
  },
  "events::Event-records keeping (incl. financials)": {
    descriptor: "Source-verbatim: \"Maintain records of event aspects, including financial details.\" · \"Verify accuracy of records.\"",
    anchors: ["[PSOC 3332] g): \"…reporting on variations to work orders\" (records family)"],
    specRef: "role-specs/events.md — Event-records keeping row",
    flags: ["flagged condensed row name (ruling: accepted)"],
  },
  "events::Event monitoring, compliance & problem resolution": {
    descriptor:
      "Source-verbatim: \"Monitor event activities to ensure compliance with applicable regulations and laws, satisfaction of participants, and resolution of any problems that arise.\" · \"Obtain permits from fire and health departments to erect displays and exhibits and serve food at events.\"",
    anchors: ["[PSOC 3332] g): \"overseeing work by contractors…\""],
    specRef: "role-specs/events.md — Event monitoring row",
    flags: ["flagged condensed row name (ruling: accepted); the permit task is US-institutional — the PH note (venue/LGU permits; no verified free resource) rides the accepted row shape (mechanical confirm at copy time)"],
  },
  "events::Bills review & payment approval": {
    descriptor: "Source-verbatim: \"Review event bills for accuracy and approve payment.\" · \"Authorize financial actions.\"",
    anchors: ["Budget-tracking family (O*NET prints; entry tier executes under finance approval)"],
    specRef: "role-specs/events.md — Bills review row",
    flags: ["flagged condensed row name (ruling: accepted)"],
  },
  "events::Post-event evaluation": {
    descriptor: "Source-verbatim: \"Conduct post-event evaluations to determine how future events could be improved.\"",
    anchors: ["Improvement-loop family"],
    specRef: "role-specs/events.md — Post-event evaluation row",
    flags: ["flagged condensed row name (ruling: accepted)"],
  },
  "events::Marketing & publicizing support": {
    descriptor: "Source-verbatim: \"Promote conference, convention and trades show services by performing tasks such as meeting with professional and trade associations, and producing brochures and other publications.\"",
    anchors: ["[PSOC 3332] a): \"promoting conferences, conventions and trade shows to potential customers\""],
    specRef: "role-specs/events.md — Marketing & publicizing row",
    flags: ["flagged condensed row name (ruling: accepted)"],
  },
  "events::Administrative details & inquiries": {
    descriptor: "Source-verbatim: \"Direct administrative details, such as financial operations, dissemination of promotional materials, and responses to inquiries.\" · \"Correspond with customers to answer questions or resolve complaints.\"",
    anchors: ["[PSOC 3332] b): \"responding to inquiries concerning services provided and costs for room and equipment hire, catering and related services\""],
    specRef: "role-specs/events.md — Administrative details row",
    flags: ["flagged condensed row name (ruling: accepted)"],
  },
  "events::Communication · Professionalism · Teamwork (Enabling)": {
    descriptor: "Flagged condensed paraphrase: client/hotel coordination behavior.",
    anchors: ["O*NET 13-1121.00 work activities (verbatim): \"Performing for or Working Directly with the Public — Performing for people or dealing directly with the public…\" · \"Scheduling Work and Activities — Scheduling events, programs, and activities, as well as the work of others.\" · \"Communicating with People Outside the Organization — Communicating with people outside the organization, representing the organization to customers, the public, government, and other external sources…\""],
    specRef: "role-specs/events.md — enabling bundle row",
  },
};

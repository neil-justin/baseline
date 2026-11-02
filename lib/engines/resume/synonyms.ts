/**
 * Keyword-alignment synonym seed — round 6a, template-authored (NO LLM calls
 * in this build). The diagnostic matches a role's core-tier skills against the
 * resume text; skills have many real phrasings, so each entry lists harmless
 * synonyms/aliases that count as evidence.
 *
 * Seeds follow the catalog round (this file's standing rule): the 2026-10-30
 * fixture conversion re-keyed the catalog onto the BLESSED spec row shapes,
 * so the demo trio's seeds are re-checked against those maps and the
 * newly-converted roles' core rows are seeded below. Every `like` phrase is
 * derived from the row's own name or its source-printed descriptor/task text
 * in the spec files (role-specs/*.md → lib/fixtures/rowspec/*) — nothing
 * invented. Unseeded roles fall back to matching the bare skill name
 * (word-boundary, lowercase — see synonymsForSkill).
 */

export interface SynonymSeed {
  /** extra phrases (lowercased) that count as evidence of the skill */
  like: string[];
}

export const SKILL_SYNONYMS: Record<string, SynonymSeed> = {
  // ── Associate Software Developer (swd) — core tier ──────────────────────
  "Applications Development": {
    like: [
      "application development", "app development", "programming", "python", "java",
      "javascript", "typescript", "coding", "php", "c#", "software development",
    ],
  },
  "Applications Support and Enhancement": {
    like: ["support and enhancement", "application support", "maintenance", "extending applications", "troubleshooting", "bug fixes", "fixing bugs", "enhancement requests"],
  },
  "Agile Software Development": {
    like: ["agile", "scrum", "sprint", "standup", "iterative development"],
  },
  "Data Design / SQL + data modeling": {
    like: ["sql", "data modeling", "database design", "mysql", "postgresql", "schema", "database queries", "queries"],
  },
  "Secure-coding practices": {
    like: ["secure coding", "secure-coding", "input validation", "authentication", "access control", "owasp", "security practices"],
  },

  // ── Data Analyst (da) — core tier per current roster ────────────────────
  "Data Analytics": {
    like: ["data analysis", "analytics", "spreadsheets", "excel", "google sheets", "pivot tables", "cleaned data", "data cleaning"],
  },
  "Data Visualization and Storytelling": {
    like: ["data visualization", "dashboards", "power bi", "charts", "dashboard", "tableau", "storytelling"],
  },
  "ETL (extract-transform-load workflows)": {
    like: ["etl", "extract-transform-load", "data pipeline", "data transformation"],
  },

  // ── IT Support Technician (its) — core tier per current roster ─────────
  "Infrastructure Support": {
    like: ["infrastructure", "desktop support", "hardware repair", "hardware troubleshooting", "printer", "pc repair", "computer repair"],
  },
  "Infrastructure Deployment": {
    like: ["deployment", "os installation", "operating system installation", "system setup", "image deployment", "provisioning"],
  },
  "Network Administration and Maintenance": {
    like: ["network administration", "network maintenance", "lan", "directory", "user accounts"],
  },
  "Network Configuration": {
    like: ["network configuration", "network setup", "router", "switch", "cabling", "wifi setup", "network cables", "ip"],
  },

  // ── Software QA Analyst (qa) — core tier per current roster ────────────
  // Seeded with the ticket-12 demo re-cut (2026-10-29): the switch walk to qa
  // makes the money beat's Application Materials pass run against THIS map —
  // the seeds follow the catalog round's rows (the file's own TODO rule).
  "Software Testing": {
    like: ["software testing", "test cases", "test execution", "test automation", "manual testing", "regression testing", "uat", "system testing"],
  },
  "Test Planning": {
    like: ["test planning", "test plan", "test scenarios", "test cases", "test data", "testable conditions"],
  },
  "Defect management": {
    like: ["defect management", "defect tracking", "bug tracking", "bug reports", "log defects", "defect reports"],
  },
  "Quality Assurance / Quality Standards": {
    like: ["quality assurance", "quality standards", "quality gates", "release readiness", "coverage metrics"],
  },

  // ── Business Analyst, IT (ba 2.3 — core rows incl. the ruled Team-Enablement
  // flip; phrases trace to the CWF key-task text in the spec) ─────────────
  "Requirements Analysis": {
    like: ["requirements analysis", "requirements gathering", "stakeholder interviews", "gap analysis", "business rules documentation", "workshops"],
  },
  "Requirements Specification": {
    like: ["functional specifications", "user stories", "wireframes", "prototypes", "brd", "srs"],
  },
  "Solution Support (UAT & hand-over)": {
    like: ["uat", "user acceptance testing", "solution support", "deployment support", "change management", "training support"],
  },
  "Process modeling (flow diagrams, use cases)": {
    like: ["process modeling", "flowcharts", "use cases", "process flow diagrams", "diagrams"],
  },
  "Business Needs Analysis": {
    // global key (ba core · da core · swd/qa secondary): phrases kept
    // low-inference and shared across the family
    like: ["business needs", "stakeholder requirements", "requirements gathering", "business analysis"],
  },
  "Team Enablement": {
    like: ["team enablement", "agile ceremonies", "cross-department relationships", "subject matter experts"],
  },

  // ── Network / Systems Administrator (sysadmin 2.5) + Database Administrator
  // (dba 2.6) — remaining core-row names (not the sub-rows? sub-rows seeded above) ──
  "Systems administration (user groups, upgrades, backups)": {
    like: ["system administration", "server administration", "user accounts", "patching", "backups", "system upgrades"],
  },
  "Database Administration": {
    like: ["database administration", "dbms administration", "backup and recovery", "database maintenance", "performance monitoring"],
  },
  "Database security controls": {
    like: ["database security", "privileges", "permissions", "data integrity controls"],
  },

  // ── Security Analyst (cybersec 2.7 — core row) ────────────────────────
  "Threat analysis / monitoring": {
    like: ["threat monitoring", "threat analysis", "threat intelligence", "security monitoring", "siem", "alert triage"],
  },

  // ══ 2026-10-30 fixture conversion — seeds for the newly-converted roles.
  // Core-tier rows only (the resume diagnostic matches the core tier, per
  // analyze.ts keywordMatch); phrases trace to the row names or the
  // source-printed descriptor/task text carried in the rowspec layer.

  // ── HR Assistant (hra 3.1) ──────────────────────────────────────────────
  "Recruitment Channel Management": {
    like: ["recruitment channels", "sourcing channels", "recruiting channels", "sourcing", "candidate sourcing"],
  },
  "Selection Management": {
    like: ["candidate screening", "resume screening", "applicant screening", "selection process", "shortlisting", "assessment administration"],
  },
  "Onboarding": {
    like: ["onboarding", "new hire orientation", "employee orientation", "on-boarding"],
  },
  "Data Collection and Preparation": {
    like: ["hr data collection", "employee data", "people data", "hr reports", "data collection"],
  },
  "Data Management": {
    like: ["records management", "employee records", "candidate database", "applicant tracking", "hris", "training records", "participation tracking", "learning records"],
  },
  "Digital Marketing and Communication": {
    like: ["employer brand", "employer branding", "recruitment marketing", "hiring collateral", "digital reach"],
  },
  "Diversity, Equity, Inclusion and Belonging Management": {
    like: ["diversity", "inclusion", "equity", "deib", "non-discrimination"],
  },
  "Talent Capability Assessment": {
    like: ["talent assessment", "assessment tools", "talent pool", "skill assessments"],
  },
  "Employee Communication Management": {
    like: ["internal communications", "employee communications", "people-ops messaging"],
  },

  // ── Training Coordinator (training 3.2) ────────────────────────────────
  "Learning Needs Analysis": {
    like: ["training needs analysis", "learning needs", "training needs", "needs analysis", "skill gap analysis", "training gap"],
  },
  "Learning and Development Programs Management": {
    like: ["learning and development", "l&d", "training programs", "training logistics", "training coordination", "training schedule"],
  },

  // ── Marketing Assistant (mkt 3.3) ───────────────────────────────────────
  "Business Environment Analysis": { like: ["market environment", "business environment", "competitor analysis", "competitive landscape"] },
  "Communications within Distribution Channels": { like: ["channel partners", "trade marketing", "channel communications", "distributor communications"] },
  "Consumer Intelligence Analysis": { like: ["consumer insights", "consumer research", "audience research", "focus groups", "surveys"] },
  "Content Development and Strategy": { like: ["content strategy", "content creation", "copywriting", "blog writing", "content calendar", "content assets"] },
  "Digital Marketing": { like: ["digital marketing", "paid campaigns", "google ads", "facebook ads", "sem", "email marketing", "online campaigns"] },
  "Market Intelligence": { like: ["market intelligence", "market research", "competitor research", "market data"] },
  "Market Profiling": { like: ["market segmentation", "audience segmentation", "target profiling", "personas"] },
  "Market Trend Analysis": { like: ["trend analysis", "market trends", "trend reports"] },
  "Marketing Communications Plan Development": { like: ["marketing communications", "marcom", "campaign messaging", "comms plan"] },
  "Marketing Mix Management": { like: ["marketing mix", "4ps", "product pricing", "pricing strategy", "product mix"] },
  "Media Strategy Development": { like: ["media strategy", "media planning", "media buying", "ad placement"] },
  "Social Media Marketing": { like: ["social media", "social media management", "facebook page", "instagram", "tiktok", "community management", "social posts"] },

  // ── Sales Executive (sales 3.4) ────────────────────────────────────────
  "Customer Acquisition Management": { like: ["lead generation", "prospecting", "cold calling", "qualifying leads", "pipeline building", "inbound leads", "outbound"] },
  "Customer Relationship Management + Customer Relationship Management Operations": { like: ["crm", "salesforce", "hubspot", "pipeline records", "customer records"] },
  "Sales Closure": { like: ["closing", "closing sales", "deal closing", "quotations", "contract submission"] },
  "Sales Delivery + Delivery Management": { like: ["order delivery", "sales fulfillment", "delivery coordination"] },
  "Order Fulfilment Administration": { like: ["order processing", "purchase orders", "sales orders", "fulfillment paperwork"] },
  "Product Advisory + Product Demonstration": { like: ["product demo", "product demonstrations", "product advisory", "product knowledge", "demonstrations"] },
  "After-sales Service": { like: ["after-sales", "after sales", "post-sale follow up", "customer follow up", "account health"] },
  "Customer Management": { like: ["account stewardship", "client relationships", "relationship management"] },

  // ── Customer Service Representative (csr 3.5) ──────────────────────────
  "Communicate effectively in English for customer service": { like: ["english communication", "english fluency", "voice and accent", "verbal communication", "customer conversations"] },
  "Perform customer service delivery processes": { like: ["customer service", "call handling", "inbound calls", "outbound calls", "chat support", "email support", "sla"] },
  "Demonstrate ability to effectively engage customers": { like: ["customer engagement", "rapport", "active listening", "empathy", "de-escalation"] },
  "Customer Service Delivery": { like: ["service delivery", "customer queries", "resolution", "first call resolution"] },
  "Customer Handling and Care": { like: ["customer care", "empathy", "difficult customers", "complaint handling"] },
  "Customer Relationship Management": { like: ["crm", "logging interactions", "case notes", "ticketing"] },
  "Compliance with Legal Regulations": { like: ["data privacy", "ra 10173", "regulatory compliance", "opt-in"] },

  // ── Operations Analyst (opsanalyst 3.6) ────────────────────────────────
  "Process study planning (scoping the study of work problems)": { like: ["process study", "work study", "process review", "operations study"] },
  "Information gathering & organizing": { like: ["data gathering", "gather information", "organizing data", "information synthesis"] },
  "On-site observation & interviewing": { like: ["site observation", "shadowing", "stakeholder interviews", "process interviews", "field observation"] },
  "Data analysis & solution framing": { like: ["data analysis", "solution options", "root cause analysis", "alternative methods", "process analysis"] },
  "Findings documentation & recommendation write-ups": { like: ["findings", "recommendations", "sop writing", "process documentation", "write-ups", "reporting"] },

  // ── Purchasing Officer (purch 3.7) ─────────────────────────────────────
  "Purchase order issuance & requisition review": { like: ["purchase orders", "po processing", "requisitions", "requisition review", "purchase request"] },
  "Price-proposal analysis": { like: ["price proposals", "bid analysis", "quote comparison", "vendor quotes", "cost analysis"] },
  "Best-value purchasing (quality/price/amount)": { like: ["best value", "procurement", "purchasing", "supplier selection", "sourcing"] },
  "Legal & policy compliance (procurement rules)": { like: ["procurement rules", "procurement compliance", "procurement policy", "purchasing policy"] },

  // ── Quality Analyst, Contact Center (ccqa 3.8) ─────────────────────────
  // NOTE: skill-name keys are global (one entry per NAME across roles).
  // ccqa's Data Analytics / Customer Management share exact names with
  // da/sales — ccqa's rows fall back to bare-name matching there (kept
  // distinct, no cross-role phrase bleed).
  "Continuous Improvement": { like: ["continuous improvement", "kaizen", "process improvement", "improvement follow-ups"] },
  "Customer Behavior Analysis": { like: ["customer behavior", "interaction patterns", "customer insights"] },
  "Systems Thinking": { like: ["systems thinking", "root-cause", "systemic issues", "end-to-end process"] },
  "Document Control": { like: ["document control", "documentation standards", "records discipline", "version control of docs"] },
  "Technical Report Writing": { like: ["report writing", "qa reports", "coaching forms", "technical writing"] },

  // ── Events / Conference Coordinator (events 3.9) ───────────────────────
  "Client objectives & requirements determination": { like: ["client briefing", "event objectives", "event requirements", "kick-off"] },
  "Event services coordination": { like: ["event coordination", "vendor coordination", "logistics coordination", "accommodation arrangements", "transportation"] },
  "Provider evaluation & selection; contract negotiation": { like: ["vendor evaluation", "supplier selection", "contract negotiation", "supplier contracts"] },
  "Facility inspection & conformity": { like: ["venue inspection", "site inspection", "venue check"] },
  "Program, agenda, budget & services planning": { like: ["event planning", "event agenda", "event budget", "run of show", "program flow"] },
  "Participant registration": { like: ["registration", "rsvp", "attendee lists", "event registration"] },
  "Event-records keeping (incl. financials)": { like: ["event records", "expense records", "event documentation"] },
  "Event monitoring, compliance & problem resolution": { like: ["on-site management", "event monitoring", "troubleshooting", "permits"] },

  // ── Bookkeeper (book 4.1) ──────────────────────────────────────────────
  "Journalize transactions": { like: ["journal entries", "journalizing", "bookkeeping", "double-entry", "general journal"] },
  "Post transactions": { like: ["posting", "posting entries", "ledgers", "general ledger", "transfer entries"] },
  "Prepare trial balance": { like: ["trial balance", "trial balances", "unadjusted trial balance"] },
  "Prepare financial reports (manual)": { like: ["financial statements", "financial reports", "income statement", "balance sheet"] },

  // ── Accounting Clerk (acctclerk 4.2) ──────────────────────────────────
  "Check figures, postings, and documents for correct entry, mathematical accuracy, and proper codes": { like: ["checking figures", "verify postings", "invoice checking", "3-way match", "match invoices", "document checking"] },
  "Operate computers programmed with accounting software": { like: ["accounting software", "quickbooks", "xero", "sap", "erp", "spreadsheets", "excel", "10-key"] },
  "Classify, record, and summarize numerical and financial data to compile and keep financial records, using journals and ledgers or computers": { like: ["record keeping", "bookkeeping", "journal entries", "financial records"] },
  "Reconcile or note and report discrepancies found in records": { like: ["reconciliation", "reconcile accounts", "discrepancies", "statement reconciliation"] },
  "Prepare and issue account statements / bills / invoices": { like: ["invoicing", "billing", "statements", "invoice preparation", "bills"] },

  // ── Payroll Assistant (pay 4.3) ───────────────────────────────────────
  "Verify attendance, hours worked, and pay adjustments, and post information onto designated records": { like: ["attendance records", "timekeeping", "timesheets", "dtr", "pay adjustments"] },
  "Compute wages and deductions, and enter data into computers": { like: ["payroll computation", "wages", "deductions", "gross to net", "payroll processing", "payroll run", "withholding tax"] },
  "Prepare and balance period-end reports, and reconcile issued payrolls to bank statements": { like: ["payroll register", "payroll reconciliation", "period-end", "bank statements"] },
  "Process and issue employee paychecks and statements of earnings and deductions": { like: ["payslips", "paychecks", "payout", "statements of earnings", "payroll disbursement"] },

  // ── Finance & Accounting Associate (fas 4.4) ──────────────────────────
  "Perform financial accounting and corporate reporting activities": { like: ["financial accounting", "month-end close", "corporate reporting", "journal entries", "double-entry", "reconciliation"] },
  "Process business transactions and reports using information technology tools": { like: ["erp", "sap", "oracle", "accounting system", "data entry", "system reports"] },
  "Support strategic planning": { like: ["budgeting", "forecasting", "fp&a", "financial modeling support", "management reports"] },
  "Accounting and Tax Systems": { like: ["accounting systems", "erp modules", "tax systems"] },
  "Data Collection and Analysis": { like: ["data collection", "business intelligence", "data analysis", "bi tools"] },
  "Financial Analysis": { like: ["financial analysis", "ratio analysis", "financial ratios", "analysis"] },

  // ── Financial Analyst (fin 4.5) ───────────────────────────────────────
  "Analyze financial information to forecast business, industry, or economic conditions for investment decisions": { like: ["financial forecasting", "forecasting", "investment analysis", "financial analysis"] },
  "Monitor economic, industrial, and corporate developments": { like: ["market monitoring", "industry research", "market monitoring", "business developments"] },
  "Employ financial models to develop solutions to financial problems or to assess the financial or capital impact of transactions": { like: ["financial modeling", "financial models", "dcf", "valuation"] },
  "Interpret data on price, yield, stability, future investment-risk trends, economic influences": { like: ["investment data analysis", "risk assessment", "yield analysis"] },
  "Recommend investments and investment timing": { like: ["investment recommendations", "investment proposals", "stock recommendations"] },
  "Present oral or written reports on general economic trends, individual corporations, and entire industries": { like: ["research reports", "client presentations", "presentations", "industry reports"] },

  // ── Treasury Assistant (treasury 4.6) ─────────────────────────────────
  "Balance currency, coin, and checks in cash drawers at ends of shifts and calculate daily transactions, using computers, calculators, or adding machines": { like: ["cash balancing", "cash counting", "daily cash", "cash reconciliation", "cash drawer"] },
  "Enter customers' transactions into computers to record transactions and issue computer-generated receipts": { like: ["transaction recording", "receipts", "transaction entry", "teller systems"] },
  "Reconcile records of financial transactions": { like: ["reconciliation", "bank reconciliation", "reconciling"] },

  // ── Bill & Account Collector (coll 4.7) ───────────────────────────────
  "Locate and notify customers of delinquent accounts by mail, telephone, or personal visits to solicit payment": { like: ["collections", "delinquent accounts", "collection calls", "past due", "dialer"] },
  "Arrange for debt repayment or establish repayment schedules, based on customers' financial situations": { like: ["payment arrangements", "repayment plans", "payment schedules", "restructuring"] },
  "Record information about financial status of customers and status of collection efforts": { like: ["account status", "case notes", "crm logging", "promise to pay"] },
  "Confer with customers by telephone or in person to determine reasons for overdue payments and to review the terms of sales, service, or credit contracts": { like: ["negotiation", "payment terms", "account conversations", "handling objections"] },
  "Receive payments and post amounts paid to customer accounts": { like: ["payment posting", "posting payments", "cash handling"] },

  // ── Credit Analyst, entry (credit 4.8) ────────────────────────────────
  "Researching and evaluating loan applicant's financial status, references, credit and ability to repay the loan": { like: ["credit investigation", "credit analysis", "financial status evaluation", "credit assessment", "credit bureau"] },
  "Interviewing applicants for personal, mortgage, student and business loans": { like: ["applicant interviews", "client interviews", "loan interviews"] },
  "Submitting credit and loan applications to management with recommendations for approval or rejection; approving or rejecting within authorized limits": { like: ["credit approval", "recommendations", "approval limits"] },
  "Keeping records of payments, and preparing routine letters requesting payment for overdue accounts and forwarding these for legal action": { like: ["demand letters", "records of payments", "past-due letters"] },
  "Completing credit and loan documentation": { like: ["credit documentation", "loan documents", "documentation"] },

  // ── Bank Teller (teller 4.9) ──────────────────────────────────────────
  "Receive checks and cash for deposit, verify amounts, and check accuracy of deposit slips": { like: ["deposits", "deposit verification", "checking signatures", "check processing"] },
  "Resolve problems or discrepancies concerning customers' accounts": { like: ["discrepancy resolution", "account investigations", "discrepancies"] },
  "Receive mortgage, loan, or public utility bill payments, verifying payment dates and amounts due / process term deposits and other savings-plan transactions": { like: ["bill payments", "transfers", "term deposits", "bills payment"] },

  // ── Audit Associate (audit 4.10) ──────────────────────────────────────
  "Prepare, examine, or analyze accounting records, financial statements, or other financial reports to assess accuracy, completeness, and conformance to reporting and procedural standards": { like: ["accounting records", "financial statements", "audit procedures", "substantive testing"] },
  "Review accounts for discrepancies and reconcile differences": { like: ["reconciliation", "account review", "discrepancies"] },
  "Collect and analyze data to detect deficient controls, duplicated effort, extravagance, fraud, or non-compliance with laws, regulations, and management policies": { like: ["internal controls", "fraud detection", "control testing", "compliance testing"] },
  "Inspect cash on hand, notes receivable and payable, negotiable securities, and canceled checks to confirm records are accurate": { like: ["cash count", "cash inspection", "inventory verification", "document inspection"] },
  "Examine records and interview workers to ensure recording of transactions and compliance with laws and regulations": { like: ["walkthroughs", "client interviews", "compliance", "records examination"] },
  "Prepare detailed reports on audit findings": { like: ["audit reports", "workpapers", "working papers", "audit documentation"] },

  // ── Web Developer (webdev 2.8 — blessed shape row) ────────────────────
  "Client-side coding (HTML/CSS/JS)": {
    like: ["html", "css", "javascript", "front-end", "frontend", "react", "responsive web", "web development"],
  },
  "↳ task-cluster sub-row: site life-operations": {
    like: ["website updates", "website maintenance", "site backups", "domain renewal", "website testing", "performance improvements"],
  },
  "CMS administration (WordPress etc.)": {
    like: ["cms", "wordpress", "content management", "themes", "plugins", "webflow", "wix"],
  },

  // ── Network / Systems Administrator (sysadmin 2.5 sub-rows) ───────────
  "↳ CWF sub-row: Design and develop new systems": { like: ["systems development", "systems implementation", "uat", "itil"] },
  "↳ CWF sub-row: Optimize systems performance": { like: ["performance optimization", "capacity", "systems tuning", "upgrades"] },
  "↳ CWF sub-row: Oversee service level agreements and service improvements": { like: ["sla", "service level", "service improvements", "metrics"] },
  "↳ CWF sub-row: Resolve system-related incidents": { like: ["incident resolution", "troubleshooting", "escalation"] },

  // ── SOC Analyst (soc E4 — blessed extraction) ─────────────────────────
  "Monitor cyber security systems": { like: ["security monitoring", "siem", "log analysis", "alert triage", "edr", "threat monitoring"] },
  "Maintain cyber security operations": { like: ["security operations", "security checks", "status reports", "protocols"] },
  "Manage response to cyber security incidents": { like: ["incident response", "incident reports", "severity analysis", "escalation"] },

  // ── Digital / Multimedia Artist (digart 2.9 — verbatim TR units) ──────
  "DEVELOP DESIGNS FOR A LOGO (ICT216313)": { like: ["logo design", "logo design brief", "logos"] },
  "DEVELOP DESIGNS FOR PRINT MEDIA (ICT216314)": { like: ["print design", "print media", "posters", "brochures", "layout", "tarps"] },
  "DEVELOP DESIGNS FOR USER EXPERIENCE (ICT216315)": { like: ["ux design", "user experience", "wireframes", "prototypes"] },
  "DEVELOP DESIGNS FOR USER INTERFACE (ICT216316)": { like: ["ui design", "user interface", "interface design"] },
  "DEVELOP DESIGNS FOR PRODUCT PACKAGING (ICT216317)": { like: ["packaging design", "product packaging", "dielines"] },
  "DESIGN BOOTH AND PRODUCT WINDOW / DISPLAY (ICT216318)": { like: ["booth design", "window display", "trade show", "exhibit design"] },
  "Use specialized graphic/animation tools (Adobe suite, Blender etc.)": { like: ["photoshop", "illustrator", "indesign", "blender", "adobe", "canva", "figma", "premiere", "after effects"] },
  "Follow creative brief + brand guideline development": { like: ["creative brief", "brand guidelines", "design brief", "brand development"] },
  "Client communication & revision handling": { like: ["client revisions", "design revisions", "feedback", "client communication"] },

  // ── Office & Administration track ──────────────────────────────────────
  // adminassoc (5.1)
  "Filing systems (paper/electronic) operation": { like: ["filing systems", "electronic filing", "records filing", "paper filing", "document filing"] },
  "Database entry & maintenance": { like: ["data entry", "database entry", "database maintenance", "spreadsheets"] },
  "Multi-channel reception & call routing": { like: ["receptionist", "answering phones", "call routing", "callers", "front desk reception", "transferring calls"] },
  "Office equipment operation & basic troubleshooting": { like: ["office equipment", "copiers", "fax machines", "printers", "equipment troubleshooting"] },
  // clerk (5.2)
  "Recording, preparing, sorting, classifying and filing information": { like: ["sorting documents", "classifying records", "filing information", "compiling records"] },
  "Sorting, opening and sending mail": { like: ["sorting mail", "incoming mail", "outgoing mail", "mail room", "correspondence"] },
  "Photocopying and sending documents": { like: ["photocopying", "photocopy", "scanning documents", "sending documents"] },
  "Routine reports & correspondence": { like: ["routine reports", "correspondence", "business letters", "memos"] },
  "Responding to enquiries (telephone/electronic) or forwarding": { like: ["answering enquiries", "telephone enquiries", "forwarding requests", "responding to requests"] },
  // encode (5.3)
  "Receiving & registering source documents for data capture": { like: ["registering documents", "source documents", "document intake", "batch intake"] },
  "Source-document reading & field mapping (entering from source material)": { like: ["data entry", "field mapping", "entering data", "keying", "key-in", "encoding"] },
  "Accuracy/error detection & correction": { like: ["error detection", "correction", "verification", "accuracy checks", "compare data"] },
  "Compilation, sorting, verification before entry": { like: ["compile data", "sorting data", "pre-entry checks", "verify data"] },
  // desk (5.5 — the ruled 5 lettered rows)
  "Answering inquiries about goods/services/policies (availability, location, price)": { like: ["answering inquiries", "product inquiries", "desk inquiries", "providing information"] },
  "Assisting on problems, advice, information (member of the counter service set)": { like: ["assisting customers", "advisory", "counter service", "helping visitors"] },
  "Recording information about enquiries and complaints": { like: ["logging inquiries", "complaints log", "recording complaints", "follow-up"] },
  "Referring complex enquiries to team leaders or expert advisers": { like: ["escalation", "referrals", "referred", "transfer to supervisor"] },
  "Issuing forms, information kits and brochures": { like: ["issuing forms", "brochures", "information kits", "handouts"] },
  // execsec (E2 — core rows; secondary rows fall back to bare-name matching)
  "Executive schedule & calendar management": { like: ["calendar management", "scheduling meetings", "executive calendar", "appointments"] },
  "Correspondence & document production": { like: ["correspondence", "memos", "letters", "reports", "spreadsheets", "word processing", "document production"] },
  "Meeting administration & minutes": { like: ["minutes", "meeting minutes", "agendas", "board meetings", "taking minutes"] },
  "Information gatekeeping: calls & visitors": { like: ["screening calls", "directing calls", "greeting visitors", "gatekeeping"] },
  "Research & briefing support for executives": { like: ["research", "briefing papers", "briefings", "compiling data"] },
  "Incoming-material triage & distribution": { like: ["sorting mail", "triage", "distributing correspondence", "incoming mail"] },
  "Office services coordination": { like: ["office services", "budget preparation", "housekeeping coordination", "personnel issues"] },
  "Travel arrangements": { like: ["travel arrangements", "booking flights", "itineraries", "travel bookings"] },
  // records (E3 — lettered-task core rows)
  "Sort & classify materials to filing rules": { like: ["sorting records", "classifying records", "filing rules", "alphabetical order", "numeric order"] },
  "Filing into storage (drawers/cabinets/boxes)": { like: ["filing", "filing records", "storage boxes", "cabinets"] },
  "File retrieval on request": { like: ["file retrieval", "retrieving records", "locating files", "pulling records"] },
  "Filing log / records of materials filed & removed": { like: ["filing log", "charge-out records", "records of materials"] },
  "Reprographics: photocopy, scan, fax": { like: ["photocopying", "scanning", "faxing", "reprographics"] },
};

/**
 * The per-role synonym lookup: seeded entries for the demo trio, and for any
 * other career the bare skill name itself (the caller lowercases and
 * word-boundary-matches). Never invents — this only widens recognition of
 * what the role's own catalog rows name.
 */
export function synonymsForSkill(skillName: string): SynonymSeed {
  return SKILL_SYNONYMS[skillName] ?? { like: [skillName.toLowerCase()] };
}

import type { RowSpecMap } from "@/lib/fixtures/rowspec/types";

/**
 * Accounting & Finance track — per-row deep data from the BLESSED role specs
 * (book · acctclerk · pay · fas · fin · treasury · coll · credit · teller · audit).
 * Rules mirror it.ts/business.ts: descriptor = source text where it prints one
 * (verbatim); anchors = attributed verbatim task text, never invented; specRef
 * = spec file + row id; rulings/fixed statuses carry in `flags`.
 *
 * Track-specific carries (per the conversion brief + row-shape rulings):
 *  - statutory keep-with-flag wording travels (pay/teller portals, BIR eFPS
 *    dead-in-copy, RA 3765 dead-in-copy on coll/credit, RA 9184/9298 caveats);
 *  - fas level relabels are transcribed AS CORRECTED in the spec file
 *    (corrections-applied items 5; relabel notes travel verbatim);
 *  - audit's Professional Skepticism row is KEPT (NACE-backed) and row 11 is
 *    the O*NET Software Skills technology row — O*NET version-pin flag rides
 *    it (no individual technology names printed until the pin — ADR 0005);
 *  - phscs "[sic]" spelling quirks (Bookeeping/Bookeeper) travel with their
 *    brackets where the spec records them.
 */

export const ROW_SPECS_ACCOUNTING: RowSpecMap = {
  // ── book · Bookkeeper (4.1; spec book.md) ─────────────────────────────────
  "book::Journalize transactions": {
    descriptor: "None printed on the TR unit name (spec honesty note 1 — the TR prints no descriptor sentences under unit titles); source-verbatim unit title confirmed two ways (roster-session TR read + TOP module title \"Journalizing Transactions\").",
    anchors: [
      "TESDA Bookkeeping NC III TR unit (roster-recorded wording, live-checked against TOP module title)",
      "O*NET 43-3031.00 (corroboration, never primary): \"Classify, record, and summarize numerical and financial data to compile and keep financial records, using journals and ledgers or computers.\"",
    ],
    specRef: "role-specs/book.md Row 1 — Journalize transactions",
  },
  "book::Post transactions": {
    descriptor: "TR standard (unit-scoped, verbatim — quoted against the fetched TR PDF, 2026-10-29): \"Postings are done with 100% accuracy\" (Post transactions unit; prior \"roster-recorded wording\" upgraded to direct TR-read confirmation — V-book-2).",
    anchors: [
      "TESDA TR posting unit",
      "O*NET 43-3031.00: \"Transfer details from separate journals to general ledgers or data processing sheets.\" · \"Compare computer printouts to manually maintained journals to determine if they match.\"",
    ],
    specRef: "role-specs/book.md Row 2 — Post transactions",
    flags: ["\"100% accuracy\" caution retired — the five verbatim unit-scoped standard lines supersede the bare phrase (V-book-2, corrections applied 2026-10-29)"],
  },
  "book::Prepare trial balance": {
    descriptor: "TR standard (unit-scoped, verbatim): \"Trial Balances are extracted with 100% accuracy\" (Prepare trial balance unit; V-book-2).",
    anchors: [
      "TESDA TR trial-balance unit",
      "O*NET 43-3031.00: \"Prepare trial balances of books.\"",
    ],
    specRef: "role-specs/book.md Row 3 — Prepare trial balance",
  },
  "book::Prepare financial reports (manual)": {
    descriptor: "None printed (TR unit title as recorded).",
    anchors: [
      "TESDA TR financial-reports unit",
      "O*NET 43-3031.00: \"Calculate, prepare, and issue bills, invoices, account statements, and other financial statements according to established procedures.\" · \"Compile statistical, financial, accounting, or auditing reports and tables pertaining to such matters as cash receipts, expenditures, accounts payable and receivable, and profits and losses.\"",
    ],
    specRef: "role-specs/book.md Row 4 — Prepare financial reports (manual)",
  },
  "book::Review internal control system": {
    descriptor: "None printed — the TR's incremental advanced unit at NC III.",
    anchors: [
      "TESDA TR internal-control unit",
      "O*NET 43-3031.00 (US-context corroboration; PH compliance layer is a later platform addendum): \"Comply with federal, state, and company policies, procedures, and regulations.\"",
    ],
    specRef: "role-specs/book.md Row 5 — Review internal control system",
  },
  "book::Verify and record financial documents & records": {
    descriptor: "O*NET overview (verbatim): \"Compute, classify, and record numerical data to keep financial records complete. Perform any combination of routine calculating, posting, and verifying duties to obtain primary financial data for use in maintaining accounting records.\" (O*NET corroboration — not invented as a new named row: anchored in O*NET's own task sentences.)",
    anchors: [
      "O*NET 43-3031.00: \"Check figures, postings, and documents for correct entry, mathematical accuracy, and proper codes.\" · \"Reconcile or note and report discrepancies found in records.\" · \"Receive, record, and bank cash, checks, and vouchers.\"",
    ],
    specRef: "role-specs/book.md Row 6 — Verify and record financial documents & records",
  },
  "book::Operate accounting software": {
    descriptor: "No descriptor printed — O*NET-verb row; the row is the attributed task anchor above (source-verbatim), tiered per the spec.",
    anchors: [
      "O*NET 43-3031.00: \"Operate computers programmed with accounting software to record, store, and analyze information.\" · \"Debit, credit, and total accounts on computer spreadsheets and databases, using specialized accounting software.\"",
    ],
    specRef: "role-specs/book.md Row 7 — Operate accounting software",
  },
  "book::PSOC 3313 record-to-report envelope": {
    descriptor: "PSOC 3313 framing (verbatim): \"Accounting associate professionals maintain complete records of financial transactions of an undertaking and verify accuracy of documents and records relating to such transactions.\"",
    anchors: [
      "PSOC 3313 lettered tasks a)–c): \"a) maintaining complete records of all financial transactions of an undertaking according to general bookkeeping principles, with guidance from Accountants; b) verifying accuracy of documents and records relating to payments, receipts and other financial transactions; c) preparing financial statements and reports for specified periods\"",
    ],
    specRef: "role-specs/book.md Row 8 — PSOC 3313 record-to-report envelope",
    flags: ["phscs PSOC mirror spells \"Bookeeper\" [sic] in the 3313 example list — quote as-is with the [sic] if cited formally (spec honesty note 2)"],
  },
  "book::Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Self Management (Enabling)": {
    descriptor: "No descriptor printed — PSF row (CWF/FSC name as printed); the attributed key-task anchor above carries the source text.",
    anchors: [
      "No task text — enabling layer. PSF enabling-skill architecture corroboration (PSF uses the same enabling set across its catalog per roster §8); [NACE] corroboration: Communication, Professionalism, Technology, Critical Thinking.",
    ],
    specRef: "role-specs/book.md Row 9 — Enabling bundle",
  },

  // ── acctclerk · Accounting Clerk (4.2; spec acctclerk.md) ────────────────
  "acctclerk::Check figures, postings, and documents for correct entry, mathematical accuracy, and proper codes": {
    descriptor: "O*NET overview (verbatim): \"Compute, classify, and record numerical data to keep financial records complete. Perform any combination of routine calculating, posting, and verifying duties...\"",
    anchors: [
      "O*NET 43-3031.00: \"Check figures, postings, and documents for correct entry, mathematical accuracy, and proper codes.\" · \"Match order forms with invoices, and record the necessary information.\" (the invoice→PO matching core the catalog row named \"Match invoices to POs/receipts (3-way match)\") · \"Code documents according to company procedures.\"",
    ],
    specRef: "role-specs/acctclerk.md Row 1 — Check figures / match invoices",
    flags: ["the \"3-way match\" name is a platform label, explicitly recorded in the spec honesty note (2); the source-verbatim O*NET row name is the row (user ruling 2026-10-29: constructed/paraphrase class accepted) — the task anchor carries the O*NET-verbatim matching text"],
  },
  "acctclerk::Operate computers programmed with accounting software": {
    descriptor: "No descriptor printed — O*NET-verb row; the row is the attributed task anchor above (source-verbatim), tiered per the spec.",
    anchors: [
      "O*NET 43-3031.00: \"Operate computers programmed with accounting software to record, store, and analyze information.\" · \"Debit, credit, and total accounts on computer spreadsheets and databases, using specialized accounting software.\" · \"Operate 10-key calculators, typewriters, and copy machines to perform calculations and produce documents.\"",
    ],
    specRef: "role-specs/acctclerk.md Row 2 — Operate accounting software",
  },
  "acctclerk::Classify, record, and summarize numerical and financial data to compile and keep financial records, using journals and ledgers or computers": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 43-3031.00 task as printed",
      "PSOC 4311 c) (verbatim): \"c) classifying, recording and summarizing numerical and financial data to compile and keep financial records using journals and ledgers or computers\"",
    ],
    specRef: "role-specs/acctclerk.md Row 3 — Classify/record/summarize (journals and ledgers)",
  },
  "acctclerk::Reconcile or note and report discrepancies found in records": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 43-3031.00: \"Reconcile or note and report discrepancies found in records.\" · \"Reconcile records of bank transactions.\"",
      "PSOC 4311 a) (verbatim): \"a) checking figures, postings and documents for correct entry, mathematical accuracy and proper codes\"",
    ],
    specRef: "role-specs/acctclerk.md Row 4 — Reconcile / report discrepancies",
  },
  "acctclerk::Prepare and issue account statements / bills / invoices": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 43-3031.00: \"Calculate, prepare, and issue bills, invoices, account statements, and other financial statements according to established procedures.\"",
      "PSOC 4311 d) (verbatim): \"d) calculating, preparing and issuing bills, invoices, account statements and other financial statements according to established procedures\"",
    ],
    specRef: "role-specs/acctclerk.md Row 5 — Prepare/issue statements, bills, invoices",
  },
  "acctclerk::Receive, record, and bank cash, checks, and vouchers (petty cash / collections recording)": {
    descriptor: "No descriptor printed — O*NET-verb row; the row is the attributed task anchor above (source-verbatim), tiered per the spec.",
    anchors: [
      "O*NET 43-3031.00: \"Receive, record, and bank cash, checks, and vouchers.\" · \"Prepare bank deposits by compiling data from cashiers, verifying and balancing receipts, and sending cash, checks, or other forms of payment to banks.\"",
    ],
    specRef: "role-specs/acctclerk.md Row 6 — Cash/checks/vouchers (petty cash)",
  },
  "acctclerk::Journalize/post transactions (bookkeeping cycle)": {
    descriptor: "No descriptor printed — TESDA-unit/PSF-hybrid row; the attributed anchor above carries the source text.",
    anchors: [
      "TESDA Bookkeeping NC III units as recorded in `book.md` rows 1–2; O*NET \"Classify, record, and summarize…\" is the O*NET side of the same loop.",
    ],
    specRef: "role-specs/acctclerk.md Row 7 — Journalize/post (TESDA corroboration)",
  },
  "acctclerk::Government forms & compliance paperwork": {
    descriptor: "No descriptor printed — O*NET-verb row; the row is the attributed task anchor above (source-verbatim), tiered per the spec.",
    anchors: [
      "O*NET 43-3031.00: \"Complete and submit tax forms and returns, workers' compensation forms, pension contribution forms, and other government documents.\" · \"Comply with federal, state, and company policies, procedures, and regulations.\"",
    ],
    specRef: "role-specs/acctclerk.md Row 8 — Government forms & compliance",
    flags: ["PH regulatory layer (BIR forms trainings etc.) stays a later platform addendum per the spec honesty note (3)"],
  },
  "acctclerk::PSOC 4311 record-keeping envelope": {
    descriptor: "PSOC 4311 framing (verbatim): \"Accounting and bookkeeping clerks compute, classify and record numerical data to keep financial records complete. They perform any combination of routine calculating, posting and verifying duties to obtain primary financial data for use in maintaining accounting records.\"",
    anchors: [
      "PSOC 4311 lettered tasks a)–e) as quoted across rows 1–5 (lettered task set a)–e) plus examples: \"Accounting sales clerk, Accounts clerk, Accounts payable practitioner, Audit clerk, Bookkeeping clerk, Budgeting aide, Budgeting clerk, Cost computing clerk\")",
    ],
    specRef: "role-specs/acctclerk.md Row 9 — PSOC 4311 record-keeping envelope",
    flags: ["phscs mirror label prints \"Accounting and bookeeping clerks\" (sic) in the label list, while the description text spells \"bookkeeping\" — preserve as-is when citing (spec honesty note 1)"],
  },
  "acctclerk::Communication · Professionalism · Critical Thinking (Enabling)": {
    descriptor: "No descriptor printed — O*NET-verb row; the row is the attributed task anchor above (source-verbatim), tiered per the spec.",
    anchors: [
      "No task text — enabling layer; O*NET work-context signal for the accuracy framing: \"Importance of Being Exact or Accurate — 81% responded 'Extremely important.'\" [NACE]: Communication, Professionalism, Critical Thinking.",
    ],
    specRef: "role-specs/acctclerk.md Row 10 — Enabling layer",
  },

  // ── pay · Payroll Assistant (4.3; spec pay.md) ────────────────────────────
  "pay::Verify attendance, hours worked, and pay adjustments, and post information onto designated records": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 43-3051.00 task as printed",
      "PSOC 4313 e) (verbatim): \"e) verifying attendance, hours worked and pay adjustments, and posting information onto designated records\"",
      "PSOC 4313 a) (verbatim): \"a) maintaining records of employee attendance, leave and overtime to calculate pay and benefit entitlements, using manual or computerized systems\"",
    ],
    specRef: "role-specs/pay.md Row 1 — Verify attendance / post records",
  },
  "pay::Compute wages and deductions, and enter data into computers": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 43-3051.00 task as printed",
      "PSOC 4313 b) (verbatim): \"b) preparing and verifying statements of earnings for employees, indicating gross and net salaries and deductions such as taxes, union dues, garnishments and insurance and pension plans\"",
      "O*NET 43-3051.00: \"Record employee information, such as exemptions, transfers, and resignations, to maintain and update payroll records.\"",
    ],
    specRef: "role-specs/pay.md Row 2 — Compute wages and deductions",
  },
  "pay::Prepare and balance period-end reports, and reconcile issued payrolls to bank statements": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 43-3051.00 task as printed · \"Review time sheets, work charts, wage computation, and other information to detect and reconcile payroll discrepancies.\"",
      "PSOC 4313 d) (verbatim): \"d) reviewing time sheets, work charts, wage computation and other information to detect and reconcile payroll discrepancies\"",
    ],
    specRef: "role-specs/pay.md Row 3 — Balance / reconcile payroll to bank",
  },
  "pay::Process and issue employee paychecks and statements of earnings and deductions": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 43-3051.00 task as printed",
      "PSOC 4313 c) (verbatim): \"c) preparing employee payments and benefit payments by cheque or electronic transfer\"",
    ],
    specRef: "role-specs/pay.md Row 4 — Process and issue paychecks/statements",
  },
  "pay::Prepare and file payroll tax returns / statutory paperwork": {
    descriptor: "No descriptor printed — O*NET-verb row; the row is the attributed task anchor above (source-verbatim), tiered per the spec.",
    anchors: [
      "O*NET 43-3051.00: \"Prepare and file payroll tax returns.\" · \"Complete, verify, and process forms and documentation for administration of benefits, such as pension plans, and unemployment and medical insurance.\" · \"Keep informed about changes in tax and deduction laws that apply to the payroll process.\"",
    ],
    specRef: "role-specs/pay.md Row 5 — Payroll tax returns / statutory paperwork",
    flags: ["PH compliance layer is the later platform addendum (O*NET supplies the anchor task) — statutory keep-with-flag ruling 2026-10-29: SSS/PhilHealth/Pag-IBIG entries are labeled \"Official portal — start here\" placeholders (deep contribution-table pages unplaced/unreachable — flagged, portals stand only as labeled placeholders); BIR entry's eFPS deep/tutorial pages dead-in-copy while unreachable — do not cite eFPS tutorial pages (V-pay-4/V-pay-5)"],
  },
  "pay::Provide information to employees and managers on payroll matters, tax issues, benefit plans, and collective agreement provisions": {
    descriptor: "No descriptor printed — O*NET-verb row; the row is the attributed task anchor above (source-verbatim), tiered per the spec.",
    anchors: [
      "O*NET 43-3051.00 task as printed · \"Conduct verifications of employment.\" · \"Issue and record adjustments to pay related to previous errors or retroactive increases.\"",
    ],
    specRef: "role-specs/pay.md Row 6 — Employee query handling",
  },
  "pay::Keep leave records": {
    descriptor: "No descriptor printed — O*NET-verb row; the row is the attributed task anchor above (source-verbatim), tiered per the spec.",
    anchors: [
      "O*NET 43-3051.00: \"Keep track of leave time, such as vacation, personal, and sick leave, for employees.\" · \"Compile employee time, production, and payroll data from time sheets and other records.\"",
    ],
    specRef: "role-specs/pay.md Row 7 — Leave records",
  },
  "pay::Records hygiene & confidentiality (RA 10173 context)": {
    descriptor: "No descriptor printed — O*NET-verb row; the row is the attributed task anchor above (source-verbatim), tiered per the spec.",
    anchors: [
      "O*NET \"Record employee information, such as exemptions…\" (records anchor); PH legal wrap: RA 10173 (lawphil full text, verified this session) — personal-data discipline over payroll PII.",
    ],
    specRef: "role-specs/pay.md Row 8 — Records hygiene & confidentiality",
    flags: ["privacy.gov.ph 403 this session — flagged; cite the NPC register when reachable"],
  },
  "pay::Communication · Professionalism (Enabling)": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "No task text — enabling layer [NACE]: Communication, Professionalism; PSOC 4313 framing (verbatim): \"Payroll clerks collect, verify and process payroll information and compute pay and benefit entitlements for employees within a department, company or other establishment.\"",
    ],
    specRef: "role-specs/pay.md Row 9 — Enabling layer",
  },

  // ── fas · Finance & Accounting Associate (4.4; spec fas.md) ──────────────
  "fas::Perform financial accounting and corporate reporting activities": {
    descriptor: "Role overview (verbatim): \"The Agent / Associate / Representative / Analyst supports the finance department in carrying out the responsibilities of the Finance & Accounting department. They are required to have a basic understanding of the business structures, operations, and financial performance. They may be called on to participate in Ad-hoc Finance-related projects and systems testing when necessary. They are meticulous and have good time management skills.\" (Critical Work Function, verbatim.)",
    anchors: [
      "Key tasks (verbatim): \"Provide support in month-end closing activities\" · \"Compile the relevant business documentation used in various business processes\" · \"Provide audit support\" · \"Maintain accurate financial records and statements\" · \"Record and process all business transactions in the accounting system using double-entry accounting\" · \"Record transactions\" · \"Calculate customer and/or supplier account balances and reconcile with totals\" · \"Record transactions and accounting events\"",
    ],
    specRef: "role-specs/fas.md Row 1 — CWF financial accounting & corporate reporting (printed pp.92–93)",
  },
  "fas::Process business transactions and reports using information technology tools": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "Key tasks (verbatim): \"Use relevant Infocomm technology systems and tools effectively for data analysis\" · \"Prepare/obtain system reports from the accounting system for management's use\" · \"Map account codes to all transactions in the accounting system\" · \"Assist in preparing consolidated financial statements, business activity reports, and forecasts for management and external stakeholders\" · \"Enter accurate data into the accounting system\"",
    ],
    specRef: "role-specs/fas.md Row 2 — CWF process business transactions via IT tools",
  },
  "fas::Support strategic planning": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "Key tasks (verbatim): \"Assist in the budgeting and forecasting process\" · \"Assist in the balance sheet analysis and reconciliation process\" · \"Assist in profit and loss analysis\" · \"Download financial statements\" · \"Support in the preparation of management reports with written narratives to support analysis and findings\" · \"Support financial modeling process to analyze proposals on financial and non-financial return\"",
    ],
    specRef: "role-specs/fas.md Row 3 — CWF support strategic planning",
  },
  "fas::Accounting and Tax Systems": {
    descriptor: "printed-level descriptors (proficiency columns, verbatim; relabeled 2026-10-29 per facsimile read, verify-notes V-C: no L1 cell is printed — codes begin at `GIC-DDM1-2…001`, entry level = 2): L2 \"Use software and accounting systems to input journals, transactions and events\"; L3 \"Operate management information systems to approve journals, transactions and events\".",
    anchors: [
      "Underpinning knowledge as printed: \"Modules of accounting systems and software\" · \"Accounting rules\" · \"Types of accounting transactions and events\"",
    ],
    specRef: "role-specs/fas.md Row 4 — Accounting and Tax Systems (FSC; printed pp.140–141)",
    flags: ["level relabel applied 2026-10-29 (was \"L1/L2\" — wrong labels; V-fas-2 resolved-as-evidenced); quoted descriptor texts are verbatim-exact"],
  },
  "fas::Data Collection and Analysis": {
    descriptor: "L-column descriptors (verbatim; relabeled 2026-10-29 per facsimile read, verify-notes V-C: no L1/L2 cells are printed — codes begin at `GIC-DAI1-3…001`, entry level = 3): L3 \"Collect data using appropriate techniques and business intelligence tools to extract meaningful data for preliminary analyses according to requirements\"; L4 \"Analyse and interpret findings for business insights and make recommendations to value add to decision making\".",
    anchors: [
      "Skills application as printed: \"Consolidate data based on defined data requirements in accordance with data collection processes and tools\"",
    ],
    specRef: "role-specs/fas.md Row 5 — Data Collection and Analysis (FSC; printed pp.212–213)",
    flags: ["level relabel applied 2026-10-29 (was L1/L2) — \"column mapping flagged\" wording replaced by the dated relabel note in-file"],
  },
  "fas::Financial Analysis": {
    descriptor: "Doc-page profile (verbatim): \"Analyze the financial statements and data to provide insights about the financial performance and position of the organization over time.\" L-column descriptor sample (verbatim; relabeled 2026-10-29 per facsimile read, verify-notes V-C: this string is the L4 cell (GIC-BFI1-4001-1.1), not the L3 cell — the actual L3 cell prints \"Perform basic financial ratio analyses to evaluate organizational performance\"): \"Apply financial ratio analyses to support organization's decision-making\".",
    anchors: [],
    specRef: "role-specs/fas.md Row 6 — Financial Analysis (FSC; printed pp.260–261)",
    flags: ["Financial Analysis L3 at the entry rung — RULED 2026-10-29 (user): ACCEPT the framework's printed L3 verbatim + one-line student-copy note; no down-shelving", "sample cell relabel L4 applied 2026-10-29 (V-fas-2); row's own tier label \"core (level 3)\" is the role-strip layer, a different printed layer"],
  },
  "fas::Internal Controls": {
    descriptor: "Doc-page profile (verbatim): \"Evaluate effectiveness and efficiency of internal controls in the organization.\"",
    anchors: [
      "L-column descriptors (verbatim): \"Interpret organization's frameworks for internal controls\" → \"Identify organization's internal controls established and control gaps\"",
    ],
    specRef: "role-specs/fas.md Row 7 — Internal Controls (FSC 2–3; printed pp.292–293)",
    flags: ["unchanged and confirmed correct (L2 → L3 progression \"stays L2/L3\"); position-arrow rendering encodes the order; V-fas-3: the hyphen literally printed (printed p.92: `Internal Controls 2-3`)"],
  },
  "fas::Diversity Awareness and Management": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "Level as printed (3); no key-task text relevant at associate tier.",
    ],
    specRef: "role-specs/fas.md Row 8 — Diversity Awareness and Management (FSC)",
    flags: ["no free dedicated diversity course verified PH-side — honest thin (per spec resource row 8)"],
  },
  "fas::Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Sense Making · Transdisciplinary Thinking (Enabling, B/I)": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "No task text — enabling layer. Levels as printed on the F&A Agent strip: Collaboration B · Communication I · Digital Fluency I · Learning Agility B · Problem Solving B · Sense Making B · Transdisciplinary Thinking B. Spec row label: \"Enabling Skills & Competencies (ESC strip, verbatim names): Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Sense Making · Transdisciplinary Thinking\".",
    ],
    specRef: "role-specs/fas.md Row 9 — ESC strip",
  },
  "fas::O*NET corroboration block (operating-the-GL-engine tasks)": {
    descriptor: "O*NET overview (verbatim): \"Compute, classify, and record numerical data to keep financial records complete.\" (spec row label: \"O*NET corroboration block (operating-the-GL-engine tasks, quoted not renamed)\")",
    anchors: [
      "O*NET 43-3031.00: \"Classify, record, and summarize numerical and financial data to compile and keep financial records, using journals and ledgers or computers.\" · \"Reconcile or note and report discrepancies found in records.\" · \"Compile budget data and documents, based on estimated revenues and expenses and previous budgets.\" · \"Transfer details from separate journals to general ledgers or data processing sheets.\"",
    ],
    specRef: "role-specs/fas.md Row 10 — O*NET corroboration block",
  },

  // ── fin · Financial Analyst (4.5; spec fin.md) ───────────────────────────
  "fin::Analyze financial information to forecast business, industry, or economic conditions for investment decisions": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 13-2051.00: \"Inform investment decisions by analyzing financial information to forecast business, industry, or economic conditions.\"",
      "PSOC 2413 a) (verbatim): \"a) analyzing financial information to produce forecasts of business, industry, and economic conditions for use in making investment decisions\"",
    ],
    specRef: "role-specs/fin.md Row 1 — Forecasting",
  },
  "fin::Monitor economic, industrial, and corporate developments": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 13-2051.00: \"Monitor fundamental economic, industrial, and corporate developments by analyzing information from financial publications and services, investment banking firms, government agencies, trade publications, company sources, or personal interviews.\" · \"Monitor developments in the fields of industrial technology, business, finance, and economic theory.\"",
      "PSOC 2413 b) (verbatim): \"b) maintaining knowledge and staying abreast of developments in the fields of industrial technology, business, finance, and economic theory\"",
    ],
    specRef: "role-specs/fin.md Row 2 — Monitoring developments",
  },
  "fin::Employ financial models to develop solutions or assess the financial or capital impact of transactions": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 13-2051.00 task as printed",
      "PSOC 2413 g) (verbatim): \"g) preparing plans of action for investment based on financial analyses\"",
    ],
    specRef: "role-specs/fin.md Row 3 — Financial models",
  },
  "fin::Interpret data on price, yield, stability, future investment-risk trends, economic influences": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 13-2051.00 task as printed",
      "PSOC 2413 c) (verbatim): \"c) interpreting data affecting investment programs, such as price, yield, stability, future trends in investment risks, and economic influences\"",
    ],
    specRef: "role-specs/fin.md Row 4 — Interpret data",
  },
  "fin::Recommend investments and investment timing": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 13-2051.00 task as printed",
      "PSOC 2413 e) (verbatim): \"e) recommending investments and investment timing to companies, investment firm staff, or the investing public\"",
      "PSOC 2413 h) (verbatim): \"h) evaluating and comparing the relative quality of various securities in a given industry\"",
    ],
    specRef: "role-specs/fin.md Row 5 — Recommend investments",
  },
  "fin::Present oral or written reports on general economic trends, individual corporations, and entire industries": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 13-2051.00 task as printed",
      "PSOC 2413 i) (verbatim): \"i) presenting oral and written reports on general economic trends, individual corporations, and entire industries\"",
      "O*NET 13-2051.00: \"Create client presentations of plan details.\"",
    ],
    specRef: "role-specs/fin.md Row 6 — Present reports (the communication backbone)",
  },
  "fin::Draw charts and graphs, using computer spreadsheets, to illustrate technical reports": {
    descriptor: "No descriptor printed — O*NET-verb row; the row is the attributed task anchor above (source-verbatim), tiered per the spec.",
    anchors: ["O*NET 13-2051.00 task as printed (tooling, not the core judgment)."],
    specRef: "role-specs/fin.md Row 7 — Spreadsheet visualization",
  },
  "fin::Advise clients on aspects of capitalization, such as amounts, sources, or timing": {
    descriptor: "No descriptor printed — O*NET-verb row; the row is the attributed task anchor above (source-verbatim), tiered per the spec.",
    anchors: [
      "O*NET 13-2051.00 task as printed · \"Evaluate capital needs of clients and assess market conditions to inform structuring of financial packages.\" (normally senior-received work; kept secondary.)",
    ],
    specRef: "role-specs/fin.md Row 8 — Capitalization advice",
  },
  "fin::Supervise, train, or mentor junior team members": {
    descriptor: "No descriptor printed — O*NET-verb row; the row is the attributed task anchor above (source-verbatim), tiered per the spec.",
    anchors: ["O*NET 13-2051.00 task as printed (kept for honesty of the full task list, not as an entry expectation — senior-heavy fold-in note)."],
    specRef: "role-specs/fin.md Row 9 — Senior-heavy supervision",
    flags: ["resourceless by declaration — spec Row 9: \"no free credible resource added for a task the entry analyst mostly observes; leave resourceless rather than pad — flagged\""],
  },
  "fin::Communication · Critical Thinking · Professionalism (Enabling)": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "No task text — enabling layer [NACE]: Communication, Critical Thinking, Professionalism; PSOC 2413 framing (verbatim): \"Financial analysts conduct quantitative analyses of information affecting investment programs of public or private institutions.\"",
    ],
    specRef: "role-specs/fin.md Row 10 — Enabling layer",
    flags: ["CFI/Wharton resources are global-standard, declared non-PH (per card)"],
  },

  // ── treasury · Treasury Assistant (4.6; spec treasury.md) ────────────────
  "treasury::Balance currency, coin, and checks in cash drawers at ends of shifts and calculate daily transactions, using computers, calculators, or adding machines": {
    descriptor: "No descriptor printed — O*NET-verb row; the row is the attributed task anchor above (source-verbatim), tiered per the spec.",
    anchors: [
      "O*NET 43-3071.00 task as printed (borrowed O*NET-Tellers task; the hybrid is flagged)",
      "O*NET 43-3071.00: \"Count currency, coins, and checks received, by hand or using currency-counting machine, to prepare them for deposit or shipment…\" (bank-side flavor, quoted for the discipline)",
    ],
    specRef: "role-specs/treasury.md Row 1 — Balance cash drawers",
    flags: ["hybrid basis declared, not silent — O*NET tasks deliberately shared with `teller` (spec honesty note 3)"],
  },
  "treasury::Enter customers' transactions into computers to record transactions and issue computer-generated receipts": {
    descriptor: "No descriptor printed — O*NET-verb row; the row is the attributed task anchor above (source-verbatim), tiered per the spec.",
    anchors: [
      "O*NET 43-3071.00 task as printed",
      "O*NET 43-3071.00: \"Identify transaction mistakes when debits and credits do not balance.\"",
    ],
    specRef: "role-specs/treasury.md Row 2 — Enter transactions/issue receipts",
  },
  "treasury::Reconcile records of financial transactions": {
    descriptor: "Rename record: the old platform label \"Bank reconciliation spreadsheets\" renamed to the quoted O*NET verbatim verb with explicit attribution (spec honesty note 1 — the source-verbatim row-name rule applied).",
    anchors: [
      "Adapted anchor, verbatim from O*NET 43-3031.00 (the clerk family's own reconcile clause, cited explicitly): \"Reconcile or note and report discrepancies found in records.\" · \"Reconcile records of bank transactions.\"",
      "PSOC 4312 c) (verbatim): \"c) calculating totals, averages, percentages and other details and presenting them in the required tabular form\"",
    ],
    specRef: "role-specs/treasury.md Row 3 — Reconcile financial-transaction records (renamed row)",
  },
  "treasury::Prepare financial documents, and calculate interest or brokerage charges and stamp duties payable": {
    descriptor: "No descriptor printed — PSOC-unit row; the attributed lettered-task anchor above carries the source text.",
    anchors: [
      "PSOC 4312 d) (verbatim) as printed",
      "PSOC 4312 b) (verbatim): \"b) obtaining and compiling statistical or actuarial data based on routine or special sources of information\"",
    ],
    specRef: "role-specs/treasury.md Row 4 — Financial documents / interest / stamp duties (PSOC 4312 d))",
  },
  "treasury::Maintain records of bonds, shares and other securities bought or sold on behalf of clients or employer": {
    descriptor: "No descriptor printed — PSOC-unit row; the attributed lettered-task anchor above carries the source text.",
    anchors: ["PSOC 4312 e) (verbatim) as printed."],
    specRef: "role-specs/treasury.md Row 5 — Securities records",
  },
  "treasury::Accuracy/Professionalism (Enabling)": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "No task text — enabling layer [NACE]: Professionalism, Critical Thinking; O*NET context signal: \"Importance of Being Exact or Accurate — 81% responded 'Extremely important.'\"",
    ],
    specRef: "role-specs/treasury.md Row 6 — Enabling layer",
    flags: ["no task text anywhere prints \"cash positioning/forecasting\" for the entry tier — stays out of the row set rather than being invented (spec honesty note 2); BSP hosts 403 — no BSP-sourced resource; Khan Academy US-framing flagged"],
  },

  // ── coll · Bill & Account Collector (4.7; spec coll.md) ──────────────────
  "coll::Locate and notify customers of delinquent accounts by mail, telephone, or personal visits to solicit payment": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 43-3011.00 task as printed · \"Persuade customers to pay amounts due on credit accounts, damage claims, or nonpayable checks, or to return merchandise.\"",
      "PSOC 4214 b) (verbatim): \"b) telephoning, visiting, or writing to customers to collect money or arrange for later payments\"",
    ],
    specRef: "role-specs/coll.md Row 1 — Locate/notify",
  },
  "coll::Arrange for debt repayment or establish repayment schedules, based on customers' financial situations": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 43-3011.00 task as printed · \"Advise customers of necessary actions and strategies for debt repayment.\"",
      "PSOC framing (verbatim): \"Debt collectors and related workers collect payments on overdue accounts and bad cheques and collect charity payments.\"",
    ],
    specRef: "role-specs/coll.md Row 2 — Arrange repayment",
  },
  "coll::Record information about financial status of customers and status of collection efforts": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 43-3011.00 task as printed · \"Locate and monitor overdue accounts, using computers and a variety of automated systems.\"",
      "PSOC 4214 a) (verbatim): \"a) tracing and locating debtors\"",
    ],
    specRef: "role-specs/coll.md Row 3 — Record financial status",
  },
  "coll::Confer with customers by telephone or in person to determine reasons for overdue payments and to review the terms of sales, service, or credit contracts": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 43-3011.00 task as printed (the conversation craft) · \"Answer customer questions regarding problems with their accounts.\" PSOC 4214 b) covers the channel set.",
    ],
    specRef: "role-specs/coll.md Row 4 — Confer with customers",
  },
  "coll::Receive payments and post amounts paid to customer accounts": {
    descriptor: "No descriptor printed — O*NET-verb row; the row is the attributed task anchor above (source-verbatim), tiered per the spec.",
    anchors: [
      "O*NET 43-3011.00 task as printed (money-handling close of the loop)",
      "O*NET 43-3011.00: \"Sort and file correspondence and perform miscellaneous clerical duties, such as answering correspondence and writing reports.\" (admin flank kept in row 8)",
    ],
    specRef: "role-specs/coll.md Row 5 — Post payments",
  },
  "coll::Trace delinquent customers to new addresses by inquiring at post offices, telephone companies, credit bureaus, or through the questioning of neighbors": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: ["O*NET 43-3011.00 task as printed; PSOC 4214 a). (skip-tracing; ethics-sensitive.)"],
    specRef: "role-specs/coll.md Row 6 — Skip-tracing",
    flags: ["skip-tracing ethics copy (DPA + BSP conduct note) approval rides the at-fixture copy confirm (coll card; DPA working lawphil anchor carried; BSP conduct context currently unverifiable — flagged)"],
  },
  "coll::Recommend legal action or disconnection when payment cannot be obtained / negotiate credit extensions": {
    descriptor: "labeled paraphrase, flagged: the O*NET and PSOC sources print these as separate sentences; the row name is an explicitly-flagged paraphrase of them.",
    anchors: [
      "O*NET 43-3011.00: \"Notify credit departments, order merchandise repossession or service disconnection, and turn over account records to attorneys when customers fail to respond to collection attempts.\" · \"Negotiate credit extensions when necessary.\"",
      "PSOC 4214 c) (verbatim): \"c) preparing reports including amounts collected and maintain records and files related to collection work\"",
      "PSOC 4214 d) (verbatim): \"d) recommending legal action or discontinuation of service when payment cannot be otherwise obtained\"",
    ],
    specRef: "role-specs/coll.md Row 7 — Escalation (labeled paraphrase row)",
    flags: ["flagged paraphrase row name (accepted ruling class); escalation and concession authority sit above the entry tier"],
  },
  "coll::Administrative upkeep of assigned accounts": {
    descriptor: "labeled paraphrase (flagged): condensed from two O*NET sentences.",
    anchors: [
      "O*NET 43-3011.00: \"Perform various administrative functions for assigned accounts, such as recording address changes and purging the records of deceased customers.\" · \"Contact insurance companies to check on status of claims payments and write appeal letters for denial on claims.\"",
    ],
    specRef: "role-specs/coll.md Row 8 — Administrative upkeep",
    flags: ["flagged paraphrase row name (accepted ruling class)"],
  },
  "coll::Communication · Professionalism (Enabling)": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "No task text — enabling layer [NACE]: Communication, Professionalism; PSOC 4214 d) note: skip-tracing ethics remain a platform-copy concern (DPA + BSP conduct context, both currently unverifiable links — flagged).",
    ],
    specRef: "role-specs/coll.md Row 9 — Enabling layer",
    flags: ["thin-resource zone RESOLVED (accepted per ruling; no forced search): no free collections-specific training verified (BSP 403; CFI CBCA paid) — resources lean on the communication/case-note layer and statutes", "RA 3765 keep-with-flag ruling 2026-10-29: where the credit-reporting law is named in copy it carries the dead-link flag (\"official mirror unreachable at recording time — not cited, no alternate URL invented\"); until resolution it is never rendered as a live link (V-coll-4)"],
  },

  // ── credit · Credit Analyst, entry (4.8; spec credit.md) ─────────────────
  "credit::Researching and evaluating loan applicant's financial status, references, credit and ability to repay the loan": {
    descriptor: "PSOC 3312 framing (verbatim): \"Credit and loan officers analyze and evaluate financial information on applications for credit and loans and determine approval or disapproval of the client for the credit or loan or recommend to management approval or disapproval.\"",
    anchors: [
      "PSOC 3312 b) as printed",
      "O*NET 13-2072.00: \"Analyze applicants' financial status, credit, and property evaluations to determine feasibility of granting loans.\" · \"Obtain and compile copies of loan applicants' credit histories, corporate financial statements, and other financial information.\"",
    ],
    specRef: "role-specs/credit.md Row 1 — Financial-status analysis (PSOC lettered task b) — the occupational core)",
  },
  "credit::Interviewing applicants for personal, mortgage, student and business loans": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "PSOC 3312 a) as printed",
      "O*NET 13-2072.00: \"Meet with applicants to obtain information for loan applications and to answer questions about the process.\"",
    ],
    specRef: "role-specs/credit.md Row 2 — Interview applicants (PSOC task a))",
  },
  "credit::Submitting credit and loan applications to management with recommendations for approval or rejection; approving or rejecting within authorized limits": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "PSOC 3312 c) (verbatim): \"c) submitting credit and loan applications to management with recommendations for approval or rejection\"",
      "PSOC 3312 d) (verbatim): \"d) approving or rejecting loan applications within authorized limits ensuring that credit standards of the institution are respected\"",
      "O*NET 13-2072.00: \"Approve loans within specified limits, and refer loan applications outside those limits to management for approval.\"",
    ],
    specRef: "role-specs/credit.md Row 3 — Submit/approve within limits (PSOC tasks c)–d))",
  },
  "credit::Keeping records of payments, and preparing routine letters requesting payment for overdue accounts and forwarding these for legal action": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "PSOC 3312 e) as printed",
      "O*NET 13-2072.00: \"Maintain and review account records, updating and recategorizing them according to status changes.\" · \"Review and update credit and loan files.\"",
    ],
    specRef: "role-specs/credit.md Row 4 — Records + routine letters (PSOC task e))",
  },
  "credit::Completing credit and loan documentation": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "PSOC 3312 f) (verbatim): \"f) completing credit and loan documentation\"",
      "O*NET 13-2072.00: \"Review loan agreements to ensure that they are complete and accurate according to policy.\"",
    ],
    specRef: "role-specs/credit.md Row 5 — Documentation (PSOC task f))",
  },
  "credit::Explain to customers the different types of loans and credit options (including terms)": {
    descriptor: "No descriptor printed — O*NET-verb row; the row is the attributed task anchor above (source-verbatim), tiered per the spec.",
    anchors: [
      "O*NET 13-2072.00 task as printed · \"Work with clients to identify their financial goals and to find ways of reaching those goals.\"",
    ],
    specRef: "role-specs/credit.md Row 6 — Customer explanation",
  },
  "credit::Confer with underwriters to resolve mortgage application problems / submit applications to credit analysts": {
    descriptor: "No descriptor printed — O*NET-verb row; the row is the attributed task anchor above (source-verbatim), tiered per the spec.",
    anchors: [
      "O*NET 13-2072.00: \"Confer with underwriters to resolve mortgage application problems.\" · \"Submit applications to credit analysts for verification and recommendation.\" (this sentence is the credit-analyst-side corroboration of the investigative band; adjacent-band pathway row kept for honesty.)",
    ],
    specRef: "role-specs/credit.md Row 7 — Underwriter liaison",
  },
  "credit::Sizing the credit portfolio (delinquent-account reports)": {
    descriptor: "No descriptor printed — O*NET-verb row; the row is the attributed task anchor above (source-verbatim), tiered per the spec.",
    anchors: [
      "O*NET 13-2072.00: \"Prepare reports to send to customers whose accounts are delinquent, and forward irreconcilable accounts for collector action.\" · \"Contact borrowers with delinquent accounts to obtain payment in full or to negotiate repayment plans.\" (borders `coll` — kept as adjacency.)",
    ],
    specRef: "role-specs/credit.md Row 8 — Portfolio/delinquency reports",
  },
  "credit::Integrity/Professionalism (Enabling)": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "No task text — enabling layer [NACE]: Professionalism, Ethics; PSOC framing phrase \"ensuring that credit standards of the institution are respected\" carries the integrity voice.",
    ],
    specRef: "role-specs/credit.md Row 9 — Enabling layer",
    flags: ["thin-resource zone + RA 3765 dead-in-copy ruling same as coll (V-credit-3, never rendered live); label spelling split to display (\"Credit and loans officers\" label vs \"Credit and loan officers…\" description — marked as printed; confirm at fixture)", "tier stays labeled as derived (PSOC lettered tasks = occupational definition; PSOC-weighted tiering judgment per roster basis — V-credit-4)"],
  },

  // ── teller · Bank Teller (4.9; spec teller.md) ───────────────────────────
  "teller::Balance currency, coin, and checks in cash drawers at ends of shifts and calculate daily transactions, using computers, calculators, or adding machines": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 43-3071.00 task as printed",
      "PSOC 4211 f) (verbatim): \"f) making records of all transactions and reconciling them with cash balance\"",
      "PSOC 4211 framing (verbatim): \"Bank tellers and related clerks deal directly with clients of banks or post offices in connection with receiving, changing and paying out money; or providing mail services.\"",
    ],
    specRef: "role-specs/teller.md Row 1 — Balance drawers",
  },
  "teller::Receive checks and cash for deposit, verify amounts, and check accuracy of deposit slips": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 43-3071.00 task as printed · \"Cash checks and pay out money after verifying that signatures are correct, that written and numerical amounts agree, and that accounts have sufficient funds.\" · \"Examine checks for endorsements and to verify other information, such as dates, bank names, identification of the persons receiving payments, and the legality of the documents.\"",
      "PSOC 4211 a) (verbatim): \"a) processing customer cash deposits and withdrawals, cheques, transfers, bills, credit card payments, money orders, certified cheques and other related banking transactions\"",
    ],
    specRef: "role-specs/teller.md Row 2 — Receive/verify deposits",
  },
  "teller::Enter customers' transactions into computers to record transactions and issue computer-generated receipts": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 43-3071.00 task as printed",
      "O*NET 43-3071.00: \"Count currency, coins, and checks received, by hand or using currency-counting machine, to prepare them for deposit or shipment to branch banks or the Federal Reserve Bank.\"",
      "PSOC 4211 b) (verbatim): \"b) crediting and debiting clients' accounts\"",
    ],
    specRef: "role-specs/teller.md Row 3 — Enter transactions/receipts",
    flags: ["US-context ruins (\"Federal Reserve Bank\" shipments) quoted verbatim; copy may paraphrase (roster ruling, rides the accepted teller-rows naming)"],
  },
  "teller::Resolve problems or discrepancies concerning customers' accounts": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 43-3071.00 task as printed (the zero-variance discipline) · \"Identify transaction mistakes when debits and credits do not balance.\"",
      "PSOC 4211 b) covers the debit/credit mechanics; PSOC 4211 f) covers reconciliation.",
    ],
    specRef: "role-specs/teller.md Row 4 — Resolve discrepancies",
  },
  "teller::Receive mortgage, loan, or public utility bill payments, verifying payment dates and amounts due / process term deposits and other savings-plan transactions": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 43-3071.00: \"Receive mortgage, loan, or public utility bill payments, verifying payment dates and amounts due.\" · \"Process transactions, such as term deposits, retirement savings plan contributions, automated teller transactions, night deposits, and mail deposits.\"",
      "PSOC 4211 c) (verbatim): \"c) paying bills and making money transfers on clients' behalf\"",
    ],
    specRef: "role-specs/teller.md Row 5 — Receive payments/term deposits (counter-transaction breadth)",
    flags: ["post-office flank (PSOC 4211 letter d)) stays with the bank-branch framing note — rides the accepted teller-rows naming ruling"],
  },
  "teller::Customer service & special services (cards, checks ordering)": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 43-3071.00: \"Answer telephones and assist customers with their questions.\" · \"Carry out special services for customers, such as ordering bank cards and checks.\" · \"Obtain and process information required for the provision of services, such as opening accounts, savings plans, and purchasing bonds.\"",
      "PSOC 4211 d) covers the post-office counter flank (verbatim): \"d) receiving mail, selling postage stamps and conducting other post office counter business such as bill payments, money transfers and related business\"",
    ],
    specRef: "role-specs/teller.md Row 6 — Service & special services",
  },
  "teller::Explain, promote, or sell banking products": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 43-3071.00 task as printed (\"…such as travelers' checks, savings bonds, money orders, and cashier's checks, using computerized information about customers to tailor recommendations.\")",
      "PSOC 4211 e) (verbatim): \"e) changing money from one currency to another, as requested by clients\"",
    ],
    specRef: "role-specs/teller.md Row 7 — Explain/promote banking products",
  },
  "teller::Front-desk service etiquette (Enabling)": {
    descriptor: "No descriptor printed — O*NET-verb row; the row is the attributed task anchor above (source-verbatim), tiered per the spec.",
    anchors: [
      "O*NET contact-context signal: \"Deal With External Customers or the Public in General — 38% responded 'Extremely important.'\" — enabling layer [NACE]: Communication.",
    ],
    specRef: "role-specs/teller.md Row 8 — Front-desk etiquette (Enabling)",
  },
  "teller::Professionalism · Teamwork (Enabling)": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: ["No task text — enabling layer [NACE]: Professionalism, Teamwork."],
    specRef: "role-specs/teller.md Row 9 — Enabling layer",
    flags: ["Row-5 SSS entry re-labeled the \"Official portal — start here for statutory-contribution payment-desk information\" placeholder (keep-with-flag ruling 2026-10-29: start-here placeholder only); RA 8791 lawphil link (working, 200) kept as-is"],
  },

  // ── audit · Audit Associate (4.10; spec audit.md) ─────────────────────────
  "audit::Prepare, examine, or analyze accounting records, financial statements, or other financial reports to assess accuracy, completeness, and conformance to reporting and procedural standards": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 13-2011.00 task as printed; O*NET overview (verbatim): \"…assess accuracy, completeness, and conformance to reporting and procedural standards\" family",
      "PSOC 3313 b) (verbatim): \"b) verifying accuracy of documents and records relating to payments, receipts and other financial transactions\"",
    ],
    specRef: "role-specs/audit.md Row 1 — Examine records",
  },
  "audit::Review accounts for discrepancies and reconcile differences": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 13-2011.00 task as printed",
      "PSOC 3313 framing (verbatim): \"Accounting associate professionals maintain complete records of financial transactions of an undertaking and verify accuracy of documents and records relating to such transactions.\"",
    ],
    specRef: "role-specs/audit.md Row 2 — Reconcile",
  },
  "audit::Collect and analyze data to detect deficient controls, duplicated effort, extravagance, fraud, or non-compliance with laws, regulations, and management policies": {
    descriptor: "No descriptor printed — O*NET-verb row; the row is the attributed task anchor above (source-verbatim), tiered per the spec.",
    anchors: [
      "O*NET 13-2011.00 task as printed (the internal-control nucleus of the associate's testing)",
      "O*NET 13-2011.00: \"Inspect account books and accounting systems for efficiency, effectiveness, and use of accepted accounting procedures to record transactions.\"",
    ],
    specRef: "role-specs/audit.md Row 3 — Detect deficient controls/fraud",
  },
  "audit::Inspect cash on hand, notes receivable and payable, negotiable securities, and canceled checks to confirm records are accurate": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "O*NET 13-2011.00 task as printed (the inspection loop) · \"Examine inventory to verify journal and ledger entries.\" · \"Inspect account books…\" (row 3 anchor)",
      "PSOC 3313 a) (verbatim): \"a) maintaining complete records of all financial transactions of an undertaking according to general bookkeeping principles, with guidance from Accountants\" — the \"with guidance from Accountants\" clause is the entry-band ratio the PSOC prints",
    ],
    specRef: "role-specs/audit.md Row 4 — Inspect cash/securities",
  },
  "audit::Examine records and interview workers to ensure recording of transactions and compliance with laws and regulations": {
    descriptor: "No descriptor printed — O*NET-verb row; the row is the attributed task anchor above (source-verbatim), tiered per the spec.",
    anchors: [
      "O*NET 13-2011.00 task as printed; \"Examine and evaluate financial and information systems, recommending controls to ensure system reliability and data integrity.\"",
    ],
    specRef: "role-specs/audit.md Row 5 — Interviews/compliance",
  },
  "audit::Prepare detailed reports on audit findings": {
    descriptor: "No descriptor printed — O*NET-verb row; the row is the attributed task anchor above (source-verbatim), tiered per the spec.",
    anchors: [
      "O*NET 13-2011.00 task as printed (the workpaper/reporting loop)",
      "O*NET 43-3031.00 corroboration (attributed to that code): \"Compile statistical, financial, accounting, or auditing reports and tables pertaining to such matters as cash receipts, expenditures, accounts payable and receivable, and profits and losses.\"",
    ],
    specRef: "role-specs/audit.md Row 6 — Prepare audit reports",
    flags: ["the old row \"Documentation (audit workpapers) & sign-off discipline\" is re-anchored to O*NET's printed reporting tasks here — the phrase \"sign-off\" is a platform label, flagged as such (spec honesty note 1)"],
  },
  "audit::Prepare adjusting journal entries / establish tables of accounts and assign entries to proper accounts": {
    descriptor: "No descriptor printed — O*NET-verb row; the row is the attributed task anchor above (source-verbatim), tiered per the spec.",
    anchors: [
      "O*NET 13-2011.00: \"Prepare adjusting journal entries.\" · \"Establish tables of accounts and assign entries to proper accounts.\" · \"Review data about material assets, net worth, liabilities, capital stock, surplus, income, or expenditures.\"",
    ],
    specRef: "role-specs/audit.md Row 7 — Adjusting entries (close-support account mapping; feeds audit adjustments under supervision)",
  },
  "audit::Compliance / tax analog & frameworks": {
    descriptor: "No descriptor printed — O*NET-verb row; the row is the attributed task anchor above (source-verbatim), tiered per the spec.",
    anchors: [
      "O*NET 13-2011.00: \"Compute taxes owed and prepare tax returns, ensuring compliance with payment, reporting, or other tax requirements.\" (explicit analog per the old row's source tag) · \"Audit payroll and personnel records to determine unemployment insurance premiums, workers' compensation coverage, liabilities, and compliance with tax laws.\"",
    ],
    specRef: "role-specs/audit.md Row 8 — Compliance/tax analog",
    flags: ["PH regulatory layer — PFRS tax specifics — is the later platform addendum (spec honesty note 2); Row-8 BIR entry carries the eFPS dead-in-copy label (keep-with-flag ruling 2026-10-29)"],
  },
  "audit::Senior-heavy supervision tasks": {
    descriptor: "No descriptor printed — O*NET-verb row; the row is the attributed task anchor above (source-verbatim), tiered per the spec.",
    anchors: [
      "O*NET 13-2011.00: \"Supervise auditing of establishments, and determine scope of investigation required.\" · \"Direct activities of personnel engaged in filing, recording, compiling, and transmitting financial records.\" (not entry expectations; honesty fold-in.)",
    ],
    specRef: "role-specs/audit.md Row 9 — Senior-heavy supervision",
  },
  "audit::Professional Skepticism (attitude) · Communication (Enabling)": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "No task text — enabling layer [NACE]: Ethics/Professionalism, Communication — anchor-fit corrected 2026-10-29 (cross-cutting M11; user ruling): the PSOC 3313 e) tooling-task quote moved to the new row 11 technology anchor instead, so this row's \"no task text\" claim is now consistent.",
    ],
    specRef: "role-specs/audit.md Row 10 — Professional Skepticism · Communication (Enabling)",
    flags: ["Professional Skepticism KEPT per user ruling 2026-10-29 (attitude label, not a quoted source term; NACE-backed, attributed — spec honesty note 3)"],
  },
  "audit::Audit technology fluency (accounting software / Excel family)": {
    descriptor: "No descriptor printed; the attributed anchor above carries the row's source text.",
    anchors: [
      "Explicitly cited to O*NET: the O*NET 13-2011.00 Software Skills list (fetched this session) includes the Accounting software / Excel family. No invented IDEA claim — tool names are sourced only from the O*NET software-skill list (V-audit-4), and individual technology names are printable verbatim only after the O*NET data version is pinned.",
      "PSOC 3313 e) (verbatim, migrated from row 10 in the anchor-fit fix): \"e) using standard computer software packages to perform accounting and related calculations\" · O*NET 13-2011.00 Software Skills list (explicit O*NET attribution — fetched 2026-10-29; \"Accounting software / Excel family\" recorded; version-pin note: pin the O*NET data version at citation time before quoting individual technology items)",
    ],
    specRef: "role-specs/audit.md Row 11 — Audit technology fluency (optional technology row, user ruling 2026-10-29)",
    flags: ["row 11 technology names stand UNQUOTED until the O*NET data version is pinned at enrich time (standing rule in-file; ADR 0005 Model C)"],
  },
};

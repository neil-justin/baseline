import type { RowSpecMap } from "@/lib/fixtures/rowspec/types";

/**
 * Office & Administration track — per-row deep data from the BLESSED role specs
 * (adminassoc · clerk · encode · desk · execsec · records).
 * Conventions mirror it.ts/business.ts/accounting.ts. Track-specific carries
 * (per the row-shape rulings, applied in-file 2026-10-29):
 *  - desk: the 5 lettered PSOC 4225 core rows are the RULED shape (the
 *    catalog's 3 combined rows are restructured into them);
 *  - clerk: letter group e/g/h split into three thin rows (row 6
 *    resourceless-thin, declared);
 *  - encode: letter group d/e split into two thin rows; the "cryptographic
 *    procedures" O*NET anchor is KEPT (source-printed, user ruling
 *    2026-10-29), station-assigned to the data-movement row;
 *  - execsec/records: E2/E3 institutional-judgment admissions (R4) with the
 *    Job-Zone honesty notes carried (do NOT inflate the entry framing);
 *  - tourism-family honesty note wording (Front Office Services NC II) is
 *    approved per DECISION item 16 and travels unchanged to the resource
 *    layer of desk/execsec/records.
 */

export const ROW_SPECS_OFFICE: RowSpecMap = {
  // ── adminassoc · Administrative Associate (5.1; spec adminassoc.md) ──────
  "adminassoc::Filing systems (paper/electronic) operation": {
    descriptor: "Records backbone. (paraphrase — no per-task descriptor printed)",
    anchors: [
      "O*NET 43-6014.00: \"Set up and manage paper or electronic filing systems, recording information, updating paperwork, or maintaining documents, such as attendance records, correspondence, or other material.\"",
    ],
    specRef: "role-specs/adminassoc.md Row 1 — Filing systems operation",
  },
  "adminassoc::Database entry & maintenance": {
    descriptor: "Departmental record-keeping. (paraphrase)",
    anchors: [
      "O*NET 43-6014.00: \"Create, maintain, and enter information into databases.\" · \"Use computers for various applications, such as database management or word processing.\"",
    ],
    specRef: "role-specs/adminassoc.md Row 2 — Database entry & maintenance",
  },
  "adminassoc::Multi-channel reception & call routing": {
    descriptor: "Front-of-department role. (paraphrase)",
    anchors: [
      "O*NET 43-6014.00: \"Answer telephones and give information to callers, take messages, or transfer calls to appropriate individuals.\" · \"Greet visitors or callers and handle their inquiries or direct them to the appropriate persons according to their needs.\"",
    ],
    specRef: "role-specs/adminassoc.md Row 3 — Multi-channel reception & call routing",
  },
  "adminassoc::Office equipment operation & basic troubleshooting": {
    descriptor: "Facilities support. (paraphrase)",
    anchors: [
      "O*NET 43-6014.00: \"Operate office equipment, such as fax machines, copiers, or phone systems and arrange for repairs when equipment malfunctions.\"",
    ],
    specRef: "role-specs/adminassoc.md Row 4 — Office equipment operation",
  },
  "adminassoc::Meeting/coordination documentation": {
    descriptor: "Minutes, memos, schedules. (paraphrase)",
    anchors: [
      "O*NET 43-6014.00: \"Compose, type, and distribute meeting notes, routine correspondence, or reports, such as presentations or expense, statistical, or monthly reports.\" · \"Maintain scheduling and event calendars.\" · \"Schedule and confirm appointments for clients, customers, or supervisors.\"",
    ],
    specRef: "role-specs/adminassoc.md Row 5 — Meeting/coordination documentation",
  },
  "adminassoc::Communication · Professionalism · Critical Thinking (Enabling)": {
    descriptor: "Office citizenship. (paraphrase — NACE working definition layer)",
    anchors: [
      "NACE competencies, tag as in catalog — no verbatim task lines exist on the O*NET page for this row; carried as enabling layer. (flagged paraphrase)",
    ],
    specRef: "role-specs/adminassoc.md Row 6 — Enabling layer",
    flags: ["VA1-5: NACE enabling row carries no verbatim NACE quote in this spec — flagged paraphrase; pull NACE 2026 verbatim competency definitions before quoting NACE text (mechanical, at fixture)", "Job-Zone honesty note stands (O*NET reads Zone 1–2 / low-formation — file refuses to inflate the BSOA-entry framing)", "PSOC mapping is a flagged judgment (between 3343/4110) — carried, labeled"],
  },

  // ── clerk · Office Clerk (5.2; spec clerk.md) ─────────────────────────────
  "clerk::Recording, preparing, sorting, classifying and filing information": {
    descriptor: "Core clerk task. (paraphrase flag; unit framing above is printed)",
    anchors: [
      "PSOC 4110 task a] \"recording, preparing, sorting, classifying and filing information\"",
      "O*NET 43-9061.00: \"Compile, copy, sort, and file records of office activities, business transactions, and other activities.\"",
    ],
    specRef: "role-specs/clerk.md Row 1 — Filing (unit letter a)",
  },
  "clerk::Sorting, opening and sending mail": {
    descriptor: "Office mail flow. (paraphrase)",
    anchors: [
      "PSOC 4110 task b] \"sorting, opening and sending mail\"",
      "O*NET 43-9061.00: \"Open, sort, and route incoming mail, answer correspondence, and prepare outgoing mail.\"",
    ],
    specRef: "role-specs/clerk.md Row 2 — Mail flow (unit letter b)",
  },
  "clerk::Photocopying and sending documents": {
    descriptor: "Document reproduction, 4115-adjacent but printed in this unit. (paraphrase)",
    anchors: [
      "PSOC 4110 task c] \"photocopying and sending documents\"",
      "O*NET 43-9061.00: \"Operate office machines, such as photocopiers and scanners, facsimile machines, voice mail systems, and personal computers.\"",
    ],
    specRef: "role-specs/clerk.md Row 3 — Photocopying (unit letter c)",
  },
  "clerk::Routine reports & correspondence": {
    descriptor: "Routine written output. (paraphrase)",
    anchors: [
      "PSOC 4110 task d] \"preparing reports and correspondence of a routine nature\"",
      "O*NET 43-9061.00: \"Type, format, proofread, and edit correspondence and other documents, from notes or dictating machines, using computers or typewriters.\"",
    ],
    specRef: "role-specs/clerk.md Row 4 — Routine reports/correspondence (unit letter d)",
  },
  "clerk::Responding to enquiries (telephone/electronic) or forwarding": {
    descriptor: "Enquiry service from records. (paraphrase)",
    anchors: [
      "PSOC 4110 task f] \"responding to telephone or electronic enquiries or forwarding to appropriate person\"",
      "O*NET 43-9061.00: \"Review files, records, and other documents to obtain information to respond to requests.\" · \"Answer telephones, direct calls, and take messages.\"",
    ],
    specRef: "role-specs/clerk.md Row 5 — Responding/forwarding enquiries (unit letter f)",
  },
  "clerk::Recording issue of equipment to staff": {
    descriptor: "Name is the printed task text verbatim (thin row).",
    anchors: [
      "PSOC 4110 task e] \"recording issue of equipment to staff\"",
    ],
    specRef: "role-specs/clerk.md Row 6 — Thin lettered-task row (unit letter e)",
    flags: ["thin lettered-task row — split per user ruling 2026-10-29 (VC1-4, fidelity-first adopted)", "Row 6 declared resourceless-thin: no verified free resource; no forced search per the resource rule (no forced search ruling stands)"],
  },
  "clerk::Checking figures, preparing invoices and recording details of financial transactions made": {
    descriptor: "Name is the printed task text verbatim (thin row).",
    anchors: [
      "PSOC 4110 task g] \"checking figures, preparing invoices and recording details of financial transactions made\"",
    ],
    specRef: "role-specs/clerk.md Row 7 — Thin lettered-task row (unit letter g)",
    flags: ["thin lettered-task row — split per user ruling 2026-10-29 (VC1-4)", "resource linkage: TOP Introduction to Bookkeeping → this row (spec resources, rows 6–8 tagging)"],
  },
  "clerk::Transcribing information into computers, and proof-reading and correcting copy": {
    descriptor: "Name is the printed task text verbatim (thin row).",
    anchors: [
      "PSOC 4110 task h] \"transcribing information into computers, and proof-reading and correcting copy\"",
      "O*NET 43-9061.00: \"Maintain and update filing, inventory, mailing, and database systems, either manually or using a computer.\" (the bundle's O*NET database-systems anchor, station-assigned to this transcription row in the split)",
    ],
    specRef: "role-specs/clerk.md Row 8 — Thin lettered-task row (unit letter h)",
    flags: ["thin lettered-task row — split per user ruling 2026-10-29 (VC1-4)", "resource linkage: Ratatype → this row (spec resources)"],
  },
  "clerk::Communication · Professionalism (Enabling)": {
    descriptor: "Workday reliability. (paraphrase — NACE layer)",
    anchors: ["NACE competencies, tag as in catalog — no verbatim quote in this spec; flagged paraphrase."],
    specRef: "role-specs/clerk.md Row 9 — Enabling layer",
    flags: ["VC1-5: NACE row remains paraphrase-flagged; pull verbatim NACE definitions before citing NACE text (mechanical)"],
  },

  // ── encode · Data Encoder (5.3; spec encode.md) ───────────────────────────
  "encode::Receiving & registering source documents for data capture": {
    descriptor: "(paraphrase) Ingest discipline — what lands, when, where.",
    anchors: [
      "PSOC 4132 task a] \"receiving and registering invoices, forms, records and other documents for data capture\"",
      "O*NET 43-9021.00: \"Select materials needed to complete work assignments.\"",
    ],
    specRef: "role-specs/encode.md Row 1 — Receive & register source documents",
  },
  "encode::Source-document reading & field mapping (entering from source material)": {
    descriptor: "Correct-field discipline. (paraphrase)",
    anchors: [
      "O*NET 43-9021.00: \"Read source documents such as canceled checks, sales reports, or bills, and enter data in specific data fields or onto tapes or disks for subsequent entry, using keyboards or scanners.\"",
      "PSOC 4132 task b] \"entering numerical data, codes and text from source material into computer-compatible storage and processing devices\"",
    ],
    specRef: "role-specs/encode.md Row 2 — Source-document reading & field mapping",
  },
  "encode::Accuracy/error detection & correction": {
    descriptor: "QA personal loop. (paraphrase)",
    anchors: [
      "O*NET 43-9021.00: \"Locate and correct data entry errors, or report them to supervisors.\" · \"Compare data with source documents, or re-enter data in verification format to detect errors.\"",
      "PSOC 4132 task c] \"verifying accuracy and completeness of data and correcting entered data, if needed\"",
    ],
    specRef: "role-specs/encode.md Row 3 — Accuracy/error detection & correction",
  },
  "encode::Compilation, sorting, verification before entry": {
    descriptor: "Pre-entry quality. (paraphrase)",
    anchors: [
      "O*NET 43-9021.00: \"Compile, sort, and verify the accuracy of data before it is entered.\"",
      "PSOC 4132 task b, second instance of pre-entry order] \"entering numerical data, codes and text from source material…\"",
    ],
    specRef: "role-specs/encode.md Row 4 — Compilation/sorting/verification",
  },
  "encode::Storing completed documents & logs (records + throughput discipline)": {
    descriptor: "(paraphrase) Where finished work goes; proof of throughput.",
    anchors: [
      "O*NET 43-9021.00: \"Store completed documents in appropriate locations.\" · \"Maintain logs of activities and completed work.\"",
    ],
    specRef: "role-specs/encode.md Row 5 — Storing/logs",
  },
  "encode::Operating bookkeeping and calculating machines": {
    descriptor: "Name is the printed task text verbatim (thin row).",
    anchors: [
      "PSOC 4132 task d] \"operating bookkeeping and calculating machines\"",
      "O*NET 43-9021.00 \"Operate data entry device, such as keyboard or photo composing perforator.\" (overview) · \"Load machines with required input or output media, such as paper, cards, disks, tape, or Braille media.\" (machine-operation anchors, station-assigned to this row in the split)",
    ],
    specRef: "role-specs/encode.md Row 6 — Thin lettered-task row (letter d)",
    flags: ["thin lettered-task row — split per user ruling 2026-10-29 (VE-4)"],
  },
  "encode::Importing and exporting data between different database systems and softwares": {
    descriptor: "Name is the printed task text verbatim (thin row).",
    anchors: [
      "PSOC 4132 task e] \"importing and exporting data between different database systems and softwares\"",
      "O*NET 43-9021.00: \"Resolve garbled or indecipherable messages, using cryptographic procedures and equipment.\" (rare-task anchor; quoted for completeness of the 9-task list — KEPT per user ruling 2026-10-29, O*NET-source-printed, existing citation; data-movement station in the split)",
    ],
    specRef: "role-specs/encode.md Row 7 — Thin lettered-task row (letter e)",
    flags: ["thin lettered-task row — split per user ruling 2026-10-29 (VE-4); \"cryptographic procedures\" anchor KEPT (source-printed)"],
  },
  "encode::Confidentiality (Etiquette/Professionalism — Enabling)": {
    descriptor: "PII/financial data respect. (paraphrase — NACE layer)",
    anchors: [
      "NACE competencies + RA 10173 context as carried in catalog — no verbatim NACE text here; flagged paraphrase.",
    ],
    specRef: "role-specs/encode.md Row 8 — Confidentiality (Enabling)",
    flags: ["VE-5: NACE confidentiality row stays paraphrase-flagged (mechanical pull later)"],
  },

  // ── desk · Counter / Enquiry Clerk (5.5; spec desk.md) ───────────────────
  "desk::Answering inquiries about goods/services/policies (availability, location, price)": {
    descriptor: "(paraphrase) The unit's defining act: answer what is asked, from what the organization offers.",
    anchors: [
      "PSOC 4225 task a] \"answering inquiries about goods, services and policies, and providing information about their availability, location, price and related issues\"",
      "PSF-CCB (corroboration): \"Address customer queries and concerns through various channels in a timely manner\"",
      "PSOC 4225 unit text (verbatim, ONE string, possessive literally printed `organization’s`): \"Enquiry clerks respond to personal, written, electronic mail and telephone enquiries and complaints about the organization’s goods, services and policies, provide information and refer people to other sources.\"",
    ],
    specRef: "role-specs/desk.md — core row (4225 task a)",
    flags: ["the 5 lettered PSOC 4225 core rows are the adopted shape (user-ruled 2026-10-29: the catalog's 3 combined rows are restructured into these 5 rows); VD1-1 possessive seam resolved via the parsed phscs v0.2.0 dataset; standing psa.gov.ph revalidation flag unchanged"],
  },
  "desk::Assisting on problems, advice, information (member of the counter service set)": {
    descriptor: "(paraphrase) Be where difficult requests are handled first.",
    anchors: [
      "PSOC 4225 task b] \"responding to enquiries about problems and providing advice, information and assistance\"",
      "PSF-CCB (corroboration): \"Gather information, analyze situations, and develop solutions to customer issues\"",
    ],
    specRef: "role-specs/desk.md — core row (4225 task b)",
  },
  "desk::Recording information about enquiries and complaints": {
    descriptor: "Visitor/inquiry logging — the catalog's \"Log & follow-up inquiries\" row content. (paraphrase)",
    anchors: [
      "PSOC 4225 task c] \"recording information about enquiries and complaints\"",
      "PSF-CCB (corroboration): \"Record customers' requests accurately and follow-up actions into database system\" · \"Maintain the client's customer database to ensure it is up-to-date\"",
    ],
    specRef: "role-specs/desk.md — core row (4225 task c)",
  },
  "desk::Referring complex enquiries to team leaders or expert advisers": {
    descriptor: "(paraphrase) The translate-request-escalate pattern: you are the first line, not the last.",
    anchors: [
      "PSOC 4225 task d] \"referring complex enquiries to team leaders or expert advisers\"",
      "PSF-CCB (corroboration): \"Escalate to Subject Matter Expert or Supervisor or specialized teams when necessary\"; \"escalate matters to senior officers when necessary\" (band framing text, corroborates)",
    ],
    specRef: "role-specs/desk.md — core row (4225 task d)",
  },
  "desk::Issuing forms, information kits and brochures": {
    descriptor: "Counter-side document service. (paraphrase)",
    anchors: [
      "PSOC 4225 task e] \"issuing relevant forms, information kits and brochures to interested parties\"",
    ],
    specRef: "role-specs/desk.md — core row (4225 task e)",
    flags: ["walk-in *visitor* reception per se (greet/route visitors) prints in the neighboring PSOC \"Receptionists (general)\" unit framing — the spec keeps the row shape ruled; a dedicated visitor row would need a user call (not taken here)"],
  },
  "desk::Communication & professionalism at the corporate front-desk (Enabling)": {
    descriptor: "Office-culture fit / corporate conduct & appearance. (paraphrase — NACE + PSF-CCB behavior language)",
    anchors: [
      "PSF-CCB: \"Communicate clearly and professionally with customers\" · \"Demonstrate empathy and understanding towards customer concerns\" (authored in framework — usable verbatim) · NACE Professionalism, tag-level only — flagged paraphrase",
    ],
    specRef: "role-specs/desk.md — enabling row",
  },

  // ── execsec · Executive Secretary (E2; spec execsec.md) ──────────────────
  "execsec::Executive schedule & calendar management": {
    descriptor: "Run the calendar of the people you support — no double-booking, no missed window. (paraphrase)",
    anchors: [
      "O*NET 43-6011.00: \"Manage and maintain executives' schedules.\"",
      "PSOC 3343 task c] \"screening requests for meetings, scheduling and organizing meetings and travel arrangements\"",
    ],
    specRef: "role-specs/execsec.md Row 1 — Schedule & calendar",
  },
  "execsec::Correspondence & document production": {
    descriptor: "Produce the office's written output — letters, memos, spreadsheets, decks — to standard. (paraphrase)",
    anchors: [
      "O*NET 43-6011.00: \"Prepare invoices, reports, memos, letters, financial statements, and other documents, using word processing, spreadsheet, database, or presentation software.\" · \"Prepare responses to correspondence containing routine inquiries.\"",
      "PSOC 3343 task f] \"writing and answering business or technical letters and other similar correspondence\"",
    ],
    specRef: "role-specs/execsec.md Row 2 — Correspondence & document production",
  },
  "execsec::Meeting administration & minutes": {
    descriptor: "Prepare agendas, take and finish minutes, and make meetings actually happen on time. (paraphrase)",
    anchors: [
      "O*NET 43-6011.00: \"Prepare agendas and make arrangements, such as coordinating catering for luncheons, for committee, board, and other meetings.\" · \"Attend meetings to record minutes.\" · \"Compile, transcribe, and distribute minutes of meetings.\"",
      "PSOC 3343 task a] \"drafting administrative correspondence and minutes\"; task g) \"preparing verbatim reports of proceedings … \"",
    ],
    specRef: "role-specs/execsec.md Row 3 — Meeting administration & minutes",
  },
  "execsec::Information gatekeeping: calls & visitors": {
    descriptor: "Answer for the office — route the call, receive the visitor, decide who gets the meeting. (paraphrase)",
    anchors: [
      "O*NET 43-6011.00: \"Answer phone calls and direct calls to appropriate parties or take messages.\" · \"Greet visitors and determine whether they should be given access to specific individuals.\"",
    ],
    specRef: "role-specs/execsec.md Row 4 — Information gatekeeping",
  },
  "execsec::Research & briefing support for executives": {
    descriptor: "Dig up information and shape it into briefing papers decision-makers can use. (paraphrase)",
    anchors: [
      "O*NET 43-6011.00: \"Conduct research, compile data, and prepare papers for consideration and presentation by executives, committees, and boards of directors.\"",
    ],
    specRef: "role-specs/execsec.md Row 5 — Research & briefing support",
  },
  "execsec::Incoming-material triage & distribution": {
    descriptor: "Read what comes in, judge what matters, and get it to the right hands. (paraphrase)",
    anchors: [
      "O*NET 43-6011.00: \"Read and analyze incoming memos, submissions, and reports to determine their significance and plan their distribution.\" · \"Open, sort, and distribute incoming correspondence, including faxes and email.\"",
      "PSOC 3343 task b] \"obtaining, proposing and monitoring deadlines and follow-up dates\"",
    ],
    specRef: "role-specs/execsec.md Row 6 — Incoming-material triage & distribution",
  },
  "execsec::Office services coordination": {
    descriptor: "Be the hub that holds office services — records, budget prep, housekeeping — together. (paraphrase)",
    anchors: [
      "O*NET 43-6011.00: \"Coordinate and direct office services, such as records, departmental finances, budget preparation, personnel issues, and housekeeping, to aid executives.\"",
      "PSOC 3343 task d] \"assisting in the preparation of budgets, monitoring of expenditures, drafting of contracts and purchasing or acquisition orders\"",
    ],
    specRef: "role-specs/execsec.md Row 7 — Office services coordination",
  },
  "execsec::Travel arrangements": {
    descriptor: "Book trips and itineraries for executives end to end. (paraphrase)",
    anchors: ["O*NET 43-6011.00: \"Make travel arrangements for executives.\""],
    specRef: "role-specs/execsec.md Row 8 — Travel arrangements",
  },
  "execsec::Records & document filing/retrieval": {
    descriptor: "Keep corporate files complete and retrievable (overlaps the filing-clerk skill in E3). (paraphrase)",
    anchors: ["O*NET 43-6011.00: \"File and retrieve corporate documents, records, and reports.\""],
    specRef: "role-specs/execsec.md Row 9 — Records & document filing/retrieval",
    flags: ["E3-overlap honesty note on the records row: recorded and carried (no conflict with records' own file)"],
  },
  "execsec::General office duties & tools": {
    descriptor: "Handle day-to-day office upkeep: supplies, record databases, basic bookkeeping. (paraphrase)",
    anchors: [
      "O*NET 43-6011.00: \"Perform general office duties, such as ordering supplies, maintaining records management database systems, and performing basic bookkeeping work.\"",
    ],
    specRef: "role-specs/execsec.md Row 10 — General office duties & tools",
  },
  "execsec::Clerical support across departments": {
    descriptor: "Lend admin firepower wherever another department needs it. (paraphrase)",
    anchors: [
      "O*NET 43-6011.00: \"Provide clerical support to other departments.\"",
      "PSOC 3343 task e] \"liaising with other staff about a range of matters relating to the organization’s operations\" (seed resolved per dataset-verbatim fix — VE2-2 RESOLVED 2026-10-29: the v0.2.0 dataset carries 3343 as ONE string with the possessive literally printed as `organization’s`)",
    ],
    specRef: "role-specs/execsec.md Row 11 — Clerical support across departments",
  },
  "execsec::Payroll-information processing": {
    descriptor: "Push payroll data into the pay cycle correctly and on time. (paraphrase)",
    anchors: ["O*NET 43-6011.00: \"Process payroll information.\""],
    specRef: "role-specs/execsec.md Row 12 — Payroll-information processing",
  },
  "execsec::Administrative policy setup & interpretation": {
    descriptor: "Explain the office rules — and as you grow, help write them. (paraphrase) (senior-heavy)",
    anchors: [
      "O*NET 43-6011.00: \"Interpret administrative and operating policies and procedures for employees.\" · \"Set up and oversee administrative policies and procedures for offices or organizations.\"",
      "PSOC 3343 task h] \"supervising the work of clerical support workers\" (senior-adjacent)",
    ],
    specRef: "role-specs/execsec.md Row 13 — Administrative policy setup & interpretation",
    flags: ["explicitly-tagged senior-heavy secondary row (1 of 4)"],
  },
  "execsec::Representing executives / meeting on their behalf": {
    descriptor: "Sometimes you *are* the meeting — attend for the executive and report back. (paraphrase) (senior-heavy)",
    anchors: [
      "O*NET 43-6011.00: \"Meet with individuals, special interest groups, and others on behalf of executives, committees, and boards of directors.\"",
    ],
    specRef: "role-specs/execsec.md Row 14 — Representing executives",
    flags: ["explicitly-tagged senior-heavy secondary row (2 of 4)"],
  },
  "execsec::Supervision & training of clerical staff": {
    descriptor: "Onboard and guide the junior clerks around you. (paraphrase) (senior-heavy)",
    anchors: [
      "O*NET 43-6011.00: \"Supervise and train other clerical staff and arrange for employee training by scheduling training or organizing training material.\"",
    ],
    specRef: "role-specs/execsec.md Row 15 — Supervision & training (senior-heavy)",
    flags: ["explicitly-tagged senior-heavy secondary row (3 of 4)"],
  },
  "execsec::Operating-practice review": {
    descriptor: "Look for the slow spots in workflow and propose fixes. (paraphrase) (senior-heavy)",
    anchors: [
      "O*NET 43-6011.00: \"Review operating practices and procedures to determine whether improvements can be made in areas such as workflow, reporting procedures, or expenditures.\"",
    ],
    specRef: "role-specs/execsec.md Row 16 — Operating-practice review (senior-heavy)",
    flags: ["explicitly-tagged senior-heavy secondary row (4 of 4)"],
  },
  "execsec::Employee time-tracking": {
    descriptor: "Keep attendance/time records straight. (paraphrase)",
    anchors: ["O*NET 43-6011.00: \"Keep track of employees' time.\""],
    specRef: "role-specs/execsec.md Row 17 — Employee time-tracking",
    flags: ["Job-Zone honesty note stands (O*NET Zone 3 / SVP 6.0–<7.0 — E2 stays framed junior-feeder; do NOT inflate)"],
  },

  // ── records · Records Clerk (E3; spec records.md) ─────────────────────────
  "records::Sort & classify materials to filing rules": {
    descriptor: "Put every document where the filing system says it belongs. (paraphrase)",
    anchors: [
      "PSOC 4415 task a] \"sorting or classifying materials according to guidelines such as content, purpose, user criteria, or chronological, alphabetical, or numerical order\"",
    ],
    specRef: "role-specs/records.md Row 1 — Sort & classify to filing rules (4415 task a)",
  },
  "records::Filing into storage (drawers/cabinets/boxes)": {
    descriptor: "Physically (or digitally) file the records — correctly, immediately, every time. (paraphrase)",
    anchors: [
      "PSOC 4415 task b] \"filing material in drawers, cabinets and storage boxes\" + framing text \"file correspondence, cards, invoices, receipts and other records in alphabetical or numerical order or according to the filing system used\"",
    ],
    specRef: "role-specs/records.md Row 2 — Filing into storage (4415 task b)",
  },
  "records::File retrieval on request": {
    descriptor: "Find any filed item on demand without minutes of searching. (paraphrase)",
    anchors: [
      "PSOC 4415 task c] \"locating and removing materials from files when requested\" + framing text \"They locate and remove material from file when requested\"",
    ],
    specRef: "role-specs/records.md Row 3 — Retrieval on request (4415 task c)",
  },
  "records::Filing log / records of materials filed & removed": {
    descriptor: "Track what went in and what went out so nothing is ever \"lost in filing\". (paraphrase)",
    anchors: [
      "PSOC 4415 task d] \"keeping records of materials filed and removed\"",
    ],
    specRef: "role-specs/records.md Row 4 — Filing log (4415 task d)",
  },
  "records::Reprographics: photocopy, scan, fax": {
    descriptor: "Operate the copy/scan/fax flow that feeds and mirrors the file. (paraphrase)",
    anchors: [
      "PSOC 4415 task e] \"photocopying, scanning or faxing documents\" + framing text \"and photocopy, scan or fax documents\"",
    ],
    specRef: "role-specs/records.md Row 5 — Reprographics (4415 task e)",
    flags: ["PSOC 4415 recovered as an intact single string (no seam) positionally confirmed between 3313/3315 neighbors; direct psa.gov.ph re-check before final cite still due (403 standing flag, VR1-1)"],
  },
  "records::Telephone, switchboard & front-desk duties": {
    descriptor: "Take calls, screen them, relay messages — the office's first voice. (paraphrase)",
    anchors: [
      "O*NET 43-4171.00: \"Operate telephone switchboard to answer, screen, or forward calls, providing information, taking messages, or scheduling appointments.\"",
    ],
    specRef: "role-specs/records.md Row 6 — Switchboard/phone duties (corroboration)",
  },
  "records::Visitor greeting & routing": {
    descriptor: "Meet visitors, learn what they need, point them to the right door. (paraphrase)",
    anchors: [
      "O*NET 43-4171.00: \"Greet persons entering establishment, determine nature and purpose of visit, and direct or escort them to specific destinations.\"",
    ],
    specRef: "role-specs/records.md Row 7 — Visitor greeting (corroboration)",
  },
  "records::Appointment & calendar scheduling": {
    descriptor: "Keep the office's calendar alive and accurate. (paraphrase)",
    anchors: [
      "O*NET 43-4171.00: \"Schedule appointments and maintain and update appointment calendars.\"",
    ],
    specRef: "role-specs/records.md Row 8 — Appointment scheduling (corroboration)",
  },
  "records::Mail & document handling": {
    descriptor: "Move paper and messages in and out. (paraphrase)",
    anchors: [
      "O*NET 43-4171.00: \"Collect, sort, distribute, or prepare mail, messages, or courier deliveries.\" · \"Transmit information or documents to customers, using computer, mail, or facsimile machine.\"",
    ],
    specRef: "role-specs/records.md Row 9 — Mail & document handling (corroboration)",
  },
  "records::Front-office record & database upkeep": {
    descriptor: "Keep contact records and logs current. (paraphrase)",
    anchors: [
      "O*NET 43-4171.00: \"File and maintain records.\" · \"Enter and update databases of contact information, such as names, addresses, and phone numbers.\"",
    ],
    specRef: "role-specs/records.md Row 10 — Record & database upkeep (corroboration)",
    flags: ["O*NET 43-4171 is kept honestly labeled as the neighboring Receptionists family, not the filing clerk itself (titles overlap; PSOC judgment not implied)"],
  },
  "records::Info & customer-service communication": {
    descriptor: "Answer \"who, where, what\" instantly and politely. (paraphrase)",
    anchors: [
      "O*NET 43-4171.00: \"Provide information about establishment, such as location of departments or offices, employees within the organization, or services provided.\" · essential skills all 5 printed: \"Speaking — Talking to others to convey information effectively.\", \"Active Listening — Giving full attention to what other people are saying…\", \"Critical Thinking — Using logic and reasoning…\", \"Reading Comprehension — Understanding written sentences…\", \"Writing — Communicating effectively in writing…\" (O*NET essential-skills layer, quoted verbatim)",
    ],
    specRef: "role-specs/records.md Row 11 — Info & customer-service communication (essential-skills layer)",
    flags: ["VR1-4: \"TESDA has no dedicated NC for filing work\" — roster-recorded, not re-verified (carried note)"],
  },
};

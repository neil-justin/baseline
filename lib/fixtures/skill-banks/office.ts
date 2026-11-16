import type { SkillLadder, VMCQ } from "@/app/(onboarding)/onboarding/banks";

/**
 * office-track skill verification bank — one MCQ per canonical skill row
 * (lib/fixtures/catalog.ts), authored 2026-11-04 (assessments content round).
 * `catalogSkill` is the API key: POST /api/verify → markVerified — it must
 * byte-match the catalog skill name. The 5 canon demo-path skills are NOT
 * here (they live in the shipped VERIFY_BANK, onboarding/banks.ts).
 */
export const OFFICE_BANK: VMCQ[] = [
  {
    skill: "Filing systems (paper/electronic) operation",
    catalogSkill: "Filing systems (paper/electronic) operation",
    stem: "A manager asks for last quarter's purchase records, and the office keeps paper files plus a shared drive. What does a working filing system guarantee?",
    options: [
      "shred all records once the fiscal year closes",
      "let each clerk invent personal folder names for speed",
      "any authorized person can retrieve a record fast under one shared scheme",
      "hold new files in a drawer until someone requests them",
    ],
    answer: 2,
  },
  {
    skill: "Database entry & maintenance",
    catalogSkill: "Database entry & maintenance",
    stem: "Your team tracks supplier contacts and order statuses in a shared database. Which habit keeps that record-keeping trustworthy?",
    options: [
      "keep a private spreadsheet and paste it into the database monthly",
      "enter new or changed details the same day, in the right fields",
      "fix entries only when a client complains about them",
      "let each teammate abbreviate record fields their own way",
    ],
    answer: 1,
  },
  {
    skill: "Multi-channel reception & call routing",
    catalogSkill: "Multi-channel reception & call routing",
    stem: "A phone call, an email, and a walk-in visitor arrive within the same five minutes at the department's front line. The professional first move is to",
    options: [
      "judge each need quickly and route the call, email, and visitor to the right owner",
      "reply to everything after lunch with one group email",
      "answer only the visitor and let the phone keep ringing",
      "forward all calls to the manager's direct line and vanish",
    ],
    answer: 0,
  },
  {
    skill: "Office equipment operation & basic troubleshooting",
    catalogSkill: "Office equipment operation & basic troubleshooting",
    stem: "The office printer jams mid-morning and copies are due for a 2 p.m. meeting. What does handling this well look like?",
    options: [
      "post an out-of-order sign and stop printing for the day",
      "swap the toner while the paper is still jammed inside",
      "email the vendor and print nothing until they reply next week",
      "clear the jam following the machine's steps, then test a copy page",
    ],
    answer: 3,
  },
  {
    skill: "Meeting/coordination documentation",
    catalogSkill: "Meeting/coordination documentation",
    stem: "After a planning session, what written output lets everyone who missed it still act correctly?",
    options: [
      "retype every sentence spoken, word for word",
      "publish minutes with the decisions, owners, and deadlines",
      "keep the outcomes in your head until someone asks",
      "send the slide deck only after the next session ends",
    ],
    answer: 1,
  },
  {
    skill: "Recording, preparing, sorting, classifying and filing information",
    catalogSkill: "Recording, preparing, sorting, classifying and filing information",
    stem: "A jumbled stack of invoices, letters, and forms lands on your desk. What sequence keeps the department's records sound?",
    options: [
      "file everything alphabetically by your own nickname system",
      "shred apparent duplicates without checking either copy",
      "leave the stack for the next shift to sort out",
      "prepare, sort, and classify each document, then file it where it belongs",
    ],
    answer: 3,
  },
  {
    skill: "Sorting, opening and sending mail",
    catalogSkill: "Sorting, opening and sending mail",
    stem: "The morning mail batch reaches the office. The clerk's part in the mail flow is to",
    options: [
      "open only the letters addressed to you personally",
      "pile the unopened mail on the manager's chair and leave",
      "sort, open as authorized, and route each item to its addressee",
      "take the mail home and sort it there overnight",
    ],
    answer: 2,
  },
  {
    skill: "Photocopying and sending documents",
    catalogSkill: "Photocopying and sending documents",
    stem: "A supervisor needs clean copies of a signed contract sent to a branch office. The correct handling is to",
    options: [
      "copy just the first page and note the rest is 'similar'",
      "produce clean copies of the full set and dispatch them with a transmission record",
      "scan at random quality and skip any dispatch log",
      "ask the branch office to retype the document themselves",
    ],
    answer: 1,
  },
  {
    skill: "Routine reports & correspondence",
    catalogSkill: "Routine reports & correspondence",
    stem: "Friday means the weekly activity summary is due to your supervisor. Your part is to",
    options: [
      "draft the summary from the week's own records and send it on schedule",
      "skip the week since nothing dramatic happened",
      "have the supervisor dictate it, then sign your name",
      "pad it with office gossip to fill the page",
    ],
    answer: 0,
  },
  {
    skill: "Responding to enquiries (telephone/electronic) or forwarding",
    catalogSkill: "Responding to enquiries (telephone/electronic) or forwarding",
    stem: "An email asks whether a 2019 permit renewal form is still on file. Working from the records, you should",
    options: [
      "reply 'probably still around' and close the ticket",
      "send a made-up substitute form link to keep them happy",
      "tell the sender to come back after the next fiscal year",
      "check the records, answer from what they show, or forward it to the record's owner",
    ],
    answer: 3,
  },
  {
    skill: "Recording issue of equipment to staff",
    catalogSkill: "Recording issue of equipment to staff",
    stem: "A teammate borrows the department's projector for an offsite conference. What does the register duty require?",
    options: [
      "assume it returns on its own and skip the paperwork",
      "log it under another department to keep your numbers balanced",
      "record who took it, when it left, and note the return when it's back",
      "wait until someone else needs it to mention the loan",
    ],
    answer: 2,
  },
  {
    skill: "Checking figures, preparing invoices and recording details of financial transactions made",
    catalogSkill: "Checking figures, preparing invoices and recording details of financial transactions made",
    stem: "A client invoice you've drafted shows ₱12,500 but the approved rate card says ₱15,000. Recording the transaction correctly means you",
    options: [
      "check it against the source record, correct it, and log the transaction details",
      "bill the lower figure as a goodwill gesture to the client",
      "split the difference and round both amounts off",
      "send the invoice with the error and fix it at the next audit",
    ],
    answer: 0,
  },
  {
    skill: "Transcribing information into computers, and proof-reading and correcting copy",
    catalogSkill: "Transcribing information into computers, and proof-reading and correcting copy",
    stem: "You key 40 pages of handwritten survey forms into the system. What is expected before you submit the batch?",
    options: [
      "submit immediately — once typed, it's typed",
      "have a colleague retype the whole batch from scratch",
      "proofread the entries against the handwritten pages and fix discrepancies first",
      "delete the illegible entries so the totals come out clean",
    ],
    answer: 2,
  },
  {
    skill: "Receiving & registering source documents for data capture",
    catalogSkill: "Receiving & registering source documents for data capture",
    stem: "Branch offices email scan batches for data entry; two arrive without batch numbers. The ingest discipline is to",
    options: [
      "key the unnumbered batches anyway under your own initials",
      "bin the unnumbered ones to save checking time",
      "key them into last month's batch to keep counts even",
      "register every batch — number, date, sender — and chase the missing numbers before entry",
    ],
    answer: 3,
  },
  {
    skill: "Source-document reading & field mapping (entering from source material)",
    catalogSkill: "Source-document reading & field mapping (entering from source material)",
    stem: "A paper form lists 'Date of Birth' and 'Account No.' side by side with an unfamiliar layout. Entering from the source, your discipline is to",
    options: [
      "pick the likelier-looking order and key fast",
      "read each labeled field and map it to the matching database field exactly",
      "key the form's reference number into the birth-date field to save time",
      "leave both fields blank and move on without checking",
    ],
    answer: 1,
  },
  {
    skill: "Accuracy/error detection & correction",
    catalogSkill: "Accuracy/error detection & correction",
    stem: "You spot your own typo in a client's address already saved to the database, before anyone else notices. The quality loop you run is to",
    options: [
      "correct the record now and check whether the error spread to dependent entries",
      "delete the whole record to keep things safe",
      "wait for the client to complain before touching anything",
      "jot the error on a sticky note for someday later",
    ],
    answer: 0,
  },
  {
    skill: "Compilation, sorting, verification before entry",
    catalogSkill: "Compilation, sorting, verification before entry",
    stem: "Ninety enrollment forms arrive in jumbled folders for keying. What comes before the first role is entered?",
    options: [
      "key while sorting to overlap the two tasks and save an hour",
      "key only the thickest folder and defer the rest",
      "compile, sort, and verify the forms are complete and legible before keying any row",
      "send half the pile back unread to slow the intake",
    ],
    answer: 2,
  },
  {
    skill: "Storing completed documents & logs (records + throughput discipline)",
    catalogSkill: "Storing completed documents & logs (records + throughput discipline)",
    stem: "End of day: 60 processed forms are finished. What is the proper handling of completed work?",
    options: [
      "leave them where you finished so the desk shows your effort",
      "store them in their designated location with the day's processing log",
      "hand the entire pile to the manager's office to sort out",
      "scan and shred them so nothing physical is stored at all",
    ],
    answer: 1,
  },
  {
    skill: "Operating bookkeeping and calculating machines",
    catalogSkill: "Operating bookkeeping and calculating machines",
    stem: "A ledger total must be computed before posting. Working the bookkeeping machine, sound practice is to",
    options: [
      "estimate the total mentally and type it straight in",
      "use a phone calculator and throw the tape away",
      "ask a coworker to guess the total with you",
      "run the entries on the machine and verify the printed tape against the ledger",
    ],
    answer: 3,
  },
  {
    skill: "Importing and exporting data between different database systems and softwares",
    catalogSkill: "Importing and exporting data between different database systems and softwares",
    stem: "Finance's system needs this month's records as CSV, but your system exports XLSX. The data-movement task is to",
    options: [
      "convert and transfer the dataset between the formats, then verify nothing was lost",
      "retype every record by hand into the other system",
      "email the whole database across and let finance untangle it",
      "decline the request because the two formats differ",
    ],
    answer: 0,
  },
  {
    skill: "Confidentiality (Etiquette/Professionalism — Enabling)",
    catalogSkill: "Confidentiality (Etiquette/Professionalism — Enabling)",
    stem: "A friend outside work casually asks about a client's salary in a file you process. Respecting the data means you",
    options: [
      "share it — you're friends and it's only one figure",
      "decline and keep file access limited to what your role requires",
      "hint at the amount so you haven't technically said it",
      "forward them the file so they can look themselves",
    ],
    answer: 1,
  },
  {
    skill: "Answering inquiries about goods/services/policies (availability, location, price)",
    catalogSkill: "Answering inquiries about goods/services/policies (availability, location, price)",
    stem: "A caller asks whether the seminar kit is available, where to get it, and what it costs. The counter officer's core act is to",
    options: [
      "transfer the caller through three departments and hang up",
      "answer 'just check online' and end the call",
      "answer availability, location, and price accurately from current service information",
      "quote last year's prices from memory without checking",
    ],
    answer: 2,
  },
  {
    skill: "Assisting on problems, advice, information (member of the counter service set)",
    catalogSkill: "Assisting on problems, advice, information (member of the counter service set)",
    stem: "A visitor's request involves a fee dispute — beyond the standard list you handle. As part of the counter service set, you",
    options: [
      "argue the visitor's case with the finance director on the spot",
      "engage the problem, take down the details, and connect the visitor to the right help",
      "issue a general brochure and see them out",
      "say disputes are not counter business and stop there",
    ],
    answer: 1,
  },
  {
    skill: "Recording information about enquiries and complaints",
    catalogSkill: "Recording information about enquiries and complaints",
    stem: "A caller complains about a delayed license reissue. Beyond calming them down, the required step at the counter is to",
    options: [
      "log it — who, what, when — in the inquiry record for follow-up",
      "apologize verbally and skip any record-keeping",
      "remember it mentally; writing things down looks bureaucratic",
      "tell the caller to lodge the complaint somewhere else",
    ],
    answer: 0,
  },
  {
    skill: "Referring complex enquiries to team leaders or expert advisers",
    catalogSkill: "Referring complex enquiries to team leaders or expert advisers",
    stem: "A question about document authentication for a visa application stumps you at the desk. Following the referral pattern, you",
    options: [
      "answer from a reasonable guess and hope it holds",
      "send the visitor to a different government office entirely",
      "explain the question isn't the counter's concern",
      "take the details, say you'll confirm, and refer it to the team leader or expert",
    ],
    answer: 3,
  },
  {
    skill: "Issuing forms, information kits and brochures",
    catalogSkill: "Issuing forms, information kits and brochures",
    stem: "A parent at the window needs an application form and its requirements list. The document service they should get is to",
    options: [
      "describe the form from memory and hand over a torn sample",
      "sell a photocopy of last year's version at cost",
      "issue the current official form with its matching information kit",
      "hand both over but refuse to explain what to do next",
    ],
    answer: 2,
  },
  {
    skill: "Communication & professionalism at the corporate front-desk (Enabling)",
    catalogSkill: "Communication & professionalism at the corporate front-desk (Enabling)",
    stem: "An executive visitor arrives unannounced, visibly frustrated, while you're mid-task. Front-desk professionalism looks like this:",
    options: [
      "keep typing until your task is done before looking up",
      "greet them, acknowledge the frustration, and bring the right contact in promptly",
      "say the person they want is busy and wave them toward the lift",
      "match their frustration so they take you seriously",
    ],
    answer: 1,
  },
  {
    skill: "Executive schedule & calendar management",
    catalogSkill: "Executive schedule & calendar management",
    stem: "Two department heads request the same Tuesday slot with your executive, and a board call already sits at 3 p.m. You",
    options: [
      "check the calendar, give the free slot to one, and offer real alternatives to the other",
      "accept both and let the executive untangle the collision later",
      "cancel the board call to accommodate both requesters",
      "accept neither until the executive returns from leave",
    ],
    answer: 0,
  },
  {
    skill: "Correspondence & document production",
    catalogSkill: "Correspondence & document production",
    stem: "A memo, a client letter, and a slide deck are all due tomorrow. The standard you hold the written output to is:",
    options: [
      "produce only the memo — the rest can be handled verbally",
      "send the client letter with the placeholder brackets still inside",
      "produce each to the office template — accurate, finished, on deadline",
      "hand the whole batch to an intern without reviewing the output",
    ],
    answer: 2,
  },
  {
    skill: "Meeting administration & minutes",
    catalogSkill: "Meeting administration & minutes",
    stem: "The weekly committee convenes Thursday at 10 a.m. Your paperwork around it should be to",
    options: [
      "record audio only and archive it without any summary",
      "write the minutes from memory the following week, no review",
      "skip the agenda so the discussion stays wide open",
      "circulate the agenda beforehand, take minutes during, and circulate the finished minutes after",
    ],
    answer: 3,
  },
  {
    skill: "Information gatekeeping: calls & visitors",
    catalogSkill: "Information gatekeeping: calls & visitors",
    stem: "A caller insists on speaking to the director 'right now' about an unverified offer. Your gatekeeping judgment is to",
    options: [
      "patch the call straight through — screening feels rude",
      "screen the request, verify with the relevant staff, then route it or decline politely",
      "hang up for good on any caller you can't verify",
      "read out the director's mobile number to end the pressure",
    ],
    answer: 1,
  },
  {
    skill: "Research & briefing support for executives",
    catalogSkill: "Research & briefing support for executives",
    stem: "Your executive speaks at a partner forum on Friday. The briefing work between now and then is to",
    options: [
      "print the first hundred search results for their conference bag",
      "write a 30-page essay demonstrating your diligence",
      "compile sources and distill the key facts and risks into a brief they can scan",
      "prepare nothing — they already know the topic",
    ],
    answer: 2,
  },
  {
    skill: "Incoming-material triage & distribution",
    catalogSkill: "Incoming-material triage & distribution",
    stem: "The morning's inbox holds a regulatory notice, advertising mail, and a complaint letter. The triage duty is to",
    options: [
      "read each item, judge what matters, and route the significant ones to the right hands",
      "forward everything to everyone, just to be safe",
      "sort strictly alphabetically by the sender's surname",
      "hold all incoming material until a weekly distribution meeting",
    ],
    answer: 0,
  },
  {
    skill: "Office services coordination",
    catalogSkill: "Office services coordination",
    stem: "A records cleanup, next quarter's supply budget, and a broken conference-room door all land this week. The coordination role is to",
    options: [
      "do the door only — budgets are accounting's problem",
      "line up the responsible parties and follow through so all three land",
      "take the easiest item and drop the other two silently",
      "escalate all three to the CEO's calendar",
    ],
    answer: 1,
  },
  {
    skill: "Travel arrangements",
    catalogSkill: "Travel arrangements",
    stem: "Your executive flies out for a two-city client visit next week. Booking the trip end to end means you",
    options: [
      "book the flights only; lodging is the executive's problem",
      "book the cheapest flights regardless of meeting times",
      "send the airline website link and let them book it",
      "arrange flights, hotels, transfers, and an itinerary sheet for every meeting",
    ],
    answer: 3,
  },
  {
    skill: "Records & document filing/retrieval",
    catalogSkill: "Records & document filing/retrieval",
    stem: "Auditors request five named contracts from the past two years. The standard your filing system must meet is:",
    options: [
      "send the auditors the entire archive to search themselves",
      "rebuild the contracts from old emails since the files are a mess",
      "retrieve each named document within minutes using the filing structure",
      "ask the auditors which two of the five they actually need",
    ],
    answer: 2,
  },
  {
    skill: "General office duties & tools",
    catalogSkill: "General office duties & tools",
    stem: "Monday's list: restock supplies, update the staff contact database, and total the petty cash. The day-to-day upkeep response is to",
    options: [
      "restock supplies and skip the numbers as 'accounting work'",
      "work each item — supplies, record updates, petty cash — as your normal rounds",
      "wait for a complaint before opening the contact database",
      "take the day off and leave the list unassigned",
    ],
    answer: 1,
  },
  {
    skill: "Clerical support across departments",
    catalogSkill: "Clerical support across departments",
    stem: "Marketing is short-handed for a two-day data-cleanup push while your desk is quiet. The cross-department move is to",
    options: [
      "refuse — clerks serve their own department only",
      "help marketing all day and quietly abandon your own queue",
      "lend your hours to marketing for the push, with your supervisor's go-ahead",
      "send marketing an intern without telling anyone",
    ],
    answer: 2,
  },
  {
    skill: "Payroll-information processing",
    catalogSkill: "Payroll-information processing",
    stem: "Overtime sheets for the 15th cutoff arrive in batches. The payroll side of your job is to",
    options: [
      "verify the batches and push the attendance and rate data into the pay cycle by cutoff",
      "process them after payday if there happens to be time",
      "enter only the staff you know personally",
      "wait for employees to dispute amounts before checking anything",
    ],
    answer: 0,
  },
  {
    skill: "Administrative policy setup & interpretation",
    catalogSkill: "Administrative policy setup & interpretation",
    stem: "A new staffer asks why travel claims need two signatures — and the second step clearly adds a week. Your role with office rules is to",
    options: [
      "say 'that's just how it is here' and move along",
      "tell them to skip the second signature quietly this once",
      "insist no rule exists since you don't recall one",
      "explain the rule and its purpose — and flag the gap when it clearly stops working",
    ],
    answer: 3,
  },
  {
    skill: "Representing executives / meeting on their behalf",
    catalogSkill: "Representing executives / meeting on their behalf",
    stem: "Your executive can't attend a partner sync and sends you instead. Standing in for them means you",
    options: [
      "attend, agree to nothing, and note you were merely observing",
      "attend, represent their position in the discussion, and report outcomes back",
      "decline the meeting since you're not the executive",
      "say yes to every request so the partners feel heard",
    ],
    answer: 1,
  },
  {
    skill: "Supervision & training of clerical staff",
    catalogSkill: "Supervision & training of clerical staff",
    stem: "A new clerk misfiles several records in their first week. Your role as the senior clerk is to",
    options: [
      "do the filing yourself from now on to avoid more errors",
      "report every mistake to the manager weekly without coaching",
      "onboard them on the procedures, walk through corrections, and check their work until steady",
      "let the errors pile up — experience is the only real teacher",
    ],
    answer: 2,
  },
  {
    skill: "Operating-practice review",
    catalogSkill: "Operating-practice review",
    stem: "Reimbursements take 12 days and staff grumble about it monthly. The review-and-improve response is to",
    options: [
      "trace the workflow, find the slow steps, and propose a concrete fix to the supervisor",
      "circulate a survey and file the results without acting",
      "tell staff the delay builds character",
      "order faster approvals without finding out why it's slow",
    ],
    answer: 0,
  },
  {
    skill: "Employee time-tracking",
    catalogSkill: "Employee time-tracking",
    stem: "A staffer swears they clocked in Tuesday, but the record shows no entry. Your timekeeping duty is to",
    options: [
      "reset the whole week's records to keep the peace",
      "check the source logs and your procedure for disputed entries before adjusting anything",
      "mark every disputed day present as a courtesy",
      "dock the day's pay without examining the record",
    ],
    answer: 1,
  },
  {
    skill: "Sort & classify materials to filing rules",
    catalogSkill: "Sort & classify materials to filing rules",
    stem: "Forty documents of different types arrive daily for the records room. The sorting task is to",
    options: [
      "stack them by arrival time and file whatever fits that day",
      "sort the easy ones and bung the rest into storage loose",
      "sort and classify each against the filing rules so every document rests where the system says",
      "classify by paper color for faster visual searching",
    ],
    answer: 2,
  },
  {
    skill: "Filing into storage (drawers/cabinets/boxes)",
    catalogSkill: "Filing into storage (drawers/cabinets/boxes)",
    stem: "A folder is ready to go into the records. The filing act itself is to",
    options: [
      "place it in its correct drawer location immediately, per the filing system",
      "hold it until the current drawer fills up",
      "drop it into whichever drawer is nearest at the moment",
      "box it and label the box 'miscellaneous'",
    ],
    answer: 0,
  },
  {
    skill: "File retrieval on request",
    catalogSkill: "File retrieval on request",
    stem: "Someone at the window needs the 2023 lease file now. The retrieval standard is to",
    options: [
      "hand them the drawer key to search personally",
      "estimate which shelf it might be on and apologize",
      "refile the neighboring mess first, since the shelf is chaotic",
      "use the index to hand over the exact item within moments",
    ],
    answer: 3,
  },
  {
    skill: "Filing log / records of materials filed & removed",
    catalogSkill: "Filing log / records of materials filed & removed",
    stem: "A director walks off with a personnel folder for a hearing. The log discipline that prevents work being lost in filing is to",
    options: [
      "trust that directors return whatever they borrow",
      "swap in a look-alike folder so the shelf stays balanced",
      "record the removal — what, who, when — and log its return on refile",
      "strike the folder's index entry out permanently",
    ],
    answer: 2,
  },
  {
    skill: "Reprographics: photocopy, scan, fax",
    catalogSkill: "Reprographics: photocopy, scan, fax",
    stem: "A partner needs a scanned and emailed copy of a signed agreement, plus two paper copies. The reprographics flow is to",
    options: [
      "photocopy fifty spares, just in case",
      "scan and email the digital copy, then run the two paper copies off the same master",
      "photograph the signature page with your phone at an angle",
      "fax the document since scanning feels too modern for signatures",
    ],
    answer: 1,
  },
  {
    skill: "Telephone, switchboard & front-desk duties",
    catalogSkill: "Telephone, switchboard & front-desk duties",
    stem: "Three lines flash at the switchboard during the morning rush. The office's first voice does this:",
    options: [
      "answer each in turn, screen briefly, and take or relay the messages accurately",
      "let them ring out so callers must phone back later",
      "answer one, park the rest on hold indefinitely, and resume your own call",
      "bounce every caller to whichever line is quietest",
    ],
    answer: 0,
  },
  {
    skill: "Visitor greeting & routing",
    catalogSkill: "Visitor greeting & routing",
    stem: "A supplier representative arrives asking for procurement; a job applicant arrives for HR. Your reception move is to",
    options: [
      "seat both together and let them work out who goes where",
      "greet each, confirm who they've come to see, and point them to the right office",
      "greet only the supplier and leave the applicant unacknowledged",
      "send both across to the security desk for processing",
    ],
    answer: 1,
  },
  {
    skill: "Appointment & calendar scheduling",
    catalogSkill: "Appointment & calendar scheduling",
    stem: "A client requests a demo this week and two slots are open. Keeping the office calendar alive and accurate means you",
    options: [
      "describe both slots aloud and book neither until later",
      "double-book the two slots so someone inevitably declines",
      "confirm one slot, book it in the shared calendar, and keep it updated if plans shift",
      "note the meeting in your personal notebook only",
    ],
    answer: 2,
  },
  {
    skill: "Mail & document handling",
    catalogSkill: "Mail & document handling",
    stem: "Packages, letters, and internal memos arrive through the day, and outgoing envelopes await pickup. The mail-and-document job is to",
    options: [
      "dump every inbound item into one bin for a single trip later",
      "sort, route, and dispatch ingoing and outgoing items on their schedule",
      "read every incoming letter in full before it reaches anyone",
      "leave outgoing envelopes for somebody else to hunt down",
    ],
    answer: 1,
  },
  {
    skill: "Front-office record & database upkeep",
    catalogSkill: "Front-office record & database upkeep",
    stem: "A client calls and the on-screen record shows a disconnected number from last year. The upkeep duty is to",
    options: [
      "update the record with the new number as calls surface changes",
      "write corrections on a sticky note by your monitor",
      "skip updates — records are meant to be historical",
      "delete the stale client record to keep the database tidy",
    ],
    answer: 0,
  },
  {
    skill: "Info & customer-service communication",
    catalogSkill: "Info & customer-service communication",
    stem: "A walk-in asks where to park, which office handles permits, and today's closing time. The service you owe them is to",
    options: [
      "hand over a brochure and step slowly backwards",
      "answer only the question printed on the wall poster",
      "close the window for lunch first, then respond",
      "answer all three clearly and courteously on the spot",
    ],
    answer: 3,
  },
];

/* ───────────────────────────────────────────────────────────────────────────
 * OFFICE_LADDERS — the office track's 3-item skill-verification ladders
 * (wave 5, final authoring wave, 2026-11-05). One ladder per office-track
 * catalog row (lib/fixtures/catalog.ts, roles adminassoc · clerk · encode ·
 * desk · execsec · records — 57 skills, byte-match held against catalog
 * lines 930–1075). Authored per docs/assessment-blueprint-swd.md: tier
 * order Q1 recognition → Q2 application → Q3 judgment; every item carries
 * a `ref` to on-disk official text — O*NET 43-6014.00 / 43-6011.00 /
 * 43-4171.00 / 43-9021.00 / 43-9061.00 tasks and PSOC 2012 lettered lines
 * (3343 · 4110 · 4132 · 4225 · 4415) — quoted verbatim in
 * lib/fixtures/rowspec/office.ts (cited below by file:line); per-wrong-
 * option `distractorNotes` carry the why-wrong lines, source quotes ride
 * the notes, never the key. NACE-tagged enabling rows are thin (no
 * verbatim NACE text on disk) — authored on behavior language, flagged as
 * PSF-only per user Option A 2026-11-05. Stem discipline per the
 * blueprint's fixed norm: keys sit inside the similar-length band,
 * positions vary, no evaluative cues.
 * Legacy `OFFICE_BANK` above is untouched — the ladders join alongside.
 * ─────────────────────────────────────────────────────────────────────────── */
export const OFFICE_LADDERS: SkillLadder[] = [
  // ═══ 5.1 · Administrative Associate (adminassoc) — 6 rows ════════════════
  {
    skill: "Filing systems (paper/electronic) operation",
    catalogSkill: "Filing systems (paper/electronic) operation",
    items: [
      // Q1 recognition
      {
        skill: "Filing systems (paper/electronic) operation",
        catalogSkill: "Filing systems (paper/electronic) operation",
        stem:
          "The support role lists “set up and manage paper or electronic filing systems, recording information, updating paperwork, or maintaining documents.” What does holding that role mean day to day?",
        options: [
          "reshelve returned papers wherever the cart's top slot puts them",
          "run one shared scheme across paper and drive so records stay findable and current",
          "keep a private drawer per clerk so each clerk alone can reach their history",
          "shred last year's paperwork once the calendar year flips",
        ],
        answer: 1,
        ref: "O*NET 43-6014.00 · filing-systems task (lib/fixtures/rowspec/office.ts:27)",
        distractorNotes: [
          "Shelving by convenience abandons the scheme the task names — “manage… systems” means one ordering, not desk roulette.",
          "Write-up leg: the KEY matches the anchor “Set up and manage paper or electronic filing systems…” in both media.",
          "Filing systems exist for the office's retrieval, not one clerk's reach; private drawers break anyone else's lookup.",
          "Destruction is not upkeep — the anchor prints “maintaining documents, such as attendance records, correspondence.”",
        ],
      },
      // Q2 application
      {
        skill: "Filing systems (paper/electronic) operation",
        catalogSkill: "Filing systems (paper/electronic) operation",
        stem:
          "Quarter-end: purchase records sit half in paper binders, half in the shared drive, and a manager needs them for tomorrow's review.",
        options: [
          "print whatever the drive happens to show and call the binders out of scope",
          "hand the reviewer your personal notes summarizing the quarter instead",
          "suggest the review be moved until the two halves reunite on their own",
          "pull both halves together under the filing scheme into one complete set",
        ],
        answer: 3,
        ref: "O*NET 43-6014.00 · filing-systems task (lib/fixtures/rowspec/office.ts:27)",
        distractorNotes: [
          "The system the anchor names covers both media; declaring the binders out of scope leaves records unmaintained.",
          "Summaries are not records — the anchor's duty is the documents themselves (“updating paperwork”).",
          "The anchor's “manage” is the associate's own act; waiting defers a live duty to no one.",
          "Write-up leg: the KEY executes the anchor's “set up and manage… recording information, updating paperwork” across both storage forms.",
        ],
      },
      // Q3 judgment
      {
        skill: "Filing systems (paper/electronic) operation",
        catalogSkill: "Filing systems (paper/electronic) operation",
        stem:
          "Auditors name a two-year-old voucher, and nobody in the room remembers where it lives. As the department's records backstop, your call:",
        options: [
          "walk the filing scheme's index first, then the drive's same-field search as backup",
          "tell the auditors the voucher aged out and the office keeps nothing that old",
          "hand over the whole cabinet so their team can dig through it unsupervised",
          "have each clerk spend the afternoon opening random drawers on instinct",
        ],
        answer: 0,
        ref: "O*NET 43-6014.00 · filing-systems task (lib/fixtures/rowspec/office.ts:27)",
        distractorNotes: [
          "Write-up leg: the KEY is the managed system doing its job — “manage paper or electronic filing systems” exists precisely for named retrieval.",
          "Retention is not yours to unilaterally declare; the anchor guarantees the system holds and re-finds its records.",
          "Opening the archive to auditors unsupervised bypasses ownership and custody of the records you maintain.",
          "Random searching is the absence of the scheme the anchor tasks you with managing.",
        ],
      },
    ],
  },

  {
    skill: "Database entry & maintenance",
    catalogSkill: "Database entry & maintenance",
    items: [
      // Q1 recognition
      {
        skill: "Database entry & maintenance",
        catalogSkill: "Database entry & maintenance",
        stem:
          "Your role carries O*NET's “Create, maintain, and enter information into databases.” Which weekly rhythm answers for that role?",
        options: [
          "back up the machine's hard drive to a USB stick every Friday",
          "enter new or changed details promptly, in the fields the record layout names",
          "forward the raw spreadsheets to IT whenever anyone asks for data",
          "retype the database from scratch whenever a supervisor raises a query",
        ],
        answer: 1,
        ref: "O*NET 43-6014.00 · database tasks (lib/fixtures/rowspec/office.ts:34)",
        distractorNotes: [
          "Backing up is a good habit elsewhere, but the anchor's text is about the information itself, not device copies.",
          "Write-up leg: the KEY matches “create, maintain, and enter information into databases” — the entry-and-upkeep loop.",
          "Escalating raw files dodges the row; the anchor puts the entering and maintaining on this desk.",
          "Rebuilding is not maintaining — the anchor's verb set is create/enter/maintain, not destroy-and-redo.",
        ],
      },
      // Q2 application
      {
        skill: "Database entry & maintenance",
        catalogSkill: "Database entry & maintenance",
        stem:
          "A supplier changes its bank account and address this week; two open purchase orders already quote the old account on paper.",
        options: [
          "fix it on printouts with a pen and tape the printouts over the old binder page",
          "wait for the supplier's next invoice after the pending orders close",
          "find an old supplier, keep his numbers alive, and let the supplier's invoice say the truth for itself",
          "update the supplier's database record now and route the open orders' reprints through your supervisor",
        ],
        answer: 3,
        ref: "O*NET 43-6014.00 · database tasks (lib/fixtures/rowspec/office.ts:34)",
        distractorNotes: [
          "Annotated paper leaves the database itself unmaintained — the anchor's record is the database entry, not the binder.",
          "Delaying until year-adjacent invoices contradict the live change, not the anchor's “maintain… information.”",
          "Keeping a stale or fictional record second-place to documents is data the anchor never authorizes entering.",
          "Write-up leg: the KEY runs “create, maintain, and enter information into databases” plus the remembered change routed to affected orders.",
        ],
      },
      // Q3 judgment
      {
        skill: "Database entry & maintenance",
        catalogSkill: "Database entry & maintenance",
        stem:
          "Two teammates have been entering addresses in different formats for a month, and a mailing job misfired because of it. What does the role ask of you?",
        options: [
          "start one agreed format for your own entries and surface the drift to the team",
          "report the teammates to HR since formatting disputes belong with sanctions",
          "keep your personal formatting untouched so your exports always parse at the mail vendor",
          "redo every address yourself from memory during your own lunch hours, quietly",
        ],
        answer: 0,
        ref: "O*NET 43-6014.00 · database tasks (lib/fixtures/rowspec/office.ts:34)",
        distractorNotes: [
          "Write-up leg: the KEY serves both the anchor's “maintain” (a coherent record set) and the row holding peers honest.",
          "Sanctions are management's call; the row's discipline is the record's coherence, not a discipline case.",
          "You correctly spotted the drift earlier, but the anchor's maintainability is the whole database, not your private lane.",
          "Quiet solo repair hides the process failure and cannot sustain beyond one person — “maintain” is a desk-level habit.",
        ],
      },
    ],
  },

  {
    skill: "Multi-channel reception & call routing",
    catalogSkill: "Multi-channel reception & call routing",
    items: [
      // Q1 recognition
      {
        skill: "Multi-channel reception & call routing",
        catalogSkill: "Multi-channel reception & call routing",
        stem:
          "Your role lists “Answer telephones and give information to callers, take messages, or transfer calls to appropriate individuals” — and “Greet visitors or callers and handle their inquiries or direct them.” What fills the desk?",
        options: [
          "guard the entrance with a logbook signature per person and let the calls ring out",
          "let every channel queue until whoever owns the matter returns to the office",
          "be the front line across phone, message, and walk-in, moving each contact to its right owner",
          "answer one channel only, whichever the department's newest headcount favors",
        ],
        answer: 2,
        ref: "O*NET 43-6014.00 · reception tasks (lib/fixtures/rowspec/office.ts:41)",
        distractorNotes: [
          "A signature log is a register's job; the anchor's verbs (answer, take, transfer, greet, direct) are live contact work.",
          "Queueing defies both quoted tasks — answering and greeting are the anchor's opening verbs, not the queue's.",
          "Write-up leg: the KEY is the anchor's own double scope — calls taken/routed and visitors received/directed.",
          "Single-channel service contradicts the row's spread across telephones, messages, and visitors.",
        ],
      },
      // Q2 application
      {
        skill: "Multi-channel reception & call routing",
        catalogSkill: "Multi-channel reception & call routing",
        stem:
          "Ten a.m.: a caller needs procurement's timeline, an old friend of the department walks in, and a courier is waiting for a signature.",
        options: [
          "sign for the courier, route procurement the caller's message with their number, seat the visitor, and give the office's standard answers",
          "take the courier's document, set all calls aside until the afternoon, then deal with the waiting visitor by appointment only",
          "small-talk the visitor while pretending each phone stays silent and letting the courier's note wait in the corridor",
          "screenshot your call log to procurement and hit send, and ask both the visitor and courier to come back tomorrow",
        ],
        answer: 0,
        ref: "O*NET 43-6014.00 · reception tasks (lib/fixtures/rowspec/office.ts:41)",
        distractorNotes: [
          "Write-up leg: the KEY performs the anchor's trio — take messages/direct calls, greet visitors, give information to callers.",
          "Closing channels until afternoon abandons the anchor's immediate answer, take, and transfer verbs.",
          "Ignoring live channels while chatting defeats “answer telephones… take messages or transfer calls.”",
          "Screenshots do not take nor route the anchor's responsibility to callers.",
        ],
      },
      // Q3 judgment
      {
        skill: "Multi-channel reception & call routing",
        catalogSkill: "Multi-channel reception & call routing",
        stem:
          "A caller you don't recognize demands a director's home address and his wife's whereabouts. The role's verbs give you what line to hold?",
        options: [
          "recite the home address, since the caller already claims the director owes him paperwork",
          "hang up without a word, since calls you dislike deserve the silence treatment after all this time",
          "route the call instead through the department's front-desk channel and let the desk decide the access question",
          "give the number to the relevant contact person inside the office, not out to a caller — and refer the rest onward",
        ],
        answer: 3,
        ref: "O*NET 43-6014.00 · reception tasks (lib/fixtures/rowspec/office.ts:41)",
        distractorNotes: [
          "The anchor's “give information to callers” is information the office lets out — home addresses of staff are not part of that service.",
          "Silence is not a transfer, message, or information act the anchor names; even refusals route through a record.",
          "Write-up leg: the KEY keeps the routing line — “transfer to appropriate individuals” — while refusing personal details to the caller.",
          "Half-referral inside the office still exposes numbers; the referral goes to the office's own contact trail, not to anyone's private line.",
        ],
      },
    ],
  },

  {
    skill: "Office equipment operation & basic troubleshooting",
    catalogSkill: "Office equipment operation & basic troubleshooting",
    items: [
      // Q1 recognition
      {
        skill: "Office equipment operation & basic troubleshooting",
        catalogSkill: "Office equipment operation & basic troubleshooting",
        stem:
          "The anchor's line: “Operate office equipment, such as fax machines, copiers, or phone systems and arrange for repairs when equipment malfunctions.” What does the role hold?",
        options: [
          "running the machines by the manual's steps and arranging repair when they fail",
          "purchasing replacement machines every time a paper tray sticks once",
          "wiring new office sockets yourself as a facilities electrician might",
          "writing off broken machines as an entire department's shared loss",
        ],
        answer: 0,
        ref: "O*NET 43-6014.00 · equipment task (lib/fixtures/rowspec/office.ts:48)",
        distractorNotes: [
          "Write-up leg: the KEY is the anchor's own verb pair — operate the equipment, arrange for repairs.",
          "A sticky tray is not a failure requiring replacement; the anchor separates operation from repair arrangements.",
          "Socket wiring is neither of the anchor's two verbs and sits outside the row entirely.",
          "Shared write-off decisions belong above the desk; the anchor's row is equipment handling, not capital decisions.",
        ],
      },
      // Q2 application
      {
        skill: "Office equipment operation & basic troubleshooting",
        catalogSkill: "Office equipment operation & basic troubleshooting",
        stem:
          "The copier's display says “T/Add Exch Stuck” twenty minutes before a listed survey needs fifty copies.",
        options: [
          "clear the jam following the machine's own steps, test-run, then produce the survey copies",
          "prop the drawer shut with your knee and force the copier through the whole run regardless",
          "post an “out of order” sign, unseat the paper tray, and abandon the machine to its choices",
          "skip the survey, call in sick, and let the next shift inherit the attempt entirely",
        ],
        answer: 0,
        ref: "O*NET 43-6014.00 · equipment task (lib/fixtures/rowspec/office.ts:48)",
        distractorNotes: [
          "Write-up leg: the KEY matches “operate office equipment… and arrange for repairs when equipment malfunctions” — basic handling first.",
          "Forcing a jammed mechanism is neither operating per the manual nor arranging a repair — it risks the machine itself.",
          "The anchor expects operation restored or repair arranged — an abandoned sign is neither.",
          "Surrendering the desk hands every malfunction to someone else for the rest of your tenure.",
        ],
      },
      // Q3 judgment
      {
        skill: "Office equipment operation & basic troubleshooting",
        catalogSkill: "Office equipment operation & basic troubleshooting",
        stem:
          "After your third fix this week, the same machine stalls again mid-batch. The vendor's service slot opens Thursday. What does the role ask of you now?",
        options: [
          "arrange the booked Thursday repair, flag the run's schedule to users, and treat hand-feeding today as a stopgap",
          "recommend retiring the machine entirely since a fourth failure is all the proof any office needs",
          "schedule nothing — self-inflicted fixes have already cost the office enough this week",
          "switch the run to someone else's machine without telling either machine's owner",
        ],
        answer: 0,
        ref: "O*NET 43-6014.00 · equipment task (lib/fixtures/rowspec/office.ts:48)",
        distractorNotes: [
          "Write-up leg: the KEY reads the anchor exactly: arrange for repairs (Thursday), and operate-means-stopgap in the meantime.",
          "Retiring fleet belongs to whoever owns capital decisions — the row's verb is arranging repair, not scrapping.",
          "Canceling slots leaves the malfunction unattended — “arrange for repairs when equipment malfunctions” stays in force.",
          "Borrowing another office's machine without telling anyone is not an operation or repair act — it's rerouted failure.",
        ],
      },
    ],
  },

  {
    skill: "Meeting/coordination documentation",
    catalogSkill: "Meeting/coordination documentation",
    items: [
      // Q1 recognition
      {
        skill: "Meeting/coordination documentation",
        catalogSkill: "Meeting/coordination documentation",
        stem:
          "The role's anchors list “compose, type, and distribute meeting notes, routine correspondence, or reports… maintain scheduling and event calendars… schedule and confirm appointments.” What is on your desk after a planning session closes?",
        options: [
          "meeting notes composed and circulated, with the calendar's next dates set and confirmations sent",
          "a spreadsheet of everyone who spoke, sorted by voice level, filed and labeled",
          "a salary-adjustment memo recomputing each caller's overtime against the meeting's minutes",
          "verbal recaps delivered to whichever attendees happened to return from lunch earliest",
        ],
        answer: 0,
        ref: "O*NET 43-6014.00 · meeting/correspondence/calendar tasks (lib/fixtures/rowspec/office.ts:55)",
        distractorNotes: [
          "Write-up leg: the KEY rides the anchor's three verbs — compose/type/distribute, maintain calendars, schedule and confirm.",
          "A voice-level census is documentation of nothing the anchor's row asks for.",
          "Overtime re-computation belongs to the payroll row; the anchor's row covers notes, correspondence, and reporting.",
          "Verbal-only recaps skip the “compose, type, and distribute” leg — documentation exists on paper in this row.",
        ],
      },
      // Q2 application
      {
        skill: "Meeting/coordination documentation",
        catalogSkill: "Meeting/coordination documentation",
        stem:
          "A Wednesday planning session runs long: three decisions, two owners, an April deadline — one attendee out sick missed it.",
        options: [
          "circulate minutes naming decisions, owners, and the deadline, then confirm the absentee's follow-up appointment on the calendar",
          "audio-record every meeting you attend from now on and only ever distribute the raw recordings",
          "summarize the meeting in a portrait-length email only to the supervisor who spoke the final word",
          "trust that the absentees' calendars will somehow post themselves before the deadline arrives",
        ],
        answer: 0,
        ref: "O*NET 43-6014.00 · meeting/correspondence/calendar tasks (lib/fixtures/rowspec/office.ts:55)",
        distractorNotes: [
          "Write-up leg: the KEY works the anchor's “compose, type, and distribute meeting notes” plus “schedule and confirm appointments.”",
          "Full recordings are raw intake, not the distributed notes and confirmations the anchor tasks.",
          "Single-recipient summaries starve the row's own duty — “distribute” reaches the members, not one judge.",
          "Calendars don't self-maintain — “maintain scheduling and event calendars” is the row's verb on this desk.",
        ],
      },
      // Q3 judgment
      {
        skill: "Meeting/coordination documentation",
        catalogSkill: "Meeting/coordination documentation",
        stem:
          "An attendee protests that the minutes quote her case “out of context,” and the circulated version heads to the register in an hour.",
        options: [
          "hold the distribution, check the recording and the speaker's own note, and settle the correction before it circulates",
          "ship the minutes on schedule and attach a formal apology to whoever next complains louder",
          "relist the disputed passage as “under objection” while still sending it to the full register today",
          "have the objector sign a withdrawal letter against any future claim of mis-quotation before anything ships",
        ],
        answer: 0,
        ref: "O*NET 43-6014.00 · meeting/correspondence/calendar tasks (lib/fixtures/rowspec/office.ts:55)",
        distractorNotes: [
          "Write-up leg: the KEY is the row's own standard — the minutes you compose and distribute stand true before standing somewhere at all.",
          "Distributing while the source record is still open misleads the register; distribution waits on the content being settled.",
          "Labeling a wrong quote with a stamp does not fix it — “compose… meeting notes” implies settling the content itself.",
          "Withdrawal letters impose procedure on the objector instead of doing the composing duty the row names.",
        ],
      },
    ],
  },

  {
    skill: "Communication · Professionalism · Critical Thinking (Enabling)",
    catalogSkill: "Communication · Professionalism · Critical Thinking (Enabling)",
    items: [
      // Q1 recognition — thin: PSF-only per user Option A 2026-11-05
      {
        skill: "Communication · Professionalism · Critical Thinking (Enabling)",
        catalogSkill: "Communication · Professionalism · Critical Thinking (Enabling)",
        stem:
          "This role is the enabling layer — communication, professionalism, critical thinking — with no task list of its own. What is the layer's work about?",
        options: [
          "the office-citizenship habits that make the technical rows land with people, records, and machines",
          "the legal authority given to associates to sign binding contracts on the department's name",
          "a private study hour budgeted into the day for a personal degree's remaining requirements",
          "the ceremonial decoration of the annual report's front cover with new typography",
        ],
        answer: 0,
        ref: "NACE enabling row — flagged paraphrase layer (lib/fixtures/rowspec/office.ts:62)",
        distractorNotes: [
          "Write-up leg: the KEY is the enabling idea itself — the row backs every core row's delivery rather than adding its own task list.",
          "Contract-signing authority is a governance question no enabling row confers.",
          "Study budgets sit outside work behavior — the layer is about how you carry the day's rows.",
          "Cover typography is design styling, not the everyday conduct this row shapes.",
        ],
      },
      // Q2 application — thin: PSF-only per user Option A 2026-11-05
      {
        skill: "Communication · Professionalism · Critical Thinking (Enabling)",
        catalogSkill: "Communication · Professionalism · Critical Thinking (Enabling)",
        stem:
          "A colleague's reply to a client tempers-off — then your supervisor forwards you the draft as “final version” for sending.",
        options: [
          "read it once, spot the needless heat, rewrite the reply professionally, and show the supervisor your revision",
          "send it attached as “final” while noting the tone in a detail line to whoever opens it",
          "tell the client privately that this message is the supervisor's writing and not the office's standard",
          "delete the draft, avoid the sending task, and hope the deadline passes because of the honest mistake",
        ],
        answer: 0,
        ref: "NACE enabling row — flagged paraphrase layer (lib/fixtures/rowspec/office.ts:62)",
        distractorNotes: [
          "Write-up leg: the KEY is the layer's craft — communication quality, professionalism, and the judgment to say so directly to your supervisor.",
          "Sending “final” that itself needs revision is a professional slip dressed up with a caveat.",
          "Publicly blaming the supervisor aloud undercuts the office before the client — professionalism includes internal honesty first.",
          "Avoidance is the opposite of the layer's voice — the reply gets one professional handling, not a vanishing act.",
        ],
      },
      // Q3 judgment — thin: PSF-only per user Option A 2026-11-05
      {
        skill: "Communication · Professionalism · Critical Thinking (Enabling)",
        catalogSkill: "Communication · Professionalism · Critical Thinking (Enabling)",
        stem:
          "A loyal client asks a favor the policy files have no template for — a two-line note that would bend one audit letter. Where does this layer land you?",
        options: [
          "think it through as a records-and-consequences question and aim your reply at “how the office handles such requests” with a route",
          "sign the two-line note yourself — favors earn favors, and faithful clients deserve this one",
          "escalate to the whole office's chat thread the full client message so colleagues can then decide instead",
          "promise the client yes for now; the two lines can always be withdrawn before anyone formally reads them",
        ],
        answer: 0,
        ref: "NACE enabling row — flagged paraphrase layer (lib/fixtures/rowspec/office.ts:62)",
        distractorNotes: [
          "Write-up leg: the KEY is the layer's trio — communication face, professionalism of procedure, critical thinking in what a two-line note implies.",
          "Personal favors never become office currency; unclear authority is not a license the layer grants.",
          "Broadcasting a client letter into an office chat overshoots the request; critical thinking asks first, not last, who handles it.",
          "A promise the office cannot stand is the failure both professionalism and the reasoning layer flag.",
        ],
      },
    ],
  },

  // ═══ 5.2 · Office Clerk (clerk) — 9 rows ═════════════════════════════════
  {
    skill: "Recording, preparing, sorting, classifying and filing information",
    catalogSkill: "Recording, preparing, sorting, classifying and filing information",
    items: [
      // Q1 recognition
      {
        skill: "Recording, preparing, sorting, classifying and filing information",
        catalogSkill: "Recording, preparing, sorting, classifying and filing information",
        stem:
          "PSOC 4110 letter a) lists “recording, preparing, sorting, classifying and filing information.” What does the letter name?",
        options: [
          "one whole loop from intake of documents to their classified place in the file",
          "the typing of meeting speeches for the office's leader to sign off on",
          "the clip of the office's petty-cash receipts into a single monthly binder",
          "the safekeeping of archive boxes under lock until destruction decade arrives",
        ],
        answer: 0,
        ref: "PSOC 4110 · a] verbatim (lib/fixtures/rowspec/office.ts:72)",
        distractorNotes: [
          "Write-up leg: the KEY is the letter's own five-verb loop — record, prepare, sort, classify, file.",
          "Typing speeches belongs to the correspondence row (letter d), not letter a's document intake.",
          "Petty-cash binding is an accounting desk's work, not the clerk's full letter-a loop.",
          "Box archives are the records-clerk's row family; letter a runs the live loop on the desks.",
        ],
      },
      // Q2 application
      {
        skill: "Recording, preparing, sorting, classifying and filing information",
        catalogSkill: "Recording, preparing, sorting, classifying and filing information",
        stem:
          "Tuesday morning: a 40-document intake can't wait — permits, business cards, two letters, and one invoice with a missing page.",
        options: [
          "key each document's heading, arrange by the scheme's content cue, and place each in its slot — flagging the incomplete invoice for its missing page",
          "key everything into one standing drawer so no idea where it came from fades before the day's end",
          "return the lesser documents to senders, file only the letters, and mark the rest as 'processed pending'",
          "shred the business cards, snap the invoice with your phone, and leave the permits wherever the assistant forgets them",
        ],
        answer: 0,
        ref: "PSOC 4110 · a] + O*NET 43-9061.00 (lib/fixtures/rowspec/office.ts:72-73)",
        distractorNotes: [
          "Write-up leg: the KEY runs the letter's loop — recording, preparing, sorting, classifying, filing — with the invoice upheld.",
          "One standing drawer erases classification; the letter's terminal verb is filing into its proper place.",
          "The letter runs the full loop on the intake — no subset of “the rest” may hang unfiled as pending forever.",
          "Destruction and photo shortcuts skip the recording and classification legs the letter prints.",
        ],
      },
      // Q3 judgment
      {
        skill: "Recording, preparing, sorting, classifying and filing information",
        catalogSkill: "Recording, preparing, sorting, classifying and filing information",
        stem:
          "Two documents in an afternoon's stack carry identical names but opposite owners — a supply form for Buying and one for Personnel.",
        options: [
          "classify by the document's content cues and owner field, then file each under its own unit's slot",
          "merge them into one alphabetical slot named “supply form (two owners)” and cross out each handwritten note",
          "hold both forms aside until a new filing scheme arrives from headquarters someday",
          "return both documents to their senders unprocessed, citing the ambiguity as a filing-blocked case",
        ],
        answer: 0,
        ref: "O*NET 43-9061.00 · “compile, copy, sort, and file records…” (lib/fixtures/rowspec/office.ts:73)",
        distractorNotes: [
          "Write-up leg: the KEY matches the anchor's “sort, and file records… according to the scheme's cues” — classification resolves owners.",
          "Merging dissimilar owners breaks the same scheme the anchor keeps intact — similar names, different slots.",
          "Waiting for a scheme that isn't coming defeats the tasks on the current one already in force.",
          "Returning unprocessed paperwork sends both owners' business nowhere — the anchor's loop resolves instead.",
        ],
      },
    ],
  },

  {
    skill: "Sorting, opening and sending mail",
    catalogSkill: "Sorting, opening and sending mail",
    items: [
      // Q1 recognition
      {
        skill: "Sorting, opening and sending mail",
        catalogSkill: "Sorting, opening and sending mail",
        stem:
          "Letter b) of the clerk unit lists “sorting, opening and sending mail,” with O*NET's “Open, sort, and route incoming mail… prepare outgoing mail” beside it. What fills the mail desk?",
        options: [
          "deciding which mail to open is the addressee's privilege; the clerk's part is transport only",
          "collect mail, sort each item, open those authorized to you, and move incoming to the right hands and outgoing on time",
          "give every piece of mail one standard letter opener regardless of sender or recipient",
          "store inbound mail in a locked drawer until each recipient signs a personal visit slip",
        ],
        answer: 1,
        ref: "PSOC 4110 · b] + O*NET 43-9061.00 (lib/fixtures/rowspec/office.ts:80-81)",
        distractorNotes: [
          "Routing is not transport only — the O*NET line's verbs extend to opening and answering the flow.",
          "Write-up leg: the KEY works both quotes — “open, sort, and route incoming… prepare outgoing mail.”",
          "One opener for every letter overrides the authorization line the unit's letter b implies.",
          "A visit-slip drawer delays the flow — the mail desk's verb is routing, not gated reception.",
        ],
      },
      // Q2 application
      {
        skill: "Sorting, opening and sending mail",
        catalogSkill: "Sorting, opening and sending mail",
        stem:
          "The 9 a.m. batch: two personal-looking envelopes to the director, six department letters for your desk, one courier slip needing today's pickup.",
        options: [
          "hand the courtesy desk all eleven items and a note that the batch is someone else's problem",
          "sort and deliver the batch by the office's own routing — director's items one tray, department items opened if authorized, courier flagged at once",
          "tear the courier slip into the outgoing bin, take the director's mail for a private reading at your desk, and type the rest tomorrow",
          "delay everything until Friday since Thursday is a full day and Friday lightens the sort",
        ],
        answer: 1,
        ref: "O*NET 43-9061.00 · mail task (lib/fixtures/rowspec/office.ts:81)",
        distractorNotes: [
          "Tossing the batch onto another desk leaves the flow unmaintained — the desk's verbs are yours.",
          "Write-up leg: the KEY is the O*NET line's own run — sort, route, open-if-authorized, prepare the outgoing.",
          "Reading someone else's private mail is the misuse the authorization line exists to stop.",
          "Deferring the batch starves every addressee — the mail desk runs on the day's schedule.",
        ],
      },
      // Q3 judgment
      {
        skill: "Sorting, opening and sending mail",
        catalogSkill: "Sorting, opening and sending mail",
        stem:
          "A letter addressed to your department carries a second magnet — a stamped, unsealed envelope addressed to someone outside the office.",
        options: [
          "open and read the letter fully, since if it fails authorization the outside envelope stands in as your reference",
          "route the stamped, unsealed outside envelope to the mail room unopened, and treat the letter per the office's own authorization",
          "send the whole bundle back unopened and mark your department's inbound as 'discontinued service'",
          "keep the sealed letter and type its outside envelope's return address into the six-item log before dinner",
        ],
        answer: 1,
        ref: "PSOC 4110 · b] + O*NET 43-9061.00 (lib/fixtures/rowspec/office.ts:80-81)",
        distractorNotes: [
          "Reading beyond authorized scope is the line letter b's unit guards — outside envelopes don't license over-opening.",
          "Write-up leg: the KEY holds the authorization discipline and keeps the flow — outside items move, office items run their routine.",
          "Unopened-and-refused is not mail service; the desk's verbs remain open (authorized), sort, send.",
          "Logging a stub before handling its items does nothing the flow needs — the routing is the work.",
        ],
      },
    ],
  },

  {
    skill: "Photocopying and sending documents",
    catalogSkill: "Photocopying and sending documents",
    items: [
      // Q1 recognition
      {
        skill: "Photocopying and sending documents",
        catalogSkill: "Photocopying and sending documents",
        stem:
          "Letter c) reads “photocopying and sending documents,” backed by O*NET's “operate office machines, such as photocopiers and scanners.” What does the role hold?",
        options: [
          "reproducing office documents on the machines and dispatching them to where the request points",
          "sorting the copy room's stack by brand of toner so future requests pick the freshest",
          "backing up sensitive client files to a personal cloud folder on your own time",
          "training the whole repair schedule into a chart hung inside the copy room's door",
        ],
        answer: 0,
        ref: "PSOC 4110 · c] + O*NET 43-9061.00 (lib/fixtures/rowspec/office.ts:88-89)",
        distractorNotes: [
          "Write-up leg: the KEY is the letter's two verbs — photocopy and send — with the O*NET machine line beside it.",
          "Toner sorting is housekeeping of no row in this unit.",
          "Personal cloud copies are outside the row and breach the data discipline of the office.",
          "Repair schedules belong to the equipment row, not letter c's copy-and-send scope.",
        ],
      },
      // Q2 application
      {
        skill: "Photocopying and sending documents",
        catalogSkill: "Photocopying and sending documents",
        stem:
          "A signed memorandum must reach a branch office today, and the original is locked in the executive's laptop drawer.",
        options: [
          "copy what the executive's laptop shows through the glass, print it twice, and send the copies unlabeled",
          "ask the branch to redraft the memo themselves and pray the signed original matches later",
          "have the secretary produce a clean copy per office practice, then dispatch it with a transmittal note today",
          "photograph the memo in the drawer at an angle, print it on test stock, and mail it to the branch tomorrow",
        ],
        answer: 2,
        ref: "PSOC 4110 · c] (lib/fixtures/rowspec/office.ts:88)",
        distractorNotes: [
          "Glass-through copies are not clean reproduction — the machines' line expects properly produced copies.",
          "Outsourcing redrafts voids the copy-and-send act the letter's row carries out itself.",
          "Write-up leg: the KEY runs the letter's photocopy-and-send as the office's servable standard — clean copy, dispatched with the transmittal.",
          "Angle photos and test stock are neither photocopying nor sending — both legs fail inside the act.",
        ],
      },
      // Q3 judgment
      {
        skill: "Photocopying and sending documents",
        catalogSkill: "Photocopying and sending documents",
        stem:
          "A visitor asks for ten certified copies of the department's adjudication schedule, a document the office flags as confidential.",
        options: [
          "photocopy all ten pages right there, since the visitor's request probably stands for the office's own interest",
          "hand over one page as a sample and promise the rest quietly once your supervisor's away",
          "send the visitor upstairs to whoever owns the confidentiality flag with a copy of the schedule in hand",
          "route the request per the office's document-handling practice — the copy desk acts when the flag says it may",
        ],
        answer: 3,
        ref: "PSOC 4110 · c] (lib/fixtures/rowspec/office.ts:88)",
        distractorNotes: [
          "Confidential-flagged documents copy on permission, not on the visitor's guess of standing.",
          "Promise-now-copy-later bypasses the flag just as fully; the copy desk acts on authorization, not on absence.",
          "Copy-in-hand defeats the flag before the owning desk ever speaks — the copy desk follows the flag's own route.",
          "Write-up leg: the KEY keeps letter c's send within the office's own handling practice — copies run on authorization.",
        ],
      },
    ],
  },

  {
    skill: "Routine reports & correspondence",
    catalogSkill: "Routine reports & correspondence",
    items: [
      // Q1 recognition
      {
        skill: "Routine reports & correspondence",
        catalogSkill: "Routine reports & correspondence",
        stem:
          "Letter d) lists “preparing reports and correspondence of a routine nature”; O*NET's role adds “type, format, proofread, and edit correspondence… using computers.” What fills the desk?",
        options: [
          "the office's standing written output — prepared, typed, proofed, and dispatched on schedule",
          "the archive's occasional manuscript transcription for the office's retired founder",
          "the composing of new corporate policy drafts for the managing partner's committee",
          "the office's printed error log for machines beyond the tech team's reach",
        ],
        answer: 0,
        ref: "PSOC 4110 · d] + O*NET 43-9061.00 (lib/fixtures/rowspec/office.ts:96-97)",
        distractorNotes: [
          "Write-up leg: the KEY is the letter's own routine-nature framing plus the O*NET loop — type, format, proofread, edit.",
          "Archive transcripts for a founder are a special commission, not the routine nature letter d names.",
          "New corporate policy drafts carry judgment beyond the routine-nature limit of this row.",
          "Machines' error logs are the equipment row's territory, not the correspondence desk's.",
        ],
      },
      // Q2 application
      {
        skill: "Routine reports & correspondence",
        catalogSkill: "Routine reports & correspondence",
        stem:
          "Friday noon: the weekly attendance-and-activity summary is due, and Thursday's records arrived half-typed from one source.",
        options: [
          "finish the summary from the week's own records — typed, proofread, and dispatched on schedule despite the missing Thursday",
          "note the gap in a half-page statement naming last Thursday's source as the summary's premature loss",
          "merge the half-typed source into the summary verbatim and attach a photo of Thursday's ledger",
          "ask for the deadline's later date and fill the week with whatever residue remains on Friday",
        ],
        answer: 0,
        ref: "PSOC 4110 · d] + O*NET 43-9061.00 (lib/fixtures/rowspec/office.ts:96-97)",
        distractorNotes: [
          "Write-up leg: the KEY runs letter d and the O*NET loop — prepare, type, format, proofread, and dispatch on its schedule.",
          "A loss statement documents absence but leaves the routine report unwritten — the desk's verb is preparing it.",
          "Verbatim and photo-attachment shipping is not proofread, formatted correspondence.",
          "Deadline pushing for unfilled space inverts the row's routine-nature charge.",
        ],
      },
      // Q3 judgment
      {
        skill: "Routine reports & correspondence",
        catalogSkill: "Routine reports & correspondence",
        stem:
          "A client's letter lands asking for a figure your supervisor said aloud last month — but the written record shows a different number.",
        options: [
          "draft a reply inside the routine loop — figure offered with the office's written record cited, flagged to the supervisor for confirmation first",
          "answer with the quoted number since the client's memory of the meeting holds more weight than any typed file",
          "print both numbers with the note that one arrives from the file, one from the supervisor's say-so — no preference, no attachment",
          "hold the reply until the client's claim is spent, then answer only what the written file carries",
        ],
        answer: 0,
        ref: "O*NET 43-9061.00 · “proofread, and edit correspondence…” (lib/fixtures/rowspec/office.ts:97)",
        distractorNotes: [
          "Write-up leg: the KEY matches the O*NET loop's edit-and-proofread — and hands the discrepancy to the supervisor's decision.",
          "Spoken memory cannot outrun the typed record — correspondence carries the office's voice, not individual recollection.",
          "Both-numbers printing without a named preference leaves the recipient confused rather than served.",
          "Silence-then-cite starves the routine loop of its own reply duty — the letter earns an answer on record.",
        ],
      },
    ],
  },

  {
    skill: "Responding to enquiries (telephone/electronic) or forwarding",
    catalogSkill: "Responding to enquiries (telephone/electronic) or forwarding",
    items: [
      // Q1 recognition
      {
        skill: "Responding to enquiries (telephone/electronic) or forwarding",
        catalogSkill: "Responding to enquiries (telephone/electronic) or forwarding",
        stem:
          "Letter f) lists “responding to telephone or electronic enquiries or forwarding to appropriate person,” with O*NET's “review files, records… to obtain information to respond to requests” behind it. What is the enquiry desk's act?",
        options: [
          "answering enquiries from the records themselves, or passing the enquiry to the person who owns it",
          "handing every enquiry off to the person with the longest job title and no further trail",
          "ringing random numbers within the directory until someone claims each enquiry",
          "filtering enquiries by how soon the office expects their senders to call back",
        ],
        answer: 0,
        ref: "PSOC 4110 · f] + O*NET 43-9061.00 (lib/fixtures/rowspec/office.ts:104-105)",
        distractorNotes: [
          "Write-up leg: the KEY runs letter f's own pair — respond (with the records behind it), or forward to the right person.",
          "A longest-title hand-off discards the desk's answering leg and the trail the records back it with.",
          "Random directory calls aren't routing — “appropriate person” is a named owner, not a lottery.",
          "Sender-urgency filtering answers unwritten criteria; letter f's rule is the records and the owner.",
        ],
      },
      // Q2 application
      {
        skill: "Responding to enquiries (telephone/electronic) or forwarding",
        catalogSkill: "Responding to enquiries (telephone/electronic) or forwarding",
        stem:
          "An email asks whether a 2019 permit-renewal form remains on file, and the folder scheme says Personnel's records live three cabinets over.",
        options: [
          "check the cabinets and the drive for the form, reply with what you find, or forward the enquiry to the record's owning desk",
          "assume the form rotted away in the scheme and reply with 'archived as of 2021, ask elsewhere'",
          "bulk-forward the entire folder to the enquirer and let them hunt through it all themselves",
          "reply with the last form you personally remember reading last quarter at the assistant's desk",
        ],
        answer: 0,
        ref: "O*NET 43-9061.00 · “review files, records…” (lib/fixtures/rowspec/office.ts:105)",
        distractorNotes: [
          "Write-up leg: the KEY executes letter f and O*NET's review-files act — check, answer, or forward to the owner.",
          "Assumptions aren't the review the anchor names; the desk checks before answering anything.",
          "Bulk-forwarding a folder runs past the enquiry — the sender asked one question, not full custody.",
          "Personal memory is not the file review the O*NET line prints — the record decides.",
        ],
      },
      // Q3 judgment
      {
        skill: "Responding to enquiries (telephone/electronic) or forwarding",
        catalogSkill: "Responding to enquiries (telephone/electronic) or forwarding",
        stem:
          "A caller's enquiry needs two answers: one the records give cleanly, one only the Finance Bureau can judge. What does the desk's letter f ask of you?",
        options: [
          "answer the record-backed half now and forward the finance half to its owning officer with the caller's own trail attached",
          "tell the caller the enquiry exceeds the desk and leave the two halves entirely to their own next call",
          "hold both halves until finance replies, regardless of what the records have already settled",
          "answer both halves from your own judgment call on what a reasonable bureau might say",
        ],
        answer: 0,
        ref: "PSOC 4110 · f] (lib/fixtures/rowspec/office.ts:104)",
        distractorNotes: [
          "Write-up leg: the KEY runs letter f's split in one pass — respond what the desk can, forward the rest to the appropriate person.",
          "Leaving both halves unattended leaves the enquiry's own route unclaimed — the desk holds the first answer.",
          "Record-backed answers don't wait on unrelated halves — the letter f split runs each leg on its own track.",
          "Judgment-guessing a bureau's answer breaks the forwarding leg the letter names by design.",
        ],
      },
    ],
  },

  {
    skill: "Recording issue of equipment to staff",
    // thin: PSF-only per user Option A 2026-11-05 (resourceless-thin lettered row)
    catalogSkill: "Recording issue of equipment to staff",
    items: [
      // Q1 recognition
      {
        skill: "Recording issue of equipment to staff",
        catalogSkill: "Recording issue of equipment to staff",
        stem:
          "Letter e) lists “recording issue of equipment to staff” — a thin lettered role. What does that one line name?",
        options: [
          "an equipment register's entries: what was handed out, to whom, and when",
          "a formal contract signed by every borrower of every office machine each quarter",
          "an inventory count of machines not yet issued, kept in the storeroom's books only",
          "a written apology to any staff member missing equipment",
        ],
        answer: 0,
        ref: "PSOC 4110 · e] (lib/fixtures/rowspec/office.ts:112)",
        distractorNotes: [
          "Write-up leg: the KEY is the letter's own phrase — recording the issue of equipment to staff — a register's entry.",
          "Quarterly contracts exceed the row's line — recording is the act, not loan contracting.",
          "Unissued-inventory counting is a reserve side of the register, not the letter's issue-to-staff leg.",
          "Apologies aren't registration — the letter's act is the recorded hand-out itself.",
        ],
      },
      // Q2 application
      {
        skill: "Recording issue of equipment to staff",
        catalogSkill: "Recording issue of equipment to staff",
        stem:
          "A teammate borrows the department's projector overnight for an offsite workshop.",
        options: [
          "record the issue in the register — item, borrower, date out — and note the return when the projector comes back",
          "let them carry it and record the borrow only if it is still outstanding by Friday's closing hour",
          "sign the item out under the office umbrella so any borrower's record merges with the department's",
          "have the borrower email their own confirmation to chat and call the register handled from there",
        ],
        answer: 0,
        ref: "PSOC 4110 · e] (lib/fixtures/rowspec/office.ts:112)",
        distractorNotes: [
          "Write-up leg: the KEY carries the register act — recorded issue with out-date, plus the return's own entry.",
          "Conditional Friday recording turns the register into a late-adoption memo — recording is immediate.",
          "Recording under the office umbrella erases the borrower — the letter's line records issue per person.",
          "Chat threads are not the office's register the letter's row sustains.",
        ],
      },
      // Q3 judgment
      {
        skill: "Recording issue of equipment to staff",
        catalogSkill: "Recording issue of equipment to staff",
        stem:
          "A register entry shows a scanner issued two weeks ago and never returned; the named borrower has moved to another department.",
        options: [
          "raise the overdue entry to the department's owner — the record's trail goes where the scanner's paperwork demands",
          "leave the entry and mark a nominal transfer to the new department since the scanner probably tagged along anyway",
          "strike the entry silently and refresh the register as though the scanner stood as office property all along",
          "charge the borrower's old manager directly in a firm note so the register then forgives the debt",
        ],
        answer: 0,
        ref: "PSOC 4110 · e] (lib/fixtures/rowspec/office.ts:112)",
        distractorNotes: [
          "Write-up leg: the KEY follows the register trail — the row's raising goes through the record's own owner.",
          "A nominal transfer against assumption fakes an entry the register never recorded.",
          "Striking silently rewrites the register — the row's discipline is recording, not erasing.",
          "A direct charge is a personal demand; the register's route runs through its owning desk.",
        ],
      },
    ],
  },

  {
    skill: "Checking figures, preparing invoices and recording details of financial transactions made",
    // thin: PSF-only per user Option A 2026-11-05 (thin lettered row)
    catalogSkill: "Checking figures, preparing invoices and recording details of financial transactions made",
    items: [
      // Q1 recognition
      {
        skill: "Checking figures, preparing invoices and recording details of financial transactions made",
        catalogSkill: "Checking figures, preparing invoices and recording details of financial transactions made",
        stem:
          "Letter g) lists “checking figures, preparing invoices and recording details of financial transactions made.” What is on this desk?",
        options: [
          "verify the numbers, set the invoice, and log the transaction's details in the office's record",
          "double the receivables forecast every quarter end and hand the projection to buyers directly",
          "distribute the office's petty-cash tokens as Novelties at every staff meeting's opener",
          "retype the auditor's published statement word for word and publish it unsigned",
        ],
        answer: 0,
        ref: "PSOC 4110 · g] (lib/fixtures/rowspec/office.ts:120)",
        distractorNotes: [
          "Write-up leg: the KEY is the letter's own triple — check the figures, prepare the invoice, record the transaction's details.",
          "Forecast doubling is a projection work no letter-g row carries.",
          "Petty-cash Novelties are giveaways, not recorded financial transactions.",
          "Republishing auditors' work uncredited is outside the row and never its intent.",
        ],
      },
      // Q2 application
      {
        skill: "Checking figures, preparing invoices and recording details of financial transactions made",
        catalogSkill: "Checking figures, preparing invoices and recording details of financial transactions made",
        stem:
          "Your drafted invoice shows ₱12,500, but the client's signed order — the transaction's written record — says ₱15,000.",
        options: [
          "keep the lower figure as a goodwill gesture and log ₱12,500 into the transaction's record",
          "raise the difference, rebill at ₱15,000 as the order states, and record the transaction amount per the written record",
          "split it to ₱13,750 and mark the log 'rounded per office custom' without any word to the client",
          "leave the invoice at ₱12,500 and wait until the yearly audit to admit which figure was right",
        ],
        answer: 1,
        ref: "PSOC 4110 · g] (lib/fixtures/rowspec/office.ts:120)",
        distractorNotes: [
          "Goodwill rebates aren't yours to invent — the written record carries the figures the transaction made.",
          "Write-up leg: the KEY runs the row in order — figures checked against the order, invoice prepared, details recorded.",
          "A private “custom” split fakes the invoice's arithmetic and its recorded details.",
          "Waiting for an audit leaves the transaction's record faulty through this desk's own act.",
        ],
      },
      // Q3 judgment
      {
        skill: "Checking figures, preparing invoices and recording details of financial transactions made",
        catalogSkill: "Checking figures, preparing invoices and recording details of financial transactions made",
        stem:
          "An invoice you recorded two days ago is challenged: the client shows a discount letter the transaction's record never carried.",
        options: [
          "pull the record open, examine the discount's standing, correct where the paper supports it, and route first to your supervisor",
          "refuse any correction until the audit cycle reopens on schedule, no matter what the discount letter says",
          "alter the record's number alone and phrase the client a short note that no discount letter has ever been seen",
          "widen the discount to all open invoices for the client, since one letter now applies office-wide",
        ],
        answer: 0,
        ref: "PSOC 4110 · g] (lib/fixtures/rowspec/office.ts:120)",
        distractorNotes: [
          "Write-up leg: the KEY runs “checking figures” honestly — the record, the paper, the correction, the supervisor informed.",
          "Refusing a paper-backed correction until an audit cycle is not the row's intended discipline.",
          "Correcting the number without the paper-detail trail breaks the row's own recording act.",
          "One discount letter does not grant desk-level office-wide pricing — the scope's widening is not a figure check.",
        ],
      },
    ],
  },

  {
    skill: "Transcribing information into computers, and proof-reading and correcting copy",
    // thin: PSF-only per user Option A 2026-11-05 (thin lettered row)
    catalogSkill: "Transcribing information into computers, and proof-reading and correcting copy",
    items: [
      // Q1 recognition
      {
        skill: "Transcribing information into computers, and proof-reading and correcting copy",
        catalogSkill: "Transcribing information into computers, and proof-reading and correcting copy",
        stem:
          "Letter h) lists “transcribing information into computers” plus “proof-reading and fixing the copy.” What does this role combine?",
        options: [
          "keying information into the computer and reading back the copy to catch and fix slips",
          "typing whatever tone each sender prefers into the machine, unedited as received",
          "scanning pages straight to image files so no typed copy ever exists to proof",
          "whispering the material to a colleague who keys it while you proof their speech",
        ],
        answer: 0,
        ref: "PSOC 4110 · h] + O*NET database anchor (lib/fixtures/rowspec/office.ts:128-129)",
        distractorNotes: [
          "Write-up leg: the KEY carries both legs of letter h — the transcription in, and the proofreading-and-correcting back.",
          "Typing tone unedited omits the correcting leg the letter's second clause names.",
          "Image scans skip the transcription act the letter sets as the row's opening verb.",
          "Borrowed ears are no subrogation for the desk's own proofread-and-correct work.",
        ],
      },
      // Q2 application
      {
        skill: "Transcribing information into computers, and proof-reading and correcting copy",
        catalogSkill: "Transcribing information into computers, and proof-reading and correcting copy",
        stem:
          "You key forty handwritten survey pages; three pages carry margin scrawl that changes two answers' meaning.",
        options: [
          "submit the batch immediately since typed copy outranks handwriting however it was drafted",
          "route the scrawled pages to their owner for reading, key the rest, and proof the batch against the pages before submitting",
          "delete the illegible entries so the batch's totals stand clean at the cost of three answers",
          "type the batch twice in two independent captures and treat the two versions' disagreements as cover",
        ],
        answer: 1,
        ref: "PSOC 4110 · h] (lib/fixtures/rowspec/office.ts:128)",
        distractorNotes: [
          "Typed-no-proof is the shortcut letter h's own correcting leg resists entirely.",
          "Write-up leg: the KEY runs the correcting leg before any submit — the scrawl resolved, the batch proofed.",
          "Deleting entries manufactures clean totals — the row's proofreading works on what was actually answered.",
          "Dual capture without resolution hides disagreement rather than correcting the copy.",
        ],
      },
      // Q3 judgment
      {
        skill: "Transcribing information into computers, and proof-reading and correcting copy",
        catalogSkill: "Transcribing information into computers, and proof-reading and correcting copy",
        stem:
          "After transcribing a batch, a proofread pass finds an error the office's system cannot fix once submitted — the batch closed at the courier's door.",
        options: [
          "report the caught error up the desk's chain before the courier's window closes — the proofread pass exists to catch more than nil",
          "resubmit the batch by hand next week and leave this week's batch unmarked since the window's already done",
          "correct it silently on the machine's own copy and pay no further attention until the client's audit lands",
          "ship the mid-error batch to the recorder's permanent screen and keep typing newer batches to fill the week",
        ],
        answer: 0,
        ref: "PSOC 4110 · h] + O*NET database anchor (lib/fixtures/rowspec/office.ts:128-129)",
        distractorNotes: [
          "Write-up leg: the KEY keeps the correcting leg where it operates best — raised, marked, and timed before the record freezes.",
          "Next-week resubmission doesn't fix the shipped batch — the row's correcting act runs on the caught error now.",
          "Silent machine-side fixes leave the shipped record standing wrong while the desk moves on.",
          "Building a filler schedule instead of flagging abandons the row's own proof of work.",
        ],
      },
    ],
  },

  {
    skill: "Communication · Professionalism (Enabling)",
    // thin: PSF-only per user Option A 2026-11-05 (NACE-tagged, flagged paraphrase)
    catalogSkill: "Communication · Professionalism (Enabling)",
    items: [
      // Q1 recognition
      {
        skill: "Communication · Professionalism (Enabling)",
        catalogSkill: "Communication · Professionalism (Enabling)",
        stem:
          "Office Clerk's enabling role carries NACE-tagged communication and professionalism — flagged paraphrase with no verbatim task lines. What is such an enabling role?",
        options: [
          "the built-in behavior layer behind every lettered row — how the daily desk acts with people and files",
          "an extra department assigned to the office during recruitment season only",
          "a supervisory clearance no clerk holds until their second formal appraisal",
          "a fixed certificate pressing on whether staff may speak during meetings",
        ],
        answer: 0,
        ref: "NACE enabling row — flagged paraphrase layer (lib/fixtures/rowspec/office.ts:136)",
        distractorNotes: [
          "Write-up leg: the KEY defines the enabling layer the NACE tag marks — supporting behavior, not a separate post.",
          "It isn't a department — enabling rows don't add headcount; they carry conduct for the main rows.",
          "No clearance gates the layer; it is present from the first desk day.",
          "Speech certificates do not exist under any enabling behavior language.",
        ],
      },
      // Q2 application
      {
        skill: "Communication · Professionalism (Enabling)",
        catalogSkill: "Communication · Professionalism (Enabling)",
        stem:
          "A caller swears at you over an invoice and hangs up; two files from that same call need to be closed by lunch.",
        options: [
          "compose yourself, draft a neutral account of the call for the trail, and continue closing the two files professionally",
          "mention the caller's profanity in the inbox's next all-staff message to warn your colleagues under",
          "skip the closing entirely since the caller's tone left you emotionally unfit for the whole afternoon",
          "retaliate on the caller's next contact by screening all their future letters harder",
        ],
        answer: 0,
        ref: "NACE enabling row — flagged paraphrase layer (lib/fixtures/rowspec/office.ts:136)",
        distractorNotes: [
          "Write-up leg: the KEY is the layer's craft — professional conduct after a rough call, with the trail kept factual.",
          "Broadcast abuse in open messaging shames the desk and its caller further — professionalism curbs the release instead.",
          "Closing files unhandled because of one call surrenders the desk to insult power.",
          "Screening harder is selective conduct — professionalism treats future messages like any other.",
        ],
      },
      // Q3 judgment
      {
        skill: "Communication · Professionalism (Enabling)",
        catalogSkill: "Communication · Professionalism (Enabling)",
        stem:
          "A coworker's persistent joking about a client's name has started to stick — staff now refer to the client by the joke.",
        options: [
          "address the coworker privately first — ask them to speak about the client by the client's real name — and keep the record's name intact",
          "laugh once for ties and use the joke yourself, since speaking up risks a silent cold shoulder you'd carry all month",
          "report it first to the department's chat thread so all staff weigh in before anything settles",
          "have the client's file renamed under the joke so evens out everyone's speech going forward",
        ],
        answer: 0,
        ref: "NACE enabling row — flagged paraphrase layer (lib/fixtures/rowspec/office.ts:136)",
        distractorNotes: [
          "Write-up leg: the KEY pairs professionalism — the respectful name — with communication — the private-first correction.",
          "Joining the joke makes it yours; the layer's standing comes from never lending it.",
          "A chat-thread escalation makes public theater of a co-worker's slip before any direct attempt at care.",
          "Renaming files to a joke resigns the record to slang — the record's dignity is the desk's guard.",
        ],
      },
    ],
  },

  // ═══ 5.3 · Data Encoder (encode) — 8 rows ════════════════════════════════
  {
    skill: "Receiving & registering source documents for data capture",
    catalogSkill: "Receiving & registering source documents for data capture",
    items: [
      // Q1 recognition
      {
        skill: "Receiving & registering source documents for data capture",
        catalogSkill: "Receiving & registering source documents for data capture",
        stem:
          "PSOC 4132 letter a) lists “receiving and registering invoices, forms, records and other documents for data capture.” What does the letter's intake desk hold?",
        options: [
          "receiving each document batch and logging its register entry — number, date, sender — before any keying",
          "guessing the month's counts from the courier's past volumes and keying whatever email lands",
          "storing documents unopened in courier bags until the capture software demands them",
          "printing the paper batches twice so the typed rows can rest beside a mirror copy",
        ],
        answer: 0,
        ref: "PSOC 4132 · a] + O*NET 43-9021.00 (lib/fixtures/rowspec/office.ts:145-146)",
        distractorNotes: [
          "Write-up leg: the KEY carries both letter-a verbs — receive and register (the logged batch identity before capture).",
          "Estimates are not registration — the letter's act is the recorded batch, not a projection of its volume.",
          "Unopened bags skip the registering leg entirely — receipt without registration is not capture.",
          "Mirror printing adds storage, not the register the letter names.",
        ],
      },
      // Q2 application
      {
        skill: "Receiving & registering source documents for data capture",
        catalogSkill: "Receiving & registering source documents for data capture",
        stem:
          "Branch offices email scan batches; two arrive without batch numbers within an hour, and the rest of the day's queue is full.",
        options: [
          "key the unnumbered batches anyway under your own initials so the day's count stays whole",
          "bin those two batches as unreadable and note 'lost by sender' in the day's summary",
          "key them into last month's batch so the register's counts balance without extra rows",
          "register every batch — number, date, sender — and hold the two unnumbered ones until their numbers arrive",
        ],
        answer: 3,
        ref: "PSOC 4132 · a] (lib/fixtures/rowspec/office.ts:145)",
        distractorNotes: [
          "Keying under initials fakes the batch's registered identity — letter a's register entry is the batch's own.",
          "Binned batches never entered the register at all — capture lost two branches' work by the desk's own motion.",
          "Borrowed-month keying corrupts both batches' register entries and last month's closed counts.",
          "Write-up leg: the KEY runs the letter's registering act honestly — all batches logged, the unnumbered held at the gate.",
        ],
      },
      // Q3 judgment
      {
        skill: "Receiving & registering source documents for data capture",
        catalogSkill: "Receiving & registering source documents for data capture",
        stem:
          "A registered batch's pages show tampering — two roles whited-over — before keying has started. The branch is unreachable until Monday.",
        options: [
          "flag the batch in the register with the tamper noted, key the clean rows, and hold the whited-over rows for the branch's word",
          "key the whited-over rows from the visible traces anyway and let the tampering speak for itself downstream",
          "rekey the batch from a remembered sibling batch and mark the register entry unchanged",
          "return the batch unkeyed and strike its register entry so the tampering stays off the books",
        ],
        answer: 0,
        ref: "O*NET 43-9021.00 · “Select materials needed to complete work assignments” (lib/fixtures/rowspec/office.ts:146)",
        distractorNotes: [
          "Write-up leg: the KEY keeps the register honest — flag, partial capture, and the source's own word on tampered rows.",
          "Keying from traces turns tampered rows into guessed data — the letter's registering scope doesn't cover invention.",
          "Borrowed-batch rekeying manufactures data twice over: a fake source and an untouched register.",
          "Striking the entry hides the tamper from every future reader — the register's whole purpose is the trail.",
        ],
      },
    ],
  },

  {
    skill: "Source-document reading & field mapping (entering from source material)",
    catalogSkill: "Source-document reading & field mapping (entering from source material)",
    items: [
      // Q1 recognition
      {
        skill: "Source-document reading & field mapping (entering from source material)",
        catalogSkill: "Source-document reading & field mapping (entering from source material)",
        stem:
          "O*NET's line reads “Read source documents such as canceled checks, sales reports, or bills, and enter data in specific data fields.” What is the desk's discipline?",
        options: [
          "read each source's labeled fields and map them to the matching fields in the computer's entry form",
          "enter each source's headline figure first and backfill the remaining fields when time allows",
          "read the source once, then re-enter it from memory into any order the day's queue favors",
          "scan the sources into a folder and enter only their totals into the system's first field",
        ],
        answer: 0,
        ref: "O*NET 43-9021.00 · read/enter task + PSOC 4132 · b] (lib/fixtures/rowspec/office.ts:153-154)",
        distractorNotes: [
          "Write-up leg: the KEY is the anchor's own discipline — read the source, enter into specific data fields.",
          "Headline-first leaves the anchor's “specific data fields” half-filled until some later hour that never opens.",
          "Memory-entering abandons the source — the anchor keys from the document, not recollection.",
          "Totals-only entering skips everything the anchor's list of documents carries field by field.",
        ],
      },
      // Q2 application
      {
        skill: "Source-document reading & field mapping (entering from source material)",
        catalogSkill: "Source-document reading & field mapping (entering from source material)",
        stem:
          "A paper form shows 'Date of Birth' and 'Account No.' in an unfamiliar side-by-side layout, with two stamped values you can't immediately tell apart.",
        options: [
          "study the labels, match each stamped value to its own field, and key both into the entry form's labeled slots",
          "key whichever number comes first in reading order into the birth-date field to keep momentum",
          "key both numbers into the account field together so one live row covers the whole form's upper block",
          "leave both fields blank and advance to the next form, since readability doubts excuse the row",
        ],
        answer: 0,
        ref: "PSOC 4132 · b] (lib/fixtures/rowspec/office.ts:154)",
        distractorNotes: [
          "Write-up leg: the KEY runs letter b — “entering numerical data… from source material” — mapped field by field.",
          "Reading-order keying swaps a birth date for an account number — the map, not the layout, decides.",
          "A two-in-one field breaks every downstream field the entry form defines — letter b's entering is labeled.",
          "Blank-fields adoption feeds the accuracy row nothing — the mapping desk resolves, it doesn't skip.",
        ],
      },
      // Q3 judgment
      {
        skill: "Source-document reading & field mapping (entering from source material)",
        catalogSkill: "Source-document reading & field mapping (entering from source material)",
        stem:
          "A source form stamps a date as 04/07 in a shipment whose country writes day-first; the office's system writes month-first.",
        options: [
          "consult the form's own context to settle the reading, note the basis in the row's remark, and key the settled value",
          "key it month-first unthinkingly since the system is the only standard the office owns",
          "key it day-first since the shipment's country outranks the office system in all things",
          "key both possible dates into a remark line and leave the date field permanently empty",
        ],
        answer: 0,
        ref: "O*NET 43-9021.00 · read/enter task (lib/fixtures/rowspec/office.ts:153)",
        distractorNotes: [
          "Write-up leg: the KEY reads the source as the anchor demands — the document's own context settles what gets keyed.",
          "System-first is not reading the source — the anchor's desk begins with the document's own meaning.",
          "Country-first is the same shortcut flipped; the source's internal context, not a flag, carries the date.",
          "An empty date field is a skipped row — the anchor's desk resolves and enters, remark and all.",
        ],
      },
    ],
  },

  {
    skill: "Accuracy/error detection & correction",
    catalogSkill: "Accuracy/error detection & correction",
    items: [
      // Q1 recognition
      {
        skill: "Accuracy/error detection & correction",
        catalogSkill: "Accuracy/error detection & correction",
        stem:
          "O*NET's loop reads: locate and fix data entry errors, or report them to supervisors — compare data with source documents, or re-enter in verification format to detect errors. What is the desk's loop?",
        options: [
          "discover your own entry errors, correct them against the source, and re-verify where the fix spreads",
          "wait for downstream users to report each error, then fix only the ones anyone noticed",
          "keep a private list of errors discovered and clear it in one sweep at month's closing",
          "double-speed your typing so fewer errors exist in any window a reviewer might sample",
        ],
        answer: 0,
        ref: "PSOC 4132 · c] + O*NET accuracy tasks (lib/fixtures/rowspec/office.ts:161-162)",
        distractorNotes: [
          "Write-up leg: the KEY carries letter c and O*NET's pair — detect by comparison, correct, or report upward.",
          "User-reported-only waiting leaves the anchor's locating leg broken — the desk runs its own loop first.",
          "A month's sweep freezes errors live and in the data for weeks — the anchor's loop runs per batch.",
          "Faster typing raises, not lowers, the error rate — speed is not the anchor's verification format.",
        ],
      },
      // Q2 application
      {
        skill: "Accuracy/error detection & correction",
        catalogSkill: "Accuracy/error detection & correction",
        stem:
          "You spot your own typo in a client's saved address before anyone else does, and that address echoes in two dependent records.",
        options: [
          "correct the saved record now and check whether the error spread into the two dependent rows",
          "correct only the main record and leave the dependents for whoever next opens them",
          "await the client's own written confirmation of their address before touching anything",
          "delete all three records and key them from scratch next week for purity's sake",
        ],
        answer: 0,
        ref: "PSOC 4132 · c] + O*NET accuracy tasks (lib/fixtures/rowspec/office.ts:161-162)",
        distractorNotes: [
          "Write-up leg: the KEY runs the letter-c loop — correcting entered data where it was entered, dependents checked.",
          "Half a correction plants a new inconsistency — only-the-main leaves the dependents wrong.",
          "The typo is caught and known; awaiting outside blessing stalls the anchor's own correction act.",
          "Deletion turns one fixable error into three rows of missing data while the anchor's loop held the fix.",
        ],
      },
      // Q3 judgment
      {
        skill: "Accuracy/error detection & correction",
        catalogSkill: "Accuracy/error detection & correction",
        stem:
          "Your verification pass flags a mismatch the source sheet itself may have caused — the paper reads ₱8,420, the client's own signed record says ₱8,240.",
        options: [
          "hold the row as flagged, surface the mismatch to your supervisor with both records named, and note the desk's position in the log",
          "key the paper's figure since paper is the only source the letter-c desk ever trusts, and move on",
          "key the signed record's figure since signatures outrank everything, and silently close the row",
          "average the two figures to ₱8,330 and log the row as key-within-tolerance",
        ],
        answer: 0,
        ref: "O*NET 43-9021.00 · “…or report them to supervisors” (lib/fixtures/rowspec/office.ts:161)",
        distractorNotes: [
          "Write-up leg: the KEY is the anchor's own escape hatch — errors beyond the desk's correction get reported upward.",
          "Paper-blind trust is not the row — the anchor pairs the source-report check with the verification pass.",
          "Signature-blind trust is neither — the correction-or-report line runs regardless of whose ink settles it.",
          "An invented average fabricates a figure neither record carries — letter c's discipline never fabricates.",
        ],
      },
    ],
  },

  {
    skill: "Compilation, sorting, verification before entry",
    catalogSkill: "Compilation, sorting, verification before entry",
    items: [
      // Q1 recognition
      {
        skill: "Compilation, sorting, verification before entry",
        catalogSkill: "Compilation, sorting, verification before entry",
        stem:
          "O*NET's line for the role: “Compile, sort, and verify the accuracy of data before it is entered.” What does the pre-entry desk hold?",
        options: [
          "assemble the batch, sort it to the entry's order, and verify its accuracy before any keying begins",
          "key each item the moment it arrives so the pre-entry hours stay emptier for the afternoon",
          "sort the batch visually and call the queue done — verification is the reviewer's separate stage",
          "compile a count only — the sorting and verifying legs wait for whoever owns the reverse schedule",
        ],
        answer: 0,
        ref: "O*NET 43-9021.00 · pre-entry task (lib/fixtures/rowspec/office.ts:169)",
        distractorNotes: [
          "Write-up leg: the KEY is the anchor's own three-run — compile, sort, verify — all before the entry itself.",
          "Pulling ahead of compile and sort inverts the anchor's order — the row runs before the entry, not beside it.",
          "Sorting alone stops at one leg of three — the anchor's verify stands in the same pass.",
          "A bare count compiles but skips both remaining legs the anchor's line names.",
        ],
      },
      // Q2 application
      {
        skill: "Compilation, sorting, verification before entry",
        catalogSkill: "Compilation, sorting, verification before entry",
        stem:
          "Ninety enrollment forms arrive jumbled across three folders, and three forms carry torn corners over their ID numbers.",
        options: [
          "compile and sort the full set to keying order, verify each form's completeness, and set the torn ones aside for their ID's meaning",
          "key straight through all three folders as they sit and let the torn corners key as they will anyway",
          "sort only the thick folder, verify nothing, then key the whole pile by its visual feel",
          "send half the pile unread back down the intake to slow the day's demand to a manageable pace",
        ],
        answer: 0,
        ref: "O*NET 43-9021.00 · pre-entry task (lib/fixtures/rowspec/office.ts:169)",
        distractorNotes: [
          "Write-up leg: the KEY runs compilation, sorting, and verification — the torn forms flagged rather than silently keyed.",
          "Untorn-order keying keys unverified — the anchor's verify leg fails before the first row lands.",
          "One folder sorted plus zero verification are two of three legs skipped — the anchor runs the full three.",
          "Shipping unread batches back is intake refusal, not pre-entry quality — the anchor's desk does the work.",
        ],
      },
      // Q3 judgment
      {
        skill: "Compilation, sorting, verification before entry",
        catalogSkill: "Compilation, sorting, verification before entry",
        stem:
          "A rushed manager pushes one unverified batch to the top of the queue for an afternoon meeting, ahead of three verified ones.",
        options: [
          "order the batch per agreement, but run its compile-sort-verify first — the desk's pre-entry rule doesn't bend for an audience",
          "key the rushed batch first fully unverified since the manager's afternoon demands it and the desk absorbs the risk",
          "decline the manager's request outright and return the batch unkeyed for next week's queue",
          "present the keying-order gate at the meeting and let the manager's own slotting decide the desk's rule",
        ],
        answer: 0,
        ref: "O*NET 43-9021.00 · pre-entry task (lib/fixtures/rowspec/office.ts:169)",
        distractorNotes: [
          "Write-up leg: the KEY holds the pre-entry rule while honoring the queue's order — the desk bends to schedule, not to standards.",
          "Unverified keying under pressure is the exact defect the anchor's before-it-is-entered line blocks.",
          "Outright refusal bypasses the desk's own supervisor channel — the queue's order adjusts, the rule doesn't.",
          "Handing the rule to an audience surrenders the pre-entry gate the anchor's line sets.",
        ],
      },
    ],
  },

  {
    skill: "Storing completed documents & logs (records + throughput discipline)",
    catalogSkill: "Storing completed documents & logs (records + throughput discipline)",
    items: [
      // Q1 recognition
      {
        skill: "Storing completed documents & logs (records + throughput discipline)",
        catalogSkill: "Storing completed documents & logs (records + throughput discipline)",
        stem:
          "O*NET's role carries “Store completed documents in appropriate locations” and “Maintain logs of activities and completed work.” What does the end-of-batch desk hold?",
        options: [
          "file each completed document in its designated location and keep the activity log of what was processed",
          "retain the day's completed documents at the desk until a client chases one behind the queue",
          "scan everything and shred the paper immediately so no physical trail ever survives the day",
          "hand the whole processed pile to the manager's tray to be sorted out by another's judgment",
        ],
        answer: 0,
        ref: "O*NET 43-9021.00 · storage/logs tasks (lib/fixtures/rowspec/office.ts:177)",
        distractorNotes: [
          "Write-up leg: the KEY matches both anchor lines — appropriate locations for documents, a maintained log of the work.",
          "Desk-piled completed work is neither stored nor logged — the anchor's location and log are the batch's close.",
          "Immediate shredding destroys what the anchor designates a completed document's place to be.",
          "Manager-tray hand-offs dodge both verbs — storing and logging are the row's own close.",
        ],
      },
      // Q2 application
      {
        skill: "Storing completed documents & logs (records + throughput discipline)",
        catalogSkill: "Storing completed documents & logs (records + throughput discipline)",
        stem:
          "End of day: sixty processed enrollment forms sit finished, and one drawer's designated cabinet is locked for tomorrow's inventory count.",
        options: [
          "store the batch in the drawer that opens and log which drawer and count carry which rows pending their final move",
          "store the whole batch at your own desk locker since the designated cabinet is closed and the log stays unwritten",
          "leave the finished batch in the intake bin so the morning shift rediscovering it becomes their entry point",
          "shred forty of the sixty to fit the one open drawer and log the batch as reduced to forty",
        ],
        answer: 0,
        ref: "O*NET 43-9021.00 · storage/logs tasks (lib/fixtures/rowspec/office.ts:177)",
        distractorNotes: [
          "Write-up leg: the KEY keeps both anchor lines live — a designated interim location and a log that says which batch went where.",
          "A desk locker is no designated location, and no log breaks the anchor's second line outright.",
          "The intake bin is the start of a cycle, not the storage the anchor's completed-work line intends.",
          "Shredding to fit a drawer is destruction dressed as storage — the anchor's line never permits it.",
        ],
      },
      // Q3 judgment
      {
        skill: "Storing completed documents & logs (records + throughput discipline)",
        catalogSkill: "Storing completed documents & logs (records + throughput discipline)",
        stem:
          "A supervisor questions the day's throughput — she notes the log shows 120 roles keyed against a source count of 150.",
        options: [
          "open the log and the source count together, trace where the 30-row gap sits, and report the finding against the day's batch register",
          "stand on the 120 keyed count alone — the log is the throughput, and the manager's source count is someone else's record",
          "lift the log's count to 150 in the register so the day's summary closes as billed and no one need revisit",
          "reset the whole week's counts to zero and rekey the week from scratch during the weekend as penance",
        ],
        answer: 0,
        ref: "O*NET 43-9021.00 · “Maintain logs of activities and completed work” (lib/fixtures/rowspec/office.ts:177)",
        distractorNotes: [
          "Write-up leg: the KEY lives on the anchor's maintained log — the log is the traceable record that answers the query.",
          "Log-is-everything assumes keyed equals complete; the maintained-log line exists to trace against sources.",
          "Inflating a registered count falsifies the very record the anchor's line says to maintain.",
          "Whole-week resets manufacture a week of lost productivity to hide a traced gap.",
        ],
      },
    ],
  },

  {
    skill: "Operating bookkeeping and calculating machines",
    // thin: PSF-only per user Option A 2026-11-05 (thin lettered row)
    catalogSkill: "Operating bookkeeping and calculating machines",
    items: [
      // Q1 recognition
      {
        skill: "Operating bookkeeping and calculating machines",
        catalogSkill: "Operating bookkeeping and calculating machines",
        stem:
          "Letter d) lists “operating bookkeeping and calculating machines,” with O*NET's machine-operation anchors behind it. What fills the machine desk?",
        options: [
          "running the entries on the machines and verifying their printed output against the source's own records",
          "estimating the totals mentally and typing them into the ledger straight from your head",
          "handing the machine's tape to a colleague to interpret since machine feet belong to whoever prints them",
          "keeping the machine dusted daily as the storeroom's standing chore while entries wait untouched",
        ],
        answer: 0,
        ref: "PSOC 4132 · d] + O*NET machine anchors (lib/fixtures/rowspec/office.ts:184-185)",
        distractorNotes: [
          "Write-up leg: the KEY runs the machine desk's act — operate, then verify the machine's output against the source.",
          "Mental estimates are not machine operation — the letter's row names the machines themselves.",
          "Interpretation hand-offs dodge the operating leg — the desk's own verification completes the run.",
          "Dusting is maintenance trivia; the letter's row is the running of entries, not the machine's cleanliness.",
        ],
      },
      // Q2 application
      {
        skill: "Operating bookkeeping and calculating machines",
        catalogSkill: "Operating bookkeeping and calculating machines",
        stem:
          "Your ledger total must settle before posting hours closing at noon; the machine has never been loaded with today's media stock.",
        options: [
          "load the machine's required media per its operation guide, run the entries, and verify the printed tape against the ledger's lines",
          "run the entries from yesterday's remaining stock and mark the differences as today's rounding",
          "ask a neighboring desk's operator to press the total for you and carry their tape back unsigned",
          "power off the machine, write the total by hand in the ledger's margin, and let the machine be somebody else's problem",
        ],
        answer: 0,
        ref: "O*NET 43-9021.00 · “Load machines with required input or output media” (lib/fixtures/rowspec/office.ts:185)",
        distractorNotes: [
          "Write-up leg: the KEY carries the anchor's own steps — load the media, operate, and verify the machine's printed output.",
          "Yesterday's stock plus rounding-marked entry is unverified operation passing itself off as machine work.",
          "Neighbor-pressing skips the load-and-operate legs the anchor's desk itself holds.",
          "Handwritten margins beside a powered-off machine are not the letter's operating act.",
        ],
      },
      // Q3 judgment
      {
        skill: "Operating bookkeeping and calculating machines",
        catalogSkill: "Operating bookkeeping and calculating machines",
        stem:
          "The machine's listed tape disagrees with the ledger's hand-carried total for the third batch today.",
        options: [
          "re-run the three disputed entries on the machine, compare tape against ledger line by line, and route the standing disagreement to the supervisor",
          "erase the machine's tape, adjust the ledger to the machine's figure on all three entries, and leave the middle ground unvisited",
          "trust the ledger's hand-carried total throughout and treat the machine's tape as decoration for the file",
          "split the difference by hand on all three entries so the tape and ledger each carry one rejected figure",
        ],
        answer: 0,
        ref: "PSOC 4132 · d] (lib/fixtures/rowspec/office.ts:184)",
        distractorNotes: [
          "Write-up leg: the KEY operates then verifies — the letter-d act ends in supervisor routing when the record splits.",
          "Erasing a tape rewrites the machine's own evidence before the disagreement ever gets read.",
          "Ledger-over-tape trust without re-running is not verification — the letter's row runs on both records.",
          "Manual splitting fabricates a third figure no record produces — the desk's verification never invents.",
        ],
      },
    ],
  },

  {
    skill: "Importing and exporting data between different database systems and softwares",
    // thin: PSF-only per user Option A 2026-11-05 (thin lettered row; cryptographic anchor KEPT)
    catalogSkill: "Importing and exporting data between different database systems and softwares",
    items: [
      // Q1 recognition
      {
        skill: "Importing and exporting data between different database systems and softwares",
        catalogSkill: "Importing and exporting data between different database systems and softwares",
        stem:
          "Letter e) lists “importing and exporting data between different database systems and softwares.” What is the data-movement desk?",
        options: [
          "moving datasets between the systems and softwares the batch needs so each side's data lands whole",
          "rekeying the entire dataset by hand into the target system whenever its formats don't match",
          "emailing whole database files to whichever branch asks without format conversion or checks",
          "declaring the two systems incompatible on sight and posting each a partial manual summary",
        ],
        answer: 0,
        ref: "PSOC 4132 · e] + O*NET data-movement station (lib/fixtures/rowspec/office.ts:193-194)",
        distractorNotes: [
          "Write-up leg: the KEY is the letter's own act — import and export between systems, data landing whole on each side.",
          "Hand rekeying isn't import/export — the movement is between the systems themselves.",
          "Unconverted email pass-throughs are not the movement the letter names — nothing lands whole.",
          "Declaring incompatibility abandons the desk's own row rather than running it.",
        ],
      },
      // Q2 application
      {
        skill: "Importing and exporting data between different database systems and softwares",
        catalogSkill: "Importing and exporting data between different database systems and softwares",
        stem:
          "Finance needs this month's records as CSV; your system exports XLSX, and two columns carry merged text the CSV can't split itself.",
        options: [
          "convert the dataset between the formats, split or remap the merged columns, and verify the exported rows against the source before transfer",
          "export the XLSX file as-is to CSV, transfer it, and let finance's analysts untangle the merged columns",
          "retype the merged columns by hand into the target system's two fields and skip any export of the rest",
          "send finance a screenshot of the XLSX so their team reads the merged columns visually and keys what applies",
        ],
        answer: 0,
        ref: "PSOC 4132 · e] (lib/fixtures/rowspec/office.ts:193)",
        distractorNotes: [
          "Write-up leg: the KEY runs the letter's import-export with the movement verified — formats converted, columns remapped.",
          "As-is export transfers unverified data with merged columns broken downstream of the desk's reach.",
          "Hand retyping abandons the export leg entirely — the letter's row moves data between systems.",
          "Screenshot hand-off is not data movement — finance is left eyeballing and keying your overflow.",
        ],
      },
      // Q3 judgment
      {
        skill: "Importing and exporting data between different database systems and softwares",
        catalogSkill: "Importing and exporting data between different database systems and softwares",
        stem:
          "An incoming batch carries garbled, indecipherable message roles from the sending system's export error.",
        options: [
          "mark the garbled rows in the transfer log, attempt the standard recovery factors, and route what resists to the supervisor",
          "claim the garbled rows as encrypted by design and file them with a security-cleared officer's blessing",
          "delete the garbled rows before transfer so the recovery never faces a visible failure",
          "transfer the garbled rows untouched so the target system's schema silently swallows whatever lands",
        ],
        answer: 0,
        ref: "O*NET 43-9021.00 · “Resolve garbled or indecipherable messages, using cryptographic procedures and equipment” (KEPT anchor, lib/fixtures/rowspec/office.ts:194)",
        distractorNotes: [
          "Write-up leg: the KEY rests on the KEPT cryptographic anchor — garbled messages are resolved on a logged track, not swallowed or deleted.",
          "Calling corruption encryption invents a clearance story no record supports — the anchor's procedures are real, named ones.",
          "Pre-transfer deletion erases the evidence that the sending system's export failed at all.",
          "Untouched transfer into a live schema poisons the target dataset by the desk's own motion.",
        ],
      },
    ],
  },

  {
    skill: "Confidentiality (Etiquette/Professionalism — Enabling)",
    // thin: PSF-only per user Option A 2026-11-05 (NACE-tagged, flagged paraphrase)
    catalogSkill: "Confidentiality (Etiquette/Professionalism — Enabling)",
    items: [
      // Q1 recognition
      {
        skill: "Confidentiality (Etiquette/Professionalism — Enabling)",
        catalogSkill: "Confidentiality (Etiquette/Professionalism — Enabling)",
        stem:
          "The Data Encoder's enabling role tags confidentiality — PII and financial data respect. What does the role ask of every routine batch?",
        options: [
          "handle the batch's personal and financial details inside the access your role carries — and no further",
          "share batch contents freely with teammates since the whole floor keys the same rows anyway",
          "print a personal copy of each interesting batch to keep for the pattern-learning effect",
          "recite sample PII values in team huddles so colleagues learn the queue's texture faster",
        ],
        answer: 0,
        ref: "NACE + RA 10173 context — flagged paraphrase layer (lib/fixtures/rowspec/office.ts:202)",
        distractorNotes: [
          "Write-up leg: the KEY is the row's core — role-scoped access to PII and financial data, nothing beyond it.",
          "Whole-floor sharing breaches the scope line; keying the same rows doesn't erase who owns the access.",
          "Personal print copies extend the data's life outside the role's reach — the row's respect is boundary-first.",
          "Huddle recitals turn PII into office theater — Etiquette's first rule is the records' own dignity.",
        ],
      },
      // Q2 application
      {
        skill: "Confidentiality (Etiquette/Professionalism — Enabling)",
        catalogSkill: "Confidentiality (Etiquette/Professionalism — Enabling)",
        stem:
          "A friend outside work casually asks about a client's salary in a batch you process.",
        options: [
          "decline the question and keep the batch's life inside the role's own access",
          "hint the salary bracket since technically no figure was spoken aloud",
          "forward the client's row so the friend reads it themselves and the desk never says it",
          "share the single number since one figure among thousands amounts to nothing material",
        ],
        answer: 0,
        ref: "NACE + RA 10173 context — flagged paraphrase layer (lib/fixtures/rowspec/office.ts:202)",
        distractorNotes: [
          "Write-up leg: the KEY is the row's standard — a clean decline, with the batch's life kept within role access.",
          "Hints are disclosures by taste — the row's confidentiality doesn't grade itself on phrasing.",
          "Forwarding the file makes the leak the friend's act but the access still yours.",
          "One figure or ten, the client's data is the client's — the row's respect is not fractioned.",
        ],
      },
      // Q3 judgment
      {
        skill: "Confidentiality (Etiquette/Professionalism — Enabling)",
        catalogSkill: "Confidentiality (Etiquette/Professionalism — Enabling)",
        stem:
          "A supervisor asks you to run one batch outside your assigned scope “just for this queue, since the regular encoder's out.”",
        options: [
          "check the access-owner or privacy route before touching the out-of-scope batch — the row's respect outranks one queue's convenience",
          "run it as asked since supervisors outrank scopes always and Sunday substitutes cancel out routine papers",
          "run it but key only the non-PII columns as a compromise between the ask and the scope",
          "run it and then delete the log entries so no record traces the first-ever out-of-scope keying",
        ],
        answer: 0,
        ref: "NACE + RA 10173 context — flagged paraphrase layer (lib/fixtures/rowspec/office.ts:202)",
        distractorNotes: [
          "Write-up leg: the KEY holds the row's line — out-of-scope access runs through its own route first, regardless of rank.",
          "Rank does not itself grant scope; the access-routing decision belongs to the permission's owner.",
          "Partial keying is still out-of-scope handling — non-PII columns ride the same batch's access.",
          "Log deletion after the fact doubles the breach — the row's discipline is the trail, not its erasure.",
        ],
      },
    ],
  },

  // ═══ 5.5 · Counter / Enquiry Clerk (desk) — 6 rows ═══════════════════════
  {
    skill: "Answering inquiries about goods/services/policies (availability, location, price)",
    catalogSkill: "Answering inquiries about goods/services/policies (availability, location, price)",
    items: [
      // Q1 recognition
      {
        skill: "Answering inquiries about goods/services/policies (availability, location, price)",
        catalogSkill: "Answering inquiries about goods/services/policies (availability, location, price)",
        stem:
          "PSOC 4225 letter a) reads “answering inquiries about goods, services and policies, and providing information about their availability, location, price and related issues.” What is the enquiry desk's defining act?",
        options: [
          "answering what is asked about the organization's goods, services, and policies from current information",
          "answering only whichever letters the office keeps printed and mailing the rest to the archive",
          "quoting last year's price list from memory since figures rarely shift between annual prints",
          "routing all inquiries to the website's search bar and closing the conversation there",
        ],
        answer: 0,
        ref: "PSOC 4225 · a] + PSF-CCB corroboration (lib/fixtures/rowspec/office.ts:212-214)",
        distractorNotes: [
          "Write-up leg: the KEY is letter a's own act — answer about goods, services, policies from availability, location, price.",
          "Printed-letters-only service narrows the unit's full enquiry set to one channel of paper.",
          "Memory-priced answers answer a version of the list the office no longer serves.",
          "Search-bar routing sends the enquirer to fend alone — the desk's act is the answer itself.",
        ],
      },
      // Q2 application
      {
        skill: "Answering inquiries about goods/services/policies (availability, location, price)",
        catalogSkill: "Answering inquiries about goods/services/policies (availability, location, price)",
        stem:
          "A caller asks three things about the seminar kit: whether it's available, where to get it, what it costs.",
        options: [
          "answer all three from current service information — availability confirmed, location named, price quoted per the sheet",
          "answer availability only and suggest she phones the venue herself about its own geography",
          "quote last year's prices from memory and spare the sheet-reading, since seminars rarely reprice",
          "say 'just check the website' and end the call before the location or price questions land",
        ],
        answer: 0,
        ref: "PSOC 4225 · a] (lib/fixtures/rowspec/office.ts:212)",
        distractorNotes: [
          "Write-up leg: the KEY carries the letter's own triple — availability, location, price — answered from the information.",
          "Offloading the location leg breaks the inquiry's own arc — the unit provides the information, all of it.",
          "Memory-pricing answers a superseded list — the letter's information comes from what the service says now.",
          "Website deflection skips all three legs the letter a names in one motion.",
        ],
      },
      // Q3 judgment
      {
        skill: "Answering inquiries about goods/services/policies (availability, location, price)",
        catalogSkill: "Answering inquiries about goods/services/policies (availability, location, price)",
        stem:
          "A caller demands the frontline price on a service your information sheet marks 'quoted case-by-case.'",
        options: [
          "say plainly that this service quotes per case, point to who issues the quote, and log that you've routed them",
          "invent a mid-range figure as a courtesy since the caller clearly needs a number of some kind",
          "announce the price is 'whatever the case rules' and hang up before the ambiguity hardens",
          "keep them on the line while ringing every internal desk for a figure nobody owns and read back the noise",
        ],
        answer: 0,
        ref: "PSOC 4225 · a] (lib/fixtures/rowspec/office.ts:212)",
        distractorNotes: [
          "Write-up leg: the KEY answers honestly from what the information says — per-case means the route is the answer.",
          "An invented number is worse than none — the service's own quoting rules exist for that reason.",
          "A hung-up ambiguity is no answer — the letter's scope keeps the enquirer served, even by route.",
          "Cross-desk ringing denies the sheet's own line — the desk answers with the rule, not with chorus noise.",
        ],
      },
    ],
  },

  {
    skill: "Assisting on problems, advice, information (member of the counter service set)",
    catalogSkill: "Assisting on problems, advice, information (member of the counter service set)",
    items: [
      // Q1 recognition
      {
        skill: "Assisting on problems, advice, information (member of the counter service set)",
        catalogSkill: "Assisting on problems, advice, information (member of the counter service set)",
        stem:
          "PSOC 4225 letter b) reads “responding to enquiries about problems and providing advice, information and assistance.” What is the aiding desk's act?",
        options: [
          "taking up where the first answer stops — problems heard, advice given, assistance carried to its handler",
          "hearing the problem once and describing the office's grievance form, then moving the visitor along",
          "answering problems only when they concern literature the counter already prints",
          "soaking in the complaint and promising favors the counter itself has never renewed",
        ],
        answer: 0,
        ref: "PSOC 4225 · b] + PSF-CCB corroboration (lib/fixtures/rowspec/office.ts:222-223)",
        distractorNotes: [
          "Write-up leg: the KEY is letter b's own continuation — respond to the problem-side enquiry and carry its assistance.",
          "Form-only replies stop at paper — the letter expects advice and assistance, not one leaflet's run.",
          "Printed-literature-only scope narrows the letter's problems to the brochure's own inventory.",
          "Promise-flavored service outruns the counter's actual set — the letter's run is assistance within it.",
        ],
      },
      // Q2 application
      {
        skill: "Assisting on problems, advice, information (member of the counter service set)",
        catalogSkill: "Assisting on problems, advice, information (member of the counter service set)",
        stem:
          "A visitor's written dispute about a fee reaches the counter; the finance page sits one floor above and the forms are in your tray.",
        options: [
          "take the problem's details down, offer the visitor the relevant forms and where finance sits, and see the enquiry started",
          "carry the visitor's dispute upstairs yourself and argue the case with the finance director in the corridor",
          "issue a general brochure about fees and see the visitor out with the dispute unspoken of again",
          "say disputes are not counter business and let the visitor requeue wherever they choose next",
        ],
        answer: 0,
        ref: "PSOC 4225 · b] (lib/fixtures/rowspec/office.ts:222)",
        distractorNotes: [
          "Write-up leg: the KEY gives the letter's assistance with its record — details down, advise location and forms, and start it.",
          "Corridor advocacy oversteps the counter's own set — assistance is structured, not personally argued.",
          "Brochure-and-out skips the advice and assistance legs the letter b places on the desk.",
          "'Not counter business' is the exact motion the letter's responding-to-problems leg forbids.",
        ],
      },
      // Q3 judgment
      {
        skill: "Assisting on problems, advice, information (member of the counter service set)",
        catalogSkill: "Assisting on problems, advice, information (member of the counter service set)",
        stem:
          "A regular visitor insists on the counter's help with a form your office does not administer at all.",
        options: [
          "say plainly which office administers the form, hand over the route, and log the enquiry so the visitor's next stop is set",
          "take the form anyway and improvise its processing between queues since decline feels unhelpful",
          "decline and stop at that word so the visitor's trail ends where the counter's own set ends",
          "guess the answer's direction aloud so the visitor leaves with something plausible in hand",
        ],
        answer: 0,
        ref: "PSOC 4225 · b] (lib/fixtures/rowspec/office.ts:222)",
        distractorNotes: [
          "Write-up leg: the KEY assists within truth — the plain route, the logged trail, and no improvised processing.",
          "Improvised processing manufactures assistance the office never administers — the form's own rules eat the guess.",
          "A bare decline is not advice or information — the letter's set extends past the boundary line.",
          "Plausible-sounding guesses are the fastest route to the wrong authority — the desk aids by the real route.",
        ],
      },
    ],
  },

  {
    skill: "Recording information about enquiries and complaints",
    catalogSkill: "Recording information about enquiries and complaints",
    items: [
      // Q1 recognition
      {
        skill: "Recording information about enquiries and complaints",
        catalogSkill: "Recording information about enquiries and complaints",
        stem:
          "PSOC 4225 letter c) reads “recording information about enquiries and complaints,” backed by PSF-CCB's “Record customers' requests accurately and follow-up actions into database system.” What does the desk record?",
        options: [
          "each enquiry's and complaint's who-what-when, with its follow-up action keyed into the system's record",
          "a one-line mood summary per shift — 'calm morning', 'busy noon' — filed by feel at day's end",
          "only complaints that reach formal sanction, since informal grumbles are unrecordable texture",
          "the counter's staffing roster for the day alongside the cadence of each customer's exit greeting",
        ],
        answer: 0,
        ref: "PSOC 4225 · c] + PSF-CCB corroboration (lib/fixtures/rowspec/office.ts:230-231)",
        distractorNotes: [
          "Write-up leg: the KEY joins letter c and the PSF-CCB line — accurate request and complaint records with follow-ups keyed.",
          "Mood summaries record nothing the unit names — the letter's who-what-when is the desk's record.",
          "Complaints-only scope abandons every enquiry the letter's line names in the same breath.",
          "Staffing rosters and exit greetings are workplace trivia, not the letter's enquiry record.",
        ],
      },
      // Q2 application
      {
        skill: "Recording information about enquiries and complaints",
        catalogSkill: "Recording information about enquiries and complaints",
        stem:
          "A caller complains about a delayed license reissue, sounding heated but giving you name, transaction, and the date she called last.",
        options: [
          "calm the line as it runs and key the record — who, transaction, when called, and the follow-up your desk then routes",
          "apologize warmly and skip any record since heated calls rarely return in recognizable shape",
          "hold the details mentally for the follow-up call and write nothing until the matter conveniently resolves",
          "tell the caller the complaint ledger is upstairs and hand her a leaflet with the address there",
        ],
        answer: 0,
        ref: "PSOC 4225 · c] (lib/fixtures/rowspec/office.ts:230)",
        distractorNotes: [
          "Write-up leg: the KEY is the letter's recording leg at its own best — calm service plus the keyed record and follow-up.",
          "Warm apologies without records leave the letter's act entirely undone — the follow-up exists because it's keyed.",
          "Mental holds evaporate — the system's record IS the follow-up's anchor.",
          "Sending her upstairs abandons the recording leg the counter's own set asks for.",
        ],
      },
      // Q3 judgment
      {
        skill: "Recording information about enquiries and complaints",
        catalogSkill: "Recording information about enquiries and complaints",
        stem:
          "A caller asks that his complaint be recorded 'off the books' but advanced to the license desk “as a favor” anyway.",
        options: [
          "decline the off-the-books condition and record the complaint properly — the record IS the route the complaint needs",
          "keep the record blank and verbally signal the license desk since favors travel faster than filed forms",
          "record the complaint under a stock name with today's date so the caller's trail and the record both blur",
          "advance it verbally and write the complaint into the system only after the license desk's reply lands",
        ],
        answer: 0,
        ref: "PSOC 4225 · c] + PSF-CCB “follow-up actions into database system” (lib/fixtures/rowspec/office.ts:230-231)",
        distractorNotes: [
          "Write-up leg: the KEY tests the route itself — a proper record is not the favor's obstacle, it is the favor's mechanism.",
          "Unrecorded verbal signals evaporate; the letter-c trail keeps the complaint alive to the record's own hand.",
          "Stock-named entries blur every trail — a system record that can't point back is no record at all.",
          "Retro-keying after the reply makes the record fiction — the follow-up exists only when recorded upfront.",
        ],
      },
    ],
  },

  {
    skill: "Referring complex enquiries to team leaders or expert advisers",
    catalogSkill: "Referring complex enquiries to team leaders or expert advisers",
    items: [
      // Q1 recognition
      {
        skill: "Referring complex enquiries to team leaders or expert advisers",
        catalogSkill: "Referring complex enquiries to team leaders or expert advisers",
        stem:
          "PSOC 4225 letter d) reads “referring complex enquiries to team leaders or expert advisers,” with PSF-CCB's “Escalate to Subject Matter Expert or Supervisor” behind it. What is the referral desk's pattern?",
        options: [
          "gather the enquiry's details, confirm what you'll do, and refer it to the right leader or expert with the caller's trail intact",
          "pass the enquiry through as an anonymity — a subject number for a person nobody on the next desk knows",
          "escalate everything to leaders so the counter never stands accountable for any single judgment call",
          "hold referrals until the end of each shift so the leaders' calendar never sees more than one batch a day",
        ],
        answer: 0,
        ref: "PSOC 4225 · d] + PSF-CCB corroboration (lib/fixtures/rowspec/office.ts:238-239)",
        distractorNotes: [
          "Write-up leg: the KEY carries letter d's own run — details gathered, right referral, caller's trail preserved.",
          "Anonymous pass-through destroys the caller's trail the desk's own referral pattern keeps.",
          "Everything-escalated evades the counter's first-line answering — the letter's referral is for complex ones.",
          "Batch-held referrals delay every complex enquiry to a shift's tail — the pattern runs on the enquiry's own clock.",
        ],
      },
      // Q2 application
      {
        skill: "Referring complex enquiries to team leaders or expert advisers",
        catalogSkill: "Referring complex enquiries to team leaders or expert advisers",
        stem:
          "A question about document authentication for a visa application stalls you at the desk; the authentication expert sits two floors up.",
        options: [
          "take the caller's details, say you'll confirm, and refer the question to the authentication expert with the caller's contact carried along",
          "answer from a reasonable guess since visas turn on paperwork everyone computes the same way",
          "send the caller to a different government office entirely since authentication feels like its jurisdiction",
          "explain that authentication lies outside the counter's concern and end the enquiry at that word",
        ],
        answer: 0,
        ref: "PSOC 4225 · d] (lib/fixtures/rowspec/office.ts:238)",
        distractorNotes: [
          "Write-up leg: the KEY runs the translate-request-escalate act — details in, confirm-first promise, referral to the expert.",
          "Reasonable-guess answers fail the caller at the mission's own stakes — the referral exists for exactly this.",
          "Other-office sending invents the jurisdiction — the office's own expert, not another agency, is the referral.",
          "'Outside concern' abandons the letter's referral route — the desk's act IS the carrying to the expert.",
        ],
      },
      // Q3 judgment
      {
        skill: "Referring complex enquiries to team leaders or expert advisers",
        catalogSkill: "Referring complex enquiries to team leaders or expert advisers",
        stem:
          "The referral you made yesterday comes back with no answer attached — the expert's office wants more detail than you gathered.",
        options: [
          "ring the caller back for the missing details, complete the referral's own record, and resend it whole to the expert's office",
          "resend the referral verbatim with a note that more detail is the caller's own next burden to carry",
          "decide the inquiry and close it yourself — a referral that touches twice is charity the desk can't afford",
          "let the referral sit until the caller returns on their own, since a returning caller renews the desk's momentum naturally",
        ],
        answer: 0,
        ref: "PSOC 4225 · d] + PSF-CCB “when necessary” band framing (lib/fixtures/rowspec/office.ts:238-239)",
        distractorNotes: [
          "Write-up leg: the KEY keeps the referral alive to its own standard — complete details, then resend whole.",
          "Caller-burden resends the desk's incomplete work as the caller's defect — the referral's record is the desk's own.",
          "Self-deciding after a failed referral is worse than the first guess — the expert exists for the judgment.",
          "Passive waiting abandons the trail the desk started — the referral owns its completion.",
        ],
      },
    ],
  },

  {
    skill: "Issuing forms, information kits and brochures",
    catalogSkill: "Issuing forms, information kits and brochures",
    items: [
      // Q1 recognition
      {
        skill: "Issuing forms, information kits and brochures",
        catalogSkill: "Issuing forms, information kits and brochures",
        stem:
          "PSOC 4225 letter e) reads “issuing relevant forms, information kits and brochures to interested parties.” What is the document-serving act?",
        options: [
          "issuing the current, relevant forms and kits to the parties whose request carries them",
          "issuing whatever version is at hand stacked nearest the counter since the wording rarely shifts",
          "describing each form's contents from memory so fewer sheets leave the counter's tray",
          "keeping the kits in the stockroom's own books and issuing nothing until quantities total a month's use",
        ],
        answer: 0,
        ref: "PSOC 4225 · e] (lib/fixtures/rowspec/office.ts:246)",
        distractorNotes: [
          "Write-up leg: the KEY is the letter's own act — issue relevant, current documents to the parties interested.",
          "Nearest-stacked issuing hands over versions whose currency the desk never examined.",
          "Description-from-memory is not the issuance — the letter names the paper's own hand-over.",
          "Stockroom-holding inventory earns nothing the interested parties' request carries — issuance is the act.",
        ],
      },
      // Q2 application
      {
        skill: "Issuing forms, information kits and brochures",
        catalogSkill: "Issuing forms, information kits and brochures",
        stem:
          "A parent at the window needs the current application form and its requirements list; the tray carries last year's list.",
        options: [
          "issue last year's form with a note that the differences are minor this year, saving the stockroom run",
          "sell the parent a photocopy of last year's form at cost, since the current print is 'temporarily downstairs'",
          "decline to issue anything until the current version's reprint, with no route suggested for the parent's visit",
          "check and issue the current form with its matching requirements kit, printing the current list when the tray's print is stale",
        ],
        answer: 3,
        ref: "PSOC 4225 · e] (lib/fixtures/rowspec/office.ts:246)",
        distractorNotes: [
          "Issuing older versions with a disclaimer passes the currency question to the parent herself.",
          "Charging for photocopies of stale forms is not the letter's issuance and prices the office's own paper.",
          "A bare decline leaves the parent with no route — the letter's issuance includes the party actually served.",
          "Write-up leg: the KEY issues relevant, current documents — the letter's own standard of currency and matching kits.",
        ],
      },
      // Q3 judgment
      {
        skill: "Issuing forms, information kits and brochures",
        catalogSkill: "Issuing forms, information kits and brochures",
        stem:
          "A party requests ten blank copies of a form 'for a seminar,' and your count runs low on a document the counter serves daily.",
        options: [
          "issue what the counter can without breaking its daily serve, and route the remainder through the stock's own replenishing channel",
          "issue all ten and let tomorrow's arrivals manage without — today's request is concrete and in front of you",
          "refuse all ten because low stock is itself proof the party's request outweighs the counter's serving duty",
          "photocopy the party's own blank ten times on the counter's machine so today's stock never moves",
        ],
        answer: 0,
        ref: "PSOC 4225 · e] (lib/fixtures/rowspec/office.ts:246)",
        distractorNotes: [
          "Write-up leg: the KEY balances the issuance with the counter's serving line — partial issue plus the stock's replenishing route.",
          "Full-issue-then-breach starves tomorrow's daily serve — the letter's issuance runs the counter's own line.",
          "Request-size refused outright abandons the issuance act rather than splitting it.",
          "Photocopying blanks manufactures forms outside their issue channel — stock discipline breaks without moving.",
        ],
      },
    ],
  },

  {
    skill: "Communication & professionalism at the corporate front-desk (Enabling)",
    // thin: PSF-only per user Option A 2026-11-05 (PSF-CCB + NACE layer)
    catalogSkill: "Communication & professionalism at the corporate front-desk (Enabling)",
    items: [
      // Q1 recognition
      {
        skill: "Communication & professionalism at the corporate front-desk (Enabling)",
        catalogSkill: "Communication & professionalism at the corporate front-desk (Enabling)",
        stem:
          "The front-desk enabling role carries PSF-CCB behavior language — “Communicate clearly and professionally with customers,” “Demonstrate empathy and understanding.” What is the role's craft?",
        options: [
          "clear, professional, and empathetic communication as the front line of the organization's face",
          "smooth-talking tone techniques that mask whatever the office cannot answer",
          "dictating the office's personal tone to each visitor so the corpus of visits always matches taste",
          "the meeting-after-meeting social chart of who may greet whom, by seniority's own ties",
        ],
        answer: 0,
        ref: "PSF-CCB behavior language + NACE Professionalism (flagged paraphrase) (lib/fixtures/rowspec/office.ts:254)",
        distractorNotes: [
          "Write-up leg: the KEY is the PSF-CCB behavior language itself — clear, professional, empathetic communication.",
          "Tone-as-mask is the craft's opposite — the language's clarity sits in front of the office's answer.",
          "Taste-matching tone to visitor is customization unspoken in the behavior language.",
          "Seniority greeting charts invent hierarchy the enabling row never carries.",
        ],
      },
      // Q2 application
      {
        skill: "Communication & professionalism at the corporate front-desk (Enabling)",
        catalogSkill: "Communication & professionalism at the corporate front-desk (Enabling)",
        stem:
          "An executive visitor is visibly frustrated and arrives unannounced while you're mid-task.",
        options: [
          "keep typing until the task closes and acknowledge the visitor only after the screen's full reset",
          "greet them, acknowledge the frustration, and bring the right contact in promptly",
          "state the wanted person is in a meeting and wave them toward the lift",
          "match their frustration's energy so they read the visit as taken seriously by the office",
        ],
        answer: 1,
        ref: "PSF-CCB behavior language (lib/fixtures/rowspec/office.ts:254)",
        distractorNotes: [
          "Screen-first service inverts the row's very first act — the greeting precedes the task's tail.",
          "Write-up leg: the KEY carries the behavior language all at once — greet, acknowledge, connect promptly.",
          "Wave-to-lift direction is neither greet nor empathy — the visit deserves the office's own face.",
          "Frustration-matching abandons professionalism precisely when the desk's tone carries it.",
        ],
      },
      // Q3 judgment
      {
        skill: "Communication & professionalism at the corporate front-desk (Enabling)",
        catalogSkill: "Communication & professionalism at the corporate front-desk (Enabling)",
        stem:
          "A visitor demands an exception the counter cannot grant, raising their voice; the waiting area's other visitors are listening.",
        options: [
          "move the exchange aside, restate what the counter can grant, and route the exception's ask through the office's own channel",
          "grant the exception quietly so the waiting room's calm is restored and no escalation ever needed",
          "raise your own voice in return so the room learns the counter's edge has defended itself",
          "close the window entirely and declare the counter's day 'paused until further notice' at 11 a.m.",
        ],
        answer: 0,
        ref: "PSF-CCB behavior language + NACE Professionalism (flagged paraphrase) (lib/fixtures/rowspec/office.ts:254)",
        distractorNotes: [
          "Write-up leg: the KEY pairs empathy with the office's own limits — calm the setting, restate the grant, route the exception.",
          "A counter-granted exception is authority the desk doesn't hold — the room's calm isn't bought with rules.",
          "Raised voices unmake the behavior language the row's own scope carries.",
          "Pausing a desk's day over one dispute abandons every waiting visitor the room still holds.",
        ],
      },
    ],
  },

  // ═══ E2 · Executive Secretary (execsec) — 17 rows ════════════════════════
  {
    skill: "Executive schedule & calendar management",
    catalogSkill: "Executive schedule & calendar management",
    items: [
      // Q1 recognition
      {
        skill: "Executive schedule & calendar management",
        catalogSkill: "Executive schedule & calendar management",
        stem:
          "O*NET's role lists “Manage and maintain executives' schedules,” with PSOC 3343 letter c) “screening requests for meetings, scheduling and organizing meetings and travel arrangements.” What fills the calendar desk?",
        options: [
          "screening meeting requests against the calendar, keeping one sound schedule, and organizing what's set",
          "accepting every request as it lands and letting the executive reconcile the collisions personally",
          "maintaining a private notes-only calendar that never syncs to the office's shared one",
          "blocking the whole week with 'busy' placeholders so requests queue in respect of the wall",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · schedules task + PSOC 3343 · c] (lib/fixtures/rowspec/office.ts:263-264)",
        distractorNotes: [
          "Write-up leg: the KEY joins the anchor and the PSOC letter — screen, schedule, organize on one maintained calendar.",
          "Collision-later acceptance strips the screening leg letter c) names — calendar's core act.",
          "A private unsynced calendar abandons the office's scheduling from the shared source.",
          "'Busy'-walls defer decisions rather than making them — the desk's hold is the screening itself.",
        ],
      },
      // Q2 application
      {
        skill: "Executive schedule & calendar management",
        catalogSkill: "Executive schedule & calendar management",
        stem:
          "Two department heads request the same Tuesday slot with your executive; a board call already sits at 3 p.m.",
        options: [
          "give the slot to the first filer with a calendar note and offer real alternatives to the second",
          "accept both requesters and let the executive untangle the collision after arrival",
          "cancel the board call so both requesters take Tuesday's slot and the 3 p.m. clears",
          "decline both until the executive returns from leave and can referee the pair in person",
        ],
        answer: 0,
        ref: "PSOC 3343 · c] (lib/fixtures/rowspec/office.ts:264)",
        distractorNotes: [
          "Write-up leg: the KEY is the screening act letter c) prints — calendar-checked, one placed, alternatives offered.",
          "Double-accepting passes the screen entirely — the collision becomes the calendar's own fallout.",
          "Canceling a board call to serve two requests exceeds the desk's call entirely.",
          "Voiding both slots stalls the schedule the anchor's desk maintains.",
        ],
      },
      // Q3 judgment
      {
        skill: "Executive schedule & calendar management",
        catalogSkill: "Executive schedule & calendar management",
        stem:
          "The executive, en route to Friday's board call, sends a message: “quietly move my 2 p.m. meetings to next week until Thursday's results land.”",
        options: [
          "reschedule the week's follow-ons with brief, message-based notifications to each affected party — no reasons named, dates confirmed",
          "reschedule nothing and tell each affected party only that the executive is 'hard to reach' until further notice",
          "publish the executive's medical-adjacent reason in the rescheduling notice so nobody speculates",
          "move every meeting to 'TBD' and let each department's own assistant chase the new dates sight unseen",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · schedules task (lib/fixtures/rowspec/office.ts:263)",
        distractorNotes: [
          "Write-up leg: the KEY maintains the schedule the anchor owns — quiet implies discreet, not uncommunicated.",
          "Vague unreachability leaves every partner's desk guessing — maintained schedules keep dates moving.",
          "Publishing a private reason breaches the very discretion the executive's message asks to keep.",
          "TBD-limbo surrenders the maintained schedule to each department's own chaos.",
        ],
      },
    ],
  },

  {
    skill: "Correspondence & document production",
    catalogSkill: "Correspondence & document production",
    items: [
      // Q1 recognition
      {
        skill: "Correspondence & document production",
        catalogSkill: "Correspondence & document production",
        stem:
          "O*NET's lines: “Prepare invoices, reports, memos, letters, financial statements, and other documents, using word processing, spreadsheet, database, or presentation software” alongside “Prepare responses to correspondence containing routine inquiries.” PSOC 3343 letter f) adds “writing and answering business or technical letters.” What fills the desk?",
        options: [
          "the office's written output — prepared in the supporting software and answered on the office's route",
          "the office's printed archive's PDF-compression and the filing room's paper stock rotation",
          "the executive's personal email triage held inside their private account and never the office's",
          "the composing of each document's typography fonts ahead of whatever the templates carry",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · correspondence tasks + PSOC 3343 · f] (lib/fixtures/rowspec/office.ts:271-272)",
        distractorNotes: [
          "Write-up leg: the KEY spans O*NET's prepare-respond run plus PSOC's writing/answering letters leg.",
          "PDF compression is storage-side work, not the preparing-and-answering desk the anchors name.",
          "Private-account triage is owned correspondence, not the office's own route — the anchors name documents for the office.",
          "Font-composing is styling trivia; the anchors' lines are content production with software.",
        ],
      },
      // Q2 application
      {
        skill: "Correspondence & document production",
        catalogSkill: "Correspondence & document production",
        stem:
          "A memo, a client letter, and a slide deck are all due tomorrow; the client letter carries one placeholder bracket still unfilled.",
        options: [
          "produce the memo and deck first and leave the client letter's placeholder to tomorrow's send, however it lands",
          "produce all three and clear the client letter's bracket to the office's standard — accurate, finished, dispatched",
          "produce only the client letter since that's the one carrying a due weight of its own and let the rest slip",
          "hand every batch, uncertained, to an intern's machine tonight and never look at the output again",
        ],
        answer: 1,
        ref: "O*NET 43-6011.00 · correspondence tasks (lib/fixtures/rowspec/office.ts:271)",
        distractorNotes: [
          "Leaving a placeholder to send is the anchor's failure to prepare the document — brackets are not finished output.",
          "Write-up leg: the KEY runs the anchor's prepare act across all three documents to the standard that dispatches.",
          "The rest slipping penalizes one document's priority at the expense of the desk's whole run.",
          "Handing off the batch with no verification abandons the desk's own output quality.",
        ],
      },
      // Q3 judgment
      {
        skill: "Correspondence & document production",
        catalogSkill: "Correspondence & document production",
        stem:
          "A routine-inquiry letter arrives asking what the executive already promised verbally at lunch — a commitment with no paper behind it.",
        options: [
          "draft the response from the office's own stated terms, flag the verbal commitment's status to the executive, and route it for screen",
          "draft the response matching the spoken promise exactly, since the executive's word at lunch outranks the written terms",
          "hold the reply until the meeting's own minutes surface — the liaison decides, then the desk answers",
          "reply that 'the office is currently reconsidering' so no position is locked while no paper exists",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · “Prepare responses to correspondence containing routine inquiries” (lib/fixtures/rowspec/office.ts:271)",
        distractorNotes: [
          "Write-up leg: the KEY prepares the response on the record's basis and surfaces the verbal commitment's gap to the executive.",
          "Verbal-only phrasing asks the office to stand behind what no paper yet holds — the desk flags before it locks.",
          "Waiting for minutes inverts the routine-response desk's own routing.",
          "'Reconsidering' replies dodge the routine line — the desk responds on the record, or escalates the gap.",
        ],
      },
    ],
  },

  {
    skill: "Meeting administration & minutes",
    catalogSkill: "Meeting administration & minutes",
    items: [
      // Q1 recognition
      {
        skill: "Meeting administration & minutes",
        catalogSkill: "Meeting administration & minutes",
        stem:
          "O*NET's role: “Prepare agendas and make arrangements… for committee, board, and other meetings,” alongside “Attend meetings to record minutes,” and “Compile, transcribe, and distribute minutes of meetings.” What does the desk run?",
        options: [
          "the meeting's whole paperwork line — agenda arranged, minutes recorded, then compiled and distributed",
          "the catering arrangements alone, with the agenda and minutes left for each department's own lead",
          "attending to say the minutes' words aloud at the record's reading, without any written check",
          "setting up the meeting room's chairs and projector hardware before whoever writes the minutes arrives",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · meeting tasks (lib/fixtures/rowspec/office.ts:279)",
        distractorNotes: [
          "Write-up leg: the KEY carries the anchor's full run — agenda, arrange, record, compile/transcribe, distribute.",
          "Catering-only scope drops three of the anchor's four verbs — agenda and minutes stay with the desk.",
          "Spoken-word minutes without written check contradicts the anchor's compile-transcribe-distribute.",
          "Room setup is arrangements' husk — the anchors' minutes chain is the desk's real run.",
        ],
      },
      // Q2 application
      {
        skill: "Meeting administration & minutes",
        catalogSkill: "Meeting administration & minutes",
        stem:
          "The Thursday committee convenes; you have the agenda set, and three action items surface mid-discussion nobody wrote down.",
        options: [
          "record the action items in the meeting's own minutes, compile and distribute them as part of the record's close",
          "let the action items ride each owner's memory and keep the minutes to what the agenda's own topics settled",
          "leave the agenda's running unchanged and append nothing after the fact — mid-meeting acquisitions belong outside",
          "stop the meeting and hold up every next item until someone signs the three action lines aloud",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · “Attend meetings to record minutes” (lib/fixtures/rowspec/office.ts:279)",
        distractorNotes: [
          "Write-up leg: the KEY runs the anchor's recording act — mid-discussion actions belong inside the record itself.",
          "Memory-borne action items disappear at the agenda's edge — the anchor's minutes chain carries them.",
          "Post-agenda exclusion is a self-drawn line the anchor's minutes never recognizes.",
          "Halting the meeting for signatures corrupts the recording with the desk's own procedure.",
        ],
      },
      // Q3 judgment
      {
        skill: "Meeting administration & minutes",
        catalogSkill: "Meeting administration & minutes",
        stem:
          "An executive objects after distribution: the minutes quote a “final agreement” she says was explicitly left open.",
        options: [
          "hold the next distribution, check what the recording and the day's notes say, and settle the open point's phrasing with the executive's own read before recirculation",
          "reprint with the executive's phrasing alone, since she outranks the day's own record and the rest of the committee will adjust",
          "recirculate with the disputed sentence marked 'under objection' but its original wording intact",
          "delete the sentence entirely so the minutes carry nothing the objector disputes and the record stays silent on it",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · minutes tasks (lib/fixtures/rowspec/office.ts:279)",
        distractorNotes: [
          "Write-up leg: the KEY settles the recording's own truth — notes first, phrasing settled, then recirculated with the record whole.",
          "Reprinting on executive preference alone bends the minutes to rank — the record, not the rank, carries the wording.",
          "'Under objection' stamps don't fix wording — the anchor's compile-and-distribute expects a settled record.",
          "Silent deletion erases the day's own open-matter evidence the minutes exist to hold.",
        ],
      },
    ],
  },

  {
    skill: "Information gatekeeping: calls & visitors",
    catalogSkill: "Information gatekeeping: calls & visitors",
    items: [
      // Q1 recognition
      {
        skill: "Information gatekeeping: calls & visitors",
        catalogSkill: "Information gatekeeping: calls & visitors",
        stem:
          "O*NET's lines: “Answer phone calls and direct calls to appropriate parties or take messages,” alongside “Greet visitors and determine whether they should be given access to specific individuals.” What fills the gatekeeping desk?",
        options: [
          "the office's front-line judgment — every call routed or taken, every visitor greeted and decided on access",
          "the reception area's hospitality tea, chair rotation, and reading materials' subscription renewals",
          "the full directory's maintenance — the names, titles, and numbers of the whole floor's staff",
          "hold the calls log's legality review for the office's yearly audit and accessец clearances",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · gatekeeping tasks (lib/fixtures/rowspec/office.ts:287)",
        distractorNotes: [
          "Write-up leg: the KEY is the anchor's dual scope — calls answered/directed and visitors greeted/decided.",
          "Hospitality upkeep is adjacent comfort, not the desk's answering-and-judging act.",
          "Directory maintenance belongs to record rows — gatekeeping decides access, not who's listed.",
          "Log review is an audit act the gatekeeping desk bears no part of in the anchors' text.",
        ],
      },
      // Q2 application
      {
        skill: "Information gatekeeping: calls & visitors",
        catalogSkill: "Information gatekeeping: calls & visitors",
        stem:
          "A caller insists on speaking to the director 'right now' about an unverified offering, while a visitor waits claiming a 2 p.m. appointment that isn't on the calendar.",
        options: [
          "screen the call's claim against the office's knowledge, take the message if it can't be verified, and check the visitor's claim against the actual 2 p.m. before seating anyone",
          "patch both straight through — screening feels rude and the calendar's silence is mostly software lag",
          "hang up on the caller as a scam precaution and send the visitor to the security desk for the unverified appointment",
          "read out the director's mobile number to end the caller's pressure and ask the visitor to rebook for whenever the executive resurfaces",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · gatekeeping tasks (lib/fixtures/rowspec/office.ts:287)",
        distractorNotes: [
          "Write-up leg: the KEY runs both anchors' lines — verify and screen each claim against the office's own facts before routing or seating.",
          "Straight-through access abandons the rating on “whether they should be given access” — the anchor's exact judgment.",
          "Hanging up is neither answering nor directing — the anchor's route runs through the office's fact check first.",
          "Reading the mobile number leaks the access the anchor exists to decide.",
        ],
      },
      // Q3 judgment
      {
        skill: "Information gatekeeping: calls & visitors",
        catalogSkill: "Information gatekeeping: calls & visitors",
        stem:
          "An old partner of the executive arrives unannounced, expecting a walk-in slot every prior visit received — two meetings run after this one.",
        options: [
          "greet the partner warmly, explain the day's full schedule honestly, and offer a call-back or the next available window with a note for the executive",
          "squeeze the partner into the next gap anyway — two meetings sliding ten minutes each is a cost nobody will trace",
          "turn the partner away without a word about the schedule — history should teach them to call ahead next time",
          "announce the 'no unannounced visits' rule newly enforced and post it where arriving partners will read it for themselves",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · “Greet visitors and determine whether they should be given access…” (lib/fixtures/rowspec/office.ts:287)",
        distractorNotes: [
          "Write-up leg: the KEY holds the gatekeeping decision with warmth and the schedule's own integrity intact.",
          "Squeezing-in surrenders the anchor's access judgment — the calendar's cost lands on two later meetings.",
          "Wordless turn-away answers neither anchor's greet leg nor the visitor's own determination.",
          "A posted rule never explains to a partner's face — the desk's judgment is where the decision lives.",
        ],
      },
    ],
  },

  {
    skill: "Research & briefing support for executives",
    catalogSkill: "Research & briefing support for executives",
    items: [
      // Q1 recognition
      {
        skill: "Research & briefing support for executives",
        catalogSkill: "Research & briefing support for executives",
        stem:
          "O*NET's line: “Conduct research, compile data, and prepare papers for consideration and presentation by executives, committees, and boards of directors.” What fills the briefing desk?",
        options: [
          "dig out the information, compile it, and shape papers the decision-makers can take straight into their meetings",
          "print each search result's whole page so the executive sees exactly what the web served, in order",
          "carry the executive asking a junior analyst's afternoon to re-run whatever research the brief's topic names",
          "keep a folder of everything found, labeled by date, with no compiled shape a reader can take",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · research task (lib/fixtures/rowspec/office.ts:294)",
        distractorNotes: [
          "Write-up leg: the KEY is the anchor's three-run — research, compile, prepare papers for consideration.",
          "Raw search dumps are uncompiled — the anchor's middle leg is the desk's whole craft.",
          "Handing research onward removes the preparing leg — the desk's papers are the deliverable.",
          "Folders-as-deliverable skip the compile-and-prepare acts the anchor's line prints.",
        ],
      },
      // Q2 application
      {
        skill: "Research & briefing support for executives",
        catalogSkill: "Research & briefing support for executives",
        stem:
          "Your executive speaks at Friday's partner forum; the topic's facts, figures, and counter-risks all need shaping by Thursday.",
        options: [
          "print the first hundred results and pack them into the conference bag for the executive's plane reading",
          "write a thirty-page essay showing the topic's breadth and the risks' full texture in one bound book",
          "compile the sources and distill the key facts and risks into a brief the executive can scan before the forum",
          "prepare nothing — the executive's own grip on the topic is what earned the invitation at all",
        ],
        answer: 2,
        ref: "O*NET 43-6011.00 · research task (lib/fixtures/rowspec/office.ts:294)",
        distractorNotes: [
          "Hundred-result packs are uncompiled source noise — the anchor's compile-and-prepare legs are what's absent.",          "Thirty-page essays ask the forum's reader to do the distilling — the anchor's papers are prepared, not assigned.",
          "Write-up leg: the KEY runs the anchor's line to its end-use — compiled data shaped into scannable briefing papers.",
          "Unprepared briefings abandon the anchor's task — support for consideration means papers exist first.",
        ],
      },
      // Q3 judgment
      {
        skill: "Research & briefing support for executives",
        catalogSkill: "Research & briefing support for executives",
        stem:
          "Two sources disagree on the market figure your brief carries — one a trade body's re-publication, one the regulator's own page.",
        options: [
          "use the regulator's figure and note the trade body's divergence in a footnote the executive can dismiss on read",
          "carry both figures side by side unmarked so the brief's reader picks whichever suits their own point best",
          "average the two figures and present the result as the market's settled number",
          "drop the figure entirely, replacing it with the phrase 'sources differ, see attached' and nothing further",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · research task (lib/fixtures/rowspec/office.ts:294)",
        distractorNotes: [
          "Write-up leg: the KEY compiles with judgment — the stronger source carried, the divergence footnoted for the reader's call.",
          "Unmarked side-by-side shifts the compile work onto the meeting's minutes — the desk's papers are prepared to decide.",
          "Fabricated averages aren't compilation — neither source ever said ₱8.33, so the brief's own line loses ground.",
          "Dropping the figure removes the brief's own point — the desk's preparation should carry the fact, footnoted.",
        ],
      },
    ],
  },

  {
    skill: "Incoming-material triage & distribution",
    catalogSkill: "Incoming-material triage & distribution",
    items: [
      // Q1 recognition
      {
        skill: "Incoming-material triage & distribution",
        catalogSkill: "Incoming-material triage & distribution",
        stem:
          "O*NET's lines: “Read and analyze incoming memos, submissions, and reports to determine their significance and plan their distribution,” alongside “Open, sort, and distribute incoming correspondence.” PSOC 3343 letter b) adds “obtaining, proposing and monitoring deadlines and follow-up dates.” What does the triage desk hold?",
        options: [
          "reading what comes in, judging each item's weight, and routing it — with the deadlines monitored follow-up-wise",
          "distributing every incoming item to everyone on a fixed list so no one is ever missed or left out",
          "sorting strictly by sender surname's alphabetical order and reading only whatever reaches your desk",
          "holding all incoming material behind a single weekly distribution meeting for the office's shared read",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · triage tasks + PSOC 3343 · b] (lib/fixtures/rowspec/office.ts:301-302)",
        distractorNotes: [
          "Write-up leg: the KEY joins O*NET's read-analyze-plan-distribute and PSOC's deadline-monitoring leg.",
          "Distribute-everything skips the judgment the anchor's determine-significance line carries.",
          "Surname sorting answers no significance — the anchor's analysis, not the alphabet, decides the route.",
          "Weekly holding freezes time-sensitive items behind a schedule no deadline respects.",
        ],
      },
      // Q2 application
      {
        skill: "Incoming-material triage & distribution",
        catalogSkill: "Incoming-material triage & distribution",
        stem:
          "The morning's inbox holds a regulatory notice with a five-day reply window, advertising mail, and a complaint letter naming a specific staff member.",
        options: [
          "read all three, flag the regulatory notice's window to its responsible desk, and route the complaint to its owning line",
          "forward all three to the executive's inbox so nothing arrives anywhere but the top and one desk can decide everything",
          "sort all three by surname and announce the week's pending reads at Friday's distribution meeting",
          "reply to the complaint and the notice both yourself, since your desk's dark hours are quietest for the drafting",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · triage tasks + PSOC 3343 · b] (lib/fixtures/rowspec/office.ts:301-302)",
        distractorNotes: [
          "Write-up leg: the KEY runs the anchor's read-judge-route — significance finds its owner, windows get tracked.",
          "Top-of-house forwarding ignores every deadline the anchor's route marks for the responsible desk.",
          "Surname sorting and Friday reads delay both the five-day reply window and the complaint's own owner.",
          "Drafting the office's regulatory reply yourself exceeds the distributive act the anchor's line names.",
        ],
      },
      // Q3 judgment
      {
        skill: "Incoming-material triage & distribution",
        catalogSkill: "Incoming-material triage & distribution",
        stem:
          "A regulatory notice's five-day window was discovered on day three, misfiled on day one by a colleague's sort. The reply must go out.",
        options: [
          "route the notice's reply need at once to its responsible desk with the two days' loss named, and fix the sort's route so the next window never buries itself",
          "blame the colleague's sort in an office-wide email, so the loss is on record with the correct person's name attached",
          "draft the regulatory reply yourself in one evening, and let the colleague's sort stay unremarked as absolution",
          "hold the finding until the next distribution meeting so the office sees the lapse inside its weekly reading",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · triage tasks (lib/fixtures/rowspec/office.ts:301)",
        distractorNotes: [
          "Write-up leg: the KEY balances the route's urgency against the sort's failure — the reply need goes at once, the route corrected.",
          "Name-and-blame broadcasting adds a colleague's public stain before the desk's own sort failure is fixed.",
          "Self-drafting the regulatory reply fixes one window and leaves the sorting route's silence intact.",
          "Weekly-holding the lapse re-loses two urgent days into the schedule the anchor's desk owns.",
        ],
      },
    ],
  },

  {
    skill: "Office services coordination",
    catalogSkill: "Office services coordination",
    items: [
      // Q1 recognition
      {
        skill: "Office services coordination",
        catalogSkill: "Office services coordination",
        stem:
          "O*NET's line: “Coordinate and direct office services, such as records, departmental finances, budget preparation, personnel issues, and housekeeping, to aid executives.” PSOC 3343 letter d) adds “assisting in the preparation of budgets, monitoring of expenditures, drafting of contracts and purchasing or acquisition orders.” What fills the coordinating desk?",
        options: [
          "line up the services each executive's office needs — records, budgets, housekeeping, personnel — and hold their threads together",
          "running each service personally from your own desk so no line ever needs coordination among the departments' leads",
          "coordinate nothing — each service's own department self-runs and you summarize only whatever someone else decides",
          "purchasing every office need yourself as the day's own convenience dictates, with no budget's questioning of each item",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · coordination task + PSOC 3343 · d] (lib/fixtures/rowspec/office.ts:309-310)",
        distractorNotes: [
          "Write-up leg: the KEY is the anchor's coordinating verb pair — coordinate and direct across the service set.",
          "Solo-running each service abandons the coordination — the anchor's thread-holding is the desk's own act.",
          "No-coordination runs are the exact opposite of the task's own verb pair — services that self-run leave no role for the desk.",
          "Unbudgeted purchasing strips the expenditure monitoring letter d) attaches to the same desk.",
        ],
      },
      // Q2 application
      {
        skill: "Office services coordination",
        catalogSkill: "Office services coordination",
        stem:
          "A records cleanup, next quarter's supply budget, and a broken conference-room door land on this week — none yours to execute.",
        options: [
          "do the door only — budgets are accounting's problem and cleanup waits for its own owner",
          "escalate all three to the executive's calendar and resume only whatever the meeting's minutes return to your desk",
          "line up each item's owning party, set the week's follow-up dates, and track all three to their landings",
          "take the easiest item and drop the other two silently, mentioning only the door's success in Friday's summary",
        ],
        answer: 2,
        ref: "PSOC 3343 · d] (lib/fixtures/rowspec/office.ts:310)",
        distractorNotes: [
          "Door-only coordination drops the records and budget legs the anchor's service set names outright.",
          "Executive-calendar dumps surrender the coordinate-and-direct verbs — the desk holds the threads.",
          "Write-up leg: the KEY runs the anchor's line — coordinate services, monitor timelines, track to completion.",
          "Silent drops remove the budget and cleanup from every tracking line the desk serves.",
        ],
      },
      // Q3 judgment
      {
        skill: "Office services coordination",
        catalogSkill: "Office services coordination",
        stem:
          "The housekeeping vendor's latest invoice sits ₱40,000 above the contract's quoted rate, and the replenishing stock runs out tomorrow.",
        options: [
          "hold the invoice against the contract's rate, route the discrepancy to whoever owns the contract, and secure tomorrow's stock through the purchasing route that letter d) covers",
          "pay the invoice in full first and trace the rate discrepancy after the vendor's payment clears, since tomorrow's stock depends on the vendor's good grace",
          "withhold both the payment and the stock, since a rate discrepancy outlasts one day's staple reorder",
          "split the invoice — pay the amount the contract carries and refuse the ₱40,000 remainder without any note to either side",
        ],
        answer: 0,
        ref: "PSOC 3343 · d] + O*NET coordination task (lib/fixtures/rowspec/office.ts:309-310)",
        distractorNotes: [
          "Write-up leg: the KEY runs both the anchor's pair — services coordinated and expenditures monitored — without breaking either.",
          "Paying-then-tracing hands the office's money to a rate the contract never carries — the monitor acts first.",
          "Withholding stock turns the discrepancy into tomorrow's office-wide failure — the purchasing route keeps services whole.",
          "Silent refusing leaves both sides without the rate conversation — the route is for the desk's own record to carry.",
        ],
      },
    ],
  },

  {
    skill: "Travel arrangements",
    catalogSkill: "Travel arrangements",
    items: [
      // Q1 recognition
      {
        skill: "Travel arrangements",
        catalogSkill: "Travel arrangements",
        stem:
          "O*NET's line: “Make travel arrangements for executives.” PSOC 3343 letter c) folds it into “scheduling and organizing meetings and travel arrangements.” What fills the travel desk?",
        options: [
          "arranging the whole trip — movement, lodging, and the meetings' own fit around both — end to end",
          "booking the flights alone, since lodging and itineraries belong to whichever cost center books them",
          "picking the cheapest flights regardless of the meeting times they strand on arrival or return",
          "sending the airline website's link to the executive and letting the executive's personal hours handle the rest",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · travel task + PSOC 3343 · c] (lib/fixtures/rowspec/office.ts:316, 264)",
        distractorNotes: [
          "Write-up leg: the KEY is the anchor's arranging act — the trip, end to end, with the meeting's own place in it.",
          "Flights-only scope drops the lodging and meeting-fit legs the arranging act normally carries.",
          "Stranded-arrival bookings contradict the scheduling leg PSOC letter c) holds beside travel.",
          "Link-only service defers the desk's arranging work to the executive's commute hours.",
        ],
      },
      // Q2 application
      {
        skill: "Travel arrangements",
        catalogSkill: "Travel arrangements",
        stem:
          "Your executive flies out for a two-city client visit Monday; a Tuesday client dinner's venue carries no booking yet.",
        options: [
          "arrange flights, hotels, transfers, and the itinerary sheet — and book the Tuesday dinner's table while the trip is still yours to shape",
          "arrange all transport and lodging and leave the dinner's venue to a colleague's late-hour initiative",
          "book the two cities' flights on whichever route is cheapest and let the meetings' timings adjust themselves around the flights",
          "hold all bookings until the executive confirms personal dates, and send only a list of flight possibilities to read over the weekend",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · travel task (lib/fixtures/rowspec/office.ts:316)",
        distractorNotes: [
          "Write-up leg: the KEY arranges the trip end to end — movement, lodging, itinerary, and the dinner's place in it.",
          "Venue-removal passes the trip's crack where the arranging desk's own reach should close it.",
          "Cheapest-route booking strands the meetings — the arrangement must carry the itinerary, not vice versa.",
          "Possibility-lists are not arrangements — the desk's act is the trip itself, booked and set.",
        ],
      },
      // Q3 judgment
      {
        skill: "Travel arrangements",
        catalogSkill: "Travel arrangements",
        stem:
          "The executive's own flight preference — an airline whose loyalty seat upgrades — runs ₱18,000 above the office's travel-policy rate, and two alternatives land 40 minutes earlier.",
        options: [
          "book per the policy's rate on the earlier-landing alternative, and surface the preference-gap to the executive before anything is finalized",
          "book the preferred airline regardless of policy, since executive preferences have carried the office's arrangements before without any note needed",
          "book the preferred airline secretly against policy and hope the finance desk's review mistakes the fare difference for a season-rate one",
          "delay the booking until the Monday morning so the executive's own final word is on hand when the reservation's button reads",
        ],
        answer: 0,
        ref: "PSOC 3343 · c] + O*NET travel task (lib/fixtures/rowspec/office.ts:316, 264)",
        distractorNotes: [
          "Write-up leg: the KEY runs the arranging desk's own line — policy respected, preference escalated, trip still made.",
          "Preference-over-policy booking is the arranging desk's quiet budget breach — the gap's surfacing is the route first.",
          "Secret postings and fabricated fare stories are the desk's own ledger failure in one booking.",
          "Delaying the booking to Monday surrenders the trip's own preparation to the departure's morning.",
        ],
      },
    ],
  },

  {
    skill: "Records & document filing/retrieval",
    catalogSkill: "Records & document filing/retrieval",
    items: [
      // Q1 recognition
      {
        skill: "Records & document filing/retrieval",
        catalogSkill: "Records & document filing/retrieval",
        stem:
          "O*NET's line: “File and retrieve corporate documents, records, and reports.” What fills the filing desk?",
        options: [
          "keeping the corporate files complete and retrievable — every document filed to scheme, every request filled fast",
          "archiving last year's boxes in the storeroom's ceiling crawlspace where retrieval never returns",
          "emailing each file's table of contents to the requester instead of the document itself",
          "holding one master PDF of everything, rebuilt from scanned pages whenever a file is requested",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · file/retrieve task (lib/fixtures/rowspec/office.ts:321)",
        distractorNotes: [
          "Write-up leg: the KEY is the anchor's pair act — file to scheme, retrieve on the request's own clock.",
          "Ceiling crawlspace archives defeat retrieve — the anchor's verb pair runs both ways.",
          "Contents-mailed instead of the document is not retrieval — the request's own paper is the deliverable.",
          "A rebuilt master slide-of-pages is fabrication-flavored archiving, not filing.",
        ],
      },
      // Q2 application
      {
        skill: "Records & document filing/retrieval",
        catalogSkill: "Records & document filing/retrieval",
        stem:
          "Auditors request five named contracts from the past two years, and the shared drive's contract folder has drifted across three schemes in that time.",
        options: [
          "retrieve each named contract via whichever scheme's drift-marker still maps it, and flag the folder's scheme drift for a cleanup row",
          "tell the auditors the contracts aged into a pre-revision scheme and send back only whichever two the drive can still open",
          "rebuild the five contracts from email threads since the files are a mess and rebuilding is the honest reconstruction",
          "send the auditors the entire archive's download and let their team search it themselves on their own time",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · file/retrieve task (lib/fixtures/rowspec/office.ts:321)",
        distractorNotes: [
          "Write-up leg: the KEY runs the anchor's retrieval — each named contract found — plus the honest cleanup flag for the drift.",
          "Named retrieval means five documents, not a subset the drive prefers to serve.",
          "Email-thread reconstruction is fabrication-adjacent — the anchor's retrieval works on the filed originals.",
          "Whole-archive dumping hands retrieval to the auditors — the filing desk's own deliverable comes back whole.",
        ],
      },
      // Q3 judgment
      {
        skill: "Records & document filing/retrieval",
        catalogSkill: "Records & document filing/retrieval",
        stem:
          "A director's assistant walks out with a personnel folder, no sign-out made, and the director's calendar places her in a hearing all afternoon.",
        options: [
          "log the removal in the records' own trail — what was taken, by whom, and when — and note the return pending on the hearing's close",
          "swap in a look-alike folder so the shelf's facing stays balanced and nobody's afternoon is interrupted by a records query",
          "strike the folder's index entry permanently since filings that leave the building no longer belong to the record's count",
          "send an office-wide email naming the assistant and the folder so the trail's integrity is broadcast for everyone's benefit",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · file/retrieve task (lib/fixtures/rowspec/office.ts:321)",
        distractorNotes: [
          "Write-up leg: the KEY keeps the trail the anchor's filing act owns — removal logged, return pending, no theater.",
          "Look-alike folders rewrite the shelf's own evidence — the record's integrity is the desk's face.",
          "Striking entries erases the removal from the file's own count — the record's whole purpose is the trail.",
          "Name-and-shame broadcasting outruns the trail's purpose — the record answers, not the office-wide email.",
        ],
      },
    ],
  },

  {
    skill: "General office duties & tools",
    catalogSkill: "General office duties & tools",
    items: [
      // Q1 recognition
      {
        skill: "General office duties & tools",
        catalogSkill: "General office duties & tools",
        stem:
          "O*NET's line: “Perform general office duties, such as ordering supplies, maintaining records management database systems, and performing basic bookkeeping work.” What fills the upkeep desk?",
        options: [
          "the ordinary rounds — supplies ordered, record systems maintained, and the basic bookkeeping worked",
          "the office's interior design — furniture spacing, sari-sari shelf styling, and morning playlist curation",
          "the enterprise-wide accounting close's periodic reconciliation and audit firm's liaison hospitality",
          "the door-guard rotations across every entrance and the fire-safety walk's certificate of completion",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · general duties task (lib/fixtures/rowspec/office.ts:328)",
        distractorNotes: [
          "Write-up leg: the KEY is the anchor's own list — supplies, records databases, basic bookkeeping, worked as routine.",
          "Interior design is comfort trivia outside the upkeep desk's own three legs.",
          "Enterprise reconciliation is the accounting track's own work — the desk's basic bookkeeping is smaller-boned.",
          "Guard rotations and fire walks are facilities posts the general-duty line never names.",
        ],
      },
      // Q2 application
      {
        skill: "General office duties & tools",
        catalogSkill: "General office duties & tools",
        stem:
          "Monday's list: restock supplies, update the staff contact database, and total the petty cash against its own ledger line.",
        options: [
          "work each item — supplies restocked, database updated, petty cash totaled — and mark each own row's close",
          "restock supplies and skip the numbers as 'accounting work' outside your own name",
          "wait for a complaint before opening the contact database, since updates rode already on whoever last keyed them",
          "take the day's list into the corridor and assign each row to whichever teammate walks past in the morning's pass",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · general duties task (lib/fixtures/rowspec/office.ts:328)",
        distractorNotes: [
          "Write-up leg: the KEY is the anchor's own routine — all three legs worked as the day's own rounds, each closed.",
          "Petty-cash skipping breaks the basic-bookkeeping leg the anchor's line carries on the same desk.",
          "Complaint-waiting defers the records-management maintenance the anchor's desk holds.",
          "Corridor assignments leave every row's ownership as vague as the morning's foot traffic.",
        ],
      },
      // Q3 judgment
      {
        skill: "General office duties & tools",
        catalogSkill: "General office duties & tools",
        stem:
          "The petty cash ledger shows ₱3,200 out against receipts totaling ₱2,980 — the difference rides an un-receipted courier's tip from Thursday.",
        options: [
          "trace the gap's source line, surface it to the ledger's owner with the un-receipted item named, and log the resolution's own route",
          "cover the ₱220 from your own wallet quietly and leave the ledger's line untouched for its next audit's neat read",
          "write 'rounding' beside the gap and let the ledger's line carry the difference without any further route",
          "recompute Friday's whole week from memory so the ledger's lines re-balance to Thursday's own recounted sums",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · general duties task (lib/fixtures/rowspec/office.ts:328)",
        distractorNotes: [
          "Write-up leg: the KEY carries the desk's basic-bookkeeping line — gap traced, owned, routed to resolution.",
          "Personal covering hides the un-receipted item from every later audit — the ledger's lines owe their own truth.",
          "'Rounding' beside a real gap plants fiction in the very record the basic-bookkeeping desk maintains.",
          "Memory-recomputation rewrites the ledger rather than closing its own gap — the route, not the rewrite, resolves.",
        ],
      },
    ],
  },

  {
    skill: "Clerical support across departments",
    catalogSkill: "Clerical support across departments",
    items: [
      // Q1 recognition
      {
        skill: "Clerical support across departments",
        catalogSkill: "Clerical support across departments",
        stem:
          "O*NET's line: “Provide clerical support to other departments.” PSOC 3343 letter e) adds “liaising with other staff about a range of matters relating to the organization's operations.” What fills the cross-department desk?",
        options: [
          "lending your clerical work wherever another department needs it, with the office's own routes for the liaising line",
          "refusing every cross-department call since clerks serve only whichever department's name is on their own door",
          "taking every department's overflow at once so your own queue drowns and the busiest owner's name wins the day",
          "posting interns to whichever department asks first, before their own departments know the loan even happens",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · clerical support task + PSOC 3343 · e] (lib/fixtures/rowspec/office.ts:335-336)",
        distractorNotes: [
          "Write-up leg: the KEY is the anchor's support act — clerical work lent across departments with routes carried.",
          "Own-door-only serving contradicts the anchor's cross-department scope in one motion.",
          "Overflow-all absorbing breaks your own queue — support is routed, not surrendered to the loudest ask.",
          "Unannounced intern posting skips the liaison leg letter e) attaches to the same desk.",
        ],
      },
      // Q2 application
      {
        skill: "Clerical support across departments",
        catalogSkill: "Clerical support across departments",
        stem:
          "Marketing is short-handed for a two-day data-cleanup push while your own queue runs light but not empty.",
        options: [
          "lend your hours to the push once your own queue's close is arranged, with your supervisor's word carrying the route",
          "help all two days without consulting anyone, and let your own queue's owners discover the silence after the push",
          "refuse outright since marketing's queue is marketing's own — clerks serve their own department's name first",
          "send marketing whoever currently sits at the intern's desk without telling anyone the loan happened at all",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · clerical support task + PSOC 3343 · e] (lib/fixtures/rowspec/office.ts:335-336)",
        distractorNotes: [
          "Write-up leg: the KEY runs the support act with the liaison leg intact — supervisor's word, own queue's close arranged.",
          "Unconsulted all-in lending breaks your own queue's owners and letter e)'s liaison line in one motion.",
          "Refusal-outright abandons the anchor's cross-department scope the row prints.",
          "Unannounced intern lending is the liaison leg's exact breach — the desk's routes carry the loan.",
        ],
      },
      // Q3 judgment
      {
        skill: "Clerical support across departments",
        catalogSkill: "Clerical support across departments",
        stem:
          "Two departments ask for the same afternoon of your time — one's a routine report, the other a search pile with no deadline but carrying your executive's signature queue.",
        options: [
          "route the report to its owning queue, and weigh the search pile against the signature queue's own weight — asking whichever's owning desk which step moves first",
          "help whichever requester arrived first at your door, since the desk's only fair rotation rule is whoever asked adequacy first",
          "split yourself in half physically across the two departments every hour so neither desk sees abandonment in the afternoon",
          "take the unsigned pile and let the signature queue's weight decide on Friday's own summary since unsigned work waits anyway",
        ],
        answer: 0,
        ref: "PSOC 3343 · e] (lib/fixtures/rowspec/office.ts:336)",
        distractorNotes: [
          "Write-up leg: the KEY carries the liaison leg — each queue's owner asked, the desk's line weighed plainly.",
          "First-arrival priority is a taste rule the office's own routes never made.",
          "Hourly splits make two half-jobs of the afternoon — support is routed, not diluted by the hour.",
          "Friday's summary assuming unsigned work waits is the desk's own line quietly broken.",
        ],
      },
    ],
  },

  {
    skill: "Payroll-information processing",
    catalogSkill: "Payroll-information processing",
    items: [
      // Q1 recognition
      {
        skill: "Payroll-information processing",
        catalogSkill: "Payroll-information processing",
        stem:
          "O*NET's line: “Process payroll information.” What fills the payroll-side desk?",
        options: [
          "the attendance and rate data entering the pay cycle — verified, pushed by cutoff, keyed to the cycle's own schedule",
          "the pay cycle's whole accounting being typed into employees' personal bank accounts from your own deposits",
          "processing payroll data after payday if the cycle's own hours happen to leave the desk free",
          "entering whichever batches the desk's operator knows personally and leaving strangers' rows to fill themselves",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · payroll task (lib/fixtures/rowspec/office.ts:342)",
        distractorNotes: [
          "Write-up leg: the KEY is the anchor's processing act — the cycle's data verified and pushed on its schedule.",
          "Personal-account typing invents payment routes no anchor authorizes — payroll data is the desk's material.",
          "After-payday-if-free processing abandons the cycle's cutoff — the anchor's processing runs on schedule.",
          "Personal acquaintance as batch filter breaks the processing desk's own data line.",
        ],
      },
      // Q2 application
      {
        skill: "Payroll-information processing",
        catalogSkill: "Payroll-information processing",
        stem:
          "Overtime sheets for the 15th cutoff arrive in four batches; one batch carries a rate change the ledger's rate table shows but the sheet's roles didn't.",
        options: [
          "flag the rate change to the batch's own source before it enters the cycle, and push all four batches by cutoff with the flagged batch's status noted",
          "push all four batches as the sheets read and let whichever payroll rate rules the cycle's own math decide afterward",
          "process the three clean batches only and hold the rate-flag batch for next cycle's push since the cutoff has no ready fix",
          "enter only the batches whose staff you sit near since the flagged batch's faces are less certain than your own neighbors' rows",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · payroll task (lib/fixtures/rowspec/office.ts:342)",
        distractorNotes: [
          "Write-up leg: the KEY processes to the cycle's schedule with the rate gap surfaced — the batch's own source decides.",
          "Push-as-read passes wrong rates silently into the cycle — the anchor's processing carries its own verification.",
          "Holding one batch past the cutoff breaks the pay cycle's own line — the flag routes, it doesn't postpone.",
          "Proximity filtering has no basis in the payroll data itself — the cycle's rows are the desk's entries.",
        ],
      },
      // Q3 judgment
      {
        skill: "Payroll-information processing",
        catalogSkill: "Payroll-information processing",
        stem:
          "An employee disputes the amount key'd: her sheet shows 14 overtime hours but the cycle's record carries 4, and the sheet's original is signed at 4.",
        options: [
          "open the records against each other, surface the 14-vs-4 gap to the payroll desk's owner, and hold the cycle's word until it settles",
          "correct the cycle to 14 hours since the employee's sheet was seen first and signed documents usually outrun keyboards",
          "correct the cycle to 4 hours since signed records outrank every keyboard, and close the dispute without any further route",
          "let both figures stand in the cycle since a doubled row is a smaller error than whichever single figure turns out wrong",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · payroll task (lib/fixtures/rowspec/office.ts:342)",
        distractorNotes: [
          "Write-up leg: the KEY surfaces the gap at the payroll desk's own route — the records' standoff settles with the owner named.",
          "Fetching the employee's figure at her sheet's word bypasses the gap's own check before it ever surfaces.",
          "Closing on the cycle's 4 without the gap's check plants the exact suspicion the dispute named.",
          "Doubled rows don't split risk — both figures wrong or right, the record's truth never carries two answers.",
        ],
      },
    ],
  },

  {
    skill: "Administrative policy setup & interpretation",
    // senior-heavy secondary row (rowspec flags) — entry framing stays junior-feeder
    catalogSkill: "Administrative policy setup & interpretation",
    items: [
      // Q1 recognition
      {
        skill: "Administrative policy setup & interpretation",
        catalogSkill: "Administrative policy setup & interpretation",
        stem:
          "O*NET's lines: “Interpret administrative and operating policies and procedures for employees,” alongside “Set up and oversee administrative policies and procedures.” What does the role's work look like at an admin office?",
        options: [
          "explaining the office's rules to the workforce and, as seniority grows, helping set and oversee them",
          "signing office policy into law as a legislator would since 'set up' language confers authority yet",
          "reciting each policy's history in every orientation so new staff memorize how the documents all arrived",
          "deleting obsolete policies from the office's drives so the walls never carry whatever is outdated",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · policy tasks + senior-heavy flag (lib/fixtures/rowspec/office.ts:348-352)",
        distractorNotes: [
          "Write-up leg: the KEY reads the anchor's pair faithfully — interpret-for-employees first, set-up-and-oversee as seniority opens it.",
          "Legislator authority misreads 'set up' — the row's set-up runs inside the office's own hands.",
          "History recitals are trivia the row's interpretation act never demands.",
          "Drive-deletion is housekeeping of the policy store, not the interpretation the anchor names.",
        ],
      },
      // Q2 application
      {
        skill: "Administrative policy setup & interpretation",
        catalogSkill: "Administrative policy setup & interpretation",
        stem:
          "A new staffer asks why travel claims need two signatures, and the second one clearly adds a week to each payment.",
        options: [
          "explain the rule and its purpose plainly — and flag the week's added delay to the office's own policy owner when the pattern holds",
          "say 'that's just how it is here' and walk back to your own desk with the question left where it landed",
          "tell the staffer to skip the second signature quietly this once since the week's delay is its own proof of waste",
          "insist no such rule exists since you personally don't recall signing one last quarter",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · “Interpret administrative and operating policies for employees” (lib/fixtures/rowspec/office.ts:348)",
        distractorNotes: [
          "Write-up leg: the KEY interprets — the rule's purpose given, and the rule's own pattern raised when its cost holds.",
          "'Just how it is' is the row's interpretation leg refused — the anchor expects the explanation given.",
          "Quiet skipping coaches a rule-break into the staffer's first week — the row's route is the office's own owner.",
          "'No rule exists' is the desk's opinion standing in for the policy's own text.",
        ],
      },
      // Q3 judgment
      {
        skill: "Administrative policy setup & interpretation",
        catalogSkill: "Administrative policy setup & interpretation",
        stem:
          "The travel-policy owner asks you to help draft the second-signature step's revision; your desk's judgment carries the clerks' lived friction.",
        options: [
          "carry what the clerks' queues actually say about the second step — where it slows, where it stops, ahead of whose papers — and draft the revision's option with the owner's own wording",
          "draft the revision around your own preferred exception list, and let the clerks' lived friction carry whatever footnote survives the owner's read",
          "decline the drafting entirely since policy authoring is a managerial seat you have never held and won't pretend to",
          "survey the whole floor in an anonymous clip-form and let the anonymous tally draft the revision itself, unwatermarked",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · “Set up and oversee administrative policies…” (lib/fixtures/rowspec/office.ts:348-349)",
        distractorNotes: [
          "Write-up leg: the KEY is the anchor's set-up leg at its associate's own reach — records carried, revision drafted, owner's wording held.",
          "Preference-based drafting plants your own exceptions into the office's rules — the clerks' friction, not taste, carries the evidence.",
          "Declining the owner's ask outruns the seniority-ladder the row itself names — the assist runs inside the owner's frame.",
          "Anonymous-tally drafting unwatermarked has no owner's word on any line of it — the revision needs the drafting route.",
        ],
      },
    ],
  },

  {
    skill: "Representing executives / meeting on their behalf",
    // senior-heavy secondary row — entry framing stays junior-feeder
    catalogSkill: "Representing executives / meeting on their behalf",
    items: [
      // Q1 recognition
      {
        skill: "Representing executives / meeting on their behalf",
        catalogSkill: "Representing executives / meeting on their behalf",
        stem:
          "O*NET's line: “Meet with individuals, special interest groups, and others on behalf of executives, committees, and boards of directors.” What does standing in for an executive mean?",
        options: [
          "attending as the executive's voice inside the meeting's own limits, and carrying the outcomes back to their desk",
          "attending as yourself alone and announcing at the door that the executive could not be here today",
          "agreeing freely to every request so partners leave each meeting feeling heard by the office's own voice",
          "recording the meeting quietly without speaking, since words carry authority only the named executive holds",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · representing task + senior-heavy flag (lib/fixtures/rowspec/office.ts:356-360)",
        distractorNotes: [
          "Write-up leg: the KEY is the anchor's own meaning — meeting on behalf, with the outcome's return to the executive's desk.",
          "'Could not be here today' announces the absence and then speaks it — the anchor's behalf carries a voice, not a vacancy.",
          "Free agreement outruns the authority the standing-in itself carries — the return conversation picks up the ruins.",
          "Silent-note-taking is the attendance row's own work, not the on-behalf meeting the anchor names.",
        ],
      },
      // Q2 application
      {
        skill: "Representing executives / meeting on their behalf",
        catalogSkill: "Representing executives / meeting on their behalf",
        stem:
          "Your executive can't attend a partner sync and sends you with one note: “we hold at the September terms — defer anything past that.”",
        options: [
          "attend, carry the September terms as the office's position, defer what exceeds them, and report each outcome to the executive that evening",
          "attend, record the partner's asks, and agree to none of them — noting on the record that the executive's seat was merely observed",
          "decline the meeting since the seat deserves the executive's own face and any substitute distorts the partnership's read",
          "attend and say yes to whichever partner's ask sounds smallest so the sync's mood stays warm for the executive's next visit",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · representing task (lib/fixtures/rowspec/office.ts:356)",
        distractorNotes: [
          "Write-up leg: the KEY runs the note's own standing — September terms carried, deferrals made, outcomes returned.",
          "'Merely observing' refuses the anchor's own standing — the voice is why the desk was sent.",
          "Declining outright abandons the meeting the office was expected to hold.",
          "Smallest-ask yes is a concession the September terms never authorized — warmth is not authority.",
        ],
      },
      // Q3 judgment
      {
        skill: "Representing executives / meeting on their behalf",
        catalogSkill: "Representing executives / meeting on their behalf",
        stem:
          "Mid-meeting, a partner proposes an extension that exceeds the executive's note; the room's mood leans yes and your notes' silence holds.",
        options: [
          "carry the September line plainly, hold the extension as pending the executive's own word, and flag the ask in tonight's return report",
          "agree to the extension on the spot since the room's mood is office mood and the executive will read the report tonight anyway",
          "walk out on the extension's discussion so the record never carries any word you were in the room when it passed",
          "silently nod toward whichever partner asked and write 'TBD' in the notes so the extension reads as the room's own idea",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · representing task + senior-heavy flag (lib/fixtures/rowspec/office.ts:356, 360)",
        distractorNotes: [
          "Write-up leg: the KEY holds the on-behalf limit while the meeting's ask lands — held plainly, flagged plainly.",
          "Room-mood agreement hands away authority the note never granted — tonight's report arrives holding ruins.",
          "Walking out abandons the seat the anchor's standing occupies — presence records outcomes, not absence.",
          "The silent nod becomes your agreement in every listening ear — 'TBD' never rescues the next week's read.",
        ],
      },
    ],
  },

  {
    skill: "Supervision & training of clerical staff",
    // senior-heavy secondary row — entry framing stays junior-feeder
    catalogSkill: "Supervision & training of clerical staff",
    items: [
      // Q1 recognition
      {
        skill: "Supervision & training of clerical staff",
        catalogSkill: "Supervision & training of clerical staff",
        stem:
          "O*NET's line: “Supervise and train other clerical staff and arrange for employee training by scheduling training or organizing training material.” What does the role's work look like?",
        options: [
          "onboarding and guiding the clerks on the floor — their procedures walked, their checked work steadied, their training arranged",
          "deciding each clerk's annual rating alone since supervision means deciding whose name survives the year's cut",
          "running the office's own hiring board and terminating whoever's error rate opens a week's third miss",
          "handling the clerks' personal disputes inside a private notebook you never share with anyone at all",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · supervision task + senior-heavy flag (lib/fixtures/rowspec/office.ts:364-368)",
        distractorNotes: [
          "Write-up leg: the KEY is the anchor's pair — supervise-and-train, with training scheduled or its material organized.",
          "Rating decision alone collapses the row into personnel verdicts — the anchor's verbs are walk-and-steady.",
          "Hiring-and-termination runs belong above the row — the anchor's scope is the clerks' own work growth.",
          "Private dispute notebooks shield nothing the row's supervising leg is meant to carry.",
        ],
      },
      // Q2 application
      {
        skill: "Supervision & training of clerical staff",
        catalogSkill: "Supervision & training of clerical staff",
        stem:
          "A new clerk misfiles several records in their first week, and three of the misfiles sit in tomorrow's retrieval queue.",
        options: [
          "walk the misfiling procedure with them, correct the three queued records together, and check their next files until the pace steadies",
          "re-file all three yourself and never tell the clerk, so the week's records stay clean and the first-week morale stays kind",
          "report every misfile to the manager's weekly note and let the clerk's coach arrive whenever the office's own calendar frees one",
          "let the errors stand — experience is the only real teacher, and the queue's owners will eventually send each one back",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · supervision task (lib/fixtures/rowspec/office.ts:364)",
        distractorNotes: [
          "Write-up leg: the KEY trains as the anchor's verb run — procedure walked, errors corrected together, next work checked.",
          "Silent re-filing shields the clerk from every lesson — the unchecked pattern is tomorrow's bigger miss.",
          "Manager-note-only coaching outsources the training the anchor assigns to this desk's own run.",
          "Standing errors transfer the misfiles' cost to every requester before any teaching happens.",
        ],
      },
      // Q3 judgment
      {
        skill: "Supervision & training of clerical staff",
        catalogSkill: "Supervision & training of clerical staff",
        stem:
          "A clerk you trained last month now misfiles the same repetitive class of records weekly, though their other classes run clean.",
        options: [
          "retrain the class specifically with the filing scheme's own cue set beside it, and check whether the class's rule itself carries a trap",
          "reassign the whole class to yourself permanently — your own speed cures the miss and the clerk's day stays free of it",
          "air the repeated miss in the floor's general meeting so every clerk hears the cost of a weekly pattern out loud",
          "assume the clerk's own motive is carelessness and let the pattern ride whichever firing week the manager picks",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · supervise-and-train task (lib/fixtures/rowspec/office.ts:364)",
        distractorNotes: [
          "Write-up leg: the KEY trains the one class — the cue set, the retrain, and the rule's own trap checked as it goes.",
          "Permanent reassignment removes the clerk's own growth — the row's training leg expects the class steered, not hoisted.",
          "General-meeting airing is supervision as public stain — the anchor's run trains the clerk, not the floor.",
          "Motive-presumption outruns the record — 'other classes run clean' says skill gap, not carelessness alone.",
        ],
      },
    ],
  },

  {
    skill: "Operating-practice review",
    // senior-heavy secondary row — entry framing stays junior-feeder
    catalogSkill: "Operating-practice review",
    items: [
      // Q1 recognition
      {
        skill: "Operating-practice review",
        catalogSkill: "Operating-practice review",
        stem:
          "O*NET's line: “Review operating practices and procedures to determine whether improvements can be made in areas such as workflow, reporting procedures, or expenditures.” What is the desk's review act?",
        options: [
          "tracing how the office's work actually flows, finding the slow spots, and proposing the concrete fixes",
          "conducting a morale survey since the office's practices bend to whatever the staff's own moods vote",
          "ordering faster approvals without any finding first, so the office's slow spots only ever guess",
          "typing the workflows' flowcharts fresh each quarter and calling the redraw itself the review",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · review task + senior-heavy flag (lib/fixtures/rowspec/office.ts:372-376)",
        distractorNotes: [
          "Write-up leg: the KEY is the anchor's own run — review, determine improvements, propose them.",
          "Morale surveys are mood gathers, not the workflow/report/expenditure reviews the anchor names.",
          "Fix-before-finding proposes the cure the review never diagnosed — the anchor's order runs finding first.",
          "Redrawn charts restyle what the anchor asks traced — the flow itself is the review's subject.",
        ],
      },
      // Q2 application
      {
        skill: "Operating-practice review",
        catalogSkill: "Operating-practice review",
        stem:
          "Reimbursements take 12 days and the staff's grumbling recurs monthly; your desk holds the queue's trace.",
        options: [
          "trace the workflow's days one at a time, name the two steps where it stalls, and propose a concrete fix to the supervisor",
          "circulate a staff survey on reimbursement satisfaction, file its results, and let the queue stand until an executive's note arrives",
          "tell the staff the delay builds character and let the grumbling stand — 12 days is the office's own accepted rhythm",
          "order instant digital approvals from a vendor's brochure so the 12 days collapse to whatever its demo showed last week",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · review task (lib/fixtures/rowspec/office.ts:372)",
        distractorNotes: [
          "Write-up leg: the KEY reviews — trace, find the slow steps, propose the fix, with the supervisor's route carrying it.",
          "Survey-and-file gathers feeling where the anchor asks a traced workflow and a proposed fix.",
          "'Builds character' is commentary, not the review the desk's own line carries.",
          "Vendor-brochure cures propose whatever was sold — the trace-first order the anchor names goes unmet.",
        ],
      },
      // Q3 judgment
      {
        skill: "Operating-practice review",
        catalogSkill: "Operating-practice review",
        stem:
          "Your proposed fix to the reimbursement queue halves its 12 days, but the finance clerk who countered the routing now holds the new queue alone and the office grumbles her case louder than ever.",
        options: [
          "revisit the fix's own arithmetic with her queue's real days beside it, adjust the routing with her desk's word on the line, and surface both to the supervisor",
          "stand on the fix since the queue halved — the clerk's grumble is resented arithmetic about a change whose counting she controls",
          "revert the whole fix to the office's original 12-day queue and tell the staff the review held off its proposed change",
          "circulate an anonymous complaint form about her desk's counting and let the office's tally decide whose word the queue carries",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · review task (lib/fixtures/rowspec/office.ts:372)",
        distractorNotes: [
          "Write-up leg: the KEY keeps the review's own craft honest — the fix's numbers re-checked, the worker's desk heard, the route confirmed.",
          "Standing on the halved queue ignores the counting's own hands — the review revisits, it doesn't tower.",
          "Reverting wholesale abandons the review's finding — the desk's line is adjustment, not surrender.",
          "Anonymous complaint forms are review-as-warfare — the anchor's proposals run through routes, not tallies.",
        ],
      },
    ],
  },

  {
    skill: "Employee time-tracking",
    catalogSkill: "Employee time-tracking",
    items: [
      // Q1 recognition
      {
        skill: "Employee time-tracking",
        catalogSkill: "Employee time-tracking",
        stem:
          "O*NET's line: “Keep track of employees' time.” What fills the timekeeping desk?",
        options: [
          "the attendance and leave records kept straight — what each employee worked, on whose dates, against the office's own record",
          "the pay cycle's whole monthly rate negotiation with whichever employees' unions approach the desk",
          "typing whatever hours each employee's manager tells you to carry, unverified against the logs' own source",
          "setting the office's official time zone conventions across every department's shift schedule afresh each season",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · time-tracking task + Job-Zone honesty flag (lib/fixtures/rowspec/office.ts:380, 382)",
        distractorNotes: [
          "Write-up leg: the KEY is the anchor's keeping act — time tracked against the office's own record, straight.",
          "Rate negotiation is a bargaining-table line the timekeeping row never carries.",
          "Unverified manager-typed hours break the desk's record — the log, not the say-so, carries the hours.",
          "Timezone conventions are systems settings, not the employee hours the row tracks.",
        ],
      },
      // Q2 application
      {
        skill: "Employee time-tracking",
        catalogSkill: "Employee time-tracking",
        stem:
          "A staffer swears she clocked in Tuesday at 8 a.m., her record still shows absent at 10, and the device's own shift log carries nothing in the two-hour window.",
        options: [
          "cross-check the source logs — device, shift record, whoever keyed Tuesday's rows — and follow the disputed-entry procedure before adjusting anything",
          "adjust her Tuesday to present since her word is what the desk's hourly recorders say rather than carry",
          "mark every disputed day present as a courtesy, referring whoever next disputes to the office's own clear routine",
          "dock the day's pay outright since no record anywhere carries the 8 a.m. hour and silence is the record's own word",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · time-tracking task (lib/fixtures/rowspec/office.ts:380)",
        distractorNotes: [
          "Write-up leg: the KEY keeps the desk's own record discipline — source logs traced, procedure followed before adjusting.",
          "Word-over-record adjusting rewrites attendance on one open record — the device's own source log decides, not the say-so.",
          "Courtesy-present marks give up the record — the desk's own memory of routines would have known this line well.",
          "Docks-outright without checking is the desk's own record discarded — the disputed-entry route comes before it.",
        ],
      },
      // Q3 judgment
      {
        skill: "Employee time-tracking",
        catalogSkill: "Employee time-tracking",
        stem:
          "The device's clock drifted two minutes behind for the month — a whole payroll-wide pattern, not one staffer's dispute.",
        options: [
          "note the drift's pattern in the record, surface it to the timekeeping desk's owner, and apply the procedure to the month's disputed edges only",
          "quietly adjust every drifted entry to the two minutes' worth since everybody's rows carried the same risk-free error",
          "reset the device's clock silently and leave every prior row's drift standing unfractioned for the year's own audit to chase",
          "report the drift to the whole floor's chat thread and let whichever staffer's claim arrives next carry the desk's decision",
        ],
        answer: 0,
        ref: "O*NET 43-6011.00 · time-tracking task (lib/fixtures/rowspec/office.ts:380)",
        distractorNotes: [
          "Write-up leg: the KEY carries the drift's own pattern honestly — noted, owned, routed through the desk's procedure on the month's edges.",
          "Silent blanket adjustment grants two minutes' credit to every row without any record the correction happened at all.",
          "Silent-reset unfractioned rows leave the year's audit magnetic enough to chase — the note belongs in the record first.",
          "Chat-thread proof surrenders the desk's procedure to whichever claim arrives next — the pattern's route is the owner's.",
        ],
      },
    ],
  },

  // ═══ E3 · Records Clerk (records) — 11 rows ══════════════════════════════
  {
    skill: "Sort & classify materials to filing rules",
    catalogSkill: "Sort & classify materials to filing rules",
    items: [
      // Q1 recognition
      {
        skill: "Sort & classify materials to filing rules",
        catalogSkill: "Sort & classify materials to filing rules",
        stem:
          "PSOC 4415 letter a) reads “sorting or classifying materials according to guidelines such as content, purpose, user criteria, or chronological, alphabetical, or numerical order.” What is the sort desk's act?",
        options: [
          "sorting and classifying every incoming document against the filing rules' own cues, so each rests where the system says",
          "sorting by arrival time and filing whichever items fit the day's remaining shelf space",
          "sorting by paper color so the visual sweep finds each class быстрее than any printed cue",
          "sorting a sample of ten documents as the shift's own demonstration, leaving the day's full intake to whoever follows",
        ],
        answer: 0,
        ref: "PSOC 4415 · a] (lib/fixtures/rowspec/office.ts:389)",
        distractorNotes: [
          "Write-up leg: the KEY is the letter's own act — sort and classify per the printed guideline cues.",
          "Arrival-time filing abandons the cues letter a) prints — content and order, not the clock, decide.",
          "Color coding manufactures a cue the guidelines never carry.",
          "Samples demonstrate; the letter's act runs on the day's intake, whole.",
        ],
      },
      // Q2 application
      {
        skill: "Sort & classify materials to filing rules",
        catalogSkill: "Sort & classify materials to filing rules",
        stem:
          "Forty documents of different types arrive for the records room — permits, receipts, one memo folded around a business card.",
        options: [
          "sort and classify each document against the filing rules' content and type cues, then route each to where the system says it rests",
          "sort the easy ones and bung the rest into storage shelves loose — tomorrow's slower shift can chase the stragglers",
          "stack all forty by the hour they arrived and file the whole pile top-first at day's end",
          "unfold the memo and card, paper-clip them together, and file the pair under 'personal effects' in the last drawer",
        ],
        answer: 0,
        ref: "PSOC 4415 · a] (lib/fixtures/rowspec/office.ts:389)",
        distractorNotes: [
          "Write-up leg: the KEY runs the letter's act on the intake, whole — sorted, classified, placed per the system.",
          "Loose-bunged storage is filing deferred to failure — the letter's sorting covers every document, easy or not.",
          "Arrival-stacks ignore the printed cues the letter names as the classification's own basis.",
          "'Personal effects' is a category the filing system doesn't carry — the memo and card sort to their real homes.",
        ],
      },
      // Q3 judgment
      {
        skill: "Sort & classify materials to filing rules",
        catalogSkill: "Sort & classify materials to filing rules",
        stem:
          "One document fits two classes — a purchase receipt whose line-item mentions Personnel's seminar fund — and the two owning desks each claim it.",
        options: [
          "classify by the document's primary purpose per the rules' guideline order, and cross-reference the index so both desks can find it",
          "photocopy it and file a copy in each desk's class so neither desk is ever told no and the record doubles on paper",
          "hold the document unfiled until the two desks settle their claim in a joint meeting someday",
          "file it alphabetically by the vendor's surname and let whichever desk stumbles on the spelling locate it next",
        ],
        answer: 0,
        ref: "PSOC 4415 · a] (lib/fixtures/rowspec/office.ts:389)",
        distractorNotes: [
          "Write-up leg: the KEY applies the guidelines' priority order and cross-references the index — one document, one file, findable both ways.",
          "Photocopy-doubling fragments the record — two originals is an archive of nothing.",
          "Meeting-waiting leaves the document out of the system entirely — the guidelines' own priority order exists for exactly this.",
          "Surname-filing sidesteps both classes and both desks' claim — classification runs per the rules, not by accident of spelling.",
        ],
      },
    ],
  },

  {
    skill: "Filing into storage (drawers/cabinets/boxes)",
    catalogSkill: "Filing into storage (drawers/cabinets/boxes)",
    items: [
      // Q1 recognition
      {
        skill: "Filing into storage (drawers/cabinets/boxes)",
        catalogSkill: "Filing into storage (drawers/cabinets/boxes)",
        stem:
          "PSOC 4415 letter b) reads “filing material in drawers, cabinets and storage boxes,” with the unit's framing “file correspondence, cards, invoices, receipts and other records in alphabetical or numerical order or according to the filing system used.” What is the filing act?",
        options: [
          "placing each record in its correct storage location per the filing system, immediately and every time",
          "holding items until the current drawer fills so the drawers' facing stays visually even for visitors",
          "filing into whichever drawer is nearest at the moment and re-sorting the lot whenever a search fails",
          "boxing everything yearly, labeling the box 'miscellaneous', and stacking it wherever the storeroom allows",
        ],
        answer: 0,
        ref: "PSOC 4415 · b] + framing text (lib/fixtures/rowspec/office.ts:396)",
        distractorNotes: [
          "Write-up leg: the KEY is the letter's act plus the framing — correct location, alphabetical/numerical/system order.",
          "Fills-then-file inverts the discipline — records file when they exist, not when shelves open.",
          "Nearest-drawer filing is what the framing's ordering language exists to stop.",
          "'Miscellaneous' boxes are unlabeled archives — the framing's filing-system order never carries them.",
        ],
      },
      // Q2 application
      {
        skill: "Filing into storage (drawers/cabinets/boxes)",
        catalogSkill: "Filing into storage (drawers/cabinets/boxes)",
        stem:
          "A classified folder is ready, its drawer is one shelf rung above your reach, and a handcart of yesterday's filing sits unprocessed.",
        options: [
          "file the folder in its correct location first — reaching or rolling the step stool across — and leave the handcart per the room's own queue",
          "drop the folder into yesterday's open drawer so the trip's ladder never happens, and note the two documents' cohabitation in your own head",
          "reseat the whole handcart's unfiled stack into the folder's general drawer since proximity makes the refile tomorrow's trivial job",
          "shelve the folder on top of the cabinet and finger-book its resting spot for whenever the ladder's next trip happens",
        ],
        answer: 0,
        ref: "PSOC 4415 · b] (lib/fixtures/rowspec/office.ts:396)",
        distractorNotes: [
          "Write-up leg: the KEY is the letter's act at its own best — correct location, immediately, whatever the reach.",
          "Wrong-drawer parking plants the exact retrieval failure the framing's ordering language prevents.",
          "Proximity refile soaks yesterday's stack into an unclassified general drawer — neither pile is filed per system.",
          "Cabinet-topped folders are filing outside the storage the letter names — the spot must be the system's own.",
        ],
      },
      // Q3 judgment
      {
        skill: "Filing into storage (drawers/cabinets/boxes)",
        catalogSkill: "Filing into storage (drawers/cabinets/boxes)",
        stem:
          "The numerical-order drawer's guide cards have drifted two positions after last quarter's cabinet move; three searches failed this week.",
        options: [
          "reseat the guide cards to the cabinet's current physical order, fix the three misfiled positions, and log the correction in the filing system's own record",
          "leave the cards as they stand — the alphabetical cross-check drawer catches everything the numerical order ever loses",
          "rebuild the drawer's whole order numerically from scratch over the weekend and let this week's three failures stand as the old order's inheritance",
          "post a handwritten note on the drawer announcing the cards' drift and let each searcher relocate their own targets manually",
        ],
        answer: 0,
        ref: "PSOC 4415 · b] + framing text (lib/fixtures/rowspec/office.ts:396)",
        distractorNotes: [
          "Write-up leg: the KEY repairs the letter's own order — guides reseated, misfiles fixed, correction logged in the system.",
          "Cross-drawer reliance doubles every search and leaves the drift standing — the letter's order belongs to this drawer.",
          "Weekend rebuilds postpone every current search while the three failures stay misfiled until Saturday.",
          "Note-and-relocate is filing as self-service — the system's own record carries the order, not searchers' legs.",
        ],
      },
    ],
  },

  {
    skill: "File retrieval on request",
    catalogSkill: "File retrieval on request",
    items: [
      // Q1 recognition
      {
        skill: "File retrieval on request",
        catalogSkill: "File retrieval on request",
        stem:
          "PSOC 4415 letter c) reads “locating and removing materials from files when requested,” with the framing “They locate and remove material from file when requested.” What is the retrieval act?",
        options: [
          "finding the requested item in the filing system and handing it over — quickly, from the index the system maintains",
          "handing the requester the storage room's key so they may search their own drawer whenever the mood beats",
          "guessing which shelf carries the request and apologizing to the requester for whatever time the sweep eats",
          "refiling the neighboring mess first so the request's own item is found at last by the cleaner neighborhood",
        ],
        answer: 0,
        ref: "PSOC 4415 · c] + framing text (lib/fixtures/rowspec/office.ts:403)",
        distractorNotes: [
          "Write-up leg: the KEY is the letter's pair act — locate and remove on request, fast and from the system's own order.",
          "Key-hand-over is retrieval delegated — the letter's act is the clerk's own locate-and-remove.",
          "Guesses-and-apologies are archery — the index's own cue is where the letter's locate leg begins.",
          "Neighborhood-refiling first inverts the ask — the item is retrieved, then the mess is its own row.",
        ],
      },
      // Q2 application
      {
        skill: "File retrieval on request",
        catalogSkill: "File retrieval on request",
        stem:
          "Someone at the window needs the 2023 lease file now, and the numerical index's role for it carries a hand-scrawled 'moved to Box 12'.",
        options: [
          "retrieve Box 12 per the index's own note, hand over the lease file, and offer the requester the same trail's minutes-fast service",
          "apologize that the index's scrawl invalidates the numerical system and tell the requester to return once the reindexing finishes",
          "hand the requester the storage key and the note about scrawl so their own hunt proves faster than your desk's",
          "refile every neighbor-box first so the lease's retrieval lands inside a tidy neighborhood an hour after the request",
        ],
        answer: 0,
        ref: "PSOC 4415 · c] (lib/fixtures/rowspec/office.ts:403)",
        distractorNotes: [
          "Write-up leg: the KEY follows the system's own trail — the scrawl is the index's note, and the retrieval runs through it.",
          "Post-reindexing return waits are searches the letter's locate leg already had a trail for.",
          "Key-on-request delegations outsource the act — the desk's own locate-and-remove is the letter's job.",
          "Pre-retrieval refiling puts tidiness ahead of the request's own clock — mess does not precede retrieval.",
        ],
      },
      // Q3 judgment
      {
        skill: "File retrieval on request",
        catalogSkill: "File retrieval on request",
        stem:
          "A director's request arrives for a file the log shows signed out and unreturned for a month, and the borrower's own line is silent.",
        options: [
          "tell the director where the file stands per the log, chase the silent borrower per the records' own follow-up route, and log the director's need against the file's return",
          "build a replica folder from the office's scanned archives and hand it over so the director's need never learns the borrower's silence",
          "mark the file 'permanently lost' in the index and log the director's request as closed, since unreturned means gone",
          "wait until the month-end inventory, when whichever borrower owes what the office finds itself must finally surface",
        ],
        answer: 0,
        ref: "PSOC 4415 · c] + framing text (lib/fixtures/rowspec/office.ts:403)",
        distractorNotes: [
          "Write-up leg: the KEY keeps the log's trail as the retrieval's answer — the file's own whereabouts reported, the chase routed.",
          "Replica folders plant a scan where the original's trail stands — the retrieval answers with the record, not fabrication.",
          "Lost-marking unilaterally closes a file the log still says lives somewhere — the chase, not the verdict, is next.",
          "Month-end patience abandons the director's request to a calendar — the log's trail runs on the request's clock.",
        ],
      },
    ],
  },

  {
    skill: "Filing log / records of materials filed & removed",
    catalogSkill: "Filing log / records of materials filed & removed",
    items: [
      // Q1 recognition
      {
        skill: "Filing log / records of materials filed & removed",
        catalogSkill: "Filing log / records of materials filed & removed",
        stem:
          "PSOC 4415 letter d) reads “keeping records of materials filed and removed.” What is the logging act?",
        options: [
          "recording what went into the files and what came out — so any material's trail survives its own shelf",
          "keeping a running estimate of the room's total shelf count so the office's capacity reads stay plausible",
          "logging only the removals that involve a director's signature, since ordinary pull-outs refile themselves",
          "photographing each drawer's face before closing so the shelf's visual state is its own diary",
        ],
        answer: 0,
        ref: "PSOC 4415 · d] (lib/fixtures/rowspec/office.ts:410)",
        distractorNotes: [
          "Write-up leg: the KEY is the letter's pair — filed and removed, both recorded, both trailed.",
          "Capacity estimates are housekeeping — the letter's records are per-material trails, not room sums.",
          "Director-signature filtering invents an eligibility the letter never grants — removals all log.",
          "Drawer-face photos are shelf diaries, not the material-level trails the letter names.",
        ],
      },
      // Q2 application
      {
        skill: "Filing log / records of materials filed & removed",
        catalogSkill: "Filing log / records of materials filed & removed",
        stem:
          "A director walks off with a personnel folder for a hearing this afternoon.",
        options: [
          "record the removal in the log — what folder, who, when — and record its return the moment it's refiled",
          "trust that directors return whatever they borrow and hold the log's line open in your own memory instead",
          "swap in a look-alike folder so the shelf's slot stays filled and the log's page reads unbothered",
          "strike the folder's index line out for the day and redraw it tonight when the hearing ends",
        ],
        answer: 0,
        ref: "PSOC 4415 · d] (lib/fixtures/rowspec/office.ts:410)",
        distractorNotes: [
          "Write-up leg: the KEY is the letter's log at its own best — removal recorded now, return recorded on refile.",
          "Trust-in-memory records nothing — the log's page is the trail, not the desk's recall.",
          "Look-alike swaps rewrite the shelf and leave the log's trail empty where it should read.",
          "Struck-and-redrawn index lines vanish from the record — the trail's whole point is permanent.",
        ],
      },
      // Q3 judgment
      {
        skill: "Filing log / records of materials filed & removed",
        catalogSkill: "Filing log / records of materials filed & removed",
        stem:
          "The monthly audit reads your log and finds one removal entry missing initials — the borrower's own signature line was never pressed.",
        options: [
          "supplement the log with the audit's finding — date, material, borrower's name — and route the missing-initial line to the owning desk",
          "press the initials in yourself on the borrower's behalf since everyone's day was busy and the log's integrity only needs the line filled",
          "photocopy the entry freshly without the initials' absence and hand the audit a clean page so the finding never reads",
          "declare the line void and refile the folder as 'returned unlogged' so the audit's finding has no page to tie itself to",
        ],
        answer: 0,
        ref: "PSOC 4415 · d] (lib/fixtures/rowspec/office.ts:410)",
        distractorNotes: [
          "Write-up leg: the KEY supplements the log honestly — the finding recorded, the gap routed to its owning desk.",
          "Pressing initials on someone's behalf plants the very signature line the audit's reading exists to check.",
          "Fresh clean-page photocopies are log forgery — the audit's trail reads the original, not the reprint.",
          "'Void-and-refile' unwrites the removal entirely — the trail disappears rather than fills.",
        ],
      },
    ],
  },

  {
    skill: "Reprographics: photocopy, scan, fax",
    catalogSkill: "Reprographics: photocopy, scan, fax",
    items: [
      // Q1 recognition
      {
        skill: "Reprographics: photocopy, scan, fax",
        catalogSkill: "Reprographics: photocopy, scan, fax",
        stem:
          "PSOC 4415 letter e) reads “photocopying, scanning or faxing documents,” with the framing “and photocopy, scan or fax documents.” What is the reprographics act?",
        options: [
          "operating the reprographics flow — copies run, scans captured, faxes sent — so the file's paper and digital twins match",
          "operating the room's machines at whatever speed each document's queue urgency suggests, quality permitting",
          "photographing signature pages with your phone since the office's machines all need their weekly maintenance",
          "faxing everything by default since scans feel too modern for the office's signed originals",
        ],
        answer: 0,
        ref: "PSOC 4415 · e] + framing text (lib/fixtures/rowspec/office.ts:417)",
        distractorNotes: [
          "Write-up leg: the KEY is the letter's three-run — photocopy, scan, or fax — each at standard quality.",
          "Speed-over-quality reproduction serves urgency, not the flow's own standard.",
          "Phone-photo reproduction is ad-hoc improvisation the machines' line replaced long ago.",
          "Fax-by-default abandons the digital twin two of the letter's three verbs create.",
        ],
      },
      // Q2 application
      {
        skill: "Reprographics: photocopy, scan, fax",
        catalogSkill: "Reprographics: photocopy, scan, fax",
        stem:
          "A partner needs a scanned-and-emailed copy of a signed agreement, plus two paper copies retaken off the same master.",
        options: [
          "scan and email the digital copy, then run the two paper copies off the same master, and log the batch in the repro record",
          "photocopy fifty spares since the partner's need might extend, and email the first spare scanned sideways",
          "photograph the signature page at an angle and send it, then run today's copies fresh off a reprinted draft",
          "fax the document since signatures travel safest over the phone lines, and photocopy the two paper copies off the fax's output",
        ],
        answer: 0,
        ref: "PSOC 4415 · e] (lib/fixtures/rowspec/office.ts:417)",
        distractorNotes: [
          "Write-up leg: the KEY runs the letter's act end to end — scan, copy from the same master, and repro-log the batch.",
          "Fifty-spare printing and sideways scans serve guesswork, not the partner's stated need at standard quality.",
          "Angle-photo sending plus draft-based copies reproduce nothing the signed original owns.",
          "Fax-first chains the copies to the fax's degraded output — the master, not the middle stage, feeds the copies.",
        ],
      },
      // Q3 judgment
      {
        skill: "Reprographics: photocopy, scan, fax",
        catalogSkill: "Reprographics: photocopy, scan, fax",
        stem:
          "The machine's output carries a faint vertical streak — the partner's signed agreement would need recopying, and the technician's visit is Tuesday.",
        options: [
          "clean the machine's glass per its guide, retest, and if the streak holds, run the partner's copies on the neighboring machine and note the deviation",
          "send the streaked copies as-is with an apology line, since the technician's Tuesday visit owns the machine's fault either way",
          "withhold both copies until Tuesday since the streak disqualifies the machine's flank entirely and quality is reprographics' own word",
          "darken the contrast settings heavily so the streak disappears into the print and send the partner the darker copies",
        ],
        answer: 0,
        ref: "PSOC 4415 · e] + framing (lib/fixtures/rowspec/office.ts:417)",
        distractorNotes: [
          "Write-up leg: the KEY keeps the flow's standard — guide-clean, retest, reroute to a working machine, and log the deviation.",
          "Apology-shipped streaks fail the repro standard the Tuesday visit never excuses.",
          "Withholding-until-Tuesday starves the partner's need — the standard runs, the machine can route around.",
          "Contrast-heavy darkening hides the defect without fixing it — the copies depart degraded on purpose.",
        ],
      },
    ],
  },

  {
    skill: "Telephone, switchboard & front-desk duties",
    // corroboration row (O*NET 43-4171, neighboring Receptionists family)
    catalogSkill: "Telephone, switchboard & front-desk duties",
    items: [
      // Q1 recognition
      {
        skill: "Telephone, switchboard & front-desk duties",
        catalogSkill: "Telephone, switchboard & front-desk duties",
        stem:
          "O*NET 43-4171's corroboration line: “Operate telephone switchboard to answer, screen, or forward calls, providing information, taking messages, or scheduling appointments.” What is the office's first voice?",
        options: [
          "answering the incoming lines, screening each, and relaying or routing them — messages taken, information given",
          "answering one line only and letting the others ring into the office's own standing voicemail graveyard",
          "screening ruthlessly and passing through only callers she recognizes by voice and title combined",
          "scheduling every caller an appointment so no call is ever taken or relayed, only booked",
        ],
        answer: 0,
        ref: "O*NET 43-4171.00 · switchboard task (lib/fixtures/rowspec/office.ts:425)",
        distractorNotes: [
          "Write-up leg: the KEY is the anchor's own five-verb run — answer, screen, forward, give information, take messages.",
          "One-line answering abandons the switchboard's whole purpose — the anchor operates its lines, plural.",
          "Voice-and-title recognition is not the anchor's screening — the screen serves routing, not filtering at will.",
          "Book-everyone override skips the answering-and-relaying legs the anchor runs first.",
        ],
      },
      // Q2 application
      {
        skill: "Telephone, switchboard & front-desk duties",
        catalogSkill: "Telephone, switchboard & front-desk duties",
        stem:
          "Three lines flash during the morning rush — a client's order query, a supplier's delivery confirm, and an unknown number with a two-word greeting.",
        options: [
          "answer each in turn, take the order query and delivery confirm to their owners, and take the unknown's message for screening — no dropped calls, no parked holds",
          "answer the client first, park the supplier and unknown on indefinite hold, and resume whichever one rings again next",
          "let all three ring out and restart the switchboard at ten past the hour since the morning's batch is its own queue reset",
          "bounce every call to whichever line's extension sits quietest and note the batch as 'dispersed' for the day's log",
        ],
        answer: 0,
        ref: "O*NET 43-4171.00 · switchboard task (lib/fixtures/rowspec/office.ts:425)",
        distractorNotes: [
          "Write-up leg: the KEY runs the anchor's answer-screen-relay act across the rush — each line served to its verb.",
          "Indefinite holds park two callers' business mid-line — the anchor's relay leg serves each in its turn.",
          "Ring-outs surrender all three caller needs to a clock — the switchboard exists to answer, not queue by hour.",
          "Extension-bouncing is routing masquerading as relay — messages and information legs both skipped.",
        ],
      },
      // Q3 judgment
      {
        skill: "Telephone, switchboard & front-desk duties",
        catalogSkill: "Telephone, switchboard & front-desk duties",
        stem:
          "A caller claims to be the auditor's assistant “confirming bank details by phone for next week's engagement letter” — the log carries no such notice.",
        options: [
          "take the caller's details and message for the records, decline to confirm any bank details aloud, and route the claim to the responsible desk for verification",
          "confirm the account number aloud since auditors' engagements run on time and the log's silence is likely misfiled rather than absent",
          "hang up immediately as a scam precaution and mark the day's log with a one-word entry reading only 'fraud'",
          "read back whichever bank details appear in the office's own file so the caller's claim is either verified or shamed by its own words",
        ],
        answer: 0,
        ref: "O*NET 43-4171.00 · “providing information, taking messages” (lib/fixtures/rowspec/office.ts:425)",
        distractorNotes: [
          "Write-up leg: the KEY is the anchor's message-and-screen line — details taken, records kept, sensitive data never given aloud.",
          "Aloud-read bank details hand sensitive data to an unverified voice — the anchor's information leg runs on what's established.",
          "Immediate hang-up neither takes a message nor screens — even refusal routes through the office's own record.",
          "Reading back details to 'shame' a claim answers information the anchor lets the desk give — none of it unverified.",
        ],
      },
    ],
  },

  {
    skill: "Visitor greeting & routing",
    // corroboration row (O*NET 43-4171)
    catalogSkill: "Visitor greeting & routing",
    items: [
      // Q1 recognition
      {
        skill: "Visitor greeting & routing",
        catalogSkill: "Visitor greeting & routing",
        stem:
          "O*NET 43-4171's corroboration line: “Greet persons entering establishment, determine nature and purpose of visit, and direct or escort them to specific destinations.” What is the reception act?",
        options: [
          "greeting each arriver, learning their purpose, and pointing or walking them to their destination",
          "greeting only those visitors whose dress and posture read executive so the desk's own time is spent where it counts",
          "directing every visitor to the security desk so the office's face never carries the queue",
          "leaving a sign-in tablet at the door so visitors self-register and the desk greets only those who complete the form",
        ],
        answer: 0,
        ref: "O*NET 43-4171.00 · greeting task (lib/fixtures/rowspec/office.ts:432)",
        distractorNotes: [
          "Write-up leg: the KEY is the anchor's three-run — greet, determine, direct or escort.",
          "Dress-and-posture filtering is the reception act inverted — the anchor greets whoever enters.",
          "Security-desk dumping skips the determination and routing legs — the desk's own face carries them.",
          "Tablet self-registration greets nobody — the anchor's act is live, on arrival, in person.",
        ],
      },
      // Q2 application
      {
        skill: "Visitor greeting & routing",
        catalogSkill: "Visitor greeting & routing",
        stem:
          "A supplier representative arrives asking for procurement; a job applicant arrives for HR; both in one minute.",
        options: [
          "greet each, confirm who they've come to see, and point them to their own office's door — supplier to procurement, applicant to HR",
          "seat both in the waiting area together so they sort who goes where when their names surface on a queue",
          "greet only the supplier since deliveries carry time stakes and the applicant's queue carries its own posting",
          "send both across to the security desk since the office's own routing exists for staff, not arrivals",
        ],
        answer: 0,
        ref: "O*NET 43-4171.00 · greeting task (lib/fixtures/rowspec/office.ts:432)",
        distractorNotes: [
          "Write-up leg: the KEY greets both, determines each, and routes each to its destination — the anchor's run, applied twice.",
          "Self-sorting waiting rooms delegate the determination — the desk asks and routes, it doesn't seat-and-hope.",
          "One greeted, one not breaks the anchor's greet-all line — arrivals meet the desk, not triage.",
          "'For staff, not arrivals' inverts the anchor — routing arrivals is precisely the act.",
        ],
      },
      // Q3 judgment
      {
        skill: "Visitor greeting & routing",
        catalogSkill: "Visitor greeting & routing",
        stem:
          "A friend of a department head arrives asking to be walked straight up since “she's practically on the calendar” — no name on today's list, no appointment.",
        options: [
          "greet her warmly, say plainly the walk-up isn't on today's list, ring the head's desk for her word, and seat her accordingly",
          "walk her straight up since the head's friendship's word proves the appointment's own standing in one sentence",
          "refuse her near the door without a greeting so the register's no-name rule carries the desk's whole line",
          "log her as a general walk-in under 'visitor, unclassified' and let whichever office's staffing she next meets decide her route",
        ],
        answer: 0,
        ref: "O*NET 43-4171.00 · “determine nature and purpose of visit, and direct or escort them” (lib/fixtures/rowspec/office.ts:432)",
        distractorNotes: [
          "Write-up leg: the KEY runs the anchor's determine leg down its own route — greeting, checking, then escorting or seating.",
          "Friendship-word walk-ups are the access the determine leg exists to check — the head's desk's word is the route.",
          "Late-before-greet refusal skips the anchor's opening act — the greeting and determination both belong to the desk.",
          "'Unclassified walk-in' logging is determination abandoned — the desk's route runs ask-first, alias-later.",        ],
      },
    ],
  },

  {
    skill: "Appointment & calendar scheduling",
    // corroboration row (O*NET 43-4171)
    catalogSkill: "Appointment & calendar scheduling",
    items: [
      // Q1 recognition
      {
        skill: "Appointment & calendar scheduling",
        catalogSkill: "Appointment & calendar scheduling",
        stem:
          "O*NET 43-4171's corroboration line: “Schedule appointments and maintain and update appointment calendars.” What is the scheduling act?",
        options: [
          "confirming each requested slot, booking it into the shared calendar, and keeping that calendar alive as plans shift",
          "describing available slots aloud and booking neither — the arrival of a calendar-blocking request is a first-ask, not a first-book",
          "double-booking contested slots so whichever party declines eventually clears the collisions themselves",
          "noting requests in a personal notebook until month-end, when the shared calendar receives its one consolidated transfer",
        ],
        answer: 0,
        ref: "O*NET 43-4171.00 · scheduling task (lib/fixtures/rowspec/office.ts:439)",
        distractorNotes: [
          "Write-up leg: the KEY carries the anchor's pair — schedule the appointment and maintain the calendar it lives in.",
          "Spoken-slots-unbooked is scheduling refused mid-act — the anchor's pair books and maintains.",
          "Double-booking manufactures the collision the calendar exists to resolve — the maintenance leg never plants conflicts.",
          "Notebook-until-month-end abandons the shared calendar for the desk's own paper — planning dies in the lag.",
        ],
      },
      // Q2 application
      {
        skill: "Appointment & calendar scheduling",
        catalogSkill: "Appointment & calendar scheduling",
        stem:
          "A client requests a demo this week; two slots show open, and Thursday's 2 p.m. slot sits adjacent to a colleague's review that runs over half the time.",
        options: [
          "confirm the cleaner slot, book it in the shared calendar, and flag Thursday's 2 p.m. boundary as unavailable for the demo's own length",
          "book Thursday's 2 p.m. since the client heard it aloud first and the calendar's collision is the colleague's own read to manage",
          "describe both slots to the client and reserve neither until the client calls back with whichever choice she prefers",
          "book both slots provisionally under the cliet's name so whichever remaining review allows, the demo's own run is already seated",
        ],
        answer: 0,
        ref: "O*NET 43-4171.00 · scheduling task (lib/fixtures/rowspec/office.ts:439)",
        distractorNotes: [
          "Write-up leg: the KEY schedules one slot and keeps the calendar alive — booking made, conflict boundary flagged.",
          "Collision-booking plants the review's boundary in the demo's running time — the maintenance leg refuses the plant.",
          "Describe-and-reserve-nothing is the anchor's scheduling leg declined — the desk books, it doesn't narrate.",
          "Provisional double-booking seats two conflicts in one name — the calendar's alive-keeping leg clears, it does not stack.",        ],
      },
      // Q3 judgment
      {
        skill: "Appointment & calendar scheduling",
        catalogSkill: "Appointment & calendar scheduling",
        stem:
          "The executive's calendar shows five confirmed meetings scattered across Friday — then a must-attend board call lands at the same hour as two of them.",
        options: [
          "reschedule the two meetings' owners to their nearest workable windows, keep the board call seated, and log each move in the calendar's own record",
          "reschedule the board call since the two confirmed meetings outrank every arrival's standing — boards' calendars yield when their rooms sit double-booked",
          "leave all five in place and let the executive's own Friday morning sort whichever collisions offend once she arrives at the office",
          "cancel whichever two meetings' owners declined last quarter's invites, since their own attendance records carry the least weight to sacrifice",
        ],
        answer: 0,
        ref: "O*NET 43-4171.00 · scheduling task (lib/fixtures/rowspec/office.ts:439)",
        distractorNotes: [
          "Write-up leg: the KEY maintains the calendar alive — every move made, recorded, and the board's hour seated.",
          "Board-rescheduling inverts the executive's own priorities — must-attend reads the calendar's own call first.",
          "Collisions-left-for-morning surrender the maintenance leg entirely — the calendar's own word is the desk's job.",
          "Attendance-record-weighted sacrifice invents a ranking no record or rule carries — rescheduling runs on windows, not grudges.",
        ],
      },
    ],
  },

  {
    skill: "Mail & document handling",
    // corroboration row (O*NET 43-4171)
    catalogSkill: "Mail & document handling",
    items: [
      // Q1 recognition
      {
        skill: "Mail & document handling",
        catalogSkill: "Mail & document handling",
        stem:
          "O*NET 43-4171's corroboration lines: “Collect, sort, distribute, or prepare mail, messages, or courier deliveries” and “Transmit information or documents to customers, using computer, mail, or facsimile machine.” What is the mail-and-document job?",
        options: [
          "moving the inbound and outbound paper — collected, sorted, distributed, prepared — and the documents sent by computer, mail, or fax",
          "reading every inbound letter in full before it reaches anyone so the office's queue carries a quality you keyed yourself",
          "dumping every inbound item into one bin for a single end-of-day trip so the deliveries' own schedules ride yours",
          "leaving outgoing envelopes for somebody else to hunt down since the outbound run is its own separate desk's shift",
        ],
        answer: 0,
        ref: "O*NET 43-4171.00 · mail tasks (lib/fixtures/rowspec/office.ts:446)",
        distractorNotes: [
          "Write-up leg: the KEY is the anchor's two-run — collect/sort/distribute/prepare, then transmit by the offered channels.",
          "Full-reading-before-distribution is interception, not the anchor's collect-and-distribute act.",
          "One-bin deferral rides every delivery's schedule on the desk's own clock — the anchor's run sorts and distributes.",
          "Outbound abandonment skips the prepare-and-transmit legs the anchor's second line carries.",
        ],
      },
      // Q2 application
      {
        skill: "Mail & document handling",
        catalogSkill: "Mail & document handling",
        stem:
          "By 2 p.m., inbound holds a signed contract courier delivery and three inter-office memos; outgoing holds two client-bound envelopes awaiting the 3 p.m. courier.",
        options: [
          "receive and log the courier's delivery to its owner, sort and route the memos, and have the two envelopes staged for the 3 p.m. outbound",
          "sign the courier delivery and leave the memos and envelopes for the next morning, since the afternoon's queue resets each cycle",
          "open all three memos to summarize their contents before routing, since routed mail without summary becomes somebody else's reading",
          "dispatch the two client envelopes by personal errand and hold the signed contract at the desk until its owner's return comes expected",
        ],
        answer: 0,
        ref: "O*NET 43-4171.00 · mail tasks (lib/fixtures/rowspec/office.ts:446)",
        distractorNotes: [
          "Write-up leg: the KEY runs both directions of the anchor's pair on their own schedules — receive, sort, route, stage.",
          "Morning-reset deferrals surrender every 2 p.m. item's own clock — the mail job runs each day's flow, not cycles'",
          "Open-and-summarize all destinations' mail reads distributed correspondence — routing runs per owner, not per digest.",
          "Personal-errand dispatch rides the desk's own legs — the anchor's transmit channels carry, not your commute.",
        ],
      },
      // Q3 judgment
      {
        skill: "Mail & document handling",
        catalogSkill: "Mail & document handling",
        stem:
          "The 3 p.m. courier arrives early — 2 p.m. on the dot — and one client-bound envelope's contents are still being finalized upstairs.",
        options: [
          "dispatch what's ready, hold the pending envelope for the next outbound run, and note the hold in the day's mail record so its follow-up lands tomorrow",
          "hold the courier's whole run until the upstairs envelope reaches the desk — the batch moves together or it holds together",
          "dispatch the pending envelope unfinished so the courier's early arrival is honored and the contents' finalize rides the client's reading instead",
          "send the desk's own staff member walking the finished envelope to the client since the courier's early arrival voided the outbound run's schedule",
        ],
        answer: 0,
        ref: "O*NET 43-4171.00 · “Collect, sort, distribute, or prepare mail, messages, or courier deliveries” (lib/fixtures/rowspec/office.ts:446)",
        distractorNotes: [
          "Write-up leg: the KEY runs the anchor's flow with records intact — ready dispatched, pending held, follow-up noted.",
          "Whole-run holding stalls every client's own delivery for one envelope's finalize — the batch moves per item's readiness.",
          "Dispatching unfinished contents plants the reading's failure in the client's hands — preparation completes before transmit.",
          "Walking-errand substitution abandons the courier channel's own route — deliveries move by their channels, not by foot's convenience.",
        ],
      },
    ],
  },

  {
    skill: "Front-office record & database upkeep",
    // corroboration row (O*NET 43-4171)
    catalogSkill: "Front-office record & database upkeep",
    items: [
      // Q1 recognition
      {
        skill: "Front-office record & database upkeep",
        catalogSkill: "Front-office record & database upkeep",
        stem:
          "O*NET 43-4171's corroboration lines: “File and maintain records” and “Enter and update databases of contact information, such as names, addresses, and phone numbers.” What is the upkeep act?",
        options: [
          "keeping the contact records and logs current — records filed and database fields updated as calls surface changes",
          "filing records historically fixed — the upkeep desk files once and revisits only when an audit's request arrives",
          "writing corrections on a sticky note by the monitor so each day's batch of edits carries its own hand-held tally",
          "deleting stale client records quarterly so the database stays tidy and no outdated row outlives the season",
        ],
        answer: 0,
        ref: "O*NET 43-4171.00 · records/database tasks (lib/fixtures/rowspec/office.ts:453)",
        distractorNotes: [
          "Write-up leg: the KEY is the anchor's pair — file and maintain, enter and update — run continuously.",
          "Fixed-once filing never updates — the anchor's maintain leg runs as changes surface.",
          "Sticky-note tallies record nothing the database itself carries — the entering leg runs in the system.",
          "Quarterly deletion destroys records the anchor's filing-and-maintaining line keeps.",
        ],
      },
      // Q2 application
      {
        skill: "Front-office record & database upkeep",
        catalogSkill: "Front-office record & database upkeep",
        stem:
          "A client calls and the on-screen record shows a disconnected number from last year; she volunteers her new one unprompted.",
        options: [
          "update the record's number field as calls surface changes — and log the update's own date against the entry",
          "write the new number on a sticky note by the monitor so tomorrow's batch of updates enters the database together",
          "skip the update since records exist to be historical and the old number's entry proves the file's age honestly",
          "delete the stale client record entirely and let whichever next call regenerates the row's fresh fields",
        ],
        answer: 0,
        ref: "O*NET 43-4171.00 · “Enter and update databases of contact information” (lib/fixtures/rowspec/office.ts:453)",
        distractorNotes: [
          "Write-up leg: the KEY is the anchor's update act — the new number entered as the call surfaces it, trail logged.",
          "Sticky-note batching defers the update past the call that carried it — the database's field waits in vain.",
          "Historical-frozen records leave every next caller stranded on the disconnected line.",
          "Record-deletion abandons the file's whole trail — updating doesn't erase, it refreshes.",
        ],
      },
      // Q3 judgment
      {
        skill: "Front-office record & database upkeep",
        catalogSkill: "Front-office record & database upkeep",
        stem:
          "Two teammates' updates collided — the same client record now carries two different addresses, each entered the same week.",
        options: [
          "raise the colliding record to the owning desk, verify against the source who last keyed it, and settle one trail on the record",
          "keep both addresses side by side and let whichever next caller's response proves which one carries the current truth",
          "delete both addresses and post 'address unknown, call to verify' so the record's trail stays clean of contested facts",
          "pick the alphabetically first address and rekey the record accordingly since ties break by the system's own sort order",
        ],
        answer: 0,
        ref: "O*NET 43-4171.00 · records/database tasks (lib/fixtures/rowspec/office.ts:453)",
        distractorNotes: [
          "Write-up leg: the KEY resolves the collision through the record's own trails — verified, settled, one entry standing.",
          "Two-address stalemates keep the record contested — the upkeep act settles, it doesn't stockpile doubts.",
          "Posted 'unknown' erases whichever truth sat in one teammate's update — the verification route retrieves it.",
          "Alphabetical tie-break plants an address nobody verified — the sort order answers nothing about facts.",
        ],
      },
    ],
  },

  {
    skill: "Info & customer-service communication",
    // corroboration row (O*NET 43-4171 essential-skills layer)
    catalogSkill: "Info & customer-service communication",
    items: [
      // Q1 recognition
      {
        skill: "Info & customer-service communication",
        catalogSkill: "Info & customer-service communication",
        stem:
          "O*NET 43-4171's essential-skills layer lists it: “Speaking — Talking to others to convey information effectively” and “Active Listening — Giving full attention to what other people are saying.” What is the information desk's craft?",
        options: [
          "conveying information effectively in speech while the listening gives the speaker's words their own full attention",
          "conveying information at whichever speed the desk's own queue favors, with the listener's pace subject to it",
          "thinking ahead of each speaker's next word so your reply's first line is prepared before their sentence closes",
          "answering from whichever printed material's page the question most resembles, read back with the print's own wording",
        ],
        answer: 0,
        ref: "O*NET 43-4171.00 · essential skills (lib/fixtures/rowspec/office.ts:461)",
        distractorNotes: [
          "Write-up leg: the KEY is the anchor's pair — speaking to convey effectively and listening with full attention.",
          "Queue-speed conveying is the desk's own clock — the anchor's craft serves effectiveness, not turnover.",
          "Prepared-ahead replies abandon the listening leg — the anchor gives full attention, meaning the sentence completes.",
          "Print-readback is recital, not conveying — the question's own facts answer, phrased for the asker.",
        ],
      },
      // Q2 application
      {
        skill: "Info & customer-service communication",
        catalogSkill: "Info & customer-service communication",
        stem:
          "A walk-in asks three things: where to park, which office handles permits, and today's closing time.",
        options: [
          "answer all three clearly and courteously on the spot, at the pace the walk-in's own follow-ups permit",
          "answer only the question the wall poster prints and direct the walk-in to the poster's own shadow for the rest",
          "hand over a brochure and step slowly backwards so the walk-in's own reading answers whatever the page printed",
          "close the window for lunch first at 11:37, then respond to all three from behind the counter's shade",
        ],
        answer: 0,
        ref: "O*NET 43-4171.00 · “Provide information about establishment” (lib/fixtures/rowspec/office.ts:461)",
        distractorNotes: [
          "Write-up leg: the KEY is the anchor's conveying act — the establishment's information given, spoken clearly, all of it",
          "Poster-only answering delegates the speaking leg to printed wallpaper's own reach.",
          "Brochure-and-retreat conveys nothing the desk's own voice should carry given on the spot.",
          "Early lunch closes the desk's whole line — the establishment's information service runs to the posted hour.",
        ],
      },
      // Q3 judgment
      {
        skill: "Info & customer-service communication",
        catalogSkill: "Info & customer-service communication",
        stem:
          "An agitated visitor interrupts mid-answer three times in two minutes, each question louder and more off-topic than the last.",
        options: [
          "hold each answer's close, fold the interrupting questions' subjects into one continued reply, and walk the visitor to the desk that owns the latest ask",
          "raise your own volume to match so the counterside's next interruption arrives against a voice it can hear plainly",
          "stop answering altogether and hand the visitor a complaint form so the agitation's own noise carries an official route instead",
          "call the nearest security officer over so the visitor's agitation transfers to whoever's trained to receive it",
        ],
        answer: 0,
        ref: "O*NET 43-4171.00 · essential skills (lib/fixtures/rowspec/office.ts:461)",
        distractorNotes: [
          "Write-up leg: the KEY holds the anchor's pair under pressure — information conveyed effectively, the interruption absorbed into a route.",
          "Volume-matching abandons the active-listening leg precisely where it stops being easy.",
          "Complaint-form deflection answers the agitation with paper — the information service runs, form or no form.",
          "Security-summoning escalates rather than serves — the desk's own voice is the first answer, the officer its backup.",
        ],
      },
    ],
  },
];






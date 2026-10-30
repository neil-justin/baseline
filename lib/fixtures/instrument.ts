/**
 * The competency instrument — CONTENT BANK (user-approved 2026-10-29).
 *
 * Source of truth: `.scratch/career-path-readiness-platform/features/content/
 * instrument-competencies-draft.md` (status: APPROVED by user, all-items batch,
 * single review). 7 of 8 NACE competencies — Equity & Inclusion excluded
 * (stated choice) — × (4 self-report Likert statements + 2 verification MCQs)
 * = 28 statements + 14 MCQs = 42 items. Every string below is the doc's text
 * verbatim (statement wordings, stems, options, NACE definitions, competency
 * titles); the item IDs (COM-x.y / COM-x.Mn) are the doc's own and travel
 * unchanged to the expert CVR/CVI rating sheet. A script check
 * (`.scratch/check-instrument-verbatim.cjs`) diffs this bank against the doc.
 *
 * Evidence states (product truth, recorded in the doc's intro block):
 *  - every Likert statement is SELF-REPORT → the CLAIMED state; claimed never
 *    closes a bar and never earns ES points;
 *  - a competency is VERIFIED only when BOTH of its verification MCQs are
 *    answered correctly in the student's LATEST FULL ATTEMPT (lib/actions.ts
 *    gradeAssessment — "no partial credit carried across attempts"); retakes
 *    recompute from the latest attempt (a failed retake can drop verified —
 *    intended per the instrument philosophy; Round 7 lock, latest counts).
 *
 * The MCQ `key` values come from the doc's "Keys & rationales" block — the
 * grading lives server-side (lib/actions.ts via app/api/assessment), the
 * client reuses the same bank for the immediate per-item feedback only.
 */

import type { CompetencyStatus } from "@/lib/types";

/** The assessed seven, in the doc's order (COM-1…COM-7; E&I is not here). */
export interface InstrumentCompetency {
  /** doc heading (verbatim) */
  title: string;
  /** NACE definition (verbatim quote from the doc's blockquote) */
  definition: string;
  /** 4 self-report statements, doc IDs COM-x.1…COM-x.4 (verbatim) */
  statements: { id: string; text: string }[];
  /** 2 verification MCQs, doc IDs COM-x.M1/M2 (verbatim; key = option index) */
  mcqs: { id: string; stem: string; options: string[]; key: number }[];
}

export const INSTRUMENT: InstrumentCompetency[] = [
  {
    title: "Career & Self-Development",
    definition:
      "Proactively develop oneself and one's career through continual personal and professional learning, awareness of one's strengths and weaknesses, navigation of career opportunities, and networking to build relationships within and without one's organization.",
    statements: [
      {
        id: "COM-1.1",
        text: "When I notice a gap between what my coursework prepared me for and what postings for my target role ask for, I look for a specific way to close it — a short course, tutorial, or credential — and start it within the month.",
      },
      {
        id: "COM-1.2",
        text: "After receiving critical feedback on my work, I change something concrete in how I do that task, not just note that I heard the feedback.",
      },
      {
        id: "COM-1.3",
        text: "I can name my two strongest and two weakest work skills right now, and my list matches what teachers, mentors, or supervisors have actually told me.",
      },
      {
        id: "COM-1.4",
        text: "When a classmate or contact tells me about an opportunity — an internship, seminar, or competition — I follow up with them for details before the application closes.",
      },
    ],
    mcqs: [
      {
        id: "COM-1.M1",
        stem: "A graduating student notices that internship postings in their field repeatedly require a tool their coursework never covered. They have free evenings this month and campus access to online learning resources. Which action best demonstrates Career & Self-Development?",
        options: [
          "Wait until an employer raises it during screening, then explain that nobody taught them the tool.",
          "Post online that it is unfair their program never included the tool.",
          "Join whichever project group their friends are choosing, hoping the tool won't come up.",
          "Note what the postings actually use the tool for, pick one free course or credential that covers it, and start it this month.",
        ],
        key: 3,
      },
      {
        id: "COM-1.M2",
        stem: "A thesis adviser tells a student their drafts are thin on evidence. Over the following weeks, which behavior best demonstrates that the student used that feedback to develop?",
        options: [
          "Thank the adviser, promise to do better, and write the next draft the same way.",
          "Rewrite the weakest section using the same sources, just longer.",
          "Ask the adviser which exact weaknesses to fix, rework the two weakest sections with stronger sources, and show the revised version for comment.",
          "Ask a classmate to proofread the next draft for grammar.",
        ],
        key: 2,
      },
    ],
  },
  {
    title: "Communication",
    definition:
      "Clearly and effectively exchange information, ideas, facts, and perspectives with persons inside and outside of an organization.",
    statements: [
      {
        id: "COM-2.1",
        text: "Before I send anything I wrote, I reread it once from the reader's point of view and fix whatever a first-time reader could misread.",
      },
      {
        id: "COM-2.2",
        text: "When someone finishes explaining a task or issue to me, I restate the main point in my own words and confirm I have it right before I reply or act.",
      },
      {
        id: "COM-2.3",
        text: "When I am blocked because a piece of information is missing, I ask a specific question naming exactly what is missing, instead of waiting silently or guessing.",
      },
      {
        id: "COM-2.4",
        text: "When I explain something important in person or in a meeting, I organize it first (the point, what is needed, by when) and afterward ask whether anything was unclear.",
      },
    ],
    mcqs: [
      {
        id: "COM-2.M1",
        stem: "A new intern must tell their supervisor they still need the sales team's final figures to finish Friday's weekly report. Which message best demonstrates clear, effective communication?",
        options: [
          "Send nothing — the supervisor is busy; guess at reasonable figures and hope.",
          '"Hi Ma\'am! Good morning po 🙏 So sorry to bother you, whenever you get the chance po, if it\'s not too much trouble…" (message ends without ever asking anything)',
          '"Hi Ma\'am Santos — to finish Friday\'s weekly metrics report, I still need the final sales figures from the sales team. Could you forward them, or let me know who to ask? Thank you."',
          '"Send the sales numbers."',
        ],
        key: 2,
      },
      {
        id: "COM-2.M2",
        stem: "In a planning meeting, a supervisor verbally explains a set of instructions, and the meeting is about to end. Which response best demonstrates clear two-way communication?",
        options: [
          "Nod and agree; check the recording or notes later if something goes wrong.",
          "Repeat every instruction word for word so the supervisor hears you memorized it.",
          "Briefly restate the instructions in your own words — what is due, to whom, by when — and ask about the one point you are least sure of.",
          "Say yes now, then privately message three different teammates afterward to reconstruct what was meant.",
        ],
        key: 2,
      },
    ],
  },
  {
    title: "Critical Thinking",
    definition:
      "Identify and respond to needs based upon an understanding of situational context and logical analysis of relevant information.",
    statements: [
      {
        id: "COM-3.1",
        text: "Before I take a position on something that matters, I check at least two independent sources rather than relying on the first result I found.",
      },
      {
        id: "COM-3.2",
        text: "When a claim or figure conveniently supports a conclusion I want to make, I still check where it came from and what it actually covers before I use it.",
      },
      {
        id: "COM-3.3",
        text: "When a plan of mine fails or falls short, I go back to find the specific cause and change that, instead of repeating the same steps.",
      },
      {
        id: "COM-3.4",
        text: "When I recommend a choice, I can say what evidence it rests on and what evidence would change my mind.",
      },
    ],
    mcqs: [
      {
        id: "COM-3.M1",
        stem: "Drafting their team's project report, a student sees sales figures stable in four regions except Region 3, which dropped sharply in a single month. The team must present one recommendation tomorrow. Which response best demonstrates critical thinking?",
        options: [
          "Recommend a nationwide policy change — a drop this sharp must mean something is systemically wrong.",
          "Recommend reviewing Region 3's staff at once; the data points straight at them.",
          "Present the four stable regions as the comparison, then check with the data owner whether Region 3's drop was seasonal or a one-off event, and base the recommendation on what that check finds.",
          "Recommend no action, since the other four regions already carry the report.",
        ],
        key: 2,
      },
      {
        id: "COM-3.M2",
        stem: 'A four-member team is choosing among three venues for an outreach activity to write into a proposal due in three days. The team lead says she has "always liked" Venue B. What should the team most clearly do to demonstrate critical thinking?',
        options: [
          "Rank Venue B first to keep the team lead happy and avoid delay.",
          "Search each venue name online and go with whichever ranks first.",
          "List the criteria that will actually decide the event (capacity, cost, travel time for expected attendees), score all three venues on the same criteria, and bring the scoring to the team so the choice is justified even if it is not Venue B.",
          "Let each member feature their personal favorite, so nobody loses face.",
        ],
        key: 2,
      },
    ],
  },
  {
    title: "Leadership",
    definition:
      "Recognize and capitalize on personal and team strengths to achieve organizational goals.",
    statements: [
      {
        id: "COM-4.1",
        text: "When I coordinate a group task, I assign parts based on what each member is actually good at, not on friendship or convenience.",
      },
      {
        id: "COM-4.2",
        text: "When a teammate is quiet, stuck, or overloaded, I check in with them and find something they can own or something they need, so the work still moves.",
      },
      {
        id: "COM-4.3",
        text: "When I see a teammate do something well, I say so to them or to the group in the moment, not just privately afterward.",
      },
      {
        id: "COM-4.4",
        text: "When a group project has no clear structure or owner, I propose the plan and next steps instead of waiting for someone else to.",
      },
    ],
    mcqs: [
      {
        id: "COM-4.M1",
        stem: "Two members of a five-person group disagree on how to build the output, the project has four days left, and progress has stopped. Which response best demonstrates leadership?",
        options: [
          "Table the issue for the adviser to arbitrate — settling disagreements is an instructor's job.",
          "Side with the member whose track record is spotless and move on.",
          "List what each of the two members does best, split the work to match those strengths under one agreed structure, and set a checkpoint the next day.",
          "Take all of the remaining work on yourself and push it out night after night.",
        ],
        key: 2,
      },
      {
        id: "COM-4.M2",
        stem: "The group's proposal was sent back with heavy corrections and morale is visibly low. Which response best demonstrates leadership?",
        options: [
          'Tell the group "it will be fine" and leave it at that.',
          "Name what the reviewers did credit, walk the group through one concrete correction each member can own, and set the next check-in time.",
          "Complain to the group about the reviewers and draft an appeal.",
          "Do all the corrections yourself so the group doesn't have to think about it.",
        ],
        key: 1,
      },
    ],
  },
  {
    title: "Professionalism",
    definition:
      "Knowing work environments differ greatly, understand and demonstrate effective work habits, and act in the interest of the larger community and workplace.",
    statements: [
      {
        id: "COM-5.1",
        text: "I show up prepared at scheduled commitments — classes, internship or job shifts, duty, team checkpoints — on time and with what is needed, without being reminded.",
      },
      {
        id: "COM-5.2",
        text: "When I am running late or foresee missing a deadline, I tell the affected person before the time arrives and say when they can expect what from me, instead of letting them find out afterward.",
      },
      {
        id: "COM-5.3",
        text: "Before submitting anything that carries my name — report, slide, application form — I check the details once from top to bottom and correct what I catch.",
      },
      {
        id: "COM-5.4",
        text: "When I post online, I write as someone a future employer or the institution I belong to may read.",
      },
    ],
    mcqs: [
      {
        id: "COM-5.M1",
        stem: "At 2:00 PM, an intern realizes the task due to a supervisor at 5:00 PM today actually needs about three more hours. What is the most professional action?",
        options: [
          "Hand in whatever is finished by 5:00, even if half-done — arriving on time with part of the work still shows dependability.",
          "Finish tonight and send it by morning; if the supervisor asks, apologize and explain.",
          "Before 5:00, message the supervisor: what is done, what needs the extra hours, when it will land, and whether that timing works — and adjust only after they respond.",
          "Hand the unfinished parts to a classmate to rush without checking, and submit whatever comes back by 5:00.",
        ],
        key: 2,
      },
      {
        id: "COM-5.M2",
        stem: "While giving a teammate's chart a final look before their section is submitted, a student notices one typed figure is wrong — and it makes the results look better. What is the most professional action?",
        options: [
          "Leave it: the section is the teammate's responsibility, and flagging it could come across as interfering.",
          "Tell the teammate privately now, show the correct figure and where it came from, and let them fix and own the correction before submission.",
          "Post the correction in the team group chat immediately so it is documented before submission.",
          "Quietly replace the figure on the spot and say nothing.",
        ],
        key: 1,
      },
    ],
  },
  {
    title: "Teamwork",
    definition:
      "Build and maintain collaborative relationships to work effectively toward common goals, while appreciating diverse viewpoints and shared responsibilities.",
    statements: [
      {
        id: "COM-6.1",
        text: "When a teammate proposes an approach I did not think of, I listen and work out how it could succeed before I judge it.",
      },
      {
        id: "COM-6.2",
        text: "I finish my assigned parts without needing follow-ups, and I tell the team ahead of time if I might miss one.",
      },
      {
        id: "COM-6.3",
        text: "When two teammates lock into a disagreement, I try to help find an option both can accept, instead of taking only my side or staying out of it.",
      },
      {
        id: "COM-6.4",
        text: "When a team result disappoints, I own my share of it first, instead of leading with whose fault it was.",
      },
    ],
    mcqs: [
      {
        id: "COM-6.M1",
        stem: "For three days, two teammates have been overwriting each other's sections of the same deliverable, and both are frustrated. Which response best demonstrates teamwork?",
        options: [
          "Ask the adviser to reassign them to different parts.",
          "Tell the more reliable of the two to take the whole deliverable alone and let the other back off.",
          "Call a ten-minute checkpoint: agree who owns each section, that the owner holds final say after a round of comments, and review the split tomorrow against the deadline.",
          "Let both keep editing — two opinions editing the same work should produce a better result.",
        ],
        key: 2,
      },
      {
        id: "COM-6.M2",
        stem: "Two teammates propose opposite ways to finish an urgent deliverable: one proven but slower, one faster but riskier. Which response best demonstrates teamwork?",
        options: [
          "Go with whichever proposal already has the group's majority.",
          "Insist on the approach your own part was built around, to avoid redoing work.",
          "Lay both approaches side by side on the few things that actually decide it (deadline, quality bar, what happens if the faster one slips), hear both out, then pick as a group by those criteria.",
          "Follow whichever teammate speaks with the most confidence.",
        ],
        key: 2,
      },
    ],
  },
  {
    title: "Technology",
    definition:
      "Understand and leverage technologies ethically to enhance efficiencies, complete tasks, and accomplish goals.",
    statements: [
      {
        id: "COM-7.1",
        text: "When a task I do regularly becomes repetitive, I look for a template, built-in feature, or small automation to speed it up — and I check the result is still correct.",
      },
      {
        id: "COM-7.2",
        text: "When I encounter a tool, platform, or app I have never used, I reach basic working competence by reading its guide or a short tutorial on my own, instead of waiting for someone to walk me through every step.",
      },
      {
        id: "COM-7.3",
        text: "When I organize information other people will use, I put it where they can open it — a shared, structured file or workspace — instead of burying it in a chat thread.",
      },
      {
        id: "COM-7.4",
        text: "When I use AI or another automated tool for anything I will submit, I read the output, verify it, and follow my class or workplace rules about such use.",
      },
    ],
    mcqs: [
      {
        id: "COM-7.M1",
        stem: "A student must turn 40 short feedback replies sitting in a group chat into a one-page summary. Which approach best demonstrates productive, responsible use of technology?",
        options: [
          "Retype all 40 replies by hand into a document, then summarize.",
          "Paste the replies into a spreadsheet, sort or group them by topic, spot-check the grouping against the original thread, then write the summary from the grouped view.",
          "Take a screenshot of the thread, let an AI tool write the summary, and submit that summary directly.",
          "Write the summary from memory; you already read most of the replies when they arrived.",
        ],
        key: 1,
      },
      {
        id: "COM-7.M2",
        stem: "On the first week of an internship, the office runs on a task-tracking system the student has never seen. Training covers the basics once; a small real task is due shortly. Which response best demonstrates adaptive use of technology?",
        options: [
          "Wait for the office to schedule a refresher training before touching any task.",
          "Open the system's own help or guide, walk through the steps while completing their one small task, and ask the assigned buddy one specific question about any rule the guide does not cover.",
          "Keep using a paper notebook and hand the entries over afterward, since it is more familiar.",
          "Fill in the fields in whatever order seems right and fix them later if someone complains.",
        ],
        key: 1,
      },
    ],
  },
];

/** Canonical flat views for the grader and e2e. */
export const INSTRUMENT_MCQ_BY_ID = new Map(
  INSTRUMENT.flatMap((c) => c.mcqs.map((m) => [m.id, m] as const))
);
export const INSTRUMENT_STATEMENT_IDS = INSTRUMENT.flatMap((c) =>
  c.statements.map((s) => s.id)
);
export const INSTRUMENT_MCQ_IDS = INSTRUMENT.flatMap((c) => c.mcqs.map((m) => m.id));

export const INSTRUMENT_LIKERT_SCALE: { value: number; label: string }[] = [
  { value: 1, label: "Never" },
  { value: 2, label: "Rarely" },
  { value: 3, label: "Sometimes" },
  { value: 4, label: "Often" },
  { value: 5, label: "Consistently" },
];

/** Full-attempt answer payload (the instrument's one write, app/api/assessment). */
export interface InstrumentAnswers {
  /** statement id → rating 1–5 (all 28 required — a full attempt) */
  likert: Record<string, number>;
  /** MCQ id → chosen option index 0..3 (all 14 required) */
  mcq: Record<string, number>;
}

/** The doc's grading rule: verified ⇔ BOTH MCQs correct in THIS attempt. */
export function gradeInstrumentAnswers(
  answers: InstrumentAnswers
): Record<string, CompetencyStatus> {
  const out: Record<string, CompetencyStatus> = {};
  for (const c of INSTRUMENT) {
    const bothCorrect = c.mcqs.every((m) => answers.mcq[m.id] === m.key);
    out[c.title] = bothCorrect ? "verified" : "claimed";
  }
  return out;
}

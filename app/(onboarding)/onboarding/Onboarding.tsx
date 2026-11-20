"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, X } from "lucide-react";
import { SegRubricBar } from "@/components/instrument";
import { Skeleton, SkeletonBlock, SkeletonQuestionCard } from "@/components/skeleton";
import QuestionCard, { TallyRow } from "@/components/quiz/QuestionCard";
import { CAREERS, TRACKS, TRACK_LABELS, trackLabelOf } from "@/lib/fixtures/catalog";
import { RESOURCES } from "@/lib/fixtures/resources";
import { canonProgramsOf } from "@/lib/fixtures/programs";
import { INTEREST_ITEMS } from "@/lib/fixtures/interest";
import {
  INSTRUMENT,
  INSTRUMENT_LIKERT_SCALE,
  gradeInstrumentAnswers,
  type InstrumentAnswers,
} from "@/lib/fixtures/instrument";
import { degreeGateAllows } from "@/lib/degree-gate";
import {
  scoreInterest,
  rankCareers,
  rankLetters,
  lowConfidence,
  type InterestAnswers,
} from "@/lib/engines/interest";
import { openSkills, stageOne } from "@/lib/engines/gaps";
import { WEIGHTS } from "@/lib/engines/score";
import { skillDisplay } from "@/lib/skill-display";
import { getSkillLadder } from "@/lib/fixtures/skill-banks";
import type { Career, CompetencyStatus, Goal } from "@/lib/types";
import {
  clearDraft,
  loadDraft,
  saveDraft,
  type DraftStep,
  type OnboardingDraft,
} from "@/lib/onboarding-draft";
import { GOAL_SUGGESTION, TRACK_TAGLINES, VERIFY_BANK, type VMCQ } from "./banks";

/**
 * Onboarding ①–⑤ — one client-side stepper (funnel rework, 2026-11-06).
 * Screens: strand (①a track pick) → program (①b full-screen program select) →
 *   branch →
 *   yes  → program-gated career picker (commit AT PICK) →
 *   no   → RIASEC quiz, 18 items, one per screen → ranked top-3 cards →
 * SKILLS: QuestionCard verification ladders on ALL core-tier skills of the
 *   picked career (no claims step, no cap; ladder skills run their 3 rungs;
 *   legacy skills keep their banked single item) →
 * ASSESS: the NACE instrument as a flat one-card cadence (2026-11-06) —
 *   42 cards total (per competency: 4 Likert statement cards then its 2
 *   verification MCQ cards), one QuestionCard-style card per screen with
 *   a persistent "COMPETENCY n OF 7 · title" sub-label + "QUESTION k OF
 *   42" counter, Back crossing competency boundaries naturally, ONE
 *   final POST /api/assessment (payload byte-same) →
 * GOAL: suggestion card → reveal (starting-line copy).
 *
 * Evidence states per product truth: Likert ratings alone → CLAIMED; a
 * competency is VERIFIED ⇔ BOTH of its MCQs are answered correctly in the
 * LATEST FULL attempt — one server write (POST /api/assessment) at the end
 * of page 7; retakes overwrite (latest counts, Round 7 lock). The
 * client-side keys drive the immediate per-item feedback only — the result
 * screen reads the SERVER's grade.
 *
 * Autosave + re-entry: every step patches a per-student localStorage draft
 * (lib/onboarding-draft.ts, schema v2 — the Assess autosave drafts the
 * running card index; a legacy v1 draft's answers still restore while its
 * page index is dropped and the running card is re-derived). A returning student gets the slim
 * restore banner under the stepper: Continue jumps to the saved step with
 * its state restored; start over POSTs /api/onboarding/reset (confirm:
 * "RESET") and wipes the draft.
 */

type Level = "confident" | "kindof" | "notyet";
type Screen = DraftStep;

const STEP_OF: Record<Screen, number> = {
  strand: 1,
  program: 1,
  branch: 2,
  careers: 2,
  quiz: 2,
  cards: 2,
  verify: 3,
  assessIntro: 4,
  nace: 4,
  assessResult: 4,
  goal: 5,
  reveal: 5,
};
const STEP_LABELS = ["Background", "Career", "Skills", "Assess", "Goal"];

/** Steps whose state the restore banner can actually rebuild. Screens that
 * need a server round-trip artifact (the NACE grade) fall back in restore. */
const RESUMABLE: Screen[] = [
  "strand",
  "program",
  "branch",
  "careers",
  "quiz",
  "cards",
  "verify",
  "assessIntro",
  "nace",
  "goal",
  "reveal",
];

/* the 5-point interest chips (item scale, lib/fixtures/interest.ts semantics:
 * 5 = strongly like … 1 = strongly dislike; the engine nets v−3) */
const INTEREST_SCALE: { v: number; label: string }[] = [
  { v: 5, label: "Strongly like" },
  { v: 4, label: "Like" },
  { v: 3, label: "Unsure" },
  { v: 2, label: "Dislike" },
  { v: 1, label: "Strongly dislike" },
];

const STATEMENT_TOTAL = INSTRUMENT.reduce((n, c) => n + c.statements.length, 0);
const MCQ_TOTAL = INSTRUMENT.reduce((n, c) => n + c.mcqs.length, 0);
/** flat MCQ order: COM-1.M1, COM-1.M2, … COM-7.M2 (the POST contract's key set) */
const MCQ_RUN = INSTRUMENT.flatMap((c) => c.mcqs.map((m) => ({ comp: c, mcq: m })));

/* ---------- the flat card cadence (2026-11-06, one card at a time) ----------
 * Every question of the step is its own card, in sitting order: per
 * competency its 4 Likert statement cards then its 2 check cards —
 * 28 + 14 = 42 cards for a fresh sitting. Back moves card k-1 whatever
 * it is; the final card (last check) is "Finish". */

type NaceCard =
  | { kind: "likert"; compIdx: number; stmtIdx: number }
  | { kind: "check"; compIdx: number; mcqIdx: number };

const NACE_CARDS: NaceCard[] = INSTRUMENT.flatMap((c, compIdx) => [
  ...c.statements.map((_s, stmtIdx): NaceCard => ({ kind: "likert", compIdx, stmtIdx })),
  ...c.mcqs.map((_m, mcqIdx): NaceCard => ({ kind: "check", compIdx, mcqIdx })),
]);

const getCareer = (id: string): Career | null => CAREERS.find((c) => c.id === id) ?? null;

/* ---------- the verify-slot ladder draw (KEPT machinery, 2026-11-05/06
 * agent wiring — only the draw LIST changed: ALL core-tier skills of the
 * picked career, roster order, no claimed filter, no ≤5 cap) ---------- */

type VSlot = { item: VMCQ; skill: string; ladderSkill: string | null; rung: number };

function drawVerifySlots(career: Career | null): VSlot[] {
  const slots: VSlot[] = [];
  for (const spec of career?.skills.filter((s) => s.tier === "core") ?? []) {
    const ladder = getSkillLadder(spec.name);
    if (ladder) {
      ladder.items.forEach((it, r) =>
        slots.push({ item: it, skill: spec.name, ladderSkill: ladder.catalogSkill, rung: r })
      );
    } else {
      const banked = VERIFY_BANK.find((b) => b.catalogSkill === spec.name);
      if (banked) slots.push({ item: banked, skill: spec.name, ladderSkill: null, rung: 0 });
    }
  }
  if (slots.length === 0) {
    for (const b of VERIFY_BANK) slots.push({ item: b, skill: b.skill, ladderSkill: null, rung: 0 });
  }
  return slots;
}

/** GET /api/state payload (frozen read-only endpoint). */
interface StateView {
  state: {
    id: string;
    name: string;
    yearLevel: string;
    track: string;
    careerId: string | null;
    bars: Record<string, { source: string }>;
    competencies?: Record<string, CompetencyStatus>;
    goals: Goal[];
    stageOneDone: number;
  };
  career: Career | null;
  score: { sp: number; es: number; tp: number; ar: number | null; cc: number; total: number } | null;
}

export default function Onboarding({
  studentId,
  program: initialProgram,
}: {
  studentId: string;
  program: string | null;
}) {
  /* retake mode retired 2026-11-18: the in-funnel retake redirect moved to
     the focused /assessment route (page.tsx), so the funnel is first-run
     only — the dead `retake` prop and its branches were removed 2026-11-20. */
  const [screen, setScreen] = useState<Screen>("strand");

  /* step ① Background: the track, then the program dropdown (it appears once
     the track is picked, filtered to that track's canon programs) */
  const [strand, setStrand] = useState<string | null>(null);
  const [program, setProgram] = useState<string>(initialProgram ?? "");

  /* step ② Career: the RIASEC quiz (int answers) → the ranked cards → the
     pick-time commit */
  const [interest, setInterest] = useState<Record<string, number>>({});
  const [qi, setQi] = useState(0);
  const [careerId, setCareerId] = useState<string | null>(null);

  /* step ③ Skills — the kept verify-slot machinery */
  type VView = "question" | "result";
  const [vView, setVView] = useState<VView>("question");
  const [vSlots, setVSlots] = useState<VSlot[]>([]);
  const [vPicks, setVPicks] = useState<(number | null)[]>([]);
  const [vi, setVi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [vResults, setVResults] = useState<boolean[]>([]);

  /* step ④ Assess — the flat card cadence (one card per screen) */
  const [naceCard, setNaceCard] = useState(0);
  const [likertChoices, setLikertChoices] = useState<Record<string, number>>({});
  const [mcqChoices, setMcqChoices] = useState<Record<string, number>>({});
  /** the SERVER's grade for the just-completed attempt (assessResult reads it) */
  const [grade, setGrade] = useState<Record<string, CompetencyStatus> | null>(null);
  const [posting, setPosting] = useState(false);
  /* the commit-POST flight (user deferral 2026-11-06: the cards screen
   * holds its skeleton over the grid while /api/career is in flight,
   * then walks on) */
  const [committing, setCommitting] = useState(false);
  /* the per-ladder verdict-POST flight at the rung-result transition */
  const [vPosting, setVPosting] = useState(false);

  /* the restore banner (re-entry) — `null` = draft still un-read; the banner
   * renders NOTHING until the localStorage check has resolved (fix 2026-11-06:
   * no flash on plain reload) */
  const [restored, setRestored] = useState<OnboardingDraft | null>(null);
  const [draftResolved, setDraftResolved] = useState(false);
  /* the drawn verify-slot items (kept machinery consumes this array) */
  const [quizItems, setQuizItems] = useState<VMCQ[]>(VERIFY_BANK);

  /* step ⑤ Goal + reveal */
  const [goalTitle, setGoalTitle] = useState("");
  const [goalToast, setGoalToast] = useState<string | null>(null);
  const [view, setView] = useState<StateView | null>(null);
  const [armed, setArmed] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const career = careerId ? getCareer(careerId) : null;
  const trackCount = (t: string) => CAREERS.filter((c) => c.track === t).length;
  /** the program gate — the Background pick (empty program feeds no gate) */
  const gate = (c: Career) => degreeGateAllows(program, c.degreeMap);

  useEffect(() => {
    window.scrollTo(0, 0);
    // OB-4 pre-fill: the goal card mounts with the suggested title (OB-4.2),
    // editable inline; leaving the screen resets it for the next pass.
    if (screen === "goal" && sug) setGoalTitle(sug.title);
  }, [screen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    []
  );

  /* ---- re-entry: the draft banner ---- */
  useEffect(() => {
    const draft = loadDraft(studentId) ?? null;
    setRestored(draft);
    setDraftResolved(true); // held hidden until this resolves — no reload flash
  }, [studentId]);

  /* ---- autosave: every step patches the draft (per student) ---- */
  useEffect(() => {
    if (!strand && !careerId) return; // nothing worth restoring yet
    saveDraft(studentId, {
      step: screen,
      track: strand ?? undefined,
      program: program || undefined,
      careerId: careerId ?? undefined,
      interest: Object.keys(interest).length ? interest : undefined,
      vPicks: vPicks.length ? vPicks : undefined,
      vIndex: vPicks.length ? vi : undefined,
      naceCard,
      naceLikert: Object.keys(likertChoices).length ? likertChoices : undefined,
      naceMcq: Object.keys(mcqChoices).length ? mcqChoices : undefined,
    });
  }, [
    studentId,
    screen,
    strand,
    program,
    careerId,
    interest,
    vPicks,
    vi,
    naceCard,
    likertChoices,
    mcqChoices,
  ]);

  function go(next: Screen) {
    setScreen(next);
  }

  function back(target: Screen) {
    setScreen(target);
  }

  /* ---- restore banner actions ---- */

  function continueDraft() {
    const d = restored;
    if (!d) return;
    setStrand(d.track ?? null);
    setProgram(d.program ?? "");
    let slots: VSlot[] = [];
    if (d.careerId) {
      const c = getCareer(d.careerId);
      if (c) {
        slots = drawVerifySlots(c);
        setVSlots(slots);
        setVPicks(
          d.vPicks && d.vPicks.length === slots.length
            ? [...d.vPicks]
            : new Array(slots.length).fill(null)
        );
        setVResults(new Array(slots.length).fill(false));
        setVi(
          d.vIndex != null && d.vIndex >= 0 && d.vIndex < slots.length && d.vPicks?.[d.vIndex] != null
            ? d.vIndex + 1
            : 0
        );
        setPicked(null);
        setAnswered(false);
        setVView("question");
        setCareerId(d.careerId);
      }
    }
    setInterest(d.interest ?? {});
    setQi(Math.max(INTEREST_ITEMS.findIndex((it) => !((d.interest ?? {})[it.id] != null)), 0));
    setLikertChoices(d.naceLikert ?? {});
    setMcqChoices(d.naceMcq ?? {});
    setNaceCard(restoreNaceCard(d));

    const answers = d.interest ?? {};
    const allAnswered = INTEREST_ITEMS.every((it) => answers[it.id] != null);
    let target = RESUMABLE.includes(d.step) ? d.step : d.careerId ? "goal" : "nace";
    if (target === "quiz" && allAnswered) target = "cards";
    if (target === "verify" && slots.length === 0) target = "branch";
    if ((target === "careers" || target === "quiz" || target === "cards") && !slots.length && d.careerId) {
      // a career already committed — jumping back into the picker would
      // re-commit; resume at the skills step instead
      target = "verify";
    }
    setRestored(null);
    setScreen(target);
  }

  async function startOver() {
    try {
      await fetch("/api/onboarding/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student: studentId, confirm: "RESET" }),
      });
    } catch {
      /* offline → the local wipe still gives a fresh funnel */
    }
    clearDraft(studentId);
    setRestored(null);
    setStrand(null);
    setProgram(initialProgram ?? "");
    setCareerId(null);
    setInterest({});
    setQi(0);
    setVSlots([]);
    setVPicks([]);
    setVResults([]);
    setVi(0);
    setPicked(null);
    setAnswered(false);
    setVView("question");
    setLikertChoices({});
    setMcqChoices({});
    setNaceCard(0);
    setGrade(null);
    setGoalTitle("");
    setGoalToast(null);
    setView(null);
    setScreen("strand");
  }

  /* ---- step ① Background ---- */

  function backgroundContinue() {
    if (!strand || !program) return;
    go("branch");
  }

  /* ---- step ② no-branch · the RIASEC quiz: one tap = answer + advance ---- */

  function pickInterest(itemId: string, v: number) {
    setInterest({ ...interest, [itemId]: v });
    if (qi + 1 >= INTEREST_ITEMS.length) {
      go("cards"); // computed immediately — no skeleton round (deferred)
    } else {
      setQi(qi + 1);
    }
  }

  /** the computed ranking — gate FIRST (lib/degree-gate.ts semantics via the
   *  shared predicate), RIASEC order only; canon roster order breaks ties. */
  function suggestionResults() {
    if (!strand) return { top: [], low: false, topLetters: [] as ReturnType<typeof rankLetters> };
    const scores = scoreInterest(
      Object.fromEntries(
        Object.entries(interest).filter(([, v]) => v >= 1 && v <= 5)
      ) as InterestAnswers
    );
    const trackCareers = CAREERS.filter((c) => c.track === strand);
    return {
      top: rankCareers(scores, trackCareers, gate).slice(0, 3),
      low: lowConfidence(scores),
      topLetters: rankLetters(scores),
    };
  }

  /* ---- the pick-time commit — BOTH career branches call the SAME commit
   *      the moment a card is chosen (kills the stale-pick bug: the back
   *      button can no longer leave the dashboard without the pick) ---- */

  async function commitCareer(id: string) {
    setCareerId(id);
    const slots = drawVerifySlots(getCareer(id));
    setVSlots(slots);
    setQuizItems(slots.map((s) => s.item));
    setVPicks(new Array(slots.length).fill(null));
    setVResults(new Array(slots.length).fill(false));
    setVi(0);
    setPicked(null);
    setAnswered(false);
    setVView("question");
    saveDraft(studentId, { step: "verify", careerId: id });
    // user deferral 2026-11-06: the commit NOW carries the walk — the cards
    // screen holds a skeleton while the POST runs, then the funnel advances.
    setCommitting(true);
    try {
      const res = await fetch("/api/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ careerId: id, track: strand ?? undefined, program: program || undefined }),
      });
      // not fatal: the canon replay hits "already set" and keeps walking —
      // a real new student must get elsewise a 4xx surfaces at the reveal
      // exit, so we surface rather than silently swallow.
      if (!res.ok && !/already/i.test(await res.text().catch(() => ""))) {
        console.warn("career commit failed", res.status);
      }
    } catch {
      /* offline store is the demo — the draft keeps the funnel walkable */
    } finally {
      setCommitting(false);
      go("verify");
    }
  }

  /* ---- step ③ Skills — the kept verify-slot machinery (unmodified
   *      contract: ladder skills POST ONCE at result time {skill,
   *      answers:[3]}; legacy single items keep the one-shot
   *      {skill, passed} POST) ---- */

  function answerVerify(slot: VSlot, i: number) {
    const passed = i === slot.item.answer;
    setPicked(i);
    setAnswered(true);
    setVResults((prev) => {
      const next = [...prev];
      next[vi] = passed;
      return next;
    });
    setVPicks((prev) => {
      const next = [...prev];
      next[vi] = i;
      return next;
    });
    // legacy single-item skills keep the OLD immediate one-shot POST.
    // Ladder skills never POST a rung — one POST per skill at result time,
    // so the server's all-or-nothing ladder grade is the only verdict.
    if (!slot.ladderSkill) {
      fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student: studentId, skill: slot.item.catalogSkill, passed }),
      }).catch(() => {});
    }
  }

  function verifyNext() {
    if (vi + 1 >= quizItems.length) {
      // user deferral 2026-11-06: the result transition holds a skeleton
      // while the per-ladder verdict POSTs run, then paints the verdict.
      setVPosting(true);
      sendVerdicts().finally(() => {
        setVPosting(false);
        setVView("result");
      });
    } else {
      setVi(vi + 1);
      setPicked(null);
      setAnswered(false);
    }
  }

  /* One POST per ladder skill whose three rungs were all answered; rungs
   * left unanswered mean no POST — the claim simply stays a claim.
   * Returns when every POST has settled (the result skeleton releases). */
  async function sendVerdicts() {
    const bySkill = new Map<string, (number | null)[]>();
    vSlots.forEach((s, idx) => {
      if (!s.ladderSkill) return;
      const arr = bySkill.get(s.ladderSkill) ?? [];
      arr[s.rung] = vPicks[idx];
      bySkill.set(s.ladderSkill, arr);
    });
    const posts: Promise<unknown>[] = [];
    bySkill.forEach((arr, skill) => {
      if (arr.length !== 3 || arr.some((a) => typeof a !== "number")) return;
      posts.push(
        fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student: studentId, skill, answers: arr as number[] }),
        }).catch(() => {})
      );
    });
    await Promise.all(posts);
  }

  /* ---- step ④ Assess — the flat card cadence (42 cards, one per screen) ---- */

  function rate(item: string, value: number) {
    setLikertChoices((prev) => ({ ...prev, [item]: value }));
  }

  function answerSituational(mcqId: string, i: number) {
    setMcqChoices((prev) => ({ ...prev, [mcqId]: i }));
  }

  /** the saved card on restore. */
  function restoreNaceCard(d: OnboardingDraft): number {
    if (d.naceCard != null && d.naceCard >= 0 && d.naceCard < NACE_CARDS.length) return d.naceCard;
    /* legacy v1 draft: no card analogue for its page index — re-derive the
     * running card as the first unanswered card (last card when complete). */
    const firstOpen = NACE_CARDS.findIndex((c) =>
      c.kind === "likert"
        ? (d.naceLikert ?? {})[INSTRUMENT[c.compIdx].statements[c.stmtIdx].id] == null
        : (d.naceMcq ?? {})[INSTRUMENT[c.compIdx].mcqs[c.mcqIdx].id] == null
    );
    return firstOpen >= 0 ? firstOpen : NACE_CARDS.length - 1;
  }

  function naceBack() {
    if (naceCard > 0) {
      setNaceCard(naceCard - 1);
    } else {
      back("assessIntro");
    }
  }

  function naceNext() {
    const card = NACE_CARDS[naceCard];
    if (!card) return;
    /* the per-item gate: this one card requires its answer (the Next
     * gating reused per item) */
    const answered =
      card.kind === "likert"
        ? likertChoices[INSTRUMENT[card.compIdx].statements[card.stmtIdx].id] != null
        : mcqChoices[INSTRUMENT[card.compIdx].mcqs[card.mcqIdx].id] != null;
    if (!answered) return;
    if (naceCard + 1 < NACE_CARDS.length) {
      setNaceCard(naceCard + 1);
      return;
    }
    // last card (the final check) — the full attempt writes ONCE, then the
    // result screen shows the SERVER's grade (never a client verdict)
    submitAssessment();
  }

  async function submitAssessment() {
    setPosting(true);
    const payload: InstrumentAnswers = {
      likert: Object.fromEntries(
        INSTRUMENT.flatMap((c) => c.statements.map((s) => [s.id, likertChoices[s.id] ?? 0]))
      ),
      mcq: Object.fromEntries(
        MCQ_RUN.map(({ mcq }) => [mcq.id, mcqChoices[mcq.id] ?? -1])
      ),
    };
    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data?.state?.competencies) {
        setGrade(data.state.competencies);
      } else {
        setGrade(gradeInstrumentAnswers(payload)); // honest offline fallback (store is the demo)
      }
    } catch {
      setGrade(gradeInstrumentAnswers(payload)); // store offline → local compute, same rule
    } finally {
      setPosting(false);
      go("assessResult");
    }
  }

  const likertAnswered = Object.keys(likertChoices).length;

  /* ---- step ⑤ Goal ---- */
  const sug = GOAL_SUGG(((careerId && GOAL_SUGGESTION[careerId]) || (career ? GOAL_SUGGESTION[career.id] : null)) ?? null, career);

  async function setGoal() {
    if (!career || !sug) return;
    const edited = goalTitle !== sug.title;
    let note = "Goal set. It's now on your Progress page.";
    try {
      const res = await fetch("/api/goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student: studentId,
          title: goalTitle,
          type: "training",
          resourceId: sug.resourceId,
          skill: sug.skill,
        }),
      });
      const data = await res.json();
      if (!edited && typeof data?.note === "string") note = data.note;
    } catch {
      /* offline store is the demo; the local toast copy above still stands */
    }
    setGoalToast(edited ? "Goal updated." : note);
    timers.current.push(setTimeout(() => go("reveal"), 1100));
  }

  function skipGoal() {
    // the skip-side completion stamp — skip completes onboarding too
    fetch("/api/onboarding/finish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student: studentId }),
    }).catch(() => {});
    go("reveal");
  }

  /* ---- reveal — every number fetched/engine-derived, never painted ---- */
  useEffect(() => {
    if (screen !== "reveal" || view) return;
    fetch("/api/state")
      .then((r) => r.json())
      .then((data: StateView) => setView(data))
      .catch(() => {});
  }, [screen, view]);

  useEffect(() => {
    if (!view) return;
    timers.current.push(setTimeout(() => setArmed(true), 350));
  }, [view]);

  const step = STEP_OF[screen];

  /* audit round 2026-11-06: on narrow screens the steps strip scrolls —
     keep the CURRENT step in view wherever the walk lands (asses/goal
     screens sit off-canvas at 390 otherwise). DOM-only, layout-property
     free (scrollLeft is the strip's own scroll — CLS-contract safe). */
  useEffect(() => {
    const strip = document.querySelector<HTMLElement>(".ob-steps-strip");
    if (!strip) return;
    const now = strip.querySelector<HTMLElement>(".ob-step.now");
    if (now && strip.scrollWidth > strip.clientWidth) {
      const target = now.offsetLeft - strip.clientWidth / 2 + now.offsetWidth / 2;
      strip.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
    }
  }, [step]);

  const trackPrograms = strand ? canonProgramsOf(strand) : [];

  return (
    <div className="v7ob">
      {/* OB-0 · the header band — names the surface + the 5-step instrument */}
      <header className="ob-band">
        <div className="ob-band-in">
          <div className="ob-band-who">
            <span className="ob-band-name">Getting started</span>
            <span className="ob-band-meta">
              Five short steps — about 15 minutes.
            </span>
          </div>
          <nav className="ob-steps-strip" aria-label="Onboarding steps" data-now={step}>
            {STEP_LABELS.map((l, i) => {
              const idx = i + 1;
              const cls = idx === step ? "now" : idx < step ? "done" : "todo";
              return (
                <span key={l} className={`ob-step ${cls}`}>
                  <span className="ob-step-num" aria-hidden="true">
                    {idx < step ? <Check size={12} aria-hidden="true" /> : idx}
                  </span>
                  <span className="ob-step-label">{l}</span>
                </span>
              );
            })}
          </nav>
        </div>
      </header>

      {/* re-entry banner — in-flow pill between the header band and the
          page content (no fixed pinning → never overlaps other text);
          dismiss hides it for the session only (the draft survives and
          re-offers on the next visit) */}
      {draftResolved && restored && (
        <div className="ob-restore" role="status">
          <span className="ob-restore-line">
            Progress from{" "}
            <b>{new Date(restored.savedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</b>{" "}
            restored — Continue where you left off, or start over.
          </span>
          <div className="ob-restore-ctas">
            <button className="btn btn-primary" type="button" onClick={continueDraft}>
              Continue
            </button>
            <button className="ob-quiet" type="button" onClick={startOver}>
              start over
            </button>
            <button
              className="ob-restore-close"
              type="button"
              aria-label="Dismiss restore notice"
              onClick={() => setRestored(null)}
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <div className="shell ob-shell">
        {/* screen-entrance wrapper — keyed on the screen so each Next/Back
            step re-runs the 140ms fade/slide (fix 2026-11-06); inside the
            Assess step the key extends to the running card so each card
            move animates too (one-card cadence, 2026-11-06) */}
        <div className="ob-anim" key={screen === "nace" ? `nace:${naceCard}` : screen}>
        {/* ============ ①a Background · the track pick ============ */}
        {screen === "strand" && (
          <section className="ob-screen wide">
            <div className="screen-head">
              <h1>What track are you in?</h1>
            </div>
            <div className="strand-grid">
              {TRACKS.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`panel strand-card ${strand === t ? "sel" : ""}`}
                  onClick={() => { setStrand(t); go("program"); }}
                >
                  <span className="t-name">{TRACK_LABELS[t]}</span>
                  <span className="t-tag">{TRACK_TAGLINES[t]}</span>
                  <span className="t-count">{trackCount(t)} careers mapped</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ============ ①b Background · the program pick (own step) ============ */}
        {screen === "program" && strand && (
          <section className="ob-screen">
            <button className="ob-back" onClick={() => back("strand")}>
              <ArrowLeft size={14} aria-hidden="true" /> Back
            </button>
            <div className="screen-head" style={{ marginTop: 12 }}>
              <h1>Your program</h1>
            </div>
            <div className="panel ob-program">
              <div style={{ padding: "16px 16px 16px" }}>
                <label className="q-skill-tag" htmlFor="ob-program">
                  Program
                </label>
                <select
                  id="ob-program"
                  className="ob-select num"
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                >
                  <option value="">Pick your program…</option>
                  {trackPrograms.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <p className="ob-note" style={{ marginTop: 12 }}>
                  You can change this later in Profile → Account.
                </p>
              </div>
            </div>
            <div className="ob-ctas">
              <button className="btn btn-primary" disabled={!program} onClick={backgroundContinue}>
                Continue
              </button>
            </div>
          </section>
        )}

        {/* ============ ② Career-in-mind branch (copy unchanged) ============ */}
        {screen === "branch" && (
          <section className="ob-screen wide">
            <button className="ob-back" onClick={() => back("program")}>
              <ArrowLeft size={14} aria-hidden="true" /> Back
            </button>
            <div className="screen-head" style={{ marginTop: 12 }}>
              <h1>Do you have a career in mind?</h1>
            </div>
            <div className="ob-branch">
              <button className="panel card" type="button" onClick={() => go("careers")}>
                <h3>Yes — I know what I want to do</h3>
              </button>
              <button className="panel card" type="button" onClick={() => { setQi(0); go("quiz"); }}>
                <h3>No — help me figure it out</h3>
              </button>
            </div>
          </section>
        )}

        {/* ============ ② yes-branch · program-gated picker (commit at pick) ============ */}
        {screen === "careers" && strand && (() => {
          const gated = CAREERS.filter((c) => c.track === strand && gate(c));
          /* user deferral 2026-11-06: while the commit POST is in flight,
             the card grid holds a mirror skeleton (fix 1 card anatomy)
             instead of a dead tap */
          if (committing) {
            return (
              <section className="ob-screen" aria-live="polite" aria-busy="true">
                {/* fix 3 (2026-11-06): the skeleton is pre-shaped for the
                    INCOMING screen — the commit's destination is the verify
                    question card, not the picker grid being left behind */}
                <SkeletonQuestionCard options={4} className="skel-nace" />
              </section>
            );
          }
          return (
          <section className={`ob-screen${gated.length <= 2 ? " ob-solo" : " wide"}`}>
            <button className="ob-back" onClick={() => back("branch")}>
              <ArrowLeft size={14} aria-hidden="true" /> Back
            </button>
            <div className="screen-head" style={{ marginTop: 12 }}>
              <h1>Careers that map to {program}.</h1>
            </div>
            {/* fix 5 (2026-11-06): the picker rides the SAME card anatomy +
                grid as the ranked-cards screen (fit line → name → summary →
                core-skill count → Choose pill). The fit line is the
                program-fit pattern — no quiz answers exist here, so no
                fake interest copy. */}
            <div className={`ob-cards${gated.length <= 2 ? " ob-cards-solo" : ""}`}>
              {gated.map((c) => (
                <div key={c.id} className="panel card">
                  <p className="fit-line">A direct start from your program&apos;s core subjects.</p>
                  <h3>{c.name}</h3>
                  <p className="c-line">{c.roleSummary}</p>
                  <p className="c-line">
                    <b>{c.skills.filter((s) => s.tier === "core").length} core skills</b> to build
                  </p>
                  <div className="c-cta">
                    <button className="btn btn-ghost" type="button" onClick={() => commitCareer(c.id)}>
                      Choose {c.name}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {gated.length === 0 && (
              <p className="ob-note">
                No mapped career for {program} yet. You can still browse all careers and switch later.
              </p>
            )}
            <div className="ob-links">
              <Link className="link-sub" href="/career">
                See more careers for {trackLabelOf(strand)}
              </Link>
            </div>
          </section>
          );
        })()}

        {/* ============ ② no-branch · RIASEC quiz, one item per screen ============ */}
        {screen === "quiz" && INTEREST_ITEMS[qi] && (
          <section className="ob-screen">
            <button
              className="ob-back"
              onClick={() => {
                if (qi > 0) {
                  setQi(qi - 1);
                } else {
                  back("branch");
                }
              }}
            >
              <ArrowLeft size={14} aria-hidden="true" /> Back
            </button>
            <div className="screen-head" style={{ marginTop: 12 }}>
              <h1>Time to figure out what fits.</h1>
              {qi === 0 && (
                <p>
                  No right or wrong answers — what you enjoy. {INTEREST_ITEMS.length} statements, about
                  three minutes.
                </p>
              )}
            </div>
            <div
              className="ob-progbar num"
              role="progressbar"
              aria-valuenow={qi + 1}
              aria-valuemin={1}
              aria-valuemax={INTEREST_ITEMS.length}
              aria-label="Quiz progress"
            >
              <span style={{ width: `${((qi + 1) / INTEREST_ITEMS.length) * 100}%` }} />
            </div>
            <div className="panel ob-quizcard">
              <span className="q-skill-tag">Statement {qi + 1} of {INTEREST_ITEMS.length}</span>
              <p className="q-stem" style={{ marginTop: 10 }}>
                {INTEREST_ITEMS[qi].statement}
              </p>
              <div className="q-opts" style={{ marginTop: 22 }}>
                {INTEREST_SCALE.map((o) => (
                  <button
                    key={o.v}
                    className="opt"
                    type="button"
                    aria-pressed={interest[INTEREST_ITEMS[qi].id] === o.v}
                    onClick={() => pickInterest(INTEREST_ITEMS[qi].id, o.v)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ============ ② ranked top-3 cards + pick ============ */}
        {screen === "cards" && strand && (() => {
          /* fix 4 (2026-11-06): the ranked branch ALSO holds the mirror
             skeleton while its pick's commit POST runs — no blank gap */
          if (committing) {
            return (
              <section className="ob-screen" aria-live="polite" aria-busy="true">
                {/* fix 3 (2026-11-06): same — the ranked pick's commit also
                    walks to the verify question card, so its skeleton is the
                    question-card shape (not the outgoing card grid) */}
                <SkeletonQuestionCard options={4} className="skel-nace" />
              </section>
            );
          }
          const { top, low, topLetters } = suggestionResults();
          const solo = top.length <= 2;
          return (
            <section className={`ob-screen${solo ? " ob-solo" : " wide"}`}>
              <button className="ob-back" onClick={() => back("branch")}>
                <ArrowLeft size={14} aria-hidden="true" /> Back
              </button>
              <div className="screen-head" style={{ marginTop: 12 }}>
                <h1>Careers that fit how you answered</h1>
                <p>Pick the one that feels right.</p>
              </div>
              {low && (
                <p className="ob-note">
                  Not a strong signal — here&apos;s your program&apos;s careers, lightly ranked.
                </p>
              )}
              <div className={`ob-cards${solo ? " ob-cards-solo" : ""}`}>
                {top.map((r) => {
                  const c = getCareer(r.careerId);
                  if (!c) return null;
                  return (
                    <div key={c.id} className="panel card">
                      <p className="fit-line">{plainFitLine(topLetters, r.matchedLetters)}</p>
                      <h3>{c.name}</h3>
                      <p className="c-line">{c.roleSummary}</p>
                      <p className="c-line">
                        <b>{c.skills.filter((s) => s.tier === "core").length} core skills</b> to build
                      </p>
                      <div className="c-cta">
                        <button className="btn btn-ghost" type="button" onClick={() => commitCareer(c.id)}>
                          Choose {c.name}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="ob-links">
                <Link className="link-sub" href="/career">
                  See more careers for {trackLabelOf(strand)}
                </Link>
              </div>
            </section>
          );
        })()}

        {/* ============ ③ Skills — QuestionCard ladders, kept machinery ============ */}
        {screen === "verify" && (
          <section className="ob-screen">
            {vView === "question" && vSlots[vi] && (() => {
              const slot = vSlots[vi];
              /** the rung-dot state: how many of this skill's rungs are answered */
              const rungAnswered = slot.ladderSkill
                ? vSlots.filter(
                    (s, i) => s.ladderSkill === slot.ladderSkill && vPicks[i] != null
                  ).length
                : 0;
              return (
                <>
                  {/* a11y (2026-11-20): the verify sitting's screens render the
                      qtag row only — this sr-only h1 gives the section a real
                      heading without changing the shared QuestionCard register */}
                  <h1 className="sr-only">Check your skills</h1>
                  <QuestionCard
                    question={slot.item}
                    index={vi}
                    total={quizItems.length}
                    picked={picked}
                    onAnswer={(i) => answerVerify(slot, i)}
                    onNext={verifyNext}
                    rung={slot.ladderSkill ? { index: slot.rung, answered: rungAnswered } : undefined}
                    bandPass={
                      slot.ladderSkill
                        ? `Correct — part ${slot.rung + 1} of 3. The skill verifies when all three parts pass.`
                        : undefined
                    }
                    bandFail={
                      slot.ladderSkill
                        ? `Not quite — part ${slot.rung + 1} of 3. The skill verifies only if all three parts pass.`
                        : undefined
                    }
                    pendingHint="Your verdict appears here — answer to see it."
                    back={
                    vi > 0
                      ? {
                          label: "Back",
                          onClick: () => {
                            setVi(vi - 1);
                            setPicked(vPicks[vi - 1]);
                            setAnswered(vPicks[vi - 1] != null);
                          },
                        }
                      : { label: "Back", onClick: () => back("branch") }
                  }
                  nextLabel={vi + 1 >= quizItems.length ? "See result" : "Next"}
                  />
                </>
              );
            })()}

            {vView === "result" && (() => {
              /* skill-level verdict: a ladder skill counts confirmed only
               * when all its rungs graded correct client-side (the server's
               * 3-of-3 markVerified is the authority; this mirrors it). */
              const skillsOrder: string[] = [];
              vSlots.forEach((s) => {
                if (!skillsOrder.includes(s.skill)) skillsOrder.push(s.skill);
              });
              const confirmed = new Set<string>();
              for (const skill of skillsOrder) {
                const idxs = vSlots.map((s, i) => (s.skill === skill ? i : -1)).filter((i) => i >= 0);
                if (vSlots[idxs[0]].ladderSkill) {
                  if (idxs.every((i) => vResults[i] === true)) confirmed.add(skill);
                } else if (vResults[idxs[0]] === true) confirmed.add(skill);
              }
              const passedNames = skillsOrder.filter((s) => confirmed.has(s));
              const failedNames = skillsOrder.filter((s) => !confirmed.has(s));
              const n = passedNames.length;
              /** per-skill tally (fix 2026-11-06): rung score for every skill
               *  — a ladder skill shows x of 3 correct (3-of-3 ⇒ verified, the
               *  server's all-or-nothing rule); legacy singles show 1 of 1. */
              const tally = skillsOrder.map((skill) => {
                const idxs = vSlots.map((s, i) => (s.skill === skill ? i : -1)).filter((i) => i >= 0);
                const isLadder = vSlots[idxs[0]].ladderSkill != null;
                const correct = idxs.filter((i) => vResults[i] === true).length;
                return { skill, verified: confirmed.has(skill), isLadder, correct, total: isLadder ? 3 : 1 };
              });
              let copy: string;
              if (n === skillsOrder.length) {
                copy = "A real head start — your profile shows this from day one.";
              } else if (n > 0) {
                copy = `${failedNames
                  .map(skillDisplay)
                  .join(", ")} stay${
                  failedNames.length === 1 ? "s" : ""
                } as your own rating. You can confirm ${
                  failedNames.length === 1 ? "it" : "them"
                } later from Assessments, after you've built ${
                  failedNames.length === 1 ? "it" : "them"
                } up.`;
              } else {
                copy =
                  "None confirmed yet — that's honest. Your starting gaps still shape your plan, and these short checks confirm skills as you learn.";
              }
              return (
                <div aria-live="polite" aria-busy={vPosting}>
                  {vPosting ? (
                    /* user deferral 2026-11-06: skeleton while the verdict
                       POSTs run — mirrors the result screen's head + tally
                       register */
                    <>
                      <div className="skel-head">
                        <Skeleton />
                        <Skeleton />
                      </div>
                      <SkeletonBlock lines={3} className="skel-single" />
                    </>
                  ) : (
                    <>
                  <div className="screen-head">
                    <h1>
                      {n > 0
                        ? `${n} of ${skillsOrder.length} confirmed.`
                        : "Your ratings stand as claimed."}
                    </h1>
                    <p>{copy}</p>
                  </div>
                  {tally.length > 0 && (
                    <div className="panel ob-tally">
                      {tally.map((t) => (
                        <TallyRow
                          key={t.skill}
                          skill={t.skill}
                          correct={t.correct}
                          total={t.total}
                          verified={t.verified}
                        />
                      ))}
                    </div>
                  )}
                  <div className="ob-ctas">
                    <button className="btn btn-primary" onClick={() => go("assessIntro")}>
                      Continue
                    </button>
                  </div>
                    </>
                  )}
                </div>
              );
            })()}
          </section>
        )}

        {/* ============ ④ Assess · the competency instrument — intro ============ */}
        {screen === "assessIntro" && (
          <section className="ob-screen">
            <button className="ob-back" onClick={() => { setVView("result"); back("verify"); }}>
              <ArrowLeft size={14} aria-hidden="true" /> Back
            </button>
            {/* distill round 2026-11-20 (critique P0): the H1 + one line carry
                the whole brief — claimed/verified is taught ONCE on the result
                screen, never three times here; the NACE E&I fine print moved
                to the result screen too */}
            <div className="screen-head" style={{ marginTop: 12 }}>
              <h1>The competency check — the real one.</h1>
              <p className="num">
                {INSTRUMENT.length} competencies · {STATEMENT_TOTAL} ratings + {MCQ_TOTAL} short checks ·
                about 15 minutes.
              </p>
            </div>
            <div className="ob-parts">
              <div className="panel nextcard ob-static">
                <h3>{STATEMENT_TOTAL} statements — how you work</h3>
                <p className="n-why">Rate each one honestly — a rating marks the competency as claimed.</p>
              </div>
              <div className="panel nextcard ob-static">
                <h3>{MCQ_TOTAL} short checks — what verifies</h3>
                <p className="n-why">Clear both of a competency&apos;s checks and it verifies.</p>
              </div>
            </div>
            <div className="ob-ctas">
              <button
                className="btn btn-primary"
                onClick={() => { setNaceCard(0); go("nace"); }}
              >
                Start the assessment
              </button>
            </div>
          </section>
        )}

        {/* ============ ④ Assess · 7 paged competencies ============ */}
        {screen === "nace" && posting && (
          <section className="ob-screen" aria-live="polite" aria-busy="true">
            {/* fix 3 (2026-11-06): the final NACE POST's skeleton is
                pre-shaped for the INCOMING result screen (head + implication
                panel + CTA pill) — not the outgoing check card */}
            <div className="skel-head">
              <Skeleton />
              <Skeleton />
            </div>
            <SkeletonBlock lines={3} className="skel-single" />
            <div className="ob-ctas">
              <Skeleton className="skel-pill" />
            </div>
          </section>
        )}
        {screen === "nace" && !posting && NACE_CARDS[naceCard] && (() => {
          const card = NACE_CARDS[naceCard];
          const comp = INSTRUMENT[card.compIdx];
          const last = naceCard + 1 >= NACE_CARDS.length;
          const answered =
            card.kind === "likert"
              ? likertChoices[comp.statements[card.stmtIdx].id] != null
              : mcqChoices[comp.mcqs[card.mcqIdx].id] != null;
          return (
            <section className="ob-screen">
              {/* a11y (2026-11-20): the 42-card run renders the qbar tag only —
                  an sr-only h1 gives the section a real heading */}
              <h1 className="sr-only">The competency check</h1>
              <div className="ob-qbar">
                <span className="q-skill-tag num">
                  COMPETENCY {card.compIdx + 1} OF {INSTRUMENT.length} · {comp.title}
                </span>
                <button className="ob-back" onClick={naceBack}>
                  <ArrowLeft size={14} aria-hidden="true" /> Back
                </button>
              </div>
              <div
                className="ob-progbar num"
                role="progressbar"
                aria-label="Assessment progress"
                aria-valuenow={naceCard + 1}
                aria-valuemin={1}
                aria-valuemax={NACE_CARDS.length}
              >
                <span style={{ width: `${((naceCard + 1) / NACE_CARDS.length) * 100}%` }} />
              </div>
              {card.kind === "likert" ? (
                /* the statement card — the stem stays dominant; the 5-point
                 * scale is full-width tonal rows (the quiz screen's register,
                 * 2026-11-20 layout round) and the Next/Finish pill lives in
                 * the card's own foot — no dead space under the chips */
                <div className="panel ob-nacecard">
                  <div className="ob-cardbody">
                    <span className="q-skill-tag num">
                      QUESTION {naceCard + 1} OF {NACE_CARDS.length}
                    </span>
                    <p className="q-stem-md" style={{ marginTop: 12 }}>
                      {comp.statements[card.stmtIdx].text}
                    </p>
                    <div
                      className="scale"
                      role="group"
                      aria-label={`${comp.title} — statement ${card.stmtIdx + 1}, rate 1 to 5`}
                    >
                      {INSTRUMENT_LIKERT_SCALE.map((o) => (
                        <button
                          key={o.value}
                          type="button"
                          aria-pressed={likertChoices[comp.statements[card.stmtIdx].id] === o.value}
                          aria-label={`${o.value} — ${o.label}`}
                          onClick={() => rate(comp.statements[card.stmtIdx].id, o.value)}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="ob-cardfoot">
                    <button className="btn btn-primary" disabled={!answered || posting} onClick={naceNext}>
                      {last ? (posting ? "Scoring…" : "Finish") : "Next"}
                    </button>
                  </div>
                </div>
              ) : (() => {
                /* the check card — QuestionCard grammar + its immediate verdict
                 * band. The pending band renders a quiet single line (the old
                 * 86px void is the band's own occupied spot now); `.ob-live`
                 * keeps the band in flow — the retake surface's own copy of
                 * this card (AssessSitting.tsx) keeps the absolute anchor. */
                const mcq = comp.mcqs[card.mcqIdx];
                const thisPick = mcqChoices[mcq.id];
                const didAnswer = thisPick != null;
                const passed = didAnswer && thisPick === mcq.key;
                return (
                  <div className="panel ob-mcqcard ob-live" style={{ marginTop: 16 }} data-mcq={mcq.id}>
                    <span className="q-skill-tag">
                      Check {card.mcqIdx + 1} of {comp.mcqs.length} · QUESTION {naceCard + 1} OF {NACE_CARDS.length}
                    </span>
                    <p className="q-stem" style={{ marginTop: 10 }}>{mcq.stem}</p>
                    <div className="q-opts" style={{ marginTop: 18 }}>
                      {mcq.options.map((t, i) => (
                        <button key={i} className="opt" type="button" onClick={() => answerSituational(mcq.id, i)}>
                          {t}
                        </button>
                      ))}
                    </div>
                    <div
                      className={`q-band ${didAnswer ? `show ${passed ? "pass" : "fail"}` : ""}`}
                      aria-live="polite"
                    >
                      {didAnswer
                        ? (passed
                            ? "Correct — this is the competency's core move. Keep it up."
                            : `Not quite. The strongest answer is: ${mcq.options[mcq.key]} Both of this competency's checks must be answered correctly to verify it.`)
                        : "Your verdict appears here — answer to see it."}
                    </div>
                    <div className="ob-cardfoot">
                      <button className="btn btn-primary" disabled={!answered || posting} onClick={naceNext}>
                        {last ? (posting ? "Scoring…" : "Finish") : "Next"}
                      </button>
                    </div>
                  </div>
                );
              })()}
            </section>
          );
        })()}

        {/* ============ ④ Assess result — the server's grade ============ */}
        {screen === "assessResult" && !grade && (
          <section className="ob-screen" aria-live="polite" aria-busy="true">
            {/* user deferral 2026-11-06: skeleton while the server grade
                is awaited — mirrors the result screen (head + okband +
                tally panel + CTA pill) */}
            <div className="skel-head">
              <Skeleton />
              <Skeleton />
            </div>
            <SkeletonBlock lines={3} className="skel-single" />
            <div className="ob-ctas">
              <Skeleton className="skel-pill" />
            </div>
          </section>
        )}
        {screen === "assessResult" && grade && (() => {
          /* the TallyRow register (2026-11-20 distill, critique P0): one row
           * per competency — the SERVER's grade keys the chip (green
           * "Verified ✓" / grey "N of 2 — not verified yet"), and the dot
           * count mirrors THIS attempt's own check answers (the same data the
           * server graded — nothing painted, nothing client-claimed). */
          const tally = INSTRUMENT.map((c) => ({
            title: c.title,
            verified: grade[c.title] === "verified",
            correct: c.mcqs.filter((m) => mcqChoices[m.id] === m.key).length,
            total: c.mcqs.length,
          }));
          const n = tally.filter((t) => t.verified).length;
          return (
            <section className="ob-screen">
              <div className="screen-head">
                <h1>
                  {n > 0
                    ? `${n} of ${INSTRUMENT.length} verified.`
                    : "Your ratings stand as claimed."}
                </h1>
                <p>The checks are what verify — and your latest attempt always counts.</p>
              </div>
              <div className="panel ob-tally">
                {tally.map((t) => (
                  <TallyRow
                    key={t.title}
                    skill={t.title}
                    correct={t.correct}
                    total={t.total}
                    verified={t.verified}
                  />
                ))}
              </div>
              <div className="ob-ctas">
                <button className="btn btn-primary" onClick={() => go("goal")}>
                  Continue
                </button>
                {/* the retake affordance (2026-11-18): the in-funnel retake
                    redirect retired — the retake lives on the focused
                    /assessment route now */}
                <Link className="link-sub" href="/assessment">
                  Retake the check
                </Link>
              </div>
              <p className="ob-fine">
                NACE lists 8 competencies — Equity &amp; Inclusion is under review, so 7 are rated here.
              </p>
            </section>
          );
        })()}

        {/* ============ ⑤ Goal suggestion ============ */}
        {screen === "goal" && career && sug && (
          <section className="ob-screen">
            <button className="ob-back" onClick={() => back("assessIntro")}>
              <ArrowLeft size={14} aria-hidden="true" /> Back
            </button>
            <div className="screen-head" style={{ marginTop: 12 }}>
              <h1>Set your first goal</h1>
              <p>One goal is enough to start. We picked it from your first gap.</p>
            </div>
            <div className="panel nextcard">
              {/* fix 5 (2026-11-06): the suggestion is a READ-ONLY display —
                  plain text (no input affordance, no EDIT hint). The student's
                  only actions here are Set this goal / Skip for now; edits
                  happen later in-app. Same data write on Set. */}
              <h3>{goalTitle || "Your first goal"}</h3>
              <p className="n-target">{goalTargetLine(sug.resourceId)}</p>
              <p className="n-why">
                Closes your first gap in {sug.skill} — the top skill for {career.name}.
              </p>
              <div className="n-cta" style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button className="btn btn-primary" onClick={setGoal}>
                  Set this goal
                </button>
                <button className="ob-quiet" type="button" onClick={skipGoal}>
                  Skip for now
                </button>
              </div>
              {goalToast && (
                <div className="okband" style={{ marginTop: 14 }}>
                  {goalToast}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ============ ⑤ reveal ============ */}
        {screen === "reveal" && view?.career && view.score && (
          <Reveal view={view} armed={armed} studentId={studentId} />
        )}
        {screen === "reveal" && !(view?.career && view.score) && (
          <section className="ob-screen" aria-live="polite" aria-busy="true">
            {/* user deferral 2026-11-06: skeleton while /api/state loads
                (and in the offline-catch case) — mirrors the reveal's
                head + readout panel + pathway panel + CTAs */}
            <div className="skel-head">
              <Skeleton />
              <Skeleton />
            </div>
            <SkeletonBlock lines={6} className="skel-single" />
            <SkeletonBlock lines={4} className="skel-single" />
            <div className="ob-ctas">
              <Skeleton className="skel-pill" />
            </div>
          </section>
        )}
        </div>
      </div>
    </div>
  );
}

/* ---------- ⑤ reveal (computed from the fetched /api/state view) ---------- */

function Reveal({
  view,
  armed,
  studentId,
}: {
  view: StateView;
  armed: boolean;
  studentId: string;
}) {
  const { state, career, score } = view;
  if (!career || !score) return null;
  const verifiedCount = Object.values(state.bars).filter((b) => b.source === "verified").length;
  const checkedCount = Object.values(state.bars).filter((b) => b.source === "checked").length;
  const closed = Object.keys(state.bars).length;
  const mapSize = career.skills.length;
  const competencyEntries = Object.entries(state.competencies ?? {});
  const esVerified = competencyEntries.filter(([, v]) => v === "verified").length;
  const esClaimed = competencyEntries.filter(([, v]) => v === "claimed").length;
  const queue = stageOne(career, openSkills(career, state.bars)).queue;
  const activeGoal = state.goals.some((g) => g.type === "training" && g.status === "active");
  // persona line: "NEIL · 4th Year · Computer & IT" — the state's vocabulary
  // prints verbatim (yearLevel + the track's TRACK_LABELS label); no G-regex.
  const whoLine = [state.name, state.yearLevel, trackLabelOf(state.track)]
    .filter((part) => part && part !== "NEIL")
    .join(", ");

  const parts = [
    { pct: WEIGHTS.sp, earnedFrac: score.sp / WEIGHTS.sp },
    { pct: WEIGHTS.es, earnedFrac: score.es / WEIGHTS.es },
    { pct: WEIGHTS.tp, earnedFrac: score.tp / WEIGHTS.tp },
    { pct: WEIGHTS.ar, earnedFrac: score.ar === null ? 0 : score.ar / WEIGHTS.ar },
    { pct: WEIGHTS.cc, earnedFrac: score.cc / WEIGHTS.cc },
  ];

  return (
    <section className="ob-screen">
      <div className="screen-head">
        <h1>Your starting line</h1>
        <p>
          Every number reads the same way: only verified and checked bars and the competency check count —
          nothing else feeds your score. You&apos;ll move it by building the skills your pathway queues.
        </p>
      </div>
      <div className="panel readout">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <span className="label">
            READINESS — <b className="ob-who">{whoLine}</b>
          </span>
          <div className="readout-score num">
            <span aria-label={`Readiness ${score.total} of 100`}>{score.total}</span>
            <small>/100</small>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <SegRubricBar
            parts={parts}
            armed={armed}
            ariaLabel={`Readiness ${score.total} of 100 — skills ${score.sp} of ${WEIGHTS.sp}, employability ${score.es} of ${WEIGHTS.es}, training ${score.tp} of ${WEIGHTS.tp}, application readiness ${score.ar === null ? "not yet measured" : `${score.ar} of ${WEIGHTS.ar}`}, direction ${score.cc} of ${WEIGHTS.cc}`}
          />
        </div>
        <div className="stack" style={{ marginTop: 14 }}>
          <div className="tickline num">
            <b>Skills</b> — {score.sp} of {WEIGHTS.sp}, {closed} of {mapSize} skills on your baseline (
            {verifiedCount} verified <span className="vbadge ok"><Check size={11} aria-hidden="true" /></span>
            {checkedCount > 0 && (
              <>
                {", "}
                {checkedCount} checked
              </>
            )}
            )
          </div>
          <div className="tickline num">
            <b>Employability</b> — {score.es} of {WEIGHTS.es},{" "}
            {esVerified} of 7 NACE competencies verified <span className="vbadge ok"><Check size={11} aria-hidden="true" /></span>
            {esClaimed > 0 && <span>, {esClaimed} claimed (self-report — no points painted)</span>}
          </div>
          <div className="tickline num">
            <b>Training</b> — {score.tp} of {WEIGHTS.tp},{" "}
            {state.stageOneDone === 0 ? "First 3 steps ready, none finished yet" : `${state.stageOneDone} of 3 done`}
          </div>
          <div className="tickline num">
            <b>Application readiness</b> — {score.ar === null ? "Not yet measured" : `${score.ar} of ${WEIGHTS.ar}`},{" "}
            {score.ar === null ? "the resume diagnostic (Prep) opens this channel" : "unlimited re-runs — your latest run counts"}
          </div>
          <div className="tickline num">
            <b>Direction</b> — {score.cc} of {WEIGHTS.cc}, career picked,{" "}
            {activeGoal ? "plan started" : "no commitment yet — set your first step next"}
          </div>
        </div>
      </div>

      <div className="ob-section-wide">
        <div className="panel nextcard">
          <h3>Your learning pathway is ready</h3>
          <p className="n-why">
            It starts where your gaps are biggest: the Python basics course first — it feeds your goal
            directly. Your first 3 steps are queued.
          </p>
          <div className="stack" style={{ marginTop: 10 }}>
            {queue.map((skill, i) => {
              const res = RESOURCES.find(
                (r) => r.careerId === career.id && r.skillsAddressed.includes(skill) && r.cost === "free"
              );
              return (
                <div key={skill} className="tickline num">
                  <b>{i + 1}.</b> {skill}
                  {res ? ` — ${res.title}, free, ~${res.durationHours} hrs` : ""}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="ob-ctas" style={{ gap: 20, flexWrap: "wrap" }}>
        <Link
          className="btn btn-primary btn-hero"
          href="/dashboard"
          onClick={() => clearDraft(studentId)}
        >
          Take me to my Dashboard
        </Link>
        <Link className="link-sub" href="/pathway">
          See the full pathway
        </Link>
      </div>
    </section>
  );
}

/* ---------- helpers kept below the component for readability ---------- */

/* ---------- the ranked-card fit line (2026-11-20 distill, critique P1):
 * plain language derived from the SAME computed data the engine ranked on —
 * the student's top letters (rankLetters) and each career's matched letters
 * (rankCareers' matchedLetters). One plain phrase keys to each letter, so
 * the line stays computed, never painted; no RIASEC letters render. */
type InterestLetter = ReturnType<typeof rankLetters>[number];

const LETTER_PLAIN: Record<InterestLetter, string> = {
  R: "fixing and building",
  I: "digging into how things work",
  A: "making and designing",
  S: "helping people",
  E: "leading and persuading",
  C: "organizing and keeping order",
};

function plainFitLine(topLetters: InterestLetter[], matched: InterestLetter[]): string {
  const tops = topLetters.slice(0, 2);
  const liked = tops.map((l) => LETTER_PLAIN[l]).join(" and ");
  if (matched.length === 0) return `You liked ${liked}.`;
  const core = matched.filter((l) => tops.includes(l));
  const extra = matched.filter((l) => !tops.includes(l));
  const runsOn =
    extra.length === 0
      ? matched.length > 1
        ? "both"
        : "that same strength"
      : [...core, ...extra].map((l) => LETTER_PLAIN[l]).join(" and ");
  return `You liked ${liked} — this role runs on ${runsOn}.`;
}

function GOAL_SUGG(
  direct: { title: string; resourceId: string; skill: string } | null,
  career: Career | null
): { title: string; resourceId: string; skill: string } | null {
  if (direct) return direct;
  const top = career?.skills[0];
  if (!top) return null;
  const res = RESOURCES.find((r) => r.careerId === career!.id && r.skillsAddressed.includes(top.name));
  return { title: `Build up ${top.name}`, resourceId: res?.id ?? "", skill: top.name };
}

function goalTargetLine(resourceId: string): string {
  const res = RESOURCES.find((r) => r.id === resourceId);
  if (!res) return "";
  const cost = res.cost === "free" ? "Free" : `₱${res.cost.peso}`;
  return `${cost}, ~${res.durationHours} hours, ${res.provider} — ${res.title}`;
}

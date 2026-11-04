"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { SegRubricBar } from "@/components/instrument";
import { CAREERS, DEMO_SUGGESTION_ORDER, TRACKS, TRACK_LABELS, trackLabelOf } from "@/lib/fixtures/catalog";
import { RESOURCES } from "@/lib/fixtures/resources";
import {
  INSTRUMENT,
  INSTRUMENT_LIKERT_SCALE,
  gradeInstrumentAnswers,
  type InstrumentAnswers,
} from "@/lib/fixtures/instrument";
import { openSkills, stageOne } from "@/lib/engines/gaps";
import { WEIGHTS } from "@/lib/engines/score";
import type { Career, CompetencyStatus, Goal } from "@/lib/types";
import {
  GOAL_SUGGESTION,
  INTEREST_OPTIONS,
  INTEREST_QUIZ,
  SUGGESTION_CARDS,
  TRACK_TAGLINES,
  VERIFY_BANK,
  type VMCQ,
} from "./banks";

/**
 * Onboarding ①–⑤ — one client-side stepper.
 * Screens: strand → branch → interest quiz → suggestion cards →
 * 8-row self-report → M8-lite framing prompt → THE COMPETENCY INSTRUMENT
 * (intro → Part A 28 self-report Likert statements → Part B 14 verification
 * MCQs → server-graded result) → skill verification mini-quiz → goal →
 * first-score reveal.
 *
 * The instrument is the user-approved 42-item content bank
 * (lib/fixtures/instrument.ts — strings verbatim from
 * .scratch/career-path-readiness-platform/features/content/
 * instrument-competencies-draft.md). Evidence states per product truth:
 * Likert ratings alone → CLAIMED; a competency is VERIFIED ⇔ BOTH of its
 * MCQs are answered correctly in the LATEST FULL attempt — one server write
 * (POST /api/assessment) at the end of Part B; retakes overwrite (latest
 * counts, Round 7 lock; a weaker re-sit honestly drops verified). The
 * client-side keys drive the immediate per-item feedback only — the result
 * screen reads the SERVER's grade.
 * OB-1…OB-5 copy verbatim from features/content/onboarding.md (OB-1…OB-5
 * tables); demo mechanics canon from _fixture-math.md (5-item quiz → "2 of 5").
 */

type Level = "confident" | "kindof" | "notyet";
type ClaimV = "can" | "kind" | "not";
type Screen =
  | "strand"
  | "branch"
  | "quiz"
  | "loading"
  | "cards"
  | "selfreport"
  | "framing"
  | "assessIntro"
  | "likert"
  | "situations"
  | "assessResult"
  | "verify"
  | "goal"
  | "reveal";

const STEP_OF: Record<Screen, number> = {
  strand: 1,
  branch: 2,
  quiz: 2,
  loading: 2,
  cards: 2,
  selfreport: 3,
  framing: 3,
  assessIntro: 3,
  likert: 3,
  situations: 3,
  assessResult: 3,
  verify: 3,
  goal: 4,
  reveal: 5,
};
const STEP_LABELS = ["Track", "Career", "Skills", "Goal", "Score"];

const LEVEL_OF: Record<ClaimV, Level> = { can: "confident", kind: "kindof", not: "notyet" };
const CLAIM_CHIPS: { v: ClaimV; label: string }[] = [
  { v: "can", label: "I can do this" },
  { v: "kind", label: "Kind of — not sure" },
  { v: "not", label: "Not yet" },
];
const FRAME_ROWS = ["Teamwork", "Communication", "Problem-solving"];
const FRAME_CHIPS = ["Strong", "Okay", "Room to grow"];

const STATEMENT_TOTAL = INSTRUMENT.reduce((n, c) => n + c.statements.length, 0);
const MCQ_TOTAL = INSTRUMENT.reduce((n, c) => n + c.mcqs.length, 0);
/** flat MCQ run order: COM-1.M1, COM-1.M2, COM-2.M1 … COM-7.M2 */
const MCQ_RUN = INSTRUMENT.flatMap((c) => c.mcqs.map((m) => ({ comp: c, mcq: m })));

const getCareer = (id: string): Career | null => CAREERS.find((c) => c.id === id) ?? null;

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

export default function Onboarding() {
  const [screen, setScreen] = useState<Screen>("strand");

  // OB-1 strand · OB-3a quiz · OB-3a cards
  const [strand, setStrand] = useState<string | null>(null);
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<(string | undefined)[]>([]);
  const [careerId, setCareerId] = useState<string | null>(null);

  // OB-3b-1 self-report · OB-3b-2 framing
  const [sr, setSr] = useState<Record<string, ClaimV>>({});
  const [frame, setFrame] = useState<Record<string, string>>({});

  // step ③ — the competency instrument (Part A ratings + Part B checks)
  const [sitView, setSitView] = useState<"intro" | "question">("intro");
  const [sitIdx, setSitIdx] = useState(0);
  const [sitPicked, setSitPicked] = useState<number | null>(null);
  const [sitAnswered, setSitAnswered] = useState(false);
  const [likertChoices, setLikertChoices] = useState<Record<string, number>>({});
  const [mcqChoices, setMcqChoices] = useState<Record<string, number>>({});
  /** the SERVER's grade for the just-completed attempt (assessResult reads it) */
  const [grade, setGrade] = useState<Record<string, CompetencyStatus> | null>(null);
  const [posting, setPosting] = useState(false);

  // OB-3b-3 verification quiz
  const [vView, setVView] = useState<"intro" | "question" | "result">("intro");
  const [vi, setVi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [quizItems, setQuizItems] = useState<VMCQ[]>(VERIFY_BANK);
  const [vResults, setVResults] = useState<boolean[]>([]);

  // OB-4 goal
  const [goalTitle, setGoalTitle] = useState("");
  const [goalToast, setGoalToast] = useState<string | null>(null);

  // OB-5 reveal
  const [view, setView] = useState<StateView | null>(null);
  const [armed, setArmed] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const career = careerId ? getCareer(careerId) : null;
  const trackCount = (t: string) => CAREERS.filter((c) => c.track === t).length;

  useEffect(() => {
    window.scrollTo(0, 0);
    // OB-4 pre-fill: the goal card mounts with the suggested title (OB-4.2),
    // editable inline; leaving the screen resets it for the next pass.
    if (screen === "goal" && sug) setGoalTitle(sug.title);
  }, [screen]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    []
  );

  function go(next: Screen) {
    setScreen(next);
  }

  function back(target: Screen) {
    setScreen(target);
  }

  /* ---- OB-3a interest quiz: one tap = answer + advance ---- */
  function pickInterest(v: string) {
    const next = [...answers];
    next[qi] = v;
    setAnswers(next);
    if (qi + 1 >= INTEREST_QUIZ.length) {
      go("loading");
      timers.current.push(
        setTimeout(() => {
          setScreen("cards"); // pre-baked fallback IS the content (deferred-LLM tier)
        }, 2000)
      );
    } else {
      setQi(qi + 1);
    }
  }

  /* ---- OB-3b-1 continue → the cold-start career commit, then the batch
     POST /api/claim (order is load-bearing: claims need the target map in
     the store — the client posts /api/career first; see that route's WHY). */
  async function selfReportContinue() {
    if (!career) return;
    try {
      const cRes = await fetch("/api/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ careerId: career.id, track: strand }),
      });
      // not fatal: the canon replay hits "already set" and keeps walking —
      // a real new student must get elsewise a 4xx surfaces at the reveal
      // exit, so we surface rather than silently swallow.
      if (!cRes.ok && !/already/i.test(await cRes.text().catch(() => ""))) {
        console.warn("career commit failed", cRes.status);
      }
    } catch {
      /* offline store is the demo; the walks retry claims after */
    }
    const claims = career.skills.map((s) => ({
      skill: s.name,
      level: LEVEL_OF[sr[s.name] ?? "not"],
    }));
    fetch("/api/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student: "neil", claims }),
    }).catch(() => {});
    go("framing");
  }

  /* ---- step ③ · Part A — the instrument's self-report statements ---- */
  function rate(item: string, value: number) {
    setLikertChoices((prev) => ({ ...prev, [item]: value }));
  }

  function beginSituations() {
    if (Object.keys(likertChoices).length < STATEMENT_TOTAL) return;
    setSitView("intro");
    setSitIdx(0);
    setSitPicked(null);
    setSitAnswered(false);
    go("situations");
  }

  /* ---- step ③ · Part B — the verification checks; the attempt POSTs ONCE,
            at the end, and the result reads the server grade ---- */
  function answerSituational(mcqId: string, i: number) {
    if (sitAnswered) return;
    const mcq = MCQ_RUN[sitIdx]?.mcq;
    if (!mcq || mcq.id !== mcqId) return;
    setSitPicked(i);
    setSitAnswered(true);
    setMcqChoices((prev) => ({ ...prev, [mcqId]: i }));
  }

  async function situationsNext() {
    if (!sitAnswered) return;
    if (sitIdx + 1 < MCQ_RUN.length) {
      setSitIdx(sitIdx + 1);
      setSitPicked(null);
      setSitAnswered(false);
      return;
    }
    // last item — the full attempt writes once, then the result screen shows
    // the SERVER's grade (never a client-computed verdict)
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
        go("assessResult");
      } else {
        setGrade(gradeInstrumentAnswers(payload)); // honest offline fallback (store is the demo)
        go("assessResult");
      }
    } catch {
      setGrade(gradeInstrumentAnswers(payload)); // store offline → local compute, same rule
      go("assessResult");
    } finally {
      setPosting(false);
    }
  }

  /* ---- OB-3b-3 verification quiz (canon: ≤5 items, one per top-claimed skill) ---- */
  function startVerify() {
    const claimed = career
      ? career.skills.filter((s) => sr[s.name] === "can").map((s) => s.name)
      : [];
    const drawn = VERIFY_BANK.filter((b) => claimed.includes(b.catalogSkill)).slice(0, 5);
    const items = drawn.length > 0 ? drawn : VERIFY_BANK.slice(0, 5);
    setQuizItems(items);
    setVi(0);
    setPicked(null);
    setAnswered(false);
    setVResults([]);
    setVView("question");
  }

  function answerVerify(item: VMCQ, i: number) {
    const passed = i === item.answer;
    setPicked(i);
    setAnswered(true);
    setVResults((prev) => {
      const next = [...prev];
      next[vi] = passed;
      return next;
    });
    // POST /api/verify — a fail keeps the self-declared mark (the route saves nothing on fail)
    fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student: "neil", skill: item.catalogSkill, passed }),
    }).catch(() => {});
  }

  function verifyNext() {
    if (vi + 1 >= quizItems.length) {
      setVView("result");
    } else {
      setVi(vi + 1);
      setPicked(null);
      setAnswered(false);
    }
  }

  const claimsCount = career ? career.skills.filter((s) => sr[s.name] === "can").length : 0;
  const likertAnswered = Object.keys(likertChoices).length;

  /* ---- OB-4 goal ---- */
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
          student: "neil",
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
    go("reveal");
  }

  /* ---- OB-5 reveal — every number fetched/engine-derived, never painted ---- */
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

  return (
    <div className="v7ob">
      {/* OB-0 · the header band — names the surface + the 5-step instrument */}
      <header className="ob-band">
        <div className="ob-band-in">
          <div className="ob-band-who">
            <span className="ob-band-name">Getting started</span>
            <span className="ob-band-meta">One sitting, five steps — ending on your computed starting line.</span>
          </div>
          <nav className="ob-steps-strip" aria-label="Onboarding steps">
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
          <span className="ob-strip-label num" aria-live="polite">
            STEP {step} OF 5
          </span>
        </div>
      </header>

      <div className="shell ob-shell">
        {/* ============ OB-1 · ① Track select ============ */}
        {screen === "strand" && (
          <section className="ob-screen">
            <div className="screen-head">
              <h1>What track are you in?</h1>
              <p>This points you at careers realistic for your track. You&apos;re not locking anything in.</p>
            </div>
            <div className="strand-grid">
              {TRACKS.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`panel strand-card ${strand === t ? "sel" : ""}`}
                  onClick={() => setStrand(t)}
                >
                  <span className="t-name">{TRACK_LABELS[t]}</span>
                  <span className="t-tag">{TRACK_TAGLINES[t]}</span>
                  <span className="t-count">{trackCount(t)} careers mapped</span>
                </button>
              ))}
            </div>
            <div className="ob-ctas">
              <button className="btn btn-primary" disabled={!strand} onClick={() => go("branch")}>
                Continue
              </button>
              <span className="ob-hint" aria-live="polite">
                {strand ? "" : "Pick one to continue"}
              </span>
            </div>
            <p className="ob-fine">
              We&apos;ll show careers for every track too — this just sets your default view.
            </p>
          </section>
        )}

        {/* ============ OB-2 · ② Career-in-mind branch ============ */}
        {screen === "branch" && (
          <section className="ob-screen">
            <button className="ob-back" onClick={() => back("strand")}>
              <ArrowLeft size={14} aria-hidden="true" /> Back
            </button>
            <div className="screen-head" style={{ marginTop: 12 }}>
              <h1>Do you have a career in mind?</h1>
              <p>Most answers here are &ldquo;not yet&rdquo; — and that&apos;s exactly what this app is for.</p>
            </div>
            <div className="ob-branch">
              <Link className="panel card" href="/career" style={{ textDecoration: "none", color: "inherit" }}>
                <h3>Yes — I know what I want to do</h3>
                <p className="c-line">Browse careers for your track, with entry routes shown.</p>
              </Link>
              <button className="panel card" type="button" onClick={() => { setQi(0); go("quiz"); }}>
                <h3>No — help me figure it out</h3>
                <p className="c-line">6 quick questions about what you enjoy, then we suggest careers that fit.</p>
              </button>
            </div>
            <p className="ob-fine" style={{ marginTop: 18 }}>
              Whichever you pick, you can change your career anytime — switching resets your plan and takes two
              minutes.
            </p>
          </section>
        )}

        {/* ============ OB-3a · interest quiz, live ============ */}
        {screen === "quiz" && (
          <section className="ob-screen">
            <button
              className="ob-back"
              onClick={() => {
                if (qi > 0) setQi(qi - 1);
                else go("branch");
              }}
            >
              <ArrowLeft size={14} aria-hidden="true" /> Back
            </button>
            <div className="screen-head" style={{ marginTop: 12 }}>
              <h1>Time to figure out what fits.</h1>
              <p>
                There are no right or wrong answers — this is about what you enjoy, not what you&apos;re good at
                yet.
                <br />
                6 questions, about a minute.
              </p>
            </div>
            <div className="panel ob-quizcard">
              <span className="q-skill-tag">Question {qi + 1} of {INTEREST_QUIZ.length}</span>
              <p className="q-stem" style={{ marginTop: 10 }}>{INTEREST_QUIZ[qi]}</p>
              <div className="q-opts" style={{ marginTop: 22 }}>
                {INTEREST_OPTIONS.map((o) => (
                  <button key={o.v} className="opt" type="button" onClick={() => pickInterest(o.v)}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ============ loading micro-state (OB-3a.6) ============ */}
        {screen === "loading" && (
          <section className="ob-screen">
            <div className="screen-head">
              <h1>Reading your answers…</h1>
            </div>
            <div className="ob-loading" aria-hidden="true">
              <div className="panel ob-skel" />
              <div className="panel ob-skel" />
              <div className="panel ob-skel" />
            </div>
          </section>
        )}

        {/* ============ OB-3a · suggestion cards + pick ============ */}
        {screen === "cards" && (
          <section className="ob-screen">
            <button className="ob-back" onClick={() => back("branch")}>
              <ArrowLeft size={14} aria-hidden="true" /> Back
            </button>
            <div className="screen-head" style={{ marginTop: 12 }}>
              <h1>Careers that fit how you answered</h1>
              <p>
                Based on your track and what you told us. Pick the one that feels right — you can switch later.
              </p>
            </div>
            <div className="ob-cards">
              {DEMO_SUGGESTION_ORDER.map((id) => {
                const c = getCareer(id);
                if (!c) return null;
                const copy = SUGGESTION_CARDS[id];
                const chosenThis = careerId === id;
                return (
                  <div key={id} className={`panel card ${chosenThis ? "sel" : ""}`}>
                    <p className="fit-line">{copy.fitLine}</p>
                    <h3>{c.name}</h3>
                    <p className="c-line">{c.roleSummary}</p>
                    <p className="c-line">
                      <b>Entry route:</b> {copy.entryLine}
                    </p>
                    <p className="c-line">
                      <b>{c.skills.length} core skills</b> to build
                    </p>
                    <div className="c-cta">
                      <button
                        className="btn btn-ghost"
                        type="button"
                        onClick={() => {
                          setCareerId(id);
                          if (chosenThis) {
                            setSr({});
                            go("selfreport");
                          }
                        }}
                      >
                        {chosenThis ? `Continue with ${c.name}` : `Choose ${c.name}`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="ob-links">
              <Link className="link-sub" href="/career">
                See more careers for Computer & IT
              </Link>
              <Link className="link-sub" href="/career">
                None of these quite fit
              </Link>
            </div>
            {career && (
              <div className="ob-ctas">
                <button
                  className="btn btn-primary btn-hero"
                  onClick={() => {
                    setSr({});
                    go("selfreport");
                  }}
                >
                  Continue with {career.name}
                </button>
              </div>
            )}
          </section>
        )}

        {/* ============ OB-3b-1 · skills self-report ============ */}
        {screen === "selfreport" && career && (
          <section className="ob-screen">
            <button className="ob-back" onClick={() => back("cards")}>
              <ArrowLeft size={14} aria-hidden="true" /> Back
            </button>
            <div className="screen-head" style={{ marginTop: 12 }}>
              <h1>Now — where are you today?</h1>
              <p>
                These are the {career.skills.length} core skills for {career.name}. Answer honestly:
                &ldquo;Not yet&rdquo; is a normal answer here, and it just sets your starting point.
              </p>
            </div>
            <div className="panel">
              <div className="panel-bar">
                <span className="label">
                  {career.name}, {career.skills.length} core skills
                </span>
                <span className="label num">
                  {Object.keys(sr).length} of {career.skills.length} answered
                </span>
              </div>
              {career.skills.map((s) => (
                <div key={s.name} className="skill-row">
                  <div>
                    <div className="s-name">{s.name}</div>
                    <div className="s-what">{s.what}</div>
                  </div>
                  <div className="choice choice-sm">
                    {CLAIM_CHIPS.map((c) => (
                      <button
                        key={c.v}
                        type="button"
                        aria-pressed={sr[s.name] === c.v}
                        onClick={() => setSr((prev) => ({ ...prev, [s.name]: c.v }))}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="ob-ctas">
              <button
                className="btn btn-primary"
                disabled={Object.keys(sr).length < career.skills.length}
                onClick={selfReportContinue}
              >
                Continue
              </button>
              <span className="ob-hint" aria-live="polite">
                {Object.keys(sr).length < career.skills.length ? `Answer all ${career.skills.length} to continue` : ""}
              </span>
            </div>
          </section>
        )}

        {/* ============ OB-3b-2 · soft-skills framing prompt (M8-lite, unscored) ============ */}
        {screen === "framing" && (
          <section className="ob-screen">
            <button className="ob-back" onClick={() => back("selfreport")}>
              <ArrowLeft size={14} aria-hidden="true" /> Back
            </button>
            <div className="screen-head" style={{ marginTop: 12 }}>
              <h1>One more thing — the people side.</h1>
              <p>
                In a 2026 employer survey, teamwork ranked higher than technical skill — 85% wanted it on a
                resume, against 73% for technical know-how.
              </p>
              <p className="ob-src">Job Outlook 2026 employer survey</p>
            </div>
            <div className="panel" style={{ maxWidth: 640 }}>
              <div className="panel-bar">
                <span className="q-skill-tag">Quick gut-check, honestly, right now — how do these three feel?</span>
              </div>
              {FRAME_ROWS.map((row) => (
                <div key={row} className="skill-row">
                  <div className="s-name">{row}</div>
                  <div className="choice choice-sm">
                    {FRAME_CHIPS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        aria-pressed={frame[row] === c}
                        onClick={() => setFrame((prev) => ({ ...prev, [row]: c }))}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="ob-note">
              Quick ratings are only a first read — people aren&apos;t good at rating themselves. The full
              competency check comes next, with short real-life situations that measure this properly. Nothing
              here changes your score.
            </p>
            <div className="ob-ctas">
              <button className="btn btn-primary" onClick={() => go("assessIntro")}>
                Continue
              </button>
            </div>
          </section>
        )}

        {/* ============ step ③ · the competency instrument — intro ============ */}
        {screen === "assessIntro" && (
          <section className="ob-screen">
            <button className="ob-back" onClick={() => back("framing")}>
              <ArrowLeft size={14} aria-hidden="true" /> Back
            </button>
            <div className="screen-head" style={{ marginTop: 12 }}>
              <h1>The competency check — the real one.</h1>
              <p>
                Seven core workplace competencies employers rank highest, from the national career-readiness
                standard (NACE). Two parts, both required:
              </p>
            </div>
            <div className="ob-parts">
              <div className="panel nextcard">
                <span className="label">PART A — SELF-RATINGS</span>
                <h3>{STATEMENT_TOTAL} statements — how you work</h3>
                <p className="n-why">
                  About 6 minutes. Every rating is self-report: it marks a competency as{" "}
                  <b>claimed</b> — a claimed competency carries no points.
                </p>
              </div>
              <div className="panel nextcard">
                <span className="label">PART B — THE CHECKS</span>
                <h3>{MCQ_TOTAL} one-answer situations</h3>
                <p className="n-why">
                  About 10 minutes. A competency is <b>verified</b> when BOTH of its checks are answered
                  correctly in this sitting — that&apos;s what earns into your index.
                </p>
              </div>
            </div>
            <div className="ob-ctas">
              <button
                className="btn btn-primary"
                onClick={() => go("likert")}
              >
                Start the assessment
              </button>
              <span className="ob-hint">About 15 minutes in total — that&apos;s an honest estimate.</span>
            </div>
            <p className="ob-fine">
              Retakes are allowed and your latest full sitting always counts. The standard lists 8
              competencies; Equity &amp; Inclusion is under review by NACE and isn&apos;t rated here — 7 carried,
              stated choice.
            </p>
          </section>
        )}

        {/* ============ step ③ · Part A — 28 Likert statements in 7 groups ============ */}
        {screen === "likert" && (
          <section className="ob-screen">
            <button className="ob-back" onClick={() => back("assessIntro")}>
              <ArrowLeft size={14} aria-hidden="true" /> Back
            </button>
            <div className="screen-head" style={{ marginTop: 12 }}>
              <h1>Part A — how you work, honestly.</h1>
              <p>
                Rate how often each behavior is already yours. First-person and specific — if a statement
                doesn&apos;t describe a habit, that&apos;s a real answer too.
              </p>
            </div>
            <div className="panel">
              <div className="panel-bar">
                <span className="label">PART A — SELF-RATING</span>
                <span className="label num">
                  {likertAnswered} of {STATEMENT_TOTAL} answered
                </span>
              </div>
              <p className="ob-scale-legend num">
                1 = never, 2 = rarely, 3 = sometimes, 4 = often, 5 = consistently — &ldquo;consistently&rdquo;
                means the behavior is your settled habit, not occasional.
              </p>
              {INSTRUMENT.map((c) => (
                <div key={c.title} className="inst-group" data-comp={c.title}>
                  <div className="inst-head">
                    <div className="inst-head-line">
                      <h3>{c.title}</h3>
                      <span className="chip c-grey hatch-chip" aria-hidden="true">
                        Self-report
                      </span>
                    </div>
                    <blockquote>{c.definition}</blockquote>
                  </div>
                  {c.statements.map((s, si) => (
                    <div key={s.id} className="inst-row" data-item={s.id}>
                      <p className="q-stem-md">{s.text}</p>
                      <div
                        className="scale"
                        role="group"
                        aria-label={`${c.title} — statement ${si + 1}, rate 1 to 5`}
                      >
                        {INSTRUMENT_LIKERT_SCALE.map((o) => (
                          <button
                            key={o.value}
                            type="button"
                            aria-pressed={likertChoices[s.id] === o.value}
                            aria-label={`${o.value} — ${o.label}`}
                            onClick={() => rate(s.id, o.value)}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="ob-ctas">
              <button
                className="btn btn-primary"
                disabled={likertAnswered < STATEMENT_TOTAL}
                onClick={beginSituations}
              >
                Continue
              </button>
              <span className="ob-hint" aria-live="polite">
                {likertAnswered < STATEMENT_TOTAL
                  ? `Answer all ${STATEMENT_TOTAL} to continue`
                  : "Self-ratings recorded — the checks follow."}
              </span>
            </div>
          </section>
        )}

        {/* ============ step ③ · Part B — 14 verification checks ============ */}
        {screen === "situations" && (
          <section className="ob-screen">
            {sitView === "intro" && (
              <div>
                <button className="ob-back" onClick={() => back("likert")}>
                  <ArrowLeft size={14} aria-hidden="true" /> Back
                </button>
                <div className="screen-head" style={{ marginTop: 12 }}>
                  <h1>Part B — the checks.</h1>
                  <p>
                    {MCQ_TOTAL} real-life situations, one best answer each. What verifies a competency is
                    answering <b>both</b> of its two checks correctly in this sitting — one right and one wrong
                    keeps it claimed, and no partial credit carries across sittings.
                  </p>
                </div>
                <div className="ob-ctas">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setSitView("question");
                      setSitIdx(0);
                      setSitPicked(null);
                      setSitAnswered(false);
                    }}
                  >
                    Start the checks
                  </button>
                  <span className="ob-hint">About 10 minutes.</span>
                </div>
              </div>
            )}

            {sitView === "question" && MCQ_RUN[sitIdx] && (() => {
              const { comp, mcq } = MCQ_RUN[sitIdx];
              const pickedKey = sitPicked;
              const passed = pickedKey !== null && pickedKey === mcq.key;
              const thisCompIdx = INSTRUMENT.findIndex((c) => c.title === comp.title) + 1;
              return (
                <div>
                  <div className="ob-qbar">
                    <span className="q-skill-tag num">
                      Question {sitIdx + 1} of {MCQ_RUN.length}, {thisCompIdx} of 7, {comp.title}
                    </span>
                    <button className="ob-back" onClick={() => back("likert")}>
                      <ArrowLeft size={14} aria-hidden="true" /> Back
                    </button>
                  </div>
                  <div className="panel ob-mcqcard" style={{ maxWidth: 640 }} data-mcq={mcq.id}>
                    <p className="q-stem" style={{ marginTop: 0 }}>{mcq.stem}</p>
                    <div className="q-opts">
                      {mcq.options.map((t, i) => (
                        <button
                          key={i}
                          className="opt"
                          type="button"
                          onClick={() => answerSituational(mcq.id, i)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className={`q-band ${sitAnswered ? "show" : ""} ${passed ? "pass" : "fail"}`}>
                      {sitAnswered &&
                        (passed
                          ? "Correct — this is the competency's core move. Keep it up."
                          : `Not quite. The strongest answer is: ${mcq.options[mcq.key]} Both of this competency's checks must be answered correctly to verify it.`)}
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <button className="btn btn-ghost" disabled={!sitAnswered || posting} onClick={situationsNext}>
                        {sitIdx + 1 >= MCQ_RUN.length ? (posting ? "Scoring…" : "See the result") : "Next"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </section>
        )}

        {/* ============ step ③ · instrument result — the server's grade ============ */}
        {screen === "assessResult" && grade && (() => {
          const verifiedTitles = INSTRUMENT.filter((c) => grade[c.title] === "verified").map((c) => c.title);
          const claimedTitles = INSTRUMENT.filter((c) => grade[c.title] === "claimed").map((c) => c.title);
          const n = verifiedTitles.length;
          return (
            <section className="ob-screen">
              <div className="screen-head">
                <h1>
                  {n} of {INSTRUMENT.length} competencies verified.
                </h1>
                <p>
                  {n === INSTRUMENT.length
                    ? "A clean sweep — every competency carried both checks."
                    : n > 0
                      ? "The verified ones answered both of their checks correctly in this sitting."
                      : "None verified yet — that's fine and it's honest. Your self-ratings stand as claimed."}
                </p>
              </div>
              {verifiedTitles.length > 0 && (
                <div className="okband" style={{ maxWidth: 560 }}>
                  Verified on your profile: <b>{verifiedTitles.join(", ")}</b>{" "}
                  <span className="vbadge ok"><Check size={11} aria-hidden="true" /></span>
                </div>
              )}
              {claimedTitles.length > 0 && (
                <p className="ob-note" style={{ maxWidth: 560 }}>
                  Claimed (self-report only): {claimedTitles.join(", ")}. A rating alone never earns points
                  and never closes a bar — the pair of checks is what verifies. Retakes: your latest full
                  sitting always counts, so building the skills and re-sitting honestly moves this.
                </p>
              )}
              <div className="ob-ctas">
                <button className="btn btn-primary" onClick={() => { setVView("intro"); go("verify"); }}>
                  Continue
                </button>
              </div>
            </section>
          );
        })()}

        {/* ============ OB-3b-3 · verification mini-quiz ============ */}
        {screen === "verify" && (
          <section className="ob-screen">
            {vView === "intro" && (
              <div>
                <button className="ob-back" onClick={() => back("assessResult")}>
                  <ArrowLeft size={14} aria-hidden="true" /> Back
                </button>
                <div className="screen-head" style={{ marginTop: 12 }}>
                  <h1>Make it official — quick skill check</h1>
                  <p>
                    You marked <b>{claimsCount}</b> skills as &ldquo;I can do this.&rdquo; Answer{" "}
                    <b>{quizItems.length} short questions</b> — about 90 seconds. What you pass shows as{" "}
                    <b>confirmed</b> on your profile from day one. What you don&apos;t simply stays as your own
                    rating. Nothing is lost either way.
                  </p>
                </div>
                <button className="btn btn-primary" onClick={startVerify}>
                  Start the check
                </button>
              </div>
            )}

            {vView === "question" && quizItems[vi] && (() => {
              const q = quizItems[vi];
              const passed = picked !== null && picked === q.answer;
              return (
                <div>
                  <div className="ob-qbar" style={{ maxWidth: 640 }}>
                    <span className="q-skill-tag num">
                      Question {vi + 1} of {quizItems.length}
                    </span>
                    <button
                      className="ob-back"
                      onClick={() => {
                        setVView("intro");
                        setVi(0);
                        setPicked(null);
                        setAnswered(false);
                      }}
                    >
                      <ArrowLeft size={14} aria-hidden="true" /> Back
                    </button>
                  </div>
                  <div className="panel ob-mcqcard" style={{ maxWidth: 640, marginTop: 12 }}>
                    <span className="q-skill-tag">About: {q.skill}</span>
                    <p className="q-stem" style={{ marginTop: 10 }}>{q.stem}</p>
                    <div className="q-opts">
                      {q.options.map((t, i) => (
                        <button
                          key={i}
                          className="opt"
                          type="button"
                          onClick={() => !answered && answerVerify(q, i)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className={`q-band ${answered ? "show" : ""} ${passed ? "pass" : "fail"}`}>
                      {answered &&
                        (passed
                          ? `Correct. ${q.skill}: confirmed.`
                          : `Not quite — that's what it does: ${q.options[q.answer]}. ${q.skill} stays as your own rating for now.`)}
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <button className="btn btn-ghost" disabled={!answered} onClick={verifyNext}>
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {vView === "result" && (() => {
              const passedNames = quizItems.filter((_, i) => vResults[i]).map((q) => q.skill);
              const failedNames = quizItems.filter((_, i) => !vResults[i]).map((q) => q.skill);
              const n = passedNames.length;
              let copy: string;
              if (n === quizItems.length) {
                copy = `${n} of ${n} confirmed — a real head start. Your profile shows this from day one.`;
              } else if (n > 0) {
                copy = `${n} of ${quizItems.length} confirmed. ${failedNames.join(", ")} — stay${
                  failedNames.length === 1 ? "s" : ""
                } as your own rating. You can confirm ${
                  failedNames.length === 1 ? "it" : "them"
                } later from Progress, after you've built ${failedNames.length === 1 ? "it" : "them"} up.`;
              } else {
                copy =
                  "None confirmed yet — that's fine and it's honest. Your self-ratings still shape your starting gaps; checks like this confirm them as you learn.";
              }
              return (
                <div>
                  <div className="screen-head">
                    <h1>
                      {n} of {quizItems.length} confirmed.
                    </h1>
                    <p>{copy}</p>
                  </div>
                  {passedNames.length > 0 && (
                    <div className="okband" style={{ maxWidth: 560 }}>
                      Confirmed on your profile: <b>{passedNames.join(", ")}</b>{" "}
                      <span className="vbadge ok"><Check size={11} aria-hidden="true" /></span>
                    </div>
                  )}
                  <div className="ob-ctas">
                    <button className="btn btn-primary" onClick={() => go("goal")}>
                      Continue
                    </button>
                  </div>
                </div>
              );
            })()}
          </section>
        )}

        {/* ============ OB-4 · goal suggestion ============ */}
        {screen === "goal" && career && sug && (
          <section className="ob-screen">
            <button className="ob-back" onClick={() => { setVView("intro"); back("verify"); }}>
              <ArrowLeft size={14} aria-hidden="true" /> Back
            </button>
            <div className="screen-head" style={{ marginTop: 12 }}>
              <h1>Set your first goal</h1>
              <p>One goal is enough to start. We picked it from your first gap.</p>
            </div>
            <div className="panel nextcard" style={{ maxWidth: 640 }}>
              <h3 style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                <input
                  aria-label="Goal title"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  style={{
                    flex: 1,
                    font: "inherit",
                    fontWeight: 500,
                    color: "var(--v-ink)",
                    background: "none",
                    border: "1px solid transparent",
                    borderRadius: 4,
                    padding: "2px 6px",
                  }}
                />
                <span className="label" style={{ flex: "none" }}>edit above</span>
              </h3>
              <p className="n-target">{goalTargetLine(sug.resourceId)}</p>
              <p className="n-why">
                Closes your first gap in {sug.skill} — the top skill for {career.name}.
              </p>
              {sug.resourceId && (
                <p className="n-why" style={{ marginTop: 12 }}>
                  When you finish the course and pass its 5-question check, this goal marks itself done —
                  automatically, under Progress. You&apos;ll see it happen.
                </p>
              )}
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

        {/* ============ OB-5 · first-score reveal ============ */}
        {screen === "reveal" && view?.career && view.score && (
          <Reveal view={view} armed={armed} quizItems={quizItems} />
        )}
      </div>
    </div>
  );
}

/* ---------- OB-5 reveal (computed from the fetched /api/state view) ---------- */

function Reveal({ view, armed, quizItems }: { view: StateView; armed: boolean; quizItems: VMCQ[] }) {
  const { state, career, score } = view;
  if (!career || !score) return null;
  const verifiedCount = Object.values(state.bars).filter((b) => b.source === "verified").length;
  const closed = Object.keys(state.bars).length;
  const mapSize = career.skills.length;
  const competencyEntries = Object.entries(state.competencies ?? {});
  const esVerified = competencyEntries.filter(([, v]) => v === "verified").length;
  const esClaimed = competencyEntries.filter(([, v]) => v === "claimed").length;
  const queue = stageOne(career, openSkills(career, state.bars)).queue;
  const activeGoal = state.goals.some((g) => g.type === "training" && g.status === "active");
  // persona line: "NEIL · 4th Year · Computer & IT" — the state's vocabulary
  // prints verbatim (yearLevel + the track's TRACK_LABELS label); no G-regex.
  const whoLine = [state.yearLevel, trackLabelOf(state.track)].filter(Boolean).join(", ");

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
        <h1>Your starting point</h1>
        <p>Computed from everything you just did. Not a grade — a before-and-after number.</p>
      </div>
      <div className="panel readout" style={{ maxWidth: 640 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <span className="label">
            READINESS — <b className="ob-who">NEIL, {whoLine}</b>
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
            <b>Skills</b> — {score.sp} of {WEIGHTS.sp}, {closed} of {mapSize} skills on your baseline ({verifiedCount}{" "}
            confirmed <span className="vbadge ok"><Check size={11} aria-hidden="true" /></span>)
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

      <div className="ob-section-wide" style={{ maxWidth: 640 }}>
        <div className="panel nextcard">
          <h3>Your learning pathway is ready</h3>
          <p className="n-why">
            It starts where your gaps are biggest: the Python basics course first — it feeds your goal directly.
            Your first 3 steps are queued.
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
        <Link className="btn btn-primary btn-hero" href="/dashboard">
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

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SegRubricBar } from "@/components/instrument";
import { CAREERS, DEMO_SUGGESTION_ORDER, TRACKS, TRACK_LABELS } from "@/lib/fixtures/catalog";
import { RESOURCES } from "@/lib/fixtures/resources";
import { openSkills, stageOne } from "@/lib/engines/gaps";
import { WEIGHTS } from "@/lib/engines/score";
import type { Career, Goal } from "@/lib/types";
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
 * Onboarding ①–⑤ — one client-side stepper (task 8).
 * Screens: strand → branch → interest quiz → suggestion cards →
 * 8-row self-report → M8-lite framing prompt → verification mini-quiz →
 * goal → first-score reveal. Markup ported 1:1 from prototype/onboarding.html;
 * copy verbatim from features/content/onboarding.md (OB-1…OB-5 tables);
 * demo mechanics canon from _fixture-math.md (5-item quiz → "2 of 5").
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

const getCareer = (id: string): Career | null => CAREERS.find((c) => c.id === id) ?? null;

/** GET /api/state payload (frozen read-only endpoint). */
interface StateView {
  state: {
    id: string;
    name: string;
    grade: string;
    strand: string;
    careerId: string | null;
    bars: Record<string, { source: string }>;
    goals: Goal[];
    stageOneDone: number;
  };
  career: Career | null;
  score: { sp: number; es: number; tp: number; cc: number; total: number } | null;
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

  /* ---- OB-3b-1 continue → one batch POST /api/claim ---- */
  function selfReportContinue() {
    if (!career) return;
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
    <>
      {/* OB-0 · progress line (the AppBar owns the sticky brand bar) */}
      <div className="ob-strip">
        <div className="ob-top">
          <span className="ob-steps" aria-live="polite">
            STEP {step} OF 5 ·{" "}
            {STEP_LABELS.map((l, i) => (
              <span key={l}>
                {i > 0 && <span className="ob-later"> → </span>}
                {i === step - 1 ? <b>{l}</b> : <span className="ob-later">{l}</span>}
              </span>
            ))}
          </span>
        </div>
      </div>

      <div className="shell" style={{ maxWidth: 920, paddingBottom: 72 }}>
        {/* ============ OB-1 · ① Strand select ============ */}
        {screen === "strand" && (
          <section className="ob-screen app-section">
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
            <div className="app-section" style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button className="btn btn-primary" disabled={!strand} onClick={() => go("branch")}>
                Continue
              </button>
              <span className="label" style={{ letterSpacing: "0.05em" }}>
                {strand ? "" : "Pick one to continue"}
              </span>
            </div>
            <p className="hero-foot" style={{ marginTop: 16 }}>
              We&apos;ll show careers for every track too — this just sets your default view.
            </p>
          </section>
        )}

        {/* ============ OB-2 · ② career-in-mind branch ============ */}
        {screen === "branch" && (
          <section className="ob-screen app-section">
            <button className="ob-back" onClick={() => back("strand")}>
              ← Back
            </button>
            <div className="screen-head" style={{ marginTop: 12 }}>
              <h1>Do you have a career in mind?</h1>
              <p>Most answers here are &ldquo;not yet&rdquo; — and that&apos;s exactly what this app is for.</p>
            </div>
            <div className="card-row two-col">
              <Link className="panel card" href="/career" style={{ textDecoration: "none", color: "inherit" }}>
                <h3>Yes — I know what I want to do</h3>
                <p className="c-line">Browse careers for your track, with entry routes shown.</p>
              </Link>
              <button className="panel card" type="button" onClick={() => { setQi(0); go("quiz"); }}>
                <h3>No — help me figure it out</h3>
                <p className="c-line">6 quick questions about what you enjoy, then we suggest careers that fit.</p>
              </button>
            </div>
            <p className="hero-foot" style={{ marginTop: 18 }}>
              Whichever you pick, you can change your career anytime — switching resets your plan and takes two
              minutes.
            </p>
          </section>
        )}

        {/* ============ OB-3a · interest quiz, live ============ */}
        {screen === "quiz" && (
          <section className="ob-screen app-section">
            <button
              className="ob-back"
              onClick={() => {
                if (qi > 0) setQi(qi - 1);
                else go("branch");
              }}
            >
              ← Back
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
            <div className="panel" style={{ padding: 24, maxWidth: 640 }}>
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
          <section className="ob-screen app-section">
            <div className="screen-head">
              <h1>Reading your answers…</h1>
            </div>
            <div className="card-row" style={{ maxWidth: 880 }} aria-hidden="true">
              <div className="panel" style={{ height: 180, background: "#EFF1EF" }} />
              <div className="panel" style={{ height: 180, background: "#EFF1EF" }} />
              <div className="panel" style={{ height: 180, background: "#EFF1EF" }} />
            </div>
          </section>
        )}

        {/* ============ OB-3a · suggestion cards + pick ============ */}
        {screen === "cards" && (
          <section className="ob-screen app-section">
            <button className="ob-back" onClick={() => back("branch")}>
              ← Back
            </button>
            <div className="screen-head" style={{ marginTop: 12 }}>
              <h1>Careers that fit how you answered</h1>
              <p>
                Based on your strand and what you told us. Pick the one that feels right — you can switch later.
              </p>
            </div>
            <div className="card-row" style={{ maxWidth: 980 }}>
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
            <div className="app-section" style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <Link className="link-sub" href="/career">
                See more careers for Computer & IT
              </Link>
              <Link className="link-sub" href="/career">
                None of these quite fit
              </Link>
            </div>
            {career && (
              <div className="app-section">
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
          <section className="ob-screen app-section">
            <button className="ob-back" onClick={() => back("cards")}>
              ← Back
            </button>
            <div className="screen-head" style={{ marginTop: 12 }}>
              <h1>Now — where are you today?</h1>
              <p>
                These are the {career.skills.length} core skills for {career.name}. Answer honestly:
                &ldquo;Not yet&rdquo; is a normal answer here, and it just sets your starting point.
              </p>
            </div>
            <div className="panel">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 16px",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                <span className="label">
                  {career.name} · {career.skills.length} core skills
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
            <div className="app-section" style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button
                className="btn btn-primary"
                disabled={Object.keys(sr).length < career.skills.length}
                onClick={selfReportContinue}
              >
                Continue
              </button>
              <span className="label" style={{ letterSpacing: "0.05em" }}>
                {Object.keys(sr).length < career.skills.length ? `Answer all ${career.skills.length} to continue` : ""}
              </span>
            </div>
          </section>
        )}

        {/* ============ OB-3b-2 · soft-skills framing prompt (M8-lite, unscored) ============ */}
        {screen === "framing" && (
          <section className="ob-screen app-section">
            <button className="ob-back" onClick={() => back("selfreport")}>
              ← Back
            </button>
            <div className="screen-head" style={{ marginTop: 12 }}>
              <h1>One more thing — the people side.</h1>
              <p>
                In a 2026 employer survey, teamwork ranked higher than technical skill — 85% wanted it on a
                resume, against 73% for technical know-how.
              </p>
              <p className="label" style={{ marginTop: 6 }}>
                Job Outlook 2026 employer survey
              </p>
            </div>
            <div className="panel" style={{ maxWidth: 640 }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--line-soft)" }}>
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
            <p style={{ marginTop: 14, fontSize: 13, color: "var(--ink-2)", maxWidth: "56ch" }}>
              Quick ratings are only a first read — people aren&apos;t good at rating themselves. Later,
              you&apos;ll answer short real-life situations that measure this properly. Nothing here changes your
              score.
            </p>
            <div className="app-section">
              <button className="btn btn-primary" onClick={() => { setVView("intro"); go("verify"); }}>
                Continue
              </button>
            </div>
          </section>
        )}

        {/* ============ OB-3b-3 · verification mini-quiz ============ */}
        {screen === "verify" && (
          <section className="ob-screen app-section">
            {vView === "intro" && (
              <div>
                <button className="ob-back" onClick={() => back("framing")}>
                  ← Back
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      maxWidth: 640,
                    }}
                  >
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
                      ← Back
                    </button>
                  </div>
                  <div className="panel" style={{ padding: 24, maxWidth: 640, marginTop: 12 }}>
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
                      Confirmed on your profile: <b>{passedNames.join(" · ")}</b>{" "}
                      <span className="vbadge ok">·✓</span>
                    </div>
                  )}
                  <div className="app-section">
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
          <section className="ob-screen app-section">
            <button className="ob-back" onClick={() => { setVView("intro"); back("verify"); }}>
              ← Back
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
                    fontWeight: 640,
                    color: "var(--ink)",
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
                <p className="n-why" style={{ marginTop: 12, color: "var(--ink-3)" }}>
                  When you finish the course and pass its 5-question check, this goal marks itself done —
                  automatically, under Progress. You&apos;ll see it happen.
                </p>
              )}
              <div className="n-cta" style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button className="btn btn-primary" onClick={setGoal}>
                  Set this goal
                </button>
                <button className="quiet-toggle" type="button" onClick={skipGoal}>
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
    </>
  );
}

/* ---------- OB-5 reveal (computed from the fetched /api/state view) ---------- */

function Reveal({ view, armed, quizItems }: { view: StateView; armed: boolean; quizItems: VMCQ[] }) {
  const { state, career, score } = view;
  if (!career || !score) return null;
  const verifiedCount = Object.values(state.bars).filter((b) => b.source === "verified").length;
  const closed = Object.keys(state.bars).length;
  const mapSize = career.skills.length;
  const queue = stageOne(career, openSkills(career, state.bars)).queue;
  const activeGoal = state.goals.some((g) => g.type === "training" && g.status === "active");
  const gradeLabel = state.grade === "G11" ? "GRADE 11" : state.grade;

  const parts = [
    { pct: WEIGHTS.sp, earnedFrac: score.sp / WEIGHTS.sp },
    { pct: WEIGHTS.es, earnedFrac: 0 },
    { pct: WEIGHTS.tp, earnedFrac: score.tp / WEIGHTS.tp },
    { pct: WEIGHTS.cc, earnedFrac: score.cc / WEIGHTS.cc },
  ];

  return (
    <section className="ob-screen app-section">
      <div className="screen-head">
        <h1>Your starting point</h1>
        <p>Computed from everything you just did. Not a grade — a before-and-after number.</p>
      </div>
      <div className="panel readout" style={{ maxWidth: 640 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <span className="label">
            READINESS · <b className="sample-tag" style={{ color: "var(--ink)", fontWeight: 600 }}>NEIL · {gradeLabel} · {state.strand}</b>
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
            ariaLabel={`Readiness ${score.total} of 100 — skills ${score.sp} of 40, people skills 0 of 25, training ${score.tp} of 20, direction ${score.cc} of 15`}
          />
        </div>
        <div className="stack" style={{ marginTop: 14 }}>
          <div className="tickline num">
            <b>Skills</b> — {score.sp} of 40 · {closed} of {mapSize} skills on your baseline ({verifiedCount}{" "}
            confirmed <span className="vbadge ok">·✓</span>)
          </div>
          <div className="tickline num">
            <b>People skills</b> — 0 of 25 · Not yet measured — situations come later
          </div>
          <div className="tickline num">
            <b>Training</b> — {score.tp} of 20 ·{" "}
            {state.stageOneDone === 0 ? "First 3 steps ready, none finished yet" : `${state.stageOneDone} of 3 done`}
          </div>
          <div className="tickline num">
            <b>Direction</b> — {score.cc} of 15 · Career picked ·{" "}
            {activeGoal ? "goal set" : "no goal set — Progress suggests one"}
          </div>
        </div>
      </div>

      <div className="app-section" style={{ maxWidth: 640 }}>
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
                  <b>{i + 1}</b> · {skill}
                  {res ? ` — ${res.title} · free · ~${res.durationHours} hrs` : ""}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="app-section" style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
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
  return `${cost} · ~${res.durationHours} hours · ${res.provider} — ${res.title}`;
}

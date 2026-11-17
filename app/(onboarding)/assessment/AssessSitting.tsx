"use client";

/**
 * AssessSitting.tsx — the standalone NACE retake sitting's client half
 * (the /verify pattern, 2026-11-18: extracted VERBATIM from
 * Onboarding.tsx's retake-mode screens — nace cards /
 * assessResult — so the instrument stays one register). The retake
 * prop collapses to always-true and the intro screen stays in the
 * first-run funnel (2026-11-18 user round: the retake lands straight
 * on question 1 — the /verify convention — with the sitting's
 * estimate as a hint on the first card; the honesty copy rides the
 * result screen). Every back control and result CTA
 * returns to /assessments, and no draft machinery — a closed sitting
 * is no attempt, the ONE POST /api/assessment at sitting end writes
 * the whole attempt (latest full sitting counts).
 */
import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Skeleton, SkeletonBlock } from "@/components/skeleton";
import {
  INSTRUMENT,
  INSTRUMENT_LIKERT_SCALE,
  gradeInstrumentAnswers,
  type InstrumentAnswers,
} from "@/lib/fixtures/instrument";
import type { CompetencyStatus } from "@/lib/types";

/** flat MCQ order: COM-1.M1, COM-1.M2, … COM-7.M2 (the POST contract's key set) */
const MCQ_RUN = INSTRUMENT.flatMap((c) => c.mcqs.map((m) => ({ comp: c, mcq: m })));

/* the flat card cadence — same derivation as Onboarding.tsx (one card
 * per screen: per competency its 4 Likert statement cards then its 2
 * check cards, 42 cards for a full sitting) */

type NaceCard =
  | { kind: "likert"; compIdx: number; stmtIdx: number }
  | { kind: "check"; compIdx: number; mcqIdx: number };

const NACE_CARDS: NaceCard[] = INSTRUMENT.flatMap((c, compIdx) => [
  ...c.statements.map((_s, stmtIdx): NaceCard => ({ kind: "likert", compIdx, stmtIdx })),
  ...c.mcqs.map((_m, mcqIdx): NaceCard => ({ kind: "check", compIdx, mcqIdx })),
]);

type Screen = "nace" | "assessResult";

export default function AssessSitting() {
  /* straight to question 1 (the /verify convention, user round
   * 2026-11-18) — the intro screen stays in the first-run funnel */
  const [screen, setScreen] = useState<Screen>("nace");
  const [naceCard, setNaceCard] = useState(0);
  const [likertChoices, setLikertChoices] = useState<Record<string, number>>({});
  const [mcqChoices, setMcqChoices] = useState<Record<string, number>>({});
  /** the SERVER's grade for the just-completed attempt (assessResult reads it) */
  const [grade, setGrade] = useState<Record<string, CompetencyStatus> | null>(null);
  const [posting, setPosting] = useState(false);

  const go = setScreen;

  function rate(item: string, value: number) {
    setLikertChoices((prev) => ({ ...prev, [item]: value }));
  }

  function answerSituational(mcqId: string, i: number) {
    setMcqChoices((prev) => ({ ...prev, [mcqId]: i }));
  }

  function naceNext() {
    const card = NACE_CARDS[naceCard];
    if (!card) return;
    /* the per-item gate: this one card requires its answer */
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

  return (
    /* the .v7ob wrapper — onboarding.css scopes every instrument rule
     * under it (same root class Onboarding.tsx renders) */
    <div className="v7ob">
      {/* ============ 7 paged competencies ============ */}
      {screen === "nace" && posting && (
        <section className="ob-screen" aria-live="polite" aria-busy="true">
          {/* the final NACE POST's skeleton is pre-shaped for the INCOMING
              result screen (head + implication panel + CTA pill) — not the
              outgoing check card */}
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
            <div className="ob-qbar">
              <span className="q-skill-tag num">
                COMPETENCY {card.compIdx + 1} OF {INSTRUMENT.length} · {comp.title}
              </span>
              <a className="ob-back" href="/assessments">
                <ArrowLeft size={14} aria-hidden="true" /> Back to Assessments
              </a>
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
              /* the statement card — one statement + its 5-point chip row */
              <div className="panel">
                <div style={{ padding: "16px 16px 18px" }}>
                  <span className="q-skill-tag num">
                    QUESTION {naceCard + 1} OF {NACE_CARDS.length}
                  </span>
                  <p className="q-stem-md" style={{ marginTop: 12 }}>
                    {comp.statements[card.stmtIdx].text}
                  </p>
                  <div
                    className="scale"
                    style={{ marginTop: 20 }}
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
              </div>
            ) : (() => {
              /* the check card — QuestionCard grammar + its immediate verdict band */
              const mcq = comp.mcqs[card.mcqIdx];
              const thisPick = mcqChoices[mcq.id];
              const didAnswer = thisPick != null;
              const passed = didAnswer && thisPick === mcq.key;
              return (
                <div className="panel ob-mcqcard" style={{ marginTop: 16 }} data-mcq={mcq.id}>
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
                    className={`q-band ${didAnswer ? "show" : ""} ${passed ? "pass" : "fail"}`}
                    aria-live="polite"
                  >
                    {didAnswer &&
                      (passed
                        ? "Correct — this is the competency's core move. Keep it up."
                        : `Not quite. The strongest answer is: ${mcq.options[mcq.key]} Both of this competency's checks must be answered correctly to verify it.`)}
                  </div>
                </div>
              );
            })()}
            <div className="ob-ctas">
              <button className="btn btn-primary" disabled={!answered || posting} onClick={naceNext}>
                {last ? (posting ? "Scoring…" : "Finish") : "Next"}
              </button>
              {naceCard === 0 && (
                <span className="ob-hint">About 15 minutes — that&apos;s an honest estimate.</span>
              )}
            </div>
          </section>
        );
      })()}

      {/* ============ result — the server's grade ============ */}
      {screen === "assessResult" && !grade && (
        <section className="ob-screen" aria-live="polite" aria-busy="true">
          {/* skeleton while the server grade is awaited — head + okband +
              tally panel + CTA pill */}
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
              <div className="okband">
                Verified on your profile: <b>{verifiedTitles.join(", ")}</b>{" "}
                <span className="vbadge ok"><Check size={11} aria-hidden="true" /></span>
              </div>
            )}
            {claimedTitles.length > 0 && (
              <p className="ob-note">
                Claimed (self-report only): {claimedTitles.join(", ")}. A rating alone never earns points
                and never closes a bar — the pair of checks is what verifies. Retakes: your latest full
                sitting always counts, so building the skills and re-sitting honestly moves this.
              </p>
            )}
            <div className="ob-ctas">
              <a className="btn btn-primary" href="/assessments">
                Back to Assessments
              </a>
            </div>
          </section>
        );
      })()}
    </div>
  );
}

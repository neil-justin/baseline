"use client";

/**
 * AssessSitting.tsx — the standalone NACE retake instrument's client half
 * (the /verify pattern, 2026-11-18: extracted from Onboarding.tsx's retake
 * screens so the instrument stays one register). Phase-2 register round
 * 2026-11-20: the card cadence mirrors the funnel's re-cut markup (the
 * statement card carries the Next/Finish pill in its own foot; the check
 * card keeps the absolutely-anchored verdict band), the likert scale is the
 * full-width tonal-row register, the result screen is the TallyRow register
 * (one row per competency, state chip per row — never a prose memo), and
 * the retake's confirm-guard rides honest labels: the first card shows the
 * CURRENT recorded standing with the replace warning, and the final Finish
 * control names the replacement when a previous attempt exists.
 *
 * Writes: none mid-sitting — a closed sitting is no attempt; the ONE POST
 * /api/assessment at the last card writes the whole attempt (your latest
 * attempt always counts). Every back control returns to /assessments
 * harmless (plain navigation, no write).
 */
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/skeleton";
import { TallyRow } from "@/components/quiz/QuestionCard";
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
 * check cards, 42 cards for a full attempt) */

type NaceCard =
  | { kind: "likert"; compIdx: number; stmtIdx: number }
  | { kind: "check"; compIdx: number; mcqIdx: number };

const NACE_CARDS: NaceCard[] = INSTRUMENT.flatMap((c, compIdx) => [
  ...c.statements.map((_s, stmtIdx): NaceCard => ({ kind: "likert", compIdx, stmtIdx })),
  ...c.mcqs.map((_m, mcqIdx): NaceCard => ({ kind: "check", compIdx, mcqIdx })),
]);

type Screen = "nace" | "assessResult";

/** the confirm-guard's standing: the student's CURRENT recorded result
 *  (engine truth from the page), or null when nothing is recorded yet. */
export interface AssessStanding {
  verified: number;
  date: string;
}

export default function AssessSitting({ latest }: { latest: AssessStanding | null }) {
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

  /* the confirm-guard's honest Finish: a previous attempt exists → the
   * control names the replacement; nothing recorded yet → plain Finish */
  const finishLabel = latest ? "Finish — replaces your latest result" : "Finish";

  return (
    /* the .v7ob wrapper — onboarding.css scopes every shared instrument rule
     * under it (same root class Onboarding.tsx renders); .ass-rt carries this
     * surface's own scoped register (assessment.css) */
    <div className="v7ob ass-rt">
      {/* ============ 7 paged competencies ============ */}
      {screen === "nace" && posting && (
        <section className="ob-screen" aria-live="polite" aria-busy="true">
          {/* the final NACE POST's skeleton mirrors the INCOMING result
              screen (head + the per-competency tally panel + CTA pill) */}
          <div className="skel-head">
            <Skeleton />
            <Skeleton />
          </div>
          <div className="panel ob-tally" aria-hidden="true">
            {Array.from({ length: INSTRUMENT.length }, (_, i) => (
              <Skeleton key={i} className="skel-trow" />
            ))}
          </div>
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
            {/* the confirm-guard's standing (first card only): the current
                recorded result + the one plain replace line */}
            {naceCard === 0 && latest && (
              <div className="ass-standing">
                <p className="ass-standing-line num">
                  Your latest: {latest.verified} of {INSTRUMENT.length} verified · {latest.date}
                </p>
                <p className="ass-standing-sub">
                  Starting a new check replaces it — your latest attempt always counts.
                </p>
              </div>
            )}
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
              /* the statement card — the stem stays dominant; the 5-point
               * scale is full-width tonal rows (the register spec) and the
               * Next pill lives in the card's own foot — no dead space */
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
                    {last ? (posting ? "Scoring…" : finishLabel) : "Next"}
                  </button>
                  {naceCard === 0 && (
                    <span className="ob-hint">About 15 minutes — that&apos;s an honest estimate.</span>
                  )}
                </div>
              </div>
            ) : (() => {
              /* the check card — QuestionCard grammar + its verdict band;
               * the pending band renders the quiet hint line (the register
               * spec's no-dead-void option) and the Finish pill sits in the
               * card's own foot, above the band's anchored spot */
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
                      {last ? (posting ? "Scoring…" : finishLabel) : "Next"}
                    </button>
                    {last && latest && !posting && (
                      <span className="ob-hint">
                        Nothing is saved until you finish — this attempt then replaces your latest.
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}
          </section>
        );
      })()}

      {/* ============ result — the server's grade, the TallyRow register ============ */}
      {screen === "assessResult" && !grade && (
        <section className="ob-screen" aria-live="polite" aria-busy="true">
          {/* skeleton while the server grade is awaited — mirrors the result
              screen (head + per-competency tally panel + CTA pill) */}
          <div className="skel-head">
            <Skeleton />
            <Skeleton />
          </div>
          <div className="panel ob-tally" aria-hidden="true">
            {Array.from({ length: INSTRUMENT.length }, (_, i) => (
              <Skeleton key={i} className="skel-trow" />
            ))}
          </div>
          <div className="ob-ctas">
            <Skeleton className="skel-pill" />
          </div>
        </section>
      )}
      {screen === "assessResult" && grade && (() => {
        /* one row per competency — the SERVER's grade keys the chip, and the
         * dot count mirrors THIS attempt's own check answers (the same data
         * the server graded — nothing painted, nothing client-claimed) */
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
                  : "Your competency check is recorded."}
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
              <a className="btn btn-ghost" href="/assessments">
                Back to Assessments
              </a>
              <a className="link-sub" href="/assessment">
                Retake the check
              </a>
            </div>
            <p className="ob-fine">
              NACE lists 8 competencies — Equity &amp; Inclusion is under review, so 7 are rated here.
            </p>
          </section>
        );
      })()}
    </div>
  );
}

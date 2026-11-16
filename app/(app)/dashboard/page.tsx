import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { getStudentView } from "@/lib/db";
import { requireStudent } from "@/lib/session";
import { scoreView } from "@/lib/engines/rubric";
import { planHead, planFor } from "@/lib/engines/plan";
import {
  WEIGHTS,
  CC_TICKS,
  ASSESSED_COMPETENCIES,
  roundHalfDown,
} from "@/lib/engines/score";
import Reveal from "@/components/Reveal";
import "./dashboard.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard — Baseline",
  description:
    "Your readiness score, the five channels behind it, and the ranked plan that moves it.",
};

function UndecidedDefault() {
  return (
    <div className="v7dash">
      <section className="scoreband" aria-label="Your readiness score">
        {/* Tier 2b: the undecided band renders through the SAME shared
            recipe + classes as the decided path (.band + .bandrow); the
            bespoke .band-in grid + .score-left/.score-right padding
            blocks are dead. Content preserved. */}
        <div className="band">
          <div className="bandrow">
            <div className="who">
              <span className="label">Readiness</span>
              <div className="score-readout num">
                <span className="score-big">0</span>
                <small>of 100</small>
              </div>
              <p className="score-line">No career picked yet.</p>
            </div>
            <div>
              <div className="seg-head">
                <span className="label">Breakdown</span>
                <span className="label num">{Object.values(WEIGHTS).join(" / ")}</span>
              </div>
              <p className="score-line">
                Pick a career to open your pathway:{" "}
                <a className="link-sub" href="/career">
                  browse the career index{" "}
                  <ArrowRight size={14} aria-hidden="true" />
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/** M1 Dashboard — the score home. DNA v7 (LOCKED 2026-10-29): header band
 *  (who · composite 40/100 · segmented five-channel bar · the one CTA), the
 *  five channel cells, the dense ranked plan table + the projection queue,
 *  then the competency ledger. Every number is computed (scoreView + the
 *  locked engine constants); no painted readiness anywhere. */
export default async function DashboardPage() {
  const profile = await requireStudent();
  const { state, career, score, ar } = await getStudentView(profile.studentId);
  if (!career || !score) return <UndecidedDefault />;

  const v = scoreView(career, state, ar);
  // My Plan round Q4b: the plan's head item IS the commitment; while AR is
  // unmeasured the head is the diagnostic that opens the channel.
  const head = planHead(career, state, ar);
  const plan = planFor(career, state, ar);

  // bar provenance (real data): verified ·✓ vs claimed vs open on the map
  const barValues = Object.values(state.bars);
  const verifiedBars = barValues.filter((b) => b.source === "verified").length;
  const claimedBars = barValues.length - verifiedBars;
  const mapSize = v.mapSize;

  // SP projection when one more bar closes (locked half-down convention)
  const spAfterNext = roundHalfDown((WEIGHTS.sp * (v.closed + 1)) / mapSize);
  const spDelta = Math.max(0, spAfterNext - score.sp);

  const claimedCompetencies = Object.values(state.competencies ?? {}).filter(
    (s) => s !== "verified"
  ).length;

  /* ---------- five channel cells (SP · ES · TP · AR · CC) ---------- */
  const pct = (n: number, d: number) => `${((n / d) * 100).toFixed(3)}%`;

  /* D1 gauge geometry (user ruling 2026-11-04): the sweep runs from the
     gauge's LEFT arm to its RIGHT arm through the top — 180° total, 1.8°
     per readiness point. 46% ≈ nearly straight-up needle. Derived from
     the engine truth, never painted. */
  const gaugeAngle = 180 - (score.total / 100) * 180;
  const gaugeRad = (gaugeAngle * Math.PI) / 180;
  const gaugeArc = {
    ex: 150 + 95 * Math.cos(gaugeRad),
    ey: 150 - 95 * Math.sin(gaugeRad),
    nex: 150 + 60 * Math.cos(gaugeRad),
    ney: 150 - 60 * Math.sin(gaugeRad),
  };

  return (
    <div className="v7dash">
      {/* ── header band: who · composite · five-channel bar · the one CTA ── */}
      <section className="scoreband" aria-label="Your readiness score">
        <div className="band">
          <div className="bandrow hero-row">
            <div className="who">
              <h1 className="t">
                {/* persona line: "Neil · 4th Year" — the state's yearLevel IS the
                    print (the G-regex gradeLabel helper died with the SHS scope) */}
                {state.name}, {state.yearLevel}
              </h1>
              <div className="m">{career.name}</div>
          {/* the big numeral died (user ruling 2026-11-04): the gauge carries
              the number once — the score stays announced for AT */}
              <span className="sr-only">Readiness {score.total} of 100</span>
              <div className="composite-wrap">
                <div className="ratemsg num">
                  You&apos;re <b className="num">{score.total}%</b> ready for {career.name}; {v.closed} bars
                  already counted.
                </div>
              </div>
              {head && (
                <a className="cta" href={head.kind === "ar" ? head.href : "/pathway"}>
                  Your next step <ArrowRight size={14} aria-hidden="true" />
                </a>
              )}
            </div>
            {/* D1 readiness gauge (user ruling 2026-11-04): the arc sweeps to the
                COMPUTED score and the needle rides the same angle — derived from
                the engine truth, never painted. The five-channel factor labels
                live in the KPI cells below (the segs strip retired). */}
            <svg className="scoregauge" viewBox="0 0 300 200" aria-hidden="true">
              <path d="M55 150 A 95 95 0 0 1 245 150" fill="none" stroke="var(--v-rows)" strokeWidth="22" strokeLinecap="round" />
              <path
                d={`M55 150 A 95 95 0 0 1 ${gaugeArc.ex.toFixed(1)} ${gaugeArc.ey.toFixed(1)}`}
                fill="none"
                stroke="var(--v-blue)"
                strokeWidth="22"
                strokeLinecap="round"
              />
              <g stroke="var(--v-line, #dadce0)" strokeWidth="2.5" strokeLinecap="round">
                <line x1="110" y1="62" x2="114" y2="70" />
                <line x1="190" y1="62" x2="186" y2="70" />
                <line x1="230" y1="150" x2="230" y2="141" />
              </g>
              <line
                x1="150"
                y1="150"
                x2={gaugeArc.nex.toFixed(1)}
                y2={gaugeArc.ney.toFixed(1)}
                stroke="var(--v-green)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <circle cx="150" cy="150" r="9" fill="var(--v-ink)" />
              <circle cx="150" cy="150" r="3.5" fill="#fff" />
              <text x="150" y="188" textAnchor="middle" className="gauge-cap num">
                {score.total} of 100
              </text>
            </svg>
          </div>
        </div>
      </section>

      {/* ── five channel KPI cells (the Classroom grid) ── */}
      <section className="kpis" aria-label="The five channels">
        <div className="kpi k-sp">
          <span className="kicon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--v-blue)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 17l5-5 4 4 8-8" />
            </svg>
          </span>
          <div className="sub-row">
            <span className="s-name">Skill progress</span>
          </div>
          <div className="score num">
            {score.sp} <small>/{WEIGHTS.sp}</small>
          </div>
          <div
            className="kbar"
            role="img"
            aria-label={`Skill progress ${score.sp} of ${WEIGHTS.sp} — ${verifiedBars} verified, ${claimedBars} self-report`}
          >
            <i className="solid" style={{ width: pct(verifiedBars, mapSize) }} />
            <i
              className="hatch"
              style={{ left: pct(verifiedBars, mapSize), width: pct(claimedBars, mapSize) }}
            />
          </div>
          <span className={`chip ${score.sp >= WEIGHTS.sp ? "c-green" : "c-blue"}`}>
            {score.sp >= WEIGHTS.sp ? "Complete" : "In progress"}
          </span>
        </div>

        <div className="kpi k-es">
          <span className="kicon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--v-green)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
          <div className="sub-row">
            <span className="s-name">Employability skills</span>
          </div>
          <div className="score num">
            {score.es} <small>/{WEIGHTS.es}</small>
          </div>
          <div
            className="kbar"
            role="img"
            aria-label={`Employability skills ${score.es} of ${WEIGHTS.es} — ${v.esVerified} of 7 verified`}
          >
            <i className="solid green" style={{ width: pct(score.es, WEIGHTS.es) }} />
          </div>
          <span className="chip c-green">{v.esVerified} verified</span>
        </div>

        <div className="kpi k-tp">
          <span className="kicon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--v-amber)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>
          </span>
          <div className="sub-row">
            <span className="s-name">Training progress</span>
          </div>
          <div className="score num">
            {score.tp} <small>/{WEIGHTS.tp}</small>
          </div>
          <div
            className="kbar"
            role="img"
            aria-label={`Training progress ${score.tp} of ${WEIGHTS.tp}`}
          >
            <i className="solid" style={{ width: pct(score.tp, WEIGHTS.tp) }} />
          </div>
          <span
            className={`chip ${
              score.tp >= WEIGHTS.tp ? "c-green" : v.stageOne.done > 0 ? "c-blue" : "c-amber"
            }`}
          >
            {score.tp >= WEIGHTS.tp ? "Complete" : v.stageOne.done > 0 ? "In progress" : "Pending evidence"}
          </span>
        </div>

        <div className="kpi kpi-ar k-ar">
          <span className="kicon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--v-blue)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
          </span>
          <div className="sub-row">
            <span className="s-name">Application readiness</span>
          </div>
          <div className="score num">
            {v.arMeasured ? score.ar : "—"} <small>/{WEIGHTS.ar}</small>
          </div>
          <div
            className="kbar"
            role="img"
            aria-label={
              v.arMeasured
                ? `Application readiness ${score.ar} of ${WEIGHTS.ar}`
                : "Application readiness — not yet measured"
            }
          >
            <i
              className="solid"
              style={{ width: v.arMeasured && score.ar !== null ? pct(score.ar, WEIGHTS.ar) : "0" }}
            />
          </div>
          <span
            className={`chip ${
              !v.arMeasured ? "c-grey" : score.ar === WEIGHTS.ar ? "c-green" : "c-blue"
            }`}
          >
            {!v.arMeasured ? "Not yet measured" : score.ar === WEIGHTS.ar ? "Complete" : "In progress"}
          </span>
        </div>

        <div className="kpi k-cc">
          <span className="kicon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--v-blue)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </span>
          <div className="sub-row">
            <span className="s-name">Career clarity</span>
          </div>
          <div className="score num">
            {score.cc} <small>/{WEIGHTS.cc}</small>
          </div>
          <div
            className="kbar"
            role="img"
            aria-label={`Career clarity ${score.cc} of ${WEIGHTS.cc}`}
          >
            <i className="solid" style={{ width: pct(score.cc, WEIGHTS.cc) }} />
          </div>
          <span className={`chip ${score.cc >= WEIGHTS.cc ? "c-green" : "c-blue"}`}>
            {score.cc >= WEIGHTS.cc ? "Complete" : "In progress"}
          </span>
        </div>
      </section>

      {/* ── dense lower deck: ranked plan table + what moves the number ── */}
      <section className="low">
        <Reveal className="card">
          <div className="head">
            <b>My Plan — next items</b>
          </div>
          <table className="plan-table">
            <thead>
              <tr>
                <th className="col-item">Item</th>
                <th>Channel</th>
                <th>State</th>
                <th>Effect</th>
              </tr>
            </thead>
            <tbody>
              {/* user cap 2026-11-06: the dashboard shows at most 3 next
                  items — the full ranked list lives on My Plan */}
              {plan.slice(0, 3).map((item, i) => {
                if (item.kind === "ar") {
                  const measured = [item.checklist.resume, item.checklist.letter, item.checklist.presence].filter(Boolean).length;
                  const arOutstanding = WEIGHTS.ar - (score.ar ?? 0);
                  return (
                    <tr key="ar">
                      <td>
                        <div className="item">{item.title}</div>
                      </td>
                      <td>
                        <span className="chip c-grey">Application</span>
                      </td>
                      <td>
                        <span className={`chip ${measured > 0 ? "c-blue" : "c-grey"}`}>
                          {measured > 0 ? `${measured} of 3 measured` : "Not started"}
                        </span>
                      </td>
                      <td className="eff num">opens AR, up to +{arOutstanding}</td>
                    </tr>
                  );
                }
                // skill step — projected SP re-fraction if this bar closes
                // (each queued row assumes the ones above it closed first)
                const priorSkillCount = plan
                  .slice(0, i)
                  .filter((p) => p.kind === "skill").length;
                return (
                  <tr key={item.skill}>
                    <td>
                      <div className="item">Close {item.skill}</div>
                    </td>
                    <td>
                      <span className="chip c-blue">Skill progress</span>
                    </td>
                    <td>
                      <span className={`chip ${item.hasFreeResource ? "c-green" : "c-blue"}`}>
                        {item.hasFreeResource ? "Ready" : "Next"}
                      </span>
                    </td>
                    <td className="eff num">
                      SP{" "}
                      {roundHalfDown((WEIGHTS.sp * (v.closed + priorSkillCount)) / mapSize)}{" "}
                      <ArrowRight size={10} aria-hidden="true" />{" "}
                      {roundHalfDown((WEIGHTS.sp * (v.closed + priorSkillCount + 1)) / mapSize)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {plan.length > 3 && (
            <div className="foot">
              <a className="foot-link" href="/pathway">
                My Plan
              </a>
            </div>
          )}
        </Reveal>

        <Reveal className="card actions" delay={70}>
          <div className="head">
            <b>What moves the number</b>
          </div>
          {!v.arMeasured && (
            <div className="row">
              <div>
                <b>Run the resume checker</b>
                <div className="sub">first AR factor, opens the channel</div>
              </div>
              <span className="badge num">up to +{WEIGHTS.ar}</span>
            </div>
          )}
          {v.arMeasured && !v.arComplete && (
            <div className="row">
              <div>
                <b>Finish your application materials</b>
                <div className="sub">
                  {[!v.arFactors.letter.measured && "cover-letter checker", !v.arFactors.presence.measured && "presence declaration"]
                    .filter(Boolean)
                    .join(", ")}{" "}
                  still open
                </div>
              </div>
              <span className="badge num">up to +{WEIGHTS.ar - (score.ar ?? 0)}</span>
            </div>
          )}
          {plan.some((p) => p.kind === "skill") && (
            <div className="row">
              <div>
                <b>Close a First-30-days bar</b>
                <div className="sub">closes the bar, your score updates</div>
              </div>
              <span className="badge num">+{spDelta}</span>
            </div>
          )}
          {!v.ccFirstDone && (
            <div className="row">
              <div>
                <b>Finish the first plan item</b>
                <div className="sub">the CC first-item tick</div>
              </div>
              <span className="badge num">+{CC_TICKS.firstDone}</span>
            </div>
          )}
          <div className="journey-row num">
            Where you are: <b>First 30 days</b>, {v.stageOne.done} of 3 done.
          </div>
        </Reveal>
      </section>

      {/* ── competency ledger (the ES channel's receipts) ── */}
      <Reveal as="section" className="card ledger" ariaLabel="Competency ledger — Employability Skills">
        <div className="head">
          <b>Competency ledger — Employability Skills</b>
          <span className="num">
            {v.esVerified} of {ASSESSED_COMPETENCIES} verified, {claimedCompetencies} self-report
          </span>
        </div>
        <div className="lgrid">
          {Object.entries(state.competencies ?? {}).map(([name, st]) => (
            <div className="lrow" key={name}>
              {/* the ONE icon register, take 2 (user ruling 2026-11-04): the
                  white check was scribbly at 20px and the ring-in-ring disc
                  read as a radio control — the claim marker is now a quiet
                  dash on a grey disc, materially "not yet", not "click me" */}
              <span className={`ms ${st === "verified" ? "done" : ""}`} aria-hidden="true">
                {st === "verified" ? (
                  <svg viewBox="0 0 24 24" className="ms-ic">
                    <circle cx="12" cy="12" r="11" fill="var(--v-green)" />
                    <path d="M7.2 12.4l3.1 3.1 6.5-6.9" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="ms-ic">
                    <circle cx="12" cy="12" r="11" fill="var(--v-grey-wash)" />
                    <path d="M8.5 12h7" fill="none" stroke="var(--v-ink2)" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                )}
              </span>
              <b>{name}</b>
              <span className={`chip ${st === "verified" ? "c-green" : "c-grey hatch-chip"}`}>
                {st === "verified" ? (
                  <>
                    Verified <Check size={11} aria-hidden="true" />
                  </>
                ) : (
                  "Self-reported"
                )}
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

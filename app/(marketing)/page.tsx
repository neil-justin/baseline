import { CATALOG_TOTAL, getCareer, trackLabelOf } from "@/lib/fixtures/catalog";
import type { Career } from "@/lib/types";
import { NEIL_SEED } from "@/lib/fixtures/neil";
import { computeScore, WEIGHTS, type Score } from "@/lib/engines/score";
import SampleGauge, { type GaugeRow } from "./SampleGauge";
import "./landing.css";

export const metadata = {
  title: "Career Readiness — know exactly where you stand",
  description:
    "An evidence-cited readiness score for 36 Philippine careers — computed from what you can actually do, with a ranked path for every gap.",
};

/** Track label rendered the way the index table says it. */
function trackLabel(c: Career): string {
  return trackLabelOf(c.track);
}

/** Organic sample-score derivation: the canon beat-5 seed, scored by the engine. */
function sampleScore(): Score {
  const seedCareer = getCareer(NEIL_SEED.careerId) as Career;
  return computeScore({
    bars: NEIL_SEED.bars,
    careerId: NEIL_SEED.careerId,
    careerSkillCount: seedCareer.skills.length,
    goals: NEIL_SEED.goals,
    stageOneDone: NEIL_SEED.stageOneDone,
    competencies: NEIL_SEED.competencies,
  });
}

/** Hero mini-index rows: five track-spread careers, fit = demonstrated bars in each career's map. */
const GAUGE_IDS = ["swd", "qa", "its", "book", "adminassoc"] as const;

function gaugeRows(): GaugeRow[] {
  const demonstrated = Object.entries(NEIL_SEED.bars)
    .filter(([, v]) => v.source === "verified" || v.source === "checked")
    .map(([k]) => k);
  return GAUGE_IDS.map((id) => {
    const c = getCareer(id) as Career;
    return {
      name: c.name,
      x: demonstrated.filter((n: string) => c.skills.some((s: { name: string }) => s.name === n)).length,
      y: c.skills.length,
    };
  });
}

/** The 12-row index preview, in the locked interleaved order (landing-auth.md block 4). */
const PREVIEW_IDS = [
  "qa",
  "swd",
  "da",
  "its",
  "hra",
  "mkt",
  "book",
  "fas",
  "adminassoc",
  "encode",
  "teller",
  "csr",
] as const;

const RUBRIC_LABELS = [
  { n: "Skill progress", d: "what you can do, checked" },
  { n: "Employability skills", d: "the NACE assessment, verified" },
  { n: "Training progress", d: "what you finished and passed" },
  { n: "Application readiness", d: "resume 7 · letter 5 · presence 3" },
  { n: "Career clarity", d: "whether you’ve committed to the plan" },
] as const;

const RUBRIC_PCTS = [WEIGHTS.sp, WEIGHTS.es, WEIGHTS.tp, WEIGHTS.ar, WEIGHTS.cc] as const;

/**
 * M0 Landing — the public measurement. v7.2 persuade reskin (wave 3):
 * static honest print (the Index reveal/scan machinery retired; the gauge
 * keeps the count-up + armed-bar measurement via SampleGauge). Stats and
 * sources print verbatim — never re-worded, never invented.
 */
export default function LandingPage() {
  const score = sampleScore();
  const gauge = gaugeRows();

  return (
    <>
      {/* first viewport */}
      <section className="hero">
        <div className="cap hero-grid">
          <div>
            <h1>Know exactly where you stand.</h1>
            <p className="lede">
              6.0% of the labor force is out of work, a four-year high, and 38.2% of the unemployed
              finished college. Finishing a degree is not the same as being ready. About fifteen
              minutes gives you one number and the next steps.
            </p>
            <div className="hero-ctas">
              <a className="cta" href="/signup">
                Start check <span className="arr">→</span>
              </a>
              <a className="sublink" href="#index">
                Browse the career index <span className="arr">→</span>
              </a>
            </div>
          </div>

          {/* sample instrument */}
          <SampleGauge
            rows={gauge}
            total={CATALOG_TOTAL}
            score={score}
            yearLevel={NEIL_SEED.yearLevel}
            track={trackLabelOf(NEIL_SEED.track)}
          />
        </div>
      </section>

      {/* stat band */}
      <section className="stats band" aria-label="The labor market, in three cited numbers">
        <div className="stats-grid cap">
          <div className="stat">
            <div className="num-row">
              <span className="n num">
                6.0<sub>%</sub>
              </span>
              <p className="q">
                of the labor force is unemployed: 3.14&nbsp;M jobless, a four-year high, 1.33&nbsp;M
                new youth entrants.
              </p>
            </div>
            <div className="src">
              PSA Labor Force Survey, July 2026 (released Sep 8, 2026) —
              psa.gov.ph/statistics/labor-force-survey
            </div>
          </div>
          <div className="stat">
            <div className="num-row">
              <span className="n num">
                12.9<sub>%</sub>
              </span>
              <p className="q">underemployed: working, not enough hours.</p>
            </div>
            <div className="src">
              PSA Labor Force Survey, July 2026 — psa.gov.ph/statistics/labor-force-survey
            </div>
          </div>
          <div className="stat">
            <div className="num-row">
              <span className="n num">
                38.2<sub>%</sub>
              </span>
              <p className="q">of the unemployed are college graduates, the single largest group.</p>
            </div>
            <div className="src">PSA LFS data via C. Habito, BusinessMirror, 2025 (underlying survey cited)</div>
          </div>
        </div>
      </section>

      {/* career index preview */}
      <section className="section" id="index">
        <div className="cap">
          <div className="section-head">
            <h2>The career index</h2>
            <p>Twelve of the {CATALOG_TOTAL} careers, each with its skill map and entry path. The rest open after you start.</p>
          </div>

          <div className="card idx-table">
            <div className="idx-heads kicker" aria-hidden="true">
              <span>CAREER</span>
              <span>TRACK</span>
              <span>SKILLS</span>
              <span>ENTRY PATH</span>
            </div>
            {PREVIEW_IDS.map((id) => {
              const c = getCareer(id) as Career;
              return (
                <div className="idx-row" key={id}>
                  <span className="career">{c.name}</span>
                  <span className="track">{trackLabel(c)}</span>
                  <span className="skills">
                    <span className="num">{c.skills.length}</span>
                  </span>
                  <span className="entry">{c.entryRoute}</span>
                </div>
              );
            })}
          </div>

          <div className="idx-foot">
            <p>
              The full index has <b className="num">{CATALOG_TOTAL}</b> careers across every PH corporate track.
            </p>
            <a className="cta-ghost" href="/signup">
              Start check <span className="arr">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* rubric honesty band */}
      <section className="rub-section band">
        <div className="cap rub-grid">
          <div className="section-head">
            <h2>How the score is built.</h2>
            <p>
              Five measured channels, added to one number out of 100. The widths below are each
              channel’s fixed share of the score.
            </p>
          </div>
          <div>
            <div
              className="rub-bar num"
              role="img"
              aria-label={`Rubric proportions: ${RUBRIC_LABELS.map(
                (l, i) => `${l.n.toLowerCase()} ${RUBRIC_PCTS[i]} percent`
              ).join(", ")}`}
            >
              {RUBRIC_PCTS.map((pct, i) => (
                <div key={i} className="rub-seg" style={{ flex: pct }}></div>
              ))}
            </div>
            <div className="rub-labels">
              {RUBRIC_LABELS.map((l, i) => (
                <div key={l.n} className="rub-label" style={{ flex: RUBRIC_PCTS[i] }}>
                  <div className="w num">
                    {RUBRIC_PCTS[i]}
                    <small>%</small>
                  </div>
                  <div className="n">{l.n}</div>
                  <div className="d">{l.d}</div>
                </div>
              ))}
            </div>
            <div className="rub-scale num">
              <span>0</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </section>

      {/* work loop */}
      <section className="section">
        <div className="cap loop">
          <div className="section-head">
            <h2>The check, step by step.</h2>
            <p>Four steps, in order.</p>
          </div>
          <div className="card loop-grid">
            <div className="loop-step">
              <div className="loop-num num">01</div>
              <div>
                <h3>Answer the setup questions</h3>
                <p className="mech">
                  Track, interests, and the skills you already have.
                </p>
                <p className="beat">SETUP · TRACK &amp; SKILLS</p>
              </div>
            </div>
            <div className="loop-step">
              <div className="loop-num num">02</div>
              <div>
                <h3>Get one number, computed in front of you</h3>
                <p className="mech">It traces to what you passed.</p>
                <p className="beat">
                  FIRST SCORE · <span className="chip c-grey">SAMPLE {score.total}</span>
                </p>
              </div>
            </div>
            <div className="loop-step">
              <div className="loop-num num">03</div>
              <div>
                <h3>See your gaps in bars</h3>
                <p className="mech">
                  Each skill shows a bar and its check badge: ✓ verified quiz, ✓✓ checked resource.
                </p>
                <p className="beat">GAPS · BAR BY BAR</p>
              </div>
            </div>
            <div className="loop-step">
              <div className="loop-num num">04</div>
              <div>
                <h3>Start ranked steps the same day</h3>
                <p className="mech">
                  Courses, certificates, and TESDA NCs with prices shown (<span className="num">free</span>, <span className="num">₱450</span>
                  ); your first three steps are named.
                </p>
                <p className="beat">PATHWAY · RANKED</p>
              </div>
            </div>
          </div>
          <div className="loop-close">
            <a className="cta-ghost" href="/signup">
              Start check <span className="arr">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* evidence close + footer */}
      <footer className="evidence band">
        <div className="cap evidence-grid">
          <div>
            <h2 className="close-title">Every number names its source.</h2>
          </div>
          <div>
            <ul className="srcs">
              <li>
                <span className="k">6.0%</span>
                <span>PSA Labor Force Survey, July 2026 — unemployment (psa.gov.ph/statistics/labor-force-survey)</span>
              </li>
              <li>
                <span className="k">12.9%</span>
                <span>PSA Labor Force Survey, July 2026 — underemployment (psa.gov.ph/statistics/labor-force-survey)</span>
              </li>
              <li>
                <span className="k">38.2%</span>
                <span>PSA LFS data via C. Habito, BusinessMirror, 2025 — college graduates, 38.2% of the unemployed</span>
              </li>
              <li>
                <span className="k">₱69→96</span>
                <span>EDCOM 2 TVET Returns Policy Note, 2026 — hourly wage line by NC level</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="cap foot-main">
          <nav className="foot-links" aria-label="Footer">
            <a className="sublink" href="/signin">
              Sign in
            </a>
            <a className="sublink" href="/signup">
              Start check <span className="arr">→</span>
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}

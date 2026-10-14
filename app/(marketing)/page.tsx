import { CATALOG_TOTAL, getCareer, type Career } from "@/lib/fixtures/catalog";
import { NEIL_SEED } from "@/lib/fixtures/neil";
import { computeScore, WEIGHTS, type Score } from "@/lib/engines/score";
import CountUp from "@/components/CountUp";
import LandingFx from "./LandingFx";
import SampleGauge, { type GaugeRow } from "./SampleGauge";
import ArrowMark, { ReturnArrow } from "./ArrowMark";
import "./landing.css";

export const metadata = {
  title: "Career Readiness — know exactly where you stand",
  description:
    "An evidence-cited readiness score for 32 Philippine careers — computed from what you can actually do, with a ranked path for every gap.",
};

/** Strand label rendered the way the index table says it: STEM/ABM → STEM · ABM. */
function strandLabel(c: Career): string {
  return c.strands.map((s) => s.replace(/\//g, " · ")).join(" · ");
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
  });
}

/** Hero mini-index rows: five strand-spread careers, fit = demonstrated bars in each career's map. */
const GAUGE_IDS = ["da", "swd", "nur", "elec", "cook"] as const;

function gaugeRows(): GaugeRow[] {
  const demonstrated = Object.entries(NEIL_SEED.bars)
    .filter(([, v]) => v.source === "verified" || v.source === "checked")
    .map(([k]) => k);
  return GAUGE_IDS.map((id) => {
    const c = getCareer(id) as Career;
    return {
      name: c.name,
      x: demonstrated.filter((n) => c.skills.some((s) => s.name === n)).length,
      y: c.skills.length,
    };
  });
}

/** The 12-row index preview, in the locked interleaved order (landing-auth.md block 4). */
const PREVIEW_IDS = [
  "da",
  "swd",
  "elec",
  "nur",
  "cook",
  "tea",
  "acc",
  "jou",
  "cvl",
  "etec",
  "fin",
  "gra",
] as const;

const RUBRIC_LABELS = [
  { n: "Skill progress", d: "what you can do, checked" },
  { n: "Employability skills", d: "how you work with people" },
  { n: "Training progress", d: "what you finished and passed" },
  { n: "Career clarity", d: "whether you’ve chosen and set a goal" },
] as const;

const RUBRIC_PCTS = [WEIGHTS.sp, WEIGHTS.es, WEIGHTS.tp, WEIGHTS.cc] as const;

/** M0 Landing — the public measurement. Markup ported from prototype/index.html. */
export default function LandingPage() {
  const score = sampleScore();
  const gauge = gaugeRows();

  return (
    <>
      <LandingFx />

      {/* first viewport */}
      <section className="hero wrap">
        <div className="hero-grid">
          <div>
            <h1>
              <span className="mask">
                <span>Know exactly</span>
              </span>
              <span className="mask" style={{ ["--d" as string]: "100ms" }}>
                <span>where you stand.</span>
              </span>
            </h1>
            <p className="lede rv" style={{ ["--d" as string]: "180ms" }}>
              6.0% of the labor force is out of work, a four-year high, and 38.2% of the unemployed
              finished college. Finishing a strand is not the same as being ready. Five minutes gives
              you one number and the next steps.
            </p>
            <div className="hero-ctas" data-io data-stagger="80" data-cap="260">
              <a className="btn btn-primary btn-hero rv" href="/signup">
                Start check <ReturnArrow />
              </a>
              <a className="link-sub rv" href="#index">
                Browse the career index <ArrowMark />
              </a>
              <a className="link-sub link-signin-m rv" href="/signin">
                Sign in
              </a>
            </div>
            <p className="hero-foot rv" style={{ ["--d" as string]: "380ms" }}>
              One number · four measured parts · every claim cited.
            </p>
          </div>

          {/* sample instrument */}
          <SampleGauge
            rows={gauge}
            total={CATALOG_TOTAL}
            score={score}
            strand={NEIL_SEED.strand}
          />
        </div>
      </section>

      {/* stat band */}
      <section className="stats" aria-label="The labor market, in three cited numbers">
        <div className="stats-grid" data-io data-stagger="140" data-cap="320">
          <div className="stat rv">
            <div className="num-row">
              <span className="n">
                <CountUp to={6.0} dec={1} dur={1050} />
                <sub>%</sub>
              </span>
              <span className="q">
                of the labor force is unemployed: 3.14&nbsp;M jobless, a four-year high, 1.33&nbsp;M
                new youth entrants.
              </span>
            </div>
            <div className="src">
              PSA Labor Force Survey, July 2026 (released Sep 8, 2026) —
              psa.gov.ph/statistics/labor-force-survey
            </div>
          </div>
          <div className="stat rv">
            <div className="num-row">
              <span className="n">
                <CountUp to={12.9} dec={1} dur={1050} />
                <sub>%</sub>
              </span>
              <span className="q">underemployed: working, not enough hours.</span>
            </div>
            <div className="src">
              PSA Labor Force Survey, July 2026 — psa.gov.ph/statistics/labor-force-survey
            </div>
          </div>
          <div className="stat rv">
            <div className="num-row">
              <span className="n">
                <CountUp to={38.2} dec={1} dur={1050} />
                <sub>%</sub>
              </span>
              <span className="q">
                of the unemployed are college graduates, the single largest group.
              </span>
            </div>
            <div className="src">PSA LFS data via C. Habito, BusinessMirror, 2025 (underlying survey cited)</div>
          </div>
        </div>
      </section>

      {/* career index preview */}
      <section className="section wrap" id="index">
        <div className="section-head rv">
          <h2>The career index</h2>
          <p>Twelve of the {CATALOG_TOTAL} careers, each with its skill map and entry path. The rest open after you start.</p>
        </div>

        <div className="index-table panel" style={{ overflow: "hidden" }} data-io data-scan data-stagger="42" data-cap="420">
          <div className="scan" aria-hidden="true"></div>
          <div className="index-colheads label" aria-hidden="true">
            <span>CAREER</span>
            <span>STRAND</span>
            <span>SKILLS</span>
            <span>ENTRY PATH</span>
          </div>
          {PREVIEW_IDS.map((id) => {
            const c = getCareer(id) as Career;
            return (
              <div className="index-row rv" key={id}>
                <span className="career">{c.name}</span>
                <span className="strand">{strandLabel(c)}</span>
                <span className="skills">
                  <span className="num">{c.skills.length}</span>
                </span>
                <span className="entry">{c.entryPath}</span>
              </div>
            );
          })}
        </div>

        <div className="index-foot" data-io data-stagger="90" data-cap="200">
          <p className="rv">
            The full index has <b className="num">{CATALOG_TOTAL}</b> careers across every SHS strand.
          </p>
          <a className="btn btn-ghost rv" href="/signup">
            Start check <ReturnArrow />
          </a>
        </div>
      </section>

      {/* rubric honesty block */}
      <section className="rubric-block">
        <div className="rubric-grid">
          <div className="section-head rv">
            <h2>How the score is built.</h2>
            <p>
              Four measured parts, added to one number out of 100. The widths below are each part’s
              fixed share of the score.
            </p>
          </div>
          <div>
            <div
              className="rubric-bar"
              data-io
              role="img"
              aria-label={`Rubric proportions: ${RUBRIC_LABELS.map(
                (l, i) => `${l.n.toLowerCase()} ${RUBRIC_PCTS[i]} percent`
              ).join(", ")}`}
            >
              {RUBRIC_PCTS.map((pct, i) => (
                <div key={i} className="rubric-seg" style={{ flex: pct }}>
                  <div className="slot" style={{ ["--d" as string]: `${i * 110}ms` }}></div>
                </div>
              ))}
            </div>
            <div className="rubric-labels" data-io data-stagger="90" data-cap="300">
              {RUBRIC_LABELS.map((l, i) => (
                <div key={l.n} className="rubric-label rv" style={{ flex: RUBRIC_PCTS[i] }}>
                  <div className="w num">
                    {RUBRIC_PCTS[i]}
                    <small>%</small>
                  </div>
                  <div className="n">{l.n}</div>
                  <div className="d">{l.d}</div>
                </div>
              ))}
            </div>
            <div className="rubric-scale rv">
              <span>0</span>
              <span>your score, out of 100</span>
              <span>100</span>
            </div>
            <p className="rubric-note-m rv">A bar closes when you pass a short check.</p>
          </div>
        </div>
      </section>

      {/* work loop */}
      <section className="section">
        <div className="wrap loop">
          <div className="section-head">
            <h2>The check, step by step.</h2>
            <p>Four steps, in order.</p>
          </div>
          <div className="loop-grid" data-io data-stagger="95" data-cap="420">
            <div className="loop-step rv">
              <div className="loop-num num">01</div>
              <div>
                <h3>Answer the setup questions</h3>
                <p className="mech">
                  Strand, interests, and the skills you already have. About five minutes total.
                </p>
                <p className="beat">SETUP · 3 STEPS</p>
              </div>
            </div>
            <div className="loop-step rv">
              <div className="loop-num num">02</div>
              <div>
                <h3>Get one number, computed in front of you</h3>
                <p className="mech">It traces to what you passed.</p>
                <p className="beat">
                  FIRST SCORE · <span className="badge">SAMPLE {score.total}</span>
                </p>
              </div>
            </div>
            <div className="loop-step rv">
              <div className="loop-num num">03</div>
              <div>
                <h3>See your gaps in bars</h3>
                <p className="mech">
                  Each skill shows a bar and its check badge: ✓ verified quiz, ✓✓ checked resource.
                </p>
                <p className="beat">GAPS · BAR BY BAR</p>
              </div>
            </div>
            <div className="loop-step rv">
              <div className="loop-num num">04</div>
              <div>
                <h3>Start ranked steps the same day</h3>
                <p className="mech">
                  Courses, certificates, and TESDA NCs with prices shown (<span className="mono">free</span>,{" "}
                  <span className="mono">₱450</span>); your first three steps are named.
                </p>
                <p className="beat">PATHWAY · RANKED</p>
              </div>
            </div>
          </div>
          <div className="loop-wageline rv" data-io data-wageladder>
            <p className="w num">
              Certified skill pays by the hour:{" "}
              <b>
                <span className="wage-step" style={{ ["--d" as string]: "120ms" }}>
                  ₱69
                </span>{" "}
                <span className="wage-step" style={{ ["--d" as string]: "520ms" }}>
                  → ₱74
                </span>{" "}
                <span className="wage-step" style={{ ["--d" as string]: "920ms" }}>
                  → ₱96
                </span>
              </b>{" "}
              <span style={{ color: "var(--ink-3)" }}>(no TVET → NC I/II → NC III/IV)</span>
            </p>
            <p className="src rv" style={{ ["--d" as string]: "1000ms" }}>
              EDCOM 2 TVET Returns Policy Note, 2026
            </p>
          </div>
          <div className="loop-cta" data-io data-stagger="100" data-cap="220">
            <a className="btn btn-primary btn-hero rv" href="/signup">
              Start check <ReturnArrow />
            </a>
            <p className="promise rv" style={{ ["--d" as string]: "120ms" }}>
              The number only grows when you prove a skill.
            </p>
          </div>
        </div>
      </section>

      {/* evidence close + footer */}
      <footer className="evidence">
        <div className="evidence-grid" data-io data-stagger="120" data-cap="280">
          <div>
            <h2
              className="rv"
              style={{ fontSize: "clamp(1.5rem,2.6vw,1.9rem", fontWeight: 640, letterSpacing: "-0.025em", lineHeight: 1.15 }}
            >
              Every number names its source.
            </h2>
          </div>
          <div>
            <ul className="src-list" data-io data-stagger="65" data-cap="360">
              <li className="rv">
                <span className="k">6.0%</span>
                <span>PSA Labor Force Survey, July 2026 — unemployment (psa.gov.ph/statistics/labor-force-survey)</span>
              </li>
              <li className="rv">
                <span className="k">12.9%</span>
                <span>PSA Labor Force Survey, July 2026 — underemployment (psa.gov.ph/statistics/labor-force-survey)</span>
              </li>
              <li className="rv">
                <span className="k">38.2%</span>
                <span>PSA LFS data via C. Habito, BusinessMirror, 2025 — college graduates, 38.2% of the unemployed</span>
              </li>
              <li className="rv">
                <span className="k">₱69→96</span>
                <span>EDCOM 2 TVET Returns Policy Note, 2026 — hourly wage line by NC level</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="foot-main rv">
          <span className="label">
            {CATALOG_TOTAL}-CAREER CATALOG · RUBRIC-WEIGHTED READOUT · EVERY CLAIM CITED
          </span>
          <nav className="foot-links" aria-label="Footer">
            <a className="link-quiet" href="/signin">
              Sign in
            </a>
            <a className="link-quiet" href="/signup" style={{ color: "var(--accent)", fontWeight: 570 }}>
              Start check <ArrowMark variant="g" />
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}

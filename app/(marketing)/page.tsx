import { redirect } from "next/navigation";
import { CATALOG_TOTAL, getCareer, trackLabelOf } from "@/lib/fixtures/catalog";
import type { Career } from "@/lib/types";
import Reveal from "@/components/Reveal";
import { db } from "@/lib/db";
import { getCurrentProfile } from "@/lib/session";
import "./landing.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Baseline — know exactly where you stand",
  description:
    "Know where you stand for your first career — a readiness score for 36 Philippine careers, computed from checks you actually pass, with a ranked path for every gap.",
};

/**
 * Signed-in visitors never see the marketing page (user ruling 2026-11-02):
 * staff go to /admin; students land on /onboarding until a role is picked,
 * /dashboard after — the same rule the sign-in route applies. The check
 * runs inside the landing component (session cookie read = dynamic render).
 */
async function authedRedirect(): Promise<void> {
  const profile = await getCurrentProfile();
  if (profile) {
    if (profile.role === "counselor" || profile.role === "sysadmin") redirect("/admin");
    if (profile.studentId) {
      const state = await db.getStudentState(profile.studentId);
      redirect(state.careerId ? "/dashboard" : "/onboarding");
    }
    redirect("/onboarding");
  }
}

/**
 * M0 Landing — the public measurement. Product-first revamp (2026-11-03,
 * user-ruled): no stats band — the page tells the product and its features,
 * illustrated richly. The four feature blocks carry REAL screenshots of the
 * app (public/shots/*.png, captured from the canon demo seed — honest
 * product truth, self-hosted for the offline demo); the intro strip and
 * blocks use inline SVG line icons; the how-it-works bars fill on reveal
 * (the page's one gif-like motion, disabled under reduced motion).
 * COPY is reported DRAFT for the user's in-browser blessing: plain and
 * concrete, no brochure-speak, channels written out as words, the
 * never-claims-ATS-pass fence kept, RA 10173 in the footer footnote only.
 */

/** Track label rendered the way the index table says it. */
function trackLabel(c: Career): string {
  return trackLabelOf(c.track);
}

/** How-it-works step visuals: real catalog names, no invented careers. */
const STEP_CAREER_IDS = ["swd", "book", "csr"] as const;

/** The five channels in rubric order, with each channel's share as the bar fill. */
const CHANNEL_BARS = [
  { n: "Skill progress", pct: 25 },
  { n: "Employability", pct: 30 },
  { n: "Training", pct: 20 },
  { n: "Application", pct: 15 },
  { n: "Direction", pct: 10 },
] as const;

/** Plain FAQ — every answer traces to the truth inventory; no new claims. */
const FAQS = [
  {
    q: "Does the score predict whether I’ll get hired?",
    a: "No. It is a readiness read, not a hiring promise — it tells you where you stand and what to close next. The hiring decision always belongs to the employer.",
  },
  {
    q: "What counts toward the score?",
    a: "Only checks you actually pass: the competency assessment, verified skills, checked resources, and credentials verified against your record. What you claim alone stays visible but never closes a gap.",
  },
  {
    q: "Who can see my record?",
    a: "You, and the counselor assigned to your cohort — the same record, on both sides of the desk. There is no separate report to keep in sync.",
  },
  {
    q: "How long does the first check take?",
    a: "About 15 minutes for the first read. You can stop and come back — your plan keeps everything ranked where you left it.",
  },
  {
    q: "What happens to my data?",
    a: "You can export or erase your own record anytime, from your profile, without asking anyone.",
  },
] as const;

/** Inline SVG line icons (24px, stroke = currentColor) — the landing's clipart register. */
function Icon({ d, extra }: { d: string; extra?: string }) {
  return (
    <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
      <path d={d} />
      {extra ? <path d={extra} /> : null}
    </svg>
  );
}

const ICON_GAUGE = { d: "M4 15a8 8 0 1 1 16 0", extra: "M12 15l4.2-4.2" };
const ICON_COMPASS = {
  d: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z",
  extra: "M14.8 9.2l-1.9 4.7-3.7 1 1.9-4.7z",
};
const ICON_STEPS = {
  d: "M8 6h12M8 12h12M8 18h12",
  extra: "M4 6h.01M4 12h.01M4 18h.01",
};

export default async function LandingPage() {
  await authedRedirect();

  return (
    <>
      {/* ── first viewport: the honest-process promise + the graduates photo ── */}
      <section className="hero">
        <div className="cap hero-grid">
          <div>
            <h1>Walk into your first career ready — not just qualified.</h1>
            <p className="lede">
              One 15-minute check turns what you can actually do into an honest
              score out of 100 — and hands you the ranked plan that closes the
              gap.
            </p>
            <div className="hero-ctas">
              <a className="cta" href="/signup">
                Start the check <span className="arr">→</span>
              </a>
              <a className="sublink" href="/signin">
                Already have an account? Sign in
              </a>
            </div>
          </div>
          {/* self-hosted (offline demo); free license (Pexels, graduates throwing caps) */}
          {/* eslint-disable-next-line @next/next/no-img-element -- static local asset */}
          <img
            className="hero-photo"
            src="/landing-graduates.jpg"
            alt="Graduates in gowns throwing their caps into a clear blue sky"
            width={1600}
            height={1067}
          />
        </div>
      </section>

      {/* ── what Baseline is — the platform statement + three icon facts ── */}
      <section className="section band" aria-label="What Baseline is">
        <div className="cap">
          <div className="section-head">
            <h2>What Baseline does.</h2>
            <p>
              Pick the career you’re aiming at. Take the check. Get your score,
              your gaps, and a ranked plan to close them — with your counselor
              reading the same record.
            </p>
          </div>
          <div className="facts">
            <div className="fact">
              <Icon {...ICON_GAUGE} />
              <div>
                <b>One score out of 100</b>
                <p>computed from your own records — never self-report alone.</p>
              </div>
            </div>
            <div className="fact">
              <Icon {...ICON_COMPASS} />
              <div>
                <b>{CATALOG_TOTAL} careers, four tracks</b>
                <p>IT, business, accounting, and office — mapped from Philippine labor-demand reports.</p>
              </div>
            </div>
            <div className="fact">
              <Icon {...ICON_STEPS} />
              <div>
                <b>A plan that ranks itself</b>
                <p>every gap becomes a next step, prices and hours shown up front.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── the features — real screenshots of the actual product ── */}
      <section className="section feat-section" aria-label="What the platform does">
        <div className="cap">
          <div className="section-head">
            <h2>What you get, screen by screen.</h2>
            <p>Every image below is the product itself — no mockups, no promises.</p>
          </div>

          <div className="feat">
            <div className="feat-copy">
              <h3>See your readiness as one number.</h3>
              <p>
                The Career Readiness Index covers five channels, written out in
                plain words: skill progress, employability skills, training
                progress, application readiness, and career clarity. Every
                point traces to a check you passed — and what isn’t measured
                yet says so, honestly.
              </p>
            </div>
            <figure className="shot-frame">
              {/* eslint-disable-next-line @next/next/no-img-element -- static local asset */}
              <img
                src="/shots/dashboard.png"
                alt="The Baseline dashboard: a 64 out of 100 Career Readiness Index with five channel scores and the next plan items"
                width={1440}
                height={900}
                loading="lazy"
              />
            </figure>
          </div>

          <div className="feat flip">
            <div className="feat-copy">
              <h3>Find the career that fits what you can already do.</h3>
              <p>
                Careers are ranked by the skills you share with each role, with
                the full skill map and entry path on the same page. Switching
                direction later? Verified skills travel with you.
              </p>
            </div>
            <figure className="shot-frame">
              {/* eslint-disable-next-line @next/next/no-img-element -- static local asset */}
              <img
                src="/shots/career.png"
                alt="The Baseline careers list: roles ranked by skills in common, with entry paths"
                width={1440}
                height={900}
                loading="lazy"
              />
            </figure>
          </div>

          <div className="feat">
            <div className="feat-copy">
              <h3>A plan that ranks itself.</h3>
              <p>
                Your gaps become ranked steps — courses, certificates, and
                assessments with prices and hours shown up front. Passing the
                check closes the bar; a claim stays hatched until it’s checked.
              </p>
            </div>
            <figure className="shot-frame">
              {/* eslint-disable-next-line @next/next/no-img-element -- static local asset */}
              <img
                src="/shots/plan.png"
                alt="My Plan in Baseline: ranked next steps with resources, prices, and verified or self-reported states"
                width={1440}
                height={900}
                loading="lazy"
              />
            </figure>
          </div>

          <div className="feat flip">
            <div className="feat-copy">
              <h3>Application materials, checked against the role.</h3>
              <p>
                Upload your resume and cover letter — the checkers read the
                actual file: parse, format, evidence — and show what’s there,
                line by line. Your materials stay yours: nothing is
                auto-written, and nothing promises an ATS pass.
              </p>
            </div>
            <figure className="shot-frame">
              {/* eslint-disable-next-line @next/next/no-img-element -- static local asset */}
              <img
                src="/shots/prep.png"
                alt="The Prep surface: resume and cover-letter check results with per-check pass marks"
                width={1440}
                height={900}
                loading="lazy"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* ── numbered how-it-works: 1-2-3, each with its mini instrument ── */}
      <section className="section band" id="how-it-works">
        <div className="cap">
          <div className="section-head">
            <h2>How it works.</h2>
            <p>Three steps, in this order.</p>
          </div>

          <Reveal className="card loop-grid">
            <div className="loop-step">
              <div className="loop-num num">01</div>
              <div>
                <h3>Pick your career</h3>
                <p className="mech">
                  Choose from {CATALOG_TOTAL} careers mapped from Philippine
                  labor-demand reports. Each one lists its skills and entry
                  paths.
                </p>
                <p className="loop-viz" aria-hidden="true">
                  {STEP_CAREER_IDS.map((id) => {
                    const c = getCareer(id) as Career;
                    return (
                      <span className="chip c-grey" key={id}>
                        {c.name}
                      </span>
                    );
                  })}
                </p>
              </div>
            </div>
            <div className="loop-step">
              <div className="loop-num num">02</div>
              <div>
                <h3>Close your gaps</h3>
                <p className="mech">
                  Your score covers five things, written out in plain words:
                  skill progress, employability, training, application
                  readiness, and career direction. The Plan ranks what to
                  close next — free and paid courses, with prices shown.
                </p>
                <div className="loop-viz bars" aria-hidden="true">
                  {CHANNEL_BARS.map((b) => (
                    <span className="vbar" key={b.n}>
                      <span className="vlab">{b.n}</span>
                      <span className="vtrack">
                        <em style={{ width: `${b.pct}%` }} />
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="loop-step">
              <div className="loop-num num">03</div>
              <div>
                <h3>Walk in ready</h3>
                <p className="mech">
                  The resume and cover-letter checkers read your actual files,
                  and declared credentials get verified against your record.
                  Checks you actually pass count; what you claim alone never
                  does.
                </p>
                <p className="loop-viz" aria-hidden="true">
                  <span className="chip v-ok">✓ verified — closes the gap</span>
                  <span className="chip v-check">✓✓ checked resource</span>
                  <span className="chip v-claim">claimed — never closes alone</span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── for counselors: the shared-record band ── */}
      <section className="rub-section" aria-label="For counselors">
        <div className="cap rub-grid">
          <div className="section-head">
            <h2>For counselors.</h2>
            <p>The same record your students see, on your side of the desk.</p>
          </div>
          <div>
            <ul className="counsel-list">
              <li>
                <b>Your roster reads the same record.</b> No separate report to
                keep — what the student does is what you see.
              </li>
              <li>
                <b>Only checks close a gap.</b> A claim stays visible but
                hatched until the student passes the check against it.
              </li>
              <li>
                <b>Data handled cleanly.</b> Students can export or erase their
                own records anytime.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── FAQ — the objections, answered plainly ── */}
      <section className="section band" id="faq">
        <div className="cap">
          <div className="section-head">
            <h2>Questions, answered plainly.</h2>
            <p>No fine print — the same rules the product runs by.</p>
          </div>
          <div className="faq-list">
            {FAQS.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── trust ribbon ── */}
      <section className="trust" aria-label="Where the facts come from">
        <div className="cap trust-row">
          <span className="trust-item">Careers mapped from Philippine labor-demand reports</span>
          <span className="trust-item">Skills anchored to national career-framework standards</span>
          <span className="trust-item">Checks verify — claims never count alone</span>
          <span className="trust-item">Your data stays yours — export or erase anytime</span>
        </div>
      </section>

      {/* ── slim footer (+ the one legal footnote the brief allows) ── */}
      <footer className="evidence band">
        <div className="cap foot-main">
          <p className="foot-legal">
            Records are handled under the Philippine Data Privacy Act
            (RA&nbsp;10173).
          </p>
          <nav className="foot-links" aria-label="Footer">
            <a className="sublink" href="/signin">
              Sign in
            </a>
            <a className="sublink" href="/signup">
              Sign up
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}

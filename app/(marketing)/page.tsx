import { redirect } from "next/navigation";
import { ArrowRight, Check, CheckCheck } from "lucide-react";
import { CATALOG_TOTAL, getCareer } from "@/lib/fixtures/catalog";
import type { Career } from "@/lib/types";
import { destFor, getCurrentProfile, getSignedInUser } from "@/lib/session";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Baseline — know exactly where you stand",
  description:
    "Know where you stand for your first career — a readiness score for 36 Philippine careers, computed from checks you actually pass, with a ranked path for every gap.",
};

/**
 * Signed-in visitors never see the marketing page (user ruling 2026-11-02):
 * destination rides lib/session destFor (swept there in Task 8) — staff to
 * /admin; students land on /onboarding until a role is picked, /dashboard
 * after — the same rule the sign-in route applies. A signed-in identity
 * with NO profile row is a first-time Google applicant → /welcome. The
 * check runs inside the landing component (session cookie read = dynamic).
 */
async function authedRedirect(): Promise<void> {
  const profile = await getCurrentProfile();
  if (profile) {
    // the one destination rule, swept onto destFor (Task 8)
    redirect(await destFor({ role: profile.role, studentId: profile.studentId }));
  }
  // signed-in but never provisioned (first Google identity) → the picker,
  // NOT the marketing page (signed-in visitors never see it — user ruling)
  if (await getSignedInUser()) redirect("/welcome");
}

/**
 * M0 Landing — DNA v9 (the M3 fidelity upgrade): the round-0 approved
 * comp (user-approved 2026-11-04, "this is the way") cut over onto the
 * live page by the landing cutover (round 1). The approved register:
 * Google Sans/Text hierarchy, tonal surfaces with M3 level-1 shadows
 * (no hairline card borders), pill controls, 16/24px radius ladder,
 * #0B57D0 command blue, and the marketing four-color moments
 * (decorative only — DESIGN.md v9 §4). COPY unchanged from the
 * product-first revamp: plain and concrete, no brochure-speak,
 * channels written out as words, the never-claims-ATS-pass fence kept,
 * RA 10173 in the footer footnote only. No entrance machinery.
 */

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

/** Inline SVG line icons (24px, stroke = currentColor). */
function Icon({ d, extra }: { d: string; extra?: string }) {
  return (
    <svg className="m-mic" viewBox="0 0 24 24" aria-hidden="true">
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
      {/* ── hero: the Google-marketing voice (staggered entrance) ── */}
      <section className="m-hero">
        <div className="m-cap m-hero-grid">
          <Reveal>
            <h1>
              Walk into your first career <em>ready</em> — not just qualified.
            </h1>
            <p className="m-lede">
              One 15-minute check turns what you can actually do into an
              honest score out of 100 — and hands you the ranked plan that
              closes the gap.
            </p>
            <div className="m-ctas">
              <a className="m-pill m-fill m-lg" href="/signup">
                Start the check{" "}
                <span className="m-arr">
                  <ArrowRight size={14} aria-hidden="true" />
                </span>
              </a>
              <a className="m-textbtn m-textbtn-lg" href="/signin">
                Already have an account? Sign in
              </a>
            </div>
            <p className="m-note">
              {CATALOG_TOTAL} careers, four tracks, five channels, scored
              honestly
            </p>
          </Reveal>
          <Reveal as="figure" className="m-photo" delay={140}>
            {/* self-hosted (offline demo); free license (Pexels, graduates throwing caps) */}
            {/* eslint-disable-next-line @next/next/no-img-element -- static local asset */}
            <img
              src="/landing-graduates.jpg"
              alt="Graduates in gowns throwing their caps into a clear blue sky"
              width={1600}
              height={1067}
            />
          </Reveal>
        </div>
      </section>

      {/* ── what Baseline is — the platform statement + three cards ── */}
      <section className="m-sec" aria-label="What Baseline is">
        <div className="m-cap">
          <div className="m-head">
            <h2>What Baseline does.</h2>
            <p>
              Pick the career you’re aiming at. Take the check. Get your
              score, your gaps, and a ranked plan to close them — with your
              counselor reading the same record.
            </p>
          </div>
          <div className="m-facts">
            <Reveal as="div" className="m-fact" delay={0}>
              <span className="m-tile m-tb" aria-hidden="true">
                <Icon {...ICON_GAUGE} />
              </span>
              <div>
                <b>One score out of 100</b>
                <p>computed from your own records — never self-report alone.</p>
              </div>
            </Reveal>
            <Reveal as="div" className="m-fact" delay={90}>
              <span className="m-tile m-tg" aria-hidden="true">
                <Icon {...ICON_COMPASS} />
              </span>
              <div>
                <b>{CATALOG_TOTAL} careers, four tracks</b>
                <p>
                  IT, business, accounting, and office — mapped from
                  Philippine labor-demand reports.
                </p>
              </div>
            </Reveal>
            <Reveal as="div" className="m-fact" delay={180}>
              <span className="m-tile m-ty" aria-hidden="true">
                <Icon {...ICON_STEPS} />
              </span>
              <div>
                <b>A plan that ranks itself</b>
                <p>
                  every gap becomes a next step, prices and hours shown up
                  front.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── the features — real screenshots of the actual product ── */}
      <section className="m-sec" aria-label="What the platform does">
        <div className="m-cap">
          <Reveal>
          <div className="m-head">
            <h2>What you get, screen by screen.</h2>
          </div>

          <div className="m-feat">
            <div className="m-feat-copy">
              <h3>See your readiness as one number.</h3>
              <p>
                The Career Readiness Index covers five channels, written out
                in plain words: skill progress, employability skills,
                training progress, application readiness, and career
                clarity.
              </p>
            </div>
            <figure className="m-shot">
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

          <div className="m-feat m-flip">
            <div className="m-feat-copy">
              <h3>Find the career that fits what you can already do.</h3>
              <p>
                Careers are ranked by the skills you share with each role,
                with the full skill map and entry path on the same page.
                Switching direction later? Verified skills travel with you.
              </p>
            </div>
            <figure className="m-shot">
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

          <div className="m-feat">
            <div className="m-feat-copy">
              <h3>A plan that ranks itself.</h3>
              <p>
                Your gaps become ranked steps — courses, certificates, and
                assessments with prices and hours shown up front.
              </p>
            </div>
            <figure className="m-shot">
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

          <div className="m-feat m-flip">
            <div className="m-feat-copy">
              <h3>Application materials, checked against the role.</h3>
              <p>
                Upload your resume and cover letter — the checkers read the
                actual file: parse, format, evidence — and show what’s
                there, line by line. Your materials stay yours: nothing is
                auto-written, and nothing promises an ATS pass.
              </p>
            </div>
            <figure className="m-shot">
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
          </Reveal>
        </div>
      </section>

      {/* ── how-it-works: the tonal band ── */}
      <section className="m-band" id="how-it-works">
        <div className="m-cap">
          <Reveal>
          <div className="m-head">
            <h2>How it works.</h2>
          </div>
          <div className="m-loop">
            <div className="m-step">
              <div className="m-num m-n1">01</div>
              <div>
                <h3>Pick your career</h3>
                <p className="m-mech">
                  Choose from {CATALOG_TOTAL} careers mapped from Philippine
                  labor-demand reports. Each one lists its skills and entry
                  paths.
                </p>
                <p className="m-viz" aria-hidden="true">
                  {STEP_CAREER_IDS.map((id) => {
                    const c = getCareer(id) as Career;
                    return (
                      <span className="m-chip" key={id}>
                        {c.name}
                      </span>
                    );
                  })}
                </p>
              </div>
            </div>
            <div className="m-step">
              <div className="m-num m-n2">02</div>
              <div>
                <h3>Close your gaps</h3>
                <p className="m-mech">
                  readiness, and career direction. The Plan ranks what to
                  close next — free and paid courses, with prices shown.
                </p>
                <div className="m-viz m-bars" aria-hidden="true">
                  {CHANNEL_BARS.map((b) => (
                    <span className="m-vbar" key={b.n}>
                      <span className="m-vlab">{b.n}</span>
                      <span className="m-vtrack">
                        <em style={{ width: `${b.pct}%` }} />
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="m-step">
              <div className="m-num m-n3">03</div>
              <div>
                <h3>Walk in ready</h3>
                <p className="m-mech">
                  The resume and cover-letter checkers read your actual
                  files, and declared credentials get verified against your
                  record.
                </p>
                <p className="m-viz" aria-hidden="true">
                  <span className="m-chip m-cg">
                    <Check size={11} aria-hidden="true" /> verified — closes the
                    gap
                  </span>
                  <span className="m-chip m-cb">
                    <CheckCheck size={11} aria-hidden="true" /> checked resource
                  </span>
                  <span className="m-chip">claimed — never closes alone</span>
                </p>
              </div>
            </div>
          </div>
          </Reveal>
        </div>
      </section>

      {/* ── for counselors: the shared-record card ── */}
      <section className="m-sec" aria-label="For counselors">
        <div className="m-cap m-rub">
          <Reveal>
          <div className="m-head">
            <h2>For counselors.</h2>
            <p>The same record your students see, on your side of the desk.</p>
          </div>
          <div className="m-rubcard">
            <ul className="m-counsel">
              <li>
                <b>Your roster reads the same record.</b> No separate report
                to keep — what the student does is what you see.
              </li>
              <li>
                <b>Only checks close a gap.</b>
              </li>
              <li>
                <b>Data handled cleanly.</b> Students can export or erase
                their own records anytime.
              </li>
            </ul>
          </div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ — the objections, answered plainly ── */}
      <section className="m-sec" id="faq">
        <div className="m-cap">
          <Reveal>
          <div className="m-head">
            <h2>Questions, answered plainly.</h2>
          </div>
          <div className="m-faq">
            {FAQS.map((f) => (
              <details className="m-faqi" key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          </Reveal>
        </div>
      </section>

      {/* ── trust ribbon ── */}
      <section className="m-trust" aria-label="Where the facts come from">
        <div className="m-cap m-trustrow">
          <span>Careers mapped from Philippine labor-demand reports</span>
          <span>Skills anchored to national career-framework standards</span>
          <span>Checks verify — claims never count alone</span>
          <span>Your data stays yours — export or erase anytime</span>
        </div>
      </section>

      {/* ── slim footer (+ the one legal footnote the brief allows) ── */}
      <footer className="m-evidence">
        <div className="m-cap m-foot">
          <p className="m-legal">
            Records are handled under the Philippine Data Privacy Act
            (RA&nbsp;10173).
          </p>
          <nav className="m-flinks" aria-label="Footer">
            <a className="m-textbtn" href="/signin">
              Sign in
            </a>
            <a className="m-textbtn" href="/signup">
              Sign up
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}

import { redirect } from "next/navigation";
import { CATALOG_TOTAL } from "@/lib/fixtures/catalog";
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
 * M0 Landing — the public measurement.
 *
 * Convention frame (2026-11-03 P2 amendment): hero (one promise + ONE verb
 * "Start the check" + quiet Sign in) → numbered HOW IT WORKS 1-2-3 →
 * FOR COUNSELORS band → TRUST RIBBON → slim footer.
 *
 * COPY — written against the user's LOCKED content brief (2026-11-03):
 * plain and concrete, no brochure-speak, no framework jargon, no acronyms
 * (channels written out as words), the never-claims-ATS-pass fence kept,
 * RA 10173 in a small legal footnote only. Still reported as DRAFT for
 * the user's in-browser blessing. No new product claims — every line maps
 * to the checked truth inventory: the 36-entry index (IT + business +
 * accounting + office tracks), the score's five channels, My Plan, the
 * resume/cover-letter checkers, credential audits, export/erase.
 */
export default async function LandingPage() {
  await authedRedirect();

  return (
    <>
      {/* ── first viewport: the honest-process promise + ONE verb ── */}
      <section className="hero">
        <div className="cap hero-grid">
          <div>
            <h1>
              Know exactly where you stand for your first career — and what
              closes the gap next — verified, not self-reported.
            </h1>
            <p className="lede">
              A short check builds one score out of 100 from what you can
              already do — {CATALOG_TOTAL} careers indexed across IT, business,
              accounting, and office tracks. Around 15 minutes for the first
              read.
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
        </div>
      </section>

      {/* ── numbered how-it-works: 1-2-3 ── */}
      <section className="section" id="how-it-works">
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
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── for counselors: the shared-record band ── */}
      <section className="rub-section band" aria-label="For counselors">
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

      {/* ── trust ribbon ── */}
      <section className="trust band" aria-label="Where the facts come from">
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

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resume format guide — Career Readiness",
  description: "The curated entry-level corporate resume format: sections, order, length, and Philippine entry-level conventions.",
};

/**
 * The format guide (locked decision Q1b) — curated reference content, static.
 * Every "why" line carries its source (see
 * .scratch/career-path-readiness-research/resume-diagnostic-criteria-sources.md):
 *  - NACE Job Outlook 2025 employers-review-survey (naceweb.org, public);
 *  - WVU Eberly College "NACE Resume Guidelines" (NACE-based university guide);
 *  - HBS/Accenture Hidden Workers 2021 (parse failures; >90% filter via RMS);
 *  - SHRM (plain fonts, simple formatting; keyword filtering);
 *  - JobStreet Philippines (PH specifics — labeled vendor);
 *  - RecSys in HR '23 / Yu et al. 2005 (parsing as a hard extraction problem).
 * NO CHED/DOLE citation for resume format (verified: no such publication —
 * it's quarantined in the sources doc). NO outcome claims: `ATS-friendly` is
 * a formatting property; this page never promises what an employer's system
 * will accept.
 */

const SECTIONS: { name: string; order: string; why: string }[] = [
  {
    name: "Header",
    order: "Your name, then email and phone — the whole first line.",
    why: "Screening reads the contact line first; HBS research places most filtering upstream of any human read (Fuller et al. 2021, §filtering).",
  },
  {
    name: "Education (near the top)",
    order: "Program, school, expected graduation, relevant coursework — each on its own line.",
    why: "For students and fresh graduates, university guides following NACE put education first — it dates the candidate (WVU Eberly, NACE-based guide).",
  },
  {
    name: "Experience",
    order: "Newest activity first (reverse-chronological): org, your role, dates, 1–3 bullets per entry.",
    why: "Reverse-chronological order and accomplishment bullets are the NACE-aligned convention (WVU Eberly; JobStreet PH — vendor — recommends the same for fresh graduates).",
  },
  {
    name: "Skills",
    order: "Tools and competencies by name, one per line or comma-separated.",
    why: "Skills sections are readable directly by parsing software and recruiters alike; buried skills get missed (SHRM).",
  },
];

const BULLETS = [
  "Contact detail in the header (email or phone) — findable in the top of the document.",
  "An Education section — near the top, dated.",
  "An Experience section — reverse-chronological, even when the entries are campus, org, or OJT work.",
  "A Skills section — skills spelled out, including the synonyms you actually said in postings.",
  "One page — a second page is for the experience you'll earn after graduation.",
];

/**
 * Prep → Resume → Guide. The diagnostic's on-ramp door (empty state routes
 * here) plus the downloadable reference template.
 */
export default function GuidePage() {
  return (
    <div className="shell prep-shell">
      <div className="screen-head">
        <h1>Resume format guide</h1>
        <p className="page-id num">reference · curated, sourced · not a builder</p>
      </div>
      <p className="prep-sublabel num">
        Start here → write your resume yourself (Docs/Word, outside this system) → run the diagnostic
      </p>

      <div className="stack" style={{ marginTop: 14 }}>
        <section className="panel block">
          <div className="b-head">
            <h2>The standard sections, in order</h2>
            <p className="helper">
              Candidate-facing guidance following NACE best-practice and Philippine entry-level
              conventions converges on this structure.
            </p>
          </div>
          <div className="rs-guide-sec">
            {SECTIONS.map((s, i) => (
              <div className="rs-guide-row" key={i}>
                <span className="rs-guide-n num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <b>{s.name}</b>
                  <p className="rs-guide-order">{s.order}</p>
                  <p className="rs-guide-why num">{s.why}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel block">
          <div className="b-head">
            <h2>The five checks, so you can self-mark before the run</h2>
          </div>
          <div className="rs-checks">
            {BULLETS.map((t, i) => (
              <p className="rs-check num" key={i}>
                <span className="mark ok">{i + 1}</span> {t}
              </p>
            ))}
          </div>
          <p className="src-line num">
            Sourced · NACE Job Outlook 2025 (survey) · WVU Eberly “NACE Resume Guidelines” · HBS/Accenture
            Hidden Workers 2021 · SHRM 2024 · JobStreet Philippines (vendor) · parsing literature (Yu et al.
            2005; RecSys in HR&apos;23). No CHED/DOLE format standard exists — deliberately not cited.
          </p>
        </section>

        <section className="panel block">
          <div className="b-head">
            <h2>Plain layout, by design</h2>
            <p className="helper">
              ATS-friendly is a formatting property: real text, standard titles, no content inside
              text boxes, tables set briefly, and graphics kept decorative.
            </p>
          </div>
          <ul className="rs-plain num">
            <li>Single column, standard fonts, no photos (PH job boards agree — JobStreet, vendor).</li>
            <li>Content in images or text boxes reads as blank to parsers — that&apos;s the scan/no-OCR reject.</li>
            <li>Bullets open with action verbs, one accomplishment each; numbers are strictly optional.</li>
          </ul>
        </section>

        <section className="panel block">
          <div className="b-head">
            <h2>Download the reference template</h2>
            <p className="helper">
              A skeleton with placeholders for each section — a reference for your own typing, not a
              document the system generates for you.
            </p>
          </div>
          <div className="rs-ctas">
            <a className="btn btn-primary" href="/resume-reference.docx" download>
              Reference template (.docx)
            </a>
            <a className="btn btn-ghost" href="/resume-reference.pdf" download>
              Reference template (.pdf)
            </a>
          </div>
          <p style={{ marginTop: 12 }}>
            <Link className="link-sub" href="/prep">
              Back to the Resume Diagnostic →
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

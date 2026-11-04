import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import "../prep.css";
import GuideBandArt from "./BandArt";

export const metadata: Metadata = {
  title: "Resume format guide — Baseline",
  description:
    "The curated entry-level corporate resume format: sections, order, length, and Philippine entry-level conventions — with the Harvard bullet-point template.",
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

/** The three plain-layout rules — the parser-blank rule carries the ONE
 *  watch-class tone (`watch: true`), the source-line stays the page's one
 *  provenance caption. */
const PLAIN_RULES: { text: string; watch?: true }[] = [
  { text: "Single column, standard fonts, no photos (PH job boards agree — JobStreet, vendor)." },
  { text: "Content in images or text boxes reads as blank to parsers — that's the scan/no-OCR reject.", watch: true },
  { text: "Bullets open with action verbs, one accomplishment each; numbers are strictly optional." },
];

const SRC_LINE =
  "Sourced: NACE Job Outlook 2025 (survey); WVU Eberly “NACE Resume Guidelines”; HBS/Accenture" +
  " Hidden Workers 2021; SHRM 2024; JobStreet Philippines (vendor); parsing literature (Yu et al." +
  " 2005; RecSys in HR'23); Harvard MCS bullet-point resume template.";

/**
 * Prep → Resume checker → Guide — the dropzone's quiet-format-guide door
 * plus the Harvard bullet-point template link. Rides the .v7prep world
 * (prep.css). v9.1 STRUCTURE round (2026-11-04 cutover — the #mockups
 * realm proposal user-approved "looks good" the same day; realm retired
 * with the cutover):
 *   · band: the top back chip (ArrowLeft · "Back to Prep", the M3 tonal
 *     pill) + the drawn ONE-PAGE RESUME SHEET leading the title cluster
 *     (GuideBandArt — hero-law: this figure is the guide's alone);
 *   · body: four own-cards (the 2026-11-03 "every section its OWN card"
 *     ruling applied here) at the 860px reading column;
 *   · state-language color only: step numerals to blue-wash discs, ONE
 *     amber watch line (the parser-blank caution, never red), the
 *     single blue primary stays on the Harvard link (locked);
 *   · the buried foot back pointer is GONE — the band chip replaces it.
 * Content byte-kept: same tables, checks, sources caption, links. The
 * old v7.4 "one card of flush sections" anatomy and its .guide-card CSS
 * retired with the round.
 */
export default function GuidePage() {
  return (
    <div className="v7prep g-surface">
      <header className="band">
        <p className="g-backrow">
          <Link className="g-back" href="/prep">
            <ArrowLeft size={14} aria-hidden="true" /> Back to Prep
          </Link>
        </p>
        <div className="bandrow">
          <div className="who g-who">
            <GuideBandArt />
            <div>
              <h1 className="t">Resume format guide</h1>
              <p className="m">reference — curated and sourced, not a builder</p>
            </div>
          </div>
        </div>
      </header>

      <div className="g-cards">
        {/* CARD 1 — the standard sections, in order */}
        <section className="card">
          <div className="b-head">
            <h2>The standard sections, in order</h2>
            <p className="helper">
              Write your resume yourself (Docs/Word, outside this system), and the format
              &amp; evidence check reads it back
            </p>
          </div>
          <table className="guide-table num">
            <thead>
              <tr>
                <th className="ct-step">Step</th>
                <th>Rule</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              {SECTIONS.map((s, i) => (
                <tr key={s.name}>
                  <td className="ct-step">
                    <span className="g-num num">{i + 1}</span>
                  </td>
                  <td className="ct-rule">
                    <b>{s.name}</b>
                    <p className="rs-guide-order">{s.order}</p>
                  </td>
                  <td>
                    <p className="rs-guide-why num">{s.why}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* CARD 2 — the five checks + the one provenance caption */}
        <section className="card">
          <div className="b-head">
            <h2>The five checks — self-mark before the run</h2>
          </div>
          <div className="rs-checks">
            {BULLETS.map((t, i) => (
              <p className="rs-check num" key={i}>
                <span className="mark ok">{i + 1}</span> {t}
              </p>
            ))}
          </div>
          <p className="src-line num">{SRC_LINE}</p>
        </section>

        {/* CARD 3 — plain layout; the parser-blank rule is the ONE amber line */}
        <section className="card">
          <div className="b-head">
            <h2>Plain layout, by design</h2>
            <p className="helper">
              ATS-friendly is a formatting property: real text, standard titles, no content
              inside text boxes. Keep graphics decorative.
            </p>
          </div>
          <ul className="rs-plain num">
            {PLAIN_RULES.map((r, i) => (
              <li key={i} className={r.watch ? "rs-warn" : undefined}>
                {r.watch ? <span className="chip c-amber">Watch</span> : null} {r.text}
              </li>
            ))}
          </ul>
        </section>

        {/* CARD 4 — the Harvard reference; the single blue primary (locked) */}
        <section className="card">
          <div className="b-head">
            <h2>Reference template — Harvard</h2>
            <p className="helper">
              The one-page bullet-point resume template from Harvard&apos;s Mignone Center
              for Career Success — the reference frame for the format rules above. Links
              open Harvard&apos;s career-services site (external).
            </p>
          </div>
          <div className="rs-ctas">
            <a
              className="btn btn-primary"
              href="https://careerservices.fas.harvard.edu/resources/bullet-point-resume-template/"
              target="_blank"
              rel="noreferrer"
            >
              Harvard bullet-point resume template{" "}
              <span className="arrow num">
                <ArrowUpRight size={12} aria-hidden="true" />
              </span>
            </a>
            <a
              className="link-quiet"
              href="https://docs.google.com/document/d/1nlD4BGOyKF2vnC1Zhcbd8_jvkRRmIw-OAa-tT0MSCj0/copy"
              target="_blank"
              rel="noreferrer"
            >
              Google Docs copy <ArrowUpRight size={12} aria-hidden="true" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

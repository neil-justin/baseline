import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import "../prep.css";
import LetterGuideBandArt from "./BandArt";

export const metadata: Metadata = {
  title: "Cover letter format guide — Baseline",
  description:
    "The curated entry-level corporate cover letter: the letter's shape in order, the five self-mark checks, the plain layout, and how the check reads it — engine-true and sourced.",
};

/**
 * The cover-letter format guide — the resume guide's slim counterpart
 * (Q1b register: curated reference content, static, sourced). Sources
 * (verified 2026-11-04, see
 * .scratch/career-path-readiness-research/resume-diagnostic-criteria-sources.md):
 *  - SHRM 2024 — "Resume parsers scan resumes and cover letters for words
 *    or phrases that match job descriptions" (verbatim; Criterion 3a
 *    Source 2) — the ONLY external claim on this page that is not
 *    vendor-labeled or engine-truth;
 *  - HBS/Accenture Hidden Workers 2021 — filtering on keywords in the
 *    application (Criterion 1b/3b);
 *  - JobStreet Philippines (vendor, labeled): "Cover letter sample: Master
 *    template & examples for the Philippines" (ph.jobstreet.com,
 *    2025-05-20 — structure, PH conventions, 250–400 words; keywords from
 *    the listing) + "Mga Karaniwang Pagkakamali ng Isang First Time Job
 *    Seeker" (personalize, don't go generic);
 *  - letter-structure signals (salutation · applying mention · closing
 *    ask/sign-off; the optional employer anchor) are the checker's OWN
 *    deterministic set (lib/engines/letter.ts, LETER_AIR_WEIGHTS) — the
 *    page cites NO external letter standard for them and says so.
 * NO new outcome claims: `ATS-friendly` stays a formatting property; the
 * check never promises what an employer's system will accept.
 *
 * Rides the resume guide's v9.1 register (g-surface · back chip · four
 * own-cards · state-language washes; the guide round's record sits in
 * prep.css and DESIGN.md #16). The Letter channel card's door on /prep
 * lights up with this page (same-day cutover, no mockup — user ruling
 * 2026-11-04: "build it directly on site").
 */

const SECTIONS: { name: string; order: string; why: string }[] = [
  {
    name: "Greeting",
    order: "One line that addresses a reader — by name when known, “Dear hiring manager,” otherwise.",
    why: "A letter opens by facing its reader — the check's first structural signal reads the opening as a letter-style address. JobStreet PH steers away from generic, un-personalized greetings (vendor).",
  },
  {
    name: "Position, named early",
    order: "The first paragraph says who you are and which role you're applying for.",
    why: "An applying-for/position mention is the check's second signal — a letter that never names an application doesn't read as one. JobStreet PH's structure places the specific position in the opening (vendor).",
  },
  {
    name: "Evidence — the role's skills",
    order: "One or two short paragraphs tying the target role's core skills to what you actually did: coursework, OJT, orgs, part-time work.",
    why: "SHRM 2024: “Resume parsers scan resumes and cover letters for words or phrases that match job descriptions.” JobStreet PH recommends the listing's keywords, and for fresh graduates the education/OJT paragraph is the lead (vendor).",
  },
  {
    name: "Close — ask, then sign off",
    order: "Ask for the next step, thank the reader, then a professional close and your name.",
    why: "A closing ask or sign-off line is the check's third signal — the letter must finish as a letter. JobStreet PH's closing paragraph asks for the interview (vendor).",
  },
  {
    name: "Employer, named (optional)",
    order: "When a specific company is in view, name it in the letter.",
    why: "An optional anchor on the checker: the evidence score is always read against your declared Target Role, never the employer; a letter without a named employer is honestly Skipped — never a miss (2026-10-29 ruling).",
  },
];

const BULLETS = [
  "The text reads as-is — TXT, PDF, or Word; nothing important inside images or text boxes.",
  "An opener that addresses a reader (the salutation signal).",
  "An applying-for/position mention.",
  "The role's core skills — spelled the way the postings spell them.",
  "A closing ask or a sign-off line.",
];

const PLAIN_RULES: { text: string; watch?: true }[] = [
  {
    text: "Single column, standard fonts, single spacing, no photos or graphics (JobStreet PH — vendor).",
  },
  { text: "Content in images or text boxes reads as blank to parsers — that's the scan/no-OCR reject.", watch: true },
  { text: "Keep it short: one page, roughly 250–400 words (JobStreet PH — vendor).", },
  { text: "Sign-off convention: “Sincerely” or “Regards”; traditional industries (“Respectfully yours”) (JobStreet PH — vendor)." },
];

/**
 * The check's reading — the same receipts the checker prints (Q17 shares)
 * in the letter's four-part shape, plus the honesty line. No CTA card:
 * the checker lives on /prep, and this page stays quiet reference.
 */
export default function LetterGuidePage() {
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
            <LetterGuideBandArt />
            <div>
              <h1 className="t">Cover letter format guide</h1>
              <p className="m">reference — curated and sourced, not a builder</p>
            </div>
          </div>
        </div>
      </header>

      <div className="g-cards">
        {/* CARD 1 — the letter's shape, in order */}
        <section className="card">
          <div className="b-head">
            <h2>The letter&apos;s shape, in order</h2>
            <p className="helper">
              Write the letter yourself (Documents/Word, outside this system), and the
              cover-letter check reads it back
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

        {/* CARD 2 — the five checks + the provenance caption */}
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
          <p className="src-line num">
            Sourced: SHRM 2024 (“Resume parsers scan resumes and cover letters for words
            or phrases that match job descriptions”); HBS/Accenture Hidden Workers 2021;
            JobStreet Philippines (vendor): the cover-letter structure article (2025) and
            the first-time-job-seeker piece (2025). The letter-structure signals themselves
            are the checker&apos;s own deterministic set — no external letter standard is
            claimed for them.
          </p>
        </section>

        {/* CARD 3 — plain layout; the parser-blank line is the ONE amber line */}
        <section className="card">
          <div className="b-head">
            <h2>Plain layout, by design</h2>
            <p className="helper">
              The letter rides the same parse regime as the resume: `ATS-friendly` is a
              formatting property — real text, standard structure, no content inside text
              boxes.
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

        {/* CARD 4 — how the check reads it (the honest receipts register) */}
        <section className="card">
          <div className="b-head">
            <h2>How the check reads it</h2>
            <p className="helper">
              The same receipts the checker prints: parse 20% + evidence 40% + structure
              40% — your latest check counts. Feedback only: it never claims an employer
              system will accept your letter.
            </p>
          </div>
          <div className="rs-checks">
            <p className="rs-check num">
              <span className="mark ok">·</span> <b>Parse</b> — the text is readable as-is.
            </p>
            <p className="rs-check num">
              <span className="mark ok">·</span> <b>Evidence</b> — the skill names of your
              declared Target Role, found in the letter. The anchor is always the role;
              the employer name is an anchor, never the role.
            </p>
            <p className="rs-check num">
              <span className="mark ok">·</span> <b>Structure</b> — the letter&apos;s
              three signals (opener · position mention · closing or sign-off) and the
              honestly-optional employer row.
            </p>
          </div>
          <p className="g-quietlink num">
            The checker lives on{" "}
            <Link className="link-quiet" href="/prep">
              Prep — Letter tab
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

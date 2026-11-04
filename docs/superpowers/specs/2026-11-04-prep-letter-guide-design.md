# Prep letter guide — design record (2026-11-04)

**Surface:** `/prep/letter-guide` (new). User ruling 2026-11-04: "no need
for me to review it. Build it directly on site; no need mockup. You already
get the gist from resume afterall." Same-day build; rides the shipped
g-register (DESIGN.md #16/#17).

## Shape (the resume guide's register, reused wholesale)

- Band: top back chip `‹ Back to Prep` + the drawn OPEN ENVELOPE letter
  (`letter-guide/BandArt.tsx`) leading the title cluster — its OWN figure
  under the hero-law: a letter rising out of a wash envelope, its three
  signals (opener · body evidence · closing ask + sign-off) drawn in the
  order the checker reads them.
- Four own-cards: ① the letter's shape, in order (Step/Rule/Why table,
  engine-true + vendor-labeled) · ② the five checks — self-mark before
  the run (+ provenance caption) · ③ plain layout, by design (the ONE
  amber watch on the parser-blank rule) · ④ how the check reads it (the
  Q17 receipts register: parse 20% + evidence 40% + structure 40%,
  feedback-only). One new class: `.g-quietlink`.

## Content register (the honesty contract)

- SHRM 2024 (verbatim): "Resume parsers scan resumes and cover letters
  for words or phrases that match job descriptions" — the only
  non-vendor external claim.
- HBS/Accenture Hidden Workers 2021 (keyword filtering) — carried.
- JobStreet Philippines (vendor, labeled): structure article (2025) +
  first-time-job-seeker article (2025) — structure, PH conventions,
  250–400 words, keywords from the listing, fresh-graduate/OJT lead.
- The letter-structure signals (salutation · applying mention · closing
  ask/sign-off · optional employer anchor) are the checker's OWN
  deterministic set — the page's caption says no external letter
  standard is claimed for them.
- Sources doc updated: "Letter guide sources" appendix +
  VERIFY heading preserved.
- No new outcome claims; `ATS-friendly` stays a formatting property.

## Wire-up

- `/prep`: the Letter channel card gets its peer door `Letter guide →`
  (completing the two-door ruling; Presence stays doorless). Resume
  door label unchanged ("Format guide").
- No CSS concept beyond `.g-quietlink` — everything else rides the
  guide round's block in prep.css. No loading.tsx (static page, same
  as the resume guide).

## Tests/verification

tsc clean; production build compiles; live dev page served. No engine
changes; fixture suite untouched.

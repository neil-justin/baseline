# Prep feedback round Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Land the four 2026-11-04 Prep feedback items — a My-Plan-style readiness ring on the band, Dashboard kicon discs on the channel cards, a simulate-analyzing beat (~900 ms + subtle motion, then a staggered card entrance), and a `not_letter` content gate mirroring the resume's `not_resume`.

**Architecture:** All UI work is CSS/markup on the existing 860px card-per-section page — the ring geometry lifts from `pathway.css` into the shared `v7.css` band register so My Plan and Prep share one family; the gate is one sanity floor in the letter engine surfaced through the existing 422 `{error, detail, missing}` shape; motion rides the existing reduced-motion-safe "v9.1 motion" block in `prep.css`. Engines' scoring, stores, honesty copy, and all e2e hooks are untouched.

**Tech Stack:** Next.js 16 app router (server components), React 19 client components, hand-rolled CSS (`prep.css`, `v7.css`, `pathway.css`), vitest for engines.

**Spec:** `docs/superpowers/specs/2026-11-04-prep-feedback-round-design.md`

**IMPORTANT (AGENTS.md):** this is NOT Next.js as trained — before writing code, read the relevant guide under `node_modules/next/dist/docs/`. This plan touches only markup, CSS, and engine code; no route/API conventions change except one JSON field.

**Verification baseline:** run `npx vitest run scripts/letter-engine.test.ts scripts/resume-engine.test.ts scripts/verify-fixtures.test.ts` BEFORE starting, and expect every suite green — the plan's tasks must leave them green.

---

### Task 1: `not_letter` sanity gate (engine, TDD)

**Files:**
- Modify: `lib/engines/letter.ts` (rejection union + interface ~L43-57; `reject` helper ~L137; success returns ~L190-210)
- Test: `scripts/letter-engine.test.ts` (append a describe block)

- [ ] **Step 1: Write the failing tests**

Append to the end of `scripts/letter-engine.test.ts`:

```ts
describe("the not-letter sanity floor (2026-11-04 feedback round)", () => {
  it("rejects an essay that parses fine but carries no letter signals", async () => {
    const essay = "The causes and consequences of climate change have been studied for decades. Scientists measure ice cores, tree rings, and ocean temperatures to model what happens next. Policymakers debate carbon pricing while farmers adapt to shifting seasons. The evidence keeps mounting and public awareness keeps growing with every report published.";
    const intake = await intakeLetterFile({ bytes: Buffer.from(essay, "utf8"), fileName: "essay.txt", fileCount: 1 });
    expect(intake.ok).toBe(false);
    if (intake.ok) return;
    expect(intake.code).toBe("not_letter");
    expect(intake.detail).toBe("This doesn't read as a cover letter.");
    expect(intake.missing).toContain("a salutation or letter-style opener");
    expect(intake.missing).toContain("an applying-for/position mention");
  });

  it("rejects a recipe the same way", async () => {
    const recipe = "Preheat the oven to 180 degrees Celsius. Mix the flour, sugar, and eggs in a large bowl until smooth. Pour the batter into a greased pan and bake for forty minutes. Let it cool before serving with cream or fresh fruit on top. Store leftovers in an airtight container for up to three days at room temperature.";
    const intake = await intakeLetterFile({ bytes: Buffer.from(recipe, "utf8"), fileName: "recipe.txt", fileCount: 1 });
    expect(intake.ok).toBe(false);
    if (intake.ok) return;
    expect(intake.code).toBe("not_letter");
  });

  it("a plain but real letter with no 'Dear' still passes (low signal floor)", async () => {
    const plain = "Hello Ms. Reyes — I am applying for the Software QA Analyst position at your company. I have completed a full-cycle manual QA internship where I authored and tracked over sixty defect reports, ran regression suites against two releases, and presented findings to the development team in weekly sessions. My coursework covered software testing fundamentals, version control with Git, and SQL querying. I would welcome the chance to discuss how my testing experience fits your team. Sincerely, Paolo Mendoza";
    const intake = await intakeLetterFile({ bytes: Buffer.from(plain, "utf8"), fileName: "no-dear.txt", fileCount: 1 });
    expect(intake.ok).toBe(true);
  });

  it("the canon demo letter still clears the gate", async () => {
    const raw = readFileSync(FIX("cover-letter-qa.txt"), "utf8");
    const intake = await intakeLetterFile({ bytes: Buffer.from(raw, "utf8"), fileName: "cover-letter-qa.txt", fileCount: 1 });
    expect(intake.ok).toBe(true);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run scripts/letter-engine.test.ts`
Expected: the new describe FAILS — TypeScript on `intake.missing` (property does not exist) and the essay/recipe passthrough (`intake.ok === true`). The existing suites stay green.

- [ ] **Step 3: Implement the gate in `lib/engines/letter.ts`**

3a. Add `"not_letter"` to the rejection union and `missing` to the rejected shape (~L43-57):

```ts
export type LetterRejectionCode =
  | "multi_file" // more than one file in a single upload
  | "oversize" // > 5 MB
  | "empty" // arrived empty or effectively blank
  | "encrypted" // password-protected/encrypted document
  | "scanned" // image-only PDF — NO OCR; re-export as real text
  | "wrong_type" // content is neither PDF, DOCX, nor plain text
  | "not_letter" // parsed fine, but reads no more like a letter than a resume does (2026-11-04)
  | "parse_error"; // parser threw for another reason

export interface LetterRejected {
  ok: false;
  code: LetterRejectionCode;
  /** user-facing one-liner (names the letter, not the resume) */
  detail: string;
  /** what's-missing inventory for `not_letter` (resume's not_resume parity; the UI appends the tail) */
  missing?: string[];
}
```

3b. Extend the `reject` helper (~L137) to carry the inventory:

```ts
const reject = (code: LetterRejectionCode, detail: string, missing?: string[]): LetterRejected => ({
  ok: false,
  code,
  detail,
  missing,
});
```

3c. Add the gate function + shared success helper. Place them directly AFTER the `SALUTATION_RE` / `CLOSING_ASK_RE` definitions (the "deterministic structural set" section ~L220-229) so the regexes are visible — at runtime the intake resolves them long after module init:

```ts
/* ── "doesn't read as a cover letter" gate (2026-11-04 feedback round) ───── */

/** applying/role mention: the letter names an application, a position, a role */
const APPLYING_RE =
  /\b(applicat(?:ion|ions|ions? for|ion letter)|appl(?:y|ied|ying) (?:for|to)|position|vacanc(?:y|ies)|hiring|candidate for|role)\b/i;

/** sign-off line: the letter's tail closes as a letter does */
const SIGNOFF_RE =
  /\b(sincerel?y(?: yours)?|respectfully yours|kind regards|best regards|warm regards|yours (?:truly|faithfully))\b/i;

/**
 * Parsed fine, but the text carries fewer than two of a letter's three
 * signals (letter-style opener · applying/position mention · closing or
 * signature line). Mirrors the resume's `isProbablyResume` deliberately
 * LOW floors: a plain-but-real letter that opens without "Dear" still
 * passes; an essay, a recipe, or an invoice does not. The missing
 * inventory rides OUT of the detail (the route relays `missing`; the
 * surface appends the tail) — the resume's routed not_resume pattern.
 */
export function isProbablyLetter(text: string): LetterRejected | null {
  const missing: string[] = [];
  if (!SALUTATION_RE.test(text)) missing.push("a salutation or letter-style opener");
  if (!APPLYING_RE.test(text)) missing.push("an applying-for/position mention");
  if (!CLOSING_ASK_RE.test(text) && !SIGNOFF_RE.test(text)) {
    missing.push("a closing or sign-off line");
  }
  if (missing.length >= 2) {
    return reject("not_letter", "This doesn't read as a cover letter.", missing);
  }
  return null;
}

/** the shared parsed-success point — every kind's text clears the gate here */
const delivered = (kind: LetterKind, text: string): LetterParsed | LetterRejected => {
  const gate = isProbablyLetter(text);
  return gate ?? { ok: true, kind, text };
};
```

3d. Route all THREE parse-success returns through `delivered` inside `intakeLetterFile` (~L190-210):

- PDF success: `return { ok: true, kind: "pdf", text };` → `return delivered("pdf", text);`
- DOCX success: `return { ok: true, kind: "docx", text };` → `return delivered("docx", text);`
- TXT success: `return { ok: true, kind: "txt", text };` → `return delivered("txt", text);`

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run scripts/letter-engine.test.ts scripts/resume-engine.test.ts scripts/verify-fixtures.test.ts`
Expected: ALL PASS (canon letter clears the gate: its opener matches SALUTATION_RE, its body matches APPLYING_RE via "applying", its tail matches CLOSING_ASK_RE).

- [ ] **Step 5: Commit**

```bash
git add lib/engines/letter.ts scripts/letter-engine.test.ts
git commit -m "letter engine: not_letter sanity gate (resume not_resume parity)"
```

---

### Task 2: Surface the `not_letter` rejection (route + intake UI)

**Files:**
- Modify: `app/api/cover-letter/check/route.ts:78-80` (relay `missing`)
- Modify: `app/(app)/prep/LetterUpload.tsx` (REJECT_COPY entry ~L24-37 + `missing` tail in `check()` ~L66-70)

- [ ] **Step 1: Relay `missing` in the route**

In `app/api/cover-letter/check/route.ts`, the intake-relay line (currently `return NextResponse.json({ error: intake.code, detail: intake.detail }, { status: 422 });`) becomes the resume route's exact pattern:

```ts
return NextResponse.json(
  { error: intake.code, detail: intake.detail, missing: intake.missing ?? null },
  { status: 422 }
);
```

- [ ] **Step 2: Frontend copy + missing tail**

In `app/(app)/prep/LetterUpload.tsx`, add the REJECT_COPY entry (alphabetical spot, after `multi_file`):

```ts
  not_letter: "This doesn't read as a cover letter.",
```

In `check()`, mirror the resume uploader's success line and tail (rename identical to `ResumeUpload.tsx:49-56`). The `const json = ...` destructure gains `missing`:

```ts
        const json = (await res.json().catch(() => null)) as { error?: string; detail?: string; missing?: string[] } | null;
        const code = json?.error ?? "parse_error";
        const tail = json?.missing?.length ? ` It's missing ${json.missing.join(" and ")}.` : "";
        setErr((json?.detail ?? REJECT_COPY[code] ?? "The file was rejected — try exporting the letter as a PDF, DOCX, or TXT.") + tail);
```

(Removes the old `setErr(json?.detail ?? REJECT_COPY[code] ?? "...")` line.)

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Manual probe (dev server up)**

`history.txt` saved as a .txt — drop into the cover-letter checker: expect the inline amber error `This doesn't read as a cover letter. It's missing a salutation or letter-style opener and …`. Confirm nothing was stored (re-open `/prep#letter` — still no run).

- [ ] **Step 5: Commit**

```bash
git add app/api/cover-letter/check/route.ts app/\(app\)/prep/LetterUpload.tsx
git commit -m "letter intake: surface the not-letter rejection with what's missing"
```

---

### Task 3: Channel-card kicons (Dashboard register)

**Files:**
- Modify: `app/(app)/prep/page.tsx` (function `ChannelCard` ~L68-124 + the three call sites ~L602-606)
- Modify: `app/(app)/prep/prep.css` (kicon block, after the `.prep-kpi` rules ~L80-135)

- [ ] **Step 1: Give `ChannelCard` a tone + icon**

Change the signature and opening markup of the existing `function ChannelCard({ name, part, notRun, note }: {...})` in `app/(app)/prep/page.tsx`:

```tsx
function ChannelCard({
  name,
  part,
  notRun,
  note,
  tone,
  icon,
}: {
  name: string;
  part: PartView;
  notRun: string;
  note: string;
  /** the wash family — Dashboard's three-tone kicon register (2026-11-04) */
  tone: "blue" | "green" | "amber";
  icon: ReactNode;
}) {
  const full = part.measured && part.earned === part.max;
  const pct = (n: number) => `${Math.round((n / part.max) * 100)}%`;
  return (
    <div className={`prep-kpi k-${tone}`}>
      <span className="kicon" aria-hidden="true">
        {icon}
      </span>
      <span className="k-name">{name}</span>
```

(everything from `<span className={\`k-score ...` down stays byte-identical). `ReactNode` is already imported at the top of the file (`import type { ReactNode } from "react";`).

- [ ] **Step 2: Update the three call sites** (~L602-606)

```tsx
            <ChannelCard
              name="Resume"
              part={parts.resume}
              notRun="NOT YET RUN"
              note={resumeNote}
              tone="blue"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                  <path d="M9 13h6M9 17h4" />
                </svg>
              }
            />
            <ChannelCard
              name="Letter"
              part={parts.letter}
              notRun="NOT YET CHECKED"
              note={letterNote}
              tone="green"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              }
            />
            <ChannelCard
              name="Presence"
              part={parts.presence}
              notRun="NOT DECLARED"
              note={presenceNote}
              tone="amber"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4.2 3.6-6.5 8-6.5s8 2.3 8 6.5" />
                </svg>
              }
            />
```

(The SVG style is Dashboard's own kicon style — 24 viewBox, no width/height attrs, sized by CSS.)

- [ ] **Step 3: Add the kicon CSS**

In `app/(app)/prep/prep.css`, insert directly after the `.v7prep .prep-kpi .k-note` rule (~L135):

```css
/* the kicon discs — Dashboard's imagery register (F4, 2026-11-04) */
.v7prep .prep-kpi .kicon {
  order: -3;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  margin-bottom: 10px;
  color: var(--v-ink);
}
.v7prep .prep-kpi .kicon svg { width: 18px; height: 18px; }
.v7prep .prep-kpi.k-blue .kicon { background: var(--v-blue-wash); }
.v7prep .prep-kpi.k-green .kicon { background: var(--v-green-wash); }
.v7prep .prep-kpi.k-amber .kicon { background: var(--v-amber-wash); }
```

(Geometry is byte-identical to `dashboard.css` `.v7dash .kicon`; no `stroke` color overrides — Dashboard's kicon svgs draw in the ink/blue the stroke-var carries; here `color: var(--v-ink)` keeps the glyph readable on all three washes.)

- [ ] **Step 4: Visual check + typecheck**

Run: `npx tsc --noEmit` — expect clean.
On the dev server, open `/prep`: the three channel cards each show a wash disc above the name; factor cards stay icon-less; nothing else moved.

- [ ] **Step 5: Commit**

```bash
git add "app/(app)/prep/page.tsx" "app/(app)/prep/prep.css"
git commit -m "prep: Dashboard kicon discs on the three channel cards"
```

---

### Task 4: Band readiness ring (the My Plan register)

**Files:**
- Modify: `app/(app)/v7.css` (shared ring block after the composite rules ~L571)
- Modify: `app/(app)/pathway/pathway.css` (delete the plan-ring geometry block ~L577-614)
- Modify: `app/(app)/prep/page.tsx` (band markup ~L565-585)
- Modify: `app/(app)/prep/prep.css` (remove the `.prep-readiness` composite overrides ~L61-74; add nothing — the register lives in `v7.css`)

- [ ] **Step 1: Shared ring register in `v7.css`**

Insert directly after the `.v7 .ratemsg b` rule (~L571), before the `.v7 .segs` block:

```css
/* ---------- the band readiness ring (2026-11-04 Prep round) — the
   plan-ring geometry lifted from pathway.css so My Plan and Prep ride ONE
   ring register; the .lead-mono e2e counter is markup, not CSS ---------- */
.v7 .plan-ring,
.v7 .readring { position: relative; width: 130px; height: 130px; flex: none; }
.v7 .plan-ring svg,
.v7 .readring svg { display: block; width: 100%; height: 100%; transform: rotate(-90deg); }
.v7 .plan-ring circle,
.v7 .readring circle { fill: none; }
.v7 .plan-ring-track,
.v7 .readring-track { stroke: var(--v-rows); }
.v7 .plan-ring-arc,
.v7 .readring-arc { stroke: var(--v-blue); stroke-linecap: round; }
.v7 .plan-ring-mid,
.v7 .readring-mid {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  text-align: center;
}
.v7 .plan-ring-mid b,
.v7 .readring-mid b {
  font: 500 26px/1 "Google Sans", Roboto, system-ui, sans-serif;
  letter-spacing: -0.01em;
  color: var(--v-ink);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.v7 .plan-ring-mid small,
.v7 .readring-mid small {
  display: block;
  margin-top: 3px;
  font: 500 10px/1.4 Roboto, system-ui, sans-serif;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--v-meta);
}
```

- [ ] **Step 2: Delete the pathway.css duplicate geometry**

In `app/(app)/pathway/pathway.css`, DELETE the block from the comment `/* the ring — the ONE progress visual (130px, 9px stroke: the text inside
   was riding the arc's inner edge at the old 118/10 register) */` down to and including the closing `}` of `.v7plan .plan-ring-mid small` (file lines ~577-614). Keep `.v7plan .planhead` (above it) and `.v7plan .plan-head` (below it) untouched. My Plan's visuals then ride the shared `v7.css` rules — same values, one source.

- [ ] **Step 3: Prep band markup — composite → ring**

In `app/(app)/prep/page.tsx`, replace the band's right slot (~L577-583):

```tsx
          <div className="composite-wrap prep-readiness">
            <div className="composite">
              <span className="score-big num">{score?.ar ?? "—"}</span>
              {score ? <span className="c-of">/{WEIGHTS.ar}</span> : null}
            </div>
            <div className="ratemsg">application readiness</div>
          </div>
```

with the ring (same slot, same figure — `—` stays the honest non-measured paint):

```tsx
          {/* F1 (2026-11-04): the band's visual — the readiness ring, My
              Plan's plan-ring register. Same figure the composite read:
              ar / WEIGHTS.ar; an unmeasured page still paints "—". */}
          <div
            className="readring"
            role="img"
            aria-label={
              score
                ? `${score.ar} of ${WEIGHTS.ar} application-readiness points`
                : "Application readiness — not yet measured"
            }
          >
            <svg viewBox="0 0 130 130" aria-hidden="true">
              <circle className="readring-track" cx="65" cy="65" r="56" strokeWidth="9" />
              <circle
                className="readring-arc"
                cx="65" cy="65" r="56" strokeWidth="9"
                strokeDasharray={`${score ? Math.round((score.ar / WEIGHTS.ar) * 351.9 * 10) / 10 : 0} 351.9`}
              />
            </svg>
            <span className="readring-mid">
              <b className="num">{score ? `${score.ar}/${WEIGHTS.ar}` : "—"}</b>
              <small>application readiness</small>
            </span>
          </div>
```

NOTE — no remaining typos: the comment above says "unmeasured".

- [ ] **Step 4: Retire Prep's composite overrides**

In `app/(app)/prep/prep.css`, delete the whole block (comment + rules, ~L61-74):

```css
/* ---------- the band composite — application readiness in the slot
   Dashboard gives 36/100 (R2, user ruling 2026-11-03) ---------- */

.v7prep .prep-readiness {
  min-width: 0;
  text-align: right;
}
.v7prep .prep-readiness .composite { justify-content: flex-end; }
.v7prep .prep-readiness .score-big {
  min-width: 2ch;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.v7prep .prep-readiness .ratemsg { margin-top: 4px; }
```

(`.composite-wrap` min-width 236px still applies from `v7.css` and right-aligns the ring slot in the bandrow — no new Prep CSS needed. If the ring visually sits with dead space at 236px, set instead `.v7prep .composite-wrap { min-width: 0; }` in prep.css and confirm with a screenshot.)

- [ ] **Step 5: Verify both pages**

Run: `npx tsc --noEmit` — clean.
On the dev server:
- `/prep` — band shows the 130px ring on the right with `9/15` and the uppercase small label; arc fills proportionally; with no target role it paints `—` on an empty track.
- `/pathway` — My Plan's header card is PIXEL-IDENTICAL to before (same ring size, stroke, fonts). This is the no-regression proof for the register lift.

- [ ] **Step 6: Commit**

```bash
git add "app/(app)/v7.css" "app/(app)/pathway/pathway.css" "app/(app)/prep/page.tsx" "app/(app)/prep/prep.css"
git commit -m "prep band: readiness ring on the shared ring register (My Plan parity)"
```

---

### Task 5: Analyze motion (the ~900 ms beat + result entrance)

**Files:**
- Modify: `app/(app)/prep/ResumeUpload.tsx` (run() L41-62 + busy branch L89-90)
- Modify: `app/(app)/prep/LetterUpload.tsx` (check() same shape as ResumeUpload)
- Modify: `app/(app)/prep/prep.css` (motion rules in the existing v9.1 block ~L945-968)

- [ ] **Step 1: The delay + spinner in `ResumeUpload.tsx`**

Add the constant above the REJECT_COPY map:

```ts
/** the simulated analyze beat (F3, user-ruled 2026-11-04): a deliberate
 * ~900 ms floor runs beside the fetch — a fast parse still reads as work */
const ANALYZE_MIN_MS = 900;
```

In `run()`, replace:

```ts
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/resume/diagnose", { method: "POST", body: form });
```

with:

```ts
    setBusy(true);
    setErr(null);
    try {
      const [res] = await Promise.all([
        fetch("/api/resume/diagnose", { method: "POST", body: form }),
        new Promise((resolve) => setTimeout(resolve, ANALYZE_MIN_MS)),
      ]);
```

Replace the busy branch (~L89-90):

```tsx
          <span className="dz-busy">Reading the file…</span>
```

with:

```tsx
          <span className="dz-busy dz-analyzing" role="status" aria-live="polite">
            <svg className="dz-spin" aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <circle cx="12" cy="12" r="9" opacity="0.25" />
              <path d="M21 12a9 9 0 0 0-9-9" />
            </svg>
            Analyzing…
          </span>
```

Add the analyzing class to the zone (so the zone itself pulses):

```tsx
        className={`dz-zone${slim ? " dz-slim" : ""}${drag ? " dz-over" : ""}${busy ? " dz-analyzing" : ""}`}
```

- [ ] **Step 2: The same beat in `LetterUpload.tsx`**

Identical constants and replacements: constant above REJECT_COPY; in `check()` replace

```ts
      const res = await fetch("/api/cover-letter/check", { method: "POST", body: form });
```

with the same `Promise.all([fetch(...), floor])` shape (the fetch's second arg stays byte-identical); replace the busy span and add `${busy ? " dz-analyzing" : ""}` to the zone className. LetterUpload's busy branch is identical text (`Reading the file…`) — same replacement.

- [ ] **Step 3: The motion CSS**

In `app/(app)/prep/prep.css`, replace the busy-line rule (`.v7prep .dz-busy { ... }` ~L629):

```css
.v7prep .dz-busy {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font: 400 13.5px/1.5 Roboto, system-ui, sans-serif;
  color: var(--v-ink2);
}
```

And inside the existing `@media (prefers-reduced-motion: no-preference)` block (~L946-966), append:

```css
  /* the analyzing beat: the zone breathes while the check runs */
  .v7prep .dz-zone.dz-analyzing { animation: dz-pulse 1.4s ease-in-out infinite; }
  .v7prep .dz-spin { animation: dz-rot 0.9s linear infinite; }
  /* the landing: result cards fade-slide in, a ~40ms stagger */
  .v7prep .prep-kpi,
  .v7prep .prep-stack > .card { animation: prep-card-in 0.25s cubic-bezier(0.2, 0, 0, 1) backwards; }
  .v7prep .prep-kpis .prep-kpi:nth-child(2),
  .v7prep .prep-stack > .card:nth-child(2) { animation-delay: 40ms; }
  .v7prep .prep-kpis .prep-kpi:nth-child(3),
  .v7prep .prep-stack > .card:nth-child(3) { animation-delay: 80ms; }
  .v7prep .prep-stack > .card:nth-child(4) { animation-delay: 120ms; }
  .v7prep .prep-stack > .card:nth-child(5) { animation-delay: 160ms; }
  .v7prep .prep-stack > .card:nth-child(6) { animation-delay: 200ms; }
  .v7prep .prep-stack > .card:nth-child(7) { animation-delay: 240ms; }
  .v7prep .prep-stack > .card:nth-child(n + 8) { animation-delay: 240ms; }
  /* the rejection copy fades in under the same beat */
  .v7prep .dz-err { animation: prep-fade-in 0.25s cubic-bezier(0.2, 0, 0, 1); }
```

And beneath the existing `@keyframes` lines (~L967-968), add:

```css
@keyframes dz-pulse {
  0%, 100% { border-color: var(--v-border); box-shadow: none; }
  50% { border-color: var(--v-blue); box-shadow: 0 0 0 4px var(--v-blue-wash); }
}
@keyframes dz-rot { to { transform: rotate(360deg); } }
@keyframes prep-card-in { from { opacity: 0; transform: translateY(5px); } }
@keyframes prep-fade-in { from { opacity: 0; } }
```

(Existing `@keyframes prep-panel-in` / `prep-drawer-in` stay untouched. The entrance rides `animation` on `.prep-kpi` + `.card`, which already carry a `transition` transform for hover — the 0.25s `backwards` play finishes before a hover transform matters; no conflict.)

- [ ] **Step 4: Verify the beat, honestly**

Run: `npx tsc --noEmit` — clean.
On the dev server:
- Drop `resume-qa.pdf`: zone shows spinner + "Analyzing…" for ≥900 ms, then the page reloads and the cards cascade in top-to-bottom.
- Drop a rejected file: same analyze beat, then the amber copy fades in and the zone returns to idle.
- Set OS "reduce motion" ON: no pulse, no spinner rotation ramp (button still swaps to the text state), no cascade — instant.
- Tabs still deep-link; `.dz-zone` and err hooks unchanged (e2e contract).
- Beat timing check: `e2e` specs (living in `.worktrees/google-signin/e2e`, not this tree) wait on `.rs-readout` after reload with 45 s budgets — the 900 ms floor is far inside every budget.

- [ ] **Step 5: Commit**

```bash
git add "app/(app)/prep/ResumeUpload.tsx" "app/(app)/prep/LetterUpload.tsx" "app/(app)/prep/prep.css"
git commit -m "prep: the analyze beat (~900ms) + staggered result entrance"
```

---

### Task 6: Full verification + record sync

**Files:**
- Modify: `docs/superpowers/specs/2026-11-04-prep-feedback-round-design.md` (status line)

- [ ] **Step 1: Engine suites**

Run: `npx vitest run scripts/letter-engine.test.ts scripts/resume-engine.test.ts scripts/verify-fixtures.test.ts`
Expected: all green.

- [ ] **Step 2: The rest of the vitest bank**

Run: `npx vitest run`
Expected: all green (any pre-existing red must be triaged and named as pre-existing with its commit — never silently accepted).

- [ ] **Step 3: Typecheck + production build**

Run: `npx tsc --noEmit && npm run build`
Expected: build succeeds (the CSS/markup edits ship in the compiled page).

- [ ] **Step 4: Spec status**

In `docs/superpowers/specs/2026-11-04-prep-feedback-round-design.md`, change the status line to:

```markdown
Date: 2026-11-04 · Status: **implemented** (F1-F4 user-ruled)
```

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/specs/2026-11-04-prep-feedback-round-design.md
git commit -m "docs: prep feedback round implemented"
```

---

### Task 7: in-place result swap (round 2, user-ruled 2026-11-04)

**Files:**
- Modify: `app/(app)/prep/ResumeUpload.tsx` (replace `window.location.reload()`)
- Modify: `app/(app)/prep/LetterUpload.tsx` (same replacement)
- Modify: `app/(app)/prep/prep.css` — likely none (the restart trick reuses the existing stylesheet animation + its nth-child delays)

**Mechanics (user ruling: Option A — `router.refresh()` in-place swap; after landing, replay the cascade and always auto-scroll the verdict card to the viewport top):**

1. In both uploaders, replace the success branch:

```ts
      if (res.ok) {
        window.location.reload(); // the server page re-renders the stored run
      } else {
```

with a transition + landing choreography helper (SHARED shape in each file; local constant `LANDING_SETTLE_MS = 8000` watchdog):

- `useRouter` from `next/navigation` + `useTransition` from `react` are added to imports.
- On success:

```ts
      if (res.ok) {
        startTransition(() => {
          router.refresh(); // re-renders the server tree IN PLACE (no reload)
        });
        await awaitLanding(() => document.querySelector(".rs-readout"));
        replayAndScroll();
      } else {
```

- `useTransition()`'s `isPending` is the preferred landing signal: flips false when the new RSC tree commits. But verify in the probe that `startTransition` actually tracks `router.refresh()` in this Next version (`refresh(): void` — the built-in returns nothing). If `isPending` DOES flip true and false around the refresh, use it: await `isPending === true` then `false` (poll inside rAF). If it does NOT flip (stays false throughout), fall back to the DOM-settling observer:

```ts
      // fallback landing signal: watch the active panel for the swap churn,
      // resolve when mutations settle (120ms quiet) or the watchdog fires
      function awaitLanding(hasNew: () => boolean) { ... }
```

  The observer watches `document.querySelector(".tabpanel:not([hidden]) .prep-stack")` (falls back to the whole tabpanel for the never-run → results swap) with `childList/subtree`; resolves when 120 ms pass with no mutation batch, or at the 8 s watchdog (then skip replay/scroll silently — honest dead-end, the zone is already idle).

- `replayAndScroll()`:

```ts
  // the restart trick: stylesheet animation replays WITH its nth-child
  // stagger; fresh-mounted cards replay too (harmless, no double-op)
  function replayAndScroll() {
    const panel = document.querySelector(".tabpanel:not([hidden])");
    const cards = panel?.querySelectorAll(".prep-kpi, .prep-stack > .card") ?? [];
    requestAnimationFrame(() => {
      cards.forEach((el) => {
        el.style.animation = "none";
        void el.getBoundingClientRect(); // reflow — records the restart
        el.style.animation = "";
      });
    });
    const verdict = panel?.querySelector(".rs-readout, .cl-readout");
    verdict?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
```

  (scroll starts with the cascade — they run simultaneously; smooth scroll + 0.25s stagger reads as one handoff.)

2. `setBusy(false)` stays in `finally` (unchanged position — it now clears AFTER the choreography helper resolves; keep the zone's Analyzing… state through the whole landing; the zone returns to idle as the cascade replays).

**Verification steps:**
- `npx tsc --noEmit` + full `npx vitest run` (144/144).
- Live probe (`/tmp/opencode/prep-feedback-probe.mjs` pattern, dev server :3111, seed sign-in): drop `scripts/fixtures/resume-qa.pdf` into the re-run zone and record via the same init-script instrumentation — Expect: NO navigation event (URL unchanged, no `framenavigated`, `performance.getEntriesByType('navigation')` unchanged → no new document), scroll Y PRESERVED through the wait and then animated toward the verdict card's top, cascading `prep-card-in` animationstart records AFTER the RSC swap, band figures updating (AR climbs) without a full paint, and the zone returning to idle.
- Also verify the never-run path: a fresh student (or a store-wiped target) uploads via the hero — the panel swaps from intake to the results stack, cascade plays natively (fresh mounts), verdict scroll still runs.
- **e2e impact (record, don't fix — worktrees are out of bounds):** `.worktrees/google-signin/e2e` specs assert AFTER `waitForLoadState("load")` (resolves immediately now) with 45s visibility budgets on `.rs-readout`/`.cl-readout` — assertions survive refresh; the "RELOADED document" comments need a follow-up on that branch ONLY.
- Reduced motion: `scrollIntoView({ behavior: "smooth" })` must respect it — gate to `matchMedia("(prefers-reduced-motion: reduce)")`: `"auto"` scroll when reduced (instant, still aligned to the verdict).

**Commit**

```bash
git add "app/(app)/prep/ResumeUpload.tsx" "app/(app)/prep/LetterUpload.tsx"
git commit -m "prep: in-place result swap (router.refresh + cascade replay + verdict scroll)"
```

Rules for the executor: no API/store/engine changes; both uploaders keep their e2e hooks byte-kept; the landing helper may be one shared inline shape in each file (they mirror by design — no shared util); any deviation is a USER RULING — stop and report.

- **e2e specs live OUT of this tree** (`.worktrees/google-signin/e2e/`) — this round changes no hooks they assert: `.dz-zone`, `.rs-upload`, `.cl-upload`, `.rs-readout`, `.cl-readout`, `.rs-check` rows, `.lead-mono` all stay byte-kept. Do NOT touch the worktree.
- The band slot keeps `role="img"` with an aria label so the ring reads for AT; the figures are real text (screen-reader friendly), the svg is `aria-hidden`.
- If the ring's `application readiness` small label wraps ugly at the 130px box, the allowed fix is `max-width: 9ch; margin: 0 auto;` on `.readring-mid small` — report the choice.
- Any deviation (copy, timings, colors) is a USER RULING, not an executor decision — stop and report it.

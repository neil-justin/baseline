# Handoff — audit-fix session, 2026-11-02 (pre-defense; defense = 2026-11-07)

Read `docs/superpowers/specs/2026-11-02-audit-fixes-design.md` first — it is the decisions ledger
for this session. This handoff adds the state AFTER that doc plus three NEW deep problems the
user surfaced at session end (§6) — they are special-attention items and NOT yet decided or built.

## 1. What this session fixed (committed)

Three commits, oldest first: `230d9ea` (session design doc) → `9ecb02f` (checkpoint of
pre-session in-flight work: the user's Phase 2–4 profile/pathway re-cuts + research batch,
recorded on the user's behalf) → `5a38718` (session work).

- **Career lens chip bug** — "Best matches for you" now maps to the `ranked` lens
  (`lensForChip` in `app/(app)/career/CareerClient.tsx`); the unreachable "No careers indexed…"
  branch is deleted; the real empty state is the "Nothing confirmed yet" row.
- **Switch modal polish** — flat `.sw-head` (no nested band/divider), deduped cost copy, honest
  "Switching saves immediately" note, spawn animation (scrim fade 150ms + dialog rise 180ms;
  `@media (prefers-reduced-motion: no-preference)` wrapper).
- **Degree gate** — `lib/degree-gate.ts` (single source; open-tier-aware matching v2:
  "open-door/open-tier/any CHED canon" → any program; "any business-track canon" → BSBA-family;
  else substring both directions). Enforced client (locked modal state `"locked"` in the switch
  dialog, `data-flow`) AND server (`POST /api/switch` → 403). Neil's profile seeded
  `program = "BSIT"` (DB edit) → 14 of 36 roles switchable, 27 locked.
- **"Best matches for you" lens = degree-mappable subset** (user ruling) — `role.degreeAllowed`
  (career/types + page) filters the ranked lens; All/track chips keep the full 36. SHOWING kicker
  prints each lens's true total (`exploreTotal` prop deleted).
- **provenArchive** — `state.provenArchive` (évelcareer-agnostic record of verified ✓ / checked
  ✓✓ bars). `switchCareer` merges proven bars into the archive; `claimAll` restores archived
  proven facts on the active map; canon dip math unchanged (51/51 fixture tests pass). Writers:
  `markVerified`, `applyVerifiedCredential` (all cited skills, on or off map),
  `submitCheck`, switch-time merge.
- **Auth routing** — signed-in users hitting `/` redirect (staff `/admin`; students
  `/dashboard` if careerId else `/onboarding` — same rule as sign-in). Onboarding gained its
  missing `requireStudent()`. **Sign out** re-added (reverses the v7.3 retirement): form POST
  `api/auth/signout`, pinned `.signout` at the sidebar bottom (Profile link is no longer the
  tail) + sixth item in the mobile `.rail`.
- **Icon subset SYSTEMIC fix** — the 10.8 KB self-hosted Material Symbols subset was missing
  glyphs (logout, verified, block, schedule → raw ligature text like "LOGOUT"/"vERIfiED").
  Regenerated from Google Fonts CSS2 `icon_names=account_circle,block,checklist,description,
  logout,schedule,space_dashboard,task_alt,verified,work` → 9.6 KB woff2 in
  `public/fonts/`. VERIFY after adding any new `.ms` icon: `python3 + fontTools` — check cmap
  letters + GSUB ligatures (procedure in commit history/transcript). file: the font has 17
  ligatures, all 10 icon names resolve.
- **Neil's role** reset to `swd` through the real `switchCareer` (not a raw DB poke).
- **`.js` bootstrap script** in `app/layout.tsx` switched to `next/script` (`beforeInteractive`)
  to kill React 19's "script inside component" console error on client navigations.

## 2. Working tree state (UNCOMMITTED — Tier 2c, awaiting user UI review)

Files: `app/(app)/pathway/{PathwayTabs.tsx,page.tsx,pathway.css}`, `lib/types.ts` (Resource
`pick?: boolean`), `app/layout.tsx`, `package.json` (`audit:links` script),
`scripts/audit-links.mjs`, `scripts/link-audit.test.ts`, `scripts/link-audit-report.json`.

Tier 2c (grilling session Q1–Q8, all user-agreed):
1. **Ranked steps merged table** — ONE ranked table (Step | Resource | State | Effect | Action),
   no stage digits/accordion, counts deduped to the head line.
2. **Panel head register** — `h2` named surface + counter num sub-line everywhere.
3. **Empty groups lose furniture** — one honest line instead of expandable + column heads at 0 rows.
4. **One suggested resource per skill (Q5)** — authored `pick: true` wins; computed fallback
   (free tier → fewer hours → provider); Alternates card = everything else, A–Z; cards renamed
   "Suggested for your gaps" / "Full catalog alternates" (Q8).
5. **"What you'll learn" lines (Q7)** — steps + gaps rows carry the skill's canonical `what`
   (2-line clamp `.row-what`); resource rows carry their first addressed skill's `what`.
   NO new authoring was done — `what` is reused (deliberate).
6. **Link health (Q6)** — `npm run audit:links` (hits all 198 unique fixture URLs, ~2–5 min,
   writes `scripts/link-audit-report.json`); `vitest run scripts/link-audit.test.ts` FAILS on
   dead links. Current report: **0 dead / 62 moved / rest clean**. 2 Atlassian links repaired
   to the consolidated live page. 3 hosts flagged kept-with-flag in `EXPECTED_BLOCKED`
   (`linuxjourney.com`, `canva.com`, `privacy.gov.ph` — 403 to scripted fetch; **user must
   browser-verify once; if truly dead, replace/drop = content decision**).

Verification state on the tree: `tsc --noEmit` clean; 51/51 fixtures pass; link gate green.

## 3. Roles/permissions of this session's model = GLM (opencode-go). Do NOT re-decide

Logged decisions (user-locked): everything in the design doc §Tier1–2c + grilling Q1–Q8 +
"commit split: 2 commits by file-owning stream (deviation: mixed files carry both streams, labeled)"
+ ".superpowers/ to .gitignore; research batch stays tracked" + "gate v2 = Fix matcher (catalog
truth rules; digart stays locked for BSIT)" + "sign-out at sidebar bottom" + "mobile audit
autonomous background, LAST" + "user participates in every decision; user reviews UI per fix".

## 4. Operational notes

- Next.js 16.3.8 + React 19 + Tailwind v4 (mounted as token carrier; app is bespoke CSS
  v7-family: `app/(app)/v7.css` + per-surface css). Motion kit: `components/Reveal.tsx`,
  `components/CountUp.tsx`, `lib/motion.ts` (reduced-motion safe; CLS contract).
- Supabase access: `.env.local` (service key) — used ONLY for targeted maintenance scripts
  (pattern: create a vitest script under `scripts/`, it resolves `@/` aliases).
- `data/state.json` JsonStore fallback isn't active; Supabase `SeededStore` lazily seeds
  missing rows (GET paths WRITE the seed — mind this in migrations).
- E2E/capture tooling shares the live store + `reuseExistingServer` — Tier 1 store isolation
  was NOT built yet (only locks + gates). Treat as future work if QA runs recur.
- npm warns "Unknown cli config --skipwarn" (user's global npmrc; harmless).
- Commit hygiene: check `git status` before committing — the tree often carries the user's
  other-window work; never sweep unknown files into a fix commit (happened once this session).

## 5. Queue order (rest of the session plan)

1. **Tier 2b** — header cards: shared CSS register (drift: 12/14px margins, 11.5/13px subtitle,
   flex/grid bandrow; My Plan white band vs DESIGN.md-ruled grey tray) + **content co-plan** with
   the user BEFORE markup (per-page: title/subtitle/instrument cells/CTA).
2. **Tier 2** — profile tab (all fixes + hard copy pruning; details in design doc §Tier 2).
3. **§6 items below — special attention (NEW)**.
4. **Tier 3** — subtle animation pass (existing reduced-motion kit; hover states; no new deps);
   landing restructure + rewrite (stale "SHS students" metadata in `app/layout.tsx:6-7` MUST
   go; dedupe 5× "Start check →" to 2; align tokens with the app's green/Archivo without losing
   the marketing look).
5. **Tier 3.5** — route-level `loading.tsx` skeletons per `(app)` surface (band + card-row
   shapes; CLS-safe; mobile breakpoints; consult `node_modules/next/dist/docs/` first —
   user explicitly queued this before the mobile audit).
6. **Tier 4** — mobile audit 390/768/1024 (Playwright; landing→auth→app pages; FIX autonomously,
   in background, while the user is away; last task).

## 6. NEW deep problems (user surfaced 2026-11-02, NOT yet decided — grill before building)

### 6.1 Resource↔skill relevance is beatable by name-similarity mapping
"Git handbook" (`res-swd-support-doc`) is fixtures-mapped to skill "Applications Support and
Enhancement" but teaches Git — "little/nothing to do with the skill". Generic umbrella skill
names ("Applications Development") invite thin mappings. **Goal (user): a suggested resource
must satisfy mostly/entirely the skill it feeds.**

Facts: `pickResource` (pathway/page.tsx) selects from
`RESOURCES.filter(careerId && skillsAddressed.includes(skill))` — the SUGGESTION ALGORITHM is
fine; the pool CONTENTS are the problem (`skillsAddressed` was authored by the 2026-10-30
fixture conversion of role-spec pools). 437 resources / 36 careers.
Candidate directions (decide with user): (a) data audit pass — re-map `skillsAddressed`
substance-first (career-×-skill rubric: does the resource's actual content cover the skill's
rowspec `what`?), possibly dropping non-satisfying rows ("declared-thin" convention exists);
(b) add a relevance field (e.g. `covers: [skill]` with explicit coverage bar) that decouples
"feeds" from "satisfies"; (c) author `pick` flags only where substance holds and let thin
skills show "resource gap — declared" (the honest-thin convention) instead of a weak link.

### 6.2 Resource→assessment payoff (user goal: study → expect the SAME concepts on the check)
`lib/fixtures/checks.ts` currently holds only TWO checks (`CHECKS = { "res-qa-testing", "res-python-basics" }`);
`getCheck(resourceId) ?? null` → all other resources have no platform check, so studying most
suggestions yields NOTHING on the assessment. Also the skill the check's questions test and the
skill the resource feeds must be the same skill, or the payoff breaks again.
Candidate directions: (a) align picks WITH checks: pickResource priority preferred for
resources that have a check keyed to their exact skill (join on skill name, not resource id);
(b) content project — author one check per career龍 skill (36×~8-10 = big-but-possible; question
bank per skill derived from the skill's rowpec `what`/subskills); (c) honest UI alternative —
mark which suggestions HAVE a check ("verified path" chip) vs "no check yet — the assess
assess battery won't test this resource"; (d) two-phase: phase 1 = join by skill so the canon
demo path is fully check-linked; phase 2 = authoring.

### 6.3 The three tabs render "similar content differently"
Ranked steps / Your gaps / Resources draw the same skill universe as three different table
designs. **Goal (user): one consistent design/structure across the three tabs.**
Existing register facts: steps = plan-table register; gaps = gap-table register (chips + bars);
resources = res-row grid (5 spans). Unification candidates: one shared row anatomy (icon-cell,
name(+what) cell, state chip cell, meta cell, action cell) parameterized per tab, or keep three
registers but normalize type scale/column order/empty states/action styles. Decide via mockups
(rounds with the user; visual work belongs to the impeccable/ui-ux flow).

## 7. User's working rhythm

Fix one item → user reviews UI → next; decisions asked via structured questions; every decision
recorded in the design doc; long/autonomous work → background streams only (Tier 4). Next session
picks up at: Tier 2c commit pending user review → §6 grilling round 1.

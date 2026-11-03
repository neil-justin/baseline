"use client";

import { useEffect, useRef, useState } from "react";
import TablePager from "@/components/TablePager";
import MockupMount, { type MockVariant } from "./mockup/MockupMount";

/** catalog facts for the canonical mockup builders (canon.ts): tier +
    sourceTag per map skill, projected once server-side */
export interface SpecLite {
  name: string;
  tier: "core" | "secondary";
  sourceTag: string;
}

/**
 * Pathway — MY PLAN, Tier 2d tab merge (user-ruled 2026-11-02, decisions
 * log §Tier 2d): Steps + Gaps collapse into ONE Plan tab — the surface is
 * two tabs, Plan | Resources, in the Careers lens-row register (segmented
 * toolbar OUTSIDE the cards, hash deep-links #plan/#resources; legacy
 * #steps/#gaps hashes read as #plan so old bookmarks land).
 *
 * Plan panel = ONE ranked table over the whole skill universe (the same
 * skill rendered twice in two shapes was the root of the inconsistency —
 * merge ruling): open rows keep the steps engine's ranked order, closed
 * rows append after, dimmed (.closed-row), paged as ONE table. Columns
 * Skill | Resource | State | Effect (user's own spec, grilling Q7): no
 * rank numerals, no Action column — ordering carries priority and the
 * resource title IS the affordance. State chips use the canonical
 * provenance wording (Q6): `Verified ·✓` / `Checked ·✓✓` /
 * `Self-reported`; open = empty bar, no chip; skills whose platform has
 * no check ride the honest `noCheck` line (§6.2). The ES strip is
 * REMOVED (user ruling 2026-11-02: a channel summary has no purpose on
 * Plan — those summaries live on Dashboard/Progress/Profile NACE).
 *
 * Resources panel = unchanged two-card stack (only the head word changes:
 * Feeds → Covers skills); `.r-start` stays (e2e hook). Pagination is whole
 * per dataset at PAGE_SIZE 10 with the `:has(+ .vpager)` closing hairline.
 *
 * e2e hooks after this change: `#panel-plan .lead-mono` (byte-exact
 * lead-mono counter), `#panel-plan .plan-row .q-skill` (`.plan-row` is the
 * stable row class, `.q-skill` name kept), `.plan-table`, `.r-start`,
 * `#panel-resources`. No entrance motion (DNA lock).
 */

/** the one suggested resource pointer per row (page.tsx pickResource) */
export interface Suggestion {
  title: string;
  cost: string;
  hrs: string;
  /** verified catalog URL — null → plain-text title */
  url: string | null;
}

/** ONE plan row = one career skill (merge ruling): open or closed. */
export interface PlanRow {
  skill: string;
  /** row expectation line: the skill's canon "what to expect to learn" */
  what: string;
  /** gaps-engine truth: bar absent = open */
  open: boolean;
  /** provenance kind (bar source; "open" when unclosed) */
  kind: "verified" | "checked" | "claimed" | "open";
  /** ·✓ transferred across a switch (gaps engine emits it for verified) */
  transferred: boolean;
  /** steps-engine SP projection for the row's ranked slot (open rows) */
  effect: { from: number; to: number } | null;
  /** closing provenance line for closed rows */
  provenance: string | null;
  /** the ONE suggested resource — null → honest no-resource line */
  suggestion: Suggestion | null;
  /** CHECK_SKILL join (lib/fixtures/checks.ts, read-only): the check the
   *  suggestion's platform maps to THIS skill */
  hasCheck: boolean;
  /** honest micro-line flag (§6.2): open row with no platform check */
  noCheck: boolean;
}

export interface PlanTab {
  /** closed bars over the map (engine count, never painted as a rank) */
  closed: number;
  mapSize: number;
  allClosed: boolean;
  /** all-cleared honest line (.stagewide); null otherwise */
  clearLine: string | null;
  /** open rows first (ranked order), closed rows append after — stable read */
  rows: PlanRow[];
}

export interface FeedCell {
  skill: string;
  /** the bar source when the skill is CLOSED on the student's map
   *  (null = still open) — the covers column chips ride ONLY on this real
   *  provenance (chips-only-where-honest ruling); null never chips */
  source: "verified" | "checked" | "claimed" | null;
}

export interface ResRow {
  /** resource id — the mockup's access audit + check-tiers key on it */
  id: string;
  title: string;
  provider: string;
  url: string | null;
  type: string;
  cost: string;
  time: string;
  feeds: FeedCell[];
  /** row expectation line (grilling Q7): first addressed skill's "what" */
  what: string | null;
  route: string | null;
  /** the one suggested resource for an open skill (grilling Q5) */
  suggested: boolean;
  startHere: boolean;
}

export interface ResourcesTab {
  rows: ResRow[];
  allClosed: boolean;
}

/* the pager's page size — 10 rows a page is a REAL data need: the merged
   plan table runs to 25-row maps and the resource catalog to 28-row lists
   (36-career roster); single-page tables stay pager-free (element budget) */
const PAGE_SIZE = 10;

function defaultElement() {
  return (
    <div className="defaultband">
      <p>Pick a career first — your pathway builds the moment you do.</p>
      <div className="n-cta">
        <a className="btn btn-primary" href="/career">
          Pick a career
        </a>
      </div>
    </div>
  );
}

export default function PathwayTabs({
  careerName,
  track,
  specs,
  undecided,
  plan,
  resources,
}: {
  careerName: string | null;
  track: string | null;
  specs: SpecLite[];
  undecided: boolean;
  plan: PlanTab;
  resources: ResourcesTab;
}) {
  const TABS = [
    { id: "plan", label: "Plan" },
    { id: "resources", label: "Resources" },
  ] as const;
  type TabId = (typeof TABS)[number]["id"];
  const isTab = (v: string): v is TabId => TABS.some((t) => t.id === v);

  /* the two instruments are TABS (ruling: Steps + Gaps IS one tab) —
     Careers' lens-row register: toolbar OUTSIDE the card */
  const [active, setActive] = useState<TabId>("plan");
  const [seq, setSeq] = useState(0); // >0 only after a user-initiated switch

  /* each paged table keeps its OWN page across tab switches — the state
     lives up here, outside the keyed tabpanels (a seq remount is the user's
     own tab click; it never re-pages). A career SWITCH re-seeds all
     tables, so the pagers land on page 1 (see the careerName effect). */
  const [planPage, setPlanPage] = useState(1);
  const [suggPage, setSuggPage] = useState(1);
  const [altPage, setAltPage] = useState(1);

  /* open tab from hash (default: plan). Legacy bookmarks (#steps / #gaps
     rode the pre-merge panels) read as #plan — one-line compat, panels
     never 404. */
  useEffect(() => {
    const initial = (window.location.hash || "").replace("#", "");
    const mapped = initial === "steps" || initial === "gaps" ? "plan" : initial;
    if (isTab(mapped)) setActive(mapped);
  }, []);

  /* the mockup mount (post-defense exploration, user-ruled 2026-11-03):
     #mockup / #mockup-b / #mockup-c summon the Mini-LMS design mockups;
     #plan / #resources restore the defended tabs. Presentation-only —
     the panels, engines, fixtures and e2e hooks stay untouched. */
  const [mockup, setMockup] = useState<MockVariant | null>(null);
  useEffect(() => {
    const parse = () => {
      const m = (window.location.hash || "").match(/^#mockup(?:-(b|c|d1|d2|d3))?$/);
      setMockup(m ? ((m[1] ?? "a") as MockVariant) : null);
    };
    parse();
    window.addEventListener("hashchange", parse);
    return () => window.removeEventListener("hashchange", parse);
  }, []);

  const selectTab = (id: TabId, user = true) => {
    setActive(id);
    if (user) setSeq((n) => n + 1);
    if (history.replaceState) history.replaceState(null, "", `#${id}`);
  };

  /* a career switch (router refresh feeds a new careerName) rebuilds the
     plan table and the catalog — all pagers land on page 1 */
  const careerRef = useRef(careerName);
  useEffect(() => {
    if (careerRef.current === careerName) return;
    careerRef.current = careerName;
    setPlanPage(1);
    setSuggPage(1);
    setAltPage(1);
  }, [careerName]);

  /* roving arrow-key focus on the toolbar tablist */
  const onTablistKey = (e: React.KeyboardEvent) => {
    const target = e.target as HTMLElement;
    const t = target.getAttribute("id")?.replace("tab-", "") ?? "";
    if (!isTab(t)) return;
    const i = TABS.findIndex((x) => x.id === t);
    let next: TabId | null = null;
    if (e.key === "ArrowRight") next = TABS[(i + 1) % TABS.length].id;
    if (e.key === "ArrowLeft") next = TABS[(i + TABS.length - 1) % TABS.length].id;
    if (next) {
      e.preventDefault();
      selectTab(next);
      document.getElementById(`tab-${next}`)?.focus();
    }
  };

  const tab = (id: TabId) => ({
    id: `tab-${id}`,
    "aria-controls": `panel-${id}`,
    role: "tab" as const,
    "aria-selected": active === id,
    tabIndex: active === id ? 0 : -1,
    onClick: () => selectTab(id),
  });

  /* the resource row renderer — shared by both cards (grilling Q8) */
  const resRowList = (list: ResRow[]) =>
    list.map((r) => (
      <div key={r.title} className="res-row">
        <span className="res-main">
          <span className="r-title">
            {r.url ? (
              <a href={r.url} target="_blank" rel="noopener noreferrer">
                {r.title}
                <span className="r-ext" aria-hidden="true">
                  ↗
                </span>
              </a>
            ) : (
              r.title
            )}
            {r.startHere ? <span className="r-start">Start here</span> : null}
          </span>
          {r.what ? <span className="row-what">{r.what}</span> : null}
          <span className="r-prov">{r.provider}</span>
        </span>
        <span className="res-type">{r.type}</span>
        <span className="res-cost">{r.cost}</span>
        <span className="res-time">{r.time}</span>
        <span className="res-feeds">
          {/* chips ride ONLY on real closed provenance (chips-only-where-honest ruling);
              plain name = still open. The old mid-row "✓✓ closed" glyph died: it painted
              the Checked glyph over quiz-verified closes and read as a single union fact. */}
          <span className="f-list">
            {r.feeds.map((f) =>
              f.source ? (
                <span className="f-item" key={f.skill}>
                  <span className="f-name">{f.skill}</span>
                  {closedChip(f.source)}
                </span>
              ) : (
                <span className="f-item" key={f.skill}>
                  <span className="f-name">{f.skill}</span>
                </span>
              )
            )}
          </span>
          {r.route ? <span className="r-route">{r.route}</span> : null}
        </span>
      </div>
    ));

  /* the Plan table's row renderer — the canonical provenance chip wording
     rides ONLY closed rows (Q6); open rows show an empty bar and the
     honest noCheck line (§6.2) beneath it */
  const closedChip = (kind: PlanRow["kind"]) =>
    kind === "verified" ? (
      <span className="chip c-green">Verified ·✓</span>
    ) : kind === "checked" ? (
      <span className="chip c-green">Checked ·✓✓</span>
    ) : (
      <span className="chip c-grey hatch-chip">Self-reported</span>
    );

  const planRow = (r: PlanRow) => (
    <tr key={r.skill} className={`plan-row${r.open ? "" : " closed-row"}`}>
      <td>
        <span className="q-skill p-skill">{r.skill}</span>
        {r.what ? <p className="row-what">{r.what}</p> : null}
      </td>
      <td className="ct-res">
        {r.open ? (
          r.suggestion ? (
            <span className="p-resline">
              {r.suggestion.url ? (
                <a
                  className="p-reslink"
                  href={r.suggestion.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {r.suggestion.title}
                  <span className="r-ext" aria-hidden="true">
                    ↗
                  </span>
                </a>
              ) : (
                <span className="p-restitle">{r.suggestion.title}</span>
              )}
              <span className="p-resmeta">
                {" "}
                · {r.suggestion.cost} · {r.suggestion.hrs}
              </span>
            </span>
          ) : (
            <span className="p-nores">No resource for this skill yet — ask your adviser.</span>
          )
        ) : (
          /* closed rows: the CLOSING resource is not carried by the data —
             provenance said once (State chip + Effect cell) per the Q7 spec;
             the duplicated provenance line died (wave-3 audit: the Resource
             and Effect cells carried the identical string) */
          <span className="p-dash">—</span>
        )}
      </td>
      <td className="ct-state">
        <div className="g-bar">
          <i
            className={r.kind === "claimed" ? "claim" : undefined}
            style={{ "--earn": r.open ? 0 : 1 } as React.CSSProperties}
          />
        </div>
        {!r.open ? closedChip(r.kind) : null}
        {r.open && r.noCheck ? <span className="no-check">No platform check yet</span> : null}
      </td>
      <td className="ct-eff">
        {r.open ? (
          r.suggestion ? (
            <span className="eff num">
              SP {r.effect!.from} → {r.effect!.to} · +{r.effect!.to - r.effect!.from}
            </span>
          ) : (
            <span className="p-dash">—</span>
          )
        ) : (
          <span className="eff-prov">
            {r.provenance}
            {r.transferred ? " · transferred" : null}
          </span>
        )}
      </td>
    </tr>
  );

  /* page slices — every pager number computes from the tables' own rows
     (never painted); undecided renders no tables, so the slices stay empty
     and pager-free there. The plan table pages the WHOLE dataset (merge
     ruling, Q8): open rows first (ranked order), closed rows dim after. */
  const planRows = undecided ? [] : plan.rows;
  const resRows = undecided ? [] : resources.rows;
  const planPageCount = Math.ceil(planRows.length / PAGE_SIZE);
  const planView = planRows.slice((planPage - 1) * PAGE_SIZE, planPage * PAGE_SIZE);
  /* the resources register (grilling Q5/Q8): ONE suggested resource per
     open skill rides the "Suggested for your gaps" card; everything else in
     the catalog (mapped-nonsuggested + not-mapped) rides "Full catalog
     alternates". */
  const suggestedSlice = resRows
    .filter((r) => r.suggested)
    .sort((a, b) => (a.startHere === b.startHere ? 0 : a.startHere ? -1 : 1));
  const alternateSlice = resRows
    .filter((r) => !r.suggested)
    .sort((a, b) => a.title.localeCompare(b.title));
  const suggestedPageCount = Math.ceil(suggestedSlice.length / PAGE_SIZE);
  const alternatePageCount = Math.ceil(alternateSlice.length / PAGE_SIZE);
  const suggestedView = suggestedSlice.slice((suggPage - 1) * PAGE_SIZE, suggPage * PAGE_SIZE);
  const alternateView = alternateSlice.slice((altPage - 1) * PAGE_SIZE, altPage * PAGE_SIZE);

  /* the toolbar's right kicker — the ACTIVE tab's computed counter. Plan
     has NONE: its lead-mono counter already carries the fact (and is
     spec-guarded — a second kicker would just duplicate it). */
  const activeKicker = undecided
    ? null
    : active === "resources"
      ? `${resRows.length} RESOURCES`
      : null;

  return (
    <div className="v7plan">
      {/* surface band: names the surface + the ranked path line, riding the
          shared recipe's .band (white). The grey-tray ruling (DESIGN.md:279)
          was user-revised to white on 2026-11-02 — see the design doc.
          Undecided: "My Plan" only, no desc. The .plan-lens toolbar below
          stays OUTSIDE the band. */}
      <section className="planband" aria-label="My Plan">
        <div className="band">
          <div className="bandrow">
            <div className="who">
              <h1 className="t">My Plan</h1>
              {careerName ? (
                <p className="m">For {careerName} — your next steps, ranked by what carries the most weight first.</p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* the mockup mount rides ABOVE the defended panels: the toolbar and
          the two tabpanels hold the engine/e2e surface and stay live the
          moment the hash leaves #mockup* */}
      {!undecided && mockup ? (
        <MockupMount
          careerName={careerName ?? ""}
          track={track}
          specs={specs}
          plan={plan}
          resources={resources}
          variant={mockup}
        />
      ) : null}

      {/* the lens-row toolbar OUTSIDE the card (Careers register):
          segmented tabs + the active tab's computed kicker */}
      {!undecided && !mockup ? (
        <div className="plan-lens">
          <div className="ptabs" role="tablist" aria-label="My Plan sections" onKeyDown={onTablistKey}>
            {TABS.map((t) => (
              <button key={t.id} type="button" {...tab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
          {activeKicker ? <span className="kicker num">{activeKicker}</span> : null}
        </div>
      ) : null}

      {/* the panels — Plan is ONE card holding the whole skill universe;
          the Resources tab is a two-card stack */}
      {undecided && !mockup ? (
        <section
          className="card tabpanel"
          id="panel-plan"
          role="tabpanel"
          aria-labelledby="tab-plan"
        >
          {defaultElement()}
        </section>
      ) : !mockup ? (
        <section
          key={`plan-${seq}`}
          className="card tabpanel"
          id="panel-plan"
          role="tabpanel"
          aria-labelledby="tab-plan"
          hidden={active !== "plan"}
        >
          <section className="panel-sec planpanel">
            <div className="head">
              {/* head register: named h2 + the lead-mono counter (spec
                  guard — `.lead-mono` stays byte-exact for the e2e read) */}
              <h2>Plan</h2>
              <span className="lead-mono num">
                <b>{plan.closed}</b> of {plan.mapSize} skills checked
              </span>
            </div>

            {/* the stagewide treatment for the all-cleared state rides the
                head; the table below still shows the closed rows (queue
                truth: closed is not hidden — it is dimmed in the table) */}
            {plan.clearLine ? <p className="stagewide">{plan.clearLine}</p> : null}

            {/* THE merged table (Q7): Skill | Resource | State | Effect.
                Open rows keep the steps engine's ranked order; closed rows
                append after, dimmed (.closed-row). Whole-table pager (Q8). */}
            <table className="plan-table">
              <thead>
                <tr>
                  <th>Skill</th>
                  <th className="ct-res">Resource</th>
                  <th className="ct-state">State</th>
                  <th className="ct-eff">Effect</th>
                </tr>
              </thead>
              <tbody>
                {planView.map(planRow)}
              </tbody>
            </table>
            {planPageCount > 1 ? (
              <TablePager
                showingFrom={(planPage - 1) * PAGE_SIZE + 1}
                showingTo={Math.min(planPage * PAGE_SIZE, planRows.length)}
                total={planRows.length}
                page={planPage}
                pageCount={planPageCount}
                onPage={setPlanPage}
              />
            ) : null}
          </section>
        </section>
      ) : null}

      {/* tab 2 · Resources — the typed catalog with the Start-here chip,
          as TWO SEPARATE CARDS (user ruling 2026-11-02: the groups read
          better apart than stacked in one card); only the head word
          changed this wave: Feeds → Covers skills */}
      {mockup ? null : (
      <div
        key={`resources-${seq}`}
        className="tabpanel-stack"
        id="panel-resources"
        role="tabpanel"
        aria-labelledby="tab-resources"
        hidden={active !== "resources"}
      >
        <section className="card rescard">
          <div className="head">
            <h2>Suggested for your gaps</h2>
            <span className="label num">{suggestedSlice.length} SUGGESTED</span>
          </div>
          {suggestedSlice.length > 0 ? (
            <>
              <div className="res-table">
                <div className="res-row res-heads" aria-hidden="true">
                  <span className="res-main">Resource</span>
                  <span className="res-type">Type</span>
                  <span className="res-cost">Cost</span>
                  <span className="res-time">Time</span>
                  <span className="res-feeds">Covers skills</span>
                </div>
                {resRowList(suggestedView)}
              </div>
              {suggestedPageCount > 1 ? (
                <TablePager
                  showingFrom={(suggPage - 1) * PAGE_SIZE + 1}
                  showingTo={Math.min(suggPage * PAGE_SIZE, suggestedSlice.length)}
                  total={suggestedSlice.length}
                  page={suggPage}
                  pageCount={suggestedPageCount}
                  onPage={setSuggPage}
                />
              ) : null}
            </>
          ) : (
            <p className="stagewide">Nothing suggested yet — your open gaps have no mapped resource.</p>
          )}
        </section>
        <section className="card rescard">
          <div className="head">
            <h2>Full catalog alternates</h2>
            <span className="label num">{alternateSlice.length} ALTERNATES</span>
          </div>
          {alternateSlice.length > 0 ? (
            <div className="res-table">
              <div className="res-row res-heads" aria-hidden="true">
                <span className="res-main">Resource</span>
                <span className="res-type">Type</span>
                <span className="res-cost">Cost</span>
                <span className="res-time">Time</span>
                <span className="res-feeds">Covers skills</span>
              </div>
              {resRowList(alternateView)}
            </div>
          ) : (
            <p className="stagewide">No alternates — the suggested list covers this role's catalog.</p>
          )}
          {alternateSlice.length > 0 && alternatePageCount > 1 ? (
            <TablePager
              showingFrom={(altPage - 1) * PAGE_SIZE + 1}
              showingTo={Math.min(altPage * PAGE_SIZE, alternateSlice.length)}
              total={alternateSlice.length}
              page={altPage}
              pageCount={alternatePageCount}
              onPage={setAltPage}
            />
          ) : null}
        </section>
      </div>
      )}
    </div>
  );
}

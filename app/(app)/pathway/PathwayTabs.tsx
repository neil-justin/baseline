"use client";

import { useEffect, useRef, useState } from "react";
import TablePager from "@/components/TablePager";

/**
 * Pathway — MY PLAN, v7.3 tab re-cut (user rulings 2026-11-02 evening):
 * the band slims to h1 + the one ranked-path line (the stage strip DIES —
 * its counts ride the toolbar), and the three instruments are TABS again,
 * in the CAREERS lens-row register the user ruled for that surface: a
 * segmented toolbar OUTSIDE the content card (queued tablist, hash
 * deep-links #steps/#gaps/#resources restored) + the active tab's computed
 * kicker at the toolbar's right; ONE white card below swaps the panels.
 * All three tables share the dashboard's dense grammar (tracked heads,
 * 10px rows, grey-wash hover, chips/bars). "Start" / "Find resources →"
 * switch to the Resources tab, page the catalog to the mapped row FIRST
 * (the anchor is never behind an invisible page), then scroll it into view
 * instantly (no smooth motion — DNA lock). Copy floor: one caption per
 * panel max; lead-mono lines are counters only. e2e hooks stay verbatim:
 * `#panel-steps .lead-mono`, `.stagepanel .qrow .q-skill`, `.plan-table`,
 * `.r-start`, `#stage2`. No entrance motion.
 */
export interface QRow {
  rank: number;
  skill: string;
  /** row expectation line (grilling Q7): the skill's student-facing "what it
   *  means" — what closing this step teaches */
  what: string;
  /** resource pointer (first per skill) — null → no-resource default cell */
  res: { title: string; cost: string; hrs: string } | null;
  why: string;
  primary: boolean;
  /** computed SP projection for this row (lib/engines/score.ts convention) */
  effect: { from: number; to: number };
}

export interface XRow {
  rank: number;
  skill: string;
  what: string;
  /** queued resource title for the anchored jump — null → adviser note */
  resTitle: string | null;
  effect: { from: number; to: number };
}

export interface StageBandCell {
  num: string;
  name: string;
  count: string;
  now: boolean;
}

export interface StepsTab {
  closed: number;
  mapSize: number;
  done: number;
  band: StageBandCell[];
  bandLabel: string;
  allClosed: boolean;
  /** stage-① header sub-line (reassurance register at the zero mark) */
  sub: string;
  /** all-closed honest line (replaces ranked rows; null otherwise) */
  clearLine: string | null;
  queue: QRow[];
  qfoot: string;
  remain: XRow[];
  /** collapsed stage-② count text when nothing is waiting */
  catchUp: string | null;
  /** stage-③ peek line (null when the route declares none) */
  peek: string | null;
}

export interface GapRow {
  name: string;
  what: string;
  kind: "verified" | "checked" | "claimed" | "open";
  transferred: boolean;
  openWithRes: boolean;
  /** open row's resource title — powers the anchored jump (null = none) */
  resTitle: string | null;
}

export interface GapsTab {
  careerName: string;
  closed: number;
  mapSize: number;
  openCount: number;
  rows: GapRow[];
  allClosed: boolean;
  /** ES honest strip — engine-fed ("17 of 30 · 4 of 7 NACE competencies verified ·✓") */
  esLine?: string;
  /** ES earned fraction, 0–1 (absent when unmeasured) */
  esEarn?: number;
}

export interface FeedCell {
  skill: string;
  closed: boolean;
}

export interface ResRow {
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
  careerName: string;
  rows: ResRow[];
  allClosed: boolean;
  counts: { suggested: number; alternates: number };
}

/* the pager's page size — 10 rows a page is a REAL data need: the gaps
   ledger runs to 25-row maps and the resource catalog to 28-row lists
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
  undecided,
  steps,
  gaps,
  resources,
}: {
  careerName: string | null;
  undecided: boolean;
  steps: StepsTab;
  gaps: GapsTab;
  resources: ResourcesTab;
}) {
  const TABS = [
    { id: "steps", label: "Ranked steps" },
    { id: "gaps", label: "Your gaps" },
    { id: "resources", label: "Resources" },
  ] as const;
  type TabId = (typeof TABS)[number]["id"];
  const isTab = (v: string): v is TabId => TABS.some((t) => t.id === v);

  /* the three instruments are TABS again (ruling: no scroll to reach
     Resources) — Careers' lens-row register: toolbar OUTSIDE the card */
  const [active, setActive] = useState<TabId>("steps");
  const [seq, setSeq] = useState(0); // >0 only after a user-initiated switch

  const [anchor, setAnchor] = useState<string | null>(null);
  /* each paged table keeps its OWN page across tab switches — the state
     lives up here, outside the keyed tabpanels (a seq remount is the user's
     own tab click; it never re-pages). A career SWITCH re-seeds both
     tables, so both pagers land on page 1 (see the careerName effect). */
  const [gapPage, setGapPage] = useState(1);
  const [suggPage, setSuggPage] = useState(1);
  const [altPage, setAltPage] = useState(1);
  const [closedOpen, setClosedOpen] = useState(false);

  /* open tab from hash (default: ranked steps — beat 8 opens here) */
  useEffect(() => {
    const initial = (window.location.hash || "").replace("#", "");
    if (isTab(initial)) setActive(initial);
  }, []);

  const selectTab = (id: TabId, user = true) => {
    setActive(id);
    if (user) setSeq((n) => n + 1);
    if (user) setAnchor(null); // a direct tab click clears a stale anchor
    if (history.replaceState) history.replaceState(null, "", `#${id}`);
  };

  /* a career switch (router refresh feeds a new careerName) rebuilds the
     ledger and the catalog — all pagers land on page 1 */
  const careerRef = useRef(careerName);
  useEffect(() => {
    if (careerRef.current === careerName) return;
    careerRef.current = careerName;
    setGapPage(1);
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

  /* a Start/Find-resources CTA lands ON the Resources tab and pages the
     catalog to the mapped row first (same batch); the row then scrolls
     into view once that commit paints — instant, never smooth (DNA lock) */
  useEffect(() => {
    if (active !== "resources" || !anchor) return;
    const frame = requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>('.res-row[data-anchor="true"]')
        ?.scrollIntoView({ block: "center" });
    });
    return () => cancelAnimationFrame(frame);
  }, [active, anchor, seq]);

  const gotoResource = (resTitle?: string) => {
    setActive("resources");
    setSeq((n) => n + 1);
    setAnchor(resTitle ?? null);
    /* the catalog is GROUPED and PAGED: land the anchored row ON its
       group's page first, then the anchor effect scrolls it into view */
    if (resTitle) {
      const inSuggested = suggestedSlice.findIndex((r) => r.title === resTitle);
      const inAlternates = alternateSlice.findIndex((r) => r.title === resTitle);
      if (inSuggested >= 0) setSuggPage(Math.floor(inSuggested / PAGE_SIZE) + 1);
      else if (inAlternates >= 0) setAltPage(Math.floor(inAlternates / PAGE_SIZE) + 1);
      if (history.replaceState) history.replaceState(null, "", "#resources");
    }
  };

  /* one ledger row — shared by the Open gaps table and the collapsed
     Closed-bars group */
  const gapRow = (row: GapRow) => (
    <tr key={row.name} className="g-row">
      <td>
        <div className="g-name">{row.name}</div>
        {row.what ? <p className="row-what">{row.what}</p> : null}
        <div className="g-status num">
          {row.kind === "verified" ? (
            <>
              Closed · <span className="ok">✓ verified quiz</span>
              {row.transferred ? <span> · transferred</span> : null}
            </>
          ) : null}
          {row.kind === "checked" ? (
            <>
              Closed · <span className="ok">✓✓ checked resource</span>
            </>
          ) : null}
          {row.kind === "claimed" ? (
            <>
              Closed · <span className="unverified">self-reported</span>
            </>
          ) : null}
          {row.kind === "open" ? (
            row.openWithRes ? (
              <>
                Open ·{" "}
                <button
                  className="g-link"
                  type="button"
                  aria-label={`Find resources · ${row.name}`}
                  onClick={() => gotoResource(row.resTitle ?? undefined)}
                >
                  Find resources →
                </button>
              </>
            ) : (
              <span className="unverified">No resource yet — ask your adviser.</span>
            )
          ) : null}
        </div>
      </td>
      <td className="ct-state">
        {row.kind === "verified" ? <span className="chip c-green">Verified</span> : null}
        {row.kind === "checked" ? <span className="chip c-green">Checked</span> : null}
        {row.kind === "claimed" ? <span className="chip c-grey hatch-chip">Self-report</span> : null}
        {row.kind === "open" ? <span className="chip c-grey">Open</span> : null}
      </td>
      <td className="ct-bar">
        <div className="g-bar">
          <i
            className={row.kind === "claimed" ? "claim" : undefined}
            style={{ "--earn": row.kind === "open" ? 0 : 1 } as React.CSSProperties}
          />
        </div>
      </td>
    </tr>
  );

  /* the resource row renderer — shared by both cards (grilling Q8) */
  const resRowList = (list: ResRow[]) =>
    list.map((r) => (
      <div
        key={r.title}
        className={`res-row${anchor === r.title ? " anchored" : ""}`}
        data-anchor={anchor === r.title ? "true" : undefined}
      >
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
          {r.feeds.map((f) => f.skill).join(" · ")}
          {r.feeds.some((f) => f.closed) ? <span className="ok"> — ✓✓ closed</span> : null}
          {r.route ? <span className="r-route">{r.route}</span> : null}
        </span>
      </div>
    ));

  /* page slices — every pager number computes from the tables' own rows
     (never painted); undecided renders no tables, so the slices stay empty
     and pager-free there. The gap ledger GROUPS (open first — that's the
     actionable half; the closed bars collapse) and the resource catalog
     GROUPS (mapped-to-open-gaps first) — pager on the open group only. */
  const gapRows = undecided ? [] : gaps.rows;
  const resRows = undecided ? [] : resources.rows;
  const gapOpenRows = gapRows.filter((r) => r.kind === "open");
  const gapClosedRows = gapRows.filter((r) => r.kind !== "open");
  const gapOpenPageCount = Math.ceil(gapOpenRows.length / PAGE_SIZE);
  const gapOpenSlice = gapOpenRows.slice((gapPage - 1) * PAGE_SIZE, gapPage * PAGE_SIZE);
  /* the resources register (grilling Q5/Q8): ONE suggested resource per
     open skill rides the "Suggested for your gaps" card; everything else in
     the catalog (mapped-nonsuggested + not-mapped) rides "Full catalog
     alternates". The old mapped/counted split is superseded. */
  const suggestedSlice = resRows
    .filter((r) => r.suggested)
    .sort((a, b) => (a.startHere === b.startHere ? 0 : a.startHere ? -1 : 1));
  const alternateSlice = resRows
    .filter((r) => !r.suggested)
    .sort((a, b) => a.title.localeCompare(b.title));
  /* per-group pagination — each card pages its own table (10 rows a page,
     the family's real-data page size) */
  const suggestedPageCount = Math.ceil(suggestedSlice.length / PAGE_SIZE);
  const alternatePageCount = Math.ceil(alternateSlice.length / PAGE_SIZE);
  const suggestedView = suggestedSlice.slice((suggPage - 1) * PAGE_SIZE, suggPage * PAGE_SIZE);
  const alternateView = alternateSlice.slice((altPage - 1) * PAGE_SIZE, altPage * PAGE_SIZE);
  const claimedClosed = gapClosedRows.filter((r) => r.kind === "claimed").length;

  /* the toolbar's right kicker — the ACTIVE tab's computed counter. Steps
     has NONE: its lead-mono counter line already carries both facts (and
     is spec-guarded — a second kicker would just duplicate it). */
  const activeKicker = undecided
    ? null
    : active === "steps"
      ? null
      : active === "gaps"
        ? `${gaps.openCount} OPEN`
        : `${resRows.length} RESOURCES`;

  return (
    <div className="v7plan">
      {/* slim grey tray band: names the surface + the ranked path line.
          Undecided: "My Plan" only, no desc. */}
      <section className="planband" aria-label="My Plan">
        <div className="band">
          <div className="bandrow">
            <div className="who">
              <h1 className="t">My Plan</h1>
              {careerName ? (
                <p className="m">For {careerName} — next steps, ranked by what carries the most weight first.</p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* the lens-row toolbar OUTSIDE the card (Careers register):
          segmented tabs + the active tab's computed kicker */}
      {!undecided ? (
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

      {/* the panels — each tab is its own card (the Resources tab is a
          two-card stack); the tabcard shell died: it nested cards inside a
          card, which is exactly the forced merge the user ruled out */}
          {undecided ? (
            <section
              className="card tabpanel"
              id="panel-steps"
              role="tabpanel"
              aria-labelledby="tab-steps"
            >
              {defaultElement()}
            </section>
          ) : (
            <section
              key={`steps-${seq}`}
              className="card tabpanel"
              id="panel-steps"
              role="tabpanel"
              aria-labelledby="tab-steps"
              hidden={active !== "steps"}
            >
              <section className="panel-sec stagepanel">
                <div className="head">
                  {/* head register (grilling Q1): named h2 + the counter as
                      its num sub-line — same register the gaps/resource
                      cards use (the counter-as-title register retired) */}
                  <h2>Ranked steps</h2>
                  <span className="lead-mono num">
                    <b>{steps.closed}</b> of {steps.mapSize} skills checked <span className="sep">·</span> First 30
                    days: <b>{steps.done}</b> of {steps.done + steps.queue.length} done
                  </span>
                </div>

                {steps.clearLine ? (
                  <p className="stagewide">{steps.clearLine}</p>
                ) : (
                  /* ONE ranked table (user ruling 2026-11-02: the merged
                     register — no stage digits, no accordion; the old
                     ①②③ grouping is superseded; state chips + resource
                     rows carry the distinction the groups used to):
                     First-day rows (Next/Queued, resource + Start) and
                     waiting rows (Waiting, map-or-find, Find resources)
                     share the Step | Resource | State | Effect | Action
                     columns */
                  <table className="plan-table">
                    <thead>
                      <tr>
                        <th>Step</th>
                        <th className="ct-res">Resource</th>
                        <th className="ct-state">State</th>
                        <th className="ct-eff">Effect</th>
                        <th className="ct-act">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {steps.queue.map((r) => {
                        const res = r.res;
                        return (
                          <tr key={r.skill} className="qrow">
                            <td>
                              <div className="item">
                                <span className="rank num" aria-hidden="true">
                                  {r.rank}
                                </span>
                                <div>
                                  <span className="q-skill">{r.skill}</span>
                                  {r.what ? <p className="row-what">{r.what}</p> : null}
                                </div>
                              </div>
                            </td>
                            <td className="ct-res">
                              {res ? (
                                <span className="q-res">
                                  <b>{res.title}</b> — {res.cost} · {res.hrs}
                                </span>
                              ) : (
                                <span className="q-nogap">Not mapped yet — ask your adviser.</span>
                              )}
                            </td>
                            <td className="ct-state">
                              {r.primary ? <span className="chip c-blue">Next</span> : <span className="chip c-grey">Queued</span>}
                            </td>
                            <td className="eff num">
                              SP {r.effect.from} → {r.effect.to} · +{r.effect.to - r.effect.from}
                            </td>
                            <td className="ct-act">
                              {res ? (
                                <button
                                  className={`btn ${r.primary ? "btn-primary" : "btn-ghost"}`}
                                  type="button"
                                  aria-label={`Start · ${r.skill}`}
                                  onClick={() => gotoResource(res.title)}
                                >
                                  Start
                                </button>
                              ) : null}
                            </td>
                          </tr>
                        );
                      })}
                      {steps.remain.map((x) => {
                        return (
                          <tr key={x.skill} className="qrow xrow">
                            <td>
                              <div className="item">
                                <span className="rank num" aria-hidden="true">
                                  {x.rank}
                                </span>
                                <div>
                                  <span className="q-skill">{x.skill}</span>
                                  {x.what ? <p className="row-what">{x.what}</p> : null}
                                </div>
                              </div>
                            </td>
                            <td className="ct-res">
                              {x.resTitle ? (
                                <span className="q-res">
                                  <b>{x.resTitle}</b>
                                </span>
                              ) : (
                                <span className="q-nogap">Not mapped yet — ask your adviser.</span>
                              )}
                            </td>
                            <td className="ct-state">
                              <span className="chip c-grey">Waiting</span>
                            </td>
                            <td className="eff num">
                              SP {x.effect.from} → {x.effect.to} · +{x.effect.to - x.effect.from}
                            </td>
                            <td className="ct-act">
                              {x.resTitle ? (
                                <button
                                  className="g-link"
                                  type="button"
                                  aria-label={`Find resources · ${x.skill}`}
                                  onClick={() => gotoResource(x.resTitle ?? "")}
                                >
                                  Find resources →
                                </button>
                              ) : null}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}

                {/* the one-line stage endnote — waiting count DEDUPED
                    (user ruling 2026-11-02: the group header carried it);
                    only the check-off note + entry-ready stay */}
                <p className="stagefoot num">
                  {steps.remain.length > 0 ? (
                    <>Entry-ready: <b>2 milestones</b></>
                  ) : (
                    <>Caught up — clear a First 30 days step and the next skill moves up. Entry-ready: <b>2 milestones</b></>
                  )}
                </p>
              </section>
            </section>
          )}

          {/* tab 2 · Your gaps — its own card (peer of steps, not nested) */}
          <section
            key={`gaps-${seq}`}
            className="card tabpanel"
            id="panel-gaps"
            role="tabpanel"
            aria-labelledby="tab-gaps"
            hidden={active !== "gaps"}
          >
            {/* the ledger GROUPED (user ruling: a naked skill list reads as
                noise) — open gaps actionable-first (paged), closed bars
                collapse into a one-row group; the per-row badge already
                carries the evidence distinction, so no legend */}
            <section className="panel-sec ledger">
              <div className="head">
                <h2>Open gaps</h2>
              </div>
              {gapOpenRows.length === 0 ? (
                <p className="stagewide">Every bar is closed — your First 30 days queue and the closed list below have it all.</p>
              ) : (
                <table className="gap-table">
                  <thead>
                    <tr>
                      <th>Skill</th>
                      <th className="ct-state">State</th>
                      <th className="ct-bar">Evidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gapOpenSlice.map(gapRow)}
                  </tbody>
                </table>
              )}
              {gapOpenPageCount > 1 ? (
                <TablePager
                  showingFrom={(gapPage - 1) * PAGE_SIZE + 1}
                  showingTo={Math.min(gapPage * PAGE_SIZE, gapOpenRows.length)}
                  total={gapOpenRows.length}
                  page={gapPage}
                  pageCount={gapOpenPageCount}
                  onPage={setGapPage}
                />
              ) : null}
            </section>

            {/* zero-row groups lose the furniture (grilling Q2): a plain
                one-liner renders instead of an expandable + column heads */}
            <section className="panel-sec closedgrp">
              {gapClosedRows.length === 0 ? (
                <p className="stagewide">Closed bars — nothing closed yet. Checks and verifications close these as you go.</p>
              ) : (
                <>
                  <button
                    className="stage-rowbtn"
                    type="button"
                    aria-expanded={closedOpen}
                    aria-controls="gaps-closed"
                    onClick={() => setClosedOpen((o) => !o)}
                  >
                    <span className="sr-name">Closed bars</span>
                    <span className="sr-count num">
                      {gapClosedRows.length} closed{claimedClosed > 0 ? ` · ${claimedClosed} still self-reported` : ""}
                    </span>
                    <span className="chev" aria-hidden="true" />
                  </button>
                  {closedOpen ? (
                    <div className="stage-expand" id="gaps-closed">
                      <table className="gap-table">
                        <thead>
                          <tr>
                            <th>Skill</th>
                            <th className="ct-state">State</th>
                            <th className="ct-bar">Evidence</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gapClosedRows.map(gapRow)}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                </>
              )}
            </section>

            {/* honest competency strip (ES — the step-③ assessment carries it) */}
            <section className="panel-sec softpanel">
              <div className="g-row es-row">
                <div>
                  <div className="g-name">Employability skills</div>
                  {gaps.esLine ? <div className="g-status num">{gaps.esLine}</div> : null}
                </div>
                <div className="es-state">
                  {gaps.esLine ? (
                    <span className="chip c-blue">In progress</span>
                  ) : (
                    <span className="chip c-grey">Not yet measured</span>
                  )}
                </div>
                <div className="ct-bar">
                  <div className="g-bar">
                    <i style={{ "--earn": gaps.esEarn ?? 0 } as React.CSSProperties} />
                  </div>
                </div>
              </div>
            </section>

            {gaps.allClosed ? (
              <p className="gap-cta"><span className="gap-allclosed">✓ everything closed.</span></p>
            ) : null}
          </section>

          {/* tab 3 · Resources — the typed catalog with per-row start anchors,
              as TWO SEPARATE CARDS (user ruling 2026-11-02: the groups read
              better apart than stacked in one card) */}
          <div
            key={`resources-${seq}`}
            className="tabpanel-stack"
            id="panel-resources"
            role="tabpanel"
            aria-labelledby="tab-resources"
            hidden={active !== "resources"}
          >
            {/* the resources register (grilling Q5/Q8): the ONE suggested
                resource per open gap first, then the FULL catalog
                alternates. Zero-row groups collapse to one honest line
                (no furniture). The anchor effect lands the row in view. */}
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
                      <span className="res-feeds">Feeds</span>
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
                    <span className="res-feeds">Feeds</span>
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
    </div>
  );
}

"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/* useLayoutEffect runs before paint on the client (no shift on first
   hydration) but React warns during SSR — pick per environment. */
const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Pathway tabs — MY PLAN re-cut to the dashboard DNA (v7.1, 2026-10-29):
 * a header band naming the surface ("My Plan") carries the tab strip and
 * the stage counters (drawn-circle numerals, current stage = chip + ink
 * emphasis, never a filled cell); the ranked First-30-days queue renders
 * as the family's dense plan table (STEP / RESOURCE / STATE / EFFECT /
 * ACTION heads, wash chips, computed SP effects); gaps re-break into
 * cells/column-heads with wash chips; the resources catalog keeps the
 * typed table and honors per-row start anchors. Content strings, e2e
 * hooks and roles stay verbatim; no entrance motion (DNA lock).
 */

export interface QRow {
  rank: number;
  skill: string;
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
  h1: string;
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
  kind: "verified" | "checked" | "claimed" | "open";
  transferred: boolean;
  openWithRes: boolean;
  /** open row's resource title — powers the anchored jump (null = none) */
  resTitle: string | null;
}

export interface GapsTab {
  h1: string;
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
  route: string | null;
  startHere: boolean;
}

export interface ResourcesTab {
  h1: string;
  careerName: string;
  rows: ResRow[];
  allClosed: boolean;
}

const TABS = [
  { id: "gaps", label: "Your gaps" },
  { id: "steps", label: "Ranked steps" },
  { id: "resources", label: "Resources" },
] as const;
type TabId = (typeof TABS)[number]["id"];
const isTab = (v: string): v is TabId => TABS.some((t) => t.id === v);

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

function stageChip(c: StageBandCell) {
  return c.now ? (
    <span className="chip c-blue">Current</span>
  ) : null;
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
  const [active, setActive] = useState<TabId>("steps");
  const [seq, setSeq] = useState(0); // >0 only after a user-initiated switch
  const [s2open, setS2open] = useState(false);
  const [anchor, setAnchor] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);

  /* CLS guard — panels differ in height, which used to push the footer on
     every switch. Reserve the tallest panel's height on the wrapper so the
     page height stays constant across tabs. Hidden panels are flashed
     (visibility:hidden, pre-paint) to measure them. */
  const equalizePanels = () => {
    const wrap = panelsRef.current;
    if (!wrap) return;
    let max = 0;
    for (const p of Array.from(
      wrap.querySelectorAll<HTMLElement>(".tabpanel")
    )) {
      const wasHidden = p.hidden;
      if (wasHidden) {
        p.hidden = false;
        p.style.visibility = "hidden";
      }
      max = Math.max(max, p.offsetHeight);
      if (wasHidden) {
        p.hidden = true;
        p.style.visibility = "";
      }
    }
    wrap.style.minHeight = max > 0 ? `${max}px` : "";
  };

  /* re-run on every render: covers tab switches, accordion toggles, and
     fresh server data */
  useIsoLayoutEffect(equalizePanels);

  useEffect(() => {
    let raf = 0;
    const remeasure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(equalizePanels);
    };
    window.addEventListener("resize", remeasure);
    document.fonts?.ready.then(remeasure).catch(() => {});
    return () => {
      window.removeEventListener("resize", remeasure);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const goto = (id: TabId, resTitle?: string) => {
    setActive(id);
    setSeq((n) => n + 1);
    setAnchor(resTitle ?? null);
    if (history.replaceState) history.replaceState(null, "", `#${id}`);
  };

  const allGoto = (id: TabId, resTitle?: string) => goto(id, resTitle);

  /* tab panel: v7 state language only — no entrance motion (DNA lock) */

  const tab = (id: TabId) => ({
    id: `tab-${id}`,
    "aria-controls": `panel-${id}`,
    role: "tab" as const,
    "aria-selected": active === id,
    tabIndex: active === id ? 0 : -1,
    onClick: () => selectTab(id),
  });

  /* arrow-key roving focus on the tablist */
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

  /* a Start/Find-resources CTA lands on Resources with the mapped resource
     anchored-in-nothing: the row is marked, then scrolled into view the
     moment the tab commits (instant — no entrance motion). */
  useEffect(() => {
    if (active !== "resources" || !anchor) return;
    const frame = requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>('.res-row[data-anchor="true"]')
        ?.scrollIntoView({ block: "center" });
    });
    return () => cancelAnimationFrame(frame);
  }, [active, anchor, seq]);

  const stageBand = steps.band?.length ? (
    <div className="stageband" role="img" aria-label={steps.bandLabel}>
      {steps.band.map((c) => (
        <div key={c.num} className={`stagecell${c.now ? " now" : ""}`}>
          <span className="s-num num" aria-hidden="true">
            {c.num}
          </span>
          <span className="s-txt">
            <span className="s-name">
              {c.name}
              {stageChip(c)}
            </span>
            <span className="s-count num">{c.count}</span>
          </span>
        </div>
      ))}
    </div>
  ) : null;

  return (
    <div className="v7plan" ref={rootRef}>
      {/* header band — names the surface, carries the tabs + stage counters */}
      <section className="planband" aria-label="My Plan">
        <div className="band">
          <div className="headrow">
            <div className="who">
              <h1 className="t">My Plan</h1>
              {careerName ? <div className="m">For {careerName}</div> : null}
            </div>
            <div className="ptabs" role="tablist" aria-label="Pathway sections" onKeyDown={onTablistKey}>
              {TABS.map((t) => (
                <button key={t.id} type="button" {...tab(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          {stageBand}
        </div>
      </section>

      <div className="tabpanels" ref={panelsRef}>
      {undecided ? (
        <section className="tabpanel" id="panel-steps" role="tabpanel" aria-labelledby="tab-steps" hidden={active !== "steps"}>
          {defaultElement()}
        </section>
      ) : null}

      {/* ══════════════ TAB · RANKED STEPS (default, beat 8) ══════════════ */}
      {!undecided ? (
        <section
          key={`steps-${seq}`}
          className="tabpanel"
          id="panel-steps"
          role="tabpanel"
          aria-labelledby="tab-steps"
          hidden={active !== "steps"}
        >
          <h2 className="ptitle">{steps.h1}</h2>
          <p className="lead-mono num">
            <b>{steps.closed}</b> of {steps.mapSize} skills checked <span className="sep">·</span> First 30
            days: <b>{steps.done}</b> of {steps.done + steps.queue.length} done
          </p>

          <div className="card stagepanel">
            <div className="head">
              <b>First 30 days</b>
              <span>{steps.sub}</span>
              {!steps.allClosed ? (
                <span className="label num">
                  {steps.done} OF {steps.done + steps.queue.length} DONE
                </span>
              ) : null}
            </div>

            {steps.clearLine ? (
              <p className="stagewide">{steps.clearLine}</p>
            ) : (
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
                            <span className="q-skill">{r.skill}</span>
                          </div>
                          <p className="q-why">{r.why}</p>
                        </td>
                        <td className="ct-res">
                          {res ? (
                            <span className="q-res">
                              <b>{res.title}</b> — {res.cost} · {res.hrs}
                            </span>
                          ) : (
                            <span className="q-nogap">No resource cataloged for this yet — your adviser can suggest one.</span>
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
                              onClick={() => goto("resources", res.title)}
                            >
                              Start
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {!steps.clearLine ? <div className="foot">{steps.qfoot}</div> : null}
          </div>

          {/* stage ② accordion + stage ③ — one ending card, the peek line closes it */}
          <div className="card stages">
            {steps.remain.length > 0 ? (
              <button
                className="stage-rowbtn"
                type="button"
                aria-expanded={s2open}
                aria-controls="stage2"
                onClick={() => setS2open((o) => !o)}
              >
                <span className="s-num num" aria-hidden="true">
                  2
                </span>
                <span className="sr-name">Next steps</span>
                <span className="sr-count num">{steps.remain.length} more skills waiting</span>
                <span className="chev" aria-hidden="true" />
              </button>
            ) : (
              <div className="stage-static">
                <span className="s-num num" aria-hidden="true">
                  2
                </span>
                <span className="sr-name">Next steps</span>
                <span className="sr-count num">{steps.catchUp ?? "0 waiting"}</span>
              </div>
            )}
            {steps.remain.length > 0 && s2open ? (
              <div className="stage-expand" id="stage2">
                <table className="plan-table">
                  <thead>
                    <tr>
                      <th>Step</th>
                      <th className="ct-state">State</th>
                      <th className="ct-eff">Effect</th>
                      <th className="ct-act">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {steps.remain.map((x) => {
                      const resTitle = x.resTitle;
                      return (
                        <tr key={x.skill} className="xrow">
                          <td>
                            <div className="item">
                              <span className="rank num" aria-hidden="true">
                                {x.rank}
                              </span>
                              <span className="x-name">{x.skill}</span>
                            </div>
                            {!resTitle ? (
                              <p className="x-note">No resource cataloged for this yet — your adviser can suggest one.</p>
                            ) : null}
                          </td>
                          <td className="ct-state">
                            <span className="chip c-grey">Waiting</span>
                          </td>
                          <td className="eff num">
                            SP {x.effect.from} → {x.effect.to} · +{x.effect.to - x.effect.from}
                          </td>
                          <td className="ct-act">
                            {resTitle ? (
                              <button className="g-link" type="button" aria-label={`Find resources · ${x.skill}`} onClick={() => allGoto("resources", resTitle)}>
                                Find resources →
                              </button>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : null}

            <div className="stage-static">
              <span className="s-num num" aria-hidden="true">
                3
              </span>
              <span className="sr-name">Entry-ready</span>
              <span className="sr-count num">2 milestones</span>
            </div>
            {steps.peek ? <p className="stage-peek">{steps.peek}</p> : null}
          </div>
        </section>
      ) : null}

      {/* ══════════════ TAB · YOUR GAPS ══════════════ */}
      <section
        key={`gaps-${seq}`}
        className="tabpanel"
        id="panel-gaps"
        role="tabpanel"
        aria-labelledby="tab-gaps"
        hidden={active !== "gaps"}
      >
        {undecided ? (
          defaultElement()
        ) : (
          <>
            <h2 className="ptitle">{gaps.h1}</h2>
            <p className="lead-mono num">
              For {gaps.careerName} <span className="sep">·</span> <b>{gaps.closed}</b> of {gaps.mapSize} skills
              checked
            </p>

            {/* badged skills ledger — cells + column heads + wash chips */}
            <div className="card ledger">
              <div className="head">
                <b>{gaps.careerName} skills</b>
                <span>{gaps.mapSize} skills, one bar each — the badge says how it was closed.</span>
                <span className="label num">{gaps.openCount} OPEN</span>
              </div>
              <table className="gap-table">
                <thead>
                  <tr>
                    <th>Skill</th>
                    <th className="ct-state">State</th>
                    <th className="ct-bar">Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {gaps.rows.map((row) => (
                    <tr key={row.name} className="g-row">
                      <td>
                        <div className="g-name">{row.name}</div>
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
                                  onClick={() => goto("resources", row.resTitle ?? undefined)}
                                >
                                  Find resources →
                                </button>
                              </>
                            ) : (
                              <span className="unverified">no resource cataloged for this yet — your adviser can suggest one.</span>
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
                  ))}
                </tbody>
              </table>
              <div className="foot">
                ✓ verified quiz: passed the short check · ✓✓ checked resource: finished it and passed ·
                self-reported: your claim; a short check locks it in.
              </div>
            </div>

            {/* honest competency strip (ES — the step-③ assessment carries it) */}
            <div className="card softpanel">
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
              <div className="foot">
                {gaps.esLine
                  ? "NACE competencies verified by your assessment — E&I excluded by recorded choice."
                  : "The NACE assessment hasn’t measured this yet; nothing here stalls your next step."}
              </div>
            </div>

            {gaps.allClosed ? (
              <p className="gap-cta"><span className="gap-allclosed">✓ everything closed.</span></p>
            ) : null}
          </>
        )}
      </section>

      {/* ══════════════ TAB · RESOURCES ══════════════ */}
      <section
        key={`resources-${seq}`}
        className="tabpanel"
        id="panel-resources"
        role="tabpanel"
        aria-labelledby="tab-resources"
        hidden={active !== "resources"}
      >
        {undecided ? (
          defaultElement()
        ) : (
          <>
            <h2 className="ptitle">{resources.h1}</h2>
            <p className="lead-mono num">
              For {resources.careerName} <span className="sep">·</span> free options first
            </p>

            <div className="card rescard">
              <div className="res-table">
                <div className="res-row res-heads" aria-hidden="true">
                  <span className="res-main">Resource</span>
                  <span className="res-type">Type</span>
                  <span className="res-cost">Cost</span>
                  <span className="res-time">Time</span>
                  <span className="res-feeds">Feeds</span>
                </div>

                {resources.rows.map((r) => (
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
                ))}
              </div>
            </div>
          </>
        )}
      </section>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Pathway tabs — ported markup + behaviors from prototype/pathway.html:
 * hash deep-links (default #steps), arrow-key roving tablist, cross-tab
 * `data-goto` jumps, stage-② accordion, gap-bar measurement fill.
 * Content is computed live in page.tsx from getStudentView; this component
 * is presentational state only.
 */

export interface TopRes {
  title: string;
  cost: string;
}

export interface QRow {
  rank: number;
  skill: string;
  /** resource pointer (first per skill) — null → no-resource default row */
  res: { title: string; cost: string; hrs: string } | null;
  why: string;
  primary: boolean;
  /** true → no-resource default copy instead of pointer + Start CTA */
  noRes: boolean;
}

export interface XRow {
  rank: number;
  skill: string;
  hasRes: boolean;
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
  /** stage-① header sub-line */
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
}

export interface GapsTab {
  h1: string;
  careerName: string;
  closed: number;
  mapSize: number;
  openCount: number;
  rows: GapRow[];
  allClosed: boolean;
  /** top queue resource — the "Start with" pointer (null when none) */
  top: TopRes | null;
}

export interface FeedCell {
  skill: string;
  closed: boolean;
}

export interface ResRow {
  title: string;
  provider: string;
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

export default function PathwayTabs({
  undecided,
  steps,
  gaps,
  resources,
}: {
  undecided: boolean;
  steps: StepsTab;
  gaps: GapsTab;
  resources: ResourcesTab;
}) {
  const [active, setActive] = useState<TabId>("steps");
  const [seq, setSeq] = useState(0); // >0 only after a user-initiated switch
  const [s2open, setS2open] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  /* open tab from hash (default: ranked steps — beat 8 opens here) */
  useEffect(() => {
    const initial = (window.location.hash || "").replace("#", "");
    if (isTab(initial)) setActive(initial);
  }, []);

  const selectTab = (id: TabId, user = true) => {
    setActive(id);
    if (user) setSeq((n) => n + 1);
    if (history.replaceState) history.replaceState(null, "", `#${id}`);
  };

  const goto = (id: TabId) => {
    selectTab(id);
    window.scrollTo(0, 0);
  };

  /* tab panel motion (one authored moment, reduced-motion respected in CSS) */
  const reduceMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* gap-bar fills measure in per panel (final state already painted for no-JS) */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion()) return;
    const fills = Array.from(
      root.querySelectorAll<HTMLElement>(
        `.tabpanel:not([hidden]) .g-bar i`
      )
    );
    fills.forEach((el, i) => {
      const target = el.style.getPropertyValue("--earn") || "1";
      el.style.setProperty("--earn", "0");
      void el.offsetWidth;
      const t = setTimeout(() => el.style.setProperty("--earn", target), 80 + i * 70);
      return () => clearTimeout(t);
    });
  }, [active, s2open]);

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

  const allGoto = (id: TabId) => goto(id);

  return (
    <div className="shell pg" ref={rootRef}>
      {/* tab strip */}
      <div className="tabrow">
        <div className="ptabs" role="tablist" aria-label="Pathway sections" onKeyDown={onTablistKey}>
          {TABS.map((t) => (
            <button key={t.id} type="button" {...tab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {undecided ? (
        <section className="tabpanel" id="panel-steps" role="tabpanel" aria-labelledby="tab-steps" hidden={active !== "steps"}>
          {defaultElement()}
        </section>
      ) : null}

      {/* ══════════════ TAB · RANKED STEPS (default, beat 8) ══════════════ */}
      {!undecided ? (
        <section
          key={`steps-${seq}`}
          className={`tabpanel${seq > 0 ? " entering" : ""}`}
          id="panel-steps"
          role="tabpanel"
          aria-labelledby="tab-steps"
          hidden={active !== "steps"}
        >
          <h1>{steps.h1}</h1>
          <p className="lead-mono num">
            <b>{steps.closed}</b> of {steps.mapSize} skills checked <span className="sep">·</span> First 30
            days: <b>{steps.done}</b> of 3 done
          </p>

          {/* stage band */}
          <div className="stageband" role="img" aria-label={steps.bandLabel}>
            {steps.band.map((c) => (
              <div key={c.num} className={`stagecell${c.now ? " now" : ""}`}>
                <span className="s-num num" aria-hidden="true">
                  {c.num}
                </span>
                <span className="s-txt">
                  <span className="s-name">{c.name}</span>
                  <span className="s-count">{c.count}</span>
                </span>
              </div>
            ))}
          </div>

          {/* stage ① expanded */}
          <div className="stagepanel">
            <div className="stagehead">
              <div>
                <h2>First 30 days</h2>
                <p className="sub">{steps.sub}</p>
              </div>
              <span className="label num">{steps.done} OF 3 DONE</span>
            </div>

            {steps.clearLine ? (
              <p className="stagewide">{steps.clearLine}</p>
            ) : (
              steps.queue.map((r, i) => (
                <div key={r.skill} className="qrow" style={i === steps.queue.length - 1 ? { borderBottom: 0 } : undefined}>
                  <div className="rank" aria-hidden="true">
                    {r.rank}
                  </div>
                  <div>
                    <div className="q-top">
                      <span className="q-skill">{r.skill}</span>
                      {r.res && !r.noRes ? (
                        <span className="q-res num">
                          with <b>{r.res.title}</b> — {r.res.cost} · {r.res.hrs}
                        </span>
                      ) : null}
                    </div>
                    <p className="q-why">{r.why}</p>
                  </div>
                  <div className="q-cta">
                    {r.noRes ? (
                      <p className="q-nogap">No resource cataloged for this yet — your adviser can suggest one.</p>
                    ) : (
                      <button className={`btn ${r.primary ? "btn-primary" : "btn-ghost"}`} type="button" onClick={() => goto("resources")}>
                        Start
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}

            {!steps.clearLine ? <p className="qfoot">{steps.qfoot}</p> : null}
          </div>

          {/* stage ② + stage ③ — collapsed rows */}
          <div className="stagerows">
            {steps.remain.length > 0 ? (
              <div className="stage-collapsible">
                <button
                  className="stage-rowbtn"
                  type="button"
                  aria-expanded={s2open}
                  aria-controls="stage2"
                  onClick={() => setS2open((o) => !o)}
                >
                  <span className="s-num num" aria-hidden="true">
                    ②
                  </span>
                  <span className="sr-name">Next steps</span>
                  <span className="sr-count">{steps.remain.length} more skills waiting</span>
                  <span className="chev" aria-hidden="true">
                    ▾
                  </span>
                </button>
                {s2open ? (
                  <div key="s2-open" className="stage-expand entering" id="stage2">
                    {steps.remain.map((x) => (
                      <div key={x.skill} className="xrow">
                        <div className="rank" aria-hidden="true">
                          {x.rank}
                        </div>
                        <div>
                          <span className="x-name">{x.skill}</span>
                          {x.hasRes ? (
                            <button className="g-link" type="button" onClick={() => allGoto("resources")}>
                              Find resources →
                            </button>
                          ) : null}
                          {!x.hasRes ? <p className="x-note">No resource cataloged for this yet — your adviser can suggest one.</p> : null}
                        </div>
                        <div />
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="stage-collapsible">
                <div className="stage-static">
                  <span className="s-num num" aria-hidden="true">
                    ②
                  </span>
                  <span className="sr-name">Next steps</span>
                  <span className="sr-count">{steps.catchUp ?? "0 waiting"}</span>
                </div>
              </div>
            )}

            <div className="stage-collapsible">
              <div className="stage-static">
                <span className="s-num num" aria-hidden="true">
                  ③
                </span>
                <span className="sr-name">Entry-ready</span>
                <span className="sr-count">2 milestones</span>
              </div>
              {steps.peek ? <p className="stage-peek">{steps.peek}</p> : null}
            </div>
          </div>

          {/* cross-tab footer */}
          <div className="xtab">
            <button type="button" onClick={() => goto("gaps")}>
              Every open bar: <b>Your gaps</b>
            </button>
            <button type="button" onClick={() => goto("resources")}>
              Every option: <b>Resources</b>
            </button>
          </div>
        </section>
      ) : null}

      {/* ══════════════ TAB · YOUR GAPS ══════════════ */}
      <section
        key={`gaps-${seq}`}
        className={`tabpanel${active === "gaps" && seq > 0 ? " entering" : ""}`}
        id="panel-gaps"
        role="tabpanel"
        aria-labelledby="tab-gaps"
        hidden={active !== "gaps"}
      >
        {undecided ? (
          defaultElement()
        ) : (
          <>
            <h1>{gaps.h1}</h1>
            <p className="lead-mono num">
              For {gaps.careerName} <span className="sep">·</span> <b>{gaps.closed}</b> of {gaps.mapSize} skills
              checked
            </p>

            <div className="stagepanel" style={{ marginTop: 24 }}>
              <div className="stagehead" style={{ paddingBottom: 12 }}>
                <div>
                  <h2>{gaps.careerName} skills</h2>
                  <p className="sub">
                    {gaps.mapSize} skills, one bar each — the badge says how it was closed.
                  </p>
                </div>
                <span className="label num">{gaps.openCount} OPEN</span>
              </div>
              <div className="gaplist" style={{ border: 0, borderRadius: 0, padding: "0 20px" }}>
                {gaps.rows.map((row) => (
                  <div key={row.name} className="gap-row">
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
                            <button className="g-link" type="button" onClick={() => goto("resources")}>
                              Find resources →
                            </button>
                          </>
                        ) : (
                          <span className="unverified">no resource cataloged for this yet — your adviser can suggest one.</span>
                        )
                      ) : null}
                    </div>
                    <div className="g-bar">
                      <i
                        className={row.kind === "claimed" ? "claim" : undefined}
                        style={{ "--earn": row.kind === "open" ? 0 : 1 } as React.CSSProperties}
                      />
                    </div>
                  </div>
                ))}
                <p className="gapnote">
                  ✓ verified quiz: passed the short check · ✓✓ checked resource: finished it and passed ·
                  self-reported: your claim; a short check locks it in.
                </p>
              </div>
            </div>

            {/* honest soft-skill row */}
            <div className="softpanel">
              <div className="gap-row">
                <div className="g-name">People skills</div>
                <div className="g-status num">0 of 25</div>
                <div className="g-bar">
                  <i style={{ "--earn": 0 } as React.CSSProperties} />
                </div>
              </div>
              <p className="soft-note">
                The full situations battery comes after setup. Nothing is scored yet, and nothing here stalls
                your next step.
              </p>
            </div>

            {gaps.allClosed ? (
              <p className="gap-cta"><span className="gap-allclosed">✓ everything closed.</span></p>
            ) : gaps.top ? (
              <p className="gap-cta">
                Start with: <b>{gaps.top.title}</b> ({gaps.top.cost}) ·{" "}
                <button className="g-link" type="button" onClick={() => goto("resources")}>
                  open it →
                </button>
              </p>
            ) : null}

            <div className="xtab">
              <button type="button" onClick={() => goto("steps")}>
                The order to take them in: <b>Ranked steps</b>
              </button>
              <button type="button" onClick={() => goto("resources")}>
                Every option: <b>Resources</b>
              </button>
            </div>
          </>
        )}
      </section>

      {/* ══════════════ TAB · RESOURCES ══════════════ */}
      <section
        key={`resources-${seq}`}
        className={`tabpanel${active === "resources" && seq > 0 ? " entering" : ""}`}
        id="panel-resources"
        role="tabpanel"
        aria-labelledby="tab-resources"
        hidden={active !== "resources"}
      >
        {undecided ? (
          defaultElement()
        ) : (
          <>
            <h1>{resources.h1}</h1>
            <p className="lead-mono num">
              For {resources.careerName} <span className="sep">·</span> free options first
            </p>

            <div className="res-table" style={{ marginTop: 24 }}>
              <div className="res-row res-heads" aria-hidden="true">
                <span className="res-main">RESOURCE</span>
                <span className="res-type">TYPE</span>
                <span className="res-cost">COST</span>
                <span className="res-time">TIME</span>
                <span className="res-feeds">FEEDS</span>
              </div>

              {resources.rows.map((r) => (
                <div key={r.title} className="res-row">
                  <span className="res-main">
                    <span className="r-title">
                      {r.title}
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

            <p className="res-foot">
              {resources.allClosed ? "Everything you needed is done or checked. " : ""}
              Type in plain words: a course is taught, a doc is reference reading, a cert is credited by its
              body and counts toward your entry route. Mark a resource as done, then take the quick check — 5
              questions, get 4 right, and the bar closes.
            </p>

            <div className="xtab">
              <button type="button" onClick={() => goto("gaps")}>
                Every open bar: <b>Your gaps</b>
              </button>
              <button type="button" onClick={() => goto("steps")}>
                The order to take them in: <b>Ranked steps</b>
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

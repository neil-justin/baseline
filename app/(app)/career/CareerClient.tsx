"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SegRubricBar, VBadge } from "@/components/instrument";
import { rubricParts } from "@/lib/engines/rubric";
import { roundHalfDown, WEIGHTS, type Score } from "@/lib/engines/score";
import type {
  CareerProps,
  ExploreRowData,
  MatchRowData,
  VerifiedBarData,
} from "./types";

/**
 * Career surface interactivity — port of prototype/career.html's <script>:
 * 3 tabs (current card / explore by strand / skills-match), the cost-first
 * switch disclosure, and the beat-6 chain: confirm → POST /api/switch →
 * honest dip → quick re-assessment → POST /api/claim → recovered baseline.
 *
 * Dip basis: canon `_fixture-math.md` beat 6 reads SP 0 at the switch — a
 * ·✓ skill's transfer re-registers on the new career map at the re-assessment.
 * The readout therefore counts bars closed on the new map EXCLUDING the
 · carried set (computed from the real state transition, never painted).
 */

type Tab = "current" | "explore" | "match";
type Flow = "tabs" | "confirm" | "reset" | "recovered";
type Rating = "yes" | "some" | "no";

const TARGET_NAME = "Data Analyst";
const TAB_ORDER: Tab[] = ["current", "explore", "match"];
const LEVEL_BY_RATING: Record<Rating, "confident" | "kindof" | "notyet"> = {
  yes: "confident",
  some: "kindof",
  no: "notyet",
};
const DEFAULT_RATINGS: Record<string, Rating> = {
  Spreadsheets: "yes",
  "Data cleaning": "yes",
  "Basic statistics": "yes",
};
const STRAND_CHIPS = ["All", "STEM", "ABM", "HUMSS", "GAS", "TVL"] as const;

interface DipView {
  score: Score;
  parts: ReturnType<typeof rubricParts>;
}

interface ResetData {
  dip: DipView;
  bars: Record<string, { source: string }>;
  closedNow: number;
}

interface RecoveredData {
  from: number;
  score: Score;
  closed: number;
  transferred: string[];
  selfReported: string[];
}

function Arrow() {
  return (
    <span className="arrow">
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        width="0.8em"
        height="0.8em"
      >
        <path d="M4 10h11" />
        <path d="M11 5l5 5-5 5" />
      </svg>
    </span>
  );
}

function BarLabel(score: Score, sub: string): string {
  return (
    `Score ${score.total} of 100 ${sub} — skill progress ${score.sp} of 40, employability skills ${score.es} of 25, ` +
    `training progress ${score.tp} of 20, career direction ${score.cc} of 15`
  );
}

export default function CareerClient({
  card,
  verifiedBars,
  activeGoalTitle,
  barsSources,
  explore,
  exploreTotal,
  matches,
  zeroConfirmed,
  reassess,
}: CareerProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("current");
  const [flow, setFlow] = useState<Flow>("tabs");
  const [discOpen, setDiscOpen] = useState(false);
  const [banner, setBanner] = useState(false);
  const [strand, setStrand] = useState<string>("All");
  const [busy, setBusy] = useState(false);
  const [armed, setArmed] = useState(false);
  const [preSwitch, setPreSwitch] = useState<{
    fromName: string;
    verified: VerifiedBarData[];
    goal: string | null;
    bars: Record<string, string>;
  } | null>(null);
  const [reset, setReset] = useState<ResetData | null>(null);
  const [recovered, setRecovered] = useState<RecoveredData | null>(null);
  const [ratings, setRatings] = useState<Record<string, Rating>>(() =>
    Object.fromEntries(reassess.map((r) => [r.name, DEFAULT_RATINGS[r.name] ?? "no"]))
  );
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // arm the reset/recovered rubric bars ~250ms after the section shows
  useEffect(() => {
    if (flow === "reset" || flow === "recovered") {
      const t = setTimeout(() => setArmed(true), 250);
      return () => clearTimeout(t);
    }
    setArmed(false);
  }, [flow]);

  const selectTab = (id: Tab) => {
    setTab(id);
    window.scrollTo(0, 0);
  };

  const onTabKey = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const d = e.key === "ArrowRight" ? 1 : -1;
    const n = (index + d + TAB_ORDER.length) % TAB_ORDER.length;
    tabRefs.current[n]?.focus();
    selectTab(TAB_ORDER[n]);
  };

  // ---------- strand filter ----------
  const rows: ExploreRowData[] =
    strand === "All" ? explore : explore.filter((r) => r.strand.includes(strand));
  const zeroResult = rows.length === 0;

  // ---------- switch flow ----------
  const openConfirm = () => {
    setPreSwitch({
      fromName: card?.name ?? "",
      verified: verifiedBars,
      goal: activeGoalTitle,
      bars: barsSources,
    });
    setDiscOpen(false);
    setFlow("confirm");
    window.scrollTo(0, 0);
  };

  const enterSwitch = () => {
    setDiscOpen(false);
    setBanner(true);
    selectTab("explore");
  };

  const cancelSwitch = () => {
    setBanner(false);
    setFlow("tabs");
    selectTab("current");
  };

  async function doSwitch() {
    if (!preSwitch || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/switch", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ to: "da", student: "neil" }),
      });
      if (!res.ok) throw new Error("switch failed");
      router.refresh();
      const v = await (await fetch("/api/state?student=neil", { cache: "no-store" })).json();
      const carried = new Set(
        Object.entries(preSwitch.bars)
          .filter(([, src]) => src === "verified")
          .map(([name]) => name)
      );
      const fresh = Object.keys(v.state.bars).filter(
        (n: string) => !carried.has(n)
      ).length;
      const sp = roundHalfDown((WEIGHTS.sp * fresh) / v.career.skills.length);
      const dipScore: Score = {
        sp,
        es: v.score.es,
        tp: v.score.tp,
        cc: v.score.cc,
        total: sp + v.score.es + v.score.tp + v.score.cc,
      };
      setReset({
        dip: { score: dipScore, parts: rubricParts(dipScore) },
        bars: v.state.bars,
        closedNow: Object.keys(v.state.bars).length,
      });
      setFlow("reset");
      window.scrollTo(0, 0);
    } catch {
      setFlow("tabs");
    } finally {
      setBusy(false);
    }
  }

  const isLockedSkill = (name: string): "verified" | "checked" | null => {
    const b = reset?.bars[name];
    if (!b) return null;
    if (b.source === "verified") return "verified";
    if (b.source === "checked") return "checked";
    return null;
  };

  async function submitReassessment() {
    if (busy || !reset) return;
    setBusy(true);
    try {
      const claims = reassess
        .filter((r) => !isLockedSkill(r.name))
        .map((r) => ({ skill: r.name, level: LEVEL_BY_RATING[ratings[r.name] ?? "no"] }));
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ claims, student: "neil" }),
      });
      if (!res.ok) throw new Error("claim failed");
      router.refresh();
      const v = await (await fetch("/api/state?student=neil", { cache: "no-store" })).json();
      setRecovered({
        from: reset.dip.score.total,
        score: v.score as Score,
        closed: Object.keys(v.state.bars).length,
        transferred: v.state.decisions?.verifiedTransferred ?? [],
        selfReported: Object.entries(v.state.bars as Record<string, { source: string }>)
          .filter(([, b]) => b.source === "claimed")
          .map(([name]) => name),
      });
      setFlow("recovered");
      window.scrollTo(0, 0);
    } catch {
      setFlow("reset");
    } finally {
      setBusy(false);
    }
  }

  const backToCareer = (toTab: Tab) => {
    setRecovered(null);
    setFlow("tabs");
    setBanner(false);
    selectTab(toTab);
  };

  // ---------- markup helpers ----------
  const tabBtn = (id: Tab, index: number, label: string) => (
    <button
      key={id}
      ref={(el) => {
        tabRefs.current[index] = el;
      }}
      className="tab-btn"
      id={`tb-${id}`}
      role="tab"
      data-panel={`tab-${id}`}
      aria-selected={tab === id}
      aria-controls={`tab-${id}`}
      tabIndex={tab === id ? 0 : -1}
      onClick={() => selectTab(id)}
      onKeyDown={(e) => onTabKey(e, index)}
    >
      {label}
    </button>
  );

  const matchSub = (m: MatchRowData) => {
    if (m.x === 0) {
      return <>no overlap yet; its {m.y} skills aren&apos;t on your baseline ({m.entry})</>;
    }
    return (
      <>
        {m.confirmed.map((c, i) => (
          <span key={c.name}>
            {i > 0 && " "}
            <VBadge ok>
              {c.name} ·{c.src === "verified" ? "✓" : "✓✓"}
            </VBadge>
          </span>
        ))}{" "}
        confirmed
        {m.selfReported.length > 0
          ? ` · ${m.selfReported.map((n) => n.toLowerCase()).join(", ")} self-reported`
          : m.x === 1
            ? " · the only skill the two lists share"
            : ""}
      </>
    );
  };

  return (
    <>
      {/* ============================================================
          VIEW · Career (tabs) — default state
          ============================================================ */}
      <div id="career-view" className="app-section" style={{ paddingBottom: 64 }} hidden={flow !== "tabs"}>
        <div className="shell">
        <div className="screen-head">
          <h1>Your career</h1>
          <p>Where you&apos;re headed. Change it whenever you want.</p>
        </div>

        {/* tab bar */}
        <div className="choice tabs" role="tablist" aria-label="Career sections">
          {tabBtn("current", 0, "Current career")}
          {tabBtn("explore", 1, "Explore by strand")}
          {tabBtn("match", 2, "Skills-match")}
        </div>

        {/* ---------- tab 1 · current career card ---------- */}
        <div id="tab-current" role="tabpanel" aria-labelledby="tb-current" hidden={tab !== "current"}>
          {card ? (
            <div className="panel cc-card">
              <div className="cc-top">
                <div className="cc-id">
                  <span className="label">CURRENT CAREER</span>
                  <h2 className="cc-name">{card.name}</h2>
                  <p className="cc-what">{card.what}</p>
                </div>
                <span className="badge">{card.strandDisplay}</span>
              </div>

              <div className="cc-grid">
                <div className="cc-why">
                  <span className="label">WHY THIS FITS YOU</span>
                  <p>{card.why}</p>
                </div>
                <div className="cc-facts">
                  <div className="cc-fact">
                    <span className="label">ENTRY PATH</span>
                    <p className="num">{card.entry}</p>
                  </div>
                  <div className="cc-fact">
                    <span className="label">SKILL MAP</span>
                    <p className="num">
                      {card.closed} of {card.mapSize} skills on your baseline · First 30 days:{" "}
                      {card.stageOneDone} of 3 done
                    </p>
                  </div>
                </div>
              </div>

              <div className="cc-ctas">
                <a className="btn btn-primary" href="/pathway">
                  See your gaps <Arrow />
                </a>
                <button className="btn btn-ghost" type="button" onClick={() => selectTab("explore")}>
                  Explore more careers
                </button>
              </div>

              <div className="cc-switch">
                <button
                  className="quiet-toggle"
                  type="button"
                  aria-expanded={discOpen}
                  aria-controls="switch-disclosure"
                  onClick={() => setDiscOpen((o) => !o)}
                >
                  Switch career
                </button>
                <div className={`disclosure ${discOpen ? "show" : ""}`} id="switch-disclosure">
                  <p>
                    Switching resets your gap bars and your score toward the new career; it rebuilds from
                    what you can actually do. Skills you&apos;ve already proven (
                    {verifiedBars.map((b, i) => (
                      <span key={b.name}>
                        {i > 0 && " "}
                        <VBadge ok>
                          {b.name} ·{b.src === "verified" ? "✓" : "✓✓"}
                        </VBadge>
                      </span>
                    ))}
                    ) and your goals stay confirmed on your profile.{" "}
                    <button className="quiet-toggle disc-go" type="button" onClick={enterSwitch}>
                      Browse careers to switch →
                    </button>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* ⏳ undecided default (edge-case audit §2) */
            <div className="panel cc-card">
              <div className="cc-top">
                <div className="cc-id">
                  <span className="label">CURRENT CAREER</span>
                  <h2 className="cc-name">No career picked yet</h2>
                  <p className="cc-what">You haven&apos;t picked yet — explore by strand.</p>
                </div>
              </div>
              <div className="cc-ctas">
                <button className="btn btn-primary" type="button" onClick={() => selectTab("explore")}>
                  Explore by strand
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ---------- tab 2 · explore by strand ---------- */}
        <div id="tab-explore" role="tabpanel" aria-labelledby="tb-explore" hidden={tab !== "explore"}>
          {banner && (
            <div className="sw-banner">
              You&apos;re browsing to switch. Look around first; nothing changes until you pick a new career
              and confirm.
            </div>
          )}

          <div className="explore-head">
            <h2>Explore careers by strand</h2>
            <p>Every strand leads somewhere real. Each listing shows what it opens up and what it takes to get in.</p>
          </div>

          <div className="choice choice-sm strand-chips" role="group" aria-label="Filter by strand" id="strand-chips">
            {STRAND_CHIPS.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={strand === s}
                onClick={() => setStrand(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="label explore-count num" id="explore-count">
            SHOWING {rows.length} OF {exploreTotal} CAREERS
          </p>

          <div className="panel index-table" style={{ overflow: "hidden" }}>
            <div className="index-colheads label" aria-hidden="true">
              <span>CAREER</span>
              <span>STRAND</span>
              <span>SKILLS</span>
              <span>ENTRY PATH</span>
            </div>
            {rows.map((r) =>
              r.live && card?.id !== r.id ? (
                <button
                  key={r.id}
                  className="index-row row-live"
                  type="button"
                  onClick={openConfirm}
                >
                  <span className="career">
                    {r.name} <span className="mono row-go" aria-hidden="true">→</span>
                  </span>
                  <span className="strand">{r.strand}</span>
                  <span className="skills">
                    <span className="num">{r.skills}</span>
                  </span>
                  <span className="entry">{r.entry}</span>
                </button>
              ) : (
                <div key={r.id} className="index-row">
                  <span className="career">{r.name}</span>
                  <span className="strand">{r.strand}</span>
                  <span className="skills">
                    <span className="num">{r.skills}</span>
                  </span>
                  <span className="entry">{r.entry}</span>
                </div>
              )
            )}
          </div>

          {/* zero-result default state for the strand filter */}
          {zeroResult && (
            <div className="panel explore-empty">
              No careers indexed for this strand yet — try{" "}
              <button className="g-link" type="button" onClick={() => setStrand("All")}>
                All
              </button>{" "}
              to see the full index.
            </div>
          )}

          <p className="wage-line num">
            Certified skill pays: <b>₱69 → ₱96 per hour</b> as NC levels rise{" "}
            <span className="wage-src">(EDCOM 2 TVET Returns Policy Note, 2026)</span>
          </p>
        </div>

        {/* ---------- tab 3 · skills-match ---------- */}
        <div id="tab-match" role="tabpanel" aria-labelledby="tb-match" hidden={tab !== "match"}>
          <div className="explore-head">
            <h2>Careers closest to what you know</h2>
            <p>Ranked by how much of each career&apos;s skill list is already on your baseline.</p>
          </div>

          {zeroConfirmed ? (
            /* ⏳ zero-confirmed default (edge-case audit §2): single compressed row */
            <div className="panel match-table">
              <div className="match-head label" aria-hidden="true">
                <span>CAREER</span>
                <span>SKILLS IN COMMON</span>
              </div>
              <div className="match-row">
                <div className="m-main">
                  <span className="m-name">Nothing confirmed yet</span>
                </div>
                <span className="m-fit num m-zero">—</span>
                <p className="m-sub num">
                  Matching starts once a skill is confirmed — pass a check on one and this list builds
                  from it. Skills you rate yourself feed your baseline, but they never count toward
                  matching.
                </p>
              </div>
            </div>
          ) : (
            <div className="panel match-table">
              <div className="match-head label" aria-hidden="true">
                <span>CAREER</span>
                <span>SKILLS IN COMMON</span>
              </div>
              {matches.map((m) => (
                <div className="match-row" key={m.id}>
                  <div className="m-main">
                    <span className="m-name">{m.name}</span>
                    {m.current && <span className="badge">CURRENT</span>}
                  </div>
                  <span className={`m-fit num ${m.x === 0 ? "m-zero" : ""}`}>{m.x} of {m.y}</span>
                  <p className="m-sub num">{matchSub(m)}</p>
                </div>
              ))}
            </div>
          )}

          <p className="match-note">
            Matching uses confirmed skills only. Confirm more from <a href="/progress">Progress</a> to
            widen this list. Skills you marked yourself during setup feed your baseline bars, but they
            never count toward matching.
          </p>
        </div>
        </div>
      </div>

      {/* ============================================================
          SWITCH FLOW — Software Developer → Data Analyst (beat 6)
          ============================================================ */}

      {/* state 1 · confirm, cost first */}
      <section id="sw-confirm" className="app-section" hidden={flow !== "confirm"}>
        {flow === "confirm" && preSwitch && (
          <div className="shell">
            <div className="screen-head">
              <h1>Switch to {TARGET_NAME}?</h1>
            </div>
            <div className="panel sw-panel">
              <p className="sw-cost">
                Switching to {TARGET_NAME} resets skill progress and training progress toward it — your
                score drops to its floor and rebuilds.
              </p>
              <div className="sw-stays">
                <span className="label">WHAT STAYS</span>
                <p>
                  Skills you&apos;ve already proven (
                  {preSwitch.verified.map((b, i) => (
                    <span key={b.name}>
                      {i > 0 && " "}
                      <VBadge ok>
                        {b.name} ·{b.src === "verified" ? "✓" : "✓✓"}
                      </VBadge>
                    </span>
                  ))}
                  ) stay confirmed on your profile.{" "}
                  {preSwitch.goal ? <>Your goal &ldquo;{preSwitch.goal}&rdquo; stays active.</> : null}
                </p>
              </div>
              <p className="sw-backnote">You can switch back any time.</p>
              <div className="sw-actions">
                <button
                  className="btn btn-primary"
                  type="button"
                  disabled={busy}
                  onClick={doSwitch}
                >
                  {busy ? "Switching…" : `Switch to ${TARGET_NAME}`}
                </button>
                <button className="btn btn-ghost" type="button" onClick={cancelSwitch}>
                  Keep {preSwitch.fromName}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* state 2 · honest drop + quick re-assessment */}
      <section id="sw-reset" className="app-section" hidden={flow !== "reset"}>
        {flow === "reset" && reset && preSwitch && (
          <div className="shell">
            <div className="screen-head">
              <h1>Score reset for your new career</h1>
              <p>
                Your gap bars and training progress were built around {preSwitch.fromName}. Switching
                resets them to measure {TARGET_NAME}&apos;s {reassess.length} skills instead: the score
                drops to its floor and rebuilds from what you can actually do. It starts measuring the
                right things, not punishing you.
              </p>
            </div>

            <div className="panel readout">
              <div className="readout-head">
                <div>
                  <span className="label">
                    READINESS · <b className="sample-tag">{TARGET_NAME.toUpperCase()}</b>
                  </span>
                  <div className="readout-sub">out of 100 · right after the switch</div>
                </div>
                <div className="readout-score num">
                  {reset.dip.score.total}
                  <small>/100</small>
                </div>
              </div>
              <div className="rubric-mini">
                <SegRubricBar
                  parts={reset.dip.parts}
                  armed={armed}
                  height={10}
                  ariaLabel={BarLabel(reset.dip.score, "after the switch")}
                />
              </div>
              <div className="readout-legend">
                <span><b>SP</b> {reset.dip.score.sp}/40</span>
                <span><b>ES</b> {reset.dip.score.es}/25</span>
                <span><b>TP</b> {reset.dip.score.tp}/20</span>
                <span><b>CC</b> {reset.dip.score.cc}/15</span>
              </div>
              <div className="readout-fit">
                The {reset.dip.score.total} that stays is career direction: deciding on {TARGET_NAME} and
                keeping an active goal are still yours.
              </div>
            </div>

            <div className="reassess">
              <h2>Where you stand on {TARGET_NAME}</h2>
              <p>
                Rate each skill: claims feed your baseline, but only skills you pass a check on count as
                confirmed.
              </p>
              <div className="panel skill-list">
                {reassess.map((r) => {
                  const locked = isLockedSkill(r.name);
                  return (
                    <div className={`skill-row ${locked ? "skill-locked" : ""}`} key={r.name}>
                      <span className="s-name">{r.display}</span>
                      <span className="s-what">
                        {locked ? (
                          <VBadge ok>
                            Confirmed ·{locked === "verified" ? "✓ transferred" : "✓✓"}
                          </VBadge>
                        ) : (
                          r.what
                        )}
                      </span>
                      {!locked && (
                        <div className="choice choice-sm" role="group" aria-label={`Rate: ${r.display}`}>
                          {(["yes", "some", "no"] as const).map((v) => (
                            <button
                              key={v}
                              type="button"
                              aria-pressed={ratings[r.name] === v}
                              onClick={() => setRatings((rs) => ({ ...rs, [r.name]: v }))}
                            >
                              {v === "yes" ? "Can do" : v === "some" ? "Some" : "Not yet"}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="reassess-note">
                Self-reported skills never count toward Skills-match; a check you pass later confirms
                them.
              </p>
              <button
                className="btn btn-primary"
                type="button"
                disabled={busy}
                onClick={submitReassessment}
              >
                {busy ? "Reading…" : "See my baseline"}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* state 3 · recovered */}
      <section id="sw-recovered" className="app-section" hidden={flow !== "recovered"}>
        {flow === "recovered" && recovered && (
          <div className="shell">
            <div className="screen-head">
              <h1>Your baseline on {TARGET_NAME}</h1>
            </div>

            <div className="panel readout">
              <div className="readout-head">
                <div>
                  <span className="label">
                    READINESS · <b className="sample-tag">{TARGET_NAME.toUpperCase()}</b>
                  </span>
                  <div className="readout-sub">out of 100 · reset, then rebuilt from your re-assessment</div>
                </div>
                <div className="readout-score num">
                  <span className="score-from">{recovered.from}</span>
                  <span className="score-arrow" aria-hidden="true">→</span>
                  <span className="score-to">{recovered.score.total}</span>
                  <small>/100</small>
                </div>
              </div>
              <div className="rubric-mini">
                <SegRubricBar
                  parts={rubricParts(recovered.score)}
                  armed={armed}
                  height={10}
                  ariaLabel={BarLabel(recovered.score, "after re-assessment")}
                />
              </div>
              <div className="readout-legend">
                <span><b>SP</b> {recovered.score.sp}/40</span>
                <span><b>ES</b> {recovered.score.es}/25</span>
                <span><b>TP</b> {recovered.score.tp}/20</span>
                <span><b>CC</b> {recovered.score.cc}/15</span>
              </div>
              <div className="readout-fit">
                <b className="num">
                  {recovered.from} → {recovered.score.total}
                </b>{" "}
                · the reset measured the right things, then rebuilt on what you reported.
              </div>
            </div>

            <div className="panel recover-panel">
              <span className="label">YOUR BASELINE</span>
              <p className="rec-line num">
                {recovered.closed} of {reassess.length} skills on your baseline
                {recovered.transferred.length > 0 && (
                  <>
                    {" — "}
                    {recovered.transferred.map((t, i) => (
                      <span key={t}>
                        {i > 0 && " "}
                        <VBadge ok>
                          {t} ·✓
                        </VBadge>
                      </span>
                    ))}
                    {" "}transferred
                  </>
                )}
                {recovered.selfReported.length > 0 && (
                  <>
                    {recovered.transferred.length > 0 ? "; " : " — "}
                    {recovered.selfReported.map((n) => n.toLowerCase()).join(", ")} self-reported.
                  </>
                )}
                {recovered.transferred.length === 0 && recovered.selfReported.length === 0 && "."}
              </p>
              <p className="rec-note">
                Self-reported skills feed the baseline but never count toward Skills-match — only checks
                you pass do.
              </p>
              <div className="sw-actions">
                <a className="btn btn-primary" href="/pathway">
                  See your gaps <Arrow />
                </a>
                <button className="btn btn-ghost" type="button" onClick={() => backToCareer("current")}>
                  Back to Career
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

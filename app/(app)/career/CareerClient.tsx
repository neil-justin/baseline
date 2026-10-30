"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SegRubricBar, VBadge } from "@/components/instrument";
import { rubricParts } from "@/lib/engines/rubric";
import { roundHalfDown, WEIGHTS, type Score } from "@/lib/engines/score";
import { reassessDisplay, reassessWhat } from "./career-copy";
import type { CareerProps, RoleRowData, VerifiedBarData } from "./types";

/**
 * v7.2 Careers surface interactivity — one role list, zero sub-tabs (ruled
 * page architecture 2026-10-28): the AI-ranked "Best matches for you" lens is
 * the DEFAULT reader of the single role card, with the track-filtered "All
 * roles" fallback; role rows expand into the ruled role-detail blocks
 * (catalog truth only), and the beat-6 SWITCH chain stays byte-honest:
 * confirm → POST /api/switch → honest dip → quick re-assessment →
 * POST /api/claim → recovered baseline.
 *
 * Dip basis: canon `_fixture-math.md` beat 6 reads SP 0 at the switch — a
 * ·✓ skill's transfer re-registers on the new career map at the re-assessment.
 * The readout therefore counts bars closed on the new map EXCLUDING the
 * carried set (computed from the real state transition, never painted).
 */

type Lens = "ranked" | (typeof TRACK_CHIPS)[number];
type Flow = "tabs" | "confirm" | "reset" | "recovered";
type Rating = "yes" | "some" | "no";

const TRACK_CHIPS = [
  "All",
  "Computer & IT",
  "Business & Management",
  "Accounting & Finance",
  "Office & Administration",
] as const;
const LENS_CHIPS = ["Best matches for you", ...TRACK_CHIPS] as const;

const CANON_TARGET: { id: string; name: string } = {
  id: "qa",
  name: "Software QA Analyst",
};
const LEVEL_BY_RATING: Record<Rating, "confident" | "kindof" | "notyet"> = {
  yes: "confident",
  some: "kindof",
  no: "notyet",
};
const DEFAULT_RATINGS: Record<string, Rating> = {
  "Test Planning": "yes",
  "Defect management": "yes",
  "Applications Support and Enhancement": "yes",
};

interface DipView {
  score: Score;
  parts: ReturnType<typeof rubricParts>;
}

interface ResetData {
  dip: DipView;
  bars: Record<string, { source: string }>;
  closedNow: number;
  /** persisted ·✓ hand-off from the switch (decisions.verifiedTransferred) */
  carried: string[];
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

function Chev() {
  /* drawn chevron — borders, no glyph font (family spec) */
  return <span className="chev" aria-hidden="true" />;
}

function BarLabel(score: Score, sub: string): string {
  return (
    `Score ${score.total} of 100 ${sub} — skill progress ${score.sp} of ${WEIGHTS.sp}, employability skills ${score.es} of ${WEIGHTS.es}, ` +
    `training progress ${score.tp} of ${WEIGHTS.tp}, application readiness ${score.ar === null ? "not yet measured" : score.ar + " of " + WEIGHTS.ar}, career direction ${score.cc} of ${WEIGHTS.cc}`
  );
}

export default function CareerClient({
  card,
  verifiedBars,
  activeGoalTitle,
  barsSources,
  roles,
  exploreTotal,
  zeroConfirmed,
  reassess: reassessCanon,
}: CareerProps) {
  const router = useRouter();
  const [lens, setLens] = useState<Lens>("ranked");
  const [openId, setOpenId] = useState<string | null>(null);
  const [flow, setFlow] = useState<Flow>("tabs");
  const [discOpen, setDiscOpen] = useState(false);
  const [banner, setBanner] = useState(false);
  const [busy, setBusy] = useState(false);
  const [armed, setArmed] = useState(false);
  const [flowTarget, setFlowTarget] = useState<{ id: string; name: string }>(CANON_TARGET);
  const [preSwitch, setPreSwitch] = useState<{
    fromName: string;
    verified: VerifiedBarData[];
    goal: string | null;
    bars: Record<string, string>;
  } | null>(null);
  const [reset, setReset] = useState<ResetData | null>(null);
  const [recovered, setRecovered] = useState<RecoveredData | null>(null);
  const [qaGoalPosted, setQaGoalPosted] = useState(false);
  const [reassess, setReassess] = useState(reassessCanon);

  const [ratings, setRatings] = useState<Record<string, Rating>>(() =>
    Object.fromEntries(reassessCanon.map((r) => [r.name, DEFAULT_RATINGS[r.name] ?? "no"]))
  );

  /* arm the reset/recovered rubric bars ~250ms after the section shows */
  useEffect(() => {
    if (flow === "reset" || flow === "recovered") {
      const t = setTimeout(() => setArmed(true), 250);
      return () => clearTimeout(t);
    }
    setArmed(false);
  }, [flow]);

  const scrollTop = () => window.scrollTo(0, 0);

  // ---------- lens + the one list ----------
  /* ranked ordering reads the engine's fit numbers (server-computed
     skillsMatch), deepest overlap first, catalog order breaking ties —
     never a painted rank */
  const ranked = [...roles].sort((a, b) => b.x - a.x);
  const rows: RoleRowData[] =
    lens === "ranked"
      ? ranked
      : lens === "All"
        ? roles
        : roles.filter((r) => r.trackLabel === lens);
  const zeroResult = rows.length === 0;
  const colsClass = lens === "ranked" ? "cols-ranked" : "cols-track";

  const rowWhy = (r: RoleRowData) => {
    if (r.current) return r.why;
    if (r.x > 0) return "receipts" as const;
    return r.what;
  };

  const matchSub = (m: RoleRowData) => {
    if (m.x === 0) {
      return null; // zero rows read the what-line instead (see rowWhy)
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
          : ""}
      </>
    );
  };

  // ---------- switch flow ----------
  const openConfirm = async (id: string) => {
    // canon keeps the server-fed re-assessment rows; other roles resolve
    // their own skill map lazily (catalog import is code-split)
    if (id !== CANON_TARGET.id) {
      try {
        const { getCareer } = await import("@/lib/fixtures/catalog");
        const t = getCareer(id);
        if (t) {
          setFlowTarget({ id: t.id, name: t.name });
          const next = t.skills.map((s) => ({
            name: s.name,
            display: reassessDisplay(s.name),
            what: reassessWhat(s.name, s.what),
          }));
          setReassess(next);
          setRatings((prev) => {
            const merged: Record<string, Rating> = {};
            for (const r of next) merged[r.name] = prev[r.name] ?? DEFAULT_RATINGS[r.name] ?? "no";
            return merged;
          });
        }
      } catch {
        return; // honest failure — nothing changes
      }
    } else {
      setFlowTarget(CANON_TARGET);
      setReassess(reassessCanon);
    }
    setPreSwitch({
      fromName: card?.name ?? "",
      verified: verifiedBars,
      goal: activeGoalTitle,
      bars: barsSources,
    });
    setDiscOpen(false);
    setFlow("confirm");
    scrollTop();
  };

  const enterSwitch = () => {
    setDiscOpen(false);
    setBanner(true);
    setLens("All");
    scrollTop();
  };

  const cancelSwitch = () => {
    setBanner(false);
    setFlow("tabs");
    scrollTop();
  };

  async function doSwitch() {
    if (!preSwitch || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/switch", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ to: flowTarget.id, student: "neil" }),
      });
      if (!res.ok) throw new Error("switch failed");
      router.refresh();
      const v = await (await fetch("/api/state", { cache: "no-store" })).json();
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
        ar: v.score.ar ?? null,
        arParts: v.score.arParts,
        cc: v.score.cc,
        total: sp + v.score.es + v.score.tp + (v.score.ar ?? 0) + v.score.cc,
      };
      setReset({
        dip: { score: dipScore, parts: rubricParts(dipScore) },
        bars: v.state.bars,
        closedNow: Object.keys(v.state.bars).length,
        carried: v.state.decisions?.verifiedTransferred ?? [],
      });
      setFlow("reset");
      scrollTop();
    } catch {
      setFlow("tabs");
    } finally {
      setBusy(false);
    }
  }

  const isLockedSkill = (name: string): "verified" | "checked" | null => {
    // the carried ·✓ set is persisted at switch time (decisions) — reading bars
    // here would always see {} (canon dip: SP 0 until re-assessment)
    if ((reset?.carried ?? []).includes(name)) return "verified";
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
      const v = await (await fetch("/api/state", { cache: "no-store" })).json();
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
      scrollTop();
    } catch {
      setFlow("reset");
    } finally {
      setBusy(false);
    }
  }

  const backToCareer = () => {
    setRecovered(null);
    setFlow("tabs");
    setBanner(false);
    setLens("ranked");
    scrollTop();
  };

  async function postQaGoal() {
    setBusy(true);
    try {
      const res = await fetch("/api/goal", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          student: "neil",
          title: "Build my first test plan",
          type: "training",
          resourceId: "res-qa-testing",
          skill: "Software Testing",
        }),
      });
      if (!res.ok) throw new Error("goal failed");
      setQaGoalPosted(true);
      router.refresh();
    } catch {
      /* honest failure: button stays enabled; the demo retries */
    } finally {
      setBusy(false);
    }
  }

  // ---------- markup ----------
  const bandcell = (label: string, value: string, num?: boolean) => (
    <div className="bcell" key={label}>
      <span className="label">{label}</span>
      <span className={`bval${num ? " num" : ""}`}>{value}</span>
    </div>
  );

  return (
    <div className="v7career">
      {/* ============================================================
          VIEW · Careers — default state (one list, zero sub-tabs)
          ============================================================ */}
      <section id="career-view" hidden={flow !== "tabs"}>
        {/* named band — instrument counters computed from state */}
        <header className="band">
          <div className="bandrow">
            <div className="who">
              <h1 className="t">Your career</h1>
              <p className="m">Where you&apos;re headed. Change it whenever you want.</p>
            </div>
            <div className="bandcells">
              {bandcell("Target role", card ? card.name : "Not picked yet")}
              {bandcell("Skill map", card ? `${card.closed} of ${card.mapSize} on your baseline` : "—", true)}
              {bandcell("First 30 days", card ? `${card.stageOneDone} of 3 done` : "—", true)}
            </div>
          </div>
        </header>

        {/* ---------- current-career card ---------- */}
        {card ? (
          <div className="card cc-card">
            <div className="cc-top">
              <div className="cc-id">
                <span className="label">CURRENT CAREER</span>
                <h2 className="cc-name">{card.name}</h2>
                <p className="cc-what">{card.what}</p>
              </div>
              <span className="chip c-blue cc-badge">{card.strandDisplay}</span>
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
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => {
                  setLens("All");
                  scrollTop();
                }}
              >
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
          /* undecided default (edge-case audit §2) */
          <div className="card cc-card">
            <div className="cc-top">
              <div className="cc-id">
                <span className="label">CURRENT CAREER</span>
                <h2 className="cc-name">No career picked yet</h2>
                <p className="cc-what">You haven&apos;t picked yet — explore by track.</p>
              </div>
            </div>
            <div className="cc-ctas">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  setLens("All");
                  scrollTop();
                }}
              >
                Explore by track
              </button>
            </div>
          </div>
        )}

        {/* ---------- the one role list (Best matches / All roles) ---------- */}
        <div className="card rolecard">
          {banner && (
            <div className="sw-banner">
              You&apos;re browsing to switch. Look around first; nothing changes until you pick a new career
              and confirm.
            </div>
          )}

          <div className="cardtop">
            <div className="ptabs" role="group" aria-label="Filter by track" id="strand-chips">
              {LENS_CHIPS.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={lens === s}
                  onClick={() => {
                    setLens(s as Lens);
                    setOpenId(null);
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <span className="kicker num" id="explore-count">
              SHOWING {rows.length} OF {exploreTotal} CAREERS
            </span>
          </div>

          {/* lens context — one small head per lens, kept from the previous tabs */}
          <div className="lens-head">
            <b>{lens === "ranked" ? "Careers closest to what you know" : "Explore careers by track"}</b>
            <span>
              {lens === "ranked"
                ? "Ranked by how much of each career's skill list is already on your baseline."
                : "Every track leads somewhere real. Each listing shows what it opens up and what it takes to get in."}
            </span>
          </div>

          {zeroConfirmed && lens === "ranked" ? (
            /* zero-demonstrated default (edge-case audit §2): the compressed row */
            <div className="match-table">
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
          ) : zeroResult ? (
            <div className="match-table explore-empty">
              No careers indexed for this track yet — try{" "}
              <button className="g-link" type="button" onClick={() => setLens("All")}>
                All
              </button>{" "}
              to see the full index.
            </div>
          ) : (
            <div className={`index-table ${colsClass}`}>
              <div className="index-colheads" aria-hidden="true">
                {lens === "ranked" && <span className="ch-rank">RANK</span>}
                <span className="ch-career">CAREER</span>
                {lens === "ranked" ? (
                  <span className="ch-fit">SKILLS IN COMMON</span>
                ) : (
                  <>
                    <span className="ch-track">TRACK</span>
                    <span className="ch-skills">SKILLS</span>
                  </>
                )}
                <span className="ch-entry">ENTRY PATH</span>
                <span className="ch-exp" aria-hidden="true" />
              </div>

              {rows.map((r, i) => {
                const liveRow = r.live && card?.id !== r.id;
                if (liveRow) {
                  return (
                    <button
                      key={r.id}
                      className={`index-row row-live ${colsClass}`}
                      type="button"
                      onClick={() => openConfirm(r.id)}
                    >
                      {lens === "ranked" && <span className="rank num">{i + 1}</span>}
                      <span className="cell-career">
                        <span className="c-name">
                          {r.name} <span className="mono row-go" aria-hidden="true">→</span>
                        </span>
                        <span className="c-sub num">
                          {rowWhy(r) === "receipts" ? matchSub(r) : rowWhy(r)}
                        </span>
                      </span>
                      {lens === "ranked" ? (
                        <span className="cell-fit" aria-label={`${r.x} of ${r.y} skills in common`}>
                          <span className="fit-line num">{r.x} of {r.y}</span>
                          <span className="mbar" aria-hidden="true">
                            <i style={{ width: `${(r.x / r.y) * 100}%` }} />
                          </span>
                        </span>
                      ) : (
                        <>
                          <span className="cell-track">{r.trackLabel}</span>
                          <span className="cell-skills num">{r.y}</span>
                        </>
                      )}
                      <span className="cell-entry num">{r.entry}</span>
                      <span className="cell-exp" aria-hidden="true" />
                    </button>
                  );
                }
                return (
                  <div className="role-block" key={r.id}>
                    <div
                      className={`index-row ${colsClass}${openId === r.id ? " row-open" : ""}`}
                      onClick={() => setOpenId((cur) => (cur === r.id ? null : r.id))}
                    >
                      {lens === "ranked" && <span className="rank num">{i + 1}</span>}
                      <span className="cell-career">
                        <button
                          type="button"
                          className="row-name"
                          aria-expanded={openId === r.id}
                          aria-controls={`detail-${r.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenId((cur) => (cur === r.id ? null : r.id));
                          }}
                        >
                          {r.name}
                        </button>
                        {r.current && <span className="chip c-blue">CURRENT</span>}
                        <span className="c-sub num">
                          {rowWhy(r) === "receipts" ? matchSub(r) : rowWhy(r)}
                        </span>
                      </span>
                      {lens === "ranked" ? (
                        <span className="cell-fit" aria-label={`${r.x} of ${r.y} skills in common`}>
                          <span className={`fit-line num ${r.x === 0 ? "fit-zero" : ""}`}>
                            {r.x} of {r.y}
                          </span>
                          <span className="mbar" aria-hidden="true">
                            <i style={{ width: `${(r.x / r.y) * 100}%` }} />
                          </span>
                        </span>
                      ) : (
                        <>
                          <span className="cell-track">{r.trackLabel}</span>
                          <span className="cell-skills num">{r.y}</span>
                        </>
                      )}
                      <span className="cell-entry num">{r.entry}</span>
                      <span className="cell-exp" aria-hidden="true">
                        <Chev />
                      </span>
                    </div>

                    {/* role detail — catalog truth only (ruled blocks) */}
                    {openId === r.id && (
                      <div className="index-detail" id={`detail-${r.id}`}>
                        <div className="d-grid">
                          <div className="d-block d-wide">
                            <span className="label">WHAT THE JOB IS</span>
                            <p>{r.what}</p>
                            <p className="d-psoc num">Registered occupation — {r.psoc}</p>
                          </div>
                          <div className="d-block">
                            <span className="label">ENTRY PATH</span>
                            <p>{r.entry}</p>
                          </div>
                          <div className="d-block">
                            <span className="label">MAJORS THAT MAP HERE</span>
                            <p>{r.majors}</p>
                          </div>
                          <div className="d-block">
                            <span className="label">JOB MARKET</span>
                            <p>{r.demand}</p>
                          </div>
                          <div className="d-block">
                            <span className="label">SKILL MAP</span>
                            <p className="num">{r.skillsSummary}</p>
                          </div>
                        </div>
                        {!r.current && (
                          <div className="d-cta">
                            <button
                              className="btn btn-ghost"
                              type="button"
                              onClick={() => openConfirm(r.id)}
                            >
                              Change target role
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* the matching honesty note lives on the ranked lens */}
          {lens === "ranked" && (
            <p className="match-note">
              Matching uses confirmed skills only. Confirm more from <a href="/progress">Progress</a> to
              widen this list. Skills you marked yourself during setup feed your baseline bars, but they
              never count toward matching.
            </p>
          )}
        </div>
      </section>

      {/* ============================================================
          SWITCH FLOW — Software Developer → Software QA Analyst (beat 6)
          ============================================================ */}

      {/* state 1 · confirm, cost first */}
      <section id="sw-confirm" hidden={flow !== "confirm"}>
        {flow === "confirm" && preSwitch && (
          <>
            <header className="band">
              <div className="bandrow">
                <div className="who">
                  <h1 className="t">Switch to {flowTarget.name}?</h1>
                </div>
              </div>
            </header>
            <div className="card sw-panel">
              <p className="sw-cost">
                Switching to {flowTarget.name} resets skill progress and training progress toward it — your
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
                  {busy ? "Switching…" : `Switch to ${flowTarget.name}`}
                </button>
                <button className="btn btn-ghost" type="button" onClick={cancelSwitch}>
                  Keep {preSwitch.fromName}
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* state 2 · honest drop + quick re-assessment */}
      <section id="sw-reset" hidden={flow !== "reset"}>
        {flow === "reset" && reset && preSwitch && (
          <>
            <header className="band">
              <div className="bandrow">
                <div className="who">
                  <h1 className="t">Score reset for your new career</h1>
                  <p className="m">
                    Your gap bars and training progress were built around {preSwitch.fromName}. Switching
                    resets them to measure {flowTarget.name}&apos;s {reassess.length} skills instead: the score
                    drops to its floor and rebuilds from what you can actually do. It starts measuring the
                    right things, not punishing you.
                  </p>
                </div>
              </div>
            </header>

            <div className="card readout">
              <div className="readout-head">
                <div>
                  <span className="label">
                    READINESS · <b className="sample-tag">{flowTarget.name.toUpperCase()}</b>
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
                <span><b>SP</b> {reset.dip.score.sp}/{WEIGHTS.sp}</span>
                <span><b>ES</b> {reset.dip.score.es}/{WEIGHTS.es}</span>
                <span><b>TP</b> {reset.dip.score.tp}/{WEIGHTS.tp}</span>
                <span><b>AR</b> {reset.dip.score.ar === null ? "—" : `${reset.dip.score.ar}/${WEIGHTS.ar}`}</span>
                <span><b>CC</b> {reset.dip.score.cc}/{WEIGHTS.cc}</span>
              </div>
              <div className="readout-fit">
                The {reset.dip.score.total} that stays is competencies and career direction: verified skills ·✓
                and an active goal survive career-specific resets.
              </div>
            </div>

            <div className="reassess">
              <h2>Where you stand on {flowTarget.name}</h2>
              <p>
                Rate each skill: claims feed your baseline, but only skills you pass a check on count as
                confirmed.
              </p>
              <div className="card skill-list">
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
          </>
        )}
      </section>

      {/* state 3 · recovered */}
      <section id="sw-recovered" hidden={flow !== "recovered"}>
        {flow === "recovered" && recovered && (
          <>
            <header className="band">
              <div className="bandrow">
                <div className="who">
                  <h1 className="t">Your baseline on {flowTarget.name}</h1>
                </div>
              </div>
            </header>

            <div className="card readout">
              <div className="readout-head">
                <div>
                  <span className="label">
                    READINESS · <b className="sample-tag">{flowTarget.name.toUpperCase()}</b>
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
                <span><b>SP</b> {recovered.score.sp}/{WEIGHTS.sp}</span>
                <span><b>ES</b> {recovered.score.es}/{WEIGHTS.es}</span>
                <span><b>TP</b> {recovered.score.tp}/{WEIGHTS.tp}</span>
                <span><b>AR</b> {recovered.score.ar === null ? "—" : `${recovered.score.ar}/${WEIGHTS.ar}`}</span>
                <span><b>CC</b> {recovered.score.cc}/{WEIGHTS.cc}</span>
              </div>
              <div className="readout-fit">
                <b className="num">
                  {recovered.from} → {recovered.score.total}
                </b>{" "}
                · the reset measured the right things, then rebuilt on what you reported.
              </div>
            </div>

            <div className="card recover-panel">
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
              {/* canon Q13: a new Training goal is suggested in the new career's terms —
                  the canon suggestion is wired to the QA walk (beat 7) */}
              {flowTarget.id === CANON_TARGET.id && (
                <div className="card nextcard">
                  <h3>Set your next goal</h3>
                  <p className="n-target num">
                    free · ~4 hours · Test Automation University
                  </p>
                  <p className="n-why">
                    Closes your first open gap in Software Testing — one of the skills QA analysts use every day.
                  </p>
                  <p className="n-why n-why-quiet">
                    When you finish the resource and pass its 5-question check, this goal marks itself done —
                    automatically, under Progress. You&apos;ll see it happen.
                  </p>
                  <div className="n-cta">
                    <button
                      className="btn btn-primary"
                      type="button"
                      disabled={qaGoalPosted || busy}
                      onClick={postQaGoal}
                    >
                      {qaGoalPosted ? "Goal set — it's on your Progress page." : "Set this goal"}
                    </button>
                  </div>
                </div>
              )}
              <div className="sw-actions rec-actions">
                {/* the view's one primary is the suggested goal; the gaps stay a ghost */}
                <a className="btn btn-ghost" href="/pathway">
                  See your gaps <Arrow />
                </a>
                <button className="btn btn-ghost" type="button" onClick={() => backToCareer()}>
                  Back to Career
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

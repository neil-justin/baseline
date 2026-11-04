"use client";

/**
 * mockups/AssessSittingMount.tsx — the hash-gated SITTING mockup realm for
 * /assessments (the admin/careers veil register, click-through). It is a
 * ruling artifact, not the build:
 *
 *   #mockups on /assessments → the retake/verify ruling, rebuilt on the
 *   2026-11-04 user ruling: the SITTING IS A FOCUSED SCREEN — header,
 *   back button, the instrument; nothing else (no sidebar, no console).
 *   It adopts the onboarding instrument's register (tap = answer + the
 *   immediate verdict band; results close as "n of n confirmed").
 *
 *   NOTHING PERSISTS: the sitting answers are client state; the build's
 *   same flow POSTs /api/verify under the acting session student. The
 *   backdrop replica rides the page's own `.v7ass` classes with the
 *   page's engine-true facts (never repainted); question copy rides the
 *   real VERIFY_BANK draws.
 */
import { usePathname } from "next/navigation";
import { useState } from "react";
import { VERIFY_BANK, type VMCQ } from "@/app/(onboarding)/onboarding/banks";
import BrandMark from "@/components/BrandMark";
import QuestionCard from "@/components/quiz/QuestionCard";
import AssBandArt from "../BandArt";
import type { SittingLite } from "./AssessSittingLite";

type Tab = "sit" | "recheck" | "verdict" | "after" | "nace";

const DOCK: { id: Tab; label: string }[] = [
  { id: "sit", label: "Whole-battery sitting" },
  { id: "recheck", label: "Per-skill re-check" },
  { id: "verdict", label: "Verdict" },
  { id: "after", label: "Rows after" },
  { id: "nace", label: "NACE entry" },
];

const NAV = [
  { href: "/dashboard", icon: "space_dashboard", label: "Dashboard" },
  { href: "/career", icon: "work", label: "Careers" },
  { href: "/pathway", icon: "checklist", label: "My Plan" },
  { href: "/assessments", icon: "fact_check", label: "Assessments" },
  { href: "/prep", icon: "description", label: "Prep" },
  { href: "/profile", icon: "account_circle", label: "Profile" },
];

export default function AssessSittingMount({ lite }: { lite: SittingLite }) {
  const pathname = usePathname();
  const [tab, setTab] = useState<Tab>("sit");

  /* client-only sitting state — the mock performs no writes. The battery
     draws the OB-3b way: the row's OWN banked claim, row index carried so
     the "after" state can re-chip exactly what the ruler confirmed. */
  type Drawn = { q: VMCQ; rowIdx: number };
  const drawn: Drawn[] = lite.rows
    .map((row, rowIdx) => ({ row, rowIdx }))
    .filter(({ row }) => row.state === "claimed" && row.banked)
    .map(({ row, rowIdx }) => ({
      rowIdx,
      q: VERIFY_BANK.find((q) => q.catalogSkill === row.name),
    }))
    .filter((d): d is Drawn => !!d.q)
    .slice(0, 5);
  const battery = drawn.length > 0
    ? drawn
    : VERIFY_BANK.slice(0, 5).map((q, i) => ({ q, rowIdx: i }));
  const single = battery[0].q;

  const [pos, setPos] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);

  const answer = (i: number, key: number) => {
    if (picked !== null) return;
    setPicked(i);
    setResults((prev) => {
      const next = [...prev];
      next[pos] = i === key;
      return next;
    });
  };
  const next = (total: number) => {
    if (typeof results[pos] !== "boolean") return;
    if (pos + 1 >= total) setTab("verdict");
    else {
      setPos(pos + 1);
      setPicked(null);
    }
  };
  const reopen = () => {
    setPos(0);
    setPicked(null);
    setResults([]);
    setTab("sit");
  };

  const item: VMCQ = tab === "recheck" ? single : battery[Math.min(pos, battery.length - 1)].q;
  const total = tab === "recheck" ? 1 : battery.length;
  const confirmed = battery.filter((_, i) => results[i] === true);
  const missed = battery.filter((_, i) => results[i] === false);

  /* the focused screen — the user's 2026-11-04 ruling: header, back button,
     the assessment; nothing else. The hub behind is unreachable while a
     sitting is on screen. */
  const sittingFocused = tab === "sit" || tab === "recheck" || tab === "verdict";

  return (
    <div className="amsk">
      {sittingFocused ? (
        <div className="amsk-focus">
          <header className="amsk-fhead" role="banner">
            <div className="side-brand">
              <BrandMark size={20} />
              <span className="brand">Baseline</span>
            </div>
            <button className="amsk-fback" onClick={() => setTab("after")}>
              <span className="amsk-fback-arrow" aria-hidden="true">‹</span>
              Back to Assessments
            </button>
          </header>
          <main className="amsk-fbody">
            {tab === "verdict" ? (
              <div className="amsk-fcol">
                <h1 className="amsk-restitle">
                  {confirmed.length} of {battery.length} confirmed.
                </h1>
                <p className="amsk-rescopy">
                  {missed.length === 0
                    ? "A real head start — the hub shows it from day one."
                    : missed.length === battery.length
                      ? "None yet — that's honest. Your self-ratings still shape the plan; the checks confirm them as you learn."
                      : `${missed.map((d) => d.q.skill).join(", ")} — still your own rating. Check again any time.`}
                </p>
                <div className="amsk-res">
                  {battery.map((d, i) => (
                    <div className="amsk-rrow" key={d.q.skill}>
                      {results[i] === true ? (
                        <span className="chip c-green">Verified ·✓</span>
                      ) : (
                        <span className="chip c-grey">Self-reported</span>
                      )}
                      <b>{d.q.skill}</b>
                    </div>
                  ))}
                </div>
                <p className="amsk-vline">
                  Verified skills stay yours — they transfer with you to any other role.
                </p>
                <div className="amsk-dfoot">
                  <button className="amsk-btn quiet" onClick={reopen}>Run it again</button>
                  <span className="amsk-spacer" />
                  <button className="amsk-btn primary" onClick={() => setTab("after")}>Done</button>
                </div>
              </div>
            ) : (
              <div className="amsk-fcol">
                <QuestionCard
                  question={item as VMCQ}
                  index={tab === "recheck" ? 0 : pos}
                  total={total}
                  picked={picked}
                  onAnswer={(i) => answer(i, item.answer)}
                  onNext={() => {
                    if (picked === null) return;
                    if (tab === "recheck" || pos + 1 >= battery.length) setTab("verdict");
                    else {
                      setPos(pos + 1);
                      setPicked(null);
                    }
                  }}
                  back={{ label: "Back to Assessments", onClick: () => setTab("after") }}
                  nextLabel={picked !== null && (tab === "recheck" || pos + 1 >= battery.length) ? "See result" : "Next"}
                />
              </div>
            )}
          </main>
        </div>
      ) : (
        <>
          {/* the hub replica — real shell, engine-true facts, nothing repainted */}
          <header className="v7-head" role="banner">
            <div className="side-brand">
              <BrandMark size={24} />
              <span className="brand">Baseline</span>
            </div>
            <span className="amsk-exit" onClick={() => { location.hash = ""; }}>
              Close mockup
            </span>
          </header>
          <aside className="v7-side amsk-side">
            <nav className="sidenav" aria-label="Primary">
              {NAV.map((n) => (
                <span key={n.href} className={n.href === "/assessments" ? "on" : ""}>
                  <span className="ms" aria-hidden="true">
                    {n.icon}
                  </span>
                  <span>{n.label}</span>
                </span>
              ))}
            </nav>
          </aside>

          <main className="v7-main" style={{ display: "block", overflowY: "auto" }}>
            <div className="v7ass" style={{ paddingTop: 12, paddingBottom: 120 }}>
              <header className="band">
                <div className="bandrow">
                  <div className="who">
                    <AssBandArt />
                    <div>
                      <h1 className="t">Assessments</h1>
                      <p className="m">
                        Prove something again — latest attempt counts, a re-take replaces it, never
                        best-ever.
                      </p>
                    </div>
                  </div>
                </div>
              </header>

              <div className="asscards">
                {/* NACE card — the entry highlight when the NACE state is on */}
                <section className="card amsk-nace" data-mock={tab === "nace" ? "entry" : undefined}>
                  <div className="head">
                    <b>NACE competency instrument</b>
                  </div>
                  <div className="nace-facts num">
                    <div className="nfact">
                      <span className="nlabel">Employability</span>
                      <span className="nval">
                        {lite.es} <small>of 30</small>
                      </span>
                    </div>
                    <div className="nfact">
                      <span className="nlabel">Verified</span>
                      <span className="nval">
                        {lite.esVerified} <small>of 7</small>
                      </span>
                    </div>
                  </div>
                  <div className="lcap num">
                    <p>{lite.takenAt ? `Latest attempt, ${lite.takenAt}.` : "Not assessed yet."}</p>
                  </div>
                  <div className="cta-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                    <span className="amsk-deep">
                      Re-take → <b>/onboarding?step=assessIntro</b> — the built instrument screens,
                      no onboarding replay
                    </span>
                    <button className="cta amsk-arm" aria-disabled="true">
                      Re-take the assessment
                    </button>
                  </div>
                </section>

                {/* role card replica */}
                <section className="card">
                  <div className="head">
                    <b>Role-based skill verification</b>
                    <span className="num">
                      {lite.careerName
                        ? `${lite.careerName} · ${lite.proven} of ${lite.total} skills proven`
                        : "no career picked yet"}
                    </span>
                  </div>
                  <div className="battery">
                    <div className="battery-copy">
                      <div className="battery-t">Whole-battery check</div>
                      <div className="battery-sub num">
                        {lite.bankedClaimed} of {lite.claimed} self-reported skills have a check
                        ready — one sitting, up to five questions.
                      </div>
                    </div>
                    <button className="cta amsk-arm" aria-disabled="true">
                      Take the role-based assessment
                    </button>
                  </div>
                  <div className="rows-label">Per-skill checks</div>
                  <div className="skillrows">
                    {lite.rows.map((r) => {
                      /* the "after" state rides the ruler's own sitting results:
                         a drawn row the ruler confirmed re-chips; a miss re-arms */
                      const drawnAt = battery.findIndex((d) => d.rowIdx === lite.rows.indexOf(r));
                      const resultAt = tab === "after" ? results[drawnAt] : undefined;
                      return (
                        <div
                          className={`skillrow${r.state === "claimed" && !r.banked ? " idle" : ""}${r.state === "open" ? " open" : ""}`}
                          key={r.name}
                        >
                          <div className="s-main">
                            <span className="s-name">{r.name}</span>
                          </div>
                          <div className="s-side">
                            {r.state === "verified" ? (
                              <span className="chip c-green">Verified ✓</span>
                            ) : r.state === "checked" ? (
                              <span className="chip c-green">Checked ✓✓</span>
                            ) : resultAt === true ? (
                              <span className="chip c-green amsk-new">Verified ·✓ just now</span>
                            ) : r.state === "claimed" && r.banked ? (
                              <button type="button" className="ass-quiz" aria-disabled="true">
                                Take the quiz
                              </button>
                            ) : r.state === "claimed" ? (
                              <span className="chip c-grey">No check yet</span>
                            ) : (
                              <span className="chip c-grey">OPEN</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="foot num">
                    Verified ✓ / Checked ✓✓ = passed a check · Self-reported = your claim.
                  </div>
                </section>
              </div>
            </div>
          </main>
        </>
      )}

      {/* the dock — realm state switcher */}
      <nav className="amsk-dock" aria-label="Mockup states">
        {DOCK.map((d) => (
          <button
            key={d.id}
            type="button"
            className={tab === d.id ? "on" : ""}
            onClick={() => {
              if (d.id === "sit" || d.id === "recheck") reopen();
              setTab(d.id);
            }}
          >
            {d.label}
          </button>
        ))}
      </nav>

      <div className="amsk-colophon amsk-fixed">
        MOCKUP · CLICK-THROUGH ONLY · NOTHING PERSISTED · ruling: the sitting is a focused screen —
        header, back, the instrument · /assessments#mockups
        <span className="amsk-route">{pathname}</span>
      </div>
    </div>
  );
}

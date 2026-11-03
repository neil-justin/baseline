"use client";

/**
 * Variant D2 — "the required-skills walk" (post-defense content-structure
 * mockup; user rulings 2026-11-03). Two rulings restructured this file:
 * 1. The content model is CANONICAL (not a gap report): one fixed walk
 *    per career, the student's evidence state overlaid — the path never
 *    re-sorts.
 * 2. CATEGORIES ARE DEMOLISHED (user ruling, same day): the roadmap is
 *    JUST the required skills, like roadmap.sh — no Floor/Proof/
 *    Recommended/Optional/Entry regions, no region captions, no region
 *    numerals. Satisfaction is carried by the evidence chips themselves;
 *    credentialing/entry matters live off this surface in the app.
 *
 * So the rendered walk = the regulated required set (canon floor nodes,
 * core-before-secondary, framework order), numbered 1..N continuously,
 * one working spine line, one container card.
 *
 * Other rulings carried from the wave:
 * - Engine state is READ-ONLY; chips verbatim (`Verified ·✓` /
 *   `Checked ·✓✓` / hatched `Self-reported`); green = earned only,
 *   blue = action only, amber = the working-on marker, grey = unmeasured;
 *   never red; no animations/transitions (DNA lock).
 * - The only local write is the working-on marker (hybrid ruling):
 *   open nodes' hollow rings are real buttons (aria-pressed) that turn
 *   amber with a `Working` chip — never a checkmark.
 * - Suggestions come from the RETHOUGHT picker (mockup/suggest.ts, canon
 *   overrides the engine pointers): satisfaction tiers, self-serve
 *   eligibility, access chip, "why" receipt, landing-page note, and —
 *   when nothing passes eligibility — the CLAIMS stay visible so the
 *   rejection is auditable.
 * - Every numeral is tabular.
 *
 * Scoped under .v7mock-d2; spine geometry reuses the wave recipes
 * (per-row 2px #DADCE0 segments; terminal row ends at the node center).
 */
import { useMemo, useState } from "react";
import type { CanonProps, PathNode } from "./canon";
import { buildPreview, previewOptions } from "./preview";
import "./variant-d2.css";

/* the canonical provenance chips (PathwayTabs wording, verbatim) */
type ClosedState = Exclude<PathNode["state"], "open">;

const closedChip = (state: ClosedState) => {
  if (state === "claimed") {
    return <span className="vd2-chip vd2-chip-hatch">Self-reported</span>;
  }
  return (
    <span className="vd2-chip vd2-chip-green">
      {state === "verified" ? "Verified ·✓" : "Checked ·✓✓"}
    </span>
  );
};

/* the access-audit chip labels removed (user ruling: the audit lane
   doesn't render) — access folds into the meta line as one word */
const ACCESS_WORD: Record<string, string> = {
  direct: "self-serve",
  account: "free (signup)",
  "exam-paid": "credential paid",
  paid: "paid",
  unclassified: "access unverified",
};

export default function MockupRegions({
  careerName,
  offPathNote,
  sections,
}: { careerName: string } & CanonProps) {
  /* the working-on marker — component-local only, defaults empty */
  const [working, setWorking] = useState<ReadonlySet<string>>(new Set());
  const [previewId, setPreviewId] = useState<string>("");
  const toggle = (id: string) =>
    setWorking((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  if (sections.length === 0) return null;

  /* THE WALK: the required skills only (categories demolished). The
     canon floor section carries the regulated set, core-before-secondary
     in framework order — the same fixed order every time. */
  const floor = sections.find((s) => s.id === "floor");
  const nodes: PathNode[] = floor?.nodes ?? [];

  /* the CAREER PREVIEW (user ask 2026-11-03: see the walk on a non-IT
     role without touching the account). The overlay = the student's
     current evidence map keyed by exact skill name — a previewed role's
     map starts open except literal name overlaps. Empty select = the
     server-fed walk for the account's own career. */
  const overlay = new Map<string, string>();
  for (const s of sections) {
    for (const n of s.nodes) {
      if (n.kind === "skill") overlay.set(n.label, n.state);
    }
  }
  const preview = previewId ? buildPreview(previewId, overlay) : null;
  const viewFloor = preview
    ? preview.props.sections.find((s) => s.id === "floor")
    : floor;
  const viewNodes = viewFloor?.nodes ?? [];

  /* the EMPTY-REGULATION edge (office-track maps are PSOC/O*NET — no
     TESDA/PSF rows): the walk renders its honest zero instead of
     disappearing (blank = silent omission, user issue standard) */
  if (nodes.length === 0) {
    return (
      <div className="v7mock-d2">
        <section className="vd2-band">
          <div className="vd2-bandrow">
            <h2>Your path to {preview?.careerName ?? careerName}</h2>
          </div>
          <p className="vd2-standing">
            None of this role&apos;s mapped skills carry a regulated source
            (TESDA/PSF) yet — the required-skill walk has no entries until
            the map is converted. Nothing is hidden deliberately: this is
            the honest zero.
          </p>
          <div className="vd2-preview">
            <label className="vd2-previewlabel" htmlFor="vd2-preview-select">
              Preview a role (mock only)
            </label>
            <select
              id="vd2-preview-select"
              value={previewId}
              onChange={(e) => setPreviewId(e.target.value)}
            >
              <option value="">
                {careerName} — your current role
              </option>
              {previewOptions()
                .filter((o) => o.name !== careerName)
                .map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
            </select>
          </div>
        </section>
      </div>
    );
  }

  /* the pitch: the walk rows render RE-ENFORCED (the pitch is the
     server-fed overlay below) */
  return (
    <div className="v7mock-d2">
      {/* surface head — the fact counter counts the REQUIRED walk (the
          category counters died with the categories); the preview select
          is mock chrome (never shipped) */}
      <section className="vd2-band">
        <div className="vd2-bandrow">
          <h2>Your path to {preview?.careerName ?? careerName}</h2>
          <span className="vd2-lead num">
            <b>{viewFloor?.closed ?? 0}</b> of {viewFloor?.total ?? 0} required skills checked
          </span>
        </div>
        <p className="vd2-standing">
          These are the role&apos;s required skills, in a fixed order — check
          them off. The walk never re-sorts; your state is the overlay.
        </p>
        <div className="vd2-preview">
          <label className="vd2-previewlabel" htmlFor="vd2-preview-select">
            Preview a role (mock only)
          </label>
          <select
            id="vd2-preview-select"
            value={previewId}
            onChange={(e) => setPreviewId(e.target.value)}
          >
            <option value="">
              {careerName} — your current role
            </option>
            {previewOptions()
              .filter((o) => o.name !== careerName)
              .map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
          </select>
        </div>
        {!preview && offPathNote ? (
          <p className="vd2-standing">{offPathNote}</p>
        ) : null}
      </section>

      {/* THE SPINE — one continuous 2px line down the left; one container
          card holds every node row (the region cards are demolished);
          each row draws its own line segment; the last row ends its
          segment at the node's center. The previewed walk re-slices the
          same row grammar. */}
      <ol className="vd2-map">
        <li className="vd2-caprow" aria-hidden="true">
          <span className="vd2-cap">Required skills</span>
        </li>
        {viewNodes.map((node, ni) => {
          const earned =
            node.state === "verified" || node.state === "checked";
          const lastNode = ni === viewNodes.length - 1;
          return (
            <li
              key={node.id}
              className={`vd2-row${lastNode ? " vd2-end" : ""}`}
            >
              <span
                className={`vd2-cir num${earned ? " vd2-cir-earned" : ""}`}
              >
                {ni + 1}
              </span>
              <div className="vd2-ncard">
                <div className="vd2-item">
                  <span className="vd2-glyph">
                    {/* closed rows ride their provenance chip; only OPEN
                        rows get the working-on toggle */}
                    {node.state === "open" ? (
                      <button
                        type="button"
                        className="vd2-ring"
                        aria-pressed={working.has(node.id)}
                        aria-label={`Mark ${node.label} as working-on`}
                        onClick={() => toggle(node.id)}
                      />
                    ) : (
                      closedChip(node.state as ClosedState)
                    )}
                  </span>
                  <div className="vd2-main">
                    <span className="vd2-skillrow">
                      <span className="vd2-skill">{node.label}</span>
                      {node.emphasis ? <span className="vd2-core">Core</span> : null}
                      {node.state === "open" && working.has(node.id) ? (
                        <span className="vd2-working">Working</span>
                      ) : null}
                      {node.startHere ? (
                        <span className="vd2-start">Start here</span>
                      ) : null}
                    </span>
                    {node.what ? <span className="vd2-what">{node.what}</span> : null}
                    {node.suggestion ? (
                      <span className="vd2-res num">
                        {node.suggestion.url ? (
                          <a
                            className="vd2-reslink"
                            href={node.suggestion.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {node.suggestion.title}
                            <span className="vd2-ext" aria-hidden="true">
                              ↗
                            </span>
                          </a>
                        ) : (
                          <span className="vd2-restitle">
                            {node.suggestion.title}
                          </span>
                        )}
                        <span className="vd2-resmeta">
                          {" "}
                          · {node.suggestion.cost} · {node.suggestion.hrs}
                          {node.access ? ` · ${ACCESS_WORD[node.access]}` : ""}
                        </span>
                      </span>
                    ) : null}
                    {/* the student-facing lane ONLY (user ruling: the audit
                        lane doesn't render): the authored per-claim learn
                        line — why this resource teaches this skill */}
                    {node.learn ? <span className="vd2-learn">{node.learn}</span> : null}
                    {/* the teachable wait-state: no taught, self-serve
                        material exists yet (adviser line) */}
                    {!node.suggestion && node.unvetted > 0 ? (
                      <span className="vd2-nores">
                        Resources exist for this skill but aren&apos;t vetted
                        yet (audit pending).
                      </span>
                    ) : null}
                    {!node.suggestion && node.unvetted === 0 ? (
                      <span className="vd2-nores">
                        No learnable resource vetted for this skill yet — ask
                        your adviser.
                      </span>
                    ) : null}
                    {node.state === "open" && node.noCheck && node.suggestion ? (
                      <span className="vd2-nocheck">No platform check yet</span>
                    ) : null}
                  </div>
                  {/* the personal overlay register — digits stay plain
                      (blue never paints them) */}
                  <span className="vd2-eff num">
                    {node.effect
                      ? `SP ${node.effect.from} → ${node.effect.to} · +${node.effect.to - node.effect.from}`
                      : "—"}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

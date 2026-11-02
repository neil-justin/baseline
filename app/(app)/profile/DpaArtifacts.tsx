"use client";

import { useState } from "react";

/**
 * Profile — the DPA data-subject rights as working surfaces (ticket 7's
 * locked mechanism, supporting-mechanics §2):
 *  - EXPORT: one JSON download of everything the system holds for this
 *    student — state, event history, credentials (metadata), the resume and
 *    letter runs, and the presence declaration. Served by /api/account/export
 *    (Content-Disposition trigger via a plain anchor — no client state).
 *  - ERASE: real cascade behind an explicit confirm state (type DELETE) —
 *    auth user → profile → state → credentials → resume/letter runs →
 *    evidence. Serve-side erasure lands in /api/account/delete.
 * No consent rules touched here (the granular consent surface is upstream).
 *
 * Phase 4 (2026-11-02): presentation re-cut into the Data rights card's
 * register — the export action renders a text link (the band's a.cta stays
 * the page's only FILLED link-CTA), the erase keeps its quiet→armed button
 * register. Actions/behavior untouched.
 *
 * 2026-11-03 build (brief B.7 + the progressive-disclosure ruling):
 *  - real DOM order — the detail line sits FIRST in the markup, the action
 *    pushed right (the old CSS grid-area reversal literally read the
 *    inventory before the action's name; now read order = visual order).
 *  - the cardinal error treated as a destructive-flow bug: the erase flow
 *    wraps in a real <form>, so Enter at the confirm input submits.
 *  - the payload inventory + the erase-order chain are GATED behind
 *    <details> (one always-visible short honest line per action — the
 *    warning cannot hide; the EXPLANATION volume collapses behind clicks).
 *  - the raw student id left the export inventory copy; the "↵" glyph and
 *    the "button stays dead until the word matches" lecture died with them
 *    (the disabled state + armed mechanic are self-evident; the erase-order
 *    line, moved here from the card's .lcap, may live under the row —
 *    gated, per the ruling).
 *  - the DELETE-confirm input carries autoComplete="off" — it must never
 *    offer saved values (2026-11-03 input-type audit).
 */
export default function DpaArtifacts() {
  const [confirmWord, setConfirmWord] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const armed = confirmWord === "DELETE";

  async function erase() {
    if (!armed || busy) return;
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: confirmWord }),
      });
      if (res.ok) {
        window.location.assign("/?deleted=1"); // the account ended — the landing is honest
      } else {
        const json = (await res.json().catch(() => null)) as { detail?: string } | null;
        setErr(json?.detail ?? "The erase didn't complete — nothing was deleted; try again.");
      }
    } catch {
      setErr("The erase didn't complete — nothing was deleted; try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="dpa">
      {/* EXPORT — detail line first (real DOM order, B.7), the action's own
          short line; the payload inventory is the gated explanation */}
      <div className="dpa-line">
        <span className="dpa-src num">One JSON download of everything the system holds for this account.</span>
        {/* Phase 4: text-link register — an anchor download must never read
            as a filled link-CTA (that's the band's a.cta alone) */}
        <a className="foot-link" href="/api/account/export">
          Export my data
        </a>
      </div>
      <details className="dpa-details">
        <summary>What the file contains</summary>
        <p className="dpa-src num">profile · state · event history · credentials · resume runs · letter runs · presence</p>
      </details>
      <div className="dpa-erase">
        {/* the ONE visible erase announcement (erase ×2 → 1) — it cannot hide */}
        <p className="dpa-warn">Erase removes the whole record — the counselor roster loses the row.</p>
        {/* the erase-order chain, gated (moved from the card's .lcap) */}
        <details className="dpa-details">
          <summary>Erase order</summary>
          <p className="dpa-src num">auth user → profile → state → credentials → resume/letter runs → evidence</p>
        </details>
        {/* a real form: Enter at the confirm input submits (B.7) */}
        <form
          className="dpa-row"
          onSubmit={(e) => {
            e.preventDefault();
            void erase();
          }}
        >
          <input
            type="text"
            className="profile-input dpa-confirm"
            aria-label="Type DELETE to confirm erasure"
            placeholder="Type DELETE to confirm"
            autoComplete="off"
            value={confirmWord}
            maxLength={20}
            onChange={(e) => {
              setConfirmWord(e.target.value);
              setErr(null);
            }}
          />
          <button className="btn btn-sm dpa-erase-btn" type="submit" disabled={!armed || busy}>
            {busy ? "Erasing…" : "Delete my account"}
          </button>
        </form>
        {err && (
          <p className="presence-err" role="alert">
            {err}
          </p>
        )}
      </div>
    </div>
  );
}

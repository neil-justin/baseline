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
 * register and byte-verbatim confirm machinery. Actions/behavior untouched.
 */
export default function DpaArtifacts({ studentId }: { studentId: string }) {
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
      <p className="dpa-line">
        {/* Phase 4: text-link register — an anchor download must never read
            as a filled link-CTA (that's the band's a.cta alone) */}
        <a className="foot-link" href="/api/account/export">
          Export my data — one JSON file ↵
        </a>
        <span className="dpa-src num">state · event history · credentials · resume runs · letter runs · presence — {studentId}</span>
      </p>
      <div className="dpa-erase">
        <p className="dpa-warn">Erase removes the whole record — the counselor roster loses the row.</p>
        <div className="dpa-row">
          <input
            type="text"
            className="profile-input dpa-confirm"
            aria-label="Type DELETE to confirm erasure"
            placeholder="Type DELETE to confirm"
            value={confirmWord}
            maxLength={20}
            onChange={(e) => {
              setConfirmWord(e.target.value);
              setErr(null);
            }}
          />
          <button className="btn btn-sm dpa-erase-btn" onClick={erase} disabled={!armed || busy}>
            {busy ? "Erasing…" : "Delete my account"}
          </button>
        </div>
        {!armed && <p className="dpa-hint num">The button stays dead until the word matches — no accidental erasure.</p>}
        {err && (
          <p className="presence-err" role="alert">
            {err}
          </p>
        )}
      </div>
    </div>
  );
}

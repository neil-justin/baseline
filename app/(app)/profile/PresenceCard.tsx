"use client";

import { useState } from "react";

/**
 * Profile → Credentials — the FOURTH kind's declaration (ticket 12): the
 * professional-presence entry (LinkedIn URL + professional contact email),
 * machine-verified AT DECLARATION. Posts to /api/credentials/presence — the
 * route grades the deterministic format checks offline (stampPresence; NO
 * network look-up ever runs — the timestamped stamp is what the demo
 * presents), and only a passing declaration persists: a malformed entry is
 * inline honest feedback, never a stored stamp and never a painted zero.
 * A private account records the honest sub-result "resolves, content not
 * machine-verifiable" inside the stamp (recorded, never silently hidden).
 * Re-declaring replaces the LATEST stamp (latest counts).
 *
 * Phase-3 re-cut (2026-11-02): the component is now the unified ledger
 * card's inset declaration SLOT (`page.tsx` renders the stamp itself as the
 * presence .lrow with its data-presence-* hooks) — the form fields, privacy
 * note, and status lines keep every hook/aria verbatim.
 * Phase-4 trim (2026-11-02, same session): `verifiedAt`/`privateNote` rode
 * the old declared-summary line and are unused by this render — dropped
 * from the props/page call site (grep-verified: page.tsx is the sole
 * consumer). The ledger row carries the declared entry's provenance ("Not
 * declared yet" stays honest here when it is).
 */

const PRIVATE_NOTE =
  "A private LinkedIn account is honestly recorded: the stamp still verifies the link's format and your professional email, and the record carries “resolves, content not machine-verifiable”. Nothing is scored differently.";

interface Props {
  /** the declared entry's re-declare copy (from the signed-in student's
   *  own state — the stamp's truth renders in the ledger row above) */
  declared: {
    linkedinUrl: string;
    email: string;
  } | null;
}

export default function PresenceCard({ declared }: Props) {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [priv, setPriv] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [privOpen, setPrivOpen] = useState(false);

  async function submit() {
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch("/api/credentials/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkedinUrl: url.trim(), email: email.trim(), privateAccount: priv }),
      });
      const json = (await res.json().catch(() => null)) as { note?: string; detail?: string } | null;
      if (res.ok) {
        setErr(null);
        setNote(json?.note ?? "Presence declared — machine-verified stamp recorded.");
        window.location.reload(); // server page re-renders the stamped record (server-state truth)
      } else {
        setErr(json?.detail ?? "The declaration was rejected — fix the named format check and try again. Nothing was saved.");
      }
    } catch {
      setErr("The declaration failed — check the connection and try again. Nothing was saved.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="presence">
      {/* the block h2 above already names it — the inner cl-label duplicate
          retired 2026-11-02; the helper keeps the machine-verified register */}
      <div className="presence-head">
        <p className="helper">Machine-verified at declaration — offline format checks only, no network look-up.</p>
      </div>
      {!declared && (
        <p className="presence-current num">Not declared yet — the presence factor stays unmeasured.</p>
      )}
      <div className="presence-fieldrow">
        <div className="presence-field">
          <label className="cl-label num" htmlFor="p-url">
            LinkedIn profile URL
          </label>
          <input
            id="p-url"
            type="url"
            className="profile-input"
            placeholder="https://www.linkedin.com/in/your-handle"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="presence-field">
          <label className="cl-label num" htmlFor="p-email">
            Professional contact email
          </label>
          <input
            id="p-email"
            type="email"
            className="profile-input"
            placeholder="you@provider.domain"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="presence-privacy">
        <label className="presence-check">
          <input
            id="p-private"
            type="checkbox"
            checked={priv}
            onChange={(e) => {
              setPriv(e.target.checked);
              setPrivOpen(e.target.checked);
            }}
          />
          <span>My LinkedIn account is private</span>
        </label>
        {privOpen && <p className="presence-priv num">{PRIVATE_NOTE}</p>}
      </div>
      <div className="presence-ctas">
        <button className="btn btn-primary btn-sm" onClick={submit} disabled={busy || url.trim() === "" || email.trim() === ""}>
          {busy ? "Stamping…" : declared ? "Re-declare and stamp" : "Declare and stamp"}
        </button>
        <span className="presence-earn num">+3 of the Application-Readiness channel when both format checks pass</span>
      </div>
      <p className={`${err ? "presence-err" : "presence-ok"}`} role="status" aria-live="polite">
        {err ?? note ?? ""}
        {!err && !note ? "The declaration stamps at the moment you declare — a verified-at timestamp you can cite, stored offline." : ""}
      </p>
    </div>
  );
}

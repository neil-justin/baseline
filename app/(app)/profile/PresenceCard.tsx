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
 */

const PRIVATE_NOTE =
  "A private LinkedIn account is honestly recorded: the stamp still verifies the link's format and your professional email, and the record carries “resolves, content not machine-verifiable”. Nothing is scored differently.";

interface Props {
  /** the declared entry summary (from the signed-in student's own state) */
  declared: {
    linkedinUrl: string;
    email: string;
    verifiedAt: string;
    privateNote: boolean;
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
      <div className="presence-head">
        <p className="cl-label num">Professional presence — the fourth credential kind</p>
        <p className="helper">
          Declared here, verified by the machine, timestamped — distinguished from the counselor-audited
          kinds above by its stamp. The check grades what runs offline: the link&apos;s format and your
          professional email&apos;s format (no network look-up — the stamp is what&apos;s presented).
        </p>
      </div>
      {declared ? (
        <p className="presence-current num">
          Declared: <span className="presence-url">{declared.linkedinUrl}</span> · {declared.email} ·{" "}
          latest stamp {declared.verifiedAt}
          {declared.privateNote ? " · content not machine-verifiable (private account)" : ""} — re-declaring
          replaces it with a fresh stamp.
        </p>
      ) : (
        <p className="presence-current num">Not declared yet — the presence factor stays unmeasured (grey, never painted).</p>
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

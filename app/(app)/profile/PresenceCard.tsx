"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
 * 2026-11-03 revamp: presence is its OWN card (page.tsx renders the card
 * head and the ledger's stamp row with its data-presence-* hooks), so the
 * old bordered `.presence` block and its fieldrow wrappers are gone — the
 * body renders plain (`.presence-body`, the family 16px body register) and
 * the two fields ride the shared `.dec-grid` directly.
 */

/* the private-account note rides ONE line — the stamp's honest sub-result
   is the fact; nothing else carries it */
const PRIVATE_NOTE =
  "Your link and email stay checked; the stamp just notes the account is private.";

/* the required-field marker — red asterisk on required labels */
function Req() {
  return (
    <span className="req" aria-hidden="true">
      *
    </span>
  );
}

interface Props {
  /** the declared entry's re-declare copy (from the signed-in student's
   *  own state — the stamp's truth renders in the ledger row above) */
  declared: {
    linkedinUrl: string;
    email: string;
  } | null;
}

export default function PresenceCard({ declared }: Props) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [priv, setPriv] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

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
        router.refresh(); // server page re-renders the stamped record (server-state truth)
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
    <div className="presence-body">
      {!declared && (
        <p className="presence-current num">Not declared yet — the presence factor stays unmeasured.</p>
      )}
      <div className="dec-grid">
        <div className="dec-field">
          <label className="cl-label num" htmlFor="p-url">
            LinkedIn profile URL <Req />
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
        <div className="dec-field">
          <label className="cl-label num" htmlFor="p-email">
            Professional contact email <Req />
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
            onChange={(e) => setPriv(e.target.checked)}
          />
          <span>My LinkedIn account is private</span>
        </label>
        {priv && <p className="presence-priv num">{PRIVATE_NOTE}</p>}
      </div>
      <div className="presence-ctas">
        <button
          className="btn btn-primary btn-sm"
          type="button"
          onClick={submit}
          disabled={busy || url.trim() === "" || email.trim() === ""}
        >
          {busy ? "Stamping…" : declared ? "Re-declare and stamp" : "Declare and stamp"}
        </button>
        <span className="presence-earn num">+3 of the Application-Readiness channel when both format checks pass</span>
      </div>
      {(err ?? note) && (
        <p className={err ? "presence-err" : "presence-ok"} role="status" aria-live="polite">
          {err ?? note}
        </p>
      )}
    </div>
  );
}

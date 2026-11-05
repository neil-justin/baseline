"use client";

/**
 * /admin/account → the change-password card (the student Account tab's
 * contract, re-registered on the console's atabs classes):
 *
 *   POST /api/auth/password — role-agnostic; the CURRENT password
 *   re-auths the change server-side (the 2026-11-03 API change), the
 *   SAME Supabase policy sign-up enforced (min length 8 + leaked-
 *   password protection) mapped to password_short / password_breached.
 *
 *   The shared NIST meter (PasswordFeedback) is presentational — its
 *   slots are reserved, so the first keystroke never shifts the card.
 *   The submit stays blocked until the current entry is non-empty and
 *   the two new entries match; the API's error map is joined to the
 *   family's plain-language copy.
 */
import { useState } from "react";
import { PasswordFeedback } from "@/app/(auth)/PasswordFeedback";
import "@/app/(auth)/password-feedback.css";

const ERRORS: Record<string, string> = {
  password_incorrect: "That current password doesn't match — retype it and try again.",
  password_short: "The password is shorter than 8 characters — length is the first honest bar.",
  password_breached: "That password appears in a public breach list — pick one that isn't known.",
  no_session: "Your session ended — sign in again to change the password.",
  server: "The change didn't complete — nothing changed; try again.",
};

export default function AccountPassword() {
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  /* client-side consistency only — the route re-auths against the
     current password; the NIST-style meter + error map otherwise
     untouched (the student card's contract verbatim). */
  const mismatch = confirm.length > 0 && password !== confirm;

  async function submit() {
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, currentPassword: current }),
      });
      const json = (await res.json().catch(() => null)) as { note?: string; error?: string } | null;
      if (res.ok) {
        setNote(json?.note ?? "Password changed — your next sign-in uses it.");
        setCurrent("");
        setPassword("");
        setConfirm("");
      } else {
        setErr(ERRORS[json?.error ?? "server"] ?? "The change didn't complete — nothing changed; try again.");
      }
    } catch {
      setErr("The change didn't complete — nothing changed; try again.");
    } finally {
      setBusy(false);
    }
  }

  const statusMsg = err ?? note;

  return (
    <div className="atabs-acc-pw">
      <div className="atabs-acc-field">
        <label className="atabs-label" htmlFor="atabs-acc-pw-current">
          Current password <span className="atabs-acc-req" aria-hidden="true">*</span>
        </label>
        <input
          id="atabs-acc-pw-current"
          type="password"
          className="atabs-acc-input"
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        />
      </div>
      <div className="atabs-acc-field">
        <label className="atabs-label" htmlFor="atabs-acc-pw">
          New password <span className="atabs-acc-req" aria-hidden="true">*</span>
        </label>
        <input
          id="atabs-acc-pw"
          type="password"
          className="atabs-acc-input"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {/* the client-only confirmation entry — a distinct id/label, the same
          new-password autocomplete; the meter below reads the FIRST new
          field, keeping the NIST feedback adjacent to its subject */}
      <div className="atabs-acc-field">
        <label className="atabs-label" htmlFor="atabs-acc-pw-confirm">
          Confirm new password <span className="atabs-acc-req" aria-hidden="true">*</span>
        </label>
        <input
          id="atabs-acc-pw-confirm"
          type="password"
          className="atabs-acc-input"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>
      <PasswordFeedback password={password} />
      {mismatch && (
        <p className="atabs-acc-err" role="status" aria-live="polite">
          Passwords don&apos;t match — retype the new password to confirm.
        </p>
      )}
      {statusMsg && (
        <p className={err ? "atabs-acc-err" : "atabs-acc-ok"} role="status" aria-live="polite">
          {statusMsg}
        </p>
      )}
      <div className="atabs-acc-ctas">
        <button
          className="atabs-acc-btn"
          type="button"
          onClick={submit}
          disabled={busy || current.length === 0 || password.length === 0 || confirm.length === 0 || password !== confirm}
        >
          {busy ? "Changing…" : "Change password"}
        </button>
      </div>
    </div>
  );
}

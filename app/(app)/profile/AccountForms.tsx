"use client";

import { useState } from "react";
import { PasswordFeedback } from "@/app/(auth)/PasswordFeedback";
import "@/app/(auth)/password-feedback.css";

/**
 * Profile → Account — the identity + password forms (Round 7 lock), riding
 * the Phase-4 card register (2026-11-02): each form is the BODY of its own
 * separated Dashboard-register card (page.tsx renders the card head; this
 * component renders the body).
 *  - Identity: email is the AUTH identity — read-only; full name, program,
 *    year level, section are editable self-service (mirrors the intake);
 *    campus is the tenant key (ticket 11) — fixed, rendered as a fixed fact.
 *    PATCH /api/profile; the state carrier mirrors the name so the score
 *    surfaces never split (one record, two views).
 *  - Password: auth-native change — POST /api/auth/password (the signed
 *    session authorizes; the NIST meter applies, shared PasswordFeedback).
 *    Phase 4 adds a client-only CONFIRM field: the submit stays blocked
 *    until the two entries match (and confirm is non-empty) — a
 *    plain-language mismatch note, success/error paths unchanged; no
 *    current-password field (the session is the authorization) and no
 *    route change.
 */

interface Identity {
  email: string;
  fullName: string;
  yearLevel: string | null;
  program: string | null;
  section: string | null;
  campus: string;
}

export function AccountIdentity({ initial }: { initial: Identity }) {
  const [fullName, setFullName] = useState(initial.fullName);
  const [yearLevel, setYearLevel] = useState(initial.yearLevel ?? "");
  const [program, setProgram] = useState(initial.program ?? "");
  const [section, setSection] = useState(initial.section ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const dirty =
    fullName.trim() !== initial.fullName ||
    (yearLevel.trim() || null) !== (initial.yearLevel ?? null) ||
    (program.trim() || null) !== (initial.program ?? null) ||
    (section.trim() || null) !== (initial.section ?? null);

  async function save() {
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: fullName.trim(), yearLevel, program, section }),
      });
      const json = (await res.json().catch(() => null)) as { note?: string; detail?: string } | null;
      if (res.ok) {
        window.location.reload(); // server truth re-renders everywhere the name reads
      } else {
        setErr(json?.detail ?? "The save didn't complete — nothing changed; try again.");
      }
    } catch {
      setErr("The save didn't complete — nothing changed; try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="acct-id">
      <div className="dec-grid">
        <div className="dec-field">
          <label className="cl-label num" htmlFor="a-name">
            Full name
          </label>
          <input
            id="a-name"
            type="text"
            className="profile-input"
            value={fullName}
            maxLength={80}
            onChange={(e) => {
              setFullName(e.target.value);
              setErr(null);
            }}
          />
        </div>
        <div className="dec-field">
          <label className="cl-label num" htmlFor="a-email">
            Email — the sign-in identity, read-only
          </label>
          <input id="a-email" type="email" className="profile-input" value={initial.email} readOnly disabled />
        </div>
      </div>
      <div className="dec-grid dec-grid-3">
        <div className="dec-field">
          <label className="cl-label num" htmlFor="a-program">
            Program
          </label>
          <input
            id="a-program"
            type="text"
            className="profile-input"
            placeholder="e.g., BS Information Systems"
            value={program}
            maxLength={80}
            onChange={(e) => {
              setProgram(e.target.value);
              setErr(null);
            }}
          />
        </div>
        <div className="dec-field">
          <label className="cl-label num" htmlFor="a-year">
            Year level
          </label>
          <input
            id="a-year"
            type="text"
            className="profile-input"
            placeholder="e.g., 4th Year"
            value={yearLevel}
            maxLength={40}
            onChange={(e) => {
              setYearLevel(e.target.value);
              setErr(null);
            }}
          />
        </div>
        <div className="dec-field">
          <label className="cl-label num" htmlFor="a-section">
            Section
          </label>
          <input
            id="a-section"
            type="text"
            className="profile-input"
            placeholder="e.g., IT-4A"
            value={section}
            maxLength={40}
            onChange={(e) => {
              setSection(e.target.value);
              setErr(null);
            }}
          />
        </div>
      </div>
      <p className="acct-campus num">Campus — {initial.campus} · the tenant key is fixed; it identifies your school&apos;s roster.</p>
      <p className={`${err ? "presence-err" : "presence-ok"}`} role="status" aria-live="polite">
        {err ?? note ?? ""}
        {!err && !note ? "The name, program, year level, and section mirror the intake — your counselor's roster reads the same record." : ""}
      </p>
      <div className="dec-ctas">
        <button className="btn btn-primary btn-sm" onClick={save} disabled={busy || !dirty}>
          {busy ? "Saving…" : "Save profile"}
        </button>
      </div>
    </div>
  );
}

export function AccountPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  /* Phase 4: client-side consistency only — the request path (session as
     authorization, the NIST-style meter, the error map) is untouched. */
  const mismatch = confirm.length > 0 && password !== confirm;

  const ERRORS: Record<string, string> = {
    password_short: "The password is shorter than 8 characters — length is the first honest bar.",
    password_breached: "That password appears in a public breach list — pick one that isn't known.",
    no_session: "Your session ended — sign in again to change the password.",
    server: "The change didn't complete — nothing changed; try again.",
  };

  async function submit() {
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = (await res.json().catch(() => null)) as { note?: string; error?: string } | null;
      if (res.ok) {
        setNote(json?.note ?? "Password changed — your next sign-in uses it.");
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

  return (
    <div className="acct-pw">
      <div className="dec-field">
        <label className="cl-label num" htmlFor="a-pw">
          New password
        </label>
        <input
          id="a-pw"
          type="password"
          className="profile-input"
          autoComplete="new-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErr(null);
          }}
        />
      </div>
      {/* the client-only confirmation entry (Phase 4) — a distinct id/label,
          the same new-password autocomplete; the meter below reads the FIRST
          field, keeping the NIST feedback adjacent to its subject */}
      <div className="dec-field">
        <label className="cl-label num" htmlFor="a-pw-confirm">
          Confirm new password
        </label>
        <input
          id="a-pw-confirm"
          type="password"
          className="profile-input"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            setErr(null);
          }}
        />
      </div>
      <PasswordFeedback password={password} />
      {mismatch && (
        <p className="presence-err" role="status" aria-live="polite">
          Passwords don&apos;t match — retype the new password to confirm.
        </p>
      )}
      <p className={`${err ? "presence-err" : "presence-ok"}`} role="status" aria-live="polite">
        {err ?? note ?? ""}
      </p>
      <div className="dec-ctas">
        {/* the card's functional filled submit (btn-primary is the form
            register; it is NOT a link-CTA — the band's a.cta stays the
            page's only filled link) — blocked until the entries match */}
        <button
          className="btn btn-primary btn-sm"
          onClick={submit}
          disabled={busy || password.length === 0 || confirm.length === 0 || password !== confirm}
        >
          {busy ? "Changing…" : "Change password"}
        </button>
      </div>
    </div>
  );
}

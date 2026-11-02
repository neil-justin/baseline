"use client";

import { type FormEvent, useState } from "react";
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
 *    2026-11-03 build (brief B.5 + the input-type audit): the identity form
 *    is a real <form> (Enter submits; `required` works); the name field
 *    carries `autoComplete="name"` + required; the year level is a
 *    CONSTRAINED <select> (1st–5th Year / Graduate — the stored value is
 *    mapped back in when it falls outside the canon list); per-field inline
 *    errors render next to each field (client, plus the API's detail
 *    mirrored onto its field); the Save sits directly under the field grid
 *    — the card's primary action, not below the campus meta.
 *  - Password: auth-native change — POST /api/auth/password (the signed
 *    session authorizes; the NIST meter applies, shared PasswordFeedback).
 *    Phase 4 adds a client-only CONFIRM field: the submit stays blocked
 *    until the two entries match (and confirm is non-empty) — a
 *    plain-language mismatch note, success/error paths unchanged; no
 *    current-password field (the session is the authorization) and no
 *    route change (the Supabase re-auth step is FLAGGED, not built —
 *    reported at the end per brief A.6). Both fields are true password
 *    inputs with `autoComplete="new-password"` (2026-11-03 audit).
 */

interface Identity {
  email: string;
  fullName: string;
  yearLevel: string | null;
  program: string | null;
  section: string | null;
  campus: string;
}

/** the constrained year-level canon (brief B.5); a stored value outside it
 *  stays selectable — it is mapped back in (kept, never silently dropped) */
const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Graduate"];
const yearOptions = (stored: string | null) => {
  const storedTrimmed = stored?.trim() ?? "";
  return storedTrimmed && !YEAR_OPTIONS.includes(storedTrimmed) ? [storedTrimmed, ...YEAR_OPTIONS] : YEAR_OPTIONS;
};

export function AccountIdentity({ initial }: { initial: Identity }) {
  const [fullName, setFullName] = useState(initial.fullName);
  const [yearLevel, setYearLevel] = useState(initial.yearLevel ?? "");
  const [program, setProgram] = useState(initial.program ?? "");
  const [section, setSection] = useState(initial.section ?? "");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [nameErr, setNameErr] = useState<string | null>(null);
  const [genErr, setGenErr] = useState<string | null>(null);
  const dirty =
    fullName.trim() !== initial.fullName ||
    (yearLevel.trim() || null) !== (initial.yearLevel ?? null) ||
    (program.trim() || null) !== (initial.program ?? null) ||
    (section.trim() || null) !== (initial.section ?? null);

  function clearErrs() {
    setNameErr(null);
    setGenErr(null);
  }

  async function save() {
    clearErrs();
    if (fullName.trim() === "") {
      setNameErr("Your full name can't be empty — the roster reads it.");
      return;
    }
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
        const detail = json?.detail ?? "The save didn't complete — nothing changed; try again.";
        // the API's detail mirrors onto its field (brief B.5) …
        if (typeof json?.detail === "string" && /name/i.test(json.detail)) {
          setNameErr(detail);
        } else {
          // … anything else (storage failure, connectivity) stays card-level
          setGenErr(detail);
        }
      }
    } catch {
      setGenErr("The save didn't complete — nothing changed; try again.");
    } finally {
      setBusy(false);
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    void save();
  }

  return (
    <div className="acct-id">
      <form onSubmit={submit}>
        <div className="dec-grid">
          <div className="dec-field">
            <label className="cl-label num" htmlFor="a-name">
              Full name
            </label>
            <input
              id="a-name"
              type="text"
              className="profile-input"
              autoComplete="name"
              required
              value={fullName}
              maxLength={80}
              onChange={(e) => {
                setFullName(e.target.value);
                clearErrs();
              }}
            />
            {nameErr && (
              <p className="field-err" role="alert">
                {nameErr}
              </p>
            )}
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
                clearErrs();
              }}
            />
          </div>
          <div className="dec-field">
            <label className="cl-label num" htmlFor="a-year">
              Year level
            </label>
            <select
              id="a-year"
              className="profile-input"
              value={yearLevel}
              onChange={(e) => {
                setYearLevel(e.target.value);
                clearErrs();
              }}
            >
              {!yearLevel && <option value="">Select year level</option>}
              {yearOptions(initial.yearLevel).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
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
                clearErrs();
              }}
            />
          </div>
        </div>
        {/* Save sits directly under the field grid (brief B.5) — the card's
            primary action, not below the campus meta */}
        <div className="dec-ctas">
          <button className="btn btn-primary btn-sm" type="submit" disabled={busy || !dirty}>
            {busy ? "Saving…" : "Save profile"}
          </button>
        </div>
      </form>
      <p className="acct-campus num">Campus — {initial.campus} · the tenant key is fixed; it identifies your school&apos;s roster.</p>
      <p className={genErr ? "presence-err" : "presence-ok"} role="status" aria-live="polite">
        {genErr ?? note ?? ""}
      </p>
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
          type="button"
          onClick={submit}
          disabled={busy || password.length === 0 || confirm.length === 0 || password !== confirm}
        >
          {busy ? "Changing…" : "Change password"}
        </button>
      </div>
    </div>
  );
}

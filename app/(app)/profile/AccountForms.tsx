"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PasswordFeedback } from "@/app/(auth)/PasswordFeedback";
import "@/app/(auth)/password-feedback.css";

/**
 * Profile → Account — the identity + password forms, riding the card
 * register (page.tsx renders each card's head; this component renders the
 * body).
 *  - Identity: email is the AUTH identity — read-only; full name, program,
 *    year level, section are editable self-service (mirrors the intake);
 *    campus is the tenant key (ticket 11) — fixed, named in the card head.
 *    PATCH /api/profile; the state carrier mirrors the name so the score
 *    surfaces never split (one record, two views).
 *    2026-11-03 revamp: Program is a CONSTRAINED <select> over the canon
 *    list (the /career degree gate matches the STORED program string
 *    against these exact codes, so Account must store the same tokens) —
 *    with an "Other — specify…" escape that swaps to a free-text input; a
 *    stored value outside the canon list maps back in as an extra option
 *    (the year-level pattern). The status line renders only when there is
 *    a message (no phantom empty <p>).
 *  - Password: auth-native change — POST /api/auth/password. The
 *    CURRENT-password field rides first (the route re-auths against it
 *    before the change — the agreed 2026-11-03 API change), then new +
 *    confirm, the shared NIST meter, and one normalized action button.
 *    The submit stays blocked until the current entry is non-empty and the
 *    two new entries match.
 */

interface Identity {
  email: string;
  fullName: string;
  yearLevel: string | null;
  program: string | null;
  section: string | null;
  campus: string;
}

/** the constrained year-level canon; a stored value outside it stays
 *  selectable — it is mapped back in (kept, never silently dropped) */
const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Graduate"];
const yearOptions = (stored: string | null) => {
  const storedTrimmed = stored?.trim() ?? "";
  return storedTrimmed && !YEAR_OPTIONS.includes(storedTrimmed) ? [storedTrimmed, ...YEAR_OPTIONS] : YEAR_OPTIONS;
};

/* the Program canon rides the page's catalog-derived list; a stored value
   outside it maps back in as an extra option (the year-level pattern) */
const programOptions = (stored: string | null, canon: string[]) => {
  const storedTrimmed = stored?.trim() ?? "";
  return storedTrimmed && !canon.includes(storedTrimmed) ? [...canon, storedTrimmed] : canon;
};

/* the required-field marker — red asterisk on required labels, absent on
   optional ones */
function Req() {
  return (
    <span className="req" aria-hidden="true">
      *
    </span>
  );
}

export function AccountIdentity({ initial, programs }: { initial: Identity; programs: string[] }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initial.fullName);
  const [yearLevel, setYearLevel] = useState(initial.yearLevel ?? "");
  const [program, setProgram] = useState(initial.program ?? "");
  const [programOther, setProgramOther] = useState(false);
  const [programFree, setProgramFree] = useState(initial.program ?? "");
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
        setNote(json?.note ?? "Saved.");
        router.refresh(); // server truth re-renders everywhere the name reads
      } else {
        const detail = json?.detail ?? "The save didn't complete — nothing changed; try again.";
        // the API's detail mirrors onto its field …
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

  const statusMsg = genErr ?? note;

  return (
    <div className="acct-id">
      <form onSubmit={submit}>
        <div className="dec-grid">
          <div className="dec-field">
            <label className="cl-label num" htmlFor="a-name">
              Full name <Req />
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
              Email
            </label>
            <input id="a-email" type="email" className="profile-input" value={initial.email} readOnly disabled />
          </div>
        </div>
        <div className="dec-grid dec-grid-3">
          <div className="dec-field">
            <label className="cl-label num" htmlFor="a-program">
              Program
            </label>
            {programOther ? (
              <input
                id="a-program"
                type="text"
                className="profile-input"
                placeholder="Type your program — e.g., BS Information Systems"
                value={programFree}
                maxLength={80}
                onChange={(e) => {
                  setProgramFree(e.target.value);
                  setProgram(e.target.value);
                  clearErrs();
                }}
              />
            ) : (
              <select
                id="a-program"
                className="profile-input"
                value={program}
                onChange={(e) => {
                  clearErrs();
                  if (e.target.value === "__other__") {
                    setProgramOther(true);
                    setProgram("");
                  } else {
                    setProgram(e.target.value);
                  }
                }}
              >
                {!program && <option value="">Select program</option>}
                {programOptions(initial.program, programs).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
                <option value="__other__">Other — specify…</option>
              </select>
            )}
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
        <div className="dec-ctas">
          <button className="btn btn-primary btn-sm" type="submit" disabled={busy || !dirty}>
            {busy ? "Saving…" : "Save profile"}
          </button>
        </div>
      </form>
      <p className="acct-campus num">Campus — {initial.campus} (fixed by your school).</p>
      {/* the status slot renders ONLY when it has a message — no phantom line */}
      {statusMsg && (
        <p className={genErr ? "presence-err" : "presence-ok"} role="status" aria-live="polite">
          {statusMsg}
        </p>
      )}
    </div>
  );
}

export function AccountPassword() {
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  /* client-side consistency only — the route re-auths against the current
     password (the 2026-11-03 API change); the NIST-style meter + error map
     otherwise untouched. */
  const mismatch = confirm.length > 0 && password !== confirm;

  const ERRORS: Record<string, string> = {
    password_incorrect: "That current password doesn't match — retype it and try again.",
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
    <div className="acct-pw">
      <div className="dec-field">
        <label className="cl-label num" htmlFor="a-pw-current">
          Current password <Req />
        </label>
        <input
          id="a-pw-current"
          type="password"
          className="profile-input"
          autoComplete="current-password"
          value={current}
          onChange={(e) => {
            setCurrent(e.target.value);
            setErr(null);
          }}
        />
      </div>
      <div className="dec-field">
        <label className="cl-label num" htmlFor="a-pw">
          New password <Req />
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
      {/* the client-only confirmation entry — a distinct id/label, the same
          new-password autocomplete; the meter below reads the FIRST new
          field, keeping the NIST feedback adjacent to its subject */}
      <div className="dec-field">
        <label className="cl-label num" htmlFor="a-pw-confirm">
          Confirm new password <Req />
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
      {statusMsg && (
        <p className={err ? "presence-err" : "presence-ok"} role="status" aria-live="polite">
          {statusMsg}
        </p>
      )}
      <div className="dec-ctas">
        <button
          className="btn btn-primary btn-sm"
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

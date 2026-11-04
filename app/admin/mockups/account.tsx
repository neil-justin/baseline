"use client";

/**
 * mockups/account.tsx — the staff ACCOUNT page mockup (2026-11-04 round:
 * the Student tab has a Profile page; counselor + sysadmin have none. The
 * user ruled a THIN-MVP own-account page — Identity read-only + Security
 * — and asked to see it as a mockup before anything builds).
 *
 *   IDENTITY — read-only: name · email (the auth identity) · role chip ·
 *   campus (the tenant key). No staff self-service edit (user ruling:
 *   name stays read-only; no API change).
 *   SECURITY — the change-password card: the CURRENT-password first
 *   field, new + confirm, the shared NIST meter, one primary pill.
 *   The Submit NEVER fetches — the change is painted client-side under
 *   the realm's mock law (the colophon carries the honesty line once).
 *
 * Design alignment: every value is CLONED from the Student Profile
 * account register (app/(app)/profile + profile.css) — the user-pinned
 * reference — as it reads AFTER its v9 sweep: borderless 16px cards,
 * Google Sans heads, pill primary at the 36px one-size register, 12px
 * chips, and the `.pw-feedback` token remap. Classes are mk-acc*
 * (mock-realm prefix law — the student's own classes are never imported),
 * drawn in mockups.css under .v7admin.
 *
 * Painted personas ride the realm's existing roster names (the Accounts
 * tab's own rows); the password meter is the REAL shared PasswordFeedback
 * — presentational only, fed from local state, so its copy stays honest.
 */
import { useEffect, useRef, useState } from "react";

import { PasswordFeedback } from "@/app/(auth)/PasswordFeedback";

/** the tail-slot meta (the ruling places "Account" in the console-controls
 *  nav, above Sign out; the mock realm mirrors that slot). The glyph rides
 *  the realm's 15-ligature admin subset — "manage_accounts" is already
 *  shipped for the sysadmin Accounts tab. */
export const ACCOUNT_ITEM = { id: "account", label: "Account", icon: "manage_accounts" } as const;

/* the realm's painted identity per role — same names the Accounts tab
 * paints, so the mockup reads as the same world */
const PERSONAS = {
  counselor: {
    name: "Ana Villanueva",
    email: "ana.villanueva@aisat.test",
    role: "COUNSELOR",
    tone: " t-b",
    campus: "AISAT",
  },
  sysadmin: {
    name: "System Admin (you)",
    email: "aisat.mallari235832+sys-admin@gmail.com",
    role: "SYSTEM ADMIN",
    tone: " t-a",
    campus: "AISAT",
  },
} as const;

const PAINTED_NOTE = "Password changed — your next sign-in uses it.";
const MISMATCH = "Passwords don't match — retype the new password to confirm.";

export function AccountPane({ role }: { role: "counselor" | "sysadmin" }) {
  const p = PERSONAS[role];
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  /* same client-side consistency contract as the real AccountPassword:
     the painted submit is enabled only when all three hold and match */
  const mismatch = confirm.length > 0 && password !== confirm;
  const ready =
    current.length > 0 && password.length > 0 && confirm.length > 0 && password === confirm;

  /* the trailing timer dies with the pane — no setState after unmount */
  const timer = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  function paint() {
    setBusy(true);
    timer.current = window.setTimeout(() => {
      setBusy(false);
      setNote(PAINTED_NOTE);
      setCurrent("");
      setPassword("");
      setConfirm("");
    }, 450);
  }

  return (
    <div className="mk-accpage">
      {/* the page head names the surface (Named-Surface Rule) — the console
          head register, not the tracked counter register */}
      <div className="mk-accpage-head">
        <h2>Account</h2>
        <p className="mk-accpage-sub">Your console identity and the sign-in that carries it.</p>
      </div>

      {/* CARD 1 — Identity (read-only: the thin-MVP ruling). Same field
          register as the student card: name + email row, then role + campus. */}
      <section className="mk-card" aria-label="Identity">
        <div className="mk-cardhead">
          <b>Identity</b>
          <span>read-only — the account the console signs you in with</span>
        </div>
        <div className="mk-acct-id">
          <div className="mk-accgrid">
            <div className="mk-accfield">
              <span className="mk-clabel">Full name</span>
              <input className="mk-accinput" type="text" value={p.name} readOnly disabled />
            </div>
            <div className="mk-accfield">
              <span className="mk-clabel">Email</span>
              <input className="mk-accinput" type="email" value={p.email} readOnly disabled />
            </div>
          </div>
          <div className="mk-accgrid">
            <div className="mk-accfield">
              <span className="mk-clabel">Role</span>
              <span>
                <span className={`mk-chip${p.tone}`}>{p.role}</span>
              </span>
            </div>
            <div className="mk-accfield">
              <span className="mk-clabel">Campus</span>
              <input className="mk-accinput" type="text" value={p.campus} readOnly disabled />
            </div>
          </div>
        </div>
      </section>

      {/* CARD 2 — Security — the real form's register, painted (never a
          fetch; the note is the client-side illusion the colophon covers) */}
      <section className="mk-card" aria-label="Security">
        <div className="mk-cardhead">
          <b>Security</b>
          <span>current password required, same policy sign-up enforced</span>
        </div>
        <div className="mk-acct-pw">
          <div className="mk-accfield">
            <label className="mk-clabel" htmlFor="mk-pw-current">
              Current password <span className="mk-req" aria-hidden="true">*</span>
            </label>
            <input
              id="mk-pw-current"
              type="password"
              className="mk-accinput"
              autoComplete="current-password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
            />
          </div>
          <div className="mk-accfield">
            <label className="mk-clabel" htmlFor="mk-pw">
              New password <span className="mk-req" aria-hidden="true">*</span>
            </label>
            <input
              id="mk-pw"
              type="password"
              className="mk-accinput"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mk-accfield">
            <label className="mk-clabel" htmlFor="mk-pw-confirm">
              Confirm new password <span className="mk-req" aria-hidden="true">*</span>
            </label>
            <input
              id="mk-pw-confirm"
              type="password"
              className="mk-accinput"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <PasswordFeedback password={password} />
          {mismatch && (
            <p className="mk-acc-err" role="status" aria-live="polite">
              {MISMATCH}
            </p>
          )}
          {note && (
            <p className="mk-acc-ok" role="status" aria-live="polite">
              {note}
            </p>
          )}
          <div className="mk-accctas">
            <button
              type="button"
              className="mk-accbtn"
              title="Mockup — client-side only"
              onClick={paint}
              disabled={busy || !ready}
            >
              {busy ? "Changing…" : "Change password"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

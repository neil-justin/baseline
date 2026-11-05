"use client";

/**
 * mockups/account.tsx — the staff ACCOUNT page mockup (2026-11-04 round:
 * counselor + sysadmin have no Profile page unlike the Student tab; the
 * user ruled a THIN-MVP own-account page — Identity read-only + Security
 * — and asked to see it before anything builds).
 *
 * RE-ASSESS 2026-11-05: the console's real pages were revamped (the
 * one-register round + the admin v9 sweep), so this pane now rides the
 * CONSOLE register, not the student-profile branch it was first cloned
 * from — every value measured off the LIVE pages (revamp-probe round):
 *
 *   ONE 8px/1px-hairline panel with the M3 level-1 shadow, the
 *   atabs-panel-head shape (600 15px Roboto title + tracked meta + the
 *   tab's own art right), tracked 11px labels, chips at the console's
 *   4px rung, and the realm chrome at the console's bump (264px column,
 *   15px/21px sidenav). The page's own sections read as the drill-in's
 *   form blocks (Identity · Security — the console's only form page
 *   relative), the shared NIST meter rides unchanged, and the single
 *   filled pill stays THE Blue-Command action of the page.
 *
 *   SECURITY NEVER FETCHES — the change is painted client-side under
 *   the realm's mock law (the colophon carries the honesty line once).
 *
 * Painted personas ride the realm's existing roster names; the password
 * meter is the REAL shared PasswordFeedback — presentational only, fed
 * from local state, so its copy stays honest.
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

/** the Account tab's head art (the per-tab metaphor law: ONE self-drawn
 *  SVG metaphor, never shared). Account's metaphor: IDENTITY — a drawn
 *  initials disc (the identity slot) beside an access badge in the
 *  blue-wash moment. Deliberately a metaphor, not data. */
function AccountArt() {
  return (
    <svg className="mk-art" width="84" height="42" viewBox="0 0 84 42" aria-hidden="true">
      <g transform="translate(2 9)">
        <rect width="30" height="24" rx="7" fill="#F1F3F4" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="15" cy="9.5" r="3.6" fill="#5F6368" opacity="0.55" />
        <path d="M7.2 19.5a7.8 7.8 0 0 1 15.6 0z" fill="#5F6368" opacity="0.55" />
      </g>
      <g transform="translate(40 4)">
        <rect width="34" height="30" rx="9" fill="var(--v-blue-wash)" />
        <circle cx="17" cy="12" r="4.2" fill="var(--v-blue-deep)" />
        <rect x="10.5" y="19.5" width="13" height="2.6" rx="1.3" fill="var(--v-blue-deep)" opacity="0.75" />
        <rect x="12.5" y="23.5" width="9" height="2.6" rx="1.3" fill="var(--v-blue-deep)" opacity="0.5" />
      </g>
    </svg>
  );
}

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
      {/* the console's one panel: atabs-panel-head shape — title + tracked
          meta left, the tab's own art right (the one-register ruling) */}
      <section className="mk-accpanel" aria-label="Account">
        <div className="mk-accpanel-head">
          <div className="mk-accpanel-headline">
            <h2 className="mk-accpanel-title">Account</h2>
            <p className="mk-accpanel-meta">{p.role} · {p.campus}</p>
          </div>
          <AccountArt />
        </div>

        {/* section 1 — Identity (read-only: the thin-MVP ruling). Same
            tracked-label + well register the student card set, inside the
            panel's 16px gutter rhythm */}
        <div className="mk-accsec">
          <h3 className="mk-accsec-title">Identity</h3>
          <div className="mk-accgrid">
            <div className="mk-accfield">
              <span className="mk-clabel">Full name</span>
              <input className="mk-accinput" type="text" value={p.name} readOnly disabled />
            </div>
            <div className="mk-accfield">
              <span className="mk-clabel">Email</span>
              <input className="mk-accinput" type="email" value={p.email} readOnly disabled />
            </div>
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

        {/* section 2 — Security — the real form's register, painted
            (never a fetch; the note is the client-side illusion the
            colophon covers) */}
        <div className="mk-accsec mk-accsec-rule">
          <h3 className="mk-accsec-title">Security</h3>
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
        </div>
      </section>
    </div>
  );
}

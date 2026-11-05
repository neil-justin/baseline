import type { Metadata } from "next";

import { requireStaff } from "@/lib/session";
import AdminVeil from "../AdminVeil";
import AccountPassword from "./PasswordForm";
import "./account.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account — Baseline",
};

/**
 * /admin/account — the staff self-account page (the 2026-11-04/05
 * rulings, built from the user-approved mockup round):
 *
 *   ONE console panel on the atabs-panel register — head (title ·
 *   tracked ROLE · CAMPUS meta · the tab's own drawn art right), then
 *   the form blocks: READ-ONLY Identity (the thin-MVP ruling: no staff
 *   self-service edit, email is the auth identity, campus is the fixed
 *   tenant key) and the Security card — the real change-password form
 *   posting /api/auth/password, role-agnostic (any signed-in session;
 *   the CURRENT password re-auths the change server-side).
 *
 *   Role law: BOTH staff roles (requireStaff gates the students out).
 *   Layout law: single column at the 560 rung, centered, every field
 *   spanning end to end.
 */
export default async function AdminAccountPage() {
  const profile = await requireStaff();
  const roleLabel = profile.role === "sysadmin" ? "SYSTEM ADMIN" : "COUNSELOR";

  return (
    <div className="v7admin">
      <AdminVeil role={profile.role} mode="detail" active="account">
        <section className="atabs-accpage" aria-labelledby="atabs-acc-h">
          <div className="panel atabs-panel atabs-accpanel">
            <div className="atabs-panel-head">
              <div className="atabs-acc-headline">
                <h2 className="atabs-panel-title" id="atabs-acc-h">
                  Account
                </h2>
                <p className="atabs-acc-meta num">
                  {roleLabel} · {profile.campus}
                </p>
              </div>
              <AccountArt />
            </div>

            {/* section 1 — Identity (read-only: the thin-MVP ruling) */}
            <div className="atabs-accsec">
              <h3 className="atabs-accsec-title">Identity</h3>
              <div className="atabs-acc-grid">
                <div className="atabs-acc-field">
                  <span className="atabs-label">Full name</span>
                  <input
                    className="atabs-acc-input"
                    type="text"
                    value={profile.fullName}
                    readOnly
                    disabled
                  />
                </div>
                <div className="atabs-acc-field">
                  <span className="atabs-label">Email</span>
                  <input
                    className="atabs-acc-input"
                    type="email"
                    value={profile.email}
                    readOnly
                    disabled
                  />
                </div>
                <div className="atabs-acc-field">
                  <span className="atabs-label">Role</span>
                  <span>
                    <span className={`atabs-chip${profile.role === "sysadmin" ? " atabs-chip-warn" : " atabs-chip-blue"}`}>
                      {roleLabel}
                    </span>
                  </span>
                </div>
                <div className="atabs-acc-field">
                  <span className="atabs-label">Campus</span>
                  <input
                    className="atabs-acc-input"
                    type="text"
                    value={profile.campus}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* section 2 — Security: the real change; the note is the
                route's own contract copy (never fabricated here) */}
            <div className="atabs-accsec atabs-accsec-rule">
              <h3 className="atabs-accsec-title">Security</h3>
              <AccountPassword />
            </div>
          </div>
        </section>
      </AdminVeil>
    </div>
  );
}

/**
 * The Account tab's head art — the per-tab metaphor law (ONE self-drawn
 * SVG, never repeated): IDENTITY. A drawn initials disc beside an
 * access badge in the blue-wash moment. aria-hidden — the head's own
 * text already names the surface.
 */
function AccountArt() {
  return (
    <svg className="atabs-acc-art" width="84" height="42" viewBox="0 0 84 42" aria-hidden="true">
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

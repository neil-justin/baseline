import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { destFor, getCounselorRequest, getCurrentProfile, getSignedInUser } from "@/lib/session";
import BrandMark from "../../../components/BrandMark";
import WelcomePicker from "./WelcomePicker";
// The .auth-body/.auth-panel/.field framework lives in app/globals.css
// (root layout); v7-auth.css is the shared (auth) skin. There is no shared
// ../auth.css in this repo — each sibling route keeps page-specific
// additions welcome doesn't use.
import "../v7-auth.css";
import "../v9-auth.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Baseline — welcome",
  description: "Tell Baseline what brings you here.",
};

/**
 * /welcome — first-time-identity gate (Google round, ADR 0006). Reached when
 * a verified session has NO profiles row. Not a dashboard shell and not a
 * marketing surface: the (auth) shell carries the honest pre-provisioned
 * state. States rendered by WelcomePicker:
 *   fresh    → the role picker (student instant; counselor = application)
 *   pending  → "application received — a System Admin approves" + sign out
 *   rejected → the decision message + resubmission affordance
 * A profile row existing at all → straight redirect via destFor (back-nav
 * cannot loop here).
 */
export default async function WelcomePage() {
  const profile = await getCurrentProfile();
  if (profile) redirect(await destFor(profile));

  const user = await getSignedInUser();
  if (!user) redirect("/signin"); // /auth/confirm's via=google branch guarantees a session; belt + suspenders

  const request = await getCounselorRequest(user.id);
  const initial = request?.status === "pending" ? "pending" : request?.status === "rejected" ? "rejected" : "fresh";

  return (
    <div className="auth-body v7auth v9auth">
      <header className="bar">
        <div className="bar-in" style={{ justifyContent: "center" }}>
          <a href="/" className="brand">
            <BrandMark size={24} />
            <span className="brand-name">Baseline</span>
          </a>
        </div>
      </header>

      <main className="auth-main" id="main">
        <div className="auth-panel">
          <div className="auth-head">
            <h1>Welcome, {user.fullName}.</h1>
          </div>

          <WelcomePicker initial={initial} initialNote={request?.note ?? ""} />
        </div>
      </main>
    </div>
  );
}

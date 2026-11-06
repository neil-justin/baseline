import type { Metadata } from "next";
import { BackArrow } from "../glyphs";
import BrandMark from "../../../components/BrandMark";
import GoogleAuth from "../GoogleAuth";
import SignInForm from "./SignInForm";
import "../form-auth.css";

export const metadata: Metadata = {
  title: "Baseline — sign in",
  description: "Sign in to your Baseline account.",
};

/**
 * Sign-in surface — REBUILT 2026-11-06 (form-auth brief): not the ported
 * prototype's split card. One centered column, card-free, no marketing
 * pane. Google round: the OAuth button under the credential form, and the
 * honest notice when a Google consent was denied/expired (state=google
 * from /auth/confirm's via=google branch — DISTINCT from the recovery
 * error, which never lands here).
 */
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const { state } = await searchParams;
  return (
    <div className="fauth">
      <header className="fauth-bar">
        <a href="/" className="fauth-brand">
          <BrandMark size={22} />
          <span>Baseline</span>
        </a>
      </header>

      <main className="fauth-main" id="main">
        <h1>Sign in to Baseline</h1>
        <p className="fauth-sub">Pick up where you left off.</p>

        {state === "google" && (
          <div
            className="field-err"
            role="status"
            style={{ display: "block", marginTop: -14, marginBottom: 18 }}
          >
            The Google sign-in didn&apos;t complete — consent was closed or it
            expired. Try it again from the button below.
          </div>
        )}

        <SignInForm />

        <GoogleAuth />

        <p className="fauth-alt">
          New here?{" "}
          <a href="/signup">
            Start the check <BackArrow />
          </a>
        </p>
      </main>
    </div>
  );
}

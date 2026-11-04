import type { Metadata } from "next";
import { BackArrow } from "../glyphs";
import GoogleAuth from "../GoogleAuth";
import SignInForm from "./SignInForm";
import "./auth.css";
import "../v7-auth.css";
import "../v9-auth.css";

export const metadata: Metadata = {
  title: "Baseline — sign in",
  description: "Sign in to your Baseline account.",
};

/**
 * Sign-in surface — markup ported 1:1 from prototype/signin.html. Google
 * round: the OAuth button under the credential form, and the honest notice
 * when a Google consent was denied/expired (state=google from
 * /auth/confirm's via=google branch — DISTINCT from the recovery error,
 * which never lands here).
 */
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const { state } = await searchParams;
  return (
    <div className="auth-body v7auth v9auth">
      <header className="bar">
        <div className="bar-in" style={{ justifyContent: "center" }}>
          <a href="/" className="brand">
            <span className="brand-mark" aria-hidden="true"></span>
            <span className="brand-name">Baseline</span>
          </a>
        </div>
      </header>

      <main className="auth-main" id="main">
        <div className="auth-panel">
          <div className="auth-head">
            <h1>Sign in.</h1>
          </div>

          {state === "google" && (
            <div className="field-err" role="status" style={{ display: "block", marginBottom: 14 }}>
              The Google sign-in didn&apos;t complete — consent was closed or it
              expired. Try it again from the button below.
            </div>
          )}

          <SignInForm />

          <GoogleAuth />

          <p className="auth-alt">
            New here?{" "}
            <a href="/signup">
              Start check <BackArrow />
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

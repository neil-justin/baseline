import type { Metadata } from "next";
import { BackArrow } from "../glyphs";
import ForgotForm from "./ForgotForm";
import "./auth.css";
import "../v7-auth.css";

export const metadata: Metadata = {
  title: "Baseline — reset your password",
  description: "Request a password reset email for your Baseline account.",
};

/** Forgot-password surface (auth round 2) — same frame as sign-in/sign-up:
 * request a reset email → the link lands on /auth/confirm → /reset. An
 * expired/used link bounces back here as ?state=expired (from /auth/confirm)
 * with the honest "request a new link" notice. */
export default async function ForgotPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const { state } = await searchParams;
  return (
    <div className="auth-body v7auth">
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
            <h1>Reset your password.</h1>
          </div>

          <ForgotForm expired={state === "expired"} />

          <p className="auth-alt">
            Remembered it after all?{" "}
            <a href="/signin">
              Sign in <BackArrow />
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

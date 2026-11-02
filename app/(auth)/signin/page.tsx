import type { Metadata } from "next";
import { BackArrow } from "../glyphs";
import SignInForm from "./SignInForm";
import "./auth.css";
import "../v7-auth.css";

export const metadata: Metadata = {
  title: "Career Readiness — sign in",
  description: "Sign in to your Career Readiness account.",
};

/** Sign-in surface — markup ported 1:1 from prototype/signin.html, links adapted (signup.html → /signup). */
export default function SignInPage() {
  return (
    <div className="auth-body v7auth">
      <header className="bar">
        <div className="bar-in" style={{ justifyContent: "center" }}>
          <a href="/" className="brand">
            <span className="brand-mark" aria-hidden="true"></span>
            <span className="brand-name">Career Readiness</span>
          </a>
        </div>
      </header>

      <main className="auth-main" id="main">
        <div className="auth-panel">
          <div className="auth-head">
            <h1>Sign in.</h1>
          </div>

          <SignInForm />

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

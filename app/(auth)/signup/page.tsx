import type { Metadata } from "next";
import { ForwardArrow } from "../glyphs";
import SignupForm from "./SignupForm";
import "./auth.css";

export const metadata: Metadata = {
  title: "Career Readiness — start the 5-minute check",
  description: "Create your account and take the 5-minute readiness check.",
};

/** Sign-up surface — markup ported 1:1 from prototype/signup.html, links adapted (signin.html → /signin). */
export default function SignUpPage() {
  return (
    <div className="auth-body">
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
            <h1
              style={{
                fontSize: "clamp(1.5rem,2.6vw,1.9rem)",
                fontWeight: 640,
                letterSpacing: "-0.025em",
                lineHeight: 1.15,
              }}
            >
              Start the check.
            </h1>
            <p className="auth-claim" style={{ color: "var(--ink-2)", fontSize: 15.5 }}>
              5-minute check · no credit card, no list to join
            </p>
          </div>

          <SignupForm />

          <p className="auth-alt">
            Already have an account?{" "}
            <a href="/signin">
              Sign in <ForwardArrow />
            </a>
          </p>
          <p className="auth-note">YOUR ANSWERS STAY YOURS</p>
        </div>
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import { ForwardArrow } from "../glyphs";
import BrandMark from "../../../components/BrandMark";
import GoogleAuth from "../GoogleAuth";
import SignupForm from "./SignupForm";
import "../form-auth.css";

export const metadata: Metadata = {
  title: "Baseline — start the readiness check",
  description: "Create your account and take the readiness check.",
};

/**
 * Sign-up surface — rebuilt 2026-11-06 on the form-auth DNA (the same
 * brief as the rebuilt /signin): one centered column, card-free, no
 * marketing pane, no decorative shapes.
 */
export default function SignUpPage() {
  return (
    <div className="fauth">
      <header className="fauth-bar">
        <a href="/" className="fauth-brand">
          <BrandMark size={22} />
          <span>Baseline</span>
        </a>
      </header>

      <main className="fauth-main" id="main">
        <h1>Start the check</h1>
        <p className="fauth-sub">
          Create an account — 15 minutes to an honest score.
        </p>

        <SignupForm />

        <GoogleAuth />

        <p className="fauth-alt">
          Already have an account?{" "}
          <a href="/signin">
            Sign in <ForwardArrow />
          </a>
        </p>
      </main>
    </div>
  );
}

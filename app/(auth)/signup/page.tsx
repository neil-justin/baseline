import type { Metadata } from "next";
import { ForwardArrow } from "../glyphs";
import BrandMark from "../../../components/BrandMark";
import GoogleAuth from "../GoogleAuth";
import Reveal from "@/components/Reveal";
import SignupForm from "./SignupForm";
import "./auth.css";
import "../v7-auth.css";
import "../v9-auth.css";

export const metadata: Metadata = {
  title: "Baseline — start the readiness check",
  description: "Create your account and take the readiness check.",
};

/** Sign-up surface — markup ported 1:1 from prototype/signup.html, links adapted (signin.html → /signin). */
export default function SignUpPage() {
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
        <div className="auth-split">
          <Reveal className="auth-head" delay={0}>
            <h1>Start the check.</h1>
          </Reveal>

          <div className="split-card">
            <div className="split-shapes" aria-hidden="true">
              <i className="sh sh-circle"></i>
              <i className="sh sh-clover"><i></i><i></i><i></i><i></i></i>
              <i className="sh sh-pill"></i>
              <i className="sh sh-quarter"></i>
              <i className="sh sh-mark"><i></i></i>
              <i className="sh sh-dot"></i>
            </div>

            <div className="split-form">
              <SignupForm />

              <GoogleAuth />

              <p className="auth-alt">
                Already have an account?{" "}
                <a href="/signin">
                  Sign in <ForwardArrow />
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

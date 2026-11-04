import type { Metadata } from "next";
import { BackArrow } from "../glyphs";
import { supabaseServer } from "@/lib/supabase/server";
import ResetForm from "./ResetForm";
import "./auth.css";
import "../v7-auth.css";
import "../v9-auth.css";

export const metadata: Metadata = {
  title: "Baseline — set a new password",
  description: "Choose a new password for your Baseline account.",
};

export const dynamic = "force-dynamic";

/**
 * Reset surface (auth round 2) — the recovery link lands here via
 * /auth/confirm, which exchanged the emailed code for a real session. This
 * page is session-honest like every other surface: no session (expired/used
 * link, or the link opened in a different browser than the request) renders
 * the honest "request a fresh link" state — never a fake form.
 */
export default async function ResetPage() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const hasSession = Boolean(user);

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
            <h1>{hasSession ? "Set a new password." : "That link has expired."}</h1>
          </div>

          {hasSession ? (
            <ResetForm />
          ) : (
            <form noValidate>
              <div className="field" style={{ marginTop: 0 }}>
                <p className="reset-lead">
                  Reset links work once and only in the browser that requested them. Request a
                  fresh link and open it here.
                </p>
              </div>
              <a href="/forgot" className="btn btn-primary btn-block">
                Request a fresh link
              </a>
            </form>
          )}

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

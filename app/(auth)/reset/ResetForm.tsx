"use client";

import { useState } from "react";
import { PasswordFeedback, passwordChecklist } from "../PasswordFeedback";

type PassErr = null | { kind: "short"; missing: number } | { kind: "spaces" } | { kind: "common" };

/** Reset form (auth round 2) — the caller holds the recovery session (the
 * /auth/confirm code exchange). New password + the shared meter/checklist →
 * POST `/api/auth/reset` → `auth.updateUser({ password })` → the session
 * carries on (standard Supabase auto-refresh, no fixed cap) → /dashboard.
 * Error contract (the route's, mapped here): no_session | password_short |
 * password_breached | server. */
export default function ResetForm() {
  const [showPw, setShowPw] = useState(false);
  const [pending, setPending] = useState(false);
  const [pw, setPw] = useState("");
  const [passErr, setPassErr] = useState<PassErr>(null);
  const [topErr, setTopErr] = useState<string | null>(null);

  function passwordProblem(value: string): PassErr {
    if (value.length < 8) return { kind: "short", missing: 8 - value.length };
    if (value !== value.trim()) return { kind: "spaces" };
    if (!passwordChecklist(value).notCommon) return { kind: "common" };
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const pErr = passwordProblem(password);
    setPassErr(pErr);
    setTopErr(null);
    if (pErr) return;

    setPending(true);
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        window.location.assign(data?.dest ?? "/dashboard");
        return;
      }
      const data = await res.json().catch(() => null);
      if (data?.error === "no_session") setTopErr("no_session");
      else if (data?.error === "password_breached") setTopErr("password_breached");
      else if (data?.error === "password_short") setPassErr({ kind: "short", missing: 8 - password.length });
      else setTopErr("server");
    } catch {
      setTopErr("server");
    } finally {
      setPending(false);
    }
  }

  return (
    <form id="reset-form" noValidate onSubmit={onSubmit}>
      <div className="field" style={{ marginTop: 0 }}>
        <div className="field-label">
          <label htmlFor="f-pass">New password</label>
          <span className="rule">8+ CHARACTERS</span>
        </div>
        <div style={{ position: "relative" }}>
          <input
            type={showPw ? "text" : "password"}
            id="f-pass"
            name="password"
            autoComplete="new-password"
            aria-describedby="err-pass pw-checklist"
            placeholder="8 or more characters"
            style={{ paddingRight: 64 }}
            aria-invalid={passErr !== null}
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              if (passErr) setPassErr(passwordProblem(e.target.value));
            }}
          />
          <button
            type="button"
            id="pass-toggle"
            aria-pressed={showPw}
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "0.04em",
              color: "var(--ink-2)",
              padding: "6px 8px",
            }}
            onClick={() => setShowPw((v) => !v)}
          >
            {showPw ? "HIDE" : "SHOW"}
          </button>
        </div>
        <PasswordFeedback password={pw} />
        <p
          className="field-err"
          id="err-pass"
          role="alert"
          style={{ display: passErr ? "block" : undefined }}
        >
          {passErr?.kind === "short"
            ? `Short by ${passErr.missing} character${passErr.missing === 1 ? "" : "s"} — 8 or more, please.`
            : passErr?.kind === "spaces"
              ? "No spaces at the start or end of the password."
              : passErr?.kind === "common"
                ? "That password is on public breach lists — please pick a different one."
                : "Check the password."}
        </p>
      </div>

      <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
        {pending ? "Saving…" : "Save the new password"}
      </button>

      {topErr && (
        <div className="field-err" id="err-top" role="alert" style={{ display: "block", marginTop: 14 }}>
          {topErr === "no_session" ? (
            <>
              Your session expired —{" "}
              <a href="/forgot" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
                request a fresh reset link
              </a>
              .
            </>
          ) : topErr === "password_breached" ? (
            <>That password shows up on public breach lists — please pick a different one.</>
          ) : (
            <>That didn&apos;t go through. Try once more in a minute.</>
          )}
        </div>
      )}
    </form>
  );
}

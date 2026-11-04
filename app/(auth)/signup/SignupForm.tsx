"use client";

import { useState } from "react";
import { PasswordFeedback, passwordChecklist } from "../PasswordFeedback";
import { ArrowRight } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Password field-error kinds (submit-time): short | edge-spaces | common. */
type PassErr = null | { kind: "short"; missing: number } | { kind: "spaces" } | { kind: "common" };

/** Sign-up form — ported from prototype/signup.html (no confirm-password). Writes
 * a student-format account via POST `/api/auth/signup` with `{ name, email,
 * password }`. Self-serve sign-up is students-only — admins are provisioned
 * with the seed (post-defense: invited).
 *
 * Password feedback (auth round 2): live strength meter + plain-language
 * checklist (PasswordFeedback) tick as the user types; the meter/checklist are
 * client-side UX only — the server contract stays authoritative. Submit is
 * blocked on the fixable client items (8+ chars, no edge spaces, not on the
 * tiny common-list pre-check); a bypassed client still meets the server's
 * policy errors: `password_short` and `password_breached` (Supabase
 * HaveIBeenPwned protection, mapped in the route). */
export default function SignupForm() {
  const [showPw, setShowPw] = useState(false);
  const [pending, setPending] = useState(false);
  const [nameErr, setNameErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [pw, setPw] = useState("");
  const [passErr, setPassErr] = useState<PassErr>(null);
  const [noteShown, setNoteShown] = useState(false);
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
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    setNameErr(!name);
    setEmailErr(!EMAIL_RE.test(email));
    const pErr = passwordProblem(password);
    setPassErr(pErr);
    setTopErr(null);

    const ok = name && EMAIL_RE.test(email) && !pErr;
    if (!ok) return;

    // Prototype behavior kept: the collapsed note reveals once the form validates.
    setNoteShown(true);

    setPending(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        window.location.assign(data?.dest ?? "/onboarding");
        return;
      }
      const data = await res.json().catch(() => null);
      if (data?.error === "email_taken") setTopErr("email_taken");
      else if (data?.error === "password_breached") setTopErr("password_breached");
      else if (data?.error === "password_short") setTopErr("password_short");
      else setTopErr("server");
    } catch {
      setTopErr("server");
    } finally {
      setPending(false);
    }
  }

  return (
    <form id="signup-form" noValidate onSubmit={onSubmit}>
      <div className="field" style={{ marginTop: 0 }}>
        <div className="field-label">
          <label htmlFor="f-name">Full name</label>
        </div>
        <input
          type="text"
          id="f-name"
          name="name"
          autoComplete="name"
          aria-describedby="err-name"
          placeholder="Juan dela Cruz"
          aria-invalid={nameErr}
        />
        <p className="field-err" id="err-name" role="alert" style={{ display: nameErr ? "block" : undefined }}>
          Name is required — one line.
        </p>
      </div>

      <div className="field">
        <div className="field-label">
          <label htmlFor="f-email">Email</label>
        </div>
        <input
          type="email"
          id="f-email"
          name="email"
          autoComplete="email"
          aria-describedby="err-email"
          placeholder="you@example.com"
          aria-invalid={emailErr}
        />
        <p className="field-err" id="err-email" role="alert" style={{ display: emailErr ? "block" : undefined }}>
          That doesn&apos;t look like an email address. Check for a typo.
        </p>
      </div>

      <div className="field">
        <div className="field-label">
          <label htmlFor="f-pass">Password</label>
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
        {pending ? "Creating account…" : "Create account"}
      </button>

      {topErr && (
        <div className="field-err" id="err-top" role="alert" style={{ display: "block", marginTop: 14 }}>
          {topErr === "email_taken" ? (
            <>
              That email already has an account.{" "}
              <a href="/signin" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
                Sign in instead{" "}
                <ArrowRight size={14} aria-hidden="true" />
              </a>
            </>
          ) : topErr === "password_breached" ? (
            <>That password shows up on public breach lists — please pick a different one.</>
          ) : topErr === "password_short" ? (
            <>That password is too short — 8 or more characters, please.</>
          ) : (
            <>That didn&apos;t go through. Try once more in a minute.</>
          )}
        </div>
      )}

      <div className="proto-note" id="proto-note" style={{ display: noteShown ? "block" : undefined }}>
        Your answers stay yours — the number only grows when you prove a skill.
      </div>
    </form>
  );
}

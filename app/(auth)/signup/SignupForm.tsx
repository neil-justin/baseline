"use client";

import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Sign-up form — ported from prototype/signup.html (no confirm-password). Writes
 * a student-format account via POST `/api/auth/signup` with `{ name, email,
 * password }`; the route is added in the session task. Self-serve sign-up is
 * students-only — admins are provisioned with the seed (post-defense: invited). */
export default function SignupForm() {
  const [showPw, setShowPw] = useState(false);
  const [pending, setPending] = useState(false);
  const [nameErr, setNameErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [passShort, setPassShort] = useState<number | null>(null);
  const [noteShown, setNoteShown] = useState(false);
  const [topErr, setTopErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    setNameErr(!name);
    setEmailErr(!EMAIL_RE.test(email));
    setPassShort(password.length < 8 ? 8 - password.length : null);
    setTopErr(null);

    const ok = name && EMAIL_RE.test(email) && password.length >= 8;
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
      else setTopErr("server");
    } catch {
      setTopErr("server");
    } finally {
      setPending(false);
    }
  }

  const passShortCount = passShort;

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
            aria-describedby="err-pass"
            placeholder="8 or more characters"
            style={{ paddingRight: 64 }}
            aria-invalid={passShortCount !== null}
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
        <p
          className="field-err"
          id="err-pass"
          role="alert"
          style={{ display: passShortCount !== null ? "block" : undefined }}
        >
          {passShortCount !== null
            ? `Short by ${passShortCount} character${passShortCount === 1 ? "" : "s"} — 8 or more, please.`
            : "Short password."}
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
                Sign in instead →
              </a>
            </>
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

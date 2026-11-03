"use client";

import { useState } from "react";

/**
 * The role picker (ADR 0006). Two declinations, object-level honest:
 *   student   → POST /api/auth/provision { role:"student" } — the SAME
 *               provisioning the password form performs, then dest
 *               /onboarding (fresh by construction);
 *   counselor → POST /api/auth/provision { role:"counselor", note } —
 *               NO access granted; a pending application; every gate
 *               bounces here until a System Admin approves.
 * The pick is an answer, not a grant: the counselor flip happens in
 * /api/admin/counselor-requests/[id], executed by a sysadmin session.
 */
type State = "fresh" | "pending" | "rejected";

export default function WelcomePicker({ initial, initialNote }: { initial: State; initialNote?: string }) {
  const [state, setState] = useState<State>(initial);
  const [note, setNote] = useState(initialNote ?? "");
  const [acting, setActing] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function post(role: "student" | "counselor") {
    setActing(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, note: role === "counselor" ? note : undefined }),
      });
      const data = (await res.json().catch(() => null)) as { dest?: string; error?: string } | null;
      if (!res.ok) {
        if (data?.error === "note_required") setErr("A line about who you advise is required.");
        else if (data?.error === "not_signed_in") setState("fresh"); // session expired mid-decision — honest fresh render, next click re-authenticates
        else if (data?.error === "already_provisioned") {
          // provisioned while this surface was open — no redirect() here
          // (server navigation API); a full navigation from the 409 body's
          // dest sends to where the roster says, "/signin" if unparseable
          const dest = typeof data?.dest === "string" ? data.dest : "/signin";
          window.location.assign(dest);
          return;
        }
        else setErr("That didn't go through. Try once more in a minute.");
        return;
      }
      if (role === "student" && data?.dest) {
        window.location.assign(data.dest);
        return;
      }
      // counselor → stays on this surface
      setState("pending");
    } catch {
      setErr("That didn't go through. Try once more in a minute.");
    } finally {
      setActing(false);
    }
  }

  if (state === "pending") {
    return (
      <div id="welcome-pending">
        <p>
          Your counselor application is in and waiting for a System Admin —
          once approved, sign in again and the Admin console opens for you.
          Nothing is accessible from this account until that approval.
        </p>
        <p style={{ marginTop: 8 }}>
          Already approved while you were here? Reload this page —
          it re-checks your account and sends you to your console when the
          roster says so.
        </p>
        <form action="/api/auth/signout" method="post">
          <button type="submit" className="btn btn-block">Sign out</button>
        </form>
      </div>
    );
  }

  return (
    <div id="welcome-picker">
      {state === "rejected" && (
        <div className="field-err" role="status" style={{ display: "block", marginBottom: 14 }}>
          That application wasn&apos;t approved. You can correct the details
          below and submit again.
        </div>
      )}
      <p>
        One choice tells the check what to measure. Your role is a decision the
        system records — privilege comes from a person, not this click.
      </p>

      <button
        type="button"
        id="pick-student"
        className="btn btn-primary btn-block"
        disabled={acting}
        onClick={() => post("student")}
      >
        {acting ? "Setting up…" : "I'm a student — start my check"}
      </button>

      <p className="auth-or" aria-hidden="true">— or —</p>

      <div className="proto-note" id="counselor-request" style={{ display: "block", marginTop: 16 }}>
        <label htmlFor="c-note">Requesting counselor access — one line about who you advise:</label>
        <input
          type="text"
          id="c-note"
          name="c-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Advises AB Psych, IAB section, and the career-path cohort"
        />
        <button
          type="button"
          id="c-send"
          className="btn btn-block"
          disabled={acting || note.trim().length < 3}
          onClick={() => post("counselor")}
        >
          {acting ? "Sending…" : "Request counselor access"}
        </button>
      </div>

      {err && (
        <div className="field-err" id="welcome-err" role="alert" style={{ display: "block", marginTop: 14 }}>
          {err}
        </div>
      )}
    </div>
  );
}

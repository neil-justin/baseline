"use client";

import { useRef, useState } from "react";

/**
 * The cover-letter check's intake motion (ticket 12): pick ONE file (TXT/PDF/
 * DOCX) plus the OPTIONAL employer anchor field, POST to
 * /api/cover-letter/check, and on a successful check the page reloads — the
 * server page re-renders the stored run (the ResumeUpload reload pattern:
 * the run's result is server-rendered from the store; a document load
 * re-renders honestly every time). Rejections show the locked reason inline
 * (aria-live) and persist nothing. NO authoring surface exists — there is no
 * paste box, no generated letter, no editing inside the system (the same hard
 * fence as the resume round). Per-file AM semantics: this runs INDEPENDENT
 * of the resume upload; each flow keeps its own latest attempt.
 */

const REJECT_COPY: Record<string, string> = {
  bad_form: "The upload didn't arrive complete — pick the file again.",
  unauthorized: "Your session ended — sign in again and re-upload.",
  no_career: "Pick your target role first — the check measures against it.",
  no_file: "Choose a cover letter file first (TXT, PDF, or DOCX).",
  multi_file: "One file at a time — upload the cover letter as a single PDF, DOCX, or TXT.",
  oversize: "Over the 5 MB limit — a plain, text-only letter export stays well under it. Remove images and export the letter again.",
  empty: "The file carries almost no text — a letter needs its body.",
  encrypted: "This file is password-protected or encrypted — save an unlocked copy as a PDF, DOCX, or TXT and upload that.",
  scanned: "This PDF carries essentially no readable text — it reads as a scan or an image-only export. The letter has to be real text, not a picture of it. Re-export a text-based PDF (or a .txt/.docx).",
  wrong_type: "This file's content is not readable text (or a PDF/Word carrier of one) — the extension alone isn't trusted.",
  parse_error: "This file's structure couldn't be read — try exporting the letter again.",
  format_check_failed: "The format checks didn't pass. Nothing was saved or scored.",
};

export default function LetterUpload({ careerName, employerRow }: { careerName: string; employerRow: string }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [employer, setEmployer] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function check() {
    setErr(null);
    const files = fileInput.current?.files;
    if (!files || files.length === 0) {
      setErr("Choose a cover letter file first (TXT, PDF, or DOCX).");
      return;
    }
    const form = new FormData();
    form.append("letter", files[0]);
    const anchor = employer.trim();
    if (anchor.length > 0) {
      form.append("employer", anchor);
    } // absent = the optional check skips honestly — nothing invented
    setBusy(true);
    try {
      const res = await fetch("/api/cover-letter/check", { method: "POST", body: form });
      if (res.ok) {
        window.location.reload(); // the server page re-renders the stored run
      } else {
        const json = (await res.json().catch(() => null)) as { error?: string; detail?: string } | null;
        const code = json?.error ?? "parse_error";
        setErr(json?.detail ?? REJECT_COPY[code] ?? "The file was rejected — try exporting the letter as a PDF, DOCX, or TXT.");
      }
    } catch {
      setErr("The upload failed — check the connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel block cl-upload" aria-label="Run the cover-letter check">
      <div className="b-head">
        <h2>Run the letter check — one TXT, PDF, or DOCX at a time</h2>
        <p className="helper">
          The letter is read for feedback inside this run and never stored. Target role: <b>{careerName}</b>.
        </p>
      </div>
      <div className="cl-row">
        <div className="cl-field">
          <label className="cl-label num" htmlFor="cl-file">
            Your letter
          </label>
          <input
            ref={fileInput}
            type="file"
            id="cl-file"
            className="rs-file"
            accept=".txt,.pdf,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            aria-label="Cover letter file (TXT, PDF, or DOCX — one file, up to 5 MB)"
            onChange={() => setErr(null)}
          />
        </div>
        <div className="cl-field cl-field-anchor">
          <label className="cl-label num" htmlFor="cl-employer">
            Employer <span className="cl-opt num">optional</span>
          </label>
          <input
            type="text"
            id="cl-employer"
            className="cl-input"
            value={employer}
            maxLength={120}
            aria-label="Employer (optional)"
            placeholder="Leave empty if you're applying generally"
            onChange={(e) => setEmployer(e.target.value)}
          />
        </div>
        <button className="btn btn-primary btn-sm" onClick={check} disabled={busy}>
          {busy ? "Reading the letter…" : "Run the letter check"}
        </button>
      </div>
      <p className={`cl-note${err ? " cl-err" : ""}`} role="status" aria-live="polite">
        {err ??
          "Rejections are named here: oversized, unreadable, encrypted, image-only (no OCR — re-export), or more than one file. If you leave the employer field empty, that check is skipped honestly — it prints “" +
            employerRow +
            "” and drops from the fraction. Unlimited re-runs; your latest letter check counts — a new run replaces the stored one."}
      </p>
    </section>
  );
}

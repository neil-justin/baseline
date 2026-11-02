"use client";

import { useRef, useState } from "react";

/**
 * The cover-letter checker's intake (v7.4 minimal-tool recut): the SAME
 * dropzone pattern as the resume — one file (TXT/PDF/DOCX) lands and the
 * check runs immediately. The OPTIONAL employer anchor sits as one small
 * field BENEATH the zone (fill it before dropping, or leave it empty — the
 * omitted case skips its check honestly and prints the exact line in the
 * results). POST to /api/cover-letter/check; on success the page reloads
 * (the server page re-renders the stored run). Rejections show the locked
 * reason inline (aria-live, .cl-err — e2e contract) and persist nothing.
 * NO authoring surface exists — no paste box, no generated letter, nothing
 * edited inside the system (the same hard fence as the resume round).
 */

const REJECT_COPY: Record<string, string> = {
  bad_form: "The upload didn't arrive complete — pick the file again.",
  unauthorized: "Your session ended — sign in again and re-upload.",
  no_career: "Pick your target role first — the check measures against it.",
  no_file: "Choose a cover letter file first (TXT, PDF, or DOCX).",
  multi_file: "One file at a time — drop the cover letter as a single PDF, DOCX, or TXT.",
  oversize: "Over the 5 MB limit — a plain, text-only letter export stays well under it. Remove images and export the letter again.",
  empty: "The file carries almost no text — a letter needs its body.",
  encrypted: "This file is password-protected or encrypted — save an unlocked copy as a PDF, DOCX, or TXT and upload that.",
  scanned: "This PDF carries essentially no readable text — it reads as a scan or an image-only export. The letter has to be real text, not a picture of it. Re-export a text-based PDF (or a .txt/.docx).",
  wrong_type: "This file's content is not readable text (or a PDF/Word carrier of one) — the extension alone isn't trusted.",
  parse_error: "This file's structure couldn't be read — try exporting the letter again.",
  format_check_failed: "The format checks didn't pass. Nothing was saved or scored.",
};

export default function LetterUpload() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [employer, setEmployer] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  async function check(files: FileList | null) {
    if (!files || files.length === 0) return;
    const form = new FormData();
    form.append("letter", files[0]);
    const anchor = employer.trim();
    if (anchor.length > 0) form.append("employer", anchor); // absent = the optional check skips honestly — nothing invented
    setBusy(true);
    setErr(null);
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
    <section className="cl-upload dropzone" aria-label="Run the cover-letter checker">
      <div
        role="button"
        tabIndex={busy ? -1 : 0}
        className={`dz-zone${drag ? " dz-over" : ""}`}
        onClick={() => !busy && fileInput.current?.click()}
        onKeyDown={(e) => {
          if (!busy && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            fileInput.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (!busy) void check(e.dataTransfer.files);
        }}
        aria-label="Drop your cover letter here (TXT, PDF, or DOCX) or click to browse — the checker runs on drop"
      >
        {busy ? (
          <span className="dz-busy">Reading the letter…</span>
        ) : err ? (
          <span className="cl-err dz-err" role="status" aria-live="polite">
            {err}
          </span>
        ) : (
          <>
            <span className="ms dz-icon" aria-hidden="true">
              mail
            </span>
            <span className="dz-head">Drop your cover letter here</span>
            <span className="dz-sub">TXT, PDF, or DOCX · it runs the moment the file lands</span>
          </>
        )}
      </div>
      <input
        ref={fileInput}
        type="file"
        className="rs-file dz-input"
        accept=".txt,.pdf,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(e) => {
          void check(e.target.files);
          e.target.value = "";
        }}
      />
      <div className="cl-field cl-below">
        <label className="rs-links num" htmlFor="cl-employer">
          Employer{" "}
          <input
            type="text"
            id="cl-employer"
            className="cl-input"
            value={employer}
            maxLength={120}
            aria-label="Employer (optional)"
            placeholder="Optional — a company name runs its own check. Leave empty if you're applying generally."
            onChange={(e) => setEmployer(e.target.value)}
          />
        </label>
      </div>
    </section>
  );
}

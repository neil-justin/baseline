"use client";

import { useRef, useState } from "react";

/**
 * The diagnostic's only intake motion: pick ONE file (PDF/DOCX), the page
 * POSTs it to /api/resume/diagnose, and on a successful run the page
 * re-renders the stored result. Rejections show the locked reason inline
 * (aria-live) and persist nothing. NO editing surface exists — there is no
 * paste box, no text entry, nothing to author INSIDE the system (hard fence).
 *
 * Why a FULL reload (not router.refresh()): the run's result is server-
 * rendered from the store (force-dynamic), and the soft RSC refresh proved
 * unreliable to apply in this browser flow (payload fetched, DOM stale);
 * a document load re-renders honestly every time.
 */

const REJECT_COPY: Record<string, string> = {
  bad_form: "The upload didn't arrive complete — pick the file again.",
  unauthorized: "Your session ended — sign in again and re-upload.",
  no_file: "Choose a resume file first.",
  no_career: "Pick your target role first — the diagnostic measures against it.",
  multi_file: "One file at a time — upload the resume as a single PDF or DOCX.",
  oversize: "Over the 5 MB limit — exports with embedded photos or graphics easily grow past it. Remove images and export the resume again.",
  empty: "The file carries no readable content — almost nothing on its pages.",
  encrypted: "This file is password-protected or encrypted — save an unlocked copy as a PDF or DOCX and upload that.",
  scanned: "This PDF carries essentially no readable text — it reads as a scan or an image-only export. Re-export a text-based PDF from Word or Google Docs (File → Export → PDF); the text has to be real text, not a picture of it.",
  not_resume: "This doesn't read as a resume.",
  wrong_type: "This file's content is neither a PDF nor a Word document — the extension alone isn't trusted.",
  parse_error: "This file's structure couldn't be read — try exporting the resume again.",
};

export default function ResumeUpload({ careerName, primary = false }: { careerName: string; primary?: boolean }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function upload() {
    setErr(null);
    const files = fileInput.current?.files;
    if (!files || files.length === 0) {
      setErr("Choose a resume file first (PDF or DOCX).");
      return;
    }
    const form = new FormData();
    for (const f of files) form.append("resume", f); // one is the locked case; two exercises multi_file server-side
    setBusy(true);
    try {
      const res = await fetch("/api/resume/diagnose", { method: "POST", body: form });
      if (res.ok) {
        window.location.reload(); // the server page re-renders the stored run
      } else {
        const json = (await res.json().catch(() => null)) as { error?: string; detail?: string; missing?: string[] } | null;
        const code = json?.error ?? "parse_error";
        const tail = json?.missing?.length ? ` It's missing ${json.missing.join(" and ")}.` : "";
        setErr((json?.detail ?? REJECT_COPY[code] ?? "The file was rejected — try exporting it as a PDF or DOCX.") + tail);
      }
    } catch {
      setErr("The upload failed — check the connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rs-upload" aria-label="Run the resume diagnostic">
      <div className="b-head">
        <h2>Run the diagnostic — one PDF or DOCX at a time</h2>
        <p className="helper">
          The file is read for feedback inside this run and never stored. Your target role:{" "}
          <b>{careerName}</b>.
        </p>
      </div>
      <div className="rs-file-row">
        <input
          ref={fileInput}
          type="file"
          className="rs-file"
          multiple
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          aria-label="Resume file (PDF or DOCX — one file, up to 5 MB)"
          onChange={() => setErr(null)}
        />
        {/* Blue Command Rule: this surface's one blue lives on the surface's
            next step (the format-guide CTA in the no-run state) — the re-run
            row stays ghost. */}
        <button className={`btn ${primary ? "btn-primary" : "btn-ghost"} btn-sm`} onClick={upload} disabled={busy}>
          {busy ? "Reading the file…" : "Run the diagnostic"}
        </button>
      </div>
      <p className={`rs-note${err ? " rs-err" : ""}`} role="status" aria-live="polite">
        {err ?? "Rejections are expected and named: oversized, empty, encrypted, image-only (no OCR — re-export), or something that doesn't read as a resume. Unlimited re-runs; your latest run counts — re-running replaces the stored one."}
      </p>
    </section>
  );
}

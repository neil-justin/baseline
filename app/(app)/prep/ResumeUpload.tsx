"use client";

import { useRef, useState } from "react";

/**
 * The resume checker's intake (v7.4 minimal-tool recut, user ruling
 * 2026-11-02): ONE large dropzone. A file landing here — dragged or
 * browsed — POSTs immediately to /api/resume/diagnose; on a successful run
 * the page re-renders the stored result (full reload: the result is
 * server-rendered from the store, force-dynamic; a document load re-renders
 * honestly every time). NO default prose, no run button. Rejections show
 * the locked reason inline (aria-live, .rs-err — e2e contract) and persist
 * nothing; the busy state renders inside the zone. NO editing surface
 * exists — no paste box, nothing authored INSIDE the system (hard fence).
 */

const REJECT_COPY: Record<string, string> = {
  bad_form: "The upload didn't arrive complete — pick the file again.",
  unauthorized: "Your session ended — sign in again and re-upload.",
  no_file: "Choose a resume file first.",
  no_career: "Pick your target role first — the check measures against it.",
  multi_file: "One file at a time — drop the resume as a single PDF or DOCX.",
  oversize: "Over the 5 MB limit — exports with embedded photos or graphics easily grow past it. Remove images and export the resume again.",
  empty: "The file carries no readable content — almost nothing on its pages.",
  encrypted: "This file is password-protected or encrypted — save an unlocked copy as a PDF or DOCX and upload that.",
  scanned: "This PDF carries essentially no readable text — it reads as a scan or an image-only export. Re-export a text-based PDF from Word or Google Docs (File → Export → PDF); the text has to be real text, not a picture of it.",
  not_resume: "This doesn't read as a resume.",
  wrong_type: "This file's content is neither a PDF nor a Word document — the extension alone isn't trusted.",
  parse_error: "This file's structure couldn't be read — try exporting the resume again.",
};

export default function ResumeUpload() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  async function run(files: FileList | null) {
    if (!files || files.length === 0) return;
    const form = new FormData();
    for (const f of files) form.append("resume", f); // one is the locked case; two exercises multi_file server-side
    setBusy(true);
    setErr(null);
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
    <section className="rs-upload dropzone" aria-label="Run the resume checker">
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
          if (!busy) void run(e.dataTransfer.files);
        }}
        aria-label="Drop your resume here (PDF or DOCX) or click to browse — the checker runs on drop"
      >
        {busy ? (
          <span className="dz-busy">Reading the file…</span>
        ) : err ? (
          <span className="rs-err dz-err" role="status" aria-live="polite">
            {err}
          </span>
        ) : (
          <>
            <span className="ms dz-icon" aria-hidden="true">
              upload_file
            </span>
            <span className="dz-head">Drop your resume here</span>
            <span className="dz-sub">PDF or DOCX · it runs the moment the file lands</span>
          </>
        )}
      </div>
      <input
        ref={fileInput}
        type="file"
        className="rs-file dz-input"
        multiple
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(e) => {
          void run(e.target.files);
          e.target.value = "";
        }}
      />
    </section>
  );
}

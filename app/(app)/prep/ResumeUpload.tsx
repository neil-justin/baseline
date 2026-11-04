"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

/**
 * The resume checker's intake (v7.4 recut; Q15 slim affordance 2026-11-03):
 * ONE dropzone. A file landing here — dragged or browsed — POSTs immediately
 * to /api/resume/diagnose; on a successful run the page swaps the result IN
 * PLACE (round 2, user ruling 2026-11-04): router.refresh() re-renders the
 * server tree inside the transition — no browser reload (no blank, no
 * scroll jump) — then the entrance cascade replays deliberately and the
 * readout (verdict card) auto-scrolls to the top of the viewport. Default
 * variant = the upload-first hero (a first run). `slim` = Q15's demoted
 * "Check another version" footer affordance on the results-first card —
 * same hooks/classes/aria contract byte-kept (.rs-upload .dz-zone), only
 * the head copy and the footprint change. NO editing surface exists — no
 * paste box, nothing authored INSIDE the system (hard fence).
 */

/** the simulated analyze beat (F3, user-ruled 2026-11-04): a deliberate
 * ~900 ms floor runs beside the fetch — a fast parse still reads as work */
const ANALYZE_MIN_MS = 900;

/** the landing watchdog (round 2, user-ruled 2026-11-04): the in-place swap
 * must finish in bounded time — past it, the choreography is skipped
 * honestly (the swap already landed or will; the zone is just idle) */
const LANDING_SETTLE_MS = 8000;

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

export default function ResumeUpload({ slim = false }: { slim?: boolean }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  /* the landing loop reads isPending through a ref written at render time —
   * it runs in an old render's closure, so the value must stay current */
  const pendingRef = useRef(isPending);
  pendingRef.current = isPending;
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const head = slim ? "Check another version" : "Drop your resume here";
  const sub = slim ? "PDF or DOCX · drop or browse" : "PDF or DOCX · the format & evidence check runs the moment the file lands";

  /* the landing signal: startTransition(() => router.refresh()) flips
   * isPending true, then false when the swapped server tree commits —
   * poll inside rAF, capped at the watchdog (its timeout resolves WITHOUT
   * replay/scroll — honest dead-end, the zone is already idle). Probe-
   * verified live (scripts/prep-feedback-probe-2.mjs): the flip tracks the
   * refresh — first rAF tick reads true, it returns false at the commit. */
  function awaitLanding() {
    return new Promise<void>((resolve) => {
      const deadline = performance.now() + LANDING_SETTLE_MS;
      let sawPending = false;
      const tick = () => {
        if (pendingRef.current) sawPending = true;
        else if (sawPending) return resolve();
        if (performance.now() > deadline) return resolve();
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  /* the landing choreography: restart the stylesheet cascade on the active
   * panel's cards, then scroll the verdict card to the viewport top — */
  function replayAndScroll() {
    const panel = document.querySelector(".tabpanel:not([hidden])");
    const cards = panel?.querySelectorAll<HTMLElement>(".prep-kpi, .prep-stack > .card") ?? [];
    requestAnimationFrame(() => {
      cards.forEach((el) => {
        el.style.animation = "none";
        void el.getBoundingClientRect(); // reflow records the restart
        el.style.animation = "";
      });
    });
    const verdict = panel?.querySelector(".rs-readout, .cl-readout");
    verdict?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  }

  async function run(files: FileList | null) {
    if (!files || files.length === 0) return;
    const form = new FormData();
    for (const f of files) form.append("resume", f); // one is the locked case; two exercises multi_file server-side
    setBusy(true);
    setErr(null);
    try {
      const [res] = await Promise.all([
        fetch("/api/resume/diagnose", { method: "POST", body: form }),
        new Promise((resolve) => setTimeout(resolve, ANALYZE_MIN_MS)),
      ]);
      if (res.ok) {
        startTransition(() => {
          router.refresh(); // re-renders the server tree IN PLACE (no reload)
        });
        await awaitLanding();
        replayAndScroll(); // the cascade replays as the scroll hands off
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
        className={`dz-zone${slim ? " dz-slim" : ""}${drag ? " dz-over" : ""}${busy ? " dz-analyzing" : ""}`}
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
          <span className="dz-busy dz-analyzing" role="status" aria-live="polite">
            <svg className="dz-spin" aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <circle cx="12" cy="12" r="9" opacity="0.25" />
              <path d="M21 12a9 9 0 0 0-9-9" />
            </svg>
            Analyzing…
          </span>
        ) : err ? (
          <span className="rs-err dz-err" role="status" aria-live="polite">
            {err}
          </span>
        ) : (
          <>
            <svg className="dz-icon" aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 15V3m0 0L8 7m4-4l4 4" />
              <path d="M3 15v3a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-3" />
            </svg>
            <span className="dz-head">{head}</span>
            <span className="dz-sub">{sub}</span>
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

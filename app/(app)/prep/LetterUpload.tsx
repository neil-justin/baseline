"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

/**
 * The cover-letter checker's intake (v7.4 recut; Q15 slim affordance
 * 2026-11-03): the SAME dropzone pattern as the resume — one file
 * (TXT/PDF/DOCX) lands and the check runs immediately. The OPTIONAL employer
 * anchor sits as a labelled field ABOVE the zone — and only renders once the
 * letter has run (showEmployer; user ruling 2026-11-02: the idle screen stays
 * a pure dropzone; placement above the zone ruled 2026-11-03, R9). Fill it
 * before dropping to anchor the employer check on the re-run, or leave it
 * empty — the omitted case skips its check honestly and prints the exact line
 * in the Structure card. POST to
 * /api/cover-letter/check; on a successful check the page swaps the result IN
 * PLACE (round 2, user ruling 2026-11-04; landing mechanics mirrored from the
 * resume intake): router.refresh() re-renders the server tree inside the
 * transition — no browser reload — then the entrance cascade replays
 * deliberately and the readout (verdict card) auto-scrolls to the top of the
 * viewport. ROUND 2B superseded (user ruling 2026-11-18): the analyzing
 * state no longer hides the panel's result cards nor grows the zone — the
 * busy line swaps in at the zone's natural footprint (no height change). Rejections show the locked reason inline
 * (aria-live, .cl-err — e2e contract) and persist nothing. `slim` = the Q15
 * demoted "Check another version" footer affordance on a results-first
 * card (hooks/classes byte-kept). NO authoring surface exists — no paste
 * box, no generated letter, nothing edited inside the system (the same
 * hard fence as the resume round).
 */

/** the simulated analyze beat (F3, user-ruled 2026-11-04): a deliberate
 * ~900 ms floor runs beside the fetch — a fast parse still reads as work */
const ANALYZE_MIN_MS = 900;

/** the landing watchdog (round 2, user-ruled 2026-11-04): the in-place swap
 * must finish in bounded time — awaitLanding resolves FALSE at this
 * deadline; the call site then skips the replay/scroll (the ruled
 * dead-end: the swap is already landed or will be, and the zone is idle) */
const LANDING_SETTLE_MS = 8000;

const REJECT_COPY: Record<string, string> = {
  bad_form: "The upload didn't arrive complete — pick the file again.",
  unauthorized: "Your session ended — sign in again and re-upload.",
  no_career: "Pick your target role first — the check measures against it.",
  no_file: "Choose a cover letter file first (TXT, PDF, or DOCX).",
  multi_file: "One file at a time — drop the cover letter as a single PDF, DOCX, or TXT.",
  not_letter: "This doesn't read as a cover letter.",
  oversize: "Over the 5 MB limit — a plain, text-only letter export stays well under it. Remove images and export the letter again.",
  empty: "The file carries almost no text — a letter needs its body.",
  encrypted: "This file is password-protected or encrypted — save an unlocked copy as a PDF, DOCX, or TXT and upload that.",
  scanned: "This PDF carries essentially no readable text — it reads as a scan or an image-only export. The letter has to be real text, not a picture of it. Re-export a text-based PDF (or a .txt/.docx).",
  wrong_type: "This file's content is not readable text (or a PDF/Word carrier of one) — the extension alone isn't trusted.",
  parse_error: "This file's structure couldn't be read — try exporting the letter again.",
  format_check_failed: "The format checks didn't pass. Nothing was saved or scored.",
};

export default function LetterUpload({
  showEmployer = false,
  slim = false,
}: {
  showEmployer?: boolean;
  slim?: boolean;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  /* the landing loop reads isPending through a ref written at render time —
   * it runs in an old render's closure, so the value must stay current */
  const pendingRef = useRef(isPending);
  pendingRef.current = isPending;
  /* teardown: if the page navigates away mid-landing, the polling interval
   * must not outlive the component (strict-mode-safe: reset on mount) */
  const unmountedRef = useRef(false);
  useEffect(() => {
    unmountedRef.current = false;
    return () => {
      unmountedRef.current = true;
    };
  }, []);
  const [employer, setEmployer] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const head = slim ? "Check another version" : "Drop your cover letter here";
  const sub = slim ? "TXT, PDF, or DOCX, drop or browse" : "TXT, PDF, or DOCX, the check runs the moment the file lands";

  /* the landing signal — mirrored from the resume intake: startTransition(
   * () => router.refresh()) flips isPending true, then false when the
   * swapped server tree commits — the poll observes that flip cycle and
   * resolves true; the watchdog deadline resolves false instead (the ruled
   * dead-end: the call site then skips the replay/scroll). Polled on an
   * 80 ms interval: unlike a rAF chain it keeps ticking while the document
   * is hidden and observes the flip the same way either side of a frame. */
  function awaitLanding() {
    return new Promise<boolean>((resolve) => {
      let sawPending = false;
      const deadline = performance.now() + LANDING_SETTLE_MS;
      const settle = (landed: boolean) => {
        clearInterval(timer);
        resolve(landed);
      };
      const timer = setInterval(() => {
        if (unmountedRef.current) return settle(false); // the page went away mid-landing — nothing to choreograph
        if (pendingRef.current) sawPending = true;
        else if (sawPending) return settle(true);
        if (performance.now() > deadline) return settle(false);
      }, 80);
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
      });
      void panel?.getBoundingClientRect(); // ONE reflow records every restart
      cards.forEach((el) => {
        el.style.animation = "";
      });
    });
    const verdict = panel?.querySelector(".rs-readout, .cl-readout");
    verdict?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  }

  async function check(files: FileList | null) {
    if (!files || files.length === 0) return;
    const form = new FormData();
    form.append("letter", files[0]);
    const anchor = employer.trim();
    if (anchor.length > 0) form.append("employer", anchor); // absent = the optional check is skipped — nothing invented
    setBusy(true);
    setErr(null);
    try {
      const [res] = await Promise.all([
        fetch("/api/cover-letter/check", { method: "POST", body: form }),
        new Promise((resolve) => setTimeout(resolve, ANALYZE_MIN_MS)),
      ]);
      if (res.ok) {
        startTransition(() => {
          router.refresh(); // re-renders the server tree IN PLACE (no reload)
        });
        const landed = await awaitLanding();
        if (landed) replayAndScroll(); // watchdog = the ruled dead-end: no replay, no scroll
      } else {
        const json = (await res.json().catch(() => null)) as { error?: string; detail?: string; missing?: string[] } | null;
        const code = json?.error ?? "parse_error";
        const tail = json?.missing?.length ? ` It's missing ${json.missing.join(" and ")}.` : "";
        setErr((json?.detail ?? REJECT_COPY[code] ?? "The file was rejected — try exporting the letter as a PDF, DOCX, or TXT.") + tail);
      }
    } catch {
      setErr("The upload failed — check the connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="cl-upload dropzone" aria-label="Run the cover-letter checker">
      {/* R9 (user ruling 2026-11-03): the optional employer anchor rides
          ABOVE the zone as a labelled field with its honesty line — fill it
          before dropping to anchor the re-run, or leave it empty and the
          omitted case skips its check honestly (the exact line prints in the
          Structure card). Idle screens still render no field. */}
      {showEmployer ? (
        <div className="cl-employer">
          <label className="cl-employer-label num" htmlFor="cl-employer">
            Employer <span>optional</span>
          </label>
          <input
            type="text"
            id="cl-employer"
            className="cl-input"
            value={employer}
            maxLength={120}
            placeholder="A company name runs its own check."
            onChange={(e) => setEmployer(e.target.value)}
          />
          <p className="cl-employer-hint">
            Leave empty if you&rsquo;re applying generally.
          </p>
        </div>
      ) : null}
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
          if (!busy) void check(e.dataTransfer.files);
        }}
        aria-label="Drop your cover letter here (TXT, PDF, or DOCX) or click to browse — the checker runs on drop"
      >
        {busy ? (
          <span className="dz-busy dz-analyzing" role="status" aria-live="polite">
            <svg className="dz-spin" aria-hidden="true" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="12" cy="12" r="9" opacity="0.25" />
              <path d="M21 12a9 9 0 0 0-9-9" />
            </svg>
            Analyzing…
            <span className="dz-an-sub">Your file is being checked — the result lands here when it&rsquo;s ready.</span>
          </span>
        ) : err ? (
          <span className="cl-err dz-err" role="status" aria-live="polite">
            {err}
          </span>
        ) : (
          <>
            <svg className="dz-icon" aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3.5 7 8.5 6 8.5-6" />
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
        accept=".txt,.pdf,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(e) => {
          void check(e.target.files);
          e.target.value = "";
        }}
      />
    </section>
  );
}

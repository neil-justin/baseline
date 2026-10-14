"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Port of prototype/js/motion.js's class-reveal machinery for this page —
 * the ONLY motion behavior not carried by the frozen shared machinery
 * (CountUp / observeReveal), because it is group-staggered:
 *  - `.rv, .mask, .draw, [data-io], [data-stagger]` targets observed
 *    individually (threshold 0.18, rootMargin -6%).
 *  - `[data-stagger]` containers assign `--d` to direct children (capped)
 *    and add `.in` to child `.rv`s; the container itself gets `.in`.
 *  - `[data-wageladder]` releases `.wage-step`s 60ms after the container.
 *  - `[data-scan]` computes `--scan-y` and restarts the scanline on entry.
 * Reveal/reset toggles transform/opacity/filter only (CLS contract);
 * reduced-motion reveals everything instantly, matching motion.js.
 */
export default function LandingFx() {
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(".rv, .mask, .draw, [data-io], [data-stagger]")
    );

    function reveal(el: HTMLElement) {
      /* stagger children */
      if (el.hasAttribute("data-stagger")) {
        const kids = el.children;
        const step = parseInt(el.dataset.stagger || "70", 10);
        const cap = parseInt(el.dataset.cap || "520", 10);
        for (let i = 0; i < kids.length; i++) {
          const kid = kids[i] as HTMLElement;
          kid.style.setProperty("--d", `${Math.min(i * step, cap)}ms`);
          if (kid.classList.contains("rv")) kid.classList.add("in");
        }
      }
      el.classList.add("in");

      /* wage ladder reads step by step */
      if (el.hasAttribute("data-wageladder")) {
        const ws = el.querySelectorAll(".wage-step");
        setTimeout(function () {
          for (let k = 0; k < ws.length; k++) ws[k].classList.add("in");
        }, 60);
      }

      /* scanline over the index table — restart cleanly on re-entry */
      if (el.hasAttribute("data-scan")) {
        el.classList.remove("measuring");
        el.style.setProperty("--scan-y", `${el.offsetHeight}px`);
        void (el as HTMLElement).offsetWidth;
        el.classList.add("measuring");
      }
    }

    function unreveal(el: HTMLElement) {
      if (el.hasAttribute("data-stagger")) {
        const kids = el.children;
        for (let i = 0; i < kids.length; i++) {
          if (kids[i].classList.contains("rv")) kids[i].classList.remove("in");
        }
      }
      if (el.hasAttribute("data-wageladder")) {
        const ws = el.querySelectorAll(".wage-step");
        for (let j = 0; j < ws.length; j++) ws[j].classList.remove("in");
      }
      if (el.hasAttribute("data-scan")) el.classList.remove("measuring");
      el.classList.remove("in");
    }

    if (prefersReducedMotion()) {
      targets.forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) reveal(en.target as HTMLElement);
          else unreveal(en.target as HTMLElement);
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return null;
}

"use client";

import { useEffect, useRef } from "react";
import { countUp, prefersReducedMotion } from "@/lib/motion";

/**
 * Port of the prototype's [data-count] behavior: counts to `to` when scrolled
 * into view, reserves width first, resets to 0 on exit, and calls onDone once
 * (used to arm the segmented rubric bar — the "instrument takes a measurement"
 * sequence, 160ms delay, matching motion.js).
 */
export default function CountUp({
  to,
  dec = 0,
  dur = 900,
  onDone,
  className = "",
  ariaLabel,
}: {
  to: number;
  dec?: number;
  dur?: number;
  onDone?: () => void;
  className?: string;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    let cancel: (() => void) | undefined;

    if (reduced) {
      el.textContent = to.toFixed(dec);
      onDone?.();
      return;
    }
    // start from 0 (post-hydration, matches the prototype's JS-gated reveal)
    el.textContent = (0).toFixed(dec);
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            cancel?.();
            cancel = countUp(el, to, { dec, dur, onDone: onDone ? () => onDone() : undefined });
          } else {
            cancel?.();
            el.textContent = (0).toFixed(dec);
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => {
      cancel?.();
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, dec, dur]);

  // initial paint = final value (server + first client render match: no
  // hydration mismatch; no-JS users see the honest final number, JS animates)
  return (
    <span
      ref={ref}
      className={className}
      aria-label={ariaLabel}
      data-count={to}
      data-dec={dec}
    >
      {to.toFixed(dec)}
    </span>
  );
}

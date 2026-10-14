/**
 * Motion machinery — TS port of prototype/js/motion.js semantics.
 * Rules (CLS contract):
 *  - Reveal/reset animate ONLY transform/opacity/filter — never layout props.
 *  - Count-up reserves the final width before the first frame (inline-block +
 *    min-width) so digit-count changes never re-wrap neighbouring text.
 *  - Everything is disabled under prefers-reduced-motion; final values render.
 */

export const EASE_EXIT = "cubic-bezier(0.16, 1, 0.3, 1)";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Port of countUp(): width reserved up front, ease-out cubic. */
export function countUp(
  el: HTMLElement,
  to: number,
  opts: { dec?: number; dur?: number; onDone?: () => void } = {}
): () => void {
  const dec = opts.dec ?? 0;
  const dur = opts.dur ?? 950;
  if (prefersReducedMotion()) {
    el.textContent = to.toFixed(dec);
    opts.onDone?.();
    return () => {};
  }
  if (getComputedStyle(el).display === "inline") el.style.display = "inline-block";
  el.textContent = to.toFixed(dec);
  el.style.minWidth = el.offsetWidth + "px";
  let raf = 0;
  let start: number | null = null;
  function frame(t: number) {
    if (start === null) start = t;
    const p = Math.min((t - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = (to * e).toFixed(dec);
    if (p < 1) raf = requestAnimationFrame(frame);
    else {
      el.textContent = to.toFixed(dec);
      opts.onDone?.();
    }
  }
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

export function observeReveal(
  el: HTMLElement,
  opts: { threshold?: number; rootMargin?: string } = {}
): () => void {
  const threshold = opts.threshold ?? 0.18;
  const rootMargin = opts.rootMargin ?? "0px 0px -6% 0px";
  const reduced = prefersReducedMotion();
  const reveal = (target: HTMLElement) => {
    target.style.setProperty("--d", "0ms");
    target.classList.add("in");
  };
  const unreveal = (target: HTMLElement) => target.classList.remove("in");
  if (reduced) {
    reveal(el);
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        const target = en.target as HTMLElement;
        if (en.isIntersecting) reveal(target);
        else unreveal(target);
      }
    },
    { threshold, rootMargin }
  );
  io.observe(el);
  return () => io.disconnect();
}

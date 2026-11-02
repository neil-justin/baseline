"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { observeReveal } from "@/lib/motion";

/** Port of the prototype's `.rv` reveal — transform/opacity/filter only. */
export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  ariaLabel,
  id,
}: {
  children: ReactNode;
  as?: "div" | "section" | "p" | "span" | "h1" | "h2";
  className?: string;
  delay?: number;
  ariaLabel?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (delay) el.style.setProperty("--d", `${delay}ms`);
    return observeReveal(el);
  }, [delay]);
  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} id={id} className={`rv ${className}`} aria-label={ariaLabel}>
      {children}
    </Tag>
  );
}

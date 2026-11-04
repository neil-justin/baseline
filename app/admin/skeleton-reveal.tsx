"use client";

/**
 * SkeletonReveal — the quiet-fast gate for loading states (user ruling
 * 2026-11-04): a skeleton that paints for a split second reads as a
 * flash, so loading DOM mounts HIDDEN and only fades in once the
 * boundary has held longer than REVEAL_AFTER_MS. Mount == shown (a
 * fallback mounts exactly when its boundary renders), so a fast flight
 * never paints a skeleton and a slow one still earns the pills.
 * Reduced motion: the reveal is instant and the shimmer is off (the
 * recipe's own guards).
 */

import { useEffect, useState, type ReactNode } from "react";

const REVEAL_AFTER_MS = 200;

export default function SkeletonReveal({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), REVEAL_AFTER_MS);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <div
      className="skel-reveal"
      style={visible ? undefined : { visibility: "hidden" }}
    >
      {children}
    </div>
  );
}

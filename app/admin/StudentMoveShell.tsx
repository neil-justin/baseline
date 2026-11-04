"use client";

/**
 * StudentMoveShell — the move's loading twin. Next keeps the OLD screen
 * for a whole same-route param change (searchParams transition); React
 * reuses the resolved boundary, so a streaming fall-back can't mount and
 * a long fetch reads as a frozen click (user ruling 2026-11-04).
 *
 *  - a pn link click starts the move immediately: the panel drops into
 *    the skeleton (body hidden in place, skeleton laid over its exact
 *    box — the clicked affordance visibly leaves);
 *  - the skeleton holds MIN_HOLD_MS so a fast flight reads as a
 *    deliberate transition instead of a flicker;
 *  - on arrival the panel commits and animates in OVER the skeleton —
 *    the skeleton is NOT unmounted at the swap: unmounting it the same
 *    instant a fade-from-0 panel mounts left the card area as bare
 *    ground for a few frames (the blink reported 2026-11-04, seen on
 *    production too). The overlay fades out under the fully-opaque
 *    sliding panel instead, so every frame carries pixels.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";

import DetailSkeleton from "./detail-skeleton";

/** DRIVE_BY_MS: a flight that commits inside this window never paints a
 *  skeleton at all — the panel swaps straight in (user ruling
 *  2026-11-04, "only when slow": a brief spawn reads as a flash). */
const DRIVE_BY_MS = 200;
/** Once the skeleton is up it holds at least this long past that beat,
 *  so even a snap flight reads as a deliberate transition. */
const MIN_SHOW_MS = 300;
/** How long the skeleton stays under the arriving panel as it fades —
 *  matches the move slide's 0.22s. */
const CROSSFADE_MS = 220;

export default function StudentMoveShell({ student, children }: { student: string; children: ReactNode }) {
  const [moving, setMoving] = useState(false);
  const [overlay, setOverlay] = useState(false);
  /** the student the game is FOR — arrival = this prop changed */
  const [shown, setShown] = useState(student);
  const startedAt = useRef(0);
  const guard = useRef<number | null>(null);
  const settle = useRef<number | null>(null);

  useEffect(() => {
    if (shown !== student) {
      // arrival: the transition committed
      if (guard.current !== null) {
        // fast flight — beat the guard, straight to the panel swap
        window.clearTimeout(guard.current);
        guard.current = null;
        setShown(student);
        return () => {};
      }
      const elapsed = startedAt.current ? Date.now() - startedAt.current : DRIVE_BY_MS + MIN_SHOW_MS;
      setMoving(false);
      settle.current = window.setTimeout(
        () => {
          setOverlay(false);
          setShown(student);
        },
        Math.max(0, DRIVE_BY_MS + MIN_SHOW_MS - elapsed) + CROSSFADE_MS
      );
    }
    return () => {
      if (settle.current !== null) window.clearTimeout(settle.current);
    };
  }, [student, shown]);

  useEffect(() => () => {
    if (guard.current !== null) window.clearTimeout(guard.current);
    if (settle.current !== null) window.clearTimeout(settle.current);
  }, []);

  // capture-phase: the move starts on any pn link (they carry &dir=) —
  // the row drops into the skeleton immediately; row/back links don't
  // match and keep their route loading fallback instead
  function onCaptureClick(e: React.MouseEvent<HTMLDivElement>) {
    if (moving) return;
    const a = (e.target as HTMLElement).closest?.('a[href*="dir="]');
    if (!a) return;
    startedAt.current = Date.now();
    // quiet-fast: the skeleton only paints if the flight outlives the
    // drive-by beat; a snappy flight swaps straight in
    guard.current = window.setTimeout(() => {
      setMoving(true);
      setOverlay(true);
      guard.current = null;
    }, DRIVE_BY_MS);
  }

  return (
    <div
      className={["stmov", overlay && !moving ? "arriving" : ""].filter(Boolean).join(" ")}
      aria-busy={moving || overlay || undefined}
      onClickCapture={onCaptureClick}
    >
      {overlay && (
        <div className="stmov-skel" aria-hidden="true">
          <DetailSkeleton />
        </div>
      )}
      <div className="stmov-body" style={moving ? { visibility: "hidden" } : undefined}>
        {children}
      </div>
    </div>
  );
}

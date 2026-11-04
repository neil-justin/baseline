"use client";

/**
 * StudentMoveShell — the move's loading twin. Next keeps the OLD screen
 * for a whole same-route param change (searchParams transition); React
 * reuses the resolved boundary, so a streaming fall-back can't mount and
 * a long fetch reads as a frozen click (user ruling 2026-11-04). This
 * shell fills that gap from our side:
 *
 *  - a pn link click starts the move immediately — the row (panel +
 *    pn) drops into the skeleton right away, which is what makes the
 *    clicked affordance read as "left";
 *  - the skeleton holds MIN_HOLD_MS so a fast flight reads as a
 *    deliberate transition instead of a flicker (M3 belt);
 *  - the hold elapses, the new panel commits (children swap in) and
 *    mounts fresh — the direction slide + count-up replay.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";

import DetailSkeleton from "./detail-skeleton";

/** The skeleton holds for at least one beat so a fast flight reads as a
 *  deliberate transition (the pn row disappears into it) instead of a
 *  flicker. 220ms — under a blink, just past decay. */
const MIN_HOLD_MS = 220;

export default function StudentMoveShell({ student, children }: { student: string; children: ReactNode }) {
  const [moving, setMoving] = useState(false);
  /** the student the game is FOR — arrival = this prop changed */
  const [shown, setShown] = useState(student);
  const startedAt = useRef(0);
  const settle = useRef<number | null>(null);

  useEffect(() => {
    if (shown !== student) {
      // arrival: the transition committed — honor the minimum hold, then
      // drop the skeleton (the panel slides in fresh)
      const elapsed = startedAt.current ? Date.now() - startedAt.current : MIN_HOLD_MS;
      settle.current = window.setTimeout(
        () => {
          setMoving(false);
          setShown(student);
        },
        Math.max(0, MIN_HOLD_MS - elapsed)
      );
    }
    return () => {
      if (settle.current !== null) window.clearTimeout(settle.current);
    };
  }, [student, shown]);

  useEffect(() => () => {
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
    setMoving(true);
  }

  return (
    <div onClickCapture={onCaptureClick}>
      {moving ? <div aria-busy="true" aria-label="Moving to another student"><DetailSkeleton /></div> : children}
    </div>
  );
}

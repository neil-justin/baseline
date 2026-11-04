"use client";

/**
 * StudentMoveShell — the move's loading twin. Next keeps the OLD screen
 * for a whole same-route param change (searchParams transition); React
 * reuses the resolved boundary, so a streaming fall-back can't mount and
 * a long fetch reads as a frozen click (user ruling 2026-11-04). This
 * shell fills that gap from our side:
 *
 *  - a pn link click arms a 140ms guard timer (flash guard — fast
 *    flights never paint a skeleton);
 *  - if the flight is still pending past the guard, the shell shows the
 *    SAME DetailSkeleton the surface's other entrances use (Skeleton
 *    Contract — one clone everywhere);
 *  - the new panel commits (children swap in), the skeleton drops and
 *    the panel mounts fresh — the direction slide + count-up replay.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";

import DetailSkeleton from "./detail-skeleton";

export default function StudentMoveShell({ student, children }: { student: string; children: ReactNode }) {
  const [moving, setMoving] = useState(false);
  /** the student the game is FOR — arrival = this prop changed */
  const [shown, setShown] = useState(student);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (shown !== student) {
      // arrival: the transition committed — stop the guard, drop the skeleton
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = null;
      setMoving(false);
      setShown(student);
    }
  }, [student, shown]);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  // capture-phase: arm the guard on any pn link (they carry &dir=), before
  // the router's push; row/back links don't match and keep their route
  // loading fallback instead
  function onCaptureClick(e: React.MouseEvent<HTMLDivElement>) {
    if (moving) return;
    const a = (e.target as HTMLElement).closest?.('a[href*="dir="]');
    if (!a) return;
    timer.current = window.setTimeout(() => setMoving(true), 140);
  }

  return (
    <div onClickCapture={onCaptureClick}>
      {moving ? <div aria-busy="true" aria-label="Moving to another student"><DetailSkeleton /></div> : children}
    </div>
  );
}

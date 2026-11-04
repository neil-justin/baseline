"use client";

/**
 * mockups/SittingGate.tsx — the hash parser that summons the SITTING
 * mockup realm onto /assessments (client-only; the server page stays
 * untouched while the hash is absent). Mirrors admin's AdminMockupGate —
 * the family's hash-gated veil register.
 *
 *   /assessments#mockups → the retake/verify sitting ruling (B vs A)
 */
import { useEffect, useState } from "react";
import AssessSittingMount from "./AssessSittingMount";
import type { SittingLite } from "./AssessSittingLite";
import "./sitting.css";

function parse(hash: string): boolean {
  return hash === "#mockups";
}

export default function AssessSittingGate({ lite }: { lite: SittingLite }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const parse$ = () => setOn(parse(window.location.hash));
    parse$();
    window.addEventListener("hashchange", parse$);
    return () => window.removeEventListener("hashchange", parse$);
  }, []);
  return on ? <AssessSittingMount lite={lite} /> : null;
}

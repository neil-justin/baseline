"use client";

/**
 * mockup/SigninMockupGate.tsx — hash parser that summons the option-(a)
 * split-panel comp onto /signin (client-only; the real signin stays
 * untouched while the hash is absent). Same realm pattern as the
 * landing round. Summon: /signin#mockup
 */
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SigninMockup from "./SigninMockup";
import "./mockup.css";

export default function SigninMockupGate() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const parse = () => setOn(window.location.hash === "#mockup");
    parse();
    window.addEventListener("hashchange", parse);
    return () => window.removeEventListener("hashchange", parse);
  }, []);
  if (!on) return null;
  return createPortal(<SigninMockup />, document.body);
}

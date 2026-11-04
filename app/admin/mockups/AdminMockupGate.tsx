"use client";

/**
 * mockups/AdminMockupGate.tsx — the hash parser that summons the mockup
 * realm onto /admin (client-only; the server page stays untouched while
 * the hash is absent). Mirrors PathwayTabs' mockup parse, admin flavor.
 */
import { useEffect, useState } from "react";
import AdminMockupMount, { type MockRole } from "./AdminMockupMount";
import "./mockups.css";

const RE = /^#mockups(?:-sys)?$/;

function parse(hash: string): MockRole | null {
  if (hash === "#mockups") return "counselor";
  if (hash === "#mockups-sys") return "sysadmin";
  return null;
}

export default function AdminMockupGate() {
  const [role, setRole] = useState<MockRole | null>(null);
  useEffect(() => {
    const parse$ = () => setRole(parse(window.location.hash));
    parse$();
    window.addEventListener("hashchange", parse$);
    return () => window.removeEventListener("hashchange", parse$);
  }, []);
  return role ? <AdminMockupMount key={role} role={role} /> : null;
}

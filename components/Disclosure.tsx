"use client";

import { useState, type ReactNode } from "react";

/** Ported `.quiet-toggle` + `.disclosure` behavior (prototype app.css/js). */
export default function Disclosure({
  toggle,
  children,
}: {
  toggle: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="switch-block">
      <button
        className="quiet-toggle"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {toggle}
      </button>
      <div className={`disclosure ${open ? "show" : ""}`}>{children}</div>
    </div>
  );
}

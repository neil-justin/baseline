import type { ReactNode } from "react";
import AppBar from "@/components/AppBar";

/** Post-login shell: sticky 5-item app bar (locked nav). */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppBar />
      <main id="main">{children}</main>
    </>
  );
}

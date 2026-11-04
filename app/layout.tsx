import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Baseline",
  description:
    "Know exactly where you stand — a college career-readiness instrument for the Philippines: an evidence-cited score, your gaps in bars, and a ranked plan for every one.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/** `.js` gates the motion layer exactly like the prototype's head script.
 *  next/script (beforeInteractive) instead of a raw inline <script>: on
 *  client-side navigations React re-renders the head, and raw inline
 *  scripts are skipped during client rendering — beforeInteractive renders
 *  it into the initial document exactly once and stays navigation-safe. */
const jsClassScript = `document.documentElement.classList.add("js")`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="js-bootstrap" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: jsClassScript }} />
        {/* The two faces every surface paints with first — preloaded so the
            font swap never lands after first paint (no FOUT reflow). */}
        <link
          rel="preload"
          href="/fonts/archivo-var-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/fragment-mono-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* DNA v7 (app-shell) faces — self-hosted, offline venue; preloaded so
            the `font-display: block` window covers first paint. */}
        <link
          rel="preload"
          href="/fonts/roboto-var-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/material-symbols-outlined-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* DNA v9 (Google-school M3) faces — self-hosted woff2 (see DESIGN.md
            v9 amendment + The Offline Font Rule); preloaded for first paint. */}
        <link
          rel="preload"
          href="/fonts/google-sans/google-sans-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/google-sans/google-sans-text-400-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/google-sans/google-sans-text-500-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* The admin realm's own 15-glyph Material Symbols subset — preloaded
            so the console sidebar never paints label-only and swaps to
            glyphs after the font lands (the MPA reload blink, reported
            2026-11-04: full dev reloads re-request the woff2 per jump).
            Same file admin-tabs.css @font-face declares. */}
        <link
          rel="preload"
          href="/fonts/material-symbols-outlined-admin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

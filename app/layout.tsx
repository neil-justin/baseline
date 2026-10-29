import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Career Path Readiness",
  description:
    "Know exactly where you stand — a Philippines-specific career readiness instrument for SHS students.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/** `.js` gates the motion layer exactly like the prototype's head script. */
const jsClassScript = `document.documentElement.classList.add("js")`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsClassScript }} />
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

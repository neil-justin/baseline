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

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* v7.1 shell fix (user-ruled 2026-10-29): at 390px the dev-tools N disc
     (default bottom-left anchor) sits directly on the "Dashboard" bottom-nav
     label and reads as a stray fixed avatar disc. Every indicator corner
     collides with app chrome at 390–720 (bottom-left → Dashboard caption,
     bottom-right → Profile caption), so the indicator is turned off; the
     nav items stay, Next still surfaces compile/runtime errors. (The v7.2
     top bar and its avatar disc retired in the v7.3 sidebar round.) */
  devIndicators: false,
};

export default nextConfig;

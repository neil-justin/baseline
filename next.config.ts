import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* v7.1 shell fix (user-ruled 2026-10-29): at 390px the dev-tools N disc
     (default bottom-left anchor) sits directly on the "Dashboard" bottom-nav
     label and reads as a stray fixed avatar disc. Every indicator corner
     collides with app chrome at 390–720 (bottom-left → Dashboard caption,
     bottom-right → Profile caption, top corners → avatar disc / brand mark),
     so the indicator is turned off; the real avatar disc and the nav item
     both stay, Next still surfaces compile/runtime errors. */
  devIndicators: false,
};

export default nextConfig;

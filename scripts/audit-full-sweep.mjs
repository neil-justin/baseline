// Full app audit sweep: landing -> signup -> signin -> student -> counselor -> sysadmin
// Captures screenshots (1440 + 390) and runtime findings (console errors, page errors,
// horizontal overflow, undersized touch targets, failed requests).
import { chromium } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";

const base = process.env.AUDIT_BASE ?? "http://localhost:3000";
const OUT = ".impeccable/review/audit-sweep";
mkdirSync(OUT, { recursive: true });

const findings = []; // {stage, width, kind, detail}
const stages = [];

function record(stage, kind, detail) {
  findings.push({ stage, kind, detail });
}

async function snapshot(page, stage, width) {
  await page.waitForTimeout(800);
  const tag = `${stage}-${width}`;
  await page.screenshot({ path: `${OUT}/${tag}.png`, fullPage: true });
  // horizontal overflow
  const overflow = await page.evaluate(() => {
    const d = document.documentElement;
    const over = d.scrollWidth - d.clientWidth;
    const culprits = [];
    if (over > 2) {
      for (const el of document.querySelectorAll("*")) {
        const r = el.getBoundingClientRect();
        if (r.right > d.clientWidth + 2 && r.width > 24 && r.height > 8) {
          culprits.push(`${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.split(" ").slice(0, 2).join(".") : ""} w=${Math.round(r.width)}`);
          if (culprits.length >= 4) break;
        }
      }
    }
    return { over: Math.round(over), culprits };
  });
  if (overflow.over > 2) record(stage, "horizontal-overflow", `${width}px: scrollWidth exceeds viewport by ${overflow.over}px; culprits: ${overflow.culprits.join(" | ")}`);
  // small touch targets among interactive elements
  if (width === 390) {
    const small = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll("a,button,input,select,[role=button],[role=tab]")) {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none" || r.width === 0) continue;
        if (r.width < 24 || r.height < 24) {
          out.push(`${el.tagName.toLowerCase()}${typeof el.className === "string" ? "." + String(el.className).split(" ").slice(0, 2).join(".") : ""} ${Math.round(r.width)}x${Math.round(r.height)}`);
          if (out.length >= 6) break;
        }
      }
      return out;
    });
    if (small.length) record(stage, "small-touch-targets", `${width}px: ${small.join("; ")}`);
  }
}

const browser = await chromium.launch();

async function sweep(stage, routes, { signIn, width, height }) {
  const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") record(stage, "console-error", `${width}px: ${m.text().slice(0, 300)}`); });
  page.on("pageerror", (e) => record(stage, "page-error", `${width}px: ${String(e).slice(0, 300)}`));
  page.on("response", (r) => { if (r.status() >= 500 && r.url().includes("://localhost:3000")) record(stage, "http-5xx", `${width}px: ${r.status()} ${r.url()}`); });
  try {
    if (signIn) {
      await page.goto(`${base}/signin`, { waitUntil: "networkidle" });
      await page.fill("#f-email", signIn.email);
      await page.fill("#f-pass", signIn.password);
      await page.click("#signin-form button[type=submit]");
      await page.waitForURL(/dashboard|onboarding|admin/, { timeout: 25000 });
      record(stage, "landed-after-signin", `${width}px: ${page.url().replace(base, "") || "/"}`);
    }
    for (const route of routes) {
      const key = route === "/" ? "root" : route.replace(/[^a-z0-9-]+/gi, "-");
      try {
        await page.goto(`${base}${route}`, { waitUntil: "networkidle", timeout: 30000 });
        await snapshot(page, `${stage}_${key}`, width);
        stages.push({ stage, route, width, url: page.url() });
      } catch (e) {
        record(stage, "navigation-failure", `${width}px: ${route} -> ${String(e).slice(0, 200)}`);
        await page.screenshot({ path: `${OUT}/${stage}_${key}-${width}-FAILED.png` }).catch(() => {});
      }
    }
  } finally {
    await ctx.close();
  }
}

// 1. Public flow: landing, signup, signin (no account creation)
await sweep("public", ["/", "/signup", "/signin", "/forgot"], { width: 1440, height: 900 });
await sweep("public", ["/", "/signup", "/signin"], { width: 390, height: 844 });

// 2. Student (manuel.zubiri — EDGE persona)
const student = {
  email: process.env.E2E_EDGE_STUDENT_EMAIL ?? "",
  password: process.env.E2E_EDGE_STUDENT_PASSWORD ?? "",
};
await sweep("student", ["/dashboard", "/pathway", "/career", "/progress", "/prep", "/profile"], { signIn: student, width: 1440, height: 900 });
await sweep("student", ["/dashboard", "/prep", "/profile"], { signIn: student, width: 390, height: 844 });

// 3. Counselor
const counselor = {
  email: process.env.E2E_COUNSELOR_EMAIL ?? "",
  password: process.env.E2E_COUNSELOR_PASSWORD ?? "",
};
await sweep("counselor", ["/admin", "/admin?tab=cohort", "/admin?tab=approvals", "/admin?tab=accounts"], { signIn: counselor, width: 1440, height: 900 });
await sweep("counselor", ["/admin"], { signIn: counselor, width: 390, height: 844 });

// 4. Sysadmin
const sysadmin = {
  email: process.env.E2E_SYSADMIN_EMAIL ?? "",
  password: process.env.E2E_SYSADMIN_PASSWORD ?? "",
};
await sweep("sysadmin", ["/admin", "/admin?tab=cohort", "/admin?tab=accounts"], { signIn: sysadmin, width: 1440, height: 900 });

await browser.close();
writeFileSync(`${OUT}/findings.json`, JSON.stringify({ findings, stages }, null, 2));
console.log(`CAPTURED ${stages.length} stage renders, ${findings.length} findings -> ${OUT}/`);

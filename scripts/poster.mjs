#!/usr/bin/env node
/*
 * Renders public/wtc-poster.png (1920x1080), the link-preview image named in
 * layout.tsx, with headless Chrome. The install line comes from the same
 * constant as the page, so the card cannot teach a different command.
 *
 *   npm run poster
 *
 * Content stays inside the middle 1920x960, which survives X's 2:1 crop.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { INSTALL } from "../src/app/lib/content.ts";

const CHROME =
  process.env.CHROME ??
  (process.platform === "darwin"
    ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    : "google-chrome");
const out = path.resolve(import.meta.dirname, "../public/wtc-poster.png");

const html = `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500&family=JetBrains+Mono:wght@500&display=block">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1920px; height: 1080px; background: #0d1117; color: #e6edf3; overflow: hidden; }
  body { font-family: "Hanken Grotesk", sans-serif; padding: 108px 96px; display: grid; grid-template-rows: auto 1fr auto; -webkit-font-smoothing: antialiased; }
  .mark { display: flex; align-items: center; gap: 16px; font-size: 34px; font-weight: 500; letter-spacing: -0.01em; }
  .mark svg { width: 40px; height: 40px; color: #58a6ff; }
  h1 { align-self: center; font-size: 236px; font-weight: 500; line-height: 0.86; letter-spacing: -0.055em; }
  h1 span { display: block; }
  h1 span + span { text-align: right; }
  .foot { display: flex; align-items: flex-end; justify-content: space-between; gap: 64px; }
  .foot p { font-size: 36px; line-height: 1.35; letter-spacing: -0.015em; max-width: 30ch; color: #e6edf3; }
  .install { flex: none; background: #e6edf3; color: #0d1117; font-family: "JetBrains Mono", monospace; font-weight: 500; font-size: 38px; padding: 28px 36px; white-space: nowrap; }
  .install .d { opacity: 0.55; margin-right: 0.6em; }
</style></head>
<body>
  <div class="mark">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M7 3v13"/><circle cx="7" cy="19" r="2.6"/><circle cx="17" cy="6" r="2.6"/><path d="M17 8.6a9 9 0 0 1-8 9.6"/></svg>
    worktree-compose
  </div>
  <h1><span>A stack per</span><span>worktree.</span></h1>
  <div class="foot">
    <p>Zero-config Docker Compose isolation for git worktrees: its own ports, containers and volumes.</p>
    <div class="install"><span class="d">$</span>${INSTALL}</div>
  </div>
</body></html>`;

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "wtc-poster-"));
const page = path.join(dir, "poster.html");
fs.writeFileSync(page, html);
try {
  execFileSync(CHROME, [
    "--headless=new",
    `--user-data-dir=${path.join(dir, "profile")}`,
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--window-size=1920,1080",
    "--virtual-time-budget=10000",
    `--screenshot=${out}`,
    `file://${page}`,
  ], { stdio: "ignore" });
} finally {
  fs.rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
console.log(`wrote ${out}`);

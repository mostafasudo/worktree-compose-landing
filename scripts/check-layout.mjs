#!/usr/bin/env node
/*
 * Layout regression checks in headless Chrome, over the DevTools protocol
 * with Node's built-in WebSocket (no dependencies).
 *
 *   npm run build && npm start        # in one shell
 *   npm run test:layout               # in another
 *
 * BASE_URL   page to check (default http://localhost:3000)
 * CHROME     Chrome binary (default: Google Chrome on macOS, else google-chrome)
 * SCREENSHOTS  directory: also save full-page screenshots at 1440 and 390
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const CHROME =
  process.env.CHROME ??
  (process.platform === "darwin"
    ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    : "google-chrome");
const SHOTS = process.env.SCREENSHOTS;
const WIDTHS = [390, 768, 900, 1024, 1100, 1200, 1280, 1366, 1440];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function launch() {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "wtc-layout-"));
  const proc = spawn(
    CHROME,
    [
      "--headless=new",
      "--remote-debugging-port=0",
      `--user-data-dir=${profile}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--hide-scrollbars",
      "about:blank",
    ],
    { stdio: "ignore" },
  );
  const portFile = path.join(profile, "DevToolsActivePort");
  for (let n = 0; n < 100 && !fs.existsSync(portFile); n++) await sleep(100);
  const port = fs.readFileSync(portFile, "utf8").split("\n")[0];
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const page = targets.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });
  let id = 0;
  const pending = new Map();
  const waiters = [];
  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(new Error(`${data.error.message}`));
      else resolve(data.result);
    } else if (data.method) {
      for (const w of waiters.filter((w) => w.method === data.method)) {
        waiters.splice(waiters.indexOf(w), 1);
        w.resolve(data.params);
      }
    }
  };
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const n = ++id;
      pending.set(n, { resolve, reject });
      ws.send(JSON.stringify({ id: n, method, params }));
    });
  const once = (method) => new Promise((resolve) => waiters.push({ method, resolve }));
  const close = async () => {
    ws.close();
    const exited = new Promise((resolve) => proc.once("exit", resolve));
    proc.kill();
    await exited;
    fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  };
  return { send, once, close };
}

async function evaluate(send, fn, arg) {
  const expression = `(${fn})(${JSON.stringify(arg ?? null)})`;
  const { result, exceptionDetails } = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (exceptionDetails) throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text);
  return result.value;
}

/** Load at a width, scroll through so every reveal has run, return to top. */
async function load(cdp, width) {
  const height = width < 768 ? 844 : 900;
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 768,
  });
  const loaded = cdp.once("Page.loadEventFired");
  await cdp.send("Page.navigate", { url: BASE_URL });
  await loaded;
  await evaluate(cdp.send, async () => {
    await document.fonts.ready;
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.7) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 1300));
  });
}

/** Runs in the page: every layout problem the findings described. */
function pageChecks() {
  const out = [];
  const W = innerWidth;
  const de = document.documentElement;
  if (de.scrollWidth > W) out.push(`the page scrolls sideways (${de.scrollWidth}px > ${W}px)`);

  const inst = document.querySelector(".install code");
  if (inst.scrollWidth > inst.clientWidth + 1)
    out.push(`the install command is cut off (${inst.scrollWidth}px in ${inst.clientWidth}px)`);
  if (inst.closest(".install").getBoundingClientRect().right > W + 0.5)
    out.push("the install button runs past the viewport");

  for (const pre of document.querySelectorAll(".panel pre:not(.boxes)")) {
    if (pre.scrollWidth > pre.clientWidth + 1)
      out.push(`a code panel is clipped: "${pre.textContent.trim().slice(0, 40)}"`);
  }
  // Shell commands break between arguments only, never inside one.
  for (const word of document.querySelectorAll(".panel pre .ln .nowrap")) {
    if (word.getClientRects().length > 1) out.push(`a command breaks inside "${word.textContent}"`);
  }
  // 10px type is the floor; from about 810px wide every column fits.
  if (W >= 810) {
    for (const pre of document.querySelectorAll("pre.boxes")) {
      if (pre.scrollWidth > pre.clientWidth + 1)
        out.push(`a wtc list table is clipped by ${pre.scrollWidth - pre.clientWidth}px`);
    }
  }

  // Round digits overshoot the baseline by ~0.009em; the clip box must clear it.
  for (const box of document.querySelectorAll(".figure-box")) {
    const digits = box.querySelector(".digits");
    const mark = document.createElement("span");
    mark.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline";
    digits.appendChild(mark);
    const baseline = mark.getBoundingClientRect().bottom;
    mark.remove();
    const size = parseFloat(getComputedStyle(box).fontSize);
    const room = box.getBoundingClientRect().bottom - baseline;
    if (room < 0.012 * size)
      out.push(`port digits are clipped (${room.toFixed(1)}px below the baseline at ${size.toFixed(0)}px type)`);
  }

  const heading = document.getElementById("commands-h").getBoundingClientRect();
  if (heading.height < 10) out.push("the Commands heading is not visible");

  for (const d of document.querySelectorAll(".cmd-item:not(.is-open) .cmd-detail")) {
    if (d.getAttribute("hidden") !== "until-found" || getComputedStyle(d).display === "none") {
      out.push("a closed command description cannot be reached by find-in-page");
      break;
    }
  }

  const cta = document.querySelector(".cta code");
  const lines = new Set([...cta.querySelectorAll(".nowrap")].map((s) => Math.round(s.getBoundingClientRect().top)));
  for (const part of cta.querySelectorAll(".nowrap")) {
    if (part.getClientRects().length > 1) out.push(`the install command breaks inside "${part.textContent}"`);
  }
  if (lines.size > 2) out.push("the install band command breaks into more than two lines");

  return out;
}

/** Runs in the page: find-in-page fires beforematch, which must open the row. */
async function beforematchOpens() {
  const item = document.querySelector(".cmd-item:not(.is-open)");
  item.querySelector(".cmd-detail").dispatchEvent(new Event("beforematch", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 50));
  return item.querySelector(".cmd-row").getAttribute("aria-expanded") === "true";
}

/** Box-drawing characters must come from JetBrains Mono, not a fallback. */
async function boxFonts(cdp) {
  await cdp.send("DOM.enable");
  await cdp.send("CSS.enable");
  const { root } = await cdp.send("DOM.getDocument", { depth: -1 });
  const { nodeId } = await cdp.send("DOM.querySelector", { nodeId: root.nodeId, selector: "pre.boxes code" });
  const { fonts } = await cdp.send("CSS.getPlatformFontsForNode", { nodeId });
  return fonts.map((f) => f.familyName);
}

async function screenshot(cdp, file) {
  // A beyond-viewport capture resizes the viewport, so pin everything sized
  // in viewport units to its current pixels first.
  // Then show every section as a reader who scrolled down would see it.
  await evaluate(cdp.send, async () => {
    for (const el of document.querySelectorAll(".hero, .hero-title, .problem-inner, .figures, .cta")) {
      const cs = getComputedStyle(el);
      el.style.minHeight = cs.minHeight === "auto" ? "" : `${el.getBoundingClientRect().height}px`;
      el.style.marginTop = cs.marginTop;
    }
    for (const el of document.querySelectorAll("[data-reveal]")) el.dataset.in = "";
    await new Promise((r) => setTimeout(r, 1500));
  });
  const { cssContentSize } = await cdp.send("Page.getLayoutMetrics");
  const { data } = await cdp.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: cssContentSize.width, height: cssContentSize.height, scale: 1 },
  });
  fs.writeFileSync(file, Buffer.from(data, "base64"));
}

const cdp = await launch();
let failures = 0;
try {
  await cdp.send("Page.enable");
  for (const width of WIDTHS) {
    await load(cdp, width);
    const problems = await evaluate(cdp.send, pageChecks);
    if (!(await evaluate(cdp.send, beforematchOpens))) problems.push("beforematch does not open the command");
    if (width === 1440) {
      const families = await boxFonts(cdp);
      if (families.some((f) => !/JetBrains Mono/i.test(f)))
        problems.push(`wtc list box drawing renders in ${families.join(", ")}`);
    }
    const where = await evaluate(cdp.send, () => {
      const top = (id) => (document.getElementById(id).getBoundingClientRect().top + scrollY) / innerHeight;
      return `page ${(document.documentElement.scrollHeight / innerHeight).toFixed(1)} screens, agents at ${top("agents").toFixed(1)}`;
    });
    failures += problems.length;
    console.log(`${problems.length ? "FAIL" : "ok  "} ${String(width).padStart(4)}px  ${where}`);
    for (const p of problems) console.log(`       - ${p}`);
    if (SHOTS && (width === 1440 || width === 390)) {
      fs.mkdirSync(SHOTS, { recursive: true });
      await load(cdp, width);
      const file = path.join(SHOTS, width === 1440 ? "landing-desktop.png" : "landing-mobile.png");
      await screenshot(cdp, file);
      console.log(`       saved ${file}`);
    }
  }
} finally {
  await cdp.close();
}
process.exit(failures ? 1 : 0);

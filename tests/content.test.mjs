/*
 * What the page and its SKILL.md tell people to run. Each test pins a claim a
 * review found wrong, so it cannot come back unnoticed.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { CLAUDE_MCP_ADD, COMMANDS, INSTALL, MCP_TOOLS } from "../src/app/lib/content.ts";

const root = path.resolve(import.meta.dirname, "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const sources = () => {
  const files = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(tsx?|css)$/.test(e.name)) files.push(p);
    }
  };
  walk("src");
  return files;
};
const skill = read("public/SKILL.md");

test("the install is global, so wtc is on PATH for the shell and MCP clients", () => {
  assert.equal(INSTALL, "npm install -g worktree-compose");
  for (const f of [...sources(), "public/SKILL.md"]) {
    assert.doesNotMatch(read(f), /install -D worktree-compose/, f);
  }
});

test("nothing tells people to run `npx wtc` (an unrelated npm package is named wtc)", () => {
  for (const f of sources()) {
    // DemoVideo.tsx explains why the old explainer is off the page.
    if (f.endsWith("DemoVideo.tsx")) continue;
    assert.doesNotMatch(read(f), /npx wtc/, f);
  }
  const mentions = skill.split("\n").filter((l) => l.includes("npx wtc"));
  assert.ok(mentions.every((l) => /(Do not use|Never run) `npx wtc`/.test(l)), mentions.join("\n"));
});

test("Claude Code registration is user-scoped, so it works in every project", () => {
  assert.match(CLAUDE_MCP_ADD, /^claude mcp add --scope user wtc -- wtc mcp$/);
  assert.ok(skill.includes(`\`${CLAUDE_MCP_ADD}\``));
  for (const f of [...sources(), "public/SKILL.md"]) {
    assert.doesNotMatch(read(f), /claude mcp add wtc/, f);
  }
});

test("clean says it deletes volumes and points to stop for keeping data", () => {
  const clean = COMMANDS.find((c) => c.name === "clean");
  assert.match(clean.desc, /down -v/);
  assert.match(clean.desc, /deletes their volumes/);
  assert.match(clean.desc, /--keep-worktrees keeps the checkouts but still deletes the volumes/);
  assert.match(clean.desc, /wtc stop/);
  assert.match(skill, /`(wtc )?clean` and `(wtc )?prune` delete volumes/);
});

test("SKILL.md documents every command and every MCP tool the page lists", () => {
  for (const c of COMMANDS) assert.ok(skill.includes(`\`wtc ${c.name}`), `wtc ${c.name}`);
  assert.deepEqual(MCP_TOOLS, [
    "wtc_start",
    "wtc_stop",
    "wtc_restart",
    "wtc_list",
    "wtc_promote",
    "wtc_clean",
    "wtc_prune",
    "wtc_doctor",
  ]);
  for (const t of MCP_TOOLS) assert.ok(skill.includes(`\`${t}\``), t);
});

test("the project-name claim is qualified for a custom envFile", () => {
  const page = read("src/app/page.tsx");
  assert.match(page, /--env-file \.env\.development/);
  assert.match(skill, /--env-file \.env\.development/);
});

test("the env file is described as re-copied from main on every start", () => {
  const page = read("src/app/page.tsx");
  assert.doesNotMatch(page, /everything else stays as it was/);
  assert.match(page, /copy is made fresh on every start/);
  assert.match(skill, /fresh from main/);
});

test("a URL with a port inside it is shown to need envOverrides", () => {
  const page = read("src/app/page.tsx");
  assert.match(page, /"envOverrides": \{\n\s+"DATABASE_URL": "postgresql:\/\/app:app@localhost:\\\$\{POSTGRES_PORT\}\/app"/);
  assert.match(skill, /"DATABASE_URL": "postgresql:\/\/app:app@localhost:\$\{POSTGRES_PORT\}\/app"/);
});

test("wtc is not said to record ports (they follow from the index)", () => {
  assert.doesNotMatch(read("src/app/page.tsx"), /index, ports and Compose/);
  assert.doesNotMatch(skill, /index, ports and Compose/);
});

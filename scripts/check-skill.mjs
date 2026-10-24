#!/usr/bin/env node
/*
 * Release check: `wtc skill --install` writes the SKILL.md bundled in the
 * worktree-compose package, while the page's Copy and Download buttons serve
 * public/SKILL.md. They must be the same document.
 *
 *   npm run check:skill             # compares with ../worktree-compose/SKILL.md
 *   WTC_REPO=/path npm run check:skill
 */
import fs from "node:fs";
import path from "node:path";

const here = path.resolve(import.meta.dirname, "..");
const candidates = [
  process.env.WTC_REPO && path.join(process.env.WTC_REPO, "SKILL.md"),
  path.join(here, "../worktree-compose/SKILL.md"),
  path.join(here, "node_modules/worktree-compose/SKILL.md"),
].filter(Boolean);
const bundled = candidates.find((p) => fs.existsSync(p));
if (!bundled) {
  console.error(`No bundled SKILL.md found (looked in ${candidates.join(", ")}). Set WTC_REPO.`);
  process.exit(2);
}
const served = path.join(here, "public/SKILL.md");
if (fs.readFileSync(bundled, "utf8") === fs.readFileSync(served, "utf8")) {
  console.log(`ok: ${bundled} matches public/SKILL.md`);
} else {
  console.error(
    `${bundled} differs from public/SKILL.md, so \`wtc skill --install\` installs a different skill ` +
      `from the one this page serves. Copy public/SKILL.md into the tool repo before publishing.`,
  );
  process.exit(1);
}

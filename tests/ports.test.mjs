import assert from "node:assert/strict";
import { test } from "node:test";
import { LIST_HEAD, allocatePort, columnWidths, listRows, rule, tableWidth } from "../src/app/lib/ports.ts";

test("ports follow wtc's formula: 20000 + default + index × stride", () => {
  assert.equal(allocatePort(5173, 1).port, 25174);
  assert.equal(allocatePort(5434, 2).port, 25436);
  assert.equal(allocatePort(8000, 3, 100).port, 28300);
});

test("ports past 65535 fall back to default + 100 × index", () => {
  assert.deepEqual(allocatePort(50000, 2), { port: 50200, fallback: true, valid: true });
});

test("wtc list: main names services, worktree rows name env vars, as the CLI prints", () => {
  const [main, wt1] = listRows([{ index: 1, branch: "feature-auth", status: "up" }]);
  assert.deepEqual(main, ["-", "main", "-", "-", "postgres:5434 backend:8000 frontend:5173"]);
  assert.deepEqual(wt1, [
    "1",
    "feature-auth",
    "up",
    "http://localhost:25174",
    "POSTGRES_PORT=25435 BACKEND_PORT=28001 FRONTEND_PORT=25174",
  ]);
});

test("wtc list keeps a removed worktree's neighbours on their own ports", () => {
  const rows = listRows([
    { index: 1, branch: "feature-auth", status: "up" },
    { index: 3, branch: "refactor-api", status: "down" },
  ]);
  assert.equal(rows[2][0], "3");
  assert.equal(rows[2][3], "http://localhost:25176");
});

test("the table width the type is scaled by matches the drawn table", () => {
  const rows = listRows([{ index: 1, branch: "feature-auth", status: "up" }]);
  const widths = columnWidths(LIST_HEAD, rows);
  // Each row is │ then, per cell, " cell │": the same width as a rule.
  const row = "│" + rows[1].map((cell, c) => ` ${cell.padEnd(widths[c])} │`).join("");
  assert.equal(rule(widths, "┌", "┬", "┐").length, tableWidth(widths));
  assert.equal(row.length, tableWidth(widths));
});

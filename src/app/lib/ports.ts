/*
 * The port arithmetic and `wtc list` output the page shows, computed the way
 * the CLI computes them so the examples cannot drift from the tool. This file
 * imports nothing, so the tests can load it with Node's type stripping.
 */

export type Service = { name: string; envVar: string; port: number; container: number };

/** The services in the page's docker-compose.yml example. */
export const COMPOSE_SERVICES: Service[] = [
  { name: "postgres", envVar: "POSTGRES_PORT", port: 5434, container: 5432 },
  { name: "backend", envVar: "BACKEND_PORT", port: 8000, container: 8000 },
  { name: "frontend", envVar: "FRONTEND_PORT", port: 5173, container: 5173 },
];

const BASE_OFFSET = 20000;

/** Mirrors wtc's allocatePort(): 20000 + default + index × portStride,
 *  falling back to default + 100 × index past 65535. */
export function allocatePort(def: number, index: number, stride = 1) {
  let port = BASE_OFFSET + def + index * stride;
  let fallback = false;
  if (port > 65535) {
    port = def + 100 * index;
    fallback = true;
  }
  const valid = port <= 65535 && port >= 1024;
  return { port, fallback, valid };
}

export type ListWorktree = { index: number; branch: string; status: "up" | "down" };

export const LIST_HEAD = ["Index", "Branch", "Status", "URL", "Ports"];

/**
 * Rows of `wtc list` as the CLI prints them (commands/list.ts): the main row
 * names services (`postgres:5434`), worktree rows name env vars
 * (`POSTGRES_PORT=25435`), and the URL is the frontend-ish service's port.
 */
export function listRows(worktrees: ListWorktree[], services: Service[] = COMPOSE_SERVICES): string[][] {
  const main = ["-", "main", "-", "-", services.map((s) => `${s.name}:${s.port}`).join(" ")];
  const rows = worktrees.map((w) => {
    const ports = services.map((s) => ({ ...s, port: allocatePort(s.port, w.index).port }));
    const web = ports.find((s) => /frontend|web|app|ui/.test(s.name)) ?? ports[ports.length - 1];
    return [
      String(w.index),
      w.branch,
      w.status,
      `http://localhost:${web.port}`,
      ports.map((s) => `${s.envVar}=${s.port}`).join(" "),
    ];
  });
  return [main, ...rows];
}

/** Column widths of a cli-table3 box table: the longest cell per column. */
export function columnWidths(head: string[], rows: string[][]): number[] {
  return head.map((h, c) => Math.max(h.length, ...rows.map((r) => r[c].length)));
}

/** Width in characters of the box table: cells, one space either side, and borders. */
export function tableWidth(widths: number[]): number {
  return widths.reduce((sum, w) => sum + w + 2, 0) + widths.length + 1;
}

/** A horizontal rule of the box table, e.g. rule(w, "├", "┼", "┤"). */
export function rule(widths: number[], left: string, mid: string, right: string): string {
  return left + widths.map((w) => "─".repeat(w + 2)).join(mid) + right;
}

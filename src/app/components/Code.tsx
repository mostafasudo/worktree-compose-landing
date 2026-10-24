import type { CSSProperties, ReactNode } from "react";

/**
 * One line of a code panel. Panels wrap instead of scrolling, so each line is
 * a block with a hanging indent: a wrapped line continues `ind` characters in,
 * under its own text, and never reads as a new line at column 0.
 */
export function Ln({ ind = 2, children }: { ind?: number; children?: ReactNode }) {
  const empty = children === undefined || children === "" || (Array.isArray(children) && children.length === 0);
  return (
    <span className="ln" style={{ ["--ind" as string]: ind } as CSSProperties}>
      {/* An empty block has no height; a space keeps blank lines. */}
      {empty ? " " : children}
    </span>
  );
}

/**
 * A shell line: the `$ ` prompt, with wrapped lines indented past it. A
 * command given as a string breaks only between arguments, never after the
 * hyphens inside one (`--` / `workspace`), which browsers otherwise allow.
 */
export function Cmd({ children }: { children: ReactNode }) {
  const words =
    typeof children === "string"
      ? children.split(" ").flatMap((w, n) => [
          ...(n > 0 ? [" "] : []),
          <span key={n} className="nowrap">
            {w}
          </span>,
        ])
      : children;
  return (
    <Ln ind={4}>
      <span className="c-dim">$ </span>
      {words}
    </Ln>
  );
}

/** Minimal highlighting for the JSON, YAML and env snippets on the page. */
export function highlight(src: string, lang: "json" | "yaml" | "env"): ReactNode[] {
  return src.split("\n").map((line, li) => (
    <Ln key={li} ind={line.length - line.trimStart().length + 2}>
      {highlightLine(line, lang)}
    </Ln>
  ));
}

/** A string token that may wrap before each `${VAR}`, rather than inside one. */
function str(text: string, key: number): ReactNode {
  return (
    <span key={key} className="c-str">
      {text.split("${").map((part, n) => (n === 0 ? part : [<wbr key={n} />, "${" + part]))}
    </span>
  );
}

function highlightLine(line: string, lang: "json" | "yaml" | "env"): ReactNode[] {
  const out: ReactNode[] = [];
  let k = 0;
  if (lang === "env") {
    if (line.startsWith("#")) {
      out.push(
        <span key={k++} className="c-dim">
          {line}
        </span>,
      );
      return out;
    }
    const eq = line.indexOf("=");
    if (eq > 0) {
      out.push(
        <span key={k++} className="c-key">
          {line.slice(0, eq)}
        </span>,
        <span key={k++} className="c-dim">
          =
        </span>,
        <span key={k++} className="c-num">
          {line.slice(eq + 1)}
        </span>,
      );
      return out;
    }
    if (line) out.push(line);
    return out;
  }
  const re =
    lang === "json"
      ? /("(?:[^"\\]|\\.)*")(\s*:)?|(\b\d+\b)/g
      : /^(\s*-?\s*)([A-Za-z_][\w.-]*)(:)|("(?:[^"\\]|\\.)*")/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    if (lang === "json") {
      if (m[1] && m[2]) {
        out.push(
          <span key={k++} className="c-key">
            {m[1]}
          </span>,
          m[2],
        );
      } else if (m[1]) {
        out.push(str(m[1], k++));
      } else {
        out.push(
          <span key={k++} className="c-num">
            {m[3]}
          </span>,
        );
      }
    } else if (m[2]) {
      out.push(
        m[1],
        <span key={k++} className="c-key">
          {m[2]}
        </span>,
        m[3],
      );
    } else {
      out.push(str(m[4], k++));
    }
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

/** Status glyphs the CLI prints, drawn so they render the same everywhere. */
export function Glyph({ kind }: { kind: "warn" | "ok" | "err" }) {
  const cls = kind === "warn" ? "c-warn" : kind === "ok" ? "c-ok" : "c-err";
  const label = kind === "warn" ? "warning" : kind === "ok" ? "done" : "error";
  return (
    <span className={`glyph ${cls}`} role="img" aria-label={label}>
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
        {kind === "warn" && (
          <>
            <path d="M8 2.2 14.2 13.3H1.8Z" strokeLinejoin="round" />
            <path d="M8 6.4v3.3M8 11.2v.4" strokeLinecap="round" />
          </>
        )}
        {kind === "ok" && <path d="M3 8.5l3.2 3.2L13 4.8" />}
        {kind === "err" && <path d="M4 4l8 8M12 4l-8 8" />}
      </svg>
    </span>
  );
}

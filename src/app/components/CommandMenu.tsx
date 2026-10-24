"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Command } from "../lib/content";

export type { Command };

// Runs before paint on the client; on the server it is a no-op.
const useClientLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function CommandMenu({ commands }: { commands: Command[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(commands[0]?.name ?? "");
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const detailRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^wtc\s+/, "");
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.name.includes(q) ||
        c.usage.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q),
    );
  }, [commands, query]);

  const current = visible.find((c) => c.name === open) ? open : visible[0]?.name;

  // Closed descriptions are hidden="until-found", not display:none, so the
  // browser's find-in-page still reaches them; a match fires beforematch,
  // which opens that command. React only knows boolean `hidden`, so the
  // attribute is set here. Until this runs (and without JS) a CSS rule keyed
  // on data-ready does the hiding instead.
  useClientLayoutEffect(() => {
    for (const c of visible) {
      const el = detailRefs.current[c.name];
      if (!el) continue;
      if (c.name === current) el.removeAttribute("hidden");
      else el.setAttribute("hidden", "until-found");
    }
    rootRef.current?.setAttribute("data-ready", "");
  }, [visible, current]);

  useEffect(() => {
    const cleanups = visible.map((c) => {
      const el = detailRefs.current[c.name];
      if (!el) return () => {};
      const onMatch = () => setOpen(c.name);
      el.addEventListener("beforematch", onMatch);
      return () => el.removeEventListener("beforematch", onMatch);
    });
    return () => cleanups.forEach((fn) => fn());
  }, [visible]);

  const move = (dir: 1 | -1, focusRow: boolean) => {
    if (!visible.length) return;
    const i = Math.max(0, visible.findIndex((c) => c.name === current));
    const next = visible[(i + dir + visible.length) % visible.length];
    setOpen(next.name);
    if (focusRow) rowRefs.current[next.name]?.focus();
  };

  return (
    <div data-ui className="cmd-menu" ref={rootRef}>
      <label htmlFor={`${listId}-q`} className="sr-only">
        Filter the commands
      </label>
      <div className="cmd-search-field" data-reveal style={{ ["--i" as string]: 1 }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m15.5 15.5 5 5" />
        </svg>
        <input
          id={`${listId}-q`}
          className="cmd-search"
          type="search"
          placeholder="Filter commands"
          autoComplete="off"
          spellCheck={false}
          value={query}
          aria-controls={listId}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              move(1, false);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              move(-1, false);
            }
          }}
        />
      </div>
      <p className="cmd-hint" data-reveal style={{ ["--i" as string]: 2 }}>
        Filter by name or by what a command does, then use the arrow keys or click a command to read it. Every
        command takes <code>--help</code>.
      </p>
      <ul className="cmd-list" id={listId}>
        {visible.map((c, i) => {
          const isOpen = c.name === current;
          return (
            <li
              key={c.name}
              className={`cmd-item${isOpen ? " is-open" : ""}`}
              data-reveal
              style={{ ["--i" as string]: Math.min(i, 8) + 3 }}
            >
              <button
                type="button"
                className="cmd-row"
                aria-expanded={isOpen}
                aria-controls={`${listId}-${c.name}`}
                ref={(el) => {
                  rowRefs.current[c.name] = el;
                }}
                onClick={() => setOpen(c.name)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    move(1, true);
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    move(-1, true);
                  }
                }}
              >
                <span className="cmd-row-name">
                  <span className="pre" aria-hidden="true">
                    wtc
                  </span>
                  {c.name}
                </span>
                {c.usage && <code className="usage">{c.usage}</code>}
              </button>
              <div
                className="cmd-detail"
                id={`${listId}-${c.name}`}
                ref={(el) => {
                  detailRefs.current[c.name] = el;
                }}
              >
                <div className="cmd-detail-inner">
                  <p>{c.desc}</p>
                  <pre>
                    <code>
                      <span className="c-dim">$ </span>
                      {c.example}
                    </code>
                  </pre>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {visible.length === 0 && (
        <p className="cmd-empty">
          No command matches &ldquo;{query}&rdquo;. Try <code>start</code>, <code>ports</code> or{" "}
          <code>clean</code>.
        </p>
      )}
    </div>
  );
}

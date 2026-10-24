"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { CLAUDE_MCP_ADD } from "../lib/content";
import { Cmd, Ln, highlight } from "./Code";
import { CopyButton } from "./CopyButton";

type Step = { note: string; file: string; text: string; render: ReactNode };
type Client = { id: string; label: string; steps: Step[] };

const MCP_JSON = `{
  "mcpServers": {
    "wtc": {
      "command": "wtc",
      "args": ["mcp"]
    }
  }
}`;

const MCP_TOML = `[mcp_servers.wtc]
command = "wtc"
args = ["mcp"]`;

function TomlView() {
  return (
    <>
      <Ln>
        <span className="c-key">[mcp_servers.wtc]</span>
      </Ln>
      <Ln>
        command = <span className="c-str">&quot;wtc&quot;</span>
      </Ln>
      <Ln>
        args = [<span className="c-str">&quot;mcp&quot;</span>]
      </Ln>
    </>
  );
}

const CLIENTS: Client[] = [
  {
    id: "claude",
    label: "Claude Code",
    steps: [
      {
        note: "Register it once, for all your projects:",
        file: "terminal",
        text: CLAUDE_MCP_ADD,
        render: <Cmd>{CLAUDE_MCP_ADD}</Cmd>,
      },
      {
        note: "Or share it with the team in the project's .mcp.json:",
        file: ".mcp.json",
        text: MCP_JSON,
        render: highlight(MCP_JSON, "json"),
      },
    ],
  },
  {
    id: "codex",
    label: "Codex",
    steps: [
      {
        note: "Add it to Codex's config file:",
        file: "~/.codex/config.toml",
        text: MCP_TOML,
        render: <TomlView />,
      },
    ],
  },
  {
    id: "cursor",
    label: "Cursor",
    steps: [
      {
        note: "Add it to the project's Cursor config:",
        file: ".cursor/mcp.json",
        text: MCP_JSON,
        render: highlight(MCP_JSON, "json"),
      },
    ],
  },
];

export function AgentSetup() {
  const [active, setActive] = useState(0);
  const base = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number) => {
    const n = (i + CLIENTS.length) % CLIENTS.length;
    setActive(n);
    tabRefs.current[n]?.focus();
  };

  return (
    <div>
      <div className="tabs" role="tablist" aria-label="MCP client">
        {CLIENTS.map((c, i) => (
          <button
            key={c.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${c.id}`}
            aria-selected={active === i}
            aria-controls={`${base}-panel-${c.id}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") select(i + 1);
              else if (e.key === "ArrowLeft") select(i - 1);
              else if (e.key === "Home") select(0);
              else if (e.key === "End") select(CLIENTS.length - 1);
            }}
          >
            {c.label}
          </button>
        ))}
      </div>
      {CLIENTS.map((c, i) => (
        <div
          key={c.id}
          role="tabpanel"
          id={`${base}-panel-${c.id}`}
          aria-labelledby={`${base}-tab-${c.id}`}
          hidden={active !== i}
        >
          {c.steps.map((s) => (
            <div key={s.file + s.note}>
              <p className="setup-step">{s.note}</p>
              <div className="panel" data-ui>
                <div className="panel-bar">
                  <code>{s.file}</code>
                  <CopyButton text={s.text} label={`Copy ${s.file === "terminal" ? "command" : s.file}`} />
                </div>
                <pre>
                  <code>{s.render}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      ))}
      <p className="setup-step">
        Any other MCP client: run <code>wtc mcp</code> as a stdio server. This needs the global install, so{" "}
        <code>wtc</code> is on your PATH.
      </p>
    </div>
  );
}

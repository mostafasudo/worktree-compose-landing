import type { CSSProperties, ReactNode } from "react";
import { AgentSetup } from "./components/AgentSetup";
import { Cmd, Glyph, Ln, highlight } from "./components/Code";
import { CommandMenu } from "./components/CommandMenu";
import { CopyButton, InstallButton } from "./components/CopyButton";
import { DemoVideo } from "./components/DemoVideo";
import { InstallBand } from "./components/InstallBand";
import { PortLab } from "./components/PortLab";
import { Reveal } from "./components/Reveal";
import { SkillActions } from "./components/SkillActions";
import { COMMANDS, INSTALL, MCP_TOOLS } from "./lib/content";
import { LIST_HEAD, columnWidths, listRows, rule, tableWidth } from "./lib/ports";

const REPO = "https://github.com/mostafasudo/worktree-compose";
const NPM = "https://www.npmjs.com/package/worktree-compose";
const DEVHUNT = "https://devhunt.org/tool/worktree-compose";

/** Stagger index for entrance motion. */
const i = (n: number) => ({ ["--i" as string]: n }) as CSSProperties;

const CONFIG_KEYS: { key: string; desc: ReactNode }[] = [
  {
    key: "envFile",
    desc: (
      <>
        The env file to copy from main and inject into, at the root and in each selected workspace. Defaults
        to <code>.env</code>. Per run: <code>--env</code>.
      </>
    ),
  },
  {
    key: "workspaces",
    desc: (
      <>
        Monorepo packages that also get their env file copied and injected, by package name, directory or
        path. Per run: <code>--workspace</code>, repeatable.
      </>
    ),
  },
  {
    key: "envOverrides",
    desc: (
      <>
        Extra variables for the root env file, with <code>{"${VAR}"}</code> filled in from that
        worktree&apos;s ports. A URL with a port in it, like <code>DATABASE_URL</code>, goes here. Keys that
        already exist are rewritten in place; new ones go in the wtc block.
      </>
    ),
  },
  {
    key: "workspaceEnvOverrides",
    desc: <>The same, for one workspace&apos;s env file.</>,
  },
  {
    key: "sync",
    desc: <>Gitignored or generated files Docker needs, copied from main on every start: generated clients, local certificates.</>,
  },
  {
    key: "portStride",
    desc: <>Spacing between worktrees&apos; ports, 1 by default. Raise it when default ports sit close together.</>,
  },
  {
    key: "composeCommand",
    desc: (
      <>
        The compose command to run when you want to choose it yourself, such as <code>podman compose</code>.
        The <code>WTC_COMPOSE_COMMAND</code> variable does the same from the shell.
      </>
    ),
  },
];

const WTCRC = `{
  "envFile": ".env.development",
  "workspaces": ["server", "homepage"],
  "envOverrides": {
    "DATABASE_URL": "postgresql://app:app@localhost:\${POSTGRES_PORT}/app"
  },
  "workspaceEnvOverrides": {
    "homepage": {
      "VITE_API_URL": "http://localhost:\${BACKEND_PORT}"
    }
  },
  "sync": [".generated/prisma-client", "local-certs/"],
  "portStride": 100,
  "composeCommand": "podman compose"
}`;

const COMPOSE = `services:
  postgres:
    image: postgres:16
    ports:
      - "\${POSTGRES_PORT:-5434}:5432"
  backend:
    build: ./backend
    ports:
      - "\${BACKEND_PORT:-8000}:8000"
  frontend:
    build: ./frontend
    ports:
      - "\${FRONTEND_PORT:-5173}:5173"`;

const ENV_BLOCK = `NODE_ENV=development

# --- wtc port overrides ---
COMPOSE_PROJECT_NAME=myapp-wt-1-feature-auth
POSTGRES_PORT=25435
BACKEND_PORT=28001
FRONTEND_PORT=25174
# --- end wtc ---`;

const MONOREPO_CMD = "wtc start --env .env.development --workspace server --workspace homepage";

/* `wtc list` before and after worktree 2 is stopped and removed. */
const LIST_BEFORE = listRows([
  { index: 1, branch: "feature-auth", status: "up" },
  { index: 2, branch: "fix-billing", status: "up" },
  { index: 3, branch: "refactor-api", status: "down" },
]);
const LIST_AFTER = listRows([
  { index: 1, branch: "feature-auth", status: "up" },
  { index: 3, branch: "refactor-api", status: "down" },
]);

/** `wtc list`, drawn the way the CLI prints it (cli-table3). */
function ListTable({ rows }: { rows: string[][] }) {
  const widths = columnWidths(LIST_HEAD, rows);
  const row = (cells: string[], key: string, colour = true) => (
    <span key={key}>
      {"│"}
      {cells.map((cell, c) => {
        const text = ` ${cell.padEnd(widths[c])} `;
        const cls = !colour
          ? "c-ink"
          : c === 2 && cell === "up"
            ? "c-ok"
            : c === 2 && cell === "down"
              ? "c-dim"
              : c === 0 && cell !== "-"
                ? "c-num"
                : c === 1 && cell === "main"
                  ? "c-dim"
                  : c === 3 && cell !== "-"
                    ? "c-str"
                    : "c-ink";
        return (
          <span key={c}>
            <span className={cls}>{text}</span>
            {"│"}
          </span>
        );
      })}
      {"\n"}
    </span>
  );
  return (
    <pre className="boxes" style={{ ["--cols" as string]: tableWidth(widths) } as CSSProperties}>
      <code className="c-dim">
        {rule(widths, "┌", "┬", "┐")}
        {"\n"}
        {row(LIST_HEAD, "head", false)}
        {rows.map((r, n) => (
          <span key={n}>
            {rule(widths, "├", "┼", "┤")}
            {"\n"}
            {row(r, `r${n}`)}
          </span>
        ))}
        {rule(widths, "└", "┴", "┘")}
      </code>
    </pre>
  );
}

function BranchMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true">
      <path d="M7 3v13" />
      <circle cx="7" cy="19" r="2.6" />
      <circle cx="17" cy="6" r="2.6" />
      <path d="M17 8.6a9 9 0 0 1-8 9.6" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Reveal />

      {/* ─── First screen ─── */}
      <header className="hero">
        <nav className="topline" aria-label="Primary">
          <a href="#top" className="wordmark" id="top">
            <BranchMark />
            worktree-compose
          </a>
          <ul className="toplinks">
            <li>
              <a href="#ports">Ports</a>
            </li>
            <li>
              <a href="#agents">Agents</a>
            </li>
            <li>
              <a href="#commands">Commands</a>
            </li>
            <li className="keep">
              <a href={REPO} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
          </ul>
        </nav>

        <h1 className="hero-title">
          <span className="line">
            <span style={i(0)}>A stack per</span>
          </span>
          <span className="line line-2">
            <span style={i(1)}>worktree.</span>
          </span>
        </h1>

        <div className="hero-foot">
          <div>
            <p className="lead" data-rise style={i(0)}>
              Zero-config Docker Compose isolation for git worktrees: every worktree gets its own ports,
              containers and volumes, from the compose file you already have.
            </p>
            <p className="hero-meta" data-rise style={i(1)}>
              <a href={DEVHUNT} className="link" target="_blank" rel="noopener noreferrer">
                #1 Product of the Week on DevHunt
              </a>
              <span>Open source, MIT</span>
              <a href={NPM} className="link" target="_blank" rel="noopener noreferrer">
                worktree-compose on npm
              </a>
            </p>
          </div>
          <div className="hero-action" data-rise style={i(2)}>
            <InstallButton command={INSTALL} />
            <p>
              then <code>wtc start</code> in any repo with worktrees
            </p>
          </div>
        </div>
      </header>

      <main id="main">
        {/* ─── The problem ─── */}
        <section className="problem" aria-labelledby="problem-h">
          <div className="wrap problem-inner">
            <h2 id="problem-h" className="sr-only">
              The problem
            </h2>
            <ul className="stairs">
              {["One compose file.", "Two worktrees.", "Same host ports.", "Same database.", "The second fails."].map(
                (line, n) => (
                  <li key={line} style={{ ["--n" as string]: n, ...i(n) }} data-reveal>
                    {line}
                  </li>
                ),
              )}
            </ul>
            <div className="problem-side" data-reveal style={i(3)}>
              <div className="panel" data-ui>
                <div className="panel-bar">
                  <code>~/myapp-billing</code>
                </div>
                <pre>
                  <code>
                    <Cmd>docker compose up -d</Cmd>
                    <Ln>
                      <Glyph kind="err" /> Container myapp-billing-postgres-1 <span className="c-err">Error</span>
                    </Ln>
                    <Ln>
                      <span className="c-err">
                        Error response from daemon: Bind for 0.0.0.0:5434 failed: port is already allocated
                      </span>
                    </Ln>
                    <Ln />
                    <Cmd>grep DATABASE_URL .env</Cmd>
                    <Ln>
                      DATABASE_URL=postgresql://app:app@
                      <wbr />
                      localhost:<span className="c-warn">5434</span>/app
                    </Ln>
                  </code>
                </pre>
              </div>
            </div>
            <p className="problem-note" data-reveal style={i(5)}>
              <code>docker compose -p</code> only renames the project. You would still pick free ports, edit every
              worktree&apos;s <code>.env</code>, copy compose files across and tear it all down by hand.{" "}
              <strong className="c-ink" style={{ fontWeight: 500 }}>
                wtc does each of those for you.
              </strong>{" "}
              A URL with the port inside it, like that <code>DATABASE_URL</code>, takes{" "}
              <a href="#config" className="link">
                one line of config
              </a>
              .
            </p>
          </div>
        </section>

        {/* ─── Demo: the explainer, chapter by chapter ─── */}
        <section className="demo" id="demo" aria-labelledby="demo-h">
          <div className="wrap">
            <div className="demo-head">
              <h2 id="demo-h" className="h-section" data-reveal>
                The whole loop in 46 seconds
              </h2>
              <p data-reveal style={i(1)}>
                Four agents, four worktrees, four stacks on their own ports. Compare them live, promote the winner
                into main, then clean up.
              </p>
            </div>
            <DemoVideo />
          </div>
        </section>

        {/* ─── Ports: the live figures ─── */}
        <section className="ports wrap" id="ports" aria-labelledby="ports-h">
          <div className="ports-head">
            <h2 id="ports-h" className="h-section" data-reveal>
              Same file, new ports
            </h2>
            <div className="prose" data-reveal style={i(1)}>
              <p>
                wtc reads every host port written as <code>{"${VAR:-default}"}</code> and gives each worktree its
                own. Pick a service, a worktree and a stride, or type your own port, and check the arithmetic.
              </p>
            </div>
          </div>
          <PortLab />
        </section>

        {/* ─── How it works ─── */}
        <section className="how wrap" id="how" aria-labelledby="how-h">
          <div className="how-col">
            <h2 id="how-h" className="h-section" data-reveal>
              From worktree to stack
            </h2>

            <div className="exchange">
              <p className="exchange-say" data-reveal>
                First, write host ports as <code>{"${VAR:-default}"}</code>.
              </p>
              <div className="panel" data-ui data-reveal style={i(1)}>
                <div className="panel-bar">
                  <code>docker-compose.yml</code>
                  <CopyButton text={COMPOSE} label="Copy the compose example" />
                </div>
                <pre>
                  <code>{highlight(COMPOSE, "yaml")}</code>
                </pre>
              </div>
              <div className="response" data-reveal style={i(2)}>
                <p className="response-note">
                  Main still gets 5434, 8000 and 5173. A hardcoded port gets a warning with the fix:
                </p>
                <div className="panel">
                  <pre>
                    <code>
                      <Ln>
                        <Glyph kind="warn" /> Service &quot;nginx&quot; uses a raw port mapping (8080:80).
                      </Ln>
                      <Ln ind={4}>
                        {"  "}To enable port isolation, change it to:{" "}
                        <span className="c-str">&quot;{"${NGINX_PORT:-8080}"}:80&quot;</span>
                      </Ln>
                    </code>
                  </pre>
                </div>
              </div>
            </div>

            <div className="exchange">
              <p className="exchange-say" data-reveal>
                Then add a worktree and start it.
              </p>
              <div className="panel" data-reveal style={i(1)}>
                <div className="panel-bar">
                  <code>~/myapp</code>
                  <CopyButton
                    text={"git worktree add ../myapp-auth feature-auth\nwtc start feature-auth"}
                    label="Copy the commands"
                  />
                </div>
                <pre>
                  <code>
                    <Cmd>git worktree add ../myapp-auth feature-auth</Cmd>
                    <Cmd>wtc start feature-auth</Cmd>
                  </code>
                </pre>
              </div>
              <div className="response" data-reveal style={i(2)}>
                <p className="response-note">
                  wtc copies the env file from main, writes the worktree&apos;s ports into it and runs compose up.
                  Keys main already has, like <code>POSTGRES_PORT</code>, are rewritten in place; new ones go in a
                  marked block. The copy is made fresh on every start, so edits made only in the worktree&apos;s env
                  file are replaced: keep lasting values in main&apos;s, or in <code>envOverrides</code> when they
                  come from a port.
                </p>
                <div className="panel" data-ui>
                  <div className="panel-bar">
                    <code>../myapp-auth/.env</code>
                  </div>
                  <pre>
                    <code>{highlight(ENV_BLOCK, "env")}</code>
                  </pre>
                </div>
                <p className="response-note response-after">
                  With <code>COMPOSE_PROJECT_NAME</code> in <code>.env</code>, a plain <code>docker compose ps</code>,
                  your Makefile and your own scripts in the worktree reach this stack without wtc. Compose reads
                  no other env file on its own, so with a custom <code>envFile</code> like{" "}
                  <code>.env.development</code>, add <code>--env-file .env.development</code>.
                </p>
              </div>
            </div>

            <div className="exchange">
              <p className="exchange-say" data-reveal>
                Now every stack runs side by side.
              </p>
              <div className="panel" data-reveal style={i(1)}>
                <pre>
                  <code>
                    <Cmd>wtc list</Cmd>
                  </code>
                </pre>
              </div>
              <div className="response response-wide" data-reveal style={i(2)}>
                <p className="response-note">
                  Open 25174 and 25175 in two tabs and compare the branches while both run.
                </p>
                <div className="panel" data-ui>
                  <ListTable rows={LIST_BEFORE} />
                </div>
                <p className="response-note response-after scroll-hint">Scroll the table sideways for the URLs and ports.</p>
              </div>
            </div>

            <div className="exchange">
              <p className="exchange-say" data-reveal>
                Remove one, and the rest keep their numbers.
              </p>
              <div className="panel" data-reveal style={i(1)}>
                <pre>
                  <code>
                    <Cmd>wtc stop 2</Cmd>
                    <Cmd>git worktree remove ../myapp-billing</Cmd>
                    <Cmd>wtc list</Cmd>
                  </code>
                </pre>
              </div>
              <div className="response response-wide" data-reveal style={i(2)}>
                <p className="response-note">
                  Worktree 3 is still worktree 3, on the same ports, with the same containers and volumes. wtc
                  records each worktree&apos;s index and Compose project name the first time it sees it, and the
                  ports follow from the index. Delete a worktree without stopping it and <code>wtc list</code> shows
                  it as <code>(removed)</code> until <code>wtc prune</code> tears its stack down.
                </p>
                <div className="panel" data-ui>
                  <ListTable rows={LIST_AFTER} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Agents ─── */}
        <section className="agents" id="agents" aria-labelledby="agents-h">
          <div className="wrap">
            <div className="agents-head">
              <h2 id="agents-h" className="h-section" data-reveal>
                Agents run their own stacks
              </h2>
              <p data-reveal style={i(1)}>
                <code>wtc mcp</code> is a built-in MCP server. Claude Code, Codex, Cursor or any MCP client can
                start, list, promote and clean up worktree stacks itself, while you compare the results on their own
                ports.
              </p>
            </div>
            <div className="agents-grid">
              <div className="agents-setup" data-reveal style={i(2)}>
                <AgentSetup />
              </div>
              <div className="agents-tools" data-reveal style={i(3)}>
                <h3 className="lead">A tool for each command</h3>
                <p>
                  {MCP_TOOLS.map((t, n) => (
                    <span key={t}>
                      <code>{t}</code>
                      {n < MCP_TOOLS.length - 2 ? ", " : n === MCP_TOOLS.length - 2 ? " and " : ""}
                    </span>
                  ))}{" "}
                  take the same worktree indices and branch names as the commands. Like the commands,{" "}
                  <code>wtc_clean</code> and <code>wtc_prune</code> delete volumes, and <code>wtc_clean</code> keeps
                  worktrees with uncommitted work.
                </p>
              </div>
              <div className="skill" id="skill">
                <div className="skill-text" data-reveal>
                  <h3>Or teach it the workflow</h3>
                  <p>
                    <code>SKILL.md</code> is an agent skill that covers the commands, port allocation, config and
                    the MCP server in one file. Install it for Claude Code with one command, or hand it to any
                    agent that reads skills.
                  </p>
                </div>
                <div className="skill-act" data-reveal style={i(1)}>
                  <div className="panel">
                    <div className="panel-bar">
                      <code>terminal</code>
                      <CopyButton text="wtc skill --install" label="Copy wtc skill --install" />
                    </div>
                    <pre>
                      <code>
                        <Cmd>wtc skill --install</Cmd>
                        <Ln>
                          <span className="c-dim"># writes ~/.claude/skills/worktree-compose/SKILL.md</span>
                        </Ln>
                      </code>
                    </pre>
                  </div>
                  <SkillActions />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Commands ─── */}
        <section className="commands wrap" id="commands" aria-labelledby="commands-h">
          <h2 id="commands-h" className="h-section" data-reveal>
            Commands
          </h2>
          <CommandMenu commands={COMMANDS} />
        </section>

        {/* ─── Config, monorepos and engines ─── */}
        <section className="config wrap" id="config" aria-labelledby="config-h">
          <div className="config-grid">
            <div className="config-intro">
              <h2 id="config-h" className="h-section" data-reveal>
                Config when you need it
              </h2>
              <div className="prose" data-reveal style={i(1)}>
                <p>
                  Most repos need none. wtc reads <code>docker-compose.yml</code>, follows its{" "}
                  <code>include:</code> files and syncs every Dockerfile a service builds. It finds the compose
                  command on its own, for Docker Compose v2, for Podman through <code>podman compose</code> or{" "}
                  <code>podman-compose</code>, and for Docker-compatible engines such as OrbStack and Colima. When a
                  project needs more, it goes in <code>.wtcrc.json</code> at the repo root, or a{" "}
                  <code>&quot;wtc&quot;</code> key in <code>package.json</code>.
                </p>
                <p>
                  In a monorepo the env files live next to each app. Name the file and the workspaces, and every
                  worktree gets its own copies, injected, with the root always included:
                </p>
              </div>
              <div className="panel" data-reveal style={i(2)}>
                <div className="panel-bar">
                  <code>~/myapp</code>
                  <CopyButton text={MONOREPO_CMD} label="Copy the monorepo command" />
                </div>
                <pre>
                  <code>
                    <Cmd>{MONOREPO_CMD}</Cmd>
                  </code>
                </pre>
              </div>
            </div>
            <div className="config-file" data-reveal style={i(3)}>
              <div className="panel" data-ui>
                <div className="panel-bar">
                  <code>.wtcrc.json</code>
                  <CopyButton text={WTCRC} label="Copy the example .wtcrc.json" />
                </div>
                <pre>
                  <code>{highlight(WTCRC, "json")}</code>
                </pre>
              </div>
            </div>
            <dl className="config-keys">
              {CONFIG_KEYS.map((k, n) => (
                <div key={k.key} data-reveal style={i(n)}>
                  <dt>
                    <code>{k.key}</code>
                  </dt>
                  <dd>{k.desc}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ─── Install ─── */}
        <InstallBand command={INSTALL} />
      </main>

      {/* ─── Footer ─── */}
      <footer className="footer">
        <p className="footer-name" aria-hidden="true" data-reveal>
          <span>worktree-</span>
          <span>compose</span>
        </p>
        <div className="footer-row">
          <ul className="places">
            <li>
              <a href={REPO} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href={NPM} target="_blank" rel="noopener noreferrer">
                npm
              </a>
            </li>
            <li>
              <a href={DEVHUNT} target="_blank" rel="noopener noreferrer">
                DevHunt
              </a>
            </li>
            <li>
              <a href="https://x.com/mostafasudo" target="_blank" rel="noopener noreferrer">
                @mostafasudo
              </a>
            </li>
          </ul>
          <div className="footer-cols">
            <div>
              <h3>On this page</h3>
              <ul>
                <li>
                  <a href="#demo">Demo</a>
                </li>
                <li>
                  <a href="#ports">Ports</a>
                </li>
                <li>
                  <a href="#how">How it works</a>
                </li>
                <li>
                  <a href="#agents">Agents</a>
                </li>
                <li>
                  <a href="#commands">Commands</a>
                </li>
                <li>
                  <a href="#config">Config</a>
                </li>
              </ul>
            </div>
            <div>
              <h3>Project</h3>
              <ul>
                <li>
                  <a href={`${REPO}#readme`} target="_blank" rel="noopener noreferrer">
                    README
                  </a>
                </li>
                <li>
                  <a href={`${REPO}/releases`} target="_blank" rel="noopener noreferrer">
                    Releases
                  </a>
                </li>
                <li>
                  <a href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer">
                    Issues
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3>Files</h3>
              <ul>
                <li>
                  <a href="/SKILL.md">SKILL.md</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="legal">
          <span>
            MIT License. Built by{" "}
            <a href="https://x.com/mostafasudo" className="link" target="_blank" rel="noopener noreferrer">
              @mostafasudo
            </a>
            .
          </span>
          <a href="#top" className="link">
            Back to top
          </a>
        </div>
      </footer>
    </>
  );
}

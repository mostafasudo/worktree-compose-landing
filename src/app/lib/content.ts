/*
 * Copy the page shares with its tests and with scripts/poster.mjs. This file
 * imports nothing, so Node can load it with type stripping.
 */

/** Global, so `wtc` is on PATH for the shell and for MCP clients. */
export const INSTALL = "npm install -g worktree-compose";

export type Command = {
  name: string;
  usage: string;
  desc: string;
  example: string;
};

export const COMMANDS: Command[] = [
  {
    name: "start",
    usage: "[worktrees...]",
    desc: "Syncs the compose file, Dockerfiles and env files from main, writes the worktree's ports into its env file and runs compose up -d --build. Name worktrees by index, branch, directory or path, or . for the one you are in; name none to start them all. --no-build skips the rebuild.",
    example: "wtc start feature-auth",
  },
  {
    name: "stop",
    usage: "[worktrees...]",
    desc: "Stops the containers of the chosen stacks, or of every stack when you name none. Containers and volumes are kept, so wtc start resumes them with their data.",
    example: "wtc stop 2",
  },
  {
    name: "restart",
    usage: "[worktrees...] [--no-build]",
    desc: "Stops, re-syncs files, re-injects env, rebuilds and starts again, keeping the data. Use it after migrations, Dockerfile edits or config changes.",
    example: "wtc restart .",
  },
  {
    name: "list",
    usage: "[--json]",
    desc: "Every worktree with its branch, status, URL and ports. With --json it prints the same data for scripts and agents.",
    example: "wtc list --json",
  },
  {
    name: "promote",
    usage: "<worktree> [--force]",
    desc: "Copies a worktree's added, changed and deleted files into your current checkout as uncommitted changes. Local env files and compose files stay behind. It stops if a file it would touch has local edits, or if your branch changed that file since the worktree branched; --force overrides the second check.",
    example: "wtc promote feature-auth",
  },
  {
    name: "clean",
    usage: "[--dry-run] [--force] [--keep-worktrees] [--sweep]",
    desc: "Runs compose down -v on every stack this checkout owns, which deletes their volumes and the data in them, then removes the worktrees and sweeps leftovers it can prove are its own. Worktrees with uncommitted work, commits on no branch, unpushed submodule commits or a lock are kept unless you pass --force. --keep-worktrees keeps the checkouts but still deletes the volumes; to stop everything and keep the data, run wtc stop. --sweep also removes stacks left by worktrees whose directory is gone, such as wtc 0.2 leftovers. --dry-run shows the plan first.",
    example: "wtc clean --dry-run",
  },
  {
    name: "prune",
    usage: "[--dry-run]",
    desc: "Deleted a worktree before stopping it? prune tears down the stack it left behind, containers, networks and volumes, and forgets the worktree.",
    example: "wtc prune",
  },
  {
    name: "doctor",
    usage: "[--json]",
    desc: "Checks git, the compose command and its engine, and isolation: host ports that are not isolated, container_name values that would clash between stacks, named volumes shared across worktrees, and a daemon that does not answer.",
    example: "wtc doctor",
  },
  {
    name: "skill",
    usage: "[--install] [--dir <path>]",
    desc: "Prints the bundled agent skill. --install writes it to ~/.claude/skills/worktree-compose, so Claude Code loads it in every project; --dir puts it under another skills folder.",
    example: "wtc skill --install",
  },
  {
    name: "mcp",
    usage: "",
    desc: "Starts the MCP server on stdio, so an agent can start, stop, list, promote and clean up stacks on its own.",
    example: "wtc mcp",
  },
];

/** The MCP server's tools: every command except skill and mcp. */
export const MCP_TOOLS = COMMANDS.filter((c) => c.name !== "skill" && c.name !== "mcp").map((c) => `wtc_${c.name}`);

/** Registers the server for every project, not only the directory it runs in. */
export const CLAUDE_MCP_ADD = "claude mcp add --scope user wtc -- wtc mcp";

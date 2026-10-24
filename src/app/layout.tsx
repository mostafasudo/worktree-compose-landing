import type { Metadata, Viewport } from "next";
import "./globals.css";

// JetBrains Mono is only used inside <pre>/<code>. taste-skill-ignore
const FONTS = // taste-skill-ignore
  "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap";
// Google's subsets of JetBrains Mono leave out box drawing (U+2500), so the
// `wtc list` table fell back to Menlo or Consolas, whose advance differs and
// broke the borders. `text=` fetches just those glyphs; it must be its own
// request because `text=` applies to every family in a request.
const BOX_GLYPHS = // taste-skill-ignore
  "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&text=" +
  encodeURIComponent("─│┌┐└┘├┤┬┴┼") +
  "&display=swap";

const TITLE = "worktree-compose (wtc): a Docker Compose stack per git worktree";
const DESCRIPTION =
  "Zero-config Docker Compose isolation for git worktrees. wtc reads your docker-compose.yml and gives every worktree its own ports, containers and volumes, with stable identities, monorepo env files, Podman and OrbStack support, and an MCP server for AI agents.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.worktree-compose.com"),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "worktree-compose",
  keywords: [
    "git worktree",
    "docker compose",
    "port isolation",
    "parallel development",
    "AI agents",
    "MCP server",
    "Podman",
    "OrbStack",
    "CLI",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "worktree-compose (wtc)",
    description:
      "A Docker Compose stack per git worktree: its own ports, containers and volumes, from the compose file you already have.",
    url: "/",
    siteName: "worktree-compose",
    type: "website",
    images: [
      {
        url: "/wtc-poster.png",
        width: 1920,
        height: 1080,
        alt: "worktree-compose: zero-config Docker Compose isolation for git worktrees",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "worktree-compose (wtc)",
    description:
      "A Docker Compose stack per git worktree: its own ports, containers and volumes, zero config.",
    images: ["/wtc-poster.png"],
    creator: "@mostafasudo",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d1117",
  colorScheme: "dark",
};

// Content is only hidden for entrance motion once this flag is set, and the
// flag is withdrawn if the page script never takes over, so nothing stays
// invisible when JavaScript is off or fails.
const JS_FLAG = `(function(){var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!window.__wtcReveal)d.classList.remove('js')},2500)})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONTS} />
        <link rel="stylesheet" href={BOX_GLYPHS} />
      </head>
      <body>{children}</body>
    </html>
  );
}

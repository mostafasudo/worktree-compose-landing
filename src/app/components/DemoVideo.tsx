"use client";

import { useEffect, useRef, useState } from "react";

// The explainer (public/wtc-explainer.mp4), rendered from the HyperFrames
// project in video/ (source, BRIEF.md, SPEC.md, REVIEW.md; video/deliver.sh
// writes the mp4, the poster and the chapter stills). It autoplays muted and
// loops; with reduced motion it stays paused on the poster. Each chapter
// button seeks to that chapter's start.

// Stills are frames of the explainer itself (public/chapters), one per chapter.
const CHAPTERS = [
  { t: 0, label: "The problem", still: "problem" },
  { t: 6, label: "The fix", still: "fix" },
  { t: 12, label: "Spawn worktrees", still: "spawn" },
  { t: 17, label: "Start all stacks", still: "start" },
  { t: 25, label: "Compare side by side", still: "compare" },
  { t: 31, label: "Promote the winner", still: "promote" },
  { t: 36, label: "Clean up", still: "clean" },
];

// A clock reading (0:04), not index numbering. taste-skill-ignore
const fmt = (s: number) => `0:${String(s).padStart(2, "0")}`; // taste-skill-ignore

export function DemoVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      v.pause();
      v.removeAttribute("autoplay");
    }
    const onTime = () => setNow(v.currentTime);
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, []);

  const activeIdx = CHAPTERS.reduce((acc, c, i) => (now >= c.t ? i : acc), -1);

  const seek = (t: number) => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = t;
    void v.play().catch(() => {});
  };

  return (
    <>
      <video
        ref={ref}
        autoPlay
        muted
        loop
        playsInline
        controls
        preload="metadata"
        poster="/wtc-explainer-poster.jpg"
        width={1920}
        height={1080}
        aria-label="Explainer: four AI agents each get a worktree with its own Docker Compose stack and ports, run side by side, the winner is promoted into main, and clean-up removes the other worktrees but keeps the one with uncommitted changes"
        data-reveal
        style={{ ["--i" as string]: 2 }}
      >
        <source src="/wtc-explainer.mp4" type="video/mp4" />
        Your browser cannot play this video.{" "}
        <a href="/wtc-explainer.mp4">Download the explainer (MP4, 6 MB)</a>.
      </video>
      <ol className="chapters" aria-label="Chapters" data-reveal style={{ ["--i" as string]: 3 }}>
        {CHAPTERS.map((c, i) => (
          <li key={c.t}>
            <button type="button" onClick={() => seek(c.t)} aria-current={i === activeIdx}>
              <img src={`/chapters/${c.still}.jpg`} alt="" width={480} height={270} loading="lazy" decoding="async" />
              <span className="chapter-text">
                <span className="chapter-time">{fmt(c.t)}</span>
                <span>{c.label}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </>
  );
}

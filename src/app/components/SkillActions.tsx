"use client";

import { CheckIcon, CopyIcon, copyText } from "./CopyButton";
import { useState } from "react";

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path d="M12 3v12M6.5 9.5 12 15l5.5-5.5M4 20h16" />
    </svg>
  );
}

export function SkillActions() {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  const handleCopy = async () => {
    try {
      const res = await fetch("/SKILL.md");
      if (!res.ok) throw new Error(String(res.status));
      const ok = await copyText(await res.text());
      setState(ok ? "copied" : "failed");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 2000);
  };

  return (
    <div className="skill-buttons">
      <button type="button" onClick={handleCopy} className="btn btn-solid">
        {state === "copied" ? <CheckIcon /> : <CopyIcon />}
        {state === "copied" ? "Copied SKILL.md" : state === "failed" ? "Copy failed, use Download" : "Copy SKILL.md"}
      </button>
      <a href="/SKILL.md" download="SKILL.md" className="btn">
        <DownloadIcon />
        Download
      </a>
      <a href="/SKILL.md" className="btn" target="_blank" rel="noopener noreferrer">
        Read it
      </a>
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? "SKILL.md copied to clipboard" : ""}
      </span>
    </div>
  );
}

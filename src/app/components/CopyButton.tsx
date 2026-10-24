"use client";

import { useEffect, useRef, useState } from "react";

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers and insecure origins: fall back to a hidden textarea.
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

export function useCopied(): [boolean, (text: string) => Promise<void>] {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  const copy = async (text: string) => {
    if (await copyText(text)) {
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    }
  };
  return [copied, copy];
}

export function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <rect x="9" y="9" width="12" height="12" />
      <path d="M5 15H3V3h12v2" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

/** Small square icon button that copies `text`. */
export function CopyButton({
  text,
  label = "Copy to clipboard",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, copy] = useCopied();
  return (
    <button
      type="button"
      onClick={() => copy(text)}
      className={`icon-btn ${className}`}
      aria-label={copied ? "Copied" : label}
      data-copied={copied}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}

/**
 * A command that may break onto a second line only before its last word, so
 * `npm install -g` / `worktree-compose` can wrap on a narrow screen but the
 * package name is never split or cut off.
 */
export function CommandText({ command }: { command: string }) {
  const cut = command.lastIndexOf(" ");
  if (cut < 0) return <span className="nowrap">{command}</span>;
  return (
    <>
      <span className="nowrap">{command.slice(0, cut)}</span> <span className="nowrap">{command.slice(cut + 1)}</span>
    </>
  );
}

/** The first-screen action: the install command as one solid button. */
export function InstallButton({ command }: { command: string }) {
  const [copied, copy] = useCopied();
  return (
    <button
      type="button"
      className="install"
      onClick={() => copy(command)}
      aria-label={`Copy the install command: ${command}`}
    >
      <code>
        <span className="dollar" aria-hidden="true">
          $
        </span>
        <CommandText command={command} />
      </code>
      {copied ? <CheckIcon /> : <CopyIcon />}
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}

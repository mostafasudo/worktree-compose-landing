"use client";

import { CheckIcon, CommandText, CopyIcon, useCopied } from "./CopyButton";

export function InstallBand({ command }: { command: string }) {
  const [copied, copy] = useCopied();
  return (
    <button
      type="button"
      className="cta"
      onClick={() => copy(command)}
      aria-label={`Install: copy ${command}`}
    >
      <span className="cta-top">
        <span className="cta-text" aria-live="polite">
          {copied ? (
            <>
              Copied. Now run <code>wtc start</code> in any repo that has worktrees.
            </>
          ) : (
            <>
              Copy{" "}
              <code>
                <CommandText command={command} />
              </code>
              , then run <code>wtc start</code> in any repo that has worktrees.
            </>
          )}
        </span>
        {copied ? <CheckIcon /> : <CopyIcon />}
      </span>
      {/* The word is the button, so the copied state shows where the eye is. */}
      <span className="cta-word" aria-hidden="true" data-reveal>
        {copied ? "Copied" : "Install"}
      </span>
    </button>
  );
}

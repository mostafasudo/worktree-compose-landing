"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __wtcReveal?: boolean;
  }
}

/**
 * Marks [data-reveal] elements with data-in once they scroll into view, one
 * time each. The hidden state only exists under html.js (set by an inline
 * script in the layout), and under prefers-reduced-motion nothing is hidden.
 * The state is a data attribute, not a class, so React re-renders that change
 * className never undo it.
 */
export function Reveal() {
  useEffect(() => {
    window.__wtcReveal = true;
    const root = document.documentElement;
    if (!("IntersectionObserver" in window)) {
      root.classList.remove("js");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.in = "";
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    const watch = (scope: ParentNode) =>
      scope.querySelectorAll<HTMLElement>("[data-reveal]:not([data-in])").forEach((el) => io.observe(el));
    watch(document);
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        r.addedNodes.forEach((n) => {
          if (!(n instanceof HTMLElement)) return;
          if (n.matches("[data-reveal]:not([data-in])")) io.observe(n);
          watch(n);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}

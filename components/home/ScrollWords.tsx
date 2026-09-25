"use client";

import { useEffect, useRef } from "react";

// A statement that lights up word by word as it passes through the middle of
// the screen. Words the author wraps in *asterisks* light in the brand purple.
export default function ScrollWords({ text, className }: { text: string; className?: string }) {
  const root = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll<HTMLSpanElement>("span[data-w]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => w.classList.add("is-lit"));
      return;
    }
    let raf = 0;
    const tick = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the block's top reaches 80% of the screen, 1 when its bottom reaches 45%
      const p = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (r.height + vh * 0.35)));
      const lit = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle("is-lit", i < lit));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // *a few words* can span several tokens: open on a leading *, close on a trailing one
  let open = false;
  const tokens = text.split(" ").map((t) => {
    if (t.startsWith("*")) open = true;
    const accent = open;
    if (t.endsWith("*") || /\*[.,;:!?]$/.test(t)) open = false;
    return { t, accent };
  });
  return (
    <p ref={root} className={`swords ${className ?? ""}`}>
      {tokens.map(({ t, accent }, i) => {
        const clean = t.replace(/\*/g, "");
        return (
          <span key={i} data-w className={accent ? "swords__accent" : undefined}>
            {clean}{" "}
          </span>
        );
      })}
    </p>
  );
}

"use client";

import { useEffect, useRef } from "react";

// A hairline across the top that fills as you read the article body.
export default function ReadProgress({ target }: { target: string }) {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = document.getElementById(target);
    if (!el) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the body's top reaches the top of the screen, 1 when its end
      // reaches the bottom. The first version divided by (height − 0.6 × screen)
      // and so could never reach 1 — the bar stopped short at the last line.
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
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
  }, [target]);
  return <div className="rprog" ref={bar} aria-hidden="true" />;
}

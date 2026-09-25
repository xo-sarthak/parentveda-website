"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// One observer for the whole site. Anything with .rv or .rv-img gets .is-in
// the first time it is a quarter of the way into view, and is then forgotten
// — reveals fire once and never re-fire on scroll-back.
// [data-drift] elements move a few pixels against the scroll for depth.
export default function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".rv, .rv-img"));
    if (reduce || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    targets.forEach((el) => io.observe(el));

    const drifters = Array.from(document.querySelectorAll<HTMLElement>("[data-drift]"));
    // [data-progress] gets --p: 0 while its top is at the top of the screen,
    // 1 once it has scrolled a full height away. CSS decides what --p moves.
    const progressed = Array.from(document.querySelectorAll<HTMLElement>("[data-progress]"));
    let raf = 0;
    const tick = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const el of progressed) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh) continue;
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
        el.style.setProperty("--p", p.toFixed(4));
      }
      for (const el of drifters) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        const speed = Number(el.dataset.drift) || 0.08;
        const offset = (r.top + r.height / 2 - vh / 2) * -speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    if (drifters.length || progressed.length) {
      tick();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return null;
}

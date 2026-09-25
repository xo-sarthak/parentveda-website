"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

// The feel layer. Everything here is delegated from the document, so it is
// set up once and works on every page, including ones added later.
//
//   · smooth wheel scrolling (desktop only — touch keeps its native physics)
//   · a ripple where you press, on buttons and cards
//   · primary buttons that lean a few pixels toward the pointer
//   · [data-tilt] cards that tip up to 3° and catch a soft sheen
//   · a header that tucks away on the way down and returns on the way up
//
// All of it is off under prefers-reduced-motion.

const RIPPLE = ".btn, .stagecard, .acard, .rmore a, .nextstage, .ask__tabs button, .afilter button, .hdr__nav a, .faq__item summary";

export default function Interactions() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduce) return;

    // smooth scroll
    let lenis: Lenis | null = null;
    let raf = 0;
    if (fine) {
      lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, anchors: { offset: -96 } });
      const loop = (t: number) => {
        lenis?.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }

    // ripple
    const onDown = (e: PointerEvent) => {
      const el = (e.target as Element).closest<HTMLElement>(RIPPLE);
      if (!el) return;
      const r = el.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2.2;
      const dot = document.createElement("span");
      dot.className = "ripple";
      dot.style.width = dot.style.height = `${size}px`;
      dot.style.left = `${e.clientX - r.left - size / 2}px`;
      dot.style.top = `${e.clientY - r.top - size / 2}px`;
      if (getComputedStyle(el).position === "static") el.style.position = "relative";
      el.classList.add("has-ripple");
      el.appendChild(dot);
      dot.addEventListener("animationend", () => dot.remove(), { once: true });
    };

    // magnetic buttons + tilt cards
    let magnet: HTMLElement | null = null;
    let tilt: HTMLElement | null = null;
    const onMove = (e: PointerEvent) => {
      if (!fine) return;
      const t = e.target as Element;
      const btn = t.closest<HTMLElement>(".btn--ink, .btn--light");
      if (magnet && magnet !== btn) {
        magnet.style.transform = "";
        magnet = null;
      }
      if (btn) {
        const r = btn.getBoundingClientRect();
        const dx = ((e.clientX - r.left) / r.width - 0.5) * 10;
        const dy = ((e.clientY - r.top) / r.height - 0.5) * 8;
        btn.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
        magnet = btn;
      }
      const card = t.closest<HTMLElement>("[data-tilt]");
      if (tilt && tilt !== card) {
        tilt.style.transform = "";
        tilt.style.removeProperty("--mx");
        tilt = null;
      }
      if (card) {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.transform = `perspective(900px) rotateX(${((0.5 - py) * 5).toFixed(2)}deg) rotateY(${((px - 0.5) * 6).toFixed(2)}deg) translateY(-6px)`;
        card.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        card.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
        tilt = card;
      }
    };
    const onLeaveDoc = () => {
      if (magnet) magnet.style.transform = "";
      if (tilt) tilt.style.transform = "";
      magnet = tilt = null;
    };

    // header tuck
    const hdr = document.querySelector<HTMLElement>(".hdr");
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (!hdr || hdr.classList.contains("hdr--open")) return;
      if (y > 480 && y > lastY + 4) hdr.classList.add("hdr--tucked");
      else if (y < lastY - 4 || y < 480) hdr.classList.remove("hdr--tucked");
      lastY = y;
    };

    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveDoc);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeaveDoc);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  // a new page starts at the top, without a smooth glide from where you were
  useEffect(() => {
    const l = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (l && !window.location.hash) l.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}

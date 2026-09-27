"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "./toc";
import Icon from "../Icon";

/**
 * The sticky contents list beside an article, with the section you're in
 * marked, plus sharing.
 *
 * THE BUG THIS FIXES (the first reader had it): a section only became
 * "current" when its heading reached the top of the screen. The last sections
 * are usually short, and a page cannot scroll far enough to lift their
 * headings that high, so the marker stalled a section or two before the end
 * and never reached the last one. Now, once the end of the article is on
 * screen, the last section is current, and in between the marker follows the
 * heading nearest the top.
 */
export default function ReadRail({
  items,
  shareUrl,
  shareTitle,
  target,
}: {
  items: TocItem[];
  shareUrl: string;
  shareTitle: string;
  target: string; // id of the article body
}) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!items.length) return;
    const body = document.getElementById(target);
    const heads = items.map((it) => document.getElementById(it.id)).filter(Boolean) as HTMLElement[];
    let raf = 0;
    const tick = () => {
      raf = 0;
      const vh = window.innerHeight;
      const line = 140; // just under the sticky header
      let current = heads[0]?.id ?? "";
      for (const h of heads) {
        if (h.getBoundingClientRect().top - line <= 0) current = h.id;
        else break;
      }
      // End of the article in view: the last section is the one being read.
      if (body && body.getBoundingClientRect().bottom <= vh + 4) current = heads[heads.length - 1]?.id ?? current;
      setActive((prev) => (prev === current ? prev : current));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [items, target]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: nothing to do */
    }
  };

  return (
    <aside className="rtoc" aria-label="In this article">
      {items.length > 1 && (
        <>
          <p className="rtoc__h">In this article</p>
          <ol>
            {items.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className={t.id === active ? "is-active" : undefined} aria-current={t.id === active ? "true" : undefined}>
                  {t.text}
                </a>
              </li>
            ))}
          </ol>
        </>
      )}
      <div className="rshare">
        <p className="rtoc__h">Share</p>
        <div className="rshare__row">
          <a
            className="rshare__btn"
            href={`https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="whatsapp" size={17} /> WhatsApp
          </a>
          <button type="button" className="rshare__btn" onClick={copy}>
            <Icon name={copied ? "check" : "bookmark"} size={17} /> {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      </div>
    </aside>
  );
}

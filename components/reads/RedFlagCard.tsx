"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

/* The emergency card at the top of an article or hub. The list is medical
   content: the page passes it only once a doctor has signed it off, or on a
   preview deploy (lib/review-gate.ts). */
export default function RedFlagCard({ items, slug }: { items: string[]; slug: string }) {
  useEffect(() => {
    track("red_flag_view", { slug });
  }, [slug]);

  if (!items.length) return null;
  return (
    <aside className="redflag" role="note" aria-labelledby={`redflag-${slug}`}>
      <p className="redflag__h" id={`redflag-${slug}`}>
        Go to a hospital now if
      </p>
      <ul>
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <p className="redflag__act">
        <span>Call 108 or go to the nearest hospital.</span>
        <a href="tel:108" className="redflag__call" onClick={() => track("call_108_click", { slug })}>
          Call 108
        </a>
      </p>
    </aside>
  );
}

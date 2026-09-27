"use client";

import { useState } from "react";
import Link from "next/link";

// The Reads library, filterable by stage without leaving the page. Cards are
// server-rendered and passed in, so every article link is in the HTML.

type Item = { key: string; stage?: string; node: React.ReactNode };

const FILTERS = [
  { key: "all", name: "All" },
  { key: "ttc", name: "Trying" },
  { key: "pregnancy", name: "Pregnancy" },
  { key: "parenting", name: "Parenting" },
];

export default function ReadsBrowser({ items }: { items: Item[] }) {
  const [f, setF] = useState("all");
  const shown = f === "all" ? items : items.filter((i) => i.stage === f);
  return (
    <>
      <div className="afilter" role="group" aria-label="Filter reads by stage">
        {FILTERS.map((x) => {
          const count = x.key === "all" ? items.length : items.filter((i) => i.stage === x.key).length;
          return (
            <button key={x.key} aria-pressed={f === x.key} onClick={() => setF(x.key)}>
              {x.name}
              <span>{count}</span>
            </button>
          );
        })}
      </div>
      {shown.length === 0 ? (
        <div className="aempty">
          <p className="display-m">Reads for this stage are being written.</p>
          <p>
            Until they’re here, <Link className="link" href="/ask-veda/">Ask Veda</Link> can answer the question you came with.
          </p>
        </div>
      ) : (
        <ul className="agrid">
          {shown.map((i, n) => (
            // the newest read leads, twice the size, when nothing is filtered
            <li key={i.key} className={n === 0 && f === "all" ? "agrid__lead" : undefined}>
              {i.node}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

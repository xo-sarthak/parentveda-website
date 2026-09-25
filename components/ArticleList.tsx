"use client";

import Link from "next/link";
import { useState } from "react";

export type ArticleCard = {
  slug: string;
  title: string;
  description: string;
  category: string;
  stage: string;
  stageName: string;
  tone: string;
  deep: string;
  minutes: number;
};

type Filter = { slug: string; name: string };

export default function ArticleList({ items, filters }: { items: ArticleCard[]; filters: Filter[] }) {
  const [f, setF] = useState("all");
  const shown = f === "all" ? items : items.filter((a) => a.stage === f);

  return (
    <>
      <div className="afilter" role="group" aria-label="Filter articles by stage">
        {[{ slug: "all", name: "All" }, ...filters].map((x) => {
          const count = x.slug === "all" ? items.length : items.filter((a) => a.stage === x.slug).length;
          return (
            <button key={x.slug} aria-pressed={f === x.slug} onClick={() => setF(x.slug)}>
              {x.name}
              <span>{count}</span>
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <div className="aempty">
          <p className="display-m">Articles for this stage are being written.</p>
          <p>
            Until they’re here, the app has more to read for every stage, and <Link className="link" href="/ask-veda">Ask Veda</Link> can
            answer the question you came with.
          </p>
        </div>
      ) : (
        <ul className="agrid">
          {shown.map((a, i) => (
            <li key={a.slug} className={i === 0 && f === "all" ? "agrid__lead" : undefined}>
              <Link href={`/articles/${a.slug}`} className="acard" style={{ ["--tone" as string]: a.tone, ["--deep" as string]: a.deep }}>
                <span className="acard__cover" aria-hidden="true">
                  <span className="acard__disc" />
                  <span className="acard__cat">{a.category}</span>
                </span>
                <span className="acard__body">
                  <span className="acard__meta">
                    {a.stageName} · {a.minutes} min read
                  </span>
                  <span className="acard__title">{a.title}</span>
                  <span className="acard__desc">{a.description}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

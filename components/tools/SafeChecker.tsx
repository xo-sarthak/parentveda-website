"use client";

import { useMemo, useState } from "react";
import Icon from "@/components/Icon";
import { CAN_I, CAN_I_BY_ID, CAN_I_GROUPS, CAN_I_POPULAR, CATEGORY_LABEL, VERDICT_LABEL, type Category, type CanI } from "@/lib/safe-in-pregnancy";

const CATS = ["all", "eat", "drink", "take", "doActivity"] as const;
const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N} ]/gu, " ");

function Entry({ e, open, onRelated }: { e: CanI; open?: boolean; onRelated: (name: string) => void }) {
  const tri = [e.t1 && ["First trimester", e.t1], e.t2 && ["Second trimester", e.t2], e.t3 && ["Third trimester", e.t3]].filter(Boolean) as [string, string][];
  return (
    <li className="safe-item" id={e.id}>
      <details open={open}>
        <summary>
          <span className="safe-item__head">
            <strong>{e.name}</strong>
            <span className={`safe-badge safe-badge--${e.verdict}`}>{VERDICT_LABEL[e.verdict]}</span>
          </span>
          <span className="safe-item__short">{e.short}</span>
          <span className="safe-item__why">
            Why <Icon name="plus" size={14} />
          </span>
        </summary>
        <div className="safe-item__more">
          <h4>Why</h4>
          <p>{e.why}</p>
          {tri.length > 0 && (
            <dl className="safe-tri">
              {tri.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}
          {e.indian && (
            <>
              <h4>In Indian homes</h4>
              <p>{e.indian}</p>
            </>
          )}
          {e.related && e.related.length > 0 && (
            <p className="safe-related">
              Also asked:{" "}
              {e.related
                .map((id) => CAN_I_BY_ID.get(id))
                .filter(Boolean)
                .map((r, i) => (
                  <span key={r!.id}>
                    {i > 0 && ", "}
                    <button type="button" onClick={() => onRelated(r!.name)}>
                      {r!.name}
                    </button>
                  </span>
                ))}
            </p>
          )}
        </div>
      </details>
    </li>
  );
}

export default function SafeChecker() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number]>("all");
  const s = norm(q.trim());

  const hits = useMemo(() => {
    if (!s) return null;
    return CAN_I.filter((e) => norm(`${e.name} ${(e.aliases ?? []).join(" ")}`).includes(s));
  }, [s]);

  const shelves = useMemo(
    () =>
      CAN_I_GROUPS.map(([label, ids]) => [label, ids.map((id) => CAN_I_BY_ID.get(id)!).filter((e) => cat === "all" || e.cat === (cat as Category))] as const).filter(
        ([, l]) => l.length > 0,
      ),
    [cat],
  );

  const ask = (name: string) => {
    setQ(name);
    const top = document.querySelector(".tool-lookup")?.getBoundingClientRect().top ?? 0;
    window.scrollTo({ top: window.scrollY + top - 96, behavior: "smooth" });
  };

  return (
    <div className="tool-lookup">
      <form className="tool-lookup__bar" onSubmit={(e) => e.preventDefault()} role="search">
        <label className="tool-field">
          <span className="tool-label">Can I have, take or do...</span>
          <span className="tool-searchbox">
            <Icon name="search" size={20} />
            <input type="search" placeholder="Try papaya, chai, Crocin, flying..." value={q} onChange={(e) => setQ(e.target.value)} />
            {q && (
              <button type="button" aria-label="Clear search" onClick={() => setQ("")}>
                <Icon name="x" size={18} />
              </button>
            )}
          </span>
        </label>
        <div className="tool-chips" role="group" aria-label="Popular">
          {CAN_I_POPULAR.map((id) => CAN_I_BY_ID.get(id)).filter(Boolean).map((e) => (
            <button key={e!.id} type="button" className="tool-chip" onClick={() => setQ(e!.name)}>
              {e!.name}
            </button>
          ))}
        </div>
      </form>

      {hits ? (
        <>
          <p className="tool-count" aria-live="polite">
            {hits.length} {hits.length === 1 ? "answer" : "answers"}
          </p>
          <ul className="safe-list">
            {hits.map((e) => (
              <Entry key={e.id} e={e} open={hits.length <= 2} onRelated={ask} />
            ))}
          </ul>
          {hits.length === 0 && (
            <p className="tool-small">We haven't covered that yet. Please ask your doctor, and tell us at hello@parentveda.in so we can add it.</p>
          )}
        </>
      ) : (
        <>
          <div className="tool-chips tool-chips--filter" role="group" aria-label="Browse by type">
            {CATS.map((c) => (
              <button key={c} type="button" className={`tool-chip${c === cat ? " is-on" : ""}`} aria-pressed={c === cat} onClick={() => setCat(c)}>
                {c === "all" ? "All" : CATEGORY_LABEL[c]}
              </button>
            ))}
          </div>
          {shelves.map(([label, list]) => (
            <section key={label} className="safe-shelf">
              <h3>{label}</h3>
              <ul className="safe-list">
                {list.map((e) => (
                  <Entry key={e.id} e={e} onRelated={ask} />
                ))}
              </ul>
            </section>
          ))}
        </>
      )}
    </div>
  );
}

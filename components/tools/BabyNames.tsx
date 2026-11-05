"use client";

import { useMemo, useState } from "react";
import { COMMUNITIES, NAMES } from "@/lib/baby-names";

const SEX = [
  { k: "all", label: "All" },
  { k: "g", label: "Girl" },
  { k: "b", label: "Boy" },
  { k: "u", label: "Unisex" },
] as const;
const POP = { T: "Trending", C: "Classic", R: "Rare" } as const;
const PAGE = 60;

export default function BabyNames() {
  const [sex, setSex] = useState<(typeof SEX)[number]["k"]>("all");
  const [letter, setLetter] = useState("");
  const [comm, setComm] = useState("");
  const [pop, setPop] = useState("");
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(PAGE);
  const letters = useMemo(() => [...new Set(NAMES.map((n) => n[0][0].toUpperCase()))].sort(), []);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return NAMES.filter(
      ([name, dev, g, meaning, c, , p]) =>
        (sex === "all" || g === sex) &&
        (!letter || name.toUpperCase().startsWith(letter)) &&
        (!comm || c === comm) &&
        (!pop || p === pop) &&
        (!s || name.toLowerCase().includes(s) || dev.includes(s) || meaning.toLowerCase().includes(s)),
    );
  }, [sex, letter, comm, pop, q]);

  const set = <T,>(f: (v: T) => void) => (v: T) => {
    f(v);
    setShown(PAGE);
  };

  return (
    <div className="tool-card">
      <form className="tool-form" onSubmit={(e) => e.preventDefault()} role="search">
        <label>
          <span>Search by name or meaning</span>
          <input type="search" className="tool-search" placeholder="Try light, Lakshmi, brave..." value={q} onChange={(e) => set(setQ)(e.target.value)} />
        </label>
        <div className="tool-chips" role="group" aria-label="Boy or girl">
          {SEX.map((s) => (
            <button key={s.k} type="button" className={`tool-chip${s.k === sex ? " is-on" : ""}`} aria-pressed={s.k === sex} onClick={() => set(setSex)(s.k)}>
              {s.label}
            </button>
          ))}
        </div>
        <div className="tool-row">
          <label>
            <span>Community</span>
            <select value={comm} onChange={(e) => set(setComm)(e.target.value)}>
              <option value="">All</option>
              {COMMUNITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Style</span>
            <select value={pop} onChange={(e) => set(setPop)(e.target.value)}>
              <option value="">All</option>
              {Object.entries(POP).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="tool-chips tool-chips--letters" role="group" aria-label="Starting letter">
          <button type="button" className={`tool-chip${!letter ? " is-on" : ""}`} onClick={() => set(setLetter)("")}>
            Any
          </button>
          {letters.map((l) => (
            <button key={l} type="button" className={`tool-chip${l === letter ? " is-on" : ""}`} aria-pressed={l === letter} onClick={() => set(setLetter)(l)}>
              {l}
            </button>
          ))}
        </div>
      </form>

      <p className="tool-small" aria-live="polite">
        {list.length.toLocaleString("en-IN")} {list.length === 1 ? "name" : "names"}
      </p>
      <ul className="name-list">
        {list.slice(0, shown).map(([name, dev, g, meaning, c, origin, p]) => (
          <li key={name}>
            <strong>
              {name} {dev && <span className="name-list__dev">{dev}</span>}
            </strong>
            <span className="name-list__g">
              {g === "g" ? "Girl" : g === "b" ? "Boy" : "Unisex"} · {c}
              {origin ? ` · ${origin}` : ""} · {POP[p]}
            </span>
            <span>{meaning}</span>
          </li>
        ))}
      </ul>
      {list.length > shown && (
        <button type="button" className="tool-more" onClick={() => setShown(shown + PAGE)}>
          Show more names
        </button>
      )}
    </div>
  );
}

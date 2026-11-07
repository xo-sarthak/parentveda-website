"use client";

import { useMemo, useState } from "react";
import Icon from "@/components/Icon";
import { COMMUNITIES, NAMES } from "@/lib/baby-names";
import { Choice, Field } from "./ui";

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
    <div className="tool-names">
      <form className="tool-panel tool-names__filters" onSubmit={(e) => e.preventDefault()} role="search">
        <label className="tool-field">
          <span className="tool-label">Search by name or meaning</span>
          <span className="tool-searchbox">
            <Icon name="search" size={20} />
            <input type="search" placeholder="Try light, Lakshmi, brave..." value={q} onChange={(e) => set(setQ)(e.target.value)} />
          </span>
        </label>
        <Choice legend="For a" name="sex" value={sex} onChange={set(setSex)} options={SEX.map((s) => ({ value: s.k, label: s.label }))} />
        <div className="tool-row">
          <Field label="Community">
            <select value={comm} onChange={(e) => set(setComm)(e.target.value)}>
              <option value="">All</option>
              {COMMUNITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Style">
            <select value={pop} onChange={(e) => set(setPop)(e.target.value)}>
              <option value="">All</option>
              {Object.entries(POP).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="tool-field">
          <span className="tool-label">Starts with</span>
          <div className="tool-letters" role="group" aria-label="Starting letter">
            <button type="button" className={`tool-chip tool-letters__any${!letter ? " is-on" : ""}`} aria-pressed={!letter} onClick={() => set(setLetter)("")}>
              Any
            </button>
            {letters.map((l) => (
              <button key={l} type="button" className={`tool-chip${l === letter ? " is-on" : ""}`} aria-pressed={l === letter} onClick={() => set(setLetter)(l)}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </form>

      <div className="tool-names__results">
        <p className="tool-count" aria-live="polite">
          {list.length.toLocaleString("en-IN")} {list.length === 1 ? "name" : "names"}
        </p>
        <ul className="name-list">
          {list.slice(0, shown).map(([name, dev, g, meaning, c, origin, p]) => (
            <li key={name}>
              <strong>
                {name} {dev && <span className="name-list__dev">{dev}</span>}
              </strong>
              <span>{meaning}</span>
              <span className="name-list__g">
                {g === "g" ? "Girl" : g === "b" ? "Boy" : "Unisex"} · {c}
                {origin ? ` · ${origin}` : ""} · {POP[p]}
              </span>
            </li>
          ))}
        </ul>
        {list.length === 0 && <p className="tool-small">No names match all of these. Try removing a filter.</p>}
        {list.length > shown && (
          <button type="button" className="btn btn--ghost btn--sm tool-more" onClick={() => setShown(shown + PAGE)}>
            Show more names
          </button>
        )}
      </div>
    </div>
  );
}

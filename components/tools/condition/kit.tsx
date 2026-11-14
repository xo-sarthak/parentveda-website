"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import ConsultBlock, { type ConsultView } from "@/components/leads/ConsultBlock";
import { track } from "@/lib/track";

/* Shared by the condition tools. Every result ends the same way: a plain read,
   the line that this is not a diagnosis, questions for the doctor, and the
   right specialist. Nothing a person types leaves this browser unless they
   choose to send the consult form. */

export const NOT_A_DIAGNOSIS = "This explains your numbers. It does not diagnose. Please discuss it with your doctor.";

export type ToolProps = {
  /** The consult block for this tool's specialty, when consults are switched on. */
  consult?: ConsultView;
  /** The hub this tool sits in, when embedded. */
  condition?: string;
};

/** tool_start on the first input, tool_complete the first time a result shows. Slug only. */
export function useToolTracking(tool: string, complete: boolean) {
  const started = useRef(false);
  const done = useRef(false);
  const start = useCallback(() => {
    if (started.current) return;
    started.current = true;
    track("tool_start", { tool });
  }, [tool]);
  useEffect(() => {
    if (complete && !done.current) {
      done.current = true;
      track("tool_complete", { tool });
    }
  }, [complete, tool]);
  return start;
}

export function Outro({ read, questions, consult, condition }: { read?: ReactNode; questions: string[]; consult?: ConsultView; condition?: string }) {
  return (
    <div className="ctool__outro">
      {read ? <div className="ctool__read">{read}</div> : null}
      <p className="ctool__disclaim">{NOT_A_DIAGNOSIS}</p>
      <div className="ctool__qs">
        <h3>Questions for your doctor</h3>
        <ul>
          {questions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </div>
      {consult ? <ConsultBlock consult={consult} condition={condition} /> : null}
    </div>
  );
}

export function Card({ tone = "info", title, children }: { tone?: "info" | "ok" | "watch" | "act"; title: ReactNode; children?: ReactNode }) {
  return (
    <div className={`ctool__card ctool__card--${tone}`} role="status">
      <p className="ctool__card-h">{title}</p>
      {children}
    </div>
  );
}

/** A number from a text box, or null when empty or not a number. */
export const num = (v: string): number | null => {
  if (v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/* ---------- a small log kept only in this browser ---------- */

/** Rows saved in localStorage under `key`. Storage can be blocked: the log then
    works for this visit and says it will not be kept. */
export function useLocalLog<T extends { id: string }>(key: string) {
  const [rows, setRows] = useState<T[]>([]);
  const [persist, setPersist] = useState(true);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setRows(JSON.parse(raw));
    } catch {
      setPersist(false);
    }
  }, [key]);
  const save = (next: T[]) => {
    setRows(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      setPersist(false);
    }
  };
  return {
    rows,
    persist,
    add: (r: T) => save([r, ...rows]),
    remove: (id: string) => save(rows.filter((r) => r.id !== id)),
    clear: () => save([]),
  };
}

export const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** Downloads rows as a CSV file, made in the browser. Nothing is uploaded. */
export function downloadCsv(filename: string, header: string[], rows: (string | number)[][]) {
  const cell = (v: string | number) => {
    const s = String(v ?? "");
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [header, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** "Clear all" asks once, inline: no browser pop-up. */
export function ClearButton({ onClear, label = "Clear all readings" }: { onClear: () => void; label?: string }) {
  const [sure, setSure] = useState(false);
  return sure ? (
    <span className="ctool__confirm">
      Delete every reading on this phone?{" "}
      <button
        type="button"
        className="btn btn--ghost btn--sm"
        onClick={() => {
          onClear();
          setSure(false);
        }}
      >
        Yes, delete
      </button>{" "}
      <button type="button" className="btn btn--ghost btn--sm" onClick={() => setSure(false)}>
        Keep them
      </button>
    </span>
  ) : (
    <button type="button" className="btn btn--ghost btn--sm" onClick={() => setSure(true)}>
      {label}
    </button>
  );
}

/** Full-screen emergency card, for readings or symptoms that need a hospital now. */
export function EmergencyOverlay({ title, items, onClose, slug }: { title: string; items: string[]; onClose: () => void; slug: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
    track("red_flag_view", { slug });
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose, slug]);
  return (
    <div className="ctool__sos" role="alertdialog" aria-modal="true" aria-labelledby="sos-h" tabIndex={-1} ref={ref}>
      <div className="ctool__sos-box">
        <p id="sos-h" className="ctool__sos-h">
          {title}
        </p>
        <ul>
          {items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p>Call 108 or go to the nearest hospital now. Take this log with you if you can.</p>
        <a href="tel:108" className="redflag__call" onClick={() => track("call_108_click", { slug })}>
          Call 108
        </a>
        <button type="button" className="btn btn--ghost" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

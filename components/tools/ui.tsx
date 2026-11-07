import type { ReactNode } from "react";

/* The parts every tool is built from, so all eight read as one family.
   Choices are real radio inputs under the styling: keyboard and screen readers
   keep working, only the look changes. */

export function Choice<T extends string | number>({
  legend,
  name,
  options,
  value,
  onChange,
  tiles,
}: {
  legend: string;
  name: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  /** Two-across tiles for longer labels; otherwise an even row. */
  tiles?: boolean;
}) {
  return (
    <fieldset className="tool-field tool-choice">
      <legend className="tool-label">{legend}</legend>
      <div className={tiles ? "tool-choice__set tool-choice__set--tiles" : "tool-choice__set"} style={tiles ? undefined : { gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
        {options.map((o) => (
          <label key={String(o.value)} className="tool-choice__opt">
            <input type="radio" name={name} checked={value === o.value} onChange={() => onChange(o.value)} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="tool-field">
      <span className="tool-label">{label}</span>
      {children}
      {hint && <small className="tool-hint">{hint}</small>}
    </label>
  );
}

/** A number box with its unit inside it, so the label stays short. */
export function NumberField({
  label,
  unit,
  hint,
  value,
  onChange,
  min,
  max,
  step,
  placeholder,
}: {
  label: string;
  unit?: string;
  hint?: string;
  value: string | number;
  onChange: (v: string) => void;
  min?: number;
  max?: number;
  step?: number | string;
  placeholder?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <span className="tool-unit">
        <input
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          // A cleared box stays empty instead of snapping to 0 under the thumb.
          value={value === 0 ? "" : value}
          onChange={(e) => onChange(e.target.value)}
        />
        {unit && <span aria-hidden="true">{unit}</span>}
      </span>
    </Field>
  );
}

/** The right-hand panel. It is always on screen, so the page never looks unfinished before you type. */
export function Answer({ eyebrow, value, sub, empty, children }: { eyebrow: string; value?: ReactNode; sub?: ReactNode; empty: string; children?: ReactNode }) {
  return (
    <aside className="tool-answer" aria-live="polite">
      <span className="tool-answer__eyebrow">{eyebrow}</span>
      {value ? (
        <>
          <p className="tool-answer__value">{value}</p>
          {sub && <p className="tool-answer__sub">{sub}</p>}
          {children}
        </>
      ) : (
        <>
          <span className="tool-answer__blank" aria-hidden="true" />
          <p className="tool-answer__sub">{empty}</p>
        </>
      )}
    </aside>
  );
}

export function Facts({ items }: { items: [string, ReactNode][] }) {
  return (
    <ul className="tool-facts">
      {items.map(([k, v]) => (
        <li key={k}>
          <span>{k}</span>
          <strong>{v}</strong>
        </li>
      ))}
    </ul>
  );
}

/** Forty weeks as one line, split at the trimesters the facts use (14 and 28 weeks). */
export function PregnancyBar({ days }: { days: number }) {
  const pct = Math.min(100, Math.max(0, (days / 280) * 100));
  return (
    <div className="tool-bar" role="img" aria-label={`${Math.min(40, Math.floor(days / 7))} of 40 weeks`}>
      <div className="tool-bar__track">
        <span className="tool-bar__fill" style={{ width: `${pct}%` }} />
        <i style={{ left: "35%" }} />
        <i style={{ left: "70%" }} />
      </div>
      <div className="tool-bar__legend">
        <span style={{ width: "35%" }}>First</span>
        <span style={{ width: "35%" }}>Second</span>
        <span style={{ width: "30%" }}>Third</span>
      </div>
    </div>
  );
}

/* ============================================================
   ParentVeda — article figures.

   Diagrams are code, not uploaded images. The Experience System asks for
   educational illustrations, anatomy diagrams, timelines and process
   diagrams in ParentVeda's own style rather than stock photography, and
   hand-built figures give us that plus crisp scaling, real text (selectable
   and translatable), brand tokens, and screen-reader labels.

   Authored in Markdown through the image syntax with a `figure:` scheme:

     ![Alt text](figure:ectopic-implantation "Optional caption")

   PostBody resolves the key against FIGURES below. An unknown key renders
   nothing rather than a broken image.

   Text-light diagrams are SVG; text-heavy ones (the treatment pathway) are
   HTML, because SVG <text> does not wrap and would overflow on mobile.
   ============================================================ */

import type { ReactNode } from "react";

/* Shared palette — the brand tokens from globals.css, as CSS vars so the
   figures inherit any future theme change instead of hardcoding hexes. */
const BRAND = "var(--color-brand-500)";
const BRAND_SOFT = "var(--color-brand-100)";
const BRAND_LINE = "var(--color-brand-300)";
const CORAL = "var(--color-coral-500)";
const CORAL_SOFT = "var(--color-coral-100)";
const INK = "var(--color-ink-700)";
const INK_SOFT = "var(--color-ink-400)";
const MIST = "var(--color-mist)";

/* ---------------- 1. Normal vs ectopic implantation ---------------- */

/** Schematic reproductive anatomy: uterus, both tubes, both ovaries, cervix. */
function Anatomy({ idPrefix }: { idPrefix: string }) {
  return (
    <g>
      {/* Uterus body */}
      <path
        d="M72 50 C72 41 128 41 128 50 L119 94 C118 104 112 110 105 112 L95 112 C88 110 82 104 81 94 Z"
        fill={MIST}
        stroke={BRAND_LINE}
        strokeWidth="1.6"
      />
      {/* Cervix / canal */}
      <path d="M95 112 L95 126 M105 112 L105 126" stroke={BRAND_LINE} strokeWidth="1.6" fill="none" />
      <path d="M93 126 L107 126" stroke={BRAND_LINE} strokeWidth="1.6" strokeLinecap="round" />

      {/* Fallopian tubes */}
      <path
        d="M73 51 C60 36 46 31 35 38"
        fill="none"
        stroke={BRAND_LINE}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M127 51 C140 36 154 31 165 38"
        fill="none"
        stroke={BRAND_LINE}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Ovaries */}
      <ellipse cx="27" cy="43" rx="9" ry="6.5" fill={BRAND_SOFT} stroke={BRAND_LINE} strokeWidth="1.4" />
      <ellipse cx="173" cy="43" rx="9" ry="6.5" fill={BRAND_SOFT} stroke={BRAND_LINE} strokeWidth="1.4" />

      <desc id={`${idPrefix}-anatomy`}>
        Schematic outline of a uterus with both fallopian tubes, both ovaries and the cervix.
      </desc>
    </g>
  );
}

function ImplantationFigure() {
  return (
    <svg
      viewBox="0 0 420 200"
      className="w-full"
      role="img"
      aria-label="Comparison diagram. On the left, a normal pregnancy implanted inside the uterus. On the right, the same anatomy showing where ectopic pregnancies implant: the fallopian tube in about 95 out of 100 cases, and more rarely an ovary, the cervix, or a caesarean scar."
    >
      {/* ---- Left: normal ---- */}
      <g transform="translate(0,18) scale(0.92)">
        <Anatomy idPrefix="normal" />
        {/* Embryo in the uterine cavity */}
        <circle cx="100" cy="72" r="7" fill={BRAND} />
        <circle cx="100" cy="72" r="12" fill="none" stroke={BRAND} strokeWidth="1.2" opacity="0.4" />
      </g>
      <text x="92" y="196" textAnchor="middle" fontSize="12" fontWeight="700" fill={INK}>
        Normal
      </text>
      <text x="92" y="182" textAnchor="middle" fontSize="10.5" fill={INK_SOFT}>
        Implants inside the uterus
      </text>

      {/* Divider */}
      <line x1="210" y1="24" x2="210" y2="170" stroke={BRAND_SOFT} strokeWidth="1.5" />

      {/* ---- Right: ectopic ---- */}
      <g transform="translate(222,18) scale(0.92)">
        <Anatomy idPrefix="ectopic" />
        {/* Tube — most common */}
        <circle cx="57" cy="42" r="7" fill={CORAL} />
        <circle cx="57" cy="42" r="12" fill="none" stroke={CORAL} strokeWidth="1.2" opacity="0.45" />
        {/* Ovary */}
        <circle cx="173" cy="43" r="4.5" fill={CORAL} opacity="0.75" />
        {/* Cervix */}
        <circle cx="100" cy="119" r="4.5" fill={CORAL} opacity="0.75" />
        {/* Caesarean scar (lower uterine segment) */}
        <circle cx="88" cy="100" r="4.5" fill={CORAL} opacity="0.75" />
      </g>

      {/* Callout for the most common site */}
      <text x="238" y="30" fontSize="10.5" fontWeight="700" fill={CORAL}>
        ~95%
      </text>
      <text x="238" y="42" fontSize="9.5" fill={INK_SOFT}>
        fallopian tube
      </text>

      <text x="314" y="196" textAnchor="middle" fontSize="12" fontWeight="700" fill={INK}>
        Ectopic
      </text>
      <text x="314" y="182" textAnchor="middle" fontSize="10.5" fill={INK_SOFT}>
        Tube, ovary, cervix or scar
      </text>
    </svg>
  );
}

/* ---------------- 2. Weeks 4–12 presentation timeline ---------------- */

function TimelineFigure() {
  const weeks = [4, 5, 6, 7, 8, 9, 10, 11, 12];
  const x = (w: number) => 40 + ((w - 4) / 8) * 340;

  return (
    <svg
      viewBox="0 0 420 150"
      className="w-full"
      role="img"
      aria-label="Timeline from week 4 to week 12 of pregnancy. Ectopic pregnancy symptoms most commonly appear between weeks 6 and 8, shown as a highlighted band. Early symptoms such as one-sided pain and unusual bleeding can begin from around week 4."
    >
      {/* Most-common band */}
      <rect x={x(6)} y="44" width={x(8) - x(6)} height="34" rx="8" fill={CORAL_SOFT} />
      <text
        x={(x(6) + x(8)) / 2}
        y="36"
        textAnchor="middle"
        fontSize="10.5"
        fontWeight="700"
        fill={CORAL}
      >
        Most common
      </text>

      {/* Axis */}
      <line x1={x(4)} y1="61" x2={x(12)} y2="61" stroke={BRAND_LINE} strokeWidth="2" strokeLinecap="round" />

      {/* Ticks */}
      {weeks.map((w) => {
        const highlight = w >= 6 && w <= 8;
        return (
          <g key={w}>
            <circle cx={x(w)} cy="61" r={highlight ? 4.5 : 3} fill={highlight ? CORAL : BRAND_LINE} />
            <text
              x={x(w)}
              y="84"
              textAnchor="middle"
              fontSize="10.5"
              fontWeight={highlight ? 700 : 400}
              fill={highlight ? INK : INK_SOFT}
            >
              {w}
            </text>
          </g>
        );
      })}

      <text x={x(4)} y="104" textAnchor="middle" fontSize="9.5" fill={INK_SOFT}>
        week
      </text>

      {/* Early-signs span */}
      <line
        x1={x(4)}
        y1="120"
        x2={x(12)}
        y2="120"
        stroke={BRAND}
        strokeWidth="1.6"
        strokeDasharray="4 4"
        strokeLinecap="round"
      />
      <text x={x(4)} y="138" fontSize="10" fill={INK}>
        Early signs possible: one-sided pain, unusual bleeding
      </text>
    </svg>
  );
}

/* ---------------- 3. Treatment pathway ---------------- */

const PATHWAYS = [
  {
    name: "Watchful monitoring",
    suits: "Small, early, already resolving",
    time: "Days to weeks of blood tests",
  },
  {
    name: "Medicine (methotrexate)",
    suits: "Unruptured, lower hormone levels",
    time: "A few weeks, with follow-up",
  },
  {
    name: "Keyhole surgery",
    suits: "Ruptured, or when medicine is unsuitable",
    time: "Same day; emergency if ruptured",
  },
];

function TreatmentPathwayFigure() {
  return (
    <div
      className="grid gap-3 sm:grid-cols-3"
      role="img"
      aria-label="Three treatment paths for ectopic pregnancy. Watchful monitoring suits small, early, already resolving cases and takes days to weeks of blood tests. Methotrexate medicine suits unruptured cases with lower hormone levels and takes a few weeks with follow-up. Keyhole surgery suits ruptured cases or when medicine is unsuitable, and happens the same day, as an emergency if ruptured."
    >
      {PATHWAYS.map((p, i) => (
        <div
          key={p.name}
          className="flex flex-col gap-2 rounded-2xl bg-mist/60 p-4 ring-1 ring-brand-500/10"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-bold text-brand-600 shadow-soft">
            {i + 1}
          </span>
          <span className="font-heading text-[0.95rem] font-bold leading-snug text-ink-900">
            {p.name}
          </span>
          <span className="text-[0.85rem] leading-snug text-ink-600">{p.suits}</span>
          <span className="mt-auto pt-1 text-[0.78rem] font-medium leading-snug text-brand-600">
            {p.time}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Registry ---------------- */

export const FIGURES: Record<string, () => ReactNode> = {
  "ectopic-implantation": ImplantationFigure,
  "ectopic-timeline": TimelineFigure,
  "ectopic-treatment-pathway": TreatmentPathwayFigure,
};

/** The `figure:` scheme PostBody looks for in Markdown image sources. */
export const FIGURE_SCHEME = "figure:";

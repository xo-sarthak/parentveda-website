// A drawn mark: the app's door-mark disc with a glyph in the app's line hand.
//
// Both halves are ported from the app, not invented here:
//
//  · The disc — `_PvDoorMark` in lib/screens/doors/pv_door_carousel.dart.
//    A disc lit from the upper left (light → mid of one hue), a hairline ring
//    just outside, an arc over the top that trails off, and a cluster of three
//    falling dots. Everything turns `index * 26 − 12` degrees, so a row of
//    marks reads as a set of places rather than one drawing tinted N ways.
//    The glyph does not turn.
//
//  · The glyph — the hand of lib/screens/ttc/ttc_symptom_mark.dart. One ink
//    line, round caps and joins, stroke 8.5% of the box, a second stroke at
//    72% of that, and at most one small solid accent. Objects and places,
//    never anatomy, never faces.
//
// Drawn in a 96-unit space (the app's design space for the disc); glyphs are
// written on a 48-unit grid and placed in the middle half.

const DOTS = [
  [74, 24, 84, 40, 66, 12],
  [22, 26, 12, 42, 32, 15],
  [72, 74, 84, 60, 62, 86],
  [26, 72, 14, 58, 36, 84],
  [76, 46, 86, 62, 70, 30],
];

// HSL → hex, and the app's pvDoorDeep: the lightest shade of the hue (at 44%
// saturation) that still clears 4.8:1 against white.
function hsl(h: number, s: number, l: number) {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [f(0), f(8), f(4)];
}
function hex([r, g, b]: number[]) {
  return "#" + [r, g, b].map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("");
}
function lum([r, g, b]: number[]) {
  const c = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b);
}
function deepOf(h: number) {
  let lo = 0,
    hi = 0.6;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    const contrast = 1.05 / (lum(hsl(h, 0.44, mid)) + 0.05);
    if (contrast >= 4.8) lo = mid;
    else hi = mid;
  }
  return hex(hsl(h, 0.44, lo));
}

export type Glyph = keyof typeof glyphs;

// 48-unit glyphs. `s` = main stroke, `t` = thin stroke, `f` = solid accent.
const S = { strokeWidth: 4 };
const T = { strokeWidth: 2.9 };
const heart = (x: number, y: number, r = 1) =>
  `M${x} ${y + 5 * r}c${-5.4 * r}-${3.4 * r} ${-7.8 * r}-${5.9 * r} ${-7.8 * r}-${8.7 * r}a${3.9 * r} ${3.9 * r} 0 0 1 ${7.8 * r}-${1.1 * r}a${3.9 * r} ${3.9 * r} 0 0 1 ${7.8 * r} ${1.1 * r}c0 ${2.8 * r}-${2.4 * r} ${5.3 * r}-${7.8 * r} ${8.7 * r}z`;

const glyphs = {
  // a doctor's note: the page, a cross, two lines of their words
  note: (
    <>
      <rect x="11" y="7" width="26" height="34" rx="4.5" {...S} />
      <path d="M24 14.5v10M19 19.5h10" {...S} />
      <path d="M18 31h12M18 35.5h8" {...T} />
    </>
  ),
  // a door standing open
  door: (
    <>
      <path d="M13 41V8h22v33" {...S} />
      <path d="M13 8l13 4v32l-13-3" {...S} />
      <path d="M5 41h38" {...T} />
      <circle cx="22.5" cy="27" r="2" data-f />
    </>
  ),
  // a home with a heart in it
  home: (
    <>
      <path d="M7 22L24 8l17 14" {...S} />
      <path d="M11.5 19v20h25V19" {...S} />
      <path d={heart(24, 27, 0.72)} data-f />
    </>
  ),
  // two notes — sacred listening
  notes: (
    <>
      <path d="M18 33V13l15-4v20" {...S} />
      <path d="M18 18l15-4" {...T} />
      <ellipse cx="14.5" cy="33.5" rx="4.5" ry="3.6" data-f />
      <ellipse cx="29.5" cy="29.5" rx="4.5" ry="3.6" data-f />
    </>
  ),
  // a conversation, one bubble answering another
  talk: (
    <>
      <path d="M7 12a4 4 0 0 1 4-4h17a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H17l-6 5v-5a4 4 0 0 1-4-4z" {...S} />
      <path d="M36 16h1a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4v5l-6-5h-8" {...T} />
      <path d={heart(19.5, 15.5, 0.55)} data-f />
    </>
  ),
  // breath, drawn as it moves
  breath: (
    <>
      <path d="M6 17h19a5 5 0 1 0-5-5" {...S} />
      <path d="M6 25h27a5 5 0 1 1-5 5" {...S} />
      <path d="M6 33h11" {...T} />
    </>
  ),
  // a diya — a few quiet minutes
  diya: (
    <>
      <path d="M7 27h34c-2.4 7.5-8.6 12-17 12S9.4 34.5 7 27z" {...S} />
      <path d="M24 7c3.4 4.6 5.8 7.6 5.8 11a5.8 5.8 0 0 1-11.6 0c0-3.4 2.4-6.4 5.8-11z" {...T} />
      <circle cx="24" cy="18.5" r="2.2" data-f />
    </>
  ),
  // a steel thali with three katoris
  thali: (
    <>
      <circle cx="24" cy="24" r="17" {...S} />
      <circle cx="17.5" cy="19.5" r="4.6" {...T} />
      <circle cx="30.5" cy="19.5" r="4.6" {...T} />
      <circle cx="24" cy="31" r="4.6" {...T} />
    </>
  ),
  // a small bowl of kheer and its spoon — annaprashan
  kheer: (
    <>
      <path d="M7 24h26c-1.6 8-6.7 12.5-13 12.5S8.6 32 7 24z" {...S} />
      <path d="M29 19l10-10" {...S} />
      <ellipse cx="40.5" cy="7.5" rx="3" ry="2.2" transform="rotate(-45 40.5 7.5)" data-f />
      <path d="M14 16c0-2 2-2 2-4M20 16c0-2 2-2 2-4" {...T} />
    </>
  ),
  // a shield with a tick — the vaccine schedule
  shield: (
    <>
      <path d="M24 6l14 5v10c0 9-6 16-14 20-8-4-14-11-14-20V11z" {...S} />
      <path d="M17.5 23.5l4.5 4.5 8.5-9" {...S} />
    </>
  ),
  // a price tag in rupees
  rupee: (
    <>
      <path d="M25 7H12a4 4 0 0 0-4 4v13l17 17 16-16z" {...S} />
      <circle cx="15" cy="14.5" r="2.2" data-f />
      <path d="M21 21h10M21 25h10M23.5 21c5 0 5 8.2 0 8.2H21l7.5 7.3" {...T} />
    </>
  ),
  // an open book with a voice coming off it — narration
  voice: (
    <>
      <path d="M5 13c6-3 12-3 18 1v25c-6-4-12-4-18-1z" {...S} />
      <path d="M23 14c4-2.7 8-3.3 12-2.2V17" {...S} />
      <path d="M31 25a5 5 0 0 1 0 8M36 21a11 11 0 0 1 0 16" {...T} />
    </>
  ),
  // a journal with a baby's footprint
  journal: (
    <>
      <path d="M12 8h21a4 4 0 0 1 4 4v29H16a4 4 0 0 1-4-4z" {...S} />
      <path d="M16.5 8v33" {...T} />
      <ellipse cx="27" cy="28" rx="3.6" ry="5.4" data-f />
      <circle cx="24.4" cy="19.8" r="1.3" data-f />
      <circle cx="27" cy="19" r="1.4" data-f />
      <circle cx="29.6" cy="19.8" r="1.3" data-f />
    </>
  ),
  // a month on a calendar, with a heart on it — birth clubs
  month: (
    <>
      <rect x="7" y="10" width="34" height="31" rx="4.5" {...S} />
      <path d="M7 18.5h34" {...T} />
      <path d="M16 6v8M32 6v8" {...S} />
      <path d={heart(24, 28.5, 0.72)} data-f />
    </>
  ),
  // the morning — a daily moment
  sun: (
    <>
      <circle cx="24" cy="24" r="8" {...S} />
      <path d="M24 6v4M24 38v4M6 24h4M38 24h4M11.3 11.3l2.8 2.8M33.9 33.9l2.8 2.8M11.3 36.7l2.8-2.8M33.9 14.1l2.8-2.8" {...T} />
    </>
  ),
  // one week, one day marked
  week: (
    <>
      <rect x="7" y="10" width="34" height="31" rx="4.5" {...S} />
      <path d="M7 18.5h34M16 6v8M32 6v8" {...T} />
      <circle cx="30.5" cy="30" r="4" data-f />
      <path d="M14 26h6M14 33h6" {...T} />
    </>
  ),
  // an open book
  book: (
    <>
      <path d="M5 13c6-3 12-3 19 1v25c-7-4-13-4-19-1z" {...S} />
      <path d="M43 13c-6-3-12-3-19 1v25c7-4 13-4 19-1z" {...S} />
      <path d="M10 20c3-1 6-1 9 .5M10 26c3-1 6-1 9 .5" {...T} />
    </>
  ),
  // the jobs, in order
  list: (
    <>
      <rect x="9" y="7" width="30" height="34" rx="4.5" {...S} />
      <path d="M15 17l2.5 2.5 4.5-5M15 28l2.5 2.5 4.5-5" {...T} />
      <path d="M26 17.5h7M26 28.5h7" {...S} />
    </>
  ),
  // a seedling
  sprout: (
    <>
      <path d="M24 41V22" {...S} />
      <path d="M24 23c0-7-5-11-13-11 0 7 5 11 13 11zM24 27c0-6 4.5-10 12.5-10 0 6.5-4.5 10-12.5 10z" {...S} />
      <path d="M14 41h20" {...T} />
    </>
  ),
  // a phone that keeps it close
  phone: (
    <>
      <rect x="13" y="5" width="22" height="38" rx="5" {...S} />
      <path d="M21 37h6" {...T} />
      <path d={heart(24, 20.5, 0.75)} data-f />
    </>
  ),
  lock: (
    <>
      <rect x="9" y="21" width="30" height="20" rx="5" {...S} />
      <path d="M16 21v-5a8 8 0 0 1 16 0v5" {...S} />
      <circle cx="24" cy="31" r="2.6" data-f />
    </>
  ),
  // a tag with a line through it — never sold
  unsold: (
    <>
      <path d="M25 7H12a4 4 0 0 0-4 4v13l17 17 16-16z" {...S} />
      <circle cx="15" cy="14.5" r="2.2" data-f />
      <path d="M40 8L8 40" {...T} />
    </>
  ),
  // two rings, linked — the paired partner
  rings: (
    <>
      <circle cx="18" cy="24" r="11" {...S} />
      <circle cx="30" cy="24" r="11" {...S} />
    </>
  ),
  // the fixed label — sponsored says so
  label: (
    <>
      <rect x="6" y="14" width="36" height="20" rx="10" {...S} />
      <path d="M14 24h12" {...T} />
      <circle cx="33" cy="24" r="2.8" data-f />
    </>
  ),
  // everything, cleared in one tap
  clear: (
    <>
      <path d="M8 13h32M19 13V8h10v5" {...S} />
      <path d="M12 13l2 28h20l2-28" {...S} />
      <path d="M20 21v12M28 21v12" {...T} />
    </>
  ),
  // a reminder
  bell: (
    <>
      <path d="M12 33V22a12 12 0 0 1 24 0v11l3 4H9z" {...S} />
      <path d="M20 41a4 4 0 0 0 8 0" {...S} />
      <circle cx="24" cy="7" r="2" data-f />
    </>
  ),
  // a sum with a line through it — we don't recalculate
  noCalc: (
    <>
      <rect x="10" y="6" width="28" height="36" rx="5" {...S} />
      <path d="M16 14h16" {...T} />
      <circle cx="18" cy="24" r="1.8" data-f />
      <circle cx="30" cy="24" r="1.8" data-f />
      <circle cx="18" cy="33" r="1.8" data-f />
      <path d="M42 6L6 42" {...T} />
    </>
  ),
  // a flag — the red flag goes to a person
  flag: (
    <>
      <path d="M12 42V7" {...S} />
      <path d="M12 9h22l-5 7 5 7H12" {...S} />
      <circle cx="12" cy="42" r="2.2" data-f />
    </>
  ),
  // three voices, none of them the source
  voices: (
    <>
      <circle cx="16" cy="19" r="8" {...T} />
      <circle cx="32" cy="19" r="8" {...T} />
      <circle cx="24" cy="31" r="8" {...S} />
    </>
  ),
  // a heart — families
  heart: (
    <>
      <path d="M24 40C12 32.5 7 26.5 7 20a8.5 8.5 0 0 1 17-2.5A8.5 8.5 0 0 1 41 20c0 6.5-5 12.5-17 20z" {...S} />
      <circle cx="17" cy="19" r="2" data-f />
    </>
  ),
  // a briefcase — employers and brands
  case: (
    <>
      <rect x="6" y="15" width="36" height="25" rx="5" {...S} />
      <path d="M18 15v-4a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v4" {...S} />
      <path d="M6 26h36" {...T} />
      <rect x="21" y="23" width="6" height="6" rx="1.5" data-f />
    </>
  ),
} satisfies Record<string, React.ReactNode>;

export default function Mark({
  glyph,
  hue = 268,
  index = 0,
  size = 56,
  className,
}: {
  glyph: Glyph;
  hue?: number;
  index?: number;
  size?: number;
  className?: string;
}) {
  const light = hex(hsl(hue, 0.46, 0.93));
  const mid = hex(hsl(hue, 0.3, 0.82));
  const deep = deepOf(hue);
  const d = DOTS[index % DOTS.length];
  const turn = index * 26 - 12;
  const id = `mk-${glyph}-${Math.round(hue)}-${index}`;
  // below ~64px the hairlines would vanish, so they thicken as the mark shrinks
  const hair = size < 64 ? 1.8 : 1.2;

  return (
    <svg className={`mark ${className ?? ""}`} width={size} height={size} viewBox="0 0 96 96" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={id} cx="38%" cy="30%" r="78%">
          <stop offset="0" stopColor={light} />
          <stop offset="1" stopColor={mid} />
        </radialGradient>
      </defs>
      <g className="mark__orbit" transform={`rotate(${turn} 48 48)`} fill="none" stroke={deep} strokeLinecap="round">
        <circle cx="48" cy="48" r="36" fill={`url(#${id})`} stroke="none" />
        <circle cx="48" cy="48" r="43" strokeWidth={hair} strokeOpacity="0.22" />
        <path d="M5 48A43 43 0 0 1 75 14.5" strokeWidth={hair * 1.15} strokeOpacity="0.34" />
        <circle cx={d[0]} cy={d[1]} r="4.5" fill={deep} fillOpacity="0.5" stroke="none" />
        <circle cx={d[2]} cy={d[3]} r="2.6" fill={deep} fillOpacity="0.36" stroke="none" />
        <circle cx={d[4]} cy={d[5]} r="1.6" fill={deep} fillOpacity="0.28" stroke="none" />
      </g>
      <g
        className="mark__glyph"
        transform="translate(22.5 22.5) scale(1.06)"
        fill="none"
        stroke={deep}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: deep }}
      >
        {glyphs[glyph]}
      </g>
    </svg>
  );
}

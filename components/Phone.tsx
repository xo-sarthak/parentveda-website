import Image from "next/image";
import Icon from "./Icon";

// Rendered UI, not screenshots: the phone shows the app's own grammar —
// white ground, Newsreader titles, ink pills, purple only on the eyebrow.

export function Phone({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`phone ${className ?? ""}`}>
      <div className="phone__notch" aria-hidden="true" />
      <div className="phone__screen">{children}</div>
    </div>
  );
}

export function WeekScreen() {
  return (
    <div className="scr" aria-label="ParentVeda's pregnancy home at week 20">
      <div className="scr__top">
        <span className="scr__eyebrow">Week 20 · Day 3</span>
        <span className="scr__avatar" aria-hidden="true">A</span>
      </div>
      <p className="scr__title">Halfway there.</p>
      <div className="scr__baby">
        <div className="scr__disc" />
        <Image src="/weeks/week_20.webp" alt="" width={150} height={150} />
      </div>
      <p className="scr__size">
        About the size of <b>a banana</b>
      </p>
      <div className="scr__card">
        <span className="scr__eyebrow">This week</span>
        <p>Your anomaly scan usually happens now. Here’s what it looks for.</p>
        <span className="scr__pill">Read · 3 min</span>
      </div>
      <div className="scr__row">
        <span className="scr__tile"><Icon name="sound" size={16} /> Garbh Sanskar</span>
        <span className="scr__tile"><Icon name="calendar" size={16} /> Scans</span>
      </div>
      <div className="scr__nav" aria-hidden="true">
        <span className="is-on" /> <span /> <span /> <span />
      </div>
    </div>
  );
}

export function AskScreen() {
  return (
    <div className="scr scr--ask" aria-label="Ask Veda answering a question">
      <div className="scr__top">
        <span className="scr__eyebrow">Ask Veda</span>
      </div>
      <div className="scr__q">Can I eat papaya now?</div>
      <div className="scr__a">
        <b>Ripe papaya, in small amounts, is usually fine.</b> Unripe or semi-ripe papaya is the one doctors ask you to avoid.
      </div>
      <div className="scr__a scr__a--soft">
        <span className="scr__eyebrow">What you can do</span>
        Choose fully ripe fruit, and ask your doctor if you have been told to be careful.
      </div>
      <div className="scr__src">From ParentVeda’s library · Is it safe?</div>
    </div>
  );
}

export function CycleScreen() {
  return (
    <div className="scr" aria-label="ParentVeda's cycle companion">
      <div className="scr__top">
        <span className="scr__eyebrow">Cycle · Day 12</span>
      </div>
      <p className="scr__title">Your periods, and what they say.</p>
      <svg viewBox="0 0 120 120" className="scr__ring" aria-hidden="true">
        <circle cx="60" cy="60" r="48" fill="none" stroke="#EFE7DA" strokeWidth="10" />
        <circle cx="60" cy="60" r="48" fill="none" stroke="#C9A77A" strokeWidth="10" strokeDasharray="301.6" strokeDashoffset="160" strokeLinecap="round" transform="rotate(-90 60 60)" />
        <circle cx="60" cy="60" r="48" fill="none" stroke="#6A30B6" strokeWidth="10" strokeDasharray="42 301.6" strokeDashoffset="-150" strokeLinecap="round" transform="rotate(-90 60 60)" />
        <text x="60" y="58" textAnchor="middle" fontFamily="var(--font-display)" fontSize="22" fill="#201C24">12</text>
        <text x="60" y="75" textAnchor="middle" fontSize="8" fill="#6F6878" fontWeight="700" letterSpacing="1">OF 29</text>
      </svg>
      <div className="scr__card">
        <span className="scr__eyebrow">Today</span>
        <p>Your fertile days are likely around now. Likely — not certain. Here’s why.</p>
      </div>
    </div>
  );
}

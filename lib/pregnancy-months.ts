/* Pregnancy month by month: /pregnancy/month-by-month/ and /pregnancy/<n>th-month/.

   All the words come from the app, through scripts/sync-from-app.py into
   lib/pregnancy-months.json: the Mother week cards (weeks 4 to 40), the month FAQ
   library (months 1 to 8) and the scan milestones. The months and their week
   ranges are the app's too, so the site and the app never disagree about which
   month a week is in. Server-only: the JSON is about 350 KB and must not reach a
   browser bundle. The converter tool gets only the small MONTH_RANGES table. */

import DATA from "./pregnancy-months.json";

export type PregWeek = {
  week: number;
  milestone: string;
  headline: string;
  size: string;
  length: string;
  weight: string;
  baby: string;
  body: string;
  feel: string;
  symptoms: string[];
  selfCare: string;
  reassurance: string;
  theme: string;
  whyNow: string;
  foods: string[];
  superfood: { food: string; benefit: string; how: string } | null;
  meal: string | null;
  doThis: string;
  skip: string;
  redFlags: string;
  myth: { myth: string; truth: string } | null;
  partner: string | null;
};
export type PregFaq = { id: string; q: string; category: string; a: string[]; takeaways: string[] };
export type PregScan = { id: string; week: number; range: string; title: string; why: string };
export type MonthRange = { month: number; from: number; to: number };

const data = DATA as unknown as { months: MonthRange[]; weeks: PregWeek[]; faqs: Record<string, PregFaq[]>; scans: PregScan[] };

export const MONTHS_BASE = "/pregnancy";
export const MONTHS_HUB = `${MONTHS_BASE}/month-by-month/`;

const ORD = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"];
const WORD = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth"];
export const monthOrdinal = (m: number) => ORD[m];
export const monthWord = (m: number) => WORD[m];
export const monthSlug = (m: number) => `${ORD[m]}-month`;
export const monthPath = (m: number) => `${MONTHS_BASE}/${monthSlug(m)}/`;
export const monthFromSlug = (slug: string) => {
  const m = ORD.indexOf(slug.replace(/-month$/, ""));
  return m > 0 && monthSlug(m) === slug ? m : null;
};

export const MONTH_RANGES: MonthRange[] = data.months;
export const monthOfWeek = (week: number) => MONTH_RANGES.find((r) => week >= r.from && week <= r.to)?.month ?? (week > 40 ? 9 : 1);
export const trimesterOfWeek = (week: number) => (week <= 13 ? 1 : week <= 27 ? 2 : 3);

export const weeksIn = (m: number) => {
  const r = MONTH_RANGES.find((x) => x.month === m)!;
  return data.weeks.filter((w) => w.week >= r.from && w.week <= r.to);
};
export const rangeOf = (m: number) => MONTH_RANGES.find((x) => x.month === m)!;
export const getWeek = (week: number) => data.weeks.find((w) => w.week === week);

/** Scans and checks whose usual week falls in the month. */
export function scansIn(m: number): PregScan[] {
  const r = rangeOf(m);
  return data.scans.filter((s) => s.week >= r.from && s.week <= r.to).sort((a, b) => a.week - b.week);
}

/** The month's own "what happens this month" answer, if the FAQ library has one. */
export function monthOverview(m: number): PregFaq | undefined {
  return (data.faqs[String(m)] ?? []).find((f) => /^what happens in the/i.test(f.q));
}

/** Up to `limit` FAQs for the month: its month-wise questions first, then one per
    topic in the library's own order, so a page is not ten questions on one scan. */
export function faqsFor(m: number, limit = 10): PregFaq[] {
  const all = (data.faqs[String(m)] ?? []).filter((f) => f !== monthOverview(m));
  const picked: PregFaq[] = all.filter((f) => /month-wise/i.test(f.category)).slice(0, 2);
  const seen = new Set(picked.map((f) => f.category));
  for (const f of all) {
    if (picked.length >= limit) break;
    if (!picked.includes(f) && !seen.has(f.category)) {
      picked.push(f);
      seen.add(f.category);
    }
  }
  for (const f of all) {
    if (picked.length >= limit) break;
    if (!picked.includes(f)) picked.push(f);
  }
  return picked;
}

export const weekImage = (week: number) => `/weeks/week_${String(Math.min(40, Math.max(4, week))).padStart(2, "0")}.webp`;

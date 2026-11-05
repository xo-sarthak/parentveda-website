/* Free tools at /tools/.

   Linking works both ways and needs no manual step when an article goes live:
   - A tool page lists its `reads` first (when published), then any other live
     article whose slug, title or tags match the tool's `match` pattern.
   - An article page shows a card for every tool whose `reads` include it or
     whose `match` pattern fits it (see toolsForPost).
   Both read the same cached content as the rest of the site, so the Directus
   publish webhook updates them within the minute. */

import type { GuidePost } from "./guides";

export const TOOLS_BASE = "/tools";

export type ToolInfo = {
  slug: string;
  name: string;
  short: string;
  cta: string;
  stage: "Trying to conceive" | "Pregnancy" | "Parenting";
  tone: string;
  /** Article slugs to suggest first, in order. Unpublished ones are skipped. */
  reads: string[];
  /** Matched against a live article's slug, title and tags. */
  match: RegExp;
};

export const TOOLS: ToolInfo[] = [
  {
    slug: "ovulation-calculator",
    name: "Ovulation calculator",
    short: "Find your likely fertile days for the next three cycles from your last period and cycle length.",
    cta: "Find your fertile days",
    stage: "Trying to conceive",
    tone: "#E8C4CE",
    reads: ["fertile-window", "ovulation-symptoms", "when-to-take-pregnancy-test", "get-pregnant-with-pcos", "preconception-checklist"],
    match: /ovulat|fertile|trying to conceive|get(ting)? pregnant|conceiv|cervical mucus|irregular period|cycle length|\bttc\b/i,
  },
  {
    slug: "due-date-calculator",
    name: "Due date calculator",
    short: "Work out your due date from your last period, conception, IVF transfer or a scan.",
    cta: "Work out your due date",
    stage: "Pregnancy",
    tone: "#E8D9C0",
    reads: ["pregnancy-due-date", "pregnancy-week-by-week", "pregnancy-ultrasound-schedule", "nt-scan", "dates-during-pregnancy"],
    match: /due date|\bedd\b|dating scan|signs of labou?r|full term|overdue|preterm|hospital bag/i,
  },
  {
    slug: "pregnancy-week-calculator",
    name: "How many weeks pregnant am I?",
    short: "See which week and trimester you are in today, and what is usually checked around now.",
    cta: "See your week today",
    stage: "Pregnancy",
    tone: "#D8CCE8",
    reads: ["pregnancy-week-by-week", "pregnancy-symptoms", "nt-scan", "group-b-strep-test-pregnancy", "pregnancy-due-date"],
    match: /weeks? pregnant|week by week|trimester|\bscan\b|anomaly|nt scan|ultrasound|glucose test|\bgtt\b/i,
  },
  {
    slug: "is-it-safe-in-pregnancy",
    name: "Is it safe in pregnancy?",
    short: "200 foods, drinks, medicines and activities, with a clear answer and what changes by trimester.",
    cta: "Check a food or activity",
    stage: "Pregnancy",
    tone: "#F7ECD4",
    reads: ["foods-to-avoid-during-pregnancy", "pregnancy-diet-chart", "dates-during-pregnancy", "eating-for-two-pregnancy-nutrition-myth"],
    match: /is it safe|safe (to|in|during)|can i (eat|drink|have)|foods? to avoid|during pregnancy.*(eat|food|drink)|papaya|pineapple|saffron|caffeine|ghee/i,
  },
  {
    slug: "pregnancy-weight-gain-calculator",
    name: "Pregnancy weight gain calculator",
    short: "See the healthy range of weight gain for your pregnancy, based on your weight before you were pregnant.",
    cta: "See your healthy range",
    stage: "Pregnancy",
    tone: "#D9A08A",
    reads: ["eating-for-two-pregnancy-nutrition-myth", "pregnancy-diet-chart", "exercise-during-pregnancy"],
    match: /weight gain|eating for two|pregnancy diet|gestational diabetes|calories? in pregnancy/i,
  },
  {
    slug: "vaccination-schedule",
    name: "Baby vaccination schedule",
    short: "Enter your baby's birth date to get the IAP vaccine dates as a list you can print.",
    cta: "Get your baby's vaccine dates",
    stage: "Parenting",
    tone: "#C5D6C4",
    reads: ["vaccination-chart-india", "baby-milestones", "common-baby-illnesses", "newborn-baby-care-first-week"],
    match: /vaccin|immuni[sz]|\biap\b|injection|\bbcg\b|\bmmr\b/i,
  },
  {
    slug: "baby-growth-chart",
    name: "Baby growth chart",
    short: "Plot your child's weight, height and head size on the WHO growth chart the IAP uses, from birth to 5 years.",
    cta: "Check your child's growth",
    stage: "Parenting",
    tone: "#E8D9C0",
    reads: ["baby-milestones", "how-to-breastfeed", "common-baby-illnesses"],
    match: /growth chart|baby weight|weight gain in bab|percentile|height for age|underweight|failure to thrive|growth spurt/i,
  },
  {
    slug: "baby-names",
    name: "Indian baby name finder",
    short: "Over 2,000 Indian names with meanings, across communities. Filter by letter, gender and style.",
    cta: "Find a name",
    stage: "Parenting",
    tone: "#E8C4CE",
    reads: [],
    match: /baby names?|naming ceremony|naamkaran|nakshatra/i,
  },
];

export const toolPath = (slug: string) => `${TOOLS_BASE}/${slug}/`;
export const getTool = (slug: string) => TOOLS.find((t) => t.slug === slug)!;

const haystack = (p: GuidePost) => `${p.slug.replace(/-/g, " ")} ${p.title} ${p.tags.join(" ")}`;

/** Articles for a tool page: pinned reads first, then matching live articles, newest first. */
export function readsForTool(tool: ToolInfo, posts: GuidePost[], limit = 6): GuidePost[] {
  const pinned = tool.reads.map((s) => posts.find((p) => p.slug === s)).filter((p): p is GuidePost => Boolean(p));
  const matched = posts
    .filter((p) => !tool.reads.includes(p.slug) && tool.match.test(haystack(p)))
    .sort((a, b) => (b.updated ?? b.date).localeCompare(a.updated ?? a.date));
  return [...pinned, ...matched].slice(0, limit);
}

/** Tools to show on an article page. Pinned links win; at most two cards. */
export function toolsForPost(post: GuidePost, limit = 2): ToolInfo[] {
  const pinned = TOOLS.filter((t) => t.reads.includes(post.slug));
  const matched = TOOLS.filter((t) => !pinned.includes(t) && t.match.test(haystack(post)));
  return [...pinned, ...matched].slice(0, limit);
}

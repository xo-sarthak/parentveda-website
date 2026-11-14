/* Free tools at /tools/.

   Linking works both ways and needs no manual step when an article goes live:
   - A tool page lists its `reads` first (when published), then any other live
     article whose slug, title or tags match the tool's `match` pattern.
   - An article page shows a card for every tool whose `reads` include it or
     whose `match` pattern fits it (see toolsForPost).
   Both read the same cached content as the rest of the site, so the Directus
   publish webhook updates them within the minute. */

import type { GuidePost } from "./guides";
import { canShow } from "./review-gate";
import fertilityRef from "./tools-reference/fertility-specialist-check.json";
import semenRef from "./tools-reference/semen-report-reader.json";
import amhRef from "./tools-reference/amh-reader.json";
import thalRef from "./tools-reference/thalassemia-couple-check.json";
import screenRef from "./tools-reference/screening-result-explainer.json";
import afiRef from "./tools-reference/afi-reader.json";
import bpRef from "./tools-reference/bp-log.json";
import sugarRef from "./tools-reference/pregnancy-sugar-targets.json";

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
  /** false while a tool's medical values wait for review on this deploy (lib/review-gate.ts).
      Such a tool gets no cards and no index entry, and its page says it is coming soon. */
  available?: boolean;
};

const BUILT: ToolInfo[] = [
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
    slug: "pregnancy-weeks-to-months",
    name: "Pregnancy weeks to months",
    short: "Turn weeks into months. See which month and trimester you are in, and what that month usually holds.",
    cta: "Find your month",
    stage: "Pregnancy",
    tone: "#F3D9CB",
    reads: ["pregnancy-symptoms-month-by-month", "pregnancy-week-by-week", "pregnancy-ultrasound-schedule"],
    match: /month by month|months? pregnant|weeks to months|(\d|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth) month/i,
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

/* Condition tools (website upgrade, Phase 3). Each keeps its medical values in
   lib/tools-reference/<slug>.json with "reviewed": false until a specialist
   signs them off. Until then, production shows a "being reviewed" page and
   lists the tool nowhere; preview and dev work normally (lib/review-gate.ts). */
const CONDITION_TOOLS: (Omit<ToolInfo, "available"> & { reviewed: boolean })[] = [
  {
    slug: "fertility-specialist-check",
    name: "Is it time to see a fertility specialist?",
    short: "Answer five questions about your age, how long you have been trying and your health, and see when a specialist visit makes sense.",
    cta: "Check in two minutes",
    stage: "Trying to conceive",
    tone: "#E8C4CE",
    reads: ["preconception-tests-india", "get-pregnant-with-pcos", "ivf-process"],
    match: /fertility specialist|unexplained infertility|trying for a (year|long time)|not getting pregnant/i,
    reviewed: fertilityRef.reviewed,
  },
  {
    slug: "semen-report-reader",
    name: "Semen report reader",
    short: "Type in the numbers from a semen analysis and see, line by line, how each compares with the usual range.",
    cta: "Read a semen report",
    stage: "Trying to conceive",
    tone: "#D8CCE8",
    reads: ["improve-sperm-count", "azoospermia"],
    match: /semen|sperm|male fertility|azoospermia|varicocele/i,
    reviewed: semenRef.reviewed,
  },
  {
    slug: "amh-reader",
    name: "AMH result reader",
    short: "Enter your AMH result and age to see how it compares with what is usual at your age, and what it does and does not tell you.",
    cta: "Read an AMH result",
    stage: "Trying to conceive",
    tone: "#E8D9C0",
    reads: ["ivf-process", "preconception-tests-india"],
    match: /amh|ovarian reserve|egg reserve|egg freezing/i,
    reviewed: amhRef.reviewed && amhRef.bands.length > 0,
  },
  {
    slug: "thalassemia-couple-check",
    name: "Thalassemia couple check",
    short: "Choose each partner's thalassemia test result and see what it means for your children, and what to do next.",
    cta: "Check as a couple",
    stage: "Trying to conceive",
    tone: "#C5D6C4",
    reads: ["preconception-tests-india", "preconception-checklist"],
    match: /thalass|hba2|hb electrophoresis|cousin marriage/i,
    reviewed: thalRef.reviewed,
  },
  {
    slug: "screening-result-explainer",
    name: "Screening result explainer",
    short: "Turn a \"1 in N\" result from a double marker, triple, quadruple or NIPT report into plain words, and see the next steps.",
    cta: "Explain my result",
    stage: "Pregnancy",
    tone: "#D8CCE8",
    reads: ["down-syndrome-screening-india", "nipt-test-pregnancy", "nt-scan"],
    match: /double marker|triple (test|marker)|quadruple|nipt|down syndrome|screening result/i,
    reviewed: screenRef.reviewed,
  },
  {
    slug: "afi-reader",
    name: "Amniotic fluid (AFI) reader",
    short: "Enter the AFI or deepest pocket from your scan report to see where it sits and what doctors usually do next.",
    cta: "Read my scan number",
    stage: "Pregnancy",
    tone: "#C5D6C4",
    reads: ["pregnancy-ultrasound-schedule", "what-scan-doctor-can-tell-you"],
    match: /amniotic fluid|afi|oligohydramnios|polyhydramnios/i,
    reviewed: afiRef.reviewed,
  },
  {
    slug: "bp-log",
    name: "Pregnancy BP log",
    short: "Keep your blood pressure readings on this phone, see when a reading needs a call to your doctor, and print the log for your visit.",
    cta: "Start a BP log",
    stage: "Pregnancy",
    tone: "#F7ECD4",
    reads: ["high-risk-pregnancy"],
    match: /blood pressure|bp|preeclampsia|pre-eclampsia|hypertension/i,
    reviewed: bpRef.reviewed,
  },
  {
    slug: "pregnancy-sugar-targets",
    name: "Pregnancy sugar targets",
    short: "Check a blood sugar reading against the usual pregnancy targets, and keep a simple log for your doctor.",
    cta: "Check a sugar reading",
    stage: "Pregnancy",
    tone: "#E8C4CE",
    reads: ["pregnancy-diet-chart"],
    match: /gestational diabetes|gdm|pregnancy sugar|blood sugar|glucose test|dipsi/i,
    reviewed: sugarRef.reviewed,
  },
];

/** Every tool, including ones waiting for review. Tool pages use this. */
export const ALL_TOOLS: ToolInfo[] = [
  ...BUILT,
  ...CONDITION_TOOLS.map(({ reviewed, ...t }) => ({ ...t, available: canShow(reviewed) })),
];

/** Tools a visitor can use on this deploy: every list, card and sitemap uses this. */
export const TOOLS: ToolInfo[] = ALL_TOOLS.filter((t) => t.available !== false);

export const toolPath = (slug: string) => `${TOOLS_BASE}/${slug}/`;
export const getTool = (slug: string) => ALL_TOOLS.find((t) => t.slug === slug)!;

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

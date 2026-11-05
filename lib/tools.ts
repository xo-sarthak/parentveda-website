/* Free tools at /tools/. Each tool page links to the reads that explain its
   result, chosen by slug from the live posts so a link never points at an
   article that is not published yet. */

export const TOOLS_BASE = "/tools";

export type ToolInfo = {
  slug: string;
  name: string;
  short: string;
  stage: "Trying to conceive" | "Pregnancy" | "Parenting";
  tone: string;
  /** Article slugs to suggest under the result, in order. Missing ones are skipped. */
  reads: string[];
};

export const TOOLS: ToolInfo[] = [
  {
    slug: "ovulation-calculator",
    name: "Ovulation calculator",
    short: "Find your likely fertile days for the next three cycles from your last period and cycle length.",
    stage: "Trying to conceive",
    tone: "#E8C4CE",
    reads: ["fertile-window", "ovulation-symptoms", "when-to-take-pregnancy-test", "get-pregnant-with-pcos", "preconception-checklist"],
  },
  {
    slug: "due-date-calculator",
    name: "Due date calculator",
    short: "Work out your estimated due date from your last period or the day you conceived.",
    stage: "Pregnancy",
    tone: "#E8D9C0",
    reads: ["pregnancy-due-date", "pregnancy-week-by-week", "pregnancy-ultrasound-schedule", "nt-scan", "dates-during-pregnancy"],
  },
  {
    slug: "pregnancy-week-calculator",
    name: "How many weeks pregnant am I?",
    short: "See which week and trimester you are in today, and what is usually checked around now.",
    stage: "Pregnancy",
    tone: "#D8CCE8",
    reads: ["pregnancy-week-by-week", "pregnancy-symptoms", "nt-scan", "group-b-strep-test-pregnancy", "pregnancy-due-date"],
  },
  {
    slug: "vaccination-schedule",
    name: "Baby vaccination schedule",
    short: "Enter your baby's birth date to get the IAP vaccine dates as a list you can print.",
    stage: "Parenting",
    tone: "#C5D6C4",
    reads: ["vaccination-chart-india", "baby-milestones", "common-baby-illnesses", "newborn-baby-care-first-week"],
  },
];

export const toolPath = (slug: string) => `${TOOLS_BASE}/${slug}/`;
export const getTool = (slug: string) => TOOLS.find((t) => t.slug === slug)!;

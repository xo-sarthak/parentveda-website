/* Pillar guides shown under Trying, Pregnancy and Parenting in the main menu.
   Order is priority (from the SEO publishing plan). A pillar appears only once
   its article is published, so add new pillars here before they go live and
   they show up on their own. `label` is the short menu text. */
import { getAllPosts, postPath, type GuidePost } from "./guides";

export type MenuLink = { href: string; label: string };

const PILLARS: Record<string, [slug: string, label: string][]> = {
  "/trying-to-conceive": [
    ["preconception-checklist", "Preconception checklist"],
    ["pcos-symptoms", "PCOS symptoms"],
    ["irregular-periods", "Irregular periods"],
    ["fertile-window", "Your fertile window"],
    ["male-fertility", "Male fertility"],
    ["what-is-ivf", "What is IVF?"],
    ["miscarriage", "Miscarriage and recovery"],
  ],
  "/pregnancy": [
    ["pregnancy-week-by-week", "Pregnancy week by week"],
    ["pregnancy-symptoms", "Symptoms month by month"],
    ["pregnancy-ultrasound-schedule", "Scan schedule"],
    ["pregnancy-diet-chart", "Pregnancy diet chart"],
    ["foods-to-avoid-during-pregnancy", "Foods to avoid"],
    ["high-risk-pregnancy", "High-risk pregnancy"],
    ["garbh-sanskar", "Garbh Sanskar"],
    ["exercise-during-pregnancy", "Exercise in pregnancy"],
    ["skin-changes-during-pregnancy", "Skin changes"],
    ["labour-stages", "Stages of labour"],
  ],
  "/parenting": [
    ["newborn-baby-care-first-week", "Newborn care, first week"],
    ["how-to-breastfeed", "How to breastfeed"],
    ["postpartum-recovery", "Postpartum recovery"],
    ["baby-milestones", "Baby milestones"],
    ["vaccination-chart-india", "Vaccination chart"],
    ["baby-sleep-hours-age", "Baby sleep by age"],
    ["baby-teething", "Teething"],
    ["common-baby-illnesses", "Common baby illnesses"],
    ["types-baby-rashes", "Baby rashes"],
    ["developmental-red-flags", "Developmental red flags"],
    ["potty-training", "Potty training"],
    ["newborn-baby-essentials-india", "Newborn essentials"],
    ["baby-proofing-home", "Baby proofing"],
  ],
};

const MAX_PER_STAGE = 6;

/** Published pillar links per stage menu item. Never throws: a failed read
    leaves the menu as plain links rather than breaking every page. */
export async function getMenuPillars(): Promise<Record<string, MenuLink[]>> {
  let posts: GuidePost[] = [];
  try {
    posts = await getAllPosts();
  } catch {
    return {};
  }
  const bySlug = new Map(posts.map((p) => [p.slug, p]));
  const out: Record<string, MenuLink[]> = {};
  for (const [stage, list] of Object.entries(PILLARS)) {
    out[stage] = list
      .map(([slug, label]) => {
        const p = bySlug.get(slug);
        return p ? { href: `${p.canonicalPath ?? postPath(p.category, p.slug)}/`, label } : null;
      })
      .filter((x): x is MenuLink => x !== null)
      .slice(0, MAX_PER_STAGE);
  }
  return out;
}

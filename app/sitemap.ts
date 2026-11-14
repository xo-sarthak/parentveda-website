import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { stages } from "@/lib/stages";
import { LEGAL_BASE, LEGAL_PAGES, legalPath } from "@/lib/legal";
import { GUIDES_BASE, categoryPath, getAllPosts, getCategories, postPath, type GuidePost } from "@/lib/guides";
import { AUTHORS, authorPath } from "@/lib/authors";
import { TOOLS, TOOLS_BASE, toolPath } from "@/lib/tools";
import { getBabyNames, getCanIData } from "@/lib/shared-content";
import { safePath } from "@/lib/safe-in-pregnancy";
import { allNamePages, namePageSlug, namesPath } from "@/lib/baby-names";
import { MONTHS_HUB, MONTH_RANGES, monthPath } from "@/lib/pregnancy-months";

// Refreshes every minute, so a post published in Directus is submitted within the minute.
export const revalidate = 60;

/* Every URL carries its trailing slash, the shape the pages' canonical tags
   use. Listing the slash-less form would submit addresses that only redirect. */
const abs = (path: string) => `${site.domain}${path.endsWith("/") ? path : `${path}/`}`;

const lastChanged = (p: GuidePost) => p.updated ?? p.date;

/** The most recent change among some posts. Undefined when there are none. */
function newest(posts: GuidePost[]): string | undefined {
  return posts.map(lastChanged).filter(Boolean).sort().at(-1);
}

/* lastmod is a promise that the page's content changed on that date. A page
   whose change we cannot date leaves it out: stamping the build or request time
   on everything teaches search engines to ignore the field. */
const dated = (lastModified?: string) => (lastModified ? { lastModified } : {});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, canI, names] = await Promise.all([getAllPosts(), getCategories(), getCanIData(), getBabyNames()]);

  const pages = ["/", ...stages.map((s) => `/${s.slug}`), "/ask-veda", "/fathers", "/about", "/partners", "/privacy", "/download", "/contact", "/experts"];

  return [
    ...pages.map((p) => ({ url: abs(p), changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.7 })),
    { url: abs(GUIDES_BASE), ...dated(newest(posts)), changeFrequency: "weekly" as const, priority: 0.9 },
    ...categories.map((c) => ({
      url: abs(categoryPath(c.slug)),
      ...dated(newest(posts.filter((p) => p.category === c.slug))),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...posts.map((p) => ({
      url: abs(p.canonicalPath ?? postPath(p.category, p.slug)),
      ...dated(lastChanged(p)),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...AUTHORS.map((a) => ({
      url: abs(authorPath(a.slug)),
      ...dated(newest(posts.filter((p) => p.authorSlug === a.slug || p.reviewedBy === a.slug))),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    { url: abs(TOOLS_BASE), changeFrequency: "monthly" as const, priority: 0.8 },
    ...TOOLS.map((t) => ({ url: abs(toolPath(t.slug)), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...canI.entries.map((e) => ({ url: abs(safePath(e.id)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...allNamePages(names).map((p) => ({ url: abs(namesPath(namePageSlug(p))), changeFrequency: "monthly" as const, priority: 0.5 })),
    { url: abs(MONTHS_HUB), changeFrequency: "monthly" as const, priority: 0.7 },
    ...MONTH_RANGES.map((r) => ({ url: abs(monthPath(r.month)), changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: abs(LEGAL_BASE), changeFrequency: "yearly" as const, priority: 0.3 },
    ...LEGAL_PAGES.map((p) => ({ url: abs(legalPath(p.slug)), changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}

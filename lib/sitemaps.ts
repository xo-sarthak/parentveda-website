/* ============================================================
   The four sitemaps (articles, hubs, tools, pages) and the index that lists
   them. Served by app/sitemap.xml and app/sitemap-<part>.xml route handlers.

   lastmod is a promise that the page changed on that date. An article uses the
   later of its modified date and its last-reviewed date; a page whose change we
   cannot date leaves lastmod out rather than stamping today on it.
   ============================================================ */

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
import { CONDITIONS_BASE, conditionPath, liveConditions, postsForCondition } from "@/lib/conditions";
import { clusterPath } from "@/lib/clusters";
import { INDEX_MIN, clustersWithPosts, postsInCluster } from "@/components/reads/ClusterListing";
import { sitemapPartPath, SITEMAP_PARTS, type SitemapPart } from "@/lib/sitemap-paths";

type Freq = "daily" | "weekly" | "monthly" | "yearly";
export type Entry = { url: string; lastModified?: string; changeFrequency: Freq; priority: number };

/* Every URL carries its trailing slash, the shape the canonical tags use. */
const abs = (path: string) => `${site.domain}${path.endsWith("/") ? path : `${path}/`}`;

/** The later of modified and last-reviewed. */
export const lastChanged = (p: GuidePost) => [p.updated ?? p.date, p.reviewedDate].filter(Boolean).sort().at(-1) || undefined;

function newest(posts: GuidePost[]): string | undefined {
  return posts.map(lastChanged).filter(Boolean).sort().at(-1);
}

const dated = (lastModified?: string) => (lastModified ? { lastModified } : {});

async function articles(): Promise<Entry[]> {
  const posts = await getAllPosts();
  return posts.map((p) => ({
    url: abs(p.canonicalPath ?? postPath(p.category, p.slug)),
    ...dated(lastChanged(p)),
    changeFrequency: "monthly",
    priority: 0.8,
  }));
}

async function hubs(): Promise<Entry[]> {
  const posts = await getAllPosts();
  const live = liveConditions(posts);
  if (!live.length) return [];
  return [
    { url: abs(CONDITIONS_BASE), ...dated(newest(live.flatMap((c) => postsForCondition(c, posts)))), changeFrequency: "weekly", priority: 0.8 },
    ...live.map((c) => ({
      url: abs(conditionPath(c.slug)),
      ...dated(newest(postsForCondition(c, posts))),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}

async function tools(): Promise<Entry[]> {
  const [canI, names] = await Promise.all([getCanIData(), getBabyNames()]);
  return [
    { url: abs(TOOLS_BASE), changeFrequency: "monthly", priority: 0.8 },
    ...TOOLS.filter((t) => t.available !== false).map((t) => ({ url: abs(toolPath(t.slug)), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...canI.entries.map((e) => ({ url: abs(safePath(e.id)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...allNamePages(names).map((p) => ({ url: abs(namesPath(namePageSlug(p))), changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}

async function pages(): Promise<Entry[]> {
  const [posts, categories] = await Promise.all([getAllPosts(), getCategories()]);
  const plain = ["/", ...stages.map((s) => `/${s.slug}`), "/ask-veda", "/fathers", "/about", "/partners", "/privacy", "/download", "/contact", "/experts"];
  return [
    ...plain.map((p) => ({ url: abs(p), changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.7 })),
    { url: abs(GUIDES_BASE), ...dated(newest(posts)), changeFrequency: "weekly", priority: 0.9 },
    ...categories.map((c) => ({
      url: abs(categoryPath(c.slug)),
      ...dated(newest(posts.filter((p) => p.category === c.slug))),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // Thin cluster lists are noindex until they fill up, so they stay out of here too.
    ...clustersWithPosts(posts, INDEX_MIN).map((c) => ({
      url: abs(clusterPath(c)),
      ...dated(newest(postsInCluster(c, posts))),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    { url: abs(MONTHS_HUB), changeFrequency: "monthly", priority: 0.7 },
    ...MONTH_RANGES.map((r) => ({ url: abs(monthPath(r.month)), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...AUTHORS.map((a) => ({
      url: abs(authorPath(a.slug)),
      ...dated(newest(posts.filter((p) => p.authorSlug === a.slug || p.reviewedBy === a.slug))),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    { url: abs(LEGAL_BASE), changeFrequency: "yearly", priority: 0.3 },
    ...LEGAL_PAGES.filter((p) => !p.draft).map((p) => ({ url: abs(legalPath(p.slug)), changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}

export const BUILDERS: Record<SitemapPart, () => Promise<Entry[]>> = { articles, hubs, tools, pages };

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export function urlsetXml(entries: Entry[]): string {
  const body = entries
    .map(
      (e) =>
        `<url><loc>${esc(e.url)}</loc>${e.lastModified ? `<lastmod>${esc(e.lastModified)}</lastmod>` : ""}<changefreq>${e.changeFrequency}</changefreq><priority>${e.priority}</priority></url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export async function indexXml(): Promise<string> {
  const parts = await Promise.all(
    SITEMAP_PARTS.map(async (part) => {
      const entries = await BUILDERS[part]();
      const last = entries.map((e) => e.lastModified).filter(Boolean).sort().at(-1);
      return `<sitemap><loc>${esc(`${site.domain}${sitemapPartPath(part)}`)}</loc>${last ? `<lastmod>${esc(last)}</lastmod>` : ""}</sitemap>`;
    })
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${parts.join("\n")}\n</sitemapindex>\n`;
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}

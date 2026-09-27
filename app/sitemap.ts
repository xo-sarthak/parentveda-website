import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { stages } from "@/lib/stages";
import { LEGAL_BASE, LEGAL_PAGES, legalPath } from "@/lib/legal";
import { GUIDES_BASE, categoryPath, getAllPosts, getCategories, postPath } from "@/lib/guides";
import { AUTHORS, authorPath } from "@/lib/authors";

// Refreshes every minute, so a post published in Directus is submitted within the minute.
export const revalidate = 60;

/* Every URL carries its trailing slash, the shape the pages' canonical tags
   use. Listing the slash-less form would submit addresses that only redirect. */
const abs = (path: string) => `${site.domain}${path.endsWith("/") ? path : `${path}/`}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [posts, categories] = await Promise.all([getAllPosts(), getCategories()]);

  const pages = ["/", ...stages.map((s) => `/${s.slug}`), "/ask-veda", "/fathers", "/about", "/partners", "/privacy", "/download", "/contact"];

  return [
    ...pages.map((p) => ({ url: abs(p), lastModified: now, changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.7 })),
    { url: abs(GUIDES_BASE), lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    ...categories.map((c) => ({ url: abs(categoryPath(c.slug)), lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...posts.map((p) => ({
      url: abs(p.canonicalPath ?? postPath(p.category, p.slug)),
      lastModified: p.updated ?? p.date ?? now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...AUTHORS.map((a) => ({ url: abs(authorPath(a.slug)), lastModified: now, changeFrequency: "yearly" as const, priority: 0.5 })),
    { url: abs(LEGAL_BASE), lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
    ...LEGAL_PAGES.map((p) => ({ url: abs(legalPath(p.slug)), lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}

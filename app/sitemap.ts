import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { stages } from "@/lib/stages";
import { getArticles } from "@/lib/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", ...stages.map((s) => `/${s.slug}`), "/ask-veda", "/fathers", "/about", "/partners", "/privacy", "/download", "/articles", "/contact"];
  const articles = getArticles().map((a) => ({
    url: `${site.domain}/articles/${a.slug}`,
    lastModified: a.date,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));
  return [
    ...pages.map((p) => ({ url: `${site.domain}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...articles,
  ];
}

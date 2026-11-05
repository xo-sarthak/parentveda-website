/* npm run links:amazon [-- --drafts]
   Lists every Amazon link in the content as reports/amazon-links.csv, search links
   first, so the content team can replace them with exact product links. */

import { fileURLToPath } from "node:url";
import config from "../lib/affiliate.json" with { type: "json" };
import { fetchPosts, markdownLinks, writeCsv } from "./lib/content.mjs";

const RANK = { search: 0, category: 1, short: 2, other: 3, product: 4 };

export function isAmazon(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return config.domains.some((d) => host === d || host.endsWith(`.${d}`));
  } catch {
    return false;
  }
}

export function classify(raw) {
  const url = new URL(raw);
  const host = url.hostname.toLowerCase();
  if (!config.taggable.some((d) => host === d || host.endsWith(`.${d}`))) return { type: "short", asin: "" };
  const product = url.pathname.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})(?:[/?]|$)/i);
  if (product) return { type: "product", asin: product[1].toUpperCase() };
  if (url.pathname === "/s" || url.pathname.startsWith("/s/") || url.searchParams.has("k")) return { type: "search", asin: "" };
  if (/^\/(b|gp\/browse|gp\/bestsellers|[^/]+\/b)(\/|$)/.test(url.pathname) || url.searchParams.has("node")) return { type: "category", asin: "" };
  return { type: "other", asin: "" };
}

export function amazonRows(posts) {
  return posts
    .flatMap((p) =>
      markdownLinks(p.body ?? "")
        .filter((l) => isAmazon(l.url))
        .map((l) => {
          const { type, asin } = classify(l.url);
          return [p.slug, l.text, type, asin, type === "short" ? "cannot be retagged: replace with a full link" : "", l.url];
        })
    )
    .sort((a, b) => RANK[a[2]] - RANK[b[2]] || a[0].localeCompare(b[0]));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const posts = await fetchPosts({ columns: "slug,title,category,tags,body", drafts: process.argv.includes("--drafts") });
  const rows = amazonRows(posts);
  const file = writeCsv("reports/amazon-links.csv", ["article_slug", "link_text", "link_type", "asin", "note", "url"], rows);
  console.log(`${rows.length} Amazon links across ${new Set(rows.map((r) => r[0])).size} of ${posts.length} articles: ${file}`);
}

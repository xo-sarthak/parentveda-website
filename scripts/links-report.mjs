/* npm run links:report
   One row per article: how it links to the rest of the site, and what could link
   to it, fewest inbound links first. For the content team to add links by hand;
   nothing here edits an article. Only article bodies are read, so the Read next
   block, nav and footer never count. */

import { fileURLToPath } from "node:url";
import { fetchPosts, markdownLinks, writeCsv } from "./lib/content.mjs";

const OLD_CATEGORY = { article: "articles", "research-summary": "research-summaries", "book-summary": "book-summaries", recipe: "recipes" };

/** A link's site-relative path without query, fragment or trailing slash, or null if it leaves the site. */
export function internalPath(raw) {
  if (raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:") || raw.startsWith("figure:")) return null;
  let url;
  try {
    url = new URL(raw, "https://parentveda.in");
  } catch {
    return null;
  }
  if (!/^(www\.)?parentveda\.in$/i.test(url.hostname)) return null;
  const clean = url.pathname.replace(/\/+$/, "") || "/";
  // Old addresses redirect to the current one, so they count as links to it.
  return clean.replace(/^\/(?:reads|guides)\/([^/]+)/, (_, c) => `/reads/${OLD_CATEGORY[c] ?? c}`);
}

const pathOf = (p) => (p.canonical_path ?? `/reads/${p.category}/${p.slug}`).replace(/\/+$/, "");

export function buildReport(posts) {
  const paths = new Map(posts.map((p) => [pathOf(p), p]));

  const outgoing = new Map(
    posts.map((p) => {
      const self = pathOf(p);
      const targets = markdownLinks(p.body ?? "")
        .map((l) => internalPath(l.url))
        .filter((t) => t && t !== self);
      return [self, targets];
    })
  );

  const inbound = new Map(posts.map((p) => [pathOf(p), new Set()]));
  for (const [from, targets] of outgoing) {
    for (const t of targets) if (paths.has(t)) inbound.get(t).add(from);
  }

  const rows = posts.map((p) => {
    const self = pathOf(p);
    const tags = new Set(p.tags ?? []);
    const suggestions = posts
      .filter((o) => pathOf(o) !== self && o.category === p.category && !inbound.get(self).has(pathOf(o)))
      .map((o) => ({ slug: o.slug, overlap: (o.tags ?? []).filter((t) => tags.has(t)).length, sameStage: o.stage === p.stage }))
      .filter((o) => o.overlap > 0)
      .sort((a, b) => b.overlap - a.overlap || Number(b.sameStage) - Number(a.sameStage) || a.slug.localeCompare(b.slug))
      .slice(0, 5)
      .map((o) => o.slug);
    return [p.slug, p.title, p.category, outgoing.get(self).length, inbound.get(self).size, suggestions.join(" | ")];
  });

  return rows.sort((a, b) => a[4] - b[4] || a[0].localeCompare(b[0]));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const posts = await fetchPosts({ columns: "slug,title,category,stage,tags,canonical_path,body" });
  const rows = buildReport(posts);
  const file = writeCsv(
    "reports/internal-links.csv",
    ["slug", "title", "section", "in_body_links_out", "articles_linking_in", "suggested_articles_to_link_from"],
    rows
  );
  console.log(`${rows.length} articles, ${rows.filter((r) => r[4] === 0).length} with no inbound links: ${file}`);
}

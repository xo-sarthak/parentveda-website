/* Cannibalisation check: which condition hubs aim at the same search as an
   existing article, so the team can decide which page leads.

   Hubs target "<condition> guide / support / what to do"; pillar articles keep
   the "what is" search. A hub "collides" with a published article when the
   hub's name, an alternate name or its slug is the article's slug, or starts
   its title. (The plan sheet's "Primary keyword" column is the real test; the
   article slug is written from it, so it stands in here.)

   Run: npm run check:hub-keywords
   Writes docs/website-upgrade/hub-keyword-check.csv */

import fs from "node:fs";
import { fetchPosts, writeCsv } from "./lib/content.mjs";

const norm = (s) => String(s).toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const conditions = fs
  .readdirSync("content/conditions")
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(`content/conditions/${f}`, "utf8")));
const posts = await fetchPosts({ columns: "slug,title,category,tags" });

const rows = [];
for (const c of conditions) {
  const names = [c.name, ...c.alternate_names, c.slug.replace(/-/g, " ")].map(norm).filter(Boolean);
  for (const p of posts) {
    const slug = norm(p.slug.replace(/-/g, " "));
    const title = norm(p.title);
    const hit = names.find((n) => slug === n || title.startsWith(n) || slug.startsWith(n));
    if (hit) rows.push([c.slug, c.name, c.tier, p.slug, p.title, hit, "decide which page leads; hub should target guide and support searches"]);
  }
}
const file = writeCsv("docs/website-upgrade/hub-keyword-check.csv", ["hub", "hub name", "tier", "article slug", "article title", "matched on", "action"], rows);
console.log(`${rows.length} possible overlaps across ${new Set(rows.map((r) => r[0])).size} hubs. Written to ${file}`);

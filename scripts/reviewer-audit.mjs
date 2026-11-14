/* Reviewer specialty check (a report only; it changes nothing).

   For every published article: who reviewed it, what that person's specialty
   is (lib/authors.ts `specialty`), what the article needs
   (content/article-meta.json `reviewer_specialty_required`, else the cluster
   default in content/specialties.json), and whether they match.

   Run: npm run audit:reviewers
   Writes docs/website-upgrade/reviewer-mismatch.csv */

import fs from "node:fs";
import { fetchPosts, writeCsv } from "./lib/content.mjs";
import { requiredFor, acceptedFor } from "./lib/specialties.mjs";

const { AUTHORS } = await import("../lib/authors.ts");
const META = JSON.parse(fs.readFileSync("content/article-meta.json", "utf8"));

const people = new Map(AUTHORS.map((a) => [a.slug, a]));
const posts = await fetchPosts({ columns: "slug,title,category,reviewed_by,tags" });

const rows = [];
let mismatches = 0;
for (const p of posts.sort((a, b) => a.slug.localeCompare(b.slug))) {
  const meta = META[p.slug] ?? {};
  const required = requiredFor(meta);
  const reviewer = p.reviewed_by ? people.get(p.reviewed_by) : undefined;
  const has = reviewer?.specialty ?? [];
  let mismatch;
  if (!required) mismatch = "n/a";
  else if (!reviewer) mismatch = "yes (no reviewer)";
  else mismatch = has.some((s) => acceptedFor(required, meta.cluster).includes(s)) ? "no" : "yes";
  if (mismatch.startsWith("yes")) mismatches++;
  rows.push([p.slug, p.title, meta.cluster ?? "", reviewer?.name ?? "", has.join("; "), required ?? "", mismatch]);
}

const file = writeCsv("docs/website-upgrade/reviewer-mismatch.csv", ["slug", "title", "cluster", "current reviewer", "reviewer specialty", "required specialty", "mismatch"], rows);
console.log(`${rows.length} articles, ${mismatches} mismatches. Written to ${file}`);

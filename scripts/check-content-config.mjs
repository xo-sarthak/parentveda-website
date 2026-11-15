/* Checks the website's data files agree with each other. No network.

   - every cluster slug is unique within its stage, and never equals a
     pregnancy month page (/pregnancy/month-by-month/, /pregnancy/1st-month/ ...)
   - every article-meta entry names a known cluster, condition and role
   - every condition names a known consult specialty, and its tool and
     download, when set, are planned or built
   - specialty names used anywhere are in content/specialties.json
   - no new copy uses an em dash or an en dash

   Run: npm run check:content */

import fs from "node:fs";

const read = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
const clusters = read("content/clusters.json");
const meta = read("content/article-meta.json");
const consults = read("content/consults.json");
const downloads = read("content/downloads.json");
const specialties = read("content/specialties.json").specialties;
const conditionFiles = fs.readdirSync("content/conditions").filter((f) => f.endsWith(".json"));
const conditions = conditionFiles.map((f) => read(`content/conditions/${f}`));
const indexSrc = fs.readFileSync("content/conditions/index.ts", "utf8");

// Tools that exist or are planned in Phase 3. Built ones are in lib/tools.ts.
const toolSrc = fs.readFileSync("lib/tools.ts", "utf8");
const builtTools = [...toolSrc.matchAll(/slug: "([a-z0-9-]+)"/g)].map((m) => m[1]);
const PLANNED_TOOLS = ["fertility-specialist-check", "semen-report-reader", "amh-reader", "thalassemia-couple-check", "screening-result-explainer", "afi-reader", "bp-log", "pregnancy-sugar-targets"];
const tools = new Set([...builtTools, ...PLANNED_TOOLS]);

const MONTH_PAGES = new Set(["month-by-month", ...Array.from({ length: 9 }, (_, i) => `${i + 1}${["st", "nd", "rd"][i] ?? "th"}-month`)]);
const ROLES = new Set(["pillar", "spoke", "hinglish", "tool-page", "commerce-hub", "checklist-hub"]);
const SENS = new Set(["low", "medium", "high"]);

const problems = [];
const bad = (m) => problems.push(m);

const seen = new Set();
for (const c of clusters) {
  const key = `${c.stage}/${c.slug}`;
  if (seen.has(key)) bad(`cluster slug used twice: /${key}/`);
  seen.add(key);
  if (c.stage === "pregnancy" && MONTH_PAGES.has(c.slug)) bad(`cluster ${c.name} would take the month page /pregnancy/${c.slug}/`);
  if (c.cta?.tool && !tools.has(c.cta.tool)) bad(`cluster ${c.name}: unknown tool ${c.cta.tool}`);
  if (c.cta?.consult && !consults[c.cta.consult]) bad(`cluster ${c.name}: unknown consult ${c.cta.consult}`);
}
const clusterNames = new Set(clusters.map((c) => c.name));
const conditionSlugs = new Set(conditions.map((c) => c.slug));

for (const [slug, m] of Object.entries(meta)) {
  if (m.cluster && !clusterNames.has(m.cluster)) bad(`${slug}: unknown cluster "${m.cluster}"`);
  if (m.condition && !conditionSlugs.has(m.condition)) bad(`${slug}: unknown condition ${m.condition}`);
  if (!ROLES.has(m.role)) bad(`${slug}: unknown role ${m.role}`);
  if (!SENS.has(m.sensitivity)) bad(`${slug}: unknown sensitivity ${m.sensitivity}`);
  if (m.reviewer_specialty_required && !specialties.includes(m.reviewer_specialty_required)) bad(`${slug}: unknown specialty ${m.reviewer_specialty_required}`);
  if (m.cta?.tool && !tools.has(m.cta.tool)) bad(`${slug}: unknown tool ${m.cta.tool}`);
  if (m.cta?.download && !downloads[m.cta.download]) bad(`${slug}: unknown download ${m.cta.download}`);
  if (m.cta?.consult && !consults[m.cta.consult]) bad(`${slug}: unknown consult ${m.cta.consult}`);
  for (const pair of [m.hinglish_pair, m.english_pair]) if (pair && !meta[pair]) bad(`${slug}: language pair ${pair} has no entry`);
}

for (const c of conditions) {
  if (!indexSrc.includes(`./${c.slug}.json`)) bad(`condition ${c.slug} is not listed in content/conditions/index.ts`);
  if (!consults[c.consult?.specialty]) bad(`condition ${c.slug}: unknown consult ${c.consult?.specialty}`);
  if (c.tool && !tools.has(c.tool)) bad(`condition ${c.slug}: unknown tool ${c.tool}`);
  if (c.download && !downloads[c.download]) bad(`condition ${c.slug}: unknown download ${c.download}`);
  if (!specialties.includes(c.reviewer_specialty_required)) bad(`condition ${c.slug}: unknown specialty ${c.reviewer_specialty_required}`);
  if (!SENS.has(c.sensitivity)) bad(`condition ${c.slug}: unknown sensitivity ${c.sensitivity}`);
}
for (const [slug, d] of Object.entries(downloads)) {
  for (const c of d.conditions) if (!conditionSlugs.has(c)) bad(`download ${slug}: unknown condition ${c}`);
  if (typeof d.reviewed !== "boolean") bad(`download ${slug}: reviewed must be true or false`);
  if (d.file && d.file !== `/downloads/${slug}/`) bad(`download ${slug}: file should be /downloads/${slug}/`);
  if (d.file && !fs.existsSync(`content/downloads/${slug}.pdf`)) console.warn(`  note: content/downloads/${slug}.pdf not rendered yet`);
}

const DASH = /[–—]/;
for (const f of ["content/clusters.json", "content/article-meta.json", "content/consults.json", "content/downloads.json", ...conditionFiles.map((f) => `content/conditions/${f}`)]) {
  if (DASH.test(fs.readFileSync(f, "utf8"))) bad(`${f}: contains an em or en dash`);
}

console.log(`${clusters.length} clusters, ${Object.keys(meta).length} article entries, ${conditions.length} conditions, ${Object.keys(consults).length} consults, ${Object.keys(downloads).length} downloads.`);
if (problems.length) {
  console.error(`${problems.length} problems:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log("Content config is consistent.");

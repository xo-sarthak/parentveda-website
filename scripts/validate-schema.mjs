/* Structured data check.

   Builds the site (skip with --no-build), reads the prerendered HTML in
   .next/server/app, pulls out every <script type="application/ld+json">, and
   checks the fields Google needs for each type we emit. Exits 1 on any error.

   Sample: every article, every condition hub, every top-level tool page, the
   cluster lists, the home page and the author pages.

   Note: Google shows FAQ rich results only for a few authoritative sites. Our
   FAQPage markup helps search understand the page; it is not a promise of a
   snippet.

   Run: npm run validate:schema   (or npm run validate:schema -- --no-build) */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(".next/server/app");

if (!process.argv.includes("--no-build")) {
  const r = spawnSync("npm", ["run", "build"], { stdio: "inherit", shell: true });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
if (!fs.existsSync(ROOT)) {
  console.error("No build output. Run without --no-build first.");
  process.exit(1);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : d.name.endsWith(".html") ? [p] : [];
  });
}

const rel = (f) => "/" + path.relative(ROOT, f).replace(/\\/g, "/").replace(/\.html$/, "").replace(/^index$/, "");
const SAMPLE = [
  /^\/$/,
  /^\/reads\/[^/]+\/[^/]+$/,
  /^\/conditions(\/[^/]+)?$/,
  /^\/tools\/[^/]+$/,
  /^\/(trying-to-conceive|pregnancy|parenting)\/[^/]+$/,
  /^\/reads\/authors\/[^/]+$/,
];
const files = walk(ROOT).filter((f) => {
  const r = rel(f);
  if (fs.existsSync(f.replace(/\.html$/, ".meta"))) {
    const meta = JSON.parse(fs.readFileSync(f.replace(/\.html$/, ".meta"), "utf8"));
    if (meta.status && meta.status !== 200) return false; // a cached 404
  }
  return SAMPLE.some((re) => re.test(r)) && !/^\/reads\/[^/]+\/page$/.test(r);
});

const errors = [];
const counts = {};
const fail = (page, type, msg) => errors.push(`${page}  [${type}] ${msg}`);
const isAbs = (u) => typeof u === "string" && /^https:\/\//.test(u);
const has = (o, k) => o != null && o[k] != null && o[k] !== "" && !(Array.isArray(o[k]) && !o[k].length);
const DATE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2}|Z))?$/;

function checkPerson(page, type, p, label) {
  if (!p || p["@type"] !== "Person") return fail(page, type, `${label} is not a Person`);
  if (!has(p, "name")) fail(page, type, `${label}.name missing`);
  if (!isAbs(p.url)) fail(page, type, `${label}.url not absolute`);
}

function checkNode(page, node) {
  const types = [].concat(node["@type"] ?? []);
  for (const t of types) counts[t] = (counts[t] ?? 0) + 1;
  const type = types.join("+");

  if (types.includes("Article") || types.includes("MedicalWebPage")) {
    for (const k of ["headline", "description", "datePublished", "dateModified", "image", "author", "publisher", "mainEntityOfPage"]) {
      if (!has(node, k)) fail(page, type, `${k} missing`);
    }
    for (const k of ["datePublished", "dateModified"]) if (node[k] && !DATE.test(node[k])) fail(page, type, `${k} not ISO: ${node[k]}`);
    if (node.headline && node.headline.length > 110) fail(page, type, `headline over 110 characters`);
    checkPerson(page, type, node.author, "author");
    if (!has(node.publisher, "name") || !has(node.publisher, "logo")) fail(page, type, "publisher name or logo missing");
    if (types.includes("MedicalWebPage")) {
      checkPerson(page, type, node.reviewedBy, "reviewedBy");
      if (!has(node, "lastReviewed") || !DATE.test(node.lastReviewed)) fail(page, type, "lastReviewed missing or not a date");
    }
    if (node.about) checkNode(page, node.about);
  }
  if (types.includes("MedicalCondition")) {
    if (!has(node, "name")) fail(page, type, "name missing");
    for (const s of node.relevantSpecialty ?? []) if (!/^https:\/\/schema\.org\/[A-Z]\w+$/.test(s)) fail(page, type, `relevantSpecialty not a schema.org value: ${s}`);
  }
  if (types.includes("FAQPage")) {
    if (!Array.isArray(node.mainEntity) || !node.mainEntity.length) fail(page, type, "mainEntity empty");
    for (const q of node.mainEntity ?? []) {
      if (q["@type"] !== "Question" || !has(q, "name")) fail(page, type, "a Question has no name");
      if (!has(q.acceptedAnswer, "text")) fail(page, type, `no answer text for "${q.name}"`);
    }
  }
  if (types.includes("BreadcrumbList")) {
    const items = node.itemListElement ?? [];
    if (!items.length) fail(page, type, "no items");
    items.forEach((it, i) => {
      if (it.position !== i + 1) fail(page, type, `position ${it.position} at index ${i}`);
      if (!has(it, "name") || !isAbs(it.item)) fail(page, type, `item ${i + 1} needs a name and an absolute URL`);
    });
  }
  if (types.includes("WebApplication")) {
    for (const k of ["name", "url", "applicationCategory", "offers"]) if (!has(node, k)) fail(page, type, `${k} missing`);
  }
  if (types.includes("Person") && page.startsWith("/reads/authors/")) {
    if (!has(node, "name") || !has(node, "jobTitle")) fail(page, type, "name or jobTitle missing");
  }
  if (node["@graph"]) node["@graph"].forEach((n) => checkNode(page, n));
}

let blocks = 0;
for (const f of files) {
  const page = rel(f);
  const html = fs.readFileSync(f, "utf8");
  const found = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!found.length && /^\/(reads\/[^/]+\/|tools\/|conditions)/.test(page)) fail(page, "-", "no JSON-LD on the page");
  for (const m of found) {
    blocks++;
    let data;
    try {
      data = JSON.parse(m[1]);
    } catch (e) {
      fail(page, "-", `invalid JSON: ${e.message}`);
      continue;
    }
    for (const node of [].concat(data)) checkNode(page, node);
  }
}

console.log(`Checked ${files.length} pages, ${blocks} JSON-LD blocks.`);
console.log(Object.entries(counts).map(([k, v]) => `  ${k}: ${v}`).join("\n"));
if (errors.length) {
  console.error(`\n${errors.length} problems:\n${errors.join("\n")}`);
  process.exit(1);
}
console.log("All structured data passed.");

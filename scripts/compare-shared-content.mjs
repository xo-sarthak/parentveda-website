/* npm run content:compare
   Compares the shared tables with the JSON files the site used before them, so the
   JSON can be deleted knowing nothing was lost. Read-only. Uses the public anon key,
   so it sees exactly what a visitor sees.

   Expected differences, listed so they are not mistaken for a loss:
   - vaccines: the tables spell out the standard reactions and red flags the JSON left
     to a default in VaccineInfo.tsx. The app's red flags say "face/lips" and
     "floppiness/drowsiness" where the default said "face or lips" and "floppiness or
     drowsiness". vitk is in the table and stays off the site.
   - baby_names: some hand-written names carry the app's popularity, where the JSON
     used "C" for all of them.
   - Is it safe chips: 12 from popular_sort, the old 6 among them. */

import { readFileSync } from "node:fs";

const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!base || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are needed. Add them to .env.local.");
  process.exit(1);
}

const json = (file) => JSON.parse(readFileSync(new URL(`../lib/${file}`, import.meta.url), "utf8"));

async function all(table, columns, order) {
  const rows = [];
  for (;;) {
    const res = await fetch(`${base}/rest/v1/${table}?select=${columns}&status=eq.published&order=${order}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: "count=exact", Range: `${rows.length}-${rows.length + 999}` },
    });
    if (!res.ok) throw new Error(`${table}: ${res.status} ${await res.text()}`);
    const page = await res.json();
    rows.push(...page);
    const total = Number(res.headers.get("content-range")?.split("/")[1]);
    if (rows.length >= total) return rows;
    if (!page.length) throw new Error(`${table}: stopped at ${rows.length} of ${total}`);
  }
}

function report(title, before, after, id, fields) {
  const a = new Map(before.map((x) => [id(x), x]));
  const b = new Map(after.map((x) => [id(x), x]));
  const onlyBefore = [...a.keys()].filter((k) => !b.has(k));
  const onlyAfter = [...b.keys()].filter((k) => !a.has(k));
  console.log(`\n${title}: JSON ${a.size}, table ${b.size}`);
  console.log(`  only in JSON: ${onlyBefore.join(", ") || "none"}`);
  console.log(`  only in table: ${onlyAfter.join(", ") || "none"}`);
  for (const [name, get] of Object.entries(fields)) {
    const diff = [...a.keys()].filter((k) => b.has(k) && JSON.stringify(get(a.get(k))) !== JSON.stringify(get(b.get(k))));
    const eg = diff[0] ? ` e.g. ${diff[0]}: ${JSON.stringify(get(a.get(diff[0])))?.slice(0, 90)} -> ${JSON.stringify(get(b.get(diff[0])))?.slice(0, 90)}` : "";
    console.log(`  ${name}: ${diff.length} differ${eg}`);
  }
}

const blank = (x) => x || "";

/* Is it safe */
const entries = await all("can_i_entries", "id,name_en,category,verdict,short_en,why_en,t1_en,t2_en,t3_en,indian_en,related,aliases", "sort,id");
report(
  "Is it safe",
  json("can-i.json"),
  entries.map((r) => ({ id: r.id, name: r.name_en, cat: r.category, verdict: r.verdict, short: r.short_en, why: r.why_en, t1: r.t1_en, t2: r.t2_en, t3: r.t3_en, indian: r.indian_en, related: r.related, aliases: r.aliases })),
  (x) => x.id,
  {
    name: (x) => x.name,
    type: (x) => x.cat,
    verdict: (x) => x.verdict,
    short: (x) => x.short,
    why: (x) => x.why,
    t1: (x) => blank(x.t1),
    t2: (x) => blank(x.t2),
    t3: (x) => blank(x.t3),
    indian: (x) => blank(x.indian),
    related: (x) => x.related ?? [],
    aliases: (x) => x.aliases ?? [],
  },
);

/* Baby names */
const GENDER = { girl: "g", boy: "b", unisex: "u" };
const POP = { Trending: "T", Classic: "C", Rare: "R" };
const names = await all("baby_names", "name,script,gender,meaning,community,origin,popularity", "sort,name");
const namesBefore = json("baby-names.json");
report(
  "Baby names",
  namesBefore,
  names.map((r) => [r.name, r.script, GENDER[r.gender], r.meaning, r.community, r.origin, POP[r.popularity]]),
  (x) => x[0],
  { script: (x) => x[1], gender: (x) => x[2], meaning: (x) => x[3], community: (x) => x[4], origin: (x) => x[5], popularity: (x) => x[6] },
);

/* Vaccines. Reactions and red flags left out of the JSON meant VaccineInfo's defaults. */
const REACTIONS = ["Mild soreness or redness where the shot was given", "A low-grade fever for a day or two", "Being a little more sleepy or fussy than usual"];
const RED_FLAGS = ["Difficult or noisy breathing, or swelling of the face or lips", "A seizure, or unusual floppiness or drowsiness", "A high fever that won't settle, or a rash with vomiting"];
const vaccines = await all("vaccines", "id,name,protects,why,diseases,reactions,red_flags,myths,faqs", "sort,id");
report(
  "Vaccines",
  json("vaccine-info.json").map((v) => ({ ...v, reactions: v.reactions ?? REACTIONS, redFlags: v.redFlags ?? RED_FLAGS, myths: v.myths ?? [], faqs: v.faqs ?? [] })),
  vaccines.map((v) => ({
    ...v,
    reactions: v.reactions.map((x) => x.text),
    redFlags: v.red_flags.map((x) => x.text),
    myths: v.myths.map((x) => [x.q, x.a]),
    faqs: v.faqs.map((x) => [x.q, x.a]),
  })),
  (x) => x.id,
  {
    name: (x) => x.name,
    protects: (x) => x.protects,
    why: (x) => x.why,
    diseases: (x) => x.diseases,
    reactions: (x) => x.reactions,
    "red flags": (x) => x.redFlags,
    myths: (x) => x.myths,
    faqs: (x) => x.faqs,
  },
);

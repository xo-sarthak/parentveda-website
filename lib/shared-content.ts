/* ============================================================
   Shared content: Is it safe, baby names and vaccine Learn Why.

   The app and this site read the same Supabase tables (app migration 0165), and
   both are edited in Directus. Server-side only: a page fetches here and hands the
   rows to its component as props, so the JSON files never reach a browser bundle.

   PAGING. PostgREST stops a select at 1,000 rows and still answers 200, and
   baby_names has 2,040. So fetchAll pages until it reaches the server's own count,
   and treats anything less as a failure. A limit nobody chose fails by looking like
   success, so a short response is never taken to mean "that is all".

   FALLBACK. A failed read serves the JSON the site shipped before, rather than an
   empty tool. The cost is that a failure is quiet to a reader, so it is logged. The
   JSON goes once `npm run content:compare` has confirmed the tables, and then this
   file should show an empty state instead.

   Only the English columns are selected. The Hindi ones would double the payload
   and the site does not show them, and Next's data cache refuses anything over 2 MB
   per item.
   ============================================================ */

import { supabase } from "@/lib/supabase";
import { CAN_I_GROUPS, CAN_I_POPULAR, type CanI, type CanIData, type Category, type Verdict } from "@/lib/safe-in-pregnancy";
import type { NameRow } from "@/lib/baby-names";
import CAN_I_JSON from "./can-i.json";
import NAMES_JSON from "./baby-names.json";
import VACCINES_JSON from "./vaccine-info.json";

const PAGE = 1000;

async function fetchAll<T>(table: string, columns: string, order: string[]): Promise<T[]> {
  if (!supabase) throw new Error("Supabase is not configured");
  const rows: T[] = [];
  for (;;) {
    let query = supabase.from(table).select(columns, { count: "exact" }).eq("status", "published");
    for (const column of order) query = query.order(column);
    const { data, error, count } = await query.range(rows.length, rows.length + PAGE - 1);
    if (error) throw new Error(`${table}: ${error.message}`);
    if (count === null) throw new Error(`${table}: the server gave no count`);
    if (count === 0) throw new Error(`${table}: no published rows`);
    const page = (data ?? []) as unknown as T[];
    rows.push(...page);
    if (rows.length >= count) return rows;
    if (page.length === 0) throw new Error(`${table}: stopped at ${rows.length} of ${count}`);
  }
}

async function orFallback<T>(what: string, read: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await read();
  } catch (err) {
    console.error(`[shared-content] showing the bundled ${what}:`, err);
    return fallback();
  }
}

/* ---------- Is it safe ---------- */

type EntryRow = {
  id: string;
  name_en: string;
  category: Category;
  verdict: Verdict;
  short_en: string;
  why_en: string;
  t1_en: string | null;
  t2_en: string | null;
  t3_en: string | null;
  indian_en: string | null;
  related: string[] | null;
  aliases: string[] | null;
  group_id: string | null;
  group_sort: number | null;
  popular_sort: number | null;
};
type GroupRow = { id: string; label: string };

const ENTRY_COLUMNS = "id,name_en,category,verdict,short_en,why_en,t1_en,t2_en,t3_en,indian_en,related,aliases,group_id,group_sort,popular_sort";

const toEntry = (r: EntryRow): CanI => ({
  id: r.id,
  name: r.name_en,
  cat: r.category,
  verdict: r.verdict,
  short: r.short_en,
  why: r.why_en,
  t1: r.t1_en || undefined,
  t2: r.t2_en || undefined,
  t3: r.t3_en || undefined,
  indian: r.indian_en || undefined,
  related: r.related ?? [],
  aliases: r.aliases ?? [],
});

const bySlot = (a: number | null, b: number | null) => (a ?? Number.MAX_SAFE_INTEGER) - (b ?? Number.MAX_SAFE_INTEGER);

export function getCanIData(): Promise<CanIData> {
  return orFallback(
    "Is it safe answers",
    async () => {
      const [rows, groups] = await Promise.all([
        fetchAll<EntryRow>("can_i_entries", ENTRY_COLUMNS, ["sort", "id"]),
        fetchAll<GroupRow>("can_i_groups", "id,label", ["sort", "id"]),
      ]);
      return {
        entries: rows.map(toEntry),
        groups: groups.map((g): [string, string[]] => [
          g.label,
          rows
            .filter((r) => r.group_id === g.id)
            .sort((a, b) => bySlot(a.group_sort, b.group_sort))
            .map((r) => r.id),
        ]),
        popular: rows
          .filter((r) => r.popular_sort !== null)
          .sort((a, b) => bySlot(a.popular_sort, b.popular_sort))
          .map((r) => r.id),
      };
    },
    () => ({ entries: CAN_I_JSON as CanI[], groups: CAN_I_GROUPS, popular: CAN_I_POPULAR }),
  );
}

/* ---------- Baby names ---------- */

type BabyNameRow = {
  name: string;
  script: string;
  gender: "girl" | "boy" | "unisex";
  meaning: string;
  community: string;
  origin: string;
  popularity: "Trending" | "Classic" | "Rare";
};

const GENDER = { girl: "g", boy: "b", unisex: "u" } as const;
const POPULARITY = { Trending: "T", Classic: "C", Rare: "R" } as const;

export function getBabyNames(): Promise<NameRow[]> {
  return orFallback(
    "baby names",
    async () =>
      (await fetchAll<BabyNameRow>("baby_names", "name,script,gender,meaning,community,origin,popularity", ["sort", "name"])).map(
        (r): NameRow => [r.name, r.script, GENDER[r.gender], r.meaning, r.community, r.origin, POPULARITY[r.popularity]],
      ),
    () => NAMES_JSON as NameRow[],
  );
}

/* ---------- Vaccines ---------- */

export type VaccineInfoRow = {
  id: string;
  name: string;
  protects: string;
  diseases: string[];
  why: string;
  reactions?: string[];
  myths?: [string, string][];
  faqs?: [string, string][];
  redFlags?: string[];
};

type VaccineRow = {
  id: string;
  name: string;
  protects: string;
  why: string;
  diseases: string[] | null;
  reactions: { text: string }[] | null;
  red_flags: { text: string }[] | null;
  myths: { q: string; a: string }[] | null;
  faqs: { q: string; a: string }[] | null;
};

/* Vitamin K is in the app's vaccine list and has never been on the site, whose
   schedule has no row for it. Hiding it here keeps the row published for the app. */
const NOT_ON_THE_SITE = new Set(["vitk"]);

const texts = (list: { text: string }[] | null) => (list?.length ? list.map((x) => x.text) : undefined);
const pairs = (list: { q: string; a: string }[] | null) => (list ?? []).map((x): [string, string] => [x.q, x.a]);

export function getVaccineInfo(): Promise<VaccineInfoRow[]> {
  return orFallback(
    "vaccine text",
    async () =>
      (await fetchAll<VaccineRow>("vaccines", "id,name,protects,why,diseases,reactions,red_flags,myths,faqs", ["sort", "id"]))
        .filter((v) => !NOT_ON_THE_SITE.has(v.id))
        .map((v) => ({
          id: v.id,
          name: v.name,
          protects: v.protects,
          why: v.why,
          diseases: v.diseases ?? [],
          reactions: texts(v.reactions),
          redFlags: texts(v.red_flags),
          myths: pairs(v.myths),
          faqs: pairs(v.faqs),
        })),
    () => VACCINES_JSON as unknown as VaccineInfoRow[],
  );
}

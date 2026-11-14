/* Types for /tools/baby-names/. The names come from the baby_names table, which the
   app's Name Finder reads too, and are edited in Directus: see lib/shared-content.ts.
   This file is also imported by the browser component, so it must not import the JSON.
   Row: [name, Devanagari, "g" | "b" | "u", meaning, community, origin, "T" | "C" | "R"]. */

export type NameRow = [string, string, "g" | "b" | "u", string, string, string, "T" | "C" | "R"];

/** Communities in the list, most names first. */
export function communitiesOf(names: NameRow[]): string[] {
  const counts = new Map<string, number>();
  for (const n of names) counts.set(n[4], (counts.get(n[4]) ?? 0) + 1);
  return [...counts.keys()].sort((a, b) => counts.get(b)! - counts.get(a)!);
}

/* ---------- Browse pages: /tools/baby-names/<slug>/ ----------
   girl-names-starting-with-a, boy-names-starting-with-a, names-starting-with-a,
   and hindu-girl-names, muslim-boy-names and so on. Unisex names count as both. */

export const NAMES_BASE = "/tools/baby-names";

export type NameGender = "girl" | "boy" | "all";
export type NamePage =
  | { kind: "letter"; gender: NameGender; letter: string }
  | { kind: "community"; gender: Exclude<NameGender, "all">; community: string };

/** Fewer names than this and a page would be too thin to be worth a search result. */
export const MIN_NAMES = 8;
export const PAGE_COMMUNITIES = ["Hindu", "Muslim", "Sikh", "Christian"];

export const namesPath = (slug: string) => `${NAMES_BASE}/${slug}/`;

export function namePageSlug(p: NamePage): string {
  if (p.kind === "community") return `${p.community.toLowerCase()}-${p.gender}-names`;
  return `${p.gender === "all" ? "" : `${p.gender}-`}names-starting-with-${p.letter.toLowerCase()}`;
}

export function parseNamePage(slug: string): NamePage | null {
  let m = /^(?:(girl|boy)-)?names-starting-with-([a-z])$/.exec(slug);
  if (m) return { kind: "letter", gender: (m[1] as NameGender | undefined) ?? "all", letter: m[2].toUpperCase() };
  m = /^([a-z]+)-(girl|boy)-names$/.exec(slug);
  if (m) {
    const community = PAGE_COMMUNITIES.find((c) => c.toLowerCase() === m![1]);
    if (community) return { kind: "community", gender: m[2] as "girl" | "boy", community };
  }
  return null;
}

const fits = (g: NameRow[2], gender: NameGender) => gender === "all" || g === "u" || g === (gender === "girl" ? "g" : "b");

/** The names on a browse page, A to Z. */
export function namesFor(p: NamePage, names: NameRow[]): NameRow[] {
  return names
    .filter((n) =>
      p.kind === "letter" ? n[0].toUpperCase().startsWith(p.letter) && fits(n[2], p.gender) : n[4] === p.community && fits(n[2], p.gender)
    )
    .sort((a, b) => a[0].localeCompare(b[0]));
}

/** Every browse page with enough names to stand on its own. */
export function allNamePages(names: NameRow[]): NamePage[] {
  const pages: NamePage[] = [];
  for (const letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
    for (const gender of ["all", "girl", "boy"] as const) {
      const p: NamePage = { kind: "letter", gender, letter };
      if (namesFor(p, names).length >= MIN_NAMES) pages.push(p);
    }
  }
  for (const community of PAGE_COMMUNITIES) {
    for (const gender of ["girl", "boy"] as const) {
      const p: NamePage = { kind: "community", gender, community };
      if (namesFor(p, names).length >= MIN_NAMES) pages.push(p);
    }
  }
  return pages;
}

export function namePageTitle(p: NamePage): string {
  const who = p.gender === "girl" ? "Baby girl names" : p.gender === "boy" ? "Baby boy names" : "Baby names";
  return p.kind === "letter" ? `${who} starting with ${p.letter}` : `${p.community} ${who.toLowerCase()}`;
}

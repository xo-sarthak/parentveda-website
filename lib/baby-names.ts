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

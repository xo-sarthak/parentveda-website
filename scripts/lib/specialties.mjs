/* Which reviewer specialties an article needs. Shared by the reviewer audit
   and the content-health page's build-time data. Rules in content/specialties.json. */

import fs from "node:fs";
import path from "node:path";

const RULES = JSON.parse(fs.readFileSync(path.resolve("content/specialties.json"), "utf8"));

function clusterDefault(cluster) {
  if (!cluster) return undefined;
  // Longest matching prefix wins: "TTC > His side" before "TTC".
  return [...RULES.cluster_defaults].sort((a, b) => b.prefix.length - a.prefix.length).find((d) => cluster.startsWith(d.prefix));
}

/** The specialty an article needs: its own field, else its cluster's default. */
export function requiredFor(meta) {
  return meta.reviewer_specialty_required ?? clusterDefault(meta.cluster)?.required ?? null;
}

/** Every reviewer specialty that satisfies `required` for an article in `cluster`. */
export function acceptedFor(required, cluster) {
  const d = clusterDefault(cluster);
  return [...new Set([required, ...(RULES.also_accepts[required] ?? []), ...(d && d.required === required ? d.also : [])])];
}

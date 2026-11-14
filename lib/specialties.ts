/* Which reviewer specialties an article needs, from content/specialties.json.
   The same rules as scripts/lib/specialties.mjs (the reviewer audit), which
   cannot import TypeScript; change both together. */

import RULES from "@/content/specialties.json";

type Default = { prefix: string; required: string; also: string[] };
const DEFAULTS = [...(RULES.cluster_defaults as Default[])].sort((a, b) => b.prefix.length - a.prefix.length);
const ALSO = RULES.also_accepts as Record<string, string[]>;

function clusterDefault(cluster: string | null): Default | undefined {
  return cluster ? DEFAULTS.find((d) => cluster.startsWith(d.prefix)) : undefined;
}

export function requiredFor(meta: { reviewer_specialty_required: string | null; cluster: string | null }): string | null {
  return meta.reviewer_specialty_required ?? clusterDefault(meta.cluster)?.required ?? null;
}

export function acceptedFor(required: string, cluster: string | null): string[] {
  const d = clusterDefault(cluster);
  return [...new Set([required, ...(ALSO[required] ?? []), ...(d && d.required === required ? d.also : [])])];
}

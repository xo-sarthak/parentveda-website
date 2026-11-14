/* ============================================================
   Condition downloads (the plan's downloads.config): content/downloads.json.

   A card shows only when its PDF exists (`file` is set) AND the lead form has
   somewhere to send to (LEADS_WEBHOOK_URL). `file` is a path under /public,
   e.g. "/downloads/bp-log-sheet.pdf", or a full https URL in storage.
   ============================================================ */

import DATA from "@/content/downloads.json";

export type Download = {
  slug: string;
  title: string;
  /** One line on why it is worth having. */
  value: string;
  file: string | null;
  conditions: string[];
  gate: "whatsapp" | "email";
};

export const DOWNLOADS: Download[] = Object.entries(DATA as Record<string, Omit<Download, "slug">>).map(
  ([slug, d]) => ({ slug, ...d })
);

export function downloadsEnabled(): boolean {
  return Boolean(process.env.LEADS_WEBHOOK_URL);
}

export function getDownload(slug?: string | null): Download | undefined {
  if (!slug || !downloadsEnabled()) return undefined;
  const d = DOWNLOADS.find((x) => x.slug === slug);
  return d?.file ? d : undefined;
}

export function findDownload(slug?: string | null): Download | undefined {
  return slug ? DOWNLOADS.find((x) => x.slug === slug) : undefined;
}

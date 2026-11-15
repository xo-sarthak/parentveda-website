/* ============================================================
   Condition downloads (the plan's downloads.config): content/downloads.json.

   A card shows only when all three hold:
   - the PDF exists: content/downloads/<slug>.pdf (rendered from
     content/downloads/src by `node content/downloads/src/render.mjs`);
   - it is medically reviewed (`reviewed: true`), or this deploy shows
     unreviewed drafts (preview, dev; see lib/review-gate.ts);
   - the lead form has somewhere to send to (LEADS_ENABLED=1, lib/lead-store.ts).

   The PDFs are not in /public: app/downloads/[slug]/route.ts serves each one
   under the same review gate, so a draft is never reachable on the live site.
   ============================================================ */

import { existsSync } from "node:fs";
import path from "node:path";
import DATA from "@/content/downloads.json";
import { canShow } from "@/lib/review-gate";
import { leadsEnabled } from "@/lib/lead-store";

export type Download = {
  slug: string;
  title: string;
  /** One line on why it is worth having. */
  value: string;
  /** The URL the reader gets after the form: /downloads/<slug>/. */
  file: string | null;
  conditions: string[];
  gate: "whatsapp" | "email";
  /** MEDICAL-REVIEW: true only after a doctor has checked the PDF. */
  reviewed: boolean;
};

export const DOWNLOADS: Download[] = Object.entries(DATA as Record<string, Omit<Download, "slug">>).map(
  ([slug, d]) => ({ slug, ...d })
);

export function downloadsEnabled(): boolean {
  return leadsEnabled();
}

export function pdfPath(slug: string): string {
  return path.join(process.cwd(), "content", "downloads", `${slug}.pdf`);
}

/** Exists, may be shown on this deploy, and has a file. Ignores the webhook. */
export function servableDownload(slug?: string | null): Download | undefined {
  const d = findDownload(slug);
  return d?.file && canShow(d.reviewed) && existsSync(pdfPath(d.slug)) ? d : undefined;
}

export function getDownload(slug?: string | null): Download | undefined {
  return downloadsEnabled() ? servableDownload(slug) : undefined;
}

/** The plain shape the client DownloadCard takes. The file path stays on the
    server until the form is sent. */
export function downloadView(d: Download) {
  return { slug: d.slug, title: d.title, value: d.value, gate: d.gate };
}

export function findDownload(slug?: string | null): Download | undefined {
  return slug ? DOWNLOADS.find((x) => x.slug === slug) : undefined;
}

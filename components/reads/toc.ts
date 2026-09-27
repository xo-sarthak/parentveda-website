import { headingSlug } from "@/lib/headings";

/* Carried over from the old site's Toc.tsx: H2 headings pulled out of the
   Markdown body in document order, with ids assigned by the same counter
   PostBody uses to stamp each <h2>, so a contents link can never be a dead
   jump. Only headings below a [TOC] marker are listed when one exists. */

export type TocItem = { text: string; id: string };

export function tocItems(body: string): TocItem[] {
  const items: TocItem[] = [];
  const used = new Map<string, number>();
  let past = false;

  const lines = body.split("\n");
  const hasMarker = lines.some((l) => /^\[toc\]$/i.test(l.trim()));

  for (const line of lines) {
    if (/^\[toc\]$/i.test(line.trim())) {
      past = true;
      continue;
    }
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (!m) continue; // "###" fails this on purpose: H2 only.
    const text = m[1].replace(/[*_`]/g, "").trim();
    if (!text) continue;
    const base = headingSlug(text);
    const n = (used.get(base) ?? 0) + 1;
    used.set(base, n);
    const id = n === 1 ? base : `${base}-${n}`;
    if (!hasMarker || past) items.push({ text, id });
  }
  return items;
}

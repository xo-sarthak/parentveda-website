/* ============================================================
   Article helpers, carried over from the old site's article page: lifting the
   FAQ section into an accordion, dates and text. The structured data built
   from them is in lib/jsonld.ts.
   ============================================================ */

export type Faq = { q: string; a: string };

/**
 * Lift the FAQ section out of the Markdown so it can render as an accordion.
 *
 * Returns the body with that section removed, plus its heading, the
 * question/answer pairs with their answers left as raw Markdown (so links,
 * lists and emphasis inside an answer still render), and any `trailing`
 * content that followed the last question.
 *
 * That last part matters: in this article the medical disclaimer is a
 * `> Note:` callout sitting after the final question with no heading between
 * them. Treated naively it becomes part of the last answer — which would bury
 * a medical disclaimer inside a collapsed panel. Callouts are article
 * furniture, never answer content, so one starting after a question ends the
 * FAQ and everything from there is returned to be rendered in the open.
 */
export function splitFaqSection(md: string): {
  body: string;
  title: string | null;
  faqs: Faq[];
  trailing: string;
} {
  const lines = md.split("\n");
  const isFaqHeading = (line: string) => {
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (!m) return false;
    return /common questions|frequently asked|faqs?$/i.test(m[1].replace(/[*_`]/g, "").trim());
  };

  const start = lines.findIndex(isFaqHeading);
  if (start === -1) return { body: md, title: null, faqs: [], trailing: "" };

  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) {
      end = i;
      break;
    }
  }

  const title = lines[start].replace(/^##\s+/, "").replace(/[*_`]/g, "").trim();
  const faqs: Faq[] = [];
  let q: string | null = null;
  let a: string[] = [];
  const flush = () => {
    const answer = a.join("\n").trim();
    if (q && answer) faqs.push({ q, a: answer });
    q = null;
    a = [];
  };

  const trailing: string[] = [];
  let inTrailing = false;

  for (const line of lines.slice(start + 1, end)) {
    if (inTrailing) {
      trailing.push(line);
      continue;
    }

    // A callout opening after a question closes the FAQ — see the note above.
    if (q && /^>\s*(note|important|insight):/i.test(line.trim())) {
      flush();
      inTrailing = true;
      trailing.push(line);
      continue;
    }

    const m = /^###\s+(.+?)\s*$/.exec(line);
    if (m) {
      flush();
      q = m[1].replace(/[*_`]/g, "").trim();
      continue;
    }
    if (q) a.push(line);
  }
  flush();

  return {
    body: [...lines.slice(0, start), ...lines.slice(end)].join("\n"),
    title,
    faqs,
    trailing: trailing.join("\n").trim(),
  };
}

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function isoMinutes(human?: string): string | undefined {
  if (!human) return undefined;
  const m = human.match(/(\d+)/);
  return m ? `PT${m[1]}M` : undefined;
}

/* JSON-LD wants the answer as plain text. The body is Markdown now, so strip
   the syntax rather than walking Block[]. */
export function markdownToText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^>\s?note:.*$/gim, " ") // callouts (the disclaimer) aren't the answer
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[>\-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}


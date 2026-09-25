import fs from "node:fs";
import path from "node:path";
import { Marked } from "marked";
import type { StageSlug } from "./stages";

// Articles are plain Markdown files in content/articles/.
// To publish one, add a file — the index, the stage filter, the table of
// contents, reading time and the sitemap all pick it up at build time.
//
// Front matter (one `key: value` per line):
//   title, description, standfirst (optional), stage, category, author, date,
//   related: [slug, slug] (optional)
// Callouts use the GitHub form:  > [!note] Title   (note · tip · urgent · myth)

const DIR = path.join(process.cwd(), "content", "articles");

export type Article = {
  slug: string;
  title: string;
  description: string;
  standfirst?: string;
  stage: StageSlug;
  category: string;
  author: string;
  date: string;
  related: string[];
  minutes: number;
  toc: { id: string; text: string }[];
  html: string;
};

function unquote(v: string) {
  const t = v.trim();
  if (t.startsWith('"') && t.endsWith('"')) return t.slice(1, -1).replace(/\\"/g, '"');
  return t;
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// "> [!tone] Title\n> body" → an <aside> the reader styles
function callouts(src: string) {
  const lines = src.split("\n");
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^>\s*\[!(\w+)\]\s*(.*)$/);
    if (!m) {
      out.push(lines[i]);
      continue;
    }
    const body: string[] = [];
    while (i + 1 < lines.length && lines[i + 1].startsWith(">")) body.push(lines[++i].replace(/^>\s?/, ""));
    const tone = m[1].toLowerCase();
    const label = tone === "myth" ? "Myth" : "";
    out.push(
      `<aside class="callout callout--${tone}"><p class="callout__t">${label ? `<span>${label}</span> ` : ""}${m[2]}</p>`,
      "",
      tone === "myth" ? `**What’s true:** ${body.join("\n")}` : body.join("\n"),
      "",
      "</aside>"
    );
  }
  return out.join("\n");
}

const md = new Marked({ gfm: true });
md.use({
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      return `<h${depth} id="${slugify(text)}">${text}</h${depth}>\n`;
    },
  },
});

function parseFile(file: string): Article {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8").replace(/\r\n/g, "\n");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const meta: Record<string, string> = {};
  let body = raw;
  if (m) {
    body = m[2];
    for (const line of m[1].split("\n")) {
      const i = line.indexOf(":");
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  }
  const toc = Array.from(body.matchAll(/^## (.+)$/gm)).map((x) => ({ id: slugify(x[1]), text: x[1].trim() }));
  const words = body.split(/\s+/).length + (meta.standfirst?.split(/\s+/).length ?? 0);
  return {
    slug: file.replace(/\.md$/, ""),
    title: unquote(meta.title ?? file),
    description: unquote(meta.description ?? ""),
    standfirst: meta.standfirst ? unquote(meta.standfirst) : undefined,
    stage: (meta.stage ?? "pregnancy") as StageSlug,
    category: unquote(meta.category ?? ""),
    author: unquote(meta.author ?? "ParentVeda editorial"),
    date: meta.date ?? "",
    related: (meta.related ?? "")
      .replace(/[[\]]/g, "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    minutes: Math.max(1, Math.round(words / 200)),
    toc,
    html: md.parse(callouts(body)) as string,
  };
}

let cache: Article[] | null = null;

export function getArticles(): Article[] {
  if (cache) return cache;
  if (!fs.existsSync(DIR)) return (cache = []);
  cache = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parseFile)
    .sort((a, b) => b.date.localeCompare(a.date));
  return cache;
}

export function getArticle(slug: string) {
  return getArticles().find((a) => a.slug === slug);
}

export function relatedTo(a: Article, n = 3) {
  const all = getArticles().filter((x) => x.slug !== a.slug);
  const picked = a.related.map((s) => all.find((x) => x.slug === s)).filter(Boolean) as Article[];
  const same = all.filter((x) => !picked.includes(x) && x.category === a.category);
  const stage = all.filter((x) => !picked.includes(x) && !same.includes(x) && x.stage === a.stage);
  return [...picked, ...same, ...stage].slice(0, n);
}

export function formatDate(d: string) {
  const t = new Date(d);
  if (Number.isNaN(t.getTime())) return d;
  return t.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

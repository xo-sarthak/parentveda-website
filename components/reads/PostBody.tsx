import Markdown, { defaultUrlTransform, type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { FIGURES, FIGURE_SCHEME } from "./figures";
import { headingSlug } from "@/lib/headings";

/**
 * Renders an article's Markdown body. The component map and its conventions
 * are carried over from the old site's PostBody; the look is the new
 * reader's (app/articles.css, .rbody__prose).
 *
 * Conventions authors already use in Directus:
 *   > Note: …        the medical disclaimer — quiet, present, never loud
 *   > Important: …   safety information that must be noticed (warning strip)
 *   > Insight: …     the one ParentVeda Insight per article (large italic)
 *   ## What matters most / Key takeaways / The short version → a summary box
 *   ![alt](figure:key "caption") → a hand-drawn diagram (figures.tsx)
 *   [TOC] → dropped here; the sticky contents list replaces it
 *
 * Markdown is written by our own team behind Directus auth, and raw HTML is
 * never rendered (no rehype-raw), so there is no injection surface.
 */

const CALLOUTS = [
  { prefix: /^note:\s*/i, kind: "note" as const },
  { prefix: /^important:\s*/i, kind: "important" as const },
  { prefix: /^insight:\s*/i, kind: "insight" as const },
];

const TAKEAWAYS_HEADING = /^(what matters most|key takeaways|the short version)$/i;

function blockText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(blockText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return blockText((node as { props: { children?: React.ReactNode } }).props.children);
  }
  return "";
}

function makeComponents(): Components {
  /* Heading ids must match tocItems(): same slug rule, same de-duplication,
     same document order. H3s get their own counter so an H3 that slugifies
     like an H2 can never bump that H2's id. */
  const used = new Map<string, number>();
  const nextId = (map: Map<string, number>, text: string) => {
    const base = headingSlug(text);
    const n = (map.get(base) ?? 0) + 1;
    map.set(base, n);
    return n === 1 ? base : `${base}-${n}`;
  };
  const usedSub = new Map<string, number>();

  // "What matters most" is a summary box: the heading raises a flag the next list consumes.
  let takeawaysNext = false;

  return {
    h2: ({ children }) => {
      const text = blockText(children).trim();
      const isTakeaways = TAKEAWAYS_HEADING.test(text);
      takeawaysNext = isTakeaways;
      return (
        <h2 id={nextId(used, blockText(children))} className={isTakeaways ? "takeaways__h" : undefined}>
          {children}
        </h2>
      );
    },
    h3: ({ children }) => <h3 id={nextId(usedSub, blockText(children))}>{children}</h3>,
    p: ({ children, node }) => {
      if (/^\[toc\]$/i.test(blockText(children).trim())) return null;
      // A lone image renders as a block <figure>, which can't sit inside <p>.
      const kids = node?.children ?? [];
      if (kids.length === 1 && kids[0].type === "element" && kids[0].tagName === "img") return <>{children}</>;
      return <p>{children}</p>;
    },
    ul: ({ children }) => {
      const takeaways = takeawaysNext;
      takeawaysNext = false;
      return <ul className={takeaways ? "takeaways__list" : undefined}>{children}</ul>;
    },
    blockquote: ({ children }) => {
      const text = blockText(children).trim();
      const match = CALLOUTS.find((c) => c.prefix.test(text));
      if (!match) return <blockquote className="pullquote">{children}</blockquote>;
      const inner = text.replace(match.prefix, "");

      if (match.kind === "note") {
        // The medical disclaimer: it has to be present; it does not have to compete.
        return <p className="callout-note">{inner}</p>;
      }
      if (match.kind === "important") {
        return (
          <aside role="note" className="callout callout--urgent">
            <p className="callout__t">Important</p>
            <p>{inner}</p>
          </aside>
        );
      }
      return (
        <aside className="callout-insight">
          <p className="callout-insight__label">ParentVeda Insight</p>
          <p className="callout-insight__text">{inner}</p>
        </aside>
      );
    },
    a: ({ children, href }) => (
      <a href={href} {...(href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    ),
    img: ({ src, alt, title }) => {
      if (typeof src !== "string") return null;
      if (src.startsWith(FIGURE_SCHEME)) {
        const Figure = FIGURES[src.slice(FIGURE_SCHEME.length)];
        if (!Figure) return null; // unknown key: render nothing, never a broken image
        return (
          <figure className="rfig rfig--drawn">
            <div className="rfig__box">
              <Figure />
            </div>
            {title ? <figcaption>{title}</figcaption> : null}
          </figure>
        );
      }
      return (
        <figure className="rfig">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt ?? ""} loading="lazy" />
          {title ? <figcaption>{title}</figcaption> : null}
        </figure>
      );
    },
    table: ({ children }) => (
      <div className="rtable">
        <table>{children}</table>
      </div>
    ),
  };
}

/* react-markdown strips unknown URL schemes, which would turn `figure:` into
   an empty src. Let that one through; everything else keeps the default. */
const urlTransform = (url: string): string => (url.startsWith(FIGURE_SCHEME) ? url : defaultUrlTransform(url));

export default function PostBody({ body }: { body: string }) {
  return (
    <div className="rbody__prose">
      <Markdown remarkPlugins={[remarkGfm]} components={makeComponents()} urlTransform={urlTransform}>
        {body}
      </Markdown>
    </div>
  );
}

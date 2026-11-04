/* ============================================================
   Affiliate links. Add a future affiliate's domain to lib/affiliate.json and
   its links get the rel attributes and the disclosure automatically.

   The Associates tag is one variable, AMAZON_ASSOCIATE_TAG, applied when the
   page renders, so changing accounts needs no content edits. Short links
   (amzn.to) are the exception: their tag is sealed inside Amazon's redirect, so
   they cannot be changed here. `npm run links:amazon` flags them for replacing.
   ============================================================ */

import config from "@/lib/affiliate.json";

export const AFFILIATE_DISCLOSURE = "As an Amazon Associate, ParentVeda earns from qualifying purchases.";
export const AFFILIATE_REL = "sponsored nofollow noopener";

function hostOf(href: string): string | null {
  try {
    return new URL(href).hostname.toLowerCase();
  } catch {
    return null; // a relative or malformed link is never an affiliate link
  }
}

const matches = (host: string, domains: string[]) => domains.some((d) => host === d || host.endsWith(`.${d}`));

export function isAffiliateLink(href: string | undefined): boolean {
  const host = href ? hostOf(href) : null;
  return host ? matches(host, config.domains) : false;
}

/** Sets or replaces tag= on an Amazon link. With no tag configured, the link is left as written. */
export function withAssociateTag(href: string, tag = process.env.AMAZON_ASSOCIATE_TAG): string {
  const host = hostOf(href);
  if (!tag || !host || !matches(host, config.taggable)) return href;
  const url = new URL(href);
  url.searchParams.set("tag", tag);
  return url.toString();
}

/** Whether some Markdown contains an affiliate link, in [text](url) or bare form. */
export function hasAffiliateLink(markdown: string): boolean {
  return (markdown.match(/https?:\/\/[^\s)\]"'<>]+/g) ?? []).some(isAffiliateLink);
}

/* ---- Rehype plugin: the disclosure line above the first affiliate link ---- */

type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
};

function containsAffiliateLink(node: HastNode): boolean {
  if (node.tagName === "a" && isAffiliateLink(node.properties?.href as string | undefined)) return true;
  return (node.children ?? []).some(containsAffiliateLink);
}

/* Inserted before the top-level block holding the link, so it sits above the
   link rather than splitting its sentence. An <aside>, because the Markdown
   component map rebuilds <p> and would drop the class. */
export function rehypeAffiliateDisclosure() {
  return (tree: HastNode) => {
    const blocks = tree.children ?? [];
    const first = blocks.findIndex(containsAffiliateLink);
    if (first === -1) return;
    blocks.splice(first, 0, {
      type: "element",
      tagName: "aside",
      properties: { className: ["raffnote"] },
      children: [{ type: "text", value: AFFILIATE_DISCLOSURE }],
    });
  };
}

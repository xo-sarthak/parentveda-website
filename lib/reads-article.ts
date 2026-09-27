/* ============================================================
   Article helpers, carried over verbatim from the old site's article page
   (parentveda-web, app/reads/[category]/[slug]/page.tsx): lifting the FAQ
   section into an accordion, and the structured data — Article, or
   Article + MedicalWebPage with the medical reviewer, FAQPage, Recipe.
   The page itself is rebuilt in the new reader's design.
   ============================================================ */

import { authorPath, type Author } from "@/lib/authors";
import type { GuidePost } from "@/lib/guides";
import { SITE_URL, SITE_NAME } from "@/lib/site";

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

/* Pull Q&A pairs out of the article's own FAQ section so the schema can never
   drift from what the page actually shows. Each H3 inside the "Common
   questions" H2 is a question; the prose under it is the answer. */
export function extractFaqs(body: string): { q: string; a: string }[] {
  const faqs: { q: string; a: string }[] = [];
  let inFaqs = false;
  let question: string | null = null;
  let answer: string[] = [];

  const flush = () => {
    const text = markdownToText(answer.join(" "));
    if (question && text) faqs.push({ q: question, a: text });
    question = null;
    answer = [];
  };

  for (const line of body.split("\n")) {
    const h2 = /^##\s+(.+?)\s*$/.exec(line);
    if (h2) {
      flush();
      inFaqs = /common questions|frequently asked|faqs?$/i.test(h2[1].replace(/[*_`]/g, ""));
      continue;
    }
    if (!inFaqs) continue;

    const h3 = /^###\s+(.+?)\s*$/.exec(line);
    if (h3) {
      flush();
      question = h3[1].replace(/[*_`]/g, "").trim();
      continue;
    }
    if (question) answer.push(line);
  }
  flush();

  return faqs;
}

export function buildFaqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function buildJsonLd(
  post: GuidePost,
  canonicalAbs: string,
  ogImageAbs: string,
  author?: Author
) {
  const publisher = {
    "@type": "Organization",
    name: SITE_NAME,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/pv-mark.png` },
  };

  if (post.category === "recipes" && post.recipe) {
    return {
      "@context": "https://schema.org",
      "@type": "Recipe",
      name: post.title,
      description: post.description,
      datePublished: post.date,
      author: { "@type": "Organization", name: SITE_NAME },
      image: [ogImageAbs],
      prepTime: isoMinutes(post.recipe.prepTime),
      cookTime: isoMinutes(post.recipe.cookTime),
      totalTime: isoMinutes(post.recipe.totalTime),
      recipeYield: post.recipe.servings,
      recipeIngredient: post.recipe.ingredients,
      recipeInstructions: post.recipe.steps.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        text: s,
      })),
    };
  }

  if (post.category === "parenting-faq") {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: post.title,
          acceptedAnswer: { "@type": "Answer", text: markdownToText(post.body) },
        },
      ],
    };
  }

  /* A credentialed Person with a crawlable URL is worth far more on YMYL
     health content than an Organization name — but it has to say the same
     thing the page says. The page credits Dr. Mahender Singh as REVIEWER
     ("Medically reviewed by"), so claiming him as `author` in the structured
     data asserted something the visible byline never did. On medical content
     the author/reviewer distinction is precisely what Google weighs, and
     getting it wrong is worse than omitting the person entirely.
     `reviewedBy` and `lastReviewed` belong to MedicalWebPage, not Article,
     which is why the node carries both types. */
  const reviewer = author
    ? {
        "@type": "Person",
        name: author.name,
        url: `${SITE_URL}${authorPath(author.slug)}`,
        jobTitle: author.role,
        ...(author.specialties.length ? { knowsAbout: author.specialties } : {}),
      }
    : null;

  return {
    "@context": "https://schema.org",
    "@type": reviewer ? ["Article", "MedicalWebPage"] : "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    /* Nobody is credited as the writer on the page, so the publisher is the
       honest author. Posts still bylined "Team ParentVeda" keep that name —
       their byline shows no reviewer role at all (see ArticleByline). */
    author: reviewer
      ? { "@type": "Organization", name: SITE_NAME, url: SITE_URL }
      : { "@type": "Organization", name: post.author },
    ...(reviewer ? { reviewedBy: reviewer, lastReviewed: post.updated ?? post.date } : {}),
    publisher,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalAbs },
    image: [ogImageAbs],
  };
}


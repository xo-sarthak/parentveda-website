/* ============================================================
   Structured data, one function per page type. Every value here has to agree
   with what the page visibly says: on health content, a schema that claims more
   than the page does is worse than no schema.
   ============================================================ */

import { authorPath, type Author } from "@/lib/authors";
import { markdownToText, isoMinutes, type Faq } from "@/lib/reads-article";
import { GUIDES_BASE, GUIDES_NAME, categoryPath, type GuideCategory, type GuidePost } from "@/lib/guides";
import { SITE_NAME, SITE_URL, site } from "@/lib/site";

const CONTEXT = "https://schema.org";
const LOGO = `${SITE_URL}/brand/pv-mark.png`;

const publisher = {
  "@type": "Organization",
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: { "@type": "ImageObject", url: LOGO },
};

/* The short form used inside an article: who, where to read more, how to verify. */
function personRef(person: Author) {
  return {
    "@type": "Person",
    name: person.name,
    url: `${SITE_URL}${authorPath(person.slug)}/`,
    jobTitle: jobTitle(person),
    ...(person.specialties.length ? { knowsAbout: person.specialties } : {}),
    ...(person.sameAs?.length ? { sameAs: person.sameAs } : {}),
  };
}

/** "Founder & CTO, ParentVeda" → "Founder & CTO": the employer is its own property. */
function jobTitle(person: Author): string {
  return person.role.replace(new RegExp(`,\\s*${SITE_NAME}$`), "");
}

export type Crumb = { name: string; path: string };

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  };
}

export const readsCrumb: Crumb = { name: GUIDES_NAME, path: `${GUIDES_BASE}/` };

export function categoryCrumbs(category: Pick<GuideCategory, "slug" | "name">): Crumb[] {
  return [readsCrumb, { name: category.name, path: `${categoryPath(category.slug)}/` }];
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": CONTEXT,
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: markdownToText(f.a) },
    })),
  };
}

type ArticleInput = {
  post: GuidePost;
  canonicalAbs: string;
  imageAbs: string;
  writer: Author;
  reviewer?: Author;
};

/* Article, or Recipe / FAQPage for those categories. `reviewedBy` and
   `lastReviewed` belong to MedicalWebPage, not Article, which is why a reviewed
   piece carries both types and an unreviewed one claims neither. */
export function articleSchema({ post, canonicalAbs, imageAbs, writer, reviewer }: ArticleInput) {
  if (post.category === "recipes" && post.recipe) {
    return {
      "@context": CONTEXT,
      "@type": "Recipe",
      name: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      author: personRef(writer),
      publisher,
      image: [imageAbs],
      inLanguage: "en-IN",
      mainEntityOfPage: { "@type": "WebPage", "@id": canonicalAbs },
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
    return faqSchema([{ q: post.title, a: post.body }]);
  }

  return {
    "@context": CONTEXT,
    "@type": reviewer ? ["Article", "MedicalWebPage"] : "Article",
    headline: post.title,
    description: post.description,
    image: [imageAbs],
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: personRef(writer),
    ...(reviewer
      ? { reviewedBy: personRef(reviewer), lastReviewed: post.reviewedDate ?? post.updated ?? post.date }
      : {}),
    publisher,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalAbs },
    inLanguage: "en-IN",
  };
}

export function personSchema(person: Author, canonicalAbs: string) {
  const degrees = person.qualifications.filter((q): q is typeof q & { institution: string } => !!q.institution);
  return {
    "@context": CONTEXT,
    "@type": "Person",
    name: person.name,
    url: canonicalAbs,
    jobTitle: jobTitle(person),
    description: person.shortBio,
    ...(/^dr\.?\s/i.test(person.name) ? { honorificPrefix: "Dr." } : {}),
    ...(person.photo ? { image: `${SITE_URL}${person.photo}` } : {}),
    ...(person.sameAs?.length ? { sameAs: person.sameAs } : {}),
    ...(person.specialties.length ? { knowsAbout: person.specialties } : {}),
    ...(person.languages?.length ? { knowsLanguage: person.languages } : {}),
    // Only a line with an institution is a credential; a training or a posting is plain text.
    ...(degrees.length
      ? {
          alumniOf: [...new Set(degrees.map((q) => q.institution))].map((name) => ({
            "@type": "EducationalOrganization",
            name,
          })),
          hasCredential: degrees.map((q) => ({
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "degree",
            name: q.degree,
            educationalLevel: q.degree,
            ...(q.year?.match(/\d{4}/) ? { dateCreated: q.year.match(/\d{4}/)![0] } : {}),
            recognizedBy: { "@type": "EducationalOrganization", name: q.institution },
          })),
        }
      : {}),
    ...(person.memberships.length ? { memberOf: person.memberships.map((name) => ({ "@type": "Organization", name })) } : {}),
    /* Experts work with us and have their own practices; our own people work for us. */
    ...(person.kind === "writer"
      ? { worksFor: { "@type": "Organization", name: SITE_NAME, url: `${SITE_URL}/` } }
      : {
          affiliation: { "@type": "Organization", name: SITE_NAME, url: `${SITE_URL}/` },
          ...(person.practice ? { worksFor: { "@type": "MedicalBusiness", name: person.practice } } : {}),
        }),
    ...(person.registration ? { identifier: person.registration } : {}),
  };
}

/* The Play listing joins sameAs only once the app is actually on Play. */
export function homeSchema() {
  const sameAs = [...site.socials, ...(site.appLive ? [site.playUrl] : [])];
  return {
    "@context": CONTEXT,
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        slogan: site.tagline,
        url: `${SITE_URL}/`,
        logo: LOGO,
        ...(sameAs.length ? { sameAs } : {}),
        contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: site.email },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        inLanguage: "en-IN",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "SoftwareApplication",
        name: SITE_NAME,
        operatingSystem: "Android",
        applicationCategory: "HealthApplication",
        slogan: site.tagline,
        description: site.description,
      },
    ],
  };
}

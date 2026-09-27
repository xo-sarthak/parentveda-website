/* ============================================================
   ParentVeda — article authors.

   Why this lives in code rather than Supabase: an author profile is a
   small, slow-moving, structured record (qualifications, registration,
   memberships) that we render into Person schema. Directus currently
   stores `author` as a plain string on the post, so this file enriches
   that string into a full profile. Set a post's `author` in Directus to
   an author's `name` below and the byline, end-of-article card and
   /reads/authors/<slug> page all light up automatically.

   An author string with no match here still renders exactly as before —
   plain text, no link. Nothing breaks for the posts bylined
   "Team ParentVeda".

   Why it matters for search: Google's quality guidelines for YMYL
   (your-money-or-your-life) topics — which all pregnancy and child-health
   content is — lean hard on who wrote a page and what qualifies them.
   A named, credentialed, linkable author with Person schema is the single
   biggest E-E-A-T signal we can add to an article.
   ============================================================ */

export const AUTHORS_BASE = "/reads/authors";

export type Qualification = {
  degree: string;
  institution: string;
  year: string;
};

export type Author = {
  slug: string;
  /** Must match the post's `author` string in Directus for auto-resolution. */
  name: string;
  /** Post-nominals, shown next to the name. */
  credentials?: string;
  /** Professional title — the line under the name. */
  role: string;
  /** Path to a headshot in /public. Falls back to initials when absent. */
  photo?: string;
  /** One sentence. Used on the end-of-article card and in meta descriptions. */
  shortBio: string;
  /** Full bio, one string per paragraph. */
  bio: string[];
  specialties: string[];
  qualifications: Qualification[];
  memberships: string[];
  experience?: string;
  /** Medical council registration — a verifiable credential, worth showing. */
  registration?: string;
  languages?: string[];
  /** Practice / clinic name. */
  practice?: string;
};

export const AUTHORS: Author[] = [
  {
    slug: "dr-mahender-singh",
    name: "Dr. Mahender Singh",
    credentials: "MBBS, DCH, MD (Paediatrics)",
    role: "Consultant Child Specialist & Neonatologist",
    /* Head-and-shoulders square crop at 400px — 3× the largest place it's
       rendered (112px on the profile header), so it stays sharp on retina
       without shipping a 2 MB original. */
    photo: "/authors/dr-mahender-singh.jpg",
    shortBio:
      "A consultant child specialist and neonatologist with over four decades of practice in newborn and child health.",
    bio: [
      "Dr. Mahender Singh is a consultant child specialist and neonatologist who has spent more than four decades caring for children — from the first fragile hours of a newborn's life through to adolescence.",
      "He completed his MBBS at Sardar Patel Medical College in 1979, returning to the same institution for a Diploma in Child Health in 1983 and an MD in Paediatrics in 1985. In the years since, his practice has centred on neonatal care, routine immunisation, growth and development, and the everyday worries that bring families to a paediatrician's door.",
      "He practises in both Hindi and English at Child Care, his clinic, and is registered with the Delhi Medical Council.",
    ],
    specialties: [
      "Newborn & neonatal care",
      "Child health",
      "Immunisation",
      "Growth & development",
      "Adolescent health",
    ],
    qualifications: [
      { degree: "MD (Paediatrics)", institution: "Sardar Patel Medical College", year: "1985" },
      {
        degree: "DCH (Diploma in Child Health)",
        institution: "Sardar Patel Medical College",
        year: "1983",
      },
      { degree: "MBBS", institution: "Sardar Patel Medical College", year: "1979" },
    ],
    memberships: [
      "Indian Academy of Paediatrics",
      "National Neonatology Forum",
      "Indian Medical Association",
    ],
    experience: "42 years in healthcare",
    registration: "Delhi Medical Council, 15446",
    languages: ["English", "Hindi"],
    practice: "Child Care",
  },
];

/* ---------------- Lookup ---------------- */

export function getAuthorBySlug(slug: string): Author | undefined {
  return AUTHORS.find((a) => a.slug === slug);
}

export function getAuthorByName(name: string): Author | undefined {
  const wanted = name.trim().toLowerCase();
  return AUTHORS.find((a) => a.name.toLowerCase() === wanted);
}

/**
 * The profile behind a post's byline, or undefined for a plain-string author
 * like "Team ParentVeda" (which renders as unlinked text, exactly as before).
 *
 * Resolution is purely by name now. There was a PILOT_AUTHOR_BY_POST map here
 * that pinned the ectopic preview to Dr. Mahender Singh, because that post's
 * `author` field in Directus still said "Team ParentVeda" and nothing could
 * write to it. The field is set correctly, so the special case is gone.
 */
export function resolveAuthor(post: { author: string }): Author | undefined {
  return getAuthorByName(post.author);
}

export function authorPath(slug: string): string {
  return `${AUTHORS_BASE}/${slug}`;
}

/** Initials for the fallback avatar — "Dr. Mahender Singh" → "MS". */
export function authorInitials(name: string): string {
  return name
    .replace(/^(dr|prof|mr|mrs|ms)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

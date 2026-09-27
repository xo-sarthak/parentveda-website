/* ============================================================
   ParentVeda — Guides (the SEO content hub).

   Content now lives in the shared Supabase backend (authored in Directus),
   not in this file. Publish in Directus → the site shows it.

   Every helper here is SERVER-ONLY and async. Never call these from a
   client component: guide content must land in the crawlable HTML, so all
   fetching happens in server components at prerender / ISR time.

   The shapes below (GuidePost, GuideCategory) are unchanged from the
   hardcoded era EXCEPT `body`, which is now Markdown text rather than a
   Block[] — see PostBody.tsx. Keeping the shapes stable means the
   renderers, JSON-LD and metadata all work untouched.

   Reads are gated by RLS to status='published'; the anon key is public.
   ============================================================ */

import { supabase } from "@/lib/supabase";
/* The old site typed these against its icon set and tint palette; here they
   are plain strings (the new site draws its own marks). */
type IconKey = string;
type Tint = string;

/* The route. Renamed from /guides on 29 July 2026; next.config.ts keeps a
   permanent redirect from the old paths so links already shared still work. */
export const GUIDES_BASE = "/reads";
/* The reader-facing name for this section. The ROUTE stays /guides —
   changing that would break every article URL, the sitemap, and any link
   already shared. Label and path are allowed to differ. */
export const GUIDES_NAME = "Reads";
export const GUIDES_TAGLINE =
  "Calm, evidence-informed reads for pregnancy and early parenthood — articles, research & book summaries, recipes and clear answers.";

/* ---------------- Categories ---------------- */

/* Slug = the plural display name, kebab-cased, so the URL always matches the
   heading the reader sees: /reads/articles/ is titled "Articles".
   `parenting-faq` is not an exception — its label IS "Parenting FAQ".

   Renamed from the singular forms on 30 July 2026; next.config.ts holds a
   permanent redirect per old slug. */
export type CategorySlug =
  | "articles"
  | "research-summaries"
  | "book-summaries"
  | "recipes"
  | "parenting-faq";

export type GuideCategory = {
  slug: CategorySlug;
  name: string; // plural display
  singular: string; // singular display
  tagline: string; // short line under the title
  description: string; // SEO meta description for the category page
  icon: IconKey;
  tint: Tint;
};

/* ---------------- Posts ---------------- */

export type RecipeMeta = {
  prepTime?: string; // human, e.g. "10 min"
  cookTime?: string;
  totalTime?: string;
  servings?: string; // e.g. "Serves 2"
  ingredients: string[];
  steps: string[];
};

export type GuidePost = {
  slug: string;
  category: CategorySlug;
  title: string; // H1 + SEO title base
  description: string; // meta description (≤ ~160 chars)
  excerpt: string; // listing excerpt
  date: string; // ISO published
  updated?: string; // ISO modified
  readingTime: string;
  author: string;
  tags: string[];
  body: string; // MARKDOWN (was Block[] when content was hardcoded)
  recipe?: RecipeMeta; // recipe category
  source?: { label: string; href?: string }; // research / book citation
  bookMeta?: { title: string; author: string }; // book-summary
  /* Optional per-post SEO overrides, authored in Directus. */
  metaTitle?: string;
  ogImage?: string;
  ogImageAlt?: string;
  canonicalPath?: string;
  /* Which of the three reader phases this belongs to. Coarser than
     trimester, which only means something when stage is "pregnancy". */
  stage?: StageSlug;
  /* Stage metadata used by the trimester shelf. */
  trimester?: string;
  weekTag?: string;
};

/* ---------------- Stages ---------------- */

/* The three reader phases. Values are the app's identifiers and MUST match
   `StageId` in src/lib/stages.ts, which owns the routes (/trying-to-conceive,
   /pregnancy, /parenting). Declared here rather than imported so the content
   layer does not depend on the marketing layer; if one changes, change both.

   Why this exists at all: `trimester` was the only "where are you" a post
   could carry, and by mid-September half the library had none, because half
   the library is not in a trimester. Sperm count is not in a trimester.
   Potty training is not in a trimester. */
export type StageSlug = "ttc" | "pregnancy" | "parenting";

export type Stage = {
  key: StageSlug;
  name: string;
  /* The route that owns this stage, from stages.ts. Kept as a plain string
     here so a shelf can link to it without importing the marketing layer. */
  href: string;
};

export const STAGES: Stage[] = [
  { key: "ttc", name: "Trying to conceive", href: "/trying-to-conceive" },
  { key: "pregnancy", name: "Pregnancy", href: "/pregnancy" },
  { key: "parenting", name: "Parenting", href: "/parenting" },
];

/* ---------------- Row types + mapping ---------------- */

type CategoryRow = {
  slug: CategorySlug;
  name: string;
  singular: string;
  tagline: string;
  description: string;
  icon: IconKey;
  tint: Tint;
  sort: number | null;
};

type PostRow = {
  category: CategorySlug;
  slug: string;
  title: string;
  description: string | null;
  excerpt: string | null;
  body: string | null;
  author: string | null;
  reading_time: string | null;
  tags: string[] | null;
  stage: StageSlug | null;
  trimester: string | null;
  week_tag: string | null;
  recipe: RecipeMeta | null;
  source: { label: string; href?: string } | null;
  book_meta: { title: string; author: string } | null;
  meta_title: string | null;
  og_image: string | null;
  og_image_alt: string | null;
  canonical_path: string | null;
  published_at: string | null;
  updated_at: string | null;
};

const POST_COLUMNS =
  "category, slug, title, description, excerpt, body, author, reading_time, tags, " +
  "stage, trimester, week_tag, recipe, source, book_meta, meta_title, og_image, og_image_alt, " +
  "canonical_path, published_at, updated_at";

/** ISO timestamp → the plain YYYY-MM-DD the UI and JSON-LD already expect. */
function toDate(ts: string | null): string {
  return ts ? ts.slice(0, 10) : "";
}

function toPost(r: PostRow): GuidePost {
  return {
    slug: r.slug,
    category: r.category,
    title: r.title,
    description: r.description ?? "",
    excerpt: r.excerpt ?? "",
    date: toDate(r.published_at),
    updated: r.updated_at ? toDate(r.updated_at) : undefined,
    readingTime: r.reading_time ?? "",
    author: r.author ?? "Team ParentVeda",
    tags: r.tags ?? [],
    body: r.body ?? "",
    recipe: r.recipe ?? undefined,
    source: r.source ?? undefined,
    bookMeta: r.book_meta ?? undefined,
    metaTitle: r.meta_title ?? undefined,
    ogImage: r.og_image ?? undefined,
    ogImageAlt: r.og_image_alt ?? undefined,
    canonicalPath: r.canonical_path ?? undefined,
    stage: r.stage ?? undefined,
    trimester: r.trimester ?? undefined,
    weekTag: r.week_tag ?? undefined,
  };
}

function toCategory(r: CategoryRow): GuideCategory {
  return {
    slug: r.slug,
    name: r.name,
    singular: r.singular,
    tagline: r.tagline,
    description: r.description,
    icon: r.icon,
    tint: r.tint,
  };
}

/* A published post must be renderable and reachable. A row missing its slug
   or title would produce a broken URL or an empty <h1>, so drop it rather
   than emit a page that hurts us in search. */
function isRenderable(r: PostRow): boolean {
  return Boolean(r.slug && r.title && r.category);
}

/* ---------------- Unlisted posts ----------------
   A post tagged "unlisted" stays reachable at its own URL but is hidden from
   every listing surface — the hub, category pages, related reads, counts and
   sitemap.xml — and the article page marks it noindex. That gives us a share-
   able review link with no entry point on the site.

   Filtering happens in JS rather than SQL on purpose: PostgREST's `not.cs`
   would also drop rows whose `tags` is NULL, silently hiding real posts.

   Unlisted is not private. Anyone with the link can read it, so it is for
   review convenience, never for anything confidential. */
export const UNLISTED_TAG = "unlisted";

export function isUnlisted(post: GuidePost): boolean {
  return post.tags.includes(UNLISTED_TAG);
}

const listed = (posts: GuidePost[]): GuidePost[] => posts.filter((p) => !isUnlisted(p));

/* ---------------- Data access (async) ---------------- */

/** All published posts, newest first. */
export async function getAllPosts(): Promise<GuidePost[]> {
  if (!supabase) return []; // no keys yet: Reads show their empty state
  const { data, error } = await supabase
    .from("content_posts")
    .select(POST_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw new Error(`Supabase: failed to load posts — ${error.message}`);
  return listed(((data ?? []) as unknown as PostRow[]).filter(isRenderable).map(toPost));
}

/** All categories, in their authored sort order. */
export async function getCategories(): Promise<GuideCategory[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("content_categories")
    .select("slug, name, singular, tagline, description, icon, tint, sort")
    .order("sort", { ascending: true });

  if (error) throw new Error(`Supabase: failed to load categories — ${error.message}`);
  return ((data ?? []) as unknown as CategoryRow[]).map(toCategory);
}

/**
 * PRESERVED NAME — was a module-level array of literals; the hub, header and
 * sitemap all import it. Now an async fetch. Call sites must await.
 */
export const CATEGORIES = getCategories;

export async function getCategory(slug: string): Promise<GuideCategory | undefined> {
  if (!supabase) return undefined;
  const { data, error } = await supabase
    .from("content_categories")
    .select("slug, name, singular, tagline, description, icon, tint, sort")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(`Supabase: failed to load category ${slug} — ${error.message}`);
  return data ? toCategory(data as unknown as CategoryRow) : undefined;
}

export async function getPostsByCategory(slug: string): Promise<GuidePost[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("content_posts")
    .select(POST_COLUMNS)
    .eq("status", "published")
    .eq("category", slug)
    .order("published_at", { ascending: false });

  if (error) throw new Error(`Supabase: failed to load ${slug} posts — ${error.message}`);
  return listed(((data ?? []) as unknown as PostRow[]).filter(isRenderable).map(toPost));
}

export async function getPost(category: string, slug: string): Promise<GuidePost | undefined> {
  if (!supabase) return undefined;
  const { data, error } = await supabase
    .from("content_posts")
    .select(POST_COLUMNS)
    .eq("status", "published")
    .eq("category", category)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(`Supabase: failed to load ${category}/${slug} — ${error.message}`);
  return data && isRenderable(data as unknown as PostRow) ? toPost(data as unknown as PostRow) : undefined;
}

/** A few recent posts for the hub landing. */
export async function getFeaturedPosts(limit = 6): Promise<GuidePost[]> {
  // Over-fetch, then drop unlisted rows in JS. Applying `limit` alone would
  // return short whenever a recent post is unlisted, because the row is spent
  // against the limit in SQL and only filtered out afterwards.
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("content_posts")
    .select(POST_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit + 10);

  if (error) throw new Error(`Supabase: failed to load featured posts — ${error.message}`);
  return listed(((data ?? []) as unknown as PostRow[]).filter(isRenderable).map(toPost)).slice(
    0,
    limit
  );
}

/** The single lead story for the hub's editorial opener (newest post). */
export async function getHeroPost(): Promise<GuidePost | undefined> {
  return (await getFeaturedPosts(1))[0];
}

export async function countByCategory(slug: string): Promise<number> {
  // Selects tags instead of a head-only count: an exact count in SQL would
  // include unlisted posts, overstating every category badge by one.
  if (!supabase) return 0;
  const { data, error } = await supabase
    .from("content_posts")
    .select("slug, tags")
    .eq("status", "published")
    .eq("category", slug);

  if (error) throw new Error(`Supabase: failed to count ${slug} — ${error.message}`);
  return ((data ?? []) as { slug: string; tags: string[] | null }[]).filter(
    (r) => r.slug && !(r.tags ?? []).includes(UNLISTED_TAG)
  ).length;
}

/* ---------------- Trimesters ----------------
   Pregnancy content has an organizing axis nothing else has: the stage the
   reader is in. Posts opt in via the `trimester` column, falling back to
   their stage tags ("first trimester" …) for rows Directus hasn't set it on. */

export type TrimesterKey = "first" | "second" | "third";

export type Trimester = {
  key: TrimesterKey;
  name: string;
  weeks: string;
  blurb: string;
  tint: Tint;
};

export const TRIMESTERS: Trimester[] = [
  {
    key: "first",
    name: "First trimester",
    weeks: "Weeks 1–13",
    blurb: "The tender early days. Nausea, folic acid, and settling in gently.",
    tint: "brand",
  },
  {
    key: "second",
    name: "Second trimester",
    weeks: "Weeks 14–27",
    blurb: "The golden middle. Energy returns, and the first little kicks arrive.",
    tint: "coral",
  },
  {
    key: "third",
    name: "Third trimester",
    weeks: "Weeks 28–40",
    blurb: "The home stretch. Rest, warm food, and getting ready to say hello.",
    tint: "earth",
  },
];

export async function getPostsByTrimester(key: TrimesterKey, limit = 4): Promise<GuidePost[]> {
  // Filtered in JS rather than SQL: it reuses the single cached all-posts read
  // (no extra round-trip per trimester) and avoids PostgREST's brittle
  // or()/array-contains string syntax. Content volume here is small.
  const tag = `${key} trimester`;
  const all = await getAllPosts();
  return all.filter((p) => p.trimester === key || p.tags.includes(tag)).slice(0, limit);
}

/** Every post filed under one reader phase, newest first. Same cached read as
    the trimester shelf; `limit` is optional because a stage page wants all of
    them, not a shelf's worth. */
export async function getPostsByStage(stage: StageSlug, limit?: number): Promise<GuidePost[]> {
  const all = await getAllPosts();
  const posts = all.filter((p) => p.stage === stage);
  return limit ? posts.slice(0, limit) : posts;
}

/** Cross-category related reads, ranked by tag overlap (same category breaks ties). */
export async function getRelatedPosts(post: GuidePost, limit = 3): Promise<GuidePost[]> {
  const all = await getAllPosts();
  return all
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      p,
      score:
        p.tags.filter((t) => post.tags.includes(t)).length * 2 +
        (p.category === post.category ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || (a.p.date < b.p.date ? 1 : -1))
    .slice(0, limit)
    .map((s) => s.p);
}

/* ---------------- Paths ---------------- */

export function categoryPath(category: string): string {
  return `${GUIDES_BASE}/${category}`;
}

export function postPath(category: string, slug: string): string {
  return `${GUIDES_BASE}/${category}/${slug}`;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryListing, { listingPath, pageCount } from "@/components/reads/CategoryListing";
import { getCategories, getCategory, getPostsByCategory } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

/* Page 2 onward of a category. Page 1 lives at /reads/<category>/, and a request
   for /page/1/ 404s rather than creating a second address for the same list. */

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = await getCategories();
  const perCategory = await Promise.all(
    categories.map(async (c) => {
      const pages = pageCount((await getPostsByCategory(c.slug)).length);
      return Array.from({ length: pages - 1 }, (_, i) => ({ category: c.slug, page: String(i + 2) }));
    })
  );
  return perCategory.flat();
}

function parsePage(raw: string): number | null {
  return /^[1-9]\d*$/.test(raw) && Number(raw) >= 2 ? Number(raw) : null;
}

type Params = Promise<{ category: string; page: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category: slug, page: raw } = await params;
  const page = parsePage(raw);
  const category = await getCategory(slug);
  if (!category || !page) return {};
  const canonical = listingPath(category.slug, page);
  return {
    title: `${category.name}, page ${page} · Reads`,
    description: category.description || category.tagline,
    alternates: { canonical },
    openGraph: { type: "website", url: `${SITE_URL}${canonical}`, title: `${category.name}, page ${page} · ParentVeda Reads` },
  };
}

export default async function CategoryPageN({ params }: { params: Params }) {
  const { category: slug, page: raw } = await params;
  const page = parsePage(raw);
  const category = await getCategory(slug);
  if (!category || !page) notFound();
  const posts = await getPostsByCategory(category.slug);
  if (page > pageCount(posts.length)) notFound();

  return <CategoryListing category={category} posts={posts} page={page} />;
}

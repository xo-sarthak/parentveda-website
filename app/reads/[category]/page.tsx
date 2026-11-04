import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryListing from "@/components/reads/CategoryListing";
import { categoryPath, getCategories, getCategory, getPostsByCategory } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

export const revalidate = 60;
// A category added in Directus after the build still renders; unknown slugs 404 below.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const category = await getCategory((await params).category);
  if (!category) return {};
  const canonical = `${categoryPath(category.slug)}/`;
  return {
    title: `${category.name} · Reads`,
    description: category.description || category.tagline,
    alternates: { canonical },
    openGraph: { type: "website", url: `${SITE_URL}${canonical}`, title: `${category.name} · ParentVeda Reads` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const category = await getCategory((await params).category);
  if (!category) notFound();
  const posts = await getPostsByCategory(category.slug);

  return <CategoryListing category={category} posts={posts} page={1} />;
}

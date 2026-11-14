/* The sitemap files. /sitemap.xml is the index (the address Search Console and
   robots.txt already know); the four parts sit beside it. Kept in its own tiny
   module so the publish webhooks can rebuild them without importing the
   sitemap builders. */

export const SITEMAP_PARTS = ["articles", "hubs", "tools", "pages"] as const;
export type SitemapPart = (typeof SITEMAP_PARTS)[number];

export const sitemapPartPath = (part: SitemapPart) => `/sitemap-${part}.xml`;

/** Every sitemap route, for revalidatePath after a publish. */
export const SITEMAP_PATHS = ["/sitemap.xml", ...SITEMAP_PARTS.map(sitemapPartPath)];

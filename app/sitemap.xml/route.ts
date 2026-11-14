import { indexXml, xmlResponse } from "@/lib/sitemaps";

/* The sitemap index, at the address Search Console and robots.txt already
   use. It lists /sitemap-articles.xml, -hubs, -tools and -pages. */
export const revalidate = 60;

export async function GET() {
  return xmlResponse(await indexXml());
}

import { BUILDERS, urlsetXml, xmlResponse } from "@/lib/sitemaps";

/* One part of the split sitemap; /sitemap.xml is the index. Rebuilt within a
   minute, and at once after a publish (lib/sitemap-paths.ts). */
export const revalidate = 60;

export async function GET() {
  return xmlResponse(urlsetXml(await BUILDERS.hubs()));
}

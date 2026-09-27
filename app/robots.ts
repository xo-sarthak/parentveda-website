import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        /* One unique URL per invite, per doctor's poster, and per signed-in
           employer: near-identical pages with no search value. The pages send
           noindex themselves too; this saves the crawl. Link previews are
           unaffected, since WhatsApp's crawler fetches a shared URL directly. */
        disallow: ["/invite/", "/care/", "/portal/"],
      },
    ],
    sitemap: `${site.domain}/sitemap.xml`,
    host: site.domain,
  };
}

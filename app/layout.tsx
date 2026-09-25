import type { Metadata, Viewport } from "next";
import { Newsreader, Manrope } from "next/font/google";
import "./globals.css";
import "./site.css";
import "./articles.css";
import "./interactions.css";
import "./contact.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MotionRoot from "@/components/MotionRoot";
import Interactions from "@/components/Interactions";
import { site } from "@/lib/site";

// The app's own pairing (docs/DESIGN-SYSTEM.md §2.2): Newsreader for display —
// chosen over Fraunces on 2026-09-17 because Fraunces had become the default
// serif of AI-generated pages — and Manrope for everything else.
const display = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-display",
  display: "swap",
});
const body = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: "ParentVeda — a calm companion for trying, pregnancy and parenting",
    template: "%s · ParentVeda",
  },
  description: site.description,
  openGraph: {
    title: "ParentVeda — a companion that stays",
    description: site.description,
    url: site.domain,
    siteName: "ParentVeda",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "ParentVeda" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", name: "ParentVeda", url: site.domain, logo: `${site.domain}/brand/pv-mark.png` },
    {
      "@type": "SoftwareApplication",
      name: "ParentVeda",
      operatingSystem: "Android",
      applicationCategory: "HealthApplication",
      description: site.description,
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MotionRoot />
        <Interactions />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}

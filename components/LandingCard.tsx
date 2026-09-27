import Link from "next/link";
import Image from "next/image";
import Wordmark from "./Wordmark";

// The quiet single-card page used where someone arrives from outside the site:
// a doctor's QR poster, a friend's invite, the email-confirmation link.
export default function LandingCard({ children, tone = "#E8C4CE" }: { children: React.ReactNode; tone?: string }) {
  return (
    <section className="landing" style={{ ["--tone" as string]: tone }}>
      <div className="landing__card">
        <Link href="/" className="landing__brand" aria-label="ParentVeda home">
          <Image src="/brand/pv-mark.png" alt="" width={40} height={40} priority />
          <Wordmark />
        </Link>
        {children}
      </div>
    </section>
  );
}

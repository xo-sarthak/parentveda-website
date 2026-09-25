import Link from "next/link";
import Image from "next/image";
import { stages } from "@/lib/stages";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap ftr__grid">
        <div className="ftr__about">
          <div className="ftr__brand">
            <Image src="/brand/pv-mark.png" alt="" width={40} height={40} />
            <span>ParentVeda</span>
          </div>
          <p>A calm, India-first companion for the whole journey — trying, expecting, raising, growing.</p>
          <p className="ftr__care">
            ParentVeda explains and helps you prepare. It never diagnoses. If your doctor has told you something different, your
            doctor is right.
          </p>
        </div>
        <div>
          <h2 className="ftr__h">Stages</h2>
          <ul>
            {stages.map((s) => (
              <li key={s.slug}>
                <Link href={`/${s.slug}`}>{s.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="ftr__h">ParentVeda</h2>
          <ul>
            <li><Link href="/ask-veda">Ask Veda</Link></li>
            <li><Link href="/fathers">For fathers</Link></li>
            <li><Link href="/articles">Articles</Link></li>
            <li><Link href="/about">Why we built it</Link></li>
            <li><Link href="/download">Get the app</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="ftr__h">Work with us</h2>
          <ul>
            <li><Link href="/partners#doctors">Doctors & clinics</Link></li>
            <li><Link href="/partners#employers">Employers</Link></li>
            <li><Link href="/partners#brands">Brands</Link></li>
            <li><Link href="/contact">Contact us</Link></li>
            <li><Link href="/privacy">Privacy</Link></li>
            <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="ftr__mark" aria-hidden="true">
        <span className="rv">Parent<em>Veda</em></span>
      </div>
      <div className="wrap ftr__base">
        <span>© {new Date().getFullYear()} ParentVeda. Made in India.</span>
        <span>In an emergency, call 108 or go to your nearest hospital.</span>
      </div>
    </footer>
  );
}

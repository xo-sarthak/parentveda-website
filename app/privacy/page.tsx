import type { Metadata } from "next";
import Icon from "@/components/Icon";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy, in plain words",
  description: "How ParentVeda treats what you tell it: saved on your phone first, never sold, deleted in one tap.",
};

const points = [
  { icon: "phone", t: "Your phone first", d: "What you enter is saved on your phone before anything else. ParentVeda works without an account, and a lost connection never loses your data." },
  { icon: "lock", t: "Sync only if you sign in", d: "If you choose to sign in, your data is backed up to your account so a new phone doesn’t mean starting again." },
  { icon: "x", t: "Never sold", d: "Not to an advertiser, not to an employer, not to an insurer." },
  { icon: "users", t: "Your partner sees what you share", d: "A paired partner can read what you choose to share, and can never change it. While you’re trying, your raw cycle stays yours." },
  { icon: "tag", t: "Sponsored is always labelled", d: "Anything a brand paid for says so, in the same place, every time." },
  { icon: "trash", t: "Delete everything in one tap", d: "From your profile, one tap deletes everything ParentVeda holds for you." },
];

export default function PrivacyPage() {
  return (
    <>
      <section className="phero" style={{ ["--tone" as string]: "#C5D6C4", ["--deep-tone" as string]: "#2E6B4F" }} aria-labelledby="pv-title">
        <div className="wrap">
          <div className="phero__copy" style={{ maxWidth: 820 }}>
            <span className="phero__range">Privacy</span>
            <h1 id="pv-title" className="display-xl">
              <span className="hl"><span>What you tell us</span></span>
              <span className="hl"><span><em>stays in your family.</em></span></span>
            </h1>
            <p className="lede rv rv-d2">
              This is the plain-language version. The full privacy policy will be published here before ParentVeda goes live on Google
              Play.
            </p>
          </div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 24 }} aria-label="Our privacy commitments">
        <div className="wrap">
          <div className="cards3">
            {points.map((p, i) => (
              <div key={p.t} className={`rv rv-d${(i % 3) + 1}`}>
                <span className="ic"><Icon name={p.icon} /></span>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </div>
            ))}
          </div>
          <p className="small" style={{ marginTop: 32 }}>
            Questions about your data: <a className="link" href={`mailto:${site.email}?subject=Privacy`}>{site.email}</a>
          </p>
        </div>
      </section>
    </>
  );
}

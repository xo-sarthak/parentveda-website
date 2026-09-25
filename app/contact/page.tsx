import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import Icon from "@/components/Icon";
import Mark, { type Glyph } from "@/components/Mark";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Write to ParentVeda: parents, doctors and clinics, employers, brands and press.",
};

const ways = [
  { icon: "heart", hue: 345, t: "Parents and families", d: "Questions, feedback, or something in the app that didn’t feel right. We read every message." },
  { icon: "note", hue: 150, t: "Doctors and clinics", d: "ParentVeda+ for your practice, or a correction to anything clinical we’ve written." },
  { icon: "case", hue: 265, t: "Employers and brands", d: "Sponsored access for your team, or a partnership that’s happy to be labelled." },
];

export default function ContactPage() {
  return (
    <>
      <section className="phero contact" style={{ ["--tone" as string]: "#E8C4CE", ["--deep-tone" as string]: "#7A3348" }} aria-labelledby="c-title">
        <div className="wrap contact__grid">
          <div className="contact__intro">
            <span className="phero__range">Contact</span>
            <h1 id="c-title" className="display-xl contact__title">
              <span className="hl"><span>Write to us.</span></span>
            </h1>
            <p className="lede rv rv-d2">One form for everyone. Pick what it’s about, and it reaches the right person.</p>
            <ul className="contact__ways">
              {ways.map((w, i) => (
                <li key={w.t} className={`rv rv-d${i + 2}`}>
                  <Mark glyph={w.icon as Glyph} hue={w.hue} index={i} size={56} />
                  <span>
                    <b>{w.t}</b>
                    {w.d}
                  </span>
                </li>
              ))}
            </ul>
            <div className="care contact__care rv rv-d4">
              <Icon name="phone" size={24} />
              <p>
                For a medical question, <Link className="link" href="/ask-veda">Ask Veda</Link> or your doctor is faster. In an emergency, call
                108 or go to the nearest hospital.
              </p>
            </div>
          </div>
          <div className="contact__form rv rv-d2">
            <Suspense fallback={<div className="cform cform--loading" />}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}

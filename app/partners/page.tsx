import type { Metadata } from "next";
import Icon from "@/components/Icon";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Doctors, employers and brands",
  description: "Work with ParentVeda — as a clinic, as an employer supporting working parents, or as a brand that is happy to be labelled.",
};

const blocks = [
  {
    id: "doctors",
    tone: "#C5D6C4",
    deep: "#2E6B4F",
    tag: "Doctors & clinics",
    title: "ParentVeda+, a separate app for your practice.",
    body: "A home for your appointments, availability, video consultations, prescriptions and classes, with clear, itemised earnings. Patients who arrive through ParentVeda already understand their scans and tests, so your time goes on the conversation that matters.",
    points: ["Appointments, availability and video consultations", "Prescriptions and classes in one place", "A QR care poster for your waiting room", "The app explains your plan to patients, and never second-guesses it"],
    subject: "ParentVeda+ for my clinic",
  },
  {
    id: "employers",
    tone: "#D8CCE8",
    deep: "#4A3470",
    tag: "Employers",
    title: "Support the parents on your team, from trying to returning.",
    body: "Sponsor ParentVeda for your employees. They activate it with a work email and get the full companion, plus consultation credits. What they tell the app stays theirs. An employer never sees it.",
    points: ["Activated with a work email", "Consultation credits included", "An HR dashboard for the programme, never for what anyone tells the app", "Support for going back to work, built in"],
    subject: "Sponsoring ParentVeda for our team",
  },
  {
    id: "brands",
    tone: "#E8C4CE",
    deep: "#7A3348",
    tag: "Brands",
    title: "Be recommended honestly, or not at all.",
    body: "Every sponsored placement in ParentVeda carries the same fixed label, in the same place, every time. Our product guide puts the watch-outs next to the praise. Crisis screens never show products. If that suits you, we would like to talk.",
    points: ["A fixed ‘Presented by’ label on every placement", "Watch-outs shown as clearly as the praise", "Never on crisis or red-flag screens", "Never in the medical part of an Ask Veda answer"],
    subject: "Brand partnership with ParentVeda",
  },
];

export default function PartnersPage() {
  return (
    <>
      <section className="phero" style={{ ["--tone" as string]: "#F3EFF9" }} aria-labelledby="p-title">
        <div className="wrap">
          <div className="phero__copy" style={{ maxWidth: 820 }}>
            <span className="phero__range">Work with us</span>
            <h1 id="p-title" className="display-xl">
              <span className="hl"><span>Doctors, employers</span></span>
              <span className="hl"><span><em>and brands.</em></span></span>
            </h1>
            <p className="lede rv rv-d2">
              Three ways to work with ParentVeda. Each one keeps the family first.
            </p>
          </div>
        </div>
      </section>

      {blocks.map((b) => (
        <section key={b.id} id={b.id} className="section" style={{ paddingTop: 0 }} aria-labelledby={`${b.id}-t`}>
          <div className="wrap">
            <div
              className="split"
              style={{ background: `color-mix(in srgb, ${b.tone} 45%, white)`, borderRadius: 32, padding: "clamp(24px, 4vw, 56px)" }}
            >
              <header>
                <span className="phero__range" style={{ background: b.tone, color: b.deep, justifySelf: "start" }}>
                  {b.tag}
                </span>
                <h2 id={`${b.id}-t`} className="display-l rv">
                  {b.title}
                </h2>
              </header>
              <div className="prose">
                <p className="rv">{b.body}</p>
                <ul className="ticks rv" style={{ fontSize: 16 }}>
                  {b.points.map((p) => (
                    <li key={p}>
                      <Icon name="check" size={18} /> {p}
                    </li>
                  ))}
                </ul>
                <Link className="btn btn--ink rv" style={{ justifySelf: "start" }} href={`/contact?topic=${b.id}`}>
                  <Icon name="message" /> Write to us
                </Link>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

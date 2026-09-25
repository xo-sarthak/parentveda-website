import type { Metadata } from "next";
import Art from "@/components/Art";
import Icon from "@/components/Icon";
import Mark from "@/components/Mark";
import AskVedaDemo from "@/components/home/AskVedaDemo";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Ask Veda — answers from our library, never improvised",
  description:
    "Ask Veda answers pregnancy and parenting questions from ParentVeda's own library, in a clear shape, and routes red flags straight to your doctor.",
};

// The seven sections come from the app's lib/ask_veda/veda_core.dart.
const anatomy = [
  { t: "Veda’s answer", d: "The short, direct answer, first." },
  { t: "What this means", d: "The why, in plain words, so the answer makes sense for you." },
  { t: "What you can do", d: "Small, practical next steps — including when to call your doctor." },
  { t: "Read more in ParentVeda", d: "The page in the app that goes deeper." },
  { t: "What other parents say", d: "Experiences from the community, clearly marked. Never used as a medical source.", quiet: true },
  { t: "Things that may help", d: "Products, only where relevant and always labelled if sponsored.", quiet: true },
  { t: "People who can help", d: "Specialists and classes, when a person is the better answer.", quiet: true },
];

export default function AskVedaPage() {
  return (
    <>
      <section className="phero" style={{ ["--tone" as string]: "#D8CCE8", ["--deep-tone" as string]: "#4A3470" }} aria-labelledby="av-title">
        <div className="wrap phero__grid">
          <div className="phero__copy">
            <span className="phero__range">Ask Veda</span>
            <h1 id="av-title" className="display-xl">
              <span className="hl"><span>Ask in your words.</span></span>
              <span className="hl"><span><em>Get a calm answer.</em></span></span>
            </h1>
            <p className="lede rv rv-d2">
              Ask Veda is the question box at the heart of ParentVeda. It answers from our own library, in the same clear shape every
              time, and tells you plainly when it doesn’t know. It is never a doctor, and it never pretends to be.
            </p>
          </div>
          <div className="phero__art rv-img">
            <Art slot="ask-veda-night" fallback="mother" alt="A mother smiling softly" sizes="(max-width: 900px) 92vw, 480px" priority />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="try-title" style={{ paddingTop: 24 }}>
        <div className="wrap split">
          <header>
            <span className="eyebrow rv">See it answer</span>
            <h2 id="try-title" className="display-l rv rv-d1">
              Three questions. <em>One it refuses.</em>
            </h2>
            <p className="lede rv rv-d2">
              When a question is a red flag — bleeding, severe pain, your baby moving less — Ask Veda doesn’t try to answer. It skips the
              AI completely and tells you to call your doctor. That refusal is the most important thing it does.
            </p>
          </header>
          <div className="rv rv-d2">
            <AskVedaDemo />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="anat-title" style={{ paddingTop: 0 }}>
        <div className="wrap split">
          <header>
            <span className="eyebrow rv">The shape of an answer</span>
            <h2 id="anat-title" className="display-l rv rv-d1">
              Always in the <em>same order.</em>
            </h2>
            <p className="lede rv rv-d2">
              A worried reader shouldn’t have to hunt. Every answer follows the same seven parts, and the first four come only from
              ParentVeda’s library. The last three are extras, and they never shape the answer above them.
            </p>
          </header>
          <ol className="anatomy">
            {anatomy.map((a) => (
              <li key={a.t} className={`rv${a.quiet ? " is-quiet" : ""}`}>
                <span>
                  <b>{a.t}</b>
                  {a.d}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="rules-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <header className="section-head">
            <span className="eyebrow rv">The rules it keeps</span>
            <h2 id="rules-title" className="display-l rv rv-d1">
              Built to say <em>“I don’t know”.</em>
            </h2>
          </header>
          <div className="cards3">
            <div className="rv rv-d1">
              <Mark glyph="book" hue={265} index={0} size={64} />
              <h3>Grounded, not guessed</h3>
              <p>
                Answers come from ParentVeda’s own library. If there’s nothing there, it checks only a short list of trusted public health
                bodies, such as the WHO and the NHS. If they don’t cover it either, it says so.
              </p>
            </div>
            <div className="rv rv-d2">
              <Mark glyph="flag" hue={352} index={1} size={64} />
              <h3>Red flags go to a person</h3>
              <p>
                Urgent symptoms never get an AI answer. They get a calm instruction to call your doctor or hospital, and a button that
                does it.
              </p>
            </div>
            <div className="rv rv-d3">
              <Mark glyph="voices" hue={200} index={2} size={64} />
              <h3>Community is not a source</h3>
              <p>
                Other parents’ stories are shown as stories, clearly marked. They never feed the medical part of an answer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="wa-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="care rv" style={{ background: "#EAF4EE" }}>
            <Icon name="whatsapp" size={28} />
            <div style={{ display: "grid", gap: 8 }}>
              <h2 id="wa-title" className="display-m">
                One Veda, two doors.
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 17 }}>
                The same Ask Veda is being built for WhatsApp too, so you can ask a question at 3 a.m. without opening another app. Same
                library, same rules, same refusals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaBand title="Your first question is waiting." />
    </>
  );
}

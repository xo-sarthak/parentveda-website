import Icon from "./Icon";

export type QA = { q: string; a: string };

export const homeFaq: QA[] = [
  {
    q: "Is ParentVeda free?",
    a: "You can start without an account and without paying. A few things, like classes and specialist consultations, will cost money, and they always say so before you tap.",
  },
  {
    q: "Does it replace my doctor?",
    a: "No, and it’s built so it can’t try to. ParentVeda explains, reminds and helps you prepare. It never diagnoses, and if your doctor has said something different, your doctor is right.",
  },
  {
    q: "Where does my information go?",
    a: "It is saved on your phone first. If you choose to sign in, it syncs to your account so you don’t lose it. It is never sold, and you can delete everything in one tap.",
  },
  {
    q: "Is it in Hindi?",
    a: "Much of the pregnancy journey is in Hindi, written in Devanagari, with narration you can listen to. The other stages are in English for now.",
  },
  {
    q: "Can my husband use it too?",
    a: "Yes. He gets his own version, with a daily moment, a weekly page and things to read aloud. He joins with your code, and he can read what you share but never change it.",
  },
  {
    q: "What ages does it cover?",
    a: "Trying to conceive, pregnancy from week 4 to 40, parenting from birth to 5, and skilling for children from 6 to 14.",
  },
  {
    q: "Is Ask Veda a doctor?",
    a: "No. Ask Veda answers from ParentVeda’s own library and says so when it doesn’t know. For anything urgent, like bleeding, severe pain or your baby moving less, it doesn’t answer at all. It tells you to call your doctor.",
  },
  {
    q: "When can I download it?",
    a: "ParentVeda is launching on Google Play first. The download page will have the link the day it goes live.",
  },
];

export default function Faq({ items, title = "Questions families ask us" }: { items: QA[]; title?: string }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })),
  };
  return (
    <section className="section faq" aria-labelledby="faq-title">
      <div className="wrap faq__grid">
        <header className="faq__head">
          <span className="eyebrow rv">FAQ</span>
          <h2 id="faq-title" className="display-l rv rv-d1">
            {title}
          </h2>
        </header>
        <div className="faq__list">
          {items.map((x) => (
            <details key={x.q} className="faq__item rv">
              <summary>
                <span>{x.q}</span>
                <Icon name="plus" size={20} />
              </summary>
              <p>{x.a}</p>
            </details>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </section>
  );
}

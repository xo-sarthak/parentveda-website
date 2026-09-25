import Link from "next/link";

// Two slow bands of the questions families actually bring to Ask Veda.
// They drift in opposite directions, stop under the pointer or a finger,
// and each one opens the Ask Veda page. Pure CSS — no timers.
const rowA = [
  "Is it safe to eat papaya now?",
  "Why won’t the sonographer tell us the sex?",
  "Is spotting at 7 weeks normal?",
  "What does NT scan actually check?",
  "Can I fly in my second trimester?",
  "How much weight should I gain?",
  "Is ghee good for a normal delivery?",
  "What goes in the hospital bag?",
];
const rowB = [
  "When should we see a doctor while trying?",
  "What is a fertile window, really?",
  "Is it okay to give my 6-month-old dal water?",
  "Which vaccines are due at 14 weeks?",
  "When do babies usually start crawling?",
  "How do I handle a toddler tantrum in public?",
  "Is malish with mustard oil safe?",
  "How can my 8-year-old focus longer?",
];

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const loop = [...items, ...items];
  return (
    <div className={`qdrift__row${reverse ? " qdrift__row--rev" : ""}`}>
      <ul className="qdrift__track">
        {loop.map((q, i) => (
          <li key={i} aria-hidden={i >= items.length ? true : undefined}>
            <Link href="/ask-veda" tabIndex={i >= items.length ? -1 : undefined} className="qchip">
              <span className="qchip__dot" aria-hidden="true" />
              {q}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function QuestionDrift() {
  return (
    <div className="qdrift" aria-label="Questions families ask Veda">
      <Row items={rowA} />
      <Row items={rowB} reverse />
    </div>
  );
}

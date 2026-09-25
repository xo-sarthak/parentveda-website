import Link from "next/link";
import Art, { hasImage, findVideo, imageSrc } from "@/components/Art";
import LoopVideo from "@/components/LoopVideo";
import Icon from "@/components/Icon";
import Mark, { type Glyph } from "@/components/Mark";
import { Phone, WeekScreen } from "@/components/Phone";
import Journey from "@/components/home/Journey";
import AskVedaDemo from "@/components/home/AskVedaDemo";
import ScrollWords from "@/components/home/ScrollWords";
import QuestionDrift from "@/components/home/QuestionDrift";
import Faq, { homeFaq } from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import { stages, getStage } from "@/lib/stages";
import { getArticles } from "@/lib/articles";
import { getAppHref } from "@/lib/site";

const promises = [
  { glyph: "note", hue: 268, title: "Never a diagnosis", body: "If your doctor said something different, your doctor is right." },
  { glyph: "door", hue: 345, title: "No account needed to start", body: "Open it, pick your stage, and your home is ready." },
  { glyph: "home", hue: 150, title: "Stays in your family", body: "Saved on your phone first. Never sold. Deleted in one tap." },
];

const pillars = [
  { glyph: "notes", name: "Shravan", line: "Sacred listening — calm ragas, chosen for each trimester." },
  { glyph: "talk", name: "Samvad", line: "Cards to read aloud to your baby, and your own voice, recorded." },
  { glyph: "breath", name: "Kriya", line: "Breath and grounding, a few minutes at a time." },
  { glyph: "diya", name: "Buddhi", line: "A few quiet minutes that are only yours." },
];

const homes = [
  {
    slot: "indian-kitchen",
    glyph: "thali",
    hue: 36,
    title: "An Indian kitchen, not a translated one",
    body: "Trimester diet charts built on dal, roti and sabzi. Around 40 pregnancy recipes, Jain options, and what to do on fasting days.",
    tone: "#E8D9C0",
  },
  {
    slot: "traditions",
    glyph: "kheer",
    hue: 345,
    title: "Traditions, held up honestly",
    body: "Annaprashan, mundan, malish, naming. What each one means, and what the evidence says about it.",
    tone: "#E8C4CE",
  },
  {
    slot: null,
    glyph: "shield",
    hue: 118,
    title: "The IAP vaccine schedule",
    body: "Every vaccine on the Indian schedule, why it’s given and what to do after. Reminders so none slips.",
    tone: "#C5D6C4",
  },
  {
    slot: null,
    glyph: "rupee",
    hue: 265,
    title: "Tests, with Indian prices",
    body: "Scans and blood tests explained in plain words, with what they roughly cost here.",
    tone: "#D8CCE8",
  },
  {
    slot: null,
    glyph: "voice",
    hue: 40,
    title: "Hindi, when you want it",
    body: "Much of pregnancy is written in Hindi, in Devanagari, with narration you can listen to instead of read.",
    tone: "#F7ECD4",
  },
  {
    slot: "keepsake",
    glyph: "journal",
    hue: 16,
    title: "Keepsakes that stay",
    body: "A journal, letters to your baby, a bump-photo flipbook and a booklet of the whole journey.",
    tone: "#D9A08A",
  },
  {
    slot: null,
    glyph: "month",
    hue: 330,
    title: "Birth clubs, by due month",
    body: "Talk to parents due the same month as you. Stories stay stories: they’re never used as medical advice.",
    tone: "#E8C4CE",
  },
];

// Kept for revert — the one-line version these cards replaced (2026-09-25):
// the headline asked the reader to work out that this was a list of promises.
// const never = [
//   "Tell you your ‘chance this month’, or any other personalised odds.",
//   "Diagnose you or your child, or contradict your doctor.",
//   "Guilt you with streaks, points or scores.",
//   "Sell what you tell us, or show it to an employer, insurer or advertiser.",
//   "Hide an advertisement. Anything sponsored says so, in the same place, every time.",
//   "Show a product in a moment of crisis. Those screens show help, and only help.",
// ];
const never = [
  {
    t: "Tell you your odds",
    d: "No “your chance this month”, no success rates. Only facts that are true for everyone, and only when they take pressure off.",
  },
  {
    t: "Diagnose you or your child",
    d: "We explain and help you prepare. Your doctor decides, and if they’ve said something different, they’re right.",
  },
  {
    t: "Guilt you into opening the app",
    d: "No streaks, points or scores. Miss a week and nothing turns red.",
  },
  {
    t: "Sell what you tell us",
    d: "Not to advertisers, employers or insurers. It’s saved on your phone first.",
  },
  {
    t: "Hide an advertisement",
    d: "Anything a brand paid for carries the same “Presented by” label, in the same place, every time.",
  },
  {
    t: "Sell to you in a hard moment",
    d: "Screens about bleeding, loss or feeling low show help. Never a product.",
  },
];

export default function Home() {
  const heroFilm = findVideo("hero-loop");
  const garbhFilm = findVideo("garbh-loop");
  return (
    <>
      {/* HERO */}
      <section className="hero" data-progress aria-labelledby="hero-title">
        <div className="wrap hero__grid">
          <div className="hero__copy">
            <span className="eyebrow">For the whole journey</span>
            <h1 id="hero-title" className="display-xl">
              <span className="hl"><span>A companion</span></span>
              <span className="hl"><span>that <em>stays.</em></span></span>
            </h1>
            <p className="lede rv rv-d2">
              From trying to conceive, through every week of pregnancy, into the years of raising and growing a child. Calm, plain
              words, written for Indian homes, kitchens and hospitals.
            </p>
            <div className="hero__actions rv rv-d3">
              <Link href={getAppHref()} className="btn btn--ink">
                Get the app <Icon name="arrow" />
              </Link>
              <Link href="#stages" className="btn btn--ghost">
                Where are you right now?
              </Link>
            </div>
          </div>
          <div className="hero__art">
            <div className="hero__panel rv-img">
              {heroFilm ? (
                <LoopVideo src={heroFilm} poster={imageSrc("hero-family", "couple")!} label="A painted, gently moving scene of an expecting couple" />
              ) : (
                <Art slot="hero-family" fallback="couple" alt="An expecting couple sitting close, his hand resting over hers on her belly" sizes="(max-width: 900px) 92vw, 560px" priority position="center 30%" />
              )}
            </div>
            <div className="hero__phone">
              <Phone>
                <WeekScreen />
              </Phone>
            </div>
          </div>
        </div>
      </section>

      {/* PROMISES */}
      <section className="promises" aria-label="Three promises">
        <div className="wrap promises__row">
          {promises.map((p, i) => (
            <div key={p.title} className={`promise rv rv-d${i + 1}`}>
              <Mark glyph={p.glyph as Glyph} hue={p.hue} index={i} size={64} />
              <div>
                <p className="promise__title">{p.title}</p>
                <p className="promise__body">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STAGE PICKER */}
      <section className="section stages" id="stages" aria-labelledby="stages-title">
        <div className="wrap">
          <header className="section-head section-head--center">
            <span className="eyebrow eyebrow--plain rv">Four stages, one app</span>
            <h2 id="stages-title" className="display-l rv rv-d1">
              Where are you <em>right now?</em>
            </h2>
            <p className="lede rv rv-d2">Your home changes with you. Pick where you are, and change it whenever life does.</p>
          </header>
          <ul className="stages__grid">
            {stages.map((s, i) => (
              <li key={s.slug} className={`rv rv-d${i + 1}`}>
                <Link href={`/${s.slug}`} data-tilt className="stagecard" style={{ ["--tone" as string]: s.colour, ["--deep" as string]: s.deep }}>
                  <span className="stagecard__art">
                    <Art fallback={s.painting} alt="" sizes="(max-width: 700px) 45vw, 280px" />
                  </span>
                  <span className="stagecard__body">
                    <span className="stagecard__range">{s.range}</span>
                    <span className="stagecard__name">{s.name}</span>
                    <span className="stagecard__go">
                      See what’s inside <Icon name="arrow" size={18} />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* STATEMENT — lit word by word */}
      <section className="statement" aria-label="Why ParentVeda">
        <div className="wrap">
          <ScrollWords text="Most apps in this space are a tracker with articles stapled on, and they stop at the delivery room. ParentVeda *stays* — from the first try, through *forty weeks,* into the *first steps* and the *first school bag.*" />
        </div>
      </section>

      {/* JOURNEY — the thread */}
      <Journey />

      {/* ASK VEDA */}
      <section className="section askband" aria-labelledby="ask-title">
        <div className="wrap askband__grid">
          <div className="askband__copy">
            <span className="eyebrow rv">Ask Veda</span>
            <h2 id="ask-title" className="display-l rv rv-d1">
              The 2 a.m. question, <em>answered calmly.</em>
            </h2>
            <p className="lede rv rv-d2">
              Ask anything in your own words. Veda answers from ParentVeda’s own library, in the same clear shape every time, and
              tells you plainly when it doesn’t know.
            </p>
            <ul className="ticks rv rv-d3">
              <li><Icon name="check" size={18} /> Answers from our library, never improvised</li>
              <li><Icon name="check" size={18} /> Red flags skip the AI and go straight to “call your doctor”</li>
              <li><Icon name="check" size={18} /> Other parents’ experiences are never used as a medical source</li>
            </ul>
            <Link href="/ask-veda" className="link rv rv-d4">
              How Ask Veda works
            </Link>
          </div>
          <div className="rv rv-d2">
            <AskVedaDemo />
          </div>
        </div>
        <div className="askband__drift">
          <p className="wrap small askband__driftlabel">Questions families bring to Veda</p>
          <QuestionDrift />
        </div>
      </section>

      {/* GARBH SANSKAR */}
      <section className="section garbh" aria-labelledby="garbh-title">
        <div className="wrap garbh__grid">
          <div className="garbh__art rv-img">
            {garbhFilm ? (
              <LoopVideo src={garbhFilm} poster={imageSrc("garbh-sanskar", "plan")!} label="A painted, gently moving scene of a pregnant woman listening to music" />
            ) : (
              <Art slot="garbh-sanskar" fallback="plan" alt="A pregnant woman sitting cross-legged, reading quietly" sizes="(max-width: 900px) 92vw, 520px" />
            )}
          </div>
          <div className="garbh__copy">
            <span className="eyebrow rv">Garbh Sanskar</span>
            <h2 id="garbh-title" className="display-l rv rv-d1">
              An old practice, <em>offered gently.</em>
            </h2>
            <p className="lede rv rv-d2">
              Trimester-wise practice: sound, thought, conversation and breath. A few minutes a day, never a pressure, never a
              promise about your baby.
            </p>
            <ul className="pillars">
              {pillars.map((p, i) => (
                <li key={p.name} className={`rv rv-d${i + 1}`}>
                  <Mark glyph={p.glyph as Glyph} hue={36} index={i + 1} size={60} />
                  <span>
                    <b>{p.name}</b>
                    {p.line}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* MADE FOR INDIAN HOMES */}
      <section className="section homes" aria-labelledby="homes-title">
        <div className="wrap">
          <header className="section-head">
            <span className="eyebrow rv">Made here, for here</span>
            <h2 id="homes-title" className="display-l rv rv-d1">
              Written for the family <em>you actually have.</em>
            </h2>
            <p className="lede rv rv-d2">
              Your mother-in-law’s advice, your doctor’s instructions and the internet rarely agree. ParentVeda starts from how
              Indian families actually live, and is honest about the rest.
            </p>
          </header>
          <ul className="bento">
            {homes.map((h, i) => (
              <li key={h.title} data-tilt className={`bento__tile bento__tile--${i + 1} rv rv-d${(i % 3) + 1}`} style={{ ["--tone" as string]: h.tone }}>
                {h.slot && hasImage(h.slot) && (
                  <span className="bento__img">
                    <Art slot={h.slot} alt="" sizes="(max-width: 700px) 92vw, 400px" />
                  </span>
                )}
                <span className="bento__icon"><Mark glyph={h.glyph as Glyph} hue={h.hue} index={i} size={68} /></span>
                <h3>{h.title}</h3>
                <p>{h.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FATHERS */}
      <section className="fathers" aria-labelledby="fathers-title">
        <div className="wrap fathers__grid">
          <div className="fathers__copy">
            <span className="eyebrow eyebrow--plain rv">For fathers</span>
            <h2 id="fathers-title" className="display-l rv rv-d1">
              He gets his own app. <em>Not a copy of hers.</em>
            </h2>
            <p className="lede rv rv-d2">
              A daily moment, a page for every week, things to read aloud to the bump, and a plain list of what to do next. He
              joins with her code.
            </p>
            <ul className="ticks ticks--light rv rv-d3">
              <li><Icon name="check" size={18} /> He can read what she shares. He can never change it.</li>
              <li><Icon name="check" size={18} /> While trying, he sees the chapter you’re in, never your raw cycle.</li>
            </ul>
            <Link href="/fathers" className="btn btn--light rv rv-d4">
              See the father’s side <Icon name="arrow" />
            </Link>
          </div>
          <div className="fathers__art rv-img">
            <Art slot="father" fallback="partner" alt="A young father smiling, looking to one side" sizes="(max-width: 900px) 92vw, 480px" />
          </div>
        </div>
      </section>

      {/* NEVER */}
      <section className="section never" aria-labelledby="never-title">
        <div className="wrap never__grid">
          <header>
            <span className="eyebrow eyebrow--plain rv">Our promises</span>
            <h2 id="never-title" className="display-l rv rv-d1">
              Six things ParentVeda <em>will never do.</em>
            </h2>
            <p className="lede rv rv-d2">
              Most apps like this make money by worrying you, scoring you or selling what you tell them. We’ve ruled all of that
              out, and the rules are built into the app itself, so no future update can quietly bend them.
            </p>
            <p className="never__sign rv rv-d3">Calm is a feature. So is saying no.</p>
          </header>
          <ol className="never__list">
            {never.map((n, i) => (
              <li key={n.t} style={{ ["--i" as string]: i }}>
                <span className="never__top">
                  <span className="never__no">
                    <Icon name="x" size={14} /> Never
                  </span>
                  <span className="never__count">
                    {i + 1} of {never.length}
                  </span>
                </span>
                <h3>{n.t}</h3>
                <p>{n.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* LATEST ARTICLES */}
      <section className="section" aria-labelledby="latest-title" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <div className="latest__head">
            <div>
              <span className="eyebrow rv">Articles</span>
              <h2 id="latest-title" className="display-l rv rv-d1">
                Read something <em>calm.</em>
              </h2>
            </div>
            <Link href="/articles" className="btn btn--ghost rv">
              All articles <Icon name="arrow" />
            </Link>
          </div>
          <ul className="rmore">
            {getArticles()
              .slice(0, 3)
              .map((a) => {
                const s = getStage(a.stage);
                return (
                  <li key={a.slug} className="rv">
                    <Link href={`/articles/${a.slug}`} style={{ ["--tone" as string]: s?.colour, ["--deep-tone" as string]: s?.deep }}>
                      <span className="rmore__cat">{a.category}</span>
                      <span className="rmore__t">{a.title}</span>
                      <span className="rmore__m">
                        {a.minutes} min read <Icon name="arrow" size={16} />
                      </span>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      </section>

      <Faq items={homeFaq} />
      <CtaBand />
    </>
  );
}

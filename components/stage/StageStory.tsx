import Link from "next/link";
import Icon from "../Icon";
import Art from "../Art";
import Mark, { type Glyph } from "../Mark";
import StageNow from "./StageNow";
import { hueOf } from "@/lib/color";
import type { Stage, Story } from "@/lib/stages";

// The story layout for a stage page, in the order VOICE.md asks for:
// where you are → what matters for your child now → where you are in it →
// the guides that help → how ParentVeda walks with you → the small things.
//
// Colour carries meaning here: each pillar wears its own painting-palette
// tone, and every guide under it wears the same one, so the page reads as
// four places rather than one long pink field.

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const toneVars = (tone: string, deep: string) => ({ ["--gtone" as string]: tone, ["--gdeep" as string]: deep });

export default function StageStory({ stage, story }: { stage: Stage; story: Story; hue?: number }) {
  return (
    <>
      {/* where you are, and what matters for your child now */}
      <section className="section sfeel" aria-labelledby="feel-title">
        <div className="wrap">
          <header className="sfeel__head">
            <span className="eyebrow rv">Where you are</span>
            <h2 id="feel-title" className="display-l rv rv-d1">
              {story.feel.title}
            </h2>
            <p className="lede rv rv-d2">{story.feel.body}</p>
          </header>
          <div className="sfeel__sub rv">
            <h3>{story.pillarsTitle}</h3>
            <p>{story.pillarsLede}</p>
          </div>
          <ul className="spillars" style={{ ["--pc" as string]: story.pillars.length }}>
            {story.pillars.map((p, i) => {
              const count = story.guides.filter((g) => g.pillar === p.id).length;
              return (
                <li key={p.id} className={`rv rv-d${i + 1}`} style={toneVars(p.tone, p.deep)}>
                  <a href={`#pillar-${p.id}`} className="spillar" data-tilt>
                    <Mark glyph={p.glyph as Glyph} hue={hueOf(p.tone)} index={i} size={84} />
                    <b>{p.title}</b>
                    <span>{p.body}</span>
                    <em>
                      {count} {count === 1 ? "guide" : "guides"} <Icon name="arrowDown" size={15} />
                    </em>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* where you are in it — or, for a stage without steps, a starting order */}
      <section className="sstart" aria-label={story.now ? story.now.title : "Where to start"}>
        <div className="wrap">
          {story.now ? (
            <div className="rv">
              <StageNow title={story.now.title} lede={story.now.lede} steps={story.now.steps} />
            </div>
          ) : (
            <div className="sstart__card rv">
              <h2 className="sstart__title">
                New to this? <em>Start here.</em>
              </h2>
              <ol className="sstart__steps">
                {story.startHere.map((st, i) => (
                  <li key={st.guide}>
                    <a href={`#guide-${slug(st.guide)}`}>
                      <span className="sstart__n">{i + 1}</span>
                      <span>
                        <b>{st.guide}</b>
                        {st.why}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </section>

      {/* the guides, each under the pillar it serves, in that pillar's colour */}
      <section className="section sguides" id="doors" aria-labelledby="guides-title">
        <div className="wrap">
          <header className="section-head">
            <span className="eyebrow rv">The guides</span>
            <h2 id="guides-title" className="display-l rv rv-d1">
              {story.guidesTitle}
            </h2>
            <p className="lede rv rv-d2">{story.guidesLede}</p>
          </header>
          {story.pillars.map((p, pi) => {
            const guides = story.guides.filter((g) => g.pillar === p.id);
            if (!guides.length) return null;
            return (
              <div key={p.id} className="sguides__group" id={`pillar-${p.id}`} style={toneVars(p.tone, p.deep)}>
                {p.pause && (
                  <figure className="spause rv">
                    <blockquote>{p.pause.quote}</blockquote>
                    <figcaption>{p.pause.source}</figcaption>
                  </figure>
                )}
                <h3 className="sguides__ghead rv">
                  <Mark glyph={p.glyph as Glyph} hue={hueOf(p.tone)} index={pi} size={44} />
                  {p.title}
                </h3>
                <ul className="sguides__grid">
                  {guides.map((g, gi) => (
                    <li
                      key={g.name}
                      id={`guide-${slug(g.name)}`}
                      className={`guide${g.featured ? " guide--featured" : ""}${g.image ? " guide--pic" : ""}${g.status === "soon" ? " guide--soon" : ""} rv rv-d${(gi % 3) + 1}`}
                    >
                      {g.image && (
                        <span className="guide__pic">
                          <Art slot={g.image.slot} fallback={g.image.fallback} alt={g.image.alt} sizes="(max-width: 900px) 92vw, 360px" />
                        </span>
                      )}
                      <span className="guide__body">
                        <span className="guide__top">
                          <span className="guide__name">{g.name}</span>
                          {g.status && g.status !== "open" && (
                            <span className={`guide__status guide__status--${g.status}`}>{g.status === "soon" ? "Coming soon" : "Growing"}</span>
                          )}
                          {g.status === "open" && <span className="guide__status guide__status--open">Open now</span>}
                        </span>
                        <p className="guide__q">“{g.question}”</p>
                        <p className="guide__why">{g.why}</p>
                        <span className="guide__inside">
                          <span className="guide__label">
                            {g.status === "soon" ? "What it will cover" : g.status === "growing" ? "Already inside" : "Inside"}
                          </span>
                          <ul>
                            {g.inside.map((x) => (
                              <li key={x}>
                                <Icon name="check" size={16} /> {x}
                              </li>
                            ))}
                          </ul>
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          <Link href="/ask-veda" className="sguides__ask rv">
            <span>
              <b>Something else on your mind?</b>
              Ask Veda in your own words. If it isn’t in our library, it says so, and never guesses.
            </span>
            <span className="door--more__go">
              Ask Veda <Icon name="arrow" size={18} />
            </span>
          </Link>
        </div>
      </section>

      {/* how ParentVeda walks with you — one day, on the thread */}
      <section className="section sday" aria-labelledby="day-title">
        <div className="wrap">
          <header className="section-head">
            <span className="eyebrow rv">How we walk with you</span>
            <h2 id="day-title" className="display-l rv rv-d1">
              {story.dayTitle}
            </h2>
            <p className="lede rv rv-d2">{story.dayLede}</p>
          </header>
          <ol className="sday__line" style={{ ["--n" as string]: story.day.length }}>
            {story.day.map((m, i) => {
              const p = story.pillars[i % story.pillars.length];
              return (
                <li key={m.when} className={`rv rv-d${(i % 5) + 1}`} style={toneVars(p.tone, p.deep)}>
                  <span className="sday__when">{m.when}</span>
                  <Mark glyph={m.glyph as Glyph} hue={hueOf(p.tone)} index={i + 1} size={64} />
                  <b>{m.title}</b>
                  <p>{m.body}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* the tools, as things you'll actually do */}
      <section className="section sdoing" aria-labelledby="doing-title" style={{ paddingTop: 0 }}>
        <div className="wrap split">
          <header>
            <span className="eyebrow rv">Tools</span>
            <h2 id="doing-title" className="display-m rv rv-d1">
              {story.doingTitle}
            </h2>
            <p className="rv rv-d2">Each one saves to your phone first, and none of them needs an account to start.</p>
          </header>
          <div style={{ display: "grid", gap: 28 }}>
            <ul className="sdoing__list">
              {story.doing.map((d) => (
                <li key={d.tool} className="rv">
                  <b>{d.tool}</b>
                  <span>{d.action}</span>
                </li>
              ))}
            </ul>
            <div className="care rv">
              <Icon name="doctor" size={26} />
              <p>{stage.care}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


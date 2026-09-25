import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Art from "@/components/Art";
import Icon from "@/components/Icon";
import CtaBand from "@/components/CtaBand";
import { stages, getStage } from "@/lib/stages";
import { getAppHref } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return stages.map((s) => ({ stage: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ stage: string }> }): Promise<Metadata> {
  const s = getStage((await params).stage);
  if (!s) return {};
  return { title: `${s.name} · ${s.range}`, description: s.intro };
}

// "*text*" in a title becomes the italic half of the line
function Title({ text }: { text: string }) {
  const [a, b] = text.split("*").filter((x, i) => i < 2 || x);
  return (
    <>
      {a}
      {b && <em>{b}</em>}
    </>
  );
}

export default async function StagePage({ params }: { params: Promise<{ stage: string }> }) {
  const s = getStage((await params).stage);
  if (!s) notFound();
  const next = s.next ? getStage(s.next) : undefined;
  const vars = { ["--tone" as string]: s.colour, ["--deep-tone" as string]: s.deep };

  return (
    <div style={vars}>
      <section className="phero" aria-labelledby="stage-title">
        <div className="wrap phero__grid">
          <div className="phero__copy">
            <span className="phero__range">{s.range}</span>
            <h1 id="stage-title" className="display-xl">
              <span className="hl">
                <span>
                  <Title text={s.title} />
                </span>
              </span>
            </h1>
            <p className="lede rv rv-d2">{s.intro}</p>
            <div className="hero__actions rv rv-d3">
              <Link href={getAppHref()} className="btn btn--ink">
                Start with {s.short.toLowerCase()} <Icon name="arrow" />
              </Link>
              <Link href="#doors" className="btn btn--ghost">
                What’s inside
              </Link>
            </div>
          </div>
          <div className="phero__art rv-img">
            <Art slot={s.image} fallback={s.painting} alt="" sizes="(max-width: 900px) 92vw, 480px" priority />
          </div>
        </div>
      </section>

      <section className="section" id="doors" aria-labelledby="doors-title" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <header className="section-head">
            <span className="eyebrow rv">The doors</span>
            <h2 id="doors-title" className="display-l rv rv-d1">
              {s.doorsTitle}
            </h2>
          </header>
          <ul className="doors">
            {s.doors.map((d, i) => (
              <li key={d.name} className={`rv rv-d${(i % 4) + 1}`}>
                <div className="door">
                  <h3>{d.name}</h3>
                  <p>{d.line}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="hl-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <header className="section-head">
            <span className="eyebrow rv">How it helps</span>
            <h2 id="hl-title" className="display-l rv rv-d1">
              What makes it <em>different.</em>
            </h2>
          </header>
          <div className="feat">
            {s.highlights.map((h, i) => (
              <div key={h.title} className={`rv rv-d${(i % 3) + 1}`}>
                <h3>{h.title}</h3>
                <p>{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="tools-title" style={{ paddingTop: 0 }}>
        <div className="wrap split">
          <header>
            <span className="eyebrow rv">Tools</span>
            <h2 id="tools-title" className="display-m rv rv-d1">
              {s.toolsTitle}
            </h2>
          </header>
          <div style={{ display: "grid", gap: 28 }}>
            <ul className="tools">
              {s.tools.map((t) => (
                <li key={t} className="rv">
                  {t}
                </li>
              ))}
            </ul>
            <div className="care rv">
              <Icon name="doctor" size={26} />
              <p>{s.care}</p>
            </div>
          </div>
        </div>
      </section>

      {next && (
        <section className="section" style={{ paddingTop: 0 }} aria-label="The next stage">
          <div className="wrap">
            <Link
              href={`/${next.slug}`}
              className="nextstage rv"
              style={{ ["--tone" as string]: next.colour, ["--deep-tone" as string]: next.deep }}
            >
              <span>
                <small>And when it’s time · {next.range}</small>
                <b>{next.name} carries on from here.</b>
              </span>
              <i>
                <Icon name="arrow" />
              </i>
            </Link>
          </div>
        </section>
      )}

      <CtaBand />
    </div>
  );
}

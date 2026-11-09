"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

/* The /experts/ grid with its filter chips. A client island only because the
   chips filter in place; every card is still a plain link to the profile, and
   the full list is in the server-rendered HTML for search engines. */

export type DirectoryExpert = {
  slug: string;
  href: string;
  name: string;
  credentials?: string;
  role: string;
  field: string;
  group?: string;
  founding?: boolean;
  initials: string;
  photo?: string;
  meta: string;
  helps: string;
};

const TONES: Record<string, string> = {
  fertility: "#E8C4CE",
  pregnancy: "#D8CCE8",
  birth: "#E8D9C0",
  pelvic: "#C5D6C4",
  nutrition: "#E8D9C0",
  yoga: "#D8CCE8",
  child: "#C5D6C4",
};

export function expertTone(group?: string): string {
  return (group && TONES[group]) || "#E8C4CE";
}

export default function ExpertDirectory({
  experts,
  groups,
}: {
  experts: DirectoryExpert[];
  groups: { key: string; label: string }[];
}) {
  const [group, setGroup] = useState("all");
  const counts = Object.fromEntries(groups.map((g) => [g.key, experts.filter((e) => e.group === g.key).length]));
  const shown = group === "all" ? experts : experts.filter((e) => e.group === group);

  return (
    <>
      <div className="xchips" role="group" aria-label="Filter experts">
        <button type="button" aria-pressed={group === "all"} onClick={() => setGroup("all")}>
          All <span>{experts.length}</span>
        </button>
        {groups
          .filter((g) => counts[g.key])
          .map((g) => (
            <button key={g.key} type="button" aria-pressed={group === g.key} onClick={() => setGroup(g.key)}>
              {g.label} <span>{counts[g.key]}</span>
            </button>
          ))}
      </div>
      <ul className="agrid xgrid">
        {shown.map((e) => (
          <li key={e.slug}>
            <Link href={e.href} className="acard xcard" style={{ ["--tone" as string]: expertTone(e.group) }}>
              <span className="xcard__cover" aria-hidden="true">
                <span className="acard__disc" />
                {e.founding ? <span className="xbadge">Founding expert</span> : null}
                {e.photo ? (
                  <Image src={e.photo} alt="" width={80} height={80} className="xavatar" />
                ) : (
                  <span className="xavatar">{e.initials}</span>
                )}
                <span className="acard__cat">{e.field}</span>
              </span>
              <span className="acard__body">
                <span className="acard__title">{e.name}</span>
                {e.credentials ? <span className="xcard__cred">{e.credentials}</span> : null}
                <span className="acard__desc">{e.role}</span>
                {e.meta ? <span className="acard__meta">{e.meta}</span> : null}
                <span className="xcard__helps">Helps with {e.helps}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

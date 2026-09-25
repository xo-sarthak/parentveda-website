"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, getAppHref } from "@/lib/site";
import Icon from "./Icon";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const slate = pathname === "/fathers";

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className={`hdr${scrolled ? " hdr--scrolled" : ""}${slate ? " hdr--slate" : ""}${open ? " hdr--open" : ""}`}>
      <div className="hdr__bar">
        <Link href="/" className="hdr__brand" aria-label="ParentVeda home">
          <Image src="/brand/pv-mark.png" alt="" width={34} height={34} priority />
          <span>ParentVeda</span>
        </Link>
        <nav className="hdr__nav" aria-label="Main">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={pathname.startsWith(n.href) ? "is-active" : undefined} aria-current={pathname === n.href ? "page" : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>
        <Link href={getAppHref()} className="btn btn--ink btn--sm hdr__cta">
          Get the app
        </Link>
        <button className="hdr__menu" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((o) => !o)}>
          <Icon name={open ? "x" : "menu"} />
          <span className="visually-hidden">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>
      <div id="mobile-nav" className="hdr__sheet" hidden={!open}>
        <nav aria-label="Mobile">
          {nav.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
              <Icon name="arrow" size={18} />
            </Link>
          ))}
          <Link href="/fathers">For fathers</Link>
          <Link href="/about">About ParentVeda</Link>
          <Link href="/partners">Doctors, employers & brands</Link>
          <Link href="/contact">Contact us</Link>
        </nav>
        <Link href={getAppHref()} className="btn btn--ink">
          Get the app
        </Link>
      </div>
    </header>
  );
}

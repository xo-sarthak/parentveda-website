import Link from "next/link";
import Icon from "@/components/Icon";

/* Shown on sensitive pages (a loss, a diagnosis, failed IVF) in place of the
   newsletter and shopping blocks. Two sentences each, nothing to sell.
   The Tele-MANAS number is in docs/website-upgrade/medical-review-items.md. */
export default function SupportCard({ href = "/contact/" }: { href?: string }) {
  return (
    <aside className="support" aria-labelledby="support-title">
      <Icon name="doctor" size={26} />
      <div>
        <p className="support__h" id="support-title">
          Talk to someone
        </p>
        <p>
          You do not have to carry this alone. A counsellor or a specialist can listen, answer your questions and help you
          think about what comes next.
        </p>
        <p>
          <Link href={href} className="link">
            Ask us to find the right person
          </Link>
        </p>
        <p className="support__line">
          You are not alone. If you want to talk to someone today, Tele-MANAS is free and open day and night: call{" "}
          <a href="tel:14416">14416</a>.
        </p>
      </div>
    </aside>
  );
}

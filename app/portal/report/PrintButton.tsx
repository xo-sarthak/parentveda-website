"use client";

/**
 * The only client component on the report.
 *
 * `window.print()` needs a browser, which is the whole reason this is split out
 * rather than the page being a client component: everything else on the report
 * is server-rendered, so the figures never travel to the browser as data — only
 * as the finished HTML someone reads.
 */
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn btn--ink btn--sm p-print"
    >
      Print or save as PDF
    </button>
  );
}

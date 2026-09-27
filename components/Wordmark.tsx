// The ParentVeda wordmark — the lettering from the logo itself, not a font
// that looks like it. Cut from public/brand/pv-lockup.png and used as a mask,
// so one shape can wear the brand purple on light ground and white on dark.
export default function Wordmark({ className }: { className?: string }) {
  return <span className={`wordmark ${className ?? ""}`} role="img" aria-label="ParentVeda" />;
}

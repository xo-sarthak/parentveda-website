// Line icons only — the app's rule (no decorative emoji in chrome).
// Drawn on a 24px grid, 1.75 stroke, in the lucide idiom.

const paths: Record<string, React.ReactNode> = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowDown: <path d="M12 5v14M6 13l6 6 6-6" />,
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </>
  ),
  doctor: (
    <>
      <circle cx="12" cy="7.5" r="3.5" />
      <path d="M5 20.5c.6-3.8 3.4-6 7-6s6.4 2.2 7 6" />
      <path d="M12 16.5v3M10.5 18h3" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z" />
      <path d="M5 19 13 11" />
    </>
  ),
  message: <path d="M4.5 6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H10l-4.5 3.5V16.5h-1v-10Z" />,
  phone: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </>
  ),
  heart: <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20Z" />,
  book: (
    <>
      <path d="M4.5 5.5c2.5-1 5-1 7.5.5v13c-2.5-1.5-5-1.5-7.5-.5v-13Z" />
      <path d="M19.5 5.5c-2.5-1-5-1-7.5.5v13c2.5-1.5 5-1.5 7.5-.5v-13Z" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </>
  ),
  moon: <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5Z" />,
  check: <path d="M5 12.5 10 17.5 19 7" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  play: <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />,
  language: (
    <>
      <path d="M4 5.5h9M8.5 3.5v2M6 5.5c.5 3 2.5 5.5 5.5 7M11 5.5c-.8 3.6-3.3 6.5-6.5 8" />
      <path d="M13 20.5 16.5 12l3.5 8.5M14.2 17.5h4.6" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
      <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
    </>
  ),
  bowl: (
    <>
      <path d="M3.5 11.5h17a8.5 8.5 0 0 1-17 0Z" />
      <path d="M9 8c0-1.5 1-1.5 1-3M13 8c0-1.5 1-1.5 1-3" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 5.5v6c0 4.5 3 7.7 7 9.5 4-1.8 7-5 7-9.5v-6L12 3Z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  sprout: (
    <>
      <path d="M12 20.5V11" />
      <path d="M12 11c0-3.5-2.5-6-7-6 0 4 2.5 6 7 6ZM12 13c0-3.5 2.5-6 7-6 0 4-2.5 6-7 6Z" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19.5c.5-3.3 2.6-5.3 5.5-5.3s5 2 5.5 5.3" />
      <path d="M15.5 5a3.2 3.2 0 0 1 0 6.2M17 14.4c2 .6 3.2 2.4 3.5 5.1" />
    </>
  ),
  bookmark: <path d="M7 3.5h10v17l-5-3.5-5 3.5v-17Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  sound: (
    <>
      <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" />
      <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
    </>
  ),
  breath: <path d="M3.5 9h11a2.5 2.5 0 1 0-2.5-2.5M3.5 13h15a2.5 2.5 0 1 1-2.5 2.5M3.5 17h7" />,
  tag: (
    <>
      <path d="M3.5 12.5v-8h8l9 9-8 8-9-9Z" />
      <circle cx="8" cy="8.5" r="1.3" />
    </>
  ),
  trash: <path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" />,
  flag: <path d="M5.5 21V4M5.5 4.5h11l-2 4 2 4h-11" />,
  whatsapp: (
    <>
      <path d="M4 20.5l1.3-4A8.3 8.3 0 1 1 8.6 19.3L4 20.5Z" />
      <path d="M9 8.5c0 3.5 2.5 6.5 6.5 6.5l1-1.5-2-1-1 .8c-1.2-.5-2.3-1.6-2.8-2.8l.8-1-1-2L9 8.5Z" />
    </>
  ),
};

export default function Icon({ name, size = 22, className }: { name: keyof typeof paths | string; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}

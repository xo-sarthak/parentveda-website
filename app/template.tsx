// Re-mounts on every navigation, so each page arrives with the same short
// rise-and-settle. The header and footer live in the layout and stay put.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="pagein">{children}</div>;
}

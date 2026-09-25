import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

// A picture slot that is never empty.
//
// `slot` names a file the owner will drop into public/images/ (the ChatGPT
// prompts in README.md list every one). Until it exists, the slot shows
// `fallback` — one of the app's own onboarding paintings — so the site is
// complete today and simply gets richer as the images arrive. The check runs
// at build time on the server, so no request is ever made for a missing file.

const EXT = [".webp", ".jpg", ".jpeg", ".png", ".avif"];

function findImage(slot: string) {
  for (const ext of EXT) {
    const rel = `/images/${slot}${ext}`;
    if (fs.existsSync(path.join(process.cwd(), "public", rel))) return rel;
  }
  return null;
}

export function hasImage(slot: string) {
  return findImage(slot) !== null;
}

// A film slot: public/videos/<slot>.mp4 (or .webm). Null until it exists.
export function findVideo(slot: string) {
  for (const ext of [".mp4", ".webm"]) {
    const rel = `/videos/${slot}${ext}`;
    if (fs.existsSync(path.join(process.cwd(), "public", rel))) return rel;
  }
  return null;
}

export function imageSrc(slot: string | undefined, fallback?: string) {
  return (slot && findImage(slot)) || (fallback ? `/paintings/${fallback}.webp` : null);
}

type Props = {
  slot?: string;
  fallback?: string; // painting name under /paintings
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  position?: string;
};

export default function Art({ slot, fallback, alt, sizes, priority, className, position }: Props) {
  const src = (slot && findImage(slot)) || (fallback ? `/paintings/${fallback}.webp` : null);
  if (!src) return null;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      style={{ objectFit: "cover", objectPosition: position ?? "center" }}
    />
  );
}

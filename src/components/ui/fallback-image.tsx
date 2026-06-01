"use client";

import { useState } from "react";

/**
 * Görsel henüz üretilmemişse (404) kırık ikon yerine fallback'e düşer.
 * error/not-found gibi özel sayfalarda özel görsel + logo fallback için.
 */
export function FallbackImage({
  src,
  fallback,
  alt = "",
  width,
  className,
}: {
  src: string;
  fallback: string;
  alt?: string;
  width: number;
  className?: string;
}) {
  const [current, setCurrent] = useState(src);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      width={width}
      className={className}
      aria-hidden={alt === ""}
      onError={() => current !== fallback && setCurrent(fallback)}
    />
  );
}

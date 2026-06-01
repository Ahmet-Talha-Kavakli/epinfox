"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const SLIDES = ["/hero/hero-1.jpg", "/hero/hero-2.jpg", "/hero/hero-3.jpg", "/hero/hero-4.jpg"];
const INTERVAL = 5000;

export function HeroCarousel() {
  const [active, setActive] = useState(0);

  const next = useCallback(() => setActive((i) => (i + 1) % SLIDES.length), []);

  useEffect(() => {
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [next, active]);

  return (
    <div className="relative mx-auto mt-10 aspect-[16/7] w-full max-w-4xl overflow-hidden rounded-3xl border border-ink-200 shadow-float">
      {SLIDES.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={i === 0}
          sizes="(max-width: 1024px) 100vw, 896px"
          className={
            "object-cover transition-opacity duration-1000 " +
            (i === active ? "opacity-100" : "opacity-0")
          }
          aria-hidden
        />
      ))}
      {/* Alt karartma + dot nav */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Slayt ${i + 1}`}
            className={
              "h-2 rounded-full transition-all " +
              (i === active ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80")
            }
          />
        ))}
      </div>
    </div>
  );
}

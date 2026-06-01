"use client";

import { useState } from "react";
import { Star } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

/** Salt-okunur yıldız gösterimi (yarım yıldız desteği yok, yuvarlar). */
export function Stars({
  value,
  size = 16,
  className,
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          weight={i <= Math.round(value) ? "fill" : "regular"}
          className={i <= Math.round(value) ? "text-warning-500" : "text-ink-300"}
        />
      ))}
    </span>
  );
}

/** Tıklanabilir yıldız seçici (form için). */
export function StarPicker({
  value,
  onChange,
  size = 28,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}) {
  const { t } = useI18n();
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="inline-flex items-center gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          aria-label={t("c3.star.label").replace("{i}", String(i))}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={size}
            weight={i <= shown ? "fill" : "regular"}
            className={i <= shown ? "text-warning-500" : "text-ink-300"}
          />
        </button>
      ))}
    </div>
  );
}

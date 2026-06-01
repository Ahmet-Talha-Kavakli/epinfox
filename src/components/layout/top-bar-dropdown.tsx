"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { CaretDown, type Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export interface TopBarItem {
  href: string;
  label: string;
  icon?: Icon;
}

/** Üst şerit dropdown'ı (Yayıncılar / Bayiler) — hover + tıkla açılır. */
export function TopBarDropdown({
  label,
  icon: TriggerIcon,
  items,
}: {
  label: string;
  icon: Icon;
  items: TopBarItem[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function enter() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }
  function leave() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-semibold transition-colors",
          open
            ? "border-brand-300 bg-brand-50 text-brand-700"
            : "border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700",
        )}
      >
        <TriggerIcon size={15} weight="duotone" />
        {label}
        <CaretDown
          size={11}
          weight="bold"
          className={cn("transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 pt-2">
          <ul className="min-w-44 origin-top-right animate-scale-in overflow-hidden rounded-xl border border-ink-200 bg-white py-1 shadow-float">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
                >
                  {item.icon && <item.icon size={16} weight="duotone" />}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

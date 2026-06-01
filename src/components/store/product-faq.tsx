"use client";

import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  q: string;
  a: string;
}

export function ProductFaq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-ink-200 overflow-hidden rounded-2xl border border-ink-200 bg-white">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-ink-50"
            >
              <span className="text-sm font-medium text-ink-900">{item.q}</span>
              <CaretDown
                size={16}
                weight="bold"
                className={cn(
                  "shrink-0 text-ink-400 transition-transform duration-200",
                  isOpen && "rotate-180 text-brand-600",
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-200 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-sm leading-relaxed text-ink-600">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

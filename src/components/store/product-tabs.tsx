"use client";

import { useState } from "react";
import {
  GameController,
  ListBullets,
  Question,
  ChatCircleDots,
} from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export type ProductTabKey = "products" | "description" | "howto" | "reviews";

const TABS: {
  key: ProductTabKey;
  labelKey: string;
  shortKey: string;
  icon: typeof GameController;
}[] = [
  {
    key: "products",
    labelKey: "product.tabProducts",
    shortKey: "product.tabProducts",
    icon: GameController,
  },
  {
    key: "description",
    labelKey: "product.tabDescription",
    shortKey: "product.tabDescription",
    icon: ListBullets,
  },
  {
    key: "howto",
    labelKey: "product.tabHowto",
    shortKey: "product.howToUse",
    icon: Question,
  },
  {
    key: "reviews",
    labelKey: "product.tabReviews",
    shortKey: "product.tabReviewsShort",
    icon: ChatCircleDots,
  },
];

export function ProductTabs({
  reviewCount,
  products,
  description,
  howto,
  reviews,
}: {
  reviewCount: number;
  products: React.ReactNode;
  description: React.ReactNode;
  howto: React.ReactNode;
  reviews: React.ReactNode;
}) {
  const { t } = useI18n();
  const [active, setActive] = useState<ProductTabKey>("products");

  const content: Record<ProductTabKey, React.ReactNode> = {
    products,
    description,
    howto,
    reviews,
  };

  return (
    <div className="rounded-3xl border border-ink-200 bg-white">
      {/* Sekme başlıkları */}
      <div className="flex flex-wrap gap-1 border-b border-ink-200 px-2 sm:px-4">
        {TABS.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={cn(
                "relative inline-flex items-center gap-2 px-3 py-4 text-sm font-semibold transition-colors sm:px-4",
                isActive ? "text-brand-600" : "text-ink-500 hover:text-ink-800",
              )}
            >
              <tab.icon size={17} weight={isActive ? "fill" : "duotone"} />
              <span className="hidden sm:inline">{t(tab.labelKey)}</span>
              <span className="sm:hidden">{t(tab.shortKey)}</span>
              {tab.key === "reviews" && reviewCount > 0 && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    isActive ? "bg-brand-100 text-brand-700" : "bg-ink-100 text-ink-500",
                  )}
                >
                  {reviewCount}
                </span>
              )}
              {/* Aktif alt çizgi */}
              <span
                className={cn(
                  "absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-brand-600 transition-opacity",
                  isActive ? "opacity-100" : "opacity-0",
                )}
              />
            </button>
          );
        })}
      </div>

      {/* İçerik */}
      <div className="p-4 sm:p-6">{content[active]}</div>
    </div>
  );
}

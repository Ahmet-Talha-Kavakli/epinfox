"use client";

import { useState } from "react";
import {
  Minus,
  Plus,
  ShoppingCart,
  Check,
  CheckCircle,
  XCircle,
} from "@phosphor-icons/react";
import { Price } from "@/components/store/price";
import { discountPct } from "@/lib/format";
import { useCart } from "@/lib/cart/provider";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import type { VariantWithStock } from "@/lib/supabase/types";

interface TableProduct {
  slug: string;
  name: string;
  imagePath: string | null;
  description: string | null;
  autoSupply: boolean;
}

/** Hipopotam tarzı varyant tablosu — her satırda adet + Sepete Ekle. */
export function VariantTable({
  variants,
  product,
}: {
  variants: VariantWithStock[];
  product: TableProduct;
}) {
  const { t } = useI18n();

  if (variants.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-ink-200 py-10 text-center text-sm text-ink-400">
        {t("product.noOptions")}
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-200">
      {/* Başlık satırı (desktop) */}
      <div className="hidden items-center gap-4 border-b border-ink-200 bg-ink-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-ink-500 md:flex">
        <span className="flex-1">{t("product.colName")}</span>
        <span className="w-20 text-center">{t("product.colStock")}</span>
        <span className="w-28 text-right">{t("product.colUnitPrice")}</span>
        <span className="w-32 text-center">{t("product.colQty")}</span>
        <span className="w-40 shrink-0 text-right">{t("product.colAddToCart")}</span>
      </div>

      <ul className="divide-y divide-ink-100">
        {variants.map((v) => (
          <VariantRow key={v.id} variant={v} product={product} />
        ))}
      </ul>
    </div>
  );
}

function VariantRow({
  variant,
  product,
}: {
  variant: VariantWithStock;
  product: TableProduct;
}) {
  const { add } = useCart();
  const { t } = useI18n();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const inStock = product.autoSupply || variant.stock > 0;
  const off = discountPct(variant.price, variant.compare_at);
  const maxQty = product.autoSupply ? 20 : Math.min(20, variant.stock || 1);
  const lineTotal = variant.price * qty;

  function addToCart() {
    if (!inStock) return;
    add(
      {
        variantId: variant.id,
        productSlug: product.slug,
        productName: product.name,
        variantLabel: variant.label,
        priceTRY: variant.price,
        imagePath: product.imagePath,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <li className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-ink-50/50 md:flex-row md:items-center md:gap-4">
      {/* Ürün adı + açıklama */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-ink-900">
            {product.name} {variant.label}
          </p>
          {off > 0 && (
            <span className="rounded bg-accent-50 px-1.5 py-0.5 text-[10px] font-bold text-accent-700">
              %{off}
            </span>
          )}
          {variant.bonus_pct > 0 && (
            <span className="rounded bg-success-50 px-1.5 py-0.5 text-[10px] font-bold text-success-700">
              +%{variant.bonus_pct} {t("product.bonusSuffix")}
            </span>
          )}
        </div>
        {product.description && (
          <p className="mt-0.5 line-clamp-1 text-xs text-ink-500">
            {product.description}
          </p>
        )}
      </div>

      {/* Stok */}
      <div className="flex items-center gap-1.5 md:w-20 md:justify-center">
        {inStock ? (
          <CheckCircle size={16} weight="fill" className="text-success-500" />
        ) : (
          <XCircle size={16} weight="fill" className="text-danger-500" />
        )}
        <span className="text-xs font-medium text-ink-500 md:hidden">
          {inStock ? t("product.inStock") : t("product.outOfStock")}
        </span>
      </div>

      {/* Birim fiyat */}
      <div className="md:w-28 md:text-right">
        {off > 0 && (
          <Price
            amountTRY={variant.compare_at!}
            className="mr-1.5 text-xs text-ink-400 line-through"
          />
        )}
        <Price
          amountTRY={variant.price}
          className={cn(
            "text-sm font-bold",
            off > 0 ? "text-accent-600" : "text-ink-900",
          )}
        />
      </div>

      {/* Adet seçici */}
      <div className="flex items-center justify-center md:w-32">
        <div className="inline-flex items-center rounded-lg border border-ink-200">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={!inStock || qty <= 1}
            className="grid h-9 w-9 place-items-center text-ink-500 transition-colors hover:bg-ink-100 disabled:opacity-40"
            aria-label={t("product.decrease")}
          >
            <Minus size={14} weight="bold" />
          </button>
          <span className="w-8 text-center text-sm font-semibold tabular-nums text-ink-900">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
            disabled={!inStock || qty >= maxQty}
            className="grid h-9 w-9 place-items-center text-ink-500 transition-colors hover:bg-ink-100 disabled:opacity-40"
            aria-label={t("product.increase")}
          >
            <Plus size={14} weight="bold" />
          </button>
        </div>
      </div>

      {/* Sepete ekle (satır toplamı + buton) */}
      <div className="flex shrink-0 items-center justify-end gap-2 md:w-40">
        <button
          type="button"
          onClick={addToCart}
          disabled={!inStock}
          className={cn(
            "inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            added
              ? "bg-success-600 text-white"
              : "bg-brand-600 text-white hover:bg-brand-700",
          )}
        >
          {added ? (
            <>
              <Check size={16} weight="bold" /> {t("product.added")}
            </>
          ) : (
            <>
              <ShoppingCart size={16} weight="bold" />
              <Price amountTRY={lineTotal} />
            </>
          )}
        </button>
      </div>
    </li>
  );
}

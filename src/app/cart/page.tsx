"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Show } from "@clerk/nextjs";
import {
  Minus,
  Plus,
  Trash,
  ShoppingCart,
  CircleNotch,
  Lightning,
} from "@phosphor-icons/react";
import { useCart } from "@/lib/cart/provider";
import { useI18n } from "@/lib/i18n/provider";
import { purchaseCart } from "@/lib/actions/checkout";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function CartPage() {
  const router = useRouter();
  const { items, totalTRY, setQty, remove, clear } = useCart();
  const { money, t } = useI18n();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function checkout() {
    setError(null);
    startTransition(async () => {
      const res = await purchaseCart({
        items: items.map((i) => ({ variantId: i.variantId, qty: i.qty })),
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      clear();
      router.push("/orders?fromCart=1");
    });
  }

  if (items.length === 0) {
    return (
      <section className="container-page py-16">
        <EmptyState
          title={t("account.cart.empty.title")}
          description={t("account.cart.empty.desc")}
          cta={{ label: t("account.cart.empty.cta"), href: "/store" }}
        />
      </section>
    );
  }

  return (
    <section className="container-page py-10">
      <h1 className="text-3xl font-bold text-ink-900">{t("account.cart.title")}</h1>
      <p className="mt-1 text-sm text-ink-500">
        {t("account.cart.subtitle").replace("{count}", String(items.length))}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Satırlar */}
        <div className="space-y-3">
          {items.map((it) => (
            <div
              key={it.variantId}
              className="flex items-center gap-4 rounded-2xl border border-ink-200 bg-white p-4"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ink-100">
                {it.imagePath && (
                  <Image
                    src={it.imagePath}
                    alt={it.productName}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/product/${it.productSlug}`}
                  className="block truncate font-semibold text-ink-900 hover:text-brand-600"
                >
                  {it.productName}
                </Link>
                <p className="text-sm text-ink-500">{it.variantLabel}</p>
                <p className="mt-0.5 text-sm font-semibold text-brand-600">
                  {money(it.priceTRY)}
                </p>
              </div>

              {/* Miktar */}
              <div className="inline-flex items-center rounded-xl border border-ink-200">
                <button
                  type="button"
                  onClick={() => setQty(it.variantId, it.qty - 1)}
                  className="grid h-9 w-9 place-items-center text-ink-600 hover:text-brand-600"
                  aria-label={t("account.cart.decrease")}
                >
                  <Minus size={14} weight="bold" />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-ink-900">
                  {it.qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(it.variantId, it.qty + 1)}
                  className="grid h-9 w-9 place-items-center text-ink-600 hover:text-brand-600 disabled:opacity-40"
                  disabled={it.qty >= 20}
                  aria-label={t("account.cart.increase")}
                >
                  <Plus size={14} weight="bold" />
                </button>
              </div>

              <div className="hidden w-24 text-right text-sm font-bold text-ink-900 sm:block">
                {money(it.priceTRY * it.qty)}
              </div>

              <button
                type="button"
                onClick={() => remove(it.variantId)}
                className="grid h-9 w-9 place-items-center rounded-full text-ink-400 hover:bg-danger-50 hover:text-danger-600"
                aria-label={t("account.cart.remove")}
              >
                <Trash size={17} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={clear}
            className="text-sm text-ink-400 hover:text-danger-600"
          >
            {t("account.cart.clear")}
          </button>
        </div>

        {/* Özet */}
        <div className="lg:sticky lg:top-20 lg:h-fit">
          <div className="rounded-2xl border border-ink-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-ink-900">{t("account.cart.summary")}</h2>
            <div className="mt-4 flex justify-between text-sm text-ink-600">
              <span>{t("account.cart.subtotal")}</span>
              <span>{money(totalTRY)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-ink-200 pt-3 text-base font-bold text-ink-900">
              <span>{t("account.cart.total")}</span>
              <span>{money(totalTRY)}</span>
            </div>

            <div className="mt-5">
              <Show
                when="signed-in"
                fallback={
                  <Button asChild className="w-full">
                    <Link href="/sign-in?next=/cart">{t("account.cart.signInToPay")}</Link>
                  </Button>
                }
              >
                <Button
                  onClick={checkout}
                  disabled={pending}
                  className="w-full"
                >
                  {pending ? (
                    <>
                      <CircleNotch size={18} className="animate-spin" /> {t("account.cart.processing")}
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} weight="fill" /> {t("account.cart.payFromBalance")}
                    </>
                  )}
                </Button>
              </Show>
            </div>

            {error && (
              <p className="mt-3 text-sm font-medium text-danger-600">{error}</p>
            )}

            <p className="mt-4 inline-flex items-start gap-1.5 text-xs text-ink-400">
              <Lightning size={13} weight="fill" className="mt-0.5 shrink-0 text-brand-500" />
              {t("account.cart.note")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

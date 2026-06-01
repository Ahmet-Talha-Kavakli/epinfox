"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Show } from "@clerk/nextjs";
import { Lightning, Gift, Minus, Plus, ShoppingCart, Check } from "@phosphor-icons/react";
import { SlideButton } from "@/components/ui/slide-button";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { purchaseProduct } from "@/lib/actions/checkout";
import { savePlayerAccount } from "@/lib/actions/player-accounts";
import { discountPct } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import { useCart } from "@/lib/cart/provider";
import { cn } from "@/lib/utils";
import type { VariantWithStock } from "@/lib/supabase/types";

interface PanelProduct {
  slug: string;
  name: string;
  imagePath: string | null;
  deliveryType?: "code" | "topup" | "service";
  /** API-tipi tedarik (mock/gerçek) — stok DB'de tutulmaz, "her zaman var" sayılır. */
  autoSupply?: boolean;
}

export function PurchasePanel({
  variants,
  product,
  savedValue,
  platformSlug,
  platformLabel,
  inputPlaceholder,
  inputHint,
}: {
  variants: VariantWithStock[];
  product: PanelProduct;
  /** Kullanıcının bu platform için kayıtlı oyuncu ID / linki (otomatik doldurma). */
  savedValue?: string | null;
  /** brand.slug — kayıt/güncelleme için platform anahtarı. */
  platformSlug?: string | null;
  /** Platform meta'sından gelen label (örn "Mobile Legends"). */
  platformLabel?: string | null;
  /** Platforma özel input placeholder. */
  inputPlaceholder?: string | null;
  /** Platforma özel input ipucu. */
  inputHint?: string | null;
}) {
  const router = useRouter();
  const { t, money } = useI18n();
  const { add } = useCart();

  const isTopup = product.deliveryType === "topup";
  const isService = product.deliveryType === "service";
  const autoSupply = !!product.autoSupply;

  const initial =
    variants.find((v) => v.stock > 0)?.id ?? variants[0]?.id ?? "";
  const [selectedId, setSelectedId] = useState(initial);
  const [qty, setQtyState] = useState(1);
  // Kayıtlı değer varsa otomatik doldur: topup→playerId, service→link.
  const [playerId, setPlayerId] = useState(
    isTopup ? (savedValue ?? "") : "",
  );
  const [link, setLink] = useState(isService ? (savedValue ?? "") : "");
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const hadSavedValue = !!savedValue?.trim();

  // Hemen Al onay modalı. Kaydırma tamamlanınca açılır.
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmPending, setConfirmPending] = useState(false);

  // Kaydırma tamamlanınca: SlideButton'ı loading'de tutmadan hemen modalı aç.
  // (SlideButton'ın onConfirm Promise'ini bilinçli olarak REJECT ederek idle'a
  //  döndürürüz; gerçek satın alma modaldaki "Onayla" ile yapılır.)
  function askConfirm(): Promise<void> {
    setError(null);
    if (isTopup && !playerId.trim()) {
      setError(t("product.errEnterPlayerId"));
      return Promise.reject(new Error("__open_modal__")); // modal açma, SlideButton sıfırlanır
    }
    if (isService && !link.trim()) {
      setError(t("product.errEnterLink"));
      return Promise.reject(new Error("__open_modal__"));
    }
    setConfirmOpen(true);
    return Promise.reject(new Error("__open_modal__"));
  }

  async function handleConfirm() {
    setConfirmPending(true);
    const enteredValue = isTopup
      ? playerId.trim()
      : isService
        ? link.trim()
        : "";
    const res = await purchaseProduct({
      variantId: selectedId,
      qty,
      playerId: isTopup ? playerId.trim() : undefined,
      link: isService ? link.trim() : undefined,
    });
    setConfirmPending(false);
    if (!res.ok) {
      setError(res.error);
      setConfirmOpen(false);
      return;
    }
    // Best-effort: girilen değeri bir dahaki sefere otomatik dolması için kaydet.
    // Hata olursa satın alma akışını KIRMA (sadece sessizce geç).
    if (platformSlug && enteredValue) {
      try {
        await savePlayerAccount({
          platform: platformSlug,
          label: platformLabel ?? undefined,
          value: enteredValue,
        });
      } catch {
        // yoksay
      }
    }
    setConfirmOpen(false);
    router.push("/orders?new=" + res.orderId);
  }

  function handleCancel() {
    if (confirmPending) return;
    setConfirmOpen(false);
  }

  const selected = variants.find((v) => v.id === selectedId) ?? variants[0];
  if (!selected) {
    return (
      <Button disabled variant="secondary" className="w-full max-w-[340px]">
        {t("product.noOptionAvailable")}
      </Button>
    );
  }

  // API-tipi tedarikte DB stoğu yok → her zaman satılabilir.
  const inStock = autoSupply || selected.stock > 0;
  const off = discountPct(selected.price, selected.compare_at);
  const maxQty = autoSupply ? 20 : Math.min(20, selected.stock || 1);

  function addToCart() {
    add(
      {
        variantId: selected.id,
        productSlug: product.slug,
        productName: product.name,
        variantLabel: selected.label,
        priceTRY: selected.price,
        imagePath: product.imagePath,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="space-y-5">
      {/* Varyant seçici */}
      {variants.length > 1 && (
        <div>
          <p className="mb-2 text-sm font-medium text-ink-700">{t("product.option")}</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
              const active = v.id === selectedId;
              const vOff = discountPct(v.price, v.compare_at);
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(v.id);
                    setQtyState(1);
                    setError(null);
                  }}
                  className={cn(
                    "relative rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all",
                    active
                      ? "border-brand-600 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20"
                      : "border-ink-200 bg-white text-ink-700 hover:border-brand-300",
                    v.stock === 0 && "opacity-50",
                  )}
                >
                  {v.label}
                  {vOff > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 rounded-full bg-danger-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      %{vOff}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Fiyat bloğu */}
      <div className="flex items-end gap-3">
        <span className="text-3xl font-extrabold text-ink-900">
          {money(selected.price)}
        </span>
        {selected.compare_at && selected.compare_at > selected.price && (
          <span className="mb-1 text-lg text-ink-400 line-through">
            {money(selected.compare_at)}
          </span>
        )}
        {off > 0 && (
          <span className="mb-1.5 rounded-full bg-danger-50 px-2 py-0.5 text-sm font-semibold text-danger-600">
            %{off} {t("product.discount")}
          </span>
        )}
      </div>

      {/* Bonus + stok */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        {selected.bonus_pct > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2.5 py-1 font-medium text-accent-700">
            <Gift size={14} weight="fill" /> +%{selected.bonus_pct} {t("product.points")}
          </span>
        )}
        {autoSupply ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-1 font-medium text-success-700 ring-1 ring-success-200">
            <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
            {t("product.instantSupply")}
          </span>
        ) : inStock ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-1 font-medium text-success-700 ring-1 ring-success-200">
            <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
            {t("product.inStockCount")} ({selected.stock})
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-2.5 py-1 font-medium text-ink-500 ring-1 ring-ink-200">
            <span className="h-1.5 w-1.5 rounded-full bg-ink-400" />
            {t("product.outOfStock")}
          </span>
        )}
      </div>

      {/* Oyuncu ID — yalnız top-up teslimde */}
      {inStock && isTopup && (
        <div>
          <label
            htmlFor="playerId"
            className="mb-1.5 block text-sm font-medium text-ink-700"
          >
            {platformLabel ? `${platformLabel} ` : ""}
            {t("product.playerAccountId")}
          </label>
          <input
            id="playerId"
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            placeholder={inputPlaceholder ?? t("product.playerIdPlaceholder")}
            className="h-11 w-full max-w-[340px] rounded-xl border border-ink-200 bg-white px-4 text-[15px] text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <p className="mt-1.5 text-xs text-ink-400">
            {inputHint ?? t("product.playerIdHint")}
          </p>
          <SavedHint hadSavedValue={hadSavedValue} hasPlatform={!!platformSlug} t={t} />
        </div>
      )}

      {/* Hedef link — yalnız sosyal medya (service) teslimde */}
      {inStock && isService && (
        <div>
          <label
            htmlFor="serviceLink"
            className="mb-1.5 block text-sm font-medium text-ink-700"
          >
            {platformLabel ? `${platformLabel} ` : ""}
            {t("product.serviceLinkLabel")}
          </label>
          <input
            id="serviceLink"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder={inputPlaceholder ?? t("product.serviceLinkPlaceholder")}
            className="h-11 w-full max-w-[340px] rounded-xl border border-ink-200 bg-white px-4 text-[15px] text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <p className="mt-1.5 text-xs text-ink-400">
            {inputHint ?? t("product.serviceLinkHint")}
          </p>
          <SavedHint hadSavedValue={hadSavedValue} hasPlatform={!!platformSlug} t={t} />
        </div>
      )}

      {inStock && (
        <>
          {/* Miktar */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-ink-700">{t("product.qty")}</span>
            <div className="inline-flex items-center rounded-xl border border-ink-200 bg-white">
              <button
                type="button"
                onClick={() => setQtyState((q) => Math.max(1, q - 1))}
                className="grid h-10 w-10 place-items-center text-ink-600 hover:text-brand-600 disabled:opacity-40"
                disabled={qty <= 1}
                aria-label={t("product.decrease")}
              >
                <Minus size={16} weight="bold" />
              </button>
              <span className="w-10 text-center text-sm font-semibold text-ink-900">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQtyState((q) => Math.min(maxQty, q + 1))}
                className="grid h-10 w-10 place-items-center text-ink-600 hover:text-brand-600 disabled:opacity-40"
                disabled={qty >= maxQty}
                aria-label={t("product.increase")}
              >
                <Plus size={16} weight="bold" />
              </button>
            </div>
            {qty > 1 && (
              <span className="text-sm text-ink-500">
                {t("product.total")} {money(selected.price * qty)}
              </span>
            )}
          </div>

          {/* Sepete ekle — yalnız manuel kod ürünleri (topup/API tek-tek alınır) */}
          {!isTopup && !autoSupply && (
            <Button
              onClick={addToCart}
              variant={added ? "secondary" : "primary"}
              className="w-full max-w-[340px]"
            >
              {added ? (
                <>
                  <Check size={18} weight="bold" /> {t("product.addedToCart")}
                </>
              ) : (
                <>
                  <ShoppingCart size={18} weight="fill" /> {t("product.addToCart")}
                </>
              )}
            </Button>
          )}
        </>
      )}

      {/* Hemen al */}
      <div>
        {!inStock ? (
          <Button disabled variant="secondary" className="w-full max-w-[340px]">
            {t("product.outOfStockButton")}
          </Button>
        ) : (
          <Show
            when="signed-in"
            fallback={
              <Button asChild variant="outline" className="w-full max-w-[340px]">
                <Link href="/sign-in?next=/wallet">{t("product.signInToBuy")}</Link>
              </Button>
            }
          >
            <SlideButton
              key={selectedId + qty}
              label={`${t("product.buyNow")} · ${money(selected.price * qty)}`}
              successLabel={t("product.purchased")}
              errorLabel={error ?? t("product.failed")}
              tone="accent"
              onConfirm={askConfirm}
            />
          </Show>
        )}
        {error && (
          <p className="mt-2 text-sm font-medium text-danger-600">{error}</p>
        )}
        <p className="mt-2 inline-flex items-center gap-1 text-xs text-ink-400">
          <Lightning size={13} weight="fill" className="text-brand-500" />
          {t("product.paymentNote")}
        </p>
      </div>

      {/* Hemen Al onay penceresi */}
      <ConfirmDialog
        open={confirmOpen}
        pending={confirmPending}
        title={t("product.confirmTitle")}
        description={
          isService
            ? t("product.confirmDescService")
            : isTopup
              ? t("product.confirmDescTopup")
              : t("product.confirmDescCode")
        }
        confirmLabel={t("product.confirmYes")}
        cancelLabel={t("product.confirmCancel")}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      >
        <div className="rounded-xl border border-ink-200 bg-ink-50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-600">{product.name}</span>
            <span className="font-medium text-ink-900">{selected.label}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-ink-600">{t("product.qty")}</span>
            <span className="font-medium text-ink-900">{qty}</span>
          </div>
          {isTopup && (
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-ink-600">{t("product.confirmPlayerId")}</span>
              <span className="font-mono font-medium text-ink-900">
                {playerId.trim()}
              </span>
            </div>
          )}
          {isService && (
            <div className="mt-2 flex items-center justify-between gap-2 text-sm">
              <span className="shrink-0 text-ink-600">{t("product.confirmTarget")}</span>
              <span className="truncate font-mono font-medium text-ink-900">
                {link.trim()}
              </span>
            </div>
          )}
          <div className="mt-3 flex items-center justify-between border-t border-ink-200 pt-3">
            <span className="font-semibold text-ink-900">{t("product.total")}</span>
            <span className="text-lg font-extrabold text-accent-600">
              {money(selected.price * qty)}
            </span>
          </div>
        </div>
      </ConfirmDialog>
    </div>
  );
}

/**
 * Otomatik-doldurma notu: kayıtlı değer varsa "dolduruldu", yoksa "kaydet" ipucu.
 * Yalnız platform eşleşmesi olan (brand.slug) ürünlerde gösterilir.
 */
function SavedHint({
  hadSavedValue,
  hasPlatform,
  t,
}: {
  hadSavedValue: boolean;
  hasPlatform: boolean;
  t: (key: string) => string;
}) {
  if (!hasPlatform) return null;
  return hadSavedValue ? (
    <p className="mt-1.5 text-xs text-success-600">
      {t("product.savedFilled")} ·{" "}
      <Link
        href="/account/player-ids"
        className="font-medium underline underline-offset-2 hover:text-success-700"
      >
        {t("product.edit")}
      </Link>
    </p>
  ) : (
    <p className="mt-1.5 text-xs text-ink-400">
      {t("product.savedHint")} ·{" "}
      <Link
        href="/account/player-ids"
        className="font-medium underline underline-offset-2 hover:text-brand-600"
      >
        {t("product.myAccounts")}
      </Link>
    </p>
  );
}

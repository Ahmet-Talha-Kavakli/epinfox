"use client";

import {
  ArrowDown,
  ArrowUp,
  Wallet,
  ShoppingBag,
  ArrowCounterClockwise,
  SlidersHorizontal,
  HandHeart,
} from "@phosphor-icons/react";
import { Price } from "@/components/store/price";
import { formatDateTime, cn } from "@/lib/utils";
import { paymentMethodLabel } from "@/lib/payment-methods";
import { useI18n } from "@/lib/i18n/provider";
import type { WalletTxnType } from "@/lib/supabase/types";
import type { WalletTransactionWithOrder } from "@/lib/actions/wallet";

/** İşlem tipi → i18n anahtarı. Listede ve filtre çiplerinde paylaşılır. */
export const TXN_LABEL_KEYS: Record<WalletTxnType, string> = {
  topup: "acct.txn.topup",
  purchase: "acct.txn.purchase",
  refund: "acct.txn.refund",
  adjustment: "acct.txn.adjustment",
  donation: "acct.txn.donation",
};

/** İşlem tipine göre ikon + renk teması. */
const TXN_META: Record<
  WalletTxnType,
  {
    icon: React.ComponentType<{ size?: number; weight?: "duotone" | "fill" }>;
    badge: string;
    iconBg: string;
    iconText: string;
  }
> = {
  topup: {
    icon: Wallet,
    badge: "bg-success-50 text-success-700",
    iconBg: "bg-success-50 ring-success-200",
    iconText: "text-success-600",
  },
  purchase: {
    icon: ShoppingBag,
    badge: "bg-brand-50 text-brand-700",
    iconBg: "bg-brand-50 ring-brand-200",
    iconText: "text-brand-600",
  },
  refund: {
    icon: ArrowCounterClockwise,
    badge: "bg-accent-50 text-accent-700",
    iconBg: "bg-accent-50 ring-accent-200",
    iconText: "text-accent-600",
  },
  adjustment: {
    icon: SlidersHorizontal,
    badge: "bg-ink-100 text-ink-700",
    iconBg: "bg-ink-100 ring-ink-200",
    iconText: "text-ink-600",
  },
  donation: {
    icon: HandHeart,
    badge: "bg-accent-50 text-accent-700",
    iconBg: "bg-accent-50 ring-accent-200",
    iconText: "text-accent-600",
  },
};

export function TransactionList({ txns }: { txns: WalletTransactionWithOrder[] }) {
  const { t } = useI18n();

  /** İşlem için ana başlık + ikinci satır (detay) üretir. */
  function lines(tx: WalletTransactionWithOrder): {
    title: string;
    sub: string | null;
  } {
    switch (tx.type) {
      case "topup":
        // Yöntem payment_ref'te tutulur; "X ile yükleme" göster.
        return {
          title: t("acct.txn.topup"),
          sub:
            tx.payment_ref && tx.payment_ref !== "mock"
              ? t("acct.txn.topupWith").replace(
                  "{method}",
                  paymentMethodLabel(tx.payment_ref, t),
                )
              : t("acct.txn.noMethod"),
        };
      case "purchase":
        return { title: tx.note || tx.product_name || t("acct.txn.purchase"), sub: null };
      case "refund":
        // "Teslim edilemedi — otomatik iade" + hangi ürün.
        return {
          title: tx.note || t("acct.txn.refund"),
          sub: tx.product_name
            ? t("acct.txn.refundProduct").replace("{name}", tx.product_name)
            : null,
        };
      default:
        return { title: tx.note || t(TXN_LABEL_KEYS[tx.type]), sub: null };
    }
  }

  return (
    <ul className="divide-y divide-ink-100">
      {txns.map((tx) => {
        const positive = tx.amount >= 0;
        const meta = TXN_META[tx.type];
        const Icon = meta.icon;
        const { title, sub } = lines(tx);
        return (
          <li
            key={tx.id}
            className="flex items-center justify-between gap-4 px-1 py-4 transition-colors hover:bg-ink-50/60"
          >
            <div className="flex min-w-0 items-center gap-3.5">
              <span
                className={cn(
                  "grid h-11 w-11 shrink-0 place-items-center rounded-2xl ring-1",
                  meta.iconBg,
                  meta.iconText,
                )}
              >
                <Icon size={20} weight="duotone" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-ink-900">
                    {title}
                  </p>
                  <span
                    className={cn(
                      "hidden shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider sm:inline-block",
                      meta.badge,
                    )}
                  >
                    {t(TXN_LABEL_KEYS[tx.type])}
                  </span>
                </div>
                {sub && (
                  <p className="mt-0.5 truncate text-xs font-medium text-ink-500">
                    {sub}
                  </p>
                )}
                <p className="mt-0.5 text-xs text-ink-400">
                  {formatDateTime(tx.created_at)}
                </p>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p
                className={cn(
                  "inline-flex items-center gap-1 text-sm font-bold",
                  positive ? "text-success-700" : "text-ink-900",
                )}
              >
                {positive ? (
                  <ArrowUp size={13} weight="bold" className="text-success-600" />
                ) : (
                  <ArrowDown size={13} weight="bold" className="text-danger-500" />
                )}
                {positive ? "+" : "−"}
                <Price amountTRY={Math.abs(tx.amount)} />
              </p>
              <p className="mt-0.5 text-xs text-ink-400">
                {t("acct.txn.remaining")} <Price amountTRY={tx.balance_after} />
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

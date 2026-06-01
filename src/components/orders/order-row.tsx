"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  CircleNotch,
  CheckCircle,
  ArrowCounterClockwise,
  WarningCircle,
  DownloadSimple,
  Package,
  CaretDown,
  ArrowSquareOut,
  CreditCard,
  Hash,
  CalendarBlank,
  Truck,
  Lifebuoy,
  PaperPlaneRight,
} from "@phosphor-icons/react";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Price } from "@/components/store/price";
import { revealOrderCode } from "@/lib/actions/orders";
import { createTicket } from "@/lib/actions/support";
import { useI18n } from "@/lib/i18n/provider";
import type { OrderWithProduct } from "@/lib/actions/orders";
import type { OrderStatus, DeliveryType } from "@/lib/supabase/types";
import { formatDateTime, cn } from "@/lib/utils";

/** Sipariş id'sinin kısa, okunabilir referansı (#A1B2C3). */
function shortRef(id: string) {
  return "#" + id.replace(/-/g, "").slice(0, 6).toUpperCase();
}

const STATUS_META: Record<
  OrderStatus,
  { labelKey: string; icon: typeof CheckCircle; className: string }
> = {
  completed: {
    labelKey: "account.orders.status.completed",
    icon: CheckCircle,
    className: "bg-success-100 text-success-700",
  },
  refunded: {
    labelKey: "account.orders.status.refunded",
    icon: ArrowCounterClockwise,
    className: "bg-ink-100 text-ink-500",
  },
  failed: {
    labelKey: "account.orders.status.failed",
    icon: WarningCircle,
    className: "bg-danger-100 text-danger-600",
  },
  pending: {
    labelKey: "account.orders.status.pending",
    icon: CircleNotch,
    className: "bg-warning-100 text-warning-700",
  },
  processing: {
    labelKey: "account.orders.status.processing",
    icon: CircleNotch,
    className: "bg-brand-100 text-brand-700",
  },
};

const DELIVERY_LABEL_KEYS: Record<DeliveryType, string> = {
  code: "account.orders.delivery.code",
  topup: "account.orders.delivery.topup",
  service: "account.orders.delivery.service",
};

const PROVIDER_LABEL_KEYS: Record<string, string> = {
  wallet: "account.orders.provider.wallet",
  paytr: "account.orders.provider.paytr",
};

export function OrderRow({
  order,
  highlight,
}: {
  order: OrderWithProduct;
  highlight?: boolean;
}) {
  const router = useRouter();
  const { t } = useI18n();
  const [open, setOpen] = useState(Boolean(highlight));
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Sorun bildir mini formu
  const [reportOpen, setReportOpen] = useState(false);
  const [reportBody, setReportBody] = useState("");
  const [reportError, setReportError] = useState<string | null>(null);
  const [reportPending, startReport] = useTransition();

  function sendReport() {
    setReportError(null);
    startReport(async () => {
      const orderLabel = `${order.product_name}${order.variant_label ? ` · ${order.variant_label}` : ""}`;
      const r = await createTicket({
        subject: t("c1.order.reportSubject").replace("{product}", order.product_name),
        category: "order",
        body:
          t("c1.order.reportBody")
            .replace("{ref}", shortRef(order.id))
            .replace("{order}", orderLabel) +
          `\n\n${reportBody}`,
        orderId: order.id,
      });
      if (r.ok) {
        router.push(`/support/${r.ticketId}`);
      } else {
        setReportError(r.error);
      }
    });
  }

  function reveal() {
    setError(null);
    startTransition(async () => {
      const res = await revealOrderCode({ orderId: order.id });
      if (!res.ok) setError(res.error);
      else setCode(res.code);
    });
  }

  function download() {
    if (!code) return;
    const lines = [
      `EpinFox — ${t("c1.order.receiptOrder").replace("{ref}", shortRef(order.id))}`,
      `${t("c1.order.receiptProduct")}: ${order.product_name}${order.variant_label ? ` (${order.variant_label})` : ""}`,
      `${t("c1.order.receiptDate")}: ${formatDateTime(order.created_at)}`,
      ``,
      `${t("c1.order.receiptCode")}: ${code}`,
      ``,
      t("c1.order.receiptDisclaimer"),
    ].join("\n");
    const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `epinfox-${shortRef(order.id).slice(1)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const status = STATUS_META[order.status] ?? STATUS_META.completed;
  const StatusIcon = status.icon;
  const isTopup = order.delivery_type === "topup";
  const isService = order.delivery_type === "service";
  // Kod gösterimi yalnız kod-teslim + tamamlanmış siparişlerde.
  const canReveal = order.status === "completed" && !isTopup && !isService;

  const providerKey = PROVIDER_LABEL_KEYS[order.payment_provider];
  const deliveryKey = DELIVERY_LABEL_KEYS[order.delivery_type];
  const detailMeta = [
    {
      icon: Hash,
      label: t("account.orders.meta.orderNo"),
      value: shortRef(order.id),
      tone: "text-ink-500 bg-ink-100",
    },
    {
      icon: CalendarBlank,
      label: t("account.orders.meta.date"),
      value: formatDateTime(order.created_at),
      tone: "text-brand-600 bg-brand-50",
    },
    {
      icon: CreditCard,
      label: t("account.orders.meta.payment"),
      value: providerKey ? t(providerKey) : order.payment_provider,
      tone: "text-accent-600 bg-accent-50",
    },
    {
      icon: Truck,
      label: t("account.orders.meta.delivery"),
      value: deliveryKey ? t(deliveryKey) : order.delivery_type,
      tone: "text-success-600 bg-success-50",
    },
  ];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-white transition-colors",
        highlight
          ? "border-success-300 bg-success-50/40"
          : open
            ? "border-brand-300"
            : "border-ink-200 hover:border-ink-300",
      )}
    >
      {/* Tıklanabilir başlık satırı */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-4 text-left sm:p-5"
      >
        {/* Ürün görseli */}
        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-ink-200 bg-ink-50">
          {order.product_image ? (
            <Image
              src={order.product_image}
              alt={order.product_name}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <div className="grid size-full place-items-center text-ink-300">
              <Package size={26} weight="duotone" />
            </div>
          )}
        </div>

        {/* Başlık + meta */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="truncate font-semibold text-ink-900">
              {order.product_name}
            </span>
            {order.variant_label && (
              <span className="rounded-md bg-ink-100 px-1.5 py-0.5 text-xs font-medium text-ink-600">
                {order.variant_label}
              </span>
            )}
            {highlight && (
              <span className="inline-flex items-center gap-1 rounded-full bg-success-100 px-2 py-0.5 text-xs font-medium text-success-700">
                <CheckCircle size={13} weight="fill" /> {t("account.orders.new")}
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-400">
            <span className="font-mono">{shortRef(order.id)}</span>
            <span aria-hidden>·</span>
            <span>{formatDateTime(order.created_at)}</span>
            <span aria-hidden>·</span>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
                status.className,
              )}
            >
              <StatusIcon size={12} weight="fill" /> {t(status.labelKey)}
            </span>
          </div>
        </div>

        {/* Fiyat + ok */}
        <div className="flex shrink-0 items-center gap-3">
          <Price
            amountTRY={order.price}
            className="font-semibold text-ink-900"
          />
          <CaretDown
            size={18}
            weight="bold"
            className={cn(
              "text-ink-400 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </div>
      </button>

      {/* Açılır detay paneli */}
      {open && (
        <div className="animate-scale-in origin-top border-t border-ink-100 px-4 pb-5 pt-4 sm:px-5">
          {/* Detay grid — ikon renkli rozetli kartlar */}
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {detailMeta.map((m) => (
              <div
                key={m.label}
                className="flex items-center gap-2.5 rounded-xl border border-ink-100 bg-white px-3 py-2.5"
              >
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
                    m.tone,
                  )}
                >
                  <m.icon size={16} weight="duotone" />
                </span>
                <div className="min-w-0">
                  <dt className="text-[11px] font-medium text-ink-400">
                    {m.label}
                  </dt>
                  <dd className="truncate text-sm font-semibold text-ink-900">
                    {m.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>

          {/* Ürün sayfası linki — buton tarzı */}
          {order.product_slug && (
            <Link
              href={`/product/${order.product_slug}`}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-100"
            >
              <ArrowSquareOut size={15} weight="duotone" />
              {t("account.orders.goToProduct")}
            </Link>
          )}

          {/* Kod alanı */}
          {canReveal && (
            <div className="mt-4 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50/60 to-accent-50/40 p-4">
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-ink-900">
                <Package size={16} weight="duotone" className="text-brand-600" />
                {t("account.orders.yourCode")}
              </p>
              {code ? (
                <div className="flex items-center gap-2">
                  <code className="flex-1 select-all rounded-xl border border-ink-200 bg-white px-3 py-2.5 font-mono text-sm tracking-wide text-ink-900">
                    {code}
                  </code>
                  <CopyButton value={code} className="h-11 w-11 shrink-0 bg-white" />
                  <button
                    onClick={download}
                    aria-label={t("account.orders.downloadCode")}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-ink-700 ring-1 ring-ink-200 transition-colors hover:bg-ink-100"
                  >
                    <DownloadSimple size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <Button onClick={reveal} disabled={pending} size="sm">
                    {pending ? (
                      <CircleNotch size={16} className="animate-spin" />
                    ) : (
                      <Eye size={16} weight="fill" />
                    )}
                    {t("account.orders.showCode")}
                  </Button>
                  <p className="mt-2 text-xs text-ink-500">
                    {t("account.orders.codePrivateNote")}
                  </p>
                </>
              )}
              {error && (
                <p className="mt-2 text-sm font-medium text-danger-600">
                  {error}
                </p>
              )}
            </div>
          )}

          {/* Hazırlanıyor */}
          {(order.status === "pending" || order.status === "processing") && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-warning-200 bg-warning-50/60 px-3 py-2.5 text-sm text-warning-700">
              <CircleNotch size={15} className="animate-spin" />
              {t("account.orders.preparing")}
            </div>
          )}

          {/* Başarısız */}
          {order.status === "failed" && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-danger-200 bg-danger-50/60 px-3 py-2.5 text-sm text-danger-700">
              <WarningCircle size={15} weight="fill" />
              {t("account.orders.failedNote")}
            </div>
          )}

          {/* Top-up teslim */}
          {isTopup && order.status === "completed" && (
            <div className="mt-4 rounded-xl border border-success-200 bg-success-50/50 px-3 py-2.5 text-sm text-success-700">
              <CheckCircle size={15} weight="fill" className="mr-1 inline" />
              {order.delivered_note ??
                (order.player_id
                  ? t("account.orders.topupDeliveredPlayer").replace(
                      "{playerId}",
                      order.player_id,
                    )
                  : t("account.orders.topupDelivered"))}
            </div>
          )}

          {/* Sosyal medya teslim */}
          {isService && order.status === "completed" && (
            <div className="mt-4 rounded-xl border border-success-200 bg-success-50/50 px-3 py-2.5 text-sm text-success-700">
              <CheckCircle size={15} weight="fill" className="mr-1 inline" />
              {order.delivered_note ?? t("account.orders.serviceDelivered")}
              {order.player_id && (
                <span className="mt-1 block break-all text-xs text-success-600">
                  {t("account.orders.serviceTarget").replace("{target}", order.player_id)}
                </span>
              )}
            </div>
          )}

          {/* Sorun bildir */}
          <div className="mt-4 border-t border-ink-100 pt-4">
            {reportOpen ? (
              <div className="rounded-xl border border-ink-200 bg-ink-50/60 p-4">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-ink-900">
                  <Lifebuoy size={16} weight="duotone" className="text-brand-600" />
                  {t("account.orders.report.title")}
                </p>
                <p className="mt-1 text-xs text-ink-500">
                  {t("account.orders.report.desc")}
                </p>
                <Textarea
                  value={reportBody}
                  onChange={(e) => setReportBody(e.target.value)}
                  rows={3}
                  placeholder={t("account.orders.report.placeholder")}
                  disabled={reportPending}
                  className="mt-3"
                />
                {reportError && (
                  <p className="mt-2 text-sm font-medium text-danger-600">
                    {reportError}
                  </p>
                )}
                <div className="mt-3 flex gap-2">
                  <Button
                    onClick={sendReport}
                    disabled={reportPending || reportBody.trim().length < 5}
                    size="sm"
                  >
                    {reportPending ? (
                      <CircleNotch size={16} className="animate-spin" />
                    ) : (
                      <PaperPlaneRight size={16} weight="fill" />
                    )}
                    {t("account.orders.report.submit")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReportOpen(false)}
                    disabled={reportPending}
                  >
                    {t("account.orders.report.cancel")}
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setReportOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-3.5 py-2 text-sm font-medium text-ink-600 transition-colors hover:border-danger-300 hover:bg-danger-50 hover:text-danger-700"
              >
                <Lifebuoy size={15} weight="duotone" />
                {t("account.orders.report.open")}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

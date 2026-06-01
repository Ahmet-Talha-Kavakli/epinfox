"use client";

import { useState } from "react";
import { DownloadSimple, FileText, CaretDown } from "@phosphor-icons/react";
import { Price } from "@/components/store/price";
import { formatDateTime, cn } from "@/lib/utils";
import { SITE } from "@/config/site";
import type { Invoice } from "@/lib/supabase/types";
import { useI18n } from "@/lib/i18n/provider";

const STATUS_KEY: Record<Invoice["status"], { statusKey: string; cls: string }> = {
  paid: { statusKey: "sup.invoices.status.paid", cls: "bg-success-50 text-success-700" },
  issued: { statusKey: "sup.invoices.status.issued", cls: "bg-ink-100 text-ink-600" },
  cancelled: { statusKey: "sup.invoices.status.cancelled", cls: "bg-danger-50 text-danger-700" },
};

function formatTL(n: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(n);
}

export function InvoiceRow({ invoice }: { invoice: Invoice }) {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const st = STATUS_KEY[invoice.status] ?? STATUS_KEY.paid;

  // Tutar KDV dahil kabul edilir; matrah + %20 KDV olarak ayrıştırılır.
  const net = invoice.amount / 1.2;
  const vat = invoice.amount - net;

  function download() {
    const lines = [
      `${SITE.name} — ${t("sup.invoices.docTitle")}`,
      `========================================`,
      `${t("sup.invoices.docNumber")}: ${invoice.number}`,
      `${t("sup.invoices.docDate")}: ${formatDateTime(invoice.created_at, locale)}`,
      `${t("sup.invoices.docStatus")}: ${t(st.statusKey)}`,
      ``,
      `${t("sup.invoices.docDescription")}: ${invoice.description}`,
      `----------------------------------------`,
      `${t("sup.invoices.docNet")}: ${formatTL(net)}`,
      `${t("sup.invoices.docVat")}: ${formatTL(vat)}`,
      `${t("sup.invoices.docTotal")}: ${formatTL(invoice.amount)}`,
      `========================================`,
      ``,
      `${t("sup.invoices.docSeller")}: ${SITE.name}`,
      `${t("sup.invoices.docNote")}`,
    ].join("\n");
    const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoice.number}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      {/* Başlık satırı — tıklanınca detay açılır */}
      <div className="flex items-center justify-between gap-4 p-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-200">
            <FileText size={18} weight="duotone" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink-900">
              {invoice.number}
            </p>
            <p className="truncate text-xs text-ink-500">
              {invoice.description}
            </p>
            <p className="text-xs text-ink-400">
              {formatDateTime(invoice.created_at, locale)}
            </p>
          </div>
          <CaretDown
            size={16}
            weight="bold"
            className={cn(
              "shrink-0 text-ink-400 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-ink-900">
              <Price amountTRY={invoice.amount} />
            </p>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${st.cls}`}
            >
              {t(st.statusKey)}
            </span>
          </div>
          <button
            onClick={download}
            aria-label={t("sup.invoices.download")}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink-100 text-ink-700 transition-colors hover:bg-ink-200"
          >
            <DownloadSimple size={18} />
          </button>
        </div>
      </div>

      {/* Detay — KDV dökümü */}
      {open && (
        <div className="animate-scale-in origin-top px-4 pb-4">
          <dl className="rounded-xl bg-ink-50 p-4 text-sm">
            <div className="flex items-center justify-between py-1">
              <dt className="text-ink-500">{t("sup.invoices.net")}</dt>
              <dd className="font-medium text-ink-900">{formatTL(net)}</dd>
            </div>
            <div className="flex items-center justify-between py-1">
              <dt className="text-ink-500">{t("sup.invoices.vat")}</dt>
              <dd className="font-medium text-ink-900">{formatTL(vat)}</dd>
            </div>
            <div className="mt-1 flex items-center justify-between border-t border-ink-200 pt-2">
              <dt className="font-semibold text-ink-900">{t("sup.invoices.total")}</dt>
              <dd className="font-bold text-brand-600">
                {formatTL(invoice.amount)}
              </dd>
            </div>
          </dl>
          <button
            onClick={download}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-50"
          >
            <DownloadSimple size={15} weight="bold" />
            {t("sup.invoices.downloadDoc")}
          </button>
        </div>
      )}
    </div>
  );
}

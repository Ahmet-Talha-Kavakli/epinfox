"use client";

import Link from "next/link";
import {
  HandHeart,
  UsersThree,
  Receipt,
  ArrowRight,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { formatTL } from "@/lib/format";
import { intlLocale } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";
import type { Donation } from "@/lib/supabase/types";

/** Bağışlarım — kullanıcının yayıncılara yaptığı bağışların takibi.
 *  Bağış YAPMA işlemi /publisher/[slug] sayfasındadır; burası geçmiş + özet. */
export function DonationCenter({ donations }: { donations: Donation[] }) {
  const { t, locale } = useI18n();
  const total = donations.reduce((s, d) => s + Number(d.amount), 0);
  const supportedPublishers = new Set(
    donations.map((d) => d.publisher_slug ?? d.campaign),
  ).size;

  return (
    <div className="space-y-6">
      {/* Özet şeridi */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-3.5 rounded-2xl border border-ink-200 bg-white p-4 sm:p-5">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent-50 text-accent-600 ring-1 ring-accent-200">
            <HandHeart size={24} weight="duotone" />
          </span>
          <div>
            <p className="text-lg font-bold leading-none text-ink-900">
              {formatTL(total)}
            </p>
            <p className="mt-1 text-xs text-ink-500">{t("acct.donations.totalDonated")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3.5 rounded-2xl border border-ink-200 bg-white p-4 sm:p-5">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-200">
            <UsersThree size={24} weight="duotone" />
          </span>
          <div>
            <p className="text-lg font-bold leading-none text-ink-900">
              {supportedPublishers}
            </p>
            <p className="mt-1 text-xs text-ink-500">{t("acct.donations.supportedPublishers")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3.5 rounded-2xl border border-ink-200 bg-white p-4 sm:p-5">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-ink-100 text-ink-500 ring-1 ring-ink-200">
            <Receipt size={24} weight="duotone" />
          </span>
          <div>
            <p className="text-lg font-bold leading-none text-ink-900">
              {donations.length}
            </p>
            <p className="mt-1 text-xs text-ink-500">{t("acct.donations.donationCount")}</p>
          </div>
        </div>
      </div>

      {/* Yayıncı keşfet CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-200 bg-brand-50/50 p-5">
        <div>
          <p className="font-semibold text-ink-900">
            {t("acct.donations.ctaTitle")}
          </p>
          <p className="text-sm text-ink-500">
            {t("acct.donations.ctaDesc")}
          </p>
        </div>
        <Button asChild>
          <Link href="/publisher">
            {t("acct.donations.publishers")}
            <ArrowRight size={16} weight="bold" />
          </Link>
        </Button>
      </div>

      {/* Geçmiş */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-ink-900">
          {t("acct.donations.historyTitle")}
        </h2>
        {donations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-12 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-accent-50 text-accent-600 ring-1 ring-accent-200">
              <HandHeart size={26} weight="duotone" />
            </span>
            <p className="mt-3 font-semibold text-ink-900">
              {t("acct.donations.empty.title")}
            </p>
            <p className="mt-1 text-sm text-ink-500">
              {t("acct.donations.empty.desc")}
            </p>
            <Button asChild className="mt-4">
              <Link href="/publisher">{t("acct.donations.empty.cta")}</Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-ink-100 rounded-2xl border border-ink-200 bg-white">
            {donations.map((d) => {
              const name = d.publisher_name ?? d.campaign;
              const href = d.publisher_slug
                ? `/publisher/${d.publisher_slug}`
                : null;
              const Row = (
                <div className="flex items-center gap-3.5 p-4 transition-colors hover:bg-ink-50">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-50 text-accent-600 ring-1 ring-accent-200">
                    <HandHeart size={20} weight="duotone" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink-900">
                      {name}
                      {d.anonymous && (
                        <span className="ml-2 rounded bg-ink-100 px-1.5 py-0.5 text-[10px] font-medium text-ink-500">
                          {t("acct.donations.anonymous")}
                        </span>
                      )}
                    </p>
                    {d.message && (
                      <p className="truncate text-xs text-ink-500">
                        “{d.message}”
                      </p>
                    )}
                    <p className="text-xs text-ink-400">
                      {new Date(d.created_at).toLocaleDateString(intlLocale(locale), {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-accent-700">
                    {formatTL(Number(d.amount))}
                  </span>
                  {href && (
                    <ArrowRight size={16} className="shrink-0 text-ink-300" />
                  )}
                </div>
              );
              return href ? (
                <Link key={d.id} href={href}>
                  {Row}
                </Link>
              ) : (
                <div key={d.id}>{Row}</div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

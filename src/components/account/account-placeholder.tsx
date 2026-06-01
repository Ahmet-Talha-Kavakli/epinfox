"use client";

import type { Icon } from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/provider";

/** Hesap alt sayfaları için tutarlı "çok yakında" yer tutucusu. */
export function AccountPlaceholder({
  icon: Icon,
  title,
  description,
}: {
  icon: Icon;
  title: string;
  description: string;
}) {
  const { t } = useI18n();
  return (
    <Card className="border-ink-200 p-10">
      <div className="mx-auto max-w-md text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-soft">
          <Icon size={32} weight="duotone" />
        </span>
        <h2 className="mt-5 text-xl font-bold text-ink-900">{title}</h2>
        <p className="mt-2 leading-relaxed text-ink-500">{description}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-sm font-medium text-accent-700">
          {t("acct2.placeholder.comingSoon")}
        </span>
      </div>
    </Card>
  );
}

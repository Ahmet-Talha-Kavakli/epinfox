"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bell,
  BellRinging,
  Check,
  CheckCircle,
  Wallet,
  ArrowCounterClockwise,
  Tag,
  Megaphone,
  Heart,
} from "@phosphor-icons/react";
import { markAllNotificationsRead } from "@/lib/actions/notifications";
import type { Notification, NotificationType } from "@/lib/supabase/types";
import { localizeNotification } from "@/lib/notif-i18n";
import { cn, intlLocale } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  unreadCount: number;
  items: Notification[];
}

type Tone = "brand" | "accent" | "success" | "warning" | "danger" | "ink";

/** Bildirim tipine göre ikon + renk teması. */
const TYPE_META: Record<
  NotificationType,
  {
    icon: React.ComponentType<{ size?: number; weight?: "duotone" | "fill" }>;
    tone: Tone;
    labelKey: string;
  }
> = {
  "order.completed": { icon: CheckCircle, tone: "success", labelKey: "c1.notif.type.order" },
  "wallet.topup": { icon: Wallet, tone: "brand", labelKey: "c1.notif.type.wallet" },
  "wallet.refund": { icon: ArrowCounterClockwise, tone: "accent", labelKey: "c1.notif.type.refund" },
  "order.refunded": { icon: ArrowCounterClockwise, tone: "warning", labelKey: "c1.notif.type.refund" },
  promo: { icon: Tag, tone: "accent", labelKey: "c1.notif.type.promo" },
  favorite: { icon: Heart, tone: "accent", labelKey: "c1.notif.type.favorite" },
  system: { icon: Megaphone, tone: "ink", labelKey: "c1.notif.type.system" },
};

const TONE_CLS: Record<Tone, { bg: string; ring: string; text: string }> = {
  brand: { bg: "bg-brand-50", ring: "ring-brand-200", text: "text-brand-700" },
  accent: { bg: "bg-accent-50", ring: "ring-accent-200", text: "text-accent-700" },
  success: {
    bg: "bg-success-50",
    ring: "ring-success-200",
    text: "text-success-700",
  },
  warning: {
    bg: "bg-warning-50",
    ring: "ring-warning-200",
    text: "text-warning-700",
  },
  danger: { bg: "bg-danger-50", ring: "ring-danger-200", text: "text-danger-700" },
  ink: { bg: "bg-ink-100", ring: "ring-ink-300", text: "text-ink-700" },
};

const FALLBACK = { icon: Megaphone, tone: "ink" as Tone, labelKey: "c1.notif.type.fallback" };

export function NotificationBell({ unreadCount, items }: Props) {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const Icon = unreadCount > 0 ? BellRinging : Bell;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("c1.notif.aria")}
        className="relative grid place-items-center rounded-full text-ink-700 transition-colors hover:bg-ink-100"
      >
        <Icon
          size={28}
          weight={unreadCount > 0 ? "fill" : "duotone"}
          className={unreadCount > 0 ? "text-brand-600" : "text-ink-700"}
        />
        {unreadCount > 0 && (
          <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-danger-500 px-1 text-[11px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 origin-top-right animate-scale-in overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-float">
          <div className="flex items-center justify-between border-b border-ink-200/70 px-4 py-3">
            <p className="text-sm font-semibold text-ink-900">{t("c1.notif.title")}</p>
            {unreadCount > 0 && (
              <form action={markAllNotificationsRead}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                  <Check size={12} weight="bold" /> {t("c1.notif.markAllRead")}
                </button>
              </form>
            )}
          </div>

          {items.length === 0 ? (
            <div className="p-6 text-center text-sm text-ink-500">
              {t("c1.notif.empty")}
            </div>
          ) : (
            <ul className="max-h-96 overflow-y-auto">
              {items.map((n) => (
                <NotifRow key={n.id} n={n} t={t} locale={locale} onClick={() => setOpen(false)} />
              ))}
            </ul>
          )}

          <div className="border-t border-ink-200/70 px-4 py-2">
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-ink-600 hover:text-ink-900"
            >
              {t("c1.notif.seeAll")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function NotifRow({
  n,
  t,
  locale,
  onClick,
}: {
  n: Notification;
  t: (key: string) => string;
  locale: Locale;
  onClick: () => void;
}) {
  const unread = !n.read_at;
  const meta = TYPE_META[n.type] ?? FALLBACK;
  const TypeIcon = meta.icon;
  const tone = TONE_CLS[meta.tone];
  const nText = localizeNotification(n, locale);

  const inner = (
    <div
      className={cn(
        "border-b border-ink-200/40 px-3 py-3 transition-colors last:border-b-0 hover:bg-ink-50",
        unread && "bg-brand-50/30",
      )}
    >
      <div className="flex items-start gap-2.5">
        <div
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1",
            tone.bg,
            tone.ring,
            tone.text,
          )}
        >
          <TypeIcon size={16} weight="duotone" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-center gap-1.5">
            <span
              className={cn(
                "rounded-full px-1.5 text-[9px] font-bold uppercase tracking-wider",
                tone.bg,
                tone.text,
              )}
            >
              {t(meta.labelKey)}
            </span>
            {unread && <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />}
          </div>
          <p
            className={cn(
              "text-sm leading-snug",
              unread ? "font-semibold text-ink-900" : "text-ink-700",
            )}
          >
            {nText.title}
          </p>
          {nText.body && (
            <p className="mt-0.5 line-clamp-2 text-xs text-ink-600">{nText.body}</p>
          )}
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-ink-400">
            {formatRelative(new Date(n.created_at), t, locale)}
          </p>
        </div>
      </div>
    </div>
  );

  if (n.link) {
    return (
      <li>
        <Link href={n.link} onClick={onClick}>
          {inner}
        </Link>
      </li>
    );
  }
  return <li>{inner}</li>;
}

function formatRelative(
  d: Date,
  t: (key: string) => string,
  locale: Locale,
): string {
  const diff = Date.now() - d.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return t("c1.notif.justNow");
  if (min < 60) return t("c1.notif.minAgo").replace("{n}", String(min));
  const hr = Math.floor(min / 60);
  if (hr < 24) return t("c1.notif.hourAgo").replace("{n}", String(hr));
  const day = Math.floor(hr / 24);
  if (day < 7) return t("c1.notif.dayAgo").replace("{n}", String(day));
  return d.toLocaleDateString(intlLocale(locale), {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

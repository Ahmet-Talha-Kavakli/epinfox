import type { Metadata } from "next";
import Link from "next/link";
import {
  Package,
  Wallet,
  ArrowCounterClockwise,
  Gift,
  Megaphone,
  Heart,
  Check,
} from "@phosphor-icons/react/dist/ssr";
import { requireMember } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/server";
import { getRecentNotifications } from "@/lib/notifications";
import { markAllNotificationsRead } from "@/lib/actions/notifications";
import { AccountShell } from "@/components/account/account-shell";
import { EmptyState } from "@/components/ui/empty-state";
import type { Notification, NotificationType } from "@/lib/supabase/types";
import { localizeNotification } from "@/lib/notif-i18n";
import { cn, intlLocale } from "@/lib/utils";
import { getServerT, getServerLocale } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/config";

export const metadata: Metadata = { title: "Bildirimler" };

type Tone = "brand" | "accent" | "success" | "warning" | "danger" | "ink";

const TYPE_META: Record<
  NotificationType,
  { icon: typeof Package; tone: Tone; labelKey: string }
> = {
  "order.completed": { icon: Package, tone: "success", labelKey: "sup.notif.type.order" },
  "wallet.topup": { icon: Wallet, tone: "brand", labelKey: "sup.notif.type.wallet" },
  "wallet.refund": { icon: ArrowCounterClockwise, tone: "accent", labelKey: "sup.notif.type.refund" },
  "order.refunded": { icon: ArrowCounterClockwise, tone: "warning", labelKey: "sup.notif.type.refund" },
  promo: { icon: Gift, tone: "accent", labelKey: "sup.notif.type.promo" },
  favorite: { icon: Heart, tone: "accent", labelKey: "sup.notif.type.favorite" },
  system: { icon: Megaphone, tone: "ink", labelKey: "sup.notif.type.system" },
};

/** Her tür için duotone ikon + açık zeminli ring rozet — eylem türü ayrışsın. */
const TONE_CLS: Record<
  Tone,
  { bg: string; ring: string; text: string; chipBg: string; chipText: string }
> = {
  brand: {
    bg: "bg-brand-50",
    ring: "ring-brand-200",
    text: "text-brand-600",
    chipBg: "bg-brand-50",
    chipText: "text-brand-700",
  },
  accent: {
    bg: "bg-accent-50",
    ring: "ring-accent-200",
    text: "text-accent-600",
    chipBg: "bg-accent-50",
    chipText: "text-accent-700",
  },
  success: {
    bg: "bg-success-50",
    ring: "ring-success-200",
    text: "text-success-600",
    chipBg: "bg-success-50",
    chipText: "text-success-700",
  },
  warning: {
    bg: "bg-warning-50",
    ring: "ring-warning-200",
    text: "text-warning-600",
    chipBg: "bg-warning-50",
    chipText: "text-warning-700",
  },
  danger: {
    bg: "bg-danger-50",
    ring: "ring-danger-200",
    text: "text-danger-600",
    chipBg: "bg-danger-50",
    chipText: "text-danger-700",
  },
  ink: {
    bg: "bg-ink-100",
    ring: "ring-ink-200",
    text: "text-ink-500",
    chipBg: "bg-ink-100",
    chipText: "text-ink-600",
  },
};

const FALLBACK = { icon: Megaphone, tone: "ink" as Tone, labelKey: "sup.notif.type.generic" };

function formatDateTime(date: string, locale: Locale) {
  return new Date(date).toLocaleString(intlLocale(locale), {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function NotificationsPage() {
  const current = await requireMember();
  const supabase = await createAdminClient();
  const items = await getRecentNotifications(supabase, current.user.id, 50);
  const hasUnread = items.some((n) => !n.read_at);
  const [t, locale] = await Promise.all([getServerT(), getServerLocale()]);

  return (
    <AccountShell
      user={{
        nickname: current.nickname,
        email: current.email,
        avatarPath: current.avatarPath,
      }}
      title={t("sup.notif.pageTitle")}
      description={t("sup.notif.pageDesc")}
      actions={
        hasUnread ? (
          <form action={markAllNotificationsRead}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-3.5 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-200"
            >
              <Check size={15} weight="bold" /> {t("sup.notif.markAllRead")}
            </button>
          </form>
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <EmptyState
          title={t("sup.notif.emptyTitle")}
          description={t("sup.notif.emptyDesc")}
          cta={{ label: t("sup.notif.emptyCta"), href: "/store" }}
        />
      ) : (
        <ul className="space-y-2">
          {items.map((n) => (
            <NotifItem key={n.id} n={n} label={t(TYPE_META[n.type]?.labelKey ?? FALLBACK.labelKey)} locale={locale} />
          ))}
        </ul>
      )}
    </AccountShell>
  );
}

function NotifItem({ n, label, locale }: { n: Notification; label: string; locale: Locale }) {
  const { title, body } = localizeNotification(n, locale);
  const unread = !n.read_at;
  const meta = TYPE_META[n.type] ?? FALLBACK;
  const Icon = meta.icon;
  const tone = TONE_CLS[meta.tone];

  const inner = (
    <div
      className={cn(
        "flex items-start gap-4 rounded-2xl border p-4 transition-colors",
        unread ? "border-brand-200 bg-brand-50/40" : "border-ink-200 bg-white",
        n.link && "hover:border-brand-300 hover:shadow-card",
      )}
    >
      {/* Eylem türüne göre duotone ikon + açık ring rozet */}
      <div
        className={cn(
          "grid h-12 w-12 shrink-0 place-items-center rounded-2xl ring-1",
          tone.bg,
          tone.ring,
          tone.text,
        )}
      >
        <Icon size={24} weight="duotone" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
              tone.chipBg,
              tone.chipText,
            )}
          >
            {label}
          </span>
          {unread && (
            <span className="inline-flex h-2 w-2 rounded-full bg-brand-500" />
          )}
        </div>
        <p
          className={cn(
            "text-sm leading-snug",
            unread ? "font-bold text-ink-900" : "font-medium text-ink-800",
          )}
        >
          {title}
        </p>
        {body && <p className="mt-0.5 text-sm text-ink-600">{body}</p>}
        <p className="mt-1.5 text-xs text-ink-400">{formatDateTime(n.created_at, locale)}</p>
      </div>
    </div>
  );

  if (n.link) {
    return (
      <li>
        <Link href={n.link}>{inner}</Link>
      </li>
    );
  }
  return <li>{inner}</li>;
}

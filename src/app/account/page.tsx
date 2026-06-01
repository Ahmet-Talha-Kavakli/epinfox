import type { Metadata } from "next";
import Link from "next/link";
import {
  Wallet,
  Receipt,
  CalendarBlank,
  ArrowRight,
  Bell,
  Headset,
  Plus,
  UsersThree,
  ShieldCheck,
  Gear,
  FileText,
  ShareNetwork,
  Package,
  CheckCircle,
  Clock,
  XCircle,
} from "@phosphor-icons/react/dist/ssr";
import { requireMember } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/server";
import { getUnreadCount } from "@/lib/notifications";
import { getServerT, getServerLocale } from "@/lib/i18n/server";
import { localizeOrderItems } from "@/lib/content-i18n";
import { AccountShell } from "@/components/account/account-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatTL } from "@/lib/format";
import { formatDate } from "@/lib/utils";
import { CopyButton } from "@/components/ui/copy-button";
import type { Order, OrderStatus } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Hesabım" };

export default async function AccountPage() {
  const current = await requireMember();
  const supabase = await createAdminClient();
  const t = await getServerT();
  const locale = await getServerLocale();
  const p = current.profile;

  /** Sipariş durumu → rozet rengi + ikon + etiket. */
  const ORDER_STATUS: Record<
    OrderStatus,
    { label: string; chip: string; icon: typeof CheckCircle }
  > = {
    completed: { label: t("acct.overview.status.completed"), chip: "bg-success-50 text-success-700", icon: CheckCircle },
    processing: { label: t("acct.overview.status.processing"), chip: "bg-brand-50 text-brand-700", icon: Clock },
    pending: { label: t("acct.overview.status.pending"), chip: "bg-warning-50 text-warning-700", icon: Clock },
    refunded: { label: t("acct.overview.status.refunded"), chip: "bg-ink-100 text-ink-600", icon: XCircle },
    failed: { label: t("acct.overview.status.failed"), chip: "bg-danger-50 text-danger-700", icon: XCircle },
  };

  const [
    { count: orderCount },
    { count: openTickets },
    { count: referralCount },
    unread,
    { data: recentOrders },
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("user_id", current.user.id),
    supabase
      .from("support_tickets")
      .select("id", { count: "exact", head: true })
      .eq("user_id", current.user.id)
      .in("status", ["open", "answered"]),
    supabase
      .from("referrals")
      .select("id", { count: "exact", head: true })
      .eq("referrer_id", current.user.id),
    getUnreadCount(supabase, current.user.id),
    supabase
      .from("orders")
      .select("*")
      .eq("user_id", current.user.id)
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  const orders = await localizeOrderItems(
    (recentOrders as Order[]) ?? [],
    locale,
  );

  const stats = [
    {
      icon: Wallet,
      label: t("acct.overview.stat.balance"),
      value: formatTL(current.balance),
      href: "/wallet",
      tone: "text-brand-500",
    },
    {
      icon: Receipt,
      label: t("acct.overview.stat.orders"),
      value: String(orderCount ?? 0),
      href: "/orders",
      tone: "text-accent-500",
    },
    {
      icon: Bell,
      label: t("acct.overview.stat.unread"),
      value: String(unread),
      href: "/notifications",
      tone: "text-warning-500",
    },
    {
      icon: Headset,
      label: t("acct.overview.stat.openTickets"),
      value: String(openTickets ?? 0),
      href: "/support",
      tone: "text-success-500",
    },
  ];

  // Profil tamamlama — temel alanların doluluk oranı.
  const checks = [
    { label: t("acct.overview.check.fullName"), done: Boolean(p.full_name) },
    { label: t("acct.overview.check.phone"), done: Boolean(p.phone) },
    { label: t("acct.overview.check.birthDate"), done: Boolean(p.birth_date) },
    { label: t("acct.overview.check.kyc"), done: p.kyc_status === "approved" },
  ];
  const doneCount = checks.filter((c) => c.done).length;
  const completion = Math.round((doneCount / checks.length) * 100);

  const shortcuts = [
    { icon: Gear, label: t("acct.overview.shortcut.settings"), href: "/account/settings" },
    { icon: ShieldCheck, label: t("acct.overview.shortcut.security"), href: "/account/security" },
    { icon: FileText, label: t("acct.overview.shortcut.invoices"), href: "/invoices" },
    { icon: ShareNetwork, label: t("acct.overview.shortcut.social"), href: "/account/social" },
  ];

  return (
    <AccountShell
      user={{
        nickname: current.nickname,
        email: current.email,
        avatarPath: current.avatarPath,
      }}
      title={t("acct.overview.title")}
      description={t("acct.overview.welcome").replace("{name}", current.nickname)}
    >
      {/* ───── Cüzdan hero kartı ───── */}
      <Card className="relative overflow-hidden border-ink-200 bg-gradient-to-br from-brand-600 to-brand-700 p-6 text-white">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-white/80">
              <Wallet size={18} weight="duotone" /> {t("acct.overview.walletLabel")}
            </p>
            <p className="mt-2 text-4xl font-extrabold tracking-tight">
              {formatTL(current.balance)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              className="bg-white text-brand-700 hover:bg-white/90"
            >
              <Link href="/wallet">
                <Plus size={16} weight="bold" className="mr-1" />
                {t("acct.overview.topUp")}
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="border border-white/30 text-white hover:bg-white/10"
            >
              <Link href="/wallet/transactions">{t("acct.overview.transactions")}</Link>
            </Button>
          </div>
        </div>
      </Card>

      {/* ───── Stat kartları ───── */}
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="h-full border-ink-200 p-5 transition-all hover:-translate-y-0.5 hover:shadow-float">
              <s.icon size={26} weight="duotone" className={s.tone} />
              <p className="mt-3 text-2xl font-extrabold text-ink-900">
                {s.value}
              </p>
              <p className="flex items-center gap-1 text-sm text-ink-500">
                {s.label}
                <ArrowRight size={13} />
              </p>
            </Card>
          </Link>
        ))}
      </div>

      {/* ───── İki kolon: Son siparişler + sağ blok ───── */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        {/* Son siparişler */}
        <Card className="border-ink-200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-bold text-ink-900">
              <Package size={20} weight="duotone" className="text-brand-500" />
              {t("acct.overview.recentOrders")}
            </h2>
            <Link
              href="/orders"
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              {t("acct.overview.all")}
            </Link>
          </div>
          {orders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-ink-200 py-10 text-center">
              <Package size={32} weight="duotone" className="mx-auto text-ink-300" />
              <p className="mt-2 text-sm text-ink-500">{t("acct.overview.noOrders")}</p>
              <Button asChild size="sm" className="mt-3">
                <Link href="/store">{t("acct.overview.goStore")}</Link>
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-ink-100">
              {orders.map((o) => {
                const st = ORDER_STATUS[o.status];
                return (
                  <li key={o.id}>
                    <Link
                      href="/orders"
                      className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-ink-50"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink-100 text-ink-500">
                        <Package size={20} weight="duotone" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink-900">
                          {o.product_name}
                          {o.variant_label ? ` · ${o.variant_label}` : ""}
                        </span>
                        <span className="text-xs text-ink-400">
                          {formatDate(o.created_at, locale)}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block text-sm font-bold text-ink-900">
                          {formatTL(o.price)}
                        </span>
                        <span
                          className={`mt-0.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${st.chip}`}
                        >
                          <st.icon size={11} weight="fill" />
                          {st.label}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {/* Sağ blok: referans + profil tamamlama */}
        <div className="flex flex-col gap-4">
          {/* Referans daveti */}
          <Card className="border-ink-200 p-5">
            <h2 className="flex items-center gap-2 text-base font-bold text-ink-900">
              <UsersThree size={20} weight="duotone" className="text-accent-500" />
              {t("acct.overview.inviteTitle")}
            </h2>
            <p className="mt-1 text-xs text-ink-500">
              {t("acct.overview.inviteDesc")}
            </p>
            <p className="mt-3 text-xs font-medium text-ink-400">
              {t("acct.overview.totalInvites")}{" "}
              <span className="text-ink-900">{referralCount ?? 0}</span>
            </p>
            {p.referral_code ? (
              <>
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-ink-200 bg-ink-50 px-3 py-2">
                  <span className="min-w-0 flex-1 truncate font-mono text-sm font-bold tracking-wide text-ink-900">
                    {p.referral_code}
                  </span>
                  <CopyButton value={p.referral_code} className="h-9 w-9" />
                </div>
                <Button asChild size="sm" variant="outline" className="mt-2 w-full">
                  <Link href="/referral">
                    <ShareNetwork size={15} className="mr-1.5" />
                    {t("acct.overview.referralPage")}
                  </Link>
                </Button>
              </>
            ) : (
              <Button asChild size="sm" variant="outline" className="mt-3 w-full">
                <Link href="/referral">
                  <ShareNetwork size={15} className="mr-1.5" />
                  {t("acct.overview.referralPage")}
                </Link>
              </Button>
            )}
          </Card>

          {/* Profil tamamlama */}
          <Card className="border-ink-200 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-ink-900">
                {t("acct.overview.completion")}
              </h2>
              <span className="text-sm font-extrabold text-brand-600">
                %{completion}
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
            <ul className="mt-4 space-y-2">
              {checks.map((c) => (
                <li
                  key={c.label}
                  className="flex items-center gap-2 text-sm text-ink-600"
                >
                  <CheckCircle
                    size={18}
                    weight={c.done ? "fill" : "regular"}
                    className={c.done ? "text-success-500" : "text-ink-300"}
                  />
                  <span className={c.done ? "text-ink-700" : ""}>{c.label}</span>
                </li>
              ))}
            </ul>
            {completion < 100 && (
              <Button asChild size="sm" variant="outline" className="mt-4 w-full">
                <Link href="/account/settings">{t("acct.overview.completeProfile")}</Link>
              </Button>
            )}
          </Card>
        </div>
      </div>

      {/* ───── Hızlı erişim kısayolları ───── */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {shortcuts.map((s) => (
          <Link key={s.href} href={s.href}>
            <Card className="flex items-center gap-3 border-ink-200 p-4 transition-all hover:-translate-y-0.5 hover:shadow-float">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <s.icon size={20} weight="duotone" />
              </span>
              <span className="text-sm font-semibold text-ink-800">
                {s.label}
              </span>
            </Card>
          </Link>
        ))}
      </div>

      {/* Üyelik bilgisi */}
      <Card className="mt-4 flex items-center gap-3 border-ink-200 p-5">
        <CalendarBlank size={24} weight="duotone" className="text-ink-400" />
        <div>
          <p className="text-sm text-ink-500">{t("acct.overview.memberSince")}</p>
          <p className="font-semibold text-ink-900">
            {formatDate(current.profile.joined_at, locale)}
          </p>
        </div>
      </Card>
    </AccountShell>
  );
}

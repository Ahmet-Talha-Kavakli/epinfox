"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Wallet,
  Storefront,
  Broadcast,
  FileText,
  UsersThree,
  Receipt,
  ShieldStar,
  ShoppingCart,
  List,
  X,
  MagnifyingGlass,
  Newspaper,
  Question,
  Trophy,
  House,
  WhatsappLogo,
  ChatCircleDots,
  CaretDown,
  Buildings,
  Info,
  EnvelopeSimple,
  Article,
  ShieldCheck,
  ArrowUDownLeft,
  Heart,
  CurrencyCircleDollar,
} from "@phosphor-icons/react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { NotificationBell } from "@/components/layout/notification-bell";
import { ProfileMenu } from "@/components/layout/profile-menu";
import {
  StoreMegaMenu,
  type MegaProduct,
  type MegaCategory,
} from "@/components/layout/store-mega-menu";
import { NavMascot } from "@/components/layout/nav-mascot";
import { SearchTypewriter } from "@/components/layout/search-typewriter";
import { TopBarDropdown } from "@/components/layout/top-bar-dropdown";
import { PromoCodeButton } from "@/components/layout/promo-code-button";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useCart } from "@/lib/cart/provider";
import { cn } from "@/lib/utils";
import type { Notification } from "@/lib/supabase/types";

export interface HeaderUser {
  nickname: string;
  balance: number;
  isAdmin: boolean;
  avatarPath: string | null;
  unreadCount: number;
  notifications: Notification[];
}

export function SiteHeader({
  user,
  megaProducts = [],
  megaCategories = [],
}: {
  user: HeaderUser | null;
  megaProducts?: MegaProduct[];
  megaCategories?: MegaCategory[];
}) {
  const [open, setOpen] = useState(false);
  const { t, money } = useI18n();
  const { count } = useCart();
  const pathname = usePathname();

  // Aktif sayfa kontrolü — anasayfa tam eşleşme, diğerleri prefix.
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Katman 3 — ana navigasyon (Mağaza mega-menü ayrı; bunlar onun yanındakiler).
  const NAV = [
    { href: "/", label: t("nav.home"), icon: House },
    { href: "/orders", label: t("nav.orders"), icon: Receipt, auth: true },
    { href: "/raffles", label: t("nav.raffles"), icon: Trophy },
    { href: "/publisher", label: t("nav.publishers"), icon: UsersThree },
    { href: "/news", label: t("nav.news"), icon: Newspaper },
    { href: "/earn", label: t("nav.earn"), icon: CurrencyCircleDollar },
    { href: "/help", label: t("nav.help"), icon: Question },
  ];

  function openSearch() {
    window.dispatchEvent(new Event("open-command-palette"));
  }

  return (
    <header className="contents">
      {/* ───────── KATMAN 1 — üst şerit (footer ile aynı desenli koyu zemin) ───────── */}
      <div className="relative z-[60] hidden border-b border-white/10 lg:block">
        {/* Desenli arka plan (tilki bandından kırpılmış) + hafif karartma.
            overflow-hidden yalnız bu görsel katmanda — dropdown panelleri (üst
            şeritteki Kurumsal/Yayıncı menüleri) şerit altına taşabilsin diye
            dış konteynerde DEĞİL. */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <Image
            src="/topbar-pattern.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-[#1b2440]/28" />
        </div>
        <div className="relative mx-auto flex h-11 w-full max-w-[1440px] items-center justify-end px-4 text-[13px] text-white/80 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <span className="mx-0.5 h-3.5 w-px bg-white/20" />
            {/* Bağış kutusu — kırmızı RGB; karşılıksız destek + rozet */}
            <Link
              href="/support-us"
              className="animate-rgb-red group inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-bold text-white shadow-sm transition-transform hover:scale-105"
            >
              <Heart size={15} weight="fill" className="transition-transform group-hover:scale-125" />
              {t("nav.donate")}
            </Link>
            <span className="mx-0.5 h-3.5 w-px bg-white/20" />
            <TopBarDropdown
              label={t("nav.corporate")}
              icon={Buildings}
              items={[
                { href: "/about", label: t("footer.about"), icon: Info },
                { href: "/contact", label: t("footer.contact"), icon: EnvelopeSimple },
                {
                  href: "/terms",
                  label: t("footer.terms"),
                  icon: Article,
                },
                {
                  href: "/privacy",
                  label: t("footer.privacy"),
                  icon: ShieldCheck,
                },
                {
                  href: "/refund",
                  label: t("footer.refund"),
                  icon: ArrowUDownLeft,
                },
                {
                  href: "/distance-sales",
                  label: t("footer.distanceSales"),
                  icon: FileText,
                },
              ]}
            />
            <TopBarDropdown
              label={t("nav.publishers")}
              icon={Broadcast}
              items={[
                { href: "/publisher", label: t("nav.publishers"), icon: UsersThree },
                {
                  href: "/publisher/apply",
                  label: t("header.publisherApply"),
                  icon: FileText,
                },
              ]}
            />
            <TopBarDropdown
              label={t("nav.resellers")}
              icon={Storefront}
              items={[
                { href: "/reseller", label: t("nav.resellers"), icon: UsersThree },
                {
                  href: "/reseller/apply",
                  label: t("header.resellerApply"),
                  icon: FileText,
                },
              ]}
            />
            {!user && (
              <>
                <span className="mx-0.5 h-3.5 w-px bg-white/20" />
                <Link
                  href="/sign-in"
                  className="rounded-lg border border-brand-300 bg-brand-50 px-3 py-1.5 text-[13px] font-semibold text-brand-700 transition-colors hover:bg-brand-100"
                >
                  {t("nav.signin")}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ───────── KATMAN 2 — ana satır (scroll'da kayar; dropdown'lar Katman 3'ün üstünde açılsın diye z-50) ───────── */}
      <div className="glass relative z-50 mx-auto flex h-24 w-full max-w-[1440px] items-center gap-5 border-b border-ink-200/60 px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Büyük arama — sabit genişlik; esnemez. Üstünde yürüyen tilki maskotu. */}
        <div className="relative hidden w-full max-w-[420px] md:block">
          {/* Arama kutusunun üst kenarında yürüyen tilki */}
          <NavMascot />
          <button
            type="button"
            onClick={openSearch}
            aria-label={t("header.search")}
            className="flex h-12 w-full items-center gap-2.5 rounded-full border border-ink-200 bg-white px-5 text-[15px] text-ink-400 transition-colors hover:border-brand-300"
          >
            <MagnifyingGlass size={20} className="shrink-0" />
            <SearchTypewriter items={megaProducts.map((p) => p.name)} />
            <kbd className="ml-auto shrink-0 rounded border border-ink-200 bg-ink-50 px-1.5 text-[10px] font-medium text-ink-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Sağ aksiyonlar — aramaya yakın, sola toplanır (boşluk sağda kalır) */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Mobil arama ikonu */}
          <button
            type="button"
            onClick={openSearch}
            aria-label={t("header.search")}
            className="grid h-10 w-10 place-items-center rounded-full text-ink-700 transition-colors hover:bg-ink-100 md:hidden"
          >
            <MagnifyingGlass size={20} />
          </button>

          {/* Whatsapp Destek (Hipopotam düzeni) */}
          <a
            href="https://wa.me/908500000000"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2.5 xl:flex"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#25D366]/10 text-[#25D366]">
              <WhatsappLogo size={24} weight="fill" />
            </span>
            <span className="leading-tight">
              <span className="block text-[12px] font-medium text-ink-600">
                {t("header.whatsappSupport")}
              </span>
              <span className="block whitespace-nowrap text-sm font-bold text-ink-900">
                0(850) 000-0000
              </span>
            </span>
          </a>

          {/* Cüzdan dikey blok (Hipopotam düzeni) */}
          {user && (
            <>
              <span className="hidden h-9 w-px bg-ink-200 lg:block" />
              <Link
                href="/wallet"
                className="hidden items-center gap-2.5 transition-opacity hover:opacity-80 lg:flex"
              >
                <Wallet size={26} weight="duotone" className="shrink-0 text-ink-700" />
                <span className="leading-tight">
                  <span className="block text-[12px] font-medium text-ink-600">{t("header.wallet")}</span>
                  <span className="block text-sm font-bold text-ink-900">
                    {money(user.balance)}
                  </span>
                </span>
              </Link>
            </>
          )}

          <span className="hidden h-9 w-px bg-ink-200 lg:block" />

          {/* İkon grubu — Mesajlar / Bildirimler / Sepet (etiketli, büyük + ferah) */}
          <div className="flex items-center gap-3 lg:gap-5">
            {user && (
              <Link
                href="/messages"
                aria-label={t("header.messages")}
                className="group relative flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 transition-colors hover:bg-ink-100"
              >
                <ChatCircleDots size={28} weight="duotone" className="text-ink-700" />
                <span className="hidden text-[11px] font-medium text-ink-500 lg:block">
                  {t("header.messages")}
                </span>
              </Link>
            )}

            {user && (
              <div className="flex flex-col items-center gap-1 px-1.5">
                <NotificationBell
                  unreadCount={user.unreadCount}
                  items={user.notifications}
                />
                <span className="hidden text-[11px] font-medium text-ink-500 lg:block">
                  {t("header.notifications")}
                </span>
              </div>
            )}

            {/* Sepet */}
            <Link
              href="/cart"
              aria-label={t("header.cartAria")}
              className="group relative flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 transition-colors hover:bg-ink-100"
            >
              <span className="relative">
                <ShoppingCart size={28} weight="duotone" className="text-ink-700" />
                {count > 0 && (
                  <span className="absolute -right-2.5 -top-2.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white">
                    {count}
                  </span>
                )}
              </span>
              <span className="hidden text-[11px] font-medium text-ink-500 lg:block">
                {t("header.cart")}
              </span>
            </Link>
          </div>

          {user && <span className="hidden h-9 w-px bg-ink-200 lg:block" />}

          {user ? (
            <ProfileMenu
              nickname={user.nickname}
              avatarPath={user.avatarPath}
              isAdmin={user.isAdmin}
            />
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/sign-in">{t("nav.signin")}</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">{t("nav.signup")}</Link>
              </Button>
            </div>
          )}

          {/* Mobil menü tuşu */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full text-ink-700 hover:bg-ink-100 lg:hidden"
            aria-label={t("header.menu")}
          >
            {open ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
      </div>

      {/* ───────── KATMAN 3 — nav satırı (TEK BAŞINA sticky; üst katmanlar kaybolur) ───────── */}
      <div className="sticky top-0 z-40 hidden bg-[#f8fafc] px-4 py-3 sm:px-6 lg:block lg:px-8">
        <nav className="relative mx-auto flex h-14 w-full max-w-[1440px] items-center gap-1 rounded-2xl border-2 border-ink-900 bg-white px-4 shadow-card">
          {/* Anasayfa solda, hemen sağında Mağaza mega-menüsü */}
          <Link
            href="/"
            aria-current={isActive("/") ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
              isActive("/")
                ? "bg-brand-600 text-white shadow-soft"
                : "text-ink-700 hover:bg-ink-100 hover:text-ink-900",
            )}
          >
            <House size={17} weight="duotone" />
            {t("nav.home")}
          </Link>
          <StoreMegaMenu
            products={megaProducts}
            categories={megaCategories}
            label={t("nav.store")}
          />
          {NAV.filter((n) => n.href !== "/" && (!n.auth || user)).map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
                isActive(n.href)
                  ? "bg-brand-600 text-white shadow-soft"
                  : "text-ink-700 hover:bg-ink-100 hover:text-ink-900",
              )}
            >
              <n.icon size={17} weight="duotone" />
              {n.label}
            </Link>
          ))}
          {/* Sağ grup: Yönetim (admin) + RGB Promo Kod */}
          <div className="ml-auto flex items-center gap-2">
            {user?.isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold text-accent-700 transition-colors hover:bg-accent-50"
              >
                <ShieldStar size={17} weight="duotone" />
                {t("nav.admin")}
              </Link>
            )}
            <PromoCodeButton />
          </div>
        </nav>
      </div>

      {/* ───────── Mobil menü ───────── */}
      <div
        className={cn(
          "overflow-hidden border-t border-ink-200/60 bg-white/90 backdrop-blur-xl transition-all lg:hidden",
          open ? "max-h-[40rem]" : "max-h-0 border-t-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3 sm:px-6">
          <Link
            href="/store"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-800 hover:bg-ink-100"
          >
            <Storefront size={18} weight="duotone" />
            {t("nav.store")}
          </Link>
          {NAV.filter((n) => !n.auth || user).map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-800 hover:bg-ink-100"
            >
              <n.icon size={18} weight="duotone" />
              {n.label}
            </Link>
          ))}

          <div className="my-1 h-px bg-ink-200/60" />

          {/* Başvuru linkleri (mobilde de) */}
          <Link
            href="/publisher"
            onClick={() => setOpen(false)}
            className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 hover:bg-ink-100"
          >
            {t("misc.header.publisherApply")}
          </Link>
          <Link
            href="/reseller"
            onClick={() => setOpen(false)}
            className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 hover:bg-ink-100"
          >
            {t("misc.header.resellerApply")}
          </Link>

          {user && (
            <Link
              href="/wallet"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
            >
              <span className="flex items-center gap-2.5">
                <Wallet size={18} weight="fill" /> {t("nav.wallet")}
              </span>
              {money(user.balance)}
            </Link>
          )}
          {user?.isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-accent-700 hover:bg-accent-50"
            >
              <ShieldStar size={18} weight="duotone" /> {t("nav.admin")}
            </Link>
          )}
          {!user && (
            <Button asChild variant="ghost" size="sm" className="mt-1 justify-start">
              <Link href="/sign-in" onClick={() => setOpen(false)}>
                {t("nav.signin")}
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}

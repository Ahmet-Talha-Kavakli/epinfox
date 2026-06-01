"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { SignOut } from "@phosphor-icons/react";
import { UserAvatar } from "@/components/account/user-avatar";
import { ACCOUNT_NAV, isActiveNav } from "@/components/account/account-nav";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export function AccountShell({
  user,
  title,
  description,
  actions,
  children,
}: {
  user: { nickname: string; email: string; avatarPath: string | null };
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { t } = useI18n();

  return (
    <section className="container-page py-8">
      {/* Masaüstünde tüm ızgarayı sola çek (lg:-ml-*) + sidebar↔içerik arası
         mesafeyi aç (lg:gap-14). Sidebar container'ın sol kenarına yaklaşır. */}
      <div className="grid grid-cols-1 gap-8 lg:-ml-10 lg:grid-cols-[230px_1fr] lg:gap-14 xl:-ml-16">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          {/* Kullanıcı kartı */}
          <div className="flex items-center gap-3 rounded-2xl border border-ink-200 bg-white p-4">
            <UserAvatar
              name={user.nickname}
              avatarPath={user.avatarPath}
              size={44}
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink-900">
                {user.nickname}
              </p>
              <p className="truncate text-xs text-ink-500">{user.email}</p>
            </div>
          </div>

          {/* Menü — Hipopotam tarzı: alt-çizgili liste, aktif öğede sol mavi şerit */}
          <nav className="mt-3 flex gap-1 overflow-x-auto lg:mt-4 lg:flex-col lg:gap-0 lg:overflow-visible">
            {ACCOUNT_NAV.map((item) => {
              const active = isActiveNav(item, pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative inline-flex shrink-0 items-center gap-3 px-3.5 py-3 text-sm font-medium transition-colors",
                    // Desktop'ta alt-çizgili liste; mobilde yuvarlak chip
                    "rounded-xl lg:rounded-none lg:border-b lg:border-ink-200/70",
                    active
                      ? "bg-brand-50 text-brand-700 lg:bg-transparent"
                      : "text-ink-600 hover:bg-ink-100 hover:text-ink-900 lg:hover:bg-transparent lg:hover:text-brand-700",
                  )}
                >
                  {/* Aktif sol şerit (sadece desktop) */}
                  <span
                    className={cn(
                      "absolute inset-y-1.5 left-0 hidden w-0.5 rounded-full bg-brand-600 transition-opacity lg:block",
                      active ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <item.icon
                    size={18}
                    weight={active ? "fill" : "duotone"}
                    className={cn(active ? "text-brand-600" : "text-ink-400")}
                  />
                  {t(item.labelKey)}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => signOut({ redirectUrl: "/" })}
              className="inline-flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-danger-600 transition-colors hover:bg-danger-50 lg:mt-1 lg:rounded-none lg:hover:bg-transparent lg:hover:text-danger-700"
            >
              <SignOut size={18} weight="duotone" />
              {t("account.nav.signOut")}
            </button>
          </nav>
        </aside>

        {/* İçerik */}
        <div className="min-w-0">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-ink-900">{title}</h1>
              {description && (
                <p className="mt-1 text-sm text-ink-500">{description}</p>
              )}
            </div>
            {actions}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

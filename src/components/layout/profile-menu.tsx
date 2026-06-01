"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { CaretDown, SignOut, ShieldStar } from "@phosphor-icons/react";
import { UserAvatar } from "@/components/account/user-avatar";
import { ACCOUNT_NAV } from "@/components/account/account-nav";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export function ProfileMenu({
  nickname,
  avatarPath,
  isAdmin,
}: {
  nickname: string;
  avatarPath: string | null;
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { signOut } = useClerk();
  const { t } = useI18n();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("account.nav.menuLabel")}
        className="flex items-center gap-1.5 rounded-full transition-transform hover:scale-105"
      >
        <UserAvatar name={nickname} avatarPath={avatarPath} size={42} />
        <CaretDown
          size={16}
          weight="bold"
          className={cn(
            "text-ink-500 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right animate-scale-in overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-float">
          {/* Üst kullanıcı bilgisi */}
          <div className="flex items-center gap-3 border-b border-ink-200/70 px-4 py-3">
            <UserAvatar name={nickname} avatarPath={avatarPath} size={38} />
            <p className="truncate text-sm font-semibold text-ink-900">
              {nickname}
            </p>
          </div>

          <nav className="max-h-[60vh] overflow-y-auto py-1.5">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-accent-700 transition-colors hover:bg-accent-50"
              >
                <ShieldStar size={18} weight="duotone" />
                {t("account.nav.admin")}
              </Link>
            )}
            {ACCOUNT_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 transition-colors hover:bg-ink-50 hover:text-ink-900"
              >
                <item.icon size={18} weight="duotone" className="text-ink-500" />
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              signOut({ redirectUrl: "/" });
            }}
            className="flex w-full items-center gap-2.5 border-t border-ink-200/70 px-4 py-3 text-sm font-medium text-danger-600 transition-colors hover:bg-danger-50"
          >
            <SignOut size={18} weight="duotone" />
            {t("account.nav.signOut")}
          </button>
        </div>
      )}
    </div>
  );
}

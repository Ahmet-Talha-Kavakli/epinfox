"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SquaresFour,
  Package,
  Ticket,
  Receipt,
  Truck,
  ShareNetwork,
  ListChecks,
  Storefront,
  UsersThree,
  Wallet,
  Headset,
  Megaphone,
  Tag,
  House,
  CurrencyCircleDollar,
  type Icon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: Icon;
  exact?: boolean;
  badgeKey?: "deliveries" | "resellers" | "tickets" | "earn";
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const GROUPS: NavGroup[] = [
  {
    title: "Genel",
    items: [{ href: "/admin", label: "Özet", icon: SquaresFour, exact: true }],
  },
  {
    title: "Katalog",
    items: [
      { href: "/admin/products", label: "Ürünler", icon: Package },
      { href: "/admin/codes", label: "Kodlar & Stok", icon: Ticket },
      { href: "/admin/promos", label: "Promo Kodlar", icon: Tag },
    ],
  },
  {
    title: "Satış",
    items: [
      { href: "/admin/orders", label: "Siparişler", icon: Receipt },
      { href: "/admin/pending-deliveries", label: "Bekleyen Teslimat", icon: Truck, badgeKey: "deliveries" },
      { href: "/admin/finance", label: "Finans / Cüzdan", icon: Wallet },
    ],
  },
  {
    title: "Kullanıcılar",
    items: [
      { href: "/admin/users", label: "Kullanıcılar", icon: UsersThree },
      { href: "/admin/resellers", label: "Bayi Başvuruları", icon: Storefront, badgeKey: "resellers" },
      { href: "/admin/publishers", label: "Yayıncı Başvuruları", icon: Megaphone },
      { href: "/admin/earn", label: "Para Kazan", icon: CurrencyCircleDollar, badgeKey: "earn" },
      { href: "/admin/support", label: "Destek Talepleri", icon: Headset, badgeKey: "tickets" },
    ],
  },
  {
    title: "İletişim & Sistem",
    items: [
      { href: "/admin/broadcast", label: "Duyuru Gönder", icon: Megaphone },
      { href: "/admin/smm", label: "SMM", icon: ShareNetwork },
      { href: "/admin/supply-logs", label: "Tedarik Logları", icon: ListChecks },
    ],
  },
];

export function AdminSidebar({
  badges,
}: {
  badges?: { deliveries?: number; resellers?: number; tickets?: number; earn?: number };
}) {
  const pathname = usePathname();
  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <aside className="flex flex-col gap-5">
      {GROUPS.map((g) => (
        <div key={g.title}>
          <p className="mb-1.5 px-3 text-[11px] font-bold uppercase tracking-wide text-ink-400">
            {g.title}
          </p>
          <nav className="flex flex-col gap-0.5">
            {g.items.map((item) => {
              const active = isActive(item);
              const badge = item.badgeKey ? badges?.[item.badgeKey] : 0;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-ink-600 hover:bg-ink-100 hover:text-ink-900",
                  )}
                >
                  <item.icon
                    size={18}
                    weight={active ? "fill" : "duotone"}
                    className={active ? "text-brand-600" : "text-ink-400"}
                  />
                  <span className="flex-1">{item.label}</span>
                  {badge ? (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-danger-500 px-1 text-[11px] font-bold text-white">
                      {badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}

      {/* Siteye dön */}
      <Link
        href="/"
        className="mt-2 flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
      >
        <House size={18} weight="duotone" /> Siteye Dön
      </Link>
    </aside>
  );
}

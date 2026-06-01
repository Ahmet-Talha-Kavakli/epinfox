// Hesap menüsü — tek kaynak. Hem profil dropdown'ı hem AccountShell sidebar
// bu listeyi kullanır. Yeni bir hesap sayfası eklemek için tek yer burası.

import {
  SquaresFour,
  Gear,
  ShieldCheck,
  Wallet,
  ArrowsClockwise,
  Receipt,
  FileText,
  Bell,
  Headset,
  UsersThree,
  ShareNetwork,
  Storefront,
  Plugs,
  MapPinLine,
  HandHeart,
  GameController,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";

export interface AccountNavItem {
  href: string;
  /** i18n anahtarı (örn. "account.nav.home"). Tüketen bileşen t() ile çevirir. */
  labelKey: string;
  icon: Icon;
  /** Aktiflik için: tam eşleşme mi yoksa prefix mi. */
  exact?: boolean;
}

export const ACCOUNT_NAV: AccountNavItem[] = [
  { href: "/account", labelKey: "account.nav.home", icon: SquaresFour, exact: true },
  { href: "/account/settings", labelKey: "account.nav.settings", icon: Gear },
  { href: "/account/security", labelKey: "account.nav.security", icon: ShieldCheck },
  { href: "/wallet", labelKey: "account.nav.wallet", icon: Wallet, exact: true },
  { href: "/wallet/transactions", labelKey: "account.nav.transactions", icon: ArrowsClockwise },
  { href: "/orders", labelKey: "account.nav.orders", icon: Receipt },
  { href: "/invoices", labelKey: "account.nav.invoices", icon: FileText },
  { href: "/notifications", labelKey: "account.nav.notifications", icon: Bell },
  { href: "/support", labelKey: "account.nav.support", icon: Headset },
  { href: "/referral", labelKey: "account.nav.referral", icon: UsersThree },
  { href: "/account/social", labelKey: "account.nav.social", icon: ShareNetwork },
  { href: "/account/player-ids", labelKey: "account.nav.playerIds", icon: GameController },
  { href: "/account/reseller", labelKey: "account.nav.reseller", icon: Storefront },
  { href: "/account/api", labelKey: "account.nav.api", icon: Plugs },
  { href: "/account/billing", labelKey: "account.nav.billing", icon: MapPinLine },
  { href: "/account/donations", labelKey: "account.nav.donations", icon: HandHeart },
];

/** Verilen pathname için aktif nav öğesini bulur (en uzun prefix kazanır). */
export function isActiveNav(item: AccountNavItem, pathname: string): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

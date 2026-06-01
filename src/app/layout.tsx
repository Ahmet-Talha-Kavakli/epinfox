import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { cookies } from "next/headers";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SupportChat } from "@/components/support/support-chat";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getOnboardingProgress, type OnboardingProgress } from "@/lib/actions/onboarding";
import { OnboardingWidget } from "@/components/onboarding/onboarding-widget";
import { createAdminClient } from "@/lib/supabase/server";
import { getUnreadCount, getRecentNotifications } from "@/lib/notifications";
import { getProducts, getCategories } from "@/lib/store";
import type { MegaProduct, MegaCategory } from "@/components/layout/store-mega-menu";
import type { Notification } from "@/lib/supabase/types";
import { I18nProvider } from "@/lib/i18n/provider";
import { CommandPalette } from "@/components/layout/command-palette";
import { PromoPopup } from "@/components/layout/promo-popup";
import { SatisfactionPopup } from "@/components/layout/satisfaction-popup";
import { CartProvider } from "@/lib/cart/provider";
import {
  DEFAULT_LOCALE,
  LOCALE_META,
  type Locale,
  type CurrencyCode,
  LOCALES,
  CURRENCIES,
} from "@/lib/i18n/config";
import { getLiveRates } from "@/lib/i18n/rates";
import { SITE } from "@/config/site";

// Header auth-aware (cookie okur) — her istek dinamik.
export const dynamic = "force-dynamic";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  category: "shopping",
  keywords: [
    "epin",
    "e-pin",
    "oyun bakiyesi",
    "PUBG UC",
    "Valorant VP",
    "Steam cüzdan",
    "Google Play kodu",
    "Discord Nitro",
    "dijital kod",
    "anlık teslim",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    siteName: SITE.name,
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.tagline,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let current = null;
  try {
    current = await getCurrentUser();
  } catch {
    current = null;
  }

  // Bildirim sayacı + son bildirimler (giriş yapmış kullanıcı için).
  let unreadCount = 0;
  let notifications: Notification[] = [];
  let onboarding: OnboardingProgress | null = null;
  if (current) {
    try {
      const supabase = await createAdminClient();
      [unreadCount, notifications, onboarding] = await Promise.all([
        getUnreadCount(supabase, current.user.id),
        getRecentNotifications(supabase, current.user.id, 8),
        getOnboardingProgress({
          id: current.user.id,
          avatar_path: current.avatarPath,
        }),
      ]);
    } catch {
      // bildirim/onboarding opsiyonel — hata akışı kırmamalı
    }
  }

  // Komut paleti + mağaza mega-menüsü için hafif ürün/kategori listesi.
  let paletteProducts: {
    slug: string;
    name: string;
    image: string | null;
    minPrice: number;
  }[] = [];
  let megaProducts: MegaProduct[] = [];
  let megaCategories: MegaCategory[] = [];
  try {
    const [all, cats] = await Promise.all([
      getProducts({ sort: "popular" }),
      getCategories(),
    ]);
    paletteProducts = all.map((p) => ({
      slug: p.slug,
      name: p.name,
      image: p.image_path,
      minPrice: p.minPrice ?? p.price,
    }));
    megaProducts = all.map((p, i) => ({
      slug: p.slug,
      name: p.name,
      description: p.description,
      image: p.image_path,
      minPrice: p.minPrice ?? p.price,
      categoryId: p.category_id,
      featured: i < 3, // "populer" sıralı ilk 3 öne çıkar
    }));
    megaCategories = cats.map((c) => ({ id: c.id, slug: c.slug, name: c.name }));
  } catch {
    // arama/menü opsiyonel — hata akışı kırmamalı
  }

  // Cookie'den dil/para birimi (SSR hydration uyumu)
  const cookieStore = await cookies();
  const cl = cookieStore.get("locale")?.value;
  const cc = cookieStore.get("currency")?.value;
  const initialLocale: Locale = (LOCALES as readonly string[]).includes(cl ?? "")
    ? (cl as Locale)
    : DEFAULT_LOCALE;
  const initialCurrency: CurrencyCode = (CURRENCIES as readonly string[]).includes(
    cc ?? "",
  )
    ? (cc as CurrencyCode)
    : LOCALE_META[initialLocale].defaultCurrency;
  const dir = LOCALE_META[initialLocale].dir;

  // Canlı döviz kuru (TRY tabanlı, fetch cache'i ile 6 saat). API yoksa fallback.
  const rates = await getLiveRates();

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#2563eb",
          fontFamily: "var(--font-sora)",
          borderRadius: "0.75rem",
        },
      }}
    >
      <html
        lang={initialLocale}
        dir={dir}
        className={`${sora.variable} antialiased`}
      >
        <body className="flex min-h-screen flex-col text-ink-900">
          <I18nProvider
            initialLocale={initialLocale}
            initialCurrency={initialCurrency}
            rates={rates}
          >
            <CartProvider>
            <SiteHeader
              user={
                current
                  ? {
                      nickname: current.nickname,
                      balance: current.balance,
                      isAdmin: current.isAdmin,
                      avatarPath: current.avatarPath,
                      unreadCount,
                      notifications,
                    }
                  : null
              }
              megaProducts={megaProducts}
              megaCategories={megaCategories}
            />
            <main className="flex-1 flex flex-col">{children}</main>
            <SiteFooter year={new Date().getFullYear()} />
            <SupportChat />
            <ScrollToTop />
            {onboarding && <OnboardingWidget progress={onboarding} />}
            <CommandPalette products={paletteProducts} />
            <PromoPopup />
            <SatisfactionPopup />
            </CartProvider>
          </I18nProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

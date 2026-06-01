import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import {
  getProducts,
  getBrands,
  getRecentReviews,
} from "@/lib/store";
import { ProductCard } from "@/components/store/product-card";
import { GameIconStrip } from "@/components/store/game-icon-strip";
import { BigGameCards } from "@/components/store/big-game-cards";
// (eski hero kaldırıldı: SearchBar/HeroCarousel/Button/SITE artık kullanılmıyor)
import { RecentReviews } from "@/components/store/recent-reviews";
import { BlogStrip } from "@/components/store/blog-strip";
import { TrustMarquee } from "@/components/store/trust-marquee";
import { CampaignBento, type CampaignCard } from "@/components/store/campaign-bento";
import { CommissionBanner } from "@/components/store/commission-banner";
import {
  HeroSection,
  type HeroSlide,
  type HeroSideCard,
} from "@/components/store/hero-section";
import { getAllNews } from "@/lib/content";
import { getServerT, getServerLocale } from "@/lib/i18n/server";

export default async function HomePage() {
  const locale = await getServerLocale();
  const [featured, brands, reviews, t] = await Promise.all([
    getProducts({ limit: 15 }),
    getBrands(),
    getRecentReviews(12, locale),
    getServerT(),
  ]);

  // Hero — sol büyük slider (otomatik dönen tanıtım banner'ları).
  const HERO_SLIDES: HeroSlide[] = [
    { image: "/promo/promo-bayram.webp", title: t("home.hero.bayram.title"), subtitle: t("home.hero.bayram.sub"), href: "/store" },
    { image: "/promo/promo-hero.webp", title: t("home.hero.season.title"), subtitle: t("home.hero.season.sub"), href: "/store" },
    { image: "/promo/promo-abonelik.webp", title: t("home.hero.subs.title"), subtitle: t("home.hero.subs.sub"), href: "/store?category=abonelik" },
    { image: "/promo/promo-komisyon.webp", title: t("home.hero.commission.title"), subtitle: t("home.hero.commission.sub"), href: "/wallet" },
  ];

  // Hero — sağ 2 sabit kart (maskotlu görseller).
  const HERO_SIDE: HeroSideCard[] = [
    { image: "/promo/side-sosyal.webp", title: t("home.hero.social.title"), subtitle: t("home.hero.social.sub"), href: "/store?category=sosyal-medya" },
    { image: "/promo/side-cuzdan.webp", title: t("home.hero.wallet.title"), subtitle: t("home.hero.wallet.sub"), href: "/wallet" },
  ];

  // Kampanya bento (Popüler Oyunlar altı — Hipopotamya düzeni: sol büyük + sağ geniş + 2 küçük).
  const CAMPAIGN_CARDS: [CampaignCard, CampaignCard, CampaignCard, CampaignCard] = [
    { id: "camp-sosyal", title: t("home.camp.social.title"), subtitle: t("home.camp.social.sub"), cta: t("home.camp.social.cta"), href: "/store?category=sosyal-medya", image: "/campaign/camp-sosyal.webp" },
    { id: "camp-cekilis", title: t("home.camp.raffle.title"), subtitle: t("home.camp.raffle.sub"), cta: t("home.camp.raffle.cta"), href: "/raffles", image: "/campaign/camp-cekilis.webp" },
    { id: "camp-hediye", title: t("home.camp.gift.title"), cta: t("home.camp.gift.cta"), href: "/store?category=platform-bakiye", image: "/campaign/camp-hediye.webp" },
    { id: "camp-cuzdan", title: t("home.camp.wallet.title"), cta: t("home.camp.wallet.cta"), href: "/wallet", image: "/promo/side-cuzdan.webp" },
  ];

  // Büyük oyun kartları için ilk 8 marka (görselli olanlar öncelikli görünür)
  const bigBrands = brands.slice(0, 8);

  return (
    <>
      {/* 1) EN ÜST — HAREKETLİ OYUN İKON ŞERİDİ (sola kayar, hover'da durur) */}
      <GameIconStrip brands={brands} />

      {/* 2) HERO — sol büyük slider + sağ 2 sabit kart */}
      <HeroSection slides={HERO_SLIDES} sideCards={HERO_SIDE} />

      {/* GÜVEN/ÖZELLİK ŞERİDİ — sonsuz kayan (Popüler Oyunlar'ın ÜSTÜNDE) */}
      <div className="py-3 md:py-6">
        <TrustMarquee />
      </div>

      {/* 2) BÜYÜK OYUN KARTLARI */}
      <section className="container-page py-8 md:py-12">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-xl font-bold text-ink-900">{t("home.popularGames")}</h2>
          <Link
            href="/store"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline"
          >
            {t("home.all")} <ArrowRight size={15} />
          </Link>
        </div>
        <BigGameCards brands={bigBrands} />
      </section>

      {/* 2b) KAMPANYA BENTO — Popüler Oyunlar altı (Hipopotamya düzeni) */}
      <section className="container-page py-6 md:py-8">
        <CampaignBento cards={CAMPAIGN_CARDS} />
      </section>

      {/* 2c) DÜŞÜK KOMİSYON BANNER — kampanya bento altı (Hipopotamya düzeni) */}
      <section className="container-page py-4 md:py-6">
        <CommissionBanner />
      </section>

      {/* 5) SİZİN İÇİN SEÇTİKLERİMİZ */}
      <section className="container-page py-6 md:py-10">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-ink-900">
              {t("home.forYou")}
            </h2>
            <p className="text-sm text-ink-500">{t("home.forYou.sub")}</p>
          </div>
          <Link
            href="/store"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline"
          >
            {t("home.all")} <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 6) EN YENİ SİPARİŞ YORUMLARI — sonsuz kayan şerit (gerçek + sahte) */}
      {reviews.length > 0 && (
        <section className="container-page py-8 md:py-12">
          <h2 className="mb-6 text-center text-xl font-bold text-ink-900">
            {t("home.recentReviews")}
          </h2>
          <RecentReviews reviews={reviews} />
        </section>
      )}

      {/* 7) BLOGUMUZDAN */}
      <section className="container-page py-6 pb-14 md:py-10">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-xl font-bold text-ink-900">{t("home.fromBlog")}</h2>
          <Link
            href="/news"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline"
          >
            {t("home.showAll")} <ArrowRight size={15} />
          </Link>
        </div>
        <BlogStrip items={getAllNews(locale).slice(0, 4)} locale={locale} />
      </section>
    </>
  );
}

import type { Dict } from "./core";

// i18n parça dosyası. dictionaries.ts birleştirir.
// site.ts'teki tagline/description'ın çeviri karşılığı (cfg.*).
// site.ts sabiti `as const` olduğu için TR fallback/SEO metadata orada kalır;
// görünür UI'de tagline/desc render edildiğinde bu anahtarlar kullanılır.
// Marka adı (EpinFox) çevrilmez.

export const tr: Dict = {
  "cfg.tagline": "Anlık dijital kod ve oyun bakiyesi",
  "cfg.desc":
    "EpinFox — oyun e-pinleri, platform bakiyeleri, abonelikler ve dijital hizmetler. Cüzdanına yükle, anında satın al, kodun saniyeler içinde hesabında.",
};

export const en: Dict = {
  "cfg.tagline": "Instant digital codes and game balance",
  "cfg.desc":
    "EpinFox — game e-pins, platform balances, subscriptions and digital services. Top up your wallet, buy instantly, and get your code in your account within seconds.",
};

export const de: Dict = {
  "cfg.tagline": "Sofortige digitale Codes und Spielguthaben",
  "cfg.desc":
    "EpinFox — Spiele-E-Pins, Plattformguthaben, Abonnements und digitale Dienste. Lade dein Guthaben auf, kaufe sofort und erhalte deinen Code innerhalb von Sekunden auf deinem Konto.",
};

export const ar: Dict = {
  "cfg.tagline": "أكواد رقمية ورصيد ألعاب فوري",
  "cfg.desc":
    "EpinFox — بطاقات شحن الألعاب وأرصدة المنصات والاشتراكات والخدمات الرقمية. اشحن محفظتك واشترِ فورًا واحصل على الكود في حسابك خلال ثوانٍ.",
};

export const ru: Dict = {
  "cfg.tagline": "Мгновенные цифровые коды и игровой баланс",
  "cfg.desc":
    "EpinFox — игровые e-pin, балансы платформ, подписки и цифровые услуги. Пополните кошелёк, купите мгновенно и получите код на свой аккаунт за считанные секунды.",
};

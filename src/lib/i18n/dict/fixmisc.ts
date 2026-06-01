import type { Dict } from "./core";

// Ana sayfa "En Yeni Sipariş Yorumları" şeridindeki sahte yorum havuzu.
// store.ts (server-only) bu anahtarları DICTIONARIES[locale] üzerinden okur ve
// locale'e göre çevirili gösterir. Göreli zaman (ago) artık gerçek created_at +
// timeAgo(locale) ile üretildiğinden burada sadece yorum metni var.

export const tr: Dict = {
  "rev.fake.0": "Anında teslim edildi, kod sorunsuz çalıştı.",
  "rev.fake.1": "Çok hızlı, teşekkürler.",
  "rev.fake.2": "Güvenilir site, tekrar alacağım.",
  "rev.fake.3": "Sorunsuz, anında geldi.",
  "rev.fake.4": "Hızlı teslimat, memnun kaldım.",
  "rev.fake.5": "Süper, 1 dakikada hesabıma geçti.",
  "rev.fake.6": "Fiyatı uygun, işlem kolaydı.",
  "rev.fake.7": "Anında teslim, teşekkürler.",
  "rev.fake.8": "Çok pratik, tavsiye ederim.",
  "rev.fake.9": "Beklediğimden hızlı geldi.",
  "rev.fake.10": "Güvenle alışveriş yapabilirsiniz.",
  "rev.fake.11": "Anında teslim, sorun yok.",
};

export const en: Dict = {
  "rev.fake.0": "Delivered instantly, the code worked flawlessly.",
  "rev.fake.1": "Very fast, thank you.",
  "rev.fake.2": "Trustworthy site, I'll buy again.",
  "rev.fake.3": "Smooth, arrived instantly.",
  "rev.fake.4": "Fast delivery, I'm satisfied.",
  "rev.fake.5": "Great, hit my account in 1 minute.",
  "rev.fake.6": "Good price, the process was easy.",
  "rev.fake.7": "Instant delivery, thanks.",
  "rev.fake.8": "Very convenient, highly recommend.",
  "rev.fake.9": "Arrived faster than I expected.",
  "rev.fake.10": "You can shop with confidence.",
  "rev.fake.11": "Instant delivery, no issues.",
};

export const de: Dict = {
  "rev.fake.0": "Sofort geliefert, der Code lief einwandfrei.",
  "rev.fake.1": "Sehr schnell, danke.",
  "rev.fake.2": "Vertrauenswürdige Seite, ich kaufe wieder.",
  "rev.fake.3": "Reibungslos, kam sofort an.",
  "rev.fake.4": "Schnelle Lieferung, ich bin zufrieden.",
  "rev.fake.5": "Super, war in 1 Minute auf meinem Konto.",
  "rev.fake.6": "Guter Preis, der Vorgang war einfach.",
  "rev.fake.7": "Sofortige Lieferung, danke.",
  "rev.fake.8": "Sehr praktisch, sehr zu empfehlen.",
  "rev.fake.9": "Kam schneller als erwartet an.",
  "rev.fake.10": "Sie können beruhigt einkaufen.",
  "rev.fake.11": "Sofortige Lieferung, keine Probleme.",
};

export const ar: Dict = {
  "rev.fake.0": "تم التسليم فورًا، والرمز يعمل بلا مشاكل.",
  "rev.fake.1": "سريع جدًا، شكرًا لكم.",
  "rev.fake.2": "موقع موثوق، سأشتري مرة أخرى.",
  "rev.fake.3": "بلا مشاكل، وصل فورًا.",
  "rev.fake.4": "تسليم سريع، أنا راضٍ.",
  "rev.fake.5": "رائع، وصل إلى حسابي خلال دقيقة.",
  "rev.fake.6": "سعر مناسب، والعملية كانت سهلة.",
  "rev.fake.7": "تسليم فوري، شكرًا.",
  "rev.fake.8": "عملي جدًا، أنصح به بشدة.",
  "rev.fake.9": "وصل أسرع مما توقعت.",
  "rev.fake.10": "يمكنكم التسوق بكل ثقة.",
  "rev.fake.11": "تسليم فوري، بلا مشاكل.",
};

export const ru: Dict = {
  "rev.fake.0": "Доставлено мгновенно, код сработал без проблем.",
  "rev.fake.1": "Очень быстро, спасибо.",
  "rev.fake.2": "Надёжный сайт, куплю снова.",
  "rev.fake.3": "Без проблем, пришло мгновенно.",
  "rev.fake.4": "Быстрая доставка, я доволен.",
  "rev.fake.5": "Супер, попало на счёт за 1 минуту.",
  "rev.fake.6": "Хорошая цена, всё прошло легко.",
  "rev.fake.7": "Мгновенная доставка, спасибо.",
  "rev.fake.8": "Очень удобно, рекомендую.",
  "rev.fake.9": "Пришло быстрее, чем я ожидал.",
  "rev.fake.10": "Можете покупать с уверенностью.",
  "rev.fake.11": "Мгновенная доставка, без проблем.",
};

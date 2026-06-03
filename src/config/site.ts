/**
 * Mağaza satış kilidi. Gerçek ödeme (PayTR/Stripe) bağlanana kadar TÜM ürünler
 * "Stok Yok / Tükendi" gösterilir ve satın alma (sepete ekle / hemen al) kilitlenir.
 * Vitrin görünür kalır; yalnızca satış engellenir.
 *
 * Kapatmak için: NEXT_PUBLIC_STORE_LOCKED=false (env) — veya buradaki varsayılanı
 * değiştir. Env "false" değilse kilit AÇIKTIR (güvenli varsayılan).
 * DB'ye dokunmaz; tek noktadan geri alınır.
 */
export const STORE_LOCKED = process.env.NEXT_PUBLIC_STORE_LOCKED !== "false";

export const SITE = {
  name: "EpinFox",
  shortName: "EpinFox",
  tagline: "Anlık dijital kod ve oyun bakiyesi",
  description:
    "EpinFox — oyun e-pinleri, platform bakiyeleri, abonelikler ve dijital hizmetler. Cüzdanına yükle, anında satın al, kodun saniyeler içinde hesabında.",
  url: "https://epinfox.com",
  ogImage: "/og.png",
  socials: {
    discord: "https://discord.gg/epinfox",
    instagram: "https://instagram.com/epinfox",
    x: "https://x.com/epinfox",
  },
  /**
   * Yasal/kurumsal bilgiler — yayına almadan önce gerçek değerlerle doldur.
   * Tüm yasal sayfalar (mesafeli satış, KVKK, iletişim) buradan çeker.
   */
  legal: {
    company: "[ŞİRKET UNVANI — örn. EpinFox Bilişim Ltd. Şti.]",
    address: "[AÇIK ADRES — mahalle, cadde, no, ilçe/il]",
    taxOffice: "[VERGİ DAİRESİ]",
    taxNumber: "[VERGİ NUMARASI]",
    mersis: "[MERSİS NO]",
    etbis: "[ETBİS KAYIT NO]",
    email: "destek@epinfox.com",
    phone: "[TELEFON — örn. 0850 000 00 00]",
    kep: "[KEP ADRESİ]",
  },
} as const;

/**
 * Yasal alan henüz doldurulmadı mı? Placeholder değerler `[...]` ile başlar
 * (örn. "[ETBİS KAYIT NO]"). Gerçek değer girilene kadar ilgili rozet/satır
 * gizlenir — sahte/yanıltıcı yasal bilgi gösterilmez.
 */
export function isPlaceholder(value: string | null | undefined): boolean {
  if (!value) return true;
  const v = value.trim();
  return v === "" || v.startsWith("[");
}

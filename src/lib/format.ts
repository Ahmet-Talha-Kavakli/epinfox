// Client-safe biçimlendirme yardımcıları. store.ts (server-only) yerine buradan
// import edilir ki client component'ler server zincirini çekmesin.
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { intlLocale } from "@/lib/utils";

/**
 * ₺ TRY tutarı — para birimi HER ZAMAN TRY (marka para birimi), sadece sayı
 * biçimi (binlik/ondalık ayraç) locale'e göre değişir. locale opsiyonel,
 * default tr (geriye dönük uyumlu). Client-safe.
 */
export function formatTL(n: number, locale: Locale = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(n);
}

/** İndirim yüzdesi (varyant fiyatı vs compare_at). */
export function discountPct(price: number, compareAt?: number | null): number {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

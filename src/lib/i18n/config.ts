// Dil + para birimi tanımları (tek kaynak).

export const LOCALES = ["tr", "en", "de", "ar", "ru"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "tr";

export const LOCALE_META: Record<
  Locale,
  { label: string; flag: string; dir: "ltr" | "rtl"; defaultCurrency: CurrencyCode }
> = {
  tr: { label: "Türkçe", flag: "🇹🇷", dir: "ltr", defaultCurrency: "TRY" },
  en: { label: "English", flag: "🇬🇧", dir: "ltr", defaultCurrency: "USD" },
  de: { label: "Deutsch", flag: "🇩🇪", dir: "ltr", defaultCurrency: "EUR" },
  ar: { label: "العربية", flag: "🇸🇦", dir: "rtl", defaultCurrency: "SAR" },
  ru: { label: "Русский", flag: "🇷🇺", dir: "ltr", defaultCurrency: "RUB" },
};

export const CURRENCIES = ["TRY", "USD", "EUR", "SAR", "RUB"] as const;
export type CurrencyCode = (typeof CURRENCIES)[number];

// Fiyatlar DB'de TRY tabanlı. Yaklaşık sabit kurlar (demo). Prod'da canlı kur API'si.
export const CURRENCY_META: Record<
  CurrencyCode,
  { symbol: string; locale: string; perTRY: number }
> = {
  TRY: { symbol: "₺", locale: "tr-TR", perTRY: 1 },
  USD: { symbol: "$", locale: "en-US", perTRY: 0.026 },
  EUR: { symbol: "€", locale: "de-DE", perTRY: 0.024 },
  SAR: { symbol: "﷼", locale: "ar-SA", perTRY: 0.098 },
  RUB: { symbol: "₽", locale: "ru-RU", perTRY: 2.45 },
};

/** TRY tabanlı kur haritası (1 TRY = X currency). rates.ts canlı verir. */
export type RatesMap = Record<CurrencyCode, number>;

/**
 * TRY tutarını hedef para birimine çevir. `rates` verilirse canlı kur,
 * verilmezse config'teki sabit perTRY (fallback) kullanılır.
 */
export function convertFromTRY(
  amountTRY: number,
  to: CurrencyCode,
  rates?: RatesMap,
): number {
  const factor = rates?.[to] ?? CURRENCY_META[to].perTRY;
  return amountTRY * factor;
}

export function formatMoney(
  amountTRY: number,
  currency: CurrencyCode,
  rates?: RatesMap,
): string {
  const meta = CURRENCY_META[currency];
  const value = convertFromTRY(amountTRY, currency, rates);
  try {
    return new Intl.NumberFormat(meta.locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${meta.symbol}${value.toFixed(2)}`;
  }
}

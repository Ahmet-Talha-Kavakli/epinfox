import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";

/** locale'e göre srv.rt.* anahtarını çözer (fallback: TR → anahtar). */
function rt(key: string, locale: Locale): string {
  return DICTIONARIES[locale][key] ?? DICTIONARIES[DEFAULT_LOCALE][key] ?? key;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Locale (tr/en/…) → BCP-47 Intl locale (tr-TR/en-US/…). Client-safe. */
const INTL_LOCALE: Record<Locale, string> = {
  tr: "tr-TR",
  en: "en-US",
  de: "de-DE",
  ar: "ar-SA",
  ru: "ru-RU",
};

/** App locale'i Intl locale'ine çevirir (bilinmeyen → DEFAULT). */
export function intlLocale(locale: Locale = DEFAULT_LOCALE): string {
  return INTL_LOCALE[locale] ?? INTL_LOCALE[DEFAULT_LOCALE];
}

export function formatDate(date: string | Date, locale: Locale = DEFAULT_LOCALE) {
  return new Date(date).toLocaleDateString(intlLocale(locale), {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatDateTime(
  date: string | Date,
  locale: Locale = DEFAULT_LOCALE,
) {
  return new Date(date).toLocaleString(intlLocale(locale), {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Locale-aware sayı biçimi (binlik ayraç). Client-safe. */
export function formatNumber(n: number, locale: Locale = DEFAULT_LOCALE): string {
  return n.toLocaleString(intlLocale(locale));
}

/**
 * Göreli zaman ("az önce", "3 gün önce"). Çağıran locale'i geçer:
 * client → useI18n().locale, server → getServerLocale().
 */
export function relativeTime(
  date: string | Date,
  locale: Locale = DEFAULT_LOCALE,
): string {
  const diff = Date.now() - new Date(date).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return rt("srv.rt.justNow", locale);
  const min = Math.floor(sec / 60);
  if (min < 60) return rt("srv.rt.minAgo", locale).replace("{n}", String(min));
  const hr = Math.floor(min / 60);
  if (hr < 24) return rt("srv.rt.hourAgo", locale).replace("{n}", String(hr));
  const day = Math.floor(hr / 24);
  if (day < 30) return rt("srv.rt.dayAgo", locale).replace("{n}", String(day));
  const mo = Math.floor(day / 30);
  if (mo < 12) return rt("srv.rt.monthAgo", locale).replace("{n}", String(mo));
  return rt("srv.rt.yearAgo", locale).replace("{n}", String(Math.floor(mo / 12)));
}

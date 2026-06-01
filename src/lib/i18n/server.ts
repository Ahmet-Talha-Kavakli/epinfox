import "server-only";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "./config";
import { DICTIONARIES } from "./dictionaries";

/** Sunucu tarafında aktif locale'i cookie'den okur (yoksa varsayılan). */
export async function getServerLocale(): Promise<Locale> {
  const store = await cookies();
  const c = store.get("locale")?.value;
  return (LOCALES as readonly string[]).includes(c ?? "")
    ? (c as Locale)
    : DEFAULT_LOCALE;
}

/**
 * Server component'lerde çeviri için. Aktif locale'in t() fonksiyonunu döner.
 * Eksik anahtar TR'ye, o da yoksa anahtarın kendisine düşer (client provider ile aynı).
 *
 *   const t = await getServerT();
 *   <h2>{t("home.popularGames")}</h2>
 */
export async function getServerT(): Promise<(key: string) => string> {
  const locale = await getServerLocale();
  return (key: string) =>
    DICTIONARIES[locale][key] ?? DICTIONARIES[DEFAULT_LOCALE][key] ?? key;
}

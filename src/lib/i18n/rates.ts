import "server-only";
import { CURRENCIES, CURRENCY_META, type RatesMap } from "./config";

/**
 * Canlı döviz kuru (TRY tabanlı). open.er-api.com anahtarsız, TRY base ve
 * SAR/RUB dahil tüm para birimlerimizi destekler. Next fetch cache'i ile
 * 6 saatte bir tazelenir; API erişilemezse config.ts'teki sabit perTRY fallback.
 *
 * Dönüş: her CurrencyCode için "1 TRY = X <currency>" çarpanı (perTRY ile aynı anlam).
 */
export type { RatesMap };

const SOURCE = "https://open.er-api.com/v6/latest/TRY";
const REVALIDATE_SECONDS = 6 * 60 * 60; // 6 saat

/** config.ts sabitlerinden fallback haritası. */
function fallbackRates(): RatesMap {
  const out = {} as RatesMap;
  for (const c of CURRENCIES) out[c] = CURRENCY_META[c].perTRY;
  return out;
}

export async function getLiveRates(): Promise<RatesMap> {
  try {
    const res = await fetch(SOURCE, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["fx-rates"] },
    });
    if (!res.ok) return fallbackRates();

    const json = (await res.json()) as {
      result?: string;
      rates?: Record<string, number>;
    };
    if (json.result !== "success" || !json.rates) return fallbackRates();

    const out = {} as RatesMap;
    for (const c of CURRENCIES) {
      const live = json.rates[c];
      // TRY her zaman 1; geçersiz/eksik kur gelirse o para birimi için fallback.
      out[c] =
        c === "TRY"
          ? 1
          : typeof live === "number" && live > 0
            ? live
            : CURRENCY_META[c].perTRY;
    }
    return out;
  } catch {
    return fallbackRates();
  }
}

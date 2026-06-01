// Provider kayıt defteri — supply_source → SupplyProvider eşlemesi.
// 'manual' burada YOKtur: manuel kaynak DB stoğundan (mevcut purchase RPC'leri)
// teslim eder, provider arayüzü kullanmaz. Registry yalnız API-tipi kaynakları
// (mock + ileride gerçek B2B) döndürür.

import type { SupplyProvider } from "@/lib/supply/types";
import { mockProvider } from "@/lib/supply/providers/mock";
import { seagmProvider } from "@/lib/supply/providers/seagm";
import { smmProvider } from "@/lib/supply/providers/smm";

const PROVIDERS: Record<string, SupplyProvider> = {
  mock: mockProvider,
  seagm: seagmProvider,
  smm: smmProvider,
  // ileride:
  // mtcgame: mtcgameProvider,
  // codeswholesale: codesWholesaleProvider,
};

/** supply_source 'manual' mı? (DB stoğundan teslim). */
export function isManualSource(source: string): boolean {
  return source === "manual";
}

/**
 * supply_source 'manual_pending' mi? (Manuel köprü):
 * order 'processing' açılır, bakiye düşer ama OTOMATİK teslim YAPILMAZ —
 * admin /admin/pending-deliveries'ten elle kod/not girip teslim eder.
 * Provider arayüzü kullanmaz.
 */
export function isManualPendingSource(source: string): boolean {
  return source === "manual_pending";
}

/** API-tipi kaynak için provider'ı döndürür; yoksa null. */
export function getProvider(source: string): SupplyProvider | null {
  return PROVIDERS[source] ?? null;
}

// Mock sağlayıcı — gerçek B2B API yokken test için. Sahte kod/topup üretir.
// Gerçek bir sağlayıcının davranışını taklit eder (referans no, gecikme yok —
// server action zaten async). İleride mtcgame.ts gibi gerçek adaptör eklenir.

import type { SupplyProvider, FulfillContext, FulfillResult } from "@/lib/supply/types";

function randomCode(label: string | null): string {
  const seg = () =>
    Math.random()
      .toString(36)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 4)
      .padEnd(4, "X");
  const prefix = (label ?? "MOCK").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4) || "MOCK";
  return `${prefix}-${seg()}-${seg()}-${seg()}`;
}

function ref(): string {
  return "MOCK-" + Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
}

export const mockProvider: SupplyProvider = {
  source: "mock",

  async fulfill(ctx: FulfillContext): Promise<FulfillResult> {
    const supplierRef = ref();

    // İsteğe bağlı hata simülasyonu (test): SUPPLY_MOCK_FAIL=1 ise her zaman başarısız.
    if (process.env.SUPPLY_MOCK_FAIL === "1") {
      return { ok: false, error: "Sağlayıcı geçici olarak yanıt vermedi.", supplierRef };
    }

    if (ctx.deliveryType === "topup") {
      // Direct top-up: kod yok, oyuncu hesabına yükleme yapılmış say.
      if (!ctx.playerId) {
        return { ok: false, error: "Oyuncu ID gerekli.", supplierRef };
      }
      return {
        ok: true,
        note: `${ctx.variantLabel ?? ctx.productName} oyuncu ${ctx.playerId} hesabına yüklendi.`,
        supplierRef,
      };
    }

    // code teslim: qty adet sahte kod üret.
    const codes = Array.from({ length: ctx.qty }, () => randomCode(ctx.variantLabel));
    return { ok: true, codes, supplierRef };
  },
};

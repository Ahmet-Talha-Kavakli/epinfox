"use server";

// Admin SMM yardımcı action'ları: panel servis kataloğunu çek, bakiye göster,
// bekleyen siparişleri elle senkronla. SMM ürün/varyantlarını paneldeki servise
// (supplier_service_id) eşlemek için kullanılır.

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { smmServices, smmBalance, type SmmService } from "@/lib/supply/providers/smm";
import { pollSmmOrders, type SmmSyncResult } from "@/lib/actions/smm-sync";

export type SmmCatalogResult =
  | { ok: true; services: SmmService[]; balance: string; currency: string }
  | { ok: false; error: string };

/** Panel servis kataloğu + bakiye (admin /admin/smm sayfası için). */
export async function getSmmCatalog(): Promise<SmmCatalogResult> {
  await requireAdmin();

  const svc = await smmServices();
  if (!svc.ok) return { ok: false, error: svc.error };

  // Bakiye opsiyonel — alınamazsa katalog yine gösterilir.
  const bal = await smmBalance();

  return {
    ok: true,
    services: svc.services,
    balance: bal.ok ? bal.balance : "—",
    currency: bal.ok ? bal.currency : "",
  };
}

export type SmmSyncActionResult =
  | { ok: true; result: SmmSyncResult }
  | { ok: false; error: string };

/** Bekleyen SMM siparişlerini elle senkronla (admin butonu). */
export async function syncSmmOrders(): Promise<SmmSyncActionResult> {
  await requireAdmin();
  try {
    const result = await pollSmmOrders();
    revalidatePath("/admin/smm");
    revalidatePath("/admin/orders");
    return { ok: true, result };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Bilinmeyen hata";
    return { ok: false, error: msg };
  }
}

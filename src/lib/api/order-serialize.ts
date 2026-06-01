import "server-only";
import type { createAdminClient } from "@/lib/supabase/server";

export type OrderRow = {
  id: string;
  product_name?: string | null;
  price?: number | string | null;
  status?: string | null;
  created_at?: string | null;
  reseller_ref?: string | null;
};

/** Bayi API sipariş çıktısı (tutarlı public şekil). code yalnız mevcutsa eklenir. */
export function serializeOrder(o: OrderRow, code: string | null) {
  return {
    id: o.id,
    product_name: o.product_name ?? null,
    price: o.price != null ? Number(o.price) : null,
    status: o.status ?? null,
    reseller_ref: o.reseller_ref ?? null,
    created_at: o.created_at ?? null,
    ...(code != null ? { code } : {}),
  };
}

/** Siparişe bağlı kodu çöz (sahibi doğrulanarak; reveal_order_code RPC). */
export async function fetchOrderCode(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  userId: string,
  orderId: string,
): Promise<string | null> {
  const { data, error } = await supabase.rpc("reveal_order_code", {
    p_user_id: userId,
    p_order_id: orderId,
    p_enc_key: process.env.CODE_ENCRYPTION_KEY!,
  });
  if (error) return null;
  return (data as string | null) ?? null;
}

"use server";

import { z } from "zod";
import { requireMember } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/server";
import { getServerT } from "@/lib/i18n/server";
import { getContentLocale, localizeOrderItems } from "@/lib/content-i18n";
import type { Order } from "@/lib/supabase/types";

/** Sipariş + ilgili ürünün görseli/slug'ı (kart için snapshot'a join). */
export interface OrderWithProduct extends Order {
  product_image: string | null;
  product_slug: string | null;
}

/**
 * Kullanıcının sipariş geçmişi. Ürün görseli/slug'ı tek sorguda join'lenir;
 * ürün sonradan silinse bile order snapshot alanları (product_name, price)
 * kalıcı olduğundan satır yine de gösterilir.
 */
export async function getMyOrders(
  userId: string,
  limit = 100,
): Promise<OrderWithProduct[]> {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select("*, products(image_path, slug)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  type Row = Order & {
    products: { image_path: string | null; slug: string } | null;
  };
  const orders = ((data as Row[]) ?? []).map(({ products, ...order }) => ({
    ...order,
    product_image: products?.image_path ?? null,
    product_slug: products?.slug ?? null,
  }));

  // Ürün+varyant adlarını alıcının diline çevir (TR snapshot fallback).
  const locale = await getContentLocale();
  return localizeOrderItems(orders, locale);
}

const revealSchema = z.object({ orderId: z.string().uuid() });

export type RevealResult =
  | { ok: true; code: string }
  | { ok: false; error: string };

/**
 * Kullanıcı kendi siparişinin kodunu görüntüler. RPC içinde user_id eşleşmesi
 * zorunlu — başkasının kodu çekilemez. Decrypt yalnız bu çağrıda yapılır.
 */
export async function revealOrderCode(
  input: z.infer<typeof revealSchema>,
): Promise<RevealResult> {
  const t = await getServerT();
  const parsed = revealSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: t("srv.or.err.invalidRequest") };

  const current = await requireMember();
  const supabase = await createAdminClient();

  const { data, error } = await supabase.rpc("reveal_order_code", {
    p_user_id: current.user.id,
    p_order_id: parsed.data.orderId,
    p_enc_key: process.env.CODE_ENCRYPTION_KEY!,
  });

  if (error || typeof data !== "string") {
    console.error("reveal_order_code error:", error?.message);
    return { ok: false, error: t("srv.or.err.codeNotShown") };
  }

  return { ok: true, code: data };
}

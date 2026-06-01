"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireMember } from "@/lib/auth/require-admin";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getServerT } from "@/lib/i18n/server";
import { createAdminClient } from "@/lib/supabase/server";

export type PromoResult =
  | { ok: true; type: string; amount: number; message: string; newBalance: number | null }
  | { ok: false; error: string };

// Zod mesajları sentinel anahtar tutar; fonksiyon içinde getServerT ile çevrilir.
const codeSchema = z.string().trim().min(3, "srv.pm.codeMin").max(40);

/**
 * Kullanıcı promo kodunu kullanır (redeem). Atomik promo_redeem RPC'si:
 * - bonus_balance → cüzdana anında bonus yükler
 * - percent / free_shipping → kullanıcıya kupon tanımlar (checkout'ta uygulanır)
 * Her kullanıcı bir kodu yalnızca 1 kez kullanabilir.
 */
export async function applyPromoCode(rawCode: string): Promise<PromoResult> {
  const t = await getServerT();
  const parsed = codeSchema.safeParse(rawCode);
  if (!parsed.success) {
    const key = parsed.error.issues[0]?.message;
    return { ok: false, error: key ? t(key) : t("srv.pm.invalid") };
  }

  const current = await requireMember();
  const supabase = await createAdminClient();

  const { data, error } = await supabase.rpc("promo_redeem", {
    p_user_id: current.user.id,
    p_code: parsed.data,
  });

  if (error) {
    console.error("promo_redeem error:", error.message);
    return { ok: false, error: t("srv.pm.failed") };
  }

  const res = data as {
    ok: boolean;
    message?: string;
    type?: string;
    amount?: number;
    new_balance?: number | null;
  };

  if (!res?.ok) {
    // res.message DB/RPC kaynaklı (TR-side) — varsa olduğu gibi kullan; yoksa çeviri fallback.
    return { ok: false, error: res?.message ?? t("srv.pm.invalid") };
  }

  // Bonus bakiye yüklendiyse ilgili sayfaları tazele
  revalidatePath("/wallet");
  revalidatePath("/account");

  return {
    ok: true,
    type: res.type ?? "",
    amount: res.amount ?? 0,
    message: res.message ?? t("srv.pm.applied"),
    newBalance: res.new_balance ?? null,
  };
}

export type FeaturedPromo = {
  code: string;
  type: "bonus_balance" | "percent" | "free_shipping";
  value: number;
  description: string | null;
} | null;

/**
 * Rastgele popup için öne çıkarılacak aktif bir promo kodu döndürür.
 * - Giriş yapan kullanıcı daha önce kullandıysa o kodu hariç tutar.
 * - Süresi/limiti dolmuş kodlar elenir. En yenisi seçilir.
 */
export async function getFeaturedPromo(): Promise<FeaturedPromo> {
  const supabase = await createAdminClient();
  const nowIso = new Date().toISOString();

  const { data: codes } = await supabase
    .from("promo_codes")
    .select("id, code, type, value, description, max_uses, used_count, expires_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(20);

  if (!codes?.length) return null;

  // Süre/limit filtresi
  let candidates = codes.filter((c) => {
    if (c.expires_at && c.expires_at < nowIso) return false;
    if (c.max_uses != null && (c.used_count ?? 0) >= c.max_uses) return false;
    return true;
  });
  if (!candidates.length) return null;

  // Giriş yapan kullanıcının kullandıklarını ele
  const current = await getCurrentUser();
  if (current) {
    const { data: used } = await supabase
      .from("promo_redemptions")
      .select("promo_id")
      .eq("user_id", current.user.id);
    const usedIds = new Set((used ?? []).map((r) => r.promo_id));
    candidates = candidates.filter((c) => !usedIds.has(c.id));
    if (!candidates.length) return null;
  }

  const pick = candidates[0];
  return {
    code: pick.code,
    type: pick.type,
    value: Number(pick.value),
    description: pick.description,
  };
}

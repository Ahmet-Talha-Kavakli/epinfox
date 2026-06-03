// Merkezi rate-limit yardımcısı (Supabase RPC: check_rate_limit).
// Vercel serverless'ta in-memory sayaç güvenilmez olduğundan limit DB'de tutulur.
//
// Kullanım (server action içinde):
//   const ok = await checkRateLimit(`support:create:${userId}`, 5, 60);
//   if (!ok) return { ok: false, error: "Çok sık denediniz, biraz bekleyin." };

import { createAdminClient } from "@/lib/supabase/server";

/**
 * @param key     Eyleme + özneye özgü anahtar (örn. "promo:redeem:<userId>").
 * @param limit   Pencere başına izin verilen maksimum istek.
 * @param windowSec  Pencere uzunluğu (saniye).
 * @returns true = izinli, false = limit aşıldı. Hata olursa güvenli tarafta
 *          true döner (rate-limit altyapısı asıl akışı KIRMASIN).
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSec: number,
): Promise<boolean> {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase.rpc("check_rate_limit", {
      p_key: key,
      p_limit: limit,
      p_window: windowSec,
    });
    if (error) {
      console.error("checkRateLimit RPC error:", error.message);
      return true; // fail-open: altyapı hatası kullanıcıyı kilitlemesin
    }
    return data === true;
  } catch (err) {
    console.error("checkRateLimit exception:", err);
    return true;
  }
}

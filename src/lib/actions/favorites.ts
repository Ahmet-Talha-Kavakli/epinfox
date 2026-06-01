"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current-user";
import { requireMember } from "@/lib/auth/require-admin";
import { getServerT } from "@/lib/i18n/server";
import { createAdminClient } from "@/lib/supabase/server";

export type ToggleFavoriteResult =
  | { ok: true; favorited: boolean }
  | { ok: false; error: string };

/**
 * Bir ürünü favorilere ekler/çıkarır (toggle).
 * Giriş gerektirir (requireMember → giriş yoksa /sign-in'e yönlendirir).
 * Dönüş: işlem sonrası ürün favori mi (favorited).
 */
export async function toggleFavorite(
  productId: string,
): Promise<ToggleFavoriteResult> {
  const t = await getServerT();
  const current = await requireMember();
  const supabase = await createAdminClient();

  try {
    // Zaten favori mi?
    const { data: existing } = await supabase
      .from("product_favorites")
      .select("id")
      .eq("user_id", current.user.id)
      .eq("product_id", productId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("product_favorites")
        .delete()
        .eq("id", (existing as { id: string }).id);
      if (error) return { ok: false, error: t("srv.fv.removeFailed") };
      revalidatePath("/store");
      revalidatePath("/account/favorites");
      return { ok: true, favorited: false };
    }

    const { error } = await supabase.from("product_favorites").insert({
      user_id: current.user.id,
      product_id: productId,
    });
    // Unique violation = paralel istek araya girmiş; yine de favori sayılır.
    if (error && error.code !== "23505") {
      return { ok: false, error: t("srv.fv.addFailed") };
    }
    revalidatePath("/store");
    revalidatePath("/account/favorites");
    return { ok: true, favorited: true };
  } catch (err) {
    console.error("toggleFavorite exception:", err);
    return { ok: false, error: t("srv.fv.genericError") };
  }
}

/**
 * Oturum açmış kullanıcının favori product_id'lerini Set olarak döner.
 * Giriş yoksa boş Set döner (liste render'ı için güvenli).
 */
export async function getMyFavoriteIds(): Promise<Set<string>> {
  const current = await getCurrentUser();
  if (!current) return new Set();

  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("product_favorites")
    .select("product_id")
    .eq("user_id", current.user.id);

  return new Set(
    ((data as { product_id: string }[]) ?? []).map((r) => r.product_id),
  );
}

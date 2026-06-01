"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireMember } from "@/lib/auth/require-admin";
import { getServerT } from "@/lib/i18n/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { Review, ReviewWithAuthor } from "@/lib/supabase/types";

export interface ReviewSummary {
  count: number;
  average: number; // 0 ise yorum yok
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

/** Ürünün yorum listesi + özet (ortalama, dağılım). */
export async function getProductReviews(productId: string): Promise<{
  reviews: ReviewWithAuthor[];
  summary: ReviewSummary;
}> {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("reviews")
    .select(
      "*, author:profiles!reviews_user_id_fkey(nickname, avatar_path)",
    )
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  const reviews = (data as ReviewWithAuthor[]) ?? [];
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<
    1 | 2 | 3 | 4 | 5,
    number
  >;
  let total = 0;
  for (const r of reviews) {
    distribution[r.rating as 1 | 2 | 3 | 4 | 5] += 1;
    total += r.rating;
  }
  const count = reviews.length;
  return {
    reviews,
    summary: {
      count,
      average: count ? Math.round((total / count) * 10) / 10 : 0,
      distribution,
    },
  };
}

/**
 * Kullanıcının bu ürün için yorum yapıp yapamayacağı + mevcut yorumu.
 * - canReview: ürünü satın almış mı (completed order)
 * - mine: zaten yorum yaptıysa kendi yorumu (düzenleme için)
 */
export async function getMyReviewState(productId: string): Promise<{
  canReview: boolean;
  mine: Review | null;
}> {
  const current = await requireMember().catch(() => null);
  if (!current) return { canReview: false, mine: null };

  const supabase = await createAdminClient();
  const [{ count }, { data: mine }] = await Promise.all([
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("user_id", current.user.id)
      .eq("product_id", productId)
      .eq("status", "completed"),
    supabase
      .from("reviews")
      .select("*")
      .eq("user_id", current.user.id)
      .eq("product_id", productId)
      .maybeSingle(),
  ]);

  return {
    canReview: (count ?? 0) > 0,
    mine: (mine as Review) ?? null,
  };
}

const upsertSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  body: z.string().trim().max(1000).optional(),
});

export type ReviewResult = { ok: true } | { ok: false; error: string };

/** Yorum ekle/güncelle. Satın alma zorunlu; ürün başına tek yorum (upsert). */
export async function submitReview(
  input: z.infer<typeof upsertSchema>,
): Promise<ReviewResult> {
  const t = await getServerT();
  const parsed = upsertSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: t("srv.rv.invalid") };

  const current = await requireMember();
  const supabase = await createAdminClient();

  // Satın alma doğrulaması
  const { count } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("user_id", current.user.id)
    .eq("product_id", parsed.data.productId)
    .eq("status", "completed");
  if (!count || count === 0) {
    return { ok: false, error: t("srv.rv.mustPurchase") };
  }

  const { error } = await supabase.from("reviews").upsert(
    {
      product_id: parsed.data.productId,
      user_id: current.user.id,
      rating: parsed.data.rating,
      body: parsed.data.body?.trim() || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "product_id,user_id" },
  );

  if (error) {
    console.error("submitReview error:", error.message);
    return { ok: false, error: t("srv.rv.saveFailed") };
  }

  // Ürün slug'ını çekip o sayfayı yenile
  const { data: product } = await supabase
    .from("products")
    .select("slug")
    .eq("id", parsed.data.productId)
    .maybeSingle();
  if (product?.slug) revalidatePath(`/product/${product.slug}`);
  return { ok: true };
}

/** Kendi yorumunu sil. */
export async function deleteReview(productId: string): Promise<ReviewResult> {
  const t = await getServerT();
  const current = await requireMember();
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("product_id", productId)
    .eq("user_id", current.user.id);
  if (error) return { ok: false, error: t("srv.rv.deleteFailed") };

  const { data: product } = await supabase
    .from("products")
    .select("slug")
    .eq("id", productId)
    .maybeSingle();
  if (product?.slug) revalidatePath(`/product/${product.slug}`);
  return { ok: true };
}

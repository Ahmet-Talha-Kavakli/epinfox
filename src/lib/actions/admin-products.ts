"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/server";
import { notifyFavoriteChange } from "@/lib/favorites-notify";
import type { Category, Product } from "@/lib/supabase/types";

const TONES = ["brand", "accent", "success", "danger", "warning", "info", "neutral"] as const;

const productSchema = z.object({
  id: z.string().uuid().optional(),
  category_id: z.coerce.number().int().positive(),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Slug yalnız küçük harf, rakam ve tire içerebilir."),
  name: z.string().min(2).max(120),
  description: z.string().max(500).optional().nullable(),
  price: z.coerce.number().positive().max(1_000_000),
  tone: z.enum(TONES),
  is_active: z.coerce.boolean().optional(),
  position: z.coerce.number().int().optional(),
  delivery_type: z.enum(["code", "topup", "service"]).optional(),
  supply_source: z.string().max(40).optional(),
  // Ürüne özel içerik (form'dan ham metin gelir, aşağıda parse edilir):
  how_to: z.string().max(4000).optional().nullable(),       // her satır = bir adım
  requirements: z.string().max(2000).optional().nullable(),
  faq: z.string().max(8000).optional().nullable(),           // her satır "soru | cevap"
});

/** Çok satırlı metni temizlenmiş satır dizisine çevir (boşları at). */
function linesToArray(raw: string | null | undefined): string[] | null {
  if (!raw) return null;
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.length ? lines : null;
}

/** "soru | cevap" satırlarını SSS dizisine çevir (| yoksa satır atlanır). */
function linesToFaq(raw: string | null | undefined): { q: string; a: string }[] | null {
  if (!raw) return null;
  const items = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const i = l.indexOf("|");
      if (i === -1) return null;
      const q = l.slice(0, i).trim();
      const a = l.slice(i + 1).trim();
      return q && a ? { q, a } : null;
    })
    .filter((x): x is { q: string; a: string } => x !== null);
  return items.length ? items : null;
}

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string };

export async function getAdminCategories(): Promise<Category[]> {
  await requireAdmin();
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("position", { ascending: true });
  return (data as Category[]) ?? [];
}

export async function getAdminProducts(): Promise<Product[]> {
  await requireAdmin();
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Product[]) ?? [];
}

export async function saveProduct(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  }
  const supabase = await createAdminClient();
  const { id, how_to, requirements, faq, ...fields } = parsed.data;

  const row = {
    ...fields,
    description: fields.description || null,
    is_active: fields.is_active ?? true,
    position: fields.position ?? 100,
    delivery_type: fields.delivery_type ?? "code",
    supply_source: fields.supply_source ?? "manual",
    how_to: linesToArray(how_to),
    requirements: requirements?.trim() || null,
    faq: linesToFaq(faq),
  };

  if (id) {
    // Güncelleme ÖNCESİ mevcut fiyat + aktiflik durumunu oku (favori bildirimi için).
    const { data: before } = await supabase
      .from("products")
      .select("price, is_active, name, slug")
      .eq("id", id)
      .maybeSingle();
    const prev = before as
      | { price: number; is_active: boolean; name: string; slug: string }
      | null;

    const { error } = await supabase.from("products").update(row).eq("id", id);
    if (error) return mapError(error.message);

    // Fiyat değiştiyse veya ürün tekrar aktifleştiyse favorileyenlere bildir.
    if (prev) {
      const priceChanged = Number(prev.price) !== Number(row.price);
      const backInStock = prev.is_active === false && row.is_active === true;
      if (priceChanged) {
        await notifyFavoriteChange(supabase, {
          productId: id,
          productName: row.name,
          productSlug: row.slug,
          price: { old: Number(prev.price), next: Number(row.price) },
        });
      } else if (backInStock) {
        await notifyFavoriteChange(supabase, {
          productId: id,
          productName: row.name,
          productSlug: row.slug,
          backInStock: true,
        });
      }
    }
  } else {
    const { error } = await supabase.from("products").insert(row);
    if (error) return mapError(error.message);
  }

  revalidatePath("/admin/products");
  revalidatePath("/store");
  revalidatePath("/");
  if (fields.slug) revalidatePath(`/product/${fields.slug}`);
  return { ok: true };
}

export async function toggleProductActive(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createAdminClient();

  // Önceki durum + ürün adı/slug (tekrar stokta bildirimi için).
  const { data: before } = await supabase
    .from("products")
    .select("is_active, name, slug")
    .eq("id", id)
    .maybeSingle();
  const prev = before as
    | { is_active: boolean; name: string; slug: string }
    | null;

  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  // false → true geçişinde favorileyenlere "tekrar stokta" bildir.
  if (prev && prev.is_active === false && isActive === true) {
    await notifyFavoriteChange(supabase, {
      productId: id,
      productName: prev.name,
      productSlug: prev.slug,
      backInStock: true,
    });
  }

  revalidatePath("/admin/products");
  revalidatePath("/store");
  return { ok: true };
}

function mapError(msg: string): ActionResult {
  if (msg.includes("duplicate") || msg.includes("23505")) {
    return { ok: false, error: "Bu slug zaten kullanılıyor." };
  }
  return { ok: false, error: "Kaydedilemedi: " + msg };
}

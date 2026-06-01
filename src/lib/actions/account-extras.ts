"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireMember } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/server";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

/* ───────────────────────── Sosyal bağlantılar ──────────────────────────── */

// Kullanıcı adı: @ olmadan, harf/rakam/nokta/alt çizgi/tire; boş = bağlantı yok.
const handle = z
  .string()
  .trim()
  .max(64)
  .regex(/^[a-zA-Z0-9._-]*$/, "Sadece harf, rakam, nokta, tire ve alt çizgi.")
  .transform((v) => v.replace(/^@/, "").trim());

const socialSchema = z.object({
  instagram: handle,
  tiktok: handle,
  steam: handle,
  discord: z.string().trim().max(64),
  x: handle,
});

export async function updateSocialLinks(
  input: z.infer<typeof socialSchema>,
): Promise<ActionResult> {
  const parsed = socialSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz." };
  }
  const current = await requireMember();
  const supabase = await createAdminClient();
  const d = parsed.data;

  const { error } = await supabase
    .from("profiles")
    .update({
      social_instagram: d.instagram || null,
      social_tiktok: d.tiktok || null,
      social_steam: d.steam || null,
      social_discord: d.discord.trim() || null,
      social_x: d.x || null,
    })
    .eq("id", current.user.id);

  if (error) return { ok: false, error: "Kaydedilemedi." };
  revalidatePath("/account/social");
  return { ok: true };
}

/* ───────────────────────── Fatura adresleri ────────────────────────────── */

const addressSchema = z.object({
  id: z.string().uuid().optional(),
  kind: z.enum(["individual", "corporate"]),
  title: z.string().trim().min(1, "Adres başlığı gerekli.").max(60),
  fullName: z.string().trim().min(1, "Ad soyad gerekli.").max(80),
  phone: z.string().trim().max(20).optional().nullable(),
  companyName: z.string().trim().max(120).optional().nullable(),
  taxOffice: z.string().trim().max(80).optional().nullable(),
  taxNumber: z.string().trim().max(20).optional().nullable(),
  country: z.string().trim().max(60).default("Türkiye"),
  city: z.string().trim().min(1, "Şehir gerekli.").max(60),
  district: z.string().trim().max(60).optional().nullable(),
  zipCode: z.string().trim().max(12).optional().nullable(),
  addressLine: z.string().trim().min(5, "Adres en az 5 karakter.").max(400),
  isDefault: z.boolean().default(false),
});

export async function saveBillingAddress(
  input: z.infer<typeof addressSchema>,
): Promise<ActionResult> {
  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz." };
  }
  const d = parsed.data;
  // Kurumsal ise şirket + vergi alanları zorunlu.
  if (d.kind === "corporate" && (!d.companyName || !d.taxNumber)) {
    return {
      ok: false,
      error: "Kurumsal fatura için ünvan ve vergi/TC numarası gerekli.",
    };
  }

  const current = await requireMember();
  const supabase = await createAdminClient();

  // Varsayılan seçildiyse önce diğerlerinin varsayılanını kaldır (tek default kuralı).
  if (d.isDefault) {
    await supabase
      .from("billing_addresses")
      .update({ is_default: false })
      .eq("user_id", current.user.id);
  }

  const row = {
    user_id: current.user.id,
    kind: d.kind,
    title: d.title,
    full_name: d.fullName,
    phone: d.phone || null,
    company_name: d.kind === "corporate" ? d.companyName || null : null,
    tax_office: d.kind === "corporate" ? d.taxOffice || null : null,
    tax_number: d.kind === "corporate" ? d.taxNumber || null : null,
    country: d.country || "Türkiye",
    city: d.city,
    district: d.district || null,
    zip_code: d.zipCode || null,
    address_line: d.addressLine,
    is_default: d.isDefault,
    updated_at: new Date().toISOString(),
  };

  if (d.id) {
    const { error } = await supabase
      .from("billing_addresses")
      .update(row)
      .eq("id", d.id)
      .eq("user_id", current.user.id);
    if (error) return { ok: false, error: "Güncellenemedi." };
  } else {
    const { error } = await supabase.from("billing_addresses").insert(row);
    if (error) return { ok: false, error: "Eklenemedi." };
  }

  revalidatePath("/account/billing");
  return { ok: true };
}

export async function deleteBillingAddress(input: {
  id: string;
}): Promise<ActionResult> {
  const id = z.string().uuid().safeParse(input.id);
  if (!id.success) return { ok: false, error: "Geçersiz adres." };

  const current = await requireMember();
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("billing_addresses")
    .delete()
    .eq("id", id.data)
    .eq("user_id", current.user.id);

  if (error) return { ok: false, error: "Silinemedi." };
  revalidatePath("/account/billing");
  return { ok: true };
}

/* ─────────────────────────────── Bağış ─────────────────────────────────── */

const donateSchema = z.object({
  publisherSlug: z.string().trim().min(1, "Yayıncı gerekli.").max(120),
  publisherName: z.string().trim().min(1).max(120),
  amount: z.number().positive("Tutar 0'dan büyük olmalı.").max(100000),
  displayName: z.string().trim().max(30).optional().nullable(),
  message: z.string().trim().max(280).optional().nullable(),
  anonymous: z.boolean().default(false),
});

export type DonateResult =
  | { ok: true; newBalance: number }
  | { ok: false; error: string };

/** Yayıncıya cüzdandan bağış. /publisher/[slug] formundan çağrılır. */
export async function makeDonation(
  input: z.infer<typeof donateSchema>,
): Promise<DonateResult> {
  const parsed = donateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz." };
  }
  const d = parsed.data;
  const current = await requireMember();
  const supabase = await createAdminClient();

  const { data, error } = await supabase.rpc("wallet_donate", {
    p_user_id: current.user.id,
    p_publisher_slug: d.publisherSlug,
    p_publisher_name: d.publisherName,
    p_amount: d.amount,
    p_display_name: d.anonymous ? "Anonim" : d.displayName ?? null,
    p_message: d.message ?? null,
    p_anonymous: d.anonymous,
  });

  if (error) {
    const msg = error.message || "";
    if (msg.includes("INSUFFICIENT_BALANCE"))
      return { ok: false, error: "Cüzdan bakiyen yetersiz." };
    if (msg.includes("INVALID_AMOUNT"))
      return { ok: false, error: "Geçersiz tutar." };
    return { ok: false, error: "Bağış tamamlanamadı." };
  }

  revalidatePath("/account/donations");
  revalidatePath("/wallet");
  return { ok: true, newBalance: Number(data) };
}

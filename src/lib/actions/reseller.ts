"use server";

import { revalidatePath } from "next/cache";
import { randomBytes, createHash } from "node:crypto";
import { z } from "zod";
import { requireMember, requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/server";
import { notify } from "@/lib/notifications";
import { TIER_DISCOUNT, TIER_LABEL } from "@/lib/reseller-meta";
import type { ResellerTier } from "@/lib/supabase/types";

export type Result = { ok: true } | { ok: false; error: string };

/* ───────────────────────── Bayilik başvurusu ───────────────────────────── */

const applySchema = z.object({
  companyType: z.enum(["individual", "company"]),
  companyName: z.string().trim().min(2, "Firma/şahıs adı gerekli.").max(120),
  contactName: z.string().trim().min(2, "Yetkili adı gerekli.").max(80),
  phone: z
    .string()
    .trim()
    .min(7, "Telefon gerekli.")
    .max(20)
    .regex(/^[0-9+()\s-]+$/, "Geçersiz telefon."),
  taxNumber: z.string().trim().max(20).optional().nullable(),
  channel: z.enum(["web", "social", "physical", "other"]),
  monthlyVolume: z.string().trim().max(60).optional().nullable(),
  message: z.string().trim().max(500).optional().nullable(),
});

export async function applyForReseller(
  input: z.infer<typeof applySchema>,
): Promise<Result> {
  const parsed = applySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz." };
  }
  const current = await requireMember();
  const supabase = await createAdminClient();
  const d = parsed.data;

  // Zaten aktif/bekleyen başvuru var mı?
  if (current.profile.reseller_status === "approved") {
    return { ok: false, error: "Zaten aktif bayisin." };
  }
  if (current.profile.reseller_status === "pending") {
    return { ok: false, error: "Bekleyen bir başvurun zaten var." };
  }

  const { error } = await supabase.from("reseller_applications").insert({
    user_id: current.user.id,
    company_type: d.companyType,
    company_name: d.companyName,
    contact_name: d.contactName,
    phone: d.phone,
    tax_number: d.taxNumber || null,
    channel: d.channel,
    monthly_volume: d.monthlyVolume || null,
    message: d.message || null,
    status: "pending",
  });
  if (error) return { ok: false, error: "Başvuru kaydedilemedi." };

  // Profili pending'e çek.
  await supabase
    .from("profiles")
    .update({ reseller_status: "pending" })
    .eq("id", current.user.id);

  revalidatePath("/account/reseller");
  return { ok: true };
}

/* ──────────────────── Admin: onay / red ─────────────────────────────────── */

const decideSchema = z.object({
  applicationId: z.string().uuid(),
  approve: z.boolean(),
  tier: z.enum(["bronze", "silver", "gold", "platinum"]).optional(),
  rejectReason: z.string().trim().max(300).optional(),
});

export async function decideResellerApplication(
  input: z.infer<typeof decideSchema>,
): Promise<Result> {
  const parsed = decideSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Geçersiz istek." };
  await requireAdmin();
  const supabase = await createAdminClient();
  const { applicationId, approve, tier, rejectReason } = parsed.data;

  const { data: app } = await supabase
    .from("reseller_applications")
    .select("user_id, company_name")
    .eq("id", applicationId)
    .maybeSingle();
  if (!app) return { ok: false, error: "Başvuru bulunamadı." };

  const now = new Date().toISOString();

  if (approve) {
    const t: ResellerTier = tier ?? "bronze";
    await supabase
      .from("reseller_applications")
      .update({ status: "approved", reviewed_at: now, reject_reason: null })
      .eq("id", applicationId);
    await supabase
      .from("profiles")
      .update({
        reseller_status: "approved",
        reseller_tier: t,
        reseller_discount: TIER_DISCOUNT[t],
        reseller_store: app.company_name,
        reseller_since: now,
      })
      .eq("id", app.user_id);
    await notify(supabase, {
      userId: app.user_id,
      type: "system",
      title: "Bayilik başvurun onaylandı! 🎉",
      body: `${TIER_LABEL[t]} kademesinde bayi oldun. Toptan fiyatlar ve API erişimi hesabında aktif.`,
      link: "/account/reseller",
    });
  } else {
    await supabase
      .from("reseller_applications")
      .update({
        status: "rejected",
        reviewed_at: now,
        reject_reason: rejectReason || null,
      })
      .eq("id", applicationId);
    await supabase
      .from("profiles")
      .update({ reseller_status: "rejected" })
      .eq("id", app.user_id);
    await notify(supabase, {
      userId: app.user_id,
      type: "system",
      title: "Bayilik başvurun sonuçlandı",
      body: rejectReason
        ? `Başvurun onaylanmadı: ${rejectReason}`
        : "Başvurun bu sefer onaylanmadı. Tekrar başvurabilirsin.",
      link: "/account/reseller",
    });
  }

  revalidatePath("/admin/resellers");
  revalidatePath("/account/reseller");
  return { ok: true };
}

/* ─────────────────────── API anahtarı + webhook ────────────────────────── */

async function requireApprovedReseller() {
  const current = await requireMember();
  if (current.profile.reseller_status !== "approved") {
    return { current: null, error: "Bu işlem yalnızca aktif bayiler içindir." };
  }
  return { current, error: null };
}

export type KeyResult =
  | { ok: true; apiKey: string }
  | { ok: false; error: string };

/**
 * Yeni API anahtarı üretir (varsa değiştirir). GÜVENLİK: düz metin asla
 * saklanmaz — DB'ye SHA-256 hash + gösterim maskesi yazılır. Tam anahtar
 * yalnızca bu dönüşte görünür; bir daha asla gösterilemez.
 */
export async function regenerateApiKey(): Promise<KeyResult> {
  const { current, error } = await requireApprovedReseller();
  if (!current) return { ok: false, error: error! };
  const supabase = await createAdminClient();

  const key = "epf_live_" + randomBytes(24).toString("hex");
  const hash = createHash("sha256").update(key).digest("hex");
  const hint = `epf_live_…${key.slice(-4)}`;

  const { error: dbErr } = await supabase
    .from("profiles")
    .update({ reseller_api_key: hash, reseller_api_key_hint: hint })
    .eq("id", current.user.id);
  if (dbErr) return { ok: false, error: "Anahtar üretilemedi." };

  revalidatePath("/account/api");
  return { ok: true, apiKey: key };
}

export async function revokeApiKey(): Promise<Result> {
  const { current, error } = await requireApprovedReseller();
  if (!current) return { ok: false, error: error! };
  const supabase = await createAdminClient();
  const { error: dbErr } = await supabase
    .from("profiles")
    .update({ reseller_api_key: null, reseller_api_key_hint: null })
    .eq("id", current.user.id);
  if (dbErr) return { ok: false, error: "İptal edilemedi." };
  revalidatePath("/account/api");
  return { ok: true };
}

const webhookSchema = z.object({
  url: z
    .string()
    .trim()
    .max(300)
    .refine((v) => v === "" || /^https:\/\/.+/.test(v), "https:// ile başlamalı.")
    .nullable(),
});

export async function updateWebhook(
  input: z.infer<typeof webhookSchema>,
): Promise<Result> {
  const parsed = webhookSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz." };
  }
  const { current, error } = await requireApprovedReseller();
  if (!current) return { ok: false, error: error! };
  const supabase = await createAdminClient();
  const { error: dbErr } = await supabase
    .from("profiles")
    .update({ reseller_webhook: parsed.data.url || null })
    .eq("id", current.user.id);
  if (dbErr) return { ok: false, error: "Kaydedilemedi." };
  revalidatePath("/account/api");
  return { ok: true };
}

/* ─────────────────────── İzinli webhook IP'leri ────────────────────────── */

// Basit IPv4 / IPv6 / CIDR doğrulaması.
const IP_RE =
  /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(\/\d{1,2})?|[0-9a-fA-F:]+(\/\d{1,3})?)$/;

const ipsSchema = z.object({
  ips: z
    .array(z.string().trim())
    .max(20, "En fazla 20 IP ekleyebilirsin.")
    .transform((arr) => arr.map((s) => s.trim()).filter(Boolean)),
});

export async function updateWebhookIps(
  input: z.infer<typeof ipsSchema>,
): Promise<Result> {
  const parsed = ipsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz." };
  }
  const bad = parsed.data.ips.find((ip) => !IP_RE.test(ip));
  if (bad) return { ok: false, error: `Geçersiz IP: ${bad}` };

  const { current, error } = await requireApprovedReseller();
  if (!current) return { ok: false, error: error! };
  const supabase = await createAdminClient();
  const { error: dbErr } = await supabase
    .from("profiles")
    .update({ reseller_webhook_ips: parsed.data.ips })
    .eq("id", current.user.id);
  if (dbErr) return { ok: false, error: "Kaydedilemedi." };
  revalidatePath("/account/api");
  return { ok: true };
}

/* ─────────────────────── Test webhook gönderimi ────────────────────────── */

export type TestWebhookResult =
  | { ok: true; statusCode: number | null; durationMs: number; status: "success" | "failed" }
  | { ok: false; error: string };

/** Bayinin webhook URL'ine gerçek bir test POST'u atar ve geçmişe kaydeder. */
export async function sendTestWebhook(): Promise<TestWebhookResult> {
  const { current, error } = await requireApprovedReseller();
  if (!current) return { ok: false, error: error! };
  const url = current.profile.reseller_webhook;
  if (!url) return { ok: false, error: "Önce bir webhook URL'i kaydet." };

  const supabase = await createAdminClient();
  const payload = {
    event: "test",
    sent_at: new Date().toISOString(),
    data: {
      message: "EpinFox webhook test gönderimi",
      reseller: current.profile.reseller_store ?? current.nickname,
    },
  };

  const t0 = Date.now();
  let statusCode: number | null = null;
  let status: "success" | "failed" = "failed";
  let errMsg: string | null = null;

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "EpinFox-Webhook/1.0",
        "X-EpinFox-Event": "test",
      },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    statusCode = res.status;
    status = res.ok ? "success" : "failed";
    if (!res.ok) errMsg = `HTTP ${res.status}`;
  } catch (e: unknown) {
    errMsg = e instanceof Error ? e.message : "Bağlantı hatası";
  }
  const durationMs = Date.now() - t0;

  await supabase.from("webhook_deliveries").insert({
    user_id: current.user.id,
    event: "test",
    target_url: url,
    status,
    status_code: statusCode,
    duration_ms: durationMs,
    error: errMsg,
    payload,
  });

  revalidatePath("/account/api");
  return { ok: true, statusCode, durationMs, status };
}

/* ─────────────────────── Bayi mağaza ayarları ──────────────────────────── */

const storeSchema = z.object({
  store: z.string().trim().min(2, "Mağaza adı gerekli.").max(80),
});

export async function updateResellerStore(
  input: z.infer<typeof storeSchema>,
): Promise<Result> {
  const parsed = storeSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz." };
  }
  const { current, error } = await requireApprovedReseller();
  if (!current) return { ok: false, error: error! };
  const supabase = await createAdminClient();
  const { error: dbErr } = await supabase
    .from("profiles")
    .update({ reseller_store: parsed.data.store })
    .eq("id", current.user.id);
  if (dbErr) return { ok: false, error: "Kaydedilemedi." };
  revalidatePath("/account/reseller");
  return { ok: true };
}

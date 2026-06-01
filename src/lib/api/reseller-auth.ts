import "server-only";
import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { TIER_DISCOUNT } from "@/lib/reseller-meta";
import type { ResellerTier } from "@/lib/supabase/types";

const RATE_LIMIT_PER_MIN = 60;

export interface ApiReseller {
  id: string;
  nickname: string | null;
  email: string | null;
  balance: number;
  tier: ResellerTier | null;
  discountPct: number;
}

export type ApiAuthResult =
  | { ok: true; reseller: ApiReseller; supabase: Awaited<ReturnType<typeof createAdminClient>> }
  | { ok: false; response: NextResponse };

/** Standart JSON hata cevabı (API formatı). */
export function apiError(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

function extractKey(req: Request): string | null {
  const auth = req.headers.get("authorization") || "";
  if (auth.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  // Alternatif: X-API-Key başlığı
  const x = req.headers.get("x-api-key");
  return x ? x.trim() : null;
}

/**
 * Bayi API isteğini doğrular:
 *  - Bearer/X-API-Key → SHA-256 hash → approved reseller eşleşmesi
 *  - dakikalık rate limit (60)
 *  - istek loglama + son kullanım damgası
 * Başarılıysa reseller + supabase döner; değilse hazır NextResponse.
 */
export async function authenticateReseller(
  req: Request,
  endpoint: string,
  method: string,
): Promise<ApiAuthResult> {
  const key = extractKey(req);
  if (!key) {
    return {
      ok: false,
      response: apiError("unauthorized", "API anahtarı eksik. Authorization: Bearer <key> gönderin.", 401),
    };
  }

  const hash = createHash("sha256").update(key).digest("hex");
  const supabase = await createAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, nickname, email, balance, reseller_status, reseller_tier")
    .eq("reseller_api_key", hash)
    .maybeSingle();

  if (!profile) {
    return { ok: false, response: apiError("invalid_key", "Geçersiz API anahtarı.", 401) };
  }
  if (profile.reseller_status !== "approved") {
    return { ok: false, response: apiError("forbidden", "Bayilik hesabınız aktif değil.", 403) };
  }

  // Rate limit (son 1 dakika)
  const { data: count } = await supabase.rpc("reseller_api_rate_count", {
    p_user_id: profile.id,
  });
  if (typeof count === "number" && count >= RATE_LIMIT_PER_MIN) {
    await logRequest(supabase, profile.id, endpoint, method, 429, req);
    const res = apiError("rate_limited", "Dakikalık istek limiti aşıldı (60/dk).", 429);
    res.headers.set("Retry-After", "60");
    return { ok: false, response: res };
  }

  const tier = (profile.reseller_tier as ResellerTier | null) ?? null;
  const reseller: ApiReseller = {
    id: profile.id,
    nickname: profile.nickname,
    email: profile.email,
    balance: Number(profile.balance ?? 0),
    tier,
    discountPct: tier ? TIER_DISCOUNT[tier] : 0,
  };

  // Son kullanım damgası (best-effort)
  await supabase
    .from("profiles")
    .update({ reseller_api_last_used: new Date().toISOString() })
    .eq("id", profile.id);

  return { ok: true, reseller, supabase };
}

/** İstek logla (rate limit penceresi + denetim). */
export async function logRequest(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  userId: string,
  endpoint: string,
  method: string,
  statusCode: number,
  req: Request,
) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null;
  await supabase.from("reseller_api_requests").insert({
    user_id: userId,
    endpoint,
    method,
    status_code: statusCode,
    ip,
  });
}

/** Bayi indirimli fiyat (taban fiyat - tier %). 2 ondalık. */
export function resellerPrice(basePrice: number, discountPct: number): number {
  return Math.round(basePrice * (1 - discountPct / 100) * 100) / 100;
}

/**
 * Bayinin webhook'una sipariş olayı gönder (best-effort, await edilmez gerekirse).
 * webhook_deliveries tablosuna sonucu loglar.
 */
export async function fireResellerWebhook(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  userId: string,
  event: string,
  payload: Record<string, unknown>,
) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("reseller_webhook")
    .eq("id", userId)
    .maybeSingle();
  const url = profile?.reseller_webhook;
  if (!url) return;

  const payloadObj = { event, data: payload, sent_at: new Date().toISOString() };
  const body = JSON.stringify(payloadObj);
  let statusCode: number | null = null;
  let okFlag = false;
  let errMsg: string | null = null;
  const t0 = Date.now();
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-EpinFox-Event": event },
      body,
      signal: AbortSignal.timeout(8000),
    });
    statusCode = res.status;
    okFlag = res.ok;
    if (!okFlag) errMsg = `HTTP ${res.status}`;
  } catch (e) {
    errMsg = e instanceof Error ? e.message : "bağlanılamadı";
  }
  await supabase.from("webhook_deliveries").insert({
    user_id: userId,
    event,
    target_url: url,
    status: okFlag ? "success" : "failed",
    status_code: statusCode,
    duration_ms: Date.now() - t0,
    error: errMsg,
    payload: payloadObj,
  });
}

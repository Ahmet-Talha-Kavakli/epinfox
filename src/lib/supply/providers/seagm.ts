// SEAGM (SouthEast Asia Game Mall) tedarik sağlayıcısı.
// B2B reseller OpenAPI üzerinden e-pin (card) ve direkt top-up (recharge) teslimi.
//
// Doğrulama kaynağı: https://doc.openapi.seagm.io/  (incelendi 2026-05-29)
//   - Kimlik/imza: uid + timestamp + signature (HMAC-SHA256).
//     İmza dizisi: tüm parametreler (signature hariç) ksort'lanır,
//     "key1=value1&key2=value2&..." şeklinde birleştirilir, secretKey ile
//     HMAC-SHA256 alınır (hex). Zaman penceresi ±120 sn.
//   - Base URL: production https://openapi.seagm.com/ , sandbox https://openapi.seagm.io/
//   - Bakiye:        GET  /v1/me                       → data.credits / data.balance
//   - Card sipariş:  POST /v1/card-orders             → data.cards[] (PIN/serial)
//   - Card durum:    GET  /v1/card-orders/:order_id   → data.status_code / send_status_code
//   - Recharge:      POST /v1/recharge-orders         → top-up (kod yok)
//   - Recharge tip:  GET  /v1/recharge-types/:type_id → fields[] (charge_account, server…)
//
// ÖNEMLİ: Gerçek anahtar olmadığı için CANLI çağrı yapılmadı; adaptör doğru
// yapıda yazıldı, doğrulanamayan ayrıntılar TODO ile işaretlendi.

import { createHmac } from "node:crypto";
import type {
  SupplyProvider,
  FulfillContext,
  FulfillResult,
} from "@/lib/supply/types";

const DEFAULT_BASE_URL = "https://openapi.seagm.io"; // sandbox (güvenli varsayılan)

interface SeagmConfig {
  uid: string;
  secret: string;
  baseUrl: string;
}

/** Env'den config; eksikse null (caller anlamlı hata döner, throw etmez). */
function readConfig(): SeagmConfig | null {
  // NOT: SEAGM dökümanı kimliği "uid" olarak adlandırır; bazı entegrasyon
  // notlarında "app_id" geçer. İkisini de destekliyoruz, biri yeterli.
  const uid = process.env.SEAGM_APP_ID ?? process.env.SEAGM_UID ?? "";
  const secret = process.env.SEAGM_SECRET ?? "";
  if (!uid || !secret) return null;
  const baseUrl = (process.env.SEAGM_BASE_URL || DEFAULT_BASE_URL).replace(
    /\/+$/,
    "",
  );
  return { uid, secret, baseUrl };
}

/**
 * SEAGM imzası: signature hariç tüm parametreler ksort'lanır,
 * "k=v&k=v" birleştirilir, secret ile HMAC-SHA256 (hex) alınır.
 * ksort = anahtarların doğal (byte) sıralaması.
 */
function sign(
  params: Record<string, string | number>,
  secret: string,
): string {
  const base = Object.keys(params)
    .filter((k) => k !== "signature")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHmac("sha256", secret).update(base).digest("hex");
}

/** İmzalı parametre seti (uid + timestamp + signature ekler). */
function signedParams(
  cfg: SeagmConfig,
  extra: Record<string, string | number> = {},
): Record<string, string> {
  const params: Record<string, string | number> = {
    uid: cfg.uid,
    timestamp: Math.floor(Date.now() / 1000),
    ...extra,
  };
  params.signature = sign(params, cfg.secret);
  // string'e indir (query/body için).
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) out[k] = String(v);
  return out;
}

interface SeagmEnvelope<T> {
  code?: number;
  msg?: string;
  data?: T;
  error_info?: { info_code?: number; info_message?: string };
}

/** Hata zarfından okunabilir mesaj çıkarır. */
function envelopeError(env: SeagmEnvelope<unknown>, fallback: string): string {
  return (
    env.error_info?.info_message ??
    env.msg ??
    fallback
  );
}

async function seagmGet<T>(
  cfg: SeagmConfig,
  path: string,
  extra: Record<string, string | number> = {},
): Promise<SeagmEnvelope<T>> {
  const qs = new URLSearchParams(signedParams(cfg, extra)).toString();
  const res = await fetch(`${cfg.baseUrl}${path}?${qs}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  return (await res.json()) as SeagmEnvelope<T>;
}

async function seagmPost<T>(
  cfg: SeagmConfig,
  path: string,
  body: Record<string, string | number>,
): Promise<SeagmEnvelope<T>> {
  // İmza GET/POST'ta aynı kuralla hesaplanır (tüm parametreler birlikte).
  const signed = signedParams(cfg, body);
  const res = await fetch(`${cfg.baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(signed),
    cache: "no-store",
  });
  return (await res.json()) as SeagmEnvelope<T>;
}

// ── SEAGM'e özel ürün eşlemesi ────────────────────────────────────────────
// EpinFox varyantı → SEAGM ürünü eşlemesi henüz DB'de tutulmuyor.
// Geçici olarak env / variantId üzerinden çözülemediği için TODO:
// TODO(seagm): product_variants tablosuna `supplier_product_id` ve
//   (recharge için) `supplier_field_map` kolonları eklenip buraya geçilmeli.
//   Şimdilik fulfill, eşleme yoksa anlamlı hata döner (canlı çağrı yapmaz).
function resolveSupplierProductId(_ctx: FulfillContext): string | null {
  // TODO(seagm): gerçek eşleme. Şu an eşleme kaynağı olmadığından null.
  return null;
}

interface CardOrderData {
  id?: number | string;
  trade_id?: number | string;
  cards?: Array<{ pin?: string; serial?: string; code?: string }>;
}

interface RechargeOrderData {
  id?: number | string;
  trade_id?: number | string;
  status?: string;
  status_code?: number;
  send_status_code?: number;
}

export const seagmProvider: SupplyProvider = {
  source: "seagm",

  async fulfill(ctx: FulfillContext): Promise<FulfillResult> {
    const cfg = readConfig();
    if (!cfg) {
      return {
        ok: false,
        error:
          "SEAGM yapılandırması eksik (SEAGM_APP_ID / SEAGM_SECRET tanımlı değil).",
      };
    }

    // EpinFox varyantını SEAGM ürün ID'sine çevir. Eşleme yoksa canlı
    // çağrı yapma — yanlış ürüne sipariş açılmasını önler.
    const supplierProductId = resolveSupplierProductId(ctx);
    if (!supplierProductId) {
      return {
        ok: false,
        error:
          "Bu ürün için SEAGM eşlemesi tanımlı değil. (Tedarik ID eşlemesi gerekli.)",
      };
    }

    // Idempotency: aynı EpinFox siparişinin SEAGM'de tekrar oluşmasını
    // engellemek için mch_order_id kullanılır. begin_supply_order'dan gelen
    // order id ideal olurdu; ctx'te yok → variant + zaman ile üretiyoruz.
    // TODO(seagm): FulfillContext'e orderId eklenip mch_order_id buna bağlanmalı
    //   (gerçek idempotency için). Şimdilik benzersiz bir referans üretiyoruz.
    const mchOrderId = `EF-${ctx.variantId.slice(0, 8)}-${Date.now()}`;

    try {
      if (ctx.deliveryType === "code") {
        // ── E-PIN (card) teslim ──
        // POST /v1/card-orders → data.cards[] (PIN/serial)
        const env = await seagmPost<CardOrderData>(cfg, "/v1/card-orders", {
          type_id: supplierProductId,
          buy_amount: ctx.qty,
          mch_order_id: mchOrderId,
        });

        if (env.code && env.code >= 400) {
          return {
            ok: false,
            error: envelopeError(env, "SEAGM card sipariş hatası."),
          };
        }

        const data = env.data;
        const cards = data?.cards ?? [];
        // TODO(seagm): cards[] alan adı (pin/serial/code) canlı yanıtla
        //   doğrulanmalı; doc "PIN/serial numbers" diyor, kesin alan adı belirsiz.
        const codes = cards
          .map((c) => c.pin ?? c.code ?? c.serial ?? "")
          .filter((c) => c.length > 0);

        if (codes.length === 0) {
          // Sipariş açıldı ama kod gelmedi → asenkron olabilir.
          // TODO(seagm): kod hemen gelmiyorsa GET /v1/card-orders/:id ile
          //   poll edip send_status_code beklenebilir. Şimdilik başarısız say
          //   (checkout iadeyi yönetir).
          return {
            ok: false,
            error: "SEAGM siparişten kod alınamadı.",
            supplierRef: data?.id != null ? String(data.id) : mchOrderId,
          };
        }

        return {
          ok: true,
          codes,
          supplierRef: data?.id != null ? String(data.id) : mchOrderId,
        };
      }

      // ── DİREKT TOP-UP (recharge) teslim ──
      // SEAGM'de ayrı "role check" endpoint'i yok; oyuncu doğrulaması
      // sipariş oluşturma anında recharge-types fields[] ile yapılır.
      if (!ctx.playerId) {
        return { ok: false, error: "Oyuncu/hesap ID gerekli." };
      }

      // TODO(seagm): recharge-types/:type_id fields[] dinamik alanları
      //   (charge_account, server_id/zone vb.) ürün başına değişir; gerçek
      //   alan adları DB eşlemesinden gelmeli. Şu an oyuncu ID'sini
      //   "charge_account" alanına yazıyoruz (en yaygın alan adı).
      const env = await seagmPost<RechargeOrderData>(
        cfg,
        "/v1/recharge-orders",
        {
          type_id: supplierProductId,
          buy_amount: ctx.qty,
          mch_order_id: mchOrderId,
          charge_account: ctx.playerId,
        },
      );

      if (env.code && env.code >= 400) {
        return {
          ok: false,
          error: envelopeError(env, "SEAGM top-up sipariş hatası."),
        };
      }

      const data = env.data;
      const ref = data?.id != null ? String(data.id) : mchOrderId;
      // send_status_code'a göre teslim onayı. Kesin başarı kodu doc'ta net değil.
      // TODO(seagm): send_status_code başarı değerini doc/sandbox ile doğrula
      //   (örn. 2 = gönderildi). Şimdilik 4xx yoksa kabul ediyoruz.
      return {
        ok: true,
        note: `${ctx.variantLabel ?? ctx.productName} oyuncu ${ctx.playerId} hesabına SEAGM üzerinden yüklendi.`,
        supplierRef: ref,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
      return { ok: false, error: `SEAGM bağlantı hatası: ${msg}` };
    }
  },
};

/**
 * Bakiye sorgusu — admin paneli / sağlık kontrolü için yardımcı (opsiyonel).
 * GET /v1/me → data.credits / data.balance / data.currency
 */
export async function seagmBalance(): Promise<
  | { ok: true; credits: number; balance: string; currency: string }
  | { ok: false; error: string }
> {
  const cfg = readConfig();
  if (!cfg) return { ok: false, error: "SEAGM yapılandırması eksik." };
  try {
    const env = await seagmGet<{
      credits?: number;
      balance?: string;
      currency?: string;
    }>(cfg, "/v1/me");
    if (env.code && env.code >= 400) {
      return { ok: false, error: envelopeError(env, "Bakiye alınamadı.") };
    }
    return {
      ok: true,
      credits: env.data?.credits ?? 0,
      balance: env.data?.balance ?? "0",
      currency: env.data?.currency ?? "",
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
    return { ok: false, error: msg };
  }
}

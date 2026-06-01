// SMM (Sosyal Medya Hizmetleri) tedarik sağlayıcısı — "Perfect Panel" standardı.
// Instagram takipçi, YouTube izlenme, TikTok beğeni vb.
//
// Perfect Panel /api/v2 formatı endüstri standardıdır: resellerprovider.com,
// followiz.com, justanotherpanel.com, medyabayim.com ve yüzlerce panel AYNI
// API'yi konuşur → tek adaptör hepsiyle çalışır. Sadece SMM_API_URL'i değiştir.
//
// Kanonik /api/v2 (doğrulanmış, tek endpoint, form-urlencoded body, JSON döner):
//   POST https://<panel>/api/v2
//   - key=API_KEY (her istekte zorunlu)
//   - action=services                         → servis kataloğu (id/name/rate/min/max…)
//   - action=add & service & link & quantity  → { order: <orderId> }
//   - action=status & order=<id>              → { charge,start_count,status,remains,currency }
//       status: Pending | In progress | Processing | Completed | Partial | Canceled
//   - action=balance                          → { balance, currency }
//   - action=refill & order=<id>              → { refill: <id> } (opsiyonel)
//
// ÖNEMLİ: SMM ASENKRONdur. action=add anında sipariş AÇILIR ama teslim
// saatler/günler sürebilir. fulfill başarılı dönse bile order 'processing'te
// KALMALI; gerçek teslim sonra action=status ile poll edilip tamamlanır
// (src/lib/actions/smm-sync.ts).
//
// Gerçek API anahtarı YOK → canlı çağrı yapılmadı. Adaptör standart formata
// göre tam yazıldı; SMM_API_KEY tanımlanınca çalışır.

import type {
  SupplyProvider,
  FulfillContext,
  FulfillResult,
} from "@/lib/supply/types";

interface SmmConfig {
  url: string;
  key: string;
}

/** Env'den config; eksikse null (caller anlamlı hata döner, throw etmez). */
function readConfig(): SmmConfig | null {
  const url = (process.env.SMM_API_URL ?? "").trim();
  const key = (process.env.SMM_API_KEY ?? "").trim();
  if (!url || !key) return null;
  return { url, key };
}

/** Perfect Panel'e form-urlencoded POST atar, JSON döndürür. */
async function smmCall<T>(
  cfg: SmmConfig,
  params: Record<string, string | number>,
): Promise<T> {
  const body = new URLSearchParams();
  body.set("key", cfg.key);
  for (const [k, v] of Object.entries(params)) body.set(k, String(v));

  const res = await fetch(cfg.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: body.toString(),
    cache: "no-store",
  });
  return (await res.json()) as T;
}

// ── Yanıt tipleri ───────────────────────────────────────────────────────────
interface AddResponse {
  order?: number | string;
  error?: string;
}

export interface SmmService {
  service: number | string;
  name: string;
  type: string;
  category: string;
  rate: string; // 1000 adet başına fiyat
  min: string;
  max: string;
  refill?: boolean;
  cancel?: boolean;
}

export interface SmmStatus {
  charge?: string;
  start_count?: string;
  status?: string; // Pending | In progress | Processing | Completed | Partial | Canceled
  remains?: string;
  currency?: string;
  error?: string;
}

interface BalanceResponse {
  balance?: string;
  currency?: string;
  error?: string;
}

interface RefillResponse {
  refill?: number | string;
  error?: string;
}

/** Perfect Panel "Completed" durumlarını normalize eder. */
export function isSmmCompleted(status: string | undefined): boolean {
  return (status ?? "").toLowerCase() === "completed";
}

/** İade gerektiren (iptal/başarısız) SMM durumları. */
export function isSmmFailed(status: string | undefined): boolean {
  const s = (status ?? "").toLowerCase();
  return s === "canceled" || s === "cancelled" || s === "fail" || s === "error";
}

/** Hâlâ devam eden (poll'a devam) durumlar. */
export function isSmmPending(status: string | undefined): boolean {
  const s = (status ?? "").toLowerCase();
  return (
    s === "pending" ||
    s === "in progress" ||
    s === "processing" ||
    s === "partial" // partial: kısmen tamamlandı, çoğu panelde sonra completed/canceled olur
  );
}

export const smmProvider: SupplyProvider = {
  source: "smm",

  async fulfill(ctx: FulfillContext): Promise<FulfillResult> {
    const cfg = readConfig();
    if (!cfg) {
      return {
        ok: false,
        error:
          "SMM yapılandırması eksik (SMM_API_URL / SMM_API_KEY tanımlı değil).",
      };
    }

    // service teslimde hedef link zorunlu (profil/video URL'si).
    const link = (ctx.link ?? "").trim();
    if (!link) {
      return { ok: false, error: "Hedef link gerekli (profil/video URL'si)." };
    }

    // Varyant → panel servis id eşlemesi DB'den gelir (supplier_service_id).
    const serviceId = (ctx.supplierServiceId ?? "").trim();
    if (!serviceId) {
      return {
        ok: false,
        error:
          "Bu ürün için SMM servis eşlemesi tanımlı değil. (Varyanta servis id girilmeli.)",
      };
    }

    // Miktar: SMM'de quantity = takipçi/izlenme/beğeni adedi. ctx.qty kullanılır.
    // (UI'da qty = istenen adet; varyant "1000 takipçi" gibi sabit paketse qty=1
    //  ve servis min/max'ı buna göre ayarlanır. Burada ham qty gönderilir.)
    const quantity = ctx.qty;

    try {
      const res = await smmCall<AddResponse>(cfg, {
        action: "add",
        service: serviceId,
        link,
        quantity,
      });

      if (res.error || res.order == null) {
        return {
          ok: false,
          error: res.error
            ? `SMM sipariş hatası: ${res.error}`
            : "SMM siparişi oluşturulamadı (order id dönmedi).",
        };
      }

      // Sipariş AÇILDI. Teslim ASENKRON → order 'processing'te kalmalı,
      // completed YAPMA. supplier_ref = SMM order id (poll için).
      return {
        ok: true,
        supplierRef: String(res.order),
        note: "Sipariş alındı, teslim ediliyor.",
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
      return { ok: false, error: `SMM bağlantı hatası: ${msg}` };
    }
  },
};

// ─── Admin/poll yardımcıları ────────────────────────────────────────────────

/** Panel servis kataloğu (admin'in EpinFox varyantına eşleyeceği liste). */
export async function smmServices(): Promise<
  { ok: true; services: SmmService[] } | { ok: false; error: string }
> {
  const cfg = readConfig();
  if (!cfg) return { ok: false, error: "SMM yapılandırması eksik." };
  try {
    const data = await smmCall<SmmService[] | { error?: string }>(cfg, {
      action: "services",
    });
    if (!Array.isArray(data)) {
      return { ok: false, error: data?.error ?? "Servis listesi alınamadı." };
    }
    return { ok: true, services: data };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
    return { ok: false, error: msg };
  }
}

/** Tek bir SMM siparişinin durumu (poll için). */
export async function smmStatus(
  orderId: string,
): Promise<{ ok: true; status: SmmStatus } | { ok: false; error: string }> {
  const cfg = readConfig();
  if (!cfg) return { ok: false, error: "SMM yapılandırması eksik." };
  try {
    const data = await smmCall<SmmStatus>(cfg, {
      action: "status",
      order: orderId,
    });
    if (data.error) return { ok: false, error: data.error };
    return { ok: true, status: data };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
    return { ok: false, error: msg };
  }
}

/** Panel bakiyesi (admin sağlık kontrolü). */
export async function smmBalance(): Promise<
  { ok: true; balance: string; currency: string } | { ok: false; error: string }
> {
  const cfg = readConfig();
  if (!cfg) return { ok: false, error: "SMM yapılandırması eksik." };
  try {
    const data = await smmCall<BalanceResponse>(cfg, { action: "balance" });
    if (data.error) return { ok: false, error: data.error };
    return {
      ok: true,
      balance: data.balance ?? "0",
      currency: data.currency ?? "",
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
    return { ok: false, error: msg };
  }
}

/** Garantili (refill destekli) siparişi yeniden doldurma — opsiyonel. */
export async function smmRefill(
  orderId: string,
): Promise<{ ok: true; refillId: string } | { ok: false; error: string }> {
  const cfg = readConfig();
  if (!cfg) return { ok: false, error: "SMM yapılandırması eksik." };
  try {
    const data = await smmCall<RefillResponse>(cfg, {
      action: "refill",
      order: orderId,
    });
    if (data.error || data.refill == null) {
      return { ok: false, error: data.error ?? "Refill başlatılamadı." };
    }
    return { ok: true, refillId: String(data.refill) };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
    return { ok: false, error: msg };
  }
}

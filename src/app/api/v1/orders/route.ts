import { z } from "zod";
import { NextResponse } from "next/server";
import {
  authenticateReseller,
  logRequest,
  fireResellerWebhook,
} from "@/lib/api/reseller-auth";
import { serializeOrder, fetchOrderCode } from "@/lib/api/order-serialize";

export const dynamic = "force-dynamic";

const ENDPOINT = "/api/v1/orders";

const createSchema = z.object({
  variant_id: z.string().uuid({ message: "variant_id geçerli bir UUID olmalı." }),
  /** Bayinin kendi sipariş referansı — idempotency için (aynı ref tek sipariş). */
  reseller_ref: z.string().trim().min(1).max(120).optional(),
});

const ERROR_MESSAGES: Record<string, string> = {
  INSUFFICIENT_BALANCE: "Bakiyeniz yetersiz.",
  OUT_OF_STOCK: "Bu ürün için yeterli stok yok.",
  VARIANT_NOT_FOUND: "Seçenek bulunamadı.",
  PRODUCT_INACTIVE: "Bu ürün satışta değil.",
  USER_NOT_FOUND: "Hesap bulunamadı.",
};

function mapRpcError(message: string): string {
  const key = Object.keys(ERROR_MESSAGES).find((k) => message.includes(k));
  return key ? ERROR_MESSAGES[key] : "Sipariş oluşturulamadı.";
}

// ─── POST /api/v1/orders — bayi adına sipariş oluştur ───────────────────────
export async function POST(req: Request) {
  const auth = await authenticateReseller(req, ENDPOINT, "POST");
  if (!auth.ok) return auth.response;
  const { reseller, supabase } = auth;

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    await logRequest(supabase, reseller.id, ENDPOINT, "POST", 400, req);
    return NextResponse.json(
      { error: { code: "bad_request", message: "Geçersiz JSON gövdesi." } },
      { status: 400 },
    );
  }

  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    await logRequest(supabase, reseller.id, ENDPOINT, "POST", 422, req);
    return NextResponse.json(
      {
        error: {
          code: "validation_error",
          message: parsed.error.issues[0]?.message ?? "Geçersiz istek.",
        },
      },
      { status: 422 },
    );
  }
  const { variant_id, reseller_ref } = parsed.data;

  // ── Idempotency: aynı reseller_ref ile zaten sipariş var mı? ──
  if (reseller_ref) {
    const { data: existing } = await supabase
      .from("orders")
      .select("id, product_name, price, status, created_at, code_id")
      .eq("user_id", reseller.id)
      .eq("reseller_ref", reseller_ref)
      .eq("source", "api")
      .maybeSingle();
    if (existing) {
      await logRequest(supabase, reseller.id, ENDPOINT, "POST", 200, req);
      const code = await fetchOrderCode(supabase, reseller.id, existing.id);
      return NextResponse.json(
        { idempotent: true, order: serializeOrder(existing, code) },
        { status: 200 },
      );
    }
  }

  // ── Varyant + ürün tedarik bilgisi (yalnız manuel/code teslim destekli) ──
  const { data: variant } = await supabase
    .from("product_variants")
    .select("price, is_active, products(id, name, supply_source, delivery_type, is_active)")
    .eq("id", variant_id)
    .maybeSingle();
  const product = (variant?.products ?? null) as {
    id: string;
    name: string;
    supply_source: string;
    delivery_type: string;
    is_active: boolean;
  } | null;

  if (!variant || !product) {
    await logRequest(supabase, reseller.id, ENDPOINT, "POST", 404, req);
    return NextResponse.json(
      { error: { code: "not_found", message: "Seçenek bulunamadı." } },
      { status: 404 },
    );
  }
  if (!variant.is_active || !product.is_active) {
    await logRequest(supabase, reseller.id, ENDPOINT, "POST", 409, req);
    return NextResponse.json(
      { error: { code: "inactive", message: "Bu ürün şu an satışta değil." } },
      { status: 409 },
    );
  }

  // Bayi API yalnız manuel (DB stoğundan, code teslim) ürünleri destekler.
  // topup/service/API-tipi tedarik anlık otomasyon gerektirir → API'den kapalı.
  if (product.supply_source !== "manual" || product.delivery_type !== "code") {
    await logRequest(supabase, reseller.id, ENDPOINT, "POST", 422, req);
    return NextResponse.json(
      {
        error: {
          code: "unsupported_product",
          message:
            "Bu ürün API üzerinden satın alınamıyor (yalnız kod-teslim ürünler desteklenir).",
        },
      },
      { status: 422 },
    );
  }

  // ── Race-safe satın alma RPC'sini bayi adına çağır ──
  const { data, error } = await supabase.rpc("purchase_product", {
    p_user_id: reseller.id,
    p_variant_id: variant_id,
    p_enc_key: process.env.CODE_ENCRYPTION_KEY!,
  });
  if (error) {
    const status = error.message.includes("INSUFFICIENT_BALANCE")
      ? 402
      : error.message.includes("OUT_OF_STOCK")
        ? 409
        : 400;
    await logRequest(supabase, reseller.id, ENDPOINT, "POST", status, req);
    return NextResponse.json(
      { error: { code: "purchase_failed", message: mapRpcError(error.message) } },
      { status },
    );
  }
  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.order_id) {
    await logRequest(supabase, reseller.id, ENDPOINT, "POST", 500, req);
    return NextResponse.json(
      { error: { code: "purchase_failed", message: "Sipariş oluşturulamadı." } },
      { status: 500 },
    );
  }
  const orderId = row.order_id as string;
  const code = (row.code as string | null) ?? null;

  // Bayi referansı + kaynak işaretle (mutabakat/idempotency).
  await supabase
    .from("orders")
    .update({ source: "api", reseller_ref: reseller_ref ?? null })
    .eq("id", orderId);

  const { data: order } = await supabase
    .from("orders")
    .select("id, product_name, price, status, created_at")
    .eq("id", orderId)
    .maybeSingle();

  await logRequest(supabase, reseller.id, ENDPOINT, "POST", 201, req);

  // Bayi webhook'una sipariş tamamlandı olayı (best-effort).
  await fireResellerWebhook(supabase, reseller.id, "order.completed", {
    order_id: orderId,
    reseller_ref: reseller_ref ?? null,
    product_name: order?.product_name ?? product.name,
    price: Number(order?.price ?? variant.price ?? 0),
  });

  return NextResponse.json(
    { order: serializeOrder(order ?? { id: orderId }, code) },
    { status: 201 },
  );
}

// ─── GET /api/v1/orders — bayi siparişleri (API kaynaklı) ────────────────────
export async function GET(req: Request) {
  const auth = await authenticateReseller(req, ENDPOINT, "GET");
  if (!auth.ok) return auth.response;
  const { reseller, supabase } = auth;

  const url = new URL(req.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 50, 1), 100);
  const offset = Math.max(Number(url.searchParams.get("offset")) || 0, 0);

  const { data: orders } = await supabase
    .from("orders")
    .select("id, product_name, price, status, created_at, reseller_ref")
    .eq("user_id", reseller.id)
    .eq("source", "api")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  await logRequest(supabase, reseller.id, ENDPOINT, "GET", 200, req);

  return NextResponse.json({
    orders: (orders ?? []).map((o) => serializeOrder(o, null)),
    limit,
    offset,
    discount_pct: reseller.discountPct,
    // sadece tutarlılık için: bir sonraki sayfa olabilir mi?
    has_more: (orders?.length ?? 0) === limit,
  });
}


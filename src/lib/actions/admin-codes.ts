"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/server";
import { notify } from "@/lib/notifications";
import type {
  CodeStatus,
  DeliveryType,
  Order,
  SupplierLog,
} from "@/lib/supabase/types";

const addSchema = z.object({
  variantId: z.string().uuid(),
  codesText: z.string().min(1),
});

export type AddCodesResult =
  | { ok: true; added: number }
  | { ok: false; error: string };

/** Toplu kod ekleme — VARYANT bazlı, her satır bir kod (RPC içinde şifrelenir). */
export async function addProductCodes(
  input: z.infer<typeof addSchema>,
): Promise<AddCodesResult> {
  await requireAdmin();
  const parsed = addSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Geçersiz istek." };

  const codes = parsed.data.codesText
    .split(/\r?\n/)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  if (codes.length === 0) return { ok: false, error: "En az bir kod girin." };

  const supabase = await createAdminClient();
  const { data, error } = await supabase.rpc("add_product_codes", {
    p_variant_id: parsed.data.variantId,
    p_codes: codes,
    p_enc_key: process.env.CODE_ENCRYPTION_KEY!,
  });

  if (error) {
    console.error("add_product_codes error:", error.message);
    return { ok: false, error: "Kodlar eklenemedi." };
  }

  revalidatePath("/admin/codes");
  revalidatePath("/admin/products");
  revalidatePath("/store");
  return { ok: true, added: Number(data) };
}

/** Bir ürünün varyantları (kod ekleme formu için: hangi varyanta?). */
export async function getProductVariantsForCodes(productId: string): Promise<
  { id: string; label: string; available: number }[]
> {
  await requireAdmin();
  const supabase = await createAdminClient();
  const { data: variants } = await supabase
    .from("product_variants")
    .select("id, label")
    .eq("product_id", productId)
    .eq("is_active", true)
    .order("position", { ascending: true });

  const out: { id: string; label: string; available: number }[] = [];
  for (const v of (variants as { id: string; label: string }[]) ?? []) {
    const { count } = await supabase
      .from("product_codes")
      .select("id", { count: "exact", head: true })
      .eq("variant_id", v.id)
      .eq("status", "available");
    out.push({ id: v.id, label: v.label, available: count ?? 0 });
  }
  return out;
}

export interface StockRow {
  product_id: string;
  product_name: string;
  supply_source: string;
  delivery_type: string;
  available: number;
  sold: number;
}

/** Ürün bazında stok özeti (available / sold) + tedarik kaynağı. */
export async function getStockSummary(): Promise<StockRow[]> {
  await requireAdmin();
  const supabase = await createAdminClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, supply_source, delivery_type")
    .order("name", { ascending: true });

  const result: StockRow[] = [];

  for (const p of (products as {
    id: string;
    name: string;
    supply_source: string;
    delivery_type: string;
  }[]) ?? []) {
    const [{ count: available }, { count: sold }] = await Promise.all([
      supabase
        .from("product_codes")
        .select("id", { count: "exact", head: true })
        .eq("product_id", p.id)
        .eq("status", "available"),
      supabase
        .from("product_codes")
        .select("id", { count: "exact", head: true })
        .eq("product_id", p.id)
        .eq("status", "sold"),
    ]);
    result.push({
      product_id: p.id,
      product_name: p.name,
      supply_source: p.supply_source,
      delivery_type: p.delivery_type,
      available: available ?? 0,
      sold: sold ?? 0,
    });
  }
  return result;
}

/** Tedarik (sağlayıcı) çağrı logları — API-tipi ürünlerin teslim denetimi. */
export async function getSupplierLogs(limit = 100): Promise<SupplierLog[]> {
  await requireAdmin();
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("supplier_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as SupplierLog[]) ?? [];
}

/** Tüm siparişler (admin). */
export async function getAllOrders(limit = 100): Promise<Order[]> {
  await requireAdmin();
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as Order[]) ?? [];
}

// ─── MANUEL KÖPRÜ: BEKLEYEN TESLİMATLAR ──────────────────────────────────────
// supply_source='manual_pending' ürünlerde order 'processing' kalır; admin
// buradan elle kod (code teslim) veya not (topup teslim) girip teslim eder,
// ya da iptal/iade (fail) yapar. complete_supply_order / fail_supply_order RPC.

export interface PendingDeliveryRow {
  id: string;
  product_name: string;
  variant_label: string | null;
  price: number;
  delivery_type: DeliveryType;
  player_id: string | null;
  status: string;
  created_at: string;
  user_email: string | null;
  user_nickname: string | null;
}

/** Manuel köprü bekleyen siparişler (pending/processing). En yeni en üstte. */
export async function getPendingDeliveries(): Promise<PendingDeliveryRow[]> {
  await requireAdmin();
  const supabase = await createAdminClient();

  // Yalnız manuel köprü kaynaklı, henüz teslim edilmemiş siparişler.
  const { data } = await supabase
    .from("orders")
    .select(
      "id, product_name, variant_label, price, delivery_type, player_id, status, created_at, user_id, products!inner(supply_source), profiles(email, nickname)",
    )
    .in("status", ["pending", "processing"])
    .eq("products.supply_source", "manual_pending")
    .order("created_at", { ascending: true });

  type Rel<T> = T | T[] | null;
  type Row = {
    id: string;
    product_name: string;
    variant_label: string | null;
    price: number;
    delivery_type: DeliveryType;
    player_id: string | null;
    status: string;
    created_at: string;
    profiles: Rel<{ email: string | null; nickname: string | null }>;
  };

  const one = <T>(rel: Rel<T>): T | null =>
    Array.isArray(rel) ? (rel[0] ?? null) : rel;

  return ((data as unknown as Row[]) ?? []).map((r) => {
    const prof = one(r.profiles);
    return {
      id: r.id,
      product_name: r.product_name,
      variant_label: r.variant_label,
      price: Number(r.price ?? 0),
      delivery_type: r.delivery_type,
      player_id: r.player_id,
      status: r.status,
      created_at: r.created_at,
      user_email: prof?.email ?? null,
      user_nickname: prof?.nickname ?? null,
    };
  });
}

const deliverSchema = z.object({
  orderId: z.string().uuid(),
  // code teslim: tek kod (her satır ayrı kod). topup teslim: not.
  payload: z.string().trim().min(1).max(4000),
});

export type DeliverResult = { ok: true } | { ok: false; error: string };

/**
 * Bekleyen siparişi elle teslim eder.
 *  - code teslim: payload satırları kod(lar) olarak complete_supply_order'a gider.
 *  - topup teslim: payload teslim notu (delivered_note) olarak yazılır.
 * Müşteriye "siparişin hazır" bildirimi gönderilir.
 */
export async function deliverPendingOrder(
  input: z.infer<typeof deliverSchema>,
): Promise<DeliverResult> {
  await requireAdmin();
  const parsed = deliverSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Geçersiz istek." };

  const supabase = await createAdminClient();

  // Sipariş + teslim tipi + güvenlik: sadece manuel köprü + bekleyen olanlar.
  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, user_id, product_name, variant_label, delivery_type, status, products!inner(supply_source)",
    )
    .eq("id", parsed.data.orderId)
    .maybeSingle();

  const o = order as unknown as
    | {
        id: string;
        user_id: string;
        product_name: string;
        variant_label: string | null;
        delivery_type: DeliveryType;
        status: string;
        products:
          | { supply_source: string }
          | { supply_source: string }[]
          | null;
      }
    | null;

  if (!o) return { ok: false, error: "Sipariş bulunamadı." };
  const supplySource = Array.isArray(o.products)
    ? o.products[0]?.supply_source
    : o.products?.supply_source;
  if (supplySource !== "manual_pending") {
    return { ok: false, error: "Bu sipariş manuel köprü kaynaklı değil." };
  }
  if (o.status !== "pending" && o.status !== "processing") {
    return { ok: false, error: "Bu sipariş zaten işlenmiş." };
  }

  const isCode = o.delivery_type === "code";
  const codes = isCode
    ? parsed.data.payload
        .split(/\r?\n/)
        .map((c) => c.trim())
        .filter((c) => c.length > 0)
    : null;

  if (isCode && (!codes || codes.length === 0)) {
    return { ok: false, error: "En az bir kod girin." };
  }

  const { error } = await supabase.rpc("complete_supply_order", {
    p_order_id: parsed.data.orderId,
    p_codes: isCode ? codes : null,
    p_note: isCode ? null : parsed.data.payload,
    p_supplier_ref: "MANUAL",
    p_enc_key: process.env.CODE_ENCRYPTION_KEY!,
  });
  if (error) {
    console.error("complete_supply_order (manual_pending) error:", error.message);
    return { ok: false, error: "Teslim kaydedilemedi." };
  }

  const label = o.variant_label
    ? `${o.product_name} (${o.variant_label})`
    : o.product_name;
  await notify(supabase, {
    userId: o.user_id,
    type: "order.completed",
    title: `${label} siparişin hazır`,
    body: isCode
      ? "Kodun teslim edildi. Görüntülemek için tıkla."
      : "Yükleme tamamlandı. Detay için tıkla.",
    link: "/orders?new=" + parsed.data.orderId,
    metadata: { order_id: parsed.data.orderId },
  });

  revalidatePath("/admin/pending-deliveries");
  revalidatePath("/orders");
  return { ok: true };
}

const cancelSchema = z.object({
  orderId: z.string().uuid(),
  reason: z.string().trim().max(500).optional(),
});

/** Bekleyen siparişi iptal/iade eder (fail_supply_order → bakiye iade). */
export async function cancelPendingOrder(
  input: z.infer<typeof cancelSchema>,
): Promise<DeliverResult> {
  await requireAdmin();
  const parsed = cancelSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Geçersiz istek." };

  const supabase = await createAdminClient();

  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, user_id, product_name, variant_label, status, products!inner(supply_source)",
    )
    .eq("id", parsed.data.orderId)
    .maybeSingle();
  const o = order as unknown as
    | {
        id: string;
        user_id: string;
        product_name: string;
        variant_label: string | null;
        status: string;
        products:
          | { supply_source: string }
          | { supply_source: string }[]
          | null;
      }
    | null;

  if (!o) return { ok: false, error: "Sipariş bulunamadı." };
  const supplySource = Array.isArray(o.products)
    ? o.products[0]?.supply_source
    : o.products?.supply_source;
  if (supplySource !== "manual_pending") {
    return { ok: false, error: "Bu sipariş manuel köprü kaynaklı değil." };
  }
  if (o.status !== "pending" && o.status !== "processing") {
    return { ok: false, error: "Bu sipariş zaten işlenmiş." };
  }

  const { error } = await supabase.rpc("fail_supply_order", {
    p_order_id: parsed.data.orderId,
    p_error: parsed.data.reason ?? "Admin tarafından iptal edildi",
    p_supplier_ref: "MANUAL",
  });
  if (error) {
    console.error("fail_supply_order (manual_pending) error:", error.message);
    return { ok: false, error: "İptal edilemedi." };
  }

  const label = o.variant_label
    ? `${o.product_name} (${o.variant_label})`
    : o.product_name;
  await notify(supabase, {
    userId: o.user_id,
    type: "order.refunded",
    title: "Sipariş iptal edildi",
    body: `${label} teslim edilemedi. Tutar bakiyene iade edildi.`,
    link: "/orders",
    metadata: { order_id: parsed.data.orderId },
  });

  revalidatePath("/admin/pending-deliveries");
  revalidatePath("/orders");
  revalidatePath("/wallet");
  return { ok: true };
}

/** Admin özet sayıları. */
export async function getAdminStats() {
  await requireAdmin();
  const supabase = await createAdminClient();
  const [products, orders, codes] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase
      .from("product_codes")
      .select("id", { count: "exact", head: true })
      .eq("status", "available" satisfies CodeStatus),
  ]);
  return {
    products: products.count ?? 0,
    orders: orders.count ?? 0,
    availableCodes: codes.count ?? 0,
  };
}

/**
 * Genişletilmiş admin dashboard verisi: ciro, kullanıcı, bekleyenler,
 * son aktivite ve 7 günlük trend. Tek çağrıda toplar.
 */
export async function getAdminDashboard() {
  await requireAdmin();
  const supabase = await createAdminClient();

  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    products,
    availableCodes,
    orders,
    users,
    resellers,
    pendingDeliveries,
    pendingResellerApps,
    openTickets,
    completedOrders,
    recentOrders,
    recentUsers,
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase
      .from("product_codes")
      .select("id", { count: "exact", head: true })
      .eq("status", "available" satisfies CodeStatus),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("reseller_status", "approved"),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .in("status", ["pending", "processing"]),
    supabase
      .from("reseller_applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("support_tickets")
      .select("id", { count: "exact", head: true })
      .in("status", ["open", "answered"]),
    supabase.from("orders").select("price, created_at").eq("status", "completed"),
    supabase
      .from("orders")
      .select("id, product_name, price, status, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("profiles")
      .select("id, nickname, email, joined_at, role")
      .order("joined_at", { ascending: false })
      .limit(6),
  ]);

  const completed = (completedOrders.data as { price: number; created_at: string }[]) ?? [];
  const revenueTotal = completed.reduce((s, o) => s + Number(o.price), 0);
  const revenueToday = completed
    .filter((o) => o.created_at >= dayStart)
    .reduce((s, o) => s + Number(o.price), 0);
  const revenueMonth = completed
    .filter((o) => o.created_at >= monthStart)
    .reduce((s, o) => s + Number(o.price), 0);

  // Son 7 gün trendi
  const trend: { day: string; count: number; revenue: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const next = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    const dayCompleted = completed.filter(
      (o) => o.created_at >= d.toISOString() && o.created_at < next.toISOString(),
    );
    trend.push({
      day: d.toLocaleDateString("tr-TR", { weekday: "short" }),
      count: dayCompleted.length,
      revenue: dayCompleted.reduce((s, o) => s + Number(o.price), 0),
    });
  }

  return {
    counts: {
      products: products.count ?? 0,
      availableCodes: availableCodes.count ?? 0,
      orders: orders.count ?? 0,
      users: users.count ?? 0,
      resellers: resellers.count ?? 0,
    },
    revenue: { total: revenueTotal, today: revenueToday, month: revenueMonth },
    todo: {
      pendingDeliveries: pendingDeliveries.count ?? 0,
      pendingResellerApps: pendingResellerApps.count ?? 0,
      openTickets: openTickets.count ?? 0,
    },
    trend,
    recentOrders:
      (recentOrders.data as {
        id: string;
        product_name: string;
        price: number;
        status: string;
        created_at: string;
      }[]) ?? [],
    recentUsers:
      (recentUsers.data as {
        id: string;
        nickname: string;
        email: string;
        joined_at: string;
        role: string;
      }[]) ?? [],
  };
}

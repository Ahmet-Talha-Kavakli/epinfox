"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireMember } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/server";
import { notify, notifyAdmins } from "@/lib/notifications";
import { createInvoiceForOrder } from "@/lib/account";
import { sendEmail, emailTemplate } from "@/lib/email";
import { getServerT } from "@/lib/i18n/server";
import {
  getProvider,
  isManualSource,
  isManualPendingSource,
} from "@/lib/supply/registry";

const schema = z.object({
  variantId: z.string().uuid(),
  qty: z.number().int().min(1).max(20).optional(),
  playerId: z.string().trim().max(64).optional(),
  /** service (SMM) teslimde hedef profil/video linki. */
  link: z.string().trim().max(500).optional(),
});

export type PurchaseResult =
  | { ok: true; orderId: string }
  | { ok: false; error: string };

// DB error kodu → çeviri anahtarı. Mesaj t() ile locale'e göre kurulur.
const ERROR_KEYS: Record<string, string> = {
  INSUFFICIENT_BALANCE: "srv.co.err.insufficientBalance",
  OUT_OF_STOCK: "srv.co.err.outOfStock",
  VARIANT_NOT_FOUND: "srv.co.err.variantNotFound",
  PRODUCT_INACTIVE: "srv.co.err.productInactive",
  USER_NOT_FOUND: "srv.co.err.userNotFound",
  EMPTY_CART: "srv.co.err.emptyCart",
  INVALID_QTY: "srv.co.err.invalidQty",
};

function mapError(
  message: string,
  t: (key: string) => string,
): string {
  const code = Object.keys(ERROR_KEYS).find((k) => message.includes(k));
  return code ? t(ERROR_KEYS[code]) : t("srv.co.err.generic");
}

/** Sipariş sonrası ortak: bildirim + fatura. */
async function afterOrder(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  t: (key: string) => string,
  args: {
    userId: string;
    orderId: string;
    productName: string;
    variantLabel: string | null;
    price: number;
    deliveryType: "code" | "topup" | "service";
  },
) {
  const label = args.variantLabel
    ? `${args.productName} (${args.variantLabel})`
    : args.productName;
  const orderReadyBodyKey =
    args.deliveryType === "topup"
      ? "srv.co.notify.topupReadyBody"
      : "srv.co.notify.codeReadyBody";
  await notify(supabase, {
    userId: args.userId,
    type: "order.completed",
    title: t("srv.co.notify.orderReadyTitle").replace("{label}", label),
    body: t(orderReadyBodyKey),
    link: "/orders?new=" + args.orderId,
    metadata: { order_id: args.orderId },
    titleKey: "srv.co.notify.orderReadyTitle",
    bodyKey: orderReadyBodyKey,
    params: { label },
  });
  await createInvoiceForOrder(supabase, {
    userId: args.userId,
    orderId: args.orderId,
    description: label,
    amount: args.price,
  });

  // Sipariş onay e-postası (Resend). Kullanıcının e-postasını çek; mail hata
  // verse bile sipariş akışını KIRMAZ (sendEmail throw etmez).
  try {
    const { data: prof } = await supabase
      .from("profiles")
      .select("email, nickname")
      .eq("id", args.userId)
      .maybeSingle();
    const email = (prof?.email as string) || "";
    if (email && !email.endsWith("@users.epinfox.com")) {
      const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://epinfox.com";
      await sendEmail({
        to: email,
        subject: `Siparişin hazır — ${label}`,
        text: `Merhaba ${prof?.nickname ?? ""},\n\n"${label}" siparişin tamamlandı. Detaylar ve teslimat bilgisi için Siparişlerim sayfasına göz at:\n${SITE_URL}/orders?new=${args.orderId}\n\nİyi oyunlar!\nEpinFox`,
        html: emailTemplate({
          heading: "Siparişin hazır! 🎉",
          bodyHtml: `Merhaba <b>${prof?.nickname ?? "oyuncu"}</b>,<br><br><b>${label}</b> siparişin tamamlandı. Teslimat detaylarını Siparişlerim sayfasından görebilirsin.`,
          cta: { label: "Siparişlerimi Gör", href: `${SITE_URL}/orders?new=${args.orderId}` },
        }),
      });
    }
  } catch (e) {
    console.error("order email failed:", e);
  }
}

/**
 * Tek ürün satın alma. Ürünün tedarik kaynağına göre iki yol:
 *  - manual : DB stoğundan, mevcut purchase_product RPC (race-safe).
 *  - mock/API : begin → provider.fulfill → complete | fail (otomatik iade).
 */
export async function purchaseProduct(
  input: z.infer<typeof schema>,
): Promise<PurchaseResult> {
  const t = await getServerT();
  const parsed = schema.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: t("srv.co.err.invalidRequest") };

  const current = await requireMember();
  const supabase = await createAdminClient();
  const qty = parsed.data.qty ?? 1;

  // Ürünün teslim/tedarik bilgisi
  const { data: variant } = await supabase
    .from("product_variants")
    .select(
      "label, supplier_service_id, supplier_quantity, products(id, name, supply_source, delivery_type)",
    )
    .eq("id", parsed.data.variantId)
    .maybeSingle();
  const product = (variant?.products ?? null) as {
    id: string;
    name: string;
    supply_source: string;
    delivery_type: "code" | "topup" | "service";
  } | null;
  if (!variant || !product)
    return { ok: false, error: t("srv.co.err.variantNotFound") };

  // ── MANUEL kaynak: mevcut race-safe RPC (yalnız code teslim) ──
  if (isManualSource(product.supply_source)) {
    const { data, error } = await supabase.rpc("purchase_product", {
      p_user_id: current.user.id,
      p_variant_id: parsed.data.variantId,
      p_enc_key: process.env.CODE_ENCRYPTION_KEY!,
    });
    if (error) {
      console.error("purchase_product error:", error.message);
      return { ok: false, error: mapError(error.message, t) };
    }
    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.order_id)
      return { ok: false, error: t("srv.co.err.orderNotCreated") };
    const orderId = row.order_id as string;

    const { data: o } = await supabase
      .from("orders")
      .select("product_name, variant_label, price, delivery_type")
      .eq("id", orderId)
      .maybeSingle();
    if (o) {
      await afterOrder(supabase, t, {
        userId: current.user.id,
        orderId,
        productName: o.product_name,
        variantLabel: o.variant_label,
        price: Number(o.price ?? 0),
        deliveryType: o.delivery_type,
      });
    }
    revalidatePath("/wallet");
    revalidatePath("/orders");
    return { ok: true, orderId };
  }

  // ── MANUEL KÖPRÜ (manual_pending): begin → BEKLET, admin elle teslim eder ──
  // Bakiye düşer, order 'processing' kalır; provider çağrılmaz. Admin'e bildirim.
  if (isManualPendingSource(product.supply_source)) {
    if (product.delivery_type === "topup" && !parsed.data.playerId) {
      return { ok: false, error: t("srv.co.err.enterPlayerId") };
    }

    const { data: pendingOrderId, error: pendingErr } = await supabase.rpc(
      "begin_supply_order",
      {
        p_user_id: current.user.id,
        p_variant_id: parsed.data.variantId,
        p_qty: qty,
        p_delivery: product.delivery_type,
        p_player_id: parsed.data.playerId ?? null,
      },
    );
    if (pendingErr || !pendingOrderId) {
      console.error("begin_supply_order (manual_pending) error:", pendingErr?.message);
      return { ok: false, error: mapError(pendingErr?.message ?? "", t) };
    }

    const label = variant.label
      ? `${product.name} (${variant.label})`
      : product.name;

    // Müşteriye "hazırlanıyor" bildirimi (kod/topup henüz teslim edilmedi).
    await notify(supabase, {
      userId: current.user.id,
      type: "system",
      title: t("srv.co.notify.preparingTitle").replace("{label}", label),
      body: t("srv.co.notify.preparingBody"),
      link: "/orders?new=" + pendingOrderId,
      metadata: { order_id: pendingOrderId },
      titleKey: "srv.co.notify.preparingTitle",
      bodyKey: "srv.co.notify.preparingBody",
      params: { label },
    });

    // Admin'lere "bekleyen teslimat" bildirimi.
    const playerSuffix =
      product.delivery_type === "topup" && parsed.data.playerId
        ? t("srv.co.notify.pendingAdminPlayer").replace(
            "{playerId}",
            parsed.data.playerId,
          )
        : "";
    await notifyAdmins(supabase, {
      type: "system",
      title: t("srv.co.notify.pendingAdminTitle"),
      body: t("srv.co.notify.pendingAdminBody").replace(
        "{label}",
        `${label}${playerSuffix}`,
      ),
      link: "/admin/pending-deliveries",
      metadata: { order_id: pendingOrderId },
      titleKey: "srv.co.notify.pendingAdminTitle",
      bodyKey: "srv.co.notify.pendingAdminBody",
      params: { label: `${label}${playerSuffix}` },
    });

    revalidatePath("/wallet");
    revalidatePath("/orders");
    revalidatePath("/admin/pending-deliveries");
    return { ok: true, orderId: pendingOrderId };
  }

  // ── SERVICE teslim (SMM — sosyal medya): ASENKRON, 'processing'te kalır ──
  // begin (bakiye düş, processing) → provider.fulfill (action=add) → order id
  // supplier_ref'e yazılır, order PROCESSING KALIR. complete BURADA çağrılmaz;
  // gerçek teslim sonra smm-sync (action=status poll) ile tamamlanır.
  if (product.delivery_type === "service") {
    const provider = getProvider(product.supply_source);
    if (!provider) {
      return { ok: false, error: t("srv.co.err.notSupplyable") };
    }
    const link = parsed.data.link?.trim();
    if (!link) {
      return { ok: false, error: t("srv.co.err.enterLink") };
    }

    // 1) Bakiye düş + order 'processing'. Hedef link player_id kolonuna yazılır.
    const { data: svcOrderId, error: svcBeginErr } = await supabase.rpc(
      "begin_supply_order",
      {
        p_user_id: current.user.id,
        p_variant_id: parsed.data.variantId,
        p_qty: qty,
        p_delivery: "service",
        p_player_id: link,
      },
    );
    if (svcBeginErr || !svcOrderId) {
      console.error("begin_supply_order (service) error:", svcBeginErr?.message);
      return { ok: false, error: mapError(svcBeginErr?.message ?? "", t) };
    }

    // SMM panele gönderilecek adet: varyant supplier_quantity × sipariş qty.
    const perPackage = Number(variant.supplier_quantity ?? 0) || 0;
    const smmQty = perPackage > 0 ? perPackage * qty : qty;

    // 2) Sağlayıcıdan sipariş aç (action=add). Teslim async.
    const result = await provider.fulfill({
      variantId: parsed.data.variantId,
      productName: product.name,
      variantLabel: variant.label as string,
      qty: smmQty,
      deliveryType: "service",
      link,
      supplierServiceId: (variant.supplier_service_id as string | null) ?? null,
    });

    // 3a) Başarısız (sipariş açılamadı) → otomatik iade.
    if (!result.ok) {
      await supabase.rpc("fail_supply_order", {
        p_order_id: svcOrderId,
        p_error: result.error,
        p_supplier_ref: result.supplierRef ?? null,
      });
      await notify(supabase, {
        userId: current.user.id,
        type: "order.refunded",
        title: t("srv.co.notify.startFailedTitle"),
        body: t("srv.co.notify.refundBody")
          .replace("{name}", product.name)
          .replace("{error}", result.error),
        link: "/orders",
        titleKey: "srv.co.notify.startFailedTitle",
        bodyKey: "srv.co.notify.refundBody",
        params: { name: product.name, error: result.error },
      });
      revalidatePath("/wallet");
      revalidatePath("/orders");
      return {
        ok: false,
        error: result.error + " " + t("srv.co.err.refunded"),
      };
    }

    // 3b) Sipariş açıldı → supplier_ref yaz, order PROCESSING KALIR.
    // complete_supply_order BURADA çağrılmaz (teslim async; smm-sync tamamlar).
    await supabase
      .from("orders")
      .update({
        supplier_ref: result.supplierRef ?? null,
        delivered_note: t("srv.co.order.deliveringNote"),
      })
      .eq("id", svcOrderId);

    await notify(supabase, {
      userId: current.user.id,
      type: "system",
      title: t("srv.co.notify.processingTitle").replace("{name}", product.name),
      body: t("srv.co.notify.processingBody"),
      link: "/orders?new=" + svcOrderId,
      metadata: { order_id: svcOrderId },
      titleKey: "srv.co.notify.processingTitle",
      bodyKey: "srv.co.notify.processingBody",
      params: { name: product.name },
    });

    revalidatePath("/wallet");
    revalidatePath("/orders");
    return { ok: true, orderId: svcOrderId as string };
  }

  // ── API-tipi kaynak (mock + gerçek): begin → fulfill → complete/fail ──
  const provider = getProvider(product.supply_source);
  if (!provider) {
    return { ok: false, error: t("srv.co.err.notSupplyable") };
  }
  if (product.delivery_type === "topup" && !parsed.data.playerId) {
    return { ok: false, error: t("srv.co.err.enterPlayerId") };
  }

  // 1) Bakiye düş + order 'processing'
  const { data: orderId, error: beginErr } = await supabase.rpc(
    "begin_supply_order",
    {
      p_user_id: current.user.id,
      p_variant_id: parsed.data.variantId,
      p_qty: qty,
      p_delivery: product.delivery_type,
      p_player_id: parsed.data.playerId ?? null,
    },
  );
  if (beginErr || !orderId) {
    console.error("begin_supply_order error:", beginErr?.message);
    return { ok: false, error: mapError(beginErr?.message ?? "", t) };
  }

  // 2) Sağlayıcıdan teslim
  const result = await provider.fulfill({
    variantId: parsed.data.variantId,
    productName: product.name,
    variantLabel: variant.label as string,
    qty,
    deliveryType: product.delivery_type,
    playerId: parsed.data.playerId ?? null,
  });

  // 3a) Başarısız → otomatik iade
  if (!result.ok) {
    await supabase.rpc("fail_supply_order", {
      p_order_id: orderId,
      p_error: result.error,
      p_supplier_ref: result.supplierRef ?? null,
    });
    await notify(supabase, {
      userId: current.user.id,
      type: "order.refunded",
      title: t("srv.co.notify.failedTitle"),
      body: t("srv.co.notify.refundBody")
        .replace("{name}", product.name)
        .replace("{error}", result.error),
      link: "/orders",
      titleKey: "srv.co.notify.failedTitle",
      bodyKey: "srv.co.notify.refundBody",
      params: { name: product.name, error: result.error },
    });
    revalidatePath("/wallet");
    revalidatePath("/orders");
    return {
      ok: false,
      error: result.error + " " + t("srv.co.err.refunded"),
    };
  }

  // 3b) Başarılı → tamamla (kod/topup)
  const { error: completeErr } = await supabase.rpc("complete_supply_order", {
    p_order_id: orderId,
    p_codes: result.codes ?? null,
    p_note: result.note ?? null,
    p_supplier_ref: result.supplierRef ?? null,
    p_enc_key: process.env.CODE_ENCRYPTION_KEY!,
  });
  if (completeErr) {
    // Teslim alındı ama DB yazımı patladı — iade et, logla (nadir).
    console.error("complete_supply_order error:", completeErr.message);
    await supabase.rpc("fail_supply_order", {
      p_order_id: orderId,
      p_error: "complete failed: " + completeErr.message,
      p_supplier_ref: result.supplierRef ?? null,
    });
    revalidatePath("/wallet");
    revalidatePath("/orders");
    return { ok: false, error: t("srv.co.err.deliveryNotSaved") };
  }

  const { data: o } = await supabase
    .from("orders")
    .select("product_name, variant_label, price, delivery_type")
    .eq("id", orderId)
    .maybeSingle();
  if (o) {
    await afterOrder(supabase, t, {
      userId: current.user.id,
      orderId,
      productName: o.product_name,
      variantLabel: o.variant_label,
      price: Number(o.price ?? 0),
      deliveryType: o.delivery_type,
    });
  }
  revalidatePath("/wallet");
  revalidatePath("/orders");
  return { ok: true, orderId };
}

// ─── Sepet ile çoklu satın alma ──────────────────────────────────────────────
// NOT: Sepet akışı yalnız MANUEL (code teslim) ürünler içindir. API-tipi/topup
// ürünler sepete eklenmez (UI'da "Hemen Al" zorunlu) — tek-tek tedarik gerekir.

const cartSchema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.string().uuid(),
        qty: z.number().int().min(1).max(20),
      }),
    )
    .min(1)
    .max(50),
});

export type CartPurchaseResult =
  | { ok: true; orderCount: number }
  | { ok: false; error: string };

export async function purchaseCart(
  input: z.infer<typeof cartSchema>,
): Promise<CartPurchaseResult> {
  const t = await getServerT();
  const parsed = cartSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: t("srv.co.err.invalidCart") };

  const current = await requireMember();
  const supabase = await createAdminClient();

  const { data, error } = await supabase.rpc("purchase_cart", {
    p_user_id: current.user.id,
    p_items: parsed.data.items.map((i) => ({
      variant_id: i.variantId,
      qty: i.qty,
    })),
    p_enc_key: process.env.CODE_ENCRYPTION_KEY!,
  });

  if (error) {
    console.error("purchase_cart error:", error.message);
    return { ok: false, error: mapError(error.message, t) };
  }

  const rows = (data as unknown[]) ?? [];

  const cartMulti = rows.length > 1;
  await notify(supabase, {
    userId: current.user.id,
    type: "order.completed",
    title: cartMulti
      ? t("srv.co.notify.cartReadyTitleMulti").replace(
          "{count}",
          String(rows.length),
        )
      : t("srv.co.notify.cartReadyTitleSingle"),
    body: t("srv.co.notify.cartReadyBody"),
    link: "/orders",
    metadata: { order_count: rows.length },
    titleKey: cartMulti
      ? "srv.co.notify.cartReadyTitleMulti"
      : "srv.co.notify.cartReadyTitleSingle",
    bodyKey: "srv.co.notify.cartReadyBody",
    params: cartMulti ? { count: String(rows.length) } : undefined,
  });

  revalidatePath("/wallet");
  revalidatePath("/orders");
  return { ok: true, orderCount: rows.length };
}

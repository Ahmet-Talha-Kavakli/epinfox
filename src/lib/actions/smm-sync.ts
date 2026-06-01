"use server";

// SMM durum senkronizasyonu (poll). SMM teslim ASENKRONdur: checkout sadece
// siparişi açar (action=add) ve order'ı 'processing'te bırakır. Gerçek teslim
// burada izlenir: 'processing' + supply_source=smm + supplier_ref dolu siparişler
// için action=status çağrılır:
//   Completed              → complete_supply_order (delivered_note='Teslim edildi')
//   Canceled/Partial/Fail  → fail_supply_order (bakiye iade)
//   Pending/In progress/…  → dokunma, sonra tekrar poll edilir
//
// Tetikleme: admin "Durumları Senkronla" butonu (server action) VEYA
// /api/cron/smm-sync route'u (gerçek cron sonra kurulur). İkisi de bu fonksiyonu
// çağırır.

import { createAdminClient } from "@/lib/supabase/server";
import { notify } from "@/lib/notifications";
import {
  smmStatus,
  isSmmCompleted,
  isSmmFailed,
} from "@/lib/supply/providers/smm";

export interface SmmSyncResult {
  checked: number;
  completed: number;
  failed: number;
  stillPending: number;
  errors: number;
}

/**
 * processing durumundaki tüm SMM siparişlerini panelden sorgular ve uygun
 * şekilde tamamlar/iade eder. Admin butonu ve cron route bunu çağırır.
 * NOT: auth caller'da yapılır (admin action / cron secret).
 */
export async function pollSmmOrders(limit = 100): Promise<SmmSyncResult> {
  const supabase = await createAdminClient();
  const result: SmmSyncResult = {
    checked: 0,
    completed: 0,
    failed: 0,
    stillPending: 0,
    errors: 0,
  };

  // İşlenmekte olan SMM siparişleri (supplier_ref = SMM order id).
  // supply_source ürün üzerinde; orders→products join ile filtrele.
  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, user_id, product_name, supplier_ref, products!inner(supply_source)")
    .eq("status", "processing")
    .eq("delivery_type", "service")
    .eq("products.supply_source", "smm")
    .not("supplier_ref", "is", null)
    .limit(limit);

  if (error) {
    console.error("pollSmmOrders query error:", error.message);
    return result;
  }

  for (const o of orders ?? []) {
    const supplierRef = (o.supplier_ref as string | null)?.trim();
    if (!supplierRef) continue;
    result.checked++;

    const st = await smmStatus(supplierRef);
    if (!st.ok) {
      result.errors++;
      // Durum alınamadı → siparişe dokunma, log bırak.
      await supabase.from("supplier_logs").insert({
        order_id: o.id,
        source: "smm",
        qty: 1,
        status: "failed",
        supplier_ref: supplierRef,
        error: "status poll: " + st.error,
      });
      continue;
    }

    const status = st.status.status;

    if (isSmmCompleted(status)) {
      // Teslim tamamlandı → order completed (kod yok; not yaz).
      const note =
        "Teslim edildi" +
        (st.status.start_count ? ` · başlangıç: ${st.status.start_count}` : "");
      const { error: cErr } = await supabase.rpc("complete_supply_order", {
        p_order_id: o.id,
        p_codes: null,
        p_note: note,
        p_supplier_ref: supplierRef,
        p_enc_key: process.env.CODE_ENCRYPTION_KEY!,
      });
      if (cErr) {
        result.errors++;
        console.error("complete_supply_order (smm) error:", cErr.message);
        continue;
      }
      result.completed++;
      await notify(supabase, {
        userId: o.user_id as string,
        type: "order.completed",
        title: `${o.product_name} siparişin tamamlandı`,
        body: "Sosyal medya siparişin teslim edildi.",
        link: "/orders?new=" + o.id,
        metadata: { order_id: o.id },
      });
    } else if (isSmmFailed(status)) {
      // İptal/başarısız → bakiye iade.
      const { error: fErr } = await supabase.rpc("fail_supply_order", {
        p_order_id: o.id,
        p_error: `SMM durumu: ${status ?? "Canceled"}`,
        p_supplier_ref: supplierRef,
      });
      if (fErr) {
        result.errors++;
        console.error("fail_supply_order (smm) error:", fErr.message);
        continue;
      }
      result.failed++;
      await notify(supabase, {
        userId: o.user_id as string,
        type: "order.refunded",
        title: "Sipariş tamamlanamadı",
        body: `${o.product_name}: sağlayıcı siparişi iptal etti. Tutar bakiyene iade edildi.`,
        link: "/orders",
        metadata: { order_id: o.id },
      });
    } else {
      // Pending / In progress / Processing / Partial → devam ediyor.
      result.stillPending++;
      // İlerleme notunu güncelle (remains kalan adet).
      if (st.status.remains != null) {
        await supabase
          .from("orders")
          .update({
            delivered_note: `Teslim ediliyor · kalan: ${st.status.remains}`,
          })
          .eq("id", o.id);
      }
    }
  }

  return result;
}

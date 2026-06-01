// Hesap merkezi server helper'ları: fatura, destek, referans okuma + üretim.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Invoice, SupportTicket } from "@/lib/supabase/types";

/**
 * Sipariş için fatura kaydı üretir (yıl bazlı sıra numarası). Hata fırlatmaz —
 * fatura opsiyoneldir, satın alma akışını kırmamalı.
 */
export async function createInvoiceForOrder(
  supabase: SupabaseClient,
  args: {
    userId: string;
    orderId: string;
    description: string;
    amount: number;
  },
): Promise<void> {
  try {
    const year = new Date().getFullYear();
    // Bu yılın en yüksek sıra numarası
    const { data: last } = await supabase
      .from("invoices")
      .select("number")
      .like("number", `EF-${year}-%`)
      .order("number", { ascending: false })
      .limit(1)
      .maybeSingle();
    let seq = 1;
    if (last?.number) {
      const m = (last.number as string).match(/EF-\d{4}-(\d+)/);
      if (m) seq = parseInt(m[1], 10) + 1;
    }
    const number = `EF-${year}-${String(seq).padStart(6, "0")}`;
    const { error } = await supabase.from("invoices").insert({
      user_id: args.userId,
      order_id: args.orderId,
      number,
      description: args.description,
      amount: args.amount,
      status: "paid",
    });
    if (error) console.error("createInvoice failed:", error.message);
  } catch (err) {
    console.error("createInvoice exception:", err);
  }
}

export async function getMyInvoices(
  supabase: SupabaseClient,
  userId: string,
  limit = 100,
): Promise<Invoice[]> {
  const { data } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as Invoice[]) ?? [];
}

export async function getMyTickets(
  supabase: SupabaseClient,
  userId: string,
): Promise<SupportTicket[]> {
  const { data } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  return (data as SupportTicket[]) ?? [];
}

// Bildirim yardımcıları — server action'larda insert + okuma.
// FairPlay deseninden uyarlandı: hatalar sessizce yutulur, çünkü bildirim
// opsiyoneldir ve asıl akışı (satın alma, top-up) kırmamalıdır.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Notification, NotificationType } from "@/lib/supabase/types";

export interface NewNotification {
  userId: string;
  type: NotificationType;
  /** TR snapshot (fallback). Yeni bildirimlerde titleKey de verilmeli. */
  title: string;
  body?: string | null;
  link?: string | null;
  metadata?: Record<string, unknown>;
  /** Dil-bağımsız çeviri anahtarı (render anında okuyanın diline çevrilir). */
  titleKey?: string;
  bodyKey?: string;
  /** Anahtar içindeki {x} parçaları için değerler. */
  params?: Record<string, string>;
}

/** Tek kullanıcıya bildirim oluşturur. Hata fırlatmaz; loglar. */
export async function notify(
  supabase: SupabaseClient,
  n: NewNotification,
): Promise<void> {
  try {
    const { error } = await supabase.from("notifications").insert({
      user_id: n.userId,
      type: n.type,
      title: n.title,
      body: n.body ?? null,
      link: n.link ?? null,
      metadata: n.metadata ?? {},
      title_key: n.titleKey ?? null,
      body_key: n.bodyKey ?? null,
      i18n_params: n.params ?? {},
    });
    if (error) console.error("notify failed:", error.message);
  } catch (err) {
    console.error("notify exception:", err);
  }
}

/**
 * Tüm admin/owner kullanıcılara aynı bildirimi yollar.
 * Manuel köprü (manual_pending) gibi admin müdahalesi gereken akışlarda kullanılır.
 * Hata fırlatmaz; loglar.
 */
export async function notifyAdmins(
  supabase: SupabaseClient,
  n: Omit<NewNotification, "userId">,
): Promise<void> {
  try {
    const { data: admins } = await supabase
      .from("profiles")
      .select("id")
      .in("role", ["owner", "admin"]);
    const rows = ((admins as { id: string }[]) ?? []).map((a) => ({
      user_id: a.id,
      type: n.type,
      title: n.title,
      body: n.body ?? null,
      link: n.link ?? null,
      metadata: n.metadata ?? {},
      title_key: n.titleKey ?? null,
      body_key: n.bodyKey ?? null,
      i18n_params: n.params ?? {},
    }));
    if (rows.length === 0) return;
    const { error } = await supabase.from("notifications").insert(rows);
    if (error) console.error("notifyAdmins failed:", error.message);
  } catch (err) {
    console.error("notifyAdmins exception:", err);
  }
}

export async function getUnreadCount(
  supabase: SupabaseClient,
  userId: string,
): Promise<number> {
  try {
    const { count } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .is("read_at", null);
    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function getRecentNotifications(
  supabase: SupabaseClient,
  userId: string,
  limit = 10,
): Promise<Notification[]> {
  try {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data ?? []) as Notification[];
  } catch {
    return [];
  }
}

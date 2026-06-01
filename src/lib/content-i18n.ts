import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { getServerLocale } from "@/lib/i18n/server";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";

/**
 * DB içerik çeviri overlay'i. Sorgular ham TR satırı çeker; bu helper hedef
 * locale'in content_translations payload'unu TR alanların üzerine biner.
 * Çeviri yoksa TR fallback (alan değişmez). tr locale'inde hiç sorgu yapılmaz.
 *
 * Kullanım (server-side):
 *   const locale = await getContentLocale();
 *   await overlay("product", products, locale);   // products mutasyona uğramaz, yeni dizi döner
 */

export type EntityType = "product" | "category" | "brand" | "variant" | "promo";

/** Server component'lerde aktif locale (cookie). store.ts bunu next/headers
 *  import etmeden çağırabilsin diye burada (server-only modül). */
export async function getContentLocale(): Promise<Locale> {
  return getServerLocale();
}

/**
 * Verilen satırlara (id taşıyan herhangi bir nesne) o entity_type + locale için
 * çevirileri biner. payload içindeki her alan, satırdaki aynı isimli alanın
 * üzerine yazılır (sadece dolu/boş-olmayan değerler). Yeni dizi döner.
 */
export async function overlayTranslations<T extends { id: string | number }>(
  entityType: EntityType,
  rows: T[],
  locale: Locale,
): Promise<T[]> {
  if (locale === DEFAULT_LOCALE || rows.length === 0) return rows;

  const ids = rows.map((r) => String(r.id));
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("content_translations")
    .select("entity_id, payload")
    .eq("entity_type", entityType)
    .eq("locale", locale)
    .in("entity_id", ids);

  if (!data || data.length === 0) return rows;

  const byId = new Map<string, Record<string, unknown>>();
  for (const row of data as { entity_id: string; payload: Record<string, unknown> }[]) {
    byId.set(row.entity_id, row.payload ?? {});
  }

  return rows.map((r) => {
    const tr = byId.get(String(r.id));
    if (!tr) return r;
    const merged: Record<string, unknown> = { ...r };
    for (const [k, v] of Object.entries(tr)) {
      // Boş/yok değerler TR'yi ezmesin (kısmi çeviri güvenli)
      if (v == null) continue;
      if (typeof v === "string" && v.trim() === "") continue;
      if (Array.isArray(v) && v.length === 0) continue;
      merged[k] = v;
    }
    return merged as T;
  });
}

/**
 * Sipariş/işlem satırlarındaki TR snapshot ürün+varyant adlarını hedef locale'e
 * çevirir. overlayTranslations'tan farkı: satırın kendi id'si değil, taşıdığı
 * product_id/variant_id ile content_translations eşleştirilir (snapshot alanlar
 * order'a kalıcı yazıldığından entity id'leri ayrıdır).
 *
 * - locale === tr veya rows boş → rows aynen döner.
 * - product çevirisi varsa product_name = payload.name.
 * - variant çevirisi varsa variant_label = payload.label.
 * - Çeviri yoksa TR snapshot korunur. Yeni dizi döner (mutasyon yok).
 */
export async function localizeOrderItems<
  T extends {
    product_id: string | null;
    product_name: string;
    variant_id: string | null;
    variant_label: string | null;
  },
>(rows: T[], locale: Locale): Promise<T[]> {
  if (locale === DEFAULT_LOCALE || rows.length === 0) return rows;

  const productIds = new Set<string>();
  const variantIds = new Set<string>();
  for (const r of rows) {
    if (r.product_id) productIds.add(r.product_id);
    if (r.variant_id) variantIds.add(r.variant_id);
  }
  if (productIds.size === 0 && variantIds.size === 0) return rows;

  const ids = [...productIds, ...variantIds];
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("content_translations")
    .select("entity_type, entity_id, payload")
    .in("entity_type", ["product", "variant"])
    .eq("locale", locale)
    .in("entity_id", ids);

  if (!data || data.length === 0) return rows;

  const productNames = new Map<string, string>();
  const variantLabels = new Map<string, string>();
  for (const row of data as {
    entity_type: string;
    entity_id: string;
    payload: Record<string, unknown> | null;
  }[]) {
    const payload = row.payload ?? {};
    if (row.entity_type === "product") {
      const name = payload.name;
      if (typeof name === "string" && name.trim() !== "") {
        productNames.set(row.entity_id, name);
      }
    } else if (row.entity_type === "variant") {
      const label = payload.label;
      if (typeof label === "string" && label.trim() !== "") {
        variantLabels.set(row.entity_id, label);
      }
    }
  }

  return rows.map((r) => {
    const name = r.product_id ? productNames.get(r.product_id) : undefined;
    const label = r.variant_id ? variantLabels.get(r.variant_id) : undefined;
    if (name === undefined && label === undefined) return r;
    return {
      ...r,
      ...(name !== undefined ? { product_name: name } : {}),
      ...(label !== undefined ? { variant_label: label } : {}),
    };
  });
}

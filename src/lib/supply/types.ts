// Tedarik (supply) sağlayıcı arayüzü — sağlayıcı-bağımsız.
// Checkout bu arayüzü çağırır; hangi sağlayıcının çalıştığını bilmez.
// Yeni gerçek sağlayıcı eklemek = bu arayüzü uygulayan bir dosya yazmak.

import type { DeliveryType } from "@/lib/supabase/types";

/** Bir teslim talebinin bağlamı (provider'a verilir). */
export interface FulfillContext {
  variantId: string;
  productName: string;
  variantLabel: string | null;
  qty: number;
  deliveryType: DeliveryType;
  /** topup teslimde oyuncu ID/UID (code teslimde null). */
  playerId?: string | null;
  /** service (SMM) teslimde hedef profil/video linki — action=add için zorunlu. */
  link?: string | null;
  /** service (SMM) teslimde varyanta eşlenen panel servis id'si. */
  supplierServiceId?: string | null;
}

/** Tek bir teslim sonucu. */
export type FulfillResult =
  | {
      ok: true;
      /** code teslim: teslim edilen düz kodlar (qty kadar). */
      codes?: string[];
      /** topup teslim: teslim açıklaması (örn. "5000 UC oyuncu 12345'e yüklendi"). */
      note?: string | null;
      /** sağlayıcı sipariş referansı (denetim/iade için). */
      supplierRef?: string | null;
    }
  | { ok: false; error: string; supplierRef?: string | null };

/** Tüm sağlayıcıların uyguladığı arayüz. */
export interface SupplyProvider {
  /** Kaynak adı: 'manual' | 'mock' | 'mtcgame' ... (products.supply_source ile eşleşir). */
  readonly source: string;
  /**
   * Teslimi gerçekleştirir. code teslimde kod(lar) döndürür, topup'ta note.
   * Hata fırlatmaz; { ok:false } döndürür (checkout iadeyi yönetir).
   */
  fulfill(ctx: FulfillContext): Promise<FulfillResult>;
}

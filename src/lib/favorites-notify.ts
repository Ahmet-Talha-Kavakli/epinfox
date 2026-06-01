// Favori ürün değişim bildirimleri.
//
// Admin bir ürünü güncellediğinde (fiyat / stok durumu), o ürünü favorileyen
// kullanıcılara hem in-app bildirim (notify) hem de e-posta (sendEmail) gönderir.
// Hata akışı KIRMAZ — tümü Promise.allSettled ile, sessizce loglar.

import type { SupabaseClient } from "@supabase/supabase-js";
import { notify } from "@/lib/notifications";
import { sendEmail } from "@/lib/email";
import { getServerT } from "@/lib/i18n/server";

interface FavoriterRow {
  user_id: string;
  profiles: {
    email: string | null;
    nickname: string | null;
    marketing_opt_in: boolean;
  } | null;
}

/** TL biçimlendir (server tarafı; Price bileşeninden bağımsız basit format). */
function tl(n: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(n);
}

/**
 * Bir ürünü favorileyen kullanıcıları çeker (e-posta + opt-in bilgisiyle).
 */
async function getFavoriters(
  supabase: SupabaseClient,
  productId: string,
): Promise<FavoriterRow[]> {
  const { data } = await supabase
    .from("product_favorites")
    .select("user_id, profiles(email, nickname, marketing_opt_in)")
    .eq("product_id", productId);
  return (data as FavoriterRow[] | null) ?? [];
}

interface ProductChange {
  productId: string;
  productName: string;
  productSlug: string;
  /** Fiyat değişimi (varsa). */
  price?: { old: number; next: number };
  /** Stok tekrar açıldı mı (false→true veya 0→pozitif). */
  backInStock?: boolean;
}

/**
 * Favori ürün değişimini ilgili kullanıcılara bildirir.
 * - Fiyat düştüyse "fiyat düştü 🎉", arttıysa "fiyat güncellendi" tonu.
 * - Stok tekrar açıldıysa "tekrar stokta" tonu.
 * - In-app bildirim herkese; e-posta yalnızca geçerli adresi + marketing_opt_in
 *   açık olan kullanıcılara.
 * Hata fırlatmaz.
 */
export async function notifyFavoriteChange(
  supabase: SupabaseClient,
  change: ProductChange,
): Promise<void> {
  try {
    const favoriters = await getFavoriters(supabase, change.productId);
    if (favoriters.length === 0) return;

    const t = await getServerT();
    const link = `/product/${change.productSlug}`;

    // In-app bildirim başlık + gövdesi (kullanıcının diline çevrilir).
    // NOT: E-posta metinleri (emailSubject/emailIntro) ayrı i18n meselesi —
    // alıcı bazında dil seçimi gerektiğinden şimdilik TR bırakıldı.
    let title: string;
    let body: string;
    let titleKey: string;
    let bodyKey: string;
    let params: Record<string, string>;
    let emailSubject: string;
    let emailIntro: string;

    if (change.price) {
      const dropped = change.price.next < change.price.old;
      params = {
        name: change.productName,
        next: tl(change.price.next),
        old: tl(change.price.old),
      };
      if (dropped) {
        titleKey = "srv.fn.priceDropTitle";
        bodyKey = "srv.fn.priceDropBody";
        title = t("srv.fn.priceDropTitle");
        body = t("srv.fn.priceDropBody")
          .replace("{name}", change.productName)
          .replace("{next}", tl(change.price.next))
          .replace("{old}", tl(change.price.old));
        emailSubject = `🎉 ${change.productName} fiyatı düştü!`;
        emailIntro = `Favorilerindeki ${change.productName} ürününün fiyatı düştü: ${tl(
          change.price.old,
        )} → ${tl(change.price.next)}.`;
      } else {
        titleKey = "srv.fn.priceUpTitle";
        bodyKey = "srv.fn.priceUpBody";
        title = t("srv.fn.priceUpTitle");
        body = t("srv.fn.priceUpBody")
          .replace("{name}", change.productName)
          .replace("{next}", tl(change.price.next))
          .replace("{old}", tl(change.price.old));
        emailSubject = `${change.productName} fiyatı güncellendi`;
        emailIntro = `Favorilerindeki ${change.productName} ürününün fiyatı güncellendi: ${tl(
          change.price.old,
        )} → ${tl(change.price.next)}.`;
      }
    } else if (change.backInStock) {
      titleKey = "srv.fn.backInStockTitle";
      bodyKey = "srv.fn.backInStockBody";
      params = { name: change.productName };
      title = t("srv.fn.backInStockTitle");
      body = t("srv.fn.backInStockBody").replace("{name}", change.productName);
      emailSubject = `${change.productName} tekrar stokta!`;
      emailIntro = `Favorilerindeki ${change.productName} ürünü yeniden satışta. Stoklar tükenmeden göz atabilirsin.`;
    } else {
      return; // bildirilecek bir değişim yok
    }

    const url = `https://goosecage.com${link}`;
    const text = `${emailIntro}\n\nÜrüne git: ${url}\n\nBu e-postayı favorilerine eklediğin için alıyorsun.\n— EpinFox`;
    const html = `<div style="font-family:system-ui,sans-serif;max-width:480px">
  <p>${emailIntro}</p>
  <p><a href="${url}" style="display:inline-block;background:#f97316;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600">Ürüne git</a></p>
  <p style="color:#64748b;font-size:12px">Bu e-postayı favorilerine eklediğin için alıyorsun. — EpinFox</p>
</div>`;

    const tasks: Promise<unknown>[] = [];
    for (const f of favoriters) {
      // In-app bildirim — herkese.
      tasks.push(
        notify(supabase, {
          userId: f.user_id,
          type: "favorite",
          title,
          body,
          link,
          metadata: { productId: change.productId },
          titleKey,
          bodyKey,
          params,
        }),
      );

      // E-posta — yalnız geçerli adres + pazarlama izni açık olanlara.
      const email = f.profiles?.email;
      const optIn = f.profiles?.marketing_opt_in ?? false;
      if (email && optIn) {
        tasks.push(sendEmail({ to: email, subject: emailSubject, text, html }));
      }
    }

    await Promise.allSettled(tasks);
  } catch (err) {
    console.error("notifyFavoriteChange failed:", err);
  }
}

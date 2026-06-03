"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireMember } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/server";
import { bonusFor } from "@/lib/wallet-bonus";
import { notify } from "@/lib/notifications";
import { getServerT } from "@/lib/i18n/server";
import { getContentLocale, localizeOrderItems } from "@/lib/content-i18n";
import { formatTL } from "@/lib/format";
import { paymentMethodLabel } from "@/lib/payment-methods";
import { STORE_LOCKED } from "@/config/site";
import type { WalletTransaction } from "@/lib/supabase/types";

const topUpSchema = z.object({
  amount: z.number().positive().min(10).max(5000),
  method: z.string().trim().min(1).max(40).optional(),
});

export type TopUpResult =
  | { ok: true; balance: number; bonus: number }
  | { ok: false; error: string };

/**
 * MOCK bakiye yükleme + kademeli bonus. Faz 2'de bu action kaldırılıp yerine
 * PayTR callback route'u wallet_topup RPC'sini çağıracak (bonus mantığı korunur).
 */
export async function topUpBalance(
  input: z.infer<typeof topUpSchema>,
): Promise<TopUpResult> {
  const t = await getServerT();
  // Mağaza kilidi (gerçek ödeme yok) — sahte bakiye yüklemeyi engelle.
  if (STORE_LOCKED) return { ok: false, error: t("srv.co.err.storeLocked") };
  const parsed = topUpSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: t("srv.wa.err.amountRange") };
  }

  const current = await requireMember();
  const supabase = await createAdminClient();
  const { bonus } = bonusFor(parsed.data.amount);
  const total = parsed.data.amount + bonus;

  // Seçilen ödeme yöntemi payment_ref'e kalıcı yazılır (hareketlerde gösterilir).
  const paymentRef = parsed.data.method ?? "mock";

  const { data, error } = await supabase.rpc("wallet_topup", {
    p_user_id: current.user.id,
    p_amount: total,
    p_payment_ref: paymentRef,
  });

  if (error) {
    console.error("wallet_topup error:", error.message);
    return { ok: false, error: t("srv.wa.err.topupGeneric") };
  }

  // Yöntem etiketi (varsa) bildirim gövdesine eklenir.
  const methodText =
    paymentRef !== "mock"
      ? t("srv.pay.withLabel").replace("{label}", paymentMethodLabel(paymentRef, t))
      : "";
  const bonusText =
    bonus > 0
      ? t("srv.wa.notify.topupBonusText")
          .replace("{amount}", formatTL(parsed.data.amount))
          .replace("{bonus}", formatTL(bonus))
      : "";

  await notify(supabase, {
    userId: current.user.id,
    type: "wallet.topup",
    title: t("srv.wa.notify.topupTitle").replace("{total}", formatTL(total)),
    body: t("srv.wa.notify.topupBody")
      .replace("{methodText}", methodText)
      .replace("{bonusText}", bonusText)
      .replace("{balance}", formatTL(Number(data))),
    link: "/wallet",
    metadata: {
      amount: parsed.data.amount,
      bonus,
      balance: Number(data),
      method: paymentRef,
    },
    titleKey: "srv.wa.notify.topupTitle",
    bodyKey: "srv.wa.notify.topupBody",
    params: {
      total: formatTL(total),
      methodText,
      bonusText,
      balance: formatTL(Number(data)),
    },
  });

  // Referans ödülü — davet edilen kullanıcının İLK yüklemesiyse iki tarafa bonus.
  await maybeGrantReferralReward(supabase, current.user.id);

  revalidatePath("/wallet");
  return { ok: true, balance: Number(data), bonus };
}

/** Cüzdan işlemi + (varsa) ilişkili siparişin ürün adı. */
export type WalletTransactionWithOrder = WalletTransaction & {
  product_name: string | null;
};

/** Kullanıcının cüzdan işlem geçmişi (ilişkili sipariş ürün adıyla). */
export async function getWalletTransactions(
  userId: string,
  limit = 30,
): Promise<WalletTransactionWithOrder[]> {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("wallet_transactions")
    .select("*, orders(product_id, product_name, variant_id, variant_label)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  type Row = WalletTransaction & {
    orders: {
      product_id: string | null;
      product_name: string | null;
      variant_id: string | null;
      variant_label: string | null;
    } | null;
  };

  // İşlemin ilişkili sipariş ürün adı (snapshot) — alıcının diline çevrilir.
  // localizeOrderItems için ürün satırı şekline indirgeyip locale overlay yapıp
  // sadece product_name'i geri yazarız (işlem listesinde sadece o gösteriliyor).
  const rows = (data as Row[]) ?? [];
  const localized = await localizeOrderItems(
    rows.map((r) => ({
      product_id: r.orders?.product_id ?? null,
      product_name: r.orders?.product_name ?? "",
      variant_id: r.orders?.variant_id ?? null,
      variant_label: r.orders?.variant_label ?? null,
    })),
    await getContentLocale(),
  );

  return rows.map(({ orders, ...txn }, i) => ({
    ...txn,
    product_name: orders?.product_name ? localized[i].product_name : null,
  }));
}

/**
 * Davet edilen kullanıcı ilk yüklemesini yaptığında referans ödülünü tetikler.
 * RPC idempotent: zaten ödüllendiyse no-op döner. Ödül verildiyse iki tarafa
 * bildirim gönderilir. Hata fırlatmaz — top-up akışını kırmamalı.
 */
async function maybeGrantReferralReward(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  userId: string,
): Promise<void> {
  try {
    const t = await getServerT();
    // Pending referans kaydı var mı?
    const { data: ref } = await supabase
      .from("referrals")
      .select("referrer_id, status")
      .eq("referred_id", userId)
      .maybeSingle();
    if (!ref || ref.status !== "pending") return;

    const { data: granted, error } = await supabase.rpc(
      "grant_referral_reward",
      { p_referred_id: userId },
    );
    if (error || granted !== true) {
      if (error) console.error("grant_referral_reward error:", error.message);
      return;
    }

    // İki tarafa bildirim
    await notify(supabase, {
      userId: ref.referrer_id,
      type: "promo",
      title: t("srv.wa.notify.referralTitle"),
      body: t("srv.wa.notify.referralBody"),
      link: "/referral",
      titleKey: "srv.wa.notify.referralTitle",
      bodyKey: "srv.wa.notify.referralBody",
    });
    await notify(supabase, {
      userId,
      type: "promo",
      title: t("srv.wa.notify.welcomeTitle"),
      body: t("srv.wa.notify.welcomeBody"),
      link: "/wallet",
      titleKey: "srv.wa.notify.welcomeTitle",
      bodyKey: "srv.wa.notify.welcomeBody",
    });

    // Davet eden yeni bir davet kademesine ulaştıysa ekstra bonus ver (idempotent).
    try {
      const { data: milestoneBonus } = await supabase.rpc(
        "grant_referral_milestones",
        { p_referrer_id: ref.referrer_id },
      );
      const extra = Number(milestoneBonus ?? 0);
      if (extra > 0) {
        await notify(supabase, {
          userId: ref.referrer_id,
          type: "promo",
          title: t("srv.wa.notify.milestoneTitle"),
          body: t("srv.wa.notify.milestoneBody").replace(
            "{extra}",
            extra.toLocaleString("tr-TR"),
          ),
          link: "/referral",
          titleKey: "srv.wa.notify.milestoneTitle",
          bodyKey: "srv.wa.notify.milestoneBody",
          params: { extra: extra.toLocaleString("tr-TR") },
        });
      }
    } catch (e) {
      console.error("grant_referral_milestones error:", e);
    }
  } catch (err) {
    console.error("maybeGrantReferralReward exception:", err);
  }
}

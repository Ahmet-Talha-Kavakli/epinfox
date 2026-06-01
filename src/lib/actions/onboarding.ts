import "server-only";
import { getServerT } from "@/lib/i18n/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";

export interface OnboardingStep {
  key: string;
  title: string;
  description: string;
  href: string;
  icon: string; // phosphor ikon adı (widget'ta eşlenir)
  done: boolean;
}

export interface OnboardingProgress {
  steps: OnboardingStep[];
  doneCount: number;
  total: number;
  /** Tüm adımlar tamam mı? */
  complete: boolean;
}

/**
 * Kullanıcının gerçek hesap durumuna göre onboarding ilerlemesini hesaplar.
 * Her adımın "done" değeri canlı DB sinyallerinden gelir — kullanıcı işlemi
 * yapınca bir sonraki ziyarette otomatik işaretli görünür.
 *
 *  1) profil  → avatar yüklendi mi
 *  2) bakiye  → en az bir topup işlemi var mı
 *  3) sipariş → en az bir sipariş var mı
 *  4) davet   → en az bir kişiyi davet etti mi (referrals.referrer_id)
 */
export async function getOnboardingProgress(
  profile: Pick<Profile, "id" | "avatar_path">,
): Promise<OnboardingProgress> {
  const t = await getServerT();
  const supabase = await createAdminClient();
  const userId = profile.id;

  const [topup, order, referral] = await Promise.all([
    supabase
      .from("wallet_transactions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("type", "topup"),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("referrals")
      .select("id", { count: "exact", head: true })
      .eq("referrer_id", userId),
  ]);

  const hasAvatar = Boolean(profile.avatar_path);
  const hasTopup = (topup.count ?? 0) > 0;
  const hasOrder = (order.count ?? 0) > 0;
  const hasReferral = (referral.count ?? 0) > 0;

  const steps: OnboardingStep[] = [
    {
      key: "profile",
      title: t("srv.on.profile.title"),
      description: t("srv.on.profile.desc"),
      href: "/account",
      icon: "UserCircle",
      done: hasAvatar,
    },
    {
      key: "balance",
      title: t("srv.on.balance.title"),
      description: t("srv.on.balance.desc"),
      href: "/wallet",
      icon: "Wallet",
      done: hasTopup,
    },
    {
      key: "order",
      title: t("srv.on.order.title"),
      description: t("srv.on.order.desc"),
      href: "/store",
      icon: "ShoppingBag",
      done: hasOrder,
    },
    {
      key: "referral",
      title: t("srv.on.referral.title"),
      description: t("srv.on.referral.desc"),
      href: "/referral",
      icon: "Gift",
      done: hasReferral,
    },
  ];

  const doneCount = steps.filter((s) => s.done).length;
  return {
    steps,
    doneCount,
    total: steps.length,
    complete: doneCount === steps.length,
  };
}

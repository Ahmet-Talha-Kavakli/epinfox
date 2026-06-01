import type { Metadata } from "next";
import { Gift, UsersThree, CheckCircle, Clock } from "@phosphor-icons/react/dist/ssr";
import { requireMember } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/server";
import { AccountShell } from "@/components/account/account-shell";
import { ReferralShare } from "@/components/account/referral-share";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { UserAvatar } from "@/components/account/user-avatar";
import { formatDate } from "@/lib/utils";
import { getServerT, getServerLocale } from "@/lib/i18n/server";
import { SITE } from "@/config/site";
import type { Referral } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Referans" };

interface ReferredRow extends Referral {
  referred: { nickname: string; avatar_path: string | null } | null;
}

// Her başarılı davette sabit verilen bonus (grant_referral_reward defaultu).
const PER_REFERRAL_BONUS = 25;

// Kademeli ekstra ödüller — grant_referral_milestones RPC ile BİREBİR aynı.
// (threshold → bonus) eşiklerine ulaşan davet eden bir kez ekstra bonus alır.
const TIERS: { count: number; bonus: number; reward: string; vip?: boolean }[] = [
  { count: 3, bonus: 50, reward: "+50₺" },
  { count: 5, bonus: 150, reward: "+150₺" },
  { count: 10, bonus: 300, reward: "+300₺", vip: true },
];

export default async function ReferralPage() {
  const [t, locale] = await Promise.all([getServerT(), getServerLocale()]);
  const current = await requireMember();
  const supabase = await createAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("referral_code")
    .eq("id", current.user.id)
    .maybeSingle();
  const code = (profile?.referral_code as string) ?? "—";
  const inviteLink = `${SITE.url}/sign-up?ref=${code}`;

  const { data: refs } = await supabase
    .from("referrals")
    .select(
      "*, referred:profiles!referrals_referred_id_fkey(nickname, avatar_path)",
    )
    .eq("referrer_id", current.user.id)
    .order("created_at", { ascending: false });
  const referrals = (refs as ReferredRow[]) ?? [];
  const rewardedCount = referrals.filter((r) => r.status === "rewarded").length;

  // Kazanılan kademe (milestone) ödülleri — ayrı tabloda tutulur.
  const { data: milestones } = await supabase
    .from("referral_milestones")
    .select("threshold, bonus")
    .eq("user_id", current.user.id);
  const earnedThresholds = new Set(
    (milestones ?? []).map((m) => Number(m.threshold)),
  );
  const milestoneTotal = (milestones ?? []).reduce(
    (s, m) => s + Number(m.bonus),
    0,
  );

  // Toplam kazanç = her davetin sabit bonusu + kazanılan kademe bonusları
  const perReferralTotal = referrals.reduce(
    (s, r) => s + Number(r.referrer_reward),
    0,
  );
  const totalReward = perReferralTotal + milestoneTotal;

  // Sıradaki kademe
  const nextTier = TIERS.find((tier) => rewardedCount < tier.count);
  const prevTierCount =
    [...TIERS].reverse().find((tier) => rewardedCount >= tier.count)?.count ?? 0;
  const progressPct = nextTier
    ? Math.min(
        100,
        ((rewardedCount - prevTierCount) / (nextTier.count - prevTierCount)) *
          100,
      )
    : 100;

  return (
    <AccountShell
      user={{
        nickname: current.nickname,
        email: current.email,
        avatarPath: current.avatarPath,
      }}
      title={t("p2.referral.title")}
      description={t("p2.referral.description").replace(
        "{bonus}",
        String(PER_REFERRAL_BONUS),
      )}
    >
      {/* Üst: metrik şeridi — tam genişlik, dengeli */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Card className="flex items-center gap-3.5 border-ink-200 p-4 sm:p-5">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-200">
            <UsersThree size={24} weight="duotone" />
          </span>
          <div>
            <p className="text-2xl font-extrabold leading-none text-ink-900">
              {referrals.length}
            </p>
            <p className="mt-1 text-xs text-ink-500">
              {t("p2.referral.totalInvites")}
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-3.5 border-ink-200 p-4 sm:p-5">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-success-50 text-success-600 ring-1 ring-success-200">
            <CheckCircle size={24} weight="duotone" />
          </span>
          <div>
            <p className="text-2xl font-extrabold leading-none text-ink-900">
              {rewardedCount}
            </p>
            <p className="mt-1 text-xs text-ink-500">
              {t("p2.referral.completed")}
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-3.5 border-ink-200 p-4 sm:p-5">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent-50 text-accent-600 ring-1 ring-accent-200">
            <Gift size={24} weight="duotone" />
          </span>
          <div>
            <p className="text-2xl font-extrabold leading-none text-ink-900">
              {new Intl.NumberFormat("tr-TR", {
                style: "currency",
                currency: "TRY",
                maximumFractionDigits: 0,
              }).format(totalReward)}
            </p>
            <p className="mt-1 text-xs text-ink-500">
              {t("p2.referral.totalEarned")}
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Sol: paylaşım */}
        <ReferralShare code={code} link={inviteLink} />

        {/* Sağ: kademeler + nasıl çalışır */}
        <div className="space-y-4">
          {/* Kademeli ilerleme */}
          <Card className="border-ink-200 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink-900">
                {t("p2.referral.tiersTitle")}
              </h2>
              {nextTier ? (
                <span className="text-xs text-ink-500">
                  {t("p2.referral.nextTier").replace(
                    "{n}",
                    String(nextTier.count),
                  )}{" "}
                  <span className="font-semibold text-brand-600">
                    {nextTier.reward}
                  </span>
                </span>
              ) : (
                <span className="text-xs font-medium text-success-600">
                  {t("p2.referral.allTiersDone")}
                </span>
              )}
            </div>

            {/* İlerleme çubuğu */}
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Kademe rozetleri */}
            <div className="mt-4 flex justify-between">
              {TIERS.map((tier) => {
                const earned = earnedThresholds.has(tier.count);
                const reached = rewardedCount >= tier.count;
                return (
                  <div
                    key={tier.count}
                    className="flex flex-col items-center gap-1"
                  >
                    <span
                      className={
                        "grid h-9 w-9 place-items-center rounded-full text-sm font-bold ring-1 " +
                        (earned
                          ? "bg-success-500 text-white ring-success-500"
                          : reached
                            ? "bg-brand-600 text-white ring-brand-600"
                            : "bg-ink-100 text-ink-400 ring-ink-200")
                      }
                    >
                      {earned ? (
                        <CheckCircle size={18} weight="fill" />
                      ) : (
                        tier.count
                      )}
                    </span>
                    <span
                      className={
                        "text-[10px] font-semibold " +
                        (earned ? "text-success-600" : "text-ink-400")
                      }
                    >
                      {tier.reward}
                      {tier.vip ? ` · ${t("p2.referral.vip")}` : ""}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Sonraki kademeye motivasyon */}
            {nextTier && (
              <p className="mt-4 rounded-xl bg-brand-50 px-3 py-2.5 text-center text-xs font-medium text-brand-700">
                {t("p2.referral.motivationPre").replace(
                  "{n}",
                  String(nextTier.count - rewardedCount),
                )}{" "}
                <span className="font-bold">
                  {t("p2.referral.motivationReward").replace(
                    "{reward}",
                    nextTier.reward,
                  )}
                </span>{" "}
                {t("p2.referral.motivationPost")}
              </p>
            )}
          </Card>

          {/* Nasıl çalışır */}
          <Card className="border-ink-200 p-5">
            <h2 className="text-sm font-semibold text-ink-900">
              {t("p2.referral.howTitle")}
            </h2>
            <ol className="mt-4 space-y-3.5 text-sm text-ink-600">
              {[
                t("p2.referral.step1"),
                t("p2.referral.step2"),
                t("p2.referral.step3").replace(
                  "{bonus}",
                  String(PER_REFERRAL_BONUS),
                ),
                t("p2.referral.step4"),
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 rounded-xl bg-ink-50 px-3 py-2.5 text-xs leading-relaxed text-ink-500">
              <span className="font-semibold text-ink-700">
                {t("p2.referral.tierRewardsLabel")}
              </span>{" "}
              {TIERS.map((tier, i) => (
                <span key={tier.count}>
                  {i > 0 ? " · " : ""}
                  {t("p2.referral.tierRewardItem").replace(
                    "{n}",
                    String(tier.count),
                  )}{" "}
                  <span className="font-semibold">{tier.reward}</span>
                  {tier.vip ? ` ${t("p2.referral.vipSuffix")}` : ""}
                </span>
              ))}
              {t("p2.referral.tierRewardsNote").replace(
                "{bonus}",
                String(PER_REFERRAL_BONUS),
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Davet edilenler */}
      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-ink-900">
          {t("p2.referral.invitedTitle")}
        </h2>
        {referrals.length === 0 ? (
          <EmptyState
            title={t("p2.referral.emptyTitle")}
            description={t("p2.referral.emptyDesc")}
          />
        ) : (
          <Card className="divide-y divide-ink-100 border-ink-200">
            {referrals.map((r) => {
              const rewarded = r.status === "rewarded";
              return (
                <div key={r.id} className="flex items-center gap-3 p-4">
                  <UserAvatar
                    name={r.referred?.nickname ?? t("p2.referral.userFallback")}
                    avatarPath={r.referred?.avatar_path ?? null}
                    size={36}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-900">
                      {r.referred?.nickname ?? t("p2.referral.userFallback")}
                    </p>
                    <p className="text-xs text-ink-400">
                      {formatDate(r.created_at, locale)}
                    </p>
                  </div>
                  {rewarded ? (
                    <div className="flex items-center gap-2.5">
                      {Number(r.referrer_reward) > 0 && (
                        <span className="text-sm font-bold text-success-700">
                          +
                          {new Intl.NumberFormat("tr-TR", {
                            style: "currency",
                            currency: "TRY",
                            maximumFractionDigits: 0,
                          }).format(Number(r.referrer_reward))}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2.5 py-1 text-xs font-medium text-success-700">
                        <CheckCircle size={13} weight="fill" />{" "}
                        {t("p2.referral.bonusGranted")}
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 px-2.5 py-1 text-xs font-medium text-warning-700">
                      <Clock size={13} weight="fill" />{" "}
                      {t("p2.referral.awaitingTopup")}
                    </span>
                  )}
                </div>
              );
            })}
          </Card>
        )}
      </div>
    </AccountShell>
  );
}

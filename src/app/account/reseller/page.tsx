import type { Metadata } from "next";
import { Clock } from "@phosphor-icons/react/dist/ssr";
import { requireMember } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/server";
import { getServerT } from "@/lib/i18n/server";
import { AccountShell } from "@/components/account/account-shell";
import { ResellerApplyForm } from "@/components/account/reseller-apply-form";
import {
  ResellerPanel,
  type ResellerStats,
  type WholesaleRow,
} from "@/components/account/reseller-panel";
import { getProducts } from "@/lib/store";
import type { Order, ResellerTier } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Bayi Bilgileri" };

export default async function AccountResellerPage() {
  const current = await requireMember();
  const t = await getServerT();
  const p = current.profile;
  const supabase = await createAdminClient();

  const shellUser = {
    nickname: current.nickname,
    email: current.email,
    avatarPath: current.avatarPath,
  };

  // ── Beklemede ────────────────────────────────────────────────────────────
  if (p.reseller_status === "pending") {
    return (
      <AccountShell
        user={shellUser}
        title={t("acct.reseller.title")}
        description={t("acct.reseller.pending.desc")}
      >
        <div className="rounded-2xl border border-warning-200 bg-warning-50/50 p-8 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white text-warning-600 ring-1 ring-warning-200">
            <Clock size={30} weight="duotone" />
          </span>
          <h2 className="mt-4 text-xl font-bold text-ink-900">
            {t("acct.reseller.pending.title")}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-600">
            {t("acct.reseller.pending.body")}
          </p>
        </div>
      </AccountShell>
    );
  }

  // ── Onaylı bayi → panel ────────────────────────────────────────────────────
  if (p.reseller_status === "approved" && p.reseller_tier) {
    const tier = p.reseller_tier as ResellerTier;
    const discount = Number(p.reseller_discount ?? 0);

    // İstatistikler — gerçek orders verisinden.
    const { data: orderRows } = await supabase
      .from("orders")
      .select("price, created_at, status")
      .eq("user_id", current.user.id);
    const orders = (orderRows as Pick<Order, "price" | "created_at" | "status">[]) ?? [];
    const completed = orders.filter((o) => o.status === "completed");
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const totalRevenue = completed.reduce((s, o) => s + Number(o.price), 0);
    const monthRevenue = completed
      .filter((o) => new Date(o.created_at).getTime() >= monthStart)
      .reduce((s, o) => s + Number(o.price), 0);
    const stats: ResellerStats = {
      orderCount: completed.length,
      monthRevenue,
      totalRevenue,
      estimatedCommission: Math.round((totalRevenue * discount) / 100),
    };

    // Toptan fiyat listesi — ilk ~8 ürün.
    let wholesale: WholesaleRow[] = [];
    try {
      const products = await getProducts({ sort: "popular" });
      wholesale = products.slice(0, 8).map((pr) => {
        const base = pr.minPrice ?? pr.price;
        return {
          name: pr.name,
          price: base,
          resellerPrice: Math.round(base * (1 - discount / 100) * 100) / 100,
        };
      });
    } catch {
      wholesale = [];
    }

    return (
      <AccountShell
        user={shellUser}
        title={t("acct.reseller.panel.title")}
        description={t("acct.reseller.panel.welcome").replace(
          "{store}",
          p.reseller_store ?? current.nickname,
        )}
      >
        <ResellerPanel
          tier={tier}
          discount={discount}
          store={p.reseller_store ?? current.nickname}
          since={p.reseller_since}
          hasApiKey={Boolean(p.reseller_api_key)}
          stats={stats}
          wholesale={wholesale}
        />
      </AccountShell>
    );
  }

  // ── Başvuru yok / reddedildi → form ────────────────────────────────────────
  let rejectReason: string | null = null;
  if (p.reseller_status === "rejected") {
    const { data: lastApp } = await supabase
      .from("reseller_applications")
      .select("reject_reason")
      .eq("user_id", current.user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    rejectReason = (lastApp?.reject_reason as string) ?? null;
  }

  return (
    <AccountShell
      user={shellUser}
      title={t("acct.reseller.title")}
      description={t("acct.reseller.apply.desc")}
    >
      <ResellerApplyForm
        rejected={p.reseller_status === "rejected"}
        rejectReason={rejectReason}
        kycApproved={p.kyc_status === "approved"}
        phoneVerified={p.phone_verified_at != null}
      />
    </AccountShell>
  );
}

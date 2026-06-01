import type { Metadata } from "next";
import Link from "next/link";
import { Plugs, Storefront, ArrowRight, Clock } from "@phosphor-icons/react/dist/ssr";
import { requireMember } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/server";
import { getServerT } from "@/lib/i18n/server";
import { AccountShell } from "@/components/account/account-shell";
import { ApiManager } from "@/components/account/api-manager";
import { Button } from "@/components/ui/button";
import type { WebhookDelivery } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Api Ayarları" };

export default async function AccountApiPage() {
  const current = await requireMember();
  const t = await getServerT();
  const p = current.profile;

  const shellUser = {
    nickname: current.nickname,
    email: current.email,
    avatarPath: current.avatarPath,
  };

  // Aktif bayi → API yöneticisi
  if (p.reseller_status === "approved") {
    const supabase = await createAdminClient();
    const { data: deliveryRows } = await supabase
      .from("webhook_deliveries")
      .select("*")
      .eq("user_id", current.user.id)
      .order("created_at", { ascending: false })
      .limit(20);
    const deliveries = (deliveryRows as WebhookDelivery[]) ?? [];

    return (
      <AccountShell
        user={shellUser}
        title={t("acct.api.title")}
        description={t("acct.api.descActive")}
      >
        <ApiManager
          keyHint={p.reseller_api_key_hint}
          webhook={p.reseller_webhook}
          allowedIps={p.reseller_webhook_ips ?? []}
          deliveries={deliveries}
        />
      </AccountShell>
    );
  }

  // Bayi değil → bayiliğe yönlendir
  const pending = p.reseller_status === "pending";

  return (
    <AccountShell
      user={shellUser}
      title={t("acct.api.title")}
      description={t("acct.api.descLocked")}
    >
      <div className="rounded-2xl border border-ink-200 bg-white p-8 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-200">
          <Plugs size={30} weight="duotone" />
        </span>
        <h2 className="mt-4 text-xl font-bold text-ink-900">
          {t("acct.api.locked.title")}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-600">
          {t("acct.api.locked.descBase")}
          {pending
            ? t("acct.api.locked.descPending")
            : t("acct.api.locked.descApply")}
        </p>

        <div className="mt-5 flex justify-center">
          {pending ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-warning-50 px-4 py-2 text-sm font-semibold text-warning-700">
              <Clock size={16} weight="fill" /> {t("acct.api.locked.reviewing")}
            </span>
          ) : (
            <Button asChild>
              <Link href="/account/reseller">
                <Storefront size={16} weight="duotone" />
                {t("acct.api.locked.applyCta")}
                <ArrowRight size={16} weight="bold" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </AccountShell>
  );
}

import type { Metadata } from "next";
import { requireMember } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/server";
import { getServerT } from "@/lib/i18n/server";
import { AccountShell } from "@/components/account/account-shell";
import { BillingManager } from "@/components/account/billing-manager";
import type { BillingAddress } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Adres ve Fatura Bilgilerim" };

export default async function AccountBillingPage() {
  const current = await requireMember();
  const t = await getServerT();
  const supabase = await createAdminClient();

  const { data } = await supabase
    .from("billing_addresses")
    .select("*")
    .eq("user_id", current.user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  const addresses = (data as BillingAddress[]) ?? [];

  return (
    <AccountShell
      user={{
        nickname: current.nickname,
        email: current.email,
        avatarPath: current.avatarPath,
      }}
      title={t("acct.billing.title")}
      description={t("acct.billing.desc")}
    >
      <BillingManager addresses={addresses} />
    </AccountShell>
  );
}
